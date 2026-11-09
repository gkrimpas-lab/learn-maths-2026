// pages/e-dimotikou/30-epanalipsi-2.js
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

function Fraction({ numerator, denominator, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 text-center font-mono leading-none select-none ${className}`}>
      <span className="px-1 text-[0.9em] border-b-2 border-current pb-0.5 w-full block">
        {numerator}
      </span>
      <span className="px-1 text-[0.9em] pt-0.5 w-full block">
        {denominator}
      </span>
    </span>
  );
}

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

const translations = {
  el: {
    pageTitle: "Επανάληψη 2: Γεωμετρία (Κεφάλαια 13 - 29) - Ε' Δημοτικού | LearnMaths.gr",
    pageDescription: "Μεγάλη επαναληπτική δοκιμασία μαθηματικών Ε' Δημοτικού στη Γεωμετρία (κεφάλαια 13 έως 29): γωνίες, τρίγωνα, κάθετες ευθείες, μήκος κύκλου, πολύγωνα, περίμετρος, εμβαδόν και όγκος.",
    backText: "Ε' Δημοτικού",
    curriculumBtn: "Ύλη",
    badgeHeader: "Ε' ΔΗΜΟΤΙΚΟΥ • ΜΕΓΑΛΗ ΕΠΑΝΑΛΗΨΗ ΓΕΩΜΕΤΡΙΑΣ",
    mainTitle: "📐 Επαναληπτικό Τεστ: Κεφάλαια 13 έως 29",
    subtitle: "34 απαιτητικές ασκήσεις (2 από κάθε κεφάλαιο: γωνίες, τρίγωνα, ευθείες, ύψη, συμμετρία, κύκλος, πολύγωνα, περίμετρος, εμβαδόν και όγκος). Δημιουργούνται δυναμικά από τη δεξαμενή!",
    newQuizBtn: "Νέες Ασκήσεις",
    submitAllBtn: "Έλεγχος Όλων των Απαντήσεων (34)",
    scoreLabel: "Σκορ:",
    successRate: "Επιτυχία:",
    footerPrompt: "Απάντησε και στις 34 ερωτήσεις και πάτα «Έλεγχος Όλων των Απαντήσεων»!",
    correctFeedbackPrefix: "Σωστό:",
    chapterPrefix: "ΚΕΦ."
  },
  en: {
    pageTitle: "Review 2: Geometry (Chapters 13 - 29) - 5th Grade | LearnMaths.gr",
    pageDescription: "Comprehensive geometry review test for 5th Grade (Chapters 13 to 29): angles, triangles, perpendicular lines, circumference, polygons, perimeter, area, and volume.",
    backText: "5th Grade",
    curriculumBtn: "Curriculum",
    badgeHeader: "5TH GRADE • COMPREHENSIVE GEOMETRY REVIEW",
    mainTitle: "📐 Review Test: Chapters 13 to 29",
    subtitle: "34 challenging exercises (2 from each chapter: angles, triangles, lines, heights, symmetry, circles, polygons, perimeter, area, and volume). Dynamically generated from the question pool!",
    newQuizBtn: "New Exercises",
    submitAllBtn: "Check All Answers (34)",
    scoreLabel: "Score:",
    successRate: "Success:",
    footerPrompt: "Answer all 34 questions and click 'Check All Answers'!",
    correctFeedbackPrefix: "Correct:",
    chapterPrefix: "CH."
  }
};

// --- ΔΕΞΑΜΕΝΗ ΓΕΝΝΗΤΡΙΩΝ ΑΣΚΗΣΕΩΝ ΓΙΑ ΤΑ ΓΕΩΜΕΤΡΙΚΑ ΚΕΦΑΛΑΙΑ 13 ΕΩΣ 29 --- //

// ΚΕΦΑΛΑΙΟ 13: Γωνίες
function genCh13(variant, isEn) {
  if (variant === 1) {
    const angleA = [45, 60, 75, 110, 125, 135][getRandomInt(0, 5)];
    const angleB = 180 - angleA;
    return {
      ch: 13,
      title: isEn ? 'CH. 13 • SUPPLEMENTARY ANGLES' : 'ΚΕΦ. 13 • ΠΑΡΑΠΛΗΡΩΜΑΤΙΚΕΣ ΓΩΝΙΕΣ',
      type: 'input',
      correct: angleB,
      unit: isEn ? 'degrees ( ° )' : 'μοίρες ( ° )',
      prompt: isEn
        ? `Two angles are supplementary (their sum is 180°). If one measures ${angleA}°, how many degrees ( ° ) is the other?`
        : `Δύο γωνίες είναι παραπληρωματικές (το άθροισμά τους είναι 180°). Αν η μία είναι ${angleA}°, πόσες μοίρες ( ° ) είναι η άλλη;`,
      explanation: isEn
        ? `Subtract the known angle from 180°: 180° － ${angleA}° ＝ ${angleB}°.`
        : `Αφαιρούμε τη γνωστή γωνία από τις 180°: 180° － ${angleA}° ＝ ${angleB}°.`
    };
  } else {
    const correctEl = 'Αμβλεία γωνία ( μεγαλύτερη από 90° και μικρότερη από 180° )';
    const correctEn = 'Obtuse angle ( greater than 90° and less than 180° )';
    const optionsEl = [
      correctEl,
      'Οξεία γωνία ( μικρότερη από 90° )',
      'Ορθή γωνία ( ακριβώς 90° )',
      'Ευθεία γωνία ( ακριβώς 180° )'
    ];
    const optionsEn = [
      correctEn,
      'Acute angle ( less than 90° )',
      'Right angle ( exactly 90° )',
      'Straight angle ( exactly 180° )'
    ];

    return {
      ch: 13,
      title: isEn ? 'CH. 13 • TYPES OF ANGLES' : 'ΚΕΦ. 13 • ΕΙΔΗ ΓΩΝΙΩΝ',
      type: 'mcq',
      correct: isEn ? correctEn : correctEl,
      options: shuffleArray([...new Set(isEn ? optionsEn : optionsEl)]),
      prompt: isEn ? 'What is an angle measuring 128° called?' : 'Πώς ονομάζεται μια γωνία με μέτρο 128°;',
      explanation: isEn
        ? 'Any angle measuring greater than 90° and less than 180° is classified as an obtuse angle.'
        : 'Κάθε γωνία που είναι μεγαλύτερη από 90° και μικρότερη από 180° ονομάζεται αμβλεία γωνία.'
    };
  }
}

// ΚΕΦΑΛΑΙΟ 14: Τρίγωνα - Γωνίες
function genCh14(variant, isEn) {
  if (variant === 1) {
    const a = [40, 50, 65, 70][getRandomInt(0, 3)];
    const b = [45, 55, 60, 35][getRandomInt(0, 3)];
    const c = 180 - (a + b);
    return {
      ch: 14,
      title: isEn ? 'CH. 14 • TRIANGLE ANGLE SUM' : 'ΚΕΦ. 14 • ΑΘΡΟΙΣΜΑ ΓΩΝΙΩΝ ΤΡΙΓΩΝΟΥ',
      type: 'input',
      correct: c,
      unit: isEn ? 'degrees ( ° )' : 'μοίρες ( ° )',
      prompt: isEn
        ? `In a triangle, two angles measure ${a}° and ${b}°. How many degrees ( ° ) is its third angle?`
        : `Σε ένα τρίγωνο οι δύο γωνίες έχουν μέτρο ${a}° και ${b}°. Πόσες μοίρες ( ° ) είναι η τρίτη γωνία του;`,
      explanation: isEn
        ? `The sum of angles in any triangle is always 180°. Thus: 180° － ( ${a}° ＋ ${b}° ) ＝ 180° － ${a + b}° ＝ ${c}°.`
        : `Το άθροισμα των τριών γωνιών κάθε τριγώνου είναι πάντοτε 180°. Άρα: 180° － ( ${a}° ＋ ${b}° ) ＝ 180° － ${a + b}° ＝ ${c}°.`
    };
  } else {
    const correctEl = 'Έχει μία ορθή γωνία ( 90° ) και δύο οξείες γωνίες';
    const correctEn = 'It has one right angle ( 90° ) and two acute angles';
    const optionsEl = [
      correctEl,
      'Έχει δύο ορθές γωνίες ( 90° )',
      'Έχει όλες τις γωνίες του ίσες με 90°',
      'Έχει μία αμβλεία και μία ορθή γωνία'
    ];
    const optionsEn = [
      correctEn,
      'It has two right angles ( 90° )',
      'All of its angles are equal to 90°',
      'It has one obtuse angle and one right angle'
    ];

    return {
      ch: 14,
      title: isEn ? 'CH. 14 • RIGHT TRIANGLE' : 'ΚΕΦ. 14 • ΟΡΘΟΓΩΝΙΟ ΤΡΙΓΩΝΟ',
      type: 'mcq',
      correct: isEn ? correctEn : correctEl,
      options: shuffleArray([...new Set(isEn ? optionsEn : optionsEl)]),
      prompt: isEn
        ? 'Which of the following statements is CORRECT regarding a right triangle?'
        : 'Ποια από τις παρακάτω προτάσεις είναι ΣΩΣΤΗ για ένα ορθογώνιο τρίγωνο;',
      explanation: isEn
        ? 'A right triangle has exactly one right angle (90°). The other two angles are strictly acute and sum to 90°.'
        : 'Ένα ορθογώνιο τρίγωνο έχει ακριβώς μία ορθή γωνία (90°). Οι άλλες δύο γωνίες του είναι υποχρεωτικά οξείες και έχουν άθροισμα 90°.'
    };
  }
}

// ΚΕΦΑΛΑΙΟ 15: Τρίγωνα - Πλευρές
function genCh15(variant, isEn) {
  if (variant === 1) {
    const side = [7, 9, 12, 14, 16][getRandomInt(0, 4)];
    const perim = 3 * side;
    return {
      ch: 15,
      title: isEn ? 'CH. 15 • EQUILATERAL TRIANGLE' : 'ΚΕΦ. 15 • ΙΣΟΠΛΕΥΡΟ ΤΡΙΓΩΝΟ',
      type: 'input',
      correct: perim,
      unit: isEn ? 'cm (perimeter)' : 'cm (περίμετρος)',
      prompt: isEn
        ? `Each side of an equilateral triangle measures ${side} cm. How many cm is its perimeter?`
        : `Κάθε πλευρά ενός ισόπλευρου τριγώνου έχει μήκος ${side} cm. Πόσα cm είναι η περίμετρός του;`,
      explanation: isEn
        ? `An equilateral triangle has 3 congruent sides: 3 · ${side} ＝ ${perim} cm.`
        : `Το ισόπλευρο τρίγωνο έχει και τις 3 πλευρές του ίσες: 3 · ${side} ＝ ${perim} cm.`
    };
  } else {
    const correctEl = 'Σκαληνό τρίγωνο';
    const correctEn = 'Scalene triangle';
    const optionsEl = ['Σκαληνό τρίγωνο', 'Ισοσκελές τρίγωνο', 'Ισόπλευρο τρίγωνο', 'Κανονικό τρίγωνο'];
    const optionsEn = ['Scalene triangle', 'Isosceles triangle', 'Equilateral triangle', 'Regular triangle'];

    return {
      ch: 15,
      title: isEn ? 'CH. 15 • TRIANGLE CLASSIFICATION BY SIDES' : 'ΚΕΦ. 15 • ΕΙΔΗ ΤΡΙΓΩΝΩΝ ΩΣ ΠΡΟΣ ΤΙΣ ΠΛΕΥΡΕΣ',
      type: 'mcq',
      correct: isEn ? correctEn : correctEl,
      options: shuffleArray([...new Set(isEn ? optionsEn : optionsEl)]),
      prompt: isEn
        ? 'What is a triangle with all three sides of different lengths called?'
        : 'Πώς ονομάζεται το τρίγωνο που έχει και τις τρεις πλευρές του διαφορετικού μήκους μεταξύ τους;',
      explanation: isEn
        ? 'A triangle with 3 unequal sides is called a scalene triangle.'
        : 'Το τρίγωνο με 3 άνισες πλευρές ονομάζεται σκαληνό τρίγωνο.'
    };
  }
}

// ΚΕΦΑΛΑΙΟ 16: Κάθετες - Ευθείες
function genCh16(variant, isEn) {
  if (variant === 1) {
    return {
      ch: 16,
      title: isEn ? 'CH. 16 • PERPENDICULAR LINES ANGLE' : 'ΚΕΦ. 16 • ΓΩΝΙΑ ΚΑΘΕΤΩΝ ΕΥΘΕΙΩΝ',
      type: 'input',
      correct: 90,
      unit: isEn ? 'degrees ( ° )' : 'μοίρες ( ° )',
      prompt: isEn
        ? 'How many degrees ( ° ) is the angle formed between two perpendicular lines?'
        : 'Πόσες μοίρες ( ° ) είναι η γωνία που σχηματίζουν μεταξύ τους δύο κάθετες ευθείες;',
      explanation: isEn
        ? 'Two lines intersect perpendicularly when they form a right angle of exactly 90°.'
        : 'Δύο ευθείες τέμνονται κάθετα όταν σχηματίζουν ακριβώς ορθή γωνία 90°.'
    };
  } else {
    const correctEl = 'Δεν συναντιούνται ποτέ όσο κι αν προεκταθούν και έχουν σταθερή απόσταση';
    const correctEn = 'They never intersect regardless of how far extended and remain at a constant distance';
    const optionsEl = [
      correctEl,
      'Τέμνονται υπό ορθή γωνία 90°',
      'Συναντιούνται σε ακριβώς 2 κοινά σημεία',
      'Σχηματίζουν οξεία γωνία'
    ];
    const optionsEn = [
      correctEn,
      'They intersect at a right angle of 90°',
      'They meet at exactly 2 common points',
      'They form an acute angle'
    ];

    return {
      ch: 16,
      title: isEn ? 'CH. 16 • PARALLEL LINES' : 'ΚΕΦ. 16 • ΠΑΡΑΛΛΗΛΕΣ ΕΥΘΕΙΕΣ',
      type: 'mcq',
      correct: isEn ? correctEn : correctEl,
      options: shuffleArray([...new Set(isEn ? optionsEn : optionsEl)]),
      prompt: isEn
        ? 'What is the key defining property of two parallel lines in a plane?'
        : 'Ποιο είναι το βασικό χαρακτηριστικό δύο παράλληλων ευθειών στο επίπεδο;',
      explanation: isEn
        ? 'Parallel lines are coplanar lines that have no common points and maintain an equal, constant distance between them.'
        : 'Παράλληλες ονομάζονται οι ευθείες του ίδιου επιπέδου που δεν έχουν κανένα κοινό σημείο και διατηρούν σταθερή απόσταση μεταξύ τους.'
    };
  }
}

// ΚΕΦΑΛΑΙΟ 17: Απόσταση Σημείου από Ευθεία
function genCh17(variant, isEn) {
  if (variant === 1) {
    const correctEl = 'Το κάθετο ευθύγραμμο τμήμα από το σημείο προς την ευθεία';
    const correctEn = 'The perpendicular segment from the point to the line';
    const optionsEl = [
      correctEl,
      'Οποιοδήποτε πλάγιο ευθύγραμμο τμήμα',
      'Μια καμπύλη γραμμή που ενώνει το σημείο με την ευθεία',
      'Το διπλάσιο του πλάγιου τμήματος'
    ];
    const optionsEn = [
      correctEn,
      'Any oblique (slanted) segment',
      'A curved line connecting the point to the line',
      'Twice the length of an oblique segment'
    ];

    return {
      ch: 17,
      title: isEn ? 'CH. 17 • SHORTEST DISTANCE' : 'ΚΕΦ. 17 • ΣΥΝΤΟΜΟΤΕΡΗ ΑΠΟΣΤΑΣΗ',
      type: 'mcq',
      correct: isEn ? correctEn : correctEl,
      options: shuffleArray([...new Set(isEn ? optionsEn : optionsEl)]),
      prompt: isEn
        ? 'Which line segment defines the shortest distance from a point to a line?'
        : 'Ποιο τμήμα ορίζει τη συντομότερη απόσταση ενός σημείου από μια ευθεία;',
      explanation: isEn
        ? 'The distance from a point to a line is the length of the perpendicular segment drawn from the point to that line.'
        : 'Η απόσταση σημείου από ευθεία είναι το μήκος του κάθετου ευθύγραμμου τμήματος που άγεται από το σημείο προς την ευθεία.'
    };
  } else {
    const correctEl = 'Το κάθετο τμήμα είναι πάντοτε μικρότερο από κάθε πλάγιο τμήμα';
    const correctEn = 'The perpendicular segment is always shorter than any oblique segment';
    const optionsEl = [
      correctEl,
      'Το κάθετο τμήμα είναι μεγαλύτερο από το πλάγιο τμήμα',
      'Το κάθετο και το πλάγιο τμήμα είναι πάντοτε ίσα',
      'Δεν μπορούμε να συγκρίνουμε τα δύο τμήματα'
    ];
    const optionsEn = [
      correctEn,
      'The perpendicular segment is longer than the oblique segment',
      'Perpendicular and oblique segments are always equal',
      'The two segments cannot be compared'
    ];

    return {
      ch: 17,
      title: isEn ? 'CH. 17 • PERPENDICULAR VS OBLIQUE SEGMENT' : 'ΚΕΦ. 17 • ΚΑΘΕΤΟ VS ΠΛΑΓΙΟ ΤΜΗΜΑ',
      type: 'mcq',
      correct: isEn ? correctEn : correctEl,
      options: shuffleArray([...new Set(isEn ? optionsEn : optionsEl)]),
      prompt: isEn
        ? 'If we draw a perpendicular segment and an oblique segment from a point to a line, what is true about their lengths?'
        : 'Αν φέρουμε από ένα σημείο ένα κάθετο και ένα πλάγιο τμήμα προς μια ευθεία, τι ισχύει για τα μήκη τους;',
      explanation: isEn
        ? 'The perpendicular segment is strictly the shortest path from the point to the line.'
        : 'Το κάθετο τμήμα είναι πάντοτε το μικρότερο σε μήκος (συντομότερη διαδρομή).'
    };
  }
}

// ΚΕΦΑΛΑΙΟ 18: Ύψος Τριγώνου
function genCh18(variant, isEn) {
  if (variant === 1) {
    return {
      ch: 18,
      title: isEn ? 'CH. 18 • NUMBER OF TRIANGLE ALTITUDES' : 'ΚΕΦ. 18 • ΠΛΗΘΟΣ ΥΨΩΝ ΤΡΙΓΩΝΟΥ',
      type: 'input',
      correct: 3,
      unit: isEn ? 'altitudes' : 'ύψη',
      prompt: isEn
        ? 'How many altitudes does every triangle have in total (one from each vertex to the opposite side)?'
        : 'Πόσα ύψη έχει συνολικά κάθε τρίγωνο (ένα από κάθε κορυφή προς την απέναντι πλευρά);',
      explanation: isEn
        ? 'Every triangle has exactly 3 altitudes, corresponding to its 3 vertices.'
        : 'Σε κάθε τρίγωνο αντιστοιχούν ακριβώς 3 ύψη, όσες είναι και οι κορυφές του.'
    };
  } else {
    const correctEl = 'Δύο από τα τρία ύψη πέφτουν έξω από το τρίγωνο ( στην προέκταση των πλευρών )';
    const correctEn = 'Two of the three altitudes fall outside the triangle (on the extensions of the sides)';
    const optionsEl = [
      correctEl,
      'Και τα 3 ύψη βρίσκονται πάντοτε στο εσωτερικό του τριγώνου',
      'Τα ύψη ταυτίζονται με τις πλευρές του τριγώνου',
      'Το αμβλυγώνιο τρίγωνο δεν έχει κανένα ύψος'
    ];
    const optionsEn = [
      correctEn,
      'All 3 altitudes always lie inside the triangle',
      'The altitudes coincide with the sides of the triangle',
      'An obtuse triangle has no altitudes'
    ];

    return {
      ch: 18,
      title: isEn ? 'CH. 18 • OBTUSE TRIANGLE ALTITUDES' : 'ΚΕΦ. 18 • ΥΨΗ ΑΜΒΛΥΓΩΝΙΟΥ ΤΡΙΓΩΝΟΥ',
      type: 'mcq',
      correct: isEn ? correctEn : correctEl,
      options: shuffleArray([...new Set(isEn ? optionsEn : optionsEl)]),
      prompt: isEn
        ? 'What happens to the altitudes in an obtuse triangle?'
        : 'Τι συμβαίνει με τα ύψη σε ένα αμβλυγώνιο τρίγωνο;',
      explanation: isEn
        ? 'In an obtuse triangle, the altitudes originating from the two acute vertices lie externally on the extensions of the opposite sides.'
        : 'Στο αμβλυγώνιο τρίγωνο, τα ύψη που ξεκινούν από τις δύο οξείες κορυφές πέφτουν εξωτερικά, στις προεκτάσεις των απέναντι πλευρών.'
    };
  }
}

// ΚΕΦΑΛΑΙΟ 19: Άξονας Συμμετρίας
function genCh19(variant, isEn) {
  if (variant === 1) {
    return {
      ch: 19,
      title: isEn ? 'CH. 19 • AXES OF SYMMETRY OF A SQUARE' : 'ΚΕΦ. 19 • ΑΞΟΝΕΣ ΣΥΜΜΕΤΡΙΑΣ ΤΕΤΡΑΓΩΝΟΥ',
      type: 'input',
      correct: 4,
      unit: isEn ? 'axes of symmetry' : 'άξονες συμμετρίας',
      prompt: isEn
        ? 'How many axes of symmetry does a square have in total?'
        : 'Πόσους άξονες συμμετρίας έχει συνολικά ένα τετράγωνο;',
      explanation: isEn
        ? 'A square has 4 axes of symmetry: 2 perpendicular bisectors of opposite sides and 2 diagonal lines.'
        : 'Το τετράγωνο έχει 4 άξονες συμμετρίας: τις 2 μεσοκαθέτους των απέναντι πλευρών και τις 2 διαγωνίους του.'
    };
  } else {
    const correctEl = 'Άπειρους άξονες συμμετρίας ( κάθε ευθεία που περνάει από το κέντρο )';
    const correctEn = 'Infinitely many axes (every straight line passing through its center)';
    const optionsEl = [
      correctEl,
      'Μόνο 4 άξονες συμμετρίας',
      'Μόνο 2 άξονες συμμετρίας',
      'Κανέναν άξονα συμμετρίας'
    ];
    const optionsEn = [
      correctEn,
      'Only 4 axes of symmetry',
      'Only 2 axes of symmetry',
      'Zero axes of symmetry'
    ];

    return {
      ch: 19,
      title: isEn ? 'CH. 19 • AXES OF SYMMETRY OF A CIRCLE' : 'ΚΕΦ. 19 • ΑΞΟΝΕΣ ΣΥΜΜΕΤΡΙΑΣ ΚΥΚΛΟΥ',
      type: 'mcq',
      correct: isEn ? correctEn : correctEl,
      options: shuffleArray([...new Set(isEn ? optionsEn : optionsEl)]),
      prompt: isEn
        ? 'How many axes of symmetry does a circle have?'
        : 'Πόσους άξονες συμμετρίας έχει ένας κύκλος;',
      explanation: isEn
        ? 'Every diameter line passing through the center of a circle is an axis of symmetry, meaning a circle has infinitely many axes.'
        : 'Κάθε ευθεία που διέρχεται από το κέντρο του κύκλου (διάμετρος) αποτελεί άξονα συμμετρίας του. Άρα ο κύκλος έχει άπειρους άξονες συμμετρίας.'
    };
  }
}

// ΚΕΦΑΛΑΙΟ 20: Μήκος Κύκλου
function genCh20(variant, isEn) {
  const formatNum = (n) => n.toLocaleString(isEn ? 'en-US' : 'el-GR');

  if (variant === 1) {
    const d = [10, 20, 30][getRandomInt(0, 2)];
    const l = parseFloat((3.14 * d).toFixed(2));
    return {
      ch: 20,
      title: isEn ? 'CH. 20 • CIRCUMFERENCE CALCULATION' : 'ΚΕΦ. 20 • ΥΠΟΛΟΓΙΣΜΟΣ ΜΗΚΟΥΣ ΚΥΚΛΟΥ',
      type: 'input',
      correct: l,
      unit: 'cm',
      prompt: isEn
        ? `A circle has a diameter δ ＝ ${d} cm. How many cm is its circumference ( L ), using π ＝ 3.14?`
        : `Ένας κύκλος έχει διάμετρο δ ＝ ${d} cm. Πόσα cm είναι το μήκος του ( L ), αν χρησιμοποιήσουμε π ＝ 3,14;`,
      explanation: isEn
        ? `Apply the formula L ＝ π · δ: 3.14 · ${d} ＝ ${formatNum(l)} cm.`
        : `Εφαρμόζουμε τον τύπο L ＝ π · δ: 3,14 · ${d} ＝ ${formatNum(l)} cm.`
    };
  } else {
    const correctEl = 'Το πηλίκο του μήκους του κύκλου προς τη διάμετρό του ( L ： δ )';
    const correctEn = 'The ratio of a circle circumference to its diameter ( L : δ )';
    const optionsEl = [
      correctEl,
      'Το γινόμενο της ακτίνας επί τη διάμετρο',
      'Η περίμετρος ενός τετραγώνου',
      'Το μισό της ακτίνας του κύκλου'
    ];
    const optionsEn = [
      correctEn,
      'The product of radius times diameter',
      'The perimeter of a square',
      'Half of the circle radius'
    ];

    return {
      ch: 20,
      title: isEn ? 'CH. 20 • THE CONSTANT π' : 'ΚΕΦ. 20 • ΣΤΑΘΕΡΟΣ ΑΡΙΘΜΟΣ π',
      type: 'mcq',
      correct: isEn ? correctEn : correctEl,
      options: shuffleArray([...new Set(isEn ? optionsEn : optionsEl)]),
      prompt: isEn
        ? 'What does the mathematical constant π ≈ 3.14 represent in geometry?'
        : 'Τι εκφράζει στη γεωμετρία ο σταθερός αριθμός π ≈ 3,14;',
      explanation: isEn
        ? 'Dividing the circumference of any circle by its diameter ( L : δ ) always yields the constant ratio π ≈ 3.14.'
        : 'Σε οποιονδήποτε κύκλο, αν διαιρέσουμε το μήκος του κύκλου με τη διάμετρό του ( L ： δ ), βρίσκουμε πάντοτε τον αριθμό π ≈ 3,14.'
    };
  }
}

// ΚΕΦΑΛΑΙΟ 21: Μονάδες Μέτρησης Μήκους
function genCh21(variant, isEn) {
  const formatNum = (n) => n.toLocaleString(isEn ? 'en-US' : 'el-GR');

  if (variant === 1) {
    const km = 4.5;
    const m = 4500;
    return {
      ch: 21,
      title: isEn ? 'CH. 21 • CONVERTING km TO m' : 'ΚΕΦ. 21 • ΜΕΤΑΤΡΟΠΗ km ΣΕ m',
      type: 'input',
      correct: m,
      unit: 'm',
      prompt: isEn
        ? `Convert the distance of ${formatNum(km)} km to meters ( m ):`
        : `Μετάτρεψε την απόσταση των ${formatNum(km)} km σε μέτρα ( m ):`,
      explanation: isEn
        ? `1 km ＝ 1,000 m. Therefore: ${formatNum(km)} · 1,000 ＝ ${formatNum(m)} m.`
        : `1 km ＝ 1.000 m. Άρα: ${formatNum(km)} · 1.000 ＝ ${formatNum(m)} m.`
    };
  } else {
    const correctEl = 'Διαιρούμε με το 100';
    const correctEn = 'Divide by 100';
    const optionsEl = ['Διαιρούμε με το 100', 'Πολλαπλασιάζουμε με το 100', 'Διαιρούμε με το 10', 'Πολλαπλασιάζουμε με το 1.000'];
    const optionsEn = ['Divide by 100', 'Multiply by 100', 'Divide by 10', 'Multiply by 1,000'];

    return {
      ch: 21,
      title: isEn ? 'CH. 21 • LENGTH SCALE ( cm TO m )' : 'ΚΕΦ. 21 • ΣΚΑΛΑ ΜΗΚΟΥΣ ( cm ΣΕ m )',
      type: 'mcq',
      correct: isEn ? correctEn : correctEl,
      options: shuffleArray([...new Set(isEn ? optionsEn : optionsEl)]),
      prompt: isEn
        ? 'When converting from centimeters ( cm ) to meters ( m ), what mathematical operation do we perform?'
        : 'Όταν μετατρέπουμε από εκατοστά ( cm ) σε μέτρα ( m ), τι μαθηματική πράξη κάνουμε;',
      explanation: isEn
        ? 'We move up 2 steps on the length metric ladder (from smaller to larger unit), so we divide by 100.'
        : 'Ανεβαίνουμε 2 σκαλοπάτια στη σκάλα του μήκους (από μικρότερη σε μεγαλύτερη μονάδα), επομένως διαιρούμε με το 100.'
    };
  }
}

// ΚΕΦΑΛΑΙΟ 22: Πολύγωνα
function genCh22(variant, isEn) {
  if (variant === 1) {
    const s1 = 8;
    const s2 = 12;
    const s3 = 10;
    const s4 = 14;
    const s5 = 11;
    const p = s1 + s2 + s3 + s4 + s5;
    return {
      ch: 22,
      title: isEn ? 'CH. 22 • POLYGON PERIMETER' : 'ΚΕΦ. 22 • ΠΕΡΙΜΕΤΡΟΣ ΠΟΛΥΓΩΝΟΥ',
      type: 'input',
      correct: p,
      unit: 'cm',
      prompt: isEn
        ? `A pentagon has sides of ${s1} cm, ${s2} cm, ${s3} cm, ${s4} cm, and ${s5} cm. How many cm is its perimeter?`
        : `Ένα πεντάγωνο έχει πλευρές ${s1} cm, ${s2} cm, ${s3} cm, ${s4} cm και ${s5} cm. Πόσα cm είναι η περίμετρός του;`,
      explanation: isEn
        ? `Add the lengths of all outer boundary sides: ${s1} ＋ ${s2} ＋ ${s3} ＋ ${s4} ＋ ${s5} ＝ ${p} cm.`
        : `Προσθέτουμε τα μήκη όλων των πλευρών: ${s1} ＋ ${s2} ＋ ${s3} ＋ ${s4} ＋ ${s5} ＝ ${p} cm.`
    };
  } else {
    const correctEl = '0 διαγώνιους';
    const correctEn = '0 diagonals';
    const optionsEl = ['0 διαγώνιους', '1 διαγώνιο', '3 διαγώνιους', '2 διαγώνιους'];
    const optionsEn = ['0 diagonals', '1 diagonal', '3 diagonals', '2 diagonals'];

    return {
      ch: 22,
      title: isEn ? 'CH. 22 • TRIANGLE DIAGONALS' : 'ΚΕΦ. 22 • ΔΙΑΓΩΝΙΟΙ ΤΡΙΓΩΝΟΥ',
      type: 'mcq',
      correct: isEn ? correctEn : correctEl,
      options: shuffleArray([...new Set(isEn ? optionsEn : optionsEl)]),
      prompt: isEn
        ? 'How many diagonals (line segments connecting non-consecutive vertices) does a triangle have in total?'
        : 'Πόσες διαγωνίους (ευθύγραμμα τμήματα που ενώνουν μη διαδοχικές κορυφές) έχει συνολικά ένα τρίγωνο;',
      explanation: isEn
        ? 'In a triangle, all vertices are consecutive to one another; therefore, it has exactly 0 diagonals.'
        : 'Στο τρίγωνο όλες οι κορυφές είναι διαδοχικές μεταξύ τους, επομένως έχει ακριβώς 0 διαγωνίους.'
    };
  }
}

// ΚΕΦΑΛΑΙΟ 23: Κανονικά Πολύγωνα
function genCh23(variant, isEn) {
  if (variant === 1) {
    return {
      ch: 23,
      title: isEn ? 'CH. 23 • CENTRAL ANGLE OF A HEXAGON' : 'ΚΕΦ. 23 • ΚΕΝΤΡΙΚΗ ΓΩΝΙΑ ΕΞΑΓΩΝΟΥ',
      type: 'input',
      correct: 60,
      unit: isEn ? 'degrees ( ° )' : 'μοίρες ( ° )',
      prompt: isEn
        ? 'How many degrees ( ° ) is the central angle of a regular hexagon ( 6 equal sides )?'
        : 'Πόσες μοίρες ( ° ) είναι η κεντρική γωνία ενός κανονικού εξαγώνου ( 6 ίσες πλευρές );',
      explanation: isEn
        ? 'Divide the full 360° circle by the number of congruent sides: 360° ： 6 ＝ 60°.'
        : 'Διαιρούμε τον πλήρη κύκλο των 360° με το πλήθος των πλευρών: 360° ： 6 ＝ 60°.'
    };
  } else {
    const correctEl = 'Έχει όλες τις πλευρές του ίσες ΚΑΙ όλες τις γωνίες του ίσες';
    const correctEn = 'It has all sides equal AND all interior angles equal';
    const optionsEl = [
      correctEl,
      'Έχει μόνο όλες τις γωνίες του ίσες με 90°',
      'Έχει άρτιο αριθμό πλευρών',
      'Έχει περίμετρο μεγαλύτερη από 100 cm'
    ];
    const optionsEn = [
      correctEn,
      'It only has all angles equal to 90°',
      'It has an even number of sides',
      'Its perimeter is greater than 100 cm'
    ];

    return {
      ch: 23,
      title: isEn ? 'CH. 23 • DEFINITION OF REGULAR POLYGON' : 'ΚΕΦ. 23 • ΟΡΙΣΜΟΣ ΚΑΝΟΝΙΚΟΥ ΠΟΛΥΓΩΝΟΥ',
      type: 'mcq',
      correct: isEn ? correctEn : correctEl,
      options: shuffleArray([...new Set(isEn ? optionsEn : optionsEl)]),
      prompt: isEn
        ? 'When is a polygon classified as REGULAR?'
        : 'Πότε ένα πολύγωνο χαρακτηρίζεται ως ΚΑΝΟΝΙΚΟ;',
      explanation: isEn
        ? 'A polygon is regular if and only if it is both equilateral (all sides congruent) and equiangular (all angles congruent).'
        : 'Ένα πολύγωνο ονομάζεται κανονικό μόνο όταν είναι ταυτόχρονα ισόπλευρο (όλες οι πλευρές ίσες) και ισογώνιο (όλες οι γωνίες ίσες).'
    };
  }
}

// ΚΕΦΑΛΑΙΟ 24: Περίμετρος
function genCh24(variant, isEn) {
  if (variant === 1) {
    const l = 20;
    const w = 15;
    const p = 2 * (l + w);
    return {
      ch: 24,
      title: isEn ? 'CH. 24 • RECTANGLE PERIMETER' : 'ΚΕΦ. 24 • ΠΕΡΙΜΕΤΡΟΣ ΟΡΘΟΓΩΝΙΟΥ',
      type: 'input',
      correct: p,
      unit: 'm',
      prompt: isEn
        ? `A rectangular plot of land has a length of ${l} m and a width of ${w} m. How many meters ( m ) is its perimeter?`
        : `Ένα ορθογώνιο οικόπεδο έχει μήκος ${l} m και πλάτος ${w} m. Πόσα μέτρα ( m ) είναι η περίμετρός του;`,
      explanation: isEn
        ? `P ＝ 2 · ( Length ＋ Width ) ＝ 2 · ( ${l} ＋ ${w} ) ＝ 2 · ${l + w} ＝ ${p} m.`
        : `Π ＝ 2 · ( Μήκος ＋ Πλάτος ) ＝ 2 · ( ${l} ＋ ${w} ) ＝ 2 · ${l + w} ＝ ${p} m.`
    };
  } else {
    const correct = '12 cm';
    const options = shuffleArray(['12 cm', '24 cm', '8 cm', '16 cm']);
    return {
      ch: 24,
      title: isEn ? 'CH. 24 • SQUARE SIDE FROM PERIMETER' : 'ΚΕΦ. 24 • ΠΛΕΥΡΑ ΤΕΤΡΑΓΩΝΟΥ ΑΠΟ ΠΕΡΙΜΕΤΡΟ',
      type: 'mcq',
      correct,
      options,
      prompt: isEn
        ? 'The perimeter of a square is 48 cm. What is the length of each of its sides?'
        : 'Η περίμετρος ενός τετραγώνου είναι 48 cm. Πόσο είναι το μήκος της κάθε πλευράς του;',
      explanation: isEn
        ? 'Because a square has 4 congruent sides: 48 ： 4 ＝ 12 cm.'
        : 'Επειδή το τετράγωνο έχει 4 ίσες πλευρές: 48 ： 4 ＝ 12 cm.'
    };
  }
}

// ΚΕΦΑΛΑΙΟ 25: Εμβαδό
function genCh25(variant, isEn) {
  if (variant === 1) {
    const l = 9;
    const w = 7;
    const a = l * w;
    return {
      ch: 25,
      title: isEn ? 'CH. 25 • RECTANGLE AREA' : 'ΚΕΦ. 25 • ΕΜΒΑΔΟΝ ΟΡΘΟΓΩΝΙΟΥ',
      type: 'input',
      correct: a,
      unit: 'cm²',
      prompt: isEn
        ? `How many cm² is the area of a rectangle with length ${l} cm and width ${w} cm?`
        : `Πόσα cm² είναι το εμβαδόν ενός ορθογωνίου με μήκος ${l} cm και πλάτος ${w} cm;`,
      explanation: isEn
        ? `Area ＝ Length · Width ＝ ${l} · ${w} ＝ ${a} cm².`
        : `Εμβαδόν ＝ Μήκος · Πλάτος ＝ ${l} · ${w} ＝ ${a} cm².`
    };
  } else {
    const correctEl = 'Το μέγεθος της επίπεδης επιφάνειας που περικλείεται μέσα στο σχήμα';
    const correctEn = 'The extent of the flat 2D surface enclosed within the boundary of the figure';
    const optionsEl = [
      correctEl,
      'Το μήκος του περιγράμματος γύρω-γύρω από το σχήμα',
      'Το βάρος του γεωμετρικού σχήματος',
      'Ο αριθμός των κορυφών του πολυγώνου'
    ];
    const optionsEn = [
      correctEn,
      'The length of the boundary line around the shape',
      'The physical weight of the geometric figure',
      'The number of vertices of the polygon'
    ];

    return {
      ch: 25,
      title: isEn ? 'CH. 25 • CONCEPT OF AREA' : 'ΚΕΦ. 25 • ΕΝΝΟΙΑ ΤΟΥ ΕΜΒΑΔΟΥ',
      type: 'mcq',
      correct: isEn ? correctEn : correctEl,
      options: shuffleArray([...new Set(isEn ? optionsEn : optionsEl)]),
      prompt: isEn
        ? 'What does the AREA of a geometric figure represent?'
        : 'Τι εκφράζει το ΕΜΒΑΔΟΝ ενός γεωμετρικού σχήματος;',
      explanation: isEn
        ? 'Area measures the extent of the 2D surface enclosed within the shape (unlike perimeter, which measures the boundary length).'
        : 'Το εμβαδόν εκφράζει το μέγεθος της εσωτερικής επίπεδης επιφάνειας που κλείνεται μέσα στα όρια του σχήματος (σε αντίθεση με την περίμετρο που μετράει το μήκος γύρω-γύρω).'
    };
  }
}

// ΚΕΦΑΛΑΙΟ 26: Εμβαδό Σχημάτων
function genCh26(variant, isEn) {
  if (variant === 1) {
    const b = 10;
    const h = 6;
    const a = (b * h) / 2;
    return {
      ch: 26,
      title: isEn ? 'CH. 26 • RIGHT TRIANGLE AREA' : 'ΚΕΦ. 26 • ΕΜΒΑΔΟΝ ΟΡΘΟΓΩΝΙΟΥ ΤΡΙΓΩΝΟΥ',
      type: 'input',
      correct: a,
      unit: 'cm²',
      prompt: isEn
        ? `A right triangle has perpendicular legs with lengths of ${b} cm and ${h} cm. How many cm² is its area?`
        : `Ένα ορθογώνιο τρίγωνο έχει κάθετες πλευρές μήκους ${b} cm και ${h} cm. Πόσα cm² είναι το εμβαδόν του;`,
      explanation: isEn ? (
        <span className="inline font-mono leading-relaxed">
          <span className="block mb-1">
            Triangle Area ＝ <Fraction numerator="Base · Height" denominator="2" />
          </span>
          <span className="inline-flex flex-wrap items-center gap-1.5">
            <span>＝</span>
            <Fraction numerator={`${b} · ${h}`} denominator="2" />
            <span>＝</span>
            <Fraction numerator={b * h} denominator="2" />
            <span>＝</span>
            <strong className="text-emerald-900">{a} cm²</strong>
          </span>.
        </span>
      ) : (
        <span className="inline font-mono leading-relaxed">
          <span className="block mb-1">
            Εμβαδόν Τριγώνου ＝ <Fraction numerator="Βάση · Ύψος" denominator="2" />
          </span>
          <span className="inline-flex flex-wrap items-center gap-1.5">
            <span>＝</span>
            <Fraction numerator={`${b} · ${h}`} denominator="2" />
            <span>＝</span>
            <Fraction numerator={b * h} denominator="2" />
            <span>＝</span>
            <strong className="text-emerald-900">{a} cm²</strong>
          </span>.
        </span>
      )
    };
  } else {
    const correctEl = 'Είναι ακριβώς το μισό του ορθογωνίου ( : 2 )';
    const correctEn = 'It is exactly half that of the rectangle ( : 2 )';
    const optionsEl = [
      correctEl,
      'Είναι διπλάσιο από το ορθογώνιο ( · 2 )',
      'Είναι ίσο με το ορθογώνιο',
      'Είναι το ένα τρίτο του ορθογωνίου ( : 3 )'
    ];
    const optionsEn = [
      correctEn,
      'It is twice that of the rectangle ( · 2 )',
      'It is equal to that of the rectangle',
      'It is one third that of the rectangle ( : 3 )'
    ];

    return {
      ch: 26,
      title: isEn ? 'CH. 26 • TRIANGLE TO RECTANGLE RELATION' : 'ΚΕΦ. 26 • ΣΧΕΣΗ ΤΡΙΓΩΝΟΥ ΜΕ ΟΡΘΟΓΩΝΙΟ',
      type: 'mcq',
      correct: isEn ? correctEn : correctEl,
      options: shuffleArray([...new Set(isEn ? optionsEn : optionsEl)]),
      prompt: isEn
        ? 'What is the relationship between the area of a right triangle and a rectangle of the same dimensions?'
        : 'Ποια σχέση έχει το εμβαδόν ενός ορθογώνιου τριγώνου με το εμβαδόν ενός ορθογωνίου που έχει τις ίδιες διαστάσεις;',
      explanation: isEn
        ? 'A rectangle diagonal splits it into two congruent right triangles, which is why the triangle area is strictly half.'
        : 'Η διαγώνιος του ορθογωνίου το χωρίζει σε δύο ίσα ορθογώνια τρίγωνα, γι\' αυτό το εμβαδόν του τριγώνου είναι πάντοτε το μισό.'
    };
  }
}

// ΚΕΦΑΛΑΙΟ 27: Μονάδες Μέτρησης Επιφάνειας
function genCh27(variant, isEn) {
  const formatNum = (n) => n.toLocaleString(isEn ? 'en-US' : 'el-GR');

  if (variant === 1) {
    const m2 = 3.5;
    const dm2 = 350;
    return {
      ch: 27,
      title: isEn ? 'CH. 27 • CONVERTING m² TO dm²' : 'ΚΕΦ. 27 • ΜΕΤΑΤΡΟΠΗ m² ΣΕ dm²',
      type: 'input',
      correct: dm2,
      unit: 'dm²',
      prompt: isEn
        ? `Convert the surface area of ${formatNum(m2)} m² to square decimeters ( dm² ):`
        : `Μετάτρεψε την επιφάνεια των ${formatNum(m2)} m² σε τετραγωνικά δεκατόμετρα ( dm² ):`,
      explanation: isEn
        ? `In area units, each step equals 100. Thus: ${formatNum(m2)} · 100 ＝ ${formatNum(dm2)} dm².`
        : `Στις μονάδες επιφάνειας κάθε σκαλοπάτι αξίζει 100. Άρα: ${formatNum(m2)} · 100 ＝ ${formatNum(dm2)} dm².`
    };
  } else {
    const correctEl = '1.000 m²';
    const correctEn = '1,000 m²';
    const rawOptions = isEn ? [correctEn, '100 m²', '10,000 m²', '100,000 m²'] : [correctEl, '100 m²', '10.000 m²', '100.000 m²'];

    return {
      ch: 27,
      title: isEn ? 'CH. 27 • STREMMATA TO m²' : 'ΚΕΦ. 27 • ΣΤΡΕΜΜΑΤΑ ΣΕ m²',
      type: 'mcq',
      correct: isEn ? correctEn : correctEl,
      options: shuffleArray([...new Set(rawOptions)]),
      prompt: isEn
        ? 'How many square meters ( m² ) are there in exactly 1 stremma (decare)?'
        : 'Σε πόσα τετραγωνικά μέτρα ( m² ) ισοδυναμεί ακριβώς 1 στρέμμα;',
      explanation: isEn
        ? '1 stremma (decare) ＝ 1,000 m².'
        : '1 στρέμμα ＝ 1.000 m².'
    };
  }
}

// ΚΕΦΑΛΑΙΟ 28: Όγκος
function genCh28(variant, isEn) {
  if (variant === 1) {
    const l = 6;
    const w = 5;
    const h = 4;
    const v = l * w * h;
    return {
      ch: 28,
      title: isEn ? 'CH. 28 • BOX VOLUME CALCULATION' : 'ΚΕΦ. 28 • ΥΠΟΛΟΓΙΣΜΟΣ ΟΓΚΟΥ ΚΟΥΤΙΟΥ',
      type: 'input',
      correct: v,
      unit: 'cm³',
      prompt: isEn
        ? `A box has a length of ${l} cm, a width of ${w} cm, and a height of ${h} cm. How many cm³ is its volume?`
        : `Ένα κουτί έχει μήκος ${l} cm, πλάτος ${w} cm και ύψος ${h} cm. Πόσα cm³ είναι ο όγκος του;`,
      explanation: isEn
        ? `Volume ＝ Length · Width · Height ＝ ${l} · ${w} · ${h} ＝ ${v} cm³.`
        : `Όγκος ＝ Μήκος · Πλάτος · Ύψος ＝ ${l} · ${w} · ${h} ＝ ${v} cm³.`
    };
  } else {
    const correctEl = '1 dm³ ( κυβικό δεκατόμετρο )';
    const correctEn = '1 dm³ ( cubic decimeter )';
    const rawOptions = isEn
      ? [
          correctEn,
          '1 cm³ ( cubic centimeter )',
          '1 m³ ( cubic meter )',
          '10 dm³'
        ]
      : [
          correctEl,
          '1 cm³ ( κυβικό εκατοστό )',
          '1 m³ ( κυβικό μέτρο )',
          '10 dm³'
        ];

    return {
      ch: 28,
      title: isEn ? 'CH. 28 • LIQUID CAPACITY IN LITERS' : 'ΚΕΦ. 28 • ΧΩΡΗΤΙΚΟΤΗΤΑ ΣΕ ΛΙΤΡΑ',
      type: 'mcq',
      correct: isEn ? correctEn : correctEl,
      options: shuffleArray([...new Set(rawOptions)]),
      prompt: isEn
        ? 'Which cubic volume unit corresponds exactly to 1 liter ( 1 l ) of liquid?'
        : 'Σε ποια κυβική μονάδα όγκου ισοδυναμεί ακριβώς 1 λίτρο ( 1 l ) υγρού;',
      explanation: isEn
        ? '1 liter equals exactly 1 cubic decimeter ( 1 dm³ ＝ 1,000 cm³ ).'
        : '1 λίτρο ισούται ακριβώς με 1 κυβικό δεκατόμετρο ( 1 dm³ ＝ 1.000 cm³ ).'
    };
  }
}

// ΚΕΦΑΛΑΙΟ 29: Όγκοι Σχημάτων
function genCh29(variant, isEn) {
  if (variant === 1) {
    const a = 5;
    const v = a * a * a;
    return {
      ch: 29,
      title: isEn ? 'CH. 29 • CUBE VOLUME' : 'ΚΕΦ. 29 • ΟΓΚΟΣ ΚΥΒΟΥ',
      type: 'input',
      correct: v,
      unit: 'cm³',
      prompt: isEn
        ? `A cube has an edge length of ${a} cm. How many cm³ is its volume?`
        : `Ένας κύβος έχει ακμή μήκους ${a} cm. Πόσα cm³ είναι ο όγκος του;`,
      explanation: isEn
        ? `V ＝ a · a · a ＝ ${a} · ${a} · ${a} ＝ ${v} cm³.`
        : `V ＝ α · α · α ＝ ${a} · ${a} · ${a} ＝ ${v} cm³.`
    };
  } else {
    const correctEl = 'Η πυραμίδα έχει το ένα τρίτο του όγκου του πρίσματος ( : 3 )';
    const correctEn = 'The pyramid has one third the volume of the prism ( : 3 )';
    const optionsEl = [
      correctEl,
      'Η πυραμίδα έχει τον μισό όγκο του πρίσματος ( : 2 )',
      'Έχουν ακριβώς τον ίδιο όγκο',
      'Η πυραμίδα έχει τριπλάσιο όγκο από το πρίσμα'
    ];
    const optionsEn = [
      correctEn,
      'The pyramid has half the volume of the prism ( : 2 )',
      'They have the exact same volume',
      'The pyramid has three times the volume of the prism'
    ];

    return {
      ch: 29,
      title: isEn ? 'CH. 29 • PRISM AND PYRAMID RELATION' : 'ΚΕΦ. 29 • ΣΧΕΣΗ ΠΡΙΣΜΑΤΟΣ ΚΑΙ ΠΥΡΑΜΙΔΑΣ',
      type: 'mcq',
      correct: isEn ? correctEn : correctEl,
      options: shuffleArray([...new Set(isEn ? optionsEn : optionsEl)]),
      prompt: isEn
        ? 'What is the relationship between the volume of a pyramid and a prism with identical base and height?'
        : 'Ποια σχέση έχει ο όγκος μιας πυραμίδας με τον όγκο ενός πρίσματος που έχει την ίδια βάση και το ίδιο ύψος;',
      explanation: isEn ? (
        <span className="inline font-mono leading-relaxed">
          The volume of a pyramid equals{' '}
          <Fraction numerator="1" denominator="3" />
          {' '}of the volume of the corresponding prism with identical base and height.
        </span>
      ) : (
        <span className="inline font-mono leading-relaxed">
          Ο όγκος της πυραμίδας (όπως και του κώνου) ισούται με το{' '}
          <Fraction numerator="1" denominator="3" />
          {' '}του όγκου του αντίστοιχου πρίσματος (ή κυλίνδρου).
        </span>
      )
    };
  }
}

function generateAllQuestions(isEn) {
  const generators = [
    genCh13, genCh14, genCh15, genCh16, genCh17,
    genCh18, genCh19, genCh20, genCh21, genCh22,
    genCh23, genCh24, genCh25, genCh26, genCh27,
    genCh28, genCh29
  ];

  const qMap = {};
  generators.forEach((gen, idx) => {
    const chNum = 13 + idx;
    qMap[`q_${chNum}_1`] = gen(1, isEn);
    qMap[`q_${chNum}_2`] = gen(2, isEn);
  });

  return qMap;
}

export default function Epanalipsi2Page() {
  const router = useRouter();
  const currentLocale = router?.locale === 'en' ? 'en' : 'el';
  const isEn = currentLocale === 'en';
  const t = translations[currentLocale];

  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewQuiz = () => {
    const newQ = generateAllQuestions(isEn);
    setQuestions(newQ);
    const initialAns = {};
    Object.keys(newQ).forEach((k) => {
      initialAns[k] = '';
    });
    setAnswers(initialAns);
    setSubmitted(false);
    setScore(0);
  };

  useEffect(() => {
    loadNewQuiz();
  }, [currentLocale]);

  if (!questions) return null;

  const handleStrictNumberInput = (key, rawVal) => {
    if (submitted) return;
    let clean = rawVal.replace(/\./g, ',').replace(/[^0-9,]/g, '');
    const parts = clean.split(',');
    if (parts.length > 2) {
      clean = parts[0] + ',' + parts.slice(1).join('');
    }
    if (clean.length > 10) {
      clean = clean.slice(0, 10);
    }
    setAnswers((prev) => ({ ...prev, [key]: clean }));
  };

  const handleMcqSelect = (key, val) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [key]: val }));
  };

  const parseUserFloat = (val) => {
    if (!val || val === ',') return NaN;
    return parseFloat(val.replace(',', '.'));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted) return;

    let currentScore = 0;
    Object.keys(questions).forEach((key) => {
      const q = questions[key];
      if (q.type === 'input') {
        const uVal = parseUserFloat(answers[key]);
        if (!isNaN(uVal) && Math.abs(uVal - q.correct) < 0.05) {
          currentScore += 1;
        }
      } else {
        if (answers[key] === q.correct) {
          currentScore += 1;
        }
      }
    });

    setScore(currentScore);
    setSubmitted(true);
  };

  const totalQuestions = Object.keys(questions).length; // 34

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDescription}
      backUrl="/e-dimotikou"
      backText={t.backText}
      hideFooter={true}
      actionButton={
        <Link
          href="/e-dimotikou"
          className="bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl text-sm 2xl:text-base transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📚</span> {t.curriculumBtn}
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        
        {/* HEADER BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-14 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 max-w-4xl">
            <span className="bg-white/10 border border-white/20 text-sky-200 text-xs 2xl:text-sm font-black px-3.5 py-1.5 rounded-full tracking-wider inline-block">
              {toCleanUppercase(t.badgeHeader)}
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight pt-1 break-words [overflow-wrap:anywhere]">
              {t.mainTitle}
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={loadNewQuiz}
            className="bg-amber-400 text-slate-950 font-black px-5 py-3 sm:px-7 sm:py-4 rounded-2xl shadow-lg hover:bg-amber-300 transition active:scale-95 text-sm sm:text-base whitespace-nowrap shrink-0 self-stretch md:self-auto text-center cursor-pointer"
          >
            🔄 {t.newQuizBtn}
          </button>
        </section>

        {/* ΦΟΡΜΑ 34 ΑΣΚΗΣΕΩΝ ΟΜΑΔΟΠΟΙΗΜΕΝΩΝ ΑΝΑ ΚΕΦΑΛΑΙΟ */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {Array.from({ length: 17 }).map((_, i) => {
            const chNum = 13 + i;
            const k1 = `q_${chNum}_1`;
            const k2 = `q_${chNum}_2`;
            const q1 = questions[k1];
            const q2 = questions[k2];

            return (
              <div key={chNum} className="space-y-4 bg-slate-50 p-4 sm:p-6 2xl:p-8 rounded-3xl border border-slate-200 min-w-0">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                  <span className="bg-blue-600 text-white font-mono font-black text-xs px-2.5 py-1 rounded-lg shrink-0">
                    {t.chapterPrefix} {chNum}
                  </span>
                  <h2 className="text-sm sm:text-base font-black text-slate-800 uppercase tracking-wide break-words [overflow-wrap:anywhere]">
                    {toCleanUppercase(q1.title.split('•')[1]?.trim() || `${t.chapterPrefix} ${chNum}`)}
                  </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {renderQuestionCard(k1, q1, i * 2 + 1, answers, submitted, handleStrictNumberInput, handleMcqSelect, parseUserFloat, isEn, t)}
                  {renderQuestionCard(k2, q2, i * 2 + 2, answers, submitted, handleStrictNumberInput, handleMcqSelect, parseUserFloat, isEn, t)}
                </div>
              </div>
            );
          })}

          {!submitted && (
            <div className="text-center pt-6">
              <button
                type="submit"
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white text-base sm:text-xl font-black px-12 py-4 sm:py-5 rounded-2xl shadow-xl transition transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                🎯 {t.submitAllBtn}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* FIXED BOTTOM SCORE BAR */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6 2xl:py-5">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 2xl:px-5 2xl:py-2 rounded-xl text-base sm:text-lg 2xl:text-xl flex items-center gap-2 shadow-sm">
              <span>🏆 {t.scoreLabel}</span>
              <span className="text-xl sm:text-2xl 2xl:text-3xl font-mono">{score} / {totalQuestions}</span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm 2xl:text-base font-bold text-slate-300">
                {t.successRate} <span className="text-emerald-400 font-black">{Math.round((score / totalQuestions) * 100)}%</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                type="button"
                onClick={loadNewQuiz}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2 2xl:px-7 2xl:py-2.5 rounded-xl shadow-md transition text-xs sm:text-sm 2xl:text-base flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <span>🔄</span> {t.newQuizBtn}
              </button>
            ) : (
              <p className="text-xs 2xl:text-sm text-slate-400 hidden sm:block">
                {t.footerPrompt}
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

function renderQuestionCard(key, qData, numIdx, answers, submitted, handleStrictNumberInput, handleMcqSelect, parseUserFloat, isEn, t) {
  let isCorrect = false;
  if (submitted) {
    if (qData.type === 'input') {
      const uVal = parseUserFloat(answers[key]);
      isCorrect = !isNaN(uVal) && Math.abs(uVal - qData.correct) < 0.05;
    } else {
      isCorrect = answers[key] === qData.correct;
    }
  }

  return (
    <div
      className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between min-w-0 ${
        submitted
          ? isCorrect
            ? 'border-emerald-500 bg-emerald-50/25'
            : 'border-rose-400 bg-rose-50/25'
          : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
      }`}
    >
      <div className="space-y-3">
        <div className="flex items-start gap-2.5">
          <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-indigo-600 text-white font-mono font-black text-xs shrink-0 flex items-center justify-center">
            {numIdx}
          </span>
          <h3 className="text-xs sm:text-sm 2xl:text-base font-bold text-slate-900 leading-snug break-words [overflow-wrap:anywhere]">
            {qData.prompt}
          </h3>
        </div>

        {/* INPUT TYPE */}
        {qData.type === 'input' ? (
          <div className="flex items-center gap-2.5 pl-8 sm:pl-9">
            <input
              type="text"
              inputMode="decimal"
              autoComplete="off"
              maxLength={10}
              placeholder="?"
              value={answers[key] || ''}
              onChange={(e) => handleStrictNumberInput(key, e.target.value)}
              disabled={submitted}
              className="w-28 sm:w-36 h-10 sm:h-11 text-center rounded-xl border-2 border-slate-300 font-mono text-base font-black focus:border-indigo-600 focus:outline-none bg-slate-50/60 focus:bg-white text-slate-900 disabled:opacity-80"
            />
            <span className="text-xs sm:text-sm font-semibold text-slate-600">
              {qData.unit}
            </span>
          </div>
        ) : (
          /* MCQ TYPE */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-8 sm:pl-9">
            {qData.options.map((opt, oIdx) => {
              const isSelected = answers[key] === opt;
              return (
                <label
                  key={oIdx}
                  className={`flex items-start gap-2 p-2.5 rounded-xl border cursor-pointer text-xs sm:text-sm font-mono font-bold select-none transition ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  } ${submitted ? 'pointer-events-none' : ''}`}
                >
                  <input
                    type="radio"
                    name={key}
                    value={opt}
                    checked={isSelected}
                    onChange={() => handleMcqSelect(key, opt)}
                    disabled={submitted}
                    className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5"
                  />
                  <span className="break-words whitespace-normal leading-snug flex-1">{opt}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {submitted && (
        <div className="mt-3 pl-8 sm:pl-9 text-xs leading-relaxed font-mono">
          {isCorrect ? (
            <div className="text-emerald-800 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
              {qData.explanation}
            </div>
          ) : (
            <div className="text-rose-800 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200">
              {t.correctFeedbackPrefix}{' '}
              <strong className="text-rose-950">
                {typeof qData.correct === 'number'
                  ? qData.correct.toLocaleString(isEn ? 'en-US' : 'el-GR')
                  : qData.correct}
              </strong>
              . {qData.explanation}
            </div>
          )}
        </div>
      )}
    </div>
  );
}