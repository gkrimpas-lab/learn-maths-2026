// pages/st-dimotikou/50-pososta-ask.js
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

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
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
    id: 'pct_std_1',
    title: 'Ποσοστό Μαθητών στην Τάξη',
    unit: '%',
    generate: () => {
      const totalStudents = pickRandom([20, 25, 50]);
      const boys = pickRandom([8, 10, 12, 15]);
      const pct = (boys / totalStudents) * 100;
      return {
        prompt: `Σε μια τάξη ${totalStudents} μαθητών, τα ${boys} είναι αγόρια. Τι ποσοστό (%) των μαθητών της τάξης είναι αγόρια;`,
        unit: '%',
        correctVal: String(pct),
        correctText: `${pct} %`,
        tableData: [
          { item: 'Πλήθος αγοριών', formula: `${boys}`, val: `${boys}` },
          { item: 'Σύνολο μαθητών', formula: `${totalStudents}`, val: `${totalStudents}` },
          { item: 'Υπολογισμός ποσοστού', formula: `(${boys} : ${totalStudents}) · 100`, val: `${pct} %` }
        ],
        explain: `Για να βρούμε το ποσοστό στα εκατό, διαιρούμε το μέρος με το όλο και πολλαπλασιάζουμε με το 100: (${boys} : ${totalStudents}) · 100 ＝ ${pct} %.`,
        distractors: [`${pct + 10} %`, `${Math.max(5, pct - 10)} %`, `${pct + 15} %`]
      };
    }
  },
  {
    id: 'pct_std_2',
    title: 'Πληρότητα Δεξαμενής Νερού',
    unit: '%',
    generate: () => {
      const totalCapacity = 200;
      const filled = 150;
      const pct = (filled / totalCapacity) * 100;
      return {
        prompt: `Μια δεξαμενή χωρητικότητας ${totalCapacity} l περιέχει ${filled} l νερό. Ποιο είναι το ποσοστό (%) πληρότητας της δεξαμενής;`,
        unit: '%',
        correctVal: String(pct),
        correctText: `${pct} %`,
        tableData: [
          { item: 'Ποσότητα νερού', formula: `${filled} l`, val: `${filled} l` },
          { item: 'Συνολική χωρητικότητα', formula: `${totalCapacity} l`, val: `${totalCapacity} l` },
          { item: 'Ποσοστό πληρότητας', formula: `(${filled} : ${totalCapacity}) · 100`, val: `${pct} %` }
        ],
        explain: `(${filled} : ${totalCapacity}) · 100 ＝ 0,75 · 100 ＝ ${pct} %.`,
        distractors: [`${pct - 15} %`, `${pct + 10} %`, `${pct - 25} %`]
      };
    }
  },
  {
    id: 'pct_std_3',
    title: 'Ανάγνωση Σελίδων Βιβλίου',
    unit: '%',
    generate: () => {
      const totalPages = 200;
      const read = 80;
      const pct = (read / totalPages) * 100;
      return {
        prompt: `Ένας μαθητής διάβασε ${read} από τις ${totalPages} σελίδες ενός βιβλίου. Τι ποσοστό (%) του βιβλίου διάβασε;`,
        unit: '%',
        correctVal: String(pct),
        correctText: `${pct} %`,
        tableData: [
          { item: 'Σελίδες που διαβάστηκαν', formula: `${read}`, val: `${read}` },
          { item: 'Σύνολο σελίδων', formula: `${totalPages}`, val: `${totalPages}` },
          { item: 'Ποσοστό ανάγνωσης', formula: `(${read} : ${totalPages}) · 100`, val: `${pct} %` }
        ],
        explain: `Διαιρούμε τις σελίδες που διαβάστηκαν με το σύνολο και πολλαπλασιάζουμε με το 100: (${read} : ${totalPages}) · 100 ＝ ${pct} %.`,
        distractors: [`${pct + 10} %`, `${pct - 10} %`, `${pct + 20} %`]
      };
    }
  },
  {
    id: 'pct_std_4',
    title: 'Ευστοχία σε Αγώνα Μπάσκετ',
    unit: '%',
    generate: () => {
      const attempts = 30;
      const scored = 18;
      const pct = (scored / attempts) * 100;
      return {
        prompt: `Σε έναν αγώνα μπάσκετ μια ομάδα ευστόχησε σε ${scored} από τα ${attempts} σουτ. Ποιο ήταν το ποσοστό ευστοχίας (%);`,
        unit: '%',
        correctVal: String(pct),
        correctText: `${pct} %`,
        tableData: [
          { item: 'Επιτυχημένα σουτ', formula: `${scored}`, val: `${scored}` },
          { item: 'Συνολικές προσπάθειες', formula: `${attempts}`, val: `${attempts}` },
          { item: 'Ποσοστό ευστοχίας', formula: `(${scored} : ${attempts}) · 100`, val: `${pct} %` }
        ],
        explain: `(${scored} : ${attempts}) · 100 ＝ 0,60 · 100 ＝ ${pct} %.`,
        distractors: [`${pct + 10} %`, `${pct - 10} %`, `${pct + 15} %`]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'pct_hard_1',
    title: 'Κατανομή Μαθητών Σχολείου',
    unit: 'κορίτσια',
    generate: () => {
      const totalStudents = 250;
      const boysPct = 40;
      const girlsPct = 100 - boysPct;
      const girls = (totalStudents * girlsPct) / 100;
      return {
        prompt: `Σε ένα σχολείο ${totalStudents} μαθητών, το ${boysPct} % είναι αγόρια. Πόσα είναι τα κορίτσια στο σχολείο;`,
        unit: 'κορίτσια',
        correctVal: String(girls),
        correctText: `${girls} κορίτσια`,
        tableData: [
          { item: 'Ποσοστό κοριτσιών', formula: `100 % － ${boysPct} %`, val: `${girlsPct} %` },
          { item: 'Πλήθος κοριτσιών', formula: `(${totalStudents} · ${girlsPct}) : 100`, val: `${girls}` }
        ],
        explain: `Ποσοστό κοριτσιών: 100 % － ${boysPct} % ＝ ${girlsPct} %. Πλήθος κοριτσιών: (${totalStudents} · ${girlsPct}) : 100 ＝ ${girls}.`,
        distractors: [`${girls - 25} κορίτσια`, `${girls + 25} κορίτσια`, `${totalStudents - girls - 20} κορίτσια`]
      };
    }
  },
  {
    id: 'pct_hard_2',
    title: 'Ποσοστό Περιεκτικότητας σε Κράμα',
    unit: '%',
    generate: () => {
      const totalAlloy = 500;
      const copper = 120;
      const tin = 180;
      const zinc = totalAlloy - (copper + tin);
      const zincPct = (zinc / totalAlloy) * 100;
      return {
        prompt: `Ένα κράμα βάρους ${totalAlloy} g περιέχει ${copper} g χαλκό, ${tin} g κασσίτερο και το υπόλοιπο είναι ψευδάργυρος. Ποιο είναι το ποσοστό (%) του ψευδαργύρου στο κράμα;`,
        unit: '%',
        correctVal: String(zincPct),
        correctText: `${zincPct} %`,
        tableData: [
          { item: 'Μάζα ψευδαργύρου', formula: `${totalAlloy} － (${copper} ＋ ${tin})`, val: `${zinc} g` },
          { item: 'Ποσοστό ψευδαργύρου', formula: `(${zinc} : ${totalAlloy}) · 100`, val: `${zincPct} %` }
        ],
        explain: `Μάζα ψευδαργύρου: ${totalAlloy} － (${copper} ＋ ${tin}) ＝ ${zinc} g. Ποσοστό: (${zinc} : ${totalAlloy}) · 100 ＝ ${zincPct} %.`,
        distractors: [`${zincPct + 10} %`, `${zincPct - 10} %`, `${zincPct + 15} %`]
      };
    }
  },
  {
    id: 'pct_hard_3',
    title: 'Κιβώτια με Φρούτα στην Αποθήκη',
    unit: 'κιβώτια',
    generate: () => {
      const totalBoxes = 800;
      const applesPct = 25;
      const orangesPct = 35;
      const pearsPct = 100 - (applesPct + orangesPct);
      const pearsBoxes = (totalBoxes * pearsPct) / 100;
      return {
        prompt: `Σε μια αποθήκη υπάρχουν ${totalBoxes} κιβώτια. Το ${applesPct} % περιέχει μήλα, το ${orangesPct} % πορτοκάλια και τα υπόλοιπα αχλάδια. Πόσα είναι τα κιβώτια με αχλάδια;`,
        unit: 'κιβώτια',
        correctVal: String(pearsBoxes),
        correctText: `${pearsBoxes} κιβώτια`,
        tableData: [
          { item: 'Ποσοστό αχλαδιών', formula: `100 % － (${applesPct} % ＋ ${orangesPct} %)`, val: `${pearsPct} %` },
          { item: 'Κιβώτια αχλαδιών', formula: `(${totalBoxes} · ${pearsPct}) : 100`, val: `${pearsBoxes}` }
        ],
        explain: `Ποσοστό αχλαδιών: 100 % － (${applesPct} % ＋ ${orangesPct} %) ＝ ${pearsPct} %. Κιβώτια: (${totalBoxes} · ${pearsPct}) : 100 ＝ ${pearsBoxes}.`,
        distractors: [`${pearsBoxes + 40} κιβώτια`, `${pearsBoxes - 40} κιβώτια`, `${pearsBoxes + 80} κιβώτια`]
      };
    }
  },
  {
    id: 'pct_hard_4',
    title: 'Ερωτήσεις Διαγωνίσματος με Ποσοστό Επιτυχίας',
    unit: 'ερωτήσεις',
    generate: () => {
      const totalQuestions = 50;
      const successPct = 90;
      const correctQuestions = (totalQuestions * successPct) / 100;
      return {
        prompt: `Σε ένα διαγώνισμα ${totalQuestions} ερωτήσεων, ένας μαθητής είχε ${successPct} % επιτυχία. Πόσες ερωτήσεις απάντησε σωστά;`,
        unit: 'ερωτήσεις',
        correctVal: String(correctQuestions),
        correctText: `${correctQuestions} ερωτήσεις`,
        tableData: [
          { item: 'Σύνολο ερωτήσεων', formula: `${totalQuestions}`, val: `${totalQuestions}` },
          { item: 'Ποσοστό επιτυχίας', formula: `${successPct} %`, val: `${successPct} %` },
          { item: 'Σωστές ερωτήσεις', formula: `(${totalQuestions} · ${successPct}) : 100`, val: `${correctQuestions}` }
        ],
        explain: `(${totalQuestions} · ${successPct}) : 100 ＝ ${correctQuestions} ερωτήσεις.`,
        distractors: [`${correctQuestions - 5} ερωτήσεις`, `${correctQuestions + 3} ερωτήσεις`, `${correctQuestions - 10} ερωτήσεις`]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions() {
  // Q1: Input - Μετατροπή κλάσματος σε ποσοστό
  const q1Preset = pickRandom([
    { num: 1, den: 4, pct: 25 },
    { num: 3, den: 4, pct: 75 },
    { num: 2, den: 5, pct: 40 },
    { num: 7, den: 10, pct: 70 }
  ]);

  // Q2: MCQ - Ορισμός ποσοστού
  const q2CorrectConcept = 'Ένας λόγος ή ένα κλάσμα με σταθερό παρονομαστή το 100';
  const q2Options = shuffle([
    q2CorrectConcept,
    'Το γινόμενο δύο τυχαίων ακεραίων αριθμών',
    'Ένα κλάσμα που έχει πάντοτε αριθμητή το 100',
    'Η διαφορά ανάμεσα σε δύο δεκαδικούς'
  ]);

  // Q3: Input - Μετατροπή δεκαδικού σε ποσοστό
  const q3Dec = pickRandom([0.35, 0.45, 0.6, 0.08, 0.72]);
  const q3Pct = Number((q3Dec * 100).toFixed(0));

  // Q4: MCQ - Σχέση στα εκατό και στα χίλια
  const q4CorrectRelation = '1 % ＝ 10 ‰ (το ποσοστό στα εκατό ισούται με 10 στα χίλια)';
  const q4Options = shuffle([
    q4CorrectRelation,
    '1 % ＝ 100 ‰',
    '10 % ＝ 1 ‰',
    'Δεν έχουν καμία μαθηματική σχέση μεταξύ τους'
  ]);

  // Q5: Input - Υπολογισμός ποσοστού επί του συνόλου
  const q5Total = 50;
  const q5Part = pickRandom([15, 20, 25, 30]);
  const q5Pct = (q5Part / q5Total) * 100;

  // Q6: MCQ - Ανάγωγο κλάσμα του 50%
  const q6CorrectFrac = '1/2 (ένα δεύτερο)';
  const q6Options = shuffle([
    q6CorrectFrac,
    '1/4',
    '1/5',
    '3/4'
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
      title: 'Μετατροπή Κλάσματος σε Ποσοστό',
      prompt: `Σε ποιο ποσοστό στα εκατό (%) αντιστοιχεί το κλάσμα ${q1Preset.num}/${q1Preset.den}; (γράψε μόνο τον αριθμό)`,
      correct: String(q1Preset.pct),
      explain: `(${q1Preset.num} : ${q1Preset.den}) · 100 ＝ ${q1Preset.pct} %.`
    },
    {
      id: 'q2',
      type: 'mcq',
      title: 'Ορισμός Ποσοστού',
      prompt: 'Τι ονομάζουμε ποσοστό στα εκατό (%) στα Μαθηματικά;',
      options: q2Options,
      correct: q2CorrectConcept,
      explain: 'Ποσοστό στα εκατό (%) είναι το κλάσμα που συγκρίνει ένα μέγεθος με βάση το 100 (παρονομαστής 100).'
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'number',
      title: 'Από Δεκαδικό σε Ποσοστό',
      prompt: `Ποιο ποσοστό στα εκατό (%) αντιπροσωπεύει ο δεκαδικός αριθμός ${formatNum(q3Dec, 2)}; (γράψε μόνο τον αριθμό)`,
      correct: String(q3Pct),
      explain: `${formatNum(q3Dec, 2)} · 100 ＝ ${q3Pct} %.`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: 'Σχέση στα Εκατό και στα Χίλια',
      prompt: 'Ποια είναι η σχέση ανάμεσα στο ποσοστό στα εκατό (%) και στο ποσοστό στα χίλια (‰);',
      options: q4Options,
      correct: q4CorrectRelation,
      explain: '1/100 ＝ 10/1.000, επομένως 1 % ＝ 10 ‰.'
    },
    {
      id: 'q5',
      type: 'input',
      inputType: 'number',
      title: 'Υπολογισμός Ποσοστού επί του Συνόλου',
      prompt: `Σε μια ομάδα 50 ατόμων, τα ${q5Part} άτομα ασχολούνται με το τρέξιμο. Τι ποσοστό (%) της ομάδας ασχολείται με το τρέξιμο; (γράψε μόνο τον αριθμό)`,
      correct: String(q5Pct),
      explain: `(${q5Part} : 50) · 100 ＝ ${q5Pct} %.`
    },
    {
      id: 'q6',
      type: 'mcq',
      title: 'Ανάγωγο Κλάσμα του 50%',
      prompt: 'Ποιο ανάγωγο κλάσμα αντιστοιχεί ακριβώς στο ποσοστό 50 %;',
      options: q6Options,
      correct: q6CorrectFrac,
      explain: '50 % ＝ 50/100 ＝ 1/2 (το μισό του όλου).'
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
      inputType: 'number',
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

export default function PosostaExercisesPage() {
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
      title="Ασκήσεις: Ποσοστά (Έννοια & Μετατροπές) - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στα ποσοστά στα εκατό (%) και στα χίλια (‰) για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/50-pososta"
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
                <span>ΚΕΦΑΛΑΙΟ 50 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Ποσοστά στα Εκατό (%) &amp; στα Χίλια (‰)
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στη μετατροπή κλασμάτων και δεκαδικών σε ποσοστά, στα ποσοστά επί του συνόλου και σε πρακτικά προβλήματα!
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
                          placeholder="Απάντηση..."
                          className="w-full p-3 bg-white border-2 border-slate-200 rounded-2xl font-bold text-center text-base sm:text-lg focus:border-indigo-500 outline-none disabled:bg-slate-100 font-mono tracking-wider shadow-inner"
                        />
                      </div>
                    )}
                  </div>

                  {/* POST-SUBMISSION FEEDBACK & TABLEDATA (NO-GIVEAWAY) */}
                  {submitted && (
                    <div className="mt-4 pt-3 border-t border-slate-200/70 space-y-3">
                      {q.tableData && (
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
