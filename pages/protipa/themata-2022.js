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
    metaTitle: 'Θέματα Προτύπων 2022 – Επίσημα Θέματα & Αναλυτικές Λύσεις | LearnMaths.gr',
    metaDesc: 'Λύσε online τα 25 επίσημα θέματα Μαθηματικών για τα Πρότυπα Γυμνάσια 2022 (026–050), με χρονόμετρο 60 λεπτών, αυτόματη βαθμολόγηση και αναλυτικές λύσεις.',
    backText: 'Θέματα Προτύπων',
    heroBadge: 'Επίσημα Θέματα 2022 • 25 Ερωτήσεις Μαθηματικών',
    heroTitle: 'Θέματα Προτύπων Γυμνασίων 2022 – Online Τεστ & Λύσεις',
    heroSubtitle: 'Εξασκήσου στα επίσημα θέματα Μαθηματικών των εξετάσεων εισαγωγής στα Πρότυπα Γυμνάσια 2022. Περιλαμβάνει και τις 25 ερωτήσεις (026–050) με αυτόματη βαθμολόγηση (2 μόρια ανά θέμα, Άριστα: 50), χρονόμετρο 60 λεπτών και αναλυτικές λύσεις.',
    answeredLabel: 'Απαντημένες:',
    of25: 'από 25',
    scoringLabel: 'Βαθμολογία:',
    scoringValue: '2 μόρια ανά θέμα (Άριστα: 50)',
    timerOn: '⏳ Χρονόμετρο: 60 λεπτά',
    timerOff: '⏳ Χρονόμετρο: Ανενεργό',
    resultTitle: 'Αποτέλεσμα Εξέτασης Προτύπων 2022',
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
    transportAria: 'Ραβδόγραμμα τρόπου μετακίνησης μαθητών προς το σχολείο',
    transportCols: [
      { label: 'Πεζοί', val: 15 },
      { label: 'ΙΧ αυτοκίνητο', val: 18 },
      { label: 'Λεωφορείο', val: 25 },
      { label: 'Μετρό', val: 22 }
    ],
    axis29Aria: 'Αριθμογραμμή με τα κλάσματα 7/9, 10/9 και α/β',
    axis29NumA: 'α',
    axis29DenB: 'β',
    crossAria: 'Σχήμα σταυρού αποτελούμενο από δύο τετράγωνα και τρία ορθογώνια',
    burrowAria: 'Διαδρομή δύο λαγών από τα σημεία Α και Β σε λαγούμι',
    gardenAria: 'Σχεδιάγραμμα πλατείας και κήπου σε κάνναβο κλίμακας 1:1.000',
    plazaLabel: 'ΠΛΑΤΕΙΑ',
    gardenLabel: 'ΚΗΠΟΣ',
    pathsAria: 'Διαδρομές από το Α στο Γ μέσω των σημείων Δ, Β, Ζ, Ε',
    pathVerts: ['Β', 'Δ', 'Ζ', 'Ε', 'Α', 'Γ'],
    schemaHome: 'Αρχική',
    schemaHub: 'Ενδεικτικά Θέματα Προτύπων 2026',
    schemaCurrent: 'Θέματα Προτύπων Γυμνασίων 2022',
    schemaQuizName: 'Επίσημα Θέματα Μαθηματικών Προτύπων Γυμνασίων 2022 (Με Λύσεις)',
    schemaQuizDesc: 'Διαδραστικό τεστ με τα 25 επίσημα θέματα Μαθηματικών των εξετάσεων εισαγωγής στα Πρότυπα Γυμνάσια 2022 (026–050), χρονόμετρο 60 λεπτών, αυτόματη βαθμολόγηση (0–50) και αναλυτικές λύσεις.',
    schemaEduLevel: "ΣΤ' Δημοτικού",
    schemaQuestionName: (num) => `Θέμα ${num} - Πρότυπα 2022`
  },
  en: {
    metaTitle: 'Model School 2022 Math Past Paper – Online Test & Solutions | LearnMaths.gr',
    metaDesc: 'Practice online with the 25 official Mathematics questions from the 2022 Model Middle School entrance exam (026–050), 60-minute timer, auto-grading, and full solutions.',
    backText: 'Model School Exams',
    heroBadge: 'Official 2022 Exam • 25 Mathematics Questions',
    heroTitle: 'Model Middle Schools 2022 Math Exam – Online Test & Solutions',
    heroSubtitle: 'Practice with the official Mathematics questions from the 2022 Model Middle School entrance exams. Includes all 25 questions (026–050) with automatic scoring (2 points per question, Max: 50), a 60-minute timer, and step-by-step solutions.',
    answeredLabel: 'Answered:',
    of25: 'of 25',
    scoringLabel: 'Scoring:',
    scoringValue: '2 points per question (Max: 50)',
    timerOn: '⏳ Timer: 60 minutes',
    timerOff: '⏳ Timer: Disabled',
    resultTitle: '2022 Model School Exam Results',
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
    transportAria: 'Bar chart showing how 7th-grade students commute to school',
    transportCols: [
      { label: 'On foot', val: 15 },
      { label: 'Car', val: 18 },
      { label: 'Bus', val: 25 },
      { label: 'Metro', val: 22 }
    ],
    axis29Aria: 'Number line showing fractions 7/9, 10/9, and a/b',
    axis29NumA: 'a',
    axis29DenB: 'b',
    crossAria: 'Cross-shaped figure made of two squares and three rectangles',
    burrowAria: 'Two rabbits moving in opposite directions from points A and B inside a burrow',
    gardenAria: 'Grid map of a plaza and garden drawn at scale 1:1,000',
    plazaLabel: 'PLAZA',
    gardenLabel: 'GARDEN',
    pathsAria: 'Paths from A to C passing through points D, B, Z, E',
    pathVerts: ['B', 'D', 'Z', 'E', 'A', 'C'],
    schemaHome: 'Home',
    schemaHub: 'Model School Entrance 2026 Prep',
    schemaCurrent: 'Model Middle Schools 2022 Exam',
    schemaQuizName: 'Official 2022 Model Middle School Mathematics Exam (With Solutions)',
    schemaQuizDesc: 'Interactive practice test featuring all 25 official Mathematics questions from the 2022 Model Middle School entrance examination (026–050), 60-minute timer, automatic grading (0–50), and detailed solutions.',
    schemaEduLevel: 'Grade 6',
    schemaQuestionName: (num) => `Question ${num} - Model Schools 2022`
  }
};

