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

export default function EpimeristikiIdiotitaTheoryPage() {
  const router = useRouter();
  const isEn = router?.locale === 'en';

  // --- State Διαδραστικού Εργαστηρίου ---
  const [activeLabTab, setActiveLabTab] = useState('single'); // 'single' | 'double'

  // Tab 1: Απλή επιμεριστική α · (x + β) = α·x + α·β
  const [aCoef, setACoef] = useState(3); // -4 to 5 (μη μηδενικό)
  const [bConst, setBConst] = useState(4); // -5 to 6

  // Tab 2: Διπλή επιμεριστική (x + α)(x + β) = x² + (α+β)x + α·β
  const [dAlpha, setDAlpha] = useState(3); // 1 to 6
  const [dBeta, setDBeta] = useState(2); // 1 to 5

  const safeA = aCoef === 0 ? 2 : aCoef;
  const prodAB = safeA * bConst;

  const formatSignedTerm = (val, suffix = '') => {
    if (val === 0) return '';
    if (val > 0) return `＋ ${val === 1 && suffix ? '' : val}${suffix}`;
    return `－ ${Math.abs(val) === 1 && suffix ? '' : Math.abs(val)}${suffix}`;
  };

  // Tab 2 γεωμετρικό μοντέλο (x + dAlpha)(x + dBeta)
  const sumAB = dAlpha + dBeta;
  const multAB = dAlpha * dBeta;
  const baseX = 115;
  const scaleUnit = 16;
  const wA = dAlpha * scaleUnit;
  const hB = dBeta * scaleUnit;

  const pageTitle = isEn
    ? 'Chapter 9: Properties of Operations, Distributive & Double Distributive Property | Grade 8'
    : "Κεφάλαιο 9: Ιδιότητες Πράξεων, Επιμεριστική & Διπλή Επιμεριστική Ιδιότητα | Β' Γυμνασίου";

  const actionButton = (
    <Link
      href="/b-gymnasiou/10-epimeristiki-idiotita-ask"
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
                    isEn ? 'CHAPTER 9 • GRADE 8' : "ΚΕΦΑΛΑΙΟ 9 • Β' ΓΥΜΝΑΣΙΟΥ"
                  )}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-3">
                {isEn
                  ? 'Properties of Operations, Distributive & Double Distributive Property'
                  : 'Ιδιότητες Πράξεων, Επιμεριστική & Διπλή Επιμεριστική Ιδιότητα'}
              </h1>
              <p className="text-indigo-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                {isEn
                  ? 'Master the properties of algebraic operations, removing parentheses, the distributive law α(β + γ) = αβ + αγ, and the double distributive law (α + β)(γ + δ).'
                  : 'Κατάκτησε τις ιδιότητες πράξεων στις αλγεβρικές παραστάσεις, την απαλοιφή παρενθέσεων, την επιμεριστική ιδιότητα α(β ＋ γ) ＝ αβ ＋ αγ και τη διπλή επιμεριστική ιδιότητα (α ＋ β)(γ ＋ δ).'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <Link
                href="/b-gymnasiou/10-epimeristiki-idiotita-ask"
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
          {/* ΚΑΡΤΑ 1: Ιδιότητες Πράξεων (Αντιμεταθετική & Προσεταιριστική) */}
          <article className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-base shrink-0">
                  1
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  {isEn
                    ? 'Properties of Operations on Algebraic Expressions'
                    : 'Ιδιότητες Πράξεων στις Αλγεβρικές Παραστάσεις'}
                </h2>
              </div>

              <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">
                {isEn
                  ? 'Because variables represent rational numbers, all properties of addition and multiplication hold identically:'
                  : 'Επειδή οι μεταβλητές παριστάνουν ρητούς αριθμούς, ισχύουν όλες οι γνωστές ιδιότητες της πρόσθεσης και του πολλαπλασιασμού:'}
              </p>

              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-200 flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-indigo-950">
                    {isEn ? '• Commutative Property:' : '• Αντιμεταθετική Ιδιότητα:'}
                  </span>
                  <span className="font-mono font-black text-indigo-800">
                    α ＋ β ＝ β ＋ α &nbsp;|&nbsp; α · β ＝ β · α
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-emerald-950">
                    {isEn ? '• Associative Property:' : '• Προσεταιριστική Ιδιότητα:'}
                  </span>
                  <span className="font-mono font-black text-emerald-800">
                    (α ＋ β) ＋ γ ＝ α ＋ (β ＋ γ)
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1">
                    {isEn ? '• Multiplying Monomials (Products):' : '• Πολλαπλασιασμός Μονωνύμων (Γινομένων):'}
                  </div>
                  <div className="font-mono text-slate-800 inline-flex flex-wrap items-baseline gap-1">
                    <span>(3x) · (4x) ＝ (3 · 4) · (x · x) ＝ 12</span>
                    <Pow base="x" exp="2" />
                    <span>&nbsp;|&nbsp; (-2α) · (5β) ＝ -10αβ</span>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* ΚΑΡΤΑ 2: Απαλοιφή Παρενθέσεων (+ και -) */}
          <article className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-base shrink-0">
                  2
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  {isEn
                    ? 'Removing Parentheses (+ and − Signs)'
                    : 'Απαλοιφή Παρενθέσεων (με Πρόσημο ＋ και －)'}
                </h2>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                  <div className="font-black text-emerald-950">
                    {isEn ? '1. Plus sign (+) before parentheses:' : '1. Πρόσημο ＋ πριν την παρένθεση:'}
                  </div>
                  <p className="text-slate-700">
                    {isEn
                      ? 'We remove the parentheses and keep the signs of all inner terms unchanged:'
                      : 'Διαγράφουμε την παρένθεση και διατηρούμε τα πρόσημα όλων των όρων της:'}
                  </p>
                  <div className="font-mono font-bold text-emerald-900 pt-1">
                    α ＋ (β － γ) ＝ α ＋ β － γ &nbsp;|&nbsp; 5 ＋ (2x － 3) ＝ 5 ＋ 2x － 3 ＝ 2x ＋ 2
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 space-y-1">
                  <div className="font-black text-rose-950">
                    {isEn ? '2. Minus sign (−) before parentheses:' : '2. Πρόσημο － πριν την παρένθεση:'}
                  </div>
                  <p className="text-slate-700">
                    {isEn
                      ? 'We remove the parentheses and CHANGE the sign of EVERY term inside:'
                      : 'Διαγράφουμε την παρένθεση και ΑΛΛΑΖΟΥΜΕ το πρόσημο ΚΑΘΕ όρου μέσα σε αυτή:'}
                  </p>
                  <div className="font-mono font-bold text-rose-900 pt-1">
                    α － (β － γ) ＝ α － β ＋ γ &nbsp;|&nbsp; 7 － (3x － 4) ＝ 7 － 3x ＋ 4 ＝ -3x ＋ 11
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* ΚΑΡΤΑ 3: Επιμεριστική Ιδιότητα α(β + γ) = αβ + αγ */}
          <article className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 rounded-xl bg-amber-600 text-white font-black flex items-center justify-center text-base shrink-0">
                  3
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  {isEn
                    ? 'Distributive Property: α(β + γ) = αβ + αγ'
                    : 'Επιμεριστική Ιδιότητα: α(β ＋ γ) ＝ αβ ＋ αγ'}
                </h2>
              </div>

              <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-3">
                {isEn
                  ? 'To multiply a factor α by an algebraic sum (β + γ), we multiply α by each term inside the parentheses and add the products:'
                  : 'Για να πολλαπλασιάσουμε έναν παράγοντα α με ένα αλγεβρικό άθροισμα (β ＋ γ), πολλαπλασιάζουμε το α με κάθε όρο της παρένθεσης ξεχωριστά:'}
              </p>

              {/* SVG Γεωμετρική Απεικόνιση Εμβαδού α(β + γ) */}
              <div className="w-full overflow-hidden rounded-2xl bg-slate-50 border border-slate-200 p-3 mb-3">
                <svg
                  viewBox="0 0 420 135"
                  className="w-full h-auto max-w-full block"
                  role="img"
                  aria-label="Geometric model of distributive property a(b + c) = ab + ac"
                >
                  {/* Αριστερό ορθογώνιο α*β */}
                  <rect x="45" y="26" width="165" height="75" fill="#eef2ff" stroke="#4f46e5" strokeWidth="2" />
                  <text x="127" y="68" textAnchor="middle" fontSize="14" fontWeight="900" fill="#312e81" fontFamily="monospace">
                    Ε₁ ＝ α · β
                  </text>
                  <text x="127" y="118" textAnchor="middle" fontSize="13" fontWeight="800" fill="#4f46e5" fontFamily="monospace">
                    β
                  </text>

                  {/* Δεξί ορθογώνιο α*γ */}
                  <rect x="210" y="26" width="145" height="75" fill="#ecfdf5" stroke="#059669" strokeWidth="2" />
                  <text x="282" y="68" textAnchor="middle" fontSize="14" fontWeight="900" fill="#065f46" fontFamily="monospace">
                    Ε₂ ＝ α · γ
                  </text>
                  <text x="282" y="118" textAnchor="middle" fontSize="13" fontWeight="800" fill="#059669" fontFamily="monospace">
                    γ
                  </text>

                  {/* Ύψος α */}
                  <text x="28" y="68" textAnchor="middle" fontSize="14" fontWeight="900" fill="#1e293b" fontFamily="monospace">
                    α
                  </text>
                  <text x="200" y="17" textAnchor="middle" fontSize="12" fontWeight="900" fill="#b45309" fontFamily="monospace">
                    Ε ＝ α · (β ＋ γ) ＝ α · β ＋ α · γ
                  </text>
                </svg>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 font-mono text-xs sm:text-sm text-amber-950 font-bold">
                {isEn ? 'Example:' : 'Παράδειγμα:'} -3(2x － 5) ＝ (-3)·(2x) ＋ (-3)·(-5) ＝ -6x ＋ 15
              </div>
            </div>
          </article>

          {/* ΚΑΡΤΑ 4: Διπλή Επιμεριστική Ιδιότητα (α + β)(γ + δ) */}
          <article className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 rounded-xl bg-purple-600 text-white font-black flex items-center justify-center text-base shrink-0">
                  4
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  {isEn
                    ? 'Double Distributive Property: (α + β)(γ + δ)'
                    : 'Διπλή Επιμεριστική Ιδιότητα: (α ＋ β)(γ ＋ δ)'}
                </h2>
              </div>

              <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-3">
                {isEn
                  ? 'To multiply two algebraic sums (α + β) and (γ + δ), we multiply each term of the first parenthesis by each term of the second parenthesis (4 partial products):'
                  : 'Για να πολλαπλασιάσουμε δύο αλγεβρικά αθροίσματα (α ＋ β) και (γ ＋ δ), πολλαπλασιάζουμε κάθε όρο της 1ης παρένθεσης με κάθε όρο της 2ης παρένθεσης (4 γινόμενα):'}
              </p>

              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-center mb-3">
                <div className="text-sm sm:text-base lg:text-lg font-black font-mono text-purple-950">
                  (α ＋ β)(γ ＋ δ) ＝ α·γ ＋ α·δ ＋ β·γ ＋ β·δ
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs sm:text-sm font-mono">
                <div className="font-sans font-bold text-slate-800">
                  {isEn ? 'Example with reduction of like terms:' : 'Παράδειγμα με αναγωγή ομοίων όρων:'}
                </div>
                <div className="text-indigo-900">
                  (x ＋ 3)(x ＋ 2) ＝ x·x ＋ x·2 ＋ 3·x ＋ 3·2
                </div>
                <div className="font-black text-emerald-800 inline-flex flex-wrap items-baseline gap-1">
                  <span>＝</span>
                  <Pow base="x" exp="2" />
                  <span>＋ 2x ＋ 3x ＋ 6 ＝</span>
                  <Pow base="x" exp="2" />
                  <span>＋ 5x ＋ 6</span>
                </div>
              </div>
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
                  ? 'Distributive & Double Distributive Simulator'
                  : 'Προσομοιωτής Επιμεριστικής & Διπλής Επιμεριστικής'}
              </h2>
            </div>

            <div className="flex flex-wrap gap-2 bg-slate-100 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => setActiveLabTab('single')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                  activeLabTab === 'single'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-700 hover:bg-white/70'
                }`}
              >
                {isEn ? '1. Single: α(x + β)' : '1. Επιμεριστική: α(x ＋ β)'}
              </button>
              <button
                type="button"
                onClick={() => setActiveLabTab('double')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                  activeLabTab === 'double'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-700 hover:bg-white/70'
                }`}
              >
                {isEn ? '2. Double: (x + α)(x + β)' : '2. Διπλή: (x ＋ α)(x ＋ β)'}
              </button>
            </div>
          </div>

          {activeLabTab === 'single' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pt-6 items-center">
              <div className="lg:col-span-5 space-y-5 min-w-0">
                <div>
                  <div className="flex items-center justify-between text-sm font-bold text-slate-700 mb-1">
                    <span>{isEn ? '1. Outer factor α:' : '1. Εξωτερικός παράγοντας α:'}</span>
                    <span className="text-indigo-700 font-black font-mono text-base">
                      α ＝ {safeA}
                    </span>
                  </div>
                  <CustomSlider
                    min={-4}
                    max={5}
                    step={1}
                    value={safeA}
                    onChange={(v) => setACoef(v === 0 ? 1 : v)}
                    accentColor="indigo"
                    ariaLabel="Outer factor alpha slider"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>-4</span>
                    <span>+1</span>
                    <span>+5</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm font-bold text-slate-700 mb-1">
                    <span>{isEn ? '2. Inner constant β:' : '2. Εσωτερικός όρος β:'}</span>
                    <span className="text-emerald-700 font-black font-mono text-base">
                      β ＝ {bConst}
                    </span>
                  </div>
                  <CustomSlider
                    min={-5}
                    max={6}
                    step={1}
                    value={bConst}
                    onChange={setBConst}
                    accentColor="emerald"
                    ariaLabel="Inner term beta slider"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>-5</span>
                    <span>0</span>
                    <span>+6</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 min-w-0">
                <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 sm:p-8 shadow-md space-y-5">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-indigo-300 border-b border-white/15 pb-3">
                    {isEn ? 'Step-by-step expansion' : 'Βήμα προς βήμα ανάπτυξη επιμεριστικής'}
                  </div>

                  <div className="space-y-3 font-mono text-base sm:text-xl font-black">
                    <div className="text-indigo-200">
                      {safeA} · (x {bConst >= 0 ? `＋ ${bConst}` : `－ ${Math.abs(bConst)}`})
                    </div>
                    <div className="text-sm sm:text-base text-slate-300">
                      ＝ ({safeA}) · x ＋ ({safeA}) · ({bConst})
                    </div>
                    <div className="inline-block px-4 py-2 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300">
                      ＝ {safeA === 1 ? 'x' : safeA === -1 ? '-x' : `${safeA}x`} {formatSignedTerm(prodAB)}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
                    {safeA < 0
                      ? isEn
                        ? 'Notice how the negative outer factor α reverses the signs of both inner terms!'
                        : 'Παρατήρησε πώς ο αρνητικός εξωτερικός παράγοντας α αλλάζει τα πρόσημα και των δύο εσωτερικών όρων!'
                      : isEn
                      ? 'The positive outer factor α multiplies both x and β while keeping their signs.'
                      : 'Ο θετικός παράγοντας α πολλαπλασιάζει και το x και το β διατηρώντας τα πρόσημά τους.'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: ΔΙΠΛΗ ΕΠΙΜΕΡΙΣΤΙΚΗ (x + α)(x + β) ΜΕ 4 ΟΡΘΟΓΩΝΙΑ */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pt-6 items-center">
              <div className="lg:col-span-5 space-y-5 min-w-0">
                <div>
                  <div className="flex items-center justify-between text-sm font-bold text-slate-700 mb-1">
                    <span>{isEn ? '1. Parameter α:' : '1. Παράμετρος α:'}</span>
                    <span className="text-indigo-700 font-black font-mono text-base">
                      α ＝ {dAlpha}
                    </span>
                  </div>
                  <CustomSlider
                    min={1}
                    max={6}
                    step={1}
                    value={dAlpha}
                    onChange={setDAlpha}
                    accentColor="indigo"
                    ariaLabel="Parameter alpha slider"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm font-bold text-slate-700 mb-1">
                    <span>{isEn ? '2. Parameter β:' : '2. Παράμετρος β:'}</span>
                    <span className="text-emerald-700 font-black font-mono text-base">
                      β ＝ {dBeta}
                    </span>
                  </div>
                  <CustomSlider
                    min={1}
                    max={5}
                    step={1}
                    value={dBeta}
                    onChange={setDBeta}
                    accentColor="emerald"
                    ariaLabel="Parameter beta slider"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-1.5 font-mono text-xs sm:text-sm">
                  <div className="font-sans font-extrabold text-purple-900">
                    {isEn ? 'Algebraic Result:' : 'Αλγεβρικό Αποτέλεσμα:'}
                  </div>
                  <div className="text-slate-800">
                    (x ＋ {dAlpha})(x ＋ {dBeta})
                  </div>
                  <div className="font-black text-purple-950 text-sm sm:text-base inline-flex flex-wrap items-baseline gap-1">
                    <span>＝</span>
                    <Pow base="x" exp="2" />
                    <span>＋ {dBeta}x ＋ {dAlpha}x ＋ {multAB} ＝</span>
                    <Pow base="x" exp="2" />
                    <span>＋ {sumAB}x ＋ {multAB}</span>
                  </div>
                </div>
              </div>

              {/* SVG Μοντέλο Εμβαδού 4 Ορθογωνίων */}
              <div className="lg:col-span-7 min-w-0">
                <div className="w-full overflow-hidden rounded-2xl bg-slate-50 border border-slate-200 p-4 flex items-center justify-center">
                  <svg
                    viewBox="0 0 340 265"
                    className="w-full max-w-[360px] h-auto block select-none"
                    role="img"
                    aria-label="Double distributive property 4-region area model"
                  >
                    {/* Ετικέτες πάνω */}
                    <text x={55 + baseX / 2} y="24" textAnchor="middle" fontSize="13" fontWeight="800" fill="#312e81" fontFamily="monospace">
                      x
                    </text>
                    <text x={55 + baseX + wA / 2} y="24" textAnchor="middle" fontSize="13" fontWeight="800" fill="#065f46" fontFamily="monospace">
                      {dAlpha}
                    </text>

                    {/* Ετικέτες αριστερά */}
                    <text x="38" y={34 + baseX / 2} textAnchor="middle" fontSize="13" fontWeight="800" fill="#312e81" fontFamily="monospace">
                      x
                    </text>
                    <text x="38" y={34 + baseX + hB / 2} textAnchor="middle" fontSize="13" fontWeight="800" fill="#b45309" fontFamily="monospace">
                      {dBeta}
                    </text>

                    {/* 1. Πάνω-Αριστερά: x² */}
                    <rect x="55" y="34" width={baseX} height={baseX} fill="#eef2ff" stroke="#4f46e5" strokeWidth="2" />
                    <text x={55 + baseX / 2} y={38 + baseX / 2} textAnchor="middle" fontSize="15" fontWeight="900" fill="#312e81" fontFamily="monospace">
                      x²
                    </text>

                    {/* 2. Πάνω-Δεξιά: α·x */}
                    <rect x={55 + baseX} y="34" width={wA} height={baseX} fill="#ecfdf5" stroke="#059669" strokeWidth="2" />
                    <text x={55 + baseX + wA / 2} y={38 + baseX / 2} textAnchor="middle" fontSize="13" fontWeight="900" fill="#065f46" fontFamily="monospace">
                      {dAlpha}x
                    </text>

                    {/* 3. Κάτω-Αριστερά: β·x */}
                    <rect x="55" y={34 + baseX} width={baseX} height={hB} fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
                    <text x={55 + baseX / 2} y={38 + baseX + hB / 2} textAnchor="middle" fontSize="13" fontWeight="900" fill="#92400e" fontFamily="monospace">
                      {dBeta}x
                    </text>

                    {/* 4. Κάτω-Δεξιά: α·β */}
                    <rect x={55 + baseX} y={34 + baseX} width={wA} height={hB} fill="#f3e8ff" stroke="#7c3aed" strokeWidth="2" />
                    <text x={55 + baseX + wA / 2} y={38 + baseX + hB / 2} textAnchor="middle" fontSize="13" fontWeight="900" fill="#5b21b6" fontFamily="monospace">
                      {multAB}
                    </text>

                    <text x="170" y="252" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#1e293b" fontFamily="monospace">
                      Ε ＝ x² ＋ ({dAlpha}＋{dBeta})x ＋ {multAB}
                    </text>
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

          {/* ΠΡΟΒΛΗΜΑ 1: Επιμεριστική ιδιότητα & απαλοιφή παρενθέσεων */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-extrabold mb-3">
              <span>{toCleanUppercase(isEn ? 'PROBLEM 1' : 'ΠΡΟΒΛΗΜΑ 1')}</span>
            </div>
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 mb-5 leading-relaxed">
              {isEn ? (
                <>
                  Expand parentheses, combine like terms, and find the numerical value of{' '}
                  <span className="font-mono text-indigo-700">Α = 4(2x − 3) − 3(x − 5)</span> when{' '}
                  <span className="font-mono">x = -2</span>.
                </>
              ) : (
                <>
                  Να απαλείψετε τις παρενθέσεις, να κάνετε αναγωγή ομοίων όρων και να βρείτε την
                  αριθμητική τιμή της παράστασης{' '}
                  <span className="font-mono text-indigo-700">Α ＝ 4(2x － 3) － 3(x － 5)</span> για{' '}
                  <span className="font-mono">x ＝ -2</span>.
                </>
              )}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-5 min-w-0">
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 flex flex-col items-center space-y-2.5 font-mono text-xs sm:text-sm font-extrabold">
                  <div className="w-full rounded-xl bg-indigo-50 border-2 border-indigo-500 px-4 py-3 text-indigo-950">
                    1) 4(2x － 3) ＝ 8x － 12
                  </div>
                  <div className="w-full rounded-xl bg-rose-50 border-2 border-rose-500 px-4 py-3 text-rose-950">
                    2) -3(x － 5) ＝ -3x ＋ 15
                  </div>
                  <div className="w-full rounded-xl bg-emerald-50 border-2 border-emerald-600 px-4 py-3 text-emerald-950">
                    3) Α ＝ 5x ＋ 3 → για x＝-2: -7
                  </div>
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
                    <tbody className="divide-y divide-slate-200 font-mono">
                      <tr>
                        <td className="px-4 py-3 font-sans font-bold text-slate-800">
                          {isEn ? '1. Distributive law' : '1. Επιμεριστική ιδιότητα'}
                        </td>
                        <td className="px-4 py-3">Α ＝ 8x － 12 － 3x ＋ 15</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-sans font-bold text-slate-800">
                          {isEn ? '2. Combine like terms' : '2. Αναγωγή ομοίων όρων'}
                        </td>
                        <td className="px-4 py-3">
                          Α ＝ (8 － 3)x ＋ (-12 ＋ 15) ＝ <strong>5x ＋ 3</strong>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-sans font-bold text-slate-800">
                          {isEn ? '3. Numerical value' : '3. Αριθμητική τιμή (x ＝ -2)'}
                        </td>
                        <td className="px-4 py-3">
                          Α ＝ 5 · (-2) ＋ 3 ＝ -10 ＋ 3 ＝ <strong>-7</strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="sm:hidden space-y-2.5 text-sm">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="font-extrabold text-indigo-800 mb-1">
                      {isEn ? '1. Simplified form' : '1. Ανηγμένη μορφή'}
                    </div>
                    <div className="font-mono">Α ＝ 8x － 12 － 3x ＋ 15 ＝ 5x ＋ 3</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="font-extrabold text-indigo-800 mb-1">
                      {isEn ? '2. Value for x = -2' : '2. Τιμή για x ＝ -2'}
                    </div>
                    <div className="font-mono">Α ＝ 5 · (-2) ＋ 3 ＝ -7</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-bold text-sm sm:text-base">
                  {isEn
                    ? 'Final Answer: Α = 5x + 3, and for x = -2 the value is -7'
                    : 'Τελική Απάντηση: Α ＝ 5x ＋ 3, και για x ＝ -2 η τιμή είναι -7'}
                </div>
              </div>
            </div>
          </div>

          {/* ΠΡΟΒΛΗΜΑ 2: Διπλή επιμεριστική ιδιότητα & γεωμετρικό εμβαδόν */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold mb-3">
              <span>{toCleanUppercase(isEn ? 'PROBLEM 2' : 'ΠΡΟΒΛΗΜΑ 2')}</span>
            </div>
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 mb-5 leading-relaxed">
              {isEn ? (
                <>
                  A rectangular plot has length <span className="font-mono text-indigo-700">2x + 5</span>{' '}
                  meters and width <span className="font-mono text-indigo-700">x − 2</span> meters (x &gt;
                  2). Express its area <span className="font-mono">Ε</span> as a simplified algebraic
                  sum using the double distributive property.
                </>
              ) : (
                <>
                  Ένα ορθογώνιο οικόπεδο έχει μήκος <span className="font-mono text-indigo-700">2x ＋ 5</span>{' '}
                  μέτρα και πλάτος <span className="font-mono text-indigo-700">x － 2</span> μέτρα (x &gt;
                  2). Να εκφράσετε το εμβαδόν του <span className="font-mono">Ε</span> ως ανηγμένο
                  αλγεβρικό άθροισμα με τη διπλή επιμεριστική ιδιότητα.
                </>
              )}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-5 min-w-0">
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3">
                  <svg
                    viewBox="0 0 340 165"
                    className="w-full h-auto max-w-full block"
                    role="img"
                    aria-label="Rectangle area with double distributive property"
                  >
                    <rect x="40" y="25" width="215" height="90" rx="6" fill="#ecfdf5" stroke="#059669" strokeWidth="2.2" />
                    <text x="147" y="75" textAnchor="middle" fontSize="13" fontWeight="900" fill="#065f46" fontFamily="monospace">
                      Ε ＝ (2x ＋ 5)(x － 2)
                    </text>
                    <text x="147" y="136" textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#1e293b" fontFamily="monospace">
                      2x ＋ 5
                    </text>
                    <text x="264" y="74" textAnchor="start" fontSize="12.5" fontWeight="800" fill="#b45309" fontFamily="monospace">
                      x － 2
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
                    <tbody className="divide-y divide-slate-200 font-mono">
                      <tr>
                        <td className="px-4 py-3 font-sans font-bold text-slate-800">
                          {isEn ? '1. Area formula' : '1. Τύπος εμβαδού'}
                        </td>
                        <td className="px-4 py-3">Ε ＝ (2x ＋ 5)(x － 2)</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-sans font-bold text-slate-800">
                          {isEn ? '2. Double distributive' : '2. Διπλή επιμεριστική'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap items-baseline gap-1">
                            <span>Ε ＝ 2x·x ＋ 2x·(-2) ＋ 5·x ＋ 5·(-2) ＝ 2</span>
                            <Pow base="x" exp="2" />
                            <span>－ 4x ＋ 5x － 10</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-sans font-bold text-slate-800">
                          {isEn ? '3. Combine like terms' : '3. Αναγωγή ομοίων όρων'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap items-baseline gap-1">
                            <span>Ε ＝ 2</span>
                            <Pow base="x" exp="2" />
                            <span>＋ x － 10</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="sm:hidden space-y-2.5 text-sm">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="font-extrabold text-amber-800 mb-1">
                      {isEn ? '1. Expansion' : '1. Ανάπτυξη γινομένου'}
                    </div>
                    <div className="font-mono inline-flex flex-wrap items-baseline gap-1">
                      <span>Ε ＝ 2</span>
                      <Pow base="x" exp="2" />
                      <span>－ 4x ＋ 5x － 10</span>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="font-extrabold text-amber-800 mb-1">
                      {isEn ? '2. Simplified Area' : '2. Ανηγμένο εμβαδόν'}
                    </div>
                    <div className="font-mono inline-flex flex-wrap items-baseline gap-1">
                      <span>Ε ＝ 2</span>
                      <Pow base="x" exp="2" />
                      <span>＋ x － 10</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-bold text-sm sm:text-base inline-flex flex-wrap items-baseline gap-1 w-full">
                  <span>{isEn ? 'Final Answer:' : 'Τελική Απάντηση:'}</span>
                  <span className="font-mono inline-flex items-baseline gap-1">
                    <span>Ε ＝ 2</span>
                    <Pow base="x" exp="2" />
                    <span>＋ x － 10</span>
                  </span>
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
                    <strong>Forgetting to multiply the second term inside parentheses:</strong>{' '}
                    <span className="font-mono font-bold line-through text-red-700">3(x + 4) = 3x + 4</span>{' '}
                    → <span className="font-mono font-bold text-emerald-800">Correct: 3x + 12</span>.
                  </>
                ) : (
                  <>
                    <strong>Να ξεχνάμε να πολλαπλασιάσουμε τον 2ο όρο της παρένθεσης:</strong>{' '}
                    <span className="font-mono font-bold line-through text-red-700">3(x ＋ 4) ＝ 3x ＋ 4</span>{' '}
                    → <span className="font-mono font-bold text-emerald-800">Σωστό: 3x ＋ 12</span>.
                  </>
                )}
              </div>
            </li>

            <li className="flex items-start gap-2.5">
              <span className="font-black text-amber-600 mt-0.5">✕</span>
              <div>
                {isEn ? (
                  <>
                    <strong>Sign error with negative multiplier:</strong>{' '}
                    <span className="font-mono font-bold line-through text-red-700">-2(x − 5) = -2x − 10</span>{' '}
                    → <span className="font-mono font-bold text-emerald-800">Correct: -2x + 10</span>.
                  </>
                ) : (
                  <>
                    <strong>Λάθος πρόσημο με αρνητικό συντελεστή:</strong>{' '}
                    <span className="font-mono font-bold line-through text-red-700">-2(x － 5) ＝ -2x － 10</span>{' '}
                    → <span className="font-mono font-bold text-emerald-800">Σωστό: -2x ＋ 10</span>.
                  </>
                )}
              </div>
            </li>

            <li className="flex items-start gap-2.5">
              <span className="font-black text-amber-600 mt-0.5">✕</span>
              <div className="inline-flex flex-wrap items-baseline gap-1">
                <span>
                  {isEn
                    ? 'Forgetting the middle cross-terms in double distributive:'
                    : 'Να ξεχνάμε τους μεσαίους όρους στη διπλή επιμεριστική:'}
                </span>
                <span className="font-mono font-bold line-through text-red-700 inline-flex items-baseline gap-1">
                  <span>(x ＋ 2)(x ＋ 3) ＝</span>
                  <Pow base="x" exp="2" />
                  <span>＋ 6</span>
                </span>
                <span>→</span>
                <span className="font-mono font-bold text-emerald-800 inline-flex items-baseline gap-1">
                  <span>{isEn ? 'Correct:' : 'Σωστό:'}</span>
                  <Pow base="x" exp="2" />
                  <span>＋ 5x ＋ 6</span>
                </span>
                <span>.</span>
              </div>
            </li>
          </ul>
        </section>

        {/* 6. BOTTOM CALLOUT BANNER */}
        <section className="rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 lg:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black mb-2">
              {isEn
                ? 'Ready to practice the Distributive & Double Distributive Property?'
                : 'Έτοιμος να εξασκηθείς στην Επιμεριστική & Διπλή Επιμεριστική Ιδιότητα;'}
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base">
              {isEn
                ? 'Solve 12 dynamically generated exercises with instant step-by-step feedback.'
                : 'Λύσε 12 δυναμικά παραγόμενες ασκήσεις με άμεση διόρθωση και πίνακες ανάλυσης.'}
            </p>
          </div>

          <Link
            href="/b-gymnasiou/10-epimeristiki-idiotita-ask"
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