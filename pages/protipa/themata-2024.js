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
    metaTitle: 'Θέματα Προτύπων 2024 – Επίσημα Θέματα & Αναλυτικές Λύσεις | LearnMaths.gr',
    metaDesc: 'Λύσε online τα 25 επίσημα θέματα Μαθηματικών για τα Πρότυπα Γυμνάσια 2024 (026–050), με χρονόμετρο 60 λεπτών, αυτόματη βαθμολόγηση και αναλυτικές λύσεις.',
    backText: 'Θέματα Προτύπων',
    heroBadge: 'Επίσημα Θέματα 2024 • 25 Ερωτήσεις Μαθηματικών',
    heroTitle: 'Θέματα Προτύπων Γυμνασίων 2024 – Online Τεστ & Λύσεις',
    heroSubtitle: 'Εξασκήσου στα επίσημα θέματα Μαθηματικών των εξετάσεων εισαγωγής στα Πρότυπα Γυμνάσια 2024. Περιλαμβάνει και τις 25 ερωτήσεις (026–050) με αυτόματη βαθμολόγηση (2 μόρια ανά θέμα, Άριστα: 50), χρονόμετρο 60 λεπτών και αναλυτικές λύσεις.',
    answeredLabel: 'Απαντημένες:',
    of25: 'από 25',
    scoringLabel: 'Βαθμολογία:',
    scoringValue: '2 μόρια ανά θέμα (Άριστα: 50)',
    timerOn: '⏳ Χρονόμετρο: 60 λεπτά',
    timerOff: '⏳ Χρονόμετρο: Ανενεργό',
    resultTitle: 'Αποτέλεσμα Εξέτασης Προτύπων 2024',
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
    axis31Aria: 'Αριθμογραμμή με τα σημεία 0, α, 5 και χ',
    axis31Labels: ['0', 'α', '5', 'χ'],
    timetableAria: 'Εβδομαδιαίο πρόγραμμα ωρών Α΄ Γυμνασίου κάθε Πέμπτη',
    timetableHourHeader: 'Ώρα',
    timetableDurHeader: 'Διάρκεια',
    timetableRows: [
      { period: '1η', time: '08:15 - 09:00' },
      { period: '2η', time: '09:10 - 09:55' },
      { period: '3η', time: '10:10 - 10:55' },
      { period: '4η', time: '11:05 - 11:45' },
      { period: '5η', time: '11:50 - 12:30' },
      { period: '6η', time: '12:35 - 13:15' }
    ],
    semicirclesAria: 'Τετράγωνο πλευράς 20 εκ. με δύο λευκά ημικύκλια στο εσωτερικό του και μαύρο ενδιάμεσο χωρίο',
    juiceAria: 'Ραβδόγραμμα ποσοστών προτίμησης χυμών: 25%, 20%, 40%, 10%, 5%',
    islandsAria: 'Χάρτης αποστάσεων μεταξύ Καρπάθου, Νισύρου και Αστυπάλαιας',
    islandsLabels: {
      astypalaia: 'ΑΣΤΥΠΑΛΑΙΑ',
      kos: 'ΚΩΣ',
      nisyros: 'ΝΙΣΥΡΟΣ',
      tilos: 'ΤΗΛΟΣ',
      karpathos: 'ΚΑΡΠΑΘΟΣ'
    },
    schemaHome: 'Αρχική',
    schemaHub: 'Ενδεικτικά Θέματα Προτύπων 2026',
    schemaCurrent: 'Θέματα Προτύπων Γυμνασίων 2024',
    schemaQuizName: 'Επίσημα Θέματα Μαθηματικών Προτύπων Γυμνασίων 2024 (Με Λύσεις)',
    schemaQuizDesc: 'Διαδραστικό τεστ με τα 25 επίσημα θέματα Μαθηματικών των εξετάσεων εισαγωγής στα Πρότυπα Γυμνάσια 2024 (026–050), χρονόμετρο 60 λεπτών, αυτόματη βαθμολόγηση (0–50) και αναλυτικές λύσεις.',
    schemaEduLevel: "ΣΤ' Δημοτικού",
    schemaQuestionName: (num) => `Θέμα ${num} - Πρότυπα 2024`
  },
  en: {
    metaTitle: 'Model School 2024 Math Past Paper – Online Test & Solutions | LearnMaths.gr',
    metaDesc: 'Practice online with the 25 official Mathematics questions from the 2024 Model Middle School entrance exam (026–050), 60-minute timer, auto-grading, and full solutions.',
    backText: 'Model School Exams',
    heroBadge: 'Official 2024 Exam • 25 Mathematics Questions',
    heroTitle: 'Model Middle Schools 2024 Math Exam – Online Test & Solutions',
    heroSubtitle: 'Practice with the official Mathematics questions from the 2024 Model Middle School entrance exams. Includes all 25 questions (026–050) with automatic scoring (2 points per question, Max: 50), a 60-minute timer, and step-by-step solutions.',
    answeredLabel: 'Answered:',
    of25: 'of 25',
    scoringLabel: 'Scoring:',
    scoringValue: '2 points per question (Max: 50)',
    timerOn: '⏳ Timer: 60 minutes',
    timerOff: '⏳ Timer: Disabled',
    resultTitle: '2024 Model School Exam Results',
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
    axis31Aria: 'Number line with points 0, a, 5, and x',
    axis31Labels: ['0', 'a', '5', 'x'],
    timetableAria: 'Thursday class schedule for 7th grade',
    timetableHourHeader: 'Period',
    timetableDurHeader: 'Time',
    timetableRows: [
      { period: '1st', time: '08:15 - 09:00' },
      { period: '2nd', time: '09:10 - 09:55' },
      { period: '3rd', time: '10:10 - 10:55' },
      { period: '4th', time: '11:05 - 11:45' },
      { period: '5th', time: '11:50 - 12:30' },
      { period: '6th', time: '12:35 - 13:15' }
    ],
    semicirclesAria: 'Square of side 20 cm with two white semicircles inside and a black shaded region between them',
    juiceAria: 'Bar chart of juice flavor percentages: 25%, 20%, 40%, 10%, 5%',
    islandsAria: 'Map showing distances between Karpathos, Nisyros, and Astypalaia',
    islandsLabels: {
      astypalaia: 'ASTYPALAIA',
      kos: 'KOS',
      nisyros: 'NISYROS',
      tilos: 'TILOS',
      karpathos: 'KARPATHOS'
    },
    schemaHome: 'Home',
    schemaHub: 'Model School Entrance 2026 Prep',
    schemaCurrent: 'Model Middle Schools 2024 Exam',
    schemaQuizName: 'Official 2024 Model Middle School Mathematics Exam (With Solutions)',
    schemaQuizDesc: 'Interactive practice test featuring all 25 official Mathematics questions from the 2024 Model Middle School entrance examination (026–050), 60-minute timer, automatic grading (0–50), and detailed solutions.',
    schemaEduLevel: 'Grade 6',
    schemaQuestionName: (num) => `Question ${num} - Model Schools 2024`
  }
};

