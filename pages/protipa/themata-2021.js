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

// Component για κάθετη απεικόνιση κλασμάτων
function Frac({ num, den, inline = true }) {
  return (
    <span className={`${inline ? 'inline-flex' : 'flex'} flex-col items-center justify-center align-middle mx-1 font-mono font-bold text-sm leading-none select-none`}>
      <span className="border-b-2 border-current px-1 pb-0.5 text-center w-full block">{num}</span>
      <span className="pt-0.5 text-center w-full block">{den}</span>
    </span>
  );
}

// Component για δυνάμεις (χωρίς ^ και χωρίς Unicode εκθέτες)
function Pow({ base, exp }) {
  return (
    <span className="inline-flex items-baseline font-mono">
      <span>{base}</span>
      <sup className="text-[0.72em] leading-none font-bold ml-[1px] -top-[0.45em] relative">
        {exp}
      </sup>
    </span>
  );
}

// Component για τετραγωνική ρίζα με απόλυτη ευθυγράμμιση SVG + vinculum
function Radical({ children }) {
  return (
    <span className="inline-flex items-stretch align-baseline font-mono mx-0.5">
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
    metaTitle: 'Θέματα Προτύπων 2021 – Επίσημα Θέματα & Αναλυτικές Λύσεις | LearnMaths.gr',
    metaDesc: 'Λύσε online τα 25 επίσημα θέματα Μαθηματικών για τα Πρότυπα Γυμνάσια 2021 (026–050), με χρονόμετρο 60 λεπτών, αυτόματη βαθμολόγηση και αναλυτικές λύσεις.',
    backText: 'Θέματα Προτύπων',
    heroBadge: 'Επίσημα Θέματα 2021 • 25 Ερωτήσεις Μαθηματικών',
    heroTitle: 'Θέματα Προτύπων Γυμνασίων 2021 – Online Τεστ & Λύσεις',
    heroSubtitle: 'Εξασκήσου στα επίσημα θέματα Μαθηματικών των εξετάσεων εισαγωγής στα Πρότυπα Γυμνάσια 2021. Περιλαμβάνει και τις 25 ερωτήσεις (026–050) με αυτόματη βαθμολόγηση (2 μόρια ανά θέμα, Άριστα: 50), χρονόμετρο 60 λεπτών και αναλυτικές λύσεις.',
    answeredLabel: 'Απαντημένες:',
    of25: 'από 25',
    scoringLabel: 'Βαθμολογία:',
    scoringValue: '2 μόρια ανά θέμα (Άριστα: 50)',
    timerOn: '⏳ Χρονόμετρο: 60 λεπτά',
    timerOff: '⏳ Χρονόμετρο: Ανενεργό',
    resultTitle: 'Αποτέλεσμα Εξέτασης Προτύπων 2021',
    finalScoreLabel: 'Τελικό Σκορ',
    correctOutOf: (c) => `(${c} σωστές στις 25 ερωτήσεις)`,
    resultSubtitle: 'Δες παρακάτω αναλυτικά τις απαντήσεις σου με πλήρη μαθηματική τεκμηρίωση για κάθε θέμα.',
    questionPrefix: 'Θέμα',
    groupA: 'ΟΜΑΔΑ Α (4 ΕΠΙΛΟΓΕΣ)',
    groupB: 'ΟΜΑΔΑ Β (4 ΕΠΙΛΟΓΕΣ)',
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
    graphXAxis: 'Χρόνος σε λεπτά',
    graphYAxis: 'Απόσταση',
    graphAria: 'Γραφική παράσταση απόστασης-χρόνου σχολικού λεωφορείου',
    schemaHome: 'Αρχική',
    schemaHub: 'Ενδεικτικά Θέματα Προτύπων 2026',
    schemaCurrent: 'Θέματα Προτύπων Γυμνασίων 2021',
    schemaQuizName: 'Επίσημα Θέματα Μαθηματικών Προτύπων Γυμνασίων 2021 (Με Λύσεις)',
    schemaQuizDesc: 'Διαδραστικό τεστ με τα 25 επίσημα θέματα Μαθηματικών των εξετάσεων εισαγωγής στα Πρότυπα Γυμνάσια 2021 (026–050), χρονόμετρο 60 λεπτών, αυτόματη βαθμολόγηση (0–50) και αναλυτικές λύσεις.',
    schemaEduLevel: "ΣΤ' Δημοτικού",
    schemaQuestionName: (num) => `Θέμα ${num} - Πρότυπα 2021`
  },
  en: {
    metaTitle: 'Model School 2021 Math Past Paper – Online Test & Solutions | LearnMaths.gr',
    metaDesc: 'Practice online with the 25 official Mathematics questions from the 2021 Model Middle School entrance exam (026–050), 60-minute timer, auto-grading, and full solutions.',
    backText: 'Model School Exams',
    heroBadge: 'Official 2021 Exam • 25 Mathematics Questions',
    heroTitle: 'Model Middle Schools 2021 Math Exam – Online Test & Solutions',
    heroSubtitle: 'Practice with the official Mathematics questions from the 2021 Model Middle School entrance exams. Includes all 25 questions (026–050) with automatic scoring (2 points per question, Max: 50), a 60-minute timer, and step-by-step solutions.',
    answeredLabel: 'Answered:',
    of25: 'of 25',
    scoringLabel: 'Scoring:',
    scoringValue: '2 points per question (Max: 50)',
    timerOn: '⏳ Timer: 60 minutes',
    timerOff: '⏳ Timer: Disabled',
    resultTitle: '2021 Model School Exam Results',
    finalScoreLabel: 'Final Score',
    correctOutOf: (c) => `(${c} correct out of 25 questions)`,
    resultSubtitle: 'Review your answers below with complete step-by-step mathematical explanations for every question.',
    questionPrefix: 'Question',
    groupA: 'GROUP A (4 CHOICES)',
    groupB: 'GROUP B (4 CHOICES)',
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
    graphXAxis: 'Time in minutes',
    graphYAxis: 'Distance',
    graphAria: 'Distance-time graph of the school bus route',
    schemaHome: 'Home',
    schemaHub: 'Model School Entrance 2026 Prep',
    schemaCurrent: 'Model Middle Schools 2021 Exam',
    schemaQuizName: 'Official 2021 Model Middle School Mathematics Exam (With Solutions)',
    schemaQuizDesc: 'Interactive practice test featuring all 25 official Mathematics questions from the 2021 Model Middle School entrance examination (026–050), 60-minute timer, automatic grading (0–50), and detailed solutions.',
    schemaEduLevel: 'Grade 6',
    schemaQuestionName: (num) => `Question ${num} - Model Schools 2021`
  }
};

