// pages/st-dimotikou/epanalipsi-1.js
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

function gcd(a, b) {
  let x = Math.abs(a || 0);
  let y = Math.abs(b || 0);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

function lcm(a, b) {
  if (!a || !b) return 1;
  return Math.abs(a * b) / gcd(a, b);
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

// Μορφοποίηση αριθμών με ελληνικό locale
function formatNum(num) {
  if (num === null || num === undefined || isNaN(Number(num))) return '0';
  return Number(num).toLocaleString('el-GR');
}

const exponentsUnicode = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', 10: '¹⁰' };

// =========================================================
// ΔΕΞΑΜΕΝΗ ΓΕΝΝΗΤΡΙΩΝ ΓΙΑ ΤΑ 30 ΚΕΦΑΛΑΙΑ
// =========================================================
const CHAPTER_GENERATORS = [
  // 1. Φυσικοί Αριθμοί (Αξία θέσης ψηφίου)
  () => {
    const digits = [3, 4, 5, 6, 7, 8, 9];
    const posNames = [
      { name: 'εκατοντάδων χιλιάδων', mult: 100000 },
      { name: 'δεκάδων χιλιάδων', mult: 10000 },
      { name: 'μονάδων εκατομμυρίων', mult: 1000000 },
      { name: 'εκατοντάδων', mult: 100 }
    ];
    const pos = posNames[randInt(0, posNames.length - 1)];
    const d = digits[randInt(0, digits.length - 1)];
    const correctVal = d * pos.mult;
    const correctStr = correctVal.toLocaleString('el-GR');
    const options = shuffle([...new Set([
      correctStr,
      (correctVal / 10).toLocaleString('el-GR'),
      (correctVal * 10).toLocaleString('el-GR'),
      String(d)
    ])]);
    return {
      title: '1. Φυσικοί Αριθμοί',
      prompt: `Ποια είναι η πραγματική αξία του ψηφίου ${d} όταν βρίσκεται στη θέση των ${pos.name};`,
      type: 'mcq',
      options,
      correct: correctStr,
      explain: `Στη θέση των ${pos.name}, το ψηφίο ${d} έχει αξία ${d} · ${pos.mult.toLocaleString('el-GR')} ＝ ${correctStr}.`
    };
  },

  // 2. Δεκαδικοί Αριθμοί (Αξία δεκαδικών ψηφίων)
  () => {
    const num = (randInt(10, 80) + randInt(105, 995) / 1000).toFixed(3);
    const parts = num.split('.');
    const decDigits = parts[1].split('');
    const targetIdx = randInt(0, 2);
    const targetDigit = decDigits[targetIdx];
    const names = ['δέκατα', 'εκατοστά', 'χιλιοστά'];
    const multipliers = ['0,1', '0,01', '0,001'];
    return {
      title: '2. Δεκαδικοί Αριθμοί',
      prompt: `Στον δεκαδικό αριθμό ${num.replace('.', ',')}, ποια θέση κατέχει το ψηφίο ${targetDigit};`,
      type: 'mcq',
      options: shuffle([...new Set([names[targetIdx], names[(targetIdx + 1) % 3], names[(targetIdx + 2) % 3], 'μονάδες'])]),
      correct: names[targetIdx],
      explain: `Το ${targetDigit} είναι το ${targetIdx + 1}ο ψηφίο μετά την υποδιαστολή, άρα εκφράζει ${names[targetIdx]} (αξία θέσης: ${targetDigit} · ${multipliers[targetIdx]}).`
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
    const item = pool[randInt(0, pool.length - 1)];
    return {
      title: '3. Δεκαδικοί σε Δεκαδικά Κλάσματα',
      prompt: `Γράψε τον δεκαδικό αριθμό ${item.dec} ως δεκαδικό κλάσμα (π.χ. 25/100):`,
      type: 'input',
      inputType: 'fraction',
      correct: item.frac,
      explain: `Ο αριθμός ${item.dec} έχει ${item.dec.split(',')[1].length} δεκαδικά ψηφία, άρα γράφεται ως ${item.frac}.`
    };
  },

  // 4. Σύγκριση Δεκαδικών Αριθμών
  () => {
    const base = randInt(5, 40);
    const d1 = Number((base + randInt(1, 9) / 10).toFixed(2));
    const d2 = Number((base + randInt(11, 95) / 100).toFixed(2));
    const sym = d1 > d2 ? '＞' : d1 < d2 ? '＜' : '＝';
    return {
      title: '4. Σύγκριση Δεκαδικών',
      prompt: `Σύγκρινε τους δεκαδικούς αριθμούς: ${d1.toString().replace('.', ',')} ___ ${d2.toString().replace('.', ',')}`,
      type: 'mcq',
      options: ['＞', '＜', '＝'],
      correct: sym,
      explain: `Συγκρίνοντας τα δέκατα και τα εκατοστά, ισχύει: ${d1.toString().replace('.', ',')} ${sym} ${d2.toString().replace('.', ',')}.`
    };
  },

  // 5. Πρόσθεση Φυσικών Αριθμών
  () => {
    const a = randInt(1250, 8900);
    const b = randInt(1100, 7800);
    const res = a + b;
    return {
      title: '5. Πρόσθεση Φυσικών Αριθμών',
      prompt: `Υπολόγισε το άθροισμα: ${a.toLocaleString('el-GR')} ＋ ${b.toLocaleString('el-GR')} ＝`,
      type: 'input',
      inputType: 'number',
      correct: String(res),
      explain: `${a.toLocaleString('el-GR')} ＋ ${b.toLocaleString('el-GR')} ＝ ${res.toLocaleString('el-GR')}.`
    };
  },

  // 6. Πολλαπλασιασμός Φυσικών Αριθμών
  () => {
    const a = randInt(24, 85);
    const b = randInt(12, 45);
    const res = a * b;
    return {
      title: '6. Πολλαπλασιασμός Φυσικών',
      prompt: `Υπολόγισε το γινόμενο: ${a} · ${b} ＝`,
      type: 'input',
      inputType: 'number',
      correct: String(res),
      explain: `${a} · ${b} ＝ ${res.toLocaleString('el-GR')}.`
    };
  },

  // 7. Πολλαπλασιασμός με Δυνάμεις του 10
  () => {
    const dec = Number((randInt(12, 85) / 10).toFixed(2));
    const mult = [10, 100, 1000][randInt(0, 2)];
    const res = Number((dec * mult).toFixed(2));
    return {
      title: '7. Πολλαπλασιασμός με Δυνάμεις του 10',
      prompt: `Υπολόγισε το γινόμενο: ${dec.toString().replace('.', ',')} · ${mult} ＝`,
      type: 'input',
      inputType: 'decimal',
      correct: res.toString().replace('.', ','),
      explain: `Μετακινούμε την υποδιαστολή ${mult === 10 ? '1 θέση' : mult === 100 ? '2 θέσεις' : '3 θέσεις'} δεξιά: ${res.toString().replace('.', ',')}.`
    };
  },

  // 8. Διαίρεση Φυσικών (Ευκλείδεια διαίρεση / Υπόλοιπο)
  () => {
    const divisor = randInt(4, 9);
    const quotient = randInt(12, 28);
    const remainder = randInt(1, divisor - 1);
    const dividend = divisor * quotient + remainder;
    return {
      title: '8. Διαίρεση Φυσικών (Υπόλοιπο)',
      prompt: `Στη διαίρεση ${dividend} : ${divisor}, ποιο είναι το υπόλοιπο;`,
      type: 'input',
      inputType: 'number',
      correct: String(remainder),
      explain: `${dividend} ＝ (${divisor} · ${quotient}) ＋ ${remainder}, άρα το υπόλοιπο είναι ${remainder}.`
    };
  },

  // 9. Διαίρεση με Δυνάμεις του 10
  () => {
    const num = randInt(25, 950);
    const div = [10, 100, 1000][randInt(0, 2)];
    const res = Number((num / div).toFixed(3));
    return {
      title: '9. Διαίρεση με Δυνάμεις του 10',
      prompt: `Υπολόγισε το πηλίκο: ${num} : ${div} ＝`,
      type: 'input',
      inputType: 'decimal',
      correct: res.toString().replace('.', ','),
      explain: `Μετακινούμε την υποδιαστολή αριστερά: ${num} : ${div} ＝ ${res.toString().replace('.', ',')}.`
    };
  },

  // 10. Προτεραιότητα Πράξεων
  () => {
    const a = randInt(3, 8);
    const b = randInt(2, 6);
    const c = randInt(2, 5);
    const d = randInt(1, 4);
    const res = a + b * c - d;
    return {
      title: '10. Προτεραιότητα Πράξεων',
      prompt: `Υπολόγισε την τιμή της αριθμητικής παράστασης: ${a} ＋ ${b} · ${c} － ${d} ＝`,
      type: 'input',
      inputType: 'number',
      correct: String(res),
      explain: `Πρώτα εκτελούμε τον πολλαπλασιασμό (${b} · ${c} ＝ ${b * c}) και έπειτα τις προσθαφαιρέσεις: ${a} ＋ ${b * c} － ${d} ＝ ${res}.`
    };
  },

  // 11. Προβλήματα Καθημερινότητας
  () => {
    const items = randInt(4, 8);
    const pricePer = randInt(3, 7);
    const paid = 50;
    const totalCost = items * pricePer;
    const change = paid - totalCost;
    return {
      title: '11. Επίλυση Προβλήματος',
      prompt: `Αγοράσαμε ${items} τετράδια προς ${pricePer}€ το καθένα και πληρώσαμε με χαρτονόμισμα των ${paid}€. Πόσα ρέστα θα λάβουμε;`,
      type: 'input',
      inputType: 'number',
      correct: String(change),
      explain: `Κόστος: ${items} · ${pricePer} ＝ ${totalCost}€. Ρέστα: ${paid} － ${totalCost} ＝ ${change}€.`
    };
  },

  // 12. Στρογγυλοποίηση Αριθμών
  () => {
    const num = randInt(1250, 8950);
    const rounded = Math.round(num / 100) * 100;
    return {
      title: '12. Στρογγυλοποίηση Αριθμών',
      prompt: `Στρογγυλοποίησε τον αριθμό ${num.toLocaleString('el-GR')} στην πλησιέστερη εκατοντάδα:`,
      type: 'input',
      inputType: 'number',
      correct: String(rounded),
      explain: `Κοιτάμε το ψηφίο των δεκάδων (${Math.floor((num % 100) / 10)}). Ο αριθμός στρογγυλοποιείται στο ${rounded.toLocaleString('el-GR')}.`
    };
  },

  // 13. Διαιρέτες Αριθμού
  () => {
    const num = [18, 20, 24, 28, 30, 36][randInt(0, 5)];
    const divs = [];
    for (let i = 1; i <= num; i++) {
      if (num % i === 0) divs.push(i);
    }
    const count = divs.length;
    return {
      title: '13. Διαιρέτες Αριθμού',
      prompt: `Πόσους διαιρέτες έχει συνολικά ο αριθμός ${num};`,
      type: 'input',
      inputType: 'number',
      correct: String(count),
      explain: `Οι διαιρέτες του ${num} είναι οι: ${divs.join(', ')} (συνολικά: ${count}).`
    };
  },

  // 14. Μέγιστος Κοινός Διαιρέτης (ΜΚΔ)
  () => {
    const g = [3, 4, 6, 8, 12][randInt(0, 4)];
    const a = g * randInt(2, 4);
    const b = g * randInt(5, 7);
    const trueGcd = gcd(a, b);
    return {
      title: '14. Μέγιστος Κοινός Διαιρέτης (ΜΚΔ)',
      prompt: `Βρες τον Μ.Κ.Δ. των αριθμών (${a}, ${b}):`,
      type: 'input',
      inputType: 'number',
      correct: String(trueGcd),
      explain: `Ο μεγαλύτερος κοινός διαιρέτης των ${a} και ${b} είναι το ${trueGcd}.`
    };
  },

  // 15. Κριτήρια Διαιρετότητας
  () => {
    const targetDiv = [2, 3, 5, 9, 10][randInt(0, 4)];
    let n;
    if (targetDiv === 3) n = 147;
    else if (targetDiv === 9) n = 378;
    else if (targetDiv === 5) n = 245;
    else if (targetDiv === 10) n = 480;
    else n = 356;

    const wrongs = [n + 1, n + 2, n + 4].filter(w => w % targetDiv !== 0);
    const options = shuffle([...new Set([String(n), ...wrongs.map(String)])]).slice(0, 4);
    return {
      title: '15. Κριτήρια Διαιρετότητας',
      prompt: `Ποιος από τους παρακάτω αριθμούς διαιρείται ακριβώς με το ${targetDiv};`,
      type: 'mcq',
      options,
      correct: String(n),
      explain: `Ο αριθμός ${n} διαιρείται ακριβώς με το ${targetDiv} (${n} : ${targetDiv} ＝ ${n / targetDiv}).`
    };
  },

  // 16. Πρώτοι - Σύνθετοι Αριθμοί
  () => {
    const primes = [13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
    const composites = [15, 21, 25, 27, 33, 35, 39, 45, 49];
    const chosenPrime = primes[randInt(0, primes.length - 1)];
    const wrongs = shuffle(composites).slice(0, 3);
    const options = shuffle([...new Set([String(chosenPrime), ...wrongs.map(String)])]);
    return {
      title: '16. Πρώτοι & Σύνθετοι Αριθμοί',
      prompt: 'Ποιος από τους παρακάτω αριθμούς είναι ΠΡΩΤΟΣ αριθμός;',
      type: 'mcq',
      options,
      correct: String(chosenPrime),
      explain: `Ο αριθμός ${chosenPrime} διαιρείται μόνο με το 1 και τον εαυτό του, άρα είναι πρώτος.`
    };
  },

  // 17. Παραγοντοποίηση Φυσικών Αριθμών
  () => {
    const list = [
      { num: 24, fact: '2³ · 3' },
      { num: 36, fact: '2² · 3²' },
      { num: 40, fact: '2³ · 5' },
      { num: 60, fact: '2² · 3 · 5' },
      { num: 72, fact: '2³ · 3²' }
    ];
    const item = list[randInt(0, list.length - 1)];
    const options = shuffle([...new Set([item.fact, '2 · 3 · 5', '2⁴ · 3', '3³ · 2'])]);
    return {
      title: '17. Παραγοντοποίηση Φυσικών',
      prompt: `Ποια είναι η ανάλυση του αριθμού ${item.num} σε γινόμενο πρώτων παραγόντων;`,
      type: 'mcq',
      options,
      correct: item.fact,
      explain: `Η ανάλυση του ${item.num} σε πρώτους παράγοντες είναι: ${item.fact}.`
    };
  },

  // 18. Πολλαπλάσια Αριθμού
  () => {
    const n = randInt(6, 12);
    const k = randInt(4, 9);
    const mult = n * k;
    const wrongs = [mult + 1, mult + 2, mult + 3].filter(w => w % n !== 0);
    const options = shuffle([...new Set([String(mult), ...wrongs.map(String)])]).slice(0, 4);
    return {
      title: '18. Πολλαπλάσια Αριθμού',
      prompt: `Ποιο από τα παρακάτω είναι πολλαπλάσιο του ${n};`,
      type: 'mcq',
      options,
      correct: String(mult),
      explain: `${n} · ${k} ＝ ${mult}, επομένως το ${mult} είναι πολλαπλάσιο του ${n}.`
    };
  },

  // 19. Ελάχιστο Κοινό Πολλαπλάσιο (ΕΚΠ)
  () => {
    const a = [3, 4, 6, 8][randInt(0, 3)];
    const b = [5, 6, 9, 10][randInt(0, 3)];
    const trueLcm = lcm(a, b);
    return {
      title: '19. Ελάχιστο Κοινό Πολλαπλάσιο (ΕΚΠ)',
      prompt: `Βρες το Ε.Κ.Π. των αριθμών (${a}, ${b}):`,
      type: 'input',
      inputType: 'number',
      correct: String(trueLcm),
      explain: `Το Ε.Κ.Π.(${a}, ${b}) είναι το ${trueLcm}.`
    };
  },

  // 20. ΕΚΠ - Αλγόριθμος Πρώτοι Αριθμοί
  () => {
    const options = shuffle([...new Set(['36', '18', '72', '6'])]);
    return {
      title: '20. ΕΚΠ με Πρώτους Αριθμούς',
      prompt: 'Χρησιμοποιώντας τις αναλύσεις 12 ＝ 2² · 3 και 18 ＝ 2 · 3², ποιο είναι το Ε.Κ.Π.(12, 18);',
      type: 'mcq',
      options,
      correct: '36',
      explain: 'Παίρνουμε τους κοινούς και μη κοινούς παράγοντες με τον μεγαλύτερο εκθέτη: 2² · 3² ＝ 4 · 9 ＝ 36.'
    };
  },

  // 21. Δύναμη Φυσικού Αριθμού
  () => {
    const base = randInt(2, 5);
    const exp = base === 2 ? randInt(3, 6) : base === 3 ? randInt(2, 4) : randInt(2, 3);
    const res = Math.pow(base, exp);
    return {
      title: '21. Δύναμη Φυσικού Αριθμού',
      prompt: `Υπολόγισε την τιμή της δύναμης: ${base}${exponentsUnicode[exp]} ＝`,
      type: 'input',
      inputType: 'number',
      correct: String(res),
      explain: `${base}${exponentsUnicode[exp]} ＝ ${Array(exp).fill(base).join(' · ')} ＝ ${res}.`
    };
  },

  // 22. Δυνάμεις του 10
  () => {
    const exp = randInt(3, 6);
    const val = Math.pow(10, exp);
    return {
      title: '22. Δυνάμεις του 10',
      prompt: `Πόσα μηδενικά ακολουθούν μετά το 1 στον αριθμό 10${exponentsUnicode[exp]};`,
      type: 'input',
      inputType: 'number',
      correct: String(exp),
      explain: `Στη δύναμη 10${exponentsUnicode[exp]} ο εκθέτης είναι ${exp}, άρα ακολουθούν ${exp} μηδενικά (${val.toLocaleString('el-GR')}).`
    };
  },

  // 23. Η Έννοια του Κλάσματος
  () => {
    const n = randInt(2, 7);
    const d = randInt(n + 1, 10);
    return {
      title: '23. Η Έννοια του Κλάσματος',
      prompt: `Στο κλάσμα ${n}/${d}, ποιος αριθμός δείχνει σε πόσα ίσα μέρη χωρίσαμε τη μονάδα (παρονομαστής);`,
      type: 'input',
      inputType: 'number',
      correct: String(d),
      explain: `Ο παρονομαστής είναι ο κάτω όρος (${d}) και δείχνει σε πόσα ίσα μέρη χωρίστηκε η μονάδα.`
    };
  },

  // 24. Κλάσμα σε Δεκαδικό
  () => {
    const list = [
      { n: 1, d: 2, dec: '0,5' },
      { n: 1, d: 4, dec: '0,25' },
      { n: 3, d: 4, dec: '0,75' },
      { n: 2, d: 5, dec: '0,4' },
      { n: 4, d: 5, dec: '0,8' }
    ];
    const item = list[randInt(0, list.length - 1)];
    return {
      title: '24. Κλάσμα σε Δεκαδικό',
      prompt: `Μετάτρεψε το κλάσμα ${item.n}/${item.d} σε δεκαδικό αριθμό (π.χ. 0,5):`,
      type: 'input',
      inputType: 'decimal',
      correct: item.dec,
      explain: `${item.n}/${item.d} ＝ ${item.n} : ${item.d} ＝ ${item.dec}.`
    };
  },

  // 25. Ισοδύναμα & Ανάγωγα Κλάσματα
  () => {
    const simpN = randInt(1, 3);
    const simpD = randInt(simpN + 1, 5);
    const m = randInt(2, 5);
    const origN = simpN * m;
    const origD = simpD * m;
    return {
      title: '25. Ισοδύναμα & Ανάγωγα Κλάσματα',
      prompt: `Απλοποίησε το κλάσμα ${origN}/${origD} στην ανάγωγη μορφή του (π.χ. 2/3):`,
      type: 'input',
      inputType: 'fraction',
      correct: `${simpN}/${simpD}`,
      explain: `Διαιρούμε και τους δύο όρους με το ${m} (Μ.Κ.Δ.): ${origN}/${origD} ＝ ${simpN}/${simpD}.`
    };
  },

  // 26. Σύγκριση Κλασμάτων
  () => {
    const pairs = [
      { n1: 2, d1: 3, n2: 3, d2: 4, sym: '＜' },
      { n1: 3, d1: 5, n2: 2, d2: 5, sym: '＞' },
      { n1: 2, d1: 3, n2: 2, d2: 5, sym: '＞' },
      { n1: 4, d1: 6, n2: 2, d2: 3, sym: '＝' }
    ];
    const item = pairs[randInt(0, pairs.length - 1)];
    return {
      title: '26. Σύγκριση Κλασμάτων',
      prompt: `Σύγκρινε τα κλάσματα: ${item.n1}/${item.d1} ___ ${item.n2}/${item.d2}`,
      type: 'mcq',
      options: ['＞', '＜', '＝'],
      correct: item.sym,
      explain: `Μετατρέποντας σε ομώνυμα (ή με χιαστί γινόμενα), ισχύει: ${item.n1}/${item.d1} ${item.sym} ${item.n2}/${item.d2}.`
    };
  },

  // 27. Πρόσθεση Κλασμάτων
  () => {
    const d = randInt(5, 9);
    const n1 = randInt(1, 3);
    const n2 = randInt(1, d - n1 - 1);
    const resN = n1 + n2;
    const g = gcd(resN, d);
    return {
      title: '27. Πρόσθεση Κλασμάτων',
      prompt: `Υπολόγισε το άθροισμα: ${n1}/${d} ＋ ${n2}/${d} ＝ (π.χ. 3/7)`,
      type: 'input',
      inputType: 'fraction',
      correct: `${resN}/${d}`,
      altCorrect: `${resN / g}/${d / g}`,
      explain: `${n1}/${d} ＋ ${n2}/${d} ＝ (${n1} ＋ ${n2})/${d} ＝ ${resN}/${d}${g > 1 ? ` (ή ανάγωγο: ${resN / g}/${d / g})` : ''}.`
    };
  },

  // 28. Αφαίρεση Κλασμάτων
  () => {
    const d = randInt(6, 10);
    const n1 = randInt(4, d);
    const n2 = randInt(1, n1 - 1);
    const resN = n1 - n2;
    const g = gcd(resN, d);
    return {
      title: '28. Αφαίρεση Κλασμάτων',
      prompt: `Υπολόγισε τη διαφορά: ${n1}/${d} － ${n2}/${d} ＝ (π.χ. 2/7)`,
      type: 'input',
      inputType: 'fraction',
      correct: `${resN}/${d}`,
      altCorrect: `${resN / g}/${d / g}`,
      explain: `${n1}/${d} － ${n2}/${d} ＝ (${n1} － ${n2})/${d} ＝ ${resN}/${d}${g > 1 ? ` (ή ανάγωγο: ${resN / g}/${d / g})` : ''}.`
    };
  },

  // 29. Πολλαπλασιασμός Κλασμάτων
  () => {
    const n1 = randInt(1, 3);
    const d1 = randInt(3, 5);
    const n2 = randInt(1, 3);
    const d2 = randInt(3, 5);
    const pN = n1 * n2;
    const pD = d1 * d2;
    const g = gcd(pN, pD);
    return {
      title: '29. Πολλαπλασιασμός Κλασμάτων',
      prompt: `Υπολόγισε το γινόμενο: (${n1}/${d1}) · (${n2}/${d2}) ＝ (π.χ. 2/15)`,
      type: 'input',
      inputType: 'fraction',
      correct: `${pN}/${pD}`,
      altCorrect: `${pN / g}/${pD / g}`,
      explain: `(${n1}/${d1}) · (${n2}/${d2}) ＝ (${n1} · ${n2})/(${d1} · ${d2}) ＝ ${pN}/${pD}${g > 1 ? ` (ή ανάγωγο: ${pN / g}/${pD / g})` : ''}.`
    };
  },

  // 30. Διαίρεση Κλασμάτων
  () => {
    const n1 = randInt(1, 3);
    const d1 = randInt(2, 4);
    const n2 = randInt(1, 2);
    const d2 = randInt(3, 5);
    const rN = n1 * d2;
    const rD = d1 * n2;
    const g = gcd(rN, rD);
    return {
      title: '30. Διαίρεση Κλασμάτων',
      prompt: `Υπολόγισε το πηλίκο: (${n1}/${d1}) : (${n2}/${d2}) ＝ (π.χ. 5/3)`,
      type: 'input',
      inputType: 'fraction',
      correct: `${rN}/${rD}`,
      altCorrect: `${rN / g}/${rD / g}`,
      explain: `(${n1}/${d1}) : (${n2}/${d2}) ＝ (${n1} · ${d2})/(${d1} · ${n2}) ＝ ${rN}/${rD}${g > 1 ? ` (ή ανάγωγο: ${rN / g}/${rD / g})` : ''}.`
    };
  }
];

// ---------------------------------------------------------
// ΚΥΡΙΟ COMPONENT ΣΕΛΙΔΑΣ
// ---------------------------------------------------------

export default function Epanalipsi1Page() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewTest = useCallback(() => {
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
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    loadNewTest();
  }, [loadNewTest]);

  // Χειρισμός απαντήσεων με διαχωρισμό τύπου
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
      } else if (q?.inputType === 'fraction') {
        sanitized = sanitized.replace(/[^0-9/]/g, '');
        const parts = sanitized.split('/');
        if (parts.length > 2) sanitized = parts[0] + '/' + parts.slice(1).join('');
      }
      if (sanitized.length > 12) {
        sanitized = sanitized.slice(0, 12);
      }
      setAnswers(prev => ({ ...prev, [id]: sanitized }));
    } else {
      setAnswers(prev => ({ ...prev, [id]: rawValue }));
    }
  };

  const isQuestionCorrect = (q) => {
    const ans = answers[q.id];
    if (typeof ans !== 'string' || !ans.trim()) return false;

    const cleanAns = ans.replace(/\./g, ',').replace(/\s+/g, '').trim().toLowerCase();
    const cleanCorrect = q.correct.replace(/\./g, ',').replace(/\s+/g, '').trim().toLowerCase();
    const cleanAlt = q.altCorrect ? q.altCorrect.replace(/\./g, ',').replace(/\s+/g, '').trim().toLowerCase() : null;

    if (cleanAns === cleanCorrect || (cleanAlt && cleanAns === cleanAlt)) {
      return true;
    }

    // Για δεκαδικούς αριθμούς: έλεγχος με ανοχή +-0.05
    if (q.inputType === 'decimal') {
      const nAns = parseFloat(cleanAns.replace(',', '.'));
      const nCor = parseFloat(cleanCorrect.replace(',', '.'));
      if (!isNaN(nAns) && !isNaN(nCor) && Math.abs(nAns - nCor) < 0.05) {
        return true;
      }
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

  const answeredCount = Object.values(answers).filter(val => typeof val === 'string' && val.trim() !== '').length;

  return (
    <Layout
      title="Μεγάλη Επανάληψη (Κεφάλαια 1 - 30) - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Πλήρες επαναληπτικό διαγώνισμα 30 ερωτήσεων στα μαθηματικά της ΣΤ' Δημοτικού (Κεφάλαια 1-30) με αυτόματη βαθμολόγηση."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <span className="hidden sm:inline-block bg-indigo-50 border border-indigo-200 text-indigo-700 px-3.5 py-1.5 rounded-xl text-xs font-black">
          📝 30 {toCleanUppercase('Ερωτήσεις')}
        </span>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8 sm:space-y-10">

        {/* 1. HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-sky-200">
                <span>🏆 ΜΕΓΑΛΗ ΕΠΑΝΑΛΗΨΗ • ΚΕΦΑΛΑΙΑ 1 - 30 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Πρώτο Επαναληπτικό Τεστ: Κεφάλαια 1 έως 30
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                30 δυναμικά θέματα που καλύπτουν όλες τις έννοιες: φυσικούς, δεκαδικούς, διαιρετότητα, πρώτους αριθμούς, δυνάμεις και πράξεις κλασμάτων!
              </p>
            </div>

            <button
              type="button"
              onClick={loadNewTest}
              className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-black shadow-lg transition transform active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 shrink-0 touch-manipulation"
            >
              <span>🔄</span>
              <span>{toCleanUppercase('Νέο Τεστ')}</span>
            </button>
          </div>
        </section>

        {/* 2. MAIN FORM WITH 30 QUESTIONS */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 2xl:gap-8">
            {questions.map((q) => {
              const isCorrect = submitted && isQuestionCorrect(q);

              return (
                <div
                  key={q.id}
                  className={`p-5 sm:p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
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
                      <span className="text-[11px] font-black px-2.5 py-1 bg-indigo-50 text-indigo-900 rounded-xl border border-indigo-100 uppercase tracking-wider">
                        {toCleanUppercase(q.title)}
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
                        {q.options.map((opt, optIdx) => (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={submitted}
                            onClick={() => handleAnswerChange(q.id, opt, 'mcq')}
                            className={`p-2.5 rounded-xl text-xs sm:text-sm font-bold border transition text-center touch-manipulation active:scale-95 break-words whitespace-normal leading-snug flex items-center justify-center min-h-[44px] ${
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
                        key={`test-input-${q.id}`}
                        autoComplete="off"
                        spellCheck="false"
                        type="text"
                        inputMode={q.inputType === 'fraction' ? 'text' : q.inputType === 'decimal' ? 'decimal' : 'numeric'}
                        disabled={submitted}
                        value={answers[q.id] || ''}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value, 'input')}
                        placeholder={q.inputType === 'fraction' ? 'π.χ. 3/4' : q.inputType === 'decimal' ? 'π.χ. 0,5' : 'Απάντηση...'}
                        className="w-full p-2.5 bg-white border-2 border-slate-200 rounded-xl font-bold text-center text-base focus:border-indigo-500 outline-none disabled:bg-slate-100 font-mono shadow-inner"
                      />
                    )}

                    {/* Επεξήγηση μετά την υποβολή */}
                    {submitted && (
                      <div className={`p-3 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed ${isCorrect ? 'bg-emerald-100/70 text-emerald-950 border border-emerald-200' : 'bg-rose-100/70 text-rose-950 border border-rose-200'}`}>
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
            <div className="flex justify-center pt-4 sm:pt-6">
              <button
                type="submit"
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-base md:text-lg font-black px-10 py-4 rounded-2xl shadow-xl transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 touch-manipulation"
              >
                <span className="text-2xl">🎯</span>
                <span>{toCleanUppercase('Ολοκλήρωση & Βαθμολόγηση Τεστ')}</span>
              </button>
            </div>
          )}
        </form>

      </div>

      {/* 3. FIXED STICKY BOTTOM PROGRESS FOOTER */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-3.5 sm:py-4 px-4 sm:px-6 z-50">
        <div className={`${LAYOUT.CONTAINER} flex flex-col sm:flex-row justify-between items-center gap-3`}>
          
          {/* ΑΡΙΣΤΕΡΑ: SCORE & PROGRESS BADGE */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-sm sm:text-base md:text-lg flex items-center gap-2 shadow-sm">
              <span>🏆</span>
              <span>{submitted ? toCleanUppercase('Τελικό Σκορ') : toCleanUppercase('Απαντήθηκαν')}:</span>
              <span className="font-mono text-lg sm:text-xl md:text-2xl">
                {submitted ? `${score} / 30` : `${answeredCount} / 30`}
              </span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                {toCleanUppercase('Ποσοστό Επιτυχίας')}:{' '}
                <span className="text-emerald-400 font-black text-sm sm:text-base">
                  {Math.round((score / 30) * 100)}%
                </span>
              </span>
            )}
          </div>

          {/* ΔΕΞΙΑ: STATUS OR RETRY BUTTON */}
          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                type="button"
                onClick={loadNewTest}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2 sm:px-6 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 touch-manipulation"
              >
                <span>🔄</span>
                <span>{toCleanUppercase('Παίξε ξανά με 30 νέες ασκήσεις!')}</span>
              </button>
            ) : (
              <p className="text-xs md:text-sm text-slate-400 hidden sm:block">
                Απάντησε σε όλες τις ερωτήσεις και πάτησε «{toCleanUppercase('Ολοκλήρωση & Βαθμολόγηση Τεστ')}»!
              </p>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}
