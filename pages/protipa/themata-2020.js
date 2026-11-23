import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { LAYOUT } from '../../shared/layout-config';

// Βοηθητική συνάρτηση για άτονα κεφαλαία (διατηρεί μόνο το Α')
function toCleanUppercase(str) {
  if (!str) return '';
  return String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
}

// 1. Απλό κλάσμα (ευθυγραμμίζεται απόλυτα στο κέντρο των γραμμάτων της πρότασης & των τελεστών)
function Frac({ num, den, inline = true, small = false }) {
  return (
    <span
      className={`${inline ? 'inline-grid' : 'grid'} grid-rows-[1fr_auto_1fr] items-center justify-items-center whitespace-nowrap align-middle ${
        small ? 'mx-0.5 text-[0.8em]' : 'mx-1 text-[0.86em]'
      } font-mono font-bold leading-none select-none`}
    >
      <span className="self-end px-1 pb-[1.5px] text-center">{num}</span>
      <span className={`w-full ${small ? 'border-t border-current' : 'border-t-[1.8px] border-current'}`} />
      <span className="self-start px-1 pt-[1.5px] text-center">{den}</span>
    </span>
  );
}

// 2. Σύνθετο κλάσμα (4 περιπτώσεις: κλάσμα/κλάσμα, αριθμός/κλάσμα, κλάσμα/αριθμός, κ.λπ.)
// Χρησιμοποιεί 2 ίσες σειρές (1fr) ώστε η κύρια γραμμή να μένει ΠΑΝΤΑ στο 50% και να ευθυγραμμίζεται με τα +, -, =
function ComplexFrac({ num, den }) {
  return (
    <span className="inline-grid grid-rows-[1fr_auto_1fr] items-center justify-items-center align-middle mx-1.5 my-0.5 font-mono font-bold text-[0.9em] leading-none select-none whitespace-nowrap">
      {/* Αριθμητής: κάθεται ακριβώς πάνω από την κύρια γραμμή */}
      <span className="self-end px-2 pb-[3px] flex items-center justify-center">
        {num}
      </span>

      {/* Κύρια γραμμή σύνθετου κλάσματος (πάντα στο κέντρο) */}
      <span className="w-full border-t-[2.4px] border-current" />

      {/* Παρονομαστής: κάθεται ακριβώς κάτω από την κύρια γραμμή */}
      <span className="self-start px-2 pt-[3px] flex items-center justify-center">
        {den}
      </span>
    </span>
  );
}

// 3. Component για δυνάμεις (χωρίς ^ και χωρίς Unicode εκθέτες)
function Pow({ base, exp }) {
  return (
    <span className="inline-flex items-baseline font-mono whitespace-nowrap">
      <span>{base}</span>
      <sup className="text-[0.72em] leading-none font-bold ml-[1px] -top-[0.45em] relative">
        {exp}
      </sup>
    </span>
  );
}

// 4. Component για τετραγωνική ρίζα με απόλυτη ευθυγράμμιση SVG + vinculum
function Radical({ children }) {
  return (
    <span className="inline-flex items-stretch align-baseline font-mono mx-0.5 whitespace-nowrap">
      <svg
        viewBox="0 0 12 20"
        preserveAspectRatio="none"
        className="w-[11px] h-[1.22em] self-center shrink-0 overflow-visible"
        aria-hidden="true"
      >
        <polyline
          points="0.5,11.5 4.2,19 9.8,0.8 12.2,0.8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span className="border-t-[1.6px] border-current px-1 leading-[1.15] self-center">
        {children}
      </span>
    </span>
  );
}

const I18N = {
  el: {
    metaTitle: 'Θέματα Προτύπων 2020 – Επίσημα Θέματα & Αναλυτικές Λύσεις | LearnMaths.gr',
    metaDesc: 'Λύσε online τα 25 επίσημα θέματα Μαθηματικών για τα Πρότυπα Γυμνάσια 2020 (026–050), με χρονόμετρο 60 λεπτών, αυτόματη βαθμολόγηση και αναλυτικές λύσεις.',
    backText: 'Θέματα Προτύπων',
    heroBadge: 'Επίσημα Θέματα 2020 • 25 Ερωτήσεις Μαθηματικών',
    heroTitle: 'Θέματα Προτύπων Γυμνασίων 2020 – Online Τεστ & Λύσεις',
    heroSubtitle: 'Εξασκήσου στα επίσημα θέματα Μαθηματικών των εξετάσεων εισαγωγής στα Πρότυπα Γυμνάσια 2020. Περιλαμβάνει και τις 25 ερωτήσεις (026–050) με αυτόματη βαθμολόγηση (2 μόρια ανά θέμα, Άριστα: 50), χρονόμετρο 60 λεπτών και αναλυτικές λύσεις.',
    answeredLabel: 'Απαντημένες:',
    of25: 'από 25',
    scoringLabel: 'Βαθμολογία:',
    scoringValue: '2 μόρια ανά θέμα (Άριστα: 50)',
    timerOn: '⏳ Χρονόμετρο: 60 λεπτά',
    timerOff: '⏳ Χρονόμετρο: Ανενεργό',
    resultTitle: 'Αποτέλεσμα Εξέτασης Προτύπων 2020',
    finalScoreLabel: 'Τελικό Σκορ',
    correctOutOf: (c) => `(${c} σωστές στις 25 ερωτήσεις)`,
    resultSubtitle: 'Δες παρακάτω αναλυτικά τις απαντήσεις σου με πλήρη μαθηματική τεκμηρίωση για κάθε θέμα.',
    questionPrefix: 'Θέμα',
    pointsEarned: '✅ +2 μόρια',
    pointsZero: '❌ 0 μόρια',
    explainTitleSubmitted: 'Μαθηματική Επεξήγηση:',
    explainTitlePreview: 'Προβολή Αναλυτικής Λύσης & Σχήματος',
    submitMainBtn: (c) => `Οριστική Υποβολή (${c} από 25)`,
    barScore: (s) => `Σκορ: ${s} / 50`,
    barAnswered: (c) => `Απαντήσεις: ${c} / 25`,
    barPercent: 'Ποσοστό:',
    barRemaining: 'Υπολείπονται:',
    retryBtn: '🔄 Επανάληψη Εξέτασης',
    checkBtn: 'Έλεγχος & Βαθμολόγηση ➔',
    axisAria: 'Αριθμογραμμή από 0 έως 2 με σημειωμένο το σημείο Α',
    scalesAria: 'Δύο ζυγαριές σε ισορροπία με πατάτες και κρεμμύδια',
    potatoesAndOnions1: 'πατάτες',
    potatoesAndOnions2: 'και κρεμμύδια',
    kg28: '28 κιλά',
    onions: 'κρεμμύδια',
    potatoes: 'πατάτες',
    kg4: '4 κιλά',
    chartAria: 'Ραβδόγραμμα ενασχόλησης στον ελεύθερο χρόνο',
    chartTitle: 'Ενασχόληση στον ελεύθερο χρόνο',
    chartBars: [
      { lines: ['ηλεκτρονικά', 'παιχνίδια'], val: 30 },
      { lines: ['παιχνίδι με', 'φίλους'], val: 20 },
      { lines: ['μουσική'], val: 20 },
      { lines: ['λογοτεχνία'], val: 10 }
    ],
    judgesHeaders: ['1ος κριτής', '2ος κριτής', '3ος κριτής', '4ος κριτής'],
    judgesScores: ['9', '8,8', '8,2', '9,2'],
    yardAria: 'Σχεδιάγραμμα αυλής και τετράγωνου κήπου',
    garden: 'κήπος',
    m5: '5 μ.',
    m3: '3 μ.',
    m12: '12 μ.',
    pieAria: 'Κυκλικό διάγραμμα ποσοστού μπλε και μαύρου στυλό',
    blackPen: 'Μαύρο',
    bluePen: 'Μπλε',
    rectAria: 'Ορθογώνιο ΑΖΕΔ χωρισμένο στο γραμμοσκιασμένο ορθογώνιο ΑΖΓΒ και το τετράγωνο ΒΓΕΔ',
    rectLabels: ['Ζ', 'Α', 'Γ', 'Β', 'Ε', 'Δ'],
    schemaHome: 'Αρχική',
    schemaHub: 'Ενδεικτικά Θέματα Προτύπων 2026',
    schemaCurrent: 'Θέματα Προτύπων Γυμνασίων 2020',
    schemaQuizName: 'Επίσημα Θέματα Μαθηματικών Προτύπων Γυμνασίων 2020 (Με Λύσεις)',
    schemaQuizDesc: 'Διαδραστικό τεστ με τα 25 επίσημα θέματα Μαθηματικών των εξετάσεων εισαγωγής στα Πρότυπα Γυμνάσια 2020 (026–050), χρονόμετρο 60 λεπτών, αυτόματη βαθμολόγηση (0–50) και αναλυτικές λύσεις.',
    schemaEduLevel: "ΣΤ' Δημοτικού",
    schemaQuestionName: (num) => `Θέμα ${num} - Πρότυπα 2020`
  },
  en: {
    metaTitle: 'Model School 2020 Math Past Paper – Online Test & Solutions | LearnMaths.gr',
    metaDesc: 'Practice online with the 25 official Mathematics questions from the 2020 Model Middle School entrance exam (026–050), 60-minute timer, auto-grading, and full solutions.',
    backText: 'Model School Exams',
    heroBadge: 'Official 2020 Exam • 25 Mathematics Questions',
    heroTitle: 'Model Middle Schools 2020 Math Exam – Online Test & Solutions',
    heroSubtitle: 'Practice with the official Mathematics questions from the 2020 Model Middle School entrance exams. Includes all 25 questions (026–050) with automatic scoring (2 points per question, Max: 50), a 60-minute timer, and step-by-step solutions.',
    answeredLabel: 'Answered:',
    of25: 'of 25',
    scoringLabel: 'Scoring:',
    scoringValue: '2 points per question (Max: 50)',
    timerOn: '⏳ Timer: 60 minutes',
    timerOff: '⏳ Timer: Disabled',
    resultTitle: '2020 Model School Exam Results',
    finalScoreLabel: 'Final Score',
    correctOutOf: (c) => `(${c} correct out of 25 questions)`,
    resultSubtitle: 'Review your answers below with complete step-by-step mathematical explanations for every question.',
    questionPrefix: 'Question',
    pointsEarned: '✅ +2 pts',
    pointsZero: '❌ 0 pts',
    explainTitleSubmitted: 'Mathematical Explanation:',
    explainTitlePreview: 'View Step-by-Step Solution & Diagram',
    submitMainBtn: (c) => `Final Submission (${c} of 25)`,
    barScore: (s) => `Score: ${s} / 50`,
    barAnswered: (c) => `Answered: ${c} / 25`,
    barPercent: 'Percentage:',
    barRemaining: 'Remaining:',
    retryBtn: '🔄 Retake Exam',
    checkBtn: 'Check & Grade ➔',
    axisAria: 'Number line from 0 to 2 showing point A',
    scalesAria: 'Two balanced scales with potatoes and onions',
    potatoesAndOnions1: 'potatoes',
    potatoesAndOnions2: 'and onions',
    kg28: '28 kg',
    onions: 'onions',
    potatoes: 'potatoes',
    kg4: '4 kg',
    chartAria: 'Bar chart of favorite free-time activities',
    chartTitle: 'Favorite free-time activity',
    chartBars: [
      { lines: ['video', 'games'], val: 30 },
      { lines: ['playing with', 'friends'], val: 20 },
      { lines: ['music'], val: 20 },
      { lines: ['literature'], val: 10 }
    ],
    judgesHeaders: ['Judge 1', 'Judge 2', 'Judge 3', 'Judge 4'],
    judgesScores: ['9', '8.8', '8.2', '9.2'],
    yardAria: 'Floor plan of the schoolyard and square garden',
    garden: 'garden',
    m5: '5 m',
    m3: '3 m',
    m12: '12 m',
    pieAria: 'Pie chart showing blue and black pen percentages',
    blackPen: 'Black',
    bluePen: 'Blue',
    rectAria: 'Rectangle AZED divided into shaded rectangle AZCB and square BCED',
    rectLabels: ['Z', 'A', 'C', 'B', 'E', 'D'],
    schemaHome: 'Home',
    schemaHub: 'Model School Entrance 2026 Prep',
    schemaCurrent: 'Model Middle Schools 2020 Exam',
    schemaQuizName: 'Official 2020 Model Middle School Mathematics Exam (With Solutions)',
    schemaQuizDesc: 'Interactive practice test featuring all 25 official Mathematics questions from the 2020 Model Middle School entrance examination (026–050), 60-minute timer, automatic grading (0–50), and detailed solutions.',
    schemaEduLevel: 'Grade 6',
    schemaQuestionName: (num) => `Question ${num} - Model Schools 2020`
  }
};

