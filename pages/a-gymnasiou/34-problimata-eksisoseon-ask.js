import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Επαναχρησιμοποιήσιμο component για κλασματική γραφή
function Frac({ num, den, isNeg = false, className = '' }) {
  const numStr = String(num);
  const denStr = String(den);
  const hasMinus = numStr.startsWith('-') || denStr.startsWith('-') || isNeg;

  const displayNum = numStr.replace(/^-/, '');
  const displayDen = denStr.replace(/^-/, '');

  return (
    <span className={`inline-flex items-center gap-0.5 align-middle mx-1 font-mono ${className}`}>
      {hasMinus && <span className="font-bold">－</span>}
      <span className="inline-flex flex-col items-center justify-center leading-none text-center">
        <span className="pb-0.5 px-1.5 border-b-2 w-full text-center" style={{ borderColor: 'currentColor' }}>
          {displayNum}
        </span>
        <span className="pt-0.5 px-1.5 w-full text-center">
          {displayDen}
        </span>
      </span>
    </span>
  );
}

// Helper για δημιουργία HTML κλάσματος μέσα στα string των λύσεων
const fracHtml = (num, den, isNeg = false) => {
  const numStr = String(num);
  const denStr = String(den);
  const hasMinus = numStr.startsWith('-') || denStr.startsWith('-') || isNeg;
  const displayNum = numStr.replace(/^-/, '');
  const displayDen = denStr.replace(/^-/, '');

  return `<span class="inline-flex items-center gap-0.5 align-middle mx-1 font-mono">${
    hasMinus ? '<span class="font-bold">－</span>' : ''
  }<span class="inline-flex flex-col items-center justify-center leading-none text-center"><span class="pb-0.5 px-1.5 border-b-2 border-current w-full text-center">${displayNum}</span><span class="pt-0.5 px-1.5 w-full text-center">${displayDen}</span></span></span>`;
};

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[j], arr[i]] = [arr[i], arr[j]];
  }
  return arr;
};

const makeUniqueOptions = (correct, wrongCandidates) => {
  const unique = new Set([String(correct)]);
  for (const opt of wrongCandidates) {
    if (opt !== undefined && opt !== null && opt !== '') {
      unique.add(String(opt));
    }
    if (unique.size === 4) break;
  }
  let count = 1;
  while (unique.size < 4) {
    unique.add(String(Number(correct) + count));
    count++;
  }
  return shuffleArray(Array.from(unique));
};

// ============================================================================
// 12 ΘΕΜΑΤΙΚΕΣ ΔΕΞΑΜΕΝΕΣ (ΚΑΘΕΜΙΑ ΜΕ 10 ΔΙΑΦΟΡΕΤΙΚΕΣ ΠΑΡΑΛΛΑΓΕΣ ΜΕ ΤΥΧΑΙΑ ΝΟΥΜΕΡΑ)
// ============================================================================

