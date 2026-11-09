// pages/d-dimotikou/18-simmetria-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(Δ')/g);
  return parts
    .map((part) => {
      if (part === "Δ'") return "Δ'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNum(num, locale) {
  if (typeof num !== 'number') return num;
  return locale === 'en' ? num.toLocaleString('en-US') : num.toLocaleString('el-GR');
}

const translations = {
  el: {
    metaTitle: 'Ασκήσεις: Συμμετρία και Άξονες | LearnMaths.gr',
    metaDesc:
      "Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού στη συμμετρία: αναγνώριση πλήθους αξόνων από σχήμα, υπολογισμός περιμέτρου και εμβαδού συμμετρικών μερών.",
    backText: "Δ' Δημοτικού",
    theoryBtn: 'Θεωρία',
    badge: "Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    title: '📝 Ασκήσεις: Η Έννοια της Συμμετρίας',
    subtitle: 'Πατώντας «Νέες Ασκήσεις», τα σχήματα και οι αριθμοί ανανεώνονται αυτόματα από τη δεξαμενή!',
    newQuestionsBtn: '🔄 Νέες Ασκήσεις',
    checkBtn: '🎯 Έλεγχος Απαντήσεων',
    scoreLabel: '🏆 Σκορ:',
    successRate: 'Επιτυχία:',
    footerPrompt: 'Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!',
    correctAnswerIs: 'Η σωστή απάντηση είναι',
    correctAnswerIsMcq: 'Η σωστή απάντηση είναι:',
    statementIs: 'Η πρόταση είναι',
    resultLabel: 'Αποτέλεσμα:',
    numberPlaceholder: 'Αριθμός',
    trueText: 'Σωστό',
    falseText: 'Λάθος',
    unitAxes: 'άξονες',
    unitCm: 'cm',
    unitCm2: 'cm²',
    qAxesFromShape: (name) => `Πόσους άξονες συμμετρίας έχει το παρακάτω σχήμα («${name}»);`,
    qAreaTotal: (half) =>
      `Ένας άξονας συμμετρίας χωρίζει ένα σχήμα σε δύο ίσα μέρη. Αν το ένα μέρος έχει εμβαδόν ${half} cm², πόσο είναι το συνολικό εμβαδόν του σχήματος;`,
    expAreaTotal: (half, total) =>
      `Επειδή τα δύο μέρη είναι απολύτως ίσα, το συνολικό εμβαδόν είναι: ${half} ＋ ${half} ＝ ${total} cm² (ή 2 · ${half} ＝ ${total} cm²).`,
    qAreaHalf: (total) =>
      `Ένα σχήμα έχει συνολικό εμβαδόν ${total} cm². Ένας άξονας συμμετρίας το χωρίζει σε δύο ίσα μέρη. Πόσο εμβαδόν έχει το κάθε μέρος;`,
    expAreaHalf: (total, half) =>
      `Ο άξονας συμμετρίας χωρίζει το εμβαδόν σε δύο ίσα μέρη: ${total} : 2 ＝ ${half} cm².`,
    qPerimeterEqual: (half) =>
      `Ένας άξονας συμμετρίας χωρίζει ένα γεωμετρικό σχήμα σε δύο συμμετρικά μέρη. Αν το πρώτο μέρος έχει περίμετρο ${half} cm, πόση είναι η περίμετρος του δεύτερου μέρους;`,
    expPerimeterEqual: (half) =>
      `Τα συμμετρικά μέρη ως προς άξονα είναι ίσα μεταξύ τους, επομένως έχουν ακριβώς την ίδια περίμετρο: ${half} cm.`,
    qRelation:
      'Όταν ένας άξονας συμμετρίας χωρίζει ένα σχήμα σε δύο μέρη, ποια σχέση ισχύει για τα δύο αυτά μέρη;',
    expRelation:
      'Επειδή τα συμμετρικά μέρη ταυτίζονται τέλεια κατά την αναδίπλωση, έχουν υποχρεωτικά ίση περίμετρο και ίσο εμβαδόν.',
    relOptionCorrect: 'Έχουν ακριβώς ίδια περίμετρο και ίδιο εμβαδόν',
    relOptionWrong1: 'Έχουν ίδια περίμετρο αλλά διαφορετικό εμβαδόν',
    relOptionWrong2: 'Έχουν ίδιο εμβαδόν αλλά διαφορετική περίμετρο',
    relOptionWrong3: 'Δεν έχουν καμία κοινή γεωμετρική σχέση',
    qMostAxes: 'Ποιο από τα παρακάτω γεωμετρικά σχήματα διαθέτει τους ΠΕΡΙΣΣΟΤΕΡΟΥΣ άξονες συμμετρίας;',
    expMostAxes:
      'Το τετράγωνο έχει 4 άξονες συμμετρίας, το ορθογώνιο 2, το ισοσκελές 1 και το σκαληνό 0.',
    mostOptionSquare: 'Το Τετράγωνο (4 άξονες)',
    mostOptionRectangle: 'Το Ορθογώνιο (2 άξονες)',
    mostOptionIsosceles: 'Το Ισοσκελές Τρίγωνο (1 άξονας)',
    mostOptionScalene: 'Το Σκαληνό Τρίγωνο (0 άξονες)',
    shapes: [
      {
        id: 'square',
        name: 'Τετράγωνο',
        correct: 4,
        explainText:
          'Το τετράγωνο έχει ακριβώς 4 άξονες συμμετρίας: 1 κατακόρυφο, 1 οριζόντιο και 2 διαγώνιους.',
      },
      {
        id: 'rectangle',
        name: 'Ορθογώνιο Παραλληλόγραμμο',
        correct: 2,
        explainText:
          'Το ορθογώνιο έχει 2 άξονες συμμετρίας (1 κατακόρυφο και 1 οριζόντιο). Οι διαγώνιοί του δεν είναι άξονες συμμετρίας.',
      },
      {
        id: 'isosceles',
        name: 'Ισοσκελές Τρίγωνο',
        correct: 1,
        explainText:
          'Το ισοσκελές τρίγωνο (με 2 ίσες πλευρές) έχει μόνο 1 κατακόρυφο άξονα συμμετρίας που διέρχεται από την κορυφή του.',
      },
      {
        id: 'rhombus',
        name: 'Ρόμβος',
        correct: 2,
        explainText:
          'Ο ρόμβος έχει 2 άξονες συμμετρίας, οι οποίοι συμπίπτουν ακριβώς με τις δύο διαγώνιές του.',
      },
      {
        id: 'equilateral',
        name: 'Ισόπλευρο Τρίγωνο',
        correct: 3,
        explainText:
          'Το ισόπλευρο τρίγωνο (με 3 ίσες πλευρές) έχει 3 άξονες συμμετρίας, έναν από κάθε κορυφή του.',
      },
      {
        id: 'scalene',
        name: 'Σκαληνό Τρίγωνο',
        correct: 0,
        explainText:
          'Το σκαληνό τρίγωνο (με όλες τις πλευρές και γωνίες άνισες) δεν έχει κανέναν άξονα συμμετρίας (0).',
      },
    ],
    trueFalsePool: [
      {
        id: 'tf1',
        q: 'Ο άξονας συμμετρίας χωρίζει ένα γεωμετρικό σχήμα σε δύο ακριβώς ίδια μέρη.',
        correct: 'Σωστό',
        explain:
          'Αν διπλώσουμε το σχήμα κατά μήκος του άξονα συμμετρίας, τα δύο μέρη ταυτίζονται απόλυτα.',
      },
      {
        id: 'tf2',
        q: 'Τα δύο συμμετρικά μέρη ενός σχήματος έχουν πάντοτε ακριβώς την ίδια περίμετρο.',
        correct: 'Σωστό',
        explain:
          'Επειδή τα δύο μέρη είναι γεωμετρικά ίσα, τα περιγράμματά τους έχουν το ίδιο συνολικό μήκος.',
      },
      {
        id: 'tf3',
        q: 'Τα δύο συμμετρικά μέρη ενός σχήματος καλύπτουν πάντοτε ακριβώς το ίδιο εμβαδόν.',
        correct: 'Σωστό',
        explain:
          'Η συμμετρία ως προς άξονα διατηρεί αναλλοίωτη την επιφάνεια των δύο τμημάτων.',
      },
      {
        id: 'tf4',
        q: 'Το τετράγωνο έχει συνολικά 4 άξονες συμμετρίας.',
        correct: 'Σωστό',
        explain:
          'Το τετράγωνο έχει 1 κατακόρυφο, 1 οριζόντιο και 2 διαγώνιους άξονες συμμετρίας.',
      },
      {
        id: 'tf5',
        q: 'Οι διαγώνιοι ενός ορθογωνίου παραλληλογράμμου είναι άξονες συμμετρίας του.',
        correct: 'Λάθος',
        explain:
          'Αν διπλώσουμε ένα ορθογώνιο κατά μήκος της διαγωνίου του, τα δύο μέρη δεν ταυτίζονται.',
      },
      {
        id: 'tf6',
        q: 'Ο κύκλος έχει συνολικά μόνο 2 άξονες συμμετρίας.',
        correct: 'Λάθος',
        explain:
          'Ο κύκλος έχει άπειρους (αμέτρητους) άξονες συμμετρίας, αφού κάθε διάμετρός του είναι άξονας συμμετρίας.',
      },
      {
        id: 'tf7',
        q: 'Υπάρχουν επίπεδα σχήματα που δεν έχουν κανέναν άξονα συμμετρίας.',
        correct: 'Σωστό',
        explain:
          'Χαρακτηριστικό παράδειγμα είναι το σκαληνό τρίγωνο, το οποίο έχει 0 άξονες συμμετρίας.',
      },
      {
        id: 'tf8',
        q: 'Το ισοσκελές τρίγωνο έχει συνολικά 3 άξονες συμμετρίας.',
        correct: 'Λάθος',
        explain:
          'Το ισοσκελές τρίγωνο έχει μόνο 1 άξονα συμμετρίας, ενώ 3 άξονες έχει μόνο το ισόπλευρο τρίγωνο.',
      },
      {
        id: 'tf9',
        q: 'Ο ρόμβος έχει 2 άξονες συμμετρίας που συμπίπτουν με τις διαγώνιές του.',
        correct: 'Σωστό',
        explain:
          'Οι δύο διαγώνιοι του ρόμβου χωρίζουν το σχήμα σε συμμετρικά μέρη που ταυτίζονται κατά την αναδίπλωση.',
      },
      {
        id: 'tf10',
        q: 'Το κεφαλαίο γράμμα «Α» έχει έναν κατακόρυφο άξονα συμμετρίας.',
        correct: 'Σωστό',
        explain:
          'Μια κατακόρυφη ευθεία στη μέση χωρίζει το γράμμα «Α» σε δύο πανομοιότυπα συμμετρικά μισά.',
      },
    ],
  },
  en: {
    metaTitle: 'Exercises: Symmetry and Axes | LearnMaths.gr',
    metaDesc:
      'Interactive Grade 4 math exercises on symmetry: identifying the number of axes from diagrams, calculating perimeter and area of symmetrical parts.',
    backText: 'Grade 4',
    theoryBtn: 'Theory',
    badge: 'GRADE 4 • PRACTICE',
    title: '📝 Exercises: The Concept of Symmetry',
    subtitle: 'Click "New Exercises" to automatically refresh shapes and numbers from the pool!',
    newQuestionsBtn: '🔄 New Exercises',
    checkBtn: '🎯 Check Answers',
    scoreLabel: '🏆 Score:',
    successRate: 'Success:',
    footerPrompt: 'Fill in your answers and click "Check Answers"!',
    correctAnswerIs: 'The correct answer is',
    correctAnswerIsMcq: 'The correct answer is:',
    statementIs: 'The statement is',
    resultLabel: 'Result:',
    numberPlaceholder: 'Number',
    trueText: 'True',
    falseText: 'False',
    unitAxes: 'axes',
    unitCm: 'cm',
    unitCm2: 'cm²',
    qAxesFromShape: (name) => `How many lines of symmetry does the shape below ("${name}") have?`,
    qAreaTotal: (half) =>
      `A line of symmetry divides a shape into two equal halves. If one half has an area of ${half} cm², what is the total area of the shape?`,
    expAreaTotal: (half, total) =>
      `Because both halves are identical, the total area is: ${half} ＋ ${half} ＝ ${total} cm² (or 2 · ${half} ＝ ${total} cm²).`,
    qAreaHalf: (total) =>
      `A shape has a total area of ${total} cm². A line of symmetry divides it into two equal halves. What is the area of each half?`,
    expAreaHalf: (total, half) =>
      `The line of symmetry divides the area into two equal parts: ${total} : 2 ＝ ${half} cm².`,
    qPerimeterEqual: (half) =>
      `A line of symmetry divides a geometric shape into two symmetrical halves. If the first half has a perimeter of ${half} cm, what is the perimeter of the second half?`,
    expPerimeterEqual: (half) =>
      `Symmetrical halves across an axis are congruent, so they have exactly the same perimeter: ${half} cm.`,
    qRelation:
      'When a line of symmetry divides a shape into two parts, what is true about these two parts?',
    expRelation:
      'Because symmetrical parts match up perfectly upon folding, they necessarily have equal perimeters and equal areas.',
    relOptionCorrect: 'They have exactly the same perimeter and the same area',
    relOptionWrong1: 'They have the same perimeter but different areas',
    relOptionWrong2: 'They have the same area but different perimeters',
    relOptionWrong3: 'They share no geometric relationship',
    qMostAxes: 'Which of the following geometric shapes has the MOST lines of symmetry?',
    expMostAxes:
      'A square has 4 lines of symmetry, a rectangle 2, an isosceles triangle 1, and a scalene triangle 0.',
    mostOptionSquare: 'The Square (4 axes)',
    mostOptionRectangle: 'The Rectangle (2 axes)',
    mostOptionIsosceles: 'The Isosceles Triangle (1 axis)',
    mostOptionScalene: 'The Scalene Triangle (0 axes)',
    shapes: [
      {
        id: 'square',
        name: 'Square',
        correct: 4,
        explainText:
          'A square has exactly 4 lines of symmetry: 1 vertical, 1 horizontal, and 2 diagonals.',
      },
      {
        id: 'rectangle',
        name: 'Rectangle',
        correct: 2,
        explainText:
          'A rectangle has 2 lines of symmetry (1 vertical and 1 horizontal). Its diagonals are not lines of symmetry.',
      },
      {
        id: 'isosceles',
        name: 'Isosceles Triangle',
        correct: 1,
        explainText:
          'An isosceles triangle (with 2 equal sides) has only 1 vertical line of symmetry passing through its vertex.',
      },
      {
        id: 'rhombus',
        name: 'Rhombus',
        correct: 2,
        explainText:
          'A rhombus has 2 lines of symmetry, which coincide exactly with its two diagonals.',
      },
      {
        id: 'equilateral',
        name: 'Equilateral Triangle',
        correct: 3,
        explainText:
          'An equilateral triangle (with 3 equal sides) has 3 lines of symmetry, one from each vertex.',
      },
      {
        id: 'scalene',
        name: 'Scalene Triangle',
        correct: 0,
        explainText:
          'A scalene triangle (with all sides and angles unequal) has no line of symmetry (0).',
      },
    ],
    trueFalsePool: [
      {
        id: 'tf1',
        q: 'A line of symmetry divides a geometric shape into two identical halves.',
        correct: 'True',
        explain:
          'If you fold the shape along the line of symmetry, both halves match up perfectly.',
      },
      {
        id: 'tf2',
        q: 'The two symmetrical halves of a shape always have exactly the same perimeter.',
        correct: 'True',
        explain:
          'Because the two parts are geometrically congruent, their boundaries have identical total length.',
      },
      {
        id: 'tf3',
        q: 'The two symmetrical halves of a shape always cover exactly the same area.',
        correct: 'True',
        explain:
          'Axial symmetry perfectly preserves surface area between the two halves.',
      },
      {
        id: 'tf4',
        q: 'A square has a total of 4 lines of symmetry.',
        correct: 'True',
        explain:
          'A square has 1 vertical, 1 horizontal, and 2 diagonal lines of symmetry.',
      },
      {
        id: 'tf5',
        q: 'The diagonals of a rectangle are lines of symmetry.',
        correct: 'False',
        explain:
          'Folding a rectangle along its diagonal does not cause the two halves to match up.',
      },
      {
        id: 'tf6',
        q: 'A circle has a total of only 2 lines of symmetry.',
        correct: 'False',
        explain:
          'A circle has infinitely many lines of symmetry, as every straight line passing through its center is a line of symmetry.',
      },
      {
        id: 'tf7',
        q: 'There are 2D geometric shapes that have no line of symmetry at all.',
        correct: 'True',
        explain:
          'A prime example is the scalene triangle, which has 0 lines of symmetry.',
      },
      {
        id: 'tf8',
        q: 'An isosceles triangle has a total of 3 lines of symmetry.',
        correct: 'False',
        explain:
          'An isosceles triangle has only 1 line of symmetry; 3 lines of symmetry belong exclusively to equilateral triangles.',
      },
      {
        id: 'tf9',
        q: 'A rhombus has 2 lines of symmetry that coincide with its diagonals.',
        correct: 'True',
        explain:
          'The two diagonals of a rhombus divide it into congruent parts that match when folded.',
      },
      {
        id: 'tf10',
        q: 'The capital letter "A" has a vertical line of symmetry.',
        correct: 'True',
        explain:
          'A vertical line down the center divides the letter "A" into two symmetrical halves.',
      },
    ],
  },
};

const SHAPE_SVGS = {
  square: (
    <svg className="w-52 h-32 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 200 120">
      <rect x="65" y="25" width="70" height="70" rx="3" fill="#a855f7" fillOpacity="0.25" stroke="#c084fc" strokeWidth="3.5" />
    </svg>
  ),
  rectangle: (
    <svg className="w-56 h-32 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 220 120">
      <rect x="40" y="30" width="140" height="60" rx="3" fill="#a855f7" fillOpacity="0.25" stroke="#c084fc" strokeWidth="3.5" />
    </svg>
  ),
  isosceles: (
    <svg className="w-52 h-32 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 200 120">
      <polygon points="100,20 45,95 155,95" fill="#a855f7" fillOpacity="0.25" stroke="#c084fc" strokeWidth="3.5" strokeLinejoin="round" />
    </svg>
  ),
  rhombus: (
    <svg className="w-52 h-32 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 200 120">
      <polygon points="100,15 155,60 100,105 45,60" fill="#a855f7" fillOpacity="0.25" stroke="#c084fc" strokeWidth="3.5" strokeLinejoin="round" />
    </svg>
  ),
  equilateral: (
    <svg className="w-52 h-32 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 200 120">
      <polygon points="100,20 50,100 150,100" fill="#a855f7" fillOpacity="0.25" stroke="#c084fc" strokeWidth="3.5" strokeLinejoin="round" />
    </svg>
  ),
  scalene: (
    <svg className="w-52 h-32 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 200 120">
      <polygon points="60,25 40,95 170,95" fill="#a855f7" fillOpacity="0.25" stroke="#c084fc" strokeWidth="3.5" strokeLinejoin="round" />
    </svg>
  ),
};

function makeMathSymmetryQuestion(t, isArea = true) {
  if (isArea) {
    const halfArea = getRandomInt(12, 45);
    const totalArea = halfArea * 2;
    const mode = Math.random() > 0.5 ? 'findTotal' : 'findHalf';

    if (mode === 'findTotal') {
      return {
        q: t.qAreaTotal(halfArea),
        correct: totalArea,
        unit: t.unitCm2,
        explainText: t.expAreaTotal(halfArea, totalArea),
      };
    } else {
      return {
        q: t.qAreaHalf(totalArea),
        correct: halfArea,
        unit: t.unitCm2,
        explainText: t.expAreaHalf(totalArea, halfArea),
      };
    }
  } else {
    const halfPerimeter = getRandomInt(14, 38);
    return {
      q: t.qPerimeterEqual(halfPerimeter),
      correct: halfPerimeter,
      unit: t.unitCm,
      explainText: t.expPerimeterEqual(halfPerimeter),
    };
  }
}

function generateQuestions(t) {
  // Q1 & Q2: Πλήθος αξόνων με SVG Σχήμα
  const item1 = t.shapes[getRandomInt(0, t.shapes.length - 1)];
  let item2;
  while (true) {
    item2 = t.shapes[getRandomInt(0, t.shapes.length - 1)];
    if (item2.id !== item1.id) break;
  }

  const q1 = {
    q: t.qAxesFromShape(item1.name),
    correct: item1.correct,
    unit: t.unitAxes,
    explainText: item1.explainText,
    svg: SHAPE_SVGS[item1.id],
  };

  const q2 = {
    q: t.qAxesFromShape(item2.name),
    correct: item2.correct,
    unit: t.unitAxes,
    explainText: item2.explainText,
    svg: SHAPE_SVGS[item2.id],
  };

  // Q3 & Q4: Υπολογισμοί Εμβαδού & Περιμέτρου
  const q3 = makeMathSymmetryQuestion(t, true);
  const q4 = makeMathSymmetryQuestion(t, false);

  // Q5 & Q6: MCQ Αναγνώριση & Ιδιότητες
  const rawRelOptions = [
    t.relOptionCorrect,
    t.relOptionWrong1,
    t.relOptionWrong2,
    t.relOptionWrong3,
  ];
  const uniqueRel = [...new Set(rawRelOptions)];
  const mcqOptions1 = uniqueRel
    .map((text) => ({ text, isCorrect: text === t.relOptionCorrect }))
    .sort(() => Math.random() - 0.5);

  const q5 = {
    q: t.qRelation,
    correct: t.relOptionCorrect,
    options: mcqOptions1,
    explainText: t.expRelation,
  };

  const rawMostOptions = [
    t.mostOptionSquare,
    t.mostOptionRectangle,
    t.mostOptionIsosceles,
    t.mostOptionScalene,
  ];
  const uniqueMost = [...new Set(rawMostOptions)];
  const mcqOptions2 = uniqueMost
    .map((text) => ({ text, isCorrect: text === t.mostOptionSquare }))
    .sort(() => Math.random() - 0.5);

  const q6 = {
    q: t.qMostAxes,
    correct: t.mostOptionSquare,
    options: mcqOptions2,
    explainText: t.expMostAxes,
  };

  // Q7 & Q8: Σωστό / Λάθος
  const tf1 = t.trueFalsePool[getRandomInt(0, t.trueFalsePool.length - 1)];
  let tf2;
  while (true) {
    tf2 = t.trueFalsePool[getRandomInt(0, t.trueFalsePool.length - 1)];
    if (tf2.id !== tf1.id) break;
  }

  return { q1, q2, q3, q4, q5, q6, q7: tf1, q8: tf2 };
}

export default function SimmetriaAskPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];

  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: '',
    q6: '',
    q7: '',
    q8: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewQuestions = () => {
    setQuestions(generateQuestions(t));
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

  const handleNumericInput = (key, rawVal) => {
    if (submitted) return;
    const clean = rawVal.replace(/[^0-9]/g, '');
    if (clean.length <= 10) {
      setAnswers((prev) => ({ ...prev, [key]: clean }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted) return;

    let currentScore = 0;
    if (parseInt(answers.q1, 10) === questions.q1.correct) currentScore += 1;
    if (parseInt(answers.q2, 10) === questions.q2.correct) currentScore += 1;
    if (parseInt(answers.q3, 10) === questions.q3.correct) currentScore += 1;
    if (parseInt(answers.q4, 10) === questions.q4.correct) currentScore += 1;
    if (answers.q5 === questions.q5.correct) currentScore += 1;
    if (answers.q6 === questions.q6.correct) currentScore += 1;
    if (answers.q7 === questions.q7.correct) currentScore += 1;
    if (answers.q8 === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  // Render Αριθμητικών Inputs (Q1 - Q4)
  const renderInputNumber = (qKey, qData, numLabel, colorClass) => {
    const isCorrect = parseInt(answers[qKey], 10) === qData.correct;
    return (
      <div
        className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
          submitted
            ? isCorrect
              ? 'border-emerald-500 bg-emerald-50/20'
              : 'border-rose-400 bg-rose-50/20'
            : 'border-slate-100'
        }`}
      >
        <div className="flex items-start gap-3 mb-4">
          <span
            className={`${colorClass} text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm`}
          >
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {qData.q}
          </h3>
        </div>

        {qData.svg && <div className="mb-4">{qData.svg}</div>}

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span className="text-xs sm:text-sm font-sans font-bold text-slate-500">
              {t.resultLabel}
            </span>
            <span>＝</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              maxLength={10}
              placeholder={t.numberPlaceholder}
              value={answers[qKey]}
              onChange={(e) => handleNumericInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-28 sm:w-36 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-purple-900 bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
            />
            <span className="font-bold text-slate-600 font-sans text-sm sm:text-base">
              {qData.unit}
            </span>
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {qData.explainText}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {t.correctAnswerIs}{' '}
                <span className="font-mono font-bold text-rose-900">
                  {formatNum(qData.correct, locale)} {qData.unit}
                </span>
                . {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render MCQ (Q5 & Q6, 4 Επιλογές)
  const renderMcqQuestion = (qKey, qData, numLabel) => {
    const isCorrect = answers[qKey] === qData.correct;
    return (
      <div
        className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
          submitted
            ? isCorrect
              ? 'border-emerald-500 bg-emerald-50/20'
              : 'border-rose-400 bg-rose-50/20'
            : 'border-slate-100'
        }`}
      >
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-pink-600 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {qData.q}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:pl-11">
          {qData.options.map((opt, idx) => {
            const isSelected = answers[qKey] === opt.text;
            return (
              <label
                key={idx}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition select-none text-xs sm:text-sm ${
                  isSelected
                    ? 'border-purple-600 bg-purple-50/80 font-bold text-purple-950 shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                } ${submitted ? 'cursor-default pointer-events-none' : ''}`}
              >
                <input
                  type="radio"
                  id={`${qKey}-opt-${idx}`}
                  name={qKey}
                  value={opt.text}
                  checked={isSelected}
                  onChange={() => handleInputChange(qKey, opt.text)}
                  disabled={submitted}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500 shrink-0"
                />
                <span className="break-words whitespace-normal leading-snug flex-1">
                  {opt.text}
                </span>
              </label>
            );
          })}
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {qData.explainText}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {t.correctAnswerIsMcq} <strong className="font-bold text-rose-900">{qData.correct}</strong>. {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Σωστό / Λάθος (Q7 & Q8)
  const renderTrueFalse = (qKey, qData, numLabel) => {
    const isCorrect = answers[qKey] === qData.correct;
    return (
      <div
        className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
          submitted
            ? isCorrect
              ? 'border-emerald-500 bg-emerald-50/20'
              : 'border-rose-400 bg-rose-50/20'
            : 'border-slate-100'
        }`}
      >
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-indigo-600 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {qData.q}
          </h3>
        </div>

        <div className="flex gap-3 sm:pl-11">
          {[t.trueText, t.falseText].map((opt) => (
            <button
              type="button"
              key={opt}
              onClick={() => handleInputChange(qKey, opt)}
              disabled={submitted}
              className={`px-6 sm:px-8 py-3 rounded-2xl font-black text-sm sm:text-base border transition active:scale-95 touch-manipulation select-none ${
                answers[qKey] === opt
                  ? opt === t.trueText
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-md'
                    : 'bg-rose-600 text-white border-rose-700 shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {qData.explain}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {t.statementIs} <strong className="font-bold text-rose-900">«{qData.correct}»</strong>: {qData.explain}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDesc}
      backUrl="/d-dimotikou"
      backText={t.backText}
      hideFooter={true}
      actionButton={
        <Link
          href="/d-dimotikou/18-simmetria"
          className="bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> {t.theoryBtn}
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              {toCleanUppercase(t.badge)}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              {t.title}
            </h1>
            <p className="text-purple-100 text-xs sm:text-sm md:text-base">{t.subtitle}</p>
          </div>

          <button
            onClick={loadNewQuestions}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg hover:bg-purple-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            {t.newQuestionsBtn}
          </button>
        </div>

        {/* ΦΟΡΜΑ ΜΕ ΑΣΚΗΣΕΙΣ */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderInputNumber('q1', questions.q1, 1, 'bg-purple-600')}
          {renderInputNumber('q2', questions.q2, 2, 'bg-purple-600')}

          {renderInputNumber('q3', questions.q3, 3, 'bg-pink-600')}
          {renderInputNumber('q4', questions.q4, 4, 'bg-pink-600')}

          {renderMcqQuestion('q5', questions.q5, 5)}
          {renderMcqQuestion('q6', questions.q6, 6)}

          {renderTrueFalse('q7', questions.q7, 7)}
          {renderTrueFalse('q8', questions.q8, 8)}

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="text-center pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white text-base sm:text-lg font-black px-10 py-4 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95"
              >
                {t.checkBtn}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* STICKY FOOTER SCORES & FEEDBACK BAR */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-base sm:text-lg flex items-center gap-2 shadow-sm">
              <span>{t.scoreLabel}</span>
              <span className="text-xl sm:text-2xl font-mono">{score} / 8</span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                {t.successRate}{' '}
                <span className="text-emerald-400 font-black">
                  {Math.round((score / 8) * 100)}%
                </span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                onClick={loadNewQuestions}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2 rounded-xl shadow-md transition text-xs sm:text-sm flex items-center gap-2"
              >
                <span>🔄</span> {t.newQuestionsBtn}
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden sm:block">{t.footerPrompt}</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}