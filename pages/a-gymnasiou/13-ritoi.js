import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Βοηθητικός υπολογισμός ΜΚΔ (Ευκλείδης)
const gcd = (a, b) => {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
};

// Επαναχρησιμοποιήσιμο component για κλασματική γραφή με πρόσημο μπροστά από τη γραμμή
function Frac({ num, den, className = '', lineClass = 'border-slate-400' }) {
  const isNegative = (num < 0 && den > 0) || (num > 0 && den < 0);
  const absNum = Math.abs(num);
  const absDen = Math.abs(den);

  return (
    <span className={`inline-flex items-center gap-1 align-middle mx-1 ${className}`}>
      {isNegative && <span className="font-bold">－</span>}
      <span className="inline-flex flex-col items-center justify-center leading-none text-center">
        <span className="pb-1 px-1 border-b-2 w-full text-center" style={{ borderColor: 'currentColor' }}>
          {absNum}
        </span>
        <span className="pt-1 px-1 w-full text-center">
          {absDen}
        </span>
      </span>
    </span>
  );
}

export default function RitoiTheoria() {
  // State για Εργαστήριο 1: Κλάσμα -> Δεκαδικός
  const [numA, setNumA] = useState(-3);
  const [denB, setDenB] = useState(4);

  // State για Εργαστήριο 2: Δεκαδικός -> Κλάσμα
  const [decInput, setDecInput] = useState('-0,75');

  // Steppers για το Εργαστήριο 1
  const handleStepNum = (delta, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setNumA((prev) => Math.max(-20, Math.min(20, prev + delta)));
  };

  const handleStepDen = (delta, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setDenB((prev) => {
      let next = prev + delta;
      if (next === 0) next = delta > 0 ? 1 : -1;
      return Math.max(1, Math.min(20, next));
    });
  };

  // Υπολογισμοί Εργαστηρίου 1 (Κλάσμα -> Δεκαδικός)
  const fracAnalysis = useMemo(() => {
    const g = gcd(numA, denB);
    const simpNum = numA / g;
    const simpDen = denB / g;
    const val = numA / denB;

    const isInt = Number.isInteger(val);
    const decStr = val.toString().replace('.', ',');

    let tempDen = Math.abs(simpDen);
    while (tempDen % 2 === 0) tempDen /= 2;
    while (tempDen % 5 === 0) tempDen /= 5;
    const isTerminating = tempDen === 1;

    let displayDec = decStr;
    if (!isTerminating && !isInt) {
      displayDec = val.toFixed(4).replace('.', ',') + '...';
    }

    return {
      val,
      simpNum,
      simpDen,
      gcdVal: g,
      isInt,
      isTerminating,
      displayDec,
    };
  }, [numA, denB]);

  // Handler εισαγωγής για Εργαστήριο 2 (Δεκαδικός -> Κλάσμα)
  const handleDecChange = (e) => {
    const clean = e.target.value.replace(/[^0-9,.-]/g, '');
    setDecInput(clean);
  };

  // Υπολογισμοί Εργαστηρίου 2 (Δεκαδικός -> Κλάσμα)
  const decAnalysis = useMemo(() => {
    const clean = decInput.trim().replace(',', '.');
    const parsed = parseFloat(clean);

    if (isNaN(parsed) || !isFinite(parsed)) {
      return { isValid: false };
    }

    const isNeg = parsed < 0;
    const absVal = Math.abs(parsed);
    const parts = absVal.toString().split('.');
    const decimals = parts[1] ? parts[1].length : 0;

    const denominator = Math.pow(10, decimals);
    const numerator = Math.round(absVal * denominator);
    const signedNumerator = isNeg ? -numerator : numerator;

    const g = gcd(signedNumerator, denominator);
    const redNum = signedNumerator / g;
    const redDen = denominator / g;

    return {
      isValid: true,
      rawNum: signedNumerator,
      rawDen: denominator,
      redNum,
      redDen,
      gcdVal: g,
      decimals,
    };
  }, [decInput]);

  return (
    <Layout
      title="Ρητοί Αριθμοί | Α' Γυμνασίου"
      description="Έννοια ρητών αριθμών, μετατροπή δεκαδικών σε κλάσματα και κλασμάτων σε δεκαδικούς με διαδραστικά εργαστήρια."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/13-ritoi-ask"
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
              Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 11 • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Η Έννοια των Ρητών Αριθμών
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              Γνωρίζουμε το σύνολο ℚ των ρητών αριθμών, τη σχέση τους με τα κλάσματα και τους δεκαδικούς, καθώς και τις τεχνικές αμφίδρομης μετατροπής μεταξύ κλασματικής και δεκαδικής μορφής.
            </p>
          </div>
        </section>

        {/* 1. ΤΙ ΕΙΝΑΙ ΡΗΤΟΣ ΑΡΙΘΜΟΣ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                1
              </span>
              Ορισμός Ρητού Αριθμού & Το Σύνολο ℚ
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="space-y-4">
              <p>
                <strong>Ρητός</strong> ονομάζεται κάθε αριθμός που μπορεί να γραφεί στη μορφή κλάσματος{' '}
                <Frac num="α" den="β" className="text-indigo-950 font-bold" />
                , όπου ο αριθμητής <strong>α</strong> είναι ακέραιος αριθμός (α ∈ ℤ) και ο παρονομαστής <strong>β</strong> είναι ακέραιος διάφορος του μηδενός (β ∈ ℤ*).
              </p>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 font-black text-center text-lg sm:text-xl font-mono shadow-sm flex items-center justify-center gap-2">
                <span>ℚ ＝ {'{'}</span>
                <Frac num="α" den="β" />
                <span>| α ∈ ℤ και β ∈ ℤ* {'}'}</span>
              </div>
              <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-slate-600">
                <li>
                  <strong>Όλοι οι ακέραιοι είναι και ρητοί:</strong> π.χ.{' '}
                  5 ＝ <Frac num="5" den="1" />, －4 ＝ <Frac num="-4" den="1" />, 0 ＝ <Frac num="0" den="1" />.
                </li>
                <li>
                  <strong>Όλοι οι δεκαδικοί είναι ρητοί:</strong> π.χ.{' '}
                  0,75 ＝ <Frac num="75" den="100" /> ＝ <Frac num="3" den="4" />.
                </li>
                <li>
                  <strong>Θέση προσήμου:</strong> Το πλην τοποθετείται συνήθως μπροστά από την κλασματική γραμμή:{' '}
                  <Frac num="-α" den="β" /> ＝ <Frac num="α" den="-β" />.
                </li>
              </ul>
            </div>

            {/* Σχηματική Επισκόπηση */}
            <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                ΚΑΤΗΓΟΡΙΕΣ ΡΗΤΩΝ ΑΡΙΘΜΩΝ
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-mono">
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                  <div className="text-indigo-900 font-sans font-bold text-xs">Θετικοί Ρητοί</div>
                  <div className="flex items-center flex-wrap gap-1">
                    <Frac num="3" den="4" />, ＋2,5, ＋7
                  </div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                  <div className="text-rose-900 font-sans font-bold text-xs">Αρνητικοί Ρητοί</div>
                  <div className="flex items-center flex-wrap gap-1">
                    <Frac num="-5" den="2" />, －1,4, －9
                  </div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                  <div className="text-slate-900 font-sans font-bold text-xs">Ακέραιοι Αριθμοί</div>
                  <div>... －2, －1, 0, 1, 2 ...</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                  <div className="text-sky-900 font-sans font-bold text-xs">Περιοδικοί Δεκαδικοί</div>
                  <div className="flex items-center flex-wrap gap-1">
                    <Frac num="1" den="3" /> ＝ 0,333...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΜΕΤΑΤΡΟΠΗ ΚΛΑΣΜΑΤΟΣ ΣΕ ΔΕΚΑΔΙΚΟ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                2
              </span>
              Μετατροπή Κλάσματος σε Δεκαδική Μορφή
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="space-y-3">
              <p>
                Για να μετατρέψουμε ένα κλάσμα <Frac num="α" den="β" /> σε δεκαδικό αριθμό, <strong>διαιρούμε τον αριθμητή α με τον παρονομαστή β</strong> (α ： β).
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="text-xs font-bold uppercase text-indigo-700 tracking-wider">
                  ΔΥΟ ΠΙΘΑΝΑ ΑΠΟΤΕΛΕΣΜΑΤΑ
                </div>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between flex-wrap gap-2">
                    <div><strong>1. Πεπερασμένος Δεκαδικός:</strong> (υπόλοιπο 0)</div>
                    <div className="font-mono text-indigo-900 flex items-center">
                      <Frac num="3" den="4" /> ＝ 3 ： 4 ＝ 0,75
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between flex-wrap gap-2">
                    <div><strong>2. Περιοδικός Δεκαδικός:</strong> (επαναλαμβανόμενα ψηφία)</div>
                    <div className="font-mono text-indigo-900 flex items-center">
                      <Frac num="1" den="3" /> ＝ 1 ： 3 ＝ 0,333...
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Κανόνας Παρονομαστή */}
            <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-3 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-1">
                  ΧΡΗΣΙΜΟ ΜΥΣΤΙΚΟ
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Πότε ένα ανάγωγο κλάσμα δίνει πεπερασμένο δεκαδικό;
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Αν απλοποιήσουμε το κλάσμα ώστε να είναι ανάγωγο, δίνει πεπερασμένο δεκαδικό <strong>μόνο αν ο παρονομαστής περιέχει ως πρώτους παράγοντες μόνο το 2 ή/και το 5</strong>.
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-indigo-100 font-mono text-xs sm:text-sm text-indigo-950 space-y-1">
                <div className="flex items-center flex-wrap">
                  • <Frac num="7" den="20" /> → 20 ＝ 2² · 5 → Πεπερασμένος (0,35)
                </div>
                <div className="flex items-center flex-wrap">
                  • <Frac num="5" den="6" /> → 6 ＝ 2 · 3 → Περιοδικός (0,8333...)
                </div>
              </div>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 1: ΔΙΑΔΡΑΣΤΙΚΟ ΚΛΑΣΜΑ -> ΔΕΚΑΔΙΚΟΣ */}
          <div className="pt-4 border-t border-slate-100 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              🛠️ Εργαστήριο 1: Διαδραστική Μετατροπή Κλάσματος σε Δεκαδικό
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              {/* Steppers */}
              <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    Αριθμητής (α)
                  </label>
                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStepNum(-1, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-indigo-900 font-black text-lg font-mono">
                      α ＝ {numA > 0 ? `＋${numA}` : numA}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStepNum(1, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    Παρονομαστής (β ≠ 0)
                  </label>
                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleStepDen(-1, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-sky-900 font-black text-lg font-mono">
                      β ＝ {denB}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStepDen(1, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                    >
                      ＋
                    </button>
                  </div>
                </div>
              </div>

              {/* Κάρτα Αποτελέσματος - Το πλην ΜΠΡΟΣΤΑ από την κλασματική γραμμή */}
              <div className="lg:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white space-y-4 shadow-md font-mono">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    ΚΛΑΣΜΑΤΙΚΗ ΚΑΙ ΔΕΚΑΔΙΚΗ ΜΟΡΦΗ
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border font-sans ${
                    fracAnalysis.isInt
                      ? 'bg-purple-500/20 text-purple-300 border-purple-400/30'
                      : fracAnalysis.isTerminating
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                  }`}>
                    {fracAnalysis.isInt ? 'ΑΚΕΡΑΙΟΣ' : fracAnalysis.isTerminating ? 'ΠΕΠΕΡΑΣΜΕΝΟΣ' : 'ΠΕΡΙΟΔΙΚΟΣ'}
                  </span>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 text-2xl sm:text-4xl font-black flex-wrap">
                  {/* Αρχικό κλάσμα με το πλην μπροστά από τη γραμμή */}
                  <Frac num={numA} den={denB} className="text-white" />

                  {fracAnalysis.gcdVal > 1 && (
                    <>
                      <span className="text-indigo-300">＝</span>
                      {/* Απλοποιημένο κλάσμα με το πλην μπροστά από τη γραμμή */}
                      <Frac num={fracAnalysis.simpNum} den={fracAnalysis.simpDen} className="text-slate-300 text-xl sm:text-3xl" />
                    </>
                  )}

                  <span className="text-indigo-300">＝</span>
                  <span className="text-emerald-400">{fracAnalysis.displayDec}</span>
                </div>

                <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm text-indigo-100 font-sans">
                  Εκτελέσαμε τη διαίρεση {Math.abs(numA)} ： {denB}.
                  {numA < 0 && ' Το αρνητικό πρόσημο τοποθετείται μπροστά από την κλασματική γραμμή.'}
                  {fracAnalysis.gcdVal > 1 && ` Το κλάσμα απλοποιήθηκε με τον ΜΚΔ (${fracAnalysis.gcdVal}) σε ανάγωγο.`}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ΜΕΤΑΤΡΟΠΗ ΔΕΚΑΔΙΚΟΥ ΣΕ ΚΛΑΣΜΑ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                3
              </span>
              Μετατροπή Δεκαδικού σε Κλασματική Μορφή
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="space-y-3">
              <p>
                Για να μετατρέψουμε έναν πεπερασμένο δεκαδικό αριθμό σε κλάσμα:
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs sm:text-sm">
                <div>
                  <strong>1. Αριθμητής:</strong> Γράφουμε όλον τον αριθμό <strong>χωρίς την υποδιαστολή</strong>.
                </div>
                <div>
                  <strong>2. Παρονομαστής:</strong> Γράφουμε το <strong>1</strong> ακολουθούμενο από <strong>τόσα μηδενικά όσα είναι τα δεκαδικά ψηφία</strong> (10, 100, 1.000...).
                </div>
                <div>
                  <strong>3. Πρόσημο:</strong> Το πρόσημο μείον τοποθετείται <strong>μπροστά από την κλασματική γραμμή</strong>.
                </div>
                <div>
                  <strong>4. Απλοποίηση:</strong> Διαιρούμε αριθμητή και παρονομαστή με τον <strong>ΜΚΔ</strong> τους για ανάγωγο κλάσμα.
                </div>
              </div>
            </div>

            {/* Παράδειγμα Ανάλυσης */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 font-mono text-xs sm:text-sm">
              <div className="text-xs font-bold uppercase text-slate-500 font-sans">
                ΠΑΡΑΔΕΙΓΜΑ ΑΝΑΛΥΣΗΣ
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                <div>Δεκαδικός: <strong>－0,85</strong> (2 δεκαδικά ψηφία)</div>
                <div className="flex items-center flex-wrap gap-1">
                  Δεκαδικό κλάσμα: <Frac num="-85" den="100" />
                </div>
                <div className="flex items-center flex-wrap gap-1">
                  Απλοποίηση με το 5: <Frac num="-17" den="20" /> (ανάγωγο)
                </div>
              </div>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 2: ΔΙΑΔΡΑΣΤΙΚΟΣ ΜΕΤΑΤΡΟΠΕΑΣ ΔΕΚΑΔΙΚΟΥ ΣΕ ΚΛΑΣΜΑ */}
          <div className="pt-4 border-t border-slate-100 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              🛠️ Εργαστήριο 2: Πληκτρολόγηση Δεκαδικού & Μετατροπή σε Ανάγωγο Κλάσμα
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              {/* Input */}
              <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-600 uppercase">
                  Πληκτρολόγησε Δεκαδικό Αριθμό
                </label>
                <input
                  type="text"
                  value={decInput}
                  onChange={handleDecChange}
                  placeholder="π.χ. -0,75 ή 2,4"
                  className="w-full h-11 px-4 text-lg font-mono font-black text-center bg-white border border-slate-300 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                />
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {['-1,5', '-0,25', '0,4', '0,125', '2,8', '-0,6'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setDecInput(preset)}
                      className="py-1 px-2 rounded-lg bg-white border border-slate-200 text-xs font-mono font-bold text-slate-700 hover:bg-indigo-50 transition"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ανάλυση σε Κλάσμα - Το πλην ΜΠΡΟΣΤΑ από την κλασματική γραμμή */}
              <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 text-white space-y-4 font-mono shadow-md">
                <div className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                  ΑΠΟΤΕΛΕΣΜΑ ΜΕΤΑΤΡΟΠΗΣ & ΑΠΛΟΠΟΙΗΣΗΣ
                </div>

                {decAnalysis.isValid ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 sm:gap-4 text-2xl sm:text-4xl font-black flex-wrap">
                      <span>{decInput}</span>
                      <span className="text-indigo-400">＝</span>

                      {/* Δεκαδικό κλάσμα με πλην μπροστά */}
                      <Frac num={decAnalysis.rawNum} den={decAnalysis.rawDen} className="text-slate-300 text-xl sm:text-3xl" />

                      {decAnalysis.gcdVal > 1 && (
                        <>
                          <span className="text-indigo-400">＝</span>
                          {/* Ανάγωγο κλάσμα με πλην μπροστά */}
                          <Frac num={decAnalysis.redNum} den={decAnalysis.redDen} className="text-emerald-400 text-2xl sm:text-4xl" />
                        </>
                      )}
                    </div>

                    <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans text-slate-200">
                      Ο αριθμός έχει {decAnalysis.decimals} δεκαδικά ψηφία, άρα γράφτηκε με παρονομαστή το {decAnalysis.rawDen}.
                      {decAnalysis.rawNum < 0 && ' Το πλην τοποθετείται μπροστά από την κλασματική γραμμή.'}
                      {decAnalysis.gcdVal > 1 ? ` Απλοποιήθηκε δια του ΜΚΔ (${decAnalysis.gcdVal}) και έγινε ανάγωγο κλάσμα.` : ' Το κλάσμα ήταν ήδη ανάγωγο.'}
                    </div>
                  </div>
                ) : (
                  <div className="text-rose-400 text-sm font-sans">
                    ⚠️ Παρακαλώ πληκτρολόγησε έναν έγκυρο δεκαδικό αριθμό (π.χ. -0,75 ή 3,2).
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