// Θέση 1: Προβλήματα Μεταφορών (Ταξί / Ενοικιάσεις)
const POOL_1_TRANSPORT = [
  () => {
    const a = randInt(2, 4);
    const b = randInt(3, 6);
    const x = randInt(6, 18);
    const total = a * x + b;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΑΦΟΡΕΣ',
      question: `Ένα ταξί έχει σημαία ${b} € και χρεώνει ${a} € για κάθε χιλιόμετρο. Αν ένας πελάτης πλήρωσε ${total} €, πόσα χιλιόμετρα διένυσε;`,
      correctAnswer: String(x),
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: ${a} · x ＋ ${b} ＝ ${total} (όπου x τα χιλιόμετρα)
          </div>
          <div>1. Μεταφορά όρου: ${a} · x ＝ ${total} － ${b} ➔ ${a} · x ＝ ${total - b}.</div>
          <div class="flex items-center flex-wrap pt-1">
            2. Διαίρεση με το ${a} σε μορφή κλάσματος: x ＝ ${fracHtml(total - b, a)} ＝ ${x} km.
          </div>
        </div>
      `,
    };
  },
  () => {
    const hourly = randInt(4, 8);
    const deposit = randInt(10, 20);
    const hours = randInt(2, 7);
    const total = hourly * hours + deposit;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΝΟΙΚΙΑΣΗ',
      question: `Η ενοικίαση ποδηλάτου κοστίζει ${deposit} € πάγια ασφάλεια συν ${hourly} € για κάθε ώρα. Αν ο λογαριασμός ήταν ${total} €, πόσες ώρες χρησιμοποιήθηκε το ποδήλατο;`,
      correctAnswer: String(hours),
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: ${hourly} · x ＋ ${deposit} ＝ ${total} (όπου x οι ώρες)
          </div>
          <div>1. Μεταφορά όρου: ${hourly} · x ＝ ${total} － ${deposit} ➔ ${hourly} · x ＝ ${total - deposit}.</div>
          <div class="flex items-center flex-wrap pt-1">
            2. Διαίρεση με το ${hourly} σε μορφή κλάσματος: x ＝ ${fracHtml(total - deposit, hourly)} ＝ ${hours} ώρες.
          </div>
        </div>
      `,
    };
  },
  () => {
    const kmRate = 3;
    const base = randInt(5, 8);
    const km = randInt(10, 25);
    const cost = kmRate * km + base;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΑΦΟΡΕΣ',
      question: `Ένα φορτηγάκι μεταφορών χρεώνει ${base} € πάγια κράτηση συν ${kmRate} € ανά χιλιόμετρο. Πόσα χιλιόμετρα έγινε η μεταφορά αν το κόστος ήταν ${cost} €;`,
      correctAnswer: String(km),
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: ${kmRate} · x ＋ ${base} ＝ ${cost} (όπου x τα χιλιόμετρα)
          </div>
          <div>1. Μεταφορά όρου: ${kmRate} · x ＝ ${cost} － ${base} ➔ ${kmRate} · x ＝ ${cost - base}.</div>
          <div class="flex items-center flex-wrap pt-1">
            2. Διαίρεση με το ${kmRate} σε μορφή κλάσματος: x ＝ ${fracHtml(cost - base, kmRate)} ＝ ${km} km.
          </div>
        </div>
      `,
    };
  },
  () => {
    const rate = randInt(2, 5);
    const h = randInt(3, 8);
    const total = rate * h + 5;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΝΟΙΚΙΑΣΗ',
      question: `Για ένα ηλεκτρικό σκούτερ πληρώνεις 5 € για το ξεκλείδωμα και ${rate} € για κάθε ώρα βόλτας. Αν πλήρωσες ${total} €, πόσες ώρες έκανες βόλτα;`,
      correctAnswer: String(h),
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: ${rate} · x ＋ 5 ＝ ${total} (όπου x οι ώρες)
          </div>
          <div>1. Μεταφορά όρου: ${rate} · x ＝ ${total} － 5 ➔ ${rate} · x ＝ ${total - 5}.</div>
          <div class="flex items-center flex-wrap pt-1">
            2. Διαίρεση με το ${rate} σε μορφή κλάσματος: x ＝ ${fracHtml(total - 5, rate)} ＝ ${h} ώρες.
          </div>
        </div>
      `,
    };
  },
  () => {
    const perDay = randInt(20, 35);
    const insurance = randInt(15, 30);
    const days = randInt(3, 9);
    const sum = perDay * days + insurance;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΝΟΙΚΙΑΣΗ',
      question: `Η ενοικίαση ενός αυτοκινήτου χρεώνει ${insurance} € εφάπαξ ασφάλιση και ${perDay} € ανά ημέρα. Πόσες ημέρες νοικιάστηκε το αυτοκίνητο αν το συνολικό ποσό ήταν ${sum} €;`,
      correctAnswer: String(days),
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: ${perDay} · x ＋ ${insurance} ＝ ${sum} (όπου x οι ημέρες)
          </div>
          <div>1. Μεταφορά όρου: ${perDay} · x ＝ ${sum} － ${insurance} ➔ ${perDay} · x ＝ ${sum - insurance}.</div>
          <div class="flex items-center flex-wrap pt-1">
            2. Διαίρεση με το ${perDay} σε μορφή κλάσματος: x ＝ ${fracHtml(sum - insurance, perDay)} ＝ ${days} ημέρες.
          </div>
        </div>
      `,
    };
  },
  () => {
    const fee = randInt(3, 7);
    const costPerStop = 4;
    const stops = randInt(4, 12);
    const total = costPerStop * stops + fee;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΥΠΗΡΕΣΙΕΣ',
      question: `Μια εταιρεία ταχυμεταφορών χρεώνει ${fee} € πάγια έξοδα και ${costPerStop} € για κάθε παράδοση δέματος. Πόσες παραδόσεις έγιναν αν εισπράχθηκαν ${total} €;`,
      correctAnswer: String(stops),
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: ${costPerStop} · x ＋ ${fee} ＝ ${total} (όπου x οι παραδόσεις)
          </div>
          <div>1. Μεταφορά όρου: ${costPerStop} · x ＝ ${total} － ${fee} ➔ ${costPerStop} · x ＝ ${total - fee}.</div>
          <div class="flex items-center flex-wrap pt-1">
            2. Διαίρεση με το ${costPerStop} σε μορφή κλάσματος: x ＝ ${fracHtml(total - fee, costPerStop)} ＝ ${stops}.
          </div>
        </div>
      `,
    };
  },
  () => {
    const entry = 6;
    const ride = 3;
    const rCount = randInt(5, 14);
    const bill = ride * rCount + entry;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΨΥΧΑΓΩΓΙΑ',
      question: `Σε ένα πάρκο αναψυχής η γενική είσοδος είναι ${entry} € και κάθε παιχνίδι κοστίζει ${ride} €. Αν ένα παιδί ξόδεψε συνολικά ${bill} €, σε πόσα παιχνίδια μπήκε;`,
      correctAnswer: String(rCount),
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: ${ride} · x ＋ ${entry} ＝ ${bill} (όπου x τα παιχνίδια)
          </div>
          <div>1. Μεταφορά όρου: ${ride} · x ＝ ${bill} － ${entry} ➔ ${ride} · x ＝ ${bill - entry}.</div>
          <div class="flex items-center flex-wrap pt-1">
            2. Διαίρεση με το ${ride} σε μορφή κλάσματος: x ＝ ${fracHtml(bill - entry, ride)} ＝ ${rCount}.
          </div>
        </div>
      `,
    };
  },
  () => {
    const flag = 4;
    const perKm = 3;
    const dist = randInt(7, 20);
    const finalFare = perKm * dist + flag;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΑΦΟΡΕΣ',
      question: `Η σημαία ενός ταξί είναι ${flag} € και η διαδρομή κοστίζει ${perKm} € ανά χιλιόμετρο. Πόσα χιλιόμετρα ήταν η διαδρομή όταν ο λογαριασμός έγραψε ${finalFare} €;`,
      correctAnswer: String(dist),
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: ${perKm} · x ＋ ${flag} ＝ ${finalFare} (όπου x τα χιλιόμετρα)
          </div>
          <div>1. Μεταφορά όρου: ${perKm} · x ＝ ${finalFare} － ${flag} ➔ ${perKm} · x ＝ ${finalFare - flag}.</div>
          <div class="flex items-center flex-wrap pt-1">
            2. Διαίρεση με το ${perKm} σε μορφή κλάσματος: x ＝ ${fracHtml(finalFare - flag, perKm)} ＝ ${dist} km.
          </div>
        </div>
      `,
    };
  },
  () => {
    const fixedBoat = randInt(15, 30);
    const hourlyBoat = randInt(10, 20);
    const bHours = randInt(2, 6);
    const totalBoat = hourlyBoat * bHours + fixedBoat;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΝΟΙΚΙΑΣΗ',
      question: `Η ενοικίαση μιας βάρκας απαιτεί ${fixedBoat} € πάγια έξοδα εξοπλισμού και ${hourlyBoat} € ανά ώρα. Πόσες ώρες έπλευσε μια παρέα που πλήρωσε ${totalBoat} €;`,
      correctAnswer: String(bHours),
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: ${hourlyBoat} · x ＋ ${fixedBoat} ＝ ${totalBoat} (όπου x οι ώρες)
          </div>
          <div>1. Μεταφορά όρου: ${hourlyBoat} · x ＝ ${totalBoat} － ${fixedBoat} ➔ ${hourlyBoat} · x ＝ ${totalBoat - fixedBoat}.</div>
          <div class="flex items-center flex-wrap pt-1">
            2. Διαίρεση με το ${hourlyBoat} σε μορφή κλάσματος: x ＝ ${fracHtml(totalBoat - fixedBoat, hourlyBoat)} ＝ ${bHours} ώρες.
          </div>
        </div>
      `,
    };
  },
  () => {
    const delivery = 3;
    const ticket = randInt(6, 9);
    const people = randInt(3, 8);
    const order = ticket * people + delivery;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΙΣΙΤΗΡΙΑ',
      question: `Μια ηλεκτρονική πλατφόρμα χρεώνει ${delivery} € έξοδα κράτησης και ${ticket} € ανά εισιτήριο θεάτρου. Πόσα εισιτήρια αγόρασε μια παρέα αν πλήρωσε συνολικά ${order} €;`,
      correctAnswer: String(people),
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: ${ticket} · x ＋ ${delivery} ＝ ${order} (όπου x τα εισιτήρια)
          </div>
          <div>1. Μεταφορά όρου: ${ticket} · x ＝ ${order} － ${delivery} ➔ ${ticket} · x ＝ ${order - delivery}.</div>
          <div class="flex items-center flex-wrap pt-1">
            2. Διαίρεση με το ${ticket} σε μορφή κλάσματος: x ＝ ${fracHtml(order - delivery, ticket)} ＝ ${people}.
          </div>
        </div>
      `,
    };
  },
];

