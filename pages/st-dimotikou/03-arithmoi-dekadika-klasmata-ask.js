// pages/st-dimotikou/03-arithmoi-dekadika-klasmata-ask.js
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Συναρτηση αφαιρεσης τονων για κεφαλαια (εξαιρειται το ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
}

// Τυχαιος ακεραιος στο [min, max]
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Ανακατεμα πινακα
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Μορφοποιηση αριθμου (ακεραιος η δεκαδικος με κομμα)
function formatNum(val, decimals = 3) {
  if (Number.isInteger(val)) return String(val);
  const rounded = Number(val.toFixed(decimals));
  return String(rounded).replace('.', ',');
}

// Διευρυμενη Δεξαμενη Κανονικων Προβληματων (για Q9 Input)
const STANDARD_PROBLEMS_POOL = [
  {
    id: 'p_klasm_std_1',
    generate: () => {
      const parts = 100;
      const shaded = randInt(25, 75);
      const decVal = Number((shaded / parts).toFixed(2));
      return {
        title: 'ΕΡΩΤΗΣΗ 9 • ΧΡΩΜΑΤΙΣΜΕΝΟ ΜΕΡΟΣ ΜΟΝΑΔΑΣ',
        instruction: 'Γράψτε τον δεκαδικό αριθμό με κόμμα:',
        text: `Σε ένα τετράγωνο χωρισμένο σε 100 ίσα τετραγωνάκια, χρωματίστηκαν τα ${shaded}. Ποιος δεκαδικός αριθμός εκφράζει το χρωματισμένο μέρος της μονάδας;`,
        tableData: { col1: 'Χρωματισμένα', col2: 'Συνολικά', r1: [`${shaded}`, `${parts}`], r2: ['Δεκαδικό Κλάσμα', `${shaded}/${parts}`] },
        correctVal: decVal,
        correctStr: formatNum(decVal, 2),
        explanation: `Το χρωματισμένο μέρος είναι ${shaded}/100 ＝ ${formatNum(decVal, 2)}.`
      };
    }
  },
  {
    id: 'p_klasm_std_2',
    generate: () => {
      const bottles = 10;
      const fracNumer = randInt(6, 9);
      const capacityL = fracNumer / 10;
      const totalL = Number((bottles * capacityL).toFixed(1));
      return {
        title: 'ΕΡΩΤΗΣΗ 9 • ΣΥΝΟΛΙΚΟΣ ΟΓΚΟΣ ΧΥΜΟΥ',
        instruction: 'Συμπληρώστε τα συνολικά λίτρα (L) με κόμμα:',
        text: `Γεμίσαμε ${bottles} μπουκάλια με χυμό. Κάθε μπουκάλι χωράει ${fracNumer}/10 του λίτρου. Πόσα λίτρα (L) χυμού χρησιμοποιήσαμε συνολικά;`,
        tableData: { col1: 'Μπουκάλια', col2: 'Χωρητικότητα', r1: [`${bottles} μπουκάλια`, `${fracNumer}/10 L ＝ ${formatNum(capacityL, 1)} L`], r2: ['Πολλαπλασιασμός', `${formatNum(totalL, 1)} L`] },
        correctVal: totalL,
        correctStr: formatNum(totalL, 1),
        explanation: `${fracNumer}/10 του λίτρου ισούται με ${formatNum(capacityL, 1)} L. Για 10 μπουκάλια: 10 · ${formatNum(capacityL, 1)} ＝ ${formatNum(totalL, 1)} L.`
      };
    }
  },
  {
    id: 'p_klasm_std_3',
    generate: () => {
      const tenths = randInt(115, 185);
      const ribbonM = Number((tenths / 100).toFixed(2));
      const fracNum = tenths;
      const fracDen = 100;
      return {
        title: 'ΕΡΩΤΗΣΗ 9 • ΑΡΙΘΜΗΤΗΣ ΔΕΚΑΔΙΚΟΥ ΚΛΑΣΜΑΤΟΣ',
        instruction: 'Συμπληρώστε τον αριθμητή του δεκαδικού κλάσματος (ακέραιος):',
        text: `Μια κορδέλα έχει μήκος ${formatNum(ribbonM)} m. Ποιος είναι ο αριθμητής του δεκαδικού κλάσματος με παρονομαστή το 100 που ισούται με το μήκος της κορδέλας;`,
        tableData: { col1: 'Μήκος', col2: 'Παρονομαστής', r1: [`${formatNum(ribbonM)} m`, `${fracDen}`], r2: ['Αριθμητής', `${fracNum}`] },
        correctVal: fracNum,
        correctStr: String(fracNum),
        explanation: `Ο αριθμός ${formatNum(ribbonM)} έχει 2 δεκαδικά ψηφία, άρα γράφεται ως ${fracNum}/${fracDen}. Ο αριθμητής είναι ${fracNum}.`
      };
    }
  },
  {
    id: 'p_klasm_std_4',
    generate: () => {
      const sackKg = randInt(25, 85);
      const decKg = Number((sackKg / 10).toFixed(1));
      return {
        title: 'ΕΡΩΤΗΣΗ 9 • ΜΕΤΑΤΡΟΠΗ ΒΑΡΟΥΣ ΣΕ ΔΕΚΑΔΙΚΟ',
        instruction: 'Γράψτε το βάρος ως δεκαδικό αριθμό σε κιλά (kg) με κόμμα:',
        text: `Ένα σακί περιέχει ${sackKg}/10 του κιλού αλεύρι. Ποιος δεκαδικός αριθμός σε κιλά (kg) αντιστοιχεί σε αυτή την ποσότητα;`,
        tableData: { col1: 'Δεκαδικό Κλάσμα', col2: 'Δεκαδική Μορφή', r1: [`${sackKg}/10 kg`, 'Διαίρεση με 10'], r2: ['Αποτέλεσμα', `${formatNum(decKg, 1)} kg`] },
        correctVal: decKg,
        correctStr: formatNum(decKg, 1),
        explanation: `${sackKg}/10 ＝ ${sackKg} : 10 ＝ ${formatNum(decKg, 1)} kg.`
      };
    }
  },
  {
    id: 'p_klasm_std_5',
    generate: () => {
      const wireM = randInt(12, 48);
      const decM = Number((wireM / 100).toFixed(2));
      return {
        title: 'ΕΡΩΤΗΣΗ 9 • ΜΗΚΟΣ ΣΥΡΜΑΤΟΣ',
        instruction: 'Γράψτε το μήκος ως δεκαδικό αριθμό σε μέτρα (m) με κόμμα:',
        text: `Ένα κομμάτι σύρματος έχει μήκος ${wireM}/100 του μέτρου. Ποιος δεκαδικός αριθμός σε μέτρα (m) εκφράζει το μήκος του σύρματος;`,
        tableData: { col1: 'Δεκαδικό Κλάσμα', col2: 'Δεκαδικός Αριθμός', r1: [`${wireM}/100 m`, '2 δεκαδικά ψηφία'], r2: ['Αποτέλεσμα', `${formatNum(decM, 2)} m`] },
        correctVal: decM,
        correctStr: formatNum(decM, 2),
        explanation: `${wireM}/100 ＝ ${wireM} : 100 ＝ ${formatNum(decM, 2)} m.`
      };
    }
  },
  {
    id: 'p_klasm_std_6',
    generate: () => {
      const thousands = randInt(125, 875);
      const decKm = Number((thousands / 1000).toFixed(3));
      return {
        title: 'ΕΡΩΤΗΣΗ 9 • ΑΠΟΣΤΑΣΗ ΣΕ ΧΙΛΙΟΜΕΤΡΑ',
        instruction: 'Γράψτε την απόσταση ως δεκαδικό αριθμό σε χιλιόμετρα (km) με κόμμα:',
        text: `Μια διαδρομή έχει μήκος ${thousands}/1.000 του χιλιομέτρου. Ποιος δεκαδικός αριθμός σε χιλιόμετρα (km) ισούται με τη διαδρομή αυτή;`,
        tableData: { col1: 'Δεκαδικό Κλάσμα', col2: 'Δεκαδικός Αριθμός', r1: [`${thousands}/1.000 km`, '3 δεκαδικά ψηφία'], r2: ['Αποτέλεσμα', `${formatNum(decKm, 3)} km`] },
        correctVal: decKm,
        correctStr: formatNum(decKm, 3),
        explanation: `${thousands}/1.000 ＝ ${thousands} : 1.000 ＝ ${formatNum(decKm, 3)} km.`
      };
    }
  }
];

