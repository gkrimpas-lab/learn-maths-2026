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

export default function AlgebrikiParastasiTheoryPage() {
  const router = useRouter();
  const isEn = router?.locale === 'en';
  const locCode = isEn ? 'en-US' : 'el-GR';

  // --- State Διαδραστικού Εργαστηρίου ---
  const [activeLabTab, setActiveLabTab] = useState('likeTerms'); // 'likeTerms' | 'evalEquiv'

  // Tab 1: Αναγωγή ομοίων όρων & αναγνώριση μερών παράστασης
  const [selectedExprIdx, setSelectedExprIdx] = useState(0);

  // Tab 2: Αριθμητική τιμή & Ισοδύναμες παραστάσεις
  const [xVal, setXVal] = useState(3); // -4 to 6
  const [yVal, setYVal] = useState(2); // -3 to 5

  // Προκαθορισμένες παραστάσεις για το Tab 1
  const expressionSamples = [
    {
      rawNode: (
        <span className="inline-flex flex-wrap items-baseline gap-x-1.5">
          <span className="px-2 py-0.5 rounded bg-indigo-500/30 border border-indigo-400/50 text-indigo-200">5x</span>
          <span>＋</span>
          <span className="px-2 py-0.5 rounded bg-amber-500/30 border border-amber-400/50 text-amber-200">3</span>
          <span>＋</span>
          <span className="px-2 py-0.5 rounded bg-indigo-500/30 border border-indigo-400/50 text-indigo-200">2x</span>
          <span>－</span>
          <span className="px-2 py-0.5 rounded bg-amber-500/30 border border-amber-400/50 text-amber-200">7</span>
        </span>
      ),
      groupedNode: (
        <span className="inline-flex flex-wrap items-baseline gap-x-1.5">
          <span>(5 ＋ 2)x ＋ (3 － 7)</span>
        </span>
      ),
      reducedNode: <span>7x － 4</span>,
      likeGroup1: '5x, 2x',
      likeGroup2: '3, -7',
      constTerm: '-4',
      noteEl: 'Οι όροι 5x και 2x έχουν το ίδιο μεταβλητό μέρος (x), άρα προσθέτουμε τους συντελεστές τους: 5 ＋ 2 ＝ 7.',
      noteEn: 'Terms 5x and 2x share the same variable part (x), so we add their coefficients: 5 ＋ 2 ＝ 7.',
    },
    {
      rawNode: (
        <span className="inline-flex flex-wrap items-baseline gap-x-1.5">
          <span className="px-2 py-0.5 rounded bg-purple-500/30 border border-purple-400/50 text-purple-200 inline-flex items-baseline">
            <span>4</span>
            <Pow base="x" exp="2" />
          </span>
          <span>－</span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/30 border border-emerald-400/50 text-emerald-200">3x</span>
          <span>－</span>
          <span className="px-2 py-0.5 rounded bg-purple-500/30 border border-purple-400/50 text-purple-200 inline-flex items-baseline">
            <Pow base="x" exp="2" />
          </span>
          <span>＋</span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/30 border border-emerald-400/50 text-emerald-200">5x</span>
          <span>＋</span>
          <span className="px-2 py-0.5 rounded bg-amber-500/30 border border-amber-400/50 text-amber-200">1</span>
        </span>
      ),
      groupedNode: (
        <span className="inline-flex flex-wrap items-baseline gap-x-1.5">
          <span>(4 － 1)</span>
          <Pow base="x" exp="2" />
          <span>＋ (-3 ＋ 5)x ＋ 1</span>
        </span>
      ),
      reducedNode: (
        <span className="inline-flex items-baseline gap-1">
          <span>3</span>
          <Pow base="x" exp="2" />
          <span>＋ 2x ＋ 1</span>
        </span>
      ),
      likeGroup1: '4x², -x² (συντελεστής -1)',
      likeGroup2: '-3x, 5x',
      constTerm: '+1',
      noteEl: 'Προσοχή: Το -x² έχει συντελεστή -1, ενώ τα 4x² και 5x ΔΕΝ είναι όμοιοι όροι (διαφορετικός εκθέτης στο x).',
      noteEn: 'Note: -x² has coefficient -1, while 4x² and 5x are NOT like terms (different exponent on x).',
    },
    {
      rawNode: (
        <span className="inline-flex flex-wrap items-baseline gap-x-1.5">
          <span className="px-2 py-0.5 rounded bg-indigo-500/30 border border-indigo-400/50 text-indigo-200">6α</span>
          <span>－</span>
          <span className="px-2 py-0.5 rounded bg-rose-500/30 border border-rose-400/50 text-rose-200">2β</span>
          <span>－</span>
          <span className="px-2 py-0.5 rounded bg-indigo-500/30 border border-indigo-400/50 text-indigo-200">6α</span>
          <span>＋</span>
          <span className="px-2 py-0.5 rounded bg-rose-500/30 border border-rose-400/50 text-rose-200">5β</span>
        </span>
      ),
      groupedNode: <span>(6 － 6)α ＋ (-2 ＋ 5)β</span>,
      reducedNode: <span>3β</span>,
      likeGroup1: '6α, -6α (αντίθετοι όροι ＝ 0)',
      likeGroup2: '-2β, 5β',
      constTerm: '0',
      noteEl: 'Οι αντίθετοι όροι 6α και -6α έχουν άθροισμα 0 (απαλείφονται) και μένει μόνο 3β.',
      noteEn: 'Opposite terms 6α and -6α sum to 0 (cancel out), leaving only 3β.',
    },
    {
      rawNode: (
        <span className="inline-flex flex-wrap items-center gap-x-1.5">
          <span className="px-2 py-0.5 rounded bg-indigo-500/30 border border-indigo-400/50 text-indigo-200 inline-flex items-center">
            <Frac num="1" den="2" />
            <span>x</span>
          </span>
          <span>＋</span>
          <span className="px-2 py-0.5 rounded bg-amber-500/30 border border-amber-400/50 text-amber-200">4</span>
          <span>＋</span>
          <span className="px-2 py-0.5 rounded bg-indigo-500/30 border border-indigo-400/50 text-indigo-200 inline-flex items-center">
            <Frac num="3" den="2" />
            <span>x</span>
          </span>
          <span>－</span>
          <span className="px-2 py-0.5 rounded bg-amber-500/30 border border-amber-400/50 text-amber-200">1</span>
        </span>
      ),
      groupedNode: (
        <span className="inline-flex flex-wrap items-center gap-x-1">
          <span>(</span>
          <Frac num="1" den="2" />
          <span>＋</span>
          <Frac num="3" den="2" />
          <span>)x ＋ (4 － 1)</span>
        </span>
      ),
      reducedNode: <span>2x ＋ 3</span>,
      likeGroup1: '1/2 x, 3/2 x',
      likeGroup2: '4, -1',
      constTerm: '+3',
      noteEl: 'Οι συντελεστές μπορεί να είναι και ρητοί αριθμοί (κλάσματα/δεκαδικοί): 1/2 ＋ 3/2 ＝ 4/2 ＝ 2.',
      noteEn: 'Coefficients can be rational numbers: 1/2 ＋ 3/2 ＝ 4/2 ＝ 2.',
    },
  ];

  const curSample = expressionSamples[selectedExprIdx];

  // Tab 2: Υπολογισμός τιμών ισοδύναμων παραστάσεων A = 3x + 2y + x - y + 4 και B = 4x + y + 4
  const valA = 3 * xVal + 2 * yVal + xVal - yVal + 4;
  const valB = 4 * xVal + yVal + 4;
  const valC = 4 * xVal + 2 * yVal + 4;
  const fmtSub = (v) => (v < 0 ? `(${v})` : String(v));

  

  const pageTitle = isEn
    ? 'Chapter 8: Algebraic Expressions, Like Terms & Equivalent Expressions | Grade 8'
    : "Κεφάλαιο 8: Αλγεβρικές Παραστάσεις, Όμοιοι Όροι & Ισοδύναμες Παραστάσεις | Β' Γυμνασίου";

  const actionButton = (
    <Link
      href="/b-gymnasiou/09-algebriki-parastasi-ask"
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
                    isEn ? 'CHAPTER 8 • GRADE 8' : "ΚΕΦΑΛΑΙΟ 8 • Β' ΓΥΜΝΑΣΙΟΥ"
                  )}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-3">
                {isEn
                  ? 'Algebraic Expressions: Terms, Like Terms & Equivalent Expressions'
                  : 'Αλγεβρικές Παραστάσεις: Όροι, Όμοιοι Όροι & Ισοδύναμες Παραστάσεις'}
              </h1>
              <p className="text-indigo-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                {isEn
                  ? 'Understand algebraic expressions as products or sums, identify variables, coefficients and constant terms, combine like terms, and evaluate numerical values.'
                  : 'Κατανόησε την αλγεβρική παράσταση ως γινόμενο ή ως άθροισμα, αναγνώρισε μεταβλητές, συντελεστές και σταθερό όρο, κάνε αναγωγή ομοίων όρων και υπολόγισε αριθμητικές τιμές.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <Link
                href="/b-gymnasiou/09-algebriki-parastasi-ask"
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
          {/* ΚΑΡΤΑ 1: Έννοια Αλγεβρικής Παράστασης (Γινόμενο vs Άθροισμα) */}
          <article className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-base shrink-0">
                  1
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  {isEn
                    ? 'Algebraic Expression as a Product or Sum'
                    : 'Έννοια Αλγεβρικής Παράστασης (Γινόμενο ή Άθροισμα)'}
                </h2>
              </div>

              <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">
                {isEn ? (
                  <>
                    An <strong>algebraic expression</strong> is formed by numbers and letters (
                    <strong>variables</strong>) connected by operations. Depending on the final operation,
                    it is viewed either as a <strong>product</strong> or as an{' '}
                    <strong>algebraic sum</strong>:
                  </>
                ) : (
                  <>
                    <strong>Αλγεβρική παράσταση</strong> ονομάζεται μια παράσταση που περιέχει αριθμούς
                    και γράμματα (<strong>μεταβλητές</strong>) συνδεδεμένα με πράξεις. Ανάλογα με την
                    τελευταία πράξη που εκτελείται, τη διακρίνουμε σε <strong>γινόμενο</strong> ή{' '}
                    <strong>αλγεβρικό άθροισμα</strong>:
                  </>
                )}
              </p>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200">
                  <div className="font-black text-indigo-950 mb-1">
                    {isEn ? '1. Algebraic Expression as a Product (Monomial):' : '1. Ως Γινόμενο (Μονώνυμο):'}
                  </div>
                  <p className="text-slate-700 inline-flex flex-wrap items-center gap-x-1.5 gap-y-1">
                    <span>{isEn ? 'Product of a rational number and powers of variables:' : 'Γινόμενο ρητού αριθμού και δυνάμεων μεταβλητών:'}</span>
                    <span className="font-mono font-bold text-indigo-800 inline-flex flex-wrap items-center gap-x-1.5">
                      <span>-5x,</span>
                      <span className="inline-flex items-center">
                        <Frac num="2" den="3" />
                        <Pow base="α" exp="2" />
                        <span>β</span>
                      </span>
                      <span>, 4(x ＋ 1)</span>
                    </span>
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                  <div className="font-black text-emerald-950 mb-1">
                    {isEn ? '2. Algebraic Expression as a Sum:' : '2. Ως Αλγεβρικό Άθροισμα:'}
                  </div>
                  <p className="text-slate-700 inline-flex flex-wrap items-baseline gap-1">
                    <span>{isEn ? 'Sum of individual algebraic terms:' : 'Άθροισμα επιμέρους προσθετέων (όρων):'}</span>
                    <span className="font-mono font-bold text-emerald-800 inline-flex items-baseline gap-1">
                      <span>3x － 2y ＋ 7 ＝ 3x ＋ (-2y) ＋ 7</span>
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </article>

          {/* ΚΑΡΤΑ 2: Ανατομία Όρου (Συντελεστής, Μεταβλητή, Σταθερός Όρος) */}
          <article className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-base shrink-0">
                  2
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  {isEn
                    ? 'Coefficient, Variable & Constant Term'
                    : 'Συντελεστής, Μεταβλητή & Σταθερός Όρος'}
                </h2>
              </div>

              {/* SVG Ανατομία της παράστασης -4x² + 7x - 9 */}
              <div className="w-full overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 p-3 mb-4">
                <svg
                  viewBox="0 0 460 155"
                  className="w-full h-auto max-w-full block select-none"
                  role="img"
                  aria-label="Anatomy of algebraic expression -4x^2 + 7x - 9"
                >
                  {/* Κύρια παράσταση */}
                  <text x="115" y="45" textAnchor="middle" fontSize="22" fontWeight="900" fill="#a5b4fc" fontFamily="monospace">
                    -4x²
                  </text>
                  <text x="235" y="45" textAnchor="middle" fontSize="22" fontWeight="900" fill="#6ee7b7" fontFamily="monospace">
                    ＋ 7x
                  </text>
                  <text x="355" y="45" textAnchor="middle" fontSize="22" fontWeight="900" fill="#fcd34d" fontFamily="monospace">
                    － 9
                  </text>

                  {/* Δείκτες */}
                  <line x1="96" y1="54" x2="72" y2="85" stroke="#818cf8" strokeWidth="1.8" />
                  <rect x="14" y="86" width="116" height="46" rx="8" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1.3" />
                  <text x="72" y="105" textAnchor="middle" fontSize="10" fontWeight="800" fill="#c7d2fe">
                    {isEn ? 'Coefficient' : 'Συντελεστής'}
                  </text>
                  <text x="72" y="122" textAnchor="middle" fontSize="12" fontWeight="900" fill="#ffffff" fontFamily="monospace">
                    -4
                  </text>

                  <line x1="126" y1="54" x2="195" y2="85" stroke="#34d399" strokeWidth="1.8" />
                  <rect x="142" y="86" width="122" height="46" rx="8" fill="#064e3b" stroke="#10b981" strokeWidth="1.3" />
                  <text x="203" y="105" textAnchor="middle" fontSize="10" fontWeight="800" fill="#a7f3d0">
                    {isEn ? 'Variable (letter)' : 'Μεταβλητή'}
                  </text>
                  <text x="203" y="122" textAnchor="middle" fontSize="12" fontWeight="900" fill="#ffffff" fontFamily="monospace">
                    x
                  </text>

                  <line x1="355" y1="54" x2="355" y2="85" stroke="#fbbf24" strokeWidth="1.8" />
                  <rect x="278" y="86" width="166" height="46" rx="8" fill="#451a03" stroke="#f59e0b" strokeWidth="1.3" />
                  <text x="361" y="105" textAnchor="middle" fontSize="10" fontWeight="800" fill="#fde68a">
                    {isEn ? 'Constant Term' : 'Σταθερός Όρος'}
                  </text>
                  <text x="361" y="122" textAnchor="middle" fontSize="12" fontWeight="900" fill="#ffffff" fontFamily="monospace">
                    -9 ({isEn ? 'no variable' : 'χωρίς x'})
                  </text>
                </svg>
              </div>

              <div className="text-xs sm:text-sm text-slate-700 space-y-1.5">
                <div>
                  • <strong>{isEn ? 'Coefficient:' : 'Συντελεστής:'}</strong>{' '}
                  {isEn
                    ? 'The rational number multiplying the variable part (e.g. in x the coefficient is +1, in -x it is -1).'
                    : 'Ο ρητός αριθμός που πολλαπλασιάζει το μεταβλητό μέρος (π.χ. στο x ο συντελεστής είναι +1, στο -x είναι -1).'}
                </div>
                <div>
                  • <strong>{isEn ? 'Constant term:' : 'Σταθερός όρος:'}</strong>{' '}
                  {isEn
                    ? 'The term that contains no variable (e.g. -9).'
                    : 'Ο όρος που δεν περιέχει καμία μεταβλητή (π.χ. -9).'}
                </div>
              </div>
            </div>
          </article>

          {/* ΚΑΡΤΑ 3: Όμοιοι Όροι & Αναγωγή Ομοίων Όρων */}
          <article className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 rounded-xl bg-amber-600 text-white font-black flex items-center justify-center text-base shrink-0">
                  3
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  {isEn
                    ? 'Like Terms & Combining Like Terms'
                    : 'Όμοιοι Όροι & Αναγωγή Ομοίων Όρων'}
                </h2>
              </div>

              <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-4">
                {isEn ? (
                  <>
                    <strong>Like terms</strong> are terms that have the{' '}
                    <strong>exact same variable part</strong> (same variables raised to the exact same
                    exponents), differing only in their coefficients.
                  </>
                ) : (
                  <>
                    <strong>Όμοιοι όροι</strong> ονομάζονται οι όροι που έχουν{' '}
                    <strong>ακριβώς το ίδιο μεταβλητό μέρος</strong> (τις ίδιες μεταβλητές με τους ίδιους
                    εκθέτες) και διαφέρουν μόνο στους συντελεστές τους.
                  </>
                )}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm mb-4">
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div className="font-black text-emerald-900 mb-1">
                    ✓ {isEn ? 'Like Terms:' : 'Όμοιοι Όροι:'}
                  </div>
                  <div className="font-mono text-emerald-950 space-y-1">
                    <div>5x {isEn ? 'and' : 'και'} -3x</div>
                    <div className="inline-flex items-baseline gap-1">
                      <span>2</span>
                      <Pow base="α" exp="2" />
                      <span>β {isEn ? 'and' : 'και'} -7</span>
                      <Pow base="α" exp="2" />
                      <span>β</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200">
                  <div className="font-black text-rose-900 mb-1">
                    ✕ {isEn ? 'Unlike Terms:' : 'Μη Όμοιοι Όροι:'}
                  </div>
                  <div className="font-mono text-rose-950 space-y-1">
                    <div className="inline-flex items-baseline gap-1">
                      <span>4x {isEn ? 'and' : 'και'} 4</span>
                      <Pow base="x" exp="2" />
                    </div>
                    <div>3x {isEn ? 'and' : 'και'} 3y</div>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-950">
                <strong>{isEn ? 'Combining Like Terms (Reduction):' : 'Αναγωγή ομοίων όρων:'}</strong>{' '}
                {isEn
                  ? 'We add their coefficients and keep the common variable part unchanged: 5x − 3x + 2x = (5 − 3 + 2)x = 4x.'
                  : 'Προσθέτουμε τους συντελεστές τους και διατηρούμε το κοινό μεταβλητό μέρος: 5x － 3x ＋ 2x ＝ (5 － 3 ＋ 2)x ＝ 4x.'}
              </div>
            </div>
          </article>

          {/* ΚΑΡΤΑ 4: Αριθμητική Τιμή & Ισοδύναμες Αλγεβρικές Παραστάσεις */}
          <article className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 rounded-xl bg-purple-600 text-white font-black flex items-center justify-center text-base shrink-0">
                  4
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  {isEn
                    ? 'Numerical Value & Equivalent Expressions'
                    : 'Αριθμητική Τιμή & Ισοδύναμες Παραστάσεις'}
                </h2>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200">
                  <div className="font-black text-purple-950 text-sm sm:text-base mb-1">
                    {isEn ? '1. Numerical Value of an Expression:' : '1. Αριθμητική τιμή παράστασης:'}
                  </div>
                  <p>
                    {isEn ? (
                      <>
                        Replacing each variable with a given rational number yields a rational number
                        called the <strong>numerical value</strong>. For{' '}
                        <span className="font-mono font-bold">Π = 2x − 5</span> and{' '}
                        <span className="font-mono font-bold">x = 4</span>, we get{' '}
                        <span className="font-mono font-bold">Π = 2 · 4 − 5 = 3</span>.
                      </>
                    ) : (
                      <>
                        Αν αντικαταστήσουμε κάθε μεταβλητή με έναν συγκεκριμένο ρητό αριθμό, προκύπτει ένας
                        ρητός αριθμός που λέγεται <strong>αριθμητική τιμή</strong>. Για{' '}
                        <span className="font-mono font-bold">Π ＝ 2x － 5</span> και{' '}
                        <span className="font-mono font-bold">x ＝ 4</span>, έχουμε{' '}
                        <span className="font-mono font-bold">Π ＝ 2 · 4 － 5 ＝ 3</span>.
                      </>
                    )}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200">
                  <div className="font-black text-indigo-950 text-sm sm:text-base mb-1">
                    {isEn ? '2. Equivalent Algebraic Expressions:' : '2. Ισοδύναμες αλγεβρικές παραστάσεις:'}
                  </div>
                  <p>
                    {isEn ? (
                      <>
                        Two algebraic expressions are <strong>equivalent</strong> if they yield the{' '}
                        <strong>exact same numerical value</strong> for every permissible value of their
                        variables (e.g. <span className="font-mono font-bold">3x + 2x − 1</span> and{' '}
                        <span className="font-mono font-bold">5x − 1</span>).
                      </>
                    ) : (
                      <>
                        Δύο αλγεβρικές παραστάσεις λέγονται <strong>ισοδύναμες</strong> όταν παίρνουν{' '}
                        <strong>ακριβώς την ίδια αριθμητική τιμή</strong> για κάθε τιμή των μεταβλητών τους
                        (π.χ. <span className="font-mono font-bold">3x ＋ 2x － 1</span> και{' '}
                        <span className="font-mono font-bold">5x － 1</span>).
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-xs sm:text-sm text-slate-600">
              {isEn ? (
                <>
                  <strong>Note:</strong> Even a single number (e.g. 7) is a constant algebraic
                  expression whose numerical value is always 7.
                </>
              ) : (
                <>
                  <strong>Σημείωση:</strong> Ακόμη και ένας μόνος αριθμός (π.χ. 7) θεωρείται σταθερή
                  αλγεβρική παράσταση με αριθμητική τιμή πάντα 7.
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
                  ? 'Like Terms Reducer & Numerical Value Tester'
                  : 'Αναγωγή Ομοίων Όρων & Έλεγχος Ισοδυναμίας'}
              </h2>
            </div>

            <div className="flex flex-wrap gap-2 bg-slate-100 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => setActiveLabTab('likeTerms')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                  activeLabTab === 'likeTerms'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-700 hover:bg-white/70'
                }`}
              >
                {isEn ? '1. Combine Like Terms' : '1. Αναγωγή Ομοίων Όρων'}
              </button>
              <button
                type="button"
                onClick={() => setActiveLabTab('evalEquiv')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                  activeLabTab === 'evalEquiv'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-700 hover:bg-white/70'
                }`}
              >
                {isEn ? '2. Numerical Value & Equivalence' : '2. Αριθμητική Τιμή & Ισοδυναμία'}
              </button>
            </div>
          </div>

          {activeLabTab === 'likeTerms' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pt-6 items-center">
              {/* Επιλογή Παράστασης */}
              <div className="lg:col-span-5 space-y-4 min-w-0">
                <label className="block text-sm font-extrabold text-slate-800">
                  {isEn
                    ? 'Select an algebraic expression to reduce:'
                    : 'Επίλεξε αλγεβρική παράσταση για αναγωγή:'}
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { idx: 0, label: '5x ＋ 3 ＋ 2x － 7' },
                    { idx: 1, label: '4x² － 3x － x² ＋ 5x ＋ 1' },
                    { idx: 2, label: '6α － 2β － 6α ＋ 5β' },
                    { idx: 3, label: '½x ＋ 4 ＋ ³/₂x － 1' },
                  ].map((item) => (
                    <button
                      key={item.idx}
                      type="button"
                      onClick={() => setSelectedExprIdx(item.idx)}
                      className={`p-3 rounded-2xl border-2 font-mono font-bold text-xs sm:text-sm transition-all ${
                        selectedExprIdx === item.idx
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs sm:text-sm">
                  <div>
                    <strong className="text-indigo-800">
                      {isEn ? '• Like Terms Group 1:' : '• 1η Ομάδα Ομοίων Όρων:'}
                    </strong>{' '}
                    <span className="font-mono font-bold">{curSample.likeGroup1}</span>
                  </div>
                  <div>
                    <strong className="text-emerald-800">
                      {isEn ? '• Like Terms Group 2:' : '• 2η Ομάδα Ομοίων Όρων:'}
                    </strong>{' '}
                    <span className="font-mono font-bold">{curSample.likeGroup2}</span>
                  </div>
                  <div>
                    <strong className="text-amber-800">
                      {isEn ? '• Final Constant Term:' : '• Τελικός Σταθερός Όρος:'}
                    </strong>{' '}
                    <span className="font-mono font-bold">{curSample.constTerm}</span>
                  </div>
                </div>
              </div>

              {/* Dark-Mode Βήματα Αναγωγής */}
              <div className="lg:col-span-7 min-w-0">
                <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 sm:p-8 shadow-md space-y-5">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-indigo-300 border-b border-white/15 pb-3">
                    {isEn ? 'Step-by-Step Reduction' : 'Βήμα προς βήμα αναγωγή ομοίων όρων'}
                  </div>

                  <div className="space-y-3 font-mono text-base sm:text-xl font-black">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-sans text-slate-400 uppercase w-24">
                        {isEn ? 'Initial:' : 'Αρχική:'}
                      </span>
                      {curSample.rawNode}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-indigo-200">
                      <span className="text-xs font-sans text-slate-400 uppercase w-24">
                        {isEn ? 'Grouping:' : 'Ομαδοποίηση:'}
                      </span>
                      {curSample.groupedNode}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-sans text-slate-400 uppercase w-24">
                        {isEn ? 'Reduced:' : 'Ανηγμένη:'}
                      </span>
                      <span className="px-4 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300">
                        {curSample.reducedNode}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed pt-2 border-t border-white/10">
                    💡 {isEn ? curSample.noteEn : curSample.noteEl}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: ΑΡΙΘΜΗΤΙΚΗ ΤΙΜΗ & ΙΣΟΔΥΝΑΜΙΑ */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pt-6 items-center">
              <div className="lg:col-span-5 space-y-5 min-w-0">
                <div>
                  <div className="flex items-center justify-between text-sm font-bold text-slate-700 mb-1">
                    <span>{isEn ? '1. Value of variable x:' : '1. Τιμή μεταβλητής x:'}</span>
                    <span className="text-indigo-700 font-black font-mono text-base">
                      x ＝ {xVal.toLocaleString(locCode)}
                    </span>
                  </div>
                  <CustomSlider
                    min={-4}
                    max={6}
                    step={1}
                    value={xVal}
                    onChange={setXVal}
                    accentColor="indigo"
                    ariaLabel="Variable x slider"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>-4</span>
                    <span>0</span>
                    <span>+6</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm font-bold text-slate-700 mb-1">
                    <span>{isEn ? '2. Value of variable y:' : '2. Τιμή μεταβλητής y:'}</span>
                    <span className="text-emerald-700 font-black font-mono text-base">
                      y ＝ {yVal.toLocaleString(locCode)}
                    </span>
                  </div>
                  <CustomSlider
                    min={-3}
                    max={5}
                    step={1}
                    value={yVal}
                    onChange={setYVal}
                    accentColor="emerald"
                    ariaLabel="Variable y slider"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>-3</span>
                    <span>0</span>
                    <span>+5</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 min-w-0">
                <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 sm:p-8 shadow-md space-y-4">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-indigo-300 border-b border-white/15 pb-3">
                    {isEn
                      ? `Live Evaluation for x = ${xVal}, y = ${yVal}`
                      : `Ζωντανός Υπολογισμός για x ＝ ${xVal}, y ＝ ${yVal}`}
                  </div>

                  <div className="space-y-3 font-mono text-xs sm:text-sm">
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                        <span>Α ＝ 3x ＋ 2y ＋ x － y ＋ 4</span>
                        <span className="text-amber-300 font-bold">
                          ＝ 3·{fmtSub(xVal)} ＋ 2·{fmtSub(yVal)} ＋ {fmtSub(xVal)} － {fmtSub(yVal)} ＋ 4
                        </span>
                      </div>
                      <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-black shrink-0">
                        Α ＝ {valA}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                        <span>Β ＝ 4x ＋ y ＋ 4</span>
                        <span className="text-amber-300 font-bold">
                          ＝ 4·{fmtSub(xVal)} ＋ {fmtSub(yVal)} ＋ 4
                        </span>
                      </div>
                      <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-black shrink-0">
                        Β ＝ {valB}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                        <span>Γ ＝ 4x ＋ 2y ＋ 4</span>
                        <span className="text-amber-300 font-bold">
                          ＝ 4·{fmtSub(xVal)} ＋ 2·{fmtSub(yVal)} ＋ 4
                        </span>
                      </div>
                      <span className="px-3 py-1 rounded-lg bg-rose-500/20 text-rose-300 font-black shrink-0">
                        Γ ＝ {valC}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs sm:text-sm text-indigo-200 leading-relaxed pt-2">
                    {isEn ? (
                      <>
                        ✓ <strong>Α and Β are equivalent</strong> (they always give the exact same value:{' '}
                        {valA} = {valB}), while <strong>Γ is NOT equivalent</strong> (when y ≠ 0, Γ ≠ Α).
                      </>
                    ) : (
                      <>
                        ✓ Οι <strong>Α και Β είναι ισοδύναμες</strong> (δίνουν πάντα την ίδια τιμή:{' '}
                        {valA} ＝ {valB}), ενώ η <strong>Γ ΔΕΝ είναι ισοδύναμη</strong> (για y ≠ 0, Γ ≠ Α).
                      </>
                    )}
                  </div>
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

          {/* ΠΡΟΒΛΗΜΑ 1: Γεωμετρική περίμετρος σχήματος & αριθμητική τιμή */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-extrabold mb-3">
              <span>{toCleanUppercase(isEn ? 'PROBLEM 1' : 'ΠΡΟΒΛΗΜΑ 1')}</span>
            </div>
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 mb-5 leading-relaxed">
              {isEn ? (
                <>
                  A triangle has side lengths <span className="font-mono text-indigo-700">2x + 3</span>,{' '}
                  <span className="font-mono text-indigo-700">3x − 1</span>, and{' '}
                  <span className="font-mono text-indigo-700">x + 5</span> (in cm). (a) Write the
                  perimeter <span className="font-mono">Π</span> as an algebraic sum and reduce like
                  terms. (b) Find the perimeter in cm when <span className="font-mono">x = 4</span>.
                </>
              ) : (
                <>
                  Ένα τρίγωνο έχει πλευρές μήκους <span className="font-mono text-indigo-700">2x ＋ 3</span>,{' '}
                  <span className="font-mono text-indigo-700">3x － 1</span> και{' '}
                  <span className="font-mono text-indigo-700">x ＋ 5</span> (σε cm). (α) Να εκφράσετε την
                  περίμετρό του <span className="font-mono">Π</span> ως αλγεβρικό άθροισμα και να κάνετε
                  αναγωγή ομοίων όρων. (β) Να βρείτε την περίμετρο αν{' '}
                  <span className="font-mono">x ＝ 4</span>.
                </>
              )}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Responsive SVG Τριγώνου */}
              <div className="md:col-span-5 min-w-0">
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3">
                  <svg
                    viewBox="0 0 340 190"
                    className="w-full h-auto max-w-full block"
                    role="img"
                    aria-label="Triangle with algebraic side lengths"
                  >
                    <polygon
                      points="55,145 285,145 190,32"
                      fill="#eef2ff"
                      stroke="#4f46e5"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                    <text x="170" y="167" textAnchor="middle" fontSize="13" fontWeight="800" fill="#1e1b4b" fontFamily="monospace">
                      3x － 1
                    </text>
                    <text x="108" y="82" textAnchor="end" fontSize="13" fontWeight="800" fill="#065f46" fontFamily="monospace">
                      2x ＋ 3
                    </text>
                    <text x="248" y="82" textAnchor="start" fontSize="13" fontWeight="800" fill="#b45309" fontFamily="monospace">
                      x ＋ 5
                    </text>
                    <text x="178" y="114" textAnchor="middle" fontSize="13" fontWeight="900" fill="#4338ca" fontFamily="monospace">
                      Π ＝ 6x ＋ 7
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
                          {isEn ? '1. Sum of sides' : '1. Άθροισμα πλευρών'}
                        </td>
                        <td className="px-4 py-3">Π ＝ (2x ＋ 3) ＋ (3x － 1) ＋ (x ＋ 5)</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-sans font-bold text-slate-800">
                          {isEn ? '2. Combine like terms' : '2. Αναγωγή ομοίων όρων'}
                        </td>
                        <td className="px-4 py-3">
                          Π ＝ (2 ＋ 3 ＋ 1)x ＋ (3 － 1 ＋ 5) ＝ <strong>6x ＋ 7</strong>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-sans font-bold text-slate-800">
                          {isEn ? '3. Numerical value (x = 4)' : '3. Αριθμητική τιμή (x ＝ 4)'}
                        </td>
                        <td className="px-4 py-3">
                          Π ＝ 6 · 4 ＋ 7 ＝ 24 ＋ 7 ＝ <strong>31 cm</strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="sm:hidden space-y-2.5 text-sm">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="font-extrabold text-indigo-800 mb-1">
                      {isEn ? '1. Reduced Perimeter' : '1. Ανηγμένη περίμετρος'}
                    </div>
                    <div className="font-mono">Π ＝ (2＋3＋1)x ＋ (3－1＋5) ＝ 6x ＋ 7</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="font-extrabold text-indigo-800 mb-1">
                      {isEn ? '2. Value for x = 4' : '2. Τιμή για x ＝ 4'}
                    </div>
                    <div className="font-mono">Π ＝ 6 · 4 ＋ 7 ＝ 31 cm</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-bold text-sm sm:text-base">
                  {isEn
                    ? 'Final Answer: (a) Π = 6x + 7, (b) 31 cm'
                    : 'Τελική Απάντηση: (α) Π ＝ 6x ＋ 7, (β) 31 cm'}
                </div>
              </div>
            </div>
          </div>

          {/* ΠΡΟΒΛΗΜΑ 2: Έλεγχος ισοδυναμίας & εύρεση αγνώστου συντελεστή */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold mb-3">
              <span>{toCleanUppercase(isEn ? 'PROBLEM 2' : 'ΠΡΟΒΛΗΜΑ 2')}</span>
            </div>
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 mb-5 leading-relaxed">
              {isEn ? (
                <>
                  Given the algebraic expressions{' '}
                  <span className="font-mono text-indigo-700">Α = 5x − 2y + 3x + 6y − 4</span> and{' '}
                  <span className="font-mono text-indigo-700">Β = κ · x + 4y − 4</span>. (a) Find the
                  coefficient <span className="font-mono">κ</span> so that Α and Β are equivalent. (b)
                  Calculate their common numerical value when <span className="font-mono">x = -2</span>{' '}
                  and <span className="font-mono">y = 3</span>.
                </>
              ) : (
                <>
                  Δίνονται οι αλγεβρικές παραστάσεις{' '}
                  <span className="font-mono text-indigo-700">Α ＝ 5x － 2y ＋ 3x ＋ 6y － 4</span> και{' '}
                  <span className="font-mono text-indigo-700">Β ＝ κ · x ＋ 4y － 4</span>. (α) Να βρείτε
                  τον συντελεστή <span className="font-mono">κ</span> ώστε οι Α και Β να είναι
                  ισοδύναμες. (β) Να υπολογίσετε την κοινή αριθμητική τους τιμή για{' '}
                  <span className="font-mono">x ＝ -2</span> και <span className="font-mono">y ＝ 3</span>.
                </>
              )}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-5 min-w-0">
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 flex flex-col items-center space-y-2.5">
                  <div className="w-full rounded-xl bg-indigo-50 border-2 border-indigo-500 px-4 py-3 text-indigo-950 font-extrabold text-xs sm:text-sm font-mono">
                    Α ＝ (5＋3)x ＋ (-2＋6)y － 4 ＝ 8x ＋ 4y － 4
                  </div>
                  <div className="w-full rounded-xl bg-amber-50 border-2 border-amber-500 px-4 py-3 text-amber-950 font-extrabold text-xs sm:text-sm font-mono">
                    Α ≡ Β ⇔ 8x ＋ 4y － 4 ≡ κ·x ＋ 4y － 4 ⇒ κ ＝ 8
                  </div>
                  <div className="w-full rounded-xl bg-emerald-50 border-2 border-emerald-600 px-4 py-3 text-emerald-950 font-extrabold text-xs sm:text-sm font-mono">
                    8·(-2) ＋ 4·3 － 4 ＝ -16 ＋ 12 － 4 ＝ -8
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
                          {isEn ? '1. Reduce A' : '1. Αναγωγή της Α'}
                        </td>
                        <td className="px-4 py-3">Α ＝ (5 ＋ 3)x ＋ (-2 ＋ 6)y － 4 ＝ 8x ＋ 4y － 4</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-sans font-bold text-slate-800">
                          {isEn ? '2. Match coefficients' : '2. Σύγκριση συντελεστών'}
                        </td>
                        <td className="px-4 py-3">
                          Για να είναι Α και Β ισοδύναμες: <strong>κ ＝ 8</strong>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-sans font-bold text-slate-800">
                          {isEn ? '3. Numerical value' : '3. Αριθμητική τιμή'}
                        </td>
                        <td className="px-4 py-3">
                          8 · (-2) ＋ 4 · 3 － 4 ＝ -16 ＋ 12 － 4 ＝ <strong>-8</strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="sm:hidden space-y-2.5 text-sm">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="font-extrabold text-amber-800 mb-1">
                      {isEn ? '1. Coefficient κ' : '1. Συντελεστής κ'}
                    </div>
                    <div className="font-mono">Α ＝ 8x ＋ 4y － 4 ⇒ κ ＝ 8</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="font-extrabold text-amber-800 mb-1">
                      {isEn ? '2. Value for x=-2, y=3' : '2. Τιμή για x＝-2, y＝3'}
                    </div>
                    <div className="font-mono">8·(-2) ＋ 4·3 － 4 ＝ -8</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-bold text-sm sm:text-base">
                  {isEn
                    ? 'Final Answer: (a) κ = 8, (b) -8'
                    : 'Τελική Απάντηση: (α) κ ＝ 8, (β) -8'}
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
                    <strong>Adding unlike terms:</strong> Never combine variable terms with constant
                    terms (<span className="font-mono font-bold line-through text-red-700">3x + 2 = 5x</span>
                    ). Keep <span className="font-mono font-bold text-emerald-800">3x + 2</span> as it is!
                  </>
                ) : (
                  <>
                    <strong>Να προσθέτουμε μη όμοιους όρους:</strong> Δεν ενώνουμε όρο με μεταβλητή και
                    σταθερό όρο (
                    <span className="font-mono font-bold line-through text-red-700">3x ＋ 2 ＝ 5x</span>
                    ). Η παράσταση παραμένει{' '}
                    <span className="font-mono font-bold text-emerald-800">3x ＋ 2</span>!
                  </>
                )}
              </div>
            </li>

            <li className="flex items-start gap-2.5">
              <span className="font-black text-amber-600 mt-0.5">✕</span>
              <div className="inline-flex flex-wrap items-baseline gap-1">
                <span>
                  {isEn
                    ? 'Combining different powers of the same variable:'
                    : 'Να ενώνουμε διαφορετικές δυνάμεις της ίδιας μεταβλητής:'}
                </span>
                <span className="font-mono font-bold line-through text-red-700 inline-flex items-baseline gap-1">
                  <Pow base="x" exp="2" />
                  <span>＋ x ＝</span>
                  <Pow base="x" exp="3" />
                </span>
                <span>.</span>
              </div>
            </li>

            <li className="flex items-start gap-2.5">
              <span className="font-black text-amber-600 mt-0.5">✕</span>
              <div>
                {isEn ? (
                  <>
                    <strong>Forgetting parentheses when substituting negative numbers:</strong> For{' '}
                    <span className="font-mono font-bold">x = -3</span> in{' '}
                    <span className="font-mono font-bold">2x</span>, write{' '}
                    <span className="font-mono font-bold text-emerald-800">2 · (-3) = -6</span> (not 2 − 3).
                  </>
                ) : (
                  <>
                    <strong>Να ξεχνάμε τις παρενθέσεις στην αντικατάσταση αρνητικού αριθμού:</strong> Για{' '}
                    <span className="font-mono font-bold">x ＝ -3</span> στην παράσταση{' '}
                    <span className="font-mono font-bold">2x</span>, γράφουμε{' '}
                    <span className="font-mono font-bold text-emerald-800">2 · (-3) ＝ -6</span> (όχι 2 － 3).
                  </>
                )}
              </div>
            </li>
          </ul>
        </section>

        {/* 6. BOTTOM CALLOUT BANNER */}
        <section className="rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 lg:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black mb-2">
              {isEn
                ? 'Ready to practice Algebraic Expressions & Like Terms?'
                : 'Έτοιμος να εξασκηθείς στις Αλγεβρικές Παραστάσεις & τους Ομοίους Όρους;'}
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base">
              {isEn
                ? 'Solve 12 dynamically generated exercises with instant step-by-step feedback.'
                : 'Λύσε 12 δυναμικά παραγόμενες ασκήσεις με άμεση διόρθωση και πίνακες ανάλυσης.'}
            </p>
          </div>

          <Link
            href="/b-gymnasiou/09-algebriki-parastasi-ask"
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