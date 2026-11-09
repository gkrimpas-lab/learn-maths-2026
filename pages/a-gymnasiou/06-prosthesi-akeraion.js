import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

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

const translations = {
  el: {
    metaTitle: "Πρόσθεση Ακεραίων Αριθμών | Α' Γυμνασίου",
    metaDescription: "Θεωρία και διαδραστική κατανόηση της πρόσθεσης ακεραίων στον άξονα (κίνηση δεξιά/αριστερά).",
    backText: "Α' Γυμνασίου",
    exercisesBtn: "ΑΣΚΗΣΕΙΣ",
    gradeBadge: "Α' ΓΥΜΝΑΣΙΟΥ • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ",
    mainTitle: "Πρόσθεση Ακέραιων Αριθμών",
    heroDesc: "Κατανοούμε την πρόσθεση ως κίνηση στον άξονα: το ＋ σημαίνει μετακίνηση προς τα δεξιά, ενώ το － σημαίνει μετακίνηση προς τα αριστερά!",
    sec1Title: "Κανόνες Πρόσθεσης & Κίνηση στον Άξονα",
    sameSignBadge: "ΟΜΟΣΗΜΟΙ ΑΡΙΘΜΟΙ",
    sameSignTitle: "Ίδιο Πρόσημο",
    sameSignDesc: "Κινούμαστε προς την ίδια κατεύθυνση. Κρατάμε το κοινό πρόσημο και προσθέτουμε τις απόλυτες τιμές:",
    diffSignBadge: "ΕΤΕΡΟΣΗΜΟΙ ΑΡΙΘΜΟΙ",
    diffSignTitle: "Αντίθετα Πρόσημα",
    diffSignDesc: "Οι κινήσεις είναι αντίθετες. Κερδίζει η κατεύθυνση με τη μεγαλύτερη απόλυτη τιμή και αφαιρούμε τις αποστάσεις:",
    sec2Title: "Διαδραστικό Εργαστήριο: Η Φυσική Σημασία των Προσήμων",
    numAControl: "1ος ΑΡΙΘΜΟΣ (ΑΡΧΙΚΗ ΘΕΣΗ ΑΠΟ ΤΟ 0)",
    numBControl: "2ος ΑΡΙΘΜΟΣ (ΜΕΤΑΤΟΠΙΣΗ)",
    moveRight: "➡️ ΜΕΤΑΚΙΝΗΣΗ ΔΕΞΙΑ ΚΑΤΑ",
    moveLeft: "⬅️ ΜΕΤΑΚΙΝΗΣΗ ΑΡΙΣΤΕΡΑ ΚΑΤΑ",
    positionsLabel: "ΘΕΣΕΙΣ",
    noMove: "⏹️ ΚΑΜΙΑ ΜΕΤΑΚΙΝΗΣΗ (ΒΗΜΑ 0)",
    operationResultTitle: "ΠΡΑΞΗ & ΑΠΟΤΕΛΕΣΜΑ",
    step1Label: "1ο:",
    step2Right: "➡️ δεξιά",
    step2Left: "⬅️ αριστερά",
    endLabel: "ΤΕΛΟΣ",
    explanationNeg: "σημαίνει ότι από το",
    explanationNeg2: "κινούμαστε",
    explanationNeg3: "προς τα ΑΡΙΣΤΕΡΑ ⬅️.",
    explanationPos: "σημαίνει ότι από το",
    explanationPos2: "κινούμαστε",
    explanationPos3: "προς τα ΔΕΞΙΑ ➡️.",
    explanationZero: "Το δεύτερο βήμα είναι 0, παραμένουμε στο σημείο",
    signWord: "Το πρόσημο",
    atNum: "στο",
  },
  en: {
    metaTitle: "Adding Integers | 7th Grade Mathematics",
    metaDescription: "Theory and interactive conceptualization of integer addition on the number line (movement right/left).",
    backText: "7th Grade",
    exercisesBtn: "EXERCISES",
    gradeBadge: "GRADE 7 • THEORY & LAB",
    mainTitle: "Addition of Integers",
    heroDesc: "Understand addition as movement along the number line: ＋ means moving to the right, while － means moving to the left!",
    sec1Title: "Addition Rules & Movement on the Number Line",
    sameSignBadge: "NUMBERS WITH SAME SIGN",
    sameSignTitle: "Same Sign",
    sameSignDesc: "We move in the exact same direction. We keep the common sign and add their absolute values:",
    diffSignBadge: "NUMBERS WITH DIFFERENT SIGNS",
    diffSignTitle: "Opposite Signs",
    diffSignDesc: "The movements oppose each other. The direction with the greater absolute value prevails and we subtract the distances:",
    sec2Title: "Interactive Lab: The Physical Meaning of Signs",
    numAControl: "1st NUMBER (INITIAL POSITION FROM 0)",
    numBControl: "2nd NUMBER (DISPLACEMENT)",
    moveRight: "➡️ MOVE RIGHT BY",
    moveLeft: "⬅️ MOVE LEFT BY",
    positionsLabel: "UNITS",
    noMove: "⏹️ NO MOVEMENT (STEP 0)",
    operationResultTitle: "OPERATION & RESULT",
    step1Label: "1st:",
    step2Right: "➡️ right",
    step2Left: "⬅️ left",
    endLabel: "END",
    explanationNeg: "means starting from",
    explanationNeg2: "and moving",
    explanationNeg3: "to the LEFT ⬅️.",
    explanationPos: "means starting from",
    explanationPos2: "and moving",
    explanationPos3: "to the RIGHT ➡️.",
    explanationZero: "The second step is 0, so we stay at point",
    signWord: "The sign",
    atNum: "on",
  }
};