// Διευρυμενη Δεξαμενη Προβληματων Αυξημενης Δυσκολιας (για Q10 MCQ)
const HARD_PROBLEMS_POOL = [
  {
    id: 'p_klasm_hard_1',
    generate: () => {
      const a = randInt(2, 5);
      const bTenths = randInt(3, 7);
      const cHundr = randInt(2, 8);
      const totalDec = Number((a + bTenths * 0.1 + cHundr * 0.01).toFixed(2));
      const totalNum = a * 100 + bTenths * 10 + cHundr;

      const correctStr = String(totalNum);
      const fake1 = String(totalNum + 10);
      const fake2 = String(Math.max(10, totalNum - 10));
      const fake3 = String(a * 10 + bTenths * 10 + cHundr);

      const rawOptions = [correctStr, fake1, fake2, fake3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: 'ΣΥΝΘΕΣΗ ΜΕΙΓΜΑΤΟΣ ΣΕ ΕΚΑΤΟΣΤΑ',
        instruction: 'Επιλέξτε τον σωστό αριθμητή του δεκαδικού κλάσματος:',
        text: `Ένα μείγμα περιέχει ${a} ακέραιες μονάδες, ${bTenths}/10 της μονάδας και ${cHundr}/100 της μονάδας. Ποιος είναι ο αριθμητής αν γράψουμε όλη την ποσότητα ως δεκαδικό κλάσμα με παρονομαστή το 100;`,
        tableData: { col1: 'Μείγμα', col2: 'Αναγωγή σε εκατοστά', r1: [`${a} μον. ＝ ${a * 100}/100`, `${bTenths}/10 ＝ ${bTenths * 10}/100`], r2: [`${cHundr}/100`, `Αριθμητής: ${totalNum}`] },
        correctVal: totalNum,
        correctStr,
        options,
        correctText: correctStr,
        explanation: `Μετατρέπουμε όλα τα μέρη σε εκατοστά: ${a * 100}/100 ＋ ${bTenths * 10}/100 ＋ ${cHundr}/100 ＝ ${totalNum}/100. Ο αριθμητής είναι το ${totalNum} (ισούται με ${formatNum(totalDec, 2)}).`
      };
    }
  },
  {
    id: 'p_klasm_hard_2',
    generate: () => {
      const f1Numer = 35;
      const f2Tenths = 4;
      const sum = Number((f1Numer / 100 + f2Tenths / 10).toFixed(2));
      const correctStr = `${formatNum(sum, 2)} m`;
      const fake1 = `${formatNum(sum + 0.15, 2)} m`;
      const fake2 = `${formatNum(Math.max(0.1, sum - 0.2), 2)} m`;
      const fake3 = `${formatNum(sum + 0.35, 2)} m`;

      const rawOptions = [correctStr, fake1, fake2, fake3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: 'ΠΡΟΣΘΕΣΗ ΜΗΚΩΝ ΥΦΑΣΜΑΤΟΣ',
        instruction: 'Επιλέξτε το σωστό συνολικό μήκος σε μέτρα (m):',
        text: `Από ένα ύφασμα χρησιμοποιήθηκαν τα ${f1Numer}/100 του μέτρου το πρωί και άλλα ${f2Tenths}/10 του μέτρου το απόγευμα. Πόσα μέτρα (m) υφάσματος χρησιμοποιήθηκαν συνολικά;`,
        tableData: { col1: 'Πρωί', col2: 'Απόγευμα', r1: [`${f1Numer}/100 m ＝ 0,35 m`, `${f2Tenths}/10 m ＝ 0,40 m`], r2: ['Πρόσθεση', `${correctStr}`] },
        correctVal: sum,
        correctStr,
        options,
        correctText: correctStr,
        explanation: `${f1Numer}/100 ＝ 0,35 m και ${f2Tenths}/10 ＝ 40/100 ＝ 0,40 m. Συνολικά: 0,35 ＋ 0,40 ＝ ${correctStr} (ή 75/100 m).`
      };
    }
  },
  {
    id: 'p_klasm_hard_3',
    generate: () => {
      const l1Tenths = 6;
      const l2Hundr = 25;
      const sumL = Number((l1Tenths / 10 + l2Hundr / 100).toFixed(2));
      const correctStr = `${formatNum(sumL, 2)} L`;
      const fake1 = `${formatNum(sumL + 0.2, 2)} L`;
      const fake2 = `${formatNum(Math.max(0.1, sumL - 0.15), 2)} L`;
      const fake3 = `${formatNum(sumL + 0.4, 2)} L`;

      const rawOptions = [correctStr, fake1, fake2, fake3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: 'ΑΝΑΜΕΙΞΗ ΥΓΡΩΝ ΣΕ ΛΙΤΡΑ',
        instruction: 'Επιλέξτε τον συνολικό όγκο σε λίτρα (L):',
        text: `Σε ένα δοχείο ρίξαμε ${l1Tenths}/10 του λίτρου νερό και ${l2Hundr}/100 του λίτρου χυμό. Πόσα λίτρα (L) υγρού περιέχει συνολικά το δοχείο;`,
        tableData: { col1: 'Νερό', col2: 'Χυμός', r1: [`${l1Tenths}/10 L ＝ 0,60 L`, `${l2Hundr}/100 L ＝ 0,25 L`], r2: ['Σύνολο', `${correctStr}`] },
        correctVal: sumL,
        correctStr,
        options,
        correctText: correctStr,
        explanation: `${l1Tenths}/10 L ＝ 0,60 L και ${l2Hundr}/100 L ＝ 0,25 L. Άρα συνολικά: 0,60 ＋ 0,25 ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_klasm_hard_4',
    generate: () => {
      const kg1 = 45;
      const kg2 = 3;
      const sumKg = Number((kg1 / 100 + kg2 / 10).toFixed(2));
      const correctStr = `${formatNum(sumKg, 2)} kg`;
      const fake1 = `${formatNum(sumKg + 0.1, 2)} kg`;
      const fake2 = `${formatNum(Math.max(0.1, sumKg - 0.2), 2)} kg`;
      const fake3 = `${formatNum(sumKg + 0.25, 2)} kg`;

      const rawOptions = [correctStr, fake1, fake2, fake3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: 'ΣΥΝΟΛΙΚΟ ΒΑΡΟΣ ΜΠΑΧΑΡΙΚΩΝ',
        instruction: 'Επιλέξτε το συνολικό βάρος σε κιλά (kg):',
        text: `Ένας σεφ αγόρασε ${kg1}/100 του κιλού κανέλα και ${kg2}/10 του κιλού γαρίφαλο. Πόσα κιλά (kg) μπαχαρικών αγόρασε συνολικά;`,
        tableData: { col1: 'Κανέλα', col2: 'Γαρίφαλο', r1: [`${kg1}/100 kg ＝ 0,45 kg`, `${kg2}/10 kg ＝ 0,30 kg`], r2: ['Πρόσθεση', `${correctStr}`] },
        correctVal: sumKg,
        correctStr,
        options,
        correctText: correctStr,
        explanation: `${kg1}/100 ＝ 0,45 kg και ${kg2}/10 ＝ 0,30 kg. Συνολικά: 0,45 ＋ 0,30 ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_klasm_hard_5',
    generate: () => {
      const totalKm = 1;
      const walkedTenths = 7;
      const walkedDec = walkedTenths / 10;
      const remainKm = Number((totalKm - walkedDec).toFixed(1));
      const correctStr = `${formatNum(remainKm, 1)} km`;
      const fake1 = `${formatNum(remainKm + 0.2, 1)} km`;
      const fake2 = `${formatNum(Math.max(0.1, remainKm - 0.1), 1)} km`;
      const fake3 = '0,7 km';

      const rawOptions = [correctStr, fake1, fake2, fake3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: 'ΥΠΟΛΟΙΠΟ ΔΙΑΔΡΟΜΗΣ ΣΕ ΧΙΛΙΟΜΕΤΡΑ',
        instruction: 'Επιλέξτε την υπολειπόμενη απόσταση σε χιλιόμετρα (km):',
        text: `Μια κυκλική πίστα έχει μήκος ακριβώς 1 km. Ένας αθλητής διένυσε τα ${walkedTenths}/10 του χιλιομέτρου. Πόσα χιλιόμετρα (km) του απομένουν για να ολοκληρώσει τον γύρο;`,
        tableData: { col1: 'Συνολικός Γύρος', col2: 'Διανυθείσα Απόσταση', r1: ['1 km ＝ 10/10 km', `${walkedTenths}/10 km ＝ 0,7 km`], r2: ['Υπόλοιπο', `${correctStr}`] },
        correctVal: remainKm,
        correctStr,
        options,
        correctText: correctStr,
        explanation: `1 km ＝ 10/10 km. Αφαιρούμε: 10/10 － ${walkedTenths}/10 ＝ 3/10 km ＝ ${correctStr}.`
      };
    }
  }
];

// Δημιουργια των 10 δυναμικων ερωτησεων
function generateQuestions() {
  const qList = [];

  // Q1 (Input - Decimal): Δεκαδικός σε Δεκαδικό Κλάσμα (Εύρεση Αριθμητή)
  {
    const denomPool = [10, 100, 1000];
    const denom = denomPool[randInt(0, 2)];
    let numer = 0;
    let decStr = '';

    if (denom === 10) {
      numer = randInt(1, 9);
      decStr = `0,${numer}`;
    } else if (denom === 100) {
      numer = randInt(11, 89);
      decStr = `0,${numer}`;
    } else {
      numer = randInt(105, 750);
      decStr = `0,${numer}`;
    }

    qList.push({
      id: 1,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 1 • ΣΕ ΔΕΚΑΔΙΚΟ ΚΛΑΣΜΑ (ΑΡΙΘΜΗΤΗΣ)',
      instruction: 'Συμπληρώστε τον αριθμητή ώστε να ισχύει η ισότητα (ακέραιος):',
      prompt: `Στην ισότητα ${decStr} ＝ χ / ${denom}, ποιος είναι ο αριθμητής χ;`,
      correctVal: numer,
      correctStr: String(numer),
      explanation: `Ο αριθμός ${decStr} έχει ${denom === 10 ? '1 δεκαδικό ψηφίο' : denom === 100 ? '2 δεκαδικά ψηφία' : '3 δεκαδικά ψηφία'}, άρα ${decStr} ＝ ${numer} / ${denom}. Ο αριθμητής είναι το ${numer}.`
    });
  }

  // Q2 (Input - Decimal): Μετατροπή Δεκαδικού Κλάσματος σε Δεκαδικό Αριθμό
  {
    const denomType = randInt(1, 3);
    let numer = 0;
    let denom = 10;
    let decAnswer = 0;

    if (denomType === 1) {
      numer = randInt(3, 9);
      denom = 10;
      decAnswer = numer / 10;
    } else if (denomType === 2) {
      numer = randInt(5, 95);
      denom = 100;
      decAnswer = numer / 100;
    } else {
      numer = randInt(12, 650);
      denom = 1000;
      decAnswer = numer / 1000;
    }

    qList.push({
      id: 2,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 2 • ΚΛΑΣΜΑ ΣΕ ΔΕΚΑΔΙΚΟ ΑΡΙΘΜΟ',
      instruction: 'Γράψτε το κλάσμα ως δεκαδικό αριθμό με κόμμα:',
      prompt: `Ποιος δεκαδικός αριθμός ισούται με το δεκαδικό κλάσμα ${numer} / ${denom};`,
      correctVal: decAnswer,
      correctStr: formatNum(decAnswer, denom === 10 ? 1 : denom === 100 ? 2 : 3),
      explanation: `Διαιρώντας το ${numer} με το ${denom} μετακινούμε την υποδιαστολή ${denom === 10 ? '1 θέση' : denom === 100 ? '2 θέσεις' : '3 θέσεις'} αριστερά: ${numer} : ${denom} ＝ ${formatNum(decAnswer, denom === 10 ? 1 : denom === 100 ? 2 : 3)}.`
    });
  }

  // Q3 (MCQ): Επιλογή ισοδύναμου δεκαδικού κλάσματος (Εγγύηση Μοναδικότητας)
  {
    const tenthsDigit = randInt(2, 8);
    const decVal = tenthsDigit / 10;
    const decStr = formatNum(decVal, 1);
    const correctFrac = `${tenthsDigit * 10}/100`;

    const rawOptions = [
      correctFrac,
      `${tenthsDigit}/100`,
      `${tenthsDigit * 10}/10`,
      `${tenthsDigit * 100}/100`
    ];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === correctFrac
    }));

    qList.push({
      id: 3,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 3 • ΙΣΟΔΥΝΑΜΑ ΔΕΚΑΔΙΚΑ ΚΛΑΣΜΑΤΑ',
      instruction: 'Επιλέξτε το σωστό ισοδύναμο κλάσμα:',
      prompt: `Ποιο από τα παρακάτω δεκαδικά κλάσματα είναι ίσο με τον αριθμό ${decStr};`,
      options,
      correctText: correctFrac,
      explanation: `Το ${decStr} ισούται με ${tenthsDigit}/10. Πολλαπλασιάζοντας αριθμητή και παρονομαστή με το 10, προκύπτει το ισοδύναμο κλάσμα ${correctFrac}.`
    });
  }

  // Q4 (MCQ): Σύγκριση Δεκαδικού με Δεκαδικό Κλάσμα (Εγγύηση Μοναδικότητας)
  {
    const tenths = randInt(4, 8);
    const fracStr = `${tenths * 10}/100`;
    const correctDec = (tenths / 10).toFixed(2).replace('.', ',');
    const w1 = ((tenths + 1) / 10).toFixed(1).replace('.', ',');
    const w2 = ((tenths - 2) / 10).toFixed(1).replace('.', ',');
    const w3 = `0,0${tenths}`;

    const rawOptions = [correctDec, w1, w2, w3];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === correctDec
    }));

    qList.push({
      id: 4,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 4 • ΣΥΓΚΡΙΣΗ & ΙΣΟΔΥΝΑΜΙΑ',
      instruction: 'Επιλέξτε τον ίσο δεκαδικό αριθμό:',
      prompt: `Ποιος δεκαδικός αριθμός είναι ίσος με το δεκαδικό κλάσμα ${fracStr};`,
      options,
      correctText: correctDec,
      explanation: `Το κλάσμα ${fracStr} απλοποιείται σε ${tenths}/10 ＝ ${correctDec}.`
    });
  }

  // Q5 (MCQ): True / False - Κανόνας των Μηδενικών
  {
    const q5IsTrue = Math.random() > 0.5;
    const q5Text = q5IsTrue
      ? 'Στο κλάσμα 45/100, ο παρονομαστής έχει 2 μηδενικά, άρα ο δεκαδικός αριθμός (0,45) έχει ακριβώς 2 δεκαδικά ψηφία.'
      : 'Στο κλάσμα 45/100, ο παρονομαστής έχει 2 μηδενικά, άρα ο δεκαδικός αριθμός θα είναι το 4,5 (1 δεκαδικό ψηφίο).';
    const correctAns = q5IsTrue ? 'Σωστό' : 'Λάθος';

    const options = [
      { text: 'Σωστό', isCorrect: q5IsTrue },
      { text: 'Λάθος', isCorrect: !q5IsTrue }
    ];

    qList.push({
      id: 5,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 5 • ΚΑΝΟΝΑΣ ΤΩΝ ΜΗΔΕΝΙΚΩΝ',
      instruction: 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q5Text}»`,
      options,
      correctText: correctAns,
      explanation: q5IsTrue
        ? 'Σωστό! Το πλήθος των μηδενικών στον δεκαδικό παρονομαστή καθορίζει ακριβώς το πλήθος των δεκαδικών ψηφίων.'
        : 'Λάθος! 45/100 σημαίνει 2 μηδενικά στον παρονομαστή, άρα 2 δεκαδικά ψηφία: 0,45.'
    });
  }

  // Q6 (MCQ): True / False - Ισοδυναμία Μορφών
  {
    const num = randInt(2, 7);
    const q6IsTrue = Math.random() > 0.5;
    const q6Text = q6IsTrue
      ? `Τα κλάσματα ${num}/10 και ${num * 10}/100 εκφράζουν ακριβώς την ίδια ποσότητα (0,${num}).`
      : `Το κλάσμα ${num * 10}/100 είναι 10 φορές μεγαλύτερο από το κλάσμα ${num}/10.`;
    const correctAns = q6IsTrue ? 'Σωστό' : 'Λάθος';

    const options = [
      { text: 'Σωστό', isCorrect: q6IsTrue },
      { text: 'Λάθος', isCorrect: !q6IsTrue }
    ];

    qList.push({
      id: 6,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 6 • ΙΣΟΔΥΝΑΜΙΑ ΜΟΡΦΩΝ',
      instruction: 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q6Text}»`,
      options,
      correctText: correctAns,
      explanation: q6IsTrue
        ? 'Σωστό! Προσθέτοντας ένα μηδενικό στον αριθμητή και στον παρονομαστή η αξία παραμένει ακριβώς η ίδια.'
        : `Λάθος! ${num}/10 και ${num * 10}/100 είναι ισοδύναμα κλάσματα (εκφράζουν και τα δύο το 0,${num}).`
    });
  }

  // Q7 (Input - Decimal): Οπτική Λωρίδα Δεκάτων
  {
    const count = randInt(2, 8);
    const decVal = count / 10;
    const decStr = formatNum(decVal, 1);

    qList.push({
      id: 7,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 7 • ΟΠΤΙΚΗ ΛΩΡΙΔΑ ΔΕΚΑΤΩΝ',
      instruction: 'Γράψτε τον δεκαδικό αριθμό με κόμμα:',
      prompt: `Σε μια λωρίδα χωρισμένη σε 10 ίσα μέρη, έχουν χρωματιστεί τα ${count}. Ποιον δεκαδικό αριθμό εκφράζει το χρωματισμένο μέρος;`,
      correctVal: decVal,
      correctStr: decStr,
      explanation: `Έχουν χρωματιστεί ${count} από τα 10 ίσα μέρη, δηλαδή ${count}/10 ＝ ${decStr}.`
    });
  }

  // Q8 (MCQ): Οπτικό Πλέγμα Εκατοστών (Εγγύηση Μοναδικότητας)
  {
    const tens = randInt(2, 6);
    const units = randInt(1, 8);
    const totalSquares = tens * 10 + units;
    const decCorrect = (totalSquares / 100).toFixed(2).replace('.', ',');
    const w1 = (totalSquares / 10).toFixed(1).replace('.', ',');
    const w2 = `0,0${totalSquares}`;
    const w3 = ((totalSquares + 10) / 100).toFixed(2).replace('.', ',');

    const rawOptions = [decCorrect, w1, w2, w3];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === decCorrect
    }));

    qList.push({
      id: 8,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 8 • ΟΠΤΙΚΟ ΠΛΕΓΜΑ ΕΚΑΤΟΣΤΩΝ',
      instruction: 'Επιλέξτε τον σωστό δεκαδικό αριθμό:',
      prompt: `Σε ένα πλέγμα 100 τετραγώνων έχουν χρωματιστεί ${totalSquares} τετραγωνάκια. Ποιον δεκαδικό αριθμό δείχνει το πλέγμα;`,
      options,
      correctText: decCorrect,
      explanation: `Στο πλέγμα 100 κουτιών έχουν χρωματιστεί ${totalSquares} κουτάκια, άρα ${totalSquares}/100 ＝ ${decCorrect}.`
    });
  }

  // Q9 & Q10: Προβλήματα από τις δεξαμενές (1 Input, 1 MCQ)
  {
    const shuffledStd = shuffle([...STANDARD_PROBLEMS_POOL]);
    const shuffledHard = shuffle([...HARD_PROBLEMS_POOL]);
    const stdProb = shuffledStd[0].generate();
    const hardProb = shuffledHard[0].generate();

    // Q9 (Input - Decimal) - Χωρίς πίνακα στην εκφώνηση
    qList.push({
      id: 9,
      type: 'decimal_input',
      title: stdProb.title,
      instruction: stdProb.instruction,
      prompt: stdProb.text,
      tableData: stdProb.tableData,
      correctVal: stdProb.correctVal,
      correctStr: stdProb.correctStr,
      explanation: stdProb.explanation
    });

    // Q10 (MCQ Αυξημένης Δυσκολίας) - Πλήρως ευθυγραμμισμένη μονάδα μέτρησης και τίτλος
    qList.push({
      id: 10,
      type: 'mcq',
      title: `ΕΡΩΤΗΣΗ 10 • ${hardProb.title}`,
      instruction: hardProb.instruction,
      prompt: hardProb.text,
      tableData: hardProb.tableData,
      options: hardProb.options,
      correctText: hardProb.correctText,
      explanation: hardProb.explanation
    });
  }

  return qList;
}

