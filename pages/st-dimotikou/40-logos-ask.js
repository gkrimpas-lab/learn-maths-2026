// pages/st-dimotikou/40-logos-ask.js
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { LAYOUT } from '../../shared/layout-config';

// ---------------------------------------------------------
// ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ & DEFENSIVE CHECKS
// ---------------------------------------------------------

function randInt(min, max) {
  const low = Math.ceil(min);
  const high = Math.floor(max);
  return Math.floor(Math.random() * (high - low + 1)) + low;
}

function shuffle(array) {
  if (!Array.isArray(array)) return [];
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getGCD(a, b) {
  let x = Math.abs(Math.round(a || 0));
  let y = Math.abs(Math.round(b || 0));
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

// Αφαίρεση τόνων για κεφαλαία (εξαιρείται το ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  const cleaned = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
  return cleaned.replace(/\bΣΤ\b/g, "ΣΤ'");
}

// Μορφοποίηση δεκαδικού με κόμμα
function formatDecimal(val, decimals = 2) {
  const rounded = Number(val.toFixed(decimals));
  return String(rounded).replace('.', ',');
}

// ---------------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (Q9 & Q10) - "NO-GIVEAWAY" PEDAGOGY
// ---------------------------------------------------------

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'p_std_1',
    title: 'Αναλογία Μαθητών στην Τάξη',
    generate: () => {
      const g = randInt(2, 4);
      const boysRatio = randInt(3, 5);
      let girlsRatio = randInt(3, 5);
      while (girlsRatio === boysRatio) girlsRatio = randInt(2, 6);
      const boys = boysRatio * g;
      const girls = girlsRatio * g;
      const total = boys + girls;
      const gcdVal = getGCD(girls, total);
      const ansNum = girls / gcdVal;
      const ansDen = total / gcdVal;
      return {
        prompt: `Σε μια τάξη της ΣΤ' Δημοτικού φοιτούν ${boys} αγόρια και ${girls} κορίτσια. Ποιος είναι ο απλοποιημένος λόγος των κοριτσιών προς το σύνολο των μαθητών της τάξης;`,
        correctVal: `${ansNum}/${ansDen}`,
        altVal: `${ansNum}:${ansDen}`,
        correctText: `${ansNum} : ${ansDen}`,
        tableData: [
          { item: 'Κορίτσια', formula: `${girls}`, val: `${girls}` },
          { item: 'Σύνολο μαθητών', formula: `${boys} ＋ ${girls}`, val: `${total}` },
          { item: 'Απλοποιημένος λόγος', formula: `(${girls} : ${gcdVal}) / (${total} : ${gcdVal})`, val: `${ansNum} : ${ansDen}` }
        ],
        explain: `Το σύνολο των μαθητών είναι ${boys} ＋ ${girls} ＝ ${total}. Ο λόγος των κοριτσιών προς το σύνολο είναι ${girls} : ${total}. Διαιρούμε με τον Μ.Κ.Δ.(${girls}, ${total}) ＝ ${gcdVal}, άρα ο απλοποιημένος λόγος είναι ${ansNum} : ${ansDen} (ή ${ansNum}/${ansDen}).`,
        distractors: [`${ansDen} : ${ansNum}`, `${ansNum + 1} : ${ansDen}`, `${ansNum} : ${ansDen + 2}`]
      };
    }
  },
  {
    id: 'p_std_2',
    title: 'Διαστάσεις Ορθογώνιου Πανό',
    generate: () => {
      const width = randInt(4, 8) * 10;
      const lengthMeters = randInt(1, 3);
      const lengthCm = lengthMeters * 100;
      const gcdVal = getGCD(width, lengthCm);
      const ansNum = width / gcdVal;
      const ansDen = lengthCm / gcdVal;
      return {
        prompt: `Ένα ορθογώνιο πανό έχει πλάτος ${width} cm και μήκος ${lengthMeters} m. Ποιος είναι ο απλοποιημένος λόγος του πλάτους προς το μήκος του;`,
        correctVal: `${ansNum}/${ansDen}`,
        altVal: `${ansNum}:${ansDen}`,
        correctText: `${ansNum} : ${ansDen}`,
        tableData: [
          { item: 'Πλάτος', formula: `${width} cm`, val: `${width} cm` },
          { item: 'Μήκος (σε cm)', formula: `${lengthMeters} m · 100`, val: `${lengthCm} cm` },
          { item: 'Απλοποίηση λόγου', formula: `(${width} : ${gcdVal}) / (${lengthCm} : ${gcdVal})`, val: `${ansNum} : ${ansDen}` }
        ],
        explain: `Μετατρέπουμε το μήκος στην ίδια μονάδα: ${lengthMeters} m ＝ ${lengthCm} cm. Ο λόγος είναι ${width} : ${lengthCm}. Διαιρούμε με τον Μ.Κ.Δ.(${width}, ${lengthCm}) ＝ ${gcdVal} και προκύπτει ${ansNum} : ${ansDen}.`,
        distractors: [`${ansDen} : ${ansNum}`, `${ansNum + 1} : ${ansDen}`, `${ansNum} : ${ansDen + 1}`]
      };
    }
  },
  {
    id: 'p_std_3',
    title: 'Συνταγή Ζαχαροπλαστικής',
    generate: () => {
      const sugar = randInt(2, 5) * 50;
      const flourKg = randInt(1, 2);
      const flourG = flourKg * 1000;
      const gcdVal = getGCD(sugar, flourG);
      const ansNum = sugar / gcdVal;
      const ansDen = flourG / gcdVal;
      return {
        prompt: `Σε μια συνταγή χρησιμοποιούνται ${sugar} g ζάχαρης και ${flourKg} kg αλευριού. Ποιος είναι ο απλοποιημένος λόγος της ζάχαρης προς το αλεύρι;`,
        correctVal: `${ansNum}/${ansDen}`,
        altVal: `${ansNum}:${ansDen}`,
        correctText: `${ansNum} : ${ansDen}`,
        tableData: [
          { item: 'Ζάχαρη', formula: `${sugar} g`, val: `${sugar} g` },
          { item: 'Αλεύρι (σε g)', formula: `${flourKg} kg · 1.000`, val: `${flourG} g` },
          { item: 'Απλοποίηση', formula: `(${sugar} : ${gcdVal}) / (${flourG} : ${gcdVal})`, val: `${ansNum} : ${ansDen}` }
        ],
        explain: `Μετατρέπουμε το αλεύρι σε γραμμάρια: ${flourKg} kg ＝ ${flourG} g. Ο λόγος είναι ${sugar} : ${flourG}. Απλοποιώντας με τον Μ.Κ.Δ. ＝ ${gcdVal}, έχουμε ${ansNum} : ${ansDen}.`,
        distractors: [`${ansDen} : ${ansNum}`, `${ansNum} : ${ansDen + 2}`, `${ansNum + 1} : ${ansDen}`]
      };
    }
  },
  {
    id: 'p_std_4',
    title: 'Νίκες και Ήττες Ομάδας',
    generate: () => {
      const base = randInt(3, 6);
      const wins = base * randInt(2, 4);
      const losses = base * 2;
      const gcdVal = getGCD(wins, losses);
      const ansNum = wins / gcdVal;
      const ansDen = losses / gcdVal;
      return {
        prompt: `Μια ομάδα μπάσκετ πέτυχε ${wins} νίκες και ${losses} ήττες. Ποιος είναι ο λόγος των νικών προς τις ήττες σε ανάγωγη μορφή;`,
        correctVal: `${ansNum}/${ansDen}`,
        altVal: `${ansNum}:${ansDen}`,
        correctText: `${ansNum} : ${ansDen}`,
        tableData: [
          { item: 'Νίκες', formula: `${wins}`, val: `${wins}` },
          { item: 'Ήττες', formula: `${losses}`, val: `${losses}` },
          { item: 'Ανάγωγος λόγος', formula: `(${wins} : ${gcdVal}) / (${losses} : ${gcdVal})`, val: `${ansNum} : ${ansDen}` }
        ],
        explain: `Ο λόγος είναι ${wins} : ${losses}. Διαιρούμε με τον Μ.Κ.Δ.(${wins}, ${losses}) ＝ ${gcdVal} και βρίσκουμε ${ansNum} : ${ansDen}.`,
        distractors: [`${ansDen} : ${ansNum}`, `${ansNum + 1} : ${ansDen}`, `${ansNum} : ${ansDen + 1}`]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'p_hard_1',
    title: 'Κατανομή Εμβαδού Χωραφιών',
    generate: () => {
      const rA = randInt(3, 5);
      const rB = randInt(6, 8);
      const unit = randInt(12, 25);
      const sum = (rA + rB) * unit;
      const valB = rB * unit;
      return {
        prompt: `Δύο χωράφια έχουν συνολικό εμβαδόν ${sum} m². Ο λόγος του εμβαδού του πρώτου προς το δεύτερο είναι ${rA} : ${rB}. Πόσα m² είναι το εμβαδόν του μεγαλύτερου χωραφιού;`,
        correctVal: String(valB),
        correctText: `${valB} m²`,
        tableData: [
          { item: 'Σύνολο μερών', formula: `${rA} ＋ ${rB}`, val: `${rA + rB}` },
          { item: 'Τιμή 1 μέρους', formula: `${sum} : ${rA + rB}`, val: `${unit} m²` },
          { item: 'Μεγαλύτερο χωράφι', formula: `${rB} · ${unit}`, val: `${valB} m²` }
        ],
        explain: `Τα μέρη είναι ${rA} ＋ ${rB} ＝ ${rA + rB}. Το 1 μέρος αντιστοιχεί σε ${sum} : ${rA + rB} ＝ ${unit} m². Το μεγαλύτερο χωράφι έχει ${rB} μέρη: ${rB} · ${unit} ＝ ${valB} m².`,
        distractors: [`${valB - unit} m²`, `${valB + unit} m²`, `${rA * unit} m²`]
      };
    }
  },
  {
    id: 'p_hard_2',
    title: 'Λόγος Ηλικιών Πατέρα και Παιδιού',
    generate: () => {
      const rX = randInt(2, 4);
      const rY = randInt(5, 7);
      const diffMultiplier = randInt(8, 16);
      const diff = (rY - rX) * diffMultiplier;
      const y = rY * diffMultiplier;
      return {
        prompt: `Ο λόγος των ηλικιών ενός παιδιού και του πατέρα του είναι ${rX} : ${rY}. Αν ο πατέρας είναι κατά ${diff} έτη μεγαλύτερος από το παιδί, πόσα έτη είναι η ηλικία του πατέρα;`,
        correctVal: String(y),
        correctText: `${y} έτη`,
        tableData: [
          { item: 'Διαφορά μερών', formula: `${rY} － ${rX}`, val: `${rY - rX} μέρη` },
          { item: 'Τιμή 1 μέρους', formula: `${diff} : ${rY - rX}`, val: `${diffMultiplier} έτη` },
          { item: 'Ηλικία πατέρα', formula: `${rY} · ${diffMultiplier}`, val: `${y} έτη` }
        ],
        explain: `Η διαφορά των μερών είναι ${rY} － ${rX} ＝ ${rY - rX} μέρη (${diff} έτη). Άρα το 1 μέρος είναι ${diff} : ${rY - rX} ＝ ${diffMultiplier} έτη. Η ηλικία του πατέρα είναι ${rY} · ${diffMultiplier} ＝ ${y} έτη.`,
        distractors: [`${y - 4} έτη`, `${y + 4} έτη`, `${rX * diffMultiplier} έτη`]
      };
    }
  },
  {
    id: 'p_hard_3',
    title: 'Εμβαδόν Οικοπέδου με Λόγο Διαστάσεων',
    generate: () => {
      const rL = randInt(4, 6);
      const rW = randInt(2, 3);
      const k = randInt(5, 10);
      const length = rL * k;
      const width = rW * k;
      const semi = length + width;
      const perimeter = 2 * semi;
      const area = length * width;
      return {
        prompt: `Σε ένα ορθογώνιο οικόπεδο ο λόγος του μήκους προς το πλάτος είναι ${rL} : ${rW} και η περίμετρός του είναι ${perimeter} m. Πόσα m² είναι το εμβαδόν του;`,
        correctVal: String(area),
        correctText: `${area} m²`,
        tableData: [
          { item: 'Ημιπερίμετρος (μήκος ＋ πλάτος)', formula: `${perimeter} : 2`, val: `${semi} m` },
          { item: 'Τιμή 1 μέρους', formula: `${semi} : (${rL} ＋ ${rW})`, val: `${k} m` },
          { item: 'Διαστάσεις', formula: `${length} m επί ${width} m`, val: `${area} m²` }
        ],
        explain: `Η ημιπερίμετρος είναι ${perimeter} : 2 ＝ ${semi} m. Τα μέρη είναι ${rL} ＋ ${rW} ＝ ${rL + rW}, άρα 1 μέρος ＝ ${k} m. Μήκος ＝ ${length} m, πλάτος ＝ ${width} m. Εμβαδόν ＝ ${length} · ${width} ＝ ${area} m².`,
        distractors: [`${area - 20} m²`, `${area + 40} m²`, `${semi * k} m²`]
      };
    }
  },
  {
    id: 'p_hard_4',
    title: 'Σύνθεση Μεταλλικού Κράματος',
    generate: () => {
      const k = randInt(4, 9);
      const copper = 7 * k;
      const zinc = 3 * k;
      const totalAlloy = copper + zinc;
      return {
        prompt: `Ένα μεταλλικό κράμα βάρους ${totalAlloy} kg αποτελείται από χαλκό και ψευδάργυρο με λόγο 7 : 3. Πόσα kg χαλκού περιέχονται στο κράμα;`,
        correctVal: String(copper),
        correctText: `${copper} kg`,
        tableData: [
          { item: 'Σύνολο μερών', formula: '7 ＋ 3', val: '10' },
          { item: 'Βάρος 1 μέρους', formula: `${totalAlloy} : 10`, val: `${k} kg` },
          { item: 'Χαλκός (7 μέρη)', formula: `7 · ${k}`, val: `${copper} kg` }
        ],
        explain: `Τα μέρη είναι 7 ＋ 3 ＝ 10. Το κάθε μέρος ζυγίζει ${totalAlloy} : 10 ＝ ${k} kg. Ο χαλκός έχει 7 μέρη, άρα περιέχει 7 · ${k} ＝ ${copper} kg.`,
        distractors: [`${zinc} kg`, `${copper + 4} kg`, `${copper - 4} kg`]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions() {
  // Q1: Input - Απλοποίηση λόγου
  const q1M = randInt(3, 8);
  const q1N1 = randInt(2, 6);
  let q1N2 = randInt(2, 6);
  while (q1N1 === q1N2) q1N2 = randInt(2, 7);
  const q1Num = q1N1 * q1M;
  const q1Den = q1N2 * q1M;
  const q1Gcd = getGCD(q1Num, q1Den);
  const q1AnsNum = q1Num / q1Gcd;
  const q1AnsDen = q1Den / q1Gcd;

  // Q2: MCQ - Δεκαδική τιμή λόγου
  const q2Num = randInt(3, 9);
  const q2Den = [2, 4, 5, 8, 10][randInt(0, 4)];
  const q2Val = q2Num / q2Den;
  const q2ValStr = formatDecimal(q2Val, 3);
  const q2Options = shuffle([
    ...new Set([
      q2ValStr,
      formatDecimal(q2Den / q2Num, 3),
      formatDecimal(q2Val + 0.5, 3),
      formatDecimal(Math.max(0.1, q2Val - 0.25), 3)
    ])
  ]);

  // Q3: Input - Σύγκριση ομοειδών μεγεθών (cm προς m)
  const q3Cm = randInt(15, 45) * 2;
  const q3M = randInt(2, 4);
  const q3MCm = q3M * 100;
  const q3Gcd = getGCD(q3Cm, q3MCm);
  const q3AnsNum = q3Cm / q3Gcd;
  const q3AnsDen = q3MCm / q3Gcd;

  // Q4: MCQ - Αντίστροφος λόγος
  const q4A = randInt(3, 8);
  const q4B = randInt(4, 9);
  const q4Correct = `${q4B} : ${q4A}`;
  const q4Options = shuffle([
    ...new Set([
      q4Correct,
      `${q4A} : ${q4A + q4B}`,
      `${q4A * 2} : ${q4B * 2}`,
      `1 : ${q4B}`
    ])
  ]);

  // Q5: Input - Ετεροειδή μεγέθη (Ταχύτητα σε km/h)
  const q5Hours = randInt(2, 4);
  const q5Speed = randInt(65, 95);
  const q5Km = q5Speed * q5Hours;

  // Q6: MCQ - Ισοδύναμοι λόγοι
  const q6A = randInt(2, 5);
  const q6B = randInt(3, 7);
  const q6Mult = randInt(3, 6);
  const q6EqA = q6A * q6Mult;
  const q6EqB = q6B * q6Mult;
  const q6Correct = `${q6EqA} : ${q6EqB}`;
  const q6Options = shuffle([
    ...new Set([
      q6Correct,
      `${q6EqA + 1} : ${q6EqB}`,
      `${q6EqA} : ${q6EqB + 2}`,
      `${q6A * 2} : ${q6B * 3}`
    ])
  ]);

  // Q7: Standard Problem (Input)
  const spIndex = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q7Data = STANDARD_PROBLEMS_POOL[spIndex].generate();

  // Q8: MCQ - Ιδιότητα λόγου
  const q8Pool = [
    {
      prompt: 'Πότε δύο λόγοι ονομάζονται ίσοι (ισοδύναμοι);',
      correct: 'Όταν έχουν την ίδια αριθμητική τιμή',
      wrongs: ['Όταν έχουν τους ίδιους όρους', 'Όταν έχουν άθροισμα ίσο με 1', 'Όταν οι όροι τους είναι περιττοί αριθμοί'],
      explain: 'Δύο λόγοι είναι ίσοι όταν, εκτελώντας τη διαίρεση των όρων τους, έχουν ακριβώς το ίδιο πηλίκο (τιμή λόγου).'
    },
    {
      prompt: 'Ποιο είναι το γινόμενο ενός λόγου με τον αντίστροφό του;',
      correct: 'Πάντοτε 1',
      wrongs: ['Πάντοτε 0', 'Εξαρτάται από τους όρους', 'Πάντοτε 2'],
      explain: 'Για κάθε λόγο α : β, ισχύει (α/β) · (β/α) ＝ 1.'
    }
  ];
  const q8Data = q8Pool[randInt(0, q8Pool.length - 1)];
  const q8Options = shuffle([...new Set([q8Data.correct, ...q8Data.wrongs])]);

  // Q9: Hard Problem (Pool)
  const hpIndex = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q9Data = HARD_PROBLEMS_POOL[hpIndex].generate();

  // Q10: True/False - Θεωρία λόγου
  const q10IsTrue = Math.random() > 0.5;
  const q10Text = q10IsTrue
    ? 'Για να συγκρίνουμε δύο ομοειδή μεγέθη με λόγο, πρέπει να τα εκφράσουμε στην ίδια μονάδα μέτρησης.'
    : 'Στον λόγο δύο μεγεθών δεν έχει καμία σημασία η σειρά με την οποία γράφονται οι όροι.';

  return [
    {
      id: 'q1',
      type: 'input',
      inputType: 'fraction',
      title: 'Απλοποίηση Λόγου',
      prompt: `Να απλοποιηθεί πλήρως ο λόγος ${q1Num} : ${q1Den} (γράψε ως ${q1AnsNum}/${q1AnsDen} ή ${q1AnsNum}:${q1AnsDen}):`,
      correct: `${q1AnsNum}/${q1AnsDen}`,
      altCorrect: `${q1AnsNum}:${q1AnsDen}`,
      explain: `Διαιρούμε και τους δύο όρους με τον Μ.Κ.Δ.(${q1Num}, ${q1Den}) ＝ ${q1Gcd}: (${q1Num} : ${q1Gcd}) / (${q1Den} : ${q1Gcd}) ＝ ${q1AnsNum} : ${q1AnsDen}.`
    },
    {
      id: 'q2',
      type: 'mcq',
      title: 'Τιμή του Λόγου',
      prompt: `Ποια είναι η ακριβής δεκαδική τιμή του λόγου ${q2Num} : ${q2Den};`,
      options: q2Options,
      correct: q2ValStr,
      explain: `Η τιμή του λόγου βρίσκεται διαιρώντας τον πρώτο όρο με τον δεύτερο: ${q2Num} : ${q2Den} ＝ ${q2ValStr}.`
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'fraction',
      title: 'Σύγκριση Ομοειδών Μεγεθών',
      prompt: `Ποιος είναι ο απλοποιημένος λόγος του μήκους ${q3Cm} cm προς το μήκος ${q3M} m (π.χ. ${q3AnsNum}/${q3AnsDen}):`,
      correct: `${q3AnsNum}/${q3AnsDen}`,
      altCorrect: `${q3AnsNum}:${q3AnsDen}`,
      explain: `Μετατρέπουμε τα ${q3M} m σε cm: ${q3M} · 100 ＝ ${q3MCm} cm. Ο λόγος είναι ${q3Cm} : ${q3MCm}. Διαιρούμε με τον Μ.Κ.Δ. ＝ ${q3Gcd} και προκύπτει ${q3AnsNum} : ${q3AnsDen}.`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: 'Αντίστροφος Λόγος',
      prompt: `Ποιος είναι ο αντίστροφος λόγος του λόγου ${q4A} : ${q4B};`,
      options: q4Options,
      correct: q4Correct,
      explain: `Αντίστροφος του λόγου α : β είναι ο λόγος β : α. Επομένως, ο αντίστροφος του ${q4A} : ${q4B} είναι ο ${q4Correct}.`
    },
    {
      id: 'q5',
      type: 'input',
      inputType: 'number',
      title: 'Λόγος Ετεροειδών Μεγεθών',
      prompt: `Ένα τρένο διανύει ${q5Km} km σε ${q5Hours} ώρες. Ποια είναι η τιμή του λόγου της απόστασης προς τον χρόνο (μέση ταχύτητα σε km/h);`,
      correct: String(q5Speed),
      explain: `Ο λόγος απόστασης προς χρόνο εκφράζει την ταχύτητα: ${q5Km} : ${q5Hours} ＝ ${q5Speed} km/h.`
    },
    {
      id: 'q6',
      type: 'mcq',
      title: 'Ισοδύναμοι Λόγοι',
      prompt: `Ποιος από τους παρακάτω λόγους είναι ίσος με τον λόγο ${q6A} : ${q6B};`,
      options: q6Options,
      correct: q6Correct,
      explain: `Πολλαπλασιάζοντας και τους δύο όρους του ${q6A} : ${q6B} με το ${q6Mult}, έχουμε (${q6A} · ${q6Mult}) : (${q6B} · ${q6Mult}) ＝ ${q6Correct}.`
    },
    {
      id: 'q7',
      type: 'input',
      inputType: 'fraction',
      title: `Πρόβλημα: ${q7Data.title}`,
      prompt: q7Data.prompt,
      correct: q7Data.correctVal,
      altCorrect: q7Data.altVal,
      tableData: q7Data.tableData,
      explain: q7Data.explain
    },
    {
      id: 'q8',
      type: 'mcq',
      title: 'Ιδιότητες Λόγων',
      prompt: q8Data.prompt,
      options: q8Options,
      correct: q8Data.correct,
      explain: q8Data.explain
    },
    {
      id: 'q9',
      type: 'input',
      inputType: 'number',
      title: `Σύνθετο Πρόβλημα: ${q9Data.title}`,
      prompt: q9Data.prompt,
      correct: q9Data.correctVal,
      tableData: q9Data.tableData,
      explain: q9Data.explain
    },
    {
      id: 'q10',
      type: 'tf',
      title: 'Ορισμός & Σειρά Όρων',
      text: q10Text,
      correct: q10IsTrue,
      explain: q10IsTrue
        ? 'Σωστά! Για να έχει νόημα η σύγκριση ομοειδών μεγεθών, πρέπει απαραίτητα να εκφράζονται στην ίδια μονάδα μέτρησης.'
        : 'Λάθος! Η σειρά των όρων είναι καθοριστική: ο λόγος α : β είναι εντελώς διαφορετικός από τον λόγο β : α.'
    }
  ];
}

// ---------------------------------------------------------
// ΚΥΡΙΟ COMPONENT ΣΕΛΙΔΑΣ
// ---------------------------------------------------------

export default function LogosExercisesPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewSet = useCallback(() => {
    const qList = generateQuestions();
    setQuestions(qList);
    const initialAnswers = {};
    qList.forEach(q => {
      initialAnswers[q.id] = q.type === 'tf' ? null : '';
    });
    setAnswers(initialAnswers);
    setSubmitted(false);
    setScore(0);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    loadNewSet();
  }, [loadNewSet]);

  // Χειρισμός απαντήσεων: sanitize για inputs, αυτούσιο για mcq/tf
  const handleAnswerChange = (id, rawValue, type) => {
    if (submitted) return;
    if (type === 'input') {
      const q = questions.find(item => item.id === id);
      let sanitized = String(rawValue);
      if (q?.inputType === 'number') {
        sanitized = sanitized.replace(/[^0-9]/g, '');
      } else if (q?.inputType === 'fraction') {
        sanitized = sanitized.replace(/[^0-9/:]/g, '');
        // Επιτρέπουμε μόνο μία κάθετο ή άνω-κάτω τελεία
        const parts = sanitized.split(/[/:]/);
        if (parts.length > 2) {
          sanitized = parts[0] + '/' + parts.slice(1).join('');
        }
      }
      if (sanitized.length > 12) {
        sanitized = sanitized.slice(0, 12);
      }
      setAnswers(prev => ({ ...prev, [id]: sanitized }));
    } else {
      setAnswers(prev => ({ ...prev, [id]: rawValue }));
    }
  };

  const isQuestionCorrect = (q) => {
    const userVal = answers[q.id];
    if (q.type === 'input') {
      if (typeof userVal !== 'string') return false;
      const cleanUser = userVal.replace(/\s+/g, '').replace(':', '/').trim().toLowerCase();
      const cleanTarget = q.correct.replace(/\s+/g, '').replace(':', '/').trim().toLowerCase();
      const cleanAlt = q.altCorrect ? q.altCorrect.replace(/\s+/g, '').replace(':', '/').trim().toLowerCase() : null;

      return cleanUser === cleanTarget || (cleanAlt && cleanUser === cleanAlt);
    }
    if (q.type === 'mcq') {
      return userVal === q.correct;
    }
    if (q.type === 'tf') {
      return userVal === q.correct;
    }
    return false;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted || questions.length === 0) return;

    let total = 0;
    questions.forEach(q => {
      if (isQuestionCorrect(q)) total += 1;
    });

    setScore(total);
    setSubmitted(true);
  };

  const getCardStyle = (q) => {
    if (!submitted) return 'bg-white border-slate-200 shadow-sm';
    return isQuestionCorrect(q)
      ? 'bg-emerald-50/70 border-emerald-400 shadow-md ring-1 ring-emerald-400'
      : 'bg-rose-50/70 border-rose-400 shadow-md ring-1 ring-rose-400';
  };

  const answeredCount = Object.values(answers).filter(val => val !== undefined && val !== null && String(val).trim() !== '').length;

  return (
    <Layout
      title="Ασκήσεις: Η Έννοια του Λόγου - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στην έννοια του λόγου, απλοποίηση, σύγκριση μεγεθών και αναλογίες για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/40-logos"
          className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border border-blue-200 transition shrink-0"
        >
          <span>📖</span>
          <span>{toCleanUppercase('Θεωρία')}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        
        {/* HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-sky-200">
                <span>ΚΕΦΑΛΑΙΟ 40 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Η Έννοια του Λόγου
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στην απλοποίηση λόγων, στον υπολογισμό τιμής λόγου, στους αντίστροφους λόγους και στην επίλυση σύνθετων προβλημάτων!
              </p>
            </div>

            <button
              type="button"
              onClick={loadNewSet}
              className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-black shadow-md transition transform active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 shrink-0 touch-manipulation"
            >
              <span>🔄</span>
              <span>{toCleanUppercase('Νέες Ασκήσεις')}</span>
            </button>
          </div>
        </section>

        {/* ΦΟΡΜΑ ΜΕ ΤΙΣ 10 ΕΡΩΤΗΣΕΙΣ */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 2xl:gap-8">
            {questions.map((q, idx) => {
              const qNum = idx + 1;
              return (
                <div
                  key={q.id}
                  className={`p-5 sm:p-7 rounded-3xl border flex flex-col justify-between transition-all ${getCardStyle(q)}`}
                >
                  <div>
                    {/* CARD HEADER */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-black px-3 py-1 bg-sky-100 text-sky-900 rounded-full uppercase tracking-wider">
                        {toCleanUppercase(`Άσκηση ${qNum}`)} • {toCleanUppercase(q.title)}
                      </span>
                      {submitted && (
                        <span className="text-xl">
                          {isQuestionCorrect(q) ? '✅' : '❌'}
                        </span>
                      )}
                    </div>

                    {/* PROMPT (NO-GIVEAWAY: ΜΟΝΟ ΕΚΦΩΝΗΣΗ) */}
                    <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-semibold mb-4">
                      {q.type === 'tf' ? `«${q.text}»` : q.prompt}
                    </p>

                    {/* INPUTS / OPTIONS */}
                    {q.type === 'mcq' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = answers[q.id] === opt;
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              disabled={submitted}
                              onClick={() => handleAnswerChange(q.id, opt, 'mcq')}
                              className={`p-3 rounded-2xl text-xs sm:text-sm font-mono font-bold border text-center transition touch-manipulation active:scale-95 break-words whitespace-normal leading-snug flex items-center justify-center min-h-[48px] ${
                                isSelected
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {q.type === 'input' && (
                      <div className="space-y-2 mb-3">
                        <input
                          key={`input-${q.id}`}
                          autoComplete="off"
                          spellCheck="false"
                          type="text"
                          inputMode={q.inputType === 'fraction' ? 'text' : 'numeric'}
                          maxLength={12}
                          disabled={submitted}
                          value={answers[q.id] || ''}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value, 'input')}
                          placeholder={q.inputType === 'fraction' ? 'π.χ. 3/4 ή 3:4' : 'Απάντηση...'}
                          className="w-full p-3 bg-white border-2 border-slate-200 rounded-2xl font-bold text-center text-base sm:text-lg focus:border-indigo-500 outline-none disabled:bg-slate-100 font-mono tracking-wider shadow-inner"
                        />
                      </div>
                    )}

                    {q.type === 'tf' && (
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <button
                          type="button"
                          disabled={submitted}
                          onClick={() => handleAnswerChange(q.id, true, 'tf')}
                          className={`py-3 rounded-2xl font-black text-xs sm:text-sm border transition touch-manipulation active:scale-95 ${
                            answers[q.id] === true
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-300'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
                          }`}
                        >
                          👍 {toCleanUppercase('Σωστό')}
                        </button>
                        <button
                          type="button"
                          disabled={submitted}
                          onClick={() => handleAnswerChange(q.id, false, 'tf')}
                          className={`py-3 rounded-2xl font-black text-xs sm:text-sm border transition touch-manipulation active:scale-95 ${
                            answers[q.id] === false
                              ? 'bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-300'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
                          }`}
                        >
                          👎 {toCleanUppercase('Λάθος')}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* POST-SUBMISSION FEEDBACK & TABLEDATA (NO-GIVEAWAY) */}
                  {submitted && (
                    <div className="mt-4 pt-3 border-t border-slate-200/70 space-y-3">
                      {q.tableData && q.tableData.length > 0 && (
                        <div className="overflow-x-auto bg-white/90 p-2.5 rounded-2xl border border-slate-200">
                          <table className="w-full text-xs text-left text-slate-700">
                            <thead>
                              <tr className="border-b border-slate-200 font-black text-slate-500 uppercase">
                                <th className="p-1.5">{toCleanUppercase('Στοιχείο')}</th>
                                <th className="p-1.5">{toCleanUppercase('Ανάλυση / Τύπος')}</th>
                                <th className="p-1.5">{toCleanUppercase('Τιμή')}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-mono">
                              {q.tableData.map((row, rIdx) => (
                                <tr key={rIdx}>
                                  <td className="p-1.5 font-sans font-bold text-slate-900">{row.item}</td>
                                  <td className="p-1.5 text-indigo-700">{row.formula}</td>
                                  <td className="p-1.5 font-black text-emerald-700">{row.val}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      <div
                        className={`p-3 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed ${
                          isQuestionCorrect(q)
                            ? 'bg-emerald-100 text-emerald-950 border border-emerald-200'
                            : 'bg-rose-100 text-rose-950 border border-rose-200'
                        }`}
                      >
                        <p className="font-bold mb-1">
                          {isQuestionCorrect(q) ? '🎯 Εξαιρετικά!' : '💡 Επεξήγηση:'}
                        </p>
                        <p>{q.explain}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-base sm:text-lg font-black px-8 sm:px-10 py-4 rounded-2xl shadow-xl transition transform hover:scale-105 active:scale-95 flex items-center gap-2.5 touch-manipulation"
              >
                <span className="text-xl">🎯</span>
                <span>{toCleanUppercase('Έλεγχος Απαντήσεων')}</span>
              </button>
            </div>
          )}
        </form>
      </div>

      {/* FIXED BOTTOM SCORE FOOTER */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6 z-50">
        <div className={`${LAYOUT.CONTAINER} flex flex-col sm:flex-row justify-between items-center gap-3`}>
          
          {/* SCORE & PERCENTAGE */}
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-sm sm:text-base md:text-lg flex items-center gap-2 shadow-sm">
              <span>🏆</span>
              <span>{submitted ? toCleanUppercase('Σκορ') : toCleanUppercase('Απαντήθηκαν')}:</span>
              <span className="font-mono text-lg sm:text-xl md:text-2xl">{score} / 10</span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                {toCleanUppercase('Ποσοστό')}:{' '}
                <span className="text-emerald-400 font-black text-sm sm:text-base">
                  {Math.round((score / 10) * 100)}%
                </span>
              </span>
            )}
          </div>

          {/* GUIDANCE OR RESTART */}
          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                type="button"
                onClick={loadNewSet}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2 sm:px-6 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 touch-manipulation"
              >
                <span>🔄</span>
                <span>{toCleanUppercase('Νέες Ασκήσεις')}</span>
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden sm:block">
                Απάντησε και στις 10 ερωτήσεις και πάτησε «{toCleanUppercase('Έλεγχος Απαντήσεων')}»!
              </p>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}
