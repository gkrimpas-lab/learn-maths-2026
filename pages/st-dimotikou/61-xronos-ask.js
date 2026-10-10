// pages/st-dimotikou/61-xronos-ask.js
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

// Μορφοποίηση αριθμών
function formatNum(num) {
  if (num === null || num === undefined || isNaN(Number(num))) return '0';
  if (Number.isInteger(Number(num))) return String(num);
  return String(num).replace('.', ',');
}

// ---------------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (Q9 & Q10) - "NO-GIVEAWAY" PEDAGOGY
// ---------------------------------------------------------

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'sp1',
    title: 'Διάρκεια Ταξιδιού με Πλοίο',
    generate: () => {
      const depH = 8;
      const depM = 45;
      const arrH = 14;
      const arrM = 20;
      const totalM = (arrH * 60 + arrM) - (depH * 60 + depM);
      const resH = Math.floor(totalM / 60);
      const resM = totalM % 60;
      const correctText = `${resH} ώρες και ${resM} λεπτά`;
      return {
        prompt: `Ένα πλοίο αναχωρεί από τον Πειραιά στις 0${depH}:${depM} και φτάνει στον προορισμό του στις ${arrH}:${arrM}. Πόση ώρα διήρκεσε το ταξίδι;`,
        correctText,
        tableData: [
          { item: 'Ώρα άφιξης', formula: `${arrH} h ${arrM} min`, val: `${arrH - 1} h ${arrM + 60} min (μετά τον δανεισμό)` },
          { item: 'Ώρα αναχώρησης', formula: `0${depH} h ${depM} min`, val: `0${depH} h ${depM} min` },
          { item: 'Διάρκεια ταξιδιού', formula: `(${arrH - 1} － ${depH}) h και (${arrM + 60} － ${depM}) min`, val: `${resH} h ${resM} min` }
        ],
        explain: `Δανειζόμαστε 1 ώρα (60 λεπτά) από τις ${arrH} ώρες: 14 h 20 min ＝ 13 h 80 min. Αφαιρούμε: (13 － 8) h ＝ ${resH} h και (80 － 45) min ＝ ${resM} min.`,
        distractors: [
          `${resH + 1} ώρες και ${resM} λεπτά`,
          `${resH} ώρες και ${resM - 10} λεπτά`,
          `${resH - 1} ώρες και ${resM + 15} λεπτά`
        ]
      };
    }
  },
  {
    id: 'sp2',
    title: 'Διάρκεια Κινηματογραφικής Ταινίας',
    generate: () => {
      const startH = 18;
      const startM = 30;
      const durM = 135;
      const durHours = Math.floor(durM / 60);
      const durRemM = durM % 60;
      const endTotalM = startH * 60 + startM + durM;
      const endH = Math.floor(endTotalM / 60);
      const endM = endTotalM % 60;
      const correctText = `${endH}:${endM}`;
      return {
        prompt: `Μια κινηματογραφική ταινία ξεκινά στις ${startH}:${startM} και έχει διάρκεια ${durM} λεπτά. Τι ώρα θα τελειώσει η προβολή;`,
        correctText,
        tableData: [
          { item: 'Διάρκεια σε ώρες & λεπτά', formula: `${durM} : 60`, val: `${durHours} h και ${durRemM} min` },
          { item: 'Ώρα έναρξης', formula: `${startH}:${startM}`, val: `${startH} h ${startM} min` },
          { item: 'Ώρα λήξης', formula: `(${startH} ＋ ${durHours}) h και (${startM} ＋ ${durRemM}) min`, val: `${endH}:${endM}` }
        ],
        explain: `Τα ${durM} λεπτά είναι ${durHours} ώρες και ${durRemM} λεπτά. Προσθέτουμε: ${startH} h 30 min ＋ ${durHours} h 15 min ＝ ${endH}:${endM}.`,
        distractors: [
          `${endH + 1}:${endM}`,
          `${endH}:${endM - 15}`,
          `${endH - 1}:${endM + 10}`
        ]
      };
    }
  },
  {
    id: 'sp3',
    title: 'Χρόνος Μελέτης Μαθητή',
    generate: () => {
      const m1 = 45;
      const m2 = 40;
      const m3 = 35;
      const total = m1 + m2 + m3;
      const hours = total / 60;
      const correctText = `${hours} ώρες`;
      return {
        prompt: `Ο Γιώργος διάβασε ${m1} λεπτά Μαθηματικά, ${m2} λεπτά Γλώσσα και ${m3} λεπτά Ιστορία. Πόσες ώρες διήρκεσε συνολικά η μελέτη του;`,
        correctText,
        tableData: [
          { item: 'Συνολικά λεπτά', formula: `${m1} ＋ ${m2} ＋ ${m3}`, val: `${total} λεπτά` },
          { item: 'Μετατροπή σε ώρες', formula: `${total} : 60`, val: `${hours} ώρες` }
        ],
        explain: `Αθροίζουμε τα λεπτά: ${m1} ＋ ${m2} ＋ ${m3} ＝ ${total} λεπτά. Μετατρέπουμε σε ώρες διαιρώντας με το 60: ${total} : 60 ＝ ${hours} ώρες.`,
        distractors: ['1,5 ώρα', '2,5 ώρες', '3 ώρες']
      };
    }
  },
  {
    id: 'sp4',
    title: 'Αθλητικός Αγώνας Δρόμου',
    generate: () => {
      const startH = 9;
      const startM = 15;
      const endH = 11;
      const endM = 5;
      const totalM = (endH * 60 + endM) - (startH * 60 + startM);
      const resH = Math.floor(totalM / 60);
      const resM = totalM % 60;
      const correctText = `${resH} ώρα και ${resM} λεπτά`;
      return {
        prompt: `Ένας δρομέας ξεκίνησε τον αγώνα στις 0${startH}:${startM} και τερμάτισε στις ${endH}:0${endM}. Πόση ώρα έτρεχε ο δρομέας;`,
        correctText,
        tableData: [
          { item: 'Ώρα τερματισμού', formula: `${endH}:0${endM}`, val: `${endH - 1} h ${endM + 60} min (με δανεισμό)` },
          { item: 'Ώρα εκκίνησης', formula: `0${startH}:${startM}`, val: `0${startH} h ${startM} min` },
          { item: 'Χρόνος διαδρομής', formula: `(${endH - 1} － ${startH}) h και (${endM + 60} － ${startM}) min`, val: `${resH} h ${resM} min` }
        ],
        explain: `Δανειζόμαστε 1 ώρα: 11 h 05 min ＝ 10 h 65 min. Αφαιρούμε: (10 － 9) h ＝ ${resH} ώρα και (65 － 15) min ＝ ${resM} λεπτά.`,
        distractors: [
          `2 ώρες και ${resM} λεπτά`,
          `${resH} ώρα και ${resM - 10} λεπτά`,
          `${resH + 1} ώρες και 10 λεπτά`
        ]
      };
    }
  },
  {
    id: 'sp5',
    title: 'Δρομολόγιο Αμαξοστοιχίας',
    generate: () => {
      const depH = 15;
      const depM = 50;
      const durH = 3;
      const durM = 25;
      const totalM = depH * 60 + depM + durH * 60 + durM;
      const arrH = Math.floor(totalM / 60);
      const arrM = totalM % 60;
      const correctText = `${arrH}:${arrM < 10 ? '0' + arrM : arrM}`;
      return {
        prompt: `Ένα τρένο αναχωρεί από τον σταθμό στις ${depH}:${depM} και το ταξίδι διαρκεί ${durH} ώρες και ${durM} λεπτά. Ποια είναι η ώρα άφιξης;`,
        correctText,
        tableData: [
          { item: 'Ώρα αναχώρησης', formula: `${depH}:${depM}`, val: `${depH} h ${depM} min` },
          { item: 'Διάρκεια ταξιδιού', formula: `${durH} h ${durM} min`, val: `${durH} h ${durM} min` },
          { item: 'Ώρα άφιξης', formula: `${depH + durH} h ＋ 75 min (60 min ＝ 1 h)`, val: `${arrH}:${arrM}` }
        ],
        explain: `Προσθέτουμε: ${depH} ＋ ${durH} ＝ 18 ώρες και ${depM} ＋ ${durM} ＝ 75 λεπτά. Τα 75 λεπτά είναι 1 ώρα και 15 λεπτά. Άρα 18 ＋ 1 ＝ ${arrH}:${arrM}.`,
        distractors: [
          `${arrH - 1}:15`,
          `${arrH}:25`,
          `${arrH + 1}:15`
        ]
      };
    }
  },
  {
    id: 'sp6',
    title: 'Χρονόμετρο Αγώνα Κολύμβησης',
    generate: () => {
      const totalS = 195;
      const m = Math.floor(totalS / 60);
      const s = totalS % 60;
      const correctText = `${m} λεπτά και ${s} δευτερόλεπτα`;
      return {
        prompt: `Ένας κολυμβητής ολοκλήρωσε την κούρσα των 200 μέτρων σε ${totalS} δευτερόλεπτα. Πόσα λεπτά και δευτερόλεπτα ήταν ο χρόνος του;`,
        correctText,
        tableData: [
          { item: 'Συνολικά δευτερόλεπτα', formula: `${totalS} s`, val: `${totalS}` },
          { item: 'Διαίρεση με το 60', formula: `${totalS} : 60`, val: `πηλίκο ${m}, υπόλοιπο ${s}` },
          { item: 'Τελική μορφή', formula: `${m} · 60 ＋ ${s}`, val: `${m} min και ${s} s` }
        ],
        explain: `Διαιρούμε ${totalS} : 60 ＝ ${m} με υπόλοιπο ${s}. Άρα ο χρόνος είναι ${m} λεπτά και ${s} δευτερόλεπτα.`,
        distractors: [
          `${m - 1} λεπτά και 45 δευτερόλεπτα`,
          `${m} λεπτά και ${s + 10} δευτερόλεπτα`,
          `4 λεπτά και 05 δευτερόλεπτα`
        ]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'hp1',
    title: 'Υπολογισμός Αιώνα και Χιλιετίας',
    generate: () => {
      const year = 1453;
      const cent = 15;
      const mill = 2;
      const correctText = `${cent}ος αιώνας (2η χιλιετία)`;
      return {
        prompt: `Σε ποιον αιώνα και σε ποια χιλιετία ανήκει το ιστορικό έτος ${year} (Άλωση της Κωνσταντινούπολης);`,
        correctText,
        tableData: [
          { item: 'Έτος', formula: `${year}`, val: `${year}` },
          { item: 'Κανόνας αιώνα', formula: '14 ＋ 1', val: `${cent}ος αιώνας (1401-1500)` },
          { item: 'Χιλιετία', formula: '1001 έως 2000', val: `${mill}η χιλιετία` }
        ],
        explain: `Το έτος ${year} ανήκει στην περίοδο 1401-1500, άρα είναι ο ${cent}ος αιώνας (14 ＋ 1 ＝ 15). Βρίσκεται επίσης μεταξύ των ετών 1001 και 2000, δηλαδή στη ${mill}η χιλιετία.`,
        distractors: [
          '14ος αιώνας (1η χιλιετία)',
          '16ος αιώνας (2η χιλιετία)',
          '15ος αιώνας (1η χιλιετία)'
        ]
      };
    }
  },
  {
    id: 'hp2',
    title: 'Υπολογισμός Ώρας Πτήσης με Ζώνες UTC',
    generate: () => {
      const depAthens = 10;
      const flightDur = 4;
      const depGmt = depAthens - 2;
      const arrGmt = depGmt + flightDur;
      const correctText = '12:00 (τοπική ώρα Λονδίνου)';
      return {
        prompt: `Ένα αεροπλάνο αναχωρεί από την Αθήνα (UTC+2) στις 10:00 το πρωί με προορισμό το Λονδίνο (UTC 0). Αν η διάρκεια της πτήσης είναι 4 ώρες, τι ώρα θα προσγειωθεί στο Λονδίνο σε τοπική ώρα;`,
        correctText,
        tableData: [
          { item: 'Ώρα αναχώρησης (Αθήνα)', formula: '10:00 (UTC+2)', val: '08:00 σε ώρα Greenwich (UTC 0)' },
          { item: 'Διάρκεια πτήσης', formula: '4 ώρες', val: '＋4 ώρες' },
          { item: 'Ώρα άφιξης (Λονδίνο)', formula: '08:00 ＋ 4 ώρες', val: '12:00' }
        ],
        explain: `Στην Αθήνα όταν είναι 10:00, στο Λονδίνο (Greenwich) είναι 2 ώρες πίσω, δηλαδή 08:00. Προσθέτουμε τη διάρκεια της πτήσης (4 ώρες): 08:00 ＋ 4 h ＝ 12:00 τοπική ώρα.`,
        distractors: [
          '14:00 (τοπική ώρα Λονδίνου)',
          '10:00 (τοπική ώρα Λονδίνου)',
          '13:00 (τοπική ώρα Λονδίνου)'
        ]
      };
    }
  },
  {
    id: 'hp3',
    title: 'Κλασματική Ώρα & Δευτερόλεπτα',
    generate: () => {
      const num = 3;
      const den = 4;
      const minVal = (num * 60) / den;
      const secVal = minVal * 60;
      const correctText = `${secVal} δευτερόλεπτα`;
      return {
        prompt: 'Πόσα δευτερόλεπτα είναι τα 3/4 μίας ώρας;',
        correctText,
        tableData: [
          { item: '1 ώρα σε δευτερόλεπτα', formula: '60 · 60', val: '3.600 s' },
          { item: 'Υπολογισμός κλάσματος', formula: '(3 · 3.600) : 4', val: `${secVal} s` },
          { item: 'Εναλλακτικά σε λεπτά', formula: '3/4 της ώρας ＝ 45 min', val: '45 · 60 ＝ 2.700 s' }
        ],
        explain: `Τα 3/4 της ώρας είναι 45 λεπτά (αφού 60 : 4 ＝ 15 και 15 · 3 ＝ 45). Μετατρέπουμε σε δευτερόλεπτα: 45 · 60 ＝ 2.700 δευτερόλεπτα.`,
        distractors: [
          '1.800 δευτερόλεπτα',
          '3.000 δευτερόλεπτα',
          '2.400 δευτερόλεπτα'
        ]
      };
    }
  },
  {
    id: 'hp4',
    title: 'Διαφορά Χρόνου σε Διεθνή Τηλεδιάσκεψη',
    generate: () => {
      const athensH = 16;
      const diff = 7;
      const nyH = athensH - diff;
      const correctText = '09:00 το πρωί';
      return {
        prompt: `Ένας επαγγελματίας στην Αθήνα (UTC+2) προγραμματίζει τηλεδιάσκεψη στις 16:00 το απόγευμα με συνεργάτη του στη Νέα Υόρκη (UTC-5). Τι ώρα θα είναι στη Νέα Υόρκη κατά την έναρξη της διάσκεψης;`,
        correctText,
        tableData: [
          { item: 'Ζώνη Αθήνας', formula: 'UTC+2', val: '2 ώρες μπροστά από Greenwich' },
          { item: 'Ζώνη Νέας Υόρκης', formula: 'UTC-5', val: '5 ώρες πίσω από Greenwich' },
          { item: 'Συνολική διαφορά', formula: '2 ＋ 5 ＝ 7 ώρες', val: 'Η Νέα Υόρκη είναι 7 ώρες πίσω από την Αθήνα' }
        ],
        explain: `Η διαφορά ώρας είναι 2 ＋ 5 ＝ 7 ώρες. Η Νέα Υόρκη είναι 7 ώρες πίσω από την Αθήνα: 16:00 － 7 ώρες ＝ 09:00 το πρωί.`,
        distractors: [
          '11:00 το πρωί',
          '23:00 το βράδυ',
          '14:00 το μεσημέρι'
        ]
      };
    }
  },
  {
    id: 'hp5',
    title: 'Αιώνας Έτους που Λήγει σε 00',
    generate: () => {
      const correctText = '19ος αιώνας';
      return {
        prompt: 'Σε ποιον αιώνα ανήκει το έτος 1900;',
        correctText,
        tableData: [
          { item: 'Έτος', formula: '1900', val: 'Λήγει σε 00' },
          { item: 'Κανόνας', formula: 'Δεν προσθέτουμε 1', val: '19ος αιώνας (έτη 1801 έως 1900)' }
        ],
        explain: 'Τα έτη που λήγουν σε 00 αποτελούν το τελευταίο έτος του αντίστοιχου αιώνα. Άρα το 1900 ήταν το τελευταίο έτος του 19ου αιώνα (ο 20ός ξεκίνησε το 1901).',
        distractors: [
          '20ός αιώνας',
          '18ος αιώνας',
          '21ος αιώνας'
        ]
      };
    }
  },
  {
    id: 'hp6',
    title: 'Σύνθετη Πρόσθεση Χρονικών Διαστημάτων',
    generate: () => {
      const h1 = 2;
      const m1 = 45;
      const h2 = 3;
      const m2 = 35;
      const sumH = h1 + h2;
      const sumM = m1 + m2;
      const finalH = sumH + Math.floor(sumM / 60);
      const finalM = sumM % 60;
      const correctText = `${finalH} ώρες και ${finalM} λεπτά`;
      return {
        prompt: `Υπολόγισε το άθροισμα των χρονικών διαστημάτων: (${h1} h ${m1} min) ＋ (${h2} h ${m2} min):`,
        correctText,
        tableData: [
          { item: 'Άθροισμα ωρών', formula: `${h1} ＋ ${h2}`, val: `${sumH} h` },
          { item: 'Άθροισμα λεπτών', formula: `${m1} ＋ ${m2}`, val: `${sumM} min` },
          { item: 'Μετατροπή 60 λεπτών σε 1 ώρα', formula: `${sumM} min ＝ 1 h και ${finalM} min`, val: `${finalH} h ${finalM} min` }
        ],
        explain: `Προσθέτουμε: ${h1} ＋ ${h2} ＝ ${sumH} ώρες και ${m1} ＋ ${m2} ＝ ${sumM} λεπτά. Επειδή 80 min ＝ 1 ώρα και 20 λεπτά, το τελικό αποτέλεσμα είναι ${finalH} ώρες και ${finalM} λεπτά.`,
        distractors: [
          '5 ώρες και 80 λεπτά',
          '5 ώρες και 20 λεπτά',
          '7 ώρες και 10 λεπτά'
        ]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions() {
  // Q1: Input - Ώρες και λεπτά σε συνολικά λεπτά
  const q1H = randInt(2, 5);
  const q1M = randInt(10, 50);
  const q1Res = q1H * 60 + q1M;

  // Q2: Input - Λεπτά σε δευτερόλεπτα
  const q2M = randInt(8, 25);
  const q2Res = q2M * 60;

  // Q3: Input - Συνολικά λεπτά σε ολόκληρες ώρες
  const q3TotalM = randInt(130, 290);
  const q3H = Math.floor(q3TotalM / 60);
  const q3RemM = q3TotalM % 60;

  // Q4: MCQ - Δευτερόλεπτα μίας ώρας
  const q4Options = shuffle(['3.600 δευτερόλεπτα', '600 δευτερόλεπτα', '6.000 δευτερόλεπτα', '60 δευτερόλεπτα']);

  // Q5: True/False - Δεκαδική ώρα
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? 'Ο χρόνος 2,5 ώρες ισοδυναμεί με 2 ώρες και 30 λεπτά (μισή ώρα).'
    : 'Ο χρόνος 2,5 ώρες ισοδυναμεί με 2 ώρες και 50 λεπτά.';

  // Q6: True/False - Δίσεκτο έτος
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? 'Το δίσεκτο έτος έχει 366 ημέρες και συμβαίνει κάθε 4 χρόνια.'
    : 'Το δίσεκτο έτος έχει 365 ημέρες και ο Φεβρουάριος έχει 28 ημέρες.';

  // Q7: Input - Εύρεση αιώνα για ένα έτος
  const q7YearPool = [
    { y: 1821, cent: 19 },
    { y: 1453, cent: 15 },
    { y: 1940, cent: 20 },
    { y: 1789, cent: 18 },
    { y: 2024, cent: 21 },
    { y: 1204, cent: 13 }
  ];
  const q7Choice = q7YearPool[randInt(0, q7YearPool.length - 1)];

  // Q8: MCQ - Ώρα Greenwich / UTC Ελλάδας
  const q8GmtHour = randInt(9, 15);
  const q8AthensHour = (q8GmtHour + 2) % 24;
  const q8Options = shuffle([
    `${q8AthensHour}:00`,
    `${q8GmtHour}:00`,
    `${(q8GmtHour - 2 + 24) % 24}:00`,
    `${(q8AthensHour + 2) % 24}:00`
  ]);

  // Q9: Standard Problem
  const spIndex = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q9Raw = STANDARD_PROBLEMS_POOL[spIndex].generate();
  const q9Options = shuffle([
    ...new Set([q9Raw.correctText, ...q9Raw.distractors])
  ]);

  // Q10: Hard Problem
  const hpIndex = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q10Raw = HARD_PROBLEMS_POOL[hpIndex].generate();
  const q10Options = shuffle([
    ...new Set([q10Raw.correctText, ...q10Raw.distractors])
  ]);

  return [
    {
      id: 'q1',
      type: 'input',
      inputType: 'number',
      title: 'Ώρες & Λεπτά σε Συνολικά Λεπτά',
      prompt: `Μετάτρεψε το χρονικό διάστημα ${q1H} ώρες και ${q1M} λεπτά σε συνολικά λεπτά:`,
      correct: String(q1Res),
      explain: `Πολλαπλασιάζουμε τις ώρες επί 60 και προσθέτουμε τα λεπτά: (${q1H} · 60) ＋ ${q1M} ＝ ${q1H * 60} ＋ ${q1M} ＝ ${q1Res} λεπτά.`
    },
    {
      id: 'q2',
      type: 'input',
      inputType: 'number',
      title: 'Λεπτά σε Δευτερόλεπτα',
      prompt: `Πόσα δευτερόλεπτα είναι τα ${q2M} λεπτά;`,
      correct: String(q2Res),
      explain: `Κάθε λεπτό έχει 60 δευτερόλεπτα: ${q2M} · 60 ＝ ${q2Res} δευτερόλεπτα.`
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'number',
      title: 'Ανάλυση Λεπτών σε Ώρες',
      prompt: `Πόσες ολόκληρες ώρες περιέχονται στα ${q3TotalM} λεπτά; (Γράψε μόνο τον ακέραιο αριθμό των ωρών):`,
      correct: String(q3H),
      explain: `Διαιρούμε με το 60: ${q3TotalM} : 60 ＝ ${q3H} ολόκληρες ώρες και περισσεύουν ${q3RemM} λεπτά.`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: 'Δευτερόλεπτα μίας Ώρας',
      prompt: 'Πόσα δευτερόλεπτα περιέχει 1 ολόκληρη ώρα;',
      options: q4Options,
      correct: '3.600 δευτερόλεπτα',
      explain: '1 ώρα ＝ 60 λεπτά και κάθε λεπτό ＝ 60 δευτερόλεπτα. Άρα 60 · 60 ＝ 3.600 δευτερόλεπτα.'
    },
    {
      id: 'q5',
      type: 'tf',
      title: 'Δεκαδική Μορφή Ώρας',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? 'Σωστά! Το 0,5 της ώρας είναι το μισό του 60, δηλαδή 30 λεπτά (2,5 h ＝ 2 h 30 min).'
        : 'Λάθος! Ο χρόνος δεν είναι δεκαδικός. Το 0,5 της ώρας αντιστοιχεί σε 30 λεπτά και όχι σε 50 λεπτά.'
    },
    {
      id: 'q6',
      type: 'tf',
      title: 'Δίσεκτο Έτος',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Σωστά! Το δίσεκτο έτος έχει 366 ημέρες (ο Φεβρουάριος έχει 29) και εμφανίζεται κάθε 4 χρόνια.'
        : 'Λάθος! Το δίσεκτο έτος έχει 366 ημέρες και ο Φεβρουάριος έχει 29 ημέρες.'
    },
    {
      id: 'q7',
      type: 'input',
      inputType: 'number',
      title: 'Υπολογισμός Αιώνα',
      prompt: `Σε ποιον αιώνα ανήκει το έτος ${q7Choice.y}; (Γράψε μόνο τον αριθμό του αιώνα, π.χ. ${q7Choice.cent}):`,
      correct: String(q7Choice.cent),
      explain: `Για το έτος ${q7Choice.y}, παίρνουμε τα πρώτα ψηφία (${Math.floor(q7Choice.y / 100)}) και προσθέτουμε 1 ➔ ${q7Choice.cent}ος αιώνας.`
    },
    {
      id: 'q8',
      type: 'mcq',
      title: 'Ώρα Greenwich & Αθήνα',
      prompt: `Όταν στο Greenwich του Λονδίνου (UTC 0) είναι ${q8GmtHour}:00, τι ώρα είναι στην Αθήνα (UTC+2);`,
      options: q8Options,
      correct: `${q8AthensHour}:00`,
      explain: `Η Αθήνα είναι 2 ώρες μπροστά από το Greenwich: ${q8GmtHour}:00 ＋ 2 ώρες ＝ ${q8AthensHour}:00.`
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

export default function XronosExercisesPage() {
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
      const cleanUser = userVal.replace(/\./g, ',').replace(/\s+/g, '').trim().toLowerCase();
      const cleanTarget = q.correct.replace(/\./g, ',').replace(/\s+/g, '').trim().toLowerCase();
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

  const answeredCount = Object.values(answers).filter(val => val !== undefined && val !== null && String(val).trim() !== '').length;

  return (
    <Layout
      title="Ασκήσεις: Μονάδες Μέτρησης Χρόνου - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στις μονάδες μέτρησης χρόνου, τις μετατροπές, τους αιώνες και τις ζώνες ώρας για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/61-xronos"
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
                <span>ΚΕΦΑΛΑΙΟ 61 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Μονάδες Μέτρησης Χρόνου
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στις μετατροπές ωρών/λεπτών/δευτερολέπτων, στους υπολογισμούς διάρκειας, στους αιώνες και στις παγκόσμιες ζώνες ώρας!
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
                          inputMode={q.inputType === 'decimal' ? 'decimal' : 'numeric'}
                          maxLength={10}
                          disabled={submitted}
                          value={answers[q.id] || ''}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value, 'input')}
                          placeholder="Απάντηση..."
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
                                <th className="p-1.5">{toCleanUppercase('Ανάλυση / Μετατροπή')}</th>
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
              <span className="font-mono text-lg sm:text-xl md:text-2xl">
                {submitted ? `${score} / 10` : `${answeredCount} / 10`}
              </span>
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