export default function MetatropiExercisesPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Δημιουργια νεων ασκησεων
  const loadNewSet = useCallback(() => {
    const q = generateQuestions();
    setQuestions(q);
    setAnswers({});
    setIsSubmitted(false);
    setScore(0);
  }, []);

  useEffect(() => {
    loadNewSet();
  }, [loadNewSet]);

  // Χειρισμος Input με καθαρισμο χαρακτηρων (μονο 0-9 και ενα κομμα, οριο 10 χαρακτηρων)
  const handleInputChange = (fieldKey, rawValue) => {
    if (isSubmitted) return;
    let sanitized = rawValue.replace(/\./g, ',');
    sanitized = sanitized.replace(/[^0-9,]/g, '');
    const parts = sanitized.split(',');
    if (parts.length > 2) {
      sanitized = parts[0] + ',' + parts.slice(1).join('');
    }
    if (sanitized.length > 10) {
      sanitized = sanitized.slice(0, 10);
    }
    setAnswers((prev) => ({
      ...prev,
      [fieldKey]: sanitized
    }));
  };

  // Χειρισμος MCQ
  const handleSelectMCQ = (qId, optionText) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [`q_${qId}`]: optionText
    }));
  };

  // Ελεγχος Απαντησεων
  const handleCheckAnswers = () => {
    let currentScore = 0;

    questions.forEach((q) => {
      if (q.type === 'mcq') {
        const userChoice = answers[`q_${q.id}`];
        if (userChoice === q.correctText) {
          currentScore += 1;
        }
      } else if (q.type === 'decimal_input') {
        const userValStr = (answers[`q_${q.id}`] || '').trim().replace(',', '.');
        const userVal = parseFloat(userValStr);
        if (!isNaN(userVal) && Math.abs(userVal - q.correctVal) < 0.05) {
          currentScore += 1;
        }
      }
    });

    setScore(currentScore);
    setIsSubmitted(true);
  };

  return (
    <Layout
      title="Ασκήσεις: Δεκαδικοί & Κλάσματα - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="10 απαιτητικές ασκήσεις και προβλήματα στη μετατροπή δεκαδικών αριθμών σε δεκαδικά κλάσματα και το αντίστροφο για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/03-arithmoi-dekadika-klasmata"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>📖 Θεωρία</span>
        </Link>
      }
    >
      {/* Container πληρους ευρους για κινητα εως 2K, 4K & 8K */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 pb-28 sm:pb-32 overflow-x-hidden">
        
        {/* Banner Header */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Ασκήσεις &amp; Προβλήματα: Δεκαδικοί &amp; Κλάσματα
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 απαιτητικές δραστηριότητες μετατροπής δεκαδικών αριθμών σε δεκαδικά κλάσματα και το αντίστροφο, οπτικές αναπαραστάσεις μονάδας και 4 ρεαλιστικά προβλήματα καθημερινής ζωής.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs sm:text-sm 2xl:text-base text-sky-200">
              ⚡ Κάθε σετ δημιουργείται δυναμικά με τυχαίες παραμέτρους.
            </span>
            <button
              type="button"
              onClick={loadNewSet}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base touch-manipulation"
            >
              <span>🔄 ΝΕΕΣ ΑΣΚΗΣΕΙΣ</span>
            </button>
          </div>
        </section>

        {/* Λιστα 10 Ασκησεων */}
        <div className="space-y-6 sm:space-y-8">
          {questions.map((q, idx) => {
            let isCorrect = false;
            if (isSubmitted) {
              if (q.type === 'mcq') {
                isCorrect = answers[`q_${q.id}`] === q.correctText;
              } else if (q.type === 'decimal_input') {
                const uv = parseFloat((answers[`q_${q.id}`] || '').replace(',', '.'));
                isCorrect = !isNaN(uv) && Math.abs(uv - q.correctVal) < 0.05;
              }
            }

            return (
              <article
                key={`q-${q.id}-${idx}`}
                className={`bg-white rounded-3xl border p-5 sm:p-8 2xl:p-10 shadow-sm transition-all ${
                  isSubmitted
                    ? isCorrect
                      ? 'border-emerald-400 bg-emerald-50/20'
                      : 'border-rose-400 bg-rose-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Επικεφαλιδα Ερωτησης (Καθαρα ατονα κεφαλαια εκτος ΣΤ') */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="text-xs 2xl:text-sm font-black tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg">
                    {toCleanUppercase(q.title)}
                  </span>
                  {isSubmitted && (
                    <span
                      className={`text-xs 2xl:text-sm font-bold px-3 py-1 rounded-full ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isCorrect ? '✓ ΣΩΣΤΟ' : '✗ ΛΑΘΟΣ'}
                    </span>
                  )}
                </div>

                {/* Εκφωνηση (Καθαρο κειμενο χωρις πινακα που προδιδει τη λυση) */}
                <div className="space-y-3 mb-5">
                  {q.instruction && (
                    <p className="text-xs sm:text-sm 2xl:text-base font-semibold text-slate-500">
                      {q.instruction}
                    </p>
                  )}
                  <p className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-900 leading-relaxed">
                    {q.prompt}
                  </p>
                </div>

                {/* Περιοχη Απαντησης */}
                <div className="py-2">
                  
                  {/* Decimal / Number Input */}
                  {q.type === 'decimal_input' && (
                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        type="text"
                        inputMode="decimal"
                        maxLength={10}
                        disabled={isSubmitted}
                        placeholder="Απάντηση..."
                        value={answers[`q_${q.id}`] || ''}
                        onChange={(e) => handleInputChange(`q_${q.id}`, e.target.value)}
                        className="w-36 sm:w-44 text-center font-mono font-bold text-base sm:text-lg text-slate-900 bg-white border border-slate-300 rounded-2xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed shadow-inner"
                      />
                      <span className="text-xs 2xl:text-sm text-slate-500">
                        (Ακέραιος η δεκαδικός με κόμμα)
                      </span>
                    </div>
                  )}

                  {/* Multiple Choice (MCQ) - Χωρις truncate, πληρες κειμενο break-words */}
                  {q.type === 'mcq' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-4xl">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = answers[`q_${q.id}`] === opt.text;
                        return (
                          <button
                            key={`opt-${q.id}-${oIdx}`}
                            type="button"
                            disabled={isSubmitted}
                            onClick={() => handleSelectMCQ(q.id, opt.text)}
                            className={`p-3.5 rounded-2xl border text-left font-semibold text-xs sm:text-sm 2xl:text-base transition active:scale-95 touch-manipulation flex items-center justify-between gap-3 ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                            } disabled:cursor-not-allowed`}
                          >
                            <span className="break-words whitespace-normal leading-snug flex-1">
                              {opt.text}
                            </span>
                            <span
                              className={`w-5 h-5 shrink-0 rounded-full border flex items-center justify-center text-xs ${
                                isSelected
                                  ? 'border-white bg-white text-blue-600 font-bold'
                                  : 'border-slate-400 bg-transparent'
                              }`}
                            >
                              {isSelected ? '●' : ''}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                </div>

                {/* Feedback μετα την υποβολη (Εδω εμφανιζεται ο αναλυτικος πινακας δεδομενων) */}
                {isSubmitted && (
                  <div
                    className={`mt-4 p-4 rounded-2xl border text-xs sm:text-sm 2xl:text-base leading-relaxed space-y-2.5 ${
                      isCorrect
                        ? 'bg-emerald-100/60 border-emerald-300 text-emerald-950'
                        : 'bg-rose-100/60 border-rose-300 text-rose-950'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      <span>{isCorrect ? '🎉 Εξαιρετικά!' : '💡 Μαθηματική Επεξήγηση:'}</span>
                    </div>

                    {/* Οργανωτικός Πίνακας Δεδομένων στην Επεξήγηση */}
                    {q.tableData && (
                      <div className="inline-block max-w-full bg-white/90 border border-slate-200 rounded-2xl p-3 shadow-inner my-1 font-mono text-xs sm:text-sm">
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 font-bold border-b pb-1.5 text-slate-600 text-center">
                          <span className="bg-blue-100/70 px-2 py-0.5 rounded-lg text-blue-900 break-words">{q.tableData.col1}</span>
                          <span className="bg-emerald-100/70 px-2 py-0.5 rounded-lg text-emerald-900 break-words">{q.tableData.col2}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2 text-center font-bold text-slate-800">
                          <span>{q.tableData.r1[0]}</span>
                          <span className="text-indigo-700 font-bold">{q.tableData.r1[1]}</span>
                          <span>{q.tableData.r2[0]}</span>
                          <span className="text-amber-600 font-black">{q.tableData.r2[1]}</span>
                        </div>
                      </div>
                    )}

                    <div>{q.explanation}</div>
                    
                    {!isCorrect && (
                      <div className="font-semibold pt-1 text-slate-800">
                        Σωστή απάντηση:{' '}
                        <span className="font-mono font-bold text-blue-900">
                          {q.correctStr || q.correctText}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Κουμπι Ελεγχου στο τελος της φορμας */}
        <div className="flex justify-center pt-4">
          <button
            type="button"
            onClick={handleCheckAnswers}
            disabled={isSubmitted}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-base sm:text-lg 2xl:text-xl px-8 py-4 rounded-2xl shadow-xl transition active:scale-95 touch-manipulation"
          >
            <span>🎯 Έλεγχος Απαντήσεων</span>
          </button>
        </div>

      </div>

      {/* Fixed Bottom Score Bar */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3.5 px-4 sm:px-8 shadow-2xl">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4 sm:gap-8">
            <div>
              <span className="text-xs text-slate-400 font-semibold block">
                ΣΚΟΡ
              </span>
              <span className="font-mono font-black text-lg sm:text-2xl text-amber-300">
                {score} <span className="text-slate-500 text-base">/ 10</span>
              </span>
            </div>

            <div className="hidden xs:block border-l border-slate-700 pl-4 sm:pl-8">
              <span className="text-xs text-slate-400 font-semibold block">
                ΠΟΣΟΣΤΟ
              </span>
              <span className="font-mono font-black text-lg sm:text-2xl text-emerald-400">
                {Math.round((score / 10) * 100)} %
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleCheckAnswers}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base shadow-md transition active:scale-95 touch-manipulation"
              >
                ΕΛΕΓΧΟΣ
              </button>
            ) : (
              <button
                type="button"
                onClick={loadNewSet}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base shadow-md transition active:scale-95 touch-manipulation"
              >
                🔄 ΝΕΕΣ ΑΣΚΗΣΕΙΣ
              </button>
            )}
          </div>

        </div>
      </footer>
    </Layout>
  );
}
