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
    metaTitle: 'Θέματα Προτύπων 2025 – Επίσημα Θέματα & Αναλυτικές Λύσεις | LearnMaths.gr',
    metaDesc: 'Λύσε online τα 20 επίσημα θέματα Μαθηματικών για τα Πρότυπα Γυμνάσια 2025 (21–40), με χρονόμετρο 60 λεπτών, αυτόματη βαθμολόγηση και αναλυτικές λύσεις.',
    backText: 'Θέματα Προτύπων',
    heroBadge: 'Επίσημα Θέματα 2025 • 20 Ερωτήσεις Μαθηματικών',
    heroTitle: 'Θέματα Προτύπων Γυμνασίων 2025 – Online Τεστ & Λύσεις',
    heroSubtitle: 'Εξασκήσου στα επίσημα θέματα Μαθηματικών των εξετάσεων εισαγωγής στα Πρότυπα Γυμνάσια 2025. Περιλαμβάνει και τα 20 θέματα (21–40) με αυτόματη βαθμολόγηση (2 μόρια τα πρώτα 10, 3 μόρια τα επόμενα 10, Άριστα: 50), χρονόμετρο 60 λεπτών και αναλυτικές λύσεις με σχήματα.',
    answeredLabel: 'Απαντημένες:',
    of20: 'από 20',
    scoringLabel: 'Βαθμολογία:',
    scoringValue: '2 μόρια (Θ. 21–30) & 3 μόρια (Θ. 31–40) • Άριστα: 50',
    timerOn: '⏳ Χρονόμετρο: 60 λεπτά',
    timerOff: '⏳ Χρονόμετρο: Ανενεργό',
    resultTitle: 'Αποτέλεσμα Εξέτασης Προτύπων 2025',
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
    // Visuals & Tables
    table23Aria: 'Πίνακας τιμών και εκπτώσεων μπλούζας σε 4 καταστήματα',
    table23Headers: ['Κατάστημα', 'Αρχική τιμή Μπλούζας', 'Έκπτωση ως ποσοστό της αρχικής τιμής'],
    table23Rows: [
      { shop: 'Της Αλίνας', price: '50 ευρώ', disc: '20%' },
      { shop: 'Του Βασίλη', price: '45 ευρώ', disc: '15%' },
      { shop: 'Της Γιάννας', price: '45 ευρώ', disc: '10%' },
      { shop: 'Του Δημοσθένη', price: '40 ευρώ', disc: '10%' }
    ],
    table25Aria: 'Πίνακας ποσοστών επιλογής αθλήματος ανά φύλο',
    table25Headers: ['Άθλημα', 'Αγόρια', 'Κορίτσια'],
    table25Rows: [
      { sport: 'Βόλεϊ', boys: '5,5%', girls: '29,5%' },
      { sport: 'Ποδόσφαιρο', boys: '29,5%', girls: '6,5%' },
      { sport: 'Μπάσκετ', boys: '17%', girls: ';' }
    ],
    foodChartAria: 'Ραβδόγραμμα ποσοστών προτίμησης τροφών των μαθητών',
    foodCols: [
      { lines: ['Αυγό', 'κότας'], val: 15, isAnimal: true },
      { lines: ['Γάλα', 'αγελάδας'], val: 15, isAnimal: true },
      { lines: ['Ελιές'], val: 5, isAnimal: false },
      { lines: ['Ντομάτα'], val: 5, isAnimal: false },
      { lines: ['Κρέας'], val: 5, isAnimal: true },
      { lines: ['Ρεβύθια'], val: 10, isAnimal: false },
      { lines: ['Κατσικίσιο', 'τυρί'], val: 25, isAnimal: true },
      { lines: ['Φυστίκια'], val: 20, isAnimal: false }
    ],
    cube34Aria: 'Τρισδιάστατος κύβος 3x3x3 με εναλλάξ άσπρα και μαύρα κυβάκια',
    squares36Aria: 'Τετράγωνο χωρισμένο σε 5 ίσα μικρότερα τετράγωνα με το κεντρικό σκιασμένο',
    grid38Aria: 'Ορθογώνιο χωρισμένο σε 9 μικρότερα ορθογώνια με σημειωμένα τα Α, Β και Γ',
    grid38Labels: ['Α', 'Β', 'Γ'],
    building40Aria: 'Πρόσοψη τριώροφου κτιρίου με αποστάσεις 430 εκ. και 150 εκ. μεταξύ παραθύρων',
    b430: '430 εκ.',
    b150: '150 εκ.',
    bWindow: 'ΠΑΡΑΘΥΡΟ',
    // Schema
    schemaHome: 'Αρχική',
    schemaHub: 'Ενδεικτικά Θέματα Προτύπων 2026',
    schemaCurrent: 'Θέματα Προτύπων Γυμνασίων 2025',
    schemaQuizName: 'Επίσημα Θέματα Μαθηματικών Προτύπων Γυμνασίων 2025 (Με Λύσεις)',
    schemaQuizDesc: 'Διαδραστικό τεστ με τα 20 επίσημα θέματα Μαθηματικών των εξετάσεων εισαγωγής στα Πρότυπα Γυμνάσια 2025 (21–40), χρονόμετρο 60 λεπτών, αυτόματη βαθμολόγηση (0–50) και αναλυτικές λύσεις.',
    schemaEduLevel: "ΣΤ' Δημοτικού",
    schemaQuestionName: (num) => `Θέμα ${num} - Πρότυπα 2025`
  },
  en: {
    metaTitle: 'Model School 2025 Math Past Paper – Online Test & Solutions | LearnMaths.gr',
    metaDesc: 'Practice online with the 20 official Mathematics questions from the 2025 Model Middle School entrance exam (21–40), 60-minute timer, auto-grading, and full solutions.',
    backText: 'Model School Exams',
    heroBadge: 'Official 2025 Exam • 20 Mathematics Questions',
    heroTitle: 'Model Middle Schools 2025 Math Exam – Online Test & Solutions',
    heroSubtitle: 'Practice with the official Mathematics questions from the 2025 Model Middle School entrance exams. Includes all 20 questions (21–40) with automatic scoring (2 points for the first 10, 3 points for the next 10, Max: 50), a 60-minute timer, and detailed solutions with diagrams.',
    answeredLabel: 'Answered:',
    of20: 'of 20',
    scoringLabel: 'Scoring:',
    scoringValue: '2 pts (Q21–30) & 3 pts (Q31–40) • Max: 50',
    timerOn: '⏳ Timer: 60 minutes',
    timerOff: '⏳ Timer: Disabled',
    resultTitle: '2025 Model School Exam Results',
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
    // Visuals & Tables
    table23Aria: 'Table of shirt original prices and discounts across 4 stores',
    table23Headers: ['Store', 'Original Shirt Price', 'Discount as % of Original Price'],
    table23Rows: [
      { shop: "Alina's", price: '50 euros', disc: '20%' },
      { shop: "Vasilis's", price: '45 euros', disc: '15%' },
      { shop: "Gianna's", price: '45 euros', disc: '10%' },
      { shop: "Dimosthenis's", price: '40 euros', disc: '10%' }
    ],
    table25Aria: 'Table of sport selection percentages by gender',
    table25Headers: ['Sport', 'Boys', 'Girls'],
    table25Rows: [
      { sport: 'Volleyball', boys: '5.5%', girls: '29.5%' },
      { sport: 'Football', boys: '29.5%', girls: '6.5%' },
      { sport: 'Basketball', boys: '17%', girls: '?' }
    ],
    foodChartAria: 'Bar chart showing percentages of students preferring each lunch item',
    foodCols: [
      { lines: ['Chicken', 'egg'], val: 15, isAnimal: true },
      { lines: ['Cow', 'milk'], val: 15, isAnimal: true },
      { lines: ['Olives'], val: 5, isAnimal: false },
      { lines: ['Tomato'], val: 5, isAnimal: false },
      { lines: ['Meat'], val: 5, isAnimal: true },
      { lines: ['Chickpeas'], val: 10, isAnimal: false },
      { lines: ['Goat', 'cheese'], val: 25, isAnimal: true },
      { lines: ['Peanuts'], val: 20, isAnimal: false }
    ],
    cube34Aria: '3x3x3 cube with alternating white and black small cubes',
    squares36Aria: 'Large square containing 5 smaller equal squares with the center one shaded',
    grid38Aria: 'Rectangle subdivided into 9 smaller rectangles with A, B, and C marked',
    grid38Labels: ['A', 'B', 'C'],
    building40Aria: 'Three-story building facade showing 430 cm and 150 cm distances between windows',
    b430: '430 cm',
    b150: '150 cm',
    bWindow: 'WINDOW',
    // Schema
    schemaHome: 'Home',
    schemaHub: 'Model School Entrance 2026 Prep',
    schemaCurrent: 'Model Middle Schools 2025 Exam',
    schemaQuizName: 'Official 2025 Model Middle School Mathematics Exam (With Solutions)',
    schemaQuizDesc: 'Interactive practice test featuring all 20 official Mathematics questions from the 2025 Model Middle School entrance examination (21–40), 60-minute timer, automatic grading (0–50), and detailed solutions.',
    schemaEduLevel: 'Grade 6',
    schemaQuestionName: (num) => `Question ${num} - Model Schools 2025`
  }
};