// Θέση 2: Προβλήματα Ηλικιών
const POOL_2_AGES = Array.from({ length: 10 }, (_, i) => {
  return () => {
    const diff = 20 + i * 2;
    const sonAge = randInt(7, 14);
    const sum = 2 * sonAge + diff;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΗΛΙΚΙΕΣ',
      question: `Ένας πατέρας είναι κατά ${diff} χρόνια μεγαλύτερος από τον γιο του. Αν το άθροισμα των ηλικιών τους είναι ${sum} έτη, πόσων ετών είναι ο γιος;`,
      correctAnswer: String(sonAge),
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: x ＋ (x ＋ ${diff}) ＝ ${sum} (όπου x η ηλικία του γιου)
          </div>
          <div>1. Αναγωγή ομοίων όρων: 2 · x ＋ ${diff} ＝ ${sum} ➔ 2 · x ＝ ${sum - diff}.</div>
          <div class="flex items-center flex-wrap pt-1">
            2. Διαίρεση με το 2 σε μορφή κλάσματος: x ＝ ${fracHtml(sum - diff, 2)} ＝ ${sonAge} ετών.
          </div>
        </div>
      `,
    };
  };
});

// Θέση 3: Προβλήματα Περιμέτρου Ορθογωνίου (Μήκος = x + διαφορά)
const POOL_3_RECT_PERIMETER = Array.from({ length: 10 }, (_, i) => {
  return () => {
    const diff = 4 + i;
    const width = randInt(6, 18);
    const perimeter = 4 * width + 2 * diff;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ',
      question: `Ένα ορθογώνιο οικόπεδο έχει μήκος κατά ${diff} μέτρα μεγαλύτερο από το πλάτος του. Αν η περίμετρος του οικοπέδου είναι ${perimeter} μέτρα, ποιο είναι το πλάτος του σε μέτρα;`,
      correctAnswer: String(width),
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: 2 · x ＋ 2 · (x ＋ ${diff}) ＝ ${perimeter} (όπου x το πλάτος)
          </div>
          <div>1. Επιμεριστική και αναγωγή: 4 · x ＋ ${2 * diff} ＝ ${perimeter} ➔ 4 · x ＝ ${perimeter - 2 * diff}.</div>
          <div class="flex items-center flex-wrap pt-1">
            2. Διαίρεση με το 4 σε μορφή κλάσματος: x ＝ ${fracHtml(perimeter - 2 * diff, 4)} ＝ ${width} m.
          </div>
        </div>
      `,
    };
  };
});