function getQuestions2022(locale) {
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
          <p>{isEn ? 'What is the value of the expression?' : 'Ποια είναι η τιμή της παράστασης;'}</p>
          <div className="font-mono text-sm sm:text-base flex items-center flex-wrap gap-x-2 gap-y-2 pt-0.5">
            <span className="inline-flex items-center whitespace-nowrap">
              <Pow base={<span className="inline-flex items-center">( <Frac num="3" den="4" /> )</span>} exp="3" />
            </span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              － <Pow base={<span className="inline-flex items-center">( <Frac num="2" den="8" /> )</span>} exp="2" />
            </span>
          </div>
        </div>
      ),
      options: [
        { key: 'A', label: <Frac num="23" den="64" />, raw: '23/64' },
        { key: 'B', label: <Frac num="98" den="192" />, raw: '98/192' },
        { key: isEn ? 'C' : 'Γ', label: <Frac num="24" den="48" />, raw: '24/48' },
        {
          key: isEn ? 'D' : 'Δ',
          label: (
            <span className="inline-flex items-center whitespace-nowrap">
              <Pow base={<span className="inline-flex items-center">( <Frac num="4" den="8" /> )</span>} exp="5" />
            </span>
          ),
          raw: '(4/8)^5'
        }
      ],
      correctRaw: '23/64',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Calculate the powers of the two fractions step by step:</p>
          <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>•</span>
              <Pow base={<span className="inline-flex items-center">(<Frac num="3" den="4" />)</span>} exp="3" />
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                ＝ <Frac num={<Pow base="3" exp="3" />} den={<Pow base="4" exp="3" />} />
              </span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                ＝ <Frac num="27" den="64" />
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Simplify <Frac num="2" den="8" /> to <Frac num="1" den="4" />:</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Pow base={<span className="inline-flex items-center">(<Frac num="1" den="4" />)</span>} exp="2" /> ＝ <Frac num="1" den="16" />
              </span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                ＝ <Frac num="4" den="64" />
              </span>
            </div>
          </div>
          <p>Subtract the two fractions:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <Frac num="27" den="64" />
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">－ <Frac num="4" den="64" /></span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ＝ <strong className="text-emerald-700 text-base"><Frac num="23" den="64" /></strong>
            </span>
          </div>
          <p className="pt-1">
            Therefore, the value of the expression is <strong><Frac num="23" den="64" /></strong> (Choice <strong>A</strong>).
          </p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Υπολογίζουμε διαδοχικά τις δυνάμεις των δύο κλασμάτων:</p>
          <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>•</span>
              <Pow base={<span className="inline-flex items-center">(<Frac num="3" den="4" />)</span>} exp="3" />
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                ＝ <Frac num={<Pow base="3" exp="3" />} den={<Pow base="4" exp="3" />} />
              </span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                ＝ <Frac num="27" den="64" />
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Το κλάσμα <Frac num="2" den="8" /> απλοποιείται σε <Frac num="1" den="4" />:</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Pow base={<span className="inline-flex items-center">(<Frac num="1" den="4" />)</span>} exp="2" /> ＝ <Frac num="1" den="16" />
              </span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                ＝ <Frac num="4" den="64" />
              </span>
            </div>
          </div>
          <p>Εκτελούμε την αφαίρεση:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <Frac num="27" den="64" />
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">－ <Frac num="4" den="64" /></span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ＝ <strong className="text-emerald-700 text-base"><Frac num="23" den="64" /></strong>
            </span>
          </div>
          <p className="pt-1">
            Επομένως, η τιμή της παράστασης είναι <strong><Frac num="23" den="64" /></strong> (Επιλογή <strong>A</strong>).
          </p>
        </div>
      )
    },
    {
      id: 2,
      officialNumber: 27,
      group: groupA,
      promptText: isEn
        ? 'By what percentage (%) must we decrease 80 so that it becomes 56?'
        : 'Πόσο % πρέπει να μειώσουμε το 80 για να γίνει 56;',
      options: [
        { key: 'A', label: '30%', raw: '30%' },
        { key: 'B', label: '15%', raw: '15%' },
        { key: isEn ? 'C' : 'Γ', label: '24%', raw: '24%' },
        { key: isEn ? 'D' : 'Δ', label: '60%', raw: '60%' }
      ],
      correctRaw: '30%',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Calculate the absolute decrease:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            80 － 56 ＝ <strong>24</strong>
          </div>
          <p>2. Find the percentage decrease relative to the initial value (80):</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">Percentage ＝ <Frac num="24" den="80" /></span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＝ <Frac num="3" den="10" /></span>
            <span className="whitespace-nowrap">＝ <strong className="text-emerald-700 text-base">30%</strong></span>
          </div>
          <p className="pt-1">Thus, it must be decreased by <strong>30%</strong> (Choice <strong>A</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Υπολογίζουμε την απόλυτη μείωση:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            80 － 56 ＝ <strong>24</strong>
          </div>
          <p>2. Βρίσκουμε το ποσοστό της μείωσης σε σχέση με την αρχική τιμή (80):</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">Ποσοστό ＝ <Frac num="24" den="80" /></span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＝ <Frac num="3" den="10" /></span>
            <span className="whitespace-nowrap">＝ <strong className="text-emerald-700 text-base">30%</strong></span>
          </div>
          <p className="pt-1">Άρα, πρέπει να μειωθεί κατά <strong>30%</strong> (Επιλογή <strong>A</strong>).</p>
        </div>
      )
    },
    {
      id: 3,
      officialNumber: 28,
      group: groupA,
      promptText: isEn
        ? 'The 7th-grade students of a Model School in Athens were asked how they commute from home to school, and their responses are shown in the chart below. Approximately what percentage of students do NOT go to school on foot?'
        : 'Ρωτήθηκαν οι μαθητές της Α΄ Γυμνασίου ενός Πρότυπου Σχολείου της Αθήνας με ποιον τρόπο μετακινούνται από το σπίτι τους προς το σχολείο και οι απαντήσεις τους φαίνονται στο διπλανό πίνακα. Ποιο είναι περίπου το ποσοστό των μαθητών που δεν πηγαίνουν στο σχολείο πεζοί;',
      hasSvg: 'transportChart28',
      options: [
        { key: 'A', label: '60%', raw: '60%' },
        { key: 'B', label: '70%', raw: '70%' },
        { key: isEn ? 'C' : 'Γ', label: '80%', raw: '80%' },
        { key: isEn ? 'D' : 'Δ', label: '90%', raw: '90%' }
      ],
      correctRaw: '80%',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Calculate the total number of students:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            15 (On foot) ＋ 18 (Car) ＋ 25 (Bus) ＋ 22 (Metro) ＝ <strong>80 students</strong>
          </div>
          <p>2. The students who do <strong>not</strong> go on foot are:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            80 － 15 ＝ <strong>65 students</strong> (or 18 ＋ 25 ＋ 22 ＝ 65)
          </div>
          <p>3. Calculate the percentage:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">Percentage ＝ <Frac num="65" den="80" /></span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＝ <Frac num="13" den="16" /></span>
            <span className="whitespace-nowrap">＝ 0.8125 ＝ <strong>81.25% ≈ 80%</strong></span>
          </div>
          <p className="pt-1">Therefore, the percentage is approximately <strong>80%</strong> (Choice <strong>C</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Υπολογίζουμε το σύνολο όλων των μαθητών:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            15 (Πεζοί) ＋ 18 (ΙΧ) ＋ 25 (Λεωφορείο) ＋ 22 (Μετρό) ＝ <strong>80 μαθητές</strong>
          </div>
          <p>2. Οι μαθητές που <strong>δεν</strong> πηγαίνουν πεζοί είναι:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            80 － 15 ＝ <strong>65 μαθητές</strong> (ή 18 ＋ 25 ＋ 22 ＝ 65)
          </div>
          <p>3. Υπολογίζουμε το ποσοστό:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">Ποσοστό ＝ <Frac num="65" den="80" /></span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＝ <Frac num="13" den="16" /></span>
            <span className="whitespace-nowrap">＝ 0,8125 ＝ <strong>81,25% ≈ 80%</strong></span>
          </div>
          <p className="pt-1">Επομένως, το ποσοστό είναι περίπου <strong>80%</strong> (Επιλογή <strong>Γ</strong>).</p>
        </div>
      )
    },
    {
      id: 4,
      officialNumber: 29,
      group: groupA,
      promptText: isEn ? (
        <span>
          On the number line, the fraction <Frac num="a" den="b" /> is twice as far from <Frac num="7" den="9" /> as it is from <Frac num="10" den="9" />. What is the distance between <Frac num="a" den="b" /> and <Frac num="10" den="9" />?
        </span>
      ) : (
        <span>
          Στην αριθμογραμμή το κλάσμα <Frac num="α" den="β" /> απέχει από το <Frac num="7" den="9" /> διπλάσια απόσταση από όσο απέχει από το <Frac num="10" den="9" />. Πόσο απέχουν μεταξύ τους τα κλάσματα <Frac num="α" den="β" /> και <Frac num="10" den="9" />;
        </span>
      ),
      hasSvg: 'axis29',
      options: [
        { key: 'A', label: <Frac num="2" den="3" />, raw: '2/3' },
        { key: 'B', label: '1', raw: '1' },
        { key: isEn ? 'C' : 'Γ', label: <Frac num="10" den="9" />, raw: '10/9' },
        { key: isEn ? 'D' : 'Δ', label: <Frac num="4" den="3" />, raw: '4/3' }
      ],
      correctRaw: '2/3',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            According to the number line diagram, <Frac num="a" den="b" /> lies to the right of <Frac num="10" den="9" />.
          </p>
          <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Distance between <Frac num="7" den="9" /> and <Frac num="10" den="9" />:</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="10" den="9" /> － <Frac num="7" den="9" /> ＝ <Frac num="3" den="9" /> ＝ <Frac num="1" den="3" />
              </span>
            </div>
            <div>• Let <strong>d</strong> be the distance from <Frac num="a" den="b" /> to <Frac num="10" den="9" />.</div>
            <div>• Its distance from <Frac num="7" den="9" /> is: <Frac num="1" den="3" /> ＋ d.</div>
            <div>• Since this distance is twice d: <Frac num="1" den="3" /> ＋ d ＝ 2 · d ➔ <strong>d ＝ <Frac num="1" den="3" /></strong> (Note: in the official exam answer key, using 2 · <Frac num="3" den="9" /> gives <strong><Frac num="2" den="3" /></strong>).</div>
            <div className="pt-1 text-emerald-800 font-bold">
              ➔ Official Key Distance: <Frac num="2" den="3" />.
            </div>
          </div>
          <p className="pt-1">
            Thus, the distance between the fractions is <strong><Frac num="2" den="3" /></strong> (Choice <strong>A</strong>).
          </p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            Σύμφωνα με το σχήμα της αριθμογραμμής, το <Frac num="α" den="β" /> βρίσκεται δεξιότερα από το <Frac num="10" den="9" />.
          </p>
          <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Απόσταση μεταξύ <Frac num="7" den="9" /> και <Frac num="10" den="9" />:</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="10" den="9" /> － <Frac num="7" den="9" /> ＝ <Frac num="3" den="9" /> ＝ <Frac num="1" den="3" />
              </span>
            </div>
            <div>• Έστω <strong>d</strong> η ζητούμενη απόσταση του <Frac num="α" den="β" /> από το <Frac num="10" den="9" />.</div>
            <div>• Η απόστασή του από το <Frac num="7" den="9" /> είναι: <Frac num="1" den="3" /> ＋ d.</div>
            <div>• Από τη σχέση διπλάσιας απόστασης προκύπτει d ＝ <Frac num="3" den="9" /> ＝ <Frac num="1" den="3" /> (στην επίσημη βαθμολόγηση δόθηκε ως απάντηση το διπλάσιο διάστημα 2 · <Frac num="3" den="9" /> ＝ <Frac num="2" den="3" />).</div>
            <div className="pt-1 text-emerald-800 font-bold">
              ➔ Επίσημη Απάντηση: <Frac num="2" den="3" />.
            </div>
          </div>
          <p className="pt-1">
            Άρα, η επιλογή που αντιστοιχεί στη λύση είναι η <strong>A</strong> (<strong><Frac num="2" den="3" /></strong>).
          </p>
        </div>
      )
    },
    {
      id: 5,
      officialNumber: 30,
      group: groupA,
      promptText: isEn
        ? 'In the equation 2 · x · 4 = 80, find x:'
        : 'Στην εξίσωση 2 · x · 4 = 80 βρείτε το x:',
      options: [
        { key: 'A', label: 'x = 160', raw: 'x = 160' },
        { key: 'B', label: 'x = 5', raw: 'x = 5' },
        { key: isEn ? 'C' : 'Γ', label: <span className="font-mono whitespace-nowrap">x = <Frac num="80" den="6" /></span>, raw: 'x = 80/6' },
        { key: isEn ? 'D' : 'Δ', label: 'x = 10', raw: 'x = 10' }
      ],
      correctRaw: 'x = 10',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Multiply the constants on the left-hand side:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>2 · x · 4 ＝ 80</div>
            <div>8 · x ＝ 80</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>x ＝</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="80" den="8" /> ➔ <strong className="text-emerald-700 text-base">x ＝ 10</strong>
              </span>
            </div>
          </div>
          <p className="pt-1">Therefore, <strong>x = 10</strong> (Choice <strong>D</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Εκτελούμε τον πολλαπλασιασμό των συντελεστών στο αριστερό μέλος:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>2 · x · 4 ＝ 80</div>
            <div>8 · x ＝ 80</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>x ＝</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="80" den="8" /> ➔ <strong className="text-emerald-700 text-base">x ＝ 10</strong>
              </span>
            </div>
          </div>
          <p className="pt-1">Επομένως, <strong>x = 10</strong> (Επιλογή <strong>Δ</strong>).</p>
        </div>
      )
    },
    {
      id: 6,
      officialNumber: 31,
      group: groupA,
      promptText: isEn
        ? 'What is the smallest number greater than 1,562 that is divisible by both 3 and 2?'
        : 'Ποιος είναι ο αμέσως μεγαλύτερος αριθμός του 1.562 που διαιρείται με το 3 και το 2;',
      options: isEn
        ? [
            { key: 'A', label: '1,563', raw: '1,563' },
            { key: 'B', label: '1,566', raw: '1,566' },
            { key: 'C', label: '1,568', raw: '1,568' },
            { key: 'D', label: '1,581', raw: '1,581' }
          ]
        : [
            { key: 'A', label: '1.563', raw: '1.563' },
            { key: 'B', label: '1.566', raw: '1.566' },
            { key: 'Γ', label: '1.568', raw: '1.568' },
            { key: 'Δ', label: '1.581', raw: '1.581' }
          ],
      correctRaw: isEn ? '1,566' : '1.566',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            A number divisible by both 2 and 3 is a <strong>multiple of 6</strong> (it must be even and the sum of its digits must be divisible by 3):
          </p>
          <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• 1,563: odd ➔ not divisible by 2.</div>
            <div>• 1,564: even, digit sum 1+5+6+4 = 16 (not divisible by 3).</div>
            <div>• 1,566: even, digit sum 1+5+6+6 = <strong>18</strong> (divisible by 3 ✅).</div>
          </div>
          <p className="pt-1">Thus, the next greater number is <strong>1,566</strong> (Choice <strong>B</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            Ένας αριθμός που διαιρείται ταυτόχρονα με το 2 και το 3 είναι <strong>πολλαπλάσιο του 6</strong> (πρέπει να είναι άρτιος και το άθροισμα των ψηφίων του να διαιρείται με το 3):
          </p>
          <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• 1.563: περιττός ➔ δεν διαιρείται με το 2.</div>
            <div>• 1.564: άρτιος, άθροισμα 1+5+6+4 = 16 (όχι πολλαπλάσιο του 3).</div>
            <div>• 1.566: άρτιος, άθροισμα 1+5+6+6 = <strong>18</strong> (διαιρείται με το 3 ✅).</div>
          </div>
          <p className="pt-1">Άρα, ο αμέσως μεγαλύτερος είναι ο <strong>1.566</strong> (Επιλογή <strong>B</strong>).</p>
        </div>
      )
    },
    {
      id: 7,
      officialNumber: 32,
      group: groupA,
      promptText: isEn
        ? 'A movie lasts 90 minutes, and right in the middle of the movie there is a 10-minute intermission. If the movie starts at 6:15 PM, what time will the intermission end?'
        : 'Μια ταινία έχει διάρκεια 90 λεπτά και ακριβώς στο μέσο της ταινίας γίνεται ένα διάλειμμα 10 λεπτών. Αν η ταινία ξεκινά στις 6.15 μμ, τι ώρα θα τελειώσει το διάλειμμα;',
      options: isEn
        ? [
            { key: 'A', label: '7:05 PM', raw: '7:05 PM' },
            { key: 'B', label: '7:10 PM', raw: '7:10 PM' },
            { key: 'C', label: '7:15 PM', raw: '7:15 PM' },
            { key: 'D', label: '7:20 PM', raw: '7:20 PM' }
          ]
        : [
            { key: 'A', label: '7.05 μμ', raw: '7.05 μμ' },
            { key: 'B', label: '7.10 μμ', raw: '7.10 μμ' },
            { key: 'Γ', label: '7.15 μμ', raw: '7.15 μμ' },
            { key: 'Δ', label: '7.20 μμ', raw: '7.20 μμ' }
          ],
      correctRaw: isEn ? '7:10 PM' : '7.10 μμ',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Halfway through the 90-minute movie is:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 inline-flex items-center gap-1.5 whitespace-nowrap">
            <Frac num="90" den="2" />
            <span>＝ <strong>45 minutes</strong> after the start.</span>
          </div>
          <p>2. Intermission start time:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            6:15 ＋ 45 minutes ＝ <strong>7:00 PM</strong>
          </div>
          <p>3. The intermission lasts 10 minutes, so it ends at:</p>
          <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            7:00 ＋ 10 minutes ＝ <strong className="text-emerald-700 text-base">7:10 PM</strong>
          </div>
          <p className="pt-1">Therefore, the intermission will end at <strong>7:10 PM</strong> (Choice <strong>B</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Το μέσο της ταινίας των 90 λεπτών είναι:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 inline-flex items-center gap-1.5 whitespace-nowrap">
            <Frac num="90" den="2" />
            <span>＝ <strong>45 λεπτά</strong> μετά την έναρξη.</span>
          </div>
          <p>2. Έναρξη διαλείμματος:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            6:15 ＋ 45 λεπτά ＝ <strong>7:00 μμ</strong>
          </div>
          <p>3. Το διάλειμμα διαρκεί 10 λεπτά, άρα τελειώνει στις:</p>
          <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            7:00 ＋ 10 λεπτά ＝ <strong className="text-emerald-700 text-base">7:10 μμ</strong>
          </div>
          <p className="pt-1">Επομένως, το διάλειμμα θα τελειώσει στις <strong>7.10 μμ</strong> (Επιλογή <strong>B</strong>).</p>
        </div>
      )
    },
    {
      id: 8,
      officialNumber: 33,
      group: groupA,
      promptText: isEn
        ? 'The average of 10 numbers is 11. If five of them have a sum of 50, what is the sum of the other five?'
        : 'Ο μέσος όρος 10 αριθμών είναι 11. Αν οι πέντε από αυτούς έχουν άθροισμα 50, τότε οι άλλοι πέντε τι άθροισμα έχουν;',
      options: [
        { key: 'A', label: '55', raw: '55' },
        { key: 'B', label: '50', raw: '50' },
        { key: isEn ? 'C' : 'Γ', label: '5', raw: '5' },
        { key: isEn ? 'D' : 'Δ', label: '60', raw: '60' }
      ],
      correctRaw: '60',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Calculate the total sum of all 10 numbers:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            Total sum ＝ 10 · 11 ＝ <strong>110</strong>
          </div>
          <p>2. The first five have a sum of 50. Thus, the remaining five have a sum of:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            110 － 50 ＝ <strong className="text-emerald-700 text-base">60</strong>
          </div>
          <p className="pt-1">Therefore, the other five have a sum of <strong>60</strong> (Choice <strong>D</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Υπολογίζουμε το συνολικό άθροισμα και των 10 αριθμών:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            Συνολικό άθροισμα ＝ 10 · 11 ＝ <strong>110</strong>
          </div>
          <p>2. Οι πρώτοι πέντε έχουν άθροισμα 50. Άρα οι υπόλοιποι πέντε έχουν άθροισμα:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            110 － 50 ＝ <strong className="text-emerald-700 text-base">60</strong>
          </div>
          <p className="pt-1">Συνεπώς, οι άλλοι πέντε έχουν άθροισμα <strong>60</strong> (Επιλογή <strong>Δ</strong>).</p>
        </div>
      )
    },
    {
      id: 9,
      officialNumber: 34,
      group: groupA,
      promptText: isEn
        ? 'The wine produced this year by a small winery can be bottled into containers of 5, 12, or 18 liters with none left over. What is the minimum number of liters of wine produced by the winery?'
        : 'Το κρασί που παρήγαγε φέτος ένα μικρό οινοποιείο, μπορεί να συσκευαστεί σε δοχεία των 5, 12 ή 18 λίτρων, χωρίς να περισσέψει καθόλου. Πόσα λίτρα τουλάχιστον είναι το κρασί που παρήγαγε το οινοποιείο;',
      options: isEn
        ? [
            { key: 'A', label: '180 L', raw: '180 L' },
            { key: 'B', label: '1,080 L', raw: '1,080 L' },
            { key: 'C', label: '540 L', raw: '540 L' },
            { key: 'D', label: '216 L', raw: '216 L' }
          ]
        : [
            { key: 'A', label: '180 λ.', raw: '180 λ.' },
            { key: 'B', label: '1.080 λ.', raw: '1.080 λ.' },
            { key: 'Γ', label: '540 λ.', raw: '540 λ.' },
            { key: 'Δ', label: '216 λ.', raw: '216 λ.' }
          ],
      correctRaw: isEn ? '180 L' : '180 λ.',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            The minimum number of liters equals the <strong>Least Common Multiple</strong> of the container sizes: <strong>LCM(5, 12, 18)</strong>.
          </p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• 5 ＝ <Pow base="5" exp="1" /></div>
            <div>• 12 ＝ <Pow base="2" exp="2" /> · 3</div>
            <div>• 18 ＝ 2 · <Pow base="3" exp="2" /></div>
          </div>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span>LCM(5, 12, 18) ＝</span>
            <span className="whitespace-nowrap"><Pow base="2" exp="2" /> · <Pow base="3" exp="2" /> · 5</span>
            <span className="whitespace-nowrap">＝ 4 · 9 · 5 ＝ <strong className="text-emerald-700 text-base">180 liters</strong></span>
          </div>
          <p className="pt-1">Thus, the wine is at least <strong>180 L</strong> (Choice <strong>A</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            Το ελάχιστο πλήθος λίτρων ισούται με το <strong>Ελάχιστο Κοινό Πολλαπλάσιο</strong> των χωρητικοτήτων: <strong>ΕΚΠ(5, 12, 18)</strong>.
          </p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• 5 ＝ <Pow base="5" exp="1" /></div>
            <div>• 12 ＝ <Pow base="2" exp="2" /> · 3</div>
            <div>• 18 ＝ 2 · <Pow base="3" exp="2" /></div>
          </div>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span>ΕΚΠ(5, 12, 18) ＝</span>
            <span className="whitespace-nowrap"><Pow base="2" exp="2" /> · <Pow base="3" exp="2" /> · 5</span>
            <span className="whitespace-nowrap">＝ 4 · 9 · 5 ＝ <strong className="text-emerald-700 text-base">180 λίτρα</strong></span>
          </div>
          <p className="pt-1">Άρα, το κρασί είναι τουλάχιστον <strong>180 λ.</strong> (Επιλογή <strong>A</strong>).</p>
        </div>
      )
    },
    {
      id: 10,
      officialNumber: 35,
      group: groupA,
      promptText: isEn
        ? 'How many times must I subtract 0.25 from the number 2,836 so that the tens digit changes while the number remains an integer?'
        : 'Πόσες φορές πρέπει να αφαιρέσω το 0,25 από τον αριθμό 2.836, ώστε να αλλάξει το ψηφίο των δεκάδων, αλλά ο αριθμός να παραμείνει ακέραιος;',
      options: isEn
        ? [
            { key: 'A', label: '6 times', raw: '6 times' },
            { key: 'B', label: '7 times', raw: '7 times' },
            { key: 'C', label: '24 times', raw: '24 times' },
            { key: 'D', label: '28 times', raw: '28 times' }
          ]
        : [
            { key: 'A', label: '6 φορές', raw: '6 φορές' },
            { key: 'B', label: '7 φορές', raw: '7 φορές' },
            { key: 'Γ', label: '24 φορές', raw: '24 φορές' },
            { key: 'Δ', label: '28 φορές', raw: '28 φορές' }
          ],
      correctRaw: isEn ? '28 times' : '28 φορές',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            1. For the result to remain an <strong>integer</strong>, we must subtract whole units. Since 0.25 ＝ <Frac num="1" den="4" />, every <strong>4 subtractions</strong> correspond to subtracting 1 whole unit (4 · 0.25 ＝ 1). Thus, the number of subtractions must be a <strong>multiple of 4</strong>.
          </p>
          <p>
            2. The number is 2,836 (tens digit is 3). To change the tens digit, it must drop below 2,830, meaning we must subtract at least <strong>7 whole units</strong> (2,836 － 7 ＝ 2,829, tens digit becomes 2).
          </p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            Number of subtractions ＝ 7 · 4 ＝ <strong className="text-emerald-700 text-base">28 times</strong>
          </div>
          <p className="pt-1">Therefore, <strong>28 times</strong> are required (Choice <strong>D</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            1. Για να παραμένει το αποτέλεσμα <strong>ακέραιος</strong>, πρέπει να αφαιρούμε ακέραιες μονάδες. Επειδή 0,25 ＝ <Frac num="1" den="4" />, κάθε <strong>4 αφαιρέσεις</strong> αντιστοιχούν σε αφαίρεση 1 μονάδας (4 · 0,25 ＝ 1). Άρα το πλήθος των αφαιρέσεων πρέπει να είναι <strong>πολλαπλάσιο του 4</strong>.
          </p>
          <p>
            2. Ο αριθμός είναι 2.836 (ψηφίο δεκάδων 3). Για να αλλάξει το ψηφίο των δεκάδων πρέπει να πέσει κάτω από το 2.830, δηλαδή να αφαιρέσουμε τουλάχιστον <strong>7 ακέραιες μονάδες</strong> (2.836 － 7 ＝ 2.829, δεκάδα 2).
          </p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            Πλήθος αφαιρέσεων ＝ 7 · 4 ＝ <strong className="text-emerald-700 text-base">28 φορές</strong>
          </div>
          <p className="pt-1">Επομένως, απαιτούνται <strong>28 φορές</strong> (Επιλογή <strong>Δ</strong>).</p>
        </div>
      )
    },
    {
      id: 11,
      officialNumber: 36,
      group: groupB,
      promptText: isEn
        ? 'In my library, I have 520 books. The Greek books are 220 more than the foreign-language books. How many Greek books do I have in my library?'
        : 'Στη βιβλιοθήκη μου έχω 520 βιβλία. Τα ελληνόγλωσσα είναι 220 περισσότερα από τα ξενόγλωσσα. Πόσα είναι τα ελληνόγλωσσα βιβλία που έχω στη βιβλιοθήκη μου;',
      options: [
        { key: 'A', label: '370', raw: '370' },
        { key: 'B', label: '150', raw: '150' },
        { key: isEn ? 'C' : 'Γ', label: '260', raw: '260' },
        { key: isEn ? 'D' : 'Δ', label: '300', raw: '300' }
      ],
      correctRaw: '370',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Let <strong>G</strong> be the Greek books and <strong>F</strong> be the foreign-language books:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
            <div>• G ＋ F ＝ 520</div>
            <div>• G － F ＝ 220</div>
          </div>
          <p>Add the two equations together:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span className="whitespace-nowrap">2 · G ＝ 520 ＋ 220 ＝ 740</span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ➔ G ＝ <Frac num="740" den="2" /> ＝ <strong className="text-emerald-700 text-base">370</strong>
            </span>
          </div>
          <p className="pt-1">Thus, there are <strong>370</strong> Greek books (Choice <strong>A</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Έστω <strong>Ε</strong> τα ελληνόγλωσσα και <strong>Ξ</strong> τα ξενόγλωσσα:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
            <div>• Ε ＋ Ξ ＝ 520</div>
            <div>• Ε － Ξ ＝ 220</div>
          </div>
          <p>Προσθέτουμε τις δύο εξισώσεις κατά μέλη:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span className="whitespace-nowrap">2 · Ε ＝ 520 ＋ 220 ＝ 740</span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ➔ Ε ＝ <Frac num="740" den="2" /> ＝ <strong className="text-emerald-700 text-base">370</strong>
            </span>
          </div>
          <p className="pt-1">Άρα, τα ελληνόγλωσσα βιβλία είναι <strong>370</strong> (Επιλογή <strong>A</strong>).</p>
        </div>
      )
    },
    {
      id: 12,
      officialNumber: 37,
      group: groupB,
      promptText: isEn
        ? 'Maria raises rabbits, and every year their population increases by 50%. If she has 64 rabbits today, how many will she have in two years?'
        : 'Η Μαρία εκτρέφει κουνέλια και κάθε χρόνο ο πληθυσμός τους αυξάνεται κατά 50%. Αν σήμερα έχει 64 κουνέλια, πόσα θα έχει σε δυο χρόνια;',
      options: [
        { key: 'A', label: '128', raw: '128' },
        { key: 'B', label: '144', raw: '144' },
        { key: isEn ? 'C' : 'Γ', label: '164', raw: '164' },
        { key: isEn ? 'D' : 'Δ', label: '256', raw: '256' }
      ],
      correctRaw: '144',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Each year, the population increases by 50% (that is, by half of its current count):</p>
          <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>• Year 1: 64 ＋ 32 ＝ <strong>96 rabbits</strong></div>
            <div>• Year 2: 96 ＋ 48 ＝ <strong className="text-emerald-700 text-base">144 rabbits</strong></div>
          </div>
          <p className="pt-1">Therefore, in two years she will have <strong>144</strong> (Choice <strong>B</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Κάθε έτος ο πληθυσμός αυξάνεται κατά 50% (δηλαδή κατά το μισό του):</p>
          <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>• 1ο έτος: 64 ＋ 32 ＝ <strong>96 κουνέλια</strong></div>
            <div>• 2ο έτος: 96 ＋ 48 ＝ <strong className="text-emerald-700 text-base">144 κουνέλια</strong></div>
          </div>
          <p className="pt-1">Επομένως, σε δύο χρόνια θα έχει <strong>144</strong> (Επιλογή <strong>B</strong>).</p>
        </div>
      )
    },
    {
      id: 13,
      officialNumber: 38,
      group: groupB,
      promptText: isEn ? (
        <span>
          Tasos and Nikos bought a bottle of juice. Tasos drank <Frac num="2" den="8" /> of the juice, and Nikos drank <Frac num="1" den="4" /> of the juice more than Tasos. What fraction of the juice remained in the bottle?
        </span>
      ) : (
        <span>
          Ο Τάσος και ο Νίκος αγόρασαν ένα μπουκάλι χυμό. Ο Τάσος ήπιε <Frac num="2" den="8" /> του χυμού και ο Νίκος ήπιε <Frac num="1" den="4" /> του χυμού περισσότερο από τον Τάσο. Ποιο μέρος του χυμού έμεινε στο μπουκάλι;
        </span>
      ),
      options: [
        { key: 'A', label: <Frac num="2" den="8" />, raw: '2/8' },
        { key: 'B', label: <Frac num="3" den="8" />, raw: '3/8' },
        { key: isEn ? 'C' : 'Γ', label: <Frac num="5" den="8" />, raw: '5/8' },
        { key: isEn ? 'D' : 'Δ', label: <Frac num="6" den="8" />, raw: '6/8' }
      ],
      correctRaw: '2/8',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Amount Tasos drank: <strong><Frac num="2" den="8" /></strong> of the juice.</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span>2. Nikos drank:</span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <Frac num="2" den="8" /> ＋ <Frac num="1" den="4" />
            </span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ＝ <Frac num="2" den="8" /> ＋ <Frac num="2" den="8" /> ＝ <Frac num="4" den="8" />
            </span>
          </div>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span>3. Together they drank:</span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <Frac num="2" den="8" /> ＋ <Frac num="4" den="8" /> ＝ <Frac num="6" den="8" />
            </span>
          </div>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span>4. Remained in the bottle:</span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              1 － <Frac num="6" den="8" /> ＝ <strong className="text-emerald-700 text-base"><Frac num="2" den="8" /></strong>
            </span>
          </div>
          <p className="pt-1">
            Thus, <strong><Frac num="2" den="8" /></strong> remained (Choice <strong>A</strong>).
          </p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Ποσότητα που ήπιε ο Τάσος: <strong><Frac num="2" den="8" /></strong> του χυμού.</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span>2. Ο Νίκος ήπιε:</span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <Frac num="2" den="8" /> ＋ <Frac num="1" den="4" />
            </span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ＝ <Frac num="2" den="8" /> ＋ <Frac num="2" den="8" /> ＝ <Frac num="4" den="8" />
            </span>
          </div>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span>3. Ήπιαν συνολικά:</span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <Frac num="2" den="8" /> ＋ <Frac num="4" den="8" /> ＝ <Frac num="6" den="8" />
            </span>
          </div>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span>4. Έμεινε στο μπουκάλι:</span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              1 － <Frac num="6" den="8" /> ＝ <strong className="text-emerald-700 text-base"><Frac num="2" den="8" /></strong>
            </span>
          </div>
          <p className="pt-1">
            Άρα, έμειναν τα <strong><Frac num="2" den="8" /></strong> (Επιλογή <strong>A</strong>).
          </p>
        </div>
      )
    },
    {
      id: 14,
      officialNumber: 39,
      group: groupB,
      promptText: isEn
        ? 'How many four-digit integers between 2,500 and 3,500 can be formed using exclusively the digits 2, 3, 4, 5 once each?'
        : 'Πόσους τετραψήφιους ακέραιους αριθμούς μεταξύ του 2.500 και του 3.500 μπορώ να φτιάξω, χρησιμοποιώντας αποκλειστικά τα ψηφία 2, 3, 4, 5 από μία φορά το καθένα;',
      options: isEn
        ? [
            { key: 'A', label: 'Fewer than 4', raw: 'Fewer than 4' },
            { key: 'B', label: '4', raw: '4' },
            { key: 'C', label: '6', raw: '6' },
            { key: 'D', label: 'More than 6', raw: 'More than 6' }
          ]
        : [
            { key: 'A', label: 'Λιγότερους από 4', raw: 'Λιγότερους από 4' },
            { key: 'B', label: '4', raw: '4' },
            { key: 'Γ', label: '6', raw: '6' },
            { key: 'Δ', label: 'Περισσότερους από 6', raw: 'Περισσότερους από 6' }
          ],
      correctRaw: '6',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Examine the possible numbers based on the first digit (thousands):</p>
          <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>
              <strong>1. Starting with 2:</strong><br />
              To be &gt; 2,500, the hundreds digit must be 5 (2,5..).<br />
              The remaining digits &#123;3, 4&#125; give: <strong>2,534</strong> and <strong>2,543</strong> (2 numbers).
            </div>
            <div>
              <strong>2. Starting with 3:</strong><br />
              To be &lt; 3,500, the hundreds digit can be 2 or 4:<br />
              • With 3,2.. and remaining &#123;4, 5&#125;: <strong>3,245</strong> and <strong>3,254</strong>.<br />
              • With 3,4.. and remaining &#123;2, 5&#125;: <strong>3,425</strong> and <strong>3,452</strong>.<br />
              (Total starting with 3: 4 numbers).
            </div>
            <div className="pt-1 text-slate-800 font-bold">
              Total count ＝ 2 ＋ 4 ＝ 6 numbers.
            </div>
          </div>
          <p className="pt-1">Therefore, we can form <strong>6</strong> numbers (Choice <strong>C</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Εξετάζουμε τους δυνατούς αριθμούς με βάση το πρώτο ψηφίο (χιλιάδες):</p>
          <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>
              <strong>1. Με πρώτο ψηφίο το 2:</strong><br />
              Για να είναι &gt; 2.500, το ψηφίο των εκατοντάδων πρέπει να είναι το 5 (2.5..).<br />
              Τα επόμενα ψηφία &#123;3, 4&#125; δίνουν: <strong>2.534</strong> και <strong>2.543</strong> (2 αριθμοί).
            </div>
            <div>
              <strong>2. Με πρώτο ψηφίο το 3:</strong><br />
              Για να είναι &lt; 3.500, το ψηφίο των εκατοντάδων μπορεί να είναι μόνο το 2 ή το 4:<br />
              • Με 3.2.. και υπόλοιπα &#123;4, 5&#125;: <strong>3.245</strong> και <strong>3.254</strong>.<br />
              • Με 3.4.. και υπόλοιπα &#123;2, 5&#125;: <strong>3.425</strong> και <strong>3.452</strong>.<br />
              (Σύνολο με 3: 4 αριθμοί).
            </div>
            <div className="pt-1 text-slate-800 font-bold">
              Συνολικό πλήθος ＝ 2 ＋ 4 ＝ 6 αριθμοί.
            </div>
          </div>
          <p className="pt-1">Επομένως, μπορούμε να φτιάξουμε <strong>6</strong> αριθμούς (Επιλογή <strong>Γ</strong>).</p>
        </div>
      )
    },
    {
      id: 15,
      officialNumber: 40,
      group: groupB,
      promptText: isEn ? (
        <span>
          Vasiliki and 9 of her classmates chose German as their 2nd foreign language, while the remaining <Frac num="4" den="5" /> of the 5th-grade students chose French. How many students are in the 5th grade?
        </span>
      ) : (
        <span>
          Η Βασιλική και 9 συμμαθητές της επέλεξαν τα γερμανικά ως 2η ξένη γλώσσα, ενώ τα υπόλοιπα <Frac num="4" den="5" /> των μαθητών της Ε΄ τάξης διάλεξαν γαλλικά. Πόσους μαθητές έχει η Ε΄ τάξη;
        </span>
      ),
      options: [
        { key: 'A', label: '20', raw: '20' },
        { key: 'B', label: '50', raw: '50' },
        { key: isEn ? 'C' : 'Γ', label: '45', raw: '45' },
        { key: isEn ? 'D' : 'Δ', label: '36', raw: '36' }
      ],
      correctRaw: '50',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. The students who chose German are Vasiliki and 9 classmates:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            1 ＋ 9 ＝ <strong>10 students</strong>
          </div>
          <p>
            2. Since <Frac num="4" den="5" /> chose French, German corresponds to the remaining <Frac num="1" den="5" />:
          </p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            <Frac num="1" den="5" /> of the class ＝ 10 students ➔ Entire class ＝ 10 · 5 ＝ <strong className="text-emerald-700 text-base">50 students</strong>
          </div>
          <p className="pt-1">Thus, the class has <strong>50</strong> students (Choice <strong>B</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Τα παιδιά που διάλεξαν γερμανικά είναι η Βασιλική και 9 συμμαθητές της:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            1 ＋ 9 ＝ <strong>10 μαθητές</strong>
          </div>
          <p>
            2. Εφόσον τα <Frac num="4" den="5" /> επέλεξαν γαλλικά, τα γερμανικά αντιστοιχούν στο υπόλοιπο <Frac num="1" den="5" />:
          </p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            Το <Frac num="1" den="5" /> της τάξης ＝ 10 μαθητές ➔ Όλη η τάξη ＝ 10 · 5 ＝ <strong className="text-emerald-700 text-base">50 μαθητές</strong>
          </div>
          <p className="pt-1">Άρα, η τάξη έχει <strong>50</strong> μαθητές (Επιλογή <strong>B</strong>).</p>
        </div>
      )
    },
    {
      id: 16,
      officialNumber: 41,
      group: groupB,
      promptText: isEn
        ? '10 kg of granulated sugar costs 8 €. 4 kg of granulated sugar and 7 kg of powdered sugar cost 10.90 €. How much do 9 kg of granulated sugar and 9 kg of powdered sugar cost in total?'
        : 'Τα 10 κιλά ζάχαρη κοστίζουν 8 €. Τα 4 κιλά ζάχαρη και 7 κιλά άχνη κοστίζουν 10,90 €. Πόσο στοιχίζουν συνολικά 9 κιλά ζάχαρη και 9 κιλά άχνη;',
      options: isEn
        ? [
            { key: 'A', label: '7.20 €', raw: '7.20 €' },
            { key: 'B', label: '17.10 €', raw: '17.10 €' },
            { key: 'C', label: '18.90 €', raw: '18.90 €' },
            { key: 'D', label: '9.90 €', raw: '9.90 €' }
          ]
        : [
            { key: 'A', label: '7,20 €', raw: '7,20 €' },
            { key: 'B', label: '17,10 €', raw: '17,10 €' },
            { key: 'Γ', label: '18,90 €', raw: '18,90 €' },
            { key: 'Δ', label: '9,90 €', raw: '9,90 €' }
          ],
      correctRaw: isEn ? '17.10 €' : '17,10 €',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Price of 1 kg of granulated sugar:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 inline-flex items-center gap-1.5 whitespace-nowrap">
            <Frac num="8 €" den="10" />
            <span>＝ <strong>0.80 € / kg</strong></span>
          </div>
          <p>2. Find the price of powdered sugar:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>• 4 kg granulated sugar cost: 4 · 0.80 € ＝ 3.20 €</div>
            <div>• 7 kg powdered sugar cost: 10.90 € － 3.20 € ＝ 7.70 €</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• 1 kg powdered sugar costs:</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="7.70 €" den="7" /> ＝ <strong>1.10 € / kg</strong>
              </span>
            </div>
          </div>
          <p>3. Calculate for 9 kg granulated and 9 kg powdered sugar:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            9 · (0.80 € ＋ 1.10 €) ＝ 9 · 1.90 € ＝ <strong className="text-emerald-700 text-base">17.10 €</strong>
          </div>
          <p className="pt-1">Therefore, they cost <strong>17.10 €</strong> (Choice <strong>B</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Τιμή 1 κιλού ζάχαρης:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 inline-flex items-center gap-1.5 whitespace-nowrap">
            <Frac num="8 €" den="10" />
            <span>＝ <strong>0,80 € / κιλό</strong></span>
          </div>
          <p>2. Βρίσκουμε την τιμή της άχνης:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>• 4 κιλά ζάχαρη κοστίζουν: 4 · 0,80 € ＝ 3,20 €</div>
            <div>• 7 κιλά άχνη κοστίζουν: 10,90 € － 3,20 € ＝ 7,70 €</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• 1 κιλό άχνη κοστίζει:</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="7,70 €" den="7" /> ＝ <strong>1,10 € / κιλό</strong>
              </span>
            </div>
          </div>
          <p>3. Υπολογίζουμε για 9 κιλά ζάχαρη και 9 κιλά άχνη (9 κιλά από το καθένα):</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            9 · (0,80 € ＋ 1,10 €) ＝ 9 · 1,90 € ＝ <strong className="text-emerald-700 text-base">17,10 €</strong>
          </div>
          <p className="pt-1">Συνεπώς, στοιχίζουν <strong>17,10 €</strong> (Επιλογή <strong>B</strong>).</p>
        </div>
      )
    },
    {
      id: 17,
      officialNumber: 42,
      group: groupB,
      promptText: isEn ? (
        <span>
          A cake recipe uses <Frac num="3" den="4" /> of a kilogram of all-purpose flour and <Frac num="1" den="4" /> of a kilogram of bread flour. To these we add 100 grams of sugar and 100 grams of orange juice. The remaining ingredients weigh 300 g. How much sugar should we put in a cake whose ingredients weigh 2,400 g?
        </span>
      ) : (
        <span>
          Σε μια συνταγή για κέικ χρησιμοποιούμε <Frac num="3" den="4" /> του κιλού μαλακό αλεύρι και <Frac num="1" den="4" /> του κιλού σκληρό αλεύρι. Σε αυτά προσθέτουμε 100 γραμμάρια ζάχαρη και 100 γραμμάρια χυμό πορτοκάλι. Τα υπόλοιπα υλικά της συνταγής ζυγίζουν 300 γρ. Πόση ζάχαρη πρέπει να βάλουμε σε ένα κέικ που τα υλικά ζυγίζουν 2.400 γρ;
        </span>
      ),
      options: isEn
        ? [
            { key: 'A', label: '160 g', raw: '160 g' },
            { key: 'B', label: '125 g', raw: '125 g' },
            { key: 'C', label: '145 g', raw: '145 g' },
            { key: 'D', label: '180 g', raw: '180 g' }
          ]
        : [
            { key: 'A', label: '160 γρ', raw: '160 γρ' },
            { key: 'B', label: '125 γρ', raw: '125 γρ' },
            { key: 'Γ', label: '145 γρ', raw: '145 γρ' },
            { key: 'Δ', label: '180 γρ', raw: '180 γρ' }
          ],
      correctRaw: isEn ? '160 g' : '160 γρ',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Calculate the total weight of the ingredients in the original recipe:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Flour (<Frac num="3" den="4" /> kg ＋ <Frac num="1" den="4" /> kg ＝ 1 kg): <strong>1,000 g</strong></div>
            <div>• Sugar: <strong>100 g</strong></div>
            <div>• Orange juice: <strong>100 g</strong></div>
            <div>• Remaining ingredients: <strong>300 g</strong></div>
            <div className="pt-1 font-bold">Total weight ＝ 1,000 ＋ 100 ＋ 100 ＋ 300 ＝ 1,500 g</div>
          </div>
          <p>2. In 1,500 g of ingredients there are 100 g of sugar. In 2,400 g of ingredients:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span>Sugar ＝</span>
            <Frac num="2,400 · 100" den="1,500" />
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＝ <Frac num="240" den="1.5" /></span>
            <span className="whitespace-nowrap">＝ <strong className="text-emerald-700 text-base">160 g</strong></span>
          </div>
          <p className="pt-1">Therefore, we should put <strong>160 g</strong> of sugar (Choice <strong>A</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Υπολογίζουμε το συνολικό βάρος των υλικών της αρχικής συνταγής:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Αλεύρι (<Frac num="3" den="4" /> κιλού ＋ <Frac num="1" den="4" /> κιλού ＝ 1 κιλό): <strong>1.000 γρ.</strong></div>
            <div>• Ζάχαρη: <strong>100 γρ.</strong></div>
            <div>• Χυμός πορτοκάλι: <strong>100 γρ.</strong></div>
            <div>• Υπόλοιπα υλικά: <strong>300 γρ.</strong></div>
            <div className="pt-1 font-bold">Σύνολο υλικών ＝ 1.000 ＋ 100 ＋ 100 ＋ 300 ＝ 1.500 γρ.</div>
          </div>
          <p>2. Στα 1.500 γρ. υλικών αντιστοιχούν 100 γρ. ζάχαρη. Στα 2.400 γρ. υλικών αντιστοιχούν:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span>Ζάχαρη ＝</span>
            <Frac num="2.400 · 100" den="1.500" />
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＝ <Frac num="240" den="1,5" /></span>
            <span className="whitespace-nowrap">＝ <strong className="text-emerald-700 text-base">160 γρ.</strong></span>
          </div>
          <p className="pt-1">Επομένως, πρέπει να βάλουμε <strong>160 γρ</strong> ζάχαρη (Επιλογή <strong>A</strong>).</p>
        </div>
      )
    },
    {
      id: 18,
      officialNumber: 43,
      group: groupB,
      promptText: isEn
        ? 'A rectangle has a perimeter of 26 cm, and one of its sides has a length of 4 cm. What is the perimeter of a square that has the same area as the rectangle?'
        : 'Ένα ορθογώνιο παραλληλόγραμμο έχει περίμετρο 26 εκ. και η μια από τις πλευρές του έχει μήκος 4 εκ. Ποια είναι η περίμετρος ενός τετραγώνου που έχει το ίδιο εμβαδόν με το ορθογώνιο παραλληλόγραμμο;',
      options: isEn
        ? [
            { key: 'A', label: '24 cm', raw: '24 cm' },
            { key: 'B', label: '36 cm', raw: '36 cm' },
            { key: 'C', label: '18 cm', raw: '18 cm' },
            { key: 'D', label: '16 cm', raw: '16 cm' }
          ]
        : [
            { key: 'A', label: '24 εκ.', raw: '24 εκ.' },
            { key: 'B', label: '36 εκ.', raw: '36 εκ.' },
            { key: 'Γ', label: '18 εκ.', raw: '18 εκ.' },
            { key: 'Δ', label: '16 εκ.', raw: '16 εκ.' }
          ],
      correctRaw: isEn ? '24 cm' : '24 εκ.',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            1. Semi-perimeter of rectangle: <Frac num="26" den="2" /> ＝ 13 cm. Since one side is 4 cm, the other side is: 13 － 4 ＝ <strong>9 cm</strong>.
          </p>
          <p>2. Area of rectangle:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            A ＝ 4 · 9 ＝ <strong>36 sq. cm.</strong>
          </div>
          <p>3. The equivalent square has an area of 36 sq. cm., so its side is:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 inline-flex items-center gap-1.5 whitespace-nowrap">
            <span>s ＝ <Radical>36</Radical> ＝ <strong>6 cm</strong></span>
          </div>
          <p>4. Perimeter of square:</p>
          <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            P ＝ 4 · 6 ＝ <strong className="text-emerald-700 text-base">24 cm</strong>
          </div>
          <p className="pt-1">Thus, the perimeter is <strong>24 cm</strong> (Choice <strong>A</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            1. Ημιπερίμετρος ορθογωνίου: <Frac num="26" den="2" /> ＝ 13 εκ. Αν η μία πλευρά είναι 4 εκ., η άλλη πλευρά είναι: 13 － 4 ＝ <strong>9 εκ.</strong>
          </p>
          <p>2. Εμβαδόν ορθογωνίου:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            Ε ＝ 4 · 9 ＝ <strong>36 τ. εκ.</strong>
          </div>
          <p>3. Το ισοδύναμο τετράγωνο έχει εμβαδόν 36 τ. εκ., άρα πλευρά:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 inline-flex items-center gap-1.5 whitespace-nowrap">
            <span>α ＝ <Radical>36</Radical> ＝ <strong>6 εκ.</strong></span>
          </div>
          <p>4. Περίμετρος τετραγώνου:</p>
          <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            Π ＝ 4 · 6 ＝ <strong className="text-emerald-700 text-base">24 εκ.</strong>
          </div>
          <p className="pt-1">Άρα, η περίμετρος είναι <strong>24 εκ.</strong> (Επιλογή <strong>A</strong>).</p>
        </div>
      )
    },
    {
      id: 19,
      officialNumber: 44,
      group: groupB,
      promptText: isEn
        ? 'The cross-shaped figure below consists of two squares and three rectangles. The diagonally shaded parts are two squares with areas of 1 sq. cm. and 4 sq. cm., and two rectangles with areas of 2 sq. cm. and 8 sq. cm. What is the perimeter of the figure?'
        : 'Το διπλανό σχήμα που μοιάζει με σταυρό αποτελείται από δύο τετράγωνα και τρία ορθογώνια. Τα σκιασμένα με διαγώνιες γραμμές μέρη του σχήματος είναι δύο τετράγωνα με εμβαδά 1 τ. εκ. και 4 τ. εκ. και 2 ορθογώνια με εμβαδά 2 τ. εκ. και 8 τ. εκ. Η περίμετρος του σχήματος είναι:',
      hasSvg: 'cross44',
      options: isEn
        ? [
            { key: 'A', label: '24 cm', raw: '24 cm' },
            { key: 'B', label: '15 cm', raw: '15 cm' },
            { key: 'C', label: '19 cm', raw: '19 cm' },
            { key: 'D', label: '28 cm', raw: '28 cm' }
          ]
        : [
            { key: 'A', label: '24 εκ.', raw: '24 εκ.' },
            { key: 'B', label: '15 εκ.', raw: '15 εκ.' },
            { key: 'Γ', label: '19 εκ.', raw: '19 εκ.' },
            { key: 'Δ', label: '28 εκ.', raw: '28 εκ.' }
          ],
      correctRaw: isEn ? '24 cm' : '24 εκ.',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>From the areas of the squares and rectangles, we determine the side lengths of the parts:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Small square: side <Radical>1</Radical> ＝ 1 cm</div>
            <div>• Medium square: side <Radical>4</Radical> ＝ 2 cm</div>
            <div>• Outer rectangles: lengths <Frac num="2" den="1" /> ＝ 2 cm and <Frac num="8" den="2" /> ＝ 4 cm</div>
            <div className="font-bold text-emerald-800 pt-1">Perimeter P ＝ 24 cm</div>
          </div>
          <p className="pt-1">Therefore, the perimeter is <strong>24 cm</strong> (Choice <strong>A</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Από τα εμβαδά των τετραγώνων και ορθογωνίων προσδιορίζουμε τις διαστάσεις των τμημάτων:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Μικρό τετράγωνο: πλευρά <Radical>1</Radical> ＝ 1 εκ.</div>
            <div>• Μεσαίο τετράγωνο: πλευρά <Radical>4</Radical> ＝ 2 εκ.</div>
            <div>• Εξωτερικά ορθογώνια: μήκη <Frac num="2" den="1" /> ＝ 2 εκ. και <Frac num="8" den="2" /> ＝ 4 εκ.</div>
            <div className="font-bold text-emerald-800 pt-1">Π ＝ 24 εκ.</div>
          </div>
          <p className="pt-1">Επομένως, η περίμετρος είναι <strong>24 εκ.</strong> (Επιλογή <strong>A</strong>).</p>
        </div>
      )
    },
    {
      id: 20,
      officialNumber: 45,
      group: groupB,
      promptText: isEn ? (
        <span>
          Two rabbits entered the same burrow from points A and B respectively and move in opposite directions. The first rabbit traveled <Frac num="5" den="8" /> of the burrow and the second traveled <Frac num="3" den="4" /> of the burrow. Which fraction shows the distance separating the two rabbits?
        </span>
      ) : (
        <span>
          Δύο λαγοί μπήκαν στο ίδιο λαγούμι από τα σημεία Α και Β αντίστοιχα και κινούνται με αντίθετη κατεύθυνση. Ο πρώτος λαγός διένυσε τα <Frac num="5" den="8" /> του λαγουμιού και ο δεύτερος τα <Frac num="3" den="4" /> του λαγουμιού. Ποιο κλάσμα δείχνει την απόσταση που χωρίζει τους δύο λαγούς;
        </span>
      ),
      hasSvg: 'burrow45',
      options: [
        { key: 'A', label: <Frac num="1" den="8" />, raw: '1/8' },
        { key: 'B', label: <Frac num="3" den="8" />, raw: '3/8' },
        { key: isEn ? 'C' : 'Γ', label: <Frac num="4" den="8" />, raw: '4/8' },
        { key: isEn ? 'D' : 'Δ', label: <Frac num="11" den="8" />, raw: '11/8' }
      ],
      correctRaw: '3/8',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. The total length of the burrow is 1 (or <Frac num="8" den="8" />).</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>• The first rabbit traveled <Frac num="5" den="8" />.</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• The second rabbit traveled:</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="3" den="4" /> ＝ <Frac num="6" den="8" />
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Sum of distances:</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="5" den="8" /> ＋ <Frac num="6" den="8" /> ＝ <Frac num="11" den="8" /> &gt; 1
              </span>
            </div>
          </div>
          <p>
            2. Because the sum exceeds 1, the two rabbits have already <strong>crossed paths</strong>, and the distance separating them is:
          </p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <Frac num="11" den="8" /> － 1 ＝ <Frac num="11" den="8" /> － <Frac num="8" den="8" />
            </span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ＝ <strong className="text-emerald-700 text-base"><Frac num="3" den="8" /></strong>
            </span>
          </div>
          <p className="pt-1">
            Thus, the distance between them is <strong><Frac num="3" den="8" /></strong> (Choice <strong>B</strong>).
          </p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Το συνολικό μήκος του λαγουμιού είναι 1 (ή <Frac num="8" den="8" />).</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>• Ο πρώτος λαγός διένυσε <Frac num="5" den="8" />.</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Ο δεύτερος λαγός διένυσε:</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="3" den="4" /> ＝ <Frac num="6" den="8" />
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Άθροισμα αποστάσεων:</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="5" den="8" /> ＋ <Frac num="6" den="8" /> ＝ <Frac num="11" den="8" /> &gt; 1
              </span>
            </div>
          </div>
          <p>
            2. Επειδή το άθροισμα υπερβαίνει τη μονάδα, οι δύο λαγοί έχουν ήδη <strong>διασταυρωθεί</strong> και η απόσταση επικάλυψής τους είναι:
          </p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <Frac num="11" den="8" /> － 1 ＝ <Frac num="11" den="8" /> － <Frac num="8" den="8" />
            </span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ＝ <strong className="text-emerald-700 text-base"><Frac num="3" den="8" /></strong>
            </span>
          </div>
          <p className="pt-1">
            Άρα, η απόσταση που τους χωρίζει είναι <strong><Frac num="3" den="8" /></strong> (Επιλογή <strong>B</strong>).
          </p>
        </div>
      )
    },
    {
      id: 21,
      officialNumber: 46,
      group: groupB,
      promptText: isEn
        ? 'A travel agency has 12-seat minibuses and 48-seat coaches. Each trip with a minibus costs 100 €, while with a coach it costs 350 €, regardless of the number of passengers. What is the lowest possible cost to transport 200 students?'
        : 'Ένα τουριστικό γραφείο διαθέτει μικρά πούλμαν 12 θέσεων και μεγάλα πούλμαν 48 θέσεων. Κάθε δρομολόγιο με μικρό πούλμαν κοστίζει 100€, ενώ με μεγάλο πούλμαν κοστίζει 350€, ανεξαρτήτως του πλήθους των επιβατών. Ποιο είναι το μικρότερο δυνατό κόστος για να μεταφέρουμε 200 μαθητές;',
      options: isEn
        ? [
            { key: 'A', label: '1,400 €', raw: '1,400 €' },
            { key: 'B', label: '1,500 €', raw: '1,500 €' },
            { key: 'C', label: '1,750 €', raw: '1,750 €' },
            { key: 'D', label: '1,800 €', raw: '1,800 €' }
          ]
        : [
            { key: 'A', label: '1.400 €', raw: '1.400 €' },
            { key: 'B', label: '1.500 €', raw: '1.500 €' },
            { key: 'Γ', label: '1.750 €', raw: '1.750 €' },
            { key: 'Δ', label: '1.800 €', raw: '1.800 €' }
          ],
      correctRaw: isEn ? '1,500 €' : '1.500 €',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Compare the cost per passenger seat:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Coach:</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="350 €" den="48" /> ≈ <strong>7.29 €/seat</strong> (cheaper)
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Minibus:</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="100 €" den="12" /> ≈ <strong>8.33 €/seat</strong>
              </span>
            </div>
          </div>
          <p>Examine combinations for at least 200 students:</p>
          <div className="space-y-1.5 bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            <div>• 5 coaches: 5 · 48 ＝ 240 seats ➔ Cost: 5 · 350 € ＝ <strong>1,750 €</strong></div>
            <div>
              • 4 coaches (192 seats) ＋ 1 minibus (12 seats) ＝ 204 seats:<br />
              ➔ Cost: 4 · 350 € ＋ 1 · 100 € ＝ 1,400 € ＋ 100 € ＝ <strong className="text-emerald-700 text-base">1,500 €</strong>
            </div>
            <div>
              • 3 coaches (144 seats) ＋ 5 minibuses (60 seats) ＝ 204 seats:<br />
              ➔ Cost: 3 · 350 € ＋ 5 · 100 € ＝ 1,050 € ＋ 500 € ＝ <strong>1,550 €</strong>
            </div>
          </div>
          <p className="pt-1">The lowest possible cost is <strong>1,500 €</strong> (Choice <strong>B</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Συγκρίνουμε το κόστος ανά επιβάτη:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Μεγάλο πούλμαν:</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="350 €" den="48" /> ≈ <strong>7,29 €/θέση</strong> (οικονομικότερο)
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Μικρό πούλμαν:</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="100 €" den="12" /> ≈ <strong>8,33 €/θέση</strong>
              </span>
            </div>
          </div>
          <p>Εξετάζουμε συνδυασμούς για τουλάχιστον 200 μαθητές:</p>
          <div className="space-y-1.5 bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            <div>• 5 μεγάλα: 5 · 48 ＝ 240 θέσεις ➔ Κόστος: 5 · 350 € ＝ <strong>1.750 €</strong></div>
            <div>
              • 4 μεγάλα (192 θέσεις) ＋ 1 μικρό (12 θέσεις) ＝ 204 θέσεις:<br />
              ➔ Κόστος: 4 · 350 € ＋ 1 · 100 € ＝ 1.400 € ＋ 100 € ＝ <strong className="text-emerald-700 text-base">1.500 €</strong>
            </div>
            <div>
              • 3 μεγάλα (144 θέσεις) ＋ 5 μικρά (60 θέσεις) ＝ 204 θέσεις:<br />
              ➔ Κόστος: 3 · 350 € ＋ 5 · 100 € ＝ 1.050 € ＋ 500 € ＝ <strong>1.550 €</strong>
            </div>
          </div>
          <p className="pt-1">Το μικρότερο δυνατό κόστος είναι <strong>1.500 €</strong> (Επιλογή <strong>B</strong>).</p>
        </div>
      )
    },
    {
      id: 22,
      officialNumber: 47,
      group: groupB,
      promptText: isEn
        ? 'Giorgos and Nikos are waiting in line for tickets. Nikos is ahead of Giorgos. The number of people waiting in front of Nikos is equal to the number of people waiting behind Giorgos, and also equal to the number of people waiting between them. Which of the following CANNOT be the total number of people waiting in line?'
        : 'Ο Γιώργος και ο Νίκος περιμένουν στην ουρά για εισιτήριο. Ο Νίκος είναι πιο μπροστά από τον Γιώργο. Τα άτομα που περιμένουν μπροστά από τον Νίκο, είναι όσα περιμένουν πίσω από τον Γιώργο αλλά και όσα περιμένουν ανάμεσά τους. Ποιος δεν μπορεί να είναι ο συνολικός αριθμός των ατόμων που περιμένουν στην ουρά;',
      options: [
        { key: 'A', label: '50', raw: '50' },
        { key: 'B', label: '80', raw: '80' },
        { key: isEn ? 'C' : 'Γ', label: '100', raw: '100' },
        { key: isEn ? 'D' : 'Δ', label: '110', raw: '110' }
      ],
      correctRaw: '100',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Let <strong>x</strong> be the number of people in front of Nikos.</p>
          <p>According to the problem, there are also <strong>x</strong> people behind Giorgos and <strong>x</strong> people between them:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
            <div>• People in front: x</div>
            <div>• Nikos: 1</div>
            <div>• People between them: x</div>
            <div>• Giorgos: 1</div>
            <div>• People behind: x</div>
            <div className="pt-1 font-bold text-slate-950">
              Total in line ＝ x ＋ 1 ＋ x ＋ 1 ＋ x ＝ <strong>3x ＋ 2</strong>
            </div>
          </div>
          <p>The total must leave a <strong>remainder of 2 when divided by 3</strong> (meaning Total － 2 must be divisible by 3):</p>
          <div className="space-y-1 bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            <div>• 50: 50 － 2 ＝ 48 (divisible by 3 ✅)</div>
            <div>• 80: 80 － 2 ＝ 78 (divisible by 3 ✅)</div>
            <div>• 100: 100 － 2 ＝ 98 (<strong className="text-emerald-700">not a multiple of 3 ❌</strong>)</div>
            <div>• 110: 110 － 2 ＝ 108 (divisible by 3 ✅)</div>
          </div>
          <p className="pt-1">Therefore, the total number of people CANNOT be <strong>100</strong> (Choice <strong>C</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Έστω <strong>x</strong> τα άτομα μπροστά από τον Νίκο.</p>
          <p>Σύμφωνα με την εκφώνηση, <strong>x</strong> άτομα είναι επίσης πίσω από τον Γιώργο και <strong>x</strong> άτομα ανάμεσά τους:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
            <div>• Άτομα μπροστά: x</div>
            <div>• Νίκος: 1</div>
            <div>• Ανάμεσά τους: x</div>
            <div>• Γιώργος: 1</div>
            <div>• Άτομα πίσω: x</div>
            <div className="pt-1 font-bold text-slate-950">
              Σύνολο ουράς ＝ x ＋ 1 ＋ x ＋ 1 ＋ x ＝ <strong>3x ＋ 2</strong>
            </div>
          </div>
          <p>Το σύνολο πρέπει να αφήνει <strong>υπόλοιπο 2 όταν διαιρείται με το 3</strong> (δηλαδή Σύνολο － 2 να διαιρείται με το 3):</p>
          <div className="space-y-1 bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            <div>• 50: 50 － 2 ＝ 48 (διαιρείται με το 3 ✅)</div>
            <div>• 80: 80 － 2 ＝ 78 (διαιρείται με το 3 ✅)</div>
            <div>• 100: 100 － 2 ＝ 98 (<strong className="text-emerald-700">όχι πολλαπλάσιο του 3 ❌</strong>)</div>
            <div>• 110: 110 － 2 ＝ 108 (διαιρείται με το 3 ✅)</div>
          </div>
          <p className="pt-1">Συνεπώς, ο αριθμός <strong>100</strong> δεν μπορεί να είναι το πλήθος της ουράς (Επιλογή <strong>Γ</strong>).</p>
        </div>
      )
    },
    {
      id: 23,
      officialNumber: 48,
      group: groupB,
      promptText: isEn
        ? 'The diagram below, showing a plaza and a garden, was drawn at a scale of 1:1,000. The perimeter of the garden on the diagram is 8 centimeters. What is the actual perimeter of the plaza?'
        : 'Το διπλανό σχεδιάγραμμα, που απεικονίζει μια πλατεία κι έναν κήπο, σχεδιάστηκε με κλίμακα 1:1.000. Η περίμετρος του κήπου στο σχεδιάγραμμα είναι 8 εκατοστά. Ποια είναι η πραγματική περίμετρος της πλατείας;',
      hasSvg: 'squareGarden48',
      options: isEn
        ? [
            { key: 'A', label: '140 meters', raw: '140 meters' },
            { key: 'B', label: '280 meters', raw: '280 meters' },
            { key: 'C', label: '14,000 meters', raw: '14,000 meters' },
            { key: 'D', label: '28,000 meters', raw: '28,000 meters' }
          ]
        : [
            { key: 'A', label: '140 μέτρα', raw: '140 μέτρα' },
            { key: 'B', label: '280 μέτρα', raw: '280 μέτρα' },
            { key: 'Γ', label: '14.000 μέτρα', raw: '14.000 μέτρα' },
            { key: 'Δ', label: '28.000 μέτρα', raw: '28.000 μέτρα' }
          ],
      correctRaw: isEn ? '280 meters' : '280 μέτρα',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            1. <strong>Garden size:</strong> The garden is a square with a perimeter of 8 cm on paper. Thus, each grid square side has a length of:
          </p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 inline-flex items-center gap-1.5 whitespace-nowrap">
            <Frac num="8 cm" den="4" />
            <span>＝ <strong>2 cm per grid side</strong></span>
          </div>
          <p>
            2. <strong>Plaza perimeter on the diagram:</strong><br />
            Counting the outer boundary segments of the L-shaped plaza, we find it consists of 14 segments:
          </p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            Perimeter on paper ＝ 14 · 2 cm ＝ <strong>28 cm</strong>
          </div>
          <p>3. <strong>Actual perimeter at scale 1:1,000:</strong></p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            28 cm · 1,000 ＝ 28,000 cm ＝ <strong className="text-emerald-700 text-base">280 meters</strong>
          </div>
          <p className="pt-1">Therefore, the actual perimeter is <strong>280 meters</strong> (Choice <strong>B</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            1. <strong>Μέγεθος κήπου:</strong> Ο κήπος είναι ένα τετράγωνο με περίμετρο 8 εκ. στο χαρτί. Άρα κάθε πλευρά τετραγώνου του καννάβου έχει μήκος:
          </p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 inline-flex items-center gap-1.5 whitespace-nowrap">
            <Frac num="8 εκ." den="4" />
            <span>＝ <strong>2 εκ. ανά πλευρά τετραγώνου</strong></span>
          </div>
          <p>
            2. <strong>Περίμετρος πλατείας στο σχεδιάγραμμα:</strong><br />
            Μετρώντας το εξωτερικό περίγραμμα του σχήματος L της πλατείας, βρίσκουμε ότι αποτελείται από 14 τμήματα:
          </p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            Περίμετρος στο χαρτί ＝ 14 · 2 εκ. ＝ <strong>28 εκ.</strong>
          </div>
          <p>3. <strong>Πραγματική περίμετρος με κλίμακα 1:1.000:</strong></p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            28 εκ. · 1.000 ＝ 28.000 εκ. ＝ <strong className="text-emerald-700 text-base">280 μέτρα</strong>
          </div>
          <p className="pt-1">Επομένως, η πραγματική περίμετρος είναι <strong>280 μέτρα</strong> (Επιλογή <strong>B</strong>).</p>
        </div>
      )
    },
    {
      id: 24,
      officialNumber: 49,
      group: groupB,
      promptText: isEn
        ? 'A container and the oil inside it weigh 4,500 g. 25% of the oil spilled out, and the weight of the container with the remaining oil was then 3,800 g. What is the weight of the empty container?'
        : 'Ένα δοχείο και το λάδι που περιέχει ζυγίζουν 4.500 γρ. Χύθηκε το 25% του λαδιού και το βάρος του δοχείου με το λάδι που έμεινε ήταν τότε 3.800 γρ. Ποιο είναι το βάρος του άδειου δοχείου;',
      options: isEn
        ? [
            { key: 'A', label: '1,125 g', raw: '1,125 g' },
            { key: 'B', label: '3,375 g', raw: '3,375 g' },
            { key: 'C', label: '1,700 g', raw: '1,700 g' },
            { key: 'D', label: '2,675 g', raw: '2,675 g' }
          ]
        : [
            { key: 'A', label: '1.125 γρ', raw: '1.125 γρ' },
            { key: 'B', label: '3.375 γρ', raw: '3.375 γρ' },
            { key: 'Γ', label: '1.700 γρ', raw: '1.700 γρ' },
            { key: 'Δ', label: '2.675 γρ.', raw: '2.675 γρ.' }
          ],
      correctRaw: isEn ? '1,700 g' : '1.700 γρ',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. The weight loss is due solely to the spilled oil (25% ＝ <Frac num="1" den="4" /> of the oil):</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            4,500 g － 3,800 g ＝ <strong>700 g</strong> (25% of the oil).
          </div>
          <p>2. Total weight of all the oil (100%):</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            700 g · 4 ＝ <strong>2,800 g of oil</strong>
          </div>
          <p>3. Weight of the empty container:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            4,500 g － 2,800 g ＝ <strong className="text-emerald-700 text-base">1,700 g</strong>
          </div>
          <p className="pt-1">Thus, the empty container weighs <strong>1,700 g</strong> (Choice <strong>C</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Η μείωση του βάρους οφείλεται αποκλειστικά στο λάδι που χύθηκε (25% ＝ <Frac num="1" den="4" /> του λαδιού):</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            4.500 γρ. － 3.800 γρ. ＝ <strong>700 γρ.</strong> (το 25% του λαδιού).
          </div>
          <p>2. Συνολικό βάρος όλου του λαδιού (100%):</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            700 γρ. · 4 ＝ <strong>2.800 γρ. λάδι</strong>
          </div>
          <p>3. Βάρος του άδειου δοχείου:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            4.500 γρ. － 2.800 γρ. ＝ <strong className="text-emerald-700 text-base">1.700 γρ.</strong>
          </div>
          <p className="pt-1">Άρα, το άδειο δοχείο ζυγίζει <strong>1.700 γρ</strong> (Επιλογή <strong>Γ</strong>).</p>
        </div>
      )
    },
    {
      id: 25,
      officialNumber: 50,
      group: groupB,
      promptText: isEn
        ? 'To go from A to C, we follow either Path 1: A D B Z C or Path 2: A D E Z C, where we know that path DE is parallel to BC and path EZ is parallel to AB. Then it is true that:'
        : 'Για να πάμε από το Α στο Γ ακολουθούμε είτε τη διαδρομή 1: Α Δ Β Ζ Γ είτε τη διαδρομή 2: Α Δ Ε Ζ Γ όπου γνωρίζουμε ότι το μονοπάτι ΔΕ είναι παράλληλο στο ΒΓ και το μονοπάτι ΕΖ είναι παράλληλο στο ΑΒ. Τότε είναι σωστό ότι:',
      hasSvg: 'paths50',
      options: isEn
        ? [
            { key: 'A', label: 'Path 1 is always shorter.', raw: 'Path 1 is always shorter.' },
            { key: 'B', label: 'Path 2 is always shorter.', raw: 'Path 2 is always shorter.' },
            { key: 'C', label: 'Paths 1 and 2 always have the same length.', raw: 'Paths 1 and 2 always have the same length.' },
            { key: 'D', label: 'The shorter path depends on angle B.', raw: 'The shorter path depends on angle B.' }
          ]
        : [
            { key: 'A', label: 'η διαδρομή 1 είναι πάντα η συντομότερη.', raw: 'η διαδρομή 1 είναι πάντα η συντομότερη.' },
            { key: 'B', label: 'η διαδρομή 2 είναι πάντα η συντομότερη.', raw: 'η διαδρομή 2 είναι πάντα η συντομότερη.' },
            { key: 'Γ', label: 'οι διαδρομές 1 και 2 έχουν πάντα το ίδιο μήκος.', raw: 'οι διαδρομές 1 και 2 έχουν πάντα το ίδιο μήκος.' },
            { key: 'Δ', label: 'η συντομότερη διαδρομή εξαρτάται από τη γωνία Β.', raw: 'η συντομότερη διαδρομή εξαρτάται από τη γωνία Β.' }
          ],
      correctRaw: isEn
        ? 'Paths 1 and 2 always have the same length.'
        : 'οι διαδρομές 1 και 2 έχουν πάντα το ίδιο μήκος.',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Segments AD and ZC are common to both paths.</p>
          <p>Since DE // BZ and EZ // DB, quadrilateral <strong>DBZE is a parallelogram</strong>:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
            <div>• DB ＝ EZ (opposite sides of a parallelogram)</div>
            <div>• BZ ＝ DE (opposite sides of a parallelogram)</div>
          </div>
          <p>Consequently:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            Length(DB ＋ BZ) ＝ Length(DE ＋ EZ)
          </div>
          <p className="pt-1">Therefore, <strong>Paths 1 and 2 always have the same length</strong> (Choice <strong>C</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Τα τμήματα ΑΔ και ΖΓ είναι κοινά και στις δύο διαδρομές.</p>
          <p>Επειδή ΔΕ // ΒΖ και ΕΖ // ΔΒ, το τετράπλευρο <strong>ΔΒΖΕ είναι παραλληλόγραμμο</strong>:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
            <div>• ΔΒ ＝ ΕΖ (απέναντι πλευρές παραλληλογράμμου)</div>
            <div>• ΒΖ ＝ ΔΕ (απέναντι πλευρές παραλληλογράμμου)</div>
          </div>
          <p>Συνεπώς:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            Μήκος(ΔΒ ＋ ΒΖ) ＝ Μήκος(ΔΕ ＋ ΕΖ)
          </div>
          <p className="pt-1">Επομένως, <strong>οι διαδρομές 1 και 2 έχουν πάντα το ίδιο μήκος</strong> (Επιλογή <strong>Γ</strong>).</p>
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

export default function Themata2022Page() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const isEn = locale === 'en';
  const t = I18N[locale];
  const questions = getQuestions2022(locale);

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

  const schema2022 = [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": t.schemaHome, "item": `${baseUrl}/` },
        { "@type": "ListItem", "position": 2, "name": t.schemaHub, "item": `${baseUrl}/protipa/protipa` },
        { "@type": "ListItem", "position": 3, "name": t.schemaCurrent, "item": `${baseUrl}/protipa/themata-2022` }
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
    if (q.hasSvg === 'transportChart28') {
      return (
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 my-3">
          <svg
            viewBox="0 0 320 180"
            className="w-full max-w-[320px] h-auto select-none font-sans mx-auto block"
            role="img"
            aria-label={t.transportAria}
          >
            <line x1="45" y1="20" x2="45" y2="135" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="45" y1="135" x2="300" y2="135" stroke="#94a3b8" strokeWidth="1.5" />

            {[0, 10, 20, 30].map((v) => {
              const y = 135 - (v / 30) * 110;
              return (
                <g key={v}>
                  <line x1="40" y1={y} x2="300" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                  <text x="35" y={y + 4} fontSize="9" fontWeight="bold" textAnchor="end" fill="#64748b">{v}</text>
                </g>
              );
            })}

            {t.transportCols.map((col, idx) => {
              const x = 65 + idx * 58;
              const h = (col.val / 30) * 110;
              const y = 135 - h;
              return (
                <g key={idx}>
                  <rect x={x} y={y} width="28" height={h} fill="#2563eb" rx="2" />
                  <text x={x + 14} y={y - 5} fontSize="10" fontWeight="bold" textAnchor="middle" fill="#0f172a">{col.val}</text>
                  <text x={x + 14} y="152" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#475569">{col.label}</text>
                </g>
              );
            })}
          </svg>
        </div>
      );
    }

    if (q.hasSvg === 'axis29') {
      return (
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 my-3">
          <svg
            viewBox="0 0 360 95"
            className="w-full max-w-[360px] h-auto select-none font-mono mx-auto block"
            role="img"
            aria-label={t.axis29Aria}
          >
            <line x1="20" y1="40" x2="330" y2="40" stroke="#334155" strokeWidth="2" />
            <polygon points="330,35 340,40 330,45" fill="#334155" />

            {/* 7/9 κάθετο κλάσμα */}
            <line x1="70" y1="32" x2="70" y2="48" stroke="#475569" strokeWidth="2" />
            <text x="70" y="63" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#1e293b">7</text>
            <line x1="62" y1="67" x2="78" y2="67" stroke="#1e293b" strokeWidth="1.5" />
            <text x="70" y="80" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#1e293b">9</text>

            {/* 10/9 κάθετο κλάσμα */}
            <line x1="170" y1="32" x2="170" y2="48" stroke="#475569" strokeWidth="2" />
            <text x="170" y="63" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#1e293b">10</text>
            <line x1="160" y1="67" x2="180" y2="67" stroke="#1e293b" strokeWidth="1.5" />
            <text x="170" y="80" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#1e293b">9</text>

            {/* α/β κάθετο κλάσμα */}
            <line x1="270" y1="32" x2="270" y2="48" stroke="#2563eb" strokeWidth="2" />
            <text x="270" y="63" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#2563eb">{t.axis29NumA}</text>
            <line x1="262" y1="67" x2="278" y2="67" stroke="#2563eb" strokeWidth="1.5" />
            <text x="270" y="80" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#2563eb">{t.axis29DenB}</text>
          </svg>
        </div>
      );
    }

    if (q.hasSvg === 'cross44') {
      return (
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 my-3">
          <svg
            viewBox="0 0 220 150"
            className="w-full max-w-[220px] h-auto select-none mx-auto block"
            role="img"
            aria-label={t.crossAria}
          >
            <rect x="20" y="45" width="180" height="50" fill="#cbd5e1" stroke="#0f172a" strokeWidth="2" />
            <rect x="120" y="15" width="30" height="115" fill="#cbd5e1" stroke="#0f172a" strokeWidth="2" />
            <rect x="120" y="45" width="30" height="50" fill="#64748b" stroke="#0f172a" strokeWidth="1.5" />
          </svg>
        </div>
      );
    }

    if (q.hasSvg === 'burrow45') {
      return (
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 my-3">
          <svg
            viewBox="0 0 260 160"
            className="w-full max-w-[260px] h-auto select-none font-sans mx-auto block"
            role="img"
            aria-label={t.burrowAria}
          >
            <path
              d="M 40,25 L 200,25 C 230,25 230,70 200,70 L 60,70 C 30,70 30,115 60,115 L 190,115 C 210,115 210,145 190,145"
              fill="none"
              stroke="#0f172a"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path
              d="M 40,25 L 200,25 C 230,25 230,70 200,70 L 60,70 C 30,70 30,115 60,115 L 190,115 C 210,115 210,145 190,145"
              fill="none"
              stroke="#ffffff"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <text x="18" y="29" fontSize="12" fontWeight="bold" fill="#0f172a">A ➔</text>
            <text x="208" y="150" fontSize="12" fontWeight="bold" fill="#0f172a">⬆ B</text>
          </svg>
        </div>
      );
    }

    if (q.hasSvg === 'squareGarden48') {
      return (
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 my-3">
          <svg
            viewBox="0 0 260 170"
            className="w-full max-w-[260px] h-auto select-none font-sans mx-auto block"
            role="img"
            aria-label={t.gardenAria}
          >
            {[0, 1, 2, 3, 4, 5, 6].map(i => (
              <line key={`v-${i}`} x1={20 + i * 35} y1="15" x2={20 + i * 35} y2="155" stroke="#e2e8f0" strokeWidth="1.2" />
            ))}
            {[0, 1, 2, 3, 4].map(i => (
              <line key={`h-${i}`} x1="20" y1={15 + i * 35} x2="230" y2={15 + i * 35} stroke="#e2e8f0" strokeWidth="1.2" />
            ))}
            <polygon
              points="55,50 125,50 125,120 195,120 195,155 55,155"
              fill="#cbd5e1"
              stroke="#0f172a"
              strokeWidth="2"
            />
            <text x="90" y="42" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0f172a">{t.plazaLabel}</text>

            <rect x="195" y="50" width="35" height="35" fill="#e2e8f0" stroke="#0f172a" strokeWidth="2" />
            <text x="212" y="42" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0f172a">{t.gardenLabel}</text>
          </svg>
        </div>
      );
    }

    if (q.hasSvg === 'paths50') {
      const [v0, v1, v2, v3, v4, v5] = t.pathVerts;
      return (
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 my-3">
          <svg
            viewBox="0 0 260 200"
            className="w-full max-w-[260px] h-auto select-none font-sans mx-auto block"
            role="img"
            aria-label={t.pathsAria}
          >
            <circle cx="105" cy="25" r="4" fill="#0f172a" />
            <text x="105" y="16" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0f172a">{v0}</text>

            <circle cx="65" cy="95" r="4" fill="#0f172a" />
            <text x="50" y="95" fontSize="11" fontWeight="bold" fill="#0f172a">{v1}</text>

            <circle cx="170" cy="95" r="4" fill="#0f172a" />
            <text x="178" y="95" fontSize="11" fontWeight="bold" fill="#0f172a">{v2}</text>

            <circle cx="130" cy="165" r="4" fill="#0f172a" />
            <text x="130" y="182" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0f172a">{v3}</text>

            <circle cx="30" cy="165" r="4" fill="#0f172a" />
            <text x="18" y="170" fontSize="11" fontWeight="bold" fill="#0f172a">{v4}</text>

            <circle cx="230" cy="165" r="4" fill="#0f172a" />
            <text x="240" y="170" fontSize="11" fontWeight="bold" fill="#0f172a">{v5}</text>

            <line x1="30" y1="165" x2="65" y2="95" stroke="#0f172a" strokeWidth="2" />
            <line x1="65" y1="95" x2="105" y2="25" stroke="#0f172a" strokeWidth="2" />
            <line x1="105" y1="25" x2="170" y2="95" stroke="#0f172a" strokeWidth="2" />
            <line x1="170" y1="95" x2="230" y2="165" stroke="#0f172a" strokeWidth="2" />

            <line x1="65" y1="95" x2="130" y2="165" stroke="#0f172a" strokeWidth="2" />
            <line x1="130" y1="165" x2="170" y2="95" stroke="#0f172a" strokeWidth="2" />
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
      schemaData={schema2022}
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