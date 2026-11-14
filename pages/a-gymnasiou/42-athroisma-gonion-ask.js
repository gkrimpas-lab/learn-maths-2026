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
  const v = isEl ? { A: 'Α', B: 'Β', C: 'Γ', H: 'Υ' } : { A: 'A', B: 'B', C: 'C', H: 'H' };

  // 1. Γενικό τρίγωνο ΑΒΓ (Ερ. 2)
  if (diagram.type === 'general') {
    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 260 155" className="w-full max-w-[260px] h-36 select-none">
          <polygon points="118,24 38,125 222,125" fill="rgba(99, 102, 241, 0.22)" stroke="#818cf8" strokeWidth="2.2" strokeLinejoin="round" />
          <circle cx="118" cy="24" r="3.5" fill="#34d399" />
          <circle cx="38" cy="125" r="3.5" fill="#34d399" />
          <circle cx="222" cy="125" r="3.5" fill="#34d399" />
          <text x="118" y="15" textAnchor="middle" className="text-[11px] font-black fill-white">
            {v.A} ({diagram.angA}°)
          </text>
          <text x="38" y="143" textAnchor="middle" className="text-[11px] font-black fill-white">
            {v.B} ({diagram.angB}°)
          </text>
          <text x="222" y="143" textAnchor="middle" className="text-[11px] font-black fill-emerald-300">
            {v.C} ({diagram.angC}°)
          </text>
        </svg>
      </div>
    );
  }

  // 2. Ορθογώνιο τρίγωνο ΑΒΓ με Α = 90° (Ερ. 3 & 11)
  if (diagram.type === 'right') {
    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 260 155" className="w-full max-w-[260px] h-36 select-none">
          <polygon points="56,28 56,125 215,125" fill="rgba(99, 102, 241, 0.22)" stroke="#818cf8" strokeWidth="2.2" strokeLinejoin="round" />
          {/* Σύμβολο ορθής γωνίας στην Α */}
          <polyline points="56,113 68,113 68,125" fill="none" stroke="#34d399" strokeWidth="1.8" />
          <circle cx="56" cy="125" r="3.5" fill="#34d399" />
          <circle cx="56" cy="28" r="3.5" fill="#34d399" />
          <circle cx="215" cy="125" r="3.5" fill="#34d399" />
          <text x="56" y="143" textAnchor="middle" className="text-[11px] font-black fill-white">
            {v.A} (90°)
          </text>
          <text x="56" y="18" textAnchor="middle" className="text-[11px] font-black fill-sky-300">
            {v.B} ({diagram.labelB})
          </text>
          <text x="215" y="143" textAnchor="middle" className="text-[11px] font-black fill-emerald-300">
            {v.C} ({diagram.labelC})
          </text>
        </svg>
      </div>
    );
  }

  // 3. Ισοσκελές τρίγωνο ΑΒΓ με ΑΒ = ΑΓ (Ερ. 7, 8, 9, 10)
  if (diagram.type === 'isosceles') {
    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 270 165" className="w-full max-w-[270px] h-38 select-none">
          <polygon points="135,24 52,126 218,126" fill="rgba(99, 102, 241, 0.22)" stroke="#818cf8" strokeWidth="2.2" strokeLinejoin="round" />
          {/* Τικ ισότητας σκελών ΑΒ και ΑΓ */}
          <line x1="88" y1="72" x2="98" y2="79" stroke="#34d399" strokeWidth="2" />
          <line x1="182" y1="72" x2="172" y2="79" stroke="#34d399" strokeWidth="2" />

          {/* Αν έχει ύψος ΑΥ (Ερ. 9 & 10) */}
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

          {/* Κορυφές */}
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

          {/* Ετικέτες πλευρών / τμημάτων αν υπάρχουν (Ερ. 10) */}
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
          {diagram.subAngleLabel && (
            <text x="122" y="54" textAnchor="end" className="text-[10px] font-mono font-bold fill-amber-300">
              {diagram.subAngleLabel}
            </text>
          )}
        </svg>
      </div>
    );
  }

  // 4. Ισόπλευρο τρίγωνο ΑΒΓ με ύψος-μεσοκάθετο ΑΥ (Ερ. 12)
  if (diagram.type === 'equilateral') {
    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 270 165" className="w-full max-w-[270px] h-38 select-none">
          <polygon points="135,22 65,126 205,126" fill="rgba(99, 102, 241, 0.22)" stroke="#818cf8" strokeWidth="2.2" strokeLinejoin="round" />
          {/* Ύψος-Μεσοκάθετος-Διάμεσος ΑΥ */}
          <line x1="135" y1="22" x2="135" y2="126" stroke="#34d399" strokeWidth="2" strokeDasharray="4 3" />
          <polyline points="135,115 146,115 146,126" fill="none" stroke="#34d399" strokeWidth="1.8" />
          {/* Τικ ισότητας πλευρών */}
          <line x1="95" y1="71" x2="104" y2="77" stroke="#818cf8" strokeWidth="2" />
          <line x1="175" y1="71" x2="166" y2="77" stroke="#818cf8" strokeWidth="2" />
          {/* Τικ ισότητας ΒΥ = ΥΓ */}
          <line x1="100" y1="121" x2="100" y2="131" stroke="#34d399" strokeWidth="2" />
          <line x1="170" y1="121" x2="170" y2="131" stroke="#34d399" strokeWidth="2" />

          <circle cx="135" cy="22" r="3.5" fill="#34d399" />
          <circle cx="65" cy="126" r="3.5" fill="#34d399" />
          <circle cx="205" cy="126" r="3.5" fill="#34d399" />
          <circle cx="135" cy="126" r="3.5" fill="#34d399" />

          <text x="135" y="14" textAnchor="middle" className="text-[11px] font-black fill-white">{v.A}</text>
          <text x="55" y="138" textAnchor="middle" className="text-[11px] font-black fill-white">{v.B}</text>
          <text x="215" y="138" textAnchor="middle" className="text-[11px] font-black fill-white">{v.C}</text>
          <text x="135" y="141" textAnchor="middle" className="text-[11px] font-bold fill-emerald-300">{v.H}</text>

          {/* Μήκη πλευράς και μισής βάσης */}
          <text x="89" y="68" textAnchor="end" className="text-[10px] font-mono font-bold fill-sky-300">
            {diagram.sideLabel}
          </text>
          <text x="181" y="68" textAnchor="start" className="text-[10px] font-mono font-bold fill-sky-300">
            {diagram.sideLabel}
          </text>
          <text x="100" y="155" textAnchor="middle" className="text-[10px] font-mono font-bold fill-amber-300">
            {diagram.halfLabel}
          </text>
          <text x="170" y="155" textAnchor="middle" className="text-[10px] font-mono font-bold fill-emerald-300">
            {diagram.halfLabel}
          </text>
        </svg>
      </div>
    );
  }

  return null;
}

