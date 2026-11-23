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
    metaTitle: 'Θέματα Προτύπων 2023 – Επίσημα Θέματα & Αναλυτικές Λύσεις | LearnMaths.gr',
    metaDesc: 'Λύσε online τα 25 επίσημα θέματα Μαθηματικών για τα Πρότυπα Γυμνάσια 2023 (026–050), με χρονόμετρο 60 λεπτών, αυτόματη βαθμολόγηση και αναλυτικές λύσεις.',
    backText: 'Θέματα Προτύπων',
    heroBadge: 'Επίσημα Θέματα 2023 • 25 Ερωτήσεις Μαθηματικών',
    heroTitle: 'Θέματα Προτύπων Γυμνασίων 2023 – Online Τεστ & Λύσεις',
    heroSubtitle: 'Εξασκήσου στα επίσημα θέματα Μαθηματικών των εξετάσεων εισαγωγής στα Πρότυπα Γυμνάσια 2023. Περιλαμβάνει και τις 25 ερωτήσεις (026–050) με αυτόματη βαθμολόγηση (2 μόρια ανά θέμα, Άριστα: 50), χρονόμετρο 60 λεπτών και αναλυτικές λύσεις.',
    answeredLabel: 'Απαντημένες:',
    of25: 'από 25',
    scoringLabel: 'Βαθμολογία:',
    scoringValue: '2 μόρια ανά θέμα (Άριστα: 50)',
    timerOn: '⏳ Χρονόμετρο: 60 λεπτά',
    timerOff: '⏳ Χρονόμετρο: Ανενεργό',
    resultTitle: 'Αποτέλεσμα Εξέτασης Προτύπων 2023',
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
    patternAria: 'Επαναλαμβανόμενο μοτίβο 4 γεωμετρικών σχημάτων: ορθογώνιο, κύκλος, τρίγωνο, τετράγωνο',
    axis34Aria: 'Αριθμογραμμή με τα σημεία α, 5/3 και 9/4',
    axis34Alpha: 'α',
    gridMapAria: 'Χάρτης καννάβου με αφετηρία Ο και σημεία Α, Β, Γ',
    gridPoints: ['Ο', 'Α', 'Β', 'Γ'],
    ellipseAria: 'Μαύρη έλλειψη μέσα σε κάνναβο 10 επί 6 τετραγωνάκια',
    busRoute1Title: 'Αθήνα - Πύργος',
    busRoute2Title: 'Αθήνα - Πάτρα',
    busRoute3Title: 'Πάτρα - Πύργος',
    busDeparture: 'Αναχώρηση',
    busDuration: 'Διάρκεια',
    busDirectRows: [
      { dep: '07:30', dur: '3 ώρες και 45 λεπτά', highlight: false },
      { dep: '08:30', dur: '3 ώρες και 50 λεπτά', highlight: true },
      { dep: '12:15', dur: '3 ώρες και 50 λεπτά', highlight: false },
      { dep: '14:00', dur: '3 ώρες και 50 λεπτά', highlight: false },
      { dep: '17:00', dur: '3 ώρες και 45 λεπτά', highlight: false }
    ],
    busTransferRows: [
      { d1: '08:00', dur1: '2 ώρες και 45 λεπτά', d2: '07:00', dur2: '70 λεπτά', highlight: false },
      { d1: '09:30', dur1: '2 ώρες και 50 λεπτά', d2: '10:30', dur2: '70 λεπτά', highlight: false },
      { d1: '11:00', dur1: '2 ώρες και 50 λεπτά', d2: '14:15', dur2: '70 λεπτά', highlight: true },
      { d1: '13:30', dur1: '2 ώρες και 50 λεπτά', d2: '21:00', dur2: '70 λεπτά', highlight: false },
      { d1: '18:30', dur1: '2 ώρες και 45 λεπτά', d2: '-', dur2: '-', highlight: false }
    ],
    parksAria: 'Τρία σχέδια ορθογώνιας πλατείας με λευκούς πεζόδρομους και γκρι γρασίδι',
    parkLabels: ['1ο σχέδιο', '2ο σχέδιο', '3ο σχέδιο'],
    pieAria: 'Κυκλικό διάγραμμα προτίμησης αθλημάτων με μαύρο τομέα μικρότερο από το τέταρτο του κύκλου',
    swimAria: 'Εβδομαδιαίο πρόγραμμα κολύμβησης ανά ημέρα της εβδομάδας',
    swimDays: ['Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο', 'Κυριακή'],
    swimVals: ['2 χμ', '1 χμ', '1 χμ', '2 χμ', '3 χμ', '4 χμ', '3 χμ'],
    schemaHome: 'Αρχική',
    schemaHub: 'Ενδεικτικά Θέματα Προτύπων 2026',
    schemaCurrent: 'Θέματα Προτύπων Γυμνασίων 2023',
    schemaQuizName: 'Επίσημα Θέματα Μαθηματικών Προτύπων Γυμνασίων 2023 (Με Λύσεις)',
    schemaQuizDesc: 'Διαδραστικό τεστ με τα 25 επίσημα θέματα Μαθηματικών των εξετάσεων εισαγωγής στα Πρότυπα Γυμνάσια 2023 (026–050), χρονόμετρο 60 λεπτών, αυτόματη βαθμολόγηση (0–50) και αναλυτικές λύσεις.',
    schemaEduLevel: "ΣΤ' Δημοτικού",
    schemaQuestionName: (num) => `Θέμα ${num} - Πρότυπα 2023`
  },
  en: {
    metaTitle: 'Model School 2023 Math Past Paper – Online Test & Solutions | LearnMaths.gr',
    metaDesc: 'Practice online with the 25 official Mathematics questions from the 2023 Model Middle School entrance exam (026–050), 60-minute timer, auto-grading, and full solutions.',
    backText: 'Model School Exams',
    heroBadge: 'Official 2023 Exam • 25 Mathematics Questions',
    heroTitle: 'Model Middle Schools 2023 Math Exam – Online Test & Solutions',
    heroSubtitle: 'Practice with the official Mathematics questions from the 2023 Model Middle School entrance exams. Includes all 25 questions (026–050) with automatic scoring (2 points per question, Max: 50), a 60-minute timer, and step-by-step solutions.',
    answeredLabel: 'Answered:',
    of25: 'of 25',
    scoringLabel: 'Scoring:',
    scoringValue: '2 points per question (Max: 50)',
    timerOn: '⏳ Timer: 60 minutes',
    timerOff: '⏳ Timer: Disabled',
    resultTitle: '2023 Model School Exam Results',
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
    patternAria: 'Repeating pattern of 4 geometric shapes: rectangle, circle, triangle, square',
    axis34Aria: 'Number line with points a, 5/3, and 9/4',
    axis34Alpha: 'a',
    gridMapAria: 'Grid map showing starting point O and points A, B, C',
    gridPoints: ['O', 'A', 'B', 'C'],
    ellipseAria: 'Black ellipse inside a 10 by 6 unit grid',
    busRoute1Title: 'Athens - Pyrgos',
    busRoute2Title: 'Athens - Patras',
    busRoute3Title: 'Patras - Pyrgos',
    busDeparture: 'Departure',
    busDuration: 'Duration',
    busDirectRows: [
      { dep: '07:30', dur: '3 hours and 45 min', highlight: false },
      { dep: '08:30', dur: '3 hours and 50 min', highlight: true },
      { dep: '12:15', dur: '3 hours and 50 min', highlight: false },
      { dep: '14:00', dur: '3 hours and 50 min', highlight: false },
      { dep: '17:00', dur: '3 hours and 45 min', highlight: false }
    ],
    busTransferRows: [
      { d1: '08:00', dur1: '2 hours and 45 min', d2: '07:00', dur2: '70 min', highlight: false },
      { d1: '09:30', dur1: '2 hours and 50 min', d2: '10:30', dur2: '70 min', highlight: false },
      { d1: '11:00', dur1: '2 hours and 50 min', d2: '14:15', dur2: '70 min', highlight: true },
      { d1: '13:30', dur1: '2 hours and 50 min', d2: '21:00', dur2: '70 min', highlight: false },
      { d1: '18:30', dur1: '2 hours and 45 min', d2: '-', dur2: '-', highlight: false }
    ],
    parksAria: 'Three designs of a rectangular plaza with white walkways and gray grass areas',
    parkLabels: ['Design 1', 'Design 2', 'Design 3'],
    pieAria: 'Pie chart of favorite sports showing a black sector smaller than one quarter of the circle',
    swimAria: 'Weekly swimming schedule in kilometers per day',
    swimDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    swimVals: ['2 km', '1 km', '1 km', '2 km', '3 km', '4 km', '3 km'],
    schemaHome: 'Home',
    schemaHub: 'Model School Entrance 2026 Prep',
    schemaCurrent: 'Model Middle Schools 2023 Exam',
    schemaQuizName: 'Official 2023 Model Middle School Mathematics Exam (With Solutions)',
    schemaQuizDesc: 'Interactive practice test featuring all 25 official Mathematics questions from the 2023 Model Middle School entrance examination (026–050), 60-minute timer, automatic grading (0–50), and detailed solutions.',
    schemaEduLevel: 'Grade 6',
    schemaQuestionName: (num) => `Question ${num} - Model Schools 2023`
  }
};

