// pages/st-dimotikou/01-fysikoi-ask.js
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
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function formatNumber(num, locale = 'el') {
  if (num === '' || isNaN(num)) return '0';
  return Number(num).toLocaleString(locale === 'en' ? 'en-US' : 'el-GR');
}

function makeUniqueOptions(correct, wrongCandidates, fallbackGenerator) {
  const unique = new Set([String(correct)]);
  for (const opt of wrongCandidates) {
    if (opt !== undefined && opt !== null && String(opt).trim() !== '') {
      unique.add(String(opt));
    }
    if (unique.size === 4) break;
  }
  let attempts = 0;
  while (unique.size < 4 && attempts < 20) {
    attempts++;
    const generated = fallbackGenerator ? fallbackGenerator(unique.size) : null;
    if (generated !== null && generated !== undefined) {
      unique.add(String(generated));
    }
  }
  return shuffle(Array.from(unique));
}

function generateUniqueDigitsNumber() {
  const firstDigits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const allDigits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  const d0 = firstDigits[randInt(0, firstDigits.length - 1)];
  const remaining = allDigits.filter((d) => d !== d0);
  const shuffled = shuffle(remaining);

  const chosen = [d0, ...shuffled.slice(0, 5)];
  return Number(chosen.join(''));
}

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'p_fys_std_1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const digit = randInt(2, 8);
      const tickets = digit * 100000 + randInt(12, 85) * 1000;
      const targetPos = isEn ? 'Hundred Thousands' : 'Εκατοντάδες Χιλιάδων';
      const digitVal = digit * 100000;
      const valStr = formatNumber(digitVal, locale);
      const f1 = formatNumber(digit * 10000, locale);
      const f2 = formatNumber(digit * 1000000, locale);
      const f3 = formatNumber(digit * 1000, locale);

      const uniqueList = makeUniqueOptions(valStr, [f1, f2, f3], (i) =>
        formatNumber(digit * Math.pow(10, i + 1), locale)
      );
      const options = uniqueList.map((text) => ({
        text,
        isCorrect: text === valStr
      }));

      return {
        title: isEn ? 'PLACE VALUE IN TICKETS' : 'ΑΞΙΑ ΘΕΣΗΣ ΣΕ ΕΙΣΙΤΗΡΙΑ',
        inputInstruction: isEn
          ? 'Calculate the numerical value of the digit (integer without spaces/dots):'
          : 'Υπολογίστε την αριθμητική αξία του ψηφίου (ακέραιος χωρίς τελείες):',
        mcqInstruction: isEn
          ? 'Select the exact place value of the digit:'
          : 'Επιλέξτε την πραγματική αριθμητική αξία του ψηφίου:',
        text: isEn
          ? `In an international concert, ${formatNumber(tickets, locale)} tickets were sold. What is the actual value of the ${targetPos} digit (${digit})?`
          : `Σε μια διεθνή συναυλία διατέθηκαν ${formatNumber(tickets, locale)} εισιτήρια. Ποια είναι η πραγματική αριθμητική αξία του ψηφίου των ${targetPos} (${digit});`,
        tableData: {
          col1: isEn ? 'Tickets' : 'Εισιτήρια',
          col2: isEn ? 'Position' : 'Θέση',
          r1: [`${formatNumber(tickets, locale)}`, `${targetPos}`],
          r2: [isEn ? `Digit: ${digit}` : `Ψηφίο: ${digit}`, isEn ? `Value: ${valStr}` : `Αξία: ${valStr}`]
        },
        correctVal: digitVal,
        correctStr: String(digitVal),
        options,
        correctText: valStr,
        explanation: isEn
          ? `The digit of ${targetPos} is ${digit}, so its place value is ${digit} · 100,000 ＝ ${valStr}.`
          : `Το ψηφίο των ${targetPos} είναι το ${digit}, άρα η αξία του είναι ${digit} · 100.000 ＝ ${valStr}.`
      };
    }
  },
  {
    id: 'p_fys_std_2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const pA = randInt(35, 75) * 10000;
      const diff = randInt(12, 35) * 1000;
      const pB = pA + diff;
      const unitLabel = isEn ? 'residents' : 'κάτοικοι';
      const correctStr = `${formatNumber(diff, locale)} ${unitLabel}`;
      const f1 = `${formatNumber(diff + 10000, locale)} ${unitLabel}`;
      const f2 = `${formatNumber(Math.max(1000, diff - 10000), locale)} ${unitLabel}`;
      const f3 = `${formatNumber(diff + 5000, locale)} ${unitLabel}`;

      const uniqueList = makeUniqueOptions(correctStr, [f1, f2, f3], (i) =>
        `${formatNumber(diff + (i + 1) * 2000, locale)} ${unitLabel}`
      );
      const options = uniqueList.map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: isEn ? 'REGIONAL POPULATION COMPARISON' : 'ΣΥΓΚΡΙΣΗ ΠΛΗΘΥΣΜΟΥ ΠΕΡΙΦΕΡΕΙΩΝ',
        inputInstruction: isEn
          ? 'Calculate the population difference (integer without spaces/dots):'
          : 'Υπολογίστε τη διαφορά πληθυσμού (ακέραιος χωρίς τελείες):',
        mcqInstruction: isEn
          ? 'Select how many more residents the larger region has:'
          : 'Επιλέξτε πόσους περισσότερους κατοίκους έχει η μεγαλύτερη περιφέρεια:',
        text: isEn
          ? `Two neighboring regions have populations of ${formatNumber(pB, locale)} and ${formatNumber(pA, locale)} residents. How many more residents does the larger region have?`
          : `Δύο όμορες περιφέρειες έχουν πληθυσμούς ${formatNumber(pB, locale)} και ${formatNumber(pA, locale)} κατοίκους. Πόσους περισσότερους κατοίκους έχει η μεγαλύτερη περιφέρεια;`,
        tableData: {
          col1: isEn ? 'Region A' : 'Περιφέρεια Α',
          col2: isEn ? 'Region B' : 'Περιφέρεια Β',
          r1: [`${formatNumber(pB, locale)} ${isEn ? 'res.' : 'κατ.'}`, `${formatNumber(pA, locale)} ${isEn ? 'res.' : 'κατ.'}`],
          r2: [isEn ? 'Difference' : 'Διαφορά', `${formatNumber(diff, locale)} ${isEn ? 'res.' : 'κατ.'}`]
        },
        correctVal: diff,
        correctStr: String(diff),
        options,
        correctText: correctStr,
        explanation: isEn
          ? `We subtract the smaller population from the larger: ${formatNumber(pB, locale)} － ${formatNumber(pA, locale)} ＝ ${formatNumber(diff, locale)} residents.`
          : `Αφαιρούμε τον μικρότερο αριθμό από τον μεγαλύτερο: ${formatNumber(pB, locale)} － ${formatNumber(pA, locale)} ＝ ${formatNumber(diff, locale)} κάτοικοι.`
      };
    }
  },
  {
    id: 'p_fys_std_3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const thousands = randInt(250, 650);
      const fullNum = thousands * 1000;
      const unitLabel = isEn ? 'thousands' : 'χιλιάδες';
      const correctStr = `${formatNumber(thousands, locale)} ${unitLabel}`;
      const f1 = `${formatNumber(Math.max(10, thousands - 10), locale)} ${unitLabel}`;
      const f2 = `${formatNumber(Math.floor(thousands / 10), locale)} ${unitLabel}`;
      const f3 = `${formatNumber(thousands + 100, locale)} ${unitLabel}`;

      const uniqueList = makeUniqueOptions(correctStr, [f1, f2, f3], (i) =>
        `${formatNumber(thousands + (i + 1) * 20, locale)} ${unitLabel}`
      );
      const options = uniqueList.map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: isEn ? 'VIDEO VIEWS IN THOUSANDS' : 'ΚΑΤΑΜΕΤΡΗΣΗ ΠΡΟΒΟΛΩΝ ΣΕ ΧΙΛΙΑΔΕΣ',
        inputInstruction: isEn
          ? 'Calculate the total number of thousands (integer):'
          : 'Υπολογίστε το πλήθος των χιλιάδων (ακέραιος χωρίς τελείες):',
        mcqInstruction: isEn
          ? 'Select how many whole thousands of views the video gathered:'
          : 'Επιλέξτε πόσες ακέραιες χιλιάδες προβολών συγκεντρώθηκαν:',
        text: isEn
          ? `An educational video gained ${formatNumber(fullNum, locale)} views. How many whole thousands of views did the video receive?`
          : `Ένα εκπαιδευτικό βίντεο συγκέντρωσε ${formatNumber(fullNum, locale)} προβολές. Πόσες ακέραιες χιλιάδες προβολών συγκέντρωσε το βίντεο;`,
        tableData: {
          col1: isEn ? 'Views' : 'Προβολές',
          col2: isEn ? 'Unit of Thousands' : 'Μονάδα Χιλιάδων',
          r1: [`${formatNumber(fullNum, locale)}`, isEn ? '1 Thousand ＝ 1,000' : '1 Χιλιάδα ＝ 1.000'],
          r2: [isEn ? 'Divide by 1,000' : 'Διαίρεση με 1.000', `${formatNumber(thousands, locale)}`]
        },
        correctVal: thousands,
        correctStr: String(thousands),
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Divide by 1,000: ${formatNumber(fullNum, locale)} : 1,000 ＝ ${formatNumber(thousands, locale)} thousands.`
          : `Διαιρούμε με το 1.000: ${formatNumber(fullNum, locale)} : 1.000 ＝ ${formatNumber(thousands, locale)} χιλιάδες.`
      };
    }
  },
  {
    id: 'p_fys_std_4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const copies = randInt(12, 45) * 10000;
      const digit = Math.floor(copies / 10000);
      const digitVal = digit * 10000;
      const valStr = formatNumber(digitVal, locale);
      const f1 = formatNumber(digit * 1000, locale);
      const f2 = formatNumber(digit * 100000, locale);
      const f3 = formatNumber(digit * 100, locale);

      const uniqueList = makeUniqueOptions(valStr, [f1, f2, f3], (i) =>
        formatNumber(digit * Math.pow(10, i + 2), locale)
      );
      const options = uniqueList.map((text) => ({
        text,
        isCorrect: text === valStr
      }));

      return {
        title: isEn ? 'PLACE VALUE IN BOOK COPIES' : 'ΑΞΙΑ ΘΕΣΗΣ ΣΕ ΑΝΤΙΤΥΠΑ ΒΙΒΛΙΩΝ',
        inputInstruction: isEn
          ? 'Calculate the value of the Ten Thousands digit:'
          : 'Υπολογίστε την αξία του ψηφίου των Δεκάδων Χιλιάδων:',
        mcqInstruction: isEn
          ? 'Select the exact place value of the Ten Thousands digit:'
          : 'Επιλέξτε την πραγματική αξία του ψηφίου των Δεκάδων Χιλιάδων:',
        text: isEn
          ? `A publishing house printed ${formatNumber(copies, locale)} copies of a dictionary. What is the actual value of the Ten Thousands digit (${digit})?`
          : `Ένας εκδοτικός οίκος τύπωσε ${formatNumber(copies, locale)} αντίτυπα ενός λεξικού. Ποια είναι η πραγματική αξία του ψηφίου των Δεκάδων Χιλιάδων (${digit});`,
        tableData: {
          col1: isEn ? 'Copies' : 'Αντίτυπα',
          col2: isEn ? 'Position' : 'Θέση',
          r1: [`${formatNumber(copies, locale)}`, isEn ? 'Ten Thousands' : 'Δεκάδες Χιλιάδων'],
          r2: [isEn ? `Digit: ${digit}` : `Ψηφίο: ${digit}`, isEn ? `Value: ${valStr}` : `Αξία: ${valStr}`]
        },
        correctVal: digitVal,
        correctStr: String(digitVal),
        options,
        correctText: valStr,
        explanation: isEn
          ? `The digit ${digit} is in the Ten Thousands place, so its value is ${digit} · 10,000 ＝ ${valStr}.`
          : `Το ψηφίο ${digit} βρίσκεται στις Δεκάδες Χιλιάδων, άρα η αξία του είναι ${digit} · 10.000 ＝ ${valStr}.`
      };
    }
  },
  {
    id: 'p_fys_std_5',
    generate: (locale) => {
      const isEn = locale === 'en';
      const year1 = randInt(110, 240) * 1000;
      const diff = randInt(15, 45) * 1000;
      const year2 = year1 + diff;
      const correctStr = `${formatNumber(diff, locale)} kg`;
      const f1 = `${formatNumber(diff + 10000, locale)} kg`;
      const f2 = `${formatNumber(Math.max(1000, diff - 5000), locale)} kg`;
      const f3 = `${formatNumber(diff + 20000, locale)} kg`;

      const uniqueList = makeUniqueOptions(correctStr, [f1, f2, f3], (i) =>
        `${formatNumber(diff + (i + 1) * 3000, locale)} kg`
      );
      const options = uniqueList.map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: isEn ? 'OLIVE OIL PRODUCTION' : 'ΠΑΡΑΓΩΓΗ ΕΛΑΙΟΛΑΔΟΥ',
        inputInstruction: isEn
          ? 'Calculate the increase in production in kilograms (kg):'
          : 'Υπολογίστε την αύξηση της παραγωγής σε κιλά (kg):',
        mcqInstruction: isEn
          ? 'Select how many more kilograms were produced in the second year:'
          : 'Επιλέξτε πόσα κιλά παραπάνω παρήχθησαν τη δεύτερη χρονιά:',
        text: isEn
          ? `A cooperative produced ${formatNumber(year1, locale)} kg of olive oil in Year 1 and ${formatNumber(year2, locale)} kg in Year 2. How many more kilograms (kg) did it produce in Year 2?`
          : `Ένας συνεταιρισμός παρήγαγε ${formatNumber(year1, locale)} kg ελαιόλαδο την πρώτη χρονιά και ${formatNumber(year2, locale)} kg τη δεύτερη χρονιά. Πόσα κιλά (kg) παραπάνω παρήγαγε τη δεύτερη χρονιά;`,
        tableData: {
          col1: isEn ? 'Year 1' : '1η Χρονιά',
          col2: isEn ? 'Year 2' : '2η Χρονιά',
          r1: [`${formatNumber(year1, locale)} kg`, `${formatNumber(year2, locale)} kg`],
          r2: [isEn ? 'Increase' : 'Αύξηση', `${formatNumber(diff, locale)} kg`]
        },
        correctVal: diff,
        correctStr: String(diff),
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Subtract the first year's production: ${formatNumber(year2, locale)} － ${formatNumber(year1, locale)} ＝ ${formatNumber(diff, locale)} kg.`
          : `Αφαιρούμε την παραγωγή του πρώτου έτους: ${formatNumber(year2, locale)} － ${formatNumber(year1, locale)} ＝ ${formatNumber(diff, locale)} kg.`
      };
    }
  },
  {
    id: 'p_fys_std_6',
    generate: (locale) => {
      const isEn = locale === 'en';
      const spectators = randInt(15, 35) * 1000;
      const hundreds = Math.floor(spectators / 100);
      const unitLabel = isEn ? 'hundreds' : 'εκατοντάδες';
      const correctStr = `${formatNumber(hundreds, locale)} ${unitLabel}`;
      const f1 = `${formatNumber(Math.max(10, hundreds - 10), locale)} ${unitLabel}`;
      const f2 = `${formatNumber(Math.floor(hundreds / 10), locale)} ${unitLabel}`;
      const f3 = `${formatNumber(hundreds + 50, locale)} ${unitLabel}`;

      const uniqueList = makeUniqueOptions(correctStr, [f1, f2, f3], (i) =>
        `${formatNumber(hundreds + (i + 1) * 15, locale)} ${unitLabel}`
      );
      const options = uniqueList.map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: isEn ? 'COUNTING SPECTATORS IN HUNDREDS' : 'ΚΑΤΑΜΕΤΡΗΣΗ ΘΕΑΤΩΝ ΣΕ ΕΚΑΤΟΝΤΑΔΕΣ',
        inputInstruction: isEn
          ? 'Calculate the number of hundreds (integer):'
          : 'Υπολογίστε το πλήθος των εκατοντάδων (ακέραιος χωρίς τελείες):',
        mcqInstruction: isEn
          ? 'Select how many whole hundreds of spectators attended:'
          : 'Επιλέξτε πόσες ακέραιες εκατοντάδες θεατών παρακολούθησαν τον αγώνα:',
        text: isEn
          ? `In a soccer championship final, ${formatNumber(spectators, locale)} spectators attended. How many whole hundreds of spectators correspond to this number?`
          : `Σε έναν τελικό ποδοσφαίρου παρευρέθηκαν ${formatNumber(spectators, locale)} θεατές. Πόσες ακέραιες εκατοντάδες θεατών αντιστοιχούν σε αυτόν τον αριθμό;`,
        tableData: {
          col1: isEn ? 'Total Spectators' : 'Συνολικοί Θεατές',
          col2: isEn ? 'Unit of Hundreds' : 'Μονάδα Εκατοντάδων',
          r1: [`${formatNumber(spectators, locale)}`, isEn ? '1 Hundred ＝ 100' : '1 Εκατοντάδα ＝ 100'],
          r2: [isEn ? 'Divide by 100' : 'Διαίρεση με 100', `${formatNumber(hundreds, locale)}`]
        },
        correctVal: hundreds,
        correctStr: String(hundreds),
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Divide by 100: ${formatNumber(spectators, locale)} : 100 ＝ ${formatNumber(hundreds, locale)} hundreds.`
          : `Διαιρούμε με το 100: ${formatNumber(spectators, locale)} : 100 ＝ ${formatNumber(hundreds, locale)} εκατοντάδες θεατών.`
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'p_fys_hard_1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const millions = randInt(4, 9);
      const thousands = randInt(120, 850);
      const units = randInt(150, 950);
      const fullNumber = millions * 1000000 + thousands * 1000 + units;
      const targetDigit = millions;
      const powerVal = targetDigit * 1000000;
      const valStr = formatNumber(powerVal, locale);
      const f1 = formatNumber(targetDigit * 100000, locale);
      const f2 = formatNumber(targetDigit * 10000000, locale);
      const f3 = formatNumber(targetDigit * 10000, locale);

      const uniqueList = makeUniqueOptions(valStr, [f1, f2, f3], (i) =>
        formatNumber(targetDigit * Math.pow(10, i + 3), locale)
      );
      const options = uniqueList.map((text) => ({
        text,
        isCorrect: text === valStr
      }));

      return {
        title: isEn ? 'ARCHAEOLOGICAL DATING PLACE VALUE' : 'ΑΞΙΑ ΘΕΣΗΣ ΣΕ ΑΡΧΑΙΟΛΟΓΙΚΟ ΕΥΡΗΜΑ',
        inputInstruction: isEn
          ? 'Calculate the numerical value of the digit (integer):'
          : 'Υπολογίστε την αριθμητική αξία του ψηφίου (ακέραιος χωρίς τελείες):',
        mcqInstruction: isEn
          ? 'Select how many units the Millions digit represents:'
          : 'Επιλέξτε πόσες μονάδες αξίζει το ψηφίο των Εκατομμυρίων:',
        text: isEn
          ? `The age of an archaeological artifact was estimated at ${formatNumber(fullNumber, locale)} years. What is the exact value of the Millions digit (${targetDigit}) in this number?`
          : `Η ηλικία ενός αρχαιολογικού ευρήματος εκτιμήθηκε στα ${formatNumber(fullNumber, locale)} έτη. Πόσες μονάδες αξίζει το ψηφίο των Εκατομμυρίων (${targetDigit}) μέσα σε αυτόν τον αριθμό;`,
        tableData: {
          col1: isEn ? 'Number of Years' : 'Αριθμός Ετών',
          col2: isEn ? 'Millions Class' : 'Τάξη Εκατομμυρίων',
          r1: [`${formatNumber(fullNumber, locale)}`, isEn ? `Digit: ${targetDigit}` : `Ψηφίο: ${targetDigit}`],
          r2: [isEn ? 'Place Value' : 'Αξία Θέσης', `${valStr}`]
        },
        correctVal: powerVal,
        correctStr: String(powerVal),
        options,
        correctText: valStr,
        explanation: isEn
          ? `The digit ${targetDigit} is in the Millions position, so its value is ${targetDigit} · 1,000,000 ＝ ${valStr}.`
          : `Το ψηφίο ${targetDigit} βρίσκεται στην τάξη των Μονάδων Εκατομμυρίων, άρα η αξία του είναι ${targetDigit} · 1.000.000 ＝ ${valStr}.`
      };
    }
  },
  {
    id: 'p_fys_hard_2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const budget1 = randInt(15, 30) * 1000000;
      const budget2 = randInt(4, 9) * 100000;
      const budget3 = randInt(2, 8) * 10000;
      const totalBudget = budget1 + budget2 + budget3;
      const correctStr = `${formatNumber(totalBudget, locale)} €`;
      const f1 = `${formatNumber(totalBudget + 1000000, locale)} €`;
      const f2 = `${formatNumber(Math.max(10000, totalBudget - 500000), locale)} €`;
      const f3 = `${formatNumber(totalBudget + 200000, locale)} €`;

      const uniqueList = makeUniqueOptions(correctStr, [f1, f2, f3], (i) =>
        `${formatNumber(totalBudget + (i + 1) * 300000, locale)} €`
      );
      const options = uniqueList.map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: isEn ? 'TOTAL SCHOOL BUDGET' : 'ΣΥΝΟΛΙΚΟΣ ΣΧΟΛΙΚΟΣ ΠΡΟΫΠΟΛΟΓΙΣΜΟΣ',
        inputInstruction: isEn
          ? 'Calculate the total budget in euros (€):'
          : 'Υπολογίστε το συνολικό ποσό σε ευρώ (€):',
        mcqInstruction: isEn
          ? 'Select the correct total budget in euros (€):'
          : 'Επιλέξτε το σωστό συνολικό ποσό σε ευρώ (€):',
        text: isEn
          ? `School funding was allocated: ${formatNumber(budget1, locale)} € for facilities, ${formatNumber(budget2, locale)} € for digital equipment, and ${formatNumber(budget3, locale)} € for libraries. What is the total budget in euros (€)?`
          : `Για τη συντήρηση των σχολείων εγκρίθηκαν: ${formatNumber(budget1, locale)} € για κτηριακά, ${formatNumber(budget2, locale)} € για ψηφιακό εξοπλισμό και ${formatNumber(budget3, locale)} € για βιβλιοθήκες. Ποιο είναι το συνολικό ποσό σε ευρώ (€);`,
        tableData: {
          col1: isEn ? 'Budget Breakdown' : 'Επιμέρους Κονδύλια',
          col2: isEn ? 'Total Amount' : 'Σύνολο Προϋπολογισμού',
          r1: [`${formatNumber(budget1, locale)} € ＋ ${formatNumber(budget2, locale)} €`, `＋ ${formatNumber(budget3, locale)} €`],
          r2: [isEn ? 'Sum' : 'Πρόσθεση', `${correctStr}`]
        },
        correctVal: totalBudget,
        correctStr: String(totalBudget),
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Add up the items: ${formatNumber(budget1, locale)} ＋ ${formatNumber(budget2, locale)} ＋ ${formatNumber(budget3, locale)} ＝ ${correctStr}.`
          : `Προσθέτουμε τα επιμέρους ποσά: ${formatNumber(budget1, locale)} ＋ ${formatNumber(budget2, locale)} ＋ ${formatNumber(budget3, locale)} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_fys_hard_3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const dEarthMoon = 384400;
      const trips = randInt(2, 5);
      const totalKm = dEarthMoon * trips;
      const correctStr = `${formatNumber(totalKm, locale)} km`;
      const f1 = `${formatNumber(totalKm + 100000, locale)} km`;
      const f2 = `${formatNumber(Math.max(50000, totalKm - 100000), locale)} km`;
      const f3 = `${formatNumber(totalKm + 50000, locale)} km`;

      const uniqueList = makeUniqueOptions(correctStr, [f1, f2, f3], (i) =>
        `${formatNumber(totalKm + (i + 1) * 40000, locale)} km`
      );
      const options = uniqueList.map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: isEn ? 'SPACE DISTANCE CALCULATION' : 'ΥΠΟΛΟΓΙΣΜΟΣ ΔΙΑΣΤΗΜΙΚΗΣ ΑΠΟΣΤΑΣΗΣ',
        inputInstruction: isEn
          ? 'Calculate the total distance in kilometers (km):'
          : 'Υπολογίστε τη συνολική απόσταση σε χιλιόμετρα (km):',
        mcqInstruction: isEn
          ? 'Select the total distance in kilometers (km):'
          : 'Επιλέξτε τη συνολική απόσταση σε χιλιόμετρα (km):',
        text: isEn
          ? `The average Earth-Moon distance is approximately ${formatNumber(dEarthMoon, locale)} km. How many kilometers (km) will a spacecraft travel completing this journey ${trips} times?`
          : `Η μέση απόσταση Γης - Σελήνης είναι περίπου ${formatNumber(dEarthMoon, locale)} km. Πόσα χιλιόμετρα (km) θα διανύσει ένα διαστημόπλοιο που θα εκτελέσει ${trips} φορές αυτή τη διαδρομή;`,
        tableData: {
          col1: isEn ? 'Single Trip' : 'Μονή Διαδρομή',
          col2: isEn ? 'Number of Trips' : 'Πλήθος Ταξιδιών',
          r1: [`${formatNumber(dEarthMoon, locale)} km`, isEn ? `${trips} trips` : `${trips} ταξίδια`],
          r2: [isEn ? 'Product' : 'Γινόμενο', `${correctStr}`]
        },
        correctVal: totalKm,
        correctStr: String(totalKm),
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Multiply the distance by trips: ${formatNumber(dEarthMoon, locale)} · ${trips} ＝ ${correctStr}.`
          : `Πολλαπλασιάζουμε την απόσταση με τα ταξίδια: ${formatNumber(dEarthMoon, locale)} · ${trips} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_fys_hard_4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const dep1 = randInt(10, 25) * 1000000;
      const dep2 = randInt(300, 750) * 1000;
      const totalDep = dep1 + dep2;
      const correctStr = `${formatNumber(totalDep, locale)} €`;
      const f1 = `${formatNumber(totalDep + 500000, locale)} €`;
      const f2 = `${formatNumber(Math.max(100000, totalDep - 1000000), locale)} €`;
      const f3 = `${formatNumber(totalDep + 250000, locale)} €`;

      const uniqueList = makeUniqueOptions(correctStr, [f1, f2, f3], (i) =>
        `${formatNumber(totalDep + (i + 1) * 350000, locale)} €`
      );
      const options = uniqueList.map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: isEn ? 'CORPORATE BANK DEPOSITS' : 'ΤΡΑΠΕΖΙΚΕΣ ΚΑΤΑΘΕΣΕΙΣ ΕΤΑΙΡΕΙΑΣ',
        inputInstruction: isEn
          ? 'Calculate the total deposits in euros (€):'
          : 'Υπολογίστε τις συνολικές καταθέσεις σε ευρώ (€):',
        mcqInstruction: isEn
          ? 'Select the total deposits in euros (€):'
          : 'Επιλέξτε το συνολικό ποσό καταθέσεων σε ευρώ (€):',
        text: isEn
          ? `A company maintains two accounts with balances of ${formatNumber(dep1, locale)} € and ${formatNumber(dep2, locale)} €. What is the total deposited amount in euros (€)?`
          : `Μια επιχείρηση διατηρεί δύο εταιρικούς λογαριασμούς με καταθέσεις ${formatNumber(dep1, locale)} € και ${formatNumber(dep2, locale)} € αντίστοιχα. Ποιο είναι το συνολικό ποσό των καταθέσεων της επιχείρησης σε ευρώ (€);`,
        tableData: {
          col1: isEn ? 'Account 1' : '1ος Λογαριασμός',
          col2: isEn ? 'Account 2' : '2ος Λογαριασμός',
          r1: [`${formatNumber(dep1, locale)} €`, `${formatNumber(dep2, locale)} €`],
          r2: [isEn ? 'Sum' : 'Άθροισμα', `${correctStr}`]
        },
        correctVal: totalDep,
        correctStr: String(totalDep),
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Add both accounts: ${formatNumber(dep1, locale)} ＋ ${formatNumber(dep2, locale)} ＝ ${correctStr}.`
          : `Προσθέτουμε τους δύο λογαριασμούς: ${formatNumber(dep1, locale)} ＋ ${formatNumber(dep2, locale)} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_fys_hard_5',
    generate: (locale) => {
      const isEn = locale === 'en';
      const highwayKm = randInt(12, 28) * 1000000;
      const bridgeKm = randInt(3, 8) * 100000;
      const totalCost = highwayKm + bridgeKm;
      const correctStr = `${formatNumber(totalCost, locale)} €`;
      const f1 = `${formatNumber(totalCost + 2000000, locale)} €`;
      const f2 = `${formatNumber(Math.max(100000, totalCost - 1000000), locale)} €`;
      const f3 = `${formatNumber(totalCost + 500000, locale)} €`;

      const uniqueList = makeUniqueOptions(correctStr, [f1, f2, f3], (i) =>
        `${formatNumber(totalCost + (i + 1) * 750000, locale)} €`
      );
      const options = uniqueList.map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: isEn ? 'INFRASTRUCTURE INVESTMENTS' : 'ΕΠΕΝΔΥΣΕΙΣ ΟΔΙΚΩΝ ΥΠΟΔΟΜΩΝ',
        inputInstruction: isEn
          ? 'Calculate the total project cost in euros (€):'
          : 'Υπολογίστε το συνολικό κόστος των έργων σε ευρώ (€):',
        mcqInstruction: isEn
          ? 'Select the total infrastructure cost in euros (€):'
          : 'Επιλέξτε το συνολικό κόστος των έργων υποδομής σε ευρώ (€):',
        text: isEn
          ? `For highway construction, ${formatNumber(highwayKm, locale)} € was invested, plus ${formatNumber(bridgeKm, locale)} € for a bridge. What was the total infrastructure expenditure in euros (€)?`
          : `Για την κατασκευή ενός αυτοκινητοδρόμου δαπανήθηκαν ${formatNumber(highwayKm, locale)} € και για μια γέφυρα ${formatNumber(bridgeKm, locale)} €. Πόσα ευρώ (€) δαπανήθηκαν συνολικά για τα δύο έργα;`,
        tableData: {
          col1: isEn ? 'Highway' : 'Αυτοκινητόδρομος',
          col2: isEn ? 'Bridge' : 'Γέφυρα',
          r1: [`${formatNumber(highwayKm, locale)} €`, `${formatNumber(bridgeKm, locale)} €`],
          r2: [isEn ? 'Total Cost' : 'Συνολική Δαπάνη', `${correctStr}`]
        },
        correctVal: totalCost,
        correctStr: String(totalCost),
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Add project costs: ${formatNumber(highwayKm, locale)} ＋ ${formatNumber(bridgeKm, locale)} ＝ ${correctStr}.`
          : `Προσθέτουμε τα κόστη των έργων: ${formatNumber(highwayKm, locale)} ＋ ${formatNumber(bridgeKm, locale)} ＝ ${correctStr}.`
      };
    }
  }
];