export default function AthroismaGonionExercises() {
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
    pageTitle: isEl ? "Ασκήσεις: Άθροισμα Γωνιών Τριγώνου & Ιδιότητες Ισοσκελούς | Α' Γυμνασίου" : "Exercises: Sum of Triangle Angles & Isosceles Properties | Grade 7",
    pageDesc: isEl ? "Διαδραστικές ασκήσεις Α' Γυμνασίου στο άθροισμα γωνιών τριγώνου (180°), στις οξείες συμπληρωματικές γωνίες ορθογωνίου, στις γωνίες ισόπλευρου (60°) και στις ιδιότητες ύψους-μεσοκαθέτου-διαμέσου-διχοτόμου." : "Interactive Grade 7 geometry exercises on triangle angle sum (180°), right triangle complementary angles, equilateral angles (60°), and altitude-bisector-median-perpendicular bisector coincidence.",
    backNav: isEl ? "Θεωρία Κεφ. 07" : "Theory Ch. 07",
    theoryBtn: isEl ? "ΘΕΩΡΙΑ" : "THEORY",
    heroBadge: isEl ? "ΑΣΚΗΣΕΙΣ • ΚΕΦΑΛΑΙΟ 07 • Α' ΓΥΜΝΑΣΙΟΥ" : "EXERCISES • CHAPTER 07 • GRADE 7",
    heroTitle: isEl ? "Άθροισμα Γωνιών Τριγώνου: Εξάσκηση" : "Sum of Triangle Angles: Practice",
    heroDesc: isEl ? "12 δυναμικές ερωτήσεις και προβλήματα στο άθροισμα γωνιών, σε ορθογώνια, ισοσκελή και ισόπλευρα τρίγωνα. Απαντήστε και πατήστε «Έλεγχος»." : "12 dynamic questions and problems on triangle angle sum, right, isosceles, and equilateral triangles. Answer and press 'Check'.",
    btnNewSet: isEl ? "ΝΕΕΣ ΑΣΚΗΣΕΙΣ" : "NEW EXERCISES",
    btnTryNewSet: isEl ? "ΔΟΚΙΜΑΣΤΕ ΝΕΟ ΣΕΤ" : "TRY NEW SET",
    scoreLabel: isEl ? "Αποτέλεσμα" : "Score",
    scoreGreat: isEl ? "Εξαιρετική επίδοση! Κατέχετε πλήρως το άθροισμα γωνιών τριγώνου και τις ιδιότητες συμμετρίας ισοσκελών και ισόπλευρων τριγώνων." : "Outstanding performance! You have mastered the triangle angle sum and symmetry properties of isosceles and equilateral triangles.",
    scoreGood: isEl ? "Πολύ καλή προσπάθεια! Μελετήστε τα αναλυτικά βήματα παρακάτω στα σημεία που δυσκολευτήκατε." : "Very good effort! Review the detailed steps below for any questions you missed.",
    scoreNeedWork: isEl ? "Χρειάζεται λίγη επανάληψη ακόμα στους υπολογισμούς γωνιών και στις ιδιότητες του ισοσκελούς!" : "Needs a bit more review on angle calculations and isosceles triangle properties!",
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

    // Q1: True / False - Θεμελιώδες θεώρημα αθροίσματος γωνιών (180°)
    const q1Variant = randInt(0, 1);
    const q1IsCorrect = Math.random() < 0.5;
    let q1Prompt = '';
    let q1Expl = '';

    if (q1Variant === 0) {
      q1Prompt = q1IsCorrect
        ? (isEl
            ? 'Σε κάθε τρίγωνο, ανεξάρτητα από το σχήμα ή το μέγεθος των πλευρών του, το άθροισμα των τριών εσωτερικών γωνιών του ισούται πάντοτε με 180°.'
            : 'In every triangle, regardless of its shape or side lengths, the sum of its three interior angles always equals 180°.')
        : (isEl
            ? 'Όσο μεγαλύτερες είναι οι πλευρές ενός τριγώνου, τόσο μεγαλύτερο είναι και το άθροισμα των τριών γωνιών του.'
            : 'The longer the sides of a triangle, the greater the sum of its three interior angles.');
      q1Expl = isEl
        ? 'Το άθροισμα των τριών γωνιών κάθε τριγώνου είναι σταθερό και ίσο με 180° (μία ευθεία γωνία), ανεξάρτητα από τα μήκη των πλευρών.'
        : 'The sum of the interior angles of any triangle is always constant and equal to 180° (a straight angle), independent of side lengths.';
    } else {
      q1Prompt = q1IsCorrect
        ? (isEl
            ? 'Κάθε τρίγωνο έχει υποχρεωτικά τουλάχιστον δύο οξείες γωνίες.'
            : 'Every triangle necessarily has at least two acute angles.')
        : (isEl
            ? 'Μπορεί να υπάρξει τρίγωνο που να έχει μία ορθή γωνία (90°) και μία αμβλεία γωνία (π.χ. 100°).'
            : 'A triangle can have one right angle (90°) and one obtuse angle (e.g., 100°).');
      q1Expl = isEl
        ? 'Επειδή το άθροισμα των τριών γωνιών είναι 180°, δεν χωρούν δύο γωνίες ≥ 90° (90° ＋ 100° ＝ 190° ＞ 180°). Άρα τουλάχιστον δύο γωνίες είναι πάντα οξείες.'
        : 'Since the three angles sum to 180°, two angles cannot both be ≥ 90° (90° ＋ 100° ＝ 190° ＞ 180°). Thus at least two angles are always acute.';
    }

    qList.push({
      id: 1,
      title: isEl ? 'Άθροισμα Γωνιών Τριγώνου' : 'Sum of Angles in a Triangle',
      prompt: q1Prompt,
      type: 'tf',
      correct: q1IsCorrect ? (isEl ? 'Σωστό' : 'True') : (isEl ? 'Λάθος' : 'False'),
      options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
      explanation: q1Expl
    });

    // Q2: Input - Εύρεση 3ης γωνίας τριγώνου (+ SVG)
    const a2 = randInt(35, 78);
    const b2 = randInt(40, 82);
    const c2 = 180 - a2 - b2;

    qList.push({
      id: 2,
      title: isEl ? 'Υπολογισμός 3ης Γωνίας Τριγώνου' : 'Finding the 3rd Angle of a Triangle',
      prompt: isEl ? (
        <span>
          Σε ένα τρίγωνο ΑΒΓ δίνονται <Angle>Α</Angle> ＝ {a2}° και <Angle>Β</Angle> ＝ {b2}°. Πόσες μοίρες είναι η τρίτη γωνία <Angle>Γ</Angle>;
        </span>
      ) : (
        <span>
          In triangle ABC, ∠A ＝ {a2}° and ∠B ＝ {b2}°. How many degrees is the third angle ∠C?
        </span>
      ),
      type: 'input',
      correct: c2,
      unit: '°',
      diagram: { type: 'general', angA: a2, angB: b2, angC: c2 },
      explanation: isEl ? (
        <span>
          Επειδή <Angle>Α</Angle> ＋ <Angle>Β</Angle> ＋ <Angle>Γ</Angle> ＝ 180°, έχουμε: <Angle>Γ</Angle> ＝ 180° － ({a2}° ＋ {b2}°) ＝ 180° － {a2 + b2}° ＝ {c2}°.
        </span>
      ) : (
        <span>
          Since ∠A ＋ ∠B ＋ ∠C ＝ 180°, we get: ∠C ＝ 180° － ({a2}° ＋ {b2}°) ＝ 180° － {a2 + b2}° ＝ {c2}°.
        </span>
      )
    });

    // Q3: Input - Ορθογώνιο τρίγωνο (συμπληρωματικές οξείες γωνίες) (+ SVG)
    const acuteB3 = randInt(18, 72);
    const acuteC3 = 90 - acuteB3;

    qList.push({
      id: 3,
      title: isEl ? 'Οξείες Γωνίες Ορθογωνίου Τριγώνου' : 'Acute Angles of a Right Triangle',
      prompt: isEl ? (
        <span>
          Το τρίγωνο ΑΒΓ είναι ορθογώνιο με <Angle>Α</Angle> ＝ 90°. Αν η γωνία <Angle>Β</Angle> είναι {acuteB3}°, πόσες μοίρες είναι η γωνία <Angle>Γ</Angle>;
        </span>
      ) : (
        <span>
          Triangle ABC is a right triangle with ∠A ＝ 90°. If angle ∠B measures {acuteB3}°, how many degrees is angle ∠C?
        </span>
      ),
      type: 'input',
      correct: acuteC3,
      unit: '°',
      diagram: { type: 'right', labelB: `${acuteB3}°`, labelC: `${acuteC3}°` },
      explanation: isEl ? (
        <span>
          Σε κάθε ορθογώνιο τρίγωνο, οι δύο οξείες γωνίες είναι συμπληρωματικές (<Angle>Β</Angle> ＋ <Angle>Γ</Angle> ＝ 90°). Άρα <Angle>Γ</Angle> ＝ 90° － {acuteB3}° ＝ {acuteC3}°.
        </span>
      ) : (
        <span>
          In any right triangle, the two acute angles are complementary (∠B ＋ ∠C ＝ 90°). Therefore, ∠C ＝ 90° － {acuteB3}° ＝ {acuteC3}°.
        </span>
      )
    });

    // Q4: MCQ - Ιδιότητα γωνιών ορθογωνίου & ισόπλευρου
    const q4Variant = randInt(0, 1);
    let q4Prompt, q4Correct, q4Distractors, q4Expl;

    if (q4Variant === 0) {
      q4Prompt = isEl
        ? 'Τι ισχύει για τις δύο μη ορθές γωνίες ενός ορθογωνίου τριγώνου;'
        : 'What is true about the two non-right angles of a right triangle?';
      q4Correct = isEl
        ? 'Είναι οξείες και συμπληρωματικές (άθροισμα 90°)'
        : 'They are acute and complementary (sum to 90°)';
      q4Distractors = isEl
        ? [
            'Είναι οξείες και συμπληρωματικές (άθροισμα 90°)',
            'Είναι παραπληρωματικές (άθροισμα 180°)',
            'Είναι πάντα ίσες με 45°',
            'Η μία είναι οξεία και η άλλη αμβλεία',
            'Έχουν άθροισμα 100°'
          ]
        : [
            'They are acute and complementary (sum to 90°)',
            'They are supplementary (sum to 180°)',
            'They always measure 45° each',
            'One is acute and the other is obtuse',
            'Their sum is 100°'
          ];
      q4Expl = isEl
        ? 'Αφού η μία γωνία είναι 90° και το συνολικό άθροισμα είναι 180°, οι άλλες δύο έχουν άθροισμα 180° － 90° ＝ 90°, άρα είναι οξείες και συμπληρωματικές.'
        : 'Since one angle is 90° and the total sum is 180°, the other two angles sum to 180° － 90° ＝ 90°, so they are acute and complementary.';
    } else {
      q4Prompt = isEl
        ? 'Πόσες μοίρες είναι καθεμία από τις τρεις γωνίες ενός ισόπλευρου τριγώνου;'
        : 'How many degrees is each of the three angles of an equilateral triangle?';
      q4Correct = '60°';
      q4Distractors = ['60°', '45°', '90°', '30°', '120°', '75°'];
      q4Expl = isEl ? (
        <span className="inline-flex flex-wrap items-center gap-1">
          <span>Το ισόπλευρο τρίγωνο έχει 3 ίσες γωνίες με άθροισμα 180°, άρα καθεμία είναι:</span>
          <span className="inline-flex items-center font-mono">
            <Frac num="180°" den="3" /> ＝ 60°.
          </span>
        </span>
      ) : (
        <span className="inline-flex flex-wrap items-center gap-1">
          <span>An equilateral triangle has 3 equal angles summing to 180°, so each measures:</span>
          <span className="inline-flex items-center font-mono">
            <Frac num="180°" den="3" /> ＝ 60°.
          </span>
        </span>
      );
    }

    qList.push({
      id: 4,
      title: isEl ? 'Γωνίες Ορθογωνίου & Ισόπλευρου' : 'Right & Equilateral Triangle Angles',
      prompt: q4Prompt,
      type: 'mcq',
      correct: q4Correct,
      options: ensureFourUniqueOptions(q4Correct, () => q4Distractors[randInt(0, q4Distractors.length - 1)]),
      explanation: q4Expl
    });

    // Q5: True / False - Ταύτιση ύψους, μεσοκαθέτου, διαμέσου, διχοτόμου
    const q5Variant = randInt(0, 1);
    const q5IsCorrect = Math.random() < 0.5;
    let q5Prompt = '';
    let q5Expl = '';

    if (q5Variant === 0) {
      q5Prompt = q5IsCorrect
        ? (isEl
            ? 'Σε κάθε ισοσκελές τρίγωνο, το ύψος που αντιστοιχεί στη βάση του είναι ταυτόχρονα τμήμα της μεσοκαθέτου, διάμεσος και διχοτόμος της γωνίας της απέναντι κορυφής.'
            : 'In every isosceles triangle, the altitude to its base is simultaneously a segment of the perpendicular bisector, a median, and the bisector of the opposite vertex angle.')
        : (isEl
            ? 'Σε οποιοδήποτε σκαληνό τρίγωνο, κάθε ύψος είναι ταυτόχρονα και διάμεσος και διχοτόμος.'
            : 'In any scalene triangle, every altitude is simultaneously a median and an angle bisector.');
      q5Expl = isEl
        ? 'Η ταύτιση ύψους, τμήματος μεσοκαθέτου, διαμέσου και διχοτόμου ισχύει ΜΟΝΟ για το ύψος προς τη βάση ενός ισοσκελούς τριγώνου (και για τα 3 ύψη ενός ισόπλευρου).'
        : 'The coincidence of altitude, perpendicular bisector segment, median, and angle bisector holds ONLY for the altitude to the base of an isosceles triangle (and for all 3 altitudes of an equilateral triangle).';
    } else {
      q5Prompt = q5IsCorrect
        ? (isEl
            ? 'Στο ισόπλευρο τρίγωνο, και τα τρία ύψη του είναι ταυτόχρονα τμήματα των μεσοκαθέτων, διάμεσοι και διχοτόμοι.'
            : 'In an equilateral triangle, all three altitudes are simultaneously segments of the perpendicular bisectors, medians, and angle bisectors.')
        : (isEl
            ? 'Στο ισόπλευρο τρίγωνο, μόνο το ένα από τα τρία ύψη είναι ταυτόχρονα διάμεσος και διχοτόμος.'
            : 'In an equilateral triangle, only one of the three altitudes is also a median and angle bisector.');
      q5Expl = isEl
        ? 'Επειδή στο ισόπλευρο τρίγωνο και οι 3 πλευρές είναι ίσες (είναι ισοσκελές ως προς κάθε πλευρά), η ιδιότητα ισχύει και για τα τρία ύψη του!'
        : 'Since all three sides of an equilateral triangle are equal, it is isosceles with respect to every side, so the property holds for all three altitudes!';
    }

    qList.push({
      id: 5,
      title: isEl ? 'Ιδιότητα Ύψους-Μεσοκαθέτου-Διαμέσου' : 'Altitude-Perpendicular Bisector-Median Property',
      prompt: q5Prompt,
      type: 'tf',
      correct: q5IsCorrect ? (isEl ? 'Σωστό' : 'True') : (isEl ? 'Λάθος' : 'False'),
      options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
      explanation: q5Expl
    });

    // Q6: MCQ - Πλήρης χαρακτηρισμός ύψους στη βάση ισοσκελούς
    const q6Correct = isEl
      ? 'Τμήμα της μεσοκαθέτου, διάμεσος και διχοτόμος της γωνίας κορυφής'
      : 'Segment of the perpendicular bisector, median, and vertex angle bisector';
    const q6Distractors = isEl
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
      id: 6,
      title: isEl ? 'Συμμετρία Ισοσκελούς Τριγώνου' : 'Symmetry of an Isosceles Triangle',
      prompt: isEl
        ? 'Σε ένα ισοσκελές τρίγωνο ΑΒΓ (ΑΒ ＝ ΑΓ), τι είναι ταυτόχρονα το ύψος ΑΥ που αντιστοιχεί στη βάση του ΒΓ;'
        : 'In an isosceles triangle ABC (AB ＝ AC), what is the altitude AH to base BC simultaneously?',
      type: 'mcq',
      correct: q6Correct,
      options: ensureFourUniqueOptions(q6Correct, () => q6Distractors[randInt(0, q6Distractors.length - 1)]),
      explanation: isEl
        ? 'Σε κάθε ισοσκελές τρίγωνο, το ύψος προς τη βάση είναι ταυτόχρονα τμήμα της μεσοκαθέτου της βάσης, διάμεσος και διχοτόμος της γωνίας της απέναντι κορυφής.'
        : 'In every isosceles triangle, the altitude to the base is simultaneously a segment of the perpendicular bisector of the base, a median, and the bisector of the opposite vertex angle.'
    });

    // Q7: Input - Ισοσκελές τρίγωνο (δίνεται γωνία κορυφής -> ζητείται γωνία βάσης) (+ SVG)
    const apex7 = randInt(16, 54) * 2; // άρτια γωνία κορυφής 32°..108°
    const base7 = (180 - apex7) / 2;

    qList.push({
      id: 7,
      title: isEl ? 'Γωνίες Βάσης Ισοσκελούς Τριγώνου' : 'Base Angles of an Isosceles Triangle',
      prompt: isEl ? (
        <span>
          Ένα ισοσκελές τρίγωνο ΑΒΓ (ΑΒ ＝ ΑΓ) έχει γωνία κορυφής <Angle>Α</Angle> ＝ {apex7}°. Πόσες μοίρες είναι καθεμία από τις γωνίες της βάσης του (<Angle>Β</Angle> και <Angle>Γ</Angle>);
        </span>
      ) : (
        <span>
          An isosceles triangle ABC (AB ＝ AC) has vertex angle ∠A ＝ {apex7}°. How many degrees is each base angle (∠B and ∠C)?
        </span>
      ),
      type: 'input',
      correct: base7,
      unit: '°',
      diagram: { type: 'isosceles', labelA: `${apex7}°`, labelB: `${base7}°`, labelC: `${base7}°`, showAltitude: false },
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed break-words [overflow-wrap:anywhere]">
          <span>
            {isEl ? (
              <>
                Οι γωνίες της βάσης είναι ίσες (<Angle>Β</Angle> ＝ <Angle>Γ</Angle>) και το άθροισμα είναι 180°:
              </>
            ) : (
              'The base angles are equal (∠B ＝ ∠C) and the sum is 180°:'
            )}
          </span>
          <span className="inline-flex items-center gap-1 font-mono">
            <Frac num={`180° － ${apex7}°`} den="2" /> ＝ <Frac num={`${180 - apex7}°`} den="2" /> ＝ {base7}°.
          </span>
        </span>
      )
    });

    // Q8: Input - Ισοσκελές τρίγωνο (δίνεται γωνία βάσης -> ζητείται γωνία κορυφής) (+ SVG)
    const base8 = randInt(42, 76);
    const apex8 = 180 - 2 * base8;

    qList.push({
      id: 8,
      title: isEl ? 'Γωνία Κορυφής Ισοσκελούς Τριγώνου' : 'Vertex Angle of an Isosceles Triangle',
      prompt: isEl ? (
        <span>
          Ένα ισοσκελές τρίγωνο ΑΒΓ (ΑΒ ＝ ΑΓ) έχει γωνία βάσης <Angle>Β</Angle> ＝ {base8}°. Πόσες μοίρες είναι η γωνία κορυφής <Angle>Α</Angle>;
        </span>
      ) : (
        <span>
          An isosceles triangle ABC (AB ＝ AC) has base angle ∠B ＝ {base8}°. How many degrees is the vertex angle ∠A?
        </span>
      ),
      type: 'input',
      correct: apex8,
      unit: '°',
      diagram: { type: 'isosceles', labelA: `${apex8}°`, labelB: `${base8}°`, labelC: `${base8}°`, showAltitude: false },
      explanation: isEl ? (
        <span>
          Επειδή ΑΒ ＝ ΑΓ, ισχύει <Angle>Γ</Angle> ＝ <Angle>Β</Angle> ＝ {base8}°. Άρα <Angle>Α</Angle> ＝ 180° － ({base8}° ＋ {base8}°) ＝ 180° － {2 * base8}° ＝ {apex8}°.
        </span>
      ) : (
        <span>
          Since AB ＝ AC, ∠C ＝ ∠B ＝ {base8}°. Therefore, ∠A ＝ 180° － ({base8}° ＋ {base8}°) ＝ 180° － {2 * base8}° ＝ {apex8}°.
        </span>
      )
    });

    // Q9: Input + tableData + SVG - Ύψος-Διχοτόμος σε ισοσκελές τρίγωνο
    const base9 = randInt(52, 74);
    const halfApex9 = 90 - base9; // ΒΑΥ = 90° - Β

    qList.push({
      id: 9,
      title: isEl ? 'Ύψος & Γωνίες σε Ισοσκελές Τρίγωνο' : 'Altitude & Angles in an Isosceles Triangle',
      prompt: isEl ? (
        <span>
          Σε ισοσκελές τρίγωνο ΑΒΓ (ΑΒ ＝ ΑΓ), η γωνία της βάσης <Angle>Β</Angle> είναι {base9}° και φέρνουμε το ύψος ΑΥ προς τη βάση ΒΓ. Πόσες μοίρες είναι η γωνία Β<Angle>Α</Angle>Υ;
        </span>
      ) : (
        <span>
          In isosceles triangle ABC (AB ＝ AC), base angle ∠B measures {base9}° and we draw altitude AH to base BC. How many degrees is angle ∠BAH?
        </span>
      ),
      type: 'input',
      correct: halfApex9,
      unit: '°',
      diagram: {
        type: 'isosceles',
        labelB: `${base9}°`,
        labelC: `${base9}°`,
        showAltitude: true,
        subAngleLabel: `${halfApex9}°`
      },
      tableData: [
        {
          label: isEl ? 'Ορθογώνιο τρίγωνο ΑΒΥ' : 'Right triangle ABH',
          details: isEl ? (
            <span>
              Επειδή ΑΥ ⊥ ΒΓ, η γωνία Α<Angle>Υ</Angle>Β ＝ 90°
            </span>
          ) : (
            'Since AH ⊥ BC, angle ∠AHB ＝ 90°'
          )
        },
        {
          label: isEl ? 'Συμπληρωματικές γωνίες' : 'Complementary angles',
          details: isEl ? (
            <span>
              <Angle>Β</Angle> ＋ Β<Angle>Α</Angle>Υ ＝ 90°
            </span>
          ) : (
            '∠B ＋ ∠BAH ＝ 90°'
          )
        },
        {
          label: isEl ? 'Υπολογισμός' : 'Calculation',
          details: `90° － ${base9}° ＝ ${halfApex9}°`
        }
      ],
      explanation: isEl ? (
        <span>
          Στο ορθογώνιο τρίγωνο ΑΒΥ (<Angle>Υ</Angle> ＝ 90°), οι οξείες γωνίες <Angle>Β</Angle> και Β<Angle>Α</Angle>Υ είναι συμπληρωματικές. Άρα Β<Angle>Α</Angle>Υ ＝ 90° － {base9}° ＝ {halfApex9}°.
        </span>
      ) : (
        <span>
          In right triangle ABH (∠H ＝ 90°), acute angles ∠B and ∠BAH are complementary. Hence, ∠BAH ＝ 90° － {base9}° ＝ {halfApex9}°.
        </span>
      )
    });

    // Q10: Input + tableData + SVG - Ύψος-Μεσοκάθετος σε ισοσκελές & υπολογισμός σκέλους από περίμετρο
    const halfBase10 = randInt(4, 9);
    const fullBase10 = 2 * halfBase10;
    const leg10 = randInt(halfBase10 + 3, halfBase10 + 10);
    const perim10 = 2 * leg10 + fullBase10;

    qList.push({
      id: 10,
      title: isEl ? 'Ύψος-Μεσοκάθετος & Περίμετρος Ισοσκελούς' : 'Altitude-Perpendicular Bisector & Perimeter',
      prompt: isEl ? (
        <span>
          Ένα ισοσκελές τρίγωνο ΑΒΓ (ΑΒ ＝ ΑΓ) έχει περίμετρο {perim10} cm. Το ύψος ΑΥ προς τη βάση ΒΓ τέμνει τη βάση στο σημείο Υ ώστε ΒΥ ＝ {halfBase10} cm. Πόσα εκατοστά (cm) είναι το μήκος του σκέλους ΑΒ;
        </span>
      ) : (
        <span>
          An isosceles triangle ABC (AB ＝ AC) has perimeter {perim10} cm. The altitude AH to base BC meets BC at H such that BH ＝ {halfBase10} cm. What is the length of leg AB in cm?
        </span>
      ),
      type: 'input',
      correct: leg10,
      unit: 'cm',
      diagram: {
        type: 'isosceles',
        showAltitude: true,
        legLabel: `${leg10} cm`,
        halfBaseLabel: `${halfBase10} cm`
      },
      tableData: [
        {
          label: isEl ? '1. Εύρεση βάσης ΒΓ' : '1. Finding base BC',
          details: isEl
            ? `Το ύψος ΑΥ είναι τμήμα της μεσοκαθέτου της ΒΓ ⇒ ΒΓ ＝ 2 · ${halfBase10} ＝ ${fullBase10} cm`
            : `Altitude AH is part of the perpendicular bisector of BC ⇒ BC ＝ 2 · ${halfBase10} ＝ ${fullBase10} cm`
        },
        {
          label: isEl ? '2. Άθροισμα δύο σκελών' : '2. Sum of two equal legs',
          details: `ΑΒ ＋ ΑΓ ＝ ${perim10} － ${fullBase10} ＝ ${2 * leg10} cm`
        },
        {
          label: isEl ? '3. Μήκος σκέλους ΑΒ' : '3. Length of leg AB',
          details: (
            <span className="inline-flex items-center gap-1">
              ΑΒ ＝ <Frac num={2 * leg10} den="2" /> ＝ {leg10} cm
            </span>
          )
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed break-words [overflow-wrap:anywhere]">
          <span>
            {isEl
              ? `Επειδή το ύψος ΑΥ είναι τμήμα της μεσοκαθέτου της ΒΓ, η βάση είναι ΒΓ ＝ 2 · ${halfBase10} ＝ ${fullBase10} cm. Άρα:`
              : `Since altitude AH is part of the perpendicular bisector of BC, base BC ＝ 2 · ${halfBase10} ＝ ${fullBase10} cm. Thus:`}
          </span>
          <span className="inline-flex items-center gap-1 font-mono">
            ΑΒ ＝ <Frac num={`${perim10} － ${fullBase10}`} den="2" /> ＝ <Frac num={2 * leg10} den="2" /> ＝ {leg10} cm.
          </span>
        </span>
      )
    });

    // Q11: MCQ + tableData + SVG - Ορθογώνιο τρίγωνο με οξείες γωνίες σε αναλογία
    const validMults = [2, 4, 5];
    const k11 = validMults[randInt(0, validMults.length - 1)];
    const smallAcute11 = 90 / (1 + k11);
    const largeAcute11 = k11 * smallAcute11;

    const q11Correct = `${largeAcute11}°`;
    const q11Distractors = [
      `${smallAcute11}°`,
      `${180 / (1 + k11)}°`,
      `${k11 * (180 / (1 + k11))}°`,
      '45°',
      `${90 - k11 * 5}°`
    ];

    const multWordEl = k11 === 2 ? 'διπλάσια' : k11 === 4 ? 'τετραπλάσια' : 'πενταπλάσια';
    const multWordEn = k11 === 2 ? 'twice' : k11 === 4 ? 'four times' : 'five times';

    qList.push({
      id: 11,
      title: isEl ? 'Οξείες Γωνίες Ορθογωνίου σε Σχέση' : 'Acute Angles of a Right Triangle in Ratio',
      prompt: isEl
        ? `Σε ένα ορθογώνιο τρίγωνο, η μία οξεία γωνία είναι ${multWordEl} από την άλλη οξεία γωνία. Πόσες μοίρες είναι η μεγαλύτερη οξεία γωνία του;`
        : `In a right triangle, one acute angle is ${multWordEn} the other acute angle. How many degrees is the larger acute angle?`,
      type: 'mcq',
      correct: q11Correct,
      options: ensureFourUniqueOptions(q11Correct, () => q11Distractors[randInt(0, q11Distractors.length - 1)]),
      diagram: {
        type: 'right',
        labelB: `x = ${smallAcute11}°`,
        labelC: `${k11}x = ${largeAcute11}°`
      },
      tableData: [
        {
          label: isEl ? 'Συμπληρωματικές γωνίες' : 'Complementary angles',
          details: isEl
            ? `Αν η μικρή οξεία γωνία είναι x, η μεγάλη είναι ${k11} · x και x ＋ ${k11} · x ＝ 90°`
            : `If the smaller acute angle is x, the larger is ${k11} · x and x ＋ ${k11} · x ＝ 90°`
        },
        {
          label: isEl ? 'Μικρή οξεία γωνία (x)' : 'Smaller acute angle (x)',
          details: (
            <span className="inline-flex items-center gap-1">
              ({1 + k11}) · x ＝ 90° ⇒ x ＝ <Frac num="90°" den={1 + k11} /> ＝ {smallAcute11}°
            </span>
          )
        },
        {
          label: isEl ? 'Μεγάλη οξεία γωνία' : 'Larger acute angle',
          details: `${k11} · ${smallAcute11}° ＝ ${largeAcute11}°`
        }
      ],
      explanation: isEl
        ? `Οι δύο οξείες γωνίες έχουν άθροισμα 90°. Αφού η μία είναι ${multWordEl} της άλλης, μοιράζουμε τις 90° σε ${1 + k11} ίσα μέρη: 90° ÷ ${1 + k11} ＝ ${smallAcute11}°, οπότε η μεγαλύτερη είναι ${k11} · ${smallAcute11}° ＝ ${largeAcute11}°.`
        : `The two acute angles sum to 90°. Dividing 90° into ${1 + k11} equal parts gives 90° ÷ ${1 + k11} ＝ ${smallAcute11}°, so the larger acute angle is ${k11} · ${smallAcute11}° ＝ ${largeAcute11}°.`
    });

    // Q12: Input + tableData + SVG - Συνδυαστικό πρόβλημα: Ισόπλευρο τρίγωνο & Ύψος-Μεσοκάθετος-Διάμεσος-Διχοτόμος
    const equiSide12 = randInt(6, 18) * 2; // άρτια πλευρά 12..36 cm
    const halfEqui12 = equiSide12 / 2;

    qList.push({
      id: 12,
      title: isEl ? 'Ισόπλευρο Τρίγωνο & Ύψος-Μεσοκάθετος' : 'Equilateral Triangle & Altitude-Perpendicular Bisector',
      prompt: isEl ? (
        <span>
          Σε ένα ισόπλευρο τρίγωνο ΑΒΓ με περίμετρο {3 * equiSide12} cm, φέρνουμε το ύψος ΑΥ προς την πλευρά ΒΓ. Πόσα εκατοστά (cm) είναι το μήκος του τμήματος ΒΥ;
        </span>
      ) : (
        <span>
          In an equilateral triangle ABC with perimeter {3 * equiSide12} cm, we draw altitude AH to side BC. What is the length of segment BH in cm?
        </span>
      ),
      type: 'input',
      correct: halfEqui12,
      unit: 'cm',
      diagram: {
        type: 'equilateral',
        sideLabel: `${equiSide12} cm`,
        halfLabel: `${halfEqui12} cm`
      },
      tableData: [
        {
          label: isEl ? '1. Πλευρά ισόπλευρου' : '1. Side of equilateral triangle',
          details: (
            <span className="inline-flex items-center gap-1">
              ΒΓ ＝ <Frac num={3 * equiSide12} den="3" /> ＝ {equiSide12} cm
            </span>
          )
        },
        {
          label: isEl ? '2. Ιδιότητα ύψους ΑΥ' : '2. Property of altitude AH',
          details: isEl
            ? 'Στο ισόπλευρο τρίγωνο, κάθε ύψος είναι ταυτόχρονα τμήμα της μεσοκαθέτου και διάμεσος'
            : 'In an equilateral triangle, every altitude is also a segment of the perpendicular bisector and a median'
        },
        {
          label: isEl ? '3. Υπολογισμός ΒΥ' : '3. Calculating BH',
          details: (
            <span className="inline-flex items-center gap-1">
              ΒΥ ＝ <Frac num={equiSide12} den="2" /> ＝ {halfEqui12} cm
            </span>
          )
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed break-words [overflow-wrap:anywhere]">
          <span>
            {isEl
              ? `Κάθε πλευρά του ισόπλευρου τριγώνου είναι ${3 * equiSide12} ÷ 3 ＝ ${equiSide12} cm. Επειδή το ύψος ΑΥ είναι και τμήμα της μεσοκαθέτου (διάμεσος) της ΒΓ, ισχύει:`
              : `Each side of the equilateral triangle is ${3 * equiSide12} ÷ 3 ＝ ${equiSide12} cm. Since altitude AH is also a segment of the perpendicular bisector (median) of BC:`}
          </span>
          <span className="inline-flex items-center gap-1 font-mono">
            ΒΥ ＝ <Frac num={equiSide12} den="2" /> ＝ {halfEqui12} cm.
          </span>
        </span>
      )
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
      backUrl="/a-gymnasiou/42-athroisma-gonion"
      backText={t.backNav}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/42-athroisma-gonion"
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
                    {/* Δυναμικό SVG Σχήμα Επεξήγησης (αν υπάρχει) */}
                    {q.diagram && (
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
                    )}

                    {/* Feedback χωρίς διάγραμμα (Ερωτήσεις 1, 4, 5, 6) */}
                    {!q.diagram && (
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