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

// Helper για ασφαλή μετατροπή JSX επιλογών/εκφωνήσεων σε απλό κείμενο
function extractPlainText(node, isEn = false) {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map((n) => extractPlainText(n, isEn)).join('');
  if (node && typeof node === 'object' && node.props) {
    if (node.props.num !== undefined && node.props.den !== undefined) {
      const n = extractPlainText(node.props.num, isEn).trim();
      const d = extractPlainText(node.props.den, isEn).trim();
      return `${n}/${d}`;
    }
    if (node.props.base !== undefined && node.props.exp !== undefined) {
      const b = extractPlainText(node.props.base, isEn).trim();
      return `${b}^${node.props.exp}`;
    }
    return extractPlainText(node.props.children, isEn);
  }
  return '';
}

const I18N = {
  el: {
    metaTitle: 'Ενδεικτικά Θέματα Προτύπων 2026 – 1ο Τεστ Προσομοίωσης | LearnMaths.gr',
    metaDesc: '1ο Τεστ Προσομοίωσης με ενδεικτικά θέματα Προτύπων 2026 στα Μαθηματικά: 25 ερωτήσεις πολλαπλής επιλογής, χρονόμετρο 60 λεπτών, βαθμολογία 0–50 και λύσεις.',
    backText: 'Τεστ Προσομοίωσης 2026',
    heroBadge: 'ΕΝΔΕΙΚΤΙΚΑ ΘΕΜΑΤΑ ΠΡΟΤΥΠΩΝ 2026 • 1Ο ΤΕΣΤ (25 ΘΕΜΑΤΑ)',
    heroTitle: 'Ενδεικτικά Θέματα Προτύπων 2026 – 1ο Τεστ Προσομοίωσης',
    heroSubtitle: 'Εξασκήσου σε 25 επιλεγμένα ενδεικτικά θέματα Μαθηματικών για τις εξετάσεις των Προτύπων Γυμνασίων 2026 (αριθμητική, κλάσματα, ποσοστά, εξισώσεις, γεωμετρία και συνδυαστική λογική) με αναλυτικές λύσεις βήμα-βήμα.',
    answeredLabel: 'Απαντημένες:',
    of25: 'από 25',
    scoringLabel: 'Βαθμολογία:',
    scoringValue: '2 μόρια / σωστό (Άριστα: 50)',
    timerOn: "⏳ Χρονόμετρο: Ενεργό (60')",
    timerOff: '⏳ Χρονόμετρο: Ανενεργό',
    resultTitle: 'Ολοκλήρωση 1ου Τεστ Προσομοίωσης!',
    finalScoreLabel: 'Τελικό Σκορ',
    correctOutOf: (c) => `(${c} σωστές στις 25 ερωτήσεις)`,
    resultSubtitle: 'Δες παρακάτω αναλυτικά ποιες ερωτήσεις απάντησες σωστά (✅) ή λάθος (❌) μαζί με την αναλυτική μαθηματική λύση για κάθε θέμα.',
    questionPrefix: 'Θέμα',
    groupA: 'ΟΜΑΔΑ Α (4 ΕΠΙΛΟΓΕΣ)',
    groupB: 'ΟΜΑΔΑ Β (5 ΕΠΙΛΟΓΕΣ)',
    pointsEarned: '✅ +2 μόρια',
    pointsZero: '❌ 0 μόρια',
    explainTitleSubmitted: 'Μαθηματική Επεξήγηση:',
    explainTitlePreview: 'Προβολή Αναλυτικής Λύσης & Σχήματος',
    submitMainBtn: (c) => `Οριστική Υποβολή Τεστ (${c} από 25)`,
    barScore: (s) => `Σκορ: ${s} / 50`,
    barAnswered: (c) => `Απαντήσεις: ${c} / 25`,
    barPercent: 'Ποσοστό:',
    barRemaining: 'Υπολείπονται:',
    retryBtn: '🔄 Επανάληψη Τεστ',
    checkBtn: 'Έλεγχος & Βαθμολόγηση ➔',
    schemaHome: 'Αρχική',
    schemaHub: 'Ενδεικτικά Θέματα Προτύπων 2026',
    schemaSimHub: 'Τεστ Προσομοίωσης Προτύπων 2026',
    schemaCurrent: '1ο Τεστ Προσομοίωσης – Ενδεικτικά Θέματα 2026',
    schemaQuizName: 'Ενδεικτικά Θέματα Προτύπων 2026 – 1ο Τεστ Προσομοίωσης Μαθηματικών',
    schemaQuizDesc: '1ο Διαγνωστικό Τεστ Προσομοίωσης με ενδεικτικά θέματα Μαθηματικών για τα Πρότυπα Γυμνάσια 2026: 25 ερωτήσεις πολλαπλής επιλογής, χρονόμετρο 60 λεπτών, βαθμολογία 0–50 και αναλυτικές λύσεις με SVG σχήματα.',
    schemaEduLevel: "ΣΤ' Δημοτικού",
    schemaQuestionName: (id) => `Ενδεικτικό Θέμα ${id} - Πρότυπα 2026`
  },
  en: {
    metaTitle: 'Model Schools 2026 Practice – Mock Test 1 | LearnMaths.gr',
    metaDesc: 'Practice with Mock Test 1 of 2026 Model School Mathematics problems: 25 multiple-choice questions, 60-minute timer, 0–50 grading, and step-by-step solutions.',
    backText: 'Mock Tests 2026',
    heroBadge: 'MODEL SCHOOLS 2026 PRACTICE • MOCK TEST 1 (25 QUESTIONS)',
    heroTitle: 'Model Schools 2026 Practice – Mock Test 1',
    heroSubtitle: 'Practice with 25 curated Model School Mathematics problems for the 2026 entrance exams (arithmetic, fractions, percentages, equations, geometry, and combinatorics) with step-by-step solutions.',
    answeredLabel: 'Answered:',
    of25: 'of 25',
    scoringLabel: 'Scoring:',
    scoringValue: '2 pts / correct (Max: 50)',
    timerOn: "⏳ Timer: Active (60')",
    timerOff: '⏳ Timer: Disabled',
    resultTitle: 'Mock Test 1 Completed!',
    finalScoreLabel: 'Final Score',
    correctOutOf: (c) => `(${c} correct out of 25 questions)`,
    resultSubtitle: 'Review below which questions you answered correctly (✅) or incorrectly (❌), along with the full mathematical explanation for each problem.',
    questionPrefix: 'Question',
    groupA: 'GROUP A (4 CHOICES)',
    groupB: 'GROUP B (5 CHOICES)',
    pointsEarned: '✅ +2 pts',
    pointsZero: '❌ 0 pts',
    explainTitleSubmitted: 'Mathematical Explanation:',
    explainTitlePreview: 'View Step-by-Step Solution & Diagram',
    submitMainBtn: (c) => `Submit Test (${c} of 25)`,
    barScore: (s) => `Score: ${s} / 50`,
    barAnswered: (c) => `Answered: ${c} / 25`,
    barPercent: 'Percentage:',
    barRemaining: 'Remaining:',
    retryBtn: '🔄 Retake Test',
    checkBtn: 'Check & Grade ➔',
    schemaHome: 'Home',
    schemaHub: 'Model School Entrance 2026 Prep',
    schemaSimHub: 'Model Schools 2026 Mock Tests',
    schemaCurrent: 'Mock Test 1 – 2026 Practice Set',
    schemaQuizName: 'Model Schools 2026 Practice – Mathematics Mock Test 1',
    schemaQuizDesc: '1st Diagnostic Mock Test with 2026 Model School Mathematics practice problems: 25 multiple-choice questions, 60-minute timer, 0–50 score, and step-by-step solutions with SVG diagrams.',
    schemaEduLevel: 'Grade 6',
    schemaQuestionName: (id) => `Practice Question ${id} - Model Schools 2026`
  }
};