function getQuestions2020(locale) {
  const isEn = locale === 'en';
  const groupA = isEn ? 'GROUP A (4 CHOICES)' : 'ΟΜΑΔΑ Α (4 ΕΠΙΛΟΓΕΣ)';
  const groupB = isEn ? 'GROUP B (4 CHOICES)' : 'ΟΜΑΔΑ Β (4 ΕΠΙΛΟΓΕΣ)';

  return [
    {
      id: 1,
      officialNumber: 26,
      group: groupA,
      promptText: (
        <div className="space-y-2">
          <p>{isEn ? 'What is the value of the numerical expression:' : 'Ποια είναι η τιμή της αριθμητικής παράστασης:'}</p>
          <div className="font-mono text-sm sm:text-base flex items-center flex-wrap gap-x-1.5 gap-y-2 pt-0.5">
            <ComplexFrac num="20" den={<Frac num="1" den="2" small />} />
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">－ 20</span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              － <Frac num="2" den={isEn ? '0.2' : '0,2'} />
            </span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ＋ 2 · <Pow base="2" exp="2" />
            </span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＋ 2 ＝</span>
          </div>
        </div>
      ),
      options: [
        { key: 'A', label: '2', raw: '2' },
        { key: 'B', label: isEn ? '0.2' : '0,2', raw: isEn ? '0.2' : '0,2' },
        { key: isEn ? 'C' : 'Γ', label: '20', raw: '20' },
        { key: isEn ? 'D' : 'Δ', label: '40', raw: '40' }
      ],
      correctRaw: '20',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>First compute the exponent, divisions, and multiplication:</p>
          <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>•</span>
              <ComplexFrac num="20" den={<Frac num="1" den="2" small />} />
              <span className="whitespace-nowrap">＝ 20 · 2 ＝ <strong>40</strong></span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>•</span>
              <Frac num="2" den="0.2" />
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                ＝ <Frac num="20" den="2" /> ＝ <strong>10</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• 2 · <Pow base="2" exp="2" /></span>
              <span className="whitespace-nowrap">＝ 2 · 4 ＝ <strong>8</strong></span>
            </div>
          </div>
          <p>Substitute into the expression and compute from left to right:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
            <div>40 － 20 － 10 ＋ 8 ＋ 2</div>
            <div>＝ 20 － 10 ＋ 8 ＋ 2</div>
            <div>＝ 10 ＋ 8 ＋ 2 ＝ <strong className="text-emerald-700 text-base">20</strong></div>
          </div>
          <p className="pt-1">Thus, the value is <strong>20</strong> (Choice <strong>C</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Εκτελούμε πρώτα τις δυνάμεις, τους πολλαπλασιασμούς και τις διαιρέσεις:</p>
          <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>•</span>
              <ComplexFrac num="20" den={<Frac num="1" den="2" small />} />
              <span className="whitespace-nowrap">＝ 20 · 2 ＝ <strong>40</strong></span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>•</span>
              <Frac num="2" den="0,2" />
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                ＝ <Frac num="20" den="2" /> ＝ <strong>10</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• 2 · <Pow base="2" exp="2" /></span>
              <span className="whitespace-nowrap">＝ 2 · 4 ＝ <strong>8</strong></span>
            </div>
          </div>
          <p>Αντικαθιστούμε στην παράσταση και εκτελούμε τις πράξεις από αριστερά προς τα δεξιά:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
            <div>40 － 20 － 10 ＋ 8 ＋ 2</div>
            <div>＝ 20 － 10 ＋ 8 ＋ 2</div>
            <div>＝ 10 ＋ 8 ＋ 2 ＝ <strong className="text-emerald-700 text-base">20</strong></div>
          </div>
          <p className="pt-1">Άρα, η τιμή είναι <strong>20</strong> (Επιλογή <strong>Γ</strong>).</p>
        </div>
      )
    },
    {
      id: 2,
      officialNumber: 27,
      group: groupA,
      promptText: isEn
        ? 'Which number is triple the number corresponding to point A on the number line segment below?'
        : 'Ποιος αριθμός είναι τριπλάσιος του αριθμού που αντιστοιχεί στο σημείο Α του παρακάτω τμήματος της αριθμογραμμής;',
      hasSvg: 'axis27',
      options: [
        { key: 'A', label: '3', raw: '3' },
        { key: 'B', label: isEn ? '2.7' : '2,7', raw: isEn ? '2.7' : '2,7' },
        { key: isEn ? 'C' : 'Γ', label: isEn ? '0.3' : '0,3', raw: isEn ? '0.3' : '0,3' },
        { key: isEn ? 'D' : 'Δ', label: isEn ? '0.9' : '0,9', raw: isEn ? '0.9' : '0,9' }
      ],
      correctRaw: isEn ? '2.7' : '2,7',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>On the number line, the interval from 0 to 1 is divided into 10 equal parts (each tick mark represents 0.1).</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
            <div>• Point A is at the 9th tick mark: <strong>A ＝ 0.9</strong></div>
            <div>• Triple of A is: 3 · 0.9 ＝ <strong className="text-emerald-700 text-base">2.7</strong></div>
          </div>
          <p className="pt-1">Therefore, the number is <strong>2.7</strong> (Choice <strong>B</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Στην αριθμογραμμή το διάστημα από το 0 έως το 1 είναι χωρισμένο σε 10 ίσα τμήματα (κάθε υποδιαίρεση αντιστοιχεί σε 0,1).</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
            <div>• Το σημείο Α βρίσκεται στην 9η υποδιαίρεση: <strong>Α ＝ 0,9</strong></div>
            <div>• Ο τριπλάσιος αριθμός του Α είναι: 3 · 0,9 ＝ <strong className="text-emerald-700 text-base">2,7</strong></div>
          </div>
          <p className="pt-1">Επομένως, ο αριθμός είναι το <strong>2,7</strong> (Επιλογή <strong>B</strong>).</p>
        </div>
      )
    },
    {
      id: 3,
      officialNumber: 28,
      group: groupA,
      promptText: isEn
        ? 'Panagiotis is 7 years older than Afroditi. Afroditi is 7 years younger than Evangelia. If Panagiotis is 33 years old, how old is Evangelia?'
        : 'Ο Παναγιώτης είναι 7 χρόνια μεγαλύτερος από την Αφροδίτη. Η Αφροδίτη είναι 7 χρόνια μικρότερη από την Ευαγγελία. Αν ο Παναγιώτης είναι 33 ετών, πόσων ετών είναι η Ευαγγελία;',
      options: [
        { key: 'A', label: '19', raw: '19' },
        { key: 'B', label: '33', raw: '33' },
        { key: isEn ? 'C' : 'Γ', label: '40', raw: '40' },
        { key: isEn ? 'D' : 'Δ', label: '47', raw: '47' }
      ],
      correctRaw: '33',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Write down the relationships between their ages:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Panagiotis ＝ Afroditi ＋ 7 ➔ 33 ＝ Afroditi ＋ 7 ➔ <strong>Afroditi ＝ 26 years old</strong></div>
            <div>• Afroditi ＝ Evangelia － 7 ➔ 26 ＝ Evangelia － 7 ➔ <strong>Evangelia ＝ 33 years old</strong></div>
          </div>
          <p className="pt-1">Thus, Evangelia is <strong>33</strong> years old (Choice <strong>B</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Καταγράφουμε τις σχέσεις των ηλικιών:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Παναγιώτης ＝ Αφροδίτη ＋ 7 ➔ 33 ＝ Αφροδίτη ＋ 7 ➔ <strong>Αφροδίτη ＝ 26 ετών</strong></div>
            <div>• Αφροδίτη ＝ Ευαγγελία － 7 ➔ 26 ＝ Ευαγγελία － 7 ➔ <strong>Ευαγγελία ＝ 33 ετών</strong></div>
          </div>
          <p className="pt-1">Άρα, η Ευαγγελία είναι <strong>33</strong> ετών (Επιλογή <strong>B</strong>).</p>
        </div>
      )
    },
    {
      id: 4,
      officialNumber: 29,
      group: groupA,
      promptText: isEn
        ? 'Maria wants to invite her friends over to play. Between 2 and at most 5 children will gather. What is the minimum number of candies she must buy so that in every case they can be shared equally with none left over?'
        : 'Η Μαρία θέλει να καλέσει τους φίλους και τις φίλες της στο σπίτι για παιχνίδι. Θα μαζευτούν από 2 μέχρι το πολύ 5 παιδιά. Πόσες το λιγότερο καραμέλες πρέπει να αγοράσει ώστε σε κάθε περίπτωση να τις μοιραστούν δίκαια και να μην περισσέψει καμιά;',
      options: [
        { key: 'A', label: '10', raw: '10' },
        { key: 'B', label: '15', raw: '15' },
        { key: isEn ? 'C' : 'Γ', label: '60', raw: '60' },
        { key: isEn ? 'D' : 'Δ', label: '120', raw: '120' }
      ],
      correctRaw: '60',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            The number of candies must be divisible by 2, 3, 4, and 5. So we look for the <strong>Least Common Multiple (LCM)</strong> of these numbers:
          </p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span>LCM(2, 3, 4, 5) ＝</span>
            <span className="whitespace-nowrap"><Pow base="2" exp="2" /> · 3 · 5</span>
            <span className="whitespace-nowrap">＝ 4 · 3 · 5 ＝ <strong className="text-emerald-700 text-base">60</strong></span>
          </div>
          <p className="pt-1">Therefore, she must buy at least <strong>60</strong> candies (Choice <strong>C</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            Ο αριθμός των καραμελών πρέπει να διαιρείται ακριβώς με το 2, το 3, το 4 και το 5. Άρα αναζητούμε το <strong>Ελάχιστο Κοινό Πολλαπλάσιο</strong> των αριθμών αυτών:
          </p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span>ΕΚΠ(2, 3, 4, 5) ＝</span>
            <span className="whitespace-nowrap"><Pow base="2" exp="2" /> · 3 · 5</span>
            <span className="whitespace-nowrap">＝ 4 · 3 · 5 ＝ <strong className="text-emerald-700 text-base">60</strong></span>
          </div>
          <p className="pt-1">Επομένως, πρέπει να αγοράσει το λιγότερο <strong>60</strong> καραμέλες (Επιλογή <strong>Γ</strong>).</p>
        </div>
      )
    },
    {
      id: 5,
      officialNumber: 30,
      group: groupA,
      promptText: isEn
        ? 'Observe the balanced scales below. How much do the onions weigh?'
        : 'Παρατήρησε τις παρακάτω ζυγαριές που ισορροπούν. Πόσο ζυγίζουν τα κρεμμύδια;',
      hasSvg: 'scales30',
      options: isEn
        ? [
            { key: 'A', label: '14 kg', raw: '14 kg' },
            { key: 'B', label: '16 kg', raw: '16 kg' },
            { key: 'C', label: '32 kg', raw: '32 kg' },
            { key: 'D', label: '24 kg', raw: '24 kg' }
          ]
        : [
            { key: 'A', label: '14 κιλά', raw: '14 κιλά' },
            { key: 'B', label: '16 κιλά', raw: '16 κιλά' },
            { key: 'Γ', label: '32 κιλά', raw: '32 κιλά' },
            { key: 'Δ', label: '24 κιλά', raw: '24 κιλά' }
          ],
      correctRaw: isEn ? '16 kg' : '16 κιλά',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Let <strong>P</strong> represent the potatoes and <strong>O</strong> represent the onions.</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
            <div>(1) 1st scale: P ＋ O ＝ 28 kg</div>
            <div>(2) 2nd scale: O ＝ P ＋ 4 kg ➔ O － P ＝ 4 kg</div>
          </div>
          <p>Add the two equations together:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>(P ＋ O) ＋ (O － P) ＝ 28 ＋ 4</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="whitespace-nowrap">2 · O ＝ 32</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                ➔ O ＝ <Frac num="32" den="2" /> ＝ <strong className="text-emerald-700 text-base">16 kg</strong>
              </span>
            </div>
          </div>
          <p className="pt-1">Thus, the onions weigh <strong>16 kg</strong> (Choice <strong>B</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Συμβολίζουμε με <strong>Π</strong> τις πατάτες και με <strong>Κ</strong> τα κρεμμύδια.</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
            <div>(1) 1η ζυγαριά: Π ＋ Κ ＝ 28 κιλά</div>
            <div>(2) 2η ζυγαριά: Κ ＝ Π ＋ 4 κιλά ➔ Κ － Π ＝ 4 κιλά</div>
          </div>
          <p>Προσθέτουμε τις δύο σχέσεις κατά μέλη:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>(Π ＋ Κ) ＋ (Κ － Π) ＝ 28 ＋ 4</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="whitespace-nowrap">2 · Κ ＝ 32</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                ➔ Κ ＝ <Frac num="32" den="2" /> ＝ <strong className="text-emerald-700 text-base">16 κιλά</strong>
              </span>
            </div>
          </div>
          <p className="pt-1">Άρα, τα κρεμμύδια ζυγίζουν <strong>16 κιλά</strong> (Επιλογή <strong>B</strong>).</p>
        </div>
      )
    },
    {
      id: 6,
      officialNumber: 31,
      group: groupA,
      promptText: isEn
        ? 'A crate contained 60 apples. The students of a 6th-grade class took 3 apples each as part of a healthy eating program. At the end, 6 apples remained in the crate. Which of the following equations would you use to find how many students were in that class?'
        : 'Σε ένα κιβώτιο υπήρχαν 60 μήλα. Οι μαθητές και οι μαθήτριες μιας Στ τάξης στο πλαίσιο ενός προγράμματος υγιεινής διατροφής πήραν από 3 μήλα ο καθένας. Στο τέλος έμειναν 6 μήλα στο κιβώτιο. Ποια από τις παρακάτω εξισώσεις θα χρησιμοποιήσεις για να βρεις πόσοι ήταν οι μαθητές και οι μαθήτριες αυτής της τάξης;',
      options: [
        { key: 'A', label: <span className="font-mono inline-flex items-center whitespace-nowrap"><Frac num="60" den="x" /> ＝ 3</span>, raw: '60 / x = 3' },
        { key: 'B', label: <span className="font-mono whitespace-nowrap">3 · x － 6 ＝ 60</span>, raw: '3 · x - 6 = 60' },
        { key: isEn ? 'C' : 'Γ', label: <span className="font-mono inline-flex items-center whitespace-nowrap"><Frac num="60 － 6" den="x" /> ＝ 3</span>, raw: '(60 - 6) / x = 3' },
        { key: isEn ? 'D' : 'Δ', label: <span className="font-mono inline-flex items-center whitespace-nowrap"><Frac num="66" den="x" /> ＝ 3</span>, raw: '66 / x = 3' }
      ],
      correctRaw: '(60 - 6) / x = 3',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. The apples distributed to the students are: <strong>60 － 6</strong>.</p>
          <p>
            2. If <strong>x</strong> is the number of students, dividing the distributed apples by the number of students gives 3 apples per student:
          </p>
          <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-mono text-emerald-800 font-bold inline-flex items-center gap-1.5 whitespace-nowrap">
            <Frac num="60 － 6" den="x" />
            <span>＝ 3</span>
          </div>
          <p className="pt-1">Therefore, equation <strong>C</strong> is correct.</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Τα μήλα που μοιράστηκαν στους μαθητές είναι: <strong>60 － 6</strong>.</p>
          <p>
            2. Αν <strong>x</strong> είναι το πλήθος των μαθητών, διαιρώντας τα μήλα που μοιράστηκαν με τους μαθητές, προκύπτουν 3 μήλα ανά μαθητή:
          </p>
          <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-mono text-emerald-800 font-bold inline-flex items-center gap-1.5 whitespace-nowrap">
            <Frac num="60 － 6" den="x" />
            <span>＝ 3</span>
          </div>
          <p className="pt-1">Επομένως, σωστή είναι η εξίσωση <strong>Γ</strong>.</p>
        </div>
      )
    },
    {
      id: 7,
      officialNumber: 32,
      group: groupA,
      promptText: isEn
        ? 'Ariadni took 25 free throws in yesterday’s basketball game and scored on 19 of them. What percentage (%) of her shots were missed?'
        : 'Η Αριάδνη έκανε 25 βολές στο χθεσινό παιχνίδι μπάσκετ και πέτυχε πόντους στις 19 από αυτές. Τι ποσοστό στα % των βολών της ήταν άστοχες;',
      options: [
        { key: 'A', label: '6%', raw: '6%' },
        { key: 'B', label: '19%', raw: '19%' },
        { key: isEn ? 'C' : 'Γ', label: '24%', raw: '24%' },
        { key: isEn ? 'D' : 'Δ', label: '76%', raw: '76%' }
      ],
      correctRaw: '24%',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. The missed shots are: 25 － 19 ＝ <strong>6 shots</strong>.</p>
          <p>2. Calculate the percentage of missed shots:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">Percentage ＝ <Frac num="6" den="25" /></span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＝ <Frac num="24" den="100" /></span>
            <span className="whitespace-nowrap">＝ <strong className="text-emerald-700 text-base">24%</strong></span>
          </div>
          <p className="pt-1">Thus, the percentage of missed shots was <strong>24%</strong> (Choice <strong>C</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Οι άστοχες βολές είναι: 25 － 19 ＝ <strong>6 βολές</strong>.</p>
          <p>2. Υπολογίζουμε το ποσοστό των άστοχων βολών:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">Ποσοστό ＝ <Frac num="6" den="25" /></span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＝ <Frac num="24" den="100" /></span>
            <span className="whitespace-nowrap">＝ <strong className="text-emerald-700 text-base">24%</strong></span>
          </div>
          <p className="pt-1">Άρα, το ποσοστό των άστοχων βολών ήταν <strong>24%</strong> (Επιλογή <strong>Γ</strong>).</p>
        </div>
      )
    },
    {
      id: 8,
      officialNumber: 33,
      group: groupA,
      promptText: isEn ? (
        <span>
          Stelios makes 2 servings of his favorite fruit salad using <Frac num="3" den="4" /> of a kilogram of apples. How many grams of apples should he use to make one serving of his favorite fruit salad?
        </span>
      ) : (
        <span>
          Ο Στέλιος φτιάχνει 2 μερίδες από την αγαπημένη του φρουτοσαλάτα χρησιμοποιώντας <Frac num="3" den="4" /> του κιλού μήλα. Πόσα γραμμάρια μήλα πρέπει να χρησιμοποιήσει για να φτιάξει μια μερίδα από την αγαπημένη του φρουτοσαλάτα;
        </span>
      ),
      options: isEn
        ? [
            { key: 'A', label: '250 grams', raw: '250 grams' },
            { key: 'B', label: '345 grams', raw: '345 grams' },
            { key: 'C', label: '375 grams', raw: '375 grams' },
            { key: 'D', label: '750 grams', raw: '750 grams' }
          ]
        : [
            { key: 'A', label: '250 γραμμάρια', raw: '250 γραμμάρια' },
            { key: 'B', label: '345 γραμμάρια', raw: '345 γραμμάρια' },
            { key: 'Γ', label: '375 γραμμάρια', raw: '375 γραμμάρια' },
            { key: 'Δ', label: '750 γραμμάρια', raw: '750 γραμμάρια' }
          ],
      correctRaw: isEn ? '375 grams' : '375 γραμμάρια',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            1. Convert <Frac num="3" den="4" /> of a kilogram into grams (1 kg = 1,000 g):
          </p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap"><Frac num="3" den="4" /> · 1,000 g</span>
            <span>＝ <strong>750 grams</strong> for 2 servings.</span>
          </div>
          <p>2. For one serving, half of that amount is needed:</p>
          <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 inline-flex items-center gap-1.5 whitespace-nowrap">
            <Frac num="750" den="2" />
            <span>＝ <strong className="text-emerald-700 text-base">375 grams</strong></span>
          </div>
          <p className="pt-1">Therefore, he will use <strong>375 grams</strong> (Choice <strong>C</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            1. Μετατρέπουμε τα <Frac num="3" den="4" /> του κιλού σε γραμμάρια (1 κιλό = 1.000 γρ.):
          </p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap"><Frac num="3" den="4" /> · 1.000 γρ.</span>
            <span>＝ <strong>750 γραμμάρια</strong> για 2 μερίδες.</span>
          </div>
          <p>2. Για μία μερίδα απαιτούνται τα μισά:</p>
          <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 inline-flex items-center gap-1.5 whitespace-nowrap">
            <Frac num="750" den="2" />
            <span>＝ <strong className="text-emerald-700 text-base">375 γραμμάρια</strong></span>
          </div>
          <p className="pt-1">Συνεπώς, θα χρησιμοποιήσει <strong>375 γραμμάρια</strong> (Επιλογή <strong>Γ</strong>).</p>
        </div>
      )
    },
    {
      id: 9,
      officialNumber: 34,
      group: groupA,
      promptText: isEn
        ? 'The bar chart below shows the responses of elementary school children in a survey about their favorite free-time activity. What percentage of the children answered that their favorite activity is music?'
        : 'Το παρακάτω ραβδόγραμμα δείχνει τον αριθμό των απαντήσεων των παιδιών ενός Δημοτικού Σχολείου σε μια έρευνα που έγινε με θέμα την αγαπημένη ενασχόλησή τους στον ελεύθερο χρόνο τους. Τι ποσοστό των παιδιών απάντησαν ότι η αγαπημένη τους ενασχόληση είναι η μουσική;',
      hasSvg: 'freeTimeChart34',
      options: [
        { key: 'A', label: '10%', raw: '10%' },
        { key: 'B', label: '25%', raw: '25%' },
        { key: isEn ? 'C' : 'Γ', label: '20%', raw: '20%' },
        { key: isEn ? 'D' : 'Δ', label: '80%', raw: '80%' }
      ],
      correctRaw: '25%',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Calculate the total number of children from all bars:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            30 (Video games) ＋ 20 (Playing with friends) ＋ 20 (Music) ＋ 10 (Literature) ＝ <strong>80 children</strong>
          </div>
          <p>2. The percentage for music (20 children) is:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <Frac num="20" den="80" />
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＝ <Frac num="1" den="4" /></span>
            <span className="whitespace-nowrap">＝ <strong className="text-emerald-700 text-base">25%</strong></span>
          </div>
          <p className="pt-1">Thus, the percentage is <strong>25%</strong> (Choice <strong>B</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Υπολογίζουμε το σύνολο όλων των παιδιών από τις στήλες:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            30 (Ηλεκτρονικά) ＋ 20 (Παιχνίδι) ＋ 20 (Μουσική) ＋ 10 (Λογοτεχνία) ＝ <strong>80 παιδιά</strong>
          </div>
          <p>2. Το ποσοστό για τη μουσική (20 παιδιά) είναι:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <Frac num="20" den="80" />
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＝ <Frac num="1" den="4" /></span>
            <span className="whitespace-nowrap">＝ <strong className="text-emerald-700 text-base">25%</strong></span>
          </div>
          <p className="pt-1">Άρα, το ποσοστό είναι <strong>25%</strong> (Επιλογή <strong>B</strong>).</p>
        </div>
      )
    },
    {
      id: 10,
      officialNumber: 35,
      group: groupA,
      promptText: isEn
        ? 'Afroditi is an artistic gymnast. At last year’s national championships, the judges gave her the following scores in the vault event. Which judge gave her a score that differs the most from her average score?'
        : 'Η Αφροδίτη είναι αθλήτρια ενόργανης γυμναστικής. Στους περσινούς πανελλήνιους αγώνες οι κριτές της έδωσαν στο άθλημα του άλματος τις παρακάτω βαθμολογίες. Ποιος κριτής της έδωσε βαθμολογία που διαφέρει περισσότερο από το μέσο όρο της βαθμολογίας της;',
      hasTable: 'judgesTable35',
      options: isEn
        ? [
            { key: 'A', label: 'Judge 1', raw: 'Judge 1' },
            { key: 'B', label: 'Judge 2', raw: 'Judge 2' },
            { key: 'C', label: 'Judge 3', raw: 'Judge 3' },
            { key: 'D', label: 'Judge 4', raw: 'Judge 4' }
          ]
        : [
            { key: 'A', label: '1ος κριτής', raw: '1ος κριτής' },
            { key: 'B', label: '2ος κριτής', raw: '2ος κριτής' },
            { key: 'Γ', label: '3ος κριτής', raw: '3ος κριτής' },
            { key: 'Δ', label: '4ος κριτής', raw: '4ος κριτής' }
          ],
      correctRaw: isEn ? 'Judge 3' : '3ος κριτής',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Calculate the average of the 4 scores:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span>Average ＝</span>
            <Frac num="9 ＋ 8.8 ＋ 8.2 ＋ 9.2" den="4" />
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＝ <Frac num="35.2" den="4" /></span>
            <span className="whitespace-nowrap">＝ <strong>8.8</strong></span>
          </div>
          <p>2. Find the difference of each score from 8.8:</p>
          <div className="space-y-1 bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            <div>• Judge 1: |9 － 8.8| ＝ 0.2</div>
            <div>• Judge 2: |8.8 － 8.8| ＝ 0</div>
            <div>• Judge 3: |8.2 － 8.8| ＝ <strong className="text-emerald-700">0.6</strong> (largest difference)</div>
            <div>• Judge 4: |9.2 － 8.8| ＝ 0.4</div>
          </div>
          <p className="pt-1">Therefore, the score that differs the most is from <strong>Judge 3</strong> (Choice <strong>C</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Υπολογίζουμε τον μέσο όρο των 4 βαθμολογιών:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span>Μέσος Όρος ＝</span>
            <Frac num="9 ＋ 8,8 ＋ 8,2 ＋ 9,2" den="4" />
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＝ <Frac num="35,2" den="4" /></span>
            <span className="whitespace-nowrap">＝ <strong>8,8</strong></span>
          </div>
          <p>2. Εξετάζουμε τη διαφορά κάθε βαθμολογίας από το 8,8:</p>
          <div className="space-y-1 bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            <div>• 1ος κριτής: |9 － 8,8| ＝ 0,2</div>
            <div>• 2ος κριτής: |8,8 － 8,8| ＝ 0</div>
            <div>• 3ος κριτής: |8,2 － 8,8| ＝ <strong className="text-emerald-700">0,6</strong> (μέγιστη διαφορά)</div>
            <div>• 4ος κριτής: |9,2 － 8,8| ＝ 0,4</div>
          </div>
          <p className="pt-1">Επομένως, διαφέρει περισσότερο η βαθμολογία του <strong>3ου κριτή</strong> (Επιλογή <strong>Γ</strong>).</p>
        </div>
      )
    },
    {
      id: 11,
      officialNumber: 36,
      group: groupB,
      promptText: isEn
        ? 'The 6th-grade students asked their school principal to install rubber safety flooring in the schoolyard below the square-shaped garden so they wouldn’t get injured. The principal asked them to calculate the cost, informing them that the flooring costs 10 euros per sq. m., and gave them the yard diagram below. How much will the flooring cost?'
        : 'Τα παιδιά της Στ τάξης ζήτησαν από το Διευθυντή του σχολείου τους, για να μην τραυματίζονται, να τοποθετήσει ελαστικό τάπητα στην αυλή κάτω από τον κήπο σχήματος τετραγώνου. Ο Διευθυντής τους ζήτησε να υπολογίσουν πόσο θα κοστίσει. Τους ενημέρωσε ότι η τιμή του τάπητα είναι 10 ευρώ το τ.μ. και τους έδωσε το παρακάτω σχεδιάγραμμα της αυλής. Πόσο θα κοστίσει ο τάπητας;',
      hasSvg: 'yardPlan36',
      options: isEn
        ? [
            { key: 'A', label: '240 euros', raw: '240 euros' },
            { key: 'B', label: '420 euros', raw: '420 euros' },
            { key: 'C', label: '600 euros', raw: '600 euros' },
            { key: 'D', label: '960 euros', raw: '960 euros' }
          ]
        : [
            { key: 'A', label: '240 ευρώ', raw: '240 ευρώ' },
            { key: 'B', label: '420 ευρώ', raw: '420 ευρώ' },
            { key: 'Γ', label: '600 ευρώ', raw: '600 ευρώ' },
            { key: 'Δ', label: '960 ευρώ', raw: '960 ευρώ' }
          ],
      correctRaw: isEn ? '420 euros' : '420 ευρώ',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            1. <strong>Dimensions of garden and yard:</strong><br />
            - The total horizontal length of the yard is 12 m. The two side sections are 3 m and 3 m, so the side of the square garden is: 12 － 3 － 3 ＝ <strong>6 m</strong>.<br />
            - Area of the entire yard rectangle (before subtracting the garden cutout): 12 m · 5 m ＝ 60 sq. m.
          </p>
          <p>
            2. The square garden has a total height of 6 m and extends into the yard by: 6 m － 3 m ＝ <strong>3 m</strong>.<br />
            So the part of the garden inside the yard is a rectangle of 6 m × 3 m with area: 6 · 3 ＝ <strong>18 sq. m.</strong>
          </p>
          <p>3. Net yard area for flooring: 60 － 18 ＝ <strong>42 sq. m.</strong></p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            Cost ＝ 42 sq. m. · 10 €/sq. m. ＝ <strong className="text-emerald-700 text-base">420 euros</strong>
          </div>
          <p className="pt-1">Thus, the flooring will cost <strong>420 euros</strong> (Choice <strong>B</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            1. <strong>Διαστάσεις κήπου και αυλής:</strong><br />
            - Το συνολικό οριζόντιο μήκος της αυλής είναι 12 μ. Τα δύο πλαϊνά τμήματα είναι 3 μ. και 3 μ., άρα η πλευρά του τετράγωνου κήπου είναι: 12 － 3 － 3 ＝ <strong>6 μ.</strong><br />
            - Εμβαδόν ολόκληρου του ορθογωνίου της αυλής (πριν αφαιρεθεί το κομμάτι του κήπου): 12 μ. · 5 μ. ＝ 60 τ.μ.
          </p>
          <p>
            2. Ο κήπος έχει συνολικό ύψος 6 μ. και εισχωρεί στην αυλή κατά: 6 μ. － 3 μ. ＝ <strong>3 μ.</strong><br />
            Άρα το μέρος του κήπου που βρίσκεται μέσα στην αυλή είναι ένα ορθογώνιο διαστάσεων 6 μ. × 3 μ. με εμβαδόν: 6 · 3 ＝ <strong>18 τ.μ.</strong>
          </p>
          <p>3. Καθαρό εμβαδόν αυλής για τάπητα: 60 － 18 ＝ <strong>42 τ.μ.</strong></p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            Κόστος ＝ 42 τ.μ. · 10 €/τ.μ. ＝ <strong className="text-emerald-700 text-base">420 ευρώ</strong>
          </div>
          <p className="pt-1">Άρα, ο τάπητας θα κοστίσει <strong>420 ευρώ</strong> (Επιλογή <strong>B</strong>).</p>
        </div>
      )
    },
    {
      id: 12,
      officialNumber: 37,
      group: groupB,
      promptText: isEn ? (
        <span>
          Our neighbor made 5 kilograms of orange marmalade and wants to put it into jars. If each jar holds <Frac num="2" den="10" /> of a kilogram of marmalade, how many jars will she need?
        </span>
      ) : (
        <span>
          Η γειτόνισσά μας έφτιαξε 5 κιλά μαρμελάδα πορτοκάλι και θέλει να την τοποθετήσει σε βαζάκια. Αν το κάθε βαζάκι χωράει <Frac num="2" den="10" /> του κιλού μαρμελάδα, πόσα βαζάκια θα χρειαστεί;
        </span>
      ),
      options: isEn
        ? [
            { key: 'A', label: '25 jars', raw: '25 jars' },
            { key: 'B', label: '20 jars', raw: '20 jars' },
            { key: 'C', label: '1 jar', raw: '1 jar' },
            { key: 'D', label: '50 jars', raw: '50 jars' }
          ]
        : [
            { key: 'A', label: '25 βαζάκια', raw: '25 βαζάκια' },
            { key: 'B', label: '20 βαζάκια', raw: '20 βαζάκια' },
            { key: 'Γ', label: '1 βαζάκι', raw: '1 βαζάκι' },
            { key: 'Δ', label: '50 βαζάκια', raw: '50 βαζάκια' }
          ],
      correctRaw: isEn ? '25 jars' : '25 βαζάκια',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Divide the total quantity by the capacity of one jar:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <ComplexFrac num="5" den={<Frac num="2" den="10" small />} />
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＝ 5 · <Frac num="10" den="2" /></span>
            <span className="whitespace-nowrap">＝ 5 · 5 ＝ <strong className="text-emerald-700 text-base">25 jars</strong></span>
          </div>
          <p className="pt-1">Therefore, she will need <strong>25 jars</strong> (Choice <strong>A</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Διαιρούμε τη συνολική ποσότητα με τη χωρητικότητα του ενός βάζου:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <ComplexFrac num="5" den={<Frac num="2" den="10" small />} />
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＝ 5 · <Frac num="10" den="2" /></span>
            <span className="whitespace-nowrap">＝ 5 · 5 ＝ <strong className="text-emerald-700 text-base">25 βαζάκια</strong></span>
          </div>
          <p className="pt-1">Συνεπώς, θα χρειαστεί <strong>25 βαζάκια</strong> (Επιλογή <strong>A</strong>).</p>
        </div>
      )
    },
    {
      id: 13,
      officialNumber: 38,
      group: groupB,
      promptText: isEn
        ? 'Last year, a school had 300 students. This year, the number of students increased by 8%. How many students does the school have this year?'
        : 'Οι μαθητές ενός σχολείου πέρυσι ήταν 300. Φέτος ο αριθμός τους αυξήθηκε κατά 8%. Πόσους μαθητές έχει φέτος το σχολείο;',
      options: [
        { key: 'A', label: '320', raw: '320' },
        { key: 'B', label: '324', raw: '324' },
        { key: isEn ? 'C' : 'Γ', label: '290', raw: '290' },
        { key: isEn ? 'D' : 'Δ', label: '342', raw: '342' }
      ],
      correctRaw: '324',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Calculate the increase in students:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            8% · 300 ＝ 0.08 · 300 ＝ <strong>24 students</strong>
          </div>
          <p>2. Add to the original number:</p>
          <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            300 ＋ 24 ＝ <strong className="text-emerald-700 text-base">324 students</strong>
          </div>
          <p className="pt-1">Thus, the school has <strong>324</strong> students this year (Choice <strong>B</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Υπολογίζουμε την αύξηση των μαθητών:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            8% · 300 ＝ 0,08 · 300 ＝ <strong>24 μαθητές</strong>
          </div>
          <p>2. Προσθέτουμε στον αρχικό αριθμό:</p>
          <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            300 ＋ 24 ＝ <strong className="text-emerald-700 text-base">324 μαθητές</strong>
          </div>
          <p className="pt-1">Άρα, φέτος το σχολείο έχει <strong>324</strong> μαθητές (Επιλογή <strong>B</strong>).</p>
        </div>
      )
    },
    {
      id: 14,
      officialNumber: 39,
      group: groupB,
      promptText: isEn
        ? 'At a company, 3 employees need 18 days to complete a project. In how many days will they complete the project if 9 employees work on it?'
        : 'Σε μια εταιρεία 3 υπάλληλοι χρειάζονται 18 ημέρες για να ολοκληρώσουν μια εργασία. Σε πόσες ημέρες θα ολοκληρώσουν την εργασία αν εργαστούν 9 υπάλληλοι;',
      options: isEn
        ? [
            { key: 'A', label: 'in 54 days', raw: 'in 54 days' },
            { key: 'B', label: 'in 6 days', raw: 'in 6 days' },
            { key: 'C', label: 'in 27 days', raw: 'in 27 days' },
            { key: 'D', label: 'in 3 days', raw: 'in 3 days' }
          ]
        : [
            { key: 'A', label: 'σε 54 ημέρες', raw: 'σε 54 ημέρες' },
            { key: 'B', label: 'σε 6 ημέρες', raw: 'σε 6 ημέρες' },
            { key: 'Γ', label: 'σε 27 ημέρες', raw: 'σε 27 ημέρες' },
            { key: 'Δ', label: 'σε 3 ημέρες', raw: 'σε 3 ημέρες' }
          ],
      correctRaw: isEn ? 'in 6 days' : 'σε 6 ημέρες',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>The quantities (employees and days) are <strong>inversely proportional</strong>:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>• The product is constant: 3 employees · 18 days ＝ <strong>54 person-days</strong></div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• For 9 employees:</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="54" den="9" /> ＝ <strong className="text-emerald-700 text-base">6 days</strong>
              </span>
            </div>
          </div>
          <p className="pt-1">Therefore, they will complete the project <strong>in 6 days</strong> (Choice <strong>B</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Τα ποσά (υπάλληλοι και ημέρες) είναι <strong>αντιστρόφως ανάλογα</strong>:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>• Το γινόμενο είναι σταθερό: 3 υπάλληλοι · 18 ημέρες ＝ <strong>54 ανθρωποημέρες</strong></div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Για 9 υπαλλήλους:</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="54" den="9" /> ＝ <strong className="text-emerald-700 text-base">6 ημέρες</strong>
              </span>
            </div>
          </div>
          <p className="pt-1">Επομένως, θα ολοκληρώσουν την εργασία <strong>σε 6 ημέρες</strong> (Επιλογή <strong>B</strong>).</p>
        </div>
      )
    },
    {
      id: 15,
      officialNumber: 40,
      group: groupB,
      promptText: isEn
        ? 'Six friends ordered: 3 pizzas costing 6 euros each, 6 pasta dishes costing 3.90 euros each, and 6 juices costing 1.20 euros each. How much will each person pay if they split the bill equally?'
        : 'Έξι φίλοι παράγγειλαν: 3 πίτσες που η καθεμιά κόστιζε 6 ευρώ, 6 μακαρονάδες που η καθεμιά κόστιζε 3,90 ευρώ και 6 χυμούς που κόστιζε ο καθένας 1,20 ευρώ. Πόσα χρήματα θα πληρώσει ο καθένας αν μοιραστούν τον λογαριασμό;',
      options: isEn
        ? [
            { key: 'A', label: '8.1 €', raw: '8.1 €' },
            { key: 'B', label: '36', raw: '36' },
            { key: 'C', label: '6.9', raw: '6.9' },
            { key: 'D', label: '7 €', raw: '7 €' }
          ]
        : [
            { key: 'A', label: '8,1 €', raw: '8,1 €' },
            { key: 'B', label: '36', raw: '36' },
            { key: 'Γ', label: '6,9', raw: '6,9' },
            { key: 'Δ', label: '7 €', raw: '7 €' }
          ],
      correctRaw: isEn ? '8.1 €' : '8,1 €',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Calculate the total cost:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
            <div>• 3 pizzas: 3 · 6 € ＝ 18 €</div>
            <div>• 6 pasta dishes: 6 · 3.90 € ＝ 23.40 €</div>
            <div>• 6 juices: 6 · 1.20 € ＝ 7.20 €</div>
            <div className="pt-1 font-bold">Total bill ＝ 18 ＋ 23.40 ＋ 7.20 ＝ 48.60 €</div>
          </div>
          <p>2. Divide equally among 6 friends:</p>
          <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 inline-flex items-center gap-1.5 whitespace-nowrap">
            <Frac num="48.60 €" den="6" />
            <span>＝ <strong className="text-emerald-700 text-base">8.10 €</strong></span>
          </div>
          <p className="pt-1">Thus, each person will pay <strong>8.1 €</strong> (Choice <strong>A</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Υπολογίζουμε το συνολικό κόστος:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
            <div>• 3 πίτσες: 3 · 6 € ＝ 18 €</div>
            <div>• 6 μακαρονάδες: 6 · 3,90 € ＝ 23,40 €</div>
            <div>• 6 χυμοί: 6 · 1,20 € ＝ 7,20 €</div>
            <div className="pt-1 font-bold">Σύνολο λογαριασμού ＝ 18 ＋ 23,40 ＋ 7,20 ＝ 48,60 €</div>
          </div>
          <p>2. Διαιρούμε ισόποσα διά 6:</p>
          <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 inline-flex items-center gap-1.5 whitespace-nowrap">
            <Frac num="48,60 €" den="6" />
            <span>＝ <strong className="text-emerald-700 text-base">8,10 €</strong></span>
          </div>
          <p className="pt-1">Άρα, ο καθένας θα πληρώσει <strong>8,1 €</strong> (Επιλογή <strong>A</strong>).</p>
        </div>
      )
    },
    {
      id: 16,
      officialNumber: 41,
      group: groupB,
      promptText: isEn ? (
        <span>
          With 1<Frac num="1" den="2" /> liters of milk, how many glasses of <Frac num="1" den="4" /> liter can we fill?
        </span>
      ) : (
        <span>
          Με 1<Frac num="1" den="2" /> λίτρα γάλα πόσα ποτήρια του <Frac num="1" den="4" /> λίτρου γεμίζουμε;
        </span>
      ),
      options: isEn
        ? [
            { key: 'A', label: '4 glasses', raw: '4 glasses' },
            { key: 'B', label: '6 glasses', raw: '6 glasses' },
            { key: 'C', label: <span>4<Frac num="1" den="4" /> glasses</span>, raw: '4 1/4 glasses' },
            { key: 'D', label: '5 glasses', raw: '5 glasses' }
          ]
        : [
            { key: 'A', label: '4 ποτήρια', raw: '4 ποτήρια' },
            { key: 'B', label: '6 ποτήρια', raw: '6 ποτήρια' },
            { key: 'Γ', label: <span>4<Frac num="1" den="4" /> ποτήρια</span>, raw: '4 1/4 ποτήρια' },
            { key: 'Δ', label: '5 ποτήρια', raw: '5 ποτήρια' }
          ],
      correctRaw: isEn ? '6 glasses' : '6 ποτήρια',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Convert the mixed number into an improper fraction:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            1<Frac num="1" den="2" /> ＝ <Frac num="3" den="2" /> liters.
          </div>
          <p>
            2. Divide by <Frac num="1" den="4" /> of a liter:
          </p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <ComplexFrac
              num={<Frac num="3" den="2" small />}
              den={<Frac num="1" den="4" small />}
            />
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＝ <Frac num="3" den="2" /> · 4</span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＝ <Frac num="12" den="2" /></span>
            <span className="whitespace-nowrap">＝ <strong className="text-emerald-700 text-base">6 glasses</strong></span>
          </div>
          <p className="pt-1">Therefore, we can fill <strong>6 glasses</strong> (Choice <strong>B</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Μετατρέπουμε τον μεικτό αριθμό σε κλάσμα:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            1<Frac num="1" den="2" /> ＝ <Frac num="3" den="2" /> λίτρα.
          </div>
          <p>
            2. Διαιρούμε με το <Frac num="1" den="4" /> του λίτρου:
          </p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <ComplexFrac
              num={<Frac num="3" den="2" small />}
              den={<Frac num="1" den="4" small />}
            />
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＝ <Frac num="3" den="2" /> · 4</span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＝ <Frac num="12" den="2" /></span>
            <span className="whitespace-nowrap">＝ <strong className="text-emerald-700 text-base">6 ποτήρια</strong></span>
          </div>
          <p className="pt-1">Επομένως, γεμίζουμε <strong>6 ποτήρια</strong> (Επιλογή <strong>B</strong>).</p>
        </div>
      )
    },
    {
      id: 17,
      officialNumber: 42,
      group: groupB,
      promptText: isEn ? (
        <span>
          Several children took part in a running race. In the first ten minutes, Maria had covered <Frac num="9" den="10" /> of the course, Christos <Frac num="7" den="8" />, Katerina <Frac num="19" den="20" />, and Petros <Frac num="4" den="5" />. Put the children in order starting from the one who covered the greatest distance.
        </span>
      ) : (
        <span>
          Μερικά παιδιά έλαβαν μέρος σε έναν αγώνα δρόμου. Στο πρώτο δεκάλεπτο η Μαρία είχε διανύσει τα <Frac num="9" den="10" /> της διαδρομής, ο Χρήστος τα <Frac num="7" den="8" />, η Κατερίνα τα <Frac num="19" den="20" /> και ο Πέτρος τα <Frac num="4" den="5" />. Βάλε τα παιδιά στη σειρά ξεκινώντας από αυτό που διένυσε τη μεγαλύτερη απόσταση.
        </span>
      ),
      options: isEn
        ? [
            { key: 'A', label: 'Maria, Katerina, Petros, Christos', raw: 'Maria, Katerina, Petros, Christos' },
            { key: 'B', label: 'Petros, Katerina, Maria, Christos', raw: 'Petros, Katerina, Maria, Christos' },
            { key: 'C', label: 'Katerina, Maria, Petros, Christos', raw: 'Katerina, Maria, Petros, Christos' },
            { key: 'D', label: 'Katerina, Maria, Christos, Petros', raw: 'Katerina, Maria, Christos, Petros' }
          ]
        : [
            { key: 'A', label: 'Μαρία, Κατερίνα, Πέτρος, Χρήστος', raw: 'Μαρία, Κατερίνα, Πέτρος, Χρήστος' },
            { key: 'B', label: 'Πέτρος, Κατερίνα, Μαρία, Χρήστος', raw: 'Πέτρος, Κατερίνα, Μαρία, Χρήστος' },
            { key: 'Γ', label: 'Κατερίνα, Μαρία, Πέτρος, Χρήστος', raw: 'Κατερίνα, Μαρία, Πέτρος, Χρήστος' },
            { key: 'Δ', label: 'Κατερίνα, Μαρία, Χρήστος, Πέτρος', raw: 'Κατερίνα, Μαρία, Χρήστος, Πέτρος' }
          ],
      correctRaw: isEn ? 'Katerina, Maria, Christos, Petros' : 'Κατερίνα, Μαρία, Χρήστος, Πέτρος',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Convert the fractions into decimal numbers:</p>
          <div className="space-y-2 bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Katerina:</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="19" den="20" /> ＝ <strong>0.950</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Maria:</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="9" den="10" /> ＝ <strong>0.900</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Christos:</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="7" den="8" /> ＝ <strong>0.875</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Petros:</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="4" den="5" /> ＝ <strong>0.800</strong>
              </span>
            </div>
          </div>
          <p>Comparing in descending order: 0.950 &gt; 0.900 &gt; 0.875 &gt; 0.800.</p>
          <p className="pt-1 font-bold text-emerald-800">Order: Katerina, Maria, Christos, Petros (Choice D).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Μετατρέπουμε τα κλάσματα σε δεκαδικούς αριθμούς:</p>
          <div className="space-y-2 bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Κατερίνα:</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="19" den="20" /> ＝ <strong>0,950</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Μαρία:</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="9" den="10" /> ＝ <strong>0,900</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Χρήστος:</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="7" den="8" /> ＝ <strong>0,875</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Πέτρος:</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="4" den="5" /> ＝ <strong>0,800</strong>
              </span>
            </div>
          </div>
          <p>Συγκρίνοντας σε φθίνουσα σειρά: 0,950 &gt; 0,900 &gt; 0,875 &gt; 0,800.</p>
          <p className="pt-1 font-bold text-emerald-800">Σειρά: Κατερίνα, Μαρία, Χρήστος, Πέτρος (Επιλογή Δ).</p>
        </div>
      )
    },
    {
      id: 18,
      officialNumber: 43,
      group: groupB,
      promptText: isEn
        ? 'Out of 250 students at a school, 40% travel by bus, 38% by car, and the rest walk to school. How many children walk to school?'
        : 'Από τους 250 μαθητές ενός σχολείου το 40% μετακινείται με λεωφορείο, το 38% με αυτοκίνητο και οι υπόλοιποι με τα πόδια. Πόσα παιδιά έρχονται με τα πόδια στο σχολείο;',
      options: [
        { key: 'A', label: '195', raw: '195' },
        { key: 'B', label: '25', raw: '25' },
        { key: isEn ? 'C' : 'Γ', label: '55', raw: '55' },
        { key: isEn ? 'D' : 'Δ', label: '95', raw: '95' }
      ],
      correctRaw: '55',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Find the percentage of students who walk to school:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            100% － (40% ＋ 38%) ＝ 100% － 78% ＝ <strong>22%</strong>
          </div>
          <p>2. Calculate the number of children:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            250 · 0.22 ＝ <strong className="text-emerald-700 text-base">55 children</strong>
          </div>
          <p className="pt-1">Thus, <strong>55</strong> children walk to school (Choice <strong>C</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Βρίσκουμε το ποσοστό των μαθητών που έρχονται με τα πόδια:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            100% － (40% ＋ 38%) ＝ 100% － 78% ＝ <strong>22%</strong>
          </div>
          <p>2. Υπολογίζουμε το πλήθος των παιδιών:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            250 · 0,22 ＝ <strong className="text-emerald-700 text-base">55 παιδιά</strong>
          </div>
          <p className="pt-1">Άρα, με τα πόδια έρχονται <strong>55</strong> παιδιά (Επιλογή <strong>Γ</strong>).</p>
        </div>
      )
    },
    {
      id: 19,
      officialNumber: 44,
      group: groupB,
      promptText: isEn
        ? 'The area of a square is 81 sq. cm. A rectangle has the same perimeter as the square. The length of the rectangle is twice its width. What is the area of the rectangle?'
        : 'Το εμβαδόν ενός τετραγώνου είναι 81 τ.εκ. Ένα ορθογώνιο έχει την ίδια περίμετρο με το τετράγωνο. Το μήκος του ορθογωνίου είναι διπλάσιο από το πλάτος του. Πόσο είναι το εμβαδόν του ορθογωνίου;',
      options: isEn
        ? [
            { key: 'A', label: '36 sq. cm.', raw: '36 sq. cm.' },
            { key: 'B', label: '6 sq. cm.', raw: '6 sq. cm.' },
            { key: 'C', label: '18 sq. cm.', raw: '18 sq. cm.' },
            { key: 'D', label: '72 sq. cm.', raw: '72 sq. cm.' }
          ]
        : [
            { key: 'A', label: '36 τ.εκ.', raw: '36 τ.εκ.' },
            { key: 'B', label: '6 τ.εκ.', raw: '6 τ.εκ.' },
            { key: 'Γ', label: '18 τ.εκ', raw: '18 τ.εκ' },
            { key: 'Δ', label: '72 τ.εκ.', raw: '72 τ.εκ.' }
          ],
      correctRaw: isEn ? '72 sq. cm.' : '72 τ.εκ.',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="space-y-1.5">
            <p className="font-bold">1. Square:</p>
            <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="whitespace-nowrap">• Side s ＝ <Radical>81</Radical></span>
                <span className="whitespace-nowrap">＝ 9 cm</span>
              </div>
              <div>• Perimeter P ＝ 4 · 9 ＝ <strong>36 cm</strong></div>
            </div>
          </div>
          <div className="space-y-1.5">
            <p className="font-bold">2. Rectangle:</p>
            <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
              <div>• Let width be <strong>x</strong> and length be <strong>2x</strong>.</div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>• Perimeter: 2 · (x ＋ 2x) ＝ 6x ＝ 36</span>
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                  ➔ x ＝ <Frac num="36" den="6" /> ＝ <strong>6 cm</strong>
                </span>
                <span>(width), length ＝ 2 · 6 ＝ <strong>12 cm</strong>.</span>
              </div>
            </div>
          </div>
          <p>3. <strong>Area of rectangle:</strong></p>
          <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            A ＝ 12 · 6 ＝ <strong className="text-emerald-700 text-base">72 sq. cm.</strong>
          </div>
          <p className="pt-1">Therefore, the area is <strong>72 sq. cm.</strong> (Choice <strong>D</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="space-y-1.5">
            <p className="font-bold">1. Τετράγωνο:</p>
            <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="whitespace-nowrap">• Πλευρά α ＝ <Radical>81</Radical></span>
                <span className="whitespace-nowrap">＝ 9 εκ.</span>
              </div>
              <div>• Περίμετρος Π ＝ 4 · 9 ＝ <strong>36 εκ.</strong></div>
            </div>
          </div>
          <div className="space-y-1.5">
            <p className="font-bold">2. Ορθογώνιο:</p>
            <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
              <div>• Έστω πλάτος <strong>x</strong> και μήκος <strong>2x</strong>.</div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>• Περίμετρος: 2 · (x ＋ 2x) ＝ 6x ＝ 36</span>
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                  ➔ x ＝ <Frac num="36" den="6" /> ＝ <strong>6 εκ.</strong>
                </span>
                <span>(πλάτος) και μήκος ＝ 2 · 6 ＝ <strong>12 εκ.</strong></span>
              </div>
            </div>
          </div>
          <p>3. <strong>Εμβαδόν ορθογωνίου:</strong></p>
          <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            Ε ＝ 12 · 6 ＝ <strong className="text-emerald-700 text-base">72 τ.εκ.</strong>
          </div>
          <p className="pt-1">Συνεπώς, το εμβαδόν είναι <strong>72 τ.εκ.</strong> (Επιλογή <strong>Δ</strong>).</p>
        </div>
      )
    },
    {
      id: 20,
      officialNumber: 45,
      group: groupB,
      promptText: isEn
        ? 'If we multiply a number by 10, we get a product of 500. What number would we get if we divided the original number by 10?'
        : 'Αν πολλαπλασιάσουμε έναν αριθμό με 10 θα πάρουμε γινόμενο 500. Ποιον αριθμό θα παίρναμε αν διαιρούσαμε τον αρχικό αριθμό με το 10;',
      options: [
        { key: 'A', label: isEn ? '0.5' : '0,5', raw: isEn ? '0.5' : '0,5' },
        { key: 'B', label: '5', raw: '5' },
        { key: isEn ? 'C' : 'Γ', label: '50', raw: '50' },
        { key: isEn ? 'D' : 'Δ', label: '500', raw: '500' }
      ],
      correctRaw: '5',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Find the original number:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span>Number · 10 ＝ 500</span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ➔ Number ＝ <Frac num="500" den="10" /> ＝ <strong>50</strong>
            </span>
          </div>
          <p>2. Divide the original number by 10:</p>
          <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 inline-flex items-center gap-1.5 whitespace-nowrap">
            <Frac num="50" den="10" />
            <span>＝ <strong className="text-emerald-700 text-base">5</strong></span>
          </div>
          <p className="pt-1">Therefore, we would get <strong>5</strong> (Choice <strong>B</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Βρίσκουμε τον αρχικό αριθμό:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span>Αριθμός · 10 ＝ 500</span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ➔ Αριθμός ＝ <Frac num="500" den="10" /> ＝ <strong>50</strong>
            </span>
          </div>
          <p>2. Διαιρούμε τον αριθμό με το 10:</p>
          <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 inline-flex items-center gap-1.5 whitespace-nowrap">
            <Frac num="50" den="10" />
            <span>＝ <strong className="text-emerald-700 text-base">5</strong></span>
          </div>
          <p className="pt-1">Επομένως, θα παίρναμε το <strong>5</strong> (Επιλογή <strong>B</strong>).</p>
        </div>
      )
    },
    {
      id: 21,
      officialNumber: 46,
      group: groupB,
      promptText: isEn
        ? 'In an English exam, candidates wrote with either a black or blue pen. The pie chart below shows what portion of candidates wrote with a blue pen and what portion wrote with a black pen. Which of the following statements is correct?'
        : 'Σε ένα διαγώνισμα Αγγλικών οι υποψήφιοι έγραφαν με μαύρο ή μπλε στυλό. Το παρακάτω κυκλικό διάγραμμα δείχνει τι μέρος των υποψηφίων έγραφε με μπλε και τι μέρος έγραφε με μαύρο στυλό. Ποια από τις παρακάτω προτάσεις είναι σωστή;',
      hasSvg: 'penPie46',
      options: isEn
        ? [
            { key: 'A', label: 'If 120 candidates wrote with a blue pen, then 30 wrote with a black pen.', raw: 'If 120 candidates wrote with a blue pen, then 30 wrote with a black pen.' },
            { key: 'B', label: 'If 120 candidates wrote with a blue pen, then 40 wrote with a black pen.', raw: 'If 120 candidates wrote with a blue pen, then 40 wrote with a black pen.' },
            { key: 'C', label: 'The candidates writing with a blue pen were 4 times as many as those writing with a black pen.', raw: 'The candidates writing with a blue pen were 4 times as many as those writing with a black pen.' },
            {
              key: 'D',
              label: (
                <span>
                  <Frac num="1" den="3" /> of the candidates wrote with a black pen.
                </span>
              ),
              raw: '1/3 of the candidates wrote with a black pen.'
            }
          ]
        : [
            { key: 'A', label: 'Αν με μπλε στυλό έγραφαν 120 υποψήφιοι, τότε με μαύρο έγραφαν 30 υποψήφιοι.', raw: 'Αν με μπλε στυλό έγραφαν 120 υποψήφιοι, τότε με μαύρο έγραφαν 30 υποψήφιοι.' },
            { key: 'B', label: 'Αν με μπλε στυλό έγραφαν 120 υποψήφιοι, τότε με μαύρο έγραφαν 40 υποψήφιοι.', raw: 'Αν με μπλε στυλό έγραφαν 120 υποψήφιοι, τότε με μαύρο έγραφαν 40 υποψήφιοι.' },
            { key: 'Γ', label: 'Οι υποψήφιοι που έγραφαν με μπλε στυλό ήταν 4 φορές περισσότεροι από τους υποψηφίους που έγραφαν με μαύρο στυλό.', raw: 'Οι υποψήφιοι που έγραφαν με μπλε στυλό ήταν 4 φορές περισσότεροι από τους υποψηφίους που έγραφαν με μαύρο στυλό.' },
            {
              key: 'Δ',
              label: (
                <span>
                  Το <Frac num="1" den="3" /> των υποψηφίων έγραφε με μαύρο στυλό.
                </span>
              ),
              raw: 'Το 1/3 των υποψηφίων έγραφε με μαύρο στυλό.'
            }
          ],
      correctRaw: isEn
        ? 'If 120 candidates wrote with a blue pen, then 40 wrote with a black pen.'
        : 'Αν με μπλε στυλό έγραφαν 120 υποψήφιοι, τότε με μαύρο έγραφαν 40 υποψήφιοι.',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            In the pie chart, blue pen occupies <strong>75%</strong> (<Frac num="3" den="4" />) and black pen occupies the remaining <strong>25%</strong> (<Frac num="1" den="4" />).
          </p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• The ratio of Blue to Black is:</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="75%" den="25%" /> ＝ <strong>3 to 1</strong>
              </span>
              <span>(blue is triple black).</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• If 120 candidates wrote in blue, then in black:</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="120" den="3" /> ＝ <strong className="text-emerald-700">40 candidates</strong>.
              </span>
            </div>
          </div>
          <p className="pt-1">Therefore, statement <strong>B</strong> is correct.</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            Στο κυκλικό διάγραμμα το μπλε στυλό καταλαμβάνει το <strong>75%</strong> (<Frac num="3" den="4" />) και το μαύρο το υπόλοιπο <strong>25%</strong> (<Frac num="1" den="4" />).
          </p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Ο λόγος Μπλε προς Μαύρο είναι:</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="75%" den="25%" /> ＝ <strong>3 προς 1</strong>
              </span>
              <span>(το μπλε είναι τριπλάσιο του μαύρου).</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Αν με μπλε έγραφαν 120 υποψήφιοι, τότε με μαύρο έγραφαν:</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="120" den="3" /> ＝ <strong className="text-emerald-700">40 υποψήφιοι</strong>.
              </span>
            </div>
          </div>
          <p className="pt-1">Συνεπώς, σωστή είναι η πρόταση <strong>B</strong>.</p>
        </div>
      )
    },
    {
      id: 22,
      officialNumber: 47,
      group: groupB,
      promptText: isEn
        ? 'In rectangle AZED, side AD is 19 centimeters. Square BCED has an area of 49 square centimeters. What is the area of the shaded rectangle AZCB?'
        : 'Στο ορθογώνιο ΑΖΕΔ η πλευρά ΑΔ είναι 19 εκατοστά. Το τετράγωνο ΒΓΕΔ έχει εμβαδόν 49 τετραγωνικά εκατοστά. Πόσο είναι το εμβαδόν του γραμμοσκιασμένου ορθογωνίου ΑΖΓΒ;',
      hasSvg: 'rectSquare47',
      options: isEn
        ? [
            { key: 'A', label: '98 sq. cm.', raw: '98 sq. cm.' },
            { key: 'B', label: '121 sq. cm.', raw: '121 sq. cm.' },
            { key: 'C', label: '84 sq. cm.', raw: '84 sq. cm.' },
            { key: 'D', label: '42 sq. cm.', raw: '42 sq. cm.' }
          ]
        : [
            { key: 'A', label: '98 τ.εκ.', raw: '98 τ.εκ.' },
            { key: 'B', label: '121 τ.εκ.', raw: '121 τ.εκ.' },
            { key: 'Γ', label: '84 τ.εκ.', raw: '84 τ.εκ.' },
            { key: 'Δ', label: '42 τ.εκ.', raw: '42 τ.εκ.' }
          ],
      correctRaw: isEn ? '84 sq. cm.' : '84 τ.εκ.',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="space-y-1.5">
            <p className="font-bold">1. Dimensions of square BCED:</p>
            <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
              <span>Area ＝ 49 sq. cm., so its side is:</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                BD ＝ CB ＝ <Radical>49</Radical> ＝ <strong>7 cm</strong>
              </span>
            </div>
          </div>
          <p>
            2. <strong>Dimensions of rectangle AZCB:</strong><br />
            - Base length AB: AD － BD ＝ 19 cm － 7 cm ＝ <strong>12 cm</strong><br />
            - Height CB (shared with the side of the square): <strong>7 cm</strong>
          </p>
          <p>3. <strong>Area of shaded rectangle:</strong></p>
          <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            A ＝ AB · CB ＝ 12 · 7 ＝ <strong className="text-emerald-700 text-base">84 sq. cm.</strong>
          </div>
          <p className="pt-1">Thus, the area is <strong>84 sq. cm.</strong> (Choice <strong>C</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="space-y-1.5">
            <p className="font-bold">1. Διαστάσεις τετραγώνου ΒΓΕΔ:</p>
            <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
              <span>Ε_τετρ ＝ 49 τ.εκ., άρα η πλευρά του είναι:</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                ΒΔ ＝ ΓΒ ＝ <Radical>49</Radical> ＝ <strong>7 εκ.</strong>
              </span>
            </div>
          </div>
          <p>
            2. <strong>Διαστάσεις ορθογωνίου ΑΖΓΒ:</strong><br />
            - Μήκος βάσης ΑΒ: ΑΔ － ΒΔ ＝ 19 εκ. － 7 εκ. ＝ <strong>12 εκ.</strong><br />
            - Ύψος ΓΒ (κοινό με την πλευρά του τετραγώνου): <strong>7 εκ.</strong>
          </p>
          <p>3. <strong>Εμβαδόν γραμμοσκιασμένου:</strong></p>
          <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            Ε ＝ ΑΒ · ΓΒ ＝ 12 · 7 ＝ <strong className="text-emerald-700 text-base">84 τ.εκ.</strong>
          </div>
          <p className="pt-1">Άρα, το εμβαδόν είναι <strong>84 τ.εκ.</strong> (Επιλογή <strong>Γ</strong>).</p>
        </div>
      )
    },
    {
      id: 23,
      officialNumber: 48,
      group: groupB,
      promptText: isEn
        ? 'Christina and her 3 friends shared half a pizza into equal slices. What fraction of the whole pizza did each girl get?'
        : 'Η Χριστίνα και οι 3 φίλες της μοιράστηκαν μισή πίτσα σε ίσα κομμάτια. Τι μέρος της πίτσας πήρε η καθεμία;',
      options: [
        { key: 'A', label: <Frac num="1" den="3" />, raw: '1/3' },
        { key: 'B', label: <Frac num="1" den="4" />, raw: '1/4' },
        { key: isEn ? 'C' : 'Γ', label: <Frac num="1" den="6" />, raw: '1/6' },
        { key: isEn ? 'D' : 'Δ', label: <Frac num="1" den="8" />, raw: '1/8' }
      ],
      correctRaw: '1/8',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. In total there are 4 girls (Christina and her 3 friends: 1 ＋ 3 ＝ 4).</p>
          <p>
            2. They shared half a pizza (<Frac num="1" den="2" />), so each girl received:
          </p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <ComplexFrac
              num={<Frac num="1" den="2" small />}
              den="4"
            />
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＝ <Frac num="1" den="2 · 4" /></span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ＝ <strong className="text-emerald-700 text-base"><Frac num="1" den="8" /></strong>
            </span>
          </div>
          <p className="pt-1">
            Therefore, each girl got <strong><Frac num="1" den="8" /></strong> of the pizza (Choice <strong>D</strong>).
          </p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Συνολικά τα άτομα είναι 4 (η Χριστίνα και οι 3 φίλες της: 1 ＋ 3 ＝ 4).</p>
          <p>
            2. Μοιράστηκαν τη μισή πίτσα (<Frac num="1" den="2" />), άρα η καθεμία πήρε:
          </p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <ComplexFrac
              num={<Frac num="1" den="2" small />}
              den="4"
            />
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＝ <Frac num="1" den="2 · 4" /></span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ＝ <strong className="text-emerald-700 text-base"><Frac num="1" den="8" /></strong>
            </span>
          </div>
          <p className="pt-1">
            Επομένως, πήρε το <strong><Frac num="1" den="8" /></strong> της πίτσας (Επιλογή <strong>Δ</strong>).
          </p>
        </div>
      )
    },
    {
      id: 24,
      officialNumber: 49,
      group: groupB,
      promptText: isEn
        ? 'The students of a 7th-grade class form a single line in the schoolyard. The student standing right in the middle is the fourteenth in line. How many students are in the class?'
        : 'Τα παιδιά ενός τμήματος της Α΄ Γυμνασίου σχηματίζουν μια σειρά στο προαύλιο του σχολείου. Το παιδί που βρίσκεται ακριβώς στη μέση είναι το δέκατο τέταρτο στη σειρά. Πόσα είναι τα παιδιά του τμήματος;',
      options: [
        { key: 'A', label: '27', raw: '27' },
        { key: 'B', label: '28', raw: '28' },
        { key: isEn ? 'C' : 'Γ', label: '29', raw: '29' },
        { key: isEn ? 'D' : 'Δ', label: '30', raw: '30' }
      ],
      correctRaw: '27',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Since the middle student is 14th in line:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
            <div>• There are 13 students in front of them.</div>
            <div>• There are 13 students behind them.</div>
            <div className="pt-1 font-bold">Total students ＝ 13 ＋ 1 (middle) ＋ 13 ＝ <span className="text-emerald-700 text-base">27 students</span></div>
          </div>
          <p className="pt-1">Thus, there are <strong>27</strong> students in the class (Choice <strong>A</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Αφού το μεσαίο παιδί είναι το 14ο στη σειρά:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
            <div>• Υπάρχουν 13 παιδιά πριν από αυτό.</div>
            <div>• Υπάρχουν 13 παιδιά μετά από αυτό.</div>
            <div className="pt-1 font-bold">Σύνολο παιδιών ＝ 13 ＋ 1 (το μεσαίο) ＋ 13 ＝ <span className="text-emerald-700 text-base">27 παιδιά</span></div>
          </div>
          <p className="pt-1">Άρα, τα παιδιά του τμήματος είναι <strong>27</strong> (Επιλογή <strong>A</strong>).</p>
        </div>
      )
    },
    {
      id: 25,
      officialNumber: 50,
      group: groupB,
      promptText: isEn
        ? 'What is the last digit of a two-digit odd number that leaves a remainder of 4 when divided by 5?'
        : 'Ποιο είναι το τελευταίο ψηφίο ενός διψήφιου περιττού (μονού) αριθμού, ο οποίος αν διαιρεθεί με το 5 αφήνει υπόλοιπο 4;',
      options: [
        { key: 'A', label: '4', raw: '4' },
        { key: 'B', label: '0', raw: '0' },
        { key: isEn ? 'C' : 'Γ', label: '5', raw: '5' },
        { key: isEn ? 'D' : 'Δ', label: '9', raw: '9' }
      ],
      correctRaw: '9',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            1. Numbers that leave a remainder of 4 when divided by 5 end in either <strong>4</strong> or <strong>9</strong> (since multiples of 5 end in 0 or 5).
          </p>
          <p>
            2. Because the number is <strong>odd</strong>, its last digit cannot be even (so 4 is ruled out).
          </p>
          <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-mono text-emerald-800 font-bold">
            ➔ The last digit is 9.
          </div>
          <p className="pt-1">Therefore, the last digit is <strong>9</strong> (Choice <strong>D</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            1. Οι αριθμοί που διαιρούμενοι με το 5 αφήνουν υπόλοιπο 4 έχουν τελευταίο ψηφίο <strong>4</strong> ή <strong>9</strong> (αφού τα πολλαπλάσια του 5 λήγουν σε 0 ή 5).
          </p>
          <p>
            2. Επειδή ο αριθμός είναι <strong>περιττός (μονός)</strong>, το τελευταίο ψηφίο δεν μπορεί να είναι άρτιο (απορρίπτεται το 4).
          </p>
          <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-mono text-emerald-800 font-bold">
            ➔ Το τελευταίο ψηφίο είναι το 9.
          </div>
          <p className="pt-1">Επομένως, το τελευταίο ψηφίο είναι το <strong>9</strong> (Επιλογή <strong>Δ</strong>).</p>
        </div>
      )
    }
  ];
}

