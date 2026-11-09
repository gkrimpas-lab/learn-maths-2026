// pages/d-dimotikou/17-perimetros-ask.js
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
    metaTitle: 'Ασκήσεις: Υπολογισμός Περιμέτρου | LearnMaths.gr',
    metaDesc:
      "Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού στην περίμετρο: υπολογισμός από σχήμα, εύρεση άγνωστης πλευράς και πρακτικά προβλήματα καθημερινότητας.",
    backText: "Δ' Δημοτικού",
    theoryBtn: 'Θεωρία',
    badge: "Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    title: '📝 Ασκήσεις: Υπολογισμός Περιμέτρου',
    subtitle: 'Πατώντας «Νέες Ασκήσεις», τα σχήματα και τα προβλήματα ανανεώνονται αυτόματα από τη δεξαμενή!',
    newQuestionsBtn: '🔄 Νέες Ασκήσεις',
    checkBtn: '🎯 Έλεγχος Απαντήσεων',
    scoreLabel: '🏆 Σκορ:',
    successRate: 'Επιτυχία:',
    footerPrompt: 'Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!',
    correctAnswerIs: 'Η σωστή απάντηση είναι',
    correctAnswerIsMcq: 'Η σωστή απάντηση είναι:',
    statementIs: 'Η πρόταση είναι',
    perimeterLabel: 'Περίμετρος:',
    sideLabel: 'Μήκος πλευράς:',
    numberPlaceholder: 'Αριθμός',
    trueText: 'Σωστό',
    falseText: 'Λάθος',
    unitM: 'm',
    unitCm: 'cm',
    qSquarePerimeter: (a) => `Υπολόγισε την περίμετρο του τετραγώνου με πλευρά a ＝ ${a} cm:`,
    expSquarePerimeter: (a, c) => `Το τετράγωνο έχει 4 ίσες πλευρές: 4 · ${a} ＝ ${c} cm.`,
    qRectPerimeter: (a, b) => `Υπολόγισε την περίμετρο του ορθογωνίου με μήκος ${a} cm και πλάτος ${b} cm:`,
    expRectPerimeter: (a, b, c) => `Στο ορθογώνιο προσθέτουμε τις απέναντι πλευρές: (2 · ${a}) ＋ (2 · ${b}) ＝ ${c} cm.`,
    qTrianglePerimeter: (a, b, c) => `Υπολόγισε την περίμετρο του τριγώνου με πλευρές a ＝ ${a} cm, b ＝ ${b} cm, c ＝ ${c} cm:`,
    expTrianglePerimeter: (a, b, c, total) => `Προσθέτουμε όλες τις πλευρές του τριγώνου: ${a} ＋ ${b} ＋ ${c} ＝ ${total} cm.`,
    qSquareMissing: (p) => `Ένα τετράγωνο έχει συνολική περίμετρο ${p} cm. Πόσο είναι το μήκος της μίας πλευράς του;`,
    expSquareMissing: (p, s) => `Αφού το τετράγωνο έχει 4 ίσες πλευρές, διαιρούμε με το 4: ${p} : 4 ＝ ${s} cm.`,
    qTriangleMissing: (p) => `Ένα ισόπλευρο τρίγωνο (με 3 ίσες πλευρές) έχει περίμετρο ${p} cm. Πόσο είναι το μήκος της κάθε πλευράς του;`,
    expTriangleMissing: (p, s) => `Αφού το ισόπλευρο τρίγωνο έχει 3 ίσες πλευρές, διαιρούμε με το 3: ${p} : 3 ＝ ${s} cm.`,
    realProblems: [
      (loc) => {
        const w = getRandomInt(10, 30), h = getRandomInt(5, 15), c = 2 * w + 2 * h;
        return {
          id: 'rp1',
          q: `Ο κύριος Νίκος περιφράζει έναν ορθογώνιο κήπο μήκους ${w} m και πλάτους ${h} m. Πόσα μέτρα συρματόπλεγμα θα χρειαστεί συνολικά;`,
          correct: `${formatNum(c, loc)} m`,
          wrongs: [`${formatNum(w + h, loc)} m`, `${formatNum(2 * w + h, loc)} m`, `${formatNum(w + 2 * h, loc)} m`],
          explainText: `Για την ορθογώνια περίφραξη προσθέτουμε όλες τις πλευρές: (2 · ${w}) ＋ (2 · ${h}) ＝ ${formatNum(c, loc)} m.`,
        };
      },
      (loc) => {
        const s = getRandomInt(6, 20), c = 4 * s;
        return {
          id: 'rp2',
          q: `Μια τετράγωνη παιδική χαρά έχει πλευρά ${s} m. Πόσο μήκος έχει το προστατευτικό κιγκλίδωμα γύρω-γύρω;`,
          correct: `${formatNum(c, loc)} m`,
          wrongs: [`${formatNum(s * 2, loc)} m`, `${formatNum(s * 3, loc)} m`, `${formatNum(s + 4, loc)} m`],
          explainText: `Το τετράγωνο έχει 4 ίσες πλευρές, επομένως: 4 · ${s} ＝ ${formatNum(c, loc)} m.`,
        };
      },
      (loc) => {
        const w = getRandomInt(12, 25), h = getRandomInt(6, 12), c = 2 * w + 2 * h;
        return {
          id: 'rp3',
          q: `Η σχολική αυλή είναι ορθογώνια με μήκος ${w} m και πλάτος ${h} m. Τα παιδιά τρέχουν 1 πλήρη γύρο γύρω από την αυλή. Πόσα μέτρα διανύουν;`,
          correct: `${formatNum(c, loc)} m`,
          wrongs: [`${formatNum(w + h, loc)} m`, `${formatNum(2 * (w + h) + 6, loc)} m`, `${formatNum(2 * w + h, loc)} m`],
          explainText: `Ο ένας γύρος ισούται με την περίμετρο του ορθογωνίου: (2 · ${w}) ＋ (2 · ${h}) ＝ ${formatNum(c, loc)} m.`,
        };
      },
      (loc) => {
        const s = getRandomInt(8, 18), c = 4 * s;
        return {
          id: 'rp4',
          q: `Ένα τετράγωνο οικόπεδο έχει πλευρά ${s} m. Πόσα μέτρα μήκος έχει ο τοίχος που το περιβάλλει;`,
          correct: `${formatNum(c, loc)} m`,
          wrongs: [`${formatNum(s * 2, loc)} m`, `${formatNum(s * 3, loc)} m`, `${formatNum(s * 5, loc)} m`],
          explainText: `Η περίμετρος του τετραγώνου δίνεται από τον τύπο: 4 · ${s} ＝ ${formatNum(c, loc)} m.`,
        };
      },
      (loc) => {
        const w = getRandomInt(15, 35), h = getRandomInt(10, 20), c = 2 * w + 2 * h;
        return {
          id: 'rp5',
          q: `Ένα ποδοσφαιρικό γήπεδο 5x5 έχει μήκος ${w} m και πλάτος ${h} m. Πόσα μέτρα είναι συνολικά οι άσπρες γραμμές του εξωτερικού περιγράμματός του;`,
          correct: `${formatNum(c, loc)} m`,
          wrongs: [`${formatNum(w + h, loc)} m`, `${formatNum(2 * w + h, loc)} m`, `${formatNum(w + 2 * h, loc)} m`],
          explainText: `Το περίγραμμα είναι η περίμετρος: (2 · ${w}) ＋ (2 · ${h}) ＝ ${formatNum(c, loc)} m.`,
        };
      },
      (loc) => {
        const w = getRandomInt(20, 50), h = getRandomInt(15, 30), c = 2 * w + 2 * h;
        return {
          id: 'rp6',
          q: `Μια ορθογώνια κορνίζα έχει μήκος ${w} cm και πλάτος ${h} cm. Πόσα εκατοστά ξύλινο πηχάκι χρειάστηκε για την κατασκευή του περιγράμματός της;`,
          correct: `${formatNum(c, loc)} cm`,
          wrongs: [`${formatNum(w + h, loc)} cm`, `${formatNum(2 * w + h, loc)} cm`, `${formatNum(w + 2 * h, loc)} cm`],
          explainText: `Το συνολικό μήκος του πλαισίου είναι η περίμετρος: (2 · ${w}) ＋ (2 · ${h}) ＝ ${formatNum(c, loc)} cm.`,
        };
      },
      (loc) => {
        const s = getRandomInt(15, 40), c = 4 * s;
        return {
          id: 'rp7',
          q: `Ένας τετράγωνος πίνακας ζωγραφικής έχει πλευρά ${s} cm. Πόσο είναι το συνολικό μήκος του πλαισίου του;`,
          correct: `${formatNum(c, loc)} cm`,
          wrongs: [`${formatNum(s * 2, loc)} cm`, `${formatNum(s * 3, loc)} cm`, `${formatNum(s + 4, loc)} cm`],
          explainText: `Το τετράγωνο πλαίσιο έχει μήκος 4 · ${s} ＝ ${formatNum(c, loc)} cm.`,
        };
      },
      (loc) => {
        const s = getRandomInt(12, 30), c = 3 * s;
        return {
          id: 'rp8',
          q: `Ένα ισόπλευρο τριγωνικό σήμα οδικής κυκλοφορίας έχει πλευρά ${s} cm. Πόση είναι η περίμετρός του;`,
          correct: `${formatNum(c, loc)} cm`,
          wrongs: [`${formatNum(s * 2, loc)} cm`, `${formatNum(s * 4, loc)} cm`, `${formatNum(s + 3, loc)} cm`],
          explainText: `Το ισόπλευρο τρίγωνο έχει 3 ίσες πλευρές: 3 · ${s} ＝ ${formatNum(c, loc)} cm.`,
        };
      },
    ],
    trueFalsePool: [
      {
        id: 'tf1',
        q: 'Η περίμετρος ενός σχήματος είναι το συνολικό μήκος του εξωτερικού περιγράμματός του.',
        correct: 'Σωστό',
        explain: 'Η περίμετρος ισούται με το άθροισμα των μηκών όλων των εξωτερικών πλευρών ενός σχήματος.',
      },
      {
        id: 'tf2',
        q: 'Για να βρούμε την περίμετρο οποιουδήποτε πολυγώνου, προσθέτουμε τα μήκη όλων των πλευρών του.',
        correct: 'Σωστό',
        explain: 'Ο βασικός κανόνας υπολογισμού της περιμέτρου είναι η πρόσθεση όλων των πλευρών.',
      },
      {
        id: 'tf3',
        q: 'Η περίμετρος ενός επίπεδου σχήματος μετριέται σε τετραγωνικά μέτρα (τ.μ.).',
        correct: 'Λάθος',
        explain: 'Σε τετραγωνικές μονάδες (τ.μ., τ.εκ.) μετριέται το εμβαδόν μιας επιφάνειας και όχι η περίμετρος.',
      },
      {
        id: 'tf4',
        q: 'Αν διπλασιάσουμε το μήκος όλων των πλευρών ενός σχήματος, η περίμετρός του διπλασιάζεται.',
        correct: 'Σωστό',
        explain: 'Όταν διπλασιάζεται κάθε πλευρά, διπλασιάζεται ακριβώς και το συνολικό τους άθροισμα.',
      },
      {
        id: 'tf5',
        q: 'Για να βρούμε την περίμετρο ενός ορθογωνίου, προσθέτουμε το μήκος και το πλάτος του μόνο μία φορά.',
        correct: 'Λάθος',
        explain: 'Το ορθογώνιο έχει 4 πλευρές, άρα προσθέτουμε δύο φορές το μήκος και δύο φορές το πλάτος.',
      },
      {
        id: 'tf6',
        q: 'Αν ένα τετράγωνο έχει συνολική περίμετρο 36 cm, η πλευρά του ισούται με 9 cm.',
        correct: 'Σωστό',
        explain: 'Διαιρούμε την περίμετρο με το 4: 36 : 4 ＝ 9 cm.',
      },
      {
        id: 'tf7',
        q: 'Ένα κανονικό εξάγωνο με πλευρά 5 cm έχει περίμετρο 25 cm.',
        correct: 'Λάθος',
        explain: 'Το κανονικό εξάγωνο έχει 6 ίσες πλευρές, επομένως η περίμετρος είναι 6 · 5 ＝ 30 cm.',
      },
      {
        id: 'tf8',
        q: 'Ένας ρόμβος με πλευρά 7 cm έχει περίμετρο 28 cm.',
        correct: 'Σωστό',
        explain: 'Ο ρόμβος έχει 4 ίσες πλευρές, επομένως Π ＝ 4 · 7 ＝ 28 cm.',
      },
    ],
  },
  en: {
    metaTitle: 'Exercises: Calculating Perimeter | LearnMaths.gr',
    metaDesc:
      'Interactive Grade 4 math exercises on perimeter: calculating perimeter from diagrams, finding missing side lengths, and practical everyday word problems.',
    backText: 'Grade 4',
    theoryBtn: 'Theory',
    badge: 'GRADE 4 • PRACTICE',
    title: '📝 Exercises: Calculating Perimeter',
    subtitle: 'Click "New Exercises" to automatically refresh shapes and problems from the pool!',
    newQuestionsBtn: '🔄 New Exercises',
    checkBtn: '🎯 Check Answers',
    scoreLabel: '🏆 Score:',
    successRate: 'Success:',
    footerPrompt: 'Fill in your answers and click "Check Answers"!',
    correctAnswerIs: 'The correct answer is',
    correctAnswerIsMcq: 'The correct answer is:',
    statementIs: 'The statement is',
    perimeterLabel: 'Perimeter:',
    sideLabel: 'Side length:',
    numberPlaceholder: 'Number',
    trueText: 'True',
    falseText: 'False',
    unitM: 'm',
    unitCm: 'cm',
    qSquarePerimeter: (a) => `Calculate the perimeter of the square with side length a ＝ ${a} cm:`,
    expSquarePerimeter: (a, c) => `The square has 4 equal sides: 4 · ${a} ＝ ${c} cm.`,
    qRectPerimeter: (a, b) => `Calculate the perimeter of the rectangle with length ${a} cm and width ${b} cm:`,
    expRectPerimeter: (a, b, c) => `In a rectangle, we add both pairs of opposite sides: (2 · ${a}) ＋ (2 · ${b}) ＝ ${c} cm.`,
    qTrianglePerimeter: (a, b, c) => `Calculate the perimeter of the triangle with sides a ＝ ${a} cm, b ＝ ${b} cm, c ＝ ${c} cm:`,
    expTrianglePerimeter: (a, b, c, total) => `We add all sides of the triangle: ${a} ＋ ${b} ＋ ${c} ＝ ${total} cm.`,
    qSquareMissing: (p) => `A square has a total perimeter of ${p} cm. What is the length of one of its sides?`,
    expSquareMissing: (p, s) => `Since a square has 4 equal sides, we divide by 4: ${p} : 4 ＝ ${s} cm.`,
    qTriangleMissing: (p) => `An equilateral triangle (with 3 equal sides) has a perimeter of ${p} cm. What is the length of each side?`,
    expTriangleMissing: (p, s) => `Since an equilateral triangle has 3 equal sides, we divide by 3: ${p} : 3 ＝ ${s} cm.`,
    realProblems: [
      (loc) => {
        const w = getRandomInt(10, 30), h = getRandomInt(5, 15), c = 2 * w + 2 * h;
        return {
          id: 'rp1',
          q: `Mr. Nikos is fencing a rectangular garden with length ${w} m and width ${h} m. How many meters of wire fence will he need in total?`,
          correct: `${formatNum(c, loc)} m`,
          wrongs: [`${formatNum(w + h, loc)} m`, `${formatNum(2 * w + h, loc)} m`, `${formatNum(w + 2 * h, loc)} m`],
          explainText: `For a rectangular fence, we add all four sides: (2 · ${w}) ＋ (2 · ${h}) ＝ ${formatNum(c, loc)} m.`,
        };
      },
      (loc) => {
        const s = getRandomInt(6, 20), c = 4 * s;
        return {
          id: 'rp2',
          q: `A square playground has a side length of ${s} m. What is the total length of the protective railing surrounding it?`,
          correct: `${formatNum(c, loc)} m`,
          wrongs: [`${formatNum(s * 2, loc)} m`, `${formatNum(s * 3, loc)} m`, `${formatNum(s + 4, loc)} m`],
          explainText: `A square has 4 equal sides, so: 4 · ${s} ＝ ${formatNum(c, loc)} m.`,
        };
      },
      (loc) => {
        const w = getRandomInt(12, 25), h = getRandomInt(6, 12), c = 2 * w + 2 * h;
        return {
          id: 'rp3',
          q: `The schoolyard is rectangular with length ${w} m and width ${h} m. Children run 1 full lap around the yard. How many meters do they run?`,
          correct: `${formatNum(c, loc)} m`,
          wrongs: [`${formatNum(w + h, loc)} m`, `${formatNum(2 * (w + h) + 6, loc)} m`, `${formatNum(2 * w + h, loc)} m`],
          explainText: `One complete lap equals the perimeter of the rectangle: (2 · ${w}) ＋ (2 · ${h}) ＝ ${formatNum(c, loc)} m.`,
        };
      },
      (loc) => {
        const s = getRandomInt(8, 18), c = 4 * s;
        return {
          id: 'rp4',
          q: `A square plot of land has a side length of ${s} m. How many meters long is the wall surrounding it?`,
          correct: `${formatNum(c, loc)} m`,
          wrongs: [`${formatNum(s * 2, loc)} m`, `${formatNum(s * 3, loc)} m`, `${formatNum(s * 5, loc)} m`],
          explainText: `The perimeter of the square is given by the formula: 4 · ${s} ＝ ${formatNum(c, loc)} m.`,
        };
      },
      (loc) => {
        const w = getRandomInt(15, 35), h = getRandomInt(10, 20), c = 2 * w + 2 * h;
        return {
          id: 'rp5',
          q: `A 5-a-side soccer field has length ${w} m and width ${h} m. How many meters in total are the outer white boundary lines?`,
          correct: `${formatNum(c, loc)} m`,
          wrongs: [`${formatNum(w + h, loc)} m`, `${formatNum(2 * w + h, loc)} m`, `${formatNum(w + 2 * h, loc)} m`],
          explainText: `The outer boundary is the perimeter: (2 · ${w}) ＋ (2 · ${h}) ＝ ${formatNum(c, loc)} m.`,
        };
      },
      (loc) => {
        const w = getRandomInt(20, 50), h = getRandomInt(15, 30), c = 2 * w + 2 * h;
        return {
          id: 'rp6',
          q: `A rectangular picture frame has length ${w} cm and width ${h} cm. How many centimeters of wooden molding were needed to build its border?`,
          correct: `${formatNum(c, loc)} cm`,
          wrongs: [`${formatNum(w + h, loc)} cm`, `${formatNum(2 * w + h, loc)} cm`, `${formatNum(w + 2 * h, loc)} cm`],
          explainText: `The total length of the frame border is the perimeter: (2 · ${w}) ＋ (2 · ${h}) ＝ ${formatNum(c, loc)} cm.`,
        };
      },
      (loc) => {
        const s = getRandomInt(15, 40), c = 4 * s;
        return {
          id: 'rp7',
          q: `A square painting has a side length of ${s} cm. What is the total perimeter of its frame?`,
          correct: `${formatNum(c, loc)} cm`,
          wrongs: [`${formatNum(s * 2, loc)} cm`, `${formatNum(s * 3, loc)} cm`, `${formatNum(s + 4, loc)} cm`],
          explainText: `The square frame has a perimeter of 4 · ${s} ＝ ${formatNum(c, loc)} cm.`,
        };
      },
      (loc) => {
        const s = getRandomInt(12, 30), c = 3 * s;
        return {
          id: 'rp8',
          q: `An equilateral triangular road sign has a side length of ${s} cm. What is its perimeter?`,
          correct: `${formatNum(c, loc)} cm`,
          wrongs: [`${formatNum(s * 2, loc)} cm`, `${formatNum(s * 4, loc)} cm`, `${formatNum(s + 3, loc)} cm`],
          explainText: `The equilateral triangle has 3 equal sides: 3 · ${s} ＝ ${formatNum(c, loc)} cm.`,
        };
      },
    ],
    trueFalsePool: [
      {
        id: 'tf1',
        q: 'The perimeter of a shape is the total length of its outer boundary.',
        correct: 'True',
        explain: 'The perimeter equals the sum of the lengths of all outer boundary sides of a shape.',
      },
      {
        id: 'tf2',
        q: 'To find the perimeter of any polygon, we add the lengths of all its sides together.',
        correct: 'True',
        explain: 'The fundamental rule for calculating perimeter is adding all sides together.',
      },
      {
        id: 'tf3',
        q: 'The perimeter of a flat shape is measured in square meters (sq.m).',
        correct: 'False',
        explain: 'Square units (sq.m, sq.cm) measure surface area, not perimeter.',
      },
      {
        id: 'tf4',
        q: 'If we double the length of every side of a shape, its perimeter doubles.',
        correct: 'True',
        explain: 'When every side length is doubled, their total sum is doubled as well.',
      },
      {
        id: 'tf5',
        q: 'To find the perimeter of a rectangle, we add its length and width only once.',
        correct: 'False',
        explain: 'A rectangle has 4 sides, so we add the length twice and the width twice.',
      },
      {
        id: 'tf6',
        q: 'If a square has a total perimeter of 36 cm, its side length is equal to 9 cm.',
        correct: 'True',
        explain: 'We divide the perimeter by 4: 36 : 4 ＝ 9 cm.',
      },
      {
        id: 'tf7',
        q: 'A regular hexagon with side length 5 cm has a perimeter of 25 cm.',
        correct: 'False',
        explain: 'A regular hexagon has 6 equal sides, so its perimeter is 6 · 5 ＝ 30 cm.',
      },
      {
        id: 'tf8',
        q: 'A rhombus with side length 7 cm has a perimeter of 28 cm.',
        correct: 'True',
        explain: 'A rhombus has 4 equal sides, so P ＝ 4 · 7 ＝ 28 cm.',
      },
    ],
  },
};

