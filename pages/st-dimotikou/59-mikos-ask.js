// pages/st-dimotikou/59-mikos-ask.js
import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

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

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Δημιουργία 4 εγγυημένα μοναδικών επιλογών για MCQ
function makeUniqueOptions(correct, wrongCandidates) {
  const unique = new Set([correct]);
  for (const opt of wrongCandidates) {
    if (opt !== undefined && opt !== null && opt !== '') {
      unique.add(String(opt));
    }
    if (unique.size === 4) break;
  }

  let counter = 1;
  while (unique.size < 4) {
    const numericMatch = String(correct).match(/\d+(\.\d+)?/);
    if (numericMatch) {
      const baseNum = parseFloat(numericMatch[0]);
      const fallbackVal = String(correct).replace(
        numericMatch[0],
        String(Math.max(1, Math.round((baseNum + counter * 2) * 10) / 10))
      );
      unique.add(fallbackVal);
    } else {
      unique.add(`Επιλογή ${counter}`);
    }
    counter++;
  }

  return shuffle(Array.from(unique));
}

// Αφαίρεση τόνων για κεφαλαία (εξαιρείται το ΣΤ')
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

// Μορφοποίηση αριθμού (ακέραιος ή δεκαδικός ανάλογα με το locale)
function formatNum(val, locale = 'el', decimals = 3) {
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  const loc = locale === 'en' ? 'en-US' : 'el-GR';
  const num = Number(val);
  if (Number.isInteger(num)) {
    return num.toLocaleString(loc);
  }
  return num.toLocaleString(loc, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

// Κανονική κατακόρυφη μορφή κλάσματος (responsive, mobile safe)
function Fraction({ num, den, className = '' }) {
  return (
    <span
      className={`inline-flex flex-col items-center justify-center align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full ${className}`}
    >
      <span className="border-b border-current px-1 pb-0.5 text-center break-all">
        {num}
      </span>
      <span className="px-1 pt-0.5 text-center break-all">
        {den}
      </span>
    </span>
  );
}

// ---------------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (Q7, Q8, Q9, Q10) - "NO-GIVEAWAY" PEDAGOGY
// ---------------------------------------------------------

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'p_len_std_1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const parts = pickRandom([2, 4, 5, 8, 10]);
      const ribM = randInt(2, 6);
      const totalCm = ribM * 100;
      const partCm = totalCm / parts;
      const cleanPart = Number.isInteger(partCm) ? partCm : Number(partCm.toFixed(1));
      const formattedPart = formatNum(cleanPart, locale, 1);

      const wrongOpts = [
        `${formatNum(cleanPart + 10, locale, 1)} cm`,
        `${formatNum(Math.max(5, cleanPart - 10), locale, 1)} cm`,
        `${formatNum(cleanPart + 15, locale, 1)} cm`
      ];

      return {
        title: isEn ? 'Cutting Ribbon into Equal Pieces' : 'Διαίρεση Κορδέλας σε Ίσα Κομμάτια',
        prompt: isEn
          ? `A ribbon has a length of ${ribM} m. We cut it into ${parts} equal pieces. How many centimeters (cm) is the length of each piece? (write only the number)`
          : `Μια κορδέλα έχει μήκος ${ribM} m. Την κόβουμε σε ${parts} ίσα κομμάτια. Πόσα εκατοστά (cm) είναι το μήκος κάθε κομματιού; (γράψε μόνο τον αριθμό)`,
        promptMcq: isEn
          ? `A ribbon has a length of ${ribM} m. We cut it into ${parts} equal pieces. How many centimeters (cm) is the length of each piece?`
          : `Μια κορδέλα έχει μήκος ${ribM} m. Την κόβουμε σε ${parts} ίσα κομμάτια. Πόσα εκατοστά (cm) είναι το μήκος κάθε κομματιού;`,
        unit: 'cm',
        correctVal: formattedPart,
        correctText: `${formattedPart} cm`,
        tableData: [
          { item: isEn ? 'Initial length in cm' : 'Αρχικό μήκος σε cm', formula: `${ribM} m · 100`, val: `${totalCm} cm` },
          { item: isEn ? 'Number of pieces' : 'Πλήθος κομματιών', formula: `${parts} ${isEn ? 'equal parts' : 'ίσα μέρη'}`, val: `${parts}` },
          {
            item: isEn ? 'Length of each piece' : 'Μήκος κάθε κομματιού',
            formula: (
              <span className="inline-flex items-center">
                <Fraction num={totalCm} den={parts} />
              </span>
            ),
            val: `${formattedPart} cm`
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>
              {isEn
                ? `We convert meters to centimeters: ${ribM} · 100 ＝ ${totalCm} cm. We divide into ${parts} equal pieces:`
                : `Μετατρέπουμε τα μέτρα σε εκατοστά: ${ribM} · 100 ＝ ${totalCm} cm. Διαιρούμε σε ${parts} ίσα μέρη:`}
            </span>
            <Fraction num={totalCm} den={parts} />
            <span>＝ {formattedPart} cm.</span>
          </span>
        ),
        distractors: wrongOpts
      };
    }
  },
  {
    id: 'p_len_std_2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const rollM = randInt(12, 20);
      const usedCm = randInt(3, 6) * 100 + 50;
      const rollCm = rollM * 100;
      const remainingCm = rollCm - usedCm;
      const remainingM = remainingCm / 100;
      const formattedRemaining = formatNum(remainingM, locale, 2);
      const formattedUsedM = formatNum(usedCm / 100, locale, 2);

      const wrongOpts = [
        `${formatNum(remainingM + 1, locale, 2)} m`,
        `${formatNum(Math.max(1, remainingM - 1), locale, 2)} m`,
        `${formatNum(remainingM + 0.5, locale, 2)} m`
      ];

      return {
        title: isEn ? 'Remaining Fabric After Cut' : 'Υπόλοιπο Υφάσματος μετά από Κοπή',
        prompt: isEn
          ? `From a bolt of fabric ${rollM} m long, a piece of ${usedCm} cm was cut off. How many meters (m) of fabric remain? (write only the number)`
          : `Από ένα τόπι υφάσματος μήκους ${rollM} m κόπηκε ένα κομμάτι μήκους ${usedCm} cm. Πόσα μέτρα (m) υφάσματος έμειναν στο τόπι; (γράψε μόνο τον αριθμό)`,
        promptMcq: isEn
          ? `From a bolt of fabric ${rollM} m long, a piece of ${usedCm} cm was cut off. How many meters (m) of fabric remain?`
          : `Από ένα τόπι υφάσματος μήκους ${rollM} m κόπηκε ένα κομμάτι μήκους ${usedCm} cm. Πόσα μέτρα (m) υφάσματος έμειναν στο τόπι;`,
        unit: 'm',
        correctVal: formattedRemaining,
        correctText: `${formattedRemaining} m`,
        tableData: [
          { item: isEn ? 'Initial bolt' : 'Αρχικό τόπι', formula: `${rollM} m`, val: `${rollM} m` },
          {
            item: isEn ? 'Cut piece in meters' : 'Κομμάτι που κόπηκε σε μέτρα',
            formula: (
              <span className="inline-flex items-center">
                <Fraction num={usedCm} den="100" />
              </span>
            ),
            val: `${formattedUsedM} m`
          },
          { item: isEn ? 'Remaining fabric' : 'Υπόλοιπο υφάσματος', formula: `${rollM} － ${formattedUsedM}`, val: `${formattedRemaining} m` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>
              {isEn
                ? 'We convert the cut piece into meters:'
                : 'Μετατρέπουμε το κομμάτι που κόπηκε σε μέτρα:'}
            </span>
            <Fraction num={usedCm} den="100" />
            <span>＝ {formattedUsedM} m. {isEn ? 'We subtract:' : 'Αφαιρούμε:'} {rollM} － {formattedUsedM} ＝ ${formattedRemaining} m.</span>
          </span>
        ),
        distractors: wrongOpts
      };
    }
  },
  {
    id: 'p_len_std_3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const sideCm = randInt(15, 35) * 10;
      const perimCm = sideCm * 4;
      const perimM = perimCm / 100;
      const formattedPerim = formatNum(perimM, locale, 1);

      const wrongOpts = [
        `${formatNum(perimM + 2, locale, 1)} m`,
        `${formatNum(Math.max(1, perimM - 2), locale, 1)} m`,
        `${formatNum(perimM + 4, locale, 1)} m`
      ];

      return {
        title: isEn ? 'Perimeter of a Square Flowerbed' : 'Περίμετρος Τετράγωνου Παρτεριού',
        prompt: isEn
          ? `A square garden plot has a side length of ${sideCm} cm. How many meters (m) is the perimeter of the plot? (write only the number)`
          : `Ένα τετράγωνο παρτέρι έχει πλευρά μήκους ${sideCm} cm. Πόσα μέτρα (m) είναι η περίμετρος του παρτεριού; (γράψε μόνο τον αριθμό)`,
        promptMcq: isEn
          ? `A square garden plot has a side length of ${sideCm} cm. How many meters (m) is the perimeter of the plot?`
          : `Ένα τετράγωνο παρτέρι έχει πλευρά μήκους ${sideCm} cm. Πόσα μέτρα (m) είναι η περίμετρος του παρτεριού;`,
        unit: 'm',
        correctVal: formattedPerim,
        correctText: `${formattedPerim} m`,
        tableData: [
          { item: isEn ? 'Side length' : 'Μήκος πλευράς', formula: `${sideCm} cm`, val: `${sideCm} cm` },
          { item: isEn ? 'Perimeter in cm' : 'Περίμετρος σε cm', formula: `4 · ${sideCm}`, val: `${perimCm} cm` },
          {
            item: isEn ? 'Conversion to meters' : 'Μετατροπή σε μέτρα',
            formula: (
              <span className="inline-flex items-center">
                <Fraction num={perimCm} den="100" />
              </span>
            ),
            val: `${formattedPerim} m`
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>
              {isEn
                ? `The perimeter of the square is 4 · ${sideCm} ＝ ${perimCm} cm. Converting to meters:`
                : `Η περίμετρος του τετραγώνου είναι 4 · ${sideCm} ＝ ${perimCm} cm. Μετατρέπουμε σε μέτρα διαιρώντας με το 100:`}
            </span>
            <Fraction num={perimCm} den="100" />
            <span>＝ {formattedPerim} m.</span>
          </span>
        ),
        distractors: wrongOpts
      };
    }
  },
  {
    id: 'p_len_std_4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const stepCm = randInt(65, 80);
      const steps = randInt(20, 50) * 10;
      const totalCm = stepCm * steps;
      const totalM = totalCm / 100;
      const formattedTotal = formatNum(totalM, locale, 1);

      const wrongOpts = [
        `${formatNum(totalM + 25, locale, 1)} m`,
        `${formatNum(Math.max(10, totalM - 20), locale, 1)} m`,
        `${formatNum(totalM + 50, locale, 1)} m`
      ];

      return {
        title: isEn ? 'Walking Distance in Meters' : 'Απόσταση Περιπατητή σε Μέτρα',
        prompt: isEn
          ? `A walker has a step length of ${stepCm} cm. If they took ${steps} steps in a straight line, how many meters (m) did they walk? (write only the number)`
          : `Το βήμα ενός περιπατητή έχει μήκος ${stepCm} cm. Αν έκανε ${steps} βήματα σε ευθεία γραμμή, πόσα μέτρα (m) διένυσε; (γράψε μόνο τον αριθμό)`,
        promptMcq: isEn
          ? `A walker has a step length of ${stepCm} cm. If they took ${steps} steps in a straight line, how many meters (m) did they walk?`
          : `Το βήμα ενός περιπατητή έχει μήκος ${stepCm} cm. Αν έκανε ${steps} βήματα σε ευθεία γραμμή, πόσα μέτρα (m) διένυσε;`,
        unit: 'm',
        correctVal: formattedTotal,
        correctText: `${formattedTotal} m`,
        tableData: [
          { item: isEn ? 'Step length' : 'Μήκος βήματος', formula: `${stepCm} cm`, val: `${stepCm} cm` },
          { item: isEn ? 'Total distance in cm' : 'Συνολική απόσταση σε cm', formula: `${stepCm} · ${steps}`, val: `${totalCm} cm` },
          {
            item: isEn ? 'Conversion to meters' : 'Μετατροπή σε μέτρα',
            formula: (
              <span className="inline-flex items-center">
                <Fraction num={totalCm} den="100" />
              </span>
            ),
            val: `${formattedTotal} m`
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>
              {isEn
                ? `Total distance in centimeters: ${stepCm} · ${steps} ＝ ${totalCm} cm. Converting to meters:`
                : `Συνολική απόσταση σε εκατοστά: ${stepCm} · ${steps} ＝ ${totalCm} cm. Μετατρέπουμε σε μέτρα:`}
            </span>
            <Fraction num={totalCm} den="100" />
            <span>＝ {formattedTotal} m.</span>
          </span>
        ),
        distractors: wrongOpts
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'p_len_hard_1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const scale = 50000;
      const mapCm = 6.4;
      const realCm = mapCm * scale;
      const realKm = realCm / 100000;
      const formattedRealKm = formatNum(realKm, locale, 2);
      const formattedMapCm = formatNum(mapCm, locale, 1);

      const wrongOpts = [
        `${formatNum(realKm + 1.6, locale, 2)} km`,
        `${formatNum(Math.max(1, realKm - 1), locale, 2)} km`,
        `${formatNum(realKm + 2.4, locale, 2)} km`
      ];

      return {
        title: isEn ? 'Map Scale to Real World Distance' : 'Υπολογισμός Πραγματικής Απόστασης από Χάρτη',
        prompt: isEn
          ? `On a map with a scale of 1 : ${scale.toLocaleString('en-US')}, the distance between two villages measures ${formattedMapCm} cm. How many kilometers (km) is the actual distance? (write only the number)`
          : `Σε έναν γεωγραφικό χάρτη με κλίμακα 1 : ${scale.toLocaleString('el-GR')}, η απόσταση δύο χωριών μετρήθηκε ίση με ${formattedMapCm} cm. Πόσα χιλιόμετρα (km) είναι η πραγματική απόσταση; (γράψε μόνο τον αριθμό)`,
        promptMcq: isEn
          ? `On a map with a scale of 1 : ${scale.toLocaleString('en-US')}, the distance between two villages measures ${formattedMapCm} cm. How many kilometers (km) is the actual distance?`
          : `Σε έναν γεωγραφικό χάρτη με κλίμακα 1 : ${scale.toLocaleString('el-GR')}, η απόσταση δύο χωριών μετρήθηκε ίση με ${formattedMapCm} cm. Πόσα χιλιόμετρα (km) είναι η πραγματική απόσταση;`,
        unit: 'km',
        correctVal: formattedRealKm,
        correctText: `${formattedRealKm} km`,
        tableData: [
          { item: isEn ? 'Map distance' : 'Απόσταση στον χάρτη', formula: `${formattedMapCm} cm`, val: `${formattedMapCm} cm` },
          { item: isEn ? 'Actual distance in cm' : 'Πραγματική απόσταση σε cm', formula: `${formattedMapCm} · ${scale.toLocaleString(isEn ? 'en-US' : 'el-GR')}`, val: `${formatNum(realCm, locale, 0)} cm` },
          {
            item: isEn ? 'Conversion to km' : 'Μετατροπή σε km',
            formula: (
              <span className="inline-flex items-center">
                <Fraction num={formatNum(realCm, locale, 0)} den={isEn ? '100,000' : '100.000'} />
              </span>
            ),
            val: `${formattedRealKm} km`
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>
              {isEn
                ? `Real distance in centimeters: ${formattedMapCm} · ${scale.toLocaleString('en-US')} ＝ ${formatNum(realCm, locale, 0)} cm. Since 1 km ＝ 100,000 cm, we divide:`
                : `Πραγματική απόσταση σε εκατοστά: ${formattedMapCm} · ${scale.toLocaleString('el-GR')} ＝ ${formatNum(realCm, locale, 0)} cm. Επειδή 1 km ＝ 100.000 cm, διαιρούμε με το 100.000:`}
            </span>
            <Fraction num={formatNum(realCm, locale, 0)} den={isEn ? '100,000' : '100.000'} />
            <span>＝ {formattedRealKm} km.</span>
          </span>
        ),
        distractors: wrongOpts
      };
    }
  },
  {
    id: 'p_len_hard_2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const lengthM = 15;
      const widthCm = 850;
      const widthM = widthCm / 100;
      const perimM = 2 * (lengthM + widthM);
      const wireLayers = 3;
      const totalWireM = perimM * wireLayers;
      const formattedWidthM = formatNum(widthM, locale, 1);
      const formattedPerimM = formatNum(perimM, locale, 1);
      const formattedTotalWire = formatNum(totalWireM, locale, 1);

      const wrongOpts = [
        `${formatNum(totalWireM + 15, locale, 1)} m`,
        `${formatNum(Math.max(10, totalWireM - 18), locale, 1)} m`,
        `${formatNum(totalWireM + 30, locale, 1)} m`
      ];

      return {
        title: isEn ? 'Fencing a Lot with 3 Strands of Wire' : 'Περίφραξη Οικοπέδου με 3 Σειρές Σύρματος',
        prompt: isEn
          ? `A rectangular plot has a length of ${lengthM} m and a width of ${widthCm} cm. We want to fence its perimeter with 3 rows of wire. How many meters (m) of wire are needed in total? (write only the number)`
          : `Ένα ορθογώνιο οικόπεδο έχει μήκος ${lengthM} m και πλάτος ${widthCm} cm. Θέλουμε να το περιφράξουμε περιμετρικά με συρματόπλεγμα 3 σειρών. Πόσα μέτρα (m) συρματοπλέγματος θα χρειαστούν συνολικά; (γράψε μόνο τον αριθμό)`,
        promptMcq: isEn
          ? `A rectangular plot has a length of ${lengthM} m and a width of ${widthCm} cm. We want to fence its perimeter with 3 rows of wire. How many meters (m) of wire are needed in total?`
          : `Ένα ορθογώνιο οικόπεδο έχει μήκος ${lengthM} m και πλάτος ${widthCm} cm. Θέλουμε να το περιφράξουμε περιμετρικά με συρματόπλεγμα 3 σειρών. Πόσα μέτρα (m) συρματοπλέγματος θα χρειαστούν συνολικά;`,
        unit: 'm',
        correctVal: formattedTotalWire,
        correctText: `${formattedTotalWire} m`,
        tableData: [
          {
            item: isEn ? 'Width in meters' : 'Πλάτος σε μέτρα',
            formula: (
              <span className="inline-flex items-center">
                <Fraction num={widthCm} den="100" />
              </span>
            ),
            val: `${formattedWidthM} m`
          },
          { item: isEn ? 'Perimeter (1 row)' : 'Περίμετρος (1 σειρά)', formula: `2 · (${lengthM} ＋ ${formattedWidthM})`, val: `${formattedPerimM} m` },
          { item: isEn ? 'Total wire (3 rows)' : 'Συνολικό σύρμα (3 σειρές)', formula: `3 · ${formattedPerimM}`, val: `${formattedTotalWire} m` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>
              {isEn
                ? 'Convert width to meters:'
                : 'Μετατρέπουμε το πλάτος σε μέτρα:'}
            </span>
            <Fraction num={widthCm} den="100" />
            <span>
              ＝ {formattedWidthM} m. {isEn ? 'Perimeter:' : 'Περίμετρος:'} 2 · ({lengthM} ＋ {formattedWidthM}) ＝ {formattedPerimM} m.{' '}
              {isEn ? 'For 3 strands:' : 'Για 3 σειρές:'} 3 · {formattedPerimM} ＝ {formattedTotalWire} m.
            </span>
          </span>
        ),
        distractors: wrongOpts
      };
    }
  },
  {
    id: 'p_len_hard_3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const distKm = 4.2;
      const distM = distKm * 1000;
      const treeSpacingM = 14;
      const intervals = distM / treeSpacingM;
      const trees = intervals + 1;
      const formattedDistKm = formatNum(distKm, locale, 1);
      const unit = isEn ? 'trees' : 'δέντρα';

      const wrongOpts = [
        `${trees - 1} ${unit}`,
        `${trees + 10} ${unit}`,
        `${Math.max(1, trees - 10)} ${unit}`
      ];

      return {
        title: isEn ? 'Planting Trees Along a Road' : 'Φύτευση Δέντρων κατά Μήκος Δρόμου',
        prompt: isEn
          ? `Along one side of a straight road measuring ${formattedDistKm} km, trees are planted every 14 m, starting at the beginning (0 m) and ending at the finish. How many trees will be planted in total? (write only the number)`
          : `Στη μία πλευρά ενός ευθύγραμμου δρόμου μήκους ${formattedDistKm} km φυτεύονται δέντρα ανά 14 m, ξεκινώντας από την αρχή του δρόμου (στο 0 m) μέχρι και το τέλος του. Πόσα δέντρα θα φυτευτούν συνολικά; (γράψε μόνο τον αριθμό)`,
        promptMcq: isEn
          ? `Along one side of a straight road measuring ${formattedDistKm} km, trees are planted every 14 m, starting at the beginning (0 m) and ending at the finish. How many trees will be planted in total?`
          : `Στη μία πλευρά ενός ευθύγραμμου δρόμου μήκους ${formattedDistKm} km φυτεύονται δέντρα ανά 14 m, ξεκινώντας από την αρχή του δρόμου (στο 0 m) μέχρι και το τέλος του. Πόσα δέντρα θα φυτευτούν συνολικά;`,
        unit,
        correctVal: String(trees),
        correctText: `${trees} ${unit}`,
        tableData: [
          { item: isEn ? 'Road length in meters' : 'Μήκος δρόμου σε μέτρα', formula: `${formattedDistKm} · 1.000`, val: `${distM} m` },
          {
            item: isEn ? 'Number of intervals' : 'Αριθμός διαστημάτων',
            formula: (
              <span className="inline-flex items-center">
                <Fraction num={distM} den={treeSpacingM} />
              </span>
            ),
            val: `${intervals}`
          },
          { item: isEn ? 'Total trees (inclusive of start)' : 'Συνολικά δέντρα (συμπεριλαμβανομένης της αρχής)', formula: `${intervals} ＋ 1`, val: `${trees} ${unit}` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>
              {isEn
                ? `We convert kilometers to meters: ${formattedDistKm} · 1,000 ＝ ${distM} m. Intervals:`
                : `Μετατρέπουμε τα χιλιόμετρα σε μέτρα: ${formattedDistKm} · 1.000 ＝ ${distM} m. Βρίσκουμε τον αριθμό των ίσων διαστημάτων:`}
            </span>
            <Fraction num={distM} den={treeSpacingM} />
            <span>
              ＝ {intervals}. {isEn ? 'Since trees are planted at both ends:' : 'Επειδή φυτεύεται δέντρο και στην αρχή και στο τέλος, προσθέτουμε 1:'}{' '}
              {intervals} ＋ 1 ＝ {trees} {unit}.
            </span>
          </span>
        ),
        distractors: wrongOpts
      };
    }
  },
  {
    id: 'p_len_hard_4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const rM = 2.4;
      const rDm = 18;
      const rCm = 350;
      const sumM = rM + rDm / 10 + rCm / 100;
      const formattedSum = formatNum(sumM, locale, 2);
      const formattedRM = formatNum(rM, locale, 1);
      const formattedRDmM = formatNum(rDm / 10, locale, 1);
      const formattedRCmM = formatNum(rCm / 100, locale, 1);

      const wrongOpts = [
        `${formatNum(sumM + 1, locale, 2)} m`,
        `${formatNum(Math.max(1, sumM - 1), locale, 2)} m`,
        `${formatNum(sumM + 0.5, locale, 2)} m`
      ];

      return {
        title: isEn ? 'Connecting Pipes of Mixed Units' : 'Σύνθεση Σωλήνα με Διαφορετικές Μονάδες',
        prompt: isEn
          ? `We connect three pipe sections end to end: the first is ${formattedRM} m long, the second is ${rDm} dm, and the third is ${rCm} cm. What is the total length of the pipe in meters (m)? (write only the number)`
          : `Ενώνουμε διαδοχικά τρία κομμάτια σωλήνα: το πρώτο έχει μήκος ${formattedRM} m, το δεύτερο ${rDm} dm και το τρίτο ${rCm} cm. Πόσα μέτρα (m) είναι το συνολικό μήκος του νέου σωλήνα; (γράψε μόνο τον αριθμό)`,
        promptMcq: isEn
          ? `We connect three pipe sections end to end: the first is ${formattedRM} m long, the second is ${rDm} dm, and the third is ${rCm} cm. What is the total length of the pipe in meters (m)?`
          : `Ενώνουμε διαδοχικά τρία κομμάτια σωλήνα: το πρώτο έχει μήκος ${formattedRM} m, το δεύτερο ${rDm} dm και το τρίτο ${rCm} cm. Πόσα μέτρα (m) είναι το συνολικό μήκος του νέου σωλήνα;`,
        unit: 'm',
        correctVal: formattedSum,
        correctText: `${formattedSum} m`,
        tableData: [
          { item: isEn ? '1st section' : '1ο Τμήμα', formula: `${formattedRM} m`, val: `${formattedRM} m` },
          {
            item: isEn ? '2nd section in m' : '2ο Τμήμα σε m',
            formula: (
              <span className="inline-flex items-center">
                <Fraction num={rDm} den="10" />
              </span>
            ),
            val: `${formattedRDmM} m`
          },
          {
            item: isEn ? '3rd section in m' : '3ο Τμήμα σε m',
            formula: (
              <span className="inline-flex items-center">
                <Fraction num={rCm} den="100" />
              </span>
            ),
            val: `${formattedRCmM} m`
          },
          { item: isEn ? 'Total length' : 'Συνολικό μήκος', formula: `${formattedRM} ＋ ${formattedRDmM} ＋ ${formattedRCmM}`, val: `${formattedSum} m` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>
              {isEn
                ? `Convert all sections into meters: 1st: ${formattedRM} m, 2nd:`
                : `Μετατρέπουμε όλα τα τμήματα σε μέτρα: 1ο: ${formattedRM} m, 2ο:`}
            </span>
            <Fraction num={rDm} den="10" />
            <span>＝ {formattedRDmM} m, {isEn ? '3rd:' : '3ο:'}</span>
            <Fraction num={rCm} den="100" />
            <span>
              ＝ {formattedRCmM} m. {isEn ? 'Total:' : 'Προσθέτουμε:'} {formattedRM} ＋ {formattedRDmM} ＋ {formattedRCmM} ＝ {formattedSum} m.
            </span>
          </span>
        ),
        distractors: wrongOpts
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions(locale) {
  const isEn = locale === 'en';

  // Q1: Input - Μετατροπή m σε cm
  const q1M = Number((randInt(2, 8) + pickRandom([0.2, 0.4, 0.5, 0.75])).toFixed(2));
  const q1Cm = Number((q1M * 100).toFixed(0));
  const q1FormattedM = formatNum(q1M, locale, 2);

  // Q2: MCQ - Βασική σχέση και μονάδα αναφοράς
  const q2Correct = isEn ? 'The meter (m)' : 'Το μέτρο (m)';
  const q2Wrong = [
    isEn ? 'The kilometer (km)' : 'Το χιλιόμετρο (km)',
    isEn ? 'The centimeter (cm)' : 'Το εκατοστόμετρο (cm)',
    isEn ? 'The square meter (m²)' : 'Το τετραγωνικό μέτρο (m²)'
  ];
  const q2Options = makeUniqueOptions(q2Correct, q2Wrong);

  // Q3: Input - Μετατροπή cm σε m
  const q3Cm = randInt(12, 65) * 10 + pickRandom([0, 5]);
  const q3M = Number((q3Cm / 100).toFixed(2));
  const q3FormattedM = formatNum(q3M, locale, 2);

  // Q4: MCQ - Κανόνας μετατροπών στη σκάλα
  const q4Correct = isEn
    ? 'We multiply when converting to a smaller unit and divide when converting to a larger unit'
    : 'Πολλαπλασιάζουμε όταν πηγαίνουμε σε μικρότερη μονάδα και διαιρούμε όταν πηγαίνουμε σε μεγαλύτερη';
  const q4Wrong = [
    isEn ? 'We always divide by 10 for any unit change' : 'Διαιρούμε πάντα με το 10 σε οποιαδήποτε αλλαγή μονάδας',
    isEn ? 'We add 100 when moving down steps' : 'Προσθέτουμε 100 όταν κατεβαίνουμε σκαλοπάτια',
    isEn ? 'We remove zeros regardless of the unit' : 'Αφαιρούμε μηδενικά ανεξάρτητα από τη μονάδα'
  ];
  const q4Options = makeUniqueOptions(q4Correct, q4Wrong);

  // Q5: Input - Μετατροπή m σε km
  const q5M = randInt(15, 85) * 100;
  const q5Km = Number((q5M / 1000).toFixed(3));
  const q5FormattedKm = formatNum(q5Km, locale, 3);

  // Q6: MCQ - Ισοδυναμία υποδιαιρέσεων του μέτρου
  const q6Correct = '1 m ＝ 10 dm ＝ 100 cm ＝ 1.000 mm';
  const q6Wrong = [
    '1 m ＝ 100 dm ＝ 10 cm ＝ 1.000 mm',
    '1 m ＝ 10 dm ＝ 1.000 cm ＝ 100 mm',
    '1 km ＝ 100 m ＝ 1.000 dm'
  ];
  const q6Options = makeUniqueOptions(q6Correct, q6Wrong);

  // Q7: Standard Problem (Input)
  const spIndex1 = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q7Data = STANDARD_PROBLEMS_POOL[spIndex1].generate(locale);

  // Q8: Standard Problem (MCQ)
  let spIndex2 = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  while (spIndex2 === spIndex1) spIndex2 = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q8Data = STANDARD_PROBLEMS_POOL[spIndex2].generate(locale);
  const q8Options = makeUniqueOptions(q8Data.correctText, q8Data.distractors);

  // Q9: Hard Problem (Input)
  const hpIndex1 = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q9Data = HARD_PROBLEMS_POOL[hpIndex1].generate(locale);

  // Q10: Hard Problem (MCQ)
  let hpIndex2 = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  while (hpIndex2 === hpIndex1) hpIndex2 = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q10Data = HARD_PROBLEMS_POOL[hpIndex2].generate(locale);
  const q10Options = makeUniqueOptions(q10Data.correctText, q10Data.distractors);

  return [
    {
      id: 'q1',
      type: 'input',
      inputType: 'number',
      title: isEn ? 'Converting Meters to Centimeters' : 'Μετατροπή από Μέτρα σε Εκατοστά',
      prompt: isEn
        ? `How many centimeters (cm) is ${q1FormattedM} m? (write only the number)`
        : `Πόσα εκατοστά (cm) είναι τα ${q1FormattedM} m; (γράψε μόνο τον αριθμό)`,
      correct: String(q1Cm),
      explain: isEn
        ? `To convert meters (m) to centimeters (cm) we move down two steps, so we multiply by 100: ${q1FormattedM} · 100 ＝ ${q1Cm} cm.`
        : `Για να μετατρέψουμε μέτρα (m) σε εκατοστά (cm) κατεβαίνουμε δύο σκαλοπάτια, άρα πολλαπλασιάζουμε με το 100: ${q1FormattedM} · 100 ＝ ${q1Cm} cm.`
    },
    {
      id: 'q2',
      type: 'mcq',
      title: isEn ? 'Base Unit of Measurement' : 'Βασική Μονάδα Μέτρησης',
      prompt: isEn
        ? 'What is the base unit of length in the International System of Units?'
        : 'Ποια είναι η βασική μονάδα μέτρησης του μήκους στο Διεθνές Σύστημα Μονάδων;',
      options: q2Options,
      correct: q2Correct,
      explain: isEn
        ? 'The base unit of length is the meter (m). All other units (km, dm, cm, mm) are multiples or subdivisions.'
        : 'Βασική μονάδα μέτρησης του μήκους είναι το μέτρο (m). Όλες οι υπόλοιπες μονάδες (km, dm, cm, mm) είναι πολλαπλάσια ή υποδιαιρέσεις του.'
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'decimal',
      title: isEn ? 'Converting Centimeters to Meters' : 'Μετατροπή από Εκατοστά σε Μέτρα',
      prompt: isEn
        ? `How many meters (m) is ${q3Cm} cm? (write only the number)`
        : `Πόσα μέτρα (m) είναι τα ${q3Cm} cm; (γράψε μόνο τον αριθμό)`,
      correct: q3FormattedM,
      explain: (
        <span className="inline-flex flex-wrap items-center gap-1">
          <span>
            {isEn
              ? 'To convert centimeters (cm) to meters (m) we move up two steps, so we divide by 100:'
              : 'Για να μετατρέψουμε εκατοστά (cm) σε μέτρα (m) ανεβαίνουμε δύο σκαλοπάτια, άρα διαιρούμε με το 100:'}
          </span>
          <Fraction num={q3Cm} den="100" />
          <span>＝ {q3FormattedM} m.</span>
        </span>
      )
    },
    {
      id: 'q4',
      type: 'mcq',
      title: isEn ? 'Metric Ladder Rule' : 'Κανόνας Μετατροπής Σκάλας',
      prompt: isEn
        ? 'What is the correct mathematical rule for converting between length units?'
        : 'Ποιος είναι ο σωστός κανόνας για τις μετατροπές των μονάδων μήκους;',
      options: q4Options,
      correct: q4Correct,
      explain: isEn
        ? 'When converting to a smaller unit we multiply by powers of 10. When converting to a larger unit, we divide accordingly.'
        : 'Όταν μετατρέπουμε από μεγαλύτερη σε μικρότερη μονάδα πολλαπλασιάζουμε με δυνάμεις του 10 (10, 100, 1.000). Όταν μετατρέπουμε από μικρότερη σε μεγαλύτερη, διαιρούμε αντίστοιχα.'
    },
    {
      id: 'q5',
      type: 'input',
      inputType: 'decimal',
      title: isEn ? 'Converting Meters to Kilometers' : 'Μετατροπή από Μέτρα σε Χιλιόμετρα',
      prompt: isEn
        ? `How many kilometers (km) is ${q5M} m? (write only the number)`
        : `Πόσα χιλιόμετρα (km) είναι τα ${q5M} m; (γράψε μόνο τον αριθμό)`,
      correct: q5FormattedKm,
      explain: (
        <span className="inline-flex flex-wrap items-center gap-1">
          <span>
            {isEn
              ? 'Since 1 km ＝ 1,000 m, we divide meters by 1,000:'
              : 'Επειδή 1 km ＝ 1.000 m, για να μετατρέψουμε μέτρα σε χιλιόμετρα διαιρούμε με το 1.000:'}
          </span>
          <Fraction num={q5M} den="1.000" />
          <span>＝ {q5FormattedKm} km.</span>
        </span>
      )
    },
    {
      id: 'q6',
      type: 'mcq',
      title: isEn ? 'Equivalence of Subdivisions' : 'Ισοδυναμία Υποδιαιρέσεων',
      prompt: isEn
        ? 'Which of the following equivalences is mathematically correct?'
        : 'Ποια από τις παρακάτω σχέσεις ισοδυναμίας είναι απολύτως σωστή;',
      options: q6Options,
      correct: q6Correct,
      explain: isEn
        ? 'Every meter strictly divides into 10 decimeters (dm), 100 centimeters (cm), and 1,000 millimeters (mm).'
        : 'Κάθε μέτρο χωρίζεται ακριβώς σε 10 δεκατόμετρα (dm), 100 εκατοστόμετρα (cm) και 1.000 χιλιοστόμετρα (mm).'
    },
    {
      id: 'q7',
      type: 'input',
      inputType: 'decimal',
      title: `${isEn ? 'Problem' : 'Πρόβλημα'}: ${q7Data.title}`,
      prompt: q7Data.prompt,
      correct: q7Data.correctVal,
      tableData: q7Data.tableData,
      explain: q7Data.explain
    },
    {
      id: 'q8',
      type: 'mcq',
      title: `${isEn ? 'Problem' : 'Πρόβλημα'}: ${q8Data.title}`,
      prompt: q8Data.promptMcq || q8Data.prompt,
      options: q8Options,
      correct: q8Data.correctText,
      tableData: q8Data.tableData,
      explain: q8Data.explain
    },
    {
      id: 'q9',
      type: 'input',
      inputType: 'decimal',
      title: `${isEn ? 'Advanced Problem' : 'Σύνθετο Πρόβλημα'}: ${q9Data.title}`,
      prompt: q9Data.prompt,
      correct: q9Data.correctVal,
      tableData: q9Data.tableData,
      explain: q9Data.explain
    },
    {
      id: 'q10',
      type: 'mcq',
      title: `${isEn ? 'Advanced Problem' : 'Σύνθετο Πρόβλημα'}: ${q10Data.title}`,
      prompt: q10Data.promptMcq || q10Data.prompt,
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

export default function MikosExercisesPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';

  const t = useMemo(() => {
    return {
      el: {
        pageTitle: "Ασκήσεις: Μονάδες Μήκους & Μετατροπές - ΣΤ' Δημοτικού | LearnMaths.gr",
        metaDescription: "Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στις μονάδες μέτρησης μήκους, τις μετατροπές κλίμακας και τις περιμέτρους για τη ΣΤ' Δημοτικού.",
        backText: "ΣΤ' Δημοτικού",
        theoryBtn: "Θεωρία",
        heroBadge: "ΚΕΦΑΛΑΙΟ 59 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
        heroTitle: "Διαδραστικές Ασκήσεις: Μονάδες Μήκους",
        heroDesc: "Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στη σκάλα μετατροπών των μονάδων μήκους (km, m, dm, cm, mm), στους υπολογισμούς περιμέτρου και σε πρακτικά προβλήματα!",
        newSetBtn: "Νέες Ασκήσεις",
        exerciseLabel: "Άσκηση",
        inputPlaceholderNumber: "Απάντηση...",
        inputPlaceholderDecimal: "π.χ. 4,25",
        tableHeaderElement: "Στοιχείο",
        tableHeaderFormula: "Ανάλυση / Μετατροπή",
        tableHeaderVal: "Τιμή",
        feedbackSuccess: "🎯 Εξαιρετικά!",
        feedbackExplanation: "💡 Επεξήγηση:",
        checkBtn: "Έλεγχος Απαντήσεων",
        scoreLabel: "Σκορ",
        answeredLabel: "Απαντήθηκαν",
        pctLabel: "Ποσοστό",
        footerPrompt: "Απάντησε και στις 10 ερωτήσεις και πάτησε «Έλεγχος Απαντήσεων»!"
      },
      en: {
        pageTitle: "Exercises: Length Units & Conversions - 6th Grade | LearnMaths.gr",
        metaDescription: "Interactive exercises with 10 questions and auto-grading on metric length units, scale conversions, and perimeters for 6th Grade.",
        backText: "6th Grade",
        theoryBtn: "Theory",
        heroBadge: "CHAPTER 59 • 6TH GRADE • PRACTICE",
        heroTitle: "Interactive Exercises: Units of Length",
        heroDesc: "Solve the 10 dynamic questions to master metric unit conversions (km, m, dm, cm, mm), geometric perimeters, and everyday word problems!",
        newSetBtn: "New Exercises",
        exerciseLabel: "Exercise",
        inputPlaceholderNumber: "Answer...",
        inputPlaceholderDecimal: "e.g. 4.25",
        tableHeaderElement: "Component",
        tableHeaderFormula: "Step / Conversion",
        tableHeaderVal: "Value",
        feedbackSuccess: "🎯 Excellent!",
        feedbackExplanation: "💡 Explanation:",
        checkBtn: "Check Answers",
        scoreLabel: "Score",
        answeredLabel: "Answered",
        pctLabel: "Percentage",
        footerPrompt: "Answer all 10 questions and click “Check Answers”!"
      }
    }[locale];
  }, [locale]);

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewSet = useCallback(() => {
    const qList = generateQuestions(locale);
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
  }, [locale]);

  useEffect(() => {
    loadNewSet();
  }, [loadNewSet]);

  const handleAnswerChange = (id, rawValue, type) => {
    if (submitted) return;
    if (type === 'input') {
      const q = questions.find(item => item.id === id);
      let sanitized = String(rawValue);
      if (q?.inputType === 'number') {
        sanitized = sanitized.replace(/[^0-9]/g, '');
      } else if (q?.inputType === 'decimal') {
        const sep = locale === 'en' ? '.' : ',';
        const otherSep = locale === 'en' ? ',' : '.';
        sanitized = sanitized.replace(new RegExp(`\\${otherSep}`, 'g'), sep);
        const allowedRegex = locale === 'en' ? /[^0-9.]/g : /[^0-9,]/g;
        sanitized = sanitized.replace(allowedRegex, '');
        const parts = sanitized.split(sep);
        if (parts.length > 2) sanitized = parts[0] + sep + parts.slice(1).join('');
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
      const cleanUser = userVal.replace(/\./g, ',').replace(/\s+/g, '').replace(/(cm|m|km|dm|mm)/gi, '').trim().toLowerCase();
      const cleanTarget = String(q.correct).replace(/\./g, ',').replace(/\s+/g, '').replace(/(cm|m|km|dm|mm)/gi, '').trim().toLowerCase();

      if (cleanUser === cleanTarget) return true;

      if (q.inputType === 'decimal') {
        const numUser = parseFloat(cleanUser.replace(',', '.'));
        const numTarget = parseFloat(cleanTarget.replace(',', '.'));
        return !isNaN(numUser) && !isNaN(numTarget) && Math.abs(numUser - numTarget) <= 0.05;
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
      title={t.pageTitle}
      description={t.metaDescription}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/59-mikos"
          className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border border-blue-200 transition shrink-0"
        >
          <span>📖</span>
          <span>{toCleanUppercase(t.theoryBtn)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8 box-border">
        
        {/* HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="space-y-2 max-w-3xl min-w-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-sky-200 break-words [overflow-wrap:anywhere]">
                <span>{toCleanUppercase(t.heroBadge)}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight break-words [overflow-wrap:anywhere]">
                {t.heroTitle}
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed break-words [overflow-wrap:anywhere]">
                {t.heroDesc}
              </p>
            </div>

            <button
              type="button"
              onClick={loadNewSet}
              className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-black shadow-md transition transform active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 shrink-0 touch-manipulation"
            >
              <span>🔄</span>
              <span>{toCleanUppercase(t.newSetBtn)}</span>
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
                  className={`p-5 sm:p-7 rounded-3xl border flex flex-col justify-between transition-all min-w-0 overflow-hidden ${getCardStyle(q)}`}
                >
                  <div className="min-w-0">
                    {/* CARD HEADER */}
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <span className="text-xs font-black px-3 py-1 bg-sky-100 text-sky-900 rounded-full uppercase tracking-wider break-words [overflow-wrap:anywhere]">
                        {toCleanUppercase(`${t.exerciseLabel} ${qNum}`)}: {toCleanUppercase(q.title)}
                      </span>
                      {submitted && (
                        <span className="text-xl shrink-0">
                          {isQuestionCorrect(q) ? '✅' : '❌'}
                        </span>
                      )}
                    </div>

                    {/* PROMPT (NO-GIVEAWAY: ΜΟΝΟ ΕΚΦΩΝΗΣΗ) */}
                    <div className="text-slate-800 text-sm sm:text-base leading-relaxed font-semibold mb-3 break-words [overflow-wrap:anywhere]">
                      {q.prompt}
                    </div>

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
                              className={`p-3 rounded-2xl text-xs sm:text-sm font-mono font-bold border text-center transition touch-manipulation active:scale-95 break-words [overflow-wrap:anywhere] whitespace-normal leading-snug flex-1 flex items-center justify-center min-h-[48px] ${
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
                          placeholder={q.inputType === 'decimal' ? t.inputPlaceholderDecimal : t.inputPlaceholderNumber}
                          className="w-full p-3 bg-white border-2 border-slate-200 rounded-2xl font-bold text-center text-base sm:text-lg focus:border-indigo-500 outline-none disabled:bg-slate-100 font-mono tracking-wider shadow-inner"
                        />
                      </div>
                    )}
                  </div>

                  {/* POST-SUBMISSION FEEDBACK & TABLEDATA (NO-GIVEAWAY) */}
                  {submitted && (
                    <div className="mt-4 pt-3 border-t border-slate-200/70 space-y-3 min-w-0">
                      {q.tableData && (
                        <div className="w-full overflow-x-auto bg-white/90 p-2.5 rounded-2xl border border-slate-200">
                          <table className="w-full text-xs text-left text-slate-700">
                            <thead>
                              <tr className="border-b border-slate-200 font-black text-slate-500 uppercase">
                                <th className="p-1.5">{toCleanUppercase(t.tableHeaderElement)}</th>
                                <th className="p-1.5">{toCleanUppercase(t.tableHeaderFormula)}</th>
                                <th className="p-1.5">{toCleanUppercase(t.tableHeaderVal)}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-mono">
                              {q.tableData.map((row, rIdx) => (
                                <tr key={rIdx}>
                                  <td className="p-1.5 font-sans font-bold text-slate-900 break-words [overflow-wrap:anywhere]">
                                    {row.item}
                                  </td>
                                  <td className="p-1.5 text-indigo-700 align-middle">
                                    {row.formula}
                                  </td>
                                  <td className="p-1.5 font-black text-emerald-700">
                                    {row.val}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      <div
                        className={`p-3 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed break-words [overflow-wrap:anywhere] ${
                          isQuestionCorrect(q)
                            ? 'bg-emerald-100 text-emerald-950 border border-emerald-200'
                            : 'bg-rose-100 text-rose-950 border border-rose-200'
                        }`}
                      >
                        <p className="font-bold mb-1">
                          {isQuestionCorrect(q) ? t.feedbackSuccess : t.feedbackExplanation}
                        </p>
                        <div className="leading-relaxed">{q.explain}</div>
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
                <span>{toCleanUppercase(t.checkBtn)}</span>
              </button>
            </div>
          )}
        </form>
      </div>

      {/* FIXED BOTTOM SCORE FOOTER */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6 z-50">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          
          {/* SCORE & PERCENTAGE */}
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-sm sm:text-base md:text-lg flex items-center gap-2 shadow-sm">
              <span>🏆</span>
              <span>{submitted ? toCleanUppercase(t.scoreLabel) : toCleanUppercase(t.answeredLabel)}:</span>
              <span className="font-mono text-lg sm:text-xl md:text-2xl">
                {submitted ? score : answeredCount} / 10
              </span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                {toCleanUppercase(t.pctLabel)}:{' '}
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
                <span>{toCleanUppercase(t.newSetBtn)}</span>
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden sm:block">
                {t.footerPrompt}
              </p>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}