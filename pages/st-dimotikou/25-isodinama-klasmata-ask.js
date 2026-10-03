// pages/st-dimotikou/25-isodinama-klasmata-ask.js
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

function gcd(a, b) {
  let x = Math.abs(a || 0);
  let y = Math.abs(b || 0);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

// Αφαιρεση τονων για κεφαλαια (εξαιρειται το ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  const cleaned = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
  return cleaned.replace(/\bΣΤ\b/g, "ΣΤ'");
}

// Μορφοποιηση αριθμων με ελληνικο locale
function formatNum(num) {
  if (num === null || num === undefined || isNaN(Number(num))) return '0';
  return Number(num).toLocaleString('el-GR');
}

// ---------------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (Q9 & Q10) - "NO-GIVEAWAY" PEDAGOGY
// ---------------------------------------------------------

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'sp1',
    title: 'Μοίρασμα Πίτσας σε Παρέα',
    unit: 'μέρος',
    generate: () => {
      // 4/8 = 1/2
      const origN = 4;
      const origD = 8;
      const redN = 1;
      const redD = 2;
      return {
        prompt: `Σε ένα πάρτι καταναλώθηκαν τα ${origN}/${origD} μιας μεγάλης πίτσας. Ποιο είναι το απλούστερο (ανάγωγο) κλάσμα που εκφράζει την ποσότητα πίτσας που φαγώθηκε;`,
        unit: 'μέρος',
        correctVal: `${redN}/${redD}`,
        correctText: `${redN}/${redD}`,
        tableData: [
          { item: 'Αρχικό κλάσμα', formula: `${origN}/${origD}`, val: `${origN}/${origD}` },
          { item: 'Μ.Κ.Δ.(4, 8)', formula: '4', val: '4' },
          { item: 'Ανάγωγο κλάσμα', formula: `(${origN} : 4) / (${origD} : 4)`, val: `${redN}/${redD}` }
        ],
        explain: `Διαιρούμε και τους δύο όρους με το 4 (Μ.Κ.Δ.): (${origN} : 4) / (${origD} : 4) ＝ ${redN}/${redD} (δηλαδή ακριβώς η μισή πίτσα).`,
        distractors: [`2/${redD}`, `${redN}/4`, `2/3`]
      };
    }
  },
  {
    id: 'sp2',
    title: 'Σοκολάτα σε Τετραγωνάκια',
    unit: 'μέρος',
    generate: () => {
      // 6/9 = 2/3
      const origN = 6;
      const origD = 9;
      const redN = 2;
      const redD = 3;
      return {
        prompt: `Ο Κώστας μοίρασε τα ${origN}/${origD} μιας σοκολάτας στους συμμαθητές του. Ποιο είναι το ισοδύναμο ανάγωγο κλάσμα της σοκολάτας που μοιράστηκε;`,
        unit: 'μέρος',
        correctVal: `${redN}/${redD}`,
        correctText: `${redN}/${redD}`,
        tableData: [
          { item: 'Αρχικό κλάσμα', formula: `${origN}/${origD}`, val: `${origN}/${origD}` },
          { item: 'Μ.Κ.Δ.(6, 9)', formula: '3', val: '3' },
          { item: 'Ανάγωγο κλάσμα', formula: `(${origN} : 3) / (${origD} : 3)`, val: `${redN}/${redD}` }
        ],
        explain: `Απλοποιούμε διαιρώντας αριθμητή και παρονομαστή με το 3: (${origN} : 3) / (${origD} : 3) ＝ ${redN}/${redD}.`,
        distractors: [`1/3`, `3/4`, `2/5`]
      };
    }
  },
  {
    id: 'sp3',
    title: 'Σελίδες Βιβλίου',
    unit: 'μέρος',
    generate: () => {
      // 8/12 = 2/3
      const origN = 8;
      const origD = 12;
      const redN = 2;
      const redD = 3;
      return {
        prompt: `Η Ελένη διάβασε τα ${origN}/${origD} των κεφαλαίων ενός βιβλίου ιστορίας. Ποιο είναι το απλούστερο ισοδύναμο κλάσμα που δείχνει το μέρος των κεφαλαίων που διάβασε;`,
        unit: 'μέρος',
        correctVal: `${redN}/${redD}`,
        correctText: `${redN}/${redD}`,
        tableData: [
          { item: 'Αρχικό κλάσμα', formula: `${origN}/${origD}`, val: `${origN}/${origD}` },
          { item: 'Μ.Κ.Δ.(8, 12)', formula: '4', val: '4' },
          { item: 'Ανάγωγο κλάσμα', formula: `(${origN} : 4) / (${origD} : 4)`, val: `${redN}/${redD}` }
        ],
        explain: `Διαιρούμε και τους δύο όρους με το 4 (Μ.Κ.Δ.): (${origN} : 4) / (${origD} : 4) ＝ ${redN}/${redD}.`,
        distractors: [`4/6`, `1/2`, `3/4`]
      };
    }
  },
  {
    id: 'sp4',
    title: 'Κήπος με Λουλούδια',
    unit: 'μέρος',
    generate: () => {
      // 6/10 = 3/5
      const origN = 6;
      const origD = 10;
      const redN = 3;
      const redD = 5;
      return {
        prompt: `Σε έναν σχολικό κήπο φυτεύτηκαν τριανταφυλλιές στα ${origN}/${origD} της συνολικής του επιφάνειας. Ποιο ανάγωγο κλάσμα αντιπροσωπεύει αυτή την επιφάνεια;`,
        unit: 'μέρος',
        correctVal: `${redN}/${redD}`,
        correctText: `${redN}/${redD}`,
        tableData: [
          { item: 'Αρχικό κλάσμα', formula: `${origN}/${origD}`, val: `${origN}/${origD}` },
          { item: 'Μ.Κ.Δ.(6, 10)', formula: '2', val: '2' },
          { item: 'Ανάγωγο κλάσμα', formula: `(${origN} : 2) / (${origD} : 2)`, val: `${redN}/${redD}` }
        ],
        explain: `Απλοποιούμε με το 2: (${origN} : 2) / (${origD} : 2) ＝ ${redN}/${redD}.`,
        distractors: [`2/5`, `3/10`, `4/5`]
      };
    }
  },
  {
    id: 'sp5',
    title: 'Κομμάτια Παζλ',
    unit: 'μέρος',
    generate: () => {
      // 9/12 = 3/4
      const origN = 9;
      const origD = 12;
      const redN = 3;
      const redD = 4;
      return {
        prompt: `Ο Μάριος συμπλήρωσε τα ${origN}/${origD} ενός μεγάλου παζλ. Ποιο είναι το απλούστερο ισοδύναμο κλάσμα για το μέρος του παζλ που ολοκληρώθηκε;`,
        unit: 'μέρος',
        correctVal: `${redN}/${redD}`,
        correctText: `${redN}/${redD}`,
        tableData: [
          { item: 'Αρχικό κλάσμα', formula: `${origN}/${origD}`, val: `${origN}/${origD}` },
          { item: 'Μ.Κ.Δ.(9, 12)', formula: '3', val: '3' },
          { item: 'Ανάγωγο κλάσμα', formula: `(${origN} : 3) / (${origD} : 3)`, val: `${redN}/${redD}` }
        ],
        explain: `Διαιρούμε και τους δύο όρους με το 3: (${origN} : 3) / (${origD} : 3) ＝ ${redN}/${redD}.`,
        distractors: [`2/3`, `3/6`, `1/4`]
      };
    }
  },
  {
    id: 'sp6',
    title: 'Αθλητική Διαδρομή',
    unit: 'μέρος',
    generate: () => {
      // 4/16 = 1/4
      const origN = 4;
      const origD = 16;
      const redN = 1;
      const redD = 4;
      return {
        prompt: `Ένας δρομέας έχει καλύψει τα ${origN}/${origD} της συνολικής διαδρομής ενός αγώνα. Ποιο είναι το ανάγωγο κλάσμα της διαδρομής που διένυσε;`,
        unit: 'μέρος',
        correctVal: `${redN}/${redD}`,
        correctText: `${redN}/${redD}`,
        tableData: [
          { item: 'Αρχικό κλάσμα', formula: `${origN}/${origD}`, val: `${origN}/${origD}` },
          { item: 'Μ.Κ.Δ.(4, 16)', formula: '4', val: '4' },
          { item: 'Ανάγωγο κλάσμα', formula: `(${origN} : 4) / (${origD} : 4)`, val: `${redN}/${redD}` }
        ],
        explain: `Διαιρούμε αριθμητή και παρονομαστή με το 4: (${origN} : 4) / (${origD} : 4) ＝ ${redN}/${redD}.`,
        distractors: [`2/8`, `1/8`, `1/2`]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'hp1',
    title: 'Διεύρυνση Κλάσματος για Συνταγή',
    unit: 'ισοδύναμο',
    generate: () => {
      // 3/5 με πολλαπλασιαστή 4 -> 12/20
      const baseN = 3;
      const baseD = 5;
      const mult = 4;
      const targetN = baseN * mult;
      const targetD = baseD * mult;
      return {
        prompt: `Σε μία συνταγή ζαχαροπλαστικής χρειαζόμαστε τα ${baseN}/${baseD} του κιλού ζάχαρη. Αν θέλουμε να εκφράσουμε το κλάσμα με παρονομαστή το ${targetD}, ποιος πρέπει να είναι ο νέος αριθμητής x ώστε να διατηρηθεί η ισοδυναμία (${baseN}/${baseD} ＝ x/${targetD});`,
        unit: '',
        correctVal: String(targetN),
        correctText: `${targetN} (κλάσμα: ${targetN}/${targetD})`,
        tableData: [
          { item: 'Αρχικό κλάσμα', formula: `${baseN}/${baseD}`, val: `${baseN}/${baseD}` },
          { item: 'Πολλαπλασιαστής παρονομαστή', formula: `${targetD} : ${baseD}`, val: `${mult}` },
          { item: 'Νέος αριθμητής (x)', formula: `${baseN} · ${mult}`, val: `${targetN}` }
        ],
        explain: `Ο παρονομαστής πολλαπλασιάστηκε επί ${mult} (${baseD} · ${mult} ＝ ${targetD}). Για να μείνει το κλάσμα ισοδύναμο, πολλαπλασιάζουμε και τον αριθμητή επί ${mult}: ${baseN} · ${mult} ＝ ${targetN}.`,
        distractors: [String(targetN + 2), String(targetN - 2), String(targetN * 2)]
      };
    }
  },
  {
    id: 'hp2',
    title: 'Απλοποίηση με Μεγάλο Μ.Κ.Δ.',
    unit: 'ανάγωγο',
    generate: () => {
      // 24/36 -> ΜΚΔ=12 -> 2/3
      const origN = 24;
      const origD = 36;
      const commonGcd = 12;
      const redN = 2;
      const redD = 3;
      return {
        prompt: `Ένα σχολικό εργαστήριο κατέγραψε επιτυχία σε ${origN}/${origD} πειράματα. Ποιο είναι το απλούστερο ανάγωγο κλάσμα που προκύπτει αν απλοποιήσουμε άμεσα με τον Μ.Κ.Δ. των όρων;`,
        unit: 'κλάσμα',
        correctVal: `${redN}/${redD}`,
        correctText: `${redN}/${redD} (Μ.Κ.Δ. ＝ ${commonGcd})`,
        tableData: [
          { item: 'Αρχικό κλάσμα', formula: `${origN}/${origD}`, val: `${origN}/${origD}` },
          { item: 'Μ.Κ.Δ.(24, 36)', formula: `${commonGcd}`, val: `${commonGcd}` },
          { item: 'Ανάγωγο κλάσμα', formula: `(${origN} : ${commonGcd}) / (${origD} : ${commonGcd})`, val: `${redN}/${redD}` }
        ],
        explain: `Ο Μέγιστος Κοινός Διαιρέτης του ${origN} και του ${origD} είναι το ${commonGcd}. Διαιρώντας και τους δύο όρους με το ${commonGcd} παίρνουμε άμεσα το ανάγωγο κλάσμα ${redN}/${redD}.`,
        distractors: [`4/6`, `6/9`, `3/4`]
      };
    }
  },
  {
    id: 'hp3',
    title: 'Σύγκριση Ισοδύναμων Ποσοτήτων',
    unit: '',
    generate: () => {
      // 2/3 vs 8/12 vs 10/15
      const n1 = 2;
      const d1 = 3;
      const n2 = 8;
      const d2 = 12;
      const n3 = 10;
      const d3 = 15;
      return {
        prompt: `Δίνονται τρία κλάσματα που εκφράζουν το μέρος τριών διαφορετικών δεξαμενών: Α ＝ ${n1}/${d1}, Β ＝ ${n2}/${d2} και Γ ＝ ${n3}/${d3}. Ποια είναι η σχέση μεταξύ των ποσοτήτων τους;`,
        unit: '',
        correctVal: 'Και τα τρία κλάσματα είναι απολύτως ισοδύναμα (Α ＝ Β ＝ Γ)',
        correctText: 'Και τα τρία κλάσματα είναι απολύτως ισοδύναμα (Α ＝ Β ＝ Γ)',
        tableData: [
          { item: `Κλάσμα Α (${n1}/${d1})`, formula: 'Ανάγωγη μορφή', val: `${n1}/${d1}` },
          { item: `Κλάσμα Β (${n2}/${d2})`, formula: `Απλοποίηση με 4`, val: `${n1}/${d1}` },
          { item: `Κλάσμα Γ (${n3}/${d3})`, formula: `Απλοποίηση με 5`, val: `${n1}/${d1}` }
        ],
        explain: `Απλοποιώντας το Β με το 4 παίρνουμε ${n1}/${d1}. Απλοποιώντας το Γ με το 5 παίρνουμε επίσης ${n1}/${d1}. Επομένως, και τα τρία κλάσματα είναι ισοδύναμα μεταξύ τους (Α ＝ Β ＝ Γ).`,
        distractors: [
          'Το Α είναι μεγαλύτερο από το Β και το Γ',
          'Το Γ είναι το μεγαλύτερο από όλα',
          'Μόνο τα Α και Β είναι ισοδύναμα'
        ]
      };
    }
  },
  {
    id: 'hp4',
    title: 'Εύρεση Άγνωστου Παρονομαστή',
    unit: '',
    generate: () => {
      // 4/7 = 20/y -> y = 35
      const baseN = 4;
      const baseD = 7;
      const mult = 5;
      const targetN = baseN * mult;
      const targetD = baseD * mult;
      return {
        prompt: `Στην ισότητα ισοδύναμων κλασμάτων ${baseN}/${baseD} ＝ ${targetN}/y, ποιος είναι ο άγνωστος παρονομαστής y;`,
        unit: '',
        correctVal: String(targetD),
        correctText: String(targetD),
        tableData: [
          { item: 'Αρχικό κλάσμα', formula: `${baseN}/${baseD}`, val: `${baseN}/${baseD}` },
          { item: 'Πολλαπλασιαστής αριθμητή', formula: `${targetN} : ${baseN}`, val: `${mult}` },
          { item: 'Άγνωστος παρονομαστής (y)', formula: `${baseD} · ${mult}`, val: `${targetD}` }
        ],
        explain: `Ο αριθμητής πολλαπλασιάστηκε επί ${mult} (${baseN} · ${mult} ＝ ${targetN}). Επομένως και ο παρονομαστής πρέπει να πολλαπλασιαστεί επί ${mult}: y ＝ ${baseD} · ${mult} ＝ ${targetD}.`,
        distractors: [String(targetD - 5), String(targetD + 7), String(targetD + 2)]
      };
    }
  },
  {
    id: 'hp5',
    title: 'Απλοποίηση Μεγάλου Κλάσματος (Βήμα-Βήμα)',
    unit: 'ανάγωγο',
    generate: () => {
      // 30/45 -> ΜΚΔ=15 -> 2/3
      const origN = 30;
      const origD = 45;
      const commonGcd = 15;
      const redN = 2;
      const redD = 3;
      return {
        prompt: `Ένα δοχείο περιέχει ${origN}/${origD} του λίτρου λάδι. Ποιο είναι το ανάγωγο κλάσμα που προκύπτει αν απλοποιήσουμε το κλάσμα με τον Μ.Κ.Δ. των όρων του;`,
        unit: 'κλάσμα',
        correctVal: `${redN}/${redD}`,
        correctText: `${redN}/${redD}`,
        tableData: [
          { item: 'Αρχικό κλάσμα', formula: `${origN}/${origD}`, val: `${origN}/${origD}` },
          { item: 'Μ.Κ.Δ.(30, 45)', formula: `${commonGcd}`, val: `${commonGcd}` },
          { item: 'Ανάγωγο κλάσμα', formula: `(${origN} : ${commonGcd}) / (${origD} : ${commonGcd})`, val: `${redN}/${redD}` }
        ],
        explain: `Ο Μ.Κ.Δ.(30, 45) είναι το 15. Διαιρούμε και τους δύο όρους με το 15: (${origN} : 15) / (${origD} : 15) ＝ ${redN}/${redD}.`,
        distractors: [`6/9`, `10/15`, `3/5`]
      };
    }
  },
  {
    id: 'hp6',
    title: 'Σύνθετος Έλεγχος Ανάγωγου',
    unit: '',
    generate: () => {
      const properRed = '11/15'; // gcd = 1
      const wr1 = '12/15'; // gcd = 3
      const wr2 = '10/25'; // gcd = 5
      const wr3 = '14/21'; // gcd = 7
      return {
        prompt: `Ποιο από τα παρακάτω κλάσματα είναι ήδη ανάγωγο (δεν μπορεί να διαιρεθεί με κανέναν κοινό διαιρέτη εκτός του 1);`,
        unit: '',
        correctVal: properRed,
        correctText: `${properRed} (Μ.Κ.Δ. ＝ 1)`,
        tableData: [
          { item: `12/15`, formula: `Διαιρείται με το 3`, val: `4/5` },
          { item: `10/25`, formula: `Διαιρείται με το 5`, val: `2/5` },
          { item: `14/21`, formula: `Διαιρείται με το 7`, val: `2/3` },
          { item: `${properRed}`, formula: `Μ.Κ.Δ.(11, 15) ＝ 1`, val: `Ανάγωγο` }
        ],
        explain: `Οι αριθμοί 11 και 15 δεν έχουν κανέναν κοινό διαιρέτη εκτός του 1 (Μ.Κ.Δ. ＝ 1), άρα το ${properRed} είναι ανάγωγο.`,
        distractors: [wr1, wr2, wr3]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions() {
  // Q1: Input - Εύρεση άγνωστου αριθμητή σε ισοδύναμα κλάσματα (π.χ. 2/3 = x/12)
  const q1BaseNum = randInt(1, 4);
  const q1BaseDen = randInt(q1BaseNum + 1, 6);
  const q1Mult = randInt(2, 5);
  const q1TargetDen = q1BaseDen * q1Mult;
  const q1Correct = String(q1BaseNum * q1Mult);

  // Q2: Input - Μετατροπή κλάσματος σε ανάγωγο (π.χ. 6/8 -> 3/4)
  const q2RedNum = randInt(1, 4);
  let q2RedDen = randInt(q2RedNum + 1, 6);
  while (gcd(q2RedNum, q2RedDen) !== 1) {
    q2RedDen++;
  }
  const q2CommonFactor = [2, 3, 4, 5][randInt(0, 3)];
  const q2OrigNum = q2RedNum * q2CommonFactor;
  const q2OrigDen = q2RedDen * q2CommonFactor;
  const q2Correct = `${q2RedNum}/${q2RedDen}`;

  // Q3: MCQ - Ποιο από τα παρακάτω κλάσματα είναι ισοδύναμο με το δοθέν
  const q3BaseN = randInt(1, 3);
  const q3BaseD = randInt(q3BaseN + 1, 5);
  const q3GoodMult = randInt(2, 4);
  const q3CorrectStr = `${q3BaseN * q3GoodMult}/${q3BaseD * q3GoodMult}`;
  const q3Wrongs = [
    `${q3BaseN * q3GoodMult + 1}/${q3BaseD * q3GoodMult}`,
    `${q3BaseN * q3GoodMult}/${q3BaseD * q3GoodMult + 1}`,
    `${q3BaseN + 2}/${q3BaseD + 2}`
  ];
  const q3Options = shuffle([...new Set([q3CorrectStr, ...q3Wrongs])]);

  // Q4: MCQ - Ποιο κλάσμα είναι ήδη ανάγωγο (δεν απλοποιείται άλλο)
  const irreducibleList = [
    { num: 3, den: 5 },
    { num: 2, den: 7 },
    { num: 4, den: 9 },
    { num: 5, den: 8 },
    { num: 7, den: 10 }
  ];
  const reducibleList = [
    { num: 4, den: 6 },
    { num: 6, den: 9 },
    { num: 10, den: 15 },
    { num: 8, den: 12 },
    { num: 14, den: 21 }
  ];
  const q4ChosenIrred = irreducibleList[randInt(0, irreducibleList.length - 1)];
  const q4WrongsRed = shuffle(reducibleList).slice(0, 3);
  const q4CorrectStr = `${q4ChosenIrred.num}/${q4ChosenIrred.den}`;
  const q4Options = shuffle([
    ...new Set([q4CorrectStr, ...q4WrongsRed.map(r => `${r.num}/${r.den}`)])
  ]);

  // Q5: True/False - Ορισμός ισοδύναμων κλασμάτων
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? 'Δύο ισοδύναμα κλάσματα εκφράζουν την ίδια ακριβώς ποσότητα ή αξία.'
    : 'Δύο ισοδύναμα κλάσματα έχουν υποχρεωτικά τον ίδιο αριθμητή και τον ίδιο παρονομαστή.';

  // Q6: True/False - Κανόνας δημιουργίας ισοδυνάμων
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? 'Αν πολλαπλασιάσουμε και τον αριθμητή και τον παρονομαστή με τον ίδιο φυσικό αριθμό (≠ 0), προκύπτει ισοδύναμο κλάσμα.'
    : 'Αν προσθέσουμε τον ίδιο αριθμό στον αριθμητή και στον παρονομαστή, προκύπτει πάντοτε ισοδύναμο κλάσμα.';

  // Q7: Input - Με ποιον αριθμό πρέπει να διαιρέσουμε (Μ.Κ.Δ.) για να γίνει ανάγωγο
  const q7Common = [2, 3, 4, 5, 6][randInt(0, 4)];
  const q7SimpleN = randInt(1, 3);
  let q7SimpleD = randInt(q7SimpleN + 1, 5);
  while (gcd(q7SimpleN, q7SimpleD) !== 1) {
    q7SimpleD++;
  }
  const q7Num = q7SimpleN * q7Common;
  const q7Den = q7SimpleD * q7Common;
  const q7Correct = String(q7Common);

  // Q8: MCQ - Πράξη απλοποίησης
  const q8Pool = [
    {
      prompt: 'Πώς ονομάζεται η διαδικασία κατά την οποία διαιρούμε και τους δύο όρους ενός κλάσματος με τον ίδιο αριθμό;',
      correct: 'Απλοποίηση',
      wrong: ['Διαπλάτυνση', 'Πρόσθεση', 'Αφαίρεση'],
      explain: 'Η διαίρεση και των δύο όρων με τον ίδιο αριθμό ονομάζεται απλοποίηση του κλάσματος.'
    },
    {
      prompt: 'Πότε ένα κλάσμα ονομάζεται ανάγωγο;',
      correct: 'Όταν ο αριθμητής και ο παρονομαστής έχουν Μ.Κ.Δ. ίσο με το 1',
      wrong: [
        'Όταν ο αριθμητής είναι ίσος με το 1',
        'Όταν ο παρονομαστής είναι άρτιος αριθμός',
        'Όταν ο αριθμητής είναι μεγαλύτερος από τον παρονομαστή'
      ],
      explain: 'Ανάγωγο είναι το κλάσμα που δεν μπορεί να απλοποιηθεί άλλο, δηλαδή όταν οι όροι του έχουν Μ.Κ.Δ. ίσο με το 1.'
    }
  ];
  const q8Data = q8Pool[randInt(0, q8Pool.length - 1)];
  const q8Options = shuffle([...new Set([q8Data.correct, ...q8Data.wrong])]);

  // Q9: Standard Problem (Pool of 6)
  const spIndex = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q9Raw = STANDARD_PROBLEMS_POOL[spIndex].generate();
  const q9Options = shuffle([
    ...new Set([q9Raw.correctText, ...q9Raw.distractors])
  ]);

  // Q10: Hard Problem (Pool of 6)
  const hpIndex = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q10Raw = HARD_PROBLEMS_POOL[hpIndex].generate();
  const q10Options = shuffle([
    ...new Set([q10Raw.correctText, ...q10Raw.distractors])
  ]);

  return [
    {
      id: 'q1',
      type: 'input',
      title: 'Εύρεση Άγνωστου Όρου',
      prompt: `Βρες τον αριθμητή x ώστε τα κλάσματα να είναι ισοδύναμα: ${q1BaseNum}/${q1BaseDen} ＝ x/${q1TargetDen}`,
      correct: q1Correct,
      explain: `Ο παρονομαστής πολλαπλασιάστηκε επί ${q1Mult} (${q1BaseDen} · ${q1Mult} ＝ ${q1TargetDen}), άρα και ο αριθμητής γίνεται ${q1BaseNum} · ${q1Mult} ＝ ${q1Correct}.`
    },
    {
      id: 'q2',
      type: 'input',
      title: 'Απλοποίηση σε Ανάγωγο',
      prompt: `Απλοποίησε το κλάσμα ${q2OrigNum}/${q2OrigDen} στην ανάγωγη μορφή του (π.χ. 3/4):`,
      correct: q2Correct,
      explain: `Διαιρούμε και τους δύο όρους με το ${q2CommonFactor} (Μ.Κ.Δ.): (${q2OrigNum} : ${q2CommonFactor}) / (${q2OrigDen} : ${q2CommonFactor}) ＝ ${q2Correct}.`
    },
    {
      id: 'q3',
      type: 'mcq',
      title: 'Αναγνώριση Ισοδύναμου',
      prompt: `Ποιο από τα παρακάτω κλάσματα είναι ισοδύναμο με το ${q3BaseN}/${q3BaseD};`,
      options: q3Options,
      correct: q3CorrectStr,
      explain: `Πολλαπλασιάζοντας τους όρους του ${q3BaseN}/${q3BaseD} επί ${q3GoodMult} προκύπτει το ${q3CorrectStr}.`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: 'Εντοπισμός Ανάγωγου Κλάσματος',
      prompt: `Ποιο από τα παρακάτω κλάσματα είναι ανάγωγο (δεν μπορεί να απλοποιηθεί άλλο);`,
      options: q4Options,
      correct: q4CorrectStr,
      explain: `Στο κλάσμα ${q4CorrectStr}, ο αριθμητής και ο παρονομαστής έχουν Μ.Κ.Δ. το 1 (είναι πρώτοι μεταξύ τους), άρα είναι ανάγωγο.`
    },
    {
      id: 'q5',
      type: 'tf',
      title: 'Έννοια Ισοδυναμίας',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? 'Σωστά! Τα ισοδύναμα κλάσματα εκφράζουν ακριβώς την ίδια ποσότητα.'
        : 'Λάθος! Τα ισοδύναμα κλάσματα έχουν συνήθως διαφορετικούς όρους (π.χ. 1/2 ＝ 2/4 ＝ 4/8).'
    },
    {
      id: 'q6',
      type: 'tf',
      title: 'Κανόνας Ισοδυναμίας',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Σωστά! Δημιουργούμε ισοδύναμα κλάσματα πολλαπλασιάζοντας ή διαιρώντας και τους δύο όρους με τον ίδιο αριθμό (≠ 0).'
        : 'Λάθος! Με την πρόσθεση ΔΕΝ διατηρείται η ισοδυναμία (π.χ. 1/2 ≠ (1＋2)/(2＋2) ＝ 3/4).'
    },
    {
      id: 'q7',
      type: 'input',
      title: 'Μ.Κ.Δ. Απλοποίησης',
      prompt: `Με ποιον αριθμό (Μ.Κ.Δ.) πρέπει να διαιρέσουμε τους όρους του κλάσματος ${q7Num}/${q7Den} ώστε να γίνει αμέσως ανάγωγο;`,
      correct: q7Correct,
      explain: `Ο Μέγιστος Κοινός Διαιρέτης του ${q7Num} και του ${q7Den} είναι το ${q7Correct}.`
    },
    {
      id: 'q8',
      type: 'mcq',
      title: 'Ορολογία & Ιδιότητες',
      prompt: q8Data.prompt,
      options: q8Options,
      correct: q8Data.correct,
      explain: q8Data.explain
    },
    {
      id: 'q9',
      type: 'mcq',
      title: `Πρόβλημα: ${STANDARD_PROBLEMS_POOL[spIndex].title}`,
      prompt: q9Raw.prompt,
      options: q9Options,
      correct: q9Raw.correctText,
      tableData: q9Raw.tableData,
      explain: q9Raw.explain
    },
    {
      id: 'q10',
      type: 'mcq',
      title: `Σύνθετο Πρόβλημα: ${HARD_PROBLEMS_POOL[hpIndex].title}`,
      prompt: q10Raw.prompt,
      options: q10Options,
      correct: q10Raw.correctText,
      tableData: q10Raw.tableData,
      explain: q10Raw.explain
    }
  ];
}

// ---------------------------------------------------------
// ΚΥΡΙΟ COMPONENT ΣΕΛΙΔΑΣ
// ---------------------------------------------------------

export default function IsodinamaKlasmataExercisesPage() {
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

  const handleInputChange = (id, val) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [id]: val }));
  };

  const isQuestionCorrect = (q) => {
    const userVal = answers[q.id];
    if (q.type === 'input') {
      if (typeof userVal !== 'string') return false;
      const cleanUser = userVal.replace(/\s+/g, '').trim().toLowerCase();
      const cleanTarget = q.correct.replace(/\s+/g, '').trim().toLowerCase();
      return cleanUser === cleanTarget;
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

  return (
    <Layout
      title="Ασκήσεις: Ισοδύναμα & Ανάγωγα Κλάσματα - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στα ισοδύναμα και ανάγωγα κλάσματα για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/25-isodinama-klasmata"
          className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border border-blue-200 transition shrink-0"
        >
          <span>📖</span>
          <span>{toCleanUppercase('Θεωρία')}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-32 overflow-x-hidden space-y-8">
        
        {/* HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-sky-200">
                <span>ΚΕΦΑΛΑΙΟ 25 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Ισοδύναμα &amp; Ανάγωγα Κλάσματα
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στη δημιουργία ισοδύναμων, στην απλοποίηση με Μ.Κ.Δ. και στον εντοπισμό αναγώγων κλασμάτων!
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
                              onClick={() => handleInputChange(q.id, opt)}
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
                          type="text"
                          inputMode="text"
                          disabled={submitted}
                          value={answers[q.id] || ''}
                          onChange={(e) => handleInputChange(q.id, e.target.value)}
                          placeholder="Γράψε την απάντησή σου..."
                          className="w-full p-3 bg-white border-2 border-slate-200 rounded-2xl font-bold text-center text-base sm:text-lg focus:border-indigo-500 outline-none disabled:bg-slate-100 font-mono tracking-wider shadow-inner"
                        />
                      </div>
                    )}

                    {q.type === 'tf' && (
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <button
                          type="button"
                          disabled={submitted}
                          onClick={() => handleInputChange(q.id, true)}
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
                          onClick={() => handleInputChange(q.id, false)}
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
              <span>{toCleanUppercase('Σκορ')}:</span>
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