// Θέση 4: Προβλήματα Αγορών & Ρέστα
const POOL_4_SHOPPING = Array.from({ length: 10 }, (_, i) => {
  return () => {
    const count = 3 + (i % 4);
    const itemCost = randInt(4, 9);
    const extraItem = randInt(2, 6);
    const bill = count * itemCost + extraItem;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΓΟΡΕΣ',
      question: `Ο Πέτρος αγόρασε ${count} όμοια τετράδια και έναν μαρκαδόρο που κόστιζε ${extraItem} €. Πλήρωσε συνολικά ${bill} €. Πόσο κόστισε το κάθε τετράδιο σε ευρώ;`,
      correctAnswer: String(itemCost),
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: ${count} · x ＋ ${extraItem} ＝ ${bill} (όπου x η τιμή ανά τετράδιο)
          </div>
          <div>1. Μεταφορά όρου: ${count} · x ＝ ${bill} － ${extraItem} ➔ ${count} · x ＝ ${bill - extraItem}.</div>
          <div class="flex items-center flex-wrap pt-1">
            2. Διαίρεση με το ${count} σε μορφή κλάσματος: x ＝ ${fracHtml(bill - extraItem, count)} ＝ ${itemCost} €.
          </div>
        </div>
      `,
    };
  };
});

// Θέση 5: Προβλήματα Διαδοχικών Αριθμών
const POOL_5_CONSECUTIVE = Array.from({ length: 10 }, (_, i) => {
  return () => {
    const startNum = 11 + i * 3;
    const sum = 3 * startNum + 3;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΡΙΘΜΟΙ',
      question: `Το άθροισμα τριών διαδοχικών ακεραίων αριθμών είναι ${sum}. Ποιος είναι ο μικρότερος από τους τρεις αριθμούς;`,
      correctAnswer: String(startNum),
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: x ＋ (x ＋ 1) ＋ (x ＋ 2) ＝ ${sum} (όπου x ο μικρότερος)
          </div>
          <div>1. Αναγωγή ομοίων όρων: 3 · x ＋ 3 ＝ ${sum} ➔ 3 · x ＝ ${sum - 3}.</div>
          <div class="flex items-center flex-wrap pt-1">
            2. Διαίρεση με το 3 σε μορφή κλάσματος: x ＝ ${fracHtml(sum - 3, 3)} ＝ ${startNum}.
          </div>
        </div>
      `,
    };
  };
});

