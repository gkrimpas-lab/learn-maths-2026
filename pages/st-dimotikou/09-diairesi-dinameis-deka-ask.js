import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

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
  if (!Array.isArray(array)) return [];
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function formatNum(val, locale = 'el', decimals = 3) {
  if (val === '' || val === null || val === undefined || isNaN(val)) return '0';
  if (Number.isInteger(val)) return String(val);
  const rounded = Number(val.toFixed(decimals));
  return locale === 'en' ? String(rounded) : String(rounded).replace('.', ',');
}

function formatNumber(num, locale = 'el') {
  if (num === '' || num === null || num === undefined || isNaN(num)) return '0';
  return Number(num).toLocaleString(locale === 'en' ? 'en-US' : 'el-GR');
}

const renderFraction = (num, den) =>
  `<span class="inline-flex flex-col text-center align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full">` +
  `<span class="border-b border-current px-0.5 sm:px-1 pb-0.5 break-all">${num}</span>` +
  `<span class="pt-0.5 break-all">${den}</span>` +
  `</span>`;

function makeUniqueOptions(correct, wrongCandidates) {
  const unique = new Set([String(correct)]);
  for (const opt of wrongCandidates) {
    if (opt !== undefined && opt !== null && String(opt).trim() !== '') {
      unique.add(String(opt));
    }
    if (unique.size === 4) break;
  }
  let offset = 1;
  while (unique.size < 4) {
    unique.add(`${String(correct)} (${offset})`);
    offset++;
  }
  return shuffle(Array.from(unique)).map((text) => ({
    text,
    isCorrect: text === String(correct)
  }));
}

