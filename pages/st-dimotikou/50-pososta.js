// pages/st-dimotikou/50-pososta.js
import { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Βοηθητικο component εμφανισης κλασματος
function Fraction({ num, den, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono ${className}`}>
      <span className="border-b-2 border-current px-1.5 pb-0.5 text-center leading-none">
        {num}
      </span>
      <span className="px-1.5 pt-0.5 text-center leading-none">
        {den}
      </span>
    </span>
  );
}

// Μορφοποιηση αριθμου (ακεραιος η δεκαδικος με κομμα)
function formatNum(val, decimals = 2) {
  if (Number.isInteger(val)) return String(val);
  const rounded = Number(val.toFixed(decimals));
  return String(rounded).replace('.', ',');
}

export default function PosostaTheoryPage() {
  // Εργαστηριο 1: Διαδραστικο Πλεγμα 100 τετραγωνων
  const [gridPercent, setGridPercent] = useState(35); // 35%

  const decimalVal = useMemo(() => {
    return (gridPercent / 100).toFixed(2).replace('.', ',');
  }, [gridPercent]);

  // Εργαστηριο 2: Μετατροπη Κλασματος σε ισοδυναμο με παρονομαστη 100
  // Επιλογες φιλικων παρονομαστων που διαιρουν το 100
  const fractionPresets = [
    { num: 1, den: 2, mult: 50 },
    { num: 3, den: 4, mult: 25 },
    { num: 2, den: 5, mult: 20 },
    { num: 7, den: 10, mult: 10 },
    { num: 9, den: 20, mult: 5 },
    { num: 13, den: 25, mult: 4 },
    { num: 17, den: 50, mult: 2 }
  ];

  const [selectedFractionIdx, setSelectedFractionIdx] = useState(1); // default: 3/4
  const currentFraction = fractionPresets[selectedFractionIdx];

  const equivalentNum = currentFraction.num * currentFraction.mult;
  const percentFromFraction = equivalentNum;

  return (
    <Layout
      title="Ποσοστά & Μετατροπή Κλασμάτων - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μαθαίνουμε την έννοια του ποσοστού, πώς μετατρέπουμε κλάσματα σε ισοδύναμα με παρονομαστή 100 και πώς συνδέονται με δεκαδικούς αριθμούς με διαδραστικά εργαστήρια."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/50-pososta-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 Ασκήσεις</span>
        </Link>
      }
    >
      {/* Container πληρους ευρους για 2K & 4K και responsive για κινητα */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 space-y-10 2xl:space-y-14 pb-24">
        
        {/* 1. HEADER BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>ΚΕΦΑΛΑΙΟ 50 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Η Έννοια του Ποσοστού &amp; Μετατροπή Κλασμάτων
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              Ανακαλύπτουμε τι συμβολίζει το ποσοστό στα εκατό (%), πώς μετατρέπουμε οποιοδήποτε κλάσμα σε ισοδύναμο με παρονομαστή το 100 και πώς συνδέονται τα κλάσματα, οι δεκαδικοί αριθμοί και τα ποσοστά.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία &amp; Οπτικοποίηση Εκατοστιαίου Πλέγματος</span>
            </div>
            <Link
              href="/st-dimotikou/50-pososta-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2.5 2xl:px-7 2xl:py-3.5 rounded-xl shadow-md transition active:scale-95 text-sm 2xl:text-base"
            >
              <span>Δοκίμασε τις Ασκήσεις</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΑΝΑΛΥΣΗΣ ΘΕΩΡΙΑΣ ΣΕ 4 ΒΗΜΑΤΑ */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
              Βασικές Έννοιες &amp; Μέθοδοι σε 4 Βήματα
            </h2>
            <p className="text-slate-600 text-sm sm:text-base 2xl:text-xl mt-1">
              Από το κλάσμα στο εκατοστιαίο κλάσμα και από εκεί στον δεκαδικό αριθμό και στο σύμβολο %.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 gap-6 2xl:gap-8">
            
            {/* Βημα 1ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-sky-100 text-sky-800 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 1
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Ορισμός</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Τι είναι το Ποσοστό (%);
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  <strong>Ποσοστό στα εκατό (%)</strong> είναι ένας λόγος που συγκρίνει ένα μέρος με το όλο, όταν το όλο θεωρείται χωρισμένο σε <strong>100 ίσα μέρη</strong>:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm text-center">
                  <div className="flex items-center justify-center gap-2 font-bold text-base sm:text-lg text-indigo-900">
                    <span className="font-black text-amber-700">25 %</span>
                    <span>＝</span>
                    <Fraction num="25" den="100" />
                    <span>＝</span>
                    <span className="font-mono">0,25</span>
                  </div>
                  <p className="text-slate-500 text-xs pt-1 font-sans">
                    Σημαίνει: 25 μέρη από τα 100 συνολικά ίσα μέρη.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Το σύμβολο <span className="font-bold">%</span> αντικαθιστά τον παρονομαστή <span className="font-bold">100</span>.
              </div>
            </article>

            {/* Βημα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Μεθοδολογία</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Μετατροπή με Διαπλασιασμό
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Όταν ο παρονομαστής είναι διαιρέτης του 100 (2, 4, 5, 10, 20, 25, 50), <strong>πολλαπλασιάζουμε και τους δύο όρους</strong> με τον κατάλληλο αριθμό:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm font-mono text-center">
                  <div className="text-slate-800">
                    <Fraction num="3" den="4" /> ＝ <Fraction num="3 · 25" den="4 · 25" /> ＝ <Fraction num="75" den="100" /> ＝ <strong className="text-emerald-700 font-black">75 %</strong>
                  </div>
                  <div className="text-[11px] text-slate-500 font-sans pt-1">
                    Επειδή 100 : 4 ＝ 25, πολλαπλασιάσαμε με το 25.
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Βασικοί πολλαπλασιαστές: 2 · 50, 4 · 25, 5 · 20, 10 · 10, 20 · 5, 25 · 4, 50 · 2.
              </div>
            </article>

            {/* Βημα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Γενική Μέθοδος</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Μετατροπή με Διαίρεση
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Αν ο παρονομαστής δεν διαιρεί εύκολα το 100 (π.χ. 8, 12, 16), <strong>διαιρούμε τον αριθμητή με τον παρονομαστή</strong> για να βρούμε τον δεκαδικό:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm font-mono text-center">
                  <div className="text-slate-800">
                    <Fraction num="5" den="8" /> ＝ 5 : 8 ＝ 0,625
                  </div>
                  <div className="text-indigo-900 font-bold">
                    0,625 · 100 ＝ <strong className="text-emerald-700">62,5 %</strong>
                  </div>
                  <div className="text-[11px] text-slate-500 font-sans pt-1">
                    Πολλαπλασιάζουμε τον δεκαδικό με το 100 μετακινώντας την υποδιαστολή 2 θέσεις δεξιά.
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Αυτή η μέθοδος λειτουργεί εγγυημένα για οποιοδήποτε κλάσμα!
              </div>
            </article>

            {/* Βημα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Οι 4 Μορφές</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Η Τετραπλή Ταυτότητα
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Κάθε ποσότητα μπορεί να εκφραστεί με 4 ισοδύναμους τρόπους:
                </p>

                <div className="space-y-1.5 text-xs sm:text-sm">
                  <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 flex justify-between items-center">
                    <span>1. Απλό Κλάσμα:</span>
                    <strong className="font-mono"><Fraction num="1" den="2" /></strong>
                  </div>
                  <div className="p-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-950 flex justify-between items-center">
                    <span>2. Εκατοστιαίο Κλάσμα:</span>
                    <strong className="font-mono"><Fraction num="50" den="100" /></strong>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex justify-between items-center">
                    <span>3. Δεκαδικός Αριθμός:</span>
                    <strong className="font-mono">0,50</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 flex justify-between items-center">
                    <span>4. Ποσοστό:</span>
                    <strong className="font-mono">50 %</strong>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Όλες οι παραπάνω εκφράσεις αντιπροσωπεύουν ακριβώς την ίδια μαθηματική ποσότητα (το μισό).
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΤΟ ΕΚΑΤΟΣΤΙΑΙΟ ΠΛΕΓΜΑ (10x10) */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1</span>
              </div>
              <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Το Εκατοστιαίο Πλέγμα (100 Τετράγωνα)
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Σύρετε τη γραμμή για να επιλέξετε πόσα κουτάκια από τα 100 θέλετε να χρωματίσετε και δείτε την αυτόματη μετατροπή σε κλάσμα, δεκαδικό και ποσοστό %.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Χειριστηριο & Καρτες Αποτελεσματων */}
            <div className="lg:col-span-6 space-y-5">
              
              <div className="bg-blue-50/70 p-5 rounded-2xl border border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-blue-900 tracking-wider">
                    ΧΡΩΜΑΤΙΣΜΕΝΑ ΤΕΤΡΑΓΩΝΑ
                  </span>
                  <span className="font-mono font-black text-2xl text-blue-700 bg-white px-3 py-0.5 rounded-lg border border-blue-200">
                    {gridPercent} / 100
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setGridPercent((prev) => Math.max(0, prev - 5)); }}
                    disabled={gridPercent <= 0}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={gridPercent}
                    onChange={(e) => setGridPercent(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setGridPercent((prev) => Math.min(100, prev + 5)); }}
                    disabled={gridPercent >= 100}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* 3 Καρτες Ταυτοτητας */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                
                {/* Κλασμα */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-slate-500 uppercase block">ΕΚΑΤΟΣΤΙΑΙΟ ΚΛΑΣΜΑ</span>
                  <div className="text-lg font-black text-indigo-900 pt-1">
                    <Fraction num={gridPercent} den="100" />
                  </div>
                </div>

                {/* Δεκαδικος */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-slate-500 uppercase block">ΔΕΚΑΔΙΚΟΣ</span>
                  <div className="font-mono font-black text-xl text-slate-800 pt-2">
                    {decimalVal}
                  </div>
                </div>

                {/* Ποσοστο */}
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
                  <span className="text-xs font-bold text-amber-900 uppercase block">ΠΟΣΟΣΤΟ (%)</span>
                  <div className="font-mono font-black text-2xl text-amber-700 pt-1">
                    {gridPercent} %
                  </div>
                </div>

              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
                🔍 <strong>Μαθηματική Ανάλυση:</strong> Από τα 100 κουτάκια έχουμε επιλέξει τα <strong>{gridPercent}</strong>. Αυτό σημαίνει ότι το ποσοστό είναι ακριβώς <strong>{gridPercent} %</strong> ή δεκαδικά <strong>{decimalVal}</strong>.
              </div>

            </div>

            {/* Οπτικο Πλεγμα 10x10 */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center bg-slate-50 p-6 rounded-3xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                ΠΛΕΓΜΑ 10 × 10 (100 ΤΕΤΡΑΓΩΝΑ)
              </span>

              <div className="grid grid-cols-10 gap-1 sm:gap-1.5 p-3 bg-white rounded-2xl border-2 border-slate-300 shadow-sm max-w-[340px] sm:max-w-[380px] aspect-square w-full">
                {Array.from({ length: 100 }).map((_, idx) => {
                  const isFilled = idx < gridPercent;
                  return (
                    <div
                      key={`sq-${idx}`}
                      className={`aspect-square rounded-md transition-all duration-150 ${
                        isFilled
                          ? 'bg-blue-600 shadow-inner scale-95'
                          : 'bg-slate-100 border border-slate-200'
                      }`}
                    />
                  );
                })}
              </div>

              <span className="text-xs text-slate-500 font-semibold mt-3 text-center">
                Χρωματισμένα: {gridPercent} | Λευκά: {100 - gridPercent}
              </span>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΜΕΤΑΤΡΟΠΕΑΣ ΚΛΑΣΜΑΤΩΝ ΣΕ ΠΟΣΟΣΤΑ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
                <span>⚡ ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2</span>
              </div>
              <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Δυναμικός Μετατροπέας Κλάσματος σε Παρονομαστή 100
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Επιλέξτε ένα κλάσμα και παρακολουθήστε πώς βρίσκουμε τον πολλαπλασιαστή για να δημιουργήσουμε ισοδύναμο κλάσμα με παρονομαστή 100.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            
            {/* Επιλογεας Κλασματων */}
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
                ΕΠΙΛΕΞΤΕ ΕΝΑ ΚΛΑΣΜΑ ΠΡΟΣ ΜΕΤΑΤΡΟΠΗ:
              </span>
              <div className="flex flex-wrap gap-2.5">
                {fractionPresets.map((f, idx) => (
                  <button
                    key={`preset-${idx}`}
                    type="button"
                    onClick={() => setSelectedFractionIdx(idx)}
                    className={`px-4 py-2.5 rounded-2xl font-bold transition flex items-center gap-2 ${
                      selectedFractionIdx === idx
                        ? 'bg-emerald-600 text-white shadow-md scale-105'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    <Fraction num={f.num} den={f.den} />
                  </button>
                ))}
              </div>
            </div>

            {/* Βηματικη Αναλυση Μετατροπης */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              
              {/* Βημα 1 */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <span className="px-2.5 py-1 bg-sky-100 text-sky-900 text-xs font-black rounded-lg inline-block">
                  ΒΗΜΑ 1: Ο ΠΟΛΛΑΠΛΑΣΙΑΣΤΗΣ
                </span>
                <p className="text-xs sm:text-sm text-slate-600">
                  Ρωτάμε: Με ποιον αριθμό πολλαπλασιάζουμε το <strong>{currentFraction.den}</strong> για να γίνει 100;
                </p>
                <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono font-bold text-center text-indigo-900">
                  100 : {currentFraction.den} ＝ <span className="text-emerald-600 text-lg">{currentFraction.mult}</span>
                </div>
              </div>

              {/* Βημα 2 */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-lg inline-block">
                  ΒΗΜΑ 2: ΔΙΑΠΛΑΣΙΑΣΜΟΣ
                </span>
                <p className="text-xs sm:text-sm text-slate-600">
                  Πολλαπλασιάζουμε αριθμητή και παρονομαστή με το <strong>{currentFraction.mult}</strong>:
                </p>
                <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono font-bold text-center text-slate-800">
                  <Fraction num={`${currentFraction.num} · ${currentFraction.mult}`} den={`${currentFraction.den} · ${currentFraction.mult}`} />
                  <span className="mx-2">＝</span>
                  <Fraction num={equivalentNum} den="100" className="text-emerald-700 text-base" />
                </div>
              </div>

              {/* Βημα 3 */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-xs font-black rounded-lg inline-block">
                  ΒΗΜΑ 3: ΤΕΛΙΚΟ ΠΟΣΟΣΤΟ
                </span>
                <p className="text-xs sm:text-sm text-slate-600">
                  Γράφουμε τον αριθμητή συνοδευόμενο από το σύμβολο %:
                </p>
                <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 font-mono font-black text-center text-2xl text-emerald-700">
                  {percentFromFraction} %
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 5. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στα Ποσοστά!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε 10 απαιτητικές ασκήσεις μετατροπής κλασμάτων σε ποσοστά, αντιστοίχισης δεκαδικών αριθμών και επίλυσης προβλημάτων.
            </p>
          </div>

          <Link
            href="/st-dimotikou/50-pososta-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 Έναρξη Ασκήσεων</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
