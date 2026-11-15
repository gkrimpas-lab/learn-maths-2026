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
      <span className="border-b border-current px-0.5 sm:px-1 pb-0.5 whitespace-nowrap">
        {num}
      </span>
      <span className="pt-0.5 whitespace-nowrap">
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
    ? { A: 'Α', B: 'Β', C: 'Γ', Ap: "Α'", Bp: "Β'", Cp: "Γ'", M: 'Μ', K: 'Κ', O: 'Ο' }
    : { A: 'A', B: 'B', C: 'C', Ap: "A'", Bp: "B'", Cp: "C'", M: 'M', K: 'K', O: 'O' };

  // 1. Συμμετρικό σημείου Α και Α' ως προς άξονα (ε) (Ερ. 2, 11)
  if (diagram.type === 'pointReflection') {
    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 160" className="w-full max-w-[265px] h-36 select-none">
          <line x1="132" y1="12" x2="132" y2="148" stroke="#fb7185" strokeWidth="2.2" />
          <text x="139" y="22" className="text-[11px] font-black fill-rose-300">({isEl ? 'ε' : 'l'})</text>

          {diagram.showK && (
            <>
              <polygon points="132,36 62,114 202,114" fill="rgba(99, 102, 241, 0.16)" stroke="#818cf8" strokeWidth="1.6" strokeLinejoin="round" />
              <circle cx="132" cy="36" r="3.8" fill="#fbbf24" />
              <text x="124" y="34" textAnchor="end" className="text-[11px] font-black fill-amber-300">{v.K}</text>
              <text x="92" y="70" textAnchor="end" className="text-[10px] font-mono font-bold fill-amber-300">{diagram.kLabel}</text>
              <text x="172" y="70" textAnchor="start" className="text-[10px] font-mono font-bold fill-amber-300">{diagram.kLabel}</text>
            </>
          )}

          <line x1="62" y1="114" x2="202" y2="114" stroke="#34d399" strokeWidth="2" strokeDasharray="4 3" />
          <polyline points="132,104 142,104 142,114" fill="none" stroke="#fb7185" strokeWidth="1.6" />

          <circle cx="62" cy="114" r="3.8" fill="#818cf8" />
          <circle cx="202" cy="114" r="3.8" fill="#34d399" />
          <circle cx="132" cy="114" r="3.2" fill="#fb7185" />

          <text x="55" y="128" textAnchor="end" className="text-[11px] font-black fill-indigo-300">{v.A}</text>
          <text x="209" y="128" textAnchor="start" className="text-[11px] font-black fill-emerald-300">{v.Ap}</text>
          <text x="125" y="128" textAnchor="end" className="text-[10px] font-black fill-rose-300">{v.M}</text>

          <text x="97" y="106" textAnchor="middle" className="text-[10px] font-mono font-bold fill-emerald-300">
            {diagram.halfLabel}
          </text>
          <text x="167" y="106" textAnchor="middle" className="text-[10px] font-mono font-bold fill-emerald-300">
            {diagram.halfLabel}
          </text>
        </svg>
      </div>
    );
  }

  // 2. Συμμετρικά τρίγωνα ΑΒΓ και Α'Β'Γ' ως προς άξονα (ε) (Ερ. 7, 8, 9)
  if (diagram.type === 'triangleReflection') {
    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 270 165" className="w-full max-w-[270px] h-38 select-none">
          <line x1="135" y1="10" x2="135" y2="155" stroke="#fb7185" strokeWidth="2.2" />
          <text x="142" y="20" className="text-[11px] font-black fill-rose-300">({isEl ? 'ε' : 'l'})</text>

          <line x1="82" y1="36" x2="188" y2="36" stroke="#64748b" strokeWidth="1.3" strokeDasharray="3 3" />
          <line x1="46" y1="92" x2="224" y2="92" stroke="#64748b" strokeWidth="1.3" strokeDasharray="3 3" />
          <line x1="96" y1="136" x2="174" y2="136" stroke="#64748b" strokeWidth="1.3" strokeDasharray="3 3" />

          <polygon points="82,36 46,92 96,136" fill="rgba(99, 102, 241, 0.25)" stroke="#818cf8" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="188,36 224,92 174,136" fill="rgba(16, 185, 129, 0.25)" stroke="#34d399" strokeWidth="2" strokeLinejoin="round" />

          <text x="82" y="28" textAnchor="middle" className="text-[10px] font-black fill-indigo-300">{diagram.lblA || v.A}</text>
          <text x="40" y="96" textAnchor="end" className="text-[10px] font-black fill-indigo-300">{diagram.lblB || v.B}</text>
          <text x="96" y="150" textAnchor="middle" className="text-[10px] font-black fill-indigo-300">{diagram.lblC || v.C}</text>

          <text x="188" y="28" textAnchor="middle" className="text-[10px] font-black fill-emerald-300">{diagram.lblAp || v.Ap}</text>
          <text x="230" y="96" textAnchor="start" className="text-[10px] font-black fill-emerald-300">{diagram.lblBp || v.Bp}</text>
          <text x="174" y="150" textAnchor="middle" className="text-[10px] font-black fill-emerald-300">{diagram.lblCp || v.Cp}</text>
        </svg>
      </div>
    );
  }

  // 3. Άξονες συμμετρίας βασικών σχημάτων (Ερ. 10, 12)
  if (diagram.type === 'shapeAxes') {
    const sh = diagram.shape;
    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 160" className="w-full max-w-[265px] h-36 select-none">
          {sh === 'rect' && (
            <>
              <rect x="68" y="42" width="128" height="76" fill="rgba(99, 102, 241, 0.22)" stroke="#818cf8" strokeWidth="2.2" />
              <line x1="132" y1="18" x2="132" y2="142" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4 3" />
              <line x1="44" y1="80" x2="220" y2="80" stroke="#34d399" strokeWidth="2" strokeDasharray="4 3" />
            </>
          )}
          {sh === 'rhombus' && (
            <>
              <polygon points="132,20 198,80 132,140 66,80" fill="rgba(99, 102, 241, 0.22)" stroke="#818cf8" strokeWidth="2.2" strokeLinejoin="round" />
              <line x1="132" y1="10" x2="132" y2="150" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4 3" />
              <line x1="46" y1="80" x2="218" y2="80" stroke="#34d399" strokeWidth="2" strokeDasharray="4 3" />
            </>
          )}
          {sh === 'square' && (
            <>
              <rect x="86" y="34" width="92" height="92" fill="rgba(99, 102, 241, 0.22)" stroke="#818cf8" strokeWidth="2.2" />
              <line x1="132" y1="14" x2="132" y2="146" stroke="#fbbf24" strokeWidth="1.8" strokeDasharray="4 3" />
              <line x1="66" y1="80" x2="198" y2="80" stroke="#fbbf24" strokeWidth="1.8" strokeDasharray="4 3" />
              <line x1="70" y1="18" x2="194" y2="142" stroke="#34d399" strokeWidth="1.8" strokeDasharray="4 3" />
              <line x1="194" y1="18" x2="70" y2="142" stroke="#fb7185" strokeWidth="1.8" strokeDasharray="4 3" />
            </>
          )}
          {sh === 'equiTri' && (
            <>
              <polygon points="132,24 76,122 188,122" fill="rgba(99, 102, 241, 0.22)" stroke="#818cf8" strokeWidth="2.2" strokeLinejoin="round" />
              <line x1="132" y1="10" x2="132" y2="148" stroke="#fbbf24" strokeWidth="1.8" strokeDasharray="4 3" />
              <line x1="64" y1="129" x2="178" y2="63" stroke="#34d399" strokeWidth="1.8" strokeDasharray="4 3" />
              <line x1="200" y1="129" x2="86" y2="63" stroke="#fb7185" strokeWidth="1.8" strokeDasharray="4 3" />
            </>
          )}
          {sh === 'circle' && (
            <>
              <circle cx="132" cy="80" r="52" fill="rgba(99, 102, 241, 0.2)" stroke="#818cf8" strokeWidth="2.2" />
              <line x1="132" y1="14" x2="132" y2="146" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="4 3" />
              <line x1="66" y1="80" x2="198" y2="80" stroke="#34d399" strokeWidth="1.6" strokeDasharray="4 3" />
              <line x1="86" y1="34" x2="178" y2="126" stroke="#fb7185" strokeWidth="1.6" strokeDasharray="4 3" />
              <line x1="178" y1="34" x2="86" y2="126" stroke="#38bdf8" strokeWidth="1.6" strokeDasharray="4 3" />
              <circle cx="132" cy="80" r="3.5" fill="#ffffff" />
            </>
          )}
          <text x="132" y="155" textAnchor="middle" className="text-[10px] font-mono font-bold fill-amber-300">
            {diagram.caption}
          </text>
        </svg>
      </div>
    );
  }

  return null;
}

