import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// Βοηθητικές συναρτήσεις
function getRandomInt(min, max) {
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

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

function lcm(a, b) {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

const exponentsUnicode = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', 10: '¹⁰' };

// ==========================================
// ΔΕΞΑΜΕΝΗ ΓΕΝΝΗΤΡΙΩΝ ΓΙΑ ΤΑ 30 ΚΕΦΑΛΑΙΑ
// ==========================================
const CHAPTER_GENERATORS = [
  // 1. Φυσικοί Αριθμοί (Αξία θέσης ψηφίου σε μεγάλους αριθμούς)
  () => {
    const digits = [3, 4, 5, 6, 7, 8, 9];
    const posNames = [
      { name: 'εκατοντάδων χιλιάδων', mult: 100000 },
      { name: 'δεκάδων χιλιάδων', mult: 10000 },
      { name: 'μονάδων εκατομμυρίων', mult: 1000000 },
      { name: 'εκατοντάδων', mult: 100 }
    ];
    const pos = posNames[getRandomInt(0, posNames.length - 1)];
    const d = digits[getRandomInt(0, digits.length - 1)];
    const base = getRandomInt(12, 85) * 1000000 + getRandomInt(100, 999) * 1000 + getRandomInt(100, 999);
    const correctVal = d * pos.mult;
    return {
      title: "1. Φυσικοί Αριθμοί",
      prompt: `Ποια είναι η πραγματική αξία του ψηφίου ${d} όταν βρίσκεται στη θέση των ${pos.name};`,
      type: 'mcq',
      options: shuffle([
        correctVal.toLocaleString('el-GR'),
        (correctVal / 10).toLocaleString('el-GR'),
        (correctVal * 10).toLocaleString('el-GR'),
        String(d)
      ]),
      correct: correctVal.toLocaleString('el-GR'),
      explain: `Στη θέση των ${pos.name}, το ψηφίο ${d} έχει αξία ${d} × ${pos.mult.toLocaleString('el-GR')} ＝ ${correctVal.toLocaleString('el-GR')}.`
    };
  },

  // 2. Δεκαδικοί Αριθμοί (Αξία δεκαδικών ψηφίων)
  () => {
    const num = (getRandomInt(10, 80) + getRandomInt(105, 995) / 1000).toFixed(3);
    const parts = num.split('.');
    const decDigits = parts[1].split('');
    const targetIdx = getRandomInt(0, 2);
    const targetDigit = decDigits[targetIdx];
    const names = ['δέκατα', 'εκατοστά', 'χιλιοστά'];
    const multipliers = ['0,1', '0,01', '0,001'];
    return {
      title: "2. Δεκαδικοί Αριθμοί",
      prompt: `Στον δεκαδικό αριθμό ${num.replace('.', ',')}, τι εκφράζει το ψηφίο ${targetDigit};`,
      type: 'mcq',
      options: shuffle([names[targetIdx], names[(targetIdx + 1) % 3], names[(targetIdx + 2) % 3], 'μονάδες']),
      correct: names[targetIdx],
      explain: `Το ${targetDigit} είναι το ${targetIdx + 1}ο ψηφίο μετά την υποδιαστολή, άρα εκφράζει ${names[targetIdx]} (αξία: ${targetDigit} × ${multipliers[targetIdx]}).`
    };
  },

  // 3. Δεκαδικοί Αριθμοί σε Δεκαδικά Κλάσματα
  () => {
    const pool = [
      { dec: '0,25', frac: '25/100' },
      { dec: '0,5', frac: '5/10' },
      { dec: '0,75', frac: '75/100' },
      { dec: '1,2', frac: '12/10' },
      { dec: '0,08', frac: '8/100' },
      { dec: '0,125', frac: '125/1000' },
      { dec: '2,5', frac: '25/10' },
      { dec: '0,004', frac: '4/1000' }
    ];
    const item = pool[getRandomInt(0, pool.length - 1)];
    return {
      title: "3. Δεκαδικοί σε Δεκαδικά Κλάσματα",
      prompt: `Γράψε τον δεκαδικό αριθμό ${item.dec} ως δεκαδικό κλάσμα (π.χ. 25/100):`,
      type: 'input',
      correct: item.frac,
      explain: `Ο αριθμός ${item.dec} έχει ${item.dec.split(',')[1].length} δεκαδικά ψηφία, άρα γράφεται ως ${item.frac}.`
    };
  },

  // 4. Σύγκριση Δεκαδικών Αριθμών
  () => {
    const base = getRandomInt(5, 40);
    const d1 = Number((base + getRandomInt(1, 9) / 10).toFixed(2));
    const d2 = Number((base + getRandomInt(11, 95) / 100).toFixed(2));
    const sym = d1 > d2 ? '>' : d1 < d2 ? '<' : '＝';
    return {
      title: "4. Σύγκριση Δεκαδικών",
      prompt: `Σύγκρινε τους δεκαδικούς αριθμούς: ${d1.toString().replace('.', ',')} ___ ${d2.toString().replace('.', ',')}`,
      type: 'mcq',
      options: ['>', '<', '＝'],
      correct: sym,
      explain: `Συγκρίνοντας τα δέκατα και τα εκατοστά, έχουμε: ${d1.toString().replace('.', ',')} ${sym} ${d2.toString().replace('.', ',')}.`
    };
  },

  // 5. Πρόσθεση Φυσικών Αριθμών
  () => {
    const a = getRandomInt(1250, 8900);
    const b = getRandomInt(1100, 7800);
    const res = a + b;
    return {
      title: "5. Πρόσθεση Φυσικών Αριθμών",
      prompt: `Υπολόγισε το άθροισμα: ${a.toLocaleString('el-GR')} ＋ ${b.toLocaleString('el-GR')} ＝`,
      type: 'input',
      correct: String(res),
      explain: `${a.toLocaleString('el-GR')} ＋ ${b.toLocaleString('el-GR')} ＝ ${res.toLocaleString('el-GR')}.`
    };
  },

  // 6. Πολλαπλασιασμός Φυσικών Αριθμών
  () => {
    const a = getRandomInt(24, 85);
    const b = getRandomInt(12, 45);
    const res = a * b;
    return {
      title: "6. Πολλαπλασιασμός Φυσικών",
      prompt: `Υπολόγισε το γινόμενο: ${a} × ${b} ＝`,
      type: 'input',
      correct: String(res),
      explain: `${a} × ${b} ＝ ${res}.`
    };
  },

  // 7. Πολλαπλασιασμός με Δυνάμεις του 10 (10, 100, 1000)
  () => {
    const dec = Number((getRandomInt(12, 85) / 10).toFixed(2));
    const mult = [10, 100, 1000][getRandomInt(0, 2)];
    const res = Number((dec * mult).toFixed(2));
    return {
      title: "7. Πολλαπλασιασμός με Δυνάμεις του 10",
      prompt: `Υπολόγισε το γινόμενο: ${dec.toString().replace('.', ',')} × ${mult} ＝`,
      type: 'input',
      correct: res.toString().replace('.', ','),
      explain: `Μετακινούμε την υποδιαστολή ${mult === 10 ? '1 θέση' : mult === 100 ? '2 θέσεις' : '3 θέσεις'} δεξιά: ${res.toString().replace('.', ',')}.`
    };
  },

  // 8. Διαίρεση Φυσικών (Ευκλείδεια διαίρεση / Υπόλοιπο)
  () => {
    const divisor = getRandomInt(4, 9);
    const quotient = getRandomInt(12, 28);
    const remainder = getRandomInt(1, divisor - 1);
    const dividend = divisor * quotient + remainder;
    return {
      title: "8. Διαίρεση Φυσικών",
      prompt: `Στη διαίρεση ${dividend} : ${divisor}, ποιο είναι το υπόλοιπο;`,
      type: 'input',
      correct: String(remainder),
      explain: `${dividend} ＝ (${divisor} × ${quotient}) ＋ ${remainder}, άρα το υπόλοιπο είναι ${remainder}.`
    };
  },

  // 9. Διαίρεση με Δυνάμεις του 10
  () => {
    const num = getRandomInt(25, 950);
    const div = [10, 100, 1000][getRandomInt(0, 2)];
    const res = Number((num / div).toFixed(3));
    return {
      title: "9. Διαίρεση με Δυνάμεις του 10",
      prompt: `Υπολόγισε το πηλίκο: ${num} : ${div} ＝`,
      type: 'input',
      correct: res.toString().replace('.', ','),
      explain: `Μετακινούμε την υποδιαστολή αριστερά: ${num} : ${div} ＝ ${res.toString().replace('.', ',')}.`
    };
  },

  // 10. Προτεραιότητα Πράξεων
  () => {
    const a = getRandomInt(3, 8);
    const b = getRandomInt(2, 6);
    const c = getRandomInt(2, 5);
    const d = getRandomInt(1, 4);
    const res = a + b * c - d;
    return {
      title: "10. Προτεραιότητα Πράξεων",
      prompt: `Υπολόγισε την τιμή της αριθμητικής παράστασης: ${a} ＋ ${b} × ${c} － ${d} ＝`,
      type: 'input',
      correct: String(res),
      explain: `Πρώτα ο πολλαπλασιασμός (${b} × ${c} ＝ ${b * c}) και μετά οι προσθέσεις/αφαιρέσεις από αριστερά προς τα δεξιά: ${a} ＋ ${b * c} － ${d} ＝ ${res}.`
    };
  },

  // 11. Προβλήματα
  () => {
    const items = getRandomInt(4, 8);
    const pricePer = getRandomInt(3, 7);
    const paid = 50;
    const totalCost = items * pricePer;
    const change = paid - totalCost;
    return {
      title: "11. Προβλήματα",
      prompt: `Αγοράσαμε ${items} τετράδια προς ${pricePer}€ το καθένα και πληρώσαμε με χαρτονόμισμα των ${paid}€. Πόσα ρέστα θα πάρουμε;`,
      type: 'input',
      correct: String(change),
      explain: `Κόστος: ${items} × ${pricePer} ＝ ${totalCost}€. Ρέστα: ${paid} － ${totalCost} ＝ ${change}€.`
    };
  },

  // 12. Στρογγυλοποίηση Αριθμών
  () => {
    const num = getRandomInt(1250, 8950);
    const rounded = Math.round(num / 100) * 100;
    return {
      title: "12. Στρογγυλοποίηση Αριθμών",
      prompt: `Στρογγυλοποίησε τον αριθμό ${num.toLocaleString('el-GR')} στην πλησιέστερη εκατοντάδα:`,
      type: 'input',
      correct: String(rounded),
      explain: `Κοιτάμε το ψηφίο των δεκάδων (${Math.floor((num % 100) / 10)}). Ο αριθμός στρογγυλοποιείται στο ${rounded.toLocaleString('el-GR')}.`
    };
  },

  // 13. Διαιρέτες Αριθμού
  () => {
    const num = [18, 20, 24, 28, 30, 36][getRandomInt(0, 5)];
    const divs = [];
    for (let i = 1; i <= num; i++) {
      if (num % i === 0) divs.push(i);
    }
    const count = divs.length;
    return {
      title: "13. Διαιρέτες Αριθμού",
      prompt: `Πόσους διαιρέτες έχει συνολικά ο αριθμός ${num};`,
      type: 'input',
      correct: String(count),
      explain: `Οι διαιρέτες του ${num} είναι οι: ${divs.join(', ')} (σύνολο: ${count}).`
    };
  },

  // 14. Μέγιστος Κοινός Διαιρέτης (ΜΚΔ)
  () => {
    const g = [3, 4, 6, 8, 12][getRandomInt(0, 4)];
    const a = g * getRandomInt(2, 4);
    const b = g * getRandomInt(5, 7);
    const trueGcd = gcd(a, b);
    return {
      title: "14. Μέγιστος Κοινός Διαιρέτης (ΜΚΔ)",
      prompt: `Βρες τον Μ.Κ.Δ. των αριθμών (${a}, ${b}):`,
      type: 'input',
      correct: String(trueGcd),
      explain: `Ο μεγαλύτερος κοινός διαιρέτης του ${a} και του ${b} είναι το ${trueGcd}.`
    };
  },

  // 15. Κριτήρια Διαιρετότητας
  () => {
    const lastDigits = [0, 2, 4, 5, 8];
    const targetDiv = [2, 3, 5, 9, 10][getRandomInt(0, 4)];
    let n;
    if (targetDiv === 3) n = 147;
    else if (targetDiv === 9) n = 378;
    else if (targetDiv === 5) n = 245;
    else if (targetDiv === 10) n = 480;
    else n = 356;

    return {
      title: "15. Κριτήρια Διαιρετότητας",
      prompt: `Ποιος από τους παρακάτω αριθμούς διαιρείται ακριβώς με το ${targetDiv};`,
      type: 'mcq',
      options: shuffle([String(n), String(n + 1), String(n + 2), String(n - 1)]),
      correct: String(n),
      explain: `Ο αριθμός ${n} ικανοποιεί το κριτήριο διαιρετότητας του ${targetDiv}.`
    };
  },

  // 16. Πρώτοι - Σύνθετοι Αριθμοί
  () => {
    const primes = [13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
    const composites = [15, 21, 25, 27, 33, 35, 39, 45, 49];
    const chosenPrime = primes[getRandomInt(0, primes.length - 1)];
    const wrongs = shuffle(composites).slice(0, 3);
    return {
      title: "16. Πρώτοι & Σύνθετοι Αριθμοί",
      prompt: "Ποιος από τους παρακάτω αριθμούς είναι ΠΡΩΤΟΣ αριθμός;",
      type: 'mcq',
      options: shuffle([String(chosenPrime), ...wrongs.map(String)]),
      correct: String(chosenPrime),
      explain: `Ο αριθμός ${chosenPrime} διαιρείται μόνο με το 1 και τον εαυτό του, άρα είναι πρώτος αριθμός.`
    };
  },

  // 17. Παραγοντοποίηση Φυσικών Αριθμών
  () => {
    const list = [
      { num: 24, fact: '2³ × 3' },
      { num: 36, fact: '2² × 3²' },
      { num: 40, fact: '2³ × 5' },
      { num: 60, fact: '2² × 3 × 5' },
      { num: 72, fact: '2³ × 3²' }
    ];
    const item = list[getRandomInt(0, list.length - 1)];
    return {
      title: "17. Παραγοντοποίηση Φυσικών",
      prompt: `Ποια είναι η ανάλυση του αριθμού ${item.num} σε γινόμενο πρώτων παραγόντων;`,
      type: 'mcq',
      options: shuffle([item.fact, '2 × 3 × 5', '2⁴ × 3', '3³ × 2']),
      correct: item.fact,
      explain: `Η ανάλυση του ${item.num} σε πρώτους παράγοντες είναι: ${item.fact}.`
    };
  },

  // 18. Πολλαπλάσια Αριθμού
  () => {
    const n = getRandomInt(6, 12);
    const k = getRandomInt(4, 9);
    const mult = n * k;
    return {
      title: "18. Πολλαπλάσια Αριθμού",
      prompt: `Ποιο από τα παρακάτω είναι πολλαπλάσιο του ${n};`,
      type: 'mcq',
      options: shuffle([String(mult), String(mult + 1), String(mult - 2), String(mult + 3)]),
      correct: String(mult),
      explain: `${n} × ${k} ＝ ${mult}, επομένως το ${mult} είναι πολλαπλάσιο του ${n}.`
    };
  },

  // 19. Ελάχιστο Κοινό Πολλαπλάσιο (ΕΚΠ)
  () => {
    const a = [3, 4, 6, 8][getRandomInt(0, 3)];
    const b = [5, 6, 9, 10][getRandomInt(0, 3)];
    const trueLcm = lcm(a, b);
    return {
      title: "19. Ελάχιστο Κοινό Πολλαπλάσιο (ΕΚΠ)",
      prompt: `Βρες το Ε.Κ.Π. των αριθμών (${a}, ${b}):`,
      type: 'input',
      correct: String(trueLcm),
      explain: `Το Ε.Κ.Π.(${a}, ${b}) είναι το ${trueLcm}.`
    };
  },

  // 20. ΕΚΠ - Αλγόριθμος Πρώτοι Αριθμοί
  () => {
    const a = 12;
    const b = 18;
    const res = lcm(a, b);
    return {
      title: "20. ΕΚΠ με Πρώτους Αριθμούς",
      prompt: `Χρησιμοποιώντας τις αναλύσεις 12 ＝ 2² × 3 και 18 ＝ 2 × 3², ποιο είναι το Ε.Κ.Π.(12, 18);`,
      type: 'mcq',
      options: shuffle(['36', '18', '72', '6']),
      correct: '36',
      explain: `Παίρνουμε τους κοινούς και μη κοινούς παράγοντες με τον μεγαλύτερο εκθέτη: 2² × 3² ＝ 4 × 9 ＝ 36.`
    };
  },

  // 21. Δύναμη φυσικού Αριθμού
  () => {
    const base = getRandomInt(2, 5);
    const exp = base === 2 ? getRandomInt(3, 6) : base === 3 ? getRandomInt(2, 4) : getRandomInt(2, 3);
    const res = Math.pow(base, exp);
    return {
      title: "21. Δύναμη Φυσικού Αριθμού",
      prompt: `Υπολόγισε την τιμή της δύναμης: ${base}${exponentsUnicode[exp]} ＝`,
      type: 'input',
      correct: String(res),
      explain: `${base}${exponentsUnicode[exp]} ＝ ${Array(exp).fill(base).join(' × ')} ＝ ${res}.`
    };
  },

  // 22. Δυνάμεις του 10
  () => {
    const exp = getRandomInt(3, 6);
    const val = Math.pow(10, exp);
    return {
      title: "22. Δυνάμεις του 10",
      prompt: `Πόσα μηδενικά ακολουθούν μετά το 1 στον αριθμό 10${exponentsUnicode[exp]};`,
      type: 'input',
      correct: String(exp),
      explain: `Στη δύναμη 10${exponentsUnicode[exp]} ο εκθέτης είναι ${exp}, άρα ακολουθούν ${exp} μηδενικά (${val.toLocaleString('el-GR')}).`
    };
  },

  // 23. Κλάσματα (Έννοια όρων)
  () => {
    const n = getRandomInt(2, 7);
    const d = getRandomInt(n + 1, 10);
    return {
      title: "23. Η Έννοια του Κλάσματος",
      prompt: `Στο κλάσμα ${n}/${d}, ποιος αριθμός δείχνει σε πόσα ίσα μέρη χωρίσαμε τη μονάδα (παρονομαστής);`,
      type: 'input',
      correct: String(d),
      explain: `Ο παρονομαστής είναι ο κάτω αριθμός (${d}) και δείχνει σε πόσα ίσα μέρη χωρίστηκε η μονάδα.`
    };
  },

  // 24. Κλάσματα σε Δεκαδικό
  () => {
    const list = [
      { n: 1, d: 2, dec: '0,5' },
      { n: 1, d: 4, dec: '0,25' },
      { n: 3, d: 4, dec: '0,75' },
      { n: 2, d: 5, dec: '0,4' },
      { n: 4, d: 5, dec: '0,8' }
    ];
    const item = list[getRandomInt(0, list.length - 1)];
    return {
      title: "24. Κλάσμα σε Δεκαδικό",
      prompt: `Μετάτρεψε το κλάσμα ${item.n}/${item.d} σε δεκαδικό αριθμό (π.χ. 0,5):`,
      type: 'input',
      correct: item.dec,
      explain: `${item.n}/${item.d} ＝ ${item.n} : ${item.d} ＝ ${item.dec}.`
    };
  },

  // 25. Ισοδύναμα Κλάσματα & Ανάγωγα
  () => {
    const simpN = getRandomInt(1, 3);
    const simpD = getRandomInt(simpN + 1, 5);
    const m = getRandomInt(2, 5);
    const origN = simpN * m;
    const origD = simpD * m;
    return {
      title: "25. Ισοδύναμα & Ανάγωγα Κλάσματα",
      prompt: `Απλοποίησε το κλάσμα ${origN}/${origD} στην ανάγωγη μορφή του (π.χ. 2/3):`,
      type: 'input',
      correct: `${simpN}/${simpD}`,
      explain: `Διαιρούμε και τους δύο όρους με το ${m} (Μ.Κ.Δ.): ${origN}/${origD} ＝ ${simpN}/${simpD}.`
    };
  },

  // 26. Σύγκριση Κλασμάτων
  () => {
    const pairs = [
      { n1: 2, d1: 3, n2: 3, d2: 4, sym: '<' },
      { n1: 3, d1: 5, n2: 2, d2: 5, sym: '>' },
      { n1: 2, d1: 3, n2: 2, d2: 5, sym: '>' },
      { n1: 4, d1: 6, n2: 2, d2: 3, sym: '＝' }
    ];
    const item = pairs[getRandomInt(0, pairs.length - 1)];
    return {
      title: "26. Σύγκριση Κλασμάτων",
      prompt: `Σύγκρινε τα κλάσματα: ${item.n1}/${item.d1} ___ ${item.n2}/${item.d2}`,
      type: 'mcq',
      options: ['>', '<', '＝'],
      correct: item.sym,
      explain: `Μετατρέποντας σε ομώνυμα (ή χιαστί), ισχύει: ${item.n1}/${item.d1} ${item.sym} ${item.n2}/${item.d2}.`
    };
  },

  // 27. Πρόσθεση Κλασμάτων
  () => {
    const d = getRandomInt(5, 9);
    const n1 = getRandomInt(1, 3);
    const n2 = getRandomInt(1, d - n1 - 1);
    const resN = n1 + n2;
    const g = gcd(resN, d);
    return {
      title: "27. Πρόσθεση Κλασμάτων",
      prompt: `Υπολόγισε το άθροισμα: ${n1}/${d} ＋ ${n2}/${d} ＝ (π.χ. 3/7)`,
      type: 'input',
      correct: `${resN}/${d}`,
      altCorrect: `${resN / g}/${d / g}`,
      explain: `${n1}/${d} ＋ ${n2}/${d} ＝ (${n1} ＋ ${n2})/${d} ＝ ${resN}/${d}${g > 1 ? ` (ή ανάγωγο: ${resN / g}/${d / g})` : ''}.`
    };
  },

  // 28. Αφαίρεση Κλασμάτων
  () => {
    const d = getRandomInt(6, 10);
    const n1 = getRandomInt(4, d);
    const n2 = getRandomInt(1, n1 - 1);
    const resN = n1 - n2;
    const g = gcd(resN, d);
    return {
      title: "28. Αφαίρεση Κλασμάτων",
      prompt: `Υπολόγισε τη διαφορά: ${n1}/${d} － ${n2}/${d} ＝ (π.χ. 2/7)`,
      type: 'input',
      correct: `${resN}/${d}`,
      altCorrect: `${resN / g}/${d / g}`,
      explain: `${n1}/${d} － ${n2}/${d} ＝ (${n1} － ${n2})/${d} ＝ ${resN}/${d}${g > 1 ? ` (ή ανάγωγο: ${resN / g}/${d / g})` : ''}.`
    };
  },

  // 29. Πολλαπλασιασμός Κλασμάτων
  () => {
    const n1 = getRandomInt(1, 3);
    const d1 = getRandomInt(3, 5);
    const n2 = getRandomInt(1, 3);
    const d2 = getRandomInt(3, 5);
    const pN = n1 * n2;
    const pD = d1 * d2;
    const g = gcd(pN, pD);
    return {
      title: "29. Πολλαπλασιασμός Κλασμάτων",
      prompt: `Υπολόγισε το γινόμενο: (${n1}/${d1}) × (${n2}/${d2}) ＝ (π.χ. 2/15)`,
      type: 'input',
      correct: `${pN}/${pD}`,
      altCorrect: `${pN / g}/${pD / g}`,
      explain: `(${n1}/${d1}) × (${n2}/${d2}) ＝ (${n1} × ${n2})/(${d1} × ${d2}) ＝ ${pN}/${pD}${g > 1 ? ` (ή ανάγωγο: ${pN / g}/${pD / g})` : ''}.`
    };
  },

  // 30. Διαίρεση Κλασμάτων
  () => {
    const n1 = getRandomInt(1, 3);
    const d1 = getRandomInt(2, 4);
    const n2 = getRandomInt(1, 2);
    const d2 = getRandomInt(3, 5);
    const rN = n1 * d2;
    const rD = d1 * n2;
    const g = gcd(rN, rD);
    return {
      title: "30. Διαίρεση Κλασμάτων",
      prompt: `Υπολόγισε το πηλίκο: (${n1}/${d1}) : (${n2}/${d2}) ＝ (π.χ. 5/3)`,
      type: 'input',
      correct: `${rN}/${rD}`,
      altCorrect: `${rN / g}/${rD / g}`,
      explain: `(${n1}/${d1}) : (${n2}/${d2}) ＝ (${n1}/${d1}) × (${d2}/${n2}) ＝ ${rN}/${rD}${g > 1 ? ` (ή ανάγωγο: ${rN / g}/${rD / g})` : ''}.`
    };
  }
];

export default function Epanalipsi1Page() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewTest = () => {
    // Επιλογή ακριβώς μίας τυχαίας ερώτησης από κάθε γεννήτρια (1 έως 30)
    const generated = CHAPTER_GENERATORS.map((gen, index) => {
      const q = gen();
      return { ...q, id: `q${index + 1}`, chapterNum: index + 1 };
    });
    
    const initialAnswers = {};
    generated.forEach(q => {
      initialAnswers[q.id] = '';
    });

    setQuestions(generated);
    setAnswers(initialAnswers);
    setSubmitted(false);
    setScore(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    loadNewTest();
  }, []);

  const handleInputChange = (id, val) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [id]: val }));
  };

  const isQuestionCorrect = (q) => {
    const ans = answers[q.id];
    if (typeof ans !== 'string' || !ans.trim()) return false;

    const cleanAns = ans.replace(/\./g, ',').replace(/\s+/g, '').trim().toLowerCase();
    const cleanCorrect = q.correct.replace(/\./g, ',').replace(/\s+/g, '').trim().toLowerCase();
    const cleanAlt = q.altCorrect ? q.altCorrect.replace(/\./g, ',').replace(/\s+/g, '').trim().toLowerCase() : null;

    return cleanAns === cleanCorrect || (cleanAlt && cleanAns === cleanAlt);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted) return;

    let total = 0;
    questions.forEach(q => {
      if (isQuestionCorrect(q)) total += 1;
    });

    setScore(total);
    setSubmitted(true);
  };

  const answeredCount = Object.values(answers).filter(val => typeof val === 'string' && val.trim() !== '').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between pb-36">
      <Head>
        <title>🏆 Μεγάλη Επανάληψη (Κεφάλαια 1 - 30) - ΣΤ' Δημοτικού | LearnMaths.gr</title>
        <meta name="description" content="Πλήρες επαναληπτικό διαγώνισμα 30 ερωτήσεων στα μαθηματικά της ΣΤ' Δημοτικού (Κεφάλαια 1-30) με αυτόματη βαθμολόγηση." />
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* 1. STICKY NAVBAR */}
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
          <div className={`${LAYOUT.CONTAINER} py-3.5 flex justify-between items-center`}>
            <Link href="/st-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight flex items-center">
              <span>LearnMaths</span><span className="text-indigo-600">.gr</span>
            </Link>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block bg-indigo-50 border border-indigo-200 text-indigo-700 px-3 py-1.5 rounded-xl text-xs font-black">
                📝 30 Ερωτήσεις
              </span>
              <Link 
                href="/st-dimotikou" 
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition"
              >
                <span>🔙</span> <span>Πίσω</span>
              </Link>
            </div>
          </div>
        </nav>

        {/* 2. HERO BANNER */}
        <section className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white py-10 px-4 shadow-inner">
          <div className={`${LAYOUT.CONTAINER} flex flex-col md:flex-row justify-between items-center gap-6`}>
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-blue-100 border border-white/20">
                <span>🏆 1 Επαναληπτικο Τεστ • ΣΤ' Δημοτικου</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                Μεγάλη Επανάληψη: Κεφάλαια 1 έως 30
              </h1>
              <p className="text-blue-100 text-sm md:text-base max-w-2xl">
                30 τυχαία επιλεγμένες ασκήσεις που καλύπτουν όλες τις έννοιες: φυσικούς, δεκαδικούς, διαιρετότητα, πρώτους αριθμούς, δυνάμεις και πράξεις κλασμάτων!
              </p>
            </div>

            <button
              type="button"
              onClick={loadNewTest}
              className="px-6 py-3.5 bg-amber-400 text-slate-900 hover:bg-amber-300 rounded-2xl font-black shadow-lg transition transform active:scale-95 text-sm flex items-center gap-2 shrink-0"
            >
              <span>🔄</span> <span>Νέο Τυχαίο Τεστ</span>
            </button>
          </div>
        </section>

        {/* 3. MAIN FORM WITH 30 QUESTIONS */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-10`}>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {questions.map((q) => {
                const isCorrect = submitted && isQuestionCorrect(q);
                const isWrong = submitted && !isCorrect;

                return (
                  <div
                    key={q.id}
                    className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                      !submitted
                        ? 'bg-white border-slate-200 shadow-sm hover:shadow-md'
                        : isCorrect
                        ? 'bg-emerald-50/70 border-emerald-400 shadow-md ring-1 ring-emerald-400'
                        : 'bg-rose-50/70 border-rose-400 shadow-md ring-1 ring-rose-400'
                    }`}
                  >
                    <div>
                      {/* Κεφαλίδα Κάρτας */}
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[11px] font-black px-2.5 py-1 bg-indigo-50 text-indigo-800 rounded-xl border border-indigo-100">
                          {q.title}
                        </span>
                        {submitted && (
                          <span className="text-base">{isCorrect ? '✅' : '❌'}</span>
                        )}
                      </div>

                      {/* Ερώτηση */}
                      <p className="text-sm font-semibold text-slate-800 leading-relaxed mb-4">
                        {q.prompt}
                      </p>
                    </div>

                    {/* Επιλογές ή Πεδίο Εισαγωγής */}
                    <div className="space-y-3">
                      {q.type === 'mcq' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt, idx) => (
                            <button
                              key={idx}
                              type="button"
                              disabled={submitted}
                              onClick={() => handleInputChange(q.id, opt)}
                              className={`p-2.5 rounded-xl text-xs font-bold border transition text-center ${
                                answers[q.id] === opt
                                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-indigo-50'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <input
                          type="text"
                          disabled={submitted}
                          value={answers[q.id]}
                          onChange={(e) => handleInputChange(q.id, e.target.value)}
                          placeholder="Γράψε την απάντηση..."
                          className="w-full p-2.5 bg-white border-2 border-slate-200 rounded-xl font-bold text-center text-base focus:border-indigo-500 outline-none disabled:bg-slate-100 font-mono"
                        />
                      )}

                      {/* Επεξήγηση μετά την υποβολή */}
                      {submitted && (
                        <div className={`p-3 rounded-xl text-xs font-medium ${isCorrect ? 'bg-emerald-100/70 text-emerald-900' : 'bg-rose-100/70 text-rose-900'}`}>
                          💡 {q.explain}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
            {!submitted && (
              <div className="flex justify-center pt-8">
                <button
                  type="submit"
                  className="bg-[#10b981] hover:bg-[#059669] text-white text-base md:text-lg font-black px-10 py-4 rounded-2xl shadow-xl transition transform hover:scale-105 active:scale-95 flex items-center gap-2.5"
                >
                  <span className="text-2xl">🎯</span>
                  <span>Ολοκλήρωση & Βαθμολόγηση Τεστ</span>
                </button>
              </div>
            )}
          </form>
        </main>
      </div>

      {/* 4. FIXED STICKY BOTTOM PROGRESS FOOTER */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-4 px-6 z-50">
        <div className={`${LAYOUT.CONTAINER} flex flex-col md:flex-row justify-between items-center gap-3`}>
          
          {/* ΑΡΙΣΤΕΡΑ: SCORE & PROGRESS BADGE */}
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-900 font-black px-4 py-2 rounded-xl text-base md:text-lg flex items-center gap-2 shadow-sm">
              <span>🏆</span>
              <span>{submitted ? 'Τελικό Σκορ:' : 'Απαντήθηκαν:'}</span>
              <span className="font-mono text-xl md:text-2xl">
                {submitted ? `${score} / 30` : `${answeredCount} / 30`}
              </span>
            </div>
            {submitted && (
              <span className="text-sm font-bold text-slate-300">
                Ποσοστό Επιτυχίας: <span className="text-emerald-400 font-black">{Math.round((score / 30) * 100)}%</span>
              </span>
            )}
          </div>

          {/* ΔΕΞΙΑ: STATUS OR RETRY BUTTON */}
          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                type="button"
                onClick={loadNewTest}
                className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-black px-6 py-2.5 rounded-xl shadow-md transition text-sm flex items-center gap-2"
              >
                <span>🔄</span>
                <span>Παίξε ξανά με 30 νέες ασκήσεις!</span>
              </button>
            ) : (
              <p className="text-xs md:text-sm text-slate-400 hidden sm:block">
                Απάντησε σε όλες τις ερωτήσεις και πάτα «Ολοκλήρωση & Βαθμολόγηση Τεστ»!
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
