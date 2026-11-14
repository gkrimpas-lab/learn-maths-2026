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
    ? { A: 'Α', B: 'Β', C: 'Γ', D: 'Δ', O: 'Ο' }
    : { A: 'A', B: 'B', C: 'C', D: 'D', O: 'O' };

  // 1. Γενικό κυρτό τετράπλευρο ΑΒΓΔ (Ερ. 2)
  if (diagram.type === 'quad') {
    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 160" className="w-full max-w-[265px] h-36 select-none">
          <polygon points="75,28 205,36 225,126 42,120" fill="rgba(99, 102, 241, 0.22)" stroke="#818cf8" strokeWidth="2.2" strokeLinejoin="round" />
          <circle cx="75" cy="28" r="3.5" fill="#34d399" />
          <circle cx="205" cy="36" r="3.5" fill="#34d399" />
          <circle cx="225" cy="126" r="3.5" fill="#34d399" />
          <circle cx="42" cy="120" r="3.5" fill="#34d399" />
          <text x="68" y="18" textAnchor="middle" className="text-[11px] font-black fill-white">
            {v.A} ({diagram.angA}°)
          </text>
          <text x="212" y="25" textAnchor="middle" className="text-[11px] font-black fill-white">
            {v.B} ({diagram.angB}°)
          </text>
          <text x="230" y="143" textAnchor="middle" className="text-[11px] font-black fill-white">
            {v.C} ({diagram.angC}°)
          </text>
          <text x="38" y="138" textAnchor="middle" className="text-[11px] font-black fill-emerald-300">
            {v.D} ({diagram.angD}°)
          </text>
        </svg>
      </div>
    );
  }

  // 2. Παραλληλόγραμμο ΑΒΓΔ (Ερ. 3, 9, 12)
  if (diagram.type === 'parallelogram') {
    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 270 160" className="w-full max-w-[270px] h-36 select-none">
          <polygon points="75,34 225,34 195,126 45,126" fill="rgba(99, 102, 241, 0.22)" stroke="#818cf8" strokeWidth="2.2" strokeLinejoin="round" />
          {diagram.showDiags && (
            <>
              <line x1="75" y1="34" x2="195" y2="126" stroke="#fbbf24" strokeWidth="1.8" strokeDasharray="4 3" />
              <line x1="225" y1="34" x2="45" y2="126" stroke="#34d399" strokeWidth="1.8" strokeDasharray="4 3" />
              <circle cx="135" cy="80" r="3.5" fill="#fbbf24" />
              <text x="135" y="68" textAnchor="middle" className="text-[11px] font-black fill-amber-300">{v.O}</text>
            </>
          )}
          <circle cx="75" cy="34" r="3.5" fill="#34d399" />
          <circle cx="225" cy="34" r="3.5" fill="#34d399" />
          <circle cx="195" cy="126" r="3.5" fill="#34d399" />
          <circle cx="45" cy="126" r="3.5" fill="#34d399" />

          <text x="72" y="22" textAnchor="middle" className="text-[11px] font-black fill-white">
            {diagram.angA ? `${v.A} (${diagram.angA}°)` : v.A}
          </text>
          <text x="228" y="22" textAnchor="middle" className="text-[11px] font-black fill-white">
            {diagram.angB ? `${v.B} (${diagram.angB}°)` : v.B}
          </text>
          <text x="200" y="143" textAnchor="middle" className="text-[11px] font-black fill-emerald-300">
            {diagram.angC ? `${v.C} (${diagram.angC}°)` : v.C}
          </text>
          <text x="42" y="143" textAnchor="middle" className="text-[11px] font-black fill-emerald-300">
            {diagram.angD ? `${v.D} (${diagram.angD}°)` : v.D}
          </text>

          {diagram.sideTop && (
            <text x="150" y="24" textAnchor="middle" className="text-[10px] font-mono font-bold fill-amber-300">
              {diagram.sideTop}
            </text>
          )}
          {diagram.sideRight && (
            <text x="218" y="84" textAnchor="start" className="text-[10px] font-mono font-bold fill-sky-300">
              {diagram.sideRight}
            </text>
          )}
        </svg>
      </div>
    );
  }

  // 3. Ρόμβος ΑΒΓΔ (Ερ. 7, 10)
  if (diagram.type === 'rhombus') {
    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 165" className="w-full max-w-[265px] h-38 select-none">
          <polygon points="132,22 215,82 132,142 49,82" fill="rgba(99, 102, 241, 0.22)" stroke="#818cf8" strokeWidth="2.2" strokeLinejoin="round" />
          <line x1="132" y1="22" x2="132" y2="142" stroke="#fbbf24" strokeWidth="1.8" strokeDasharray="4 3" />
          <line x1="49" y1="82" x2="215" y2="82" stroke="#34d399" strokeWidth="1.8" strokeDasharray="4 3" />
          <polyline points="132,72 142,72 142,82" fill="none" stroke="#fb7185" strokeWidth="1.8" />
          <circle cx="132" cy="82" r="3.5" fill="#fbbf24" />
          <circle cx="132" cy="22" r="3.5" fill="#34d399" />
          <circle cx="215" cy="82" r="3.5" fill="#34d399" />
          <circle cx="132" cy="142" r="3.5" fill="#34d399" />
          <circle cx="49" cy="82" r="3.5" fill="#34d399" />

          <text x="132" y="14" textAnchor="middle" className="text-[11px] font-black fill-white">{v.A}</text>
          <text x="226" y="86" textAnchor="start" className="text-[11px] font-black fill-white">{v.B}</text>
          <text x="132" y="157" textAnchor="middle" className="text-[11px] font-black fill-white">{v.C}</text>
          <text x="38" y="86" textAnchor="end" className="text-[11px] font-black fill-white">{v.D}</text>
          <text x="122" y="75" textAnchor="end" className="text-[10px] font-black fill-amber-300">{v.O}</text>

          {diagram.sideLabel && (
            <text x="82" y="46" textAnchor="end" className="text-[10px] font-mono font-bold fill-emerald-300">
              {diagram.sideLabel}
            </text>
          )}
          {diagram.angleNote && (
            <text x="182" y="74" textAnchor="middle" className="text-[10px] font-mono font-bold fill-amber-300">
              {diagram.angleNote}
            </text>
          )}
        </svg>
      </div>
    );
  }

  // 4. Ισοσκελές Τραπέζιο ΑΒΓΔ (Ερ. 8, 11)
  if (diagram.type === 'isoTrapezoid') {
    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 270 160" className="w-full max-w-[270px] h-36 select-none">
          <polygon points="85,34 185,34 225,126 45,126" fill="rgba(99, 102, 241, 0.22)" stroke="#818cf8" strokeWidth="2.2" strokeLinejoin="round" />
          {/* Τικ ισότητας μη παράλληλων πλευρών */}
          <line x1="60" y1="77" x2="70" y2="82" stroke="#34d399" strokeWidth="2" />
          <line x1="210" y1="77" x2="200" y2="82" stroke="#34d399" strokeWidth="2" />

          <circle cx="85" cy="34" r="3.5" fill="#34d399" />
          <circle cx="185" cy="34" r="3.5" fill="#34d399" />
          <circle cx="225" cy="126" r="3.5" fill="#34d399" />
          <circle cx="45" cy="126" r="3.5" fill="#34d399" />

          <text x="82" y="22" textAnchor="middle" className="text-[11px] font-black fill-emerald-300">
            {diagram.angA ? `${v.A} (${diagram.angA}°)` : v.A}
          </text>
          <text x="188" y="22" textAnchor="middle" className="text-[11px] font-black fill-emerald-300">
            {diagram.angB ? `${v.B} (${diagram.angB}°)` : v.B}
          </text>
          <text x="230" y="143" textAnchor="middle" className="text-[11px] font-black fill-white">
            {diagram.angC ? `${v.C} (${diagram.angC}°)` : v.C}
          </text>
          <text x="40" y="143" textAnchor="middle" className="text-[11px] font-black fill-white">
            {diagram.angD ? `${v.D} (${diagram.angD}°)` : v.D}
          </text>
        </svg>
      </div>
    );
  }

  return null;
}

