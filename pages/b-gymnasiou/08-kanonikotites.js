import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// --- Βοηθητική Συνάρτηση για Άτονα Κεφαλαία (διατηρεί το Β') ---
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

// --- Custom Μαθηματικά Components ---
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

function Frac({ num, den, className = '' }) {
  return (
    <span
      className={`inline-flex flex-col text-center align-middle mx-0.5 sm:mx-1 font-mono text-[0.88em] leading-none shrink-0 max-w-full ${className}`}
    >
      <span className="border-b border-current px-1 pb-0.5 whitespace-nowrap font-semibold">
        {num}
      </span>
      <span className="px-1 pt-0.5 whitespace-nowrap font-semibold">
        {den}
      </span>
    </span>
  );
}

function Radical({ children, className = '' }) {
  return (
    <span
      className={`inline-flex items-stretch align-middle font-mono shrink-0 select-none mx-0.5 ${className}`}
    >
      <svg
        viewBox="0 0 14 24"
        className="w-[0.6em] self-stretch shrink-0 text-current overflow-visible"
        preserveAspectRatio="none"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        aria-hidden="true"
      >
        <path d="M 1 13.5 L 4 13.5 L 7.5 22.8 L 13.6 0.8" />
      </svg>
      <span className="border-t-[1.9px] border-current pl-0.5 pr-1 pt-0.5 pb-[1px] leading-none inline-flex items-center text-[0.95em] font-semibold">
        {children}
      </span>
    </span>
  );
}

function Pow({ base, exp, parens = false, className = '' }) {
  return (
    <span className={`inline-flex items-baseline font-mono leading-none mx-[1px] ${className}`}>
      {parens ? (
        <span className="inline-flex items-center">
          <span>(</span>
          {base}
          <span>)</span>
        </span>
      ) : (
        <span>{base}</span>
      )}
      <sup className="text-[0.72em] font-bold leading-none ml-[1px] -top-[0.45em] relative">
        {exp}
      </sup>
    </span>
  );
}

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