// Θέση 6: Προβλήματα Αποταμίευσης
const POOL_6_SAVINGS = Array.from({ length: 10 }, (_, i) => {
  return () => {
    const weekly = randInt(10, 25);
    const initial = randInt(20, 50);
    const weeks = randInt(4, 9);
    const goal = weekly * weeks + initial;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΠΟΤΑΜΙΕΥΣΗ',
      question: `Η Ελένη έχει ήδη ${initial} € και αποταμιεύει ${weekly} € κάθε εβδομάδα. Σε πόσες εβδομάδες θα έχει συγκεντρώσει ${goal} €;`,
      correctAnswer: String(weeks),
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: ${weekly} · x ＋ ${initial} ＝ ${goal} (όπου x οι εβδομάδες)
          </div>
          <div>1. Μεταφορά όρου: ${weekly} · x ＝ ${goal} － ${initial} ➔ ${weekly} · x ＝ ${goal - initial}.</div>
          <div class="flex items-center flex-wrap pt-1">
            2. Διαίρεση με το ${weekly} σε μορφή κλάσματος: x ＝ ${fracHtml(goal - initial, weekly)} ＝ ${weeks} εβδομάδες.
          </div>
        </div>
      `,
    };
  };
});

// Θέση 7: Προβλήματα Ισοσκελούς Τριγώνου
const POOL_7_TRIANGLE = Array.from({ length: 10 }, (_, i) => {
  return () => {
    const base = 10 + i * 2;
    const leg = randInt(12, 22);
    const perimeter = 2 * leg + base;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ',
      question: `Ένα ισοσκελές τρίγωνο έχει βάση ${base} cm και περίμετρο ${perimeter} cm. Πόσα εκατοστά είναι το μήκος καθεμιάς από τις δύο ίσες πλευρές του;`,
      correctAnswer: String(leg),
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: 2 · x ＋ ${base} ＝ ${perimeter} (όπου x η ίση πλευρά)
          </div>
          <div>1. Μεταφορά όρου: 2 · x ＝ ${perimeter} － ${base} ➔ 2 · x ＝ ${perimeter - base}.</div>
          <div class="flex items-center flex-wrap pt-1">
            2. Διαίρεση με το 2 σε μορφή κλάσματος: x ＝ ${fracHtml(perimeter - base, 2)} ＝ ${leg} cm.
          </div>
        </div>
      `,
    };
  };
});

// Θέση 8: Προβλήματα Επαγγελματικής Αμοιβής (Πάγιο + Ωρομίσθιο)
const POOL_8_TECHNICIAN = Array.from({ length: 10 }, (_, i) => {
  return () => {
    const callout = 20 + i * 2;
    const hourly = randInt(12, 18);
    const hours = randInt(3, 7);
    const pay = hourly * hours + callout;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΥΠΗΡΕΣΙΕΣ',
      question: `Ένας ηλεκτρολόγος χρεώνει ${callout} € για την επίσκεψη και ${hourly} € για κάθε ώρα εργασίας. Αν η συνολική αμοιβή του ήταν ${pay} €, πόσες ώρες εργάστηκε;`,
      correctAnswer: String(hours),
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: ${hourly} · x ＋ ${callout} ＝ ${pay} (όπου x οι ώρες εργασίας)
          </div>
          <div>1. Μεταφορά όρου: ${hourly} · x ＝ ${pay} － ${callout} ➔ ${hourly} · x ＝ ${pay - callout}.</div>
          <div class="flex items-center flex-wrap pt-1">
            2. Διαίρεση με το ${hourly} σε μορφή κλάσματος: x ＝ ${fracHtml(pay - callout, hourly)} ＝ ${hours} ώρες.
          </div>
        </div>
      `,
    };
  };
});

// Θέση 9: Προβλήματα Κατανάλωσης (Δεξαμενή / Μείωση)
const POOL_9_CONSUMPTION = Array.from({ length: 10 }, (_, i) => {
  return () => {
    const burnRate = 4 + (i % 3);
    const hours = randInt(5, 12);
    const remaining = randInt(20, 50);
    const initial = remaining + burnRate * hours;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΤΑΝΑΛΩΣΗ',
      question: `Μια δεξαμενή περιείχε αρχικά ${initial} λίτρα καυσίμου και ο καυστήρας καταναλώνει ${burnRate} λίτρα ανά ώρα. Μετά από πόσες ώρες θα απομένουν ${remaining} λίτρα;`,
      correctAnswer: String(hours),
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: ${initial} － ${burnRate} · x ＝ ${remaining} (όπου x οι ώρες)
          </div>
          <div>1. Μεταφορά όρων: －${burnRate} · x ＝ ${remaining} － ${initial} ➔ －${burnRate} · x ＝ －${initial - remaining}.</div>
          <div class="flex items-center flex-wrap pt-1">
            2. Διαίρεση με το －${burnRate} σε μορφή κλάσματος: x ＝ ${fracHtml(initial - remaining, burnRate)} ＝ ${hours} ώρες.
          </div>
        </div>
      `,
    };
  };
});

