// pages/st-dimotikou/44-analoga-posa-ask.js
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
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (Q7, Q8, Q9, Q10) - "NO-GIVEAWAY" PEDAGOGY
// ---------------------------------------------------------

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'analoga_std_1',
    title: 'Αγορά Φρούτων',
    unit: '€',
    generate: () => {
      const kg1 = randInt(2, 4);
      const lambdaVal = randInt(3, 6);
      const cost1 = kg1 * lambdaVal;
      const kg2 = kg1 + randInt(3, 5);
      const cost2 = kg2 * lambdaVal;
      return {
        prompt: `Τα ποσά «βάρος φρούτων (kg)» και «κόστος (€)» είναι ανάλογα. Αν για ${kg1} kg πληρώσαμε ${cost1} €, πόσα € θα πληρώσουμε για ${kg2} kg από τα ίδια φρούτα;`,
        unit: '€',
        correctVal: String(cost2),
        correctText: `${cost2} €`,
        tableData: [
          { item: 'Συντελεστής αναλογίας λ', formula: `${cost1} : ${kg1}`, val: `${lambdaVal} €/kg` },
          { item: 'Νέα ποσότητα (x)', formula: `${kg2} kg`, val: `${kg2} kg` },
          { item: 'Τελικό κόστος (y)', formula: `${lambdaVal} · ${kg2}`, val: `${cost2} €` }
        ],
        explain: `Ο συντελεστής αναλογίας είναι λ ＝ ${cost1} : ${kg1} ＝ ${lambdaVal} €/kg. Για ${kg2} kg το κόστος είναι y ＝ λ · x ＝ ${lambdaVal} · ${kg2} ＝ ${cost2} €.`,
        distractors: [`${cost2 + lambdaVal} €`, `${cost2 - lambdaVal} €`, `${cost2 + 2 * lambdaVal} €`]
      };
    }
  },
  {
    id: 'analoga_std_2',
    title: 'Κίνηση Τρένου με Σταθερή Ταχύτητα',
    unit: 'km',
    generate: () => {
      const speed = randInt(65, 90);
      const hours1 = randInt(2, 3);
      const dist1 = speed * hours1;
      const hours2 = hours1 + randInt(2, 4);
      const dist2 = speed * hours2;
      return {
        prompt: `Ένα τρένο κινείται με σταθερή ταχύτητα, άρα ο χρόνος και η απόσταση είναι ανάλογα ποσά. Αν σε ${hours1} ώρες διανύει ${dist1} km, πόσα km θα διανύσει σε ${hours2} ώρες;`,
        unit: 'km',
        correctVal: String(dist2),
        correctText: `${dist2} km`,
        tableData: [
          { item: 'Συντελεστής αναλογίας λ (Ταχύτητα)', formula: `${dist1} : ${hours1}`, val: `${speed} km/h` },
          { item: 'Νέος χρόνος', formula: `${hours2} ώρες`, val: `${hours2} h` },
          { item: 'Συνολική απόσταση', formula: `${speed} · ${hours2}`, val: `${dist2} km` }
        ],
        explain: `Ο συντελεστής αναλογίας (ταχύτητα) είναι λ ＝ ${dist1} : ${hours1} ＝ ${speed} km/h. Σε ${hours2} ώρες θα διανύσει: ${speed} · ${hours2} ＝ ${dist2} km.`,
        distractors: [`${dist2 + speed} km`, `${dist2 - speed} km`, `${dist2 + 40} km`]
      };
    }
  },
  {
    id: 'analoga_std_3',
    title: 'Συσκευασία Δεμάτων σε Εργαστήριο',
    unit: 'δέματα',
    generate: () => {
      const workers = randInt(2, 4);
      const rate = randInt(15, 25);
      const prod1 = workers * rate;
      const targetWorkers = workers + randInt(2, 5);
      const prod2 = targetWorkers * rate;
      return {
        prompt: `Σε ένα εργαστήριο το πλήθος των εργατών και ο αριθμός των παραγόμενων δεμάτων είναι ανάλογα ποσά. Αν ${workers} εργάτες συσκευάζουν ${prod1} δέματα, πόσα δέματα θα συσκευάσουν ${targetWorkers} εργάτες με τον ίδιο ρυθμό;`,
        unit: 'δέματα',
        correctVal: String(prod2),
        correctText: `${prod2} δέματα`,
        tableData: [
          { item: 'Απόδοση ανά εργάτη (λ)', formula: `${prod1} : ${workers}`, val: `${rate} δέματα` },
          { item: 'Νέοι εργάτες', formula: `${targetWorkers} εργάτες`, val: `${targetWorkers}` },
          { item: 'Συνολική παραγωγή', formula: `${targetWorkers} · ${rate}`, val: `${prod2} δέματα` }
        ],
        explain: `Κάθε εργάτης συσκευάζει σταθερά λ ＝ ${prod1} : ${workers} ＝ ${rate} δέματα. Άρα ${targetWorkers} εργάτες θα συσκευάσουν: ${targetWorkers} · ${rate} ＝ ${prod2} δέματα.`,
        distractors: [`${prod2 + rate} δέματα`, `${prod2 - rate} δέματα`, `${prod2 + 20} δέματα`]
      };
    }
  },
  {
    id: 'analoga_std_4',
    title: 'Παραγωγή Ψωμιού από Αλεύρι',
    unit: 'kg',
    generate: () => {
      const flourPerBread = 0.5;
      const breads1 = randInt(6, 12);
      const flour1 = Number((breads1 * flourPerBread).toFixed(1));
      const breads2 = breads1 + randInt(4, 8);
      const flour2 = Number((breads2 * flourPerBread).toFixed(1));
      return {
        prompt: `Το βάρος του αλευριού και ο αριθμός των καρβελιών ψωμιού είναι ανάλογα ποσά. Αν για ${breads1} καρβέλια απαιτούνται ${formatNum(flour1)} kg αλεύρι, πόσα kg αλεύρι χρειάζονται για ${breads2} καρβέλια;`,
        unit: 'kg',
        correctVal: formatNum(flour2),
        correctText: `${formatNum(flour2)} kg`,
        tableData: [
          { item: 'Συντελεστής αναλογίας λ', formula: `${formatNum(flour1)} : ${breads1}`, val: `${formatNum(flourPerBread)} kg/καρβέλι` },
          { item: 'Στόχος παραγωγής', formula: `${breads2} καρβέλια`, val: `${breads2}` },
          { item: 'Απαιτούμενο αλεύρι', formula: `${breads2} · ${formatNum(flourPerBread)}`, val: `${formatNum(flour2)} kg` }
        ],
        explain: `Ο συντελεστής αναλογίας είναι λ ＝ ${formatNum(flour1)} : ${breads1} ＝ ${formatNum(flourPerBread)} kg ανά καρβέλι. Για ${breads2} καρβέλια απαιτούνται: ${breads2} · ${formatNum(flourPerBread)} ＝ ${formatNum(flour2)} kg.`,
        distractors: [`${formatNum(flour2 + 1)} kg`, `${formatNum(Math.max(1, flour2 - 1))} kg`, `${formatNum(flour2 + 2)} kg`]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'analoga_hard_1',
    title: 'Αναλογία Βάρους και Αξίας με Μετατροπή',
    unit: '€',
    generate: () => {
      const massKg = 1.5;
      const price = 4.5; // λ = 3
      const targetGrams = 2500;
      const targetKg = targetGrams / 1000;
      const finalPrice = targetKg * 3;
      return {
        prompt: `Το βάρος και η αξία ενός προϊόντος είναι ανάλογα ποσά. Αν τα ${formatNum(massKg)} kg κοστίζουν ${formatNum(price)} €, πόσα € κοστίζουν ${targetGrams} g από το ίδιο προϊόν;`,
        unit: '€',
        correctVal: formatNum(finalPrice),
        correctText: `${formatNum(finalPrice)} €`,
        tableData: [
          { item: 'Μετατροπή γραμμαρίων σε kg', formula: `${targetGrams} g : 1.000`, val: `${formatNum(targetKg)} kg` },
          { item: 'Συντελεστής αναλογίας λ', formula: `${formatNum(price)} : ${formatNum(massKg)}`, val: '3 €/kg' },
          { item: 'Τελική τιμή', formula: `${formatNum(targetKg)} · 3`, val: `${formatNum(finalPrice)} €` }
        ],
        explain: `Μετατρέπουμε τα γραμμάρια σε κιλά: ${targetGrams} g ＝ ${formatNum(targetKg)} kg. Ο συντελεστής αναλογίας είναι λ ＝ ${formatNum(price)} : ${formatNum(massKg)} ＝ 3 €/kg. Η τιμή είναι: ${formatNum(targetKg)} · 3 ＝ ${formatNum(finalPrice)} €.`,
        distractors: [`${formatNum(finalPrice + 1.5)} €`, `${formatNum(Math.max(1, finalPrice - 1.5))} €`, `${formatNum(finalPrice + 3)} €`]
      };
    }
  },
  {
    id: 'analoga_hard_2',
    title: 'Μη Ανάλογο Ποσό (Εμβαδόν Τετραγώνου)',
    unit: 'φορές',
    generate: () => {
      const side = randInt(3, 6);
      const perimeter = 4 * side;
      const area = side * side;
      const mult = 2;
      const newSide = side * mult;
      const newPerimeter = 4 * newSide;
      const newArea = newSide * newSide;
      return {
        prompt: `Σε ένα τετράγωνο με πλευρά ${side} cm, διπλασιάζουμε την πλευρά του σε ${newSide} cm. Ενώ η περίμετρος διπλασιάζεται από ${perimeter} cm σε ${newPerimeter} cm (ανάλογο ποσό), πόσες φορές μεγαλύτερο γίνεται το εμβαδόν του (από ${area} cm² σε ${newArea} cm²);`,
        unit: 'φορές',
        correctVal: '4',
        correctText: '4 φορές',
        tableData: [
          { item: 'Αρχικό εμβαδόν', formula: `${side} · ${side}`, val: `${area} cm²` },
          { item: 'Νέο εμβαδόν', formula: `${newSide} · ${newSide}`, val: `${newArea} cm²` },
          { item: 'Σχέση μεγεθών', formula: `${newArea} : ${area}`, val: '4 φορές μεγαλύτερο' }
        ],
        explain: `Το εμβαδόν του τετραγώνου ΔΕΝ είναι ανάλογο με το μήκος της πλευράς. Όταν η πλευρά διπλασιάζεται, το εμβαδόν τετραπλασιάζεται: ${newArea} : ${area} ＝ 4 φορές μεγαλύτερο.`,
        distractors: ['2 φορές', '8 φορές', '6 φορές']
      };
    }
  },
  {
    id: 'analoga_hard_3',
    title: 'Κλίμακα Χάρτη ως Συντελεστής Αναλογίας',
    unit: 'km',
    generate: () => {
      const scale = 50000;
      const mapDist = 4.2;
      const realKm = (mapDist * scale) / 100000;
      return {
        prompt: `Σε έναν χάρτη με κλίμακα 1 : 50.000, η απόσταση στον χάρτη και η πραγματική απόσταση είναι ανάλογα ποσά. Αν δύο σημεία απέχουν στον χάρτη ${formatNum(mapDist)} cm, πόσα km είναι η πραγματική τους απόσταση;`,
        unit: 'km',
        correctVal: formatNum(realKm),
        correctText: `${formatNum(realKm)} km`,
        tableData: [
          { item: 'Συντελεστής αναλογίας', formula: '1 cm ➔ 50.000 cm', val: '50.000' },
          { item: 'Πραγματική απόσταση σε cm', formula: `${formatNum(mapDist)} · 50.000`, val: `${mapDist * scale} cm` },
          { item: 'Μετατροπή σε km', formula: `(${mapDist * scale}) : 100.000`, val: `${formatNum(realKm)} km` }
        ],
        explain: `Ο συντελεστής αναλογίας είναι 50.000. Πραγματική απόσταση σε cm: ${formatNum(mapDist)} · 50.000 ＝ ${mapDist * scale} cm. Μετατρέπουμε σε km διαιρώντας με το 100.000: ${mapDist * scale} : 100.000 ＝ ${formatNum(realKm)} km.`,
        distractors: [`${formatNum(realKm + 2.1)} km`, `${formatNum(Math.max(1, realKm - 1))} km`, `${formatNum(realKm * 2)} km`]
      };
    }
  },
  {
    id: 'analoga_hard_4',
    title: 'Ανάλογη Μοιρασιά Ποσού',
    unit: '€',
    generate: () => {
      const totalSum = 360;
      const ratioA = 2;
      const ratioB = 3;
      const ratioC = 4;
      const sumParts = ratioA + ratioB + ratioC;
      const lambdaPart = totalSum / sumParts;
      const maxShare = ratioC * lambdaPart;
      return {
        prompt: `Τρεις κληρονόμοι μοιράζονται ποσό ${totalSum} € ανάλογα με τους συντελεστές ${ratioA}, ${ratioB} και ${ratioC}. Πόσα € έλαβε αυτός που πήρε το μεγαλύτερο μερίδιο;`,
        unit: '€',
        correctVal: String(maxShare),
        correctText: `${maxShare} €`,
        tableData: [
          { item: 'Σύνολο μερών', formula: `${ratioA} ＋ ${ratioB} ＋ ${ratioC}`, val: `${sumParts} μέρη` },
          { item: 'Συντελεστής ανά μερίδιο (λ)', formula: `${totalSum} : ${sumParts}`, val: `${lambdaPart} €` },
          { item: 'Μεγαλύτερο μερίδιο', formula: `${ratioC} · ${lambdaPart}`, val: `${maxShare} €` }
        ],
        explain: `Τα συνολικά μέρη είναι ${ratioA} ＋ ${ratioB} ＋ ${ratioC} ＝ ${sumParts}. Ο συντελεστής ανά μερίδιο είναι λ ＝ ${totalSum} : ${sumParts} ＝ ${lambdaPart} €. Το μεγαλύτερο μερίδιο έχει ${ratioC} μέρη: ${ratioC} · ${lambdaPart} ＝ ${maxShare} €.`,
        distractors: [`${maxShare - lambdaPart} €`, `${maxShare + lambdaPart} €`, `${ratioB * lambdaPart} €`]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions() {
  // Q1: Input - Υπολογισμός συντελεστή αναλογίας λ
  const q1X = randInt(3, 6);
  const q1Lambda = randInt(4, 8);
  const q1Y = q1X * q1Lambda;

  // Q2: MCQ - Έλεγχος αναλογίας σε πίνακα
  const q2Base2 = randInt(5, 8);
  const q2IsAnaloga = Math.random() > 0.4;
  const q2YVals = q2IsAnaloga
    ? [q2Base2, q2Base2 * 2, q2Base2 * 3]
    : [q2Base2, q2Base2 * 2 + 1, q2Base2 * 3];

  const q2CorrectAns = q2IsAnaloga
    ? 'Ναι, γιατί όλα τα πηλίκα y : x είναι ίσα'
    : 'Όχι, γιατί τα πηλίκα y : x δεν παραμένουν σταθερά';
  const q2WrongAns = q2IsAnaloga
    ? 'Όχι, γιατί οι αριθμοί μεγαλώνουν'
    : 'Ναι, γιατί τα ποσά αυξάνονται ταυτόχρονα';
  const q2Options = shuffle([q2CorrectAns, q2WrongAns]);

  // Q3: Input - Συμπλήρωση τιμής y με δεδομένο το λ
  const q3Lambda = randInt(3, 7);
  const q3TargetX = randInt(6, 12);
  const q3ExpectedY = q3Lambda * q3TargetX;

  // Q4: MCQ - Γραφική παράσταση ανάλογων ποσών
  const q4Correct = 'Ευθεία γραμμή που διέρχεται από την αρχή των αξόνων (0, 0)';
  const q4Options = shuffle([
    q4Correct,
    'Καμπύλη γραμμή που ξεκινά από το σημείο (0, 1)',
    'Ευθεία γραμμή που δεν περνάει ποτέ από το σημείο (0, 0)',
    'Τεθλασμένη γραμμή που ανεβοκατεβαίνει'
  ]);

  // Q5: Input - Εύρεση του x όταν δίνεται το y και το λ
  const q5Lambda = randInt(4, 9);
  const q5ExpectedX = randInt(5, 12);
  const q5YVal = q5Lambda * q5ExpectedX;

  // Q6: MCQ - Διάκριση ανάλογων & μη ανάλογων ποσών
  const q6Correct = 'Η ηλικία ενός ανθρώπου και το ύψος του';
  const q6Options = shuffle([
    q6Correct,
    'Τα κιλά των μήλων και το συνολικό κόστος αγοράς τους',
    'Ο χρόνος οδήγησης με σταθερή ταχύτητα και η διανυόμενη απόσταση',
    'Τα λίτρα της βενζίνης και το ποσό πληρωμής στο πρατήριο'
  ]);

  // Q7: Standard Problem (Input)
  const spIndex1 = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q7Data = STANDARD_PROBLEMS_POOL[spIndex1].generate();

  // Q8: Standard Problem (MCQ)
  let spIndex2 = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  while (spIndex2 === spIndex1) spIndex2 = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q8Data = STANDARD_PROBLEMS_POOL[spIndex2].generate();
  const q8Options = shuffle([
    ...new Set([
      q8Data.correctText,
      ...q8Data.distractors
    ])
  ]);

  // Q9: Hard Problem (Input)
  const hpIndex1 = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q9Data = HARD_PROBLEMS_POOL[hpIndex1].generate();

  // Q10: Hard Problem (MCQ)
  let hpIndex2 = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  while (hpIndex2 === hpIndex1) hpIndex2 = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q10Data = HARD_PROBLEMS_POOL[hpIndex2].generate();
  const q10Options = shuffle([
    ...new Set([
      q10Data.correctText,
      ...q10Data.distractors
    ])
  ]);

  return [
    {
      id: 'q1',
      type: 'input',
      inputType: 'number',
      title: 'Εύρεση Συντελεστή Αναλογίας',
      prompt: `Σε δύο ανάλογα ποσά x και y, όταν x ＝ ${q1X}, το y ισούται με ${q1Y}. Ποια είναι η τιμή του συντελεστή αναλογίας λ (λ ＝ y : x);`,
      correct: String(q1Lambda),
      explain: `Ο συντελεστής αναλογίας βρίσκεται διαιρώντας την τιμή του y με την αντίστοιχη τιμή του x: λ ＝ y : x ＝ ${q1Y} : ${q1X} ＝ ${q1Lambda}.`
    },
    {
      id: 'q2',
      type: 'mcq',
      title: 'Έλεγχος Αναλογίας σε Πίνακα',
      prompt: `Είναι τα ποσά x και y ανάλογα όταν για x ＝ [2, 4, 6] οι αντίστοιχες τιμές y είναι [${q2YVals[0]}, ${q2YVals[1]}, ${q2YVals[2]}];`,
      options: q2Options,
      correct: q2CorrectAns,
      explain: `Ελέγχουμε τα πηλίκα y : x. ${q2CorrectAns}.`
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'number',
      title: 'Συμπλήρωση Τιμής Ανάλογου Ποσού',
      prompt: `Δύο ποσά x και y είναι ανάλογα με συντελεστή αναλογίας λ ＝ ${q3Lambda} (δηλαδή y ＝ ${q3Lambda} · x). Αν x ＝ ${q3TargetX}, πόσο είναι το y;`,
      correct: String(q3ExpectedY),
      explain: `Εφαρμόζουμε τη βασική σχέση των ανάλογων ποσών: y ＝ λ · x ＝ ${q3Lambda} · ${q3TargetX} ＝ ${q3ExpectedY}.`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: 'Γραφική Παράσταση Ανάλογων Ποσών',
      prompt: 'Ποια είναι η μορφή της γραφικής παράστασης δύο ανάλογων ποσών σε σύστημα αξόνων;',
      options: q4Options,
      correct: q4Correct,
      explain: 'Η γραφική παράσταση δύο ανάλογων ποσών είναι πάντοτε ευθεία γραμμή που διέρχεται υποχρεωτικά από την αρχή των αξόνων (0, 0), επειδή όταν το πρώτο ποσό είναι 0, και το δεύτερο είναι 0.'
    },
    {
      id: 'q5',
      type: 'input',
      inputType: 'number',
      title: 'Αντίστροφος Υπολογισμός',
      prompt: `Δύο ποσά x και y είναι ανάλογα με συντελεστή λ ＝ ${q5Lambda}. Αν y ＝ ${q5YVal}, ποια είναι η αντίστοιχη τιμή του x;`,
      correct: String(q5ExpectedX),
      explain: `Αφού y ＝ λ · x, έχουμε: x ＝ y : λ ＝ ${q5YVal} : ${q5Lambda} ＝ ${q5ExpectedX}.`
    },
    {
      id: 'q6',
      type: 'mcq',
      title: 'Διάκριση Ανάλογων & Μη Ανάλογων Ποσών',
      prompt: 'Ποιο από τα παρακάτω ζεύγη ποσών ΔΕΝ αποτελεί ζεύγος ανάλογων ποσών;',
      options: q6Options,
      correct: q6Correct,
      explain: 'Όταν η ηλικία ενός ανθρώπου διπλασιάζεται, το ύψος του δεν διπλασιάζεται. Συνεπώς η ηλικία και το ύψος δεν είναι ανάλογα ποσά. Αντίθετα, όλα τα υπόλοιπα ζεύγη είναι ανάλογα ποσά με σταθερό συντελεστή.'
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
      title: `Πρόβλημα: ${q8Data.title}`,
      prompt: q8Data.prompt,
      options: q8Options,
      correct: q8Data.correctText,
      tableData: q8Data.tableData,
      explain: q8Data.explain
    },
    {
      id: 'q9',
      type: 'input',
      inputType: 'decimal',
      title: `Σύνθετο Πρόβλημα: ${q9Data.title}`,
      prompt: q9Data.prompt,
      correct: q9Data.correctVal,
      tableData: q9Data.tableData,
      explain: q9Data.explain
    },
    {
      id: 'q10',
      type: 'mcq',
      title: `Σύνθετο Πρόβλημα: ${q10Data.title}`,
      prompt: q10Data.prompt,
      options: q10Options,
      correct: q10Data.correctText,
      tableData: q10Data.tableData,
      explain: q10Data.explain
    }
  ];
}

// ---------------------------------------------------------
// ΚΥΡΙΟ COMPONENT ΣΕΛΙΔΑΣ
// ---------------------------------------------------------

export default function AnalogaPosaExercisesPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewSet = useCallback(() => {
    const qList = generateQuestions();
    setQuestions(qList);
    const initialAnswers = {};
    qList.forEach(q => {
      initialAnswers[q.id] = '';
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

  // Χειρισμός απαντήσεων: sanitize για inputs, αυτούσιο για mcq
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
      }
      if (sanitized.length > 10) {
        sanitized = sanitized.slice(0, 10);
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
      const cleanUser = userVal.replace(/\./g, ',').replace(/\s+/g, '').replace(/^[xyψχ][=＝]/i, '').trim().toLowerCase();
      const cleanTarget = q.correct.replace(/\./g, ',').replace(/\s+/g, '').replace(/^[xyψχ][=＝]/i, '').trim().toLowerCase();

      if (cleanUser === cleanTarget) return true;

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
      title="Ασκήσεις: Ανάλογα Ποσά - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στα ανάλογα ποσά, τον συντελεστή αναλογίας και τη γραφική παράσταση για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/44-analoga-posa"
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
                <span>ΚΕΦΑΛΑΙΟ 44 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Ανάλογα Ποσά
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στον υπολογισμό του συντελεστή αναλογίας λ, στη συμπλήρωση πινάκων τιμών και στη γραφική παράσταση!
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
                      {q.prompt}
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
                          inputMode={q.inputType === 'decimal' ? 'decimal' : 'numeric'}
                          maxLength={10}
                          disabled={submitted}
                          value={answers[q.id] || ''}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value, 'input')}
                          placeholder={q.inputType === 'decimal' ? 'π.χ. 4,5' : 'Απάντηση...'}
                          className="w-full p-3 bg-white border-2 border-slate-200 rounded-2xl font-bold text-center text-base sm:text-lg focus:border-indigo-500 outline-none disabled:bg-slate-100 font-mono tracking-wider shadow-inner"
                        />
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
