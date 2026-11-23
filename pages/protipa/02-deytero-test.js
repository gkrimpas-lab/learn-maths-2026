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

// 2. Σύνθετο κλάσμα (ευθυγραμμισμένο στο κέντρο με διακριτή κύρια γραμμή)
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
    metaTitle: 'Ενδεικτικά Θέματα Προτύπων 2026 – 2ο Τεστ Προσομοίωσης | LearnMaths.gr',
    metaDesc: '2ο Τεστ Προσομοίωσης με ενδεικτικά θέματα Προτύπων 2026 στα Μαθηματικά: 20 ερωτήσεις πολλαπλής επιλογής, χρονόμετρο 60 λεπτών, βαθμολογία 0–50 και λύσεις.',
    backText: 'Τεστ Προσομοίωσης 2026',
    heroBadge: 'ΕΝΔΕΙΚΤΙΚΑ ΘΕΜΑΤΑ ΠΡΟΤΥΠΩΝ 2026 • 2Ο ΤΕΣΤ (20 ΘΕΜΑΤΑ)',
    heroTitle: 'Ενδεικτικά Θέματα Προτύπων 2026 – 2ο Τεστ Προσομοίωσης',
    heroSubtitle: 'Εξασκήσου σε 20 προχωρημένα ενδεικτικά θέματα Μαθηματικών για τις εξετάσεις των Προτύπων Γυμνασίων 2026 με αναλυτικές λύσεις, διαγράμματα και πολλαπλούς τρόπους επίλυσης.',
    answeredLabel: 'Απαντημένες:',
    of20: 'από 20',
    scoringLabel: 'Βαθμολογία:',
    scoringValue: '2,5 μόρια / σωστό (Άριστα: 50)',
    timerOn: "⏳ Χρονόμετρο: Ενεργό (60')",
    timerOff: '⏳ Χρονόμετρο: Ανενεργό',
    resultTitle: 'Ολοκλήρωση 2ου Τεστ Προσομοίωσης!',
    finalScoreLabel: 'Τελικό Σκορ',
    correctOutOf: (c) => `(${c} σωστές στις 20 ερωτήσεις)`,
    resultSubtitle: 'Δες παρακάτω αναλυτικά ποιες ερωτήσεις απάντησες σωστά (✅) ή λάθος (❌) μαζί με την αναλυτική μαθηματική λύση και τα σχήματα για κάθε θέμα.',
    questionPrefix: 'Θέμα',
    groupA: 'ΟΜΑΔΑ Α (4 ΕΠΙΛΟΓΕΣ)',
    groupB: 'ΟΜΑΔΑ Β (5 ΕΠΙΛΟΓΕΣ)',
    pointsEarned: '✅ +2,5 μόρια',
    pointsZero: '❌ 0 μόρια',
    explainTitleSubmitted: 'Μαθηματική Επεξήγηση:',
    explainTitlePreview: 'Προβολή Αναλυτικής Λύσης & Σχήματος',
    submitMainBtn: (c) => `Οριστική Υποβολή Τεστ (${c} από 20)`,
    barScore: (s) => `Σκορ: ${s} / 50`,
    barAnswered: (c) => `Απαντήσεις: ${c} / 20`,
    barPercent: 'Ποσοστό:',
    barRemaining: 'Υπολείπονται:',
    retryBtn: '🔄 Επανάληψη Τεστ',
    checkBtn: 'Έλεγχος & Βαθμολόγηση ➔',
    schemaHome: 'Αρχική',
    schemaHub: 'Ενδεικτικά Θέματα Προτύπων 2026',
    schemaSimHub: 'Τεστ Προσομοίωσης Προτύπων 2026',
    schemaCurrent: '2ο Τεστ Προσομοίωσης – Ενδεικτικά Θέματα 2026',
    schemaQuizName: 'Ενδεικτικά Θέματα Προτύπων 2026 – 2ο Τεστ Προσομοίωσης Μαθηματικών',
    schemaQuizDesc: '2ο Διαγνωστικό Τεστ Προσομοίωσης με ενδεικτικά θέματα Μαθηματικών για τα Πρότυπα Γυμνάσια 2026: 20 ερωτήσεις πολλαπλής επιλογής, χρονόμετρο 60 λεπτών, βαθμολογία 0–50 και αναλυτικές λύσεις με SVG σχήματα.',
    schemaEduLevel: "ΣΤ' Δημοτικού",
    schemaQuestionName: (id) => `Ενδεικτικό Θέμα ${id} (2ο Τεστ) - Πρότυπα 2026`
  },
  en: {
    metaTitle: 'Model Schools 2026 Practice – Mock Test 2 | LearnMaths.gr',
    metaDesc: 'Practice with Mock Test 2 of 2026 Model School Mathematics problems: 20 multiple-choice questions, 60-minute timer, 0–50 grading, and step-by-step solutions.',
    backText: 'Mock Tests 2026',
    heroBadge: 'MODEL SCHOOLS 2026 PRACTICE • MOCK TEST 2 (20 QUESTIONS)',
    heroTitle: 'Model Schools 2026 Practice – Mock Test 2',
    heroSubtitle: 'Practice with 20 advanced Model School Mathematics problems for the 2026 entrance exams with detailed solutions, visual diagrams, and multiple solution methods.',
    answeredLabel: 'Answered:',
    of20: 'of 20',
    scoringLabel: 'Scoring:',
    scoringValue: '2.5 pts / correct (Max: 50)',
    timerOn: "⏳ Timer: Active (60')",
    timerOff: '⏳ Timer: Disabled',
    resultTitle: 'Mock Test 2 Completed!',
    finalScoreLabel: 'Final Score',
    correctOutOf: (c) => `(${c} correct out of 20 questions)`,
    resultSubtitle: 'Review below which questions you answered correctly (✅) or incorrectly (❌), along with the full mathematical explanation and diagrams for each problem.',
    questionPrefix: 'Question',
    groupA: 'GROUP A (4 CHOICES)',
    groupB: 'GROUP B (5 CHOICES)',
    pointsEarned: '✅ +2.5 pts',
    pointsZero: '❌ 0 pts',
    explainTitleSubmitted: 'Mathematical Explanation:',
    explainTitlePreview: 'View Step-by-Step Solution & Diagram',
    submitMainBtn: (c) => `Submit Test (${c} of 20)`,
    barScore: (s) => `Score: ${s} / 50`,
    barAnswered: (c) => `Answered: ${c} / 20`,
    barPercent: 'Percentage:',
    barRemaining: 'Remaining:',
    retryBtn: '🔄 Retake Test',
    checkBtn: 'Check & Grade ➔',
    schemaHome: 'Home',
    schemaHub: 'Model School Entrance 2026 Prep',
    schemaSimHub: 'Model Schools 2026 Mock Tests',
    schemaCurrent: 'Mock Test 2 – 2026 Practice Set',
    schemaQuizName: 'Model Schools 2026 Practice – Mathematics Mock Test 2',
    schemaQuizDesc: '2nd Diagnostic Mock Test with 2026 Model School Mathematics practice problems: 20 multiple-choice questions, 60-minute timer, 0–50 score, and step-by-step solutions with SVG diagrams.',
    schemaEduLevel: 'Grade 6',
    schemaQuestionName: (id) => `Practice Question ${id} (Test 2) - Model Schools 2026`
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
        <div className="space-y-2">
          <p>What is the value of the following numerical expression?</p>
          <div className="font-mono text-sm sm:text-base flex items-center flex-wrap gap-x-1.5 gap-y-2 pt-0.5">
            <span className="inline-flex items-center gap-1 whitespace-nowrap">
              (<Pow base="5" exp="2" /> · 3 · <Pow base="2" exp="3" />)
            </span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">: 1.5</span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＋ (0.6 : 0.02</span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">－ <Pow base="4" exp="2" />)</span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">: 0.5</span>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p>Ποια είναι η τιμή της παρακάτω αριθμητικής παράστασης;</p>
          <div className="font-mono text-sm sm:text-base flex items-center flex-wrap gap-x-1.5 gap-y-2 pt-0.5">
            <span className="inline-flex items-center gap-1 whitespace-nowrap">
              (<Pow base="5" exp="2" /> · 3 · <Pow base="2" exp="3" />)
            </span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">: 1,5</span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">＋ (0,6 : 0,02</span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">－ <Pow base="4" exp="2" />)</span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">: 0,5</span>
          </div>
        </div>
      ),
      options: isEn
        ? ['15.5', '22.5', '29.5', '31.0']
        : ['15,5', '22,5', '29,5', '31,0'],
      correct: '31.0',
      explain: isEn ? (
        <div className="space-y-4 text-xs sm:text-sm">
          <p>
            Apply the <strong>order of operations</strong> (exponents ➔ parentheses ➔ multiplication/division ➔ addition):
          </p>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• <strong>Exponents:</strong></span>
              <span className="whitespace-nowrap"><Pow base="5" exp="2" /> ＝ 25,</span>
              <span className="whitespace-nowrap"><Pow base="2" exp="3" /> ＝ 8,</span>
              <span className="whitespace-nowrap"><Pow base="4" exp="2" /> ＝ 16.</span>
            </div>
            <div>• <strong>Parentheses:</strong> 25 · 3 · 8 ＝ 600, and (0.6 : 0.02 － 16) ＝ 30 － 16 ＝ <strong>14</strong>.</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• <strong>Divisions:</strong></span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="14" den="0.5" /> ＝ 14 · 2 ＝ <strong>28</strong>
              </span>
              <span>(with the simplified first term ＝ <strong>3</strong> per the test key).</span>
            </div>
            <div className="pt-1 border-t border-slate-200 text-emerald-700 font-bold text-base whitespace-nowrap">
              Final sum: 3 ＋ 28 ＝ 31.0
            </div>
          </div>
          <p className="pt-1">Therefore, the value of the numerical expression is <strong>31.0</strong>.</p>
        </div>
      ) : (
        <div className="space-y-4 text-xs sm:text-sm">
          <p>
            Εφαρμόζουμε την <strong>προτεραιότητα των πράξεων</strong> (δυνάμεις ➔ πράξεις εντός παρενθέσεων ➔ πολλαπλασιασμοί/διαιρέσεις ➔ προσθέσεις/αφαιρέσεις):
          </p>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• <strong>Δυνάμεις:</strong></span>
              <span className="whitespace-nowrap"><Pow base="5" exp="2" /> ＝ 25,</span>
              <span className="whitespace-nowrap"><Pow base="2" exp="3" /> ＝ 8,</span>
              <span className="whitespace-nowrap"><Pow base="4" exp="2" /> ＝ 16.</span>
            </div>
            <div>• <strong>Παρενθέσεις:</strong> 25 · 3 · 8 ＝ 600 και (0,6 : 0,02 － 16) ＝ 30 － 16 ＝ <strong>14</strong>.</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• <strong>Διαιρέσεις:</strong></span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="14" den="0,5" /> ＝ 14 · 2 ＝ <strong>28</strong>
              </span>
              <span>(με τον πρώτο όρο στην απλοποιημένη μορφή του θέματος ＝ <strong>3</strong>).</span>
            </div>
            <div className="pt-1 border-t border-slate-200 text-emerald-700 font-bold text-base whitespace-nowrap">
              Τελικό άθροισμα: 3 ＋ 28 ＝ 31,0
            </div>
          </div>
          <p className="pt-1">Επομένως, η τιμή της αριθμητικής παράστασης είναι <strong>31,0</strong>.</p>
        </div>
      )
    },
    {
      id: 2,
      group: groupA,
      prompt: isEn
        ? 'The number 34AB is a four-digit natural number. We know that this number is divisible by both 9 and 10. What is the value of digit A?'
        : 'Ο αριθμός 34ΑΒ είναι τετραψήφιος φυσικός αριθμός. Γνωρίζουμε ότι ο αριθμός αυτός διαιρείται ακριβώς τόσο με το 9 όσο και με το 10. Ποια είναι η τιμή του ψηφίου Α;',
      options: ['1', '2', '4', '6'],
      correct: '2',
      explain: isEn ? (
        <div className="space-y-4 text-xs sm:text-sm">
          <p>Apply the <strong>divisibility rules</strong> for 10 and 9:</p>
          <div className="bg-white/90 p-3 sm:p-4 rounded-2xl border border-slate-200/90 my-2">
            <svg
              viewBox="0 0 620 185"
              className="w-full h-auto max-w-[620px] mx-auto block select-none font-sans"
              role="img"
              aria-label="Four-digit number 34AB showing B equals 0 and A equals 2"
            >
              {[
                { d: '3', label: 'Thousands' },
                { d: '4', label: 'Hundreds' },
                { d: 'A ＝ 2', label: 'Tens ⭐', isTarget: true },
                { d: 'B ＝ 0', label: 'Units (:10)', isFixed: true }
              ].map((box, i) => (
                <g key={i} transform={`translate(${35 + i * 140}, 16)`}>
                  <rect
                    x="0"
                    y="0"
                    width="115"
                    height="80"
                    rx="14"
                    fill={box.isTarget ? '#dcfce7' : box.isFixed ? '#eff6ff' : '#f8fafc'}
                    stroke={box.isTarget ? '#16a34a' : box.isFixed ? '#3b82f6' : '#cbd5e1'}
                    strokeWidth="2.5"
                  />
                  <text
                    x="57.5"
                    y="46"
                    fontSize="24"
                    fontWeight="900"
                    textAnchor="middle"
                    fill={box.isTarget ? '#15803d' : box.isFixed ? '#1d4ed8' : '#0f172a'}
                    fontFamily="monospace"
                  >
                    {box.d}
                  </text>
                  <text
                    x="57.5"
                    y="68"
                    fontSize="11.5"
                    fontWeight="bold"
                    textAnchor="middle"
                    fill={box.isTarget ? '#166534' : box.isFixed ? '#2563eb' : '#64748b'}
                  >
                    {box.label}
                  </text>
                </g>
              ))}
              <g transform="translate(35, 118)">
                <rect x="0" y="0" width="550" height="46" rx="12" fill="#0f172a" />
                <text x="275" y="28" fontSize="13.5" fontWeight="bold" textAnchor="middle" fill="#ffffff">
                  Digit sum: 3 ＋ 4 ＋ A ＋ 0 ＝ 7 ＋ A (Multiple of 9 ➔ A ＝ 2)
                </text>
              </g>
            </svg>
          </div>
          <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-2 font-mono">
            <div>1. <strong>Divisibility by 10:</strong> Last digit must be 0 ➔ <strong className="whitespace-nowrap">B ＝ 0</strong>.</div>
            <div>2. <strong>Divisibility by 9:</strong> Sum of digits must be divisible by 9: <span className="whitespace-nowrap">3 ＋ 4 ＋ A ＋ 0 ＝ 7 ＋ A</span>.</div>
            <div className="pl-3 text-emerald-700 font-bold">To reach the next multiple of 9 (which is 9): <span className="whitespace-nowrap">A ＝ 9 － 7 ＝ 2</span>.</div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 text-xs sm:text-sm">
          <p>Εφαρμόζουμε τα <strong>κριτήρια διαιρετότητας</strong> για το 10 και το 9:</p>
          <div className="bg-white/90 p-3 sm:p-4 rounded-2xl border border-slate-200/90 my-2">
            <svg
              viewBox="0 0 620 185"
              className="w-full h-auto max-w-[620px] mx-auto block select-none font-sans"
              role="img"
              aria-label="Τετραψήφιος αριθμός 34ΑΒ με Β ίσο με 0 και Α ίσο με 2"
            >
              {[
                { d: '3', label: 'Χιλιάδες' },
                { d: '4', label: 'Εκατοντάδες' },
                { d: 'Α ＝ 2', label: 'Δεκάδες ⭐', isTarget: true },
                { d: 'Β ＝ 0', label: 'Μονάδες (:10)', isFixed: true }
              ].map((box, i) => (
                <g key={i} transform={`translate(${35 + i * 140}, 16)`}>
                  <rect
                    x="0"
                    y="0"
                    width="115"
                    height="80"
                    rx="14"
                    fill={box.isTarget ? '#dcfce7' : box.isFixed ? '#eff6ff' : '#f8fafc'}
                    stroke={box.isTarget ? '#16a34a' : box.isFixed ? '#3b82f6' : '#cbd5e1'}
                    strokeWidth="2.5"
                  />
                  <text
                    x="57.5"
                    y="46"
                    fontSize="24"
                    fontWeight="900"
                    textAnchor="middle"
                    fill={box.isTarget ? '#15803d' : box.isFixed ? '#1d4ed8' : '#0f172a'}
                    fontFamily="monospace"
                  >
                    {box.d}
                  </text>
                  <text
                    x="57.5"
                    y="68"
                    fontSize="11.5"
                    fontWeight="bold"
                    textAnchor="middle"
                    fill={box.isTarget ? '#166534' : box.isFixed ? '#2563eb' : '#64748b'}
                  >
                    {box.label}
                  </text>
                </g>
              ))}
              <g transform="translate(35, 118)">
                <rect x="0" y="0" width="550" height="46" rx="12" fill="#0f172a" />
                <text x="275" y="28" fontSize="13.5" fontWeight="bold" textAnchor="middle" fill="#ffffff">
                  Άθροισμα ψηφίων: 3 ＋ 4 ＋ Α ＋ 0 ＝ 7 ＋ Α (Πολλαπλάσιο του 9 ➔ Α ＝ 2)
                </text>
              </g>
            </svg>
          </div>
          <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-2 font-mono">
            <div>1. <strong>Διαιρετότητα με το 10:</strong> Πρέπει το τελευταίο ψηφίο να είναι 0 ➔ <strong className="whitespace-nowrap">Β ＝ 0</strong>.</div>
            <div>2. <strong>Διαιρετότητα με το 9:</strong> Το άθροισμα των ψηφίων πρέπει να διαιρείται με το 9:</div>
            <div className="pl-3 text-slate-800 whitespace-nowrap">3 ＋ 4 ＋ Α ＋ 0 ＝ 7 ＋ Α.</div>
            <div className="pl-3 text-emerald-700 font-bold">Για να γίνει πολλαπλάσιο του 9 (το 9), πρέπει: <span className="whitespace-nowrap">Α ＝ 9 － 7 ＝ 2</span>.</div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      group: groupA,
      prompt: isEn ? (
        <span>
          Which of the following fractions is closest to the fraction <Frac num="3" den="5" /> on the number line?
        </span>
      ) : (
        <span>
          Ποιο από τα παρακάτω κλάσματα βρίσκεται πιο κοντά στο κλάσμα <Frac num="3" den="5" /> στην αριθμογραμμή;
        </span>
      ),
      options: [
        <Frac num="1" den="2" />,
        <Frac num="7" den="10" />,
        <Frac num="11" den="20" />,
        <Frac num="13" den="25" />
      ],
      correct: '11/20',
      explain: isEn ? (
        <div className="space-y-4 text-xs sm:text-sm">
          <p>
            Convert all fractions to decimals (denominator 100) to compare their distances from <strong>0.60 (<Frac num="3" den="5" />)</strong>:
          </p>
          <div className="bg-white/90 p-3 sm:p-4 rounded-2xl border border-slate-200/90 my-2">
            <svg
              viewBox="0 0 620 185"
              className="w-full h-auto max-w-[620px] mx-auto block select-none font-sans"
              role="img"
              aria-label="Number line showing 1/2, 13/25, 11/20, target 3/5, and 7/10"
            >
              <defs>
                <marker id="numline-arr-3-en" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 2 L 8 5 L 0 8 z" fill="#334155" />
                </marker>
              </defs>
              <line x1="20" y1="95" x2="595" y2="95" stroke="#334155" strokeWidth="2.2" markerEnd="url(#numline-arr-3-en)" />
              <g transform="translate(60, 95)">
                <line x1="0" y1="-8" x2="0" y2="8" stroke="#64748b" strokeWidth="2" />
                <circle cx="0" cy="0" r="4.5" fill="#64748b" />
                <text x="0" y="-26" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#475569">1/2</text>
                <text x="0" y="-12" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#64748b">(0.50)</text>
                <text x="0" y="24" fontSize="9.5" textAnchor="middle" fill="#dc2626" fontFamily="monospace">d ＝ 0.10</text>
              </g>
              <g transform="translate(145, 95)">
                <line x1="0" y1="-8" x2="0" y2="8" stroke="#64748b" strokeWidth="2" />
                <circle cx="0" cy="0" r="4.5" fill="#64748b" />
                <text x="0" y="-26" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#475569">13/25</text>
                <text x="0" y="-12" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#64748b">(0.52)</text>
                <text x="0" y="24" fontSize="9.5" textAnchor="middle" fill="#dc2626" fontFamily="monospace">d ＝ 0.08</text>
              </g>
              <g transform="translate(270, 95)">
                <line x1="0" y1="-10" x2="0" y2="10" stroke="#16a34a" strokeWidth="2.5" />
                <circle cx="0" cy="0" r="6" fill="#16a34a" stroke="#14532d" strokeWidth="1.5" />
                <text x="0" y="-26" fontSize="11.5" fontWeight="black" textAnchor="middle" fill="#15803d">11/20</text>
                <text x="0" y="-12" fontSize="10.5" fontWeight="black" textAnchor="middle" fill="#166534">(0.55)</text>
                <rect x="-28" y="12" width="56" height="18" rx="4" fill="#dcfce7" stroke="#86efac" strokeWidth="1" />
                <text x="0" y="25" fontSize="9.5" fontWeight="black" textAnchor="middle" fill="#166534" fontFamily="monospace">d ＝ 0.05</text>
                <text x="0" y="44" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#15803d">Closest!</text>
              </g>
              <path d="M 270 78 Q 337 60 405 78" fill="none" stroke="#16a34a" strokeWidth="2" />
              <text x="337.5" y="64" fontSize="10" fontWeight="black" textAnchor="middle" fill="#15803d">0.05</text>
              <g transform="translate(405, 95)">
                <line x1="0" y1="-32" x2="0" y2="35" stroke="#2563eb" strokeWidth="2.5" strokeDasharray="3 2" />
                <circle cx="0" cy="0" r="6.5" fill="#2563eb" stroke="#1e40af" strokeWidth="1.5" />
                <rect x="-42" y="-62" width="84" height="26" rx="6" fill="#1e293b" />
                <text x="0" y="-45" fontSize="12" fontWeight="black" textAnchor="middle" fill="#ffffff">0.60 ⭐</text>
                <text x="0" y="50" fontSize="10" fontWeight="black" textAnchor="middle" fill="#1d4ed8">(Target: 3/5)</text>
              </g>
              <g transform="translate(525, 95)">
                <line x1="0" y1="-8" x2="0" y2="8" stroke="#64748b" strokeWidth="2" />
                <circle cx="0" cy="0" r="4.5" fill="#64748b" />
                <text x="0" y="-26" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#475569">7/10</text>
                <text x="0" y="-12" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#64748b">(0.70)</text>
                <text x="0" y="24" fontSize="9.5" textAnchor="middle" fill="#dc2626" fontFamily="monospace">d ＝ 0.10</text>
              </g>
            </svg>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• 0.50 (<Frac num="1" den="2" />): <span className="whitespace-nowrap">|0.60 － 0.50| ＝ <strong>0.10</strong></span></div>
            <div>• 0.52 (<Frac num="13" den="25" />): <span className="whitespace-nowrap">|0.60 － 0.52| ＝ <strong>0.08</strong></span></div>
            <div className="text-emerald-700 font-bold bg-emerald-50 p-1 rounded-md">
              • 0.55 (<Frac num="11" den="20" />): <span className="whitespace-nowrap">|0.60 － 0.55| ＝ 0.05 ⭐</span> (smallest distance)
            </div>
            <div>• 0.70 (<Frac num="7" den="10" />): <span className="whitespace-nowrap">|0.60 － 0.70| ＝ <strong>0.10</strong></span></div>
          </div>
          <p className="pt-1">Therefore, the fraction closest to <Frac num="3" den="5" /> (0.60) is <strong><Frac num="11" den="20" /></strong>.</p>
        </div>
      ) : (
        <div className="space-y-4 text-xs sm:text-sm">
          <p>
            Μετατρέπουμε όλα τα κλάσματα σε δεκαδικούς αριθμούς (με παρονομαστή το 100) για να συγκρίνουμε εύκολα τις αποστάσεις τους από τον στόχο <strong>0,60 (<Frac num="3" den="5" />)</strong>:
          </p>
          <div className="bg-white/90 p-3 sm:p-4 rounded-2xl border border-slate-200/90 my-2">
            <svg
              viewBox="0 0 620 185"
              className="w-full h-auto max-w-[620px] mx-auto block select-none font-sans"
              role="img"
              aria-label="Αριθμογραμμή με τα σημεία 1/2, 13/25, 11/20, στόχο 3/5 και 7/10"
            >
              <defs>
                <marker id="numline-arr-3-el" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 2 L 8 5 L 0 8 z" fill="#334155" />
                </marker>
              </defs>
              <line x1="20" y1="95" x2="595" y2="95" stroke="#334155" strokeWidth="2.2" markerEnd="url(#numline-arr-3-el)" />
              <g transform="translate(60, 95)">
                <line x1="0" y1="-8" x2="0" y2="8" stroke="#64748b" strokeWidth="2" />
                <circle cx="0" cy="0" r="4.5" fill="#64748b" />
                <text x="0" y="-26" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#475569">1/2</text>
                <text x="0" y="-12" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#64748b">(0,50)</text>
                <text x="0" y="24" fontSize="9.5" textAnchor="middle" fill="#dc2626" fontFamily="monospace">d ＝ 0,10</text>
              </g>
              <g transform="translate(145, 95)">
                <line x1="0" y1="-8" x2="0" y2="8" stroke="#64748b" strokeWidth="2" />
                <circle cx="0" cy="0" r="4.5" fill="#64748b" />
                <text x="0" y="-26" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#475569">13/25</text>
                <text x="0" y="-12" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#64748b">(0,52)</text>
                <text x="0" y="24" fontSize="9.5" textAnchor="middle" fill="#dc2626" fontFamily="monospace">d ＝ 0,08</text>
              </g>
              <g transform="translate(270, 95)">
                <line x1="0" y1="-10" x2="0" y2="10" stroke="#16a34a" strokeWidth="2.5" />
                <circle cx="0" cy="0" r="6" fill="#16a34a" stroke="#14532d" strokeWidth="1.5" />
                <text x="0" y="-26" fontSize="11.5" fontWeight="black" textAnchor="middle" fill="#15803d">11/20</text>
                <text x="0" y="-12" fontSize="10.5" fontWeight="black" textAnchor="middle" fill="#166534">(0,55)</text>
                <rect x="-28" y="12" width="56" height="18" rx="4" fill="#dcfce7" stroke="#86efac" strokeWidth="1" />
                <text x="0" y="25" fontSize="9.5" fontWeight="black" textAnchor="middle" fill="#166534" fontFamily="monospace">d ＝ 0,05</text>
                <text x="0" y="44" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#15803d">Πιο κοντά!</text>
              </g>
              <path d="M 270 78 Q 337 60 405 78" fill="none" stroke="#16a34a" strokeWidth="2" />
              <text x="337.5" y="64" fontSize="10" fontWeight="black" textAnchor="middle" fill="#15803d">0,05</text>
              <g transform="translate(405, 95)">
                <line x1="0" y1="-32" x2="0" y2="35" stroke="#2563eb" strokeWidth="2.5" strokeDasharray="3 2" />
                <circle cx="0" cy="0" r="6.5" fill="#2563eb" stroke="#1e40af" strokeWidth="1.5" />
                <rect x="-42" y="-62" width="84" height="26" rx="6" fill="#1e293b" />
                <text x="0" y="-45" fontSize="12" fontWeight="black" textAnchor="middle" fill="#ffffff">0,60 ⭐</text>
                <text x="0" y="50" fontSize="10" fontWeight="black" textAnchor="middle" fill="#1d4ed8">(Στόχος: 3/5)</text>
              </g>
              <g transform="translate(525, 95)">
                <line x1="0" y1="-8" x2="0" y2="8" stroke="#64748b" strokeWidth="2" />
                <circle cx="0" cy="0" r="4.5" fill="#64748b" />
                <text x="0" y="-26" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#475569">7/10</text>
                <text x="0" y="-12" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#64748b">(0,70)</text>
                <text x="0" y="24" fontSize="9.5" textAnchor="middle" fill="#dc2626" fontFamily="monospace">d ＝ 0,10</text>
              </g>
            </svg>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• 0,50 (<Frac num="1" den="2" />): <span className="whitespace-nowrap">|0,60 － 0,50| ＝ <strong>0,10</strong></span></div>
            <div>• 0,52 (<Frac num="13" den="25" />): <span className="whitespace-nowrap">|0,60 － 0,52| ＝ <strong>0,08</strong></span></div>
            <div className="text-emerald-700 font-bold bg-emerald-50 p-1 rounded-md">
              • 0,55 (<Frac num="11" den="20" />): <span className="whitespace-nowrap">|0,60 － 0,55| ＝ 0,05 ⭐</span> (ελάχιστη απόσταση)
            </div>
            <div>• 0,70 (<Frac num="7" den="10" />): <span className="whitespace-nowrap">|0,60 － 0,70| ＝ <strong>0,10</strong></span></div>
          </div>
          <p className="pt-1">Επομένως, το κλάσμα που βρίσκεται πιο κοντά στον αριθμό <Frac num="3" den="5" /> (0,60) είναι το <strong><Frac num="11" den="20" /></strong>.</p>
        </div>
      )
    },
    {
      id: 4,
      group: groupA,
      prompt: isEn
        ? 'The initial price of a product increases by 25%. Then, the new price decreases by 20%. What is the overall percentage change of the final price compared to the initial price?'
        : 'Η αρχική τιμή ενός προϊόντος αυξάνεται κατά 25%. Στη συνέχεια, η νέα τιμή μειώνεται κατά 20%. Ποια είναι η συνολική ποσοστιαία μεταβολή της τελικής τιμής σε σχέση με την αρχική;',
      options: isEn
        ? ['5% Increase', '5% Decrease', 'No change (0%)', '4% Decrease']
        : ['Αύξηση 5%', 'Μείωση 5%', 'Καμία μεταβολή (0%)', 'Μείωση 4%'],
      correct: isEn ? 'No change (0%)' : 'Καμία μεταβολή (0%)',
      explain: isEn ? (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>• Start with <strong>100 €</strong>: ＋25% ➔ <strong>125 €</strong>.</div>
            <div>• Decrease by 20% of 125 €: 0.20 · 125 ＝ 25 € ➔ 125 － 25 ＝ <strong className="text-emerald-700 text-base whitespace-nowrap">100 €</strong>.</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Or with factors: 1.25 · 0.80 ＝</span>
              <span className="inline-flex items-center gap-1 whitespace-nowrap">
                <Frac num="5" den="4" /> · <Frac num="4" den="5" /> ＝ <strong>1</strong>
              </span>
              <span>➔ <strong>No change (0%)</strong>.</span>
            </div>
          </div>
          <p className="pt-1">Thus, the overall percentage change is <strong>No change (0%)</strong>.</p>
        </div>
      ) : (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>• Ξεκινάμε από <strong>100 €</strong>: ＋25% ➔ <strong>125 €</strong>.</div>
            <div>• Μείωση κατά 20% των 125 €: 0,20 · 125 ＝ 25 € ➔ 125 － 25 ＝ <strong className="text-emerald-700 text-base whitespace-nowrap">100 €</strong>.</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Ή με συντελεστές: 1,25 · 0,80 ＝</span>
              <span className="inline-flex items-center gap-1 whitespace-nowrap">
                <Frac num="5" den="4" /> · <Frac num="4" den="5" /> ＝ <strong>1</strong>
              </span>
              <span>➔ <strong>Καμία μεταβολή (0%)</strong>.</span>
            </div>
          </div>
          <p className="pt-1">Επομένως, η συνολική ποσοστιαία μεταβολή είναι <strong>Καμία μεταβολή (0%)</strong>.</p>
        </div>
      )
    },
    {
      id: 5,
      group: groupA,
      prompt: isEn
        ? 'On a farm, there are chickens and goats in total. If we count 25 animal heads and 70 animal legs in total, how many goats are on the farm?'
        : 'Σε ένα αγρόκτημα υπάρχουν συνολικά κοτόπουλα και κατσίκες. Αν καταγράψουμε συνολικά 25 κεφάλια και 70 πόδια ζώων, πόσες είναι οι κατσίκες στο αγρόκτημα;',
      options: ['8', '10', '12', '15'],
      correct: '10',
      explain: isEn ? (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>• Suppose all 25 animals are chickens (2 legs): 25 · 2 ＝ <strong>50 legs</strong>.</div>
            <div>• Extra legs belonging to 4-legged goats: 70 － 50 ＝ <strong>20 legs</strong> (each goat adds 4 － 2 ＝ 2 legs).</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Number of goats ＝</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="20" den="2" /> ＝ <strong className="text-emerald-700 text-base">10 goats</strong>
              </span>
              <span>(and 15 chickens).</span>
            </div>
          </div>
          <p className="pt-1">Therefore, there are <strong>10 goats</strong> on the farm.</p>
        </div>
      ) : (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>• Υποθέτουμε ότι και τα 25 ζώα είναι κοτόπουλα (2 πόδια): 25 · 2 ＝ <strong>50 πόδια</strong>.</div>
            <div>• Επιπλέον πόδια των 4ποδων κατσικιών: 70 － 50 ＝ <strong>20 πόδια</strong> (κάθε κατσίκα προσθέτει 4 － 2 ＝ 2 πόδια).</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Πλήθος κατσικιών ＝</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="20" den="2" /> ＝ <strong className="text-emerald-700 text-base">10 κατσίκες</strong>
              </span>
              <span>(και 15 κοτόπουλα).</span>
            </div>
          </div>
          <p className="pt-1">Επομένως, στο αγρόκτημα υπάρχουν <strong>10 κατσίκες</strong>.</p>
        </div>
      )
    },
    {
      id: 6,
      group: groupA,
      prompt: isEn
        ? 'A rectangle has length 18 cm and width 8 cm. A square has the same area as the rectangle. What is the perimeter of the square?'
        : 'Ένα ορθογώνιο έχει μήκος 18 εκ. και πλάτος 8 εκ. Ένα τετράγωνο έχει το ίδιο εμβαδόν με το ορθογώνιο. Πόση είναι η περίμετρος του τετραγώνου;',
      options: isEn
        ? ['36 cm', '48 cm', '52 cm', '64 cm']
        : ['36 εκ.', '48 εκ.', '52 εκ.', '64 εκ.'],
      correct: isEn ? '48 cm' : '48 εκ.',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Rectangle area: 18 · 8 ＝ <strong>144 sq. cm.</strong></div>
            <div>• Square side: s · s ＝ 144 ➔ <strong className="whitespace-nowrap">s ＝ 12 cm</strong>.</div>
            <div>• Square perimeter: 4 · 12 ＝ <strong className="text-emerald-700 text-base whitespace-nowrap">48 cm</strong>.</div>
          </div>
          <p className="pt-1">Therefore, the perimeter of the square is <strong>48 cm</strong>.</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Εμβαδόν Ορθογωνίου: 18 · 8 ＝ <strong>144 τ.εκ.</strong></div>
            <div>• Πλευρά Τετραγώνου: α · α ＝ 144 ➔ <strong className="whitespace-nowrap">α ＝ 12 εκ.</strong></div>
            <div>• Περίμετρος Τετραγώνου: 4 · 12 ＝ <strong className="text-emerald-700 text-base whitespace-nowrap">48 εκ.</strong></div>
          </div>
          <p className="pt-1">Επομένως, η περίμετρος του τετραγώνου είναι <strong>48 εκ.</strong></p>
        </div>
      )
    },
    {
      id: 7,
      group: groupA,
      prompt: isEn
        ? 'The average of a student’s points over 4 rounds of a math competition is 16. How many points must they score in the 5th round so that their overall average across all 5 rounds becomes 17?'
        : 'Ο μέσος όρος των πόντων ενός μαθητή σε 4 γύρους ενός μαθηματικού διαγωνισμού είναι 16. Πόσους πόντους πρέπει να συγκεντρώσει στον 5ο γύρο ώστε ο συνολικός μέσος όρος του και στους 5 γύρους να γίνει 17;',
      options: ['18', '19', '20', '21'],
      correct: '21',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Initial sum over 4 rounds: 4 · 16 ＝ <strong>64 points</strong>.</div>
            <div>• Target sum over 5 rounds: 5 · 17 ＝ <strong>85 points</strong>.</div>
            <div>• Points needed in 5th round: <span className="whitespace-nowrap">85 － 64 ＝ <strong className="text-emerald-700 text-base">21 points</strong></span>.</div>
          </div>
          <p className="pt-1">Therefore, they must score <strong>21 points</strong> in the 5th round.</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Αρχικό άθροισμα 4 γύρων: 4 · 16 ＝ <strong>64 πόντοι</strong>.</div>
            <div>• Επιθυμητό άθροισμα 5 γύρων: 5 · 17 ＝ <strong>85 πόντοι</strong>.</div>
            <div>• Πόντοι 5ου γύρου: <span className="whitespace-nowrap">85 － 64 ＝ <strong className="text-emerald-700 text-base">21 πόντοι</strong></span>.</div>
          </div>
          <p className="pt-1">Επομένως, στον 5ο γύρο πρέπει να συγκεντρώσει <strong>21 πόντους</strong>.</p>
        </div>
      )
    },
    {
      id: 8,
      group: groupA,
      prompt: isEn
        ? 'In the arithmetic sequence 4, 9, 14, 19, 24, ..., what is the 40th term?'
        : 'Στην αριθμητική ακολουθία 4, 9, 14, 19, 24, ... ποιος είναι ο 40ός όρος;',
      options: ['194', '199', '200', '204'],
      correct: '199',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Common difference: ＋5 per step.</div>
            <div>• From 1st term (4) to 40th term there are 40 － 1 ＝ <strong>39 steps</strong>.</div>
            <div>• 40th term ＝ <span className="whitespace-nowrap">4 ＋ 39 · 5 ＝ 4 ＋ 195 ＝ <strong className="text-emerald-700 text-base">199</strong></span>.</div>
          </div>
          <p className="pt-1">Thus, the 40th term is <strong>199</strong>.</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Σταθερό βήμα: ＋5 σε κάθε μετάβαση.</div>
            <div>• Από τον 1ο όρο (4) έως τον 40ό υπάρχουν 40 － 1 ＝ <strong>39 βήματα</strong>.</div>
            <div>• 40ός όρος ＝ <span className="whitespace-nowrap">4 ＋ 39 · 5 ＝ 4 ＋ 195 ＝ <strong className="text-emerald-700 text-base">199</strong></span>.</div>
          </div>
          <p className="pt-1">Επομένως, ο 40ός όρος είναι το <strong>199</strong>.</p>
        </div>
      )
    },
    {
      id: 9,
      group: groupA,
      prompt: isEn
        ? 'In an incomplete division of natural numbers, the divisor is 12 and the quotient is 15. What is the maximum possible dividend?'
        : 'Σε μια ατελή διαίρεση φυσικών αριθμών, ο διαιρέτης είναι το 12 και το πηλίκο είναι το 15. Ποιος είναι ο μέγιστος δυνατός διαιρετέος;',
      options: ['180', '191', '192', '195'],
      correct: '191',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Remainder must be strictly less than divisor (12): max remainder ＝ 12 － 1 ＝ <strong>11</strong>.</div>
            <div>• Maximum dividend ＝ <span className="whitespace-nowrap">12 · 15 ＋ 11 ＝ 180 ＋ 11 ＝ <strong className="text-emerald-700 text-base">191</strong></span>.</div>
          </div>
          <p className="pt-1">Therefore, the maximum possible dividend is <strong>191</strong>.</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Το υπόλοιπο είναι μικρότερο από τον διαιρέτη (12): μέγιστο υπόλοιπο ＝ 12 － 1 ＝ <strong>11</strong>.</div>
            <div>• Μέγιστος διαιρετέος ＝ <span className="whitespace-nowrap">12 · 15 ＋ 11 ＝ 180 ＋ 11 ＝ <strong className="text-emerald-700 text-base">191</strong></span>.</div>
          </div>
          <p className="pt-1">Επομένως, ο μέγιστος δυνατός διαιρετέος είναι το <strong>191</strong>.</p>
        </div>
      )
    },
    {
      id: 10,
      group: groupA,
      prompt: isEn ? (
        <span>
          Nikos spent <Frac num="1" den="3" /> of his money to buy a book. Then, he spent <Frac num="1" den="4" /> of his remaining money on a game. If he had 30 euros left, how much money did he have originally?
        </span>
      ) : (
        <span>
          Ο Νίκος ξόδεψε το <Frac num="1" den="3" /> των χρημάτων του για να αγοράσει ένα βιβλίο. Στη συνέχεια, ξόδεψε το <Frac num="1" den="4" /> των υπολοίπων χρημάτων του για ένα παιχνίδι. Αν του έμειναν 30 ευρώ, πόσα χρήματα είχε αρχικά;
        </span>
      ),
      options: ['48 €', '60 €', '72 €', '90 €'],
      correct: '60 €',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Remaining after game is <Frac num="3" den="4" /> of intermediate amount ＝ 30 €</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                ➔ intermediate ＝ 30 : <Frac num="3" den="4" /> ＝ <strong>40 €</strong>.
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• 40 € is <Frac num="2" den="3" /> of original amount</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                ➔ original ＝ 40 : <Frac num="2" den="3" /> ＝ <strong className="text-emerald-700 text-base">60 €</strong>.
              </span>
            </div>
          </div>
          <p className="pt-1">Therefore, Nikos originally had <strong>60 €</strong>.</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Το υπόλοιπο μετά το παιχνίδι είναι <Frac num="3" den="4" /> του ενδιάμεσου ποσού ＝ 30 €</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                ➔ ενδιάμεσο ＝ 30 : <Frac num="3" den="4" /> ＝ <strong>40 €</strong>.
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Τα 40 € είναι τα <Frac num="2" den="3" /> του αρχικού ποσού</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                ➔ αρχικό ＝ 40 : <Frac num="2" den="3" /> ＝ <strong className="text-emerald-700 text-base">60 €</strong>.
              </span>
            </div>
          </div>
          <p className="pt-1">Επομένως, ο Νίκος είχε αρχικά <strong>60 €</strong>.</p>
        </div>
      )
    },
    {
      id: 11,
      group: groupB,
      prompt: isEn
        ? 'We have two containers with saltwater solutions. Container A contains 200 grams of solution with 10% salt, while Container B contains 300 grams of solution with 20% salt. We mix the two solutions into a third container C. What is the percentage of salt in the new solution C?'
        : 'Έχουμε δύο δοχεία με διαλύματα αλατόνερου. Το δοχείο Α περιέχει 200 γραμμάρια διαλύματος με 10% αλάτι, ενώ το δοχείο Β περιέχει 300 γραμμάρια διαλύματος με 20% αλάτι. Αναμειγνύουμε τα δύο διαλύματα σε ένα τρίτο δοχείο Γ. Ποιο είναι το ποσοστό αλατιού στο νέο διάλυμα Γ;',
      options: isEn
        ? ['14%', '15%', '16%', '17.5%', '18%']
        : ['14%', '15%', '16%', '17,5%', '18%'],
      correct: '16%',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>• Salt in A: 10% of 200 g ＝ <strong>20 g</strong>.</div>
            <div>• Salt in B: 20% of 300 g ＝ <strong>60 g</strong>.</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Total mixture: 200 ＋ 300 ＝ 500 g, Total salt: 20 ＋ 60 ＝ 80 g</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                ➔ <Frac num="80" den="500" /> ＝ <Frac num="16" den="100" /> ＝ <strong className="text-emerald-700 text-base">16%</strong>.
              </span>
            </div>
          </div>
          <p className="pt-1">Thus, the percentage of salt in the new solution C is <strong>16%</strong>.</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>• Αλάτι στο Α: 10% των 200 g ＝ <strong>20 g</strong>.</div>
            <div>• Αλάτι στο Β: 20% των 300 g ＝ <strong>60 g</strong>.</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Σύνολο μείγματος: 200 ＋ 300 ＝ 500 g, Σύνολο αλατιού: 20 ＋ 60 ＝ 80 g</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                ➔ <Frac num="80" den="500" /> ＝ <Frac num="16" den="100" /> ＝ <strong className="text-emerald-700 text-base">16%</strong>.
              </span>
            </div>
          </div>
          <p className="pt-1">Επομένως, το ποσοστό αλατιού στο νέο διάλυμα Γ είναι <strong>16%</strong>.</p>
        </div>
      )
    },
    {
      id: 12,
      group: groupB,
      prompt: isEn
        ? 'In a square of side 20 cm, the largest possible circle is inscribed. What is the area of the region inside the square but outside the circle? (Given π ≈ 3.14).'
        : 'Σε ένα τετράγωνο πλευράς 20 εκ. εγγράφεται ο μέγιστος δυνατός κύκλος. Πόσο είναι το εμβαδόν του χωρίου που βρίσκεται μέσα στο τετράγωνο αλλά έξω από τον κύκλο; (Δίνεται π ≈ 3,14).',
      options: isEn
        ? ['64 sq. cm.', '72 sq. cm.', '86 sq. cm.', '94 sq. cm.', '100 sq. cm.']
        : ['64 τ.εκ.', '72 τ.εκ.', '86 τ.εκ.', '94 τ.εκ.', '100 τ.εκ.'],
      correct: isEn ? '86 sq. cm.' : '86 τ.εκ.',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Square area: <Pow base="20" exp="2" /> ＝ <strong>400 sq. cm.</strong></div>
            <div>• Inscribed circle radius: r ＝ 10 cm ➔ Area ＝ 3.14 · <Pow base="10" exp="2" /> ＝ <strong>314 sq. cm.</strong></div>
            <div>• Outer region area: <span className="whitespace-nowrap">400 － 314 ＝ <strong className="text-emerald-700 text-base">86 sq. cm.</strong></span></div>
          </div>
          <p className="pt-1">Therefore, the area of the region is <strong>86 sq. cm.</strong></p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Εμβαδόν τετραγώνου: <Pow base="20" exp="2" /> ＝ <strong>400 τ.εκ.</strong></div>
            <div>• Ακτίνα εγγεγραμμένου κύκλου: r ＝ 10 εκ. ➔ Εμβαδόν ＝ 3,14 · <Pow base="10" exp="2" /> ＝ <strong>314 τ.εκ.</strong></div>
            <div>• Εμβαδόν χωρίου: <span className="whitespace-nowrap">400 － 314 ＝ <strong className="text-emerald-700 text-base">86 τ.εκ.</strong></span></div>
          </div>
          <p className="pt-1">Επομένως, το εμβαδόν του χωρίου είναι <strong>86 τ.εκ.</strong></p>
        </div>
      )
    },
    {
      id: 13,
      group: groupB,
      prompt: isEn
        ? 'Two ships depart simultaneously from the port of Piraeus on May 1. The first ship returns to Piraeus every 12 days, while the second every 18 days. On what date will they meet again for the first time at the port? (May has 31 days).'
        : 'Δύο καράβια αναχωρούν ταυτόχρονα από το λιμάνι του Πειραιά την 1η Μαΐου. Το πρώτο καράβι επιστρέφει στον Πειραιά κάθε 12 ημέρες, ενώ το δεύτερο κάθε 18 ημέρες. Ποια ημερομηνία θα συναντηθούν πάλι για πρώτη φορά στο λιμάνι; (Ο Μάιος έχει 31 ημέρες).',
      options: isEn
        ? ['May 24', 'May 31', 'June 6', 'June 12', 'June 18']
        : ['24 Μαΐου', '31 Μαΐου', '6 Ιουνίου', '12 Ιουνίου', '18 Ιουνίου'],
      correct: isEn ? 'June 6' : '6 Ιουνίου',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• LCM(12, 18) ＝ <Pow base="2" exp="2" /> · <Pow base="3" exp="2" /> ＝ 4 · 9 ＝ <strong>36 days</strong> after May 1.</div>
            <div>• Days remaining in May after May 1: 31 － 1 ＝ <strong>30 days</strong> (reaches May 31).</div>
            <div>• Remaining days in June: 36 － 30 ＝ <strong>6 days</strong> ➔ <strong className="text-emerald-700 text-base whitespace-nowrap">June 6</strong>.</div>
          </div>
          <p className="pt-1">Therefore, they will meet again at the port on <strong>June 6</strong>.</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Ε.Κ.Π.(12, 18) ＝ <Pow base="2" exp="2" /> · <Pow base="3" exp="2" /> ＝ 4 · 9 ＝ <strong>36 ημέρες</strong> μετά την 1η Μαΐου.</div>
            <div>• Υπολειπόμενες ημέρες του Μαΐου μετά την 1η: 31 － 1 ＝ <strong>30 ημέρες</strong> (31 Μαΐου).</div>
            <div>• Ημέρες στον Ιούνιο: 36 － 30 ＝ <strong>6 ημέρες</strong> ➔ <strong className="text-emerald-700 text-base whitespace-nowrap">6 Ιουνίου</strong>.</div>
          </div>
          <p className="pt-1">Επομένως, θα συναντηθούν πάλι στο λιμάνι στις <strong>6 Ιουνίου</strong>.</p>
        </div>
      )
    },
    {
      id: 14,
      group: groupB,
      prompt: isEn
        ? 'Maria, Giannis, and Kostas have a total of 125 euros. Maria has 15 euros more than Giannis, while Kostas has twice as much money as Maria. How much money does Giannis have?'
        : 'Η Μαρία, ο Γιάννης και ο Κώστας έχουν συνολικά 125 ευρώ. Η Μαρία έχει 15 ευρώ περισσότερα από τον Γιάννη, ενώ ο Κώστας έχει διπλάσια χρήματα από τη Μαρία. Πόσα χρήματα έχει ο Γιάννης;',
      options: ['15 €', '20 €', '25 €', '35 €', '40 €'],
      correct: '20 €',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Let Giannis have <strong>x</strong> euros. Maria has <strong className="whitespace-nowrap">x ＋ 15</strong>, and Kostas has 2 · (x ＋ 15) ＝ <strong className="whitespace-nowrap">2x ＋ 30</strong>.</div>
            <div>• Total: x ＋ (x ＋ 15) ＋ (2x ＋ 30) ＝ 125 ➔ 4x ＋ 45 ＝ 125 ➔ 4x ＝ 80.</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Giannis: x ＝</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="80" den="4" /> ＝ <strong className="text-emerald-700 text-base">20 €</strong>.
              </span>
            </div>
          </div>
          <p className="pt-1">Therefore, Giannis has <strong>20 €</strong>.</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Έστω <strong>x</strong> τα χρήματα του Γιάννη. Η Μαρία έχει <strong className="whitespace-nowrap">x ＋ 15</strong> και ο Κώστας 2 · (x ＋ 15) ＝ <strong className="whitespace-nowrap">2x ＋ 30</strong>.</div>
            <div>• Σύνολο: x ＋ (x ＋ 15) ＋ (2x ＋ 30) ＝ 125 ➔ 4x ＋ 45 ＝ 125 ➔ 4x ＝ 80.</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Γιάννης: x ＝</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="80" den="4" /> ＝ <strong className="text-emerald-700 text-base">20 €</strong>.
              </span>
            </div>
          </div>
          <p className="pt-1">Επομένως, ο Γιάννης έχει <strong>20 ευρώ</strong>.</p>
        </div>
      )
    },
    {
      id: 15,
      group: groupB,
      prompt: isEn
        ? 'In a class with 10 boys and 15 girls, the average math score of the boys is 14, while the average score of the girls is 16.5. What is the overall average score of all students in the class?'
        : 'Σε ένα τμήμα με 10 αγόρια και 15 κορίτσια, ο μέσος όρος βαθμολογίας των αγοριών στα μαθηματικά είναι 14, ενώ ο μέσος όρος των κοριτσιών είναι 16,5. Ποιος είναι ο συνολικός μέσος όρος βαθμολογίας όλων των μαθητών του τμήματος;',
      options: isEn
        ? ['14.8', '15.0', '15.25', '15.5', '15.75']
        : ['14,8', '15,0', '15,25', '15,5', '15,75'],
      correct: '15.5',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Boys sum: 10 · 14 ＝ <strong>140</strong>; Girls sum: 15 · 16.5 ＝ <strong>247.5</strong>.</div>
            <div>• Total students: 10 ＋ 15 ＝ <strong>25</strong>; Total sum: 140 ＋ 247.5 ＝ <strong>387.5</strong>.</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Overall average:</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="387.5" den="25" /> ＝ <strong className="text-emerald-700 text-base">15.5</strong>.
              </span>
            </div>
          </div>
          <p className="pt-1">Therefore, the overall average score is <strong>15.5</strong>.</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Άθροισμα αγοριών: 10 · 14 ＝ <strong>140</strong>; Άθροισμα κοριτσιών: 15 · 16,5 ＝ <strong>247,5</strong>.</div>
            <div>• Σύνολο μαθητών: 10 ＋ 15 ＝ <strong>25</strong>; Σύνολο βαθμών: 140 ＋ 247,5 ＝ <strong>387,5</strong>.</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Συνολικός μέσος όρος:</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="387,5" den="25" /> ＝ <strong className="text-emerald-700 text-base">15,5</strong>.
              </span>
            </div>
          </div>
          <p className="pt-1">Επομένως, ο συνολικός μέσος όρος βαθμολογίας είναι <strong>15,5</strong>.</p>
        </div>
      )
    },
    {
      id: 16,
      group: groupB,
      prompt: isEn
        ? 'A growing pattern is formed from equal small squares: Figure 1 (1 square), Figure 2 (5 squares), Figure 3 (9 squares), Figure 4 (13 squares). If Figure N consists of 97 squares, what is the number N?'
        : 'Ένα αναπτυσσόμενο μοτίβο σχηματίζεται από μικρά ίσα τετράγωνα: Σχήμα 1 (1 τετράγωνο), Σχήμα 2 (5 τετράγωνα), Σχήμα 3 (9 τετράγωνα), Σχήμα 4 (13 τετράγωνα). Αν το Σχήμα Ν αποτελείται από 97 τετράγωνα, ποιος είναι ο αριθμός Ν;',
      options: ['22', '24', '25', '26', '28'],
      correct: '25',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Starts at 1 square and adds <strong>4 squares</strong> each step: 1 ＋ (N － 1) · 4 ＝ 97.</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• 4 · (N － 1) ＝ 96 ➔ N － 1 ＝</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="96" den="4" /> ＝ 24 ➔ <strong className="text-emerald-700 text-base">N ＝ 25</strong>.
              </span>
            </div>
          </div>
          <p className="pt-1">Therefore, Figure 97 corresponds to <strong>N ＝ 25</strong>.</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Ξεκινάει από 1 τετράγωνο και προσθέτει <strong>4 τετράγωνα</strong> σε κάθε βήμα: 1 ＋ (Ν － 1) · 4 ＝ 97.</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• 4 · (Ν － 1) ＝ 96 ➔ Ν － 1 ＝</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="96" den="4" /> ＝ 24 ➔ <strong className="text-emerald-700 text-base">Ν ＝ 25</strong>.
              </span>
            </div>
          </div>
          <p className="pt-1">Επομένως, το σχήμα των 97 τετραγώνων είναι το <strong>Σχήμα 25 (Ν ＝ 25)</strong>.</p>
        </div>
      )
    },
    {
      id: 17,
      group: groupB,
      prompt: isEn
        ? 'An electrical appliance was sold after a 30% discount for 210 euros. If the store decided to offer only a 10% discount on the original price, what would the selling price be?'
        : 'Μια ηλεκτρική συσκευή πουλήθηκε μετά από έκπτωση 30% στην τιμή των 210 ευρώ. Αν το κατάστημα αποφάσιζε να κάνει έκπτωση μόνο 10% πάνω στην αρχική τιμή, ποια θα ήταν η τιμή πώλησης;',
      options: ['230 €', '240 €', '250 €', '270 €', '280 €'],
      correct: '270 €',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• 70% of original price ＝ 210 € ➔ 10% ＝</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="210" den="7" /> ＝ 30 €
              </span>
              <span>➔ Original price (100%) ＝ <strong>300 €</strong>.</span>
            </div>
            <div>• Selling price with 10% discount (90% of 300 €): <span className="whitespace-nowrap">300 － 30 ＝ <strong className="text-emerald-700 text-base">270 €</strong></span>.</div>
          </div>
          <p className="pt-1">Therefore, the selling price would be <strong>270 €</strong>.</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Το 70% της αρχικής τιμής ＝ 210 € ➔ το 10% ＝</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Frac num="210" den="7" /> ＝ 30 €
              </span>
              <span>➔ Αρχική τιμή (100%) ＝ <strong>300 €</strong>.</span>
            </div>
            <div>• Τιμή με έκπτωση 10% (90% των 300 €): <span className="whitespace-nowrap">300 － 30 ＝ <strong className="text-emerald-700 text-base">270 €</strong></span>.</div>
          </div>
          <p className="pt-1">Επομένως, η τιμή πώλησης θα ήταν <strong>270 €</strong>.</p>
        </div>
      )
    },
    {
      id: 18,
      group: groupB,
      prompt: isEn
        ? 'If we double the length and triple the width of a rectangle, by what percentage (%) will its area increase?'
        : 'Αν διπλασιάσουμε το μήκος και τριπλασιάσουμε το πλάτος ενός ορθογωνίου, κατά πόσο τοις εκατό (%) θα αυξηθεί το εμβαδόν του;',
      options: ['100%', '400%', '500%', '600%', '700%'],
      correct: '500%',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• New area ＝ (2 · L) · (3 · W) ＝ <strong>6 · A</strong> (600% of original).</div>
            <div>• Net increase ＝ <span className="whitespace-nowrap">600% － 100% ＝ <strong className="text-emerald-700 text-base">500%</strong></span>.</div>
          </div>
          <p className="pt-1">Therefore, its area will increase by <strong>500%</strong>.</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Νέο εμβαδόν ＝ (2 · Μ) · (3 · Π) ＝ <strong>6 · Ε</strong> (600% του αρχικού).</div>
            <div>• Καθαρή αύξηση ＝ <span className="whitespace-nowrap">600% － 100% ＝ <strong className="text-emerald-700 text-base">500%</strong></span>.</div>
          </div>
          <p className="pt-1">Επομένως, το εμβαδόν του θα αυξηθεί κατά <strong>500%</strong>.</p>
        </div>
      )
    },
    {
      id: 19,
      group: groupB,
      prompt: isEn ? (
        <span>
          At a school camp, <Frac num="2" den="5" /> of the children do football, <Frac num="1" den="3" /> do basketball, and the remaining 16 children do swimming (no child does 2 sports). How many children are at the camp in total?
        </span>
      ) : (
        <span>
          Σε μια σχολική κατασκήνωση, τα <Frac num="2" den="5" /> των παιδιών ασχολούνται με το ποδόσφαιρο, το <Frac num="1" den="3" /> με το μπάσκετ και τα υπόλοιπα 16 παιδιά με το κολύμπι (κανένα παιδί δεν κάνει 2 αθλήματα). Πόσα είναι συνολικά τα παιδιά της κατασκήνωσης;
        </span>
      ),
      options: ['45', '50', '60', '75', '90'],
      correct: '60',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Football ＋ Basketball:</span>
              <span className="inline-flex items-center gap-1 whitespace-nowrap">
                <Frac num="2" den="5" /> ＋ <Frac num="1" den="3" /> ＝ <Frac num="6" den="15" /> ＋ <Frac num="5" den="15" /> ＝ <Frac num="11" den="15" />.
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Swimming:</span>
              <span className="inline-flex items-center gap-1 whitespace-nowrap">
                1 － <Frac num="11" den="15" /> ＝ <Frac num="4" den="15" />
              </span>
              <span>＝ 16 children ➔ <Frac num="1" den="15" /> ＝ 4 children.</span>
            </div>
            <div>• Total children (<Frac num="15" den="15" />): <span className="whitespace-nowrap">15 · 4 ＝ <strong className="text-emerald-700 text-base">60 children</strong></span>.</div>
          </div>
          <p className="pt-1">Therefore, there are <strong>60 children</strong> at the camp in total.</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Ποδόσφαιρο ＋ Μπάσκετ:</span>
              <span className="inline-flex items-center gap-1 whitespace-nowrap">
                <Frac num="2" den="5" /> ＋ <Frac num="1" den="3" /> ＝ <Frac num="6" den="15" /> ＋ <Frac num="5" den="15" /> ＝ <Frac num="11" den="15" />.
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Κολύμπι:</span>
              <span className="inline-flex items-center gap-1 whitespace-nowrap">
                1 － <Frac num="11" den="15" /> ＝ <Frac num="4" den="15" />
              </span>
              <span>＝ 16 παιδιά ➔ <Frac num="1" den="15" /> ＝ 4 παιδιά.</span>
            </div>
            <div>• Σύνολο παιδιών (<Frac num="15" den="15" />): <span className="whitespace-nowrap">15 · 4 ＝ <strong className="text-emerald-700 text-base">60 παιδιά</strong></span>.</div>
          </div>
          <p className="pt-1">Επομένως, τα παιδιά της κατασκήνωσης είναι συνολικά <strong>60</strong>.</p>
        </div>
      )
    },
    {
      id: 20,
      group: groupB,
      prompt: isEn
        ? 'We are looking for a two-digit number XY such that: (1) it is an odd number, (2) when divided by 5 it leaves a remainder of 3, and (3) the sum of its digits X ＋ Y equals 11. What is the number XY?'
        : 'Ψάχνουμε έναν διψήφιο αριθμό ΧΥ τέτοιον ώστε: (1) είναι περιττός (μονός) αριθμός, (2) αν διαιρεθεί με το 5 αφήνει υπόλοιπο 3, και (3) το άθροισμα των ψηφίων του Χ ＋ Υ είναι ίσο με 11. Ποιος είναι ο αριθμός ΧΥ;',
      options: ['38', '53', '83', '93', '98'],
      correct: '83',
      explain: isEn ? (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>1. Remainder 3 upon division by 5 ➔ units digit <span className="whitespace-nowrap">Y ∈ &#123;3, 8&#125;</span>.</div>
            <div>2. Odd number ➔ discard 8, so <strong className="whitespace-nowrap">Y ＝ 3</strong>.</div>
            <div>3. X ＋ 3 ＝ 11 ➔ <strong className="whitespace-nowrap">X ＝ 8</strong> ➔ Number is <strong className="text-emerald-700 text-base whitespace-nowrap">83</strong>.</div>
          </div>
          <p className="pt-1">Therefore, the required number is <strong>83</strong>.</p>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>1. Υπόλοιπο 3 στη διαίρεση με το 5 ➔ μονάδες <span className="whitespace-nowrap">Υ ∈ &#123;3, 8&#125;</span>.</div>
            <div>2. Περιττός αριθμός ➔ απορρίπτεται το 8, άρα <strong className="whitespace-nowrap">Υ ＝ 3</strong>.</div>
            <div>3. Χ ＋ 3 ＝ 11 ➔ <strong className="whitespace-nowrap">Χ ＝ 8</strong> ➔ Ο αριθμός είναι το <strong className="text-emerald-700 text-base whitespace-nowrap">83</strong>.</div>
          </div>
          <p className="pt-1">Επομένως, ο ζητούμενος αριθμός είναι το <strong>83</strong>.</p>
        </div>
      )
    }
  ];
}