function getQuestions2025(locale) {
  const isEn = locale === 'en';
  const groupA = isEn ? 'GROUP A (4 CHOICES)' : 'ΟΜΑΔΑ Α (4 ΕΠΙΛΟΓΕΣ)';
  const groupB = isEn ? 'GROUP B (5 CHOICES)' : 'ΟΜΑΔΑ Β (5 ΕΠΙΛΟΓΕΣ)';

  return [
    {
      id: 1,
      officialNumber: 21,
      group: groupA,
      promptText: isEn
        ? 'Which of the following numerical expressions has the greatest value?'
        : 'Ποια από τις παρακάτω αριθμητικές παραστάσεις έχει τη μεγαλύτερη τιμή;',
      options: [
        { key: 'A', label: <span className="font-mono whitespace-nowrap">11 ＋ <Frac num="2" den="3" /> － <Frac num="1" den="5" /></span>, raw: '11 + 2/3 - 1/5' },
        { key: 'B', label: <span className="font-mono whitespace-nowrap">11 ＋ <Frac num="1" den="2" /> － <Frac num="1" den="5" /></span>, raw: '11 + 1/2 - 1/5' },
        { key: isEn ? 'C' : 'Γ', label: <span className="font-mono whitespace-nowrap">11 ＋ <Frac num="3" den="4" /> － <Frac num="1" den="5" /></span>, raw: '11 + 3/4 - 1/5' },
        { key: isEn ? 'D' : 'Δ', label: <span className="font-mono whitespace-nowrap">11 ＋ <Frac num="3" den="4" /> － <Frac num="1" den="3" /></span>, raw: '11 + 3/4 - 1/3' }
      ],
      correctRaw: '11 + 3/4 - 1/5',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            All expressions start with <strong>11</strong>, so we can set 11 aside and compare only the fractional parts of each option:
          </p>
          <div className="space-y-2.5 bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-slate-900 w-5">A:</span>
              <span className="inline-flex items-center gap-1 whitespace-nowrap"><Frac num="2" den="3" /> － <Frac num="1" den="5" /></span>
              <span className="inline-flex items-center gap-1 whitespace-nowrap">＝ <Frac num="10" den="15" /> － <Frac num="3" den="15" /></span>
              <span className="inline-flex items-center gap-1 whitespace-nowrap">＝ <Frac num="7" den="15" /></span>
              <span className="text-slate-500 text-xs">(≈ 0.467 &lt; 0.5)</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-slate-900 w-5">B:</span>
              <span className="inline-flex items-center gap-1 whitespace-nowrap"><Frac num="1" den="2" /> － <Frac num="1" den="5" /></span>
              <span className="inline-flex items-center gap-1 whitespace-nowrap">＝ <Frac num="5" den="10" /> － <Frac num="2" den="10" /></span>
              <span className="inline-flex items-center gap-1 whitespace-nowrap">＝ <Frac num="3" den="10" /></span>
              <span className="text-slate-500 text-xs">(＝ 0.3 &lt; 0.5)</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-emerald-700 w-5">C:</span>
              <span className="inline-flex items-center gap-1 whitespace-nowrap"><Frac num="3" den="4" /> － <Frac num="1" den="5" /></span>
              <span className="inline-flex items-center gap-1 whitespace-nowrap">＝ <Frac num="15" den="20" /> － <Frac num="4" den="20" /></span>
              <span className="inline-flex items-center gap-1 whitespace-nowrap">＝ <Frac num="11" den="20" /></span>
              <span className="text-emerald-700 font-bold text-xs">(＝ 0.55 &gt; 0.5)</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-slate-900 w-5">D:</span>
              <span className="inline-flex items-center gap-1 whitespace-nowrap"><Frac num="3" den="4" /> － <Frac num="1" den="3" /></span>
              <span className="inline-flex items-center gap-1 whitespace-nowrap">＝ <Frac num="9" den="12" /> － <Frac num="4" den="12" /></span>
              <span className="inline-flex items-center gap-1 whitespace-nowrap">＝ <Frac num="5" den="12" /></span>
              <span className="text-slate-500 text-xs">(≈ 0.417 &lt; 0.5)</span>
            </div>
          </div>
          <p className="pt-1">
            Comparing the results, the greatest difference is <strong className="text-emerald-800"><Frac num="11" den="20" /> (＝ 0.55)</strong>. Therefore, the expression with the greatest value is <strong>C</strong>.
          </p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            Όλες οι παραστάσεις ξεκινούν με <strong>11</strong>, οπότε μπορούμε να μην το υπολογίσουμε στις πράξεις και να συγκρίνουμε μόνο τα κλάσματα κάθε επιλογής:
          </p>
          <div className="space-y-2.5 bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-slate-900 w-5">Α:</span>
              <span className="inline-flex items-center gap-1 whitespace-nowrap"><Frac num="2" den="3" /> － <Frac num="1" den="5" /></span>
              <span className="inline-flex items-center gap-1 whitespace-nowrap">＝ <Frac num="10" den="15" /> － <Frac num="3" den="15" /></span>
              <span className="inline-flex items-center gap-1 whitespace-nowrap">＝ <Frac num="7" den="15" /></span>
              <span className="text-slate-500 text-xs">(≈ 0,467 &lt; 0,5)</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-slate-900 w-5">Β:</span>
              <span className="inline-flex items-center gap-1 whitespace-nowrap"><Frac num="1" den="2" /> － <Frac num="1" den="5" /></span>
              <span className="inline-flex items-center gap-1 whitespace-nowrap">＝ <Frac num="5" den="10" /> － <Frac num="2" den="10" /></span>
              <span className="inline-flex items-center gap-1 whitespace-nowrap">＝ <Frac num="3" den="10" /></span>
              <span className="text-slate-500 text-xs">(＝ 0,3 &lt; 0,5)</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-emerald-700 w-5">Γ:</span>
              <span className="inline-flex items-center gap-1 whitespace-nowrap"><Frac num="3" den="4" /> － <Frac num="1" den="5" /></span>
              <span className="inline-flex items-center gap-1 whitespace-nowrap">＝ <Frac num="15" den="20" /> － <Frac num="4" den="20" /></span>
              <span className="inline-flex items-center gap-1 whitespace-nowrap">＝ <Frac num="11" den="20" /></span>
              <span className="text-emerald-700 font-bold text-xs">(＝ 0,55 &gt; 0,5)</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-slate-900 w-5">Δ:</span>
              <span className="inline-flex items-center gap-1 whitespace-nowrap"><Frac num="3" den="4" /> － <Frac num="1" den="3" /></span>
              <span className="inline-flex items-center gap-1 whitespace-nowrap">＝ <Frac num="9" den="12" /> － <Frac num="4" den="12" /></span>
              <span className="inline-flex items-center gap-1 whitespace-nowrap">＝ <Frac num="5" den="12" /></span>
              <span className="text-slate-500 text-xs">(≈ 0,417 &lt; 0,5)</span>
            </div>
          </div>
          <p className="pt-1">
            Συγκρίνοντας τα αποτελέσματα, η μεγαλύτερη διαφορά είναι το <strong className="text-emerald-800"><Frac num="11" den="20" /> (＝ 0,55)</strong>. Επομένως, η παράσταση με τη μεγαλύτερη τιμή είναι η <strong>Γ</strong>.
          </p>
        </div>
      )
    },
    {
      id: 2,
      officialNumber: 22,
      group: groupA,
      promptText: isEn
        ? 'If 3 times 🍎 and 2 times 🍐 makes 19, while 2 times 🍎 and 3 times 🍐 makes 41, then the sum of 🍎 and 🍐 is:'
        : 'Αν 3 φορές το 🍎 και 2 φορές το 🍐 κάνει 19, ενώ 2 φορές το 🍎 και 3 φορές το 🍐 κάνει 41, τότε το άθροισμα των 🍎 και 🍐 είναι:',
      options: [
        { key: 'A', label: '62', raw: '62' },
        { key: 'B', label: <Frac num="62" den="5" />, raw: '62/5' },
        { key: isEn ? 'C' : 'Γ', label: '60', raw: '60' },
        { key: isEn ? 'D' : 'Δ', label: '12', raw: '12' }
      ],
      correctRaw: '12',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Let <strong>x</strong> represent 🍎 and <strong>y</strong> represent 🍐.</p>
          <p>From the given statements we obtain two equations:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 space-y-1.5 font-mono text-slate-800">
            <div>• 3 times 🍎 and 2 times 🍐 makes 19 ➔ <strong>3x ＋ 2y ＝ 19</strong></div>
            <div>• 2 times 🍎 and 3 times 🍐 makes 41 ➔ <strong>2x ＋ 3y ＝ 41</strong></div>
          </div>
          <p>We are asked for the sum of 🍎 and 🍐, which is <strong>x ＋ y</strong> (without needing to find x and y individually).</p>
          <p>Add the two equations together:</p>
          <div className="bg-white/70 p-4 rounded-xl border border-slate-200/80 font-mono text-slate-900 text-sm max-w-fit">
            <div className="pb-2 border-b-2 border-slate-700 space-y-1">
              <div className="pl-6">3x ＋ 2y ＝ 19</div>
              <div className="flex items-center">
                <span className="w-6 font-bold leading-none">＋</span>
                <span>2x ＋ 3y ＝ 41</span>
              </div>
            </div>
            <div className="pt-3 space-y-2">
              <div>5x ＋ 5y ＝ 41 ＋ 19</div>
              <div>5x ＋ 5y ＝ 60</div>
              <div>5 · (x ＋ y) ＝ 60</div>
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <span>x ＋ y ＝</span>
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                  <Frac num="60" den="5" /> ➔ <strong className="text-emerald-700">x ＋ y ＝ 12</strong>
                </span>
              </div>
            </div>
          </div>
          <p className="pt-1">Thus, the sum of 🍎 and 🍐 is <strong>12</strong> (Choice <strong>D</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Συμβολίζουμε με <strong>x</strong> το 🍎 και με <strong>y</strong> το 🍐.</p>
          <p>Από τα δεδομένα της εκφώνησης προκύπτουν δύο εξισώσεις:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 space-y-1.5 font-mono text-slate-800">
            <div>• 3 φορές το 🍎 και 2 φορές το 🍐 κάνει 19 ➔ <strong>3x ＋ 2y ＝ 19</strong></div>
            <div>• 2 φορές το 🍎 και 3 φορές το 🍐 κάνει 41 ➔ <strong>2x ＋ 3y ＝ 41</strong></div>
          </div>
          <p>Μας ζητείται το άθροισμα των 🍎 και 🍐, δηλαδή η τιμή του <strong>x ＋ y</strong> (και όχι να βρούμε το καθένα ξεχωριστά).</p>
          <p>Προσθέτουμε τις δύο εξισώσεις <strong>κατά μέλη</strong>:</p>
          <div className="bg-white/70 p-4 rounded-xl border border-slate-200/80 font-mono text-slate-900 text-sm max-w-fit">
            <div className="pb-2 border-b-2 border-slate-700 space-y-1">
              <div className="pl-6">3x ＋ 2y ＝ 19</div>
              <div className="flex items-center">
                <span className="w-6 font-bold leading-none">＋</span>
                <span>2x ＋ 3y ＝ 41</span>
              </div>
            </div>
            <div className="pt-3 space-y-2">
              <div>5x ＋ 5y ＝ 41 ＋ 19</div>
              <div>5x ＋ 5y ＝ 60</div>
              <div>5 · (x ＋ y) ＝ 60</div>
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <span>x ＋ y ＝</span>
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                  <Frac num="60" den="5" /> ➔ <strong className="text-emerald-700">x ＋ y ＝ 12</strong>
                </span>
              </div>
            </div>
          </div>
          <p className="pt-1">Άρα, το άθροισμα των 🍎 και 🍐 είναι <strong>12</strong> (Επιλογή <strong>Δ</strong>).</p>
        </div>
      )
    },
    {
      id: 3,
      officialNumber: 23,
      group: groupA,
      promptText: isEn
        ? 'Four stores sell the same shirt during the sales. According to the table below, at which store does the shirt cost the least during the sales?'
        : 'Τέσσερα καταστήματα πουλάνε την ίδια μπλούζα στις εκπτώσεις. Σύμφωνα με τον πίνακα που ακολουθεί, σε ποιο κατάστημα η μπλούζα κοστίζει φθηνότερα στις εκπτώσεις;',
      hasTable: 'table23',
      options: isEn
        ? [
            { key: 'A', label: "Alina's", raw: "Alina's" },
            { key: 'B', label: "Vasilis's", raw: "Vasilis's" },
            { key: 'C', label: "Gianna's", raw: "Gianna's" },
            { key: 'D', label: "Dimosthenis's", raw: "Dimosthenis's" }
          ]
        : [
            { key: 'A', label: 'Της Αλίνας', raw: 'Της Αλίνας' },
            { key: 'B', label: 'Του Βασίλη', raw: 'Του Βασίλη' },
            { key: 'Γ', label: 'Της Γιάννας', raw: 'Της Γιάννας' },
            { key: 'Δ', label: 'Του Δημοσθένη', raw: 'Του Δημοσθένη' }
          ],
      correctRaw: isEn ? "Dimosthenis's" : 'Του Δημοσθένη',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>To find the discount amount, multiply the <strong>original price by the discount percentage</strong>, then subtract from the original price:</p>
          <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-bold text-center text-slate-800 text-xs sm:text-sm">
            Final Price ＝ Original Price － Discount
          </div>
          <div className="space-y-2.5 bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            <div className="border-b border-slate-100 pb-2 space-y-1">
              <div className="font-sans font-bold text-slate-950">1. Alina&apos;s:</div>
              <div className="flex items-center gap-1.5 flex-wrap pl-2">
                <span>Discount ＝ 50 · <Frac num="20" den="100" /></span>
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＝ <Frac num="1000" den="100" /> ＝ <strong>10 €</strong></span>
              </div>
              <div className="pl-2 text-slate-700">Final Price ＝ 50 － 10 ＝ <strong>40 €</strong></div>
            </div>
            <div className="border-b border-slate-100 pb-2 space-y-1">
              <div className="font-sans font-bold text-slate-950">2. Vasilis&apos;s:</div>
              <div className="flex items-center gap-1.5 flex-wrap pl-2">
                <span>Discount ＝ 45 · <Frac num="15" den="100" /></span>
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＝ <Frac num="675" den="100" /> ＝ <strong>6.75 €</strong></span>
              </div>
              <div className="pl-2 text-slate-700">Final Price ＝ 45 － 6.75 ＝ <strong>38.25 €</strong></div>
            </div>
            <div className="border-b border-slate-100 pb-2 space-y-1">
              <div className="font-sans font-bold text-slate-950">3. Gianna&apos;s:</div>
              <div className="flex items-center gap-1.5 flex-wrap pl-2">
                <span>Discount ＝ 45 · <Frac num="10" den="100" /></span>
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＝ <Frac num="450" den="100" /> ＝ <strong>4.50 €</strong></span>
              </div>
              <div className="pl-2 text-slate-700">Final Price ＝ 45 － 4.50 ＝ <strong>40.50 €</strong></div>
            </div>
            <div className="space-y-1 pt-0.5">
              <div className="font-sans font-bold text-emerald-800">4. Dimosthenis&apos;s:</div>
              <div className="flex items-center gap-1.5 flex-wrap pl-2">
                <span>Discount ＝ 40 · <Frac num="10" den="100" /></span>
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＝ <Frac num="400" den="100" /> ＝ <strong>4 €</strong></span>
              </div>
              <div className="pl-2 text-emerald-800 font-bold">Final Price ＝ 40 － 4 ＝ <strong>36 €</strong></div>
            </div>
          </div>
          <p className="pt-1">The lowest price is <strong>36 €</strong> at <strong>Dimosthenis&apos;s</strong> store (Choice <strong>D</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            Για να βρούμε την τιμή (της έκπτωσης ή της αύξησης) αν γνωρίζουμε το ποσοστό, πολλαπλασιάζουμε πάντα την <strong>αρχική τιμή με το ποσοστό</strong>.
          </p>
          <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-bold text-center text-slate-800 text-xs sm:text-sm">
            Τελική Τιμή Πληρωμής ＝ Αρχική Τιμή － Έκπτωση
          </div>
          <div className="space-y-2.5 bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            <div className="border-b border-slate-100 pb-2 space-y-1">
              <div className="font-sans font-bold text-slate-950">1. Αλίνα:</div>
              <div className="flex items-center gap-1.5 flex-wrap pl-2">
                <span>Έκπτωση ＝ 50 · <Frac num="20" den="100" /></span>
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＝ <Frac num="1000" den="100" /> ＝ <strong>10 €</strong></span>
              </div>
              <div className="pl-2 text-slate-700">Τελική Τιμή ＝ 50 － 10 ＝ <strong>40 €</strong></div>
            </div>
            <div className="border-b border-slate-100 pb-2 space-y-1">
              <div className="font-sans font-bold text-slate-950">2. Βασίλης:</div>
              <div className="flex items-center gap-1.5 flex-wrap pl-2">
                <span>Έκπτωση ＝ 45 · <Frac num="15" den="100" /></span>
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＝ <Frac num="675" den="100" /> ＝ <strong>6,75 €</strong></span>
              </div>
              <div className="pl-2 text-slate-700">Τελική Τιμή ＝ 45 － 6,75 ＝ <strong>38,25 €</strong></div>
            </div>
            <div className="border-b border-slate-100 pb-2 space-y-1">
              <div className="font-sans font-bold text-slate-950">3. Γιάννα:</div>
              <div className="flex items-center gap-1.5 flex-wrap pl-2">
                <span>Έκπτωση ＝ 45 · <Frac num="10" den="100" /></span>
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＝ <Frac num="450" den="100" /> ＝ <strong>4,50 €</strong></span>
              </div>
              <div className="pl-2 text-slate-700">Τελική Τιμή ＝ 45 － 4,50 ＝ <strong>40,50 €</strong></div>
            </div>
            <div className="space-y-1 pt-0.5">
              <div className="font-sans font-bold text-emerald-800">4. Δημοσθένης:</div>
              <div className="flex items-center gap-1.5 flex-wrap pl-2">
                <span>Έκπτωση ＝ 40 · <Frac num="10" den="100" /></span>
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＝ <Frac num="400" den="100" /> ＝ <strong>4 €</strong></span>
              </div>
              <div className="pl-2 text-emerald-800 font-bold">Τελική Τιμή ＝ 40 － 4 ＝ <strong>36 €</strong></div>
            </div>
          </div>
          <p className="pt-1">
            Η χαμηλότερη τιμή είναι τα <strong>36 €</strong> στο κατάστημα <strong>του Δημοσθένη</strong> (Επιλογή <strong>Δ</strong>).
          </p>
        </div>
      )
    },
    {
      id: 4,
      officialNumber: 24,
      group: groupA,
      promptText: isEn
        ? 'We flip a fair coin and roll a standard 6-sided die. Which of the following events is most likely to happen?'
        : 'Στρίβουμε ένα συνηθισμένο κέρμα και ρίχνουμε ένα συνηθισμένο ζάρι (με 6 έδρες). Ποιο από τα επόμενα είναι πιθανότερο να συμβεί;',
      options: isEn
        ? [
            { key: 'A', label: 'Getting "tails" on the coin.', raw: 'Getting "tails" on the coin.' },
            { key: 'B', label: 'Rolling a 1 on the die.', raw: 'Rolling a 1 on the die.' },
            { key: 'C', label: 'Rolling a number greater than 1 on the die.', raw: 'Rolling a number greater than 1 on the die.' },
            { key: 'D', label: 'Not getting "tails" on the coin.', raw: 'Not getting "tails" on the coin.' }
          ]
        : [
            { key: 'A', label: 'Να έρθει «γράμματα» στο κέρμα.', raw: 'Να έρθει «γράμματα» στο κέρμα.' },
            { key: 'B', label: 'Να έρθει 1 στο ζάρι.', raw: 'Να έρθει 1 στο ζάρι.' },
            { key: 'Γ', label: 'Να έρθει αριθμός μεγαλύτερος του 1 στο ζάρι.', raw: 'Να έρθει αριθμός μεγαλύτερος του 1 στο ζάρι.' },
            { key: 'Δ', label: 'Να μην έρθει «γράμματα» στο κέρμα.', raw: 'Να μην έρθει «γράμματα» στο κέρμα.' }
          ],
      correctRaw: isEn ? 'Rolling a number greater than 1 on the die.' : 'Να έρθει αριθμός μεγαλύτερος του 1 στο ζάρι.',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Compare the probability of each event:</p>
          <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>• Case A: Getting &quot;tails&quot; ＝ <Frac num="1" den="2" /> ＝ <strong>50%</strong></div>
            <div>• Case B: Rolling 1 on the die ＝ <Frac num="1" den="6" /> ≈ <strong>16.7%</strong></div>
            <div>
              • Case C: Numbers &#123;2, 3, 4, 5, 6&#125; are greater than 1 (5 favorable outcomes out of 6):{' '}
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="5" den="6" /> ≈ <strong className="text-emerald-700 text-base">83.3%</strong>
              </span>
            </div>
            <div>• Case D: Not getting &quot;tails&quot; means getting &quot;heads&quot; ＝ <Frac num="1" den="2" /> ＝ <strong>50%</strong></div>
          </div>
          <p className="pt-1">The most likely event is <strong>C</strong> (<Frac num="5" den="6" /> ≈ 83.3%).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Υπολογίζουμε την πιθανότητα κάθε ενδεχομένου:</p>
          <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>• Περίπτωση Α: Να έρθει «γράμματα» ＝ <Frac num="1" den="2" /> ＝ <strong>50%</strong></div>
            <div>• Περίπτωση Β: Να έρθει 1 στο ζάρι ＝ <Frac num="1" den="6" /> ≈ <strong>16,7%</strong></div>
            <div>
              • Περίπτωση Γ: Οι αριθμοί &#123;2, 3, 4, 5, 6&#125; είναι μεγαλύτεροι του 1 (5 ευνοϊκές περιπτώσεις στις 6):{' '}
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="5" den="6" /> ≈ <strong className="text-emerald-700 text-base">83,3%</strong>
              </span>
            </div>
            <div>• Περίπτωση Δ: Να μην έρθει «γράμματα» σημαίνει να έρθει «κεφαλή» ＝ <Frac num="1" den="2" /> ＝ <strong>50%</strong></div>
          </div>
          <p className="pt-1">Πιθανότερο είναι το ενδεχόμενο <strong>Γ</strong> (<Frac num="5" den="6" /> ≈ 83,3%).</p>
        </div>
      )
    },
    {
      id: 5,
      officialNumber: 25,
      group: groupA,
      promptText: isEn
        ? 'At a summer camp, each child chose to do exactly one sport. The table below shows the percentages of children for various combinations of gender and sport. For example, 17% of all children are boys who chose basketball. What percentage of the girls chose basketball?'
        : 'Σε μια κατασκήνωση κάθε παιδί έχει επιλέξει να κάνει ακριβώς ένα άθλημα. Στον πίνακα που ακολουθεί φαίνονται τα ποσοστά των παιδιών για διάφορους συνδυασμούς φύλου και αθλήματος. Για παράδειγμα, το 17% των παιδιών είναι αγόρια που έχουν επιλέξει μπάσκετ. Τι ποσοστό των κοριτσιών έχει επιλέξει μπάσκετ;',
      hasTable: 'table25',
      options: [
        { key: 'A', label: '12%', raw: '12%' },
        { key: 'B', label: '25%', raw: '25%' },
        { key: isEn ? 'C' : 'Γ', label: '64%', raw: '64%' },
        { key: isEn ? 'D' : 'Δ', label: '48%', raw: '48%' }
      ],
      correctRaw: '25%',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            Each child chooses <strong>exactly one sport</strong>, so every child is counted once in the table percentages.
          </p>
          <p>1. <strong>Find the percentage of girls in basketball (out of all children):</strong></p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            5.5% ＋ 29.5% ＋ 29.5% ＋ 6.5% ＋ 17% ＝ <strong>88%</strong>
          </div>
          <p>Subtract from <strong>100%</strong> (all children):</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            100% － 88% ＝ <strong>12%</strong> of all children are girls playing basketball.
          </div>
          <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-xl text-amber-950 space-y-1">
            <span className="font-black block uppercase text-[11px] tracking-wider text-amber-800">⚠️ Careful:</span>
            <p>
              <strong>12%</strong> is out of <strong>all children</strong>. The question asks: <em>&quot;What percentage <strong>of the girls</strong> chose basketball?&quot;</em>
            </p>
          </div>
          <p>2. <strong>Total percentage of girls at the camp:</strong></p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            29.5% (Volleyball) ＋ 6.5% (Football) ＋ 12% (Basketball) ＝ <strong>48%</strong>
          </div>
          <p>3. <strong>Percentage of girls who chose basketball:</strong></p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <Frac num="Basketball Girls" den="Total Girls" />
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＝ <Frac num="12" den="48" /></span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ＝ <Frac num="1" den="4" /> ＝ <strong className="text-emerald-700 text-base">25%</strong>
            </span>
          </div>
          <p className="pt-1">Thus, <strong>25%</strong> of the girls chose basketball (Choice <strong>B</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            Κάθε παιδί επιλέγει <strong>ακριβώς ένα άθλημα</strong>, επομένως υπολογίζεται μόνο μία φορά στα ποσοστά του πίνακα.
          </p>
          <p>1. <strong>Εύρεση ποσοστού κοριτσιών στο μπάσκετ (επί του συνόλου):</strong></p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            5,5% ＋ 29,5% ＋ 29,5% ＋ 6,5% ＋ 17% ＝ <strong>88%</strong>
          </div>
          <p>Αφαιρούμε από το <strong>100%</strong> (σύνολο όλων των παιδιών):</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            100% － 88% ＝ <strong>12%</strong> των παιδιών είναι κορίτσια που παίζουν μπάσκετ.
          </div>
          <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-xl text-amber-950 space-y-1">
            <span className="font-black block uppercase text-[11px] tracking-wider text-amber-800">⚠️ Προσοχή:</span>
            <p>
              Το <strong>12%</strong> εκφράζει το ποσοστό στον <strong>συνολικό αριθμό</strong> όλων των παιδιών. Η ερώτηση ζητάει: <em>«Τι ποσοστό <strong>των κοριτσιών</strong> έχει επιλέξει μπάσκετ;»</em>
            </p>
          </div>
          <p>2. <strong>Συνολικό ποσοστό κοριτσιών στην κατασκήνωση:</strong></p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            29,5% (Βόλεϊ) ＋ 6,5% (Ποδόσφαιρο) ＋ 12% (Μπάσκετ) ＝ <strong>48%</strong>
          </div>
          <p>3. <strong>Ποσοστό των κοριτσιών που επέλεξαν μπάσκετ:</strong></p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <Frac num="Κορίτσια Μπάσκετ" den="Σύνολο Κοριτσιών" />
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＝ <Frac num="12" den="48" /></span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ＝ <Frac num="1" den="4" /> ＝ <strong className="text-emerald-700 text-base">25%</strong>
            </span>
          </div>
          <p className="pt-1">Άρα, το <strong>25%</strong> των κοριτσιών επέλεξε μπάσκετ (Επιλογή <strong>Β</strong>).</p>
        </div>
      )
    },
    {
      id: 6,
      officialNumber: 26,
      group: groupA,
      promptText: isEn ? (
        <span>
          Which of the following numbers is closer to <Frac num="1" den="2" /> than it is to <Frac num="1" den="4" />?
        </span>
      ) : (
        <span>
          Ποιος αριθμός από τους επόμενους είναι πιο κοντά στο <Frac num="1" den="2" /> από ό,τι είναι στο <Frac num="1" den="4" />;
        </span>
      ),
      options: [
        { key: 'A', label: <Frac num="1" den="6" />, raw: '1/6' },
        { key: 'B', label: <Frac num="1" den="5" />, raw: '1/5' },
        { key: isEn ? 'C' : 'Γ', label: <Frac num="3" den="8" />, raw: '3/8' },
        { key: isEn ? 'D' : 'Δ', label: '1', raw: '1' }
      ],
      correctRaw: '1',
      explain: isEn ? (
        <div className="space-y-4 text-xs sm:text-sm">
          <p>
            To compare distances from <Frac num="1" den="4" /> and <Frac num="1" den="2" />, first find their <strong>midpoint</strong> (the point equidistant from both):
          </p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span>Midpoint ＝</span>
            <ComplexFrac
              num={<span><Frac num="1" den="4" small /> ＋ <Frac num="1" den="2" small /></span>}
              den="2"
            />
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ＝ <ComplexFrac num={<Frac num="3" den="4" small />} den="2" />
            </span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ＝ <strong><Frac num="3" den="8" /> (＝ 0.375)</strong>
            </span>
          </div>

          <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 my-2">
            <svg
              viewBox="0 0 420 120"
              className="w-full max-w-[420px] h-auto select-none mx-auto block font-mono"
              role="img"
              aria-label="Number line showing 1/4, midpoint 3/8, 1/2, and 1"
            >
              <defs>
                <marker id="arrow-axis-en" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 2 L 8 5 L 0 8 z" fill="#334155" />
                </marker>
              </defs>
              <line x1="20" y1="58" x2="395" y2="58" stroke="#334155" strokeWidth="2" markerEnd="url(#arrow-axis-en)" />
              <line x1="30" y1="50" x2="30" y2="66" stroke="#94a3b8" strokeWidth="1.5" />
              <text x="30" y="82" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#64748b">0</text>
              <circle cx="87" cy="58" r="4" fill="#64748b" />
              <text x="87" y="38" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#475569">1/6</text>
              <circle cx="98" cy="58" r="4" fill="#64748b" />
              <text x="98" y="82" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#475569">1/5</text>
              <circle cx="115" cy="58" r="5" fill="#2563eb" />
              <text x="115" y="38" fontSize="12" fontWeight="black" textAnchor="middle" fill="#1d4ed8">1/4</text>
              <line x1="157.5" y1="46" x2="157.5" y2="70" stroke="#d97706" strokeWidth="2" strokeDasharray="3 2" />
              <circle cx="157.5" cy="58" r="4.5" fill="#f59e0b" />
              <text x="157.5" y="86" fontSize="10" fontWeight="black" textAnchor="middle" fill="#b45309">3/8 (mid)</text>
              <circle cx="200" cy="58" r="5" fill="#2563eb" />
              <text x="200" y="38" fontSize="12" fontWeight="black" textAnchor="middle" fill="#1d4ed8">1/2</text>
              <circle cx="370" cy="58" r="5" fill="#15803d" />
              <text x="370" y="38" fontSize="12" fontWeight="black" textAnchor="middle" fill="#15803d">1</text>
              <text x="370" y="82" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#15803d">1</text>
            </svg>
          </div>

          <ul className="space-y-1.5 pl-4 sm:pl-5 text-slate-800 list-disc font-medium">
            <li><strong><Frac num="3" den="8" /></strong> lies right at the midpoint between <Frac num="1" den="4" /> and <Frac num="1" den="2" />, so it is <strong>equidistant</strong> from both.</li>
            <li><strong><Frac num="1" den="6" /></strong> and <strong><Frac num="1" den="5" /></strong> are smaller than <Frac num="1" den="4" />, so they are clearly closer to <Frac num="1" den="4" />.</li>
            <li>Any number to the <strong>right of the midpoint <Frac num="3" den="8" /></strong> is closer to <Frac num="1" den="2" /> than to <Frac num="1" den="4" />.</li>
            <li>The number <strong>1</strong> is 0.5 away from <Frac num="1" den="2" /> and 0.75 away from <Frac num="1" den="4" />.</li>
          </ul>
          <p className="pt-1">Therefore, the correct answer is <strong>1</strong> (Choice <strong>D</strong>).</p>
        </div>
      ) : (
        <div className="space-y-4 text-xs sm:text-sm">
          <p>
            Για να συγκρίνουμε τις αποστάσεις των αριθμών από το <Frac num="1" den="4" /> και το <Frac num="1" den="2" />, υπολογίζουμε αρχικά το <strong>μέσο</strong> τους (το σημείο που ισαπέχει ακριβώς και από τα δύο):
          </p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span>Μέσο ＝</span>
            <ComplexFrac
              num={<span><Frac num="1" den="4" small /> ＋ <Frac num="1" den="2" small /></span>}
              den="2"
            />
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ＝ <ComplexFrac num={<Frac num="3" den="4" small />} den="2" />
            </span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              ＝ <strong><Frac num="3" den="8" /> (＝ 0,375)</strong>
            </span>
          </div>

          <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 my-2">
            <svg
              viewBox="0 0 420 120"
              className="w-full max-w-[420px] h-auto select-none mx-auto block font-mono"
              role="img"
              aria-label="Αριθμογραμμή με τα σημεία 1/4, μέσο 3/8, 1/2 και 1"
            >
              <defs>
                <marker id="arrow-axis-el" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 2 L 8 5 L 0 8 z" fill="#334155" />
                </marker>
              </defs>
              <line x1="20" y1="58" x2="395" y2="58" stroke="#334155" strokeWidth="2" markerEnd="url(#arrow-axis-el)" />
              <line x1="30" y1="50" x2="30" y2="66" stroke="#94a3b8" strokeWidth="1.5" />
              <text x="30" y="82" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#64748b">0</text>
              <circle cx="87" cy="58" r="4" fill="#64748b" />
              <text x="87" y="38" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#475569">1/6</text>
              <circle cx="98" cy="58" r="4" fill="#64748b" />
              <text x="98" y="82" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#475569">1/5</text>
              <circle cx="115" cy="58" r="5" fill="#2563eb" />
              <text x="115" y="38" fontSize="12" fontWeight="black" textAnchor="middle" fill="#1d4ed8">1/4</text>
              <line x1="157.5" y1="46" x2="157.5" y2="70" stroke="#d97706" strokeWidth="2" strokeDasharray="3 2" />
              <circle cx="157.5" cy="58" r="4.5" fill="#f59e0b" />
              <text x="157.5" y="86" fontSize="10" fontWeight="black" textAnchor="middle" fill="#b45309">3/8 (μέσο)</text>
              <circle cx="200" cy="58" r="5" fill="#2563eb" />
              <text x="200" y="38" fontSize="12" fontWeight="black" textAnchor="middle" fill="#1d4ed8">1/2</text>
              <circle cx="370" cy="58" r="5" fill="#15803d" />
              <text x="370" y="38" fontSize="12" fontWeight="black" textAnchor="middle" fill="#15803d">1</text>
              <text x="370" y="82" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#15803d">1</text>
            </svg>
          </div>

          <ul className="space-y-1.5 pl-4 sm:pl-5 text-slate-800 list-disc font-medium">
            <li>Το <strong><Frac num="3" den="8" /></strong> βρίσκεται ακριβώς στη μέση των <Frac num="1" den="4" /> και <Frac num="1" den="2" />, επομένως <strong>ισαπέχει</strong> και από τα δύο.</li>
            <li>Οι αριθμοί <strong><Frac num="1" den="6" /></strong> και <strong><Frac num="1" den="5" /></strong> είναι μικρότεροι από το <Frac num="1" den="4" />, άρα βρίσκονται σαφώς πιο κοντά στο <Frac num="1" den="4" />.</li>
            <li>Οποιοσδήποτε αριθμός βρίσκεται <strong>δεξιότερα από το μέσο <Frac num="3" den="8" /></strong> είναι πιο κοντά στο <Frac num="1" den="2" /> από ό,τι στο <Frac num="1" den="4" />.</li>
            <li>Ο αριθμός <strong>1</strong> έχει απόσταση από το <Frac num="1" den="2" /> ίση με <strong>0,5</strong>, ενώ από το <Frac num="1" den="4" /> απέχει <strong>0,75</strong>.</li>
          </ul>
          <p className="pt-1">Επομένως, ο αριθμός που είναι πιο κοντά στο <Frac num="1" den="2" /> από ό,τι στο <Frac num="1" den="4" /> είναι το <strong>1</strong> (Επιλογή <strong>Δ</strong>).</p>
        </div>
      )
    },
    {
      id: 7,
      officialNumber: 27,
      group: groupA,
      promptText: isEn
        ? 'We mix equal amounts of three beverages. Two of them contain 22% orange juice each, while the third contains 34% orange juice. What percentage (%) of orange juice does the resulting mixture contain?'
        : 'Αναμειγνύουμε ίδια ποσότητα από τρία ροφήματα. Τα δύο περιέχουν 22% πορτοκάλι το καθένα, ενώ το τρίτο περιέχει 34% πορτοκάλι. Πόσο % πορτοκάλι περιέχει το ρόφημα που προέκυψε από την ανάμειξη;',
      options: [
        { key: 'A', label: '22%', raw: '22%' },
        { key: 'B', label: '26%', raw: '26%' },
        { key: isEn ? 'C' : 'Γ', label: '28%', raw: '28%' },
        { key: isEn ? 'D' : 'Δ', label: '30%', raw: '30%' }
      ],
      correctRaw: '26%',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Because we mix <strong>equal amounts</strong> of the 3 beverages, each beverage makes up <Frac num="1" den="3" /> of the final mixture.</p>
          <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div><Frac num="1" den="3" /> · 22% ＋ <Frac num="1" den="3" /> · 22% ＋ <Frac num="1" den="3" /> · 34%</div>
            <div>＝ <Frac num="1" den="3" /> · (22% ＋ 22% ＋ 34%)</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>＝ <Frac num="1" den="3" /> · 78%</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                ＝ <Frac num="78" den="3" />% ＝ <strong className="text-emerald-700 text-base">26%</strong>
              </span>
            </div>
          </div>
          <p className="pt-1">Thus, the resulting beverage contains <strong>26%</strong> orange juice (Choice <strong>B</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Επειδή αναμειγνύουμε <strong>ίσες ποσότητες</strong> από τα 3 ροφήματα, το τελικό μείγμα αποτελείται κατά το <Frac num="1" den="3" /> από κάθε ρόφημα.</p>
          <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div><Frac num="1" den="3" /> · 22% ＋ <Frac num="1" den="3" /> · 22% ＋ <Frac num="1" den="3" /> · 34%</div>
            <div>＝ <Frac num="1" den="3" /> · (22% ＋ 22% ＋ 34%)</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>＝ <Frac num="1" den="3" /> · 78%</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                ＝ <Frac num="78" den="3" />% ＝ <strong className="text-emerald-700 text-base">26%</strong>
              </span>
            </div>
          </div>
          <p className="pt-1">Άρα, το ρόφημα που προέκυψε περιέχει <strong>26%</strong> πορτοκάλι (Επιλογή <strong>Β</strong>).</p>
        </div>
      )
    },
    {
      id: 8,
      officialNumber: 28,
      group: groupA,
      promptText: isEn
        ? 'We have 225 almonds, 99 walnuts, and 54 chestnuts. We want to divide them into bags so that all bags contain the same number of almonds, the same number of walnuts, and the same number of chestnuts. What is the maximum number of such bags we can fill?'
        : 'Έχουμε 225 αμύγδαλα, 99 καρύδια και 54 κάστανα. Θέλουμε να τα μοιράσουμε σε σακουλάκια ώστε όλα να περιέχουν ίδιο αριθμό από αμύγδαλα, ίδιο αριθμό από καρύδια και ίδιο αριθμό από κάστανα. Πόσα το πολύ τέτοια σακουλάκια μπορούμε να γεμίσουμε;',
      options: [
        { key: 'A', label: '1', raw: '1' },
        { key: 'B', label: '3', raw: '3' },
        { key: isEn ? 'C' : 'Γ', label: '5', raw: '5' },
        { key: isEn ? 'D' : 'Δ', label: '9', raw: '9' }
      ],
      correctRaw: '9',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            The maximum number of bags equals the <strong>Greatest Common Divisor</strong> of the three quantities: <strong>GCD(225, 99, 54)</strong>.
          </p>
          <div className="space-y-2 bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            <div><strong className="font-sans text-slate-950">Divisors of 225:</strong> 1, 3, 5, <strong className="text-emerald-700 font-bold underline">9</strong>, 15, 25, 45, 75, 225</div>
            <div><strong className="font-sans text-slate-950">Divisors of 99:</strong> 1, 3, <strong className="text-emerald-700 font-bold underline">9</strong>, 11, 33, 99</div>
            <div><strong className="font-sans text-slate-950">Divisors of 54:</strong> 1, 2, 3, 6, <strong className="text-emerald-700 font-bold underline">9</strong>, 18, 27, 54</div>
          </div>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 space-y-1">
            <div className="font-mono text-slate-800">• <strong>Common Divisors:</strong> 1, 3, 9</div>
            <div className="font-mono text-emerald-800 font-bold">• <strong>Greatest Common Divisor:</strong> GCD(225, 99, 54) ＝ 9</div>
          </div>
          <p className="pt-1">Therefore, we can fill at most <strong>9</strong> bags (Choice <strong>D</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            Το μέγιστο πλήθος από σακουλάκια ισούται με τον <strong>Μέγιστο Κοινό Διαιρέτη</strong> των ποσοτήτων: <strong>ΜΚΔ(225, 99, 54)</strong>.
          </p>
          <div className="space-y-2 bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            <div><strong className="font-sans text-slate-950">Διαιρέτες του 225:</strong> 1, 3, 5, <strong className="text-emerald-700 font-bold underline">9</strong>, 15, 25, 45, 75, 225</div>
            <div><strong className="font-sans text-slate-950">Διαιρέτες του 99:</strong> 1, 3, <strong className="text-emerald-700 font-bold underline">9</strong>, 11, 33, 99</div>
            <div><strong className="font-sans text-slate-950">Διαιρέτες του 54:</strong> 1, 2, 3, 6, <strong className="text-emerald-700 font-bold underline">9</strong>, 18, 27, 54</div>
          </div>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 space-y-1">
            <div className="font-mono text-slate-800">• <strong>Κοινοί Διαιρέτες:</strong> 1, 3, 9</div>
            <div className="font-mono text-emerald-800 font-bold">• <strong>Μέγιστος Κοινός Διαιρέτης:</strong> ΜΚΔ(225, 99, 54) ＝ 9</div>
          </div>
          <p className="pt-1">Επομένως, το μέγιστο πλήθος σακουλών που μπορούμε να γεμίσουμε είναι <strong>9</strong> (Επιλογή <strong>Δ</strong>).</p>
        </div>
      )
    },
    {
      id: 9,
      officialNumber: 29,
      group: groupA,
      promptText: isEn
        ? 'The sides of a square and a triangle are all equal to each other. If the sum of their perimeters is 21 centimeters, the area of the square in sq. cm. is:'
        : 'Οι πλευρές ενός τετραγώνου και ενός τριγώνου είναι όλες ίσες μεταξύ τους. Αν το άθροισμα των περιμέτρων τους είναι 21 εκατοστά, το εμβαδόν του τετραγώνου σε τ. εκ. (τετραγωνικά εκατοστά) είναι:',
      options: [
        { key: 'A', label: '6', raw: '6' },
        { key: 'B', label: '9', raw: '9' },
        { key: isEn ? 'C' : 'Γ', label: '12', raw: '12' },
        { key: isEn ? 'D' : 'Δ', label: '49', raw: '49' }
      ],
      correctRaw: '9',
      explain: isEn ? (
        <div className="space-y-4 text-xs sm:text-sm">
          <p>
            Let <strong>x</strong> be the common side length of the square and the triangle. Since all sides are equal, the triangle is <strong>equilateral</strong>:
          </p>
          <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 my-2">
            <svg viewBox="0 0 320 135" className="w-full max-w-[320px] h-auto select-none font-mono mx-auto block" role="img" aria-label="Square and equilateral triangle with equal side x">
              <g>
                <rect x="35" y="35" width="70" height="70" fill="#f8fafc" stroke="#1e293b" strokeWidth="2" rx="2" />
                <text x="70" y="25" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#2563eb">x</text>
                <text x="70" y="122" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#2563eb">x</text>
                <text x="22" y="74" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#2563eb">x</text>
                <text x="118" y="74" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#2563eb">x</text>
                <text x="70" y="75" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#64748b" fontFamily="sans-serif">Square</text>
              </g>
              <g>
                <polygon points="235,35 200,96 270,96" fill="#f8fafc" stroke="#1e293b" strokeWidth="2" strokeLinejoin="round" />
                <text x="235" y="115" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#2563eb">x</text>
                <text x="206" y="58" fontSize="13" fontWeight="bold" textAnchor="end" fill="#2563eb">x</text>
                <text x="264" y="58" fontSize="13" fontWeight="bold" textAnchor="start" fill="#2563eb">x</text>
                <text x="235" y="80" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#64748b" fontFamily="sans-serif">Triangle</text>
              </g>
            </svg>
          </div>
          <div className="space-y-2 bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            <div>• <strong>Square perimeter (P₁)</strong> ＝ 4 · x</div>
            <div>• <strong>Triangle perimeter (P₂)</strong> ＝ 3 · x</div>
            <div className="pt-2 border-t border-slate-200 space-y-1.5">
              <div>Total Perimeter ＝ 4 · x ＋ 3 · x ＝ 21 ➔ 7 · x ＝ 21</div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>x ＝</span>
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                  <Frac num="21" den="7" /> ➔ <strong>x ＝ 3 cm</strong>
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
            <div className="font-sans font-bold text-slate-950">Area of the square:</div>
            <div>A ＝ <Pow base="x" exp="2" /> ＝ 3 · 3 ＝ <strong className="text-emerald-700 text-base">9 sq. cm.</strong></div>
          </div>
          <p className="pt-1">Thus, the area of the square is <strong>9 sq. cm.</strong> (Choice <strong>B</strong>).</p>
        </div>
      ) : (
        <div className="space-y-4 text-xs sm:text-sm">
          <p>
            Έστω <strong>x</strong> το κοινό μήκος της πλευράς του τετραγώνου και του τριγώνου. Εφόσον όλες οι πλευρές είναι ίσες, το τρίγωνο είναι <strong>ισόπλευρο</strong>:
          </p>
          <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 my-2">
            <svg viewBox="0 0 320 135" className="w-full max-w-[320px] h-auto select-none font-mono mx-auto block" role="img" aria-label="Τετράγωνο και ισόπλευρο τρίγωνο με κοινή πλευρά x">
              <g>
                <rect x="35" y="35" width="70" height="70" fill="#f8fafc" stroke="#1e293b" strokeWidth="2" rx="2" />
                <text x="70" y="25" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#2563eb">x</text>
                <text x="70" y="122" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#2563eb">x</text>
                <text x="22" y="74" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#2563eb">x</text>
                <text x="118" y="74" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#2563eb">x</text>
                <text x="70" y="75" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#64748b" fontFamily="sans-serif">Τετράγωνο</text>
              </g>
              <g>
                <polygon points="235,35 200,96 270,96" fill="#f8fafc" stroke="#1e293b" strokeWidth="2" strokeLinejoin="round" />
                <text x="235" y="115" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#2563eb">x</text>
                <text x="206" y="58" fontSize="13" fontWeight="bold" textAnchor="end" fill="#2563eb">x</text>
                <text x="264" y="58" fontSize="13" fontWeight="bold" textAnchor="start" fill="#2563eb">x</text>
                <text x="235" y="80" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#64748b" fontFamily="sans-serif">Τρίγωνο</text>
              </g>
            </svg>
          </div>
          <div className="space-y-2 bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            <div>• <strong>Περίμετρος τετραγώνου (Π₁)</strong> ＝ 4 · x</div>
            <div>• <strong>Περίμετρος τριγώνου (Π₂)</strong> ＝ 3 · x</div>
            <div className="pt-2 border-t border-slate-200 space-y-1.5">
              <div>Συνολική Περίμετρος ＝ 4 · x ＋ 3 · x ＝ 21 ➔ 7 · x ＝ 21</div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>x ＝</span>
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                  <Frac num="21" den="7" /> ➔ <strong>x ＝ 3 εκ.</strong>
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
            <div className="font-sans font-bold text-slate-950">Εμβαδόν τετραγώνου:</div>
            <div>Ε ＝ <Pow base="x" exp="2" /> ＝ 3 · 3 ＝ <strong className="text-emerald-700 text-base">9 τ. εκ.</strong></div>
          </div>
          <p className="pt-1">Άρα, το εμβαδόν του τετραγώνου είναι <strong>9 τ. εκ.</strong> (Επιλογή <strong>Β</strong>).</p>
        </div>
      )
    },
    {
      id: 10,
      officialNumber: 30,
      group: groupA,
      promptText: isEn
        ? 'Before a day school trip, the students of a school stated one food item they would like their lunch to include. The responses in percentages (%) are shown in the chart below. According to the responses, what percentage of the children chose a food of animal origin?'
        : 'Πριν από μια ημερήσια σχολική εκδρομή οι μαθητές και οι μαθήτριες ενός σχολείου δήλωσαν από μία τροφή την οποία θα ήθελαν να περιέχει το γεύμα τους. Οι απαντήσεις σε ποσοστά (%) φαίνονται στο διάγραμμα που ακολουθεί. Σύμφωνα με τις απαντήσεις, τι ποσοστό των παιδιών δήλωσε τροφή ζωικής προέλευσης;',
      hasSvg: 'foodChart30',
      options: [
        { key: 'A', label: '5%', raw: '5%' },
        { key: 'B', label: '20%', raw: '20%' },
        { key: isEn ? 'C' : 'Γ', label: '45%', raw: '45%' },
        { key: isEn ? 'D' : 'Δ', label: '60%', raw: '60%' }
      ],
      correctRaw: '60%',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Identify the foods of animal origin from the bar chart:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
            <div>• Chicken egg: <strong>15%</strong></div>
            <div>• Cow milk: <strong>15%</strong></div>
            <div>• Meat: <strong>5%</strong></div>
            <div>• Goat cheese: <strong>25%</strong></div>
            <div className="pt-1 font-bold text-emerald-800">
              Total ＝ 15% ＋ 15% ＋ 5% ＋ 25% ＝ 60%
            </div>
          </div>
          <p className="pt-1">Thus, <strong>60%</strong> chose a food of animal origin (Choice <strong>D</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Εντοπίζουμε τις τροφές ζωικής προέλευσης από το ραβδόγραμμα:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
            <div>• Αυγό κότας: <strong>15%</strong></div>
            <div>• Γάλα αγελάδας: <strong>15%</strong></div>
            <div>• Κρέας: <strong>5%</strong></div>
            <div>• Κατσικίσιο τυρί: <strong>25%</strong></div>
            <div className="pt-1 font-bold text-emerald-800">
              Άθροισμα ＝ 15% ＋ 15% ＋ 5% ＋ 25% ＝ 60%
            </div>
          </div>
          <p className="pt-1">Επομένως, το <strong>60%</strong> δήλωσε τροφή ζωικής προέλευσης (Επιλογή <strong>Δ</strong>).</p>
        </div>
      )
    },
    {
      id: 11,
      officialNumber: 31,
      group: groupB,
      promptText: isEn
        ? 'A basketball player took 20 shots, worth two and three points, and made 60% of them, scoring 29 points in total. How many successful 3-point shots did he make?'
        : 'Ένας καλαθοσφαιριστής έκανε 20 σουτ, δύο και τριών πόντων, και ευστόχησε κατά 60%, με αποτέλεσμα να πετύχει 29 πόντους. Πόσα εύστοχα τρίποντα είχε;',
      options: [
        { key: 'A', label: '7', raw: '7' },
        { key: 'B', label: '3', raw: '3' },
        { key: isEn ? 'C' : 'Γ', label: '8', raw: '8' },
        { key: isEn ? 'D' : 'Δ', label: '9', raw: '9' },
        { key: 'E', label: '5', raw: '5' }
      ],
      correctRaw: '5',
      explain: isEn ? (
        <div className="space-y-4 text-xs sm:text-sm">
          <p>1. <strong>Total made shots:</strong> He took 20 shots and made 60% of them.</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">Made shots ＝ 20 · <Frac num="60" den="100" /></span>
            <span className="whitespace-nowrap">＝ 20 · 0.60 ＝ <strong>12 made shots</strong></span>
          </div>
          <p>2. <strong>Set up equations:</strong> Let <strong>x</strong> be made 2-pointers and <strong>y</strong> be made 3-pointers:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 space-y-1.5 font-mono text-slate-900">
            <div>• Total made shots: <strong>x ＋ y ＝ 12</strong></div>
            <div>• Total points: <strong>2x ＋ 3y ＝ 29</strong></div>
          </div>
          <p>3. <strong>Solve:</strong> Rewrite 2x ＋ 3y as (x ＋ y) ＋ (x ＋ y) ＋ y:</p>
          <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>(x ＋ y) ＋ (x ＋ y) ＋ y ＝ 29</div>
            <div>12 ＋ 12 ＋ y ＝ 29 ➔ 24 ＋ y ＝ 29</div>
            <div>y ＝ 29 － 24 ➔ <strong className="text-emerald-700 text-base">y ＝ 5</strong></div>
          </div>
          <p className="pt-1">Therefore, he made <strong>5 three-pointers</strong> (Choice <strong>E</strong>).</p>
        </div>
      ) : (
        <div className="space-y-4 text-xs sm:text-sm">
          <p>1. <strong>Εύρεση συνολικών εύστοχων σουτ:</strong> Έκανε 20 σουτ και ευστόχησε στο 60% αυτών.</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">Εύστοχα σουτ ＝ 20 · <Frac num="60" den="100" /></span>
            <span className="whitespace-nowrap">＝ 20 · 0,60 ＝ <strong>12 εύστοχα σουτ</strong></span>
          </div>
          <p>2. <strong>Δημιουργία εξισώσεων:</strong> Έστω <strong>x</strong> τα εύστοχα δίποντα και <strong>y</strong> τα εύστοχα τρίποντα:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 space-y-1.5 font-mono text-slate-900">
            <div>• Σύνολο εύστοχων: <strong>x ＋ y ＝ 12</strong></div>
            <div>• Σύνολο πόντων: <strong>2x ＋ 3y ＝ 29</strong></div>
          </div>
          <p>3. <strong>Επίλυση:</strong> Αναλύουμε το 2x ＋ 3y σε (x ＋ y) ＋ (x ＋ y) ＋ y:</p>
          <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>(x ＋ y) ＋ (x ＋ y) ＋ y ＝ 29</div>
            <div>12 ＋ 12 ＋ y ＝ 29 ➔ 24 ＋ y ＝ 29</div>
            <div>y ＝ 29 － 24 ➔ <strong className="text-emerald-700 text-base">y ＝ 5</strong></div>
          </div>
          <p className="pt-1">Επομένως, είχε <strong>5 εύστοχα τρίποντα</strong> (Επιλογή <strong>E</strong>).</p>
        </div>
      )
    },
    {
      id: 12,
      officialNumber: 32,
      group: groupB,
      promptText: isEn ? (
        <div className="space-y-3">
          <p>A mobile phone app performs the following steps:</p>
          <ul className="space-y-1.5 pl-4 sm:pl-6 text-slate-800 font-medium list-disc">
            <li><strong>Step 1:</strong> Asks the user for an integer.</li>
            <li><strong>Step 2:</strong> Doubles the number given by the user in Step 1.</li>
            <li><strong>Step 3:</strong> Asks the user for another integer.</li>
            <li><strong>Step 4:</strong> Adds the number given in Step 3 to the result of Step 2.</li>
            <li><strong>Step 5:</strong> Displays the result of Step 4.</li>
            <li><strong>Step 6:</strong> Displays the product of the numbers given by the user in Step 1 and Step 3.</li>
          </ul>
          <p>
            If the number displayed by the app in Step 5 is 11 and the number displayed in Step 6 is 15, then the number given by the user in Step 1 is:
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p>Μια εφαρμογή σε κινητό τηλέφωνο εκτελεί τα εξής βήματα:</p>
          <ul className="space-y-1.5 pl-4 sm:pl-6 text-slate-800 font-medium list-disc">
            <li><strong>Βήμα 1:</strong> Ζητάει από τον χρήστη έναν ακέραιο αριθμό.</li>
            <li><strong>Βήμα 2:</strong> Διπλασιάζει τον αριθμό που έδωσε ο χρήστης στο βήμα 1.</li>
            <li><strong>Βήμα 3:</strong> Ζητάει από τον χρήστη έναν ακέραιο αριθμό.</li>
            <li><strong>Βήμα 4:</strong> Προσθέτει τον αριθμό που έδωσε ο χρήστης στο βήμα 3 με το αποτέλεσμα του βήματος 2.</li>
            <li><strong>Βήμα 5:</strong> Γράφει το αποτέλεσμα του βήματος 4.</li>
            <li><strong>Βήμα 6:</strong> Γράφει το γινόμενο των αριθμών που έδωσε ο χρήστης στο βήμα 1 και το βήμα 3.</li>
          </ul>
          <p>
            Αν ο αριθμός που γράφει η εφαρμογή στο βήμα 5 είναι 11 και ο αριθμός που γράφει στο βήμα 6 είναι 15, τότε ο αριθμός που έδωσε ο χρήστης στο βήμα 1 είναι:
          </p>
        </div>
      ),
      options: [
        { key: 'A', label: '1', raw: '1' },
        { key: 'B', label: '2', raw: '2' },
        { key: isEn ? 'C' : 'Γ', label: '3', raw: '3' },
        { key: isEn ? 'D' : 'Δ', label: '4', raw: '4' },
        { key: 'E', label: '5', raw: '5' }
      ],
      correctRaw: '3',
      explain: isEn ? (
        <div className="space-y-4 text-xs sm:text-sm">
          <p>Let <strong>x</strong> be the integer given in Step 1 and <strong>y</strong> be the integer given in Step 3:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>(1) Step 5: y ＋ 2 · x ＝ 11</div>
            <div>(2) Step 6: x · y ＝ 15</div>
          </div>
          <p>Test integer pairs (x, y) whose product is 15:</p>
          <div className="space-y-2 bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            <div>• For <strong>x ＝ 1, y ＝ 15</strong>: 15 ＋ 2 · 1 ＝ 17 ≠ 11 ❌</div>
            <div>• For <strong>x ＝ 3, y ＝ 5</strong>: 5 ＋ 2 · 3 ＝ 5 ＋ 6 ＝ <strong className="text-emerald-700">11 ✅</strong></div>
          </div>
          <p className="pt-1">Thus, the integer <strong>x</strong> given in Step 1 is <strong>3</strong> (Choice <strong>C</strong>).</p>
        </div>
      ) : (
        <div className="space-y-4 text-xs sm:text-sm">
          <p>Συμβολίζουμε με <strong>x</strong> τον ακέραιο στο Βήμα 1 και με <strong>y</strong> τον ακέραιο στο Βήμα 3:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>(1) Βήμα 5: y ＋ 2 · x ＝ 11</div>
            <div>(2) Βήμα 6: x · y ＝ 15</div>
          </div>
          <p>Εξετάζουμε τα ζεύγη ακεραίων (x, y) με γινόμενο 15:</p>
          <div className="space-y-2 bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            <div>• Για <strong>x ＝ 1, y ＝ 15</strong>: 15 ＋ 2 · 1 ＝ 17 ≠ 11 ❌</div>
            <div>• Για <strong>x ＝ 3, y ＝ 5</strong>: 5 ＋ 2 · 3 ＝ 5 ＋ 6 ＝ <strong className="text-emerald-700">11 ✅</strong></div>
          </div>
          <p className="pt-1">Άρα, ο αριθμός <strong>x</strong> στο Βήμα 1 είναι το <strong>3</strong> (Επιλογή <strong>Γ</strong>).</p>
        </div>
      )
    },
    {
      id: 13,
      officialNumber: 33,
      group: groupB,
      promptText: isEn
        ? 'To make a fruit punch, 4 glasses of orange juice, 11 glasses of apple juice, and 13 glasses of pear juice are needed. To make a larger batch of fruit punch with the same ingredient ratio for a party, 45 more glasses of pear juice were used than glasses of orange juice. How many glasses of apple juice were used?'
        : 'Για την παρασκευή ενός φρουτοχυμού χρειάζονται 4 ποτήρια χυμού πορτοκαλιού, 11 ποτήρια χυμού μήλου και 13 ποτήρια χυμού αχλαδιού. Για την παρασκευή μεγαλύτερης ποσότητας φρουτοχυμού με την ίδια αναλογία συστατικών, για ένα πάρτι, τα ποτήρια χυμού αχλαδιού που χρησιμοποιήσαμε ήταν κατά 45 περισσότερα από τα ποτήρια χυμού πορτοκαλιού. Πόσα ποτήρια χυμού μήλου χρησιμοποιήσαμε;',
      options: [
        { key: 'A', label: '20', raw: '20' },
        { key: 'B', label: '55', raw: '55' },
        { key: isEn ? 'C' : 'Γ', label: '45', raw: '45' },
        { key: isEn ? 'D' : 'Δ', label: '65', raw: '65' },
        { key: 'E', label: '70', raw: '70' }
      ],
      correctRaw: '55',
      explain: isEn ? (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-200/80 space-y-2">
            <div className="font-sans font-bold text-emerald-900 text-sm border-b border-emerald-200 pb-1">
              💡 Method using Ratio Parts
            </div>
            <ul className="space-y-1.5 pl-4 sm:pl-5 text-slate-800 list-disc font-medium">
              <li>The ratio of Orange : Apple : Pear is <strong>4 : 11 : 13</strong>.</li>
              <li>Difference in parts between pear and orange: <strong>13 － 4 ＝ 9 parts</strong>.</li>
              <li>These 9 parts correspond to 45 glasses, so 1 part equals: <Frac num="45" den="9" /> ＝ <strong>5 glasses</strong>.</li>
              <li>Apple juice corresponds to 11 parts: <strong>11 · 5 ＝ 55 glasses</strong>.</li>
            </ul>
          </div>
          <p className="pt-1">Therefore, we used <strong>55 glasses</strong> of apple juice (Choice <strong>B</strong>).</p>
        </div>
      ) : (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-200/80 space-y-2">
            <div className="font-sans font-bold text-emerald-900 text-sm border-b border-emerald-200 pb-1">
              💡 Λύση με μερίδια (αναλογία 4 : 11 : 13)
            </div>
            <ul className="space-y-1.5 pl-4 sm:pl-5 text-slate-800 list-disc font-medium">
              <li>Η αναλογία Πορτοκάλι : Μήλο : Αχλάδι είναι <strong>4 : 11 : 13</strong>.</li>
              <li>Η διαφορά σε μερίδια μεταξύ αχλαδιού και πορτοκαλιού είναι: <strong>13 － 4 ＝ 9 μερίδια</strong>.</li>
              <li>Τα 9 μερίδια αντιστοιχούν σε 45 ποτήρια, άρα το 1 μερίδιο είναι: <Frac num="45" den="9" /> ＝ <strong>5 ποτήρια</strong>.</li>
              <li>Τα ποτήρια χυμού μήλου αντιστοιχούν σε 11 μερίδια: <strong>11 · 5 ＝ 55 ποτήρια</strong>.</li>
            </ul>
          </div>
          <p className="pt-1">Συνεπώς, χρησιμοποιήσαμε <strong>55 ποτήρια</strong> χυμού μήλου (Επιλογή <strong>Β</strong>).</p>
        </div>
      )
    },
    {
      id: 14,
      officialNumber: 34,
      group: groupB,
      promptText: isEn
        ? 'A cube consists of 27 identical small cubes, as shown in the figure below (with alternating white and black cubes). How many white small cubes are there?'
        : 'Ένας κύβος αποτελείται από 27 ίσα κυβάκια, όπως στο σχήμα που ακολουθεί (με εναλλάξ άσπρα και μαύρα κυβάκια). Πόσα είναι τα άσπρα κυβάκια;',
      hasSvg: 'cube34',
      options: [
        { key: 'A', label: '9', raw: '9' },
        { key: 'B', label: '12', raw: '12' },
        { key: isEn ? 'C' : 'Γ', label: '13', raw: '13' },
        { key: isEn ? 'D' : 'Δ', label: '14', raw: '14' },
        { key: 'E', label: '15', raw: '15' }
      ],
      correctRaw: '13',
      explain: isEn ? (
        <div className="space-y-4 text-xs sm:text-sm">
          <p>
            The 3 × 3 × 3 cube (27 small cubes) is decomposed into <strong>3 horizontal layers</strong> of 9 cubes each:
          </p>
          <div className="space-y-2 bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            <div>• <strong>Top layer:</strong> 4 white cubes (at the 4 corners)</div>
            <div>• <strong>Middle layer:</strong> 5 white cubes (at the 4 edge midpoints ＋ the center)</div>
            <div>• <strong>Bottom layer:</strong> 4 white cubes (at the 4 corners, matching the top layer)</div>
            <div className="pt-2 border-t border-slate-200 flex items-center gap-2 flex-wrap">
              <span>Total white cubes ＝ 4 ＋ 5 ＋ 4 ＝</span>
              <strong className="text-emerald-700 text-base">13 cubes</strong>
            </div>
          </div>
          <p className="pt-1">Thus, there are <strong>13</strong> white small cubes in total (Choice <strong>C</strong>).</p>
        </div>
      ) : (
        <div className="space-y-4 text-xs sm:text-sm">
          <p>
            Ο μεγάλος κύβος (3 × 3 × 3 ＝ 27 κυβάκια) αναλύεται σε <strong>3 οριζόντια επίπεδα (στρώσεις)</strong> των 9 κύβων:
          </p>
          <div className="space-y-2 bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            <div>• <strong>Πάνω στρώση:</strong> 4 άσπρα κυβάκια (στις 4 γωνίες)</div>
            <div>• <strong>Μεσαία στρώση:</strong> 5 άσπρα κυβάκια (στα 4 μέσα των πλευρών ＋ το κέντρο)</div>
            <div>• <strong>Κάτω στρώση:</strong> 4 άσπρα κυβάκια (στις 4 γωνίες, ακριβώς όπως η πάνω)</div>
            <div className="pt-2 border-t border-slate-200 flex items-center gap-2 flex-wrap">
              <span>Συνολικά άσπρα κυβάκια ＝ 4 ＋ 5 ＋ 4 ＝</span>
              <strong className="text-emerald-700 text-base">13 κυβάκια</strong>
            </div>
          </div>
          <p className="pt-1">Άρα, τα άσπρα κυβάκια είναι συνολικά <strong>13</strong> (Επιλογή <strong>Γ</strong>).</p>
        </div>
      )
    },
    {
      id: 15,
      officialNumber: 35,
      group: groupB,
      promptText: isEn
        ? 'How many three-digit positive integers have a product of digits equal to 6?'
        : 'Πόσοι τριψήφιοι θετικοί ακέραιοι αριθμοί έχουν γινόμενο ψηφίων ίσο με 6;',
      options: [
        { key: 'A', label: '3', raw: '3' },
        { key: 'B', label: '6', raw: '6' },
        { key: isEn ? 'C' : 'Γ', label: '8', raw: '8' },
        { key: isEn ? 'D' : 'Δ', label: '9', raw: '9' },
        { key: 'E', label: '12', raw: '12' }
      ],
      correctRaw: '9',
      explain: isEn ? (
        <div className="space-y-4 text-xs sm:text-sm">
          <p>No digit can be 0 (otherwise the product would be 0). The unique sets of 3 nonzero digits with product 6 are:</p>
          <div className="space-y-3 bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            <div className="border-b border-slate-200 pb-2.5 space-y-1.5">
              <div className="font-sans font-bold text-slate-950">1. Digits &#123;1, 1, 6&#125;:</div>
              <div className="pl-3 flex items-center gap-2 flex-wrap">
                <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-300 font-bold">116</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-300 font-bold">161</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-300 font-bold">611</span>
                <span className="text-slate-600 font-sans text-xs">➔ <strong>3 numbers</strong></span>
              </div>
            </div>
            <div className="space-y-1.5 pt-0.5">
              <div className="font-sans font-bold text-slate-950">2. Digits &#123;1, 2, 3&#125;:</div>
              <div className="pl-3 flex items-center gap-2 flex-wrap">
                <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-300 font-bold">123</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-300 font-bold">132</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-300 font-bold">213</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-300 font-bold">231</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-300 font-bold">312</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-300 font-bold">321</span>
                <span className="text-slate-600 font-sans text-xs">➔ <strong>6 numbers</strong></span>
              </div>
            </div>
          </div>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            Total ＝ 3 ＋ 6 ＝ <strong className="text-emerald-700 text-base">9 three-digit numbers</strong>
          </div>
          <p className="pt-1">Therefore, there are <strong>9</strong> such three-digit numbers (Choice <strong>D</strong>).</p>
        </div>
      ) : (
        <div className="space-y-4 text-xs sm:text-sm">
          <p>Κανένα ψηφίο δεν μπορεί να είναι 0. Οι μοναδικοί συνδυασμοί τριών ψηφίων με γινόμενο 6 είναι:</p>
          <div className="space-y-3 bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            <div className="border-b border-slate-200 pb-2.5 space-y-1.5">
              <div className="font-sans font-bold text-slate-950">1. Ψηφία &#123;1, 1, 6&#125;:</div>
              <div className="pl-3 flex items-center gap-2 flex-wrap">
                <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-300 font-bold">116</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-300 font-bold">161</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-300 font-bold">611</span>
                <span className="text-slate-600 font-sans text-xs">➔ <strong>3 αριθμοί</strong></span>
              </div>
            </div>
            <div className="space-y-1.5 pt-0.5">
              <div className="font-sans font-bold text-slate-950">2. Ψηφία &#123;1, 2, 3&#125;:</div>
              <div className="pl-3 flex items-center gap-2 flex-wrap">
                <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-300 font-bold">123</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-300 font-bold">132</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-300 font-bold">213</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-300 font-bold">231</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-300 font-bold">312</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-300 font-bold">321</span>
                <span className="text-slate-600 font-sans text-xs">➔ <strong>6 αριθμοί</strong></span>
              </div>
            </div>
          </div>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            Σύνολο ＝ 3 ＋ 6 ＝ <strong className="text-emerald-700 text-base">9 τριψήφιοι αριθμοί</strong>
          </div>
          <p className="pt-1">Συνεπώς, υπάρχουν <strong>9</strong> τέτοιοι τριψήφιοι αριθμοί (Επιλογή <strong>Δ</strong>).</p>
        </div>
      )
    },
    {
      id: 16,
      officialNumber: 36,
      group: groupB,
      promptText: isEn
        ? 'Inside a square with an area of 4 sq. cm., we drew five smaller equal squares. What is the area of the shaded square in sq. cm.?'
        : 'Μέσα σε ένα τετράγωνο με εμβαδόν 4 τ. εκ. σχεδιάσαμε πέντε μικρότερα και ίσα μεταξύ τους τετράγωνα. Ποιο είναι το εμβαδόν του σκιασμένου τετραγώνου σε τ. εκ.;',
      hasSvg: 'squares36',
      options: [
        { key: 'A', label: isEn ? '0.5' : '0,5', raw: isEn ? '0.5' : '0,5' },
        { key: 'B', label: isEn ? '0.8' : '0,8', raw: isEn ? '0.8' : '0,8' },
        { key: isEn ? 'C' : 'Γ', label: isEn ? '0.4' : '0,4', raw: isEn ? '0.4' : '0,4' },
        { key: isEn ? 'D' : 'Δ', label: isEn ? '0.3' : '0,3', raw: isEn ? '0.3' : '0,3' },
        { key: 'E', label: isEn ? 'None of the above' : 'Κανένα από τα προηγούμενα', raw: isEn ? 'None of the above' : 'Κανένα από τα προηγούμενα' }
      ],
      correctRaw: isEn ? '0.5' : '0,5',
      explain: isEn ? (
        <div className="space-y-4 text-xs sm:text-sm">
          <p>Count how many equal small squares make up the entire 4 sq. cm. square:</p>
          <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• <strong>5 whole squares:</strong> The 4 outer tilted squares ＋ the 1 shaded center square.</div>
            <div>• <strong>6th &amp; 7th squares:</strong> The 4 edge triangles combine in pairs to form 2 equal squares.</div>
            <div>• <strong>8th square:</strong> The 4 corner right triangles combine to form 1 more equal square.</div>
          </div>
          <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span>Area of shaded square ＝</span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <Frac num="4" den="8" /> ＝ <Frac num="1" den="2" /> ＝ <strong className="text-emerald-700 text-base">0.5 sq. cm.</strong>
            </span>
          </div>
          <p className="pt-1">Thus, the area of the shaded square is <strong>0.5 sq. cm.</strong> (Choice <strong>A</strong>).</p>
        </div>
      ) : (
        <div className="space-y-4 text-xs sm:text-sm">
          <p>Μετράμε πόσα ίσα μικρά τετράγωνα σχηματίζουν συνολικά το αρχικό τετράγωνο των 4 τ. εκ.:</p>
          <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• <strong>5 ακέραια τετράγωνα:</strong> Τα 4 εξωτερικά ＋ το 1 κεντρικό σκιασμένο.</div>
            <div>• <strong>6ο &amp; 7ο τετράγωνο:</strong> Τα 4 πλευρικά τρίγωνα ενώνονται ανά δύο σε 2 ίσα τετράγωνα.</div>
            <div>• <strong>8ο τετράγωνο:</strong> Τα 4 γωνιακά τριγωνάκια ενώνονται και σχηματίζουν 1 ακόμη ίσο τετράγωνο.</div>
          </div>
          <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span>Εμβαδόν σκιασμένου ＝</span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <Frac num="4" den="8" /> ＝ <Frac num="1" den="2" /> ＝ <strong className="text-emerald-700 text-base">0,5 τ. εκ.</strong>
            </span>
          </div>
          <p className="pt-1">Άρα, το εμβαδόν του σκιασμένου τετραγώνου είναι <strong>0,5 τ. εκ.</strong> (Επιλογή <strong>A</strong>).</p>
        </div>
      )
    },
    {
      id: 17,
      officialNumber: 37,
      group: groupB,
      promptText: isEn
        ? 'A bottle full of water weighs a certain amount. If we pour out half of the water, the total weight becomes 60% of the original weight. What is the ratio of the weight of the empty bottle to the weight of the water it holds?'
        : 'Ένα μπουκάλι γεμάτο με νερό ζυγίζει ένα ορισμένο βάρος. Αν αδειάσουμε το μισό νερό, το συνολικό βάρος γίνεται το 60% του αρχικού βάρους. Ποιος είναι ο λόγος του βάρους του άδειου μπουκαλιού προς το βάρος του νερού που χωράει;',
      options: [
        { key: 'A', label: <Frac num="1" den="5" />, raw: '1/5' },
        { key: 'B', label: <Frac num="1" den="3" />, raw: '1/3' },
        { key: isEn ? 'C' : 'Γ', label: <Frac num="6" den="10" />, raw: '6/10' },
        { key: isEn ? 'D' : 'Δ', label: <Frac num="4" den="6" />, raw: '4/6' },
        { key: 'E', label: <Frac num="1" den="4" />, raw: '1/4' }
      ],
      correctRaw: '1/4',
      explain: isEn ? (
        <div className="space-y-4 text-xs sm:text-sm">
          <p>Let <strong>x</strong> be the weight of the water when full and <strong>y</strong> be the weight of the empty bottle.</p>
          <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div><Frac num="x" den="2" /> ＋ y ＝ 60% · (x ＋ y) ＝ 0.6 · (x ＋ y)</div>
            <div>x ＋ 2y ＝ 1.2 · (x ＋ y) ＝ 1.2x ＋ 1.2y</div>
            <div>2y － 1.2y ＝ 1.2x － x ➔ 0.8y ＝ 0.2x ➔ 4y ＝ x</div>
            <div className="pt-2 border-t border-slate-200 flex items-center gap-2 flex-wrap">
              <span>Ratio:</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="y" den="x" /> ＝ <strong className="text-emerald-700 text-base"><Frac num="1" den="4" /></strong>
              </span>
            </div>
          </div>
          <p className="pt-1">Therefore, the ratio is <strong><Frac num="1" den="4" /></strong> (Choice <strong>E</strong>).</p>
        </div>
      ) : (
        <div className="space-y-4 text-xs sm:text-sm">
          <p>Έστω <strong>x</strong> το βάρος του νερού όταν το μπουκάλι είναι γεμάτο και <strong>y</strong> το βάρος του άδειου μπουκαλιού.</p>
          <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div><Frac num="x" den="2" /> ＋ y ＝ 60% · (x ＋ y) ＝ 0,6 · (x ＋ y)</div>
            <div>x ＋ 2y ＝ 1,2 · (x ＋ y) ＝ 1,2x ＋ 1,2y</div>
            <div>2y － 1,2y ＝ 1,2x － x ➔ 0,8y ＝ 0,2x ➔ 4y ＝ x</div>
            <div className="pt-2 border-t border-slate-200 flex items-center gap-2 flex-wrap">
              <span>Λόγος:</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="y" den="x" /> ＝ <strong className="text-emerald-700 text-base"><Frac num="1" den="4" /></strong>
              </span>
            </div>
          </div>
          <p className="pt-1">Επομένως, ο λόγος είναι <strong><Frac num="1" den="4" /></strong> (Επιλογή <strong>E</strong>).</p>
        </div>
      )
    },
    {
      id: 18,
      officialNumber: 38,
      group: groupB,
      promptText: isEn
        ? 'A rectangle is subdivided into nine smaller rectangles of different dimensions, as shown in the figure below. If the perimeters of A, B, and C are 36 cm, 56 cm, and 50 cm respectively, what is the perimeter of the original rectangle?'
        : 'Ένα ορθογώνιο παραλληλόγραμμο έχει υποδιαιρεθεί σε εννιά μικρότερα ορθογώνια παραλληλόγραμμα διαφορετικών διαστάσεων, όπως στο σχήμα που ακολουθεί. Αν οι περίμετροι των Α, Β και Γ είναι 36 εκ., 56 εκ. και 50 εκ. αντίστοιχα, ποια είναι η περίμετρος του αρχικού ορθογωνίου;',
      hasSvg: 'grid38',
      options: isEn
        ? [
            { key: 'A', label: '138 cm', raw: '138 cm' },
            { key: 'B', label: '150 cm', raw: '150 cm' },
            { key: 'C', label: '146 cm', raw: '146 cm' },
            { key: 'D', label: '142 cm', raw: '142 cm' },
            { key: 'E', label: 'Cannot be calculated from the given data', raw: 'Cannot be calculated' }
          ]
        : [
            { key: 'A', label: '138 εκ.', raw: '138 εκ.' },
            { key: 'B', label: '150 εκ.', raw: '150 εκ.' },
            { key: 'Γ', label: '146 εκ.', raw: '146 εκ.' },
            { key: 'Δ', label: '142 εκ.', raw: '142 εκ.' },
            { key: 'E', label: 'Δεν μπορούμε να την υπολογίσουμε με βάση τα δεδομένα', raw: 'Δεν μπορούμε να την υπολογίσουμε' }
          ],
      correctRaw: isEn ? '142 cm' : '142 εκ.',
      explain: isEn ? (
        <div className="space-y-4 text-xs sm:text-sm">
          <p>
            Because A, B, and C lie along the diagonal in three distinct columns and three distinct rows, their widths sum to the total width of the large rectangle and their heights sum to the total height.
          </p>
          <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>Total Perimeter ＝ Perimeter(A) ＋ Perimeter(B) ＋ Perimeter(C)</div>
            <div>Total Perimeter ＝ 36 ＋ 56 ＋ 50 ＝ <strong className="text-emerald-700 text-base">142 cm</strong></div>
          </div>
          <p className="pt-1">Therefore, the perimeter of the original rectangle is <strong>142 cm</strong> (Choice <strong>D</strong>).</p>
        </div>
      ) : (
        <div className="space-y-4 text-xs sm:text-sm">
          <p>
            Επειδή τα Α, Β και Γ βρίσκονται σε 3 διαφορετικές στήλες και 3 διαφορετικές γραμμές, το άθροισμα των πλατών τους ισούται με το ολικό πλάτος και το άθροισμα των υψών τους με το ολικό ύψος του μεγάλου ορθογωνίου.
          </p>
          <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>Περίμετρος Μεγάλου ＝ Περίμετρος(Α) ＋ Περίμετρος(Β) ＋ Περίμετρος(Γ)</div>
            <div>Περίμετρος Μεγάλου ＝ 36 ＋ 56 ＋ 50 ＝ <strong className="text-emerald-700 text-base">142 εκ.</strong></div>
          </div>
          <p className="pt-1">Επομένως, η περίμετρος του αρχικού ορθογωνίου είναι <strong>142 εκ.</strong> (Επιλογή <strong>Δ</strong>).</p>
        </div>
      )
    },
    {
      id: 19,
      officialNumber: 39,
      group: groupB,
      promptText: isEn
        ? 'If someone leaves home for the beach on a bicycle at a speed of 25 km/h, they arrive at 3:00 PM. If they walk at a speed of 5 km/h, they arrive at 3:40 PM. What time did they leave home?'
        : 'Αν κάποιος ξεκινήσει από το σπίτι του για την παραλία με το ποδήλατό του με ταχύτητα 25 χλμ./ώρα, φτάνει στις 3:00 μ.μ. Αν πάει με τα πόδια με ταχύτητα 5 χλμ./ώρα, φτάνει στις 3:40 μ.μ. Τι ώρα ξεκίνησε από το σπίτι του;',
      options: isEn
        ? [
            { key: 'A', label: '2:30 PM', raw: '2:30 PM' },
            { key: 'B', label: '2:40 PM', raw: '2:40 PM' },
            { key: 'C', label: '2:45 PM', raw: '2:45 PM' },
            { key: 'D', label: '2:50 PM', raw: '2:50 PM' },
            { key: 'E', label: '2:55 PM', raw: '2:55 PM' }
          ]
        : [
            { key: 'A', label: '2:30 μ.μ.', raw: '2:30 μ.μ.' },
            { key: 'B', label: '2:40 μ.μ.', raw: '2:40 μ.μ.' },
            { key: 'Γ', label: '2:45 μ.μ.', raw: '2:45 μ.μ.' },
            { key: 'Δ', label: '2:50 μ.μ.', raw: '2:50 μ.μ.' },
            { key: 'E', label: '2:55 μ.μ.', raw: '2:55 μ.μ.' }
          ],
      correctRaw: isEn ? '2:50 PM' : '2:50 μ.μ.',
      explain: isEn ? (
        <div className="space-y-4 text-xs sm:text-sm">
          <p>
            The bicycle speed is <strong>5 times faster</strong> than walking speed (<Frac num="25" den="5" /> ＝ 5), so walking takes <strong>5 times longer</strong> for the same distance:
          </p>
          <ul className="space-y-1.5 pl-4 sm:pl-5 text-slate-800 list-disc font-medium">
            <li>Bicycle time ＝ <strong>1 part</strong> (arrival at 3:00 PM).</li>
            <li>Walking time ＝ <strong>5 parts</strong> (arrival at 3:40 PM).</li>
            <li>The 40-minute difference corresponds to 5 － 1 ＝ <strong>4 parts</strong>, so 1 part ＝ <Frac num="40" den="4" /> ＝ <strong>10 minutes</strong>.</li>
          </ul>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            Departure time ＝ 3:00 PM － 10 minutes ➔ <strong className="text-emerald-700 text-base">2:50 PM</strong>
          </div>
          <p className="pt-1">Thus, they left home at <strong>2:50 PM</strong> (Choice <strong>D</strong>).</p>
        </div>
      ) : (
        <div className="space-y-4 text-xs sm:text-sm">
          <p>
            Η ταχύτητα με το ποδήλατο είναι <strong>5 φορές μεγαλύτερη</strong> (<Frac num="25" den="5" /> ＝ 5), άρα με τα πόδια χρειάζεται <strong>5πλάσιο χρόνο</strong> για την ίδια απόσταση:
          </p>
          <ul className="space-y-1.5 pl-4 sm:pl-5 text-slate-800 list-disc font-medium">
            <li>Χρόνος με ποδήλατο ＝ <strong>1 μέρος</strong> (άφιξη στις 3:00 μ.μ.).</li>
            <li>Χρόνος με τα πόδια ＝ <strong>5 μέρη</strong> (άφιξη στις 3:40 μ.μ.).</li>
            <li>Η διαφορά των 40 λεπτών αντιστοιχεί σε 5 － 1 ＝ <strong>4 μέρη</strong>, άρα 1 μέρος ＝ <Frac num="40" den="4" /> ＝ <strong>10 λεπτά</strong>.</li>
          </ul>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            Ώρα εκκίνησης ＝ 3:00 μ.μ. － 10 λεπτά ➔ <strong className="text-emerald-700 text-base">2:50 μ.μ.</strong>
          </div>
          <p className="pt-1">Συνεπώς, ξεκίνησε στις <strong>2:50 μ.μ.</strong> (Επιλογή <strong>Δ</strong>).</p>
        </div>
      )
    },
    {
      id: 20,
      officialNumber: 40,
      group: groupB,
      promptText: isEn
        ? 'In a three-story building, all floors are identical and have the same height. The distance from the bottom of the 3rd-floor window to the top of the 2nd-floor window is 150 cm. The distance from the top of the 3rd-floor window to the bottom of the 2nd-floor window is 430 cm. What is the height of each floor in centimeters?'
        : 'Σε ένα τριώροφο κτίριο όλοι οι όροφοι είναι πανομοιότυποι και έχουν το ίδιο ύψος. Η απόσταση από το κάτω μέρος του παραθύρου του 3ου ορόφου μέχρι το πάνω μέρος του παραθύρου του 2ου ορόφου είναι 150 εκ. Η απόσταση από το πάνω μέρος του παραθύρου του 3ου ορόφου μέχρι το κάτω μέρος του παραθύρου του 2ου ορόφου είναι 430 εκ. Ποιο είναι το ύψος του κάθε ορόφου σε εκατοστά;',
      hasSvg: 'building40',
      options: [
        { key: 'A', label: '280', raw: '280' },
        { key: 'B', label: '285', raw: '285' },
        { key: isEn ? 'C' : 'Γ', label: '290', raw: '290' },
        { key: isEn ? 'D' : 'Δ', label: '295', raw: '295' },
        { key: 'E', label: '300', raw: '300' }
      ],
      correctRaw: '290',
      explain: isEn ? (
        <div className="space-y-4 text-xs sm:text-sm">
          <p>
            Adding the two given distances (430 cm ＋ 150 cm) covers the exact vertical span of <strong>two identical floors</strong> (2 windows ＋ 2 upper wall gaps ＋ 2 lower wall gaps):
          </p>
          <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>Height of 2 floors ＝ 430 ＋ 150 ＝ <strong>580 cm</strong></div>
            <div className="pt-1 flex items-center gap-1.5 flex-wrap">
              <span>Height of 1 floor ＝</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="580" den="2" /> ＝ <strong className="text-emerald-700 text-base">290 cm</strong>
              </span>
            </div>
          </div>
          <p className="pt-1">Therefore, the height of each floor is <strong>290 cm</strong> (Choice <strong>C</strong>).</p>
        </div>
      ) : (
        <div className="space-y-4 text-xs sm:text-sm">
          <p>
            Προσθέτοντας τις δύο δοσμένες αποστάσεις (430 εκ. ＋ 150 εκ.), καλύπτουμε ακριβώς το κατακόρυφο ύψος <strong>δύο ολόκληρων ορόφων</strong> (2 παράθυρα ＋ 2 πάνω διαστήματα ＋ 2 κάτω διαστήματα):
          </p>
          <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>Ύψος 2 ορόφων ＝ 430 ＋ 150 ＝ <strong>580 εκ.</strong></div>
            <div className="pt-1 flex items-center gap-1.5 flex-wrap">
              <span>Ύψος 1 ορόφου ＝</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="580" den="2" /> ＝ <strong className="text-emerald-700 text-base">290 εκ.</strong>
              </span>
            </div>
          </div>
          <p className="pt-1">Άρα, το ύψος του κάθε ορόφου είναι <strong>290 εκ.</strong> (Επιλογή <strong>Γ</strong>).</p>
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

export default function Themata2025Page() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const isEn = locale === 'en';
  const t = I18N[locale];
  const questions = getQuestions2025(locale);

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

  const schema2025 = [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": t.schemaHome, "item": `${baseUrl}/` },
        { "@type": "ListItem", "position": 2, "name": t.schemaHub, "item": `${baseUrl}/protipa/protipa` },
        { "@type": "ListItem", "position": 3, "name": t.schemaCurrent, "item": `${baseUrl}/protipa/themata-2025` }
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
    if (q.hasTable === 'table23') {
      return (
        <div className="my-3">
          <table
            className="w-full table-fixed text-xs sm:text-sm border-collapse bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 text-center"
            aria-label={t.table23Aria}
          >
            <thead>
              <tr className="bg-slate-200/80 text-slate-800 font-black">
                {t.table23Headers.map((h, i) => (
                  <th key={i} className="p-2.5 border-b border-slate-200 break-words">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {t.table23Rows.map((row, idx) => (
                <tr key={idx} className={idx < t.table23Rows.length - 1 ? 'border-b border-slate-100' : ''}>
                  <td className="p-2 font-bold break-words">{row.shop}</td>
                  <td className="p-2 break-words">{row.price}</td>
                  <td className="p-2 font-mono">{row.disc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (q.hasTable === 'table25') {
      return (
        <div className="my-3">
          <table
            className="w-full table-fixed text-xs sm:text-sm border-collapse bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 text-center"
            aria-label={t.table25Aria}
          >
            <thead>
              <tr className="bg-slate-200/80 text-slate-800 font-black">
                {t.table25Headers.map((h, i) => (
                  <th key={i} className="p-2.5 border-b border-slate-200 break-words">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {t.table25Rows.map((row, idx) => (
                <tr key={idx} className={idx < t.table25Rows.length - 1 ? 'border-b border-slate-100' : ''}>
                  <td className="p-2 font-bold break-words">{row.sport}</td>
                  <td className="p-2 font-mono">{row.boys}</td>
                  <td className={`p-2 font-mono ${idx === 2 ? 'font-bold text-indigo-600' : ''}`}>{row.girls}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (q.hasSvg === 'foodChart30') {
      return (
        <div className="flex justify-center p-3 bg-slate-50 rounded-2xl border border-slate-200 my-3">
          <svg
            viewBox="0 0 370 195"
            className="w-full max-w-[370px] h-auto select-none mx-auto block font-sans"
            role="img"
            aria-label={t.foodChartAria}
          >
            {[0, 5, 10, 15, 20, 25, 30].map((val) => {
              const y = 140 - (val / 30) * 120;
              return (
                <g key={val}>
                  <line x1="30" y1={y} x2="360" y2={y} stroke="#cbd5e1" strokeWidth="1" />
                  <text x="24" y={y + 3.5} fontSize="9" fontWeight="bold" textAnchor="end" fill="#64748b">{val}</text>
                </g>
              );
            })}

            {t.foodCols.map((col, idx) => {
              const x = 40 + idx * 39;
              const h = (col.val / 30) * 120;
              const y = 140 - h;
              const cx = x + 11;

              return (
                <g key={idx}>
                  <rect x={x} y={y} width="22" height={h} fill={col.isAnimal ? '#0284c7' : '#0369a1'} rx="2" />
                  {col.lines.length === 1 ? (
                    <text x={cx} y="156" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#334155">
                      {col.lines[0]}
                    </text>
                  ) : (
                    <text x={cx} y="153" fontSize="7.5" fontWeight="bold" textAnchor="middle" fill="#334155">
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

    if (q.hasSvg === 'cube34') {
      const cx = 105;
      const cy = 76;
      const ux = 22;
      const uy = 12.7;
      const vx = -22;
      const vy = 12.7;
      const h = 25.4;

      const topTiles = [];
      const leftTiles = [];
      const rightTiles = [];

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const isDark = (i + j) % 2 === 0;
          const p0 = [cx + i * ux + j * vx, cy - i * uy - j * vy];
          const p1 = [cx + (i + 1) * ux + j * vx, cy - (i + 1) * uy - j * vy];
          const p2 = [cx + (i + 1) * ux + (j + 1) * vx, cy - (i + 1) * uy - (j + 1) * vy];
          const p3 = [cx + i * ux + (j + 1) * vx, cy - i * uy - (j + 1) * vy];

          topTiles.push({
            pts: `${p0[0]},${p0[1]} ${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${p3[0]},${p3[1]}`,
            fill: isDark ? '#64748b' : '#ffffff'
          });
        }
      }

      for (let j = 0; j < 3; j++) {
        for (let k = 0; k < 3; k++) {
          const isDark = (j + k) % 2 === 0;
          const p0 = [cx + j * vx, cy - j * vy + k * h];
          const p1 = [cx + (j + 1) * vx, cy - (j + 1) * vy + k * h];
          const p2 = [cx + (j + 1) * vx, cy - (j + 1) * vy + (k + 1) * h];
          const p3 = [cx + j * vx, cy - j * vy + (k + 1) * h];

          leftTiles.push({
            pts: `${p0[0]},${p0[1]} ${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${p3[0]},${p3[1]}`,
            fill: isDark ? '#64748b' : '#ffffff'
          });
        }
      }

      for (let i = 0; i < 3; i++) {
        for (let k = 0; k < 3; k++) {
          const isDark = (i + k) % 2 === 0;
          const p0 = [cx + i * ux, cy - i * uy + k * h];
          const p1 = [cx + (i + 1) * ux, cy - (i + 1) * uy + k * h];
          const p2 = [cx + (i + 1) * ux, cy - (i + 1) * uy + (k + 1) * h];
          const p3 = [cx + i * ux, cy - i * uy + (k + 1) * h];

          rightTiles.push({
            pts: `${p0[0]},${p0[1]} ${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${p3[0]},${p3[1]}`,
            fill: isDark ? '#64748b' : '#ffffff'
          });
        }
      }

      return (
        <div className="flex justify-center p-3 bg-slate-50 rounded-2xl border border-slate-200 my-3">
          <svg
            viewBox="0 0 210 190"
            className="w-full max-w-[210px] h-auto select-none mx-auto block"
            role="img"
            aria-label={t.cube34Aria}
          >
            {topTiles.map((tile, idx) => (
              <polygon key={`top-${idx}`} points={tile.pts} fill={tile.fill} stroke="#0f172a" strokeWidth="1.8" strokeLinejoin="round" />
            ))}
            {leftTiles.map((tile, idx) => (
              <polygon key={`left-${idx}`} points={tile.pts} fill={tile.fill} stroke="#0f172a" strokeWidth="1.8" strokeLinejoin="round" />
            ))}
            {rightTiles.map((tile, idx) => (
              <polygon key={`right-${idx}`} points={tile.pts} fill={tile.fill} stroke="#0f172a" strokeWidth="1.8" strokeLinejoin="round" />
            ))}
          </svg>
        </div>
      );
    }

    if (q.hasSvg === 'squares36') {
      return (
        <div className="flex justify-center p-3 bg-slate-50 rounded-2xl border border-slate-200 my-3">
          <svg
            viewBox="0 0 160 160"
            className="w-full max-w-[180px] h-auto select-none mx-auto block"
            role="img"
            aria-label={t.squares36Aria}
          >
            <rect x="20" y="20" width="120" height="120" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
            <polygon points="80,50 110,80 80,110 50,80" fill="#64748b" stroke="#1e293b" strokeWidth="2" />
            <polygon points="50,20 80,50 50,80 20,50" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
            <polygon points="110,20 140,50 110,80 80,50" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
            <polygon points="20,110 50,80 80,110 50,140" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
            <polygon points="80,110 110,80 140,110 110,140" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
            <circle cx="20" cy="20" r="2.5" fill="#1e293b" />
            <circle cx="140" cy="20" r="2.5" fill="#1e293b" />
            <circle cx="20" cy="140" r="2.5" fill="#1e293b" />
            <circle cx="140" cy="140" r="2.5" fill="#1e293b" />
          </svg>
        </div>
      );
    }

    if (q.hasSvg === 'grid38') {
      const [gA, gB, gC] = t.grid38Labels;
      return (
        <div className="flex justify-center p-3 bg-slate-50 rounded-2xl border border-slate-200 my-3">
          <svg
            viewBox="0 0 230 160"
            className="w-full max-w-[230px] h-auto select-none mx-auto block font-sans"
            role="img"
            aria-label={t.grid38Aria}
          >
            <rect x="25" y="20" width="180" height="120" fill="#ffffff" stroke="#000000" strokeWidth="2.2" />
            <line x1="85" y1="20" x2="85" y2="140" stroke="#000000" strokeWidth="1.8" />
            <line x1="135" y1="20" x2="135" y2="140" stroke="#000000" strokeWidth="1.8" />
            <line x1="25" y1="52" x2="205" y2="52" stroke="#000000" strokeWidth="1.8" />
            <line x1="25" y1="104" x2="205" y2="104" stroke="#000000" strokeWidth="1.8" />
            <text x="55" y="41" fontSize="18" fontWeight="bold" textAnchor="middle" fill="#000000">{gA}</text>
            <text x="110" y="84" fontSize="18" fontWeight="bold" textAnchor="middle" fill="#000000">{gB}</text>
            <text x="170" y="127" fontSize="18" fontWeight="bold" textAnchor="middle" fill="#000000">{gC}</text>
          </svg>
        </div>
      );
    }

    if (q.hasSvg === 'building40') {
      return (
        <div className="flex justify-center p-3 bg-slate-50 rounded-2xl border border-slate-200 my-3">
          <svg
            viewBox="0 0 350 250"
            className="w-full max-w-[350px] h-auto select-none mx-auto block font-sans"
            role="img"
            aria-label={t.building40Aria}
          >
            <defs>
              <marker id="arrow-b40" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#0f172a" />
              </marker>
            </defs>
            <rect x="190" y="20" width="140" height="70" fill="#ffffff" stroke="#0f172a" strokeWidth="2.2" />
            <rect x="190" y="90" width="140" height="70" fill="#ffffff" stroke="#0f172a" strokeWidth="2.2" />
            <rect x="190" y="160" width="140" height="70" fill="#ffffff" stroke="#0f172a" strokeWidth="2.2" />
            <rect x="230" y="32" width="26" height="34" fill="#ffffff" stroke="#0f172a" strokeWidth="1.8" />
            <rect x="230" y="102" width="26" height="34" fill="#ffffff" stroke="#0f172a" strokeWidth="1.8" />
            <rect x="230" y="172" width="26" height="34" fill="#ffffff" stroke="#0f172a" strokeWidth="1.8" />
            <line x1="60" y1="32" x2="230" y2="32" stroke="#475569" strokeWidth="1.2" strokeDasharray="3 3" />
            <line x1="128" y1="66" x2="230" y2="66" stroke="#475569" strokeWidth="1.2" strokeDasharray="3 3" />
            <line x1="128" y1="102" x2="230" y2="102" stroke="#475569" strokeWidth="1.2" strokeDasharray="3 3" />
            <line x1="60" y1="136" x2="230" y2="136" stroke="#475569" strokeWidth="1.2" strokeDasharray="3 3" />
            <text x="46" y="88" fontSize="11" fontWeight="bold" textAnchor="end" fill="#0f172a">{t.b430}</text>
            <line x1="60" y1="38" x2="60" y2="130" stroke="#0f172a" strokeWidth="1.6" markerStart="url(#arrow-b40)" markerEnd="url(#arrow-b40)" />
            <text x="114" y="88" fontSize="10" fontWeight="bold" textAnchor="end" fill="#0f172a">{t.b150}</text>
            <line x1="128" y1="72" x2="128" y2="96" stroke="#0f172a" strokeWidth="1.6" markerStart="url(#arrow-b40)" markerEnd="url(#arrow-b40)" />
            <text x="114" y="193" fontSize="11" fontWeight="bold" textAnchor="end" fill="#0f172a">{t.bWindow}</text>
            <line x1="120" y1="189" x2="224" y2="197" stroke="#0f172a" strokeWidth="1.5" markerEnd="url(#arrow-b40)" />
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
      schemaData={schema2025}
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
          {questions.map((q) => {
            const userChoice = answers[q.id];
            const isCorrect = userChoice === q.correctRaw;
            const pointsValue = q.officialNumber <= 30 ? 2 : 3;

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

                {/* ΣΧΗΜΑΤΑ / ΠΙΝΑΚΕΣ */}
                {renderQuestionVisual(q)}

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