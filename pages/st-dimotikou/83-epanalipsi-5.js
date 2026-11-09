// pages/st-dimotikou/83-epanalipsi-5.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// -------------------------------------------------------------
// DEFENSIVE UTILITY FUNCTIONS
// -------------------------------------------------------------

function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(ΣΤ')/g);
  return parts
    .map((part) => {
      if (part === "ΣΤ'") return "ΣΤ'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function formatNum(val, locale = 'el') {
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  const loc = locale === 'el' ? 'el-GR' : 'en-US';
  return Number(val).toLocaleString(loc, { maximumFractionDigits: 4 });
}

function ensureFourUniqueOptions(correctText, distractorsGen) {
  const candidates = distractorsGen();
  const rawList = [String(correctText).trim(), ...candidates.map((c) => String(c).trim())];
  const uniqueOptions = [...new Set(rawList.filter(Boolean))];

  const match = String(correctText).match(/^([0-9.,]+)(.*)$/);
  const baseNum = match ? parseFloat(match[1].replace(/\./g, '').replace(',', '.')) : NaN;
  const unit = match && match[2] ? match[2] : '';

  let offset = 1;
  while (uniqueOptions.length < 4) {
    let fallbackOpt;
    if (!isNaN(baseNum)) {
      const step = baseNum >= 100 ? 50 : baseNum >= 20 ? 10 : 2;
      const generatedNum = offset % 2 === 1
        ? baseNum + Math.ceil(offset / 2) * step
        : Math.max(1, baseNum - Math.ceil(offset / 2) * step);
      fallbackOpt = `${generatedNum}${unit}`;
    } else {
      fallbackOpt = `${correctText} ${offset}`;
    }

    if (!uniqueOptions.includes(fallbackOpt)) {
      uniqueOptions.push(fallbackOpt);
    }
    offset++;
  }

  return shuffle(uniqueOptions.slice(0, 4));
}

// -------------------------------------------------------------
// 32 ΔΕΞΑΜΕΝΕΣ ΕΡΩΤΗΣΕΩΝ (16 ΕΝΟΤΗΤΕΣ x 2 ΕΡΩΤΗΣΕΙΣ)
// ΥΠΟΣΤΗΡΙΞΗ i18n (el / en)
// -------------------------------------------------------------

// --- ΚΕΦΑΛΑΙΟ 67: ΕΙΔΗ ΓΩΝΙΩΝ & ΜΕΤΡΗΣΗ ---
const POOL_Q1 = [
  (isEl) => { const a = randInt(25, 80); return { prompt: isEl ? `Πώς ονομάζεται μια γωνία με μέτρο ${a}°;` : `What is an angle measuring ${a}° called?`, correct: isEl ? 'Οξεία γωνία' : 'Acute angle', distractors: isEl ? ['Ορθή γωνία', 'Αμβλεία γωνία', 'Ευθεία γωνία'] : ['Right angle', 'Obtuse angle', 'Straight angle'], expl: isEl ? 'Κάθε γωνία μικρότερη των 90° είναι οξεία.' : 'Any angle less than 90° is acute.' }; },
  (isEl) => ({ prompt: isEl ? 'Πόσες μοίρες μετράει ακριβώς μία ορθή γωνία;' : 'How many degrees does a right angle measure exactly?', correct: '90°', distractors: ['45°', '180°', '360°'], expl: isEl ? 'Μία ορθή γωνία είναι πάντοτε 90°.' : 'A right angle is always 90°.' }),
  (isEl) => { const a = randInt(95, 170); return { prompt: isEl ? `Πώς ονομάζεται μια γωνία με μέτρο ${a}°;` : `What is an angle measuring ${a}° called?`, correct: isEl ? 'Αμβλεία γωνία' : 'Obtuse angle', distractors: isEl ? ['Οξεία γωνία', 'Ορθή γωνία', 'Πλήρης γωνία'] : ['Acute angle', 'Right angle', 'Full angle'], expl: isEl ? 'Κάθε γωνία μεταξύ 90° και 180° είναι αμβλεία.' : 'Any angle between 90° and 180° is obtuse.' }; },
  (isEl) => ({ prompt: isEl ? 'Πόσες μοίρες μετράει μία ευθεία γωνία;' : 'How many degrees does a straight angle measure?', correct: '180°', distractors: ['90°', '270°', '360°'], expl: isEl ? 'Η ευθεία γωνία ισούται με 180° (δύο ορθές γωνίες).' : 'A straight angle equals 180° (two right angles).' }),
  (isEl) => ({ prompt: isEl ? 'Ποιο όργανο χρησιμοποιούμε για να μετρήσουμε τις μοίρες μιας γωνίας;' : 'Which instrument is used to measure the degrees of an angle?', correct: isEl ? 'Το μοιρογνωμόνιο' : 'Protractor', distractors: isEl ? ['Τον χάρακα', 'Τον διαβήτη', 'Το ζύγι'] : ['Ruler', 'Compass', 'Scale'], expl: isEl ? 'Το μοιρογνωμόνιο μετράει μοίρες.' : 'A protractor measures degrees.' }),
  (isEl) => ({ prompt: isEl ? 'Πόσες μοίρες είναι μία πλήρης γωνία (ολόκληρος κύκλος);' : 'How many degrees is a full angle (complete circle)?', correct: '360°', distractors: ['180°', '90°', '100°'], expl: isEl ? 'Ένας πλήρης κύκλος είναι 360°.' : 'A full circle is 360°.' }),
  (isEl) => { const a = randInt(10, 50); const b = 90 - a; return { prompt: isEl ? `Πόσες μοίρες είναι η συμπληρωματική μιας γωνίας ${a}° (ώστε να έχουν άθροισμα 90°);` : `How many degrees is the complementary angle of ${a}° (summing to 90°)?`, correct: `${b}°`, distractors: [`${180 - a}°`, `${90 + a}°`, `${a + 10}°`], expl: `90° － ${a}° ＝ ${b}°.` }; },
  (isEl) => { const a = randInt(60, 140); const b = 180 - a; return { prompt: isEl ? `Πόσες μοίρες είναι η παραπληρωματική μιας γωνίας ${a}° (ώστε να έχουν άθροισμα 180°);` : `How many degrees is the supplementary angle of ${a}° (summing to 180°)?`, correct: `${b}°`, distractors: [`${90 - a}°`, `${360 - a}°`, `${b + 20}°`], expl: `180° － ${a}° ＝ ${b}°.` }; }
];

const POOL_Q2 = [
  (isEl) => ({ prompt: isEl ? 'Σε ποιο σημείο τοποθετούμε το κέντρο του μοιρογνωμονίου κατά τη μέτρηση μιας γωνίας;' : 'Where do we place the center of the protractor when measuring an angle?', correct: isEl ? 'Ακριβώς στην κορυφή της γωνίας' : 'Exactly at the vertex of the angle', distractors: isEl ? ['Στο μέσο της μίας πλευράς', 'Στο τέλος της μίας πλευράς', 'Όπου θέλουμε στο χαρτί'] : ['At the midpoint of one side', 'At the end of one side', 'Anywhere on the paper'], expl: isEl ? 'Το κέντρο του οργάνου τοποθετείται πάντα στην κορυφή.' : 'The center of the instrument is placed strictly at the vertex.' }),
  (isEl) => { const a = randInt(10, 85); return { prompt: isEl ? `Αν μια γωνία είναι ${a}°, είναι μεγαλύτερη ή μικρότερη από την ορθή;` : `If an angle is ${a}°, is it greater or less than a right angle?`, correct: isEl ? 'Μικρότερη από την ορθή' : 'Less than a right angle', distractors: isEl ? ['Μεγαλύτερη από την ορθή', 'Ίση με την ορθή', 'Ίση με ευθεία'] : ['Greater than a right angle', 'Equal to a right angle', 'Equal to straight angle'], expl: `${a}° ＜ 90°.` }; },
  (isEl) => { const a = randInt(92, 160); return { prompt: isEl ? `Αν μια γωνία είναι ${a}°, είναι μεγαλύτερη ή μικρότερη από την ορθή;` : `If an angle is ${a}°, is it greater or less than a right angle?`, correct: isEl ? 'Μεγαλύτερη από την ορθή' : 'Greater than a right angle', distractors: isEl ? ['Μικρότερη από την ορθή', 'Ίση με την ορθή', 'Ευθεία'] : ['Less than a right angle', 'Equal to a right angle', 'Straight angle'], expl: `${a}° ＞ 90°.` }; },
  (isEl) => ({ prompt: isEl ? 'Πόσες ορθές γωνίες ισοδυναμούν με μία ευθεία γωνία (180°);' : 'How many right angles equal one straight angle (180°)?', correct: isEl ? '2 ορθές γωνίες' : '2 right angles', distractors: isEl ? ['4 ορθές γωνίες', '3 ορθές γωνίες', '1 ορθή γωνία'] : ['4 right angles', '3 right angles', '1 right angle'], expl: '2 · 90° ＝ 180°.' }),
  (isEl) => ({ prompt: isEl ? 'Πόσες ορθές γωνίες ισοδυναμούν με μία πλήρη γωνία (360°);' : 'How many right angles equal one full angle (360°)?', correct: isEl ? '4 ορθές γωνίες' : '4 right angles', distractors: isEl ? ['2 ορθές γωνίες', '6 ορθές γωνίες', '3 ορθές γωνίες'] : ['2 right angles', '6 right angles', '3 right angles'], expl: '4 · 90° ＝ 360°.' }),
  (isEl) => { const a = randInt(30, 70); return { prompt: isEl ? `Αν διπλασιάσουμε μία γωνία ${a}°, πόσες μοίρες γίνεται;` : `If we double an angle of ${a}°, how many degrees does it become?`, correct: `${2 * a}°`, distractors: [`${a + 10}°`, `${180 - a}°`, `${90 - a}°`], expl: `2 · ${a}° ＝ ${2 * a}°.` }; },
  (isEl) => { const a = randInt(40, 80) * 2; return { prompt: isEl ? `Αν χωρίσουμε στη μέση (διχοτομήσουμε) μία γωνία ${a}°, πόσες μοίρες είναι κάθε μισό;` : `If we bisect an angle of ${a}°, how many degrees is each half?`, correct: `${a / 2}°`, distractors: [`${a - 10}°`, `${a + 20}°`, `${180 - a}°`], expl: `${a}° : 2 ＝ ${a / 2}°.` }; },
  (isEl) => ({ prompt: isEl ? 'Ποιο είδος γωνίας σχηματίζουν οι δείκτες του ρολογιού στις 3 ακριβώς;' : 'What type of angle do clock hands form at exactly 3 o\'clock?', correct: isEl ? 'Ορθή γωνία (90°)' : 'Right angle (90°)', distractors: isEl ? ['Οξεία γωνία', 'Ευθεία γωνία', 'Αμβλεία γωνία'] : ['Acute angle', 'Straight angle', 'Obtuse angle'], expl: isEl ? 'Στις 3:00 οι δείκτες σχηματίζουν ακριβώς 90°.' : 'At 3:00 the hands form exactly 90°.' })
];

// --- ΚΕΦΑΛΑΙΟ 68: ΕΙΔΗ ΤΡΙΓΩΝΩΝ ---
const POOL_Q3 = [
  (isEl) => ({ prompt: isEl ? 'Πώς ονομάζεται ένα τρίγωνο που έχει και τις 3 πλευρές του ίσες;' : 'What is a triangle with all 3 sides equal called?', correct: isEl ? 'Ισόπλευρο τρίγωνο' : 'Equilateral triangle', distractors: isEl ? ['Ισοσκελές τρίγωνο', 'Σκαληνό τρίγωνο', 'Ορθογώνιο τρίγωνο'] : ['Isosceles triangle', 'Scalene triangle', 'Right triangle'], expl: isEl ? 'Ισόπλευρο: 3 ίσες πλευρές.' : 'Equilateral: 3 equal sides.' }),
  (isEl) => ({ prompt: isEl ? 'Πώς ονομάζεται ένα τρίγωνο που έχει μόνο 2 πλευρές ίσες;' : 'What is a triangle with only 2 sides equal called?', correct: isEl ? 'Ισοσκελές τρίγωνο' : 'Isosceles triangle', distractors: isEl ? ['Ισόπλευρο τρίγωνο', 'Σκαληνό τρίγωνο', 'Ορθογώνιο τρίγωνο'] : ['Equilateral triangle', 'Scalene triangle', 'Right triangle'], expl: isEl ? 'Ισοσκελές: 2 ίσες πλευρές.' : 'Isosceles: 2 equal sides.' }),
  (isEl) => ({ prompt: isEl ? 'Πώς ονομάζεται ένα τρίγωνο με 3 άνισες πλευρές;' : 'What is a triangle with 3 unequal sides called?', correct: isEl ? 'Σκαληνό τρίγωνο' : 'Scalene triangle', distractors: isEl ? ['Ισοσκελές τρίγωνο', 'Ισόπλευρο τρίγωνο', 'Οξυγώνιο τρίγωνο'] : ['Isosceles triangle', 'Equilateral triangle', 'Acute triangle'], expl: isEl ? 'Σκαληνό: καμία ίση πλευρά.' : 'Scalene: no equal sides.' }),
  (isEl) => ({ prompt: isEl ? 'Πώς ονομάζεται το τρίγωνο που έχει μία ορθή γωνία (90°);' : 'What is a triangle with one right angle (90°) called?', correct: isEl ? 'Ορθογώνιο τρίγωνο' : 'Right triangle', distractors: isEl ? ['Οξυγώνιο τρίγωνο', 'Αμβλυγώνιο τρίγωνο', 'Ισόπλευρο τρίγωνο'] : ['Acute triangle', 'Obtuse triangle', 'Equilateral triangle'], expl: isEl ? 'Ορθογώνιο: έχει 1 ορθή γωνία.' : 'Right triangle: has 1 right angle.' }),
  (isEl) => ({ prompt: isEl ? 'Πώς ονομάζεται το τρίγωνο που έχει μία αμβλεία γωνία (＞ 90°);' : 'What is a triangle with one obtuse angle (＞ 90°) called?', correct: isEl ? 'Αμβλυγώνιο τρίγωνο' : 'Obtuse triangle', distractors: isEl ? ['Οξυγώνιο τρίγωνο', 'Ορθογώνιο τρίγωνο', 'Ισοσκελές τρίγωνο'] : ['Acute triangle', 'Right triangle', 'Isosceles triangle'], expl: isEl ? 'Αμβλυγώνιο: έχει 1 αμβλεία γωνία.' : 'Obtuse triangle: has 1 obtuse angle.' }),
  (isEl) => ({ prompt: isEl ? 'Πώς ονομάζεται το τρίγωνο που έχει και τις 3 γωνίες του οξείες;' : 'What is a triangle with all 3 angles acute called?', correct: isEl ? 'Οξυγώνιο τρίγωνο' : 'Acute triangle', distractors: isEl ? ['Ορθογώνιο τρίγωνο', 'Αμβλυγώνιο τρίγωνο', 'Σκαληνό τρίγωνο'] : ['Right triangle', 'Obtuse triangle', 'Scalene triangle'], expl: isEl ? 'Οξυγώνιο: 3 οξείες γωνίες.' : 'Acute triangle: 3 acute angles.' }),
  (isEl) => ({ prompt: isEl ? 'Πόσες ορθές γωνίες μπορεί να έχει το πολύ ένα τρίγωνο;' : 'How many right angles can a triangle have at most?', correct: isEl ? 'Μία μόνο ορθή γωνία' : 'Only one right angle', distractors: isEl ? ['Δύο ορθές γωνίες', 'Τρεις ορθές γωνίες', 'Καμία'] : ['Two right angles', 'Three right angles', 'None'], expl: isEl ? 'Αν είχε δύο ορθές, θα συμπλήρωνε ήδη 180°.' : 'Two right angles would already sum to 180°.' }),
  (isEl) => ({ prompt: isEl ? 'Πόσες αμβλείες γωνίες μπορεί να έχει το πολύ ένα τρίγωνο;' : 'How many obtuse angles can a triangle have at most?', correct: isEl ? 'Μία μόνο αμβλεία γωνία' : 'Only one obtuse angle', distractors: isEl ? ['Δύο αμβλείες γωνίες', 'Τρεις αμβλείες γωνίες', 'Καμία'] : ['Two obtuse angles', 'Three obtuse angles', 'None'], expl: isEl ? 'Το πολύ μία, γιατί το άθροισμα δεν μπορεί να υπερβεί τις 180°.' : 'At most one, as sum cannot exceed 180°.' })
];

const POOL_Q4 = [
  (isEl) => ({ prompt: isEl ? 'Πόσες μοίρες είναι καθεμία από τις τρεις γωνίες ενός ισοπλεύρου τριγώνου;' : 'How many degrees is each angle of an equilateral triangle?', correct: '60°', distractors: ['45°', '90°', '50°'], expl: '180° : 3 ＝ 60°.' }),
  (isEl) => ({ prompt: isEl ? 'Σε ένα ισοσκελές τρίγωνο, τι ισχύει για τις δύο γωνίες της βάσης του;' : 'In an isosceles triangle, what is true about its two base angles?', correct: isEl ? 'Είναι πάντοτε ίσες μεταξύ τους' : 'They are always equal to each other', distractors: isEl ? ['Είναι πάντοτε άνισες', 'Είναι πάντοτε ορθές', 'Έχουν άθροισμα 180°'] : ['They are always unequal', 'They are always right angles', 'They sum to 180°'], expl: isEl ? 'Οι προσκείμενες στη βάση γωνίες είναι ίσες.' : 'Base angles are equal.' }),
  (isEl) => { const s = randInt(4, 12); return { prompt: isEl ? `Ένα ισόπλευρο τρίγωνο έχει πλευρά ${s} cm. Πόση είναι η περίμετρός του;` : `An equilateral triangle has side ${s} cm. What is its perimeter?`, correct: `${3 * s} cm`, distractors: [`${2 * s} cm`, `${4 * s} cm`, `${s * s} cm`], expl: `3 · ${s} ＝ ${3 * s} cm.` }; },
  (isEl) => { const a = randInt(5, 10); const b = randInt(3, 7); return { prompt: isEl ? `Ένα ισοσκελές τρίγωνο έχει δύο ίσες πλευρές των ${a} cm και βάση ${b} cm. Πόση είναι η περίμετρός του;` : `An isosceles triangle has two equal sides of ${a} cm and base ${b} cm. What is its perimeter?`, correct: `${2 * a + b} cm`, distractors: [`${a + b} cm`, `${3 * a} cm`, `${2 * a + 2 * b} cm`], expl: `${a} ＋ ${a} ＋ ${b} ＝ ${2 * a + b} cm.` }; },
  (isEl) => ({ prompt: isEl ? 'Μπορεί ένα ισόπλευρο τρίγωνο να είναι και ορθογώνιο;' : 'Can an equilateral triangle also be a right triangle?', correct: isEl ? 'Όχι, γιατί όλες οι γωνίες του είναι 60°' : 'No, because all its angles are 60°', distractors: isEl ? ['Ναι, πάντοτε', 'Ναι, αν είναι μεγάλο', 'Μόνο αν είναι ισοσκελές'] : ['Yes, always', 'Yes, if it is large', 'Only if isosceles'], expl: isEl ? 'Οι γωνίες του ισοπλεύρου είναι αυστηρά 60°.' : 'All equilateral angles are strictly 60°.' }),
  (isEl) => ({ prompt: isEl ? 'Μπορεί ένα ορθογώνιο τρίγωνο να είναι και ισοσκελές;' : 'Can a right triangle also be isosceles?', correct: isEl ? 'Ναι (με δύο οξείες γωνίες των 45°)' : 'Yes (with two acute angles of 45°)', distractors: isEl ? ['Όχι, ποτέ', 'Μόνο αν είναι ισόπλευρο', 'Μόνο σε σκαληνό'] : ['No, never', 'Only if equilateral', 'Only in scalene'], expl: isEl ? 'Ορθογώνιο ισοσκελές: γωνίες 90°, 45°, 45°.' : 'Right isosceles: angles 90°, 45°, 45°.' }),
  (isEl) => { const a = randInt(3, 8); const b = randInt(4, 9); const c = randInt(5, 11); return { prompt: isEl ? `Ένα σκαληνό τρίγωνο έχει πλευρές ${a} cm, ${b} cm και ${c} cm. Πόση είναι η περίμετρός του;` : `A scalene triangle has sides ${a} cm, ${b} cm, and ${c} cm. What is its perimeter?`, correct: `${a + b + c} cm`, distractors: [`${a + b} cm`, `${2 * (a + b)} cm`, `${a * b} cm`], expl: `${a} ＋ ${b} ＋ ${c} ＝ ${a + b + c} cm.` }; },
  (isEl) => ({ prompt: isEl ? 'Πώς λέγεται η μεγαλύτερη πλευρά ενός ορθογωνίου τριγώνου απέναντι από την ορθή γωνία;' : 'What is the longest side of a right triangle opposite the right angle called?', correct: isEl ? 'Υποτείνουσα' : 'Hypotenuse', distractors: isEl ? ['Κάθετη πλευρά', 'Ύψος', 'Διάμετρος'] : ['Leg', 'Altitude', 'Diameter'], expl: isEl ? 'Η απέναντι από την ορθή γωνία πλευρά λέγεται υποτείνουσα.' : 'The side opposite the right angle is the hypotenuse.' })
];

// --- ΚΕΦΑΛΑΙΟ 69: ΑΘΡΟΙΣΜΑ ΓΩΝΙΩΝ ΤΡΙΓΩΝΟΥ & ΤΕΤΡΑΠΛΕΥΡΟΥ ---
const POOL_Q5 = [
  (isEl) => ({ prompt: isEl ? 'Πόσο είναι πάντοτε το άθροισμα των τριών γωνιών σε οποιοδήποτε τρίγωνο;' : 'What is always the sum of the three angles in any triangle?', correct: '180°', distractors: ['360°', '90°', '270°'], expl: isEl ? 'Σε κάθε τρίγωνο Â ＋ B̂ ＋ Γ̂ ＝ 180°.' : 'In any triangle, angles sum to 180°.' }),
  (isEl) => { const a = randInt(30, 70); const b = randInt(40, 75); const c = 180 - a - b; return { prompt: isEl ? `Σε ένα τρίγωνο οι δύο γωνίες είναι ${a}° και ${b}°. Πόσες μοίρες είναι η τρίτη γωνία;` : `In a triangle, two angles measure ${a}° and ${b}°. What is the measure of the third angle?`, correct: `${c}°`, distractors: [`${c + 10}°`, `${c - 10}°`, `${180 - a}°`], expl: `180° － (${a}° ＋ ${b}°) ＝ ${c}°.` }; },
  (isEl) => { const a = randInt(25, 65); const b = 90 - a; return { prompt: isEl ? `Σε ένα ορθογώνιο τρίγωνο (μία γωνία 90°) η μία οξεία γωνία είναι ${a}°. Πόσο είναι η άλλη;` : `In a right triangle, one acute angle is ${a}°. What is the other?`, correct: `${b}°`, distractors: [`${b + 15}°`, `${180 - a}°`, `${a}°`], expl: `90° － ${a}° ＝ ${b}°.` }; },
  (isEl) => ({ prompt: isEl ? 'Σε ένα ισοσκελές ορθογώνιο τρίγωνο, πόσες μοίρες είναι καθεμία από τις δύο ίσες οξείες γωνίες;' : 'In an isosceles right triangle, how many degrees is each of the two equal acute angles?', correct: '45°', distractors: ['30°', '60°', '50°'], expl: '90° : 2 ＝ 45°.' }),
  (isEl) => { const top = randInt(20, 50) * 2; const base = (180 - top) / 2; return { prompt: isEl ? `Σε ένα ισοσκελές τρίγωνο η γωνία κορυφής είναι ${top}°. Πόσες μοίρες είναι καθεμία από τις 2 γωνίες της βάσης;` : `In an isosceles triangle, the vertex angle is ${top}°. How many degrees is each of the 2 base angles?`, correct: `${base}°`, distractors: [`${base + 10}°`, `${180 - top}°`, `${top}°`], expl: `(180° － ${top}°) : 2 ＝ ${base}°.` }; },
  (isEl) => { const base = randInt(35, 75); const top = 180 - 2 * base; return { prompt: isEl ? `Σε ένα ισοσκελές τρίγωνο μία γωνία της βάσης είναι ${base}°. Πόσες μοίρες είναι η γωνία της κορυφής;` : `In an isosceles triangle, one base angle is ${base}°. What is the vertex angle?`, correct: `${top}°`, distractors: [`${top + 15}°`, `${180 - base}°`, `${2 * base}°`], expl: `180° － (2 · ${base}°) ＝ ${top}°.` }; },
  (isEl) => ({ prompt: isEl ? 'Μπορεί ένα τρίγωνο να έχει γωνίες 70°, 60° και 60°;' : 'Can a triangle have angles 70°, 60°, and 60°?', correct: isEl ? 'Όχι, γιατί το άθροισμά τους είναι 190° (όχι 180°)' : 'No, because their sum is 190° (not 180°)', distractors: isEl ? ['Ναι, είναι ισοσκελές', 'Ναι, αν είναι μεγάλο', 'Ναι, σε οξυγώνιο'] : ['Yes, it is isosceles', 'Yes, if large', 'Yes, in acute'], expl: '70 ＋ 60 ＋ 60 ＝ 190° ≠ 180°.' }),
  (isEl) => ({ prompt: isEl ? 'Μπορεί ένα τρίγωνο να έχει γωνίες 50°, 60° και 70°;' : 'Can a triangle have angles 50°, 60°, and 70°?', correct: isEl ? 'Ναι, γιατί έχουν άθροισμα ακριβώς 180°' : 'Yes, because their sum is exactly 180°', distractors: isEl ? ['Όχι, γιατί είναι άνισες', 'Όχι, λείπει ορθή γωνία', 'Μόνο αν είναι ισόπλευρο'] : ['No, they are unequal', 'No, missing right angle', 'Only if equilateral'], expl: '50 ＋ 60 ＋ 70 ＝ 180°.' })
];

const POOL_Q6 = [
  (isEl) => ({ prompt: isEl ? 'Πόσο είναι πάντοτε το άθροισμα των τεσσάρων γωνιών σε οποιοδήποτε τετράπλευρο;' : 'What is always the sum of the four angles in any quadrilateral?', correct: '360°', distractors: ['180°', '270°', '540°'], expl: isEl ? 'Κάθε τετράπλευρο χωρίζεται σε 2 τρίγωνα (2 · 180° ＝ 360°).' : 'Divided by a diagonal into 2 triangles: 2 · 180° ＝ 360°.' }),
  (isEl) => { const a = 90, b = 90, c = randInt(60, 110), d = 360 - a - b - c; return { prompt: isEl ? `Ένα τραπέζιο έχει τρεις γωνίες ${a}°, ${b}° και ${c}°. Πόσες μοίρες είναι η τέταρτη γωνία;` : `A trapezoid has three angles measuring ${a}°, ${b}°, and ${c}°. What is the fourth angle?`, correct: `${d}°`, distractors: [`${d + 10}°`, `${d - 10}°`, `${180 - c + 10}°`], expl: `360° － (${a} ＋ ${b} ＋ ${c}) ＝ ${d}°.` }; },
  (isEl) => { const a = randInt(70, 100), b = randInt(80, 110), c = randInt(65, 95), d = 360 - a - b - c; return { prompt: isEl ? `Σε ένα τετράπλευρο οι τρεις γωνίες είναι ${a}°, ${b}° και ${c}°. Πόσο μετράει η 4η γωνία;` : `In a quadrilateral, three angles are ${a}°, ${b}°, and ${c}°. What is the 4th angle?`, correct: `${d}°`, distractors: [`${d + 15}°`, `${d - 15}°`, `${180 - a}°`], expl: `360° － (${a} ＋ ${b} ＋ ${c}) ＝ ${d}°.` }; },
  (isEl) => ({ prompt: isEl ? 'Γιατί το άθροισμα γωνιών τετραπλεύρου είναι 360°; ' : 'Why is the sum of angles in a quadrilateral 360°?', correct: isEl ? 'Επειδή μία διαγώνιος το χωρίζει σε 2 τρίγωνα (2 · 180° ＝ 360°)' : 'Because one diagonal splits it into 2 triangles (2 · 180° ＝ 360°)', distractors: isEl ? ['Επειδή έχει 4 πλευρές των 90°', 'Επειδή είναι κύκλος', 'Επειδή έτσι μετράει ο χάρακας'] : ['Because it has 4 sides of 90°', 'Because it is a circle', 'By ruler convention'], expl: '2 · 180° ＝ 360°.' }),
  (isEl) => { const a = randInt(50, 80); const b = 180 - a; return { prompt: isEl ? `Σε ένα παραλληλόγραμμο μία οξεία γωνία είναι ${a}°. Πόσες μοίρες είναι η διπλανή της (αμβλεία) γωνία;` : `In a parallelogram, one acute angle is ${a}°. How many degrees is the adjacent obtuse angle?`, correct: `${b}°`, distractors: [`${a}°`, `${360 - a}°`, `${90 - a}°`], expl: `180° － ${a}° ＝ ${b}°.` }; },
  (isEl) => { const a = randInt(55, 75); return { prompt: isEl ? `Σε ένα παραλληλόγραμμο η γωνία Â είναι ${a}°. Πόσες μοίρες είναι η απέναντι γωνία Γ̂;` : `In a parallelogram, angle A is ${a}°. What is opposite angle C?`, correct: isEl ? `${a}° (οι απέναντι γωνίες είναι ίσες)` : `${a}° (opposite angles are equal)`, distractors: [`${180 - a}°`, '90°', `${2 * a}°`], expl: isEl ? 'Στο παραλληλόγραμμο οι απέναντι γωνίες είναι ίσες.' : 'Opposite angles are equal.' }; },
  (isEl) => ({ prompt: isEl ? 'Πόσο είναι το άθροισμα των γωνιών ενός ορθογωνίου παραλληλογράμμου;' : 'What is the sum of angles of a rectangle?', correct: isEl ? '360° (4 ορθές των 90°)' : '360° (4 right angles of 90°)', distractors: ['180°', '270°', '400°'], expl: '4 · 90° ＝ 360°.' }),
  (isEl) => ({ prompt: isEl ? 'Σε ένα τετράπλευρο όλες οι γωνίες είναι ίσες μεταξύ τους. Πόσες μοίρες είναι η καθεμία;' : 'In a quadrilateral, all four angles are equal. How many degrees is each?', correct: '90°', distractors: ['60°', '80°', '100°'], expl: '360° : 4 ＝ 90°.' })
];

// --- ΚΕΦΑΛΑΙΟ 70: ΜΕΓΕΘΥΝΣΗ - ΣΜΙΚΡΥΝΣΗ & ΚΛΙΜΑΚΑ ---
const POOL_Q7 = [
  (isEl) => ({ prompt: isEl ? 'Όταν μεγεθύνουμε ή σμικρύνουμε ένα γεωμετρικό σχήμα, τι συμβαίνει με τις γωνίες του;' : 'When scaling a geometric figure up or down, what happens to its angles?', correct: isEl ? 'Παραμένουν απολύτως ίδιες (δεν αλλάζουν)' : 'They remain unchanged (equal)', distractors: isEl ? ['Μεγαλώνουν ανάλογα', 'Μικραίνουν ανάλογα', 'Διπλασιάζονται'] : ['They increase proportionally', 'They decrease proportionally', 'They double'], expl: isEl ? 'Στα όμοια σχήματα οι γωνίες παραμένουν αναλλοίωτες.' : 'Angles in similar shapes remain constant.' }),
  (isEl) => ({ prompt: isEl ? 'Τι εκφράζει η κλίμακα σε έναν χάρτη ή σχέδιο;' : 'What does the scale on a map or plan express?', correct: isEl ? 'Τον λόγο του μήκους στο σχέδιο προς το πραγματικό μήκος' : 'The ratio of plan length to actual length', distractors: isEl ? ['Το συνολικό βάρος του χάρτη', 'Την επιφάνεια του χαρτιού', 'Τη διαφορά μήκους και πλάτους'] : ['Total map weight', 'Paper surface area', 'Difference between length and width'], expl: isEl ? 'Κλίμακα ＝ Μήκος στο σχέδιο : Πραγματικό μήκος.' : 'Scale ＝ Map length : Real length.' }),
  (isEl) => ({ prompt: isEl ? 'Τι σημαίνει κλίμακα 1 : 100 στην κάτοψη ενός σπιτιού;' : 'What does a 1 : 100 scale on a floor plan mean?', correct: isEl ? '1 cm στο σχέδιο ισούται με 100 cm (1 m) στην πραγματικότητα' : '1 cm on plan equals 100 cm (1 m) in reality', distractors: isEl ? ['1 cm στο σχέδιο ισούται με 100 m', 'Το σπίτι είναι 100 φορές μεγαλύτερο από τη Γη', 'Το σχέδιο έχει 100 δωμάτια'] : ['1 cm on plan equals 100 m', 'House is 100 times bigger than Earth', 'Plan has 100 rooms'], expl: isEl ? '1 cm στο χαρτί αντιστοιχεί σε 100 cm (1 μέτρο).' : '1 cm corresponds to 100 cm (1 meter).' }),
  (isEl) => { const s = randInt(2, 6); return { prompt: isEl ? `Αν διπλασιάσουμε όλες τις πλευρές ενός τετραγώνου πλευράς ${s} cm, πόσες φορές μεγαλύτερη γίνεται η περίμετρός του;` : `If we double all sides of a square of side ${s} cm, how many times larger does its perimeter become?`, correct: isEl ? '2 φορές μεγαλύτερη (διπλασιάζεται)' : '2 times larger (doubles)', distractors: isEl ? ['4 φορές μεγαλύτερη', '8 φορές μεγαλύτερη', 'Παραμένει ίδια'] : ['4 times larger', '8 times larger', 'Remains the same'], expl: isEl ? 'Η περίμετρος είναι μήκος, άρα διπλασιάζεται.' : 'Perimeter is linear, so it doubles.' }; },
  (isEl) => ({ prompt: isEl ? 'Αν διπλασιάσουμε όλες τις πλευρές ενός σχήματος, πόσες φορές μεγαλύτερο γίνεται το εμβαδόν του;' : 'If we double all sides of a shape, how many times larger does its area become?', correct: isEl ? '4 φορές μεγαλύτερο (τετραπλασιάζεται)' : '4 times larger (quadruples)', distractors: isEl ? ['2 φορές μεγαλύτερο', '8 φορές μεγαλύτερο', '16 φορές μεγαλύτερο'] : ['2 times larger', '8 times larger', '16 times larger'], expl: 'λ² ＝ 2 · 2 ＝ 4.' }),
  (isEl) => ({ prompt: isEl ? 'Αν τριπλασιάσουμε όλες τις πλευρές ενός σχήματος, πόσες φορές μεγαλύτερο γίνεται το εμβαδόν του;' : 'If we triple all sides of a shape, how many times larger does its area become?', correct: isEl ? '9 φορές μεγαλύτερο' : '9 times larger', distractors: isEl ? ['3 φορές μεγαλύτερο', '6 φορές μεγαλύτερο', '27 φορές μεγαλύτερο'] : ['3 times larger', '6 times larger', '27 times larger'], expl: 'λ² ＝ 3 · 3 ＝ 9.' }),
  (isEl) => { const cm = randInt(3, 8); return { prompt: isEl ? `Σε χάρτη με κλίμακα 1 : 100.000 (1 cm ＝ 1 km), δύο χωριά απέχουν ${cm} cm. Πόσα km απέχουν στην πραγματικότητα;` : `On a 1 : 100,000 scale map (1 cm ＝ 1 km), two villages are ${cm} cm apart. What is the real distance in km?`, correct: `${cm} km`, distractors: [`${cm * 10} km`, `${cm * 100} km`, `${formatNum(cm / 10, isEl ? 'el' : 'en')} km`], expl: isEl ? `Κάθε 1 cm είναι 1 km, άρα ${cm} km.` : `Each 1 cm is 1 km, so ${cm} km.` }; },
  (isEl) => { const cm = randInt(2, 6); return { prompt: isEl ? `Σε χάρτη με κλίμακα 1 : 1.000.000 (1 cm ＝ 10 km), δύο πόλεις απέχουν ${cm} cm. Πόσα km είναι η πραγματική απόσταση;` : `On a 1 : 1,000,000 scale map (1 cm ＝ 10 km), two cities are ${cm} cm apart. What is the actual distance in km?`, correct: `${cm * 10} km`, distractors: [`${cm} km`, `${cm * 100} km`, `${cm * 2} km`], expl: `${cm} · 10 km ＝ ${cm * 10} km.` }; }
];

const POOL_Q8 = [
  (isEl) => { const cm = randInt(4, 12); const mVal = (cm * 50) / 100; return { prompt: isEl ? `Στην κάτοψη ενός δωματίου με κλίμακα 1 : 50, ένας τοίχος μετρήθηκε ${cm} cm. Πόσα μέτρα (m) είναι το πραγματικό του μήκος;` : `On a 1 : 50 room plan, a wall measures ${cm} cm. What is its real length in meters?`, correct: `${formatNum(mVal, isEl ? 'el' : 'en')} m`, distractors: [`${cm} m`, `${formatNum(cm * 50, isEl ? 'el' : 'en')} m`, `${formatNum(cm / 2, isEl ? 'el' : 'en')} m`], expl: `${cm} · 50 ＝ ${cm * 50} cm ＝ ${formatNum(mVal, isEl ? 'el' : 'en')} m.` }; },
  (isEl) => { const m = randInt(3, 8); return { prompt: isEl ? `Ένας τοίχος μήκους ${m} m (${m * 100} cm) σχεδιάζεται με κλίμακα 1 : 100. Πόσα cm θα είναι στο χαρτί;` : `A wall of length ${m} m (${m * 100} cm) is drawn at scale 1 : 100. How many cm will it be on paper?`, correct: `${m} cm`, distractors: [`${m * 10} cm`, `${m * 2} cm`, `${formatNum(m / 2, isEl ? 'el' : 'en')} cm`], expl: `${m * 100} : 100 ＝ ${m} cm.` }; },
  (isEl) => ({ prompt: isEl ? 'Ένα ορθογώνιο 4 × 2 μεγεθύνεται ώστε το μήκος του να γίνει 8. Πόσο πρέπει να γίνει το πλάτος του για να είναι όμοιο;' : 'A 4 × 2 rectangle is scaled so length becomes 8. What must width become to remain similar?', correct: isEl ? '4 (διπλασιάζεται και το πλάτος)' : '4 (width doubles as well)', distractors: isEl ? ['2 (μένει ίδιο)', '6', '8'] : ['2 (remains same)', '6', '8'], expl: '2 · 2 ＝ 4.' }),
  (isEl) => ({ prompt: isEl ? 'Αν υποδιπλασιάσουμε τις πλευρές ενός τετραγώνου (σμίκρυνση στο 1/2), πώς αλλάζει το εμβαδόν του;' : 'If sides of a square are halved (scaled to 1/2), how does area change?', correct: isEl ? 'Γίνεται 4 φορές μικρότερο (στο 1/4)' : 'Becomes 4 times smaller (to 1/4)', distractors: isEl ? ['Μειώνεται στο μισό (1/2)', 'Μειώνεται στο 1/8', 'Παραμένει ίδιο'] : ['Halved (1/2)', 'Reduced to 1/8', 'Remains same'], expl: '2 · 2 ＝ 4.' }),
  (isEl) => ({ prompt: isEl ? 'Δύο πόλεις απέχουν 4 cm σε χάρτη με κλίμακα 1 : 500.000 (1 cm ＝ 5 km). Πόσα km απέχουν στην πραγματικότητα;' : 'Two cities are 4 cm apart on a 1 : 500,000 scale map (1 cm ＝ 5 km). What is actual distance?', correct: '20 km', distractors: ['40 km', '10 km', '200 km'], expl: '4 · 5 km ＝ 20 km.' }),
  (isEl) => ({ prompt: isEl ? 'Ποιο από τα παρακάτω εκφράζει μεγέθυνση ενός αντικειμένου;' : 'Which scale represents magnification (enlargement)?', correct: '5 : 1', distractors: ['1 : 5', '1 : 100', '1 : 1'], expl: isEl ? '5 : 1 σημαίνει ότι το σχέδιο είναι 5 φορές μεγαλύτερο.' : '5 : 1 means drawn 5 times larger.' }),
  (isEl) => ({ prompt: isEl ? 'Πριν υπολογίσουμε την κλίμακα ως λόγο δύο μηκών, τι πρέπει να προσέξουμε;' : 'Before computing scale as a ratio of lengths, what must we ensure?', correct: isEl ? 'Και τα δύο μήκη να εκφράζονται στην ίδια μονάδα μέτρησης (π.χ. σε cm)' : 'Both lengths must be in the same measurement units (e.g., cm)', distractors: isEl ? ['Το ένα να είναι σε m και το άλλο σε km', 'Να υπολογίσουμε πρώτα το εμβαδόν', 'Να διαιρέσουμε με το 3,14'] : ['One in m and the other in km', 'First compute area', 'Divide by 3.14'], expl: isEl ? 'Ο λόγος απαιτεί κοινή μονάδα μέτρησης.' : 'Ratios require identical units.' }),
  (isEl) => ({ prompt: isEl ? 'Αν ένα σχήμα έχει εμβαδόν 10 cm² και τετραπλασιάσουμε όλες τις πλευρές του (λ ＝ 4), ποιο θα είναι το νέο εμβαδόν;' : 'If a shape has area 10 cm² and sides are quadrupled (λ ＝ 4), what is the new area?', correct: '160 cm²', distractors: ['40 cm²', '80 cm²', '400 cm²'], expl: '10 · (4 · 4) ＝ 160 cm².' })
];

// --- ΚΕΦΑΛΑΙΟ 71: ΑΞΟΝΙΚΗ ΣΥΜΜΕΤΡΙΑ ---
const POOL_Q9 = [
  (isEl) => ({ prompt: isEl ? 'Τι συμβαίνει όταν διπλώσουμε ένα σχήμα κατά μήκος ενός άξονα συμμετρίας του;' : 'What happens when folding a figure along its axis of symmetry?', correct: isEl ? 'Τα δύο μέρη εφαρμόζουν απόλυτα το ένα πάνω στο άλλο' : 'The two halves match exactly onto each other', distractors: isEl ? ['Το ένα μέρος είναι διπλάσιο', 'Δεν εφαρμόζουν καθόλου', 'Αλλάζει το σχήμα τους'] : ['One half is double', 'They do not match at all', 'Their shape changes'], expl: isEl ? 'Αυτός είναι ο ορισμός του άξονα συμμετρίας.' : 'Definition of reflectional symmetry.' }),
  (isEl) => { const d = randInt(3, 9); return { prompt: isEl ? `Ένα σημείο Α απέχει ${d} cm από έναν άξονα συμμετρίας. Πόση είναι η συνολική απόσταση ανάμεσα στο σημείο Α και στο συμμετρικό του σημείο Α';` : `Point A is ${d} cm from an axis of symmetry. What is the total distance between A and its reflection A'?`, correct: `${2 * d} cm`, distractors: [`${d} cm`, `${2 * d + 2} cm`, `${d * d} cm`], expl: `${d} ＋ ${d} ＝ ${2 * d} cm.` }; },
  (isEl) => { const total = randInt(6, 16) * 2; return { prompt: isEl ? `Δύο συμμετρικά σημεία Α και Α' απέχουν μεταξύ τους ${total} cm. Πόσο απέχει το σημείο Α από τον άξονα συμμετρίας;` : `Two symmetric points A and A' are ${total} cm apart. How far is A from the axis?`, correct: `${total / 2} cm`, distractors: [`${total} cm`, `${total / 4} cm`, `${total - 2} cm`], expl: `${total} : 2 ＝ ${total / 2} cm.` }; },
  (isEl) => ({ prompt: isEl ? 'Πώς συνδέεται το ευθύγραμμο τμήμα ΑΑ\' δύο συμμετρικών σημείων με τον άξονα συμμετρίας;' : 'How is segment AA\' of two symmetric points related to the axis of symmetry?', correct: isEl ? 'Είναι κάθετο στον άξονα (γωνία 90°) και διχοτομείται από αυτόν' : 'It is perpendicular to the axis (90°) and bisected by it', distractors: isEl ? ['Είναι παράλληλο στον άξονα', 'Σχηματίζει γωνία 45°', 'Δεν τέμνει τον άξονα'] : ['Parallel to the axis', 'Forms a 45° angle', 'Does not intersect axis'], expl: isEl ? 'Ο άξονας είναι η μεσοκάθετος του τμήματος ΑΑ\'.' : 'The axis is the perpendicular bisector of AA\'.' }),
  (isEl) => ({ prompt: isEl ? 'Αν ένα σημείο βρίσκεται ακριβώς πάνω στον άξονα συμμετρίας, πού βρίσκεται το συμμετρικό του;' : 'If a point lies directly on the axis of symmetry, where is its reflection?', correct: isEl ? 'Ταυτίζεται με το ίδιο το σημείο' : 'It coincides with the point itself', distractors: isEl ? ['Στο άπειρο', 'Στην απέναντι γωνία', 'Δεν υπάρχει συμμετρικό'] : ['At infinity', 'At opposite corner', 'No reflection exists'], expl: isEl ? 'Έχει απόσταση 0 από τον άξονα.' : 'Distance from axis is 0.' }),
  (isEl) => ({ prompt: isEl ? 'Είναι η διαγώνιος ενός ορθογωνίου παραλληλογράμμου (με άνισες πλευρές) άξονας συμμετρίας του;' : 'Is the diagonal of a non-square rectangle an axis of symmetry?', correct: isEl ? 'Όχι, γιατί αν διπλώσουμε στη διαγώνιο οι γωνίες δεν εφαρμόζουν' : 'No, folding along diagonal does not align vertices', distractors: isEl ? ['Ναι, πάντοτε', 'Ναι, αν είναι μεγάλο', 'Μόνο αν έχει εμβαδόν 100'] : ['Yes, always', 'Yes, if large', 'Only if area is 100'], expl: isEl ? 'Οι διαγώνιοι του ορθογωνίου δεν είναι άξονες συμμετρίας.' : 'Diagonals of a rectangle are not lines of symmetry.' }),
  (isEl) => ({ prompt: isEl ? 'Πόσους άξονες συμμετρίας έχει ένα τετράγωνο;' : 'How many axes of symmetry does a square have?', correct: isEl ? '4 άξονες συμμετρίας' : '4 axes of symmetry', distractors: isEl ? ['2 άξονες συμμετρίας', '1 άξονα συμμετρίας', '8 άξονες συμμετρίας'] : ['2 axes', '1 axis', '8 axes'], expl: isEl ? '2 μεσοκάθετες και 2 διαγώνιοι.' : '2 mid-lines and 2 diagonals.' }),
  (isEl) => ({ prompt: isEl ? 'Πόσους άξονες συμμετρίας έχει ένα ορθογώνιο παραλληλόγραμμο;' : 'How many axes of symmetry does a rectangle have?', correct: isEl ? '2 άξονες συμμετρίας (τις μεσοκάθετες των πλευρών)' : '2 axes of symmetry (the side bisectors)', distractors: isEl ? ['4 άξονες συμμετρίας', '1 άξονα συμμετρίας', 'Κανέναν'] : ['4 axes', '1 axis', 'None'], expl: isEl ? 'Έχει ακριβώς 2 άξονες συμμετρίας.' : 'A rectangle has exactly 2 lines of symmetry.' })
];

const POOL_Q10 = [
  (isEl) => ({ prompt: isEl ? 'Πόσους άξονες συμμετρίας έχει ένα ισόπλευρο τρίγωνο;' : 'How many axes of symmetry does an equilateral triangle have?', correct: isEl ? '3 άξονες συμμετρίας' : '3 axes of symmetry', distractors: isEl ? ['1 άξονα συμμετρίας', '2 άξονες συμμετρίας', 'Άπειρους'] : ['1 axis', '2 axes', 'Infinite'], expl: isEl ? '3 μεσοκάθετοι (3 άξονες).' : '3 medians/bisectors.' }),
  (isEl) => ({ prompt: isEl ? 'Πόσους άξονες συμμετρίας έχει ένα ισοσκελές τρίγωνο (με 2 μόνο ίσες πλευρές);' : 'How many lines of symmetry does an isosceles triangle have?', correct: isEl ? '1 άξονα συμμετρίας' : '1 axis of symmetry', distractors: isEl ? ['2 άξονες συμμετρίας', '3 άξονες συμμετρίας', 'Κανέναν'] : ['2 axes', '3 axes', 'None'], expl: isEl ? 'Μόνο τη μεσοκάθετο της βάσης.' : 'Only the altitude to the base.' }),
  (isEl) => ({ prompt: isEl ? 'Πόσους άξονες συμμετρίας έχει ένας ρόμβος;' : 'How many lines of symmetry does a rhombus have?', correct: isEl ? '2 άξονες συμμετρίας (τις δύο διαγωνίους του)' : '2 axes of symmetry (its two diagonals)', distractors: isEl ? ['4 άξονες συμμετρίας', '1 άξονα συμμετρίας', 'Κανέναν'] : ['4 axes', '1 axis', 'None'], expl: isEl ? 'Οι 2 διαγώνιοι είναι οι άξονες.' : 'Its 2 diagonals are the axes.' }),
  (isEl) => ({ prompt: isEl ? 'Πόσους άξονες συμμετρίας έχει ένας κύκλος;' : 'How many axes of symmetry does a circle have?', correct: isEl ? 'Άπειρους άξονες συμμετρίας' : 'Infinitely many axes of symmetry', distractors: isEl ? ['360 άξονες', '4 άξονες', '2 άξονες'] : ['360 axes', '4 axes', '2 axes'], expl: isEl ? 'Κάθε ευθεία που περνά από το κέντρο είναι άξονας.' : 'Every diameter is an axis of symmetry.' }),
  (isEl) => ({ prompt: isEl ? 'Πόσους άξονες συμμετρίας έχει ένα κανονικό εξάγωνο;' : 'How many axes of symmetry does a regular hexagon have?', correct: isEl ? '6 άξονες συμμετρίας' : '6 axes of symmetry', distractors: isEl ? ['3 άξονες συμμετρίας', '4 άξονες συμμετρίας', '12 άξονες συμμετρίας'] : ['3 axes', '4 axes', '12 axes'], expl: isEl ? 'Κάθε κανονικό ν-γωνο έχει ν άξονες.' : 'A regular n-gon has n axes.' }),
  (isEl) => ({ prompt: isEl ? 'Πόσους άξονες συμμετρίας έχει ένα πλάγιο παραλληλόγραμμο;' : 'How many axes of symmetry does a general non-rhombus parallelogram have?', correct: isEl ? '0 άξονες συμμετρίας (κανέναν)' : '0 axes of symmetry (none)', distractors: isEl ? ['2 άξονες συμμετρίας', '1 άξονα συμμετρίας', '4 άξονες συμμετρίας'] : ['2 axes', '1 axis', '4 axes'], expl: isEl ? 'Δεν έχει αξονική συμμετρία.' : 'Has no line symmetry.' }),
  (isEl) => { const a = 25; return { prompt: isEl ? `Ένα τρίγωνο έχει εμβαδόν ${a} cm². Πόσο είναι το εμβαδόν του συμμετρικού του τριγώνου;` : `A triangle has area ${a} cm². What is the area of its reflection?`, correct: isEl ? `${a} cm² (απολύτως ίσο)` : `${a} cm² (congruent and equal)`, distractors: [`${2 * a} cm²`, `${formatNum(a / 2, isEl ? 'el' : 'en')} cm²`, `${a + 10} cm²`], expl: isEl ? 'Η συμμετρία διατηρεί τα εμβαδά.' : 'Reflection preserves area.' }; },
  (isEl) => ({ prompt: isEl ? 'Ποιο από τα παρακάτω κεφαλαία γράμματα έχει κατακόρυφο άξονα συμμετρίας;' : 'Which capital letter has a vertical axis of symmetry?', correct: isEl ? 'Το γράμμα Α' : 'Letter A', distractors: isEl ? ['Το γράμμα Γ', 'Το γράμμα Ρ', 'Το γράμμα Σ'] : ['Letter G', 'Letter R', 'Letter S'], expl: isEl ? 'Το Α χωρίζεται κατακόρυφα σε 2 συμμετρικά μέρη.' : 'Letter A has vertical symmetry.' })
];

// --- ΚΕΦΑΛΑΙΟ 72: ΜΕΤΡΗΣΗ ΕΠΙΦΑΝΕΙΑΣ & ΜΟΝΑΔΕΣ ΕΜΒΑΔΟΥ ---
const POOL_Q11 = [
  (isEl) => ({ prompt: isEl ? 'Ποια είναι η βασική μονάδα μέτρησης επιφάνειας στο διεθνές σύστημα;' : 'What is the base SI unit of surface area?', correct: isEl ? 'Το τετραγωνικό μέτρο (1 m²)' : 'Square meter (1 m²)', distractors: isEl ? ['Το απλό μέτρο (1 m)', 'Το στρέμμα', 'Το τετραγωνικό χιλιόμετρο (1 km²)'] : ['Linear meter (1 m)', 'Stremma (decare)', 'Square kilometer (1 km²)'], expl: isEl ? 'Βασική μονάδα επιφάνειας είναι το 1 m².' : 'Base unit is 1 m².' }),
  (isEl) => ({ prompt: isEl ? 'Γιατί οι μονάδες επιφάνειας αλλάζουν κατά 100 σε κάθε σκαλοπάτι;' : 'Why do area units scale by 100 per step?', correct: isEl ? 'Επειδή η επιφάνεια έχει 2 διαστάσεις και 10 · 10 ＝ 100' : 'Because area has 2 dimensions and 10 · 10 ＝ 100', distractors: isEl ? ['Επειδή το 100 είναι στρογγυλός αριθμός', 'Επειδή όλα τα σχήματα είναι τετράγωνα', 'Επειδή έτσι αποφασίστηκε τυχαία'] : ['Because 100 is round', 'Because all shapes are squares', 'Arbitrary convention'], expl: '1 m² ＝ 10 dm · 10 dm ＝ 100 dm².' }),
  (isEl) => ({ prompt: isEl ? 'Πόσα τετραγωνικά δεκατόμετρα (dm²) περιέχει 1 τετραγωνικό μέτρο (1 m²);' : 'How many square decimeters (dm²) are in 1 square meter (1 m²)?', correct: '100 dm²', distractors: ['10 dm²', '1.000 dm²', '10.000 dm²'], expl: '1 m² ＝ 100 dm².' }),
  (isEl) => ({ prompt: isEl ? 'Πόσα τετραγωνικά εκατοστόμετρα (cm²) περιέχει 1 τετραγωνικό μέτρο (1 m²);' : 'How many square centimeters (cm²) are in 1 square meter (1 m²)?', correct: isEl ? '10.000 cm²' : '10,000 cm²', distractors: isEl ? ['100 cm²', '1.000 cm²', '100.000 cm²'] : ['100 cm²', '1,000 cm²', '100,000 cm²'], expl: '100 · 100 ＝ 10.000 cm².' }),
  (isEl) => ({ prompt: isEl ? 'Με πόσα τετραγωνικά μέτρα (m²) ισούται ακριβώς 1 στρέμμα;' : 'How many square meters (m²) equal 1 stremma (decare)?', correct: isEl ? '1.000 m²' : '1,000 m²', distractors: isEl ? ['100 m²', '10.000 m²', '500 m²'] : ['100 m²', '10,000 m²', '500 m²'], expl: '1 stremma ＝ 1.000 m².' }),
  (isEl) => ({ prompt: isEl ? 'Πόσα στρέμματα περιέχει 1 τετραγωνικό χιλιόμετρο (1 km²);' : 'How many stremmata (decares) are in 1 square kilometer (1 km²)?', correct: isEl ? '1.000 στρέμματα' : '1,000 stremmata', distractors: isEl ? ['100 στρέμματα', '10.000 στρέμματα', '1.000.000 στρέμματα'] : ['100 stremmata', '10,000 stremmata', '1,000,000 stremmata'], expl: '1 km² ＝ 1.000.000 m² ＝ 1.000 stremmata.' }),
  (isEl) => { const m2 = randInt(2, 8); return { prompt: isEl ? `Πόσα dm² είναι τα ${m2} m²;` : `How many dm² are in ${m2} m²?`, correct: `${m2 * 100} dm²`, distractors: [`${m2 * 10} dm²`, `${formatNum(m2 * 1000, isEl ? 'el' : 'en')} dm²`, `${m2} dm²`], expl: `${m2} · 100 ＝ ${m2 * 100} dm².` }; },
  (isEl) => { const dm2 = randInt(3, 9); return { prompt: isEl ? `Πόσα cm² είναι τα ${dm2} dm²;` : `How many cm² are in ${dm2} dm²?`, correct: `${dm2 * 100} cm²`, distractors: [`${dm2 * 10} cm²`, `${formatNum(dm2 * 1000, isEl ? 'el' : 'en')} cm²`, `${dm2} cm²`], expl: `${dm2} · 100 ＝ ${dm2 * 100} cm².` }; }
];

const POOL_Q12 = [
  (isEl) => { const str = randInt(2, 7); return { prompt: isEl ? `Ένα χωράφι έχει έκταση ${str} στρέμματα. Πόσα τετραγωνικά μέτρα (m²) είναι η έκτασή του;` : `A field has an area of ${str} stremmata. How many square meters (m²) is it?`, correct: `${formatNum(str * 1000, isEl ? 'el' : 'en')} m²`, distractors: [`${str * 100} m²`, `${formatNum(str * 10000, isEl ? 'el' : 'en')} m²`, `${str * 10} m²`], expl: `${str} · 1.000 ＝ ${formatNum(str * 1000, isEl ? 'el' : 'en')} m².` }; },
  (isEl) => { const m2 = randInt(3, 9) * 1000; return { prompt: isEl ? `Ένα οικόπεδο έχει εμβαδόν ${formatNum(m2, 'el')} m². Πόσα στρέμματα είναι;` : `A plot has area ${formatNum(m2, 'en')} m². How many stremmata is it?`, correct: isEl ? `${m2 / 1000} στρέμματα` : `${m2 / 1000} stremmata`, distractors: isEl ? [`${m2 / 100} στρέμματα`, `${m2 / 10} στρέμματα`, `${(m2 / 1000) * 10} στρέμματα`] : [`${m2 / 100} stremmata`, `${m2 / 10} stremmata`, `${(m2 / 1000) * 10} stremmata`], expl: `${m2} : 1.000 ＝ ${m2 / 1000}.` }; },
  (isEl) => ({ prompt: isEl ? 'Πόσα dm² είναι τα 4.500 cm²;' : 'How many dm² are 4,500 cm²?', correct: '45 dm²', distractors: ['450 dm²', `${formatNum(4.5, isEl ? 'el' : 'en')} dm²`, `${formatNum(45000, isEl ? 'el' : 'en')} dm²`], expl: '4.500 : 100 ＝ 45 dm².' }),
  (isEl) => ({ prompt: isEl ? 'Μια κουζίνα έχει εμβαδόν 15 m² (150.000 cm²). Πόσα πλακάκια των 500 cm² χρειάζονται για να στρωθεί;' : 'A kitchen has area 15 m² (150,000 cm²). How many 500 cm² tiles are needed?', correct: isEl ? '300 πλακάκια' : '300 tiles', distractors: isEl ? ['30 πλακάκια', '150 πλακάκια', '500 πλακάκια'] : ['30 tiles', '150 tiles', '500 tiles'], expl: '150.000 : 500 ＝ 300.' }),
  (isEl) => ({ prompt: isEl ? 'Όταν μετατρέπουμε μια επιφάνεια ανεβαίνοντας 1 σκαλοπάτι (π.χ. από cm² σε dm²), τι πράξη κάνουμε;' : 'When converting area ascending 1 unit step (e.g. cm² to dm²), what operation do we perform?', correct: isEl ? 'Διαιρούμε με το 100' : 'Divide by 100', distractors: isEl ? ['Πολλαπλασιάζουμε με το 100', 'Διαιρούμε με το 10', 'Προσθέτουμε 100'] : ['Multiply by 100', 'Divide by 10', 'Add 100'], expl: isEl ? 'Ανέβασμα σκάλας: διαίρεση με το 100.' : 'Ascending step: divide by 100.' }),
  (isEl) => ({ prompt: isEl ? 'Όταν μετατρέπουμε μια επιφάνεια κατεβαίνοντας 2 σκαλοπάτια (από m² σε cm²), με τι πολλαπλασιάζουμε;' : 'When converting area descending 2 steps (m² to cm²), what do we multiply by?', correct: isEl ? 'Με το 10.000 (100 · 100)' : 'By 10,000 (100 · 100)', distractors: isEl ? ['Με το 200', 'Με το 1.000', 'Με το 100'] : ['By 200', 'By 1,000', 'By 100'], expl: '100 · 100 ＝ 10.000.' }),
  (isEl) => ({ prompt: isEl ? 'Ποιο μέγεθος εκφράζει το μήκος του φράχτη ενός οικοπέδου και ποιο την επιφάνειά του;' : 'Which metric represents fence length and which surface area?', correct: isEl ? 'Ο φράχτης είναι περίμετρος (m) και η επιφάνεια εμβαδόν (m²)' : 'Fence is perimeter (m) and surface is area (m²)', distractors: isEl ? ['Και τα δύο είναι εμβαδόν', 'Και τα δύο είναι περίμετρος', 'Ο φράχτης είναι εμβαδόν και η επιφάνεια περίμετρος'] : ['Both are area', 'Both are perimeter', 'Fence is area and surface is perimeter'], expl: isEl ? 'Περίμετρος σε m, εμβαδόν σε m².' : 'Perimeter in m, area in m².' }),
  (isEl) => { const str = 5; const price = 4000; return { prompt: isEl ? `Ένα κτήμα ${str} στρεμμάτων πωλείται προς ${formatNum(price, 'el')} € το στρέμμα. Πόσο κοστίζει συνολικά;` : `A plot of ${str} stremmata sells for ${formatNum(price, 'en')} € per stremma. What is the total price?`, correct: `${formatNum(str * price, isEl ? 'el' : 'en')} €`, distractors: [`${formatNum(str * 1000, isEl ? 'el' : 'en')} €`, `${formatNum(price / str, isEl ? 'el' : 'en')} €`, `${formatNum(str * price * 2, isEl ? 'el' : 'en')} €`], expl: `${str} · 4.000 € ＝ 20.000 €.` }; }
];

// --- ΚΕΦΑΛΑΙΟ 73: ΕΜΒΑΔΟΝ ΠΑΡΑΛΛΗΛΟΓΡΑΜΜΟΥ ---
const POOL_Q13 = [
  (isEl) => ({ prompt: isEl ? 'Ποιος είναι ο τύπος για το εμβαδόν κάθε παραλληλογράμμου;' : 'What is the formula for the area of a parallelogram?', correct: isEl ? 'Ε ＝ β · υ (Βάση · Ύψος)' : 'A ＝ b · h (Base · Height)', distractors: isEl ? ['Ε ＝ (β · υ) : 2', 'Ε ＝ 2 · (β ＋ υ)', 'Ε ＝ β · πλάγια πλευρά'] : ['A ＝ (b · h) : 2', 'A ＝ 2 · (b ＋ h)', 'A ＝ b · slant side'], expl: isEl ? 'Εμβαδόν παραλληλογράμμου ＝ β · υ.' : 'Parallelogram area ＝ b · h.' }),
  (isEl) => ({ prompt: isEl ? 'Τι είναι το ύψος σε ένα παραλληλόγραμμο;' : 'What is the height of a parallelogram?', correct: isEl ? 'Η κάθετη απόσταση (γωνία 90°) ανάμεσα στη βάση και την απέναντι πλευρά' : 'The perpendicular distance (90°) between base and opposite side', distractors: isEl ? ['Το μήκος της πλάγιας πλευράς', 'Η διαγώνιος του σχήματος', 'Η περίμετρος'] : ['Slant side length', 'Diagonal', 'Perimeter'], expl: isEl ? 'Το ύψος είναι αυστηρά κάθετο στις παράλληλες βάσεις.' : 'Height is perpendicular to the bases.' }),
  (isEl) => { const b = randInt(6, 12); const h = randInt(4, 9); return { prompt: isEl ? `Ένα παραλληλόγραμμο έχει βάση ${b} cm και ύψος ${h} cm. Πόσο είναι το εμβαδόν του;` : `A parallelogram has base ${b} cm and height ${h} cm. What is its area?`, correct: `${b * h} cm²`, distractors: [`${formatNum((b * h) / 2, isEl ? 'el' : 'en')} cm²`, `${2 * (b + h)} cm²`, `${b * h + 10} cm²`], expl: `${b} · ${h} ＝ ${b * h} cm².` }; },
  (isEl) => { const b = randInt(10, 20); const h = randInt(5, 10); const slant = h + 4; return { prompt: isEl ? `Σε ένα παραλληλόγραμμο η βάση είναι ${b} m, το ύψος ${h} m και η πλάγια πλευρά ${slant} m. Ποιο είναι το εμβαδόν του;` : `In a parallelogram base is ${b} m, height is ${h} m, and slant side is ${slant} m. What is its area?`, correct: `${b * h} m²`, distractors: [`${b * slant} m²`, `${formatNum((b * h) / 2, isEl ? 'el' : 'en')} m²`, `${2 * (b + slant)} m²`], expl: `Ε ＝ β · υ ＝ ${b} · ${h} ＝ ${b * h} m².` }; },
  (isEl) => ({ prompt: isEl ? 'Γιατί το παραλληλόγραμμο έχει εμβαδόν β · υ όπως το ορθογώνιο;' : 'Why does a parallelogram have area b · h like a rectangle?', correct: isEl ? 'Γιατί αν μεταφέρουμε το ορθογώνιο τρίγωνο από τη μία πλευρά στην άλλη, σχηματίζεται ορθογώνιο' : 'Because moving the right triangle from one side to the other forms a rectangle', distractors: isEl ? ['Επειδή έχει 4 ορθές γωνίες', 'Επειδή οι διαγώνιοί του είναι ίσες', 'Επειδή έτσι συμφωνήθηκε'] : ['Because it has 4 right angles', 'Because diagonals are equal', 'By convention'], expl: isEl ? 'Με αναδιάταξη μετατρέπεται σε ορθογώνιο διαστάσεων β και υ.' : 'Rearranging forms a rectangle of sides b and h.' }),
  (isEl) => ({ prompt: isEl ? 'Ένα παραλληλόγραμμο έχει εμβαδόν 60 cm² και βάση 12 cm. Πόσο είναι το ύψος του;' : 'A parallelogram has area 60 cm² and base 12 cm. What is its height?', correct: '5 cm', distractors: ['10 cm', '6 cm', '8 cm'], expl: '60 : 12 ＝ 5 cm.' }),
  (isEl) => ({ prompt: isEl ? 'Ένα παραλληλόγραμμο έχει εμβαδόν 80 m² και ύψος 8 m. Πόσο είναι το μήκος της βάσης του;' : 'A parallelogram has area 80 m² and height 8 m. What is its base?', correct: '10 m', distractors: ['8 m', '12 m', '20 m'], expl: '80 : 8 ＝ 10 m.' }),
  (isEl) => ({ prompt: isEl ? 'Αν σε ένα παραλληλόγραμμο γνωρίζουμε τις δύο βάσεις β₁ και β₂ και τα αντίστοιχα ύψη υ₁ και υ₂, τι ισχύει;' : 'In a parallelogram with bases b₁, b₂ and corresponding heights h₁, h₂, what is true?', correct: 'β₁ · υ₁ ＝ β₂ · υ₂', distractors: ['β₁ · β₂ ＝ υ₁ · υ₂', 'υ₁ ＝ υ₂', 'β₁ ＋ υ₁ ＝ β₂ ＋ υ₂'], expl: isEl ? 'Το εμβαδόν είναι μοναδικό: β₁ · υ₁ ＝ β₂ · υ₂.' : 'Area is unique: b₁ · h₁ ＝ b₂ · h₂.' })
];

const POOL_Q14 = [
  (isEl) => ({ prompt: isEl ? 'Παραλληλόγραμμο έχει πλευρές 20 cm και 15 cm. Το ύψος προς την πλευρά 20 cm είναι 12 cm (Ε = 240 cm²). Πόσο είναι το ύψος προς την πλευρά των 15 cm;' : 'A parallelogram has sides 20 cm and 15 cm. Height to 20 cm base is 12 cm (A = 240 cm²). What is the height to the 15 cm base?', correct: '16 cm', distractors: ['10 cm', '14 cm', '18 cm'], expl: '240 : 15 ＝ 16 cm.' }),
  (isEl) => ({ prompt: isEl ? 'Παραλληλόγραμμο έχει βάση 3 m (300 cm) και ύψος 40 cm. Πόσο είναι το εμβαδόν του σε cm²;' : 'A parallelogram has base 3 m (300 cm) and height 40 cm. What is its area in cm²?', correct: isEl ? '12.000 cm²' : '12,000 cm²', distractors: isEl ? ['120 cm²', '1.200 cm²', '120.000 cm²'] : ['120 cm²', '1,200 cm²', '120,000 cm²'], expl: '300 · 40 ＝ 12.000 cm².' }),
  (isEl) => ({ prompt: isEl ? 'Μια πλάκα έχει εμβαδόν 18 dm² (1.800 cm²) και βάση 60 cm. Πόσο είναι το ύψος της σε cm;' : 'A slab has area 18 dm² (1,800 cm²) and base 60 cm. What is its height in cm?', correct: '30 cm', distractors: ['18 cm', '60 cm', '15 cm'], expl: '1.800 : 60 ＝ 30 cm.' }),
  (isEl) => ({ prompt: isEl ? 'Σε ένα παραλληλόγραμμο με δύο άνισες πλευρές, σε ποια πλευρά αντιστοιχεί το μεγαλύτερο ύψος;' : 'In a parallelogram with unequal sides, to which side does the greater height correspond?', correct: isEl ? 'Στη μικρότερη πλευρά' : 'To the shorter side', distractors: isEl ? ['Στη μεγαλύτερη πλευρά', 'Είναι ίσα', 'Δεν εξαρτάται από τις πλευρές'] : ['To the longer side', 'They are equal', 'Independent of sides'], expl: isEl ? 'Επειδή β · υ ＝ σταθερό, στη μικρότερη βάση αντιστοιχεί μεγαλύτερο ύψος.' : 'Because b · h is constant, shorter base has larger height.' }),
  (isEl) => ({ prompt: isEl ? 'Αν διπλασιάσουμε τη βάση ενός παραλληλογράμμου διατηρώντας το ύψος σταθερό, πώς αλλάζει το εμβαδόν;' : 'If we double the base of a parallelogram keeping height constant, how does area change?', correct: isEl ? 'Διπλασιάζεται' : 'Doubles', distractors: isEl ? ['Τετραπλασιάζεται', 'Παραμένει ίδιο', 'Υποδιπλασιάζεται'] : ['Quadruples', 'Remains same', 'Halved'], expl: '2 · (β · υ).' }),
  (isEl) => ({ prompt: isEl ? 'Ένα οικόπεδο έχει βάση 40 m και ύψος 25 m (εμβαδόν 1.000 m²). Πόσα στρέμματα είναι;' : 'A plot has base 40 m and height 25 m (area 1,000 m²). How many stremmata is it?', correct: isEl ? '1 στρέμμα' : '1 stremma', distractors: isEl ? ['10 στρέμματα', '0,1 στρέμματα', '2,5 στρέμματα'] : ['10 stremmata', '0.1 stremmata', '2.5 stremmata'], expl: '1.000 m² ＝ 1 stremma.' }),
  (isEl) => ({ prompt: isEl ? 'Μπορεί το ύψος ενός παραλληλογράμμου να πέφτει στην προέκταση της βάσης έξω από το σχήμα;' : 'Can the height of a parallelogram fall on the base extension outside the figure?', correct: isEl ? 'Ναι, σε ένα πολύ πλάγιο παραλληλόγραμμο' : 'Yes, in a strongly slanted parallelogram', distractors: isEl ? ['Όχι, ποτέ', 'Μόνο αν είναι ορθογώνιο', 'Μόνο αν είναι ρόμβος'] : ['No, never', 'Only if rectangle', 'Only if rhombus'], expl: isEl ? 'Σε έντονα πλάγια παραλληλόγραμμα το ύψος πέφτει στην προέκταση.' : 'In slanted parallelograms height falls on extension.' }),
  (isEl) => ({ prompt: isEl ? 'Ένα παραλληλόγραμμο έχει το ίδιο εμβαδόν με ένα ορθογώνιο διαστάσεων 16 cm και 9 cm (144 cm²). Αν η βάση του είναι 18 cm, πόσο είναι το ύψος του;' : 'A parallelogram has the same area as a 16 cm by 9 cm rectangle (144 cm²). If base is 18 cm, what is height?', correct: '8 cm', distractors: ['10 cm', '6 cm', '12 cm'], expl: '144 : 18 ＝ 8 cm.' })
];

// --- ΚΕΦΑΛΑΙΟ 74: ΕΜΒΑΔΟΝ ΤΡΙΓΩΝΟΥ ---
const POOL_Q15 = [
  (isEl) => ({ prompt: isEl ? 'Ποιος είναι ο τύπος για το εμβαδόν κάθε τριγώνου;' : 'What is the formula for the area of any triangle?', correct: isEl ? 'Ε ＝ (β · υ) : 2' : 'A ＝ (b · h) : 2', distractors: isEl ? ['Ε ＝ β · υ', 'Ε ＝ β ＋ υ', 'Ε ＝ (β · υ) : 4'] : ['A ＝ b · h', 'A ＝ b ＋ h', 'A ＝ (b · h) : 4'], expl: isEl ? 'Εμβαδόν τριγώνου ＝ (β · υ) : 2.' : 'Triangle area ＝ (b · h) : 2.' }),
  (isEl) => ({ prompt: isEl ? 'Γιατί στον τύπο του εμβαδού τριγώνου διαιρούμε με το 2;' : 'Why do we divide by 2 in the triangle area formula?', correct: isEl ? 'Επειδή κάθε τρίγωνο είναι ακριβώς το μισό ενός παραλληλογράμμου με την ίδια βάση και ύψος' : 'Because any triangle is half of a parallelogram with same base and height', distractors: isEl ? ['Επειδή το τρίγωνο έχει 3 πλευρές', 'Επειδή όλα τα τρίγωνα έχουν ορθές γωνίες', 'Επειδή έτσι αποφασίστηκε'] : ['Because it has 3 sides', 'Because all triangles have right angles', 'Arbitrary decision'], expl: isEl ? 'Δύο ίδια τρίγωνα σχηματίζουν παραλληλόγραμμο εμβαδού β · υ.' : 'Two congruent triangles make a parallelogram of area b · h.' }),
  (isEl) => { const b = randInt(6, 14); const h = randInt(4, 10); return { prompt: isEl ? `Ένα τρίγωνο έχει βάση ${b} cm και αντίστοιχο ύψος ${h} cm. Πόσο είναι το εμβαδόν του;` : `A triangle has base ${b} cm and corresponding height ${h} cm. What is its area?`, correct: `${(b * h) / 2} cm²`, distractors: [`${b * h} cm²`, `${b + h} cm²`, `${formatNum((b * h) / 4, isEl ? 'el' : 'en')} cm²`], expl: `(${b} · ${h}) : 2 ＝ ${(b * h) / 2} cm².` }; },
  (isEl) => ({ prompt: isEl ? 'Σε ένα ορθογώνιο τρίγωνο οι δύο κάθετες πλευρές είναι 6 cm και 8 cm, και η υποτείνουσα 10 cm. Πόσο είναι το εμβαδόν του;' : 'In a right triangle legs are 6 cm and 8 cm, and hypotenuse is 10 cm. What is its area?', correct: '24 cm²', distractors: ['48 cm²', '30 cm²', '40 cm²'], expl: '(6 · 8) : 2 ＝ 24 cm².' }),
  (isEl) => ({ prompt: isEl ? 'Πώς υπολογίζουμε το εμβαδόν ενός ορθογωνίου τριγώνου;' : 'How do we calculate the area of a right triangle?', correct: isEl ? 'Πολλαπλασιάζουμε τις δύο κάθετες πλευρές και διαιρούμε με το 2' : 'Multiply the two legs and divide by 2', distractors: isEl ? ['Πολλαπλασιάζουμε και τις 3 πλευρές', 'Προσθέτουμε τις πλευρές και διαιρούμε με το 2', 'Πολλαπλασιάζουμε τη βάση με την υποτείνουσα'] : ['Multiply all 3 sides', 'Add sides and divide by 2', 'Multiply base by hypotenuse'], expl: isEl ? 'Οι δύο κάθετες πλευρές είναι βάση και ύψος: (α · β) : 2.' : 'The two legs act as base and height: (a · b) : 2.' }),
  (isEl) => ({ prompt: isEl ? 'Ένα τρίγωνο έχει εμβαδόν 30 cm² και βάση 10 cm. Πόσο είναι το ύψος του;' : 'A triangle has area 30 cm² and base 10 cm. What is its height?', correct: '6 cm', distractors: ['3 cm', '12 cm', '5 cm'], expl: '(2 · 30) : 10 ＝ 6 cm.' }),
  (isEl) => ({ prompt: isEl ? 'Ένα τρίγωνο έχει εμβαδόν 48 m² και ύψος 8 m. Πόσο είναι το μήκος της βάσης του;' : 'A triangle has area 48 m² and height 8 m. What is its base length?', correct: '12 m', distractors: ['6 m', '16 m', '10 m'], expl: '(2 · 48) : 8 ＝ 12 m.' }),
  (isEl) => ({ prompt: isEl ? 'Πού πέφτει το ύψος σε ένα αμβλυγώνιο τρίγωνο αν ξεκινήσουμε από μία οξεία κορυφή;' : 'Where does altitude fall in an obtuse triangle when drawn from an acute vertex?', correct: isEl ? 'Έξω από το τρίγωνο, στην προέκταση της βάσης' : 'Outside the triangle, on the base extension', distractors: isEl ? ['Πάντοτε στο κέντρο του τριγώνου', 'Πάνω σε μία πλευρά', 'Δεν υπάρχει ύψος'] : ['Always at center', 'On a side', 'No altitude exists'], expl: isEl ? 'Στο αμβλυγώνιο 2 από τα 3 ύψη πέφτουν έξω.' : 'In an obtuse triangle 2 altitudes fall outside.' })
];

const POOL_Q16 = [
  (isEl) => ({ prompt: isEl ? 'Ένα τρίγωνο έχει βάση 4 m (400 cm) και ύψος 50 cm. Πόσο είναι το εμβαδόν του σε cm²;' : 'A triangle has base 4 m (400 cm) and height 50 cm. What is its area in cm²?', correct: isEl ? '10.000 cm²' : '10,000 cm²', distractors: isEl ? ['20.000 cm²', '1.000 cm²', '100 cm²'] : ['20,000 cm²', '1,000 cm²', '100 cm²'], expl: '(400 · 50) : 2 ＝ 10.000 cm².' }),
  (isEl) => ({ prompt: isEl ? 'Ένας τριγωνικός αγρός έχει βάση 100 m και ύψος 60 m (εμβαδόν 3.000 m²). Πόσα στρέμματα είναι;' : 'A triangular field has base 100 m and height 60 m (area 3,000 m²). How many stremmata is it?', correct: isEl ? '3 στρέμματα' : '3 stremmata', distractors: isEl ? ['6 στρέμματα', '30 στρέμματα', '1,5 στρέμματα'] : ['6 stremmata', '30 stremmata', '1.5 stremmata'], expl: '3.000 : 1.000 ＝ 3.' }),
  (isEl) => ({ prompt: isEl ? 'Ένα τρίγωνο και ένα παραλληλόγραμμο έχουν την ίδια βάση και το ίδιο ύψος. Ποια σχέση έχουν τα εμβαδά τους;' : 'A triangle and a parallelogram have identical base and height. How are their areas related?', correct: isEl ? 'Το τρίγωνο έχει ακριβώς το μισό εμβαδόν' : 'The triangle has exactly half the area', distractors: isEl ? ['Έχουν το ίδιο εμβαδόν', 'Το τρίγωνο έχει διπλάσιο εμβαδόν', 'Δεν έχουν σταθερή σχέση'] : ['They have equal area', 'Triangle has double area', 'No fixed relation'], expl: isEl ? 'Ε_τριγώνου ＝ Ε_παραλληλογράμμου : 2.' : 'A_triangle ＝ A_parallelogram : 2.' }),
  (isEl) => ({ prompt: isEl ? 'Τρίγωνο έχει εμβαδόν (16 · 10) : 2 ＝ 80 cm². Ένα παραλληλόγραμμο έχει την ίδια βάση (16 cm) και ίσο εμβαδόν (80 cm²). Πόσο είναι το ύψος του παραλληλογράμμου;' : 'A triangle has area (16 · 10) : 2 ＝ 80 cm². A parallelogram has same base (16 cm) and equal area (80 cm²). What is its height?', correct: '5 cm', distractors: ['10 cm', '20 cm', '8 cm'], expl: '80 : 16 ＝ 5 cm.' }),
  (isEl) => ({ prompt: isEl ? 'Αν διπλασιάσουμε το ύψος ενός τριγώνου διατηρώντας τη βάση σταθερή, πώς αλλάζει το εμβαδόν;' : 'If we double the height of a triangle keeping base constant, how does area change?', correct: isEl ? 'Διπλασιάζεται' : 'Doubles', distractors: isEl ? ['Τετραπλασιάζεται', 'Παραμένει ίδιο', 'Υποδιπλασιάζεται'] : ['Quadruples', 'Remains same', 'Halved'], expl: '(β · 2υ) : 2 ＝ 2 · Ε.' }),
  (isEl) => ({ prompt: isEl ? 'Αν διπλασιάσουμε και τη βάση και το ύψος ενός τριγώνου, πόσες φορές μεγαλύτερο γίνεται το εμβαδόν;' : 'If we double both base and height of a triangle, how many times larger does area become?', correct: isEl ? '4 φορές μεγαλύτερο (τετραπλασιάζεται)' : '4 times larger (quadruples)', distractors: isEl ? ['2 φορές μεγαλύτερο', '8 φορές μεγαλύτερο', 'Παραμένει ίδιο'] : ['2 times larger', '8 times larger', 'Remains same'], expl: '2 · 2 ＝ 4.' }),
  (isEl) => ({ prompt: isEl ? 'Η τριγωνική μετώπη μιας σοφίτας έχει βάση 14 m και ύψος 5 m. Πόσα m² είναι η επιφάνειά της;' : 'The triangular attic gable has base 14 m and height 5 m. What is its area in m²?', correct: '35 m²', distractors: ['70 m²', '40 m²', '30 m²'], expl: '(14 · 5) : 2 ＝ 35 m².' }),
  (isEl) => ({ prompt: isEl ? 'Ένα ισοσκελές ορθογώνιο τρίγωνο έχει κάθετες πλευρές 20 cm και 20 cm. Πόσο είναι το εμβαδόν του;' : 'An isosceles right triangle has legs 20 cm and 20 cm. What is its area?', correct: '200 cm²', distractors: ['400 cm²', '100 cm²', '50 cm²'], expl: '(20 · 20) : 2 ＝ 200 cm².' })
];

// --- ΚΕΦΑΛΑΙΟ 75: ΕΜΒΑΔΟΝ ΤΡΑΠΕΖΙΟΥ ---
const POOL_Q17 = [
  (isEl) => ({ prompt: isEl ? 'Ποιος είναι ο τύπος για το εμβαδόν του τραπεζίου;' : 'What is the formula for the area of a trapezoid?', correct: isEl ? 'Ε ＝ [(Β ＋ b) · υ] : 2' : 'A ＝ [(B ＋ b) · h] : 2', distractors: isEl ? ['Ε ＝ (Β · b · υ) : 2', 'Ε ＝ (Β ＋ b) · υ', 'Ε ＝ [(Β － b) · υ] : 2'] : ['A ＝ (B · b · h) : 2', 'A ＝ (B ＋ b) · h', 'A ＝ [(B － b) · h] : 2'], expl: isEl ? 'Ε ＝ [(Β ＋ b) · υ] : 2.' : 'A ＝ [(B ＋ b) · h] : 2.' }),
  (isEl) => ({ prompt: isEl ? 'Γιατί στον τύπο του εμβαδού τραπεζίου διαιρούμε με το 2;' : 'Why do we divide by 2 in the trapezoid area formula?', correct: isEl ? 'Επειδή δύο ίδια τραπέζια ενώνονται και σχηματίζουν παραλληλόγραμμο με βάση (Β ＋ b) και ύψος υ' : 'Because two congruent trapezoids join to form a parallelogram of base (B ＋ b) and height h', distractors: isEl ? ['Επειδή το τραπέζιο έχει 2 βάσεις', 'Επειδή έχει 4 πλευρές', 'Επειδή είναι πάντοτε ορθογώνιο'] : ['Because it has 2 bases', 'Because it has 4 sides', 'Because it is rectangular'], expl: isEl ? 'Τα 2 τραπέζια φτιάχνουν παραλληλόγραμμο βάσης (Β ＋ b).' : 'Two trapezoids make a parallelogram with base (B ＋ b).' }),
  (isEl) => ({ prompt: isEl ? 'Ένα τραπέζιο έχει βάσεις 12 cm και 8 cm και ύψος 5 cm. Πόσο είναι το εμβαδόν του;' : 'A trapezoid has bases 12 cm and 8 cm and height 5 cm. What is its area?', correct: '50 cm²', distractors: ['100 cm²', '48 cm²', '60 cm²'], expl: '[(12 ＋ 8) · 5] : 2 ＝ 50 cm².' }),
  (isEl) => ({ prompt: isEl ? 'Σε ένα τραπέζιο Β ＝ 15 m, b ＝ 9 m και υ ＝ 6 m. Πόσα m² είναι το εμβαδόν του;' : 'In a trapezoid B ＝ 15 m, b ＝ 9 m, and h ＝ 6 m. What is its area in m²?', correct: '72 m²', distractors: ['144 m²', '60 m²', '80 m²'], expl: '[(15 ＋ 9) · 6] : 2 ＝ 72 m².' }),
  (isEl) => ({ prompt: isEl ? 'Ποιο είναι το ύψος σε ένα ορθογώνιο τραπέζιο;' : 'What is the height in a right-angled trapezoid?', correct: isEl ? 'Η πλευρά του που είναι κάθετη (90°) στις δύο παράλληλες βάσεις' : 'The side that is perpendicular (90°) to the two bases', distractors: isEl ? ['Η πλάγια κεκλιμένη πλευρά του', 'Η μεγαλύτερη διαγώνιος', 'Το άθροισμα των βάσεων'] : ['The slanted side', 'The longest diagonal', 'Sum of bases'], expl: isEl ? 'Στο ορθογώνιο τραπέζιο η κάθετη πλευρά είναι το ίδιο το ύψος.' : 'The perpendicular side serves as height.' }),
  (isEl) => ({ prompt: isEl ? 'Ορθογώνιο τραπέζιο έχει βάσεις 18 cm και 12 cm και κάθετη πλευρά (ύψος) 8 cm. Πόσο είναι το εμβαδόν του;' : 'A right trapezoid has bases 18 cm and 12 cm and perpendicular leg 8 cm. What is its area?', correct: '120 cm²', distractors: ['240 cm²', '150 cm²', '96 cm²'], expl: '[(18 ＋ 12) · 8] : 2 ＝ 120 cm².' }),
  (isEl) => ({ prompt: isEl ? 'Σε ένα τραπέζιο το εμβαδόν είναι 60 m² και το άθροισμα των βάσεων (Β ＋ b) είναι 20 m. Πόσο είναι το ύψος του;' : 'In a trapezoid area is 60 m² and base sum (B ＋ b) is 20 m. What is its height?', correct: '6 m', distractors: ['3 m', '12 m', '8 m'], expl: '(2 · 60) : 20 ＝ 6 m.' }),
  (isEl) => ({ prompt: isEl ? 'Ένα τραπέζιο έχει εμβαδόν 80 cm² και ύψος 8 cm. Πόσο είναι το άθροισμα των δύο βάσεών του (Β ＋ b);' : 'A trapezoid has area 80 cm² and height 8 cm. What is the sum of its bases (B ＋ b)?', correct: '20 cm', distractors: ['10 cm', '40 cm', '16 cm'], expl: '(2 · 80) : 8 ＝ 20 cm.' })
];

const POOL_Q18 = [
  (isEl) => ({ prompt: isEl ? 'Οικόπεδο τραπέζιο έχει βάσεις 40 m και 25 m, ύψος 16 m και πλάγιες πλευρές 18 m και 20 m. Πόσο είναι το εμβαδόν του;' : 'A trapezoidal plot has bases 40 m and 25 m, height 16 m, and slant sides 18 m and 20 m. What is its area?', correct: '520 m²', distractors: [isEl ? '1.040 m²' : '1,040 m²', '650 m²', '480 m²'], expl: '[(40 ＋ 25) · 16] : 2 ＝ 520 m².' }),
  (isEl) => ({ prompt: isEl ? 'Ένας τραπεζοειδής αγρός έχει βάσεις 80 m και 40 m και ύψος 50 m (εμβαδόν 3.000 m²). Πόσα στρέμματα είναι;' : 'A trapezoidal field has bases 80 m and 40 m and height 50 m (area 3,000 m²). How many stremmata is it?', correct: isEl ? '3 στρέμματα' : '3 stremmata', distractors: isEl ? ['6 στρέμματα', '30 στρέμματα', '1,5 στρέμματα'] : ['6 stremmata', '30 stremmata', '1.5 stremmata'], expl: '3.000 : 1.000 ＝ 3.' }),
  (isEl) => ({ prompt: isEl ? 'Σε τραπέζιο με Ε ＝ 180 cm² και υ ＝ 10 cm, το άθροισμα βάσεων είναι (2 · 180) : 10 ＝ 36 cm. Αν Β ＝ 22 cm, πόση είναι η μικρή βάση b;' : 'In a trapezoid with A ＝ 180 cm² and h ＝ 10 cm, base sum is 36 cm. If B ＝ 22 cm, what is small base b?', correct: '14 cm', distractors: ['12 cm', '16 cm', '10 cm'], expl: '36 － 22 ＝ 14 cm.' }),
  (isEl) => ({ prompt: isEl ? 'Τραπέζιο έχει βάσεις 2 m (200 cm) και 1 m (100 cm) και ύψος 60 cm. Πόσο είναι το εμβαδόν σε cm²;' : 'A trapezoid has bases 2 m (200 cm) and 1 m (100 cm) and height 60 cm. What is area in cm²?', correct: isEl ? '9.000 cm²' : '9,000 cm²', distractors: isEl ? ['18.000 cm²', '900 cm²', '90 cm²'] : ['18,000 cm²', '900 cm²', '90 cm²'], expl: '[(200 ＋ 100) · 60] : 2 ＝ 9.000 cm².' }),
  (isEl) => ({ prompt: isEl ? 'Αν σε ένα τραπέζιο διπλασιάσουμε το ύψος του διατηρώντας τις δύο βάσεις σταθερές, πώς αλλάζει το εμβαδόν;' : 'If we double the height of a trapezoid keeping both bases constant, how does area change?', correct: isEl ? 'Διπλασιάζεται' : 'Doubles', distractors: isEl ? ['Τετραπλασιάζεται', 'Παραμένει ίδιο', 'Υποδιπλασιάζεται'] : ['Quadruples', 'Remains same', 'Halved'], expl: isEl ? 'Το εμβαδόν είναι ανάλογο του ύψους.' : 'Area is proportional to height.' }),
  (isEl) => ({ prompt: isEl ? 'Τζαμαρία στέγης σε σχήμα τραπεζίου έχει βάσεις 10 m και 6 m και ύψος 4 m. Πόσα m² τζαμιού χρειάζονται;' : 'A skylight trapezoid has bases 10 m and 6 m and height 4 m. How many m² of glass are needed?', correct: '32 m²', distractors: ['64 m²', '40 m²', '24 m²'], expl: '[(10 ＋ 6) · 4] : 2 ＝ 32 m².' }),
  (isEl) => ({ prompt: isEl ? 'Ένα τραπέζιο χωρίζεται από μία διαγώνιο σε δύο επιμέρους τρίγωνα με βάσεις Β και b και κοινό ύψος υ. Τι ισχύει για το εμβαδόν του;' : 'A trapezoid is split by a diagonal into two triangles with bases B, b and common height h. What is true of its area?', correct: isEl ? 'Ισούται με το άθροισμα των εμβαδών των 2 τριγώνων: (Β · υ) : 2 ＋ (b · υ) : 2' : 'Equals the sum of the 2 triangle areas: (B · h) : 2 ＋ (b · h) : 2', distractors: isEl ? ['Ισούται με το γινόμενο των τριγώνων', 'Είναι διπλάσιο από το άθροισμα', 'Δεν ισχύει'] : ['Equals the product of areas', 'Double the sum', 'Does not hold'], expl: 'Ε ＝ (Β · υ) : 2 ＋ (b · υ) : 2.' }),
  (isEl) => ({ prompt: isEl ? 'Ένα τραπέζιο έχει εμβαδόν 20 dm². Πόσα τετραγωνικά εκατοστόμετρα (cm²) είναι το εμβαδόν του;' : 'A trapezoid has area 20 dm². How many square centimeters (cm²) is its area?', correct: isEl ? '2.000 cm²' : '2,000 cm²', distractors: isEl ? ['200 cm²', '20.000 cm²', '4.000 cm²'] : ['200 cm²', '20,000 cm²', '4,000 cm²'], expl: '20 · 100 ＝ 2.000 cm².' })
];

// --- ΚΕΦΑΛΑΙΟ 76: ΕΜΒΑΔΟΝ ΚΥΚΛΟΥ ---
const POOL_Q19 = [
  (isEl) => ({ prompt: isEl ? 'Ποιος είναι ο τύπος για το εμβαδόν του κύκλου με ακτίνα ρ;' : 'What is the formula for the area of a circle with radius r?', correct: isEl ? 'Ε ＝ π · ρ²' : 'A ＝ π · r²', distractors: isEl ? ['Ε ＝ 2 · π · ρ', 'Ε ＝ π · ρ', 'Ε ＝ 2 · π · ρ²'] : ['A ＝ 2 · π · r', 'A ＝ π · r', 'A ＝ 2 · π · r²'], expl: isEl ? 'Εμβαδόν κύκλου ＝ π · ρ².' : 'Circle area ＝ π · r².' }),
  (isEl) => ({ prompt: isEl ? 'Τι σημαίνει το σύμβολο ρ² στον τύπο του εμβαδού κύκλου;' : 'What does symbol r² mean in circle area formula?', correct: isEl ? 'Η ακτίνα πολλαπλασιασμένη με τον εαυτό της: ρ · ρ' : 'Radius multiplied by itself: r · r', distractors: isEl ? ['Η ακτίνα πολλαπλασιασμένη επί 2: ρ · 2', 'Η διάμετρος', 'Η ακτίνα συν 2'] : ['Radius multiplied by 2: r · 2', 'Diameter', 'Radius plus 2'], expl: 'ρ² ＝ ρ · ρ.' }),
  (isEl) => ({ prompt: isEl ? 'Ένας κύκλος έχει ακτίνα ρ ＝ 10 cm. Πόσο είναι το εμβαδόν του; (π ＝ 3,14)' : 'A circle has radius r ＝ 10 cm. What is its area? (π ＝ 3.14)', correct: '314 cm²', distractors: [isEl ? '62,8 cm²' : '62.8 cm²', isEl ? '31,4 cm²' : '31.4 cm²', '628 cm²'], expl: '3,14 · 10 · 10 ＝ 314 cm².' }),
  (isEl) => ({ prompt: isEl ? 'Ένας κύκλος έχει ακτίνα ρ ＝ 2 cm. Πόσο είναι το εμβαδόν του; (π ＝ 3,14)' : 'A circle has radius r ＝ 2 cm. What is its area? (π ＝ 3.14)', correct: isEl ? '12,56 cm²' : '12.56 cm²', distractors: [isEl ? '6,28 cm²' : '6.28 cm²', isEl ? '25,12 cm²' : '25.12 cm²', '4 cm²'], expl: '3,14 · 2 · 2 ＝ 12,56 cm².' }),
  (isEl) => ({ prompt: isEl ? 'Ένας κύκλος έχει διάμετρο δ ＝ 20 cm (ακτίνα ρ ＝ 10 cm). Πόσο είναι το εμβαδόν του; (π ＝ 3,14)' : 'A circle has diameter d ＝ 20 cm (radius r ＝ 10 cm). What is its area? (π ＝ 3.14)', correct: '314 cm²', distractors: [isEl ? '1.256 cm²' : '1,256 cm²', isEl ? '62,8 cm²' : '62.8 cm²', '628 cm²'], expl: '3,14 · 10 · 10 ＝ 314 cm².' }),
  (isEl) => ({ prompt: isEl ? 'Πώς υπολογίζουμε το εμβαδόν ενός ημικυκλίου ακτίνας ρ;' : 'How do we calculate the area of a semicircle with radius r?', correct: isEl ? 'Εημικ ＝ (π · ρ²) : 2' : 'Asemi ＝ (π · r²) : 2', distractors: isEl ? ['Εημικ ＝ π · ρ²', 'Εημικ ＝ (2 · π · ρ) : 2', 'Εημικ ＝ π · ρ'] : ['Asemi ＝ π · r²', 'Asemi ＝ (2 · π · r) : 2', 'Asemi ＝ π · r'], expl: isEl ? 'Το ημικύκλιο είναι το μισό του κύκλου: (π · ρ²) : 2.' : 'A semicircle is half a circle: (π · r²) : 2.' }),
  (isEl) => ({ prompt: isEl ? 'Πόσο είναι το εμβαδόν ενός ημικυκλίου με ακτίνα ρ ＝ 10 cm; (π ＝ 3,14)' : 'What is the area of a semicircle with radius r ＝ 10 cm? (π ＝ 3.14)', correct: '157 cm²', distractors: ['314 cm²', isEl ? '62,8 cm²' : '62.8 cm²', isEl ? '78,5 cm²' : '78.5 cm²'], expl: '(3,14 · 100) : 2 ＝ 157 cm².' }),
  (isEl) => ({ prompt: isEl ? 'Ποια είναι η διαφορά ανάμεσα στην περίμετρο και στο εμβαδόν του κύκλου;' : 'What is the difference between circumference and area of a circle?', correct: isEl ? 'Η περίμετρος είναι μήκος γραμμής (2 · π · ρ), ενώ το εμβαδόν είναι επιφάνεια (π · ρ²)' : 'Circumference is line length (2 · π · r), while area is surface (π · r²)', distractors: isEl ? ['Είναι το ίδιο πράγμα', 'Η περίμετρος είναι σε cm² και το εμβαδόν σε cm', 'Το εμβαδόν είναι 2 · π · ρ'] : ['They are identical', 'Circumference in cm² and area in cm', 'Area is 2 · π · r'], expl: isEl ? 'Περίμετρος ＝ 2 · π · ρ, Εμβαδόν ＝ π · ρ².' : 'Circumference ＝ 2 · π · r, Area ＝ π · r².' })
];

const POOL_Q20 = [
  (isEl) => ({ prompt: isEl ? 'Στρογγυλό τραπέζι έχει διάμετρο δ ＝ 1,6 m (ακτίνα ρ ＝ 0,8 m). Πόσο είναι το εμβαδόν του; (π ＝ 3,14)' : 'A round table has diameter d ＝ 1.6 m (radius r ＝ 0.8 m). What is its area? (π ＝ 3.14)', correct: isEl ? '2,0096 m² (≈ 2,01 m²)' : '2.0096 m² (≈ 2.01 m²)', distractors: [isEl ? '5,024 m²' : '5.024 m²', isEl ? '1,0048 m²' : '1.0048 m²', isEl ? '2,512 m²' : '2.512 m²'], expl: '3,14 · 0,8 · 0,8 ＝ 2,0096 m².' }),
  (isEl) => ({ prompt: isEl ? 'Κυκλική πισίνα έχει ακτίνα 4 m (Ε = 50,24 m²) και γύρω της διάδρομο πλάτους 1 m (εξωτερική ακτίνα 5 m, Ε = 78,5 m²). Πόσο είναι το εμβαδόν μόνο του διαδρόμου;' : 'A circular pool has radius 4 m (A = 50.24 m²) and a surrounding 1 m path (outer radius 5 m, A = 78.5 m²). What is the path area alone?', correct: isEl ? '28,26 m²' : '28.26 m²', distractors: [isEl ? '78,5 m²' : '78.5 m²', isEl ? '50,24 m²' : '50.24 m²', isEl ? '12,56 m²' : '12.56 m²'], expl: '78,5 － 50,24 ＝ 28,26 m².' }),
  (isEl) => ({ prompt: isEl ? 'Αν διπλασιάσουμε την ακτίνα ενός κύκλου (από ρ σε 2ρ), πόσες φορές μεγαλύτερο γίνεται το εμβαδόν του;' : 'If we double the radius of a circle (from r to 2r), how many times larger does its area become?', correct: isEl ? '4 φορές μεγαλύτερο (τετραπλασιάζεται)' : '4 times larger (quadruples)', distractors: isEl ? ['2 φορές μεγαλύτερο', '8 φορές μεγαλύτερο', 'Παραμένει ίδιο'] : ['2 times larger', '8 times larger', 'Remains same'], expl: '2 · 2 ＝ 4.' }),
  (isEl) => ({ prompt: isEl ? 'Αν τριπλασιάσουμε την ακτίνα ενός κύκλου, πόσες φορές μεγαλύτερο γίνεται το εμβαδόν του;' : 'If we triple the radius of a circle, how many times larger does its area become?', correct: isEl ? '9 φορές μεγαλύτερο' : '9 times larger', distractors: isEl ? ['3 φορές μεγαλύτερο', '6 φορές μεγαλύτερο', '27 φορές μεγαλύτερο'] : ['3 times larger', '6 times larger', '27 times larger'], expl: '3 · 3 ＝ 9.' }),
  (isEl) => ({ prompt: isEl ? 'Πίτα έχει σχήμα κύκλου με ακτίνα 20 cm (ολόκληρη 1.256 cm²). Πόσο είναι το εμβαδόν του 1/4 της πίτας;' : 'A pie is a circle of radius 20 cm (whole 1,256 cm²). What is the area of 1/4 of the pie?', correct: '314 cm²', distractors: ['628 cm²', '157 cm²', isEl ? '125,6 cm²' : '125.6 cm²'], expl: '1.256 : 4 ＝ 314 cm².' }),
  (isEl) => ({ prompt: isEl ? 'Μέσα σε τετράγωνο πλευράς 10 cm (Ε = 100 cm²) σχεδιάζουμε κύκλο ακτίνας ρ = 5 cm (Ε = 78,5 cm²). Πόσο εμβαδόν περισσεύει στις γωνίες;' : 'Inside a square of side 10 cm (A = 100 cm²) we inscribe a circle of radius r = 5 cm (A = 78.5 cm²). What area remains in the corners?', correct: isEl ? '21,5 cm²' : '21.5 cm²', distractors: [isEl ? '78,5 cm²' : '78.5 cm²', isEl ? '31,4 cm²' : '31.4 cm²', '15 cm²'], expl: '100 － 78,5 ＝ 21,5 cm².' }),
  (isEl) => ({ prompt: isEl ? 'Οικογενειακή πίτσα έχει διάμετρο 30 cm (ακτίνα ρ = 15 cm). Πόσο είναι το εμβαδόν της; (π ＝ 3,14)' : 'A family pizza has diameter 30 cm (radius r = 15 cm). What is its area? (π ＝ 3.14)', correct: isEl ? '706,5 cm²' : '706.5 cm²', distractors: [isEl ? '2.826 cm²' : '2,826 cm²', isEl ? '94,2 cm²' : '94.2 cm²', isEl ? '353,25 cm²' : '353.25 cm²'], expl: '3,14 · 15 · 15 ＝ 706,5 cm².' }),
  (isEl) => ({ prompt: isEl ? 'Πώς υπολογίζουμε το εμβαδόν ενός κυκλικού δακτυλίου (ροδέλας);' : 'How do we compute the area of a circular ring (washer)?', correct: isEl ? 'Αφαιρούμε το εμβαδόν του μικρού κύκλου από τον μεγάλο κύκλο: Εμεγ － Εμικ' : 'Subtract the inner circle area from the outer circle area: Aouter － Ainner', distractors: isEl ? ['Προσθέτουμε τα δύο εμβαδά', 'Πολλαπλασιάζουμε τις δύο ακτίνες', 'Διαιρούμε τις ακτίνες διά 2'] : ['Add the two areas', 'Multiply the two radii', 'Divide radii by 2'], expl: 'Εδακτυλίου ＝ Εμεγ － Εμικ.' })
];

// --- ΚΕΦΑΛΑΙΟ 77: ΑΝΑΠΤΥΓΜΑΤΑ ΚΥΒΟΥ & ΟΡΘΟΓΩΝΙΟΥ ---
const POOL_Q21 = [
  (isEl) => ({ prompt: isEl ? 'Πόσες έδρες έχει ο κύβος και τι σχήμα έχουν;' : 'How many faces does a cube have and what shape are they?', correct: isEl ? '6 έδρες που είναι όλες ίσα τετράγωνα' : '6 faces that are all congruent squares', distractors: isEl ? ['6 έδρες ορθογώνια παραλληλόγραμμα', '8 έδρες τρίγωνα', '12 έδρες'] : ['6 rectangular faces', '8 triangular faces', '12 faces'], expl: isEl ? 'Ο κύβος έχει 6 ίσες τετράγωνες έδρες.' : 'A cube has 6 congruent square faces.' }),
  (isEl) => ({ prompt: isEl ? 'Πόσες έδρες έχει το ορθογώνιο παραλληλεπίπεδο;' : 'How many faces does a rectangular prism have?', correct: isEl ? '6 έδρες (ανά δύο απέναντι είναι ίσες)' : '6 faces (opposite faces are pairwise congruent)', distractors: isEl ? ['12 έδρες', '8 έδρες', '4 έδρες'] : ['12 faces', '8 faces', '4 faces'], expl: isEl ? 'Έχει 6 έδρες χωρισμένες σε 3 ζεύγη ίσων ορθογωνίων.' : 'Has 3 pairs of identical rectangles.' }),
  (isEl) => ({ prompt: isEl ? 'Τι ονομάζεται ανάπτυγμα ενός στερεού;' : 'What is the net of a 3D solid?', correct: isEl ? 'Το επίπεδο σχήμα που προκύπτει αν ανοίξουμε όλες τις έδρες του σε μία επιφάνεια' : 'The flat 2D shape obtained by unfolding all its faces onto a plane', distractors: isEl ? ['Το βάρος του στερεού', 'Ο όγκος του νερού που χωράει', 'Το μήκος των ακμών του'] : ['Solid weight', 'Water volume held', 'Total edge length'], expl: isEl ? 'Ανάπτυγμα είναι το επίπεδο σχέδιο όλων των εδρών.' : 'A net is the unfolded 2D representation.' }),
  (isEl) => ({ prompt: isEl ? 'Πόσα διαφορετικά επίπεδα αναπτύγματα υπάρχουν συνολικά για τον κύβο;' : 'How many distinct planar nets exist for a cube in total?', correct: isEl ? '11 διαφορετικά αναπτύγματα' : '11 distinct nets', distractors: isEl ? ['6 αναπτύγματα', '8 αναπτύγματα', '12 αναπτύγματα'] : ['6 nets', '8 nets', '12 nets'], expl: isEl ? 'Υπάρχουν ακριβώς 11 δυνατά αναπτύγματα κύβου.' : 'There are exactly 11 valid cube nets.' }),
  (isEl) => ({ prompt: isEl ? 'Ποιο από τα παρακάτω ΔΕΝ μπορεί ποτέ να είναι ανάπτυγμα κύβου;' : 'Which arrangement can NEVER form a cube net?', correct: isEl ? 'Μια διάταξη όπου 4 τετράγωνα σχηματίζουν ένα μπλοκ 2 × 2' : 'An arrangement where 4 squares form a 2 × 2 block', distractors: isEl ? ['Μια διάταξη σε σχήμα σταυρού', 'Μια διάταξη σε σχήμα Τ', 'Μια διάταξη με 4 τετράγωνα στη σειρά και 2 εκατέρωθεν'] : ['A cross layout', 'A T-shaped layout', 'A row of 4 squares with 2 on opposite sides'], expl: isEl ? 'Μπλοκ 2 × 2 δεν διπλώνει ποτέ σε κύβο.' : 'A 2 × 2 block cannot fold into a cube.' }),
  (isEl) => { const a = randInt(4, 10); return { prompt: isEl ? `Πόσο είναι το εμβαδόν του αναπτύγματος ενός κύβου με ακμή ${a} cm;` : `What is the total surface area of a cube net with edge ${a} cm?`, correct: `${6 * a * a} cm²`, distractors: [`${a * a} cm²`, `${4 * a * a} cm²`, `${12 * a} cm²`], expl: `6 · (${a} · ${a}) ＝ ${6 * a * a} cm².` }; },
  (isEl) => ({ prompt: isEl ? 'Ένας κύβος έχει ακμή 5 cm. Πόσο χαρτόνι σε cm² χρειάζεται για το ανάπτυγμά του;' : 'A cube has edge 5 cm. How much cardboard in cm² is needed for its net?', correct: '150 cm²', distractors: ['25 cm²', '100 cm²', '125 cm²'], expl: '6 · 25 ＝ 150 cm².' }),
  (isEl) => ({ prompt: isEl ? 'Πώς υπολογίζουμε το εμβαδόν του αναπτύγματος ενός ορθογωνίου παραλληλεπιπέδου με διαστάσεις α, β, γ;' : 'How do we calculate total surface area of a rectangular prism with dimensions a, b, c?', correct: isEl ? 'Εολ ＝ 2 · (α · β ＋ β · γ ＋ α · γ)' : 'Atot ＝ 2 · (a · b ＋ b · c ＋ a · c)', distractors: isEl ? ['Εολ ＝ α · β · γ', 'Εολ ＝ 6 · (α ＋ β ＋ γ)', 'Εολ ＝ 4 · (α ＋ β ＋ γ)'] : ['Atot ＝ a · b · c', 'Atot ＝ 6 · (a ＋ b ＋ c)', 'Atot ＝ 4 · (a ＋ b ＋ c)'], expl: isEl ? '2 · (αβ ＋ βγ ＋ αγ).' : '2 · (ab ＋ bc ＋ ac).' })
];

const POOL_Q22 = [
  (isEl) => ({ prompt: isEl ? 'Κουτί δώρου έχει διαστάσεις 20 cm, 15 cm και 10 cm. Πόσο χαρτί περιτυλίγματος σε cm² χρειάζονται οι 6 έδρες του;' : 'A gift box measures 20 cm, 15 cm, and 10 cm. How much wrapping paper in cm² is needed for its 6 faces?', correct: isEl ? '1.300 cm²' : '1,300 cm²', distractors: [isEl ? '650 cm²' : '650 cm²', isEl ? '3.000 cm²' : '3,000 cm²', isEl ? '1.000 cm²' : '1,000 cm²'], expl: '2 · (300 ＋ 150 ＋ 200) ＝ 1.300 cm².' }),
  (isEl) => ({ prompt: isEl ? 'Ζάρι κύβος έχει ακμή 8 cm. Πόση είναι η ολική επιφάνεια των 6 εδρών του;' : 'A cube die has edge 8 cm. What is the total surface area of its 6 faces?', correct: '384 cm²', distractors: ['64 cm²', '512 cm²', '192 cm²'], expl: '6 · 64 ＝ 384 cm².' }),
  (isEl) => ({ prompt: isEl ? 'Το ανάπτυγμα ενός κύβου έχει ολικό εμβαδόν 96 cm². Πόσο είναι το μήκος της ακμής του;' : 'A cube net has total surface area 96 cm². What is its edge length?', correct: '4 cm', distractors: ['16 cm', '6 cm', '8 cm'], expl: '96 : 6 ＝ 16, 4 · 4 ＝ 16.' }),
  (isEl) => ({ prompt: isEl ? 'Ένας κύβος έχει ολική επιφάνεια 150 cm². Πόσο είναι το εμβαδόν της μίας έδρας του;' : 'A cube has total surface area 150 cm². What is the area of one face?', correct: '25 cm²', distractors: ['5 cm²', '30 cm²', '50 cm²'], expl: '150 : 6 ＝ 25 cm².' }),
  (isEl) => ({ prompt: isEl ? 'Αν ένα κουτί σε σχήμα κύβου είναι ανοιχτό από πάνω (δεν έχει καπάκι), από πόσες έδρες αποτελείται το ανάπτυγμά του;' : 'If a cube box is open at the top (no lid), how many faces make up its net?', correct: isEl ? '5 έδρες' : '5 faces', distractors: isEl ? ['6 έδρες', '4 έδρες', '8 έδρες'] : ['6 faces', '4 faces', '8 faces'], expl: isEl ? 'Χωρίς καπάκι έχει 5 έδρες.' : 'Without lid it has 5 faces.' }),
  (isEl) => ({ prompt: isEl ? 'Ένας κύβος έχει ακμή 10 cm (Εολ = 600 cm²). Πόσα dm² είναι το εμβαδόν του αναπτύγματός του;' : 'A cube has edge 10 cm (Atot = 600 cm²). How many dm² is its net area?', correct: '6 dm²', distractors: ['60 dm²', `${formatNum(0.6, isEl ? 'el' : 'en')} dm²`, '600 dm²'], expl: '600 : 100 ＝ 6 dm².' }),
  (isEl) => ({ prompt: isEl ? 'Μπορεί ένα ανάπτυγμα κύβου να έχει 5 τετράγωνα σε ευθεία γραμμή;' : 'Can a valid cube net have 5 squares in a single straight row?', correct: isEl ? 'Όχι, το πολύ 4 τετράγωνα μπορούν να είναι στη σειρά' : 'No, at most 4 squares can be in a row', distractors: isEl ? ['Ναι, πάντοτε', 'Ναι, αν το 6ο μπει στο πλάι', 'Μόνο αν είναι μεγάλος κύβος'] : ['Yes, always', 'Yes, if 6th is on side', 'Only if cube is large'], expl: isEl ? 'Το μέγιστο πλήθος στη σειρά είναι 4.' : 'Maximum squares in a row is 4.' }),
  (isEl) => ({ prompt: isEl ? 'Κουτί έχει διαστάσεις 10 cm, 5 cm και 4 cm. Πόσο είναι το ολικό εμβαδόν των 6 εδρών του;' : 'A box has dimensions 10 cm, 5 cm, and 4 cm. What is the total area of its 6 faces?', correct: '220 cm²', distractors: ['110 cm²', '200 cm²', '240 cm²'], expl: '2 · (50 ＋ 20 ＋ 40) ＝ 220 cm².' })
];

// --- ΚΕΦΑΛΑΙΟ 78: ΑΚΜΕΣ & ΚΟΡΥΦΕΣ ---
const POOL_Q23 = [
  (isEl) => ({ prompt: isEl ? 'Πόσες ακμές και πόσες κορυφές έχει ο κύβος;' : 'How many edges and vertices does a cube have?', correct: isEl ? '12 ακμές και 8 κορυφές' : '12 edges and 8 vertices', distractors: isEl ? ['8 ακμές και 12 κορυφές', '6 ακμές και 8 κορυφές', '12 ακμές και 6 κορυφές'] : ['8 edges and 12 vertices', '6 edges and 8 vertices', '12 edges and 6 vertices'], expl: isEl ? '12 ακμές και 8 κορυφές.' : '12 edges and 8 vertices.' }),
  (isEl) => ({ prompt: isEl ? 'Πόσες ακμές και πόσες κορυφές έχει το ορθογώνιο παραλληλεπίπεδο;' : 'How many edges and vertices does a rectangular prism have?', correct: isEl ? '12 ακμές και 8 κορυφές' : '12 edges and 8 vertices', distractors: isEl ? ['8 ακμές και 12 κορυφές', '12 ακμές και 12 κορυφές', '6 ακμές και 8 κορυφές'] : ['8 edges and 12 vertices', '12 edges and 12 vertices', '6 edges and 8 vertices'], expl: isEl ? 'Όπως και ο κύβος, έχει 12 ακμές και 8 κορυφές.' : 'Like a cube, 12 edges and 8 vertices.' }),
  (isEl) => ({ prompt: isEl ? 'Τι είναι η ακμή ενός γεωμετρικού στερεού;' : 'What is the edge of a geometric solid?', correct: isEl ? 'Το ευθύγραμμο τμήμα όπου συναντώνται δύο γειτονικές έδρες' : 'The line segment where two adjacent faces meet', distractors: isEl ? ['Το γωνιακό σημείο', 'Η επιφάνεια του στερεού', 'Η διαγώνιος'] : ['The corner point', 'The surface area', 'The diagonal'], expl: isEl ? 'Ακμή είναι η γραμμή τομής δύο εδρών.' : 'An edge is the intersection line of 2 faces.' }),
  (isEl) => ({ prompt: isEl ? 'Τι είναι η κορυφή ενός γεωμετρικού στερεού;' : 'What is the vertex of a geometric solid?', correct: isEl ? 'Το σημείο («γωνία») όπου συναντώνται 3 ακμές' : 'The corner point where 3 edges meet', distractors: isEl ? ['Η γραμμή της βάσης', 'Το κέντρο του κουτιού', 'Η επίπεδη έδρα'] : ['Base line', 'Center of box', 'Flat face'], expl: isEl ? 'Κορυφή είναι το σημείο συνάντησης 3 ακμών.' : 'A vertex is the junction of 3 edges.' }),
  (isEl) => ({ prompt: isEl ? 'Ποιος είναι ο διάσημος τύπος του Euler για τα κυρτά πολύεδρα;' : 'What is Euler\'s famous formula for convex polyhedra?', correct: isEl ? 'Έδρες ＋ Κορυφές ＝ Ακμές ＋ 2 (Ε ＋ Κ ＝ Α ＋ 2)' : 'Faces ＋ Vertices ＝ Edges ＋ 2 (F ＋ V ＝ E ＋ 2)', distractors: isEl ? ['Ε ＋ Α ＝ Κ ＋ 2', 'Ε · Κ ＝ Α ＋ 2', 'Ε ＋ Κ ＋ Α ＝ 2'] : ['F ＋ E ＝ V ＋ 2', 'F · V ＝ E ＋ 2', 'F ＋ V ＋ E ＝ 2'], expl: 'F ＋ V ＝ E ＋ 2.' }),
  (isEl) => ({ prompt: isEl ? 'Πόσο ισούται το άθροισμα Έδρες ＋ Κορυφές στον κύβο σύμφωνα με τον Euler;' : 'What is the sum of Faces ＋ Vertices in a cube according to Euler?', correct: '14 (6 ＋ 8 ＝ 14)', distractors: ['12', '16', '10'], expl: '6 ＋ 8 ＝ 14.' }),
  (isEl) => { const a = randInt(4, 12); return { prompt: isEl ? `Πόσο σύρμα σε cm χρειάζεται για να φτιάξουμε τις 12 ακμές ενός κύβου με ακμή ${a} cm;` : `How much wire in cm is needed to form all 12 edges of a cube with edge ${a} cm?`, correct: `${12 * a} cm`, distractors: [`${6 * a} cm`, `${8 * a} cm`, `${a * a} cm`], expl: `12 · ${a} ＝ ${12 * a} cm.` }; },
  (isEl) => ({ prompt: isEl ? 'Πώς κατανέμονται οι 12 ακμές στο ορθογώνιο παραλληλεπίπεδο;' : 'How are the 12 edges grouped in a rectangular prism?', correct: isEl ? 'Σε 3 ομάδες των 4 ίσων ακμών (4 μήκη, 4 πλάτη, 4 ύψη)' : 'Into 3 groups of 4 equal edges (4 lengths, 4 widths, 4 heights)', distractors: isEl ? ['Είναι και οι 12 ίσες', 'Σε 2 ομάδες των 6', 'Σε 6 ομάδες των 2'] : ['All 12 equal', '2 groups of 6', '6 groups of 2'], expl: isEl ? '4 μήκη, 4 πλάτη και 4 ύψη.' : '4 lengths, 4 widths, 4 heights.' })
];

const POOL_Q24 = [
  (isEl) => ({ prompt: isEl ? 'Σκελετός ορθογωνίου παραλληλεπιπέδου έχει διαστάσεις 10 cm, 6 cm και 4 cm. Πόσο σύρμα χρειάζονται οι 12 ακμές;' : 'A rectangular prism frame has dimensions 10 cm, 6 cm, and 4 cm. How much wire is needed for 12 edges?', correct: '80 cm', distractors: ['20 cm', '40 cm', '100 cm'], expl: '4 · (10 ＋ 6 ＋ 4) ＝ 80 cm.' }),
  (isEl) => ({ prompt: isEl ? 'Ένας σκελετός κύβου κατασκευάστηκε με 96 cm σύρμα. Πόσο είναι το μήκος της μίας ακμής του;' : 'A cube frame was made with 96 cm of wire. What is the length of one edge?', correct: '8 cm', distractors: ['12 cm', '6 cm', '16 cm'], expl: '96 : 12 ＝ 8 cm.' }),
  (isEl) => ({ prompt: isEl ? 'Σκελετός ορθογωνίου κουτιού χρειάστηκε 120 cm σύρμα. Αν μήκος = 15 cm και πλάτος = 10 cm, πόσο είναι το ύψος;' : 'A rectangular box frame required 120 cm of wire. If length = 15 cm and width = 10 cm, what is height?', correct: '5 cm', distractors: ['10 cm', '8 cm', '4 cm'], expl: '120 : 4 ＝ 30, 30 － 25 ＝ 5 cm.' }),
  (isEl) => ({ prompt: isEl ? 'Πόσα μέτρα (m) πηχακίου χρειάζονται για τις 12 ακμές ενός κύβου με ακμή 50 cm;' : 'How many meters (m) of wooden strip are needed for 12 edges of a cube with edge 50 cm?', correct: '6 m (600 cm)', distractors: ['12 m', '3 m', '5 m'], expl: '12 · 50 cm ＝ 600 cm ＝ 6 m.' }),
  (isEl) => ({ prompt: isEl ? 'Πόσες κορυφές βρίσκονται στην πάνω βάση ενός ορθογωνίου παραλληλεπιπέδου;' : 'How many vertices are on the top base of a rectangular prism?', correct: isEl ? '4 κορυφές' : '4 vertices', distractors: isEl ? ['8 κορυφές', '2 κορυφές', '6 κορυφές'] : ['8 vertices', '2 vertices', '6 vertices'], expl: isEl ? '4 στην πάνω και 4 στην κάτω βάση.' : '4 on top and 4 on bottom base.' }),
  (isEl) => ({ prompt: isEl ? 'Αν διπλασιάσουμε την ακμή ενός κύβου, πώς αλλάζει το συνολικό μήκος των 12 ακμών του;' : 'If we double the edge of a cube, how does total perimeter of its 12 edges change?', correct: isEl ? 'Διπλασιάζεται' : 'Doubles', distractors: isEl ? ['Τετραπλασιάζεται', 'Μένει ίδιο', 'Γίνεται 12 φορές μεγαλύτερο'] : ['Quadruples', 'Remains same', 'Becomes 12 times larger'], expl: isEl ? 'Γραμμικό μέγεθος, άρα διπλασιάζεται.' : 'Linear measurement, so it doubles.' }),
  (isEl) => ({ prompt: isEl ? 'Ξύλινο κλουβί έχει διαστάσεις 50 cm, 30 cm και 20 cm. Πόσα cm πηχακίου χρειάζονται για τον σκελετό του;' : 'A wooden cage has dimensions 50 cm, 30 cm, and 20 cm. How many cm of wood are needed for its frame?', correct: '400 cm (4 m)', distractors: ['100 cm', '200 cm', '300 cm'], expl: '4 · 100 ＝ 400 cm ＝ 4 m.' }),
  (isEl) => ({ prompt: isEl ? 'Σε έναν κύβο, πόσες ορθές γωνίες (90°) σχηματίζονται συνολικά και στις 6 τετράγωνες έδρες του;' : 'In a cube, how many right angles (90°) are formed across all 6 square faces?', correct: isEl ? '24 ορθές γωνίες' : '24 right angles', distractors: isEl ? ['12 ορθές γωνίες', '8 ορθές γωνίες', '36 ορθές γωνίες'] : ['12 right angles', '8 right angles', '36 right angles'], expl: '6 · 4 ＝ 24.' })
];

// --- ΚΕΦΑΛΑΙΟ 79: ΚΥΛΙΝΔΡΟΣ & ΕΜΒΑΔΟΝ ---
const POOL_Q25 = [
  (isEl) => ({ prompt: isEl ? 'Από ποια μέρη αποτελείται το ανάπτυγμα ενός κυλίνδρου;' : 'What parts make up the net of a cylinder?', correct: isEl ? 'Από 1 ορθογώνιο παραλληλόγραμμο και 2 ίσους κυκλικούς δίσκους' : '1 rectangle and 2 congruent circular discs', distractors: isEl ? ['Από 2 ορθογώνια και 1 κύκλο', 'Από 1 τρίγωνο και 2 κύκλους', 'Από 6 ορθογώνια'] : ['2 rectangles and 1 circle', '1 triangle and 2 circles', '6 rectangles'], expl: isEl ? '1 ορθογώνιο και 2 κύκλοι.' : '1 rectangle and 2 circles.' }),
  (isEl) => ({ prompt: isEl ? 'Με τι ισούται το μήκος του ορθογωνίου στο ανάπτυγμα ενός κυλίνδρου ακτίνας ρ;' : 'What does the length of the rectangle in a cylinder net equal?', correct: isEl ? 'Με την περίμετρο της βάσης: 2 · π · ρ' : 'Base perimeter: 2 · π · r', distractors: isEl ? ['Με το εμβαδόν της βάσης: π · ρ²', 'Με το ύψος υ', 'Με τη διάμετρο δ'] : ['Base area: π · r²', 'Height h', 'Diameter d'], expl: isEl ? 'Τυλίγει τη βάση: 2 · π · ρ.' : 'Wraps base: 2 · π · r.' }),
  (isEl) => ({ prompt: isEl ? 'Ποιος είναι ο τύπος για την παράπλευρη επιφάνεια (Επ) του κυλίνδρου;' : 'What is the formula for cylinder lateral surface area (Alat)?', correct: isEl ? 'Επ ＝ (2 · π · ρ) · υ' : 'Alat ＝ (2 · π · r) · h', distractors: isEl ? ['Επ ＝ (π · ρ²) · υ', 'Επ ＝ 2 · π · ρ²', 'Επ ＝ π · ρ · υ'] : ['Alat ＝ (π · r²) · h', 'Alat ＝ 2 · π · r²', 'Alat ＝ π · r · h'], expl: isEl ? 'Επ ＝ (2 · π · ρ) · υ.' : 'Alat ＝ (2 · π · r) · h.' }),
  (isEl) => ({ prompt: isEl ? 'Πώς υπολογίζουμε το ολικό εμβαδόν (Εολ) ενός κλειστού κυλίνδρου;' : 'How do we calculate total surface area (Atot) of a closed cylinder?', correct: isEl ? 'Εολ ＝ Επ ＋ 2 · Εβ (παράπλευρη επιφάνεια συν 2 βάσεις)' : 'Atot ＝ Alat ＋ 2 · Abase (lateral plus 2 bases)', distractors: isEl ? ['Εολ ＝ Επ ＋ Εβ (μόνο μία βάση)', 'Εολ ＝ Επ · Εβ', 'Εολ ＝ 2 · π · ρ · υ'] : ['Atot ＝ Alat ＋ Abase (one base)', 'Atot ＝ Alat · Abase', 'Atot ＝ 2 · π · r · h'], expl: isEl ? 'Εολ ＝ Επ ＋ 2 · Εβ.' : 'Atot ＝ Alat ＋ 2 · Abase.' }),
  (isEl) => ({ prompt: isEl ? 'Κύλινδρος έχει ακτίνα ρ ＝ 5 cm και ύψος υ ＝ 10 cm. Πόση είναι η παράπλευρη επιφάνειά του; (π ＝ 3,14)' : 'A cylinder has radius r ＝ 5 cm and height h ＝ 10 cm. What is lateral area? (π ＝ 3.14)', correct: '314 cm²', distractors: ['157 cm²', '628 cm²', isEl ? '78,5 cm²' : '78.5 cm²'], expl: '2 · 3,14 · 5 · 10 ＝ 314 cm².' }),
  (isEl) => ({ prompt: isEl ? 'Σε έναν κύλινδρο με ακτίνα βάσης ρ ＝ 10 cm, πόσο είναι το εμβαδόν της μίας βάσης του; (π ＝ 3,14)' : 'In a cylinder with base radius r ＝ 10 cm, what is the area of one base? (π ＝ 3.14)', correct: '314 cm²', distractors: [isEl ? '62,8 cm²' : '62.8 cm²', isEl ? '31,4 cm²' : '31.4 cm²', '628 cm²'], expl: '3,14 · 10 · 10 ＝ 314 cm².' }),
  (isEl) => ({ prompt: isEl ? 'Σε έναν κύλινδρο με ακτίνα βάσης ρ ＝ 10 cm, πόσο είναι το συνολικό εμβαδόν και των δύο βάσεων μαζί; (π ＝ 3,14)' : 'In a cylinder with base radius r ＝ 10 cm, what is the area of both bases combined? (π ＝ 3.14)', correct: '628 cm²', distractors: ['314 cm²', '157 cm²', isEl ? '1.256 cm²' : '1,256 cm²'], expl: '2 · 314 ＝ 628 cm².' }),
  (isEl) => ({ prompt: isEl ? 'Αν ένα κυλινδρικό ποτήρι είναι ανοιχτό από πάνω (χωρίς καπάκι), πώς βρίσκουμε το ολικό του εμβαδόν;' : 'If a cylindrical glass is open at top, how do we find total surface area?', correct: isEl ? 'Εολ ＝ Επ ＋ Εβ (παράπλευρη συν μία μόνο βάση)' : 'Atot ＝ Alat ＋ Abase (lateral plus only 1 base)', distractors: isEl ? ['Εολ ＝ Επ ＋ 2 · Εβ', 'Εολ ＝ Επ', 'Εολ ＝ 2 · Εβ'] : ['Atot ＝ Alat ＋ 2 · Abase', 'Atot ＝ Alat', 'Atot ＝ 2 · Abase'], expl: isEl ? 'Προσθέτουμε μόνο 1 βάση.' : 'Include only 1 base.' })
];

const POOL_Q26 = [
  (isEl) => ({ prompt: isEl ? 'Κυλινδρική κονσέρβα έχει διάμετρο δ ＝ 10 cm (ακτίνα ρ ＝ 5 cm) και ύψος 12 cm. Πόσο χαρτί σε cm² χρειάζεται η ετικέτα της; (π ＝ 3,14)' : 'A can has diameter d ＝ 10 cm (radius r ＝ 5 cm) and height 12 cm. What is label area? (π ＝ 3.14)', correct: isEl ? '376,8 cm²' : '376.8 cm²', distractors: [isEl ? '188,4 cm²' : '188.4 cm²', isEl ? '753,6 cm²' : '753.6 cm²', '314 cm²'], expl: '2 · 3,14 · 5 · 12 ＝ 376,8 cm².' }),
  (isEl) => ({ prompt: isEl ? 'Κλειστό βαρέλι έχει ακτίνα 1 m και ύψος 2 m. Πόσα m² είναι η ολική του επιφάνεια; (π ＝ 3,14)' : 'A closed barrel has radius 1 m and height 2 m. What is total surface area? (π ＝ 3.14)', correct: isEl ? '18,84 m²' : '18.84 m²', distractors: [isEl ? '12,56 m²' : '12.56 m²', isEl ? '15,7 m²' : '15.7 m²', isEl ? '6,28 m²' : '6.28 m²'], expl: '12,56 ＋ 6,28 ＝ 18,84 m².' }),
  (isEl) => ({ prompt: isEl ? 'Ανοιχτός κουβάς (χωρίς καπάκι) έχει ακτίνα 10 cm και ύψος 20 cm. Πόση είναι η συνολική επιφάνεια του πλαστικού; (π ＝ 3,14)' : 'An open bucket has radius 10 cm and height 20 cm. What is total plastic surface? (π ＝ 3.14)', correct: isEl ? '1.570 cm²' : '1,570 cm²', distractors: [isEl ? '1.256 cm²' : '1,256 cm²', isEl ? '1.884 cm²' : '1,884 cm²', '314 cm²'], expl: '1.256 ＋ 314 ＝ 1.570 cm².' }),
  (isEl) => ({ prompt: isEl ? 'Αν διπλασιάσουμε μόνο το ύψος ενός κυλίνδρου κρατώντας την ακτίνα σταθερή, πώς αλλάζει η παράπλευρη επιφάνεια;' : 'If we double only the height of a cylinder keeping radius constant, how does lateral area change?', correct: isEl ? 'Διπλασιάζεται' : 'Doubles', distractors: isEl ? ['Τετραπλασιάζεται', 'Μένει ίδια', 'Υποδιπλασιάζεται'] : ['Quadruples', 'Remains same', 'Halved'], expl: isEl ? 'Διπλασιάζεται.' : 'It doubles.' }),
  (isEl) => ({ prompt: isEl ? 'Αν διπλασιάσουμε την ακτίνα βάσης ενός κυλίνδρου, πόσες φορές μεγαλώνει το εμβαδόν της βάσης του;' : 'If we double the base radius of a cylinder, how many times does base area grow?', correct: isEl ? '4 φορές (τετραπλασιάζεται)' : '4 times (quadruples)', distractors: isEl ? ['2 φορές', '8 φορές', 'Μένει ίδιο'] : ['2 times', '8 times', 'Remains same'], expl: '2 · 2 ＝ 4.' }),
  (isEl) => ({ prompt: isEl ? 'Η παράπλευρη επιφάνεια ενός κυλίνδρου είναι 1.256 cm². Πόσα dm² είναι;' : 'Lateral area of a cylinder is 1,256 cm². How many dm² is it?', correct: isEl ? '12,56 dm²' : '12.56 dm²', distractors: [isEl ? '125,6 dm²' : '125.6 dm²', isEl ? '1,256 dm²' : '1.256 dm²', isEl ? '1256 dm²' : '1256 dm²'], expl: '1.256 : 100 ＝ 12,56 dm².' }),
  (isEl) => ({ prompt: isEl ? 'Κύλινδρος έχει ακτίνα 2 cm και ύψος 10 cm. Πόση είναι η παράπλευρη επιφάνειά του; (π ＝ 3,14)' : 'A cylinder has radius 2 cm and height 10 cm. What is lateral area? (π ＝ 3.14)', correct: isEl ? '125,6 cm²' : '125.6 cm²', distractors: [isEl ? '62,8 cm²' : '62.8 cm²', isEl ? '251,2 cm²' : '251.2 cm²', isEl ? '50,24 cm²' : '50.24 cm²'], expl: '2 · 3,14 · 2 · 10 ＝ 125,6 cm².' }),
  (isEl) => ({ prompt: isEl ? 'Είναι ο κύλινδρος πολύεδρο;' : 'Is a cylinder a polyhedron?', correct: isEl ? 'Όχι, είναι σώμα εκ περιστροφής (έχει καμπύλη επιφάνεια)' : 'No, it is a solid of revolution (curved surface)', distractors: isEl ? ['Ναι, γιατί έχει 2 βάσεις', 'Ναι, ανήκει στα πρίσματα', 'Ναι, είναι κυρτό πολύεδρο'] : ['Yes, has 2 bases', 'Yes, it is a prism', 'Yes, convex polyhedron'], expl: isEl ? 'Δεν έχει επίπεδες πολυγωνικές έδρες.' : 'Has no flat polygonal faces.' })
];

// --- ΚΕΦΑΛΑΙΟ 80: ΕΝΝΟΙΑ ΟΓΚΟΥ & ΧΩΡΗΤΙΚΟΤΗΤΑ (M³ ΚΑΙ ΛΙΤΡΑ) ---
const POOL_Q27 = [
  (isEl) => ({ prompt: isEl ? 'Τι είναι ο όγκος ενός στερεού σώματος;' : 'What is the volume of a 3D solid?', correct: isEl ? 'Ο τρισδιάστατος χώρος που καταλαμβάνει (σε 3 διαστάσεις)' : 'The 3-dimensional space it occupies', distractors: isEl ? ['Το εμβαδόν των εξωτερικών του εδρών', 'Το μήκος των ακμών του', 'Το βάρος του σε κιλά'] : ['Surface area of faces', 'Total edge length', 'Weight in kilograms'], expl: isEl ? 'Όγκος είναι ο χώρος που πιάνει ένα σώμα.' : 'Volume is occupied 3D space.' }),
  (isEl) => ({ prompt: isEl ? 'Με πόσα λίτρα (L) ισούται ακριβώς 1 κυβικό δεκατόμετρο (1 dm³);' : 'How many liters (L) does 1 cubic decimeter (1 dm³) equal?', correct: isEl ? '1 Λίτρο (1 L)' : '1 Liter (1 L)', distractors: isEl ? ['10 Λίτρα', '100 Λίτρα', '1.000 Λίτρα'] : ['10 Liters', '100 Liters', '1,000 Liters'], expl: '1 dm³ ＝ 1 L.' }),
  (isEl) => ({ prompt: isEl ? 'Πόσα λίτρα (L) νερού χωράει ακριβώς 1 κυβικό μέτρο (1 m³);' : 'How many liters (L) does 1 cubic meter (1 m³) hold?', correct: isEl ? '1.000 Λίτρα' : '1,000 Liters', distractors: isEl ? ['100 Λίτρα', '10 Λίτρα', '10.000 Λίτρα'] : ['100 Liters', '10 Liters', '10,000 Liters'], expl: '1 m³ ＝ 1.000 L.' }),
  (isEl) => ({ prompt: isEl ? 'Με ποιον αριθμό πολλαπλασιάζουμε για κάθε σκαλοπάτι που κατεβαίνουμε στις μονάδες όγκου;' : 'By what factor do volume units scale per step descending?', correct: isEl ? 'Με το 1.000 (επειδή είναι 3 διαστάσεις: 10 · 10 · 10)' : 'By 1,000 (3 dimensions: 10 · 10 · 10)', distractors: isEl ? ['Με το 100', 'Με το 10', 'Με το 3'] : ['By 100', 'By 10', 'By 3'], expl: '10 · 10 · 10 ＝ 1.000.' }),
  (isEl) => ({ prompt: isEl ? 'Πόσα κυβικά δεκατόμετρα (dm³) περιέχει 1 κυβικό μέτρο (1 m³);' : 'How many cubic decimeters (dm³) are in 1 cubic meter (1 m³)?', correct: isEl ? '1.000 dm³' : '1,000 dm³', distractors: isEl ? ['100 dm²', '10.000 dm³', '1.000.000 dm³'] : ['100 dm³', '10,000 dm³', '1,000,000 dm³'], expl: '1 m³ ＝ 1.000 dm³.' }),
  (isEl) => ({ prompt: isEl ? 'Πόσα κυβικά εκατοστόμετρα (cm³) περιέχει 1 κυβικό δεκατόμετρο (1 dm³);' : 'How many cubic centimeters (cm³) are in 1 cubic decimeter (1 dm³)?', correct: isEl ? '1.000 cm³ (ή 1.000 mL)' : '1,000 cm³ (or 1,000 mL)', distractors: isEl ? ['100 cm³', '10 cm³', '10.000 cm³'] : ['100 cm³', '10 cm³', '10,000 cm³'], expl: '1 dm³ ＝ 1.000 cm³.' }),
  (isEl) => { const m3 = randInt(2, 6); return { prompt: isEl ? `Πόσα λίτρα (L) νερού χωράνε σε μια δεξαμενή όγκου ${m3} m³;` : `How many liters (L) of water fit in a ${m3} m³ tank?`, correct: `${formatNum(m3 * 1000, isEl ? 'el' : 'en')} L`, distractors: [`${m3 * 100} L`, `${m3 * 10} L`, `${m3} L`], expl: `${m3} · 1.000 ＝ ${formatNum(m3 * 1000, isEl ? 'el' : 'en')} L.` }; },
  (isEl) => { const dm3 = randInt(15, 60); return { prompt: isEl ? `Ένα δοχείο έχει όγκο ${dm3} dm³. Πόσα λίτρα είναι η χωρητικότητά του;` : `A container has volume ${dm3} dm³. What is its capacity in liters?`, correct: `${dm3} L`, distractors: [`${dm3 * 10} L`, `${dm3 * 100} L`, `${formatNum(dm3 / 10, isEl ? 'el' : 'en')} L`], expl: `1 dm³ ＝ 1 L, άρα ${dm3} L.` }; }
];

const POOL_Q28 = [
  (isEl) => ({ prompt: isEl ? 'Δεξαμενή έχει διαστάσεις 2 m, 1,5 m και 1 m (όγκος 3 m³). Πόσα λίτρα πετρελαίου χωράει;' : 'A tank measures 2 m, 1.5 m, and 1 m (volume 3 m³). How many liters of fuel does it hold?', correct: isEl ? '3.000 L' : '3,000 L', distractors: [isEl ? '300 L' : '300 L', isEl ? '30.000 L' : '30,000 L', isEl ? '1.500 L' : '1,500 L'], expl: '3 · 1.000 ＝ 3.000 L.' }),
  (isEl) => ({ prompt: isEl ? 'Κυβικό δοχείο έχει ακμή 20 cm (2 dm). Πόσα λίτρα νερού χωράει;' : 'A cube container has edge 20 cm (2 dm). How many liters does it hold?', correct: '8 L', distractors: ['80 L', '800 L', '2 L'], expl: '2 · 2 · 2 ＝ 8 dm³ ＝ 8 L.' }),
  (isEl) => ({ prompt: isEl ? 'Ένα βυτίο περιέχει 4.500 L νερό. Πόσα κυβικά μέτρα (m³) είναι ο όγκος του νερού;' : 'A tanker holds 4,500 L of water. How many cubic meters (m³) is the volume?', correct: isEl ? '4,5 m³' : '4.5 m³', distractors: ['45 m³', '450 m³', isEl ? '0,45 m³' : '0.45 m³'], expl: '4.500 : 1.000 ＝ 4,5 m³.' }),
  (isEl) => ({ prompt: isEl ? 'Πόσα χιλιοστόλιτρα (mL) ισοδυναμούν με 1 κυβικό εκατοστόμετρο (1 cm³);' : 'How many milliliters (mL) equal 1 cubic centimeter (1 cm³)?', correct: '1 mL', distractors: ['10 mL', '100 mL', isEl ? '0,1 mL' : '0.1 mL'], expl: '1 cm³ ＝ 1 mL.' }),
  (isEl) => ({ prompt: isEl ? 'Αν διπλασιάσουμε όλες τις διαστάσεις ενός στερεού, πόσες φορές μεγαλύτερος γίνεται ο όγκος του;' : 'If we double all linear dimensions of a solid, how many times larger does its volume become?', correct: isEl ? '8 φορές μεγαλύτερος (2 · 2 · 2)' : '8 times larger (2 · 2 · 2)', distractors: isEl ? ['2 φορές', '4 φορές', '6 φορές'] : ['2 times', '4 times', '6 times'], expl: '2 · 2 · 2 ＝ 8.' }),
  (isEl) => ({ prompt: isEl ? 'Πισίνα περιέχει 50.000 L νερό. Αν αδειάσουν 20.000 L, πόσα m³ νερού απομένουν;' : 'A pool holds 50,000 L. If 20,000 L are drained, how many m³ remain?', correct: '30 m³', distractors: ['300 m³', '3 m³', isEl ? '30.000 m³' : '30,000 m³'], expl: '30.000 : 1.000 ＝ 30 m³.' }),
  (isEl) => ({ prompt: isEl ? 'Πόσα μπουκάλια των 500 mL γεμίζουν από ένα δοχείο 10 L (10 dm³);' : 'How many 500 mL bottles can be filled from a 10 L container?', correct: isEl ? '20 μπουκάλια' : '20 bottles', distractors: isEl ? ['10 μπουκάλια', '50 μπουκάλια', '5 μπουκάλια'] : ['10 bottles', '50 bottles', '5 bottles'], expl: '10.000 : 500 ＝ 20.' }),
  (isEl) => ({ prompt: isEl ? 'Πόσα cm³ είναι τα 8 dm³;' : 'How many cm³ are 8 dm³?', correct: isEl ? '8.000 cm³' : '8,000 cm²', distractors: [isEl ? '800 cm³' : '800 cm³', isEl ? '80 cm³' : '80 cm³', isEl ? '80.000 cm³' : '80,000 cm³'], expl: '8 · 1.000 ＝ 8.000 cm³.' })
];

// --- ΚΕΦΑΛΑΙΟ 81: ΟΓΚΟΣ ΚΥΒΟΥ & ΟΡΘΟΓΩΝΙΟΥ ΠΑΡΑΛΛΗΛΕΠΙΠΕΔΟΥ ---
const POOL_Q29 = [
  (isEl) => ({ prompt: isEl ? 'Ποιος είναι ο τύπος για τον όγκο του κύβου με ακμή α;' : 'What is the formula for the volume of a cube with edge a?', correct: isEl ? 'V ＝ α · α · α ＝ α³' : 'V ＝ a · a · a ＝ a³', distractors: isEl ? ['V ＝ 3 · α', 'V ＝ 6 · α²', 'V ＝ α · α'] : ['V ＝ 3 · a', 'V ＝ 6 · a²', 'V ＝ a · a'], expl: 'V ＝ a³.' }),
  (isEl) => ({ prompt: isEl ? 'Ποιος είναι ο τύπος για τον όγκο του ορθογωνίου παραλληλεπιπέδου;' : 'What is the formula for the volume of a rectangular prism?', correct: isEl ? 'V ＝ α · β · γ (Μήκος · Πλάτος · Ύψος)' : 'V ＝ a · b · c (Length · Width · Height)', distractors: isEl ? ['V ＝ α ＋ β ＋ γ', 'V ＝ 2 · (αβ ＋ βγ ＋ αγ)', 'V ＝ (α · β) : γ'] : ['V ＝ a ＋ b ＋ c', 'V ＝ 2 · (ab ＋ bc ＋ ac)', 'V ＝ (a · b) : c'], expl: 'V ＝ a · b · c.' }),
  (isEl) => ({ prompt: isEl ? 'Ένας κύβος έχει ακμή 4 cm. Πόσο είναι το μέγεθος του όγκου του;' : 'A cube has edge 4 cm. What is its volume?', correct: '64 cm³', distractors: ['16 cm³', '12 cm³', '96 cm³'], expl: '4 · 4 · 4 ＝ 64 cm³.' }),
  (isEl) => ({ prompt: isEl ? 'Ποιος είναι ο όγκος ενός κύβου με ακμή 5 cm;' : 'What is the volume of a cube with edge 5 cm?', correct: '125 cm³', distractors: ['25 cm³', '15 cm³', '150 cm³'], expl: '5 · 5 · 5 ＝ 125 cm³.' }),
  (isEl) => ({ prompt: isEl ? 'Ένα κουτί έχει μήκος 5 cm, πλάτος 4 cm και ύψος 3 cm. Ποιος είναι ο όγκος του;' : 'A box has length 5 cm, width 4 cm, and height 3 cm. What is its volume?', correct: '60 cm³', distractors: ['12 cm³', '20 cm³', '94 cm³'], expl: '5 · 4 · 3 ＝ 60 cm³.' }),
  (isEl) => ({ prompt: isEl ? 'Κιβώτιο έχει διαστάσεις 10 cm, 6 cm και 5 cm. Πόσο είναι το μέγεθος του όγκου του σε cm³;' : 'A crate has dimensions 10 cm, 6 cm, and 5 cm. What is its volume in cm³?', correct: '300 cm³', distractors: ['21 cm³', '60 cm³', '280 cm³'], expl: '10 · 6 · 5 ＝ 300 cm³.' }),
  (isEl) => ({ prompt: isEl ? 'Ποια σχέση συνδέει τον όγκο παραλληλεπιπέδου με το εμβαδόν της βάσης του (Εβ);' : 'Which formula links rectangular prism volume to base area (Abase)?', correct: isEl ? 'V ＝ Εμβαδόν Βάσης · Ύψος (V ＝ Εβ · γ)' : 'V ＝ Base Area · Height (V ＝ Abase · c)', distractors: isEl ? ['V ＝ Εβ : γ', 'V ＝ (Εβ · γ) : 2', 'V ＝ Εβ ＋ γ'] : ['V ＝ Abase : c', 'V ＝ (Abase · c) : 2', 'V ＝ Abase ＋ c'], expl: isEl ? 'V ＝ Εβ · γ.' : 'V ＝ Abase · c.' }),
  (isEl) => ({ prompt: isEl ? 'Ένα παραλληλεπίπεδο έχει όγκο 240 cm³ και ύψος 8 cm. Πόσο είναι το εμβαδόν της βάσης του;' : 'A rectangular prism has volume 240 cm³ and height 8 cm. What is its base area?', correct: '30 cm²', distractors: ['20 cm²', '40 cm²', '15 cm²'], expl: '240 : 8 ＝ 30 cm².' })
];

const POOL_Q30 = [
  (isEl) => ({ prompt: isEl ? 'Ενυδρείο έχει διαστάσεις 80 cm, 40 cm και 50 cm (8 dm, 4 dm, 5 dm). Πόσα λίτρα νερού χωράει;' : 'An aquarium has dimensions 80 cm, 40 cm, and 50 cm (8 dm, 4 dm, 5 dm). How many liters of water does it hold?', correct: '160 L', distractors: ['16 L', isEl ? '1.600 L' : '1,600 L', '320 L'], expl: '8 · 4 · 5 ＝ 160 dm³ ＝ 160 L.' }),
  (isEl) => ({ prompt: isEl ? 'Αποθήκη έχει όγκο 180 m³ και εμβαδόν δαπέδου 60 m². Πόσο είναι το ύψος της;' : 'A storage room has volume 180 m³ and floor area 60 m². What is its height?', correct: '3 m', distractors: ['2 m', '4 m', '6 m'], expl: '180 : 60 ＝ 3 m.' }),
  (isEl) => ({ prompt: isEl ? 'Κύβος έχει όγκο 27 cm³. Πόσο είναι το μήκος της ακμής του;' : 'A cube has volume 27 cm³. What is its edge length?', correct: '3 cm', distractors: ['9 cm', '2 cm', '4 cm'], expl: '3 · 3 · 3 ＝ 27.' }),
  (isEl) => ({ prompt: isEl ? 'Πόσα κυβάκια ακμής 1 cm χωράνε μέσα σε κουτί διαστάσεων 6 cm, 4 cm και 3 cm;' : 'How many 1 cm unit cubes fit inside a 6 cm × 4 cm × 3 cm box?', correct: isEl ? '72 κυβάκια' : '72 unit cubes', distractors: isEl ? ['36 κυβάκια', '24 κυβάκια', '144 κυβάκια'] : ['36 cubes', '24 cubes', '144 cubes'], expl: '6 · 4 · 3 ＝ 72.' }),
  (isEl) => ({ prompt: isEl ? 'Αν τριπλασιάσουμε το μήκος της ακμής ενός κύβου, πόσες φορές μεγαλύτερος γίνεται ο όγκος του;' : 'If we triple the edge length of a cube, how many times larger does its volume become?', correct: isEl ? '27 φορές μεγαλύτερος (3 · 3 · 3)' : '27 times larger (3 · 3 · 3)', distractors: isEl ? ['3 φορές', '9 φορές', '6 φορές'] : ['3 times', '9 times', '6 times'], expl: '3 · 3 · 3 ＝ 27.' }),
  (isEl) => ({ prompt: isEl ? 'Δοχείο διαστάσεων 50 cm, 20 cm και 40 cm (40 L) είναι γεμάτο μέχρι τη μέση. Πόσα λίτρα νερού περιέχει;' : 'A 50 cm × 20 cm × 40 cm container (40 L) is half full. How many liters does it contain?', correct: '20 L', distractors: ['40 L', '10 L', '30 L'], expl: '40 : 2 ＝ 20 L.' }),
  (isEl) => ({ prompt: isEl ? 'Πόσα κυβάκια του 1 cm³ χωράνε σε έναν κύβο με ακμή 10 cm;' : 'How many 1 cm³ unit cubes fit in a cube of edge 10 cm?', correct: isEl ? '1.000 κυβάκια' : '1,000 unit cubes', distractors: isEl ? ['100 κυβάκια', '10 κυβάκια', '10.000 κυβάκια'] : ['100 cubes', '10 cubes', '10,000 cubes'], expl: '10 · 10 · 10 ＝ 1.000.' }),
  (isEl) => ({ prompt: isEl ? 'Τούβλο έχει διαστάσεις 25 cm, 12 cm και 6 cm. Πόσο είναι το μέγεθος του όγκου του;' : 'A brick measures 25 cm, 12 cm, and 6 cm. What is its volume?', correct: isEl ? '1.800 cm³' : '1,800 cm³', distractors: ['300 cm³', isEl ? '3.600 cm³' : '3,600 cm³', '900 cm³'], expl: '25 · 12 · 6 ＝ 1.800 cm³.' })
];

// --- ΚΕΦΑΛΑΙΟ 82: ΟΓΚΟΣ ΚΥΛΙΝΔΡΟΥ ---
const POOL_Q31 = [
  (isEl) => ({ prompt: isEl ? 'Ποιος είναι ο τύπος για τον όγκο του κυλίνδρου με ακτίνα ρ και ύψος υ;' : 'What is the formula for the volume of a cylinder with radius r and height h?', correct: isEl ? 'V ＝ π · ρ² · υ (Εμβαδόν Βάσης · Ύψος)' : 'V ＝ π · r² · h (Base Area · Height)', distractors: isEl ? ['V ＝ (2 · π · ρ) · υ', 'V ＝ π · ρ · υ', 'V ＝ 2 · π · ρ² · υ'] : ['V ＝ (2 · π · r) · h', 'V ＝ π · r · h', 'V ＝ 2 · π · r² · h'], expl: isEl ? 'V ＝ π · ρ² · υ.' : 'V ＝ π · r² · h.' }),
  (isEl) => ({ prompt: isEl ? 'Ποια σχέση συνδέει τον όγκο του κυλίνδρου με το εμβαδόν της κυκλικής βάσης του (Εβ);' : 'Which formula links cylinder volume to its circular base area (Abase)?', correct: isEl ? 'V ＝ Εμβαδόν Βάσης · Ύψος (V ＝ Εβ · υ)' : 'V ＝ Base Area · Height (V ＝ Abase · h)', distractors: isEl ? ['V ＝ Εβ : υ', 'V ＝ (Εβ · υ) : 2', 'V ＝ 2 · Εβ · υ'] : ['V ＝ Abase : h', 'V ＝ (Abase · h) : 2', 'V ＝ 2 · Abase · h'], expl: 'V ＝ Εβ · υ.' }),
  (isEl) => ({ prompt: isEl ? 'Κύλινδρος έχει ακτίνα ρ ＝ 10 cm και ύψος υ ＝ 5 cm. Πόσο είναι το μέγεθος του όγκου του; (π ＝ 3,14)' : 'A cylinder has radius r ＝ 10 cm and height h ＝ 5 cm. What is its volume? (π ＝ 3.14)', correct: isEl ? '1.570 cm³' : '1,570 cm³', distractors: ['314 cm³', isEl ? '3.140 cm³' : '3,140 cm³', '628 cm³'], expl: '3,14 · 100 · 5 ＝ 1.570 cm³.' }),
  (isEl) => ({ prompt: isEl ? 'Κυλινδρικό ποτήρι έχει ακτίνα βάσης ρ ＝ 4 cm και ύψος υ ＝ 10 cm. Πόσα cm³ νερού χωράει; (π ＝ 3,14)' : 'A drinking glass has base radius r ＝ 4 cm and height h ＝ 10 cm. How many cm³ does it hold? (π ＝ 3.14)', correct: isEl ? '502,4 cm³' : '502.4 cm³', distractors: [isEl ? '251,2 cm³' : '251.2 cm³', isEl ? '125,6 cm³' : '125.6 cm³', isEl ? '50,24 cm²' : '50.24 cm²'], expl: '3,14 · 16 · 10 ＝ 502,4 cm³.' }),
  (isEl) => ({ prompt: isEl ? 'Αν σε πρόβλημα όγκου κυλίνδρου δίνεται η διάμετρος (δ), τι κάνουμε πρώτα;' : 'If a problem gives cylinder diameter (d), what must we do first?', correct: isEl ? 'Διαιρούμε τη διάμετρο διά 2 για να βρούμε την ακτίνα: ρ ＝ δ : 2' : 'Divide diameter by 2 to find radius: r ＝ d : 2', distractors: isEl ? ['Βάζουμε τη διάμετρο κατευθείαν στον τύπο', 'Πολλαπλασιάζουμε τη διάμετρο με το 2', 'Προσθέτουμε τη διάμετρο στο ύψος'] : ['Plug diameter directly into formula', 'Multiply diameter by 2', 'Add diameter to height'], expl: isEl ? 'Ο τύπος απαιτεί την ακτίνα: ρ ＝ δ : 2.' : 'The formula requires radius: r ＝ d : 2.' }),
  (isEl) => ({ prompt: isEl ? 'Κυλινδρικό βαρέλι έχει διάμετρο 20 cm (ακτίνα 10 cm) και ύψος 30 cm. Πόσο είναι το μέγεθος του όγκου του; (π ＝ 3,14)' : 'A cylinder barrel has diameter 20 cm (radius 10 cm) and height 30 cm. What is its volume? (π ＝ 3.14)', correct: isEl ? '9.420 cm³' : '9,420 cm³', distractors: [isEl ? '37.680 cm³' : '37,680 cm³', isEl ? '4.710 cm³' : '4,710 cm³', isEl ? '1.884 cm³' : '1,884 cm³'], expl: '3,14 · 100 · 30 ＝ 9.420 cm³.' }),
  (isEl) => ({ prompt: isEl ? 'Ποια είναι η διαφορά ανάμεσα στην παράπλευρη επιφάνεια και στον όγκο του κυλίνδρου;' : 'What is the difference between cylinder lateral surface area and volume?', correct: isEl ? 'Η παράπλευρη είναι επιφάνεια [(2 · π · ρ) · υ σε cm²], ενώ ο όγκος είναι χώρος [(π · ρ²) · υ σε cm³]' : 'Lateral is area [(2 · π · r) · h in cm²], while volume is space [(π · r²) · h in cm³]', distractors: isEl ? ['Είναι το ίδιο πράγμα', 'Η παράπλευρη είναι σε cm³ και ο όγκος σε cm²', 'Ο όγκος είναι (2 · π · ρ) · υ'] : ['They are identical', 'Lateral in cm³ and volume in cm²', 'Volume is (2 · π · r) · h'], expl: isEl ? 'Επ σε cm², V σε cm³.' : 'Alat in cm², V in cm³.' }),
  (isEl) => ({ prompt: isEl ? 'Κύλινδρος έχει ακτίνα 2 cm και ύψος 10 cm. Πόσος είναι ο όγκος του; (π ＝ 3,14)' : 'A cylinder has radius 2 cm and height 10 cm. What is its volume? (π ＝ 3.14)', correct: isEl ? '125,6 cm³' : '125.6 cm³', distractors: [isEl ? '62,8 cm³' : '62.8 cm³', isEl ? '251,2 cm³' : '251.2 cm³', isEl ? '25,12 cm³' : '25.12 cm³'], expl: '3,14 · 4 · 10 ＝ 125,6 cm³.' })
];

const POOL_Q32 = [
  (isEl) => ({ prompt: isEl ? 'Boiler θερμοσίφωνα έχει ακτίνα ρ ＝ 2,5 dm και μήκος 10 dm. Πόσα λίτρα (L) νερού χωράει; (π ＝ 3,14)' : 'A water heater cylinder has radius r ＝ 2.5 dm and length 10 dm. How many liters (L) does it hold? (π ＝ 3.14)', correct: isEl ? '196,25 L' : '196.25 L', distractors: [isEl ? '19,625 L' : '19.625 L', isEl ? '1.962,5 L' : '1,962.5 L', isEl ? '392,5 L' : '392.5 L'], expl: '3,14 · 6,25 · 10 ＝ 196,25 dm³ ＝ 196,25 L.' }),
  (isEl) => ({ prompt: isEl ? 'Κυλινδρική δεξαμενή έχει ακτίνα 1 m και ύψος 1 m (όγκος 3,14 m³). Πόσα λίτρα νερού περιέχει; (π ＝ 3,14)' : 'A cylindrical tank has radius 1 m and height 1 m (volume 3.14 m³). How many liters of water does it hold? (π ＝ 3.14)', correct: isEl ? '3.140 L' : '3,140 L', distractors: [isEl ? '314 L' : '314 L', isEl ? '31.400 L' : '31,400 L', isEl ? '3,14 L' : '3.14 L'], expl: '3,14 · 1.000 ＝ 3.140 L.' }),
  (isEl) => ({ prompt: isEl ? 'Κυλινδρική κανάτα έχει ακτίνα 5 cm και ύψος 20 cm (1.570 cm³). Πόσα λίτρα χυμού χωράει; (π ＝ 3,14)' : 'A pitcher has radius 5 cm and height 20 cm (1,570 cm³). How many liters of juice does it hold? (π ＝ 3.14)', correct: isEl ? '1,57 L' : '1.57 L', distractors: [isEl ? '15,7 L' : '15.7 L', isEl ? '0,157 L' : '0.157 L', isEl ? '3,14 L' : '3.14 L'], expl: '1.570 : 1.000 ＝ 1,57 L.' }),
  (isEl) => ({ prompt: isEl ? 'Κυλινδρικό δοχείο έχει όγκο 2.512 cm³ και ακτίνα βάσης 10 cm (Εβ = 314 cm²). Πόσο είναι το ύψος του;' : 'A cylinder has volume 2,512 cm³ and base radius 10 cm (Abase = 314 cm²). What is its height?', correct: '8 cm', distractors: ['10 cm', '6 cm', '12 cm'], expl: '2.512 : 314 ＝ 8 cm.' }),
  (isEl) => ({ prompt: isEl ? 'Αν διπλασιάσουμε μόνο το ύψος ενός κυλίνδρου, πώς αλλάζει ο όγκος του;' : 'If we double only the height of a cylinder, how does its volume change?', correct: isEl ? 'Διπλασιάζεται' : 'Doubles', distractors: isEl ? ['Τετραπλασιάζεται', 'Παραμένει ίδιος', 'Οκταπλασιάζεται'] : ['Quadruples', 'Remains same', 'Octuples'], expl: isEl ? 'Ο όγκος είναι ανάλογος του ύψους.' : 'Volume is proportional to height.' }),
  (isEl) => ({ prompt: isEl ? 'Αν διπλασιάσουμε την ακτίνα της βάσης ενός κυλίνδρου (από ρ σε 2ρ), πόσες φορές μεγαλύτερος γίνεται ο όγκος;' : 'If we double cylinder base radius (from r to 2r), how many times does volume increase?', correct: isEl ? '4 φορές μεγαλύτερος (τετραπλασιάζεται)' : '4 times larger (quadruples)', distractors: isEl ? ['2 φορές μεγαλύτερος', '8 φορές μεγαλύτερος', 'Παραμένει ίδιος'] : ['2 times larger', '8 times larger', 'Remains same'], expl: '2 · 2 ＝ 4.' }),
  (isEl) => ({ prompt: isEl ? 'Βαρέλι έχει ακτίνα βάσης 2 dm και ύψος 5 dm. Πόσα λίτρα κρασί περιέχει όταν γεμίσει; (π ＝ 3,14)' : 'A barrel has base radius 2 dm and height 5 dm. How many liters of wine does it hold when full? (π ＝ 3.14)', correct: isEl ? '62,8 L' : '62.8 L', distractors: ['628 L', isEl ? '6,28 L' : '6.28 L', isEl ? '125,6 L' : '125.6 L'], expl: '3,14 · 4 · 5 ＝ 62,8 L.' }),
  (isEl) => ({ prompt: isEl ? 'Δεξαμενή χωρητικότητας 6.000 L γεμίζει με ρυθμό 100 L το λεπτό. Σε πόση ώρα θα γεμίσει πλήρως;' : 'A 6,000 L tank is filled at a rate of 100 L per minute. In how much time will it be completely full?', correct: isEl ? '60 λεπτά (1 ώρα)' : '60 minutes (1 hour)', distractors: isEl ? ['30 λεπτά', '120 λεπτά (2 ώρες)', '10 λεπτά'] : ['30 minutes', '120 minutes (2 hours)', '10 minutes'], expl: '6.000 : 100 ＝ 60 min.' })
];

// Πίνακας με όλες τις 32 δεξαμενές ερωτήσεων
const ALL_QUESTION_POOLS = [
  { id: 1, ch: 'Κεφ. 67', chEn: 'Ch. 67', title: 'ΜΕΤΡΗΣΗ & ΕΙΔΗ ΓΩΝΙΩΝ', titleEn: 'ANGLE MEASUREMENT & TYPES', pool: POOL_Q1 },
  { id: 2, ch: 'Κεφ. 67', chEn: 'Ch. 67', title: 'ΙΔΙΟΤΗΤΕΣ ΓΩΝΙΩΝ', titleEn: 'ANGLE PROPERTIES', pool: POOL_Q2 },
  { id: 3, ch: 'Κεφ. 68', chEn: 'Ch. 68', title: 'ΤΑΞΙΝΟΜΗΣΗ ΤΡΙΓΩΝΩΝ', titleEn: 'TRIANGLE CLASSIFICATION', pool: POOL_Q3 },
  { id: 4, ch: 'Κεφ. 68', chEn: 'Ch. 68', title: 'ΙΣΟΠΛΕΥΡΑ & ΙΣΟΣΚΕΛΗ', titleEn: 'EQUILATERAL & ISOSCELES', pool: POOL_Q4 },
  { id: 5, ch: 'Κεφ. 69', chEn: 'Ch. 69', title: 'ΑΘΡΟΙΣΜΑ ΓΩΝΙΩΝ ΤΡΙΓΩΝΟΥ', titleEn: 'TRIANGLE ANGLE SUM', pool: POOL_Q5 },
  { id: 6, ch: 'Κεφ. 69', chEn: 'Ch. 69', title: 'ΑΘΡΟΙΣΜΑ ΓΩΝΙΩΝ ΤΕΤΡΑΠΛΕΥΡΟΥ', titleEn: 'QUADRILATERAL ANGLE SUM', pool: POOL_Q6 },
  { id: 7, ch: 'Κεφ. 70', title: 'ΜΕΓΕΘΥΝΣΗ & ΚΛΙΜΑΚΑ', titleEn: 'SCALING & MAP SCALE', pool: POOL_Q7 },
  { id: 8, ch: 'Κεφ. 70', title: 'ΥΠΟΛΟΓΙΣΜΟΙ ΧΑΡΤΗ & ΚΑΤΟΨΗΣ', titleEn: 'MAP & FLOOR PLAN CALCULATIONS', pool: POOL_Q8 },
  { id: 9, ch: 'Κεφ. 71', title: 'ΑΞΟΝΙΚΗ ΣΥΜΜΕΤΡΙΑ & ΑΠΟΣΤΑΣΕΙΣ', titleEn: 'LINE SYMMETRY & DISTANCES', pool: POOL_Q9 },
  { id: 10, ch: 'Κεφ. 71', title: 'ΑΞΟΝΕΣ ΣΥΜΜΕΤΡΙΑΣ ΣΧΗΜΑΤΩΝ', titleEn: 'SHAPE AXES OF SYMMETRY', pool: POOL_Q10 },
  { id: 11, ch: 'Κεφ. 72', title: 'ΜΟΝΑΔΕΣ ΕΠΙΦΑΝΕΙΑΣ & ΒΗΜΑ 100', titleEn: 'AREA UNITS & SCALE STEP 100', pool: POOL_Q11 },
  { id: 12, ch: 'Κεφ. 72', title: 'ΜΕΤΑΤΡΟΠΕΣ M² & ΣΤΡΕΜΜΑΤΑ', titleEn: 'M² & STREMMATA CONVERSIONS', pool: POOL_Q12 },
  { id: 13, ch: 'Κεφ. 73', title: 'ΤΥΠΟΣ ΕΜΒΑΔΟΥ ΠΑΡΑΛΛΗΛΟΓΡΑΜΜΟΥ', titleEn: 'PARALLELOGRAM AREA FORMULA', pool: POOL_Q13 },
  { id: 14, ch: 'Κεφ. 73', title: 'ΥΨΗ & ΕΜΒΑΔΟΝ ΠΑΡΑΛΛΗΛΟΓΡΑΜΜΟΥ', titleEn: 'PARALLELOGRAM HEIGHTS & AREA', pool: POOL_Q14 },
  { id: 15, ch: 'Κεφ. 74', title: 'ΕΜΒΑΔΟΝ ΤΡΙΓΩΝΟΥ', titleEn: 'TRIANGLE AREA', pool: POOL_Q15 },
  { id: 16, ch: 'Κεφ. 74', title: 'ΟΡΘΟΓΩΝΙΑ ΤΡΙΓΩΝΑ & ΥΨΟΣ', titleEn: 'RIGHT TRIANGLES & ALTITUDE', pool: POOL_Q16 },
  { id: 17, ch: 'Κεφ. 75', title: 'ΤΥΠΟΣ ΕΜΒΑΔΟΥ ΤΡΑΠΕΖΙΟΥ', titleEn: 'TRAPEZOID AREA FORMULA', pool: POOL_Q17 },
  { id: 18, ch: 'Κεφ. 75', title: 'ΥΠΟΛΟΓΙΣΜΟΙ ΤΡΑΠΕΖΙΟΥ & ΟΙΚΟΠΕΔΑ', titleEn: 'TRAPEZOID COMPUTATIONS & PLOTS', pool: POOL_Q18 },
  { id: 19, ch: 'Κεφ. 76', title: 'ΤΥΠΟΣ ΕΜΒΑΔΟΥ ΚΥΚΛΟΥ', titleEn: 'CIRCLE AREA FORMULA', pool: POOL_Q19 },
  { id: 20, ch: 'Κεφ. 76', title: 'ΗΜΙΚΥΚΛΙΑ & ΔΑΚΤΥΛΙΟΙ', titleEn: 'SEMICIRCLES & ANNULI', pool: POOL_Q20 },
  { id: 21, ch: 'Κεφ. 77', title: 'ΕΔΡΕΣ & ΑΝΑΠΤΥΓΜΑΤΑ ΚΥΒΟΥ', titleEn: 'CUBE FACES & NETS', pool: POOL_Q21 },
  { id: 22, ch: 'Κεφ. 77', title: 'ΟΛΙΚΗ ΕΠΙΦΑΝΕΙΑ ΣΤΕΡΕΩΝ', titleEn: 'TOTAL SURFACE AREA OF SOLIDS', pool: POOL_Q22 },
  { id: 23, ch: 'Κεφ. 78', title: '12 ΑΚΜΕΣ & 8 ΚΟΡΥΦΕΣ', titleEn: '12 EDGES & 8 VERTICES', pool: POOL_Q23 },
  { id: 24, ch: 'Κεφ. 78', title: 'ΣΚΕΛΕΤΟΙ & ΤΥΠΟΣ EULER', titleEn: 'SKELETONS & EULER FORMULA', pool: POOL_Q24 },
  { id: 25, ch: 'Κεφ. 79', title: 'ΑΝΑΠΤΥΓΜΑ & ΠΑΡΑΠΛΕΥΡΗ ΚΥΛΙΝΔΡΟΥ', titleEn: 'CYLINDER NET & LATERAL AREA', pool: POOL_Q25 },
  { id: 26, ch: 'Κεφ. 79', title: 'ΟΛΙΚΟ ΕΜΒΑΔΟΝ ΚΥΛΙΝΔΡΟΥ', titleEn: 'TOTAL CYLINDER AREA', pool: POOL_Q26 },
  { id: 27, ch: 'Κεφ. 80', title: 'ΕΝΝΟΙΑ ΟΓΚΟΥ & 1 DM³ ＝ 1 L', titleEn: 'CONCEPT OF VOLUME & 1 DM³ ＝ 1 L', pool: POOL_Q27 },
  { id: 28, ch: 'Κεφ. 80', title: 'ΧΩΡΗΤΙΚΟΤΗΤΑ & ΚΥΒΙΚΑ ΜΕΤΡΑ', titleEn: 'CAPACITY & CUBIC METERS', pool: POOL_Q28 },
  { id: 29, ch: 'Κεφ. 81', title: 'ΟΓΚΟΣ ΚΥΒΟΥ (V ＝ Α³)', titleEn: 'CUBE VOLUME (V ＝ A³)', pool: POOL_Q29 },
  { id: 30, ch: 'Κεφ. 81', title: 'ΟΓΚΟΣ ΠΑΡΑΛΛΗΛΕΠΙΠΕΔΟΥ (Α · Β · Γ)', titleEn: 'PRISM VOLUME (A · B · C)', pool: POOL_Q30 },
  { id: 31, ch: 'Κεφ. 82', title: 'ΤΥΠΟΣ ΟΓΚΟΥ ΚΥΛΙΝΔΡΟΥ', titleEn: 'CYLINDER VOLUME FORMULA', pool: POOL_Q31 },
  { id: 32, ch: 'Κεφ. 82', title: 'ΧΩΡΗΤΙΚΟΤΗΤΑ ΚΥΛΙΝΔΡΟΥ ΣΕ ΛΙΤΡΑ', titleEn: 'CYLINDER CAPACITY IN LITERS', pool: POOL_Q32 }
];

// Δημιουργία των 32 ερωτήσεων του διαγωνίσματος
function generateExamQuestions(locale = 'el') {
  const isEl = locale === 'el';
  return ALL_QUESTION_POOLS.map((slot, index) => {
    const generator = slot.pool[randInt(0, slot.pool.length - 1)];
    const data = generator(isEl);
    const options = ensureFourUniqueOptions(data.correct, () => data.distractors);

    return {
      id: index + 1,
      ch: isEl ? slot.ch : slot.chEn,
      title: isEl ? slot.title : slot.titleEn,
      prompt: data.prompt,
      options,
      correctAnswer: data.correct,
      explanation: data.expl,
      tableData: [
        { label: isEl ? 'Ενότητα' : 'Chapter', value: isEl ? slot.ch : slot.chEn },
        { label: isEl ? 'Σωστή Απάντηση' : 'Correct Answer', value: data.correct }
      ]
    };
  });
}

// -------------------------------------------------------------
// ΚΥΡΙΟ COMPONENT ΔΙΑΓΩΝΙΣΜΑΤΟΣ (32 ΕΡΩΤΗΣΕΙΣ)
// -------------------------------------------------------------

export default function Epanalipsi5Page() {
  const router = useRouter();
  const locale = router?.locale || 'el';
  const isEl = locale === 'el';

  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadNewSet();
  }, [locale]);

  function loadNewSet() {
    const newQs = generateExamQuestions(locale);
    setQuestions(newQs);
    setUserAnswers({});
    setSubmitted(false);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handleAnswerChange(id, val) {
    if (submitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [id]: val
    }));
  }

  function isQuestionCorrect(q) {
    const userAns = userAnswers[q.id];
    if (userAns === undefined || userAns === null) return false;
    return String(userAns).trim() === String(q.correctAnswer).trim();
  }

  const answeredCount = Object.keys(userAnswers).filter(
    (k) => userAnswers[k] !== undefined && userAnswers[k] !== ''
  ).length;

  const score = questions.reduce((acc, q) => (isQuestionCorrect(q) ? acc + 1 : acc), 0);
  const totalCount = questions.length || 32;
  const percentage = Math.round((score / totalCount) * 100);

  // Στατικά μεταφραστικά strings UI
  const ui = {
    metaTitle: isEl
      ? "Επαναληπτικό Διαγώνισμα (Ενότητες 67-82) - ΣΤ' Δημοτικού | LearnMaths.gr"
      : "Review Exam (Units 67-82) - 6th Grade | LearnMaths.gr",
    metaDesc: isEl
      ? "Μεγάλο επαναληπτικό διαγώνισμα 32 ερωτήσεων στα Μαθηματικά ΣΤ' Δημοτικού για τις ενότητες 67 έως 82: γωνίες, τρίγωνα, συμμετρία, εμβαδά, αναπτύγματα και όγκος."
      : "Comprehensive 32-question review exam for 6th Grade Math covering units 67 to 82: angles, triangles, symmetry, areas, nets, and volume.",
    backText: isEl ? "ΣΤ' Δημοτικού" : "6th Grade",
    chapterBadge: isEl
      ? "ΕΠΑΝΑΛΗΨΗ 5 • ΕΝΟΤΗΤΕΣ 67 - 82 • ΣΤ' ΔΗΜΟΤΙΚΟΥ"
      : "REVIEW 5 • CHAPTERS 67 - 82 • 6TH GRADE",
    heroTitle: isEl
      ? "Μεγάλο Επαναληπτικό Διαγώνισμα: Ενότητες 67 έως 82"
      : "Major Review Exam: Chapters 67 to 82",
    heroDesc: isEl
      ? "Ολοκληρωμένο διαγώνισμα 32 δυναμικών ερωτήσεων (2 ερωτήσεις ανά ενότητα) σε όλη τη γεωμετρία και στερεομετρία της ΣΤ' Δημοτικού: γωνίες, τρίγωνα, αθροίσματα, κλίμακα, συμμετρία, εμβαδά παραλληλογράμμου, τριγώνου, τραπεζίου και κύκλου, αναπτύγματα, ακμές, κορυφές και όγκοι με λίτρα."
      : "Comprehensive 32-question exam (2 questions per chapter) covering geometry and solid geometry for 6th Grade: angles, triangles, angle sums, scale, symmetry, areas of parallelograms, triangles, trapezoids, circles, nets, edges, vertices, and volumes with liters.",
    heroFeature: isEl
      ? "32 Δυναμικές Ερωτήσεις από Μεγάλη Δεξαμενή Ασκήσεων με Αυτόματη Αξιολόγηση"
      : "32 Dynamic Questions from a Large Problem Pool with Automated Grading",
    btnNewSet: isEl ? "Νέο Διαγώνισμα" : "New Exam",
    btnSubmit: isEl ? "Έλεγχος Απαντήσεων" : "Check Answers",
    lblCorrectBadge: isEl ? "ΣΩΣΤΟ" : "CORRECT",
    lblWrongBadge: isEl ? "ΛΑΘΟΣ" : "INCORRECT",
    answered: isEl ? "ΑΠΑΝΤΗΘΗΚΑΝ:" : "ANSWERED:",
    score: isEl ? "ΣΚΟΡ:" : "SCORE:",
    percentage: isEl ? "ΠΟΣΟΣΤΟ:" : "PERCENTAGE:",
    feedbackCorrect: isEl ? "Σωστή απάντηση!" : "Correct answer!",
    feedbackWrongPrefix: isEl ? "Η σωστή απάντηση είναι: " : "The correct answer is: "
  };

  return (
    <Layout
      title={ui.metaTitle}
      description={ui.metaDesc}
      backUrl="/st-dimotikou"
      backText={ui.backText}
      showAds={true}
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden box-border">

        {/* HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden mb-8 sm:mb-12">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span className="break-words [overflow-wrap:anywhere]">{ui.chapterBadge}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight break-words [overflow-wrap:anywhere]">
              {toCleanUppercase(ui.heroTitle)}
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl break-words [overflow-wrap:anywhere]">
              {ui.heroDesc}
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
              <span className="break-words [overflow-wrap:anywhere]">{ui.heroFeature}</span>
            </div>
            <button
              onClick={loadNewSet}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base shrink-0"
            >
              <span>🔄 {toCleanUppercase(ui.btnNewSet)}</span>
            </button>
          </div>
        </section>

        {/* ΛΙΣΤΑ 32 ΕΡΩΤΗΣΕΩΝ */}
        <div className="space-y-6 sm:space-y-8">
          {questions.map((q, index) => {
            const isCorrect = isQuestionCorrect(q);
            const userAns = userAnswers[q.id];

            return (
              <div
                key={q.id}
                className={`bg-white rounded-3xl p-4 sm:p-8 shadow-sm border transition-all ${
                  submitted
                    ? isCorrect
                      ? 'border-emerald-300 ring-1 ring-emerald-200'
                      : 'border-rose-300 ring-1 ring-rose-200'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* ΚΕΦΑΛΙΔΑ ΕΡΩΤΗΣΗΣ */}
                <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-sm sm:text-base border border-indigo-150 shrink-0">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-indigo-600 block uppercase tracking-wider truncate">
                        {q.ch}
                      </span>
                      <h2 className="text-xs sm:text-sm font-black text-slate-800 tracking-wider break-words [overflow-wrap:anywhere] min-w-0">
                        {toCleanUppercase(q.title)}
                      </h2>
                    </div>
                  </div>

                  {submitted && (
                    <span
                      className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-black tracking-wider shrink-0 ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isCorrect ? toCleanUppercase(ui.lblCorrectBadge) : toCleanUppercase(ui.lblWrongBadge)}
                    </span>
                  )}
                </div>

                {/* ΕΚΦΩΝΗΣΗ (NO-GIVEAWAY) */}
                <div className="mb-6">
                  <p className="text-slate-800 text-sm sm:text-base font-semibold leading-relaxed break-words [overflow-wrap:anywhere]">
                    {q.prompt}
                  </p>
                </div>

                {/* ΕΠΙΛΟΓΕΣ MCQ (4 ΜΟΝΑΔΙΚΑ ΚΟΥΜΠΙΑ ΧΩΡΙΣ TRUNCATE) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 w-full">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userAns === opt;
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={submitted}
                        onClick={() => handleAnswerChange(q.id, opt)}
                        className={`text-left p-3.5 sm:p-4 rounded-2xl border font-semibold text-xs sm:text-sm transition-all flex items-start gap-3 w-full ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                            isSelected
                              ? 'bg-white text-indigo-700'
                              : 'bg-white text-slate-500 border border-slate-200'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="break-words [overflow-wrap:anywhere] whitespace-normal leading-snug flex-1 min-w-0">
                          {opt}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* FEEDBACK & EXPLANATION (ΑΠΟΚΛΕΙΣΤΙΚΑ ΜΕΤΑ ΤΗΝ ΥΠΟΒΟΛΗ) */}
                {submitted && (
                  <div className="mt-6 pt-5 border-t border-slate-150 space-y-4">
                    {/* ΠΙΝΑΚΑΣ ΔΕΔΟΜΕΝΩΝ (TABLEDATA) ΜΟΝΟ ΣΤΟ FEEDBACK */}
                    {q.tableData && q.tableData.length > 0 && (
                      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50/60 p-1 w-full max-w-full">
                        <table className="w-full text-left text-xs sm:text-sm">
                          <tbody>
                            {q.tableData.map((row, rIdx) => (
                              <tr
                                key={rIdx}
                                className={rIdx !== q.tableData.length - 1 ? 'border-b border-slate-200/60' : ''}
                              >
                                <td className="py-2.5 px-3 font-bold text-slate-600 bg-slate-100/70 w-1/3 break-words [overflow-wrap:anywhere]">
                                  {row.label}
                                </td>
                                <td className="py-2.5 px-3 font-semibold text-slate-800 break-words [overflow-wrap:anywhere]">
                                  {row.value}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isCorrect
                          ? 'bg-emerald-50 text-emerald-950 border border-emerald-200'
                          : 'bg-rose-50 text-rose-950 border border-rose-200'
                      }`}
                    >
                      <p className="font-bold mb-1 break-words [overflow-wrap:anywhere]">
                        {isCorrect
                          ? ui.feedbackCorrect
                          : `${ui.feedbackWrongPrefix}${q.correctAnswer}`}
                      </p>
                      <p className="text-slate-700 break-words [overflow-wrap:anywhere]">{q.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* STICKY BOTTOM SCORE FOOTER (32 ΕΡΩΤΗΣΕΙΣ) */}
        <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl py-3 px-3 sm:px-6">
          <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-8 min-w-0">
              {!submitted ? (
                <div className="text-xs sm:text-sm font-semibold text-slate-300 truncate">
                  <span>{toCleanUppercase(ui.answered)} </span>
                  <span className="font-black text-indigo-400 text-sm sm:text-base">
                    {answeredCount} / {totalCount}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-3 sm:gap-6">
                  <div className="text-xs sm:text-sm font-semibold text-slate-300 whitespace-nowrap">
                    <span>{toCleanUppercase(ui.score)} </span>
                    <span className="font-black text-emerald-400 text-sm sm:text-base">
                      {score} / {totalCount}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-300 whitespace-nowrap">
                    <span>{toCleanUppercase(ui.percentage)} </span>
                    <span className="font-black text-amber-400 text-sm sm:text-base">
                      {percentage}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {!submitted ? (
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(true);
                    if (typeof window !== 'undefined') {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="px-4 py-2.5 sm:px-6 sm:py-3 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-black rounded-xl shadow-lg shadow-emerald-500/25 transition-all text-xs sm:text-sm whitespace-nowrap"
                >
                  {toCleanUppercase(ui.btnSubmit)}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={loadNewSet}
                  className="px-4 py-2.5 sm:px-6 sm:py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-black rounded-xl shadow-lg shadow-indigo-600/30 transition-all text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 whitespace-nowrap"
                >
                  <span>🔄</span>
                  <span>{toCleanUppercase(ui.btnNewSet)}</span>
                </button>
              )}
            </div>
          </div>
        </footer>

      </div>
    </Layout>
  );
}