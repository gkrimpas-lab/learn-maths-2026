// pages/st-dimotikou/56-pinakas-sixnotiton-ask.js
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

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
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
    const numericMatch = String(correct).match(/\d+/);
    if (numericMatch) {
      const baseNum = parseInt(numericMatch[0], 10);
      const fallbackVal = String(correct).replace(/\d+/, String(Math.max(1, baseNum + counter * 3)));
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

// Μορφοποίηση αριθμού ανάλογα με το locale
function formatNum(val, locale = 'el', decimals = 2) {
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  const loc = locale === 'en' ? 'en-US' : 'el-GR';
  const num = Number(val);
  if (Number.isInteger(num)) {
    return num.toLocaleString(loc);
  }
  return Number(num.toFixed(decimals)).toLocaleString(loc, {
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

// Βοηθητικό component πίνακα συχνοτήτων - Πλήρως responsive χωρίς horizontal scroll
function ExerciseFrequencyTable({ headers, rows, totalRow, tableHeadingText }) {
  const colCount = headers.length;
  const firstColWidth = colCount === 2 ? 'w-[58%]' : colCount === 3 ? 'w-[42%]' : 'w-[34%]';
  const otherColWidth = colCount === 2 ? 'w-[42%]' : colCount === 3 ? 'w-[29%]' : 'w-[22%]';

  return (
    <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-2.5 sm:p-3.5 my-3 w-full max-w-lg shadow-inner min-w-0 box-border">
      <div className="text-[10.5px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center mb-1.5 break-words [overflow-wrap:anywhere]">
        {toCleanUppercase(tableHeadingText || 'Πίνακας Κατανομής Συχνοτήτων')}
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full table-fixed text-center text-[11px] sm:text-xs md:text-sm font-mono bg-white rounded-xl border border-slate-200 overflow-hidden">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold font-sans">
              {headers.map((h, i) => (
                <th
                  key={`th-${i}`}
                  className={`p-1.5 sm:p-2 break-words [overflow-wrap:anywhere] ${
                    i === 0 ? `${firstColWidth} text-left pl-2.5` : `${otherColWidth}`
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, rIdx) => (
              <tr key={`tr-${rIdx}`} className="border-b border-slate-100">
                {r.map((cell, cIdx) => (
                  <td
                    key={`td-${rIdx}-${cIdx}`}
                    className={`p-1.5 sm:p-2 break-words [overflow-wrap:anywhere] ${
                      cIdx === 0
                        ? 'text-left pl-2.5 font-sans font-bold text-slate-800'
                        : 'text-slate-900 font-bold'
                    } ${
                      cell === 'x' || cell === 'χ' || cell === '?'
                        ? 'text-amber-600 font-black text-sm sm:text-base'
                        : ''
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
            {totalRow && (
              <tr className="bg-slate-100/70 font-black text-slate-900 font-sans border-t border-slate-200">
                {totalRow.map((cell, idx) => (
                  <td
                    key={`tot-${idx}`}
                    className={`p-1.5 sm:p-2 break-words [overflow-wrap:anywhere] ${
                      idx === 0 ? 'text-left pl-2.5' : 'font-mono'
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (Q7, Q8, Q9, Q10) - "NO-GIVEAWAY" PEDAGOGY
// ---------------------------------------------------------

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'freq_std_1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const f10 = randInt(5, 8);
      const f9 = randInt(8, 12);
      const f8 = randInt(4, 7);
      const f7 = randInt(2, 5);
      const total = f10 + f9 + f8 + f7;
      const unit = isEn ? 'students' : 'μαθητές';

      const wrongOpts = [
        `${total + 3} ${unit}`,
        `${Math.max(4, total - 4)} ${unit}`,
        `${total + 5} ${unit}`
      ];

      return {
        title: isEn ? 'Total Students from Test Scores' : 'Σύνολο Μαθητών από Βαθμολογίες',
        prompt: isEn
          ? 'In the frequency table below, student scores on a test were recorded. How many students took the test in total? (write only the number)'
          : 'Στον παρακάτω πίνακα συχνοτήτων καταγράφηκαν οι βαθμολογίες των μαθητών σε ένα τεστ. Πόσοι μαθητές έγραψαν συνολικά στο τεστ; (γράψε μόνο τον αριθμό)',
        promptMcq: isEn
          ? 'In the frequency table below, student scores on a test were recorded. How many students took the test in total?'
          : 'Στον παρακάτω πίνακα συχνοτήτων καταγράφηκαν οι βαθμολογίες των μαθητών σε ένα τεστ. Πόσοι μαθητές έγραψαν συνολικά στο τεστ;',
        table: {
          headers: [isEn ? 'Score' : 'Βαθμός', isEn ? 'Frequency (f)' : 'Συχνότητα (ν)'],
          rows: [
            [isEn ? 'Grade 10' : 'Βαθμός 10', f10],
            [isEn ? 'Grade 9' : 'Βαθμός 9', f9],
            [isEn ? 'Grade 8' : 'Βαθμός 8', f8],
            [isEn ? 'Grade 7' : 'Βαθμός 7', f7]
          ]
        },
        unit,
        correctVal: String(total),
        correctText: `${total} ${unit}`,
        tableData: [
          { item: isEn ? 'Scores' : 'Βαθμοί', formula: '10, 9, 8, 7', val: isEn ? '4 categories' : '4 κατηγορίες' },
          { item: isEn ? 'Frequencies' : 'Συχνότητες', formula: `${f10} ＋ ${f9} ＋ ${f8} ＋ ${f7}`, val: `${total}` },
          { item: isEn ? 'Total sample size (N)' : 'Συνολικό μέγεθος δείγματος (Ν)', formula: isEn ? 'Sum of frequencies' : 'Άθροισμα συχνοτήτων', val: `${total} ${unit}` }
        ],
        explain: isEn
          ? `We sum all the frequencies in the table: ${f10} ＋ ${f9} ＋ ${f8} ＋ ${f7} ＝ ${total} students.`
          : `Αθροίζουμε όλες τις συχνότητες του πίνακα: ${f10} ＋ ${f9} ＋ ${f8} ＋ ${f7} ＝ ${total} μαθητές.`,
        distractors: wrongOpts
      };
    }
  },
  {
    id: 'freq_std_2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const fA = randInt(6, 10);
      const fB = randInt(12, 18);
      const fC = randInt(4, 8);

      const catA = isEn ? 'Adventure' : 'Περιπέτεια';
      const catB = isEn ? 'Sci-Fi' : 'Επιστημονική Φαντασία';
      const catC = isEn ? 'Historical' : 'Ιστορικό';
      const catD = isEn ? 'Comics' : 'Κόμικς';
      const readersUnit = isEn ? 'readers' : 'αναγνώστες';

      return {
        title: isEn ? 'Most Frequent Book Category (Mode)' : 'Επικρατούσα Κατηγορία Βιβλίων',
        prompt: isEn
          ? 'Observe the table of book genre preferences. Which genre has the highest frequency (mode)?'
          : 'Παρατηρήστε τον πίνακα προτιμήσεων για τρία βιβλία. Ποιο είναι το βιβλίο με τη μεγαλύτερη συχνότητα (επικρατούσα κατηγορία / mode);',
        promptMcq: isEn
          ? 'Observe the table of book genre preferences. Which genre has the highest frequency (mode)?'
          : 'Παρατηρήστε τον πίνακα προτιμήσεων για τρία βιβλία. Ποιο είναι το βιβλίο με τη μεγαλύτερη συχνότητα (επικρατούσα κατηγορία / mode);',
        table: {
          headers: [isEn ? 'Genre' : 'Βιβλίο', isEn ? 'Readers (f)' : 'Αναγνώστες (ν)'],
          rows: [
            [catA, fA],
            [catB, fB],
            [catC, fC]
          ]
        },
        unit: '',
        correctVal: catB,
        correctText: catB,
        tableData: [
          { item: catA, formula: `${fA} ${readersUnit}`, val: `${fA}` },
          { item: catB, formula: `${fB} ${readersUnit}`, val: `${fB} (${isEn ? 'Max' : 'Μέγιστο'})` },
          { item: catC, formula: `${fC} ${readersUnit}`, val: `${fC}` }
        ],
        explain: isEn
          ? `The mode is the category with the highest frequency. Here it is “${catB}” with ${fB} readers.`
          : `Η επικρατούσα κατηγορία είναι εκείνη με τη μεγαλύτερη συχνότητα. Εδώ είναι η «${catB}» με ${fB} αναγνώστες.`,
        distractors: [catA, catC, catD]
      };
    }
  },
  {
    id: 'freq_std_3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const total = 50;
      const freq = pickRandom([10, 15, 20, 25]);
      const relFreq = freq / total;
      const sportName = isEn ? 'Swimming' : 'Κολύμβηση';

      const wrongOpts = [
        formatNum(relFreq + 0.1, locale, 2),
        formatNum(Math.max(0.05, relFreq - 0.1), locale, 2),
        formatNum(relFreq + 0.15, locale, 2)
      ];

      return {
        title: isEn ? 'Relative Frequency Calculation' : 'Σχετική Συχνότητα Επιλογής',
        prompt: isEn
          ? `In a survey of 50 people, a specific sport was chosen by ${freq} participants. What is the relative frequency in decimal form? (write only the number)`
          : `Σε έρευνα 50 ατόμων, ένα συγκεκριμένο άθλημα επιλέχθηκε από ${freq} άτομα. Ποια είναι η σχετική συχνότητα της επιλογής αυτής σε δεκαδική μορφή; (γράψε μόνο τον αριθμό)`,
        promptMcq: isEn
          ? `In a survey of 50 people, a specific sport was chosen by ${freq} participants. What is the relative frequency in decimal form?`
          : `Σε έρευνα 50 ατόμων, ένα συγκεκριμένο άθλημα επιλέχθηκε από ${freq} άτομα. Ποια είναι η σχετική συχνότητα της επιλογής αυτής σε δεκαδική μορφή;`,
        table: {
          headers: [isEn ? 'Sport' : 'Άθλημα', isEn ? 'Frequency' : 'Συχνότητα', isEn ? 'Relative Frequency' : 'Σχετική Συχνότητα'],
          rows: [
            [sportName, freq, 'x']
          ],
          totalRow: [isEn ? 'TOTAL' : 'ΣΥΝΟΛΟ', 50, formatNum(1.0, locale, 2)]
        },
        unit: '',
        correctVal: formatNum(relFreq, locale, 2),
        correctText: formatNum(relFreq, locale, 2),
        tableData: [
          { item: isEn ? 'Frequency (f)' : 'Συχνότητα (ν)', formula: `${freq}`, val: `${freq}` },
          { item: isEn ? 'Sample size (N)' : 'Μέγεθος δείγματος (Ν)', formula: '50', val: '50' },
          {
            item: isEn ? 'Relative frequency' : 'Σχετική συχνότητα',
            formula: (
              <span className="inline-flex items-center">
                <Fraction num={freq} den="50" />
              </span>
            ),
            val: `${formatNum(relFreq, locale, 2)}`
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>
              {isEn
                ? 'Relative frequency equals frequency divided by total size:'
                : 'Η σχετική συχνότητα ισούται με τη συχνότητα προς το σύνολο:'}
            </span>
            <Fraction num={freq} den="50" />
            <span>＝ {formatNum(relFreq, locale, 2)}.</span>
          </span>
        ),
        distractors: wrongOpts
      };
    }
  },
  {
    id: 'freq_std_4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const f1 = randInt(4, 7);
      const f2 = randInt(8, 12);
      const f3 = randInt(3, 6);
      const total = 25;
      const f4 = total - f1 - f2 - f3;
      const unit = isEn ? 'students' : 'μαθητές';

      const wrongOpts = [
        `${f4 + 2} ${unit}`,
        `${Math.max(1, f4 - 2)} ${unit}`,
        `${f4 + 4} ${unit}`
      ];

      return {
        title: isEn ? 'Finding the Missing Frequency' : 'Εύρεση Συχνότητας που Λείπει',
        prompt: isEn
          ? 'In the frequency table of 25 students, the frequency of Grade 10 is missing. What is the value of x? (write only the number)'
          : 'Στον παρακάτω πίνακα κατανομής 25 μαθητών, λείπει η συχνότητα του Βαθμού 10. Ποια είναι η τιμή του x; (γράψε μόνο τον αριθμό)',
        promptMcq: isEn
          ? 'In the frequency table of 25 students, the frequency of Grade 10 is missing. What is the value of x?'
          : 'Στον παρακάτω πίνακα κατανομής 25 μαθητών, λείπει η συχνότητα του Βαθμού 10. Ποια είναι η τιμή του x;',
        table: {
          headers: [isEn ? 'Score' : 'Βαθμός', isEn ? 'Frequency (f)' : 'Συχνότητα (ν)'],
          rows: [
            [isEn ? 'Grade 7' : 'Βαθμός 7', f1],
            [isEn ? 'Grade 8' : 'Βαθμός 8', f2],
            [isEn ? 'Grade 9' : 'Βαθμός 9', f3],
            [isEn ? 'Grade 10' : 'Βαθμός 10', 'x']
          ],
          totalRow: [isEn ? 'TOTAL' : 'ΣΥΝΟΛΟ', 25]
        },
        unit,
        correctVal: String(f4),
        correctText: `${f4} ${unit}`,
        tableData: [
          { item: isEn ? 'Known frequencies' : 'Γνωστές συχνότητες', formula: `${f1} ＋ ${f2} ＋ ${f3}`, val: `${f1 + f2 + f3}` },
          { item: isEn ? 'Total students' : 'Σύνολο μαθητών', formula: '25', val: '25' },
          { item: isEn ? 'Unknown frequency (x)' : 'Άγνωστη συχνότητα (x)', formula: `25 － ${f1 + f2 + f3}`, val: `${f4}` }
        ],
        explain: isEn
          ? `The sum of all frequencies equals 25: x ＝ 25 － (${f1} ＋ ${f2} ＋ ${f3}) ＝ 25 － ${f1 + f2 + f3} ＝ ${f4}.`
          : `Το άθροισμα όλων των συχνοτήτων ισούται με 25: x ＝ 25 － (${f1} ＋ ${f2} ＋ ${f3}) ＝ 25 － ${f1 + f2 + f3} ＝ ${f4}.`,
        distractors: wrongOpts
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'freq_hard_1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const valStr = formatNum(57.1, locale, 1);
      return {
        title: isEn ? 'Percentage of High Scoring Students' : 'Ποσοστό Μαθητών με Υψηλή Βαθμολογία',
        prompt: isEn
          ? 'In the score table of 28 students below, what percentage (%) scored at least 9 (i.e. 9 or 10)? (write only the number)'
          : 'Στον παρακάτω πίνακα βαθμολογιών 28 μαθητών, ποιο ποσοστό (%) των μαθητών συγκέντρωσε βαθμό τουλάχιστον 9 (δηλαδή 9 ή 10); (γράψε μόνο τον αριθμό)',
        promptMcq: isEn
          ? 'In the score table of 28 students below, what percentage (%) scored at least 9 (i.e. 9 or 10)?'
          : 'Στον παρακάτω πίνακα βαθμολογιών 28 μαθητών, ποιο ποσοστό (%) των μαθητών συγκέντρωσε βαθμό τουλάχιστον 9 (δηλαδή 9 ή 10);',
        table: {
          headers: [isEn ? 'Score' : 'Βαθμός', isEn ? 'Frequency (f)' : 'Συχνότητα (ν)'],
          rows: [
            [isEn ? 'Grade 7' : 'Βαθμός 7', 4],
            [isEn ? 'Grade 8' : 'Βαθμός 8', 8],
            [isEn ? 'Grade 9' : 'Βαθμός 9', 10],
            [isEn ? 'Grade 10' : 'Βαθμός 10', 6]
          ],
          totalRow: [isEn ? 'TOTAL' : 'ΣΥΝΟΛΟ', 28]
        },
        unit: '%',
        correctVal: valStr,
        correctText: `${valStr} %`,
        tableData: [
          { item: isEn ? 'Students with 9 or 10' : 'Μαθητές με 9 ή 10', formula: '10 ＋ 6', val: isEn ? '16 students' : '16 μαθητές' },
          { item: isEn ? 'Total students' : 'Σύνολο μαθητών', formula: '28', val: '28' },
          {
            item: isEn ? 'Percentage (%)' : 'Ποσοστό (%)',
            formula: (
              <span className="inline-flex items-center">
                <Fraction num="16" den="28" />
                <span>· 100</span>
              </span>
            ),
            val: `${valStr} %`
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>
              {isEn
                ? 'Students with a score of at least 9: 10 ＋ 6 ＝ 16 students. Percentage:'
                : 'Μαθητές με βαθμό τουλάχιστον 9: 10 ＋ 6 ＝ 16 μαθητές. Ποσοστό:'}
            </span>
            <Fraction num="16" den="28" />
            <span>· 100 ＝ {valStr} %.</span>
          </span>
        ),
        distractors: [`${formatNum(50, locale, 0)} %`, `${formatNum(60, locale, 0)} %`, `${formatNum(53.5, locale, 1)} %`]
      };
    }
  },
  {
    id: 'freq_hard_2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const unit = isEn ? 'siblings' : 'αδέρφια';
      return {
        title: isEn ? 'Calculating Total Number of Siblings' : 'Υπολογισμός Συνολικών Αδερφών',
        prompt: isEn
          ? 'In a class, the number of siblings per student was recorded: 6 students have 1 sibling, 10 students have 2 siblings, and 4 students have 3 siblings. How many siblings do all students have in total? (write only the number)'
          : 'Σε μια τάξη καταγράφηκε ο αριθμός αδερφών κάθε μαθητή: 6 μαθητές έχουν 1 αδερφό, 10 μαθητές έχουν 2 αδέρφια και 4 μαθητές έχουν 3 αδέρφια. Πόσα είναι συνολικά τα αδέρφια όλων των μαθητών μαζί; (γράψε μόνο τον αριθμό)',
        promptMcq: isEn
          ? 'In a class, the number of siblings per student was recorded: 6 students have 1 sibling, 10 students have 2 siblings, and 4 students have 3 siblings. How many siblings do all students have in total?'
          : 'Σε μια τάξη καταγράφηκε ο αριθμός αδερφών κάθε μαθητή: 6 μαθητές έχουν 1 αδερφό, 10 μαθητές έχουν 2 αδέρφια και 4 μαθητές έχουν 3 αδέρφια. Πόσα είναι συνολικά τα αδέρφια όλων των μαθητών μαζί;',
        table: {
          headers: [isEn ? 'Siblings' : 'Αδέρφια', isEn ? 'Students (f)' : 'Μαθητές (ν)'],
          rows: [
            [isEn ? '1 sibling' : '1 αδερφός', 6],
            [isEn ? '2 siblings' : '2 αδέρφια', 10],
            [isEn ? '3 siblings' : '3 αδέρφια', 4]
          ]
        },
        unit,
        correctVal: '38',
        correctText: `38 ${unit}`,
        tableData: [
          { item: isEn ? 'Students with 1 sibling' : 'Μαθητές με 1 αδερφό', formula: '1 · 6', val: `6 ${unit}` },
          { item: isEn ? 'Students with 2 siblings' : 'Μαθητές με 2 αδέρφια', formula: '2 · 10', val: `20 ${unit}` },
          { item: isEn ? 'Students with 3 siblings' : 'Μαθητές με 3 αδέρφια', formula: '3 · 4', val: `12 ${unit}` },
          { item: isEn ? 'Total sum' : 'Συνολικό άθροισμα', formula: '6 ＋ 20 ＋ 12', val: `38 ${unit}` }
        ],
        explain: `(1 · 6) ＋ (2 · 10) ＋ (3 · 4) ＝ 6 ＋ 20 ＋ 12 ＝ 38 ${unit}.`,
        distractors: [`32 ${unit}`, `40 ${unit}`, `36 ${unit}`]
      };
    }
  },
  {
    id: 'freq_hard_3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const catA = isEn ? 'Category A' : 'Κατηγορία Α';
      const catB = isEn ? 'Category B' : 'Κατηγορία Β';
      const catC = isEn ? 'Category C' : 'Κατηγορία Γ';
      return {
        title: isEn ? 'Percentage Difference Between Categories' : 'Διαφορά Ποσοστιαίων Μονάδων Κατηγοριών',
        prompt: isEn
          ? `In the table of 40 students below, by how many percentage points (%) does ${catB} exceed ${catA}? (write only the number)`
          : `Στον παρακάτω πίνακα 40 μαθητών, κατά πόσες ποσοστιαίες μονάδες (%) υπερέχει η ${catB} σε σχέση με την ${catA}; (γράψε μόνο τον αριθμό)`,
        promptMcq: isEn
          ? `In the table of 40 students below, by how many percentage points (%) does ${catB} exceed ${catA}?`
          : `Στον παρακάτω πίνακα 40 μαθητών, κατά πόσες ποσοστιαίες μονάδες (%) υπερέχει η ${catB} σε σχέση με την ${catA};`,
        table: {
          headers: [isEn ? 'Category' : 'Κατηγορία', isEn ? 'Frequency (f)' : 'Συχνότητα (ν)'],
          rows: [
            [catA, 12],
            [catB, 18],
            [catC, 10]
          ],
          totalRow: [isEn ? 'TOTAL' : 'ΣΥΝΟΛΟ', 40]
        },
        unit: '%',
        correctVal: '15',
        correctText: '15 %',
        tableData: [
          {
            item: isEn ? `Percentage of ${catB}` : `Ποσοστό ${catB}`,
            formula: (
              <span className="inline-flex items-center">
                <Fraction num="18" den="40" />
                <span>· 100</span>
              </span>
            ),
            val: '45 %'
          },
          {
            item: isEn ? `Percentage of ${catA}` : `Ποσοστό ${catA}`,
            formula: (
              <span className="inline-flex items-center">
                <Fraction num="12" den="40" />
                <span>· 100</span>
              </span>
            ),
            val: '30 %'
          },
          { item: isEn ? 'Percentage difference' : 'Διαφορά ποσοστών', formula: '45 % － 30 %', val: '15 %' }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>{catB}:</span>
            <Fraction num="18" den="40" />
            <span>· 100 ＝ 45 %. {catA}:</span>
            <Fraction num="12" den="40" />
            <span>· 100 ＝ 30 %. {isEn ? 'Difference:' : 'Διαφορά:'} 45 % － 30 % ＝ 15 %.</span>
          </span>
        ),
        distractors: ['10 %', '20 %', '12 %']
      };
    }
  },
  {
    id: 'freq_hard_4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const unit = isEn ? 'consumers' : 'καταναλωτές';
      const pA = isEn ? 'Product A' : 'Προϊόν Α';
      const pB = isEn ? 'Product B' : 'Προϊόν Β';
      const pC = isEn ? 'Product C' : 'Προϊόν Γ';
      const pD = isEn ? 'Product D' : 'Προϊόν Δ';

      return {
        title: isEn ? 'Finding Frequency from 100-Person Percentage' : 'Εύρεση Συχνότητας από Ποσοστό 100 Ατόμων',
        prompt: isEn
          ? `In a survey of 100 consumers, preferences across 4 products were recorded. How many consumers chose ${pC}? (write only the number)`
          : `Σε έρευνα 100 καταναλωτών, οι προτιμήσεις σε 4 προϊόντα καταγράφηκαν στον πίνακα. Πόσοι καταναλωτές επέλεξαν το ${pC}; (γράψε μόνο τον αριθμό)`,
        promptMcq: isEn
          ? `In a survey of 100 consumers, preferences across 4 products were recorded. How many consumers chose ${pC}?`
          : `Σε έρευνα 100 καταναλωτών, οι προτιμήσεις σε 4 προϊόντα καταγράφηκαν στον πίνακα. Πόσοι καταναλωτές επέλεξαν το ${pC};`,
        table: {
          headers: [isEn ? 'Product' : 'Προϊόν', isEn ? 'Frequency' : 'Συχνότητα', isEn ? 'Percentage (%)' : 'Ποσοστό (%)'],
          rows: [
            [pA, 15, '15 %'],
            [pB, 25, '25 %'],
            [pC, 'x', '35 %'],
            [pD, 25, '25 %']
          ],
          totalRow: [isEn ? 'TOTAL' : 'ΣΥΝΟΛΟ', 100, '100 %']
        },
        unit,
        correctVal: '35',
        correctText: `35 ${unit}`,
        tableData: [
          { item: isEn ? `Percentage of ${pC}` : `Ποσοστό ${pC}`, formula: '35 %', val: '35 %' },
          { item: isEn ? 'Total sample size' : 'Συνολικό δείγμα', formula: isEn ? '100 people' : '100 άτομα', val: '100' },
          {
            item: isEn ? 'Absolute frequency' : 'Απόλυτη συχνότητα',
            formula: (
              <span className="inline-flex items-center">
                <Fraction num="100 · 35" den="100" />
              </span>
            ),
            val: '35'
          }
        ],
        explain: isEn
          ? `Since the total sample is exactly 100 consumers, a percentage of 35 % directly corresponds to a frequency of 35.`
          : 'Εφόσον το ποσοστό είναι 35 % σε σύνολο 100 καταναλωτών, η συχνότητά του είναι απευθείας 35.',
        distractors: [`30 ${unit}`, `40 ${unit}`, `25 ${unit}`]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions(locale) {
  const isEn = locale === 'en';

  // Q1: Input - Σύνολο συχνοτήτων
  const q1FA = randInt(4, 7);
  const q1FB = randInt(8, 12);
  const q1FC = randInt(3, 6);
  const q1FD = randInt(5, 9);
  const q1Sum = q1FA + q1FB + q1FC + q1FD;

  // Q2: MCQ - Ορισμός επικρατούσας τιμής
  const q2Correct = isEn
    ? 'The value of the variable that occurs with the highest frequency'
    : 'Η τιμή της μεταβλητής που εμφανίζεται με τη μεγαλύτερη συχνότητα';
  const q2Wrong = [
    isEn ? 'The sum of all frequencies divided by 2' : 'Το άθροισμα όλων των συχνοτήτων διαιρεμένο με το 2',
    isEn ? 'The difference between the maximum and minimum values' : 'Η διαφορά ανάμεσα στη μέγιστη και την ελάχιστη τιμή',
    isEn ? 'The value that appears exactly once' : 'Η τιμή που εμφανίζεται ακριβώς μία φορά'
  ];
  const q2Options = makeUniqueOptions(q2Correct, q2Wrong);

  // Q3: Input - Σχετική συχνότητα
  const q3Total = 20;
  const q3Freq = pickRandom([4, 5, 8, 10]);
  const q3Rel = q3Freq / q3Total;

  // Q4: MCQ - Ιδιότητα σχετικών συχνοτήτων
  const q4Correct = isEn
    ? 'It is always equal to 1 (or 100 %)'
    : 'Είναι πάντοτε ίσο με 1 (ή 100 %)';
  const q4Wrong = [
    isEn ? 'It equals the total number of students' : 'Είναι ίσο με το συνολικό πλήθος των μαθητών',
    isEn ? 'It is always equal to 0' : 'Είναι πάντοτε ίσο με 0',
    isEn ? 'It changes depending on the number of categories' : 'Αλλάζει ανάλογα με τον αριθμό των κατηγοριών'
  ];
  const q4Options = makeUniqueOptions(q4Correct, q4Wrong);

  // Q5: Input - Εύρεση άγνωστης συχνότητας
  const q5F1 = randInt(5, 8);
  const q5F2 = randInt(7, 10);
  const q5F3 = randInt(3, 6);
  const q5Total = 30;
  const q5Missing = q5Total - q5F1 - q5F2 - q5F3;

  // Q6: MCQ - Η έννοια του εύρους
  const q6Correct = isEn
    ? 'The difference between the highest and lowest values of the dataset'
    : 'Η διαφορά μεταξύ της μεγαλύτερης και της μικρότερης τιμής των δεδομένων';
  const q6Wrong = [
    isEn ? 'The sum of the maximum and minimum values' : 'Το άθροισμα της μεγαλύτερης και της μικρότερης τιμής',
    isEn ? 'The number of rows in the frequency table' : 'Ο αριθμός των γραμμών του πίνακα συχνοτήτων',
    isEn ? 'The percentage of the first category' : 'Το ποσοστό της πρώτης κατηγορίας'
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
      inputType: 'number',
      title: isEn ? 'Total Frequencies' : 'Σύνολο Συχνοτήτων',
      prompt: isEn
        ? 'How many total observations were recorded in the frequency table below? (write only the number)'
        : 'Πόσες ήταν συνολικά οι παρατηρήσεις που καταγράφηκαν στον παρακάτω πίνακα συχνοτήτων; (γράψε μόνο τον αριθμό)',
      table: {
        headers: [isEn ? 'Group' : 'Ομάδα', isEn ? 'Frequency (f)' : 'Συχνότητα (ν)'],
        rows: [
          [isEn ? 'Group A' : 'Ομάδα Α', q1FA],
          [isEn ? 'Group B' : 'Ομάδα Β', q1FB],
          [isEn ? 'Group C' : 'Ομάδα Γ', q1FC],
          [isEn ? 'Group D' : 'Ομάδα Δ', q1FD]
        ]
      },
      correct: String(q1Sum),
      explain: isEn
        ? `We sum all the frequencies: ${q1FA} ＋ ${q1FB} ＋ ${q1FC} ＋ ${q1FD} ＝ ${q1Sum}.`
        : `Αθροίζουμε όλες τις συχνότητες: ${q1FA} ＋ ${q1FB} ＋ ${q1FC} ＋ ${q1FD} ＝ ${q1Sum}.`
    },
    {
      id: 'q2',
      type: 'mcq',
      title: isEn ? 'Concept of Mode' : 'Η Έννοια της Επικρατούσας Τιμής',
      prompt: isEn
        ? 'What is defined as the “mode” (or prevailing value) in a frequency table?'
        : 'Τι ονομάζουμε «επικρατούσα τιμή» (ή mode) σε έναν πίνακα συχνοτήτων;',
      options: q2Options,
      correct: q2Correct,
      explain: isEn
        ? 'The mode is the value or category that appears with the highest frequency.'
        : 'Επικρατούσα τιμή (mode) είναι η τιμή ή κατηγορία που παρουσιάζει τη μεγαλύτερη συχνότητα εμφάνισης.'
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'decimal',
      title: isEn ? 'Relative Frequency' : 'Σχετική Συχνότητα',
      prompt: isEn
        ? 'In the table of 20 students below, what is the relative frequency of Category A in decimal form? (write only the number)'
        : 'Στον παρακάτω πίνακα 20 μαθητών, ποια είναι η σχετική συχνότητα της Κατηγορίας Α σε δεκαδική μορφή; (γράψε μόνο τον αριθμό)',
      table: {
        headers: [isEn ? 'Category' : 'Κατηγορία', isEn ? 'Frequency' : 'Συχνότητα', isEn ? 'Relative Frequency' : 'Σχετική Συχνότητα'],
        rows: [
          [isEn ? 'Category A' : 'Κατηγορία Α', q3Freq, 'x'],
          [isEn ? 'Others' : 'Άλλες', q3Total - q3Freq, formatNum((q3Total - q3Freq) / q3Total, locale, 2)]
        ],
        totalRow: [isEn ? 'TOTAL' : 'ΣΥΝΟΛΟ', q3Total, formatNum(1.0, locale, 2)]
      },
      correct: formatNum(q3Rel, locale, 2),
      explain: (
        <span className="inline-flex flex-wrap items-center gap-1">
          <span>{isEn ? 'Relative frequency ＝' : 'Σχετική συχνότητα ＝'}</span>
          <Fraction num={q3Freq} den="20" />
          <span>＝ {formatNum(q3Rel, locale, 2)}.</span>
        </span>
      )
    },
    {
      id: 'q4',
      type: 'mcq',
      title: isEn ? 'Property of Relative Frequencies' : 'Ιδιότητα Σχετικών Συχνοτήτων',
      prompt: isEn
        ? 'In a complete frequency distribution table, what is always true about the sum of all relative frequencies?'
        : 'Σε έναν πλήρη πίνακα κατανομής συχνοτήτων, τι ισχύει για το άθροισμα όλων των σχετικών συχνοτήτων;',
      options: q4Options,
      correct: q4Correct,
      explain: isEn
        ? 'Because relative frequencies express parts of a whole, their sum always equals 1 (or 100 %).'
        : 'Επειδή οι σχετικές συχνότητες εκφράζουν τα κλασματικά μέρη του όλου, το άθροισμά τους ισούται πάντα με 1 (ή 100 %).'
    },
    {
      id: 'q5',
      type: 'input',
      inputType: 'number',
      title: isEn ? 'Find Missing Frequency' : 'Εύρεση Άγνωστης Συχνότητας',
      prompt: isEn
        ? 'In a dataset of 30 students, what is the missing frequency x of Group D? (write only the number)'
        : 'Σε ένα σύνολο 30 μαθητών, ποια είναι η συχνότητα x της Ομάδας Δ που λείπει από τον πίνακα; (γράψε μόνο τον αριθμό)',
      table: {
        headers: [isEn ? 'Group' : 'Ομάδα', isEn ? 'Frequency (f)' : 'Συχνότητα (ν)'],
        rows: [
          [isEn ? 'Group A' : 'Ομάδα Α', q5F1],
          [isEn ? 'Group B' : 'Ομάδα Β', q5F2],
          [isEn ? 'Group C' : 'Ομάδα Γ', q5F3],
          [isEn ? 'Group D' : 'Ομάδα Δ', 'x']
        ],
        totalRow: [isEn ? 'TOTAL' : 'ΣΥΝΟΛΟ', 30]
      },
      correct: String(q5Missing),
      explain: isEn
        ? `x ＝ 30 － (${q5F1} ＋ ${q5F2} ＋ ${q5F3}) ＝ 30 － ${q5F1 + q5F2 + q5F3} ＝ ${q5Missing}.`
        : `x ＝ 30 － (${q5F1} ＋ ${q5F2} ＋ ${q5F3}) ＝ 30 － ${q5F1 + q5F2 + q5F3} ＝ ${q5Missing}.`
    },
    {
      id: 'q6',
      type: 'mcq',
      title: isEn ? 'Concept of Range' : 'Η Έννοια του Εύρους',
      prompt: isEn
        ? 'What is defined as the “range” of a numerical data series in Statistics?'
        : 'Τι ονομάζουμε «εύρος» μιας σειράς αριθμητικών παρατηρήσεων στη Στατιστική;',
      options: q6Options,
      correct: q6Correct,
      explain: isEn
        ? 'Range is the difference between the maximum and minimum observations (Range ＝ Max value － Min value).'
        : 'Εύρος ονομάζεται η διαφορά ανάμεσα στη μέγιστη και την ελάχιστη παρατήρηση (Εύρος ＝ Μέγιστη τιμή － Ελάχιστη τιμή).'
    },
    {
      id: 'q7',
      type: 'input',
      inputType: 'number',
      title: `${isEn ? 'Problem' : 'Πρόβλημα'}: ${q7Data.title}`,
      prompt: q7Data.prompt,
      table: q7Data.table,
      correct: q7Data.correctVal,
      tableData: q7Data.tableData,
      explain: q7Data.explain
    },
    {
      id: 'q8',
      type: 'mcq',
      title: `${isEn ? 'Problem' : 'Πρόβλημα'}: ${q8Data.title}`,
      prompt: q8Data.promptMcq || q8Data.prompt,
      table: q8Data.table,
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
      table: q9Data.table,
      correct: q9Data.correctVal,
      tableData: q9Data.tableData,
      explain: q9Data.explain
    },
    {
      id: 'q10',
      type: 'mcq',
      title: `${isEn ? 'Advanced Problem' : 'Σύνθετο Πρόβλημα'}: ${q10Data.title}`,
      prompt: q10Data.promptMcq || q10Data.prompt,
      table: q10Data.table,
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

export default function PinakasSixnotitonExercisesPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';

  const t = useMemo(() => {
    return {
      el: {
        pageTitle: "Ασκήσεις: Πίνακας Συχνοτήτων & Ταξινόμηση Δεδομένων - ΣΤ' Δημοτικού | LearnMaths.gr",
        metaDescription: "Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στην ταξινόμηση δεδομένων, στους πίνακες κατανομής συχνοτήτων και στις σχετικές συχνότητες για τη ΣΤ' Δημοτικού.",
        backText: "ΣΤ' Δημοτικού",
        theoryBtn: "Θεωρία",
        heroBadge: "ΚΕΦΑΛΑΙΟ 56 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
        heroTitle: "Διαδραστικές Ασκήσεις: Πίνακας Συχνοτήτων & Ταξινόμηση Δεδομένων",
        heroDesc: "Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στη συμπλήρωση πινάκων κατανομής συχνοτήτων, στον υπολογισμό σχετικών συχνοτήτων και στην επικρατούσα τιμή (mode)!",
        newSetBtn: "Νέες Ασκήσεις",
        exerciseLabel: "Άσκηση",
        inputPlaceholderNumber: "Απάντηση...",
        inputPlaceholderDecimal: "π.χ. 0,25",
        tableHeaderElement: "Στοιχείο",
        tableHeaderFormula: "Ανάλυση / Τύπος",
        tableHeaderVal: "Τιμή",
        feedbackSuccess: "🎯 Εξαιρετικά!",
        feedbackExplanation: "💡 Επεξήγηση:",
        checkBtn: "Έλεγχος Απαντήσεων",
        scoreLabel: "Σκορ",
        answeredLabel: "Απαντήθηκαν",
        pctLabel: "Ποσοστό",
        footerPrompt: "Απάντησε και στις 10 ερωτήσεις και πάτησε «Έλεγχος Απαντήσεων»!",
        tableHeadingText: "Πίνακας Κατανομής Συχνοτήτων"
      },
      en: {
        pageTitle: "Exercises: Frequency Tables & Data Organization - 6th Grade | LearnMaths.gr",
        metaDescription: "Interactive exercises with 10 questions and auto-grading on data sorting, frequency tables, and relative frequencies for 6th Grade.",
        backText: "6th Grade",
        theoryBtn: "Theory",
        heroBadge: "CHAPTER 56 • 6TH GRADE • PRACTICE",
        heroTitle: "Interactive Exercises: Frequency Tables & Data Organization",
        heroDesc: "Solve the 10 dynamic questions to master completing frequency distribution tables, calculating relative frequencies, and identifying the mode!",
        newSetBtn: "New Exercises",
        exerciseLabel: "Exercise",
        inputPlaceholderNumber: "Answer...",
        inputPlaceholderDecimal: "e.g. 0.25",
        tableHeaderElement: "Component",
        tableHeaderFormula: "Formula / Step",
        tableHeaderVal: "Value",
        feedbackSuccess: "🎯 Excellent!",
        feedbackExplanation: "💡 Explanation:",
        checkBtn: "Check Answers",
        scoreLabel: "Score",
        answeredLabel: "Answered",
        pctLabel: "Percentage",
        footerPrompt: "Answer all 10 questions and click “Check Answers”!",
        tableHeadingText: "Frequency Distribution Table"
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
      const cleanUser = userVal.replace(/\./g, ',').replace(/\s+/g, '').replace(/[%€]/g, '').trim().toLowerCase();
      const cleanTarget = String(q.correct).replace(/\./g, ',').replace(/\s+/g, '').replace(/[%€]/g, '').trim().toLowerCase();

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
          href="/st-dimotikou/56-pinakas-sixnotiton"
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

                    {/* ΠΙΝΑΚΑΣ ΣΥΧΝΟΤΗΤΩΝ (ΑΝ ΥΠΑΡΧΕΙ ΩΣ ΔΕΔΟΜΕΝΟ) */}
                    {q.table && (
                      <ExerciseFrequencyTable
                        headers={q.table.headers}
                        rows={q.table.rows}
                        totalRow={q.table.totalRow}
                        tableHeadingText={t.tableHeadingText}
                      />
                    )}

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