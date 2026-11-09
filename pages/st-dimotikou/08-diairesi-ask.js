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

const REAL_WORLD_DIVISIONS = {
  el: [
    { item: 'καραμέλες', group: 'παιδιά', unit: 'καραμέλες' },
    { item: 'βιβλία', group: 'ράφια', unit: 'βιβλία' },
    { item: 'ευρώ', group: 'κουμπαράδες', unit: '€' },
    { item: 'κιλά αλεύρι', group: 'σακούλες', unit: 'κιλά' },
    { item: 'μήλα', group: 'τελάρα', unit: 'μήλα' },
    { item: 'τετράδια', group: 'μαθητές', unit: 'τετράδια' },
    { item: 'λίτρα χυμού', group: 'μπουκάλια', unit: 'λίτρα' },
    { item: 'μπάλες', group: 'κουτιά', unit: 'μπάλες' },
    { item: 'αυγά', group: 'θήκες', unit: 'αυγά' },
    { item: 'σοκολάτες', group: 'πακέτα', unit: 'σοκολάτες' }
  ],
  en: [
    { item: 'candies', group: 'children', unit: 'candies' },
    { item: 'books', group: 'shelves', unit: 'books' },
    { item: 'euros', group: 'piggy banks', unit: '€' },
    { item: 'kg of flour', group: 'bags', unit: 'kg' },
    { item: 'apples', group: 'crates', unit: 'apples' },
    { item: 'notebooks', group: 'students', unit: 'notebooks' },
    { item: 'liters of juice', group: 'bottles', unit: 'liters' },
    { item: 'balls', group: 'boxes', unit: 'balls' },
    { item: 'eggs', group: 'cartons', unit: 'eggs' },
    { item: 'chocolates', group: 'packs', unit: 'chocolates' }
  ]
};

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'p_div_std_1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const perBox = 12;
      const totalCandies = randInt(15, 35) * perBox;
      const boxes = totalCandies / perBox;
      const unitBox = isEn ? 'boxes' : 'κουτιά';
      const unitPiece = isEn ? 'pieces' : 'τεμάχια';

      return {
        title: isEn ? 'PACKING CHOCOLATES INTO BOXES' : 'ΣΥΣΚΕΥΑΣΙΑ ΣΟΚΟΛΑΤΩΝ ΣΕ ΚΟΥΤΙΑ',
        instruction: isEn ? 'Calculate how many boxes will be filled (integer):' : 'Υπολογίστε πόσα κουτιά θα γεμίσουν (ακέραιος χωρίς τελείες):',
        text: isEn
          ? `A pastry shop produced ${formatNumber(totalCandies, locale)} chocolates. If ${perBox} chocolates are packed in each box, how many boxes will be completely filled?`
          : `Ένα εργαστήριο ζαχαροπλαστικής παρήγαγε ${formatNumber(totalCandies, locale)} σοκολατάκια. Αν σε κάθε κουτί τοποθετούνται ${perBox} σοκολατάκια, πόσα κουτιά θα γεμίσουν ακριβώς;`,
        tableData: {
          col1: isEn ? 'Total Chocolates' : 'Συνολικά Σοκολατάκια',
          col2: isEn ? 'Per Box' : 'Ανά Κουτί',
          r1: [`${formatNumber(totalCandies, locale)}`, `${perBox} ${unitPiece}`],
          r2: [isEn ? 'Division' : 'Διαίρεση', `${formatNumber(boxes, locale)} ${unitBox}`]
        },
        correctVal: boxes,
        correctStr: String(boxes),
        explanation: isEn
          ? `Execute exact division: ${formatNumber(totalCandies, locale)} : ${perBox} ＝ ${formatNumber(boxes, locale)} ${unitBox}.`
          : `Εκτελούμε την τέλεια διαίρεση: ${formatNumber(totalCandies, locale)} : ${perBox} ＝ ${formatNumber(boxes, locale)} ${unitBox}.`
      };
    }
  },
  {
    id: 'p_div_std_2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const friends = randInt(4, 8);
      const perFriend = randInt(15, 45);
      const totalMoney = friends * perFriend;

      return {
        title: isEn ? 'EQUAL EXPENSE SHARING' : 'ΙΣΟΜΕΡΗΣ ΚΑΤΑΝΟΜΗ ΕΞΟΔΩΝ',
        instruction: isEn ? 'Calculate each person\'s share in euros (€):' : 'Υπολογίστε το μερίδιο κάθε ατόμου σε ευρώ (€):',
        text: isEn
          ? `A group of ${friends} friends paid a total bill of ${totalMoney} €. If they split the cost equally, how much did each person pay in euros (€)?`
          : `Μια παρέα ${friends} φίλων πλήρωσε λογαριασμό συνολικού ύψους ${totalMoney} €. Αν μοιράστηκαν το ποσό ισόποσα, πόσα ευρώ (€) πλήρωσε ο καθένας;`,
        tableData: {
          col1: isEn ? 'Total Bill' : 'Συνολικός Λογαριασμός',
          col2: isEn ? 'People' : 'Άτομα',
          r1: [`${totalMoney} €`, isEn ? `${friends} people` : `${friends} άτομα`],
          r2: [isEn ? 'Division' : 'Διαίρεση', `${perFriend} €`]
        },
        correctVal: perFriend,
        correctStr: String(perFriend),
        explanation: isEn
          ? `Divide the total cost by the number of friends: ${totalMoney} : ${friends} ＝ ${perFriend} €.`
          : `Διαιρούμε το συνολικό ποσό με το πλήθος των ατόμων: ${totalMoney} : ${friends} ＝ ${perFriend} €.`
      };
    }
  },
  {
    id: 'p_div_std_3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const perRow = 25;
      const totalBooks = randInt(12, 28) * perRow;
      const rows = totalBooks / perRow;
      const unitBook = isEn ? 'books' : 'βιβλία';
      const unitShelf = isEn ? 'shelves' : 'ράφια';

      return {
        title: isEn ? 'ARRANGING BOOKS ON SHELVES' : 'ΤΟΠΟΘΕΤΗΣΗ ΒΙΒΛΙΩΝ ΣΕ ΡΑΦΙΑ',
        instruction: isEn ? 'Calculate how many shelves will be filled (integer):' : 'Υπολογίστε πόσα ράφια θα γεμίσουν (ακέραιος χωρίς τελείες):',
        text: isEn
          ? `A library received ${formatNumber(totalBooks, locale)} new books. If each shelf holds exactly ${perRow} books, how many shelves will be filled completely?`
          : `Μια βιβλιοθήκη παρέλαβε ${formatNumber(totalBooks, locale)} νέα βιβλία. Αν κάθε ράφι χωράει ακριβώς ${perRow} βιβλία, πόσα ράφια θα γεμίσουν πλήρως;`,
        tableData: {
          col1: isEn ? 'Total Books' : 'Σύνολο Βιβλίων',
          col2: isEn ? 'Shelf Capacity' : 'Χωρητικότητα Ραφιού',
          r1: [`${formatNumber(totalBooks, locale)}`, `${perRow} ${unitBook}`],
          r2: [isEn ? 'Division' : 'Διαίρεση', `${formatNumber(rows, locale)} ${unitShelf}`]
        },
        correctVal: rows,
        correctStr: String(rows),
        explanation: isEn
          ? `Perform division: ${formatNumber(totalBooks, locale)} : ${perRow} ＝ ${formatNumber(rows, locale)} ${unitShelf}.`
          : `Εκτελούμε τη διαίρεση: ${formatNumber(totalBooks, locale)} : ${perRow} ＝ ${formatNumber(rows, locale)} ${unitShelf}.`
      };
    }
  },
  {
    id: 'p_div_std_4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const capacityKg = 50;
      const totalKg = randInt(10, 25) * capacityKg;
      const sacks = totalKg / capacityKg;
      const unitSack = isEn ? 'sacks' : 'σακιά';

      return {
        title: isEn ? 'SACKS OF WHEAT' : 'ΣΑΚΙΑ ΜΕ ΣΙΤΑΡΙ',
        instruction: isEn ? 'Calculate how many sacks will be needed (integer):' : 'Υπολογίστε πόσα σακιά θα γεμίσουν (ακέραιος):',
        text: isEn
          ? `A farmer harvested ${formatNumber(totalKg, locale)} kg of wheat. If each sack holds ${capacityKg} kg, how many sacks will he need to pack it all?`
          : `Ένας γεωργός συγκέντρωσε ${formatNumber(totalKg, locale)} kg σιτάρι. Αν κάθε σακί χωράει ${capacityKg} kg, πόσα σακιά θα χρειαστεί για να το συσκευάσει όλο;`,
        tableData: {
          col1: isEn ? 'Total Wheat' : 'Συνολικό Σιτάρι',
          col2: isEn ? 'Per Sack' : 'Ανά Σακί',
          r1: [`${formatNumber(totalKg, locale)} kg`, `${capacityKg} kg`],
          r2: [isEn ? 'Division' : 'Διαίρεση', `${formatNumber(sacks, locale)} ${unitSack}`]
        },
        correctVal: sacks,
        correctStr: String(sacks),
        explanation: isEn
          ? `Execute division: ${formatNumber(totalKg, locale)} : ${capacityKg} ＝ ${formatNumber(sacks, locale)} ${unitSack}.`
          : `Εκτελούμε τη διαίρεση: ${formatNumber(totalKg, locale)} : ${capacityKg} ＝ ${formatNumber(sacks, locale)} ${unitSack}.`
      };
    }
  },
  {
    id: 'p_div_std_5',
    generate: (locale) => {
      const isEn = locale === 'en';
      const students = randInt(18, 30);
      const perStudent = 6;
      const totalNotebooks = students * perStudent;
      const unitNb = isEn ? 'notebooks' : 'τετράδια';
      const unitSt = isEn ? 'students' : 'μαθητές';

      return {
        title: isEn ? 'NOTEBOOK DISTRIBUTION IN CLASS' : 'ΜΟΙΡΑΣΜΑ ΤΕΤΡΑΔΙΩΝ ΣΤΗΝ ΤΑΞΗ',
        instruction: isEn ? 'Calculate how many notebooks each student receives:' : 'Υπολογίστε πόσα τετράδια παίρνει κάθε μαθητής:',
        text: isEn
          ? `In a class of ${students} students, ${totalNotebooks} notebooks were distributed equally. How many notebooks did each student receive?`
          : `Σε μια τάξη με ${students} μαθητές μοιράστηκαν ισόποσα ${totalNotebooks} τετράδια. Πόσα τετράδια πήρε ο κάθε μαθητής;`,
        tableData: {
          col1: isEn ? 'Total Notebooks' : 'Σύνολο Τετραδίων',
          col2: isEn ? 'Students' : 'Μαθητές',
          r1: [`${totalNotebooks} ${unitNb}`, `${students} ${unitSt}`],
          r2: [isEn ? 'Division' : 'Διαίρεση', `${perStudent} ${unitNb}`]
        },
        correctVal: perStudent,
        correctStr: String(perStudent),
        explanation: isEn
          ? `Execute division: ${totalNotebooks} : ${students} ＝ ${perStudent} ${unitNb}.`
          : `Εκτελούμε τη διαίρεση: ${totalNotebooks} : ${students} ＝ ${perStudent} τετράδια.`
      };
    }
  },
  {
    id: 'p_div_std_6',
    generate: (locale) => {
      const isEn = locale === 'en';
      const treesPerRow = 15;
      const totalTrees = randInt(12, 30) * treesPerRow;
      const rows = totalTrees / treesPerRow;
      const unitTree = isEn ? 'trees' : 'δέντρα';
      const unitRow = isEn ? 'rows' : 'σειρές';

      return {
        title: isEn ? 'PLANTING TREES IN ROWS' : 'ΦΥΤΕΥΣΗ ΔΕΝΤΡΩΝ ΣΕ ΣΕΙΡΕΣ',
        instruction: isEn ? 'Calculate how many rows were formed:' : 'Υπολογίστε πόσες σειρές σχηματίστηκαν:',
        text: isEn
          ? `In a grove, ${formatNumber(totalTrees, locale)} saplings were planted in equal rows of ${treesPerRow} trees. How many rows were formed in total?`
          : `Σε ένα άλσος φυτεύτηκαν ${formatNumber(totalTrees, locale)} δενδρύλλια σε ισάριθμες σειρές των ${treesPerRow} δέντρων. Πόσες σειρές σχηματίστηκαν συνολικά;`,
        tableData: {
          col1: isEn ? 'Total Trees' : 'Σύνολο Δέντρων',
          col2: isEn ? 'Trees per row' : 'Δέντρα ανά Σειρά',
          r1: [`${formatNumber(totalTrees, locale)}`, `${treesPerRow} ${unitTree}`],
          r2: [isEn ? 'Division' : 'Διαίρεση', `${formatNumber(rows, locale)} ${unitRow}`]
        },
        correctVal: rows,
        correctStr: String(rows),
        explanation: isEn
          ? `Divide: ${formatNumber(totalTrees, locale)} : ${treesPerRow} ＝ ${formatNumber(rows, locale)} ${unitRow}.`
          : `Διαιρούμε: ${formatNumber(totalTrees, locale)} : ${treesPerRow} ＝ ${formatNumber(rows, locale)} σειρές.`
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'p_div_hard_1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const totalStudents = randInt(120, 240);
      const perBus = 45;
      const fullBuses = Math.floor(totalStudents / perBus);
      const remaining = totalStudents % perBus;
      const totalBuses = remaining > 0 ? fullBuses + 1 : fullBuses;
      const unitBus = isEn ? 'buses' : 'λεωφορεία';
      const correctStr = `${totalBuses} ${unitBus}`;
      const fake1 = `${fullBuses} ${unitBus}`;
      const fake2 = `${totalBuses + 1} ${unitBus}`;
      const fake3 = `${Math.max(1, fullBuses - 1)} ${unitBus}`;

      const options = makeUniqueOptions(correctStr, [fake1, fake2, fake3]);

      return {
        title: isEn ? 'STUDENT TRANSPORTATION IN BUSES' : 'ΜΕΤΑΦΟΡΑ ΜΑΘΗΤΩΝ ΜΕ ΛΕΩΦΟΡΕΙΑ',
        instruction: isEn ? 'Select the minimum number of buses required:' : 'Επιλέξτε πόσα λεωφορεία χρειάζονται τουλάχιστον:',
        text: isEn
          ? `A school field trip includes ${totalStudents} students. Each bus seats ${perBus} students. How many buses are needed at minimum to transport all students?`
          : `Σε μια σχολική εκδρομή συμμετέχουν ${totalStudents} μαθητές. Κάθε λεωφορείο χωράει ${perBus} μαθητές. Πόσα λεωφορεία χρειάζονται τουλάχιστον ώστε να μεταφερθούν όλοι οι μαθητές;`,
        tableData: {
          col1: isEn ? 'Total Students' : 'Σύνολο Μαθητών',
          col2: isEn ? 'Bus Capacity' : 'Χωρητικότητα Λεωφορείου',
          r1: [isEn ? `${totalStudents} students` : `${totalStudents} μαθητές`, isEn ? `${perBus} seats` : `${perBus} θέσεις`],
          r2: [isEn ? `Division: ${fullBuses} (rem. ${remaining})` : `Διαίρεση: ${fullBuses} (υπόλ. ${remaining})`, `${correctStr}`]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Divide: ${totalStudents} : ${perBus} ＝ ${fullBuses} with remainder ${remaining}. Because the remaining ${remaining} students still need transportation, at least ${correctStr} are required.`
          : `Εκτελούμε τη διαίρεση: ${totalStudents} : ${perBus} ＝ ${fullBuses} με υπόλοιπο ${remaining}. Επειδή οι ${remaining} μαθητές που περισσεύουν χρειάζονται άλλο ένα λεωφορείο, απαιτούνται συνολικά ${correctStr}.`
      };
    }
  },
  {
    id: 'p_div_hard_2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const money = randInt(150, 450);
      const ticketPrice = 12;
      const tickets = Math.floor(money / ticketPrice);
      const change = money % ticketPrice;
      const unit = isEn ? 'tickets' : 'εισιτήρια';
      const correctStr = `${tickets} ${unit}`;
      const fake1 = `${tickets + 2} ${unit}`;
      const fake2 = `${Math.max(1, tickets - 2)} ${unit}`;
      const fake3 = `${tickets + 5} ${unit}`;

      const options = makeUniqueOptions(correctStr, [fake1, fake2, fake3]);

      return {
        title: isEn ? 'CONCERT TICKETS PURCHASE' : 'ΑΓΟΡΑ ΕΙΣΙΤΗΡΙΩΝ ΣΥΝΑΥΛΙΑΣ',
        instruction: isEn ? 'Select the maximum number of tickets that can be bought:' : 'Επιλέξτε πόσα εισιτήρια μπορούν να αγοραστούν το μέγιστο:',
        text: isEn
          ? `A youth club raised ${money} € for concert tickets. If each ticket costs ${ticketPrice} €, how many tickets can they purchase at most?`
          : `Μια ομάδα παιδιών συγκέντρωσε ${money} € για εισιτήρια συναυλίας. Αν κάθε εισιτήριο κοστίζει ${ticketPrice} €, πόσα εισιτήρια μπορούν να αγοράσουν το πολύ;`,
        tableData: {
          col1: isEn ? 'Total Money' : 'Συνολικό Ποσό',
          col2: isEn ? 'Ticket Price' : 'Τιμή Εισιτηρίου',
          r1: [`${money} €`, `${ticketPrice} €`],
          r2: [isEn ? `Quotient: ${tickets}` : `Πηλίκο: ${tickets}`, isEn ? `Change: ${change} €` : `Περίσσευμα: ${change} €`]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Divide: ${money} : ${ticketPrice} ＝ ${tickets} with remainder ${change} €. Thus, they can buy ${correctStr} with ${change} € change left over.`
          : `Εκτελούμε τη διαίρεση: ${money} : ${ticketPrice} ＝ ${tickets} με υπόλοιπο ${change} €. Άρα μπορούν να αγοράσουν ${correctStr} και θα περισσέψουν ${change} €.`
      };
    }
  },
  {
    id: 'p_div_hard_3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const oilKg = randInt(180, 360);
      const canKg = 5;
      const cans = Math.floor(oilKg / canKg);
      const rem = oilKg % canKg;
      const unit = isEn ? 'containers' : 'δοχεία';
      const correctStr = `${cans} ${unit}`;
      const fake1 = `${cans + 2} ${unit}`;
      const fake2 = `${Math.max(1, cans - 2)} ${unit}`;
      const fake3 = `${cans + 4} ${unit}`;

      const options = makeUniqueOptions(correctStr, [fake1, fake2, fake3]);

      return {
        title: isEn ? 'BOTTLING OLIVE OIL IN CONTAINERS' : 'ΕΜΦΙΑΛΩΣΗ ΕΛΑΙΟΛΑΔΟΥ ΣΕ ΔΟΧΕΙΑ',
        instruction: isEn ? 'Select how many containers will be completely filled:' : 'Επιλέξτε πόσα δοχεία θα γεμίσουν πλήρως:',
        text: isEn
          ? `An olive farmer produced ${oilKg} kg of olive oil and wants to pour it into ${canKg} kg containers. How many containers will be completely filled?`
          : `Ένας παραγωγός έχει ${oilKg} kg ελαιόλαδο και θέλει να το βάλει σε δοχεία των ${canKg} kg. Πόσα τέτοια δοχεία θα γεμίσει πλήρως;`,
        tableData: {
          col1: isEn ? 'Total Oil' : 'Συνολικό Λάδι',
          col2: isEn ? 'Container Capacity' : 'Χωρητικότητα Δοχείου',
          r1: [`${oilKg} kg`, `${canKg} kg`],
          r2: [isEn ? 'Full Containers' : 'Πλήρη Δοχεία', `${correctStr}`]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Divide: ${oilKg} : ${canKg} ＝ ${cans} with remainder ${rem} kg. Thus, ${correctStr} will be completely filled.`
          : `Εκτελούμε τη διαίρεση: ${oilKg} : ${canKg} ＝ ${cans} με υπόλοιπο ${rem} kg. Θα γεμίσουν πλήρως ${correctStr}.`
      };
    }
  },
  {
    id: 'p_div_hard_4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const totalEggs = randInt(140, 260);
      const perCarton = 6;
      const fullCartons = Math.floor(totalEggs / perCarton);
      const remaining = totalEggs % perCarton;
      const unitCarton = isEn ? 'cartons' : 'θήκες';
      const remLabel = isEn ? `remaining ${remaining}` : `περίσσεψαν ${remaining}`;
      const correctStr = `${fullCartons} ${unitCarton} (${remLabel})`;
      const fake1 = `${fullCartons + 1} ${unitCarton} (${isEn ? 'remaining 0' : 'περίσσεψαν 0'})`;
      const fake2 = `${fullCartons} ${unitCarton} (${isEn ? 'remaining 0' : 'περίσσεψαν 0'})`;
      const fake3 = `${Math.max(1, fullCartons - 1)} ${unitCarton} (${isEn ? `remaining ${remaining + 1}` : `περίσσεψαν ${remaining + 1}`})`;

      const options = makeUniqueOptions(correctStr, [fake1, fake2, fake3]);

      return {
        title: isEn ? 'PACKING EGGS IN CARTONS' : 'ΣΥΣΚΕΥΑΣΙΑ ΑΥΓΩΝ ΣΕ ΘΗΚΕΣ',
        instruction: isEn ? 'Select full cartons and remaining eggs:' : 'Επιλέξτε τις πλήρεις θήκες και τα αυγά που περισσεύουν:',
        text: isEn
          ? `A poultry farm collected ${totalEggs} eggs and packs them in cartons of 6. How many full cartons will be filled and how many eggs remain?`
          : `Σε ένα πτηνοτροφείο μαζεύτηκαν ${totalEggs} αυγά και συσκευάζονται σε 6άδες. Πόσες πλήρεις θήκες θα γεμίσουν και πόσα αυγά θα περισσέψουν;`,
        tableData: {
          col1: isEn ? 'Total Eggs' : 'Σύνολο Αυγών',
          col2: isEn ? 'Carton Capacity' : 'Χωρητικότητα Θήκης',
          r1: [isEn ? `${totalEggs} eggs` : `${totalEggs} αυγά`, isEn ? '6 eggs' : '6 αυγά'],
          r2: [isEn ? 'Result' : 'Αποτέλεσμα', `${correctStr}`]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Divide: ${totalEggs} : 6 ＝ ${fullCartons} with remainder ${remaining} eggs. Therefore: ${correctStr}.`
          : `Εκτελούμε τη διαίρεση: ${totalEggs} : 6 ＝ ${fullCartons} με υπόλοιπο ${remaining} αυγά. Άρα ${correctStr}.`
      };
    }
  },
  {
    id: 'p_div_hard_5',
    generate: (locale) => {
      const isEn = locale === 'en';
      const apples = randInt(180, 320);
      const perCrate = 15;
      const fullCrates = Math.floor(apples / perCrate);
      const rem = apples % perCrate;
      const totalCrates = rem > 0 ? fullCrates + 1 : fullCrates;
      const unitCrate = isEn ? 'crates' : 'τελάρα';
      const correctStr = `${totalCrates} ${unitCrate}`;
      const fake1 = `${fullCrates} ${unitCrate}`;
      const fake2 = `${totalCrates + 2} ${unitCrate}`;
      const fake3 = `${Math.max(1, fullCrates - 1)} ${unitCrate}`;

      const options = makeUniqueOptions(correctStr, [fake1, fake2, fake3]);

      return {
        title: isEn ? 'TRANSPORTING APPLES IN CRATES' : 'ΜΕΤΑΦΟΡΑ ΜΗΛΩΝ ΣΕ ΤΕΛΑΡΑ',
        instruction: isEn ? 'Select minimum crates required:' : 'Επιλέξτε πόσα τελάρα χρειάζονται τουλάχιστον:',
        text: isEn
          ? `An orchard farmer collected ${apples} apples and packs them in crates holding ${perCrate} apples each. How many crates will be needed at least to hold all apples?`
          : `Ένας παραγωγός μάζεψε ${apples} μήλα και θέλει να τα βάλει σε τελάρα που χωρούν ${perCrate} μήλα το καθένα. Πόσα τελάρα θα χρειαστεί τουλάχιστον για να μπουν όλα τα μήλα;`,
        tableData: {
          col1: isEn ? 'Total Apples' : 'Σύνολο Μήλων',
          col2: isEn ? 'Crate Capacity' : 'Χωρητικότητα Τελάρου',
          r1: [isEn ? `${apples} apples` : `${apples} μήλα`, isEn ? `${perCrate} apples` : `${perCrate} μήλα`],
          r2: [isEn ? `Division: ${fullCrates} (rem. ${rem})` : `Διαίρεση: ${fullCrates} (υπόλ. ${rem})`, `${correctStr}`]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Divide: ${apples} : ${perCrate} ＝ ${fullCrates} with remainder ${rem} apples. To carry the remaining ${rem} apples, at least ${correctStr} are required.`
          : `Εκτελούμε τη διαίρεση: ${apples} : ${perCrate} ＝ ${fullCrates} με υπόλοιπο ${rem} μήλα. Για να χωρέσουν και τα ${rem} μήλα που περισσεύουν, απαιτούνται συνολικά ${correctStr}.`
      };
    }
  },
  {
    id: 'p_div_hard_6',
    generate: (locale) => {
      const isEn = locale === 'en';
      const budget = randInt(250, 600);
      const ballPrice = 18;
      const balls = Math.floor(budget / ballPrice);
      const remMoney = budget % ballPrice;
      const unitBall = isEn ? 'balls' : 'μπάλες';
      const remLabel = isEn ? `change ${remMoney} €` : `περίσσεψαν ${remMoney} €`;
      const correctStr = `${balls} ${unitBall} (${remLabel})`;
      const fake1 = `${balls + 1} ${unitBall} (${isEn ? 'change 0 €' : 'περίσσεψαν 0 €'})`;
      const fake2 = `${balls} ${unitBall} (${isEn ? 'change 0 €' : 'περίσσεψαν 0 €'})`;
      const fake3 = `${Math.max(1, balls - 1)} ${unitBall} (${isEn ? `change ${remMoney + 5} €` : `περίσσεψαν ${remMoney + 5} €`})`;

      const options = makeUniqueOptions(correctStr, [fake1, fake2, fake3]);

      return {
        title: isEn ? 'PURCHASE OF SPORTS BALLS' : 'ΑΓΟΡΑ ΑΘΛΗΤΙΚΩΝ ΜΠΑΛΩΝ',
        instruction: isEn ? 'Select number of balls purchased and remaining budget:' : 'Επιλέξτε πόσες μπάλες αγοράστηκαν και το περίσσευμα:',
        text: isEn
          ? `A sports club has a budget of ${budget} € to buy balls costing ${ballPrice} € each. How many balls can they buy at most and how much money will remain?`
          : `Ένας σύλλογος διαθέτει προϋπολογισμό ${budget} € για την αγορά μπαλών που κοστίζουν ${ballPrice} € η καθεμία. Πόσες μπάλες μπορεί να αγοράσει το πολύ και πόσα χρήματα (€) θα του περισσέψουν;`,
        tableData: {
          col1: isEn ? 'Available Budget' : 'Διαθέσιμο Ποσό',
          col2: isEn ? 'Ball Price' : 'Τιμή Μπάλας',
          r1: [`${budget} €`, `${ballPrice} €`],
          r2: [isEn ? 'Result' : 'Αποτέλεσμα', `${correctStr}`]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Divide: ${budget} : ${ballPrice} ＝ ${balls} with remainder ${remMoney} €. Thus: ${correctStr}.`
          : `Διαιρούμε: ${budget} : ${ballPrice} ＝ ${balls} με υπόλοιπο ${remMoney} €. Άρα ${correctStr}.`
      };
    }
  }
];

function generateQuestions(locale = 'el') {
  const isEn = locale === 'en';
  const qList = [];
  const itemsPool = REAL_WORLD_DIVISIONS[locale] || REAL_WORLD_DIVISIONS.el;
  const shuffledItems = shuffle(itemsPool);

  // Q1 (Input): Υπολογισμός Πηλίκου σε Τέλεια Διαίρεση
  {
    const q1Divisor = randInt(4, 12);
    const q1Quotient = randInt(12, 85);
    const q1Dividend = q1Divisor * q1Quotient;

    qList.push({
      id: 1,
      type: 'decimal_input',
      title: isEn ? 'QUESTION 1 • EXACT DIVISION (QUOTIENT)' : 'ΕΡΩΤΗΣΗ 1 • ΤΕΛΕΙΑ ΔΙΑΙΡΕΣΗ (ΠΗΛΙΚΟ)',
      instruction: isEn ? 'Calculate quotient of the exact division (integer):' : 'Υπολογίστε το πηλίκο της τέλειας διαίρεσης (ακέραιος):',
      prompt: isEn ? `Calculate quotient: ${formatNumber(q1Dividend, locale)} : ${q1Divisor}` : `Υπολογίστε το πηλίκο: ${formatNumber(q1Dividend, locale)} : ${q1Divisor}`,
      correctVal: q1Quotient,
      correctStr: String(q1Quotient),
      explanation: isEn
        ? `The division is exact (remainder 0): ${formatNumber(q1Dividend, locale)} : ${q1Divisor} ＝ ${q1Quotient}.`
        : `Η διαίρεση είναι τέλεια (υπόλοιπο 0): ${formatNumber(q1Dividend, locale)} : ${q1Divisor} ＝ ${q1Quotient}.`
    });
  }

  // Q2 (Input): Εύρεση Διαιρετέου (Δ ＝ δ · π ＋ υ)
  {
    const q2Divisor = randInt(6, 15);
    const q2Quotient = randInt(14, 45);
    const q2Remainder = randInt(1, q2Divisor - 1);
    const q2Dividend = q2Divisor * q2Quotient + q2Remainder;

    qList.push({
      id: 2,
      type: 'decimal_input',
      title: isEn ? 'QUESTION 2 • FINDING DIVIDEND (D)' : 'ΕΡΩΤΗΣΗ 2 • ΕΥΡΕΣΗ ΔΙΑΙΡΕΤΕΟΥ (Δ)',
      instruction: isEn ? 'Find Dividend using the division identity (integer):' : 'Βρείτε τον Διαιρετέο εφαρμόζοντας την ταυτότητα της διαίρεσης (ακέραιος χωρίς τελείες):',
      prompt: isEn
        ? `Find Dividend (D) when: divisor (d) ＝ ${q2Divisor}, quotient (q) ＝ ${q2Quotient}, and remainder (r) ＝ ${q2Remainder}.`
        : `Βρείτε τον Διαιρετέο (Δ) όταν: διαιρέτης (δ) ＝ ${q2Divisor}, πηλίκο (π) ＝ ${q2Quotient} και υπόλοιπο (υ) ＝ ${q2Remainder}.`,
      correctVal: q2Dividend,
      correctStr: String(q2Dividend),
      explanation: isEn
        ? `Apply division identity D ＝ d · q ＋ r: D ＝ (${q2Divisor} · ${q2Quotient}) ＋ ${q2Remainder} ＝ ${q2Divisor * q2Quotient} ＋ ${q2Remainder} ＝ ${formatNumber(q2Dividend, locale)}.`
        : `Εφαρμόζουμε την ταυτότητα της διαίρεσης Δ ＝ δ · π ＋ υ: Δ ＝ (${q2Divisor} · ${q2Quotient}) ＋ ${q2Remainder} ＝ ${q2Divisor * q2Quotient} ＋ ${q2Remainder} ＝ ${formatNumber(q2Dividend, locale)}.`
    });
  }

  // Q3 (MCQ): Χαρακτηρισμός Τέλειας / Ατελούς Διαίρεσης (4 Επιλογές)
  {
    const q3IsPerfect = Math.random() > 0.5;
    const q3Divisor = randInt(4, 9);
    const q3Quotient = randInt(10, 30);
    const q3Remainder = q3IsPerfect ? 0 : randInt(1, q3Divisor - 1);
    const q3Dividend = q3Divisor * q3Quotient + q3Remainder;
    const labelExact = isEn ? 'Exact Division' : 'Τέλεια Διαίρεση';
    const labelInexact = isEn ? 'Inexact Division' : 'Ατελής Διαίρεση';
    const distractor1 = isEn ? 'Undefined Division (division by zero)' : 'Αδύνατη Διαίρεση (με διαιρέτη το μηδέν)';
    const distractor2 = isEn ? 'Decimal Divisor Division' : 'Διαίρεση με δεκαδικό διαιρέτη';
    const q3Correct = q3IsPerfect ? labelExact : labelInexact;

    const options = makeUniqueOptions(q3Correct, [
      q3IsPerfect ? labelInexact : labelExact,
      distractor1,
      distractor2
    ]);

    qList.push({
      id: 3,
      type: 'mcq',
      title: isEn ? 'QUESTION 3 • DIVISION CLASSIFICATION' : 'ΕΡΩΤΗΣΗ 3 • ΧΑΡΑΚΤΗΡΙΣΜΟΣ ΠΡΑΞΗΣ',
      instruction: isEn ? 'Select type of division:' : 'Επιλέξτε το είδος της διαίρεσης:',
      prompt: isEn ? `What type of division is ${formatNumber(q3Dividend, locale)} : ${q3Divisor}?` : `Ποιο είναι το είδος της διαίρεσης ${formatNumber(q3Dividend, locale)} : ${q3Divisor};`,
      options,
      correctText: q3Correct,
      explanation: q3IsPerfect
        ? (isEn
            ? `Because ${formatNumber(q3Dividend, locale)} ＝ ${q3Divisor} · ${q3Quotient} (remainder 0), the division is Exact.`
            : `Επειδή ${formatNumber(q3Dividend, locale)} ＝ ${q3Divisor} · ${q3Quotient} (υπόλοιπο 0), η διαίρεση είναι Τέλεια.`)
        : (isEn
            ? `Because ${formatNumber(q3Dividend, locale)} ＝ (${q3Divisor} · ${q3Quotient}) ＋ ${q3Remainder} (remainder ${q3Remainder} ＞ 0), the division is Inexact.`
            : `Επειδή ${formatNumber(q3Dividend, locale)} ＝ (${q3Divisor} · ${q3Quotient}) ＋ ${q3Remainder} (υπόλοιπο ${q3Remainder} ＞ 0), η διαίρεση είναι Ατελής.`)
    });
  }

  // Q4 (MCQ): Πρόβλημα Καθημερινότητας με Υπόλοιπο
  {
    const q4Item = shuffledItems[0];
    const q4Divisor = randInt(5, 9);
    const q4Quotient = randInt(8, 25);
    const q4Remainder = randInt(1, q4Divisor - 1);
    const q4Dividend = q4Divisor * q4Quotient + q4Remainder;
    const remLabel = isEn ? `remainder ${q4Remainder}` : `περίσσεψαν ${q4Remainder}`;
    const q4Correct = `${q4Quotient} ${q4Item.unit} (${remLabel})`;

    const w1 = `${q4Quotient + 1} ${q4Item.unit} (${isEn ? 'remainder 0' : 'περίσσεψαν 0'})`;
    const w2 = `${q4Quotient} ${q4Item.unit} (${isEn ? 'remainder 0' : 'περίσσεψαν 0'})`;
    const w3 = `${Math.max(1, q4Quotient - 1)} ${q4Item.unit} (${isEn ? `remainder ${q4Remainder + 1}` : `περίσσεψαν ${q4Remainder + 1}`})`;

    const options = makeUniqueOptions(q4Correct, [w1, w2, w3]);

    qList.push({
      id: 4,
      type: 'mcq',
      title: isEn ? 'QUESTION 4 • EVERYDAY PROBLEM' : 'ΕΡΩΤΗΣΗ 4 • ΠΡΟΒΛΗΜΑ ΚΑΘΗΜΕΡΙΝΟΤΗΤΑΣ',
      instruction: isEn ? 'Select the correct allocation and remainder:' : 'Επιλέξτε τη σωστή κατανομή και το υπόλοιπο:',
      prompt: isEn
        ? `We distribute ${q4Dividend} ${q4Item.item} among ${q4Divisor} ${q4Item.group}. How many ${q4Item.unit} will each receive and how many are left over?`
        : `Μοιράζουμε ${q4Dividend} ${q4Item.item} σε ${q4Divisor} ${q4Item.group}. Πόσα ${q4Item.unit} θα πάρει το καθένα και πόσα θα περισσέψουν;`,
      options,
      correctText: q4Correct,
      explanation: isEn
        ? `Perform division ${q4Dividend} : ${q4Divisor}: Quotient ＝ ${q4Quotient}, Remainder ＝ ${q4Remainder}.`
        : `Κάνουμε τη διαίρεση ${q4Dividend} : ${q4Divisor}: Πηλίκο ＝ ${q4Quotient}, Υπόλοιπο ＝ ${q4Remainder}.`
    });
  }

  // Q5 (MCQ): True / False - Κανόνας Υπολοίπου (υ ＜ δ)
  {
    const q5IsTrue = Math.random() > 0.5;
    const q5Div = randInt(6, 12);
    const q5Text = isEn
      ? (q5IsTrue
          ? `In an inexact division with divisor ${q5Div}, the remainder can be any integer from 1 up to ${q5Div - 1}.`
          : `In an inexact division with divisor ${q5Div}, the remainder can be equal to ${q5Div} or greater.`)
      : (q5IsTrue
          ? `Σε μια ατελή διαίρεση με διαιρέτη το ${q5Div}, το υπόλοιπο μπορεί να είναι οποιοσδήποτε αριθμός από το 1 έως το ${q5Div - 1}.`
          : `Σε μια ατελή διαίρεση με διαιρέτη το ${q5Div}, το υπόλοιπο μπορεί να είναι ίσο με ${q5Div} ή μεγαλύτερο.`);

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
      title: isEn ? 'QUESTION 5 • REMAINDER RULE' : 'ΕΡΩΤΗΣΗ 5 • ΚΑΝΟΝΑΣ ΥΠΟΛΟΙΠΟΥ',
      instruction: isEn ? 'Classify statement as True or False:' : 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q5Text}»`,
      options,
      correctText: correctAns,
      explanation: isEn
        ? (q5IsTrue
            ? 'Correct! The remainder (r) is always strictly less than the divisor (r ＜ d).'
            : 'False! The remainder can never be equal to or greater than the divisor.')
        : (q5IsTrue
            ? 'Σωστό! Το υπόλοιπο (υ) είναι πάντοτε αυστηρά μικρότερο από τον διαιρέτη (υ ＜ δ).'
            : 'Λάθος! Το υπόλοιπο δεν μπορεί ποτέ να είναι ίσο με τον διαιρέτη ή μεγαλύτερο από αυτόν.')
    });
  }

  // Q6 (MCQ): True / False - Μαθηματική Ταυτότητα (Δ ＝ δ · π ＋ υ)
  {
    const q6IsTrue = Math.random() > 0.5;
    const q6Text = isEn
      ? (q6IsTrue
          ? 'The division identity is formulated as: Dividend ＝ (Divisor · Quotient) ＋ Remainder.'
          : 'The division identity is formulated as: Dividend ＝ (Divisor ＋ Quotient) · Remainder.')
      : (q6IsTrue
          ? 'Η μαθηματική ταυτότητα της διαίρεσης εκφράζεται ως: Διαιρετέος ＝ (Διαιρέτης · Πηλίκο) ＋ Υπόλοιπο.'
          : 'Η μαθηματική ταυτότητα της διαίρεσης εκφράζεται ως: Διαιρετέος ＝ (Διαιρέτης ＋ Πηλίκο) · Υπόλοιπο.');

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
      title: isEn ? 'QUESTION 6 • DIVISION IDENTITY' : 'ΕΡΩΤΗΣΗ 6 • ΜΑΘΗΜΑΤΙΚΗ ΤΑΥΤΟΤΗΤΑ',
      instruction: isEn ? 'Classify statement as True or False:' : 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q6Text}»`,
      options,
      correctText: correctAns,
      explanation: isEn
        ? (q6IsTrue
            ? 'Correct! The Dividend is always equal to the divisor multiplied by the quotient plus the remainder.'
            : 'False! The correct formula is: D ＝ (d · q) ＋ r.')
        : (q6IsTrue
            ? 'Σωστό! Ο Διαιρετέος ισούται πάντα με το γινόμενο του Διαιρέτη επί το Πηλίκο συν το Υπόλοιπο.'
            : 'Λάθος! Ο σωστός τύπος είναι: Δ ＝ (δ · π) ＋ υ.')
    });
  }

  // Q7 (Input): Οπτικό Μοίρασμα σε Ομάδες
  {
    const q7Divisor = randInt(3, 6);
    const q7Quotient = randInt(4, 8);
    const q7Remainder = randInt(1, q7Divisor - 1);
    const q7Dividend = q7Divisor * q7Quotient + q7Remainder;

    qList.push({
      id: 7,
      type: 'decimal_input',
      title: isEn ? 'QUESTION 7 • VISUAL GROUPING' : 'ΕΡΩΤΗΣΗ 7 • ΟΠΤΙΚΟ ΜΟΙΡΑΣΜΑ',
      instruction: isEn ? 'Find how many items each group receives (integer):' : 'Βρείτε πόσα στοιχεία παίρνει κάθε ομάδα (ακέραιος):',
      prompt: isEn
        ? `We share ${q7Dividend} items into ${q7Divisor} equal groups. How many items does each group receive?`
        : `Μοιράζουμε ${q7Dividend} στοιχεία σε ${q7Divisor} ίσες ομάδες. Πόσα στοιχεία παίρνει η κάθε ομάδα;`,
      correctVal: q7Quotient,
      correctStr: String(q7Quotient),
      explanation: isEn
        ? `Sharing ${q7Dividend} items into ${q7Divisor} groups: ${q7Dividend} : ${q7Divisor} ＝ ${q7Quotient} with ${q7Remainder} remaining (remainder).`
        : `Μοιράζοντας ${q7Dividend} στοιχεία σε ${q7Divisor} ομάδες: ${q7Dividend} : ${q7Divisor} ＝ ${q7Quotient} και περισσεύουν ${q7Remainder} (υπόλοιπο).`
    });
  }

  // Q8 (MCQ): Εύρεση Υπολοίπου
  {
    const q8Divisor = randInt(7, 12);
    const q8Quotient = randInt(15, 35);
    const q8Remainder = randInt(2, q8Divisor - 1);
    const q8Dividend = q8Divisor * q8Quotient + q8Remainder;
    const remSymbol = isEn ? 'r' : 'υ';
    const correctValStr = String(q8Remainder);

    const w1 = String(q8Remainder + 1);
    const w2 = '0';
    const w3 = String(q8Divisor);

    const rawOptions = makeUniqueOptions(correctValStr, [w1, w2, w3]);
    const options = rawOptions.map((opt) => ({
      text: `${remSymbol} ＝ ${opt.text}`,
      isCorrect: opt.isCorrect
    }));

    qList.push({
      id: 8,
      type: 'mcq',
      title: isEn ? 'QUESTION 8 • FINDING REMAINDER' : 'ΕΡΩΤΗΣΗ 8 • ΕΥΡΕΣΗ ΥΠΟΛΟΙΠΟΥ',
      instruction: isEn ? 'Select the correct remainder of the division:' : 'Επιλέξτε το σωστό υπόλοιπο της διαίρεσης:',
      prompt: isEn
        ? `In the division ${formatNumber(q8Dividend, locale)} : ${q8Divisor} ＝ ${q8Quotient}, what is remainder (${remSymbol})?`
        : `Στη διαίρεση ${formatNumber(q8Dividend, locale)} : ${q8Divisor} ＝ ${q8Quotient}, ποιο είναι το υπόλοιπο (${remSymbol});`,
      options,
      correctText: `${remSymbol} ＝ ${correctValStr}`,
      explanation: isEn
        ? `Calculate: ${formatNumber(q8Dividend, locale)} － (${q8Divisor} · ${q8Quotient}) ＝ ${formatNumber(q8Dividend, locale)} － ${formatNumber(q8Divisor * q8Quotient, locale)} ＝ ${q8Remainder}.`
        : `Υπολογίζουμε: ${formatNumber(q8Dividend, locale)} － (${q8Divisor} · ${q8Quotient}) ＝ ${formatNumber(q8Dividend, locale)} － ${formatNumber(q8Divisor * q8Quotient, locale)} ＝ ${q8Remainder}.`
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
    pageTitle: "Ασκήσεις: Τέλεια και Ατελής Διαίρεση - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "10 απαιτητικές ασκήσεις και προβλήματα στη διαίρεση φυσικών αριθμών, την τέλεια και ατελή διαίρεση και τη μαθηματική ταυτότητα για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryBtn: "📖 Θεωρία",
    badgeChapter: "ΚΕΦΑΛΑΙΟ 08 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    heroTitle: "Ασκήσεις & Προβλήματα: Τέλεια & Ατελής Διαίρεση",
    heroDesc: "10 δυναμικές δραστηριότητες με τέλειες και ατελείς διαιρέσεις, υπολογισμό πηλίκου και υπολοίπου, εφαρμογή της ταυτότητας της διαίρεσης και ρεαλιστικά προβλήματα καθημερινής ζωής.",
    heroDynamicNote: "⚡ Κάθε σετ δημιουργείται δυναμικά με τυχαίους αριθμούς.",
    btnNewSet: "🔄 ΝΕΕΣ ΑΣΚΗΣΕΙΣ",
    badgeCorrect: "✓ ΣΩΣΤΟ",
    badgeWrong: "✗ ΛΑΘΟΣ",
    inputPlaceholder: "Απάντηση...",
    inputNote: "(Ακέραιος αριθμός)",
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
    pageTitle: "Exercises: Exact & Inexact Division - Grade 6 | LearnMaths.gr",
    pageDesc: "10 interactive math problems on whole number division, remainders, and the division identity for Grade 6.",
    backText: "Grade 6",
    theoryBtn: "📖 Theory",
    badgeChapter: "CHAPTER 08 • GRADE 6 • PRACTICE",
    heroTitle: "Exercises & Problems: Exact & Inexact Division",
    heroDesc: "10 dynamic activities covering exact and inexact division, quotient and remainder calculation, applying the division identity, and real-world word problems.",
    heroDynamicNote: "⚡ Each exercise set is dynamically generated with random numbers.",
    btnNewSet: "🔄 NEW EXERCISES",
    badgeCorrect: "✓ CORRECT",
    badgeWrong: "✗ WRONG",
    inputPlaceholder: "Answer...",
    inputNote: "(Integer number)",
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

export default function DiairesiExercisesPage() {
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
    let sanitized = rawValue.replace(/\./g, '');
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
          href="/st-dimotikou/08-diairesi"
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
                </div>

                {/* Περιοχή Απάντησης */}
                <div className="py-2">
                  {q.type === 'decimal_input' && (
                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        type="text"
                        inputMode="numeric"
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