function getQuestions2021(locale) {
  const isEn = locale === 'en';
  const groupA = isEn ? 'GROUP A (4 CHOICES)' : 'ΟΜΑΔΑ Α (4 ΕΠΙΛΟΓΕΣ)';
  const groupB = isEn ? 'GROUP B (4 CHOICES)' : 'ΟΜΑΔΑ Β (4 ΕΠΙΛΟΓΕΣ)';

  return [
    {
      id: 1,
      officialNumber: 26,
      group: groupA,
      promptText: (
        <span className="inline-flex items-center gap-1 font-mono text-base flex-wrap">
          <Frac num="2" den="8" /> ＋ <Frac num="3" den="8" /> ＝
        </span>
      ),
      options: [
        { key: 'A', label: <Frac num="5" den="16" />, raw: '5/16' },
        { key: 'B', label: <Frac num="5" den="8" />, raw: '5/8' },
        { key: isEn ? 'C' : 'Γ', label: <Frac num="6" den="64" />, raw: '6/64' },
        { key: isEn ? 'D' : 'Δ', label: <Frac num="6" den="8" />, raw: '6/8' }
      ],
      correctRaw: '5/8',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>The fractions have the same denominator, so we add the numerators and keep the common denominator:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <Frac num="2" den="8" />
            <span>＋</span>
            <Frac num="3" den="8" />
            <span>＝</span>
            <Frac num="2 ＋ 3" den="8" />
            <span>＝</span>
            <strong className="text-emerald-700 text-base"><Frac num="5" den="8" /></strong>
          </div>
          <p className="pt-1 flex items-center gap-1 flex-wrap">
            <span>Therefore, the result is</span>
            <strong><Frac num="5" den="8" /></strong>
            <span>(Choice <strong>B</strong>).</span>
          </p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Τα κλάσματα είναι ομώνυμα, οπότε προσθέτουμε τους αριθμητές και διατηρούμε τον ίδιο παρονομαστή:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <Frac num="2" den="8" />
            <span>＋</span>
            <Frac num="3" den="8" />
            <span>＝</span>
            <Frac num="2 ＋ 3" den="8" />
            <span>＝</span>
            <strong className="text-emerald-700 text-base"><Frac num="5" den="8" /></strong>
          </div>
          <p className="pt-1 flex items-center gap-1 flex-wrap">
            <span>Επομένως, το αποτέλεσμα είναι</span>
            <strong><Frac num="5" den="8" /></strong>
            <span>(Επιλογή <strong>B</strong>).</span>
          </p>
        </div>
      )
    },
    {
      id: 2,
      officialNumber: 27,
      group: groupA,
      promptText: (
        <span className="inline-flex items-center gap-1.5 font-mono text-base flex-wrap">
          <span>8 ＋</span>
          <Frac num="20" den={<Pow base="2" exp="2" />} />
          <span>－ 2 ＝</span>
        </span>
      ),
      options: [
        { key: 'A', label: '5', raw: '5' },
        { key: 'B', label: '11', raw: '11' },
        { key: isEn ? 'C' : 'Γ', label: '14', raw: '14' },
        { key: isEn ? 'D' : 'Δ', label: '18', raw: '18' }
      ],
      correctRaw: '11',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>We strictly follow the order of operations (exponents ➔ division ➔ addition and subtraction):</p>
          <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>1. Exponent:</span>
              <Pow base="2" exp="2" />
              <span>＝ 4</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>2. Division:</span>
              <Frac num="20" den="4" />
              <span>＝ 5</span>
            </div>
            <div>3. Operations from left to right: 8 ＋ 5 － 2 ＝ 13 － 2 ＝ <strong className="text-emerald-700 text-base">11</strong></div>
          </div>
          <p className="pt-1">Thus, the result is <strong>11</strong> (Choice <strong>B</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Τηρούμε αυστηρά την προτεραιότητα των πράξεων (δυνάμεις ➔ διαιρέσεις ➔ προσθέσεις/αφαιρέσεις):</p>
          <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>1. Δύναμη:</span>
              <Pow base="2" exp="2" />
              <span>＝ 4</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>2. Διαίρεση:</span>
              <Frac num="20" den="4" />
              <span>＝ 5</span>
            </div>
            <div>3. Πράξεις από αριστερά προς τα δεξιά: 8 ＋ 5 － 2 ＝ 13 － 2 ＝ <strong className="text-emerald-700 text-base">11</strong></div>
          </div>
          <p className="pt-1">Άρα, το αποτέλεσμα είναι <strong>11</strong> (Επιλογή <strong>B</strong>).</p>
        </div>
      )
    },
    {
      id: 3,
      officialNumber: 28,
      group: groupA,
      promptText: isEn
        ? 'The perimeter of a square with an area of 36 square meters is:'
        : 'Η περίμετρος τετραγώνου με εμβαδό 36 τετραγωνικά μέτρα είναι:',
      options: isEn
        ? [
            { key: 'A', label: '6 meters', raw: '6 meters' },
            { key: 'B', label: '24 meters', raw: '24 meters' },
            { key: 'C', label: '36 meters', raw: '36 meters' },
            { key: 'D', label: '144 meters', raw: '144 meters' }
          ]
        : [
            { key: 'A', label: '6 μέτρα', raw: '6 μέτρα' },
            { key: 'B', label: '24 μέτρα', raw: '24 μέτρα' },
            { key: 'Γ', label: '36 μέτρα', raw: '36 μέτρα' },
            { key: 'Δ', label: '144 μέτρα', raw: '144 μέτρα' }
          ],
      correctRaw: isEn ? '24 meters' : '24 μέτρα',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p className="flex items-center gap-1 flex-wrap">
            <span>1. The area of a square is given by A ＝</span>
            <Pow base="s" exp="2" />
            <span>. We find the side length s:</span>
          </p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span>s ＝</span>
            <Radical>36</Radical>
            <span>＝ <strong>6 meters</strong></span>
          </div>
          <p>2. The perimeter of a square equals 4 times its side length:</p>
          <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            P ＝ 4 · s ＝ 4 · 6 ＝ <strong className="text-emerald-700 text-base">24 meters</strong>
          </div>
          <p className="pt-1">Therefore, the perimeter is <strong>24 meters</strong> (Choice <strong>B</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p className="flex items-center gap-1 flex-wrap">
            <span>1. Το εμβαδόν του τετραγώνου δίνεται από τον τύπο Ε ＝</span>
            <Pow base="α" exp="2" />
            <span>. Βρίσκουμε την πλευρά α:</span>
          </p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span>α ＝</span>
            <Radical>36</Radical>
            <span>＝ <strong>6 μέτρα</strong></span>
          </div>
          <p>2. Η περίμετρος ενός τετραγώνου ισούται με 4 φορές την πλευρά του:</p>
          <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            Π ＝ 4 · α ＝ 4 · 6 ＝ <strong className="text-emerald-700 text-base">24 μέτρα</strong>
          </div>
          <p className="pt-1">Επομένως, η περίμετρος είναι <strong>24 μέτρα</strong> (Επιλογή <strong>B</strong>).</p>
        </div>
      )
    },
    {
      id: 4,
      officialNumber: 29,
      group: groupA,
      promptText: isEn
        ? 'If I add half of a number to double the same number, I get 8. What is the number?'
        : 'Αν στο διπλάσιο ενός αριθμού προσθέσω το μισό του ίδιου αριθμού βρίσκω 8. Ποιος είναι ο αριθμός;',
      options: [
        { key: 'A', label: '25', raw: '25' },
        { key: 'B', label: isEn ? '3.2' : '3,2', raw: isEn ? '3.2' : '3,2' },
        { key: isEn ? 'C' : 'Γ', label: '12', raw: '12' },
        { key: isEn ? 'D' : 'Δ', label: isEn ? '3.5' : '3,5', raw: isEn ? '3.5' : '3,5' }
      ],
      correctRaw: isEn ? '3.2' : '3,2',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Let <strong>x</strong> be the unknown number. According to the problem:</p>
          <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div className="flex items-center gap-1 flex-wrap">
              <span>2 · x ＋</span>
              <Frac num="x" den="2" />
              <span>＝ 8</span>
            </div>
            <div>2x ＋ 0.5x ＝ 8</div>
            <div>2.5 · x ＝ 8</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>x ＝</span>
              <Frac num="8" den="2.5" />
              <span>＝</span>
              <Frac num="80" den="25" />
              <span>➔ <strong className="text-emerald-700 text-base">x ＝ 3.2</strong></span>
            </div>
          </div>
          <p className="pt-1">Therefore, the number is <strong>3.2</strong> (Choice <strong>B</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Έστω <strong>x</strong> ο ζητούμενος αριθμός. Σύμφωνα με την εκφώνηση:</p>
          <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div className="flex items-center gap-1 flex-wrap">
              <span>2 · x ＋</span>
              <Frac num="x" den="2" />
              <span>＝ 8</span>
            </div>
            <div>2x ＋ 0,5x ＝ 8</div>
            <div>2,5 · x ＝ 8</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>x ＝</span>
              <Frac num="8" den="2,5" />
              <span>＝</span>
              <Frac num="80" den="25" />
              <span>➔ <strong className="text-emerald-700 text-base">x ＝ 3,2</strong></span>
            </div>
          </div>
          <p className="pt-1">Άρα, ο αριθμός είναι το <strong>3,2</strong> (Επιλογή <strong>B</strong>).</p>
        </div>
      )
    },
    {
      id: 5,
      officialNumber: 30,
      group: groupA,
      promptText: isEn
        ? '30% of 20% of 1,200 euros is:'
        : 'Τα 30% του 20% των 1.200 ευρώ είναι:',
      options: isEn
        ? [
            { key: 'A', label: '72 euros', raw: '72 euros' },
            { key: 'B', label: '240 euros', raw: '240 euros' },
            { key: 'C', label: '360 euros', raw: '360 euros' },
            { key: 'D', label: '600 euros', raw: '600 euros' }
          ]
        : [
            { key: 'A', label: '72 ευρώ', raw: '72 ευρώ' },
            { key: 'B', label: '240 ευρώ', raw: '240 ευρώ' },
            { key: 'Γ', label: '360 ευρώ', raw: '360 ευρώ' },
            { key: 'Δ', label: '600 ευρώ', raw: '600 ευρώ' }
          ],
      correctRaw: isEn ? '72 euros' : '72 ευρώ',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>We calculate the percentages step by step:</p>
          <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>• 20% of 1,200 € ＝ 0.20 · 1,200 ＝ <strong>240 €</strong></div>
            <div>• 30% of 240 € ＝ 0.30 · 240 ＝ <strong className="text-emerald-700 text-base">72 €</strong></div>
          </div>
          <p className="pt-1">Therefore, the amount is <strong>72 euros</strong> (Choice <strong>A</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Υπολογίζουμε διαδοχικά τα ποσοστά:</p>
          <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>• 20% των 1.200 € ＝ 0,20 · 1.200 ＝ <strong>240 €</strong></div>
            <div>• 30% των 240 € ＝ 0,30 · 240 ＝ <strong className="text-emerald-700 text-base">72 €</strong></div>
          </div>
          <p className="pt-1">Επομένως, το ποσό είναι <strong>72 ευρώ</strong> (Επιλογή <strong>A</strong>).</p>
        </div>
      )
    },
    {
      id: 6,
      officialNumber: 31,
      group: groupA,
      promptText: (
        <span className="inline-flex items-center gap-1.5 font-mono text-base flex-wrap">
          <span>{isEn ? 'In the equation x ·' : 'Στην εξίσωση x ·'}</span>
          <Frac num={<Pow base="3" exp="2" />} den="3" />
          <span>{isEn ? '＝ 30, find x:' : '＝ 30, βρείτε το x:'}</span>
        </span>
      ),
      options: [
        { key: 'A', label: 'x = 15', raw: 'x = 15' },
        { key: 'B', label: 'x = 8', raw: 'x = 8' },
        { key: isEn ? 'C' : 'Γ', label: 'x = 10', raw: 'x = 10' },
        { key: isEn ? 'D' : 'Δ', label: 'x = 1', raw: 'x = 1' }
      ],
      correctRaw: 'x = 10',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>First, simplify the fraction:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Frac num={<Pow base="3" exp="2" />} den="3" />
              <span>＝</span>
              <Frac num="9" den="3" />
              <span>＝ 3</span>
            </div>
            <div>The equation becomes: x · 3 ＝ 30</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>x ＝</span>
              <Frac num="30" den="3" />
              <span>➔ <strong className="text-emerald-700 text-base">x ＝ 10</strong></span>
            </div>
          </div>
          <p className="pt-1">Thus, <strong>x = 10</strong> (Choice <strong>C</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Εκτελούμε πρώτα την πράξη του κλάσματος:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Frac num={<Pow base="3" exp="2" />} den="3" />
              <span>＝</span>
              <Frac num="9" den="3" />
              <span>＝ 3</span>
            </div>
            <div>Η εξίσωση γίνεται: x · 3 ＝ 30</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>x ＝</span>
              <Frac num="30" den="3" />
              <span>➔ <strong className="text-emerald-700 text-base">x ＝ 10</strong></span>
            </div>
          </div>
          <p className="pt-1">Άρα, <strong>x = 10</strong> (Επιλογή <strong>Γ</strong>).</p>
        </div>
      )
    },
    {
      id: 7,
      officialNumber: 32,
      group: groupA,
      promptText: isEn
        ? '25% of the children at a school play volleyball. The children who do not play volleyball are 180. How many children attend the school?'
        : 'Το 25% των παιδιών του σχολείου παίζει βόλεϊ. Τα παιδιά του σχολείου που δεν παίζουν βόλεϊ είναι 180. Πόσα παιδιά έχει το σχολείο;',
      options: [
        { key: 'A', label: '240', raw: '240' },
        { key: 'B', label: '225', raw: '225' },
        { key: isEn ? 'C' : 'Γ', label: '135', raw: '135' },
        { key: isEn ? 'D' : 'Δ', label: '250', raw: '250' }
      ],
      correctRaw: '240',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. The percentage of children who do not play volleyball is:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            100% － 25% ＝ <strong>75%</strong> of the school.
          </div>
          <p className="flex items-center gap-1 flex-wrap">
            <span>2. 75% (which is</span>
            <Frac num="3" den="4" />
            <span>) corresponds to 180 children:</span>
          </p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div className="flex items-center gap-1 flex-wrap">
              <span>• 25% (</span>
              <Frac num="1" den="4" />
              <span>) is:</span>
              <Frac num="180" den="3" />
              <span>＝ 60 children.</span>
            </div>
            <div>• The entire school (100%): 60 · 4 ＝ <strong className="text-emerald-700 text-base">240 children</strong>.</div>
          </div>
          <p className="pt-1">Therefore, the school has <strong>240</strong> children (Choice <strong>A</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Τα παιδιά που δεν παίζουν βόλεϊ αντιστοιχούν σε ποσοστό:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            100% － 25% ＝ <strong>75%</strong> του σχολείου.
          </div>
          <p className="flex items-center gap-1 flex-wrap">
            <span>2. Το 75% (δηλαδή τα</span>
            <Frac num="3" den="4" />
            <span>) είναι 180 παιδιά:</span>
          </p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div className="flex items-center gap-1 flex-wrap">
              <span>• Το 25% (το</span>
              <Frac num="1" den="4" />
              <span>) είναι:</span>
              <Frac num="180" den="3" />
              <span>＝ 60 παιδιά.</span>
            </div>
            <div>• Όλο το σχολείο (100%): 60 · 4 ＝ <strong className="text-emerald-700 text-base">240 παιδιά</strong>.</div>
          </div>
          <p className="pt-1">Συνεπώς, το σχολείο έχει <strong>240</strong> παιδιά (Επιλογή <strong>A</strong>).</p>
        </div>
      )
    },
    {
      id: 8,
      officialNumber: 33,
      group: groupA,
      promptText: isEn
        ? 'Which of the following numbers is closest to 9?'
        : 'Ποιος από τους παρακάτω αριθμούς είναι πιο κοντά στο 9;',
      options: [
        { key: 'A', label: isEn ? '9.9' : '9,9', raw: isEn ? '9.9' : '9,9' },
        { key: 'B', label: isEn ? '9.99' : '9,99', raw: isEn ? '9.99' : '9,99' },
        { key: isEn ? 'C' : 'Γ', label: isEn ? '10.009' : '10,009', raw: isEn ? '10.009' : '10,009' },
        { key: isEn ? 'D' : 'Δ', label: isEn ? '10.01' : '10,01', raw: isEn ? '10.01' : '10,01' }
      ],
      correctRaw: isEn ? '9.9' : '9,9',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>We calculate the distance of each number from 9 by subtracting:</p>
          <div className="space-y-1 bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            <div>• 9.9 － 9 ＝ <strong className="text-emerald-700">0.9</strong></div>
            <div>• 9.99 － 9 ＝ 0.99</div>
            <div>• 10.009 － 9 ＝ 1.009</div>
            <div>• 10.01 － 9 ＝ 1.01</div>
          </div>
          <p className="pt-1">The smallest difference is 0.9, so the closest number is <strong>9.9</strong> (Choice <strong>A</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Υπολογίζουμε την απόσταση κάθε αριθμού από το 9 με αφαίρεση:</p>
          <div className="space-y-1 bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            <div>• 9,9 － 9 ＝ <strong className="text-emerald-700">0,9</strong></div>
            <div>• 9,99 － 9 ＝ 0,99</div>
            <div>• 10,009 － 9 ＝ 1,009</div>
            <div>• 10,01 － 9 ＝ 1,01</div>
          </div>
          <p className="pt-1">Η μικρότερη διαφορά είναι το 0,9, άρα ο πιο κοντινός αριθμός είναι το <strong>9,9</strong> (Επιλογή <strong>A</strong>).</p>
        </div>
      )
    },
    {
      id: 9,
      officialNumber: 34,
      group: groupA,
      promptText: isEn
        ? 'The sum of two angles of a triangle is 130°. The triangle cannot be:'
        : 'Το άθροισμα δύο γωνιών ενός τριγώνου είναι 130°. Το τρίγωνο δεν μπορεί να είναι:',
      options: isEn
        ? [
            { key: 'A', label: 'Equilateral', raw: 'Equilateral' },
            { key: 'B', label: 'Isosceles', raw: 'Isosceles' },
            { key: 'C', label: 'Acute', raw: 'Acute' },
            { key: 'D', label: 'Right', raw: 'Right' }
          ]
        : [
            { key: 'A', label: 'Ισόπλευρο', raw: 'Ισόπλευρο' },
            { key: 'B', label: 'Ισοσκελές', raw: 'Ισοσκελές' },
            { key: 'Γ', label: 'Οξυγώνιο', raw: 'Οξυγώνιο' },
            { key: 'Δ', label: 'Ορθογώνιο', raw: 'Ορθογώνιο' }
          ],
      correctRaw: isEn ? 'Equilateral' : 'Ισόπλευρο',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>The sum of the angles in any triangle is 180°. Thus, the third angle is:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            180° － 130° ＝ <strong>50°</strong>
          </div>
          <p>
            In an <strong>equilateral triangle</strong>, all angles must equal <strong>60°</strong> (and any two angles must sum to 120°). Therefore, the triangle cannot be equilateral.
          </p>
          <p className="pt-1 font-bold text-emerald-800">Choice A: Equilateral.</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Το άθροισμα των γωνιών κάθε τριγώνου είναι 180°. Άρα η τρίτη γωνία ισούται με:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            180° － 130° ＝ <strong>50°</strong>
          </div>
          <p>
            Σε ένα <strong>ισόπλευρο τρίγωνο</strong> όλες οι γωνίες είναι υποχρεωτικά ίσες με <strong>60°</strong> (και κάθε άθροισμα δύο γωνιών θα έπρεπε να είναι 120°). Επομένως, το τρίγωνο δεν μπορεί να είναι ισόπλευρο.
          </p>
          <p className="pt-1 font-bold text-emerald-800">Επιλογή A: Ισόπλευρο.</p>
        </div>
      )
    },
    {
      id: 10,
      officialNumber: 35,
      group: groupA,
      promptText: isEn
        ? 'In a basketball game, a player scored the same number of 2-point shots as 3-point shots and made no other baskets. What fraction of the total points scored by the player came from 3-point shots?'
        : 'Σε έναν αγώνα μπάσκετ ένας παίκτης έβαλε τόσα δίποντα όσα και τρίποντα και δεν έβαλε κανένα άλλο καλάθι εκτός από αυτά. Τι μέρος των συνολικών πόντων που έβαλε ο παίκτης ήταν οι πόντοι που έβαλε με τρίποντα;',
      options: [
        { key: 'A', label: <Frac num="2" den="3" />, raw: '2/3' },
        { key: 'B', label: <Frac num="1" den="2" />, raw: '1/2' },
        { key: isEn ? 'C' : 'Γ', label: <Frac num="2" den="5" />, raw: '2/5' },
        { key: isEn ? 'D' : 'Δ', label: <Frac num="3" den="5" />, raw: '3/5' }
      ],
      correctRaw: '3/5',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Suppose the player scored <strong>x</strong> two-pointers and <strong>x</strong> three-pointers:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
            <div>• Points from 2-pointers: 2 · x</div>
            <div>• Points from 3-pointers: 3 · x</div>
            <div>• Total points: 2x ＋ 3x ＝ <strong>5x</strong></div>
          </div>
          <p>The fraction of points from 3-pointers out of the total is:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <Frac num="3x" den="5x" />
            <span>＝</span>
            <strong className="text-emerald-700 text-base"><Frac num="3" den="5" /></strong>
          </div>
          <p className="pt-1 flex items-center gap-1 flex-wrap">
            <span>Thus, it was</span>
            <strong><Frac num="3" den="5" /></strong>
            <span>of the total points (Choice <strong>D</strong>).</span>
          </p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Έστω ότι έβαλε <strong>x</strong> δίποντα και <strong>x</strong> τρίποντα:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
            <div>• Πόντοι από δίποντα: 2 · x</div>
            <div>• Πόντοι από τρίποντα: 3 · x</div>
            <div>• Συνολικοί πόντοι: 2x ＋ 3x ＝ <strong>5x</strong></div>
          </div>
          <p>Το κλάσμα των πόντων από τρίποντα προς το σύνολο είναι:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <Frac num="3x" den="5x" />
            <span>＝</span>
            <strong className="text-emerald-700 text-base"><Frac num="3" den="5" /></strong>
          </div>
          <p className="pt-1 flex items-center gap-1 flex-wrap">
            <span>Άρα, ήταν τα</span>
            <strong><Frac num="3" den="5" /></strong>
            <span>των συνολικών πόντων (Επιλογή <strong>Δ</strong>).</span>
          </p>
        </div>
      )
    },
    {
      id: 11,
      officialNumber: 36,
      group: groupB,
      promptText: isEn
        ? 'I had twice as much money as Akis. Each of us gave half of our money and we bought an inflatable boat costing 52.50 euros. How much money did I have?'
        : 'Είχα τα διπλάσια χρήματα από τον Άκη. Έδωσε ο καθένας μας τα μισά του χρήματα και αγοράσαμε μια φουσκωτή βάρκα που κόστισε 52,50 ευρώ. Πόσα χρήματα είχα;',
      options: isEn
        ? [
            { key: 'A', label: '35 euros', raw: '35 euros' },
            { key: 'B', label: '52.50 euros', raw: '52.50 euros' },
            { key: 'C', label: '70 euros', raw: '70 euros' },
            { key: 'D', label: '105 euros', raw: '105 euros' }
          ]
        : [
            { key: 'A', label: '35 ευρώ', raw: '35 ευρώ' },
            { key: 'B', label: '52,50 ευρώ', raw: '52,50 ευρώ' },
            { key: 'Γ', label: '70 ευρώ', raw: '70 ευρώ' },
            { key: 'Δ', label: '105 ευρώ', raw: '105 ευρώ' }
          ],
      correctRaw: isEn ? '70 euros' : '70 ευρώ',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Let <strong>x</strong> be Akis&apos;s money. Then I had <strong>2x</strong>.</p>
          <p>We each contributed half of our money:</p>
          <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Akis gave:</span>
              <Frac num="x" den="2" />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• I gave:</span>
              <Frac num="2x" den="2" />
              <span>＝ x</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Total cost: x ＋</span>
              <Frac num="x" den="2" />
              <span>＝ 1.5 · x ＝ 52.50 €</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• x ＝</span>
              <Frac num="52.50" den="1.5" />
              <span>＝ <strong>35 €</strong> (Akis&apos;s money)</span>
            </div>
          </div>
          <p>I had twice as much:</p>
          <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            2 · 35 € ＝ <strong className="text-emerald-700 text-base">70 euros</strong>
          </div>
          <p className="pt-1">Therefore, I had <strong>70 euros</strong> (Choice <strong>C</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Έστω <strong>x</strong> τα χρήματα του Άκη. Τότε εγώ είχα <strong>2x</strong> χρήματα.</p>
          <p>Δώσαμε τα μισά μας χρήματα για τη βάρκα:</p>
          <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Ο Άκης έδωσε:</span>
              <Frac num="x" den="2" />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Εγώ έδωσα:</span>
              <Frac num="2x" den="2" />
              <span>＝ x</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Συνολικό κόστος: x ＋</span>
              <Frac num="x" den="2" />
              <span>＝ 1,5 · x ＝ 52,50 €</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• x ＝</span>
              <Frac num="52,50" den="1,5" />
              <span>＝ <strong>35 €</strong> (χρήματα Άκη)</span>
            </div>
          </div>
          <p>Εγώ είχα τα διπλάσια:</p>
          <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            2 · 35 € ＝ <strong className="text-emerald-700 text-base">70 ευρώ</strong>
          </div>
          <p className="pt-1">Επομένως, είχα <strong>70 ευρώ</strong> (Επιλογή <strong>Γ</strong>).</p>
        </div>
      )
    },
    {
      id: 12,
      officialNumber: 37,
      group: groupB,
      promptText: isEn
        ? 'Artemis had an average score of 85 across five Geography tests. What was the sum of her scores on those five tests?'
        : 'Ο μέσος όρος των βαθμών της Άρτεμις σε πέντε διαγωνίσματα Γεωγραφίας ήταν 85. Το άθροισμα των βαθμών της στα πέντε διαγωνίσματα ήταν:',
      options: [
        { key: 'A', label: '95', raw: '95' },
        { key: 'B', label: '100', raw: '100' },
        { key: isEn ? 'C' : 'Γ', label: '425', raw: '425' },
        { key: isEn ? 'D' : 'Δ', label: '495', raw: '495' }
      ],
      correctRaw: '425',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>The average equals the sum divided by the number of tests:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>Average ＝</span>
              <Frac num="Sum" den="Count" />
              <span>➔ Sum ＝ Average · Count</span>
            </div>
            <div>Sum ＝ 85 · 5 ＝ <strong className="text-emerald-700 text-base">425</strong></div>
          </div>
          <p className="pt-1">Thus, the sum of her scores was <strong>425</strong> (Choice <strong>C</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Ο μέσος όρος ισούται με το άθροισμα δια του πλήθους των διαγωνισμάτων:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>Μέσος Όρος ＝</span>
              <Frac num="Άθροισμα" den="Πλήθος" />
              <span>➔ Άθροισμα ＝ Μέσος Όρος · Πλήθος</span>
            </div>
            <div>Άθροισμα ＝ 85 · 5 ＝ <strong className="text-emerald-700 text-base">425</strong></div>
          </div>
          <p className="pt-1">Άρα, το άθροισμα των βαθμών ήταν <strong>425</strong> (Επιλογή <strong>Γ</strong>).</p>
        </div>
      )
    },
    {
      id: 13,
      officialNumber: 38,
      group: groupB,
      promptText: isEn ? (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>The reciprocal of the number resulting from the subtraction</span>
          <Frac num="1" den="8" />
          <span>－</span>
          <Frac num="1" den="9" />
          <span>is:</span>
        </span>
      ) : (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>Ο αντίστροφος του αριθμού που προκύπτει από την αφαίρεση</span>
          <Frac num="1" den="8" />
          <span>－</span>
          <Frac num="1" den="9" />
          <span>είναι ο αριθμός:</span>
        </span>
      ),
      options: [
        { key: 'A', label: <Frac num="1" den="17" />, raw: '1/17' },
        { key: 'B', label: '72', raw: '72' },
        { key: isEn ? 'C' : 'Γ', label: '17', raw: '17' },
        { key: isEn ? 'D' : 'Δ', label: <Frac num="1" den="72" />, raw: '1/72' }
      ],
      correctRaw: '72',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Subtract using the common denominator LCM(8, 9) ＝ 72:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <Frac num="1" den="8" />
            <span>－</span>
            <Frac num="1" den="9" />
            <span>＝</span>
            <Frac num="9" den="72" />
            <span>－</span>
            <Frac num="8" den="72" />
            <span>＝</span>
            <Frac num="1" den="72" />
          </div>
          <p className="flex items-center gap-1 flex-wrap">
            <span>2. The reciprocal of</span>
            <Frac num="1" den="72" />
            <span>is <strong>72</strong>.</span>
          </p>
          <p className="pt-1 font-bold text-emerald-800">Choice B: 72.</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Κάνουμε την αφαίρεση κάνοντας τα κλάσματα ομώνυμα με ΕΚΠ(8, 9) ＝ 72:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <Frac num="1" den="8" />
            <span>－</span>
            <Frac num="1" den="9" />
            <span>＝</span>
            <Frac num="9" den="72" />
            <span>－</span>
            <Frac num="8" den="72" />
            <span>＝</span>
            <Frac num="1" den="72" />
          </div>
          <p className="flex items-center gap-1 flex-wrap">
            <span>2. Ο αντίστροφος του αριθμού</span>
            <Frac num="1" den="72" />
            <span>είναι το <strong>72</strong>.</span>
          </p>
          <p className="pt-1 font-bold text-emerald-800">Επιλογή B: 72.</p>
        </div>
      )
    },
    {
      id: 14,
      officialNumber: 39,
      group: groupB,
      promptText: isEn
        ? 'In which sequence are the numbers ordered correctly?'
        : 'Σε ποια σειρά οι αριθμοί είναι τοποθετημένοι σωστά;',
      options: [
        {
          key: 'A',
          label: <span className="font-mono inline-flex items-center flex-wrap">{isEn ? '0.8 > 0.63 >' : '0,8 > 0,63 >'} <Frac num="13" den="20" /> &gt; <Frac num="7" den="25" /></span>,
          raw: isEn ? '0.8 > 0.63 > 13/20 > 7/25' : '0,8 > 0,63 > 13/20 > 7/25'
        },
        {
          key: 'B',
          label: <span className="font-mono inline-flex items-center flex-wrap">{isEn ? '0.8 <' : '0,8 <'} <Frac num="7" den="25" /> {isEn ? '< 0.63 <' : '< 0,63 <'} <Frac num="13" den="20" /></span>,
          raw: isEn ? '0.8 < 7/25 < 0.63 < 13/20' : '0,8 < 7/25 < 0,63 < 13/20'
        },
        {
          key: isEn ? 'C' : 'Γ',
          label: <span className="font-mono inline-flex items-center flex-wrap"><Frac num="7" den="25" /> {isEn ? '< 0.63 <' : '< 0,63 <'} <Frac num="13" den="20" /> {isEn ? '< 0.8' : '< 0,8'}</span>,
          raw: isEn ? '7/25 < 0.63 < 13/20 < 0.8' : '7/25 < 0,63 < 13/20 < 0,8'
        },
        {
          key: isEn ? 'D' : 'Δ',
          label: <span className="font-mono inline-flex items-center flex-wrap"><Frac num="7" den="25" /> {isEn ? '> 0.63 >' : '> 0,63 >'} <Frac num="13" den="20" /> {isEn ? '> 0.8' : '> 0,8'}</span>,
          raw: isEn ? '7/25 > 0.63 > 13/20 > 0.8' : '7/25 > 0,63 > 13/20 > 0,8'
        }
      ],
      correctRaw: isEn ? '7/25 < 0.63 < 13/20 < 0.8' : '7/25 < 0,63 < 13/20 < 0,8',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Convert all numbers to decimal form:</p>
          <div className="space-y-2 bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>•</span>
              <Frac num="7" den="25" />
              <span>＝</span>
              <Frac num="28" den="100" />
              <span>＝ <strong>0.28</strong></span>
            </div>
            <div>• <strong>0.63</strong></div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>•</span>
              <Frac num="13" den="20" />
              <span>＝</span>
              <Frac num="65" den="100" />
              <span>＝ <strong>0.65</strong></span>
            </div>
            <div>• <strong>0.80</strong></div>
          </div>
          <p>Order in ascending order: 0.28 &lt; 0.63 &lt; 0.65 &lt; 0.80, which gives:</p>
          <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-mono text-emerald-800 font-bold flex items-center gap-1.5 flex-wrap">
            <Frac num="7" den="25" />
            <span>&lt; 0.63 &lt;</span>
            <Frac num="13" den="20" />
            <span>&lt; 0.8</span>
          </div>
          <p className="pt-1">Therefore, sequence <strong>C</strong> is correct.</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Μετατρέπουμε όλους τους αριθμούς σε δεκαδική μορφή:</p>
          <div className="space-y-2 bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>•</span>
              <Frac num="7" den="25" />
              <span>＝</span>
              <Frac num="28" den="100" />
              <span>＝ <strong>0,28</strong></span>
            </div>
            <div>• <strong>0,63</strong></div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>•</span>
              <Frac num="13" den="20" />
              <span>＝</span>
              <Frac num="65" den="100" />
              <span>＝ <strong>0,65</strong></span>
            </div>
            <div>• <strong>0,80</strong></div>
          </div>
          <p>Διατάσσουμε σε αύξουσα σειρά: 0,28 &lt; 0,63 &lt; 0,65 &lt; 0,80, δηλαδή:</p>
          <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-mono text-emerald-800 font-bold flex items-center gap-1.5 flex-wrap">
            <Frac num="7" den="25" />
            <span>&lt; 0,63 &lt;</span>
            <Frac num="13" den="20" />
            <span>&lt; 0,8</span>
          </div>
          <p className="pt-1">Επομένως, σωστή είναι η σειρά <strong>Γ</strong>.</p>
        </div>
      )
    },
    {
      id: 15,
      officialNumber: 40,
      group: groupB,
      promptText: (
        <span className="inline-flex items-center gap-1.5 font-mono text-base flex-wrap">
          <span>{isEn ? 'In the equation' : 'Στην εξίσωση'}</span>
          <Frac num="400" den="8" />
          <span>＋ x ＝ 125 · 2 －</span>
          <Frac num="100" den="2" />
          <span>{isEn ? ', x equals:' : ', το x είναι ίσο με:'}</span>
        </span>
      ),
      options: [
        { key: 'A', label: '150', raw: '150' },
        { key: 'B', label: '400', raw: '400' },
        { key: isEn ? 'C' : 'Γ', label: '250', raw: '250' },
        { key: isEn ? 'D' : 'Δ', label: '100', raw: '100' }
      ],
      correctRaw: '150',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>First compute the divisions and multiplications on each side:</p>
          <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Left side:</span>
              <Frac num="400" den="8" />
              <span>＋ x ＝ <strong>50 ＋ x</strong></span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Right side: 125 · 2 －</span>
              <Frac num="100" den="2" />
              <span>＝ 250 － 50 ＝ <strong>200</strong></span>
            </div>
            <div className="pt-1">
              50 ＋ x ＝ 200 ➔ x ＝ 200 － 50 ➔ <strong className="text-emerald-700 text-base">x ＝ 150</strong>
            </div>
          </div>
          <p className="pt-1">Thus, x equals <strong>150</strong> (Choice <strong>A</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Εκτελούμε πρώτα τους πολλαπλασιασμούς και τις διαιρέσεις σε κάθε μέλος:</p>
          <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Αριστερό μέλος:</span>
              <Frac num="400" den="8" />
              <span>＋ x ＝ <strong>50 ＋ x</strong></span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Δεξί μέλος: 125 · 2 －</span>
              <Frac num="100" den="2" />
              <span>＝ 250 － 50 ＝ <strong>200</strong></span>
            </div>
            <div className="pt-1">
              50 ＋ x ＝ 200 ➔ x ＝ 200 － 50 ➔ <strong className="text-emerald-700 text-base">x ＝ 150</strong>
            </div>
          </div>
          <p className="pt-1">Άρα, το x είναι ίσο με <strong>150</strong> (Επιλογή <strong>A</strong>).</p>
        </div>
      )
    },
    {
      id: 16,
      officialNumber: 41,
      group: groupB,
      promptText: isEn ? (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>Which of the following fractions lies between</span>
          <Frac num="1" den="5" />
          <span>and</span>
          <Frac num="2" den="3" />
          <span>?</span>
        </span>
      ) : (
        <span className="inline-flex items-center flex-wrap gap-1">
          <span>Ποιο από τα παρακάτω κλάσματα βρίσκεται ανάμεσα στο</span>
          <Frac num="1" den="5" />
          <span>και στο</span>
          <Frac num="2" den="3" />
          <span>;</span>
        </span>
      ),
      options: [
        { key: 'A', label: <Frac num="4" den="3" />, raw: '4/3' },
        { key: 'B', label: <Frac num="9" den="15" />, raw: '9/15' },
        { key: isEn ? 'C' : 'Γ', label: <Frac num="5" den="6" />, raw: '5/6' },
        { key: isEn ? 'D' : 'Δ', label: <Frac num="1" den="10" />, raw: '1/10' }
      ],
      correctRaw: '9/15',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Convert the endpoints to decimal numbers:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>•</span>
              <Frac num="1" den="5" />
              <span>＝ <strong>0.20</strong></span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>•</span>
              <Frac num="2" den="3" />
              <span>≈ <strong>0.667</strong></span>
            </div>
          </div>
          <p>Check each option:</p>
          <div className="space-y-2 bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• A:</span>
              <Frac num="4" den="3" />
              <span>≈ 1.33 (&gt; 0.667)</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• B:</span>
              <Frac num="9" den="15" />
              <span>＝</span>
              <Frac num="3" den="5" />
              <span>＝ <strong className="text-emerald-700">0.60</strong> (lies between 0.20 and 0.667 ✅)</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• C:</span>
              <Frac num="5" den="6" />
              <span>≈ 0.833 (&gt; 0.667)</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• D:</span>
              <Frac num="1" den="10" />
              <span>＝ 0.10 (&lt; 0.20)</span>
            </div>
          </div>
          <p className="pt-1 flex items-center gap-1 flex-wrap">
            <span>Therefore, the fraction is</span>
            <strong><Frac num="9" den="15" /></strong>
            <span>(Choice <strong>B</strong>).</span>
          </p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Μετατρέπουμε τα άκρα σε δεκαδικούς αριθμούς:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>•</span>
              <Frac num="1" den="5" />
              <span>＝ <strong>0,20</strong></span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>•</span>
              <Frac num="2" den="3" />
              <span>≈ <strong>0,667</strong></span>
            </div>
          </div>
          <p>Εξετάζουμε τις επιλογές:</p>
          <div className="space-y-2 bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Α:</span>
              <Frac num="4" den="3" />
              <span>≈ 1,33 (&gt; 0,667)</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Β:</span>
              <Frac num="9" den="15" />
              <span>＝</span>
              <Frac num="3" den="5" />
              <span>＝ <strong className="text-emerald-700">0,60</strong> (ανάμεσα στο 0,20 και 0,667 ✅)</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Γ:</span>
              <Frac num="5" den="6" />
              <span>≈ 0,833 (&gt; 0,667)</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Δ:</span>
              <Frac num="1" den="10" />
              <span>＝ 0,10 (&lt; 0,20)</span>
            </div>
          </div>
          <p className="pt-1 flex items-center gap-1 flex-wrap">
            <span>Συνεπώς, το κλάσμα είναι το</span>
            <strong><Frac num="9" den="15" /></strong>
            <span>(Επιλογή <strong>B</strong>).</span>
          </p>
        </div>
      )
    },
    {
      id: 17,
      officialNumber: 42,
      group: groupB,
      promptText: isEn
        ? 'The difference between 900,000 and the smallest six-digit number with all different digits is:'
        : 'Η διαφορά του 900.000 από τον μικρότερο εξαψήφιο αριθμό με διαφορετικά ψηφία είναι:',
      options: isEn
        ? [
            { key: 'A', label: '797,655', raw: '797,655' },
            { key: 'B', label: '776,544', raw: '776,544' },
            { key: 'C', label: '777,777', raw: '777,777' },
            { key: 'D', label: '800,000', raw: '800,000' }
          ]
        : [
            { key: 'A', label: '797.655', raw: '797.655' },
            { key: 'B', label: '776.544', raw: '776.544' },
            { key: 'Γ', label: '777.777', raw: '777.777' },
            { key: 'Δ', label: '800.000', raw: '800.000' }
          ],
      correctRaw: isEn ? '797,655' : '797.655',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. The smallest six-digit number with distinct digits starts with 1 followed by the smallest available digits &#123;0, 2, 3, 4, 5&#125;:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            Smallest number ＝ <strong>102,345</strong>
          </div>
          <p>2. Subtract:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            900,000 － 102,345 ＝ <strong className="text-emerald-700 text-base">797,655</strong>
          </div>
          <p className="pt-1">Thus, the difference is <strong>797,655</strong> (Choice <strong>A</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Ο μικρότερος εξαψήφιος αριθμός με διαφορετικά ψηφία ξεκινά με 1 και συνεχίζει με τα μικρότερα δυνατά ψηφία &#123;0, 2, 3, 4, 5&#125;:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            Μικρότερος αριθμός ＝ <strong>102.345</strong>
          </div>
          <p>2. Υπολογίζουμε τη διαφορά:</p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            900.000 － 102.345 ＝ <strong className="text-emerald-700 text-base">797.655</strong>
          </div>
          <p className="pt-1">Άρα, η διαφορά είναι <strong>797.655</strong> (Επιλογή <strong>A</strong>).</p>
        </div>
      )
    },
    {
      id: 18,
      officialNumber: 43,
      group: groupB,
      promptText: isEn
        ? 'The sum of the page numbers of the last two pages of a book is 155. How many pages does the book have?'
        : 'Το άθροισμα των αριθμών των δύο τελευταίων σελίδων ενός βιβλίου είναι 155. Πόσες σελίδες έχει το βιβλίο;',
      options: isEn
        ? [
            { key: 'A', label: '77', raw: '77' },
            { key: 'B', label: '78', raw: '78' },
            { key: 'C', label: '155', raw: '155' },
            { key: 'D', label: 'More than 155', raw: 'More than 155' }
          ]
        : [
            { key: 'A', label: '77', raw: '77' },
            { key: 'B', label: '78', raw: '78' },
            { key: 'Γ', label: '155', raw: '155' },
            { key: 'Δ', label: 'Περισσότερες από 155', raw: 'Περισσότερες από 155' }
          ],
      correctRaw: '78',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>The last two pages are <strong>consecutive integers</strong>, say <strong>n</strong> and <strong>n ＋ 1</strong>:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>n ＋ (n ＋ 1) ＝ 155</div>
            <div>2n ＋ 1 ＝ 155</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>2n ＝ 154 ➔ n ＝</span>
              <Frac num="154" den="2" />
              <span>＝ 77</span>
            </div>
          </div>
          <p>The final page of the book is: n ＋ 1 ＝ 77 ＋ 1 ＝ <strong>78</strong>.</p>
          <p className="pt-1 font-bold text-emerald-800">Therefore, the book has 78 pages (Choice B).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Οι δύο τελευταίες σελίδες είναι <strong>διαδοχικοί ακέραιοι αριθμοί</strong>, έστω <strong>n</strong> και <strong>n ＋ 1</strong>:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>n ＋ (n ＋ 1) ＝ 155</div>
            <div>2n ＋ 1 ＝ 155</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>2n ＝ 154 ➔ n ＝</span>
              <Frac num="154" den="2" />
              <span>＝ 77</span>
            </div>
          </div>
          <p>Η τελευταία σελίδα του βιβλίου είναι η: n ＋ 1 ＝ 77 ＋ 1 ＝ <strong>78</strong>.</p>
          <p className="pt-1 font-bold text-emerald-800">Επομένως, το βιβλίο έχει 78 σελίδες (Επιλογή B).</p>
        </div>
      )
    },
    {
      id: 19,
      officialNumber: 44,
      group: groupB,
      promptText: isEn
        ? 'Which of the following numbers is the smallest?'
        : 'Από τους παρακάτω αριθμούς ο μικρότερος είναι:',
      options: isEn
        ? [
            { key: 'A', label: '5% of 40', raw: '5% of 40' },
            { key: 'B', label: '10% of 15', raw: '10% of 15' },
            { key: 'C', label: <span className="inline-flex items-center gap-1"><Frac num="2" den="8" /> of 12</span>, raw: '2/8 of 12' },
            { key: 'D', label: <span className="inline-flex items-center gap-1"><Frac num="1" den="3" /> of double of 3</span>, raw: '1/3 of double of 3' }
          ]
        : [
            { key: 'A', label: 'Το 5% του 40', raw: 'Το 5% του 40' },
            { key: 'B', label: 'Το 10% του 15', raw: 'Το 10% του 15' },
            { key: 'Γ', label: <span className="inline-flex items-center gap-1">Τα <Frac num="2" den="8" /> του 12</span>, raw: 'Τα 2/8 του 12' },
            { key: 'Δ', label: <span className="inline-flex items-center gap-1">Το <Frac num="1" den="3" /> του διπλάσιου του 3</span>, raw: 'Το 1/3 του διπλάσιου του 3' }
          ],
      correctRaw: isEn ? '10% of 15' : 'Το 10% του 15',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Calculate the value of each option:</p>
          <div className="space-y-2 bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            <div>• A: 5% · 40 ＝ 0.05 · 40 ＝ <strong>2</strong></div>
            <div>• B: 10% · 15 ＝ 0.10 · 15 ＝ <strong className="text-emerald-700">1.5</strong></div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• C:</span>
              <Frac num="2" den="8" />
              <span>· 12 ＝</span>
              <Frac num="1" den="4" />
              <span>· 12 ＝ <strong>3</strong></span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• D:</span>
              <Frac num="1" den="3" />
              <span>· (2 · 3) ＝</span>
              <Frac num="1" den="3" />
              <span>· 6 ＝ <strong>2</strong></span>
            </div>
          </div>
          <p className="pt-1">The smallest value is 1.5, which is <strong>10% of 15</strong> (Choice <strong>B</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Υπολογίζουμε την τιμή κάθε επιλογής:</p>
          <div className="space-y-2 bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            <div>• Α: 5% · 40 ＝ 0,05 · 40 ＝ <strong>2</strong></div>
            <div>• Β: 10% · 15 ＝ 0,10 · 15 ＝ <strong className="text-emerald-700">1,5</strong></div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Γ:</span>
              <Frac num="2" den="8" />
              <span>· 12 ＝</span>
              <Frac num="1" den="4" />
              <span>· 12 ＝ <strong>3</strong></span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Δ:</span>
              <Frac num="1" den="3" />
              <span>· (2 · 3) ＝</span>
              <Frac num="1" den="3" />
              <span>· 6 ＝ <strong>2</strong></span>
            </div>
          </div>
          <p className="pt-1">Ο μικρότερος αριθμός είναι το 1,5, δηλαδή <strong>Το 10% του 15</strong> (Επιλογή <strong>B</strong>).</p>
        </div>
      )
    },
    {
      id: 20,
      officialNumber: 45,
      group: groupB,
      promptText: isEn ? (
        <span>
          We bought 7 cans of paint to paint four identical walls. Painting one wall required 1 <Frac num="1" den="3" /> cans of paint. How much paint will be left over after painting the remaining walls?
        </span>
      ) : (
        <span>
          Αγοράσαμε 7 δοχεία μπογιάς για να βάψουμε τέσσερις ίδιους τοίχους. Για να βάψουμε τον έναν χρειάστηκε το 1 <Frac num="1" den="3" /> ενός δοχείου μπογιάς. Πόση μπογιά θα περισσέψει αν βάψουμε και τους υπόλοιπους τοίχους;
        </span>
      ),
      options: [
        { key: 'A', label: <span className="inline-flex items-center">5 <Frac num="1" den="3" /></span>, raw: '5 1/3' },
        { key: 'B', label: <span className="inline-flex items-center">1 <Frac num="1" den="3" /></span>, raw: '1 1/3' },
        { key: isEn ? 'C' : 'Γ', label: <span className="inline-flex items-center">1 <Frac num="2" den="3" /></span>, raw: '1 2/3' },
        { key: isEn ? 'D' : 'Δ', label: <Frac num="2" den="3" />, raw: '2/3' }
      ],
      correctRaw: '1 2/3',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Convert the mixed number into an improper fraction:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1 flex-wrap">
            <span>1</span>
            <Frac num="1" den="3" />
            <span>＝</span>
            <Frac num="4" den="3" />
            <span>cans per wall.</span>
          </div>
          <p>2. For all 4 walls, we will need in total:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1 flex-wrap">
            <span>4 ·</span>
            <Frac num="4" den="3" />
            <span>＝</span>
            <Frac num="16" den="3" />
            <span>cans.</span>
          </div>
          <p className="flex items-center gap-1 flex-wrap">
            <span>3. Subtract from the 7 cans bought (7 ＝</span>
            <Frac num="21" den="3" />
            <span>):</span>
          </p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <Frac num="21" den="3" />
            <span>－</span>
            <Frac num="16" den="3" />
            <span>＝</span>
            <Frac num="5" den="3" />
            <span>＝ <strong className="text-emerald-700 text-base inline-flex items-center">1 <Frac num="2" den="3" /></strong> cans.</span>
          </div>
          <p className="pt-1 flex items-center gap-1 flex-wrap">
            <span>Therefore,</span>
            <strong className="inline-flex items-center">1 <Frac num="2" den="3" /></strong>
            <span>cans of paint will be left over (Choice <strong>C</strong>).</span>
          </p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Μετατρέπουμε τον μεικτό αριθμό σε κλάσμα:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1 flex-wrap">
            <span>1</span>
            <Frac num="1" den="3" />
            <span>＝</span>
            <Frac num="4" den="3" />
            <span>δοχείου ανά τοίχο.</span>
          </div>
          <p>2. Για τους 4 τοίχους θα χρειαστούν συνολικά:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1 flex-wrap">
            <span>4 ·</span>
            <Frac num="4" den="3" />
            <span>＝</span>
            <Frac num="16" den="3" />
            <span>δοχεία.</span>
          </div>
          <p className="flex items-center gap-1 flex-wrap">
            <span>3. Αφαιρούμε από τα 7 δοχεία που αγοράσαμε (7 ＝</span>
            <Frac num="21" den="3" />
            <span>):</span>
          </p>
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
            <Frac num="21" den="3" />
            <span>－</span>
            <Frac num="16" den="3" />
            <span>＝</span>
            <Frac num="5" den="3" />
            <span>＝ <strong className="text-emerald-700 text-base inline-flex items-center">1 <Frac num="2" den="3" /></strong> δοχείο.</span>
          </div>
          <p className="pt-1 flex items-center gap-1 flex-wrap">
            <span>Επομένως, θα περισσέψει</span>
            <strong className="inline-flex items-center">1 <Frac num="2" den="3" /></strong>
            <span>δοχείο μπογιάς (Επιλογή <strong>Γ</strong>).</span>
          </p>
        </div>
      )
    },
    {
      id: 21,
      officialNumber: 46,
      group: groupB,
      promptText: isEn
        ? 'The graph shows Marios’s trip on the school bus. If he got on the bus at 7:40, what time was it when the bus stopped to pick up two more classmates?'
        : 'Η γραφική παράσταση παρουσιάζει τη διαδρομή που κάνει ο Μάριος με το σχολικό λεωφορείο. Αν μπήκε στο λεωφορείο στις 7:40, τι ώρα ήταν όταν αυτό σταμάτησε για να πάρει ακόμα δύο συμμαθητές του;',
      hasSvg: 'busGraph46',
      options: [
        { key: 'A', label: '7:44', raw: '7:44' },
        { key: 'B', label: '7:48', raw: '7:48' },
        { key: isEn ? 'C' : 'Γ', label: '7:52', raw: '7:52' },
        { key: isEn ? 'D' : 'Δ', label: '7:54', raw: '7:54' }
      ],
      correctRaw: '7:48',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            On a distance-time graph, a bus stop corresponds to the <strong>horizontal line segment</strong> (where time passes while distance remains constant).
          </p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
            <div>• The stop begins at the <strong>8th minute</strong> (and lasts until the 10th minute).</div>
            <div>• Departure time: 7:40</div>
            <div>• 7:40 ＋ 8 minutes ＝ <strong className="text-emerald-700 text-base">7:48</strong></div>
          </div>
          <p className="pt-1">Thus, the time was <strong>7:48</strong> (Choice <strong>B</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>
            Στη γραφική παράσταση απόστασης-χρόνου, η στάση του λεωφορείου αντιστοιχεί στο <strong>οριζόντιο ευθύγραμμο τμήμα</strong> (όπου ο χρόνος κυλά αλλά η απόσταση μένει σταθερή).
          </p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
            <div>• Η στάση ξεκινά στο <strong>8ο λεπτό</strong> (και διαρκεί μέχρι το 10ο λεπτό).</div>
            <div>• Ώρα έναρξης: 7:40</div>
            <div>• 7:40 ＋ 8 λεπτά ＝ <strong className="text-emerald-700 text-base">7:48</strong></div>
          </div>
          <p className="pt-1">Άρα, η ώρα ήταν <strong>7:48</strong> (Επιλογή <strong>B</strong>).</p>
        </div>
      )
    },
    {
      id: 22,
      officialNumber: 47,
      group: groupB,
      promptText: isEn ? (
        <span>
          Christos’s age is <Frac num="1" den="3" /> of his grandmother’s age, and also <Frac num="1" den="2" /> of his mother’s age. If his grandmother is 23 years older than his mother, how old is Christos’s grandmother?
        </span>
      ) : (
        <span>
          Η ηλικία του Χρήστου είναι το <Frac num="1" den="3" /> της ηλικίας της γιαγιάς του, αλλά και το <Frac num="1" den="2" /> της ηλικίας της μαμάς του. Αν η γιαγιά του είναι μεγαλύτερη από τη μαμά του κατά 23 χρόνια, τότε η γιαγιά του Χρήστου είναι:
        </span>
      ),
      options: isEn
        ? [
            { key: 'A', label: '75 years old', raw: '75 years old' },
            { key: 'B', label: '72 years old', raw: '72 years old' },
            { key: 'C', label: '69 years old', raw: '69 years old' },
            { key: 'D', label: '63 years old', raw: '63 years old' }
          ]
        : [
            { key: 'A', label: '75 ετών', raw: '75 ετών' },
            { key: 'B', label: '72 ετών', raw: '72 ετών' },
            { key: 'Γ', label: '69 ετών', raw: '69 ετών' },
            { key: 'Δ', label: '63 ετών', raw: '63 ετών' }
          ],
      correctRaw: isEn ? '69 years old' : '69 ετών',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Let <strong>x</strong> be Christos&apos;s age.</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div className="flex items-center gap-1 flex-wrap">
              <span>• Grandmother: 3 · x (since Christos is</span>
              <Frac num="1" den="3" />
              <span>of her age)</span>
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              <span>• Mother: 2 · x (since Christos is</span>
              <Frac num="1" den="2" />
              <span>of her age)</span>
            </div>
          </div>
          <p>The age difference between the grandmother and mother is 23 years:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            3x － 2x ＝ 23 ➔ <strong>x ＝ 23 years old</strong> (Christos&apos;s age)
          </div>
          <p>Grandmother&apos;s age:</p>
          <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            3 · 23 ＝ <strong className="text-emerald-700 text-base">69 years old</strong>
          </div>
          <p className="pt-1">Therefore, the grandmother is <strong>69 years old</strong> (Choice <strong>C</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Έστω <strong>x</strong> η ηλικία του Χρήστου.</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div className="flex items-center gap-1 flex-wrap">
              <span>• Γιαγιά: 3 · x (αφού ο Χρήστος είναι το</span>
              <Frac num="1" den="3" />
              <span>)</span>
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              <span>• Μαμά: 2 · x (αφού ο Χρήστος είναι το</span>
              <Frac num="1" den="2" />
              <span>)</span>
            </div>
          </div>
          <p>Η διαφορά ηλικίας γιαγιάς και μαμάς είναι 23 χρόνια:</p>
          <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            3x － 2x ＝ 23 ➔ <strong>x ＝ 23 ετών</strong> (ηλικία Χρήστου)
          </div>
          <p>Ηλικία γιαγιάς:</p>
          <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
            3 · 23 ＝ <strong className="text-emerald-700 text-base">69 ετών</strong>
          </div>
          <p className="pt-1">Επομένως, η γιαγιά είναι <strong>69 ετών</strong> (Επιλογή <strong>Γ</strong>).</p>
        </div>
      )
    },
    {
      id: 23,
      officialNumber: 48,
      group: groupB,
      promptText: isEn
        ? 'When I subtract 12 from double a number, I get a difference of 10. What is the number?'
        : 'Από το διπλάσιο ενός αριθμού αφαιρώ 12 και βρίσκω διαφορά 10. Ποιος είναι ο αριθμός;',
      options: [
        { key: 'A', label: '22', raw: '22' },
        { key: 'B', label: '11', raw: '11' },
        { key: isEn ? 'C' : 'Γ', label: '14', raw: '14' },
        { key: isEn ? 'D' : 'Δ', label: '8', raw: '8' }
      ],
      correctRaw: '11',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Set up the equation:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>2 · x － 12 ＝ 10</div>
            <div>2 · x ＝ 10 ＋ 12</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>2 · x ＝ 22 ➔ x ＝</span>
              <Frac num="22" den="2" />
              <span>➔ <strong className="text-emerald-700 text-base">x ＝ 11</strong></span>
            </div>
          </div>
          <p className="pt-1">Thus, the number is <strong>11</strong> (Choice <strong>B</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>Σχηματίζουμε την εξίσωση:</p>
          <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>2 · x － 12 ＝ 10</div>
            <div>2 · x ＝ 10 ＋ 12</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>2 · x ＝ 22 ➔ x ＝</span>
              <Frac num="22" den="2" />
              <span>➔ <strong className="text-emerald-700 text-base">x ＝ 11</strong></span>
            </div>
          </div>
          <p className="pt-1">Άρα, ο αριθμός είναι το <strong>11</strong> (Επιλογή <strong>B</strong>).</p>
        </div>
      )
    },
    {
      id: 24,
      officialNumber: 49,
      group: groupB,
      promptText: isEn
        ? 'Vangelis bought 48 eggs in packs of 6 and paid 2.1 euros per pack. If he had bought the same number of eggs in packs of 4, he would have paid 4.8 euros more in total. How much did each pack of 4 eggs cost?'
        : 'Ο Βαγγέλης αγόρασε 48 αυγά σε συσκευασίες των 6 και πλήρωσε 2,1 ευρώ τη μία. Αν αγόραζε την ίδια ποσότητα αυγών σε συσκευασίες των 4 θα πλήρωνε 4,8 ευρώ περισσότερα, συνολικά. Πόσο κόστιζε κάθε συσκευασία των 4 αυγών;',
      options: isEn
        ? [
            { key: 'A', label: '1.8 euros', raw: '1.8 euros' },
            { key: 'B', label: '4 euros', raw: '4 euros' },
            { key: 'C', label: '2.5 euros', raw: '2.5 euros' },
            { key: 'D', label: '2 euros', raw: '2 euros' }
          ]
        : [
            { key: 'A', label: '1,8 ευρώ', raw: '1,8 ευρώ' },
            { key: 'B', label: '4 ευρώ', raw: '4 ευρώ' },
            { key: 'Γ', label: '2,5 ευρώ', raw: '2,5 ευρώ' },
            { key: 'Δ', label: '2 ευρώ', raw: '2 ευρώ' }
          ],
      correctRaw: isEn ? '1.8 euros' : '1,8 ευρώ',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="space-y-1.5">
            <p className="font-bold">1. Cost in packs of 6:</p>
            <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>• Number of packs:</span>
                <Frac num="48" den="6" />
                <span>＝ 8 packs.</span>
              </div>
              <div>• Total cost: 8 · 2.1 € ＝ <strong>16.80 €</strong>.</div>
            </div>
          </div>
          <div className="space-y-1.5">
            <p className="font-bold">2. Cost in packs of 4:</p>
            <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
              <div>• Total amount: 16.80 € ＋ 4.80 € ＝ <strong>21.60 €</strong>.</div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>• Number of packs:</span>
                <Frac num="48" den="4" />
                <span>＝ 12 packs.</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>• Price per pack of 4:</span>
                <Frac num="21.60 €" den="12" />
                <span>＝ <strong className="text-emerald-700 text-base">1.80 €</strong>.</span>
              </div>
            </div>
          </div>
          <p className="pt-1">Therefore, each pack of 4 cost <strong>1.8 euros</strong> (Choice <strong>A</strong>).</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="space-y-1.5">
            <p className="font-bold">1. Κόστος στις συσκευασίες των 6:</p>
            <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>• Πλήθος συσκευασιών:</span>
                <Frac num="48" den="6" />
                <span>＝ 8 συσκευασίες.</span>
              </div>
              <div>• Συνολικό κόστος: 8 · 2,1 € ＝ <strong>16,80 €</strong>.</div>
            </div>
          </div>
          <div className="space-y-1.5">
            <p className="font-bold">2. Κόστος στις συσκευασίες των 4:</p>
            <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
              <div>• Συνολικό ποσό: 16,80 € ＋ 4,80 € ＝ <strong>21,60 €</strong>.</div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>• Πλήθος συσκευασιών:</span>
                <Frac num="48" den="4" />
                <span>＝ 12 συσκευασίες.</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>• Τιμή ανά συσκευασία των 4:</span>
                <Frac num="21,60 €" den="12" />
                <span>＝ <strong className="text-emerald-700 text-base">1,80 €</strong>.</span>
              </div>
            </div>
          </div>
          <p className="pt-1">Συνεπώς, κάθε συσκευασία των 4 κόστιζε <strong>1,8 ευρώ</strong> (Επιλογή <strong>A</strong>).</p>
        </div>
      )
    },
    {
      id: 25,
      officialNumber: 50,
      group: groupB,
      promptText: isEn
        ? 'A school principal in Crete bought 47 bus tickets for the 6th-grade students’ trip to the archaeological site of Knossos and 47 tickets for their return. Because some students were absent, 6 tickets were not used. Which of the following equations can be used to find the number of students who went to Knossos?'
        : 'Ο διευθυντής ενός σχολείου της Κρήτης προμηθεύτηκε 47 εισιτήρια λεωφορείου για τη μετάβαση των μαθητών της Στ΄ τάξης στον αρχαιολογικό χώρο της Κνωσού και 47 εισιτήρια για την επιστροφή τους. Επειδή κάποιοι μαθητές απουσίαζαν δε χρησιμοποιήθηκαν 6 εισιτήρια. Με ποια από τις παρακάτω εξισώσεις μπορούμε να βρούμε τον αριθμό των μαθητών που πήγαν στην Κνωσό;',
      options: [
        { key: 'A', label: <span className="font-mono">x ＋ 6 ＝ 94</span>, raw: 'x + 6 = 94' },
        { key: 'B', label: <span className="font-mono">94 ＋ 6 ＝ x · 2</span>, raw: '94 + 6 = x · 2' },
        { key: isEn ? 'C' : 'Γ', label: <span className="font-mono">2 · x ＋ 6 ＝ 94</span>, raw: '2 · x + 6 = 94' },
        { key: isEn ? 'D' : 'Δ', label: <span className="font-mono">94 － x ＝ 6</span>, raw: '94 - x = 6' }
      ],
      correctRaw: '2 · x + 6 = 94',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Total tickets bought: 47 (going) ＋ 47 (return) ＝ <strong>94 tickets</strong>.</p>
          <p>
            2. Each student who attended the trip (let <strong>x</strong> be the number of students) used <strong>2 tickets</strong> (one going and one returning), so <strong>2 · x</strong> tickets were used.
          </p>
          <p>3. Adding the 6 unused tickets gives the total:</p>
          <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-mono text-emerald-800 font-bold">
            2 · x ＋ 6 ＝ 94
          </div>
          <p className="pt-1">Therefore, the correct equation is <strong>C</strong>.</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>1. Συνολικά εισιτήρια: 47 (μετάβαση) ＋ 47 (επιστροφή) ＝ <strong>94 εισιτήρια</strong>.</p>
          <p>
            2. Κάθε μαθητής που πήγε στην εκδρομή (έστω <strong>x</strong> μαθητές) χρησιμοποίησε <strong>2 εισιτήρια</strong> (ένα για τη μετάβαση και ένα για την επιστροφή), άρα χρησιμοποιήθηκαν <strong>2 · x</strong> εισιτήρια.
          </p>
          <p>3. Προσθέτοντας τα 6 εισιτήρια που περίσσεψαν, προκύπτει το σύνολο:</p>
          <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-mono text-emerald-800 font-bold">
            2 · x ＋ 6 ＝ 94
          </div>
          <p className="pt-1">Επομένως, η σωστή εξίσωση είναι η <strong>Γ</strong>.</p>
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

export default function Themata2021Page() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const isEn = locale === 'en';
  const t = I18N[locale];
  const questions = getQuestions2021(locale);

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

  // Reset επιλογών αν αλλάξει η γλώσσα κατά τη διάρκεια
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

  const schema2021 = [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": t.schemaHome, "item": `${baseUrl}/` },
        { "@type": "ListItem", "position": 2, "name": t.schemaHub, "item": `${baseUrl}/protipa/protipa` },
        { "@type": "ListItem", "position": 3, "name": t.schemaCurrent, "item": `${baseUrl}/protipa/themata-2021` }
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
    if (q.hasSvg === 'busGraph46') {
      return (
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 my-3">
          <svg
            viewBox="0 0 420 180"
            className="w-full max-w-[420px] h-auto select-none font-sans mx-auto block"
            role="img"
            aria-label={t.graphAria}
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(i => (
              <line key={`v-${i}`} x1={40 + i * 26} y1="20" x2={40 + i * 26} y2="135" stroke="#f1f5f9" strokeWidth="1" />
            ))}
            {[0, 1, 2, 3, 4].map(i => (
              <line key={`h-${i}`} x1="40" y1={20 + i * 28.75} x2="385" y2={20 + i * 28.75} stroke="#f1f5f9" strokeWidth="1" />
            ))}

            <line x1="40" y1="135" x2="395" y2="135" stroke="#334155" strokeWidth="1.8" />
            <polygon points="395,131 403,135 395,139" fill="#334155" />

            <line x1="40" y1="135" x2="40" y2="15" stroke="#334155" strokeWidth="1.8" />
            <polygon points="36,15 40,7 44,15" fill="#334155" />

            <text x="390" y="165" fontSize="10" fontWeight="bold" textAnchor="end" fill="#334155">{t.graphXAxis}</text>
            <text x="18" y="75" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#334155" transform="rotate(-90 18 75)">{t.graphYAxis}</text>

            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(i => (
              <g key={i}>
                <line x1={40 + i * 26} y1="135" x2={40 + i * 26} y2="140" stroke="#334155" strokeWidth="1" />
                <text x={40 + i * 26} y="152" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#475569">{i}</text>
              </g>
            ))}

            <polyline
              points={`40,135 ${40 + 8 * 26},75 ${40 + 10 * 26},75 ${40 + 13.5 * 26},20`}
              fill="none"
              stroke="#0f172a"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <circle cx={40 + 8 * 26} cy="75" r="3.5" fill="#2563eb" />
            <circle cx={40 + 10 * 26} cy="75" r="3.5" fill="#2563eb" />
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
      schemaData={schema2021}
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