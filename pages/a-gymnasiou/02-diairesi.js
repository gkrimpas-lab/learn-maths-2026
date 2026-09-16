import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function DiairesiTheoria() {
  // State για το διαδραστικό εργαστήριο Ευκλείδειας Διαίρεσης
  const [dividend, setDividend] = useState(23); // Διαιρετέος (Δ)
  const [divisor, setDivisor] = useState(5);   // Διαιρέτης (δ)

  // State για τον διαδραστικό έλεγχο διαιρετότητας (string για έλεγχο έως 10 ψηφία)
  const [testNumberStr, setTestNumberStr] = useState('120');

  // State για το διαδραστικό εργαστήριο Πρώτων & Σύνθετων
  const [primeTestNum, setPrimeTestNum] = useState(17);

  // Υπολογισμοί Ευκλείδειας Διαίρεσης: Δ = δ · π + υ
  const quotient = useMemo(() => Math.floor(dividend / divisor), [dividend, divisor]);
  const remainder = useMemo(() => dividend % divisor, [dividend, divisor]);
  const isExact = remainder === 0;

  // Stepper handlers
  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  // Χειρισμός εισαγωγής αριθμού κριτηρίων (μόνο ψηφία, έως 10 ψηφία)
  const handleTestNumberInput = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length <= 10) {
      setTestNumberStr(val);
    }
  };

  // Αυξομείωση κατά 1 για τον έλεγχο διαιρετότητας
  const handleTestNumberStep = (delta, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const current = BigInt(testNumberStr === '' ? '0' : testNumberStr);
    const next = current + BigInt(delta);
    if (next < 0n) return;
    const nextStr = next.toString();
    if (nextStr.length <= 10) {
      setTestNumberStr(nextStr);
    }
  };

  // Κριτήρια διαιρετότητας (ανθεκτικά σε αριθμούς έως 10 ψηφία)
  const divisibilityRules = useMemo(() => {
    if (!testNumberStr || testNumberStr.trim() === '') {
      return [];
    }

    const s = testNumberStr;
    const len = s.length;
    const lastDigit = parseInt(s[len - 1], 10);
    const lastTwoDigits = len >= 2 ? parseInt(s.slice(-2), 10) : lastDigit;
    const sumDigits = s
      .split('')
      .reduce((acc, digit) => acc + parseInt(digit, 10), 0);

    return [
      {
        divisor: 2,
        divisible: lastDigit % 2 === 0,
        reason: `Το τελευταίο ψηφίο είναι ${lastDigit} (${lastDigit % 2 === 0 ? 'άρτιο' : 'περιττό'}).`,
      },
      {
        divisor: 3,
        divisible: sumDigits % 3 === 0,
        reason: `Το άθροισμα των ψηφίων είναι ${sumDigits} (${sumDigits % 3 === 0 ? 'διαιρείται με το 3' : 'δεν διαιρείται με το 3'}).`,
      },
      {
        divisor: 4,
        divisible: lastTwoDigits % 4 === 0,
        reason: `Τα δύο τελευταία ψηφία σχηματίζουν τον αριθμό ${lastTwoDigits} (${lastTwoDigits % 4 === 0 ? 'διαιρείται με το 4' : 'δεν διαιρείται με το 4'}).`,
      },
      {
        divisor: 5,
        divisible: lastDigit === 0 || lastDigit === 5,
        reason: `Το τελευταίο ψηφίο είναι ${lastDigit} (${lastDigit === 0 || lastDigit === 5 ? 'λήγει σε 0 ή 5' : 'δεν λήγει σε 0 ή 5'}).`,
      },
      {
        divisor: 9,
        divisible: sumDigits % 9 === 0,
        reason: `Το άθροισμα των ψηφίων είναι ${sumDigits} (${sumDigits % 9 === 0 ? 'διαιρείται με το 9' : 'δεν διαιρείται με το 9'}).`,
      },
      {
        divisor: 10,
        divisible: lastDigit === 0,
        reason: `Το τελευταίο ψηφίο είναι ${lastDigit} (${lastDigit === 0 ? 'λήγει σε 0' : 'δεν λήγει σε 0'}).`,
      },
      {
        divisor: 25,
        divisible: [0, 25, 50, 75].includes(lastTwoDigits),
        reason: `Τα δύο τελευταία ψηφία είναι ${lastTwoDigits} (${[0, 25, 50, 75].includes(lastTwoDigits) ? 'λήγει σε 00, 25, 50 ή 75' : 'δεν λήγει σε 00, 25, 50 ή 75'}).`,
      },
    ];
  }, [testNumberStr]);

  // Εύρεση διαιρετών για τον έλεγχο πρώτων/σύνθετων
  const primeAnalysis = useMemo(() => {
    const n = primeTestNum;
    if (n < 2) {
      return {
        isPrime: false,
        isNeither: true,
        divisors: n === 1 ? [1] : [0],
        text: n === 1 ? 'Το 1 έχει μόνο 1 διαιρέτη τον εαυτό του.' : 'Το 0 έχει άπειρους διαιρέτες.',
      };
    }
    const divs = [];
    for (let i = 1; i <= n; i++) {
      if (n % i === 0) divs.push(i);
    }
    const isPrime = divs.length === 2;
    return {
      isPrime,
      isNeither: false,
      divisors: divs,
      text: isPrime
        ? `Έχει ακριβώς 2 διαιρέτες: το 1 και το ${n}.`
        : `Έχει ${divs.length} διαιρέτες: ${divs.join(', ')}.`,
    };
  }, [primeTestNum]);

  return (
    <Layout
      title="Ευκλείδεια Διαίρεση & Διαιρετότητα | Α' Γυμνασίου"
      description="Θεωρία, διαδραστικά εργαστήρια, κριτήρια διαιρετότητας και πρώτοι αριθμοί για την Α' Γυμνασίου."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/02-diairesi-ask"
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
              Ευκλείδεια Διαίρεση, Διαιρετότητα & Πρώτοι Αριθμοί
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              Μαθαίνουμε τη θεμελιώδη ταυτότητα της διαίρεσης, τους κανόνες διαιρετότητας για αριθμούς έως και 10 ψηφία και τη διάκριση πρώτων και σύνθετων αριθμών.
            </p>
          </div>
        </section>

        {/* 1. ΕΥΚΛΕΙΔΕΙΑ ΔΙΑΙΡΕΣΗ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                1
              </span>
              Η Έννοια της Ευκλείδειας Διαίρεσης
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            <div className="space-y-4">
              <p>
                Όταν έχουμε δύο φυσικούς αριθμούς <strong>Δ</strong> (Διαιρετέος) και <strong>δ</strong> (Διαιρέτης με δ ≠ 0), υπάρχουν δύο μοναδικοί φυσικοί αριθμοί <strong>π</strong> (πηλίκο) και <strong>υ</strong> (υπόλοιπο) τέτοιοι ώστε:
              </p>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-950 font-bold text-center text-lg sm:text-2xl font-mono">
                Δ ＝ δ · π ＋ υ
              </div>
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 text-xs sm:text-sm font-semibold">
                ⚠️ Απαράβατος Περιορισμός Υπολοίπου: <strong>0 ≤ υ ＜ δ</strong>
                <div className="text-slate-600 font-normal mt-1">
                  Το υπόλοιπο είναι πάντοτε φυσικός αριθμός και αυστηρά μικρότερο από τον διαιρέτη.
                </div>
              </div>
            </div>

            <div className="space-y-4 bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">Τέλεια και Ατελής Διαίρεση</h3>
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <div className="font-bold text-emerald-700 text-sm sm:text-base">Τέλεια Διαίρεση (υ ＝ 0)</div>
                  <p className="text-slate-600 mt-1">
                    Όταν το υπόλοιπο είναι 0, ισχύει <strong className="text-slate-900">Δ ＝ δ · π</strong>. Ο δ διαιρεί ακριβώς τον Δ.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <div className="font-bold text-indigo-700 text-sm sm:text-base">Ατελής Διαίρεση (υ ＞ 0)</div>
                  <p className="text-slate-600 mt-1">
                    Όταν περισσεύει μη μηδενικό υπόλοιπο, τότε <strong className="text-slate-900">Δ ＝ δ · π ＋ υ</strong> με <strong className="text-slate-900">υ ＜ δ</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Διαδραστικό Εργαστήριο Ευκλείδειας Διαίρεσης */}
          <div className="mt-8 pt-6 border-t border-slate-100 space-y-6">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              🛠️ Διαδραστικό Εργαστήριο: Οπτική Αναπαράσταση Διαίρεσης
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Steppers */}
              <div className="space-y-4 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    Διαιρετέος (Δ)
                  </label>
                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setDividend, -1, 1, 40, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-slate-900 font-bold text-base sm:text-lg whitespace-nowrap px-2">
                      Δ ＝ {dividend}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setDividend, 1, 1, 40, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    Διαιρέτης (δ)
                  </label>
                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setDivisor, -1, 1, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-slate-900 font-bold text-base sm:text-lg whitespace-nowrap px-2">
                      δ ＝ {divisor}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setDivisor, 1, 1, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 text-center space-y-1">
                  <div className="text-xs text-indigo-700 font-medium">Ταυτότητα Ευκλείδειας Διαίρεσης:</div>
                  <div className="text-lg sm:text-xl font-black text-indigo-950 font-mono">
                    {dividend} ＝ {divisor} · {quotient} ＋ {remainder}
                  </div>
                  <div className="text-xs font-bold mt-1">
                    {isExact ? (
                      <span className="text-emerald-700">ΤΕΛΕΙΑ ΔΙΑΙΡΕΣΗ (υ ＝ 0)</span>
                    ) : (
                      <span className="text-indigo-800">ΑΤΕΛΗΣ (υ ＝ {remainder} ＜ {divisor})</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Οπτικοποίηση Ομάδων (SVG Responsive - Χωρίς Scroll) */}
              <div className="lg:col-span-2 bg-slate-900 p-4 sm:p-6 rounded-2xl shadow-inner flex flex-col items-center justify-center">
                <div className="w-full max-w-[650px]">
                  <svg
                    viewBox={`0 0 600 ${Math.max(120, (quotient + (remainder > 0 ? 1 : 0)) * 46 + 30)}`}
                    className="w-full h-auto"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {Array.from({ length: quotient }).map((_, gIdx) => (
                      <g key={`group-${gIdx}`}>
                        <rect
                          x="20"
                          y={15 + gIdx * 46}
                          width={divisor * 34 + 16}
                          height="36"
                          rx="8"
                          fill="#1e1b4b"
                          stroke="#6366f1"
                          strokeWidth="1.5"
                        />
                        <text
                          x="5"
                          y={38 + gIdx * 46}
                          fill="#94a3b8"
                          fontSize="12"
                          fontWeight="bold"
                        >
                          {gIdx + 1}η
                        </text>
                        {Array.from({ length: divisor }).map((_, cIdx) => (
                          <circle
                            key={`c-${gIdx}-${cIdx}`}
                            cx={36 + cIdx * 34}
                            cy={33 + gIdx * 46}
                            r="10"
                            fill="#38bdf8"
                          />
                        ))}
                      </g>
                    ))}

                    {remainder > 0 && (
                      <g>
                        <rect
                          x="20"
                          y={15 + quotient * 46}
                          width={remainder * 34 + 16}
                          height="36"
                          rx="8"
                          fill="#4c0519"
                          stroke="#f43f5e"
                          strokeWidth="1.5"
                          strokeDasharray="4 2"
                        />
                        <text
                          x="5"
                          y={38 + quotient * 46}
                          fill="#fb7185"
                          fontSize="12"
                          fontWeight="bold"
                        >
                          υ
                        </text>
                        {Array.from({ length: remainder }).map((_, rIdx) => (
                          <circle
                            key={`r-${rIdx}`}
                            cx={36 + rIdx * 34}
                            cy={33 + quotient * 46}
                            r="10"
                            fill="#fb7185"
                          />
                        ))}
                      </g>
                    )}
                  </svg>
                </div>
                <div className="text-slate-300 text-xs sm:text-sm mt-3 text-center">
                  Σχηματίστηκαν <strong className="text-sky-300">{quotient}</strong> πλήρεις ισοπληθείς ομάδες των <strong className="text-sky-300">{divisor}</strong> στοιχείων και περίσσεψαν <strong className="text-rose-300">{remainder}</strong> στοιχεία.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΔΙΑΙΡΕΤΟΤΗΤΑ ΦΥΣΙΚΩΝ ΑΡΙΘΜΩΝ & ΚΡΙΤΗΡΙΑ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                2
              </span>
              Διαιρετότητα & Κριτήρια Διαιρετότητας
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            <div className="space-y-4">
              <p>
                Λέμε ότι ένας φυσικός αριθμός <strong>α</strong> διαιρείται από έναν φυσικό αριθμό <strong>β</strong> (β ≠ 0), όταν η διαίρεση α ： β είναι τέλεια (υ ＝ 0).
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-sm sm:text-base">
                <div>• Ο <strong>β</strong> ονομάζεται <strong>διαιρέτης</strong> του α.</div>
                <div>• Ο <strong>α</strong> ονομάζεται <strong>πολλαπλάσιο</strong> του β.</div>
                <div>• Συμβολισμός: <strong>α ＝ β · κ</strong> (όπου κ φυσικός αριθμός).</div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-slate-700 space-y-2 text-xs sm:text-sm">
              <h3 className="font-bold text-indigo-950 text-sm sm:text-base">Χρήσιμες Ιδιότητες Διαιρετότητας</h3>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>Το <strong>1</strong> είναι διαιρέτης κάθε φυσικού αριθμού (α ＝ α · 1).</li>
                <li>Κάθε φυσικός αριθμός α ≠ 0 είναι διαιρέτης του εαυτού του (α ＝ 1 · α).</li>
                <li>Το <strong>0</strong> είναι πολλαπλάσιο κάθε φυσικού αριθμού β ≠ 0 (0 ＝ 0 · β).</li>
                <li>Αν ένας αριθμός διαιρεί δύο άλλους, διαιρεί και το άθροισμα και τη διαφορά τους.</li>
              </ul>
            </div>
          </div>

          {/* Πίνακας Κριτηρίων Διαιρετότητας */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-xl font-bold text-slate-900">
              Κανόνες (Κριτήρια) Διαιρετότητας
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="text-xs font-bold text-indigo-600 uppercase">Διαίρεση με το 2</div>
                <div className="font-bold text-slate-900 text-sm sm:text-base">Λήγει σε άρτιο ψηφίο</div>
                <p className="text-xs text-slate-600">Το τελευταίο ψηφίο είναι 0, 2, 4, 6 ή 8.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="text-xs font-bold text-indigo-600 uppercase">Διαίρεση με το 3</div>
                <div className="font-bold text-slate-900 text-sm sm:text-base">Άθροισμα ψηφίων</div>
                <p className="text-xs text-slate-600">Το άθροισμα των ψηφίων του διαιρείται με το 3.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="text-xs font-bold text-indigo-600 uppercase">Διαίρεση με το 4</div>
                <div className="font-bold text-slate-900 text-sm sm:text-base">Δύο τελευταία ψηφία</div>
                <p className="text-xs text-slate-600">Τα 2 τελευταία ψηφία σχηματίζουν αριθμό που διαιρείται με το 4 (ή λήγει σε 00).</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="text-xs font-bold text-indigo-600 uppercase">Διαίρεση με το 5</div>
                <div className="font-bold text-slate-900 text-sm sm:text-base">Λήγει σε 0 ή 5</div>
                <p className="text-xs text-slate-600">Το τελευταίο του ψηφίο είναι αποκλειστικά 0 ή 5.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="text-xs font-bold text-indigo-600 uppercase">Διαίρεση με το 9</div>
                <div className="font-bold text-slate-900 text-sm sm:text-base">Άθροισμα ψηφίων</div>
                <p className="text-xs text-slate-600">Το άθροισμα των ψηφίων του διαιρείται με το 9.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="text-xs font-bold text-indigo-600 uppercase">Διαίρεση με το 10 & 25</div>
                <div className="font-bold text-slate-900 text-sm sm:text-base">Τελικά ψηφία</div>
                <p className="text-xs text-slate-600">Με το 10: λήγει σε 0. Με το 25: τα 2 τελευταία ψηφία είναι 00, 25, 50 ή 75.</p>
              </div>
            </div>
          </div>

          {/* Διαδραστικός Έλεγχος Κριτηρίων για οποιονδήποτε αριθμό (έως 10 ψηφία) */}
          <div className="mt-8 pt-6 border-t border-slate-100 space-y-6">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              🛠️ Διαδραστικός Έλεγχος Κριτηρίων Διαιρετότητας (έως 10 ψηφία)
            </h3>

            <div className="bg-slate-50 p-5 sm:p-8 rounded-2xl border border-slate-200 space-y-6">
              <div className="max-w-md space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-slate-600 uppercase">
                    Πληκτρολόγησε αριθμό (Μέγιστο 10 ψηφία)
                  </label>
                  <span className="text-xs font-mono text-slate-400">
                    {testNumberStr.length}/10
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleTestNumberStep(-1, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                  >
                    －
                  </button>

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    value={testNumberStr}
                    onChange={handleTestNumberInput}
                    placeholder="π.χ. 120"
                    className="h-full w-full bg-white rounded-xl border border-slate-300 text-slate-900 font-black text-center text-lg sm:text-xl font-mono focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                  />

                  <button
                    type="button"
                    onClick={(e) => handleTestNumberStep(1, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Πίνακας αποτελεσμάτων */}
              {testNumberStr ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {divisibilityRules.map((rule) => (
                    <div
                      key={rule.divisor}
                      className={`p-4 rounded-xl border transition-all ${
                        rule.divisible
                          ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-sm sm:text-base">
                        <span>Διαίρεση με το {rule.divisor}</span>
                        <span>{rule.divisible ? '✅ ΝΑΙ' : '❌ ΟΧΙ'}</span>
                      </div>
                      <p className="text-xs mt-1.5 leading-relaxed opacity-90">
                        {rule.reason}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 font-medium text-sm">
                  Πληκτρολόγησε έναν αριθμό στο παραπάνω πλαίσιο για να δεις τα κριτήρια διαιρετότητας.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 3. ΠΡΩΤΟΙ ΚΑΙ ΣΥΝΘΕΤΟΙ ΑΡΙΘΜΟΙ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                3
              </span>
              Πρώτοι & Σύνθετοι Αριθμοί
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2">
                <div className="font-bold text-indigo-950 text-base sm:text-lg">
                  Πρώτος Αριθμός
                </div>
                <p className="text-xs sm:text-sm text-slate-600">
                  Ονομάζεται κάθε φυσικός αριθμός μεγαλύτερος του 1 που έχει <strong>ακριβώς δύο διαφορετικούς διαιρέτες</strong>: τη μονάδα (1) και τον εαυτό του.
                </p>
                <div className="font-mono text-xs sm:text-sm font-bold text-indigo-900 pt-1">
                  Παραδείγματα: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31...
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-base sm:text-lg">
                  Σύνθετος Αριθμός
                </div>
                <p className="text-xs sm:text-sm text-slate-600">
                  Ονομάζεται κάθε φυσικός αριθμός μεγαλύτερος του 1 που έχει <strong>περισσότερους από δύο διαιρέτες</strong>.
                </p>
                <div className="font-mono text-xs sm:text-sm font-bold text-slate-800 pt-1">
                  Παραδείγματα: 4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20...
                </div>
              </div>
            </div>

            <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200/80 space-y-3 text-xs sm:text-sm text-slate-700">
              <h3 className="font-bold text-amber-950 text-sm sm:text-base">Σημαντικές Παρατηρήσεις</h3>
              <ul className="list-disc list-inside space-y-2 text-slate-600">
                <li>
                  Ο αριθμός <strong>1</strong> δεν είναι ούτε πρώτος ούτε σύνθετος, γιατί έχει μόνο έναν διαιρέτη (τον εαυτό του).
                </li>
                <li>
                  Ο αριθμός <strong>0</strong> δεν είναι ούτε πρώτος ούτε σύνθετος.
                </li>
                <li>
                  Ο αριθμός <strong>2</strong> είναι ο μικρότερος πρώτος αριθμός και ο <strong>μοναδικός άρτιος πρώτος</strong>. Όλοι οι άλλοι άρτιοι είναι σύνθετοι (διαιρούνται με το 2).
                </li>
                <li>
                  Κάθε σύνθετος φυσικός αριθμός μπορεί να αναλυθεί σε <strong>γινόμενο πρώτων παραγόντων</strong> κατά μοναδικό τρόπο.
                </li>
              </ul>
            </div>
          </div>

          {/* Διαδραστικό Εργαστήριο Ελέγχου Πρώτου/Σύνθετου */}
          <div className="mt-8 pt-6 border-t border-slate-100 space-y-6">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              🛠️ Διαδραστικό Εργαστήριο: Έλεγχος Πρώτου ή Σύνθετου Αριθμού
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-600 uppercase">
                  Επίλεξε αριθμό (2 έως 100)
                </label>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setPrimeTestNum, -1, 2, 100, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-slate-900 font-black text-xl font-mono">
                    {primeTestNum}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setPrimeTestNum, 1, 2, 100, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Κάρτα Αποτελέσματος */}
              <div className="lg:col-span-2 p-6 rounded-2xl border bg-gradient-to-br from-indigo-900 to-slate-900 text-white space-y-3 shadow-md">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="text-xs uppercase tracking-widest text-indigo-300 font-semibold">
                    Χαρακτηρισμός
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      primeAnalysis.isPrime
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                    }`}
                  >
                    {primeAnalysis.isPrime ? 'ΠΡΩΤΟΣ ΑΡΙΘΜΟΣ' : 'ΣΥΝΘΕΤΟΣ ΑΡΙΘΜΟΣ'}
                  </span>
                </div>

                <div className="text-2xl sm:text-3xl font-black font-mono">
                  Ο αριθμός {primeTestNum} είναι {primeAnalysis.isPrime ? 'Πρώτος' : 'Σύνθετος'}
                </div>

                <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm text-indigo-100 leading-relaxed">
                  {primeAnalysis.text}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