// Θέση 10: Προβλήματα Συσκευασίας / Καταμερισμού
const POOL_10_PACKAGING = Array.from({ length: 10 }, (_, i) => {
  return () => {
    const capacity = 5 + (i % 4);
    const boxCount = randInt(8, 16);
    const leftOver = randInt(3, 8);
    const totalItems = capacity * boxCount + leftOver;
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΣΥΣΚΕΥΑΣΙΑ',
      question: `Μαζεύτηκαν ${totalItems} κιλά κεράσια. Κρατήθηκαν ${leftOver} κιλά και τα υπόλοιπα συσκευάστηκαν σε τελάρα των ${capacity} κιλών. Πόσα τελάρα γέμισαν;`,
      correctAnswer: String(boxCount),
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: ${capacity} · x ＋ ${leftOver} ＝ ${totalItems} (όπου x τα τελάρα)
          </div>
          <div>1. Μεταφορά όρου: ${capacity} · x ＝ ${totalItems} － ${leftOver} ➔ ${capacity} · x ＝ ${totalItems - leftOver}.</div>
          <div class="flex items-center flex-wrap pt-1">
            2. Διαίρεση με το ${capacity} σε μορφή κλάσματος: x ＝ ${fracHtml(totalItems - leftOver, capacity)} ＝ ${boxCount} τελάρα.
          </div>
        </div>
      `,
    };
  };
});

// Θέση 11: Προβλήματα Πολλαπλάσιων Ποσοτήτων (MCQ)
const POOL_11_MULTIPLES_MCQ = Array.from({ length: 10 }, (_, i) => {
  return () => {
    const mult = 3 + (i % 3);
    const diff = randInt(5, 12);
    const x = randInt(7, 15);
    const target = mult * x - diff;
    const correct = String(x);
    const options = makeUniqueOptions(correct, [
      String(x + 2),
      String(x - 2),
      String(x + 5),
    ]);
    return {
      type: 'mcq',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΡΙΘΜΟΙ',
      question: `Αν από το ${mult === 3 ? 'τριπλάσιο' : mult === 4 ? 'τετραπλάσιο' : 'πενταπλάσιο'} ενός αριθμού αφαιρέσουμε το ${diff}, βρίσκουμε ${target}. Ποιος είναι ο αριθμός;`,
      options,
      correctAnswer: correct,
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: ${mult} · x － ${diff} ＝ ${target} (όπου x ο αριθμός)
          </div>
          <div>1. Μεταφορά όρου: ${mult} · x ＝ ${target} ＋ ${diff} ➔ ${mult} · x ＝ ${target + diff}.</div>
          <div class="flex items-center flex-wrap pt-1">
            2. Διαίρεση με το ${mult} σε μορφή κλάσματος: x ＝ ${fracHtml(target + diff, mult)} ＝ ${x}.
          </div>
        </div>
      `,
    };
  };
});

