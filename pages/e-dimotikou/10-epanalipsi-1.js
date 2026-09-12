// pages/e-dimotikou/10-epanalipsi-1.js
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';

// --- ΒΟΗΘΗΤΙΚΕΣ ΜΑΘΗΜΑΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ --- //

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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

function lcm(a, b) {
  if (a === 0 || b === 0) return 0;
  return (a * b) / gcd(a, b);
}

function getDivisors(n) {
  const divs = [];
  for (let i = 1; i <= n; i++) {
    if (n % i === 0) divs.push(i);
  }
  return divs;
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// --- ΔΕΞΑΜΕΝΕΣ ΕΡΩΤΗΣΕΩΝ ΑΝΑ ΚΕΦΑΛΑΙΟ (10+ ΔΙΑΦΟΡΕΤΙΚΟΙ ΤΥΠΟΙ ΑΝΑ ΚΕΦΑΛΑΙΟ) --- //

// ΚΕΦΑΛΑΙΟ 1: Η Έννοια του Κλάσματος
const poolCh1 = [
  () => {
    const den = [5, 6, 8, 10][getRandomInt(0, 3)];
    const num = getRandomInt(2, den - 1);
    const step = getRandomInt(6, 12);
    const total = den * step;
    const spent = num * step;
    const rem = total - spent;
    return {
      title: 'ΚΕΦ. 1 • ΜΕΡΟΣ ΣΥΝΟΛΟΥ & ΥΠΟΛΟΙΠΟ',
      type: 'input',
      correct: rem,
      unit: 'τριαντάφυλλα',
      prompt: `Ένα ανθοπωλείο παρέλαβε ${total} τριαντάφυλλα. Πούλησε τα ${num}/${den} των τριαντάφυλλων. Πόσα τριαντάφυλλα έμειναν απούλητα;`,
      explanation: `Το 1/${den} είναι: ${total} ： ${den} ＝ ${step}. Τα ${num}/${den} είναι: ${step} · ${num} ＝ ${spent}. Απομένουν: ${total} － ${spent} ＝ ${rem} τριαντάφυλλα.`
    };
  },
  () => {
    const den = [4, 7, 9, 12][getRandomInt(0, 3)];
    const num = getRandomInt(2, den - 1);
    const step = getRandomInt(8, 15);
    const part = num * step;
    const total = den * step;
    return {
      title: 'ΚΕΦ. 1 • ΑΝΑΣΤΡΟΦΟΣ ΥΠΟΛΟΓΙΣΜΟΣ',
      type: 'input',
      correct: total,
      unit: 'σελίδες',
      prompt: `Ο Νίκος διάβασε τα ${num}/${den} ενός βιβλίου, δηλαδή ακριβώς ${part} σελίδες. Πόσες σελίδες έχει ολόκληρο το βιβλίο;`,
      explanation: `Το 1/${den} είναι: ${part} ： ${num} ＝ ${step} σελίδες. Ολόκληρο το βιβλίο (${den}/${den}) έχει: ${step} · ${den} ＝ ${total} σελίδες.`
    };
  },
  () => {
    const den = [3, 4, 5, 7, 8][getRandomInt(0, 4)];
    const whole = getRandomInt(3, 6);
    const rem = getRandomInt(1, den - 1);
    const num = whole * den + rem;
    return {
      title: 'ΚΕΦ. 1 • ΚΑΤΑΧΡΗΣΤΙΚΟ ΣΕ ΜΕΙΚΤΟ',
      type: 'input',
      correct: whole,
      unit: 'ακέραιες μονάδες',
      prompt: `Γράψε το καταχρηστικό κλάσμα ${num}/${den} ως μεικτό αριθμό. Πόσες είναι οι ακέραιες μονάδες του;`,
      explanation: `Εκτελούμε τη διαίρεση ${num} ： ${den} ＝ ${whole} (υπόλοιπο ${rem}). Άρα ο μεικτός αριθμός έχει ${whole} ακέραιες μονάδες.`
    };
  },
  () => {
    const den = [6, 8, 9, 11][getRandomInt(0, 3)];
    const targetWhole = getRandomInt(2, 4);
    const missing = getRandomInt(2, den - 2);
    const currentNum = targetWhole * den - missing;
    const distractors = [missing + 1, Math.max(1, missing - 1), den - missing].filter((d) => d !== missing);
    return {
      title: 'ΚΕΦ. 1 • ΣΥΜΠΛΗΡΩΣΗ ΑΚΕΡΑΙΟΥ',
      type: 'mcq',
      correct: String(missing),
      options: shuffleArray([missing, ...distractors.slice(0, 3)]).map(String),
      prompt: `Έχουμε το κλάσμα ${currentNum}/${den}. Πόσα μέρη (κλάσματα 1/${den}) λείπουν για να συμπληρωθεί ακριβώς ο ακέραιος ${targetWhole};`,
      explanation: `Ο ακέραιος ${targetWhole} γράφεται ως ${targetWhole * den}/${den}. Λείπουν: ${targetWhole * den} － ${currentNum} ＝ ${missing} μέρη.`
    };
  },
  () => {
    const liters = getRandomInt(5, 11);
    let bottles = getRandomInt(3, 8);
    if (bottles === liters) bottles += 1;
    const correct = `${liters}/${bottles}`;
    return {
      title: 'ΚΕΦ. 1 • ΠΗΛΙΚΟ ΔΙΑΙΡΕΣΗΣ',
      type: 'mcq',
      correct,
      options: shuffleArray([correct, `${bottles}/${liters}`, `${liters + 1}/${bottles}`, `${liters}/${bottles + 1}`]),
      prompt: `Μοιράζουμε ισότιμα ${liters} L λαδιού σε ${bottles} ίδια δοχεία. Ποιο κλάσμα εκφράζει την ακριβή ποσότητα κάθε δοχείου;`,
      explanation: `Το κλάσμα ως πηλίκο διαίρεσης του αριθμητή διά του παρονομαστή είναι: ${liters} ： ${bottles} ＝ ${correct} L.`
    };
  },
  () => {
    const candidates = [{ f: '5/8', v: 5 / 8 }, { f: '7/12', v: 7 / 12 }, { f: '4/6', v: 4 / 6 }];
    const chosen = candidates[getRandomInt(0, candidates.length - 1)];
    const lessers = ['3/8', '2/5', '4/10', '5/12'].filter((f) => f !== chosen.f);
    return {
      title: 'ΚΕΦ. 1 • ΣΥΓΚΡΙΣΗ ΜΕ ΤΟ 1/2',
      type: 'mcq',
      correct: chosen.f,
      options: shuffleArray([chosen.f, ...shuffleArray(lessers).slice(0, 3)]),
      prompt: `Ποιο από τα παρακάτω κλάσματα είναι μεγαλύτερο από το μισό ( ＞ 1/2 );`,
      explanation: `Ένα κλάσμα είναι ＞ 1/2 αν ο αριθμητής του είναι μεγαλύτερος από το μισό του παρονομαστή του. Στο ${chosen.f}, ο αριθμητής υπερβαίνει το μισό του παρονομαστή.`
    };
  },
  () => {
    const km = 120;
    const a = (km / 4) * 3; // 90
    const b = (km / 5) * 4; // 96
    const diff = b - a; // 6
    return {
      title: 'ΚΕΦ. 1 • ΠΡΟΒΛΗΜΑ ΣΥΓΚΡΙΣΗΣ ΜΕΡΩΝ',
      type: 'mcq',
      correct: `${diff} km`,
      options: shuffleArray([`${diff} km`, `${diff + 4} km`, `${diff + 6} km`, `${diff + 8} km`]),
      prompt: `Σε διαδρομή ${km} km, το όχημα Α διένυσε τα 3/4 και το όχημα Β τα 4/5. Πόσα χιλιόμετρα παραπάνω διένυσε το όχημα Β;`,
      explanation: `Το όχημα Α διένυσε: (${km} ： 4) · 3 ＝ 90 km. Το όχημα Β: (${km} ： 5) · 4 ＝ 96 km. Διαφορά: 96 － 90 ＝ ${diff} km.`
    };
  },
  () => {
    const d = [6, 8, 10][getRandomInt(0, 2)];
    const whole = getRandomInt(2, 4);
    const totalParts = whole * d;
    return {
      title: 'ΚΕΦ. 1 • ΑΚΕΡΑΙΟΣ ΣΕ ΚΛΑΣΜΑ',
      type: 'input',
      correct: totalParts,
      unit: 'αριθμητής',
      prompt: `Αν γράψουμε τον ακέραιο ${whole} ως κλάσμα με παρονομαστή το ${d} (${whole} ＝ x/${d}), ποιος είναι ο αριθμητής x;`,
      explanation: `Ο ακέραιος πολλαπλασιάζεται με τον παρονομαστή: x ＝ ${whole} · ${d} ＝ ${totalParts}.`
    };
  },
  () => {
    const num = getRandomInt(2, 5);
    const den = num + getRandomInt(2, 4);
    return {
      title: 'ΚΕΦ. 1 • ΕΙΔΟΣ ΚΛΑΣΜΑΤΟΣ',
      type: 'mcq',
      correct: 'Γνήσιο ( ＜ 1 )',
      options: ['Γνήσιο ( ＜ 1 )', 'Καταχρηστικό ( ＞ 1 )', 'Ίσο με τη μονάδα ( ＝ 1 )', 'Ακέραιο'],
      prompt: `Πώς χαρακτηρίζεται το κλάσμα ${num}/${den};`,
      explanation: `Επειδή ο αριθμητής (${num}) είναι μικρότερος από τον παρονομαστή (${den}), το κλάσμα είναι γνήσιο ( ＜ 1 ).`
    };
  },
  () => {
    const den = getRandomInt(5, 9);
    const num = den + getRandomInt(2, 5);
    return {
      title: 'ΚΕΦ. 1 • ΕΙΔΟΣ ΚΛΑΣΜΑΤΟΣ',
      type: 'mcq',
      correct: 'Καταχρηστικό ( ＞ 1 )',
      options: ['Γνήσιο ( ＜ 1 )', 'Καταχρηστικό ( ＞ 1 )', 'Ίσο με τη μονάδα ( ＝ 1 )', 'Μηδενικό'],
      prompt: `Πώς χαρακτηρίζεται το κλάσμα ${num}/${den};`,
      explanation: `Επειδή ο αριθμητής (${num}) είναι μεγαλύτερος από τον παρονομαστή (${den}), το κλάσμα είναι καταχρηστικό ( ＞ 1 ).`
    };
  }
];

// ΚΕΦΑΛΑΙΟ 2: Ισοδύναμα Κλάσματα
const poolCh2 = [
  () => {
    const [num, den] = [[2, 3], [3, 4], [3, 5], [4, 7], [5, 6]][getRandomInt(0, 4)];
    const k = getRandomInt(4, 8);
    return {
      title: 'ΚΕΦ. 2 • ΕΥΡΕΣΗ ΑΓΝΩΣΤΟΥ ΑΡΙΘΜΗΤΗ',
      type: 'input',
      correct: num * k,
      unit: 'τιμή x',
      prompt: `Αν ισχύει ${num}/${den} ＝ x/${den * k}, ποιος αριθμός είναι το x;`,
      explanation: `Ο παρονομαστής πολλαπλασιάστηκε με το ${k}. Άρα και ο αριθμητής: x ＝ ${num} · ${k} ＝ ${num * k}.`
    };
  },
  () => {
    const [num, den] = [[3, 8], [4, 9], [5, 7], [6, 11]][getRandomInt(0, 3)];
    const m = getRandomInt(3, 7);
    return {
      title: 'ΚΕΦ. 2 • ΕΥΡΕΣΗ ΑΓΝΩΣΤΟΥ ΠΑΡΟΝΟΜΑΣΤΗ',
      type: 'input',
      correct: den * m,
      unit: 'τιμή y',
      prompt: `Αν ισχύει ${num}/${den} ＝ ${num * m}/y, ποιος αριθμός είναι το y;`,
      explanation: `Ο αριθμητής πολλαπλασιάστηκε με το ${m}. Άρα και ο παρονομαστής: y ＝ ${den} · ${m} ＝ ${den * m}.`
    };
  },
  () => {
    const a = getRandomInt(3, 6);
    const b = getRandomInt(7, 10);
    const mult = getRandomInt(2, 4);
    const prod = a * (b * mult);
    return {
      title: 'ΚΕΦ. 2 • ΧΙΑΣΤΙ ΓΙΝΟΜΕΝΑ',
      type: 'mcq',
      correct: String(prod),
      options: shuffleArray([prod, prod + a, prod - b, prod + 10]).map(String),
      prompt: `Στα ισοδύναμα κλάσματα ${a}/${b} ＝ ${a * mult}/${b * mult}, πόσο ισούται το κοινό χιαστί γινόμενο;`,
      explanation: `Τα χιαστί γινόμενα είναι απολύτως ίσα: ${a} · ${b * mult} ＝ ${prod} και ${b} · ${a * mult} ＝ ${prod}.`
    };
  },
  () => {
    const base = '3/5';
    const correct = '18/30';
    return {
      title: 'ΚΕΦ. 2 • ΑΝΑΓΝΩΡΙΣΗ ΙΣΟΔΥΝΑΜΟΥ',
      type: 'mcq',
      correct,
      options: shuffleArray([correct, '15/20', '12/25', '16/30']),
      prompt: `Ποιο από τα παρακάτω κλάσματα είναι ισοδύναμο με το ${base};`,
      explanation: `Πολλαπλασιάζοντας και τους δύο όρους του 3/5 με το 6 προκύπτει: (3 · 6) / (5 · 6) ＝ 18/30.`
    };
  },
  () => {
    const correct = '14/20';
    return {
      title: 'ΚΕΦ. 2 • ΕΝΤΟΠΙΣΜΟΣ ΜΗ ΙΣΟΔΥΝΑΜΟΥ',
      type: 'mcq',
      correct,
      options: shuffleArray(['6/9', '10/15', '16/24', correct]),
      prompt: `Ποιο από τα παρακάτω κλάσματα ΔΕΝ είναι ισοδύναμο με το 2/3;`,
      explanation: `Τα 6/9, 10/15, 16/24 προκύπτουν πολλαπλασιάζοντας το 2/3 με 3, 5, 8. Το 14/20 απλοποιείται σε 7/10 ≠ 2/3.`
    };
  },
  () => {
    const numA = 12;
    const denA = 20;
    const denB = 40;
    const numB = 24;
    return {
      title: 'ΚΕΦ. 2 • ΠΡΟΒΛΗΜΑ ΑΝΑΛΟΓΙΑΣ',
      type: 'input',
      correct: numB,
      unit: 'μέρη',
      prompt: `Μια δεξαμενή περιέχει ${numA}/${denA} νερό. Μια ίδια δεξαμενή έχει χωριστεί σε ${denB} ίσα μέρη. Πόσα μέρη πρέπει να γεμίσουν ώστε να έχει την ίδια ποσότητα;`,
      explanation: `Ζητείται ισοδύναμο: ${numA}/${denA} ＝ x/${denB}. Επειδή ${denA} · 2 ＝ ${denB}, έχουμε x ＝ ${numA} · 2 ＝ ${numB}.`
    };
  },
  () => {
    const num = 4;
    const den = 9;
    const factor = 7;
    return {
      title: 'ΚΕΦ. 2 • ΔΙΑΠΛΑΤΥΝΣΗ',
      type: 'input',
      correct: num * factor,
      unit: 'νέος αριθμητής',
      prompt: `Αν διαπλατύνουμε το κλάσμα ${num}/${den} πολλαπλασιάζοντας με το ${factor}, ποιος είναι ο νέος αριθμητής;`,
      explanation: `Στη διαπλάτυνση πολλαπλασιάζουμε και τον αριθμητή: ${num} · ${factor} ＝ ${num * factor}.`
    };
  },
  () => {
    const num = 5;
    const den = 8;
    const factor = 6;
    return {
      title: 'ΚΕΦ. 2 • ΔΙΑΠΛΑΤΥΝΣΗ',
      type: 'input',
      correct: den * factor,
      unit: 'νέος παρονομαστής',
      prompt: `Αν διαπλατύνουμε το κλάσμα ${num}/${den} με το ${factor}, ποιος είναι ο νέος παρονομαστής;`,
      explanation: `Στη διαπλάτυνση πολλαπλασιάζουμε και τον παρονομαστή: ${den} · ${factor} ＝ ${den * factor}.`
    };
  },
  () => {
    return {
      title: 'ΚΕΦ. 2 • ΕΛΕΓΧΟΣ ΙΣΟΤΗΤΑΣ',
      type: 'mcq',
      correct: '4/6 ＝ 10/15',
      options: shuffleArray(['4/6 ＝ 10/15', '3/5 ＝ 9/20', '2/7 ＝ 6/14', '5/8 ＝ 15/20']),
      prompt: `Ποιο από τα παρακάτω ζεύγη αποτελείται από πράγματι ισοδύναμα κλάσματα;`,
      explanation: `Στο 4/6 και 10/15, τα χιαστί γινόμενα είναι 4 · 15 ＝ 60 και 6 · 10 ＝ 60, άρα είναι ισοδύναμα.`
    };
  },
  () => {
    const k = 5;
    return {
      title: 'ΚΕΦ. 2 • ΠΟΛΛΑΠΛΑΣΙΑΣΤΗΣ ΔΙΑΠΛΑΤΥΝΣΗΣ',
      type: 'input',
      correct: k,
      unit: 'συντελεστής k',
      prompt: `Με ποιον αριθμό πολλαπλασιάστηκαν οι όροι του 7/9 για να προκύψει το ισοδύναμο 35/45;`,
      explanation: `Διαιρούμε τους αντίστοιχους όρους: 35 ： 7 ＝ 5 (και 45 ： 9 ＝ 5).`
    };
  }
];

// ΚΕΦΑΛΑΙΟ 3: Απλοποίηση Κλάσματος & Ανάγωγη Μορφή
const poolCh3 = [
  () => {
    const num = 18;
    const den = 24;
    const d = gcd(num, den);
    return {
      title: 'ΚΕΦ. 3 • ΑΝΑΓΩΓΟ ΚΛΑΣΜΑ (ΑΡΙΘΜΗΤΗΣ)',
      type: 'input',
      correct: num / d,
      unit: 'αριθμητής',
      prompt: `Απλοποίησε πλήρως το κλάσμα ${num}/${den} στην ανάγωγη μορφή του. Ποιος είναι ο νέος αριθμητής;`,
      explanation: `Ο ΜΚΔ(${num}, ${den}) είναι το ${d}. Διαιρούμε: ${num} ： ${d} ＝ ${num / d}.`
    };
  },
  () => {
    const num = 24;
    const den = 36;
    const d = gcd(num, den);
    return {
      title: 'ΚΕΦ. 3 • ΑΝΑΓΩΓΟ ΚΛΑΣΜΑ (ΠΑΡΟΝΟΜΑΣΤΗΣ)',
      type: 'input',
      correct: den / d,
      unit: 'παρονομαστής',
      prompt: `Απλοποίησε πλήρως το κλάσμα ${num}/${den} στην ανάγωγη μορφή του. Ποιος είναι ο νέος παρονομαστής;`,
      explanation: `Ο ΜΚΔ(${num}, ${den}) είναι το ${d}. Διαιρούμε: ${den} ： ${d} ＝ ${den / d}.`
    };
  },
  () => {
    const chosen = '7/15';
    const reds = ['6/18', '14/21', '15/25', '12/28'];
    return {
      title: 'ΚΕΦ. 3 • ΑΝΑΓΝΩΡΙΣΗ ΑΝΑΓΩΓΟΥ',
      type: 'mcq',
      correct: chosen,
      options: shuffleArray([chosen, ...shuffleArray(reds).slice(0, 3)]),
      prompt: `Ποιο από τα παρακάτω κλάσματα είναι ΑΝΑΓΩΓΟ;`,
      explanation: `Το ${chosen} είναι ανάγωγο γιατί ο αριθμητής και ο παρονομαστής έχουν ΜΚΔ ＝ 1.`
    };
  },
  () => {
    const chosen = '9/21';
    const irrs = ['5/12', '7/16', '8/15', '11/20'];
    return {
      title: 'ΚΕΦ. 3 • ΕΝΤΟΠΙΣΜΟΣ ΜΗ ΑΝΑΓΩΓΟΥ',
      type: 'mcq',
      correct: chosen,
      options: shuffleArray([chosen, ...shuffleArray(irrs).slice(0, 3)]),
      prompt: `Ποιο από τα παρακάτω κλάσματα ΔΕΝ είναι ανάγωγο;`,
      explanation: `Το ${chosen} απλοποιείται διά 3 σε 3/7, άρα δεν είναι ανάγωγο.`
    };
  },
  () => {
    const min = 45;
    return {
      title: 'ΚΕΦ. 3 • ΜΕΡΟΣ ΧΡΟΝΟΥ ΣΕ ΑΝΑΓΩΓΟ',
      type: 'mcq',
      correct: '3/4',
      options: shuffleArray(['3/4', '4/5', '2/3', '5/6']),
      prompt: `Τα ${min} min ποιο ανάγωγο κλάσμα της 1 ώρας (60 min) εκφράζουν;`,
      explanation: `45/60 απλοποιείται διά του ΜΚΔ(45, 60) ＝ 15 σε 3/4.`
    };
  },
  () => {
    const total = 30;
    const girls = 18;
    return {
      title: 'ΚΕΦ. 3 • ΠΡΟΒΛΗΜΑ ΑΝΑΓΩΓΗΣ ΜΟΡΦΗΣ',
      type: 'input',
      correct: 3,
      unit: 'αριθμητής',
      prompt: `Σε τάξη ${total} μαθητών, τα ${girls} είναι κορίτσια. Γράψε το κλάσμα των κοριτσιών στην ανάγωγη μορφή του. Ποιος είναι ο αριθμητής;`,
      explanation: `Το κλάσμα 18/30 απλοποιείται διά 6 σε 3/5. Ο αριθμητής είναι 3.`
    };
  },
  () => {
    const a = 48;
    const b = 64;
    const d = gcd(a, b);
    return {
      title: 'ΚΕΦ. 3 • ΔΙΑΙΡΕΤΗΣ ΑΠΛΟΠΟΙΗΣΗΣ',
      type: 'input',
      correct: d,
      unit: 'διαιρέτης (ΜΚΔ)',
      prompt: `Με ποιον μέγιστο αριθμό πρέπει να διαιρέσουμε τους όρους του ${a}/${b} για να γίνει ανάγωγο σε 1 βήμα;`,
      explanation: `Διαιρούμε με τον ΜΚΔ(${a}, ${b}) ＝ ${d}.`
    };
  },
  () => {
    return {
      title: 'ΚΕΦ. 3 • ΟΡΙΣΜΟΣ ΑΝΑΓΩΓΟΥ',
      type: 'mcq',
      correct: 'Έχουν ΜΚΔ ίσο με 1',
      options: ['Έχουν ΜΚΔ ίσο με 1', 'Είναι και οι δύο άρτιοι', 'Ο αριθμητής είναι 1', 'Έχουν κοινό διαιρέτη το 2'],
      prompt: `Πότε ένα κλάσμα ονομάζεται ανάγωγο;`,
      explanation: `Ένα κλάσμα λέγεται ανάγωγο όταν οι όροι του δεν έχουν άλλον κοινό διαιρέτη εκτός από το 1 (ΜΚΔ ＝ 1).`
    };
  },
  () => {
    const num = 14;
    const den = 35;
    return {
      title: 'ΚΕΦ. 3 • ΑΠΛΟΠΟΙΗΣΗ',
      type: 'mcq',
      correct: '2/5',
      options: shuffleArray(['2/5', '3/5', '2/7', '1/5']),
      prompt: `Ποιο είναι το ανάγωγο κλάσμα του ${num}/${den};`,
      explanation: `Διαιρώντας αριθμητή και παρονομαστή με το 7 προκύπτει 2/5.`
    };
  },
  () => {
    const num = 28;
    const den = 42;
    return {
      title: 'ΚΕΦ. 3 • ΑΝΑΓΩΓΟ ΚΛΑΣΜΑ',
      type: 'input',
      correct: 3,
      unit: 'παρονομαστής',
      prompt: `Απλοποίησε πλήρως το ${num}/${den}. Ποιος είναι ο νέος παρονομαστής;`,
      explanation: `Διαιρούμε με το 14: 28 ： 14 ＝ 2 και 42 ： 14 ＝ 3. Το ανάγωγο είναι 2/3.`
    };
  }
];

// ΚΕΦΑΛΑΙΟ 4: Αναγωγή στην Κλασματική Μονάδα
const poolCh4 = [
  () => {
    const num = 3;
    const den = 5;
    const unit = 24;
    const known = num * unit;
    return {
      title: 'ΚΕΦ. 4 • ΚΛΑΣΜΑΤΙΚΗ ΜΟΝΑΔΑ',
      type: 'input',
      correct: unit,
      unit: '€',
      prompt: `Αν τα ${num}/${den} ενός ποσού κοστίζουν ${known} €, πόσο κοστίζει το 1/${den};`,
      explanation: `Διαιρούμε με τον αριθμητή: ${known} ： ${num} ＝ ${unit} €.`
    };
  },
  () => {
    const num = 4;
    const den = 7;
    const unit = 15;
    const known = num * unit;
    const total = den * unit;
    return {
      title: 'ΚΕΦ. 4 • ΕΥΡΕΣΗ ΤΟΥ ΟΛΟΥ',
      type: 'input',
      correct: total,
      unit: '€',
      prompt: `Αν τα ${num}/${den} ενός ποδηλάτου κοστίζουν ${known} €, πόσο κοστίζει ολόκληρο το ποδήλατο;`,
      explanation: `1/${den} ＝ ${known} ： ${num} ＝ ${unit} €. Ολόκληρο (${den}/${den}): ${unit} · ${den} ＝ ${total} €.`
    };
  },
  () => {
    const num = 3;
    const den = 8;
    const unit = 12;
    const known = num * unit;
    const total = den * unit;
    return {
      title: 'ΚΕΦ. 4 • ΜΗΚΟΣ ΔΙΑΔΡΟΜΗΣ',
      type: 'mcq',
      correct: `${total} km`,
      options: shuffleArray([`${total} km`, `${total + unit} km`, `${total - unit} km`, `${total + 2 * unit} km`]),
      prompt: `Ένας δρομέας κάλυψε τα ${num}/${den} της διαδρομής, δηλαδή ${known} km. Πόσα km είναι όλη η διαδρομή;`,
      explanation: `1/${den} ＝ ${known} ： ${num} ＝ ${unit} km. Όλη η διαδρομή: ${unit} · ${den} ＝ ${total} km.`
    };
  },
  () => {
    const num1 = 2;
    const num2 = 5;
    const den = 6;
    const unit = 18;
    const known = num1 * unit;
    const target = num2 * unit;
    return {
      title: 'ΚΕΦ. 4 • ΑΠΟ ΤΟ ΜΕΡΟΣ ΣΤΟ ΑΛΛΟ ΜΕΡΟΣ',
      type: 'input',
      correct: target,
      unit: 'σελίδες',
      prompt: `Αν τα ${num1}/${den} ενός βιβλίου είναι ${known} σελίδες, πόσες σελίδες είναι τα ${num2}/${den};`,
      explanation: `1/${den} ＝ ${known} ： ${num1} ＝ ${unit} σελίδες. Τα ${num2}/${den}: ${unit} · ${num2} ＝ ${target} σελίδες.`
    };
  },
  () => {
    const num = 3;
    const den = 5;
    const remParts = den - num; // 2
    const unit = 25;
    const spent = num * unit;
    const rem = remParts * unit;
    return {
      title: 'ΚΕΦ. 4 • ΠΡΟΒΛΗΜΑ ΥΠΟΛΟΙΠΟΥ',
      type: 'mcq',
      correct: `${rem} €`,
      options: shuffleArray([`${rem} €`, `${rem + unit} €`, `${spent} €`, `${rem + 2 * unit} €`]),
      prompt: `Ξόδεψα τα ${num}/${den} των χρημάτων μου, δηλαδή ${spent} €. Πόσα χρήματα μου έμειναν;`,
      explanation: `1/${den} ＝ ${spent} ： ${num} ＝ ${unit} €. Περίσσεψαν τα ${remParts}/${den}: ${unit} · ${remParts} ＝ ${rem} €.`
    };
  },
  () => {
    const filled = 4;
    const den = 7;
    const missing = den - filled; // 3
    const unit = 30;
    const current = filled * unit;
    const needed = missing * unit;
    return {
      title: 'ΚΕΦ. 4 • ΠΛΗΡΩΣΗ ΔΕΞΑΜΕΝΗΣ',
      type: 'input',
      correct: needed,
      unit: 'L',
      prompt: `Μια δεξαμενή έχει ${current} L νερό (τα ${filled}/${den} της). Πόσα L λείπουν για να γεμίσει;`,
      explanation: `1/${den} ＝ ${current} ： ${filled} ＝ ${unit} L. Λείπουν τα ${missing}/${den}: ${unit} · ${missing} ＝ ${needed} L.`
    };
  },
  () => {
    const num = 5;
    const den = 9;
    const unit = 40;
    const known = num * unit;
    const total = den * unit;
    return {
      title: 'ΚΕΦ. 4 • ΒΑΡΟΣ ΦΟΡΤΙΟΥ',
      type: 'mcq',
      correct: `${total} kg`,
      options: shuffleArray([`${total} kg`, `${total + unit} kg`, `${total - unit} kg`, `${total + 2 * unit} kg`]),
      prompt: `Τα ${num}/${den} ενός φορτίου ζυγίζουν ${known} kg. Πόσα kg ζυγίζει όλο το φορτίο;`,
      explanation: `1/${den} ＝ ${known} ： ${num} ＝ ${unit} kg. Όλο: ${unit} · ${den} ＝ ${total} kg.`
    };
  },
  () => {
    const num = 2;
    const den = 7;
    return {
      title: 'ΚΕΦ. 4 • ΟΡΙΣΜΟΣ ΚΛΑΣΜΑΤΙΚΗΣ ΜΟΝΑΔΑΣ',
      type: 'mcq',
      correct: '1/7',
      options: ['1/7', '2/7', '7/7', '7/2'],
      prompt: `Ποια είναι η κλασματική μονάδα του κλάσματος ${num}/${den};`,
      explanation: `Κλασματική μονάδα είναι το κλάσμα με αριθμητή το 1 και τον ίδιο παρονομαστή, δηλαδή το 1/${den}.`
    };
  },
  () => {
    const unit = 14;
    const den = 8;
    return {
      title: 'ΚΕΦ. 4 • ΑΠΟ ΤΗ ΜΟΝΑΔΑ ΣΤΟ ΟΛΟ',
      type: 'input',
      correct: unit * den,
      unit: '€',
      prompt: `Αν το 1/${den} ενός ποσού είναι ${unit} €, πόσο είναι ολόκληρο το ποσό;`,
      explanation: `Πολλαπλασιάζουμε με τον παρονομαστή: ${unit} · ${den} ＝ ${unit * den} €.`
    };
  },
  () => {
    const num = 3;
    const den = 4;
    const unit = 20;
    const known = num * unit;
    return {
      title: 'ΚΕΦ. 4 • ΔΙΑΙΡΕΣΗ ΜΕ ΑΡΙΘΜΗΤΗ',
      type: 'input',
      correct: unit,
      unit: 'μέτρα',
      prompt: `Τα ${num}/${den} ενός υφάσματος είναι ${known} m. Πόσα μέτρα είναι το 1/${den};`,
      explanation: `Διαιρούμε με τον αριθμητή: ${known} ： ${num} ＝ ${unit} m.`
    };
  }
];

// ΚΕΦΑΛΑΙΟ 5: Πολλαπλάσια ενός Αριθμού
const poolCh5 = [
  () => {
    const base = 7;
    const threshold = 52;
    const correct = 56;
    return {
      title: 'ΚΕΦ. 5 • ΕΠΟΜΕΝΟ ΠΟΛΛΑΠΛΑΣΙΟ',
      type: 'input',
      correct,
      unit: 'αριθμός',
      prompt: `Ποιο είναι το μικρότερο πολλαπλάσιο του ${base} που είναι μεγαλύτερο από το ${threshold};`,
      explanation: `52 ： 7 ＝ 7 υπ. 3. Το αμέσως επόμενο πολλαπλάσιο είναι 7 · 8 ＝ ${correct}.`
    };
  },
  () => {
    const base = 8;
    const threshold = 75;
    const correct = 72;
    return {
      title: 'ΚΕΦ. 5 • ΠΡΟΗΓΟΥΜΕΝΟ ΠΟΛΛΑΠΛΑΣΙΟ',
      type: 'input',
      correct,
      unit: 'αριθμός',
      prompt: `Ποιο είναι το μεγαλύτερο πολλαπλάσιο του ${base} που είναι μικρότερο από το ${threshold};`,
      explanation: `75 ： 8 ＝ 9 υπ. 3. Άρα το μεγαλύτερο πολλαπλάσιο είναι 8 · 9 ＝ ${correct}.`
    };
  },
  () => {
    const correct = '91';
    return {
      title: 'ΚΕΦ. 5 • ΕΛΕΓΧΟΣ ΠΟΛΛΑΠΛΑΣΙΟΥ',
      type: 'mcq',
      correct,
      options: shuffleArray([correct, '88', '93', '95']),
      prompt: `Ποιος από τους παρακάτω αριθμούς είναι πολλαπλάσιο του 7;`,
      explanation: `91 ： 7 ＝ 13 (υπόλοιπο 0). Οι υπόλοιποι αφήνουν υπόλοιπο.`
    };
  },
  () => {
    const correct = '76';
    return {
      title: 'ΚΕΦ. 5 • ΕΝΤΟΠΙΣΜΟΣ ΜΗ ΠΟΛΛΑΠΛΑΣΙΟΥ',
      type: 'mcq',
      correct,
      options: shuffleArray(['63', '72', '81', correct]),
      prompt: `Ποιος από τους παρακάτω αριθμούς ΔΕΝ είναι πολλαπλάσιο του 9;`,
      explanation: `Το 76 δεν διαιρείται ακριβώς με το 9 (76 ： 9 ＝ 8 υπ. 4).`
    };
  },
  () => {
    return {
      title: 'ΚΕΦ. 5 • ΜΙΚΡΟΤΕΡΟ ΚΟΙΝΟ ΠΟΛΛΑΠΛΑΣΙΟ',
      type: 'input',
      correct: 24,
      unit: 'αριθμός',
      prompt: `Ποιο είναι το μικρότερο θετικό κοινό πολλαπλάσιο των αριθμών 6 και 8;`,
      explanation: `Τα κοινά πολλαπλάσια των 6 και 8 είναι {24, 48, ...}. Το μικρότερο θετικό είναι το 24.`
    };
  },
  () => {
    const correct = 56;
    return {
      title: 'ΚΕΦ. 5 • ΣΥΜΠΛΗΡΩΣΗ ΣΕΙΡΑΣ',
      type: 'mcq',
      correct: '56',
      options: shuffleArray(['56', '54', '58', '62']),
      prompt: `Στη σειρά διαδοχικών πολλαπλασίων του 7: 35, 42, 49, ..., 63, ποιος αριθμός λείπει;`,
      explanation: `Προσθέτουμε 7 στον προηγούμενο όρο: 49 ＋ 7 ＝ 56.`
    };
  },
  () => {
    const correct = 24;
    return {
      title: 'ΚΕΦ. 5 • ΠΡΟΒΛΗΜΑ ΠΕΡΙΟΔΙΚΟΤΗΤΑΣ',
      type: 'mcq',
      correct: `${correct} s`,
      options: shuffleArray([`${correct} s`, '32 s', '18 s', '48 s']),
      prompt: `Ένας φάρος αναβοσβήνει κάθε 6 s και ένας άλλος κάθε 8 s. Μετά από πόσα s θα ανάψουν μαζί για πρώτη φορά;`,
      explanation: `Ψάχνουμε το μικρότερο κοινό πολλαπλάσιο των 6 και 8: ΕΚΠ(6, 8) ＝ ${correct} s.`
    };
  },
  () => {
    const pack = 6;
    const target = 70;
    const total = 72; // 12 * 6
    return {
      title: 'ΚΕΦ. 5 • ΠΡΟΒΛΗΜΑ ΟΜΑΔΟΠΟΙΗΣΗΣ',
      type: 'input',
      correct: total,
      unit: 'τεμάχια',
      prompt: `Συσκευάζουμε γλυκά σε κουτιά των ${pack}. Θέλουμε τουλάχιστον ${target} γλυκά. Ποιος είναι ο ελάχιστος ακριβής αριθμός που γεμίζει πλήρως τα κουτιά;`,
      explanation: `70 ： 6 ＝ 11 υπ. 4. Χρειαζόμαστε 12 κουτιά: 12 · 6 ＝ ${total} γλυκά.`
    };
  },
  () => {
    return {
      title: 'ΚΕΦ. 5 • ΙΔΙΟΤΗΤΑ ΜΗΔΕΝΟΣ',
      type: 'mcq',
      correct: 'Το 0',
      options: ['Το 0', 'Το 1', 'Ο ίδιος ο αριθμός', 'Κανένας αριθμός'],
      prompt: `Ποιος αριθμός είναι πολλαπλάσιο ΚΑΘΕ φυσικού αριθμού;`,
      explanation: `Το 0 είναι πολλαπλάσιο όλων των αριθμών, γιατί α · 0 ＝ 0.`
    };
  },
  () => {
    const b = 13;
    return {
      title: 'ΚΕΦ. 5 • ΜΙΚΡΟΤΕΡΟ ΘΕΤΙΚΟ',
      type: 'input',
      correct: b,
      unit: 'αριθμός',
      prompt: `Ποιο είναι το μικρότερο ΜΗ ΜΗΔΕΝΙΚΟ πολλαπλάσιο του ${b};`,
      explanation: `Το μικρότερο θετικό πολλαπλάσιο ενός αριθμού είναι ο ίδιος ο αριθμός (${b} · 1 ＝ ${b}).`
    };
  }
];

// ΚΕΦΑΛΑΙΟ 6: Ελάχιστο Κοινό Πολλαπλάσιο (ΕΚΠ)
const poolCh6 = [
  () => {
    return {
      title: 'ΚΕΦ. 6 • ΕΚΠ ΔΥΟ ΑΡΙΘΜΩΝ',
      type: 'input',
      correct: 36,
      unit: 'αριθμός',
      prompt: `Υπολόγισε το ΕΚΠ(12, 18):`,
      explanation: `Π(12) ＝ {12, 24, 36, ...} και Π(18) ＝ {18, 36, ...}. Άρα ΕΚΠ(12, 18) ＝ 36.`
    };
  },
  () => {
    return {
      title: 'ΚΕΦ. 6 • ΕΙΔΙΚΗ ΠΕΡΙΠΤΩΣΗ ΕΚΠ',
      type: 'input',
      correct: 24,
      unit: 'αριθμός',
      prompt: `Βρες το ΕΚΠ(6, 24):`,
      explanation: `Επειδή το 24 είναι πολλαπλάσιο του 6, το ΕΚΠ είναι ο μεγαλύτερος αριθμός: 24.`
    };
  },
  () => {
    return {
      title: 'ΚΕΦ. 6 • ΕΚΠ ΤΡΙΩΝ ΑΡΙΘΜΩΝ',
      type: 'mcq',
      correct: '24',
      options: shuffleArray(['24', '12', '48', '36']),
      prompt: `Ποιο είναι το ΕΚΠ(4, 6, 8);`,
      explanation: `ΕΚΠ(4, 6) ＝ 12 και ΕΚΠ(12, 8) ＝ 24.`
    };
  },
  () => {
    return {
      title: 'ΚΕΦ. 6 • ΕΚΠ ΤΡΙΩΝ ΑΡΙΘΜΩΝ',
      type: 'mcq',
      correct: '36',
      options: shuffleArray(['36', '18', '72', '54']),
      prompt: `Ποιο είναι το ΕΚΠ(4, 9, 12);`,
      explanation: `ΕΚΠ(4, 12) ＝ 12 και ΕΚΠ(12, 9) ＝ 36.`
    };
  },
  () => {
    return {
      title: 'ΚΕΦ. 6 • ΚΟΙΝΟΣ ΠΑΡΟΝΟΜΑΣΤΗΣ',
      type: 'input',
      correct: 24,
      unit: 'ΕΚΠ παρονομαστών',
      prompt: `Ποιος είναι ο μικρότερος κοινός παρονομαστής για τα κλάσματα 5/6 και 3/8;`,
      explanation: `Βρίσκουμε το ΕΚΠ των παρονομαστών: ΕΚΠ(6, 8) ＝ 24.`
    };
  },
  () => {
    return {
      title: 'ΚΕΦ. 6 • ΚΟΙΝΟΣ ΠΑΡΟΝΟΜΑΣΤΗΣ 3 ΚΛΑΣΜΑΤΩΝ',
      type: 'mcq',
      correct: '30',
      options: shuffleArray(['30', '15', '60', '45']),
      prompt: `Ποιος είναι ο ελάχιστος κοινός παρονομαστής για τα κλάσματα 1/3, 2/5 και 5/6;`,
      explanation: `ΕΚΠ(3, 5, 6) ＝ 30.`
    };
  },
  () => {
    return {
      title: 'ΚΕΦ. 6 • ΠΡΟΒΛΗΜΑ ΣΥΓΧΡΟΝΙΣΜΟΥ',
      type: 'mcq',
      correct: '36 min',
      options: shuffleArray(['36 min', '24 min', '48 min', '72 min']),
      prompt: `Το λεωφορείο Α περνά κάθε 12 min και το Β κάθε 18 min. Αν περάσουν μαζί τώρα, μετά από πόσα min θα ξαναπεράσουν μαζί;`,
      explanation: `ΕΚΠ(12, 18) ＝ 36 min.`
    };
  },
  () => {
    return {
      title: 'ΚΕΦ. 6 • ΠΡΟΒΛΗΜΑ ΣΤΟΙΒΑΣ',
      type: 'input',
      correct: 24,
      unit: 'cm',
      prompt: `Στοιβάζουμε κουτιά ύψους 6 cm και 8 cm. Σε ποιο ελάχιστο κοινό ύψος (cm) θα ισοϋψωθούν;`,
      explanation: `ΕΚΠ(6, 8) ＝ 24 cm.`
    };
  },
  () => {
    return {
      title: 'ΚΕΦ. 6 • ΠΡΩΤΟΙ ΜΕΤΑΞΥ ΤΟΥΣ',
      type: 'input',
      correct: 35,
      unit: 'αριθμός',
      prompt: `Υπολόγισε το ΕΚΠ(5, 7):`,
      explanation: `Οι αριθμοί 5 και 7 είναι πρώτοι μεταξύ τους, άρα το ΕΚΠ είναι το γινόμενό τους: 5 · 7 ＝ 35.`
    };
  },
  () => {
    return {
      title: 'ΚΕΦ. 6 • ΕΚΠ ΜΕ 10 ΚΑΙ 15',
      type: 'input',
      correct: 30,
      unit: 'αριθμός',
      prompt: `Βρες το ΕΚΠ(10, 15):`,
      explanation: `Τα πολλαπλάσια του 15 είναι 15, 30... Το 30 διαιρείται και με το 10. Άρα ΕΚΠ ＝ 30.`
    };
  }
];

// ΚΕΦΑΛΑΙΟ 7: Διαιρέτες ενός Αριθμού
const poolCh7 = [
  () => {
    return {
      title: 'ΚΕΦ. 7 • ΠΛΗΘΟΣ ΔΙΑΙΡΕΤΩΝ',
      type: 'input',
      correct: 6,
      unit: 'διαιρέτες',
      prompt: `Πόσους διαιρέτες έχει συνολικά ο αριθμός 18;`,
      explanation: `Δ(18) ＝ {1, 2, 3, 6, 9, 18}, δηλαδή 6 διαιρέτες.`
    };
  },
  () => {
    return {
      title: 'ΚΕΦ. 7 • ΣΥΜΠΛΗΡΩΣΗ ΣΥΝΟΛΟΥ',
      type: 'input',
      correct: 8,
      unit: 'τιμή x',
      prompt: `Στο σύνολο των διαιρετών του 24: Δ(24) ＝ {1, 2, 3, 4, 6, x, 12, 24}, ποιος αριθμός είναι το x;`,
      explanation: `Το ζευγάρι του 3 είναι 24 ： 3 ＝ 8. Άρα x ＝ 8.`
    };
  },
  () => {
    return {
      title: 'ΚΕΦ. 7 • ΕΛΕΓΧΟΣ ΔΙΑΙΡΕΤΗ',
      type: 'mcq',
      correct: '7',
      options: shuffleArray(['7', '5', '9', '11']),
      prompt: `Ποιος από τους παρακάτω αριθμούς είναι διαιρέτης του 42;`,
      explanation: `42 ： 7 ＝ 6 (υπόλοιπο 0).`
    };
  },
  () => {
    return {
      title: 'ΚΕΦ. 7 • ΕΝΤΟΠΙΣΜΟΣ ΜΗ ΔΙΑΙΡΕΤΗ',
      type: 'mcq',
      correct: '8',
      options: shuffleArray(['6', '8', '9', '12']),
      prompt: `Ποιος από τους παρακάτω αριθμούς ΔΕΝ είναι διαιρέτης του 36;`,
      explanation: `Το 36 δεν διαιρείται ακριβώς με το 8 (36 ： 8 ＝ 4 υπ. 4).`
    };
  },
  () => {
    return {
      title: 'ΚΕΦ. 7 • ΠΡΩΤΟΣ ΑΡΙΘΜΟΣ',
      type: 'mcq',
      correct: '29',
      options: shuffleArray(['21', '25', '27', '29']),
      prompt: `Ποιος από τους παρακάτω αριθμούς είναι ΠΡΩΤΟΣ;`,
      explanation: `Το 29 διαιρείται μόνο με το 1 και το 29.`
    };
  },
  () => {
    return {
      title: 'ΚΕΦ. 7 • ΣΥΝΘΕΤΟΣ ΑΡΙΘΜΟΣ',
      type: 'mcq',
      correct: '33',
      options: shuffleArray(['23', '31', '33', '37']),
      prompt: `Ποιος από τους παρακάτω αριθμούς είναι ΣΥΝΘΕΤΟΣ;`,
      explanation: `Το 33 διαιρείται με το 1, 3, 11, 33 (έχει πάνω από 2 διαιρέτες).`
    };
  },
  () => {
    return {
      title: 'ΚΕΦ. 7 • ΠΡΟΒΛΗΜΑ ΟΜΑΔΩΝ',
      type: 'input',
      correct: 8,
      unit: 'ομάδες',
      prompt: `Μοιράζουμε 48 παιδιά σε ισάριθμες ομάδες των 6. Πόσες ομάδες θα γίνουν χωρίς να περισσέψει κανείς;`,
      explanation: `48 ： 6 ＝ 8 ομάδες.`
    };
  },
  () => {
    return {
      title: 'ΚΕΦ. 7 • ΑΔΥΝΑΤΗ ΣΥΣΚΕΥΑΣΙΑ',
      type: 'mcq',
      correct: 'Κουτιά των 7',
      options: shuffleArray(['Κουτιά των 4', 'Κουτιά των 6', 'Κουτιά των 7', 'Κουτιά των 8']),
      prompt: `Έχουμε 48 γλυκά. Με ποιον τρόπο ΔΕΝ μπορούμε να τα συσκευάσουμε ακριβώς χωρίς περίσσευμα;`,
      explanation: `Το 7 δεν διαιρεί ακριβώς το 48 (48 ： 7 ＝ 6 υπ. 6).`
    };
  },
  () => {
    return {
      title: 'ΚΕΦ. 7 • ΚΟΙΝΟΣ ΔΙΑΙΡΕΤΗΣ ΟΛΩΝ',
      type: 'input',
      correct: 1,
      unit: 'αριθμός',
      prompt: `Ποιος αριθμός είναι διαιρέτης ΚΑΘΕ φυσικού αριθμού;`,
      explanation: `Ο αριθμός 1 διαιρεί όλους τους φυσικούς αριθμούς.`
    };
  },
  () => {
    const n = 37;
    return {
      title: 'ΚΕΦ. 7 • ΜΕΓΙΣΤΟΣ ΔΙΑΙΡΕΤΗΣ',
      type: 'input',
      correct: n,
      unit: 'αριθμός',
      prompt: `Ποιος είναι ο μεγαλύτερος διαιρέτης του αριθμού ${n};`,
      explanation: `Ο μεγαλύτερος διαιρέτης κάθε αριθμού είναι ο ίδιος ο εαυτός του (${n}).`
    };
  }
];

// ΚΕΦΑΛΑΙΟ 8: Μέγιστος Κοινός Διαιρέτης (ΜΚΔ)
const poolCh8 = [
  () => {
    return {
      title: 'ΚΕΦ. 8 • ΜΚΔ ΔΥΟ ΑΡΙΘΜΩΝ',
      type: 'input',
      correct: 6,
      unit: 'αριθμός',
      prompt: `Υπολόγισε τον ΜΚΔ(24, 30):`,
      explanation: `Κοινοί διαιρέτες των 24 και 30 είναι {1, 2, 3, 6}. Μέγιστος: 6.`
    };
  },
  () => {
    return {
      title: 'ΚΕΦ. 8 • ΕΙΔΙΚΗ ΠΕΡΙΠΤΩΣΗ ΜΚΔ',
      type: 'input',
      correct: 8,
      unit: 'αριθμός',
      prompt: `Βρες τον ΜΚΔ(8, 32):`,
      explanation: `Επειδή το 32 διαιρείται ακριβώς με το 8, ο ΜΚΔ είναι ο μικρότερος αριθμός: 8.`
    };
  },
  () => {
    return {
      title: 'ΚΕΦ. 8 • ΜΚΔ ΤΡΙΩΝ ΑΡΙΘΜΩΝ',
      type: 'mcq',
      correct: '6',
      options: shuffleArray(['6', '12', '3', '4']),
      prompt: `Ποιος είναι ο ΜΚΔ(18, 24, 30);`,
      explanation: `ΜΚΔ(18, 24) ＝ 6 και ΜΚΔ(6, 30) ＝ 6.`
    };
  },
  () => {
    return {
      title: 'ΚΕΦ. 8 • ΠΡΩΤΟΙ ΜΕΤΑΞΥ ΤΟΥΣ',
      type: 'mcq',
      correct: '14 και 25',
      options: shuffleArray(['14 και 25', '18 και 27', '15 και 35', '24 και 32']),
      prompt: `Ποιο από τα παρακάτω ζευγάρια αποτελείται από αριθμούς πρώτους μεταξύ τους;`,
      explanation: `Το 14 και το 25 έχουν μοναδικό κοινό διαιρέτη το 1 (ΜΚΔ ＝ 1).`
    };
  },
  () => {
    return {
      title: 'ΚΕΦ. 8 • ΑΠΛΟΠΟΙΗΣΗ ΜΕ ΜΚΔ',
      type: 'input',
      correct: 12,
      unit: 'διαιρέτης (ΜΚΔ)',
      prompt: `Με ποιον μέγιστο αριθμό διαιρούμε τους όρους του 36/48 για να γίνει ανάγωγο με 1 βήμα;`,
      explanation: `Διαιρούμε με τον ΜΚΔ(36, 48) ＝ 12.`
    };
  },
  () => {
    return {
      title: 'ΚΕΦ. 8 • ΑΝΑΓΩΓΟ ΚΛΑΣΜΑ ΜΕΣΩ ΜΚΔ',
      type: 'mcq',
      correct: '3/4',
      options: shuffleArray(['3/4', '2/3', '4/5', '5/6']),
      prompt: `Ποιο ανάγωγο κλάσμα προκύπτει αν απλοποιήσουμε το 45/60 με τον ΜΚΔ τους;`,
      explanation: `ΜΚΔ(45, 60) ＝ 15. Διαιρούμε: (45 ： 15) / (60 ： 15) ＝ 3/4.`
    };
  },
  () => {
    return {
      title: 'ΚΕΦ. 8 • ΠΡΟΒΛΗΜΑ ΜΕΓΙΣΤΗΣ ΙΣΟΜΟΙΡΑΣΙΑΣ',
      type: 'input',
      correct: 12,
      unit: 'πακέτα',
      prompt: `Έχουμε 24 μολύβια και 36 τετράδια. Ποιος είναι ο ΜΕΓΙΣΤΟΣ αριθμός όμοιων πακέτων που φτιάχνουμε χωρίς περίσσευμα;`,
      explanation: `ΜΚΔ(24, 36) ＝ 12 πακέτα.`
    };
  },
  () => {
    return {
      title: 'ΚΕΦ. 8 • ΚΟΠΗ ΣΕ ΜΕΓΙΣΤΟ ΜΗΚΟΣ',
      type: 'mcq',
      correct: '15 cm',
      options: shuffleArray(['15 cm', '10 cm', '20 cm', '30 cm']),
      prompt: `Κόβουμε δύο σανίδες μήκους 45 cm και 60 cm σε ίσα κομμάτια μέγιστου μήκους. Πόσο θα είναι το μήκος κάθε κομματιού;`,
      explanation: `ΜΚΔ(45, 60) ＝ 15 cm.`
    };
  },
  () => {
    return {
      title: 'ΚΕΦ. 8 • ΜΚΔ 16 ΚΑΙ 24',
      type: 'input',
      correct: 8,
      unit: 'αριθμός',
      prompt: `Βρες τον ΜΚΔ(16, 24):`,
      explanation: `Κοινοί διαιρέτες είναι {1, 2, 4, 8}. Μέγιστος είναι το 8.`
    };
  },
  () => {
    return {
      title: 'ΚΕΦ. 8 • ΜΚΔ ΤΡΙΩΝ ΑΡΙΘΜΩΝ',
      type: 'input',
      correct: 10,
      unit: 'αριθμός',
      prompt: `Υπολόγισε τον ΜΚΔ(20, 30, 50):`,
      explanation: `Ο μεγαλύτερος κοινός διαιρέτης και των τριών είναι το 10.`
    };
  }
];

// ΚΕΦΑΛΑΙΟ 9: Κριτήρια Διαιρετότητας
const poolCh9 = [
  () => {
    return {
      title: 'ΚΕΦ. 9 • ΑΓΝΩΣΤΟ ΨΗΦΙΟ (ΔΙΑΙΡΕΣΗ ΜΕ 3)',
      type: 'input',
      correct: 2,
      unit: 'ψηφίο x',
      prompt: `Στον αριθμό 4x5, ποιο είναι το ΜΙΚΡΟΤΕΡΟ μονοψήφιο x ( ＞ 0 ) ώστε ο αριθμός να διαιρείται με το 3;`,
      explanation: `Άθροισμα: 4 ＋ x ＋ 5 ＝ 9 ＋ x. Για x ＝ 2 έχουμε 11 (όχι), αλλά για x ＝ 3 έχουμε 12 (διαιρείται με 3). Αν x ＝ 0 είναι 9, αλλά ζητείται x ＞ 0, άρα x ＝ 3.`
    };
  },
  () => {
    return {
      title: 'ΚΕΦ. 9 • ΑΓΝΩΣΤΟ ΨΗΦΙΟ (ΔΙΑΙΡΕΣΗ ΜΕ 9)',
      type: 'input',
      correct: 7,
      unit: 'ψηφίο x',
      prompt: `Στον τετραψήφιο 3.4x4, ποιο ψηφίο πρέπει να είναι το x ώστε να διαιρείται ακριβώς με το 9;`,
      explanation: `3 ＋ 4 ＋ x ＋ 4 ＝ 11 ＋ x. Το επόμενο πολλαπλάσιο του 9 είναι 18, άρα x ＝ 18 － 11 ＝ 7.`
    };
  },
  () => {
    const correct = '528';
    return {
      title: 'ΚΕΦ. 9 • ΚΡΙΤΗΡΙΟ ΤΟΥ 4',
      type: 'mcq',
      correct,
      options: shuffleArray([correct, '522', '526', '530']),
      prompt: `Ποιος από τους παρακάτω αριθμούς διαιρείται ακριβώς με το 4;`,
      explanation: `Τα δύο τελευταία ψηφία 28 διαιρούνται με το 4 (28 ： 4 ＝ 7).`
    };
  },
  () => {
    const correct = '1.475';
    return {
      title: 'ΚΕΦ. 9 • ΚΡΙΤΗΡΙΟ ΤΟΥ 25',
      type: 'mcq',
      correct,
      options: shuffleArray([correct, '1.435', '1.465', '1.485']),
      prompt: `Ποιος από τους παρακάτω αριθμούς διαιρείται ακριβώς με το 25;`,
      explanation: `Ένας αριθμός διαιρείται με το 25 αν λήγει σε 00, 25, 50 ή 75. Το 1.475 λήγει σε 75.`
    };
  },
  () => {
    const correct = '432';
    return {
      title: 'ΚΕΦ. 9 • ΣΥΝΘΕΤΟ ΚΡΙΤΗΡΙΟ ΤΟΥ 6',
      type: 'mcq',
      correct,
      options: shuffleArray([correct, '435', '430', '434']),
      prompt: `Ποιος από τους παρακάτω αριθμούς διαιρείται ακριβώς με το 6;`,
      explanation: `Το 432 είναι άρτιος και το άθροισμα των ψηφίων του είναι 4 ＋ 3 ＋ 2 ＝ 9 (διαιρείται με το 3).`
    };
  },
  () => {
    const correct = '345';
    return {
      title: 'ΚΕΦ. 9 • ΣΥΝΘΕΤΟ ΚΡΙΤΗΡΙΟ ΤΟΥ 15',
      type: 'mcq',
      correct,
      options: shuffleArray([correct, '340', '344', '346']),
      prompt: `Ποιος από τους παρακάτω αριθμούς διαιρείται ακριβώς με το 15;`,
      explanation: `Το 345 λήγει σε 5 (διαιρείται με 5) και έχει άθροισμα ψηφίων 3 ＋ 4 ＋ 5 ＝ 12 (διαιρείται με 3).`
    };
  },
  () => {
    return {
      title: 'ΚΕΦ. 9 • ΤΑΥΤΟΧΡΟΝΗ ΜΕ 9 ΚΑΙ 10',
      type: 'input',
      correct: 7,
      unit: 'ψηφίο x',
      prompt: `Ο αριθμός 4.7x0 λήγει σε 0. Ποιο ψηφίο πρέπει να είναι το x ώστε να διαιρείται και με το 9;`,
      explanation: `4 ＋ 7 ＋ x ＋ 0 ＝ 11 ＋ x. Το επόμενο πολλαπλάσιο του 9 είναι 18, άρα x ＝ 18 － 11 ＝ 7.`
    };
  },
  () => {
    const correct = '240';
    return {
      title: 'ΚΕΦ. 9 • ΤΑΥΤΟΧΡΟΝΗ ΜΕ 2, 3 ΚΑΙ 5',
      type: 'mcq',
      correct,
      options: shuffleArray([correct, '245', '230', '250']),
      prompt: `Ποιος από τους παρακάτω αριθμούς διαιρείται ταυτόχρονα με το 2, το 3 και το 5;`,
      explanation: `Λήγει σε 0 (διαιρείται με 2 και 5) και το άθροισμα 2 ＋ 4 ＋ 0 ＝ 6 διαιρείται με το 3.`
    };
  },
  () => {
    return {
      title: 'ΚΕΦ. 9 • ΚΡΙΤΗΡΙΟ ΤΟΥ 3',
      type: 'input',
      correct: 18,
      unit: 'άθροισμα',
      prompt: `Πόσο είναι το άθροισμα των ψηφίων του 5.670 που αποδεικνύει ότι διαιρείται με το 3 και το 9;`,
      explanation: `5 ＋ 6 ＋ 7 ＋ 0 ＝ 18. Το 18 διαιρείται ακριβώς με το 3 και με το 9.`
    };
  },
  () => {
    const correct = '800';
    return {
      title: 'ΚΕΦ. 9 • ΔΥΟ ΜΗΔΕΝΙΚΑ ΣΤΟ ΤΕΛΟΣ',
      type: 'mcq',
      correct,
      options: shuffleArray([correct, '802', '805', '815']),
      prompt: `Ποιος αριθμός διαιρείται ταυτόχρονα με το 4, το 25 και το 100;`,
      explanation: `Κάθε αριθμός που λήγει σε 00 διαιρείται ταυτόχρονα με το 4, το 25 και το 100.`
    };
  }
];

// Συνάρτηση επιλογής 2 μοναδικών ερωτήσεων από μια δεξαμενή
function pickTwoFromPool(pool) {
  const shuffled = shuffleArray(pool);
  return [shuffled[0](), shuffled[1]()];
}

// Δημιουργία 18 Ερωτήσεων (2 από κάθε κεφάλαιο)
function generateRevisionQuiz() {
  const allPools = [
    poolCh1, poolCh2, poolCh3, poolCh4, poolCh5, poolCh6, poolCh7, poolCh8, poolCh9
  ];

  const questions = [];
  allPools.forEach((pool, chIdx) => {
    const [qA, qB] = pickTwoFromPool(pool);
    questions.push({ ...qA, id: `q${chIdx * 2 + 1}`, chapterNum: chIdx + 1 });
    questions.push({ ...qB, id: `q${chIdx * 2 + 2}`, chapterNum: chIdx + 1 });
  });

  return questions;
}

export default function EpanalipsiOnePage() {
  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewTest = () => {
    const qList = generateRevisionQuiz();
    setQuestions(qList);

    const initialAnswers = {};
    qList.forEach((q) => {
      initialAnswers[q.id] = '';
    });
    setAnswers(initialAnswers);
    setSubmitted(false);
    setScore(0);
  };

  useEffect(() => {
    loadNewTest();
  }, []);

  if (!questions) return null;

  const handleInputChange = (id, val) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [id]: val }));
  };

  const handleNumericInput = (id, rawVal) => {
    if (submitted) return;
    const clean = rawVal.replace(/\D/g, '');
    setAnswers((prev) => ({ ...prev, [id]: clean }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted) return;

    let currentScore = 0;
    questions.forEach((q) => {
      if (q.type === 'input') {
        if (parseInt(answers[q.id], 10) === q.correct) {
          currentScore += 1;
        }
      } else if (q.type === 'mcq') {
        if (answers[q.id] === q.correct) {
          currentScore += 1;
        }
      }
    });

    setScore(currentScore);
    setSubmitted(true);
  };

  // Render Component για Ερώτηση MCQ
  const renderMCQ = (q, index) => {
    const isCorrect = answers[q.id] === q.correct;
    return (
      <div
        key={q.id}
        className={`bg-white p-5 sm:p-7 2xl:p-9 rounded-3xl shadow-sm border transition-all ${
          submitted
            ? isCorrect
              ? 'border-emerald-500 bg-emerald-50/20'
              : 'border-rose-400 bg-rose-50/20'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-indigo-600 text-white font-black text-xs sm:text-sm 2xl:text-base w-7 h-7 sm:w-8 sm:h-8 2xl:w-10 2xl:h-10 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {index + 1}
          </span>
          <div className="space-y-1">
            <span className="text-[11px] 2xl:text-xs font-black tracking-wider text-slate-400">
              {q.title}
            </span>
            <h3 className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-900 leading-snug">
              {q.prompt}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:pl-11 2xl:pl-13">
          {q.options.map((opt, optIdx) => {
            const isSelected = answers[q.id] === opt;
            return (
              <label
                key={optIdx}
                className={`flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition select-none text-sm sm:text-base 2xl:text-lg font-mono font-bold ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                } ${submitted ? 'cursor-default pointer-events-none' : ''}`}
              >
                <input
                  type="radio"
                  id={`${q.id}-opt-${optIdx}`}
                  name={q.id}
                  value={opt}
                  checked={isSelected}
                  onChange={() => handleInputChange(q.id, opt)}
                  disabled={submitted}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 shrink-0"
                />
                <span>{opt}</span>
              </label>
            );
          })}
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 2xl:pl-13 text-xs sm:text-sm 2xl:text-base leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-800 font-semibold bg-emerald-50 p-3 rounded-2xl border border-emerald-200/60 font-mono">
                {q.explanation}
              </p>
            ) : (
              <p className="text-rose-800 font-medium bg-rose-50 p-3 rounded-2xl border border-rose-200/60 font-mono">
                Η σωστή απάντηση είναι: <strong className="font-bold text-rose-950">{q.correct}</strong>. {q.explanation}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Component για Ερώτηση Input
  const renderInput = (q, index) => {
    const isCorrect = parseInt(answers[q.id], 10) === q.correct;
    return (
      <div
        key={q.id}
        className={`bg-white p-5 sm:p-7 2xl:p-9 rounded-3xl shadow-sm border transition-all ${
          submitted
            ? isCorrect
              ? 'border-emerald-500 bg-emerald-50/20'
              : 'border-rose-400 bg-rose-50/20'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-blue-600 text-white font-black text-xs sm:text-sm 2xl:text-base w-7 h-7 sm:w-8 sm:h-8 2xl:w-10 2xl:h-10 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {index + 1}
          </span>
          <div className="space-y-1">
            <span className="text-[11px] 2xl:text-xs font-black tracking-wider text-slate-400">
              {q.title}
            </span>
            <h3 className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-900 leading-snug">
              {q.prompt}
            </h3>
          </div>
        </div>

        <div className="sm:pl-11 2xl:pl-13 space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              id={`input-${q.id}`}
              name={`input-${q.id}`}
              placeholder="?"
              value={answers[q.id]}
              onChange={(e) => handleNumericInput(q.id, e.target.value)}
              disabled={submitted}
              className="w-32 sm:w-40 h-12 sm:h-14 p-3 text-center rounded-2xl border-2 border-slate-300 font-mono text-lg sm:text-xl 2xl:text-2xl font-black focus:border-indigo-600 focus:outline-none bg-slate-50/60 focus:bg-white text-slate-900 disabled:opacity-75"
            />
            <span className="text-xs sm:text-sm 2xl:text-base font-semibold text-slate-600">
              {q.unit}
            </span>
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 2xl:pl-13 text-xs sm:text-sm 2xl:text-base leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-800 font-semibold bg-emerald-50 p-3 rounded-2xl border border-emerald-200/60 font-mono">
                {q.explanation}
              </p>
            ) : (
              <p className="text-rose-800 font-medium bg-rose-50 p-3 rounded-2xl border border-rose-200/60 font-mono">
                Η σωστή απάντηση είναι: <strong className="font-bold text-rose-950">{q.correct} {q.unit}</strong>. {q.explanation}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout
      title="1ο Επαναληπτικό Τεστ (Κεφ. 1-9) - Ε' Δημοτικού | LearnMaths.gr"
      description="Μεγάλο επαναληπτικό διαγώνισμα 18 ερωτήσεων στα κλάσματα, πολλαπλάσια, διαιρέτες, ΕΚΠ, ΜΚΔ και κριτήρια διαιρετότητας για την Ε' Δημοτικού."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      hideFooter={true}
      actionButton={
        <button
          type="button"
          onClick={loadNewTest}
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl text-sm 2xl:text-base transition shadow-sm flex items-center gap-2 whitespace-nowrap active:scale-95"
        >
          <span>🔄</span> Νέο Τεστ
        </button>
      }
    >
      {/* Container πλήρους εύρους για 2K / 4K και responsive για κινητά */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 space-y-8">
        
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1.5 max-w-4xl">
            <span className="bg-white/10 border border-white/20 text-sky-200 text-xs 2xl:text-sm font-black px-3 py-1 rounded-full tracking-wider inline-block">
              Ε' ΔΗΜΟΤΙΚΟΥ • ΕΠΑΝΑΛΗΨΗ 1
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-black tracking-tight pt-1">
              🏆 1ο Επαναληπτικό Τεστ: Κεφάλαια 1 έως 9
            </h1>
            <p className="text-sky-100 text-xs sm:text-sm md:text-base 2xl:text-lg">
              18 απαιτητικές ερωτήσεις (2 από κάθε ενότητα) επιλεγμένες τυχαία από τη δεξαμενή ασκήσεων!
            </p>
          </div>

          <button
            type="button"
            onClick={loadNewTest}
            className="bg-amber-400 text-slate-950 font-black px-4 py-2.5 sm:px-5 sm:py-3 2xl:px-7 2xl:py-4 rounded-2xl shadow-lg hover:bg-amber-300 transition active:scale-95 text-xs sm:text-sm 2xl:text-base whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            🔄 Νέο Τεστ
          </button>
        </div>

        {/* ΦΟΡΜΑ 18 ΑΣΚΗΣΕΩΝ & PB SAFE AREA */}
        <form onSubmit={handleSubmit} className="space-y-6 pb-28 sm:pb-32">
          {questions.map((q, idx) => (q.type === 'mcq' ? renderMCQ(q, idx) : renderInput(q, idx)))}

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="text-center pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white text-base sm:text-lg 2xl:text-xl font-black px-10 py-4 2xl:px-14 2xl:py-5 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95"
              >
                🎯 Έλεγχος Απαντήσεων
              </button>
            </div>
          )}
        </form>
      </div>

      {/* FIXED BOTTOM SCORE BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6 2xl:py-5 z-50">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 2xl:px-5 2xl:py-2 rounded-xl text-base sm:text-lg 2xl:text-xl flex items-center gap-2 shadow-sm">
              <span>🏆 Σκορ:</span>
              <span className="text-xl sm:text-2xl 2xl:text-3xl font-mono">{score} / 18</span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm 2xl:text-base font-bold text-slate-300">
                Επιτυχία: <span className="text-emerald-400 font-black">{Math.round((score / 18) * 100)}%</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                type="button"
                onClick={loadNewTest}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2 2xl:px-7 2xl:py-2.5 rounded-xl shadow-md transition text-xs sm:text-sm 2xl:text-base flex items-center gap-2 active:scale-95"
              >
                <span>🔄</span> Νέο Τεστ
              </button>
            ) : (
              <p className="text-xs 2xl:text-sm text-slate-400 hidden sm:block">
                Απάντησε σε όλες τις ερωτήσεις και πάτα «Έλεγχος Απαντήσεων»!
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