// 1. Υπολογισμός Περιμέτρου από Σχήμα (SVG)
function makeShapePerimeterQuestion(t, locale, prevQ = null) {
  const shapes = ['square', 'rectangle', 'triangle'];
  let shapeType = shapes[getRandomInt(0, shapes.length - 1)];

  if (prevQ && prevQ.shapeType === shapeType) {
    shapeType = shapeType === 'square' ? 'rectangle' : 'square';
  }

  if (shapeType === 'square') {
    const a = getRandomInt(3, 12);
    const correct = 4 * a;
    return {
      shapeType,
      q: t.qSquarePerimeter(a),
      correct,
      unit: t.unitCm,
      inputLabel: t.perimeterLabel,
      explainText: t.expSquarePerimeter(a, correct),
      svg: (
        <svg className="w-52 h-32 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 200 120">
          <rect x="65" y="25" width="70" height="70" rx="3" fill="#f59e0b" fillOpacity="0.25" stroke="#f59e0b" strokeWidth="3.5" />
          <text x="100" y="18" fill="#fbbf24" fontWeight="bold" fontSize="12" fontFamily="monospace" textAnchor="middle">{a} cm</text>
          <text x="145" y="65" fill="#fbbf24" fontWeight="bold" fontSize="12" fontFamily="monospace">{a} cm</text>
        </svg>
      ),
    };
  } else if (shapeType === 'rectangle') {
    const a = getRandomInt(6, 15);
    const b = getRandomInt(3, a - 1);
    const correct = 2 * a + 2 * b;
    return {
      shapeType,
      q: t.qRectPerimeter(a, b),
      correct,
      unit: t.unitCm,
      inputLabel: t.perimeterLabel,
      explainText: t.expRectPerimeter(a, b, correct),
      svg: (
        <svg className="w-56 h-32 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 220 120">
          <rect x="40" y="30" width="140" height="60" rx="3" fill="#f59e0b" fillOpacity="0.25" stroke="#f59e0b" strokeWidth="3.5" />
          <text x="110" y="22" fill="#fbbf24" fontWeight="bold" fontSize="12" fontFamily="monospace" textAnchor="middle">{a} cm</text>
          <text x="190" y="65" fill="#fbbf24" fontWeight="bold" fontSize="12" fontFamily="monospace">{b} cm</text>
        </svg>
      ),
    };
  } else {
    const a = getRandomInt(4, 10);
    const b = getRandomInt(4, 10);
    const c = getRandomInt(4, 10);
    const correct = a + b + c;
    return {
      shapeType,
      q: t.qTrianglePerimeter(a, b, c),
      correct,
      unit: t.unitCm,
      inputLabel: t.perimeterLabel,
      explainText: t.expTrianglePerimeter(a, b, c, correct),
      svg: (
        <svg className="w-52 h-32 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 200 120">
          <polygon points="100,20 40,95 160,95" fill="#f59e0b" fillOpacity="0.25" stroke="#f59e0b" strokeWidth="3.5" strokeLinejoin="round" />
          <text x="56" y="55" fill="#fbbf24" fontWeight="bold" fontSize="11" fontFamily="monospace">{a} cm</text>
          <text x="140" y="55" fill="#fbbf24" fontWeight="bold" fontSize="11" fontFamily="monospace">{b} cm</text>
          <text x="100" y="112" fill="#fbbf24" fontWeight="bold" fontSize="11" fontFamily="monospace" textAnchor="middle">{c} cm</text>
        </svg>
      ),
    };
  }
}

