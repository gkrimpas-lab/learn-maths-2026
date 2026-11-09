// pages/st-dimotikou/50-pososta-ask.js
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// ---------------------------------------------------------
// ΒΟΗΘΗΤΙΚΑ COMPONENTS & ΣΥΝΑΡΤΗΣΕΙΣ
// ---------------------------------------------------------

// Εμφάνιση κλάσματος σε κανονική κατακόρυφη μορφή (πλήρως responsive χωρίς horizontal scroll)
function Fraction({ num, den, className = '' }) {
  return (
    <span
      className={`inline-flex flex-col text-center align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full ${className}`}
    >
      <span className="border-b border-current px-0.5 sm:px-1 pb-0.5 break-all">
        {num}
      </span>
      <span className="pt-0.5 px-0.5 sm:px-1 break-all">
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

// Μορφοποίηση αριθμού ανά locale (el-GR / en-US)
function formatNum(val, locale = 'el', decimals = 2) {
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

// Εγγύηση 4 μοναδικών επιλογών για ερωτήσεις MCQ
function makeUniqueOptions(correct, wrongCandidates) {
  const unique = new Set([correct]);
  for (const opt of wrongCandidates) {
    if (opt !== undefined && opt !== null && String(opt).trim() !== '') {
      unique.add(String(opt));
    }
    if (unique.size === 4) break;
  }
  return shuffle(Array.from(unique));
}

// ---------------------------------------------------------
// ΣΥΓΚΕΝΤΡΩΤΙΚΟ ΛΕΞΙΚΟ METΑΦΡΑΣΕΩΝ (i18n)
// ---------------------------------------------------------

const TRANSLATIONS = {
  el: {
    metaTitle: "Ασκήσεις: Ποσοστά (Έννοια & Μετατροπές) - ΣΤ' Δημοτικού | LearnMaths.gr",
    metaDesc: "Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στα ποσοστά στα εκατό (%) και στα χίλια (‰) για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryBtn: "Θεωρία",
    badgeChapter: "ΚΕΦΑΛΑΙΟ 50 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    heroTitle: "Διαδραστικές Ασκήσεις: Ποσοστά στα Εκατό (%) & στα Χίλια (‰)",
    heroDesc: "Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στη μετατροπή κλασμάτων και δεκαδικών σε ποσοστά, στα ποσοστά επί του συνόλου και σε πρακτικά προβλήματα!",
    newQuestionsBtn: "Νέες Ασκήσεις",
    exercisePrefix: "Άσκηση",
    inputPlaceholder: "Απάντηση...",
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

    // Concept questions
    q1Title: "Μετατροπή Κλάσματος σε Ποσοστό",
    q1Prompt: (num, den) => (
      <span className="inline-flex items-center flex-wrap gap-1">
        Σε ποιο ποσοστό στα εκατό (%) αντιστοιχεί το κλάσμα <Fraction num={num} den={den} />; (γράψε μόνο τον αριθμό)
      </span>
    ),
    q1Explain: (num, den, pct) => (
      <span className="inline-flex items-center flex-wrap gap-1">
        <Fraction num={num} den={den} /> · 100 ＝ ({num} · 100) : {den} ＝ {pct} %.
      </span>
    ),

    q2Title: "Ορισμός Ποσοστού",
    q2Prompt: "Τι ονομάζουμε ποσοστό στα εκατό (%) στα Μαθηματικά;",
    q2Correct: "Ένας λόγος ή ένα κλάσμα με σταθερό παρονομαστή το 100",
    q2Distractors: [
      "Το γινόμενο δύο τυχαίων ακεραίων αριθμών",
      "Ένα κλάσμα που έχει πάντοτε αριθμητή το 100",
      "Η διαφορά ανάμεσα σε δύο δεκαδικούς",
      "Ένα πηλίκο με διαιρετέο πάντα το 1.000"
    ],
    q2Explain: "Ποσοστό στα εκατό (%) είναι ο λόγος ή το κλάσμα που συγκρίνει ένα μέγεθος με βάση το 100 (παρονομαστής 100).",

    q3Title: "Από Δεκαδικό σε Ποσοστό",
    q3Prompt: (decStr) => `Ποιο ποσοστό στα εκατό (%) αντιπροσωπεύει ο δεκαδικός αριθμός ${decStr}; (γράψε μόνο τον αριθμό)`,
    q3Explain: (decStr, pct) => `${decStr} · 100 ＝ ${pct} %.`,

    q4Title: "Σχέση στα Εκατό και στα Χίλια",
    q4Prompt: "Ποια είναι η σχέση ανάμεσα στο ποσοστό στα εκατό (%) και στο ποσοστό στα χίλια (‰);",
    q4Correct: "1 % ＝ 10 ‰ (το ποσοστό στα εκατό ισούται με 10 στα χίλια)",
    q4Distractors: [
      "1 % ＝ 100 ‰",
      "10 % ＝ 1 ‰",
      "Δεν έχουν καμία μαθηματική σχέση μεταξύ τους",
      "1 % ＝ 1.000 ‰"
    ],
    q4Explain: () => (
      <span className="inline-flex items-center flex-wrap gap-1">
        <Fraction num="1" den="100" /> ＝ <Fraction num="10" den="1.000" />, επομένως 1 % ＝ 10 ‰.
      </span>
    ),

    q5Title: "Υπολογισμός Ποσοστού επί του Συνόλου",
    q5Prompt: (part) => `Σε μια ομάδα 50 ατόμων, τα ${part} άτομα ασχολούνται με το τρέξιμο. Τι ποσοστό (%) της ομάδας ασχολείται με το τρέξιμο; (γράψε μόνο τον αριθμό)`,
    q5Explain: (part, pct) => (
      <span className="inline-flex items-center flex-wrap gap-1">
        <Fraction num={part} den="50" /> · 100 ＝ ({part} · 100) : 50 ＝ {pct} %.
      </span>
    ),

    q6Title: "Ανάγωγο Κλάσμα του 50%",
    q6Prompt: "Ποιο ανάγωγο κλάσμα αντιστοιχεί ακριβώς στο ποσοστό 50 %;",
    q6Explain: () => (
      <span className="inline-flex items-center flex-wrap gap-1">
        50 % ＝ <Fraction num="50" den="100" /> ＝ <Fraction num="1" den="2" /> (το μισό του όλου).
      </span>
    ),

    problemBadge: "Πρόβλημα",
    hardProblemBadge: "Σύνθετο Πρόβλημα"
  },
  en: {
    metaTitle: "Exercises: Percentages (Concept & Conversions) - Grade 6 | LearnMaths.gr",
    metaDesc: "Interactive practice exercises with 10 questions and auto-grading on percentages per hundred (%) and per thousand (‰) for Grade 6.",
    backText: "Grade 6",
    theoryBtn: "Theory",
    badgeChapter: "CHAPTER 50 • GRADE 6 • PRACTICE",
    heroTitle: "Interactive Exercises: Percentages per Hundred (%) & per Thousand (‰)",
    heroDesc: "Solve the 10 dynamic questions to master converting fractions and decimals into percentages, proportions of a total, and word problems!",
    newQuestionsBtn: "New Questions",
    exercisePrefix: "Exercise",
    inputPlaceholder: "Answer...",
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

    // Concept questions
    q1Title: "Converting Fraction to Percentage",
    q1Prompt: (num, den) => (
      <span className="inline-flex items-center flex-wrap gap-1">
        What percentage (%) does the fraction <Fraction num={num} den={den} /> represent? (write only the number)
      </span>
    ),
    q1Explain: (num, den, pct) => (
      <span className="inline-flex items-center flex-wrap gap-1">
        <Fraction num={num} den={den} /> · 100 ＝ ({num} · 100) : {den} ＝ {pct} %.
      </span>
    ),

    q2Title: "Definition of Percentage",
    q2Prompt: "What is called a percentage per hundred (%) in Mathematics?",
    q2Correct: "A ratio or fraction with a constant denominator of 100",
    q2Distractors: [
      "The product of two random whole numbers",
      "A fraction whose numerator is always 100",
      "The difference between two decimals",
      "A quotient with a dividend always equal to 1,000"
    ],
    q2Explain: "A percentage per hundred (%) is a ratio or fraction that compares a quantity to a base of 100 (denominator 100).",

    q3Title: "From Decimal to Percentage",
    q3Prompt: (decStr) => `What percentage (%) is represented by the decimal number ${decStr}? (write only the number)`,
    q3Explain: (decStr, pct) => `${decStr} · 100 ＝ ${pct} %.`,

    q4Title: "Relation Between Per Hundred and Per Thousand",
    q4Prompt: "What is the relation between a percentage per hundred (%) and per thousand (‰)?",
    q4Correct: "1 % ＝ 10 ‰ (one percent equals 10 per thousand)",
    q4Distractors: [
      "1 % ＝ 100 ‰",
      "10 % ＝ 1 ‰",
      "They have no mathematical relation to each other",
      "1 % ＝ 1,000 ‰"
    ],
    q4Explain: () => (
      <span className="inline-flex items-center flex-wrap gap-1">
        <Fraction num="1" den="100" /> ＝ <Fraction num="10" den="1,000" />, therefore 1 % ＝ 10 ‰.
      </span>
    ),

    q5Title: "Calculating Percentage of a Total",
    q5Prompt: (part) => `In a group of 50 people, ${part} people practice running. What percentage (%) of the group practices running? (write only the number)`,
    q5Explain: (part, pct) => (
      <span className="inline-flex items-center flex-wrap gap-1">
        <Fraction num={part} den="50" /> · 100 ＝ ({part} · 100) : 50 ＝ {pct} %.
      </span>
    ),

    q6Title: "Irreducible Fraction for 50%",
    q6Prompt: "Which irreducible fraction corresponds exactly to 50 %?",
    q6Explain: () => (
      <span className="inline-flex items-center flex-wrap gap-1">
        50 % ＝ <Fraction num="50" den="100" /> ＝ <Fraction num="1" den="2" /> (one half of the whole).
      </span>
    ),

    problemBadge: "Problem",
    hardProblemBadge: "Multi-Step Problem"
  }
};

// ---------------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (Q7, Q8, Q9, Q10) - "NO-GIVEAWAY"
// ---------------------------------------------------------

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'pct_std_1',
    generate: (locale) => {
      const isEl = locale === 'el';
      const totalStudents = pickRandom([20, 25, 50]);
      const boys = pickRandom([8, 10, 12, 14]);
      const pct = (boys / totalStudents) * 100;
      const formattedPct = formatNum(pct, locale, 0);
      return {
        title: isEl ? 'Ποσοστό Μαθητών στην Τάξη' : 'Percentage of Students in Class',
        prompt: isEl
          ? `Σε μια τάξη ${totalStudents} μαθητών, τα ${boys} είναι αγόρια. Τι ποσοστό (%) των μαθητών της τάξης είναι αγόρια; (γράψε μόνο τον αριθμό)`
          : `In a class of ${totalStudents} students, ${boys} are boys. What percentage (%) of the students are boys? (write only the number)`,
        promptMcq: isEl
          ? `Σε μια τάξη ${totalStudents} μαθητών, τα ${boys} είναι αγόρια. Τι ποσοστό (%) των μαθητών της τάξης είναι αγόρια;`
          : `In a class of ${totalStudents} students, ${boys} are boys. What percentage (%) of the students are boys?`,
        correctVal: String(pct),
        correctText: `${formattedPct} %`,
        tableData: [
          { item: isEl ? 'Πλήθος αγοριών' : 'Number of boys', formula: `${boys}`, val: `${boys}` },
          { item: isEl ? 'Σύνολο μαθητών' : 'Total students', formula: `${totalStudents}`, val: `${totalStudents}` },
          {
            item: isEl ? 'Υπολογισμός ποσοστού' : 'Percentage calculation',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                <Fraction num={boys} den={totalStudents} /> · 100
              </span>
            ),
            val: `${formattedPct} %`
          }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            {isEl ? (
              <>
                Για να βρούμε το ποσοστό στα εκατό, διαιρούμε το μέρος με το όλο και πολλαπλασιάζουμε με το 100: <Fraction num={boys} den={totalStudents} /> · 100 ＝ ({boys} · 100) : ${totalStudents} ＝ {formattedPct} %.
              </>
            ) : (
              <>
                To find the percentage, divide the part by the total and multiply by 100: <Fraction num={boys} den={totalStudents} /> · 100 ＝ ({boys} · 100) : ${totalStudents} ＝ {formattedPct} %.
              </>
            )}
          </span>
        ),
        distractors: [
          `${formatNum(pct + 10, locale, 0)} %`,
          `${formatNum(Math.max(5, pct - 10), locale, 0)} %`,
          `${formatNum(pct + 15, locale, 0)} %`,
          `${formatNum(pct + 5, locale, 0)} %`
        ]
      };
    }
  },
  {
    id: 'pct_std_2',
    generate: (locale) => {
      const isEl = locale === 'el';
      const totalCapacity = 200;
      const filled = 150;
      const pct = (filled / totalCapacity) * 100;
      const formattedPct = formatNum(pct, locale, 0);
      return {
        title: isEl ? 'Πληρότητα Δεξαμενής Νερού' : 'Water Tank Capacity',
        prompt: isEl
          ? `Μια δεξαμενή χωρητικότητας ${totalCapacity} l περιέχει ${filled} l νερό. Ποιο είναι το ποσοστό (%) πληρότητας της δεξαμενής; (γράψε μόνο τον αριθμό)`
          : `A tank with capacity of ${totalCapacity} l contains ${filled} l of water. What is the fullness percentage (%) of the tank? (write only the number)`,
        promptMcq: isEl
          ? `Μια δεξαμενή χωρητικότητας ${totalCapacity} l περιέχει ${filled} l νερό. Ποιο είναι το ποσοστό (%) πληρότητας της δεξαμενής;`
          : `A tank with capacity of ${totalCapacity} l contains ${filled} l of water. What is the fullness percentage (%) of the tank?`,
        correctVal: String(pct),
        correctText: `${formattedPct} %`,
        tableData: [
          { item: isEl ? 'Ποσότητα νερού' : 'Water volume', formula: `${filled} l`, val: `${filled} l` },
          { item: isEl ? 'Συνολική χωρητικότητα' : 'Total capacity', formula: `${totalCapacity} l`, val: `${totalCapacity} l` },
          {
            item: isEl ? 'Ποσοστό πληρότητας' : 'Fullness percentage',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                <Fraction num={filled} den={totalCapacity} /> · 100
              </span>
            ),
            val: `${formattedPct} %`
          }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            <Fraction num={filled} den={totalCapacity} /> · 100 ＝ {formatNum(filled / totalCapacity, locale, 2)} · 100 ＝ {formattedPct} %.
          </span>
        ),
        distractors: [
          `${formatNum(pct - 15, locale, 0)} %`,
          `${formatNum(pct + 10, locale, 0)} %`,
          `${formatNum(pct - 25, locale, 0)} %`,
          `${formatNum(pct + 5, locale, 0)} %`
        ]
      };
    }
  },
  {
    id: 'pct_std_3',
    generate: (locale) => {
      const isEl = locale === 'el';
      const totalPages = 200;
      const read = 80;
      const pct = (read / totalPages) * 100;
      const formattedPct = formatNum(pct, locale, 0);
      return {
        title: isEl ? 'Ανάγνωση Σελίδων Βιβλίου' : 'Book Pages Read',
        prompt: isEl
          ? `Ένας μαθητής διάβασε ${read} από τις ${totalPages} σελίδες ενός βιβλίου. Τι ποσοστό (%) του βιβλίου διάβασε; (γράψε μόνο τον αριθμό)`
          : `A student read ${read} out of ${totalPages} pages of a book. What percentage (%) of the book was read? (write only the number)`,
        promptMcq: isEl
          ? `Ένας μαθητής διάβασε ${read} από τις ${totalPages} σελίδες ενός βιβλίου. Τι ποσοστό (%) του βιβλίου διάβασε;`
          : `A student read ${read} out of ${totalPages} pages of a book. What percentage (%) of the book was read?`,
        correctVal: String(pct),
        correctText: `${formattedPct} %`,
        tableData: [
          { item: isEl ? 'Σελίδες που διαβάστηκαν' : 'Pages read', formula: `${read}`, val: `${read}` },
          { item: isEl ? 'Σύνολο σελίδων' : 'Total pages', formula: `${totalPages}`, val: `${totalPages}` },
          {
            item: isEl ? 'Ποσοστό ανάγνωσης' : 'Reading percentage',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                <Fraction num={read} den={totalPages} /> · 100
              </span>
            ),
            val: `${formattedPct} %`
          }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            {isEl ? (
              <>
                Διαιρούμε τις σελίδες που διαβάστηκαν με το σύνολο και πολλαπλασιάζουμε με το 100: <Fraction num={read} den={totalPages} /> · 100 ＝ {formattedPct} %.
              </>
            ) : (
              <>
                Divide the pages read by the total and multiply by 100: <Fraction num={read} den={totalPages} /> · 100 ＝ {formattedPct} %.
              </>
            )}
          </span>
        ),
        distractors: [
          `${formatNum(pct + 10, locale, 0)} %`,
          `${formatNum(pct - 10, locale, 0)} %`,
          `${formatNum(pct + 20, locale, 0)} %`,
          `${formatNum(pct + 5, locale, 0)} %`
        ]
      };
    }
  },
  {
    id: 'pct_std_4',
    generate: (locale) => {
      const isEl = locale === 'el';
      const attempts = 30;
      const scored = 18;
      const pct = (scored / attempts) * 100;
      const formattedPct = formatNum(pct, locale, 0);
      return {
        title: isEl ? 'Ευστοχία σε Αγώνα Μπάσκετ' : 'Basketball Shooting Accuracy',
        prompt: isEl
          ? `Σε έναν αγώνα μπάσκετ μια ομάδα ευστόχησε σε ${scored} από τα ${attempts} σουτ. Ποιο ήταν το ποσοστό ευστοχίας (%); (γράψε μόνο τον αριθμό)`
          : `In a basketball game a team made ${scored} out of ${attempts} shots. What was their shooting percentage (%); (write only the number)`,
        promptMcq: isEl
          ? `Σε έναν αγώνα μπάσκετ μια ομάδα ευστόχησε σε ${scored} από τα ${attempts} σουτ. Ποιο ήταν το ποσοστό ευστοχίας (%);`
          : `In a basketball game a team made ${scored} out of ${attempts} shots. What was their shooting percentage (%);`,
        correctVal: String(pct),
        correctText: `${formattedPct} %`,
        tableData: [
          { item: isEl ? 'Επιτυχημένα σουτ' : 'Successful shots', formula: `${scored}`, val: `${scored}` },
          { item: isEl ? 'Συνολικές προσπάθειες' : 'Total attempts', formula: `${attempts}`, val: `${attempts}` },
          {
            item: isEl ? 'Ποσοστό ευστοχίας' : 'Shooting percentage',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                <Fraction num={scored} den={attempts} /> · 100
              </span>
            ),
            val: `${formattedPct} %`
          }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            <Fraction num={scored} den={attempts} /> · 100 ＝ {formatNum(scored / attempts, locale, 2)} · 100 ＝ {formattedPct} %.
          </span>
        ),
        distractors: [
          `${formatNum(pct + 10, locale, 0)} %`,
          `${formatNum(pct - 10, locale, 0)} %`,
          `${formatNum(pct + 15, locale, 0)} %`,
          `${formatNum(pct + 5, locale, 0)} %`
        ]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'pct_hard_1',
    generate: (locale) => {
      const isEl = locale === 'el';
      const totalStudents = 250;
      const boysPct = 40;
      const girlsPct = 100 - boysPct;
      const girls = (totalStudents * girlsPct) / 100;
      const girlsUnit = isEl ? 'κορίτσια' : 'girls';
      const formattedGirls = formatNum(girls, locale, 0);
      return {
        title: isEl ? 'Κατανομή Μαθητών Σχολείου' : 'School Student Distribution',
        prompt: isEl
          ? `Σε ένα σχολείο ${totalStudents} μαθητών, το ${boysPct} % είναι αγόρια. Πόσα είναι τα κορίτσια στο σχολείο; (γράψε μόνο τον αριθμό)`
          : `In a school of ${totalStudents} students, ${boysPct} % are boys. How many girls are in the school? (write only the number)`,
        promptMcq: isEl
          ? `Σε ένα σχολείο ${totalStudents} μαθητών, το ${boysPct} % είναι αγόρια. Πόσα είναι τα κορίτσια στο σχολείο;`
          : `In a school of ${totalStudents} students, ${boysPct} % are boys. How many girls are in the school?`,
        correctVal: String(girls),
        correctText: `${formattedGirls} ${girlsUnit}`,
        tableData: [
          { item: isEl ? 'Ποσοστό κοριτσιών' : 'Percentage of girls', formula: `100 % － ${boysPct} %`, val: `${girlsPct} %` },
          {
            item: isEl ? 'Πλήθος κοριτσιών' : 'Number of girls',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                <Fraction num={`${totalStudents} · ${girlsPct}`} den="100" />
              </span>
            ),
            val: `${formattedGirls}`
          }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            {isEl ? (
              <>
                Ποσοστό κοριτσιών: 100 % － ${boysPct} % ＝ ${girlsPct} %. Πλήθος κοριτσιών: <Fraction num={`${totalStudents} · ${girlsPct}`} den="100" /> ＝ {formattedGirls}.
              </>
            ) : (
              <>
                Percentage of girls: 100 % － ${boysPct} % ＝ ${girlsPct} %. Number of girls: <Fraction num={`${totalStudents} · ${girlsPct}`} den="100" /> ＝ {formattedGirls}.
              </>
            )}
          </span>
        ),
        distractors: [
          `${formatNum(girls - 25, locale, 0)} ${girlsUnit}`,
          `${formatNum(girls + 25, locale, 0)} ${girlsUnit}`,
          `${formatNum(totalStudents - girls - 20, locale, 0)} ${girlsUnit}`,
          `${formatNum(girls + 10, locale, 0)} ${girlsUnit}`
        ]
      };
    }
  },
  {
    id: 'pct_hard_2',
    generate: (locale) => {
      const isEl = locale === 'el';
      const totalAlloy = 500;
      const copper = 120;
      const tin = 180;
      const zinc = totalAlloy - (copper + tin);
      const zincPct = (zinc / totalAlloy) * 100;
      const formattedZincPct = formatNum(zincPct, locale, 0);
      return {
        title: isEl ? 'Ποσοστό Περιεκτικότητας σε Κράμα' : 'Alloy Composition Percentage',
        prompt: isEl
          ? `Ένα κράμα βάρους ${totalAlloy} g περιέχει ${copper} g χαλκό, ${tin} g κασσίτερο και το υπόλοιπο είναι ψευδάργυρος. Ποιο είναι το ποσοστό (%) του ψευδαργύρου στο κράμα; (γράψε μόνο τον αριθμό)`
          : `An alloy weighing ${totalAlloy} g contains ${copper} g copper, ${tin} g tin, and the remainder is zinc. What is the percentage (%) of zinc in the alloy? (write only the number)`,
        promptMcq: isEl
          ? `Ένα κράμα βάρους ${totalAlloy} g περιέχει ${copper} g χαλκό, ${tin} g κασσίτερο και το υπόλοιπο είναι ψευδάργυρος. Ποιο είναι το ποσοστό (%) του ψευδαργύρου στο κράμα;`
          : `An alloy weighing ${totalAlloy} g contains ${copper} g copper, ${tin} g tin, and the remainder is zinc. What is the percentage (%) of zinc in the alloy?`,
        correctVal: String(zincPct),
        correctText: `${formattedZincPct} %`,
        tableData: [
          { item: isEl ? 'Μάζα ψευδαργύρου' : 'Zinc mass', formula: `${totalAlloy} － (${copper} ＋ ${tin})`, val: `${zinc} g` },
          {
            item: isEl ? 'Ποσοστό ψευδαργύρου' : 'Zinc percentage',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                <Fraction num={zinc} den={totalAlloy} /> · 100
              </span>
            ),
            val: `${formattedZincPct} %`
          }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            {isEl ? (
              <>
                Μάζα ψευδαργύρου: ${totalAlloy} － (${copper} ＋ ${tin}) ＝ ${zinc} g. Ποσοστό: <Fraction num={zinc} den={totalAlloy} /> · 100 ＝ {formattedZincPct} %.
              </>
            ) : (
              <>
                Zinc mass: ${totalAlloy} － (${copper} ＋ ${tin}) ＝ ${zinc} g. Percentage: <Fraction num={zinc} den={totalAlloy} /> · 100 ＝ {formattedZincPct} %.
              </>
            )}
          </span>
        ),
        distractors: [
          `${formatNum(zincPct + 10, locale, 0)} %`,
          `${formatNum(zincPct - 10, locale, 0)} %`,
          `${formatNum(zincPct + 15, locale, 0)} %`,
          `${formatNum(zincPct + 5, locale, 0)} %`
        ]
      };
    }
  },
  {
    id: 'pct_hard_3',
    generate: (locale) => {
      const isEl = locale === 'el';
      const totalBoxes = 800;
      const applesPct = 25;
      const orangesPct = 35;
      const pearsPct = 100 - (applesPct + orangesPct);
      const pearsBoxes = (totalBoxes * pearsPct) / 100;
      const boxUnit = isEl ? 'κιβώτια' : 'boxes';
      const formattedPearsBoxes = formatNum(pearsBoxes, locale, 0);
      return {
        title: isEl ? 'Κιβώτια με Φρούτα στην Αποθήκη' : 'Fruit Boxes in Warehouse',
        prompt: isEl
          ? `Σε μια αποθήκη υπάρχουν ${totalBoxes} κιβώτια. Το ${applesPct} % περιέχει μήλα, το ${orangesPct} % πορτοκάλια και τα υπόλοιπα αχλάδια. Πόσα είναι τα κιβώτια με αχλάδια; (γράψε μόνο τον αριθμό)`
          : `In a warehouse there are ${totalBoxes} boxes. ${applesPct} % contain apples, ${orangesPct} % oranges, and the remainder pears. How many boxes contain pears? (write only the number)`,
        promptMcq: isEl
          ? `Σε μια αποθήκη υπάρχουν ${totalBoxes} κιβώτια. Το ${applesPct} % περιέχει μήλα, το ${orangesPct} % πορτοκάλια και τα υπόλοιπα αχλάδια. Πόσα είναι τα κιβώτια με αχλάδια;`
          : `In a warehouse there are ${totalBoxes} boxes. ${applesPct} % contain apples, ${orangesPct} % oranges, and the remainder pears. How many boxes contain pears?`,
        correctVal: String(pearsBoxes),
        correctText: `${formattedPearsBoxes} ${boxUnit}`,
        tableData: [
          { item: isEl ? 'Ποσοστό αχλαδιών' : 'Pear percentage', formula: `100 % － (${applesPct} % ＋ ${orangesPct} %)`, val: `${pearsPct} %` },
          {
            item: isEl ? 'Κιβώτια αχλαδιών' : 'Pear boxes',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                <Fraction num={`${totalBoxes} · ${pearsPct}`} den="100" />
              </span>
            ),
            val: `${formattedPearsBoxes}`
          }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            {isEl ? (
              <>
                Ποσοστό αχλαδιών: 100 % － (${applesPct} % ＋ ${orangesPct} %) ＝ ${pearsPct} %. Κιβώτια: <Fraction num={`${totalBoxes} · ${pearsPct}`} den="100" /> ＝ {formattedPearsBoxes}.
              </>
            ) : (
              <>
                Pear percentage: 100 % － (${applesPct} % ＋ ${orangesPct} %) ＝ ${pearsPct} %. Boxes: <Fraction num={`${totalBoxes} · ${pearsPct}`} den="100" /> ＝ {formattedPearsBoxes}.
              </>
            )}
          </span>
        ),
        distractors: [
          `${formatNum(pearsBoxes + 40, locale, 0)} ${boxUnit}`,
          `${formatNum(pearsBoxes - 40, locale, 0)} ${boxUnit}`,
          `${formatNum(pearsBoxes + 80, locale, 0)} ${boxUnit}`,
          `${formatNum(pearsBoxes + 20, locale, 0)} ${boxUnit}`
        ]
      };
    }
  },
  {
    id: 'pct_hard_4',
    generate: (locale) => {
      const isEl = locale === 'el';
      const totalQuestions = 50;
      const successPct = 90;
      const correctQuestions = (totalQuestions * successPct) / 100;
      const qUnit = isEl ? 'ερωτήσεις' : 'questions';
      const formattedCorrectQuestions = formatNum(correctQuestions, locale, 0);
      return {
        title: isEl ? 'Ερωτήσεις Διαγωνίσματος με Ποσοστό Επιτυχίας' : 'Exam Questions with Success Rate',
        prompt: isEl
          ? `Σε ένα διαγώνισμα ${totalQuestions} ερωτήσεων, ένας μαθητής είχε ${successPct} % επιτυχία. Πόσες ερωτήσεις απάντησε σωστά; (γράψε μόνο τον αριθμό)`
          : `In a test of ${totalQuestions} questions, a student had a ${successPct} % success rate. How many questions were answered correctly? (write only the number)`,
        promptMcq: isEl
          ? `Σε ένα διαγώνισμα ${totalQuestions} ερωτήσεων, ένας μαθητής είχε ${successPct} % επιτυχία. Πόσες ερωτήσεις απάντησε σωστά;`
          : `In a test of ${totalQuestions} questions, a student had a ${successPct} % success rate. How many questions were answered correctly?`,
        correctVal: String(correctQuestions),
        correctText: `${formattedCorrectQuestions} ${qUnit}`,
        tableData: [
          { item: isEl ? 'Σύνολο ερωτήσεων' : 'Total questions', formula: `${totalQuestions}`, val: `${totalQuestions}` },
          { item: isEl ? 'Ποσοστό επιτυχίας' : 'Success rate', formula: `${successPct} %`, val: `${successPct} %` },
          {
            item: isEl ? 'Σωστές ερωτήσεις' : 'Correct questions',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                <Fraction num={`${totalQuestions} · ${successPct}`} den="100" />
              </span>
            ),
            val: `${formattedCorrectQuestions}`
          }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            <Fraction num={`${totalQuestions} · ${successPct}`} den="100" /> ＝ {formattedCorrectQuestions} {qUnit}.
          </span>
        ),
        distractors: [
          `${formatNum(correctQuestions - 5, locale, 0)} ${qUnit}`,
          `${formatNum(correctQuestions + 3, locale, 0)} ${qUnit}`,
          `${formatNum(correctQuestions - 10, locale, 0)} ${qUnit}`,
          `${formatNum(correctQuestions + 2, locale, 0)} ${qUnit}`
        ]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions(locale = 'el') {
  const t = TRANSLATIONS[locale] || TRANSLATIONS.el;

  // Q1: Input - Μετατροπή κλάσματος σε ποσοστό
  const q1Preset = pickRandom([
    { num: 1, den: 4, pct: 25 },
    { num: 3, den: 4, pct: 75 },
    { num: 2, den: 5, pct: 40 },
    { num: 7, den: 10, pct: 70 }
  ]);

  // Q2: MCQ - Ορισμός ποσοστού (4 μοναδικές επιλογές)
  const q2Options = makeUniqueOptions(t.q2Correct, t.q2Distractors).map((v) => ({
    val: v,
    render: <span>{v}</span>
  }));

  // Q3: Input - Μετατροπή δεκαδικού σε ποσοστό
  const q3Dec = pickRandom([0.35, 0.45, 0.6, 0.08, 0.72]);
  const q3Pct = Number((q3Dec * 100).toFixed(0));
  const q3DecFormatted = formatNum(q3Dec, locale, 2);

  // Q4: MCQ - Σχέση στα εκατό και στα χίλια (4 μοναδικές επιλογές)
  const q4Options = makeUniqueOptions(t.q4Correct, t.q4Distractors).map((v) => ({
    val: v,
    render: <span>{v}</span>
  }));

  // Q5: Input - Υπολογισμός ποσοστού επί του συνόλου
  const q5Part = pickRandom([15, 20, 25, 30]);
  const q5Pct = (q5Part / 50) * 100;

  // Q6: MCQ - Ανάγωγο κλάσμα του 50% (4 μοναδικές επιλογές με κατακόρυφα κλάσματα)
  const q6RawCandidates = [
    { id: '1/2', num: 1, den: 2, correct: true },
    { id: '1/4', num: 1, den: 4, correct: false },
    { id: '1/5', num: 1, den: 5, correct: false },
    { id: '3/4', num: 3, den: 4, correct: false }
  ];
  const q6Options = shuffle(q6RawCandidates).map((item) => ({
    val: item.id,
    render: <Fraction num={item.num} den={item.den} />
  }));

  // Q7: Standard Problem (Input)
  const spIndex1 = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q7Data = STANDARD_PROBLEMS_POOL[spIndex1].generate(locale);

  // Q8: Standard Problem (MCQ - 4 μοναδικές επιλογές)
  let spIndex2 = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  while (spIndex2 === spIndex1) spIndex2 = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q8Data = STANDARD_PROBLEMS_POOL[spIndex2].generate(locale);
  const q8Options = makeUniqueOptions(q8Data.correctText, q8Data.distractors).map((v) => ({
    val: v,
    render: <span>{v}</span>
  }));

  // Q9: Hard Problem (Input)
  const hpIndex1 = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q9Data = HARD_PROBLEMS_POOL[hpIndex1].generate(locale);

  // Q10: Hard Problem (MCQ - 4 μοναδικές επιλογές)
  let hpIndex2 = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  while (hpIndex2 === hpIndex1) hpIndex2 = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q10Data = HARD_PROBLEMS_POOL[hpIndex2].generate(locale);
  const q10Options = makeUniqueOptions(q10Data.correctText, q10Data.distractors).map((v) => ({
    val: v,
    render: <span>{v}</span>
  }));

  return [
    {
      id: 'q1',
      type: 'input',
      inputType: 'number',
      title: t.q1Title,
      prompt: t.q1Prompt(q1Preset.num, q1Preset.den),
      correct: String(q1Preset.pct),
      explain: t.q1Explain(q1Preset.num, q1Preset.den, q1Preset.pct)
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
      prompt: t.q3Prompt(q3DecFormatted),
      correct: String(q3Pct),
      explain: t.q3Explain(q3DecFormatted, q3Pct)
    },
    {
      id: 'q4',
      type: 'mcq',
      title: t.q4Title,
      prompt: t.q4Prompt,
      options: q4Options,
      correct: t.q4Correct,
      explain: t.q4Explain()
    },
    {
      id: 'q5',
      type: 'input',
      inputType: 'number',
      title: t.q5Title,
      prompt: t.q5Prompt(q5Part),
      correct: String(q5Pct),
      explain: t.q5Explain(q5Part, q5Pct)
    },
    {
      id: 'q6',
      type: 'mcq',
      title: t.q6Title,
      prompt: t.q6Prompt,
      options: q6Options,
      correct: '1/2',
      explain: t.q6Explain()
    },
    {
      id: 'q7',
      type: 'input',
      inputType: 'number',
      title: `${t.problemBadge}: ${q7Data.title}`,
      prompt: q7Data.prompt,
      correct: q7Data.correctVal,
      tableData: q7Data.tableData,
      explain: q7Data.explain
    },
    {
      id: 'q8',
      type: 'mcq',
      title: `${t.problemBadge}: ${q8Data.title}`,
      prompt: q8Data.promptMcq,
      options: q8Options,
      correct: q8Data.correctText,
      tableData: q8Data.tableData,
      explain: q8Data.explain
    },
    {
      id: 'q9',
      type: 'input',
      inputType: 'number',
      title: `${t.hardProblemBadge}: ${q9Data.title}`,
      prompt: q9Data.prompt,
      correct: q9Data.correctVal,
      tableData: q9Data.tableData,
      explain: q9Data.explain
    },
    {
      id: 'q10',
      type: 'mcq',
      title: `${t.hardProblemBadge}: ${q10Data.title}`,
      prompt: q10Data.promptMcq,
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

export default function PosostaExercisesPage() {
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
      const cleanUser = userVal.replace(/\./g, ',').replace(/\s+/g, '').replace(/%/g, '').trim().toLowerCase();
      const cleanTarget = String(q.correct).replace(/\./g, ',').replace(/\s+/g, '').replace(/%/g, '').trim().toLowerCase();

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
          href="/st-dimotikou/50-pososta"
          className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border border-blue-200 transition shrink-0 max-w-full"
        >
          <span>📖</span>
          <span className="truncate">{toCleanUppercase(t.theoryBtn)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        
        {/* HERO BANNER */}
        <section className="w-full min-w-0 max-w-full bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10 w-full min-w-0">
            <div className="space-y-2 max-w-3xl min-w-0 w-full">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-sky-200 max-w-full">
                <span className="break-words [overflow-wrap:anywhere]">{t.badgeChapter}</span>
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
              className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-black shadow-md transition transform active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 shrink-0 touch-manipulation max-w-full"
            >
              <span>🔄</span>
              <span className="break-words [overflow-wrap:anywhere]">{toCleanUppercase(t.newQuestionsBtn)}</span>
            </button>
          </div>
        </section>

        {/* ΦΟΡΜΑ ΜΕ ΤΙΣ 10 ΕΡΩΤΗΣΕΙΣ */}
        <form onSubmit={handleSubmit} className="space-y-8 w-full min-w-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 2xl:gap-8 w-full min-w-0">
            {questions.map((q, idx) => {
              const qNum = idx + 1;
              return (
                <div
                  key={q.id}
                  className={`p-4 sm:p-7 rounded-3xl border flex flex-col justify-between transition-all min-w-0 w-full overflow-hidden ${getCardStyle(q)}`}
                >
                  <div className="min-w-0 w-full">
                    {/* CARD HEADER */}
                    <div className="flex justify-between items-start gap-2 mb-3 min-w-0 w-full">
                      <span className="text-xs font-black px-3 py-1 bg-sky-100 text-sky-900 rounded-full uppercase tracking-wider break-words [overflow-wrap:anywhere] max-w-full">
                        {toCleanUppercase(`${t.exercisePrefix} ${qNum}: ${q.title}`)}
                      </span>
                      {submitted && (
                        <span className="text-xl shrink-0">
                          {isQuestionCorrect(q) ? '✅' : '❌'}
                        </span>
                      )}
                    </div>

                    {/* PROMPT (NO-GIVEAWAY: ΜΟΝΟ ΕΚΦΩΝΗΣΗ) */}
                    <div className="text-slate-800 text-sm sm:text-base leading-relaxed font-semibold mb-4 break-words [overflow-wrap:anywhere] min-w-0">
                      {q.prompt}
                    </div>

                    {/* INPUTS / OPTIONS */}
                    {q.type === 'mcq' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3 w-full min-w-0">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = answers[q.id] === opt.val;
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              disabled={submitted}
                              onClick={() => handleAnswerChange(q.id, opt.val, 'mcq')}
                              className={`p-3 rounded-2xl text-xs sm:text-sm font-bold border text-center transition touch-manipulation active:scale-95 break-words [overflow-wrap:anywhere] whitespace-normal leading-snug flex items-center justify-center min-h-[48px] w-full min-w-0 ${
                                isSelected
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              <span className="break-words [overflow-wrap:anywhere] max-w-full">
                                {opt.render}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {q.type === 'input' && (
                      <div className="space-y-2 mb-3 w-full min-w-0">
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
                          placeholder={t.inputPlaceholder}
                          aria-label={`Answer for exercise ${qNum}`}
                          className="w-full min-w-0 p-3 bg-white border-2 border-slate-200 rounded-2xl font-bold text-center text-base sm:text-lg focus:border-indigo-500 outline-none disabled:bg-slate-100 font-mono tracking-wider shadow-inner box-border"
                        />
                      </div>
                    )}
                  </div>

                  {/* POST-SUBMISSION FEEDBACK & TABLEDATA (NO-GIVEAWAY) */}
                  {submitted && (
                    <div className="mt-4 pt-3 border-t border-slate-200/70 space-y-3 min-w-0 w-full">
                      {q.tableData && q.tableData.length > 0 && (
                        <div className="w-full min-w-0 bg-white/90 p-2.5 rounded-2xl border border-slate-200">
                          {/* Desktop & Tablet Table */}
                          <div className="hidden sm:block overflow-x-auto w-full">
                            <table className="w-full text-xs text-left text-slate-700">
                              <thead>
                                <tr className="border-b border-slate-200 font-black text-slate-500 uppercase">
                                  <th className="p-1.5 break-words">{toCleanUppercase(t.tableHeaderElement)}</th>
                                  <th className="p-1.5 break-words">{toCleanUppercase(t.tableHeaderFormula)}</th>
                                  <th className="p-1.5 break-words">{toCleanUppercase(t.tableHeaderValue)}</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 font-mono">
                                {q.tableData.map((row, rIdx) => (
                                  <tr key={rIdx}>
                                    <td className="p-1.5 font-sans font-bold text-slate-900 break-words">{row.item}</td>
                                    <td className="p-1.5 text-indigo-700 break-words">{row.formula}</td>
                                    <td className="p-1.5 font-black text-emerald-700 break-words">{row.val}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Mobile Stacked Card View (<640px) */}
                          <div className="sm:hidden flex flex-col gap-2 divide-y divide-slate-100">
                            {q.tableData.map((row, rIdx) => (
                              <div key={rIdx} className="pt-2 first:pt-0 text-xs flex flex-col gap-1 min-w-0">
                                <span className="font-sans font-bold text-slate-900 break-words [overflow-wrap:anywhere]">
                                  {row.item}
                                </span>
                                <div className="flex items-center justify-between gap-2 font-mono flex-wrap">
                                  <span className="text-indigo-700 break-words [overflow-wrap:anywhere]">
                                    {row.formula}
                                  </span>
                                  <span className="font-black text-emerald-700 shrink-0">
                                    {row.val}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div
                        className={`p-3 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed break-words [overflow-wrap:anywhere] min-w-0 ${
                          isQuestionCorrect(q)
                            ? 'bg-emerald-100 text-emerald-950 border border-emerald-200'
                            : 'bg-rose-100 text-rose-950 border border-rose-200'
                        }`}
                      >
                        <p className="font-bold mb-1">
                          {isQuestionCorrect(q) ? t.feedbackSuccess : t.feedbackExplain}
                        </p>
                        <div className="min-w-0 break-words [overflow-wrap:anywhere]">{q.explain}</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="flex justify-center pt-4 w-full min-w-0">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-base sm:text-lg font-black px-8 sm:px-10 py-4 rounded-2xl shadow-xl transition transform hover:scale-105 active:scale-95 flex items-center gap-2.5 touch-manipulation max-w-full"
              >
                <span className="text-xl">🎯</span>
                <span className="break-words [overflow-wrap:anywhere]">{toCleanUppercase(t.checkBtn)}</span>
              </button>
            </div>
          )}
        </form>
      </div>

      {/* FIXED BOTTOM SCORE FOOTER */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl py-3.5 px-3 sm:px-6">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 w-full min-w-0">
          
          {/* SCORE & PERCENTAGE */}
          <div className="flex items-center gap-3 sm:gap-5 flex-wrap justify-center sm:justify-start">
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
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {submitted ? (
              <button
                type="button"
                onClick={loadNewSet}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2 sm:px-6 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 touch-manipulation max-w-full"
              >
                <span>🔄</span>
                <span className="break-words [overflow-wrap:anywhere]">{toCleanUppercase(t.newQuestionsBtn)}</span>
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