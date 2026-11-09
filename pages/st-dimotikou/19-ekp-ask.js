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

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

function lcmTwo(a, b) {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

function lcmArray(arr) {
  return arr.reduce((acc, curr) => lcmTwo(acc, curr), arr[0]);
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
    id: 'p_ekp_std_1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const busA = 12;
      const busB = 18;
      const l = lcmTwo(busA, busB);
      const unit = isEn ? 'minutes' : 'λεπτά';
      const correctStr = `${l} ${unit}`;
      const abbr = isEn ? 'LCM' : 'Ε.Κ.Π.';
      const wrongCandidates = [
        `${busA + busB} ${unit}`,
        `${l * 2} ${unit}`,
        `${Math.floor(l / 2)} ${unit}`,
        `${l + 6} ${unit}`
      ];

      return {
        title: isEn ? 'BUS DEPARTURE SYNCHRONIZATION' : 'ΣΥΓΧΡΟΝΙΣΜΟΣ ΔΡΟΜΟΛΟΓΙΩΝ ΛΕΩΦΟΡΕΙΩΝ',
        instruction: isEn ? 'Select the correct synchronized departure time:' : 'Επιλέξτε τον σωστό χρόνο ταυτόχρονης αναχώρησης:',
        text: isEn
          ? `At a transit station, Bus A departs every ${busA} minutes and Bus B departs every ${busB} minutes. If both depart simultaneously at 08:00 AM, after how many minutes will they depart together again for the first time?`
          : `Σε έναν σταθμό, το λεωφορείο Α αναχωρεί κάθε ${busA} λεπτά και το λεωφορείο Β αναχωρεί κάθε ${busB} λεπτά. Αν ξεκινήσουν ταυτόχρονα στις 08:00 το πρωί, μετά από πόσα λεπτά θα αναχωρήσουν ξανά ταυτόχρονα για πρώτη φορά;`,
        tableData: {
          col1: isEn ? 'Bus Schedules' : 'Δρομολόγια',
          col2: isEn ? 'Departure Times' : 'Χρόνος Αναχώρησης',
          r1: [isEn ? `Bus A: ${busA} min.` : `Λεωφορείο Α: ${busA} λ.`, isEn ? `Bus B: ${busB} min.` : `Λεωφορείο Β: ${busB} λ.`],
          r2: [isEn ? 'Calculate LCM' : 'Υπολογισμός Ε.Κ.Π.', `${abbr}(${busA}, ${busB}) ＝ ${l} ${unit} ✅`]
        },
        optionsRaw: makeUniqueOptions(correctStr, wrongCandidates),
        correctText: correctStr,
        explanation: isEn
          ? `The buses will depart simultaneously at the Least Common Multiple of their schedules: LCM(${busA}, ${busB}) ＝ ${correctStr}.`
          : `Τα λεωφορεία θα συναντηθούν στο Ελάχιστο Κοινό Πολλαπλάσιο των χρόνων τους: Ε.Κ.Π.(${busA}, ${busB}) ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_ekp_std_2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const light1 = 15;
      const light2 = 20;
      const l = lcmTwo(light1, light2);
      const unit = isEn ? 'seconds' : 'δευτερόλεπτα';
      const correctStr = `${l} ${unit}`;
      const abbr = isEn ? 'LCM' : 'Ε.Κ.Π.';
      const wrongCandidates = [
        `${light1 + light2} ${unit}`,
        `${l * 2} ${unit}`,
        `${Math.floor(l / 2)} ${unit}`,
        `${l + 10} ${unit}`
      ];

      return {
        title: isEn ? 'FLASHING NEON SIGNS' : 'ΡΥΘΜΙΚΕΣ ΦΩΤΕΙΝΕΣ ΠΙΝΑΚΙΔΕΣ',
        instruction: isEn ? 'Select how often they flash simultaneously:' : 'Επιλέξτε κάθε πόσα δευτερόλεπτα ανάβουν ταυτόχρονα:',
        text: isEn
          ? `Two street neon signs flash periodically: the first flashes every ${light1} seconds and the second every ${light2} seconds. Every how many seconds will they flash simultaneously?`
          : `Σε έναν δρόμο δύο φωτεινές πινακίδες αναβοσβήνουν ρυθμικά: η πρώτη ανάβει κάθε ${light1} δευτερόλεπτα και η δεύτερη κάθε ${light2} δευτερόλεπτα. Κάθε πόσα δευτερόλεπτα θα ανάβουν ταυτόχρονα;`,
        tableData: {
          col1: isEn ? 'Signs' : 'Πινακίδες',
          col2: isEn ? 'Frequency' : 'Συχνότητα',
          r1: [isEn ? `Sign 1: ${light1} s` : `Πινακίδα 1: ${light1} δευτ.`, isEn ? `Sign 2: ${light2} s` : `Πινακίδα 2: ${light2} δευτ.`],
          r2: [isEn ? 'Calculate LCM' : 'Υπολογισμός Ε.Κ.Π.', `${abbr}(${light1}, ${light2}) ＝ ${l} ${unit} ✅`]
        },
        optionsRaw: makeUniqueOptions(correctStr, wrongCandidates),
        correctText: correctStr,
        explanation: isEn
          ? `The signs flash simultaneously at the LCM of their periods: LCM(${light1}, ${light2}) ＝ ${correctStr}.`
          : `Οι πινακίδες ανάβουν ταυτόχρονα σε χρόνο ίσο με το Ε.Κ.Π. των δύο περιόδων: Ε.Κ.Π.(${light1}, ${light2}) ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_ekp_std_3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const doctorDays = 6;
      const nurseDays = 9;
      const l = lcmTwo(doctorDays, nurseDays);
      const unit = isEn ? 'days' : 'ημέρες';
      const correctStr = `${l} ${unit}`;
      const abbr = isEn ? 'LCM' : 'Ε.Κ.Π.';
      const wrongCandidates = [
        `${doctorDays + nurseDays} ${unit}`,
        `${l + 6} ${unit}`,
        `${l * 2} ${unit}`,
        `${Math.floor(l / 2)} ${unit}`
      ];

      return {
        title: isEn ? 'HOSPITAL ON-CALL DUTY' : 'ΚΟΙΝΗ ΕΦΗΜΕΡΙΑ ΣΤΟ ΝΟΣΟΚΟΜΕΙΟ',
        instruction: isEn ? 'Select after how many days their shifts will coincide:' : 'Επιλέξτε μετά από πόσες ημέρες θα συμπέσει η εφημερία:',
        text: isEn
          ? `A doctor is on duty every ${doctorDays} days and a nurse is on duty every ${nurseDays} days. If they are on duty together today, after how many days will their shifts coincide again?`
          : `Ένας γιατρός έχει εφημερία κάθε ${doctorDays} ημέρες και μια νοσηλεύτρια έχει εφημερία κάθε ${nurseDays} ημέρες. Αν εφημερεύουν μαζί σήμερα, μετά από πόσες ημέρες θα συμπέσει ξανά η εφημερία τους;`,
        tableData: {
          col1: isEn ? 'Duty Shifts' : 'Εφημερίες',
          col2: isEn ? 'Frequency' : 'Συχνότητα',
          r1: [isEn ? `Doctor: ${doctorDays} days` : `Γιατρός: ${doctorDays} ημέρες`, isEn ? `Nurse: ${nurseDays} days` : `Νοσηλεύτρια: ${nurseDays} ημέρες`],
          r2: [isEn ? 'Calculate LCM' : 'Υπολογισμός Ε.Κ.Π.', `${abbr}(${doctorDays}, ${nurseDays}) ＝ ${l} ${unit} ✅`]
        },
        optionsRaw: makeUniqueOptions(correctStr, wrongCandidates),
        correctText: correctStr,
        explanation: isEn
          ? `Their shifts coincide again at the LCM of their cycles: LCM(${doctorDays}, ${nurseDays}) ＝ ${correctStr}.`
          : `Η κοινή εφημερία θα συμβεί ξανά σε ημέρες που ισούνται με το Ε.Κ.Π. των δύο διαστημάτων: Ε.Κ.Π.(${doctorDays}, ${nurseDays}) ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_ekp_std_4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const bellA = 45;
      const bellB = 60;
      const l = lcmTwo(bellA, bellB);
      const unit = isEn ? 'minutes' : 'λεπτά';
      const correctStr = `${l} ${unit}`;
      const abbr = isEn ? 'LCM' : 'Ε.Κ.Π.';
      const wrongCandidates = [
        `${bellA + bellB} ${unit}`,
        `${l * 2} ${unit}`,
        `${Math.floor(l / 2)} ${unit}`,
        `${l - 30} ${unit}`
      ];

      return {
        title: isEn ? 'SCHOOL BELLS SYNCHRONIZATION' : 'ΣΥΓΧΡΟΝΙΣΜΟΣ ΚΟΥΔΟΥΝΙΩΝ ΣΧΟΛΕΙΟΥ',
        instruction: isEn ? 'Select after how many minutes they will ring together:' : 'Επιλέξτε μετά από πόσα λεπτά θα χτυπήσουν μαζί:',
        text: isEn
          ? `In two neighboring schools, bells ring every ${bellA} minutes and ${bellB} minutes respectively. If both rang at the same time in the morning, after how many minutes will they ring together again?`
          : `Σε δύο γειτονικά σχολεία τα κουδούνια χτυπούν ανά ${bellA} λεπτά και ${bellB} λεπτά αντίστοιχα. Αν χτύπησαν ταυτόχρονα το πρωί, μετά από πόσα λεπτά θα ξαναχτυπήσουν μαζί;`,
        tableData: {
          col1: isEn ? 'School Bells' : 'Κουδούνια',
          col2: isEn ? 'Period' : 'Περίοδος',
          r1: [isEn ? `School A: ${bellA} min.` : `Σχολείο Α: ${bellA} λ.`, isEn ? `School B: ${bellB} min.` : `Σχολείο Β: ${bellB} λ.`],
          r2: [abbr, `${abbr}(${bellA}, ${bellB}) ＝ ${l} ${isEn ? 'min.' : 'λ.'} ✅`]
        },
        optionsRaw: makeUniqueOptions(correctStr, wrongCandidates),
        correctText: correctStr,
        explanation: isEn
          ? `The school bells ring together again at LCM(${bellA}, ${bellB}) ＝ ${correctStr}.`
          : `Τα κουδούνια χτυπούν ξανά ταυτόχρονα στο Ε.Κ.Π.(${bellA}, ${bellB}) ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_ekp_std_5',
    generate: (locale) => {
      const isEn = locale === 'en';
      const cycle1 = 8;
      const cycle2 = 12;
      const l = lcmTwo(cycle1, cycle2);
      const unit = isEn ? 'minutes' : 'λεπτά';
      const correctStr = `${l} ${unit}`;
      const abbr = isEn ? 'LCM' : 'Ε.Κ.Π.';
      const wrongCandidates = [
        `${cycle1 + cycle2} ${unit}`,
        `${l * 2} ${unit}`,
        `${l + 4} ${unit}`,
        `${Math.floor(l / 2)} ${unit}`
      ];

      return {
        title: isEn ? 'RACE TRACK LAPS' : 'ΓΥΡΟΙ ΣΤΗΝ ΠΙΣΤΑ ΑΓΩΝΩΝ',
        instruction: isEn ? 'Select after how long they will meet at the start line:' : 'Επιλέξτε μετά από πόσο χρόνο θα συναντηθούν στην αφετηρία:',
        text: isEn
          ? `Two go-karts race around a track. The first completes a lap in ${cycle1} minutes and the second in ${cycle2} minutes. If they start together, after how many minutes will they pass the starting line together again?`
          : `Δύο καρτ κινούνται σε κυκλική πίστα. Το πρώτο ολοκληρώνει έναν γύρο σε ${cycle1} λεπτά και το δεύτερο σε ${cycle2} λεπτά. Αν ξεκινήσουν μαζί, μετά από πόσα λεπτά θα περάσουν ξανά ταυτόχρονα από την αφετηρία;`,
        tableData: {
          col1: isEn ? 'Karts' : 'Καρτ',
          col2: isEn ? 'Lap Time' : 'Χρόνος Γύρου',
          r1: [isEn ? `1st Kart: ${cycle1} min.` : `1ο Καρτ: ${cycle1} λ.`, isEn ? `2nd Kart: ${cycle2} min.` : `2ο Καρτ: ${cycle2} λ.`],
          r2: [abbr, `${abbr}(${cycle1}, ${cycle2}) ＝ ${l} ${isEn ? 'min.' : 'λ.'} ✅`]
        },
        optionsRaw: makeUniqueOptions(correctStr, wrongCandidates),
        correctText: correctStr,
        explanation: isEn
          ? `They meet at the starting line again at LCM(${cycle1}, ${cycle2}) ＝ ${correctStr}.`
          : `Θα συναντηθούν ξανά στην αφετηρία σε χρόνο ίσο με το Ε.Κ.Π.(${cycle1}, ${cycle2}) ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_ekp_std_6',
    generate: (locale) => {
      const isEn = locale === 'en';
      const waterA = 4;
      const waterB = 6;
      const l = lcmTwo(waterA, waterB);
      const unit = isEn ? 'days' : 'ημέρες';
      const correctStr = `${l} ${unit}`;
      const abbr = isEn ? 'LCM' : 'Ε.Κ.Π.';
      const wrongCandidates = [
        `${waterA + waterB} ${unit}`,
        `${l * 2} ${unit}`,
        `${l + 2} ${unit}`,
        `${Math.floor(l / 2)} ${unit}`
      ];

      return {
        title: isEn ? 'WATERING PLANTS' : 'ΠΟΤΙΣΜΑ ΦΥΤΩΝ',
        instruction: isEn ? 'Select how often both plants are watered on the same day:' : 'Επιλέξτε κάθε πόσες ημέρες ποτίζονται ταυτόχρονα:',
        text: isEn
          ? `In a garden, roses are watered every ${waterA} days and hydrangeas every ${waterB} days. Every how many days are both plants watered on the exact same day?`
          : `Σε έναν κήπο τα τριαντάφυλλα ποτίζονται κάθε ${waterA} ημέρες και οι ορτανσίες κάθε ${waterB} ημέρες. Κάθε πόσες ημέρες ποτίζονται και τα δύο φυτά την ίδια ημέρα;`,
        tableData: {
          col1: isEn ? 'Plants' : 'Φυτά',
          col2: isEn ? 'Frequency' : 'Συχνότητα',
          r1: [isEn ? `Roses: ${waterA} days` : `Τριαντάφυλλα: ${waterA} ημέρες`, isEn ? `Hydrangeas: ${waterB} days` : `Ορτανσίες: ${waterB} ημέρες`],
          r2: [abbr, `${abbr}(${waterA}, ${waterB}) ＝ ${l} ${unit} ✅`]
        },
        optionsRaw: makeUniqueOptions(correctStr, wrongCandidates),
        correctText: correctStr,
        explanation: isEn
          ? `They are watered simultaneously every LCM(${waterA}, ${waterB}) ＝ ${correctStr}.`
          : `Ποτίζονται ταυτόχρονα σε διάστημα ίσο με το Ε.Κ.Π.(${waterA}, ${waterB}) ＝ ${correctStr}.`
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'p_ekp_hard_1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const shipA = 6;
      const shipB = 8;
      const shipC = 12;
      const l = lcmArray([shipA, shipB, shipC]);
      const unit = isEn ? 'days' : 'ημέρες';
      const correctStr = `${l} ${unit}`;
      const abbr = isEn ? 'LCM' : 'Ε.Κ.Π.';
      const wrongCandidates = [
        `${l * 2} ${unit}`,
        `${shipA + shipB + shipC} ${unit}`,
        `${Math.floor(l / 2)} ${unit}`,
        `${l + 6} ${unit}`
      ];

      return {
        title: isEn ? 'MEETING OF THREE SHIPS AT PORT' : 'ΣΥΝΑΝΤΗΣΗ ΤΡΙΩΝ ΠΛΟΙΩΝ ΣΤΟ ΛΙΜΑΝΙ',
        instruction: isEn ? 'Select after how many days all three ships will coincide:' : 'Επιλέξτε μετά από πόσες ημέρες θα συμπέσουν και τα τρία πλοία:',
        text: isEn
          ? `Three ships return to the same port: the first every ${shipA} days, the second every ${shipB} days, and the third every ${shipC} days. If all departed together today, after how many days will all three dock simultaneously again?`
          : `Τρία πλοία επιστρέφουν στο ίδιο λιμάνι: το πρώτο κάθε ${shipA} ημέρες, το δεύτερο κάθε ${shipB} ημέρες και το τρίτο κάθε ${shipC} ημέρες. Αν αναχώρησαν σήμερα μαζί, μετά από πόσες ημέρες θα ξαναβρεθούν ταυτόχρονα στο λιμάνι;`,
        tableData: {
          col1: isEn ? 'Ships' : 'Πλοία',
          col2: isEn ? 'Return Cycle' : 'Διάστημα Επιστροφής',
          r1: [isEn ? `A: ${shipA} d., B: ${shipB} d.` : `A: ${shipA} ημ., B: ${shipB} ημ.`, isEn ? `C: ${shipC} d.` : `Γ: ${shipC} ημ.`],
          r2: [isEn ? 'Calculate LCM' : 'Υπολογισμός Ε.Κ.Π.', `${abbr}(${shipA}, ${shipB}, ${shipC}) ＝ ${l} ${unit} ✅`]
        },
        optionsRaw: makeUniqueOptions(correctStr, wrongCandidates),
        correctText: correctStr,
        explanation: isEn
          ? `Compute the LCM of the three numbers: LCM(${shipA}, ${shipB}, ${shipC}) ＝ ${correctStr}.`
          : `Υπολογίζουμε το Ε.Κ.Π. των τριών αριθμών: Ε.Κ.Π.(${shipA}, ${shipB}, ${shipC}) ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_ekp_hard_2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const runnerA = 3;
      const runnerB = 4;
      const runnerC = 5;
      const l = lcmArray([runnerA, runnerB, runnerC]);
      const unit = isEn ? 'minutes' : 'λεπτά';
      const correctStr = `${l} ${unit}`;
      const abbr = isEn ? 'LCM' : 'Ε.Κ.Π.';
      const wrongCandidates = [
        `${l * 2} ${unit}`,
        `${runnerA + runnerB + runnerC} ${unit}`,
        `${Math.floor(l / 2)} ${unit}`,
        `${l - 15} ${unit}`
      ];

      return {
        title: isEn ? 'MEETING OF THREE RUNNERS' : 'ΣΥΝΑΝΤΗΣΗ ΤΡΙΩΝ ΔΡΟΜΕΩΝ ΣΤΗΝ ΑΦΕΤΗΡΙΑ',
        instruction: isEn ? 'Select after how many minutes they will meet at the start:' : 'Επιλέξτε μετά από πόσα λεπτά θα συναντηθούν ξανά στην αφετηρία:',
        text: isEn
          ? `Three runners run on a circular track and finish a lap in ${runnerA}, ${runnerB}, and ${runnerC} minutes respectively. If they start at the same time, after how many minutes will all three meet at the start line again?`
          : `Τρεις δρομείς τρέχουν σε κυκλικό στίβο και κάνουν έναν γύρο σε ${runnerA}, ${runnerB} και ${runnerC} λεπτά αντίστοιχα. Αν ξεκινήσουν ταυτόχρονα, μετά από πόσα λεπτά θα ξαναβρεθούν όλοι μαζί στην αφετηρία;`,
        tableData: {
          col1: isEn ? 'Runners' : 'Δρομείς',
          col2: isEn ? 'Lap Times' : 'Χρόνοι Γύρου',
          r1: [isEn ? `${runnerA} min., ${runnerB} min.` : `${runnerA} λ., ${runnerB} λ.`, isEn ? `${runnerC} min.` : `${runnerC} λ.`],
          r2: [abbr, `${abbr}(${runnerA}, ${runnerB}, ${runnerC}) ＝ ${l} ${unit} ✅`]
        },
        optionsRaw: makeUniqueOptions(correctStr, wrongCandidates),
        correctText: correctStr,
        explanation: isEn
          ? `Because the numbers are pairwise coprime: LCM(${runnerA}, ${runnerB}, ${runnerC}) ＝ ${runnerA} · ${runnerB} · ${runnerC} ＝ ${correctStr}.`
          : `Επειδή οι αριθμοί είναι πρώτοι μεταξύ τους ανά ζεύγη: Ε.Κ.Π.(${runnerA}, ${runnerB}, ${runnerC}) ＝ ${runnerA} · ${runnerB} · ${runnerC} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_ekp_hard_3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const packSpoons = 10;
      const packForks = 12;
      const l = lcmTwo(packSpoons, packForks);
      const unit = isEn ? 'pieces' : 'τεμάχια';
      const correctStr = `${l} ${unit}`;
      const abbr = isEn ? 'LCM' : 'Ε.Κ.Π.';
      const wrongCandidates = [
        `${packSpoons * packForks} ${unit}`,
        `${l * 2} ${unit}`,
        `${Math.floor(l / 2)} ${unit}`,
        `${packSpoons + packForks} ${unit}`
      ];

      return {
        title: isEn ? 'PURCHASING CUTLERY PACKS' : 'ΑΓΟΡΑ ΣΕΤ ΜΑΧΑΙΡΟΠΙΡΟΥΝΩΝ',
        instruction: isEn ? 'Select the minimum equal number of spoons and forks:' : 'Επιλέξτε τον ελάχιστο ίσο αριθμό κουταλιών και πιρουνιών:',
        text: isEn
          ? `A store sells spoons in packs of ${packSpoons} and forks in packs of ${packForks}. What is the minimum equal number of spoons and forks we must purchase to have an equal count of each?`
          : `Ένα κατάστημα πουλάει κουτάλια σε πακέτα των ${packSpoons} και πιρούνια σε πακέτα των ${packForks}. Ποιο είναι το ελάχιστο πλήθος που πρέπει να αγοράσουμε από το καθένα ώστε να έχουμε ίσο αριθμό κουταλιών και πιρουνιών;`,
        tableData: {
          col1: isEn ? 'Packs' : 'Συσκευασίες',
          col2: abbr,
          r1: [isEn ? `Spoons: ${packSpoons}` : `Κουτάλια: ${packSpoons}`, isEn ? `Forks: ${packForks}` : `Πιρούνια: ${packForks}`],
          r2: [isEn ? 'Minimum Equal Quantity' : 'Ελάχιστη Ίση Ποσότητα', `${correctStr} ✅`]
        },
        optionsRaw: makeUniqueOptions(correctStr, wrongCandidates),
        correctText: correctStr,
        explanation: isEn
          ? `We calculate the LCM of the package sizes: LCM(${packSpoons}, ${packForks}) ＝ ${correctStr}.`
          : `Αναζητούμε το Ε.Κ.Π. των συσκευασιών: Ε.Κ.Π.(${packSpoons}, ${packForks}) ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_ekp_hard_4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const trainA = 20;
      const trainB = 30;
      const l = lcmTwo(trainA, trainB);
      const unit = isEn ? 'minutes' : 'λεπτά';
      const correctStr = `${l} ${unit}`;
      const abbr = isEn ? 'LCM' : 'Ε.Κ.Π.';
      const wrongCandidates = [
        `${trainA + trainB} ${unit}`,
        `${l * 2} ${unit}`,
        `${Math.floor(l / 2)} ${unit}`,
        `${l + 15} ${unit}`
      ];

      return {
        title: isEn ? 'TRAIN TIMETABLES' : 'ΔΡΟΜΟΛΟΓΙΑ ΤΡΕΝΩΝ',
        instruction: isEn ? 'Select after how many minutes they will depart together again:' : 'Επιλέξτε μετά από πόσο χρόνο θα αναχωρήσουν ξανά ταυτόχρονα:',
        text: isEn
          ? `Two trains depart from the central station every ${trainA} minutes and ${trainB} minutes respectively. If both departed together at 09:00 AM, after how many minutes will they depart together again?`
          : `Δύο τρένα αναχωρούν από τον κεντρικό σταθμό ανά ${trainA} λεπτά και ${trainB} λεπτά αντίστοιχα. Αν αναχώρησαν μαζί στις 09:00, μετά από πόσα λεπτά θα αναχωρήσουν πάλι μαζί;`,
        tableData: {
          col1: isEn ? 'Trains' : 'Τρένα',
          col2: isEn ? 'Frequency' : 'Συχνότητα',
          r1: [isEn ? `Train 1: ${trainA} min.` : `Τρένο 1: ${trainA} λ.`, isEn ? `Train 2: ${trainB} min.` : `Τρένο 2: ${trainB} λ.`],
          r2: [abbr, `${abbr}(${trainA}, ${trainB}) ＝ ${l} ${unit} ✅`]
        },
        optionsRaw: makeUniqueOptions(correctStr, wrongCandidates),
        correctText: correctStr,
        explanation: isEn
          ? `Calculate: LCM(${trainA}, ${trainB}) ＝ ${correctStr}.`
          : `Υπολογίζουμε: Ε.Κ.Π.(${trainA}, ${trainB}) ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_ekp_hard_5',
    generate: (locale) => {
      const isEn = locale === 'en';
      const alarmA = 12;
      const alarmB = 16;
      const l = lcmTwo(alarmA, alarmB);
      const unit = isEn ? 'seconds' : 'δευτερόλεπτα';
      const correctStr = `${l} ${unit}`;
      const abbr = isEn ? 'LCM' : 'Ε.Κ.Π.';
      const wrongCandidates = [
        `${alarmA + alarmB} ${unit}`,
        `${l * 2} ${unit}`,
        `${Math.floor(l / 2)} ${unit}`,
        `${l + 12} ${unit}`
      ];

      return {
        title: isEn ? 'AUDIBLE ALARM SIGNALS' : 'ΗΧΗΤΙΚΑ ΣΗΜΑΤΑ ΣΥΝΑΓΕΡΜΟΥ',
        instruction: isEn ? 'Select how often both alarms sound simultaneously:' : 'Επιλέξτε κάθε πόσα δευτερόλεπτα ηχούν ταυτόχρονα:',
        text: isEn
          ? `Two alarm systems sound audio beeps every ${alarmA} seconds and ${alarmB} seconds respectively. Every how many seconds do both sound at the exact same moment?`
          : `Δύο συσκευές συναγερμού εκπέμπουν ηχητικό σήμα ανά ${alarmA} δευτερόλεπτα και ${alarmB} δευτερόλεπτα αντίστοιχα. Κάθε πόσα δευτερόλεπτα ηχούν ταυτόχρονα;`,
        tableData: {
          col1: isEn ? 'Alarms' : 'Συσκευές',
          col2: isEn ? 'Period' : 'Περίοδος',
          r1: [isEn ? `Alarm 1: ${alarmA} s` : `Συσκευή 1: ${alarmA} δευτ.`, isEn ? `Alarm 2: ${alarmB} s` : `Συσκευή 2: ${alarmB} δευτ.`],
          r2: [abbr, `${abbr}(${alarmA}, ${alarmB}) ＝ ${l} ${unit} ✅`]
        },
        optionsRaw: makeUniqueOptions(correctStr, wrongCandidates),
        correctText: correctStr,
        explanation: isEn
          ? `Calculate: LCM(${alarmA}, ${alarmB}) ＝ ${correctStr}.`
          : `Υπολογίζουμε: Ε.Κ.Π.(${alarmA}, ${alarmB}) ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_ekp_hard_6',
    generate: (locale) => {
      const isEn = locale === 'en';
      const lessonA = 4;
      const lessonB = 5;
      const l = lcmTwo(lessonA, lessonB);
      const unit = isEn ? 'days' : 'ημέρες';
      const correctStr = `${l} ${unit}`;
      const wrongCandidates = [
        `${lessonA + lessonB} ${unit}`,
        `${l * 2} ${unit}`,
        `${Math.floor(l / 2)} ${unit}`,
        `${l + 5} ${unit}`
      ];

      return {
        title: isEn ? 'EXTRACURRICULAR SCHEDULE OVERLAP' : 'ΣΥΜΠΤΩΣΗ ΕΞΩΣΧΟΛΙΚΩΝ ΔΡΑΣΤΗΡΙΟΤΗΤΩΝ',
        instruction: isEn ? 'Select after how many days both lessons coincide again:' : 'Επιλέξτε μετά από πόσες ημέρες συμπίπτουν ξανά:',
        text: isEn
          ? `John has guitar lessons every ${lessonA} days and chess lessons every ${lessonB} days. If he had both lessons today, after how many days will he have both again on the same day?`
          : `Ο Γιάννης έχει μάθημα κιθάρας κάθε ${lessonA} ημέρες και μάθημα σκακιού κάθε ${lessonB} ημέρες. Αν σήμερα είχε και τα δύο μαθήματα, μετά από πόσες ημέρες θα έχει ξανά και τα δύο την ίδια ημέρα;`,
        tableData: {
          col1: isEn ? 'Lessons' : 'Μαθήματα',
          col2: isEn ? 'Frequency' : 'Συχνότητα',
          r1: [isEn ? `Guitar: ${lessonA} days` : `Κιθάρα: ${lessonA} ημέρες`, isEn ? `Chess: ${lessonB} days` : `Σκάκι: ${lessonB} ημέρες`],
          r2: [isEn ? 'LCM' : 'Ε.Κ.Π.', `${isEn ? 'LCM' : 'Ε.Κ.Π.'}(${lessonA}, ${lessonB}) ＝ ${l} ${unit} ✅`]
        },
        optionsRaw: makeUniqueOptions(correctStr, wrongCandidates),
        correctText: correctStr,
        explanation: isEn
          ? `Because 4 and 5 are coprime: LCM(4, 5) ＝ 4 · 5 ＝ ${correctStr}.`
          : `Επειδή το 4 και το 5 είναι πρώτοι μεταξύ τους: Ε.Κ.Π.(4, 5) ＝ 4 · 5 ＝ ${correctStr}.`
      };
    }
  }
];

function generateQuestions(locale = 'el') {
  const isEn = locale === 'en';
  const qList = [];
  const abbr = isEn ? 'LCM' : 'Ε.Κ.Π.';

  // Q1 (MCQ): Ε.Κ.Π. δύο απλών αριθμών
  {
    const q1Pairs = [
      [4, 6], [6, 8], [3, 5], [6, 9], [8, 12], [5, 10], [4, 10], [9, 12]
    ];
    const q1Chosen = q1Pairs[randInt(0, q1Pairs.length - 1)];
    const q1CorrectVal = lcmArray(q1Chosen);
    const q1Correct = String(q1CorrectVal);

    const candidateWrongs = [
      String(q1CorrectVal * 2),
      String(q1Chosen[0] * q1Chosen[1]),
      String(Math.max(...q1Chosen)),
      String(q1CorrectVal + Math.min(...q1Chosen)),
      String(Math.abs(q1CorrectVal - Math.min(...q1Chosen)) || 6)
    ];

    const rawOptions = makeUniqueOptions(q1Correct, candidateWrongs);
    const options = rawOptions.map((text) => ({
      text,
      isCorrect: text === q1Correct
    }));

    qList.push({
      id: 1,
      type: 'mcq',
      title: isEn ? 'QUESTION 1 • LCM OF TWO NUMBERS' : 'ΕΡΩΤΗΣΗ 1 • Ε.Κ.Π. ΔΥΟ ΑΡΙΘΜΩΝ',
      instruction: isEn ? 'Select the Least Common Multiple:' : 'Επιλέξτε το Ελάχιστο Κοινό Πολλαπλάσιο:',
      prompt: isEn
        ? `What is the LCM of numbers ${q1Chosen[0]} and ${q1Chosen[1]}?`
        : `Ποιο είναι το Ε.Κ.Π. των αριθμών ${q1Chosen[0]} και ${q1Chosen[1]};`,
      options,
      correctText: q1Correct,
      explanation: isEn
        ? `M(${q1Chosen[0]}): ${q1Chosen[0]}, ${q1Chosen[0] * 2}, ${q1Chosen[0] * 3}... and M(${q1Chosen[1]}): ${q1Chosen[1]}, ${q1Chosen[1] * 2}... The smallest positive common multiple is ${q1Correct}.`
        : `Π(${q1Chosen[0]}): ${q1Chosen[0]}, ${q1Chosen[0] * 2}, ${q1Chosen[0] * 3}... και Π(${q1Chosen[1]}): ${q1Chosen[1]}, ${q1Chosen[1] * 2}... Το μικρότερο κοινό θετικό πολλαπλάσιο είναι το ${q1Correct}.`
    });
  }

  // Q2 (Input): Ε.Κ.Π. δύο πρώτων μεταξύ τους αριθμών
  {
    const q2Pairs = [
      [3, 4], [5, 7], [4, 9], [7, 8], [5, 9], [3, 8], [5, 6]
    ];
    const q2Chosen = q2Pairs[randInt(0, q2Pairs.length - 1)];
    const q2CorrectVal = q2Chosen[0] * q2Chosen[1];

    qList.push({
      id: 2,
      type: 'integer_input',
      title: isEn ? 'QUESTION 2 • COPRIME NUMBERS' : 'ΕΡΩΤΗΣΗ 2 • ΠΡΩΤΟΙ ΜΕΤΑΞΥ ΤΟΥΣ',
      instruction: isEn ? 'Enter the LCM of the numbers (integer):' : 'Συμπληρώστε το Ε.Κ.Π. των αριθμών (ακέραιος):',
      prompt: isEn
        ? `What is the LCM of numbers ${q2Chosen[0]} and ${q2Chosen[1]}?`
        : `Ποιο είναι το Ε.Κ.Π. των αριθμών ${q2Chosen[0]} και ${q2Chosen[1]};`,
      correctVal: q2CorrectVal,
      correctStr: String(q2CorrectVal),
      explanation: isEn
        ? `Since ${q2Chosen[0]} and ${q2Chosen[1]} have no common divisor other than 1 (they are coprime), their LCM equals their product: ${q2Chosen[0]} · ${q2Chosen[1]} ＝ ${q2CorrectVal}.`
        : `Επειδή οι αριθμοί ${q2Chosen[0]} και ${q2Chosen[1]} δεν έχουν κοινό διαιρέτη εκτός του 1 (είναι πρώτοι μεταξύ τους), το Ε.Κ.Π. τους ισούται με το γινόμενό τους: ${q2Chosen[0]} · ${q2Chosen[1]} ＝ ${q2CorrectVal}.`
    });
  }

  // Q3 (MCQ): Ε.Κ.Π. τριών αριθμών
  {
    const q3Triplets = [
      { nums: [2, 3, 4], val: 12 },
      { nums: [3, 4, 6], val: 12 },
      { nums: [4, 6, 8], val: 24 },
      { nums: [6, 8, 12], val: 24 },
      { nums: [4, 5, 10], val: 20 },
      { nums: [3, 5, 15], val: 15 },
      { nums: [6, 10, 15], val: 30 }
    ];
    const q3Chosen = q3Triplets[randInt(0, q3Triplets.length - 1)];
    const q3CorrectStr = String(q3Chosen.val);

    const rawCandidates = [
      String(q3Chosen.val * 2),
      String(q3Chosen.nums[0] * q3Chosen.nums[1] * q3Chosen.nums[2]),
      String(q3Chosen.val + 6),
      String(Math.floor(q3Chosen.val / 2) || 8)
    ];
    const rawOptions = makeUniqueOptions(q3CorrectStr, rawCandidates);
    const options = rawOptions.map((text) => ({
      text,
      isCorrect: text === q3CorrectStr
    }));

    qList.push({
      id: 3,
      type: 'mcq',
      title: isEn ? 'QUESTION 3 • LCM OF THREE NUMBERS' : 'ΕΡΩΤΗΣΗ 3 • Ε.Κ.Π. ΤΡΙΩΝ ΑΡΙΘΜΩΝ',
      instruction: isEn ? 'Select the correct LCM:' : 'Επιλέξτε το σωστό Ε.Κ.Π.:',
      prompt: isEn
        ? `What is the LCM of numbers (${q3Chosen.nums.join(', ')})?`
        : `Ποιο είναι το Ε.Κ.Π. των αριθμών (${q3Chosen.nums.join(', ')});`,
      options,
      correctText: q3CorrectStr,
      explanation: isEn
        ? `The number ${q3CorrectStr} is the smallest positive integer dividing evenly by ${q3Chosen.nums[0]}, ${q3Chosen.nums[1]}, and ${q3Chosen.nums[2]}.`
        : `Ο αριθμός ${q3CorrectStr} είναι ο μικρότερος θετικός αριθμός που διαιρείται ακριβώς με το ${q3Chosen.nums[0]}, το ${q3Chosen.nums[1]} και το ${q3Chosen.nums[2]}.`
    });
  }

  // Q4 (MCQ): Εύρεση του 2ου κοινού πολλαπλασίου (2 · ΕΚΠ)
  {
    const q4Pairs = [
      { nums: [4, 6], ekp: 12, second: 24 },
      { nums: [6, 8], ekp: 24, second: 48 },
      { nums: [5, 6], ekp: 30, second: 60 },
      { nums: [8, 12], ekp: 24, second: 48 },
      { nums: [10, 15], ekp: 30, second: 60 }
    ];
    const q4Chosen = q4Pairs[randInt(0, q4Pairs.length - 1)];

    const rawCandidates = [
      String(q4Chosen.ekp),
      String(q4Chosen.ekp * 3),
      String(q4Chosen.second + 12),
      String(q4Chosen.second - 6)
    ];
    const rawOptions = makeUniqueOptions(String(q4Chosen.second), rawCandidates);
    const options = rawOptions.map((text) => ({
      text,
      isCorrect: text === String(q4Chosen.second)
    }));

    qList.push({
      id: 4,
      type: 'mcq',
      title: isEn ? 'QUESTION 4 • NEXT COMMON MULTIPLE' : 'ΕΡΩΤΗΣΗ 4 • ΕΠΟΜΕΝΟ ΚΟΙΝΟ ΠΟΛΛΑΠΛΑΣΙΟ',
      instruction: isEn ? 'Select the 2nd common multiple:' : 'Επιλέξτε το 2ο κοινό πολλαπλάσιο:',
      prompt: isEn
        ? `The LCM of numbers ${q4Chosen.nums[0]} and ${q4Chosen.nums[1]} is ${q4Chosen.ekp}. What is their immediate next (2nd) common multiple?`
        : `Το Ε.Κ.Π. των αριθμών ${q4Chosen.nums[0]} και ${q4Chosen.nums[1]} είναι το ${q4Chosen.ekp}. Ποιο είναι το αμέσως επόμενο (2ο) κοινό πολλαπλάσιό τους;`,
      options,
      correctText: String(q4Chosen.second),
      explanation: isEn
        ? `Common multiples are multiples of the LCM: 1st ＝ ${q4Chosen.ekp}, 2nd ＝ ${q4Chosen.ekp} · 2 ＝ ${q4Chosen.second}.`
        : `Τα κοινά πολλαπλάσια είναι τα πολλαπλάσια του Ε.Κ.Π.: 1ο ＝ ${q4Chosen.ekp}, 2ο ＝ ${q4Chosen.ekp} · 2 ＝ ${q4Chosen.second}.`
    });
  }

  // Q5 (MCQ): True / False - Περίπτωση όπου ένας αριθμός είναι πολλαπλάσιο του άλλου
  {
    const q5IsTrue = Math.random() > 0.5;
    const q5Text = isEn
      ? (q5IsTrue
          ? 'If one number divides evenly by another (e.g. 12 and 4), their LCM is the larger number (12).'
          : 'If one number divides evenly by another (e.g. 12 and 4), their LCM is always their product (48).')
      : (q5IsTrue
          ? 'Αν ένας αριθμός διαιρείται ακριβώς με έναν άλλον (π.χ. 12 και 4), τότε το Ε.Κ.Π. τους είναι ο μεγαλύτερος αριθμός (το 12).'
          : 'Αν ένας αριθμός διαιρείται ακριβώς με έναν άλλον (π.χ. 12 και 4), τότε το Ε.Κ.Π. τους είναι πάντα το γινόμενό τους (48).');
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
      title: isEn ? 'QUESTION 5 • DIVISIBILITY SPECIAL CASE' : 'ΕΡΩΤΗΣΗ 5 • ΕΙΔΙΚΗ ΠΕΡΙΠΤΩΣΗ ΔΙΑΙΡΕΤΟΤΗΤΑΣ',
      instruction: isEn ? 'Classify statement as True or False:' : 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q5Text}»`,
      options,
      correctText: correctAns,
      explanation: q5IsTrue
        ? (isEn
            ? 'Correct! When one number is a multiple of another, their LCM is always the greater number.'
            : 'Σωστό! Όταν ένας αριθμός είναι πολλαπλάσιο ενός άλλου, το Ε.Κ.Π. τους είναι πάντοτε ο μεγαλύτερος αριθμός.')
        : (isEn
            ? 'False! When one number divides by the other, the LCM is the greater number, not their product.'
            : 'Λάθος! Όταν ένας αριθμός διαιρείται από τον άλλον, το Ε.Κ.Π. είναι ο μεγαλύτερος αριθμός, όχι το γινόμενό τους.')
    });
  }

  // Q6 (MCQ): True / False - Σχέση ΕΚΠ με το 0
  {
    const q6IsTrue = Math.random() > 0.5;
    const q6Text = isEn
      ? (q6IsTrue
          ? 'The Least Common Multiple (LCM) is always a positive number (we never take 0 as the LCM).'
          : 'The LCM of any natural numbers is always 0, because 0 is a common multiple of all numbers.')
      : (q6IsTrue
          ? 'Το Ελάχιστο Κοινό Πολλαπλάσιο (Ε.Κ.Π.) είναι πάντα ένας θετικός αριθμός (δεν παίρνουμε ποτέ ως Ε.Κ.Π. το 0).'
          : 'Το Ε.Κ.Π. οποιωνδήποτε φυσικών αριθμών είναι πάντα το 0, επειδή το 0 είναι κοινό πολλαπλάσιο όλων.');
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
      title: isEn ? 'QUESTION 6 • ZERO AND THE LCM' : 'ΕΡΩΤΗΣΗ 6 • ΤΟ 0 ΚΑΙ ΤΟ Ε.Κ.Π.',
      instruction: isEn ? 'Classify statement as True or False:' : 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q6Text}»`,
      options,
      correctText: correctAns,
      explanation: q6IsTrue
        ? (isEn
            ? 'Correct! By definition, the LCM is the smallest non-zero positive common multiple.'
            : 'Σωστό! Εξ ορισμού το Ε.Κ.Π. είναι το μικρότερο κοινό θετικό πολλαπλάσιο (διάφορο του μηδενός).')
        : (isEn
            ? 'False! Zero is excluded from the definition of LCM, otherwise the LCM would always be 0.'
            : 'Λάθος! Το 0 εξαιρείται από τον ορισμό του Ε.Κ.Π., διαφορετικά το Ε.Κ.Π. κάθε ομάδας αριθμών θα ήταν πάντα 0.')
    });
  }

  // Q7 (Input): Ε.Κ.Π. τεσσάρων αριθμών
  {
    const q7Quads = [
      { nums: [2, 3, 4, 6], val: 12 },
      { nums: [2, 4, 6, 8], val: 24 },
      { nums: [3, 4, 6, 12], val: 12 },
      { nums: [2, 5, 10, 20], val: 20 },
      { nums: [3, 5, 6, 10], val: 30 }
    ];
    const q7Chosen = q7Quads[randInt(0, q7Quads.length - 1)];

    qList.push({
      id: 7,
      type: 'integer_input',
      title: isEn ? 'QUESTION 7 • LCM OF FOUR NUMBERS' : 'ΕΡΩΤΗΣΗ 7 • Ε.Κ.Π. ΤΕΣΣΑΡΩΝ ΑΡΙΘΜΩΝ',
      instruction: isEn ? 'Calculate the LCM (integer):' : 'Υπολογίστε το Ε.Κ.Π. (ακέραιος):',
      prompt: isEn
        ? `What is the LCM of the 4 numbers (${q7Chosen.nums.join(', ')})?`
        : `Ποιο είναι το Ε.Κ.Π. των 4 αριθμών (${q7Chosen.nums.join(', ')});`,
      correctVal: q7Chosen.val,
      correctStr: String(q7Chosen.val),
      explanation: `${abbr}(${q7Chosen.nums.join(', ')}) ＝ ${q7Chosen.val}.`
    });
  }

  // Q8 (MCQ): Πρόβλημα Καθημερινότητας
  {
    const q8Scenarios = isEn
      ? [
          {
            itemA: 'Ferry A departs every 6 hours',
            itemB: 'Ferry B departs every 8 hours',
            q: 'If both depart simultaneously, after how many hours will they depart together again?',
            val: 24,
            unit: 'hours',
            wrong: [14, 48, 16]
          },
          {
            itemA: 'One traffic signal turns green every 12 seconds',
            itemB: 'another signal turns green every 15 seconds',
            q: 'Every how many seconds will both turn green at the same time?',
            val: 60,
            unit: 'seconds',
            wrong: [27, 30, 180]
          },
          {
            itemA: 'Nick visits his grandmother every 4 days',
            itemB: 'Helen visits her every 6 days',
            q: 'If they met today, after how many days will they meet there together again?',
            val: 12,
            unit: 'days',
            wrong: [10, 24, 18]
          }
        ]
      : [
          {
            itemA: 'Το πλοίο Α αναχωρεί κάθε 6 ώρες',
            itemB: 'το πλοίο Β κάθε 8 ώρες',
            q: 'Αν αναχωρήσουν ταυτόχρονα, μετά από πόσες ώρες θα αναχωρήσουν ξανά μαζί;',
            val: 24,
            unit: 'ώρες',
            wrong: [14, 48, 16]
          },
          {
            itemA: 'Ένα φανάρι ανάβει πράσινο κάθε 12 δευτερόλεπτα',
            itemB: 'ένα άλλο κάθε 15 δευτερόλεπτα',
            q: 'Κάθε πόσα δευτερόλεπτα θα ανάβουν πράσινο ταυτόχρονα;',
            val: 60,
            unit: 'δευτερόλεπτα',
            wrong: [27, 30, 180]
          },
          {
            itemA: 'Ο Νίκος επισκέπτεται τη γιαγιά του κάθε 4 ημέρες',
            itemB: 'η Ελένη κάθε 6 ημέρες',
            q: 'Αν συναντήθηκαν σήμερα, μετά από πόσες ημέρες θα ξανασυναντηθούν;',
            val: 12,
            unit: 'ημέρες',
            wrong: [10, 24, 18]
          }
        ];
    const q8Chosen = q8Scenarios[randInt(0, q8Scenarios.length - 1)];
    const q8CorrectStr = `${q8Chosen.val} ${q8Chosen.unit}`;

    const rawCandidates = q8Chosen.wrong.map((w) => `${w} ${q8Chosen.unit}`);
    const rawOptions = makeUniqueOptions(q8CorrectStr, rawCandidates);
    const options = rawOptions.map((text) => ({
      text,
      isCorrect: text === q8CorrectStr
    }));

    qList.push({
      id: 8,
      type: 'mcq',
      title: isEn ? 'QUESTION 8 • EVERYDAY PROBLEM' : 'ΕΡΩΤΗΣΗ 8 • ΠΡΟΒΛΗΜΑ ΚΑΘΗΜΕΡΙΝΟΤΗΤΑΣ',
      instruction: isEn ? 'Select the correct meeting time:' : 'Επιλέξτε τη σωστή χρονική στιγμή συνάντησης:',
      prompt: `${q8Chosen.itemA} ${isEn ? 'and' : 'και'} ${q8Chosen.itemB}. ${q8Chosen.q}`,
      options,
      correctText: q8CorrectStr,
      explanation: isEn
        ? `We compute the LCM of the two intervals: LCM ＝ ${q8CorrectStr}.`
        : `Βρίσκουμε το Ε.Κ.Π. των δύο χρόνων: Ε.Κ.Π. ＝ ${q8CorrectStr}.`
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
    pageTitle: "Ασκήσεις: Ε.Κ.Π. - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "10 απαιτητικές διαδραστικές ασκήσεις και προβλήματα στο Ελάχιστο Κοινό Πολλαπλάσιο (Ε.Κ.Π.) για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryBtn: "📖 Θεωρία",
    badgeChapter: "ΚΕΦΑΛΑΙΟ 19 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    heroTitle: "Ασκήσεις & Προβλήματα: Ε.Κ.Π.",
    heroDesc: "10 δυναμικές δραστηριότητες υπολογισμού Ε.Κ.Π. για 2, 3 ή 4 αριθμούς, πρώτων μεταξύ τους αριθμών και ρεαλιστικά προβλήματα καθημερινής ζωής.",
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
    pageTitle: "Exercises: LCM - Grade 6 | LearnMaths.gr",
    pageDesc: "10 interactive math problems on the Least Common Multiple (LCM) for Grade 6.",
    backText: "Grade 6",
    theoryBtn: "📖 Theory",
    badgeChapter: "CHAPTER 19 • GRADE 6 • PRACTICE",
    heroTitle: "Exercises & Problems: LCM",
    heroDesc: "10 dynamic activities computing the LCM for 2, 3, or 4 numbers, coprime properties, and applied real-world word problems.",
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

export default function EkpExercisesPage() {
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
          href="/st-dimotikou/19-ekp"
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