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
function ComplexFrac({ num, den }) {
  return (
    <span className="inline-grid grid-rows-[1fr_auto_1fr] items-center justify-items-center align-middle mx-1.5 my-0.5 font-mono font-bold text-[0.9em] leading-none select-none whitespace-nowrap">
      <span className="self-end px-2 pb-[3px] flex items-center justify-center">
        {num}
      </span>
      <span className="w-full border-t-[2.4px] border-current" />
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
    metaTitle: 'Θέματα Προτύπων 2026 (Ενδεικτικά & Επίσημα) με Λύσεις | LearnMaths.gr',
    metaDesc: 'Λύσε online τα 20 θέματα Μαθηματικών για τα Πρότυπα Γυμνάσια 2026 (21–40), με χρονόμετρο 60 λεπτών, αυτόματη βαθμολόγηση και αναλυτικές λύσεις.',
    backText: 'Θέματα Προτύπων 2026',
    heroBadge: 'Θέματα Προτύπων 2026 • 20 Ερωτήσεις & Αναλυτικές Λύσεις',
    heroTitle: 'Θέματα Προτύπων Γυμνασίων 2026 – Online Τεστ & Λύσεις',
    heroSubtitle: 'Εξασκήσου στα θέματα Μαθηματικών για τις εισαγωγικές εξετάσεις στα Πρότυπα Γυμνάσια 2026. Περιλαμβάνει και τα 20 θέματα (Ομάδα Α & Ομάδα Β) με αυτόματη βαθμολόγηση στην κλίμακα 0–50 και αναλυτική μαθηματική επεξήγηση με οπτικά σχήματα.',
    answeredLabel: 'Απαντημένες:',
    of20: 'από 20',
    scoringLabel: 'Βαθμολογία:',
    scoringValue: '2 μόρια (Θ. 21–30) & 3 μόρια (Θ. 31–40) • Άριστα: 50',
    timerOn: '⏳ Χρονόμετρο: 60 λεπτά',
    timerOff: '⏳ Χρονόμετρο: Ανενεργό',
    resultTitle: 'Αποτέλεσμα Εξέτασης Προτύπων 2026',
    finalScoreLabel: 'Τελικό Σκορ',
    correctOutOf: (c) => `(${c} σωστές στις 20 ερωτήσεις)`,
    scoringBreakdown: '(Θέματα 21–30: 2 μόρια | Θέματα 31–40: 3 μόρια)',
    resultSubtitle: 'Δες παρακάτω αναλυτικά τις απαντήσεις σου με πλήρη μαθηματική τεκμηρίωση για κάθε θέμα.',
    questionPrefix: 'Θέμα',
    pointsEarned: (pts) => `✅ +${pts} μόρια`,
    pointsZero: '❌ 0 μόρια',
    explainTitleSubmitted: 'Μαθηματική Επεξήγηση:',
    explainTitlePreview: 'Προβολή Αναλυτικής Λύσης & Σχήματος',
    submitMainBtn: (c) => `Οριστική Υποβολή (${c} από 20)`,
    barScore: (s) => `Σκορ: ${s} / 50`,
    barAnswered: (c) => `Απαντήσεις: ${c} / 20`,
    barPercent: 'Ποσοστό:',
    barRemaining: 'Υπολείπονται:',
    retryBtn: '🔄 Επανάληψη Εξέτασης',
    checkBtn: 'Έλεγχος & Βαθμολόγηση ➔',
    // SVG Labels
    grid23Aria: 'Πλέγμα 2x2 με αφετηρία Κ και προορισμό Λ',
    grid23Labels: ['Κ', 'Λ'],
    rect24Aria: 'Ορθογώνιο παραλληλόγραμμο ΑΒΓΔ με σημείο Ε στην ΑΒ και γωνία ΑΕΓ 137 μοίρες',
    rect24Labels: ['Α', 'Ε', 'Β', 'Γ', 'Δ'],
    pie25Aria: 'Κυκλικό διάγραμμα και 4 ραβδογράμματα Α, Β, Γ, Δ για τα αθλήματα Κ, Λ, Μ',
    pie25Labels: ['Κ', 'Λ', 'Μ'],
    bar25Keys: ['A', 'B', 'Γ', 'Δ'],
    line31Aria: 'Αριθμογραμμή με τα σημεία Κ(5), Μ, Ν και Λ(35)',
    line31Labels: ['Κ (5)', 'Μ', 'Ν (;)', 'Λ (35)'],
    tri36Aria: 'Ισόπλευρο τρίγωνο χωρισμένο σε 9 ίσα ισόπλευρα τρίγωνα με σκιασμένο τμήμα',
    // Schema
    schemaHome: 'Αρχική',
    schemaHub: 'Ενδεικτικά Θέματα Προτύπων 2026',
    schemaCurrent: 'Θέματα Προτύπων Γυμνασίων 2026',
    schemaQuizName: 'Θέματα Μαθηματικών Προτύπων Γυμνασίων 2026 (Με Λύσεις)',
    schemaQuizDesc: 'Διαδραστικό τεστ 20 ερωτήσεων πολλαπλής επιλογής στα Μαθηματικά για τις εξετάσεις των Προτύπων Γυμνασίων 2026 (21–40) με χρονόμετρο 60 λεπτών, αυτόματη βαθμολόγηση (0–50) και αναλυτικές λύσεις.',
    schemaEduLevel: "ΣΤ' Δημοτικού",
    schemaQuestionName: (num) => `Θέμα ${num} - Πρότυπα 2026`
  },
  en: {
    metaTitle: 'Model School 2026 Math Exam (Official & Practice) With Solutions | LearnMaths.gr',
    metaDesc: 'Practice online with the 20 Mathematics questions for the 2026 Model Middle School entrance exam (21–40), 60-minute timer, auto-grading, and full solutions.',
    backText: 'Model School 2026 Exams',
    heroBadge: 'Model Schools 2026 • 20 Questions & Step-by-Step Solutions',
    heroTitle: 'Model Middle Schools 2026 Math Exam – Online Test & Solutions',
    heroSubtitle: 'Practice with the Mathematics questions for the 2026 Model Middle School entrance exams. Includes all 20 questions (Group A & Group B) with automatic scoring on a 0–50 scale and detailed step-by-step explanations with visual diagrams.',
    answeredLabel: 'Answered:',
    of20: 'of 20',
    scoringLabel: 'Scoring:',
    scoringValue: '2 pts (Q21–30) & 3 pts (Q31–40) • Max: 50',
    timerOn: '⏳ Timer: 60 minutes',
    timerOff: '⏳ Timer: Disabled',
    resultTitle: '2026 Model School Exam Results',
    finalScoreLabel: 'Final Score',
    correctOutOf: (c) => `(${c} correct out of 20 questions)`,
    scoringBreakdown: '(Questions 21–30: 2 pts | Questions 31–40: 3 pts)',
    resultSubtitle: 'Review your answers below with complete step-by-step mathematical explanations for every question.',
    questionPrefix: 'Question',
    pointsEarned: (pts) => `✅ +${pts} pts`,
    pointsZero: '❌ 0 pts',
    explainTitleSubmitted: 'Mathematical Explanation:',
    explainTitlePreview: 'View Step-by-Step Solution & Diagram',
    submitMainBtn: (c) => `Final Submission (${c} of 20)`,
    barScore: (s) => `Score: ${s} / 50`,
    barAnswered: (c) => `Answered: ${c} / 20`,
    barPercent: 'Percentage:',
    barRemaining: 'Remaining:',
    retryBtn: '🔄 Retake Exam',
    checkBtn: 'Check & Grade ➔',
    // SVG Labels
    grid23Aria: '2x2 grid showing starting point K and destination L',
    grid23Labels: ['K', 'L'],
    rect24Aria: 'Rectangle ABCD with point E on AB and angle AEC equal to 137 degrees',
    rect24Labels: ['A', 'E', 'B', 'C', 'D'],
    pie25Aria: 'Pie chart and 4 bar charts A, B, C, D for sports K, L, M',
    pie25Labels: ['K', 'L', 'M'],
    bar25Keys: ['A', 'B', 'C', 'D'],
    line31Aria: 'Number line with points K(5), M, N, and L(35)',
    line31Labels: ['K (5)', 'M', 'N (?)', 'L (35)'],
    tri36Aria: 'Equilateral triangle subdivided into 9 equal equilateral triangles with a shaded region',
    // Schema
    schemaHome: 'Home',
    schemaHub: 'Model School Entrance 2026 Prep',
    schemaCurrent: 'Model Middle Schools 2026 Exam',
    schemaQuizName: 'Model Middle School 2026 Mathematics Exam (With Solutions)',
    schemaQuizDesc: 'Interactive practice test of 20 multiple-choice Mathematics questions for the 2026 Model Middle School entrance exams (21–40) with a 60-minute timer, automatic grading (0–50), and detailed solutions.',
    schemaEduLevel: 'Grade 6',
    schemaQuestionName: (num) => `Question ${num} - Model Schools 2026`
  }
};