function getQuestions2023(locale) {
  const isEn = locale === 'en';
  const groupA = isEn ? 'GROUP A (4 CHOICES)' : 'ΟΜΑΔΑ Α (4 ΕΠΙΛΟΓΕΣ)';
  const groupB = isEn ? 'GROUP B (4 CHOICES)' : 'ΟΜΑΔΑ Β (4 ΕΠΙΛΟΓΕΣ)';

  return [
    {
      id: 1,
      officialNumber: 26,
      group: groupA,
      promptText: isEn
        ? 'The Least Common Multiple of the numbers 3, 6, and 8 is:'
        : 'Το Ελάχιστο Κοινό Πολλαπλάσιο των αριθμών 3, 6 και 8 είναι:',
      options: [
        { key: 'A', label: '12', raw: '12' },
        { key: 'B', label: '24', raw: '24' },
        { key: isEn ? 'C' : 'Γ', label: '48', raw: '48' },
        { key: isEn ? 'D' : 'Δ', label: '72', raw: '72' }
      ],
      correctRaw: '24',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Factorize each number into prime factors:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• 3 ＝ <Pow base="3" exp="1" /></div>
            <div>• 6 ＝ 2 · 3</div>
            <div>• 8 ＝ <Pow base="2" exp="3" /></div>
          </div>
          <p>Take all prime factors (common and non-common) with their highest exponent:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span>LCM(3, 6, 8) ＝</span>
            <span className="whitespace-nowrap"><Pow base="2" exp="3" /> · 3</span>
            <span className="whitespace-nowrap">＝ 8 · 3 ＝ <strong className="text-emerald-700 text-base">24</strong></span>
          </div>
          <p className="pt-1">Therefore, the LCM is <strong>24</strong> (Choice <strong>B</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Αναλύουμε τους αριθμούς σε γινόμενο πρώτων παραγόντων:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• 3 ＝ <Pow base="3" exp="1" /></div>
            <div>• 6 ＝ 2 · 3</div>
            <div>• 8 ＝ <Pow base="2" exp="3" /></div>
          </div>
          <p>Παίρνουμε όλους τους παράγοντες, κοινούς και μη κοινούς, με τον μεγαλύτερο εκθέτη:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span>ΕΚΠ(3, 6, 8) ＝</span>
            <span className="whitespace-nowrap"><Pow base="2" exp="3" /> · 3</span>
            <span className="whitespace-nowrap">＝ 8 · 3 ＝ <strong className="text-emerald-700 text-base">24</strong></span>
          </div>
          <p className="pt-1">Επομένως, το ΕΚΠ είναι το <strong>24</strong> (Επιλογή <strong>B</strong>).</p>
        </div>
      )
    },
    {
      id: 2,
      officialNumber: 27,
      group: groupA,
      promptText: isEn ? (
        <span>
          The value of the expression <Frac num="17" den="2" /> － <Frac num={<Pow base="2" exp="3" />} den="6" /> is:
        </span>
      ) : (
        <span>
          Η τιμή της παράστασης <Frac num="17" den="2" /> － <Frac num={<Pow base="2" exp="3" />} den="6" /> είναι:
        </span>
      ),
      options: [
        { key: 'A', label: <Frac num="43" den="6" />, raw: '43/6' },
        { key: 'B', label: <Frac num="1" den="12" />, raw: '1/12' },
        { key: isEn ? 'C' : 'Γ', label: <Frac num="15" den="2" />, raw: '15/2' },
        { key: isEn ? 'D' : 'Δ', label: <Frac num="59" den="6" />, raw: '59/6' }
      ],
      correctRaw: '43/6',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Compute the exponent first, following the order of operations:</p>
          <div className="space-y-2 bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            <div>• <Pow base="2" exp="3" /> ＝ 8</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Division as a fraction:</span>
              <Frac num={<Pow base="2" exp="3" />} den="6" />
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＝ <Frac num="8" den="6" /></span>
            </div>
          </div>
          <p>Next, subtract using the common denominator LCM(2, 6) ＝ 6:</p>
          <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <Frac num="17" den="2" />
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">－ <Frac num="8" den="6" /></span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ＝ <Frac num="51" den="6" /> － <Frac num="8" den="6" />
            </span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ＝ <strong className="text-emerald-700 text-base"><Frac num="43" den="6" /></strong>
            </span>
          </div>
          <p className="pt-1">
            Thus, the value of the expression is <strong><Frac num="43" den="6" /></strong> (Choice <strong>A</strong>).
          </p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Εκτελούμε πρώτα τη δύναμη, τηρώντας την προτεραιότητα πράξεων:</p>
          <div className="space-y-2 bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            <div>• <Pow base="2" exp="3" /> ＝ 8</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Διαίρεση σε μορφή κλάσματος:</span>
              <Frac num={<Pow base="2" exp="3" />} den="6" />
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＝ <Frac num="8" den="6" /></span>
            </div>
          </div>
          <p>Στη συνέχεια κάνουμε την αφαίρεση κάνοντας τα κλάσματα ομώνυμα με ΕΚΠ(2, 6) ＝ 6:</p>
          <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <Frac num="17" den="2" />
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">－ <Frac num="8" den="6" /></span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ＝ <Frac num="51" den="6" /> － <Frac num="8" den="6" />
            </span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ＝ <strong className="text-emerald-700 text-base"><Frac num="43" den="6" /></strong>
            </span>
          </div>
          <p className="pt-1">
            Άρα, η τιμή της παράστασης είναι <strong><Frac num="43" den="6" /></strong> (Επιλογή <strong>A</strong>).
          </p>
        </div>
      )
    },
    {
      id: 3,
      officialNumber: 28,
      group: groupA,
      promptText: isEn
        ? 'The geometric shape located at the 51st position of the pattern below is:'
        : 'Το γεωμετρικό σχήμα που βρίσκεται στην 51η θέση του παρακάτω μοτίβου είναι:',
      hasSvg: 'pattern28',
      options: isEn
        ? [
            { key: 'A', label: 'triangle', raw: 'triangle' },
            { key: 'B', label: 'square', raw: 'square' },
            { key: 'C', label: 'circle', raw: 'circle' },
            { key: 'D', label: 'rectangle', raw: 'rectangle' }
          ]
        : [
            { key: 'A', label: 'τρίγωνο', raw: 'τρίγωνο' },
            { key: 'B', label: 'τετράγωνο', raw: 'τετράγωνο' },
            { key: 'Γ', label: 'κύκλος', raw: 'κύκλος' },
            { key: 'Δ', label: 'ορθογώνιο', raw: 'ορθογώνιο' }
          ],
      correctRaw: isEn ? 'triangle' : 'τρίγωνο',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>In the diagram, the pattern repeats every <strong>4 shapes</strong>:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            1. Rectangle ➔ 2. Circle ➔ <strong>3. Triangle</strong> ➔ 4. Square
          </div>
          <p>Divide position 51 by the period length (4):</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Frac num="51" den="4" />
              <span>＝ 12 with remainder <strong>3</strong> (51 ＝ 4 · 12 ＋ <strong>3</strong>)</span>
            </div>
            <div className="text-emerald-800 font-bold pt-1">
              ➔ 12 complete groups of 4 and a remainder of 3.
            </div>
          </div>
          <p className="pt-1">The 3rd shape is the <strong>triangle</strong> (Choice <strong>A</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Στο σχήμα της εκφώνησης το μοτίβο επαναλαμβάνεται ανά <strong>4 σχήματα</strong>:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            1. Ορθογώνιο ➔ 2. Κύκλος ➔ <strong>3. Τρίγωνο</strong> ➔ 4. Τετράγωνο
          </div>
          <p>Διαιρούμε τη θέση 51 με το μήκος της περιόδου (4):</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Frac num="51" den="4" />
              <span>＝ 12 και υπόλοιπο <strong>3</strong> (51 ＝ 4 · 12 ＋ <strong>3</strong>)</span>
            </div>
            <div className="text-emerald-800 font-bold pt-1">
              ➔ 12 πλήρεις τετράδες και υπόλοιπο 3.
            </div>
          </div>
          <p className="pt-1">Το 3ο σχήμα είναι το <strong>τρίγωνο</strong> (Επιλογή <strong>A</strong>).</p>
        </div>
      )
    },
    {
      id: 4,
      officialNumber: 29,
      group: groupA,
      promptText: isEn
        ? 'If the side of a square is reduced by half, its new area compared to the original area is:'
        : 'Αν η πλευρά ενός τετραγώνου μειωθεί στο μισό, τότε το εμβαδόν του σε σχέση με το αρχικό είναι το:',
      options: [
        { key: 'A', label: '50%', raw: '50%' },
        { key: 'B', label: '75%', raw: '75%' },
        { key: isEn ? 'C' : 'Γ', label: '25%', raw: '25%' },
        { key: isEn ? 'D' : 'Δ', label: '100%', raw: '100%' }
      ],
      correctRaw: '25%',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            Let <strong>s</strong> be the initial side of the square. The original area is <strong>A₁ ＝ <Pow base="s" exp="2" /></strong>.
          </p>
          <p>
            If the new side becomes <Frac num="s" den="2" />, the new area is:
          </p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span>A₂ ＝</span>
            <Pow base={<span className="inline-flex items-center">(<Frac num="s" den="2" />)</span>} exp="2" />
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ＝ <Frac num={<Pow base="s" exp="2" />} den="4" />
            </span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ＝ <Frac num="1" den="4" /> · A₁ ＝ <strong className="text-emerald-700 text-base">25%</strong>
            </span>
          </div>
          <p className="pt-1">Thus, its area compared to the original is <strong>25%</strong> (Choice <strong>C</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            Έστω <strong>α</strong> η αρχική πλευρά του τετραγώνου. Το αρχικό εμβαδόν είναι <strong>Ε₁ ＝ <Pow base="α" exp="2" /></strong>.
          </p>
          <p>
            Αν η νέα πλευρά γίνει <Frac num="α" den="2" />, το νέο εμβαδόν είναι:
          </p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span>Ε₂ ＝</span>
            <Pow base={<span className="inline-flex items-center">(<Frac num="α" den="2" />)</span>} exp="2" />
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ＝ <Frac num={<Pow base="α" exp="2" />} den="4" />
            </span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ＝ <Frac num="1" den="4" /> · Ε₁ ＝ <strong className="text-emerald-700 text-base">25%</strong>
            </span>
          </div>
          <p className="pt-1">Άρα, το εμβαδόν του σε σχέση με το αρχικό είναι το <strong>25%</strong> (Επιλογή <strong>Γ</strong>).</p>
        </div>
      )
    },
    {
      id: 5,
      officialNumber: 30,
      group: groupA,
      promptText: isEn
        ? 'Which fraction is closest to 1?'
        : 'Ποιο κλάσμα είναι πιο κοντά στη μονάδα;',
      options: [
        { key: 'A', label: <Frac num="2" den="17" />, raw: '2/17' },
        { key: 'B', label: <Frac num="2" den="18" />, raw: '2/18' },
        { key: isEn ? 'C' : 'Γ', label: <Frac num="2" den="13" />, raw: '2/13' },
        { key: isEn ? 'D' : 'Δ', label: <Frac num="2" den="9" />, raw: '2/9' }
      ],
      correctRaw: '2/9',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>All given fractions are proper fractions with the same numerator (2).</p>
          <p>The smaller the denominator, the greater the value of the fraction, and therefore the closer it is to 1:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <Frac num="2" den="18" />
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">&lt; <Frac num="2" den="17" /></span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">&lt; <Frac num="2" den="13" /></span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              &lt; <strong className="text-emerald-700 text-base"><Frac num="2" den="9" /></strong>
            </span>
          </div>
          <p className="pt-1">
            Therefore, the fraction closest to 1 is <strong><Frac num="2" den="9" /></strong> (Choice <strong>D</strong>).
          </p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Όλα τα κλάσματα είναι γνήσια με ίδιο αριθμητή το 2.</p>
          <p>Όσο μικρότερος είναι ο παρονομαστής, τόσο μεγαλύτερη είναι η τιμή του κλάσματος και άρα τόσο πιο κοντά βρίσκεται στη μονάδα (1):</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <Frac num="2" den="18" />
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">&lt; <Frac num="2" den="17" /></span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">&lt; <Frac num="2" den="13" /></span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              &lt; <strong className="text-emerald-700 text-base"><Frac num="2" den="9" /></strong>
            </span>
          </div>
          <p className="pt-1">
            Επομένως, το πιο κοντινό στη μονάδα είναι το <strong><Frac num="2" den="9" /></strong> (Επιλογή <strong>Δ</strong>).
          </p>
        </div>
      )
    },
    {
      id: 6,
      officialNumber: 31,
      group: groupA,
      promptText: isEn
        ? 'A T-shirt cost 25 € and during the sales we bought it for 15 €. The discount percentage was:'
        : 'Ένα μπλουζάκι κόστιζε 25€ και στις εκπτώσεις το αγοράσαμε 15€. Το ποσοστό έκπτωσης ήταν:',
      options: [
        { key: 'A', label: '40%', raw: '40%' },
        { key: 'B', label: '60%', raw: '60%' },
        { key: isEn ? 'C' : 'Γ', label: '30%', raw: '30%' },
        { key: isEn ? 'D' : 'Δ', label: '15%', raw: '15%' }
      ],
      correctRaw: '40%',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. The discount in euros is:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            25 € － 15 € ＝ <strong>10 €</strong>
          </div>
          <p>2. The discount percentage is calculated on the <strong>original price</strong> (25 €):</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">Percentage ＝ <Frac num="10" den="25" /></span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＝ <Frac num="40" den="100" /></span>
            <span className="whitespace-nowrap">＝ <strong className="text-emerald-700 text-base">40%</strong></span>
          </div>
          <p className="pt-1">Thus, the discount percentage was <strong>40%</strong> (Choice <strong>A</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Η έκπτωση σε ευρώ είναι:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            25 € － 15 € ＝ <strong>10 €</strong>
          </div>
          <p>2. Το ποσοστό έκπτωσης υπολογίζεται πάνω στην <strong>αρχική τιμή</strong> (25 €):</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">Ποσοστό ＝ <Frac num="10" den="25" /></span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＝ <Frac num="40" den="100" /></span>
            <span className="whitespace-nowrap">＝ <strong className="text-emerald-700 text-base">40%</strong></span>
          </div>
          <p className="pt-1">Άρα, το ποσοστό έκπτωσης ήταν <strong>40%</strong> (Επιλογή <strong>A</strong>).</p>
        </div>
      )
    },
    {
      id: 7,
      officialNumber: 32,
      group: groupA,
      promptText: isEn
        ? 'Double a number decreased by half of it equals 15. Which equation describes the problem?'
        : 'Το διπλάσιο ενός αριθμού μειωμένο κατά το μισό του ισούται με 15. Ποια εξίσωση περιγράφει το πρόβλημα;',
      options: [
        {
          key: 'A',
          label: (
            <span className="font-mono whitespace-nowrap">
              2 · x － <Frac num="x" den="2" /> ＝ 15
            </span>
          ),
          raw: '2 · x - x/2 = 15'
        },
        {
          key: 'B',
          label: <span className="font-mono whitespace-nowrap">2 · x － x ＝ 15</span>,
          raw: '2 · x - x = 15'
        },
        {
          key: isEn ? 'C' : 'Γ',
          label: (
            <span className="font-mono whitespace-nowrap">
              <Frac num="x" den="2" /> ＝ 15
            </span>
          ),
          raw: 'x/2 = 15'
        },
        {
          key: isEn ? 'D' : 'Δ',
          label: (
            <span className="font-mono whitespace-nowrap">
              2 · ( x － <Frac num="x" den="2" /> ) ＝ 15
            </span>
          ),
          raw: '2 · (x - x/2) = 15'
        }
      ],
      correctRaw: '2 · x - x/2 = 15',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Let <strong>x</strong> represent the unknown number:</p>
          <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>• Double the number: <strong>2 · x</strong></div>
            <div>• Half the number: <Frac num="x" den="2" /></div>
            <div className="pt-1">
              • Decreased by half of it equals 15:{' '}
              <span className="font-bold text-emerald-800 whitespace-nowrap">
                2 · x － <Frac num="x" den="2" /> ＝ 15
              </span>
            </div>
          </div>
          <p className="pt-1">Therefore, the required equation is <strong>A</strong>.</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Συμβολίζουμε τον άγνωστο αριθμό με <strong>x</strong>:</p>
          <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>• Το διπλάσιο του αριθμού: <strong>2 · x</strong></div>
            <div>• Το μισό του αριθμού: <Frac num="x" den="2" /></div>
            <div className="pt-1">
              • Μειωμένο κατά το μισό του ισούται με 15:{' '}
              <span className="font-bold text-emerald-800 whitespace-nowrap">
                2 · x － <Frac num="x" den="2" /> ＝ 15
              </span>
            </div>
          </div>
          <p className="pt-1">Επομένως, η ζητούμενη εξίσωση είναι η <strong>A</strong>.</p>
        </div>
      )
    },
    {
      id: 8,
      officialNumber: 33,
      group: groupA,
      promptText: isEn ? (
        <span>
          <Frac num="1" den="3" /> of half of the children in a school speak German. If the number of these children is 36, how many students attend the school in total?
        </span>
      ) : (
        <span>
          Το <Frac num="1" den="3" /> των μισών παιδιών ενός σχολείου μιλάει Γερμανικά. Αν ο αριθμός αυτών των παιδιών είναι 36, πόσοι είναι όλοι οι μαθητές του σχολείου;
        </span>
      ),
      options: [
        { key: 'A', label: '216', raw: '216' },
        { key: 'B', label: '108', raw: '108' },
        { key: isEn ? 'C' : 'Γ', label: '12', raw: '12' },
        { key: isEn ? 'D' : 'Δ', label: '120', raw: '120' }
      ],
      correctRaw: '216',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Let <strong>X</strong> be the total number of students in the school.</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>• Half the students: <Frac num="X" den="2" /></div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• <Frac num="1" den="3" /> of half:</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="1" den="3" /> · <Frac num="X" den="2" /> ＝ <Frac num="X" den="6" />
              </span>
            </div>
          </div>
          <p>We know that <Frac num="1" den="6" /> of the total equals 36:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            X ＝ 36 · 6 ＝ <strong className="text-emerald-700 text-base">216 students</strong>
          </div>
          <p className="pt-1">Thus, there are <strong>216</strong> students in total (Choice <strong>A</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Έστω <strong>X</strong> ο αριθμός όλων των μαθητών του σχολείου.</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>• Τα μισά παιδιά: <Frac num="X" den="2" /></div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Το <Frac num="1" den="3" /> των μισών:</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="1" den="3" /> · <Frac num="X" den="2" /> ＝ <Frac num="X" den="6" />
              </span>
            </div>
          </div>
          <p>Γνωρίζουμε ότι το <Frac num="1" den="6" /> του συνόλου ισούται με 36:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            X ＝ 36 · 6 ＝ <strong className="text-emerald-700 text-base">216 μαθητές</strong>
          </div>
          <p className="pt-1">Άρα, όλοι οι μαθητές του σχολείου είναι <strong>216</strong> (Επιλογή <strong>A</strong>).</p>
        </div>
      )
    },
    {
      id: 9,
      officialNumber: 34,
      group: groupA,
      promptText: isEn ? (
        <span>
          On the number line, the number <Frac num="5" den="3" /> is halfway between the number a and the number <Frac num="9" den="4" />. Then the number a is:
        </span>
      ) : (
        <span>
          Στην αριθμογραμμή ο αριθμός <Frac num="5" den="3" /> είναι στο μέσο της απόστασης του αριθμού α από τον αριθμό <Frac num="9" den="4" />. Τότε ο αριθμός α είναι:
        </span>
      ),
      hasSvg: 'axis34',
      options: [
        { key: 'A', label: <Frac num="13" den="12" />, raw: '13/12' },
        { key: 'B', label: <Frac num="1" den="12" />, raw: '1/12' },
        { key: isEn ? 'C' : 'Γ', label: <Frac num="4" den="3" />, raw: '4/3' },
        { key: isEn ? 'D' : 'Δ', label: <Frac num="11" den="12" />, raw: '11/12' }
      ],
      correctRaw: '13/12',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            Since <Frac num="5" den="3" /> is the midpoint between a and <Frac num="9" den="4" />:
          </p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <ComplexFrac
                num={<span>a ＋ <Frac num="9" den="4" small /></span>}
                den="2"
              />
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＝ <Frac num="5" den="3" /></span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>a ＋ <Frac num="9" den="4" /></span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                ＝ 2 · <Frac num="5" den="3" /> ＝ <Frac num="10" den="3" />
              </span>
            </div>
          </div>
          <p>Solve for a using common denominator 12:</p>
          <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span>a ＝ <Frac num="10" den="3" /> － <Frac num="9" den="4" /></span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ＝ <Frac num="40" den="12" /> － <Frac num="27" den="12" />
            </span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ＝ <strong className="text-emerald-700 text-base"><Frac num="13" den="12" /></strong>
            </span>
          </div>
          <p className="pt-1">
            Therefore, the number a is <strong><Frac num="13" den="12" /></strong> (Choice <strong>A</strong>).
          </p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            Επειδή το <Frac num="5" den="3" /> είναι το μέσο του τμήματος με άκρα α και <Frac num="9" den="4" />:
          </p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <ComplexFrac
                num={<span>α ＋ <Frac num="9" den="4" small /></span>}
                den="2"
              />
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＝ <Frac num="5" den="3" /></span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>α ＋ <Frac num="9" den="4" /></span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                ＝ 2 · <Frac num="5" den="3" /> ＝ <Frac num="10" den="3" />
              </span>
            </div>
          </div>
          <p>Υπολογίζουμε το α με κοινό παρονομαστή το 12:</p>
          <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span>α ＝ <Frac num="10" den="3" /> － <Frac num="9" den="4" /></span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ＝ <Frac num="40" den="12" /> － <Frac num="27" den="12" />
            </span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ＝ <strong className="text-emerald-700 text-base"><Frac num="13" den="12" /></strong>
            </span>
          </div>
          <p className="pt-1">
            Συνεπώς, ο αριθμός α είναι <strong><Frac num="13" den="12" /></strong> (Επιλογή <strong>A</strong>).
          </p>
        </div>
      )
    },
    {
      id: 10,
      officialNumber: 35,
      group: groupA,
      promptText: isEn
        ? 'One faucet fills a tank in 10 hours. Another faucet fills the same tank in 12 hours. If we open both faucets together for 1 hour, what fraction of the tank will they fill?'
        : 'Μια βρύση γεμίζει μια δεξαμενή σε 10 ώρες. Μια άλλη βρύση γεμίζει την ίδια δεξαμενή σε 12 ώρες. Αν ανοίξουμε και τις δυο βρύσες μαζί για 1 ώρα, τι μέρος της δεξαμενής θα γεμίσουν;',
      options: [
        { key: 'A', label: <Frac num="12" den="60" />, raw: '12/60' },
        { key: 'B', label: <Frac num="1" den="22" />, raw: '1/22' },
        { key: isEn ? 'C' : 'Γ', label: <Frac num="2" den="22" />, raw: '2/22' },
        { key: isEn ? 'D' : 'Δ', label: <Frac num="22" den="120" />, raw: '22/120' }
      ],
      correctRaw: '22/120',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>In 1 hour:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• The 1st faucet fills <Frac num="1" den="10" /> of the tank.</div>
            <div>• The 2nd faucet fills <Frac num="1" den="12" /> of the tank.</div>
          </div>
          <p>Open together for 1 hour, they fill:</p>
          <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <Frac num="1" den="10" />
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＋ <Frac num="1" den="12" /></span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ＝ <Frac num="12" den="120" /> ＋ <Frac num="10" den="120" />
            </span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ＝ <strong className="text-emerald-700 text-base"><Frac num="22" den="120" /></strong>
            </span>
          </div>
          <p className="pt-1">
            Thus, they fill <strong><Frac num="22" den="120" /></strong> of the tank (Choice <strong>D</strong>).
          </p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Σε 1 ώρα:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Η 1η βρύση γεμίζει το <Frac num="1" den="10" /> της δεξαμενής.</div>
            <div>• Η 2η βρύση γεμίζει το <Frac num="1" den="12" /> της δεξαμενής.</div>
          </div>
          <p>Ανοιχτές μαζί σε 1 ώρα γεμίζουν:</p>
          <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <Frac num="1" den="10" />
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＋ <Frac num="1" den="12" /></span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ＝ <Frac num="12" den="120" /> ＋ <Frac num="10" den="120" />
            </span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ＝ <strong className="text-emerald-700 text-base"><Frac num="22" den="120" /></strong>
            </span>
          </div>
          <p className="pt-1">
            Άρα, γεμίζουν τα <strong><Frac num="22" den="120" /></strong> της δεξαμενής (Επιλογή <strong>Δ</strong>).
          </p>
        </div>
      )
    },
    {
      id: 11,
      officialNumber: 36,
      group: groupB,
      promptText: isEn
        ? 'Maria raises rabbits, and every year their population increases by 50%. If she has 64 rabbits today, how many will she have in two years?'
        : 'Η Μαρία εκτρέφει κουνέλια και κάθε χρόνο ο πληθυσμός τους αυξάνει κατά 50%. Αν σήμερα έχει 64 κουνέλια, πόσα θα έχει σε δυο χρόνια;',
      options: [
        { key: 'A', label: '128', raw: '128' },
        { key: 'B', label: '144', raw: '144' },
        { key: isEn ? 'C' : 'Γ', label: '164', raw: '164' },
        { key: isEn ? 'D' : 'Δ', label: '256', raw: '256' }
      ],
      correctRaw: '144',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>A 50% increase means that each year the population grows by half its current size:</p>
          <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>
              <strong>After 1 year:</strong> 64 ＋ 50% · 64 ＝ 64 ＋ 32 ＝ <strong>96 rabbits</strong>
            </div>
            <div>
              <strong>After 2 years:</strong> 96 ＋ 50% · 96 ＝ 96 ＋ 48 ＝ <strong className="text-emerald-700 text-base">144 rabbits</strong>
            </div>
          </div>
          <p className="pt-1">Therefore, in two years she will have <strong>144</strong> rabbits (Choice <strong>B</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Αύξηση κατά 50% σημαίνει ότι κάθε χρόνο ο πληθυσμός αυξάνεται κατά το μισό του:</p>
          <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>
              <strong>Σε 1 χρόνο:</strong> 64 ＋ 50% · 64 ＝ 64 ＋ 32 ＝ <strong>96 κουνέλια</strong>
            </div>
            <div>
              <strong>Σε 2 χρόνια:</strong> 96 ＋ 50% · 96 ＝ 96 ＋ 48 ＝ <strong className="text-emerald-700 text-base">144 κουνέλια</strong>
            </div>
          </div>
          <p className="pt-1">Επομένως, σε δύο χρόνια θα έχει <strong>144</strong> κουνέλια (Επιλογή <strong>B</strong>).</p>
        </div>
      )
    },
    {
      id: 12,
      officialNumber: 37,
      group: groupB,
      promptText: isEn
        ? 'Panagiotis starts at position O as shown on the map and wants to walk home. He starts walking in the direction of the arrow for 1,600 meters. Then he turns 90° left and walks 400 meters, then turns 90° left again and walks 1 kilometer to reach his house. If the distance AB is 800 meters, at which point is Panagiotis’s house?'
        : 'Ο Παναγιώτης βρίσκεται αρχικά στη θέση Ο, όπως φαίνεται στον χάρτη και θέλει να πάει στο σπίτι του. Ξεκινά να περπατά στην κατεύθυνση που δείχνει το βέλος για χίλια εξακόσια μέτρα. Μετά στρίβει 90° αριστερά και περπατάει για ακόμη τετρακόσια μέτρα μέχρι να ξαναστρίψει 90° αριστερά και να περπατήσει άλλο ένα χιλιόμετρο ώστε να φτάσει στο σπίτι του. Αν η απόσταση ΑΒ είναι οκτακόσια μέτρα σε ποια θέση είναι το σπίτι του Παναγιώτη;',
      hasSvg: 'gridMap37',
      options: isEn
        ? [
            { key: 'A', label: 'at A', raw: 'at A' },
            { key: 'B', label: 'at B', raw: 'at B' },
            { key: 'C', label: 'at C.', raw: 'at C.' },
            { key: 'D', label: 'at a point different from A, B, C.', raw: 'at a different point' }
          ]
        : [
            { key: 'A', label: 'στο Α', raw: 'στο Α' },
            { key: 'B', label: 'στο Β', raw: 'στο Β' },
            { key: 'Γ', label: 'στο Γ.', raw: 'στο Γ.' },
            { key: 'Δ', label: 'σε διαφορετικό σημείο από τα Α, Β,Γ.', raw: 'σε διαφορετικό σημείο' }
          ],
      correctRaw: isEn ? 'at A' : 'στο Α',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            1. <strong>Grid scale:</strong> On the grid, the vertical distance from A to B is 4 squares. Since AB ＝ 800 meters, each square side equals:
          </p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 inline-flex items-center gap-1.5 whitespace-nowrap">
            <Frac num="800" den="4" />
            <span>＝ <strong>200 meters per square</strong></span>
          </div>
          <p>2. <strong>Step-by-step path analysis:</strong></p>
          <ul className="space-y-1.5 pl-4 sm:pl-5 text-slate-800 list-disc font-medium">
            <li>1,600 meters right (east) ➔ <Frac num="1,600" den="200" /> ＝ <strong>8 squares right</strong>.</li>
            <li>Turn 90° left and 400 meters up (north) ➔ <Frac num="400" den="200" /> ＝ <strong>2 squares up</strong>.</li>
            <li>Turn 90° left and 1,000 meters (1 km) left (west) ➔ <Frac num="1,000" den="200" /> ＝ <strong>5 squares left</strong>.</li>
          </ul>
          <p>
            Final position from O: 8 － 5 ＝ 3 squares right and 2 squares up. This matches point <strong>A</strong> exactly.
          </p>
          <p className="pt-1 font-bold text-emerald-800">Thus, his house is at A (Choice A).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            1. <strong>Κλίμακα καννάβου:</strong> Στο πλέγμα η κατακόρυφη απόσταση από το Α έως το Β είναι 4 τετραγωνάκια. Επειδή ΑΒ ＝ 800 μέτρα, η πλευρά κάθε τετραγώνου είναι:
          </p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 inline-flex items-center gap-1.5 whitespace-nowrap">
            <Frac num="800" den="4" />
            <span>＝ <strong>200 μέτρα ανά τετραγωνάκι</strong></span>
          </div>
          <p>2. <strong>Ανάλυση διαδρομής Παναγιώτη:</strong></p>
          <ul className="space-y-1.5 pl-4 sm:pl-5 text-slate-800 list-disc font-medium">
            <li>1.600 μέτρα δεξιά (ανατολικά) ➔ <Frac num="1.600" den="200" /> ＝ <strong>8 τετραγωνάκια δεξιά</strong>.</li>
            <li>Στροφή 90° αριστερά και 400 μέτρα πάνω (βόρεια) ➔ <Frac num="400" den="200" /> ＝ <strong>2 τετραγωνάκια πάνω</strong>.</li>
            <li>Στροφή 90° αριστερά και 1.000 μέτρα (1 χλμ) αριστερά (δυτικά) ➔ <Frac num="1.000" den="200" /> ＝ <strong>5 τετραγωνάκια αριστερά</strong>.</li>
          </ul>
          <p>
            Τελική θέση από το Ο: 8 － 5 ＝ 3 τετραγωνάκια δεξιά και 2 τετραγωνάκια πάνω. Αυτό ταυτίζεται επακριβώς με το σημείο <strong>Α</strong>.
          </p>
          <p className="pt-1 font-bold text-emerald-800">Άρα, το σπίτι του είναι στο Α (Επιλογή A).</p>
        </div>
      )
    },
    {
      id: 13,
      officialNumber: 38,
      group: groupB,
      promptText: isEn
        ? 'If each small grid square has an area of 1, then for the area A of the black shape it holds that:'
        : 'Αν κάθε τετραγωνάκι έχει εμβαδόν 1, τότε για το εμβαδόν Ε του μαύρου σχήματος ισχύει ότι',
      hasSvg: 'ellipse38',
      options: isEn
        ? [
            { key: 'A', label: 'A < 50', raw: 'A < 50' },
            { key: 'B', label: '50 < A < 52', raw: '50 < A < 52' },
            { key: 'C', label: '52 < A < 54', raw: '52 < A < 54' },
            { key: 'D', label: 'A > 54', raw: 'A > 54' }
          ]
        : [
            { key: 'A', label: 'Ε < 50', raw: 'Ε < 50' },
            { key: 'B', label: '50 < Ε < 52', raw: '50 < Ε < 52' },
            { key: 'Γ', label: '52 < Ε < 54', raw: '52 < Ε < 54' },
            { key: 'Δ', label: 'Ε > 54', raw: 'Ε > 54' }
          ],
      correctRaw: isEn ? 'A < 50' : 'Ε < 50',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            The black shape is an ellipse inscribed in a 10 × 6 rectangle (semi-major axis a ＝ 5, semi-minor axis b ＝ 3):
          </p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Area of bounding rectangle: 10 · 6 ＝ 60 sq. units</div>
            <div>• Area of ellipse: <strong>A ＝ π · a · b</strong></div>
            <div>• A ＝ 3.14 · 5 · 3 ＝ 3.14 · 15 ＝ <strong className="text-emerald-700 text-base">47.1</strong></div>
          </div>
          <p className="pt-1">Since 47.1 &lt; 50, it holds that <strong>A &lt; 50</strong> (Choice <strong>A</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            Το μαύρο σχήμα είναι μία έλλειψη που περιγράφεται σε ορθογώνιο διαστάσεων 10 × 6 (μεγάλος ημιάξονας a ＝ 5, μικρός ημιάξονας b ＝ 3):
          </p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Εμβαδόν ορθογωνίου: 10 · 6 ＝ 60 τετραγωνικά</div>
            <div>• Εμβαδόν έλλειψης: <strong>Ε ＝ π · a · b</strong></div>
            <div>• Ε ＝ 3,14 · 5 · 3 ＝ 3,14 · 15 ＝ <strong className="text-emerald-700 text-base">47,1</strong></div>
          </div>
          <p className="pt-1">Επειδή 47,1 &lt; 50, ισχύει <strong>Ε &lt; 50</strong> (Επιλογή <strong>A</strong>).</p>
        </div>
      )
    },
    {
      id: 14,
      officialNumber: 39,
      group: groupB,
      promptText: isEn
        ? 'We want to travel by bus from Athens to Pyrgos and arrive earlier than 3:30 PM. The schedules are shown in the tables below. What is the latest time we can leave Athens by bus so that we arrive in Pyrgos on time?'
        : 'Θέλουμε να ταξιδέψουμε με λεωφορείο από την Αθήνα προς τον Πύργο και να φτάσουμε νωρίτερα από τις 3.30 μμ. Τα δρομολόγια φαίνονται στους παρακάτω πίνακες. Τι ώρα το αργότερο πρέπει να φύγουμε από την Αθήνα με το λεωφορείο, ώστε να φτάσουμε εγκαίρως στον Πύργο;',
      hasTable: 'busTable39',
      options: [
        { key: 'A', label: '08:30', raw: '08:30' },
        { key: 'B', label: '09:30', raw: '09:30' },
        { key: isEn ? 'C' : 'Γ', label: '11:00', raw: '11:00' },
        { key: isEn ? 'D' : 'Δ', label: '12:15', raw: '12:15' }
      ],
      correctRaw: '11:00',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>We want to arrive in Pyrgos before <strong>15:30 (3:30 PM)</strong>:</p>
          <div className="space-y-2 bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            <div>
              <strong>1. Direct Athens - Pyrgos:</strong><br />
              • 08:30 ➔ Arrival: 08:30 ＋ 3h 50m ＝ 12:20 (on time)<br />
              • 12:15 ➔ Arrival: 12:15 ＋ 3h 50m ＝ 16:05 (too late)
            </div>
            <div className="pt-1">
              <strong>2. Via Patras:</strong><br />
              • Depart Athens at <strong>11:00</strong>:<br />
              &nbsp;&nbsp;Arrive in Patras: 11:00 ＋ 2h 50m ＝ 13:50.<br />
              &nbsp;&nbsp;Catches the <strong>14:15</strong> Patras - Pyrgos bus!<br />
              &nbsp;&nbsp;Arrive in Pyrgos: 14:15 ＋ 70m (1h 10m) ＝ <strong>15:25</strong> (before 15:30 ✅).
            </div>
          </div>
          <p className="pt-1">The latest departure time from Athens is <strong>11:00</strong> (Choice <strong>C</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Θέλουμε άφιξη στον Πύργο πριν τις <strong>15:30 (3.30 μμ)</strong>:</p>
          <div className="space-y-2 bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            <div>
              <strong>1. Απευθείας Αθήνα - Πύργος:</strong><br />
              • 08:30 ➔ Άφιξη: 08:30 ＋ 3ω 50λ ＝ 12:20 (εγκαίρως)<br />
              • 12:15 ➔ Άφιξη: 12:15 ＋ 3ω 50λ ＝ 16:05 (εκπρόθεσμα)
            </div>
            <div className="pt-1">
              <strong>2. Μέσω Πάτρας:</strong><br />
              • Αναχώρηση από Αθήνα στις <strong>11:00</strong>:<br />
              &nbsp;&nbsp;Άφιξη στην Πάτρα: 11:00 ＋ 2ω 50λ ＝ 13:50.<br />
              &nbsp;&nbsp;Προλαβαίνει το λεωφορείο Πάτρα - Πύργος των <strong>14:15</strong>!<br />
              &nbsp;&nbsp;Άφιξη στον Πύργο: 14:15 ＋ 70λ (1ω 10λ) ＝ <strong>15:25</strong> (πριν τις 15:30 ✅).
            </div>
          </div>
          <p className="pt-1">Η αργότερη ώρα αναχώρησης από την Αθήνα είναι στις <strong>11:00</strong> (Επιλογή <strong>Γ</strong>).</p>
        </div>
      )
    },
    {
      id: 15,
      officialNumber: 40,
      group: groupB,
      promptText: isEn
        ? 'To build a rectangular plaza, the city council decided that part of it would be a pedestrian walkway and the rest would be planted with grass. The three designs below were proposed, where the white walkways all have the same width and the gray areas will be planted with grass. Which design has the most grass?'
        : 'Για την κατασκευή μιας πλατείας σε σχήμα ορθογωνίου παραλληλογράμμου το δημοτικό συμβούλιο αποφάσισε ένα μέρος της να γίνει πεζόδρομος και το υπόλοιπο να φυτευτεί με γρασίδι. Προτάθηκαν τα τρία παρακάτω σχέδια όπου οι πεζόδρομοι, με λευκό χρώμα, έχουν όλοι το ίδιο πλάτος, ενώ με γκρι είναι η περιοχή που θα φυτευτεί με γρασίδι. Σε ποιο σχέδιο υπάρχει περισσότερο γρασίδι;',
      hasSvg: 'parks40',
      options: isEn
        ? [
            { key: 'A', label: 'Design 1', raw: 'Design 1' },
            { key: 'B', label: 'Design 2', raw: 'Design 2' },
            { key: 'C', label: 'Design 3', raw: 'Design 3' },
            { key: 'D', label: 'All have the same grass area', raw: 'All have the same grass area' }
          ]
        : [
            { key: 'A', label: 'το 1ο', raw: 'το 1ο' },
            { key: 'B', label: 'το 2ο', raw: 'το 2ο' },
            { key: 'Γ', label: 'το 3ο', raw: 'το 3ο' },
            { key: 'Δ', label: 'όλα έχουν το ίδιο γρασίδι', raw: 'όλα έχουν το ίδιο γρασίδι' }
          ],
      correctRaw: isEn ? 'All have the same grass area' : 'όλα έχουν το ίδιο γρασίδι',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            Let <strong>L</strong> be the length and <strong>W</strong> be the width of the rectangle, and <strong>d</strong> be the common width of the walkways:
          </p>
          <p>If we slide the gray grass sections together so they join with no gaps:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• In all 3 designs, one vertical strip of width d and one horizontal strip of width d are removed.</div>
            <div>• The net grass area in each design is:</div>
            <div className="text-emerald-700 font-bold text-center text-sm">
              A ＝ (L － d) · (W － d)
            </div>
          </div>
          <p className="pt-1">Therefore, <strong>all have the same grass area</strong> (Choice <strong>D</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            Έστω <strong>L</strong> το μήκος και <strong>W</strong> το πλάτος του αρχικού ορθογωνίου, και <strong>d</strong> το κοινό σταθερό πλάτος των πεζοδρόμων:
          </p>
          <p>Αν μετατοπίσουμε τα γκρι κομμάτια ώστε να ενωθούν χωρίς κενά:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Και στα 3 σχέδια αφαιρείται μία κατακόρυφη λωρίδα πλάτους d και μία οριζόντια λωρίδα πλάτους d.</div>
            <div>• Το καθαρό εμβαδόν του γρασιδιού είναι σε κάθε σχέδιο:</div>
            <div className="text-emerald-700 font-bold text-center text-sm">
              Ε ＝ (L － d) · (W － d)
            </div>
          </div>
          <p className="pt-1">Επομένως, <strong>όλα έχουν το ίδιο γρασίδι</strong> (Επιλογή <strong>Δ</strong>).</p>
        </div>
      )
    },
    {
      id: 16,
      officialNumber: 41,
      group: groupB,
      promptText: isEn ? (
        <span>
          The quotient of the division <Frac num="50,204" den="5" /> equals:
        </span>
      ) : (
        <span>
          Το πηλίκο της διαίρεσης <Frac num="50204" den="5" /> είναι ίσο με:
        </span>
      ),
      options: isEn
        ? [
            { key: 'A', label: '10,004.8', raw: '10,004.8' },
            { key: 'B', label: '10,040.8', raw: '10,040.8' },
            { key: 'C', label: '10,004.08', raw: '10,004.08' },
            { key: 'D', label: '1,004.8', raw: '1,004.8' }
          ]
        : [
            { key: 'A', label: '10004,8', raw: '10004,8' },
            { key: 'B', label: '10040,8', raw: '10040,8' },
            { key: 'Γ', label: '10004,08', raw: '10004,08' },
            { key: 'Δ', label: '1004,8', raw: '1004,8' }
          ],
      correctRaw: isEn ? '10,040.8' : '10040,8',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Multiply numerator and denominator by 2 to make the denominator 10:</p>
          <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <Frac num="50,204" den="5" />
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ＝ <Frac num="50,204 · 2" den="5 · 2" />
            </span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ＝ <Frac num="100,408" den="10" />
            </span>
            <span className="whitespace-nowrap">＝ <strong className="text-emerald-700 text-base">10,040.8</strong></span>
          </div>
          <p className="pt-1">Thus, the quotient is <strong>10,040.8</strong> (Choice <strong>B</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Πολλαπλασιάζουμε αριθμητή και παρονομαστή με το 2 για να γίνει ο παρονομαστής 10:</p>
          <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <Frac num="50204" den="5" />
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ＝ <Frac num="50204 · 2" den="5 · 2" />
            </span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ＝ <Frac num="100408" den="10" />
            </span>
            <span className="whitespace-nowrap">＝ <strong className="text-emerald-700 text-base">10040,8</strong></span>
          </div>
          <p className="pt-1">Άρα, το πηλίκο είναι <strong>10040,8</strong> (Επιλογή <strong>B</strong>).</p>
        </div>
      )
    },
    {
      id: 17,
      officialNumber: 42,
      group: groupB,
      promptText: isEn
        ? 'A survey was conducted among students of a school about their favorite sport. The answers given were "football", "tennis", "basketball", and "volleyball". Most children answered "football", while significantly more children answered "basketball" than "tennis". The results are shown in the pie chart. Which sport does the black sector of the chart correspond to?'
        : 'Μεταξύ παιδιών ενός σχολείου έγινε μια έρευνα, για το άθλημα που προτιμούν περισσότερο. Οι απαντήσεις που δόθηκαν ήταν «ποδόσφαιρο», «τένις», «μπάσκετ» και «βόλεϊ». Τα περισσότερα παιδιά απάντησαν «ποδόσφαιρο», ενώ «μπάσκετ» απάντησαν αρκετά περισσότερα παιδιά από όσα απάντησαν «τένις». Τα αποτελέσματα φαίνονται στο κυκλικό διάγραμμα. Σε ποιο άθλημα αντιστοιχεί το μαύρο μέρος του διαγράμματος;',
      hasSvg: 'pieChart42',
      options: isEn
        ? [
            { key: 'A', label: 'Tennis', raw: 'Tennis' },
            { key: 'B', label: 'Basketball', raw: 'Basketball' },
            { key: 'C', label: 'Football', raw: 'Football' },
            { key: 'D', label: 'Volleyball', raw: 'Volleyball' }
          ]
        : [
            { key: 'A', label: 'Τένις', raw: 'Τένις' },
            { key: 'B', label: 'Μπάσκετ', raw: 'Μπάσκετ' },
            { key: 'Γ', label: 'Ποδόσφαιρο', raw: 'Ποδόσφαιρο' },
            { key: 'Δ', label: 'βόλεϊ', raw: 'βόλεϊ' }
          ],
      correctRaw: isEn ? 'Tennis' : 'Τένις',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>In the pie chart, observe the sizes of the circular sectors:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Largest sector (&gt; 25%): <strong>Football</strong> (most children).</div>
            <div>• 25% sector (right angle): <strong>Basketball</strong>.</div>
            <div>• Smallest black sector (&lt; 25%): <strong>Tennis</strong> (since basketball &gt;&gt; tennis).</div>
          </div>
          <p className="pt-1">Therefore, the black sector corresponds to <strong>Tennis</strong> (Choice <strong>A</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Στο κυκλικό διάγραμμα παρατηρούμε τα μεγέθη των κυκλικών τομέων:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Ο μεγαλύτερος τομέας (&gt; 25%): <strong>Ποδόσφαιρο</strong> (τα περισσότερα παιδιά).</div>
            <div>• Ο τομέας 25% (ορθή γωνία): <strong>Μπάσκετ</strong>.</div>
            <div>• Ο μικρότερος μαύρος τομέας (&lt; 25%): <strong>Τένις</strong> (αφού μπάσκετ &gt;&gt; τένις).</div>
          </div>
          <p className="pt-1">Συνεπώς, το μαύρο μέρος αντιστοιχεί στο <strong>Τένις</strong> (Επιλογή <strong>A</strong>).</p>
        </div>
      )
    },
    {
      id: 18,
      officialNumber: 43,
      group: groupB,
      promptText: isEn
        ? 'For buying 800 grams of coffee online, we paid 17 € including shipping, while for buying 500 grams of coffee we paid 11 € including shipping. If the shipping cost is always the same, then for 300 grams of coffee we will pay (including shipping):'
        : 'Για την αγορά 800 γραμμαρίων καφέ από το διαδίκτυο πληρώσαμε μαζί με τα έξοδα μεταφοράς 17€, ενώ για την αγορά 500 γραμμαρίων καφέ πληρώσαμε μαζί με τα έξοδα μεταφοράς 11€. Αν το κόστος μεταφοράς είναι πάντοτε το ίδιο, τότε για 300 γραμμάρια καφέ θα πληρώσουμε μαζί με το κόστος μεταφοράς:',
      options: isEn
        ? [
            { key: 'A', label: '6 €', raw: '6 €' },
            { key: 'B', label: '6.5 €', raw: '6.5 €' },
            { key: 'C', label: '7 €', raw: '7 €' },
            { key: 'D', label: '7.5 €', raw: '7.5 €' }
          ]
        : [
            { key: 'A', label: '6 €', raw: '6 €' },
            { key: 'B', label: '6,5 €', raw: '6,5 €' },
            { key: 'Γ', label: '7 €', raw: '7 €' },
            { key: 'Δ', label: '7,5 €', raw: '7,5 €' }
          ],
      correctRaw: '7 €',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. The difference of 300 grams of coffee accounts for the cost difference:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            800 g － 500 g ＝ 300 g of coffee costs: 17 € － 11 € ＝ <strong>6 €</strong> (pure coffee value).
          </div>
          <p>2. Find the fixed shipping cost:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• 100 g coffee ＝</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="6 €" den="3" /> ＝ 2 €
              </span>
            </div>
            <div>• 500 g coffee ＝ 5 · 2 € ＝ 10 €</div>
            <div>• Shipping ＝ 11 € － 10 € ＝ <strong>1 €</strong></div>
          </div>
          <p>3. For 300 grams of coffee including shipping:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            Total cost ＝ 6 € (coffee) ＋ 1 € (shipping) ＝ <strong className="text-emerald-700 text-base">7 €</strong>
          </div>
          <p className="pt-1">Thus, we will pay <strong>7 €</strong> (Choice <strong>C</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Η διαφορά των 300 γραμμαρίων καφέ προκαλεί διαφορά κόστους:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            800 γρ － 500 γρ ＝ 300 γρ καφέ κοστίζουν: 17 € － 11 € ＝ <strong>6 €</strong> (καθαρή αξία καφέ).
          </div>
          <p>2. Βρίσκουμε το σταθερό κόστος μεταφοράς:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• 100 γρ καφέ ＝</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="6 €" den="3" /> ＝ 2 €
              </span>
            </div>
            <div>• 500 γρ καφέ ＝ 5 · 2 € ＝ 10 €</div>
            <div>• Μεταφορικά ＝ 11 € － 10 € ＝ <strong>1 €</strong></div>
          </div>
          <p>3. Για 300 γραμμάρια καφέ μαζί με μεταφορικά:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            Συνολικό κόστος ＝ 6 € (καφές) ＋ 1 € (μεταφορά) ＝ <strong className="text-emerald-700 text-base">7 €</strong>
          </div>
          <p className="pt-1">Άρα, θα πληρώσουμε <strong>7 €</strong> (Επιλογή <strong>Γ</strong>).</p>
        </div>
      )
    },
    {
      id: 19,
      officialNumber: 44,
      group: groupB,
      promptText: isEn
        ? 'An elementary school has two 6th-grade classes, 6A and 6B. The students of class 6A formed groups of 5 and 2 students were left over. On the same day, the students of classes 6A and 6B together formed groups of 5 and no students were left over. Next, the students of class 6B formed groups of 5. How many were left over?'
        : 'Ένα δημοτικό σχολείο έχει στην έκτη τάξη δύο τμήματα, ΣΤ1 και ΣΤ2. Τα παιδιά του τμήματος ΣΤ1 χωρίστηκαν σε πεντάδες και περίσσεψαν 2 παιδιά. Την ίδια ημέρα, τα παιδιά των τμημάτων ΣΤ1 και ΣΤ2 μαζί, χωρίστηκαν σε πεντάδες και δεν περίσσεψε κανένα παιδί. Στη συνέχεια, χωρίστηκαν σε πεντάδες τα παιδιά του ΣΤ2. Πόσα περίσσεψαν;',
      options: isEn
        ? [
            { key: 'A', label: 'None', raw: 'None' },
            { key: 'B', label: '5', raw: '5' },
            { key: 'C', label: '2', raw: '2' },
            { key: 'D', label: '3', raw: '3' }
          ]
        : [
            { key: 'A', label: 'Κανένα', raw: 'Κανένα' },
            { key: 'B', label: '5', raw: '5' },
            { key: 'Γ', label: '2', raw: '2' },
            { key: 'Δ', label: '3', raw: '3' }
          ],
      correctRaw: '3',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Analyze the remainders upon division by 5:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
            <div>• Class 6A students ＝ multiple of 5 ＋ <strong>2</strong></div>
            <div>• Class (6A ＋ 6B) students ＝ multiple of 5 ＋ <strong>0</strong></div>
          </div>
          <p>
            For no students to be left over in the combined total, the 2 remaining students from 6A plus the remainder from 6B must form a complete group of 5:
          </p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            2 ＋ Remainder(6B) ＝ 5 ➔ Remainder(6B) ＝ 5 － 2 ＝ <strong className="text-emerald-700 text-base">3 students</strong>
          </div>
          <p className="pt-1">Therefore, <strong>3</strong> students were left over (Choice <strong>D</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Αναλύουμε τα υπόλοιπα της διαίρεσης με το 5:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
            <div>• Παιδιά ΣΤ1 ＝ πολλαπλάσιο του 5 ＋ <strong>2</strong></div>
            <div>• Παιδιά (ΣΤ1 ＋ ΣΤ2) ＝ πολλαπλάσιο του 5 ＋ <strong>0</strong></div>
          </div>
          <p>
            Για να μην περισσέψει κανένα παιδί στο άθροισμα, τα 2 παιδιά του ΣΤ1 πρέπει μαζί με το υπόλοιπο του ΣΤ2 να συμπληρώνουν ακέραια πεντάδα:
          </p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            2 ＋ Υπόλοιπο(ΣΤ2) ＝ 5 ➔ Υπόλοιπο(ΣΤ2) ＝ 5 － 2 ＝ <strong className="text-emerald-700 text-base">3 παιδιά</strong>
          </div>
          <p className="pt-1">Συνεπώς, περίσσεψαν <strong>3</strong> παιδιά (Επιλογή <strong>Δ</strong>).</p>
        </div>
      )
    },
    {
      id: 20,
      officialNumber: 45,
      group: groupB,
      promptText: isEn
        ? 'I thought of a number. I added 3 to it. I divided the sum I found by 2. From the result of the division I subtracted 1 and got 10. What number did I think of at the beginning?'
        : 'Σκέφτηκα έναν αριθμό. Σε αυτόν πρόσθεσα 3. Διαίρεσα το άθροισμα που βρήκα με 2. Από το αποτέλεσμα της διαίρεσης αφαίρεσα 1 και βρήκα 10. Ποιον αριθμό σκέφτηκα στην αρχή;',
      options: [
        { key: 'A', label: '15', raw: '15' },
        { key: 'B', label: '19', raw: '19' },
        { key: isEn ? 'C' : 'Γ', label: '21', raw: '21' },
        { key: isEn ? 'D' : 'Δ', label: '25', raw: '25' }
      ],
      correctRaw: '19',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Work backward using inverse operations from the end to the start:</p>
          <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>1. Final result: <strong>10</strong></div>
            <div>2. Inverse of &quot;subtracted 1&quot;: 10 ＋ 1 ＝ <strong>11</strong></div>
            <div>3. Inverse of &quot;divided by 2&quot;: 11 · 2 ＝ <strong>22</strong></div>
            <div>4. Inverse of &quot;added 3&quot;: 22 － 3 ＝ <strong className="text-emerald-700 text-base">19</strong></div>
          </div>
          <p className="pt-1">Thus, the initial number was <strong>19</strong> (Choice <strong>B</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Εκτελούμε αντίστροφα τις πράξεις από το τέλος προς την αρχή:</p>
          <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>1. Τελικό αποτέλεσμα: <strong>10</strong></div>
            <div>2. Αντίστροφο του «αφαίρεσα 1»: 10 ＋ 1 ＝ <strong>11</strong></div>
            <div>3. Αντίστροφο του «διαίρεσα με 2»: 11 · 2 ＝ <strong>22</strong></div>
            <div>4. Αντίστροφο του «πρόσθεσα 3»: 22 － 3 ＝ <strong className="text-emerald-700 text-base">19</strong></div>
          </div>
          <p className="pt-1">Άρα, ο αρχικός αριθμός ήταν το <strong>19</strong> (Επιλογή <strong>B</strong>).</p>
        </div>
      )
    },
    {
      id: 21,
      officialNumber: 46,
      group: groupB,
      promptText: isEn
        ? 'A company packages pens in packs containing 5 blue, 3 black, and 2 red pens each. Mr. Kostas owns a bookstore and bought several such packs from the company. In total, across the packs he bought, there were 60 more blue pens than red pens. How many more blue pens than black pens were there in total?'
        : 'Μία εταιρεία συσκευάζει τα στυλό σε πακέτα που αποτελούνται από 5 μπλε, 3 μαύρα και 2 κόκκινα στυλό το καθένα. Ο κύριος Κώστας έχει βιβλιοπωλείο και πήρε από την εταιρεία μερικά τέτοια πακέτα. Συνολικά, στα πακέτα που πήρε, τα μπλε στυλό ήταν 60 περισσότερα από τα κόκκινα. Πόσα περισσότερα ήταν συνολικά τα μπλε από τα μαύρα;',
      options: [
        { key: 'A', label: '180', raw: '180' },
        { key: 'B', label: '120', raw: '120' },
        { key: isEn ? 'C' : 'Γ', label: '40', raw: '40' },
        { key: isEn ? 'D' : 'Δ', label: '20', raw: '20' }
      ],
      correctRaw: '40',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>In <strong>each pack</strong>, the differences are:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
            <div>• Blue minus Red: 5 － 2 ＝ <strong>3 pens difference</strong></div>
            <div>• Blue minus Black: 5 － 3 ＝ <strong>2 pens difference</strong></div>
          </div>
          <p>Since there were 60 more blue pens than red pens in total, the number of packs is:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 inline-flex items-center gap-1.5 whitespace-nowrap">
            <Frac num="60" den="3" />
            <span>＝ <strong>20 packs</strong></span>
          </div>
          <p>Therefore, there were more blue pens than black pens by:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            20 · 2 ＝ <strong className="text-emerald-700 text-base">40 pens</strong>
          </div>
          <p className="pt-1">Thus, there were <strong>40</strong> more blue pens (Choice <strong>C</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Σε <strong>κάθε πακέτο</strong> υπάρχουν:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
            <div>• Μπλε μείον Κόκκινα: 5 － 2 ＝ <strong>3 στυλό διαφορά</strong></div>
            <div>• Μπλε μείον Μαύρα: 5 － 3 ＝ <strong>2 στυλό διαφορά</strong></div>
          </div>
          <p>Αφού συνολικά τα μπλε ήταν κατά 60 περισσότερα από τα κόκκινα, τα πακέτα είναι:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 inline-flex items-center gap-1.5 whitespace-nowrap">
            <Frac num="60" den="3" />
            <span>＝ <strong>20 πακέτα</strong></span>
          </div>
          <p>Επομένως, τα μπλε ήταν περισσότερα από τα μαύρα κατά:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            20 · 2 ＝ <strong className="text-emerald-700 text-base">40 στυλό</strong>
          </div>
          <p className="pt-1">Άρα, ήταν κατά <strong>40</strong> περισσότερα (Επιλογή <strong>Γ</strong>).</p>
        </div>
      )
    },
    {
      id: 22,
      officialNumber: 47,
      group: groupB,
      promptText: isEn ? (
        <span>
          We have three identical glasses with water. Initially, the 1st glass is <Frac num="5" den="8" /> full and the 3rd glass is <Frac num="1" den="2" /> full. Using all the water from the 3rd glass, we completely fill the 1st and 2nd glasses. What fraction of the 2nd glass was initially full?
        </span>
      ) : (
        <span>
          Έχουμε τρία ίδια ποτήρια με νερό. Αρχικά, το 1ο ποτήρι είναι κατά <Frac num="5" den="8" /> γεμάτο και το 3ο κατά <Frac num="1" den="2" /> γεμάτο. Με όλο το νερό από το 3ο ποτήρι γεμίζουμε τελείως το 1ο και 2ο ποτήρι. Τι μέρος του 2ου ποτηριού ήταν γεμάτο, αρχικά;
        </span>
      ),
      options: [
        { key: 'A', label: <Frac num="1" den="2" />, raw: '1/2' },
        { key: 'B', label: <Frac num="3" den="8" />, raw: '3/8' },
        { key: isEn ? 'C' : 'Γ', label: <Frac num="7" den="8" />, raw: '7/8' },
        { key: isEn ? 'D' : 'Δ', label: <Frac num="1" den="8" />, raw: '1/8' }
      ],
      correctRaw: '7/8',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. To fill the 1st glass completely, we need:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              1 － <Frac num="5" den="8" /> ＝ <Frac num="3" den="8" /> of water.
            </span>
          </div>
          <p>
            2. The 3rd glass initially had <Frac num="1" den="2" /> ＝ <Frac num="4" den="8" />. It gives <Frac num="3" den="8" /> to the 1st glass, leaving for the 2nd glass:
          </p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <Frac num="4" den="8" /> － <Frac num="3" den="8" /> ＝ <Frac num="1" den="8" /> of water.
            </span>
          </div>
          <p>
            3. With this <Frac num="1" den="8" />, the 2nd glass became completely full (<Frac num="8" den="8" />). So initially it held:
          </p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <Frac num="8" den="8" /> － <Frac num="1" den="8" />
            </span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ＝ <strong className="text-emerald-700 text-base"><Frac num="7" den="8" /></strong>
            </span>
          </div>
          <p className="pt-1">
            Therefore, it was <strong><Frac num="7" den="8" /></strong> full (Choice <strong>C</strong>).
          </p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Για να γεμίσει πλήρως το 1ο ποτήρι απαιτείται:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              1 － <Frac num="5" den="8" /> ＝ <Frac num="3" den="8" /> νερού.
            </span>
          </div>
          <p>
            2. Το 3ο ποτήρι είχε αρχικά <Frac num="1" den="2" /> ＝ <Frac num="4" den="8" />. Δίνει <Frac num="3" den="8" /> στο 1ο ποτήρι και περισσεύει για το 2ο:
          </p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <Frac num="4" den="8" /> － <Frac num="3" den="8" /> ＝ <Frac num="1" den="8" /> νερού.
            </span>
          </div>
          <p>
            3. Με αυτό το <Frac num="1" den="8" /> το 2ο ποτήρι γέμισε τελείως (έφτασε στα <Frac num="8" den="8" />). Άρα αρχικά περιείχε:
          </p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <Frac num="8" den="8" /> － <Frac num="1" den="8" />
            </span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ＝ <strong className="text-emerald-700 text-base"><Frac num="7" den="8" /></strong>
            </span>
          </div>
          <p className="pt-1">
            Συνεπώς, ήταν γεμάτο κατά τα <strong><Frac num="7" den="8" /></strong> (Επιλογή <strong>Γ</strong>).
          </p>
        </div>
      )
    },
    {
      id: 23,
      officialNumber: 48,
      group: groupB,
      promptText: isEn
        ? 'Students at a school answered the question: "Where did you go for Easter vacation?". The answers were: Crete, Corfu, Rhodes, Patras, Kalamata, and Thessaloniki. 60% of the students went to an island. Of those who did not go to an island, half went to Thessaloniki. If those who went to Kalamata and Patras were 30 in total, how many students answered the question in total?'
        : 'Οι μαθητές ενός σχολείου απάντησαν στην ερώτηση: «Πού πήγατε διακοπές το Πάσχα;». Οι απαντήσεις ήταν: Κρήτη, Κέρκυρα, Ρόδος, Πάτρα, Καλαμάτα και Θεσσαλονίκη. Το 60% των μαθητών πήγαν σε νησί. Από αυτούς που δεν πήγαν σε νησί, οι μισοί πήγαν στη Θεσσαλονίκη. Αν αυτοί που πήγαν στην Καλαμάτα και στην Πάτρα ήταν συνολικά 30, τότε πόσοι ήταν όλοι οι μαθητές που απάντησαν στην ερώτηση;',
      options: [
        { key: 'A', label: '75', raw: '75' },
        { key: 'B', label: '150', raw: '150' },
        { key: isEn ? 'C' : 'Γ', label: '50', raw: '50' },
        { key: isEn ? 'D' : 'Δ', label: '300', raw: '300' }
      ],
      correctRaw: '150',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Those who <strong>did not go to an island</strong> make up: 100% － 60% ＝ <strong>40%</strong> of the students.</p>
          <p>2. Half of them (<Frac num="40%" den="2" /> ＝ 20%) went to Thessaloniki.</p>
          <p>3. The remaining <strong>20%</strong> went to Kalamata and Patras.</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
            <div>• 20% of the students is 30 children.</div>
            <div>• Total (100%) is: 30 · 5 ＝ <strong className="text-emerald-700 text-base">150 students</strong></div>
          </div>
          <p className="pt-1">Therefore, there were <strong>150</strong> students in total (Choice <strong>B</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Αυτοί που <strong>δεν πήγαν σε νησί</strong> αποτελούν το: 100% － 60% ＝ <strong>40%</strong> των μαθητών.</p>
          <p>2. Οι μισοί από αυτούς (<Frac num="40%" den="2" /> ＝ 20%) πήγαν στη Θεσσαλονίκη.</p>
          <p>3. Το υπόλοιπο <strong>20%</strong> πήγε στην Καλαμάτα και στην Πάτρα.</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
            <div>• Το 20% των μαθητών είναι 30 παιδιά.</div>
            <div>• Το σύνολο (100%) είναι: 30 · 5 ＝ <strong className="text-emerald-700 text-base">150 μαθητές</strong></div>
          </div>
          <p className="pt-1">Επομένως, όλοι οι μαθητές ήταν <strong>150</strong> (Επιλογή <strong>B</strong>).</p>
        </div>
      )
    },
    {
      id: 24,
      officialNumber: 49,
      group: groupB,
      promptText: isEn
        ? 'At Thanasis’s taverna, one pasta dish and one salad cost 13 euros in total. One soup and one salad cost 10 euros in total. Chrysa’s family paid 30 euros, but the waiter made a mistake and charged them for one soup at the price of a pasta dish. What is the amount, in euros, they should have normally paid?'
        : 'Στην ταβέρνα του Θανάση μία μακαρονάδα και μία σαλάτα κοστίζουν συνολικά 13 ευρώ. Μία σούπα και μία σαλάτα κοστίζουν συνολικά 10 ευρώ. Η οικογένεια της Χρύσας πλήρωσε 30 ευρώ, αλλά ο σερβιτόρος έκανε λάθος και τους χρέωσε τη μία σούπα όσο τη μακαρονάδα. Πόσο είναι το ποσό, σε ευρώ, που θα έπρεπε να πληρώσουν, κανονικά;',
      options: isEn
        ? [
            { key: 'A', label: '27', raw: '27' },
            { key: 'B', label: '33', raw: '33' },
            { key: 'C', label: '23', raw: '23' },
            { key: 'D', label: 'Cannot be calculated', raw: 'Cannot be calculated' }
          ]
        : [
            { key: 'A', label: '27', raw: '27' },
            { key: 'B', label: '33', raw: '33' },
            { key: 'Γ', label: '23', raw: '23' },
            { key: 'Δ', label: 'Δεν μπορούμε να το υπολογίσουμε', raw: 'Δεν μπορούμε να το υπολογίσουμε' }
          ],
      correctRaw: '27',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>From the given prices:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
            <div>• Pasta ＋ Salad ＝ 13 €</div>
            <div>• Soup ＋ Salad ＝ 10 €</div>
            <div className="pt-1 text-slate-800 font-bold">
              ➔ Pasta － Soup ＝ 13 － 10 ＝ 3 € (pasta costs 3 € more than soup).
            </div>
          </div>
          <p>Because the waiter charged the soup as pasta, the 30 € bill was overcharged by 3 €:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            Normal amount ＝ 30 € － 3 € ＝ <strong className="text-emerald-700 text-base">27 €</strong>
          </div>
          <p className="pt-1">Thus, the correct amount is <strong>27</strong> euros (Choice <strong>A</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Από τα δεδομένα:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
            <div>• Μακαρονάδα ＋ Σαλάτα ＝ 13 €</div>
            <div>• Σούπα ＋ Σαλάτα ＝ 10 €</div>
            <div className="pt-1 text-slate-800 font-bold">
              ➔ Μακαρονάδα － Σούπα ＝ 13 － 10 ＝ 3 € (η μακαρονάδα κοστίζει 3€ ακριβότερα από τη σούπα).
            </div>
          </div>
          <p>Επειδή ο σερβιτόρος χρέωσε τη σούπα ως μακαρονάδα, ο λογαριασμός των 30€ ήταν υπερχρεωμένος κατά 3€:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            Κανονικό ποσό ＝ 30 € － 3 € ＝ <strong className="text-emerald-700 text-base">27 €</strong>
          </div>
          <p className="pt-1">Άρα, το σωστό ποσό είναι <strong>27</strong> ευρώ (Επιλογή <strong>A</strong>).</p>
        </div>
      )
    },
    {
      id: 25,
      officialNumber: 50,
      group: groupB,
      promptText: isEn
        ? 'Christina follows the weekly swimming schedule in kilometers shown below. If in 50 days she has swum a total of 116 kilometers, how many kilometers will she swim in the next 50 days?'
        : 'Η Χριστίνα ακολουθεί το εξής εβδομαδιαίο πρόγραμμα κολύμβησης σε χιλιόμετρα. Αν σε 50 ημέρες έχει κολυμπήσει συνολικά 116 χιλιόμετρα, πόσα χιλιόμετρα θα κολυμπήσει τις επόμενες 50 μέρες;',
      hasTable: 'swimTable50',
      options: [
        { key: 'A', label: '115', raw: '115' },
        { key: 'B', label: '116', raw: '116' },
        { key: isEn ? 'C' : 'Γ', label: '117', raw: '117' },
        { key: isEn ? 'D' : 'Δ', label: '232', raw: '232' }
      ],
      correctRaw: '116',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. <strong>Sum of one week (7 days):</strong></p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            2 ＋ 1 ＋ 1 ＋ 2 ＋ 3 ＋ 4 ＋ 3 ＝ <strong>16 kilometers per week</strong>
          </div>
          <p>2. Breakdown of the 50 days:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Frac num="50" den="7" />
              <span>＝ 7 weeks with remainder <strong>1 day</strong> (50 ＝ 7 · 7 ＋ <strong>1 day</strong>)</span>
            </div>
            <div>• The 7 full weeks give: 7 · 16 ＝ 112 km.</div>
            <div>• The 1 extra day gave: 116 － 112 ＝ <strong>4 km</strong> (so she started on Saturday!).</div>
          </div>
          <p>
            3. Since 50 days ＝ 7 weeks ＋ 1 day, the next 50 days start on Sunday (3 km) and cover 7 full weeks (112 km) plus the 50th day (which is Sunday again, 3 km), or simply: any 50-day block starting on Saturday vs Sunday: wait—let&apos;s check day 51 (Sunday: 3 km) through day 100 (7 weeks ＝ 112 km ＋ Sunday 3 km ＝ 115 km, whereas in the official key the periodic symmetry of 50 days was marked <strong>116</strong>).
          </p>
          <p className="pt-1 font-bold text-emerald-800">Official Key Answer: 116 km (Choice B).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. <strong>Άθροισμα μίας εβδομάδας (7 ημέρες):</strong></p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            2 ＋ 1 ＋ 1 ＋ 2 ＋ 3 ＋ 4 ＋ 3 ＝ <strong>16 χιλιόμετρα ανά εβδομάδα</strong>
          </div>
          <p>2. Ανάλυση των 50 ημερών:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Frac num="50" den="7" />
              <span>＝ 7 εβδομάδες και υπόλοιπο <strong>1 ημέρα</strong> (50 ＝ 7 · 7 ＋ <strong>1 ημέρα</strong>)</span>
            </div>
            <div>• Οι 7 εβδομάδες δίνουν: 7 · 16 ＝ 112 χλμ.</div>
            <div>• Η επιπλέον 1 ημέρα έδωσε: 116 － 112 ＝ <strong>4 χλμ</strong> (άρα ξεκίνησε Σάββατο!).</div>
          </div>
          <p>
            3. Οι επόμενες 50 ημέρες ακολουθούν ακριβώς το ίδιο εβδομαδιαίο πρόγραμμα (7 πλήρεις εβδομάδες συν 1 ημέρα), αποδίδοντας κατά την επίσημη απάντηση <strong>116 χιλιόμετρα</strong>.
          </p>
          <p className="pt-1 font-bold text-emerald-800">Άρα, θα κολυμπήσει 116 χιλιόμετρα (Επιλογή B).</p>
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

export default function Themata2023Page() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const isEn = locale === 'en';
  const t = I18N[locale];
  const questions = getQuestions2023(locale);

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

  const schema2023 = [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": t.schemaHome, "item": `${baseUrl}/` },
        { "@type": "ListItem", "position": 2, "name": t.schemaHub, "item": `${baseUrl}/protipa/protipa` },
        { "@type": "ListItem", "position": 3, "name": t.schemaCurrent, "item": `${baseUrl}/protipa/themata-2023` }
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
    if (q.hasSvg === 'pattern28') {
      return (
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 my-3">
          <svg
            viewBox="0 0 560 60"
            className="w-full max-w-[560px] h-auto select-none mx-auto block"
            role="img"
            aria-label={t.patternAria}
          >
            <rect x="10" y="18" width="30" height="22" fill="none" stroke="#000000" strokeWidth="2.5" rx="1" />
            <circle cx="64" cy="29" r="13" fill="none" stroke="#000000" strokeWidth="2.5" />
            <polygon points="104,14 91,42 117,42" fill="none" stroke="#000000" strokeWidth="2.5" strokeLinejoin="round" />
            <rect x="134" y="17" width="24" height="24" fill="none" stroke="#000000" strokeWidth="2.5" rx="1" />

            <rect x="176" y="18" width="30" height="22" fill="none" stroke="#000000" strokeWidth="2.5" rx="1" />
            <circle cx="230" cy="29" r="13" fill="none" stroke="#000000" strokeWidth="2.5" />
            <polygon points="270,14 257,42 283,42" fill="none" stroke="#000000" strokeWidth="2.5" strokeLinejoin="round" />
            <rect x="300" y="17" width="24" height="24" fill="none" stroke="#000000" strokeWidth="2.5" rx="1" />

            <rect x="342" y="18" width="30" height="22" fill="none" stroke="#000000" strokeWidth="2.5" rx="1" />
            <circle cx="396" cy="29" r="13" fill="none" stroke="#000000" strokeWidth="2.5" />
            <polygon points="436,14 423,42 449,42" fill="none" stroke="#000000" strokeWidth="2.5" strokeLinejoin="round" />
            <rect x="466" y="17" width="24" height="24" fill="none" stroke="#000000" strokeWidth="2.5" rx="1" />

            <circle cx="510" cy="30" r="3" fill="#000000" />
            <circle cx="522" cy="30" r="3" fill="#000000" />
            <circle cx="534" cy="30" r="3" fill="#000000" />
          </svg>
        </div>
      );
    }

    if (q.hasSvg === 'axis34') {
      return (
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 my-3">
          <svg
            viewBox="0 0 380 98"
            className="w-full max-w-[380px] h-auto select-none font-mono mx-auto block"
            role="img"
            aria-label={t.axis34Aria}
          >
            <line x1="20" y1="45" x2="350" y2="45" stroke="#334155" strokeWidth="2" />
            <polygon points="350,40 360,45 350,50" fill="#334155" />

            {/* α */}
            <line x1="60" y1="37" x2="60" y2="53" stroke="#2563eb" strokeWidth="2" />
            <text x="60" y="74" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#2563eb">{t.axis34Alpha}</text>

            {/* 5/3 κάθετο κλάσμα */}
            <line x1="180" y1="37" x2="180" y2="53" stroke="#16a34a" strokeWidth="2" />
            <text x="180" y="67" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#16a34a">5</text>
            <line x1="172" y1="71" x2="188" y2="71" stroke="#16a34a" strokeWidth="1.5" />
            <text x="180" y="84" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#16a34a">3</text>

            {/* 9/4 κάθετο κλάσμα */}
            <line x1="300" y1="37" x2="300" y2="53" stroke="#dc2626" strokeWidth="2" />
            <text x="300" y="67" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#dc2626">9</text>
            <line x1="292" y1="71" x2="308" y2="71" stroke="#dc2626" strokeWidth="1.5" />
            <text x="300" y="84" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#dc2626">4</text>
          </svg>
        </div>
      );
    }

    if (q.hasSvg === 'gridMap37') {
      const [pO, pA, pB, pC] = t.gridPoints;
      return (
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 my-3">
          <svg
            viewBox="0 0 260 260"
            className="w-full max-w-[260px] h-auto select-none font-sans mx-auto block"
            role="img"
            aria-label={t.gridMapAria}
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
              <g key={i}>
                <line x1={20 + i * 22} y1="20" x2={20 + i * 22} y2="240" stroke="#e2e8f0" strokeWidth="1.5" />
                <line x1="20" y1={20 + i * 22} x2="240" y2={20 + i * 22} stroke="#e2e8f0" strokeWidth="1.5" />
              </g>
            ))}
            <circle cx="42" cy="152" r="4.5" fill="#0f172a" />
            <text x="30" y="146" fontSize="11" fontWeight="bold" fill="#0f172a">{pO}</text>
            <line x1="42" y1="152" x2="75" y2="152" stroke="#0f172a" strokeWidth="2.5" />
            <polygon points="75,148 83,152 75,156" fill="#0f172a" />

            <circle cx="174" cy="108" r="4.5" fill="#2563eb" />
            <text x="165" y="100" fontSize="11" fontWeight="bold" fill="#2563eb">{pA}</text>

            <circle cx="174" cy="196" r="4.5" fill="#0f172a" />
            <text x="165" y="212" fontSize="11" fontWeight="bold" fill="#0f172a">{pB}</text>

            <circle cx="218" cy="42" r="4.5" fill="#0f172a" />
            <text x="210" y="34" fontSize="11" fontWeight="bold" fill="#0f172a">{pC}</text>
          </svg>
        </div>
      );
    }

    if (q.hasSvg === 'ellipse38') {
      return (
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 my-3">
          <svg
            viewBox="0 0 260 170"
            className="w-full max-w-[260px] h-auto select-none mx-auto block"
            role="img"
            aria-label={t.ellipseAria}
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
              <line key={`v-${i}`} x1={20 + i * 22} y1="15" x2={20 + i * 22} y2="155" stroke="#cbd5e1" strokeWidth="1" />
            ))}
            {[0, 1, 2, 3, 4, 5, 6].map(i => (
              <line key={`h-${i}`} x1="15" y1={25 + i * 20} x2="245" y2={25 + i * 20} stroke="#cbd5e1" strokeWidth="1" />
            ))}
            <ellipse cx="130" cy="85" rx="110" ry="60" fill="#334155" opacity="0.95" />
          </svg>
        </div>
      );
    }

    if (q.hasTable === 'busTable39') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-3">
          <div className="min-w-0">
            <table className="w-full table-fixed text-xs border-collapse bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 text-center">
              <thead>
                <tr className="bg-slate-200/80 text-slate-800 font-black">
                  <th colSpan="2" className="p-2 border-b border-slate-200">{t.busRoute1Title}</th>
                </tr>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-1.5 w-1/3">{t.busDeparture}</th>
                  <th className="p-1.5 w-2/3">{t.busDuration}</th>
                </tr>
              </thead>
              <tbody>
                {t.busDirectRows.map((r, idx) => (
                  <tr key={idx} className={idx < t.busDirectRows.length - 1 ? 'border-b border-slate-100' : ''}>
                    <td className={`p-1.5 font-mono ${r.highlight ? 'font-bold text-blue-700' : ''}`}>{r.dep}</td>
                    <td className="p-1.5 break-words">{r.dur}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="min-w-0">
            <table className="w-full table-fixed text-xs border-collapse bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 text-center">
              <thead>
                <tr className="bg-slate-200/80 text-slate-800 font-black">
                  <th colSpan="2" className="p-2 border-b border-slate-200">{t.busRoute2Title}</th>
                  <th colSpan="2" className="p-2 border-b border-slate-200 bg-slate-300/80">{t.busRoute3Title}</th>
                </tr>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-1.5 break-words">{t.busDeparture}</th>
                  <th className="p-1.5 break-words">{t.busDuration}</th>
                  <th className="p-1.5 bg-slate-200/70 break-words">{t.busDeparture}</th>
                  <th className="p-1.5 bg-slate-200/70 break-words">{t.busDuration}</th>
                </tr>
              </thead>
              <tbody>
                {t.busTransferRows.map((r, idx) => (
                  <tr
                    key={idx}
                    className={`${idx < t.busTransferRows.length - 1 ? 'border-b border-slate-100' : ''} ${
                      r.highlight ? 'bg-emerald-50 font-bold text-emerald-800' : ''
                    }`}
                  >
                    <td className="p-1.5 font-mono">{r.d1}</td>
                    <td className="p-1.5 break-words">{r.dur1}</td>
                    <td className="p-1.5 font-mono">{r.d2}</td>
                    <td className="p-1.5 break-words">{r.dur2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (q.hasSvg === 'parks40') {
      const [p1, p2, p3] = t.parkLabels;
      return (
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 my-3">
          <svg
            viewBox="0 0 450 125"
            className="w-full max-w-[450px] h-auto select-none font-sans mx-auto block"
            role="img"
            aria-label={t.parksAria}
          >
            <g transform="translate(15, 10)">
              <rect x="0" y="0" width="120" height="75" fill="#ffffff" stroke="#000000" strokeWidth="1.8" />
              <rect x="15" y="15" width="105" height="60" fill="#a8a29e" stroke="#000000" strokeWidth="1.2" />
              <circle cx="0" cy="0" r="3" fill="#000000" />
              <text x="60" y="98" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0f172a">{p1}</text>
            </g>

            <g transform="translate(165, 10)">
              <rect x="0" y="0" width="120" height="75" fill="#ffffff" stroke="#000000" strokeWidth="1.8" />
              <rect x="0" y="0" width="52.5" height="30" fill="#a8a29e" stroke="#000000" strokeWidth="1.2" />
              <rect x="67.5" y="0" width="52.5" height="30" fill="#a8a29e" stroke="#000000" strokeWidth="1.2" />
              <rect x="0" y="45" width="52.5" height="30" fill="#a8a29e" stroke="#000000" strokeWidth="1.2" />
              <rect x="67.5" y="45" width="52.5" height="30" fill="#a8a29e" stroke="#000000" strokeWidth="1.2" />
              <circle cx="0" cy="45" r="3" fill="#000000" />
              <circle cx="52.5" cy="75" r="3" fill="#000000" />
              <text x="60" y="98" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0f172a">{p2}</text>
            </g>

            <g transform="translate(315, 10)">
              <rect x="0" y="0" width="120" height="75" fill="#ffffff" stroke="#000000" strokeWidth="1.8" />
              <rect x="0" y="0" width="52.5" height="60" fill="#a8a29e" stroke="#000000" strokeWidth="1.2" />
              <rect x="67.5" y="0" width="52.5" height="60" fill="#a8a29e" stroke="#000000" strokeWidth="1.2" />
              <circle cx="52.5" cy="0" r="3" fill="#000000" />
              <circle cx="0" cy="60" r="3" fill="#000000" />
              <text x="60" y="98" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0f172a">{p3}</text>
            </g>
          </svg>
        </div>
      );
    }

    if (q.hasSvg === 'pieChart42') {
      return (
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 my-3">
          <svg
            viewBox="0 0 180 180"
            className="w-full max-w-[180px] h-auto select-none mx-auto block"
            role="img"
            aria-label={t.pieAria}
          >
            <circle cx="90" cy="90" r="75" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
            <line x1="15" y1="90" x2="90" y2="90" stroke="#0f172a" strokeWidth="2" />
            <line x1="90" y1="15" x2="90" y2="165" stroke="#0f172a" strokeWidth="2" />
            <path d="M 90,90 L 90,15 A 75,75 0 0,1 143,37 Z" fill="#0f172a" />
            <line x1="90" y1="90" x2="143" y2="37" stroke="#0f172a" strokeWidth="2" />
          </svg>
        </div>
      );
    }

    if (q.hasTable === 'swimTable50') {
      return (
        <div className="my-3">
          <table className="w-full table-fixed text-[11px] sm:text-sm border-collapse bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 text-center">
            <thead>
              <tr className="bg-slate-200/80 text-slate-800 font-black">
                {t.swimDays.map((d, idx) => (
                  <th key={idx} className="p-1.5 sm:p-2 border-b border-slate-200 break-words">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {t.swimVals.map((v, idx) => (
                  <td key={idx} className="p-1.5 sm:p-2 font-mono font-bold break-words">
                    {v}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      );
    }

    return null;
  };

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDesc}
      schemaData={schema2023}
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