// pages/st-dimotikou/41-analogia-ask.js
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

// Μορφοποίηση αριθμού (ακέραιος ή δεκαδικός με κόμμα)
function formatNum(val, decimals = 2) {
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  if (Number.isInteger(Number(val))) return String(val);
  const rounded = Number(Number(val).toFixed(decimals));
  return String(rounded).replace('.', ',');
}

// ---------------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (Q9 & Q10) - "NO-GIVEAWAY" PEDAGOGY
// ---------------------------------------------------------

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'p_std_1',
    title: 'Αγορά Τετραδίων',
    unit: '€',
    generate: () => {
      const pCount1 = randInt(3, 6);
      const pricePerItem = randInt(2, 5);
      const cost1 = pCount1 * pricePerItem;
      const pCount2 = randInt(7, 12);
      const cost2 = pCount2 * pricePerItem;
      return {
        prompt: `Αν ${pCount1} ίδια τετράδια κοστίζουν ${cost1} €, πόσα € θα πληρώσουμε για να αγοράσουμε ${pCount2} τέτοια τετράδια;`,
        unit: '€',
        correctVal: String(cost2),
        correctText: `${cost2} €`,
        tableData: [
          { item: 'Πρώτη αγορά', formula: `${pCount1} τετράδια`, val: `${cost1} €` },
          { item: 'Δεύτερη αγορά', formula: `${pCount2} τετράδια`, val: 'x €' },
          { item: 'Αναλογία (σταυρωτά γινόμενα)', formula: `(${cost1} · ${pCount2}) :${pCount1}`, val: `${cost2} €` }
        ],
        explain: `Στήνουμε την αναλογία ποσότητας προς κόστος: ${pCount1} : ${cost1} ＝${pCount2} : x. Εφαρμόζοντας σταυρωτά γινόμενα (χιαστί), έχουμε: x ＝ (${cost1} ·${pCount2}) : ${pCount1} ＝${cost1 * pCount2} : ${pCount1} ＝${cost2} €.`,
        distractors: [`${cost2 + 4} €`, `${cost2 - 3} €`, `${cost2 + 6} €`]
      };
    }
  },
  {
    id: 'p_std_2',
    title: 'Παραγωγή Χυμού από Πορτοκάλια',
    unit: 'ml',
    generate: () => {
      const kg1 = randInt(2, 5);
      const rate = randInt(4, 8) * 10;
      const juice1 = kg1 * rate;
      const kg2 = randInt(6, 10);
      const juice2 = kg2 * rate;
      return {
        prompt: `Από ${kg1} kg πορτοκάλια παίρνουμε ${juice1} ml χυμό. Πόσα ml χυμό θα πάρουμε από ${kg2} kg πορτοκάλια ίδιας ποιότητας;`,
        unit: 'ml',
        correctVal: String(juice2),
        correctText: `${juice2} ml`,
        tableData: [
          { item: 'Αρχική ποσότητα', formula: `${kg1} kg`, val: `${juice1} ml` },
          { item: 'Νέα ποσότητα', formula: `${kg2} kg`, val: 'x ml` },
          { item: 'Επίλυση αναλογίας', formula: `(${juice1} · ${kg2}) : ${kg1}`, val: `${juice2} ml` }
        ],
        explain: `Τα ποσά είναι ανάλογα: ${kg1} : ${juice1} ＝ ${kg2} : x. Άρα x ＝ (${juice1} · ${kg2}) : ${kg1} ＝ ${juice1 * kg2} : ${kg1} ＝ ${juice2} ml.`,
        distractors: [`${juice2 + 40} ml`, `${juice2 - 50} ml`, `${juice2 + 80} ml`]
      };
    }
  },
  {
    id: 'p_std_3',
    title: 'Διαδρομή με Σταθερή Ταχύτητα',
    unit: 'km',
    generate: () => {
      const km1 = randInt(3, 6) * 40;
      const hours1 = randInt(2, 3);
      const speed = km1 / hours1;
      const hours2 = hours1 + randInt(2, 4);
      const km2 = speed * hours2;
      return {
        prompt: `Ένα αυτοκίνητο κινούμενο με σταθερή ταχύτητα διανύει ${km1} km σε ${hours1} ώρες. Πόσα km θα διανύσει σε ${hours2} ώρες;`,
        unit: 'km',
        correctVal: String(km2),
        correctText: `${km2} km`,
        tableData: [
          { item: 'Πρώτη διαδρομή', formula: `${hours1} ώρες`, val: `${km1} km` },
          { item: 'Δεύτερη διαδρομή', formula: `${hours2} ώρες`, val: 'x km' },
          { item: 'Αναλογία', formula: `(${km1} · ${hours2}) : ${hours1}`, val: `${km2} km` }
        ],
        explain: `Απόσταση και χρόνος σχηματίζουν αναλογία: ${km1} : ${hours1} ＝ x : ${hours2}. Με σταυρωτά γινόμενα βρίσκουμε: x ＝ (${km1} · ${hours2}) : ${hours1} ＝ ${km2} km.`,
        distractors: [`${km2 + 30} km`, `${km2 - 40} km`, `${km2 + 60} km`]
      };
    }
  },
  {
    id: 'p_std_4',
    title: 'Αναλογία Υλικών σε Συνταγή',
    unit: 'g',
    generate: () => {
      const eggs1 = randInt(2, 4);
      const flour1 = eggs1 * 125;
      const eggs2 = eggs1 + randInt(2, 4);
      const flour2 = eggs2 * 125;
      return {
        prompt: `Για ένα κέικ χρειάζονται ${eggs1} αυγά και ${flour1} g αλεύρι. Αν χρησιμοποιηθούν ${eggs2} αυγά με την ίδια αναλογία, πόσα g αλεύρι θα χρειαστούν;`,
        unit: 'g',
        correctVal: String(flour2),
        correctText: `${flour2} g`,
        tableData: [
          { item: 'Αυγά', formula: `${eggs1} αυγά ➔ ${eggs2} αυγά`, val: 'Αύξηση' },
          { item: 'Αναλογία', formula: `${eggs1} : ${flour1} ＝ ${eggs2} : x`, val: `x ＝ (${flour1} · ${eggs2}) : ${eggs1}` },
          { item: 'Τελικό αλεύρι', formula: `${flour1 * eggs2} : ${eggs1}`, val: `${flour2} g` }
        ],
        explain: `Ο λόγος αυγών προς αλεύρι παραμένει σταθερός: ${eggs1} : ${flour1} ＝ ${eggs2} : x. Συνεπώς: x ＝ (${flour1} · ${eggs2}) : ${eggs1} ＝ ${flour2} g.`,
        distractors: [`${flour2 + 100} g`, `${flour2 - 125} g`, `${flour2 + 150} g`]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'p_hard_1',
    title: 'Υπολογισμός Πραγματικής Απόστασης από Κλίμακα',
    unit: 'm',
    generate: () => {
      const scaleVal = randInt(2, 5) * 50;
      const mapCm = randInt(3, 7);
      const realMeters = (mapCm * scaleVal) / 100;
      return {
        prompt: `Σε έναν χάρτη με κλίμακα 1 : ${scaleVal}, η απόσταση δύο κτηρίων σχεδιάστηκε ίση με ${mapCm} cm. Πόσα m είναι η πραγματική απόσταση μεταξύ των δύο κτηρίων;`,
        unit: 'm',
        correctVal: String(realMeters),
        correctText: `${formatNum(realMeters)} m`,
        tableData: [
          { item: 'Κλίμακα', formula: `1 : ${scaleVal}`, val: `1 cm ➔ ${scaleVal} cm` },
          { item: 'Απόσταση στον χάρτη', formula: `${mapCm} cm`, val: `${mapCm * scaleVal} cm` },
          { item: 'Μετατροπή σε μέτρα', formula: `(${mapCm} · ${scaleVal}) : 100`, val: `${formatNum(realMeters)} m` }
        ],
        explain: `Η κλίμακα είναι αναλογία: 1 : ${scaleVal} ＝ ${mapCm} : x. Άρα η πραγματική απόσταση είναι x ＝ ${mapCm} · ${scaleVal} ＝ ${mapCm * scaleVal} cm. Μετατρέπουμε σε μέτρα: ${mapCm * scaleVal} : 100 ＝ ${formatNum(realMeters)} m.`,
        distractors: [`${formatNum(realMeters + 2)} m`, `${formatNum(Math.max(1, realMeters - 3))} m`, `${formatNum(realMeters * 2)} m`]
      };
    }
  },
  {
    id: 'p_hard_2',
    title: 'Μοιρασιά Αμοιβής με Αναλογία',
    unit: '€',
    generate: () => {
      const ratioA = 3;
      const ratioB = 5;
      const k = randInt(12, 28);
      const partA = ratioA * k;
      const partB = ratioB * k;
      const total = partA + partB;
      return {
        prompt: `Δύο τεχνίτες μοιράστηκαν αμοιβή ${total} € έτσι ώστε ο λόγος των χρημάτων τους να είναι ίσος με ${ratioA} : ${ratioB}. Πόσα € έλαβε ο τεχνίτης που πήρε το μεγαλύτερο ποσό;`,
        unit: '€',
        correctVal: String(partB),
        correctText: `${partB} €`,
        tableData: [
          { item: 'Σύνολο μερών', formula: `${ratioA} ＋ ${ratioB}`, val: `${ratioA + ratioB} μέρη` },
          { item: 'Αξία 1 μέρους', formula: `${total} : ${ratioA + ratioB}`, val: `${k} €` },
          { item: 'Μεγαλύτερο μερίδιο', formula: `${ratioB} · ${k}`, val: `${partB} €` }
        ],
        explain: `Τα συνολικά μέρη της αναλογίας είναι ${ratioA} ＋ ${ratioB} ＝ ${ratioA + ratioB}. Το 1 μέρος αντιστοιχεί σε ${total} : ${ratioA + ratioB} ＝ ${k} €. Ο τεχνίτης με το μεγαλύτερο μερίδιο πήρε ${ratioB} μέρη: ${ratioB} · ${k} ＝ ${partB} €.`,
        distractors: [`${partB - k} €`, `${partB + k} €`, `${partA} €`]
      };
    }
  },
  {
    id: 'p_hard_3',
    title: 'Εμβαδόν Ορθογωνίου με Αναλογία Διαστάσεων',
    unit: 'm²',
    generate: () => {
      const rL = randInt(3, 5);
      const rW = randInt(2, 3);
      const mult = randInt(6, 12);
      const len = rL * mult;
      const wid = rW * mult;
      const perimeter = 2 * (len + wid);
      const area = len * wid;
      return {
        prompt: `Σε ένα ορθογώνιο αγροτεμάχιο ο λόγος του μήκους προς το πλάτος είναι ${rL} : ${rW} και η περίμετρος ισούται με ${perimeter} m. Πόσα m² είναι το εμβαδόν του;`,
        unit: 'm²',
        correctVal: String(area),
        correctText: `${area} m²`,
        tableData: [
          { item: 'Ημιπερίμετρος (μήκος ＋ πλάτος)', formula: `${perimeter} : 2`, val: `${len + wid} m` },
          { item: 'Τιμή 1 μέρους', formula: `${len + wid} : (${rL} ＋ ${rW})`, val: `${mult} m` },
          { item: 'Διαστάσεις & Εμβαδόν', formula: `${len} m · ${wid} m`, val: `${area} m²` }
        ],
        explain: `Η ημιπερίμετρος είναι ${perimeter} : 2 ＝ ${len + wid} m. Τα μέρη είναι ${rL} ＋ ${rW} ＝ ${rL + rW}, άρα 1 μέρος ＝ ${mult} m. Μήκος ＝ ${len} m, πλάτος ＝ ${wid} m. Εμβαδόν ＝ ${len} · ${wid} ＝ ${area} m².`,
        distractors: [`${area - 30} m²`, `${area + 40} m²`, `${(len + wid) * mult} m²`]
      };
    }
  },
  {
    id: 'p_hard_4',
    title: 'Χρυσό Κόσμημα και Καράτια',
    unit: 'g',
    generate: () => {
      const rGold = 18;
      const rTotal = 24;
      const totalWeight = randInt(4, 9) * 12;
      const pureGold = (totalWeight * rGold) / rTotal;
      return {
        prompt: `Ένα χρυσό κόσμημα 18 καρατίων περιέχει 18 μέρη καθαρού χρυσού στα 24 μέρη συνολικής μάζας. Αν το κόσμημα ζυγίζει ${totalWeight} g, πόσα g καθαρού χρυσού περιέχει;`,
        unit: 'g',
        correctVal: String(pureGold),
        correctText: `${pureGold} g`,
        tableData: [
          { item: 'Αναλογία καρατίων', formula: '18 μέρη στα 24', val: '18/24 ＝ 3/4' },
          { item: 'Εξίσωση αναλογίας', formula: `18 : 24 ＝ x : ${totalWeight}`, val: `x ＝ (18 · ${totalWeight}) : 24` },
          { item: 'Καθαρός χρυσός', formula: `(3 · ${totalWeight}) : 4`, val: `${pureGold} g` }
        ],
        explain: `Σχηματίζουμε την αναλογία: 18 : 24 ＝ x : ${totalWeight}. Λύνουμε ως προς x: x ＝ (18 · ${totalWeight}) : 24 ＝ ${pureGold} g καθαρού χρυσού.`,
        distractors: [`${pureGold + 6} g`, `${pureGold - 6} g`, `${totalWeight - pureGold} g`]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions() {
  // Q1: Input - Εύρεση άγνωστου όρου x (a : b = c : x)
  const q1A = randInt(2, 6);
  const q1B = randInt(3, 8);
  const q1Mult = randInt(2, 5);
  const q1C = q1A * q1Mult;
  const q1D = q1B * q1Mult;

  // Q2: MCQ - Έλεγχος αν δύο λόγοι σχηματίζουν αναλογία
  const q2A = randInt(2, 5);
  const q2B = randInt(3, 7);
  const q2M = randInt(2, 4);
  const q2CTrue = q2A * q2M;
  const q2DTrue = q2B * q2M;
  const q2OptTrue = `${q2CTrue} : ${q2DTrue}`;
  const q2Options = shuffle([
    ...new Set([
      q2OptTrue,
      `${q2CTrue + 1} : ${q2DTrue}`,
      `${q2CTrue} : ${q2DTrue + 2}`,
      `${q2A + 2} : ${q2B + 3}`
    ])
  ]);

  // Q3: Input - Άγνωστος όρος σε άκρα θέση (x : b = c : d)
  const q3B = randInt(3, 7);
  const q3C = randInt(2, 5);
  const q3M = randInt(2, 4);
  const q3D = q3B * q3M;
  const q3XVal = q3C;
  const q3Top = q3C * q3M;

  // Q4: MCQ - Αναγνώριση άκρων και μέσων όρων
  const q4N1 = randInt(3, 8);
  const q4N2 = randInt(4, 9);
  const q4N3 = randInt(5, 11);
  const q4N4 = randInt(6, 12);
  const q4CorrectAns = `Άκροι: ${q4N1} και ${q4N4} | Μέσοι: ${q4N2} και ${q4N3}`;
  const q4Options = shuffle([
    ...new Set([
      q4CorrectAns,
      `Άκροι: ${q4N2} και ${q4N3} | Μέσοι: ${q4N1} και ${q4N4}`,
      `Άκροι: ${q4N1} και ${q4N2} | Μέσοι: ${q4N3} και ${q4N4}`,
      `Άκροι: ${q4N1} και ${q4N3} | Μέσοι: ${q4N2} και ${q4N4}`
    ])
  ]);

  // Q5: Input - Συμπλήρωση ισοδύναμου κλάσματος
  const q5Num = randInt(2, 5);
  const q5Den = randInt(6, 9);
  const q5K = randInt(2, 4);
  const q5EqNum = q5Num * q5K;
  const q5EqDen = q5Den * q5K;

  // Q6: MCQ - Βασική Ιδιότητα (Ποια ισότητα ισχύει)
  const q6X = randInt(3, 7);
  const q6Y = randInt(4, 8);
  const q6Z = randInt(5, 9);
  const q6W = randInt(6, 10);
  const q6CorrectEq = `${q6X} · ${q6W} ＝ ${q6Y} · ${q6Z}`;
  const q6Options = shuffle([
    ...new Set([
      q6CorrectEq,
      `${q6X} · ${q6Y} ＝ ${q6Z} · ${q6W}`,
      `${q6X} · ${q6Z} ＝ ${q6Y} · ${q6W}`,
      `${q6X} ＋ ${q6W} ＝ ${q6Y} ＋ ${q6Z}`
    ])
  ]);

  // Q7: Standard Problem (Input)
  const spIndex1 = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q7Data = STANDARD_PROBLEMS_POOL[spIndex1].generate();

  // Q8: MCQ - Επαλήθευση ισότητας αναλογίας
  const q8A = randInt(2, 5);
  const q8B = randInt(3, 7);
  const q8Mult = randInt(3, 6);
  const q8C = q8A * q8Mult;
  const q8D = q8B * q8Mult;
  const q8Options = shuffle([
    ...new Set([
      String(q8D),
      String(q8D + 2),
      String(Math.max(1, q8D - 3)),
      String(q8D + 5)
    ])
  ]);

  // Q9: Hard Problem (Pool)
  const hpIndex1 = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q9Data = HARD_PROBLEMS_POOL[hpIndex1].generate();

  // Q10: True/False - Βασική θεωρία αναλογιών
  const q10IsTrue = Math.random() > 0.5;
  const q10Text = q10IsTrue
    ? 'Σε κάθε αληθή αναλογία, το γινόμενο των άκρων όρων ισούται πάντοτε με το γινόμενο των μέσων όρων.'
    : 'Σε κάθε αναλογία, το άθροισμα των άκρων όρων ισούται πάντοτε με το άθροισμα των μέσων όρων.';

  return [
    {
      id: 'q1',
      type: 'input',
      inputType: 'number',
      title: 'Εύρεση Αγνώστου Όρου',
      prompt: `Στην αναλογία ${q1A} : ${q1B} ＝ ${q1C} : x, ποια είναι η τιμή του x;`,
      correct: String(q1D),
      explain: `Χρησιμοποιούμε τη βασική ιδιότητα των σταυρωτών γινομένων: ${q1A} · x ＝ ${q1B} · ${q1C} ➔ x ＝ (${q1B} · ${q1C}) : ${q1A} ＝ ${q1B * q1C} : ${q1A} ＝ ${q1D}.`
    },
    {
      id: 'q2',
      type: 'mcq',
      title: 'Έλεγχος Αναλογίας',
      prompt: `Ποιος από τους παρακάτω λόγους σχηματίζει αναλογία με τον λόγο ${q2A} : ${q2B};`,
      options: q2Options,
      correct: q2OptTrue,
      explain: `Για να σχηματίζουν αναλογία, τα σταυρωτά γινόμενα πρέπει να είναι ίσα: ${q2A} · ${q2DTrue} ＝ ${q2A * q2DTrue} και ${q2B} · ${q2CTrue} ＝ ${q2B * q2CTrue}. Άρα ο λόγος ${q2OptTrue} είναι ο σωστός.`
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'number',
      title: 'Άγνωστος σε Άκρα Θέση',
      prompt: `Στην ισότητα κλασμάτων x/${q3B} ＝ ${q3Top}/${q3D}, ποια είναι η τιμή του x;`,
      correct: String(q3XVal),
      explain: `Εφαρμόζουμε σταυρωτά γινόμενα: x · ${q3D} ＝ ${q3B} · ${q3Top} ➔ x ＝ (${q3B} · ${q3Top}) : ${q3D} ＝ ${q3XVal}.`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: 'Όροι Αναλογίας',
      prompt: `Στην αναλογία ${q4N1} : ${q4N2} ＝ ${q4N3} : ${q4N4}, ποιοι είναι οι άκροι και ποιοι οι μέσοι όροι;`,
      options: q4Options,
      correct: q4CorrectAns,
      explain: `Στη γραφή α : β ＝ γ : δ, άκροι όροι ονομάζονται οι εξωτερικοί (${q4N1} και ${q4N4}) και μέσοι όροι οι εσωτερικοί (${q4N2} και ${q4N3}).`
    },
    {
      id: 'q5',
      type: 'input',
      inputType: 'fraction',
      title: 'Σχηματισμός Αναλογίας',
      prompt: `Βρες το ισοδύναμο κλάσμα με αριθμητή ${q5EqNum} ώστε ${q5Num}/${q5Den} ＝ ${q5EqNum}/x (γράψε ως ${q5EqNum}/${q5EqDen}):`,
      correct: `${q5EqNum}/${q5EqDen}`,
      altCorrect: `${q5EqNum}:${q5EqDen}`,
      explain: `Πολλαπλασιάζουμε και τους δύο όρους με το ${q5K}: ${q5Num} · ${q5K} ＝ ${q5EqNum}, άρα και ο παρονομαστής γίνεται ${q5Den} · ${q5K} ＝ ${q5EqDen}. Το ισοδύναμο κλάσμα είναι ${q5EqNum}/${q5EqDen}.`
    },
    {
      id: 'q6',
      type: 'mcq',
      title: 'Σταυρωτά Γινόμενα',
      prompt: `Αν ισχύει η αναλογία ${q6X} : ${q6Y} ＝ ${q6Z} : ${q6W}, ποια ισότητα είναι πάντοτε αληθής;`,
      options: q6Options,
      correct: q6CorrectEq,
      explain: `Σύμφωνα με τη βασική ιδιότητα των αναλογιών, το γινόμενο των άκρων ισούται με το γινόμενο των μέσων: ${q6CorrectEq}.`
    },
    {
      id: 'q7',
      type: 'input',
      inputType: 'number',
      title: `Πρόβλημα: ${q7Data.title}`,
      prompt: q7Data.prompt,
      correct: q7Data.correctVal,
      tableData: q7Data.tableData,
      explain: q7Data.explain
    },
    {
      id: 'q8',
      type: 'mcq',
      title: 'Υπολογισμός Άγνωστου Όρου',
      prompt: `Αν ${q8A} : ${q8B} ＝ ${q8C} : x, ποια είναι η τιμή του x;`,
      options: q8Options,
      correct: String(q8D),
      explain: `x ＝ (${q8B} · ${q8C}) : ${q8A} ＝ ${q8B * q8C} : ${q8A} ＝ ${q8D}.`
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
      title: 'Βασική Ιδιότητα Αναλογιών',
      text: q10Text,
      correct: q10IsTrue,
      explain: q10IsTrue
        ? 'Σωστά! Η θεμελιώδης ιδιότητα ορίζει ότι σε κάθε αναλογία α : β ＝ γ : δ ισχύει πάντοτε α · δ ＝ β · γ.'
        : 'Λάθος! Στις αναλογίες ισχύει η ισότητα των γινομένων (α · δ ＝ β · γ) και όχι των αθροισμάτων.'
    }
  ];
}

// ---------------------------------------------------------
// ΚΥΡΙΟ COMPONENT ΣΕΛΙΔΑΣ
// ---------------------------------------------------------

export default function AnalogiaExercisesPage() {
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
      } else if (q?.inputType === 'decimal') {
        sanitized = sanitized.replace(/\./g, ',').replace(/[^0-9,]/g, '');
        const parts = sanitized.split(',');
        if (parts.length > 2) sanitized = parts[0] + ',' + parts.slice(1).join('');
      } else if (q?.inputType === 'fraction') {
        sanitized = sanitized.replace(/[^0-9/:]/g, '');
        const parts = sanitized.split(/[/:]/);
        if (parts.length > 2) sanitized = parts[0] + '/' + parts.slice(1).join('');
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
      const cleanUser = userVal.replace(/\s+/g, '').replace(':', '/').replace(/^x[=＝]/i, '').trim().toLowerCase();
      const cleanTarget = q.correct.replace(/\s+/g, '').replace(':', '/').replace(/^x[=＝]/i, '').trim().toLowerCase();
      const cleanAlt = q.altCorrect ? q.altCorrect.replace(/\s+/g, '').replace(':', '/').replace(/^x[=＝]/i, '').trim().toLowerCase() : null;

      if (cleanUser === cleanTarget || (cleanAlt && cleanUser === cleanAlt)) return true;

      if (q.inputType === 'decimal') {
        const numUser = parseFloat(cleanUser.replace(',', '.'));
        const numTarget = parseFloat(cleanTarget.replace(',', '.'));
        return !isNaN(numUser) && !isNaN(numTarget) && Math.abs(numUser - numTarget) < 0.05;
      }
      return false;
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
      title="Ασκήσεις: Αναλογίες - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στις αναλογίες, τα σταυρωτά γινόμενα (χιαστί) και τα πρακτικά προβλήματα για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/41-analogia"
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
                <span>ΚΕΦΑΛΑΙΟ 41 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Αναλογίες
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στην εύρεση αγνώστων όρων, στα σταυρωτά γινόμενα (χιαστί), στους όρους αναλογίας και στα ρεαλιστικά προβλήματα!
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
                          placeholder={q.inputType === 'fraction' ? 'π.χ. 6/18 ή 6:18' : 'Απάντηση...'}
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