export default function TetrapleuraExercises() {
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
    pageTitle: isEl ? "Ασκήσεις: Τα Τετράπλευρα | Α' Γυμνασίου" : "Exercises: Quadrilaterals | Grade 7",
    pageDesc: isEl
      ? "Διαδραστικές ασκήσεις Α' Γυμνασίου στα τετράπλευρα: κανόνας 4-4-4-2, άθροισμα γωνιών 360°, παραλληλόγραμμο, ορθογώνιο, ρόμβος, τετράγωνο και τραπέζιο."
      : "Interactive Grade 7 geometry exercises on quadrilaterals: 4-4-4-2 rule, 360° angle sum, parallelogram, rectangle, rhombus, square, and trapezoid.",
    backNav: isEl ? "Θεωρία Κεφ. 08" : "Theory Ch. 08",
    theoryBtn: isEl ? "ΘΕΩΡΙΑ" : "THEORY",
    heroBadge: isEl ? "ΑΣΚΗΣΕΙΣ • ΚΕΦΑΛΑΙΟ 08 • Α' ΓΥΜΝΑΣΙΟΥ" : "EXERCISES • CHAPTER 08 • GRADE 7",
    heroTitle: isEl ? "Τα Τετράπλευρα: Εξάσκηση" : "Quadrilaterals: Practice",
    heroDesc: isEl
      ? "12 δυναμικές ερωτήσεις και προβλήματα στον κανόνα 4-4-4-2, στις γωνίες 360° και στις ιδιότητες παραλληλογράμμου, ορθογωνίου, ρόμβου, τετραγώνου και τραπεζίου."
      : "12 dynamic questions and problems on the 4-4-4-2 rule, 360° angle sum, and properties of parallelograms, rectangles, rhombuses, squares, and trapezoids.",
    btnNewSet: isEl ? "ΝΕΕΣ ΑΣΚΗΣΕΙΣ" : "NEW EXERCISES",
    btnTryNewSet: isEl ? "ΔΟΚΙΜΑΣΤΕ ΝΕΟ ΣΕΤ" : "TRY NEW SET",
    scoreLabel: isEl ? "Αποτέλεσμα" : "Score",
    scoreGreat: isEl
      ? "Εξαιρετική επίδοση! Κατέχετε πλήρως τον κανόνα 4-4-4-2 και τις ιδιότητες όλων των ειδών τετραπλεύρων."
      : "Outstanding performance! You have mastered the 4-4-4-2 rule and the properties of all types of quadrilaterals.",
    scoreGood: isEl
      ? "Πολύ καλή προσπάθεια! Μελετήστε τα αναλυτικά βήματα και τα σχήματα παρακάτω στα σημεία που δυσκολευτήκατε."
      : "Very good effort! Review the detailed steps and diagrams below for any questions you missed.",
    scoreNeedWork: isEl
      ? "Χρειάζεται λίγη επανάληψη ακόμα στις ιδιότητες των παραλληλογράμμων, ρόμβων, τετραγώνων και τραπεζίων!"
      : "Needs a bit more review on the properties of parallelograms, rhombuses, squares, and trapezoids!",
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

    // Q1: True / False - Κανόνας 4-4-4-2 & Άθροισμα γωνιών 360°
    const q1Variant = randInt(0, 1);
    const q1IsCorrect = Math.random() < 0.5;
    let q1Prompt = '';
    let q1Expl = '';

    if (q1Variant === 0) {
      q1Prompt = q1IsCorrect
        ? (isEl
            ? 'Σύμφωνα με τον κανόνα 4-4-4-2, κάθε κυρτό τετράπλευρο έχει 4 κορυφές, 4 πλευρές, 4 εσωτερικές γωνίες και 2 διαγωνίους.'
            : 'According to the 4-4-4-2 rule, every convex quadrilateral has 4 vertices, 4 sides, 4 interior angles, and 2 diagonals.')
        : (isEl
            ? 'Κάθε τετράπλευρο έχει 4 διαγωνίους και το άθροισμα των εσωτερικών του γωνιών είναι 180°.'
            : 'Every quadrilateral has 4 diagonals and the sum of its interior angles is 180°.');
      q1Expl = isEl
        ? 'Κάθε τετράπλευρο ακολουθεί τον κανόνα 4-4-4-2 (4 κορυφές, 4 πλευρές, 4 γωνίες, 2 διαγώνιοι) και το άθροισμα των 4 γωνιών του είναι 360°.'
        : 'Every quadrilateral follows the 4-4-4-2 rule (4 vertices, 4 sides, 4 angles, 2 diagonals) and its 4 interior angles sum to 360°.';
    } else {
      q1Prompt = q1IsCorrect
        ? (isEl
            ? 'Το άθροισμα των τεσσάρων εσωτερικών γωνιών κάθε κυρτού τετραπλεύρου ισούται πάντοτε με 360°.'
            : 'The sum of the four interior angles of any convex quadrilateral always equals 360°.')
        : (isEl
            ? 'Μπορεί να υπάρξει κυρτό τετράπλευρο που να έχει και τις τέσσερις γωνίες του αμβλείες (μεγαλύτερες από 90°).'
            : 'A convex quadrilateral can have all four interior angles obtuse (each greater than 90°).');
      q1Expl = isEl
        ? 'Αν και οι 4 γωνίες ήταν μεγαλύτερες από 90°, το άθροισμά τους θα ξεπερνούσε τις 4 · 90° ＝ 360°, κάτι που είναι αδύνατο.'
        : 'If all 4 angles were greater than 90°, their sum would exceed 4 · 90° ＝ 360°, which is impossible.';
    }

    qList.push({
      id: 1,
      title: isEl ? 'Κανόνας 4-4-4-2 & Άθροισμα Γωνιών' : '4-4-4-2 Rule & Angle Sum',
      prompt: q1Prompt,
      type: 'tf',
      correct: q1IsCorrect ? (isEl ? 'Σωστό' : 'True') : (isEl ? 'Λάθος' : 'False'),
      options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
      explanation: q1Expl
    });

    // Q2: Input - Υπολογισμός 4ης γωνίας τετραπλεύρου (360°) (+ SVG)
    const a2 = randInt(65, 115);
    const b2 = randInt(70, 110);
    const c2 = randInt(60, 105);
    const d2 = 360 - (a2 + b2 + c2);

    qList.push({
      id: 2,
      title: isEl ? 'Υπολογισμός 4ης Γωνίας Τετραπλεύρου' : 'Finding the 4th Angle of a Quadrilateral',
      prompt: isEl ? (
        <span>
          Σε κυρτό τετράπλευρο ΑΒΓΔ δίνονται <Angle>Α</Angle> ＝ {a2}°, <Angle>Β</Angle> ＝ {b2}° και <Angle>Γ</Angle> ＝ {c2}°. Πόσες μοίρες είναι η τέταρτη γωνία <Angle>Δ</Angle>;
        </span>
      ) : (
        <span>
          In convex quadrilateral ABCD, ∠A ＝ {a2}°, ∠B ＝ {b2}°, and ∠C ＝ {c2}°. How many degrees is the fourth angle ∠D?
        </span>
      ),
      type: 'input',
      correct: d2,
      unit: '°',
      diagram: { type: 'quad', angA: a2, angB: b2, angC: c2, angD: d2 },
      explanation: isEl ? (
        <span>
          Το άθροισμα των 4 γωνιών είναι 360°: <Angle>Δ</Angle> ＝ 360° － ({a2}° ＋ {b2}° ＋ {c2}°) ＝ 360° － {a2 + b2 + c2}° ＝ {d2}°.
        </span>
      ) : (
        <span>
          The 4 angles sum to 360°: ∠D ＝ 360° － ({a2}° ＋ {b2}° ＋ {c2}°) ＝ 360° － {a2 + b2 + c2}° ＝ {d2}°.
        </span>
      )
    });

    // Q3: Input - Γωνίες Παραλληλογράμμου (απέναντι & διαδοχικές) (+ SVG)
    const angA3 = randInt(52, 128);
    const angB3 = 180 - angA3;
    const askOpposite3 = Math.random() < 0.5; // true: ζητά Γ (απέναντι), false: ζητά Β (διαδοχική)

    qList.push({
      id: 3,
      title: isEl ? 'Γωνίες Παραλληλογράμμου' : 'Angles of a Parallelogram',
      prompt: askOpposite3
        ? (isEl ? (
            <span>
              Σε ένα παραλληλόγραμμο ΑΒΓΔ, η γωνία <Angle>Α</Angle> είναι {angA3}°. Πόσες μοίρες είναι η απέναντι γωνία <Angle>Γ</Angle>;
            </span>
          ) : (
            <span>
              In parallelogram ABCD, angle ∠A measures {angA3}°. How many degrees is the opposite angle ∠C?
            </span>
          ))
        : (isEl ? (
            <span>
              Σε ένα παραλληλόγραμμο ΑΒΓΔ, η γωνία <Angle>Α</Angle> είναι {angA3}°. Πόσες μοίρες είναι η διαδοχική γωνία <Angle>Β</Angle>;
            </span>
          ) : (
            <span>
              In parallelogram ABCD, angle ∠A measures {angA3}°. How many degrees is the consecutive angle ∠B?
            </span>
          )),
      type: 'input',
      correct: askOpposite3 ? angA3 : angB3,
      unit: '°',
      diagram: { type: 'parallelogram', angA: angA3, angB: angB3, angC: angA3, angD: angB3, showDiags: false },
      explanation: askOpposite3 ? (
        isEl ? (
          <span>
            Σε κάθε παραλληλόγραμμο οι απέναντι γωνίες είναι ίσες, άρα <Angle>Γ</Angle> ＝ <Angle>Α</Angle> ＝ {angA3}°.
          </span>
        ) : (
          <span>
            In every parallelogram opposite angles are equal, so ∠C ＝ ∠A ＝ {angA3}°.
          </span>
        )
      ) : isEl ? (
        <span>
          Σε κάθε παραλληλόγραμμο δύο διαδοχικές γωνίες είναι παραπληρωματικές (<Angle>Α</Angle> ＋ <Angle>Β</Angle> ＝ 180°). Άρα <Angle>Β</Angle> ＝ 180° － {angA3}° ＝ {angB3}°.
        </span>
      ) : (
        <span>
          In every parallelogram consecutive angles are supplementary (∠A ＋ ∠B ＝ 180°). Thus ∠B ＝ 180° － {angA3}° ＝ {angB3}°.
        </span>
      )
    });

    // Q4: MCQ - Αναγνώριση είδους τετραπλεύρου από ορισμό / ιδιότητα
    const defPool4 = isEl
      ? [
          {
            q: 'Πώς ονομάζεται το παραλληλόγραμμο που έχει και τις τέσσερις πλευρές του ίσες;',
            c: 'Ρόμβος',
            e: 'Ρόμβος είναι το παραλληλόγραμμο που έχει και τις 4 πλευρές του ίσες.'
          },
          {
            q: 'Πώς ονομάζεται το παραλληλόγραμμο που έχει και τις τέσσερις γωνίες του ορθές (90°);',
            c: 'Ορθογώνιο',
            e: 'Ορθογώνιο είναι το παραλληλόγραμμο που έχει και τις 4 γωνίες του ορθές (90°).'
          },
          {
            q: 'Ποιο τετράπλευρο είναι ταυτόχρονα ορθογώνιο και ρόμβος (έχει 4 ίσες πλευρές και 4 ορθές γωνίες);',
            c: 'Τετράγωνο',
            e: 'Το τετράγωνο έχει 4 ίσες πλευρές και 4 ορθές γωνίες, άρα είναι ταυτόχρονα ορθογώνιο και ρόμβος.'
          },
          {
            q: 'Πώς ονομάζεται το τετράπλευρο που έχει μόνο δύο απέναντι πλευρές παράλληλες;',
            c: 'Τραπέζιο',
            e: 'Τραπέζιο είναι το τετράπλευρο με ακριβώς ένα ζεύγος παράλληλων πλευρών (τις βάσεις).'
          }
        ]
      : [
          {
            q: 'What is a parallelogram with all four sides equal in length called?',
            c: 'Rhombus',
            e: 'A rhombus is a parallelogram with all 4 sides equal.'
          },
          {
            q: 'What is a parallelogram with all four angles equal to 90° called?',
            c: 'Rectangle',
            e: 'A rectangle is a parallelogram with all 4 right angles (90°).'
          },
          {
            q: 'Which quadrilateral is simultaneously a rectangle and a rhombus (4 equal sides and 4 right angles)?',
            c: 'Square',
            e: 'A square has 4 equal sides and 4 right angles, making it both a rectangle and a rhombus.'
          },
          {
            q: 'What is a quadrilateral with only one pair of parallel opposite sides called?',
            c: 'Trapezoid',
            e: 'A trapezoid is a quadrilateral with exactly one pair of parallel sides (the bases).'
          }
        ];

    const pickedDef4 = pickRandom(defPool4);
    const dist4 = isEl
      ? ['Ρόμβος', 'Ορθογώνιο', 'Τετράγωνο', 'Τραπέζιο', 'Σκαληνό τετράπλευρο']
      : ['Rhombus', 'Rectangle', 'Square', 'Trapezoid', 'Scalene quadrilateral'];

    qList.push({
      id: 4,
      title: isEl ? 'Είδη Τετραπλεύρων' : 'Types of Quadrilaterals',
      prompt: pickedDef4.q,
      type: 'mcq',
      correct: pickedDef4.c,
      options: ensureFourUniqueOptions(pickedDef4.c, () => pickRandom(dist4)),
      explanation: pickedDef4.e
    });

    // Q5: True / False - Ιεραρχία & Σχέσεις Τετραπλεύρων
    const hierPool5 = isEl
      ? [
          {
            p: 'Κάθε τετράγωνο είναι ρόμβος, αλλά δεν είναι κάθε ρόμβος τετράγωνο.',
            t: true,
            e: 'Το τετράγωνο έχει 4 ίσες πλευρές (άρα είναι ρόμβος) και επιπλέον 4 ορθές γωνίες. Ένας ρόμβος χωρίς ορθές γωνίες δεν είναι τετράγωνο.'
          },
          {
            p: 'Κάθε παραλληλόγραμμο είναι ορθογώνιο.',
            t: false,
            e: 'Ένα παραλληλόγραμμο έχει ίσες απέναντι γωνίες, αλλά δεν είναι υποχρεωτικά ορθές (90°).'
          },
          {
            p: 'Οι διαγώνιοι κάθε παραλληλογράμμου διχοτομούνται (τέμνονται στο μέσο τους).',
            t: true,
            e: 'Βασική ιδιότητα κάθε παραλληλογράμμου είναι ότι οι διαγώνιοί του τέμνονται στο μέσο τους.'
          },
          {
            p: 'Σε κάθε τραπέζιο οι διαγώνιοι διχοτομούνται και οι απέναντι πλευρές είναι ίσες.',
            t: false,
            e: 'Αυτές οι ιδιότητες ισχύουν στα παραλληλόγραμμα, όχι στα τραπέζια (που έχουν μόνο δύο παράλληλες πλευρές).'
          }
        ]
      : [
          {
            p: 'Every square is a rhombus, but not every rhombus is a square.',
            t: true,
            e: 'A square has 4 equal sides (so it is a rhombus) plus 4 right angles. A rhombus without right angles is not a square.'
          },
          {
            p: 'Every parallelogram is a rectangle.',
            t: false,
            e: 'A parallelogram has equal opposite angles, which are not necessarily 90° right angles.'
          },
          {
            p: 'The diagonals of every parallelogram bisect each other.',
            t: true,
            e: 'A core property of every parallelogram is that its diagonals intersect at their midpoints.'
          },
          {
            p: 'In every trapezoid, the diagonals bisect each other and opposite sides are equal.',
            t: false,
            e: 'Those properties hold for parallelograms, not trapezoids (which only have one pair of parallel sides).'
          }
        ];

    const pickedHier5 = pickRandom(hierPool5);
    qList.push({
      id: 5,
      title: isEl ? 'Ιδιότητες & Σχέσεις Τετραπλεύρων' : 'Properties & Hierarchy of Quadrilaterals',
      prompt: pickedHier5.p,
      type: 'tf',
      correct: pickedHier5.t ? (isEl ? 'Σωστό' : 'True') : (isEl ? 'Λάθος' : 'False'),
      options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
      explanation: pickedHier5.e
    });

    // Q6: MCQ - Ιδιότητες Διαγωνίων (Ορθογώνιο / Ρόμβος / Τετράγωνο)
    const diagPool6 = isEl
      ? [
          {
            q: 'Ποια ιδιότητα έχουν οι διαγώνιοι ενός ρόμβου (εκτός από το ότι διχοτομούνται);',
            c: 'Είναι κάθετες μεταξύ τους (90°) και διχοτομούν τις γωνίες του',
            e: 'Οι διαγώνιοι του ρόμβου είναι κάθετες (ΑΓ ⊥ ΒΔ), διχοτομούνται και διχοτομούν τις γωνίες του.'
          },
          {
            q: 'Ποια επιπλέον ιδιότητα έχουν οι διαγώνιοι ενός ορθογωνίου σε σχέση με ένα απλό παραλληλόγραμμο;',
            c: 'Έχουν ίσο μήκος (ΑΓ ＝ ΒΔ)',
            e: 'Στο ορθογώνιο οι διαγώνιοι είναι ίσες μεταξύ τους (ΑΓ ＝ ΒΔ) και διχοτομούνται.'
          },
          {
            q: 'Πόσες μοίρες είναι η γωνία που σχηματίζει η διαγώνιος ενός τετραγώνου με καθεμία από τις πλευρές του;',
            c: '45°',
            e: 'Οι διαγώνιοι του τετραγώνου διχοτομούν τις ορθές γωνίες (90° ÷ 2 ＝ 45°).'
          }
        ]
      : [
          {
            q: 'What property do the diagonals of a rhombus have (besides bisecting each other)?',
            c: 'They are perpendicular (90°) and bisect the interior angles',
            e: 'The diagonals of a rhombus are perpendicular (AC ⊥ BD), bisect each other, and bisect the interior angles.'
          },
          {
            q: 'What additional property do the diagonals of a rectangle have compared to a general parallelogram?',
            c: 'They are equal in length (AC ＝ BD)',
            e: 'In a rectangle, the diagonals are equal in length (AC ＝ BD) and bisect each other.'
          },
          {
            q: 'How many degrees is the angle formed by a diagonal of a square and each of its sides?',
            c: '45°',
            e: 'The diagonals of a square bisect its 90° right angles (90° ÷ 2 ＝ 45°).'
          }
        ];

    const pickedDiag6 = pickRandom(diagPool6);
    const dist6 = isEl
      ? [
          'Είναι κάθετες μεταξύ τους (90°) και διχοτομούν τις γωνίες του',
          'Έχουν ίσο μήκος (ΑΓ ＝ ΒΔ)',
          '45°',
          'Είναι παράλληλες μεταξύ τους',
          'Έχουν άθροισμα ίσο με την περίμετρο'
        ]
      : [
          'They are perpendicular (90°) and bisect the interior angles',
          'They are equal in length (AC ＝ BD)',
          '45°',
          'They are parallel to each other',
          'Their sum equals the perimeter'
        ];

    qList.push({
      id: 6,
      title: isEl ? 'Διαγώνιοι Ειδικών Παραλληλογράμμων' : 'Diagonals of Special Parallelograms',
      prompt: pickedDiag6.q,
      type: 'mcq',
      correct: pickedDiag6.c,
      options: ensureFourUniqueOptions(pickedDiag6.c, () => pickRandom(dist6)),
      explanation: pickedDiag6.e
    });

    // Q7: Input - Περίμετρος & Πλευρά Ρόμβου / Τετραγώνου (+ SVG)
    const side7 = randInt(6, 18);
    const perim7 = 4 * side7;
    const askSide7 = Math.random() < 0.5;

    qList.push({
      id: 7,
      title: isEl ? 'Περίμετρος & Πλευρά Ρόμβου' : 'Perimeter & Side of a Rhombus',
      prompt: askSide7
        ? (isEl
            ? `Ένας ρόμβος ΑΒΓΔ έχει περίμετρο Π ＝ ${perim7} cm. Πόσα εκατοστά (cm) είναι το μήκος κάθε πλευράς του;`
            : `A rhombus ABCD has perimeter P ＝ ${perim7} cm. What is the length of each side in cm?`)
        : (isEl
            ? `Ένας ρόμβος ΑΒΓΔ έχει πλευρά μήκους ${side7} cm. Πόσα εκατοστά (cm) είναι η περίμετρός του;`
            : `A rhombus ABCD has side length ${side7} cm. What is its perimeter in cm?`),
      type: 'input',
      correct: askSide7 ? side7 : perim7,
      unit: 'cm',
      diagram: { type: 'rhombus', sideLabel: `${side7} cm` },
      explanation: askSide7 ? (
        <span className="inline-flex flex-wrap items-center gap-1.5">
          <span>{isEl ? 'Ο ρόμβος έχει 4 ίσες πλευρές, άρα:' : 'A rhombus has 4 equal sides, so:'}</span>
          <span className="inline-flex items-center font-mono">
            <Frac num={perim7} den="4" /> ＝ {side7} cm.
          </span>
        </span>
      ) : (
        <span className="font-mono">
          {isEl ? `Π ＝ 4 · ${side7} ＝ ${perim7} cm.` : `P ＝ 4 · ${side7} ＝ ${perim7} cm.`}
        </span>
      )
    });

    // Q8: Input - Ισοσκελές Τραπέζιο: Υπολογισμός γωνίας (+ SVG)
    const baseAng8 = randInt(52, 78);
    const topAng8 = 180 - baseAng8;

    qList.push({
      id: 8,
      title: isEl ? 'Γωνίες Ισοσκελούς Τραπεζίου' : 'Angles of an Isosceles Trapezoid',
      prompt: isEl ? (
        <span>
          Σε ισοσκελές τραπέζιο ΑΒΓΔ (ΑΒ ∥ ΔΓ και ΑΔ ＝ ΒΓ), η γωνία <Angle>Δ</Angle> της κάτω βάσης είναι {baseAng8}°. Πόσες μοίρες είναι η γωνία <Angle>Β</Angle> της πάνω βάσης;
        </span>
      ) : (
        <span>
          In isosceles trapezoid ABCD (AB ∥ DC and AD ＝ BC), bottom base angle ∠D measures {baseAng8}°. How many degrees is top base angle ∠B?
        </span>
      ),
      type: 'input',
      correct: topAng8,
      unit: '°',
      diagram: { type: 'isoTrapezoid', angA: topAng8, angB: topAng8, angC: baseAng8, angD: baseAng8 },
      explanation: isEl ? (
        <span>
          Στο ισοσκελές τραπέζιο οι γωνίες της κάτω βάσης είναι ίσες (<Angle>Γ</Angle> ＝ <Angle>Δ</Angle> ＝ {baseAng8}°), ενώ <Angle>Β</Angle> ＋ <Angle>Γ</Angle> ＝ 180°. Άρα <Angle>Β</Angle> ＝ 180° － {baseAng8}° ＝ {topAng8}°.
        </span>
      ) : (
        <span>
          In an isosceles trapezoid the bottom base angles are equal (∠C ＝ ∠D ＝ {baseAng8}°), and ∠B ＋ ∠C ＝ 180°. Thus ∠B ＝ 180° － {baseAng8}° ＝ {topAng8}°.
        </span>
      )
    });

    // Q9: Input + tableData + SVG - Παραλληλόγραμμο: Υπολογισμός πλευρών από περίμετρο & σχέση πλευρών
    const smallSide9 = randInt(5, 11);
    const mult9 = randInt(2, 3);
    const largeSide9 = mult9 * smallSide9;
    const perim9 = 2 * (smallSide9 + largeSide9);
    const multWord9El = mult9 === 2 ? 'διπλάσια' : 'τριπλάσια';
    const multWord9En = mult9 === 2 ? 'twice' : 'three times';

    qList.push({
      id: 9,
      title: isEl ? 'Περίμετρος & Πλευρές Παραλληλογράμμου' : 'Perimeter & Sides of a Parallelogram',
      prompt: isEl
        ? `Ένα παραλληλόγραμμο ΑΒΓΔ έχει περίμετρο Π ＝ ${perim9} cm. Αν η μεγάλη πλευρά ΑΒ είναι ${multWord9El} από τη μικρή πλευρά ΒΓ, πόσα εκατοστά (cm) είναι το μήκος της ΑΒ;`
        : `A parallelogram ABCD has perimeter P ＝ ${perim9} cm. If the longer side AB is ${multWord9En} the shorter side BC, what is the length of AB in cm?`,
      type: 'input',
      correct: largeSide9,
      unit: 'cm',
      diagram: { type: 'parallelogram', sideTop: `${largeSide9} cm`, sideRight: `${smallSide9} cm`, showDiags: false },
      tableData: [
        {
          label: isEl ? '1. Ημιπερίμετρος (ΑΒ ＋ ΒΓ)' : '1. Semi-perimeter (AB ＋ BC)',
          details: (
            <span className="inline-flex items-center gap-1">
              ΑΒ ＋ ΒΓ ＝ <Frac num={perim9} den="2" /> ＝ {smallSide9 + largeSide9} cm
            </span>
          )
        },
        {
          label: isEl ? '2. Μικρή πλευρά ΒΓ' : '2. Shorter side BC',
          details: (
            <span className="inline-flex items-center gap-1">
              1 ＋ {mult9} ＝ {mult9 + 1} μέρη ⇒ ΒΓ ＝ <Frac num={smallSide9 + largeSide9} den={mult9 + 1} /> ＝ {smallSide9} cm
            </span>
          )
        },
        {
          label: isEl ? '3. Μεγάλη πλευρά ΑΒ' : '3. Longer side AB',
          details: `ΑΒ ＝ ${mult9} · ${smallSide9} ＝ ${largeSide9} cm`
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed break-words [overflow-wrap:anywhere]">
          <span>
            {isEl
              ? `Το άθροισμα δύο διαδοχικών πλευρών είναι ${perim9} ÷ 2 ＝ ${smallSide9 + largeSide9} cm, το οποίο χωρίζεται σε ${mult9 + 1} ίσα μέρη:`
              : `The sum of two consecutive sides is ${perim9} ÷ 2 ＝ ${smallSide9 + largeSide9} cm, divided into ${mult9 + 1} equal parts:`}
          </span>
          <span className="inline-flex items-center gap-1 font-mono">
            ΒΓ ＝ <Frac num={smallSide9 + largeSide9} den={mult9 + 1} /> ＝ {smallSide9} cm ⇒ ΑΒ ＝ {mult9} · {smallSide9} ＝ {largeSide9} cm.
          </span>
        </span>
      )
    });

    // Q10: Input + tableData + SVG - Ρόμβος: Διαγώνιοι & Γωνίες
    const halfAngB10 = randInt(22, 38);
    const fullAngB10 = 2 * halfAngB10;
    const angA10 = 180 - fullAngB10;

    qList.push({
      id: 10,
      title: isEl ? 'Διαγώνιοι & Γωνίες Ρόμβου' : 'Diagonals & Angles of a Rhombus',
      prompt: isEl ? (
        <span>
          Σε ρόμβο ΑΒΓΔ οι διαγώνιοι ΑΓ και ΒΔ τέμνονται στο Ο. Αν η γωνία Α<Angle>Β</Angle>Ο είναι {halfAngB10}°, πόσες μοίρες είναι η γωνία <Angle>Α</Angle> του ρόμβου;
        </span>
      ) : (
        <span>
          In rhombus ABCD, diagonals AC and BD intersect at O. If angle ∠ABO measures {halfAngB10}°, how many degrees is angle ∠A of the rhombus?
        </span>
      ),
      type: 'input',
      correct: angA10,
      unit: '°',
      diagram: {
        type: 'rhombus',
        angleNote: `∠ABO = ${halfAngB10}°`
      },
      tableData: [
        {
          label: isEl ? '1. Γωνία Β του ρόμβου' : '1. Rhombus angle ∠B',
          details: isEl ? (
            <span>
              Η διαγώνιος ΒΔ διχοτομεί τη γωνία <Angle>Β</Angle> ⇒ <Angle>Β</Angle> ＝ 2 · {halfAngB10}° ＝ {fullAngB10}°
            </span>
          ) : (
            `Diagonal BD bisects ∠B ⇒ ∠B ＝ 2 · ${halfAngB10}° ＝ ${fullAngB10}°`
          )
        },
        {
          label: isEl ? '2. Διαδοχική γωνία Α' : '2. Consecutive angle ∠A',
          details: isEl ? (
            <span>
              <Angle>Α</Angle> ＋ <Angle>Β</Angle> ＝ 180° ⇒ <Angle>Α</Angle> ＝ 180° － {fullAngB10}° ＝ {angA10}°
            </span>
          ) : (
            `∠A ＋ ∠B ＝ 180° ⇒ ∠A ＝ 180° － ${fullAngB10}° ＝ ${angA10}°`
          )
        }
      ],
      explanation: isEl ? (
        <span>
          Επειδή οι διαγώνιοι του ρόμβου διχοτομούν τις γωνίες του, έχουμε <Angle>Β</Angle> ＝ 2 · {halfAngB10}° ＝ {fullAngB10}°. Αφού οι διαδοχικές γωνίες είναι παραπληρωματικές, <Angle>Α</Angle> ＝ 180° － {fullAngB10}° ＝ {angA10}°.
        </span>
      ) : (
        <span>
          Since rhombus diagonals bisect its angles, ∠B ＝ 2 · {halfAngB10}° ＝ {fullAngB10}°. Because consecutive angles are supplementary, ∠A ＝ 180° － {fullAngB10}° ＝ {angA10}°.
        </span>
      )
    });

    // Q11: MCQ + tableData + SVG - Ισοσκελές Τραπέζιο & Περίμετρος
    const topBase11 = randInt(6, 12);
    const botBase11 = topBase11 + randInt(4, 10);
    const leg11 = randInt(5, 11);
    const perim11 = topBase11 + botBase11 + 2 * leg11;
    const baseAng11 = randInt(56, 74);
    const topAng11 = 180 - baseAng11;

    const q11Correct = isEl
      ? `Γωνία Α ＝ ${topAng11}° και περίμετρος ${perim11} cm`
      : `Angle ∠A ＝ ${topAng11}° and perimeter ${perim11} cm`;

    const q11Distractors = isEl
      ? [
          `Γωνία Α ＝ ${topAng11}° και περίμετρος ${perim11} cm`,
          `Γωνία Α ＝ ${baseAng11}° και περίμετρος ${perim11} cm`,
          `Γωνία Α ＝ ${topAng11}° και περίμετρος ${topBase11 + botBase11 + leg11} cm`,
          `Γωνία Α ＝ ${topAng11 + 10}° και περίμετρος ${perim11 + 2} cm`,
          `Γωνία Α ＝ 90° και περίμετρος ${perim11} cm`
        ]
      : [
          `Angle ∠A ＝ ${topAng11}° and perimeter ${perim11} cm`,
          `Angle ∠A ＝ ${baseAng11}° and perimeter ${perim11} cm`,
          `Angle ∠A ＝ ${topAng11}° and perimeter ${topBase11 + botBase11 + leg11} cm`,
          `Angle ∠A ＝ ${topAng11 + 10}° and perimeter ${perim11 + 2} cm`,
          `Angle ∠A ＝ 90° and perimeter ${perim11} cm`
        ];

    qList.push({
      id: 11,
      title: isEl ? 'Πλήρης Ανάλυση Ισοσκελούς Τραπεζίου' : 'Full Analysis of an Isosceles Trapezoid',
      prompt: isEl ? (
        <span>
          Ένα ισοσκελές τραπέζιο ΑΒΓΔ (ΑΒ ∥ ΔΓ και ΑΔ ＝ ΒΓ) έχει βάσεις ΑΒ ＝ {topBase11} cm, ΔΓ ＝ {botBase11} cm, μη παράλληλη πλευρά ΑΔ ＝ {leg11} cm και γωνία <Angle>Δ</Angle> ＝ {baseAng11}°. Πόση είναι η γωνία <Angle>Α</Angle> και πόση η περίμετρος του τραπεζίου;
        </span>
      ) : (
        <span>
          An isosceles trapezoid ABCD (AB ∥ DC and AD ＝ BC) has bases AB ＝ {topBase11} cm, DC ＝ {botBase11} cm, leg AD ＝ {leg11} cm, and angle ∠D ＝ {baseAng11}°. Find angle ∠A and the perimeter of the trapezoid.
        </span>
      ),
      type: 'mcq',
      correct: q11Correct,
      options: ensureFourUniqueOptions(q11Correct, () => pickRandom(q11Distractors)),
      diagram: { type: 'isoTrapezoid', angA: topAng11, angB: topAng11, angC: baseAng11, angD: baseAng11 },
      tableData: [
        {
          label: isEl ? '1. Γωνία Α (ΑΒ ∥ ΔΓ)' : '1. Angle ∠A (AB ∥ DC)',
          details: isEl ? (
            <span>
              <Angle>Α</Angle> ＋ <Angle>Δ</Angle> ＝ 180° ⇒ <Angle>Α</Angle> ＝ 180° － {baseAng11}° ＝ {topAng11}°
            </span>
          ) : (
            `∠A ＋ ∠D ＝ 180° ⇒ ∠A ＝ 180° － ${baseAng11}° ＝ ${topAng11}°`
          )
        },
        {
          label: isEl ? '2. Μη παράλληλες πλευρές' : '2. Equal non-parallel legs',
          details: `ΒΓ ＝ ΑΔ ＝ ${leg11} cm`
        },
        {
          label: isEl ? '3. Περίμετρος τραπεζίου' : '3. Trapezoid perimeter',
          details: `Π ＝ ${topBase11} ＋ ${botBase11} ＋ ${leg11} ＋ ${leg11} ＝ ${perim11} cm`
        }
      ],
      explanation: isEl ? (
        <span>
          Οι προσκείμενες γωνίες στη μη παράλληλη πλευρά ΑΔ είναι παραπληρωματικές (<Angle>Α</Angle> ＝ 180° － {baseAng11}° ＝ {topAng11}°). Επειδή ΑΔ ＝ ΒΓ ＝ {leg11} cm, η περίμετρος είναι {topBase11} ＋ {botBase11} ＋ 2 · {leg11} ＝ {perim11} cm.
        </span>
      ) : (
        <span>
          Angles adjacent to leg AD are supplementary (∠A ＝ 180° － {baseAng11}° ＝ {topAng11}°). Since AD ＝ BC ＝ {leg11} cm, the perimeter is {topBase11} ＋ {botBase11} ＋ 2 · {leg11} ＝ {perim11} cm.
        </span>
      )
    });

    // Q12: Input + tableData + SVG - Παραλληλόγραμμο & Διχοτόμηση Διαγωνίων
    const halfAC12 = randInt(4, 9);
    const halfBD12 = randInt(5, 11);
    const sumDiags12 = 2 * halfAC12 + 2 * halfBD12;

    qList.push({
      id: 12,
      title: isEl ? 'Διαγώνιοι Παραλληλογράμμου (Διχοτόμηση)' : 'Parallelogram Diagonals (Bisection)',
      prompt: isEl ? (
        <span>
          Σε ένα παραλληλόγραμμο ΑΒΓΔ οι διαγώνιοί του ΑΓ και ΒΔ τέμνονται στο σημείο Ο. Αν γνωρίζουμε ότι ΟΑ ＝ {halfAC12} cm και ΟΒ ＝ {halfBD12} cm, πόσα εκατοστά (cm) είναι το άθροισμα των μηκών των δύο διαγωνίων ΑΓ ＋ ΒΔ;
        </span>
      ) : (
        <span>
          In parallelogram ABCD, diagonals AC and BD intersect at point O. Given that OA ＝ {halfAC12} cm and OB ＝ {halfBD12} cm, what is the sum of the lengths of both diagonals AC ＋ BD in cm?
        </span>
      ),
      type: 'input',
      correct: sumDiags12,
      unit: 'cm',
      diagram: { type: 'parallelogram', showDiags: true },
      tableData: [
        {
          label: isEl ? '1. Ιδιότητα διαγωνίων' : '1. Diagonal bisection property',
          details: isEl
            ? 'Οι διαγώνιοι του παραλληλογράμμου τέμνονται στο μέσο τους (ΟΑ ＝ ΟΓ και ΟΒ ＝ ΟΔ)'
            : 'Parallelogram diagonals bisect each other (OA ＝ OC and OB ＝ OD)'
        },
        {
          label: isEl ? '2. Μήκη διαγωνίων ΑΓ και ΒΔ' : '2. Lengths of AC and BD',
          details: `ΑΓ ＝ 2 · ${halfAC12} ＝ ${2 * halfAC12} cm, ΒΔ ＝ 2 · ${halfBD12} ＝ ${2 * halfBD12} cm`
        },
        {
          label: isEl ? '3. Άθροισμα ΑΓ ＋ ΒΔ' : '3. Sum AC ＋ BD',
          details: `${2 * halfAC12} ＋ ${2 * halfBD12} ＝ ${sumDiags12} cm`
        }
      ],
      explanation: isEl
        ? `Επειδή οι διαγώνιοι διχοτομούνται στο Ο, έχουμε ΑΓ ＝ 2 · ${halfAC12} ＝ ${2 * halfAC12} cm και ΒΔ ＝ 2 · ${halfBD12} ＝ ${2 * halfBD12} cm. Άρα ΑΓ ＋ ΒΔ ＝ ${2 * halfAC12} ＋ ${2 * halfBD12} ＝ ${sumDiags12} cm.`
        : `Since the diagonals bisect each other at O, AC ＝ 2 · ${halfAC12} ＝ ${2 * halfAC12} cm and BD ＝ 2 · ${halfBD12} ＝ ${2 * halfBD12} cm. Thus AC ＋ BD ＝ ${2 * halfAC12} ＋ ${2 * halfBD12} ＝ ${sumDiags12} cm.`
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
      backUrl="/a-gymnasiou/44-tetrapleura"
      backText={t.backNav}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/44-tetrapleura"
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
                      <div className="p-3 sm:p-4 bg-slate-100/70 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-slate-800 leading-relaxed">
                        <div className="font-bold text-slate-900 mb-1 flex flex-wrap items-center gap-1.5">
                          <span>{t.correctAnswerTitle}</span>
                          <span className="font-mono text-emerald-700 font-bold inline-flex items-center whitespace-nowrap gap-1">
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