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

// Βοηθητικός υπολογισμός ΕΚΠ
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

export default function OmonimaEteronimaTheoria() {
  // State για Εργαστήριο 1: Μετατροπή Ετερώνυμων σε Ομώνυμα
  const [lab1Num1, setLab1Num1] = useState(2);
  const [lab1Den1, setLab1Den1] = useState(3);
  const [lab1Num2, setLab1Num2] = useState(3);
  const [lab1Den2, setLab1Den2] = useState(4);

  // State για Εργαστήριο 2: Σύγκριση & Διάταξη
  const [cmpNum1, setCmpNum1] = useState(-3);
  const [cmpDen1, setCmpDen1] = useState(5);
  const [cmpNum2, setCmpNum2] = useState(-2);
  const [cmpDen2, setCmpDen2] = useState(3);

  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  // Υπολογισμοί Εργαστηρίου 1 (Ετερώνυμα -> Ομώνυμα)
  const commonLcm = useMemo(() => lcm(lab1Den1, lab1Den2), [lab1Den1, lab1Den2]);
  const mult1 = useMemo(() => commonLcm / lab1Den1, [commonLcm, lab1Den1]);
  const mult2 = useMemo(() => commonLcm / lab1Den2, [commonLcm, lab1Den2]);
  const newNum1 = useMemo(() => lab1Num1 * mult1, [lab1Num1, mult1]);
  const newNum2 = useMemo(() => lab1Num2 * mult2, [lab1Num2, mult2]);

  // Υπολογισμοί Εργαστηρίου 2 (Σύγκριση & Διάταξη)
  const cmpVal1 = useMemo(() => cmpNum1 / cmpDen1, [cmpNum1, cmpDen1]);
  const cmpVal2 = useMemo(() => cmpNum2 / cmpDen2, [cmpNum2, cmpDen2]);

  const cmpLcm = useMemo(() => lcm(cmpDen1, cmpDen2), [cmpDen1, cmpDen2]);
  const cmpMult1 = useMemo(() => cmpLcm / cmpDen1, [cmpLcm, cmpDen1]);
  const cmpMult2 = useMemo(() => cmpLcm / cmpDen2, [cmpLcm, cmpDen2]);
  const cmpHomNum1 = useMemo(() => cmpNum1 * cmpMult1, [cmpNum1, cmpMult1]);
  const cmpHomNum2 = useMemo(() => cmpNum2 * cmpMult2, [cmpNum2, cmpMult2]);

  const cross1 = useMemo(() => cmpNum1 * cmpDen2, [cmpNum1, cmpDen2]);
  const cross2 = useMemo(() => cmpDen1 * cmpNum2, [cmpDen1, cmpNum2]);

  const comparisonSymbol = useMemo(() => {
    if (cmpVal1 > cmpVal2) return '＞';
    if (cmpVal1 < cmpVal2) return '＜';
    return '＝';
  }, [cmpVal1, cmpVal2]);

  return (
    <Layout
      title="Ομώνυμα και Ετερώνυμα Κλάσματα | Α' Γυμνασίου"
      description="Έννοιες ομώνυμων και ετερώνυμων κλασμάτων, μετατροπή με ΕΚΠ, απόλυτη τιμή, σύγκριση και διάταξη ρητών κλασμάτων."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/15-omonima-eteronima-klasmata-ask"
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
              Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 13 • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Ομώνυμα & Ετερώνυμα Κλάσματα: Μετατροπές, Σύγκριση & Διάταξη
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              Μαθαίνουμε να ξεχωρίζουμε τα ομώνυμα από τα ετερώνυμα κλάσματα, πώς να βρίσκουμε το ΕΚΠ των παρονομαστών για να τα κάνουμε ομώνυμα, καθώς και τους κανόνες σύγκρισης και διάταξης θετικών και αρνητικών ρητών.
            </p>
          </div>
        </section>

        {/* 1. ΟΜΩΝΥΜΑ ΚΑΙ ΕΤΕΡΩΝΥΜΑ ΚΛΑΣΜΑΤΑ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                1
              </span>
              Ορισμός Ομώνυμων & Ετερώνυμων Κλασμάτων
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            {/* Ομώνυμα */}
            <div className="p-6 rounded-2xl bg-indigo-50/80 border border-indigo-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-black text-indigo-700 tracking-wider">ΙΔΙΟΣ ΠΑΡΟΝΟΜΑΣΤΗΣ</span>
                  <span className="text-xl">⚖️</span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg">Ομώνυμα Κλάσματα</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Ονομάζονται δύο ή περισσότερα κλάσματα που έχουν τον <strong>ίδιο παρονομαστή</strong>. Χωρίζουν δηλαδή τη μονάδα στον ίδιο ακριβώς αριθμό ίσων μερών.
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-indigo-100 font-mono text-center text-indigo-950 font-bold flex items-center justify-center gap-3">
                <Frac num="3" den="7" />
                <span>,</span>
                <Frac num="5" den="7" />
                <span>,</span>
                <Frac num="-2" den="7" />
              </div>
            </div>

            {/* Ετερώνυμα */}
            <div className="p-6 rounded-2xl bg-sky-50/80 border border-sky-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-black text-sky-700 tracking-wider">ΔΙΑΦΟΡΕΤΙΚΟΣ ΠΑΡΟΝΟΜΑΣΤΗΣ</span>
                  <span className="text-xl">🔀</span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg">Ετερώνυμα Κλάσματα</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Ονομάζονται τα κλάσματα που έχουν <strong>διαφορετικούς παρονομαστές</strong>. Επειδή εκφράζουν μέρη διαφορετικού μεγέθους, για να τα συγκρίνουμε ή να τα προσθέσουμε πρέπει πρώτα να τα κάνουμε ομώνυμα.
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-sky-100 font-mono text-center text-sky-950 font-bold flex items-center justify-center gap-3">
                <Frac num="2" den="3" />
                <span>,</span>
                <Frac num="3" den="5" />
                <span>,</span>
                <Frac num="-1" den="4" />
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΜΕΤΑΤΡΟΠΗ ΕΤΕΡΩΝΥΜΩΝ ΣΕ ΟΜΩΝΥΜΑ & ΕΡΓΑΣΤΗΡΙΟ 1 */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                2
              </span>
              Πώς Μετατρέπουμε Ετερώνυμα Κλάσματα σε Ομώνυμα;
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="text-xs font-black text-indigo-600 uppercase">ΒΗΜΑ 1</div>
              <h4 className="font-bold text-slate-900 text-base">Εύρεση ΕΚΠ Παρονομαστών</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Βρίσκουμε το <strong>Ελάχιστο Κοινό Πολλαπλάσιο (ΕΚΠ)</strong> των παρονομαστών. Αυτό θα αποτελέσει τον <strong>κοινό παρονομαστή</strong> των νέων ομώνυμων κλασμάτων.
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="text-xs font-black text-indigo-600 uppercase">ΒΗΜΑ 2</div>
              <h4 className="font-bold text-slate-900 text-base">«Καπελάκια» / Συντελεστές</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Διαιρούμε το ΕΚΠ με τον παρονομαστή κάθε κλάσματος: <strong>κ ＝ ΕΚΠ ： β</strong>. Ο αριθμός κ είναι ο συντελεστής διαστολής για το κάθε κλάσμα.
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="text-xs font-black text-indigo-600 uppercase">ΒΗΜΑ 3</div>
              <h4 className="font-bold text-slate-900 text-base">Διαστολή Όρων</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Πολλαπλασιάζουμε αριθμητή και παρονομαστή κάθε κλάσματος με τον αντίστοιχο συντελεστή του κ. Έτσι προκύπτουν ισοδύναμα ομώνυμα κλάσματα.
              </p>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 1: ΔΙΑΔΡΑΣΤΙΚΗ ΜΕΤΑΤΡΟΠΗ ΣΕ ΟΜΩΝΥΜΑ */}
          <div className="pt-4 border-t border-slate-100 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              🛠️ Εργαστήριο 1: Διαδραστικός Μετατροπέας Ετερώνυμων σε Ομώνυμα
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Steppers Ελέγχου (5 cols) */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                {/* Κλάσμα 1 */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-indigo-900 uppercase">1Ο ΚΛΑΣΜΑ</div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">ΑΡΙΘΜΗΤΗΣ (α)</label>
                    <div className="grid grid-cols-[36px_1fr_36px] items-center h-10 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setLab1Num1, -1, 1, 20, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 font-bold text-sm font-mono text-indigo-950">
                        {lab1Num1}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setLab1Num1, 1, 1, 20, e)}
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
                        onClick={(e) => handleStep(setLab1Den1, -1, 2, 18, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 font-bold text-sm font-mono text-indigo-950">
                        {lab1Den1}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setLab1Den1, 1, 2, 18, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                      >
                        ＋
                      </button>
                    </div>
                  </div>
                </div>

                {/* Κλάσμα 2 */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-sky-900 uppercase">2Ο ΚΛΑΣΜΑ</div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">ΑΡΙΘΜΗΤΗΣ (γ)</label>
                    <div className="grid grid-cols-[36px_1fr_36px] items-center h-10 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setLab1Num2, -1, 1, 20, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 font-bold text-sm font-mono text-sky-950">
                        {lab1Num2}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setLab1Num2, 1, 1, 20, e)}
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
                        onClick={(e) => handleStep(setLab1Den2, -1, 2, 18, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 font-bold text-sm font-mono text-sky-950">
                        {lab1Den2}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setLab1Den2, 1, 2, 18, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                      >
                        ＋
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ανάλυση Βήμα-Βήμα & Αποτέλεσμα (7 cols) */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white space-y-4 shadow-md font-mono">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    ΑΠΟΤΕΛΕΣΜΑ ΜΕΤΑΤΡΟΠΗΣ ΣΕ ΟΜΩΝΥΜΑ
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 font-sans">
                    ΕΚΠ({lab1Den1}, {lab1Den2}) ＝ {commonLcm}
                  </span>
                </div>

                <div className="space-y-3 pt-1">
                  {/* 1ο Κλάσμα */}
                  <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2 text-base sm:text-xl">
                      <Frac num={lab1Num1} den={lab1Den1} className="text-white" />
                      <span className="text-indigo-300 text-sm sm:text-base font-sans">
                        (διαίρεση με το {mult1})
                      </span>
                      <span className="text-indigo-300">＝</span>
                      <Frac num={newNum1} den={commonLcm} className="text-emerald-400 text-lg sm:text-2xl" />
                    </div>
                    <span className="text-xs text-slate-300 font-sans font-normal">
                      {commonLcm} ： {lab1Den1} ＝ {mult1}
                    </span>
                  </div>

                  {/* 2ο Κλάσμα */}
                  <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2 text-base sm:text-xl">
                      <Frac num={lab1Num2} den={lab1Den2} className="text-white" />
                      <span className="text-indigo-300 text-sm sm:text-base font-sans">
                        (διαίρεση με το {mult2})
                      </span>
                      <span className="text-indigo-300">＝</span>
                      <Frac num={newNum2} den={commonLcm} className="text-sky-300 text-lg sm:text-2xl" />
                    </div>
                    <span className="text-xs text-slate-300 font-sans font-normal">
                      {commonLcm} ： {lab1Den2} ＝ {mult2}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-400/20 text-xs font-sans text-emerald-200">
                  Τα ετερώνυμα κλάσματα έγιναν ομώνυμα με κοινό παρονομαστή το <strong>{commonLcm}</strong>.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ΑΠΟΛΥΤΗ ΤΙΜΗ & ΣΥΓΚΡΙΣΗ ΚΛΑΣΜΑΤΩΝ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                3
              </span>
              Απόλυτη Τιμή, Σύγκριση & Διάταξη Ρητών Κλασμάτων
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            {/* Απόλυτη Τιμή */}
            <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xs uppercase font-black text-indigo-700 tracking-wider block">ΚΑΝΟΝΑΣ 1</span>
                <h3 className="font-bold text-slate-900 text-base">Απόλυτη Τιμή Κλάσματος</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Η απόλυτη τιμή ενός ρητού κλάσματος είναι πάντοτε <strong>θετικός αριθμός ή μηδέν</strong> (απορρίπτουμε το αρνητικό πρόσημο):
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-indigo-100 font-mono text-center text-xs sm:text-sm font-bold text-indigo-950 flex items-center justify-center gap-2">
                <span>|</span><Frac num="-3" den="4" /><span>| ＝ </span><Frac num="3" den="4" />
              </div>
            </div>

            {/* Σύγκριση Ομώνυμων */}
            <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-2 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xs uppercase font-black text-sky-700 tracking-wider block">ΚΑΝΟΝΑΣ 2</span>
                <h3 className="font-bold text-slate-900 text-base">Σύγκριση Ομώνυμων</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Σε δύο ομώνυμα κλάσματα με θετικό παρονομαστή, μεγαλύτερο είναι εκείνο με τον <strong>μεγαλύτερο αριθμητή</strong>.
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-sky-100 font-mono text-center text-xs sm:text-sm font-bold text-sky-950 flex items-center justify-center gap-2">
                <Frac num="5" den="7" /> <span>＞</span> <Frac num="3" den="7" />
                <span className="mx-1 text-slate-400">|</span>
                <Frac num="-2" den="7" /> <span>＞</span> <Frac num="-5" den="7" />
              </div>
            </div>

            {/* Σύγκριση Ετερώνυμων */}
            <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xs uppercase font-black text-purple-700 tracking-wider block">ΚΑΝΟΝΑΣ 3</span>
                <h3 className="font-bold text-slate-900 text-base">Σύγκριση Ετερώνυμων</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Τα μετατρέπουμε πρώτα σε <strong>ομώνυμα</strong> μέσω του ΕΚΠ ή ελέγχουμε τα <strong>χιαστί γινόμενα</strong> των όρων τους.
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-purple-100 font-mono text-center text-xs sm:text-sm font-bold text-purple-950 flex items-center justify-center gap-1">
                <span>α · δ ＞ β · γ ⟺ </span><Frac num="α" den="β" /> <span>＞</span> <Frac num="γ" den="δ" />
              </div>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 2: ΔΙΑΔΡΑΣΤΙΚΟΣ ΣΥΓΚΡΙΤΗΣ & ΔΙΑΤΑΞΗ */}
          <div className="pt-4 border-t border-slate-100 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              🛠️ Εργαστήριο 2: Διαδραστικός Συγκριτής & Διάταξη Ρητών
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Steppers Εισαγωγής (5 cols) */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                {/* 1ο Κλάσμα */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-indigo-900 uppercase">1Ο ΚΛΑΣΜΑ</div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">ΑΡΙΘΜΗΤΗΣ (α)</label>
                    <div className="grid grid-cols-[36px_1fr_36px] items-center h-10 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setCmpNum1, -1, -20, 20, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 font-bold text-sm font-mono text-indigo-950">
                        {cmpNum1 > 0 ? `＋${cmpNum1}` : cmpNum1}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setCmpNum1, 1, -20, 20, e)}
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
                        onClick={(e) => handleStep(setCmpDen1, -1, 1, 20, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 font-bold text-sm font-mono text-indigo-950">
                        {cmpDen1}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setCmpDen1, 1, 1, 20, e)}
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
                        onClick={(e) => handleStep(setCmpNum2, -1, -20, 20, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 font-bold text-sm font-mono text-sky-950">
                        {cmpNum2 > 0 ? `＋${cmpNum2}` : cmpNum2}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setCmpNum2, 1, -20, 20, e)}
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
                        onClick={(e) => handleStep(setCmpDen2, -1, 1, 20, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 font-bold text-sm font-mono text-sky-950">
                        {cmpDen2}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setCmpDen2, 1, 1, 20, e)}
                        className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                      >
                        ＋
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Κάρτα Σύγκρισης & Χιαστί (7 cols) */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    ΑΠΟΤΕΛΕΣΜΑ ΣΥΓΚΡΙΣΗΣ
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border font-sans ${
                    comparisonSymbol === '＞'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                      : comparisonSymbol === '＜'
                      ? 'bg-sky-500/20 text-sky-300 border-sky-400/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                  }`}>
                    {comparisonSymbol === '＞' ? 'ΤΟ 1Ο ΕΙΝΑΙ ΜΕΓΑΛΥΤΕΡΟ' : comparisonSymbol === '＜' ? 'ΤΟ 2Ο ΕΙΝΑΙ ΜΕΓΑΛΥΤΕΡΟ' : 'ΕΙΝΑΙ ΙΣΑ'}
                  </span>
                </div>

                {/* Μεγάλη Εμφάνιση Σύγκρισης */}
                <div className="flex items-center justify-center gap-3 sm:gap-5 text-2xl sm:text-4xl font-black py-2">
                  <Frac num={cmpNum1} den={cmpDen1} className="text-white" />
                  <span className="text-amber-400 font-sans text-3xl sm:text-5xl">
                    {comparisonSymbol}
                  </span>
                  <Frac num={cmpNum2} den={cmpDen2} className="text-white" />
                </div>

                {/* Ανάλυση με Ομώνυμα & Χιαστί */}
                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 space-y-2 text-xs sm:text-sm font-sans">
                  <div className="flex items-center justify-between flex-wrap gap-1 font-mono">
                    <span className="text-slate-300">Μέσω Ομώνυμων (ΕΚΠ ＝ {cmpLcm}):</span>
                    <span>
                      <Frac num={cmpHomNum1} den={cmpLcm} className="text-emerald-300" />
                      <span className="mx-1 text-amber-300">{comparisonSymbol}</span>
                      <Frac num={cmpHomNum2} den={cmpLcm} className="text-sky-300" />
                    </span>
                  </div>

                  <div className="flex items-center justify-between flex-wrap gap-1 font-mono pt-1 border-t border-white/10">
                    <span className="text-slate-300">Μέσω Χιαστί Γινομένων:</span>
                    <span>
                      {cmpNum1} · {cmpDen2} ＝ <strong>{cross1}</strong>
                      <span className="mx-1.5 text-amber-300">{comparisonSymbol}</span>
                      {cmpDen1} · {cmpNum2} ＝ <strong>{cross2}</strong>
                    </span>
                  </div>

                  <div className="flex items-center justify-between flex-wrap gap-1 font-mono pt-1 border-t border-white/10 text-xs">
                    <span className="text-slate-300">Απόλυτες Τιμές:</span>
                    <span>
                      |<Frac num={cmpNum1} den={cmpDen1} />| ＝ <Frac num={Math.abs(cmpNum1)} den={cmpDen1} />
                      <span className="mx-2 text-slate-400">και</span>
                      |<Frac num={cmpNum2} den={cmpDen2} />| ＝ <Frac num={Math.abs(cmpNum2)} den={cmpDen2} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