export default function KanonikotitesTheoryPage() {
  const router = useRouter();
  const isEn = router?.locale === 'en';
  const locCode = isEn ? 'en-US' : 'el-GR';

  // --- State Διαδραστικού Εργαστηρίου ---
  const [activeLabTab, setActiveLabTab] = useState('linear'); // 'linear' | 'squares'

  // Tab 1: Γραμμική κανονικότητα y = α * ν + β
  const [alphaVal, setAlphaVal] = useState(2); // -4 to 5 (step 0.5)
  const [betaVal, setBetaVal] = useState(1); // -5 to 6 (step 0.5)

  // Tab 2: Τετράγωνοι αριθμοί y = ν²
  const [squareN, setSquareN] = useState(4); // 1 to 8

  const formatNum = (val) => {
    const clean = Number(val.toFixed(2));
    return clean.toLocaleString(locCode);
  };

  // Υπολογισμός όρων γραμμικής κανονικότητας για ν = 1..5 και ν = 10
  const linearTerms = [1, 2, 3, 4, 5].map((n) => ({
    n,
    y: Number((alphaVal * n + betaVal).toFixed(2)),
  }));
  const tenthTerm = Number((alphaVal * 10 + betaVal).toFixed(2));

  // Διαμόρφωση τύπου y = α * ν + β
  const renderLinearFormula = () => {
    const aStr =
      alphaVal === 1
        ? 'ν'
        : alphaVal === -1
        ? '-ν'
        : alphaVal === 0
        ? ''
        : `${formatNum(alphaVal)} · ν`;

    if (alphaVal === 0) {
      return <span>y ＝ {formatNum(betaVal)}</span>;
    }
    if (betaVal === 0) {
      return <span>y ＝ {aStr}</span>;
    }
    if (betaVal > 0) {
      return (
        <span>
          y ＝ {aStr} ＋ {formatNum(betaVal)}
        </span>
      );
    }
    return (
      <span>
        y ＝ {aStr} － {formatNum(Math.abs(betaVal))}
      </span>
    );
  };

  // Συντεταγμένες SVG γραφήματος γραμμικής κανονικότητας (responsive viewBox 520x270)
  const allYValues = [...linearTerms.map((t) => t.y), 0];
  const minY = Math.min(...allYValues, -4);
  const maxY = Math.max(...allYValues, 12);
  const ySpan = Math.max(1, maxY - minY);
  const plotLeft = 65;
  const plotRight = 480;
  const plotTop = 30;
  const plotBottom = 225;
  const mapX = (n) => plotLeft + ((n - 1) / 4) * (plotRight - plotLeft);
  const mapY = (y) => plotBottom - ((y - minY) / ySpan) * (plotBottom - plotTop);
  const zeroY = mapY(0);

  // Χρώματα στρωμάτων «Γ» για τους τετράγωνους αριθμούς
  const layerColors = [
    '#4f46e5',
    '#059669',
    '#d97706',
    '#7c3aed',
    '#0284c7',
    '#db2777',
    '#0d9488',
    '#ea580c',
  ];

  const pageTitle = isEn
    ? 'Chapter 7: Linear Number Patterns & Square Numbers | Grade 8'
    : "Κεφάλαιο 7: Γραμμικές Αριθμητικές Κανονικότητες & Τετράγωνοι Αριθμοί | Β' Γυμνασίου";

  const actionButton = (
    <Link
      href="/b-gymnasiou/08-kanonikotites-ask"
      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-sm transition-colors"
    >
      <span aria-hidden="true">🎯</span>
      <span>{toCleanUppercase(isEn ? 'EXERCISES' : 'ΑΣΚΗΣΕΙΣ')}</span>
    </Link>
  );

  return (
    <Layout
      title={pageTitle}
      actionButton={actionButton}
      backUrl="/b-gymnasiou"
      backText={isEn ? 'Grade 8' : "Β' Γυμνασίου"}
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] 8k:max-w-[5120px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 4k:px-24 8k:px-32 py-4 sm:py-6 pb-28 sm:pb-36 overflow-x-hidden text-slate-800 box-border">
        {/* 1. HERO BANNER */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white p-6 sm:p-8 lg:p-10 2xl:p-12 shadow-xl mb-8">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-indigo-100 text-xs sm:text-sm font-extrabold tracking-wider mb-4">
                <span>
                  {toCleanUppercase(
                    isEn ? 'CHAPTER 7 • GRADE 8' : "ΚΕΦΑΛΑΙΟ 7 • Β' ΓΥΜΝΑΣΙΟΥ"
                  )}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-3">
                {isEn
                  ? 'Linear Number Patterns of Rational Numbers & Square Numbers'
                  : 'Γραμμικές Αριθμητικές Κανονικότητες Ρητών Αριθμών & Τετράγωνοι Αριθμοί'}
              </h1>
              <p className="text-indigo-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                {isEn
                  ? 'Discover how linear rules y = α · ν + β connect term position (ν) with term value (y), learn how to find the general rule from tables, and explore square numbers y = ν².'
                  : 'Ανακάλυψε πώς οι γραμμικές κανονικότητες y = α · ν + β συνδέουν τη θέση του όρου (ν) με τον όρο της κανονικότητας (y), μάθε να βρίσκεις τον τύπο τους και εξερεύνησε τους τετράγωνους αριθμούς y = ν².'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <Link
                href="/b-gymnasiou/08-kanonikotites-ask"
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
          {/* ΚΑΡΤΑ 1: Ορισμός Γραμμικής Αριθμητικής Κανονικότητας */}
          <article className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-base shrink-0">
                  1
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  {isEn
                    ? 'Linear Number Pattern (y = α · ν + β)'
                    : 'Ορισμός Γραμμικής Αριθμητικής Κανονικότητας'}
                </h2>
              </div>

              <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">
                {isEn ? (
                  <>
                    A <strong>linear number pattern</strong> of rational numbers is an ordered sequence of
                    rational numbers where each term <span className="font-bold text-indigo-700">y</span> is
                    determined by its position <span className="font-bold text-emerald-700">ν ∈ ℕ*</span>{' '}
                    (ν = 1, 2, 3, ...) through a first-degree formula:
                  </>
                ) : (
                  <>
                    <strong>Γραμμική αριθμητική κανονικότητα ρητών αριθμών</strong> ονομάζεται μια
                    διατεταγμένη ακολουθία ρητών αριθμών στην οποία κάθε όρος{' '}
                    <span className="font-bold text-indigo-700">y</span> προσδιορίζεται από τη θέση του{' '}
                    <span className="font-bold text-emerald-700">ν ∈ ℕ*</span> (ν = 1, 2, 3, ...) μέσω
                    ενός τύπου πρώτου βαθμού:
                  </>
                )}
              </p>

              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-center mb-4">
                <div className="text-xl sm:text-2xl font-black font-mono text-indigo-950">
                  y ＝ α · ν ＋ β
                </div>
                <div className="text-xs sm:text-sm text-indigo-800 mt-1">
                  {isEn
                    ? 'where α, β ∈ ℚ (with α ≠ 0) and ν = 1, 2, 3, ...'
                    : 'όπου α, β ∈ ℚ (με α ≠ 0) και ν = 1, 2, 3, ...'}
                </div>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-emerald-800">
                    {isEn ? '• Term Position (ν):' : '• Θέση του όρου (ν):'}
                  </strong>{' '}
                  {isEn
                    ? 'The natural number ν = 1, 2, 3, ... indicating the order (1st, 2nd, 3rd term).'
                    : 'Ο φυσικός αριθμός ν = 1, 2, 3, ... που δείχνει τη σειρά εμφάνισης (1ος, 2ος, 3ος όρος).'}
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <strong className="text-indigo-800">
                    {isEn ? '• Term of the Pattern (y):' : '• Όρος της κανονικότητας (y):'}
                  </strong>{' '}
                  {isEn
                    ? 'The rational number y that corresponds to position ν.'
                    : 'Ο ρητός αριθμός y που προκύπτει όταν αντικαταστήσουμε το ν στον τύπο.'}
                </div>
              </div>
            </div>
          </article>

          {/* ΚΑΡΤΑ 2: Σταθερή Διαφορά & Εύρεση του Τύπου */}
          <article className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-base shrink-0">
                  2
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  {isEn
                    ? 'Constant Step (α) & Finding the Formula'
                    : 'Σταθερή Διαφορά (α) & Εύρεση του Τύπου'}
                </h2>
              </div>

              <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">
                {isEn ? (
                  <>
                    In every linear pattern <strong>y = α · ν + β</strong>, the difference between any two
                    consecutive terms is constant and equal to <strong>α</strong> (the step of change).
                  </>
                ) : (
                  <>
                    Σε κάθε γραμμική κανονικότητα <strong>y ＝ α · ν ＋ β</strong>, η διαφορά οποιωνδήποτε
                    δύο διαδοχικών όρων είναι σταθερή και ίση με τον συντελεστή <strong>α</strong> (βήμα
                    μεταβολής).
                  </>
                )}
              </p>

              {/* Responsive SVG Διάγραμμα Πίνακα & Βημάτων +α */}
              <div className="w-full overflow-hidden rounded-2xl bg-slate-50 border border-slate-200 p-3 mb-4">
                <svg
                  viewBox="0 0 460 155"
                  className="w-full h-auto max-w-full block"
                  role="img"
                  aria-label="Linear pattern constant difference diagram"
                >
                  {/* Κουτιά θέσεων ν */}
                  {[1, 2, 3, 4].map((n, i) => {
                    const cx = 62 + i * 112;
                    const yVal = 3 * n + 2;
                    return (
                      <g key={n}>
                        <rect
                          x={cx - 38}
                          y="18"
                          width="76"
                          height="30"
                          rx="8"
                          fill="#eef2ff"
                          stroke="#6366f1"
                          strokeWidth="1.6"
                        />
                        <text
                          x={cx}
                          y="37"
                          textAnchor="middle"
                          fontSize="12"
                          fontWeight="800"
                          fill="#312e81"
                          fontFamily="monospace"
                        >
                          ν ＝ {n}
                        </text>

                        <line x1={cx} y1="48" x2={cx} y2="68" stroke="#94a3b8" strokeWidth="1.5" />
                        <polygon points={`${cx},70 ${cx - 4},63 ${cx + 4},63`} fill="#94a3b8" />

                        <rect
                          x={cx - 38}
                          y="70"
                          width="76"
                          height="34"
                          rx="8"
                          fill="#ecfdf5"
                          stroke="#059669"
                          strokeWidth="1.8"
                        />
                        <text
                          x={cx}
                          y="91"
                          textAnchor="middle"
                          fontSize="13"
                          fontWeight="900"
                          fill="#065f46"
                          fontFamily="monospace"
                        >
                          y ＝ {yVal}
                        </text>

                        {i < 3 && (
                          <g>
                            <path
                              d={`M ${cx + 12} 106 Q ${cx + 56} 134 ${cx + 100} 106`}
                              fill="none"
                              stroke="#d97706"
                              strokeWidth="2"
                            />
                            <text
                              x={cx + 56}
                              y="142"
                              textAnchor="middle"
                              fontSize="12"
                              fontWeight="900"
                              fill="#b45309"
                              fontFamily="monospace"
                            >
                              ＋3 (α＝3)
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-950 space-y-1">
                <div className="font-bold">
                  {isEn ? 'How to find β quickly:' : 'Πώς βρίσκουμε γρήγορα το β:'}
                </div>
                <div>
                  {isEn ? (
                    <>
                      From the 1st term (ν = 1): <strong>y₁ = α · 1 + β ⇒ β = y₁ − α</strong>. In the
                      example above (5, 8, 11, 14): α = 3 and β = 5 − 3 = 2, so <strong>y = 3 · ν + 2</strong>.
                    </>
                  ) : (
                    <>
                      Από τον 1ο όρο (ν ＝ 1): <strong>y₁ ＝ α · 1 ＋ β ⇒ β ＝ y₁ － α</strong>. Στο
                      παραπάνω παράδειγμα (5, 8, 11, 14): α ＝ 3 και β ＝ 5 － 3 ＝ 2, άρα{' '}
                      <strong>y ＝ 3 · ν ＋ 2</strong>.
                    </>
                  )}
                </div>
              </div>
            </div>
          </article>

          {/* ΚΑΡΤΑ 3: Τετράγωνοι Αριθμοί (y = ν²) */}
          <article className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 rounded-xl bg-amber-600 text-white font-black flex items-center justify-center text-base shrink-0">
                  3
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  {isEn ? 'Square Numbers Pattern (y = ν²)' : 'Τετράγωνοι Αριθμοί (y ＝ ν²)'}
                </h2>
              </div>

              <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-3">
                {isEn ? (
                  <>
                    <strong>Square numbers</strong> form a fundamental non-linear geometric pattern:{' '}
                    <span className="font-mono font-bold text-slate-900">
                      1, 4, 9, 16, 25, 36, 49, 64, 81, 100, ...
                    </span>{' '}
                    The term at position <strong>ν</strong> equals the area of a square with side{' '}
                    <strong>ν</strong>:
                  </>
                ) : (
                  <>
                    Οι <strong>τετράγωνοι αριθμοί</strong> αποτελούν μια θεμελιώδη γεωμετρική κανονικότητα:{' '}
                    <span className="font-mono font-bold text-slate-900">
                      1, 4, 9, 16, 25, 36, 49, 64, 81, 100, ...
                    </span>{' '}
                    Ο όρος στη θέση <strong>ν</strong> ισούται με το εμβαδόν τετραγώνου πλευράς{' '}
                    <strong>ν</strong>:
                  </>
                )}
              </p>

             <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2 mb-4">
                <div className="text-center text-lg sm:text-xl font-black font-mono text-amber-950 inline-flex flex-wrap items-baseline justify-center gap-1 w-full">
                  <span>y ＝</span>
                  <Pow base="ν" exp="2" />
                  <span>＝ 1 ＋ 3 ＋ 5 ＋ ... ＋ (2ν － 1)</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-center font-mono text-xs font-bold text-amber-900 bg-white/80 rounded-xl p-2 border border-amber-200/80">
                  <div>
                    1 ＝ <Pow base="1" exp="2" />
                  </div>
                  <div>
                    1＋3 ＝ <Pow base="2" exp="2" />
                  </div>
                  <div>
                    1＋3＋5 ＝ <Pow base="3" exp="2" />
                  </div>
                  <div>
                    1＋3＋5＋7 ＝ <Pow base="4" exp="2" />
                  </div>
                </div>
                <div className="text-center text-xs sm:text-sm text-amber-900">
                  {isEn
                    ? 'Adding each consecutive odd number builds an L-shaped layer around the previous square, forming the ν-th square number!'
                    : 'Προσθέτοντας κάθε επόμενο περιττό αριθμό σχηματίζεται ένα «Γ» γύρω από το προηγούμενο τετράγωνο, δίνοντας τον ν-οστό τετράγωνο αριθμό!'}
                </div>
              </div>

              {/* SVG Τετράγωνοι Αριθμοί 1x1, 2x2, 3x3, 4x4 */}
              <div className="w-full overflow-hidden rounded-2xl bg-slate-50 border border-slate-200 p-3">
                <svg
                  viewBox="0 0 460 135"
                  className="w-full h-auto max-w-full block"
                  role="img"
                  aria-label="Square numbers 1, 4, 9, 16 visual grid"
                >
                  {[1, 2, 3, 4].map((n, idx) => {
                    const baseX = [35, 115, 220, 345][idx];
                    const cell = 18;
                    const topY = 92 - n * cell;
                    return (
                      <g key={n}>
                        {Array.from({ length: n }).map((_, r) =>
                          Array.from({ length: n }).map((__, c) => (
                            <rect
                              key={`${r}-${c}`}
                              x={baseX + c * cell}
                              y={topY + r * cell}
                              width={cell - 2}
                              height={cell - 2}
                              rx="3"
                              fill={r === n - 1 || c === n - 1 ? '#f59e0b' : '#6366f1'}
                              fillOpacity={r === n - 1 || c === n - 1 ? '0.85' : '0.75'}
                            />
                          ))
                        )}
                        <text
                          x={baseX + (n * cell) / 2 - 1}
                          y="112"
                          textAnchor="middle"
                          fontSize="11.5"
                          fontWeight="800"
                          fill="#1e293b"
                          fontFamily="monospace"
                        >
                          ν＝{n} → {n * n}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </article>

          {/* ΚΑΡΤΑ 4: Γραμμική vs Τετραγωνική Κανονικότητα */}
          <article className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 rounded-xl bg-purple-600 text-white font-black flex items-center justify-center text-base shrink-0">
                  4
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  {isEn
                    ? 'Linear vs Square Patterns: How to Tell Them Apart'
                    : 'Γραμμική vs Τετραγωνική Κανονικότητα'}
                </h2>
              </div>

              <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">
                {isEn
                  ? 'By checking the differences between consecutive terms, we can immediately identify the type of pattern:'
                  : 'Εξετάζοντας τις διαφορές διαδοχικών όρων ξεχωρίζουμε αμέσως το είδος της κανονικότητας:'}
              </p>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-1.5">
                  <div className="font-black text-indigo-950 text-sm sm:text-base">
                    {isEn ? '1. Linear Pattern (y = α · ν + β)' : '1. Γραμμική Κανονικότητα (y ＝ α · ν ＋ β)'}
                  </div>
                  <p className="text-slate-700">
                    {isEn ? (
                      <>
                        <strong>1st differences are constant</strong> (equal to α). Example:{' '}
                        <span className="font-mono font-bold">2,5 — 4 — 5,5 — 7</span> (constant step{' '}
                        <span className="font-mono font-bold">α = 1,5</span>).
                      </>
                    ) : (
                      <>
                        Οι <strong>1ες διαφορές είναι σταθερές</strong> (ίσες με α). Παράδειγμα:{' '}
                        <span className="font-mono font-bold">2,5 — 4 — 5,5 — 7</span> (σταθερό βήμα{' '}
                        <span className="font-mono font-bold">α ＝ 1,5</span>).
                      </>
                    )}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-1.5">
                  <div className="font-black text-purple-950 text-sm sm:text-base inline-flex items-baseline gap-1">
                    <span>{isEn ? '2. Square Numbers (' : '2. Τετράγωνοι Αριθμοί ('}</span>
                    <span>y ＝</span>
                    <Pow base="ν" exp="2" />
                    <span>)</span>
                  </div>
                  <p className="text-slate-700">
                    {isEn ? (
                      <>
                        <strong>1st differences are NOT constant</strong> (they are consecutive odd numbers:
                        +3, +5, +7, +9...), whereas <strong>2nd differences are constant (+2)</strong>.
                      </>
                    ) : (
                      <>
                        Οι <strong>1ες διαφορές ΔΕΝ είναι σταθερές</strong> (αυξάνονται κατά +3, +5, +7,
                        +9...), ενώ οι <strong>2ες διαφορές είναι σταθερές (+2)</strong>.
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-xs sm:text-sm text-slate-600">
              {isEn ? (
                <>
                  <strong>Tip:</strong> Rational coefficients in y = α · ν + β can be fractions (e.g.{' '}
                  <span className="inline-flex items-center font-bold text-slate-900">
                    y ＝ <Frac num="1" den="2" /> · ν ＋ 3
                  </span>
                  ) or negative numbers (decreasing pattern when α &lt; 0).
                </>
              ) : (
                <>
                  <strong>Σημείωση:</strong> Οι συντελεστές α, β μπορεί να είναι και κλάσματα ή δεκαδικοί
                  (π.χ.{' '}
                  <span className="inline-flex items-center font-bold text-slate-900">
                    y ＝ <Frac num="1" den="2" /> · ν ＋ 3
                  </span>
                  ), καθώς και αρνητικοί (φθίνουσα κανονικότητα όταν α &lt; 0).
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
                  ? 'Explore Linear Patterns & Square Numbers Live'
                  : 'Ζωντανός Εξερευνητής Κανονικοτήτων & Τετραγώνων Αριθμών'}
              </h2>
            </div>

            <div className="flex flex-wrap gap-2 bg-slate-100 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => setActiveLabTab('linear')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                  activeLabTab === 'linear'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-700 hover:bg-white/70'
                }`}
              >
                {isEn ? '1. Linear y = α · ν + β' : '1. Γραμμική y ＝ α · ν ＋ β'}
              </button>
              <button
                type="button"
                onClick={() => setActiveLabTab('squares')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                  activeLabTab === 'squares'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-700 hover:bg-white/70'
                }`}
              >
                <span className="inline-flex items-baseline gap-1">
                  <span>{isEn ? '2. Square Numbers y =' : '2. Τετράγωνοι y ＝'}</span>
                  <Pow base="ν" exp="2" />
                </span>
              </button>
            </div>
          </div>

          {activeLabTab === 'linear' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pt-6 items-center">
              {/* Χειριστήρια Sliders α & β */}
              <div className="lg:col-span-5 space-y-5 min-w-0">
                <div className="p-4 rounded-2xl bg-indigo-950 text-white text-center shadow">
                  <div className="text-[11px] uppercase tracking-wider text-indigo-300 font-bold mb-1">
                    {isEn ? 'Current Pattern Formula' : 'Τύπος Κανονικότητας'}
                  </div>
                  <div className="text-xl sm:text-2xl font-black font-mono text-amber-300">
                    {renderLinearFormula()}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm font-bold text-slate-700 mb-1">
                    <span>
                      {isEn ? 'Step α (constant difference):' : 'Συντελεστής α (σταθερή διαφορά):'}
                    </span>
                    <span className="text-indigo-700 font-black font-mono">
                      α ＝ {formatNum(alphaVal)}
                    </span>
                  </div>
                  <CustomSlider
                    min={-4}
                    max={5}
                    step={0.5}
                    value={alphaVal}
                    onChange={setAlphaVal}
                    accentColor="indigo"
                    ariaLabel="Coefficient alpha slider"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>-4</span>
                    <span>0</span>
                    <span>+5</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm font-bold text-slate-700 mb-1">
                    <span>
                      {isEn ? 'Constant term β:' : 'Σταθερός όρος β:'}
                    </span>
                    <span className="text-emerald-700 font-black font-mono">
                      β ＝ {formatNum(betaVal)}
                    </span>
                  </div>
                  <CustomSlider
                    min={-5}
                    max={6}
                    step={0.5}
                    value={betaVal}
                    onChange={setBetaVal}
                    accentColor="emerald"
                    ariaLabel="Constant beta slider"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>-5</span>
                    <span>0</span>
                    <span>+6</span>
                  </div>
                </div>

                {/* Πίνακας 5 πρώτων όρων + 10ος όρος */}
                <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50">
                  <div className="grid grid-cols-5 divide-x divide-slate-200 text-center">
                    {linearTerms.map((item) => (
                      <div key={item.n} className="p-2">
                        <div className="text-[11px] font-bold text-slate-500">ν＝{item.n}</div>
                        <div className="text-xs sm:text-sm font-black font-mono text-indigo-900 mt-0.5">
                          {formatNum(item.y)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-emerald-50 border-t border-emerald-200 px-3 py-2 text-xs sm:text-sm font-bold text-emerald-950 flex items-center justify-between">
                    <span>{isEn ? '10th Term (ν ＝ 10):' : '10ος Όρος (ν ＝ 10):'}</span>
                    <span className="font-mono font-black text-emerald-700">
                      y₁₀ ＝ {formatNum(tenthTerm)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Responsive SVG Γράφημα (ν, y) */}
              <div className="lg:col-span-7 min-w-0">
                <div className="w-full overflow-hidden rounded-2xl bg-slate-50 border border-slate-200 p-3 sm:p-4">
                  <svg
                    viewBox="0 0 520 270"
                    className="w-full h-auto max-w-full block"
                    role="img"
                    aria-label="Linear pattern graph of points (n, y)"
                  >
                    {/* Οριζόντιος άξονας y = 0 */}
                    <line
                      x1="45"
                      y1={zeroY}
                      x2="495"
                      y2={zeroY}
                      stroke="#94a3b8"
                      strokeWidth="1.8"
                    />
                    <text x="500" y={zeroY + 4} fontSize="12" fontWeight="800" fill="#475569">
                      ν
                    </text>

                    {/* Κατακόρυφος άξονας */}
                    <line x1="45" y1="18" x2="45" y2="245" stroke="#94a3b8" strokeWidth="1.8" />
                    <text x="41" y="13" fontSize="12" fontWeight="800" fill="#475569">
                      y
                    </text>

                    {/* Κάθετες γραμμές θέσεων ν = 1..5 */}
                    {linearTerms.map((item) => {
                      const cx = mapX(item.n);
                      return (
                        <g key={`grid-${item.n}`}>
                          <line
                            x1={cx}
                            y1="20"
                            x2={cx}
                            y2="240"
                            stroke="#e2e8f0"
                            strokeWidth="1.3"
                            strokeDasharray="4 4"
                          />
                          <text
                            x={cx}
                            y="258"
                            textAnchor="middle"
                            fontSize="12"
                            fontWeight="800"
                            fill="#334155"
                            fontFamily="monospace"
                          >
                            ν＝{item.n}
                          </text>
                        </g>
                      );
                    })}

                    {/* Ευθεία γραμμή που συνδέει τα σημεία */}
                    <polyline
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="2.8"
                      strokeDasharray="6 4"
                      points={linearTerms.map((item) => `${mapX(item.n)},${mapY(item.y)}`).join(' ')}
                    />

                    {/* Σημεία (ν, y) */}
                    {linearTerms.map((item) => {
                      const cx = mapX(item.n);
                      const cy = mapY(item.y);
                      return (
                        <g key={`pt-${item.n}`}>
                          <circle cx={cx} cy={cy} r="6.5" fill="#4f46e5" stroke="#ffffff" strokeWidth="2" />
                          <text
                            x={cx}
                            y={cy - 11}
                            textAnchor="middle"
                            fontSize="11.5"
                            fontWeight="900"
                            fill="#1e1b4b"
                            fontFamily="monospace"
                          >
                            {formatNum(item.y)}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: ΤΕΤΡΑΓΩΝΟΙ ΑΡΙΘΜΟΙ y = ν² */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pt-6 items-center">
              <div className="lg:col-span-5 space-y-5 min-w-0">
                <div>
                  <div className="flex items-center justify-between text-sm font-bold text-slate-700 mb-1">
                    <span>
                      {isEn ? 'Select position ν:' : 'Επίλεξε θέση ν:'}
                    </span>
                    <span className="text-indigo-700 font-black font-mono text-base">
                      ν ＝ {squareN}
                    </span>
                  </div>
                  <CustomSlider
                    min={1}
                    max={8}
                    step={1}
                    value={squareN}
                    onChange={setSquareN}
                    accentColor="amber"
                    ariaLabel="Square number position slider"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>1</span>
                    <span>4</span>
                    <span>8</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-amber-800">
                    {isEn ? 'Square Number & Odd Layers' : 'Τετράγωνος Αριθμός & Περιττά Στρώματα'}
                  </div>
                  <div className="text-lg sm:text-xl font-black font-mono text-slate-900 inline-flex items-baseline gap-1">
                    <span>y ＝</span>
                    <Pow base={String(squareN)} exp="2" />
                    <span>＝ {squareN * squareN}</span>
                  </div>
                  <div className="text-xs sm:text-sm font-mono text-amber-950 break-words">
                    {Array.from({ length: squareN }, (_, i) => 2 * i + 1).join(' ＋ ')} ＝ {squareN * squareN}
                  </div>
                  <p className="text-xs text-slate-600">
                    {isEn
                      ? `Each color shows the next odd layer (2·k − 1) added to build the ${squareN}×${squareN} square.`
                      : `Κάθε χρώμα δείχνει το επόμενο περιττό στρώμα (2·κ − 1) που προστίθεται για να σχηματιστεί το τετράγωνο ${squareN}×${squareN}.`}
                  </p>
                </div>
              </div>

              {/* SVG Πλέγμα ν × ν με χρωματισμένα στρώματα «Γ» */}
              <div className="lg:col-span-7 min-w-0">
                <div className="w-full overflow-hidden rounded-2xl bg-slate-50 border border-slate-200 p-4 flex items-center justify-center">
                  <svg
                    viewBox="0 0 320 260"
                    className="w-full max-w-[340px] h-auto block"
                    role="img"
                    aria-label="Interactive square number visual grid"
                  >
                    {(() => {
                      const cell = 26;
                      const totalSize = squareN * cell;
                      const startX = (320 - totalSize) / 2;
                      const startY = (235 - totalSize) / 2;
                      const cells = [];

                      for (let r = 0; r < squareN; r++) {
                        for (let c = 0; c < squareN; c++) {
                          const layerIdx = Math.max(r, c);
                          const fill = layerColors[layerIdx % layerColors.length];
                          cells.push(
                            <rect
                              key={`${r}-${c}`}
                              x={startX + c * cell}
                              y={startY + r * cell}
                              width={cell - 2.5}
                              height={cell - 2.5}
                              rx="4"
                              fill={fill}
                              fillOpacity="0.88"
                            />
                          );
                        }
                      }

                      return (
                        <g>
                          {cells}
                          <text
                            x="160"
                            y="248"
                            textAnchor="middle"
                            fontSize="13.5"
                            fontWeight="900"
                            fill="#0f172a"
                            fontFamily="monospace"
                          >
                            {squareN} × {squareN} ＝ {squareN * squareN} {isEn ? 'squares' : 'τετραγωνάκια'}
                          </text>
                        </g>
                      );
                    })()}
                  </svg>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 4. 2 ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ ΕΦΑΡΜΟΓΗΣ */}
        <section className="space-y-8 mb-10">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900">
            {isEn ? 'Solved Application Problems' : 'Λυμένα Προβλήματα Εφαρμογής'}
          </h2>

          {/* ΠΡΟΒΛΗΜΑ 1: Γραμμική κανονικότητα ρητών (από πίνακα τιμών & εύρεση θέσης) */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-extrabold mb-3">
              <span>{toCleanUppercase(isEn ? 'PROBLEM 1' : 'ΠΡΟΒΛΗΜΑ 1')}</span>
            </div>
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 mb-5 leading-relaxed">
              {isEn ? (
                <>
                  The first four terms of a linear number pattern are:{' '}
                  <span className="text-indigo-700 font-mono">1,5 — 4 — 6,5 — 9</span>. Find: (a) the
                  general formula <span className="font-mono">y = α · ν + β</span>, (b) the 12th term of
                  the pattern, and (c) which position <span className="font-mono">ν</span> has term{' '}
                  <span className="font-mono">y = 49</span>.
                </>
              ) : (
                <>
                  Οι τέσσερις πρώτοι όροι μιας γραμμικής αριθμητικής κανονικότητας είναι:{' '}
                  <span className="text-indigo-700 font-mono">1,5 — 4 — 6,5 — 9</span>. Να βρείτε:
                  (α) τον τύπο της κανονικότητας <span className="font-mono">y ＝ α · ν ＋ β</span>, (β)
                  τον 12ο όρο και (γ) σε ποια θέση <span className="font-mono">ν</span> βρίσκεται ο όρος{' '}
                  <span className="font-mono">y ＝ 49</span>.
                </>
              )}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Responsive SVG Διάγραμμα */}
              <div className="md:col-span-5 min-w-0">
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3">
                  <svg
                    viewBox="0 0 360 195"
                    className="w-full h-auto max-w-full block"
                    role="img"
                    aria-label="Linear pattern step analysis diagram"
                  >
                    {[
                      { n: 1, y: '1,5' },
                      { n: 2, y: '4' },
                      { n: 3, y: '6,5' },
                      { n: 4, y: '9' },
                    ].map((item, i) => {
                      const cx = 48 + i * 88;
                      return (
                        <g key={item.n}>
                          <rect x={cx - 30} y="16" width="60" height="26" rx="7" fill="#eef2ff" stroke="#6366f1" strokeWidth="1.5" />
                          <text x={cx} y="33" textAnchor="middle" fontSize="11" fontWeight="800" fill="#312e81" fontFamily="monospace">
                            ν＝{item.n}
                          </text>
                          <rect x={cx - 30} y="54" width="60" height="30" rx="7" fill="#ecfdf5" stroke="#059669" strokeWidth="1.6" />
                          <text x={cx} y="73" textAnchor="middle" fontSize="12" fontWeight="900" fill="#065f46" fontFamily="monospace">
                            {isEn ? item.y.replace(',', '.') : item.y}
                          </text>
                          {i < 3 && (
                            <text x={cx + 44} y="106" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#b45309" fontFamily="monospace">
                              ＋{isEn ? '2.5' : '2,5'}
                            </text>
                          )}
                        </g>
                      );
                    })}

                    <rect x="24" y="124" width="312" height="54" rx="12" fill="#1e1b4b" />
                    <text x="180" y="146" textAnchor="middle" fontSize="12" fontWeight="800" fill="#a5b4fc" fontFamily="monospace">
                      α ＝ {isEn ? '2.5' : '2,5'} , β ＝ {isEn ? '1.5 - 2.5 = -1' : '1,5 - 2,5 ＝ -1'}
                    </text>
                    <text x="180" y="167" textAnchor="middle" fontSize="13" fontWeight="900" fill="#fbbf24" fontFamily="monospace">
                      y ＝ {isEn ? '2.5' : '2,5'} · ν － 1
                    </text>
                  </svg>
                </div>
              </div>

              {/* Πίνακας Ανάλυσης + Mobile Cards */}
              <div className="md:col-span-7 min-w-0 space-y-4">
                <div className="hidden sm:block overflow-hidden rounded-2xl border border-slate-200">
                  <table className="w-full table-fixed text-sm text-left">
                    <thead className="bg-slate-100 text-slate-800 font-extrabold">
                      <tr>
                        <th className="w-1/3 px-4 py-3">{isEn ? 'Question' : 'Ερώτημα'}</th>
                        <th className="w-2/3 px-4 py-3">{isEn ? 'Solution Steps' : 'Πορεία Λύσης'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="px-4 py-3 font-bold text-slate-800">
                          {isEn ? '(a) Formula y = α·ν + β' : '(α) Τύπος y ＝ α·ν ＋ β'}
                        </td>
                        <td className="px-4 py-3 font-mono">
                          α ＝ 4 － {isEn ? '1.5' : '1,5'} ＝ {isEn ? '2.5' : '2,5'}, β ＝ {isEn ? '1.5' : '1,5'} － {isEn ? '2.5' : '2,5'} ＝ -1 ⇒{' '}
                          <strong>y ＝ {isEn ? '2.5' : '2,5'} · ν － 1</strong>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-bold text-slate-800">
                          {isEn ? '(b) 12th Term (ν = 12)' : '(β) 12ος Όρος (ν ＝ 12)'}
                        </td>
                        <td className="px-4 py-3 font-mono">
                          y₁₂ ＝ {isEn ? '2.5' : '2,5'} · 12 － 1 ＝ 30 － 1 ＝ <strong>29</strong>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-bold text-slate-800">
                          {isEn ? '(c) Position for y = 49' : '(γ) Θέση για y ＝ 49'}
                        </td>
                        <td className="px-4 py-3 font-mono">
                          <div className="flex flex-wrap items-center gap-1">
                            <span>{isEn ? '2.5' : '2,5'} · ν － 1 ＝ 49 ⇒ {isEn ? '2.5' : '2,5'} · ν ＝ 50 ⇒ ν ＝</span>
                            <Frac num="50" den={isEn ? '2.5' : '2,5'} />
                            <span>＝ <strong>20</strong></span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="sm:hidden space-y-2.5 text-sm">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="font-extrabold text-indigo-800 mb-1">
                      {isEn ? '(a) Formula' : '(α) Τύπος κανονικότητας'}
                    </div>
                    <div className="font-mono">
                      α ＝ {isEn ? '2.5' : '2,5'}, β ＝ -1 ⇒ y ＝ {isEn ? '2.5' : '2,5'} · ν － 1
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="font-extrabold text-indigo-800 mb-1">
                      {isEn ? '(b) 12th Term' : '(β) 12ος Όρος'}
                    </div>
                    <div className="font-mono">y₁₂ ＝ {isEn ? '2.5' : '2,5'} · 12 － 1 ＝ 29</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="font-extrabold text-indigo-800 mb-1">
                      {isEn ? '(c) Position for y = 49' : '(γ) Θέση του 49'}
                    </div>
                    <div className="font-mono flex items-center gap-1">
                      <span>ν ＝</span>
                      <Frac num="50" den={isEn ? '2.5' : '2,5'} />
                      <span>＝ 20</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-bold text-sm sm:text-base">
                  {isEn
                    ? 'Final Answer: (a) y = 2.5 · ν − 1, (b) 29, (c) 20th position'
                    : 'Τελική Απάντηση: (α) y ＝ 2,5 · ν － 1, (β) 29, (γ) 20ή θέση'}
                </div>
              </div>
            </div>
          </div>

          {/* ΠΡΟΒΛΗΜΑ 2: Τετράγωνοι αριθμοί & γεωμετρική κανονικότητα */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold mb-3">
              <span>{toCleanUppercase(isEn ? 'PROBLEM 2' : 'ΠΡΟΒΛΗΜΑ 2')}</span>
            </div>
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 mb-5 leading-relaxed">
              {isEn ? (
                <>
                  An artist creates tile mosaics following the square numbers pattern:{' '}
                  <span className="text-amber-700 font-mono">1, 4, 9, 16, ...</span> (a) How many tiles
                  will the 9th mosaic need? (b) Which mosaic uses exactly{' '}
                  <span className="font-mono">144</span> tiles? (c) Calculate the sum{' '}
                  <span className="font-mono">1 + 3 + 5 + ... + 19</span> without adding all numbers one by
                  one.
                </>
              ) : (
                <>
                  Ένας καλλιτέχνης φτιάχνει ψηφιδωτά ακολουθώντας την κανονικότητα των τετράγωνων
                  αριθμών: <span className="text-amber-700 font-mono">1, 4, 9, 16, ...</span> (α) Πόσες
                  ψηφίδες θα χρειαστεί το 9ο ψηφιδωτό; (β) Ποιο ψηφιδωτό αποτελείται από{' '}
                  <span className="font-mono">144</span> ψηφίδες; (γ) Υπολογίστε γρήγορα το άθροισμα{' '}
                  <span className="font-mono">1 ＋ 3 ＋ 5 ＋ ... ＋ 19</span>.
                </>
              )}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-5 min-w-0">
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 flex flex-col items-center space-y-2.5">
                  <div className="w-full rounded-xl bg-amber-50 border-2 border-amber-500 px-4 py-3 text-amber-950 font-extrabold text-sm sm:text-base flex items-baseline justify-between">
                    <span>{isEn ? 'Pattern Formula:' : 'Τύπος:'}</span>
                    <span className="inline-flex items-baseline gap-1 font-mono">
                      <span>y ＝</span>
                      <Pow base="ν" exp="2" />
                    </span>
                  </div>
                  <div className="w-full rounded-xl bg-indigo-50 border-2 border-indigo-500 px-4 py-3 text-indigo-950 font-extrabold text-sm sm:text-base flex items-baseline justify-between">
                    <span>ν ＝ 9:</span>
                    <span className="inline-flex items-baseline gap-1 font-mono">
                      <Pow base="9" exp="2" />
                      <span>＝ 81</span>
                    </span>
                  </div>
                  <div className="w-full rounded-xl bg-emerald-50 border-2 border-emerald-600 px-4 py-3 text-emerald-950 font-extrabold text-sm sm:text-base flex items-center justify-between">
                    <span>y ＝ 144:</span>
                    <span className="inline-flex items-center gap-1 font-mono">
                      <span>ν ＝</span>
                      <Radical>144</Radical>
                      <span>＝ 12</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-7 min-w-0 space-y-4">
                <div className="hidden sm:block overflow-hidden rounded-2xl border border-slate-200">
                  <table className="w-full table-fixed text-sm text-left">
                    <thead className="bg-slate-100 text-slate-800 font-extrabold">
                      <tr>
                        <th className="w-1/3 px-4 py-3">{isEn ? 'Question' : 'Ερώτημα'}</th>
                        <th className="w-2/3 px-4 py-3">{isEn ? 'Analysis' : 'Ανάλυση'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="px-4 py-3 font-bold text-slate-800">
                          {isEn ? '(a) 9th Mosaic' : '(α) 9ο Ψηφιδωτό'}
                        </td>
                        <td className="px-4 py-3 font-mono">
                          <div className="flex flex-wrap items-baseline gap-1">
                            <span>Για ν ＝ 9: y ＝</span>
                            <Pow base="9" exp="2" />
                            <span>＝ <strong>81</strong></span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-bold text-slate-800">
                          {isEn ? '(b) Position for 144' : '(β) Θέση του 144'}
                        </td>
                        <td className="px-4 py-3 font-mono">
                          <div className="flex flex-wrap items-center gap-1">
                            <Pow base="ν" exp="2" />
                            <span>＝ 144 ⇒ ν ＝</span>
                            <Radical>144</Radical>
                            <span>＝ <strong>12</strong></span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-bold text-slate-800">
                          {isEn ? '(c) Sum of 10 odds' : '(γ) Άθροισμα περιττών'}
                        </td>
                        <td className="px-4 py-3 font-mono">
                          <div className="flex flex-wrap items-baseline gap-1">
                            <span>2ν － 1 ＝ 19 ⇒ ν ＝ 10, άρα άθροισμα ＝</span>
                            <Pow base="10" exp="2" />
                            <span>＝ <strong>100</strong></span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="sm:hidden space-y-2.5 text-sm">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="font-extrabold text-amber-800 mb-1">
                      {isEn ? '(a) 9th Mosaic' : '(α) 9ο Ψηφιδωτό'}
                    </div>
                    <div className="font-mono inline-flex items-baseline gap-1">
                      <span>y ＝</span>
                      <Pow base="9" exp="2" />
                      <span>＝ 81</span>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="font-extrabold text-amber-800 mb-1">
                      {isEn ? '(b) Position for 144' : '(β) Θέση του 144'}
                    </div>
                    <div className="font-mono inline-flex items-center gap-1">
                      <span>ν ＝</span>
                      <Radical>144</Radical>
                      <span>＝ 12</span>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="font-extrabold text-amber-800 mb-1">
                      {isEn ? '(c) Sum of 10 odds' : '(γ) Άθροισμα 10 περιττών'}
                    </div>
                    <div className="font-mono inline-flex items-baseline gap-1">
                      <Pow base="10" exp="2" />
                      <span>＝ 100</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-bold text-sm sm:text-base">
                  {isEn
                    ? 'Final Answer: (a) 81 tiles, (b) 12th mosaic, (c) 100'
                    : 'Τελική Απάντηση: (α) 81 ψηφίδες, (β) 12ο ψηφιδωτό, (γ) 100'}
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
                : 'Προσοχή! Τα 3 πιο Κλασικά Λάθη των Μαθητών'}
            </h2>
          </div>

          <ul className="space-y-3 text-sm sm:text-base text-amber-950">
            <li className="flex items-start gap-2.5">
              <span className="font-black text-amber-600 mt-0.5">✕</span>
              <div>
                {isEn ? (
                  <>
                    <strong>Confusing position (ν) with term value (y):</strong> In{' '}
                    <span className="font-mono font-bold">y = 3 · ν + 1</span>, for the 5th term we
                    substitute <span className="font-mono font-bold">ν = 5</span> (y = 16), we do NOT
                    set y = 5!
                  </>
                ) : (
                  <>
                    <strong>Να μπερδεύουμε τη θέση (ν) με τον όρο (y):</strong> Στην κανονικότητα{' '}
                    <span className="font-mono font-bold">y ＝ 3 · ν ＋ 1</span>, όταν ζητείται ο 5ος
                    όρος θέτουμε <span className="font-mono font-bold">ν ＝ 5</span> (y ＝ 16), δεν
                    θέτουμε y ＝ 5!
                  </>
                )}
              </div>
            </li>

            <li className="flex items-start gap-2.5">
              <span className="font-black text-amber-600 mt-0.5">✕</span>
              <div>
                {isEn ? (
                  <>
                    <strong>Assuming β is always the 1st term:</strong> In{' '}
                    <span className="font-mono font-bold">y = α · ν + β</span>, the 1st term (ν = 1) is{' '}
                    <span className="font-mono font-bold">α + β</span>, so{' '}
                    <span className="font-mono font-bold">β = y₁ − α</span>.
                  </>
                ) : (
                  <>
                    <strong>Να νομίζουμε ότι το β είναι ο 1ος όρος:</strong> Στον τύπο{' '}
                    <span className="font-mono font-bold">y ＝ α · ν ＋ β</span>, ο 1ος όρος (ν ＝ 1)
                    είναι <span className="font-mono font-bold">α ＋ β</span>, άρα{' '}
                    <span className="font-mono font-bold">β ＝ y₁ － α</span>.
                  </>
                )}
              </div>
            </li>

            <li className="flex items-start gap-2.5">
              <span className="font-black text-amber-600 mt-0.5">✕</span>
              <div className="inline-flex flex-wrap items-baseline gap-1">
                <span>
                  {isEn
                    ? 'Treating square numbers as a linear pattern:'
                    : 'Να αντιμετωπίζουμε τους τετράγωνους αριθμούς ως γραμμική κανονικότητα:'}
                </span>
                <span>{isEn ? 'the 5th square number is' : 'ο 5ος τετράγωνος αριθμός είναι'}</span>
                <Pow base="5" exp="2" />
                <span>＝ 25 ({isEn ? 'not' : 'όχι'} 2 · 5 ＝ 10).</span>
              </div>
            </li>
          </ul>
        </section>

        {/* 6. BOTTOM CALLOUT BANNER */}
        <section className="rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 lg:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black mb-2">
              {isEn
                ? 'Ready to practice Linear Patterns & Square Numbers?'
                : 'Έτοιμος να εξασκηθείς στις Γραμμικές Κανονικότητες & τους Τετράγωνους Αριθμούς;'}
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base">
              {isEn
                ? 'Solve 12 dynamically generated exercises with instant step-by-step feedback and diagrams.'
                : 'Λύσε 12 δυναμικά παραγόμενες ασκήσεις με άμεση διόρθωση, πίνακες ανάλυσης και σχήματα.'}
            </p>
          </div>

          <Link
            href="/b-gymnasiou/08-kanonikotites-ask"
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