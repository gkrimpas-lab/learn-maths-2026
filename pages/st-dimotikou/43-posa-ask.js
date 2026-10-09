// pages/st-dimotikou/43-posa-ask.js
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
    id: 'posa_std_1',
    title: 'Αγορά Σημειωματάριων',
    unit: '€',
    generate: () => {
      const fixedRate = randInt(3, 7);
      const count1 = randInt(3, 6);
      const cost1 = count1 * fixedRate;
      const count2 = count1 + randInt(3, 6);
      const cost2 = count2 * fixedRate;
      return {
        prompt: `Σε ένα βιβλιοπωλείο η τιμή ενός σημειωματάριου είναι σταθερή. Αν για ${count1} σημειωματάρια πληρώσαμε ${cost1} €, ποιο είναι το ποσό σε € που αντιστοιχεί στην αγορά ${count2} τέτοιων σημειωματάριων;`,
        unit: '€',
        correctVal: String(cost2),
        correctText: `${cost2} €`,
        tableData: [
          { item: 'Σταθερό ποσό μονάδας', formula: `${cost1} : ${count1}`, val: `${fixedRate} €/τεμ.` },
          { item: 'Ποσότητα αγοράς', formula: `${count2} τεμάχια`, val: `${count2}` },
          { item: 'Συνολικό μεταβλητό κόστος', formula: `${count2} · ${fixedRate}`, val: `${cost2} €` }
        ],
        explain: `Η σταθερή τιμή μονάδας είναι ${cost1} : ${count1} ＝ ${fixedRate} € ανά σημειωματάριο. Επομένως, το μεταβλητό κόστος για ${count2} σημειωματάρια είναι ${count2} · ${fixedRate} ＝ ${cost2} €.`,
        distractors: [`${cost2 + fixedRate} €`, `${cost2 - fixedRate} €`, `${cost2 + 2 * fixedRate} €`]
      };
    }
  },
  {
    id: 'posa_std_2',
    title: 'Κίνηση με Σταθερή Ταχύτητα',
    unit: 'km',
    generate: () => {
      const speed = randInt(60, 90);
      const hours = randInt(2, 5);
      const distance = speed * hours;
      return {
        prompt: `Ένα όχημα κινείται με σταθερή ταχύτητα ${speed} km/h. Ποια είναι η μεταβλητή απόσταση (σε km) που θα διανύσει το όχημα σε χρόνο ${hours} ωρών;`,
        unit: 'km',
        correctVal: String(distance),
        correctText: `${distance} km`,
        tableData: [
          { item: 'Σταθερό ποσό (Ταχύτητα)', formula: `${speed} km/h`, val: `${speed} km/h` },
          { item: 'Μεταβλητό ποσό (Χρόνος)', formula: `${hours} ώρες`, val: `${hours} h` },
          { item: 'Συσχετισμένο ποσό (Απόσταση)', formula: `${speed} · ${hours}`, val: `${distance} km` }
        ],
        explain: `Η ταχύτητα είναι σταθερό ποσό (${speed} km/h). Η απόσταση υπολογίζεται από τη σχέση: Απόσταση ＝ Ταχύτητα · Χρόνος ＝ ${speed} · ${hours} ＝ ${distance} km.`,
        distractors: [`${distance + speed} km`, `${distance - speed} km`, `${distance + 30} km`]
      };
    }
  },
  {
    id: 'posa_std_3',
    title: 'Χρέωση Ενοικίασης με Πάγιο',
    unit: '€',
    generate: () => {
      const baseFee = randInt(5, 12);
      const costPerDay = randInt(2, 4);
      const days = randInt(4, 8);
      const total = baseFee + costPerDay * days;
      return {
        prompt: `Μια υπηρεσία ενοικίασης εξοπλισμού χρεώνει σταθερό πάγιο ποσό ${baseFee} € συν ${costPerDay} € για κάθε ημέρα χρήσης. Ποιο είναι το συνολικό ποσό πληρωμής σε € για ${days} ημέρες ενοικίασης;`,
        unit: '€',
        correctVal: String(total),
        correctText: `${total} €`,
        tableData: [
          { item: 'Σταθερό πάγιο ποσό', formula: `${baseFee} €`, val: `${baseFee} €` },
          { item: 'Μεταβλητό κόστος ημερών', formula: `${days} · ${costPerDay} €`, val: `${costPerDay * days} €` },
          { item: 'Συνολικό ποσό', formula: `${baseFee} ＋ ${costPerDay * days}`, val: `${total} €` }
        ],
        explain: `Το σταθερό ποσό είναι ${baseFee} €. Το μεταβλητό ποσό των ημερών είναι ${days} · ${costPerDay} ＝ ${costPerDay * days} €. Το συνολικό ποσό είναι ${baseFee} ＋ ${costPerDay * days} ＝ ${total} €.`,
        distractors: [`${total + costPerDay} €`, `${total - costPerDay} €`, `${total + baseFee} €`]
      };
    }
  },
  {
    id: 'posa_std_4',
    title: 'Καύσιμα και Κόστος',
    unit: '€',
    generate: () => {
      const perLiterCost = 1.8;
      const liters = randInt(10, 30);
      const totalCost = Number((liters * perLiterCost).toFixed(2));
      return {
        prompt: `Η τιμή της βενζίνης σε ένα πρατήριο παραμένει σταθερή στα 1,80 € το λίτρο. Πόσα € θα πληρώσει ένας οδηγός που έβαλε στο ρεζερβουάρ του ${liters} l καυσίμου;`,
        unit: '€',
        correctVal: formatNum(totalCost),
        correctText: `${formatNum(totalCost)} €`,
        tableData: [
          { item: 'Σταθερή τιμή ανά λίτρο', formula: '1,80 €/l', val: '1,80 €' },
          { item: 'Μεταβλητός όγκος καυσίμου', formula: `${liters} λίτρα`, val: `${liters} l` },
          { item: 'Συνολικό κόστος', formula: `${liters} · 1,80`, val: `${formatNum(totalCost)} €` }
        ],
        explain: `Το κόστος ανά λίτρο είναι σταθερό ποσό (1,80 €/l). Για μεταβλητή ποσότητα ${liters} l, το τελικό ποσό είναι ${liters} · 1,8 ＝ ${formatNum(totalCost)} €.`,
        distractors: [`${formatNum(totalCost + 3.6)} €`, `${formatNum(Math.max(1, totalCost - 1.8))} €`, `${formatNum(totalCost + 5)} €`]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'posa_hard_1',
    title: 'Κίνηση Δύο Οχημάτων με Διαφορετική Ταχύτητα',
    unit: 'km',
    generate: () => {
      const speed1 = randInt(60, 80);
      const speed2 = speed1 + 20;
      const hours = randInt(2, 4);
      const distDiff = (speed2 - speed1) * hours;
      return {
        prompt: `Δύο αυτοκίνητα ξεκινούν ταυτόχρονα από την ίδια αφετηρία. Το πρώτο κινείται με σταθερή ταχύτητα ${speed1} km/h και το δεύτερο με σταθερή ταχύτητα ${speed2} km/h. Πόσα km θα απέχουν μεταξύ τους μετά από ${hours} ώρες αν κινούνται προς την ίδια κατεύθυνση;`,
        unit: 'km',
        correctVal: String(distDiff),
        correctText: `${distDiff} km`,
        tableData: [
          { item: 'Σταθερή διαφορά ταχύτητας', formula: `${speed2} － ${speed1}`, val: `${speed2 - speed1} km/h` },
          { item: 'Χρόνος κίνησης', formula: `${hours} ώρες`, val: `${hours} h` },
          { item: 'Μεταβλητή απόσταση μεταξύ τους', formula: `${speed2 - speed1} · ${hours}`, val: `${distDiff} km` }
        ],
        explain: `Η διαφορά ταχύτητας ανά ώρα είναι σταθερό ποσό: ${speed2} － ${speed1} ＝ ${speed2 - speed1} km/h. Σε χρόνο ${hours} ωρών, η μεταβλητή απόσταση μεταξύ τους είναι ${speed2 - speed1} · ${hours} ＝ ${distDiff} km.`,
        distractors: [`${distDiff + 20} km`, `${distDiff - 10} km`, `${distDiff + 40} km`]
      };
    }
  },
  {
    id: 'posa_hard_2',
    title: 'Χρέωση Προγράμματος Κινητής',
    unit: '€',
    generate: () => {
      const fixedMonthly = 15;
      const freeGigs = 5;
      const extraPerGig = 2.5;
      const usedGigs = freeGigs + randInt(2, 6);
      const extraGigs = usedGigs - freeGigs;
      const totalCost = Number((fixedMonthly + extraGigs * extraPerGig).toFixed(2));
      return {
        prompt: `Ένα πρόγραμμα κινητής τηλεφωνίας έχει σταθερό μηνιαίο πάγιο ${fixedMonthly} € και περιλαμβάνει ${freeGigs} GB δωρεάν δεδομένα. Για κάθε επιπλέον GB χρεώνει ${formatNum(extraPerGig)} €. Πόσα € θα πληρώσει ένας συνδρομητής που κατανάλωσε συνολικά ${usedGigs} GB σε έναν μήνα;`,
        unit: '€',
        correctVal: formatNum(totalCost),
        correctText: `${formatNum(totalCost)} €`,
        tableData: [
          { item: 'Σταθερό μηνιαίο πάγιο', formula: `${fixedMonthly} €`, val: `${fixedMonthly} €` },
          { item: 'Επιπλέον δεδομένα', formula: `${usedGigs} － ${freeGigs}`, val: `${extraGigs} GB` },
          { item: 'Επιπλέον κόστος', formula: `${extraGigs} · ${formatNum(extraPerGig)} €`, val: `${formatNum(extraGigs * extraPerGig)} €` }
        ],
        explain: `Τα επιπλέον GB είναι ${usedGigs} － ${freeGigs} ＝ ${extraGigs} GB. Η επιπλέον χρέωση είναι ${extraGigs} · ${formatNum(extraPerGig)} ＝ ${formatNum(extraGigs * extraPerGig)} €. Το τελικό ποσό είναι ${fixedMonthly} ＋ ${formatNum(extraGigs * extraPerGig)} ＝ ${formatNum(totalCost)} €.`,
        distractors: [`${formatNum(totalCost + 2.5)} €`, `${formatNum(totalCost - 2.5)} €`, `${formatNum(totalCost + 5)} €`]
      };
    }
  },
  {
    id: 'posa_hard_3',
    title: 'Δεξαμενή με Εισροή και Εκροή',
    unit: 'l',
    generate: () => {
      const tankCapacity = 600;
      const tapIn = 35;
      const tapOut = 15;
      const netGain = tapIn - tapOut;
      const minutes = randInt(10, 25);
      const currentWater = netGain * minutes;
      return {
        prompt: `Σε μια άδεια δεξαμενή χωρητικότητας ${tankCapacity} l, μια βρύση εισροής ρίχνει ${tapIn} l/min και ταυτόχρονα μια βρύση εκροής χάνει ${tapOut} l/min. Πόσα l νερού θα περιέχει η δεξαμενή μετά από ${minutes} λεπτά ταυτόχρονης λειτουργίας;`,
        unit: 'l',
        correctVal: String(currentWater),
        correctText: `${currentWater} l`,
        tableData: [
          { item: 'Σταθερός ρυθμός μεταβολής', formula: `${tapIn} － ${tapOut}`, val: `${netGain} l/min` },
          { item: 'Χρόνος λειτουργίας', formula: `${minutes} λεπτά`, val: `${minutes} min` },
          { item: 'Συνολικό νερό στη δεξαμενή', formula: `${netGain} · ${minutes}`, val: `${currentWater} l` }
        ],
        explain: `Ο καθαρός ρυθμός μεταβολής του νερού είναι σταθερός: ${tapIn} － ${tapOut} ＝ ${netGain} l ανά λεπτό. Σε χρόνο ${minutes} λεπτών, το συσχετισμένο ποσό νερού στη δεξαμενή είναι ${netGain} · ${minutes} ＝ ${currentWater} l.`,
        distractors: [`${currentWater + 50} l`, `${currentWater - 40} l`, `${currentWater + 80} l`]
      };
    }
  },
  {
    id: 'posa_hard_4',
    title: 'Σταθερό και Μεταβλητό Κόστος Εκδήλωσης',
    unit: '€',
    generate: () => {
      const fixedHallCost = 120;
      const costPerGuest = 14;
      const guests = randInt(25, 40);
      const total = fixedHallCost + guests * costPerGuest;
      return {
        prompt: `Για μια σχολική εκδήλωση, η ενοικίαση της αίθουσας κοστίζει σταθερά ${fixedHallCost} €, ενώ το κόστος του φαγητού ανέρχεται σε ${costPerGuest} € ανά καλεσμένο. Ποιο είναι το συνολικό κόστος σε € αν παρευρεθούν ${guests} καλεσμένοι;`,
        unit: '€',
        correctVal: String(total),
        correctText: `${total} €`,
        tableData: [
          { item: 'Σταθερό κόστος αίθουσας', formula: `${fixedHallCost} €`, val: `${fixedHallCost} €` },
          { item: 'Μεταβλητό κόστος φαγητού', formula: `${guests} · ${costPerGuest} €`, val: `${guests * costPerGuest} €` },
          { item: 'Συνολικό κόστος', formula: `${fixedHallCost} ＋ ${guests * costPerGuest}`, val: `${total} €` }
        ],
        explain: `Σταθερό ποσό: ${fixedHallCost} €. Μεταβλητό ποσό καλεσμένων: ${guests} · ${costPerGuest} ＝ ${guests * costPerGuest} €. Συνολικό ποσό: ${fixedHallCost} ＋ ${guests * costPerGuest} ＝ ${total} €.`,
        distractors: [`${total + 28} €`, `${total - 14} €`, `${total + 42} €`]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions() {
  // Q1: Input - Υπολογισμός εξαρτημένου μεταβλητού ποσού
  const q1Rate = randInt(3, 8);
  const q1Kg = randInt(4, 9);
  const q1Total = q1Rate * q1Kg;

  // Q2: MCQ - Αναγνώριση σταθερού ποσού
  const q2Correct = 'Ο αριθμός των ημερών του μήνα Απριλίου (30 ημέρες)';
  const q2Options = shuffle([
    q2Correct,
    'Η ημερήσια θερμοκρασία σε μια πόλη',
    'Το βάρος ενός μαθητή κατά τη διάρκεια του έτους',
    'Η ταχύτητα ενός αυτοκινήτου μέσα στην κίνηση της πόλης'
  ]);

  // Q3: Input - Εύρεση του σταθερού ποσού (τιμή μονάδας)
  const q3Count = randInt(4, 8);
  const q3UnitPrice = randInt(3, 6);
  const q3Total = q3Count * q3UnitPrice;

  // Q4: MCQ - Έννοια του ποσού
  const q4Correct = 'Κάθε μέγεθος που μπορεί να μετρηθεί και εκφράζεται με αριθμό και μονάδα μέτρησης';
  const q4Options = shuffle([
    q4Correct,
    'Οποιοσδήποτε αφηρημένος ακέραιος αριθμός χωρίς μονάδα μέτρησης',
    'Μόνο τα χρήματα που πληρώνουμε σε μια αγορά',
    'Μόνο οι αριθμοί που παραμένουν πάντοτε σταθεροί'
  ]);

  // Q5: Input - Υπολογισμός διανυόμενης απόστασης
  const q5Speed = randInt(70, 100);
  const q5Time = randInt(2, 4);
  const q5Dist = q5Speed * q5Time;

  // Q6: MCQ - Αναγνώριση μεταβλητού ποσού
  const q6Correct = 'Το βάρος ενός μαθητή';
  const q6Options = shuffle([
    q6Correct,
    'Ο αριθμός των μηνών του έτους (12 μήνες)',
    'Ο αριθμός των γραμμαρίων σε 1 κιλό (1.000 g)',
    'Ο αριθμός των πλευρών ενός τριγώνου (3 πλευρές)'
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
      title: 'Υπολογισμός Μεταβλητού Ποσού',
      prompt: `Σε ένα μανάβικο η τιμή των πορτοκαλιών είναι σταθερή στα ${q1Rate} € το κιλό. Ποιο είναι το συνολικό κόστος σε € για την αγορά ${q1Kg} kg πορτοκαλιών;`,
      correct: String(q1Total),
      explain: `Το κόστος ανά κιλό (${q1Rate} €) είναι σταθερό ποσό. Το συνολικό κόστος εξαρτάται από τα κιλά: ${q1Rate} · ${q1Kg} ＝ ${q1Total} €.`
    },
    {
      id: 'q2',
      type: 'mcq',
      title: 'Αναγνώριση Σταθερού Ποσού',
      prompt: 'Ποιο από τα παρακάτω ποσά παραμένει πάντοτε σταθερό;',
      options: q2Options,
      correct: q2Correct,
      explain: 'Ο Απρίλιος έχει πάντοτε σταθερά 30 ημέρες, επομένως το μέγεθος αυτό είναι σταθερό ποσό. Αντίθετα, η θερμοκρασία, το βάρος και η ταχύτητα στην πόλη μεταβάλλονται συνεχώς.'
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'number',
      title: 'Εύρεση Σταθερού Ποσού',
      prompt: `Αν για ${q3Count} ίδια τετράδια πληρώσαμε συνολικά ${q3Total} €, ποιο είναι το σταθερό ποσό σε € που κοστίζει το κάθε τετράδιο;`,
      correct: String(q3UnitPrice),
      explain: `Διαιρούμε το συνολικό μεταβλητό κόστος με το πλήθος των τετραδίων: ${q3Total} : ${q3Count} ＝ ${q3UnitPrice} € ανά τετράδιο (σταθερό ποσό μονάδας).`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: 'Έννοια του Ποσού',
      prompt: 'Τι ονομάζεται ποσό στα Μαθηματικά;',
      options: q4Options,
      correct: q4Correct,
      explain: 'Στα Μαθηματικά ποσό ονομάζεται κάθε μέγεθος που μετριέται ή υπολογίζεται και εκφράζεται με έναν αριθμό μαζί με την κατάλληλη μονάδα μέτρησης (π.χ. 5 kg, 12 m, 20 €).'
    },
    {
      id: 'q5',
      type: 'input',
      inputType: 'number',
      title: 'Συσχετισμένα Ποσά στην Κίνηση',
      prompt: `Ένα αυτοκίνητο ταξιδεύει με σταθερή ταχύτητα ${q5Speed} km/h. Πόσα km θα διανύσει σε χρόνο ${q5Time} ωρών;`,
      correct: String(q5Dist),
      explain: `Η διανυόμενη απόσταση είναι συσχετισμένο ποσό με τον χρόνο: Απόσταση ＝ Ταχύτητα · Χρόνος ＝ ${q5Speed} · ${q5Time} ＝ ${q5Dist} km.`
    },
    {
      id: 'q6',
      type: 'mcq',
      title: 'Αναγνώριση Μεταβλητού Ποσού',
      prompt: 'Ποιο από τα παρακάτω μεγέθη αλλάζει τιμή και είναι μεταβλητό ποσό;',
      options: q6Options,
      correct: q6Correct,
      explain: 'Το βάρος ενός ανθρώπου μεταβάλλεται στο πέρασμα του χρόνου. Αντίθετα, οι μήνες του έτους (12), τα γραμμάρια του κιλού (1.000) και οι πλευρές του τριγώνου (3) είναι σταθερά ποσά.'
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

export default function PosaExercisesPage() {
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
      const cleanUser = userVal.replace(/\./g, ',').replace(/\s+/g, '').replace(/^x[=＝]/i, '').trim().toLowerCase();
      const cleanTarget = q.correct.replace(/\./g, ',').replace(/\s+/g, '').replace(/^x[=＝]/i, '').trim().toLowerCase();

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
      title="Ασκήσεις: Ποσά (Σταθερά & Μεταβλητά) - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στη διάκριση σταθερών και μεταβλητών ποσών και στα συσχετισμένα ποσά για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/43-posa"
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
                <span>ΚΕΦΑΛΑΙΟ 43 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Σταθερά &amp; Μεταβλητά Ποσά
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στη διάκριση σταθερών και μεταβλητών ποσών, στον υπολογισμό συσχετισμένων μεγεθών και σε ρεαλιστικά προβλήματα καθημερινότητας!
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
