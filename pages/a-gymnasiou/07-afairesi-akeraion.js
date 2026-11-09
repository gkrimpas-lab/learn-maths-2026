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
    metaTitle: "Αφαίρεση Ακεραίων Αριθμών | Α' Γυμνασίου",
    metaDescription: "Θεωρία, κανόνας μετατροπής σε πρόσθεση του αντιθέτου και διαδραστικός άξονας για την αφαίρεση ακεραίων.",
    backText: "Α' Γυμνασίου",
    exercisesBtn: "ΑΣΚΗΣΕΙΣ",
    gradeBadge: "Α' ΓΥΜΝΑΣΙΟΥ • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ",
    mainTitle: "Αφαίρεση Ακέραιων Αριθμών",
    heroDesc: "Μαθαίνουμε τον θεμελιώδη κανόνα της αφαίρεσης: αφαιρώ έναν αριθμό σημαίνει προσθέτω τον αντίθετό του!",
    sec1Title: "Ο Κανόνας της Αφαίρεσης Ακεραίων",
    ruleExplanationP1: "Για να αφαιρέσουμε από έναν ακέραιο αριθμό α (μειωτέος) έναν ακέραιο αριθμό β (αφαιρετέος), προσθέτουμε στον μειωτέο τον αντίθετο του αφαιρετέου:",
    ruleExplanationP2: "Με τον κανόνα αυτόν, κάθε αφαίρεση μετατρέπεται άμεσα σε πρόσθεση, οπότε εφαρμόζουμε τους γνωστούς κανόνες της πρόσθεσης (ομόσημοι ή ετερόσημοι).",
    casesBadge: "ΟΙ 4 ΒΑΣΙΚΕΣ ΠΕΡΙΠΤΩΣΕΙΣ",
    casePosPos: "Θετικός － Θετικός",
    casePosNeg: "Θετικός － Αρνητικός",
    caseNegPos: "Αρνητικός － Θετικός",
    caseNegNeg: "Αρνητικός － Αρνητικός",
    removalRuleTitle: "Κανόνας Απαλοιφής Παρενθέσεων:",
    removalRule1: "Το σύμβολο « － (＋β) » γίνεται －β",
    removalRule2: "Το σύμβολο « － (－β) » γίνεται ＋β (δύο πλην δίνουν συν!)",
    sec2Title: "Διαδραστικό Εργαστήριο: Μετατροπή Αφαίρεσης & Οπτικοποίηση",
    numAControl: "1ΟΣ ΑΡΙΘΜΟΣ (ΜΕΙΩΤΕΟΣ α)",
    numBControl: "2ΟΣ ΑΡΙΘΜΟΣ (ΑΦΑΙΡΕΤΕΟΣ β)",
    conversionBadge: "ΜΕΤΑΤΡΟΠΗ ΣΕ ΠΡΟΣΘΕΣΗ",
    oppositeOfWord: "Ο αντίθετος του",
    isWord: "είναι ο",
    finalDifferenceTitle: "ΤΕΛΙΚΗ ΔΙΑΦΟΡΑ",
    minuendLabel: "Μειωτέος:",
    step2Right: "➡️ δεξιά",
    step2Left: "⬅️ αριστερά",
    endLabel: "ΤΕΛΟΣ",
    subtractingWord: "Αφαιρούμε το",
    meansWeAddWord: "σημαίνει ότι προσθέτουμε τον αντίθετό του",
    moveLeftSuffix: "θέσεις προς τα ΑΡΙΣΤΕΡΑ ⬅️.",
    moveRightSuffix: "θέσεις προς τα ΔΕΞΙΑ ➡️.",
    staySamePos: "παραμένουμε στην ίδια θέση.",
    mathInterpretationBadge: "ΜΑΘΗΜΑΤΙΚΗ ΕΡΜΗΝΕΙΑ",
    mathInterpPart1: "Η αφαίρεση",
    mathInterpPart2: "μετατράπηκε στην πρόσθεση",
    mathInterpPart3: ", η οποία υπολογίζεται με τους κανόνες της πρόσθεσης ακεραίων και δίνει τελικό αποτέλεσμα",
  },
  en: {
    metaTitle: "Subtracting Integers | 7th Grade Mathematics",
    metaDescription: "Theory, rule of converting to addition of the opposite, and interactive number line for subtracting integers.",
    backText: "7th Grade",
    exercisesBtn: "EXERCISES",
    gradeBadge: "GRADE 7 • THEORY & LAB",
    mainTitle: "Subtraction of Integers",
    heroDesc: "Learn the foundational subtraction rule: subtracting a number means adding its opposite!",
    sec1Title: "The Rule of Subtracting Integers",
    ruleExplanationP1: "To subtract an integer b (subtrahend) from an integer a (minuend), we add the opposite of the subtrahend to the minuend:",
    ruleExplanationP2: "Through this rule, every subtraction directly converts into addition, allowing us to apply the known rules of addition (same or different signs).",
    casesBadge: "THE 4 CORE CASES",
    casePosPos: "Positive － Positive",
    casePosNeg: "Positive － Negative",
    caseNegPos: "Negative － Positive",
    caseNegNeg: "Negative － Negative",
    removalRuleTitle: "Parentheses Removal Rules:",
    removalRule1: "The symbol « － (＋b) » becomes －b",
    removalRule2: "The symbol « － (－b) » becomes ＋b (two minuses make a plus!)",
    sec2Title: "Interactive Lab: Subtraction Conversion & Visualization",
    numAControl: "1ST NUMBER (MINUEND a)",
    numBControl: "2ND NUMBER (SUBTRAHEND b)",
    conversionBadge: "CONVERSION TO ADDITION",
    oppositeOfWord: "The opposite of",
    isWord: "is",
    finalDifferenceTitle: "FINAL DIFFERENCE",
    minuendLabel: "Minuend:",
    step2Right: "➡️ right",
    step2Left: "⬅️ left",
    endLabel: "END",
    subtractingWord: "Subtracting",
    meansWeAddWord: "means adding its opposite",
    moveLeftSuffix: "units to the LEFT ⬅️.",
    moveRightSuffix: "units to the RIGHT ➡️.",
    staySamePos: "we remain in the same position.",
    mathInterpretationBadge: "MATHEMATICAL INTERPRETATION",
    mathInterpPart1: "The subtraction",
    mathInterpPart2: "was converted to the addition",
    mathInterpPart3: ", which is evaluated using integer addition rules yielding the final result",
  }
};