// 2. Εύρεση Άγνωστης Πλευράς (Input)
function makeMissingSideQuestion(t, prevQ = null) {
  const isSquare = prevQ ? !prevQ.isSquare : Math.random() > 0.5;

  if (isSquare) {
    const side = getRandomInt(4, 15);
    const perim = side * 4;
    return {
      isSquare: true,
      q: t.qSquareMissing(perim),
      correct: side,
      unit: t.unitCm,
      inputLabel: t.sideLabel,
      explainText: t.expSquareMissing(perim, side),
    };
  } else {
    const side = getRandomInt(5, 18);
    const perim = side * 3;
    return {
      isSquare: false,
      q: t.qTriangleMissing(perim),
      correct: side,
      unit: t.unitCm,
      inputLabel: t.sideLabel,
      explainText: t.expTriangleMissing(perim, side),
    };
  }
}

// 3. Προβλήματα Καθημερινότητας (MCQ)
function makeRealProblemQuestion(t, locale, prevQ = null) {
  let probObj;
  while (true) {
    const rawFunc = t.realProblems[getRandomInt(0, t.realProblems.length - 1)];
    probObj = rawFunc(locale);
    if (!prevQ || prevQ.id !== probObj.id) break;
  }

  const rawOptions = [probObj.correct, ...probObj.wrongs.slice(0, 3)];
  const uniqueOptions = [...new Set(rawOptions)];
  const options = uniqueOptions.map((text) => ({
    text,
    isCorrect: text === probObj.correct,
  })).sort(() => Math.random() - 0.5);

  return { ...probObj, options };
}

