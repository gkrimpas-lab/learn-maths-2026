import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

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

const lcm = (a, b) => {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
};

// Επαναχρησιμοποιήσιμο component για κλασματική γραφή με πρόσημο μπροστά
function Frac({ num, den, isNeg = false, className = '' }) {
  const numericNeg =
    (typeof num === 'number' && num < 0) ||
    (typeof den === 'number' && den < 0);
  const showMinus = isNeg || numericNeg;

  const displayNum = typeof num === 'number' ? Math.abs(num) : num.toString().replace(/^-/, '');
  const displayDen = typeof den === 'number' ? Math.abs(den) : den.toString().replace(/^-/, '');

  return (
    <span className={`inline-flex items-center gap-1 align-middle mx-1 font-mono ${className}`}>
      {showMinus && <span className="font-bold">－</span>}
      <span className="inline-flex flex-col items-center justify-center leading-none text-center">
        <span className="pb-0.5 px-1 border-b-2 w-full text-center" style={{ borderColor: 'currentColor' }}>
          {displayNum}
        </span>
        <span className="pt-0.5 px-1 w-full text-center">
          {displayDen}
        </span>
      </span>
    </span>
  );
}

export default function AfairesiKlasmataTheoria() {
  // State για Εργαστήριο 1: Αφαίρεση Κλασμάτων
  const [f1Num, setF1Num] = useState(3);
  const [f1Den, setF1Den] = useState(4);
  const [f2Num, setF2Num] = useState(-5);
  const [f2Den, setF2Den] = useState(6);

  // State για Εργαστήριο 2: Αφαίρεση Δεκαδικών
  const [dec1, setDec1] = useState(2.4);
  const [dec2, setDec2] = useState(-3.7);

  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  // Υπολογισμοί Εργαστηρίου 1 (Αφαίρεση Κλασμάτων)
  // Πράξη: (f1Num / f1Den) - (f2Num / f2Den) = (f1Num / f1Den) + (-f2Num / f2Den)
  const oppF2Num = useMemo(() => -f2Num, [f2Num]);
  const isHomonymous = f1Den === f2Den;
  const commonDen = useMemo(() => lcm(f1Den, f2Den), [f1Den, f2Den]);
  const mult1 = useMemo(() => commonDen / f1Den, [commonDen, f1Den]);
  const mult2 = useMemo(() => commonDen / f2Den, [commonDen, f2Den]);

  const expandedNum1 = useMemo(() => f1Num * mult1, [f1Num, mult1]);
  const expandedNum2 = useMemo(() => f2Num * mult2, [f2Num, mult2]);
  const expandedOppNum2 = useMemo(() => oppF2Num * mult2, [oppF2Num, mult2]);

  const diffNumerator = useMemo(() => expandedNum1 + expandedOppNum2, [expandedNum1, expandedOppNum2]);
  const diffGcd = useMemo(() => gcd(diffNumerator, commonDen), [diffNumerator, commonDen]);

  const reducedNum = useMemo(() => diffNumerator / diffGcd, [diffNumerator, diffGcd]);
  const reducedDen = useMemo(() => commonDen / diffGcd, [commonDen, diffGcd]);
  const isZeroResult = diffNumerator === 0;

  // Υπολογισμοί Εργαστηρίου 2 (Αφαίρεση Δεκαδικών)
  const oppDec2 = useMemo(() => Number((-dec2).toFixed(1)), [dec2]);
  const decDiff = useMemo(() => Number((dec1 - dec2).toFixed(2)), [dec1, dec2]);

  return (
    <Layout
      title="Αφαίρεση Ρητών Αριθμών | Α' Γυμνασίου"
      description="Έννοια της αφαίρεσης ρητών αριθμών (κλάσματα και δεκαδικοί), σύνδεση με τον αντίθετο αριθμό και διαδραστικά εργαστήρια."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/17-afairesi-klasmata-ask"
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
              Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 15 • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Αφαίρεση Ρητών Αριθμών
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              Κατανοούμε πώς η αφαίρεση ρητών αριθμών ανάγεται στην πρόσθεση του αντιθέτου, μαθαίνουμε τους κανόνες απλοποίησης των προσήμων και εκτελούμε πράξεις με κλάσματα και δεκαδικούς.
            </p>
          </div>
        </section>

        {/* 1. ΟΡΙΣΜΟΣ ΑΦΑΙΡΕΣΗΣ & ΑΝΤΙΘΕΤΟΣ ΑΡΙΘΜΟΣ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                1
              </span>
              Ορισμός της Αφαίρεσης: Πρόσθεση με τον Αντίθετο
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="space-y-4">
              <p>
                Στους ρητούς αριθμούς, η αφαίρεση <strong>α － β</strong> ορίζεται πάντοτε ως η πρόσθεση του μειωτέου <strong>α</strong> με τον <strong>αντίθετο</strong> του αφαιρετέου <strong>β</strong>:
              </p>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 font-black text-center text-lg sm:text-2xl font-mono shadow-sm">
                α － β ＝ α ＋ (－β)
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                Αυτό σημαίνει ότι μετατρέπουμε το σύμβολο της αφαίρεσης σε <strong>πρόσθεση</strong> και ταυτόχρονα <strong>αλλάζουμε το πρόσημο</strong> του δεύτερου αριθμού.
              </p>
            </div>

            {/* Απλοποίηση Προσήμων & Παρένθεση */}
            <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                ΚΑΝΟΝΕΣ ΠΡΟΣΗΜΩΝ ΓΙΑ ΤΗΝ ΑΦΑΙΡΕΣΗ
              </div>
              <div className="space-y-2 text-xs sm:text-sm font-mono">
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <span>－ (＋x) ＝ <strong>－x</strong></span>
                  <span className="text-slate-500 font-sans text-xs">5 － (＋3) ＝ 5 － 3 ＝ 2</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <span>－ (－x) ＝ <strong>＋x</strong></span>
                  <span className="text-slate-500 font-sans text-xs">5 － (－3) ＝ 5 ＋ 3 ＝ 8</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <span>＋ (－x) ＝ <strong>－x</strong></span>
                  <span className="text-slate-500 font-sans text-xs">4 ＋ (－7) ＝ 4 － 7 ＝ －3</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΑΦΑΙΡΕΣΗ ΚΛΑΣΜΑΤΩΝ & ΕΡΓΑΣΤΗΡΙΟ 1 */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                2
              </span>
              Αφαίρεση Κλασμάτων (Ομώνυμα & Ετερώνυμα)
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            {/* Ομώνυμα */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold uppercase text-indigo-700 tracking-wider">
                1. ΟΜΩΝΥΜΑ ΚΛΑΣΜΑΤΑ
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                Διατηρούμε τον κοινό παρονομαστή και αφαιρούμε τους αριθμητές:
              </p>
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-center font-mono font-bold text-indigo-950 flex items-center justify-center gap-2">
                <Frac num="α" den="γ" />
                <span>－</span>
                <Frac num="β" den="γ" />
                <span>＝</span>
                <Frac num="α － β" den="γ" />
              </div>
            </div>

            {/* Ετερώνυμα */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold uppercase text-sky-700 tracking-wider">
                2. ΕΤΕΡΩΝΥΜΑ ΚΛΑΣΜΑΤΑ
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                Βρίσκουμε το <strong>ΕΚΠ των παρονομαστών</strong>, πολλαπλασιάζουμε τους όρους κάθε κλάσματος για να γίνουν ομώνυμα και κατόπιν εκτελούμε την αφαίρεση.
              </p>
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-center font-mono text-xs sm:text-sm text-sky-950 flex items-center justify-center gap-1.5 flex-wrap">
                <Frac num="3" den="4" />
                <span>－</span>
                <Frac num="1" den="6" />
                <span>＝</span>
                <Frac num="9" den="12" />
                <span>－</span>
                <Frac num="2" den="12" />
                <span>＝</span>
                <Frac num="7" den="12" />
              </div>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 1: ΔΙΑΔΡΑΣΤΙΚΗ ΑΦΑΙΡΕΣΗ ΚΛΑΣΜΑΤΩΝ */}
          <div className="pt-4 border-t border-slate-100 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              🛠️ Εργαστήριο 1: Διαδραστική Αφαίρεση Κλασμάτων Βήμα-Βήμα
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Steppers Ελέγχου (5 cols) */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                {/* 1ο Κλάσμα */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-indigo-900 uppercase">1Ο ΚΛΑΣΜΑ (ΜΕΙΩΤΕΟΣ)</div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">ΑΡΙΘΜΗΤΗΣ (α)</label>
                    <div className="grid grid-cols-[36px_1fr_36px] items-center h-10 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF1Num, -1, -20, 20, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 font-bold text-sm font-mono text-indigo-950">
                        {f1Num > 0 ? `＋${f1Num}` : f1Num}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF1Num, 1, -20, 20, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                      >
                        ＋
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">ΠΑΡΟΝΟΜΑΣΤΗΣ (β)</label>
                    <div className="grid grid-cols-[36px_1fr_36px] items-center h-10 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF1Den, -1, 1, 15, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 font-bold text-sm font-mono text-indigo-950">
                        {f1Den}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF1Den, 1, 1, 15, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                      >
                        ＋
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2ο Κλάσμα */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-sky-900 uppercase">2Ο ΚΛΑΣΜΑ (ΑΦΑΙΡΕΤΕΟΣ)</div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">ΑΡΙΘΜΗΤΗΣ (γ)</label>
                    <div className="grid grid-cols-[36px_1fr_36px] items-center h-10 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF2Num, -1, -20, 20, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 font-bold text-sm font-mono text-sky-950">
                        {f2Num > 0 ? `＋${f2Num}` : f2Num}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF2Num, 1, -20, 20, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                      >
                        ＋
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">ΠΑΡΟΝΟΜΑΣΤΗΣ (δ)</label>
                    <div className="grid grid-cols-[36px_1fr_36px] items-center h-10 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF2Den, -1, 1, 15, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 font-bold text-sm font-mono text-sky-950">
                        {f2Den}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF2Den, 1, 1, 15, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                      >
                        ＋
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ανάλυση Βήμα-Βήμα (7 cols) */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white space-y-4 shadow-md font-mono">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    ΑΝΑΛΥΣΗ ΑΦΑΙΡΕΣΗΣ
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 font-sans">
                    {isHomonymous ? 'ΟΜΩΝΥΜΑ' : `ΕΤΕΡΩΝΥΜΑ • ΕΚΠ ＝ ${commonDen}`}
                  </span>
                </div>

                {/* Αρχική Πράξη */}
                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 flex items-center justify-between flex-wrap gap-2 text-base sm:text-xl">
                  <span className="text-xs text-slate-300 font-sans">Αρχική Αφαίρεση:</span>
                  <div className="flex items-center gap-1.5">
                    <span>(</span><Frac num={f1Num} den={f1Den} className="text-white" /><span>)</span>
                    <span className="text-rose-400 font-bold">－</span>
                    <span>(</span><Frac num={f2Num} den={f2Den} className="text-white" /><span>)</span>
                  </div>
                </div>

                {/* Βήμα 1: Μετατροπή σε πρόσθεση αντιθέτου */}
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1.5 text-xs sm:text-sm font-sans">
                  <div className="text-slate-300 font-bold">
                    Βήμα 1: Μετατροπή σε πρόσθεση με τον αντίθετο του αφαιρετέου:
                  </div>
                  <div className="font-mono text-sm sm:text-base flex items-center gap-2 pt-1 flex-wrap">
                    <span>＝</span>
                    <span>(</span><Frac num={f1Num} den={f1Den} className="text-indigo-200" /><span>)</span>
                    <span className="text-amber-400">＋</span>
                    <span>(</span><Frac num={oppF2Num} den={f2Den} className="text-sky-200" /><span>)</span>
                  </div>
                </div>

                {/* Βήμα 2: Ομώνυμα αν είναι ετερώνυμα */}
                {!isHomonymous && (
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1.5 text-xs sm:text-sm font-sans">
                    <div className="text-slate-300 font-bold">
                      Βήμα 2: Μετατροπή σε ομώνυμα (κοινός παρονομαστής {commonDen}):
                    </div>
                    <div className="font-mono text-sm sm:text-base flex items-center gap-2 pt-1 flex-wrap">
                      <span>＝</span>
                      <span>(</span><Frac num={expandedNum1} den={commonDen} className="text-indigo-200" /><span>)</span>
                      <span className="text-amber-400">＋</span>
                      <span>(</span><Frac num={expandedOppNum2} den={commonDen} className="text-sky-200" /><span>)</span>
                    </div>
                  </div>
                )}

                {/* Βήμα 3: Πράξη αριθμητών */}
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1.5 text-xs sm:text-sm font-sans">
                  <div className="text-slate-300 font-bold">
                    {isHomonymous ? 'Βήμα 2' : 'Βήμα 3'}: Υπολογισμός ενιαίου αριθμητή:
                  </div>
                  <div className="font-mono text-sm sm:text-base flex items-center gap-2 pt-1 flex-wrap">
                    <span>＝</span>
                    <span className="inline-flex items-center gap-1 align-middle mx-1 font-mono">
                      <span className="inline-flex flex-col items-center justify-center leading-none text-center">
                        <span className="pb-0.5 px-1 border-b-2 w-full text-center border-white">
                          ({expandedNum1 > 0 ? `＋${expandedNum1}` : expandedNum1}) ＋ ({expandedOppNum2 > 0 ? `＋${expandedOppNum2}` : expandedOppNum2})
                        </span>
                        <span className="pt-0.5 px-1 w-full text-center text-slate-300">
                          {commonDen}
                        </span>
                      </span>
                    </span>
                    <span>＝</span>
                    <Frac num={diffNumerator} den={commonDen} className="text-amber-300" />
                  </div>
                </div>

                {/* Τελικό Αποτέλεσμα */}
                <div className="p-4 bg-emerald-500/20 rounded-xl border border-emerald-400/30 flex items-center justify-between flex-wrap gap-3">
                  <span className="text-xs sm:text-sm text-emerald-200 font-sans font-bold">
                    ΤΕΛΙΚΟ ΑΝΑΓΩΓΟ ΑΠΟΤΕΛΕΣΜΑ:
                  </span>
                  <div className="text-xl sm:text-3xl font-black text-emerald-400 flex items-center gap-2">
                    {isZeroResult ? (
                      <span>0</span>
                    ) : (
                      <>
                        <Frac num={reducedNum} den={reducedDen} className="text-emerald-400 text-xl sm:text-3xl" />
                        {diffGcd > 1 && (
                          <span className="text-xs text-emerald-300 font-sans font-normal">
                            (μετά από διαίρεση με το {diffGcd})
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ΑΦΑΙΡΕΣΗ ΔΕΚΑΔΙΚΩΝ ΑΡΙΘΜΩΝ & ΕΡΓΑΣΤΗΡΙΟ 2 */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                3
              </span>
              Αφαίρεση Δεκαδικών Αριθμών
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="space-y-3">
              <p>
                Όπως και στα κλάσματα, στην αφαίρεση δεκαδικών αριθμών <strong>προσθέτουμε στον μειωτέο τον αντίθετο του αφαιρετέου</strong>:
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs sm:text-sm">
                <div>
                  <strong>1. Αλλαγή σε πρόσθεση:</strong> (＋3,5) － (＋1,2) ＝ (＋3,5) ＋ (－1,2) ＝ ＋2,3
                </div>
                <div>
                  <strong>2. Αφαίρεση αρνητικού:</strong> (＋4,2) － (－1,8) ＝ (＋4,2) ＋ (＋1,8) ＝ ＋6,0
                </div>
                <div>
                  <strong>3. Στοίχιση υποδιαστολών:</strong> Τοποθετούμε τις υποδιαστολές στη ίδια κατακόρυφη ευθεία.
                </div>
              </div>
            </div>

            {/* Παράδειγμα Δεκαδικών */}
            <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-2 font-mono text-xs sm:text-sm">
              <div className="text-xs font-bold uppercase text-indigo-800 font-sans">
                ΠΑΡΑΔΕΙΓΜΑΤΑ ΥΠΟΛΟΓΙΣΜΟΥ
              </div>
              <div className="p-3 bg-white rounded-xl border border-indigo-100 space-y-1.5">
                <div>(－4,5) － (＋2,1) ＝ (－4,5) ＋ (－2,1) ＝ <strong>－6,6</strong></div>
                <div>(－2,8) － (－5,4) ＝ (－2,8) ＋ (＋5,4) ＝ <strong>＋2,6</strong></div>
                <div>(＋1,3) － (＋7,9) ＝ (＋1,3) ＋ (－7,9) ＝ <strong>－6,6</strong></div>
              </div>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 2: ΔΙΑΔΡΑΣΤΙΚΗ ΑΦΑΙΡΕΣΗ ΔΕΚΑΔΙΚΩΝ */}
          <div className="pt-4 border-t border-slate-100 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              🛠️ Εργαστήριο 2: Διαδραστικός Υπολογιστής Αφαίρεσης Δεκαδικών
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Χειριστήρια Steppers: Ακέραιο (±1) και Δεκαδικό (±0.1) */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                {/* 1ος Δεκαδικός (Μειωτέος) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-600 uppercase">1ΟΣ (ΜΕΙΩΤΕΟΣ)</label>
                    <span className="text-base font-black font-mono text-indigo-950 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                      {dec1 > 0 ? `＋${dec1.toFixed(1).replace('.', ',')}` : dec1.toFixed(1).replace('.', ',')}
                    </span>
                  </div>

                  {/* Ακέραιο Μέρος (±1) */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">ΑΚΕΡΑΙΟ (±1)</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec1((prev) => Math.max(-20, Number((prev - 1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800"
                      >
                        －1
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec1((prev) => Math.min(20, Number((prev + 1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800"
                      >
                        ＋1
                      </button>
                    </div>
                  </div>

                  {/* Δεκαδικό Μέρος (±0.1) */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">ΔΕΚΑΔΙΚΟ (±0,1)</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec1((prev) => Math.max(-20, Number((prev - 0.1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800"
                      >
                        －0,1
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec1((prev) => Math.min(20, Number((prev + 0.1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800"
                      >
                        ＋0,1
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2ος Δεκαδικός (Αφαιρετέος) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-600 uppercase">2ΟΣ (ΑΦΑΙΡΕΤΕΟΣ)</label>
                    <span className="text-base font-black font-mono text-sky-950 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                      {dec2 > 0 ? `＋${dec2.toFixed(1).replace('.', ',')}` : dec2.toFixed(1).replace('.', ',')}
                    </span>
                  </div>

                  {/* Ακέραιο Μέρος (±1) */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">ΑΚΕΡΑΙΟ (±1)</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec2((prev) => Math.max(-20, Number((prev - 1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800"
                      >
                        －1
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec2((prev) => Math.min(20, Number((prev + 1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800"
                      >
                        ＋1
                      </button>
                    </div>
                  </div>

                  {/* Δεκαδικό Μέρος (±0.1) */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">ΔΕΚΑΔΙΚΟ (±0,1)</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec2((prev) => Math.max(-20, Number((prev - 0.1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800"
                      >
                        －0,1
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec2((prev) => Math.min(20, Number((prev + 0.1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800"
                      >
                        ＋0,1
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Κάρτα Αποτελέσματος Δεκαδικών (7 cols) */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    ΑΠΟΤΕΛΕΣΜΑ ΑΦΑΙΡΕΣΗΣ ΔΕΚΑΔΙΚΩΝ
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 font-sans">
                    ΜΕΤΑΤΡΟΠΗ ΣΕ ΠΡΟΣΘΕΣΗ
                  </span>
                </div>

                {/* Αρχική και Μετασχηματισμένη Πράξη */}
                <div className="space-y-2 py-1">
                  <div className="flex items-center justify-center gap-2 text-xl sm:text-2xl font-black flex-wrap">
                    <span>({dec1 > 0 ? `＋${dec1.toFixed(1).replace('.', ',')}` : dec1.toFixed(1).replace('.', ',')})</span>
                    <span className="text-rose-400 font-sans">－</span>
                    <span>({dec2 > 0 ? `＋${dec2.toFixed(1).replace('.', ',')}` : dec2.toFixed(1).replace('.', ',')})</span>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xl sm:text-3xl font-black text-amber-300 flex-wrap">
                    <span className="text-slate-400 font-sans">＝</span>
                    <span>({dec1 > 0 ? `＋${dec1.toFixed(1).replace('.', ',')}` : dec1.toFixed(1).replace('.', ',')})</span>
                    <span className="text-amber-400 font-sans">＋</span>
                    <span>({oppDec2 > 0 ? `＋${oppDec2.toFixed(1).replace('.', ',')}` : oppDec2.toFixed(1).replace('.', ',')})</span>
                    <span className="text-indigo-400 font-sans">＝</span>
                    <span className="text-emerald-400">
                      {decDiff > 0 ? `＋${decDiff.toFixed(1).replace('.', ',')}` : decDiff.toFixed(1).replace('.', ',')}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans text-slate-200 leading-relaxed">
                  Αντικαταστήσαμε την αφαίρεση του <strong>({dec2 > 0 ? `＋${dec2.toFixed(1).replace('.', ',')}` : dec2.toFixed(1).replace('.', ',')})</strong> με πρόσθεση του αντιθέτου του <strong>({oppDec2 > 0 ? `＋${oppDec2.toFixed(1).replace('.', ',')}` : oppDec2.toFixed(1).replace('.', ',')})</strong> και εφαρμόσαμε τους κανόνες προσήμων της πρόσθεσης.
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