function getQuestions(locale) {
  const isEn = locale === 'en';
  const groupA = isEn ? 'GROUP A (4 CHOICES)' : 'ΟΜΑΔΑ Α (4 ΕΠΙΛΟΓΕΣ)';
  const groupB = isEn ? 'GROUP B (5 CHOICES)' : 'ΟΜΑΔΑ Β (5 ΕΠΙΛΟΓΕΣ)';

  return [
    {
      id: 1,
      group: groupA,
      prompt: isEn ? (
        <div className="space-y-1.5">
          <p>What is the value of the following numerical expression?</p>
          <div className="font-mono text-sm sm:text-base flex items-center flex-wrap gap-1.5 pt-0.5">
            <span>(13 : 2 －</span>
            <Pow base="2" exp="3" />
            <span>: 2) : 0.25 －</span>
            <Pow base="1" exp="5" />
          </div>
        </div>
      ) : (
        <div className="space-y-1.5">
          <p>Ποια είναι η τιμή της παρακάτω αριθμητικής παράστασης;</p>
          <div className="font-mono text-sm sm:text-base flex items-center flex-wrap gap-1.5 pt-0.5">
            <span>(13 : 2 －</span>
            <Pow base="2" exp="3" />
            <span>: 2) : 0,25 －</span>
            <Pow base="1" exp="5" />
          </div>
        </div>
      ),
      options: [
        '9',
        '4',
        isEn ? '1.5' : '1,5',
        '10'
      ],
      correct: '9',
      explain: isEn ? (
        <div className="space-y-4 text-xs sm:text-sm">
          <p>
            Apply the <strong>order of operations</strong> (exponents ➔ parentheses ➔ multiplication/division ➔ addition/subtraction):
          </p>
          <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-2.5">
            <div className="font-sans font-bold text-blue-900 text-sm border-b border-slate-200 pb-1">
              🔷 Step-by-Step with Decimals
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
              <div>
                • <strong>Exponents:</strong> <Pow base="2" exp="3" /> ＝ 2 · 2 · 2 ＝ <strong>8</strong> &nbsp;and&nbsp; <Pow base="1" exp="5" /> ＝ <strong>1</strong>
              </div>
              <div className="pt-1 border-t border-slate-200 space-y-1">
                <div>• <strong>Inside parentheses:</strong> 13 : 2 ＝ <strong>6.5</strong>, &nbsp;8 : 2 ＝ <strong>4</strong> ➔ 6.5 － 4 ＝ <strong>2.5</strong></div>
              </div>
              <div className="pt-1 border-t border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span>• <strong>Division &amp; subtraction:</strong></span>
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                    <Frac num="2.5" den="0.25" /> ＝ 2.5 · 4 ＝ <strong>10</strong>
                  </span>
                </div>
                <div className="pt-0.5 text-emerald-700 font-bold text-base">
                  10 － <Pow base="1" exp="5" /> ＝ 10 － 1 ＝ 9
                </div>
              </div>
            </div>
          </div>
          <p className="pt-1">Therefore, the value of the numerical expression is <strong>9</strong>.</p>
        </div>
      ) : (
        <div className="space-y-4 text-xs sm:text-sm">
          <p>
            Εφαρμόζουμε την <strong>προτεραιότητα των πράξεων</strong> (δυνάμεις ➔ πράξεις εντός παρενθέσεων ➔ πολλαπλασιασμοί/διαιρέσεις ➔ προσθέσεις/αφαιρέσεις):
          </p>
          <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-2.5">
            <div className="font-sans font-bold text-blue-900 text-sm border-b border-slate-200 pb-1">
              🔷 1ος Τρόπος (Βήμα προς βήμα με δεκαδικούς αριθμούς)
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
              <div>
                • <strong>Υπολογισμός δυνάμεων:</strong> <Pow base="2" exp="3" /> ＝ 2 · 2 · 2 ＝ <strong>8</strong> &nbsp;και&nbsp; <Pow base="1" exp="5" /> ＝ <strong>1</strong>
              </div>
              <div className="pt-1 border-t border-slate-200 space-y-1">
                <div>• <strong>Πράξεις μέσα στην παρένθεση:</strong> 13 : 2 ＝ <strong>6,5</strong>, &nbsp;8 : 2 ＝ <strong>4</strong> ➔ 6,5 － 4 ＝ <strong>2,5</strong></div>
              </div>
              <div className="pt-1 border-t border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span>• <strong>Διαίρεση με το 0,25:</strong></span>
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                    <Frac num="2,5" den="0,25" /> ＝ 2,5 · 4 ＝ <strong>10</strong>
                  </span>
                </div>
                <div className="pt-0.5 text-emerald-700 font-bold text-base">
                  10 － <Pow base="1" exp="5" /> ＝ 10 － 1 ＝ 9
                </div>
              </div>
            </div>
          </div>
          <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200/80 space-y-2">
            <div className="font-sans font-bold text-emerald-950 text-sm border-b border-emerald-200 pb-1">
              💡 2ος Τρόπος (Υπολογισμός με κλάσματα)
            </div>
            <div className="bg-white/90 p-3 rounded-xl border border-emerald-200 font-mono text-slate-900 space-y-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>• Παρένθεση:</span>
                <Frac num="13" den="2" />
                <span>－</span>
                <Frac num="8" den="2" />
                <span>＝</span>
                <strong className="text-blue-700"><Frac num="5" den="2" /></strong>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-100">
                <span>• Διαίρεση:</span>
                <ComplexFrac num={<Frac num="5" den="2" small />} den={<Frac num="1" den="4" small />} />
                <span>＝</span>
                <Frac num="5" den="2" />
                <span>· 4 ＝ <strong>10</strong></span>
              </div>
              <div className="pt-1 border-t border-slate-100">
                <span>• Τελικό αποτέλεσμα: 10 － 1 ＝</span>
                <strong className="text-emerald-700 text-base">9</strong>
              </div>
            </div>
          </div>
          <p className="pt-1">Επομένως, η τιμή της αριθμητικής παράστασης είναι <strong>9</strong>.</p>
        </div>
      )
    },
    {
      id: 2,
      group: groupA,
      prompt: isEn
        ? 'What is the smallest four-digit natural number that is simultaneously divisible by 3, 4, and 5?'
        : 'Ποιος είναι ο μικρότερος τετραψήφιος φυσικός αριθμός ο οποίος διαιρείται ταυτόχρονα με το 3, το 4 και το 5;',
      options: isEn
        ? ['1,000', '1,020', '1,050', '1,080']
        : ['1.000', '1.020', '1.050', '1.080'],
      correct: isEn ? '1,020' : '1.020',
      explain: isEn ? (
        <div className="space-y-4 text-xs sm:text-sm">
          <p>
            To be divisible by <strong>3</strong>, <strong>4</strong>, and <strong>5</strong> simultaneously, a number must be a multiple of <strong>LCM(3, 4, 5)</strong>.
          </p>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>1. LCM(3, 4, 5) ＝ 3 · 4 · 5 ＝ <strong>60</strong>.</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>2. Smallest 4-digit number is 1,000:</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="1,000" den="60" /> ＝ 16 with remainder 40 (60 · 16 ＝ 960).
              </span>
            </div>
            <div>3. Next multiple of 60: 60 · 17 ＝ <strong className="text-emerald-700 text-base">1,020</strong>.</div>
          </div>
          <p className="pt-1">Therefore, the smallest four-digit number is <strong>1,020</strong>.</p>
        </div>
      ) : (
        <div className="space-y-4 text-xs sm:text-sm">
          <p>
            Για να διαιρείται ένας αριθμός ταυτόχρονα με το <strong>3</strong>, το <strong>4</strong> και το <strong>5</strong>, πρέπει να είναι κοινό πολλαπλάσιο των τριών αυτών αριθμών, δηλαδή πολλαπλάσιο του <strong>Ε.Κ.Π.(3, 4, 5)</strong>.
          </p>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>1. Ε.Κ.Π.(3, 4, 5) ＝ 3 · 4 · 5 ＝ <strong>60</strong>.</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>2. Μικρότερος τετραψήφιος το 1.000:</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="1.000" den="60" /> ＝ 16 και υπόλοιπο 40 (60 · 16 ＝ 960).
              </span>
            </div>
            <div>3. Επόμενο πολλαπλάσιο του 60: 60 · 17 ＝ <strong className="text-emerald-700 text-base">1.020</strong>.</div>
          </div>
          <p className="pt-1">Επομένως, ο μικρότερος τετραψήφιος αριθμός είναι το <strong>1.020</strong>.</p>
        </div>
      )
    },
    {
      id: 3,
      group: groupA,
      prompt: isEn ? (
        <span>
          A container is <Frac num="7" den="10" /> full of oil. We pour out 3 identical cups of oil from the container, and now it is <Frac num="1" den="10" /> full. How many such cups of oil fill the entire container if it is completely empty?
        </span>
      ) : (
        <span>
          Ένα δοχείο είναι γεμάτο με λάδι κατά τα <Frac num="7" den="10" /> του συνολικού του όγκου. Αδειάζουμε 3 ίδια φλιτζάνια λάδι από το δοχείο και πλέον είναι γεμάτο κατά το <Frac num="1" den="10" />. Με πόσα τέτοια φλιτζάνια λάδι γεμίζει ολόκληρο το δοχείο αν είναι τελείως άδειο;
        </span>
      ),
      options: ['5', '6', '8', '10'],
      correct: '5',
      explain: isEn ? (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>1. 3 cups ＝ <Frac num="7" den="10" /> － <Frac num="1" den="10" /> ＝ <Frac num="6" den="10" /> of the container.</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>2. 1 cup ＝</span>
              <ComplexFrac num={<Frac num="6" den="10" small />} den="3" />
              <span>＝ <Frac num="2" den="10" /> ＝ <Frac num="1" den="5" /> of the container.</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>3. Full container ＝</span>
              <ComplexFrac num={<Frac num="5" den="5" small />} den={<Frac num="1" den="5" small />} />
              <span>＝ <strong className="text-emerald-700 text-base">5 cups</strong>.</span>
            </div>
          </div>
          <p className="pt-1">Thus, <strong>5 cups</strong> fill the entire container.</p>
        </div>
      ) : (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>1. 3 φλιτζάνια ＝ <Frac num="7" den="10" /> － <Frac num="1" den="10" /> ＝ <Frac num="6" den="10" /> του δοχείου.</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>2. 1 φλιτζάνι ＝</span>
              <ComplexFrac num={<Frac num="6" den="10" small />} den="3" />
              <span>＝ <Frac num="2" den="10" /> ＝ <Frac num="1" den="5" /> του δοχείου.</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>3. Ολόκληρο δοχείο ＝</span>
              <ComplexFrac num={<Frac num="5" den="5" small />} den={<Frac num="1" den="5" small />} />
              <span>＝ <strong className="text-emerald-700 text-base">5 φλιτζάνια</strong>.</span>
            </div>
          </div>
          <p className="pt-1">Επομένως, για να γεμίσει ολόκληρο το δοχείο χρειάζονται <strong>5 φλιτζάνια</strong>.</p>
        </div>
      )
    },
    {
      id: 4,
      group: groupA,
      prompt: isEn
        ? 'A pair of shoes originally cost 80 €. During the sales, it was bought for 56 €. What was the discount percentage (%) on the original price?'
        : 'Ένα ζευγάρι παπούτσια κόστιζε αρχικά 80€. Στις εκπτώσεις αγοράστηκε στην τιμή των 56€. Ποιο ήταν το ποσοστό (%) της έκπτωσης που έγινε στην αρχική τιμή;',
      options: ['24%', '30%', '40%', '70%'],
      correct: '30%',
      explain: isEn ? (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>1. Discount amount ＝ 80 € － 56 € ＝ <strong>24 €</strong>.</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>2. Discount fraction ＝</span>
              <Frac num="24" den="80" />
              <span>＝ <Frac num="3" den="10" /> ＝ <Frac num="30" den="100" /> ＝ <strong className="text-emerald-700 text-base">30%</strong>.</span>
            </div>
          </div>
          <p className="pt-1">Therefore, the discount percentage on the original price was <strong>30%</strong>.</p>
        </div>
      ) : (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>1. Ποσό έκπτωσης ＝ 80 € － 56 € ＝ <strong>24 €</strong>.</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>2. Κλάσμα έκπτωσης ＝</span>
              <Frac num="24" den="80" />
              <span>＝ <Frac num="3" den="10" /> ＝ <Frac num="30" den="100" /> ＝ <strong className="text-emerald-700 text-base">30%</strong>.</span>
            </div>
          </div>
          <p className="pt-1">Επομένως, το ποσοστό της έκπτωσης στην αρχική τιμή ήταν <strong>30%</strong>.</p>
        </div>
      )
    },
    {
      id: 5,
      group: groupA,
      prompt: isEn ? (
        <span>
          Triple an unknown number x, increased by <Frac num="1" den="3" /> of the same number, equals 20. Which of the following equations correctly describes the problem?
        </span>
      ) : (
        <span>
          Το τριπλάσιο ενός άγνωστου αριθμού x, αυξημένο κατά το <Frac num="1" den="3" /> του ίδιου αριθμού, ισούται με 20. Ποια από τις παρακάτω εξισώσεις περιγράφει σωστά το πρόβλημα;
        </span>
      ),
      options: [
        '3 · x － x : 3 ＝ 20',
        '3 · x ＋ x : 3 ＝ 20',
        '3 · (x ＋ x : 3) ＝ 20',
        'x : 3 ＋ 3 ＝ 20'
      ],
      correct: '3 · x ＋ x : 3 ＝ 20',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>• &quot;Triple x&quot; ➔ <strong>3 · x</strong></p>
          <p>• &quot;increased by <Frac num="1" den="3" /> of the number&quot; ➔ <strong>＋ <Frac num="x" den="3" /></strong> (or <strong>＋ x : 3</strong>)</p>
          <p>• &quot;equals 20&quot; ➔ <strong>＝ 20</strong></p>
          <p className="pt-1 font-bold text-emerald-800">Equation: 3 · x ＋ x : 3 ＝ 20.</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <p>• «Το τριπλάσιο του x» ➔ <strong>3 · x</strong></p>
          <p>• «αυξημένο κατά το <Frac num="1" den="3" /> του ίδιου αριθμού» ➔ <strong>＋ <Frac num="x" den="3" /></strong> (ή <strong>＋ x : 3</strong>)</p>
          <p>• «ισούται με 20» ➔ <strong>＝ 20</strong></p>
          <p className="pt-1 font-bold text-emerald-800">Εξίσωση: 3 · x ＋ x : 3 ＝ 20.</p>
        </div>
      )
    },
    {
      id: 6,
      group: groupA,
      prompt: isEn
        ? 'Which of the following fractions is closest to the decimal number 0.8 on the number line?'
        : 'Ποιο από τα παρακάτω κλάσματα βρίσκεται πιο κοντά στον δεκαδικό αριθμό 0,8 στην αριθμογραμμή;',
      options: [
        <Frac num="3" den="4" />,
        <Frac num="7" den="10" />,
        <Frac num="43" den="50" />,
        <Frac num="21" den="25" />
      ],
      correct: '21/25',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• <Frac num="7" den="10" /> ＝ 0.70 ➔ distance from 0.80: <strong>0.10</strong></div>
            <div>• <Frac num="3" den="4" /> ＝ 0.75 ➔ distance from 0.80: <strong>0.05</strong></div>
            <div>• <Frac num="21" den="25" /> ＝ 0.84 ➔ distance from 0.80: <strong className="text-emerald-700">0.04 (closest)</strong></div>
            <div>• <Frac num="43" den="50" /> ＝ 0.86 ➔ distance from 0.80: <strong>0.06</strong></div>
          </div>
          <p className="pt-1">Thus, the closest fraction to 0.8 is <strong><Frac num="21" den="25" /></strong>.</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• <Frac num="7" den="10" /> ＝ 0,70 ➔ απόσταση από 0,80: <strong>0,10</strong></div>
            <div>• <Frac num="3" den="4" /> ＝ 0,75 ➔ απόσταση από 0,80: <strong>0,05</strong></div>
            <div>• <Frac num="21" den="25" /> ＝ 0,84 ➔ απόσταση από 0,80: <strong className="text-emerald-700">0,04 (πιο κοντά)</strong></div>
            <div>• <Frac num="43" den="50" /> ＝ 0,86 ➔ απόσταση από 0,80: <strong>0,06</strong></div>
          </div>
          <p className="pt-1">Επομένως, το πλησιέστερο κλάσμα στο 0,8 είναι το <strong><Frac num="21" den="25" /></strong>.</p>
        </div>
      )
    },
    {
      id: 7,
      group: groupA,
      prompt: isEn
        ? 'The average of 6 consecutive even natural numbers is 15. What is the greatest of these six numbers?'
        : 'Ο μέσος όρος 6 συνεχόμενων άρτιων (ζυγών) φυσικών αριθμών είναι 15. Ποιος είναι ο μεγαλύτερος από αυτούς τους έξι αριθμούς;',
      options: ['16', '18', '20', '22'],
      correct: '20',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Sum of the 6 consecutive even numbers: 6 · 15 ＝ <strong>90</strong>.</div>
            <div>• Let the smallest be a: a ＋ (a ＋ 2) ＋ (a ＋ 4) ＋ (a ＋ 6) ＋ (a ＋ 8) ＋ (a ＋ 10) ＝ 90 ➔ 6a ＋ 30 ＝ 90 ➔ <strong>a ＝ 10</strong>.</div>
            <div>• The six numbers are: 10, 12, 14, 16, 18, <strong className="text-emerald-700 text-base">20</strong>.</div>
          </div>
          <p className="pt-1">Therefore, the greatest of the six numbers is <strong>20</strong>.</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Άθροισμα των 6 συνεχόμενων άρτιων: 6 · 15 ＝ <strong>90</strong>.</div>
            <div>• Έστω α ο μικρότερος: α ＋ (α ＋ 2) ＋ (α ＋ 4) ＋ (α ＋ 6) ＋ (α ＋ 8) ＋ (α ＋ 10) ＝ 90 ➔ 6α ＋ 30 ＝ 90 ➔ <strong>α ＝ 10</strong>.</div>
            <div>• Οι έξι αριθμοί είναι: 10, 12, 14, 16, 18, <strong className="text-emerald-700 text-base">20</strong>.</div>
          </div>
          <p className="pt-1">Επομένως, ο μεγαλύτερος από τους έξι αριθμούς είναι το <strong>20</strong>.</p>
        </div>
      )
    },
    {
      id: 8,
      group: groupA,
      prompt: isEn
        ? 'A square has an area of 64 sq. cm. If we double the length of its side, what will the perimeter of the new square be?'
        : 'Ένα τετράγωνο έχει εμβαδόν 64 τ.εκ. Αν διπλασιάσουμε το μήκος της πλευράς του, πόσο θα γίνει η περίμετρος του νέου τετραγώνου;',
      options: isEn
        ? ['32 cm', '48 cm', '64 cm', '128 cm']
        : ['32 εκ.', '48 εκ.', '64 εκ.', '128 εκ.'],
      correct: isEn ? '64 cm' : '64 εκ.',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Original side: s ＝ <strong>8 cm</strong> (since 8 · 8 ＝ 64).</div>
            <div>• Doubled side: 2 · 8 ＝ <strong>16 cm</strong>.</div>
            <div>• New perimeter: P ＝ 4 · 16 ＝ <strong className="text-emerald-700 text-base">64 cm</strong>.</div>
          </div>
          <p className="pt-1">Therefore, the perimeter of the new square will be <strong>64 cm</strong>.</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Αρχική πλευρά: α ＝ <strong>8 εκ.</strong> (αφού 8 · 8 ＝ 64).</div>
            <div>• Διπλασιασμένη πλευρά: 2 · 8 ＝ <strong>16 εκ.</strong></div>
            <div>• Νέα περίμετρος: Π ＝ 4 · 16 ＝ <strong className="text-emerald-700 text-base">64 εκ.</strong></div>
          </div>
          <p className="pt-1">Επομένως, η περίμετρος του νέου τετραγώνου θα γίνει <strong>64 εκ.</strong></p>
        </div>
      )
    },
    {
      id: 9,
      group: groupA,
      prompt: isEn
        ? 'Eleni and Dimitra together have 45 books. If Eleni gives 5 books to Dimitra, then Dimitra will have twice as many books as Eleni. How many books did Eleni have originally?'
        : 'Η Ελένη και η Δήμητρα έχουν μαζί 45 βιβλία. Αν η Ελένη δώσει 5 βιβλία στη Δήμητρα, τότε η Δήμητρα θα έχει ακριβώς τα διπλάσια βιβλία από την Ελένη. Πόσα βιβλία είχε αρχικά η Ελένη;',
      options: ['15', '20', '25', '30'],
      correct: '20',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Total books remain 45. At the end, Eleni has 1 part and Dimitra has 2 parts (3 parts total): 1 part ＝</span>
              <Frac num="45" den="3" />
              <span>＝ <strong>15 books</strong>.</span>
            </div>
            <div>• Returning the 5 books Eleni gave: 15 ＋ 5 ＝ <strong className="text-emerald-700 text-base">20 books</strong>.</div>
          </div>
          <p className="pt-1">Thus, Eleni originally had <strong>20 books</strong>.</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Το σύνολο μένει 45. Στο τέλος η Ελένη έχει 1 μέρος και η Δήμητρα 2 μέρη (3 μέρη): 1 μέρος ＝</span>
              <Frac num="45" den="3" />
              <span>＝ <strong>15 βιβλία</strong>.</span>
            </div>
            <div>• Επιστρέφοντας τα 5 βιβλία στην Ελένη: 15 ＋ 5 ＝ <strong className="text-emerald-700 text-base">20 βιβλία</strong>.</div>
          </div>
          <p className="pt-1">Επομένως, η Ελένη είχε αρχικά <strong>20 βιβλία</strong>.</p>
        </div>
      )
    },
    {
      id: 10,
      group: groupA,
      prompt: isEn
        ? 'Which number corresponds to the missing term in the numerical pattern?\n2, 6, 12, 20, 30, __, 56, 72'
        : 'Σε ποιον αριθμό αντιστοιχεί ο όρος που λείπει από το παρακάτω αριθμητικό μοτίβο;\n2, 6, 12, 20, 30, __, 56, 72',
      options: ['36', '40', '42', '45'],
      correct: '42',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Differences: ＋4, ＋6, ＋8, ＋10, <strong className="text-emerald-700">＋12</strong>, ＋14, ＋16.</div>
            <div>• Missing term: 30 ＋ 12 ＝ <strong className="text-emerald-700 text-base">42</strong> (or 6 · 7 ＝ 42).</div>
          </div>
          <p className="pt-1">Therefore, the missing term is <strong>42</strong>.</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Διαφορές: ＋4, ＋6, ＋8, ＋10, <strong className="text-emerald-700">＋12</strong>, ＋14, ＋16.</div>
            <div>• Όρος που λείπει: 30 ＋ 12 ＝ <strong className="text-emerald-700 text-base">42</strong> (ή 6 · 7 ＝ 42).</div>
          </div>
          <p className="pt-1">Επομένως, ο όρος που λείπει είναι ο αριθμός <strong>42</strong>.</p>
        </div>
      )
    },
    {
      id: 11,
      group: groupB,
      prompt: isEn
        ? 'For 6 identical notebooks and 4 identical pens we paid 24 € in total. If we bought 6 identical notebooks and 7 identical pens we would pay 33 € in total. How many euros does one notebook cost?'
        : 'Για την αγορά 6 ίδιων τετραδίων και 4 ίδιων στυλό πληρώσαμε συνολικά 24€. Αν αγοράζαμε 6 ίδια τετράδια και 7 ίδια στυλό θα πληρώναμε συνολικά 33€. Πόσα ευρώ κοστίζει το ένα τετράδιο;',
      options: isEn
        ? ['1.5 €', '2 €', '2.5 €', '3 €', '4 €']
        : ['1,5 €', '2 €', '2,5 €', '3 €', '4 €'],
      correct: '2 €',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• 3 extra pens cost 33 € － 24 € ＝ 9 € ➔ 1 pen ＝</span>
              <Frac num="9" den="3" />
              <span>＝ <strong>3 €</strong>.</span>
            </div>
            <div>• 4 pens cost 4 · 3 € ＝ 12 € ➔ 6 notebooks cost 24 € － 12 € ＝ 12 €.</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• 1 notebook ＝</span>
              <Frac num="12" den="6" />
              <span>＝ <strong className="text-emerald-700 text-base">2 €</strong>.</span>
            </div>
          </div>
          <p className="pt-1">Therefore, one notebook costs <strong>2 €</strong>.</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• 3 επιπλέον στυλό κοστίζουν 33 € － 24 € ＝ 9 € ➔ 1 στυλό ＝</span>
              <Frac num="9" den="3" />
              <span>＝ <strong>3 €</strong>.</span>
            </div>
            <div>• 4 στυλό κοστίζουν 4 · 3 € ＝ 12 € ➔ 6 τετράδια κοστίζουν 24 € － 12 € ＝ 12 €.</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• 1 τετράδιο ＝</span>
              <Frac num="12" den="6" />
              <span>＝ <strong className="text-emerald-700 text-base">2 €</strong>.</span>
            </div>
          </div>
          <p className="pt-1">Επομένως, το ένα τετράδιο κοστίζει <strong>2 €</strong>.</p>
        </div>
      )
    },
    {
      id: 12,
      group: groupB,
      prompt: isEn
        ? 'The bee population in a model hive increases by 20% every month. If today the hive has 5,000 bees, how many bees will it have after exactly two months?'
        : 'Ο πληθυσμός των μελισσών σε μια πρότυπη κυψέλη αυξάνεται κατά 20% κάθε μήνα. Αν σήμερα η κυψέλη έχει 5.000 μέλισσες, πόσες μέλισσες θα έχει μετά από ακριβώς δύο μήνες;',
      options: isEn
        ? ['6,000', '7,000', '7,200', '7,500', '8,000']
        : ['6.000', '7.000', '7.200', '7.500', '8.000'],
      correct: isEn ? '7,200' : '7.200',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• After Month 1 (＋20%): 5,000 ＋ 1,000 ＝ <strong>6,000 bees</strong>.</div>
            <div>• After Month 2 (＋20% of 6,000): 6,000 ＋ 1,200 ＝ <strong className="text-emerald-700 text-base">7,200 bees</strong>.</div>
          </div>
          <p className="pt-1">Thus, after two months the hive will have <strong>7,200 bees</strong>.</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Μετά τον 1ο μήνα (＋20%): 5.000 ＋ 1.000 ＝ <strong>6.000 μέλισσες</strong>.</div>
            <div>• Μετά τον 2ο μήνα (＋20% των 6.000): 6.000 ＋ 1.200 ＝ <strong className="text-emerald-700 text-base">7.200 μέλισσες</strong>.</div>
          </div>
          <p className="pt-1">Επομένως, μετά από δύο μήνες η κυψέλη θα έχει <strong>7.200 μέλισσες</strong>.</p>
        </div>
      )
    },
    {
      id: 13,
      group: groupB,
      prompt: isEn ? (
        <span>
          We have three identical glasses. The 1st glass is <Frac num="3" den="4" /> full of water and the 2nd is <Frac num="1" den="2" /> full of water. We pour all the water initially in the 3rd glass into the 1st and 2nd glasses, so that both become completely full. What fraction of the 3rd glass was initially full of water?
        </span>
      ) : (
        <span>
          Έχουμε τρία ίδια ποτήρια. Το 1ο ποτήρι είναι κατά <Frac num="3" den="4" /> γεμάτο με νερό και το 2ο είναι κατά <Frac num="1" den="2" /> γεμάτο με νερό. Αδειάζουμε όλο το νερό που περιείχε αρχικά το 3ο ποτήρι μέσα στο 1ο και στο 2ο ποτήρι, με αποτέλεσμα αυτά τα δύο να γεμίσουν τελείως. Τι μέρος του 3ου ποτηριού ήταν γεμάτο με νερό αρχικά;
        </span>
      ),
      options: [
        <Frac num="1" den="4" />,
        <Frac num="3" den="8" />,
        <Frac num="1" den="2" />,
        <Frac num="3" den="4" />,
        <Frac num="7" den="8" />
      ],
      correct: '3/4',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Missing in 1st glass: 1 － <Frac num="3" den="4" /> ＝ <Frac num="1" den="4" />.</div>
            <div>• Missing in 2nd glass: 1 － <Frac num="1" den="2" /> ＝ <Frac num="2" den="4" />.</div>
            <div>• Initial water in 3rd glass: <Frac num="1" den="4" /> ＋ <Frac num="2" den="4" /> ＝ <strong className="text-emerald-700 text-base"><Frac num="3" den="4" /></strong>.</div>
          </div>
          <p className="pt-1">Therefore, the 3rd glass was initially <strong><Frac num="3" den="4" /></strong> full.</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Έλειπε στο 1ο ποτήρι: 1 － <Frac num="3" den="4" /> ＝ <Frac num="1" den="4" />.</div>
            <div>• Έλειπε στο 2ο ποτήρι: 1 － <Frac num="1" den="2" /> ＝ <Frac num="2" den="4" />.</div>
            <div>• Αρχικό νερό 3ου ποτηριού: <Frac num="1" den="4" /> ＋ <Frac num="2" den="4" /> ＝ <strong className="text-emerald-700 text-base"><Frac num="3" den="4" /></strong>.</div>
          </div>
          <p className="pt-1">Επομένως, το 3ο ποτήρι ήταν αρχικά γεμάτο κατά τα <strong><Frac num="3" den="4" /></strong>.</p>
        </div>
      )
    },
    {
      id: 14,
      group: groupB,
      prompt: isEn
        ? 'The students of class 6A at a school were divided into groups of 6 for a game and 4 students were left over. On the same day, when all students of classes 6A and 6B together were divided into groups of 6, no students were left over. If we divide only the students of class 6B into groups of 6, how many students will be left over?'
        : 'Τα παιδιά του τμήματος ΣΤ1 ενός σχολείου χωρίστηκαν σε εξάδες για ένα παιχνίδι και περίσσεψαν 4 παιδιά. Την ίδια ημέρα, όταν όλα τα παιδιά των τμημάτων ΣΤ1 και ΣΤ2 μαζί χωρίστηκαν σε εξάδες, δεν περίσσεψε κανένα παιδί. Αν χωρίσουμε μόνο τα παιδιά του τμήματος ΣΤ2 σε εξάδες, πόσα παιδιά θα περισσέψουν;',
      options: isEn
        ? ['1 student', '2 students', '3 students', '4 students', 'No students']
        : ['1 παιδί', '2 παιδιά', '3 παιδιά', '4 παιδιά', 'Κανένα παιδί'],
      correct: isEn ? '2 students' : '2 παιδιά',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Class 6A leaves remainder <strong>4</strong> when divided by 6.</div>
            <div>• To complete a full group of 6 with 6B&apos;s remainder, 6 － 4 ＝ <strong className="text-emerald-700 text-base">2 students</strong> are needed from 6B.</div>
          </div>
          <p className="pt-1">Thus, dividing only class 6B into groups of 6 leaves <strong>2 students</strong>.</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Το ΣΤ1 αφήνει υπόλοιπο <strong>4</strong> στη διαίρεση με το 6.</div>
            <div>• Για να συμπληρωθεί πλήρης εξάδα μαζί με το ΣΤ2, απαιτούνται από το ΣΤ2: 6 － 4 ＝ <strong className="text-emerald-700 text-base">2 παιδιά</strong>.</div>
          </div>
          <p className="pt-1">Επομένως, αν χωρίσουμε μόνο το ΣΤ2 σε εξάδες, θα περισσέψουν <strong>2 παιδιά</strong>.</p>
        </div>
      )
    },
    {
      id: 15,
      group: groupB,
      prompt: isEn
        ? 'Giorgos can paint a large wall in 6 hours, while Dimitris can paint the exact same wall in 3 hours. If they work together at the same rates, in how many hours will they finish painting the wall?'
        : 'Ο Γιώργος μπορεί να βάψει έναν μεγάλο τοίχο σε 6 ώρες, ενώ ο Δημήτρης μπορεί να βάψει τον ίδιο ακριβώς τοίχο σε 3 ώρες. Αν εργαστούν μαζί και με τον ίδιο ρυθμό, σε πόσες ώρες θα ολοκληρώσουν το βάψιμο του τοίχου;',
      options: isEn
        ? ['1.5 hours', '2 hours', '3 hours', '4 hours', '4.5 hours']
        : ['1,5 ώρα', '2 ώρες', '3 ώρες', '4 ώρες', '4,5 ώρες'],
      correct: isEn ? '2 hours' : '2 ώρες',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• In 1 hour together: <Frac num="1" den="6" /> ＋ <Frac num="1" den="3" /> ＝ <Frac num="1" den="6" /> ＋ <Frac num="2" den="6" /> ＝ <Frac num="3" den="6" /> ＝ <Frac num="1" den="2" /> of the wall.</div>
            <div>• Total time: 1 : <Frac num="1" den="2" /> ＝ <strong className="text-emerald-700 text-base">2 hours</strong>.</div>
          </div>
          <p className="pt-1">Therefore, working together they will finish in <strong>2 hours</strong>.</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Μαζί σε 1 ώρα: <Frac num="1" den="6" /> ＋ <Frac num="1" den="3" /> ＝ <Frac num="1" den="6" /> ＋ <Frac num="2" den="6" /> ＝ <Frac num="3" den="6" /> ＝ <Frac num="1" den="2" /> του τοίχου.</div>
            <div>• Συνολικός χρόνος: 1 : <Frac num="1" den="2" /> ＝ <strong className="text-emerald-700 text-base">2 ώρες</strong>.</div>
          </div>
          <p className="pt-1">Επομένως, εργαζόμενοι μαζί θα ολοκληρώσουν σε <strong>2 ώρες</strong>.</p>
        </div>
      )
    },
    {
      id: 16,
      group: groupB,
      prompt: isEn
        ? 'A school garden has a rectangular shape with dimensions 15 meters and 10 meters. Inside the garden and along all its sides, we build a paved walkway of uniform width 1 meter. What is the total area of this walkway?'
        : 'Ένας σχολικός κήπος έχει σχήμα ορθογωνίου με διαστάσεις 15 μέτρα και 10 μέτρα. Στο εσωτερικό του κήπου και κατά μήκος όλων των πλευρών του κατασκευάζουμε έναν πλακόστρωτο διάδρομο σταθερού πλάτους 1 μέτρου. Ποιο είναι το συνολικό εμβαδόν του διαδρόμου αυτού;',
      options: isEn
        ? ['25 sq. m.', '44 sq. m.', '46 sq. m.', '50 sq. m.', '104 sq. m.']
        : ['25 τ.μ.', '44 τ.μ.', '46 τ.μ.', '50 τ.μ.', '104 τ.μ.'],
      correct: isEn ? '46 sq. m.' : '46 τ.μ.',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Total area: 15 · 10 ＝ <strong>150 sq. m.</strong></div>
            <div>• Inner garden dimensions: (15 － 2) m by (10 － 2) m ＝ 13 m · 8 m ＝ <strong>104 sq. m.</strong></div>
            <div>• Walkway area: 150 － 104 ＝ <strong className="text-emerald-700 text-base">46 sq. m.</strong></div>
          </div>
          <p className="pt-1">Therefore, the total area of the walkway is <strong>46 sq. m.</strong></p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Συνολικό εμβαδόν: 15 · 10 ＝ <strong>150 τ.μ.</strong></div>
            <div>• Εσωτερικός κήπος: (15 － 2) μ. × (10 － 2) μ. ＝ 13 μ. · 8 μ. ＝ <strong>104 τ.μ.</strong></div>
            <div>• Εμβαδόν διαδρόμου: 150 － 104 ＝ <strong className="text-emerald-700 text-base">46 τ.μ.</strong></div>
          </div>
          <p className="pt-1">Επομένως, το συνολικό εμβαδόν του διαδρόμου είναι <strong>46 τ.μ.</strong></p>
        </div>
      )
    },
    {
      id: 17,
      group: groupB,
      prompt: isEn
        ? 'In a survey on students’ vacation preferences, 70% of respondents said they prefer the mountains. Of those who do not prefer the mountains, half said they prefer the sea. If those who prefer the sea are 45 students, how many students in total participated in the survey?'
        : 'Σε μια έρευνα για τις προτιμήσεις διακοπών των μαθητών, το 70% των ερωτηθέντων απάντησε ότι προτιμά το βουνό. Από αυτούς που δεν προτιμούν το βουνό, οι μισοί απάντησαν ότι προτιμούν τη θάλασσα. Αν όσοι προτιμούν τη θάλασσα είναι 45 μαθητές, πόσοι ήταν συνολικά οι μαθητές που συμμετείχαν στην έρευνα;',
      options: ['150', '200', '250', '300', '450'],
      correct: '300',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Do not prefer mountains: 100% － 70% ＝ <strong>30%</strong>.</div>
            <div>• Prefer sea: half of 30% ＝ <Frac num="30%" den="2" /> ＝ <strong>15%</strong> ＝ 45 students.</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• 1% ＝</span>
              <Frac num="45" den="15" />
              <span>＝ 3 students ➔ 100% ＝ 3 · 100 ＝ <strong className="text-emerald-700 text-base">300 students</strong>.</span>
            </div>
          </div>
          <p className="pt-1">Therefore, <strong>300 students</strong> participated in total.</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Δεν προτιμούν το βουνό: 100% － 70% ＝ <strong>30%</strong>.</div>
            <div>• Προτιμούν τη θάλασσα: οι μισοί από το 30% ＝ <Frac num="30%" den="2" /> ＝ <strong>15%</strong> ＝ 45 μαθητές.</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Το 1% ＝</span>
              <Frac num="45" den="15" />
              <span>＝ 3 μαθητές ➔ 100% ＝ 3 · 100 ＝ <strong className="text-emerald-700 text-base">300 μαθητές</strong>.</span>
            </div>
          </div>
          <p className="pt-1">Επομένως, συμμετείχαν συνολικά <strong>300 μαθητές</strong>.</p>
        </div>
      )
    },
    {
      id: 18,
      group: groupB,
      prompt: isEn ? (
        <span>
          A car used <Frac num="1" den="8" /> of the fuel of its total tank capacity for a trip. Before starting the trip, the tank contained 30 liters of fuel. After the trip ended, the tank was exactly half full. How many liters of fuel does the car&apos;s tank hold in total?
        </span>
      ) : (
        <span>
          Ένα αυτοκίνητο κατανάλωσε το <Frac num="1" den="8" /> της βενζίνης της συνολικής χωρητικότητας του ρεζερβουάρ του για ένα ταξίδι. Πριν ξεκινήσει το ταξίδι, το ρεζερβουάρ περιείχε 30 λίτρα βενζίνης. Μετά το τέλος του ταξιδιού, το ρεζερβουάρ ήταν ακριβώς μισογεμάτο. Πόσα λίτρα βενζίνης χωράει συνολικά το ρεζερβουάρ του αυτοκινήτου;
        </span>
      ),
      options: isEn
        ? ['40 liters', '45 liters', '48 liters', '50 liters', '60 liters']
        : ['40 λίτρα', '45 λίτρα', '48 λίτρα', '50 λίτρα', '60 λίτρα'],
      correct: isEn ? '48 liters' : '48 λίτρα',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Half full at the end: <Frac num="1" den="2" /> ＝ <Frac num="4" den="8" />.</div>
            <div>• Initial fuel: <Frac num="4" den="8" /> ＋ <Frac num="1" den="8" /> ＝ <Frac num="5" den="8" /> ＝ 30 liters.</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• <Frac num="1" den="8" /> ＝</span>
              <Frac num="30" den="5" />
              <span>＝ 6 liters ➔ Full tank (<Frac num="8" den="8" />) ＝ 8 · 6 ＝ <strong className="text-emerald-700 text-base">48 liters</strong>.</span>
            </div>
          </div>
          <p className="pt-1">Thus, the car&apos;s tank holds <strong>48 liters</strong> in total.</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Μισογεμάτο στο τέλος: <Frac num="1" den="2" /> ＝ <Frac num="4" den="8" />.</div>
            <div>• Αρχική βενζίνη: <Frac num="4" den="8" /> ＋ <Frac num="1" den="8" /> ＝ <Frac num="5" den="8" /> ＝ 30 λίτρα.</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Το <Frac num="1" den="8" /> ＝</span>
              <Frac num="30" den="5" />
              <span>＝ 6 λίτρα ➔ Ολόκληρο (<Frac num="8" den="8" />) ＝ 8 · 6 ＝ <strong className="text-emerald-700 text-base">48 λίτρα</strong>.</span>
            </div>
          </div>
          <p className="pt-1">Επομένως, το ρεζερβουάρ χωράει συνολικά <strong>48 λίτρα</strong>.</p>
        </div>
      )
    },
    {
      id: 19,
      group: groupB,
      prompt: isEn
        ? 'The average of a student’s scores on 4 Mathematics tests is 15. If on the 5th test they score 20, what will be their new average score across all 5 tests?'
        : 'Ο μέσος όρος των βαθμών ενός μαθητή σε 4 διαγωνίσματα Μαθηματικών είναι 15. Αν στο 5ο διαγώνισμα γράψει βαθμό 20, ποιος θα είναι ο νέος μέσος όρος των βαθμών του στα 5 διαγωνίσματα;',
      options: [
        '15',
        isEn ? '15.5' : '15,5',
        '16',
        isEn ? '16.5' : '16,5',
        '17'
      ],
      correct: '16',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Sum of first 4 tests: 4 · 15 ＝ <strong>60</strong>.</div>
            <div>• New sum with 5th test: 60 ＋ 20 ＝ <strong>80</strong>.</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• New average:</span>
              <Frac num="80" den="5" />
              <span>＝ <strong className="text-emerald-700 text-base">16</strong>.</span>
            </div>
          </div>
          <p className="pt-1">Therefore, the new average across all 5 tests will be <strong>16</strong>.</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Άθροισμα 4 πρώτων διαγωνισμάτων: 4 · 15 ＝ <strong>60</strong>.</div>
            <div>• Νέο άθροισμα με το 5ο διαγώνισμα: 60 ＋ 20 ＝ <strong>80</strong>.</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Νέος μέσος όρος:</span>
              <Frac num="80" den="5" />
              <span>＝ <strong className="text-emerald-700 text-base">16</strong>.</span>
            </div>
          </div>
          <p className="pt-1">Επομένως, ο νέος μέσος όρος στα 5 διαγωνίσματα θα είναι <strong>16</strong>.</p>
        </div>
      )
    },
    {
      id: 20,
      group: groupB,
      prompt: isEn
        ? 'In an incomplete division of natural numbers, the quotient is 8 and the remainder is 5. If we know that the dividend is a two-digit number, how many different possible values can the divisor of this division take?'
        : 'Σε μια ατελή διαίρεση φυσικών αριθμών, το πηλίκο είναι 8 και το υπόλοιπο είναι 5. Αν γνωρίζουμε ότι ο διαιρετέος είναι διψήφιος αριθμός, πόσες διαφορετικές δυνατές τιμές μπορεί να πάρει ο διαιρέτης της διαίρεσης αυτής;',
      options: ['4', '5', '6', '7', '8'],
      correct: '6',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Remainder must be strictly less than divisor (5 &lt; d) ➔ <strong>d ≥ 6</strong>.</div>
            <div>• Dividend is two-digit: 8 · d ＋ 5 ≤ 99 ➔ 8 · d ≤ 94 ➔ d ≤ 11.75 ➔ <strong>d ≤ 11</strong>.</div>
            <div>• Possible divisors: &#123;6, 7, 8, 9, 10, 11&#125; ➔ <strong className="text-emerald-700 text-base">6 values</strong>.</div>
          </div>
          <p className="pt-1">Thus, the divisor can take <strong>6 different possible values</strong>.</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Το υπόλοιπο είναι μικρότερο από τον διαιρέτη (5 &lt; δ) ➔ <strong>δ ≥ 6</strong>.</div>
            <div>• Ο διαιρετέος είναι διψήφιος: 8 · δ ＋ 5 ≤ 99 ➔ 8 · δ ≤ 94 ➔ δ ≤ 11,75 ➔ <strong>δ ≤ 11</strong>.</div>
            <div>• Δυνατές τιμές διαιρέτη: &#123;6, 7, 8, 9, 10, 11&#125; ➔ <strong className="text-emerald-700 text-base">6 τιμές</strong>.</div>
          </div>
          <p className="pt-1">Επομένως, ο διαιρέτης μπορεί να πάρει <strong>6 διαφορετικές δυνατές τιμές</strong>.</p>
        </div>
      )
    },
    {
      id: 21,
      group: groupB,
      prompt: isEn
        ? 'A rectangle and an equilateral triangle have the same perimeter. The rectangle has length 11 cm and width 7 cm. What is the length of each side of the equilateral triangle?'
        : 'Ένα ορθογώνιο και ένα ισόπλευρο τρίγωνο έχουν την ίδια περίμετρο. Το ορθογώνιο έχει μήκος 11 εκ. και πλάτος 7 εκ. Πόσο είναι το μήκος της κάθε πλευράς του ισόπλευρου τριγώνου;',
      options: isEn
        ? ['9 cm', '10 cm', '12 cm', '14 cm', '18 cm']
        : ['9 εκ.', '10 εκ.', '12 εκ.', '14 εκ.', '18 εκ.'],
      correct: isEn ? '12 cm' : '12 εκ.',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Rectangle perimeter: 2 · (11 ＋ 7) ＝ <strong>36 cm</strong>.</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Equilateral triangle side (3 equal sides):</span>
              <Frac num="36" den="3" />
              <span>＝ <strong className="text-emerald-700 text-base">12 cm</strong>.</span>
            </div>
          </div>
          <p className="pt-1">Therefore, each side of the equilateral triangle is <strong>12 cm</strong>.</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Περίμετρος ορθογωνίου: 2 · (11 ＋ 7) ＝ <strong>36 εκ.</strong></div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Πλευρά ισόπλευρου τριγώνου (3 ίσες πλευρές):</span>
              <Frac num="36" den="3" />
              <span>＝ <strong className="text-emerald-700 text-base">12 εκ.</strong>.</span>
            </div>
          </div>
          <p className="pt-1">Επομένως, το μήκος της κάθε πλευράς του ισόπλευρου τριγώνου είναι <strong>12 εκ.</strong></p>
        </div>
      )
    },
    {
      id: 22,
      group: groupB,
      prompt: isEn
        ? 'A cyclist covers a distance of 18 kilometers in 45 minutes at a constant speed. How many kilometers will they cover in 1 hour and 15 minutes if they maintain the same speed?'
        : 'Ένας ποδηλάτης διανύει απόσταση 18 χιλιομέτρων σε 45 λεπτά με σταθερή ταχύτητα. Πόσα χιλιόμετρα θα διανύσει σε 1 ώρα και 15 λεπτά αν διατηρήσει την ίδια ταχύτητα;',
      options: isEn
        ? ['24 km', '27 km', '30 km', '32 km', '36 km']
        : ['24 χλμ.', '27 χλμ.', '30 χλμ.', '32 χλμ.', '36 χλμ.'],
      correct: isEn ? '30 km' : '30 χλμ.',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• 45 minutes ＝ 3 intervals of 15 minutes ➔ in 15 minutes:</span>
              <Frac num="18" den="3" />
              <span>＝ <strong>6 km</strong>.</span>
            </div>
            <div>• 1 hour and 15 minutes ＝ 75 minutes ＝ 5 intervals of 15 minutes: 5 · 6 ＝ <strong className="text-emerald-700 text-base">30 km</strong>.</div>
          </div>
          <p className="pt-1">Thus, the cyclist will cover <strong>30 kilometers</strong>.</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• 45 λεπτά ＝ 3 δεκαπεντάλεπτα ➔ σε 15 λεπτά:</span>
              <Frac num="18" den="3" />
              <span>＝ <strong>6 χλμ.</strong>.</span>
            </div>
            <div>• 1 ώρα και 15 λεπτά ＝ 75 λεπτά ＝ 5 δεκαπεντάλεπτα: 5 · 6 ＝ <strong className="text-emerald-700 text-base">30 χλμ.</strong>.</div>
          </div>
          <p className="pt-1">Επομένως, ο ποδηλάτης θα διανύσει <strong>30 χιλιόμετρα</strong>.</p>
        </div>
      )
    },
    {
      id: 23,
      group: groupB,
      prompt: isEn ? (
        <span>
          A student spent <Frac num="1" den="4" /> of their allowance on a book and then 40% of the remaining money on a game. If they had 18 € left, what was their original allowance?
        </span>
      ) : (
        <span>
          Ένας μαθητής ξόδεψε το <Frac num="1" den="4" /> του χαρτζιλικιού του για ένα βιβλίο και στη συνέχεια το 40% των χρημάτων που του είχαν απομείνει για ένα παιχνίδι. Αν του έμειναν 18€, πόσο ήταν το αρχικό του χαρτζιλίκι;
        </span>
      ),
      options: ['36 €', '40 €', '45 €', '48 €', '60 €'],
      correct: '40 €',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• After book (<Frac num="1" den="4" /> ＝ 25%): <strong>75%</strong> remains.</div>
            <div>• Game (40% of 75%): <strong>30%</strong> of original ➔ remaining: 75% － 30% ＝ <strong>45%</strong> ＝ 18 €.</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• 1% ＝</span>
              <Frac num="18" den="45" />
              <span>＝ 0.4 € ➔ 100% ＝ 100 · 0.4 € ＝ <strong className="text-emerald-700 text-base">40 €</strong>.</span>
            </div>
          </div>
          <p className="pt-1">Therefore, the student&apos;s original allowance was <strong>40 €</strong>.</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Μετά το βιβλίο (<Frac num="1" den="4" /> ＝ 25%): μένει το <strong>75%</strong>.</div>
            <div>• Παιχνίδι (40% του 75%): <strong>30%</strong> του αρχικού ➔ υπόλοιπο: 75% － 30% ＝ <strong>45%</strong> ＝ 18 €.</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Το 1% ＝</span>
              <Frac num="18" den="45" />
              <span>＝ 0,4 € ➔ 100% ＝ 100 · 0,4 € ＝ <strong className="text-emerald-700 text-base">40 €</strong>.</span>
            </div>
          </div>
          <p className="pt-1">Επομένως, το αρχικό χαρτζιλίκι του μαθητή ήταν <strong>40 €</strong>.</p>
        </div>
      )
    },
    {
      id: 24,
      group: groupB,
      prompt: isEn
        ? 'Six players participate in a chess tournament. Each player plays exactly one game with every other player. How many chess games will be played in total across the entire tournament?'
        : 'Σε ένα τουρνουά σκακιού συμμετέχουν 6 παίκτες. Κάθε παίκτης παίζει ακριβώς μία παρτίδα με καθέναν από τους υπόλοιπους παίκτες. Πόσες παρτίδες σκακιού θα διεξαχθούν συνολικά σε ολόκληρο το τουρνουά;',
      options: ['12', '15', '18', '30', '36'],
      correct: '15',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Each of the 6 players plays 5 games, divided by 2 to avoid double counting:</span>
              <Frac num="6 · 5" den="2" />
              <span>＝ <strong className="text-emerald-700 text-base">15 games</strong>.</span>
            </div>
            <div>• Or step by step: 5 ＋ 4 ＋ 3 ＋ 2 ＋ 1 ＝ <strong className="text-emerald-700">15 games</strong>.</div>
          </div>
          <p className="pt-1">Thus, <strong>15 chess games</strong> will be played in total.</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Κάθε ένας από τους 6 παίκτες παίζει 5 παρτίδες, δια του 2 για αποφυγή διπλομέτρησης:</span>
              <Frac num="6 · 5" den="2" />
              <span>＝ <strong className="text-emerald-700 text-base">15 παρτίδες</strong>.</span>
            </div>
            <div>• Ή αθροιστικά: 5 ＋ 4 ＋ 3 ＋ 2 ＋ 1 ＝ <strong className="text-emerald-700">15 παρτίδες</strong>.</div>
          </div>
          <p className="pt-1">Επομένως, θα διεξαχθούν συνολικά <strong>15 παρτίδες σκακιού</strong>.</p>
        </div>
      )
    },
    {
      id: 25,
      group: groupB,
      prompt: isEn
        ? 'A florist has 48 red roses and 72 white roses. They want to make identical bouquets using all the flowers, so that each bouquet has the same number of red roses and the same number of white roses. What is the maximum number of such bouquets they can make?'
        : 'Ένας ανθοπώλης έχει 48 κόκκινα τριαντάφυλλα και 72 λευκά τριαντάφυλλα. Θέλει να φτιάξει όμοιες ανθοδέσμες, χρησιμοποιώντας όλα τα λουλούδια, έτσι ώστε κάθε ανθοδέσμη να έχει τον ίδιο αριθμό κόκκινων και τον ίδιο αριθμό λευκών τριαντάφυλλων. Ποιος είναι ο μέγιστος αριθμός από τέτοιες ανθοδέσμες που μπορεί να φτιάξει;',
      options: ['12', '16', '24', '36', '48'],
      correct: '24',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Prime factorization: 48 ＝ <Pow base="2" exp="4" /> · 3 &nbsp;and&nbsp; 72 ＝ <Pow base="2" exp="3" /> · <Pow base="3" exp="2" />.</div>
            <div>• GCD(48, 72) ＝ <Pow base="2" exp="3" /> · 3 ＝ 8 · 3 ＝ <strong className="text-emerald-700 text-base">24 bouquets</strong>.</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Each bouquet has:</span>
              <Frac num="48" den="24" />
              <span>＝ 2 red roses and</span>
              <Frac num="72" den="24" />
              <span>＝ 3 white roses.</span>
            </div>
          </div>
          <p className="pt-1">Therefore, the maximum number of bouquets is <strong>24</strong>.</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Ανάλυση σε πρώτους: 48 ＝ <Pow base="2" exp="4" /> · 3 &nbsp;και&nbsp; 72 ＝ <Pow base="2" exp="3" /> · <Pow base="3" exp="2" />.</div>
            <div>• Μ.Κ.Δ.(48, 72) ＝ <Pow base="2" exp="3" /> · 3 ＝ 8 · 3 ＝ <strong className="text-emerald-700 text-base">24 ανθοδέσμες</strong>.</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Κάθε ανθοδέσμη έχει:</span>
              <Frac num="48" den="24" />
              <span>＝ 2 κόκκινα και</span>
              <Frac num="72" den="24" />
              <span>＝ 3 λευκά τριαντάφυλλα.</span>
            </div>
          </div>
          <p className="pt-1">Επομένως, ο μέγιστος αριθμός ανθοδεσμών είναι <strong>24</strong>.</p>
        </div>
      )
    }
  ];
}

