// pages/st-dimotikou/55-apeikonisi-data-ask.js
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// ---------------------------------------------------------
// ΒΟΗΘΗΤΙΚΑ COMPONENTS & ΣΥΝΑΡΤΗΣΕΙΣ
// ---------------------------------------------------------

// Εμφάνιση κλάσματος σε κανονική κατακόρυφη μορφή (responsive, ασφαλές για mobile)
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
      const fallbackVal = String(correct).replace(/\d+/, String(Math.max(1, baseNum + counter * 5)));
      unique.add(fallbackVal);
    } else {
      unique.add(`Επιλογή ${counter}`);
    }
    counter++;
  }

  return shuffle(Array.from(unique));
}

// Αφαίρεση τόνων για κεφαλαία (διατηρείται το ΣΤ')
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

// Μορφοποίηση αριθμού ανά locale
function formatNum(val, locale = 'el', decimals = 1) {
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  const targetLocale = locale === 'en' ? 'en-US' : 'el-GR';
  const num = Number(val);
  if (Number.isInteger(num)) {
    return num.toLocaleString(targetLocale);
  }
  return Number(num.toFixed(decimals)).toLocaleString(targetLocale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

// =========================================================================
// ΟΠΤΙΚΑ ΒΟΗΘΗΤΙΚΑ COMPONENTS (ΠΛΗΡΩΣ RESPONSIVE ΧΩΡΙΣ SCROLL)
// =========================================================================

function MiniBarChart({ data, maxVal = 100, yStep = 20, caption }) {
  const chartHeight = 150;
  const paddingLeft = 45;
  const chartWidth = 460;

  const yTicks = [];
  for (let v = 0; v <= maxVal; v += yStep) {
    yTicks.push(v);
  }

  const barCount = data.length;
  const barWidth = Math.min(42, Math.floor(280 / barCount));
  const totalBarWidth = barWidth * barCount;
  const gap = (chartWidth - paddingLeft - totalBarWidth) / (barCount + 1);

  return (
    <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-3.5 sm:p-5 my-3.5 w-full max-w-2xl shadow-inner min-w-0 box-border">
      <div className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider text-center mb-2 sm:mb-3 break-words [overflow-wrap:anywhere]">
        {toCleanUppercase(caption || 'Σχήμα: Ραβδόγραμμα Δεδομένων')}
      </div>
      <div className="w-full aspect-[16/9] sm:aspect-[2/1] bg-white rounded-2xl border border-slate-200 p-2 sm:p-3 shadow-sm flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 490 200" className="w-full h-auto max-h-[220px] overflow-visible">
          {/* Οριζόντιες γραμμές πλέγματος */}
          {yTicks.map((val) => {
            const y = chartHeight + 15 - (val / maxVal) * chartHeight;
            return (
              <g key={`bar-tick-${val}`}>
                <line x1={paddingLeft} y1={y} x2="475" y2={y} stroke="#f1f5f9" strokeWidth="1.5" />
                <text x={paddingLeft - 8} y={y + 4} fontSize="11" fontWeight="bold" fill="#64748b" textAnchor="end">
                  {val}
                </text>
              </g>
            );
          })}

          {/* Άξονες */}
          <line x1={paddingLeft} y1={chartHeight + 15} x2="480" y2={chartHeight + 15} stroke="#334155" strokeWidth="2.5" />
          <line x1={paddingLeft} y1={chartHeight + 15} x2={paddingLeft} y2="10" stroke="#334155" strokeWidth="2.5" />

          {/* Ράβδοι */}
          {data.map((item, idx) => {
            const bx = paddingLeft + gap + idx * (barWidth + gap);
            const bHeight = (item.value / maxVal) * chartHeight;
            const by = chartHeight + 15 - bHeight;
            const barColor = item.color || '#3b82f6';

            return (
              <g key={`bar-rect-${idx}`}>
                <rect x={bx} y={by} width={barWidth} height={Math.max(bHeight, 2)} fill={barColor} rx="5" />
                <text x={bx + barWidth / 2} y={by - 4} fontSize="12" fontWeight="900" fill="#0f172a" textAnchor="middle">
                  {item.value}
                </text>
                <text x={bx + barWidth / 2} y={chartHeight + 35} fontSize="11" fontWeight="bold" fill="#475569" textAnchor="middle">
                  {item.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function MiniPictogram({ items, legend, caption, legendPrefix = 'Υπόμνημα:' }) {
  return (
    <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-3 sm:p-5 my-3.5 w-full max-w-2xl shadow-inner space-y-2.5 min-w-0 box-border">
      <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-slate-200 pb-1.5 px-1">
        <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider break-words [overflow-wrap:anywhere]">
          {toCleanUppercase(caption || 'Σχήμα: Εικονόγραμμα')}
        </span>
        <span className="text-xs font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-amber-900 font-mono shrink-0">
          {legendPrefix} {legend}
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-2.5 sm:p-3 space-y-2 text-xs font-mono">
        {items.map((it, idx) => (
          <div key={`pic-${idx}`} className="flex items-center justify-between gap-2 p-1.5 sm:p-2 bg-slate-50 rounded-xl min-w-0">
            <span className="font-sans font-bold text-slate-700 w-24 sm:w-28 shrink-0 truncate">
              {it.label}:
            </span>
            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 grow select-none text-base sm:text-lg min-w-0">
              {Array.from({ length: it.symbols }).map((_, sIdx) => (
                <span key={`sym-icon-${sIdx}`}>{it.icon}</span>
              ))}
              {it.hasHalf && (
                <span className="text-[11px] font-bold bg-amber-100 border border-amber-300 text-amber-950 px-1 py-0.2 rounded font-sans">
                  ½
                </span>
              )}
            </div>
            {it.showTotal !== false && (
              <span className="font-bold text-slate-900 w-10 text-right shrink-0">
                {it.value}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// ΣΥΓΚΕΝΤΡΩΤΙΚΟ ΛΕΞΙΚΟ ΜΕΤΑΦΡΑΣΕΩΝ (i18n)
// ---------------------------------------------------------

const TRANSLATIONS = {
  el: {
    metaTitle: "Ασκήσεις: Απεικόνιση Δεδομένων (Ραβδόγραμμα & Εικονόγραμμα) - ΣΤ' Δημοτικού | LearnMaths.gr",
    metaDesc: "Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στα ραβδογράμματα, τα εικονογράμματα και την ερμηνεία δεδομένων για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryBtn: "Θεωρία",
    badgeChapter: "ΚΕΦΑΛΑΙΟ 55 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    heroTitle: "Διαδραστικές Ασκήσεις: Ραβδόγραμμα & Εικονόγραμμα",
    heroDesc: "Λύσε τα 10 δυναμικά θέματα με οπτικά διαγράμματα, υπολογισμό συχνοτήτων, ερμηνεία υπομνήματος και ανάλυση στατιστικών δεδομένων!",
    newQuestionsBtn: "Νέες Ασκήσεις",
    exercisePrefix: "Άσκηση",
    inputPlaceholder: "Απάντηση...",
    inputPlaceholderDecimal: "π.χ. 12,5",
    tableHeaderElement: "Στοιχείο",
    tableHeaderFormula: "Ανάλυση / Τύπος",
    tableHeaderValue: "Τιμή",
    feedbackSuccess: "🎯 Εξαιρετικά!",
    feedbackExplain: "💡 Επεξήγηση:",
    checkBtn: "Έλεγχος Απαντήσεων",
    scoreLabel: "Σκορ",
    answeredLabel: "Απαντήθηκαν",
    pctLabel: "Ποσοστό",
    bottomTip: "Απάντησε και στις 10 ερωτήσεις και πάτησε «Έλεγχος Απαντήσεων»!",

    barChartCaption: "Σχήμα: Ραβδόγραμμα Δεδομένων",
    pictoChartCaption: "Σχήμα: Εικονόγραμμα",
    legendPrefix: "Υπόμνημα:",

    // Concept questions (Q1 - Q6)
    q1Title: "Ανάγνωση Εικονογράμματος",
    q1Prompt: "Βάσει του παρακάτω εικονογράμματος, πόσα βιβλία διάβασε συνολικά ο μαθητής; (γράψε μόνο τον αριθμό)",
    q1Label: "Ανάγνωση",
    q1Explain: (syms, scale, total) => `Στο εικονόγραμμα υπάρχουν ${syms} σύμβολα. Αφού 📚 ＝ ${scale} βιβλία: ${syms} · ${scale} ＝ ${total} βιβλία.`,

    q2Title: "Κανόνες Κατασκευής Ραβδογράμματος",
    q2Prompt: "Ποιος από τους παρακάτω κανόνες είναι υποχρεωτικός κατά τη σχεδίαση ενός ραβδογράμματος;",
    q2Correct: "Όλες οι ράβδοι πρέπει να έχουν αυστηρά το ίδιο πλάτος και ίσα κενά μεταξύ τους",
    q2Distractors: [
      "Οι ράβδοι πρέπει να έχουν διαφορετικό πλάτος ανάλογα με την προτίμηση",
      "Δεν χρειάζεται να αναγράφεται κλίμακα στον κατακόρυφο άξονα",
      "Τα κενά ανάμεσα στις ράβδους πρέπει να μεγαλώνουν συνεχώς"
    ],
    q2Explain: "Στο ραβδόγραμμα μόνο το ύψος των ράβδων αλλάζει (ανάλογα με τη συχνότητα). Το πλάτος τους και οι αποστάσεις ανάμεσά τους παραμένουν αυστηρά ίσα.",

    q3Title: "Σχεδίαση Συμβόλων σε Εικονόγραμμα",
    q3Prompt: (total, scale) => `Θέλουμε να απεικονίσουμε ${total} δέντρα σε εικονόγραμμα με υπόμνημα 🌲 ＝ ${scale} δέντρα. Πόσα σύμβολα 🌲 πρέπει να σχεδιάσουμε; (γράψε μόνο τον αριθμό)`,
    q3Explain: (total, scale, req) => (
      <span className="inline-flex flex-wrap items-center gap-1">
        <span>Διαιρούμε το συνολικό μέγεθος με την κλίμακα του υπομνήματος:</span>
        <Fraction num={total} den={scale} />
        <span>＝ {req} σύμβολα.</span>
      </span>
    ),

    q4Title: "Η Έννοια της Συχνότητας",
    q4Prompt: "Τι ονομάζουμε «συχνότητα» ενός δεδομένου στη Στατιστική;",
    q4Correct: "Ο αριθμός που δείχνει πόσες φορές εμφανίζεται μια συγκεκριμένη τιμή ή επιλογή",
    q4Distractors: [
      "Το συνολικό άθροισμα όλων των αριθμών ενός προβλήματος",
      "Η διαφορά ανάμεσα στη μέγιστη και την ελάχιστη τιμή",
      "Το πλάτος της στήλης σε ένα ραβδόγραμμα"
    ],
    q4Explain: "Συχνότητα είναι το πλήθος των φορών που παρατηρείται ή επαναλαμβάνεται μια συγκεκριμένη τιμή ή κατηγορία.",

    q5Title: "Σύγκριση Υψών Ράβδων",
    q5Prompt: "Πόσο μεγαλύτερη είναι η συχνότητα της Κατηγορίας Α σε σχέση με την Κατηγορία Β; (γράψε μόνο τον αριθμό)",
    q5LabelA: "Κατηγορία Α",
    q5LabelB: "Κατηγορία Β",
    q5Explain: (hA, hB, diff) => `Διαβάζουμε τα ύψη: Κατηγορία Α ＝ ${hA} και Κατηγορία Β ＝ ${hB}. Διαφορά: ${hA} － ${hB} ＝ ${diff}.`,

    q6Title: "Η Σημασία του Υπομνήματος",
    q6Prompt: "Για ποιο λόγο είναι απολύτως απαραίτητο το υπόμνημα σε ένα εικονόγραμμα;",
    q6Correct: "Επειδή χωρίς υπόμνημα δεν γνωρίζουμε πόσες μονάδες αντιπροσωπεύει κάθε εικόνα",
    q6Distractors: [
      "Για να ομορφύνει το χρώμα του γραφήματος",
      "Για να μην χρειάζεται να κάνουμε πολλαπλασιασμό",
      "Επειδή είναι υποχρεωτικό μόνο στα ραβδογράμματα"
    ],
    q6Explain: "Το υπόμνημα καθορίζει την αναλογία/κλίμακα του συμβόλου (π.χ. 1 σύμβολο ＝ 5 μονάδες). Χωρίς αυτό, το εικονόγραμμα δεν μπορεί να διαβαστεί ποσοτικά.",

    problemBadge: "Πρόβλημα",
    hardProblemBadge: "Σύνθετο Πρόβλημα"
  },
  en: {
    metaTitle: "Exercises: Data Representation (Bar Chart & Pictogram) - Grade 6 | LearnMaths.gr",
    metaDesc: "Interactive practice exercises with 10 questions and auto-grading on bar charts, pictograms, and data interpretation for Grade 6.",
    backText: "Grade 6",
    theoryBtn: "Theory",
    badgeChapter: "CHAPTER 55 • GRADE 6 • PRACTICE",
    heroTitle: "Interactive Exercises: Bar Chart & Pictogram",
    heroDesc: "Solve the 10 dynamic exercises with visual graphs, frequency calculations, legend interpretations, and statistical data analysis!",
    newQuestionsBtn: "New Questions",
    exercisePrefix: "Exercise",
    inputPlaceholder: "Answer...",
    inputPlaceholderDecimal: "e.g. 12.5",
    tableHeaderElement: "Element",
    tableHeaderFormula: "Analysis / Formula",
    tableHeaderValue: "Value",
    feedbackSuccess: "🎯 Excellent!",
    feedbackExplain: "💡 Explanation:",
    checkBtn: "Check Answers",
    scoreLabel: "Score",
    answeredLabel: "Answered",
    pctLabel: "Percentage",
    bottomTip: "Answer all 10 questions and click \"Check Answers\"!",

    barChartCaption: "Figure: Data Bar Chart",
    pictoChartCaption: "Figure: Pictogram",
    legendPrefix: "Legend:",

    // Concept questions (Q1 - Q6)
    q1Title: "Reading a Pictogram",
    q1Prompt: "Based on the pictogram below, how many books did the student read in total? (write only the number)",
    q1Label: "Reading",
    q1Explain: (syms, scale, total) => `There are ${syms} symbols in the pictogram. Since 📚 ＝ ${scale} books: ${syms} · ${scale} ＝ ${total} books.`,

    q2Title: "Bar Chart Construction Rules",
    q2Prompt: "Which of the following rules is mandatory when drawing a bar chart?",
    q2Correct: "All bars must strictly have the exact same width and equal spacing between them",
    q2Distractors: [
      "Bars must have different widths depending on preference",
      "No vertical axis scale is needed",
      "The gaps between bars must continuously widen"
    ],
    q2Explain: "In a bar chart, only bar heights vary (proportional to frequency). Their widths and the spaces between them remain strictly equal.",

    q3Title: "Drawing Symbols in a Pictogram",
    q3Prompt: (total, scale) => `We want to represent ${total} trees in a pictogram with legend 🌲 ＝ ${scale} trees. How many symbols 🌲 must we draw? (write only the number)`,
    q3Explain: (total, scale, req) => (
      <span className="inline-flex flex-wrap items-center gap-1">
        <span>Divide the total count by the legend scale:</span>
        <Fraction num={total} den={scale} />
        <span>＝ ${req} symbols.</span>
      </span>
    ),

    q4Title: "The Concept of Frequency",
    q4Prompt: "What do we call \"frequency\" of a data value in Statistics?",
    q4Correct: "The number showing how many times a specific value or category occurs",
    q4Distractors: [
      "The total sum of all numbers in a problem",
      "The difference between maximum and minimum values",
      "The width of a column in a bar chart"
    ],
    q4Explain: "Frequency is the number of times a particular value or category is observed or repeated.",

    q5Title: "Comparing Bar Heights",
    q5Prompt: "How much greater is the frequency of Category A compared to Category B? (write only the number)",
    q5LabelA: "Category A",
    q5LabelB: "Category B",
    q5Explain: (hA, hB, diff) => `Read the bar heights: Category A ＝ ${hA} and Category B ＝ ${hB}. Difference: ${hA} － ${hB} ＝ ${diff}.`,

    q6Title: "The Importance of the Legend",
    q6Prompt: "Why is a legend strictly necessary in a pictogram?",
    q6Correct: "Because without a legend we cannot know how many units each picture represents",
    q6Distractors: [
      "To make the chart colors look better",
      "To avoid having to do multiplication",
      "Because it is required only on bar charts"
    ],
    q6Explain: "The legend sets the scale of each icon (e.g. 1 icon ＝ 5 units). Without it, a pictogram cannot be interpreted quantitatively.",

    problemBadge: "Problem",
    hardProblemBadge: "Multi-Step Problem"
  }
};

// ---------------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (Q7, Q8, Q9, Q10) - "NO-GIVEAWAY"
// ---------------------------------------------------------

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'data_std_1',
    generate: (locale) => {
      const isEl = locale === 'el';
      const scale = pickRandom([5, 10, 20]);
      const fullSyms = randInt(4, 6);
      const totalUnits = fullSyms * scale;

      const wrongOpts = [
        `${totalUnits + scale} kg`,
        `${Math.max(scale, totalUnits - scale)} kg`,
        `${totalUnits + 2 * scale} kg`
      ];

      return {
        title: isEl ? 'Ανακύκλωση Χαρτιού σε Εικονόγραμμα' : 'Paper Recycling in Pictogram',
        prompt: isEl
          ? 'Παρατηρήστε το παρακάτω εικονόγραμμα ανακύκλωσης χαρτιού. Πόσα kg χαρτιού συγκέντρωσε η τάξη; (γράψε μόνο τον αριθμό)'
          : 'Observe the paper recycling pictogram below. How many kg of paper did the class collect? (write only the number)',
        promptMcq: isEl
          ? 'Παρατηρήστε το παρακάτω εικονόγραμμα ανακύκλωσης χαρτιού. Πόσα kg χαρτιού συγκέντρωσε η τάξη;'
          : 'Observe the paper recycling pictogram below. How many kg of paper did the class collect?',
        pictogram: {
          legend: `📦 ＝ ${scale} kg`,
          items: [
            { label: isEl ? 'ΣΤ1 Τάξη' : 'Grade 6A', icon: '📦', symbols: fullSyms, value: '?' }
          ]
        },
        correctVal: String(totalUnits),
        correctText: `${totalUnits} kg`,
        tableData: [
          { item: isEl ? 'Πλήθος συμβόλων' : 'Number of symbols', formula: `${fullSyms} ${isEl ? 'σύμβολα' : 'symbols'}`, val: `${fullSyms}` },
          { item: isEl ? 'Αξία ανά σύμβολο' : 'Value per symbol', formula: `${scale} kg`, val: `${scale} kg` },
          { item: isEl ? 'Συνολική ποσότητα' : 'Total quantity', formula: `${fullSyms} · ${scale}`, val: `${totalUnits} kg` }
        ],
        explain: isEl
          ? `Στο εικονόγραμμα υπάρχουν ${fullSyms} σύμβολα. Βάσει του υπομνήματος (📦 ＝ ${scale} kg): ${fullSyms} · ${scale} ＝ ${totalUnits} kg.`
          : `There are ${fullSyms} symbols in the pictogram. From the legend (📦 ＝ ${scale} kg): ${fullSyms} · ${scale} ＝ ${totalUnits} kg.`,
        distractors: wrongOpts
      };
    }
  },
  {
    id: 'data_std_2',
    generate: (locale) => {
      const isEl = locale === 'el';
      const vA = randInt(15, 25);
      const vB = randInt(10, 20);
      const vC = randInt(20, 30);
      const total = vA + vB + vC;

      const wrongOpts = [
        `${total + 5} ${isEl ? 'μαθητές' : 'students'}`,
        `${Math.max(10, total - 5)} ${isEl ? 'μαθητές' : 'students'}`,
        `${total + 10} ${isEl ? 'μαθητές' : 'students'}`
      ];

      return {
        title: isEl ? 'Σύνολο Προτιμήσεων σε Ραβδόγραμμα' : 'Total Preferences in Bar Chart',
        prompt: isEl
          ? 'Στο παρακάτω ραβδόγραμμα καταγράφηκαν οι προτιμήσεις σε γεύσεις παγωτού. Πόσοι ήταν συνολικά οι μαθητές που συμμετείχαν στην έρευνα; (γράψε μόνο τον αριθμό)'
          : 'The bar chart below records ice cream flavor preferences. How many students participated in the survey in total? (write only the number)',
        promptMcq: isEl
          ? 'Στο παρακάτω ραβδόγραμμα καταγράφηκαν οι προτιμήσεις σε γεύσεις παγωτού. Πόσοι ήταν συνολικά οι μαθητές που συμμετείχαν στην έρευνα;'
          : 'The bar chart below records ice cream flavor preferences. How many students participated in the survey in total?',
        barChart: {
          maxVal: 35,
          yStep: 10,
          data: [
            { label: isEl ? 'Σοκολάτα' : 'Chocolate', value: vA, color: '#854d0e' },
            { label: isEl ? 'Βανίλια' : 'Vanilla', value: vB, color: '#f59e0b' },
            { label: isEl ? 'Φράουλα' : 'Strawberry', value: vC, color: '#ec4899' }
          ]
        },
        correctVal: String(total),
        correctText: `${total} ${isEl ? 'μαθητές' : 'students'}`,
        tableData: [
          { item: isEl ? 'Σοκολάτα' : 'Chocolate', formula: `${vA} ${isEl ? 'μαθητές' : 'students'}`, val: `${vA}` },
          { item: isEl ? 'Βανίλια' : 'Vanilla', formula: `${vB} ${isEl ? 'μαθητές' : 'students'}`, val: `${vB}` },
          { item: isEl ? 'Φράουλα' : 'Strawberry', formula: `${vC} ${isEl ? 'μαθητές' : 'students'}`, val: `${vC}` },
          { item: isEl ? 'Συνολικό άθροισμα' : 'Total sum', formula: `${vA} ＋ ${vB} ＋ ${vC}`, val: `${total} ${isEl ? 'μαθητές' : 'students'}` }
        ],
        explain: isEl
          ? `Διαβάζουμε τα ύψη των ράβδων και αθροίζουμε τις συχνότητες: ${vA} ＋ ${vB} ＋ ${vC} ＝ ${total} μαθητές.`
          : `We read the bar heights and sum the frequencies: ${vA} ＋ ${vB} ＋ ${vC} ＝ ${total} students.`,
        distractors: wrongOpts
      };
    }
  },
  {
    id: 'data_std_3',
    generate: (locale) => {
      const isEl = locale === 'el';
      const vMon = randInt(20, 35);
      const vFri = vMon + randInt(10, 20);
      const diff = vFri - vMon;

      const wrongOpts = [
        `${diff + 5} ${isEl ? 'επισκέπτες' : 'visitors'}`,
        `${Math.max(2, diff - 5)} ${isEl ? 'επισκέπτες' : 'visitors'}`,
        `${diff + 10} ${isEl ? 'επισκέπτες' : 'visitors'}`
      ];

      return {
        title: isEl ? 'Διαφορά Επισκεπτών Μουσείου' : 'Museum Visitors Difference',
        prompt: isEl
          ? 'Στο ραβδόγραμμα απεικονίζονται οι επισκέπτες ενός μουσείου τη Δευτέρα και την Παρασκευή. Πόσους περισσότερους επισκέπτες είχε το μουσείο την Παρασκευή; (γράψε μόνο τον αριθμό)'
          : 'The bar chart shows museum visitors on Monday and Friday. How many more visitors did the museum have on Friday? (write only the number)',
        promptMcq: isEl
          ? 'Στο ραβδόγραμμα απεικονίζονται οι επισκέπτες ενός μουσείου τη Δευτέρα και την Παρασκευή. Πόσους περισσότερους επισκέπτες είχε το μουσείο την Παρασκευή;'
          : 'The bar chart shows museum visitors on Monday and Friday. How many more visitors did the museum have on Friday?',
        barChart: {
          maxVal: 60,
          yStep: 20,
          data: [
            { label: isEl ? 'Δευτέρα' : 'Monday', value: vMon, color: '#64748b' },
            { label: isEl ? 'Παρασκευή' : 'Friday', value: vFri, color: '#3b82f6' }
          ]
        },
        correctVal: String(diff),
        correctText: `${diff} ${isEl ? 'επισκέπτες' : 'visitors'}`,
        tableData: [
          { item: isEl ? 'Επισκέπτες Παρασκευής' : 'Friday visitors', formula: `${vFri}`, val: `${vFri}` },
          { item: isEl ? 'Επισκέπτες Δευτέρας' : 'Monday visitors', formula: `${vMon}`, val: `${vMon}` },
          { item: isEl ? 'Διαφορά' : 'Difference', formula: `${vFri} － ${vMon}`, val: `${diff} ${isEl ? 'επισκέπτες' : 'visitors'}` }
        ],
        explain: isEl
          ? `Διαβάζουμε τα ύψη των ράβδων: Παρασκευή ${vFri} και Δευτέρα ${vMon}. Διαφορά: ${vFri} － ${vMon} ＝ ${diff} επισκέπτες.`
          : `Reading bar heights: Friday ${vFri} and Monday ${vMon}. Difference: ${vFri} － ${vMon} ＝ ${diff} visitors.`,
        distractors: wrongOpts
      };
    }
  },
  {
    id: 'data_std_4',
    generate: (locale) => {
      const isEl = locale === 'el';
      const totalTrees = pickRandom([60, 80, 100, 120]);
      const scale = pickRandom([10, 20]);
      const reqSymbols = totalTrees / scale;

      const wrongOpts = [
        `${reqSymbols + 2} ${isEl ? 'σύμβολα' : 'symbols'}`,
        `${Math.max(1, reqSymbols - 2)} ${isEl ? 'σύμβολα' : 'symbols'}`,
        `${reqSymbols + 4} ${isEl ? 'σύμβολα' : 'symbols'}`
      ];

      return {
        title: isEl ? 'Υπολογισμός Συμβόλων Εικονογράμματος' : 'Pictogram Symbol Count Calculation',
        prompt: isEl
          ? `Ένας γεωπόνος θέλει να σχεδιάσει εικονόγραμμα για ${totalTrees} ελαιόδεντρα, χρησιμοποιώντας υπόμνημα 🌳 ＝ ${scale} δέντρα. Πόσα σύμβολα πρέπει να σχεδιάσει; (γράψε μόνο τον αριθμό)`
          : `An agronomist wants to design a pictogram for ${totalTrees} olive trees using legend 🌳 ＝ ${scale} trees. How many symbols must be drawn? (write only the number)`,
        promptMcq: isEl
          ? `Ένας γεωπόνος θέλει να σχεδιάσει εικονόγραμμα για ${totalTrees} ελαιόδεντρα, χρησιμοποιώντας υπόμνημα 🌳 ＝ ${scale} δέντρα. Πόσα σύμβολα πρέπει να σχεδιάσει;`
          : `An agronomist wants to design a pictogram for ${totalTrees} olive trees using legend 🌳 ＝ ${scale} trees. How many symbols must be drawn?`,
        correctVal: String(reqSymbols),
        correctText: `${reqSymbols} ${isEl ? 'σύμβολα' : 'symbols'}`,
        tableData: [
          { item: isEl ? 'Συνολικά δέντρα' : 'Total trees', formula: `${totalTrees} ${isEl ? 'δέντρα' : 'trees'}`, val: `${totalTrees}` },
          { item: isEl ? 'Κλίμακα ανά σύμβολο' : 'Scale per symbol', formula: `${scale} ${isEl ? 'δέντρα' : 'trees'}`, val: `${scale}` },
          {
            item: isEl ? 'Απαιτούμενα σύμβολα' : 'Required symbols',
            formula: (
              <span className="inline-flex items-center">
                <Fraction num={totalTrees} den={scale} />
              </span>
            ),
            val: `${reqSymbols}`
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>{isEl ? 'Διαιρούμε το συνολικό πλήθος με την κλίμακα του υπομνήματος:' : 'Divide the total count by the legend scale:'}</span>
            <Fraction num={totalTrees} den={scale} />
            <span>＝ {reqSymbols} {isEl ? 'σύμβολα.' : 'symbols.'}</span>
          </span>
        ),
        distractors: wrongOpts
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'data_hard_1',
    generate: (locale) => {
      const isEl = locale === 'el';
      const mon = 40;
      const tue = 60;
      const wed = 50;
      const thu = 70;
      const total = mon + tue + wed + thu;
      const avg = total / 4;

      const wrongOpts = [
        `${avg + 5} ${isEl ? 'κιβώτια' : 'boxes'}`,
        `${Math.max(10, avg - 5)} ${isEl ? 'κιβώτια' : 'boxes'}`,
        `${avg + 10} ${isEl ? 'κιβώτια' : 'boxes'}`
      ];

      return {
        title: isEl ? 'Μέσος Όρος Παραγωγής από Ραβδόγραμμα' : 'Mean Production from Bar Chart',
        prompt: isEl
          ? 'Στο παρακάτω ραβδόγραμμα καταγράφεται η ημερήσια παραγωγή κιβωτίων ενός εργοστασίου για 4 ημέρες. Ποιος ήταν ο μέσος όρος παραγωγής ανά ημέρα; (γράψε μόνο τον αριθμό)'
          : 'The bar chart below shows the daily box production of a factory over 4 days. What was the average production per day? (write only the number)',
        promptMcq: isEl
          ? 'Στο παρακάτω ραβδόγραμμα καταγράφεται η ημερήσια παραγωγή κιβωτίων ενός εργοστασίου για 4 ημέρες. Ποιος ήταν ο μέσος όρος παραγωγής ανά ημέρα;'
          : 'The bar chart below shows the daily box production of a factory over 4 days. What was the average production per day?',
        barChart: {
          maxVal: 80,
          yStep: 20,
          data: [
            { label: isEl ? 'Δευτέρα' : 'Monday', value: mon, color: '#3b82f6' },
            { label: isEl ? 'Τρίτη' : 'Tuesday', value: tue, color: '#2563eb' },
            { label: isEl ? 'Τετάρτη' : 'Wednesday', value: wed, color: '#1d4ed8' },
            { label: isEl ? 'Πέμπτη' : 'Thursday', value: thu, color: '#1e40af' }
          ]
        },
        correctVal: String(avg),
        correctText: `${avg} ${isEl ? 'κιβώτια' : 'boxes'}`,
        tableData: [
          { item: isEl ? 'Συνολική παραγωγή (4 ημέρες)' : 'Total production (4 days)', formula: `${mon} ＋ ${tue} ＋ ${wed} ＋ ${thu}`, val: `${total} ${isEl ? 'κιβώτια' : 'boxes'}` },
          {
            item: isEl ? 'Μέσος όρος ανά ημέρα' : 'Average per day',
            formula: (
              <span className="inline-flex items-center">
                <Fraction num={total} den="4" />
              </span>
            ),
            val: `${avg} ${isEl ? 'κιβώτια' : 'boxes'}`
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>
              {isEl
                ? `1ο Βήμα: Συνολική παραγωγή: 40 ＋ 60 ＋ 50 ＋ 70 ＝ ${total} κιβώτια. 2ο Βήμα: Μέσος όρος:`
                : `Step 1: Total production: 40 ＋ 60 ＋ 50 ＋ 70 ＝ ${total} boxes. Step 2: Mean:`}
            </span>
            <Fraction num={total} den="4" />
            <span>＝ {avg} {isEl ? 'κιβώτια ανά ημέρα.' : 'boxes per day.'}</span>
          </span>
        ),
        distractors: wrongOpts
      };
    }
  },
  {
    id: 'data_hard_2',
    generate: (locale) => {
      const isEl = locale === 'el';
      const soccer = 48;
      const basket = 36;
      const track = 36;

      return {
        title: isEl ? 'Υπολογισμός Ποσοστού από Ραβδόγραμμα' : 'Percentage Calculation from Bar Chart',
        prompt: isEl
          ? 'Στο ραβδόγραμμα προτιμήσεων 120 συνολικά μαθητών, πόσο είναι το ποσοστό (%) των μαθητών που επέλεξαν τον στίβο; (γράψε μόνο τον αριθμό)'
          : 'In a preference bar chart of 120 total students, what is the percentage (%) of students who chose track & field? (write only the number)',
        promptMcq: isEl
          ? 'Στο ραβδόγραμμα προτιμήσεων 120 συνολικά μαθητών, πόσο είναι το ποσοστό (%) των μαθητών που επέλεξαν τον στίβο;'
          : 'In a preference bar chart of 120 total students, what is the percentage (%) of students who chose track & field?',
        barChart: {
          maxVal: 60,
          yStep: 20,
          data: [
            { label: isEl ? 'Ποδόσφαιρο' : 'Football', value: soccer, color: '#10b981' },
            { label: isEl ? 'Μπάσκετ' : 'Basketball', value: basket, color: '#f59e0b' },
            { label: isEl ? 'Στίβος' : 'Track', value: track, color: '#6366f1' }
          ]
        },
        correctVal: '30',
        correctText: '30 %',
        tableData: [
          { item: isEl ? 'Μαθητές που επέλεξαν στίβο' : 'Students who chose track', formula: `${track} ${isEl ? 'μαθητές' : 'students'}`, val: `${track}` },
          { item: isEl ? 'Σύνολο μαθητών' : 'Total students', formula: `120 ${isEl ? 'μαθητές' : 'students'}`, val: '120' },
          {
            item: isEl ? 'Ποσοστό (%)' : 'Percentage (%)',
            formula: (
              <span className="inline-flex items-center">
                <Fraction num={track} den="120" />
                <span>· 100</span>
              </span>
            ),
            val: '30 %'
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>
              {isEl
                ? 'Από το ραβδόγραμμα, ο στίβος έχει 36 μαθητές. Σε σύνολο 120 μαθητών:'
                : 'From the bar chart, track has 36 students. Out of 120 total students:'}
            </span>
            <Fraction num="36" den="120" />
            <span>· 100 ＝ 30 %.</span>
          </span>
        ),
        distractors: ['25 %', '35 %', '40 %']
      };
    }
  },
  {
    id: 'data_hard_3',
    generate: (locale) => {
      const isEl = locale === 'el';
      const catA = 90;
      const catB = 70;
      const catC = 40;
      const diff = catA - catC;

      const wrongOpts = [
        `${diff + 10} ${isEl ? 'ψήφοι' : 'votes'}`,
        `${Math.max(10, diff - 10)} ${isEl ? 'ψήφοι' : 'votes'}`,
        `${diff + 20} ${isEl ? 'ψήφοι' : 'votes'}`
      ];

      return {
        title: isEl ? 'Σύγκριση Ψήφων σε Ραβδόγραμμα' : 'Vote Comparison in Bar Chart',
        prompt: isEl
          ? 'Παρατηρήστε το ραβδόγραμμα ψήφων σχολικού συμβουλίου. Πόσες περισσότερες ψήφους έλαβε η πρόταση Α από την πρόταση Γ; (γράψε μόνο τον αριθμό)'
          : 'Observe the school council vote bar chart. How many more votes did Proposal A receive than Proposal C? (write only the number)',
        promptMcq: isEl
          ? 'Παρατηρήστε το ραβδόγραμμα ψήφων σχολικού συμβουλίου. Πόσες περισσότερες ψήφους έλαβε η πρόταση Α από την πρόταση Γ;'
          : 'Observe the school council vote bar chart. How many more votes did Proposal A receive than Proposal C?',
        barChart: {
          maxVal: 100,
          yStep: 20,
          data: [
            { label: isEl ? 'Πρόταση Α' : 'Proposal A', value: catA, color: '#3b82f6' },
            { label: isEl ? 'Πρόταση Β' : 'Proposal B', value: catB, color: '#64748b' },
            { label: isEl ? 'Πρόταση Γ' : 'Proposal C', value: catC, color: '#f43f5e' }
          ]
        },
        correctVal: String(diff),
        correctText: `${diff} ${isEl ? 'ψήφοι' : 'votes'}`,
        tableData: [
          { item: isEl ? 'Ψήφοι Πρότασης Α' : 'Proposal A votes', formula: `${catA}`, val: `${catA}` },
          { item: isEl ? 'Ψήφοι Πρότασης Γ' : 'Proposal C votes', formula: `${catC}`, val: `${catC}` },
          { item: isEl ? 'Διαφορά ψήφων' : 'Vote difference', formula: `${catA} － ${catC}`, val: `${diff} ${isEl ? 'ψήφοι' : 'votes'}` }
        ],
        explain: isEl
          ? `Διαβάζουμε από το ραβδόγραμμα: Πρόταση Α ＝ ${catA} ψήφοι και Πρόταση Γ ＝ ${catC} ψήφοι. Διαφορά: ${catA} － ${catC} ＝ ${diff} ψήφοι.`
          : `From the bar chart: Proposal A ＝ ${catA} votes and Proposal C ＝ ${catC} votes. Difference: ${catA} － ${catC} ＝ ${diff} votes.`,
        distractors: wrongOpts
      };
    }
  },
  {
    id: 'data_hard_4',
    generate: (locale) => {
      const isEl = locale === 'el';
      const scale = 25;
      const symA = 6;
      const symB = 8;
      const totalA = symA * scale;
      const totalB = symB * scale;
      const diffTrees = (symB - symA) * scale;

      const wrongOpts = [
        `${diffTrees + 25} ${isEl ? 'δέντρα' : 'trees'}`,
        `${Math.max(10, diffTrees - 15)} ${isEl ? 'δέντρα' : 'trees'}`,
        `${diffTrees + 50} ${isEl ? 'δέντρα' : 'trees'}`
      ];

      return {
        title: isEl ? 'Σύγκριση Ομάδων σε Εικονόγραμμα Αναδάσωσης' : 'Team Comparison in Reforestation Pictogram',
        prompt: isEl
          ? 'Στο παρακάτω εικονόγραμμα αναδάσωσης, πόσα περισσότερα δέντρα φύτεψε η Ομάδα Β σε σχέση με την Ομάδα Α; (γράψε μόνο τον αριθμό)'
          : 'In the reforestation pictogram below, how many more trees did Team B plant compared to Team A? (write only the number)',
        promptMcq: isEl
          ? 'Στο παρακάτω εικονόγραμμα αναδάσωσης, πόσα περισσότερα δέντρα φύτεψε η Ομάδα Β σε σχέση με την Ομάδα Α;'
          : 'In the reforestation pictogram below, how many more trees did Team B plant compared to Team A?',
        pictogram: {
          legend: `🌲 ＝ ${scale} ${isEl ? 'δέντρα' : 'trees'}`,
          items: [
            { label: isEl ? 'Ομάδα Α' : 'Team A', icon: '🌲', symbols: symA, value: `${totalA}` },
            { label: isEl ? 'Ομάδα Β' : 'Team B', icon: '🌲', symbols: symB, value: `${totalB}` }
          ]
        },
        correctVal: String(diffTrees),
        correctText: `${diffTrees} ${isEl ? 'δέντρα' : 'trees'}`,
        tableData: [
          { item: isEl ? 'Διαφορά συμβόλων' : 'Symbol difference', formula: `${symB} － ${symA}`, val: `2 ${isEl ? 'σύμβολα' : 'symbols'}` },
          { item: isEl ? 'Αξία ανά σύμβολο' : 'Value per symbol', formula: `${scale} ${isEl ? 'δέντρα' : 'trees'}`, val: `${scale}` },
          { item: isEl ? 'Διαφορά σε δέντρα' : 'Difference in trees', formula: `2 · ${scale}`, val: `${diffTrees} ${isEl ? 'δέντρα' : 'trees'}` }
        ],
        explain: isEl
          ? `Η διαφορά στο εικονόγραμμα είναι 8 － 6 ＝ 2 σύμβολα. Επειδή 🌲 ＝ ${scale} δέντρα: 2 · ${scale} ＝ ${diffTrees} δέντρα.`
          : `The symbol difference in the pictogram is 8 － 6 ＝ 2 symbols. Since 🌲 ＝ ${scale} trees: 2 · ${scale} ＝ ${diffTrees} trees.`,
        distractors: wrongOpts
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions(locale = 'el') {
  const t = TRANSLATIONS[locale] || TRANSLATIONS.el;

  // Q1: Input - Ανάγνωση εικονογράμματος
  const q1Scale = pickRandom([4, 5, 8, 10]);
  const q1Symbols = randInt(3, 6);
  const q1Total = q1Symbols * q1Scale;

  // Q2: MCQ - Κανόνες κατασκευής ραβδογράμματος
  const q2Options = makeUniqueOptions(t.q2Correct, t.q2Distractors);

  // Q3: Input - Σχεδίαση συμβόλων
  const q3TotalItems = pickRandom([40, 50, 60, 80, 100]);
  const q3Scale = pickRandom([5, 10, 20]);
  const q3ReqSyms = q3TotalItems / q3Scale;

  // Q4: MCQ - Η έννοια της συχνότητας
  const q4Options = makeUniqueOptions(t.q4Correct, t.q4Distractors);

  // Q5: Input - Σύγκριση υψών ράβδων
  const q5ValHigh = randInt(25, 40);
  const q5ValLow = randInt(10, 20);
  const q5Diff = q5ValHigh - q5ValLow;

  // Q6: MCQ - Η σημασία του υπομνήματος
  const q6Options = makeUniqueOptions(t.q6Correct, t.q6Distractors);

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
      title: t.q1Title,
      prompt: t.q1Prompt,
      pictogram: {
        legend: `📚 ＝ ${q1Scale} ${locale === 'el' ? 'βιβλία' : 'books'}`,
        items: [
          { label: t.q1Label, icon: '📚', symbols: q1Symbols, value: '?' }
        ]
      },
      correct: String(q1Total),
      explain: t.q1Explain(q1Symbols, q1Scale, q1Total)
    },
    {
      id: 'q2',
      type: 'mcq',
      title: t.q2Title,
      prompt: t.q2Prompt,
      options: q2Options,
      correct: t.q2Correct,
      explain: t.q2Explain
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'number',
      title: t.q3Title,
      prompt: t.q3Prompt(q3TotalItems, q3Scale),
      correct: String(q3ReqSyms),
      explain: t.q3Explain(q3TotalItems, q3Scale, q3ReqSyms)
    },
    {
      id: 'q4',
      type: 'mcq',
      title: t.q4Title,
      prompt: t.q4Prompt,
      options: q4Options,
      correct: t.q4Correct,
      explain: t.q4Explain
    },
    {
      id: 'q5',
      type: 'input',
      inputType: 'number',
      title: t.q5Title,
      prompt: t.q5Prompt,
      barChart: {
        maxVal: 45,
        yStep: 15,
        data: [
          { label: t.q5LabelA, value: q5ValHigh, color: '#3b82f6' },
          { label: t.q5LabelB, value: q5ValLow, color: '#f43f5e' }
        ]
      },
      correct: String(q5Diff),
      explain: t.q5Explain(q5ValHigh, q5ValLow, q5Diff)
    },
    {
      id: 'q6',
      type: 'mcq',
      title: t.q6Title,
      prompt: t.q6Prompt,
      options: q6Options,
      correct: t.q6Correct,
      explain: t.q6Explain
    },
    {
      id: 'q7',
      type: 'input',
      inputType: 'number',
      title: `${t.problemBadge}: ${q7Data.title}`,
      prompt: q7Data.prompt,
      barChart: q7Data.barChart,
      pictogram: q7Data.pictogram,
      correct: q7Data.correctVal,
      tableData: q7Data.tableData,
      explain: q7Data.explain
    },
    {
      id: 'q8',
      type: 'mcq',
      title: `${t.problemBadge}: ${q8Data.title}`,
      prompt: q8Data.promptMcq,
      barChart: q8Data.barChart,
      pictogram: q8Data.pictogram,
      options: q8Options,
      correct: q8Data.correctText,
      tableData: q8Data.tableData,
      explain: q8Data.explain
    },
    {
      id: 'q9',
      type: 'input',
      inputType: 'decimal',
      title: `${t.hardProblemBadge}: ${q9Data.title}`,
      prompt: q9Data.prompt,
      barChart: q9Data.barChart,
      pictogram: q9Data.pictogram,
      correct: q9Data.correctVal,
      tableData: q9Data.tableData,
      explain: q9Data.explain
    },
    {
      id: 'q10',
      type: 'mcq',
      title: `${t.hardProblemBadge}: ${q10Data.title}`,
      prompt: q10Data.promptMcq,
      barChart: q10Data.barChart,
      pictogram: q10Data.pictogram,
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

export default function ApeikonisiDataExercisesPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale] || TRANSLATIONS.el;

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewSet = useCallback(() => {
    const qList = generateQuestions(locale);
    setQuestions(qList);
    const initialAnswers = {};
    qList.forEach((q) => {
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
      const q = questions.find((item) => item.id === id);
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
      setAnswers((prev) => ({ ...prev, [id]: sanitized }));
    } else {
      setAnswers((prev) => ({ ...prev, [id]: rawValue }));
    }
  };

  const isQuestionCorrect = (q) => {
    const userVal = answers[q.id];
    if (q.type === 'input') {
      if (typeof userVal !== 'string') return false;
      const cleanUser = userVal.replace(/\./g, ',').replace(/\s+/g, '').replace(/[%€]/g, '').trim().toLowerCase();
      const cleanTarget = String(q.correct).replace(/\./g, ',').replace(/\s+/g, '').replace(/[%€]/g, '').trim().toLowerCase();

      if (cleanUser === cleanTarget) return true;

      const numUser = parseFloat(cleanUser.replace(',', '.'));
      const numTarget = parseFloat(cleanTarget.replace(',', '.'));
      return !isNaN(numUser) && !isNaN(numTarget) && Math.abs(numUser - numTarget) < 0.05;
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
    questions.forEach((q) => {
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

  const answeredCount = Object.values(answers).filter(
    (val) => val !== undefined && val !== null && String(val).trim() !== ''
  ).length;

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDesc}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/55-apeikonisi-data"
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
                <span>{t.badgeChapter}</span>
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
              <span>{toCleanUppercase(t.newQuestionsBtn)}</span>
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
                        {toCleanUppercase(`${t.exercisePrefix} ${qNum}: ${q.title}`)}
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

                    {/* ΟΠΤΙΚΑ ΣΧΗΜΑΤΑ ΔΕΔΟΜΕΝΩΝ */}
                    {q.barChart && (
                      <MiniBarChart
                        caption={t.barChartCaption}
                        data={q.barChart.data}
                        maxVal={q.barChart.maxVal}
                        yStep={q.barChart.yStep}
                      />
                    )}

                    {q.pictogram && (
                      <MiniPictogram
                        caption={t.pictoChartCaption}
                        legendPrefix={t.legendPrefix}
                        legend={q.pictogram.legend}
                        items={q.pictogram.items}
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
                              className={`p-3 rounded-2xl text-xs sm:text-sm font-mono font-bold border text-center transition touch-manipulation active:scale-95 break-words [overflow-wrap:anywhere] whitespace-normal leading-snug flex items-center justify-center min-h-[48px] ${
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
                          placeholder={q.inputType === 'decimal' ? t.inputPlaceholderDecimal : t.inputPlaceholder}
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
                                <th className="p-1.5">{toCleanUppercase(t.tableHeaderValue)}</th>
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
                          {isQuestionCorrect(q) ? t.feedbackSuccess : t.feedbackExplain}
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
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          
          {/* SCORE & PERCENTAGE */}
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-sm sm:text-base md:text-lg flex items-center gap-2 shadow-sm">
              <span>🏆</span>
              <span>{submitted ? toCleanUppercase(t.scoreLabel) : toCleanUppercase(t.answeredLabel)}:</span>
              <span className="font-mono text-lg sm:text-xl md:text-2xl">
                {submitted ? `${score} / 10` : `${answeredCount} / 10`}
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
                <span>{toCleanUppercase(t.newQuestionsBtn)}</span>
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden sm:block">
                {t.bottomTip}
              </p>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}