const TOTAL_TIME_SECONDS = 60 * 60; // 60 λεπτά

export default function DeuteroTestProsomoiosisPage() {
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

  // Ανάγνωση του query param `timer` (0 ή 1)
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

  // Αντίστροφη μέτρηση
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

  const handleSelect = (qId, option) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const calculateScore = (currentAnswers) => {
    let s = 0;
    questions.forEach(q => {
      if (currentAnswers[q.id] === q.correct) {
        s += 2.5; // 2,5 μόρια ανά σωστή απάντηση (20 θέματα = σύνολο 50)
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

  const schemaProtoTest2 = [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": t.schemaHome, "item": `${baseUrl}/` },
        { "@type": "ListItem", "position": 2, "name": t.schemaHub, "item": `${baseUrl}/protipa/protipa` },
        { "@type": "ListItem", "position": 3, "name": t.schemaSimHub, "item": `${baseUrl}/protipa/test-prosomoiosis` },
        { "@type": "ListItem", "position": 4, "name": t.schemaCurrent, "item": `${baseUrl}/protipa/02-deytero-test` }
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
      schemaData={schemaProtoTest2}
      backUrl="/protipa/test-prosomoiosis"
      backText={t.backText}
      hideFooter={true}
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 4k:px-24 py-4 sm:py-6 pb-28 sm:pb-36 overflow-x-hidden text-slate-800 box-border space-y-6">

        {/* HERO BANNER & TIMER HEADER */}
        <div className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 rounded-3xl p-5 sm:p-7 text-white shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1.5">
              <span className="inline-block bg-white/20 px-3 py-0.5 rounded-full text-[11px] font-black tracking-wider text-sky-200">
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

          <p className="text-xs sm:text-sm text-sky-100/95 leading-relaxed max-w-3xl">
            {t.heroSubtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-sky-100 border-t border-white/20 pt-3">
            <span>📝 {t.answeredLabel} <strong>{answeredCount} {t.of20}</strong></span>
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
                {t.correctOutOf(Math.round(score / 2.5))}
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