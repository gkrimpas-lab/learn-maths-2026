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

function formatNumber(num, locale = 'el') {
  if (num === '' || isNaN(num)) return '0';
  return Number(num).toLocaleString(locale === 'en' ? 'en-US' : 'el-GR');
}

const makeUniqueOptions = (correct, candidates) => {
  const unique = new Set([String(correct)]);
  for (const c of candidates) {
    if (c !== undefined && c !== null && String(c).trim() !== '') {
      unique.add(String(c));
    }
    if (unique.size === 4) break;
  }
  return shuffle(Array.from(unique));
};

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'p_mult_std_1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const perPacket = 8;
      const packets = randInt(12, 25);
      const totalCandies = perPacket * packets;
      const correctStr = isEn ? `Yes (exactly ${packets} packs)` : `Ναι (ακριβώς ${packets} πακέτα)`;
      const wrongCandidates = [
        isEn ? `No, ${randInt(1, 3)} are left over` : `Όχι, περισσεύουν ${randInt(1, 3)}`,
        isEn ? `No, ${randInt(2, 4)} are missing` : `Όχι, λείπουν ${randInt(2, 4)}`,
        isEn ? `Yes (exactly ${packets + 2} packs)` : `Ναι (ακριβώς ${packets + 2} πακέτα)`
      ];
      return {
        title: isEn ? 'PACKAGING CANDIES IN PACKS' : 'ΣΥΣΚΕΥΑΣΙΑ ΚΑΡΑΜΕΛΩΝ ΣΕ ΠΑΚΕΤΑ',
        instruction: isEn ? 'Select the correct answer:' : 'Επιλέξτε τη σωστή απάντηση:',
        text: isEn
          ? `A confectioner packs candies into packs of ${perPacket}. If he has ${totalCandies} candies in total, can he distribute them equally without any remaining?`
          : `Ένας ζαχαροπλάστης συσκευάζει καραμέλες σε πακέτα των ${perPacket} τεμαχίων. Αν έχει συνολικά ${totalCandies} καραμέλες, μπορεί να τις μοιράσει ακριβώς χωρίς να του περισσέψει καμία;`,
        tableData: {
          col1: isEn ? 'Total Candies' : 'Σύνολο Καραμελών',
          col2: isEn ? 'Per Pack' : 'Ανά Πακέτο',
          r1: [`${totalCandies} ${isEn ? 'candies' : 'καραμέλες'}`, isEn ? `${perPacket} per pack` : `${perPacket} ανά πακέτο`],
          r2: [isEn ? 'Multiple Check' : 'Έλεγχος Πολλαπλασίου', `${totalCandies} : ${perPacket} ＝ ${packets} ${isEn ? 'packs' : 'πακέτα'} ✅`]
        },
        optionsRaw: makeUniqueOptions(correctStr, wrongCandidates),
        correctText: correctStr,
        explanation: isEn
          ? `The number ${totalCandies} is a multiple of ${perPacket} (${perPacket} · ${packets} ＝ ${totalCandies}), so exactly ${packets} packs are formed.`
          : `Ο αριθμός ${totalCandies} είναι πολλαπλάσιο του ${perPacket} (${perPacket} · ${packets} ＝ ${totalCandies}), άρα σχηματίζονται ακριβώς ${packets} πακέτα.`
      };
    }
  },
  {
    id: 'p_mult_std_2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const step = 6;
      const hours = randInt(5, 10);
      const totalKm = step * hours;
      const correctStr = `${totalKm} km`;
      const wrongCandidates = [
        `${totalKm + step} km`,
        `${totalKm - step} km`,
        `${totalKm + 10} km`
      ];
      return {
        title: isEn ? 'RUNNER DISTANCE CALCULATION' : 'ΥΠΟΛΟΓΙΣΜΟΣ ΑΠΟΣΤΑΣΗΣ ΔΡΟΜΕΑ',
        instruction: isEn ? 'Select the total distance:' : 'Επιλέξτε τη συνολική απόσταση:',
        text: isEn
          ? `A runner trains at a steady speed of ${step} km/h. How many kilometers (km) will he cover in ${hours} hours of continuous running?`
          : `Ένας δρομέας προπονείται με σταθερή ταχύτητα ${step} km την ώρα. Πόσα χιλιόμετρα (km) θα διανύσει συνολικά σε ${hours} ώρες συνεχούς τρεξίματος;`,
        tableData: {
          col1: isEn ? 'Speed' : 'Ταχύτητα',
          col2: isEn ? 'Time' : 'Χρόνος',
          r1: [`${step} km/h`, `${hours} ${isEn ? 'hours' : 'ώρες'}`],
          r2: [isEn ? 'Calculation' : 'Υπολογισμός', `${step} · ${hours} ＝ ${totalKm} km`]
        },
        optionsRaw: makeUniqueOptions(correctStr, wrongCandidates),
        correctText: correctStr,
        explanation: isEn
          ? `The ${hours}th multiple of ${step} is: ${step} · ${hours} ＝ ${correctStr}.`
          : `Το ${hours}ο πολλαπλάσιο του ${step} είναι: ${step} · ${hours} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_mult_std_3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const perRow = 12;
      const rows = randInt(8, 15);
      const totalChairs = perRow * rows;
      const unitChair = isEn ? 'chairs' : 'καρέκλες';
      const correctStr = `${totalChairs} ${unitChair}`;
      const wrongCandidates = [
        `${totalChairs + perRow} ${unitChair}`,
        `${totalChairs - perRow} ${unitChair}`,
        `${totalChairs + 6} ${unitChair}`
      ];
      return {
        title: isEn ? 'ARRANGING SEATS IN ROWS' : 'ΤΟΠΟΘΕΤΗΣΗ ΚΑΘΙΣΜΑΤΩΝ ΣΕ ΣΕΙΡΕΣ',
        instruction: isEn ? 'Select the total number of chairs:' : 'Επιλέξτε το συνολικό πλήθος των καθισμάτων:',
        text: isEn
          ? `In an auditorium, chairs are arranged in ${rows} equal rows of ${perRow} seats. How many chairs will be used in total?`
          : `Σε μια αίθουσα εκδηλώσεων τοποθετούνται καρέκλες σε ${rows} ίσες σειρές των ${perRow} καθισμάτων. Πόσες καρέκλες θα χρησιμοποιηθούν συνολικά;`,
        tableData: {
          col1: isEn ? 'Chairs per Row' : 'Καρέκλες ανά Σειρά',
          col2: isEn ? 'Rows' : 'Σειρές',
          r1: [`${perRow} ${unitChair}`, `${rows} ${isEn ? 'rows' : 'σειρές'}`],
          r2: [isEn ? 'Multiple' : 'Πολλαπλάσιο', `${perRow} · ${rows} ＝ ${totalChairs}`]
        },
        optionsRaw: makeUniqueOptions(correctStr, wrongCandidates),
        correctText: correctStr,
        explanation: isEn
          ? `Multiply chairs per row by number of rows: ${perRow} · ${rows} ＝ ${correctStr}.`
          : `Πολλαπλασιάζουμε τις καρέκλες κάθε σειράς με τον αριθμό των σειρών: ${perRow} · ${rows} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_mult_std_4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const perBox = 15;
      const boxes = randInt(6, 12);
      const totalJuices = perBox * boxes;
      const unit = isEn ? 'juices' : 'χυμοί';
      const correctStr = `${totalJuices} ${unit}`;
      const wrongCandidates = [
        `${totalJuices + 15} ${unit}`,
        `${totalJuices - 15} ${unit}`,
        `${totalJuices + 30} ${unit}`
      ];
      return {
        title: isEn ? 'BOXES OF JUICE' : 'ΚΙΒΩΤΙΑ ΜΕ ΧΥΜΟΥΣ',
        instruction: isEn ? 'Select the total number of juice packs:' : 'Επιλέξτε το συνολικό πλήθος των χυμών:',
        text: isEn
          ? `A grocery store received ${boxes} cartons of juice. If each carton contains ${perBox} juices, how many juice packs did it receive in total?`
          : `Ένα παντοπωλείο παρέλαβε ${boxes} κιβώτια με χυμούς. Αν κάθε κιβώτιο περιέχει ${perBox} χυμούς, πόσους χυμούς παρέλαβε συνολικά;`,
        tableData: {
          col1: isEn ? 'Cartons' : 'Κιβώτια',
          col2: isEn ? 'Juices per Carton' : 'Χυμοί ανά Κιβώτιο',
          r1: [`${boxes} ${isEn ? 'cartons' : 'κιβώτια'}`, `${perBox} ${unit}`],
          r2: [isEn ? 'Product' : 'Γινόμενο', `${boxes} · ${perBox} ＝ ${totalJuices}`]
        },
        optionsRaw: makeUniqueOptions(correctStr, wrongCandidates),
        correctText: correctStr,
        explanation: isEn
          ? `Calculate: ${boxes} · ${perBox} ＝ ${correctStr}.`
          : `Υπολογίζουμε: ${boxes} · ${perBox} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_mult_std_5',
    generate: (locale) => {
      const isEn = locale === 'en';
      const perTeam = 7;
      const teams = randInt(8, 14);
      const totalPlayers = perTeam * teams;
      const unit = isEn ? 'players' : 'παίκτες';
      const correctStr = `${totalPlayers} ${unit}`;
      const wrongCandidates = [
        `${totalPlayers + 7} ${unit}`,
        `${totalPlayers - 7} ${unit}`,
        `${totalPlayers + 14} ${unit}`
      ];
      return {
        title: isEn ? 'HANDBALL TEAMS' : 'ΟΜΑΔΕΣ ΧΑΝΤΜΠΟΛ',
        instruction: isEn ? 'Select total number of players:' : 'Επιλέξτε το συνολικό πλήθος παικτών:',
        text: isEn
          ? `In a school tournament, ${teams} handball teams participate with ${perTeam} players each. How many players compete in total?`
          : `Σε ένα σχολικό τουρνουά συμμετέχουν ${teams} ομάδες χάντμπολ με ${perTeam} παίκτες η καθεμία. Πόσοι παίκτες αγωνίζονται συνολικά;`,
        tableData: {
          col1: isEn ? 'Teams' : 'Ομάδες',
          col2: isEn ? 'Players per Team' : 'Παίκτες ανά Ομάδα',
          r1: [`${teams} ${isEn ? 'teams' : 'ομάδες'}`, `${perTeam} ${unit}`],
          r2: [isEn ? 'Multiple' : 'Πολλαπλάσιο', `${teams} · ${perTeam} ＝ ${totalPlayers}`]
        },
        optionsRaw: makeUniqueOptions(correctStr, wrongCandidates),
        correctText: correctStr,
        explanation: isEn
          ? `Multiply: ${teams} · ${perTeam} ＝ ${correctStr}.`
          : `Πολλαπλασιάζουμε: ${teams} · ${perTeam} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_mult_std_6',
    generate: (locale) => {
      const isEn = locale === 'en';
      const perShelf = 20;
      const shelves = randInt(7, 15);
      const totalBooks = perShelf * shelves;
      const unit = isEn ? 'books' : 'βιβλία';
      const correctStr = `${totalBooks} ${unit}`;
      const wrongCandidates = [
        `${totalBooks + 20} ${unit}`,
        `${totalBooks - 20} ${unit}`,
        `${totalBooks + 10} ${unit}`
      ];
      return {
        title: isEn ? 'PLACING BOOKS ON SHELVES' : 'ΤΟΠΟΘΕΤΗΣΗ ΒΙΒΛΙΩΝ ΣΕ ΡΑΦΙΑ',
        instruction: isEn ? 'Select total number of books:' : 'Επιλέξτε τον συνολικό αριθμό βιβλίων:',
        text: isEn
          ? `In a school library there are ${shelves} shelves. If exactly ${perShelf} books are placed on each shelf, how many books can they hold in total?`
          : `Σε μια σχολική βιβλιοθήκη υπάρχουν ${shelves} ράφια. Αν σε κάθε ράφι τοποθετηθούν ακριβώς ${perShelf} βιβλία, πόσα βιβλία χωρούν συνολικά;`,
        tableData: {
          col1: isEn ? 'Shelves' : 'Ράφια',
          col2: isEn ? 'Books per Shelf' : 'Βιβλία ανά Ράφι',
          r1: [`${shelves} ${isEn ? 'shelves' : 'ράφια'}`, `${perShelf} ${unit}`],
          r2: [isEn ? 'Multiple' : 'Πολλαπλάσιο', `${shelves} · ${perShelf} ＝ ${totalBooks}`]
        },
        optionsRaw: makeUniqueOptions(correctStr, wrongCandidates),
        correctText: correctStr,
        explanation: isEn
          ? `Calculate: ${shelves} · ${perShelf} ＝ ${correctStr}.`
          : `Υπολογίζουμε: ${shelves} · ${perShelf} ＝ ${correctStr}.`
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'p_mult_hard_1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const perRow = 15;
      const rows = randInt(12, 20);
      const totalTiles = perRow * rows;
      const unit = isEn ? 'tiles' : 'πλακάκια';
      const correctStr = `${totalTiles} ${unit}`;
      const wrongCandidates = [
        `${totalTiles + 15} ${unit}`,
        `${totalTiles - 15} ${unit}`,
        `${totalTiles + 30} ${unit}`
      ];
      return {
        title: isEn ? 'COMPLEX TILE COMPUTATION' : 'ΣΥΝΘΕΤΟΣ ΥΠΟΛΟΓΙΣΜΟΣ ΠΛΑΚΙΔΙΩΝ',
        instruction: isEn ? 'Select total number of tiles:' : 'Επιλέξτε το συνολικό πλήθος πλακιδίων:',
        text: isEn
          ? `A builder laid floor tiles in ${rows} rows with ${perRow} tiles in each row. How many tiles did he lay in total?`
          : `Ένας πλακοστρωτής τοποθέτησε πλακάκια σε ${rows} σειρές με ${perRow} πλακάκια σε κάθε σειρά. Πόσα πλακάκια χρησιμοποίησε συνολικά;`,
        tableData: {
          col1: isEn ? 'Rows' : 'Σειρές',
          col2: isEn ? 'Tiles per Row' : 'Πλακάκια ανά Σειρά',
          r1: [`${rows} ${isEn ? 'rows' : 'σειρές'}`, `${perRow} ${unit}`],
          r2: [isEn ? 'Product' : 'Γινόμενο', `${rows} · ${perRow} ＝ ${totalTiles}`]
        },
        optionsRaw: makeUniqueOptions(correctStr, wrongCandidates),
        correctText: correctStr,
        explanation: isEn
          ? `Multiply: ${rows} · ${perRow} ＝ ${correctStr}.`
          : `Πολλαπλασιάζουμε: ${rows} · ${perRow} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_mult_hard_2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const perDay = 25;
      const days = randInt(14, 28);
      const totalPages = perDay * days;
      const unit = isEn ? 'pages' : 'σελίδες';
      const correctStr = `${totalPages} ${unit}`;
      const wrongCandidates = [
        `${totalPages + 25} ${unit}`,
        `${totalPages - 25} ${unit}`,
        `${totalPages + 50} ${unit}`
      ];
      return {
        title: isEn ? 'BOOK READING RATE' : 'ΡΥΘΜΟΣ ΑΝΑΓΝΩΣΗΣ ΒΙΒΛΙΟΥ',
        instruction: isEn ? 'Select total number of pages:' : 'Επιλέξτε τον συνολικό αριθμό σελίδων:',
        text: isEn
          ? `A student reads ${perDay} pages of a book every day. How many pages will she have read in total after ${days} days?`
          : `Μια μαθήτρια διαβάζει καθημερινά ${perDay} σελίδες από ένα βιβλίο. Πόσες σελίδες θα έχει διαβάσει συνολικά μετά από ${days} ημέρες;`,
        tableData: {
          col1: isEn ? 'Pages/Day' : 'Σελίδες/Ημέρα',
          col2: isEn ? 'Days' : 'Ημέρες',
          r1: [`${perDay} ${unit}`, `${days} ${isEn ? 'days' : 'ημέρες'}`],
          r2: [isEn ? 'Multiple' : 'Πολλαπλάσιο', `${days} · ${perDay} ＝ ${totalPages}`]
        },
        optionsRaw: makeUniqueOptions(correctStr, wrongCandidates),
        correctText: correctStr,
        explanation: isEn
          ? `Calculate: ${days} · ${perDay} ＝ ${correctStr}.`
          : `Υπολογίζουμε: ${days} · ${perDay} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_mult_hard_3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const panelsPerRow = 18;
      const rows = randInt(10, 16);
      const totalPanels = panelsPerRow * rows;
      const unit = isEn ? 'panels' : 'πάνελ';
      const correctStr = `${totalPanels} ${unit}`;
      const wrongCandidates = [
        `${totalPanels + 18} ${unit}`,
        `${totalPanels - 18} ${unit}`,
        `${totalPanels + 36} ${unit}`
      ];
      return {
        title: isEn ? 'SOLAR PANEL PARK' : 'ΦΩΤΟΒΟΛΤΑΪΚΟ ΠΑΡΚΟ',
        instruction: isEn ? 'Select total number of solar panels:' : 'Επιλέξτε το συνολικό πλήθος ηλιακών πάνελ:',
        text: isEn
          ? `In an energy farm, solar panels were installed in ${rows} rows of ${panelsPerRow} panels each. How many panels were installed in total?`
          : `Σε ένα ενεργειακό πάρκο εγκαταστάθηκαν φωτοβολταϊκά πάνελ τοποθετημένα σε ${rows} σειρές των ${panelsPerRow} πάνελ. Πόσα πάνελ εγκαταστάθηκαν συνολικά;`,
        tableData: {
          col1: isEn ? 'Rows' : 'Σειρές',
          col2: isEn ? 'Panels per Row' : 'Πάνελ ανά Σειρά',
          r1: [`${rows} ${isEn ? 'rows' : 'σειρές'}`, `${panelsPerRow} ${unit}`],
          r2: [isEn ? 'Product' : 'Γινόμενο', `${rows} · ${panelsPerRow} ＝ ${totalPanels}`]
        },
        optionsRaw: makeUniqueOptions(correctStr, wrongCandidates),
        correctText: correctStr,
        explanation: isEn
          ? `Multiply: ${rows} · ${panelsPerRow} ＝ ${correctStr}.`
          : `Πολλαπλασιάζουμε: ${rows} · ${panelsPerRow} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_mult_hard_4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const lapsPerDay = 30;
      const days = randInt(12, 24);
      const totalLaps = lapsPerDay * days;
      const unit = isEn ? 'laps' : 'γύροι';
      const correctStr = `${totalLaps} ${unit}`;
      const wrongCandidates = [
        `${totalLaps + 30} ${unit}`,
        `${totalLaps - 30} ${unit}`,
        `${totalLaps + 60} ${unit}`
      ];
      return {
        title: isEn ? 'SWIMMING PRACTICE' : 'ΠΡΟΠΟΝΗΣΗ ΣΤΟ ΚΟΛΥΜΒΗΤΗΡΙΟ',
        instruction: isEn ? 'Select total number of laps:' : 'Επιλέξτε το συνολικό πλήθος γύρων:',
        text: isEn
          ? `A swimmer completes ${lapsPerDay} pool laps in each training session. How many laps will she swim in total across ${days} sessions?`
          : `Μια κολυμβήτρια καλύπτει ${lapsPerDay} γύρους της πισίνας σε κάθε της προπόνηση. Πόσους γύρους θα διανύσει συνολικά σε ${days} προπονήσεις;`,
        tableData: {
          col1: isEn ? 'Laps/Session' : 'Γύροι/Προπόνηση',
          col2: isEn ? 'Sessions' : 'Προπονήσεις',
          r1: [`${lapsPerDay} ${unit}`, `${days} ${isEn ? 'sessions' : 'προπονήσεις'}`],
          r2: [isEn ? 'Multiple' : 'Πολλαπλάσιο', `${days} · ${lapsPerDay} ＝ ${totalLaps}`]
        },
        optionsRaw: makeUniqueOptions(correctStr, wrongCandidates),
        correctText: correctStr,
        explanation: isEn
          ? `Calculate: ${days} · ${lapsPerDay} ＝ ${correctStr}.`
          : `Υπολογίζουμε: ${days} · ${lapsPerDay} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_mult_hard_5',
    generate: (locale) => {
      const isEn = locale === 'en';
      const treesPerRow = 24;
      const rows = randInt(8, 15);
      const totalTrees = treesPerRow * rows;
      const unit = isEn ? 'trees' : 'δέντρα';
      const correctStr = `${totalTrees} ${unit}`;
      const wrongCandidates = [
        `${totalTrees + 24} ${unit}`,
        `${totalTrees - 24} ${unit}`,
        `${totalTrees + 48} ${unit}`
      ];
      return {
        title: isEn ? 'TREE PLANTING' : 'ΔΕΝΔΡΟΦΥΤΕΥΣΗ ΣΤΟ ΑΛΣΟΣ',
        instruction: isEn ? 'Select total number of saplings:' : 'Επιλέξτε το συνολικό πλήθος δέντρων:',
        text: isEn
          ? `An environmental team planted ${rows} rows with ${treesPerRow} saplings in each row. How many saplings were planted in total?`
          : `Μια περιβαλλοντική ομάδα φύτεψε ${rows} σειρές με ${treesPerRow} δενδρύλλια σε κάθε σειρά. Πόσα δενδρύλλια φυτεύτηκαν συνολικά;`,
        tableData: {
          col1: isEn ? 'Rows' : 'Σειρές',
          col2: isEn ? 'Trees per Row' : 'Δέντρα ανά Σειρά',
          r1: [`${rows} ${isEn ? 'rows' : 'σειρές'}`, `${treesPerRow} ${unit}`],
          r2: [isEn ? 'Product' : 'Γινόμενο', `${rows} · ${treesPerRow} ＝ ${totalTrees}`]
        },
        optionsRaw: makeUniqueOptions(correctStr, wrongCandidates),
        correctText: correctStr,
        explanation: isEn
          ? `Multiply: ${rows} · ${treesPerRow} ＝ ${correctStr}.`
          : `Πολλαπλασιάζουμε: ${rows} · ${treesPerRow} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_mult_hard_6',
    generate: (locale) => {
      const isEn = locale === 'en';
      const perBox = 16;
      const boxes = randInt(12, 25);
      const totalMarkers = perBox * boxes;
      const unit = isEn ? 'markers' : 'μαρκαδόροι';
      const correctStr = `${totalMarkers} ${unit}`;
      const wrongCandidates = [
        `${totalMarkers + 16} ${unit}`,
        `${totalMarkers - 16} ${unit}`,
        `${totalMarkers + 32} ${unit}`
      ];
      return {
        title: isEn ? 'PACKING MARKERS' : 'ΠΑΚΕΤΑΡΙΣΜΑ ΜΑΡΚΑΔΟΡΩΝ',
        instruction: isEn ? 'Select total number of markers:' : 'Επιλέξτε το συνολικό πλήθος μαρκαδόρων:',
        text: isEn
          ? `A stationery workshop packed ${boxes} pencil cases with ${perBox} markers each. How many markers were packed in total?`
          : `Μια βιοτεχνία ειδών γραφής συσκεύασε ${boxes} κασετίνες με ${perBox} μαρκαδόρους η καθεμία. Πόσοι μαρκαδόροι συσκευάστηκαν συνολικά;`,
        tableData: {
          col1: isEn ? 'Pencil Cases' : 'Κασετίνες',
          col2: isEn ? 'Markers per Case' : 'Μαρκαδόροι ανά Κασετίνα',
          r1: [`${boxes} ${isEn ? 'cases' : 'κασετίνες'}`, `${perBox} ${unit}`],
          r2: [isEn ? 'Multiple' : 'Πολλαπλάσιο', `${boxes} · ${perBox} ＝ ${totalMarkers}`]
        },
        optionsRaw: makeUniqueOptions(correctStr, wrongCandidates),
        correctText: correctStr,
        explanation: isEn
          ? `Calculate: ${boxes} · ${perBox} ＝ ${correctStr}.`
          : `Υπολογίζουμε: ${boxes} · ${perBox} ＝ ${correctStr}.`
      };
    }
  }
];

function generateQuestions(locale = 'el') {
  const isEn = locale === 'en';
  const qList = [];

  // Q1 (MCQ): Έλεγχος αν ένας αριθμός είναι πολλαπλάσιο άλλου (4 μοναδικές επιλογές)
  {
    const q1Base = [4, 6, 7, 8, 9, 12, 15][randInt(0, 6)];
    const q1IsMult = Math.random() > 0.5;
    const q1Multiplier = randInt(4, 12);
    const q1Num = q1IsMult ? q1Base * q1Multiplier : q1Base * q1Multiplier + randInt(1, q1Base - 1);
    const quotient = Math.floor(q1Num / q1Base);
    const remainder = q1Num % q1Base;

    let correctText = '';
    let wrongCandidates = [];

    if (q1IsMult) {
      correctText = isEn
        ? `Yes, because ${q1Base} · ${quotient} ＝ ${q1Num}`
        : `Ναι, γιατί ${q1Base} · ${quotient} ＝ ${q1Num}`;
      wrongCandidates = [
        isEn ? `No, because it leaves remainder 1` : `Όχι, γιατί αφήνει υπόλοιπο 1`,
        isEn ? `No, because ${q1Num} is prime` : `Όχι, γιατί το ${q1Num} είναι πρώτος αριθμός`,
        isEn ? `Yes, because ${q1Base} · ${quotient + 1} ＝ ${q1Num}` : `Ναι, γιατί ${q1Base} · ${quotient + 1} ＝ ${q1Num}`
      ];
    } else {
      correctText = isEn
        ? `No, because division leaves remainder ${remainder}`
        : `Όχι, γιατί η διαίρεση αφήνει υπόλοιπο ${remainder}`;
      wrongCandidates = [
        isEn ? `Yes, because ${q1Base} · ${quotient} ＝ ${q1Num}` : `Ναι, γιατί ${q1Base} · ${quotient} ＝ ${q1Num}`,
        isEn ? `Yes, because it divides evenly` : `Ναι, γιατί διαιρείται ακριβώς`,
        isEn ? `No, because division leaves remainder ${remainder + 1}` : `Όχι, γιατί η διαίρεση αφήνει υπόλοιπο ${remainder + 1}`
      ];
    }

    const optionsRaw = makeUniqueOptions(correctText, wrongCandidates);
    const options = optionsRaw.map((text) => ({
      text,
      isCorrect: text === correctText
    }));

    qList.push({
      id: 1,
      type: 'mcq',
      title: isEn ? 'QUESTION 1 • MULTIPLE CHECK' : 'ΕΡΩΤΗΣΗ 1 • ΕΛΕΓΧΟΣ ΠΟΛΛΑΠΛΑΣΙΟΥ',
      instruction: isEn ? 'Select whether the number is a multiple:' : 'Επιλέξτε αν ο αριθμός είναι πολλαπλάσιο:',
      prompt: isEn ? `Is the number ${q1Num} a multiple of ${q1Base}?` : `Είναι ο αριθμός ${q1Num} πολλαπλάσιο του ${q1Base};`,
      options,
      correctText,
      explanation: q1IsMult
        ? (isEn
            ? `Correct! ${q1Num} : ${q1Base} ＝ ${quotient}, therefore ${q1Num} is a multiple of ${q1Base}.`
            : `Σωστά! ${q1Num} : ${q1Base} ＝ ${quotient}, επομένως το ${q1Num} είναι πολλαπλάσιο του ${q1Base}.`)
        : (isEn
            ? `${q1Num} does not divide evenly by ${q1Base} (${q1Num} : ${q1Base} ＝ ${quotient} remainder ${remainder}), so it is NOT a multiple.`
            : `Το ${q1Num} δεν διαιρείται ακριβώς με το ${q1Base} (${q1Num} : ${q1Base} ＝ ${quotient} με υπόλοιπο ${remainder}), άρα ΔΕΝ είναι πολλαπλάσιο.`)
    });
  }

  // Q2 (Input): Εύρεση επόμενου πολλαπλασίου
  {
    const q2Base = [6, 7, 8, 9, 12, 15, 25][randInt(0, 6)];
    const q2K = randInt(3, 8);
    const q2Given = q2Base * q2K;
    const q2Next = q2Base * (q2K + 1);

    qList.push({
      id: 2,
      type: 'integer_input',
      title: isEn ? 'QUESTION 2 • NEXT MULTIPLE' : 'ΕΡΩΤΗΣΗ 2 • ΕΠΟΜΕΝΟ ΠΟΛΛΑΠΛΑΣΙΟ',
      instruction: isEn ? 'Enter the immediate next multiple (integer):' : 'Συμπληρώστε το αμέσως επόμενο πολλαπλάσιο (ακέραιος):',
      prompt: isEn ? `What is the immediate next multiple of ${q2Base} after ${q2Given}?` : `Ποιο είναι το αμέσως επόμενο πολλαπλάσιο του ${q2Base} μετά το ${q2Given};`,
      correctVal: q2Next,
      correctStr: String(q2Next),
      explanation: isEn
        ? `We add ${q2Base} to ${q2Given}: ${q2Given} ＋ ${q2Base} ＝ ${q2Next} (${q2Base} · ${q2K + 1}).`
        : `Προσθέτουμε το ${q2Base} στο ${q2Given}: ${q2Given} ＋ ${q2Base} ＝ ${q2Next} (${q2Base} · ${q2K + 1}).`
    });
  }

  // Q3 (MCQ): Επιλογή πολλαπλασίου ανάμεσα σε μη πολλαπλάσια
  {
    const q3Base = [6, 7, 8, 9, 12, 15][randInt(0, 5)];
    const q3Valid = q3Base * randInt(5, 14);
    const q3Invalid1 = q3Valid + 2;
    const q3Invalid2 = q3Valid - 3;
    const q3Invalid3 = q3Valid + (q3Base === 6 ? 1 : 4);

    const rawCandidates = [
      String(q3Invalid1),
      String(q3Invalid2),
      String(q3Invalid3),
      String(q3Valid + 5)
    ];
    const rawOptions = makeUniqueOptions(String(q3Valid), rawCandidates);
    const options = rawOptions.map((text) => ({
      text,
      isCorrect: text === String(q3Valid)
    }));

    qList.push({
      id: 3,
      type: 'mcq',
      title: isEn ? 'QUESTION 3 • IDENTIFYING A MULTIPLE' : 'ΕΡΩΤΗΣΗ 3 • ΑΝΑΓΝΩΡΙΣΗ ΠΟΛΛΑΠΛΑΣΙΟΥ',
      instruction: isEn ? 'Select which number is a multiple:' : 'Επιλέξτε ποιος αριθμός είναι πολλαπλάσιο:',
      prompt: isEn ? `Which of the following numbers is a multiple of ${q3Base}?` : `Ποιος από τους παρακάτω αριθμούς είναι πολλαπλάσιο του ${q3Base};`,
      options,
      correctText: String(q3Valid),
      explanation: isEn
        ? `The number ${q3Valid} divides evenly by ${q3Base} (${q3Base} · ${q3Valid / q3Base} ＝ ${q3Valid}).`
        : `Ο αριθμός ${q3Valid} διαιρείται ακριβώς με το ${q3Base} (${q3Base} · ${q3Valid / q3Base} ＝ ${q3Valid}).`
    });
  }

  // Q4 (MCQ): Εύρεση κοινού πολλαπλασίου
  {
    const q4Pair = [
      { a: 3, b: 4, correct: 24, wrong: [15, 16, 20] },
      { a: 4, b: 6, correct: 36, wrong: [16, 20, 30] },
      { a: 5, b: 6, correct: 60, wrong: [25, 40, 50] },
      { a: 6, b: 8, correct: 48, wrong: [30, 40, 54] },
      { a: 4, b: 10, correct: 40, wrong: [25, 30, 50] }
    ][randInt(0, 4)];

    const rawOptions = makeUniqueOptions(String(q4Pair.correct), q4Pair.wrong.map(String));
    const options = rawOptions.map((text) => ({
      text,
      isCorrect: text === String(q4Pair.correct)
    }));

    qList.push({
      id: 4,
      type: 'mcq',
      title: isEn ? 'QUESTION 4 • COMMON MULTIPLE' : 'ΕΡΩΤΗΣΗ 4 • ΚΟΙΝΟ ΠΟΛΛΑΠΛΑΣΙΟ',
      instruction: isEn ? 'Select the common multiple of the two numbers:' : 'Επιλέξτε το κοινό πολλαπλάσιο των δύο αριθμών:',
      prompt: isEn
        ? `Which of the following numbers is a common multiple of ${q4Pair.a} and ${q4Pair.b}?`
        : `Ποιος από τους παρακάτω αριθμούς είναι κοινό πολλαπλάσιο του ${q4Pair.a} και του ${q4Pair.b};`,
      options,
      correctText: String(q4Pair.correct),
      explanation: isEn
        ? `${q4Pair.correct} divides evenly by both ${q4Pair.a} (${q4Pair.correct} : ${q4Pair.a} ＝ ${q4Pair.correct / q4Pair.a}) and ${q4Pair.b} (${q4Pair.correct} : ${q4Pair.b} ＝ ${q4Pair.correct / q4Pair.b}).`
        : `Το ${q4Pair.correct} διαιρείται ακριβώς και με το ${q4Pair.a} (${q4Pair.correct} : ${q4Pair.a} ＝ ${q4Pair.correct / q4Pair.a}) και με το ${q4Pair.b} (${q4Pair.correct} : ${q4Pair.b} ＝ ${q4Pair.correct / q4Pair.b}).`
    });
  }

  // Q5 (MCQ): True / False - Ιδιότητα του 0
  {
    const q5IsTrue = Math.random() > 0.5;
    const q5Text = isEn
      ? (q5IsTrue
          ? '0 is a multiple of every natural number.'
          : '0 is not a multiple of any number.')
      : (q5IsTrue
          ? 'Το 0 είναι πολλαπλάσιο κάθε φυσικού αριθμού.'
          : 'Το 0 δεν είναι πολλαπλάσιο κανενός αριθμού.');
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
      title: isEn ? 'QUESTION 5 • PROPERTY OF ZERO' : 'ΕΡΩΤΗΣΗ 5 • ΙΔΙΟΤΗΤΑ ΤΟΥ 0',
      instruction: isEn ? 'Classify statement as True or False:' : 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q5Text}»`,
      options,
      correctText: correctAns,
      explanation: isEn
        ? (q5IsTrue
            ? 'Correct! For every number a, a · 0 ＝ 0, so 0 is a multiple of all numbers.'
            : 'False! 0 is a multiple of every number because a · 0 ＝ 0.')
        : (q5IsTrue
            ? 'Σωστό! Για κάθε αριθμό α ισχύει α · 0 ＝ 0, άρα το 0 είναι πολλαπλάσιο όλων των αριθμών.'
            : 'Λάθος! Το 0 είναι πολλαπλάσιο κάθε αριθμού αφού α · 0 ＝ 0.')
    });
  }

  // Q6 (MCQ): True / False - Πλήθος πολλαπλασίων
  {
    const q6IsTrue = Math.random() > 0.5;
    const q6Text = isEn
      ? (q6IsTrue
          ? 'Every whole number (except 0) has infinitely many multiples.'
          : 'Every whole number has at most 100 multiples.')
      : (q6IsTrue
          ? 'Κάθε φυσικός αριθμός (εκτός από το 0) έχει άπειρα πολλαπλάσια.'
          : 'Κάθε φυσικός αριθμός έχει το πολύ 100 πολλαπλάσια.');
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
      title: isEn ? 'QUESTION 6 • NUMBER OF MULTIPLES' : 'ΕΡΩΤΗΣΗ 6 • ΠΛΗΘΟΣ ΠΟΛΛΑΠΛΑΣΙΩΝ',
      instruction: isEn ? 'Classify statement as True or False:' : 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q6Text}»`,
      options,
      correctText: correctAns,
      explanation: isEn
        ? (q6IsTrue
            ? 'Correct! Because natural numbers are infinite, the multiples of a number never end.'
            : 'False! Multiples of any whole number (except 0) are infinite.')
        : (q6IsTrue
            ? 'Σωστό! Επειδή οι φυσικοί αριθμοί είναι άπειροι, τα πολλαπλάσια ενός αριθμού δεν τελειώνουν ποτέ.'
            : 'Λάθος! Τα πολλαπλάσια κάθε φυσικού αριθμού (εκτός του 0) είναι άπειρα.')
    });
  }

  // Q7 (Input): Υπολογισμός πολλαπλασίου
  {
    const q7Base = [12, 15, 20, 25, 30, 50][randInt(0, 5)];
    const q7MultIndex = randInt(4, 9);
    const q7Ans = q7Base * q7MultIndex;

    qList.push({
      id: 7,
      type: 'integer_input',
      title: isEn ? 'QUESTION 7 • COMPUTING MULTIPLE' : 'ΕΡΩΤΗΣΗ 7 • ΥΠΟΛΟΓΙΣΜΟΣ ΠΟΛΛΑΠΛΑΣΙΟΥ',
      instruction: isEn ? 'Calculate the product (integer):' : 'Υπολογίστε το γινόμενο (ακέραιος):',
      prompt: isEn
        ? `What is the ${q7MultIndex}th multiple of ${q7Base} (${q7Base} · ${q7MultIndex})?`
        : `Ποιο είναι το ${q7MultIndex}ο πολλαπλάσιο του αριθμού ${q7Base} (${q7Base} · ${q7MultIndex});`,
      correctVal: q7Ans,
      correctStr: String(q7Ans),
      explanation: `${q7Base} · ${q7MultIndex} ＝ ${q7Ans}.`
    });
  }

  // Q8 (MCQ): Πρόβλημα Καθημερινότητας (4 μοναδικές επιλογές)
  {
    const q8Items = isEn
      ? [
          {
            shop: 'A bookstore',
            name: 'notebooks',
            box: 6,
            count: 48,
            correct: 'Yes (exactly 8 packs)',
            wrong: ['No, 2 are left over', 'No, 3 are missing', 'Yes (exactly 9 packs)']
          },
          {
            shop: 'A stationery store',
            name: 'pens',
            box: 8,
            count: 56,
            correct: 'Yes (exactly 7 cases)',
            wrong: ['No, 1 is left over', 'No, 2 are missing', 'Yes (exactly 8 cases)']
          },
          {
            shop: 'A paper shop',
            name: 'bookmarks',
            box: 12,
            count: 72,
            correct: 'Yes (exactly 6 sets)',
            wrong: ['No, 4 are left over', 'No, 2 are missing', 'Yes (exactly 7 sets)']
          },
          {
            shop: 'A confectionery',
            name: 'chocolates',
            box: 15,
            count: 90,
            correct: 'Yes (exactly 6 boxes)',
            wrong: ['No, 5 are left over', 'No, 5 are missing', 'Yes (exactly 7 boxes)']
          }
        ]
      : [
          { 
            shop: 'Ένα βιβλιοπωλείο', 
            name: 'τετράδια', 
            pronounTo: 'τα', 
            pronounNone: 'κανένα', 
            box: 6, 
            count: 48, 
            correct: 'Ναι (ακριβώς 8 πακέτα)', 
            wrong: ['Όχι, περισσεύουν 2', 'Όχι, λείπουν 3', 'Ναι (ακριβώς 9 πακέτα)'] 
          },
          { 
            shop: 'Ένα κατάστημα γραφικής ύλης', 
            name: 'στυλό', 
            pronounTo: 'τα', 
            pronounNone: 'κανένα', 
            box: 8, 
            count: 56, 
            correct: 'Ναι (ακριβώς 7 θήκες)', 
            wrong: ['Όχι, περισσεύει 1', 'Όχι, λείπουν 2', 'Ναι (ακριβώς 8 θήκες)'] 
          },
          { 
            shop: 'Ένα χαρτοπωλείο', 
            name: 'σελιδοδείκτες', 
            pronounTo: 'τους', 
            pronounNone: 'κανέναν', 
            box: 12, 
            count: 72, 
            correct: 'Ναι (ακριβώς 6 σετ)', 
            wrong: ['Όχι, περισσεύουν 4', 'Όχι, λείπουν 2', 'Ναι (ακριβώς 7 σετ)'] 
          },
          { 
            shop: 'Ένα ζαχαροπλαστείο', 
            name: 'σοκολάτες', 
            pronounTo: 'τις', 
            pronounNone: 'καμία', 
            box: 15, 
            count: 90, 
            correct: 'Ναι (ακριβώς 6 κουτιά)', 
            wrong: ['Όχι, περισσεύουν 5', 'Όχι, λείπουν 5', 'Ναι (ακριβώς 7 κουτιά)'] 
          }
        ];
    const q8Chosen = q8Items[randInt(0, q8Items.length - 1)];
    const rawOptions = makeUniqueOptions(q8Chosen.correct, q8Chosen.wrong);
    const options = rawOptions.map((text) => ({
      text,
      isCorrect: text === q8Chosen.correct
    }));

    const promptText = isEn
      ? `${q8Chosen.shop} has ${q8Chosen.count} ${q8Chosen.name} and wants to pack them into packages of ${q8Chosen.box} items each. Can they be completely packed without any remaining?`
      : `${q8Chosen.shop} έχει ${q8Chosen.count} ${q8Chosen.name} και θέλει να ${q8Chosen.pronounTo} τοποθετήσει σε συσκευασίες των ${q8Chosen.box} τεμαχίων. Μπορούν να συσκευαστούν πλήρως χωρίς να περισσέψει ${q8Chosen.pronounNone};`;

    qList.push({
      id: 8,
      type: 'mcq',
      title: isEn ? 'QUESTION 8 • EVERYDAY PROBLEM' : 'ΕΡΩΤΗΣΗ 8 • ΠΡΟΒΛΗΜΑ ΚΑΘΗΜΕΡΙΝΟΤΗΤΑΣ',
      instruction: isEn ? 'Select the correct answer regarding packaging:' : 'Επιλέξτε τη σωστή απάντηση για τη συσκευασία:',
      prompt: promptText,
      options,
      correctText: q8Chosen.correct,
      explanation: isEn
        ? `Since ${q8Chosen.count} : ${q8Chosen.box} ＝ ${q8Chosen.count / q8Chosen.box}, they fit exactly into ${q8Chosen.count / q8Chosen.box} packages with zero remainder.`
        : `Επειδή ${q8Chosen.count} : ${q8Chosen.box} ＝ ${q8Chosen.count / q8Chosen.box}, χωρούν ακριβώς σε ${q8Chosen.count / q8Chosen.box} συσκευασίες χωρίς περίσσευμα.`
    });
  }

  // Q9 & Q10: Προβλήματα από τις δεξαμενές
  {
    const shuffledStd = shuffle([...STANDARD_PROBLEMS_POOL]);
    const shuffledHard = shuffle([...HARD_PROBLEMS_POOL]);
    const stdProb = shuffledStd[0].generate(locale);
    const hardProb = shuffledHard[0].generate(locale);

    const optionsQ9 = makeUniqueOptions(stdProb.correctText, stdProb.optionsRaw).map((text) => ({
      text,
      isCorrect: text === stdProb.correctText
    }));

    qList.push({
      id: 9,
      type: 'mcq',
      title: `${isEn ? 'QUESTION 9 • ' : 'ΕΡΩΤΗΣΗ 9 • '}${stdProb.title}`,
      instruction: stdProb.instruction,
      prompt: stdProb.text,
      tableData: stdProb.tableData,
      options: optionsQ9,
      correctText: stdProb.correctText,
      explanation: stdProb.explanation
    });

    const optionsQ10 = makeUniqueOptions(hardProb.correctText, hardProb.optionsRaw).map((text) => ({
      text,
      isCorrect: text === hardProb.correctText
    }));

    qList.push({
      id: 10,
      type: 'mcq',
      title: `${isEn ? 'QUESTION 10 • ' : 'ΕΡΩΤΗΣΗ 10 • '}${hardProb.title}`,
      instruction: hardProb.instruction,
      prompt: hardProb.text,
      tableData: hardProb.tableData,
      options: optionsQ10,
      correctText: hardProb.correctText,
      explanation: hardProb.explanation
    });
  }

  return qList;
}

const UI_STRINGS = {
  el: {
    pageTitle: "Ασκήσεις: Πολλαπλάσια Αριθμού - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "10 απαιτητικές διαδραστικές ασκήσεις και προβλήματα στα πολλαπλάσια φυσικών αριθμών για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryBtn: "📖 Θεωρία",
    badgeChapter: "ΚΕΦΑΛΑΙΟ 18 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    heroTitle: "Ασκήσεις & Προβλήματα: Πολλαπλάσια Αριθμού",
    heroDesc: "10 δυναμικές δραστηριότητες υπολογισμού πολλαπλασίων, κοινών πολλαπλασίων, ιδιοτήτων και ρεαλιστικά προβλήματα καθημερινής ζωής.",
    heroDynamicNote: "⚡ Κάθε σετ δημιουργείται δυναμικά με τυχαίες παραμέτρους.",
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
    pageTitle: "Exercises: Multiples of a Number - Grade 6 | LearnMaths.gr",
    pageDesc: "10 interactive math problems exploring multiples, common multiples, and properties for Grade 6.",
    backText: "Grade 6",
    theoryBtn: "📖 Theory",
    badgeChapter: "CHAPTER 18 • GRADE 6 • PRACTICE",
    heroTitle: "Exercises & Problems: Multiples of a Number",
    heroDesc: "10 dynamic activities calculating multiples, finding common multiples, properties of zero, and everyday word problems.",
    heroDynamicNote: "⚡ Each exercise set is dynamically generated with random parameters.",
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

export default function PollaplasiaExercisesPage() {
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

  const handleInputChange = (qId, rawValue) => {
    if (isSubmitted) return;
    let sanitized = rawValue.replace(/[^0-9]/g, '');
    if (sanitized.length > 10) {
      sanitized = sanitized.slice(0, 10);
    }
    setAnswers((prev) => ({
      ...prev,
      [`q_${qId}`]: sanitized
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
    if (q.type === 'integer_input') {
      const userValStr = (answers[`q_${q.id}`] || '').trim();
      const userVal = parseInt(userValStr, 10);
      return !isNaN(userVal) && userVal === q.correctVal;
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
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/18-pollaplasia"
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
              <span>{t.badgeChapter}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight break-words [overflow-wrap:anywhere]">
              {t.heroTitle}
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl break-words [overflow-wrap:anywhere]">
              {t.heroDesc}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs sm:text-sm 2xl:text-base text-sky-200">
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
          {questions.map((q) => {
            const isCorrect = isSubmitted && isQuestionCorrect(q);

            return (
              <article
                key={`q-${q.id}`}
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
                  <span className="text-xs 2xl:text-sm font-black tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg break-words">
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
                  <p className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-900 leading-relaxed break-words [overflow-wrap:anywhere]">
                    {q.prompt}
                  </p>
                </div>

                {/* Περιοχή Απάντησης */}
                <div className="py-2">
                  {q.type === 'integer_input' && (
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
                        onChange={(e) => handleInputChange(q.id, e.target.value)}
                        className="w-36 sm:w-44 text-center font-mono font-bold text-base sm:text-lg text-slate-900 bg-white border border-slate-300 rounded-2xl py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed shadow-inner"
                      />
                      <span className="text-xs 2xl:text-sm text-slate-500 font-medium">
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
                      <div className="w-full min-w-0 max-w-full bg-white/90 border border-slate-200 rounded-2xl p-3 shadow-inner my-1 font-mono text-xs sm:text-sm overflow-x-auto block">
                        <div className="grid grid-cols-2 gap-2 sm:gap-4 font-bold border-b pb-1.5 text-slate-600 text-center">
                          <span className="bg-blue-100/70 px-2 py-0.5 rounded-lg text-blue-900 break-words [overflow-wrap:anywhere]">{q.tableData.col1}</span>
                          <span className="bg-emerald-100/70 px-2 py-0.5 rounded-lg text-emerald-900 break-words [overflow-wrap:anywhere]">{q.tableData.col2}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 sm:gap-4 pt-2 text-center font-bold text-slate-800">
                          <span className="break-words [overflow-wrap:anywhere]">{q.tableData.r1[0]}</span>
                          <span className="text-indigo-700 font-bold break-words [overflow-wrap:anywhere]">{q.tableData.r1[1]}</span>
                          <span className="break-words [overflow-wrap:anywhere]">{q.tableData.r2[0]}</span>
                          <span className="text-amber-600 font-black break-words [overflow-wrap:anywhere]">{q.tableData.r2[1]}</span>
                        </div>
                      </div>
                    )}

                    <div className="break-words [overflow-wrap:anywhere]">{q.explanation}</div>
                    
                    {!isCorrect && (
                      <div className="font-semibold pt-1 text-slate-800">
                        {t.correctAnswerLabel}{' '}
                        <span className="font-mono font-bold text-blue-900 break-words">
                          {formatNumber(q.correctStr || q.correctText, locale)}
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