const TOTAL_TIME_SECONDS = 60 * 60; // 60 λεπτά

export default function ProtoTestProsomoiosisPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const isEn = locale === 'en';
  const t = I18N[locale];
  const questions = getQuestions(locale);

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME_SECONDS);
  const [timerEnabled, setTimerEnabled] = useState(true);

  const timerRef = useRef(null);

  useEffect(() => {
    if (router.isReady) {
      const { timer } = router.query;
      if (timer === '0') {
        setTimerEnabled(false);
      } else {
        setTimerEnabled(true);
      }
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

  const handleSelect = (qId, optionVal) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: optionVal }));
  };

  const calculateScore = (currentAnswers) => {
    let s = 0;
    questions.forEach(q => {
      if (currentAnswers[q.id] === q.correct) {
        s += 2; // 2 μόρια ανά σωστή απάντηση (σύνολο 50)
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
  const baseUrl = isEn ? 'https://learnmaths.gr/en' : 'https://learnmaths.gr';

  const schemaProtoTest = [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": t.schemaHome, "item": `${baseUrl}/` },
        { "@type": "ListItem", "position": 2, "name": t.schemaHub, "item": `${baseUrl}/protipa/protipa` },
        { "@type": "ListItem", "position": 3, "name": t.schemaSimHub, "item": `${baseUrl}/protipa/test-prosomoiosis` },
        { "@type": "ListItem", "position": 4, "name": t.schemaCurrent, "item": `${baseUrl}/protipa/01-proto-test` }
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
        const cleanPrompt = extractPlainText(q.prompt, isEn).replace(/\s+/g, ' ').trim();
        const cleanExplain = extractPlainText(q.explain, isEn).replace(/\s+/g, ' ').trim();
        const optStrings = q.options.map((o) => extractPlainText(o, isEn));
        const wrongOpts = optStrings.filter((o) => o !== q.correct);

        return {
          "@type": "Question",
          "eduQuestionType": "Multiple choice",
          "name": t.schemaQuestionName(q.id),
          "text": cleanPrompt,
          "typicalAgeRange": "11-12",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": q.correct,
            "answerExplanation": {
              "@type": "Comment",
              "text": cleanExplain
            }
          },
          "suggestedAnswer": wrongOpts.map((w, idx) => ({
            "@type": "Answer",
            "position": idx + 1,
            "text": w
          }))
        };
      })
    }
  ];

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDesc}
      schemaData={schemaProtoTest}
      backUrl="/protipa/test-prosomoiosis"
      backText={t.backText}
      hideFooter={true}
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 4k:px-24 py-4 sm:py-6 pb-28 sm:pb-36 overflow-x-hidden text-slate-800 box-border space-y-6">

        {/* HERO BANNER & TIMER HEADER */}
        <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 rounded-3xl p-5 sm:p-7 text-white shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1.5">
              <span className="inline-block bg-white/20 px-3 py-0.5 rounded-full text-[11px] font-black tracking-wider text-purple-100">
                {toCleanUppercase(t.heroBadge)}
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
                {t.heroTitle}
              </h1>
            </div>

            {timerEnabled && (
              <div className={`px-4 py-2 rounded-2xl font-mono font-black text-base sm:text-lg flex items-center gap-2 shadow-inner self-stretch sm:self-auto justify-center ${
                timeLeft < 300 ? 'bg-rose-500 text-white animate-pulse' : 'bg-white text-indigo-950'
              }`}>
                <span>⏱️</span>
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>

          <p className="text-xs sm:text-sm text-purple-100/95 leading-relaxed max-w-3xl">
            {t.heroSubtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-purple-100 border-t border-white/20 pt-3">
            <span>📝 {t.answeredLabel} <strong>{answeredCount} {t.of25}</strong></span>
            <span>🎯 {t.scoringLabel} <strong>{t.scoringValue}</strong></span>
            <span>{timerEnabled ? t.timerOn : t.timerOff}</span>
          </div>
        </div>

        {/* FEEDBACK BANNER ΜΕΤΑ ΤΗΝ ΥΠΟΒΟΛΗ */}
        {submitted && (
          <div className="bg-white border-2 border-indigo-300 rounded-3xl p-6 shadow-md text-center space-y-3">
            <span className="text-4xl block">🏆</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {t.resultTitle}
            </h2>
            <div className="inline-block bg-indigo-50 border border-indigo-200 px-6 py-2 rounded-2xl">
              <span className="text-xs font-bold text-indigo-800 uppercase block">{t.finalScoreLabel}</span>
              <span className="text-3xl sm:text-4xl font-mono font-black text-indigo-600">
                {score} / 50
              </span>
              <span className="text-xs font-bold text-slate-500 block mt-1">
                {t.correctOutOf(score / 2)}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
              {t.resultSubtitle}
            </p>
          </div>
        )}

        {/* LIST OF 25 QUESTIONS */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((q) => {
            const userChoice = answers[q.id];
            const isCorrect = userChoice === q.correct;

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
                    <span className="bg-slate-100 text-slate-800 font-mono font-black text-xs px-3 py-1 rounded-xl">
                      {t.questionPrefix} {q.id}
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
                  {q.prompt}
                </div>

                {/* ΕΠΙΛΟΓΕΣ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {q.options.map((opt, optIdx) => {
                    const optVal = extractPlainText(opt, isEn);
                    const isSelected = userChoice === optVal;
                    let btnStyle = 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50';

                    if (submitted) {
                      if (optVal === q.correct) {
                        btnStyle = 'bg-emerald-600 text-white border-emerald-600 shadow-sm font-black';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'bg-rose-600 text-white border-rose-600 font-black';
                      } else {
                        btnStyle = 'bg-slate-100 text-slate-400 border-slate-200 opacity-60';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-indigo-600 text-white border-indigo-600 shadow-sm font-black';
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={submitted}
                        onClick={() => handleSelect(q.id, optVal)}
                        className={`p-3 rounded-2xl border text-left text-xs sm:text-sm transition flex items-center gap-3 min-w-0 ${btnStyle}`}
                      >
                        <span className={`w-6 h-6 rounded-xl flex items-center justify-center font-mono font-black text-xs shrink-0 border ${
                          isSelected || (submitted && optVal === q.correct)
                            ? 'bg-white/20 border-white/40 text-white'
                            : 'bg-slate-100 border-slate-200 text-slate-700'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <div className="font-mono font-bold leading-normal flex items-center flex-wrap break-words [overflow-wrap:anywhere] max-w-full">
                          {opt}
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
                      <span className="text-xs font-bold text-indigo-600 group-open:rotate-180 transition-transform">▼</span>
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
                className="w-full sm:w-auto bg-[#10b981] hover:bg-[#059669] text-white text-base sm:text-lg font-black px-10 py-4 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer"
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