function getQuestions2026(locale) {
  const isEn = locale === 'en';
  const groupA = isEn ? 'GROUP A (4 CHOICES)' : 'ΟΜΑΔΑ Α (4 ΕΠΙΛΟΓΕΣ)';
  const groupB = isEn ? 'GROUP B (5 CHOICES)' : 'ΟΜΑΔΑ Β (5 ΕΠΙΛΟΓΕΣ)';

  return [
    {
      id: 1,
      officialNumber: 21,
      group: groupA,
      promptText: isEn
        ? 'What is the number x so that the following equality holds?'
        : 'Ποιος είναι ο αριθμός x ώστε να ισχύει η παρακάτω ισότητα;',
      customPromptComponent: (
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 my-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-base sm:text-lg font-mono font-bold text-slate-900 flex-wrap">
          <Frac num="11" den="2" />
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＋ <Frac num="11" den="4" /></span>
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＋ <Frac num="11" den="8" /></span>
          <span className="whitespace-nowrap">＋ x ＝ 11</span>
        </div>
      ),
      options: [
        { key: 'A', label: <span className="font-mono whitespace-nowrap">x ＝ <Frac num="1" den="8" /></span>, raw: 'x = 1/8' },
        { key: 'B', label: <span className="font-mono whitespace-nowrap">x ＝ <Frac num="11" den="16" /></span>, raw: 'x = 11/16' },
        { key: isEn ? 'C' : 'Γ', label: <span className="font-mono whitespace-nowrap">x ＝ <Frac num="11" den="8" /></span>, raw: 'x = 11/8' },
        { key: isEn ? 'D' : 'Δ', label: <span className="font-mono whitespace-nowrap">x ＝ <Frac num="11" den="4" /></span>, raw: 'x = 11/4' }
      ],
      correctRaw: 'x = 11/8',
      explain: isEn ? (
        <div className="space-y-4 text-xs sm:text-sm">
          <p>Convert all terms into fractions with common denominator <strong>8</strong> (LCM(2, 4, 8) ＝ 8):</p>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>• <Frac num="11" den="2" /> ＝ <Frac num="44" den="8" /></div>
            <div>• <Frac num="11" den="4" /> ＝ <Frac num="22" den="8" /></div>
            <div>• 11 ＝ <Frac num="88" den="8" /></div>
            <div className="pt-2 border-t border-slate-200 space-y-1.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>(<Frac num="44" den="8" /> ＋ <Frac num="22" den="8" /> ＋ <Frac num="11" den="8" />) ＋ x ＝ <Frac num="88" den="8" /></span>
              </div>
              <div><Frac num="77" den="8" /> ＋ x ＝ <Frac num="88" den="8" /></div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>x ＝ <Frac num="88" den="8" /> － <Frac num="77" den="8" /></span>
                <span className="whitespace-nowrap">➔ <strong className="text-emerald-700 text-base">x ＝ <Frac num="11" den="8" /></strong></span>
              </div>
            </div>
          </div>
          <p className="pt-1">Therefore, the required number is <strong>x ＝ <Frac num="11" den="8" /></strong> (Choice <strong>C</strong>).</p>
        </div>
      ) : (
        <div className="space-y-4 text-xs sm:text-sm">
          <p>Μετατρέπουμε όλους τους όρους σε ομώνυμα κλάσματα με κοινό παρονομαστή το <strong>8</strong> (ΕΚΠ(2, 4, 8) ＝ 8):</p>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>• <Frac num="11" den="2" /> ＝ <Frac num="44" den="8" /></div>
            <div>• <Frac num="11" den="4" /> ＝ <Frac num="22" den="8" /></div>
            <div>• 11 ＝ <Frac num="88" den="8" /></div>
            <div className="pt-2 border-t border-slate-200 space-y-1.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>(<Frac num="44" den="8" /> ＋ <Frac num="22" den="8" /> ＋ <Frac num="11" den="8" />) ＋ x ＝ <Frac num="88" den="8" /></span>
              </div>
              <div><Frac num="77" den="8" /> ＋ x ＝ <Frac num="88" den="8" /></div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>x ＝ <Frac num="88" den="8" /> － <Frac num="77" den="8" /></span>
                <span className="whitespace-nowrap">➔ <strong className="text-emerald-700 text-base">x ＝ <Frac num="11" den="8" /></strong></span>
              </div>
            </div>
          </div>
          <p className="pt-1">Συνεπώς, ο ζητούμενος αριθμός είναι <strong>x ＝ <Frac num="11" den="8" /></strong> (Επιλογή <strong>Γ</strong>).</p>
        </div>
      )
    },
    {
      id: 2,
      officialNumber: 22,
      group: groupA,
      promptText: isEn
        ? 'An ice cream shop offers ice cream in three flavors (chocolate, vanilla, strawberry) and two types of syrup (cherry or sour cherry). Every day, Chara eats a different ice cream by choosing two different flavors and one type of syrup. In how many days will she have tried all possible combinations?'
        : 'Ένα ζαχαροπλαστείο προσφέρει παγωτό σε τρεις γεύσεις (σοκολάτα, βανίλια, φράουλα) και δύο είδη σιροπιού (κεράσι ή βύσσινο). Η Χαρά τρώει κάθε μέρα ένα διαφορετικό παγωτό επιλέγοντας δύο διαφορετικές γεύσεις και ένα είδος σιροπιού. Σε πόσες μέρες θα έχει δοκιμάσει όλους τους συνδυασμούς;',
      options: [
        { key: 'A', label: '6', raw: '6' },
        { key: 'B', label: '4', raw: '4' },
        { key: isEn ? 'C' : 'Γ', label: '3', raw: '3' },
        { key: isEn ? 'D' : 'Δ', label: '5', raw: '5' }
      ],
      correctRaw: '6',
      explain: isEn ? (
        <div className="space-y-4 text-xs sm:text-sm">
          <p>Choosing <strong>2 different flavors</strong> out of 3 available gives <strong>3 possible pairs</strong>:</p>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-800 text-center font-bold">
            1. (Chocolate – Vanilla) &nbsp;|&nbsp; 2. (Chocolate – Strawberry) &nbsp;|&nbsp; 3. (Vanilla – Strawberry)
          </div>
          <p>Each of these 3 flavor pairs can be combined with <strong>2 syrup choices</strong> (Cherry or Sour Cherry):</p>
          <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>Total combinations ＝ (Flavor Pairs) · (Syrup Choices)</div>
            <div>Total combinations ＝ 3 · 2 ＝ <strong className="text-emerald-700 text-base">6 different days</strong></div>
          </div>
          <p className="pt-1">Therefore, she will need <strong>6 days</strong> to try every combination (Choice <strong>A</strong>).</p>
        </div>
      ) : (
        <div className="space-y-4 text-xs sm:text-sm">
          <p>Επιλέγοντας <strong>2 διαφορετικές γεύσεις</strong> από τις 3 διαθέσιμες, έχουμε <strong>3 δυνατά ζευγάρια</strong>:</p>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-800 text-center font-bold">
            1. (Σοκολάτα – Βανίλια) &nbsp;|&nbsp; 2. (Σοκολάτα – Φράουλα) &nbsp;|&nbsp; 3. (Βανίλια – Φράουλα)
          </div>
          <p>Κάθε ζευγάρι γεύσεων συνδυάζεται με <strong>2 επιλογές σιροπιού</strong> (Κεράσι ή Βύσσινο):</p>
          <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>Συνολικοί συνδυασμοί ＝ (Συνδυασμοί Γεύσεων) · (Επιλογές Σιροπιού)</div>
            <div>Συνολικοί συνδυασμοί ＝ 3 · 2 ＝ <strong className="text-emerald-700 text-base">6 διαφορετικές ημέρες</strong></div>
          </div>
          <p className="pt-1">Επομένως, θα χρειαστεί <strong>6 ημέρες</strong> για να δοκιμάσει όλους τους συνδυασμούς (Επιλογή <strong>A</strong>).</p>
        </div>
      )
    },
    {
      id: 3,
      officialNumber: 23,
      group: groupA,
      promptText: isEn
        ? 'How many different paths exist for someone to go from the bottom-left corner (K) of the figure to the top-right corner (L), moving along the grid lines only to the right or upward?'
        : 'Πόσες διαφορετικές διαδρομές υπάρχουν για να φτάσει κάποιος από την κάτω αριστερή γωνία (Κ) του σχήματος μέχρι την πάνω δεξιά γωνία (Λ) κινούμενος επάνω στις γραμμές του πλέγματος, μόνο προς τα δεξιά ή προς τα πάνω;',
      hasSvg: 'grid23',
      options: [
        { key: 'A', label: '5', raw: '5' },
        { key: 'B', label: '6', raw: '6' },
        { key: isEn ? 'C' : 'Γ', label: '8', raw: '8' },
        { key: isEn ? 'D' : 'Δ', label: '3', raw: '3' }
      ],
      correctRaw: '6',
      explain: isEn ? (
        <div className="space-y-4 text-xs sm:text-sm">
          <p>
            On a <strong>2×2</strong> grid, to move from <strong>K</strong> (bottom-left) to <strong>L</strong> (top-right), we must take 4 steps: exactly <strong>2 Right (R)</strong> and <strong>2 Up (U)</strong>.
          </p>
          <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>1. R ➔ R ➔ U ➔ U</div>
            <div>2. R ➔ U ➔ R ➔ U</div>
            <div>3. R ➔ U ➔ U ➔ R</div>
            <div>4. U ➔ R ➔ R ➔ U</div>
            <div>5. U ➔ R ➔ U ➔ R</div>
            <div>6. U ➔ U ➔ R ➔ R</div>
            <div className="pt-1 text-emerald-800 font-bold">Total ＝ 6 different paths</div>
          </div>
          <p className="pt-1">Therefore, there are <strong>6 different paths</strong> in total (Choice <strong>B</strong>).</p>
        </div>
      ) : (
        <div className="space-y-4 text-xs sm:text-sm">
          <p>
            Σε ένα πλέγμα <strong>2×2</strong>, για να μετακινηθούμε από το <strong>Κ</strong> (κάτω αριστερά) στο <strong>Λ</strong> (πάνω δεξιά), πρέπει να κάνουμε 4 βήματα: ακριβώς <strong>2 Δεξιά (Δ)</strong> και <strong>2 Πάνω (Π)</strong>.
          </p>
          <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>1. Δ ➔ Δ ➔ Π ➔ Π</div>
            <div>2. Δ ➔ Π ➔ Δ ➔ Π</div>
            <div>3. Δ ➔ Π ➔ Π ➔ Δ</div>
            <div>4. Π ➔ Δ ➔ Δ ➔ Π</div>
            <div>5. Π ➔ Δ ➔ Π ➔ Δ</div>
            <div>6. Π ➔ Π ➔ Δ ➔ Δ</div>
            <div className="pt-1 text-emerald-800 font-bold">Σύνολο ＝ 6 διαφορετικές διαδρομές</div>
          </div>
          <p className="pt-1">Επομένως, υπάρχουν συνολικά <strong>6 διαφορετικές διαδρομές</strong> (Επιλογή <strong>B</strong>).</p>
        </div>
      )
    },
    {
      id: 4,
      officialNumber: 24,
      group: groupA,
      promptText: isEn
        ? 'ABCD is a rectangle. On side AB we choose a point E such that angle AEC is 137°. How many degrees is angle BCE?'
        : 'Το ΑΒΓΔ είναι ορθογώνιο παραλληλόγραμμο. Στην πλευρά ΑΒ πήραμε σημείο Ε τέτοιο ώστε η γωνία ΑΕΓ να είναι 137°. Πόσες μοίρες είναι η γωνία ΒΓΕ;',
      hasSvg: 'rect24',
      options: [
        { key: 'A', label: '43°', raw: '43°' },
        { key: 'B', label: '53°', raw: '53°' },
        { key: isEn ? 'C' : 'Γ', label: '47°', raw: '47°' },
        { key: isEn ? 'D' : 'Δ', label: '37°', raw: '37°' }
      ],
      correctRaw: '47°',
      explain: isEn ? (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-3">
            <div className="space-y-1">
              <div className="font-sans font-bold text-slate-900">1. Find angle BEC (Supplementary angle):</div>
              <p className="text-slate-700">Points A, E, and B lie on the straight side AB (180°):</p>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
                Angle BEC ＝ 180° － 137° ＝ <strong className="text-orange-700">43°</strong>
              </div>
            </div>
            <div className="space-y-1 pt-1 border-t border-slate-100">
              <div className="font-sans font-bold text-slate-900">2. Find angle BCE (Complementary angle in right triangle EBC):</div>
              <p className="text-slate-700">In right triangle EBC, angle B is 90°, so the two acute angles sum to 90°:</p>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
                Angle BCE ＝ 90° － 43° ＝ <strong className="text-emerald-700 text-base">47°</strong>
              </div>
            </div>
          </div>
          <p className="pt-1">Therefore, angle BCE is <strong>47°</strong> (Choice <strong>C</strong>).</p>
        </div>
      ) : (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-3">
            <div className="space-y-1">
              <div className="font-sans font-bold text-slate-900">1. Υπολογισμός της γωνίας ΒΕΓ (Παραπληρωματική γωνία):</div>
              <p className="text-slate-700">Τα σημεία Α, Ε, Β βρίσκονται πάνω στην ευθεία πλευρά ΑΒ (180°):</p>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
                Γωνία ΒΕΓ ＝ 180° － 137° ＝ <strong className="text-orange-700">43°</strong>
              </div>
            </div>
            <div className="space-y-1 pt-1 border-t border-slate-100">
              <div className="font-sans font-bold text-slate-900">2. Υπολογισμός της γωνίας ΒΓΕ (Συμπληρωματική γωνία στο ορθογώνιο τρίγωνο ΕΒΓ):</div>
              <p className="text-slate-700">Στο ορθογώνιο τρίγωνο ΕΒΓ, η γωνία Β είναι 90°, άρα οι δύο οξείες γωνίες έχουν άθροισμα 90°:</p>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
                Γωνία ΒΓΕ ＝ 90° － 43° ＝ <strong className="text-emerald-700 text-base">47°</strong>
              </div>
            </div>
          </div>
          <p className="pt-1">Επομένως, η γωνία ΒΓΕ είναι <strong>47°</strong> (Επιλογή <strong>Γ</strong>).</p>
        </div>
      )
    },
    {
      id: 5,
      officialNumber: 25,
      group: groupA,
      promptText: isEn
        ? 'The pie chart below shows the preferences of students at a school for three sports K, L, and M. Which of the bar charts A, B, C, and D correctly represents the data in the pie chart?'
        : 'Στο διπλανό κυκλικό διάγραμμα παριστάνονται οι προτιμήσεις των μαθητών ενός σχολείου για τρία αθλήματα Κ, Λ και Μ. Ποιο από τα ραβδογράμματα Α, Β, Γ και Δ παριστάνει σωστά τα δεδομένα του κυκλικού διαγράμματος;',
      hasSvg: 'pie25',
      options: isEn
        ? [
            { key: 'A', label: 'Bar chart A', raw: 'Bar chart A' },
            { key: 'B', label: 'Bar chart B', raw: 'Bar chart B' },
            { key: 'C', label: 'Bar chart C', raw: 'Bar chart C' },
            { key: 'D', label: 'Bar chart D', raw: 'Bar chart D' }
          ]
        : [
            { key: 'A', label: 'Το ραβδόγραμμα Α', raw: 'Το ραβδόγραμμα Α' },
            { key: 'B', label: 'Το ραβδόγραμμα Β', raw: 'Το ραβδόγραμμα Β' },
            { key: 'Γ', label: 'Το ραβδόγραμμα Γ', raw: 'Το ραβδόγραμμα Γ' },
            { key: 'Δ', label: 'Το ραβδόγραμμα Δ', raw: 'Το ραβδόγραμμα Δ' }
          ],
      correctRaw: isEn ? 'Bar chart C' : 'Το ραβδόγραμμα Γ',
      explain: isEn ? (
        <div className="space-y-4 text-xs sm:text-sm">
          <p>Observe the relative sizes of the three sectors in the pie chart:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Sector <strong>K</strong> is the smallest (1/4 of the circle ＝ 25%).</div>
            <div>• Sector <strong>L</strong> is visibly larger than K (approx. 30%).</div>
            <div>• Sector <strong>M</strong> is the largest of all (almost half the circle, approx. 45%).</div>
            <div className="pt-1 text-blue-700 font-bold">Thus: K &lt; L &lt; M</div>
          </div>
          <p>
            Bar chart <strong>B</strong> shows K ＝ M, <strong>D</strong> shows K &gt; L, and <strong>A</strong> makes K and L disproportionately tiny. Bar chart <strong>C</strong> accurately reflects the proportions (Choice <strong>C</strong>).
          </p>
        </div>
      ) : (
        <div className="space-y-4 text-xs sm:text-sm">
          <p>Παρατηρούμε τη σχετική διάταξη των τριών τομέων στο κυκλικό διάγραμμα:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Ο τομέας <strong>Κ</strong> είναι ο μικρότερος (<Frac num="1" den="4" /> του κύκλου ＝ 25%).</div>
            <div>• Ο τομέας <strong>Λ</strong> είναι εμφανώς μεγαλύτερος από τον Κ (περίπου 30%).</div>
            <div>• Ο τομέας <strong>Μ</strong> είναι ο μεγαλύτερος από όλους (σχεδόν το <Frac num="1" den="2" /> του κύκλου, περίπου 45%).</div>
            <div className="pt-1 text-blue-700 font-bold">Συνεπώς ισχύει: Κ &lt; Λ &lt; Μ</div>
          </div>
          <p>
            Το <strong>Β</strong> δείχνει Κ ＝ Μ, το <strong>Δ</strong> δείχνει Κ &gt; Λ, ενώ το <strong>Α</strong> δείχνει τα Κ και Λ υπερβολικά μικρά. Το σωστό ραβδόγραμμα είναι το <strong>Γ</strong> (Επιλογή <strong>Γ</strong>).
          </p>
        </div>
      )
    },
    {
      id: 6,
      officialNumber: 26,
      group: groupA,
      promptText: isEn
        ? 'Panagiotis is 7 years older than Afroditi. Afroditi is 7 years younger than Evangelia. If Panagiotis is 33 years old, how old is Evangelia?'
        : 'Ο Παναγιώτης είναι 7 χρόνια μεγαλύτερος από την Αφροδίτη. Η Αφροδίτη είναι 7 χρόνια μικρότερη από την Ευαγγελία. Αν ο Παναγιώτης είναι 33 ετών, πόσων ετών είναι η Ευαγγελία;',
      options: [
        { key: 'A', label: '26', raw: '26' },
        { key: 'B', label: '33', raw: '33' },
        { key: isEn ? 'C' : 'Γ', label: '40', raw: '40' },
        { key: isEn ? 'D' : 'Δ', label: '47', raw: '47' }
      ],
      correctRaw: '33',
      explain: isEn ? (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-2 font-mono text-slate-900">
            <div>• Panagiotis&apos;s age: <strong>33 years</strong></div>
            <div>• Afroditi&apos;s age ＝ 33 － 7 ＝ <strong>26 years</strong></div>
            <div>• Evangelia&apos;s age ＝ 26 ＋ 7 ＝ <strong className="text-emerald-700 text-base">33 years</strong></div>
          </div>
          <p className="pt-1">Therefore, Evangelia is <strong>33 years old</strong> (Choice <strong>B</strong>).</p>
        </div>
      ) : (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-2 font-mono text-slate-900">
            <div>• Ηλικία Παναγιώτη: <strong>33 έτη</strong></div>
            <div>• Ηλικία Αφροδίτης ＝ 33 － 7 ＝ <strong>26 έτη</strong></div>
            <div>• Ηλικία Ευαγγελίας ＝ 26 ＋ 7 ＝ <strong className="text-emerald-700 text-base">33 έτη</strong></div>
          </div>
          <p className="pt-1">Επομένως, η Ευαγγελία είναι <strong>33 ετών</strong> (Επιλογή <strong>B</strong>).</p>
        </div>
      )
    },
    {
      id: 7,
      officialNumber: 27,
      group: groupA,
      promptText: isEn
        ? 'A square plot of land has an area of 400 square meters. To fence it with wire mesh, we must pay 15 euros per meter. What is the cost of the fence?'
        : 'Τετράγωνο οικόπεδο έχει επιφάνεια 400 τετραγωνικά μέτρα. Για να το περιφράξουμε με συρματόπλεγμα πρέπει να πληρώσουμε 15 ευρώ ανά μέτρο. Ποιο είναι το κόστος της περίφραξης;',
      options: isEn
        ? [
            { key: 'A', label: '60,000 euros', raw: '60,000 euros' },
            { key: 'B', label: '6,000 euros', raw: '6,000 euros' },
            { key: 'C', label: '1,200 euros', raw: '1,200 euros' },
            { key: 'D', label: '300 euros', raw: '300 euros' }
          ]
        : [
            { key: 'A', label: '60.000 ευρώ', raw: '60.000 ευρώ' },
            { key: 'B', label: '6.000 ευρώ', raw: '6.000 ευρώ' },
            { key: 'Γ', label: '1.200 ευρώ', raw: '1.200 ευρώ' },
            { key: 'Δ', label: '300 ευρώ', raw: '300 ευρώ' }
          ],
      correctRaw: isEn ? '1,200 euros' : '1.200 ευρώ',
      explain: isEn ? (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-2.5 font-mono text-slate-900">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>1. Side length of the square: s ＝ <Radical>400</Radical> ＝ <strong>20 meters</strong></span>
            </div>
            <div>2. Perimeter (fence length): P ＝ 4 · 20 ＝ <strong>80 meters</strong></div>
            <div>3. Total cost: 80 · 15 ＝ <strong className="text-emerald-700 text-base">1,200 euros</strong></div>
          </div>
          <p className="pt-1">Therefore, the cost of the fence is <strong>1,200 euros</strong> (Choice <strong>C</strong>).</p>
        </div>
      ) : (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-2.5 font-mono text-slate-900">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>1. Πλευρά του τετραγώνου: a ＝ <Radical>400</Radical> ＝ <strong>20 μέτρα</strong></span>
            </div>
            <div>2. Περίμετρος (μήκος περίφραξης): Π ＝ 4 · 20 ＝ <strong>80 μέτρα</strong></div>
            <div>3. Συνολικό κόστος: 80 · 15 ＝ <strong className="text-emerald-700 text-base">1.200 ευρώ</strong></div>
          </div>
          <p className="pt-1">Επομένως, το κόστος της περίφραξης είναι <strong>1.200 ευρώ</strong> (Επιλογή <strong>Γ</strong>).</p>
        </div>
      )
    },
    {
      id: 8,
      officialNumber: 28,
      group: groupA,
      promptText: isEn ? (
        <span>
          With 4 identical glasses of water, <Frac num="3" den="5" /> of a pitcher is filled. With how many glasses is half the pitcher filled?
        </span>
      ) : (
        <span>
          Με 4 ίδια ποτήρια νερό γεμίζουν τα <Frac num="3" den="5" /> μιας κανάτας. Με πόσα ποτήρια γεμίζει η μισή κανάτα;
        </span>
      ),
      options: isEn
        ? [
            { key: 'A', label: <span>2<Frac num="2" den="5" /> glasses</span>, raw: '2 2/5 glasses' },
            { key: 'B', label: '3 glasses', raw: '3 glasses' },
            { key: 'C', label: <span>3<Frac num="1" den="3" /> glasses</span>, raw: '3 1/3 glasses' },
            { key: 'D', label: <span>3<Frac num="2" den="5" /> glasses</span>, raw: '3 2/5 glasses' }
          ]
        : [
            { key: 'A', label: <span>2<Frac num="2" den="5" /> ποτήρια</span>, raw: '2 2/5 ποτήρια' },
            { key: 'B', label: '3 ποτήρια', raw: '3 ποτήρια' },
            { key: 'Γ', label: <span>3<Frac num="1" den="3" /> ποτήρια</span>, raw: '3 1/3 ποτήρια' },
            { key: 'Δ', label: <span>3<Frac num="2" den="5" /> ποτήρια</span>, raw: '3 2/5 ποτήρια' }
          ],
      correctRaw: isEn ? '3 1/3 glasses' : '3 1/3 ποτήρια',
      explain: isEn ? (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>• <Frac num="3" den="5" /> of the pitcher takes <strong>4 glasses</strong>.</div>
            <div>• <Frac num="1" den="5" /> of the pitcher takes <Frac num="4" den="3" /> glasses.</div>
            <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-200">
              <span>• Half the pitcher (<Frac num="1" den="2" />) takes:</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="1" den="2" /> · 5 · <Frac num="4" den="3" /> ＝ <Frac num="10" den="3" />
              </span>
              <span className="whitespace-nowrap">＝ <strong className="text-emerald-700 text-base">3<Frac num="1" den="3" /> glasses</strong></span>
            </div>
          </div>
          <p className="pt-1">Thus, half the pitcher is filled with <strong>3<Frac num="1" den="3" /> glasses</strong> (Choice <strong>C</strong>).</p>
        </div>
      ) : (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>• Τα <Frac num="3" den="5" /> της κανάτας γεμίζουν με <strong>4 ποτήρια</strong>.</div>
            <div>• Το <Frac num="1" den="5" /> της κανάτας γεμίζει με <Frac num="4" den="3" /> ποτήρια.</div>
            <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-200">
              <span>• Η μισή κανάτα (<Frac num="1" den="2" />) χρειάζεται:</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="1" den="2" /> · 5 · <Frac num="4" den="3" /> ＝ <Frac num="10" den="3" />
              </span>
              <span className="whitespace-nowrap">＝ <strong className="text-emerald-700 text-base">3<Frac num="1" den="3" /> ποτήρια</strong></span>
            </div>
          </div>
          <p className="pt-1">Επομένως, η μισή κανάτα γεμίζει με <strong>3<Frac num="1" den="3" /> ποτήρια</strong> (Επιλογή <strong>Γ</strong>).</p>
        </div>
      )
    },
    {
      id: 9,
      officialNumber: 29,
      group: groupA,
      promptText: isEn
        ? 'Which of the following numbers is closest to 1?'
        : 'Ποιος από τους παρακάτω αριθμούς είναι πιο κοντά στο 1;',
      options: [
        { key: 'A', label: <Frac num="11" den="12" />, raw: '11/12' },
        { key: 'B', label: <Frac num="12" den="11" />, raw: '12/11' },
        { key: isEn ? 'C' : 'Γ', label: isEn ? '0.9' : '0,9', raw: isEn ? '0.9' : '0,9' },
        { key: isEn ? 'D' : 'Δ', label: isEn ? '1.101' : '1,101', raw: isEn ? '1.101' : '1,101' }
      ],
      correctRaw: '11/12',
      explain: isEn ? (
        <div className="space-y-4 text-xs sm:text-sm">
          <p>Calculate the distance of each number from <strong>1</strong>:</p>
          <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 font-mono text-slate-900 space-y-2">
            <div>• A: 1 － <Frac num="11" den="12" /> ＝ <strong className="text-emerald-700"><Frac num="1" den="12" /></strong> (≈ 0.0833)</div>
            <div>• B: <Frac num="12" den="11" /> － 1 ＝ <strong className="text-blue-700"><Frac num="1" den="11" /></strong> (≈ 0.0909)</div>
            <div>• C: 1 － 0.9 ＝ 0.1 ＝ <Frac num="1" den="10" /> (＝ 0.1000)</div>
            <div>• D: 1.101 － 1 ＝ 0.101</div>
          </div>
          <p className="pt-1">
            Since <Frac num="1" den="12" /> &lt; <Frac num="1" den="11" /> &lt; 0.1 &lt; 0.101, the closest number to 1 is <strong><Frac num="11" den="12" /></strong> (Choice <strong>A</strong>).
          </p>
        </div>
      ) : (
        <div className="space-y-4 text-xs sm:text-sm">
          <p>Υπολογίζουμε την απόσταση κάθε αριθμού από το <strong>1</strong>:</p>
          <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 font-mono text-slate-900 space-y-2">
            <div>• Α: 1 － <Frac num="11" den="12" /> ＝ <strong className="text-emerald-700"><Frac num="1" den="12" /></strong> (≈ 0,0833)</div>
            <div>• Β: <Frac num="12" den="11" /> － 1 ＝ <strong className="text-blue-700"><Frac num="1" den="11" /></strong> (≈ 0,0909)</div>
            <div>• Γ: 1 － 0,9 ＝ 0,1 ＝ <Frac num="1" den="10" /> (＝ 0,1000)</div>
            <div>• Δ: 1,101 － 1 ＝ 0,101</div>
          </div>
          <p className="pt-1">
            Επειδή <Frac num="1" den="12" /> &lt; <Frac num="1" den="11" /> &lt; 0,1 &lt; 0,101, ο πιο κοντινός αριθμός στο 1 είναι το <strong><Frac num="11" den="12" /></strong> (Επιλογή <strong>A</strong>).
          </p>
        </div>
      )
    },
    {
      id: 10,
      officialNumber: 30,
      group: groupA,
      promptText: isEn
        ? 'A box contains 52 white balls and 48 black balls. If we remove 40 white balls and 40 black balls from the box, which of the following is true?'
        : 'Σε ένα κουτί υπάρχουν 52 άσπρες και 48 μαύρες σφαίρες. Αν βγάλουμε 40 άσπρες και 40 μαύρες σφαίρες από το κουτί, ποιο από τα παρακάτω είναι σωστό;',
      options: isEn
        ? [
            { key: 'A', label: 'Neither the percentage of white balls nor the percentage of black balls in the box changes.', raw: 'Neither changes' },
            { key: 'B', label: 'Both the percentage of white balls and the percentage of black balls in the box increase.', raw: 'Both increase' },
            { key: 'C', label: 'The percentage of white balls decreases and the percentage of black balls in the box increases.', raw: 'White decreases, black increases' },
            { key: 'D', label: 'The percentage of white balls increases and the percentage of black balls in the box decreases.', raw: 'White increases, black decreases' }
          ]
        : [
            { key: 'A', label: 'Δεν αλλάζει το ποσοστό των άσπρων σφαιρών ούτε το ποσοστό των μαύρων σφαιρών στο κουτί.', raw: 'Δεν αλλάζει' },
            { key: 'B', label: 'Αυξάνεται το ποσοστό των άσπρων σφαιρών και αυξάνεται το ποσοστό των μαύρων σφαιρών στο κουτί.', raw: 'Αυξάνονται και τα δύο' },
            { key: 'Γ', label: 'Μειώνεται το ποσοστό των άσπρων σφαιρών και αυξάνεται το ποσοστό των μαύρων σφαιρών στο κουτί.', raw: 'Μειώνεται άσπρων, αυξάνεται μαύρων' },
            { key: 'Δ', label: 'Αυξάνεται το ποσοστό των άσπρων σφαιρών και μειώνεται το ποσοστό των μαύρων σφαιρών στο κουτί.', raw: 'Αυξάνεται άσπρων, μειώνεται μαύρων' }
          ],
      correctRaw: isEn ? 'White increases, black decreases' : 'Αυξάνεται άσπρων, μειώνεται μαύρων',
      explain: isEn ? (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-2.5 font-mono text-slate-900">
            <div>1. <strong>Initially (100 balls total):</strong> White ＝ <strong>52%</strong>, Black ＝ <strong>48%</strong>.</div>
            <div>2. <strong>After removing 40 white &amp; 40 black (20 balls left):</strong> 12 white and 8 black remain.</div>
            <div>• White: <Frac num="12" den="20" /> ＝ <Frac num="60" den="100" /> ＝ <strong className="text-emerald-700">60%</strong> (increased from 52%)</div>
            <div>• Black: <Frac num="8" den="20" /> ＝ <Frac num="40" den="100" /> ＝ <strong className="text-rose-700">40%</strong> (decreased from 48%)</div>
          </div>
          <p className="pt-1">Therefore, <strong>the percentage of white balls increases and the percentage of black balls decreases</strong> (Choice <strong>D</strong>).</p>
        </div>
      ) : (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-2.5 font-mono text-slate-900">
            <div>1. <strong>Αρχικά (100 σφαίρες):</strong> Άσπρες ＝ <strong>52%</strong>, Μαύρες ＝ <strong>48%</strong>.</div>
            <div>2. <strong>Μετά την αφαίρεση 40 άσπρων &amp; 40 μαύρων (20 σφαίρες):</strong> Μένουν 12 άσπρες και 8 μαύρες.</div>
            <div>• Άσπρες: <Frac num="12" den="20" /> ＝ <Frac num="60" den="100" /> ＝ <strong className="text-emerald-700">60%</strong> (αυξήθηκε από 52%)</div>
            <div>• Μαύρες: <Frac num="8" den="20" /> ＝ <Frac num="40" den="100" /> ＝ <strong className="text-rose-700">40%</strong> (μειώθηκε από 48%)</div>
          </div>
          <p className="pt-1">Συνεπώς, <strong>αυξάνεται το ποσοστό των άσπρων σφαιρών και μειώνεται το ποσοστό των μαύρων σφαιρών</strong> (Επιλογή <strong>Δ</strong>).</p>
        </div>
      )
    },
    {
      id: 11,
      officialNumber: 31,
      group: groupB,
      promptText: isEn
        ? 'On the number line below, line segment KL has twice the length of ML, while MN has twice the length of NL. If K corresponds to the number 5 and L corresponds to the number 35, what number corresponds to point N?'
        : 'Στην παρακάτω αριθμογραμμή, το ευθύγραμμο τμήμα ΚΛ έχει διπλάσιο μήκος από το ΜΛ, ενώ το ΜΝ έχει διπλάσιο μήκος από το ΝΛ. Αν στο Κ αντιστοιχεί ο αριθμός 5 και στο Λ ο αριθμός 35, ποιος αριθμός αντιστοιχεί στο σημείο Ν;',
      hasSvg: 'line31',
      options: [
        { key: 'A', label: '25', raw: '25' },
        { key: 'B', label: '27', raw: '27' },
        { key: isEn ? 'C' : 'Γ', label: '30', raw: '30' },
        { key: isEn ? 'D' : 'Δ', label: '32', raw: '32' },
        { key: 'E', label: '33', raw: '33' }
      ],
      correctRaw: '30',
      explain: isEn ? (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-2.5 font-mono text-slate-900">
            <div>1. Length(KL) ＝ 35 － 5 ＝ <strong>30 units</strong>.</div>
            <div>2. Since KL ＝ 2 · ML, we get ML ＝ <Frac num="30" den="2" /> ＝ <strong>15 units</strong>, so M ＝ 35 － 15 ＝ <strong>20</strong>.</div>
            <div>3. Since MN ＝ 2 · NL, segment ML (15 units) is split into 3 equal parts: NL ＝ <Frac num="15" den="3" /> ＝ <strong>5 units</strong> and MN ＝ <strong>10 units</strong>.</div>
            <div>4. Position of N ＝ 20 ＋ 10 ＝ <strong className="text-emerald-700 text-base">30</strong>.</div>
          </div>
          <p className="pt-1">Therefore, point N corresponds to the number <strong>30</strong> (Choice <strong>C</strong>).</p>
        </div>
      ) : (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-2.5 font-mono text-slate-900">
            <div>1. Μήκος(ΚΛ) ＝ 35 － 5 ＝ <strong>30 μονάδες</strong>.</div>
            <div>2. Αφού ΚΛ ＝ 2 · ΜΛ, έχουμε ΜΛ ＝ <Frac num="30" den="2" /> ＝ <strong>15 μονάδες</strong>, άρα Μ ＝ 35 － 15 ＝ <strong>20</strong>.</div>
            <div>3. Αφού ΜΝ ＝ 2 · ΝΛ, το τμήμα ΜΛ (15 μονάδες) χωρίζεται σε 3 ίσα μέρη: ΝΛ ＝ <Frac num="15" den="3" /> ＝ <strong>5 μονάδες</strong> και ΜΝ ＝ <strong>10 μονάδες</strong>.</div>
            <div>4. Θέση του Ν ＝ 20 ＋ 10 ＝ <strong className="text-emerald-700 text-base">30</strong>.</div>
          </div>
          <p className="pt-1">Επομένως, στο σημείο Ν αντιστοιχεί ο αριθμός <strong>30</strong> (Επιλογή <strong>Γ</strong>).</p>
        </div>
      )
    },
    {
      id: 12,
      officialNumber: 32,
      group: groupB,
      promptText: isEn
        ? 'The 1st bus from city K to city L departs at 6:20 AM. The trip takes 3.5 hours. Each subsequent bus departs every 1 hour and 10 minutes. If the last bus arrives in city L between 5:30 PM and 6:30 PM, what time did the last bus depart from city K?'
        : 'Το 1ο δρομολόγιο λεωφορείου από την πόλη Κ προς την πόλη Λ φεύγει στις 6:20 π.μ. Το ταξίδι διαρκεί 3,5 ώρες. Κάθε επόμενο δρομολόγιο φεύγει μετά από 1 ώρα και 10 λεπτά. Αν το τελευταίο δρομολόγιο φτάνει στην πόλη Λ μεταξύ 5:30 μ.μ. με 6:30 μ.μ., τι ώρα έφυγε το τελευταίο δρομολόγιο από την πόλη Κ;',
      options: isEn
        ? [
            { key: 'A', label: '2:30 PM', raw: '2:30 PM' },
            { key: 'B', label: '2:40 PM', raw: '2:40 PM' },
            { key: 'C', label: '2:50 PM', raw: '2:50 PM' },
            { key: 'D', label: '3:00 PM', raw: '3:00 PM' },
            { key: 'E', label: '3:10 PM', raw: '3:10 PM' }
          ]
        : [
            { key: 'A', label: '2:30 μ.μ.', raw: '2:30 μ.μ.' },
            { key: 'B', label: '2:40 μ.μ.', raw: '2:40 μ.μ.' },
            { key: 'Γ', label: '2:50 μ.μ.', raw: '2:50 μ.μ.' },
            { key: 'Δ', label: '3:00 μ.μ.', raw: '3:00 μ.μ.' },
            { key: 'E', label: '3:10 μ.μ.', raw: '3:10 μ.μ.' }
          ],
      correctRaw: isEn ? '2:30 PM' : '2:30 μ.μ.',
      explain: isEn ? (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-2.5 font-mono text-slate-900">
            <div>1. Trip duration is 3h 30m. To arrive between 5:30 PM and 6:30 PM, departure must be between <strong>2:00 PM</strong> and <strong>3:00 PM</strong>.</div>
            <div>2. Departures every 1h 10m: 06:20, 07:30, 08:40, 09:50, 11:00, 12:10, 13:20, <strong className="text-emerald-700">14:30 (2:30 PM)</strong>.</div>
            <div>3. Arrival check: 2:30 PM ＋ 3h 30m ＝ <strong>6:00 PM</strong> (within 5:30 PM – 6:30 PM ✅).</div>
          </div>
          <p className="pt-1">Thus, the last bus departed at <strong>2:30 PM</strong> (Choice <strong>A</strong>).</p>
        </div>
      ) : (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-2.5 font-mono text-slate-900">
            <div>1. Η διάρκεια είναι 3ω 30λ. Για άφιξη μεταξύ 5:30 μ.μ. και 6:30 μ.μ., η αναχώρηση πρέπει να γίνει μεταξύ <strong>2:00 μ.μ.</strong> και <strong>3:00 μ.μ.</strong></div>
            <div>2. Αναχωρήσεις ανά 1ω 10λ: 06:20, 07:30, 08:40, 09:50, 11:00, 12:10, 13:20, <strong className="text-emerald-700">14:30 (2:30 μ.μ.)</strong>.</div>
            <div>3. Έλεγχος άφιξης: 2:30 μ.μ. ＋ 3ω 30λ ＝ <strong>6:00 μ.μ.</strong> (εντός του 5:30 – 6:30 μ.μ. ✅).</div>
          </div>
          <p className="pt-1">Συνεπώς, το τελευταίο δρομολόγιο έφυγε στις <strong>2:30 μ.μ.</strong> (Επιλογή <strong>A</strong>).</p>
        </div>
      )
    },
    {
      id: 13,
      officialNumber: 33,
      group: groupB,
      promptText: isEn
        ? 'In artistic gymnastics, 6 judges score a routine, and the final score is the average of four of them since the highest and lowest scores are dropped. If in an event the average of all 6 judges was 8.2 and the final average (after dropping the highest and lowest scores) was 8.3, what was the sum of the two dropped scores?'
        : 'Στο άθλημα της ενόργανης γυμναστικής βαθμολογούν 6 κριτές και η τελική βαθμολογία προκύπτει από τον μέσο όρο των τεσσάρων από αυτούς καθώς δεν λαμβάνονται υπόψη ο μεγαλύτερος και ο μικρότερος βαθμός. Αν σε ένα αγώνισμα ο μέσος όρος των 6 κριτών ήταν 8,2 και ο τελικός μέσος όρος (αφού αφαιρέθηκαν η μεγαλύτερη και η μικρότερη βαθμολογία) ήταν 8,3 ποιο ήταν το άθροισμα των βαθμών που αφαιρέθηκαν;',
      options: [
        { key: 'A', label: '16', raw: '16' },
        { key: 'B', label: isEn ? '16.8' : '16,8', raw: isEn ? '16.8' : '16,8' },
        { key: isEn ? 'C' : 'Γ', label: '17', raw: '17' },
        { key: isEn ? 'D' : 'Δ', label: isEn ? '17.6' : '17,6', raw: isEn ? '17.6' : '17,6' },
        { key: 'E', label: isEn ? 'cannot be determined' : 'δεν μπορούμε να γνωρίζουμε', raw: isEn ? 'cannot be determined' : 'δεν μπορούμε να γνωρίζουμε' }
      ],
      correctRaw: '16',
      explain: isEn ? (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>• Sum of all 6 judges: 6 · 8.2 ＝ <strong>49.2</strong></div>
            <div>• Sum of the 4 middle judges: 4 · 8.3 ＝ <strong>33.2</strong></div>
            <div className="pt-2 border-t border-slate-200">
              Sum of the 2 dropped scores ＝ 49.2 － 33.2 ＝ <strong className="text-emerald-700 text-base">16</strong>
            </div>
          </div>
          <p className="pt-1">Thus, the sum of the dropped scores was <strong>16</strong> (Choice <strong>A</strong>).</p>
        </div>
      ) : (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>• Συνολικό άθροισμα και των 6 κριτών: 6 · 8,2 ＝ <strong>49,2</strong></div>
            <div>• Συνολικό άθροισμα των 4 μεσαίων κριτών: 4 · 8,3 ＝ <strong>33,2</strong></div>
            <div className="pt-2 border-t border-slate-200">
              Άθροισμα των 2 βαθμών που αφαιρέθηκαν ＝ 49,2 － 33,2 ＝ <strong className="text-emerald-700 text-base">16</strong>
            </div>
          </div>
          <p className="pt-1">Άρα, το άθροισμα των βαθμών που αφαιρέθηκαν είναι <strong>16</strong> (Επιλογή <strong>A</strong>).</p>
        </div>
      )
    },
    {
      id: 14,
      officialNumber: 34,
      group: groupB,
      promptText: isEn
        ? 'A rectangular piece of cardboard has a perimeter of 50 cm. We fold it in half and obtain a rectangle with a perimeter of 40 cm. What is the area of the original rectangle?'
        : 'Ένα χαρτόνι σχήματος ορθογωνίου παραλληλογράμμου έχει περίμετρο 50 εκ. Το διπλώνουμε στη μέση και προκύπτει ορθογώνιο παραλληλόγραμμο που έχει περίμετρο 40 εκ. Πόσο είναι το εμβαδόν του αρχικού ορθογωνίου παραλληλογράμμου;',
      options: isEn
        ? [
            { key: 'A', label: '200 sq. cm.', raw: '200 sq. cm.' },
            { key: 'B', label: '250 sq. cm.', raw: '250 sq. cm.' },
            { key: 'C', label: '400 sq. cm.', raw: '400 sq. cm.' },
            { key: 'D', label: '150 sq. cm.', raw: '150 sq. cm.' },
            { key: 'E', label: '600 sq. cm.', raw: '600 sq. cm.' }
          ]
        : [
            { key: 'A', label: '200 τ.εκ.', raw: '200 τ.εκ.' },
            { key: 'B', label: '250 τ.εκ.', raw: '250 τ.εκ.' },
            { key: 'Γ', label: '400 τ.εκ.', raw: '400 τ.εκ.' },
            { key: 'Δ', label: '150 τ.εκ.', raw: '150 τ.εκ.' },
            { key: 'E', label: '600 τ.εκ.', raw: '600 τ.εκ.' }
          ],
      correctRaw: isEn ? '150 sq. cm.' : '150 τ.εκ.',
      explain: isEn ? (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>1. Original perimeter: 2x ＋ 2y ＝ 50 ➔ <strong>x ＋ y ＝ 25</strong></div>
            <div>2. Folded perimeter (side x is halved to <Frac num="x" den="2" />): x ＋ 2y ＝ 40 ➔ (x ＋ y) ＋ y ＝ 40</div>
            <div>3. Substitute x ＋ y ＝ 25: 25 ＋ y ＝ 40 ➔ <strong>y ＝ 15 cm</strong> and <strong>x ＝ 10 cm</strong></div>
            <div className="pt-1 border-t border-slate-200">
              Original Area ＝ x · y ＝ 10 · 15 ＝ <strong className="text-emerald-700 text-base">150 sq. cm.</strong>
            </div>
          </div>
          <p className="pt-1">Therefore, the area of the original rectangle is <strong>150 sq. cm.</strong> (Choice <strong>D</strong>).</p>
        </div>
      ) : (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>1. Αρχική περίμετρος: 2x ＋ 2y ＝ 50 ➔ <strong>x ＋ y ＝ 25</strong></div>
            <div>2. Περίμετρος διπλωμένου (η πλευρά x γίνεται <Frac num="x" den="2" />): x ＋ 2y ＝ 40 ➔ (x ＋ y) ＋ y ＝ 40</div>
            <div>3. Αντικαθιστούμε x ＋ y ＝ 25: 25 ＋ y ＝ 40 ➔ <strong>y ＝ 15 εκ.</strong> και <strong>x ＝ 10 εκ.</strong></div>
            <div className="pt-1 border-t border-slate-200">
              Εμβαδόν αρχικού ＝ x · y ＝ 10 · 15 ＝ <strong className="text-emerald-700 text-base">150 τ.εκ.</strong>
            </div>
          </div>
          <p className="pt-1">Επομένως, το εμβαδόν του αρχικού ορθογωνίου είναι <strong>150 τ.εκ.</strong> (Επιλογή <strong>Δ</strong>).</p>
        </div>
      )
    },
    {
      id: 15,
      officialNumber: 35,
      group: groupB,
      promptText: isEn
        ? 'Today is Saturday, April 25, 2026. What day of the week will April 25, 2031 be? (The year 2028 is a leap year).'
        : 'Σήμερα είναι Σάββατο 25 Απριλίου 2026. Τι μέρα θα είναι η 25η Απριλίου του 2031; (Το έτος 2028 είναι δίσεκτο).',
      options: isEn
        ? [
            { key: 'A', label: 'Thursday', raw: 'Thursday' },
            { key: 'B', label: 'Friday', raw: 'Friday' },
            { key: 'C', label: 'Saturday', raw: 'Saturday' },
            { key: 'D', label: 'Sunday', raw: 'Sunday' },
            { key: 'E', label: 'Monday', raw: 'Monday' }
          ]
        : [
            { key: 'A', label: 'Πέμπτη', raw: 'Πέμπτη' },
            { key: 'B', label: 'Παρασκευή', raw: 'Παρασκευή' },
            { key: 'Γ', label: 'Σάββατο', raw: 'Σάββατο' },
            { key: 'Δ', label: 'Κυριακή', raw: 'Κυριακή' },
            { key: 'E', label: 'Δευτέρα', raw: 'Δευτέρα' }
          ],
      correctRaw: isEn ? 'Friday' : 'Παρασκευή',
      explain: isEn ? (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>• From April 25, 2026 to April 25, 2031 there are <strong>5 years</strong>: 4 common years (＋1 day each) and 1 leap year (2028, ＋2 days).</div>
            <div>• Total day shift ＝ 4 · 1 ＋ 1 · 2 ＝ <strong className="text-emerald-700">＋6 days</strong>.</div>
            <div>• Saturday ＋ 6 days ➔ <strong className="text-emerald-700 text-base">Friday</strong>.</div>
          </div>
          <p className="pt-1">Therefore, April 25, 2031 will be a <strong>Friday</strong> (Choice <strong>B</strong>).</p>
        </div>
      ) : (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>• Από 25 Απριλίου 2026 έως 25 Απριλίου 2031 μεσολαβούν <strong>5 έτη</strong>: 4 κοινά έτη (＋1 ημέρα το καθένα) και 1 δίσεκτο (το 2028, ＋2 ημέρες).</div>
            <div>• Συνολική μετατόπιση ＝ 4 · 1 ＋ 1 · 2 ＝ <strong className="text-emerald-700">＋6 ημέρες</strong>.</div>
            <div>• Σάββατο ＋ 6 ημέρες ➔ <strong className="text-emerald-700 text-base">Παρασκευή</strong>.</div>
          </div>
          <p className="pt-1">Επομένως, η 25η Απριλίου 2031 θα είναι <strong>Παρασκευή</strong> (Επιλογή <strong>B</strong>).</p>
        </div>
      )
    },
    {
      id: 16,
      officialNumber: 36,
      group: groupB,
      promptText: isEn
        ? 'The equilateral triangle on the left consists of 9 identical smaller equilateral triangles. We shade part of the triangle, as shown on the right. What fraction of the area of the large triangle is the shaded part?'
        : 'Το ισόπλευρο τρίγωνο του σχήματος στα αριστερά αποτελείται από 9 ίσα μεταξύ τους ισόπλευρα τρίγωνα. Χρωματίζουμε ένα μέρος του τριγώνου, όπως στο σχήμα στα δεξιά. Τι κλάσμα του εμβαδού του μεγάλου τριγώνου είναι το χρωματισμένο μέρος;',
      hasSvg: 'triangle36',
      options: [
        { key: 'A', label: <Frac num="2" den="9" />, raw: '2/9' },
        { key: 'B', label: <Frac num="3" den="9" />, raw: '3/9' },
        { key: isEn ? 'C' : 'Γ', label: <Frac num="4" den="9" />, raw: '4/9' },
        { key: isEn ? 'D' : 'Δ', label: <Frac num="1" den="2" />, raw: '1/2' },
        { key: 'E', label: <Frac num="7" den="18" />, raw: '7/18' }
      ],
      correctRaw: '4/9',
      explain: isEn ? (
        <div className="space-y-4 text-xs sm:text-sm">
          <p>
            By rearranging the complementary triangles cut by the two diagonals, the shaded region equals exactly <strong>4 complete small equilateral triangles</strong> out of the 9 identical small triangles:
          </p>
          <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 font-mono text-slate-900">
            Shaded fraction ＝ <strong className="text-emerald-700 text-base"><Frac num="4" den="9" /></strong>
          </div>
          <p className="pt-1">Therefore, the shaded part is <strong><Frac num="4" den="9" /></strong> of the large triangle (Choice <strong>C</strong>).</p>
        </div>
      ) : (
        <div className="space-y-4 text-xs sm:text-sm">
          <p>
            Μετακινώντας τα συμπληρωματικά τρίγωνα που σχηματίζουν οι δύο διαγώνιες, το συνολικό χρωματισμένο εμβαδόν ισοδυναμεί ακριβώς με <strong>4 ολόκληρα μικρά ισόπλευρα τρίγωνα</strong> από τα 9:
          </p>
          <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 font-mono text-slate-900">
            Ζητούμενο κλάσμα ＝ <strong className="text-emerald-700 text-base"><Frac num="4" den="9" /></strong>
          </div>
          <p className="pt-1">Επομένως, το χρωματισμένο μέρος είναι τα <strong><Frac num="4" den="9" /></strong> του μεγάλου τριγώνου (Επιλογή <strong>Γ</strong>).</p>
        </div>
      )
    },
    {
      id: 17,
      officialNumber: 37,
      group: groupB,
      promptText: isEn
        ? 'An elementary school has 285 students. If 138 attend a grade higher than 3rd grade (4th, 5th, 6th), while 189 attend a grade lower than 5th grade (1st, 2nd, 3rd, 4th), how many students attend 4th grade?'
        : 'Σε ένα Δημοτικό σχολείο φοιτούν 285 μαθητές. Αν οι 138 φοιτούν σε μεγαλύτερη τάξη από τη Γ΄ (Δ΄, Ε΄, ΣΤ΄), ενώ οι 189 φοιτούν σε μικρότερη τάξη από την Ε΄ (Α΄, Β΄, Γ΄, Δ΄), πόσοι μαθητές φοιτούν στη Δ΄ τάξη;',
      options: [
        { key: 'A', label: '39', raw: '39' },
        { key: 'B', label: '42', raw: '42' },
        { key: isEn ? 'C' : 'Γ', label: '45', raw: '45' },
        { key: isEn ? 'D' : 'Δ', label: '46', raw: '46' },
        { key: 'E', label: '80', raw: '80' }
      ],
      correctRaw: '42',
      explain: isEn ? (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>• Students in Grades (5th ＋ 6th) ＝ 285 － 189 ＝ <strong>96 students</strong>.</div>
            <div>• Since Grades (4th ＋ 5th ＋ 6th) have 138 students:</div>
            <div className="pt-1 border-t border-slate-200">
              4th-grade students ＝ 138 － 96 ＝ <strong className="text-emerald-700 text-base">42 students</strong>
            </div>
          </div>
          <p className="pt-1">Therefore, <strong>42 students</strong> attend 4th grade (Choice <strong>B</strong>).</p>
        </div>
      ) : (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>• Μαθητές (Ε΄ ＋ ΣΤ΄) ＝ 285 － 189 ＝ <strong>96 μαθητές</strong>.</div>
            <div>• Εφόσον οι τάξεις (Δ΄ ＋ Ε΄ ＋ ΣΤ΄) έχουν 138 μαθητές:</div>
            <div className="pt-1 border-t border-slate-200">
              Μαθητές Δ΄ τάξης ＝ 138 － 96 ＝ <strong className="text-emerald-700 text-base">42 μαθητές</strong>
            </div>
          </div>
          <p className="pt-1">Επομένως, στη Δ΄ τάξη φοιτούν <strong>42 μαθητές</strong> (Επιλογή <strong>B</strong>).</p>
        </div>
      )
    },
    {
      id: 18,
      officialNumber: 38,
      group: groupB,
      promptText: isEn
        ? 'The crew of a ship has food supplies for 6 days. If the crew had 10 fewer members, the food supplies would last for 8 days. How many members are in the crew?'
        : 'Το πλήρωμα ενός πλοίου έχει τρόφιμα για 6 ημέρες. Αν το πλήρωμα είχε 10 μέλη λιγότερα, θα είχε τρόφιμα για 8 ημέρες. Πόσα είναι τα μέλη του πληρώματος;',
      options: [
        { key: 'A', label: '30', raw: '30' },
        { key: 'B', label: '40', raw: '40' },
        { key: isEn ? 'C' : 'Γ', label: '50', raw: '50' },
        { key: isEn ? 'D' : 'Δ', label: '60', raw: '60' },
        { key: 'E', label: '80', raw: '80' }
      ],
      correctRaw: '40',
      explain: isEn ? (
        <div className="space-y-4 text-xs sm:text-sm">
          <p>Crew size and days of food are <strong>inversely proportional</strong> (total rations stay constant):</p>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>6 · x ＝ 8 · (x － 10)</div>
            <div>6x ＝ 8x － 80 ➔ 2x ＝ 80</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>x ＝</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="80" den="2" /> ➔ <strong className="text-emerald-700 text-base">x ＝ 40 members</strong>
              </span>
            </div>
          </div>
          <p className="pt-1">Therefore, there are <strong>40</strong> crew members (Choice <strong>B</strong>).</p>
        </div>
      ) : (
        <div className="space-y-4 text-xs sm:text-sm">
          <p>Το πλήθος των μελών και οι ημέρες είναι <strong>αντιστρόφως ανάλογα</strong> (οι συνολικές μερίδες παραμένουν σταθερές):</p>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>6 · x ＝ 8 · (x － 10)</div>
            <div>6x ＝ 8x － 80 ➔ 2x ＝ 80</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>x ＝</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="80" den="2" /> ➔ <strong className="text-emerald-700 text-base">x ＝ 40 μέλη</strong>
              </span>
            </div>
          </div>
          <p className="pt-1">Επομένως, τα μέλη του πληρώματος είναι <strong>40</strong> (Επιλογή <strong>B</strong>).</p>
        </div>
      )
    },
    {
      id: 19,
      officialNumber: 39,
      group: groupB,
      promptText: isEn
        ? 'At a taverna, 4 families sat together (two parents with their children). Two families had two children each, one family had three children, and another family had only one child. At first, they thought of splitting the bill proportionally to the number of people. However, they eventually agreed that each family would pay 1/4 of the bill. By what percentage (%) less did the family with three children pay compared to its initial obligation?'
        : 'Σε μια ταβέρνα κάθισαν 4 οικογένειες (δύο γονείς με τα παιδιά τους). Οι δύο οικογένειες είχαν από δύο παιδιά, μία οικογένεια είχε τρία παιδιά και άλλη μία είχε μόνο ένα παιδί. Στην αρχή σκέφτηκαν να πληρώσουν τον λογαριασμό ανάλογα με τα άτομα. Όμως τελικά συμφώνησαν να πληρώσει κάθε οικογένεια το 1/4 του λογαριασμού. Πόσο % λιγότερο πλήρωσε η οικογένεια με τα τρία παιδιά σε σχέση με την αρχική της υποχρέωση;',
      options: isEn
        ? [
            { key: 'A', label: '25%', raw: '25%' },
            { key: 'B', label: '20%', raw: '20%' },
            { key: 'C', label: '16%', raw: '16%' },
            { key: 'D', label: '6.25%', raw: '6.25%' },
            { key: 'E', label: 'More than 25%', raw: 'More than 25%' }
          ]
        : [
            { key: 'A', label: '25%', raw: '25%' },
            { key: 'B', label: '20%', raw: '20%' },
            { key: 'Γ', label: '16%', raw: '16%' },
            { key: 'Δ', label: '6,25%', raw: '6,25%' },
            { key: 'E', label: 'Περισσότερο από 25%', raw: 'Περισσότερο από 25%' }
          ],
      correctRaw: '20%',
      explain: isEn ? (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>1. Total people ＝ (2 ＋ 2) ＋ (2 ＋ 2) ＋ (2 ＋ 3) ＋ (2 ＋ 1) ＝ 4 ＋ 4 ＋ 5 ＋ 3 ＝ <strong>16 people</strong>.</div>
            <div>2. Family with 3 children (5 people): Initial share ＝ <Frac num="5" den="16" />, Final share ＝ <Frac num="1" den="4" /> ＝ <Frac num="4" den="16" />.</div>
            <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-200">
              <span>3. Reduction relative to initial obligation ＝</span>
              <ComplexFrac
                num={<Frac num="1" den="16" small />}
                den={<Frac num="5" den="16" small />}
              />
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                ＝ <Frac num="1" den="5" /> ＝ <strong className="text-emerald-700 text-base">20%</strong>
              </span>
            </div>
          </div>
          <p className="pt-1">Therefore, the family with three children paid <strong>20%</strong> less (Choice <strong>B</strong>).</p>
        </div>
      ) : (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>1. Σύνολο ατόμων ＝ (2 ＋ 2) ＋ (2 ＋ 2) ＋ (2 ＋ 3) ＋ (2 ＋ 1) ＝ 4 ＋ 4 ＋ 5 ＋ 3 ＝ <strong>16 άτομα</strong>.</div>
            <div>2. Οικογένεια με 3 παιδιά (5 άτομα): Αρχική υποχρέωση ＝ <Frac num="5" den="16" />, Τελική πληρωμή ＝ <Frac num="1" den="4" /> ＝ <Frac num="4" den="16" />.</div>
            <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-200">
              <span>3. Ποσοστό μείωσης ως προς την αρχική υποχρέωση ＝</span>
              <ComplexFrac
                num={<Frac num="1" den="16" small />}
                den={<Frac num="5" den="16" small />}
              />
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                ＝ <Frac num="1" den="5" /> ＝ <strong className="text-emerald-700 text-base">20%</strong>
              </span>
            </div>
          </div>
          <p className="pt-1">Επομένως, η οικογένεια με τα τρία παιδιά πλήρωσε <strong>20%</strong> λιγότερο (Επιλογή <strong>B</strong>).</p>
        </div>
      )
    },
    {
      id: 20,
      officialNumber: 40,
      group: groupB,
      promptText: isEn
        ? 'A white bicycle travels a distance of 48 km at a speed of 24 km/h and returns at the same speed. A black bicycle starts at the same time as the white one and travels the same route at a speed of 30 km/h, but returns at 18 km/h. Which of the two will return first, and how far is the other one from the finish line at that moment?'
        : 'Ένα άσπρο ποδήλατο διανύει μια απόσταση 48 χλμ. με ταχύτητα 24 χλμ./ώρα και επιστρέφει με την ίδια ταχύτητα. Ένα μαύρο ποδήλατο ξεκινάει ταυτόχρονα με το άσπρο και διανύει την ίδια διαδρομή με ταχύτητα 30 χλμ./ώρα, αλλά επιστρέφει με 18 χλμ./ώρα. Ποιο από τα δύο θα επιστρέψει πρώτο και πόσο απέχει το επόμενο τη στιγμή του τερματισμού;',
      options: isEn
        ? [
            { key: 'A', label: 'They will arrive at the same time', raw: 'They will arrive at the same time' },
            { key: 'B', label: 'The black one will arrive first and is 4.8 km ahead of the white one.', raw: 'The black one will arrive first and is 4.8 km ahead of the white one.' },
            { key: 'C', label: 'The black one will arrive first and is 2.4 km ahead of the white one.', raw: 'The black one will arrive first and is 2.4 km ahead of the white one.' },
            { key: 'D', label: 'The white one will arrive first and is 2.4 km ahead of the black one.', raw: 'The white one will arrive first and is 2.4 km ahead of the black one.' },
            { key: 'E', label: 'The white one will arrive first and is 4.8 km ahead of the black one.', raw: 'The white one will arrive first and is 4.8 km ahead of the black one.' }
          ]
        : [
            { key: 'A', label: 'Θα φτάσουν ταυτόχρονα', raw: 'Θα φτάσουν ταυτόχρονα' },
            { key: 'B', label: 'Το μαύρο θα φτάσει πρώτο και απέχει 4,8 χλμ. από το άσπρο.', raw: 'Το μαύρο θα φτάσει πρώτο και απέχει 4,8 χλμ. από το άσπρο.' },
            { key: 'Γ', label: 'Το μαύρο θα φτάσει πρώτο και απέχει 2,4 χλμ. από το άσπρο.', raw: 'Το μαύρο θα φτάσει πρώτο και απέχει 2,4 χλμ. από το άσπρο.' },
            { key: 'Δ', label: 'Το άσπρο θα φτάσει πρώτο και απέχει 2,4 χλμ. από το μαύρο.', raw: 'Το άσπρο θα φτάσει πρώτο και απέχει 2,4 χλμ. από το μαύρο.' },
            { key: 'E', label: 'Το άσπρο θα φτάσει πρώτο και απέχει 4,8 χλμ. από το μαύρο.', raw: 'Το άσπρο θα φτάσει πρώτο και απέχει 4,8 χλμ. από το μαύρο.' }
          ],
      correctRaw: isEn
        ? 'The white one will arrive first and is 4.8 km ahead of the black one.'
        : 'Το άσπρο θα φτάσει πρώτο και απέχει 4,8 χλμ. από το μαύρο.',
      explain: isEn ? (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>1. <strong>White bicycle:</strong> Going ＝ <Frac num="48" den="24" /> ＝ 2 h, Returning ＝ <Frac num="48" den="24" /> ＝ 2 h ➔ Total ＝ <strong>4 hours</strong> (finishes first).</div>
            <div>2. <strong>Black bicycle at 4 hours:</strong> Going ＝ <Frac num="48" den="30" /> ＝ <strong>1.6 h</strong>.</div>
            <div>• Remaining time until 4 h: 4 － 1.6 ＝ <strong>2.4 hours</strong>.</div>
            <div>• Distance covered on return: 2.4 · 18 ＝ <strong>43.2 km</strong>.</div>
            <div className="pt-1 border-t border-slate-200">
              • Distance left to finish line: 48 － 43.2 ＝ <strong className="text-emerald-700 text-base">4.8 km</strong>
            </div>
          </div>
          <p className="pt-1">Therefore, <strong>the white one will arrive first and is 4.8 km ahead of the black one</strong> (Choice <strong>E</strong>).</p>
        </div>
      ) : (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>1. <strong>Άσπρο ποδήλατο:</strong> Μετάβαση ＝ <Frac num="48" den="24" /> ＝ 2 ω., Επιστροφή ＝ <Frac num="48" den="24" /> ＝ 2 ω. ➔ Σύνολο ＝ <strong>4 ώρες</strong> (τερματίζει πρώτο).</div>
            <div>2. <strong>Μαύρο ποδήλατο στις 4 ώρες:</strong> Μετάβαση ＝ <Frac num="48" den="30" /> ＝ <strong>1,6 ώρες</strong>.</div>
            <div>• Υπόλοιπος χρόνος μέχρι τις 4 ω.: 4 － 1,6 ＝ <strong>2,4 ώρες</strong>.</div>
            <div>• Απόσταση στην επιστροφή: 2,4 · 18 ＝ <strong>43,2 χλμ.</strong></div>
            <div className="pt-1 border-t border-slate-200">
              • Απόσταση που υπολείπεται μέχρι τον τερματισμό: 48 － 43,2 ＝ <strong className="text-emerald-700 text-base">4,8 χλμ.</strong>
            </div>
          </div>
          <p className="pt-1">Επομένως, <strong>το άσπρο θα φτάσει πρώτο και απέχει 4,8 χλμ. από το μαύρο</strong> (Επιλογή <strong>E</strong>).</p>
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
      const b = extractPlainText(node.props.base, isEn).trim();
      return `${b}^${node.props.exp}`;
    }
    return extractPlainText(node.props.children, isEn);
  }
  return '';
}

export default function Themata2026Page() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const isEn = locale === 'en';
  const t = I18N[locale];
  const questions = getQuestions2026(locale);

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
    questions.forEach((q, index) => {
      if (currentAnswers[q.id] === q.correctRaw) {
        s += index < 10 ? 2 : 3;
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

  const schema2026 = [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": t.schemaHome, "item": `${baseUrl}/` },
        { "@type": "ListItem", "position": 2, "name": t.schemaHub, "item": `${baseUrl}/protipa/protipa` },
        { "@type": "ListItem", "position": 3, "name": t.schemaCurrent, "item": `${baseUrl}/protipa/themata-2026` }
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

  const renderQuestionSvg = (svgType) => {
    if (svgType === 'grid23') {
      const [kLabel, lLabel] = t.grid23Labels;
      return (
        <div className="flex justify-center p-3 bg-slate-50 rounded-2xl border border-slate-200">
          <svg
            viewBox="0 0 160 160"
            className="w-full max-w-[180px] h-auto select-none mx-auto block"
            role="img"
            aria-label={t.grid23Aria}
          >
            <rect x="20" y="20" width="120" height="120" fill="none" stroke="#334155" strokeWidth="2.5" />
            <line x1="80" y1="20" x2="80" y2="140" stroke="#334155" strokeWidth="2.5" />
            <line x1="20" y1="80" x2="140" y2="80" stroke="#334155" strokeWidth="2.5" />
            {[20, 80, 140].map(x => [20, 80, 140].map(y => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="4.5" fill="#0f172a" />
            )))}
            <text x="8" y="152" fill="#0f172a" fontSize="14" fontWeight="bold">{kLabel}</text>
            <text x="146" y="22" fill="#0f172a" fontSize="14" fontWeight="bold">{lLabel}</text>
          </svg>
        </div>
      );
    }

    if (svgType === 'rect24') {
      const [vA, vE, vB, vC, vD] = t.rect24Labels;
      return (
        <div className="flex justify-center p-3 bg-slate-50 rounded-2xl border border-slate-200">
          <svg
            viewBox="0 0 250 130"
            className="w-full max-w-[260px] h-auto select-none mx-auto block"
            role="img"
            aria-label={t.rect24Aria}
          >
            <rect x="25" y="25" width="195" height="75" fill="none" stroke="#1e293b" strokeWidth="2.5" />
            <line x1="105" y1="100" x2="220" y2="25" stroke="#1e293b" strokeWidth="2.5" />
            <path
              d="M 105 100 L 57 100 A 48 48 0 0 1 145.2 73.8 Z"
              fill="#cbd5e1"
              stroke="#334155"
              strokeWidth="1.5"
            />
            <text x="68" y="78" fill="#0f172a" fontSize="13" fontWeight="900" fontFamily="sans-serif">137°</text>

            <circle cx="25" cy="100" r="4" fill="#0f172a" /><text x="14" y="118" fontSize="12" fontWeight="bold">{vA}</text>
            <circle cx="105" cy="100" r="4" fill="#0f172a" /><text x="101" y="118" fontSize="12" fontWeight="bold">{vE}</text>
            <circle cx="220" cy="100" r="4" fill="#0f172a" /><text x="225" y="118" fontSize="12" fontWeight="bold">{vB}</text>
            <circle cx="220" cy="25" r="4" fill="#0f172a" /><text x="225" y="20" fontSize="12" fontWeight="bold">{vC}</text>
            <circle cx="25" cy="25" r="4" fill="#0f172a" /><text x="14" y="20" fontSize="12" fontWeight="bold">{vD}</text>
          </svg>
        </div>
      );
    }

    if (svgType === 'pie25') {
      const [sK, sL, sM] = t.pie25Labels;
      const keys = t.bar25Keys;
      return (
        <div className="space-y-4 p-3 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="flex flex-col items-center">
            <svg
              viewBox="0 0 160 160"
              className="w-full max-w-[170px] h-auto select-none overflow-visible font-sans mx-auto block"
              role="img"
              aria-label={t.pie25Aria}
            >
              <defs>
                <pattern id="hatch_diag2" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="6" stroke="#000000" strokeWidth="1.8" />
                </pattern>
              </defs>
              <circle cx="80" cy="80" r="52" fill="#ffffff" stroke="#000000" strokeWidth="2" />
              <path d="M 80 80 L 80 28 A 52 52 0 0 1 132 80 Z" fill="#000000" />
              <path d="M 80 80 L 132 80 A 52 52 0 0 1 64 129.8 Z" fill="url(#hatch_diag2)" stroke="#000000" strokeWidth="1.2" />
              <text x="124" y="42" fill="#000000" fontSize="14" fontWeight="bold">{sK}</text>
              <text x="114" y="136" fill="#000000" fontSize="14" fontWeight="bold">{sL}</text>
              <text x="14" y="85" fill="#000000" fontSize="14" fontWeight="bold">{sM}</text>
            </svg>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-200">
            {[
              { label: keys[0], rects: [{x: 20, y: 65, h: 20}, {x: 52, y: 60, h: 25}, {x: 84, y: 17, h: 68}] },
              { label: keys[1], rects: [{x: 20, y: 10, h: 75}, {x: 52, y: 55, h: 30}, {x: 84, y: 10, h: 75}] },
              { label: keys[2], rects: [{x: 20, y: 43, h: 42}, {x: 52, y: 33, h: 52}, {x: 84, y: 10, h: 75}] },
              { label: keys[3], rects: [{x: 20, y: 37, h: 48}, {x: 52, y: 47, h: 38}, {x: 84, y: 12, h: 73}] }
            ].map((item) => (
              <div key={item.label} className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col items-center shadow-xs">
                <svg viewBox="0 0 120 105" className="w-full max-w-[120px] h-auto select-none font-sans mx-auto block">
                  <line x1="8" y1="85" x2="112" y2="85" stroke="#cbd5e1" strokeWidth="1.5" />
                  {item.rects.map((r, ri) => (
                    <rect key={ri} x={r.x} y={r.y} width="16" height={r.h} fill="#52525b" />
                  ))}
                  <text x="28" y="99" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0f172a">{sK}</text>
                  <text x="60" y="99" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0f172a">{sL}</text>
                  <text x="92" y="99" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0f172a">{sM}</text>
                </svg>
                <span className="font-bold text-sm mt-1 text-slate-800">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (svgType === 'line31') {
      const [pK, pM, pN, pL] = t.line31Labels;
      return (
        <div className="flex justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <svg
            viewBox="0 0 320 70"
            className="w-full max-w-[340px] h-auto select-none mx-auto block"
            role="img"
            aria-label={t.line31Aria}
          >
            <line x1="20" y1="35" x2="300" y2="35" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
            <circle cx="20" cy="35" r="4.5" fill="#1e3a8a" /><text x="16" y="20" fontSize="11" fontWeight="bold">{pK}</text>
            <circle cx="160" cy="35" r="4.5" fill="#0f172a" /><text x="156" y="20" fontSize="11" fontWeight="bold">{pM}</text>
            <circle cx="253" cy="35" r="5" fill="#b91c1c" /><text x="249" y="20" fontSize="11" fontWeight="black" fill="#b91c1c">{pN}</text>
            <circle cx="300" cy="35" r="4.5" fill="#1e3a8a" /><text x="290" y="20" fontSize="11" fontWeight="bold">{pL}</text>
          </svg>
        </div>
      );
    }

    if (svgType === 'triangle36') {
      return (
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 p-4 bg-slate-50 rounded-2xl border border-slate-200"
          role="img"
          aria-label={t.tri36Aria}
        >
          <div className="flex flex-col items-center w-full max-w-[150px]">
            <svg viewBox="0 0 160 145" className="w-full h-auto select-none">
              <polygon points="80,12 10,133 150,133" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
              <line x1="56.6" y1="52.3" x2="103.3" y2="52.3" stroke="#475569" strokeWidth="2" />
              <line x1="33.3" y1="92.6" x2="126.6" y2="92.6" stroke="#475569" strokeWidth="2" />
              <line x1="56.6" y1="52.3" x2="103.3" y2="133" stroke="#475569" strokeWidth="2" />
              <line x1="103.3" y1="52.3" x2="56.6" y2="133" stroke="#475569" strokeWidth="2" />
              <line x1="33.3" y1="92.6" x2="56.6" y2="133" stroke="#475569" strokeWidth="2" />
              <line x1="126.6" y1="92.6" x2="103.3" y2="133" stroke="#475569" strokeWidth="2" />
              {[
                [80, 12],
                [56.6, 52.3], [103.3, 52.3],
                [33.3, 92.6], [80, 92.6], [126.6, 92.6],
                [10, 133], [56.6, 133], [103.3, 133], [150, 133]
              ].map(([cx, cy], idx) => (
                <circle key={idx} cx={cx} cy={cy} r="4.5" fill="#64748b" stroke="#0f172a" strokeWidth="1.5" />
              ))}
            </svg>
          </div>

          <div className="flex flex-col items-center w-full max-w-[150px]">
            <svg viewBox="0 0 160 145" className="w-full h-auto select-none">
              <polygon points="80,12 10,133 150,133" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
              <polygon points="56.6,52.3 103.3,52.3 10,133" fill="#94a3b8" />
              <polygon points="10,133 103.3,133 126.6,92.6" fill="#94a3b8" />
              <line x1="56.6" y1="52.3" x2="103.3" y2="52.3" stroke="#1e293b" strokeWidth="2" />
              <line x1="33.3" y1="92.6" x2="126.6" y2="92.6" stroke="#1e293b" strokeWidth="2" />
              <line x1="56.6" y1="52.3" x2="103.3" y2="133" stroke="#1e293b" strokeWidth="2" />
              <line x1="103.3" y1="52.3" x2="56.6" y2="133" stroke="#1e293b" strokeWidth="2" />
              <line x1="33.3" y1="92.6" x2="56.6" y2="133" stroke="#1e293b" strokeWidth="2" />
              <line x1="126.6" y1="92.6" x2="103.3" y2="133" stroke="#1e293b" strokeWidth="2" />
              <line x1="10" y1="133" x2="103.3" y2="52.3" stroke="#1e293b" strokeWidth="2.5" />
              <line x1="10" y1="133" x2="126.6" y2="92.6" stroke="#1e293b" strokeWidth="2.5" />
              {[
                [80, 12],
                [56.6, 52.3], [103.3, 52.3],
                [33.3, 92.6], [80, 92.6], [126.6, 92.6],
                [10, 133], [56.6, 133], [103.3, 133], [150, 133]
              ].map(([cx, cy], idx) => (
                <circle key={idx} cx={cx} cy={cy} r="4.5" fill="#64748b" stroke="#0f172a" strokeWidth="1.5" />
              ))}
            </svg>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDesc}
      schemaData={schema2026}
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
            <span>📝 {t.answeredLabel} <strong>{answeredCount} {t.of20}</strong></span>
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
              <span className="text-[11px] text-slate-400 block mt-0.5">
                {t.scoringBreakdown}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
              {t.resultSubtitle}
            </p>
          </div>
        )}

        {/* LIST OF 20 QUESTIONS */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((q, qIdx) => {
            const userChoice = answers[q.id];
            const isCorrect = userChoice === q.correctRaw;
            const pointsValue = qIdx < 10 ? 2 : 3;

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
                      {isCorrect ? t.pointsEarned(pointsValue) : t.pointsZero}
                    </span>
                  )}
                </div>

                {/* ΕΚΦΩΝΗΣΗ */}
                <div className="text-sm sm:text-base text-slate-900 font-bold leading-relaxed break-words [overflow-wrap:anywhere]">
                  {q.promptText}
                </div>

                {/* ΕΙΔΙΚΟ COMPONENT ΕΚΦΩΝΗΣΗΣ */}
                {q.customPromptComponent}

                {/* SVG ΕΑΝ ΥΠΑΡΧΕΙ */}
                {q.hasSvg && renderQuestionSvg(q.hasSvg)}

                {/* ΕΠΙΛΟΓΕΣ */}
                <div className={`grid gap-2 pt-1 ${q.options.length === 5 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
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
                {t.barRemaining} <strong>{20 - answeredCount}</strong>
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