function generateQuestions(locale = 'el') {
  const isEn = locale === 'en';
  const qList = [];

  // Q1 (Input - Decimal): Αξία Θέσης Ψηφίου
  {
    const q1NumBase = generateUniqueDigitsNumber();
    const q1Digits = q1NumBase.toString().split('');
    const q1TargetPos = randInt(0, 3);
    const q1TargetDigit = Number(q1Digits[q1TargetPos]);
    const q1Power = q1Digits.length - 1 - q1TargetPos;
    const q1Answer = q1TargetDigit * Math.pow(10, q1Power);
    const q1PositionName = isEn
      ? ['Hundred Thousands', 'Ten Thousands', 'Thousands', 'Hundreds'][q1TargetPos]
      : ['Εκατοντάδων Χιλιάδων', 'Δεκάδων Χιλιάδων', 'Μονάδων Χιλιάδων', 'Εκατοντάδων'][q1TargetPos];

    qList.push({
      id: 1,
      type: 'decimal_input',
      title: isEn ? 'QUESTION 1 • PLACE VALUE OF A DIGIT' : 'ΕΡΩΤΗΣΗ 1 • ΑΞΙΑ ΘΕΣΗΣ ΨΗΦΙΟΥ',
      instruction: isEn
        ? 'Find the actual numerical value of the digit (integer):'
        : 'Βρείτε την πραγματική αριθμητική αξία του ψηφίου (ακέραιος χωρίς τελείες):',
      prompt: isEn
        ? `In the number ${formatNumber(q1NumBase, locale)}, what is the place value of the digit ${q1TargetDigit}?`
        : `Στον αριθμό ${formatNumber(q1NumBase, locale)}, ποια είναι η πραγματική αξία του ψηφίου ${q1TargetDigit};`,
      correctVal: q1Answer,
      correctStr: String(q1Answer),
      explanation: isEn
        ? `The digit ${q1TargetDigit} is in the ${q1PositionName} place, so its value is ${q1TargetDigit} · ${formatNumber(Math.pow(10, q1Power), locale)} ＝ ${formatNumber(q1Answer, locale)}.`
        : `Το ψηφίο ${q1TargetDigit} βρίσκεται στη θέση των ${q1PositionName}, άρα η αξία του είναι ${q1TargetDigit} · ${formatNumber(Math.pow(10, q1Power), locale)} ＝ ${formatNumber(q1Answer, locale)}.`
    });
  }

  // Q2 (Input - Decimal): Σύνθεση αριθμού από αναπτυγμένη μορφή
  {
    const q2A = randInt(2, 8);
    const q2B = randInt(1, 9);
    const q2C = randInt(3, 9);
    const q2D = randInt(1, 9);
    const q2Answer = q2A * 1000000 + q2B * 100000 + q2C * 1000 + q2D;
    const q2Prompt = `${q2A} · ${formatNumber(1000000, locale)} ＋ ${q2B} · ${formatNumber(100000, locale)} ＋ ${q2C} · ${formatNumber(1000, locale)} ＋ ${q2D} · 1`;

    qList.push({
      id: 2,
      type: 'decimal_input',
      title: isEn ? 'QUESTION 2 • NUMBER COMPOSITION' : 'ΕΡΩΤΗΣΗ 2 • ΣΥΝΘΕΣΗ ΑΡΙΘΜΟΥ',
      instruction: isEn
        ? 'Compose the natural number (integer without spaces/dots):'
        : 'Συνθέστε τον φυσικό αριθμό (ακέραιος χωρίς τελείες):',
      prompt: isEn
        ? `Which natural number results from the expression: ${q2Prompt}?`
        : `Ποιος φυσικός αριθμός προκύπτει από την πράξη: ${q2Prompt};`,
      correctVal: q2Answer,
      correctStr: String(q2Answer),
      explanation: isEn
        ? `Evaluating the sum: ${formatNumber(q2A * 1000000, locale)} ＋ ${formatNumber(q2B * 100000, locale)} ＋ ${formatNumber(q2C * 1000, locale)} ＋ ${q2D} ＝ ${formatNumber(q2Answer, locale)}.`
        : `Υπολογίζοντας το άθροισμα: ${formatNumber(q2A * 1000000, locale)} ＋ ${formatNumber(q2B * 100000, locale)} ＋ ${formatNumber(q2C * 1000, locale)} ＋ ${q2D} ＝ ${formatNumber(q2Answer, locale)}.`
    });
  }

  // Q3 (MCQ): Αναγνώριση Περιόδου
  {
    const q3MillionPart = randInt(12, 85);
    const q3ThousandPart = randInt(100, 999);
    const q3UnitsPart = randInt(100, 999);
    const q3FullNumber = q3MillionPart * 1000000 + q3ThousandPart * 1000 + q3UnitsPart;
    const q3CorrectOption = isEn ? 'Millions Period' : 'Περίοδος Εκατομμυρίων';

    const rawOptions = isEn
      ? ['Millions Period', 'Thousands Period', 'Units Period', 'Billions Period']
      : ['Περίοδος Εκατομμυρίων', 'Περίοδος Χιλιάδων', 'Περίοδος Μονάδων', 'Περίοδος Δισεκατομμυρίων'];
    const uniqueOptions = makeUniqueOptions(q3CorrectOption, rawOptions);
    const options = uniqueOptions.map((text) => ({
      text,
      isCorrect: text === q3CorrectOption
    }));

    qList.push({
      id: 3,
      type: 'mcq',
      title: isEn ? 'QUESTION 3 • IDENTIFYING PERIODS' : 'ΕΡΩΤΗΣΗ 3 • ΑΝΑΓΝΩΡΙΣΗ ΠΕΡΙΟΔΟΥ',
      instruction: isEn ? 'Select the correct period:' : 'Επιλέξτε τη σωστή περίοδο:',
      prompt: isEn
        ? `In the number ${formatNumber(q3FullNumber, locale)}, to which period do the leading digits (${formatNumber(q3MillionPart, locale)}) belong?`
        : `Στον αριθμό ${formatNumber(q3FullNumber, locale)}, σε ποια περίοδο ανήκουν τα πρώτα ψηφία (${formatNumber(q3MillionPart, locale)});`,
      options,
      correctText: q3CorrectOption,
      explanation: isEn
        ? `The digits ${formatNumber(q3MillionPart, locale)} represent the 3rd group from the right, which is the Millions Period.`
        : `Τα ψηφία ${formatNumber(q3MillionPart, locale)} βρίσκονται στην 3η τριάδα από τα δεξιά, η οποία είναι η Περίοδος των Εκατομμυρίων.`
    });
  }

  // Q4 (MCQ): Σύγκριση Μεγάλων Αριθμών
  {
    const q4Base = randInt(450, 750) * 10000;
    const v1 = q4Base + 45000;
    const v2 = q4Base + 12000;
    const v3 = q4Base + 9500;
    const v4 = q4Base - 8000;

    const correct = formatNumber(v1, locale);
    const rawOptions = [
      formatNumber(v1, locale),
      formatNumber(v2, locale),
      formatNumber(v3, locale),
      formatNumber(v4, locale)
    ];
    const uniqueOptions = makeUniqueOptions(correct, rawOptions, (i) =>
      formatNumber(q4Base - (i + 1) * 5000, locale)
    );
    const options = uniqueOptions.map((text) => ({
      text,
      isCorrect: text === correct
    }));

    qList.push({
      id: 4,
      type: 'mcq',
      title: isEn ? 'QUESTION 4 • COMPARING LARGE NUMBERS' : 'ΕΡΩΤΗΣΗ 4 • ΣΥΓΚΡΙΣΗ ΜΕΓΑΛΩΝ ΑΡΙΘΜΩΝ',
      instruction: isEn ? 'Select the largest number:' : 'Επιλέξτε τον μεγαλύτερο αριθμό:',
      prompt: isEn
        ? 'Which of the following numbers is the greatest?'
        : 'Ποιος από τους παρακάτω αριθμούς είναι ο μεγαλύτερος;',
      options,
      correctText: correct,
      explanation: isEn
        ? `Comparing digits starting from the highest place value, the greatest number is ${correct}.`
        : `Συγκρίνοντας τα ψηφία από τα αριστερά προς τα δεξιά, ο μεγαλύτερος αριθμός είναι το ${correct}.`
    });
  }

  // Q5 (MCQ): Δεκαδικό Σύστημα Αρίθμησης (4 μοναδικές επιλογές)
  {
    const q5IsTrue = Math.random() > 0.5;
    const q5Text = isEn
      ? (q5IsTrue
          ? 'In a base-10 number, each position to the left is worth 10 times more than the position immediately to its right.'
          : 'In a base-10 number, each position to the left is worth 10 times less than the position immediately to its right.')
      : (q5IsTrue
          ? 'Σε έναν φυσικό αριθμό, κάθε θέση προς τα αριστερά έχει 10 φορές μεγαλύτερη αξία από τη θέση που βρίσκεται αμέσως δεξιά της.'
          : 'Σε έναν φυσικό αριθμό, κάθε θέση προς τα αριστερά έχει 10 φορές μικρότερη αξία από τη θέση που βρίσκεται αμέσως δεξιά της.');

    const c1 = isEn
      ? 'True, because each position to the left has 10 times greater value.'
      : 'Σωστό, γιατί κάθε θέση προς τα αριστερά έχει 10 φορές μεγαλύτερη αξία.';
    const c2 = isEn
      ? 'False, because each position to the left has 10 times greater value, not smaller.'
      : 'Λάθος, γιατί κάθε θέση προς τα αριστερά έχει 10 φορές μεγαλύτερη αξία (όχι μικρότερη).';
    const w1 = isEn
      ? 'True, because the value always decreases as we move to the left.'
      : 'Σωστό, γιατί η αξία μικραίνει πάντα καθώς κινούμαστε προς τα αριστερά.';
    const w2 = isEn
      ? 'False, because every position has the exact same value regardless of position.'
      : 'Λάθος, γιατί όλες οι θέσεις έχουν την ίδια σταθερή αξία ανεξάρτητα από τη θέση.';

    const correctAns = q5IsTrue ? c1 : c2;
    const optionsPool = q5IsTrue ? [c1, c2, w1, w2] : [c2, c1, w1, w2];
    const uniqueOptions = makeUniqueOptions(correctAns, optionsPool);
    const options = uniqueOptions.map((text) => ({
      text,
      isCorrect: text === correctAns
    }));

    qList.push({
      id: 5,
      type: 'mcq',
      title: isEn ? 'QUESTION 5 • BASE-10 NUMBER SYSTEM' : 'ΕΡΩΤΗΣΗ 5 • ΔΕΚΑΔΙΚΟ ΣΥΣΤΗΜΑ ΑΡΙΘΜΗΣΗΣ',
      instruction: isEn ? 'Select the correct statement evaluation:' : 'Επιλέξτε τη σωστή αξιολόγηση της πρότασης:',
      prompt: `«${q5Text}»`,
      options,
      correctText: correctAns,
      explanation: isEn
        ? (q5IsTrue
            ? 'Correct! Our number system is positional base-10; every step left is worth 10 times more.'
            : 'The statement is false! Each position to the left is 10 times greater, not smaller.')
        : (q5IsTrue
            ? 'Το σύστημα αρίθμησης είναι δεκαδικό και θεσιακό, άρα κάθε θέση αριστερά έχει 10 φορές μεγαλύτερη αξία.'
            : 'Η πρόταση είναι λάθος, διότι κάθε θέση προς τα αριστερά έχει 10 φορές μεγαλύτερη (και όχι μικρότερη) αξία.')
    });
  }

  // Q6 (MCQ): Ο Ρόλος του Μηδενός (4 μοναδικές επιλογές)
  {
    const q6IsTrue = Math.random() > 0.5;
    const numEx = randInt(20, 80) * 1000;
    const q6Text = isEn
      ? (q6IsTrue
          ? `The trailing zeros in ${formatNumber(numEx, locale)} hold place values so that remaining digits maintain their proper value.`
          : `Adding zeros to the very beginning of an integer (e.g. 00${formatNumber(numEx, locale)}) increases its numerical value.`)
      : (q6IsTrue
          ? `Τα μηδενικά στο τέλος του αριθμού ${formatNumber(numEx, locale)} κρατούν τις τάξεις ώστε τα υπόλοιπα ψηφία να έχουν τη σωστή αξία.`
          : `Αν προσθέσουμε μηδενικά στην αρχή ενός ακεραίου αριθμού (π.χ. 00${formatNumber(numEx, locale)}), η αξία του μεγαλώνει.`);

    const c1 = isEn
      ? 'True: Trailing zeros preserve the place value of the other digits.'
      : 'Σωστό: Τα μηδενικά στο τέλος καθορίζουν την τάξη και αξία των προηγούμενων ψηφίων.';
    const c2 = isEn
      ? 'False: Leading zeros before an integer do not change its value.'
      : 'Λάθος: Τα μηδενικά στην αρχή ενός ακεραίου δεν αλλάζουν την αξία του.';
    const w1 = isEn
      ? 'True: Any zero added anywhere always doubles the number.'
      : 'Σωστό: Οποιοδήποτε μηδενικό προστεθεί οπουδήποτε διπλασιάζει τον αριθμό.';
    const w2 = isEn
      ? 'False: Zeros never have any function or value in whole numbers.'
      : 'Λάθος: Τα μηδενικά δεν επιτελούν καμία λειτουργία στους φυσικούς αριθμούς.';

    const correctAns = q6IsTrue ? c1 : c2;
    const optionsPool = q6IsTrue ? [c1, c2, w1, w2] : [c2, c1, w1, w2];
    const uniqueOptions = makeUniqueOptions(correctAns, optionsPool);
    const options = uniqueOptions.map((text) => ({
      text,
      isCorrect: text === correctAns
    }));

    qList.push({
      id: 6,
      type: 'mcq',
      title: isEn ? 'QUESTION 6 • ROLE OF ZERO' : 'ΕΡΩΤΗΣΗ 6 • Ο ΡΟΛΟΣ ΤΟΥ ΜΗΔΕΝΟΣ',
      instruction: isEn ? 'Select the correct statement evaluation:' : 'Επιλέξτε τη σωστή αξιολόγηση της πρότασης:',
      prompt: `«${q6Text}»`,
      options,
      correctText: correctAns,
      explanation: isEn
        ? (q6IsTrue
            ? 'True! Trailing zeros preserve digit positions and place values in integers.'
            : 'False! Leading zeros before a whole number do not alter its numerical value.')
        : (q6IsTrue
            ? 'Σωστό! Τα μηδενικά στο τέλος ενός ακεραίου καθορίζουν την τάξη των προηγούμενων ψηφίων.'
            : 'Λάθος! Τα μηδενικά στην αρχή ενός ακεραίου αριθμού δεν έχουν καμία αξία και δεν μεταβάλλουν τον αριθμό.')
    });
  }

  // Q7 & Q8: Κανονικά Προβλήματα
  {
    const shuffledStd = shuffle([...STANDARD_PROBLEMS_POOL]);
    const stdProb1 = shuffledStd[0].generate(locale);
    const stdProb2 = shuffledStd[1].generate(locale);

    qList.push({
      id: 7,
      type: 'decimal_input',
      title: `${isEn ? 'QUESTION 7 • ' : 'ΕΡΩΤΗΣΗ 7 • '}${stdProb1.title}`,
      instruction: stdProb1.inputInstruction,
      prompt: stdProb1.text,
      tableData: stdProb1.tableData,
      correctVal: stdProb1.correctVal,
      correctStr: stdProb1.correctStr,
      explanation: stdProb1.explanation
    });

    qList.push({
      id: 8,
      type: 'mcq',
      title: `${isEn ? 'QUESTION 8 • ' : 'ΕΡΩΤΗΣΗ 8 • '}${stdProb2.title}`,
      instruction: stdProb2.mcqInstruction,
      prompt: stdProb2.text,
      tableData: stdProb2.tableData,
      options: stdProb2.options,
      correctText: stdProb2.correctText,
      explanation: stdProb2.explanation
    });
  }

  // Q9 & Q10: Προβλήματα Αυξημένης Δυσκολίας
  {
    const shuffledHard = shuffle([...HARD_PROBLEMS_POOL]);
    const hardProb1 = shuffledHard[0].generate(locale);
    const hardProb2 = shuffledHard[1].generate(locale);

    qList.push({
      id: 9,
      type: 'decimal_input',
      title: `${isEn ? 'QUESTION 9 • ' : 'ΕΡΩΤΗΣΗ 9 • '}${hardProb1.title}`,
      instruction: hardProb1.inputInstruction,
      prompt: hardProb1.text,
      tableData: hardProb1.tableData,
      correctVal: hardProb1.correctVal,
      correctStr: hardProb1.correctStr,
      explanation: hardProb1.explanation
    });

    qList.push({
      id: 10,
      type: 'mcq',
      title: `${isEn ? 'QUESTION 10 • ' : 'ΕΡΩΤΗΣΗ 10 • '}${hardProb2.title}`,
      instruction: hardProb2.mcqInstruction,
      prompt: hardProb2.text,
      tableData: hardProb2.tableData,
      options: hardProb2.options,
      correctText: hardProb2.correctText,
      explanation: hardProb2.explanation
    });
  }

  return qList;
}