// Θέση 12: Προβλήματα Επιμερισμού Χρημάτων (MCQ)
const POOL_12_MONEY_SPLIT_MCQ = Array.from({ length: 10 }, (_, i) => {
  return () => {
    const extra = 10 + i * 2;
    const shareB = randInt(25, 45);
    const shareA = shareB + extra;
    const total = shareA + shareB;
    const correct = String(shareB);
    const options = makeUniqueOptions(correct, [
      String(shareB + 10),
      String(shareB - 5),
      String(shareA),
    ]);
    return {
      type: 'mcq',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΤΑΜΕΡΙΣΜΟΣ',
      question: `Δύο αδέλφια μοιράστηκαν ${total} €. Ο μεγαλύτερος πήρε ${extra} € περισσότερα από τον μικρότερο. Πόσα ευρώ πήρε ο μικρότερος αδελφός;`,
      options,
      correctAnswer: correct,
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: x ＋ (x ＋ ${extra}) ＝ ${total} (όπου x το μερίδιο του μικρότερου)
          </div>
          <div>1. Αναγωγή ομοίων όρων: 2 · x ＋ ${extra} ＝ ${total} ➔ 2 · x ＝ ${total - extra}.</div>
          <div class="flex items-center flex-wrap pt-1">
            2. Διαίρεση με το 2 σε μορφή κλάσματος: x ＝ ${fracHtml(total - extra, 2)} ＝ ${shareB} €.
          </div>
        </div>
      `,
    };
  };
});

// Συγκέντρωση των 12 δεξαμενών
const POOLS = [
  POOL_1_TRANSPORT,
  POOL_2_AGES,
  POOL_3_RECT_PERIMETER,
  POOL_4_SHOPPING,
  POOL_5_CONSECUTIVE,
  POOL_6_SAVINGS,
  POOL_7_TRIANGLE,
  POOL_8_TECHNICIAN,
  POOL_9_CONSUMPTION,
  POOL_10_PACKAGING,
  POOL_11_MULTIPLES_MCQ,
  POOL_12_MONEY_SPLIT_MCQ,
];

export default function ProblimataEksisoseonAsk() {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const generateQuestions = () => {
    const selected = POOLS.map((pool, idx) => {
      const randomGen = pool[Math.floor(Math.random() * pool.length)];
      return {
        id: idx + 1,
        ...randomGen(),
      };
    });

    setQuestions(selected);
    setUserAnswers({});
    setIsSubmitted(false);
    setScore(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    generateQuestions();
  }, []);

  const handleInputChange = (id, val) => {
    if (isSubmitted) return;
    let clean = val.replace('.', ',');
    clean = clean.replace(/[^0-9,/,\-x,X,*,+]/g, '');

    if (clean.length > 14) return;

    setUserAnswers((prev) => ({ ...prev, [id]: clean }));
  };

  const handleMCQSelect = (id, option) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [id]: option }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitted) return;

    let totalCorrect = 0;
    questions.forEach((q) => {
      let userAns = (userAnswers[q.id] || '')
        .trim()
        .toUpperCase()
        .replace(/\s+/g, '')
        .replace(/·/g, '*')
        .replace(/,/g, '.');

      let correctAns = q.correctAnswer
        .trim()
        .toUpperCase()
        .replace(/\s+/g, '')
        .replace(/·/g, '*')
        .replace(/,/g, '.');

      userAns = userAns.replace(/^\+/, '');
      correctAns = correctAns.replace(/^\+/, '');

      if (userAns === correctAns) {
        totalCorrect += 1;
      }
    });

    setScore(totalCorrect);
    setIsSubmitted(true);
  };

  const answeredCount = Object.keys(userAnswers).filter(
    (k) => userAnswers[k] && userAnswers[k].trim() !== ''
  ).length;

  const scorePercentage = Math.round((score / 12) * 100);

  return (
    <Layout
      title="Ασκήσεις: Προβλήματα με Εξισώσεις αx + β = γ | Α' Γυμνασίου"
      description="12 επιλεγμένα ρεαλιστικά προβλήματα καθημερινής ζωής και γεωμετρίας με εξισώσεις 1ου βαθμού για την Α' Γυμνασίου."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      hideFooter={true}
      actionButton={
        <Link
          href="/a-gymnasiou/34-problimata-eksisoseon"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs sm:text-sm transition-all shadow-md"
        >
          <span>📖</span>
          <span>ΘΕΩΡΙΑ</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 pb-32 sm:pb-36 space-y-8">
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 32 • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Προβλήματα με Εξισώσεις α·x ＋ β ＝ γ
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              Επίλυσε τα παρακάτω 12 ρεαλιστικά προβλήματα από την καθημερινή ζωή και τη γεωμετρία. Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικά την αρχική εξίσωση και τη λύση κάθε προβλήματος.
            </p>
          </div>
        </section>

        {/* Φόρμα Ασκήσεων */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6">
            {questions.map((q) => {
              const userAns = userAnswers[q.id] || '';
              const cleanUser = userAns
                .trim()
                .toUpperCase()
                .replace(/\s+/g, '')
                .replace(/·/g, '*')
                .replace(/,/g, '.');

              const cleanCorrect = q.correctAnswer
                .trim()
                .toUpperCase()
                .replace(/\s+/g, '')
                .replace(/·/g, '*')
                .replace(/,/g, '.');

              const isCorrect = isSubmitted && cleanUser === cleanCorrect;

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all shadow-sm flex flex-col justify-between space-y-4 border-amber-200/80 bg-amber-50/10 ${
                    isSubmitted
                      ? isCorrect
                        ? 'border-emerald-400 ring-2 ring-emerald-100'
                        : 'border-rose-400 ring-2 ring-rose-100'
                      : 'hover:border-indigo-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg font-extrabold text-xs sm:text-sm bg-amber-100 text-amber-900">
                          {q.id}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                          ΠΡΟΒΛΗΜΑ
                        </span>
                      </div>
                      <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase bg-slate-100 px-2.5 py-1 rounded-md">
                        {q.topic}
                      </span>
                    </div>

                    <div
                      className="text-slate-900 font-semibold text-base sm:text-lg leading-snug"
                      dangerouslySetInnerHTML={{ __html: q.question }}
                    />
                  </div>

                  {/* Input ή MCQ */}
                  <div className="space-y-2 pt-2">
                    {q.type === 'input' ? (
                      <div className="relative max-w-xs">
                        <input
                          type="text"
                          inputMode="text"
                          maxLength={14}
                          disabled={isSubmitted}
                          placeholder="Γράψε την απάντηση..."
                          value={userAns}
                          onChange={(e) => handleInputChange(q.id, e.target.value)}
                          className={`w-full h-11 px-4 text-base font-bold rounded-xl border transition-all outline-none font-mono ${
                            isSubmitted
                              ? isCorrect
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                                : 'bg-rose-50 border-rose-500 text-rose-950'
                              : 'bg-slate-50 border-slate-300 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-slate-900'
                          }`}
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = userAns === opt;
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              disabled={isSubmitted}
                              onClick={() => handleMCQSelect(q.id, opt)}
                              className={`h-11 px-3 text-xs sm:text-sm font-bold rounded-xl border text-left flex items-center justify-between transition-all touch-manipulation active:scale-[0.98] ${
                                isSelected
                                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                              } ${isSubmitted ? 'cursor-default' : ''}`}
                            >
                              <span dangerouslySetInnerHTML={{ __html: opt }} />
                              {isSelected && <span>✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Feedback & Αναλυτική Λύση */}
                    {isSubmitted && (
                      <div
                        className={`p-4 rounded-xl text-xs sm:text-sm space-y-3 mt-3 border ${
                          isCorrect
                            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                            : 'bg-rose-50/80 border-rose-200 text-rose-950'
                        }`}
                      >
                        {isCorrect ? (
                          <div className="font-black flex items-center gap-1.5 text-emerald-700 text-sm sm:text-base">
                            <span>✅</span>
                            <span>ΣΩΣΤΟ</span>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <div className="font-black flex items-center gap-1.5 text-rose-700 text-sm sm:text-base">
                              <span>❌</span>
                              <span>ΛΑΘΟΣ</span>
                            </div>
                            <div className="text-xs sm:text-sm font-bold text-slate-800 bg-white/90 py-1.5 px-3 rounded-lg border border-rose-200 inline-block font-mono">
                              ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ:&nbsp;&nbsp;<span className="text-emerald-700 font-black" dangerouslySetInnerHTML={{ __html: q.correctAnswer }} />
                            </div>
                          </div>
                        )}

                        <div
                          className="text-slate-700 leading-loose font-normal pt-2 border-t border-slate-200/60"
                          dangerouslySetInnerHTML={{ __html: q.solution }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Κουμπιά Ελέγχου / Ανανέωσης εντός σελίδας */}
          <div className="flex justify-center pt-4">
            {!isSubmitted ? (
              <button
                type="submit"
                disabled={answeredCount === 0}
                className="w-full sm:w-auto min-w-[260px] h-13 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm sm:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>🎯</span>
                <span>ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuestions}
                className="w-full sm:w-auto min-w-[260px] h-13 px-8 py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>🔄</span>
                <span>ΝΕΕΣ ΑΣΚΗΣΕΙΣ</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* FIXED BOTTOM SCORE BAR (12 Ασκήσεις) */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3 px-4 sm:px-8 shadow-2xl">
        <div className="max-w-[1920px] 2xl:max-w-[2400px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-6">
            <div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                {isSubmitted ? 'ΤΕΛΙΚΟ ΣΚΟΡ' : 'ΠΡΟΟΔΟΣ'}
              </div>
              <div className="text-base sm:text-xl font-black text-amber-400 font-mono">
                {isSubmitted ? `${score} / 12` : `${answeredCount} / 12`}
              </div>
            </div>

            {isSubmitted && (
              <div className="border-l border-slate-700 pl-4 sm:pl-6 hidden xs:block">
                <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                  ΕΠΙΤΥΧΙΑ
                </div>
                <div
                  className={`text-base sm:text-xl font-black font-mono ${
                    scorePercentage >= 80
                      ? 'text-emerald-400'
                      : scorePercentage >= 50
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {scorePercentage}%
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={generateQuestions}
              className="px-3 sm:px-4 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold text-xs sm:text-sm rounded-xl border border-slate-700 transition flex items-center gap-1.5"
            >
              <span>🔄</span>
              <span className="hidden sm:inline">ΝΕΕΣ ΑΣΚΗΣΕΙΣ</span>
            </button>

            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={answeredCount === 0}
                className="px-4 sm:px-6 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <span>🎯</span>
                <span>ΕΛΕΓΧΟΣ</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuestions}
                className="px-4 sm:px-6 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition"
              >
                ΕΠΑΝΑΛΗΨΗ
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
