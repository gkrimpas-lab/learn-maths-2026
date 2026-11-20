import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// --- Βοηθητική Συνάρτηση για Άτονα Κεφαλαία (διατηρεί το Β') ---
function toCleanUppercase(str) {
  if (!str) return '';
  return str
    .replace(/Β'/g, '___BETA_PRIME___')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/___BETA_PRIME___/g, "Β'");
}

// --- Custom Μαθηματικά Components ---
const Angle = ({ children }) => (
  <span className="inline-flex flex-col items-center leading-none align-baseline mx-0.5 select-none">
    <svg
      viewBox="0 0 18 7"
      className="w-3.5 h-1.5 -mb-0.5 text-current overflow-visible"
      aria-hidden="true"
    >
      <path
        d="M 1.5 6 L 9 1.2 L 16.5 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <span className="leading-none">{children}</span>
  </span>
);

const Arc = ({ children }) => (
  <span className="inline-flex flex-col items-center leading-none align-baseline mx-0.5 select-none">
    <svg
      viewBox="0 0 24 8"
      className="w-5 h-2 -mb-0.5 text-current overflow-visible"
      aria-hidden="true"
    >
      <path
        d="M 1.5 6.5 Q 12 0.5 22.5 6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
    <span className="leading-none">{children}</span>
  </span>
);

const Frac = ({ num, den, className = '' }) => (
  <span
    className={`inline-flex flex-col items-center justify-center align-middle mx-1 text-center leading-tight ${className}`}
  >
    <span className="px-1 pb-0.5 border-b border-current font-semibold">
      {num}
    </span>
    <span className="px-1 pt-0.5 font-semibold">{den}</span>
  </span>
);

const Radical = ({ children, index = null }) => (
  <span className="inline-flex items-stretch align-middle mx-0.5 select-none">
    {index && (
      <sup className="text-[0.65em] font-bold -mr-1.5 mt-0.5">{index}</sup>
    )}
    <svg
      viewBox="0 0 14 24"
      className="w-3 h-5 text-current shrink-0 overflow-visible"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M 1 14 L 4.5 14 L 7.5 22.5 L 13 1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <span className="border-t-2 border-current px-1 pt-0.5 leading-none inline-flex items-center">
      {children}
    </span>
  </span>
);

// --- Custom Slider με πλήρη υποστήριξη Mouse & Touch ---
const CustomSlider = ({
  min,
  max,
  step = 1,
  value,
  onChange,
  accentColor = 'indigo',
  ariaLabel = 'Slider',
}) => {
  const trackRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const updateFromClientX = (clientX) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const raw = min + ratio * (max - min);
    const snapped = Math.round(raw / step) * step;
    const clamped = Math.max(min, Math.min(max, Number(snapped.toFixed(4))));
    onChange(clamped);
  };

  useEffect(() => {
    if (!dragging) return;
    const handleMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      updateFromClientX(clientX);
    };
    const handleUp = () => setDragging(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchmove', handleMove, { passive: true });
    window.addEventListener('touchend', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
    };
  }, [dragging, min, max, step]);

  const pct = ((value - min) / (max - min)) * 100;
  const fillClass =
    accentColor === 'emerald'
      ? 'bg-emerald-600'
      : accentColor === 'amber'
      ? 'bg-amber-600'
      : 'bg-indigo-600';
  const ringClass =
    accentColor === 'emerald'
      ? 'border-emerald-600 focus:ring-emerald-300'
      : accentColor === 'amber'
      ? 'border-amber-600 focus:ring-amber-300'
      : 'border-indigo-600 focus:ring-indigo-300';

  return (
    <div
      ref={trackRef}
      role="slider"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      onMouseDown={(e) => {
        setDragging(true);
        updateFromClientX(e.clientX);
      }}
      onTouchStart={(e) => {
        setDragging(true);
        updateFromClientX(e.touches[0].clientX);
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          e.preventDefault();
          onChange(Math.min(max, Number((value + step).toFixed(4))));
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          e.preventDefault();
          onChange(Math.max(min, Number((value - step).toFixed(4))));
        }
      }}
      className="relative w-full h-8 flex items-center cursor-pointer select-none touch-none"
    >
      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${fillClass} transition-all duration-75`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div
        className={`absolute w-6 h-6 rounded-full bg-white border-4 ${ringClass} shadow-md transform -translate-x-1/2 transition-transform ${
          dragging ? 'scale-110' : 'hover:scale-105'
        }`}
        style={{ left: `${pct}%` }}
      />
    </div>
  );
};

export default function PragmatikoiTheoryPage() {
  const router = useRouter();
  const isEn = router?.locale === 'en';

  // --- State Διαδραστικού Εργαστηρίου ---
  const [activeLabTab, setActiveLabTab] = useState('irrational'); // 'irrational' | 'powers'

  // Tab 1: Τοποθέτηση άρρητων στην ευθεία
  const [selectedRoot, setSelectedRoot] = useState('sqrt2'); // 'sqrt2' | 'sqrt3' | 'sqrt5' | 'sqrt8'
  const [compassProgress, setCompassProgress] = useState(75); // 0 - 100

  // Tab 2: Δύναμη α^ν με πραγματική βάση & ακέραιο εκθέτη
  const [baseChoice, setBaseChoice] = useState('2'); // '2' | '3' | 'half' | 'neg2' | 'sqrt2'
  const [exponentVal, setExponentVal] = useState(-2); // -4 to 4

  // Δεδομένα για Tab 1 (Άρρητοι)
  const rootConfigs = {
    sqrt2: {
      label: '2',
      legA: 1,
      legB: 1,
      hyp: Math.SQRT2,
      approx: '1,414...',
      approxEn: '1.414...',
      formulaEl: '1² + 1² = 2 ⇒ ρ = √2',
      formulaEn: '1² + 1² = 2 ⇒ ρ = √2',
      descEl: 'Ορθογώνιο τρίγωνο με κάθετες πλευρές 1 και 1.',
      descEn: 'Right triangle with perpendicular legs 1 and 1.',
    },
    sqrt3: {
      label: '3',
      legA: Math.SQRT2,
      legB: 1,
      hyp: Math.sqrt(3),
      approx: '1,732...',
      approxEn: '1.732...',
      formulaEl: '(√2)² + 1² = 3 ⇒ ρ = √3',
      formulaEn: '(√2)² + 1² = 3 ⇒ ρ = √3',
      descEl: 'Ορθογώνιο τρίγωνο με κάθετες πλευρές √2 και 1.',
      descEn: 'Right triangle with perpendicular legs √2 and 1.',
    },
    sqrt5: {
      label: '5',
      legA: 2,
      legB: 1,
      hyp: Math.sqrt(5),
      approx: '2,236...',
      approxEn: '2.236...',
      formulaEl: '2² + 1² = 5 ⇒ ρ = √5',
      formulaEn: '2² + 1² = 5 ⇒ ρ = √5',
      descEl: 'Ορθογώνιο τρίγωνο με κάθετες πλευρές 2 και 1.',
      descEn: 'Right triangle with perpendicular legs 2 and 1.',
    },
    sqrt8: {
      label: '8',
      legA: 2,
      legB: 2,
      hyp: Math.sqrt(8),
      approx: '2,828...',
      approxEn: '2.828...',
      formulaEl: '2² + 2² = 8 ⇒ ρ = √8 = 2√2',
      formulaEn: '2² + 2² = 8 ⇒ ρ = √8 = 2√2',
      descEl: 'Ορθογώνιο τρίγωνο με κάθετες πλευρές 2 και 2.',
      descEn: 'Right triangle with perpendicular legs 2 and 2.',
    },
  };

  const currentRoot = rootConfigs[selectedRoot];
  const originX = 80;
  const originY = 230;
  const unitPx = 135;
  const pointAX = originX + currentRoot.legA * unitPx;
  const pointAY = originY;
  const pointBX = pointAX;
  const pointBY = originY - currentRoot.legB * unitPx;

  const startAngle = Math.atan2(pointBY - originY, pointBX - originX);
  const currentAngle = startAngle * (1 - compassProgress / 100);
  const radiusPx = currentRoot.hyp * unitPx;
  const tipX = originX + radiusPx * Math.cos(currentAngle);
  const tipY = originY + radiusPx * Math.sin(currentAngle);
  const landedX = originX + radiusPx;

  // Δεδομένα για Tab 2 (Δυνάμεις)
  const baseConfigs = {
    '2': { label: '2', numVal: 2, isFrac: false, isRoot: false },
    '3': { label: '3', numVal: 3, isFrac: false, isRoot: false },
    half: { label: '1/2', numVal: 0.5, isFrac: true, num: 1, den: 2, isRoot: false },
    neg2: { label: '-2', numVal: -2, isFrac: false, isRoot: false },
    sqrt2: { label: '√2', numVal: Math.SQRT2, isFrac: false, isRoot: true },
  };
  const currentBase = baseConfigs[baseChoice];

  const renderPowerResult = () => {
    const n = exponentVal;
    const absN = Math.abs(n);

    if (n === 0) {
      return {
        step: isEn
          ? 'Any non-zero real number to the 0th power equals 1'
          : 'Κάθε μη μηδενικός πραγματικός στη μηδενική ισούται με 1',
        valueNode: <span>1</span>,
        signLabel: isEn ? 'Positive (+)' : 'Θετικό (+)',
      };
    }

    if (baseChoice === '2' || baseChoice === '3') {
      const b = Number(baseChoice);
      const powVal = Math.pow(b, absN);
      return {
        step: n > 0 ? `${b} · `.repeat(n).slice(0, -3) : null,
        isNegExp: n < 0,
        negDen: `${b}^${absN}`,
        valueNode: n > 0 ? <span>{powVal}</span> : <Frac num="1" den={String(powVal)} />,
        signLabel: isEn ? 'Positive (+)' : 'Θετικό (+)',
      };
    }

    if (baseChoice === 'half') {
      const powVal = Math.pow(2, absN);
      return {
        isNegExp: n < 0,
        negDen: `(1/2)^${absN}`,
        valueNode: n > 0 ? <Frac num="1" den={String(powVal)} /> : <span>{powVal}</span>,
        signLabel: isEn ? 'Positive (+)' : 'Θετικό (+)',
      };
    }

    if (baseChoice === 'neg2') {
      const powVal = Math.pow(2, absN);
      const isEven = absN % 2 === 0;
      const signedVal = isEven ? powVal : -powVal;
      return {
        isNegExp: n < 0,
        negDen: `(-2)^${absN}`,
        valueNode:
          n > 0 ? (
            <span>{signedVal}</span>
          ) : isEven ? (
            <Frac num="1" den={String(powVal)} />
          ) : (
            <span>
              -<Frac num="1" den={String(powVal)} />
            </span>
          ),
        signLabel: isEven
          ? isEn
            ? 'Positive (+) — even exponent'
            : 'Θετικό (+) — άρτιος εκθέτης'
          : isEn
          ? 'Negative (-) — odd exponent'
          : 'Αρνητικό (-) — περιττός εκθέτης',
      };
    }

    // sqrt2
    const halfExp = Math.floor(absN / 2);
    const rem = absN % 2;
    const intPart = Math.pow(2, halfExp);
    const posDisplay =
      rem === 0 ? (
        <span>{intPart}</span>
      ) : intPart === 1 ? (
        <Radical>2</Radical>
      ) : (
        <span>
          {intPart}
          <Radical>2</Radical>
        </span>
      );

    return {
      isNegExp: n < 0,
      negDen: `(√2)^${absN}`,
      valueNode: n > 0 ? posDisplay : <Frac num="1" den={posDisplay} />,
      signLabel: isEn ? 'Positive (+)' : 'Θετικό (+)',
    };
  };

  const powerInfo = renderPowerResult();

  const pageTitle = isEn
    ? 'Chapter 6: Real Numbers & Integer Powers | 8th Grade'
    : "Κεφάλαιο 6: Πραγματικοί Αριθμοί & Δυνάμεις | Β' Γυμνασίου";

  // Κουμπιά πλοήγησης πάνω δεξιά (Ασκήσεις + Επιστροφή στη Β' Γυμνασίου όπως στην εικόνα)
  const actionButton = (
    <div className="flex items-center gap-2">
      <Link
        href="/b-gymnasiou/06-pragmatikoi-ask"
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-sm transition-colors"
      >
        <span aria-hidden="true">🎯</span>
        <span>{toCleanUppercase(isEn ? 'EXERCISES' : 'ΑΣΚΗΣΕΙΣ')}</span>
      </Link>
      <Link
        href="/b-gymnasiou"
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-colors"
      >
        <span aria-hidden="true">🔙</span>
        <span>{isEn ? '8th Grade' : "Β' Γυμνασίου"}</span>
      </Link>
    </div>
  );

  return (
    <Layout
      title={pageTitle}
      actionButton={actionButton}
      backUrl="/b-gymnasiou"
      backLabel={isEn ? '8th Grade' : "Β' Γυμνασίου"}
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] 8k:max-w-[5120px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 4k:px-24 8k:px-32 py-4 sm:py-6 pb-28 sm:pb-36 overflow-x-hidden text-slate-800 box-border">
        {/* 1. HERO BANNER */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white p-6 sm:p-8 lg:p-10 2xl:p-12 shadow-xl mb-8">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-indigo-100 text-xs sm:text-sm font-extrabold tracking-wider mb-4">
                <span>
                  {toCleanUppercase(
                    isEn ? 'CHAPTER 6 • 8TH GRADE' : "ΚΕΦΑΛΑΙΟ 6 • Β' ΓΥΜΝΑΣΙΟΥ"
                  )}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-3">
                {isEn
                  ? 'Real Numbers, Square Numbers & Powers with Integer Exponents'
                  : 'Πραγματικοί Αριθμοί, Τετράγωνοι Αριθμοί & Δυνάμεις με Ακέραιο Εκθέτη'}
              </h1>
              <p className="text-indigo-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                {isEn
                  ? 'Discover irrational numbers on the real number line, explore square numbers and square roots, and master powers with real bases and integer exponents.'
                  : 'Γνώρισε τους άρρητους αριθμούς και τη γεωμετρική τους τοποθέτηση στην ευθεία ℝ, μελέτησε τους τετράγωνους αριθμούς και κατανόησε τις δυνάμεις με πραγματική βάση και ακέραιο εκθέτη.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <Link
                href="/b-gymnasiou/06-pragmatikoi-ask"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm sm:text-base shadow-lg transition-all"
              >
                <span>
                  {toCleanUppercase(
                    isEn ? 'SOLVE 12 EXERCISES' : 'ΛΥΣΕ 12 ΑΣΚΗΣΕΙΣ'
                  )}
                </span>
                <span aria-hidden="true">→</span>
              </Link>
              <a
                href="#interactive-lab"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base border border-white/20 transition-all"
              >
                <span>
                  {toCleanUppercase(
                    isEn ? 'INTERACTIVE LAB' : 'ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ'
                  )}
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* 2. 4 MODULAR CARDS ΘΕΩΡΙΑΣ */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 mb-10">
          {/* ΚΑΡΤΑ 1: Πραγματικοί Αριθμοί (Ρητοί & Άρρητοι) */}
          <article className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-base shrink-0">
                  1
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  {isEn
                    ? 'Rational, Irrational & Real Numbers (ℝ)'
                    : 'Ρητοί, Άρρητοι & Πραγματικοί Αριθμοί (ℝ)'}
                </h2>
              </div>

              <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">
                {isEn ? (
                  <>
                    Every <strong>rational number (ℚ)</strong> can be written as a fraction{' '}
                    <Frac num="α" den="β" /> (with <span className="font-semibold">β ≠ 0</span>) and has a
                    terminating or repeating decimal expansion. Numbers with{' '}
                    <strong>infinite non-repeating decimals</strong> are called{' '}
                    <strong>irrational (𝕀)</strong>, such as <Radical>2</Radical>, <Radical>3</Radical>,
                    and <span className="font-semibold">π ≈ 3.14159...</span>
                  </>
                ) : (
                  <>
                    Κάθε <strong>ρητός αριθμός (ℚ)</strong> γράφεται ως κλάσμα <Frac num="α" den="β" />{' '}
                    (με <span className="font-semibold">β ≠ 0</span>) και έχει πεπερασμένη ή περιοδική
                    δεκαδική μορφή. Οι αριθμοί με{' '}
                    <strong>άπειρα μη περιοδικά δεκαδικά ψηφία</strong> ονομάζονται{' '}
                    <strong>άρρητοι (𝕀)</strong>, όπως οι <Radical>2</Radical>, <Radical>3</Radical>,{' '}
                    <span className="font-semibold">π ≈ 3,14159...</span>
                  </>
                )}
              </p>

              <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 mb-4 text-sm sm:text-base">
                <p className="font-bold text-indigo-950 mb-1">
                  {isEn
                    ? 'Set of Real Numbers: ℝ = ℚ ∪ 𝕀'
                    : 'Σύνολο Πραγματικών Αριθμών: ℝ = ℚ ∪ 𝕀'}
                </p>
                <p className="text-slate-700 text-xs sm:text-sm">
                  {isEn
                    ? 'Rational and irrational numbers together form the set ℝ. Every real number corresponds to a unique point on the number line.'
                    : 'Οι ρητοί μαζί με τους άρρητους αποτελούν το σύνολο ℝ. Κάθε πραγματικός αριθμός αντιστοιχεί σε ένα μοναδικό σημείο της ευθείας.'}
                </p>
              </div>
            </div>

            {/* Εποπτικό SVG Διάγραμμα Συνόλων N ⊂ Z ⊂ Q ⊂ R */}
            <div className="w-full overflow-hidden rounded-2xl bg-slate-50 border border-slate-200 p-3">
              <svg
                viewBox="0 0 460 190"
                className="w-full h-auto max-w-full block"
                role="img"
                aria-label="Venn diagram of Real Numbers R"
              >
                <rect x="8" y="8" width="444" height="174" rx="20" fill="#eef2ff" stroke="#4f46e5" strokeWidth="2.5" />
                <text x="24" y="34" fontSize="15" fontWeight="800" fill="#312e81">
                  ℝ ({isEn ? 'Real Numbers' : 'Πραγματικοί'})
                </text>

                <rect x="22" y="46" width="275" height="124" rx="16" fill="#ffffff" stroke="#0284c7" strokeWidth="2" />
                <text x="36" y="68" fontSize="14" fontWeight="800" fill="#0369a1">
                  ℚ: -3/4, 0,25, 1,(3)
                </text>

                <rect x="36" y="78" width="215" height="80" rx="14" fill="#f0f9ff" stroke="#0d9488" strokeWidth="2" />
                <text x="48" y="99" fontSize="13" fontWeight="800" fill="#0f766e">
                  ℤ: -5, -1, 0
                </text>

                <rect x="50" y="108" width="160" height="40" rx="10" fill="#ecfdf5" stroke="#059669" strokeWidth="2" />
                <text x="64" y="133" fontSize="13" fontWeight="800" fill="#047857">
                  ℕ: 0, 1, 2, 3, ...
                </text>

                <rect x="310" y="46" width="128" height="124" rx="16" fill="#fef3c7" stroke="#d97706" strokeWidth="2" strokeDasharray="5 3" />
                <text x="322" y="70" fontSize="13" fontWeight="800" fill="#92400e">
                  {isEn ? 'Irrational (𝕀)' : 'Άρρητοι (𝕀)'}
                </text>
                <text x="325" y="98" fontSize="14" fontWeight="700" fill="#78350f">
                  √2 ≈ 1,414...
                </text>
                <text x="325" y="122" fontSize="14" fontWeight="700" fill="#78350f">
                  √3 ≈ 1,732...
                </text>
                <text x="325" y="146" fontSize="14" fontWeight="700" fill="#78350f">
                  π ≈ 3,141...
                </text>
              </svg>
            </div>
          </article>

          {/* ΚΑΡΤΑ 2: Τετράγωνοι Αριθμοί & Τοποθέτηση Άρρητων στην Ευθεία */}
          <article className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-base shrink-0">
                  2
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  {isEn
                    ? 'Square Numbers & Locating Irrationals on ℝ'
                    : 'Τετράγωνοι Αριθμοί & Τοποθέτηση Άρρητων στην Ευθεία'}
                </h2>
              </div>

              <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-3">
                {isEn ? (
                  <>
                    <strong>Square numbers</strong> are natural numbers that are squares of integers:{' '}
                    <span className="font-semibold">1, 4, 9, 16, 25, 36, 49, 64, 81, 100...</span> Their
                    square roots are natural numbers (e.g. <Radical>25</Radical> = 5), whereas roots of
                    non-square positive numbers (like <Radical>2</Radical>, <Radical>5</Radical>) are{' '}
                    <strong>irrational</strong>.
                  </>
                ) : (
                  <>
                    <strong>Τετράγωνοι αριθμοί</strong> λέγονται οι φυσικοί αριθμοί που είναι τετράγωνα
                    ακεραίων: <span className="font-semibold">1, 4, 9, 16, 25, 36, 49, 64, 81, 100...</span>{' '}
                    Οι τετραγωνικές τους ρίζες είναι φυσικοί αριθμοί (π.χ. <Radical>25</Radical> = 5), ενώ
                    οι ρίζες θετικών μη τετράγωνων αριθμών (π.χ. <Radical>2</Radical>, <Radical>5</Radical>)
                    είναι <strong>άρρητοι</strong>.
                  </>
                )}
              </p>

              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4">
                {isEn ? (
                  <>
                    To locate <Radical>2</Radical> on the real axis, we construct a right triangle with
                    legs <span className="font-semibold">1</span> and <span className="font-semibold">1</span>.
                    By the Pythagorean Theorem, the hypotenuse is{' '}
                    <span className="font-semibold">
                      ρ = <Radical>1² + 1²</Radical> = <Radical>2</Radical>
                    </span>
                    . With a compass centered at O and radius <span className="font-semibold">ρ</span>, we
                    mark <Radical>2</Radical> on the line.
                  </>
                ) : (
                  <>
                    Για να τοποθετήσουμε τον <Radical>2</Radical> στον άξονα ℝ, κατασκευάζουμε ορθογώνιο
                    τρίγωνο με κάθετες <span className="font-semibold">1</span> και{' '}
                    <span className="font-semibold">1</span>. Από το Πυθαγόρειο Θεώρημα η υποτείνουσα είναι{' '}
                    <span className="font-semibold">
                      ρ = <Radical>1² + 1²</Radical> = <Radical>2</Radical>
                    </span>
                    . Με διαβήτη κέντρου Ο και ακτίνας <span className="font-semibold">ρ</span>, μεταφέρουμε
                    το μήκος πάνω στον άξονα.
                  </>
                )}
              </p>
            </div>

            {/* Εποπτικό SVG Κατασκευής √2 με ακτίνα ρ */}
            <div className="w-full overflow-hidden rounded-2xl bg-slate-50 border border-slate-200 p-3">
              <svg
                viewBox="0 0 460 190"
                className="w-full h-auto max-w-full block"
                role="img"
                aria-label="Geometric construction of square root of 2 on the number line"
              >
                <line x1="30" y1="150" x2="430" y2="150" stroke="#334155" strokeWidth="2.5" />
                <polygon points="430,150 420,145 420,155" fill="#334155" />
                <text x="435" y="155" fontSize="14" fontWeight="800" fill="#334155">ℝ</text>

                <circle cx="80" cy="150" r="4" fill="#0f172a" />
                <text x="75" y="172" fontSize="13" fontWeight="700" fill="#0f172a">0</text>

                <circle cx="200" cy="150" r="4" fill="#0f172a" />
                <text x="196" y="172" fontSize="13" fontWeight="700" fill="#0f172a">1</text>

                <circle cx="320" cy="150" r="4" fill="#0f172a" />
                <text x="316" y="172" fontSize="13" fontWeight="700" fill="#0f172a">2</text>

                <polygon points="80,150 200,150 200,30" fill="#d1fae5" fillOpacity="0.6" stroke="#059669" strokeWidth="2.5" />
                <polyline points="186,150 186,136 200,136" fill="none" stroke="#059669" strokeWidth="2" />

                <text x="135" y="143" fontSize="13" fontWeight="700" fill="#065f46">1</text>
                <text x="208" y="95" fontSize="13" fontWeight="700" fill="#065f46">1</text>
                <text x="108" y="82" fontSize="14" fontWeight="800" fill="#4f46e5">ρ = √2</text>

                <path
                  d="M 200 30 A 169.7 169.7 0 0 1 249.7 150"
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="2.2"
                  strokeDasharray="6 4"
                />
                <circle cx="249.7" cy="150" r="5" fill="#dc2626" />
                <text x="242" y="174" fontSize="14" fontWeight="800" fill="#dc2626">√2</text>
              </svg>
            </div>
          </article>

          {/* ΚΑΡΤΑ 3: Δύναμη με Βάση Πραγματικό & Εκθέτη Ακέραιο */}
          <article className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 rounded-xl bg-amber-600 text-white font-black flex items-center justify-center text-base shrink-0">
                  3
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  {isEn
                    ? 'Power with Real Base & Integer Exponent'
                    : 'Δύναμη με Βάση Πραγματικό & Εκθέτη Ακέραιο'}
                </h2>
              </div>

              <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">
                {isEn
                  ? 'Let α ∈ ℝ* (non-zero real number) and ν ∈ ℕ* (positive integer). We extend the definition of powers to all integers:'
                  : 'Έστω α ∈ ℝ* (μη μηδενικός πραγματικός αριθμός) και ν ∈ ℕ* (θετικός ακέραιος). Ορίζουμε τη δύναμη για κάθε ακέραιο εκθέτη:'}
              </p>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-slate-800 text-sm sm:text-base">
                    {isEn ? '1. Positive exponent (ν > 0):' : '1. Θετικός εκθέτης (ν > 0):'}
                  </span>
                  <span className="font-mono font-bold text-indigo-700 text-sm sm:text-base">
                    α<sup>ν</sup> = α · α · ... · α ({isEn ? 'ν factors' : 'ν παράγοντες'})
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-slate-800 text-sm sm:text-base">
                    {isEn ? '2. Zero exponent (α ≠ 0):' : '2. Μηδενικός εκθέτης (α ≠ 0):'}
                  </span>
                  <span className="font-mono font-bold text-emerald-700 text-base sm:text-lg">
                    α<sup>0</sup> = 1
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-amber-950 text-sm sm:text-base">
                    {isEn ? '3. Negative exponent (α ≠ 0):' : '3. Αρνητικός εκθέτης (α ≠ 0):'}
                  </span>
                  <span className="font-bold text-amber-900 text-base sm:text-lg inline-flex items-center">
                    α<sup>-ν</sup> = <Frac num="1" den={<span>α<sup>ν</sup></span>} />
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-xs sm:text-sm text-slate-600 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-bold text-slate-800">
                {isEn ? 'Special Case (Fraction):' : 'Ειδική περίπτωση κλάσματος:'}
              </span>
              <span className="inline-flex items-center font-semibold text-slate-900">
                (<Frac num="α" den="β" />)<sup>-ν</sup> = (<Frac num="β" den="α" />)<sup>ν</sup>
              </span>
              <span>(α, β ≠ 0)</span>
            </div>
          </article>

          {/* ΚΑΡΤΑ 4: Ιδιότητες Δυνάμεων με Ακέραιο Εκθέτη */}
          <article className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 rounded-xl bg-purple-600 text-white font-black flex items-center justify-center text-base shrink-0">
                  4
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  {isEn
                    ? 'Properties of Powers (α, β ∈ ℝ*, μ, ν ∈ ℤ)'
                    : 'Ιδιότητες Δυνάμεων (α, β ∈ ℝ*, μ, ν ∈ ℤ)'}
                </h2>
              </div>

              <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">
                {isEn
                  ? 'All five classic laws of exponents hold identically for real bases (α, β ≠ 0) and any integer exponents (μ, ν ∈ ℤ):'
                  : 'Όλες οι ιδιότητες των δυνάμεων ισχύουν απαράλλαχτες για μη μηδενικές πραγματικές βάσεις (α, β ≠ 0) και οποιουσδήποτε ακέραιους εκθέτες (μ, ν ∈ ℤ):'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm sm:text-base">
                <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-100">
                  <div className="text-xs font-bold text-purple-800 mb-1">
                    {isEn ? 'Product of same base' : 'Γινόμενο ίδιων βάσεων'}
                  </div>
                  <div className="font-bold text-slate-900">
                    α<sup>μ</sup> · α<sup>ν</sup> = α<sup>μ + ν</sup>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-100">
                  <div className="text-xs font-bold text-purple-800 mb-1">
                    {isEn ? 'Quotient of same base' : 'Πηλίκο ίδιων βάσεων'}
                  </div>
                  <div className="font-bold text-slate-900 inline-flex items-center">
                    <Frac num={<span>α<sup>μ</sup></span>} den={<span>α<sup>ν</sup></span>} /> = α<sup>μ - ν</sup>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-100">
                  <div className="text-xs font-bold text-purple-800 mb-1">
                    {isEn ? 'Power of a power' : 'Δύναμη δύναμης'}
                  </div>
                  <div className="font-bold text-slate-900">
                    (α<sup>μ</sup>)<sup>ν</sup> = α<sup>μ · ν</sup>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-100">
                  <div className="text-xs font-bold text-purple-800 mb-1">
                    {isEn ? 'Power of product / quotient' : 'Δύναμη γινομένου / πηλίκου'}
                  </div>
                  <div className="font-bold text-slate-900 flex flex-wrap items-center gap-x-2">
                    <span>(α · β)<sup>ν</sup> = α<sup>ν</sup> · β<sup>ν</sup></span>
                    <span>|</span>
                    <span className="inline-flex items-center">
                      (<Frac num="α" den="β" />)<sup>ν</sup> = <Frac num={<span>α<sup>ν</sup></span>} den={<span>β<sup>ν</sup></span>} />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-xs sm:text-sm text-slate-600">
              {isEn ? (
                <>
                  <strong>Sign Rule:</strong> If α &gt; 0, then α<sup>ν</sup> &gt; 0 always. If α &lt; 0,
                  then α<sup>ν</sup> &gt; 0 when ν is even and α<sup>ν</sup> &lt; 0 when ν is odd.
                </>
              ) : (
                <>
                  <strong>Πρόσημο δύναμης:</strong> Αν α &gt; 0, τότε α<sup>ν</sup> &gt; 0 για κάθε ν ∈ ℤ.
                  Αν α &lt; 0, τότε α<sup>ν</sup> &gt; 0 για ν άρτιο και α<sup>ν</sup> &lt; 0 για ν περιττό.
                </>
              )}
            </div>
          </article>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ (INTERACTIVE LAB) */}
        <section
          id="interactive-lab"
          className="bg-white rounded-3xl border-2 border-indigo-200 shadow-lg p-5 sm:p-8 mb-10"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-extrabold tracking-wide mb-2">
                {toCleanUppercase(
                  isEn ? 'INTERACTIVE EXPLORATION LAB' : 'ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΕΞΕΡΕΥΝΗΣΗΣ'
                )}
              </span>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900">
                {isEn
                  ? 'Visualize Irrational Numbers & Integer Powers'
                  : 'Οπτικοποίηση Άρρητων Αριθμών & Δυνάμεων'}
              </h2>
            </div>

            <div className="flex flex-wrap gap-2 bg-slate-100 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => setActiveLabTab('irrational')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                  activeLabTab === 'irrational'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-700 hover:bg-white/70'
                }`}
              >
                {isEn ? '1. Irrationals on ℝ' : '1. Άρρητοι στην Ευθεία ℝ'}
              </button>
              <button
                type="button"
                onClick={() => setActiveLabTab('powers')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                  activeLabTab === 'powers'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-700 hover:bg-white/70'
                }`}
              >
                {isEn ? '2. Powers α^ν Explorer' : '2. Εξερευνητής Δυνάμεων α^ν'}
              </button>
            </div>
          </div>

          {activeLabTab === 'irrational' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pt-6 items-center">
              <div className="lg:col-span-5 space-y-5 min-w-0">
                <div>
                  <label className="block text-sm font-extrabold text-slate-800 mb-2">
                    {isEn
                      ? 'Select irrational number to construct:'
                      : 'Επίλεξε άρρητο αριθμό προς κατασκευή:'}
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['sqrt2', 'sqrt3', 'sqrt5', 'sqrt8']).map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setSelectedRoot(key);
                          setCompassProgress(75);
                        }}
                        className={`py-2.5 px-2 rounded-xl font-black text-sm sm:text-base border-2 transition-all ${
                          selectedRoot === key
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-800 shadow-sm'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300'
                        }`}
                      >
                        <Radical>{rootConfigs[key].label}</Radical>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm font-bold text-slate-700 mb-1">
                    <span>
                      {isEn
                        ? 'Compass rotation progress (radius ρ):'
                        : 'Περιστροφή διαβήτη (ακτίνα ρ):'}
                    </span>
                    <span className="text-indigo-700 font-black">{compassProgress}%</span>
                  </div>
                  <CustomSlider
                    min={0}
                    max={100}
                    step={1}
                    value={compassProgress}
                    onChange={setCompassProgress}
                    accentColor="indigo"
                    ariaLabel="Compass rotation progress"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>0% ({isEn ? 'Triangle' : 'Τρίγωνο'})</span>
                    <span>100% ({isEn ? 'On axis ℝ' : 'Πάνω στον ℝ'})</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 space-y-1.5">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-indigo-700">
                    {isEn ? 'Pythagorean Construction' : 'Πυθαγόρεια Κατασκευή'}
                  </div>
                  <p className="text-sm text-slate-800 font-medium">
                    {isEn ? currentRoot.descEn : currentRoot.descEl}
                  </p>
                  <p className="text-base font-black text-indigo-950">
                    {isEn ? currentRoot.formulaEn : currentRoot.formulaEl}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-700">
                    {isEn ? 'Decimal approximation:' : 'Δεκαδική προσέγγιση:'}{' '}
                    <span className="font-bold text-emerald-700">
                      <Radical>{currentRoot.label}</Radical> ≈{' '}
                      {isEn ? currentRoot.approxEn : currentRoot.approx}
                    </span>
                  </p>
                </div>
              </div>

              <div className="lg:col-span-7 min-w-0">
                <div className="w-full overflow-hidden rounded-2xl bg-slate-50 border border-slate-200 p-3 sm:p-4">
                  <svg
                    viewBox="0 0 560 310"
                    className="w-full h-auto max-w-full block"
                    role="img"
                    aria-label="Interactive compass construction on real number line"
                  >
                    {[0, 1, 2, 3].map((unit) => {
                      const gx = originX + unit * unitPx;
                      return (
                        <g key={unit}>
                          <line
                            x1={gx}
                            y1="25"
                            x2={gx}
                            y2="255"
                            stroke="#e2e8f0"
                            strokeWidth="1.5"
                            strokeDasharray="4 4"
                          />
                          <circle cx={gx} cy={originY} r="4.5" fill="#0f172a" />
                          <text
                            x={gx - 4}
                            y={originY + 24}
                            fontSize="14"
                            fontWeight="800"
                            fill="#0f172a"
                          >
                            {unit}
                          </text>
                        </g>
                      );
                    })}

                    <line
                      x1="35"
                      y1={originY}
                      x2="525"
                      y2={originY}
                      stroke="#1e293b"
                      strokeWidth="3"
                    />
                    <polygon
                      points={`525,${originY} 513,${originY - 6} 513,${originY + 6}`}
                      fill="#1e293b"
                    />
                    <text
                      x="532"
                      y={originY + 5}
                      fontSize="16"
                      fontWeight="900"
                      fill="#1e293b"
                    >
                      ℝ
                    </text>

                    <polygon
                      points={`${originX},${originY} ${pointAX},${pointAY} ${pointBX},${pointBY}`}
                      fill="#c7d2fe"
                      fillOpacity="0.55"
                      stroke="#4338ca"
                      strokeWidth="2.5"
                    />

                    <polyline
                      points={`${pointAX - 14},${pointAY} ${pointAX - 14},${pointAY - 14} ${pointAX},${pointAY - 14}`}
                      fill="none"
                      stroke="#4338ca"
                      strokeWidth="2"
                    />

                    <text
                      x={(originX + pointAX) / 2 - 12}
                      y={originY + 42}
                      fontSize="13"
                      fontWeight="800"
                      fill="#3730a3"
                    >
                      {selectedRoot === 'sqrt3' ? '√2' : currentRoot.legA}
                    </text>
                    <text
                      x={pointAX + 10}
                      y={(pointAY + pointBY) / 2 + 4}
                      fontSize="13"
                      fontWeight="800"
                      fill="#3730a3"
                    >
                      {currentRoot.legB}
                    </text>

                    {compassProgress > 0 && (
                      <path
                        d={`M ${pointBX} ${pointBY} A ${radiusPx} ${radiusPx} 0 0 1 ${tipX} ${tipY}`}
                        fill="none"
                        stroke="#059669"
                        strokeWidth="2.8"
                        strokeDasharray="6 4"
                      />
                    )}

                    <line
                      x1={originX}
                      y1={originY}
                      x2={tipX}
                      y2={tipY}
                      stroke="#059669"
                      strokeWidth="3"
                    />
                    <circle cx={originX} cy={originY} r="5" fill="#059669" />
                    <circle cx={tipX} cy={tipY} r="6" fill="#dc2626" />

                    <text
                      x={(originX + tipX) / 2 - 22}
                      y={(originY + tipY) / 2 - 12}
                      fontSize="14"
                      fontWeight="900"
                      fill="#047857"
                    >
                      ρ = √{currentRoot.label}
                    </text>

                    {compassProgress >= 95 && (
                      <g>
                        <circle cx={landedX} cy={originY} r="6.5" fill="#dc2626" />
                        <rect
                          x={landedX - 24}
                          y={originY + 32}
                          width="48"
                          height="24"
                          rx="6"
                          fill="#fee2e2"
                          stroke="#dc2626"
                          strokeWidth="1.5"
                        />
                        <text
                          x={landedX - 14}
                          y={originY + 49}
                          fontSize="14"
                          fontWeight="900"
                          fill="#b91c1c"
                        >
                          √{currentRoot.label}
                        </text>
                      </g>
                    )}
                  </svg>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pt-6 items-center">
              <div className="lg:col-span-5 space-y-5 min-w-0">
                <div>
                  <label className="block text-sm font-extrabold text-slate-800 mb-2">
                    {isEn ? '1. Choose real base α:' : '1. Επίλεξε πραγματική βάση α:'}
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { id: '2', node: '2' },
                      { id: '3', node: '3' },
                      { id: 'half', node: <Frac num="1" den="2" /> },
                      { id: 'neg2', node: '-2' },
                      { id: 'sqrt2', node: <Radical>2</Radical> },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setBaseChoice(item.id)}
                        className={`py-2 px-1 rounded-xl font-black text-sm border-2 flex items-center justify-center transition-all ${
                          baseChoice === item.id
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-800 shadow-sm'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300'
                        }`}
                      >
                        {item.node}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm font-bold text-slate-700 mb-1">
                    <span>
                      {isEn ? '2. Integer exponent ν:' : '2. Ακέραιος εκθέτης ν:'}
                    </span>
                    <span className="text-indigo-700 font-black text-base">
                      ν = {exponentVal}
                    </span>
                  </div>
                  <CustomSlider
                    min={-4}
                    max={4}
                    step={1}
                    value={exponentVal}
                    onChange={setExponentVal}
                    accentColor="emerald"
                    ariaLabel="Integer exponent slider"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>-4</span>
                    <span>-2</span>
                    <span>0</span>
                    <span>+2</span>
                    <span>+4</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 min-w-0">
                <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 sm:p-8 shadow-md space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/15 pb-4">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-300">
                      {isEn ? 'Step-by-step evaluation' : 'Βήμα προς βήμα υπολογισμός'}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-emerald-300">
                      {powerInfo.signLabel}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xl sm:text-3xl font-black">
                    <span className="inline-flex items-center">
                      ({baseChoice === 'half' ? (
                        <Frac num="1" den="2" />
                      ) : baseChoice === 'sqrt2' ? (
                        <Radical>2</Radical>
                      ) : (
                        currentBase.label
                      )})<sup>{exponentVal}</sup>
                    </span>

                    <span className="text-indigo-300">=</span>

                    {powerInfo.isNegExp && (
                      <>
                        <Frac
                          num="1"
                          den={
                            <span>
                              ({baseChoice === 'half' ? (
                                <Frac num="1" den="2" />
                              ) : baseChoice === 'sqrt2' ? (
                                <Radical>2</Radical>
                              ) : (
                                currentBase.label
                              )})<sup>{Math.abs(exponentVal)}</sup>
                            </span>
                          }
                        />
                        <span className="text-indigo-300">=</span>
                      </>
                    )}

                    <span className="px-4 py-2 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 inline-flex items-center">
                      {powerInfo.valueNode}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
                    {exponentVal < 0
                      ? isEn
                        ? 'Negative exponent rule: we invert the base (1 / α^|ν|) and turn the exponent positive.'
                        : 'Κανόνας αρνητικού εκθέτη: αντιστρέφουμε τη βάση (1 / α^|ν|) και ο εκθέτης γίνεται θετικός.'
                      : exponentVal === 0
                      ? isEn
                        ? 'Zero exponent rule: any non-zero real number raised to 0 equals 1.'
                        : 'Κανόνας μηδενικού εκθέτη: κάθε μη μηδενικός πραγματικός υψωμένος στη 0 ισούται με 1.'
                      : isEn
                      ? 'Positive exponent rule: multiply the base by itself ν times.'
                      : 'Κανόνας θετικού εκθέτη: πολλαπλασιάζουμε τη βάση με τον εαυτό της ν φορές.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 4. 2 ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ ΕΦΑΡΜΟΓΗΣ */}
        <section className="space-y-8 mb-10">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900">
              {isEn
                ? 'Solved Application Problems'
                : 'Λυμένα Προβλήματα Εφαρμογής'}
            </h2>
          </div>

          {/* ΠΡΟΒΛΗΜΑ 1 */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-extrabold mb-3">
              <span>{toCleanUppercase(isEn ? 'PROBLEM 1' : 'ΠΡΟΒΛΗΜΑ 1')}</span>
            </div>
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 mb-5 leading-relaxed">
              {isEn ? (
                <>
                  A square garden has an area of <span className="text-indigo-700">18 m²</span>. Find the
                  exact length of its side <span className="font-semibold">α</span>, determine whether it
                  is a rational or irrational number, and show between which two consecutive integers it
                  lies.
                </>
              ) : (
                <>
                  Ένας τετράγωνος κήπος έχει εμβαδόν <span className="text-indigo-700">18 m²</span>. Να
                  βρείτε το ακριβές μήκος της πλευράς του <span className="font-semibold">α</span>, να
                  εξετάσετε αν είναι ρητός ή άρρητος αριθμός και να προσδιορίσετε ανάμεσα σε ποιους δύο
                  διαδοχικούς ακέραιους αριθμούς βρίσκεται.
                </>
              )}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-5 min-w-0">
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3">
                  <svg
                    viewBox="0 0 360 220"
                    className="w-full h-auto max-w-full block"
                    role="img"
                    aria-label="Square garden of area 18 and number line bounds"
                  >
                    <rect
                      x="30"
                      y="25"
                      width="115"
                      height="115"
                      fill="#d1fae5"
                      stroke="#059669"
                      strokeWidth="2.5"
                    />
                    <text x="58" y="88" fontSize="14" fontWeight="800" fill="#065f46">
                      Ε = 18 m²
                    </text>
                    <text x="65" y="158" fontSize="13" fontWeight="800" fill="#0f172a">
                      α = √18
                    </text>

                    <line x1="175" y1="115" x2="345" y2="115" stroke="#334155" strokeWidth="2.5" />
                    <polygon points="345,115 336,110 336,120" fill="#334155" />

                    <circle cx="205" cy="115" r="4.5" fill="#0f172a" />
                    <text x="188" y="138" fontSize="12" fontWeight="700" fill="#0f172a">
                      4 (√16)
                    </text>

                    <circle cx="315" cy="115" r="4.5" fill="#0f172a" />
                    <text x="298" y="138" fontSize="12" fontWeight="700" fill="#0f172a">
                      5 (√25)
                    </text>

                    <circle cx="230" cy="115" r="6" fill="#dc2626" />
                    <text x="215" y="96" fontSize="13" fontWeight="900" fill="#dc2626">
                      √18 ≈ 4,24
                    </text>
                  </svg>
                </div>
              </div>

              <div className="md:col-span-7 min-w-0 space-y-4">
                <div className="hidden sm:block overflow-hidden rounded-2xl border border-slate-200">
                  <table className="w-full table-fixed text-sm text-left">
                    <thead className="bg-slate-100 text-slate-800 font-extrabold">
                      <tr>
                        <th className="w-1/3 px-4 py-3">{isEn ? 'Step' : 'Βήμα'}</th>
                        <th className="w-2/3 px-4 py-3">{isEn ? 'Analysis' : 'Ανάλυση'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="px-4 py-3 font-bold text-slate-800">
                          {isEn ? '1. Side length' : '1. Μήκος πλευράς'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                            <span>Ε = α² = 18 ⇒ α =</span>
                            <Radical>18</Radical>
                            <span>=</span>
                            <Radical>9 · 2</Radical>
                            <span>= 3</span>
                            <Radical>2</Radical>
                            <span>m</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-bold text-slate-800">
                          {isEn ? '2. Classification' : '2. Χαρακτηρισμός'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                            <span>
                              {isEn
                                ? 'Since 18 is not a square number,'
                                : 'Επειδή το 18 δεν είναι τετράγωνος αριθμός, ο'}
                            </span>
                            <Radical>18</Radical>
                            <span>
                              {isEn ? 'is an irrational number (𝕀).' : 'είναι άρρητος αριθμός (𝕀).'}
                            </span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-bold text-slate-800">
                          {isEn ? '3. Integer bounds' : '3. Φράγματα ακεραίων'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                            <span>16 &lt; 18 &lt; 25 ⇒</span>
                            <Radical>16</Radical>
                            <span>&lt;</span>
                            <Radical>18</Radical>
                            <span>&lt;</span>
                            <Radical>25</Radical>
                            <span>⇒ 4 &lt;</span>
                            <Radical>18</Radical>
                            <span>&lt; 5</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="sm:hidden space-y-2.5">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm">
                    <div className="font-extrabold text-indigo-800 mb-1">
                      {isEn ? '1. Side length' : '1. Μήκος πλευράς'}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                      <span>Ε = α² = 18 ⇒ α =</span>
                      <Radical>18</Radical>
                      <span>= 3</span>
                      <Radical>2</Radical>
                      <span>m</span>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm">
                    <div className="font-extrabold text-indigo-800 mb-1">
                      {isEn ? '2. Classification' : '2. Χαρακτηρισμός'}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                      <span>
                        {isEn ? '18 is not a square number ⇒' : 'Το 18 δεν είναι τετράγωνος ⇒'}
                      </span>
                      <Radical>18</Radical>
                      <span>∈ 𝕀 ({isEn ? 'irrational' : 'άρρητος'})</span>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm">
                    <div className="font-extrabold text-indigo-800 mb-1">
                      {isEn ? '3. Integer bounds' : '3. Φράγματα ακεραίων'}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                      <span>16 &lt; 18 &lt; 25 ⇒ 4 &lt;</span>
                      <Radical>18</Radical>
                      <span>&lt; 5</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-bold text-sm sm:text-base flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span>{isEn ? 'Final Answer:' : 'Τελική Απάντηση:'}</span>
                  <span>α = 3</span>
                  <Radical>2</Radical>
                  <span>
                    m ({isEn ? 'irrational, between 4 and 5' : 'άρρητος, ανάμεσα στο 4 και το 5'})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ΠΡΟΒΛΗΜΑ 2 */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold mb-3">
              <span>{toCleanUppercase(isEn ? 'PROBLEM 2' : 'ΠΡΟΒΛΗΜΑ 2')}</span>
            </div>
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 mb-5 leading-relaxed flex flex-wrap items-center gap-x-1.5 gap-y-1">
              <span>
                {isEn
                  ? 'Simplify and calculate the value of the expression:'
                  : 'Να απλοποιήσετε και να υπολογίσετε την τιμή της παράστασης:'}
              </span>
              <span className="inline-flex items-center font-black text-indigo-700">
                Α = <Frac num={<span>3<sup>-2</sup> · (3<sup>4</sup>)<sup>2</sup></span>} den={<span>3<sup>5</sup></span>} /> + (<Frac num="1" den="2" />)<sup>-3</sup>
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-5 min-w-0">
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3">
                  <svg
                    viewBox="0 0 360 210"
                    className="w-full h-auto max-w-full block"
                    role="img"
                    aria-label="Exponent laws flowchart for Problem 2"
                  >
                    <rect x="15" y="15" width="330" height="50" rx="12" fill="#eef2ff" stroke="#4f46e5" strokeWidth="2" />
                    <text x="30" y="45" fontSize="13" fontWeight="800" fill="#312e81">
                      1) (3⁴)² = 3⁴·² = 3⁸
                    </text>

                    <line x1="180" y1="65" x2="180" y2="85" stroke="#64748b" strokeWidth="2" />
                    <polygon points="180,85 175,77 185,77" fill="#64748b" />

                    <rect x="15" y="85" width="330" height="50" rx="12" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
                    <text x="30" y="115" fontSize="13" fontWeight="800" fill="#92400e">
                      2) 3⁻² · 3⁸ / 3⁵ = 3⁻²⁺⁸⁻⁵ = 3¹ = 3
                    </text>

                    <line x1="180" y1="135" x2="180" y2="152" stroke="#64748b" strokeWidth="2" />
                    <polygon points="180,152 175,144 185,144" fill="#64748b" />

                    <rect x="15" y="152" width="330" height="45" rx="12" fill="#d1fae5" stroke="#059669" strokeWidth="2" />
                    <text x="30" y="180" fontSize="13" fontWeight="800" fill="#065f46">
                      3) (1/2)⁻³ = 2³ = 8 ⇒ Α = 3 + 8 = 11
                    </text>
                  </svg>
                </div>
              </div>

              <div className="md:col-span-7 min-w-0 space-y-4">
                <div className="hidden sm:block overflow-hidden rounded-2xl border border-slate-200">
                  <table className="w-full table-fixed text-sm text-left">
                    <thead className="bg-slate-100 text-slate-800 font-extrabold">
                      <tr>
                        <th className="w-1/3 px-4 py-3">{isEn ? 'Step' : 'Βήμα'}</th>
                        <th className="w-2/3 px-4 py-3">{isEn ? 'Analysis' : 'Ανάλυση'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="px-4 py-3 font-bold text-slate-800">
                          {isEn ? '1. Power of a power' : '1. Δύναμη δύναμης'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                            <span>(3<sup>4</sup>)<sup>2</sup> = 3<sup>4 · 2</sup> = 3<sup>8</sup></span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-bold text-slate-800">
                          {isEn ? '2. Same-base fraction' : '2. Κλάσμα ίδιων βάσεων'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                            <Frac num={<span>3<sup>-2</sup> · 3<sup>8</sup></span>} den={<span>3<sup>5</sup></span>} />
                            <span>=</span>
                            <Frac num={<span>3<sup>-2 + 8</sup></span>} den={<span>3<sup>5</sup></span>} />
                            <span>=</span>
                            <Frac num={<span>3<sup>6</sup></span>} den={<span>3<sup>5</sup></span>} />
                            <span>= 3<sup>6 - 5</sup> = 3<sup>1</sup> = 3</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-bold text-slate-800">
                          {isEn ? '3. Negative fraction power' : '3. Αρνητικός εκθέτης κλάσματος'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                            <span>(<Frac num="1" den="2" />)<sup>-3</sup> = (<Frac num="2" den="1" />)<sup>3</sup> = 2<sup>3</sup> = 8</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="sm:hidden space-y-2.5">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm">
                    <div className="font-extrabold text-amber-800 mb-1">
                      {isEn ? '1. Power of a power' : '1. Δύναμη δύναμης'}
                    </div>
                    <div>(3<sup>4</sup>)<sup>2</sup> = 3<sup>8</sup></div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm">
                    <div className="font-extrabold text-amber-800 mb-1">
                      {isEn ? '2. Same-base fraction' : '2. Κλάσμα ίδιων βάσεων'}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                      <Frac num={<span>3<sup>-2</sup> · 3<sup>8</sup></span>} den={<span>3<sup>5</sup></span>} />
                      <span>= 3<sup>6 - 5</sup> = 3</span>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm">
                    <div className="font-extrabold text-amber-800 mb-1">
                      {isEn ? '3. Negative exponent' : '3. Αρνητικός εκθέτης'}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                      <span>(<Frac num="1" den="2" />)<sup>-3</sup> = 2<sup>3</sup> = 8</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-bold text-sm sm:text-base">
                  {isEn ? 'Final Answer: Α = 3 + 8 = 11' : 'Τελική Απάντηση: Α = 3 + 8 = 11'}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. YELLOW ALERT BOX: ΚΛΑΣΙΚΑ ΛΑΘΗ ΜΑΘΗΤΩΝ */}
        <section className="rounded-3xl bg-amber-50 border-2 border-amber-300 p-5 sm:p-8 mb-10 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-10 rounded-2xl bg-amber-500 text-white font-black flex items-center justify-center text-xl shrink-0">
              !
            </span>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-amber-950">
              {isEn
                ? 'Watch Out! Classic Student Mistakes'
                : 'Προσοχή! Τα 4 πιο Κλασικά Λάθη των Μαθητών'}
            </h2>
          </div>

          <ul className="space-y-3 text-sm sm:text-base text-amber-950">
            <li className="flex items-start gap-2.5">
              <span className="font-black text-amber-600 mt-0.5">✕</span>
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                <span>
                  {isEn
                    ? 'Thinking that a negative exponent makes the number negative:'
                    : 'Να νομίζουμε ότι ο αρνητικός εκθέτης κάνει τον αριθμό αρνητικό:'}
                </span>
                <span className="font-bold text-red-700 line-through">2<sup>-3</sup> = -8</span>
                <span>→</span>
                <span className="font-bold text-emerald-800 inline-flex items-center">
                  {isEn ? 'Correct:' : 'Σωστό:'} 2<sup>-3</sup> = <Frac num="1" den={<span>2<sup>3</sup></span>} /> = <Frac num="1" den="8" />
                </span>
              </div>
            </li>

            <li className="flex items-start gap-2.5">
              <span className="font-black text-amber-600 mt-0.5">✕</span>
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                <span>
                  {isEn
                    ? 'Forgetting parentheses with negative bases:'
                    : 'Να ξεχνάμε τις παρενθέσεις στις αρνητικές βάσεις:'}
                </span>
                <span className="font-bold text-slate-900">-3<sup>2</sup> = -9</span>
                <span>{isEn ? 'while' : 'ενώ'}</span>
                <span className="font-bold text-emerald-800">(-3)<sup>2</sup> = +9</span>.
              </div>
            </li>

            <li className="flex items-start gap-2.5">
              <span className="font-black text-amber-600 mt-0.5">✕</span>
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                <span>
                  {isEn
                    ? 'Distributing a square root over addition:'
                    : 'Να «σπάμε» τη ρίζα σε άθροισμα:'}
                </span>
                <span className="font-bold text-red-700 line-through inline-flex items-center">
                  <Radical>9 + 16</Radical> = <Radical>9</Radical> + <Radical>16</Radical> = 7
                </span>
                <span>→</span>
                <span className="font-bold text-emerald-800 inline-flex items-center">
                  {isEn ? 'Correct:' : 'Σωστό:'} <Radical>9 + 16</Radical> = <Radical>25</Radical> = 5
                </span>
              </div>
            </li>

            <li className="flex items-start gap-2.5">
              <span className="font-black text-amber-600 mt-0.5">✕</span>
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                <span>
                  {isEn
                    ? 'Multiplying exponents instead of adding them when multiplying same-base powers:'
                    : 'Να πολλαπλασιάζουμε τους εκθέτες αντί να τους προσθέτουμε:'}
                </span>
                <span className="font-bold text-red-700 line-through">α<sup>2</sup> · α<sup>3</sup> = α<sup>6</sup></span>
                <span>→</span>
                <span className="font-bold text-emerald-800">
                  {isEn ? 'Correct:' : 'Σωστό:'} α<sup>2</sup> · α<sup>3</sup> = α<sup>2 + 3</sup> = α<sup>5</sup>
                </span>
              </div>
            </li>
          </ul>
        </section>

        {/* 6. BOTTOM CALLOUT BANNER */}
        <section className="rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 lg:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black mb-2">
              {isEn
                ? 'Ready to test your knowledge on Real Numbers & Powers?'
                : 'Έτοιμος να δοκιμάσεις τις γνώσεις σου στους Πραγματικούς & τις Δυνάμεις;'}
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base">
              {isEn
                ? 'Solve 12 dynamically generated exercises with instant step-by-step feedback and diagrams.'
                : 'Λύσε 12 δυναμικά παραγόμενες ασκήσεις με άμεση διόρθωση, πίνακες βημάτων και επεξηγηματικά σχήματα.'}
            </p>
          </div>

          <Link
            href="/b-gymnasiou/06-pragmatikoi-ask"
            className="shrink-0 inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-white text-emerald-900 hover:bg-emerald-50 font-black text-sm sm:text-base shadow-md transition-all"
          >
            <span>
              {toCleanUppercase(isEn ? 'START EXERCISES' : 'ΞΕΚΙΝΑ ΤΙΣ ΑΣΚΗΣΕΙΣ')}
            </span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>
      </div>
    </Layout>
  );
}
