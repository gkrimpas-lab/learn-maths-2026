import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function AkeraioiTheoria() {
  // State για δύο ακεραίους στο διαδραστικό εργαστήριο
  const [numA, setNumA] = useState(-4);
  const [numB, setNumB] = useState(6);

  // Stepper handlers
  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  // Υπολογισμοί
  const absA = useMemo(() => Math.abs(numA), [numA]);
  const absB = useMemo(() => Math.abs(numB), [numB]);
  const oppositeA = useMemo(() => -numA, [numA]);
  const oppositeB = useMemo(() => -numB, [numB]);
  const distanceAB = useMemo(() => Math.abs(numA - numB), [numA, numB]);

  // Σύγκριση
  const comparisonSymbol = useMemo(() => {
    if (numA < numB) return '＜';
    if (numA > numB) return '＞';
    return '＝';
  }, [numA, numB]);

  // Μετατροπή τιμής [-10, 10] σε συντεταγμένη X στο SVG (viewBox 0 έως 700)
  // Κέντρο (0) στο x = 350, κάθε μονάδα = 28px
  const getSvgX = (val) => 350 + val * 28;

  return (
    <Layout
      title="Ακέραιοι Αριθμοί | Α' Γυμνασίου"
      description="Θεωρία, απόλυτη τιμή, αντίθετοι αριθμοί και διαδραστικός άξονας για τους ακέραιους αριθμούς της Α' Γυμνασίου."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/05-akeraioi-ask"
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
              Η Έννοια των Ακέραιων Αριθμών
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              Γνωρίζουμε τους θετικούς και αρνητικούς αριθμούς, την τοποθέτησή τους στον προσανατολισμένο άξονα, την έννοια της απόλυτης τιμής και τους αντίθετους αριθμούς.
            </p>
          </div>
        </section>

        {/* 1. ΕΙΣΑΓΩΓΗ ΣΤΟΥΣ ΑΚΕΡΑΙΟΥΣ ΑΡΙΘΜΟΥΣ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                1
              </span>
              Θετικοί, Αρνητικοί Αριθμοί & Το Σύνολο ℤ
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            <div className="space-y-4">
              <p>
                Στην καθημερινή ζωή συναντάμε μεγέθη με δύο αντίθετες κατευθύνσεις: θερμοκρασία (πάνω ή κάτω από το 0), υψόμετρο (πάνω ή κάτω από την επιφάνεια της θάλασσας), οικονομικές καταστάσεις (κέρδος ή ζημιά).
              </p>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-950 font-semibold text-center text-sm sm:text-base font-mono">
                ℤ ＝ {'{'} ... , －3, －2, －1, 0, ＋1, ＋2, ＋3, ... {'}'}
              </div>
              <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-slate-600">
                <li>
                  <strong>Θετικοί αριθμοί:</strong> Βρίσκονται δεξιά από το 0 και γράφονται με πρόσημο ＋ (ή χωρίς πρόσημο): ＋1, ＋2, ＋3...
                </li>
                <li>
                  <strong>Αρνητικοί αριθμοί:</strong> Βρίσκονται αριστερά από το 0 και γράφονται υποχρεωτικά με πρόσημο －: －1, －2, －3...
                </li>
                <li>
                  <strong>Το μηδέν (0):</strong> Δεν είναι ούτε θετικός ούτε αρνητικός αριθμός. Είναι το ουδέτερο σημείο αναφοράς.
                </li>
              </ul>
            </div>

            {/* Πρακτικές Εφαρμογές */}
            <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold uppercase text-slate-500">
                ΠΑΡΑΔΕΙΓΜΑΤΑ ΣΤΗΝ ΚΑΘΗΜΕΡΙΝΟΤΗΤΑ
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-indigo-900">🌡️ Θερμοκρασία</div>
                  <div className="text-slate-600">5 βαθμοί υπό το μηδέν: <strong>－5 °C</strong></div>
                  <div className="text-slate-600">22 βαθμοί πάνω από το μηδέν: <strong>＋22 °C</strong></div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-indigo-900">🏔️ Υψόμετρο</div>
                  <div className="text-slate-600">Κορυφή βουνού: <strong>＋1.200 m</strong></div>
                  <div className="text-slate-600">Βυθός θάλασσας: <strong>－350 m</strong></div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1 sm:col-span-2">
                  <div className="font-bold text-indigo-900">💶 Οικονομικά</div>
                  <div className="text-slate-600">Κατάθεση / Κέρδος: <strong>＋150 €</strong> | Ανάληψη / Χρέος: <strong>－80 €</strong></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΑΠΟΛΥΤΗ ΤΙΜΗ & ΑΝΤΙΘΕΤΟΙ ΑΡΙΘΜΟΙ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                2
              </span>
              Απόλυτη Τιμή & Αντίθετοι Αριθμοί
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            {/* Απόλυτη Τιμή */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="text-xs font-bold text-indigo-600 uppercase">
                  ΓΕΩΜΕΤΡΙΚΗ ΕΝΝΟΙΑ ΑΠΟΣΤΑΣΗΣ
                </div>
                <h3 className="font-bold text-slate-900 text-base sm:text-xl">
                  Απόλυτη Τιμή Ακέραιου (|α|)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  <strong>Απόλυτη τιμή</strong> ενός αριθμού α ονομάζεται η <strong>απόσταση</strong> του σημείου που τον παριστάνει στον άξονα από την αρχή Ο(0).
                </p>
                <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-xs sm:text-sm text-indigo-950 space-y-1">
                  <div>|＋5| ＝ 5  (απόσταση 5 μονάδες)</div>
                  <div>|－5| ＝ 5  (απόσταση 5 μονάδες)</div>
                  <div>|0| ＝ 0</div>
                </div>
                <p className="text-xs text-slate-500">
                  Η απόλυτη τιμή εκφράζει απόσταση, επομένως είναι <strong>πάντοτε θετικός αριθμός ή μηδέν</strong> (|α| ≥ 0).
                </p>
              </div>
            </div>

            {/* Αντίθετοι Αριθμοί */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="text-xs font-bold text-indigo-600 uppercase">
                  ΣΥΜΜΕΤΡΙΑ ΩΣ ΠΡΟΣ ΤΟ ΜΗΔΕΝ
                </div>
                <h3 className="font-bold text-slate-900 text-base sm:text-xl">
                  Αντίθετοι Αριθμοί
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Δύο αριθμοί που έχουν <strong>διαφορετικό πρόσημο</strong> αλλά την <strong>ίδια απόλυτη τιμή</strong> ονομάζονται <strong>αντίθετοι</strong>.
                </p>
                <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-xs sm:text-sm text-indigo-950 space-y-1">
                  <div>Αντίθετος του ＋7 είναι ο －7</div>
                  <div>Αντίθετος του －12 είναι ο ＋12</div>
                  <div>Αντίθετος του 0 είναι το 0</div>
                </div>
                <p className="text-xs text-slate-500">
                  Οι αντίθετοι αριθμοί βρίσκονται σε ίσες αποστάσεις εκατέρωθεν του μηδενός και το άθροισμά τους είναι πάντα μηδέν: <strong>α ＋ (－α) ＝ 0</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Κανόνες Σύγκρισης & Διάταξης */}
          <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-3 text-xs sm:text-sm text-slate-700">
            <h3 className="font-bold text-indigo-950 text-sm sm:text-base">
              Κανόνες Σύγκρισης Ακεραίων
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-white rounded-xl border border-indigo-100">
                <div className="font-bold text-indigo-900">Θετικός με Αρνητικό</div>
                <p className="text-slate-600 mt-1">Κάθε θετικός αριθμός είναι μεγαλύτερος από κάθε αρνητικό αριθμό: <strong>＋3 ＞ －8</strong>.</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-indigo-100">
                <div className="font-bold text-indigo-900">Σύγκριση με το 0</div>
                <p className="text-slate-600 mt-1">Κάθε θετικός είναι ＞ 0, ενώ κάθε αρνητικός είναι ＜ 0: <strong>－4 ＜ 0 ＜ ＋2</strong>.</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-indigo-100">
                <div className="font-bold text-indigo-900">Δύο Αρνητικοί</div>
                <p className="text-slate-600 mt-1">Μεγαλύτερος είναι αυτός που έχει τη <strong>μικρότερη απόλυτη τιμή</strong> (πιο κοντά στο 0): <strong>－2 ＞ －7</strong>.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ: ΑΡΙΘΜΗΤΙΚΟΣ ΑΞΟΝΑΣ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                3
              </span>
              Διαδραστικό Εργαστήριο: Ολοκληρωμένος Άξονας Ακεραίων
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Steppers Ελέγχου για Σημείο A και Σημείο B */}
            <div className="space-y-5 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Σημείο Α (Ακέραιος α)
                </label>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setNumA, -1, -10, 10, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-indigo-900 font-black text-lg font-mono whitespace-nowrap px-2">
                    α ＝ {numA > 0 ? `＋${numA}` : numA}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setNumA, 1, -10, 10, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Σημείο Β (Ακέραιος β)
                </label>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setNumB, -1, -10, 10, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-amber-900 font-black text-lg font-mono whitespace-nowrap px-2">
                    β ＝ {numB > 0 ? `＋${numB}` : numB}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setNumB, 1, -10, 10, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Σύγκριση και Απόσταση */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs space-y-1.5 font-mono">
                <div className="text-slate-500 font-sans font-bold">ΣΧΕΣΕΙΣ:</div>
                <div className="text-slate-900 font-bold">
                  Σύγκριση: {numA > 0 ? `＋${numA}` : numA} {comparisonSymbol} {numB > 0 ? `＋${numB}` : numB}
                </div>
                <div className="text-slate-900">
                  Απόσταση (Α, Β) ＝ {distanceAB} μονάδες
                </div>
              </div>
            </div>

            {/* Οπτική Απεικόνιση στον Άξονα (SVG Responsive) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-slate-900 p-4 sm:p-6 rounded-2xl shadow-inner flex flex-col items-center justify-center">
                <div className="w-full max-w-[700px]">
                  <svg
                    viewBox="0 0 700 130"
                    className="w-full h-auto"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {/* Κύριος Άξονας x'Ox */}
                    <line x1="30" y1="65" x2="670" y2="65" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
                    <polygon points="685,65 665,58 665,72" fill="#475569" />
                    <text x="675" y="52" fill="#94a3b8" fontSize="13" fontWeight="bold">x</text>
                    <text x="15" y="69" fill="#94a3b8" fontSize="13" fontWeight="bold">x'</text>

                    {/* Υποδιαιρέσεις από -10 έως +10 */}
                    {Array.from({ length: 21 }, (_, i) => i - 10).map((val) => {
                      const x = getSvgX(val);
                      const isZero = val === 0;
                      return (
                        <g key={val}>
                          <line
                            x1={x}
                            y1={isZero ? 48 : 57}
                            x2={x}
                            y2={isZero ? 82 : 73}
                            stroke={isZero ? '#f8fafc' : '#64748b'}
                            strokeWidth={isZero ? '3' : '1.5'}
                          />
                          <text
                            x={x}
                            y={98}
                            textAnchor="middle"
                            fontSize={isZero ? '14' : '11'}
                            fontWeight={isZero ? '900' : '600'}
                            fill={isZero ? '#f8fafc' : '#94a3b8'}
                          >
                            {val}
                          </text>
                        </g>
                      );
                    })}

                    {/* Σημείο Ο(0) */}
                    <text x="350" y="40" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#38bdf8">
                      O
                    </text>

                    {/* Σημείο A */}
                    <g>
                      <circle cx={getSvgX(numA)} cy="65" r="7" fill="#6366f1" stroke="#ffffff" strokeWidth="2" />
                      <text
                        x={getSvgX(numA)}
                        y="28"
                        textAnchor="middle"
                        fontSize="14"
                        fontWeight="bold"
                        fill="#818cf8"
                      >
                        A({numA})
                      </text>
                    </g>

                    {/* Σημείο B */}
                    <g>
                      <circle cx={getSvgX(numB)} cy="65" r="7" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                      <text
                        x={getSvgX(numB)}
                        y="28"
                        textAnchor="middle"
                        fontSize="14"
                        fontWeight="bold"
                        fill="#fbbf24"
                      >
                        B({numB})
                      </text>
                    </g>
                  </svg>
                </div>
                <div className="text-slate-400 text-xs mt-2 text-center">
                  Κάθε σημείο στον άξονα αντιστοιχεί μονοσήμαντα σε έναν ακέραιο αριθμό (τετμημένη).
                </div>
              </div>

              {/* Κάρτες Ιδιοτήτων A & B */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 space-y-1 font-mono">
                  <div className="text-indigo-900 font-sans font-bold">ΧΑΡΑΚΤΗΡΙΣΤΙΚΑ ΣΗΜΕΙΟΥ Α:</div>
                  <div>Τιμή: <strong>{numA > 0 ? `＋${numA}` : numA}</strong></div>
                  <div>Απόλυτη Τιμή: |{numA}| ＝ <strong>{absA}</strong></div>
                  <div>Αντίθετος Αριθμός: <strong>{oppositeA > 0 ? `＋${oppositeA}` : oppositeA}</strong></div>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1 font-mono">
                  <div className="text-amber-900 font-sans font-bold">ΧΑΡΑΚΤΗΡΙΣΤΙΚΑ ΣΗΜΕΙΟΥ Β:</div>
                  <div>Τιμή: <strong>{numB > 0 ? `＋${numB}` : numB}</strong></div>
                  <div>Απόλυτη Τιμή: |{numB}| ＝ <strong>{absB}</strong></div>
                  <div>Αντίθετος Αριθμός: <strong>{oppositeB > 0 ? `＋${oppositeB}` : oppositeB}</strong></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