function getQuestions2024(locale) {
  const isEn = locale === 'en';
  const groupA = isEn ? 'GROUP A (4 CHOICES)' : 'ΟΜΑΔΑ Α (4 ΕΠΙΛΟΓΕΣ)';
  const groupB = isEn ? 'GROUP B (4 CHOICES)' : 'ΟΜΑΔΑ Β (4 ΕΠΙΛΟΓΕΣ)';

  return [
    {
      id: 1,
      officialNumber: 26,
      group: groupA,
      promptText: isEn
        ? 'Today is May 18. What day of the month will it be in 15 days?'
        : 'Σήμερα είναι 18 Μαΐου. Σε 15 ημέρες πόσο του μήνα θα είναι;',
      options: [
        { key: 'A', label: '2', raw: '2' },
        { key: 'B', label: '4', raw: '4' },
        { key: isEn ? 'C' : 'Γ', label: '1', raw: '1' },
        { key: isEn ? 'D' : 'Δ', label: '33', raw: '33' }
      ],
      correctRaw: '2',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>The month of <strong>May has 31 days</strong>.</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Remaining days in May: 31 － 18 ＝ <strong>13 days</strong></div>
            <div>• Days left out of the 15 days: 15 － 13 ＝ <strong>2 days</strong></div>
            <div className="pt-1 text-emerald-800 font-bold">
              ➔ Those 2 days belong to the next month (June), so it will be <strong>June 2</strong>.
            </div>
          </div>
          <p className="pt-1">Therefore, in 15 days it will be the <strong>2nd</strong> of the month (Choice <strong>A</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Ο μήνας <strong>Μάιος έχει 31 ημέρες</strong>.</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Υπολειπόμενες ημέρες του Μαΐου: 31 － 18 ＝ <strong>13 ημέρες</strong></div>
            <div>• Απομένουν από τις 15 ημέρες: 15 － 13 ＝ <strong>2 ημέρες</strong></div>
            <div className="pt-1 text-emerald-800 font-bold">
              ➔ Οι 2 αυτές ημέρες ανήκουν στον επόμενο μήνα (Ιούνιο), άρα θα είναι <strong>2 Ιουνίου</strong>.
            </div>
          </div>
          <p className="pt-1">Επομένως, σε 15 ημέρες θα έχουμε <strong>2</strong> του μήνα (Επιλογή <strong>A</strong>).</p>
        </div>
      )
    },
    {
      id: 2,
      officialNumber: 27,
      group: groupA,
      promptText: isEn
        ? 'Giorgos and Kostas each have the same amount of money. How many euros must Giorgos give to Kostas so that Giorgos has 30 euros less than Kostas?'
        : 'Ο Γιώργος και ο Κώστας έχουν το ίδιο ποσό χρημάτων ο καθένας. Πόσα ευρώ πρέπει να δώσει ο Γιώργος στον Κώστα για να έχει ο Γιώργος 30 ευρώ λιγότερα από τον Κώστα;',
      options: [
        { key: 'A', label: '10 €', raw: '10 €' },
        { key: 'B', label: '15 €', raw: '15 €' },
        { key: isEn ? 'C' : 'Γ', label: '20 €', raw: '20 €' },
        { key: isEn ? 'D' : 'Δ', label: '30 €', raw: '30 €' }
      ],
      correctRaw: '15 €',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Suppose each boy initially has <strong>X €</strong>.</p>
          <p>If Giorgos gives <strong>x €</strong> to Kostas:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Giorgos&apos;s money: <strong>X － x</strong></div>
            <div>• Kostas&apos;s money: <strong>X ＋ x</strong></div>
            <div className="pt-1">Difference: (X ＋ x) － (X － x) ＝ <strong>2x</strong></div>
          </div>
          <p>We want their final difference to be 30 €:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 inline-flex items-center gap-1.5 whitespace-nowrap">
            <span>2x ＝ 30 ➔ x ＝ <Frac num="30" den="2" /> ＝ <strong className="text-emerald-700 text-base">15 €</strong></span>
          </div>
          <p className="pt-1">Therefore, Giorgos must give <strong>15 €</strong> (Choice <strong>B</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Έστω ότι αρχικά κάθε παιδί έχει ποσό <strong>X €</strong>.</p>
          <p>Αν ο Γιώργος δώσει <strong>x €</strong> στον Κώστα:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Χρήματα Γιώργου: <strong>X － x</strong></div>
            <div>• Χρήματα Κώστα: <strong>X ＋ x</strong></div>
            <div className="pt-1">Διαφορά: (X ＋ x) － (X － x) ＝ <strong>2x</strong></div>
          </div>
          <p>Θέλουμε η τελική διαφορά τους να είναι 30 €:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 inline-flex items-center gap-1.5 whitespace-nowrap">
            <span>2x ＝ 30 ➔ x ＝ <Frac num="30" den="2" /> ＝ <strong className="text-emerald-700 text-base">15 €</strong></span>
          </div>
          <p className="pt-1">Συνεπώς, ο Γιώργος πρέπει να δώσει <strong>15 €</strong> (Επιλογή <strong>B</strong>).</p>
        </div>
      )
    },
    {
      id: 3,
      officialNumber: 28,
      group: groupA,
      promptText: isEn
        ? 'What is the average of the numbers 2021, 2022, 2023, 2024, 2025?'
        : 'Ποιος είναι ο μέσος όρος των αριθμών 2021, 2022, 2023, 2024, 2025;',
      options: [
        { key: 'A', label: '2022', raw: '2022' },
        { key: 'B', label: isEn ? '2022.5' : '2022,5', raw: isEn ? '2022.5' : '2022,5' },
        { key: isEn ? 'C' : 'Γ', label: '2023', raw: '2023' },
        { key: isEn ? 'D' : 'Δ', label: isEn ? '2023.5' : '2023,5', raw: isEn ? '2023.5' : '2023,5' }
      ],
      correctRaw: '2023',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>The numbers are 5 <strong>consecutive integers</strong> with a constant step of 1:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            2021, 2022, <strong className="text-emerald-700 underline text-base">2023</strong>, 2024, 2025
          </div>
          <p>
            In any arithmetic sequence with an odd number of terms, the average always equals the <strong>middle term</strong> (by symmetry around 2023).
          </p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span>Average ＝</span>
            <Frac num="2021 ＋ 2022 ＋ 2023 ＋ 2024 ＋ 2025" den="5" />
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＝ <Frac num="10115" den="5" /></span>
            <span className="whitespace-nowrap">＝ <strong className="text-emerald-700 text-base">2023</strong></span>
          </div>
          <p className="pt-1">Therefore, the average is <strong>2023</strong> (Choice <strong>C</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Οι αριθμοί είναι 5 <strong>διαδοχικοί ακέραιοι</strong> με σταθερό βήμα 1:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            2021, 2022, <strong className="text-emerald-700 underline text-base">2023</strong>, 2024, 2025
          </div>
          <p>
            Σε οποιαδήποτε αριθμητική πρόοδο με περιττό πλήθος όρων, ο μέσος όρος ταυτίζεται πάντα με τον <strong>μεσαίο όρο</strong> (συμμετρία γύρω από το 2023).
          </p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span>Μέσος Όρος ＝</span>
            <Frac num="2021 ＋ 2022 ＋ 2023 ＋ 2024 ＋ 2025" den="5" />
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＝ <Frac num="10115" den="5" /></span>
            <span className="whitespace-nowrap">＝ <strong className="text-emerald-700 text-base">2023</strong></span>
          </div>
          <p className="pt-1">Επομένως, ο μέσος όρος είναι το <strong>2023</strong> (Επιλογή <strong>Γ</strong>).</p>
        </div>
      )
    },
    {
      id: 4,
      officialNumber: 29,
      group: groupA,
      promptText: isEn
        ? '250 children went to a summer camp. Of these children, 40% were girls. How many boys were at the camp?'
        : 'Σε μία κατασκήνωση πήγαν 250 παιδιά. Από αυτά τα παιδιά τα κορίτσια ήταν το 40%. Πόσα ήταν τα αγόρια στην κατασκήνωση;',
      options: [
        { key: 'A', label: '150', raw: '150' },
        { key: 'B', label: '125', raw: '125' },
        { key: isEn ? 'C' : 'Γ', label: '100', raw: '100' },
        { key: isEn ? 'D' : 'Δ', label: '175', raw: '175' }
      ],
      correctRaw: '150',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Since girls make up 40% of the total, the percentage of boys is:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            100% － 40% ＝ <strong>60%</strong>
          </div>
          <p>Calculate the number of boys:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">Boys ＝ 250 · <Frac num="60" den="100" /></span>
            <span className="whitespace-nowrap">＝ 250 · 0.60 ＝ <strong className="text-emerald-700 text-base">150 boys</strong></span>
          </div>
          <p className="pt-1">Thus, there were <strong>150</strong> boys (Choice <strong>A</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Εφόσον τα κορίτσια αποτελούν το 40% του συνόλου, το ποσοστό των αγοριών είναι:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            100% － 40% ＝ <strong>60%</strong>
          </div>
          <p>Υπολογίζουμε το πλήθος των αγοριών:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">Αγόρια ＝ 250 · <Frac num="60" den="100" /></span>
            <span className="whitespace-nowrap">＝ 250 · 0,60 ＝ <strong className="text-emerald-700 text-base">150 αγόρια</strong></span>
          </div>
          <p className="pt-1">Άρα, τα αγόρια ήταν <strong>150</strong> (Επιλογή <strong>A</strong>).</p>
        </div>
      )
    },
    {
      id: 5,
      officialNumber: 30,
      group: groupA,
      promptText: isEn ? (
        <span>
          What is the value of the expression{' '}
          <span className="font-mono whitespace-nowrap">
            ( <Frac num="9" den="2" /> － <Pow base="2" exp="2" /> ) : <Frac num="1" den="4" />
          </span>
          ?
        </span>
      ) : (
        <span>
          Ποια είναι η τιμή της παράστασης{' '}
          <span className="font-mono whitespace-nowrap">
            ( <Frac num="9" den="2" /> － <Pow base="2" exp="2" /> ) : <Frac num="1" den="4" />
          </span>
          ;
        </span>
      ),
      options: [
        { key: 'A', label: '2', raw: '2' },
        { key: 'B', label: <Frac num="1" den="2" />, raw: '1/2' },
        { key: isEn ? 'C' : 'Γ', label: <Frac num="1" den="8" />, raw: '1/8' },
        { key: isEn ? 'D' : 'Δ', label: '10', raw: '10' }
      ],
      correctRaw: '2',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>First compute the exponent and the operation inside the parentheses:</p>
          <div className="space-y-2 bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            <div>• <Pow base="2" exp="2" /> ＝ 4 ＝ <Frac num="8" den="2" /></div>
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span>• Parentheses ＝</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="9" den="2" /> － <Frac num="8" den="2" /> ＝ <Frac num="1" den="2" />
              </span>
            </div>
          </div>
          <p>Next, write the division as a complex fraction and multiply by the reciprocal:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <ComplexFrac
              num={<Frac num="1" den="2" small />}
              den={<Frac num="1" den="4" small />}
            />
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＝ <Frac num="1" den="2" /> · 4</span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ＝ <Frac num="4" den="2" /> ＝ <strong className="text-emerald-700 text-base">2</strong>
            </span>
          </div>
          <p className="pt-1">Therefore, the value of the expression is <strong>2</strong> (Choice <strong>A</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Εκτελούμε πρώτα τη δύναμη και τις πράξεις μέσα στην παρένθεση:</p>
          <div className="space-y-2 bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            <div>• <Pow base="2" exp="2" /> ＝ 4 ＝ <Frac num="8" den="2" /></div>
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span>• Παρένθεση ＝</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="9" den="2" /> － <Frac num="8" den="2" /> ＝ <Frac num="1" den="2" />
              </span>
            </div>
          </div>
          <p>Στη συνέχεια εκτελούμε τη διαίρεση σε μορφή κλάσματος πολλαπλασιάζοντας με τον αντίστροφο:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <ComplexFrac
              num={<Frac num="1" den="2" small />}
              den={<Frac num="1" den="4" small />}
            />
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＝ <Frac num="1" den="2" /> · 4</span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ＝ <Frac num="4" den="2" /> ＝ <strong className="text-emerald-700 text-base">2</strong>
            </span>
          </div>
          <p className="pt-1">Επομένως, η τιμή της παράστασης είναι <strong>2</strong> (Επιλογή <strong>A</strong>).</p>
        </div>
      )
    },
    {
      id: 6,
      officialNumber: 31,
      group: groupA,
      promptText: isEn
        ? 'On the number line below, the number a is equidistant from 0 and 5. Also, the numbers a and x are equidistant from 5. What is the number x?'
        : 'Στην αριθμογραμμή του παρακάτω σχήματος, ο αριθμός α απέχει το ίδιο από το 0 και το 5. Επίσης οι αριθμοί α και χ απέχουν το ίδιο από το 5. Ποιος είναι ο αριθμός χ;',
      hasSvg: 'axis31',
      options: [
        { key: 'A', label: isEn ? '2.5' : '2,5', raw: isEn ? '2.5' : '2,5' },
        { key: 'B', label: '3', raw: '3' },
        { key: isEn ? 'C' : 'Γ', label: isEn ? '7.5' : '7,5', raw: isEn ? '7.5' : '7,5' },
        { key: isEn ? 'D' : 'Δ', label: '6', raw: '6' }
      ],
      correctRaw: isEn ? '7.5' : '7,5',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. The number <strong>a</strong> is the midpoint of the interval [0, 5]:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 inline-flex items-center gap-1.5 whitespace-nowrap">
            <span>a ＝ <Frac num="5" den="2" /> ＝ <strong>2.5</strong></span>
          </div>
          <p>2. The distance of <strong>a</strong> from <strong>5</strong> is:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            5 － 2.5 ＝ <strong>2.5 units</strong>
          </div>
          <p>3. Since <strong>x</strong> is also equidistant from 5 (and lies to its right):</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            x ＝ 5 ＋ 2.5 ＝ <strong className="text-emerald-700 text-base">7.5</strong>
          </div>
          <p className="pt-1">Thus, the number x is <strong>7.5</strong> (Choice <strong>C</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Ο αριθμός <strong>α</strong> είναι το μέσο του διαστήματος [0, 5]:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 inline-flex items-center gap-1.5 whitespace-nowrap">
            <span>α ＝ <Frac num="5" den="2" /> ＝ <strong>2,5</strong></span>
          </div>
          <p>2. Η απόσταση του <strong>α</strong> από το <strong>5</strong> είναι:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            5 － 2,5 ＝ <strong>2,5 μονάδες</strong>
          </div>
          <p>3. Επειδή και το <strong>χ</strong> απέχει εξίσου από το 5 (και βρίσκεται δεξιά του):</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            χ ＝ 5 ＋ 2,5 ＝ <strong className="text-emerald-700 text-base">7,5</strong>
          </div>
          <p className="pt-1">Άρα, ο αριθμός χ είναι <strong>7,5</strong> (Επιλογή <strong>Γ</strong>).</p>
        </div>
      )
    },
    {
      id: 7,
      officialNumber: 32,
      group: groupA,
      promptText: isEn ? (
        <span>
          In a box I have colored balls, and <Frac num="2" den="5" /> of them are green. If the balls in the box that are not green are 60, how many green balls are there?
        </span>
      ) : (
        <span>
          Σε ένα κουτί έχω χρωματιστά μπαλάκια και τα <Frac num="2" den="5" /> από αυτά είναι πράσινα. Αν τα μπαλάκια στο κουτί που δεν είναι πράσινα είναι 60, πόσα είναι τα πράσινα μπαλάκια;
        </span>
      ),
      options: [
        { key: 'A', label: '36', raw: '36' },
        { key: 'B', label: '40', raw: '40' },
        { key: isEn ? 'C' : 'Γ', label: '24', raw: '24' },
        { key: isEn ? 'D' : 'Δ', label: '90', raw: '90' }
      ],
      correctRaw: '40',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            If <Frac num="2" den="5" /> are green, then the balls that are <strong>not green</strong> make up the remaining:
          </p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 inline-flex items-center gap-1.5 whitespace-nowrap">
            <span>1 － <Frac num="2" den="5" /> ＝ <Frac num="3" den="5" /> of the total.</span>
          </div>
          <p><Frac num="3" den="5" /> corresponds to 60 balls:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• <Frac num="1" den="5" /> is:</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="60" den="3" /> ＝ <strong>20 balls</strong>
              </span>
            </div>
            <div>• The green balls are <Frac num="2" den="5" />: 2 · 20 ＝ <strong className="text-emerald-700 text-base">40 green balls</strong></div>
          </div>
          <p className="pt-1">Therefore, there are <strong>40</strong> green balls (Choice <strong>B</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            Αν τα πράσινα είναι τα <Frac num="2" den="5" />, τότε τα μπαλάκια που <strong>δεν είναι πράσινα</strong> αποτελούν τα υπόλοιπα:
          </p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 inline-flex items-center gap-1.5 whitespace-nowrap">
            <span>1 － <Frac num="2" den="5" /> ＝ <Frac num="3" den="5" /> του συνόλου.</span>
          </div>
          <p>Τα <Frac num="3" den="5" /> αντιστοιχούν σε 60 μπαλάκια:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Το <Frac num="1" den="5" /> είναι:</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="60" den="3" /> ＝ <strong>20 μπαλάκια</strong>
              </span>
            </div>
            <div>• Τα πράσινα είναι <Frac num="2" den="5" />: 2 · 20 ＝ <strong className="text-emerald-700 text-base">40 πράσινα μπαλάκια</strong></div>
          </div>
          <p className="pt-1">Συνεπώς, τα πράσινα μπαλάκια είναι <strong>40</strong> (Επιλογή <strong>B</strong>).</p>
        </div>
      )
    },
    {
      id: 8,
      officialNumber: 33,
      group: groupA,
      promptText: isEn
        ? 'Maria, starting from the door of her house, walked 50 meters north, 30 meters east, and 20 meters south, arriving in front of the school door. Then, from the school door, she walked 30 meters west. To return home, how much further does she need to walk?'
        : 'Η Μαρία, ξεκινώντας από την πόρτα του σπιτιού της περπάτησε 50 μέτρα βόρεια, 30 μέτρα ανατολικά και 20 μέτρα νότια και έφτασε μπροστά στην πόρτα του σχολείου. Στη συνέχεια, από την πόρτα του σχολείου περπάτησε 30 μέτρα δυτικά. Για να επιστρέψει στο σπίτι της πόσο ακόμα χρειάζεται να περπατήσει;',
      options: isEn
        ? [
            { key: 'A', label: '50 meters south', raw: '50 meters south' },
            { key: 'B', label: '30 meters south', raw: '30 meters south' },
            { key: 'C', label: '20 meters south', raw: '20 meters south' },
            { key: 'D', label: '50 meters north and 20 meters south', raw: '50 meters north and 20 meters south' }
          ]
        : [
            { key: 'A', label: '50 μέτρα νότια', raw: '50 μέτρα νότια' },
            { key: 'B', label: '30 μέτρα νότια', raw: '30 μέτρα νότια' },
            { key: 'Γ', label: '20 μέτρα νότια', raw: '20 μέτρα νότια' },
            { key: 'Δ', label: '50 μέτρα βόρεια και 20 μέτρα νότια', raw: '50 μέτρα βόρεια και 20 μέτρα νότια' }
          ],
      correctRaw: isEn ? '30 meters south' : '30 μέτρα νότια',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Record Maria&apos;s displacement along two axes (North–South and East–West):</p>
          <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>1. School: ＋50 m North, ＋30 m East, －20 m South ➔ <strong>＋30 m North, ＋30 m East</strong> from home.</div>
            <div>2. After school: walks 30 m West ➔ cancels the eastern displacement completely (30 － 30 ＝ 0).</div>
            <div className="pt-1 text-slate-800 font-bold">
              ➔ She is now exactly <strong>30 meters north</strong> of her house.
            </div>
          </div>
          <p>Thus, to return home she needs to walk <strong>30 meters south</strong> (Choice <strong>B</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Καταγράφουμε τη μετατόπιση της Μαρίας σε δύο άξονες (Βορράς-Νότος και Ανατολή-Δύση):</p>
          <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>1. Σχολείο: ＋50μ. Βόρεια, ＋30μ. Ανατολικά, －20μ. Νότια ➔ <strong>＋30μ. Βόρεια, ＋30μ. Ανατολικά</strong> από το σπίτι.</div>
            <div>2. Μετά το σχολείο: περπατά 30μ. Δυτικά ➔ ακυρώνεται πλήρως η ανατολική μετατόπιση (30 － 30 ＝ 0).</div>
            <div className="pt-1 text-slate-800 font-bold">
              ➔ Τώρα βρίσκεται ακριβώς <strong>30 μέτρα βόρεια</strong> από το σπίτι της.
            </div>
          </div>
          <p>Άρα, για να επιστρέψει στο σπίτι χρειάζεται να περπατήσει <strong>30 μέτρα νότια</strong> (Επιλογή <strong>B</strong>).</p>
        </div>
      )
    },
    {
      id: 9,
      officialNumber: 34,
      group: groupA,
      promptText: isEn ? (
        <span>
          Which number must we add to the fraction <Frac num="5" den="7" /> to get the fraction <Frac num="22" den="21" />?
        </span>
      ) : (
        <span>
          Ποιον αριθμό πρέπει να προσθέσουμε στο κλάσμα <Frac num="5" den="7" /> για να πάρουμε το κλάσμα <Frac num="22" den="21" />;
        </span>
      ),
      options: [
        { key: 'A', label: <Frac num="1" den="4" />, raw: '1/4' },
        { key: 'B', label: <Frac num="2" den="5" />, raw: '2/5' },
        { key: isEn ? 'C' : 'Γ', label: <Frac num="1" den="3" />, raw: '1/3' },
        { key: isEn ? 'D' : 'Δ', label: <Frac num="5" den="7" />, raw: '5/7' }
      ],
      correctRaw: '1/3',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Subtract the initial fraction from the target result:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <Frac num="22" den="21" />
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">－ <Frac num="5" den="7" /></span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ＝ <Frac num="22" den="21" /> － <Frac num="15" den="21" />
            </span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ＝ <Frac num="7" den="21" /> ＝ <strong className="text-emerald-700 text-base"><Frac num="1" den="3" /></strong>
            </span>
          </div>
          <p className="pt-1">
            Therefore, we must add <strong><Frac num="1" den="3" /></strong> (Choice <strong>C</strong>).
          </p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Αφαιρούμε το αρχικό κλάσμα από το τελικό αποτέλεσμα:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <Frac num="22" den="21" />
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">－ <Frac num="5" den="7" /></span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ＝ <Frac num="22" den="21" /> － <Frac num="15" den="21" />
            </span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ＝ <Frac num="7" den="21" /> ＝ <strong className="text-emerald-700 text-base"><Frac num="1" den="3" /></strong>
            </span>
          </div>
          <p className="pt-1">
            Επομένως, πρέπει να προσθέσουμε το <strong><Frac num="1" den="3" /></strong> (Επιλογή <strong>Γ</strong>).
          </p>
        </div>
      )
    },
    {
      id: 10,
      officialNumber: 35,
      group: groupA,
      promptText: isEn
        ? 'A three-digit number has 9 tens. If I increase the number by 3 units, its hundreds digit is 7, whereas if I increase it by 4 units, its hundreds digit is 8. What is the three-digit number?'
        : 'Ένας τριψήφιος αριθμός έχει 9 δεκάδες. Αν αυξήσω τον αριθμό κατά 3 μονάδες ο αριθμός των εκατοντάδων του είναι 7, ενώ αν τον αυξήσω κατά 4 μονάδες ο αριθμός των εκατοντάδων του είναι 8. Ποιος είναι ο τριψήφιος αριθμός;',
      options: [
        { key: 'A', label: '797', raw: '797' },
        { key: 'B', label: '796', raw: '796' },
        { key: isEn ? 'C' : 'Γ', label: '896', raw: '896' },
        { key: isEn ? 'D' : 'Δ', label: '799', raw: '799' }
      ],
      correctRaw: '796',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            If adding 4 units changes the hundreds digit to 8, then adding 4 reaches at least 800:
          </p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
            <div>• Number ＋ 4 ＝ 800 ➔ Number ＝ 800 － 4 ＝ <strong>796</strong></div>
            <div>• Check ＋ 3 units: 796 ＋ 3 ＝ <strong>799</strong> (hundreds digit is 7 ✅)</div>
            <div>• Has 9 tens: 7<strong>9</strong>6 ✅</div>
          </div>
          <p className="pt-1">Thus, the three-digit number is <strong>796</strong> (Choice <strong>B</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            Αν αυξήσουμε τον αριθμό κατά 4 μονάδες, αλλάζει η εκατοντάδα και γίνεται 8 (δηλαδή φτάνει τουλάχιστον στο 800):
          </p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
            <div>• Αριθμός ＋ 4 ＝ 800 ➔ Αριθμός ＝ 800 － 4 ＝ <strong>796</strong></div>
            <div>• Έλεγχος με ＋ 3 μονάδες: 796 ＋ 3 ＝ <strong>799</strong> (εκατοντάδα 7 ✅)</div>
            <div>• Έχει 9 δεκάδες: 7<strong>9</strong>6 ✅</div>
          </div>
          <p className="pt-1">Άρα, ο τριψήφιος αριθμός είναι ο <strong>796</strong> (Επιλογή <strong>B</strong>).</p>
        </div>
      )
    },
    {
      id: 11,
      officialNumber: 36,
      group: groupB,
      promptText: isEn
        ? 'The table shows the Thursday class schedule for 7th grade. During the 6th period, Michalis looked at his watch and saw there were 20 minutes left until school ended. He remembers that 2 hours and 50 minutes earlier, during a break, he had bought a koulouri from the canteen. If he remembers correctly, during which break did he buy the koulouri?'
        : 'Στον πίνακα φαίνεται το πρόγραμμα των ωρών της Α΄ γυμνασίου, κάθε Πέμπτη. Ο Μιχάλης την 6η ώρα κοίταξε το ρολόι του και έμεναν 20 λεπτά για να σχολάσει. Θυμάται ότι πριν 2 ώρες και 50 λεπτά, στο διάλειμμα, είχε αγοράσει ένα κουλούρι από το κυλικείο. Αν θυμάται καλά, σε ποιο διάλειμμα είχε αγοράσει το κουλούρι;',
      hasTable: 'timetable36',
      options: isEn
        ? [
            { key: 'A', label: 'Between 1st and 2nd period', raw: 'Between 1st and 2nd period' },
            { key: 'B', label: 'Between 2nd and 3rd period', raw: 'Between 2nd and 3rd period' },
            { key: 'C', label: 'Between 3rd and 4th period', raw: 'Between 3rd and 4th period' },
            { key: 'D', label: 'He does not remember correctly, because 2 hours and 50 minutes earlier was class time', raw: 'He does not remember correctly' }
          ]
        : [
            { key: 'A', label: 'Μεταξύ 1ης και 2ης ώρας', raw: 'Μεταξύ 1ης και 2ης ώρας' },
            { key: 'B', label: 'Μεταξύ 2ης και 3ης ώρας', raw: 'Μεταξύ 2ης και 3ης ώρας' },
            { key: 'Γ', label: 'Μεταξύ 3ης και 4ης ώρας', raw: 'Μεταξύ 3ης και 4ης ώρας' },
            { key: 'Δ', label: 'Δεν θυμάται καλά, γιατί πριν 2 ώρες και 50 λεπτά ήταν ώρα μαθήματος', raw: 'Δεν θυμάται καλά' }
          ],
      correctRaw: isEn ? 'Between 2nd and 3rd period' : 'Μεταξύ 2ης και 3ης ώρας',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. The 6th period ends at <strong>13:15</strong>. Since 20 minutes remained, the time he looked at his watch was:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            13:15 － 20 minutes ＝ <strong>12:55</strong>
          </div>
          <p>2. Go back 2 hours and 50 minutes:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
            <div>• 12:55 － 2 hours ＝ 10:55</div>
            <div>• 10:55 － 50 minutes ＝ <strong>10:05</strong></div>
          </div>
          <p>
            3. Looking at the schedule, the 2nd period ends at <strong>09:55</strong> and the 3rd period starts at <strong>10:10</strong>. Thus, 09:55–10:10 is the <strong>break between 2nd and 3rd period</strong> (10:05 falls within it).
          </p>
          <p className="pt-1 font-bold text-emerald-800">Choice B: Between 2nd and 3rd period.</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Η 6η ώρα τελειώνει (σχόλασμα) στις <strong>13:15</strong>. Επειδή έμεναν 20 λεπτά, η ώρα που κοίταξε το ρολόι ήταν:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            13:15 － 20 λεπτά ＝ <strong>12:55</strong>
          </div>
          <p>2. Πηγαίνουμε 2 ώρες και 50 λεπτά πίσω:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
            <div>• 12:55 － 2 ώρες ＝ 10:55</div>
            <div>• 10:55 － 50 λεπτά ＝ <strong>10:05</strong></div>
          </div>
          <p>
            3. Κοιτάζοντας το πρόγραμμα, η 2η ώρα τελειώνει στις <strong>09:55</strong> και η 3η αρχίζει στις <strong>10:10</strong>. Επομένως, το διάστημα 09:55–10:10 είναι το <strong>διάλειμμα μεταξύ 2ης και 3ης ώρας</strong> (η ώρα 10:05 ανήκει εκεί).
          </p>
          <p className="pt-1 font-bold text-emerald-800">Επιλογή B: Μεταξύ 2ης και 3ης ώρας.</p>
        </div>
      )
    },
    {
      id: 12,
      officialNumber: 37,
      group: groupB,
      promptText: isEn
        ? 'Which fraction is closest to the number 0.9?'
        : 'Ποιο κλάσμα είναι πιο κοντά στον αριθμό 0,9;',
      options: [
        { key: 'A', label: <Frac num="4" den="5" />, raw: '4/5' },
        { key: 'B', label: <Frac num="7" den="10" />, raw: '7/10' },
        { key: isEn ? 'C' : 'Γ', label: <Frac num="11" den="10" />, raw: '11/10' },
        { key: isEn ? 'D' : 'Δ', label: <Frac num="19" den="20" />, raw: '19/20' }
      ],
      correctRaw: '19/20',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Convert each fraction to decimal form and find its distance from <strong>0.9</strong>:</p>
          <div className="space-y-2 bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            <div>• A: <Frac num="4" den="5" /> ＝ 0.80 ➔ distance: |0.9 － 0.8| ＝ <strong>0.10</strong></div>
            <div>• B: <Frac num="7" den="10" /> ＝ 0.70 ➔ distance: |0.9 － 0.7| ＝ <strong>0.20</strong></div>
            <div>• C: <Frac num="11" den="10" /> ＝ 1.10 ➔ distance: |0.9 － 1.1| ＝ <strong>0.20</strong></div>
            <div>• D: <Frac num="19" den="20" /> ＝ <Frac num="95" den="100" /> ＝ 0.95 ➔ distance: |0.9 － 0.95| ＝ <strong className="text-emerald-700">0.05</strong></div>
          </div>
          <p className="pt-1">
            The smallest distance is 0.05, so the closest fraction is <strong><Frac num="19" den="20" /></strong> (Choice <strong>D</strong>).
          </p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Μετατρέπουμε κάθε κλάσμα σε δεκαδικό και υπολογίζουμε την απόστασή του από το <strong>0,9</strong>:</p>
          <div className="space-y-2 bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            <div>• Α: <Frac num="4" den="5" /> ＝ 0,80 ➔ απόσταση: |0,9 － 0,8| ＝ <strong>0,10</strong></div>
            <div>• Β: <Frac num="7" den="10" /> ＝ 0,70 ➔ απόσταση: |0,9 － 0,7| ＝ <strong>0,20</strong></div>
            <div>• Γ: <Frac num="11" den="10" /> ＝ 1,10 ➔ απόσταση: |0,9 － 1,1| ＝ <strong>0,20</strong></div>
            <div>• Δ: <Frac num="19" den="20" /> ＝ <Frac num="95" den="100" /> ＝ 0,95 ➔ απόσταση: |0,9 － 0,95| ＝ <strong className="text-emerald-700">0,05</strong></div>
          </div>
          <p className="pt-1">
            Η μικρότερη απόσταση είναι 0,05, άρα το πιο κοντινό κλάσμα είναι το <strong><Frac num="19" den="20" /></strong> (Επιλογή <strong>Δ</strong>).
          </p>
        </div>
      )
    },
    {
      id: 13,
      officialNumber: 38,
      group: groupB,
      promptText: isEn ? (
        <span>
          A bottle is <Frac num="9" den="12" /> full of water. I fill 2 identical glasses with water from the bottle, and now the bottle is <Frac num="1" den="12" /> full of water. How many glasses of water are needed to fill the bottle when it is empty?
        </span>
      ) : (
        <span>
          Ένα μπουκάλι είναι γεμάτο με νερό κατά τα <Frac num="9" den="12" />. Γεμίζω 2 ίδια ποτήρια με νερό από το μπουκάλι και τώρα το μπουκάλι είναι γεμάτο με νερό κατά το <Frac num="1" den="12" />. Με πόσα ποτήρια νερό γεμίζει το μπουκάλι, αν είναι άδειο;
        </span>
      ),
      options: [
        { key: 'A', label: '6', raw: '6' },
        { key: 'B', label: '3', raw: '3' },
        { key: isEn ? 'C' : 'Γ', label: '2', raw: '2' },
        { key: isEn ? 'D' : 'Δ', label: '4', raw: '4' }
      ],
      correctRaw: '3',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. The amount of water poured into the 2 glasses is:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 inline-flex items-center gap-1.5 whitespace-nowrap">
            <Frac num="9" den="12" />
            <span>－ <Frac num="1" den="12" /> ＝ <Frac num="8" den="12" /> of the bottle.</span>
          </div>
          <p>2. The 2 glasses equal <Frac num="8" den="12" />, so 1 glass holds:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <ComplexFrac num={<Frac num="8" den="12" small />} den="2" />
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ＝ <Frac num="4" den="12" /> ＝ <Frac num="1" den="3" /> of the bottle.
            </span>
          </div>
          <p>
            3. Since 1 glass is <Frac num="1" den="3" /> of the bottle, the entire bottle (<Frac num="3" den="3" />) is filled with <strong>3 glasses</strong> (Choice <strong>B</strong>).
          </p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Η ποσότητα νερού που αφαιρέθηκε για τα 2 ποτήρια είναι:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 inline-flex items-center gap-1.5 whitespace-nowrap">
            <Frac num="9" den="12" />
            <span>－ <Frac num="1" den="12" /> ＝ <Frac num="8" den="12" /> του μπουκαλιού.</span>
          </div>
          <p>2. Τα 2 ποτήρια αντιστοιχούν στα <Frac num="8" den="12" />, άρα το 1 ποτήρι χωράει:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <ComplexFrac num={<Frac num="8" den="12" small />} den="2" />
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ＝ <Frac num="4" den="12" /> ＝ <Frac num="1" den="3" /> του μπουκαλιού.
            </span>
          </div>
          <p>
            3. Αφού 1 ποτήρι είναι το <Frac num="1" den="3" /> του μπουκαλιού, ολόκληρο το μπουκάλι (<Frac num="3" den="3" />) γεμίζει με <strong>3 ποτήρια</strong> (Επιλογή <strong>B</strong>).
          </p>
        </div>
      )
    },
    {
      id: 14,
      officialNumber: 39,
      group: groupB,
      promptText: isEn
        ? 'Which number between 20 and 35 is missing from the pattern: 2, 5, 9, 14, 20, ..., 35, 44, 54, 65?'
        : 'Ποιος αριθμός μεταξύ 20 και 35 λείπει από το μοτίβο: 2, 5, 9, 14, 20, ..., 35, 44, 54, 65;',
      options: [
        { key: 'A', label: '26', raw: '26' },
        { key: 'B', label: '27', raw: '27' },
        { key: isEn ? 'C' : 'Γ', label: '28', raw: '28' },
        { key: isEn ? 'D' : 'Δ', label: '29', raw: '29' }
      ],
      correctRaw: '27',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Observe the differences between consecutive terms in the pattern:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
            <div>• 5 － 2 ＝ <strong>＋3</strong></div>
            <div>• 9 － 5 ＝ <strong>＋4</strong></div>
            <div>• 14 － 9 ＝ <strong>＋5</strong></div>
            <div>• 20 － 14 ＝ <strong>＋6</strong></div>
            <div className="text-emerald-700 font-bold">• Next step: 20 ＋ 7 ＝ <strong>27</strong></div>
            <div>• Check continuation: 27 ＋ 8 ＝ 35 ✅, 35 ＋ 9 ＝ 44 ✅</div>
          </div>
          <p className="pt-1">Therefore, the missing number is <strong>27</strong> (Choice <strong>B</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Παρατηρούμε τις διαφορές μεταξύ διαδοχικών όρων του μοτίβου:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
            <div>• 5 － 2 ＝ <strong>＋3</strong></div>
            <div>• 9 － 5 ＝ <strong>＋4</strong></div>
            <div>• 14 － 9 ＝ <strong>＋5</strong></div>
            <div>• 20 － 14 ＝ <strong>＋6</strong></div>
            <div className="text-emerald-700 font-bold">• Επόμενο βήμα: 20 ＋ 7 ＝ <strong>27</strong></div>
            <div>• Έλεγχος συνέχειας: 27 ＋ 8 ＝ 35 ✅, 35 ＋ 9 ＝ 44 ✅</div>
          </div>
          <p className="pt-1">Επομένως, ο αριθμός που λείπει είναι το <strong>27</strong> (Επιλογή <strong>B</strong>).</p>
        </div>
      )
    },
    {
      id: 15,
      officialNumber: 40,
      group: groupB,
      promptText: isEn
        ? 'In the figure below, we have drawn a square with a side of 20 cm and inside it two semicircles with diameter equal to the side of the square. What is the area of the black region? (use π = 3.14)'
        : 'Στο διπλανό σχήμα έχουμε σχεδιάσει ένα τετράγωνο με πλευρά 20 εκ. και στο εσωτερικό του σχεδιάσαμε δυο ημικύκλια με διάμετρο την πλευρά του τετραγώνου. Ποιο είναι το εμβαδόν του μαύρου χωρίου; (να χρησιμοποιήσετε ότι π = 3,14)',
      hasSvg: 'squareSemicircles40',
      options: isEn
        ? [
            { key: 'A', label: '314 sq. cm.', raw: '314 sq. cm.' },
            { key: 'B', label: '274.4 sq. cm.', raw: '274.4 sq. cm.' },
            { key: 'C', label: '125.6 sq. cm.', raw: '125.6 sq. cm.' },
            { key: 'D', label: '86 sq. cm.', raw: '86 sq. cm.' }
          ]
        : [
            { key: 'A', label: '314 τ.εκ.', raw: '314 τ.εκ.' },
            { key: 'B', label: '274,4 τ.εκ.', raw: '274,4 τ.εκ.' },
            { key: 'Γ', label: '125,6 τ.εκ.', raw: '125,6 τ.εκ.' },
            { key: 'Δ', label: '86 τ.εκ.', raw: '86 τ.εκ.' }
          ],
      correctRaw: isEn ? '86 sq. cm.' : '86 τ.εκ.',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            1. <strong>Area of square:</strong><br />
            A_square ＝ side · side ＝ 20 · 20 ＝ <strong>400 sq. cm.</strong>
          </p>
          <p>
            2. <strong>Area of the 2 semicircles:</strong><br />
            The two identical semicircles of diameter 20 cm (radius ρ ＝ 10 cm) combine to form <strong>one full circle</strong>:
          </p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            A_circle ＝ π · <Pow base="ρ" exp="2" /> ＝ 3.14 · <Pow base="10" exp="2" /> ＝ 3.14 · 100 ＝ <strong>314 sq. cm.</strong>
          </div>
          <p>3. <strong>Area of the shaded (black) region:</strong></p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            A_black ＝ A_square － A_circle ＝ 400 － 314 ＝ <strong className="text-emerald-700 text-base">86 sq. cm.</strong>
          </div>
          <p className="pt-1">Therefore, the area of the black region is <strong>86 sq. cm.</strong> (Choice <strong>D</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            1. <strong>Εμβαδόν τετραγώνου:</strong><br />
            Ε_τετρ ＝ πλευρά · πλευρά ＝ 20 · 20 ＝ <strong>400 τ.εκ.</strong>
          </p>
          <p>
            2. <strong>Εμβαδόν των 2 ημικυκλίων:</strong><br />
            Τα δύο ίσα ημικύκλια με διάμετρο 20 εκ. (ακτίνα ρ ＝ 10 εκ.) ενώνονται σχηματίζοντας <strong>έναν πλήρη κύκλο</strong>:
          </p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            Ε_κύκλου ＝ π · <Pow base="ρ" exp="2" /> ＝ 3,14 · <Pow base="10" exp="2" /> ＝ 3,14 · 100 ＝ <strong>314 τ.εκ.</strong>
          </div>
          <p>3. <strong>Εμβαδόν του σκιασμένου (μαύρου) χωρίου:</strong></p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            Ε_μαύρου ＝ Ε_τετρ － Ε_κύκλου ＝ 400 － 314 ＝ <strong className="text-emerald-700 text-base">86 τ.εκ.</strong>
          </div>
          <p className="pt-1">Συνεπώς, το εμβαδόν του μαύρου χωρίου είναι <strong>86 τ.εκ.</strong> (Επιλογή <strong>Δ</strong>).</p>
        </div>
      )
    },
    {
      id: 16,
      officialNumber: 41,
      group: groupB,
      promptText: isEn
        ? 'We have two rods of lengths 160 cm and 96 cm and want to cut them into equal pieces so that the length of each piece of one rod equals the length of each piece of the other. What is the greatest possible length such a piece can have?'
        : 'Έχουμε δύο ράβδους με μήκη 160 εκ. και 96 εκ. και θέλουμε να τις κόψουμε σε ίσα κομμάτια ώστε το μήκος κάθε κομματιού της μιας να είναι ίσο με το μήκος κάθε κομματιού της άλλης. Ποιο είναι το μεγαλύτερο δυνατό μήκος που μπορεί να έχει ένα τέτοιο κομμάτι;',
      options: isEn
        ? [
            { key: 'A', label: '16 cm', raw: '16 cm' },
            { key: 'B', label: '24 cm', raw: '24 cm' },
            { key: 'C', label: '32 cm', raw: '32 cm' },
            { key: 'D', label: '36 cm', raw: '36 cm' }
          ]
        : [
            { key: 'A', label: '16 εκ.', raw: '16 εκ.' },
            { key: 'B', label: '24 εκ.', raw: '24 εκ.' },
            { key: 'Γ', label: '32 εκ.', raw: '32 εκ.' },
            { key: 'Δ', label: '36 εκ.', raw: '36 εκ.' }
          ],
      correctRaw: isEn ? '32 cm' : '32 εκ.',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            The greatest possible piece length equals the <strong>Greatest Common Divisor</strong> of the two lengths: <strong>GCD(160, 96)</strong>.
          </p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
            <div>• 160 ＝ 32 · 5</div>
            <div>• 96 ＝ 32 · 3</div>
            <div className="pt-1 font-bold text-emerald-800">➔ GCD(160, 96) ＝ 32 cm</div>
          </div>
          <p className="pt-1">Thus, the maximum length is <strong>32 cm</strong> (Choice <strong>C</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            Το μεγαλύτερο δυνατό μήκος κομματιού ισούται με τον <strong>Μέγιστο Κοινό Διαιρέτη</strong> των δύο μηκών: <strong>ΜΚΔ(160, 96)</strong>.
          </p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
            <div>• 160 ＝ 32 · 5</div>
            <div>• 96 ＝ 32 · 3</div>
            <div className="pt-1 font-bold text-emerald-800">➔ ΜΚΔ(160, 96) ＝ 32 εκ.</div>
          </div>
          <p className="pt-1">Άρα, το μέγιστο μήκος είναι <strong>32 εκ.</strong> (Επιλογή <strong>Γ</strong>).</p>
        </div>
      )
    },
    {
      id: 17,
      officialNumber: 42,
      group: groupB,
      promptText: isEn
        ? 'We can buy 18-liter containers costing 2.5 € each and 12-liter containers costing 1.70 € each. What is the lowest possible cost to package 300 liters of oil using some of the above containers?'
        : 'Μπορούμε να αγοράσουμε δοχεία 18 λίτρων με κόστος 2,5€ το ένα και δοχεία 12 λίτρων με κόστος 1,70€ το ένα. Ποιο είναι το μικρότερο δυνατό κόστος για να συσκευάσουμε 300 λίτρα λάδι αγοράζοντας κάποια από τα παραπάνω δοχεία;',
      options: isEn
        ? [
            { key: 'A', label: '40 €', raw: '40 €' },
            { key: 'B', label: '41.7 €', raw: '41.7 €' },
            { key: 'C', label: '42 €', raw: '42 €' },
            { key: 'D', label: '42.5 €', raw: '42.5 €' }
          ]
        : [
            { key: 'A', label: '40 €', raw: '40 €' },
            { key: 'B', label: '41,7 €', raw: '41,7 €' },
            { key: 'Γ', label: '42 €', raw: '42 €' },
            { key: 'Δ', label: '42,5 €', raw: '42,5 €' }
          ],
      correctRaw: isEn ? '41.7 €' : '41,7 €',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Compare the cost per liter:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• 18 L container:</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="2.5" den="18" /> ≈ <strong>0.1389 €/L</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• 12 L container:</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="1.70" den="12" /> ≈ <strong>0.1417 €/L</strong>
              </span>
            </div>
          </div>
          <p>It is more economical to use as many 18 L containers as possible:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Frac num="300" den="18" />
              <span>＝ 16 with remainder 12 liters.</span>
            </div>
            <div>• That is: <strong>16 containers of 18 L</strong> and <strong>1 container of 12 L</strong>.</div>
            <div>• Capacity check: 16 · 18 ＋ 1 · 12 ＝ 288 ＋ 12 ＝ 300 L ✅</div>
          </div>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            Cost ＝ 16 · 2.5 € ＋ 1 · 1.70 € ＝ 40 € ＋ 1.70 € ＝ <strong className="text-emerald-700 text-base">41.70 €</strong>
          </div>
          <p className="pt-1">Therefore, the lowest possible cost is <strong>41.7 €</strong> (Choice <strong>B</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Συγκρίνουμε το κόστος ανά λίτρο:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Δοχείο 18 L:</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="2,5" den="18" /> ≈ <strong>0,1389 €/L</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Δοχείο 12 L:</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="1,70" den="12" /> ≈ <strong>0,1417 €/L</strong>
              </span>
            </div>
          </div>
          <p>Συμφέρει να χρησιμοποιήσουμε όσο το δυνατόν περισσότερα δοχεία των 18 L:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Frac num="300" den="18" />
              <span>＝ 16 με υπόλοιπο 12 λίτρα.</span>
            </div>
            <div>• Δηλαδή: <strong>16 δοχεία των 18 L</strong> και <strong>1 δοχείο των 12 L</strong>.</div>
            <div>• Έλεγχος χωρητικότητας: 16 · 18 ＋ 1 · 12 ＝ 288 ＋ 12 ＝ 300 L ✅</div>
          </div>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            Κόστος ＝ 16 · 2,5 € ＋ 1 · 1,70 € ＝ 40 € ＋ 1,70 € ＝ <strong className="text-emerald-700 text-base">41,70 €</strong>
          </div>
          <p className="pt-1">Επομένως, το μικρότερο δυνατό κόστος είναι <strong>41,7 €</strong> (Επιλογή <strong>B</strong>).</p>
        </div>
      )
    },
    {
      id: 18,
      officialNumber: 43,
      group: groupB,
      promptText: isEn
        ? 'A cheese pie and a coffee cost 3.50 €, a coffee and a bottle of water cost 2 €, and a cheese pie and a bottle of water cost 2.10 €. How much will we pay if we buy one coffee, one cheese pie, and one bottle of water together?'
        : 'Μια τυρόπιτα κι ένας καφές κοστίζουν 3,50 €, ένας καφές κι ένα μπουκαλάκι νερό κοστίζουν 2 €, μια τυρόπιτα κι ένα μπουκαλάκι νερό κοστίζουν 2,10 €. Πόσο θα πληρώσουμε αν αγοράσουμε έναν καφέ, μια τυρόπιτα κι ένα μπουκαλάκι νερό μαζί;',
      options: isEn
        ? [
            { key: 'A', label: '3.30 €', raw: '3.30 €' },
            { key: 'B', label: '3.50 €', raw: '3.50 €' },
            { key: 'C', label: '3.60 €', raw: '3.60 €' },
            { key: 'D', label: '3.80 €', raw: '3.80 €' }
          ]
        : [
            { key: 'A', label: '3,30 €', raw: '3,30 €' },
            { key: 'B', label: '3,50 €', raw: '3,50 €' },
            { key: 'Γ', label: '3,60 €', raw: '3,60 €' },
            { key: 'Δ', label: '3,80 €', raw: '3,80 €' }
          ],
      correctRaw: isEn ? '3.80 €' : '3,80 €',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Let <strong>P</strong> be the cheese pie, <strong>C</strong> the coffee, and <strong>W</strong> the water:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
            <div>(1) P ＋ C ＝ 3.50 €</div>
            <div>(2) C ＋ W ＝ 2.00 €</div>
            <div>(3) P ＋ W ＝ 2.10 €</div>
          </div>
          <p>Add all 3 equations together:</p>
          <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>2·P ＋ 2·C ＋ 2·W ＝ 3.50 ＋ 2.00 ＋ 2.10</div>
            <div>2 · (P ＋ C ＋ W) ＝ 7.60 €</div>
            <div className="pt-1 font-bold text-emerald-800 flex items-center gap-1.5 flex-wrap">
              <span>P ＋ C ＋ W ＝</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="7.60" den="2" /> ＝ <strong>3.80 €</strong>
              </span>
            </div>
          </div>
          <p className="pt-1">Therefore, all three together cost <strong>3.80 €</strong> (Choice <strong>D</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Συμβολίζουμε με <strong>Τ</strong> την τυρόπιτα, <strong>Κ</strong> τον καφέ και <strong>Ν</strong> το νερό:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
            <div>(1) Τ ＋ Κ ＝ 3,50 €</div>
            <div>(2) Κ ＋ Ν ＝ 2,00 €</div>
            <div>(3) Τ ＋ Ν ＝ 2,10 €</div>
          </div>
          <p>Προσθέτουμε και τις 3 εξισώσεις <strong>κατά μέλη</strong>:</p>
          <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>2·Τ ＋ 2·Κ ＋ 2·Ν ＝ 3,50 ＋ 2,00 ＋ 2,10</div>
            <div>2 · (Τ ＋ Κ ＋ Ν) ＝ 7,60 €</div>
            <div className="pt-1 font-bold text-emerald-800 flex items-center gap-1.5 flex-wrap">
              <span>Τ ＋ Κ ＋ Ν ＝</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="7,60" den="2" /> ＝ <strong>3,80 €</strong>
              </span>
            </div>
          </div>
          <p className="pt-1">Συνεπώς, όλα μαζί κοστίζουν <strong>3,80 €</strong> (Επιλογή <strong>Δ</strong>).</p>
        </div>
      )
    },
    {
      id: 19,
      officialNumber: 44,
      group: groupB,
      promptText: isEn
        ? 'Three airlines A, B, and C charge 200 € for the round-trip route Athens – Thessaloniki – Athens. However, they have the following offers: A gives a bundle of 4 tickets for 780 € with a 5th one free; B gives a bundle of 3 tickets for 600 € with a 4th one free; while C gives a 25% discount on the 2nd ticket and a 30% discount on the 3rd ticket off the original price when buying 3 tickets together. Which airline or airlines have the cheapest offer to make 6 round trips Athens – Thessaloniki – Athens?'
        : 'Τρεις αεροπορικές εταιρείες Α, Β και Γ για το δρομολόγιο Αθήνα – Θεσσαλονίκη – Αθήνα χρεώνουν 200€. Όμως έχουν τις εξής προσφορές: Η Α δίνει πακέτο 4 εισιτήρια στην τιμή των 780€ και ένα 5ο δωρεάν, η Β δίνει πακέτο 3 εισιτήρια στην τιμή των 600€ και ένα 4ο δωρεάν ενώ η Γ δίνει στην αρχική τιμή έκπτωση 25% στο 2ο εισιτήριο και 30% στο 3ο εφόσον αγοράσουμε 3 εισιτήρια μαζί. Ποια ή ποιες εταιρείες έχουν την πιο οικονομική προσφορά για να κάνουμε 6 ταξίδια Αθήνα – Θεσσαλονίκη – Αθήνα;',
      options: isEn
        ? [
            { key: 'A', label: 'only A', raw: 'only A' },
            { key: 'B', label: 'only B', raw: 'only B' },
            { key: 'C', label: 'A and C', raw: 'A and C' },
            { key: 'D', label: 'all have the same cost', raw: 'all have the same cost' }
          ]
        : [
            { key: 'A', label: 'μόνο η Α', raw: 'μόνο η Α' },
            { key: 'B', label: 'μόνο η Β', raw: 'μόνο η Β' },
            { key: 'Γ', label: 'η Α και η Γ', raw: 'η Α και η Γ' },
            { key: 'Δ', label: 'όλες έχουν το ίδιο κόστος', raw: 'όλες έχουν το ίδιο κόστος' }
          ],
      correctRaw: isEn ? 'A and C' : 'η Α και η Γ',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Calculate the cost for <strong>6 tickets</strong> with each airline:</p>
          <div className="space-y-2 bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            <div>
              <strong>Airline A:</strong> 5 tickets (4 paid + 1 free) cost 780 €. For the 6th ticket we pay the regular price of 200 €.<br />
              ➔ Cost ＝ 780 ＋ 200 ＝ <strong className="text-emerald-700">980 €</strong>
            </div>
            <div className="pt-1">
              <strong>Airline B:</strong> 4 tickets (3 paid + 1 free) cost 600 €. The remaining 2 tickets cost 2 · 200 € ＝ 400 €.<br />
              ➔ Cost ＝ 600 ＋ 400 ＝ <strong>1,000 €</strong>
            </div>
            <div className="pt-1">
              <strong>Airline C:</strong> For each bundle of 3 tickets:<br />
              1st: 200 € | 2nd (-25%): 150 € | 3rd (-30%): 140 € ➔ Bundle ＝ 490 €.<br />
              For 6 tickets (2 bundles) ➔ 2 · 490 ＝ <strong className="text-emerald-700">980 €</strong>.
            </div>
          </div>
          <p className="pt-1">
            Both <strong>A and C</strong> tie at the lowest price of <strong>980 €</strong> (Choice <strong>C</strong>).
          </p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Υπολογίζουμε το κόστος για <strong>6 εισιτήρια</strong> σε κάθε εταιρεία:</p>
          <div className="space-y-2 bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            <div>
              <strong>Εταιρεία Α:</strong> 5 εισιτήρια (4 πληρωμένα + 1 δωρεάν) κοστίζουν 780 €. Για το 6ο εισιτήριο πληρώνουμε την κανονική τιμή 200 €.<br />
              ➔ Κόστος ＝ 780 ＋ 200 ＝ <strong className="text-emerald-700">980 €</strong>
            </div>
            <div className="pt-1">
              <strong>Εταιρεία Β:</strong> 4 εισιτήρια (3 πληρωμένα + 1 δωρεάν) κοστίζουν 600 €. Τα υπόλοιπα 2 εισιτήρια κοστίζουν 2 · 200 € ＝ 400 €.<br />
              ➔ Κόστος ＝ 600 ＋ 400 ＝ <strong>1.000 €</strong>
            </div>
            <div className="pt-1">
              <strong>Εταιρεία Γ:</strong> Για κάθε τριάδα εισιτηρίων:<br />
              1ο: 200 € | 2ο (-25%): 150 € | 3ο (-30%): 140 € ➔ Τριάδα ＝ 490 €.<br />
              Για 6 εισιτήρια (2 τριάδες) ➔ 2 · 490 ＝ <strong className="text-emerald-700">980 €</strong>.
            </div>
          </div>
          <p className="pt-1">
            Επομένως, <strong>η Α και η Γ</strong> έχουν την πιο οικονομική προσφορά με <strong>980 €</strong> (Επιλογή <strong>Γ</strong>).
          </p>
        </div>
      )
    },
    {
      id: 20,
      officialNumber: 45,
      group: groupB,
      promptText: isEn
        ? 'Worker A builds a stone wall in 12 days, while Worker B builds the same wall in 8 days. If Worker A works for 3 days on building the wall, how many days must Worker B then work to finish it?'
        : 'Ο εργάτης Α χτίζει μια μάντρα σε 12 ημέρες, ενώ ο εργάτης Β χτίζει την ίδια μάντρα σε 8 ημέρες. Αν ο εργάτης Α εργαστεί 3 ημέρες για να χτίσει τη μάντρα, πόσες ημέρες πρέπει να εργαστεί στη συνέχεια ο εργάτης Β, για να την τελειώσει;',
      options: [
        { key: 'A', label: '7', raw: '7' },
        { key: 'B', label: '5', raw: '5' },
        { key: isEn ? 'C' : 'Γ', label: '6', raw: '6' },
        { key: isEn ? 'D' : 'Δ', label: '9', raw: '9' }
      ],
      correctRaw: '6',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            1. In 1 day, Worker A completes <Frac num="1" den="12" /> of the job. In 3 days, Worker A completed:
          </p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 inline-flex items-center gap-1.5 whitespace-nowrap">
            <span>3 · <Frac num="1" den="12" /> ＝ <Frac num="3" den="12" /> ＝ <Frac num="1" den="4" /> of the job.</span>
          </div>
          <p>2. Remaining work to be finished:</p>
          <div className="bg-white/70 p-2 rounded-xl border border-slate-200/80 font-mono text-slate-900 inline-flex items-center gap-1.5 whitespace-nowrap">
            <span>1 － <Frac num="1" den="4" /> ＝ <Frac num="3" den="4" /> of the job.</span>
          </div>
          <p>3. Worker B finishes the whole job in 8 days. So for <Frac num="3" den="4" /> of the job, Worker B needs:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 inline-flex items-center gap-1.5 whitespace-nowrap">
            <Frac num="3" den="4" />
            <span>· 8 ＝ <Frac num="24" den="4" /> ＝ <strong className="text-emerald-700 text-base">6 days</strong></span>
          </div>
          <p className="pt-1">Therefore, Worker B must work <strong>6 days</strong> (Choice <strong>C</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            1. Σε 1 ημέρα ο εργάτης Α εκτελεί το <Frac num="1" den="12" /> του έργου. Στις 3 ημέρες εκτέλεσε:
          </p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 inline-flex items-center gap-1.5 whitespace-nowrap">
            <span>3 · <Frac num="1" den="12" /> ＝ <Frac num="3" den="12" /> ＝ <Frac num="1" den="4" /> του έργου.</span>
          </div>
          <p>2. Απομένει να ολοκληρωθεί το:</p>
          <div className="bg-white/70 p-2 rounded-xl border border-slate-200/80 font-mono text-slate-900 inline-flex items-center gap-1.5 whitespace-nowrap">
            <span>1 － <Frac num="1" den="4" /> ＝ <Frac num="3" den="4" /> του έργου.</span>
          </div>
          <p>3. Ο εργάτης Β τελειώνει όλο το έργο σε 8 ημέρες. Άρα για τα <Frac num="3" den="4" /> χρειάζεται:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 inline-flex items-center gap-1.5 whitespace-nowrap">
            <Frac num="3" den="4" />
            <span>· 8 ＝ <Frac num="24" den="4" /> ＝ <strong className="text-emerald-700 text-base">6 ημέρες</strong></span>
          </div>
          <p className="pt-1">Επομένως, ο εργάτης Β πρέπει να εργαστεί <strong>6 ημέρες</strong> (Επιλογή <strong>Γ</strong>).</p>
        </div>
      )
    },
    {
      id: 21,
      officialNumber: 46,
      group: groupB,
      promptText: isEn ? (
        <span>
          Kostas and Giannis are at the two ends of a path and start walking toward each other. When Kostas has walked <Frac num="3" den="5" /> of the path, the distance between them is equal to <Frac num="1" den="2" /> of the path. What fraction of the path has Giannis walked?
        </span>
      ) : (
        <span>
          Ο Κώστας και ο Γιάννης βρίσκονται στις δύο άκρες ενός μονοπατιού και ξεκινούν να περπατάνε ο ένας προς τον άλλο. Όταν ο Κώστας έχει διανύσει τα <Frac num="3" den="5" /> του μονοπατιού η απόστασή τους είναι ίση με το <Frac num="1" den="2" /> του μονοπατιού. Τι μέρος του μονοπατιού έχει διανύσει ο Γιάννης;
        </span>
      ),
      options: [
        { key: 'A', label: <Frac num="9" den="10" />, raw: '9/10' },
        { key: 'B', label: <Frac num="3" den="5" />, raw: '3/5' },
        { key: isEn ? 'C' : 'Γ', label: <Frac num="2" den="5" />, raw: '2/5' },
        { key: isEn ? 'D' : 'Δ', label: <Frac num="1" den="10" />, raw: '1/10' }
      ],
      correctRaw: '9/10',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Let 1 be the total length of the path.</p>
          <p>
            Notice that <Frac num="3" den="5" /> ＋ <Frac num="1" den="2" /> ＝ <Frac num="6" den="10" /> ＋ <Frac num="5" den="10" /> ＝ <Frac num="11" den="10" /> &gt; 1, which means they have already <strong>crossed paths</strong> and are moving away from each other!
          </p>
          <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>Kostas&apos;s distance ＋ Giannis&apos;s distance ＝ 1 ＋ <Frac num="1" den="2" /></div>
            <div><Frac num="6" den="10" /> ＋ Giannis ＝ <Frac num="15" den="10" /></div>
            <div className="pt-1 text-emerald-800 font-bold flex items-center gap-1.5 flex-wrap">
              <span>Giannis ＝</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="15" den="10" /> － <Frac num="6" den="10" /> ＝ <Frac num="9" den="10" />
              </span>
            </div>
          </div>
          <p className="pt-1">
            Therefore, Giannis has walked <strong><Frac num="9" den="10" /></strong> of the path (Choice <strong>A</strong>).
          </p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Έστω 1 το συνολικό μήκος του μονοπατιού.</p>
          <p>
            Παρατηρούμε ότι <Frac num="3" den="5" /> ＋ <Frac num="1" den="2" /> ＝ <Frac num="6" den="10" /> ＋ <Frac num="5" den="10" /> ＝ <Frac num="11" den="10" /> &gt; 1, που σημαίνει ότι έχουν ήδη <strong>διασταυρωθεί</strong> και απομακρύνονται!
          </p>
          <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>Διαδρομή Κώστα ＋ Διαδρομή Γιάννη ＝ 1 ＋ <Frac num="1" den="2" /></div>
            <div><Frac num="6" den="10" /> ＋ Γιάννης ＝ <Frac num="15" den="10" /></div>
            <div className="pt-1 text-emerald-800 font-bold flex items-center gap-1.5 flex-wrap">
              <span>Γιάννης ＝</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="15" den="10" /> － <Frac num="6" den="10" /> ＝ <Frac num="9" den="10" />
              </span>
            </div>
          </div>
          <p className="pt-1">
            Συνεπώς, ο Γιάννης έχει διανύσει τα <strong><Frac num="9" den="10" /></strong> του μονοπατιού (Επιλογή <strong>A</strong>).
          </p>
        </div>
      )
    },
    {
      id: 22,
      officialNumber: 47,
      group: groupB,
      promptText: isEn
        ? 'Three cheese pies and two juices cost as much as two spinach pies and three juices. If each juice is 20 cents cheaper than each cheese pie, then compared to a cheese pie, a spinach pie is:'
        : 'Τρεις τυρόπιτες και δύο χυμοί κοστίζουν όσο δύο σπανακόπιτες και τρεις χυμοί. Αν ο κάθε χυμός είναι 20 λεπτά φτηνότερος από την κάθε τυρόπιτα, τότε η σπανακόπιτα είναι από την τυρόπιτα:',
      options: isEn
        ? [
            { key: 'A', label: '20 cents more expensive', raw: '20 cents more expensive' },
            { key: 'B', label: '20 cents cheaper', raw: '20 cents cheaper' },
            { key: 'C', label: '10 cents more expensive', raw: '10 cents more expensive' },
            { key: 'D', label: '10 cents cheaper', raw: '10 cents cheaper' }
          ]
        : [
            { key: 'A', label: '20 λεπτά ακριβότερη', raw: '20 λεπτά ακριβότερη' },
            { key: 'B', label: '20 λεπτά φτηνότερη', raw: '20 λεπτά φτηνότερη' },
            { key: 'Γ', label: '10 λεπτά ακριβότερη', raw: '10 λεπτά ακριβότερη' },
            { key: 'Δ', label: '10 λεπτά φτηνότερη', raw: '10 λεπτά φτηνότερη' }
          ],
      correctRaw: isEn ? '10 cents more expensive' : '10 λεπτά ακριβότερη',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Let <strong>C</strong> be a cheese pie, <strong>S</strong> a spinach pie, and <strong>J</strong> a juice.</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• 3C ＋ 2J ＝ 2S ＋ 3J</div>
            <div>• Subtract 2J from both sides: <strong>3C ＝ 2S ＋ J</strong></div>
            <div>• We know juice is 20 cents cheaper than cheese pie: <strong>J ＝ C － 20</strong></div>
          </div>
          <p>Substitute J into the equation:</p>
          <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>3C ＝ 2S ＋ (C － 20)</div>
            <div>3C － C ＋ 20 ＝ 2S</div>
            <div>2C ＋ 20 ＝ 2S</div>
            <div className="pt-1 text-emerald-800 font-bold">S ＝ C ＋ 10 cents</div>
          </div>
          <p className="pt-1">Thus, a spinach pie is <strong>10 cents more expensive</strong> than a cheese pie (Choice <strong>C</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Συμβολίζουμε με <strong>Τ</strong> την τυρόπιτα, <strong>Σ</strong> τη σπανακόπιτα και <strong>Χ</strong> τον χυμό.</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• 3Τ ＋ 2Χ ＝ 2Σ ＋ 3Χ</div>
            <div>• Αφαιρούμε 2Χ και από τα δύο μέλη: <strong>3Τ ＝ 2Σ ＋ Χ</strong></div>
            <div>• Γνωρίζουμε ότι ο χυμός είναι 20 λεπτά φθηνότερος από την τυρόπιτα: <strong>Χ ＝ Τ － 20</strong></div>
          </div>
          <p>Αντικαθιστούμε το Χ στην πρώτη ισότητα:</p>
          <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>3Τ ＝ 2Σ ＋ (Τ － 20)</div>
            <div>3Τ － Τ ＋ 20 ＝ 2Σ</div>
            <div>2Τ ＋ 20 ＝ 2Σ</div>
            <div className="pt-1 text-emerald-800 font-bold">Σ ＝ Τ ＋ 10 λεπτά</div>
          </div>
          <p className="pt-1">Άρα, η σπανακόπιτα είναι <strong>10 λεπτά ακριβότερη</strong> από την τυρόπιτα (Επιλογή <strong>Γ</strong>).</p>
        </div>
      )
    },
    {
      id: 23,
      officialNumber: 48,
      group: groupB,
      promptText: isEn ? (
        <span>
          On a trip, we used <Frac num="1" den="4" /> of the fuel capacity of our car&apos;s tank when full. If before the trip the tank had 45 liters of fuel and after the trip the tank was half full, how many liters of fuel does our car&apos;s tank hold in total?
        </span>
      ) : (
        <span>
          Σε ένα ταξίδι καταναλώσαμε το <Frac num="1" den="4" /> της βενζίνης που χωράει η δεξαμενή του αυτοκινήτου μας, όταν είναι γεμάτη. Αν πριν το ταξίδι η δεξαμενή είχε 45 λίτρα βενζίνης και μετά το ταξίδι ήταν γεμάτη η μισή δεξαμενή, πόσα λίτρα βενζίνης χωράει συνολικά η δεξαμενή του αυτοκινήτου μας;
        </span>
      ),
      options: isEn
        ? [
            { key: 'A', label: '90', raw: '90' },
            { key: 'B', label: '45', raw: '45' },
            { key: 'C', label: '60', raw: '60' },
            { key: 'D', label: 'cannot be calculated', raw: 'cannot be calculated' }
          ]
        : [
            { key: 'A', label: '90', raw: '90' },
            { key: 'B', label: '45', raw: '45' },
            { key: 'Γ', label: '60', raw: '60' },
            { key: 'Δ', label: 'δεν μπορούμε να υπολογίσουμε', raw: 'δεν μπορούμε να υπολογίσουμε' }
          ],
      correctRaw: '60',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Let <strong>C</strong> be the total capacity of the fuel tank.</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Initial amount ＝ 45 liters</div>
            <div>• Fuel consumed ＝ <Frac num="1" den="4" /> · C</div>
            <div>• Final amount ＝ <Frac num="1" den="2" /> · C</div>
          </div>
          <p>Set up the equation:</p>
          <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>45 － <Frac num="1" den="4" /> · C ＝ <Frac num="1" den="2" /> · C</div>
            <div>45 ＝ <Frac num="1" den="2" /> · C ＋ <Frac num="1" den="4" /> · C</div>
            <div>45 ＝ <Frac num="3" den="4" /> · C</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>C ＝ 45 · <Frac num="4" den="3" /></span>
              <span className="whitespace-nowrap">＝ 15 · 4 ＝ <strong className="text-emerald-700 text-base">60 liters</strong></span>
            </div>
          </div>
          <p className="pt-1">Therefore, the tank holds <strong>60 liters</strong> (Choice <strong>C</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Έστω <strong>C</strong> η συνολική χωρητικότητα της δεξαμενής.</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Αρχική ποσότητα ＝ 45 λίτρα</div>
            <div>• Κατανάλωση ＝ <Frac num="1" den="4" /> · C</div>
            <div>• Τελική ποσότητα ＝ <Frac num="1" den="2" /> · C</div>
          </div>
          <p>Δημιουργούμε την εξίσωση:</p>
          <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>45 － <Frac num="1" den="4" /> · C ＝ <Frac num="1" den="2" /> · C</div>
            <div>45 ＝ <Frac num="1" den="2" /> · C ＋ <Frac num="1" den="4" /> · C</div>
            <div>45 ＝ <Frac num="3" den="4" /> · C</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>C ＝ 45 · <Frac num="4" den="3" /></span>
              <span className="whitespace-nowrap">＝ 15 · 4 ＝ <strong className="text-emerald-700 text-base">60 λίτρα</strong></span>
            </div>
          </div>
          <p className="pt-1">Επομένως, η δεξαμενή χωράει <strong>60 λίτρα</strong> (Επιλογή <strong>Γ</strong>).</p>
        </div>
      )
    },
    {
      id: 24,
      officialNumber: 49,
      group: groupB,
      promptText: isEn
        ? 'All the children of an elementary school each took one juice. The bar chart shows the percentages of children by juice flavor. Twice as many children took apple as took sour cherry. Half as many children took pear as took sour cherry. 15% more children took orange than took peach. What percentage of children took sour cherry juice?'
        : 'Όλα τα παιδιά ενός Δημοτικού Σχολείου πήραν από ένα χυμό. Στο διάγραμμα φαίνονται τα ποσοστά των παιδιών ανά γεύση χυμού. Μήλο πήραν τα διπλάσια παιδιά από όσα πήραν βύσσινο. Αχλάδι πήραν τα μισά από όσα πήραν βύσσινο. Πορτοκάλι πήραν 15% περισσότερα παιδιά από αυτά που πήραν ροδάκινο. Τι ποσοστό των παιδιών πήρε χυμό βύσσινο;',
      hasSvg: 'juiceChart49',
      options: [
        { key: 'A', label: '20%', raw: '20%' },
        { key: 'B', label: '10%', raw: '10%' },
        { key: isEn ? 'C' : 'Γ', label: '5%', raw: '5%' },
        { key: isEn ? 'D' : 'Δ', label: '25%', raw: '25%' }
      ],
      correctRaw: '10%',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            From the bar chart, we read the 5 bar percentage values: <strong>25%, 20%, 40%, 10%, 5%</strong> (sum = 100%).
          </p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>• Let <strong>C</strong> be the percentage for Sour Cherry.</div>
            <div>• Apple ＝ 2 · C (double)</div>
            <div>• Pear ＝ <Frac num="C" den="2" /> (half)</div>
            <div className="pt-1 text-slate-700">
              We look for a value C from &#123;5, 10, 20, 25, 40&#125; such that both 2·C and <Frac num="C" den="2" /> exist in the chart:
            </div>
            <div className="text-emerald-800 font-bold">
              ➔ If Sour Cherry ＝ 10%, then Apple ＝ 20% and Pear ＝ 5%. All three appear on the chart!
            </div>
            <div>• The remaining two bars are 40% and 25%: difference 40% － 25% ＝ 15% (Orange 40%, Peach 25% ✅).</div>
          </div>
          <p className="pt-1">Therefore, <strong>10%</strong> of the children took sour cherry juice (Choice <strong>B</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            Από το ραβδόγραμμα παρατηρούμε τις 5 στήλες με τις εξής ποσοστιαίες τιμές: <strong>25%, 20%, 40%, 10%, 5%</strong> (σύνολο 100%).
          </p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>• Έστω <strong>Β</strong> το ποσοστό για το Βύσσινο.</div>
            <div>• Μήλο ＝ 2 · Β (διπλάσιο)</div>
            <div>• Αχλάδι ＝ <Frac num="Β" den="2" /> (μισό)</div>
            <div className="pt-1 text-slate-700">
              Αναζητούμε μια τιμή Β από τις στήλες &#123;5, 10, 20, 25, 40&#125; ώστε να υπάρχουν και τα ποσοστά 2·Β και <Frac num="Β" den="2" />:
            </div>
            <div className="text-emerald-800 font-bold">
              ➔ Αν Βύσσινο ＝ 10%, τότε Μήλο ＝ 20% και Αχλάδι ＝ 5%. Όλα υπάρχουν στο γράφημα!
            </div>
            <div>• Τα άλλα δύο ποσοστά είναι 40% και 25%: διαφορά 40% － 25% ＝ 15% (Πορτοκάλι 40%, Ροδάκινο 25% ✅).</div>
          </div>
          <p className="pt-1">Συνεπώς, χυμό βύσσινο πήρε το <strong>10%</strong> των παιδιών (Επιλογή <strong>B</strong>).</p>
        </div>
      )
    },
    {
      id: 25,
      officialNumber: 50,
      group: groupB,
      promptText: isEn
        ? 'If the distance from the port of Karpathos to the port of Nisyros is approximately 123 kilometers, what is the distance, rounded to the nearest ten, from the port of Nisyros to the port of Astypalaia? (the port locations are marked with white dots)'
        : 'Αν η απόσταση από το λιμάνι της Καρπάθου έως το λιμάνι της Νισύρου είναι περίπου 123 χιλιόμετρα, ποια είναι, στρογγυλοποιημένη στη δεκάδα, η απόσταση από το λιμάνι της Νισύρου έως το λιμάνι της Αστυπάλαιας; (οι θέσεις των λιμανιών είναι σημειωμένες με λευκές κουκίδες)',
      hasSvg: 'islandsMap50',
      options: isEn
        ? [
            { key: 'A', label: '80 km', raw: '80 km' },
            { key: 'B', label: '70 km', raw: '70 km' },
            { key: 'C', label: '60 km', raw: '60 km' },
            { key: 'D', label: '50 km', raw: '50 km' }
          ]
        : [
            { key: 'A', label: '80 χλμ', raw: '80 χλμ' },
            { key: 'B', label: '70 χλμ', raw: '70 χλμ' },
            { key: 'Γ', label: '60 χλμ', raw: '60 χλμ' },
            { key: 'Δ', label: '50 χλμ', raw: '50 χλμ' }
          ],
      correctRaw: isEn ? '70 km' : '70 χλμ',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Compare the straight-line distances on the map:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Distance Karpathos – Nisyros: approx. 123 km (corresponds to d₁ map units).</div>
            <div>• Distance Nisyros – Astypalaia: d₂ ≈ 0.58 · d₁ on the map.</div>
            <div>• Calculation: 123 · 0.58 ≈ <strong>71.3 km</strong>.</div>
          </div>
          <p className="pt-1">Rounding to the nearest ten, the distance is <strong>70 km</strong> (Choice <strong>B</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Συγκρίνουμε τις ευθύγραμμες αποστάσεις στον χάρτη:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Απόσταση Κάρπαθος – Νίσυρος: περίπου 123 χλμ (αντιστοιχεί σε d₁ μονάδες χάρτη).</div>
            <div>• Απόσταση Νίσυρος – Αστυπάλαια: d₂ ≈ 0,58 · d₁ στον χάρτη.</div>
            <div>• Υπολογισμός: 123 · 0,58 ≈ <strong>71,3 χλμ</strong>.</div>
          </div>
          <p className="pt-1">Στρογγυλοποιώντας στην πλησιέστερη δεκάδα, η απόσταση είναι <strong>70 χλμ</strong> (Επιλογή <strong>B</strong>).</p>
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

export default function Themata2024Page() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const isEn = locale === 'en';
  const t = I18N[locale];
  const questions = getQuestions2024(locale);

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

  const schema2024 = [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": t.schemaHome, "item": `${baseUrl}/` },
        { "@type": "ListItem", "position": 2, "name": t.schemaHub, "item": `${baseUrl}/protipa/protipa` },
        { "@type": "ListItem", "position": 3, "name": t.schemaCurrent, "item": `${baseUrl}/protipa/themata-2024` }
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
    if (q.hasSvg === 'axis31') {
      const [l0, l1, l2, l3] = t.axis31Labels;
      return (
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 my-3">
          <svg
            viewBox="0 0 380 90"
            className="w-full max-w-[380px] h-auto select-none font-mono mx-auto block"
            role="img"
            aria-label={t.axis31Aria}
          >
            <line x1="20" y1="45" x2="350" y2="45" stroke="#334155" strokeWidth="2" />
            <polygon points="350,40 360,45 350,50" fill="#334155" />
            <line x1="40" y1="37" x2="40" y2="53" stroke="#475569" strokeWidth="2" />
            <text x="40" y="70" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#1e293b">{l0}</text>
            <line x1="120" y1="37" x2="120" y2="53" stroke="#2563eb" strokeWidth="2" />
            <text x="120" y="70" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#2563eb">{l1}</text>
            <line x1="200" y1="37" x2="200" y2="53" stroke="#475569" strokeWidth="2" />
            <text x="200" y="70" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#1e293b">{l2}</text>
            <line x1="280" y1="37" x2="280" y2="53" stroke="#dc2626" strokeWidth="2" />
            <text x="280" y="70" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#dc2626">{l3}</text>
          </svg>
        </div>
      );
    }

    if (q.hasTable === 'timetable36') {
      return (
        <div className="my-3">
          <table
            className="w-full table-fixed text-xs sm:text-sm border-collapse bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 text-center"
            aria-label={t.timetableAria}
          >
            <thead>
              <tr className="bg-slate-200/80 text-slate-800 font-black">
                <th className="p-2.5 border-b border-slate-200 w-1/3">{t.timetableHourHeader}</th>
                <th className="p-2.5 border-b border-slate-200 w-2/3">{t.timetableDurHeader}</th>
              </tr>
            </thead>
            <tbody>
              {t.timetableRows.map((row, idx) => (
                <tr key={idx} className={idx < t.timetableRows.length - 1 ? 'border-b border-slate-100' : ''}>
                  <td className="p-2 font-bold">{row.period}</td>
                  <td className="p-2 font-mono">{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (q.hasSvg === 'squareSemicircles40') {
      return (
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 my-3">
          <svg
            viewBox="0 0 180 180"
            className="w-full max-w-[180px] h-auto select-none font-sans mx-auto block"
            role="img"
            aria-label={t.semicirclesAria}
          >
            <rect x="20" y="20" width="140" height="140" fill="#0f172a" stroke="#0f172a" strokeWidth="2" />
            <path d="M 20,20 A 70,70 0 0,1 20,160 Z" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
            <path d="M 160,20 A 70,70 0 0,0 160,160 Z" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
          </svg>
        </div>
      );
    }

    if (q.hasSvg === 'juiceChart49') {
      return (
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 my-3">
          <svg
            viewBox="0 0 340 180"
            className="w-full max-w-[340px] h-auto select-none font-mono mx-auto block"
            role="img"
            aria-label={t.juiceAria}
          >
            {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45].map((val) => {
              const y = 145 - (val / 45) * 125;
              return (
                <g key={val}>
                  <line x1="35" y1={y} x2="320" y2={y} stroke="#e2e8f0" strokeWidth="1" />
                  <text x="28" y={y + 3.5} fontSize="9" fontWeight="bold" textAnchor="end" fill="#64748b">{val}</text>
                </g>
              );
            })}
            {[25, 20, 40, 10, 5].map((val, idx) => {
              const x = 55 + idx * 52;
              const h = (val / 45) * 125;
              const y = 145 - h;
              return (
                <rect key={idx} x={x} y={y} width="30" height={h} fill="#1e293b" rx="2" />
              );
            })}
          </svg>
        </div>
      );
    }

    if (q.hasSvg === 'islandsMap50') {
      const L = t.islandsLabels;
      return (
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 my-3">
          <svg
            viewBox="0 0 300 200"
            className="w-full max-w-[300px] h-auto select-none font-sans bg-slate-900 rounded-xl mx-auto block"
            role="img"
            aria-label={t.islandsAria}
          >
            <circle cx="70" cy="55" r="4" fill="#ffffff" />
            <text x="70" y="45" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#94a3b8">{L.astypalaia}</text>
            <circle cx="160" cy="40" r="3" fill="#cbd5e1" />
            <text x="160" y="30" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#64748b">{L.kos}</text>
            <circle cx="165" cy="75" r="4" fill="#ffffff" />
            <text x="195" y="78" fontSize="10" fontWeight="bold" fill="#f8fafc">{L.nisyros}</text>
            <circle cx="190" cy="110" r="3" fill="#cbd5e1" />
            <text x="215" y="113" fontSize="9" fontWeight="bold" fill="#64748b">{L.tilos}</text>
            <circle cx="150" cy="170" r="4" fill="#ffffff" />
            <text x="150" y="188" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#f8fafc">{L.karpathos}</text>
            <line x1="165" y1="75" x2="150" y2="170" stroke="#38bdf8" strokeWidth="1.8" strokeDasharray="3 3" />
            <line x1="165" y1="75" x2="70" y2="55" stroke="#f43f5e" strokeWidth="1.8" strokeDasharray="3 3" />
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
      schemaData={schema2024}
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