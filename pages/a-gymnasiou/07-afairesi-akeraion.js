import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function AfairesiAkeraionTheoria() {
  // State για Μειωτέο (α) και Αφαιρετέο (β)
  const [numA, setNumA] = useState(3);
  const [numB, setNumB] = useState(7);

  // Stepper handlers
  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  // Ο αντίθετος του αφαιρετέου: -β
  const oppositeB = useMemo(() => -numB, [numB]);

  // Τελική διαφορά: α - β = α + (-β)
  const difference = useMemo(() => numA - numB, [numA, numB]);

  // Απόλυτες τιμές
  const absA = useMemo(() => Math.abs(numA), [numA]);
  const absB = useMemo(() => Math.abs(numB), [numB]);
  const absOppositeB = useMemo(() => Math.abs(oppositeB), [oppositeB]);

  // Μετατροπή τιμής [-18, 18] σε συντεταγμένη X στο SVG (viewBox 0 έως 860)
  // Κέντρο (0) στο x = 430, κάθε μονάδα = 21px
  const getSvgX = (val) => 430 + val * 21;

  // Επεξήγηση βήμα-βήμα
  const stepByStepExplanation = useMemo(() => {
    const strA = numA > 0 ? `(＋${numA})` : numA < 0 ? `(－${absA})` : '0';
    const strB = numB > 0 ? `(＋${numB})` : numB < 0 ? `(－${absB})` : '0';
    const strOppB = oppositeB > 0 ? `(＋${oppositeB})` : oppositeB < 0 ? `(－${absOppositeB})` : '0';

    return {
      step1: `${strA} － ${strB}`,
      step2: `${strA} ＋ ${strOppB}`,
      finalVal: difference > 0 ? `＋${difference}` : `${difference}`,
      oppositeText: `Ο αντίθετος του ${strB} είναι ο ${strOppB}.`,
    };
  }, [numA, numB, oppositeB, difference, absA, absB, absOppositeB]);

  return (
    <Layout
      title="Αφαίρεση Ακεραίων Αριθμών | Α' Γυμνασίου"
      description="Θεωρία, κανόνας μετατροπής σε πρόσθεση του αντιθέτου και διαδραστικός άξονας για την αφαίρεση ακεραίων."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/07-afairesi-akeraion-ask"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-sm sm:text-base transition-all shadow-md"
        >
          <span>🎯</span>
          <span>ΑΣΚΗΣΕΙΣ</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-10 sm:space-y-16">
        {/* Banner Header - Ενιαίο Indigo Theme χωρίς τόνους στα κεφαλαία */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 lg:p-14 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              Α' ΓΥΜΝΑΣΙΟΥ • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Αφαίρεση Ακέραιων Αριθμών
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              Μαθαίνουμε τον θεμελιώδη κανόνα της αφαίρεσης: <strong>αφαιρώ έναν αριθμό σημαίνει προσθέτω τον αντίθετό του</strong>!
            </p>
          </div>
        </section>

        {/* 1. Ο ΧΡΥΣΟΣ ΚΑΝΟΝΑΣ ΤΗΣ ΑΦΑΙΡΕΣΗΣ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                1
              </span>
              Ο Κανόνας της Αφαίρεσης Ακεραίων
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            <div className="space-y-4">
              <p>
                Για να αφαιρέσουμε από έναν ακέραιο αριθμό <strong>α</strong> (μειωτέος) έναν ακέραιο αριθμό <strong>β</strong> (αφαιρετέος), <strong>προσθέτουμε στον μειωτέο τον αντίθετο του αφαιρετέου</strong>:
              </p>
              <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 font-black text-center text-xl sm:text-2xl font-mono shadow-sm">
                α － β ＝ α ＋ (－β)
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Με τον κανόνα αυτόν, κάθε αφαίρεση μετατρέπεται άμεσα σε πρόσθεση, οπότε εφαρμόζουμε τους γνωστούς κανόνες της πρόσθεσης (ομόσημοι ή ετερόσημοι).
              </p>
            </div>

            {/* Πίνακας Περιπτώσεων & Απλοποίηση Προσήμων */}
            <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="text-xs font-bold uppercase text-slate-500">
                ΟΙ 4 ΒΑΣΙΚΕΣ ΠΕΡΙΠΤΩΣΕΙΣ
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-mono">
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="text-slate-500 font-sans text-xs">Θετικός － Θετικός</div>
                  <div className="font-bold text-slate-900">(＋5) － (＋3) ＝ (＋5) ＋ (－3) ＝ <strong>＋2</strong></div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="text-slate-500 font-sans text-xs">Θετικός － Αρνητικός</div>
                  <div className="font-bold text-slate-900">(＋5) － (－3) ＝ (＋5) ＋ (＋3) ＝ <strong>＋8</strong></div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="text-slate-500 font-sans text-xs">Αρνητικός － Θετικός</div>
                  <div className="font-bold text-slate-900">(－5) － (＋3) ＝ (－5) ＋ (－3) ＝ <strong>－8</strong></div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="text-slate-500 font-sans text-xs">Αρνητικός － Αρνητικός</div>
                  <div className="font-bold text-slate-900">(－5) － (－3) ＝ (－5) ＋ (＋3) ＝ <strong>－2</strong></div>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs sm:text-sm text-amber-950 font-sans">
                <strong>Κανόνας Απαλοιφής Παρενθέσεων:</strong><br />
                • Το σύμβολο « － (＋β) » γίνεται <strong>－β</strong><br />
                • Το σύμβολο « － (－β) » γίνεται <strong>＋β</strong> (δύο πλην δίνουν συν!)
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ: ΑΦΑΙΡΕΣΗ ΚΑΙ ΑΞΟΝΑΣ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                2
              </span>
              Διαδραστικό Εργαστήριο: Μετατροπή Αφαίρεσης & Οπτικοποίηση
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Steppers Ελέγχου */}
            <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  1ΟΣ ΑΡΙΘΜΟΣ (ΜΕΙΩΤΕΟΣ α)
                </label>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setNumA, -1, -8, 8, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-indigo-900 font-black text-lg font-mono whitespace-nowrap px-2">
                    α ＝ {numA > 0 ? `＋${numA}` : numA}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setNumA, 1, -8, 8, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  2ΟΣ ΑΡΙΘΜΟΣ (ΑΦΑΙΡΕΤΕΟΣ β)
                </label>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setNumB, -1, -8, 8, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-sky-900 font-black text-lg font-mono whitespace-nowrap px-2">
                    β ＝ {numB > 0 ? `＋${numB}` : numB}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setNumB, 1, -8, 8, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Callout Μετατροπής σε Πρόσθεση */}
              <div className="p-4 rounded-xl bg-indigo-50/80 border border-indigo-200 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                  ΜΕΤΑΤΡΟΠΗ ΣΕ ΠΡΟΣΘΕΣΗ
                </div>
                <div className="text-xs text-slate-600">
                  {stepByStepExplanation.oppositeText}
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-indigo-100 font-mono text-xs sm:text-sm font-bold text-indigo-950 text-center">
                  {stepByStepExplanation.step1} ＝ {stepByStepExplanation.step2}
                </div>
              </div>

              {/* Τελικό Αποτέλεσμα */}
              <div className="p-4 rounded-xl bg-slate-900 text-white text-center space-y-1 font-mono shadow-md">
                <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                  ΤΕΛΙΚΗ ΔΙΑΦΟΡΑ
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                  {stepByStepExplanation.finalVal}
                </div>
              </div>
            </div>

            {/* Οπτική Απεικόνιση στον Άξονα (SVG Responsive) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-slate-900 p-4 sm:p-6 rounded-2xl shadow-inner flex flex-col items-center justify-center">
                <div className="w-full max-w-[860px]">
                  <svg
                    viewBox="0 0 860 200"
                    className="w-full h-auto"
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

                    {/* Υποδιαιρέσεις και Μεγάλοι Αριθμοί */}
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
                          Μειωτέος: {numA > 0 ? `＋${numA}` : numA}
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
                          {oppositeB > 0 ? `＋(${oppositeB}) (➡️ δεξιά)` : `${oppositeB} (⬅️ αριστερά)`}
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
                      ΤΕΛΟΣ ({difference > 0 ? `＋${difference}` : difference})
                    </text>
                  </svg>
                </div>

                <div className="text-slate-300 text-xs sm:text-sm mt-3 text-center">
                  Αφαιρούμε το <strong>{numB > 0 ? `＋${numB}` : numB}</strong> σημαίνει ότι προσθέτουμε τον αντίθετό του <strong>{oppositeB > 0 ? `＋${oppositeB}` : oppositeB}</strong>:
                  {oppositeB < 0 ? (
                    <span className="text-rose-400 font-bold ml-1">
                      κινούμαστε {absOppositeB} θέσεις προς τα ΑΡΙΣΤΕΡΑ ⬅️.
                    </span>
                  ) : oppositeB > 0 ? (
                    <span className="text-sky-400 font-bold ml-1">
                      κινούμαστε {absOppositeB} θέσεις προς τα ΔΕΞΙΑ ➡️.
                    </span>
                  ) : (
                    <span className="font-bold ml-1">παραμένουμε στην ίδια θέση.</span>
                  )}
                </div>
              </div>

              {/* Κάρτα Ανάλυσης */}
              <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-1.5 text-xs sm:text-sm">
                <div className="font-bold text-indigo-950 uppercase text-[11px] tracking-wider">
                  ΜΑΘΗΜΑΤΙΚΗ ΕΡΜΗΝΕΙΑ
                </div>
                <p className="text-slate-800 leading-relaxed font-sans">
                  Η αφαίρεση <strong>{stepByStepExplanation.step1}</strong> μετατράπηκε στην πρόσθεση <strong>{stepByStepExplanation.step2}</strong>, η οποία υπολογίζεται με τους κανόνες της πρόσθεσης ακεραίων και δίνει τελικό αποτέλεσμα <strong>{stepByStepExplanation.finalVal}</strong>.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
