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

export default function IsodinamaKlasmataTheoria() {
  // State για Εργαστήριο 1: Διαστολή / Συστολή
  const [baseNum, setBaseNum] = useState(2);
  const [baseDen, setBaseDen] = useState(3);
  const [multiplier, setMultiplier] = useState(2);

  // State για Εργαστήριο 2: Χιαστί Γινόμενα
  const [f1Num, setF1Num] = useState(3);
  const [f1Den, setF1Den] = useState(4);
  const [f2Num, setF2Num] = useState(6);
  const [f2Den, setF2Den] = useState(8);

  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  // Υπολογισμοί Εργαστηρίου 1
  const scaledNum = useMemo(() => baseNum * multiplier, [baseNum, multiplier]);
  const scaledDen = useMemo(() => baseDen * multiplier, [baseDen, multiplier]);
  const baseGcd = useMemo(() => gcd(baseNum, baseDen), [baseNum, baseDen]);
  const isReduced = baseGcd === 1;

  // Υπολογισμοί Εργαστηρίου 2 (Χιαστί)
  const crossProd1 = useMemo(() => f1Num * f2Den, [f1Num, f2Den]);
  const crossProd2 = useMemo(() => f1Den * f2Num, [f1Den, f2Num]);
  const areEquivalent = useMemo(() => crossProd1 === crossProd2, [crossProd1, crossProd2]);

  return (
    <Layout
      title="Ισοδύναμα Κλάσματα | Α' Γυμνασίου"
      description="Έννοια ισοδύναμων κλασμάτων, διαστολή, απλοποίηση σε ανάγωγο κλάσμα και κριτήριο χιαστί γινομένων."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/14-isodinama-klasmata-ask"
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
              Ισοδύναμα Κλάσματα
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              Μαθαίνουμε πότε δύο κλάσματα είναι ισοδύναμα, πώς δημιουργούμε ίσα κλάσματα με διαστολή ή απλοποίηση και πώς τα ελέγχουμε ταχύτατα με τα χιαστί γινόμενα.
            </p>
          </div>
        </section>

        {/* 1. ΕΝΝΟΙΑ & ΒΑΣΙΚΗ ΙΔΙΟΤΗΤΑ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                1
              </span>
              Τι Είναι Ισοδύναμα Κλάσματα;
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="space-y-4">
              <p>
                <strong>Ισοδύναμα (ή ίσα)</strong> ονομάζονται τα κλάσματα που εκφράζουν <strong>το ίδιο μέρος μιας ποσότητας</strong> ή αντιστοιχούν στον <strong>ίδιο ρητό αριθμό</strong>.
              </p>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 font-black text-center text-lg sm:text-xl font-mono shadow-sm flex items-center justify-center gap-2 flex-wrap">
                <Frac num="1" den="2" />
                <span>＝</span>
                <Frac num="2" den="4" />
                <span>＝</span>
                <Frac num="3" den="6" />
                <span>＝</span>
                <Frac num="4" den="8" />
                <span>＝ 0,5</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                Αν και έχουν διαφορετικούς αριθμητές και παρονομαστές, η τιμή τους παραμένει απολύτως ίδια.
              </p>
            </div>

            {/* Διαστολή & Συστολή */}
            <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                Η ΒΑΣΙΚΗ ΙΔΙΟΤΗΤΑ ΤΩΝ ΚΛΑΣΜΑΤΩΝ
              </div>
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-indigo-950">1. Διαστολή (Πολλαπλασιασμός)</div>
                  <p className="text-slate-600">
                    Πολλαπλασιάζουμε αριθμητή και παρονομαστή με τον ίδιο μη μηδενικό αριθμό:
                  </p>
                  <div className="font-mono text-indigo-900 font-bold flex items-center">
                    <Frac num="α" den="β" /> ＝ <Frac num="α · κ" den="β · κ" /> (κ ≠ 0)
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-indigo-950">2. Απλοποίηση ή Συστολή (Διαίρεση)</div>
                  <p className="text-slate-600">
                    Διαιρούμε αριθμητή και παρονομαστή με κοινό τους διαιρέτη:
                  </p>
                  <div className="font-mono text-indigo-900 font-bold flex items-center">
                    <Frac num="α" den="β" /> ＝ <Frac num="α ： κ" den="β ： κ" /> (κ ≠ 0)
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs sm:text-sm text-amber-950 space-y-1">
            <strong>Ανάγωγο Κλάσμα:</strong> Ένα κλάσμα λέγεται ανάγωγο όταν ο αριθμητής και ο παρονομαστής του δεν έχουν κανέναν κοινό διαιρέτη εκτός από το 1 (δηλαδή είναι πρώτοι μεταξύ τους, ΜΚΔ ＝ 1) και συνεπώς <strong>δεν μπορεί να απλοποιηθεί περαιτέρω</strong>.
          </div>
        </section>

        {/* 2. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΔΙΑΣΤΟΛΗ & ΟΠΤΙΚΕΣ ΡΑΒΔΟΙ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                2
              </span>
              Διαδραστικό Εργαστήριο: Δημιουργία & Οπτικοποίηση Ισοδύναμου Κλάσματος
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Steppers Ελέγχου */}
            <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Αριθμητής (α)
                </label>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setBaseNum, -1, 1, 20, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-indigo-900 font-black text-lg font-mono">
                    α ＝ {baseNum}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setBaseNum, 1, 1, 20, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Παρονομαστής (β)
                </label>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setBaseDen, -1, 1, 25, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200 text-sky-900 font-black text-lg font-mono">
                    β ＝ {baseDen}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setBaseDen, 1, 1, 25, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-indigo-700 uppercase mb-1">
                  Συντελεστής Διαστολής (κ)
                </label>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setMultiplier, -1, 1, 8, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-indigo-50 rounded-xl border border-indigo-200 text-indigo-950 font-black text-lg font-mono">
                    · {multiplier}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setMultiplier, 1, 1, 8, e)}
                    className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>
            </div>

            {/* Οπτική Αναπαράσταση & Αποτέλεσμα */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white space-y-5 shadow-md">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold">
                  ΙΣΟΤΗΤΑ ΚΛΑΣΜΑΤΩΝ
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  {isReduced ? 'ΑΡΧΙΚΟ ΑΝΑΓΩΓΟ' : 'ΑΡΧΙΚΟ ΜΗ ΑΝΑΓΩΓΟ'}
                </span>
              </div>

              {/* Μαθηματική Εξίσωση με απόλυτα ενιαίο μέγεθος */}
              <div className="flex items-center gap-3 sm:gap-4 text-2xl sm:text-4xl font-black font-mono flex-wrap">
                <Frac num={baseNum} den={baseDen} className="text-white text-2xl sm:text-4xl" />
                <span className="text-indigo-300 text-2xl sm:text-4xl">＝</span>
                <Frac
                  num={`${baseNum} · ${multiplier}`}
                  den={`${baseDen} · ${multiplier}`}
                  className="text-slate-200 text-2xl sm:text-4xl"
                />
                <span className="text-indigo-300 text-2xl sm:text-4xl">＝</span>
                <Frac num={scaledNum} den={scaledDen} className="text-emerald-400 text-2xl sm:text-4xl" />
              </div>

              {/* Οπτικές Ράβδοι Σύγκρισης: Ανά Ακέραια Μονάδα σε στήλη (Χωρίς οριζόντιο scroll) */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between text-[11px] text-slate-300 font-bold border-b border-slate-700/60 pb-2">
                  <span>
                    Σύγκριση ανά Ακέραια Μονάδα 
                    {baseNum > baseDen && ` (${Math.ceil(baseNum / baseDen)} συνολικές μονάδες)`}:
                  </span>
                  <span className="font-mono text-emerald-400">
                    {((baseNum / baseDen) * 100).toFixed(1)}%
                  </span>
                </div>

                <div className="space-y-3.5">
                  {Array.from({ length: Math.ceil(baseNum / baseDen) }).map((_, barIdx) => (
                    <div
                      key={barIdx}
                      className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2"
                    >
                      <div className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider">
                        {barIdx + 1}η Ακέραια Μονάδα [{barIdx}, {barIdx + 1}]
                      </div>

                      {/* 1. Μπάρα Αρχικού Κλάσματος */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                          <span>Αρχικό (ανά {baseDen}):</span>
                          <span>
                            {Math.max(0, Math.min(baseDen, baseNum - barIdx * baseDen))} / {baseDen}
                          </span>
                        </div>
                        <div className="w-full h-7 bg-slate-800 rounded-lg overflow-hidden flex border border-slate-700 shadow-inner">
                          {Array.from({ length: baseDen }).map((_, partIdx) => {
                            const globalIdx = barIdx * baseDen + partIdx;
                            const isFilled = globalIdx < baseNum;
                            return (
                              <div
                                key={partIdx}
                                className={`h-full border-r border-slate-900/60 transition-all ${
                                  isFilled ? 'bg-indigo-500' : 'bg-slate-800'
                                }`}
                                style={{ width: `${100 / baseDen}%` }}
                              />
                            );
                          })}
                        </div>
                      </div>

                      {/* 2. Μπάρα Ισοδύναμου Κλάσματος (ακριβώς από κάτω για άμεση σύγκριση) */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-emerald-400 font-mono">
                          <span>Ισοδύναμο (ανά {scaledDen}):</span>
                          <span>
                            {Math.max(0, Math.min(scaledDen, scaledNum - barIdx * scaledDen))} / {scaledDen}
                          </span>
                        </div>
                        <div className="w-full h-7 bg-slate-800 rounded-lg overflow-hidden flex border border-slate-700 shadow-inner">
                          {Array.from({ length: scaledDen }).map((_, partIdx) => {
                            const globalIdx = barIdx * scaledDen + partIdx;
                            const isFilled = globalIdx < scaledNum;
                            return (
                              <div
                                key={partIdx}
                                className={`h-full border-r border-slate-900/40 transition-all ${
                                  isFilled ? 'bg-emerald-500' : 'bg-slate-800'
                                }`}
                                style={{ width: `${100 / scaledDen}%` }}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-xs text-indigo-100">
                Παρατηρούμε ότι σε κάθε ακέραια μονάδα οι δύο ράβδοι καλύπτουν ακριβώς το ίδιο μήκος, άρα τα κλάσματα είναι <strong>ισοδύναμα</strong>!
              </div>
            </div>
          </div>
        </section>

        {/* 3. ΚΡΙΤΗΡΙΟ ΧΙΑΣΤΙ ΓΙΝΟΜΕΝΩΝ & ΕΡΓΑΣΤΗΡΙΟ 2 */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                3
              </span>
              Το Κριτήριο των Χιαστί Γινομένων
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            <div className="space-y-4">
              <p>
                Ο πιο γρήγορος τρόπος για να ελέγξουμε αν δύο κλάσματα είναι ισοδύναμα είναι ο κανόνας των <strong>χιαστί γινομένων</strong>:
              </p>
              <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 font-black text-center text-lg sm:text-xl font-mono shadow-sm flex items-center justify-center gap-3 flex-wrap">
                <Frac num="α" den="β" />
                <span>＝</span>
                <Frac num="γ" den="δ" />
                <span className="text-indigo-600">⟺</span>
                <span>α · δ ＝ β · γ</span>
              </div>
              <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-600">
                <li>Αν τα χιαστί γινόμενα είναι <strong>ίσα</strong>, τα κλάσματα είναι <strong>ισοδύναμα</strong>.</li>
                <li>Αν τα χιαστί γινόμενα είναι <strong>άνισα</strong>, τα κλάσματα <strong>δεν είναι ισοδύναμα</strong>.</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 font-mono text-xs sm:text-sm">
              <div className="text-xs font-bold uppercase text-slate-500 font-sans">
                ΠΑΡΑΔΕΙΓΜΑ ΕΛΕΓΧΟΥ
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center flex-wrap">
                  Ελέγχουμε τα κλάσματα <Frac num="3" den="5" /> και <Frac num="9" den="15" />:
                </div>
                <div>1ο γινόμενο: 3 · 15 ＝ <strong>45</strong></div>
                <div>2ο γινόμενο: 5 · 9 ＝ <strong>45</strong></div>
                <div className="text-emerald-700 font-sans font-bold pt-1">
                  Τα γινόμενα είναι ίσα (45 ＝ 45), άρα τα κλάσματα είναι ισοδύναμα!
                </div>
              </div>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 2: ΔΟΚΙΜΑΣΤΗΡΙΟ ΧΙΑΣΤΙ ΓΙΝΟΜΕΝΩΝ */}
          <div className="pt-4 border-t border-slate-100 space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              🛠️ Εργαστήριο 2: Δοκιμαστήριο Χιαστί Γινομένων σε Πραγματικό Χρόνο
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              {/* Steppers για τα 2 κλάσματα */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                {/* Κλάσμα 1 */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-indigo-900 uppercase">1Ο ΚΛΑΣΜΑ (α/β)</div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">ΑΡΙΘΜΗΤΗΣ (α)</label>
                    <div className="grid grid-cols-[32px_1fr_32px] items-center h-9 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF1Num, -1, 1, 20, e)}
                        className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-sm font-mono">
                        {f1Num}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF1Num, 1, 1, 20, e)}
                        className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                      >
                        ＋
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">ΠΑΡΟΝΟΜΑΣΤΗΣ (β)</label>
                    <div className="grid grid-cols-[32px_1fr_32px] items-center h-9 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF1Den, -1, 1, 25, e)}
                        className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-sm font-mono">
                        {f1Den}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF1Den, 1, 1, 25, e)}
                        className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                      >
                        ＋
                      </button>
                    </div>
                  </div>
                </div>

                {/* Κλάσμα 2 */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-sky-900 uppercase">2Ο ΚΛΑΣΜΑ (γ/δ)</div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">ΑΡΙΘΜΗΤΗΣ (γ)</label>
                    <div className="grid grid-cols-[32px_1fr_32px] items-center h-9 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF2Num, -1, 1, 30, e)}
                        className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-sm font-mono">
                        {f2Num}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF2Num, 1, 1, 30, e)}
                        className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                      >
                        ＋
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">ΠΑΡΟΝΟΜΑΣΤΗΣ (δ)</label>
                    <div className="grid grid-cols-[32px_1fr_32px] items-center h-9 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF2Den, -1, 1, 35, e)}
                        className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-sm font-mono">
                        {f2Den}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setF2Den, 1, 1, 35, e)}
                        className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95"
                      >
                        ＋
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Κάρτα Αποτελέσματος Χιαστί */}
              <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    ΕΛΕΓΧΟΣ ΙΣΟΔΥΝΑΜΙΑΣ
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border font-sans ${
                    areEquivalent
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                      : 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                  }`}>
                    {areEquivalent ? 'ΙΣΟΔΥΝΑΜΑ ( ＝ )' : 'ΜΗ ΙΣΟΔΥΝΑΜΑ ( ≠ )'}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-4 text-2xl sm:text-3xl font-black">
                  <Frac num={f1Num} den={f1Den} className="text-white" />
                  <span className={areEquivalent ? 'text-emerald-400' : 'text-rose-400'}>
                    {areEquivalent ? '＝' : '≠'}
                  </span>
                  <Frac num={f2Num} den={f2Den} className="text-white" />
                </div>

                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 space-y-1.5 text-xs sm:text-sm">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>1ο Χιαστί (α · δ): {f1Num} · {f2Den} ＝</span>
                    <strong className="text-amber-300">{crossProd1}</strong>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>2ο Χιαστί (β · γ): {f1Den} · {f2Num} ＝</span>
                    <strong className="text-sky-300">{crossProd2}</strong>
                  </div>
                  <div className="pt-1 border-t border-white/10 text-xs font-sans">
                    {areEquivalent ? (
                      <span className="text-emerald-300">
                        Επειδή τα γινόμενα είναι ίσα ({crossProd1} ＝ {crossProd2}), τα δύο κλάσματα είναι <strong>ισοδύναμα</strong>.
                      </span>
                    ) : (
                      <span className="text-rose-300">
                        Επειδή {crossProd1} ≠ {crossProd2}, τα κλάσματα <strong>δεν είναι ισοδύναμα</strong>.
                      </span>
                    )}
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
