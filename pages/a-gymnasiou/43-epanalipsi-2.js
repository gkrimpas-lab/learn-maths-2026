import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Βοηθητική συνάρτηση για άτονα κεφαλαία (διατηρεί μόνο το Α')
function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(Α')/g);
  return parts
    .map((part) => {
      if (part === "Α'") return "Α'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

// Επαναχρησιμοποιήσιμο Component Γωνίας (Το γράμμα μένει στη γραμμή, το ^ τοποθετείται από πάνω)
function Angle({ children, className = "" }) {
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

// Επαναχρησιμοποιήσιμο Component Τετραγωνικής Ρίζας (Inline SVG + Vinculum) - Responsive
function Radical({ children, className = "" }) {
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

// Επαναχρησιμοποιήσιμο Component Κλάσματος (Fraction) - Responsive
function Frac({ num, den, className = "" }) {
  return (
    <span className={`inline-flex flex-col text-center align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full ${className}`}>
      <span className="border-b border-current px-0.5 sm:px-1 pb-0.5 break-all">
        {num}
      </span>
      <span className="pt-0.5 break-all">
        {den}
      </span>
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

function ensureFourUniqueOptions(correct, distractorsGen) {
  const set = new Set([String(correct).trim()]);
  let attempts = 0;
  while (set.size < 4 && attempts < 100) {
    attempts++;
    const cand = distractorsGen();
    if (cand !== undefined && cand !== null && cand !== '') {
      set.add(String(cand).trim());
    }
  }
  let fallbackCount = 1;
  while (set.size < 4) {
    set.add(`${correct} (${fallbackCount++})`);
  }
  return shuffle(Array.from(set));
}

// Δυναμικό SVG Σχήμα Επεξήγησης (εμφανίζεται μόνο στο feedback μετά την υποβολή)
function renderFeedbackDiagram(diagram, isEl) {
  if (!diagram) return null;
  const v = isEl
    ? { A: 'Α', B: 'Β', C: 'Γ', H: 'Υ', D: 'Δ', M: 'Μ' }
    : { A: 'A', B: 'B', C: 'C', H: 'H', D: 'D', M: 'M' };

  // 1. Γενικό τρίγωνο ΑΒΓ
  if (diagram.type === 'general') {
    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 155" className="w-full max-w-[265px] h-36 select-none">
          <polygon points="120,24 38,125 224,125" fill="rgba(99, 102, 241, 0.22)" stroke="#818cf8" strokeWidth="2.2" strokeLinejoin="round" />
          <circle cx="120" cy="24" r="3.5" fill="#34d399" />
          <circle cx="38" cy="125" r="3.5" fill="#34d399" />
          <circle cx="224" cy="125" r="3.5" fill="#34d399" />
          <text x="120" y="15" textAnchor="middle" className="text-[11px] font-black fill-white">
            {diagram.angA ? `${v.A} (${diagram.angA}°)` : v.A}
          </text>
          <text x="38" y="143" textAnchor="middle" className="text-[11px] font-black fill-white">
            {diagram.angB ? `${v.B} (${diagram.angB}°)` : v.B}
          </text>
          <text x="224" y="143" textAnchor="middle" className="text-[11px] font-black fill-emerald-300">
            {diagram.angC ? `${v.C} (${diagram.angC}°)` : v.C}
          </text>
        </svg>
      </div>
    );
  }

  // 2. Ορθογώνιο τρίγωνο ΑΒΓ με Α = 90°
  if (diagram.type === 'right') {
    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 160" className="w-full max-w-[265px] h-36 select-none">
          <polygon points="58,28 58,126 218,126" fill="rgba(99, 102, 241, 0.22)" stroke="#818cf8" strokeWidth="2.2" strokeLinejoin="round" />
          <polyline points="58,114 70,114 70,126" fill="none" stroke="#34d399" strokeWidth="1.8" />
          <circle cx="58" cy="126" r="3.5" fill="#34d399" />
          <circle cx="58" cy="28" r="3.5" fill="#34d399" />
          <circle cx="218" cy="126" r="3.5" fill="#34d399" />
          <text x="58" y="144" textAnchor="middle" className="text-[11px] font-black fill-white">
            {v.A} (90°)
          </text>
          <text x="58" y="18" textAnchor="middle" className="text-[11px] font-black fill-sky-300">
            {diagram.labelB ? `${v.B} (${diagram.labelB})` : v.B}
          </text>
          <text x="218" y="144" textAnchor="middle" className="text-[11px] font-black fill-emerald-300">
            {diagram.labelC ? `${v.C} (${diagram.labelC})` : v.C}
          </text>
          {diagram.sideAB && (
            <text x="48" y="78" textAnchor="end" className="text-[10px] font-mono font-bold fill-amber-300">
              {diagram.sideAB}
            </text>
          )}
          {diagram.sideAC && (
            <text x="138" y="141" textAnchor="middle" className="text-[10px] font-mono font-bold fill-amber-300">
              {diagram.sideAC}
            </text>
          )}
          {diagram.sideBC && (
            <text x="148" y="70" textAnchor="start" className="text-[10px] font-mono font-bold fill-emerald-300">
              {diagram.sideBC}
            </text>
          )}
        </svg>
      </div>
    );
  }

  // 3. Ισοσκελές τρίγωνο ΑΒΓ με ΑΒ = ΑΓ
  if (diagram.type === 'isosceles') {
    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 270 165" className="w-full max-w-[270px] h-38 select-none">
          <polygon points="135,24 52,126 218,126" fill="rgba(99, 102, 241, 0.22)" stroke="#818cf8" strokeWidth="2.2" strokeLinejoin="round" />
          <line x1="88" y1="72" x2="98" y2="79" stroke="#34d399" strokeWidth="2" />
          <line x1="182" y1="72" x2="172" y2="79" stroke="#34d399" strokeWidth="2" />

          {diagram.showAltitude && (
            <>
              <line x1="135" y1="24" x2="135" y2="126" stroke="#34d399" strokeWidth="2" strokeDasharray="4 3" />
              <polyline points="135,115 146,115 146,126" fill="none" stroke="#34d399" strokeWidth="1.8" />
              <circle cx="135" cy="126" r="3.5" fill="#34d399" />
              <text x="135" y="142" textAnchor="middle" className="text-[11px] font-bold fill-emerald-300">
                {v.H}
              </text>
            </>
          )}

          <circle cx="135" cy="24" r="3.5" fill="#34d399" />
          <circle cx="52" cy="126" r="3.5" fill="#34d399" />
          <circle cx="218" cy="126" r="3.5" fill="#34d399" />

          <text x="135" y="15" textAnchor="middle" className="text-[11px] font-black fill-white">
            {diagram.labelA ? `${v.A} (${diagram.labelA})` : v.A}
          </text>
          <text x="44" y="142" textAnchor="middle" className="text-[11px] font-black fill-white">
            {diagram.labelB ? `${v.B} (${diagram.labelB})` : v.B}
          </text>
          <text x="226" y="142" textAnchor="middle" className="text-[11px] font-black fill-white">
            {diagram.labelC ? `${v.C} (${diagram.labelC})` : v.C}
          </text>

          {diagram.legLabel && (
            <>
              <text x="82" y="68" textAnchor="end" className="text-[10px] font-mono font-bold fill-amber-300">
                {diagram.legLabel}
              </text>
              <text x="188" y="68" textAnchor="start" className="text-[10px] font-mono font-bold fill-amber-300">
                {diagram.legLabel}
              </text>
            </>
          )}
          {diagram.baseLabel && (
            <text x="135" y="143" textAnchor="middle" className="text-[10px] font-mono font-bold fill-emerald-300">
              {diagram.baseLabel}
            </text>
          )}
          {diagram.halfBaseLabel && (
            <>
              <text x="94" y="156" textAnchor="middle" className="text-[10px] font-mono font-bold fill-emerald-300">
                {diagram.halfBaseLabel}
              </text>
              <text x="176" y="156" textAnchor="middle" className="text-[10px] font-mono font-bold fill-emerald-300">
                {diagram.halfBaseLabel}
              </text>
            </>
          )}
        </svg>
      </div>
    );
  }

  // 4. Γενικό τρίγωνο με διχοτόμο ΑΔ
  if (diagram.type === 'bisector') {
    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 270 165" className="w-full max-w-[270px] h-38 select-none">
          <polygon points="122,22 44,126 226,126" fill="rgba(99, 102, 241, 0.22)" stroke="#818cf8" strokeWidth="2.2" strokeLinejoin="round" />
          <line x1="122" y1="22" x2="140" y2="126" stroke="#fbbf24" strokeWidth="2.2" />
          <circle cx="122" cy="22" r="3.5" fill="#34d399" />
          <circle cx="44" cy="126" r="3.5" fill="#34d399" />
          <circle cx="226" cy="126" r="3.5" fill="#34d399" />
          <circle cx="140" cy="126" r="3.5" fill="#fbbf24" />

          <text x="122" y="14" textAnchor="middle" className="text-[11px] font-black fill-white">
            {v.A} ({diagram.angA}°)
          </text>
          <text x="38" y="142" textAnchor="middle" className="text-[11px] font-black fill-white">
            {v.B} ({diagram.angB}°)
          </text>
          <text x="230" y="142" textAnchor="middle" className="text-[11px] font-black fill-white">
            {v.C} ({diagram.angC}°)
          </text>
          <text x="140" y="143" textAnchor="middle" className="text-[11px] font-bold fill-amber-300">
            {v.D}
          </text>
          <text x="96" y="76" textAnchor="end" className="text-[10px] font-mono font-bold fill-amber-300">
            {diagram.halfA}°
          </text>
          <text x="150" y="76" textAnchor="start" className="text-[10px] font-mono font-bold fill-amber-300">
            {diagram.halfA}°
          </text>
        </svg>
      </div>
    );
  }

  return null;
}

export default function Epanalipsi2Exercises() {
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
    pageTitle: isEl ? "Επανάληψη 2: Κεφάλαια 05, 06 & 07 | Α' Γυμνασίου" : "Review 2: Chapters 05, 06 & 07 | Grade 7",
    pageDesc: isEl
      ? "Επαναληπτικές ασκήσεις και συνδυαστικά προβλήματα Α' Γυμνασίου στα Κεφάλαια 05 (Τα Τρίγωνα), 06 (Δευτερεύοντα Στοιχεία) και 07 (Άθροισμα Γωνιών Τριγώνου)."
      : "Grade 7 review exercises and challenging problems covering Chapters 05 (Triangles), 06 (Secondary Elements), and 07 (Sum of Triangle Angles).",
    backNav: isEl ? "Α' Γυμνασίου" : "Grade 7",
    theoryBtn: isEl ? "ΚΕΦΑΛΑΙΑ 05-07" : "CHAPTERS 05-07",
    heroBadge: isEl ? "ΕΠΑΝΑΛΗΨΗ 2 • ΚΕΦΑΛΑΙΑ 05, 06 & 07 • Α' ΓΥΜΝΑΣΙΟΥ" : "REVIEW 2 • CHAPTERS 05, 06 & 07 • GRADE 7",
    heroTitle: isEl ? "Επανάληψη 2: Τρίγωνα, Στοιχεία & Γωνίες" : "Review 2: Triangles, Elements & Angles",
    heroDesc: isEl
      ? "15 δυναμικές ερωτήσεις (4 ασκήσεις ανά κεφάλαιο + 3 απαιτητικά προβλήματα εφαρμογής στο τέλος). Κάθε νέο σετ παράγει διαφορετικά θέματα!"
      : "15 dynamic questions (4 exercises per chapter + 3 challenging problems at the end). Every new set generates fresh problems!",
    btnNewSet: isEl ? "ΝΕΟ ΕΠΑΝΑΛΗΠΤΙΚΟ ΣΕΤ" : "NEW REVIEW SET",
    btnTryNewSet: isEl ? "ΔΟΚΙΜΑΣΤΕ ΝΕΟ ΣΕΤ" : "TRY NEW SET",
    scoreLabel: isEl ? "Αποτέλεσμα" : "Score",
    scoreGreat: isEl
      ? "Άριστη επίδοση! Κατέχετε πλήρως τη γεωμετρία των τριγώνων (Κεφάλαια 05, 06 και 07)."
      : "Excellent performance! You have completely mastered triangle geometry (Chapters 05, 06, and 07).",
    scoreGood: isEl
      ? "Πολύ καλή προσπάθεια! Ελέγξτε τις αναλυτικές λύσεις και τα σχήματα στα προβλήματα που δυσκολευτήκατε."
      : "Very good effort! Check the detailed solutions and diagrams for any problems you missed.",
    scoreNeedWork: isEl
      ? "Χρειάζεται λίγη επανάληψη ακόμα στα Κεφάλαια 05, 06 και 07!"
      : "Needs a bit more review on Chapters 05, 06, and 07!",
    correctBadge: isEl ? "✓ Σωστό" : "✓ Correct",
    wrongBadge: isEl ? "✗ Λάθος" : "✗ Wrong",
    answeredLabel: isEl ? "ΑΠΑΝΤΗΘΗΚΑΝ" : "ANSWERED",
    checkBtn: isEl ? "ΕΛΕΓΧΟΣ" : "CHECK",
    correctAnswerTitle: isEl ? "Σωστή Απάντηση:" : "Correct Answer:",
    tableStep: isEl ? "Στοιχείο / Βήμα" : "Element / Step",
    tableAnalysis: isEl ? "Ανάλυση Δεδομένων" : "Data Analysis"
  };

  const loadNewSet = () => {
    const qList = [];

    // =========================================================================
    // ΜΕΡΟΣ Α: 4 ΑΣΚΗΣΕΙΣ ΑΠΟ ΤΟ ΚΕΦΑΛΑΙΟ 05 (Τα Τρίγωνα: Στοιχεία & Κατηγορίες)
    // =========================================================================

    // --- ΚΕΦ. 05 • ΑΣΚΗΣΗ 1: Πρωτεύοντα στοιχεία (Απέναντι πλευρά / γωνία / κορυφή) ---
    const triPool = isEl
      ? [
          { name: 'ΑΒΓ', v: ['Α', 'Β', 'Γ'], sides: ['ΒΓ', 'ΑΓ', 'ΑΒ'], small: ['α', 'β', 'γ'] },
          { name: 'ΔΕΖ', v: ['Δ', 'Ε', 'Ζ'], sides: ['ΕΖ', 'ΔΖ', 'ΔΕ'], small: ['δ', 'ε', 'ζ'] },
          { name: 'ΚΛΜ', v: ['Κ', 'Λ', 'Μ'], sides: ['ΛΜ', 'ΚΜ', 'ΚΛ'], small: ['κ', 'λ', 'μ'] },
          { name: 'ΠΡΣ', v: ['Π', 'Ρ', 'Σ'], sides: ['ΡΣ', 'ΠΣ', 'ΠΡ'], small: ['π', 'ρ', 'σ'] }
        ]
      : [
          { name: 'ABC', v: ['A', 'B', 'C'], sides: ['BC', 'AC', 'AB'], small: ['a', 'b', 'c'] },
          { name: 'DEF', v: ['D', 'E', 'F'], sides: ['EF', 'DF', 'DE'], small: ['d', 'e', 'f'] },
          { name: 'KLM', v: ['K', 'L', 'M'], sides: ['LM', 'KM', 'KL'], small: ['k', 'l', 'm'] },
          { name: 'PRS', v: ['P', 'R', 'S'], sides: ['RS', 'PS', 'PR'], small: ['p', 'r', 's'] }
        ];
    const triObj1 = pickRandom(triPool);
    const idx1 = randInt(0, 2);
    const mode1 = randInt(0, 1); // 0: Ποια πλευρά είναι απέναντι από κορυφή, 1: Ποια κορυφή είναι απέναντι από πλευρά

    const q1Prompt = mode1 === 0
      ? (isEl
          ? `Στο τρίγωνο ${triObj1.name}, ποια πλευρά βρίσκεται απέναντι από την κορυφή ${triObj1.v[idx1]};`
          : `In triangle ${triObj1.name}, which side lies opposite to vertex ${triObj1.v[idx1]}?`)
      : (isEl
          ? `Στο τρίγωνο ${triObj1.name}, ποια κορυφή βρίσκεται απέναντι από την πλευρά ${triObj1.sides[idx1]};`
          : `In triangle ${triObj1.name}, which vertex lies opposite to side ${triObj1.sides[idx1]}?`);

    const q1Correct = mode1 === 0 ? triObj1.sides[idx1] : triObj1.v[idx1];
    const q1Distractors = mode1 === 0
      ? [...triObj1.sides, `${triObj1.v[idx1]}${triObj1.v[(idx1 + 1) % 3]}`, `${triObj1.v[(idx1 + 2) % 3]}${triObj1.v[idx1]}`]
      : [...triObj1.v, triObj1.sides[0], triObj1.sides[1]];

    qList.push({
      id: 1,
      chapterBadge: isEl ? 'ΚΕΦ. 05 • ΑΣΚΗΣΗ 1' : 'CH. 05 • EXERCISE 1',
      title: isEl ? 'Πρωτεύοντα Στοιχεία Τριγώνου' : 'Primary Elements of a Triangle',
      prompt: q1Prompt,
      type: 'mcq',
      correct: q1Correct,
      options: ensureFourUniqueOptions(q1Correct, () => pickRandom(q1Distractors)),
      explanation: mode1 === 0
        ? (isEl
            ? `Η απέναντι πλευρά της κορυφής ${triObj1.v[idx1]} σχηματίζεται από τις άλλες δύο κορυφές, άρα είναι η πλευρά ${triObj1.sides[idx1]}.`
            : `The side opposite vertex ${triObj1.v[idx1]} connects the other two vertices, which is ${triObj1.sides[idx1]}.`)
        : (isEl
            ? `Η απέναντι κορυφή της πλευράς ${triObj1.sides[idx1]} είναι η κορυφή που δεν ανήκει σε αυτήν, δηλαδή η ${triObj1.v[idx1]}.`
            : `The vertex opposite side ${triObj1.sides[idx1]} is the vertex not on that segment, which is ${triObj1.v[idx1]}.`)
    });

    // --- ΚΕΦ. 05 • ΑΣΚΗΣΗ 2: Ταξινόμηση ως προς τις πλευρές ή ως προς τις γωνίες ---
    const q2Mode = randInt(0, 1); // 0: Από μήκη πλευρών, 1: Από μέτρα γωνιών
    if (q2Mode === 0) {
      const sideVariant = randInt(0, 2); // 0: Σκαληνό, 1: Ισοσκελές, 2: Ισόπλευρο
      let a2, b2, c2, corr2, expl2;
      if (sideVariant === 0) {
        a2 = randInt(4, 7);
        b2 = a2 + randInt(1, 2);
        c2 = b2 + randInt(1, 2);
        corr2 = isEl ? 'Σκαληνό τρίγωνο' : 'Scalene triangle';
        expl2 = isEl
          ? `Οι πλευρές ${a2} cm, ${b2} cm και ${c2} cm είναι όλες άνισες μεταξύ τους, άρα το τρίγωνο είναι σκαληνό.`
          : `All three sides (${a2} cm, ${b2} cm, ${c2} cm) are unequal, so it is a scalene triangle.`;
      } else if (sideVariant === 1) {
        const leg = randInt(6, 12);
        const base = randInt(3, 9);
        a2 = leg;
        b2 = leg;
        c2 = base === leg ? base + 1 : base;
        corr2 = isEl ? 'Ισοσκελές τρίγωνο' : 'Isosceles triangle';
        expl2 = isEl
          ? `Έχει δύο ίσες πλευρές (${leg} cm και ${leg} cm), οπότε είναι ισοσκελές τρίγωνο.`
          : `It has two equal sides (${leg} cm and ${leg} cm), so it is an isosceles triangle.`;
      } else {
        const eq = randInt(5, 14);
        a2 = eq;
        b2 = eq;
        c2 = eq;
        corr2 = isEl ? 'Ισόπλευρο τρίγωνο' : 'Equilateral triangle';
        expl2 = isEl
          ? `Και οι τρεις πλευρές είναι ίσες με ${eq} cm, άρα είναι ισόπλευρο τρίγωνο.`
          : `All three sides equal ${eq} cm, so it is an equilateral triangle.`;
      }
      const dist2 = isEl
        ? ['Σκαληνό τρίγωνο', 'Ισοσκελές τρίγωνο', 'Ισόπλευρο τρίγωνο', 'Ορθογώνιο τρίγωνο', 'Αμβλυγώνιο τρίγωνο']
        : ['Scalene triangle', 'Isosceles triangle', 'Equilateral triangle', 'Right triangle', 'Obtuse triangle'];

      qList.push({
        id: 2,
        chapterBadge: isEl ? 'ΚΕΦ. 05 • ΑΣΚΗΣΗ 2' : 'CH. 05 • EXERCISE 2',
        title: isEl ? 'Κατηγορίες Τριγώνων (Πλευρές)' : 'Triangle Classification (Sides)',
        prompt: isEl
          ? `Ένα τρίγωνο έχει πλευρές μήκους ${a2} cm, ${b2} cm και ${c2} cm. Πώς χαρακτηρίζεται ως προς τις πλευρές του;`
          : `A triangle has side lengths ${a2} cm, ${b2} cm, and ${c2} cm. How is it classified by its sides?`,
        type: 'mcq',
        correct: corr2,
        options: ensureFourUniqueOptions(corr2, () => pickRandom(dist2)),
        explanation: expl2
      });
    } else {
      const angVariant = randInt(0, 2); // 0: Οξυγώνιο, 1: Ορθογώνιο, 2: Αμβλυγώνιο
      let x2, y2, z2, corr2, expl2;
      if (angVariant === 0) {
        x2 = randInt(48, 68);
        y2 = randInt(52, 72);
        z2 = 180 - x2 - y2;
        corr2 = isEl ? 'Οξυγώνιο τρίγωνο' : 'Acute triangle';
        expl2 = isEl
          ? `Και οι τρεις γωνίες (${x2}°, ${y2}°, ${z2}°) είναι μικρότερες από 90° (οξείες), άρα είναι οξυγώνιο.`
          : `All three angles (${x2}°, ${y2}°, ${z2}°) are less than 90° (acute), so it is an acute triangle.`;
      } else if (angVariant === 1) {
        x2 = 90;
        y2 = randInt(24, 66);
        z2 = 90 - y2;
        corr2 = isEl ? 'Ορθογώνιο τρίγωνο' : 'Right triangle';
        expl2 = isEl
          ? `Έχει μία ορθή γωνία (90°), άρα είναι ορθογώνιο τρίγωνο.`
          : `It has a 90° right angle, so it is a right triangle.`;
      } else {
        x2 = randInt(98, 134);
        y2 = randInt(18, 38);
        z2 = 180 - x2 - y2;
        corr2 = isEl ? 'Αμβλυγώνιο τρίγωνο' : 'Obtuse triangle';
        expl2 = isEl
          ? `Η γωνία ${x2}° είναι μεγαλύτερη από 90° (αμβλεία), άρα το τρίγωνο είναι αμβλυγώνιο.`
          : `The angle ${x2}° is greater than 90° (obtuse), so it is an obtuse triangle.`;
      }
      const dist2 = isEl
        ? ['Οξυγώνιο τρίγωνο', 'Ορθογώνιο τρίγωνο', 'Αμβλυγώνιο τρίγωνο', 'Ισόπλευρο τρίγωνο', 'Σκαληνό τρίγωνο']
        : ['Acute triangle', 'Right triangle', 'Obtuse triangle', 'Equilateral triangle', 'Scalene triangle'];

      qList.push({
        id: 2,
        chapterBadge: isEl ? 'ΚΕΦ. 05 • ΑΣΚΗΣΗ 2' : 'CH. 05 • EXERCISE 2',
        title: isEl ? 'Κατηγορίες Τριγώνων (Γωνίες)' : 'Triangle Classification (Angles)',
        prompt: isEl
          ? `Οι γωνίες ενός τριγώνου έχουν μέτρα ${x2}°, ${y2}° και ${z2}°. Πώς χαρακτηρίζεται ως προς τις γωνίες του;`
          : `The angles of a triangle measure ${x2}°, ${y2}°, and ${z2}°. How is it classified by its angles?`,
        type: 'mcq',
        correct: corr2,
        options: ensureFourUniqueOptions(corr2, () => pickRandom(dist2)),
        explanation: expl2
      });
    }

    // --- ΚΕΦ. 05 • ΑΣΚΗΣΗ 3: Διπλή Ταξινόμηση & Υποτείνουσα / Δυνατοί Συνδυασμοί ---
    const q3Type = randInt(0, 2);
    if (q3Type === 0) {
      const rightConfigs = isEl
        ? [
            { tri: 'ΑΒΓ', rV: 'Α', hyp: 'ΒΓ', legs: 'ΑΒ και ΑΓ' },
            { tri: 'ΑΒΓ', rV: 'Β', hyp: 'ΑΓ', legs: 'ΑΒ και ΒΓ' },
            { tri: 'ΔΕΖ', rV: 'Ε', hyp: 'ΔΖ', legs: 'ΔΕ και ΕΖ' },
            { tri: 'ΚΛΜ', rV: 'Μ', hyp: 'ΚΛ', legs: 'ΚΜ και ΛΜ' }
          ]
        : [
            { tri: 'ABC', rV: 'A', hyp: 'BC', legs: 'AB and AC' },
            { tri: 'ABC', rV: 'B', hyp: 'AC', legs: 'AB and BC' },
            { tri: 'DEF', rV: 'E', hyp: 'DF', legs: 'DE and EF' },
            { tri: 'KLM', rV: 'M', hyp: 'KL', legs: 'KM and LM' }
          ];
      const cfg = pickRandom(rightConfigs);
      const dist3 = isEl
        ? ['ΑΒ', 'ΑΓ', 'ΒΓ', 'ΔΕ', 'ΕΖ', 'ΔΖ', 'ΚΜ', 'ΛΜ', 'ΚΛ']
        : ['AB', 'AC', 'BC', 'DE', 'EF', 'DF', 'KM', 'LM', 'KL'];

      qList.push({
        id: 3,
        chapterBadge: isEl ? 'ΚΕΦ. 05 • ΑΣΚΗΣΗ 3' : 'CH. 05 • EXERCISE 3',
        title: isEl ? 'Υποτείνουσα Ορθογωνίου Τριγώνου' : 'Hypotenuse of a Right Triangle',
        prompt: isEl ? (
          <span>
            Το τρίγωνο {cfg.tri} είναι ορθογώνιο με <Angle>{cfg.rV}</Angle> ＝ 90°. Ποια πλευρά είναι η υποτείνουσά του;
          </span>
        ) : (
          <span>
            Triangle {cfg.tri} is a right triangle with ∠{cfg.rV} ＝ 90°. Which side is its hypotenuse?
          </span>
        ),
        type: 'mcq',
        correct: cfg.hyp,
        options: ensureFourUniqueOptions(cfg.hyp, () => pickRandom(dist3)),
        explanation: isEl ? (
          <span>
            Η υποτείνουσα βρίσκεται πάντα απέναντι από την ορθή γωνία <Angle>{cfg.rV}</Angle>, άρα είναι η πλευρά {cfg.hyp} (ενώ κάθετες πλευρές είναι οι {cfg.legs}).
          </span>
        ) : (
          <span>
            The hypotenuse always lies opposite the right angle ∠{cfg.rV}, which is side {cfg.hyp} (while {cfg.legs} are the legs).
          </span>
        )
      });
    } else if (q3Type === 1) {
      const corr3 = isEl ? 'Ορθογώνιο ισόπλευρο τρίγωνο' : 'Right equilateral triangle';
      const dist3 = isEl
        ? [
            'Ορθογώνιο ισόπλευρο τρίγωνο',
            'Ορθογώνιο ισοσκελές τρίγωνο',
            'Αμβλυγώνιο ισοσκελές τρίγωνο',
            'Οξυγώνιο σκαληνό τρίγωνο',
            'Αμβλυγώνιο σκαληνό τρίγωνο'
          ]
        : [
            'Right equilateral triangle',
            'Right isosceles triangle',
            'Obtuse isosceles triangle',
            'Acute scalene triangle',
            'Obtuse scalene triangle'
          ];
      qList.push({
        id: 3,
        chapterBadge: isEl ? 'ΚΕΦ. 05 • ΑΣΚΗΣΗ 3' : 'CH. 05 • EXERCISE 3',
        title: isEl ? 'Διπλή Ταξινόμηση Τριγώνων' : 'Dual Classification of Triangles',
        prompt: isEl
          ? 'Ποιος από τους παρακάτω συνδυασμούς κατηγοριών είναι ΑΔΥΝΑΤΟ να υπάρξει σε ένα τρίγωνο;'
          : 'Which of the following category combinations is IMPOSSIBLE for a triangle?',
        type: 'mcq',
        correct: corr3,
        options: ensureFourUniqueOptions(corr3, () => pickRandom(dist3)),
        explanation: isEl
          ? 'Κάθε ισόπλευρο τρίγωνο έχει όλες τις γωνίες του ίσες με 60°, άρα είναι ΠΑΝΤΑ οξυγώνιο και ποτέ ορθογώνιο ή αμβλυγώνιο.'
          : 'Every equilateral triangle has all angles equal to 60°, so it is ALWAYS acute and never right or obtuse.'
      });
    } else {
      const tfTrue = Math.random() < 0.5;
      qList.push({
        id: 3,
        chapterBadge: isEl ? 'ΚΕΦ. 05 • ΑΣΚΗΣΗ 3' : 'CH. 05 • EXERCISE 3',
        title: isEl ? 'Ιδιότητες Ισόπλευρου & Ισοσκελούς' : 'Properties of Equilateral & Isosceles Triangles',
        prompt: tfTrue
          ? (isEl
              ? 'Κάθε ισόπλευρο τρίγωνο είναι ταυτόχρονα και ισοσκελές.'
              : 'Every equilateral triangle is also an isosceles triangle.')
          : (isEl
              ? 'Ένα ισοσκελές τρίγωνο είναι υποχρεωτικά πάντα οξυγώνιο.'
              : 'An isosceles triangle is necessarily always acute.'),
        type: 'tf',
        correct: tfTrue ? (isEl ? 'Σωστό' : 'True') : (isEl ? 'Λάθος' : 'False'),
        options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
        explanation: isEl
          ? 'Το ισόπλευρο έχει 3 ίσες πλευρές, άρα έχει και τουλάχιστον 2 ίσες πλευρές (ισοσκελές). Αντίθετα, ένα ισοσκελές μπορεί να είναι οξυγώνιο, ορθογώνιο (90°, 45°, 45°) ή αμβλυγώνιο.'
          : 'An equilateral triangle has 3 equal sides, hence at least 2 equal sides (isosceles). Conversely, an isosceles triangle can be acute, right, or obtuse.'
      });
    }

    // --- ΚΕΦ. 05 • ΑΣΚΗΣΗ 4: Περίμετρος & Πλευρές Ισοσκελούς (εύρεση σκέλους ή βάσης) ---
    const findLeg4 = Math.random() < 0.5;
    const base4 = randInt(3, 8) * 2;
    const leg4 = randInt(7, 15);
    const perim4 = 2 * leg4 + base4;

    qList.push({
      id: 4,
      chapterBadge: isEl ? 'ΚΕΦ. 05 • ΑΣΚΗΣΗ 4' : 'CH. 05 • EXERCISE 4',
      title: isEl ? 'Περίμετρος & Πλευρές Ισοσκελούς' : 'Perimeter & Sides of an Isosceles Triangle',
      prompt: findLeg4
        ? (isEl ? (
            <span>
              Ένα ισοσκελές τρίγωνο ΑΒΓ (ΑΒ ＝ ΑΓ) έχει περίμετρο Π ＝ {perim4} cm και βάση ΒΓ ＝ {base4} cm. Πόσα εκατοστά (cm) είναι το μήκος καθενός από τα δύο ίσα σκέλη ΑΒ και ΑΓ;
            </span>
          ) : (
            <span>
              An isosceles triangle ABC (AB ＝ AC) has perimeter P ＝ {perim4} cm and base BC ＝ {base4} cm. What is the length in cm of each equal leg AB and AC?
            </span>
          ))
        : (isEl ? (
            <span>
              Ένα ισοσκελές τρίγωνο ΑΒΓ (ΑΒ ＝ ΑΓ) έχει περίμετρο Π ＝ {perim4} cm και καθένα από τα ίσα σκέλη του έχει μήκος {leg4} cm. Πόσα εκατοστά (cm) είναι το μήκος της βάσης ΒΓ;
            </span>
          ) : (
            <span>
              An isosceles triangle ABC (AB ＝ AC) has perimeter P ＝ {perim4} cm and each equal leg measures {leg4} cm. What is the length of base BC in cm?
            </span>
          )),
      type: 'input',
      correct: findLeg4 ? leg4 : base4,
      unit: 'cm',
      diagram: { type: 'isosceles', legLabel: `${leg4} cm`, baseLabel: `${base4} cm`, showAltitude: false },
      explanation: findLeg4 ? (
        <span className="inline-flex flex-wrap items-center gap-1.5">
          <span>{isEl ? 'Αφαιρούμε τη βάση από την περίμετρο και διαιρούμε διά 2:' : 'Subtract the base from the perimeter and divide by 2:'}</span>
          <span className="inline-flex items-center font-mono">
            ΑΒ ＝ <Frac num={`${perim4} － ${base4}`} den="2" /> ＝ <Frac num={2 * leg4} den="2" /> ＝ {leg4} cm.
          </span>
        </span>
      ) : (
        <span className="font-mono">
          {isEl
            ? `ΒΓ ＝ ${perim4} － 2 · ${leg4} ＝ ${perim4} － ${2 * leg4} ＝ ${base4} cm.`
            : `BC ＝ ${perim4} － 2 · ${leg4} ＝ ${perim4} － ${2 * leg4} ＝ ${base4} cm.`}
        </span>
      )
    });

    // =========================================================================
    // ΜΕΡΟΣ Β: 4 ΑΣΚΗΣΕΙΣ ΑΠΟ ΤΟ ΚΕΦΑΛΑΙΟ 06 (Δευτερεύοντα Στοιχεία Τριγώνων)
    // =========================================================================

    // --- ΚΕΦ. 06 • ΑΣΚΗΣΗ 1: Αναγνώριση Δευτερεύοντος Στοιχείου (Διάμεσος / Διχοτόμος / Ύψος) ---
    const elemCase5 = randInt(0, 2);
    const elemCorrect5 = isEl
      ? ['Διάμεσος', 'Διχοτόμος', 'Ύψος'][elemCase5]
      : ['Median', 'Angle bisector', 'Altitude'][elemCase5];
    const elemDistractors5 = isEl
      ? ['Διάμεσος', 'Διχοτόμος', 'Ύψος', 'Υποτείνουσα', 'Βάση', 'Μεσοκάθετος']
      : ['Median', 'Angle bisector', 'Altitude', 'Hypotenuse', 'Base', 'Perpendicular bisector'];

    const elemPrompts5 = [
      isEl ? (
        <span>Σε τρίγωνο ΑΒΓ, το σημείο Μ ανήκει στη ΒΓ ώστε ΒΜ ＝ ΜΓ. Τι είναι το ευθύγραμμο τμήμα ΑΜ;</span>
      ) : (
        <span>In triangle ABC, point M lies on BC such that BM ＝ MC. What is segment AM?</span>
      ),
      isEl ? (
        <span>Σε τρίγωνο ΑΒΓ, το σημείο Δ ανήκει στη ΒΓ ώστε Β<Angle>Α</Angle>Δ ＝ Δ<Angle>Α</Angle>Γ. Τι είναι το τμήμα ΑΔ;</span>
      ) : (
        <span>In triangle ABC, point D lies on BC such that ∠BAD ＝ ∠DAC. What is segment AD?</span>
      ),
      isEl ? (
        <span>Σε τρίγωνο ΑΒΓ, το ευθύγραμμο τμήμα ΑΥ είναι κάθετο στην ευθεία της απέναντι πλευράς ΒΓ (ΑΥ ⊥ ΒΓ). Τι είναι το ΑΥ;</span>
      ) : (
        <span>In triangle ABC, segment AH is perpendicular to the line containing side BC (AH ⊥ BC). What is AH?</span>
      )
    ];

    const elemExpls5 = [
      isEl
        ? 'Το τμήμα που ενώνει μια κορυφή με το μέσο της απέναντι πλευράς (ΒΜ ＝ ΜΓ) ονομάζεται διάμεσος.'
        : 'The segment joining a vertex to the midpoint of the opposite side (BM ＝ MC) is a median.',
      isEl ? (
        <span>Το τμήμα που χωρίζει τη γωνία <Angle>Α</Angle> σε δύο ίσες γωνίες (Β<Angle>Α</Angle>Δ ＝ Δ<Angle>Α</Angle>Γ) είναι διχοτόμος.</span>
      ) : (
        <span>The segment dividing ∠A into two equal angles (∠BAD ＝ ∠DAC) is an angle bisector.</span>
      ),
      isEl
        ? 'Το κάθετο ευθύγραμμο τμήμα από μια κορυφή προς την ευθεία της απέναντι πλευράς (ΑΥ ⊥ ΒΓ) ονομάζεται ύψος.'
        : 'The perpendicular segment from a vertex to the line of the opposite side (AH ⊥ BC) is an altitude.'
    ];

    qList.push({
      id: 5,
      chapterBadge: isEl ? 'ΚΕΦ. 06 • ΑΣΚΗΣΗ 1' : 'CH. 06 • EXERCISE 1',
      title: isEl ? 'Αναγνώριση Δευτερεύοντος Στοιχείου' : 'Identifying a Secondary Element',
      prompt: elemPrompts5[elemCase5],
      type: 'mcq',
      correct: elemCorrect5,
      options: ensureFourUniqueOptions(elemCorrect5, () => pickRandom(elemDistractors5)),
      explanation: elemExpls5[elemCase5]
    });

    // --- ΚΕΦ. 06 • ΑΣΚΗΣΗ 2: Αξιόλογα Σημεία (Έγκεντρο / Ορθόκεντρο / Βαρύκεντρο) ---
    const ptCase6 = randInt(0, 2);
    const ptCorrect6 = isEl
      ? ['Έγκεντρο', 'Ορθόκεντρο', 'Βαρύκεντρο'][ptCase6]
      : ['Incenter', 'Orthocenter', 'Centroid'][ptCase6];
    const ptDistractors6 = isEl
      ? ['Έγκεντρο', 'Ορθόκεντρο', 'Βαρύκεντρο', 'Περίκεντρο', 'Κορυφή', 'Μέσο πλευράς']
      : ['Incenter', 'Orthocenter', 'Centroid', 'Circumcenter', 'Vertex', 'Midpoint'];

    const ptPrompts6 = isEl
      ? [
          'Πώς ονομάζεται το σημείο τομής των τριών διχοτόμων ενός τριγώνου, το οποίο είναι και το κέντρο του εγγεγραμμένου κύκλου;',
          'Πώς ονομάζεται το κοινό σημείο από το οποίο διέρχονται οι ευθείες των τριών υψών ενός τριγώνου;',
          'Πώς ονομάζεται το κοινό σημείο τομής των τριών διαμέσων ενός τριγώνου;'
        ]
      : [
          'What is the intersection point of the three angle bisectors of a triangle, which is also the center of the inscribed circle?',
          'What is the common point through which the lines containing the three altitudes of a triangle pass?',
          'What is the common intersection point of the three medians of a triangle?'
        ];

    const ptExpls6 = isEl
      ? [
          'Οι τρεις διχοτόμοι τέμνονται πάντοτε στο εσωτερικό του τριγώνου στο έγκεντρο (Ι), που ισαπέχει από τις 3 πλευρές.',
          'Οι ευθείες των τριών υψών ενός τριγώνου τέμνονται στο ορθόκεντρο (Η).',
          'Οι τρεις διάμεσοι ενός τριγώνου τέμνονται στο βαρύκεντρο (G), που είναι το κέντρο βάρους του τριγώνου.'
        ]
      : [
          'The three angle bisectors intersect inside the triangle at the incenter (I), equidistant from all three sides.',
          'The lines containing the three altitudes intersect at the orthocenter (H).',
          'The three medians intersect at the centroid (G), the center of mass of the triangle.'
      ];

    qList.push({
      id: 6,
      chapterBadge: isEl ? 'ΚΕΦ. 06 • ΑΣΚΗΣΗ 2' : 'CH. 06 • EXERCISE 2',
      title: isEl ? 'Έγκεντρο, Ορθόκεντρο & Βαρύκεντρο' : 'Incenter, Orthocenter & Centroid',
      prompt: ptPrompts6[ptCase6],
      type: 'mcq',
      correct: ptCorrect6,
      options: ensureFourUniqueOptions(ptCorrect6, () => pickRandom(ptDistractors6)),
      explanation: ptExpls6[ptCase6]
    });

    // --- ΚΕΦ. 06 • ΑΣΚΗΣΗ 3: Θέση Ορθοκέντρου & Εγκέντρου ανά είδος τριγώνου ---
    const locCase7 = randInt(0, 3);
    const locData7 = isEl
      ? [
          {
            q: 'Πού βρίσκεται το ορθόκεντρο ενός οξυγώνιου τριγώνου;',
            c: 'Στο εσωτερικό του τριγώνου',
            e: 'Στο οξυγώνιο τρίγωνο και τα 3 ύψη πέφτουν πάνω στις πλευρές, οπότε το ορθόκεντρο είναι στο εσωτερικό του.'
          },
          {
            q: 'Πού βρίσκεται το ορθόκεντρο ενός ορθογώνιου τριγώνου;',
            c: 'Στην κορυφή της ορθής γωνίας',
            e: 'Οι δύο κάθετες πλευρές ταυτίζονται με δύο ύψη, άρα το ορθόκεντρο είναι η κορυφή της ορθής γωνίας.'
          },
          {
            q: 'Πού βρίσκεται το ορθόκεντρο ενός αμβλυγώνιου τριγώνου;',
            c: 'Στο εξωτερικό του τριγώνου',
            e: 'Τα δύο ύψη πέφτουν στις προεκτάσεις των πλευρών και οι ευθείες των υψών τέμνονται έξω από το τρίγωνο.'
          },
          {
            q: 'Πού βρίσκεται το έγκεντρο ενός αμβλυγώνιου τριγώνου;',
            c: 'Στο εσωτερικό του τριγώνου',
            e: 'Το έγκεντρο (τομή διχοτόμων) βρίσκεται ΠΑΝΤΟΤΕ στο εσωτερικό κάθε τριγώνου, ακόμη κι αν είναι αμβλυγώνιο.'
          }
        ]
      : [
          {
            q: 'Where is the orthocenter of an acute triangle located?',
            c: 'Strictly inside the triangle',
            e: 'In an acute triangle all 3 altitudes fall inside, so the orthocenter lies strictly inside the triangle.'
          },
          {
            q: 'Where is the orthocenter of a right triangle located?',
            c: 'At the vertex of the right angle',
            e: 'The two legs serve as altitudes, so the orthocenter coincides with the right-angle vertex.'
          },
          {
            q: 'Where is the orthocenter of an obtuse triangle located?',
            c: 'Strictly outside the triangle',
            e: 'Two altitudes fall onto side extensions and their lines intersect strictly outside the triangle.'
          },
          {
            q: 'Where is the incenter of an obtuse triangle located?',
            c: 'Strictly inside the triangle',
            e: 'The incenter (intersection of bisectors) ALWAYS lies strictly inside every triangle, even obtuse ones.'
          }
        ];
    const pickedLoc7 = locData7[locCase7];
    const locDist7 = isEl
      ? [
          'Στο εσωτερικό του τριγώνου',
          'Στην κορυφή της ορθής γωνίας',
          'Στο εξωτερικό του τριγώνου',
          'Στο μέσο της μεγαλύτερης πλευράς',
          'Πάνω στην υποτείνουσα'
        ]
      : [
          'Strictly inside the triangle',
          'At the vertex of the right angle',
          'Strictly outside the triangle',
          'At the midpoint of the longest side',
          'On the hypotenuse'
        ];

    qList.push({
      id: 7,
      chapterBadge: isEl ? 'ΚΕΦ. 06 • ΑΣΚΗΣΗ 3' : 'CH. 06 • EXERCISE 3',
      title: isEl ? 'Θέση Ορθοκέντρου & Εγκέντρου' : 'Location of Orthocenter & Incenter',
      prompt: pickedLoc7.q,
      type: 'mcq',
      correct: pickedLoc7.c,
      options: ensureFourUniqueOptions(pickedLoc7.c, () => pickRandom(locDist7)),
      explanation: pickedLoc7.e
    });

    // --- ΚΕΦ. 06 • ΑΣΚΗΣΗ 4: Υπολογισμός με Διάμεσο ή Διχοτόμο ---
    const calcMode8 = randInt(0, 3);
    if (calcMode8 === 0) {
      const bm8 = randInt(6, 16);
      const bc8 = 2 * bm8;
      qList.push({
        id: 8,
        chapterBadge: isEl ? 'ΚΕΦ. 06 • ΑΣΚΗΣΗ 4' : 'CH. 06 • EXERCISE 4',
        title: isEl ? 'Υπολογισμός Πλευράς με Διάμεσο' : 'Side Calculation with Median',
        prompt: isEl
          ? `Σε τρίγωνο ΑΒΓ, η ΑΜ είναι διάμεσος και το τμήμα ΒΜ έχει μήκος ${bm8} cm. Πόσα εκατοστά (cm) είναι ολόκληρη η πλευρά ΒΓ;`
          : `In triangle ABC, AM is a median and BM ＝ ${bm8} cm. What is the length of side BC in cm?`,
        type: 'input',
        correct: bc8,
        unit: 'cm',
        explanation: isEl
          ? `Η διάμεσος ΑΜ τέμνει τη ΒΓ στο μέσο της, άρα ΒΓ ＝ 2 · ΒΜ ＝ 2 · ${bm8} ＝ ${bc8} cm.`
          : `Median AM bisects BC at its midpoint, so BC ＝ 2 · BM ＝ 2 · ${bm8} ＝ ${bc8} cm.`
      });
    } else if (calcMode8 === 1) {
      const half8 = randInt(5, 14);
      const full8 = 2 * half8;
      qList.push({
        id: 8,
        chapterBadge: isEl ? 'ΚΕΦ. 06 • ΑΣΚΗΣΗ 4' : 'CH. 06 • EXERCISE 4',
        title: isEl ? 'Υπολογισμός Τμήματος με Διάμεσο' : 'Segment Calculation with Median',
        prompt: isEl
          ? `Σε τρίγωνο ΑΒΓ, η πλευρά ΒΓ έχει μήκος ${full8} cm και ΑΜ είναι η διάμεσος που αντιστοιχεί στη ΒΓ. Πόσα εκατοστά (cm) είναι το μήκος ΜΓ;`
          : `In triangle ABC, side BC measures ${full8} cm and AM is the median to BC. What is the length of MC in cm?`,
        type: 'input',
        correct: half8,
        unit: 'cm',
        explanation: (
          <span className="inline-flex flex-wrap items-center gap-1.5">
            <span>{isEl ? 'Το σημείο Μ είναι το μέσο της ΒΓ, άρα:' : 'Point M is the midpoint of BC, so:'}</span>
            <span className="inline-flex items-center font-mono">
              ΜΓ ＝ <Frac num={full8} den="2" /> ＝ {half8} cm.
            </span>
          </span>
        )
      });
    } else if (calcMode8 === 2) {
      const angA8 = randInt(22, 46) * 2;
      const halfA8 = angA8 / 2;
      qList.push({
        id: 8,
        chapterBadge: isEl ? 'ΚΕΦ. 06 • ΑΣΚΗΣΗ 4' : 'CH. 06 • EXERCISE 4',
        title: isEl ? 'Υπολογισμός Γωνίας με Διχοτόμο' : 'Angle Calculation with Bisector',
        prompt: isEl ? (
          <span>
            Σε τρίγωνο ΑΒΓ, η ΑΔ είναι διχοτόμος της γωνίας <Angle>Α</Angle> ＝ {angA8}°. Πόσες μοίρες είναι η γωνία Β<Angle>Α</Angle>Δ;
          </span>
        ) : (
          <span>
            In triangle ABC, AD is the angle bisector of ∠A ＝ {angA8}°. How many degrees is angle ∠BAD?
          </span>
        ),
        type: 'input',
        correct: halfA8,
        unit: '°',
        explanation: (
          <span className="inline-flex flex-wrap items-center gap-1.5">
            <span>{isEl ? 'Η διχοτόμος ΑΔ διαιρεί τη γωνία Α διά 2:' : 'Bisector AD divides ∠A by 2:'}</span>
            <span className="inline-flex items-center font-mono">
              Β<Angle>Α</Angle>Δ ＝ <Frac num={`${angA8}°`} den="2" /> ＝ {halfA8}°.
            </span>
          </span>
        )
      });
    } else {
      const halfA8 = randInt(19, 43);
      const angA8 = 2 * halfA8;
      qList.push({
        id: 8,
        chapterBadge: isEl ? 'ΚΕΦ. 06 • ΑΣΚΗΣΗ 4' : 'CH. 06 • EXERCISE 4',
        title: isEl ? 'Υπολογισμός Γωνίας με Διχοτόμο' : 'Angle Calculation with Bisector',
        prompt: isEl ? (
          <span>
            Σε τρίγωνο ΑΒΓ, η ΑΔ είναι διχοτόμος της γωνίας <Angle>Α</Angle>. Αν η γωνία Γ<Angle>Α</Angle>Δ είναι {halfA8}°, πόσες μοίρες είναι ολόκληρη η γωνία <Angle>Α</Angle>;
          </span>
        ) : (
          <span>
            In triangle ABC, AD is the angle bisector of ∠A. If ∠CAD ＝ {halfA8}°, how many degrees is the whole angle ∠A?
          </span>
        ),
        type: 'input',
        correct: angA8,
        unit: '°',
        explanation: isEl ? (
          <span>
            Επειδή η ΑΔ είναι διχοτόμος, <Angle>Α</Angle> ＝ 2 · Γ<Angle>Α</Angle>Δ ＝ 2 · {halfA8}° ＝ {angA8}°.
          </span>
        ) : (
          <span>
            Since AD is the angle bisector, ∠A ＝ 2 · ∠CAD ＝ 2 · {halfA8}° ＝ {angA8}°.
          </span>
        )
      });
    }

    // =========================================================================
    // ΜΕΡΟΣ Γ: 4 ΑΣΚΗΣΕΙΣ ΑΠΟ ΤΟ ΚΕΦΑΛΑΙΟ 07 (Άθροισμα Γωνιών & Ιδιότητες)
    // =========================================================================

    // --- ΚΕΦ. 07 • ΑΣΚΗΣΗ 1: Εύρεση 3ης γωνίας τριγώνου (180°) ---
    const a9 = randInt(34, 78);
    const b9 = randInt(38, 82);
    const c9 = 180 - a9 - b9;

    qList.push({
      id: 9,
      chapterBadge: isEl ? 'ΚΕΦ. 07 • ΑΣΚΗΣΗ 1' : 'CH. 07 • EXERCISE 1',
      title: isEl ? 'Άθροισμα Γωνιών Τριγώνου (180°)' : 'Sum of Triangle Angles (180°)',
      prompt: isEl ? (
        <span>
          Σε τρίγωνο ΑΒΓ δίνονται <Angle>Α</Angle> ＝ {a9}° και <Angle>Β</Angle> ＝ {b9}°. Πόσες μοίρες είναι η γωνία <Angle>Γ</Angle>;
        </span>
      ) : (
        <span>
          In triangle ABC, ∠A ＝ {a9}° and ∠B ＝ {b9}°. How many degrees is angle ∠C?
        </span>
      ),
      type: 'input',
      correct: c9,
      unit: '°',
      diagram: { type: 'general', angA: a9, angB: b9, angC: c9 },
      explanation: isEl ? (
        <span>
          Επειδή <Angle>Α</Angle> ＋ <Angle>Β</Angle> ＋ <Angle>Γ</Angle> ＝ 180°, έχουμε <Angle>Γ</Angle> ＝ 180° － ({a9}° ＋ {b9}°) ＝ 180° － {a9 + b9}° ＝ {c9}°.
        </span>
      ) : (
        <span>
          Since ∠A ＋ ∠B ＋ ∠C ＝ 180°, we have ∠C ＝ 180° － ({a9}° ＋ {b9}°) ＝ 180° － {a9 + b9}° ＝ {c9}°.
        </span>
      )
    });

    // --- ΚΕΦ. 07 • ΑΣΚΗΣΗ 2: Ορθογώνιο τρίγωνο (συμπληρωματικές οξείες γωνίες) ---
    const angB10 = randInt(19, 71);
    const angC10 = 90 - angB10;

    qList.push({
      id: 10,
      chapterBadge: isEl ? 'ΚΕΦ. 07 • ΑΣΚΗΣΗ 2' : 'CH. 07 • EXERCISE 2',
      title: isEl ? 'Οξείες Συμπληρωματικές Γωνίες Ορθογωνίου' : 'Acute Complementary Angles of a Right Triangle',
      prompt: isEl ? (
        <span>
          Σε ορθογώνιο τρίγωνο ΑΒΓ (<Angle>Α</Angle> ＝ 90°), η μία οξεία γωνία είναι <Angle>Β</Angle> ＝ {angB10}°. Πόσες μοίρες είναι η άλλη οξεία γωνία <Angle>Γ</Angle>;
        </span>
      ) : (
        <span>
          In right triangle ABC (∠A ＝ 90°), one acute angle is ∠B ＝ {angB10}°. How many degrees is the other acute angle ∠C?
        </span>
      ),
      type: 'input',
      correct: angC10,
      unit: '°',
      diagram: { type: 'right', labelB: `${angB10}°`, labelC: `${angC10}°` },
      explanation: isEl ? (
        <span>
          Οι δύο οξείες γωνίες ενός ορθογωνίου τριγώνου είναι συμπληρωματικές (<Angle>Β</Angle> ＋ <Angle>Γ</Angle> ＝ 90°), άρα <Angle>Γ</Angle> ＝ 90° － {angB10}° ＝ {angC10}°.
        </span>
      ) : (
        <span>
          The two acute angles of a right triangle are complementary (∠B ＋ ∠C ＝ 90°), so ∠C ＝ 90° － {angB10}° ＝ {angC10}°.
        </span>
      )
    });

    // --- ΚΕΦ. 07 • ΑΣΚΗΣΗ 3: Γωνίες Ισοσκελούς Τριγώνου (δοσμένη γωνία κορυφής ή βάσης) ---
    const isoMode11 = Math.random() < 0.5; // true: δίνεται κορυφή, false: δίνεται βάση
    if (isoMode11) {
      const apex11 = randInt(18, 52) * 2;
      const base11 = (180 - apex11) / 2;
      qList.push({
        id: 11,
        chapterBadge: isEl ? 'ΚΕΦ. 07 • ΑΣΚΗΣΗ 3' : 'CH. 07 • EXERCISE 3',
        title: isEl ? 'Γωνίες Βάσης Ισοσκελούς Τριγώνου' : 'Base Angles of an Isosceles Triangle',
        prompt: isEl ? (
          <span>
            Ένα ισοσκελές τρίγωνο ΑΒΓ (ΑΒ ＝ ΑΓ) έχει γωνία κορυφής <Angle>Α</Angle> ＝ {apex11}°. Πόσες μοίρες είναι καθεμία από τις γωνίες της βάσης (<Angle>Β</Angle> και <Angle>Γ</Angle>);
          </span>
        ) : (
          <span>
            An isosceles triangle ABC (AB ＝ AC) has vertex angle ∠A ＝ {apex11}°. How many degrees is each base angle (∠B and ∠C)?
          </span>
        ),
        type: 'input',
        correct: base11,
        unit: '°',
        diagram: { type: 'isosceles', labelA: `${apex11}°`, labelB: `${base11}°`, labelC: `${base11}°`, showAltitude: false },
        explanation: (
          <span className="inline-flex flex-wrap items-center gap-1.5">
            <span>{isEl ? 'Οι γωνίες της βάσης είναι ίσες:' : 'The base angles are equal:'}</span>
            <span className="inline-flex items-center font-mono">
              <Angle>Β</Angle> ＝ <Angle>Γ</Angle> ＝ <Frac num={`180° － ${apex11}°`} den="2" /> ＝ {base11}°.
            </span>
          </span>
        )
      });
    } else {
      const base11 = randInt(44, 76);
      const apex11 = 180 - 2 * base11;
      qList.push({
        id: 11,
        chapterBadge: isEl ? 'ΚΕΦ. 07 • ΑΣΚΗΣΗ 3' : 'CH. 07 • EXERCISE 3',
        title: isEl ? 'Γωνία Κορυφής Ισοσκελούς Τριγώνου' : 'Vertex Angle of an Isosceles Triangle',
        prompt: isEl ? (
          <span>
            Ένα ισοσκελές τρίγωνο ΑΒΓ (ΑΒ ＝ ΑΓ) έχει γωνία βάσης <Angle>Β</Angle> ＝ {base11}°. Πόσες μοίρες είναι η γωνία κορυφής <Angle>Α</Angle>;
          </span>
        ) : (
          <span>
            An isosceles triangle ABC (AB ＝ AC) has base angle ∠B ＝ {base11}°. How many degrees is the vertex angle ∠A?
          </span>
        ),
        type: 'input',
        correct: apex11,
        unit: '°',
        diagram: { type: 'isosceles', labelA: `${apex11}°`, labelB: `${base11}°`, labelC: `${base11}°`, showAltitude: false },
        explanation: isEl ? (
          <span>
            Επειδή ΑΒ ＝ ΑΓ, <Angle>Γ</Angle> ＝ <Angle>Β</Angle> ＝ {base11}°. Άρα <Angle>Α</Angle> ＝ 180° － ({base11}° ＋ {base11}°) ＝ {apex11}°.
          </span>
        ) : (
          <span>
            Since AB ＝ AC, ∠C ＝ ∠B ＝ {base11}°. Thus ∠A ＝ 180° － ({base11}° ＋ {base11}°) ＝ {apex11}°.
          </span>
        )
      });
    }

    // --- ΚΕΦ. 07 • ΑΣΚΗΣΗ 4: Ιδιότητα Ύψους-Μεσοκαθέτου-Διαμέσου-Διχοτόμου & Γωνίες Ισόπλευρου ---
    const symCase12 = randInt(0, 2);
    if (symCase12 === 0) {
      const corr12 = isEl
        ? 'Τμήμα της μεσοκαθέτου, διάμεσος και διχοτόμος της γωνίας κορυφής'
        : 'Segment of the perpendicular bisector, median, and vertex angle bisector';
      const dist12 = isEl
        ? [
            'Τμήμα της μεσοκαθέτου, διάμεσος και διχοτόμος της γωνίας κορυφής',
            'Μόνο διάμεσος (όχι διχοτόμος ούτε μεσοκάθετος)',
            'Μόνο διχοτόμος (όχι διάμεσος)',
            'Ίσο με τη βάση ΒΓ του τριγώνου',
            'Παράλληλο προς το σκέλος ΑΒ'
          ]
        : [
            'Segment of the perpendicular bisector, median, and vertex angle bisector',
            'Only a median (neither bisector nor perpendicular bisector)',
            'Only an angle bisector (not a median)',
            'Equal in length to base BC',
            'Parallel to leg AB'
          ];
      qList.push({
        id: 12,
        chapterBadge: isEl ? 'ΚΕΦ. 07 • ΑΣΚΗΣΗ 4' : 'CH. 07 • EXERCISE 4',
        title: isEl ? 'Συμμετρία Ισοσκελούς Τριγώνου' : 'Symmetry of an Isosceles Triangle',
        prompt: isEl
          ? 'Σε κάθε ισοσκελές τρίγωνο ΑΒΓ (ΑΒ ＝ ΑΓ), τι είναι ταυτόχρονα το ύψος ΑΥ που αντιστοιχεί στη βάση ΒΓ;'
          : 'In every isosceles triangle ABC (AB ＝ AC), what is the altitude AH to base BC simultaneously?',
        type: 'mcq',
        correct: corr12,
        options: ensureFourUniqueOptions(corr12, () => pickRandom(dist12)),
        explanation: isEl
          ? 'Το ύψος προς τη βάση κάθε ισοσκελούς τριγώνου είναι ταυτόχρονα τμήμα της μεσοκαθέτου της βάσης, διάμεσος και διχοτόμος της γωνίας κορυφής.'
          : 'The altitude to the base of any isosceles triangle is simultaneously a segment of the perpendicular bisector of the base, a median, and the vertex angle bisector.'
      });
    } else if (symCase12 === 1) {
      const tf12 = Math.random() < 0.5;
      qList.push({
        id: 12,
        chapterBadge: isEl ? 'ΚΕΦ. 07 • ΑΣΚΗΣΗ 4' : 'CH. 07 • EXERCISE 4',
        title: isEl ? 'Ιδιότητα Υψών Ισόπλευρου Τριγώνου' : 'Altitudes Property of an Equilateral Triangle',
        prompt: tf12
          ? (isEl
              ? 'Στο ισόπλευρο τρίγωνο, και τα τρία ύψη του είναι ταυτόχρονα τμήματα των μεσοκαθέτων, διάμεσοι και διχοτόμοι.'
              : 'In an equilateral triangle, all three altitudes are simultaneously segments of the perpendicular bisectors, medians, and angle bisectors.')
          : (isEl
              ? 'Στο ισόπλευρο τρίγωνο, μόνο το ένα ύψος είναι ταυτόχρονα διάμεσος και διχοτόμος, ενώ οι γωνίες του είναι 45°.'
              : 'In an equilateral triangle, only one altitude is a median and angle bisector, and its angles are 45°.'),
        type: 'tf',
        correct: tf12 ? (isEl ? 'Σωστό' : 'True') : (isEl ? 'Λάθος' : 'False'),
        options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
        explanation: isEl
          ? 'Στο ισόπλευρο τρίγωνο όλες οι γωνίες είναι 60° και και τα τρία ύψη του είναι ταυτόχρονα τμήματα των μεσοκαθέτων, διάμεσοι και διχοτόμοι.'
          : 'In an equilateral triangle all angles equal 60° and all three altitudes are simultaneously segments of the perpendicular bisectors, medians, and angle bisectors.'
      });
    } else {
      const corr12 = '60°';
      const dist12 = ['60°', '45°', '90°', '30°', '120°', '75°'];
      qList.push({
        id: 12,
        chapterBadge: isEl ? 'ΚΕΦ. 07 • ΑΣΚΗΣΗ 4' : 'CH. 07 • EXERCISE 4',
        title: isEl ? 'Γωνίες Ισόπλευρου Τριγώνου' : 'Angles of an Equilateral Triangle',
        prompt: isEl
          ? 'Πόσες μοίρες είναι καθεμία από τις τρεις γωνίες ενός ισόπλευρου τριγώνου;'
          : 'How many degrees is each of the three angles of an equilateral triangle?',
        type: 'mcq',
        correct: corr12,
        options: ensureFourUniqueOptions(corr12, () => pickRandom(dist12)),
        explanation: (
          <span className="inline-flex flex-wrap items-center gap-1.5">
            <span>{isEl ? 'Οι 3 γωνίες είναι ίσες με άθροισμα 180°:' : 'All 3 angles are equal with sum 180°:'}</span>
            <span className="inline-flex items-center font-mono">
              <Frac num="180°" den="3" /> ＝ 60°.
            </span>
          </span>
        )
      });
    }

    // =========================================================================
    // ΜΕΡΟΣ Δ: 3 ΔΥΣΚΟΛΑ ΣΥΝΔΥΑΣΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ (ΕΝΑ ΑΠΟ ΚΑΘΕ ΚΕΦΑΛΑΙΟ)
    // =========================================================================

    // --- ΠΡΟΒΛΗΜΑ 1 (ΚΕΦ. 05): Πολλαπλές παραλλαγές απαιτητικών προβλημάτων Κεφ. 05 ---
    const prob1Variant = randInt(0, 1);
    if (prob1Variant === 0) {
      // Παραλλαγή 1α: Ορθογώνιο τρίγωνο με πλευρές ανάλογες των 3, 4, 5 και γνωστή περίμετρο
      const k13 = randInt(2, 6);
      const legAB13 = 3 * k13;
      const legAC13 = 4 * k13;
      const hypBC13 = 5 * k13;
      const perim13 = legAB13 + legAC13 + hypBC13;

      qList.push({
        id: 13,
        chapterBadge: isEl ? 'ΠΡΟΒΛΗΜΑ ΚΕΦ. 05 • ΥΨΗΛΗ ΔΥΣΚΟΛΙΑ' : 'CH. 05 PROBLEM • CHALLENGING',
        title: isEl ? 'Πρόβλημα 1: Περίμετρος & Υποτείνουσα Ορθογωνίου Τριγώνου' : 'Problem 1: Perimeter & Hypotenuse of a Right Triangle',
        prompt: isEl ? (
          <span>
            Ένα ορθογώνιο τρίγωνο ΑΒΓ (<Angle>Α</Angle> ＝ 90°) έχει περίμετρο {perim13} cm. Οι πλευρές του ΑΒ, ΑΓ και η υποτείνουσα ΒΓ είναι ανάλογες με τους αριθμούς 3, 4 και 5 αντίστοιχα. Πόσα εκατοστά (cm) είναι το μήκος της υποτείνουσας ΒΓ;
          </span>
        ) : (
          <span>
            A right triangle ABC (∠A ＝ 90°) has perimeter {perim13} cm. Its legs AB, AC and hypotenuse BC are proportional to 3, 4, and 5 respectively. What is the length of hypotenuse BC in cm?
          </span>
        ),
        type: 'input',
        correct: hypBC13,
        unit: 'cm',
        diagram: {
          type: 'right',
          sideAB: `${legAB13} cm`,
          sideAC: `${legAC13} cm`,
          sideBC: `${hypBC13} cm`
        },
        tableData: [
          {
            label: isEl ? '1. Σύνολο ίσων μεριδίων' : '1. Total equal parts',
            details: '3 ＋ 4 ＋ 5 ＝ 12 μερίδια (μέρη)'
          },
          {
            label: isEl ? '2. Μήκος ενός μεριδίου' : '2. Length of one part',
            details: (
              <span className="inline-flex items-center gap-1">
                <Frac num={perim13} den="12" /> ＝ {k13} cm
              </span>
            )
          },
          {
            label: isEl ? '3. Υποτείνουσα ΒΓ (5 μέρη)' : '3. Hypotenuse BC (5 parts)',
            details: `ΒΓ ＝ 5 · ${k13} ＝ ${hypBC13} cm (ΑΒ ＝ ${legAB13} cm, ΑΓ ＝ ${legAC13} cm)`
          }
        ],
        explanation: (
          <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed break-words [overflow-wrap:anywhere]">
            <span>
              {isEl
                ? `Χωρίζουμε την περίμετρο ${perim13} cm σε 3 ＋ 4 ＋ 5 ＝ 12 ίσα μέρη. Κάθε μέρος είναι:`
                : `Divide perimeter ${perim13} cm into 3 ＋ 4 ＋ 5 ＝ 12 equal parts. Each part is:`}
            </span>
            <span className="inline-flex items-center gap-1 font-mono">
              <Frac num={perim13} den="12" /> ＝ {k13} cm ⇒ ΒΓ ＝ 5 · {k13} ＝ {hypBC13} cm.
            </span>
          </span>
        )
      });
    } else {
      // Παραλλαγή 1β: Ισοσκελές τρίγωνο όπου το κάθε σκέλος είναι διπλάσιο/τριπλάσιο της βάσης
      const mult13 = randInt(2, 3);
      const base13 = randInt(4, 9);
      const leg13 = mult13 * base13;
      const perim13 = 2 * leg13 + base13;
      const multWord13El = mult13 === 2 ? 'διπλάσιο' : 'τριπλάσιο';
      const multWord13En = mult13 === 2 ? 'twice' : 'three times';

      qList.push({
        id: 13,
        chapterBadge: isEl ? 'ΠΡΟΒΛΗΜΑ ΚΕΦ. 05 • ΥΨΗΛΗ ΔΥΣΚΟΛΙΑ' : 'CH. 05 PROBLEM • CHALLENGING',
        title: isEl ? 'Πρόβλημα 1: Περίμετρος & Πλευρές Ισοσκελούς Τριγώνου' : 'Problem 1: Perimeter & Sides of an Isosceles Triangle',
        prompt: isEl ? (
          <span>
            Ένα ισοσκελές τρίγωνο ΑΒΓ (ΑΒ ＝ ΑΓ) έχει περίμετρο {perim13} cm. Αν το μήκος καθενός από τα δύο ίσα σκέλη είναι {multWord13El} από το μήκος της βάσης ΒΓ, πόσα εκατοστά (cm) είναι το σκέλος ΑΒ;
          </span>
        ) : (
          <span>
            An isosceles triangle ABC (AB ＝ AC) has perimeter {perim13} cm. If each equal leg is {multWord13En} the length of base BC, what is the length of leg AB in cm?
          </span>
        ),
        type: 'input',
        correct: leg13,
        unit: 'cm',
        diagram: {
          type: 'isosceles',
          legLabel: `${leg13} cm`,
          baseLabel: `${base13} cm`,
          showAltitude: false
        },
        tableData: [
          {
            label: isEl ? '1. Έκφραση πλευρών σε μερίδια' : '1. Expressing sides in parts',
            details: `ΒΓ ＝ 1 μέρος, ΑΒ ＝ ${mult13} μέρη, ΑΓ ＝ ${mult13} μέρη`
          },
          {
            label: isEl ? '2. Βάση ΒΓ' : '2. Base BC',
            details: (
              <span className="inline-flex items-center gap-1">
                1 ＋ {mult13} ＋ {mult13} ＝ {2 * mult13 + 1} μέρη ⇒ ΒΓ ＝ <Frac num={perim13} den={2 * mult13 + 1} /> ＝ {base13} cm
              </span>
            )
          },
          {
            label: isEl ? '3. Σκέλος ΑΒ' : '3. Leg AB',
            details: `ΑΒ ＝ ${mult13} · ${base13} ＝ ${leg13} cm`
          }
        ],
        explanation: (
          <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed break-words [overflow-wrap:anywhere]">
            <span>
              {isEl
                ? `Η περίμετρος αποτελείται από ${2 * mult13 + 1} ίσα μέρη, οπότε η βάση είναι:`
                : `The perimeter consists of ${2 * mult13 + 1} equal parts, so base BC is:`}
            </span>
            <span className="inline-flex items-center gap-1 font-mono">
              <Frac num={perim13} den={2 * mult13 + 1} /> ＝ {base13} cm ⇒ ΑΒ ＝ {mult13} · {base13} ＝ {leg13} cm.
            </span>
          </span>
        )
      });
    }

    // --- ΠΡΟΒΛΗΜΑ 2 (ΚΕΦ. 06): Πολλαπλές παραλλαγές απαιτητικών προβλημάτων Κεφ. 06 ---
    const prob2Variant = randInt(0, 1);
    if (prob2Variant === 0) {
      // Παραλλαγή 2α: Διχοτόμος ΑΔ και υπολογισμός εσωτερικής γωνίας ΑΔΒ
      const angB14 = randInt(52, 74);
      const angC14 = randInt(34, 54);
      const adjC14 = (180 - angB14 - angC14) % 2 === 0 ? angC14 : angC14 + 1;
      const angA14 = 180 - angB14 - adjC14;
      const halfA14 = angA14 / 2;
      const angADB14 = 180 - angB14 - halfA14;

      qList.push({
        id: 14,
        chapterBadge: isEl ? 'ΠΡΟΒΛΗΜΑ ΚΕΦ. 06 • ΥΨΗΛΗ ΔΥΣΚΟΛΙΑ' : 'CH. 06 PROBLEM • CHALLENGING',
        title: isEl ? 'Πρόβλημα 2: Διχοτόμος & Υπολογισμός Εσωτερικής Γωνίας' : 'Problem 2: Angle Bisector & Interior Angle Calculation',
        prompt: isEl ? (
          <span>
            Σε τρίγωνο ΑΒΓ δίνονται <Angle>Β</Angle> ＝ {angB14}° και <Angle>Γ</Angle> ＝ {adjC14}°. Αν ΑΔ είναι η διχοτόμος της γωνίας <Angle>Α</Angle> (με το Δ πάνω στη ΒΓ), πόσες μοίρες είναι η γωνία Α<Angle>Δ</Angle>Β;
          </span>
        ) : (
          <span>
            In triangle ABC, ∠B ＝ {angB14}° and ∠C ＝ {adjC14}°. If AD is the bisector of angle ∠A (with D on BC), how many degrees is angle ∠ADB?
          </span>
        ),
        type: 'input',
        correct: angADB14,
        unit: '°',
        diagram: {
          type: 'bisector',
          angA: angA14,
          angB: angB14,
          angC: adjC14,
          halfA: halfA14
        },
        tableData: [
          {
            label: isEl ? '1. Υπολογισμός γωνίας Α' : '1. Finding angle ∠A',
            details: `180° － (${angB14}° ＋ ${adjC14}°) ＝ 180° － ${angB14 + adjC14}° ＝ ${angA14}°`
          },
          {
            label: isEl ? '2. Εφαρμογή διχοτόμου ΑΔ' : '2. Applying bisector AD',
            details: (
              <span className="inline-flex items-center gap-1">
                {isEl ? <>Β<Angle>Α</Angle>Δ ＝</> : '∠BAD ＝'} <Frac num={`${angA14}°`} den="2" /> ＝ {halfA14}°
              </span>
            )
          },
          {
            label: isEl ? '3. Τρίγωνο ΑΒΔ' : '3. Triangle ABD',
            details: isEl ? (
              <span>
                Α<Angle>Δ</Angle>Β ＝ 180° － ({angB14}° ＋ {halfA14}°) ＝ {angADB14}°
              </span>
            ) : (
              `∠ADB ＝ 180° － (${angB14}° ＋ ${halfA14}°) ＝ ${angADB14}°`
            )
          }
        ],
        explanation: isEl ? (
          <span>
            Πρώτα βρίσκουμε <Angle>Α</Angle> ＝ 180° － ({angB14}° ＋ {adjC14}°) ＝ {angA14}°. Επειδή η ΑΔ είναι διχοτόμος, Β<Angle>Α</Angle>Δ ＝ {halfA14}°. Τέλος, στο τρίγωνο ΑΒΔ έχουμε Α<Angle>Δ</Angle>Β ＝ 180° － ({angB14}° ＋ {halfA14}°) ＝ {angADB14}°.
          </span>
        ) : (
          <span>
            First, ∠A ＝ 180° － ({angB14}° ＋ {adjC14}°) ＝ {angA14}°. Since AD is the angle bisector, ∠BAD ＝ {halfA14}°. Finally, in triangle ABD, ∠ADB ＝ 180° － ({angB14}° ＋ {halfA14}°) ＝ {angADB14}°.
          </span>
        )
      });
    } else {
      // Παραλλαγή 2β: Δύο διχοτόμοι ΒΔ και ΓΕ τέμνονται στο έγκεντρο Ι -> εύρεση γωνίας ΒΙΓ
      const angA14 = randInt(25, 55) * 2; // άρτια γωνία Α 50°..110°
      const sumBC14 = 180 - angA14;
      const halfSumBC14 = sumBC14 / 2;
      const angBIC14 = 180 - halfSumBC14;

      qList.push({
        id: 14,
        chapterBadge: isEl ? 'ΠΡΟΒΛΗΜΑ ΚΕΦ. 06 • ΥΨΗΛΗ ΔΥΣΚΟΛΙΑ' : 'CH. 06 PROBLEM • CHALLENGING',
        title: isEl ? 'Πρόβλημα 2: Έγκεντρο & Γωνία Διχοτόμων' : 'Problem 2: Incenter & Angle Between Bisectors',
        prompt: isEl ? (
          <span>
            Σε τρίγωνο ΑΒΓ η γωνία <Angle>Α</Angle> είναι {angA14}°. Οι διχοτόμοι των γωνιών <Angle>Β</Angle> και <Angle>Γ</Angle> τέμνονται στο έγκεντρο Ι του τριγώνου. Πόσες μοίρες είναι η γωνία Β<Angle>Ι</Angle>Γ;
          </span>
        ) : (
          <span>
            In triangle ABC, angle ∠A measures {angA14}°. The angle bisectors of ∠B and ∠C intersect at the incenter I of the triangle. How many degrees is angle ∠BIC?
          </span>
        ),
        type: 'input',
        correct: angBIC14,
        unit: '°',
        tableData: [
          {
            label: isEl ? '1. Άθροισμα γωνιών Β ＋ Γ' : '1. Sum of angles ∠B ＋ ∠C',
            details: isEl ? (
              <span>
                <Angle>Β</Angle> ＋ <Angle>Γ</Angle> ＝ 180° － {angA14}° ＝ {sumBC14}°
              </span>
            ) : (
              `∠B ＋ ∠C ＝ 180° － ${angA14}° ＝ ${sumBC14}°`
            )
          },
          {
            label: isEl ? '2. Άθροισμα ημιγωνιών στο τρίγωνο ΒΙΓ' : '2. Sum of half-angles in triangle BIC',
            details: (
              <span className="inline-flex items-center gap-1">
                {isEl ? <>Ι<Angle>Β</Angle>Γ ＋ Ι<Angle>Γ</Angle>Β ＝</> : '∠IBC ＋ ∠ICB ＝'}{' '}
                <Frac num={`${sumBC14}°`} den="2" /> ＝ {halfSumBC14}°
              </span>
            )
          },
          {
            label: isEl ? '3. Υπολογισμός γωνίας ΒΙΓ' : '3. Calculating angle ∠BIC',
            details: isEl ? (
              <span>
                Β<Angle>Ι</Angle>Γ ＝ 180° － {halfSumBC14}° ＝ {angBIC14}°
              </span>
            ) : (
              `∠BIC ＝ 180° － ${halfSumBC14}° ＝ ${angBIC14}°`
            )
          }
        ],
        explanation: (
          <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed break-words [overflow-wrap:anywhere]">
            <span>
              {isEl ? (
                <>
                  Έχουμε <Angle>Β</Angle> ＋ <Angle>Γ</Angle> ＝ 180° － {angA14}° ＝ {sumBC14}°. Επειδή η ΒΙ και η ΓΙ είναι διχοτόμοι, στο τρίγωνο ΒΙΓ το άθροισμα των δύο γωνιών στη βάση είναι:
                </>
              ) : (
                `We have ∠B ＋ ∠C ＝ 180° － ${angA14}° ＝ ${sumBC14}°. Since BI and CI bisect ∠B and ∠C, in triangle BIC the two base angles sum to:`
              )}
            </span>
            <span className="inline-flex items-center gap-1 font-mono">
              <Frac num={`${sumBC14}°`} den="2" /> ＝ {halfSumBC14}° ⇒ {isEl ? <>Β<Angle>Ι</Angle>Γ</> : '∠BIC'} ＝ 180° － {halfSumBC14}° ＝ {angBIC14}°.
            </span>
          </span>
        )
      });
    }

    // --- ΠΡΟΒΛΗΜΑ 3 (ΚΕΦ. 07): Πολλαπλές παραλλαγές απαιτητικών προβλημάτων Κεφ. 07 ---
    const prob3Variant = randInt(0, 1);
    if (prob3Variant === 0) {
      // Παραλλαγή 3α: Πλήρης ανάλυση ισοσκελούς με ύψος-μεσοκάθετο-διάμεσο-διχοτόμο ΑΥ
      const halfApex15 = randInt(22, 36);
      const apexA15 = 2 * halfApex15;
      const baseAng15 = 90 - halfApex15;
      const halfBase15 = randInt(5, 9);
      const fullBase15 = 2 * halfBase15;
      const leg15 = randInt(halfBase15 + 4, halfBase15 + 11);
      const perim15 = 2 * leg15 + fullBase15;

      const corr15 = isEl
        ? `Γωνία βάσης ${baseAng15}° και περίμετρος ${perim15} cm`
        : `Base angle ${baseAng15}° and perimeter ${perim15} cm`;

      const dist15 = isEl
        ? [
            `Γωνία βάσης ${baseAng15}° και περίμετρος ${perim15} cm`,
            `Γωνία βάσης ${halfApex15}° και περίμετρος ${perim15} cm`,
            `Γωνία βάσης ${baseAng15}° και περίμετρος ${2 * leg15 + halfBase15} cm`,
            `Γωνία βάσης ${180 - apexA15}° και περίμετρος ${perim15} cm`,
            `Γωνία βάσης ${baseAng15 + 10}° και περίμετρος ${perim15 + 4} cm`
          ]
        : [
            `Base angle ${baseAng15}° and perimeter ${perim15} cm`,
            `Base angle ${halfApex15}° and perimeter ${perim15} cm`,
            `Base angle ${baseAng15}° and perimeter ${2 * leg15 + halfBase15} cm`,
            `Base angle ${180 - apexA15}° and perimeter ${perim15} cm`,
            `Base angle ${baseAng15 + 10}° and perimeter ${perim15 + 4} cm`
          ];

      qList.push({
        id: 15,
        chapterBadge: isEl ? 'ΠΡΟΒΛΗΜΑ ΚΕΦ. 07 • ΥΨΗΛΗ ΔΥΣΚΟΛΙΑ' : 'CH. 07 PROBLEM • CHALLENGING',
        title: isEl ? 'Πρόβλημα 3: Πλήρης Ανάλυση Ισοσκελούς με Ύψος-Μεσοκάθετο' : 'Problem 3: Full Isosceles Analysis with Altitude-Perpendicular Bisector',
        prompt: isEl ? (
          <span>
            Σε ισοσκελές τρίγωνο ΑΒΓ (ΑΒ ＝ ΑΓ) με πλευρά ΑΒ ＝ {leg15} cm, φέρνουμε το ύψος ΑΥ προς τη βάση ΒΓ. Αν γνωρίζουμε ότι Β<Angle>Α</Angle>Υ ＝ {halfApex15}° και ΒΥ ＝ {halfBase15} cm, πόση είναι καθεμία γωνία της βάσης (<Angle>Β</Angle> ＝ <Angle>Γ</Angle>) και πόση είναι η περίμετρος του τριγώνου ΑΒΓ;
          </span>
        ) : (
          <span>
            In isosceles triangle ABC (AB ＝ AC) with side AB ＝ {leg15} cm, we draw altitude AH to base BC. Given that ∠BAH ＝ {halfApex15}° and BH ＝ {halfBase15} cm, find each base angle (∠B ＝ ∠C) and the perimeter of triangle ABC.
          </span>
        ),
        type: 'mcq',
        correct: corr15,
        options: ensureFourUniqueOptions(corr15, () => pickRandom(dist15)),
        diagram: {
          type: 'isosceles',
          labelA: `${apexA15}°`,
          labelB: `${baseAng15}°`,
          labelC: `${baseAng15}°`,
          showAltitude: true,
          legLabel: `${leg15} cm`,
          halfBaseLabel: `${halfBase15} cm`
        },
        tableData: [
          {
            label: isEl ? '1. Γωνία βάσης (Β ＝ Γ)' : '1. Base angle (∠B ＝ ∠C)',
            details: isEl ? (
              <span>
                Στο ορθογώνιο ΑΒΥ (<Angle>Υ</Angle> ＝ 90°): <Angle>Β</Angle> ＝ 90° － {halfApex15}° ＝ {baseAng15}°
              </span>
            ) : (
              `In right triangle ABH (∠H ＝ 90°): ∠B ＝ 90° － ${halfApex15}° ＝ ${baseAng15}°`
            )
          },
          {
            label: isEl ? '2. Βάση ΒΓ (Ύψος-Μεσοκάθετος)' : '2. Base BC (Altitude-Perp. Bisector)',
            details: `ΒΓ ＝ 2 · ΒΥ ＝ 2 · ${halfBase15} ＝ ${fullBase15} cm`
          },
          {
            label: isEl ? '3. Περίμετρος τριγώνου ΑΒΓ' : '3. Perimeter of triangle ABC',
            details: `Π ＝ ${leg15} ＋ ${leg15} ＋ ${fullBase15} ＝ ${perim15} cm`
          }
        ],
        explanation: isEl ? (
          <span>
            Στο ορθογώνιο τρίγωνο ΑΒΥ (<Angle>Υ</Angle> ＝ 90°), οι οξείες γωνίες είναι συμπληρωματικές, άρα <Angle>Β</Angle> ＝ <Angle>Γ</Angle> ＝ 90° － {halfApex15}° ＝ {baseAng15}°. Επίσης το ύψος ΑΥ είναι τμήμα της μεσοκαθέτου (διάμεσος) της ΒΓ, άρα ΒΓ ＝ 2 · {halfBase15} ＝ {fullBase15} cm και Π ＝ {leg15} ＋ {leg15} ＋ {fullBase15} ＝ {perim15} cm.
          </span>
        ) : (
          <span>
            In right triangle ABH (∠H ＝ 90°), the acute angles are complementary, so ∠B ＝ ∠C ＝ 90° － {halfApex15}° ＝ {baseAng15}°. Also, altitude AH is part of the perpendicular bisector (median) of BC, so BC ＝ 2 · {halfBase15} ＝ {fullBase15} cm and P ＝ {leg15} ＋ {leg15} ＋ {fullBase15} ＝ {perim15} cm.
          </span>
        )
      });
    } else {
      // Παραλλαγή 3β: Τρίγωνο ΑΒΓ με γωνίες σε αναλογία 1 : 2 : 3 (ορθογώνιο 30°, 60°, 90°)
      const k15 = randInt(15, 25); // 15°..25°, άθροισμα 1k + 2k + 3k = 6k
      // Για να είναι 6k = 180°, επιλέγουμε αναλογίες (1, 2, 3) -> 30°, 60°, 90° ή (2, 3, 4) -> 40°, 60°, 80°
      const ratioPool = [
        { r: [1, 2, 3], angles: [30, 60, 90], typeEl: 'Ορθογώνιο σκαληνό', typeEn: 'Right scalene' },
        { r: [2, 3, 4], angles: [40, 60, 80], typeEl: 'Οξυγώνιο σκαληνό', typeEn: 'Acute scalene' },
        { r: [1, 1, 4], angles: [30, 30, 120], typeEl: 'Αμβλυγώνιο ισοσκελές', typeEn: 'Obtuse isosceles' },
        { r: [1, 2, 2], angles: [36, 72, 72], typeEl: 'Οξυγώνιο ισοσκελές', typeEn: 'Acute isosceles' }
      ];
      const chosenR = pickRandom(ratioPool);
      const sumR = chosenR.r[0] + chosenR.r[1] + chosenR.r[2];
      const unitDeg = 180 / sumR;
      const corr15 = isEl
        ? `${chosenR.angles[0]}°, ${chosenR.angles[1]}°, ${chosenR.angles[2]}° (${chosenR.typeEl})`
        : `${chosenR.angles[0]}°, ${chosenR.angles[1]}°, ${chosenR.angles[2]}° (${chosenR.typeEn})`;

      const dist15 = isEl
        ? [
            '30°, 60°, 90° (Ορθογώνιο σκαληνό)',
            '40°, 60°, 80° (Οξυγώνιο σκαληνό)',
            '30°, 30°, 120° (Αμβλυγώνιο ισοσκελές)',
            '36°, 72°, 72° (Οξυγώνιο ισοσκελές)',
            '45°, 45°, 90° (Ορθογώνιο ισοσκελές)'
          ]
        : [
            '30°, 60°, 90° (Right scalene)',
            '40°, 60°, 80° (Acute scalene)',
            '30°, 30°, 120° (Obtuse isosceles)',
            '36°, 72°, 72° (Acute isosceles)',
            '45°, 45°, 90° (Right isosceles)'
          ];

      qList.push({
        id: 15,
        chapterBadge: isEl ? 'ΠΡΟΒΛΗΜΑ ΚΕΦ. 07 • ΥΨΗΛΗ ΔΥΣΚΟΛΙΑ' : 'CH. 07 PROBLEM • CHALLENGING',
        title: isEl ? 'Πρόβλημα 3: Γωνίες Τριγώνου σε Αναλογία & Χαρακτηρισμός' : 'Problem 3: Triangle Angles in Ratio & Classification',
        prompt: isEl ? (
          <span>
            Οι γωνίες <Angle>Α</Angle>, <Angle>Β</Angle> και <Angle>Γ</Angle> ενός τριγώνου ΑΒΓ είναι ανάλογες με τους αριθμούς {chosenR.r[0]}, {chosenR.r[1]} και {chosenR.r[2]} αντίστοιχα. Ποια είναι τα μέτρα των γωνιών του και πώς χαρακτηρίζεται πλήρως το τρίγωνο;
          </span>
        ) : (
          <span>
            The angles ∠A, ∠B, and ∠C of triangle ABC are proportional to {chosenR.r[0]}, {chosenR.r[1]}, and {chosenR.r[2]} respectively. What are the angle measures and the full classification of the triangle?
          </span>
        ),
        type: 'mcq',
        correct: corr15,
        options: ensureFourUniqueOptions(corr15, () => pickRandom(dist15)),
        diagram: {
          type: 'general',
          angA: chosenR.angles[0],
          angB: chosenR.angles[1],
          angC: chosenR.angles[2]
        },
        tableData: [
          {
            label: isEl ? '1. Σύνολο μεριδίων (180°)' : '1. Total parts (180°)',
            details: `${chosenR.r[0]} ＋ ${chosenR.r[1]} ＋ ${chosenR.r[2]} ＝ ${sumR} μερίδια`
          },
          {
            label: isEl ? '2. Μέτρο 1 μεριδίου' : '2. Measure of 1 part',
            details: (
              <span className="inline-flex items-center gap-1">
                <Frac num="180°" den={sumR} /> ＝ {unitDeg}°
              </span>
            )
          },
          {
            label: isEl ? '3. Οι 3 γωνίες του τριγώνου' : '3. The 3 angles of the triangle',
            details: `${chosenR.angles[0]}°, ${chosenR.angles[1]}°, ${chosenR.angles[2]}° ⇒ ${isEl ? chosenR.typeEl : chosenR.typeEn}`
          }
        ],
        explanation: (
          <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed break-words [overflow-wrap:anywhere]">
            <span>
              {isEl
                ? `Διαιρούμε τις 180° σε ${chosenR.r[0]} ＋ ${chosenR.r[1]} ＋ ${chosenR.r[2]} ＝ ${sumR} ίσα μέρη:`
                : `Divide 180° into ${chosenR.r[0]} ＋ ${chosenR.r[1]} ＋ ${chosenR.r[2]} ＝ ${sumR} equal parts:`}
            </span>
            <span className="inline-flex items-center gap-1 font-mono">
              <Frac num="180°" den={sumR} /> ＝ {unitDeg}° ⇒ {chosenR.angles[0]}°, {chosenR.angles[1]}°, {chosenR.angles[2]}° ({isEl ? chosenR.typeEl : chosenR.typeEn}).
            </span>
          </span>
        ),
        _unused: k15
      });
    }

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
    setUserAnswers(prev => ({ ...prev, [qId]: rawVal }));
  };

  const sanitizeInput = (val) => {
    let sanitized = val.replace('.', ',').replace(/[^0-9,]/g, '');
    const parts = sanitized.split(',');
    if (parts.length > 2) {
      sanitized = parts[0] + ',' + parts.slice(1).join('');
    }
    return sanitized.slice(0, 10);
  };

  const handleSubmit = () => {
    let s = 0;
    questions.forEach(q => {
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

  const totalCount = questions.length || 15;
  const answeredCount = Object.keys(userAnswers).filter(k => userAnswers[k] !== '' && userAnswers[k] !== undefined).length;

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/a-gymnasiou"
      backText={t.backNav}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all duration-200"
        >
          <span>📚 {toCleanUppercase(t.theoryBtn)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 4k:px-24 py-4 sm:py-6 pb-28 sm:pb-36 overflow-x-hidden text-slate-800 box-border">
        
        {/* Header Banner */}
        <section className="bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-950 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 mb-6 sm:mb-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-1 bg-white/10 rounded-full text-indigo-200 text-[11px] sm:text-xs font-bold uppercase tracking-wider border border-white/10">
                {toCleanUppercase(t.heroBadge)}
              </span>
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-black mt-2 leading-tight break-words [overflow-wrap:anywhere]">
                {t.heroTitle}
              </h1>
              <p className="text-indigo-200 text-xs sm:text-base mt-1">
                {t.heroDesc}
              </p>
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
              {score >= 13 ? t.scoreGreat : score >= 8 ? t.scoreGood : t.scoreNeedWork}
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

        {/* Λίστα Ερωτήσεων */}
        <div className="space-y-4 sm:space-y-6">
          {questions.map((q, idx) => {
            const isHardProblem = idx >= 12;
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
                    ? 'border-amber-300 shadow-md'
                    : 'border-slate-200 shadow-sm'
                }`}
              >
                {/* Chapter / Difficulty Tag */}
                <div className="mb-2">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider ${
                      isHardProblem
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-indigo-50 text-indigo-700'
                    }`}
                  >
                    {toCleanUppercase(q.chapterBadge)}
                  </span>
                </div>

                {/* Header Ερώτησης */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl font-bold flex items-center justify-center text-xs sm:text-sm shrink-0 ${
                        isHardProblem
                          ? 'bg-amber-500 text-white'
                          : 'bg-indigo-100 text-indigo-700'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <h3 className="font-bold text-sm sm:text-lg text-slate-900 leading-snug break-words [overflow-wrap:anywhere]">
                      {q.title}
                    </h3>
                  </div>
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

                {/* Εκφώνηση */}
                <div className="text-slate-800 text-xs sm:text-base leading-relaxed mb-4 sm:mb-6 font-medium break-words [overflow-wrap:anywhere]">
                  {q.prompt}
                </div>

                {/* Πεδία Απάντησης */}
                <div className="mb-2">
                  {q.type === 'tf' && (
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 max-w-xs sm:max-w-md">
                      {q.options.map(opt => {
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
                      {q.options.map(opt => {
                        const isSelected = userAnswers[q.id] === opt;
                        return (
                          <button
                            type="button"
                            key={opt}
                            disabled={submitted}
                            onClick={() => handleAnswerChange(q.id, opt)}
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
                              {q.renderOption ? q.renderOption(opt) : opt}
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
                        placeholder={isEl ? "Απάντηση..." : "Answer..."}
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
                        <div className="md:col-span-5">
                          {renderFeedbackDiagram(q.diagram, isEl)}
                        </div>
                        <div className="md:col-span-7 space-y-3">
                          {q.tableData && q.tableData.length > 0 && (
                            <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white">
                              <table className="w-full text-xs text-left">
                                <thead className="bg-slate-100 text-slate-700 font-bold">
                                  <tr>
                                    <th className="p-2 sm:p-2.5 border-b w-1/3">{t.tableStep}</th>
                                    <th className="p-2 sm:p-2.5 border-b w-2/3">{t.tableAnalysis}</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs">
                                  {q.tableData.map((row, rIdx) => (
                                    <tr key={rIdx}>
                                      <td className="p-2 sm:p-2.5 font-semibold text-slate-800 align-top">{row.label}</td>
                                      <td className="p-2 sm:p-2.5 font-mono text-indigo-900 break-words [overflow-wrap:anywhere] align-top">{row.details}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}

                          <div className="p-3 sm:p-4 bg-slate-100/70 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-slate-800 leading-relaxed">
                            <div className="font-bold text-slate-900 mb-1 flex flex-wrap items-center gap-1.5">
                              <span>{t.correctAnswerTitle}</span>
                              <span className="font-mono text-emerald-700 font-bold inline-flex items-center whitespace-nowrap gap-1">
                                {q.renderOption ? q.renderOption(q.correct) : (typeof q.correct === 'number' ? q.correct.toLocaleString(locCode) : q.correct)} {q.unit || ''}
                              </span>
                            </div>
                            <div className="mt-1 break-words [overflow-wrap:anywhere]">{q.explanation}</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        {q.tableData && q.tableData.length > 0 && (
                          <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white">
                            <table className="w-full text-xs text-left">
                              <thead className="bg-slate-100 text-slate-700 font-bold">
                                <tr>
                                  <th className="p-2 sm:p-2.5 border-b w-1/3">{t.tableStep}</th>
                                  <th className="p-2 sm:p-2.5 border-b w-2/3">{t.tableAnalysis}</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 text-xs">
                                {q.tableData.map((row, rIdx) => (
                                  <tr key={rIdx}>
                                    <td className="p-2 sm:p-2.5 font-semibold text-slate-800 align-top">{row.label}</td>
                                    <td className="p-2 sm:p-2.5 font-mono text-indigo-900 break-words [overflow-wrap:anywhere] align-top">{row.details}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                        <div className="p-3 sm:p-4 bg-slate-100/70 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-slate-800 leading-relaxed">
                          <div className="font-bold text-slate-900 mb-1 flex flex-wrap items-center gap-1.5">
                            <span>{t.correctAnswerTitle}</span>
                            <span className="font-mono text-emerald-700 font-bold inline-flex items-center whitespace-nowrap gap-1">
                              {q.renderOption ? q.renderOption(q.correct) : (typeof q.correct === 'number' ? q.correct.toLocaleString(locCode) : q.correct)} {q.unit || ''}
                            </span>
                          </div>
                          <div className="mt-1 break-words [overflow-wrap:anywhere]">{q.explanation}</div>
                        </div>
                      </>
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
                  {toCleanUppercase(t.answeredLabel)}: <span className="text-indigo-400 font-black">{answeredCount}</span> / {totalCount}
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 text-[11px] sm:text-sm font-black">
                  <span className="text-emerald-400">{toCleanUppercase(isEl ? 'ΣΚΟΡ' : 'SCORE')}: {score} / {totalCount}</span>
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