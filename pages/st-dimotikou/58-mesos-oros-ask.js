// pages/st-dimotikou/58-mesos-oros-ask.js
import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

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

// Δημιουργία 4 εγγυημένα μοναδικών επιλογών για MCQ
function makeUniqueOptions(correct, wrongCandidates) {
  const unique = new Set([correct]);
  for (const opt of wrongCandidates) {
    if (opt !== undefined && opt !== null && opt !== '') {
      unique.add(String(opt));
    }
    if (unique.size === 4) break;
  }

  let counter = 1;
  while (unique.size < 4) {
    const numericMatch = String(correct).match(/\d+(\.\d+)?/);
    if (numericMatch) {
      const baseNum = parseFloat(numericMatch[0]);
      const fallbackVal = String(correct).replace(numericMatch[0], String(Math.max(1, Math.round((baseNum + counter * 2) * 100) / 100)));
      unique.add(fallbackVal);
    } else {
      unique.add(`Επιλογή ${counter}`);
    }
    counter++;
  }

  return shuffle(Array.from(unique));
}

// Αφαίρεση τόνων για κεφαλαία (εξαιρείται το ΣΤ')
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

// Μορφοποίηση αριθμού (ακέραιος ή δεκαδικός ανάλογα με το locale)
function formatNum(val, locale = 'el', decimals = 2) {
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  const loc = locale === 'en' ? 'en-US' : 'el-GR';
  const num = Number(val);
  if (Number.isInteger(num)) {
    return num.toLocaleString(loc);
  }
  return num.toLocaleString(loc, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

// Κανονική κατακόρυφη μορφή κλάσματος (responsive, mobile safe)
function Fraction({ num, den, className = '' }) {
  return (
    <span
      className={`inline-flex flex-col items-center justify-center align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full ${className}`}
    >
      <span className="border-b border-current px-1 pb-0.5 text-center break-all">
        {num}
      </span>
      <span className="px-1 pt-0.5 text-center break-all">
        {den}
      </span>
    </span>
  );
}

// ---------------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (Q7, Q8, Q9, Q10) - "NO-GIVEAWAY" PEDAGOGY
// ---------------------------------------------------------

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'p_avg_std_1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const g1 = randInt(14, 18);
      const g2 = randInt(15, 19);
      const g3 = randInt(16, 20);
      const g4 = randInt(13, 17);
      const sum = g1 + g2 + g3 + g4;
      const avg = sum / 4;
      const cleanAvg = Number.isInteger(avg) ? avg : Number(avg.toFixed(2));
      const formattedAvg = formatNum(cleanAvg, locale, 2);

      const wrongOpts = [
        formatNum(cleanAvg + 1, locale, 2),
        formatNum(Math.max(1, cleanAvg - 1), locale, 2),
        formatNum(cleanAvg + 1.5, locale, 2)
      ];

      return {
        title: isEn ? 'Grade Average Across 4 Subjects' : 'Μέσος Όρος Βαθμολογίας Μαθημάτων',
        prompt: isEn
          ? `A 6th grade student received test grades in four subjects: ${g1}, ${g2}, ${g3}, and ${g4}. What is the student's grade average? (write only the number)`
          : `Ένας μαθητής της ΣΤ' Δημοτικού έγραψε στα τέσσερα μαθήματα βαθμούς: ${g1}, ${g2}, ${g3} και ${g4}. Ποιος είναι ο μέσος όρος της βαθμολογίας του; (γράψε μόνο τον αριθμό)`,
        promptMcq: isEn
          ? `A 6th grade student received test grades in four subjects: ${g1}, ${g2}, ${g3}, and ${g4}. What is the student's grade average?`
          : `Ένας μαθητής της ΣΤ' Δημοτικού έγραψε στα τέσσερα μαθήματα βαθμούς: ${g1}, ${g2}, ${g3} και ${g4}. Ποιος είναι ο μέσος όρος της βαθμολογίας του;`,
        unit: isEn ? 'points' : 'βαθμοί',
        correctVal: formattedAvg,
        correctText: formattedAvg,
        tableData: [
          { item: isEn ? '4 subject grades' : 'Βαθμολογίες 4 μαθημάτων', formula: `${g1} ＋ ${g2} ＋ ${g3} ＋ ${g4}`, val: `${sum} ${isEn ? 'points' : 'βαθμοί'}` },
          { item: isEn ? 'Number of subjects' : 'Πλήθος μαθημάτων', formula: isEn ? '4 subjects' : '4 μαθήματα', val: '4' },
          {
            item: isEn ? 'Grade average' : 'Μέσος όρος',
            formula: (
              <span className="inline-flex items-center">
                <Fraction num={sum} den="4" />
              </span>
            ),
            val: formattedAvg
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>
              {isEn
                ? `We sum all the grades: ${g1} ＋ ${g2} ＋ ${g3} ＋ ${g4} ＝ ${sum}. We divide by the number of subjects (4):`
                : `Αθροίζουμε όλους τους βαθμούς: ${g1} ＋ ${g2} ＋ ${g3} ＋ ${g4} ＝ ${sum}. Διαιρούμε με το πλήθος των μαθημάτων (4):`}
            </span>
            <Fraction num={sum} den="4" />
            <span>＝ {formattedAvg}.</span>
          </span>
        ),
        distractors: wrongOpts
      };
    }
  },
  {
    id: 'p_avg_std_2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const p1 = randInt(10, 16);
      const p2 = randInt(12, 18);
      const p3 = 0;
      const p4 = randInt(14, 22);
      const sum = p1 + p2 + p3 + p4;
      const avg = sum / 4;
      const cleanAvg = Number.isInteger(avg) ? avg : Number(avg.toFixed(2));
      const formattedAvg = formatNum(cleanAvg, locale, 2);
      const unit = isEn ? 'points' : 'πόντοι';

      const wrongOpts = [
        `${formatNum(cleanAvg + 2, locale, 2)} ${unit}`,
        `${formatNum(Math.max(1, cleanAvg - 2), locale, 2)} ${unit}`,
        `${formatNum(cleanAvg + 4, locale, 2)} ${unit}`
      ];

      return {
        title: isEn ? 'Scoring Average with a Zero Score' : 'Μέσος Όρος Πόντων με Μηδενική Τιμή',
        prompt: isEn
          ? `A basketball player in 4 games scored: ${p1}, ${p2}, ${p3}, and ${p4} points. What is her scoring average per game? (write only the number)`
          : `Μια αθλήτρια μπάσκετ σε 4 αγώνες σημείωσε: ${p1}, ${p2}, ${p3} και ${p4} πόντους. Ποιος είναι ο μέσος όρος πόντων της ανά αγώνα; (γράψε μόνο τον αριθμό)`,
        promptMcq: isEn
          ? `A basketball player in 4 games scored: ${p1}, ${p2}, ${p3}, and ${p4} points. What is her scoring average per game?`
          : `Μια αθλήτρια μπάσκετ σε 4 αγώνες σημείωσε: ${p1}, ${p2}, ${p3} και ${p4} πόντους. Ποιος είναι ο μέσος όρος πόντων της ανά αγώνα;`,
        unit,
        correctVal: formattedAvg,
        correctText: `${formattedAvg} ${unit}`,
        tableData: [
          { item: isEn ? 'Total points (including 0)' : 'Συνολικοί πόντοι (συμπεριλαμβανομένου του 0)', formula: `${p1} ＋ ${p2} ＋ ${p3} ＋ ${p4}`, val: `${sum} ${unit}` },
          { item: isEn ? 'Total games' : 'Σύνολο αγώνων', formula: isEn ? '4 games' : '4 αγώνες', val: '4' },
          {
            item: isEn ? 'Average per game' : 'Μέσος όρος ανά αγώνα',
            formula: (
              <span className="inline-flex items-center">
                <Fraction num={sum} den="4" />
              </span>
            ),
            val: `${formattedAvg} ${unit}`
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>
              {isEn
                ? `Note that the game with 0 points counts as a valid game in the divisor! Total points: ${p1} ＋ ${p2} ＋ ${p3} ＋ ${p4} ＝ ${sum}. Divided by 4:`
                : `Προσέχουμε ότι ο αγώνας με τους 0 πόντους μετράει κανονικά στο πλήθος των αγώνων! Συνολικοί πόντοι: ${p1} ＋ ${p2} ＋ ${p3} ＋ ${p4} ＝ ${sum}. Διαιρούμε με το 4:`}
            </span>
            <Fraction num={sum} den="4" />
            <span>＝ {formattedAvg} {isEn ? 'points per game.' : 'πόντοι ανά αγώνα.'}</span>
          </span>
        ),
        distractors: wrongOpts
      };
    }
  },
  {
    id: 'p_avg_std_3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const c1 = randInt(6, 8) * 10;
      const c2 = randInt(5, 7) * 10;
      const c3 = randInt(7, 9) * 10;
      const sum = c1 + c2 + c3;
      const avg = sum / 3;
      const cleanAvg = Number.isInteger(avg) ? avg : Number(avg.toFixed(2));
      const formattedAvg = formatNum(cleanAvg, locale, 2);
      const unit = isEn ? 'customers' : 'πελάτες';

      const wrongOpts = [
        `${formatNum(cleanAvg + 10, locale, 2)} ${unit}`,
        `${formatNum(Math.max(10, cleanAvg - 10), locale, 2)} ${unit}`,
        `${formatNum(cleanAvg + 15, locale, 2)} ${unit}`
      ];

      return {
        title: isEn ? 'Supermarket Daily Customer Average' : 'Μέσος Όρος Πελατών Σούπερ Μάρκετ',
        prompt: isEn
          ? `A supermarket had ${c1}, ${c2}, and ${c3} customers over the first three days of the week. What was the average number of customers per day? (write only the number)`
          : `Ένα σούπερ μάρκετ είχε τις τρεις πρώτες ημέρες της εβδομάδας ${c1}, ${c2} και ${c3} πελάτες αντίστοιχα. Ποιος ήταν ο μέσος όρος πελατών ανά ημέρα; (γράψε μόνο τον αριθμό)`,
        promptMcq: isEn
          ? `A supermarket had ${c1}, ${c2}, and ${c3} customers over the first three days of the week. What was the average number of customers per day?`
          : `Ένα σούπερ μάρκετ είχε τις τρεις πρώτες ημέρες της εβδομάδας ${c1}, ${c2} και ${c3} πελάτες αντίστοιχα. Ποιος ήταν ο μέσος όρος πελατών ανά ημέρα;`,
        unit,
        correctVal: formattedAvg,
        correctText: `${formattedAvg} ${unit}`,
        tableData: [
          { item: isEn ? 'Total customers' : 'Σύνολο πελατών', formula: `${c1} ＋ ${c2} ＋ ${c3}`, val: `${sum} ${unit}` },
          { item: isEn ? 'Number of days' : 'Πλήθος ημερών', formula: isEn ? '3 days' : '3 ημέρες', val: '3' },
          {
            item: isEn ? 'Average per day' : 'Μέσος όρος ανά ημέρα',
            formula: (
              <span className="inline-flex items-center">
                <Fraction num={sum} den="3" />
              </span>
            ),
            val: `${formattedAvg} ${unit}`
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>
              {isEn
                ? `Total customers: ${c1} ＋ ${c2} ＋ ${c3} ＝ ${sum}. Dividing by 3 days:`
                : `Συνολικοί πελάτες: ${c1} ＋ ${c2} ＋ ${c3} ＝ ${sum}. Διαιρούμε με τις 3 ημέρες:`}
            </span>
            <Fraction num={sum} den="3" />
            <span>＝ {formattedAvg} {isEn ? 'customers.' : 'πελάτες.'}</span>
          </span>
        ),
        distractors: wrongOpts
      };
    }
  },
  {
    id: 'p_avg_std_4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const t1 = randInt(14, 18);
      const t2 = randInt(19, 23);
      const t3 = randInt(22, 26);
      const t4 = randInt(17, 21);
      const t5 = randInt(13, 17);
      const sum = t1 + t2 + t3 + t4 + t5;
      const avg = sum / 5;
      const cleanAvg = Number.isInteger(avg) ? avg : Number(avg.toFixed(2));
      const formattedAvg = formatNum(cleanAvg, locale, 2);

      const wrongOpts = [
        `${formatNum(cleanAvg + 1.5, locale, 2)} °C`,
        `${formatNum(Math.max(1, cleanAvg - 1.5), locale, 2)} °C`,
        `${formatNum(cleanAvg + 2, locale, 2)} °C`
      ];

      return {
        title: isEn ? 'Five-Day Average Temperature' : 'Μέση Θερμοκρασία Πενθημέρου',
        prompt: isEn
          ? `A meteorological station recorded temperatures for 5 consecutive days: ${t1}°C, ${t2}°C, ${t3}°C, ${t4}°C, and ${t5}°C. What was the average temperature (°C)? (write only the number)`
          : `Σε έναν μετεωρολογικό σταθμό καταγράφηκαν οι μεσημεριανές θερμοκρασίες για 5 συνεχόμενες ημέρες: ${t1}°C, ${t2}°C, ${t3}°C, ${t4}°C και ${t5}°C. Ποια ήταν η μέση θερμοκρασία (°C); (γράψε μόνο τον αριθμό)`,
        promptMcq: isEn
          ? `A meteorological station recorded temperatures for 5 consecutive days: ${t1}°C, ${t2}°C, ${t3}°C, ${t4}°C, and ${t5}°C. What was the average temperature (°C)?`
          : `Σε έναν μετεωρολογικό σταθμό καταγράφηκαν οι μεσημεριανές θερμοκρασίες για 5 συνεχόμενες ημέρες: ${t1}°C, ${t2}°C, ${t3}°C, ${t4}°C και ${t5}°C. Ποια ήταν η μέση θερμοκρασία (°C);`,
        unit: '°C',
        correctVal: formattedAvg,
        correctText: `${formattedAvg} °C`,
        tableData: [
          { item: isEn ? 'Sum of temperatures' : 'Άθροισμα θερμοκρασιών', formula: `${t1} ＋ ${t2} ＋ ${t3} ＋ ${t4} ＋ ${t5}`, val: `${sum} °C` },
          { item: isEn ? 'Number of days' : 'Πλήθος ημερών', formula: isEn ? '5 days' : '5 ημέρες', val: '5' },
          {
            item: isEn ? 'Average temperature' : 'Μέση θερμοκρασία',
            formula: (
              <span className="inline-flex items-center">
                <Fraction num={sum} den="5" />
              </span>
            ),
            val: `${formattedAvg} °C`
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>
              {isEn
                ? `Sum of temperatures: ${t1} ＋ ${t2} ＋ ${t3} ＋ ${t4} ＋ ${t5} ＝ ${sum}°C. Dividing by 5 days:`
                : `Άθροισμα θερμοκρασιών: ${t1} ＋ ${t2} ＋ ${t3} ＋ ${t4} ＋ ${t5} ＝ ${sum}°C. Διαιρούμε με τις 5 ημέρες:`}
            </span>
            <Fraction num={sum} den="5" />
            <span>＝ {formattedAvg} °C.</span>
          </span>
        ),
        distractors: wrongOpts
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'p_avg_hard_1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const targetAvg = randInt(16, 18);
      const g1 = targetAvg - randInt(1, 3);
      const g2 = targetAvg + randInt(0, 2);
      const g3 = targetAvg - randInt(0, 2);
      const currentSum = g1 + g2 + g3;
      const requiredSum = targetAvg * 4;
      const g4 = requiredSum - currentSum;

      const wrongOpts = [
        `${g4 + 1}`,
        `${Math.max(1, g4 - 1)}`,
        `${g4 + 2}`
      ];

      return {
        title: isEn ? 'Calculating Score Needed for Target Average' : 'Υπολογισμός Βαθμού για Επίτευξη Στόχου',
        prompt: isEn
          ? `A student scored ${g1}, ${g2}, and ${g3} on the first three tests. What score must they get on the 4th test to achieve an average of exactly ${targetAvg}? (write only the number)`
          : `Ένας μαθητής έγραψε στα τρία πρώτα τεστ βαθμούς ${g1}, ${g2} και ${g3}. Τι βαθμό πρέπει να γράψει στο 4ο τεστ για να έχει τελικό μέσο όρο ακριβώς ${targetAvg}; (γράψε μόνο τον αριθμό)`,
        promptMcq: isEn
          ? `A student scored ${g1}, ${g2}, and ${g3} on the first three tests. What score must they get on the 4th test to achieve an average of exactly ${targetAvg}?`
          : `Ένας μαθητής έγραψε στα τρία πρώτα τεστ βαθμούς ${g1}, ${g2} και ${g3}. Τι βαθμό πρέπει να γράψει στο 4ο τεστ για να έχει τελικό μέσο όρο ακριβώς ${targetAvg};`,
        unit: isEn ? 'points' : 'βαθμοί',
        correctVal: String(g4),
        correctText: `${g4}`,
        tableData: [
          { item: isEn ? 'Required total sum' : 'Απαιτούμενο συνολικό άθροισμα', formula: `4 · ${targetAvg}`, val: `${requiredSum} ${isEn ? 'points' : 'βαθμοί'}` },
          { item: isEn ? 'Sum of first 3 tests' : 'Άθροισμα πρώτων 3 τεστ', formula: `${g1} ＋ ${g2} ＋ ${g3}`, val: `${currentSum} ${isEn ? 'points' : 'βαθμοί'}` },
          { item: isEn ? 'Required 4th score' : 'Απαιτούμενος βαθμός 4ου τεστ', formula: `${requiredSum} － ${currentSum}`, val: `${g4}` }
        ],
        explain: isEn
          ? `To have an average of ${targetAvg} in 4 tests, the total points must equal: 4 · ${targetAvg} ＝ ${requiredSum}. The student currently has: ${g1} ＋ ${g2} ＋ ${g3} ＝ ${currentSum}. Therefore, on test 4 they need: ${requiredSum} － ${currentSum} ＝ ${g4}.`
          : `Για να έχει μέσο όρο ${targetAvg} σε 4 τεστ, το συνολικό άθροισμα των βαθμών του πρέπει να είναι: 4 · ${targetAvg} ＝ ${requiredSum}. Στα τρία πρώτα τεστ έχει συγκεντρώσει: ${g1} ＋ ${g2} ＋ ${g3} ＝ ${currentSum}. Άρα στο 4ο τεστ χρειάζεται: ${requiredSum} － ${currentSum} ＝ ${g4}.`,
        distractors: wrongOpts
      };
    }
  },
  {
    id: 'p_avg_hard_2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const count = 5;
      const avgAge = randInt(11, 14);
      const totalAge = count * avgAge;
      const newChildAge = randInt(16, 18);
      const newTotal = totalAge + newChildAge;
      const newCount = count + 1;
      const newAvg = newTotal / newCount;
      const cleanNewAvg = Number.isInteger(newAvg) ? newAvg : Number(newAvg.toFixed(2));
      const formattedAvg = formatNum(cleanNewAvg, locale, 2);
      const unit = isEn ? 'years' : 'έτη';

      const wrongOpts = [
        `${formatNum(cleanNewAvg + 0.5, locale, 2)} ${unit}`,
        `${formatNum(Math.max(1, cleanNewAvg - 0.5), locale, 2)} ${unit}`,
        `${formatNum(cleanNewAvg + 1, locale, 2)} ${unit}`
      ];

      return {
        title: isEn ? 'New Average After Adding a Member' : 'Νέος Μέσος Όρος μετά από Προσθήκη Μέλους',
        prompt: isEn
          ? `A group of 5 children has an average age of ${avgAge} years. A new child aged ${newChildAge} years joins the group. What is the new average age of the 6 children? (write only the number)`
          : `Μια ομάδα 5 παιδιών έχει μέσο όρο ηλικίας ${avgAge} έτη. Στην ομάδα προστίθεται ένα νέο παιδί ηλικίας ${newChildAge} ετών. Ποιος είναι ο νέος μέσος όρος ηλικίας της ομάδας (6 παιδιά); (γράψε μόνο τον αριθμό)`,
        promptMcq: isEn
          ? `A group of 5 children has an average age of ${avgAge} years. A new child aged ${newChildAge} years joins the group. What is the new average age of the 6 children?`
          : `Μια ομάδα 5 παιδιών έχει μέσο όρο ηλικίας ${avgAge} έτη. Στην ομάδα προστίθεται ένα νέο παιδί ηλικίας ${newChildAge} ετών. Ποιος είναι ο νέος μέσος όρος ηλικίας της ομάδας (6 παιδιά);`,
        unit,
        correctVal: formattedAvg,
        correctText: `${formattedAvg} ${unit}`,
        tableData: [
          { item: isEn ? 'Initial sum of ages (5 children)' : 'Αρχικό άθροισμα ηλικιών (5 παιδιά)', formula: `5 · ${avgAge}`, val: `${totalAge} ${unit}` },
          { item: isEn ? 'New sum of ages (6 children)' : 'Νέο συνολικό άθροισμα (6 παιδιά)', formula: `${totalAge} ＋ ${newChildAge}`, val: `${newTotal} ${unit}` },
          {
            item: isEn ? 'New mean age' : 'Νέος μέσος όρος',
            formula: (
              <span className="inline-flex items-center">
                <Fraction num={newTotal} den="6" />
              </span>
            ),
            val: `${formattedAvg} ${unit}`
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>
              {isEn
                ? `The initial sum of ages of the 5 children is: 5 · ${avgAge} ＝ ${totalAge} years. Adding the new child gives: ${totalAge} ＋ ${newChildAge} ＝ ${newTotal} years. Dividing by 6 children:`
                : `Το αρχικό άθροισμα ηλικιών των 5 παιδιών είναι: 5 · ${avgAge} ＝ ${totalAge} έτη. Με το νέο παιδί, το νέο άθροισμα γίνεται: ${totalAge} ＋ ${newChildAge} ＝ ${newTotal} έτη. Διαιρούμε με το νέο πλήθος των παιδιών (6):`}
            </span>
            <Fraction num={newTotal} den="6" />
            <span>＝ {formattedAvg} {isEn ? 'years.' : 'έτη.'}</span>
          </span>
        ),
        distractors: wrongOpts
      };
    }
  },
  {
    id: 'p_avg_hard_3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const days = 7;
      const targetWeeklyAvg = randInt(15, 20);
      const totalSum = days * targetWeeklyAvg;
      const first6Sum = totalSum - randInt(12, 22);
      const lastDayTemp = totalSum - first6Sum;

      const wrongOpts = [
        `${lastDayTemp + 2} °C`,
        `${Math.max(1, lastDayTemp - 2)} °C`,
        `${lastDayTemp + 3} °C`
      ];

      return {
        title: isEn ? 'Finding Missing Day in Weekly Temperature' : 'Εύρεση Τιμής Τελευταίας Ημέρας Εβδομάδας',
        prompt: isEn
          ? `In a city, the weekly average temperature (over 7 days) was ${targetWeeklyAvg}°C. The sum of temperatures for the first 6 days was ${first6Sum}°C. What was the temperature (°C) on the 7th day? (write only the number)`
          : `Σε μια πόλη η μέση θερμοκρασία μιας εβδομάδας (7 ημέρες) ήταν ${targetWeeklyAvg}°C. Το άθροισμα των θερμοκρασιών των πρώτων 6 ημερών ήταν ${first6Sum}°C. Ποια ήταν η θερμοκρασία (°C) την 7η ημέρα; (γράψε μόνο τον αριθμό)`,
        promptMcq: isEn
          ? `In a city, the weekly average temperature (over 7 days) was ${targetWeeklyAvg}°C. The sum of temperatures for the first 6 days was ${first6Sum}°C. What was the temperature (°C) on the 7th day?`
          : `Σε μια πόλη η μέση θερμοκρασία μιας εβδομάδας (7 ημέρες) ήταν ${targetWeeklyAvg}°C. Το άθροισμα των θερμοκρασιών των πρώτων 6 ημερών ήταν ${first6Sum}°C. Ποια ήταν η θερμοκρασία (°C) την 7η ημέρα;`,
        unit: '°C',
        correctVal: String(lastDayTemp),
        correctText: `${lastDayTemp} °C`,
        tableData: [
          { item: isEn ? 'Total 7-day sum' : 'Συνολικό άθροισμα 7 ημερών', formula: `7 · ${targetWeeklyAvg}`, val: `${totalSum} °C` },
          { item: isEn ? 'First 6 days sum' : 'Άθροισμα πρώτων 6 ημερών', formula: `${first6Sum} °C`, val: `${first6Sum} °C` },
          { item: isEn ? '7th day temperature' : 'Θερμοκρασία 7ης ημέρας', formula: `${totalSum} － ${first6Sum}`, val: `${lastDayTemp} °C` }
        ],
        explain: isEn
          ? `Total sum for all 7 days: 7 · ${targetWeeklyAvg} ＝ ${totalSum}°C. Subtracting the first 6 days: ${totalSum} － ${first6Sum} ＝ ${lastDayTemp}°C.`
          : `Το συνολικό άθροισμα των 7 ημερών είναι: 7 · ${targetWeeklyAvg} ＝ ${totalSum}°C. Αφαιρούμε το άθροισμα των πρώτων 6 ημερών: ${totalSum} － ${first6Sum} ＝ ${lastDayTemp}°C.`,
        distractors: wrongOpts
      };
    }
  },
  {
    id: 'p_avg_hard_4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const workers = 4;
      const avgSalary = randInt(85, 110) * 10;
      const totalSalaries = workers * avgSalary;
      const s1 = avgSalary - 100;
      const s2 = avgSalary + 150;
      const s3 = avgSalary - 50;
      const s4 = totalSalaries - (s1 + s2 + s3);

      const wrongOpts = [
        `${formatNum(s4 + 100, locale, 0)} €`,
        `${formatNum(Math.max(100, s4 - 100), locale, 0)} €`,
        `${formatNum(s4 + 50, locale, 0)} €`
      ];

      return {
        title: isEn ? 'Salary of the Fourth Worker' : 'Εύρεση Μισθού Τέταρτου Εργαζομένου',
        prompt: isEn
          ? `Four employees earn an average monthly salary of ${formatNum(avgSalary, locale, 0)} €. If three earn ${formatNum(s1, locale, 0)} €, ${formatNum(s2, locale, 0)} €, and ${formatNum(s3, locale, 0)} €, what is the salary of the fourth employee in €? (write only the number)`
          : `Τέσσερις εργαζόμενοι έχουν μέσο μηνιαίο μισθό ${formatNum(avgSalary, locale, 0)} €. Αν οι τρεις πρώτοι αμείβονται με ${formatNum(s1, locale, 0)} €, ${formatNum(s2, locale, 0)} € και ${formatNum(s3, locale, 0)} €, ποιος είναι ο μισθός του τέταρτου εργαζομένου σε €; (γράψε μόνο τον αριθμό)`,
        promptMcq: isEn
          ? `Four employees earn an average monthly salary of ${formatNum(avgSalary, locale, 0)} €. If three earn ${formatNum(s1, locale, 0)} €, ${formatNum(s2, locale, 0)} €, and ${formatNum(s3, locale, 0)} €, what is the salary of the fourth employee in €?`
          : `Τέσσερις εργαζόμενοι έχουν μέσο μηνιαίο μισθό ${formatNum(avgSalary, locale, 0)} €. Αν οι τρεις πρώτοι αμείβονται με ${formatNum(s1, locale, 0)} €, ${formatNum(s2, locale, 0)} € και ${formatNum(s3, locale, 0)} €, ποιος είναι ο μισθός του τέταρτου εργαζομένου σε €;`,
        unit: '€',
        correctVal: String(s4),
        correctText: `${formatNum(s4, locale, 0)} €`,
        tableData: [
          { item: isEn ? 'Total 4 salaries' : 'Συνολικό ποσό 4 μισθών', formula: `4 · ${formatNum(avgSalary, locale, 0)}`, val: `${formatNum(totalSalaries, locale, 0)} €` },
          { item: isEn ? 'Sum of 3 known salaries' : 'Άθροισμα 3 γνωστών μισθών', formula: `${formatNum(s1, locale, 0)} ＋ ${formatNum(s2, locale, 0)} ＋ ${formatNum(s3, locale, 0)}`, val: `${formatNum(s1 + s2 + s3, locale, 0)} €` },
          { item: isEn ? '4th employee salary' : 'Μισθός 4ου εργαζομένου', formula: `${formatNum(totalSalaries, locale, 0)} － ${formatNum(s1 + s2 + s3, locale, 0)}`, val: `${formatNum(s4, locale, 0)} €` }
        ],
        explain: isEn
          ? `Total salaries for all 4 employees: 4 · ${formatNum(avgSalary, locale, 0)} ＝ ${formatNum(totalSalaries, locale, 0)} €. Sum of the three known salaries: ${formatNum(s1, locale, 0)} ＋ ${formatNum(s2, locale, 0)} ＋ ${formatNum(s3, locale, 0)} ＝ ${formatNum(s1 + s2 + s3, locale, 0)} €. Thus the 4th worker earns: ${formatNum(totalSalaries, locale, 0)} － ${formatNum(s1 + s2 + s3, locale, 0)} ＝ ${formatNum(s4, locale, 0)} €.`
          : `Το σύνολο των μισθών των 4 εργαζομένων είναι: 4 · ${formatNum(avgSalary, locale, 0)} ＝ ${formatNum(totalSalaries, locale, 0)} €. Το άθροισμα των τριών πρώτων είναι: ${formatNum(s1, locale, 0)} ＋ ${formatNum(s2, locale, 0)} ＋ ${formatNum(s3, locale, 0)} ＝ ${formatNum(s1 + s2 + s3, locale, 0)} €. Άρα ο 4ος παίρνει: ${formatNum(totalSalaries, locale, 0)} － ${formatNum(s1 + s2 + s3, locale, 0)} ＝ ${formatNum(s4, locale, 0)} €.`,
        distractors: wrongOpts
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions(locale) {
  const isEn = locale === 'en';

  // Q1: Input - Βασικός υπολογισμός μέσου όρου 3 ακέραιων τιμών
  const q1A = randInt(10, 18);
  const q1B = randInt(12, 22);
  const q1C = randInt(14, 24);
  const q1Sum = q1A + q1B + q1C;
  const q1Avg = q1Sum / 3;
  const q1CleanAvg = Number.isInteger(q1Avg) ? q1Avg : Number(q1Avg.toFixed(2));
  const q1Formatted = formatNum(q1CleanAvg, locale, 2);

  // Q2: MCQ - Μαθηματικός τύπος και ορισμός μέσου όρου
  const q2Correct = isEn
    ? 'Divide the sum of all values by the number of values'
    : 'Διαιρούμε το άθροισμα όλων των τιμών με το πλήθος των τιμών';
  const q2Wrong = [
    isEn ? 'Multiply the smallest value by the largest value' : 'Πολλαπλασιάζουμε τη μικρότερη τιμή με τη μεγαλύτερη',
    isEn ? 'Subtract the smallest value from the sum of the rest' : 'Αφαιρούμε τη μικρότερη τιμή από το άθροισμα των υπόλοιπων',
    isEn ? 'Always divide by 100 like percentages' : 'Διαιρούμε πάντα με το 100 όπως στα ποσοστά'
  ];
  const q2Options = makeUniqueOptions(q2Correct, q2Wrong);

  // Q3: Input - Μέσος όρος με την παρουσία μηδενικής τιμής
  const q3A = randInt(12, 18);
  const q3B = 0;
  const q3C = randInt(16, 24);
  const q3D = randInt(14, 22);
  const q3Sum = q3A + q3B + q3C + q3D;
  const q3Avg = q3Sum / 4;
  const q3CleanAvg = Number.isInteger(q3Avg) ? q3Avg : Number(q3Avg.toFixed(2));
  const q3Formatted = formatNum(q3CleanAvg, locale, 2);

  // Q4: MCQ - Ιδιότητα μέσου όρου (εύρος τιμών)
  const q4Min = 12;
  const q4Max = 28;
  const q4Correct = isEn
    ? `Always strictly located between ${q4Min} and ${q4Max}`
    : `Βρίσκεται πάντοτε ανάμεσα στο ${q4Min} και στο ${q4Max}`;
  const q4Wrong = [
    isEn ? `Always strictly greater than ${q4Max}` : `Είναι πάντοτε μεγαλύτερος από το ${q4Max}`,
    isEn ? 'Always strictly equal to zero' : 'Είναι πάντοτε ίσος με το μηδέν',
    isEn ? `Always strictly smaller than ${q4Min}` : `Είναι πάντοτε μικρότερος από το ${q4Min}`
  ];
  const q4Options = makeUniqueOptions(q4Correct, q4Wrong);

  // Q5: Input - Αντίστροφος υπολογισμός συνολικού αθροίσματος
  const q5Count = randInt(4, 8);
  const q5Avg = randInt(12, 25);
  const q5Total = q5Count * q5Avg;

  // Q6: MCQ - Μέσος όρος ίσων τιμών
  const q6Val = randInt(14, 28);
  const q6Correct = `${q6Val}`;
  const q6Wrong = [
    `${q6Val - 2}`,
    `${formatNum(q6Val / 2, locale, 1)}`,
    `${q6Val + 2}`
  ];
  const q6Options = makeUniqueOptions(q6Correct, q6Wrong);

  // Q7: Standard Problem (Input)
  const spIndex1 = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q7Data = STANDARD_PROBLEMS_POOL[spIndex1].generate(locale);

  // Q8: Standard Problem (MCQ)
  let spIndex2 = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  while (spIndex2 === spIndex1) spIndex2 = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q8Data = STANDARD_PROBLEMS_POOL[spIndex2].generate(locale);
  const q8Options = makeUniqueOptions(q8Data.correctText, q8Data.distractors);

  // Q9: Hard Problem (Input)
  const hpIndex1 = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q9Data = HARD_PROBLEMS_POOL[hpIndex1].generate(locale);

  // Q10: Hard Problem (MCQ)
  let hpIndex2 = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  while (hpIndex2 === hpIndex1) hpIndex2 = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q10Data = HARD_PROBLEMS_POOL[hpIndex2].generate(locale);
  const q10Options = makeUniqueOptions(q10Data.correctText, q10Data.distractors);

  return [
    {
      id: 'q1',
      type: 'input',
      inputType: 'decimal',
      title: isEn ? 'Basic Mean Calculation' : 'Βασικός Υπολογισμός Μέσου Όρου',
      prompt: isEn
        ? `What is the mean of the numbers ${q1A}, ${q1B}, and ${q1C}? (write only the number)`
        : `Ποιος είναι ο μέσος όρος των αριθμών ${q1A}, ${q1B} και ${q1C}; (γράψε μόνο τον αριθμό)`,
      correct: q1Formatted,
      explain: (
        <span className="inline-flex flex-wrap items-center gap-1">
          <span>
            {isEn
              ? `We add all values together: ${q1A} ＋ ${q1B} ＋ ${q1C} ＝ ${q1Sum}. We divide by the count (3):`
              : `Προσθέτουμε όλους τους αριθμούς: ${q1A} ＋ ${q1B} ＋ ${q1C} ＝ ${q1Sum}. Διαιρούμε με το πλήθος τους (3):`}
          </span>
          <Fraction num={q1Sum} den="3" />
          <span>＝ {q1Formatted}.</span>
        </span>
      )
    },
    {
      id: 'q2',
      type: 'mcq',
      title: isEn ? 'Definition of the Mean' : 'Μαθηματικός Ορισμός Μέσης Τιμής',
      prompt: isEn
        ? 'How do we compute the mean (average value) of a data set?'
        : 'Πώς υπολογίζουμε τον μέσο όρο (μέση τιμή) μιας ομάδας δεδομένων;',
      options: q2Options,
      correct: q2Correct,
      explain: isEn
        ? 'The mean always equals the sum of all values divided by the number of values.'
        : 'Ο μέσος όρος ισούται πάντοτε με το άθροισμα όλων των τιμών διαιρεμένο με το πλήθος των τιμών.'
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'decimal',
      title: isEn ? 'Mean with a Zero Value' : 'Μέσος Όρος με Μηδενική Τιμή',
      prompt: isEn
        ? `Find the mean of the four numbers: ${q3A}, ${q3B}, ${q3C}, and ${q3D}: (write only the number)`
        : `Βρείτε τον μέσο όρο των τεσσάρων αριθμών: ${q3A}, ${q3B}, ${q3C} και ${q3D}: (γράψε μόνο τον αριθμό)`,
      correct: q3Formatted,
      explain: (
        <span className="inline-flex flex-wrap items-center gap-1">
          <span>
            {isEn
              ? `Zero (0) participates fully in the count of observations! Sum: ${q3A} ＋ ${q3B} ＋ ${q3C} ＋ ${q3D} ＝ ${q3Sum}. Divide by 4:`
              : `Το μηδέν (0) συμμετέχει κανονικά στο πλήθος των τιμών! Άθροισμα: ${q3A} ＋ ${q3B} ＋ ${q3C} ＋ ${q3D} ＝ ${q3Sum}. Διαιρούμε με το 4:`}
          </span>
          <Fraction num={q3Sum} den="4" />
          <span>＝ {q3Formatted}.</span>
        </span>
      )
    },
    {
      id: 'q4',
      type: 'mcq',
      title: isEn ? 'Property of the Mean' : 'Ιδιότητα του Μέσου Όρου',
      prompt: isEn
        ? `If the smallest value in a data set is ${q4Min} and the largest is ${q4Max}, what is always true about the mean?`
        : `Αν σε μια ομάδα αριθμών η μικρότερη τιμή είναι το ${q4Min} και η μεγαλύτερη το ${q4Max}, τι ισχύει υποχρεωτικά για τον μέσο όρο;`,
      options: q4Options,
      correct: q4Correct,
      explain: isEn
        ? 'The mean represents the leveled value, therefore it is always strictly located between the minimum and maximum observations.'
        : 'Ο μέσος όρος εκφράζει την εξισορρόπηση των τιμών, επομένως βρίσκεται πάντοτε αυστηρά ανάμεσα στη μικρότερη και τη μεγαλύτερη τιμή των δεδομένων.'
    },
    {
      id: 'q5',
      type: 'input',
      inputType: 'number',
      title: isEn ? 'Reverse Finding of Sum' : 'Αντίστροφη Εύρεση Αθροίσματος',
      prompt: isEn
        ? `The mean of ${q5Count} numbers is ${q5Avg}. What is the sum of these ${q5Count} numbers? (write only the number)`
        : `Ο μέσος όρος ${q5Count} αριθμών είναι ${q5Avg}. Ποιο είναι το άθροισμα αυτών των ${q5Count} αριθμών; (γράψε μόνο τον αριθμό)`,
      correct: String(q5Total),
      explain: isEn
        ? `Since Mean ＝ Sum : Count, inversely: Sum ＝ Mean · Count ＝ ${q5Avg} · ${q5Count} ＝ ${q5Total}.`
        : `Εφόσον Μέσος Όρος ＝ Άθροισμα : Πλήθος, ισχύει αντίστροφα: Άθροισμα ＝ Μέσος Όρος · Πλήθος ＝ ${q5Avg} · ${q5Count} ＝ ${q5Total}.`
    },
    {
      id: 'q6',
      type: 'mcq',
      title: isEn ? 'Mean of Identical Values' : 'Μέσος Όρος Ίσων Τιμών',
      prompt: isEn
        ? `If all values in a data set are equal to ${q6Val}, what is their mean?`
        : `Αν όλες οι τιμές μιας ομάδας είναι ίσες με ${q6Val}, ποιος είναι ο μέσος όρος τους;`,
      options: q6Options,
      correct: q6Correct,
      explain: (
        <span className="inline-flex flex-wrap items-center gap-1">
          <span>
            {isEn
              ? 'When all observations are identical (e.g.'
              : 'Όταν όλες οι τιμές είναι ίσες μεταξύ τους (π.χ.'}
          </span>
          <Fraction num={`${q6Val} ＋ ${q6Val}`} den="2" />
          <span>
            {isEn
              ? `＝ ${q6Val}), the mean is always equal to that common value: ${q6Val}.`
              : `＝ ${q6Val}), ο μέσος όρος ισούται πάντοτε με την ίδια την τιμή: ${q6Val}.`}
          </span>
        </span>
      )
    },
    {
      id: 'q7',
      type: 'input',
      inputType: 'decimal',
      title: `${isEn ? 'Problem' : 'Πρόβλημα'}: ${q7Data.title}`,
      prompt: q7Data.prompt,
      correct: q7Data.correctVal,
      tableData: q7Data.tableData,
      explain: q7Data.explain
    },
    {
      id: 'q8',
      type: 'mcq',
      title: `${isEn ? 'Problem' : 'Πρόβλημα'}: ${q8Data.title}`,
      prompt: q8Data.promptMcq || q8Data.prompt,
      options: q8Options,
      correct: q8Data.correctText,
      tableData: q8Data.tableData,
      explain: q8Data.explain
    },
    {
      id: 'q9',
      type: 'input',
      inputType: 'decimal',
      title: `${isEn ? 'Advanced Problem' : 'Σύνθετο Πρόβλημα'}: ${q9Data.title}`,
      prompt: q9Data.prompt,
      correct: q9Data.correctVal,
      tableData: q9Data.tableData,
      explain: q9Data.explain
    },
    {
      id: 'q10',
      type: 'mcq',
      title: `${isEn ? 'Advanced Problem' : 'Σύνθετο Πρόβλημα'}: ${q10Data.title}`,
      prompt: q10Data.promptMcq || q10Data.prompt,
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

export default function MesosOrosExercisesPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';

  const t = useMemo(() => {
    return {
      el: {
        pageTitle: "Ασκήσεις: Μέσος Όρος (Μέση Τιμή) - ΣΤ' Δημοτικού | LearnMaths.gr",
        metaDescription: "Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στον μέσο όρο και σε αντίστροφους υπολογισμούς στόχου για τη ΣΤ' Δημοτικού.",
        backText: "ΣΤ' Δημοτικού",
        theoryBtn: "Θεωρία",
        heroBadge: "ΚΕΦΑΛΑΙΟ 58 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
        heroTitle: "Διαδραστικές Ασκήσεις: Ο Μέσος Όρος (Μέση Τιμή)",
        heroDesc: "Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στον υπολογισμό του μέσου όρου, στη διαχείριση μηδενικών τιμών και σε απαιτητικούς αντίστροφους υπολογισμούς στόχου!",
        newSetBtn: "Νέες Ασκήσεις",
        exerciseLabel: "Άσκηση",
        inputPlaceholderNumber: "Απάντηση...",
        inputPlaceholderDecimal: "π.χ. 16,5",
        tableHeaderElement: "Στοιχείο",
        tableHeaderFormula: "Ανάλυση / Τύπος",
        tableHeaderVal: "Τιμή",
        feedbackSuccess: "🎯 Εξαιρετικά!",
        feedbackExplanation: "💡 Επεξήγηση:",
        checkBtn: "Έλεγχος Απαντήσεων",
        scoreLabel: "Σκορ",
        answeredLabel: "Απαντήθηκαν",
        pctLabel: "Ποσοστό",
        footerPrompt: "Απάντησε και στις 10 ερωτήσεις και πάτησε «Έλεγχος Απαντήσεων»!"
      },
      en: {
        pageTitle: "Exercises: Mean (Average Value) - 6th Grade | LearnMaths.gr",
        metaDescription: "Interactive exercises with 10 questions and auto-grading on calculating the mean and target reverse problems for 6th Grade.",
        backText: "6th Grade",
        theoryBtn: "Theory",
        heroBadge: "CHAPTER 58 • 6TH GRADE • PRACTICE",
        heroTitle: "Interactive Exercises: The Mean (Average Value)",
        heroDesc: "Solve the 10 dynamic questions to master calculating the average, handling zero observations, and solving reverse target problems!",
        newSetBtn: "New Exercises",
        exerciseLabel: "Exercise",
        inputPlaceholderNumber: "Answer...",
        inputPlaceholderDecimal: "e.g. 16.5",
        tableHeaderElement: "Component",
        tableHeaderFormula: "Formula / Step",
        tableHeaderVal: "Value",
        feedbackSuccess: "🎯 Excellent!",
        feedbackExplanation: "💡 Explanation:",
        checkBtn: "Check Answers",
        scoreLabel: "Score",
        answeredLabel: "Answered",
        pctLabel: "Percentage",
        footerPrompt: "Answer all 10 questions and click “Check Answers”!"
      }
    }[locale];
  }, [locale]);

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewSet = useCallback(() => {
    const qList = generateQuestions(locale);
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
  }, [locale]);

  useEffect(() => {
    loadNewSet();
  }, [loadNewSet]);

  const handleAnswerChange = (id, rawValue, type) => {
    if (submitted) return;
    if (type === 'input') {
      const q = questions.find(item => item.id === id);
      let sanitized = String(rawValue);
      if (q?.inputType === 'number') {
        sanitized = sanitized.replace(/[^0-9]/g, '');
      } else if (q?.inputType === 'decimal') {
        const sep = locale === 'en' ? '.' : ',';
        const otherSep = locale === 'en' ? ',' : '.';
        sanitized = sanitized.replace(new RegExp(`\\${otherSep}`, 'g'), sep);
        const allowedRegex = locale === 'en' ? /[^0-9.]/g : /[^0-9,]/g;
        sanitized = sanitized.replace(allowedRegex, '');
        const parts = sanitized.split(sep);
        if (parts.length > 2) sanitized = parts[0] + sep + parts.slice(1).join('');
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
      const cleanUser = userVal.replace(/\./g, ',').replace(/\s+/g, '').replace(/[%°€]/g, '').trim().toLowerCase();
      const cleanTarget = String(q.correct).replace(/\./g, ',').replace(/\s+/g, '').replace(/[%°€]/g, '').trim().toLowerCase();

      if (cleanUser === cleanTarget) return true;

      if (q.inputType === 'decimal') {
        const numUser = parseFloat(cleanUser.replace(',', '.'));
        const numTarget = parseFloat(cleanTarget.replace(',', '.'));
        return !isNaN(numUser) && !isNaN(numTarget) && Math.abs(numUser - numTarget) <= 0.05;
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
      title={t.pageTitle}
      description={t.metaDescription}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/58-mesos-oros"
          className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border border-blue-200 transition shrink-0"
        >
          <span>📖</span>
          <span>{toCleanUppercase(t.theoryBtn)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8 box-border">
        
        {/* HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="space-y-2 max-w-3xl min-w-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-sky-200 break-words [overflow-wrap:anywhere]">
                <span>{toCleanUppercase(t.heroBadge)}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight break-words [overflow-wrap:anywhere]">
                {t.heroTitle}
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed break-words [overflow-wrap:anywhere]">
                {t.heroDesc}
              </p>
            </div>

            <button
              type="button"
              onClick={loadNewSet}
              className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-black shadow-md transition transform active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 shrink-0 touch-manipulation"
            >
              <span>🔄</span>
              <span>{toCleanUppercase(t.newSetBtn)}</span>
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
                  className={`p-5 sm:p-7 rounded-3xl border flex flex-col justify-between transition-all min-w-0 overflow-hidden ${getCardStyle(q)}`}
                >
                  <div className="min-w-0">
                    {/* CARD HEADER */}
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <span className="text-xs font-black px-3 py-1 bg-sky-100 text-sky-900 rounded-full uppercase tracking-wider break-words [overflow-wrap:anywhere]">
                        {toCleanUppercase(`${t.exerciseLabel} ${qNum}`)}: {toCleanUppercase(q.title)}
                      </span>
                      {submitted && (
                        <span className="text-xl shrink-0">
                          {isQuestionCorrect(q) ? '✅' : '❌'}
                        </span>
                      )}
                    </div>

                    {/* PROMPT (NO-GIVEAWAY: ΜΟΝΟ ΕΚΦΩΝΗΣΗ) */}
                    <div className="text-slate-800 text-sm sm:text-base leading-relaxed font-semibold mb-3 break-words [overflow-wrap:anywhere]">
                      {q.prompt}
                    </div>

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
                              className={`p-3 rounded-2xl text-xs sm:text-sm font-mono font-bold border text-center transition touch-manipulation active:scale-95 break-words [overflow-wrap:anywhere] whitespace-normal leading-snug flex-1 flex items-center justify-center min-h-[48px] ${
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
                          placeholder={q.inputType === 'decimal' ? t.inputPlaceholderDecimal : t.inputPlaceholderNumber}
                          className="w-full p-3 bg-white border-2 border-slate-200 rounded-2xl font-bold text-center text-base sm:text-lg focus:border-indigo-500 outline-none disabled:bg-slate-100 font-mono tracking-wider shadow-inner"
                        />
                      </div>
                    )}
                  </div>

                  {/* POST-SUBMISSION FEEDBACK & TABLEDATA (NO-GIVEAWAY) */}
                  {submitted && (
                    <div className="mt-4 pt-3 border-t border-slate-200/70 space-y-3 min-w-0">
                      {q.tableData && (
                        <div className="w-full overflow-x-auto bg-white/90 p-2.5 rounded-2xl border border-slate-200">
                          <table className="w-full text-xs text-left text-slate-700">
                            <thead>
                              <tr className="border-b border-slate-200 font-black text-slate-500 uppercase">
                                <th className="p-1.5">{toCleanUppercase(t.tableHeaderElement)}</th>
                                <th className="p-1.5">{toCleanUppercase(t.tableHeaderFormula)}</th>
                                <th className="p-1.5">{toCleanUppercase(t.tableHeaderVal)}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-mono">
                              {q.tableData.map((row, rIdx) => (
                                <tr key={rIdx}>
                                  <td className="p-1.5 font-sans font-bold text-slate-900 break-words [overflow-wrap:anywhere]">
                                    {row.item}
                                  </td>
                                  <td className="p-1.5 text-indigo-700 align-middle">
                                    {row.formula}
                                  </td>
                                  <td className="p-1.5 font-black text-emerald-700">
                                    {row.val}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      <div
                        className={`p-3 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed break-words [overflow-wrap:anywhere] ${
                          isQuestionCorrect(q)
                            ? 'bg-emerald-100 text-emerald-950 border border-emerald-200'
                            : 'bg-rose-100 text-rose-950 border border-rose-200'
                        }`}
                      >
                        <p className="font-bold mb-1">
                          {isQuestionCorrect(q) ? t.feedbackSuccess : t.feedbackExplanation}
                        </p>
                        <div className="leading-relaxed">{q.explain}</div>
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
                <span>{toCleanUppercase(t.checkBtn)}</span>
              </button>
            </div>
          )}
        </form>
      </div>

      {/* FIXED BOTTOM SCORE FOOTER */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6 z-50">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          
          {/* SCORE & PERCENTAGE */}
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-sm sm:text-base md:text-lg flex items-center gap-2 shadow-sm">
              <span>🏆</span>
              <span>{submitted ? toCleanUppercase(t.scoreLabel) : toCleanUppercase(t.answeredLabel)}:</span>
              <span className="font-mono text-lg sm:text-xl md:text-2xl">
                {submitted ? score : answeredCount} / 10
              </span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                {toCleanUppercase(t.pctLabel)}:{' '}
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
                <span>{toCleanUppercase(t.newSetBtn)}</span>
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden sm:block">
                {t.footerPrompt}
              </p>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}