// 4. Δημιουργία 8 Ερωτήσεων
function generateQuestions(t, locale) {
  const q1 = makeShapePerimeterQuestion(t, locale);
  const q2 = makeShapePerimeterQuestion(t, locale, q1);

  const q3 = makeMissingSideQuestion(t);
  const q4 = makeMissingSideQuestion(t, q3);

  const q5 = makeRealProblemQuestion(t, locale);
  const q6 = makeRealProblemQuestion(t, locale, q5);

  const tf1 = t.trueFalsePool[getRandomInt(0, t.trueFalsePool.length - 1)];
  let tf2;
  while (true) {
    tf2 = t.trueFalsePool[getRandomInt(0, t.trueFalsePool.length - 1)];
    if (tf2.id !== tf1.id) break;
  }

  return { q1, q2, q3, q4, q5, q6, q7: tf1, q8: tf2 };
}

export default function PerimetrosAskPage() {
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
    setQuestions(generateQuestions(t, locale));
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
            className={`${colorClass} text-slate-950 font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm`}
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
              {qData.inputLabel}
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
              className="w-28 sm:w-36 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-amber-950 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-sm"
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

  // Render Προβλημάτων Καθημερινότητας (Q5 & Q6, 4 Επιλογές)
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
          <span className="bg-orange-500 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
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
                    ? 'border-amber-600 bg-amber-50/80 font-bold text-amber-950 shadow-sm'
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
                  className="w-4 h-4 text-amber-600 focus:ring-amber-500 shrink-0"
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
          <span className="bg-rose-500 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
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
          href="/d-dimotikou/17-perimetros"
          className="bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> {t.theoryBtn}
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              {toCleanUppercase(t.badge)}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              {t.title}
            </h1>
            <p className="text-amber-100 text-xs sm:text-sm md:text-base">{t.subtitle}</p>
          </div>

          <button
            onClick={loadNewQuestions}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg hover:bg-amber-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            {t.newQuestionsBtn}
          </button>
        </div>

        {/* ΦΟΡΜΑ ΜΕ ΑΣΚΗΣΕΙΣ */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderInputNumber('q1', questions.q1, 1, 'bg-amber-400')}
          {renderInputNumber('q2', questions.q2, 2, 'bg-amber-400')}

          {renderInputNumber('q3', questions.q3, 3, 'bg-amber-500')}
          {renderInputNumber('q4', questions.q4, 4, 'bg-amber-500')}

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