export default function ProsthesiAkeraionTheoria() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];

  const [numA, setNumA] = useState(3);
  const [numB, setNumB] = useState(-7);

  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  const sum = useMemo(() => numA + numB, [numA, numB]);
  const absA = useMemo(() => Math.abs(numA), [numA]);
  const absB = useMemo(() => Math.abs(numB), [numB]);

  const formatSigned = (val) => {
    if (val > 0) return `＋${val}`;
    if (val < 0) return `－${Math.abs(val)}`;
    return '0';
  };

  const formatSignedParen = (val) => {
    if (val > 0) return `(＋${val})`;
    if (val < 0) return `(－${Math.abs(val)})`;
    return '0';
  };

  const getSvgX = (val) => 430 + val * 21;

  const directionB = useMemo(() => {
    if (numB > 0) {
      return {
        text: `${t.moveRight} ${absB} ${t.positionsLabel}`,
        color: 'text-sky-400',
        bg: 'bg-sky-500/10 border-sky-400/30'
      };
    }
    if (numB < 0) {
      return {
        text: `${t.moveLeft} ${absB} ${t.positionsLabel}`,
        color: 'text-rose-400',
        bg: 'bg-rose-500/10 border-rose-400/30'
      };
    }
    return {
      text: t.noMove,
      color: 'text-slate-400',
      bg: 'bg-slate-800 border-slate-700'
    };
  }, [numB, absB, t]);

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDescription}
      backUrl="/a-gymnasiou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/06-prosthesi-akeraion-ask"
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm md:text-base transition-all shadow-md shrink-0 touch-manipulation"
        >
          <span>🎯</span>
          <span>{toCleanUppercase(t.exercisesBtn)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden box-border space-y-8 sm:space-y-12">
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-5 sm:p-8 lg:p-12 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-3 sm:space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] sm:text-xs md:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 break-words [overflow-wrap:anywhere]">
              {toCleanUppercase(t.gradeBadge)}
            </span>
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white break-words [overflow-wrap:anywhere]">
              {t.mainTitle}
            </h1>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-indigo-100/90 leading-relaxed break-words [overflow-wrap:anywhere]">
              {t.heroDesc}
            </p>
          </div>
        </section>

        {/* 1. ΘΕΩΡΗΤΙΚΟΙ ΚΑΝΟΝΕΣ */}
        <section className="bg-white rounded-3xl p-4 sm:p-7 lg:p-10 shadow-sm border border-slate-200/80 space-y-6 sm:space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-sm sm:text-lg shrink-0">
                1
              </span>
              <span>{t.sec1Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed">
            <div className="p-4 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="text-[11px] sm:text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  {toCleanUppercase(t.sameSignBadge)}
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-lg md:text-xl">
                  {t.sameSignTitle}
                </h3>
                <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                  {t.sameSignDesc}
                </p>
                <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-xs sm:text-sm text-indigo-950 space-y-1.5">
                  <div className="break-words [overflow-wrap:anywhere]">(＋3) ＋ (＋5) ＝ ＋(3 ＋ 5) ＝ <strong>＋8</strong></div>
                  <div className="break-words [overflow-wrap:anywhere]">(－4) ＋ (－6) ＝ －(4 ＋ 6) ＝ <strong>－10</strong></div>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="text-[11px] sm:text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  {toCleanUppercase(t.diffSignBadge)}
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-lg md:text-xl">
                  {t.diffSignTitle}
                </h3>
                <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                  {t.diffSignDesc}
                </p>
                <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-xs sm:text-sm text-indigo-950 space-y-1.5">
                  <div className="break-words [overflow-wrap:anywhere]">(＋8) ＋ (－3) ＝ ＋(8 － 3) ＝ <strong>＋5</strong></div>
                  <div className="break-words [overflow-wrap:anywhere]">(－9) ＋ (＋4) ＝ －(9 － 4) ＝ <strong>－5</strong></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΜΕ ΒΕΛΗ ΚΑΙ ΕΝΔΕΙΞΗ ΚΑΤΕΥΘΥΝΣΗΣ */}
        <section className="bg-white rounded-3xl p-4 sm:p-7 lg:p-10 shadow-sm border border-slate-200/80 space-y-6 sm:space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-sm sm:text-lg shrink-0">
                2
              </span>
              <span>{t.sec2Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Χειριστήρια Steppers */}
            <div className="space-y-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 w-full min-w-0">
              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-600 uppercase mb-1.5 break-words [overflow-wrap:anywhere]">
                  {toCleanUppercase(t.numAControl)}
                </label>
                <div className="grid grid-cols-[38px_1fr_38px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setNumA, -1, -8, 8, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                    aria-label="Decrease numA"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-indigo-900 font-black text-sm sm:text-base font-mono whitespace-nowrap px-1 overflow-hidden">
                    α ＝ {formatSigned(numA)}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setNumA, 1, -8, 8, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                    aria-label="Increase numA"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-600 uppercase mb-1.5 break-words [overflow-wrap:anywhere]">
                  {toCleanUppercase(t.numBControl)}
                </label>
                <div className="grid grid-cols-[38px_1fr_38px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setNumB, -1, -8, 8, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                    aria-label="Decrease numB"
                  >
                    －
                  </button>
                  <div className={`h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 font-black text-sm sm:text-base font-mono whitespace-nowrap px-1 overflow-hidden ${numB < 0 ? 'text-rose-600' : 'text-sky-600'}`}>
                    β ＝ {formatSigned(numB)}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setNumB, 1, -8, 8, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                    aria-label="Increase numB"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Callout Κατεύθυνσης 2ου Αριθμού */}
              <div className={`p-3 rounded-xl border text-xs font-black text-center break-words [overflow-wrap:anywhere] ${directionB.bg} ${directionB.color}`}>
                {toCleanUppercase(directionB.text)}
              </div>

              {/* Τελικό Αποτέλεσμα */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-indigo-50 border border-indigo-100 text-center space-y-1 font-mono">
                <div className="text-[10px] sm:text-[11px] text-indigo-700 font-sans font-bold uppercase tracking-wider">
                  {toCleanUppercase(t.operationResultTitle)}
                </div>
                <div className="text-lg sm:text-xl md:text-2xl font-black text-indigo-950 inline-flex flex-wrap items-center justify-center max-w-full gap-1">
                  <span>{formatSignedParen(numA)}</span>
                  <span>＋</span>
                  <span>{formatSignedParen(numB)}</span>
                  <span>＝</span>
                  <span className="text-emerald-700">{formatSigned(sum)}</span>
                </div>
              </div>
            </div>

            {/* Αναπαράσταση στον Άξονα (SVG Responsive) */}
            <div className="lg:col-span-2 space-y-4 w-full min-w-0">
              <div className="bg-slate-900 p-3 sm:p-6 rounded-2xl shadow-inner flex flex-col items-center justify-center w-full min-w-0 overflow-x-hidden">
                <div className="w-full max-w-[860px]">
                  <svg
                    viewBox="0 0 860 200"
                    className="w-full h-auto max-w-full block"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <defs>
                      {/* Μύτη βέλους για το 1ο βήμα */}
                      <marker id="arrow-a" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                        <polygon points="0 0, 7 3.5, 0 7" fill="#818cf8" />
                      </marker>

                      {/* Μύτη βέλους για το 2ο βήμα (Δεξιά - Sky) */}
                      <marker id="arrow-b-right" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                        <polygon points="0 0, 7 3.5, 0 7" fill="#38bdf8" />
                      </marker>

                      {/* Μύτη βέλους για το 2ο βήμα (Αριστερά - Rose) */}
                      <marker id="arrow-b-left" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                        <polygon points="0 0, 7 3.5, 0 7" fill="#f43f5e" />
                      </marker>
                    </defs>

                    {/* Κύριος Άξονας από -18 έως +18 */}
                    <line x1="25" y1="125" x2="835" y2="125" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
                    <polygon points="852,125 832,117 832,133" fill="#64748b" />
                    <polygon points="8,125 28,117 28,133" fill="#64748b" />

                    {/* Υποδιαιρέσεις και Αριθμοί από -18 έως +18 */}
                    {Array.from({ length: 37 }, (_, i) => i - 18).map((val) => {
                      const x = getSvgX(val);
                      const isZero = val === 0;
                      const isEven = val % 2 === 0;

                      return (
                        <g key={val}>
                          <line
                            x1={x}
                            y1={isZero ? 106 : isEven ? 114 : 118}
                            x2={x}
                            y2={isZero ? 144 : isEven ? 136 : 132}
                            stroke={isZero ? '#38bdf8' : isEven ? '#cbd5e1' : '#64748b'}
                            strokeWidth={isZero ? '3.5' : isEven ? '2' : '1'}
                          />
                          {(isEven || isZero) && (
                            <text
                              x={x}
                              y={158}
                              textAnchor="middle"
                              fontSize={isZero ? '16' : '13'}
                              fontWeight={isZero ? '900' : '700'}
                              fill={isZero ? '#38bdf8' : '#e2e8f0'}
                            >
                              {val}
                            </text>
                          )}
                        </g>
                      );
                    })}

                    {/* 1ο Βήμα: Από το 0 στο numA */}
                    {numA !== 0 && (
                      <g>
                        <path
                          d={`M ${getSvgX(0)} 95 Q ${(getSvgX(0) + getSvgX(numA)) / 2} 55 ${getSvgX(numA) + (numA > 0 ? -4 : 4)} 92`}
                          fill="none"
                          stroke="#818cf8"
                          strokeWidth="2.5"
                          strokeDasharray="4 2"
                          markerEnd="url(#arrow-a)"
                        />
                        <text
                          x={(getSvgX(0) + getSvgX(numA)) / 2}
                          y="48"
                          textAnchor="middle"
                          fill="#a5b4fc"
                          fontSize="13"
                          fontWeight="bold"
                        >
                          {t.step1Label} {formatSigned(numA)}
                        </text>
                      </g>
                    )}

                    {/* 2ο Βήμα: Από numA στο sum */}
                    {numB !== 0 && (
                      <g>
                        <path
                          d={`M ${getSvgX(numA)} 92 Q ${(getSvgX(numA) + getSvgX(sum)) / 2} 16 ${getSvgX(sum) + (numB > 0 ? -5 : 5)} 115`}
                          fill="none"
                          stroke={numB > 0 ? '#38bdf8' : '#f43f5e'}
                          strokeWidth="3.5"
                          markerEnd={numB > 0 ? 'url(#arrow-b-right)' : 'url(#arrow-b-left)'}
                        />
                        <text
                          x={(getSvgX(numA) + getSvgX(sum)) / 2}
                          y="22"
                          textAnchor="middle"
                          fill={numB > 0 ? '#38bdf8' : '#fb7185'}
                          fontSize="14"
                          fontWeight="900"
                        >
                          {numB > 0 ? `＋${numB} (${t.step2Right})` : `－${absB} (${t.step2Left})`}
                        </text>
                      </g>
                    )}

                    {/* Σημείο Εκκίνησης 0 */}
                    <circle cx={getSvgX(0)} cy="125" r="5" fill="#38bdf8" />

                    {/* Ενδιάμεσο Σημείο A */}
                    {numA !== 0 && (
                      <circle cx={getSvgX(numA)} cy="125" r="6" fill="#818cf8" stroke="#ffffff" strokeWidth="2" />
                    )}

                    {/* Τελικό Σημείο Αθροίσματος */}
                    <circle cx={getSvgX(sum)} cy="125" r="8" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" />
                    <text
                      x={getSvgX(sum)}
                      y="186"
                      textAnchor="middle"
                      fontSize="14"
                      fontWeight="900"
                      fill="#34d399"
                    >
                      {toCleanUppercase(t.endLabel)} ({formatSigned(sum)})
                    </text>
                  </svg>
                </div>

                <div className="text-slate-300 text-xs sm:text-sm mt-3 text-center break-words [overflow-wrap:anywhere]">
                  {numB < 0 ? (
                    <span>
                      {t.signWord} <strong className="text-rose-400">－</strong> {t.atNum} －{absB} {t.explanationNeg} <strong>{formatSigned(numA)}</strong> {t.explanationNeg2} <strong className="text-rose-400">{absB} {t.positionsLabel} {t.explanationNeg3}</strong>
                    </span>
                  ) : numB > 0 ? (
                    <span>
                      {t.signWord} <strong className="text-sky-400">＋</strong> {t.atNum} ＋{numB} {t.explanationPos} <strong>{formatSigned(numA)}</strong> {t.explanationPos2} <strong className="text-sky-400">{absB} {t.positionsLabel} {t.explanationPos3}</strong>
                    </span>
                  ) : (
                    <span>{t.explanationZero} <strong>{formatSigned(numA)}</strong>.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}