const REAL_WORLD_ITEMS = {
  el: [
    { item: 'λίτρα νερού', total: 450, group: 10, unit: 'λίτρα ανά δοχείο' },
    { item: 'ευρώ προϋπολογισμού', total: 1250, group: 100, unit: '€ ανά μαθητή' },
    { item: 'μέτρα καλωδίου', total: 3800, group: 1000, unit: 'μέτρα ανά πηνίο' },
    { item: 'γραμμάρια αλεύρι', total: 2500, group: 100, unit: 'γραμμάρια ανά πακέτο' },
    { item: 'σελίδες φωτοτυπιών', total: 840, group: 10, unit: 'σελίδες ανά πακέτο' }
  ],
  en: [
    { item: 'liters of water', total: 450, group: 10, unit: 'liters per container' },
    { item: 'euros of budget', total: 1250, group: 100, unit: '€ per student' },
    { item: 'meters of cable', total: 3800, group: 1000, unit: 'meters per spool' },
    { item: 'grams of flour', total: 2500, group: 100, unit: 'grams per pack' },
    { item: 'photocopy pages', total: 840, group: 10, unit: 'pages per bundle' }
  ]
};

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'p_div10_std_1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const totalCost = randInt(120, 350);
      const students = 100;
      const costPerStudent = Number((totalCost / students).toFixed(2));
      const costStr = `${formatNum(costPerStudent, locale, 2)} €`;

      return {
        title: isEn ? 'BOOK EXPENSE ALLOCATION' : 'ΚΑΤΑΝΟΜΗ ΚΟΣΤΟΥΣ ΒΙΒΛΙΩΝ',
        instruction: isEn ? 'Calculate amount per student in euros (€):' : 'Υπολογίστε το ποσό ανά μαθητή σε ευρώ (€) με κόμμα:',
        text: isEn
          ? `A group of ${students} students collected ${totalCost} € to buy books. How many euros (€) correspond to each student?`
          : `Μια ομάδα ${students} μαθητών συγκέντρωσε ${totalCost} € για την αγορά βιβλίων. Πόσα ευρώ (€) αντιστοιχούν σε κάθε μαθητή;`,
        tableData: {
          col1: isEn ? 'Total Amount' : 'Συνολικό Ποσό',
          col2: isEn ? 'Students' : 'Μαθητές',
          r1: [`${totalCost} €`, isEn ? `${students} students` : `${students} μαθητές`],
          r2: [isEn ? 'Division' : 'Διαίρεση', costStr]
        },
        correctVal: costPerStudent,
        correctStr: formatNum(costPerStudent, locale, 2),
        explanation: isEn
          ? `Shift decimal point 2 places left: ${totalCost} : ${students} ＝ ${costStr}.`
          : `Μετακινούμε την υποδιαστολή 2 θέσεις αριστερά: ${totalCost} : ${students} ＝ ${costStr}.`
      };
    }
  },
  {
    id: 'p_div10_std_2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const lengthM = randInt(12, 35) + 0.5;
      const divisor = 0.1;
      const pieces = Number((lengthM / divisor).toFixed(0));
      const unitPiece = isEn ? 'pieces' : 'κομμάτια';

      return {
        title: isEn ? 'CUTTING FABRIC INTO TENTHS' : 'ΚΟΠΗ ΥΦΑΣΜΑΤΟΣ ΣΕ ΔΕΚΑΤΑ',
        instruction: isEn ? 'Calculate how many pieces resulted (integer):' : 'Υπολογίστε πόσα κομμάτια προέκυψαν (ακέραιος):',
        text: isEn
          ? `A fabric length of ${formatNum(lengthM, locale)} m was cut into pieces of ${formatNum(divisor, locale)} m each. How many pieces resulted in total?`
          : `Ένα ύφασμα μήκους ${formatNum(lengthM, locale)} m κόπηκε σε κομμάτια μήκους 0,1 m το καθένα. Πόσα κομμάτια προέκυψαν συνολικά;`,
        tableData: {
          col1: isEn ? 'Fabric Length' : 'Μήκος Υφάσματος',
          col2: isEn ? 'Piece Length' : 'Μήκος Κομματιού',
          r1: [`${formatNum(lengthM, locale)} m`, `${formatNum(divisor, locale)} m`],
          r2: [isEn ? 'Division' : 'Διαίρεση', `${pieces} ${unitPiece}`]
        },
        correctVal: pieces,
        correctStr: String(pieces),
        explanation: isEn
          ? `Dividing by 0.1 is equivalent to multiplying by 10 (shift 1 place right): ${formatNum(lengthM, locale)} : 0.1 ＝ ${pieces} ${unitPiece}.`
          : `Η διαίρεση με το 0,1 ισοδυναμεί με πολλαπλασιασμό επί 10 (μετακίνηση 1 θέση δεξιά): ${formatNum(lengthM, locale)} : 0,1 ＝ ${pieces} κομμάτια.`
      };
    }
  },
  {
    id: 'p_div10_std_3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const totalG = randInt(250, 950);
      const divisor = 1000;
      const kg = Number((totalG / divisor).toFixed(3));
      const kgStr = `${formatNum(kg, locale, 3)} kg`;

      return {
        title: isEn ? 'CONVERTING GRAMS TO KILOGRAMS' : 'ΜΕΤΑΤΡΟΠΗ ΓΡΑΜΜΑΡΙΩΝ ΣΕ ΚΙΛΑ',
        instruction: isEn ? 'Calculate weight in kilograms (kg):' : 'Υπολογίστε το βάρος σε κιλά (kg) με κόμμα:',
        text: isEn
          ? `A box of sweets weighs ${totalG} g. What is the weight in kilograms (kg), knowing that 1 kg ＝ 1,000 g?`
          : `Ένα κουτί γλυκών ζυγίζει ${totalG} g. Πόσα κιλά (kg) είναι το βάρος του κουτιού, αν γνωρίζουμε ότι 1 kg ＝ 1.000 g;`,
        tableData: {
          col1: isEn ? 'Weight in grams' : 'Βάρος σε γραμμάρια',
          col2: isEn ? 'Conversion to kg' : 'Αναγωγή σε κιλά',
          r1: [`${totalG} g`, isEn ? ': 1,000' : ': 1.000'],
          r2: [isEn ? 'Calculation' : 'Υπολογισμός', kgStr]
        },
        correctVal: kg,
        correctStr: formatNum(kg, locale, 3),
        explanation: isEn
          ? `Convert grams to kilograms by dividing by 1,000 (3 places left): ${totalG} : 1,000 ＝ ${kgStr}.`
          : `Μετατρέπουμε τα γραμμάρια σε κιλά διαιρώντας με το 1.000 (3 θέσεις αριστερά): ${totalG} : 1.000 ＝ ${kgStr}.`
      };
    }
  },
  {
    id: 'p_div10_std_4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const totalL = randInt(150, 480);
      const bottles = 10;
      const perBottle = Number((totalL / bottles).toFixed(1));
      const perBottleStr = `${formatNum(perBottle, locale, 1)} L`;

      return {
        title: isEn ? 'EQUAL DISTRIBUTION OF JUICE' : 'ΙΣΟΜΕΡΗΣ ΚΑΤΑΝΟΜΗ ΧΥΜΟΥ ΣΕ ΔΟΧΕΙΑ',
        instruction: isEn ? 'Calculate volume per container in liters (L):' : 'Υπολογίστε τον όγκο ανά δοχείο σε λίτρα (L) με κόμμα:',
        text: isEn
          ? `An amount of ${totalL} L of juice was divided equally into ${bottles} large containers. How many liters (L) does each container hold?`
          : `Μια ποσότητα ${totalL} L χυμού μοιράστηκε εξίσου σε ${bottles} μεγάλα δοχεία. Πόσα λίτρα (L) χυμού περιέχει το κάθε δοχείο;`,
        tableData: {
          col1: isEn ? 'Total Juice' : 'Συνολικός Χυμός',
          col2: isEn ? 'Containers' : 'Δοχεία',
          r1: [`${totalL} L`, isEn ? `${bottles} containers` : `${bottles} δοχεία`],
          r2: [isEn ? 'Division' : 'Διαίρεση', perBottleStr]
        },
        correctVal: perBottle,
        correctStr: formatNum(perBottle, locale, 1),
        explanation: isEn
          ? `Shift decimal point 1 place left: ${totalL} : 10 ＝ ${perBottleStr}.`
          : `Μετακινούμε την υποδιαστολή 1 θέση αριστερά: ${totalL} : 10 ＝ ${perBottleStr}.`
      };
    }
  },
  {
    id: 'p_div10_std_5',
    generate: (locale) => {
      const isEn = locale === 'en';
      const wireM = randInt(24, 68);
      const divisor = 0.01;
      const pieces = Number((wireM / divisor).toFixed(0));
      const unitPiece = isEn ? 'pieces' : 'κομμάτια';

      return {
        title: isEn ? 'CUTTING WIRE INTO HUNDREDTHS' : 'ΚΟΠΗ ΣΥΡΜΑΤΟΣ ΣΕ ΕΚΑΤΟΣΤΑ',
        instruction: isEn ? 'Calculate how many pieces resulted (integer):' : 'Υπολογίστε πόσα κομμάτια προέκυψαν (ακέραιος):',
        text: isEn
          ? `A wire ${wireM} m long was cut into small pieces of ${formatNum(divisor, locale)} m (1 cm) each. How many pieces were formed in total?`
          : `Ένα σύρμα μήκους ${wireM} m κόπηκε σε μικρά κομματάκια μήκους 0,01 m (1 cm) το καθένα. Πόσα κομμάτια σχηματίστηκαν συνολικά;`,
        tableData: {
          col1: isEn ? 'Total Length' : 'Συνολικό Μήκος',
          col2: isEn ? 'Piece Length' : 'Μήκος Τεμαχίου',
          r1: [`${wireM} m`, `${formatNum(divisor, locale)} m`],
          r2: [isEn ? 'Division' : 'Διαίρεση', `${formatNumber(pieces, locale)} ${unitPiece}`]
        },
        correctVal: pieces,
        correctStr: String(pieces),
        explanation: isEn
          ? `Dividing by 0.01 is equivalent to multiplying by 100 (2 places right): ${wireM} : 0.01 ＝ ${formatNumber(pieces, locale)} ${unitPiece}.`
          : `Η διαίρεση με το 0,01 ισοδυναμεί με πολλαπλασιασμό επί 100 (2 θέσεις δεξιά): ${wireM} : 0,01 ＝ ${formatNumber(pieces, locale)} κομμάτια.`
      };
    }
  },
  {
    id: 'p_div10_std_6',
    generate: (locale) => {
      const isEn = locale === 'en';
      const lengthM = randInt(4500, 8500);
      const divisor = 1000;
      const km = Number((lengthM / divisor).toFixed(2));
      const kmStr = `${formatNum(km, locale, 2)} km`;

      return {
        title: isEn ? 'CONVERTING METERS TO KILOMETERS' : 'ΜΕΤΑΤΡΟΠΗ ΜΕΤΡΩΝ ΣΕ ΧΙΛΙΟΜΕΤΡΑ',
        instruction: isEn ? 'Calculate distance in kilometers (km):' : 'Υπολογίστε την απόσταση σε χιλιόμετρα (km) με κόμμα:',
        text: isEn
          ? `A cycling route is ${formatNumber(lengthM, locale)} m long. How many kilometers (km) is that, knowing that 1 km ＝ 1,000 m?`
          : `Μια διαδρομή ποδηλασίας έχει μήκος ${formatNumber(lengthM, locale)} m. Πόσα χιλιόμετρα (km) είναι η απόσταση αυτή, αν γνωρίζουμε ότι 1 km ＝ 1.000 m;`,
        tableData: {
          col1: isEn ? 'Meters' : 'Μέτρα',
          col2: isEn ? 'Conversion to km' : 'Αναγωγή σε km',
          r1: [`${formatNumber(lengthM, locale)} m`, isEn ? ': 1,000' : ': 1.000'],
          r2: [isEn ? 'Result' : 'Αποτέλεσμα', kmStr]
        },
        correctVal: km,
        correctStr: formatNum(km, locale, 2),
        explanation: isEn
          ? `Convert meters to kilometers by dividing by 1,000 (3 places left): ${formatNumber(lengthM, locale)} : 1,000 ＝ ${kmStr}.`
          : `Μετατρέπουμε τα μέτρα σε χιλιόμετρα διαιρώντας με το 1.000 (3 θέσεις αριστερά): ${formatNumber(lengthM, locale)} : 1.000 ＝ ${kmStr}.`
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'p_div10_hard_1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const totalCost = randInt(150, 480);
      const students = 100;
      const costPerStudent = Number((totalCost / students).toFixed(2));
      const correctStr = `${formatNum(costPerStudent, locale, 2)} €`;
      const fake1 = `${formatNum(costPerStudent * 10, locale, 2)} €`;
      const fake2 = `${formatNum(costPerStudent / 10, locale, 3)} €`;
      const fake3 = `${formatNum(costPerStudent + 1.5, locale, 2)} €`;

      const options = makeUniqueOptions(correctStr, [fake1, fake2, fake3]);

      return {
        title: isEn ? 'SCHOOL TRIP EXPENSE ALLOCATION' : 'ΚΑΤΑΝΟΜΗ ΕΞΟΔΩΝ ΣΧΟΛΙΚΗΣ ΕΚΔΡΟΜΗΣ',
        instruction: isEn ? 'Select the correct cost per student in euros (€):' : 'Επιλέξτε το σωστό ποσό ανά μαθητή σε ευρώ (€):',
        text: isEn
          ? `For a field trip of ${students} students, a total of ${totalCost} € was collected for tickets. How many euros (€) correspond to each student?`
          : `Για μια εκδρομή ${students} μαθητών συγκεντρώθηκαν συνολικά ${totalCost} € για εισιτήρια. Πόσα ευρώ (€) αντιστοιχούν σε κάθε μαθητή;`,
        tableData: {
          col1: isEn ? 'Total Amount' : 'Συνολικό Ποσό',
          col2: isEn ? 'Students' : 'Μαθητές',
          r1: [`${totalCost} €`, isEn ? `${students} students` : `${students} μαθητές`],
          r2: [isEn ? 'Division' : 'Διαίρεση', correctStr]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Shift decimal point 2 places left: ${totalCost} : ${students} ＝ ${correctStr}.`
          : `Μετακινούμε την υποδιαστολή 2 θέσεις αριστερά: ${totalCost} : ${students} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_div10_hard_2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const lengthM = randInt(14, 38) + 0.5;
      const divisor = 0.1;
      const pieces = Number((lengthM / divisor).toFixed(0));
      const unitPiece = isEn ? 'pieces' : 'κομμάτια';
      const correctStr = `${pieces} ${unitPiece}`;
      const fake1 = `${pieces + 10} ${unitPiece}`;
      const fake2 = `${Math.max(1, pieces - 15)} ${unitPiece}`;
      const fake3 = `${pieces * 2} ${unitPiece}`;

      const options = makeUniqueOptions(correctStr, [fake1, fake2, fake3]);

      return {
        title: isEn ? 'COUNTING CUT PIECES OF FABRIC' : 'ΚΑΤΑΜΕΤΡΗΣΗ ΚΟΜΜΑΤΙΩΝ ΥΦΑΣΜΑΤΟΣ',
        instruction: isEn ? 'Select the total number of pieces:' : 'Επιλέξτε το συνολικό πλήθος των κομματιών:',
        text: isEn
          ? `A piece of fabric ${formatNum(lengthM, locale)} m long was cut into pieces measuring ${formatNum(divisor, locale)} m each. How many pieces resulted in total?`
          : `Ένα ύφασμα μήκους ${formatNum(lengthM, locale)} m κόπηκε σε κομμάτια μήκους 0,1 m το καθένα. Πόσα κομμάτια προέκυψαν συνολικά;`,
        tableData: {
          col1: isEn ? 'Fabric Length' : 'Μήκος Υφάσματος',
          col2: isEn ? 'Piece Length' : 'Μήκος Κομματιού',
          r1: [`${formatNum(lengthM, locale)} m`, `${formatNum(divisor, locale)} m`],
          r2: [isEn ? 'Division' : 'Διαίρεση', correctStr]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Dividing by 0.1 is equivalent to multiplying by 10: ${formatNum(lengthM, locale)} : 0.1 ＝ ${correctStr}.`
          : `Η διαίρεση με το 0,1 ισοδυναμεί με πολλαπλασιασμό επί 10: ${formatNum(lengthM, locale)} : 0,1 ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_div10_hard_3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const totalG = randInt(450, 950);
      const divisor = 1000;
      const kg = Number((totalG / divisor).toFixed(3));
      const correctStr = `${formatNum(kg, locale, 3)} kg`;
      const fake1 = `${formatNum(kg * 10, locale, 2)} kg`;
      const fake2 = `${formatNum(kg / 10, locale, 4)} kg`;
      const fake3 = `${formatNum(kg + 0.5, locale, 3)} kg`;

      const options = makeUniqueOptions(correctStr, [fake1, fake2, fake3]);

      return {
        title: isEn ? 'CONVERTING SWEET BOX MASS TO KG' : 'ΜΕΤΑΤΡΟΠΗ ΜΑΖΑΣ ΣΥΣΚΕΥΑΣΙΑΣ ΣΕ ΚΙΛΑ',
        instruction: isEn ? 'Select the correct weight in kilograms (kg):' : 'Επιλέξτε το σωστό βάρος σε κιλά (kg):',
        text: isEn
          ? `A box of sweets weighs ${totalG} g. What is its weight in kilograms (kg), given that 1 kg ＝ 1,000 g?`
          : `Ένα κουτί γλυκών ζυγίζει ${totalG} g. Πόσα κιλά (kg) είναι το βάρος του κουτιού, αν γνωρίζουμε ότι 1 kg ＝ 1.000 g;`,
        tableData: {
          col1: isEn ? 'Weight in grams' : 'Βάρος σε γραμμάρια',
          col2: isEn ? 'Conversion to kg' : 'Αναγωγή σε κιλά',
          r1: [`${totalG} g`, isEn ? ': 1,000' : ': 1.000'],
          r2: [isEn ? 'Result' : 'Αποτέλεσμα', correctStr]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Convert grams to kilograms by dividing by 1,000 (3 places left): ${totalG} : 1,000 ＝ ${correctStr}.`
          : `Μετατρέπουμε τα γραμμάρια σε κιλά διαιρώντας με το 1.000 (3 θέσεις αριστερά): ${totalG} : 1.000 ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_div10_hard_4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const totalL = randInt(12, 35);
      const divisor = 0.01;
      const cups = Number((totalL / divisor).toFixed(0));
      const unitCup = isEn ? 'cups' : 'φλιτζάνια';
      const correctStr = `${formatNumber(cups, locale)} ${unitCup}`;
      const fake1 = `${formatNumber(cups + 100, locale)} ${unitCup}`;
      const fake2 = `${formatNumber(Math.max(50, cups - 200), locale)} ${unitCup}`;
      const fake3 = `${formatNumber(cups * 2, locale)} ${unitCup}`;

      const options = makeUniqueOptions(correctStr, [fake1, fake2, fake3]);

      return {
        title: isEn ? 'SERVING TEA INTO SMALL CUPS' : 'ΣΕΡΒΙΡΙΣΜΑ ΤΣΑΓΙΟΥ ΣΕ ΦΛΙΤΖΑΝΙΑ',
        instruction: isEn ? 'Select how many cups will be filled:' : 'Επιλέξτε πόσα φλιτζάνια θα γεμίσουν:',
        text: isEn
          ? `A container holds ${totalL} L of tea. If served in small cups of ${formatNum(divisor, locale)} L (10 mL) each, how many cups will be filled in total?`
          : `Ένα δοχείο περιέχει ${totalL} L τσάι. Αν σερβιριστεί σε φλιτζανάκια χωρητικότητας 0,01 L (10 mL) το καθένα, πόσα τέτοια φλιτζάνια θα γεμίσουν συνολικά;`,
        tableData: {
          col1: isEn ? 'Total Volume' : 'Συνολικός Όγκος',
          col2: isEn ? 'Cup Capacity' : 'Χωρητικότητα Φλιτζανιού',
          r1: [`${totalL} L`, `${formatNum(divisor, locale)} L`],
          r2: [isEn ? 'Division' : 'Διαίρεση', correctStr]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Divide by 0.01 (equivalent to multiplying by 100): ${totalL} : 0.01 ＝ ${correctStr}.`
          : `Διαιρούμε με το 0,01 (ισοδυναμεί με πολλαπλασιασμό επί 100): ${totalL} : 0,01 ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_div10_hard_5',
    generate: (locale) => {
      const isEn = locale === 'en';
      const lengthCm = randInt(350, 850);
      const divisor = 100;
      const m = Number((lengthCm / divisor).toFixed(2));
      const correctStr = `${formatNum(m, locale, 2)} m`;
      const fake1 = `${formatNum(m * 10, locale, 1)} m`;
      const fake2 = `${formatNum(m / 10, locale, 3)} m`;
      const fake3 = `${formatNum(m + 1.2, locale, 2)} m`;

      const options = makeUniqueOptions(correctStr, [fake1, fake2, fake3]);

      return {
        title: isEn ? 'CONVERTING WOODEN PLANK LENGTH TO METERS' : 'ΜΕΤΑΤΡΟΠΗ ΜΗΚΟΥΣ ΣΑΝΙΔΑΣ ΣΕ ΜΕΤΡΑ',
        instruction: isEn ? 'Select the correct length in meters (m):' : 'Επιλέξτε το σωστό μήκος σε μέτρα (m):',
        text: isEn
          ? `A wooden plank is ${lengthCm} cm long. What is its length in meters (m), knowing that 1 m ＝ 100 cm?`
          : `Μια ξύλινη σανίδα έχει μήκος ${lengthCm} cm. Πόσα μέτρα (m) είναι το μήκος της, αν γνωρίζουμε ότι 1 m ＝ 100 cm;`,
        tableData: {
          col1: isEn ? 'Length in cm' : 'Μήκος σε εκατοστά',
          col2: isEn ? 'Conversion to meters' : 'Αναγωγή σε μέτρα',
          r1: [`${lengthCm} cm`, ': 100'],
          r2: [isEn ? 'Result' : 'Αποτέλεσμα', correctStr]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Convert centimeters to meters by dividing by 100 (2 places left): ${lengthCm} : 100 ＝ ${correctStr}.`
          : `Μετατρέπουμε τα εκατοστά σε μέτρα διαιρώντας με το 100 (2 θέσεις αριστερά): ${lengthCm} : 100 ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_div10_hard_6',
    generate: (locale) => {
      const isEn = locale === 'en';
      const budget = randInt(1500, 4500);
      const workers = 100;
      const bonus = Number((budget / workers).toFixed(2));
      const correctStr = `${formatNum(bonus, locale, 2)} €`;
      const fake1 = `${formatNum(bonus * 10, locale, 2)} €`;
      const fake2 = `${formatNum(bonus / 10, locale, 3)} €`;
      const fake3 = `${formatNum(bonus + 10, locale, 2)} €`;

      const options = makeUniqueOptions(correctStr, [fake1, fake2, fake3]);

      return {
        title: isEn ? 'COMPANY BONUS DISTRIBUTION' : 'ΔΙΑΝΟΜΗ ΕΤΑΙΡΙΚΟΥ ΕΠΙΔΟΜΑΤΟΣ',
        instruction: isEn ? 'Select the bonus amount per employee in euros (€):' : 'Επιλέξτε το ποσό ανά εργαζόμενο σε ευρώ (€):',
        text: isEn
          ? `A company allocated ${formatNumber(budget, locale)} € as a bonus to be distributed equally among ${workers} employees. How many euros (€) will each employee receive?`
          : `Μια εταιρεία διέθεσε ${formatNumber(budget, locale)} € ως επίδομα που θα μοιραστεί ισόποσα σε ${workers} εργαζομένους. Πόσα ευρώ (€) θα λάβει ο καθένας;`,
        tableData: {
          col1: isEn ? 'Total Bonus' : 'Συνολικό Επίδομα',
          col2: isEn ? 'Employees' : 'Εργαζόμενοι',
          r1: [`${formatNumber(budget, locale)} €`, isEn ? `${workers} employees` : `${workers} άτομα`],
          r2: [isEn ? 'Division' : 'Διαίρεση', correctStr]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Shift decimal point 2 places left: ${formatNumber(budget, locale)} : 100 ＝ ${correctStr}.`
          : `Μετακινούμε την υποδιαστολή 2 θέσεις αριστερά: ${formatNumber(budget, locale)} : 100 ＝ ${correctStr}.`
      };
    }
  }
];

function generateQuestions(locale = 'el') {
  const isEn = locale === 'en';
  const sep = isEn ? '.' : ',';
  const qList = [];
  const itemsPool = REAL_WORLD_ITEMS[locale] || REAL_WORLD_ITEMS.el;
  const shuffledItems = shuffle(itemsPool);

  // Q1 (Input): Διαίρεση με 10, 100, 1.000
  {
    const q1Int = randInt(12, 95);
    const q1Dec = randInt(1, 9);
    const q1Div = [10, 100, 1000][randInt(0, 2)];
    const q1Val = parseFloat(`${q1Int}.${q1Dec}`);
    const q1RawAns = parseFloat((q1Val / q1Div).toFixed(5));
    const q1Correct = q1RawAns;
    const q1CorrectStr = formatNum(q1RawAns, locale, 5);
    const q1Prompt = `${q1Int}${sep}${q1Dec} : ${formatNumber(q1Div, locale)}`;

    qList.push({
      id: 1,
      type: 'decimal_input',
      title: isEn ? 'QUESTION 1 • DIVISION BY 10, 100, 1,000' : 'ΕΡΩΤΗΣΗ 1 • ΔΙΑΙΡΕΣΗ ΜΕ 10, 100, 1.000',
      instruction: isEn ? 'Calculate quotient by shifting the decimal point:' : 'Υπολογίστε το πηλίκο μετακινώντας την υποδιαστολή (με κόμμα):',
      prompt: isEn ? `Calculate: ${q1Prompt}:` : `Υπολογίστε: ${q1Prompt};`,
      correctVal: q1Correct,
      correctStr: q1CorrectStr,
      explanation: isEn
        ? `Dividing by ${formatNumber(q1Div, locale)}, shift decimal point ${q1Div === 10 ? '1 place' : q1Div === 100 ? '2 places' : '3 places'} left: ${q1Prompt} ＝ ${q1CorrectStr}.`
        : `Διαιρώντας με το ${formatNumber(q1Div, locale)}, μετακινούμε την υποδιαστολή ${q1Div === 10 ? '1 θέση' : q1Div === 100 ? '2 θέσεις' : '3 θέσεις'} προς τα αριστερά: ${q1Prompt} ＝ ${q1CorrectStr}.`
    });
  }

  // Q2 (Input): Διαίρεση με 0,1, 0,01, 0,001
  {
    const q2Int = randInt(2, 48);
    const q2Dec = randInt(1, 9);
    const q2Div = [0.1, 0.01, 0.001][randInt(0, 2)];
    const q2Val = parseFloat(`${q2Int}.${q2Dec}`);
    const q2RawAns = parseFloat((q2Val / q2Div).toFixed(2));
    const q2Correct = q2RawAns;
    const q2CorrectStr = formatNum(q2RawAns, locale, 2);
    const q2DivStr = formatNum(q2Div, locale);
    const q2Prompt = `${q2Int}${sep}${q2Dec} : ${q2DivStr}`;

    qList.push({
      id: 2,
      type: 'decimal_input',
      title: isEn ? 'QUESTION 2 • DIVISION BY 0.1, 0.01, 0.001' : 'ΕΡΩΤΗΣΗ 2 • ΔΙΑΙΡΕΣΗ ΜΕ 0,1, 0,01, 0,001',
      instruction: isEn ? 'Calculate quotient by shifting the decimal point:' : 'Υπολογίστε το πηλίκο μετακινώντας την υποδιαστολή (με κόμμα):',
      prompt: isEn ? `Calculate: ${q2Prompt}:` : `Υπολογίστε: ${q2Prompt};`,
      correctVal: q2Correct,
      correctStr: q2CorrectStr,
      explanation: isEn
        ? `Dividing by ${q2DivStr}, shift decimal point ${q2Div === 0.1 ? '1 place' : q2Div === 0.01 ? '2 places' : '3 places'} right: ${q2Prompt} ＝ ${q2CorrectStr}.`
        : `Διαιρώντας με το ${q2DivStr}, μετακινούμε την υποδιαστολή ${q2Div === 0.1 ? '1 θέση' : q2Div === 0.01 ? '2 θέσεις' : '3 θέσεις'} προς τα δεξιά: ${q2Prompt} ＝ ${q2CorrectStr}.`
    });
  }

  // Q3 (MCQ): Εύρεση του διαιρέτη που λείπει
  {
    const q3Int = randInt(15, 85);
    const q3Dec = randInt(1, 9);
    const q3ValStr = `${q3Int}${sep}${q3Dec}`;
    const q3DivType = randInt(1, 4);
    let q3CorrectDiv = '100';
    let q3ResultStr = '';

    if (q3DivType === 1) {
      q3CorrectDiv = '10';
      q3ResultStr = formatNum(parseFloat(`${q3Int}.${q3Dec}`) / 10, locale, 2);
    } else if (q3DivType === 2) {
      q3CorrectDiv = '100';
      q3ResultStr = formatNum(parseFloat(`${q3Int}.${q3Dec}`) / 100, locale, 3);
    } else if (q3DivType === 3) {
      q3CorrectDiv = isEn ? '1,000' : '1.000';
      q3ResultStr = formatNum(parseFloat(`${q3Int}.${q3Dec}`) / 1000, locale, 4);
    } else {
      q3CorrectDiv = isEn ? '0.1' : '0,1';
      q3ResultStr = formatNum(parseFloat(`${q3Int}.${q3Dec}`) / 0.1, locale, 1);
    }

    const allCandidates = ['10', '100', isEn ? '1,000' : '1.000', isEn ? '0.1' : '0,1', isEn ? '0.01' : '0,01'];
    const wrongCandidates = allCandidates.filter((d) => d !== q3CorrectDiv);
    const options = makeUniqueOptions(q3CorrectDiv, wrongCandidates);

    qList.push({
      id: 3,
      type: 'mcq',
      title: isEn ? 'QUESTION 3 • FINDING MISSING DIVISOR' : 'ΕΡΩΤΗΣΗ 3 • ΕΥΡΕΣΗ ΔΙΑΙΡΕΤΗ',
      instruction: isEn ? 'Find the missing divisor:' : 'Βρείτε τον διαιρέτη που λείπει:',
      prompt: isEn ? `In equality ${q3ValStr} : x ＝ ${q3ResultStr}, what is x?` : `Στην ισότητα ${q3ValStr} : χ ＝ ${q3ResultStr}, ποιος είναι ο αριθμός χ;`,
      options,
      correctText: q3CorrectDiv,
      explanation: isEn
        ? `To get from ${q3ValStr} to ${q3ResultStr}, the decimal point shifted accordingly. The correct divisor is ${q3CorrectDiv}.`
        : `Για να φτάσουμε από το ${q3ValStr} στο ${q3ResultStr}, η υποδιαστολή μετακινήθηκε κατάλληλα. Ο σωστός διαιρέτης είναι το ${q3CorrectDiv}.`
    });
  }

  // Q4 (MCQ): Πρόβλημα Καθημερινότητας
  {
    const q4Item = shuffledItems[0];
    const q4Val = parseFloat((q4Item.total / q4Item.group).toFixed(2));
    const q4Correct = `${formatNum(q4Val, locale, 2)} ${q4Item.unit}`;
    const q4Wrong1 = `${formatNum(q4Val * 10, locale, 2)} ${q4Item.unit}`;
    const q4Wrong2 = `${formatNum(q4Val / 10, locale, 2)} ${q4Item.unit}`;
    const q4Wrong3 = `${formatNum(q4Item.total + q4Item.group, locale, 2)} ${q4Item.unit}`;

    const options = makeUniqueOptions(q4Correct, [q4Wrong1, q4Wrong2, q4Wrong3]);

    qList.push({
      id: 4,
      type: 'mcq',
      title: isEn ? 'QUESTION 4 • EVERYDAY PROBLEM' : 'ΕΡΩΤΗΣΗ 4 • ΠΡΟΒΛΗΜΑ ΚΑΘΗΜΕΡΙΝΟΤΗΤΑΣ',
      instruction: isEn ? 'Calculate the result of sharing:' : 'Υπολογίστε το αποτέλεσμα της κατανομής:',
      prompt: isEn
        ? `We share ${formatNumber(q4Item.total, locale)} ${q4Item.item} into ${formatNumber(q4Item.group, locale)} equal parts. How much is each share?`
        : `Μοιράζουμε ${formatNumber(q4Item.total, locale)} ${q4Item.item} σε ${formatNumber(q4Item.group, locale)} ίσα μέρη. Πόσο αντιστοιχεί σε κάθε μέρος;`,
      options,
      correctText: q4Correct,
      explanation: isEn
        ? `Perform division: ${formatNumber(q4Item.total, locale)} : ${formatNumber(q4Item.group, locale)} ＝ ${q4Correct}.`
        : `Υπολογίζουμε τη διαίρεση: ${formatNumber(q4Item.total, locale)} : ${formatNumber(q4Item.group, locale)} ＝ ${q4Correct}.`
    });
  }

  // Q5 (MCQ): True / False - Κανόνας μετατόπισης αριστερά
  {
    const q5IsTrue = Math.random() > 0.5;
    const q5Text = isEn
      ? (q5IsTrue
          ? 'When dividing a decimal number by 100, we shift the decimal point 2 places to the left.'
          : 'When dividing a decimal number by 100, we shift the decimal point 2 places to the right.')
      : (q5IsTrue
          ? 'Όταν διαιρούμε έναν δεκαδικό αριθμό με το 100, μετακινούμε την υποδιαστολή 2 θέσεις προς τα αριστερά.'
          : 'Όταν διαιρούμε έναν δεκαδικό αριθμό με το 100, μετακινούμε την υποδιαστολή 2 θέσεις προς τα δεξιά.');

    const labelTrue = isEn ? 'True' : 'Σωστό';
    const labelFalse = isEn ? 'False' : 'Λάθος';
    const correctAns = q5IsTrue ? labelTrue : labelFalse;

    const options = [
      { text: labelTrue, isCorrect: q5IsTrue },
      { text: labelFalse, isCorrect: !q5IsTrue }
    ];

    qList.push({
      id: 5,
      type: 'mcq',
      title: isEn ? 'QUESTION 5 • SHIFTING LEFT RULE' : 'ΕΡΩΤΗΣΗ 5 • ΚΑΝΟΝΑΣ ΜΕΤΑΤΟΠΙΣΗΣ ΑΡΙΣΤΕΡΑ',
      instruction: isEn ? 'Classify statement as True or False:' : 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q5Text}»`,
      options,
      correctText: correctAns,
      explanation: isEn
        ? (q5IsTrue
            ? 'Correct! Dividing by 10, 100, 1,000 decreases the number, so the decimal point moves left.'
            : 'False! Dividing by 100 shifts the decimal point 2 places to the LEFT (not right).')
        : (q5IsTrue
            ? 'Σωστό! Η διαίρεση με 10, 100, 1.000 μικραίνει τον αριθμό, άρα η υποδιαστολή μετακινείται αριστερά.'
            : 'Λάθος! Η διαίρεση με το 100 μετακινεί την υποδιαστολή 2 θέσεις προς τα ΑΡΙΣΤΕΡΑ (όχι δεξιά).')
    });
  }

  // Q6 (MCQ): True / False - Κανόνας μετατόπισης δεξιά
  {
    const q6IsTrue = Math.random() > 0.5;
    const q6Text = isEn
      ? (q6IsTrue
          ? 'Dividing a number by 0.1 increases the number (it is equivalent to multiplying by 10).'
          : 'Dividing a number by 0.01 decreases the number by 100 times.')
      : (q6IsTrue
          ? 'Η διαίρεση ενός αριθμού με το 0,1 μεγαλώνει τον αριθμό (είναι ισοδύναμη με πολλαπλασιασμό επί 10).'
          : 'Η διαίρεση ενός αριθμού με το 0,01 μικραίνει τον αριθμό κατά 100 φορές.');

    const labelTrue = isEn ? 'True' : 'Σωστό';
    const labelFalse = isEn ? 'False' : 'Λάθος';
    const correctAns = q6IsTrue ? labelTrue : labelFalse;

    const options = [
      { text: labelTrue, isCorrect: q6IsTrue },
      { text: labelFalse, isCorrect: !q6IsTrue }
    ];

    qList.push({
      id: 6,
      type: 'mcq',
      title: isEn ? 'QUESTION 6 • SHIFTING RIGHT RULE' : 'ΕΡΩΤΗΣΗ 6 • ΚΑΝΟΝΑΣ ΜΕΤΑΤΟΠΙΣΗΣ ΔΕΞΙΑ',
      instruction: isEn ? 'Classify statement as True or False:' : 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q6Text}»`,
      options,
      correctText: correctAns,
      explanation: isEn
        ? (q6IsTrue
            ? 'Correct! Dividing by 0.1 is equivalent to multiplying by 10, hence the number increases.'
            : 'False! Dividing by 0.01 INCREASES the number by 100 times.')
        : (q6IsTrue
            ? 'Σωστό! Η διαίρεση με το 0,1 ισοδυναμεί με πολλαπλασιασμό επί 10, επομένως ο αριθμός μεγαλώνει.'
            : 'Λάθος! Η διαίρεση με το 0,01 ΜΕΓΑΛΩΝΕΙ τον αριθμό κατά 100 φορές.')
    });
  }

  // Q7 (Input): Οπτική Μετατόπιση Υποδιαστολής
  {
    const q7Int = randInt(12, 85);
    const q7Dec = randInt(1, 9);
    const q7Div = [10, 100][randInt(0, 1)];
    const q7Val = parseFloat(`${q7Int}.${q7Dec}`);
    const q7Ans = q7Val / q7Div;
    const q7AnsStr = formatNum(q7Ans, locale, 3);
    const startStr = `${q7Int}${sep}${q7Dec}`;

    qList.push({
      id: 7,
      type: 'decimal_input',
      title: isEn ? 'QUESTION 7 • VISUAL DECIMAL SHIFT' : 'ΕΡΩΤΗΣΗ 7 • ΟΠΤΙΚΗ ΜΕΤΑΤΟΠΙΣΗ ΥΠΟΔΙΑΣΤΟΛΗΣ',
      instruction: isEn ? 'Calculate the result of shifting the decimal point:' : 'Υπολογίστε το αποτέλεσμα της μετατόπισης με κόμμα:',
      prompt: isEn ? `Calculate: ${startStr} : ${formatNumber(q7Div, locale)}:` : `Υπολογίστε: ${startStr} : ${formatNumber(q7Div, locale)};`,
      startStr,
      div: q7Div,
      correctVal: q7Ans,
      correctStr: q7AnsStr,
      explanation: isEn
        ? `Starting at ${startStr} and jumping ${q7Div === 10 ? '1 step' : '2 steps'} left due to : ${formatNumber(q7Div, locale)}, we find ${q7AnsStr}.`
        : `Ξεκινώντας από το ${startStr} και κάνοντας ${q7Div === 10 ? '1 άλμα' : '2 άλματα'} αριστερά λόγω του : ${formatNumber(q7Div, locale)}, βρίσκουμε ${q7AnsStr}.`
    });
  }

  // Q8 (MCQ): Αναγνώριση Πράξης από Μετατόπιση
  {
    const q8BaseInt = randInt(35, 95);
    const q8BaseDec = randInt(1, 9);
    const q8StartStr = `${q8BaseInt}${sep}${q8BaseDec}`;
    const q8TargetVal = parseFloat((parseFloat(`${q8BaseInt}.${q8BaseDec}`) / 0.1).toFixed(1));
    const q8TargetStr = formatNum(q8TargetVal, locale, 1);
    const q8CorrectDiv = isEn ? ': 0.1' : ': 0,1';

    const rawOptions = [isEn ? ': 0.1' : ': 0,1', ': 10', isEn ? ': 0.01' : ': 0,01', ': 100'];
    const wrongOptions = rawOptions.filter((opt) => opt !== q8CorrectDiv);
    const options = makeUniqueOptions(q8CorrectDiv, wrongOptions);

    qList.push({
      id: 8,
      type: 'mcq',
      title: isEn ? 'QUESTION 8 • IDENTIFYING OPERATION FROM SHIFT' : 'ΕΡΩΤΗΣΗ 8 • ΑΝΑΓΝΩΡΙΣΗ ΠΡΑΞΗΣ ΑΠΟ ΜΕΤΑΤΟΠΙΣΗ',
      instruction: isEn ? 'Select the operation performed:' : 'Επιλέξτε την πράξη που εκτελέστηκε:',
      prompt: isEn ? `Which operation transformed ${q8StartStr} into ${q8TargetStr}?` : `Ποια πράξη μετέτρεψε το ${q8StartStr} σε ${q8TargetStr};`,
      options,
      correctText: q8CorrectDiv,
      explanation: isEn
        ? `The decimal point moved 1 place to the right (from ${q8StartStr} to ${q8TargetStr}), which means the number increased 10 times, representing division by 0.1 (${q8CorrectDiv}).`
        : `Η υποδιαστολή μετακινήθηκε 1 θέση προς τα δεξιά (από ${q8StartStr} σε ${q8TargetStr}), άρα ο αριθμός μεγάλωσε κατά 10 φορές, πράγμα που σημαίνει διαίρεση με το 0,1 (${q8CorrectDiv}).`
    });
  }

  // Q9 & Q10: Προβλήματα από τις δεξαμενές
  {
    const shuffledStd = shuffle([...STANDARD_PROBLEMS_POOL]);
    const shuffledHard = shuffle([...HARD_PROBLEMS_POOL]);
    const stdProb = shuffledStd[0].generate(locale);
    const hardProb = shuffledHard[0].generate(locale);

    qList.push({
      id: 9,
      type: 'decimal_input',
      title: `${isEn ? 'QUESTION 9 • ' : 'ΕΡΩΤΗΣΗ 9 • '}${stdProb.title}`,
      instruction: stdProb.instruction,
      prompt: stdProb.text,
      tableData: stdProb.tableData,
      correctVal: stdProb.correctVal,
      correctStr: stdProb.correctStr,
      explanation: stdProb.explanation
    });

    qList.push({
      id: 10,
      type: 'mcq',
      title: `${isEn ? 'QUESTION 10 • ' : 'ΕΡΩΤΗΣΗ 10 • '}${hardProb.title}`,
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

const UI_STRINGS = {
  el: {
    pageTitle: "Ασκήσεις: Διαίρεση με Δυνάμεις του 10 - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "10 απαιτητικές ασκήσεις και προβλήματα στη διαίρεση με δυνάμεις του 10 για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryBtn: "📖 Θεωρία",
    badgeChapter: "ΚΕΦΑΛΑΙΟ 09 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    heroTitle: "Ασκήσεις & Προβλήματα: Διαίρεση με Δυνάμεις του 10",
    heroDesc: "10 δυναμικές δραστηριότητες μετατόπισης υποδιαστολής με 10, 100, 1.000 και 0,1, 0,01, 0,001 και 4 ρεαλιστικά προβλήματα καθημερινής ζωής.",
    heroDynamicNote: "⚡ Κάθε σετ δημιουργείται δυναμικά με τυχαίους αριθμούς.",
    btnNewSet: "🔄 ΝΕΕΣ ΑΣΚΗΣΕΙΣ",
    badgeCorrect: "✓ ΣΩΣΤΟ",
    badgeWrong: "✗ ΛΑΘΟΣ",
    inputPlaceholder: "Απάντηση...",
    inputNote: "(Ακέραιος ή δεκαδικός με κόμμα)",
    feedbackGreat: "🎉 Εξαιρετικά!",
    feedbackExpl: "💡 Μαθηματική Επεξήγηση:",
    correctAnswerLabel: "Σωστή απάντηση:",
    btnCheckMain: "🎯 Έλεγχος Απαντήσεων",
    scoreLabel: "ΣΚΟΡ",
    answeredLabel: "ΑΠΑΝΤΗΘΗΚΑΝ",
    pctLabel: "ΠΟΣΟΣΤΟ",
    btnCheckBar: "ΕΛΕΓΧΟΣ"
  },
  en: {
    pageTitle: "Exercises: Division by Powers of 10 - Grade 6 | LearnMaths.gr",
    pageDesc: "10 interactive math problems on dividing whole numbers and decimals by powers of 10 for Grade 6.",
    backText: "Grade 6",
    theoryBtn: "📖 Theory",
    badgeChapter: "CHAPTER 09 • GRADE 6 • PRACTICE",
    heroTitle: "Exercises & Problems: Division by Powers of 10",
    heroDesc: "10 dynamic activities covering decimal point shifting with 10, 100, 1,000 and 0.1, 0.01, 0.001, plus applied real-world word problems.",
    heroDynamicNote: "⚡ Each exercise set is dynamically generated with random numbers.",
    btnNewSet: "🔄 NEW EXERCISES",
    badgeCorrect: "✓ CORRECT",
    badgeWrong: "✗ WRONG",
    inputPlaceholder: "Answer...",
    inputNote: "(Integer or decimal number)",
    feedbackGreat: "🎉 Excellent!",
    feedbackExpl: "💡 Mathematical Explanation:",
    correctAnswerLabel: "Correct answer:",
    btnCheckMain: "🎯 Check Answers",
    scoreLabel: "SCORE",
    answeredLabel: "ANSWERED",
    pctLabel: "PERCENTAGE",
    btnCheckBar: "CHECK"
  }
};

export default function DiairesiDinameisDekaExercisesPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = UI_STRINGS[locale];

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewSet = useCallback(() => {
    const q = generateQuestions(locale);
    setQuestions(q);
    setAnswers({});
    setIsSubmitted(false);
    setScore(0);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [locale]);

  useEffect(() => {
    loadNewSet();
  }, [loadNewSet]);

  const handleInputChange = (fieldKey, rawValue) => {
    if (isSubmitted) return;
    let sanitized = rawValue.replace(/[^0-9.,]/g, '');
    const firstSepMatch = sanitized.match(/[,.]/);
    if (firstSepMatch) {
      const sepChar = firstSepMatch[0];
      const parts = sanitized.split(/[,.]/);
      sanitized = parts[0] + sepChar + parts.slice(1).join('');
    }
    if (sanitized.length > 10) {
      sanitized = sanitized.slice(0, 10);
    }
    setAnswers((prev) => ({
      ...prev,
      [fieldKey]: sanitized
    }));
  };

  const handleSelectMCQ = (qId, optionText) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [`q_${qId}`]: optionText
    }));
  };

  const isQuestionCorrect = (q) => {
    if (q.type === 'mcq') {
      return answers[`q_${q.id}`] === q.correctText;
    }
    if (q.type === 'decimal_input') {
      const userValStr = (answers[`q_${q.id}`] || '').trim().replace(',', '.');
      const userVal = parseFloat(userValStr);
      return !isNaN(userVal) && Math.abs(userVal - q.correctVal) < 0.05;
    }
    return false;
  };

  const handleCheckAnswers = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (isSubmitted) return;

    let currentScore = 0;
    questions.forEach((q) => {
      if (isQuestionCorrect(q)) {
        currentScore += 1;
      }
    });

    setScore(currentScore);
    setIsSubmitted(true);
  };

  const answeredCount = Object.values(answers).filter(
    (val) => val !== undefined && val !== null && String(val).trim() !== ''
  ).length;

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/st-dimotikou"
      backText={t.backText}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/09-diairesi-dinameis-deka"
          locale={locale}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>{t.theoryBtn}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 pb-28 sm:pb-36 overflow-x-hidden box-border">
        
        {/* Banner Header */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span className="break-words [overflow-wrap:anywhere]">{t.badgeChapter}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight break-words [overflow-wrap:anywhere] hyphens-auto">
              {t.heroTitle}
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl break-words [overflow-wrap:anywhere]">
              {t.heroDesc}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs sm:text-sm 2xl:text-base text-sky-200 break-words [overflow-wrap:anywhere]">
              {t.heroDynamicNote}
            </span>
            <button
              type="button"
              onClick={loadNewSet}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base touch-manipulation cursor-pointer"
            >
              <span>{t.btnNewSet}</span>
            </button>
          </div>
        </section>

        {/* Λίστα 10 Ασκήσεων */}
        <div className="space-y-6 sm:space-y-8">
          {questions.map((q, idx) => {
            const isCorrect = isSubmitted && isQuestionCorrect(q);

            return (
              <article
                key={`q-${q.id}-${idx}`}
                className={`bg-white rounded-3xl border p-5 sm:p-8 2xl:p-10 shadow-sm transition-all overflow-hidden ${
                  isSubmitted
                    ? isCorrect
                      ? 'border-emerald-400 bg-emerald-50/20'
                      : 'border-rose-400 bg-rose-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Επικεφαλίδα Ερώτησης */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="text-xs 2xl:text-sm font-black tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg break-words [overflow-wrap:anywhere]">
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
                      {isCorrect ? t.badgeCorrect : t.badgeWrong}
                    </span>
                  )}
                </div>

                {/* Εκφώνηση */}
                <div className="space-y-3 mb-5">
                  {q.instruction && (
                    <p className="text-xs sm:text-sm 2xl:text-base font-semibold text-slate-500 break-words [overflow-wrap:anywhere]">
                      {q.instruction}
                    </p>
                  )}
                  <p className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-900 leading-relaxed break-words [overflow-wrap:anywhere] hyphens-auto">
                    {q.prompt}
                  </p>

                  {/* Οπτική Μετατόπιση για την Q7 */}
                  {q.startStr && q.div && (
                    <div className="bg-slate-100 rounded-2xl p-4 my-3 flex justify-center max-w-full overflow-x-auto">
                      <svg viewBox="0 0 300 70" className="w-full max-w-[280px] sm:max-w-xs h-16 select-none shrink-0 overflow-visible">
                        <defs>
                          <marker
                            id="diairesi-ask-arrow-left"
                            viewBox="0 0 10 10"
                            refX="6"
                            refY="5"
                            markerWidth="6"
                            markerHeight="6"
                            orient="auto"
                          >
                            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f59e0b" />
                          </marker>
                        </defs>

                        <text x="210" y="55" fontSize="22" fontWeight="black" fill="#1e293b" fontFamily="monospace">
                          {q.startStr}
                        </text>
                        <path
                          d="M 205 35 Q 155 8 105 35"
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="3.5"
                          markerEnd="url(#diairesi-ask-arrow-left)"
                        />
                        <text x="155" y="16" fontSize="11" fontWeight="black" textAnchor="middle" fill="#d97706">
                          : {formatNumber(q.div, locale)}
                        </text>
                      </svg>
                    </div>
                  )}
                </div>

                {/* Περιοχή Απάντησης */}
                <div className="py-2">
                  {q.type === 'decimal_input' && (
                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        type="text"
                        inputMode="decimal"
                        autoComplete="off"
                        spellCheck="false"
                        maxLength={10}
                        disabled={isSubmitted}
                        placeholder={t.inputPlaceholder}
                        value={answers[`q_${q.id}`] || ''}
                        onChange={(e) => handleInputChange(`q_${q.id}`, e.target.value)}
                        className="w-36 sm:w-44 text-center font-mono font-bold text-base sm:text-lg text-slate-900 bg-white border border-slate-300 rounded-2xl py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed shadow-inner"
                      />
                      <span className="text-xs 2xl:text-sm text-slate-500 font-medium break-words [overflow-wrap:anywhere]">
                        {t.inputNote}
                      </span>
                    </div>
                  )}

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
                            className={`p-3.5 rounded-2xl border text-left font-semibold text-xs sm:text-sm 2xl:text-base transition active:scale-95 touch-manipulation flex items-center justify-between gap-3 min-h-[48px] cursor-pointer ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-700 shadow-sm ring-2 ring-blue-300'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                            } disabled:cursor-not-allowed`}
                          >
                            <span className="break-words [overflow-wrap:anywhere] whitespace-normal leading-snug flex-1">
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

                {/* Feedback μετά την υποβολή */}
                {isSubmitted && (
                  <div
                    className={`mt-4 p-4 rounded-2xl border text-xs sm:text-sm 2xl:text-base leading-relaxed space-y-2.5 overflow-hidden ${
                      isCorrect
                        ? 'bg-emerald-100/60 border-emerald-300 text-emerald-950'
                        : 'bg-rose-100/60 border-rose-300 text-rose-950'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      <span>{isCorrect ? t.feedbackGreat : t.feedbackExpl}</span>
                    </div>

                    {q.tableData && (
                      <div className="w-full max-w-full overflow-x-auto block">
                        <div className="inline-block min-w-full sm:min-w-[320px] bg-white/90 border border-slate-200 rounded-2xl p-3 shadow-inner my-1 font-mono text-xs sm:text-sm">
                          <div className="grid grid-cols-2 gap-3 sm:gap-4 font-bold border-b pb-1.5 text-slate-600 text-center">
                            <span className="bg-blue-100/70 px-2 py-0.5 rounded-lg text-blue-900 break-words [overflow-wrap:anywhere]">{q.tableData.col1}</span>
                            <span className="bg-emerald-100/70 px-2 py-0.5 rounded-lg text-emerald-900 break-words [overflow-wrap:anywhere]">{q.tableData.col2}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2 text-center font-bold text-slate-800">
                            <span className="break-words [overflow-wrap:anywhere]">{q.tableData.r1[0]}</span>
                            <span className="text-indigo-700 font-bold break-words [overflow-wrap:anywhere]">{q.tableData.r1[1]}</span>
                            <span className="break-words [overflow-wrap:anywhere]">{q.tableData.r2[0]}</span>
                            <span className="text-amber-600 font-black break-words [overflow-wrap:anywhere]">{q.tableData.r2[1]}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="break-words [overflow-wrap:anywhere]">{q.explanation}</div>
                    
                    {!isCorrect && (
                      <div className="font-semibold pt-1 text-slate-800">
                        {t.correctAnswerLabel}{' '}
                        <span className="font-mono font-bold text-blue-900 break-words [overflow-wrap:anywhere]">
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

        {/* Κουμπί Ελέγχου στο τέλος της φόρμας */}
        {!isSubmitted && (
          <div className="flex justify-center pt-4">
            <button
              type="button"
              onClick={handleCheckAnswers}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-base sm:text-lg 2xl:text-xl px-8 py-4 rounded-2xl shadow-xl transition active:scale-95 touch-manipulation cursor-pointer"
            >
              <span>{t.btnCheckMain}</span>
            </button>
          </div>
        )}

      </div>

      {/* Fixed Bottom Score Bar */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3.5 px-4 sm:px-8 shadow-2xl">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4 sm:gap-8">
            <div>
              <span className="text-xs text-slate-400 font-semibold block">
                {isSubmitted ? t.scoreLabel : t.answeredLabel}
              </span>
              <span className="font-mono font-black text-lg sm:text-2xl text-amber-300">
                {isSubmitted ? `${score} / 10` : `${answeredCount} / 10`}
              </span>
            </div>

            {isSubmitted && (
              <div className="border-l border-slate-700 pl-4 sm:pl-8">
                <span className="text-xs text-slate-400 font-semibold block">
                  {t.pctLabel}
                </span>
                <span className="font-mono font-black text-lg sm:text-2xl text-emerald-400">
                  {Math.round((score / 10) * 100)} %
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleCheckAnswers}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base shadow-md transition active:scale-95 touch-manipulation cursor-pointer"
              >
                {t.btnCheckBar}
              </button>
            ) : (
              <button
                type="button"
                onClick={loadNewSet}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base shadow-md transition active:scale-95 touch-manipulation cursor-pointer"
              >
                <span>{t.btnNewSet}</span>
              </button>
            )}
          </div>

        </div>
      </footer>
    </Layout>
  );
}