export default function SimmetriaExercises() {
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
    pageTitle: isEl ? "Ασκήσεις: Αξονική Συμμετρία & Άξονες Συμμετρίας | Α' Γυμνασίου" : "Exercises: Axial Symmetry & Axes of Symmetry | Grade 7",
    pageDesc: isEl
      ? "Διαδραστικές ασκήσεις Α' Γυμνασίου στην αξονική συμμετρία: συμμετρία σημείου και σχήματος ως προς άξονα, ιδιότητες ισομετρίας και άξονες συμμετρίας βασικών σχημάτων."
      : "Interactive Grade 7 geometry exercises on axial symmetry: point and figure reflection across a line, isometry properties, and symmetry axes of basic shapes.",
    backNav: isEl ? "Θεωρία Κεφ. 11" : "Theory Ch. 11",
    theoryBtn: isEl ? "ΘΕΩΡΙΑ" : "THEORY",
    heroBadge: isEl ? "ΑΣΚΗΣΕΙΣ • ΚΕΦΑΛΑΙΟ 11 • Α' ΓΥΜΝΑΣΙΟΥ" : "EXERCISES • CHAPTER 11 • GRADE 7",
    heroTitle: isEl ? "Αξονική Συμμετρία: Εξάσκηση" : "Axial Symmetry: Practice",
    heroDesc: isEl
      ? "12 δυναμικές ερωτήσεις και προβλήματα στη συμμετρία σημείου και σχήματος ως προς άξονα (ε) και στους άξονες συμμετρίας βασικών γεωμετρικών σχημάτων."
      : "12 dynamic questions and problems on point and figure reflection across axis (l) and axes of symmetry of basic geometric shapes.",
    btnNewSet: isEl ? "ΝΕΕΣ ΑΣΚΗΣΕΙΣ" : "NEW EXERCISES",
    btnTryNewSet: isEl ? "ΔΟΚΙΜΑΣΤΕ ΝΕΟ ΣΕΤ" : "TRY NEW SET",
    scoreLabel: isEl ? "Αποτέλεσμα" : "Score",
    scoreGreat: isEl
      ? "Εξαιρετική επίδοση! Κατέχετε πλήρως την αξονική συμμετρία και τους άξονες συμμετρίας όλων των βασικών σχημάτων."
      : "Outstanding performance! You have completely mastered axial symmetry and the axes of symmetry of basic geometric shapes.",
    scoreGood: isEl
      ? "Πολύ καλή προσπάθεια! Μελετήστε τα αναλυτικά βήματα και τα σχήματα παρακάτω στα σημεία που δυσκολευτήκατε."
      : "Very good effort! Review the detailed steps and diagrams below for any questions you missed.",
    scoreNeedWork: isEl
      ? "Χρειάζεται λίγη επανάληψη ακόμα στην αξονική συμμετρία και στον αριθμό αξόνων συμμετρίας των σχημάτων!"
      : "Needs a bit more review on axial symmetry and the number of symmetry axes of shapes!",
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

    // Q1: True / False - Ορισμός συμμετρικού σημείου ως προς άξονα (ε)
    const q1Pool = isEl
      ? [
          {
            p: "Αν το σημείο Α' είναι το συμμετρικό του σημείου Α ως προς ευθεία (ε), τότε η ευθεία (ε) είναι η μεσοκάθετος του ευθυγράμμου τμήματος ΑΑ'.",
            t: true,
            e: "Εξ ορισμού, το Α' είναι συμμετρικό του Α ως προς (ε) όταν η (ε) είναι κάθετη στο ΑΑ' και το τέμνει στο μέσο του (μεσοκάθετος του ΑΑ')."
          },
          {
            p: "Αν ένα σημείο Κ βρίσκεται πάνω στον άξονα συμμετρίας (ε), τότε το συμμετρικό του σημείο Κ' βρίσκεται στην άλλη πλευρά της (ε) σε απόσταση 1 cm.",
            t: false,
            e: "Κάθε σημείο που ανήκει πάνω στον άξονα συμμετρίας (ε) έχει ως συμμετρικό τον ίδιο τον εαυτό του (Κ' ≡ Κ)."
          },
          {
            p: "Η αξονική συμμετρία διατηρεί τα μήκη των ευθυγράμμων τμημάτων και τα μέτρα των γωνιών ενός σχήματος.",
            t: true,
            e: "Η αξονική συμμετρία είναι ισομετρία: το συμμετρικό σχήμα είναι ίσο με το αρχικό (ίδια μήκη πλευρών, ίδιες γωνίες, ίδιο εμβαδόν)."
          }
        ]
      : [
          {
            p: "If point A' is the reflection of point A across line (l), then line (l) is the perpendicular bisector of segment AA'.",
            t: true,
            e: "By definition, A' is the reflection of A across (l) when (l) is perpendicular to AA' and bisects it."
          },
          {
            p: "If a point K lies directly on the axis of symmetry (l), its reflection K' lies on the other side of (l) at distance 1 cm.",
            t: false,
            e: "Any point lying on the axis of symmetry (l) is its own reflection (K' ≡ K)."
          },
          {
            p: "Axial symmetry preserves the lengths of line segments and the measures of angles of a figure.",
            t: true,
            e: "Axial symmetry is an isometry: the reflected figure is congruent to the original figure."
          }
        ];

    const pickedQ1 = pickRandom(q1Pool);
    qList.push({
      id: 1,
      title: isEl ? 'Ορισμός Αξονικής Συμμετρίας' : 'Definition of Axial Symmetry',
      prompt: pickedQ1.p,
      type: 'tf',
      correct: pickedQ1.t ? (isEl ? 'Σωστό' : 'True') : (isEl ? 'Λάθος' : 'False'),
      options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
      explanation: pickedQ1.e
    });

    // Q2: Input - Απόσταση σημείου Α από άξονα (ε) -> Μήκος ΑΑ' (ή το αντίστροφο) (+ SVG)
    const halfDist2 = randInt(3, 14);
    const fullDist2 = 2 * halfDist2;
    const askFull2 = Math.random() < 0.5;

    qList.push({
      id: 2,
      title: isEl ? 'Απόσταση Συμμετρικών Σημείων' : 'Distance Between Symmetric Points',
      prompt: askFull2
        ? (isEl
            ? `Το σημείο Α' είναι το συμμετρικό του σημείου Α ως προς ευθεία (ε). Αν το σημείο Α απέχει από την ευθεία (ε) απόσταση ${halfDist2} cm, πόσα εκατοστά (cm) είναι το μήκος του τμήματος ΑΑ';`
            : `Point A' is the reflection of point A across line (l). If point A is at distance ${halfDist2} cm from line (l), what is the length of segment AA' in cm?`)
        : (isEl
            ? `Το σημείο Α' είναι το συμμετρικό του σημείου Α ως προς ευθεία (ε). Αν το τμήμα ΑΑ' έχει μήκος ${fullDist2} cm, πόσα εκατοστά (cm) απέχει το σημείο Α από την ευθεία (ε);`
            : `Point A' is the reflection of point A across line (l). If segment AA' has length ${fullDist2} cm, what is the distance from point A to line (l) in cm?`),
      type: 'input',
      correct: askFull2 ? fullDist2 : halfDist2,
      unit: 'cm',
      diagram: { type: 'pointReflection', halfLabel: `${halfDist2} cm`, showK: false },
      explanation: askFull2 ? (
        <span className="font-mono">
          {isEl
            ? `Επειδή η (ε) είναι μεσοκάθετος του ΑΑ', το Α' απέχει επίσης ${halfDist2} cm από την (ε), άρα ΑΑ' ＝ 2 · ${halfDist2} ＝ ${fullDist2} cm.`
            : `Since (l) is the perpendicular bisector of AA', A' is also ${halfDist2} cm from (l), so AA' ＝ 2 · ${halfDist2} ＝ ${fullDist2} cm.`}
        </span>
      ) : (
        <span className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
          <span>{isEl ? 'Η (ε) τέμνει το ΑΑ\' στο μέσο του Μ:' : 'Line (l) bisects AA\' at its midpoint M:'}</span>
          <span className="inline-flex items-center gap-1 font-mono whitespace-nowrap">
            ΑΜ ＝ <Frac num={fullDist2} den="2" /> ＝ {halfDist2} cm.
          </span>
        </span>
      )
    });

    // Q3: MCQ - Πλήθος αξόνων συμμετρίας βασικών σχημάτων (Μέρος Α: Τρίγωνα / Τμήμα / Γωνία)
    const triPool3 = isEl
      ? [
          {
            q: 'Πόσους άξονες συμμετρίας έχει ένα ισόπλευρο τρίγωνο;',
            c: '3 άξονες συμμετρίας',
            e: 'Το ισόπλευρο τρίγωνο έχει 3 άξονες συμμετρίας: τις μεσοκαθέτους των τριών πλευρών του.'
          },
          {
            q: 'Πόσους άξονες συμμετρίας έχει ένα ισοσκελές τρίγωνο (που δεν είναι ισόπλευρο);',
            c: '1 άξονα συμμετρίας',
            e: 'Το ισοσκελές τρίγωνο έχει 1 άξονα συμμετρίας: τη μεσοκάθετο της βάσης του.'
          },
          {
            q: 'Πόσους άξονες συμμετρίας έχει ένα ευθύγραμμο τμήμα ΑΒ;',
            c: '2 άξονες συμμετρίας',
            e: 'Ένα ευθύγραμμο τμήμα έχει 2 άξονες συμμετρίας: τη μεσοκάθετό του και τον φορέα του (την ευθεία που το περιέχει).'
          },
          {
            q: 'Ποια ευθεία αποτελεί τον άξονα συμμετρίας μιας γωνίας χΟψ;',
            c: 'Η ευθεία της διχοτόμου της',
            e: 'Μια γωνία χΟψ έχει 1 άξονα συμμετρίας: την ευθεία της διχοτόμου της.'
          }
        ]
      : [
          {
            q: 'How many axes of symmetry does an equilateral triangle have?',
            c: '3 axes of symmetry',
            e: 'An equilateral triangle has 3 axes of symmetry: the perpendicular bisectors of its three sides.'
          },
          {
            q: 'How many axes of symmetry does a non-equilateral isosceles triangle have?',
            c: '1 axis of symmetry',
            e: 'An isosceles triangle has 1 axis of symmetry: the perpendicular bisector of its base.'
          },
          {
            q: 'How many axes of symmetry does a line segment AB have?',
            c: '2 axes of symmetry',
            e: 'A line segment has 2 axes of symmetry: its perpendicular bisector and the line containing the segment.'
          },
          {
            q: 'Which line is the axis of symmetry of an angle ∠xOy?',
            c: 'The line containing its angle bisector',
            e: 'An angle ∠xOy has 1 axis of symmetry: the line containing its angle bisector.'
          }
        ];

    const pickedTri3 = pickRandom(triPool3);
    const dist3 = isEl
      ? [
          '3 άξονες συμμετρίας',
          '1 άξονα συμμετρίας',
          '2 άξονες συμμετρίας',
          'Η ευθεία της διχοτόμου της',
          '0 άξονες συμμετρίας',
          'Άπειρους άξονες συμμετρίας'
        ]
      : [
          '3 axes of symmetry',
          '1 axis of symmetry',
          '2 axes of symmetry',
          'The line containing its angle bisector',
          '0 axes of symmetry',
          'Infinitely many axes of symmetry'
        ];

    qList.push({
      id: 3,
      title: isEl ? 'Άξονες Συμμετρίας Τριγώνων, Τμήματος & Γωνίας' : 'Symmetry Axes of Triangles, Segment & Angle',
      prompt: pickedTri3.q,
      type: 'mcq',
      correct: pickedTri3.c,
      options: ensureFourUniqueOptions(pickedTri3.c, () => pickRandom(dist3)),
      explanation: pickedTri3.e
    });

    // Q4: MCQ - Πλήθος αξόνων συμμετρίας Τετραπλεύρων & Κύκλου
    const quadPool4 = isEl
      ? [
          {
            q: 'Πόσους άξονες συμμετρίας έχει ένα τετράγωνο;',
            c: '4 άξονες συμμετρίας',
            e: 'Το τετράγωνο έχει 4 άξονες συμμετρίας: τις 2 μεσοκαθέτους των απέναντι πλευρών και τις 2 διαγωνίους του.'
          },
          {
            q: 'Πόσους άξονες συμμετρίας έχει ένας κύκλος (Ο, ρ);',
            c: 'Άπειρους άξονες συμμετρίας',
            e: 'Κάθε ευθεία που διέρχεται από το κέντρο Ο του κύκλου είναι άξονας συμμετρίας του (άπειροι άξονες).'
          },
          {
            q: 'Πόσους άξονες συμμετρίας έχει ένα γενικό (πλάγιο) παραλληλόγραμμο;',
            c: '0 άξονες συμμετρίας',
            e: 'Ένα γενικό παραλληλόγραμμο δεν έχει κανέναν άξονα συμμετρίας.'
          },
          {
            q: 'Πόσους άξονες συμμετρίας έχει ένα ισοσκελές τραπέζιο;',
            c: '1 άξονα συμμετρίας',
            e: 'Το ισοσκελές τραπέζιο έχει 1 άξονα συμμετρίας: την κοινή μεσοκάθετο των δύο βάσεών του.'
          }
        ]
      : [
          {
            q: 'How many axes of symmetry does a square have?',
            c: '4 axes of symmetry',
            e: 'A square has 4 axes of symmetry: the 2 perpendicular bisectors of opposite sides and its 2 diagonals.'
          },
          {
            q: 'How many axes of symmetry does a circle (O, ρ) have?',
            c: 'Infinitely many axes of symmetry',
            e: 'Every line passing through center O is an axis of symmetry of the circle (infinitely many).'
          },
          {
            q: 'How many axes of symmetry does a general (slanted) parallelogram have?',
            c: '0 axes of symmetry',
            e: 'A general parallelogram has 0 axes of symmetry.'
          },
          {
            q: 'How many axes of symmetry does an isosceles trapezoid have?',
            c: '1 axis of symmetry',
            e: 'An isosceles trapezoid has 1 axis of symmetry: the common perpendicular bisector of its two bases.'
          }
        ];

    const pickedQuad4 = pickRandom(quadPool4);
    const dist4 = isEl
      ? [
          '4 άξονες συμμετρίας',
          'Άπειρους άξονες συμμετρίας',
          '0 άξονες συμμετρίας',
          '1 άξονα συμμετρίας',
          '2 άξονες συμμετρίας'
        ]
      : [
          '4 axes of symmetry',
          'Infinitely many axes of symmetry',
          '0 axes of symmetry',
          '1 axis of symmetry',
          '2 axes of symmetry'
        ];

    qList.push({
      id: 4,
      title: isEl ? 'Άξονες Συμμετρίας Τετραπλεύρων & Κύκλου' : 'Symmetry Axes of Quadrilaterals & Circle',
      prompt: pickedQuad4.q,
      type: 'mcq',
      correct: pickedQuad4.c,
      options: ensureFourUniqueOptions(pickedQuad4.c, () => pickRandom(dist4)),
      explanation: pickedQuad4.e
    });

    // Q5: True / False - Κλασική παγίδα: Διαγώνιοι ορθογωνίου vs ρόμβου
    const tfPool5 = isEl
      ? [
          {
            p: 'Σε ένα ορθογώνιο (που δεν είναι τετράγωνο), οι δύο διαγώνιοί του ΔΕΝ είναι άξονες συμμετρίας — άξονες συμμετρίας είναι μόνο οι 2 μεσοκάθετοι των πλευρών του.',
            t: true,
            e: 'Αν διπλώσουμε ένα ορθογώνιο κατά μήκος μιας διαγωνίου, οι απέναντι κορυφές δεν συμπίπτουν. Άξονες συμμετρίας του ορθογωνίου είναι οι 2 μεσοκάθετοι των απέναντι πλευρών.'
          },
          {
            p: 'Σε έναν ρόμβο, οι δύο διαγώνιοί του είναι άξονες συμμετρίας του σχήματος.',
            t: true,
            e: 'Οι διαγώνιοι του ρόμβου είναι κάθετες, διχοτομούνται και διχοτομούν τις γωνίες του, άρα αποτελούν τους 2 άξονες συμμετρίας του.'
          },
          {
            p: 'Ένα σκαληνό τρίγωνο έχει 1 άξονα συμμετρίας.',
            t: false,
            e: 'Το σκαληνό τρίγωνο (με 3 άνισες πλευρές) έχει 0 άξονες συμμετρίας.'
          }
        ]
      : [
          {
            p: 'In a non-square rectangle, its two diagonals are NOT axes of symmetry — only the 2 perpendicular bisectors of opposite sides are.',
            t: true,
            e: 'Folding a non-square rectangle along a diagonal does not align opposite vertices. Only the 2 perpendicular bisectors of opposite sides are symmetry axes.'
          },
          {
            p: 'In a rhombus, its two diagonals are axes of symmetry of the shape.',
            t: true,
            e: 'The diagonals of a rhombus are perpendicular bisectors of each other and bisect the angles, serving as its 2 axes of symmetry.'
          },
          {
            p: 'A scalene triangle has 1 axis of symmetry.',
            t: false,
            e: 'A scalene triangle (with 3 unequal sides) has 0 axes of symmetry.'
          }
        ];

    const pickedTf5 = pickRandom(tfPool5);
    qList.push({
      id: 5,
      title: isEl ? 'Άξονες Συμμετρίας Ορθογωνίου & Ρόμβου' : 'Symmetry Axes of Rectangle & Rhombus',
      prompt: pickedTf5.p,
      type: 'tf',
      correct: pickedTf5.t ? (isEl ? 'Σωστό' : 'True') : (isEl ? 'Λάθος' : 'False'),
      options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
      explanation: pickedTf5.e
    });

    // Q6: Input - Ισομετρία αξονικής συμμετρίας: Περίμετρος συμμετρικού τριγώνου Α'Β'Γ'
    const s1_6 = randInt(5, 9);
    const s2_6 = randInt(6, 11);
    const s3_6 = randInt(7, 12);
    const perim6 = s1_6 + s2_6 + s3_6;

    qList.push({
      id: 6,
      title: isEl ? 'Περίμετρος Συμμετρικού Σχήματος' : 'Perimeter of a Reflected Figure',
      prompt: isEl
        ? `Ένα τρίγωνο ΑΒΓ έχει πλευρές ΑΒ ＝ ${s1_6} cm, ΒΓ ＝ ${s2_6} cm και ΑΓ ＝ ${s3_6} cm. Αν Α'Β'Γ' είναι το συμμετρικό του τρίγωνο ως προς ευθεία (ε), πόσα εκατοστά (cm) είναι η περίμετρος του τριγώνου Α'Β'Γ';`
        : `Triangle ABC has sides AB ＝ ${s1_6} cm, BC ＝ ${s2_6} cm, and AC ＝ ${s3_6} cm. If A'B'C' is its reflection across line (l), what is the perimeter of triangle A'B'C' in cm?`,
      type: 'input',
      correct: perim6,
      unit: 'cm',
      explanation: isEl
        ? `Η αξονική συμμετρία διατηρεί τα μήκη (Α'Β' ＝ ${s1_6} cm, Β'Γ' ＝ ${s2_6} cm, Α'Γ' ＝ ${s3_6} cm), άρα Π ＝ ${s1_6} ＋ ${s2_6} ＋ ${s3_6} ＝ ${perim6} cm.`
        : `Axial symmetry preserves lengths (A'B' ＝ ${s1_6} cm, B'C' ＝ ${s2_6} cm, A'C' ＝ ${s3_6} cm), so P ＝ ${s1_6} ＋ ${s2_6} ＋ ${s3_6} ＝ ${perim6} cm.`
    });

    // Q7: Input - Υπολογισμός γωνίας σε συμμετρικό τρίγωνο Α'Β'Γ' (+ SVG)
    const angA7 = randInt(44, 76);
    const angB7 = randInt(42, 74);
    const angC7 = 180 - angA7 - angB7;

    qList.push({
      id: 7,
      title: isEl ? 'Γωνίες Συμμετρικού Τριγώνου' : 'Angles of a Reflected Triangle',
      prompt: isEl ? (
        <span>
          Το τρίγωνο Α'Β'Γ' είναι το συμμετρικό του τριγώνου ΑΒΓ ως προς άξονα (ε). Αν στο τρίγωνο ΑΒΓ δίνονται <Angle>Α</Angle> ＝ {angA7}° και <Angle>Β</Angle> ＝ {angB7}°, πόσες μοίρες είναι η γωνία <Angle>Γ'</Angle>;
        </span>
      ) : (
        <span>
          Triangle A'B'C' is the reflection of triangle ABC across axis (l). If in triangle ABC ∠A ＝ {angA7}° and ∠B ＝ {angB7}°, how many degrees is angle ∠C'?
        </span>
      ),
      type: 'input',
      correct: angC7,
      unit: '°',
      diagram: {
        type: 'triangleReflection',
        lblA: isEl ? `Α (${angA7}°)` : `A (${angA7}°)`,
        lblB: isEl ? `Β (${angB7}°)` : `B (${angB7}°)`,
        lblC: isEl ? `Γ (${angC7}°)` : `C (${angC7}°)`,
        lblAp: isEl ? `Α'` : `A'`,
        lblBp: isEl ? `Β'` : `B'`,
        lblCp: isEl ? `Γ' (${angC7}°)` : `C' (${angC7}°)`
      },
      explanation: isEl ? (
        <span>
          Στο τρίγωνο ΑΒΓ έχουμε <Angle>Γ</Angle> ＝ 180° － ({angA7}° ＋ {angB7}°) ＝ {angC7}°. Επειδή η αξονική συμμετρία διατηρεί τις γωνίες, <Angle>Γ'</Angle> ＝ <Angle>Γ</Angle> ＝ {angC7}°.
        </span>
      ) : (
        <span>
          In triangle ABC, ∠C ＝ 180° － ({angA7}° ＋ {angB7}°) ＝ {angC7}°. Since axial symmetry preserves angles, ∠C' ＝ ∠C ＝ {angC7}°.
        </span>
      )
    });

    // Q8: Input + tableData + SVG - Εύρεση απόστασης ανάμεσα σε Α και Α' μέσω συμμετρικού τριγώνου
    const distA8 = randInt(4, 11);
    const totalAAp8 = 2 * distA8;

    qList.push({
      id: 8,
      title: isEl ? 'Απόσταση Αντίστοιχων Κορυφών (ΑΑ\')' : 'Distance Between Reflected Vertices (AA\')',
      prompt: isEl
        ? `Το τρίγωνο Α'Β'Γ' είναι το συμμετρικό του τριγώνου ΑΒΓ ως προς ευθεία (ε). Αν η κορυφή Α απέχει από τον άξονα (ε) απόσταση ${distA8} cm, πόσα εκατοστά (cm) απέχει η κορυφή Α από τη συμμετρική της Α';`
        : `Triangle A'B'C' is the reflection of triangle ABC across line (l). If vertex A is at distance ${distA8} cm from axis (l), what is the distance between vertex A and its reflection A' in cm?`,
      type: 'input',
      correct: totalAAp8,
      unit: 'cm',
      diagram: {
        type: 'triangleReflection',
        lblA: isEl ? 'Α' : 'A',
        lblAp: isEl ? "Α'" : "A'"
      },
      tableData: [
        {
          label: isEl ? '1. Απόσταση Α από (ε)' : '1. Distance of A from (l)',
          details: `ΑΜ ＝ ${distA8} cm`
        },
        {
          label: isEl ? '2. Ιδιότητα μεσοκαθέτου (ε)' : '2. Perpendicular bisector property',
          details: (
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
              <span className="whitespace-nowrap">ΜΑ' ＝ ΑΜ ＝ {distA8} cm</span>
              <span className="whitespace-nowrap">⇒ ΑΑ' ＝ 2 · {distA8} ＝ {totalAAp8} cm</span>
            </div>
          )
        }
      ],
      explanation: isEl
        ? `Ο άξονας συμμετρίας (ε) είναι μεσοκάθετος του ΑΑ', οπότε το Α' απέχει επίσης ${distA8} cm από την (ε). Άρα ΑΑ' ＝ ${distA8} ＋ ${distA8} ＝ ${totalAAp8} cm.`
        : `Axis of symmetry (l) is the perpendicular bisector of AA', so A' is also ${distA8} cm from (l). Hence AA' ＝ ${distA8} ＋ ${distA8} ＝ ${totalAAp8} cm.`
    });

    // Q9: MCQ + tableData + SVG - Συνδυαστικό: Συμμετρικό ισοσκελούς τριγώνου ΑΒΓ -> Α'Β'Γ'
    const apex9 = randInt(20, 48) * 2; // άρτια γωνία κορυφής 40°..96°
    const base9 = (180 - apex9) / 2;
    const leg9 = randInt(6, 13);

    const q9Correct = isEl
      ? `Πλευρά Α'Γ' ＝ ${leg9} cm και γωνία Β' ＝ ${base9}°`
      : `Side A'C' ＝ ${leg9} cm and angle ∠B' ＝ ${base9}°`;

    const q9Distractors = isEl
      ? [
          `Πλευρά Α'Γ' ＝ ${leg9} cm και γωνία Β' ＝ ${base9}°`,
          `Πλευρά Α'Γ' ＝ ${leg9} cm και γωνία Β' ＝ ${apex9}°`,
          `Πλευρά Α'Γ' ＝ ${2 * leg9} cm και γωνία Β' ＝ ${base9}°`,
          `Πλευρά Α'Γ' ＝ ${leg9} cm και γωνία Β' ＝ 90°`,
          `Πλευρά Α'Γ' ＝ ${leg9 + 2} cm και γωνία Β' ＝ ${base9 + 5}°`
        ]
      : [
          `Side A'C' ＝ ${leg9} cm and angle ∠B' ＝ ${base9}°`,
          `Side A'C' ＝ ${leg9} cm and angle ∠B' ＝ ${apex9}°`,
          `Side A'C' ＝ ${2 * leg9} cm and angle ∠B' ＝ ${base9}°`,
          `Side A'C' ＝ ${leg9} cm and angle ∠B' ＝ 90°`,
          `Side A'C' ＝ ${leg9 + 2} cm and angle ∠B' ＝ ${base9 + 5}°`
        ];

    qList.push({
      id: 9,
      title: isEl ? 'Συμμετρικό Ισοσκελούς Τριγώνου' : 'Reflection of an Isosceles Triangle',
      prompt: isEl ? (
        <span>
          Ένα ισοσκελές τρίγωνο ΑΒΓ (ΑΒ ＝ ΑΓ) έχει πλευρά ΑΒ ＝ {leg9} cm και γωνία κορυφής <Angle>Α</Angle> ＝ {apex9}°. Αν το τρίγωνο Α'Β'Γ' είναι το συμμετρικό του ως προς ευθεία (ε), πόσο είναι το μήκος της πλευράς Α'Γ' και πόσες μοίρες είναι η γωνία <Angle>Β'</Angle>;
        </span>
      ) : (
        <span>
          An isosceles triangle ABC (AB ＝ AC) has side AB ＝ {leg9} cm and vertex angle ∠A ＝ {apex9}°. If triangle A'B'C' is its reflection across line (l), find side A'C' and angle ∠B'.
        </span>
      ),
      type: 'mcq',
      correct: q9Correct,
      options: ensureFourUniqueOptions(q9Correct, () => pickRandom(q9Distractors)),
      diagram: {
        type: 'triangleReflection',
        lblA: isEl ? `Α (${apex9}°)` : `A (${apex9}°)`,
        lblB: isEl ? `Β (${base9}°)` : `B (${base9}°)`,
        lblBp: isEl ? `Β' (${base9}°)` : `B' (${base9}°)`
      },
      tableData: [
        {
          label: isEl ? '1. Πλευρά ΑΓ & συμμετρική Α\'Γ\'' : '1. Side AC & reflected A\'C\'',
          details: (
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
              <span className="whitespace-nowrap">ΑΓ ＝ ΑΒ ＝ {leg9} cm</span>
              <span className="whitespace-nowrap">⇒ Α'Γ' ＝ ΑΓ ＝ {leg9} cm</span>
            </div>
          )
        },
        {
          label: isEl ? '2. Γωνία βάσης Β & συμμετρική Β\'' : '2. Base angle ∠B & reflected ∠B\'',
          details: (
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
              <span className="inline-flex items-center gap-1 whitespace-nowrap">
                {isEl ? <><Angle>Β</Angle> ＝</> : '∠B ＝'} <Frac num={`180° － ${apex9}°`} den="2" /> ＝ {base9}°
              </span>
              <span className="inline-flex items-center gap-1 whitespace-nowrap">
                ⇒ {isEl ? <><Angle>Β'</Angle> ＝ {base9}°</> : `∠B' ＝ ${base9}°`}
              </span>
            </div>
          )
        }
      ],
      explanation: isEl ? (
        <span>
          Στο ισοσκελές ΑΒΓ έχουμε ΑΓ ＝ ΑΒ ＝ {leg9} cm και <Angle>Β</Angle> ＝ (180° － {apex9}°) ÷ 2 ＝ {base9}°. Λόγω αξονικής συμμετρίας, Α'Γ' ＝ {leg9} cm και <Angle>Β'</Angle> ＝ {base9}°.
        </span>
      ) : (
        <span>
          In isosceles ABC, AC ＝ AB ＝ {leg9} cm and ∠B ＝ (180° － {apex9}°) ÷ 2 ＝ {base9}°. By axial symmetry, A'C' ＝ {leg9} cm and ∠B' ＝ {base9}°.
        </span>
      )
    });

    // Q10: MCQ + tableData + SVG - Κατάταξη σχημάτων κατά πλήθος αξόνων συμμετρίας
    const q10Correct = isEl
      ? 'Παραλληλόγραμμο (0) ＜ Ισοσκελές Τραπέζιο (1) ＜ Ορθογώνιο (2) ＜ Τετράγωνο (4)'
      : 'Parallelogram (0) ＜ Isosceles Trapezoid (1) ＜ Rectangle (2) ＜ Square (4)';

    const q10Distractors = isEl
      ? [
          'Παραλληλόγραμμο (0) ＜ Ισοσκελές Τραπέζιο (1) ＜ Ορθογώνιο (2) ＜ Τετράγωνο (4)',
          'Ισοσκελές Τραπέζιο (1) ＜ Παραλληλόγραμμο (2) ＜ Ορθογώνιο (4) ＜ Τετράγωνο (4)',
          'Παραλληλόγραμμο (0) ＜ Ορθογώνιο (2) ＜ Ρόμβος (4) ＜ Τετράγωνο (4)',
          'Παραλληλόγραμμο (2) ＜ Ισοσκελές Τραπέζιο (2) ＜ Τετράγωνο (4) ＜ Κύκλος (4)',
          'Ορθογώνιο (2) ＜ Ισοσκελές Τραπέζιο (1) ＜ Τετράγωνο (4) ＜ Ρόμβος (2)'
        ]
      : [
          'Parallelogram (0) ＜ Isosceles Trapezoid (1) ＜ Rectangle (2) ＜ Square (4)',
          'Isosceles Trapezoid (1) ＜ Parallelogram (2) ＜ Rectangle (4) ＜ Square (4)',
          'Parallelogram (0) ＜ Rectangle (2) ＜ Rhombus (4) ＜ Square (4)',
          'Parallelogram (2) ＜ Isosceles Trapezoid (2) ＜ Square (4) ＜ Circle (4)',
          'Rectangle (2) ＜ Isosceles Trapezoid (1) ＜ Square (4) ＜ Rhombus (2)'
        ];

    qList.push({
      id: 10,
      title: isEl ? 'Σύγκριση Αξόνων Συμμετρίας Τετραπλεύρων' : 'Comparing Symmetry Axes of Quadrilaterals',
      prompt: isEl
        ? 'Ποια από τις παρακάτω διατάξεις κατατάσσει σωστά τα σχήματα από αυτό με τους ΛΙΓΟΤΕΡΟΥΣ άξονες συμμετρίας προς αυτό με τους ΠΕΡΙΣΣΟΤΕΡΟΥΣ;'
        : 'Which ordering correctly ranks the shapes from FEWEST axes of symmetry to MOST axes of symmetry?',
      type: 'mcq',
      correct: q10Correct,
      options: ensureFourUniqueOptions(q10Correct, () => pickRandom(q10Distractors)),
      diagram: {
        type: 'shapeAxes',
        shape: 'square',
        caption: isEl ? 'Τετράγωνο: 4 άξονες συμμετρίας' : 'Square: 4 axes of symmetry'
      },
      tableData: [
        {
          label: isEl ? 'Παραλληλόγραμμο & Ισοσκ. Τραπέζιο' : 'Parallelogram & Isosc. Trapezoid',
          details: isEl ? 'Παραλληλόγραμμο: 0 άξονες • Ισοσκελές Τραπέζιο: 1 άξονας' : 'Parallelogram: 0 axes • Isosceles Trapezoid: 1 axis'
        },
        {
          label: isEl ? 'Ορθογώνιο & Τετράγωνο' : 'Rectangle & Square',
          details: isEl ? 'Ορθογώνιο: 2 άξονες • Τετράγωνο: 4 άξονες' : 'Rectangle: 2 axes • Square: 4 axes'
        }
      ],
      explanation: isEl
        ? 'Το γενικό παραλληλόγραμμο έχει 0 άξονες, το ισοσκελές τραπέζιο 1 άξονα, το ορθογώνιο 2 άξονες (τις μεσοκαθέτους των πλευρών) και το τετράγωνο 4 άξονες συμμετρίας.'
        : 'A general parallelogram has 0 axes, an isosceles trapezoid has 1, a rectangle has 2 (perpendicular bisectors of sides), and a square has 4 axes of symmetry.'
    });

    // Q11: Input + tableData + SVG - Σημείο Κ πάνω στον άξονα (ε) & συμμετρικά Α, Α' -> Περίμετρος τριγώνου ΚΑΑ'
    const halfBase11 = randInt(3, 8);
    const fullBase11 = 2 * halfBase11;
    const sideKA11 = randInt(halfBase11 + 2, halfBase11 + 9);
    const perimKAA11 = 2 * sideKA11 + fullBase11;

    qList.push({
      id: 11,
      title: isEl ? 'Πρόβλημα Μεσοκαθέτου & Συμμετρικών Σημείων' : 'Perpendicular Bisector & Symmetric Points Problem',
      prompt: isEl
        ? `Το σημείο Α' είναι το συμμετρικό του σημείου Α ως προς ευθεία (ε). Αν το σημείο Α απέχει ${halfBase11} cm από την ευθεία (ε) και Κ είναι ένα σημείο πάνω στην ευθεία (ε) ώστε ΚΑ ＝ ${sideKA11} cm, πόσα εκατοστά (cm) είναι η περίμετρος του τριγώνου ΚΑΑ';`
        : `Point A' is the reflection of point A across line (l). If point A is ${halfBase11} cm from line (l) and K is a point on line (l) with KA ＝ ${sideKA11} cm, what is the perimeter of triangle KAA' in cm?`,
      type: 'input',
      correct: perimKAA11,
      unit: 'cm',
      diagram: {
        type: 'pointReflection',
        halfLabel: `${halfBase11} cm`,
        showK: true,
        kLabel: `${sideKA11} cm`
      },
      tableData: [
        {
          label: isEl ? '1. Μήκος βάσης ΑΑ\'' : '1. Base length AA\'',
          details: `ΑΑ' ＝ 2 · ${halfBase11} ＝ ${fullBase11} cm`
        },
        {
          label: isEl ? '2. Ισαπόσταση ΚΑ\' ＝ ΚΑ' : '2. Equidistance KA\' ＝ KA',
          details: (
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
              <span>{isEl ? 'Το Κ ανήκει στη μεσοκάθετο (ε)' : 'K lies on perpendicular bisector (l)'}</span>
              <span className="whitespace-nowrap">⇒ ΚΑ' ＝ ΚΑ ＝ {sideKA11} cm</span>
            </div>
          )
        },
        {
          label: isEl ? '3. Περίμετρος τριγώνου ΚΑΑ\'' : '3. Perimeter of triangle KAA\'',
          details: `Π ＝ ${sideKA11} ＋ ${sideKA11} ＋ ${fullBase11} ＝ ${perimKAA11} cm`
        }
      ],
      explanation: isEl
        ? `Επειδή η (ε) είναι μεσοκάθετος του ΑΑ', έχουμε ΑΑ' ＝ 2 · ${halfBase11} ＝ ${fullBase11} cm και ΚΑ' ＝ ΚΑ ＝ ${sideKA11} cm. Άρα η περίμετρος του τριγώνου ΚΑΑ' είναι ${sideKA11} ＋ ${sideKA11} ＋ ${fullBase11} ＝ ${perimKAA11} cm.`
        : `Since (l) is the perpendicular bisector of AA', AA' ＝ 2 · ${halfBase11} ＝ ${fullBase11} cm and KA' ＝ KA ＝ ${sideKA11} cm. Thus the perimeter of triangle KAA' is ${sideKA11} ＋ ${sideKA11} ＋ ${fullBase11} ＝ ${perimKAA11} cm.`
    });

    // Q12: MCQ + tableData + SVG - Συμμετρικό κύκλου (Ο, ρ) ως προς ευθεία (ε)
    const r12 = randInt(5, 13);
    const d12 = 2 * r12;
    const q12Correct = isEl
      ? `Κύκλος (Ο', ρ) με ακτίνα ρ ＝ ${r12} cm (και διάμετρο ${d12} cm)`
      : `Circle (O', ρ) with radius ρ ＝ ${r12} cm (and diameter ${d12} cm)`;

    const q12Distractors = isEl
      ? [
          `Κύκλος (Ο', ρ) με ακτίνα ρ ＝ ${r12} cm (και διάμετρο ${d12} cm)`,
          `Κύκλος (Ο', 2ρ) με ακτίνα ${d12} cm`,
          `Ημικύκλιο ακτίνας ρ ＝ ${r12} cm`,
          `Έλλειψη με άξονα συμμετρίας την ευθεία (ε)`,
          `Κύκλος με το ίδιο κέντρο Ο και ακτίνα ${r12} cm`
        ]
      : [
          `Circle (O', ρ) with radius ρ ＝ ${r12} cm (and diameter ${d12} cm)`,
          `Circle (O', 2ρ) with radius ${d12} cm`,
          `Semicircle of radius ρ ＝ ${r12} cm`,
          `Ellipse with axis of symmetry (l)`,
          `Circle with the same center O and radius ${r12} cm`
        ];

    qList.push({
      id: 12,
      title: isEl ? 'Συμμετρικός Κύκλος ως προς Άξονα (ε)' : 'Reflected Circle Across Axis (l)',
      prompt: isEl
        ? `Δίνεται κύκλος (Ο, ρ) με ακτίνα ρ ＝ ${r12} cm, του οποίου το κέντρο Ο δεν ανήκει σε ευθεία (ε). Τι σχήμα είναι το συμμετρικό του κύκλου ως προς την ευθεία (ε);`
        : `Given a circle (O, ρ) with radius ρ ＝ ${r12} cm whose center O does not lie on line (l), what figure is the reflection of this circle across line (l)?`,
      type: 'mcq',
      correct: q12Correct,
      options: ensureFourUniqueOptions(q12Correct, () => pickRandom(q12Distractors)),
      diagram: {
        type: 'shapeAxes',
        shape: 'circle',
        caption: isEl ? `Κύκλος (Ο, ρ): ίσος κύκλος με ακτίνα ρ ＝ ${r12} cm` : `Circle (O, ρ): congruent circle of radius ρ ＝ ${r12} cm`
      },
      tableData: [
        {
          label: isEl ? '1. Συμμετρικό κέντρου Ο' : '1. Reflection of center O',
          details: isEl ? 'Το κέντρο Ο μεταφέρεται στο συμμετρικό του σημείο Ο\' ως προς (ε)' : 'Center O maps to its reflection O\' across (l)'
        },
        {
          label: isEl ? '2. Διατήρηση ακτίνας ρ' : '2. Preservation of radius ρ',
          details: (
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
              <span>{isEl ? 'Η αξονική συμμετρία διατηρεί τις αποστάσεις' : 'Axial symmetry preserves distances'}</span>
              <span>
                ⇒ {isEl ? `ίσος κύκλος (Ο', ρ) με ρ ＝ ${r12} cm` : `congruent circle (O', ρ) with ρ ＝ ${r12} cm`}
              </span>
            </div>
          )
        }
      ],
      explanation: isEl
        ? `Επειδή η αξονική συμμετρία διατηρεί τις αποστάσεις, το συμμετρικό ενός κύκλου (Ο, ρ) ως προς ευθεία (ε) είναι ένας ίσος κύκλος (Ο', ρ) με κέντρο το συμμετρικό Ο' και την ίδια ακτίνα ρ ＝ ${r12} cm.`
        : `Since axial symmetry preserves distances, the reflection of circle (O, ρ) across line (l) is a congruent circle (O', ρ) centered at O' with the same radius ρ ＝ ${r12} cm.`
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

  const answeredCount = Object.keys(userAnswers).filter(k => userAnswers[k] !== '' && userAnswers[k] !== undefined).length;

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/a-gymnasiou/48-simmetria"
      backText={t.backNav}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/48-simmetria"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all duration-200"
        >
          <span>📖 {toCleanUppercase(t.theoryBtn)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 4k:px-24 py-4 sm:py-6 pb-28 sm:pb-36 overflow-x-hidden text-slate-800 box-border">
        
        {/* Header Banner */}
        <section className="bg-gradient-to-r from-indigo-900 to-blue-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 mb-6 sm:mb-8 shadow-xl">
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
              {t.scoreLabel}: {score} / 12 ({Math.round((score / 12) * 100)}%)
            </h2>
            <p className="text-slate-600 text-xs sm:text-base max-w-xl mx-auto mb-4">
              {score >= 10 ? t.scoreGreat : score >= 6 ? t.scoreGood : t.scoreNeedWork}
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
                    : 'border-slate-200 shadow-sm'
                }`}
              >
                {/* Header Ερώτησης */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs sm:text-sm shrink-0">
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
                                      <td className="p-2 sm:p-2.5 font-semibold text-slate-800 align-top break-words [overflow-wrap:anywhere] leading-relaxed">{row.label}</td>
                                      <td className="p-2 sm:p-2.5 font-mono text-indigo-900 break-words [overflow-wrap:anywhere] align-top leading-relaxed">{row.details}</td>
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
                                {q.renderOption ? q.renderOption(q.correct) : (typeof q.correct === 'number' ? q.correct.toLocaleString(locCode) : q.correct)} {q.unit || ''}
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
                            {q.renderOption ? q.renderOption(q.correct) : (typeof q.correct === 'number' ? q.correct.toLocaleString(locCode) : q.correct)} {q.unit || ''}
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
                  {toCleanUppercase(t.answeredLabel)}: <span className="text-indigo-400 font-black">{answeredCount}</span> / 12
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 text-[11px] sm:text-sm font-black">
                  <span className="text-emerald-400">{toCleanUppercase(isEl ? 'ΣΚΟΡ' : 'SCORE')}: {score} / 12</span>
                  <span className="hidden xs:inline text-slate-500">|</span>
                  <span className="text-indigo-300">{Math.round((score / 12) * 100)}%</span>
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