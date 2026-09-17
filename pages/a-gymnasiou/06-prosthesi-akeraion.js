import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function ProsthesiAkeraionTheoria() {
  // State για τους δύο προσθετέους
  const [numA, setNumA] = useState(3);
  const [numB, setNumB] = useState(-7);

  // Stepper handlers
  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  // Υπολογισμοί
  const sum = useMemo(() => numA + numB, [numA, numB]);
  const absA = useMemo(() => Math.abs(numA), [numA]);
  const absB = useMemo(() => Math.abs(numB), [numB]);

  // Μετατροπή τιμής [-15, 15] σε συντεταγμένη X στο SVG (viewBox 0 έως 760)
  // Κέντρο (0) στο x = 380, κάθε μονάδα = 22px
  const getSvgX = (val) => 380 + val * 22;

  // Κατεύθυνση κίνησης 2ου αριθμού
  const directionB = useMemo(() => {
    if (numB > 0) return { text: `➡️ ΜΕΤΑΚΙΝΗΣΗ ΔΕΞΙΑ ΚΑΤΑ ${absB} ΘΕΣΕΙΣ`, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-400/30' };
    if (numB < 0) return { text: `⬅️ ΜΕΤΑΚΙΝΗΣΗ ΑΡΙΣΤΕΡΑ ΚΑΤΑ ${absB} ΘΕΣΕΙΣ`, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-400/30' };
    return { text: '⏹️ ΚΑΜΙΑ ΜΕΤΑΚΙΝΗΣΗ (ΒΗΜΑ 0)', color: 'text-slate-400', bg: 'bg-slate-800 border-slate-700' };
  }, [numB, absB]);

  return (
    <Layout
      title="Πρόσθεση Ακεραίων Αριθμών | Α' Γυμνασίου"
      description="Θεωρία και διαδραστική κατανόηση της πρόσθεσης ακεραίων στον άξονα (κίνηση δεξιά/αριστερά)."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/06-prosthesi-akeraion-ask"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-sm sm:text-base transition-all shadow-md"
        >
          <span>🎯</span>
          <span>ΑΣΚΗΣΕΙΣ</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-10 sm:space-y-16">
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 lg:p-14 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              Α' ΓΥΜΝΑΣΙΟΥ • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Πρόσθεση Ακέραιων Αριθμών
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              Κατανοούμε την πρόσθεση ως κίνηση στον άξονα: το <strong>＋</strong> σημαίνει μετακίνηση προς τα <strong>δεξιά</strong>, ενώ το <strong>－</strong> σημαίνει μετακίνηση προς τα <strong>αριστερά</strong>!
            </p>
          </div>
        </section>

        {/* 1. ΘΕΩΡΗΤΙΚΟΙ ΚΑΝΟΝΕΣ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                1
              </span>
              Κανόνες Πρόσθεσης & Κίνηση στον Άξονα
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-indigo-600 uppercase">
                ΟΜΟΣΗΜΟΙ ΑΡΙΘΜΟΙ
              </div>
              <h3 className="font-bold text-slate-900 text-base sm:text-xl">
                Ίδιο Πρόσημο
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Κινούμαστε προς την ίδια κατεύθυνση. Κρατάμε το κοινό πρόσημο και προσθέτουμε τις απόλυτες τιμές:
              </p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-xs sm:text-sm text-indigo-950 space-y-1">
                <div>(＋3) ＋ (＋5) ＝ ＋(3 ＋ 5) ＝ <strong>＋8</strong></div>
                <div>(－4) ＋ (－6) ＝ －(4 ＋ 6) ＝ <strong>－10</strong></div>
              </div>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-indigo-600 uppercase">
                ΕΤΕΡΟΣΗΜΟΙ ΑΡΙΘΜΟΙ
              </div>
              <h3 className="font-bold text-slate-900 text-base sm:text-xl">
                Αντίθετα Πρόσημα
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Οι κινήσεις είναι αντίθετες. Κερδίζει η κατεύθυνση με τη μεγαλύτερη απόλυτη τιμή και αφαιρούμε τις αποστάσεις:
              </p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-xs sm:text-sm text-indigo-950 space-y-1">
                <div>(＋8) ＋ (－3) ＝ ＋(8 － 3) ＝ <strong>＋5</strong></div>
                <div>(－9) ＋ (＋4) ＝ －(9 － 4) ＝ <strong>－5</strong></div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΜΕ ΒΕΛΗ ΚΑΙ ΕΝΔΕΙΞΗ ΚΑΤΕΥΘΥΝΣΗΣ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                2
              </span>
              Διαδραστικό Εργαστήριο: Η Φυσική Σημασία των Προσήμων
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Χειριστήρια Steppers */}
            <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  1ος Αριθμός (Αρχική Θέση από το 0)
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
                  2ος Αριθμός (Μετατόπιση)
                </label>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setNumB, -1, -8, 8, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                  >
                    －
                  </button>
                  <div className={`h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 font-black text-lg font-mono whitespace-nowrap px-2 ${numB < 0 ? 'text-rose-600' : 'text-sky-600'}`}>
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

              {/* Callout Κατεύθυνσης 2ου Αριθμού */}
              <div className={`p-3.5 rounded-xl border text-xs font-black text-center ${directionB.bg} ${directionB.color}`}>
                {directionB.text}
              </div>

              {/* Τελικό Αποτέλεσμα */}
              <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 text-center space-y-1 font-mono">
                <div className="text-[11px] text-indigo-700 font-sans font-bold uppercase">ΠΡΑΞΗ & ΑΠΟΤΕΛΕΣΜΑ</div>
                <div className="text-xl sm:text-2xl font-black text-indigo-950">
                  {numA > 0 ? `(＋${numA})` : numA < 0 ? `(－${absA})` : '0'} ＋{' '}
                  {numB > 0 ? `(＋${numB})` : numB < 0 ? `(－${absB})` : '0'} ＝{' '}
                  <span className="text-emerald-700">{sum > 0 ? `＋${sum}` : sum}</span>
                </div>
              </div>
            </div>

            {/* Οπτική Απεικόνιση στον Άξονα (SVG Responsive) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-slate-900 p-4 sm:p-6 rounded-2xl shadow-inner flex flex-col items-center justify-center">
                <div className="w-full max-w-[760px]">
                  <svg
                    viewBox="0 0 760 190"
                    className="w-full h-auto"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <defs>
                      {/* Μύτη βέλους για το 1ο βήμα */}
                      <marker id="arrow-a" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                        <polygon points="0 0, 6 3, 0 6" fill="#818cf8" />
                      </marker>

                      {/* Μύτη βέλους για το 2ο βήμα (Δεξιά - Sky) */}
                      <marker id="arrow-b-right" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                        <polygon points="0 0, 6 3, 0 6" fill="#38bdf8" />
                      </marker>

                      {/* Μύτη βέλους για το 2ο βήμα (Αριστερά - Rose) */}
                      <marker id="arrow-b-left" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                        <polygon points="0 0, 6 3, 0 6" fill="#f43f5e" />
                      </marker>
                    </defs>

                    {/* Κύριος Άξονας */}
                    <line x1="20" y1="125" x2="740" y2="125" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
                    <polygon points="755,125 735,118 735,132" fill="#475569" />

                    {/* Υποδιαιρέσεις από -15 έως +15 */}
                    {Array.from({ length: 31 }, (_, i) => i - 15).map((val) => {
                      const x = getSvgX(val);
                      const isZero = val === 0;
                      return (
                        <g key={val}>
                          <line
                            x1={x}
                            y1={isZero ? 110 : 118}
                            x2={x}
                            y2={isZero ? 140 : 132}
                            stroke={isZero ? '#f8fafc' : '#64748b'}
                            strokeWidth={isZero ? '3' : '1.5'}
                          />
                          <text
                            x={x}
                            y={154}
                            textAnchor="middle"
                            fontSize={isZero ? '13' : '9'}
                            fontWeight={isZero ? '900' : '600'}
                            fill={isZero ? '#f8fafc' : '#94a3b8'}
                          >
                            {val}
                          </text>
                        </g>
                      );
                    })}

                    {/* 1ο Βήμα: Από το 0 στο numA */}
                    {numA !== 0 && (
                      <g>
                        <path
                          d={`M ${getSvgX(0)} 95 Q ${(getSvgX(0) + getSvgX(numA)) / 2} 60 ${getSvgX(numA) + (numA > 0 ? -4 : 4)} 92`}
                          fill="none"
                          stroke="#818cf8"
                          strokeWidth="2.5"
                          strokeDasharray="4 2"
                          markerEnd="url(#arrow-a)"
                        />
                        <text
                          x={(getSvgX(0) + getSvgX(numA)) / 2}
                          y="50"
                          textAnchor="middle"
                          fill="#818cf8"
                          fontSize="11"
                          fontWeight="bold"
                        >
                          1ο: {numA > 0 ? `＋${numA}` : numA}
                        </text>
                      </g>
                    )}

                    {/* 2ο Βήμα: Από numA στο sum */}
                    {numB !== 0 && (
                      <g>
                        <path
                          d={`M ${getSvgX(numA)} 92 Q ${(getSvgX(numA) + getSvgX(sum)) / 2} 18 ${getSvgX(sum) + (numB > 0 ? -4 : 4)} 116`}
                          fill="none"
                          stroke={numB > 0 ? '#38bdf8' : '#f43f5e'}
                          strokeWidth="3"
                          markerEnd={numB > 0 ? 'url(#arrow-b-right)' : 'url(#arrow-b-left)'}
                        />
                        <text
                          x={(getSvgX(numA) + getSvgX(sum)) / 2}
                          y="22"
                          textAnchor="middle"
                          fill={numB > 0 ? '#38bdf8' : '#fb7185'}
                          fontSize="12"
                          fontWeight="900"
                        >
                          {numB > 0 ? `＋${numB} (➡️ δεξιά)` : `${numB} (⬅️ αριστερά)`}
                        </text>
                      </g>
                    )}

                    {/* Σημείο Εκκίνησης 0 */}
                    <circle cx={getSvgX(0)} cy="125" r="4" fill="#94a3b8" />

                    {/* Ενδιάμεσο Σημείο A */}
                    {numA !== 0 && (
                      <circle cx={getSvgX(numA)} cy="125" r="5" fill="#818cf8" stroke="#ffffff" strokeWidth="1.5" />
                    )}

                    {/* Τελικό Σημείο Αθροίσματος */}
                    <circle cx={getSvgX(sum)} cy="125" r="7" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                    <text
                      x={getSvgX(sum)}
                      y="180"
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight="900"
                      fill="#34d399"
                    >
                      ΤΕΛΟΣ ({sum})
                    </text>
                  </svg>
                </div>

                <div className="text-slate-300 text-xs mt-3 text-center">
                  {numB < 0 ? (
                    <span>
                      Το πρόσημο <strong className="text-rose-400">－</strong> στο {numB} σημαίνει ότι από το <strong>{numA}</strong> κινούμαστε <strong className="text-rose-400">{absB} θέσεις προς τα ΑΡΙΣΤΕΡΑ ⬅️</strong>.
                    </span>
                  ) : numB > 0 ? (
                    <span>
                      Το πρόσημο <strong className="text-sky-400">＋</strong> στο ＋{numB} σημαίνει ότι από το <strong>{numA}</strong> κινούμαστε <strong className="text-sky-400">{absB} θέσεις προς τα ΔΕΞΙΑ ➡️</strong>.
                    </span>
                  ) : (
                    <span>Το δεύτερο βήμα είναι 0, παραμένουμε στο σημείο <strong>{numA}</strong>.</span>
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
