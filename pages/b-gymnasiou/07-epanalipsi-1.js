import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Βοηθητική συνάρτηση για άτονα κεφαλαία (διατηρεί το Β')
function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(Β')/g);
  return parts
    .map((part) => {
      if (part === "Β'") return "Β'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

// Επαναχρησιμοποιήσιμο Component Γωνίας
function Angle({ children, className = '' }) {
  return (
    <span className={`relative inline-block leading-none mx-[1px] ${className}`}>
      <svg
        viewBox="0 0 12 6"
        className="w-[0.75em] h-[0.36em] absolute -top-[0.38em] left-1/2 -translate-x-1/2 text-current overflow-visible pointer-events-none"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M1 5 L6 1 L11 5" />
      </svg>
      <span>{children}</span>
    </span>
  );
}

// Επαναχρησιμοποιήσιμο Component Τόξου
function Arc({ children, className = '' }) {
  return (
    <span className={`relative inline-block leading-none mx-[1px] ${className}`}>
      <svg
        viewBox="0 0 16 6"
        className="w-[0.95em] h-[0.36em] absolute -top-[0.4em] left-1/2 -translate-x-1/2 text-current overflow-visible pointer-events-none"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M1 5 Q8 0.5 15 5" />
      </svg>
      <span>{children}</span>
    </span>
  );
}

// Επαναχρησιμοποιήσιμο Component Τετραγωνικής Ρίζας (Inline SVG + Vinculum)
function Radical({ children, className = '' }) {
  return (
    <span className={`inline-flex items-center align-middle font-mono shrink-0 select-none mx-0.5 ${className}`}>
      <svg
        viewBox="0 0 12 24"
        className="w-[0.52em] h-[1.12em] shrink-0 text-current overflow-visible"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M1 13 L3.5 13 L6.5 21 L12 2" />
      </svg>
      <span className="border-t-[1.8px] border-current pl-0.5 pr-1 py-0 leading-none text-[0.95em]">
        {children}
      </span>
    </span>
  );
}

// Επαναχρησιμοποιήσιμο Component Κλάσματος (Fraction)
function Frac({ num, den, className = '' }) {
  return (
    <span
      className={`inline-flex flex-col text-center align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full ${className}`}
    >
      <span className="border-b border-current px-0.5 sm:px-1 pb-0.5 whitespace-nowrap">
        {num}
      </span>
      <span className="pt-0.5 whitespace-nowrap">{den}</span>
    </span>
  );
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Εγγυημένα 4 αυστηρά μοναδικές επιλογές (τόσο σε key όσο και σε οπτικό κείμενο)
function ensureFourUniqueOptions(correctOpt, distractorPool) {
  const seenKeys = new Set([String(correctOpt.key).trim()]);
  const seenLabels = new Set([String(correctOpt.label).trim()]);
  const result = [correctOpt];

  for (const cand of shuffle(distractorPool)) {
    const k = String(cand.key).trim();
    const l = String(cand.label).trim();
    if (k && l && !seenKeys.has(k) && !seenLabels.has(l)) {
      seenKeys.add(k);
      seenLabels.add(l);
      result.push(cand);
    }
    if (result.length === 4) break;
  }

  let fallbackVal = 19;
  while (result.length < 4) {
    const fk = `fb_${fallbackVal}`;
    const fl = String(fallbackVal);
    if (!seenKeys.has(fk) && !seenLabels.has(fl)) {
      seenKeys.add(fk);
      seenLabels.add(fl);
      result.push({ key: fk, label: fl, node: fl });
    }
    fallbackVal += 3;
  }

  return shuffle(result);
}

// Δυναμικό Dark-Mode SVG Σχήμα Επεξήγησης (No-Giveaway: εμφανίζεται ΜΟΝΟ μετά το submit)
function renderFeedbackDiagram(diagram, isEl) {
  if (!diagram) return null;

  // 1. Διάγραμμα Δυνάμεων & Αρνητικού Εκθέτη
  if (diagram.type === 'powerFlow') {
    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 160" className="w-full max-w-[265px] h-36 select-none">
          <rect x="18" y="14" width="229" height="32" rx="8" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1.5" />
          <text x="132" y="34" textAnchor="middle" className="text-[9.5px] font-mono font-bold fill-indigo-200">
            {diagram.step1}
          </text>

          <line x1="132" y1="46" x2="132" y2="62" stroke="#64748b" strokeWidth="1.8" />
          <polygon points="132,64 128,57 136,57" fill="#64748b" />

          <rect x="18" y="64" width="229" height="32" rx="8" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
          <text x="132" y="84" textAnchor="middle" className="text-[9.5px] font-mono font-bold fill-emerald-200">
            {diagram.step2}
          </text>

          <line x1="132" y1="96" x2="132" y2="112" stroke="#64748b" strokeWidth="1.8" />
          <polygon points="132,114 128,107 136,107" fill="#64748b" />

          <rect x="18" y="114" width="229" height="32" rx="8" fill="#451a03" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="132" y="134" textAnchor="middle" className="text-[9.5px] font-mono font-bold fill-amber-300">
            {diagram.caption}
          </text>
        </svg>
      </div>
    );
  }

  // 2. Διάγραμμα Τυποποιημένης Μορφής (Scientific Notation)
  if (diagram.type === 'sciNotation') {
    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 160" className="w-full max-w-[265px] h-36 select-none">
          <rect x="16" y="18" width="233" height="44" rx="10" fill="#0f172a" stroke="#475569" strokeWidth="1.4" />
          <text x="132" y="36" textAnchor="middle" className="text-[8.5px] font-mono fill-slate-400">
            {isEl ? 'Τυποποιημένη Μορφή: α · 10^ν (1 ≤ |α| < 10)' : 'Scientific Notation: a · 10^n (1 ≤ |a| < 10)'}
          </text>
          <text x="132" y="53" textAnchor="middle" className="text-[10.5px] font-mono font-bold fill-indigo-300">
            {diagram.rawText}
          </text>

          <line x1="132" y1="64" x2="132" y2="86" stroke="#34d399" strokeWidth="2" />
          <polygon points="132,88 127,80 137,80" fill="#34d399" />

          <rect x="24" y="90" width="217" height="34" rx="8" fill="#064e3b" stroke="#34d399" strokeWidth="1.6" />
          <text x="132" y="111" textAnchor="middle" className="text-[11px] font-mono font-bold fill-emerald-200">
            {diagram.sciText}
          </text>

          <text x="132" y="148" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-amber-300">
            {diagram.caption}
          </text>
        </svg>
      </div>
    );
  }

  // 3. Διάγραμμα Ευθείας Πραγματικών Αριθμών (Φράγματα ριζών & κατασκευή ρ)
  if (diagram.type === 'realLine') {
    const hasTriangle = diagram.hasTriangle;
    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 160" className="w-full max-w-[265px] h-36 select-none">
          <line x1="20" y1="112" x2="245" y2="112" stroke="#94a3b8" strokeWidth="2" />
          <polygon points="247,112 239,108 239,116" fill="#94a3b8" />
          <text x="252" y="115" className="text-[9px] font-bold fill-slate-300">ℝ</text>

          {hasTriangle ? (
            <>
              <polygon
                points="46,112 138,112 138,44"
                fill="rgba(99, 102, 241, 0.28)"
                stroke="#818cf8"
                strokeWidth="1.8"
              />
              <polyline points="128,112 128,102 138,102" fill="none" stroke="#818cf8" strokeWidth="1.4" />
              <text x="92" y="126" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-indigo-300">
                {diagram.legA}
              </text>
              <text x="145" y="80" textAnchor="start" className="text-[8.5px] font-mono font-bold fill-indigo-300">
                {diagram.legB}
              </text>
              <text x="82" y="72" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-emerald-300">
                {diagram.hypLabel}
              </text>
              <path
                d="M 138 44 A 114 114 0 0 1 160 112"
                fill="none"
                stroke="#34d399"
                strokeWidth="2"
                strokeDasharray="4 3"
              />
              <circle cx="46" cy="112" r="3" fill="#cbd5e1" />
              <text x="46" y="126" textAnchor="middle" className="text-[8px] font-mono fill-slate-300">0</text>
              <circle cx="160" cy="112" r="4" fill="#fbbf24" />
              <text x="166" y="127" textAnchor="start" className="text-[8.5px] font-mono font-bold fill-amber-300">
                {diagram.pointLabel}
              </text>
            </>
          ) : (
            <>
              <circle cx="58" cy="112" r="3.5" fill="#818cf8" />
              <text x="58" y="96" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-indigo-300">
                {diagram.leftLabel}
              </text>

              <circle cx="206" cy="112" r="3.5" fill="#818cf8" />
              <text x="206" y="96" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-indigo-300">
                {diagram.rightLabel}
              </text>

              <circle cx="132" cy="112" r="4.5" fill="#34d399" />
              <text x="132" y="88" textAnchor="middle" className="text-[9.5px] font-mono font-bold fill-emerald-300">
                {diagram.midLabel}
              </text>
            </>
          )}

          <text x="132" y="148" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-amber-300">
            {diagram.caption}
          </text>
        </svg>
      </div>
    );
  }

  // 4. Διάγραμμα Ορθογωνίου / Τετραγώνου με Ρίζες
  if (diagram.type === 'rectRoot') {
    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 160" className="w-full max-w-[265px] h-36 select-none">
          <rect
            x="58"
            y="26"
            width="148"
            height="82"
            rx="4"
            fill="rgba(16, 185, 129, 0.24)"
            stroke="#34d399"
            strokeWidth="1.8"
          />
          <text x="132" y="70" textAnchor="middle" className="text-[9.5px] font-mono font-bold fill-emerald-200">
            {diagram.centerLabel}
          </text>
          <text x="132" y="122" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-indigo-300">
            {diagram.bottomLabel}
          </text>
          <text x="212" y="70" textAnchor="start" className="text-[8.5px] font-mono font-bold fill-indigo-300">
            {diagram.sideLabel}
          </text>
          <text x="132" y="148" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-amber-300">
            {diagram.caption}
          </text>
        </svg>
      </div>
    );
  }

  return null;
}

export default function Epanalipsi1() {
  const router = useRouter();
  const locale = router?.locale || 'el';
  const isEl = locale === 'el';
  const locCode = isEl ? 'el-GR' : 'en-US';

  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Συγκεντρωτικό Λεξικό i18n
  const t = {
    pageTitle: isEl
      ? "Επανάληψη 1 (Κεφ. 1–6): Δυνάμεις, Τυποποιημένη Μορφή, Ρίζες & Πραγματικοί | Β' Γυμνασίου"
      : 'Review 1 (Ch. 1–6): Powers, Scientific Notation, Square Roots & Real Numbers | Grade 8',
    pageDesc: isEl
      ? "Επαναληπτικό διαγώνισμα Β' Γυμνασίου στα Κεφάλαια 1 έως 6: δυνάμεις με ακέραιο εκθέτη, τυποποιημένη μορφή, αριθμητικές παραστάσεις, τετραγωνικές ρίζες και πραγματικοί αριθμοί."
      : 'Grade 8 review test on Chapters 1 to 6: integer exponents, scientific notation, numerical expressions, square roots, and real numbers.',
    backNav: isEl ? "Β' Γυμνασίου" : 'Grade 8',
    theory6Btn: isEl ? 'ΘΕΩΡΙΑ ΚΕΦ. 6' : 'THEORY CH. 6',
    ask6Btn: isEl ? 'ΑΣΚΗΣΕΙΣ ΚΕΦ. 6' : 'EXERCISES CH. 6',
    heroBadge: isEl ? "ΕΠΑΝΑΛΗΨΗ 1 • ΚΕΦΑΛΑΙΑ 1 ΕΩΣ 6 • Β' ΓΥΜΝΑΣΙΟΥ" : 'REVIEW 1 • CHAPTERS 1 TO 6 • GRADE 8',
    heroTitle: isEl
      ? 'Επαναληπτικό Τεστ Άλγεβρας: Ενότητες 1 έως 6'
      : 'Algebra Review Test: Units 1 to 6',
    heroDesc: isEl
      ? '2 ασκήσεις από κάθε κεφάλαιο (Κεφ. 1–6: Δυνάμεις, Τυποποιημένη Μορφή, Παραστάσεις, Ρίζες & Πραγματικοί Αριθμοί) και 6 δύσκολα συνδυαστικά προβλήματα στο τέλος.'
      : '2 exercises from each chapter (Ch. 1–6: Powers, Scientific Notation, Expressions, Square Roots & Real Numbers) and 6 challenging multi-step problems at the end.',
    btnNewSet: isEl ? 'ΝΕΟ ΕΠΑΝΑΛΗΠΤΙΚΟ ΤΕΣΤ' : 'NEW REVIEW TEST',
    btnTryNewSet: isEl ? 'ΔΟΚΙΜΑΣΤΕ ΝΕΑ ΘΕΜΑΤΑ' : 'TRY NEW TOPICS',
    scoreLabel: isEl ? 'Τελικό Αποτέλεσμα' : 'Final Score',
    scoreGreat: isEl
      ? 'Άριστα! Έχετε κατακτήσει πλήρως τις δυνάμεις με ακέραιο εκθέτη, την τυποποιημένη μορφή, τις τετραγωνικές ρίζες και τους πραγματικούς αριθμούς.'
      : 'Excellent! You have fully mastered integer exponents, scientific notation, square roots, and real numbers.',
    scoreGood: isEl
      ? 'Πολύ καλή προσπάθεια! Μελετήστε τους πίνακες ανάλυσης και τα διαγράμματα παρακάτω στα ερωτήματα που χάσατε.'
      : 'Very good effort! Study the step-by-step tables and diagrams below for any questions you missed.',
    scoreNeedWork: isEl
      ? 'Χρειάζεται λίγη επανάληψη ακόμα στους αρνητικούς εκθέτες, την τυποποιημένη μορφή και τις ιδιότητες ριζών!'
      : 'Needs a bit more review on negative exponents, scientific notation, and square root properties!',
    correctBadge: isEl ? '✓ Σωστό' : '✓ Correct',
    wrongBadge: isEl ? '✗ Λάθος' : '✗ Wrong',
    answeredLabel: isEl ? 'ΑΠΑΝΤΗΘΗΚΑΝ' : 'ANSWERED',
    checkBtn: isEl ? 'ΕΛΕΓΧΟΣ ΕΠΑΝΑΛΗΨΗΣ' : 'SUBMIT REVIEW',
    correctAnswerTitle: isEl ? 'Σωστή Απάντηση:' : 'Correct Answer:',
    tableStep: isEl ? 'Στοιχείο / Βήμα' : 'Element / Step',
    tableAnalysis: isEl ? 'Ανάλυση Δεδομένων' : 'Data Analysis',
  };

  // =========================================================================
  // ΔΕΞΑΜΕΝΕΣ 10 ΠΑΡΑΛΛΑΓΩΝ ΑΝΑ ΘΕΣΗ (18 ΘΕΣΕΙΣ = 180 ΜΟΝΑΔΙΚΕΣ ΠΑΡΑΛΛΑΓΕΣ)
  // =========================================================================

  // ΚΕΦ. 1 - ΑΣΚΗΣΗ 1 (10 παραλλαγές)
  const buildCh1Ex1 = (mode) => {
    switch (mode) {
      case 0: {
        const b = pickRandom([2, 3, 4, 5]);
        const e = b === 2 ? pickRandom([2, 3, 4]) : 2;
        const den = Math.pow(b, e);
        const correctOpt = { key: `1/${den}`, label: `1/${den}`, node: <Frac num="1" den={String(den)} /> };
        return {
          sig: `c1e1_0_${b}_${e}`,
          title: isEl ? 'Ορισμός Αρνητικού Εκθέτη' : 'Negative Exponent Definition',
          prompt: <span>{isEl ? 'Ποια είναι η τιμή της δύναμης' : 'What is the value of'} {b}<sup>-{e}</sup>;</span>,
          type: 'mcq',
          correct: correctOpt.key,
          options: ensureFourUniqueOptions(correctOpt, [
            { key: `-${den}`, label: `-${den}`, node: `-${den}` },
            { key: `-1/${den}`, label: `-1/${den}`, node: <span>-<Frac num="1" den={String(den)} /></span> },
            { key: `${den}`, label: `${den}`, node: String(den) },
            { key: `1/${b * e}`, label: `1/${b * e}`, node: <Frac num="1" den={String(b * e)} /> },
          ]),
          explanation: (
            <span>
              {isEl ? 'Από τον ορισμό' : 'By definition'}: {b}<sup>-{e}</sup> ＝ <Frac num="1" den={<span>{b}<sup>{e}</sup></span>} /> ＝ <Frac num="1" den={String(den)} />.
            </span>
          ),
        };
      }
      case 1: {
        const den = pickRandom([2, 3, 4, 5]);
        const exp = den === 2 ? pickRandom([2, 3, 4]) : 2;
        const ans = Math.pow(den, exp);
        return {
          sig: `c1e1_1_${den}_${exp}`,
          title: isEl ? 'Αρνητικός Εκθέτης Κλάσματος' : 'Negative Exponent of a Fraction',
          prompt: (
            <span className="inline-flex items-center">
              {isEl ? 'Υπολογίστε την τιμή της δύναμης' : 'Calculate the value of'} (<Frac num="1" den={String(den)} />)<sup>-{exp}</sup>:
            </span>
          ),
          type: 'input',
          correct: ans,
          explanation: (
            <span>
              (<Frac num="1" den={String(den)} />)<sup>-{exp}</sup> ＝ (<Frac num={String(den)} den="1" />)<sup>{exp}</sup> ＝ {den}<sup>{exp}</sup> ＝ {ans}.
            </span>
          ),
        };
      }
      case 2: {
        const b = pickRandom([3, 5, 7, 9]);
        return {
          sig: `c1e1_2_${b}`,
          title: isEl ? 'Μηδενικός Εκθέτης & Παρενθέσεις' : 'Zero Exponent & Parentheses',
          prompt: <span>{isEl ? 'Ισχύει η ισότητα:' : 'Does the equality hold:'} (-{b})<sup>0</sup> ＝ -1;</span>,
          type: 'tf',
          correct: isEl ? 'Λάθος' : 'False',
          options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
          explanation: (
            <span>
              {isEl
                ? `Κάθε μη μηδενικός αριθμός σε παρένθεση υψωμένος στη 0 ισούται με +1: (-${b})⁰ ＝ 1.`
                : `Any non-zero number in parentheses raised to 0 equals +1: (-${b})⁰ ＝ 1.`}
            </span>
          ),
        };
      }
      case 3: {
        const m = pickRandom([5, 6, 7]);
        const n = pickRandom([-2, -3, -4]);
        const sum = m + n;
        const correctOpt = { key: `x^${sum}`, label: `x^${sum}`, node: <span>x<sup>{sum}</sup></span> };
        return {
          sig: `c1e1_3_${m}_${n}`,
          title: isEl ? 'Γινόμενο Δυνάμεων Ίδιας Βάσης' : 'Product of Same-Base Powers',
          prompt: <span>{isEl ? 'Για x ≠ 0, το γινόμενο' : 'For x ≠ 0, the product'} x<sup>{m}</sup> · x<sup>{n}</sup> {isEl ? 'ισούται με:' : 'equals:'}</span>,
          type: 'mcq',
          correct: correctOpt.key,
          options: ensureFourUniqueOptions(correctOpt, [
            { key: `x^${m * n}`, label: `x^${m * n}`, node: <span>x<sup>{m * n}</sup></span> },
            { key: `x^${m - n}`, label: `x^${m - n}`, node: <span>x<sup>{m - n}</sup></span> },
            { key: `x^${-sum}`, label: `x^${-sum}`, node: <span>x<sup>{-sum}</sup></span> },
            { key: `2x^${sum}`, label: `2x^${sum}`, node: <span>2x<sup>{sum}</sup></span> },
          ]),
          explanation: <span>x<sup>{m}</sup> · x<sup>{n}</sup> ＝ x<sup>{m} + ({n})</sup> ＝ x<sup>{sum}</sup>.</span>,
        };
      }
      case 4: {
        const num = pickRandom([2, 3]);
        const den = pickRandom([5, 7]);
        const correctOpt = {
          key: `${den * den}/${num * num}`,
          label: `${den * den}/${num * num}`,
          node: <Frac num={String(den * den)} den={String(num * num)} />,
        };
        return {
          sig: `c1e1_4_${num}_${den}`,
          title: isEl ? 'Αντιστροφή Κλάσματος με Αρνητικό Εκθέτη' : 'Inverting a Fraction with Negative Exponent',
          prompt: (
            <span className="inline-flex items-center">
              {isEl ? 'Η δύναμη' : 'The power'} (<Frac num={String(num)} den={String(den)} />)<sup>-2</sup> {isEl ? 'ισούται με:' : 'equals:'}
            </span>
          ),
          type: 'mcq',
          correct: correctOpt.key,
          options: ensureFourUniqueOptions(correctOpt, [
            { key: `-${num * num}/${den * den}`, label: `-${num * num}/${den * den}`, node: <span>-<Frac num={String(num * num)} den={String(den * den)} /></span> },
            { key: `${num * num}/${den * den}`, label: `${num * num}/${den * den}`, node: <Frac num={String(num * num)} den={String(den * den)} /> },
            { key: `-${den * den}/${num * num}`, label: `-${den * den}/${num * num}`, node: <span>-<Frac num={String(den * den)} den={String(num * num)} /></span> },
            { key: `${den}/${num}`, label: `${den}/${num}`, node: <Frac num={String(den)} den={String(num)} /> },
          ]),
          explanation: (
            <span>
              (<Frac num={String(num)} den={String(den)} />)<sup>-2</sup> ＝ (<Frac num={String(den)} den={String(num)} />)<sup>2</sup> ＝ <Frac num={String(den * den)} den={String(num * num)} />.
            </span>
          ),
        };
      }
      case 5: {
        const m = pickRandom([2, 3, 4]);
        const n = pickRandom([-2, -3]);
        const prod = m * n;
        return {
          sig: `c1e1_5_${m}_${n}`,
          title: isEl ? 'Δύναμη Δύναμης' : 'Power of a Power',
          prompt: <span>{isEl ? 'Για α ≠ 0 ισχύει:' : 'For α ≠ 0:'} (α<sup>{m}</sup>)<sup>{n}</sup> ＝ α<sup>{prod}</sup>;</span>,
          type: 'tf',
          correct: isEl ? 'Σωστό' : 'True',
          options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
          explanation: <span>{isEl ? 'Πολλαπλασιάζουμε τους εκθέτες:' : 'Multiply exponents:'} {m} · ({n}) ＝ {prod}.</span>,
        };
      }
      case 6: {
        const a = pickRandom([3, 4, 5, 6]);
        return {
          sig: `c1e1_6_${a}`,
          title: isEl ? 'Άθροισμα Δυνάμεων' : 'Sum of Powers',
          prompt: <span>{isEl ? 'Υπολογίστε την τιμή:' : 'Calculate:'} {a}<sup>1</sup> ＋ {a}<sup>0</sup></span>,
          type: 'input',
          correct: a + 1,
          explanation: <span>{a}<sup>1</sup> ＋ {a}<sup>0</sup> ＝ {a} ＋ 1 ＝ {a + 1}.</span>,
        };
      }
      case 7: {
        const m = pickRandom([3, 4]);
        const n = pickRandom([-2, -3]);
        const diff = m - n;
        const correctOpt = { key: `y^${diff}`, label: `y^${diff}`, node: <span>y<sup>{diff}</sup></span> };
        return {
          sig: `c1e1_7_${m}_${n}`,
          title: isEl ? 'Πηλίκο Δυνάμεων Ίδιας Βάσης' : 'Quotient of Same-Base Powers',
          prompt: (
            <span className="inline-flex items-center">
              {isEl ? 'Για y ≠ 0, το πηλίκο' : 'For y ≠ 0, the quotient'} <Frac num={<span>y<sup>{m}</sup></span>} den={<span>y<sup>{n}</sup></span>} /> {isEl ? 'ισούται με:' : 'equals:'}
            </span>
          ),
          type: 'mcq',
          correct: correctOpt.key,
          options: ensureFourUniqueOptions(correctOpt, [
            { key: `y^${m + n}`, label: `y^${m + n}`, node: <span>y<sup>{m + n}</sup></span> },
            { key: `y^${n - m}`, label: `y^${n - m}`, node: <span>y<sup>{n - m}</sup></span> },
            { key: `y^${m * n}`, label: `y^${m * n}`, node: <span>y<sup>{m * n}</sup></span> },
            { key: '1', label: '1', node: '1' },
          ]),
          explanation: (
            <span>
              <Frac num={<span>y<sup>{m}</sup></span>} den={<span>y<sup>{n}</sup></span>} /> ＝ y<sup>{m} - ({n})</sup> ＝ y<sup>{diff}</sup>.
            </span>
          ),
        };
      }
      case 8: {
        const b = pickRandom([3, 4, 5, 6]);
        return {
          sig: `c1e1_8_${b}`,
          title: isEl ? 'Γινόμενο με Αρνητικό Εκθέτη' : 'Product with Negative Exponent',
          prompt: <span>{isEl ? 'Υπολογίστε:' : 'Calculate:'} {b}<sup>-3</sup> · {b}<sup>4</sup></span>,
          type: 'input',
          correct: b,
          explanation: <span>{b}<sup>-3 + 4</sup> ＝ {b}<sup>1</sup> ＝ {b}.</span>,
        };
      }
      default: {
        const exp = pickRandom([-3, -5]);
        return {
          sig: `c1e1_9_${exp}`,
          title: isEl ? 'Πρόσημο Δύναμης' : 'Sign of a Power',
          prompt: <span>{isEl ? 'Η δύναμη' : 'The power'} (-2)<sup>{exp}</sup> {isEl ? 'είναι αρνητικός αριθμός;' : 'is a negative number?'}</span>,
          type: 'tf',
          correct: isEl ? 'Σωστό' : 'True',
          options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
          explanation: <span>{isEl ? 'Αρνητική βάση (-2) σε περιττό εκθέτη (' + exp + ') δίνει αρνητικό αποτέλεσμα.' : 'Negative base (-2) to an odd exponent (' + exp + ') is negative.'}</span>,
        };
      }
    }
  };

  // ΚΕΦ. 1 - ΑΣΚΗΣΗ 2 (10 παραλλαγές)
  const buildCh1Ex2 = (mode) => {
    switch (mode) {
      case 0: {
        const b = pickRandom([2, 3, 5]);
        const k = pickRandom([4, 5, 6]);
        const ans = b * b;
        return {
          sig: `c1e2_0_${b}_${k}`,
          title: isEl ? 'Απλοποίηση Κλάσματος Δυνάμεων' : 'Simplifying Quotient of Powers',
          prompt: (
            <span className="inline-flex items-center">
              {isEl ? 'Υπολογίστε:' : 'Calculate:'} <Frac num={<span>{b}<sup>{k}</sup></span>} den={<span>{b}<sup>{k - 2}</sup></span>} />
            </span>
          ),
          type: 'input',
          correct: ans,
          explanation: <span>{b}<sup>{k} - ({k - 2})</sup> ＝ {b}<sup>2</sup> ＝ {ans}.</span>,
        };
      }
      case 1: {
        const n = pickRandom([3, 4, 5]);
        const correctOpt = { key: `x^${n}y^${n}`, label: `x^${n} · y^${n}`, node: <span>x<sup>{n}</sup> · y<sup>{n}</sup></span> };
        return {
          sig: `c1e2_1_${n}`,
          title: isEl ? 'Δύναμη Γινομένου' : 'Power of a Product',
          prompt: <span>{isEl ? 'Η παράσταση' : 'The expression'} (x · y)<sup>{n}</sup> {isEl ? 'ισούται με:' : 'equals:'}</span>,
          type: 'mcq',
          correct: correctOpt.key,
          options: ensureFourUniqueOptions(correctOpt, [
            { key: `xy^${n}`, label: `x · y^${n}`, node: <span>x · y<sup>{n}</sup></span> },
            { key: `x^${n}y`, label: `x^${n} · y`, node: <span>x<sup>{n}</sup> · y</span> },
            { key: `x^${2 * n}y^${2 * n}`, label: `x^${2 * n} · y^${2 * n}`, node: <span>x<sup>{2 * n}</sup> · y<sup>{2 * n}</sup></span> },
            { key: `${n}xy`, label: `${n}xy`, node: `${n}xy` },
          ]),
          explanation: <span>(x · y)<sup>{n}</sup> ＝ x<sup>{n}</sup> · y<sup>{n}</sup>.</span>,
        };
      }
      case 2: {
        const a = pickRandom([2, 3, 5]);
        const b = pickRandom([4, 7]);
        const exp = pickRandom([3, 4]);
        return {
          sig: `c1e2_2_${a}_${b}_${exp}`,
          title: isEl ? 'Γινόμενο Αντίστροφων Δυνάμεων' : 'Product of Reciprocal Powers',
          prompt: (
            <span className="inline-flex items-center">
              {isEl ? 'Υπολογίστε:' : 'Calculate:'} (<Frac num={String(a)} den={String(b)} />)<sup>{exp}</sup> · (<Frac num={String(b)} den={String(a)} />)<sup>{exp}</sup>
            </span>
          ),
          type: 'input',
          correct: 1,
          explanation: <span>(<Frac num={String(a)} den={String(b)} /> · <Frac num={String(b)} den={String(a)} />)<sup>{exp}</sup> ＝ 1<sup>{exp}</sup> ＝ 1.</span>,
        };
      }
      case 3: {
        const k = pickRandom([2, 3, 4]);
        return {
          sig: `c1e2_3_${k}`,
          title: isEl ? 'Δυνάμεις με Ίδιο Εκθέτη' : 'Powers with Same Exponent',
          prompt: <span>{isEl ? 'Ισχύει η ισότητα:' : 'Does the equality hold:'} 2<sup>{k}</sup> · 5<sup>{k}</sup> ＝ 10<sup>{k}</sup>;</span>,
          type: 'tf',
          correct: isEl ? 'Σωστό' : 'True',
          options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
          explanation: <span>2<sup>{k}</sup> · 5<sup>{k}</sup> ＝ (2 · 5)<sup>{k}</sup> ＝ 10<sup>{k}</sup>.</span>,
        };
      }
      case 4: {
        const b = pickRandom([2, 3, 4]);
        const den = Math.pow(b, 3);
        const correctOpt = { key: `1/${den}`, label: `1/${den}`, node: <Frac num="1" den={String(den)} /> };
        return {
          sig: `c1e2_4_${b}`,
          title: isEl ? 'Πηλίκο με Αρνητικούς Εκθέτες' : 'Quotient with Negative Exponents',
          prompt: (
            <span className="inline-flex items-center">
              {isEl ? 'Η τιμή της παράστασης' : 'The value of'} <Frac num={<span>{b}<sup>-5</sup></span>} den={<span>{b}<sup>-2</sup></span>} /> {isEl ? 'είναι:' : 'is:'}
            </span>
          ),
          type: 'mcq',
          correct: correctOpt.key,
          options: ensureFourUniqueOptions(correctOpt, [
            { key: `${den}`, label: `${den}`, node: String(den) },
            { key: `1/${Math.pow(b, 7)}`, label: `1/${Math.pow(b, 7)}`, node: <Frac num="1" den={String(Math.pow(b, 7))} /> },
            { key: `-${den}`, label: `-${den}`, node: `-${den}` },
            { key: `1/${b}`, label: `1/${b}`, node: <Frac num="1" den={String(b)} /> },
          ]),
          explanation: <span>{b}<sup>-5 - (-2)</sup> ＝ {b}<sup>-3</sup> ＝ <Frac num="1" den={String(den)} />.</span>,
        };
      }
      case 5: {
        const k = pickRandom([3, 4, 5]);
        return {
          sig: `c1e2_5_${k}`,
          title: isEl ? 'Πρόσθεση vs Πολλαπλασιασμός Δυνάμεων' : 'Adding vs Multiplying Powers',
          prompt: <span>{isEl ? 'Ισχύει ότι' : 'Does it hold that'} 3<sup>{k}</sup> ＋ 3<sup>{k}</sup> ＝ 3<sup>{2 * k}</sup>;</span>,
          type: 'tf',
          correct: isEl ? 'Λάθος' : 'False',
          options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
          explanation: <span>3<sup>{k}</sup> ＋ 3<sup>{k}</sup> ＝ 2 · 3<sup>{k}</sup> (οι εκθέτες προστίθενται μόνο στον πολλαπλασιασμό).</span>,
        };
      }
      case 6: {
        const exp = pickRandom([2, 3]);
        const ans = Math.pow(4, exp);
        return {
          sig: `c1e2_6_${exp}`,
          title: isEl ? 'Δύναμη Πηλίκου' : 'Power of a Quotient',
          prompt: (
            <span className="inline-flex items-center">
              {isEl ? 'Υπολογίστε:' : 'Calculate:'} <Frac num={<span>20<sup>{exp}</sup></span>} den={<span>5<sup>{exp}</sup></span>} />
            </span>
          ),
          type: 'input',
          correct: ans,
          explanation: <span>(<Frac num="20" den="5" />)<sup>{exp}</sup> ＝ 4<sup>{exp}</sup> ＝ {ans}.</span>,
        };
      }
      case 7: {
        const k = pickRandom([3, 4, 5]);
        const correctOpt = { key: `x^${k}`, label: `x^${k}`, node: <span>x<sup>{k}</sup></span> };
        return {
          sig: `c1e2_7_${k}`,
          title: isEl ? 'Αντίστροφο Αρνητικής Δύναμης' : 'Reciprocal of a Negative Power',
          prompt: (
            <span className="inline-flex items-center">
              {isEl ? 'Για x ≠ 0, η παράσταση' : 'For x ≠ 0,'} <Frac num="1" den={<span>x<sup>-{k}</sup></span>} /> {isEl ? 'ισούται με:' : 'equals:'}
            </span>
          ),
          type: 'mcq',
          correct: correctOpt.key,
          options: ensureFourUniqueOptions(correctOpt, [
            { key: `-x^${k}`, label: `-x^${k}`, node: <span>-x<sup>{k}</sup></span> },
            { key: `x^-${k}`, label: `x^-${k}`, node: <span>x<sup>-{k}</sup></span> },
            { key: `-${k}x`, label: `-${k}x`, node: `-${k}x` },
            { key: `1/${k}x`, label: `1/(${k}x)`, node: <Frac num="1" den={`${k}x`} /> },
          ]),
          explanation: <span><Frac num="1" den={<span>x<sup>-{k}</sup></span>} /> ＝ x<sup>{k}</sup>.</span>,
        };
      }
      case 8: {
        return {
          sig: 'c1e2_8',
          title: isEl ? 'Δυνάμεις Αρνητικής Βάσης' : 'Powers with Negative Base',
          prompt: <span>{isEl ? 'Υπολογίστε:' : 'Calculate:'} (-3)<sup>5</sup> · (-3)<sup>-3</sup></span>,
          type: 'input',
          correct: 9,
          explanation: <span>(-3)<sup>5 - 3</sup> ＝ (-3)<sup>2</sup> ＝ 9.</span>,
        };
      }
      default: {
        const b = pickRandom([2, 3]);
        return {
          sig: `c1e2_9_${b}`,
          title: isEl ? 'Σημασία της Παρένθεσης' : 'Role of Parentheses',
          prompt: <span>{isEl ? 'Ισχύει ότι' : 'Does it hold that'} -{b}<sup>2</sup> ＝ (-{b})<sup>2</sup>;</span>,
          type: 'tf',
          correct: isEl ? 'Λάθος' : 'False',
          options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
          explanation: <span>-{b}<sup>2</sup> ＝ -{b * b}, ενώ (-{b})<sup>2</sup> ＝ +{b * b}.</span>,
        };
      }
    }
  };

  // ΚΕΦ. 2 - ΑΣΚΗΣΗ 1 (10 παραλλαγές)
  const buildCh2Ex1 = (mode) => {
    switch (mode) {
      case 0: {
        const d1 = pickRandom([3, 4, 5, 7, 8]);
        const d2 = pickRandom([2, 5, 6]);
        const exp = pickRandom([5, 6, 7]);
        const numStr = `${d1}${d2}${'0'.repeat(exp - 1)}`;
        const correctOpt = {
          key: `${d1}.${d2}*10^${exp}`,
          label: `${d1},${d2} · 10^${exp}`,
          node: <span>{isEl ? `${d1},${d2}` : `${d1}.${d2}`} · 10<sup>{exp}</sup></span>,
        };
        return {
          sig: `c2e1_0_${d1}_${d2}_${exp}`,
          title: isEl ? 'Μετατροπή σε Τυποποιημένη Μορφή' : 'Converting to Scientific Notation',
          prompt: isEl
            ? `Ποια είναι η τυποποιημένη μορφή του αριθμού ${numStr};`
            : `What is the scientific notation of ${numStr}?`,
          type: 'mcq',
          correct: correctOpt.key,
          options: ensureFourUniqueOptions(correctOpt, [
            { key: `${d1}${d2}*10^${exp - 1}`, label: `${d1}${d2} · 10^${exp - 1}`, node: <span>{d1}{d2} · 10<sup>{exp - 1}</sup></span> },
            { key: `${d1}.${d2}*10^${exp + 1}`, label: `${d1},${d2} · 10^${exp + 1}`, node: <span>{isEl ? `${d1},${d2}` : `${d1}.${d2}`} · 10<sup>{exp + 1}</sup></span> },
            { key: `0.${d1}${d2}*10^${exp + 1}`, label: `0,${d1}${d2} · 10^${exp + 1}`, node: <span>{isEl ? `0,${d1}${d2}` : `0.${d1}${d2}`} · 10<sup>{exp + 1}</sup></span> },
            { key: `${d1}.${d2}*10^-${exp}`, label: `${d1},${d2} · 10^-${exp}`, node: <span>{isEl ? `${d1},${d2}` : `${d1}.${d2}`} · 10<sup>-{exp}</sup></span> },
          ]),
          diagram: {
            type: 'sciNotation',
            rawText: numStr,
            sciText: `${isEl ? `${d1},${d2}` : `${d1}.${d2}`} · 10^${exp}`,
            caption: isEl ? `Μετακίνηση ${exp} θέσεις αριστερά` : `Shift ${exp} places left`,
          },
          explanation: (
            <span>
              {numStr} ＝ {isEl ? `${d1},${d2}` : `${d1}.${d2}`} · 10<sup>{exp}</sup>.
            </span>
          ),
        };
      }
      case 1: {
        const d = pickRandom([4, 6, 7, 9]);
        const zeros = pickRandom([3, 4, 5]);
        const exp = -(zeros + 1);
        const decStr = isEl ? `0,${'0'.repeat(zeros)}${d}` : `0.${'0'.repeat(zeros)}${d}`;
        return {
          sig: `c2e1_1_${d}_${zeros}`,
          title: isEl ? 'Πολύ Μικροί Αριθμοί (Αρνητικός Εκθέτης)' : 'Very Small Numbers (Negative Exponent)',
          prompt: (
            <span>
              {isEl
                ? `Ο αριθμός ${decStr} γράφεται σε τυποποιημένη μορφή ως ${d} · 10`
                : `The number ${decStr} is written as ${d} · 10`}
              <sup>ν</sup>. {isEl ? 'Ποιος είναι ο εκθέτης ν;' : 'What is the exponent ν?'}
            </span>
          ),
          type: 'input',
          correct: exp,
          explanation: <span>{decStr} ＝ {d} · 10<sup>{exp}</sup>, άρα ν ＝ {exp}.</span>,
        };
      }
      case 2: {
        const k = pickRandom([12, 15, 24]);
        return {
          sig: `c2e1_2_${k}`,
          title: isEl ? 'Έλεγχος Τυποποιημένης Μορφής' : 'Checking Scientific Notation Form',
          prompt: <span>{isEl ? 'Η παράσταση' : 'Is'} {k} · 10<sup>5</sup> {isEl ? 'είναι γραμμένη σε τυποποιημένη μορφή;' : 'in proper scientific notation?'}</span>,
          type: 'tf',
          correct: isEl ? 'Λάθος' : 'False',
          options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
          explanation: <span>{isEl ? `Πρέπει 1 ≤ |α| < 10, ενώ εδώ α ＝ ${k} ≥ 10.` : `We need 1 ≤ |a| < 10, whereas a ＝ ${k} ≥ 10.`}</span>,
        };
      }
      case 3: {
        const a = pickRandom([2, 3, 4]);
        const b = pickRandom([5, 6, 8]);
        const exp = pickRandom([3, 4]);
        const ans = Math.round(a * Math.pow(10, exp) + b * Math.pow(10, exp - 1));
        return {
          sig: `c2e1_3_${a}_${b}_${exp}`,
          title: isEl ? 'Από Τυποποιημένη σε Κανονική Μορφή' : 'From Scientific to Standard Form',
          prompt: <span>{isEl ? 'Γράψτε ως κανονικό αριθμό:' : 'Write as a standard number:'} {isEl ? `${a},${b}` : `${a}.${b}`} · 10<sup>{exp}</sup></span>,
          type: 'input',
          correct: ans,
          explanation: <span>{isEl ? `${a},${b}` : `${a}.${b}`} · {Math.pow(10, exp).toLocaleString(locCode)} ＝ {ans.toLocaleString(locCode)}.</span>,
        };
      }
      case 4: {
        const d = pickRandom([3, 5, 8]);
        const correctOpt = { key: `${d}*10^-4`, label: `${d} · 10^-4`, node: <span>{d} · 10<sup>-4</sup></span> };
        return {
          sig: `c2e1_4_${d}`,
          title: isEl ? 'Τυποποιημένη Μορφή Δεκαδικού' : 'Scientific Notation of a Decimal',
          prompt: isEl
            ? `Ποια είναι η τυποποιημένη μορφή του αριθμού 0,000${d};`
            : `What is the scientific notation of 0.000${d}?`,
          type: 'mcq',
          correct: correctOpt.key,
          options: ensureFourUniqueOptions(correctOpt, [
            { key: `${d}*10^-3`, label: `${d} · 10^-3`, node: <span>{d} · 10<sup>-3</sup></span> },
            { key: `${d}*10^-5`, label: `${d} · 10^-5`, node: <span>{d} · 10<sup>-5</sup></span> },
            { key: `${d}*10^4`, label: `${d} · 10^4`, node: <span>{d} · 10<sup>4</sup></span> },
            { key: `0.${d}*10^-3`, label: `0,${d} · 10^-3`, node: <span>{isEl ? `0,${d}` : `0.${d}`} · 10<sup>-3</sup></span> },
          ]),
          explanation: <span>{isEl ? `0,000${d}` : `0.000${d}`} ＝ {d} · 10<sup>-4</sup>.</span>,
        };
      }
      case 5: {
        return {
          sig: 'c2e1_5',
          title: isEl ? 'Συντελεστής Μικρότερος του 1' : 'Coefficient Less Than 1',
          prompt: <span>{isEl ? 'Ο αριθμός' : 'Is'} 0,85 · 10<sup>6</sup> {isEl ? 'είναι σε τυποποιημένη μορφή;' : 'written in scientific notation?'}</span>,
          type: 'tf',
          correct: isEl ? 'Λάθος' : 'False',
          options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
          explanation: <span>{isEl ? 'Ο συντελεστής 0,85 είναι < 1 (σωστή μορφή: 8,5 · 10⁵).' : '0.85 is < 1 (proper form: 8.5 · 10⁵).'}</span>,
        };
      }
      case 6: {
        const m = pickRandom([4, 5, 6]);
        const n = pickRandom([2, 3]);
        const ans = m + n;
        return {
          sig: `c2e1_6_${m}_${n}`,
          title: isEl ? 'Πολλαπλασιασμός σε Τυποποιημένη Μορφή' : 'Multiplying in Scientific Notation',
          prompt: <span>(2 · 10<sup>{m}</sup>) · (3 · 10<sup>{n}</sup>) ＝ 6 · 10<sup>ν</sup>. {isEl ? 'Ποιος είναι ο εκθέτης ν;' : 'What is ν?'}</span>,
          type: 'input',
          correct: ans,
          explanation: <span>(2 · 3) · 10<sup>{m} + {n}</sup> ＝ 6 · 10<sup>{ans}</sup>.</span>,
        };
      }
      case 7: {
        const correctOpt = { key: '4.5*10^7', label: '4,5 · 10^7', node: <span>{isEl ? '4,5' : '4.5'} · 10<sup>7</sup></span> };
        return {
          sig: 'c2e1_7',
          title: isEl ? 'Μεγάλα Μεγέθη' : 'Large Quantities',
          prompt: isEl
            ? 'Ο πληθυσμός μιας χώρας είναι 45.000.000 κάτοικοι. Σε τυποποιημένη μορφή γράφεται:'
            : 'A population of 45,000,000 in scientific notation is:',
          type: 'mcq',
          correct: correctOpt.key,
          options: ensureFourUniqueOptions(correctOpt, [
            { key: '45*10^6', label: '45 · 10^6', node: <span>45 · 10<sup>6</sup></span> },
            { key: '4.5*10^6', label: '4,5 · 10^6', node: <span>{isEl ? '4,5' : '4.5'} · 10<sup>6</sup></span> },
            { key: '4.5*10^8', label: '4,5 · 10^8', node: <span>{isEl ? '4,5' : '4.5'} · 10<sup>8</sup></span> },
            { key: '0.45*10^8', label: '0,45 · 10^8', node: <span>{isEl ? '0,45' : '0.45'} · 10<sup>8</sup></span> },
          ]),
          explanation: <span>45.000.000 ＝ {isEl ? '4,5' : '4.5'} · 10<sup>7</sup>.</span>,
        };
      }
      case 8: {
        return {
          sig: 'c2e1_8',
          title: isEl ? 'Ισοδυναμία Μορφών' : 'Equivalence of Forms',
          prompt: <span>{isEl ? 'Ισχύει ότι' : 'Does it hold that'} 5 · 10<sup>-2</sup> ＝ {isEl ? '0,05' : '0.05'};</span>,
          type: 'tf',
          correct: isEl ? 'Σωστό' : 'True',
          options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
          explanation: <span>5 · 10<sup>-2</sup> ＝ <Frac num="5" den="100" /> ＝ {isEl ? '0,05' : '0.05'}.</span>,
        };
      }
      default: {
        const k = pickRandom([4, 6, 8]);
        const ans = k / 2;
        return {
          sig: `c2e1_9_${k}`,
          title: isEl ? 'Διαίρεση σε Τυποποιημένη Μορφή' : 'Dividing in Scientific Notation',
          prompt: (
            <span className="inline-flex items-center">
              <Frac num={<span>{k} · 10<sup>8</sup></span>} den={<span>2 · 10<sup>5</sup></span>} /> ＝ α · 10<sup>3</sup>. {isEl ? 'Ποιος είναι ο συντελεστής α;' : 'What is α?'}
            </span>
          ),
          type: 'input',
          correct: ans,
          explanation: <span><Frac num={String(k)} den="2" /> · 10<sup>8 - 5</sup> ＝ {ans} · 10<sup>3</sup>.</span>,
        };
      }
    }
  };

  // ΚΕΦ. 2 - ΑΣΚΗΣΗ 2 (10 παραλλαγές)
  const buildCh2Ex2 = (mode) => {
    switch (mode) {
      case 0: {
        const correctOpt = { key: '3.2*10^6', label: '3,2 · 10^6', node: <span>{isEl ? '3,2' : '3.2'} · 10<sup>6</sup></span> };
        return {
          sig: 'c2e2_0',
          title: isEl ? 'Σύγκριση Αριθμών Τυποποιημένης Μορφής' : 'Comparing Numbers in Scientific Notation',
          prompt: isEl
            ? 'Ποιος από τους παρακάτω αριθμούς είναι μεγαλύτερος;'
            : 'Which of the following numbers is the greatest?',
          type: 'mcq',
          correct: correctOpt.key,
          options: ensureFourUniqueOptions(correctOpt, [
            { key: '9.8*10^5', label: '9,8 · 10^5', node: <span>{isEl ? '9,8' : '9.8'} · 10<sup>5</sup></span> },
            { key: '2.9*10^6', label: '2,9 · 10^6', node: <span>{isEl ? '2,9' : '2.9'} · 10<sup>6</sup></span> },
            { key: '8.5*10^4', label: '8,5 · 10^4', node: <span>{isEl ? '8,5' : '8.5'} · 10<sup>4</sup></span> },
            { key: '1.1*10^6', label: '1,1 · 10^6', node: <span>{isEl ? '1,1' : '1.1'} · 10<sup>6</sup></span> },
          ]),
          explanation: <span>{isEl ? 'Συγκρίνουμε πρώτα τους εκθέτες του 10 (10⁶ > 10⁵) και έπειτα 3,2 > 2,9.' : 'Compare powers of 10 first (10⁶ > 10⁵), then 3.2 > 2.9.'}</span>,
        };
      }
      case 1: {
        const a = pickRandom([4, 5, 6]);
        const b = pickRandom([3, 4]);
        const prod = a * b;
        const exp = pickRandom([4, 5]);
        const finalExp = exp + 1;
        return {
          sig: `c2e2_1_${a}_${b}_${exp}`,
          title: isEl ? 'Προσαρμογή Εκθέτη μετά από Πολλαπλασιασμό' : 'Adjusting Exponent After Multiplication',
          prompt: (
            <span>
              ({a} · 10<sup>{exp}</sup>) · {b} ＝ {isEl ? String(prod / 10).replace('.', ',') : prod / 10} · 10<sup>ν</sup>. {isEl ? 'Ποιος είναι ο εκθέτης ν;' : 'What is ν?'}
            </span>
          ),
          type: 'input',
          correct: finalExp,
          explanation: <span>{prod} · 10<sup>{exp}</sup> ＝ {isEl ? String(prod / 10).replace('.', ',') : prod / 10} · 10<sup>{finalExp}</sup>.</span>,
        };
      }
      case 2: {
        return {
          sig: 'c2e2_2',
          title: isEl ? 'Σύγκριση Πολύ Μικρών Αριθμών' : 'Comparing Very Small Numbers',
          prompt: <span>{isEl ? 'Ισχύει ότι' : 'Does it hold that'} 2 · 10<sup>-4</sup> &lt; 3 · 10<sup>-5</sup>;</span>,
          type: 'tf',
          correct: isEl ? 'Λάθος' : 'False',
          options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
          explanation: <span>{isEl ? 'Επειδή -4 > -5, ισχύει 2 · 10⁻⁴ > 3 · 10⁻⁵.' : 'Since -4 > -5, we have 2 · 10⁻⁴ > 3 · 10⁻⁵.'}</span>,
        };
      }
      case 3: {
        const m = pickRandom([5, 6, 7]);
        const ans = 2 * m + 1;
        const correctOpt = { key: `1.6*10^${ans}`, label: `1,6 · 10^${ans}`, node: <span>{isEl ? '1,6' : '1.6'} · 10<sup>{ans}</sup></span> };
        return {
          sig: `c2e2_3_${m}`,
          title: isEl ? 'Ύψωση Τυποποιημένης Μορφής στο Τετράγωνο' : 'Squaring Scientific Notation',
          prompt: <span>{isEl ? 'Η δύναμη' : 'The power'} (4 · 10<sup>{m}</sup>)<sup>2</sup> {isEl ? 'σε τυποποιημένη μορφή είναι:' : 'in scientific notation is:'}</span>,
          type: 'mcq',
          correct: correctOpt.key,
          options: ensureFourUniqueOptions(correctOpt, [
            { key: `16*10^${2 * m}`, label: `16 · 10^${2 * m}`, node: <span>16 · 10<sup>{2 * m}</sup></span> },
            { key: `1.6*10^${2 * m}`, label: `1,6 · 10^${2 * m}`, node: <span>{isEl ? '1,6' : '1.6'} · 10<sup>{2 * m}</sup></span> },
            { key: `8*10^${2 * m}`, label: `8 · 10^${2 * m}`, node: <span>8 · 10<sup>{2 * m}</sup></span> },
            { key: `1.6*10^${m + 2}`, label: `1,6 · 10^${m + 2}`, node: <span>{isEl ? '1,6' : '1.6'} · 10<sup>{m + 2}</sup></span> },
          ]),
          explanation: <span>16 · 10<sup>{2 * m}</sup> ＝ {isEl ? '1,6' : '1.6'} · 10<sup>{ans}</sup>.</span>,
        };
      }
      case 4: {
        const k = pickRandom([3, 4, 5]);
        return {
          sig: `c2e2_4_${k}`,
          title: isEl ? 'Γινόμενο με Αντίθετους Εκθέτες του 10' : 'Product with Opposite Exponents of 10',
          prompt: <span>{isEl ? 'Υπολογίστε:' : 'Calculate:'} ({isEl ? '2,5' : '2.5'} · 10<sup>{k}</sup>) · (4 · 10<sup>-{k}</sup>)</span>,
          type: 'input',
          correct: 10,
          explanation: <span>({isEl ? '2,5' : '2.5'} · 4) · 10<sup>0</sup> ＝ 10 · 1 ＝ 10.</span>,
        };
      }
      case 5: {
        const a = pickRandom([2, 3, 4]);
        const b = pickRandom([5, 6]);
        return {
          sig: `c2e2_5_${a}_${b}`,
          title: isEl ? 'Άθροισμα Ίδιων Δυνάμεων του 10' : 'Adding Like Powers of 10',
          prompt: <span>({a} · 10<sup>6</sup>) ＋ ({b} · 10<sup>6</sup>) ＝ α · 10<sup>6</sup>. {isEl ? 'Ποιος είναι ο α;' : 'What is α?'}</span>,
          type: 'input',
          correct: a + b,
          explanation: <span>({a} ＋ {b}) · 10<sup>6</sup> ＝ {a + b} · 10<sup>6</sup>.</span>,
        };
      }
      case 6: {
        const correctOpt = { key: '7.5*10^-6', label: '7,5 · 10^-6 m', node: <span>{isEl ? '7,5' : '7.5'} · 10<sup>-6</sup> m</span> };
        return {
          sig: 'c2e2_6',
          title: isEl ? 'Μικροσκοπικά Μεγέθη' : 'Microscopic Dimensions',
          prompt: isEl
            ? 'Η διάμετρος ενός κυττάρου είναι 0,0000075 m. Σε τυποποιημένη μορφή γράφεται:'
            : 'A cell diameter of 0.0000075 m in scientific notation is:',
          type: 'mcq',
          correct: correctOpt.key,
          options: ensureFourUniqueOptions(correctOpt, [
            { key: '7.5*10^-5', label: '7,5 · 10^-5 m', node: <span>{isEl ? '7,5' : '7.5'} · 10<sup>-5</sup> m</span> },
            { key: '75*10^-7', label: '75 · 10^-7 m', node: <span>75 · 10<sup>-7</sup> m</span> },
            { key: '7.5*10^-7', label: '7,5 · 10^-7 m', node: <span>{isEl ? '7,5' : '7.5'} · 10<sup>-7</sup> m</span> },
            { key: '7.5*10^6', label: '7,5 · 10^6 m', node: <span>{isEl ? '7,5' : '7.5'} · 10<sup>6</sup> m</span> },
          ]),
          explanation: <span>{isEl ? '0,0000075 m ＝ 7,5 · 10⁻⁶ m.' : '0.0000075 m ＝ 7.5 · 10⁻⁶ m.'}</span>,
        };
      }
      case 7: {
        return {
          sig: 'c2e2_7',
          title: isEl ? 'Αρνητικοί Αριθμοί σε Τυποποιημένη Μορφή' : 'Negative Numbers in Scientific Notation',
          prompt: <span>{isEl ? 'Ο αριθμός' : 'Is'} -{isEl ? '3,4' : '3.4'} · 10<sup>5</sup> {isEl ? 'είναι σε τυποποιημένη μορφή;' : 'in scientific notation?'}</span>,
          type: 'tf',
          correct: isEl ? 'Σωστό' : 'True',
          options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
          explanation: <span>{isEl ? 'Ισχύει 1 ≤ |-3,4| < 10, άρα είναι σωστή τυποποιημένη μορφή.' : '1 ≤ |-3.4| < 10 holds, so it is valid scientific notation.'}</span>,
        };
      }
      case 8: {
        const m = pickRandom([4, 6, 8]);
        return {
          sig: `c2e2_8_${m}`,
          title: isEl ? 'Τετραγωνική Ρίζα Τυποποιημένης Μορφής' : 'Square Root of Scientific Notation',
          prompt: <span><Radical>9 · 10<sup>{m}</sup></Radical> ＝ 3 · 10<sup>ν</sup>. {isEl ? 'Ποιος είναι ο ν;' : 'What is ν?'}</span>,
          type: 'input',
          correct: m / 2,
          explanation: <span><Radical>9</Radical> · <Radical>10<sup>{m}</sup></Radical> ＝ 3 · 10<sup>{m / 2}</sup>.</span>,
        };
      }
      default: {
        const correctOpt = { key: '5*10^4', label: '5 · 10^4', node: <span>5 · 10<sup>4</sup></span> };
        return {
          sig: 'c2e2_9',
          title: isEl ? 'Το Μισό Δύναμης του 10' : 'Half of a Power of 10',
          prompt: isEl
            ? 'Το μισό του αριθμού 10⁵ σε τυποποιημένη μορφή είναι:'
            : 'Half of 10⁵ in scientific notation is:',
          type: 'mcq',
          correct: correctOpt.key,
          options: ensureFourUniqueOptions(correctOpt, [
            { key: '10^2.5', label: '10^2,5', node: <span>10<sup>{isEl ? '2,5' : '2.5'}</sup></span> },
            { key: '5*10^5', label: '5 · 10^5', node: <span>5 · 10<sup>5</sup></span> },
            { key: '0.5*10^5', label: '0,5 · 10^5', node: <span>{isEl ? '0,5' : '0.5'} · 10<sup>5</sup></span> },
            { key: '2*10^4', label: '2 · 10^4', node: <span>2 · 10<sup>4</sup></span> },
          ]),
          explanation: <span><Frac num="1" den="2" /> · 10<sup>5</sup> ＝ {isEl ? '0,5' : '0.5'} · 10<sup>5</sup> ＝ 5 · 10<sup>4</sup>.</span>,
        };
      }
    }
  };

  // ΚΕΦ. 3 - ΑΣΚΗΣΗ 1 (10 παραλλαγές)
  const buildCh3Ex1 = (mode) => {
    switch (mode) {
      case 0: {
        const a = pickRandom([2, 3, 4]);
        const b = pickRandom([3, 4, 5]);
        const ans = a + b * 4;
        return {
          sig: `c3e1_0_${a}_${b}`,
          title: isEl ? 'Προτεραιότητα Πράξεων με Δύναμη' : 'Order of Operations with Power',
          prompt: <span>{isEl ? 'Υπολογίστε:' : 'Calculate:'} {a} ＋ {b} · (-2)<sup>2</sup></span>,
          type: 'input',
          correct: ans,
          explanation: <span>(-2)<sup>2</sup> ＝ 4, μετά {b} · 4 ＝ {b * 4}, και τέλος {a} ＋ {b * 4} ＝ {ans}.</span>,
        };
      }
      case 1: {
        const a = pickRandom([10, 12, 15]);
        return {
          sig: `c3e1_1_${a}`,
          title: isEl ? 'Αφαίρεση με Δύναμη' : 'Subtraction with Power',
          prompt: <span>{isEl ? 'Υπολογίστε:' : 'Calculate:'} {a} － 3<sup>2</sup></span>,
          type: 'input',
          correct: a - 9,
          explanation: <span>{a} － 9 ＝ {a - 9}.</span>,
        };
      }
      case 2: {
        const b = pickRandom([2, 3]);
        const c = pickRandom([4, 5]);
        const ans = b * (-c) - 1;
        const correctOpt = { key: String(ans), label: String(ans), node: String(ans) };
        return {
          sig: `c3e1_2_${b}_${c}`,
          title: isEl ? 'Αριθμητική Παράσταση με Παρενθέσεις' : 'Expression with Parentheses',
          prompt: <span>{isEl ? 'Η τιμή της παράστασης' : 'The value of'} {b} · (1 － {c + 1}) － 7<sup>0</sup> {isEl ? 'είναι:' : 'is:'}</span>,
          type: 'mcq',
          correct: correctOpt.key,
          options: ensureFourUniqueOptions(correctOpt, [
            { key: String(ans + 2), label: String(ans + 2), node: String(ans + 2) },
            { key: String(-ans), label: String(-ans), node: String(-ans) },
            { key: String(b * c - 1), label: String(b * c - 1), node: String(b * c - 1) },
            { key: String(ans - 6), label: String(ans - 6), node: String(ans - 6) },
          ]),
          explanation: <span>{b} · (-{c}) － 1 ＝ {-b * c} － 1 ＝ {ans}.</span>,
        };
      }
      case 3: {
        return {
          sig: 'c3e1_3',
          title: isEl ? 'Κανόνας Προτεραιότητας' : 'Order of Operations Rule',
          prompt: <span>{isEl ? 'Στην παράσταση' : 'In'} 2 ＋ 3 · 4<sup>2</sup>, {isEl ? 'εκτελούμε πρώτα την πρόσθεση 2 ＋ 3;' : 'do we perform 2 ＋ 3 first?'}</span>,
          type: 'tf',
          correct: isEl ? 'Λάθος' : 'False',
          options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
          explanation: <span>{isEl ? 'Πρώτα υπολογίζονται οι δυνάμεις (4² ＝ 16), μετά οι πολλαπλασιασμοί και τελευταίες οι προσθέσεις.' : 'Powers first, then multiplication, addition last.'}</span>,
        };
      }
      case 4: {
        const k = pickRandom([2, 3, 4]);
        const ans = Math.pow(2, k) - 4;
        return {
          sig: `c3e1_4_${k}`,
          title: isEl ? 'Παράσταση με Αρνητικό & Θετικό Εκθέτη' : 'Expression with Negative & Positive Exponents',
          prompt: (
            <span className="inline-flex items-center">
              {isEl ? 'Υπολογίστε:' : 'Calculate:'} (<Frac num="1" den="2" />)<sup>-{k}</sup> － (-2)<sup>2</sup>
            </span>
          ),
          type: 'input',
          correct: ans,
          explanation: <span>2<sup>{k}</sup> － 4 ＝ {Math.pow(2, k)} － 4 ＝ {ans}.</span>,
        };
      }
      case 5: {
        const a = pickRandom([4, 6, 8]);
        const ans = a / 2 - 5;
        const correctOpt = { key: String(ans), label: String(ans), node: String(ans) };
        return {
          sig: `c3e1_5_${a}`,
          title: isEl ? 'Κλάσμα & Δύναμη του -1' : 'Fraction & Power of -1',
          prompt: (
            <span className="inline-flex items-center">
              {isEl ? 'Η τιμή της παράστασης' : 'The value of'} <Frac num={String(a)} den={<span>2<sup>1</sup></span>} /> － 5 · (-1)<sup>4</sup> {isEl ? 'είναι:' : 'is:'}
            </span>
          ),
          type: 'mcq',
          correct: correctOpt.key,
          options: ensureFourUniqueOptions(correctOpt, [
            { key: String(ans + 10), label: String(ans + 10), node: String(ans + 10) },
            { key: String(a - 5), label: String(a - 5), node: String(a - 5) },
            { key: String(-ans), label: String(-ans), node: String(-ans) },
            { key: '0', label: '0', node: '0' },
          ]),
          explanation: <span>{a / 2} － 5 · 1 ＝ {ans}.</span>,
        };
      }
      case 6: {
        const n = pickRandom([3, 5, 7]);
        return {
          sig: `c3e1_6_${n}`,
          title: isEl ? 'Δυνάμεις του -1' : 'Powers of -1',
          prompt: <span>{isEl ? 'Ισχύει ότι' : 'Does'} (-1)<sup>{n}</sup> ＋ (-1)<sup>{n + 1}</sup> ＝ 0;</span>,
          type: 'tf',
          correct: isEl ? 'Σωστό' : 'True',
          options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
          explanation: <span>-1 ＋ 1 ＝ 0.</span>,
        };
      }
      case 7: {
        const x = pickRandom([2, 3, 4]);
        const ans = 2 * x * x - 3 * x + 1;
        return {
          sig: `c3e1_7_${x}`,
          title: isEl ? 'Αριθμητική Τιμή Αλγεβρικής Παράστασης' : 'Evaluating an Algebraic Expression',
          prompt: isEl
            ? `Υπολογίστε την τιμή της παράστασης 2x² － 3x ＋ 1 για x ＝ ${x}:`
            : `Evaluate 2x² － 3x ＋ 1 for x ＝ ${x}:`,
          type: 'input',
          correct: ans,
          explanation: `2 · ${x}² － 3 · ${x} ＋ 1 ＝ ${2 * x * x} － ${3 * x} ＋ 1 ＝ ${ans}.`,
        };
      }
      case 8: {
        const mult = pickRandom([3, 5, 7]);
        const correctOpt = { key: String(mult), label: String(mult), node: String(mult) };
        return {
          sig: `c3e1_8_${mult}`,
          title: isEl ? 'Άθροισμα Αρνητικών Δυνάμεων' : 'Sum of Negative Powers',
          prompt: <span>{isEl ? 'Η τιμή της παράστασης' : 'The value of'} {mult} · (2<sup>-1</sup> ＋ 2<sup>-1</sup>) {isEl ? 'είναι:' : 'is:'}</span>,
          type: 'mcq',
          correct: correctOpt.key,
          options: ensureFourUniqueOptions(correctOpt, [
            { key: String(mult * 2), label: String(mult * 2), node: String(mult * 2) },
            { key: String(mult * 4), label: String(mult * 4), node: String(mult * 4) },
            { key: `${mult}/2`, label: `${mult}/2`, node: <Frac num={String(mult)} den="2" /> },
            { key: '1', label: '1', node: '1' },
          ]),
          explanation: <span>{mult} · (<Frac num="1" den="2" /> ＋ <Frac num="1" den="2" />) ＝ {mult} · 1 ＝ {mult}.</span>,
        };
      }
      default: {
        const a = pickRandom([5, 7, 9]);
        return {
          sig: `c3e1_9_${a}`,
          title: isEl ? 'Πρόσθεση με Κύβο Αρνητικού' : 'Adding Cube of a Negative',
          prompt: <span>{isEl ? 'Υπολογίστε:' : 'Calculate:'} {a} ＋ (-2)<sup>3</sup></span>,
          type: 'input',
          correct: a - 8,
          explanation: <span>{a} ＋ (-8) ＝ {a - 8}.</span>,
        };
      }
    }
  };

  // ΚΕΦ. 3 - ΑΣΚΗΣΗ 2 (10 παραλλαγές)
  const buildCh3Ex2 = (mode) => {
    switch (mode) {
      case 0: {
        const a = pickRandom([3, 4, 5]);
        const ans = a * 2 + 1;
        return {
          sig: `c3e2_0_${a}`,
          title: isEl ? 'Κλασματική Αριθμητική Παράσταση' : 'Fractional Numerical Expression',
          prompt: (
            <span className="inline-flex items-center">
              {isEl ? 'Υπολογίστε:' : 'Calculate:'} <Frac num={<span>{a} · 2<sup>3</sup></span>} den="4" /> ＋ (-1)<sup>6</sup>
            </span>
          ),
          type: 'input',
          correct: ans,
          explanation: <span><Frac num={String(a * 8)} den="4" /> ＋ 1 ＝ {a * 2} ＋ 1 ＝ {ans}.</span>,
        };
      }
      case 1: {
        const k = pickRandom([2, 3, 4]);
        const correctOpt = { key: '-8', label: '-8', node: '-8' };
        return {
          sig: `c3e2_1_${k}`,
          title: isEl ? 'Συνδυασμός Ιδιοτήτων Δυνάμεων' : 'Combining Exponent Properties',
          prompt: (
            <span className="inline-flex items-center">
              {isEl ? 'Η τιμή της παράστασης' : 'The value of'} (<Frac num="2" den="3" />)<sup>0</sup> － <Frac num={<span>3<sup>{k + 2}</sup></span>} den={<span>3<sup>{k}</sup></span>} /> {isEl ? 'είναι:' : 'is:'}
            </span>
          ),
          type: 'mcq',
          correct: correctOpt.key,
          options: ensureFourUniqueOptions(correctOpt, [
            { key: '8', label: '8', node: '8' },
            { key: '-9', label: '-9', node: '-9' },
            { key: '-5', label: '-5', node: '-5' },
            { key: '10', label: '10', node: '10' },
          ]),
          explanation: <span>1 － 3<sup>2</sup> ＝ 1 － 9 ＝ -8.</span>,
        };
      }
      case 2: {
        const x = pickRandom([-2, -3]);
        const ans = x * x + 2 * x;
        return {
          sig: `c3e2_2_${x}`,
          title: isEl ? 'Αντικατάσταση Αρνητικού Αριθμού' : 'Substituting a Negative Number',
          prompt: isEl
            ? `Υπολογίστε την τιμή της παράστασης x² ＋ 2x για x ＝ ${x}:`
            : `Evaluate x² ＋ 2x for x ＝ ${x}:`,
          type: 'input',
          correct: ans,
          explanation: `(${x})² ＋ 2 · (${x}) ＝ ${x * x} ＋ (${2 * x}) ＝ ${ans}.`,
        };
      }
      case 3: {
        return {
          sig: 'c3e2_3',
          title: isEl ? 'Απλοποίηση Κλάσματος' : 'Simplifying a Fraction',
          prompt: (
            <span className="inline-flex items-center">
              {isEl ? 'Ισχύει ότι' : 'Does'} <Frac num={<span>2<sup>3</sup> ＋ 2<sup>3</sup></span>} den={<span>2<sup>3</sup></span>} /> ＝ 2;
            </span>
          ),
          type: 'tf',
          correct: isEl ? 'Σωστό' : 'True',
          options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
          explanation: <span><Frac num="8 ＋ 8" den="8" /> ＝ <Frac num="16" den="8" /> ＝ 2.</span>,
        };
      }
      case 4: {
        const a = pickRandom([2, 3, 5]);
        const ans = a * 4 - 3;
        return {
          sig: `c3e2_4_${a}`,
          title: isEl ? 'Παράσταση με Αντίστροφο Κλάσματος' : 'Expression with Inverted Fraction',
          prompt: (
            <span className="inline-flex items-center">
              {isEl ? 'Υπολογίστε:' : 'Calculate:'} {a} · (<Frac num="1" den="2" />)<sup>-2</sup> － 3 · (-1)<sup>8</sup>
            </span>
          ),
          type: 'input',
          correct: ans,
          explanation: <span>{a} · 4 － 3 · 1 ＝ {ans}.</span>,
        };
      }
      case 5: {
        const b = pickRandom([4, 5, 6]);
        const ans = 2 - b;
        const correctOpt = { key: String(ans), label: String(ans), node: String(ans) };
        return {
          sig: `c3e2_5_${b}`,
          title: isEl ? 'Διαίρεση Αρνητικών & Αφαίρεση' : 'Dividing Negatives & Subtraction',
          prompt: (
            <span className="inline-flex items-center">
              {isEl ? 'Η τιμή της παράστασης' : 'The value of'} <Frac num={<span>(-2)<sup>3</sup></span>} den="-4" /> － {b} {isEl ? 'είναι:' : 'is:'}
            </span>
          ),
          type: 'mcq',
          correct: correctOpt.key,
          options: ensureFourUniqueOptions(correctOpt, [
            { key: String(-2 - b), label: String(-2 - b), node: String(-2 - b) },
            { key: String(2 + b), label: String(2 + b), node: String(2 + b) },
            { key: String(b - 2), label: String(b - 2), node: String(b - 2) },
            { key: '0', label: '0', node: '0' },
          ]),
          explanation: <span><Frac num="-8" den="-4" /> － {b} ＝ 2 － {b} ＝ {ans}.</span>,
        };
      }
      case 6: {
        const c = pickRandom([3, 4, 5]);
        return {
          sig: `c3e2_6_${c}`,
          title: isEl ? 'Αντίθετες Δυνάμεις' : 'Opposite Powers',
          prompt: <span>-{c}<sup>2</sup> ＋ {c}<sup>2</sup> ＝ 0;</span>,
          type: 'tf',
          correct: isEl ? 'Σωστό' : 'True',
          options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
          explanation: <span>-{c * c} ＋ {c * c} ＝ 0.</span>,
        };
      }
      case 7: {
        return {
          sig: 'c3e2_7',
          title: isEl ? 'Αριθμητική Παράσταση' : 'Numerical Expression',
          prompt: (
            <span className="inline-flex items-center">
              {isEl ? 'Υπολογίστε:' : 'Calculate:'} <Frac num={<span>3<sup>2</sup> ＋ 2<sup>0</sup></span>} den="2" />
            </span>
          ),
          type: 'input',
          correct: 5,
          explanation: <span><Frac num="9 ＋ 1" den="2" /> ＝ <Frac num="10" den="2" /> ＝ 5.</span>,
        };
      }
      case 8: {
        const k = pickRandom([2, 3]);
        const ans = Math.pow(2, k) + 9;
        const correctOpt = { key: String(ans), label: String(ans), node: String(ans) };
        return {
          sig: `c3e2_8_${k}`,
          title: isEl ? 'Άθροισμα Αρνητικών Εκθετών Κλασμάτων' : 'Sum of Negative Fraction Exponents',
          prompt: (
            <span className="inline-flex items-center">
              {isEl ? 'Η τιμή της παράστασης' : 'The value of'} (<Frac num="1" den="2" />)<sup>-{k}</sup> ＋ (<Frac num="1" den="3" />)<sup>-2</sup> {isEl ? 'είναι:' : 'is:'}
            </span>
          ),
          type: 'mcq',
          correct: correctOpt.key,
          options: ensureFourUniqueOptions(correctOpt, [
            { key: String(ans - 2), label: String(ans - 2), node: String(ans - 2) },
            { key: String(-ans), label: String(-ans), node: String(-ans) },
            { key: String(2 * k + 6), label: String(2 * k + 6), node: String(2 * k + 6) },
            { key: '1', label: '1', node: '1' },
          ]),
          explanation: <span>2<sup>{k}</sup> ＋ 3<sup>2</sup> ＝ {Math.pow(2, k)} ＋ 9 ＝ {ans}.</span>,
        };
      }
      default: {
        const a = pickRandom([2, 3, 4]);
        return {
          sig: `c3e2_9_${a}`,
          title: isEl ? 'Υπολογισμός Παράστασης' : 'Evaluating Expression',
          prompt: <span>{isEl ? 'Υπολογίστε:' : 'Calculate:'} {a} · (-3)<sup>2</sup> － 2<sup>2</sup></span>,
          type: 'input',
          correct: a * 9 - 4,
          explanation: <span>{a} · 9 － 4 ＝ {a * 9 - 4}.</span>,
        };
      }
    }
  };

  // ΚΕΦ. 4 - ΑΣΚΗΣΗ 1 (10 παραλλαγές)
  const buildCh4Ex1 = (mode) => {
    switch (mode) {
      case 0: {
        const r = pickRandom([6, 7, 8, 9, 11, 12]);
        const sq = r * r;
        return {
          sig: `c4e1_0_${sq}`,
          title: isEl ? 'Τετραγωνική Ρίζα Τέλειου Τετραγώνου' : 'Square Root of a Perfect Square',
          prompt: <span>{isEl ? 'Υπολογίστε την τετραγωνική ρίζα:' : 'Calculate the square root:'} <Radical>{sq}</Radical></span>,
          type: 'input',
          correct: r,
          explanation: <span><Radical>{sq}</Radical> ＝ {r}, {isEl ? `επειδή ${r} > 0 και ${r}² ＝ ${sq}.` : `since ${r} > 0 and ${r}² ＝ ${sq}.`}</span>,
        };
      }
      case 1: {
        const num = pickRandom([2, 3, 5]);
        const den = pickRandom([4, 7, 9]);
        const correctOpt = { key: `${num}/${den}`, label: `${num}/${den}`, node: <Frac num={String(num)} den={String(den)} /> };
        return {
          sig: `c4e1_1_${num}_${den}`,
          title: isEl ? 'Τετραγωνική Ρίζα Κλάσματος' : 'Square Root of a Fraction',
          prompt: (
            <span className="inline-flex items-center">
              {isEl ? 'Η τιμή της ρίζας' : 'The value of'} <Radical><Frac num={String(num * num)} den={String(den * den)} /></Radical> {isEl ? 'είναι:' : 'is:'}
            </span>
          ),
          type: 'mcq',
          correct: correctOpt.key,
          options: ensureFourUniqueOptions(correctOpt, [
            { key: `${num * num}/${den}`, label: `${num * num}/${den}`, node: <Frac num={String(num * num)} den={String(den)} /> },
            { key: `${num}/${den * den}`, label: `${num}/${den * den}`, node: <Frac num={String(num)} den={String(den * den)} /> },
            { key: `${den}/${num}`, label: `${den}/${num}`, node: <Frac num={String(den)} den={String(num)} /> },
            { key: `-${num}/${den}`, label: `-${num}/${den}`, node: <span>-<Frac num={String(num)} den={String(den)} /></span> },
          ]),
          explanation: (
            <span>
              <Radical><Frac num={String(num * num)} den={String(den * den)} /></Radical> ＝ <Frac num={<Radical>{num * num}</Radical>} den={<Radical>{den * den}</Radical>} /> ＝ <Frac num={String(num)} den={String(den)} />.
            </span>
          ),
        };
      }
      case 2: {
        const k = pickRandom([5, 7, 11]);
        return {
          sig: `c4e1_2_${k}`,
          title: isEl ? 'Ύπαρξη Τετραγωνικής Ρίζας' : 'Existence of Square Root',
          prompt: <span>{isEl ? 'Η ρίζα' : 'Is'} <Radical>-{k * k}</Radical> {isEl ? 'ορίζεται στους πραγματικούς αριθμούς και ισούται με -' + k + ';' : 'defined in ℝ and equal to -' + k + '?'}</span>,
          type: 'tf',
          correct: isEl ? 'Λάθος' : 'False',
          options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
          explanation: <span>{isEl ? 'Δεν ορίζεται τετραγωνική ρίζα αρνητικού αριθμού στους πραγματικούς αριθμούς.' : 'Square root of a negative number is undefined in ℝ.'}</span>,
        };
      }
      case 3: {
        const k = pickRandom([3, 5, 6, 8]);
        return {
          sig: `c4e1_3_${k}`,
          title: isEl ? 'Τετράγωνο Τετραγωνικής Ρίζας' : 'Square of a Square Root',
          prompt: <span>{isEl ? 'Υπολογίστε:' : 'Calculate:'} (<Radical>{k}</Radical>)<sup>2</sup></span>,
          type: 'input',
          correct: k,
          explanation: <span>(<Radical>{k}</Radical>)<sup>2</sup> ＝ {k}.</span>,
        };
      }
      case 4: {
        const d = pickRandom([2, 3, 4, 5]);
        const decStr = isEl ? `0,0${d * d}` : `0.0${d * d}`;
        return {
          sig: `c4e1_4_${d}`,
          title: isEl ? 'Τετραγωνική Ρίζα Δεκαδικού' : 'Square Root of a Decimal',
          prompt: <span>{isEl ? 'Υπολογίστε τη ρίζα:' : 'Calculate:'} <Radical>{decStr}</Radical></span>,
          type: 'input',
          correct: Number(`0.${d}`),
          explanation: <span><Radical>{decStr}</Radical> ＝ {isEl ? `0,${d}` : `0.${d}`}.</span>,
        };
      }
      case 5: {
        const a = pickRandom([4, 9, 16]);
        const b = pickRandom([25, 36, 49]);
        const ans = Math.sqrt(a) * Math.sqrt(b);
        const correctOpt = { key: String(ans), label: String(ans), node: String(ans) };
        return {
          sig: `c4e1_5_${a}_${b}`,
          title: isEl ? 'Ρίζα Γινομένου' : 'Square Root of a Product',
          prompt: <span>{isEl ? 'Η τιμή της παράστασης' : 'The value of'} <Radical>{a} · {b}</Radical> {isEl ? 'είναι:' : 'is:'}</span>,
          type: 'mcq',
          correct: correctOpt.key,
          options: ensureFourUniqueOptions(correctOpt, [
            { key: String(Math.sqrt(a) + Math.sqrt(b)), label: String(Math.sqrt(a) + Math.sqrt(b)), node: String(Math.sqrt(a) + Math.sqrt(b)) },
            { key: String(a + b), label: String(a + b), node: String(a + b) },
            { key: String(ans * 2), label: String(ans * 2), node: String(ans * 2) },
            { key: String(ans - 1), label: String(ans - 1), node: String(ans - 1) },
          ]),
          explanation: <span><Radical>{a}</Radical> · <Radical>{b}</Radical> ＝ {Math.sqrt(a)} · {Math.sqrt(b)} ＝ {ans}.</span>,
        };
      }
      case 6: {
        return {
          sig: 'c4e1_6',
          title: isEl ? 'Ρίζα Αθροίσματος' : 'Square Root of a Sum',
          prompt: <span>{isEl ? 'Ισχύει ότι' : 'Does'} <Radical>9 ＋ 16</Radical> ＝ <Radical>9</Radical> ＋ <Radical>16</Radical>;</span>,
          type: 'tf',
          correct: isEl ? 'Λάθος' : 'False',
          options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
          explanation: <span><Radical>25</Radical> ＝ 5, ενώ 3 ＋ 4 ＝ 7.</span>,
        };
      }
      case 7: {
        const k = pickRandom([2, 3, 5]);
        return {
          sig: `c4e1_7_${k}`,
          title: isEl ? 'Υπολογισμός Ρίζας' : 'Evaluating Square Root',
          prompt: <span>{isEl ? 'Υπολογίστε:' : 'Calculate:'} <Radical>{k * k * 100}</Radical></span>,
          type: 'input',
          correct: k * 10,
          explanation: <span><Radical>{k * k}</Radical> · <Radical>100</Radical> ＝ {k} · 10 ＝ {k * 10}.</span>,
        };
      }
      case 8: {
        const k = pickRandom([4, 6, 8]);
        const ans = Math.pow(3, k / 2);
        const correctOpt = { key: String(ans), label: String(ans), node: String(ans) };
        return {
          sig: `c4e1_8_${k}`,
          title: isEl ? 'Ρίζα Δύναμης' : 'Square Root of a Power',
          prompt: <span>{isEl ? 'Η τιμή της ρίζας' : 'The value of'} <Radical>3<sup>{k}</sup></Radical> {isEl ? 'είναι:' : 'is:'}</span>,
          type: 'mcq',
          correct: correctOpt.key,
          options: ensureFourUniqueOptions(correctOpt, [
            { key: String(Math.pow(3, k)), label: String(Math.pow(3, k)), node: String(Math.pow(3, k)) },
            { key: String(3 * (k / 2)), label: String(3 * (k / 2)), node: String(3 * (k / 2)) },
            { key: String(ans * 3), label: String(ans * 3), node: String(ans * 3) },
            { key: '3', label: '3', node: '3' },
          ]),
          explanation: <span><Radical>3<sup>{k}</sup></Radical> ＝ 3<sup>{k / 2}</sup> ＝ {ans}.</span>,
        };
      }
      default: {
        const r = pickRandom([4, 5, 6, 7]);
        return {
          sig: `c4e1_9_${r}`,
          title: isEl ? 'Επίλυση x² ＝ α' : 'Solving x² ＝ α',
          prompt: <span>{isEl ? 'Αν x > 0 και x² ＝' : 'If x > 0 and x² ＝'} {r * r}, {isEl ? 'ποιος είναι ο x;' : 'what is x?'}</span>,
          type: 'input',
          correct: r,
          explanation: <span>x ＝ <Radical>{r * r}</Radical> ＝ {r}.</span>,
        };
      }
    }
  };

  // ΚΕΦ. 4 - ΑΣΚΗΣΗ 2 (10 παραλλαγές)
  const buildCh4Ex2 = (mode) => {
    switch (mode) {
      case 0: {
        const k = pickRandom([2, 3, 5]);
        const coef = pickRandom([2, 3, 4]);
        const rad = coef * coef * k;
        const correctOpt = { key: `${coef}sqrt${k}`, label: `${coef}√${k}`, node: <span>{coef}<Radical>{k}</Radical></span> };
        return {
          sig: `c4e2_0_${rad}`,
          title: isEl ? 'Απλοποίηση Τετραγωνικής Ρίζας' : 'Simplifying a Square Root',
          prompt: <span>{isEl ? 'Η απλοποιημένη μορφή της ρίζας' : 'The simplified form of'} <Radical>{rad}</Radical> {isEl ? 'είναι:' : 'is:'}</span>,
          type: 'mcq',
          correct: correctOpt.key,
          options: ensureFourUniqueOptions(correctOpt, [
            { key: `${k}sqrt${coef}`, label: `${k}√${coef}`, node: <span>{k}<Radical>{coef}</Radical></span> },
            { key: `${coef * coef}sqrt${k}`, label: `${coef * coef}√${k}`, node: <span>{coef * coef}<Radical>{k}</Radical></span> },
            { key: `${coef + k}`, label: `${coef + k}`, node: String(coef + k) },
            { key: `2sqrt${rad / 2}`, label: `2√${rad / 2}`, node: <span>2<Radical>{rad / 2}</Radical></span> },
          ]),
          explanation: <span><Radical>{rad}</Radical> ＝ <Radical>{coef * coef} · {k}</Radical> ＝ {coef}<Radical>{k}</Radical>.</span>,
        };
      }
      case 1: {
        const k = pickRandom([2, 3, 5]);
        const a = pickRandom([2, 3, 4]);
        const b = pickRandom([3, 4, 5]);
        const sum = a + b;
        const correctOpt = { key: `${sum}sqrt${k}`, label: `${sum}√${k}`, node: <span>{sum}<Radical>{k}</Radical></span> };
        return {
          sig: `c4e2_1_${a}_${b}_${k}`,
          title: isEl ? 'Πρόσθεση Όμοιων Ριζών' : 'Adding Like Radicals',
          prompt: <span>{isEl ? 'Το άθροισμα' : 'The sum'} {a}<Radical>{k}</Radical> ＋ {b}<Radical>{k}</Radical> {isEl ? 'ισούται με:' : 'equals:'}</span>,
          type: 'mcq',
          correct: correctOpt.key,
          options: ensureFourUniqueOptions(correctOpt, [
            { key: `${sum}sqrt${2 * k}`, label: `${sum}√${2 * k}`, node: <span>{sum}<Radical>{2 * k}</Radical></span> },
            { key: `${a * b}sqrt${k}`, label: `${a * b}√${k}`, node: <span>{a * b}<Radical>{k}</Radical></span> },
            { key: `${sum * k}`, label: `${sum * k}`, node: String(sum * k) },
            { key: `sqrt${sum * k}`, label: `√${sum * k}`, node: <Radical>{sum * k}</Radical> },
          ]),
          explanation: <span>({a} ＋ {b})<Radical>{k}</Radical> ＝ {sum}<Radical>{k}</Radical>.</span>,
        };
      }
      case 2: {
        const q = pickRandom([4, 9, 16, 25]);
        const d = pickRandom([2, 3, 5]);
        const ans = Math.sqrt(q);
        return {
          sig: `c4e2_2_${q}_${d}`,
          title: isEl ? 'Πηλίκο Τετραγωνικών Ριζών' : 'Quotient of Square Roots',
          prompt: (
            <span className="inline-flex items-center">
              {isEl ? 'Υπολογίστε:' : 'Calculate:'} <Frac num={<Radical>{q * d}</Radical>} den={<Radical>{d}</Radical>} />
            </span>
          ),
          type: 'input',
          correct: ans,
          explanation: <span><Radical><Frac num={String(q * d)} den={String(d)} /></Radical> ＝ <Radical>{q}</Radical> ＝ {ans}.</span>,
        };
      }
      case 3: {
        const a = pickRandom([2, 3]);
        const b = pickRandom([5, 7]);
        const ans = a * a * b;
        return {
          sig: `c4e2_3_${a}_${b}`,
          title: isEl ? 'Τετράγωνο Γινόμενου με Ρίζα' : 'Squaring a Radical Product',
          prompt: <span>{isEl ? 'Υπολογίστε:' : 'Calculate:'} ({a}<Radical>{b}</Radical>)<sup>2</sup></span>,
          type: 'input',
          correct: ans,
          explanation: <span>{a}<sup>2</sup> · (<Radical>{b}</Radical>)<sup>2</sup> ＝ {a * a} · {b} ＝ {ans}.</span>,
        };
      }
      case 4: {
        const a = pickRandom([3, 4]);
        const b = pickRandom([2, 3]);
        return {
          sig: `c4e2_4_${a}_${b}`,
          title: isEl ? 'Εισαγωγή Παράγοντα στη Ρίζα' : 'Moving Factor Inside Radical',
          prompt: <span>{isEl ? 'Ισχύει ότι' : 'Does'} {a}<Radical>{b}</Radical> ＝ <Radical>{a * a * b}</Radical>;</span>,
          type: 'tf',
          correct: isEl ? 'Σωστό' : 'True',
          options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
          explanation: <span><Radical>{a}² · {b}</Radical> ＝ <Radical>{a * a * b}</Radical>.</span>,
        };
      }
      case 5: {
        const k = pickRandom([2, 3, 6]);
        return {
          sig: `c4e2_5_${k}`,
          title: isEl ? 'Γινόμενο Ριζών' : 'Product of Radicals',
          prompt: <span>{isEl ? 'Υπολογίστε:' : 'Calculate:'} <Radical>{k}</Radical> · <Radical>{9 * k}</Radical></span>,
          type: 'input',
          correct: k * 3,
          explanation: <span><Radical>9 · {k}²</Radical> ＝ 3 · {k} ＝ {k * 3}.</span>,
        };
      }
      case 6: {
        const a = pickRandom([2, 3]);
        const b = pickRandom([5, 6]);
        const correctOpt = { key: `${a}sqrt${b}`, label: `${a}√${b}`, node: <span>{a}<Radical>{b}</Radical></span> };
        return {
          sig: `c4e2_6_${a}_${b}`,
          title: isEl ? 'Σύγκριση Ριζικών Αριθμών' : 'Comparing Radical Numbers',
          prompt: isEl ? 'Ποιος αριθμός είναι μεγαλύτερος;' : 'Which number is greatest?',
          type: 'mcq',
          correct: correctOpt.key,
          options: ensureFourUniqueOptions(correctOpt, [
            { key: `sqrt${a * a * b - 2}`, label: `√${a * a * b - 2}`, node: <Radical>{a * a * b - 2}</Radical> },
            { key: `sqrt${a * b}`, label: `√${a * b}`, node: <Radical>{a * b}</Radical> },
            { key: `sqrt${a + b}`, label: `√${a + b}`, node: <Radical>{a + b}</Radical> },
            { key: '1', label: '1', node: '1' },
          ]),
          explanation: <span>{a}<Radical>{b}</Radical> ＝ <Radical>{a * a * b}</Radical>.</span>,
        };
      }
      case 7: {
        return {
          sig: 'c4e2_7',
          title: isEl ? 'Απλοποίηση & Άθροισμα Ριζών' : 'Simplifying & Adding Radicals',
          prompt: <span>{isEl ? 'Ισχύει ότι' : 'Does'} <Radical>12</Radical> ＋ <Radical>27</Radical> ＝ 5<Radical>3</Radical>;</span>,
          type: 'tf',
          correct: isEl ? 'Σωστό' : 'True',
          options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
          explanation: <span>2<Radical>3</Radical> ＋ 3<Radical>3</Radical> ＝ 5<Radical>3</Radical>.</span>,
        };
      }
      case 8: {
        const k = pickRandom([2, 3, 5]);
        return {
          sig: `c4e2_8_${k}`,
          title: isEl ? '4η Δύναμη Ρίζας' : '4th Power of a Radical',
          prompt: <span>{isEl ? 'Υπολογίστε:' : 'Calculate:'} (<Radical>{k}</Radical>)<sup>4</sup></span>,
          type: 'input',
          correct: k * k,
          explanation: <span>((<Radical>{k}</Radical>)<sup>2</sup>)<sup>2</sup> ＝ {k}<sup>2</sup> ＝ {k * k}.</span>,
        };
      }
      default: {
        const a = pickRandom([2, 3, 5]);
        const ans = a + 1;
        const correctOpt = { key: String(ans), label: String(ans), node: String(ans) };
        return {
          sig: `c4e2_9_${a}`,
          title: isEl ? 'Διαφορά Τετραγώνων με Ρίζες' : 'Difference of Squares with Radicals',
          prompt: <span>{isEl ? 'Η τιμή της παράστασης' : 'The value of'} (<Radical>{a + 2}</Radical> － 1)(<Radical>{a + 2}</Radical> ＋ 1) {isEl ? 'είναι:' : 'is:'}</span>,
          type: 'mcq',
          correct: correctOpt.key,
          options: ensureFourUniqueOptions(correctOpt, [
            { key: String(a + 3), label: String(a + 3), node: String(a + 3) },
            { key: String(a + 2), label: String(a + 2), node: String(a + 2) },
            { key: String(a), label: String(a), node: String(a) },
            { key: '0', label: '0', node: '0' },
          ]),
          explanation: <span>(<Radical>{a + 2}</Radical>)<sup>2</sup> － 1<sup>2</sup> ＝ {a + 2} － 1 ＝ {ans}.</span>,
        };
      }
    }
  };

  // ΚΕΦ. 5 - ΑΣΚΗΣΗ 1 (10 παραλλαγές)
  const buildCh5Ex1 = (mode) => {
    switch (mode) {
      case 0: {
        const irr = pickRandom([2, 3, 5, 7, 11]);
        const correctOpt = { key: `sqrt_${irr}`, label: `√${irr}`, node: <Radical>{irr}</Radical> };
        return {
          sig: `c5e1_0_${irr}`,
          title: isEl ? 'Αναγνώριση Άρρητου Αριθμού' : 'Identifying an Irrational Number',
          prompt: isEl ? 'Ποιος από τους παρακάτω αριθμούς είναι άρρητος;' : 'Which of the following numbers is irrational?',
          type: 'mcq',
          correct: correctOpt.key,
          options: ensureFourUniqueOptions(correctOpt, [
            { key: 'sqrt_16', label: '√16', node: <Radical>16</Radical> },
            { key: 'frac', label: '-5/8', node: <Frac num="-5" den="8" /> },
            { key: 'per', label: '0,(6)', node: isEl ? '0,(6)' : '0.(6)' },
            { key: 'dec', label: '-3,14', node: isEl ? '-3,14' : '-3.14' },
          ]),
          explanation: <span>{isEl ? `Ο √${irr} έχει άπειρα μη περιοδικά δεκαδικά ψηφία (άρρητος).` : `√${irr} has infinite non-repeating decimals (irrational).`}</span>,
        };
      }
      case 1: {
        return {
          sig: 'c5e1_1',
          title: isEl ? 'Ο Αριθμός π' : 'The Number π',
          prompt: isEl
            ? 'Ο αριθμός π (3,14159265...) είναι άρρητος αριθμός;'
            : 'Is the number π (3.14159265...) an irrational number?',
          type: 'tf',
          correct: isEl ? 'Σωστό' : 'True',
          options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
          explanation: isEl ? 'Το π έχει άπειρα μη περιοδικά δεκαδικά ψηφία (π ∈ 𝕀).' : 'π has infinite non-repeating decimals (π ∈ 𝕀).',
        };
      }
      case 2: {
        const sq = pickRandom([9, 25, 36, 49, 64, 81]);
        return {
          sig: `c5e1_2_${sq}`,
          title: isEl ? 'Ρητοί vs Άρρητοι' : 'Rational vs Irrational',
          prompt: <span>{isEl ? 'Ο αριθμός' : 'Does'} <Radical>{sq}</Radical> {isEl ? 'ανήκει στους άρρητους αριθμούς (𝕀);' : 'belong to irrational numbers (𝕀)?'}</span>,
          type: 'tf',
          correct: isEl ? 'Λάθος' : 'False',
          options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
          explanation: <span><Radical>{sq}</Radical> ＝ {Math.sqrt(sq)} ∈ ℕ ⊂ ℚ ({isEl ? 'ρητός' : 'rational'}).</span>,
        };
      }
      case 3: {
        const correctOpt = { key: '0.1010010001...', label: '0,1010010001...', node: isEl ? '0,1010010001...' : '0.1010010001...' };
        return {
          sig: 'c5e1_3',
          title: isEl ? 'Δεκαδική Αναπαράσταση' : 'Decimal Representation',
          prompt: isEl
            ? 'Ποιος δεκαδικός αριθμός παριστάνει άρρητο αριθμό;'
            : 'Which decimal represents an irrational number?',
          type: 'mcq',
          correct: correctOpt.key,
          options: ensureFourUniqueOptions(correctOpt, [
            { key: '0.125', label: '0,125', node: isEl ? '0,125' : '0.125' },
            { key: '2.(45)', label: '2,(45)', node: isEl ? '2,(45)' : '2.(45)' },
            { key: '1.777...', label: '1,777...', node: isEl ? '1,777...' : '1.777...' },
            { key: '-4.5', label: '-4,5', node: isEl ? '-4,5' : '-4.5' },
          ]),
          explanation: isEl ? 'Άπειρα μη περιοδικά ψηφία ⇒ άρρητος αριθμός.' : 'Infinite non-repeating digits ⇒ irrational number.',
        };
      }
      case 4: {
        const k = pickRandom([3, 5, 7]);
        return {
          sig: `c5e1_4_${k}`,
          title: isEl ? 'Σύνολο Πραγματικών Αριθμών ℝ' : 'Real Numbers Set ℝ',
          prompt: <span>{isEl ? 'Το άθροισμα' : 'Is the sum'} 2 ＋ <Radical>{k}</Radical> {isEl ? 'είναι πραγματικός αριθμός;' : 'a real number?'}</span>,
          type: 'tf',
          correct: isEl ? 'Σωστό' : 'True',
          options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
          explanation: isEl ? 'Κάθε ρητός και άρρητος ανήκει στο ℝ.' : 'Every rational and irrational belongs to ℝ.',
        };
      }
      case 5: {
        const correctOpt = { key: 'Q_union_I', label: 'ℝ ＝ ℚ ∪ 𝕀', node: 'ℝ ＝ ℚ ∪ 𝕀' };
        return {
          sig: 'c5e1_5',
          title: isEl ? 'Σύσταση του Συνόλου ℝ' : 'Composition of Set ℝ',
          prompt: isEl ? 'Το σύνολο των πραγματικών αριθμών ℝ αποτελείται από:' : 'The real numbers set ℝ consists of:',
          type: 'mcq',
          correct: correctOpt.key,
          options: ensureFourUniqueOptions(correctOpt, [
            { key: 'only_Q', label: isEl ? 'Μόνο ρητούς (ℚ)' : 'Only rationals (ℚ)', node: isEl ? 'Μόνο ρητούς (ℚ)' : 'Only rationals (ℚ)' },
            { key: 'only_Z', label: isEl ? 'Μόνο ακεραίους (ℤ)' : 'Only integers (ℤ)', node: isEl ? 'Μόνο ακεραίους (ℤ)' : 'Only integers (ℤ)' },
            { key: 'only_I', label: isEl ? 'Μόνο άρρητους (𝕀)' : 'Only irrationals (𝕀)', node: isEl ? 'Μόνο άρρητους (𝕀)' : 'Only irrationals (𝕀)' },
            { key: 'N_Z', label: isEl ? 'Μόνο φυσικούς & ακεραίους' : 'Only natural & integers', node: isEl ? 'Μόνο φυσικούς & ακεραίους' : 'Only natural & integers' },
          ]),
          explanation: 'ℝ ＝ ℚ ∪ 𝕀.',
        };
      }
      case 6: {
        const d = pickRandom([1, 2, 4, 5, 7, 8]);
        return {
          sig: `c5e1_6_${d}`,
          title: isEl ? 'Περιοδικός Δεκαδικός σε Κλάσμα' : 'Repeating Decimal to Fraction',
          prompt: (
            <span className="inline-flex items-center">
              {isEl ? `Ο 0,(${d}) γράφεται ως` : `0.(${d}) equals`} <Frac num={String(d)} den="β" />. {isEl ? 'Ποιος είναι ο παρονομαστής β;' : 'What is β?'}
            </span>
          ),
          type: 'input',
          correct: 9,
          explanation: <span>0,({d}) ＝ <Frac num={String(d)} den="9" />, άρα β ＝ 9.</span>,
        };
      }
      case 7: {
        return {
          sig: 'c5e1_7',
          title: isEl ? 'Αντιστοιχία με Ευθεία' : 'Number Line Correspondence',
          prompt: isEl
            ? 'Κάθε πραγματικός αριθμός αντιστοιχεί σε ένα μοναδικό σημείο της ευθείας ℝ;'
            : 'Does each real number correspond to a unique point on ℝ?',
          type: 'tf',
          correct: isEl ? 'Σωστό' : 'True',
          options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
          explanation: isEl ? 'Υπάρχει αμφιμονοσήμαντη αντιστοιχία ανάμεσα στο ℝ και στα σημεία της ευθείας.' : 'One-to-one correspondence with the number line.',
        };
      }
      case 8: {
        const correctOpt = { key: 'sqrt2_sq', label: '(√2)²', node: <span>(<Radical>2</Radical>)<sup>2</sup></span> };
        return {
          sig: 'c5e1_8',
          title: isEl ? 'Ρητό Αποτέλεσμα' : 'Rational Result',
          prompt: isEl ? 'Ποια παράσταση δίνει ρητό αποτέλεσμα;' : 'Which expression yields a rational number?',
          type: 'mcq',
          correct: correctOpt.key,
          options: ensureFourUniqueOptions(correctOpt, [
            { key: 'sqrt2_plus_1', label: '√2 ＋ 1', node: <span><Radical>2</Radical> ＋ 1</span> },
            { key: '3sqrt2', label: '3√2', node: <span>3<Radical>2</Radical></span> },
            { key: 'sqrt2_div_2', label: '√2 / 2', node: <Frac num={<Radical>2</Radical>} den="2" /> },
            { key: 'pi_plus_2', label: 'π ＋ 2', node: 'π ＋ 2' },
          ]),
          explanation: <span>(<Radical>2</Radical>)<sup>2</sup> ＝ 2 ∈ ℚ.</span>,
        };
      }
      default: {
        return {
          sig: 'c5e1_9',
          title: isEl ? 'Ξένα Σύνολα ℚ και 𝕀' : 'Disjoint Sets ℚ and 𝕀',
          prompt: isEl
            ? 'Υπάρχουν αριθμοί που είναι ταυτόχρονα ρητοί και άρρητοι;'
            : 'Are there numbers that are both rational and irrational?',
          type: 'tf',
          correct: isEl ? 'Λάθος' : 'False',
          options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
          explanation: 'ℚ ∩ 𝕀 ＝ ∅.',
        };
      }
    }
  };

  // ΚΕΦ. 5 - ΑΣΚΗΣΗ 2 (10 παραλλαγές)
  const buildCh5Ex2 = (mode) => {
    switch (mode) {
      case 0: {
        const n = pickRandom([6, 10, 14, 21, 30, 42]);
        const low = Math.floor(Math.sqrt(n));
        const high = low + 1;
        return {
          sig: `c5e2_0_${n}`,
          title: isEl ? 'Διαδοχικοί Ακέραιοι Φράγματα Άρρητου' : 'Consecutive Integer Bounds',
          prompt: <span>{isEl ? 'Αν' : 'If'} κ &lt; <Radical>{n}</Radical> &lt; κ ＋ 1 (κ ∈ ℕ), {isEl ? 'ποια είναι η τιμή του κ;' : 'what is κ?'}</span>,
          type: 'input',
          correct: low,
          diagram: {
            type: 'realLine',
            hasTriangle: false,
            leftLabel: `${low} (√${low * low})`,
            midLabel: `√${n}`,
            rightLabel: `${high} (√${high * high})`,
            caption: `${low} < √${n} < ${high} ⇒ κ ＝ ${low}`,
          },
          explanation: <span>{low * low} &lt; {n} &lt; {high * high} ⇒ {low} &lt; <Radical>{n}</Radical> &lt; {high}.</span>,
        };
      }
      case 1: {
        const correctOpt = { key: 'sqrt10', label: '√10', node: <Radical>10</Radical> };
        return {
          sig: 'c5e2_1',
          title: isEl ? 'Άρρητος Ανάμεσα σε 3 και 4' : 'Irrational Between 3 and 4',
          prompt: isEl ? 'Ποιος άρρητος αριθμός βρίσκεται ανάμεσα στο 3 και στο 4;' : 'Which irrational lies between 3 and 4?',
          type: 'mcq',
          correct: correctOpt.key,
          options: ensureFourUniqueOptions(correctOpt, [
            { key: 'sqrt5', label: '√5', node: <Radical>5</Radical> },
            { key: 'sqrt8', label: '√8', node: <Radical>8</Radical> },
            { key: 'sqrt18', label: '√18', node: <Radical>18</Radical> },
            { key: 'sqrt26', label: '√26', node: <Radical>26</Radical> },
          ]),
          explanation: <span>3 ＝ <Radical>9</Radical> &lt; <Radical>10</Radical> &lt; <Radical>16</Radical> ＝ 4.</span>,
        };
      }
      case 2: {
        const a = pickRandom([2, 3, 4]);
        return {
          sig: `c5e2_2_${a}`,
          title: isEl ? 'Ελάχιστος Υπόρριζος' : 'Smallest Radicand',
          prompt: <span>{isEl ? 'Ποιος είναι ο μικρότερος φυσικός ν ώστε' : 'Smallest natural ν such that'} <Radical>ν</Radical> &gt; {a};</span>,
          type: 'input',
          correct: a * a + 1,
          explanation: <span>{a} ＝ <Radical>{a * a}</Radical>, άρα ν ＝ {a * a + 1}.</span>,
        };
      }
      case 3: {
        return {
          sig: 'c5e2_3',
          title: isEl ? 'Διάταξη Πραγματικών' : 'Ordering Real Numbers',
          prompt: <span>{isEl ? 'Ισχύει η διάταξη:' : 'Does'} 2 &lt; <Radical>5</Radical> &lt; 3;</span>,
          type: 'tf',
          correct: isEl ? 'Σωστό' : 'True',
          options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
          explanation: <span><Radical>4</Radical> &lt; <Radical>5</Radical> &lt; <Radical>9</Radical> ⇒ 2 &lt; <Radical>5</Radical> &lt; 3.</span>,
        };
      }
      case 4: {
        const k = pickRandom([3, 5, 7]);
        const correctOpt = { key: `-sqrt${k}`, label: `-√${k}`, node: <span>-<Radical>{k}</Radical></span> };
        return {
          sig: `c5e2_4_${k}`,
          title: isEl ? 'Αντίθετος Πραγματικού Αριθμού' : 'Opposite of a Real Number',
          prompt: <span>{isEl ? 'Ο αντίθετος του' : 'The opposite of'} <Radical>{k}</Radical> {isEl ? 'είναι:' : 'is:'}</span>,
          type: 'mcq',
          correct: correctOpt.key,
          options: ensureFourUniqueOptions(correctOpt, [
            { key: `1/sqrt${k}`, label: `1/√${k}`, node: <Frac num="1" den={<Radical>{k}</Radical>} /> },
            { key: `sqrt${k}`, label: `√${k}`, node: <Radical>{k}</Radical> },
            { key: `-${k}`, label: `-${k}`, node: `-${k}` },
            { key: '0', label: '0', node: '0' },
          ]),
          explanation: <span><Radical>{k}</Radical> ＋ (-<Radical>{k}</Radical>) ＝ 0.</span>,
        };
      }
      case 5: {
        const k = pickRandom([2, 3, 5]);
        return {
          sig: `c5e2_5_${k}`,
          title: isEl ? 'Απόλυτη Τιμή Πραγματικού' : 'Absolute Value of a Real',
          prompt: <span>|-<Radical>{k}</Radical>| ＝ <Radical>{k}</Radical>;</span>,
          type: 'tf',
          correct: isEl ? 'Σωστό' : 'True',
          options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
          explanation: <span>|-<Radical>{k}</Radical>| ＝ <Radical>{k}</Radical>.</span>,
        };
      }
      case 6: {
        return {
          sig: 'c5e2_6',
          title: isEl ? 'Άνω Φράγμα Άρρητου' : 'Upper Integer Bound',
          prompt: <span>{isEl ? 'Αν' : 'If'} μ － 1 &lt; <Radical>20</Radical> &lt; μ (μ ∈ ℕ), {isEl ? 'ποιος είναι ο μ;' : 'what is μ?'}</span>,
          type: 'input',
          correct: 5,
          explanation: <span>4 &lt; <Radical>20</Radical> &lt; 5 ⇒ μ ＝ 5.</span>,
        };
      }
      case 7: {
        const correctOpt = { key: 'sqrt15', label: '√15', node: <Radical>15</Radical> };
        return {
          sig: 'c5e2_7',
          title: isEl ? 'Σύγκριση με Ακέραιο' : 'Comparing with an Integer',
          prompt: isEl ? 'Ποιος αριθμός είναι μικρότερος από το 4;' : 'Which number is less than 4?',
          type: 'mcq',
          correct: correctOpt.key,
          options: ensureFourUniqueOptions(correctOpt, [
            { key: 'sqrt17', label: '√17', node: <Radical>17</Radical> },
            { key: 'sqrt20', label: '√20', node: <Radical>20</Radical> },
            { key: '2sqrt5', label: '2√5', node: <span>2<Radical>5</Radical></span> },
            { key: 'sqrt25', label: '√25', node: <Radical>25</Radical> },
          ]),
          explanation: <span>4 ＝ <Radical>16</Radical> &gt; <Radical>15</Radical>.</span>,
        };
      }
      case 8: {
        return {
          sig: 'c5e2_8',
          title: isEl ? 'Σύγκριση Αρνητικών Πραγματικών' : 'Comparing Negative Reals',
          prompt: <span>{isEl ? 'Ισχύει ότι' : 'Does'} -<Radical>7</Radical> &gt; -<Radical>5</Radical>;</span>,
          type: 'tf',
          correct: isEl ? 'Λάθος' : 'False',
          options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
          explanation: <span><Radical>7</Radical> &gt; <Radical>5</Radical> ⇒ -<Radical>7</Radical> &lt; -<Radical>5</Radical>.</span>,
        };
      }
      default: {
        const k = pickRandom([2, 3, 5]);
        return {
          sig: `c5e2_9_${k}`,
          title: isEl ? 'Απαλοιφή Αντίθετων Άρρητων' : 'Canceling Opposite Irrationals',
          prompt: <span>{isEl ? 'Υπολογίστε:' : 'Calculate:'} (<Radical>{k}</Radical> － 2) ＋ (5 － <Radical>{k}</Radical>)</span>,
          type: 'input',
          correct: 3,
          explanation: <span>-2 ＋ 5 ＝ 3.</span>,
        };
      }
    }
  };

  // ΚΕΦ. 6 - ΑΣΚΗΣΗ 1 (10 παραλλαγές)
  const buildCh6Ex1 = (mode) => {
    switch (mode) {
      case 0: {
        const configs = [
          { a: 1, b: 1, res: 2, w1: 3, w2: 4, w3: 5 },
          { a: 2, b: 1, res: 5, w1: 3, w2: 4, w3: 6 },
          { a: 2, b: 2, res: 8, w1: 4, w2: 6, w3: 10 },
          { a: 3, b: 1, res: 10, w1: 4, w2: 8, w3: 12 },
        ];
        const c = pickRandom(configs);
        const correctOpt = { key: `sqrt_${c.res}`, label: `√${c.res}`, node: <Radical>{c.res}</Radical> };
        return {
          sig: `c6e1_0_${c.a}_${c.b}`,
          title: isEl ? 'Τοποθέτηση Άρρητου στην Ευθεία ℝ' : 'Locating an Irrational on ℝ',
          prompt: isEl
            ? `Ορθογώνιο τρίγωνο έχει κάθετες πλευρές ${c.a} και ${c.b}. Ποιος αριθμός αντιστοιχεί στην ακτίνα διαβήτη ρ (υποτείνουσα) πάνω στον άξονα ℝ;`
            : `A right triangle has legs ${c.a} and ${c.b}. Which number corresponds to the compass radius ρ (hypotenuse) on ℝ?`,
          type: 'mcq',
          correct: correctOpt.key,
          options: ensureFourUniqueOptions(correctOpt, [
            { key: `sqrt_${c.w1}`, label: `√${c.w1}`, node: <Radical>{c.w1}</Radical> },
            { key: `sqrt_${c.w2}`, label: `√${c.w2}`, node: <Radical>{c.w2}</Radical> },
            { key: `sqrt_${c.w3}`, label: `√${c.w3}`, node: <Radical>{c.w3}</Radical> },
            { key: `${c.a + c.b}`, label: `${c.a + c.b}`, node: String(c.a + c.b) },
          ]),
          diagram: {
            type: 'realLine',
            hasTriangle: true,
            legA: String(c.a),
            legB: String(c.b),
            hypLabel: `ρ＝√${c.res}`,
            pointLabel: `√${c.res}`,
            caption: `ρ² ＝ ${c.a}² ＋ ${c.b}² ＝ ${c.res} ⇒ ρ ＝ √${c.res}`,
          },
          explanation: <span>ρ<sup>2</sup> ＝ {c.a}<sup>2</sup> ＋ {c.b}<sup>2</sup> ＝ {c.res} ⇒ ρ ＝ <Radical>{c.res}</Radical>.</span>,
        };
      }
      case 1: {
        const k = pickRandom([2, 3, 5]);
        return {
          sig: `c6e1_1_${k}`,
          title: isEl ? 'Δύναμη Άρρητης Βάσης' : 'Power with Irrational Base',
          prompt: <span>{isEl ? 'Υπολογίστε:' : 'Calculate:'} (<Radical>{k}</Radical>)<sup>6</sup></span>,
          type: 'input',
          correct: k * k * k,
          explanation: <span>((<Radical>{k}</Radical>)<sup>2</sup>)<sup>3</sup> ＝ {k}<sup>3</sup> ＝ {k * k * k}.</span>,
        };
      }
      case 2: {
        const sq1 = pickRandom([9, 16, 25]);
        const sq2 = pickRandom([36, 49, 64]);
        const ans = Math.sqrt(sq1) + Math.sqrt(sq2);
        return {
          sig: `c6e1_2_${sq1}_${sq2}`,
          title: isEl ? 'Τετράγωνοι Αριθμοί' : 'Square Numbers',
          prompt: <span>{isEl ? 'Υπολογίστε:' : 'Calculate:'} <Radical>{sq1}</Radical> ＋ <Radical>{sq2}</Radical></span>,
          type: 'input',
          correct: ans,
          explanation: <span>{Math.sqrt(sq1)} ＋ {Math.sqrt(sq2)} ＝ {ans}.</span>,
        };
      }
      case 3: {
        const k = pickRandom([2, 3, 5]);
        const correctOpt = { key: `1/${k}`, label: `1/${k}`, node: <Frac num="1" den={String(k)} /> };
        return {
          sig: `c6e1_3_${k}`,
          title: isEl ? 'Αρνητικός Εκθέτης με Άρρητη Βάση' : 'Negative Exponent with Irrational Base',
          prompt: <span>{isEl ? 'Η τιμή της δύναμης' : 'The value of'} (<Radical>{k}</Radical>)<sup>-2</sup> {isEl ? 'είναι:' : 'is:'}</span>,
          type: 'mcq',
          correct: correctOpt.key,
          options: ensureFourUniqueOptions(correctOpt, [
            { key: `-${k}`, label: `-${k}`, node: `-${k}` },
            { key: `${k}`, label: `${k}`, node: String(k) },
            { key: `-1/${k}`, label: `-1/${k}`, node: <span>-<Frac num="1" den={String(k)} /></span> },
            { key: `1/${k * k}`, label: `1/${k * k}`, node: <Frac num="1" den={String(k * k)} /> },
          ]),
          explanation: <span>(<Radical>{k}</Radical>)<sup>-2</sup> ＝ <Frac num="1" den={<span>(<Radical>{k}</Radical>)<sup>2</sup></span>} /> ＝ <Frac num="1" den={String(k)} />.</span>,
        };
      }
      case 4: {
        const n = pickRandom([8, 9, 10]);
        return {
          sig: `c6e1_4_${n}`,
          title: isEl ? 'Ακολουθία Τετράγωνων Αριθμών' : 'Sequence of Square Numbers',
          prompt: isEl
            ? `Ποιος είναι ο ${n}-ος θετικός τετράγωνος αριθμός (${n}²);`
            : `What is the ${n}th positive square number (${n}²)?`,
          type: 'input',
          correct: n * n,
          explanation: `${n}² ＝ ${n * n}.`,
        };
      }
      case 5: {
        return {
          sig: 'c6e1_5',
          title: isEl ? 'Κατασκευή √3 στον Άξονα ℝ' : 'Constructing √3 on ℝ',
          prompt: <span>{isEl ? 'Ορθογώνιο τρίγωνο με κάθετες' : 'Right triangle with legs'} <Radical>2</Radical> {isEl ? 'και 1 δίνει υποτείνουσα ρ ＝' : 'and 1 gives hypotenuse ρ ＝'} <Radical>3</Radical>;</span>,
          type: 'tf',
          correct: isEl ? 'Σωστό' : 'True',
          options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
          explanation: <span>(<Radical>2</Radical>)<sup>2</sup> ＋ 1<sup>2</sup> ＝ 2 ＋ 1 ＝ 3 ⇒ ρ ＝ <Radical>3</Radical>.</span>,
        };
      }
      case 6: {
        const k = pickRandom([2, 3, 5]);
        return {
          sig: `c6e1_6_${k}`,
          title: isEl ? 'Ιδιότητα Δυνάμεων Πραγματικής Βάσης' : 'Power Property with Real Base',
          prompt: <span>{isEl ? 'Υπολογίστε:' : 'Calculate:'} (<Radical>{k}</Radical>)<sup>5</sup> · (<Radical>{k}</Radical>)<sup>-1</sup></span>,
          type: 'input',
          correct: k * k,
          explanation: <span>(<Radical>{k}</Radical>)<sup>4</sup> ＝ {k}<sup>2</sup> ＝ {k * k}.</span>,
        };
      }
      case 7: {
        const k = pickRandom([3, 5, 7]);
        return {
          sig: `c6e1_7_${k}`,
          title: isEl ? 'Μηδενικός Εκθέτης Άρρητου' : 'Zero Exponent of Irrational',
          prompt: <span>(<Radical>{k}</Radical>)<sup>0</sup> ＝ 1;</span>,
          type: 'tf',
          correct: isEl ? 'Σωστό' : 'True',
          options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
          explanation: <span>{isEl ? 'Κάθε μη μηδενικός πραγματικός στη 0 ισούται με 1.' : 'Any non-zero real to the 0th power equals 1.'}</span>,
        };
      }
      case 8: {
        const k = pickRandom([2, 3, 5]);
        const ans = k * k * k;
        const correctOpt = { key: String(ans), label: String(ans), node: String(ans) };
        return {
          sig: `c6e1_8_${k}`,
          title: isEl ? 'Πηλίκο Δυνάμεων Πραγματικής Βάσης' : 'Quotient of Real-Base Powers',
          prompt: (
            <span className="inline-flex items-center">
              <Frac num={<span>(<Radical>{k}</Radical>)<sup>4</sup></span>} den={<span>(<Radical>{k}</Radical>)<sup>-2</sup></span>} /> ＝
            </span>
          ),
          type: 'mcq',
          correct: correctOpt.key,
          options: ensureFourUniqueOptions(correctOpt, [
            { key: String(k), label: String(k), node: String(k) },
            { key: String(k * k), label: String(k * k), node: String(k * k) },
            { key: `1/${k}`, label: `1/${k}`, node: <Frac num="1" den={String(k)} /> },
            { key: '1', label: '1', node: '1' },
          ]),
          explanation: <span>(<Radical>{k}</Radical>)<sup>4 - (-2)</sup> ＝ (<Radical>{k}</Radical>)<sup>6</sup> ＝ {k}<sup>3</sup> ＝ {ans}.</span>,
        };
      }
      default: {
        return {
          sig: 'c6e1_9',
          title: isEl ? 'Εύρεση Τετράγωνου Αριθμού' : 'Finding a Square Number',
          prompt: isEl
            ? 'Ποιος είναι ο μοναδικός τετράγωνος αριθμός ανάμεσα στο 20 και στο 30;'
            : 'What is the only square number between 20 and 30?',
          type: 'input',
          correct: 25,
          explanation: '5² ＝ 25.',
        };
      }
    }
  };

  // ΚΕΦ. 6 - ΑΣΚΗΣΗ 2 (10 παραλλαγές)
  const buildCh6Ex2 = (mode) => {
    switch (mode) {
      case 0: {
        const b = pickRandom([2, 3, 5]);
        return {
          sig: `c6e2_0_${b}`,
          title: isEl ? 'Ιδιότητες Δυνάμεων' : 'Exponent Properties',
          prompt: (
            <span className="inline-flex items-center">
              {isEl ? 'Υπολογίστε:' : 'Calculate:'} <Frac num={<span>{b}<sup>-3</sup> · ({b}<sup>4</sup>)<sup>2</sup></span>} den={<span>{b}<sup>3</sup></span>} />
            </span>
          ),
          type: 'input',
          correct: b * b,
          explanation: <span><Frac num={<span>{b}<sup>5</sup></span>} den={<span>{b}<sup>3</sup></span>} /> ＝ {b}<sup>2</sup> ＝ {b * b}.</span>,
        };
      }
      case 1: {
        const k = pickRandom([2, 3]);
        const ans = k * k + 1;
        const correctOpt = { key: String(ans), label: String(ans), node: String(ans) };
        return {
          sig: `c6e2_1_${k}`,
          title: isEl ? 'Δυνάμεις Πραγματικών Αριθμών' : 'Powers of Real Numbers',
          prompt: (
            <span className="inline-flex items-center">
              (<Frac num="1" den={<Radical>{k}</Radical>} />)<sup>-4</sup> ＋ π<sup>0</sup> ＝
            </span>
          ),
          type: 'mcq',
          correct: correctOpt.key,
          options: ensureFourUniqueOptions(correctOpt, [
            { key: String(k + 1), label: String(k + 1), node: String(k + 1) },
            { key: String(k * k), label: String(k * k), node: String(k * k) },
            { key: String(ans + 2), label: String(ans + 2), node: String(ans + 2) },
            { key: '1', label: '1', node: '1' },
          ]),
          explanation: <span>(<Radical>{k}</Radical>)<sup>4</sup> ＋ 1 ＝ {k * k} ＋ 1 ＝ {ans}.</span>,
        };
      }
      case 2: {
        const m = pickRandom([3, 4, 5]);
        return {
          sig: `c6e2_2_${m}`,
          title: isEl ? 'Αντίστροφο Πραγματικού' : 'Reciprocal of a Real',
          prompt: <span>{isEl ? 'Για α ≠ 0 ισχύει' : 'For α ≠ 0:'} (<Frac num="1" den="α" />)<sup>-{m}</sup> ＝ α<sup>{m}</sup>;</span>,
          type: 'tf',
          correct: isEl ? 'Σωστό' : 'True',
          options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
          explanation: <span>(<Frac num="1" den="α" />)<sup>-{m}</sup> ＝ α<sup>{m}</sup>.</span>,
        };
      }
      case 3: {
        const k = pickRandom([2, 3, 5]);
        return {
          sig: `c6e2_3_${k}`,
          title: isEl ? 'Δύναμη Γινομένου Ριζών' : 'Power of Product of Roots',
          prompt: <span>{isEl ? 'Υπολογίστε:' : 'Calculate:'} (<Radical>{k}</Radical> · <Radical>3</Radical>)<sup>2</sup></span>,
          type: 'input',
          correct: k * 3,
          explanation: <span>(<Radical>{k}</Radical>)<sup>2</sup> · (<Radical>3</Radical>)<sup>2</sup> ＝ {k} · 3 ＝ {k * 3}.</span>,
        };
      }
      case 4: {
        const e = pickRandom([3, 4]);
        const correctOpt = { key: '1', label: '1', node: '1' };
        return {
          sig: `c6e2_4_${e}`,
          title: isEl ? 'Συνδυασμός Ιδιοτήτων Δυνάμεων' : 'Combining Exponent Laws',
          prompt: <span>(<Radical>2</Radical>)<sup>{e}</sup> · (<Radical>5</Radical>)<sup>{e}</sup> · (<Radical>10</Radical>)<sup>-{e}</sup> ＝</span>,
          type: 'mcq',
          correct: correctOpt.key,
          options: ensureFourUniqueOptions(correctOpt, [
            { key: '10', label: '10', node: '10' },
            { key: '100', label: '100', node: '100' },
            { key: '0', label: '0', node: '0' },
            { key: '1/10', label: '1/10', node: <Frac num="1" den="10" /> },
          ]),
          explanation: <span>(<Radical>10</Radical>)<sup>{e}</sup> · (<Radical>10</Radical>)<sup>-{e}</sup> ＝ (<Radical>10</Radical>)<sup>0</sup> ＝ 1.</span>,
        };
      }
      case 5: {
        const a = pickRandom([2, 3, 4]);
        const ans = a * a + (a + 1) * (a + 1);
        return {
          sig: `c6e2_5_${a}`,
          title: isEl ? 'Άθροισμα Διαδοχικών Τετραγώνων' : 'Sum of Consecutive Squares',
          prompt: <span>{isEl ? 'Υπολογίστε:' : 'Calculate:'} {a}<sup>2</sup> ＋ ({a + 1})<sup>2</sup></span>,
          type: 'input',
          correct: ans,
          explanation: <span>{a * a} ＋ {(a + 1) * (a + 1)} ＝ {ans}.</span>,
        };
      }
      case 6: {
        return {
          sig: 'c6e2_6',
          title: isEl ? 'Περιττή Δύναμη Άρρητου' : 'Odd Power of Irrational',
          prompt: <span>{isEl ? 'Ο αριθμός' : 'Is'} (<Radical>3</Radical>)<sup>3</sup> {isEl ? 'είναι ρητός;' : 'rational?'}</span>,
          type: 'tf',
          correct: isEl ? 'Λάθος' : 'False',
          options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
          explanation: <span>(<Radical>3</Radical>)<sup>3</sup> ＝ 3<Radical>3</Radical> ∈ 𝕀 ({isEl ? 'άρρητος' : 'irrational'}).</span>,
        };
      }
      case 7: {
        return {
          sig: 'c6e2_7',
          title: isEl ? 'Δύναμη Πηλίκου Ριζών' : 'Power of Quotient of Roots',
          prompt: (
            <span className="inline-flex items-center">
              {isEl ? 'Υπολογίστε:' : 'Calculate:'} (<Frac num={<Radical>8</Radical>} den={<Radical>2</Radical>} />)<sup>2</sup>
            </span>
          ),
          type: 'input',
          correct: 4,
          explanation: <span>(<Radical>4</Radical>)<sup>2</sup> ＝ 4.</span>,
        };
      }
      case 8: {
        const correctOpt = { key: '1/pi^2', label: '1/π²', node: <Frac num="1" den={<span>π<sup>2</sup></span>} /> };
        return {
          sig: 'c6e2_8',
          title: isEl ? 'Αρνητικός Εκθέτης με Βάση το π' : 'Negative Exponent with Base π',
          prompt: <span>{isEl ? 'Η δύναμη' : 'The power'} π<sup>-2</sup> {isEl ? 'γράφεται ως:' : 'equals:'}</span>,
          type: 'mcq',
          correct: correctOpt.key,
          options: ensureFourUniqueOptions(correctOpt, [
            { key: '-pi^2', label: '-π²', node: <span>-π<sup>2</sup></span> },
            { key: '-2pi', label: '-2π', node: '-2π' },
            { key: '1/2pi', label: '1/(2π)', node: <Frac num="1" den="2π" /> },
            { key: 'pi/2', label: 'π/2', node: <Frac num="π" den="2" /> },
          ]),
          explanation: <span>π<sup>-2</sup> ＝ <Frac num="1" den={<span>π<sup>2</sup></span>} />.</span>,
        };
      }
      default: {
        return {
          sig: 'c6e2_9',
          title: isEl ? 'Υπολογισμός Παράστασης' : 'Evaluating Expression',
          prompt: <span>{isEl ? 'Υπολογίστε:' : 'Calculate:'} 2<sup>-1</sup> · (<Radical>20</Radical>)<sup>2</sup></span>,
          type: 'input',
          correct: 10,
          explanation: <span><Frac num="1" den="2" /> · 20 ＝ 10.</span>,
        };
      }
    }
  };

  // =========================================================================
  // 6 ΔΥΣΚΟΛΑ ΣΥΝΔΥΑΣΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ (1 ΑΠΟ ΚΑΘΕ ΚΕΦΑΛΑΙΟ, 10 ΠΑΡΑΛΛΑΓΕΣ ΕΚΑΣΤΟ)
  // =========================================================================

  // ΠΡΟΒΛΗΜΑ 1 (ΚΕΦ. 1)
  const buildProb1 = (mode) => {
    const b = mode % 2 === 0 ? 2 : 3;
    const k = (mode % 5) + 2; // 2..6
    const ans = b * b + 1;
    return {
      sig: `p1_${mode}_${b}_${k}`,
      title: isEl ? 'Συνδυαστική Παράσταση Δυνάμεων' : 'Combined Power Expression',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-x-1">
          <span>{isEl ? 'Υπολογίστε την τιμή της παράστασης:' : 'Calculate the value of:'}</span>
          <span className="inline-flex items-center font-bold">
            Α ＝ <Frac num={<span>{b}<sup>-{k}</sup> · ({b}<sup>{k}</sup>)<sup>2</sup></span>} den={<span>{b}<sup>{k - 2}</sup></span>} /> ＋ (<Frac num="1" den={String(b)} />)<sup>0</sup>
          </span>
        </span>
      ),
      type: 'input',
      correct: ans,
      diagram: {
        type: 'powerFlow',
        step1: `(${b}^${k})² ＝ ${b}^${2 * k}`,
        step2: `${b}^-${k} · ${b}^${2 * k} / ${b}^${k - 2} ＝ ${b}²`,
        caption: `Α ＝ ${b * b} ＋ 1 ＝ ${ans}`,
      },
      tableData: [
        {
          label: isEl ? '1. Δύναμη δύναμης' : '1. Power of a power',
          details: <span>({b}<sup>{k}</sup>)<sup>2</sup> ＝ {b}<sup>{2 * k}</sup></span>,
        },
        {
          label: isEl ? '2. Απλοποίηση κλάσματος' : '2. Simplify fraction',
          details: (
            <div className="flex flex-wrap items-center gap-x-1">
              <Frac num={<span>{b}<sup>-{k}</sup> · {b}<sup>{2 * k}</sup></span>} den={<span>{b}<sup>{k - 2}</sup></span>} />
              <span>＝</span>
              <Frac num={<span>{b}<sup>{k}</sup></span>} den={<span>{b}<sup>{k - 2}</sup></span>} />
              <span>＝ {b}<sup>2</sup> ＝ {b * b}</span>
            </div>
          ),
        },
        {
          label: isEl ? '3. Τελικό άθροισμα' : '3. Final sum',
          details: <span>Α ＝ {b * b} ＋ 1 ＝ {ans}</span>,
        },
      ],
      explanation: <span>{isEl ? `Απλοποιώντας το κλάσμα παίρνουμε ${b}² ＝ ${b * b} και προσθέτοντας 1 βρίσκουμε Α ＝ ${ans}.` : `Simplifying gives ${b}² ＋ 1 ＝ ${ans}.`}</span>,
    };
  };

  // ΠΡΟΒΛΗΜΑ 2 (ΚΕΦ. 2)
  const buildProb2 = (mode) => {
    const mins = [2, 4, 5, 6, 8, 10, 12, 15, 20, 25][mode % 10];
    const secs = mins * 60;
    const distMeters = 3 * secs;
    const sciCoef = distMeters / 100;
    const coefLabel = isEl ? String(sciCoef).replace('.', ',') : String(sciCoef);
    const correctOpt = {
      key: `${sciCoef}*10^10`,
      label: `${coefLabel} · 10^10 m`,
      node: <span>{coefLabel} · 10<sup>10</sup> m</span>,
    };
    return {
      sig: `p2_${mode}_${mins}`,
      title: isEl ? 'Εφαρμογή Τυποποιημένης Μορφής (Ταχύτητα Φωτός)' : 'Scientific Notation Application (Speed of Light)',
      prompt: (
        <span>
          {isEl
            ? `Το φως ταξιδεύει με ταχύτητα 3 · 10⁸ m/s. Πόσα μέτρα διανύει σε ${mins} λεπτά (σε τυποποιημένη μορφή);`
            : `Light travels at 3 · 10⁸ m/s. How many meters does it travel in ${mins} minutes (in scientific notation)?`}
        </span>
      ),
      type: 'mcq',
      correct: correctOpt.key,
      options: ensureFourUniqueOptions(correctOpt, [
        { key: `${distMeters}*10^8`, label: `${distMeters} · 10^8 m`, node: <span>{distMeters} · 10<sup>8</sup> m</span> },
        { key: `${sciCoef}*10^9`, label: `${coefLabel} · 10^9 m`, node: <span>{coefLabel} · 10<sup>9</sup> m</span> },
        { key: `${sciCoef}*10^11`, label: `${coefLabel} · 10^11 m`, node: <span>{coefLabel} · 10<sup>11</sup> m</span> },
        { key: `${3 * mins}*10^8`, label: `${3 * mins} · 10^8 m`, node: <span>{3 * mins} · 10<sup>8</sup> m</span> },
      ]),
      diagram: {
        type: 'sciNotation',
        rawText: `(3 · 10^8) · (${secs} s)`,
        sciText: `${coefLabel} · 10^10 m`,
        caption: isEl ? `${mins} min ＝ ${secs} s` : `${mins} min ＝ ${secs} s`,
      },
      tableData: [
        {
          label: isEl ? '1. Μετατροπή χρόνου' : '1. Convert time',
          details: <span>t ＝ {mins} · 60 s ＝ {secs} s ＝ {isEl ? String(secs / 100).replace('.', ',') : secs / 100} · 10<sup>2</sup> s</span>,
        },
        {
          label: isEl ? '2. Απόσταση s ＝ υ · t' : '2. Distance s ＝ v · t',
          details: <span>s ＝ (3 · 10<sup>8</sup>) · ({isEl ? String(secs / 100).replace('.', ',') : secs / 100} · 10<sup>2</sup>) ＝ {coefLabel} · 10<sup>10</sup> m</span>,
        },
      ],
      explanation: <span>{isEl ? `Σε ${mins} λεπτά (${secs} s) το φως διανύει ${coefLabel} · 10¹⁰ m.` : `In ${mins} minutes (${secs} s) light travels ${coefLabel} · 10¹⁰ m.`}</span>,
    };
  };

  // ΠΡΟΒΛΗΜΑ 3 (ΚΕΦ. 3)
  const buildProb3 = (mode) => {
    const c = (mode % 5) + 2; // 2..6
    const ans = 4 * c + 1;
    return {
      sig: `p3_${mode}_${c}`,
      title: isEl ? 'Σύνθετη Αριθμητική Παράσταση' : 'Complex Numerical Expression',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-x-1">
          <span>{isEl ? 'Υπολογίστε την τιμή της παράστασης:' : 'Calculate the value of:'}</span>
          <span className="inline-flex items-center font-bold">
            Β ＝ [(-2)<sup>3</sup> ＋ 3 · (<Frac num="1" den="2" />)<sup>-2</sup>] · {c} － (-1)<sup>7</sup>
          </span>
        </span>
      ),
      type: 'input',
      correct: ans,
      diagram: {
        type: 'powerFlow',
        step1: '(-2)³ ＋ 3 · 2² ＝ -8 ＋ 12 ＝ 4',
        step2: `4 · ${c} － (-1) ＝ ${4 * c} ＋ 1`,
        caption: `Β ＝ ${ans}`,
      },
      tableData: [
        {
          label: isEl ? '1. Πράξεις στην αγκύλη' : '1. Brackets evaluation',
          details: <span>(-2)<sup>3</sup> ＋ 3 · 2<sup>2</sup> ＝ -8 ＋ 12 ＝ 4</span>,
        },
        {
          label: isEl ? '2. Πολλαπλασιασμός & αφαίρεση' : '2. Multiply & subtract',
          details: <span>Β ＝ 4 · {c} － (-1) ＝ {4 * c} ＋ 1 ＝ {ans}</span>,
        },
      ],
      explanation: <span>Β ＝ 4 · {c} ＋ 1 ＝ {ans}.</span>,
    };
  };

  // ΠΡΟΒΛΗΜΑ 4 (ΚΕΦ. 4)
  const buildProb4 = (mode) => {
    const k = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15][mode % 10];
    const area = 6 * k;
    return {
      sig: `p4_${mode}_${k}`,
      title: isEl ? 'Εμβαδόν Ορθογωνίου με Τετραγωνικές Ρίζες' : 'Rectangle Area with Square Roots',
      prompt: (
        <span>
          {isEl
            ? `Ένα ορθογώνιο έχει μήκος 3√${k} cm και πλάτος 2√${k} cm. Πόσα cm² είναι το εμβαδόν του;`
            : `A rectangle has length 3√${k} cm and width 2√${k} cm. What is its area in cm²?`}
        </span>
      ),
      type: 'input',
      correct: area,
      unit: 'cm²',
      diagram: {
        type: 'rectRoot',
        centerLabel: `Ε ＝ ${area} cm²`,
        bottomLabel: `3√${k} cm`,
        sideLabel: `2√${k}`,
        caption: `(3√${k}) · (2√${k}) ＝ 6 · ${k} ＝ ${area} cm²`,
      },
      tableData: [
        {
          label: isEl ? '1. Τύπος εμβαδού' : '1. Area formula',
          details: <span>Ε ＝ (3<Radical>{k}</Radical>) · (2<Radical>{k}</Radical>)</span>,
        },
        {
          label: isEl ? '2. Ιδιότητα ριζών' : '2. Radical property',
          details: <span>Ε ＝ 6 · (<Radical>{k}</Radical>)<sup>2</sup> ＝ 6 · {k} ＝ {area} cm²</span>,
        },
      ],
      explanation: <span>Ε ＝ 3 · 2 · (<Radical>{k}</Radical>)<sup>2</sup> ＝ 6 · {k} ＝ {area} cm².</span>,
    };
  };

  // ΠΡΟΒΛΗΜΑ 5 (ΚΕΦ. 5)
  const buildProb5 = (mode) => {
    const configs = [
      { a: 3, b: 15, ints: '2, 3', count: 2 },
      { a: 5, b: 24, ints: '3, 4', count: 2 },
      { a: 2, b: 17, ints: '2, 3, 4', count: 3 },
      { a: 3, b: 26, ints: '2, 3, 4, 5', count: 4 },
      { a: 10, b: 35, ints: '4, 5', count: 2 },
      { a: 5, b: 37, ints: '3, 4, 5, 6', count: 4 },
      { a: 2, b: 10, ints: '2, 3', count: 2 },
      { a: 17, b: 48, ints: '5, 6', count: 2 },
      { a: 10, b: 50, ints: '4, 5, 6, 7', count: 4 },
      { a: 26, b: 63, ints: '6, 7', count: 2 },
    ];
    const c = configs[mode % 10];
    return {
      sig: `p5_${mode}_${c.a}_${c.b}`,
      title: isEl ? 'Ακέραιοι Ανάμεσα σε Άρρητους Αριθμούς' : 'Integers Between Irrational Numbers',
      prompt: (
        <span>
          {isEl ? 'Πόσοι ακέραιοι αριθμοί βρίσκονται ανάμεσα στους' : 'How many integers lie between'} <Radical>{c.a}</Radical> {isEl ? 'και' : 'and'} <Radical>{c.b}</Radical>;
        </span>
      ),
      type: 'input',
      correct: c.count,
      diagram: {
        type: 'realLine',
        hasTriangle: false,
        leftLabel: `√${c.a}`,
        midLabel: `{ ${c.ints} }`,
        rightLabel: `√${c.b}`,
        caption: isEl ? `Πλήθος ακεραίων: ${c.count}` : `Integer count: ${c.count}`,
      },
      tableData: [
        {
          label: isEl ? '1. Σύγκριση τετραγώνων' : '1. Comparing squares',
          details: <span>{isEl ? `Ζητάμε ακέραιους x > 0 με ${c.a} < x² < ${c.b}.` : `Find integers x > 0 with ${c.a} < x² < ${c.b}.`}</span>,
        },
        {
          label: isEl ? '2. Ακέραιες λύσεις' : '2. Integer solutions',
          details: <span>x ∈ {'{'}{c.ints}{'}'} ({isEl ? 'σύνολο' : 'total'}: {c.count})</span>,
        },
      ],
      explanation: <span>{isEl ? `Οι ακέραιοι ανάμεσα στους √${c.a} και √${c.b} είναι οι ${c.ints} (πλήθος ${c.count}).` : `Integers between √${c.a} and √${c.b} are ${c.ints} (count ${c.count}).`}</span>,
    };
  };

  // ΠΡΟΒΛΗΜΑ 6 (ΚΕΦ. 6)
  const buildProb6 = (mode) => {
    const configs = [
      { area: 8, coef: 2, rad: 2, low: 2, high: 3 },
      { area: 12, coef: 2, rad: 3, low: 3, high: 4 },
      { area: 18, coef: 3, rad: 2, low: 4, high: 5 },
      { area: 20, coef: 2, rad: 5, low: 4, high: 5 },
      { area: 27, coef: 3, rad: 3, low: 5, high: 6 },
      { area: 32, coef: 4, rad: 2, low: 5, high: 6 },
      { area: 45, coef: 3, rad: 5, low: 6, high: 7 },
      { area: 48, coef: 4, rad: 3, low: 6, high: 7 },
      { area: 50, coef: 5, rad: 2, low: 7, high: 8 },
      { area: 72, coef: 6, rad: 2, low: 8, high: 9 },
    ];
    const c = configs[mode % 10];
    const correctOpt = {
      key: `${c.coef}sqrt${c.rad}`,
      label: `${c.coef}√${c.rad} m`,
      node: <span>{c.coef}<Radical>{c.rad}</Radical> m</span>,
    };
    return {
      sig: `p6_${mode}_${c.area}`,
      title: isEl ? 'Τετράγωνος Χώρος & Θέση στην Ευθεία ℝ' : 'Square Plot & Position on ℝ',
      prompt: isEl
        ? `Ένας τετράγωνος χώρος έχει εμβαδόν ${c.area} m². Ποιο είναι το ακριβές μήκος της πλευράς του σε απλοποιημένη μορφή;`
        : `A square plot has area ${c.area} m². What is the exact simplified length of its side?`,
      type: 'mcq',
      correct: correctOpt.key,
      options: ensureFourUniqueOptions(correctOpt, [
        { key: `${c.rad}sqrt${c.coef}`, label: `${c.rad}√${c.coef} m`, node: <span>{c.rad}<Radical>{c.coef}</Radical> m</span> },
        { key: `${c.area / 2}`, label: `${c.area / 2} m`, node: `${c.area / 2} m` },
        { key: `${c.low}`, label: `${c.low} m`, node: `${c.low} m` },
        { key: `${c.coef * c.coef}sqrt${c.rad}`, label: `${c.coef * c.coef}√${c.rad} m`, node: <span>{c.coef * c.coef}<Radical>{c.rad}</Radical> m</span> },
      ]),
      diagram: {
        type: 'realLine',
        hasTriangle: false,
        leftLabel: `${c.low} (√${c.low * c.low})`,
        midLabel: `√${c.area}＝${c.coef}√${c.rad}`,
        rightLabel: `${c.high} (√${c.high * c.high})`,
        caption: `${c.low} < ${c.coef}√${c.rad} < ${c.high}`,
      },
      tableData: [
        {
          label: isEl ? '1. Μήκος πλευράς α' : '1. Side length α',
          details: <span>Ε ＝ α<sup>2</sup> ＝ {c.area} ⇒ α ＝ <Radical>{c.area}</Radical> ＝ <Radical>{c.coef * c.coef} · {c.rad}</Radical> ＝ {c.coef}<Radical>{c.rad}</Radical> m</span>,
        },
        {
          label: isEl ? '2. Θέση στην ευθεία ℝ' : '2. Position on ℝ',
          details: <span>{c.low * c.low} &lt; {c.area} &lt; {c.high * c.high} ⇒ {c.low} &lt; α &lt; {c.high}</span>,
        },
      ],
      explanation: <span>α ＝ <Radical>{c.area}</Radical> ＝ {c.coef}<Radical>{c.rad}</Radical> m ({isEl ? `ανάμεσα στο ${c.low} και στο ${c.high}` : `between ${c.low} and ${c.high}`}).</span>,
    };
  };

  const loadNewSet = () => {
    const usedSigs = new Set();

    const pickUniqueFromPool = (builder) => {
      const modes = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      for (const m of modes) {
        const item = builder(m);
        if (!usedSigs.has(item.sig)) {
          usedSigs.add(item.sig);
          return item;
        }
      }
      for (let attempt = 0; attempt < 25; attempt++) {
        const item = builder(randInt(0, 9));
        if (!usedSigs.has(item.sig)) {
          usedSigs.add(item.sig);
          return item;
        }
      }
      return builder(randInt(0, 9));
    };

    const slots = [
      // 2 ασκήσεις ανά κεφάλαιο (Κεφ. 1 έως 6)
      { ch: 1, num: 1, hard: false, fn: buildCh1Ex1 },
      { ch: 1, num: 2, hard: false, fn: buildCh1Ex2 },
      { ch: 2, num: 1, hard: false, fn: buildCh2Ex1 },
      { ch: 2, num: 2, hard: false, fn: buildCh2Ex2 },
      { ch: 3, num: 1, hard: false, fn: buildCh3Ex1 },
      { ch: 3, num: 2, hard: false, fn: buildCh3Ex2 },
      { ch: 4, num: 1, hard: false, fn: buildCh4Ex1 },
      { ch: 4, num: 2, hard: false, fn: buildCh4Ex2 },
      { ch: 5, num: 1, hard: false, fn: buildCh5Ex1 },
      { ch: 5, num: 2, hard: false, fn: buildCh5Ex2 },
      { ch: 6, num: 1, hard: false, fn: buildCh6Ex1 },
      { ch: 6, num: 2, hard: false, fn: buildCh6Ex2 },
      // 6 δύσκολα συνδυαστικά προβλήματα (1 από κάθε κεφάλαιο)
      { ch: 1, num: 1, hard: true, fn: buildProb1 },
      { ch: 2, num: 2, hard: true, fn: buildProb2 },
      { ch: 3, num: 3, hard: true, fn: buildProb3 },
      { ch: 4, num: 4, hard: true, fn: buildProb4 },
      { ch: 5, num: 5, hard: true, fn: buildProb5 },
      { ch: 6, num: 6, hard: true, fn: buildProb6 },
    ];

    const qList = slots.map((slot, index) => {
      const q = pickUniqueFromPool(slot.fn);
      return {
        ...q,
        id: index + 1,
        isHardProblem: slot.hard,
        badge: slot.hard
          ? isEl
            ? `ΠΡΟΒΛΗΜΑ ${slot.num} • ΚΕΦ. ${slot.ch} • ΥΨΗΛΗ ΔΥΣΚΟΛΙΑ`
            : `PROBLEM ${slot.num} • CH. ${slot.ch} • HIGH DIFFICULTY`
          : isEl
          ? `ΚΕΦ. ${slot.ch} • ΑΣΚΗΣΗ ${slot.num}`
          : `CH. ${slot.ch} • EXERCISE ${slot.num}`,
      };
    });

    setQuestions(qList);
    setUserAnswers({});
    setSubmitted(false);
    setScore(0);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    loadNewSet();
  }, [locale]);

  const handleAnswerChange = (qId, rawVal) => {
    if (submitted) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: rawVal }));
  };

  const sanitizeInput = (val) => {
    let sanitized = val.replace('.', ',').replace(/[^0-9,-]/g, '').replace(/(?!^)-/g, '');
    const parts = sanitized.split(',');
    if (parts.length > 2) {
      sanitized = parts[0] + ',' + parts.slice(1).join('');
    }
    return sanitized.slice(0, 10);
  };

  const handleSubmit = () => {
    let s = 0;
    questions.forEach((q) => {
      const uAns = userAnswers[q.id];
      if (uAns === undefined || uAns === null || uAns === '') return;

      if (q.type === 'input') {
        const parsedUser = parseFloat(String(uAns).replace(',', '.').trim());
        const parsedCorrect = parseFloat(String(q.correct).replace(',', '.').trim());
        if (!isNaN(parsedUser) && Math.abs(parsedUser - parsedCorrect) <= 0.05) {
          s += 1;
        }
      } else {
        if (String(uAns).trim() === String(q.correct).trim()) {
          s += 1;
        }
      }
    });

    setScore(s);
    setSubmitted(true);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const answeredCount = Object.keys(userAnswers).filter(
    (k) => userAnswers[k] !== '' && userAnswers[k] !== undefined
  ).length;
  const totalCount = questions.length || 18;

  const renderCorrectValue = (q) => {
    if (q.type === 'mcq' && Array.isArray(q.options)) {
      const found = q.options.find((o) => String(o.key).trim() === String(q.correct).trim());
      if (found) return found.node;
    }
    if (typeof q.correct === 'number') {
      return q.correct.toLocaleString(locCode);
    }
    return q.correct;
  };

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/b-gymnasiou"
      backText={t.backNav}
      showAds={true}
     
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] 8k:max-w-[5120px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 4k:px-24 8k:px-32 py-4 sm:py-6 pb-28 sm:pb-36 overflow-x-hidden text-slate-800 box-border">
        {/* Header Banner */}
        <section className="bg-gradient-to-r from-indigo-900 via-purple-900 to-blue-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 mb-6 sm:mb-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-1 bg-white/10 rounded-full text-indigo-200 text-[11px] sm:text-xs font-bold uppercase tracking-wider border border-white/10">
                {toCleanUppercase(t.heroBadge)}
              </span>
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-black mt-2 leading-tight break-words [overflow-wrap:anywhere]">
                {t.heroTitle}
              </h1>
              <p className="text-indigo-200 text-xs sm:text-base mt-1">{t.heroDesc}</p>
            </div>
            <div>
              <button
                type="button"
                onClick={loadNewSet}
                className="w-full sm:w-auto px-4 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 font-bold rounded-xl shadow transition-all duration-150 text-xs sm:text-sm whitespace-nowrap"
              >
                🔄 {toCleanUppercase(t.btnNewSet)}
              </button>
            </div>
          </div>
        </section>

        {/* Results Banner */}
        {submitted && (
          <section className="p-5 sm:p-8 bg-white border-2 border-indigo-200 rounded-2xl sm:rounded-3xl shadow-lg mb-6 sm:mb-8 text-center animate-fade-in">
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 mb-2">
              {t.scoreLabel}: {score} / {totalCount} ({Math.round((score / totalCount) * 100)}%)
            </h2>
            <p className="text-slate-600 text-xs sm:text-base max-w-xl mx-auto mb-4">
              {score >= 15 ? t.scoreGreat : score >= 9 ? t.scoreGood : t.scoreNeedWork}
            </p>
            <button
              type="button"
              onClick={loadNewSet}
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl sm:rounded-2xl shadow transition text-xs sm:text-sm"
            >
              🔄 {toCleanUppercase(t.btnTryNewSet)}
            </button>
          </section>
        )}

        {/* Λίστα 18 Ερωτήσεων */}
        <div className="space-y-4 sm:space-y-6">
          {questions.map((q, idx) => {
            const isHardProblem = q.isHardProblem;
            let isCorrect = false;
            if (submitted) {
              if (q.type === 'input') {
                const u = parseFloat(String(userAnswers[q.id]).replace(',', '.').trim());
                const c = parseFloat(String(q.correct).replace(',', '.').trim());
                isCorrect = !isNaN(u) && Math.abs(u - c) <= 0.05;
              } else {
                isCorrect = String(userAnswers[q.id]).trim() === String(q.correct).trim();
              }
            }

            return (
              <div
                key={q.id}
                className={`bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border transition-all min-w-0 ${
                  submitted
                    ? isCorrect
                      ? 'border-emerald-300 bg-emerald-50/20'
                      : 'border-rose-300 bg-rose-50/20'
                    : isHardProblem
                    ? 'border-amber-300/80 shadow-md'
                    : 'border-slate-200 shadow-sm'
                }`}
              >
                {/* Badge Κεφαλαίου / Δυσκολίας */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider ${
                      isHardProblem
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}
                  >
                    {toCleanUppercase(q.badge)}
                  </span>

                  {submitted && (
                    <span
                      className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold shrink-0 ${
                        isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isCorrect ? t.correctBadge : t.wrongBadge}
                    </span>
                  )}
                </div>

                {/* Header Ερώτησης */}
                <div className="flex items-center gap-2.5 mb-3">
                  <span
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl font-bold flex items-center justify-center text-xs sm:text-sm shrink-0 ${
                      isHardProblem ? 'bg-amber-500 text-white' : 'bg-indigo-100 text-indigo-700'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <h3 className="font-bold text-sm sm:text-lg text-slate-900 leading-snug break-words [overflow-wrap:anywhere]">
                    {q.title}
                  </h3>
                </div>

                {/* Εκφώνηση */}
                <div className="text-slate-800 text-xs sm:text-base leading-relaxed mb-4 sm:mb-6 font-medium break-words [overflow-wrap:anywhere]">
                  {q.prompt}
                </div>

                {/* Πεδία Απάντησης */}
                <div className="mb-2">
                  {q.type === 'tf' && (
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 max-w-xs sm:max-w-md">
                      {q.options.map((opt) => {
                        const isSelected = userAnswers[q.id] === opt;
                        return (
                          <button
                            type="button"
                            key={opt}
                            disabled={submitted}
                            onClick={() => handleAnswerChange(q.id, opt)}
                            className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm border transition-all ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {q.type === 'mcq' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {q.options.map((opt) => {
                        const isSelected = userAnswers[q.id] === opt.key;
                        return (
                          <button
                            type="button"
                            key={opt.key}
                            disabled={submitted}
                            onClick={() => handleAnswerChange(q.id, opt.key)}
                            className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl text-left border flex items-center gap-2.5 transition-all min-h-[48px] sm:min-h-[56px] min-w-0 ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            <span
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                isSelected ? 'border-white bg-white' : 'border-slate-400'
                              }`}
                            >
                              {isSelected && <span className="w-2 h-2 rounded-full bg-indigo-600" />}
                            </span>
                            <span className="break-words [overflow-wrap:anywhere] whitespace-normal leading-snug flex-1 font-semibold text-xs sm:text-sm">
                              {opt.node}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {q.type === 'input' && (
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 w-full sm:max-w-xs">
                      <input
                        type="text"
                        disabled={submitted}
                        value={userAnswers[q.id] || ''}
                        onChange={(e) => {
                          const sanitized = sanitizeInput(e.target.value);
                          handleAnswerChange(q.id, sanitized);
                        }}
                        placeholder={isEl ? 'Απάντηση...' : 'Answer...'}
                        className="w-full px-3.5 py-2 sm:px-4 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-bold text-slate-900 text-xs sm:text-sm"
                      />
                      {q.unit && (
                        <span className="text-xs sm:text-sm font-bold text-slate-500 whitespace-nowrap">
                          {q.unit}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* FEEDBACK SECTION (No-Giveaway: εμφανίζεται μόνο μετά το submit) */}
                {submitted && (
                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-200 space-y-3 animate-fade-in">
                    {q.diagram ? (
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                        <div className="md:col-span-5 min-w-0">
                          {renderFeedbackDiagram(q.diagram, isEl)}
                        </div>
                        <div className="md:col-span-7 space-y-3 min-w-0">
                          {q.tableData && q.tableData.length > 0 && (
                            <div className="w-full rounded-xl border border-slate-200 bg-white overflow-hidden">
                              <table className="w-full table-fixed text-xs text-left">
                                <thead className="bg-slate-100 text-slate-700 font-bold">
                                  <tr>
                                    <th className="p-2 sm:p-2.5 border-b w-[35%] break-words">{t.tableStep}</th>
                                    <th className="p-2 sm:p-2.5 border-b w-[65%] break-words">{t.tableAnalysis}</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs">
                                  {q.tableData.map((row, rIdx) => (
                                    <tr key={rIdx}>
                                      <td className="p-2 sm:p-2.5 font-semibold text-slate-800 align-top break-words [overflow-wrap:anywhere] leading-relaxed">
                                        {row.label}
                                      </td>
                                      <td className="p-2 sm:p-2.5 font-mono text-indigo-900 break-words [overflow-wrap:anywhere] align-top leading-relaxed">
                                        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                                          {row.details}
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}

                          <div className="p-3 sm:p-4 bg-slate-100/70 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-slate-800 leading-relaxed min-w-0">
                            <div className="font-bold text-slate-900 mb-1 flex flex-wrap items-center gap-x-1.5 gap-y-1">
                              <span>{t.correctAnswerTitle}</span>
                              <span className="font-mono text-emerald-700 font-bold inline-flex flex-wrap items-center gap-x-1 break-words [overflow-wrap:anywhere] max-w-full">
                                {renderCorrectValue(q)} {q.unit || ''}
                              </span>
                            </div>
                            <div className="mt-1 break-words [overflow-wrap:anywhere]">{q.explanation}</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 sm:p-4 bg-slate-100/70 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-slate-800 leading-relaxed min-w-0">
                        <div className="font-bold text-slate-900 mb-1 flex flex-wrap items-center gap-x-1.5 gap-y-1">
                          <span>{t.correctAnswerTitle}</span>
                          <span className="font-mono text-emerald-700 font-bold inline-flex flex-wrap items-center gap-x-1 break-words [overflow-wrap:anywhere] max-w-full">
                            {renderCorrectValue(q)} {q.unit || ''}
                          </span>
                        </div>
                        <div className="mt-1 break-words [overflow-wrap:anywhere]">{q.explanation}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* STICKY BOTTOM SCORE BAR */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white px-3 sm:px-6 py-2.5 sm:py-3.5 shadow-2xl">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
            <div className="min-w-0">
              {!submitted ? (
                <div className="text-[11px] sm:text-sm font-bold text-slate-300 truncate">
                  {toCleanUppercase(t.answeredLabel)}:{' '}
                  <span className="text-indigo-400 font-black">{answeredCount}</span> / {totalCount}
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 text-[11px] sm:text-sm font-black">
                  <span className="text-emerald-400">
                    {toCleanUppercase(isEl ? 'ΣΚΟΡ' : 'SCORE')}: {score} / {totalCount}
                  </span>
                  <span className="hidden xs:inline text-slate-500">|</span>
                  <span className="text-indigo-300">{Math.round((score / totalCount) * 100)}%</span>
                </div>
              )}
            </div>

            <div className="shrink-0 flex items-center gap-2">
              {!submitted ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={answeredCount === 0}
                  className={`px-3.5 py-2 sm:px-6 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
                    answeredCount > 0
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {toCleanUppercase(t.checkBtn)}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={loadNewSet}
                  className="px-3.5 py-2 sm:px-6 sm:py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition whitespace-nowrap"
                >
                  {toCleanUppercase(t.btnNewSet)}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