const TOTAL_TIME_SECONDS = 60 * 60; // 60 λεπτά

// Helper για ασφαλή μετατροπή JSX εκφωνήσεων/επεξηγήσεων σε απλό κείμενο για JSON-LD
function extractPlainText(node, isEn = false) {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map((n) => extractPlainText(n, isEn)).join(' ');
  if (node && typeof node === 'object' && node.props) {
    if (node.props.num !== undefined && node.props.den !== undefined) {
      const n = extractPlainText(node.props.num, isEn).trim();
      const d = extractPlainText(node.props.den, isEn).trim();
      return isEn ? `${n} over ${d}` : `${n} δια ${d}`;
    }
    if (node.props.base !== undefined && node.props.exp !== undefined) {
      return `${node.props.base}^${node.props.exp}`;
    }
    return extractPlainText(node.props.children, isEn);
  }
  return '';
}

export default function Themata2020Page() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const isEn = locale === 'en';
  const t = I18N[locale];
  const questions = getQuestions2020(locale);

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME_SECONDS);
  const [timerEnabled, setTimerEnabled] = useState(true);

  const timerRef = useRef(null);

  useEffect(() => {
    if (router.isReady) {
      const { timer } = router.query;
      setTimerEnabled(timer !== '0');
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  }, [locale]);

  useEffect(() => {
    if (!timerEnabled || submitted) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timerEnabled, submitted]);

  const handleSelect = (qId, optionRaw) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: optionRaw }));
  };

  const calculateScore = (currentAnswers) => {
    let s = 0;
    questions.forEach((q) => {
      if (currentAnswers[q.id] === q.correctRaw) {
        s += 2; // 2 μόρια ανά θέμα = 50 μόρια άριστα
      }
    });
    return s;
  };

  const handleAutoSubmit = () => {
    setAnswers(prev => {
      const finalScore = calculateScore(prev);
      setScore(finalScore);
      setSubmitted(true);
      return prev;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (submitted) return;
    if (timerRef.current) clearInterval(timerRef.current);

    const finalScore = calculateScore(answers);
    setScore(finalScore);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).length;

  const correctCount = questions.filter(
    q => answers[q.id] === q.correctRaw
  ).length;

  const baseUrl = isEn ? 'https://learnmaths.gr/en' : 'https://learnmaths.gr';

  const schema2020 = [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": t.schemaHome, "item": `${baseUrl}/` },
        { "@type": "ListItem", "position": 2, "name": t.schemaHub, "item": `${baseUrl}/protipa/protipa` },
        { "@type": "ListItem", "position": 3, "name": t.schemaCurrent, "item": `${baseUrl}/protipa/themata-2020` }
      ]
    },
    {
      "@type": "Quiz",
      "name": t.schemaQuizName,
      "description": t.schemaQuizDesc,
      "educationalLevel": t.schemaEduLevel,
      "typicalAgeRange": "11-12",
      "inLanguage": locale,
      "isAccessibleForFree": true,
      "provider": {
        "@id": "https://learnmaths.gr/#organization"
      },
      "hasPart": questions.map((q) => {
        const correctOpt = q.options.find((o) => o.raw === q.correctRaw);
        const wrongOpts = q.options.filter((o) => o.raw !== q.correctRaw);
        const cleanPrompt = extractPlainText(q.promptText, isEn).replace(/\s+/g, ' ').trim();
        const cleanExplain = extractPlainText(q.explain, isEn).replace(/\s+/g, ' ').trim();

        return {
          "@type": "Question",
          "eduQuestionType": "Multiple choice",
          "name": t.schemaQuestionName(q.officialNumber),
          "text": cleanPrompt,
          "typicalAgeRange": "11-12",
          "acceptedAnswer": {
            "@type": "Answer",
            "position": q.options.findIndex((o) => o.raw === q.correctRaw) + 1,
            "text": correctOpt ? `${correctOpt.key}: ${correctOpt.raw}` : q.correctRaw,
            "answerExplanation": {
              "@type": "Comment",
              "text": cleanExplain
            }
          },
          "suggestedAnswer": wrongOpts.map((opt) => ({
            "@type": "Answer",
            "position": q.options.findIndex((o) => o.key === opt.key) + 1,
            "text": `${opt.key}: ${opt.raw}`
          }))
        };
      })
    }
  ];

  const renderQuestionVisual = (q) => {
    if (q.hasSvg === 'axis27') {
      return (
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 my-3">
          <svg
            viewBox="0 0 340 75"
            className="w-full max-w-[340px] h-auto select-none font-mono mx-auto block"
            role="img"
            aria-label={t.axisAria}
          >
            <line x1="20" y1="35" x2="310" y2="35" stroke="#334155" strokeWidth="2" />
            <polygon points="310,31 320,35 310,39" fill="#334155" />
            <line x1="40" y1="27" x2="40" y2="43" stroke="#334155" strokeWidth="2" />
            <text x="40" y="60" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#1e293b">0</text>
            <line x1="160" y1="27" x2="160" y2="43" stroke="#334155" strokeWidth="2" />
            <text x="160" y="60" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#1e293b">1</text>
            <line x1="280" y1="27" x2="280" y2="43" stroke="#334155" strokeWidth="2" />
            <text x="280" y="60" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#1e293b">2</text>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <line key={i} x1={40 + i * 12} y1="31" x2={40 + i * 12} y2="39" stroke="#94a3b8" strokeWidth="1" />
            ))}
            <line x1="148" y1="23" x2="148" y2="47" stroke="#2563eb" strokeWidth="2.5" />
            <text x="148" y="16" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#2563eb">A</text>
          </svg>
        </div>
      );
    }

    if (q.hasSvg === 'scales30') {
      return (
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 my-3">
          <svg
            viewBox="0 0 450 155"
            className="w-full max-w-[450px] h-auto select-none font-sans mx-auto block"
            role="img"
            aria-label={t.scalesAria}
          >
            <g transform="translate(10, 10)">
              <line x1="10" y1="120" x2="190" y2="120" stroke="#000000" strokeWidth="2.5" />
              <line x1="100" y1="120" x2="100" y2="140" stroke="#000000" strokeWidth="2.5" />
              <rect x="15" y="10" width="80" height="108" fill="#ffffff" stroke="#000000" strokeWidth="2" />
              <text x="55" y="55" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#000000">{t.potatoesAndOnions1}</text>
              <text x="55" y="70" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#000000">{t.potatoesAndOnions2}</text>
              <path d="M 130,50 C 130,35 160,35 160,50 C 175,70 175,115 145,118 C 115,115 115,70 130,50 Z" fill="#f8fafc" stroke="#000000" strokeWidth="2" />
              <text x="145" y="85" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#000000">{t.kg28}</text>
            </g>

            <g transform="translate(235, 10)">
              <line x1="10" y1="120" x2="200" y2="120" stroke="#000000" strokeWidth="2.5" />
              <line x1="105" y1="120" x2="105" y2="140" stroke="#000000" strokeWidth="2.5" />
              <rect x="15" y="30" width="70" height="88" fill="#ffffff" stroke="#000000" strokeWidth="2" />
              <text x="50" y="78" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#000000">{t.onions}</text>
              <rect x="105" y="55" width="48" height="63" fill="#ffffff" stroke="#000000" strokeWidth="2" />
              <text x="129" y="90" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#000000">{t.potatoes}</text>
              <path d="M 172,70 C 172,60 188,60 188,70 C 196,80 196,115 180,118 C 164,115 164,80 172,70 Z" fill="#f8fafc" stroke="#000000" strokeWidth="1.8" />
              <text x="180" y="96" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#000000">{t.kg4}</text>
            </g>
          </svg>
        </div>
      );
    }

    if (q.hasSvg === 'freeTimeChart34') {
      return (
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 my-3">
          <svg
            viewBox="0 0 340 190"
            className="w-full max-w-[340px] h-auto select-none font-sans mx-auto block"
            role="img"
            aria-label={t.chartAria}
          >
            <text x="170" y="16" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0f172a">
              {t.chartTitle}
            </text>
            {[0, 10, 20, 30, 40].map((v) => {
              const y = 140 - (v / 40) * 110;
              return (
                <g key={v}>
                  <line x1="40" y1={y} x2="310" y2={y} stroke="#cbd5e1" strokeWidth="1" />
                  <text x="32" y={y + 3.5} fontSize="9" fontWeight="bold" textAnchor="end" fill="#64748b">{v}</text>
                </g>
              );
            })}
            {t.chartBars.map((col, idx) => {
              const x = 55 + idx * 64;
              const h = (col.val / 40) * 110;
              const y = 140 - h;
              const cx = x + 16;
              return (
                <g key={idx}>
                  <rect x={x} y={y} width="32" height={h} fill="#2563eb" rx="1.5" />
                  {col.lines.length === 1 ? (
                    <text x={cx} y="156" fontSize="8.5" fontWeight="bold" textAnchor="middle" fill="#334155">{col.lines[0]}</text>
                  ) : (
                    <text x={cx} y="153" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#334155">
                      <tspan x={cx} dy="0">{col.lines[0]}</tspan>
                      <tspan x={cx} dy="10">{col.lines[1]}</tspan>
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      );
    }

    if (q.hasTable === 'judgesTable35') {
      return (
        <div className="my-3">
          <table className="w-full table-fixed text-xs sm:text-sm border-collapse bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 text-center">
            <thead>
              <tr className="bg-slate-200/80 text-slate-800 font-black">
                {t.judgesHeaders.map((h, i) => (
                  <th key={i} className="p-2 sm:p-2.5 border-b border-slate-200 break-words">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {t.judgesScores.map((s, i) => (
                  <td key={i} className={`p-2 font-mono font-bold ${i === 2 ? 'text-blue-700' : ''}`}>
                    {s}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      );
    }

    if (q.hasSvg === 'yardPlan36') {
      return (
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 my-3">
          <svg
            viewBox="0 0 340 200"
            className="w-full max-w-[340px] h-auto select-none font-sans mx-auto block"
            role="img"
            aria-label={t.yardAria}
          >
            <polygon
              points="40,65 125,65 125,120 215,120 215,65 300,65 300,165 40,165"
              fill="#cbd5e1"
              stroke="#0f172a"
              strokeWidth="2"
            />
            <rect x="125" y="25" width="90" height="95" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
            <text x="170" y="75" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0f172a">{t.garden}</text>

            <text x="25" y="115" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#334155">{t.m5}</text>
            <text x="315" y="115" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#334155">{t.m5}</text>
            <text x="82.5" y="55" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#334155">{t.m3}</text>
            <text x="257.5" y="55" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#334155">{t.m3}</text>
            <text x="115" y="45" fontSize="9" fontWeight="bold" textAnchor="end" fill="#334155">{t.m3}</text>
            <text x="225" y="45" fontSize="9" fontWeight="bold" textAnchor="start" fill="#334155">{t.m3}</text>
            <text x="170" y="182" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#334155">{t.m12}</text>
          </svg>
        </div>
      );
    }

    if (q.hasSvg === 'penPie46') {
      return (
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 my-3">
          <svg
            viewBox="0 0 180 180"
            className="w-full max-w-[180px] h-auto select-none font-sans mx-auto block"
            role="img"
            aria-label={t.pieAria}
          >
            <circle cx="90" cy="90" r="75" fill="#e0f2fe" stroke="#0f172a" strokeWidth="2" />
            <path d="M 90,90 L 90,15 A 75,75 0 0,1 165,90 Z" fill="#000000" />
            <line x1="90" y1="90" x2="90" y2="15" stroke="#0f172a" strokeWidth="2" />
            <line x1="90" y1="90" x2="165" y2="90" stroke="#0f172a" strokeWidth="2" />
            <text x="135" y="60" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#ffffff">{t.blackPen}</text>
            <text x="65" y="105" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0369a1">{t.bluePen}</text>
            <text x="65" y="122" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0369a1">75%</text>
          </svg>
        </div>
      );
    }

    if (q.hasSvg === 'rectSquare47') {
      const [l0, l1, l2, l3, l4, l5] = t.rectLabels;
      return (
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 my-3">
          <svg
            viewBox="0 0 340 150"
            className="w-full max-w-[340px] h-auto select-none font-sans mx-auto block"
            role="img"
            aria-label={t.rectAria}
          >
            <defs>
              <pattern id="diagonalHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="8" stroke="#000000" strokeWidth="2" />
              </pattern>
            </defs>
            <rect x="35" y="30" width="160" height="80" fill="url(#diagonalHatch)" stroke="#000000" strokeWidth="2.2" />
            <rect x="195" y="30" width="80" height="80" fill="#ffffff" stroke="#000000" strokeWidth="2.2" />

            <circle cx="35" cy="30" r="3.5" fill="#000000" /><text x="25" y="25" fontSize="12" fontWeight="bold" fill="#000000">{l0}</text>
            <circle cx="35" cy="110" r="3.5" fill="#000000" /><text x="20" y="122" fontSize="12" fontWeight="bold" fill="#000000">{l1}</text>
            <circle cx="195" cy="30" r="3.5" fill="#000000" /><text x="195" y="22" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#000000">{l2}</text>
            <circle cx="195" cy="110" r="3.5" fill="#000000" /><text x="195" y="125" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#000000">{l3}</text>
            <circle cx="275" cy="30" r="3.5" fill="#000000" /><text x="285" y="25" fontSize="12" fontWeight="bold" fill="#000000">{l4}</text>
            <circle cx="275" cy="110" r="3.5" fill="#000000" /><text x="285" y="122" fontSize="12" fontWeight="bold" fill="#000000">{l5}</text>
          </svg>
        </div>
      );
    }

    return null;
  };

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDesc}
      schemaData={schema2020}
      backUrl="/protipa/protipa"
      backText={t.backText}
      hideFooter={true}
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 4k:px-24 py-4 sm:py-6 pb-28 sm:pb-36 overflow-x-hidden text-slate-800 box-border space-y-6">

        {/* HERO BANNER & TIMER HEADER */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-700 rounded-3xl p-5 sm:p-7 text-white shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1.5">
              <span className="inline-block bg-white/20 px-3 py-0.5 rounded-full text-[11px] font-black tracking-wider text-blue-100">
                {toCleanUppercase(t.heroBadge)}
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
                {t.heroTitle}
              </h1>
            </div>

            {timerEnabled && (
              <div className={`px-4 py-2 rounded-2xl font-mono font-black text-base sm:text-lg flex items-center gap-2 shadow-inner self-stretch sm:self-auto justify-center ${
                timeLeft < 300 ? 'bg-rose-500 text-white animate-pulse' : 'bg-white text-blue-950'
              }`}>
                <span>⏱️</span>
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>

          <p className="text-xs sm:text-sm text-blue-100/95 leading-relaxed max-w-3xl">
            {t.heroSubtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-blue-100 border-t border-white/20 pt-3">
            <span>📝 {t.answeredLabel} <strong>{answeredCount} {t.of25}</strong></span>
            <span>🎯 {t.scoringLabel} <strong>{t.scoringValue}</strong></span>
            <span>{timerEnabled ? t.timerOn : t.timerOff}</span>
          </div>
        </div>

        {/* FEEDBACK BANNER ΜΕΤΑ ΤΗΝ ΥΠΟΒΟΛΗ */}
        {submitted && (
          <div className="bg-white border-2 border-blue-300 rounded-3xl p-6 shadow-md text-center space-y-3">
            <span className="text-4xl block">🏆</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {t.resultTitle}
            </h2>
            <div className="inline-block bg-blue-50 border border-blue-200 px-6 py-2.5 rounded-2xl">
              <span className="text-xs font-bold text-blue-800 uppercase block">{t.finalScoreLabel}</span>
              <span className="text-3xl sm:text-4xl font-mono font-black text-blue-700">
                {score} / 50
              </span>
              <span className="text-xs font-bold text-slate-500 block mt-1">
                {t.correctOutOf(correctCount)}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
              {t.resultSubtitle}
            </p>
          </div>
        )}

        {/* LIST OF QUESTIONS */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((q) => {
            const userChoice = answers[q.id];
            const isCorrect = userChoice === q.correctRaw;

            let cardBorder = 'border-slate-200';
            if (submitted) {
              cardBorder = isCorrect ? 'border-emerald-400 bg-emerald-50/30' : 'border-rose-400 bg-rose-50/30';
            }

            return (
              <div
                key={q.id}
                className={`bg-white rounded-3xl p-5 sm:p-6 border-2 shadow-sm transition-all space-y-4 min-w-0 ${cardBorder}`}
              >
                {/* ΚΕΦΑΛΙΔΑ ΕΡΩΤΗΣΗΣ */}
                <div className="flex justify-between items-center gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-blue-100 text-blue-900 font-mono font-black text-xs px-3 py-1 rounded-xl">
                      {t.questionPrefix} {q.officialNumber}
                    </span>
                    <span className="text-[10px] font-black tracking-wider text-slate-400">
                      {toCleanUppercase(q.group)}
                    </span>
                  </div>

                  {submitted && (
                    <span className="text-sm sm:text-base font-black">
                      {isCorrect ? t.pointsEarned : t.pointsZero}
                    </span>
                  )}
                </div>

                {/* ΕΚΦΩΝΗΣΗ */}
                <div className="text-sm sm:text-base text-slate-900 font-bold leading-relaxed break-words [overflow-wrap:anywhere]">
                  {q.promptText}
                </div>

                {/* ΣΧΗΜΑΤΑ / ΠΙΝΑΚΕΣ */}
                {renderQuestionVisual(q)}

                {/* ΕΠΙΛΟΓΕΣ */}
                <div className="grid gap-2 pt-1 grid-cols-1 sm:grid-cols-2">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userChoice === opt.raw;
                    let btnStyle = 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50';

                    if (submitted) {
                      if (opt.raw === q.correctRaw) {
                        btnStyle = 'bg-emerald-600 text-white border-emerald-600 shadow-sm font-black';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'bg-rose-600 text-white border-rose-600 font-black';
                      } else {
                        btnStyle = 'bg-slate-100 text-slate-400 border-slate-200 opacity-60';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-blue-600 text-white border-blue-600 shadow-sm font-black';
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={submitted}
                        onClick={() => handleSelect(q.id, opt.raw)}
                        className={`p-3 rounded-2xl border text-left text-xs sm:text-sm transition flex items-center gap-2.5 min-w-0 ${btnStyle}`}
                      >
                        <span className={`w-6 h-6 rounded-xl flex items-center justify-center font-mono font-black text-xs shrink-0 border ${
                          isSelected || (submitted && opt.raw === q.correctRaw)
                            ? 'bg-white/20 border-white/40 text-white'
                            : 'bg-slate-100 border-slate-200 text-slate-700'
                        }`}>
                          {opt.key}
                        </span>
                        <div className="font-bold leading-normal flex items-center flex-wrap break-words [overflow-wrap:anywhere] max-w-full">
                          {opt.label}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* ΕΠΕΞΗΓΗΣΗ: Πάντα στο DOM για SEO (σε <details> πριν την υποβολή, ανοιχτή μετά) */}
                <details
                  open={submitted}
                  className={`group rounded-2xl text-xs sm:text-sm leading-relaxed border transition ${
                    submitted
                      ? isCorrect
                        ? 'bg-emerald-100/60 text-emerald-950 border-emerald-200'
                        : 'bg-rose-100/60 text-rose-950 border-rose-200'
                      : 'bg-slate-50 text-slate-800 border-slate-200'
                  }`}
                >
                  <summary className="p-3.5 sm:p-4 font-black cursor-pointer list-none flex items-center justify-between gap-2 select-none">
                    <span className="flex items-center gap-1.5">
                      <span>💡</span>
                      <span>{submitted ? t.explainTitleSubmitted : t.explainTitlePreview}</span>
                    </span>
                    {!submitted && (
                      <span className="text-xs font-bold text-blue-600 group-open:rotate-180 transition-transform">▼</span>
                    )}
                  </summary>
                  <div className="px-3.5 pb-4 sm:px-4 pt-2 border-t border-slate-200/60 font-medium break-words [overflow-wrap:anywhere]">
                    {q.explain}
                  </div>
                </details>
              </div>
            );
          })}

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#10b981] hover:bg-[#059669] text-white text-base md:text-lg font-black px-10 py-4 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>🎯</span>
                <span>{t.submitMainBtn(answeredCount)}</span>
              </button>
            </div>
          )}
        </form>

      </div>

      {/* FIXED BOTTOM SCORE & TIMER BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-3 px-4 sm:px-6 z-50">
        <div className={`${LAYOUT.CONTAINER} flex flex-col sm:flex-row justify-between items-center gap-3`}>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-mono shadow-xs">
              {submitted ? t.barScore(score) : t.barAnswered(answeredCount)}
            </div>
            {submitted ? (
              <span className="text-xs font-bold text-slate-300">
                {t.barPercent} <strong className="text-emerald-400">{Math.round((score / 50) * 100)}%</strong>
              </span>
            ) : (
              <span className="text-xs text-slate-300">
                {t.barRemaining} <strong>{25 - answeredCount}</strong>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {timerEnabled && !submitted && (
              <span className={`text-xs font-mono font-black px-3 py-1 rounded-lg ${
                timeLeft < 300 ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-800 text-slate-200'
              }`}>
                ⏱️ {formatTime(timeLeft)}
              </span>
            )}

            {submitted ? (
              <button
                type="button"
                onClick={() => {
                  setAnswers({});
                  setSubmitted(false);
                  setScore(0);
                  setTimeLeft(TOTAL_TIME_SECONDS);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2 rounded-xl text-xs transition shadow-xs cursor-pointer"
              >
                {t.retryBtn}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-4 py-2 rounded-xl text-xs transition shadow-xs cursor-pointer"
              >
                {t.checkBtn}
              </button>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}