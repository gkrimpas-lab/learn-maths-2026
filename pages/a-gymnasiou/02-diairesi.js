import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function DiairesiTheoria() {
  // State για το διαδραστικό εργαστήριο Ευκλείδειας Διαίρεσης
  const [dividend, setDividend] = useState(23); // Διαιρετέος (Δ)
  const [divisor, setDivisor] = useState(5);   // Διαιρέτης (δ)

  // State για το διαδραστικό εργαλείο ελέγχου διαιρετότητας
  const [testNumber, setTestNumber] = useState(120);

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

  // Κριτήρια διαιρετότητας για τον αριθμό δοκιμής
  const divisibilityRules = useMemo(() => {
    const n = Math.abs(testNumber);
    const lastDigit = n % 10;
    const lastTwoDigits = n % 100;
    const sumDigits = n
      .toString()
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
        reason: `Το άθροισμα ψηφίων είναι ${sumDigits} (${sumDigits % 3 === 0 ? 'διαιρείται με το 3' : 'δεν διαιρείται με το 3'}).`,
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
        reason: `Το άθροισμα ψηφίων είναι ${sumDigits} (${sumDigits % 9 === 0 ? 'διαιρείται με το 9' : 'δεν διαιρείται με το 9'}).`,
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
  }, [testNumber]);

  return (
    <Layout
      title="Ευκλείδεια Διαίρεση & Διαιρετότητα | Α' Γυμνασίου"
      description="Θεωρία, διαδραστικό εργαστήριο και κριτήρια διαιρετότητας για την Ευκλείδεια διαίρεση των φυσικών αριθμών."
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
              Ευκλείδεια Διαίρεση & Διαιρετότητα
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              Μαθαίνουμε τη θεμελιώδη ταυτότητα της διαίρεσης, τη διάκριση τέλειας και ατελούς διαίρεσης, καθώς και τους κανόνες που μας αποκαλύπτουν αν ένας αριθμός διαιρείται ακριβώς από έναν άλλον.
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
                Όταν έχουμε δύο φυσικούς αριθμούς <strong>Δ</strong> (Διαιρετέος) και <strong>δ</strong> (Διαιρέτης με δ ≠ 0), υπάρχουν πάντα δύο μοναδικοί φυσικοί αριθμοί <strong>π</strong> (πηλίκο) και <strong>υ</strong> (υπόλοιπο) τέτοιοι ώστε:
              </p>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-950 font-bold text-center text-lg sm:text-2xl font-mono">
                Δ ＝ δ · π ＋ υ
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 text-xs sm:text-sm font-semibold">
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
                    Όταν το υπόλοιπο είναι 0, τότε <strong className="text-slate-900">Δ ＝ δ · π</strong>. Λέμε ότι ο δ διαιρεί ακριβώς τον Δ (ή ο Δ διαιρείται από τον δ).
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <div className="font-bold text-indigo-700 text-sm sm:text-base">Ατελής Διαίρεση (υ ＞ 0)</div>
                  <p className="text-slate-600 mt-1">
                    Όταν υπάρχει μη μηδενικό υπόλοιπο, τότε <strong className="text-slate-900">Δ ＝ δ · π ＋ υ</strong> με <strong className="text-slate-900">υ ＜ δ</strong>.
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

                {/* Ταυτότητα Διαίρεσης */}
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
                    {/* Σχεδιασμός Ομάδων Πηλίκου */}
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

                    {/* Σχεδιασμός Περισσεύματος (Υπόλοιπο) */}
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
                  Σχηματίστηκαν <strong className="text-sky-300">{quotient}</strong> πλήρεις ισοπληθείς ομάδες των <strong className="text-sky-300">{divisor}</strong> στοιχείων και περίσσεψαν <strong className="text-rose-300">{remainder}</strong> στοιχεία (υπόλοιπο).
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΔΙΑΙΡΕΤΟΤΗΤΑ ΦΥΣΙΚΩΝ ΑΡΙΘΜΩΝ */}
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
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-indigo-600 uppercase">Διαίρεση με το 2</div>
                <div className="font-bold text-slate-900 text-sm sm:text-base">Λήγει σε άρτιο ψηφίο</div>
                <p className="text-xs text-slate-600">Το τελευταίο ψηφίο είναι 0, 2, 4, 6 ή 8.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-indigo-600 uppercase">Διαίρεση με το 3</div>
                <div className="font-bold text-slate-900 text-sm sm:text-base">Άθροισμα ψηφίων</div>
                <p className="text-xs text-slate-600">Το άθροισμα των ψηφίων του διαιρείται με το 3.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-indigo-600 uppercase">Διαίρεση με το 4</div>
                <div className="font-bold text-slate-900 text-sm sm:text-base">Δύο τελευταία ψηφία</div>
                <p className="text-xs text-slate-600">Ο αριθμός που σχηματίζουν τα 2 τελευταία ψηφία διαιρείται με το 4 (ή λήγει σε 00).</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-indigo-600 uppercase">Διαίρεση με το 5</div>
                <div className="font-bold text-slate-900 text-sm sm:text-base">Λήγει σε 0 ή 5</div>
                <p className="text-xs text-slate-600">Το τελευταίο του ψηφίο είναι αποκλειστικά 0 ή 5.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-indigo-600 uppercase">Διαίρεση με το 9</div>
                <div className="font-bold text-slate-900 text-sm sm:text-base">Άθροισμα ψηφίων</div>
                <p className="text-xs text-slate-600">Το άθροισμα των ψηφίων του διαιρείται με το 9.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-indigo-600 uppercase">Διαίρεση με το 10 & 25</div>
                <div className="font-bold text-slate-900 text-sm sm:text-base">Τελικά ψηφία</div>
                <p className="text-xs text-slate-600">Με το 10: λήγει σε 0. Με το 25: τα 2 τελευταία ψηφία είναι 00, 25, 50 ή 75.</p>
              </div>
            </div>
          </div>

          {/* Διαδραστικός Έλεγχος Κριτηρίων για οποιονδήποτε αριθμό */}
          <div className="mt-8 pt-6 border-t border-slate-100 space-y-6">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              🛠️ Διαδραστικός Έλεγχος Κριτηρίων Διαιρετότητας
            </h3>

            <div className="bg-slate-50 p-5 sm:p-8 rounded-2xl border border-slate-200 space-y-6">
              <div className="max-w-xs space-y-2">
                <label className="block text-xs font-bold text-slate-600 uppercase">
                  Επίλεξε ή άλλαξε αριθμό για έλεγχο
                </label>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setTestNumber, -5, 2, 9999, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-slate-900 font-black text-lg whitespace-nowrap px-2 font-mono">
                    {testNumber}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setTestNumber, 5, 2, 9999, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Πίνακας αποτελεσμάτων κριτηρίων για τον επιλεγμένο αριθμό */}
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
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