const UI_STRINGS = {
  el: {
    pageTitle: "Ασκήσεις: Φυσικοί Αριθμοί - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "10 απαιτητικές ασκήσεις και προβλήματα στους φυσικούς αριθμούς, την αξία θέσης ψηφίου, τις περιόδους και την αναπτυγμένη μορφή για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryBtn: "📖 Θεωρία",
    badgeChapter: "ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    heroTitle: "Ασκήσεις & Προβλήματα: Φυσικοί Αριθμοί",
    heroDesc: "10 απαιτητικές δραστηριότητες με αξία θέσης ψηφίου, περιόδους, αναπτυγμένη μορφή δυνάμεων του 10 και 4 ρεαλιστικά προβλήματα. Συμπληρώστε τις απαντήσεις σας και ελέγξτε την επίδοσή σας.",
    heroDynamicNote: "⚡ Κάθε σετ δημιουργείται δυναμικά με τυχαίες παραμέτρους.",
    btnNewSet: "🔄 ΝΕΕΣ ΑΣΚΗΣΕΙΣ",
    badgeCorrect: "✓ ΣΩΣΤΟ",
    badgeWrong: "✗ ΛΑΘΟΣ",
    inputPlaceholder: "Απάντηση...",
    inputNote: "(Αριθμός χωρίς τελείες)",
    feedbackGreat: "🎉 Εξαιρετικά!",
    feedbackExpl: "💡 Μαθηματική Επεξήγηση:",
    correctAnswerLabel: "Σωστή απάντηση:",
    btnCheckMain: "🎯 Έλεγχος Απαντήσεων",
    scoreLabel: "ΣΚΟΡ",
    scoreRatio: "/ 10",
    pctLabel: "ΠΟΣΟΣΤΟ",
    btnCheckBar: "ΕΛΕΓΧΟΣ"
  },
  en: {
    pageTitle: "Exercises: Natural Numbers - Grade 6 | LearnMaths.gr",
    pageDesc: "10 interactive math questions covering place value, periods, and real-world natural number problems for Grade 6.",
    backText: "Grade 6",
    theoryBtn: "📖 Theory",
    badgeChapter: "GRADE 6 • PRACTICE",
    heroTitle: "Exercises & Problems: Natural Numbers",
    heroDesc: "10 interactive activities testing digit place value, periods, powers-of-10 expanded form, and 4 applied problems. Complete your answers and check your score.",
    heroDynamicNote: "⚡ Each exercise set is dynamically generated with random numbers.",
    btnNewSet: "🔄 NEW EXERCISES",
    badgeCorrect: "✓ CORRECT",
    badgeWrong: "✗ WRONG",
    inputPlaceholder: "Answer...",
    inputNote: "(Integer without spaces/dots)",
    feedbackGreat: "🎉 Excellent!",
    feedbackExpl: "💡 Mathematical Explanation:",
    correctAnswerLabel: "Correct answer:",
    btnCheckMain: "🎯 Check Answers",
    scoreLabel: "SCORE",
    scoreRatio: "/ 10",
    pctLabel: "PERCENTAGE",
    btnCheckBar: "CHECK"
  }
};

export default function FysikoiArithmoiExercisesPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
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
    let sanitized = rawValue.replace(/[^0-9]/g, '');
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

  const handleCheckAnswers = () => {
    let currentScore = 0;

    questions.forEach((q) => {
      if (q.type === 'mcq') {
        const userChoice = answers[`q_${q.id}`];
        if (userChoice === q.correctText) {
          currentScore += 1;
        }
      } else if (q.type === 'decimal_input') {
        const userValStr = (answers[`q_${q.id}`] || '').trim();
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
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/st-dimotikou"
      backText={t.backText}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/01-fysikoi"
          locale={locale}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>{t.theoryBtn}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 pb-28 sm:pb-36 overflow-x-hidden">
        {/* Banner Header */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>{t.badgeChapter}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight break-words [overflow-wrap:anywhere]">
              {t.heroTitle}
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl break-words">
              {t.heroDesc}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs sm:text-sm 2xl:text-base text-sky-200 break-words">
              {t.heroDynamicNote}
            </span>
            <button
              type="button"
              onClick={loadNewSet}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base touch-manipulation cursor-pointer shrink-0"
            >
              <span>{t.btnNewSet}</span>
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
                const uv = parseFloat((answers[`q_${q.id}`] || '').trim());
                isCorrect = !isNaN(uv) && Math.abs(uv - q.correctVal) < 0.05;
              }
            }

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
                {/* Επικεφαλιδα Ερωτησης */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="text-xs 2xl:text-sm font-black tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg break-words">
                    {toCleanUppercase(q.title)}
                  </span>
                  {isSubmitted && (
                    <span
                      className={`text-xs 2xl:text-sm font-bold px-3 py-1 rounded-full shrink-0 ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isCorrect ? t.badgeCorrect : t.badgeWrong}
                    </span>
                  )}
                </div>

                {/* Εκφωνηση: Πληρης αποφυγη πινακα πριν την υποβολη */}
                <div className="space-y-3 mb-5">
                  {q.instruction && (
                    <p className="text-xs sm:text-sm 2xl:text-base font-semibold text-slate-500 break-words">
                      {q.instruction}
                    </p>
                  )}
                  <p className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-900 leading-relaxed break-words [overflow-wrap:anywhere]">
                    {q.prompt}
                  </p>
                </div>

                {/* Περιοχη Απαντησης */}
                <div className="py-2">
                  {q.type === 'decimal_input' && (
                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={10}
                        disabled={isSubmitted}
                        placeholder={t.inputPlaceholder}
                        value={answers[`q_${q.id}`] || ''}
                        onChange={(e) => handleInputChange(`q_${q.id}`, e.target.value)}
                        className="w-36 sm:w-48 text-center font-mono font-bold text-base sm:text-lg text-slate-900 bg-white border border-slate-300 rounded-2xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed shadow-inner"
                      />
                      <span className="text-xs 2xl:text-sm text-slate-500 break-words">
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
                            className={`w-full p-3.5 rounded-2xl border text-left font-semibold text-xs sm:text-sm 2xl:text-base transition active:scale-95 touch-manipulation flex items-center justify-between gap-3 cursor-pointer ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                            } disabled:cursor-not-allowed`}
                          >
                            <span className="break-words whitespace-normal leading-snug flex-1 [overflow-wrap:anywhere]">
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

                {/* Feedback μετα την υποβολη */}
                {isSubmitted && (
                  <div
                    className={`mt-4 p-4 rounded-2xl border text-xs sm:text-sm 2xl:text-base leading-relaxed space-y-2.5 ${
                      isCorrect
                        ? 'bg-emerald-100/60 border-emerald-300 text-emerald-950'
                        : 'bg-rose-100/60 border-rose-300 text-rose-950'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      <span>{isCorrect ? t.feedbackGreat : t.feedbackExpl}</span>
                    </div>

                    {q.tableData && (
                      <div className="w-full overflow-x-auto block">
                        <div className="inline-block min-w-full sm:min-w-[340px] bg-white/90 border border-slate-200 rounded-2xl p-3 shadow-inner my-1 font-mono text-xs sm:text-sm">
                          <div className="grid grid-cols-2 gap-3 sm:gap-4 font-bold border-b pb-1.5 text-slate-600 text-center">
                            <span className="bg-blue-100/70 px-2 py-0.5 rounded-lg text-blue-900 break-words">
                              {q.tableData.col1}
                            </span>
                            <span className="bg-emerald-100/70 px-2 py-0.5 rounded-lg text-emerald-900 break-words">
                              {q.tableData.col2}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2 text-center font-bold text-slate-800">
                            <span className="break-words">{q.tableData.r1[0]}</span>
                            <span className="text-indigo-700 font-bold break-words">{q.tableData.r1[1]}</span>
                            <span className="break-words">{q.tableData.r2[0]}</span>
                            <span className="text-amber-600 font-black break-words">{q.tableData.r2[1]}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="break-words [overflow-wrap:anywhere]">{q.explanation}</div>

                    {!isCorrect && (
                      <div className="font-semibold pt-1 text-slate-800 break-words">
                        {t.correctAnswerLabel}{' '}
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

        {/* Κουμπι Ελεγχου στο τελος της σελιδας */}
        <div className="flex justify-center pt-4">
          <button
            type="button"
            onClick={handleCheckAnswers}
            disabled={isSubmitted}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-base sm:text-lg 2xl:text-xl px-8 py-4 rounded-2xl shadow-xl transition active:scale-95 touch-manipulation cursor-pointer"
          >
            <span>{t.btnCheckMain}</span>
          </button>
        </div>
      </div>

      {/* Fixed Bottom Score Bar */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3.5 px-4 sm:px-8 shadow-2xl">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-8">
            <div>
              <span className="text-xs text-slate-400 font-semibold block">
                {t.scoreLabel}
              </span>
              <span className="font-mono font-black text-lg sm:text-2xl text-amber-300">
                {score} <span className="text-slate-500 text-base">{t.scoreRatio}</span>
              </span>
            </div>

            <div className="hidden xs:block border-l border-slate-700 pl-4 sm:pl-8">
              <span className="text-xs text-slate-400 font-semibold block">
                {t.pctLabel}
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
                {t.btnNewSet}
              </button>
            )}
          </div>
        </div>
      </footer>
    </Layout>
  );
}