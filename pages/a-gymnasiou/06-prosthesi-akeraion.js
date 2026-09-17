import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function ProsthesiAkeraionTheoria() {
  // State για τους δύο προσθετέους
  const [numA, setNumA] = useState(4);
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

  // Έλεγχος σχέσης προσήμων
  const ruleType = useMemo(() => {
    if (numA === 0 || numB === 0) return 'zero';
    if (numA + numB === 0) return 'opposites';
    if ((numA > 0 && numB > 0) || (numA < 0 && numB < 0)) return 'samesign';
    return 'diffsign';
  }, [numA, numB]);

  // Κείμενο εξήγησης κανόνα
  const ruleExplanation = useMemo(() => {
    const strA = numA > 0 ? `(＋${numA})` : numA < 0 ? `(－${absA})` : '0';
    const strB = numB > 0 ? `(＋${numB})` : numB < 0 ? `(－${absB})` : '0';

    if (numA === 0) return `${strA} ＋ ${strB} ＝ ${sum > 0 ? `＋${sum}` : sum} (το 0 δεν μεταβάλλει τον αριθμό).`;
    if (numB === 0) return `${strA} ＋ ${strB} ＝ ${sum > 0 ? `＋${sum}` : sum} (το 0 δεν μεταβάλλει τον αριθμό).`;

    if (ruleType === 'opposites') {
      return `Οι αριθμοί είναι αντίθετοι με ίσες απόλυτες τιμές (${absA} ＝ ${absB}). Το άθροισμά τους ισούται πάντα με 0: ${strA} ＋ ${strB} ＝ 0.`;
    }

    if (ruleType === 'samesign') {
      const signWord = numA > 0 ? 'θετικό (＋)' : 'αρνητικό (－)';
      const signSymbol = numA > 0 ? '＋' : '－';
      return `Ομόσημοι αριθμοί: Κρατάμε το κοινό ${signWord} πρόσημο και προσθέτουμε τις απόλυτες τιμές: ${signSymbol}(${absA} ＋ ${absB}) ＝ ${signSymbol}${absA + absB}.`;
    }

    // Ετερόσημοι
    const dominantNum = absA > absB ? numA : numB;
    const dominantSign = dominantNum > 0 ? '＋' : '－';
    const maxAbs = Math.max(absA, absB);
    const minAbs = Math.min(absA, absB);
    return `Ετερόσημοι αριθμοί: Βάζουμε το πρόσημο του αριθμού με τη μεγαλύτερη απόλυτη τιμή (${dominantSign}) και αφαιρούμε τη μικρότερη απόλυτη τιμή από τη μεγαλύτερη: ${dominantSign}(${maxAbs} － ${minAbs}) ＝ ${sum > 0 ? `＋${sum}` : sum}.`;
  }, [numA, numB, absA, absB, sum, ruleType]);

  // Μετατροπή τιμής [-15, 15] σε συντεταγμένη X στο SVG (viewBox 0 έως 760)
  // Κέντρο (0) στο x = 380, κάθε μονάδα = 22px
  const getSvgX = (val) => 380 + val * 22;

  return (
    <Layout
      title="Πρόσθεση Ακεραίων Αριθμών | Α' Γυμνασίου"
      description="Θεωρία, κανόνες ομόσημων και ετερόσημων αριθμών και διαδραστικός άξονας αναπαράστασης της πρόσθεσης ακεραίων."
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
        {/* Banner Header - Ενιαίο Indigo Theme χωρίς τόνους στα κεφαλαία */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 lg:p-14 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              Α' ΓΥΜΝΑΣΙΟΥ • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Πρόσθεση Ακέραιων Αριθμών
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              Μαθαίνουμε πώς προσθέτουμε ομόσημους και ετερόσημους αριθμούς και αναπαριστούμε διανυσματικά την πρόσθεση πάνω στον αριθμητικό άξονα.
            </p>
          </div>
        </section>

        {/* 1. ΟΙ ΔΥΟ ΚΑΝΟΝΕΣ ΤΗΣ ΠΡΟΣΘΕΣΗΣ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                1
              </span>
              Κανόνες Πρόσθεσης Ακεραίων
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            {/* Κανόνας Ομόσημων */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="text-xs font-bold text-indigo-600 uppercase">
                  ΚΑΝΟΝΑΣ 1
                </div>
                <h3 className="font-bold text-slate-900 text-base sm:text-xl">
                  Πρόσθεση Ομόσημων Αριθμών
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Για να προσθέσουμε δύο ομόσημους αριθμούς (και οι δύο θετικοί ή και οι δύο αρνητικοί):
                </p>
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1.5 text-xs sm:text-sm">
                  <div>1. Βάζουμε το <strong>κοινό τους πρόσημο</strong>.</div>
                  <div>2. <strong>Προσθέτουμε</strong> τις απόλυτες τιμές τους.</div>
                </div>
                <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 font-mono text-xs sm:text-sm text-indigo-950 space-y-1">
                  <div>(＋3) ＋ (＋5) ＝ ＋(3 ＋ 5) ＝ <strong>＋8</strong></div>
                  <div>(－4) ＋ (－6) ＝ －(4 ＋ 6) ＝ <strong>－10</strong></div>
                </div>
              </div>
            </div>

            {/* Κανόνας Ετερόσημων */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="text-xs font-bold text-indigo-600 uppercase">
                  ΚΑΝΟΝΑΣ 2
                </div>
                <h3 className="font-bold text-slate-900 text-base sm:text-xl">
                  Πρόσθεση Ετερόσημων Αριθμών
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Για να προσθέσουμε δύο ετερόσημους αριθμούς (ένας θετικός και ένας αρνητικός):
                </p>
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1.5 text-xs sm:text-sm">
                  <div>1. Βάζουμε το <strong>πρόσημο αυτού με τη μεγαλύτερη απόλυτη τιμή</strong>.</div>
                  <div>2. <strong>Αφαιρούμε</strong> τη μικρότερη απόλυτη τιμή από τη μεγαλύτερη.</div>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 font-mono text-xs sm:text-sm text-amber-950 space-y-1">
                  <div>(＋8) ＋ (－3) ＝ ＋(8 － 3) ＝ <strong>＋5</strong></div>
                  <div>(－9) ＋ (＋4) ＝ －(9 － 4) ＝ <strong>－5</strong></div>
                </div>
              </div>
            </div>
          </div>

          {/* Ειδικές Περιπτώσεις */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-1">
              <div className="font-bold text-indigo-950">Άθροισμα Αντιθέτων Αριθμών</div>
              <p className="text-slate-600">
                Το άθροισμα δύο αντίθετων αριθμών ισούται πάντα με το μηδέν: <strong>α ＋ (－α) ＝ 0</strong>.
              </p>
              <div className="font-mono font-bold text-indigo-900 pt-1">
                (＋7) ＋ (－7) ＝ 0
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-1">
              <div className="font-bold text-indigo-950">Πρόσθεση με το Μηδέν</div>
              <p className="text-slate-600">
                Το μηδέν είναι το ουδέτερο στοιχείο της πρόσθεσης: <strong>α ＋ 0 ＝ 0 ＋ α ＝ α</strong>.
              </p>
              <div className="font-mono font-bold text-indigo-900 pt-1">
                (－6) ＋ 0 ＝ －6
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ: ΠΡΟΣΘΕΣΗ ΣΤΟΝ ΑΞΟΝΑ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                2
              </span>
              Διαδραστικό Εργαστήριο: Γραφική Αναπαράσταση Πρόσθεσης
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Steppers Ελέγχου */}
            <div className="space-y-5 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Πρώτος Προσθετέος (α)
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
                  Δεύτερος Προσθετέος (β)
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

              {/* Τελικό Αποτέλεσμα Πρόσθεσης */}
              <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 text-center space-y-1 font-mono">
                <div className="text-xs text-indigo-700 font-sans font-bold uppercase">Αποτέλεσμα Πράξης</div>
                <div className="text-xl sm:text-2xl font-black text-indigo-950">
                  {numA > 0 ? `(＋${numA})` : numA < 0 ? `(－${absA})` : '0'} ＋{' '}
                  {numB > 0 ? `(＋${numB})` : numB < 0 ? `(－${absB})` : '0'} ＝{' '}
                  <span className="text-emerald-700">{sum > 0 ? `＋${sum}` : sum}</span>
                </div>
              </div>
            </div>

            {/* Αναπαράσταση στον Άξονα (SVG Responsive) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-slate-900 p-4 sm:p-6 rounded-2xl shadow-inner flex flex-col items-center justify-center">
                <div className="w-full max-w-[760px]">
                  <svg
                    viewBox="0 0 760 170"
                    className="w-full h-auto"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {/* Κύριος Άξονας */}
                    <line x1="20" y1="105" x2="740" y2="105" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
                    <polygon points="755,105 735,98 735,112" fill="#475569" />

                    {/* Υποδιαιρέσεις από -15 έως +15 */}
                    {Array.from({ length: 31 }, (_, i) => i - 15).map((val) => {
                      const x = getSvgX(val);
                      const isZero = val === 0;
                      return (
                        <g key={val}>
                          <line
                            x1={x}
                            y1={isZero ? 90 : 98}
                            x2={x}
                            y2={isZero ? 120 : 112}
                            stroke={isZero ? '#f8fafc' : '#64748b'}
                            strokeWidth={isZero ? '3' : '1.5'}
                          />
                          <text
                            x={x}
                            y={134}
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

                    {/* Βέλος 1: Από 0 στο numA */}
                    {numA !== 0 && (
                      <g>
                        <path
                          d={`M ${getSvgX(0)} 65 Q ${(getSvgX(0) + getSvgX(numA)) / 2} 35 ${getSvgX(numA)} 65`}
                          fill="none"
                          stroke="#818cf8"
                          strokeWidth="2.5"
                          strokeDasharray="3 2"
                        />
                        <circle cx={getSvgX(numA)} cy="65" r="4" fill="#818cf8" />
                        <text
                          x={(getSvgX(0) + getSvgX(numA)) / 2}
                          y="30"
                          textAnchor="middle"
                          fill="#818cf8"
                          fontSize="12"
                          fontWeight="bold"
                        >
                          1ο βήμα: {numA > 0 ? `＋${numA}` : numA}
                        </text>
                      </g>
                    )}

                    {/* Βέλος 2: Από numA στο sum (numA + numB) */}
                    {numB !== 0 && (
                      <g>
                        <path
                          d={`M ${getSvgX(numA)} 65 Q ${(getSvgX(numA) + getSvgX(sum)) / 2} 48 ${getSvgX(sum)} 100`}
                          fill="none"
                          stroke="#38bdf8"
                          strokeWidth="2.5"
                        />
                        <text
                          x={(getSvgX(numA) + getSvgX(sum)) / 2}
                          y="50"
                          textAnchor="middle"
                          fill="#38bdf8"
                          fontSize="12"
                          fontWeight="bold"
                        >
                          2ο βήμα: {numB > 0 ? `＋${numB}` : numB}
                        </text>
                      </g>
                    )}

                    {/* Τελικό Σημείο Αθροίσματος */}
                    <circle cx={getSvgX(sum)} cy="105" r="7" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                    <text
                      x={getSvgX(sum)}
                      y="155"
                      textAnchor="middle"
                      fontSize="13"
                      fontWeight="900"
                      fill="#34d399"
                    >
                      ΤΕΛΟΣ ({sum})
                    </text>
                  </svg>
                </div>
                <div className="text-slate-400 text-xs mt-2 text-center">
                  Ξεκινάμε από το 0, μετακινούμαστε κατά <strong>{numA}</strong> θέσεις και από εκεί συνεχίζουμε κατά <strong>{numB}</strong> θέσεις.
                </div>
              </div>

              {/* Κάρτα Επεξήγησης Κανόνα */}
              <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-1.5 text-xs sm:text-sm">
                <div className="font-bold text-indigo-950 uppercase text-[11px] tracking-wider">
                  ΜΑΘΗΜΑΤΙΚΗ ΑΝΑΛΥΣΗ ΒΗΜΑ-ΒΗΜΑ
                </div>
                <p className="text-slate-800 leading-relaxed">
                  {ruleExplanation}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