export default function AfairesiAkeraionTheoria() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];

  const [numA, setNumA] = useState(3);
  const [numB, setNumB] = useState(7);

  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  const oppositeB = useMemo(() => (numB === 0 ? 0 : -numB), [numB]);
  const difference = useMemo(() => numA - numB, [numA, numB]);

  const absA = useMemo(() => Math.abs(numA), [numA]);
  const absB = useMemo(() => Math.abs(numB), [numB]);
  const absOppositeB = useMemo(() => Math.abs(oppositeB), [oppositeB]);

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

  const stepByStepExplanation = useMemo(() => {
    const strA = formatSignedParen(numA);
    const strB = formatSignedParen(numB);
    const strOppB = formatSignedParen(oppositeB);

    return {
      step1: `${strA} － ${strB}`,
      step2: `${strA} ＋ ${strOppB}`,
      finalVal: formatSigned(difference),
      strB,
      strOppB,
    };
  }, [numA, numB, oppositeB, difference]);

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDescription}
      backUrl="/a-gymnasiou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/07-afairesi-akeraion-ask"
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

        {/* 1. Ο ΧΡΥΣΟΣ ΚΑΝΟΝΑΣ ΤΗΣ ΑΦΑΙΡΕΣΗΣ */}
        <section className="bg-white rounded-3xl p-4 sm:p-7 lg:p-10 shadow-sm border border-slate-200/80 space-y-6 sm:space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-sm sm:text-lg shrink-0">
                1
              </span>
              <span>{t.sec1Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed">
            <div className="space-y-4">
              <p className="break-words [overflow-wrap:anywhere]">
                {t.ruleExplanationP1}
              </p>
              <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 font-black text-center text-lg sm:text-xl md:text-2xl font-mono shadow-sm break-words [overflow-wrap:anywhere]">
                α － β ＝ α ＋ (－β)
              </div>
              <p className="text-slate-600 text-[11px] sm:text-xs md:text-sm leading-relaxed break-words [overflow-wrap:anywhere]">
                {t.ruleExplanationP2}
              </p>
            </div>

            {/* Πίνακας Περιπτώσεων & Απλοποίηση Προσήμων */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="text-[11px] sm:text-xs font-bold uppercase text-slate-500 tracking-wider">
                {toCleanUppercase(t.casesBadge)}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-mono">
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="text-slate-500 font-sans text-[11px] sm:text-xs">{t.casePosPos}</div>
                  <div className="font-bold text-slate-900 break-words [overflow-wrap:anywhere]">
                    (＋5) － (＋3) ＝ (＋5) ＋ (－3) ＝ <strong>＋2</strong>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="text-slate-500 font-sans text-[11px] sm:text-xs">{t.casePosNeg}</div>
                  <div className="font-bold text-slate-900 break-words [overflow-wrap:anywhere]">
                    (＋5) － (－3) ＝ (＋5) ＋ (＋3) ＝ <strong>＋8</strong>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="text-slate-500 font-sans text-[11px] sm:text-xs">{t.caseNegPos}</div>
                  <div className="font-bold text-slate-900 break-words [overflow-wrap:anywhere]">
                    (－5) － (＋3) ＝ (－5) ＋ (－3) ＝ <strong>－8</strong>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="text-slate-500 font-sans text-[11px] sm:text-xs">{t.caseNegNeg}</div>
                  <div className="font-bold text-slate-900 break-words [overflow-wrap:anywhere]">
                    (－5) － (－3) ＝ (－5) ＋ (＋3) ＝ <strong>－2</strong>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs sm:text-sm text-amber-950 font-sans space-y-1">
                <strong>{t.removalRuleTitle}</strong>
                <div className="break-words [overflow-wrap:anywhere]">• {t.removalRule1}</div>
                <div className="break-words [overflow-wrap:anywhere]">• {t.removalRule2}</div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ: ΑΦΑΙΡΕΣΗ ΚΑΙ ΑΞΟΝΑΣ */}
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
            {/* Steppers Ελέγχου */}
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
                  <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-sky-900 font-black text-sm sm:text-base font-mono whitespace-nowrap px-1 overflow-hidden">
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

              {/* Callout Μετατροπής σε Πρόσθεση */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-indigo-50/80 border border-indigo-200 space-y-2">
                <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                  {toCleanUppercase(t.conversionBadge)}
                </div>
                <div className="text-xs text-slate-600 break-words [overflow-wrap:anywhere]">
                  {t.oppositeOfWord} <strong>{stepByStepExplanation.strB}</strong> {t.isWord}{' '}
                  <strong>{stepByStepExplanation.strOppB}</strong>.
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-indigo-100 font-mono text-xs sm:text-sm font-bold text-indigo-950 text-center break-words [overflow-wrap:anywhere]">
                  {stepByStepExplanation.step1} ＝ {stepByStepExplanation.step2}
                </div>
              </div>

              {/* Τελικό Αποτέλεσμα */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900 text-white text-center space-y-1 font-mono shadow-md">
                <div className="text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-widest font-bold">
                  {toCleanUppercase(t.finalDifferenceTitle)}
                </div>
                <div className="text-xl sm:text-2xl md:text-3xl font-black text-emerald-400 break-words [overflow-wrap:anywhere]">
                  {stepByStepExplanation.finalVal}
                </div>
              </div>
            </div>

            {/* Οπτική Απεικόνιση στον Άξονα (SVG Responsive) */}
            <div className="lg:col-span-2 space-y-4 w-full min-w-0">
              <div className="bg-slate-900 p-3 sm:p-6 rounded-2xl shadow-inner flex flex-col items-center justify-center w-full min-w-0 overflow-x-hidden">
                <div className="w-full max-w-[860px]">
                  <svg
                    viewBox="0 0 860 200"
                    className="w-full h-auto max-w-full block"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <defs>
                      <marker id="arrow-a" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                        <polygon points="0 0, 7 3.5, 0 7" fill="#818cf8" />
                      </marker>
                      <marker id="arrow-b-right" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                        <polygon points="0 0, 7 3.5, 0 7" fill="#38bdf8" />
                      </marker>
                      <marker id="arrow-b-left" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                        <polygon points="0 0, 7 3.5, 0 7" fill="#f43f5e" />
                      </marker>
                    </defs>

                    {/* Κύριος Άξονας από -18 έως +18 */}
                    <line x1="25" y1="125" x2="835" y2="125" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
                    <polygon points="852,125 832,117 832,133" fill="#64748b" />
                    <polygon points="8,125 28,117 28,133" fill="#64748b" />

                    {/* Υποδιαιρέσεις και Αριθμοί */}
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
                          {t.minuendLabel} {formatSigned(numA)}
                        </text>
                      </g>
                    )}

                    {/* 2ο Βήμα: Πρόσθεση του Αντιθέτου (-numB) από numA στο difference */}
                    {oppositeB !== 0 && (
                      <g>
                        <path
                          d={`M ${getSvgX(numA)} 92 Q ${(getSvgX(numA) + getSvgX(difference)) / 2} 16 ${getSvgX(difference) + (oppositeB > 0 ? -5 : 5)} 115`}
                          fill="none"
                          stroke={oppositeB > 0 ? '#38bdf8' : '#f43f5e'}
                          strokeWidth="3.5"
                          markerEnd={oppositeB > 0 ? 'url(#arrow-b-right)' : 'url(#arrow-b-left)'}
                        />
                        <text
                          x={(getSvgX(numA) + getSvgX(difference)) / 2}
                          y="22"
                          textAnchor="middle"
                          fill={oppositeB > 0 ? '#38bdf8' : '#fb7185'}
                          fontSize="14"
                          fontWeight="900"
                        >
                          {oppositeB > 0 ? `＋(${formatSigned(oppositeB)}) (${t.step2Right})` : `${formatSigned(oppositeB)} (${t.step2Left})`}
                        </text>
                      </g>
                    )}

                    {/* Σημείο 0 */}
                    <circle cx={getSvgX(0)} cy="125" r="5" fill="#38bdf8" />

                    {/* Ενδιάμεσο Σημείο A */}
                    {numA !== 0 && (
                      <circle cx={getSvgX(numA)} cy="125" r="6" fill="#818cf8" stroke="#ffffff" strokeWidth="2" />
                    )}

                    {/* Τελικό Σημείο Διαφοράς */}
                    <circle cx={getSvgX(difference)} cy="125" r="8" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" />
                    <text
                      x={getSvgX(difference)}
                      y="186"
                      textAnchor="middle"
                      fontSize="14"
                      fontWeight="900"
                      fill="#34d399"
                    >
                      {toCleanUppercase(t.endLabel)} ({formatSigned(difference)})
                    </text>
                  </svg>
                </div>

                <div className="text-slate-300 text-xs sm:text-sm mt-3 text-center break-words [overflow-wrap:anywhere]">
                  {t.subtractingWord} <strong>{formatSigned(numB)}</strong> {t.meansWeAddWord}{' '}
                  <strong>{formatSigned(oppositeB)}</strong>:{' '}
                  {oppositeB < 0 ? (
                    <span className="text-rose-400 font-bold ml-1">
                      {locale === 'en' ? 'move' : 'κινούμαστε'} {absOppositeB} {t.moveLeftSuffix}
                    </span>
                  ) : oppositeB > 0 ? (
                    <span className="text-sky-400 font-bold ml-1">
                      {locale === 'en' ? 'move' : 'κινούμαστε'} {absOppositeB} {t.moveRightSuffix}
                    </span>
                  ) : (
                    <span className="font-bold ml-1">{t.staySamePos}</span>
                  )}
                </div>
              </div>

              {/* Κάρτα Ανάλυσης */}
              <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-1.5 text-xs sm:text-sm">
                <div className="font-bold text-indigo-950 uppercase text-[10px] sm:text-[11px] tracking-wider">
                  {toCleanUppercase(t.mathInterpretationBadge)}
                </div>
                <p className="text-slate-800 leading-relaxed font-sans break-words [overflow-wrap:anywhere]">
                  {t.mathInterpPart1} <strong>{stepByStepExplanation.step1}</strong> {t.mathInterpPart2}{' '}
                  <strong>{stepByStepExplanation.step2}</strong>
                  {t.mathInterpPart3} <strong>{stepByStepExplanation.finalVal}</strong>.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}