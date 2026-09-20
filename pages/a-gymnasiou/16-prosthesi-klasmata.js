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

export default function ProsthesiKlasmataTheoria() {
  // State για Εργαστήριο 1: Πρόσθεση Κλασμάτων
  const [f1Num, setF1Num] = useState(-3);
  const [f1Den, setF1Den] = useState(4);
  const [f2Num, setF2Num] = useState(5);
  const [f2Den, setF2Den] = useState(6);

  // State για Εργαστήριο 2: Πρόσθεση Δεκαδικών
  const [dec1, setDec1] = useState(-2.4);
  const [dec2, setDec2] = useState(5.7);

  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  // Υπολογισμοί Εργαστηρίου 1 (Πρόσθεση Κλασμάτων)
  const isHomonymous = f1Den === f2Den;
  const commonDen = useMemo(() => lcm(f1Den, f2Den), [f1Den, f2Den]);
  const mult1 = useMemo(() => commonDen / f1Den, [commonDen, f1Den]);
  const mult2 = useMemo(() => commonDen / f2Den, [commonDen, f2Den]);

  const expandedNum1 = useMemo(() => f1Num * mult1, [f1Num, mult1]);
  const expandedNum2 = useMemo(() => f2Num * mult2, [f2Num, mult2]);

  const sumNumerator = useMemo(() => expandedNum1 + expandedNum2, [expandedNum1, expandedNum2]);
  const sumGcd = useMemo(() => gcd(sumNumerator, commonDen), [sumNumerator, commonDen]);

  const reducedNum = useMemo(() => sumNumerator / sumGcd, [sumNumerator, sumGcd]);
  const reducedDen = useMemo(() => commonDen / sumGcd, [commonDen, sumGcd]);

  const areOmmosite = (f1Num > 0 && f2Num > 0) || (f1Num < 0 && f2Num < 0);
  const isOpposite = f1Num * f2Den + f2Num * f1Den === 0;

  // Υπολογισμοί Εργαστηρίου 2 (Πρόσθεση Δεκαδικών)
  const decSum = useMemo(() => parseFloat((dec1 + dec2).toFixed(2)), [dec1, dec2]);
  const decOmmosite = (dec1 > 0 && dec2 > 0) || (dec1 < 0 && dec2 < 0);

  return (
    <Layout
      title="Πρόσθεση Ρητών Αριθμών | Α' Γυμνασίου"
      description="Πρόσθεση ρητών αριθμών (κλάσματα και δεκαδικοί), κανόνες ομόσημων και ετερόσημων και διαδραστικά εργαστήρια βήμα-βήμα."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/16-prosthesi-klasmata-ask"
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
              Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 14 • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Πρόσθεση Ρητών Αριθμών
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              Μαθαίνουμε πώς προσθέτουμε ρητούς αριθμούς σε κλασματική και δεκαδική μορφή, εφαρμόζοντας τους θεμελιώδεις κανόνες για ομόσημους και ετερόσημους αριθμούς και το ΕΚΠ των παρονομαστών.
            </p>
          </div>
        </section>

        {/* 1. ΟΙ ΚΑΝΟΝΕΣ ΤΩΝ ΠΡΟΣΗΜΩΝ ΣΤΗΝ ΠΡΟΣΘΕΣΗ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                1
              </span>
              Οι Κανόνες Προσήμων (Ομόσημοι & Ετερόσημοι Ρητοί)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            {/* Ομόσημοι Ρητοί */}
            <div className="p-6 rounded-2xl bg-indigo-50/80 border border-indigo-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-black text-indigo-700 tracking-wider">ΙΔΙΟ ΠΡΟΣΗΜΟ</span>
                  <span className="text-xl">➕➕ / ➖➖</span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg">Πρόσθεση Ομόσημων Ρητών</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Όταν προσθέτουμε δύο αριθμούς με το <strong>ίδιο πρόσημο</strong>:
                </p>
                <ul className="list-disc list-inside text-xs sm:text-sm text-slate-600 space-y-1">
                  <li><strong>Προσθέτουμε</strong> τις απόλυτες τιμές τους.</li>
                  <li>Βάζουμε στο αποτέλεσμα το <strong>κοινό τους πρόσημο</strong>.</li>
                </ul>
              </div>

              <div className="space-y-2 pt-2 border-t border-indigo-100 font-mono text-xs sm:text-sm text-indigo-950">
                <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-indigo-100">
                  <span>(＋0,4) ＋ (＋0,3)</span>
                  <span className="font-bold text-emerald-700">＝ ＋0,7</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-indigo-100">
                  <span className="flex items-center gap-1">
                    (<Frac num="-1" den="5" />) ＋ (<Frac num="-2" den="5" />)
                  </span>
                  <span className="font-bold text-rose-700 flex items-center">
                    ＝ <Frac num="-3" den="5" />
                  </span>
                </div>
              </div>
            </div>

            {/* Ετερόσημοι Ρητοί */}
            <div className="p-6 rounded-2xl bg-sky-50/80 border border-sky-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-black text-sky-700 tracking-wider">ΔΙΑΦΟΡΕΤΙΚΟ ΠΡΟΣΗΜΟ</span>
                  <span className="text-xl">➕➖</span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg">Πρόσθεση Ετερόσημων Ρητών</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Όταν προσθέτουμε δύο αριθμούς με <strong>διαφορετικό πρόσημο</strong>:
                </p>
                <ul className="list-disc list-inside text-xs sm:text-sm text-slate-600 space-y-1">
                  <li><strong>Αφαιρούμε</strong> τη μικρότερη απόλυτη τιμή από τη μεγαλύτερη.</li>
                  <li>Βάζουμε το πρόσημο του αριθμού με τη <strong>μεγαλύτερη απόλυτη τιμή</strong>.</li>
                </ul>
              </div>

              <div className="space-y-2 pt-2 border-t border-sky-100 font-mono text-xs sm:text-sm text-sky-950">
                <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-sky-100">
                  <span>(＋1,5) ＋ (－2,8)</span>
                  <span className="font-bold text-rose-700">＝ －1,3</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-sky-100">
                  <span className="flex items-center gap-1">
                    (＋<Frac num="5" den="7" />) ＋ (<Frac num="-2" den="7" />)
                  </span>
                  <span className="font-bold text-emerald-700 flex items-center">
                    ＝ ＋<Frac num="3" den="7" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs sm:text-sm text-amber-950 flex items-center justify-between flex-wrap gap-2">
            <span>
              <strong>Αντίθετοι Ρητοί:</strong> Δύο ρητοί αριθμοί με αντίθετα πρόσημα και ίδια απόλυτη τιμή έχουν άθροισμα <strong>0</strong>.
            </span>
            <span className="font-mono font-bold flex items-center">
              (<Frac num="3" den="4" />) ＋ (<Frac num="-3" den="4" />) ＝ 0
            </span>
          </div>
        </section>

        {/* 2. ΠΡΟΣΘΕΣΗ ΚΛΑΣΜΑΤΩΝ: ΟΜΩΝΥΜΑ ΚΑΙ ΕΤΕΡΩΝΥΜΑ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                2
              </span>
              Πρόσθεση Κλασμάτων (Ομώνυμα & Ετερώνυμα)
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            {/* Ομώνυμα Κλάσματα */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold uppercase text-indigo-700 tracking-wider">
                ΠΕΡΙΠΤΩΣΗ 1: ΟΜΩΝΥΜΑ ΚΛΑΣΜΑΤΑ
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                Όταν τα κλάσματα έχουν τον ίδιο παρονομαστή, <strong>διατηρούμε τον κοινό παρονομαστή</strong> και <strong>προσθέτουμε τους αριθμητές</strong> (προσέχοντας τα πρόσημά τους):
              </p>
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-center font-mono font-bold text-indigo-950 flex items-center justify-center gap-2">
                <Frac num="α" den="γ" />
                <span>＋</span>
                <Frac num="β" den="γ" />
                <span>＝</span>
                <Frac num="α ＋ β" den="γ" />
              </div>
            </div>

            {/* Ετερώνυμα Κλάσματα */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold uppercase text-sky-700 tracking-wider">
                ΠΕΡΙΠΤΩΣΗ 2: ΕΤΕΡΩΝΥΜΑ ΚΛΑΣΜΑΤΑ
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                Όταν έχουν διαφορετικούς παρονομαστές, ακολουθούμε τα εξής βήματα:
              </p>
              <ol className="list-decimal list-inside text-xs sm:text-sm text-slate-600 space-y-1">
                <li>Βρίσκουμε το <strong>ΕΚΠ των παρονομαστών</strong>.</li>
                <li>Με <strong>πολλαπλασιασμό των όρων</strong> κάνουμε τα κλάσματα ομώνυμα.</li>
                <li>Προσθέτουμε τους νέους αριθμητές και, αν χρειάζεται, απλοποιούμε με <strong>διαίρεση</strong> σε ανάγωγο κλάσμα.</li>
              </ol>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 1: ΔΙΑΔΡΑΣΤΙΚΗ ΠΡΟΣΘΕΣΗ ΚΛΑΣΜΑΤΩΝ ΒΗΜΑ-ΒΗΜΑ */}
          <div className="pt-4 border-t border-slate-100 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              🛠️ Εργαστήριο 1: Διαδραστική Πρόσθεση Κλασμάτων με Αναλυτικά Βήματα
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Steppers Ελέγχου (5 cols) */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                {/* 1ο Κλάσμα */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-indigo-900 uppercase">1Ο ΚΛΑΣΜΑ</div>
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
                  <div className="text-xs font-bold text-sky-900 uppercase">2Ο ΚΛΑΣΜΑ</div>
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

              {/* Ανάλυση Βήμα-Βήμα & Τελικό Αποτέλεσμα (7 cols) */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white space-y-4 shadow-md font-mono">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    ΑΝΑΛΥΣΗ ΠΡΟΣΘΕΣΗΣ
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 font-sans">
                    {isHomonymous ? 'ΟΜΩΝΥΜΑ' : `ΕΤΕΡΩΝΥΜΑ • ΕΚΠ ＝ ${commonDen}`}
                  </span>
                </div>

                {/* Αρχική Παράσταση */}
                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 flex items-center justify-between flex-wrap gap-2 text-base sm:text-xl">
                  <span className="text-xs text-slate-300 font-sans">Αρχική Πράξη:</span>
                  <div className="flex items-center gap-1.5">
                    <span>(</span><Frac num={f1Num} den={f1Den} className="text-white" /><span>)</span>
                    <span className="text-amber-400">＋</span>
                    <span>(</span><Frac num={f2Num} den={f2Den} className="text-white" /><span>)</span>
                  </div>
                </div>

                {/* Ενδιάμεση Μορφή με Ομώνυμα - με απόλυτη διατήρηση προσήμων μπροστά από τα κλάσματα */}
                {!isHomonymous && (
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1.5 text-xs sm:text-sm font-sans">
                    <div className="text-slate-300 font-bold">
                      Βήμα 1: Μετατροπή σε ομώνυμα με πολλαπλασιασμό των όρων (ΕΚΠ ＝ {commonDen}):
                    </div>
                    <div className="font-mono text-sm sm:text-base flex items-center gap-2 pt-1 flex-wrap">
                      <span>＝</span>
                      <span>(</span>
                      <Frac num={expandedNum1} den={commonDen} className="text-indigo-200" />
                      <span>)</span>
                      <span className="text-amber-400">＋</span>
                      <span>(</span>
                      <Frac num={expandedNum2} den={commonDen} className="text-sky-200" />
                      <span>)</span>
                    </div>
                  </div>
                )}

                {/* Πρόσθεση Αριθμητών με ξεκάθαρη εμφάνιση των προσήμων */}
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1.5 text-xs sm:text-sm font-sans">
                  <div className="text-slate-300 font-bold">
                    {isHomonymous ? 'Βήμα 1' : 'Βήμα 2'}: Πρόσθεση αριθμητών ({areOmmosite ? 'ομόσημοι' : 'ετερόσημοι'}):
                  </div>
                  <div className="font-mono text-sm sm:text-base flex items-center gap-2 pt-1 flex-wrap">
                    <span>＝</span>
                    {/* Ενιαίο κλάσμα με ρητή παράθεση των προσήμων στον αριθμητή */}
                    <span className="inline-flex items-center gap-1 align-middle mx-1 font-mono">
                      <span className="inline-flex flex-col items-center justify-center leading-none text-center">
                        <span className="pb-0.5 px-1 border-b-2 w-full text-center border-white">
                          ({expandedNum1 > 0 ? `＋${expandedNum1}` : expandedNum1}) ＋ ({expandedNum2 > 0 ? `＋${expandedNum2}` : expandedNum2})
                        </span>
                        <span className="pt-0.5 px-1 w-full text-center text-slate-300">
                          {commonDen}
                        </span>
                      </span>
                    </span>
                    <span>＝</span>
                    <Frac num={sumNumerator} den={commonDen} className="text-amber-300" />
                  </div>
                </div>

                {/* Τελικό Αποτέλεσμα / Απλοποίηση */}
                <div className="p-4 bg-emerald-500/20 rounded-xl border border-emerald-400/30 flex items-center justify-between flex-wrap gap-3">
                  <span className="text-xs sm:text-sm text-emerald-200 font-sans font-bold">
                    ΤΕΛΙΚΟ ΑΝΑΓΩΓΟ ΑΠΟΤΕΛΕΣΜΑ:
                  </span>
                  <div className="text-xl sm:text-3xl font-black text-emerald-400 flex items-center gap-2">
                    {isOpposite ? (
                      <span>0</span>
                    ) : (
                      <>
                        <Frac num={reducedNum} den={reducedDen} className="text-emerald-400 text-xl sm:text-3xl" />
                        {sumGcd > 1 && (
                          <span className="text-xs text-emerald-300 font-sans font-normal">
                            (μετά από διαίρεση με το {sumGcd})
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

        {/* 3. ΠΡΟΣΘΕΣΗ ΔΕΚΑΔΙΚΩΝ ΑΡΙΘΜΩΝ & ΕΡΓΑΣΤΗΡΙΟ 2 */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                3
              </span>
              Πρόσθεση Δεκαδικών Αριθμών
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="space-y-3">
              <p>
                Για να προσθέσουμε ρητούς αριθμούς σε <strong>δεκαδική μορφή</strong>:
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs sm:text-sm">
                <div>
                  <strong>1. Κανόνας προσήμων:</strong> Ελέγχουμε αν είναι <strong>ομόσημοι</strong> (προσθέτουμε τις απόλυτες τιμές και κρατάμε το κοινό πρόσημο) ή <strong>ετερόσημοι</strong> (αφαιρούμε τις απόλυτες τιμές και βάζουμε το πρόσημο του μεγαλύτερου κατά απόλυτη τιμή).
                </div>
                <div>
                  <strong>2. Στοίχιση υποδιαστολών:</strong> Στον κατακόρυφο υπολογισμό, οι υποδιαστολές τοποθετούνται <strong>ακριβώς η μία κάτω από την άλλη</strong>.
                </div>
              </div>
            </div>

            {/* Παράδειγμα Δεκαδικών */}
            <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-2 font-mono text-xs sm:text-sm">
              <div className="text-xs font-bold uppercase text-indigo-800 font-sans">
                ΠΑΡΑΔΕΙΓΜΑΤΑ ΥΠΟΛΟΓΙΣΜΟΥ
              </div>
              <div className="p-3 bg-white rounded-xl border border-indigo-100 space-y-1.5">
                <div>(－3,4) ＋ (－1,8) ＝ －(3,4 ＋ 1,8) ＝ <strong>－5,2</strong> (ομόσημοι)</div>
                <div>(＋4,5) ＋ (－2,1) ＝ ＋(4,5 － 2,1) ＝ <strong>＋2,4</strong> (ετερόσημοι)</div>
                <div>(－6,3) ＋ (＋2,8) ＝ －(6,3 － 2,8) ＝ <strong>－3,5</strong> (ετερόσημοι)</div>
              </div>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 2: ΔΙΑΔΡΑΣΤΙΚΗ ΠΡΟΣΘΕΣΗ ΔΕΚΑΔΙΚΩΝ */}
          <div className="pt-4 border-t border-slate-100 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              🛠️ Εργαστήριο 2: Διαδραστικός Υπολογιστής Πρόσθεσης Δεκαδικών
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Χειριστήρια Steppers (5 cols) */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                {/* 1ος Δεκαδικός */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase">1ΟΣ ΔΕΚΑΔΙΚΟΣ</label>
                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setDec1, -0.5, -20, 20, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 font-bold text-base font-mono text-indigo-950">
                      {dec1 > 0 ? `＋${dec1.toFixed(1).replace('.', ',')}` : dec1.toFixed(1).replace('.', ',')}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setDec1, 0.5, -20, 20, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                {/* 2ος Δεκαδικός */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase">2ΟΣ ΔΕΚΑΔΙΚΟΣ</label>
                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setDec2, -0.5, -20, 20, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 font-bold text-base font-mono text-sky-950">
                      {dec2 > 0 ? `＋${dec2.toFixed(1).replace('.', ',')}` : dec2.toFixed(1).replace('.', ',')}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setDec2, 0.5, -20, 20, e)}
                      className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                    >
                      ＋
                    </button>
                  </div>
                </div>
              </div>

              {/* Κάρτα Αποτελέσματος Δεκαδικών (7 cols) */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    ΑΠΟΤΕΛΕΣΜΑ ΠΡΟΣΘΕΣΗΣ ΔΕΚΑΔΙΚΩΝ
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 font-sans">
                    {decOmmosite ? 'ΟΜΟΣΗΜΟΙ ΑΡΙΘΜΟΙ' : 'ΕΤΕΡΟΣΗΜΟΙ ΑΡΙΘΜΟΙ'}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-3 text-2xl sm:text-4xl font-black py-2">
                  <span>({dec1 > 0 ? `＋${dec1.toFixed(1).replace('.', ',')}` : dec1.toFixed(1).replace('.', ',')})</span>
                  <span className="text-amber-400 font-sans">＋</span>
                  <span>({dec2 > 0 ? `＋${dec2.toFixed(1).replace('.', ',')}` : dec2.toFixed(1).replace('.', ',')})</span>
                  <span className="text-indigo-400 font-sans">＝</span>
                  <span className="text-emerald-400">
                    {decSum > 0 ? `＋${decSum.toFixed(1).replace('.', ',')}` : decSum.toFixed(1).replace('.', ',')}
                  </span>
                </div>

                <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans text-slate-200 leading-relaxed">
                  {decOmmosite ? (
                    <span>
                      Οι αριθμοί είναι <strong>ομόσημοι</strong>: Προσθέσαμε τις απόλυτες τιμές ({Math.abs(dec1).toFixed(1)} ＋ {Math.abs(dec2).toFixed(1)} ＝ {(Math.abs(dec1) + Math.abs(dec2)).toFixed(1).replace('.', ',')}) και κρατήσαμε το κοινό τους πρόσημο.
                    </span>
                  ) : (
                    <span>
                      Οι αριθμοί είναι <strong>ετερόσημοι</strong>: Αφαιρέσαμε τη μικρότερη απόλυτη τιμή από τη μεγαλύτερη (|{Math.abs(dec1).toFixed(1)} － {Math.abs(dec2).toFixed(1)}| ＝ {Math.abs(Math.abs(dec1) - Math.abs(dec2)).toFixed(1).replace('.', ',')}) και επικράτησε το πρόσημο του αριθμού με τη μεγαλύτερη απόλυτη τιμή.
                    </span>
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
