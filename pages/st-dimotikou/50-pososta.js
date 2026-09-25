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

// Μορφοποιηση αριθμου
function formatNum(val, decimals = 2) {
  if (Number.isInteger(val)) return String(val);
  const rounded = Number(val.toFixed(decimals));
  return String(rounded).replace('.', ',');
}

export default function PosostaTheoryPage() {
  // Εργαστηριο 1: Διαδραστικο Πλεγμα 100 Τετραγωνων (Step 1)
  const [gridValue, setGridValue] = useState(25); // 25%

  const decimalVal = useMemo(() => {
    return Number((gridValue / 100).toFixed(2));
  }, [gridValue]);

  // Εργαστηριο 2: Ισοδυναμια Κλασματος - Δεκαδικου - Ποσοστου
  const [customFraction, setCustomFraction] = useState({ num: 3, den: 4 }); // 3/4 = 75%

  const fractionPct = useMemo(() => {
    if (customFraction.den === 0) return 0;
    const raw = (customFraction.num / customFraction.den) * 100;
    return Number.isInteger(raw) ? raw : Number(raw.toFixed(1));
  }, [customFraction]);

  return (
    <Layout
      title="Ποσοστά: Έννοια & Μετατροπές - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μαθαίνουμε την έννοια των ποσοστών στα εκατό (%) και στα χίλια (‰), πώς μετατρέπουμε κλάσματα και δεκαδικούς σε ποσοστά με διαδραστικά εργαστήρια."
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
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 space-y-8 sm:space-y-10 2xl:space-y-14 pb-24 overflow-x-hidden">
        
        {/* 1. HEADER BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>ΚΕΦΑΛΑΙΟ 50 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Ποσοστά στα Εκατό (%) &amp; στα Χίλια (‰)
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-2xl leading-relaxed max-w-4xl">
              Ανακαλύπτουμε τη γλώσσα των ποσοστών: Πώς συγκρίνουμε μεγέθη με αναγωγή στο <strong>100</strong>, πώς μετατρέπουμε κλάσματα και δεκαδικούς αριθμούς σε ποσοστό στα εκατό (%) και πώς τα αξιοποιούμε στην καθημερινή ζωή.
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία, Οπτικοί Πίνακες &amp; Διαδραστικό Πλέγμα 100 Τετραγώνων</span>
            </div>
            <Link
              href="/st-dimotikou/50-pososta-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base"
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
              Η Έννοια του Ποσοστού σε 4 Βήματα
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Από την αναγωγή στα 100 ίσα μέρη στις τρεις ισοδύναμες μορφές έκφρασης.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 gap-5 sm:gap-6 2xl:gap-8">
            
            {/* Βημα 1ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 1
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Ορισμός</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Τι είναι το Ποσοστό;
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Ποσοστό στα εκατό (%) είναι ένας λόγος ή ένα κλάσμα με <strong>σταθερό παρονομαστή το 100</strong>:
                </p>

                <div className="bg-slate-50 p-2.5 sm:p-3.5 rounded-2xl border border-slate-200 text-center font-mono text-xs sm:text-sm">
                  <div className="p-1.5 bg-white rounded-xl border border-slate-200 font-bold text-slate-800">
                    25 % ＝ <Fraction num="25" den="100" /> ＝ 0,25
                  </div>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Δείχνει πόσα μέρη παίρνουμε αν χωρίσουμε το όλο σε 100 ίσα τμήματα.
              </div>
            </article>

            {/* Βημα 2ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Μετατροπή Κλάσματος</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Από Κλάσμα σε Ποσοστό
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Μετατρέπουμε το κλάσμα σε ισοδύναμο με παρονομαστή το 100 ή κάνουμε τη διαίρεση:
                </p>

                <div className="space-y-1.5 text-[11px] sm:text-xs font-mono">
                  <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-amber-950">
                    • 1/2 ＝ (1 · 50) / (2 · 50) ＝ 50/100 ＝ <strong>50 %</strong>
                  </div>
                  <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-amber-950">
                    • 3/4 ＝ (3 · 25) / (4 · 25) ＝ 75/100 ＝ <strong>75 %</strong>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Κάθε απλό κλάσμα έχει το δικό του αντίστοιχο ποσοστό!
              </div>
            </article>

            {/* Βημα 3ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Δεκαδικός</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Από Δεκαδικό σε Ποσοστό
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Πολλαπλασιάζουμε τον δεκαδικό αριθμό με το 100 (μετακίνηση υποδιαστολής 2 θέσεις δεξιά):
                </p>

                <div className="bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-200 font-mono text-xs space-y-1 text-center">
                  <div className="text-slate-800 font-bold">
                    0,45 · 100 ＝ <strong>45 %</strong>
                  </div>
                  <div className="text-slate-800 font-bold">
                    0,08 · 100 ＝ <strong>8 %</strong>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Αντίστροφα: 35% ➔ 35 : 100 ＝ 0,35.
              </div>
            </article>

            {/* Βημα 4ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Στα Χίλια (‰)</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Ποσοστό στα Χίλια (‰)
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Όταν έχουμε πολύ μικρές αναλογίες, χρησιμοποιούμε την αναγωγή στο <strong>1.000</strong>:
                </p>

                <div className="bg-slate-50 p-2.5 sm:p-3.5 rounded-2xl border border-slate-200 space-y-1.5 text-xs font-mono text-center">
                  <div className="p-1.5 bg-white rounded-xl border border-slate-200 text-slate-800 font-bold text-[11px] sm:text-xs">
                    5 ‰ ＝ <Fraction num="5" den="1000" /> ＝ 0,005
                  </div>
                  <p className="text-slate-600 text-[10.5px] font-sans">
                    Χρησιμοποιείται συχνά στην περιεκτικότητα αλατιού στη θάλασσα ή στους τόκους τραπεζών.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 10 ‰ ισούται ακριβώς με 1 %.
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΠΛΕΓΜΑ 100 ΤΕΤΡΑΓΩΝΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 sm:pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Δυναμικό Πλέγμα 100 Τετραγώνων (Οπτικοποίηση %)
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Σύρετε τον slider για να δείτε ακριβώς πόσα τετράγωνα από τα 100 χρωματίζονται και πώς συνδέεται το ποσοστό με το κλάσμα και τον δεκαδικό.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            {/* Χειριστηριο Slider */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-left">
                  <span className="text-[11px] sm:text-xs font-black uppercase text-slate-800 tracking-wider">
                    ΠΟΣΟΣΤΟ (%):
                  </span>
                  <span className="font-mono font-black text-base sm:text-lg text-blue-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {gridValue} %
                  </span>
                </div>
                <div className="grid grid-cols-[34px_1fr_34px] items-center h-10 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setGridValue((prev) => Math.max(0, prev - 1)); }}
                    disabled={gridValue <= 0}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={gridValue}
                    onChange={(e) => setGridValue(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setGridValue((prev) => Math.min(100, prev + 1)); }}
                    disabled={gridValue >= 100}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Γρηγορες Επιλογες */}
              <div className="grid grid-cols-4 gap-2">
                {[10, 25, 50, 75].map((preset) => (
                  <button
                    key={`grid-pre-${preset}`}
                    type="button"
                    onClick={() => setGridValue(preset)}
                    className="bg-white border border-slate-200 hover:bg-slate-100 py-1.5 rounded-xl font-bold text-xs text-slate-700 shadow-sm transition active:scale-95 text-center"
                  >
                    {preset} %
                  </button>
                ))}
              </div>

              {/* Ισοδυναμες μορφες */}
              <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-slate-500 font-sans block text-[10.5px]">Κλάσμα</span>
                  <strong className="text-blue-900 text-sm">{gridValue}/100</strong>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-slate-500 font-sans block text-[10.5px]">Δεκαδικός</span>
                  <strong className="text-emerald-700 text-sm">{formatNum(decimalVal, 2)}</strong>
                </div>
              </div>
            </div>

            {/* Πλεγμα 100 Τετραγωνων - Fluid & Responsive Χωρις Scroll */}
            <div className="lg:col-span-7 bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 flex flex-col items-center justify-center w-full">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 text-center">
                ΠΛΕΓΜΑ 10x10 (100 ΤΕΤΡΑΓΩΝΑ)
              </span>

              <div className="w-full max-w-[220px] sm:max-w-[260px] aspect-square bg-white p-2 rounded-2xl border-2 border-slate-300 shadow-sm">
                <div className="grid grid-cols-10 gap-0.5 sm:gap-1 w-full h-full">
                  {Array.from({ length: 100 }).map((_, idx) => {
                    const isFilled = idx < gridValue;
                    return (
                      <div
                        key={`cell-${idx}`}
                        className={`w-full h-full rounded-[2px] transition-colors duration-150 ${
                          isFilled ? 'bg-blue-600' : 'bg-slate-100'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              <span className="text-[11px] sm:text-xs text-slate-600 font-semibold mt-3 text-center">
                Χρωματισμένα: <strong className="font-mono text-blue-700">{gridValue}</strong> από τα 100 τετράγωνα (<strong>{gridValue} %</strong>)
              </span>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΙΣΟΔΥΝΑΜΙΑ ΚΛΑΣΜΑΤΩΝ ΚΑΙ ΠΟΣΟΣΤΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-5 sm:space-y-6">
          <div className="border-b border-slate-100 pb-3 sm:pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
              <span>⚡ ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΚΛΑΣΜΑΤΑ ΣΕ ΠΟΣΟΣΤΑ</span>
            </div>
            <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Βασικά Κλάσματα και τα Ποσοστά τους
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Επιλέξτε ένα γνωστό κλάσμα για να δείτε άμεσα την ισοδυναμία του σε δεκαδικό αριθμό και ποσοστό στα εκατό:
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {[
              { num: 1, den: 2, label: '1/2 (Μισό)', pct: 50, dec: '0,50' },
              { num: 1, den: 4, label: '1/4 (Τέταρτο)', pct: 25, dec: '0,25' },
              { num: 3, den: 4, label: '3/4 (Τρία τέταρτα)', pct: 75, dec: '0,75' },
              { num: 1, den: 5, label: '1/5 (Ένα πέμπτο)', pct: 20, dec: '0,20' }
            ].map((fItem, idx) => (
              <button
                key={`frac-btn-${idx}`}
                type="button"
                onClick={() => setCustomFraction({ num: fItem.num, den: fItem.den })}
                className={`p-3 rounded-2xl border text-center transition active:scale-95 flex flex-col items-center justify-center gap-1 ${
                  customFraction.num === fItem.num && customFraction.den === fItem.den
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-md'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                }`}
              >
                <span className="font-mono font-black text-sm sm:text-base">{fItem.num}/{fItem.den}</span>
                <span className="text-[10.5px] opacity-90 font-sans">{fItem.label}</span>
                <span className="text-xs sm:text-sm font-black font-mono pt-0.5">＝ {fItem.pct} %</span>
              </button>
            ))}
          </div>

          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-center text-xs sm:text-sm text-emerald-950 font-mono">
            Επιλεγμένο: <Fraction num={customFraction.num} den={customFraction.den} /> ＝ {formatNum(customFraction.num / customFraction.den, 2)} ＝ <strong>{fractionPct} %</strong>
          </div>
        </section>

        {/* 5. ΛΥΜΕΝΑ ΠΑΡΑΔΕΙΓΜΑΤΑ ΠΡΟΒΛΗΜΑΤΩΝ */}
        <section className="space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight">
              Λυμένα Προβλήματα με Ποσοστά
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Δύο χαρακτηριστικά παραδείγματα μετατροπής αναλογιών και υπολογισμού ποσοστών.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
            
            {/* Παραδειγμα 1 */}
            <article className="bg-white p-4 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 bg-blue-100 text-blue-900 text-[11px] sm:text-xs font-black rounded-lg">
                  ΠΡΟΒΛΗΜΑ 1: ΜΕΤΑΤΡΟΠΗ ΣΕ ΠΟΣΟΣΤΟ
                </span>
                <span className="text-xs font-bold text-slate-400">Σχολείο</span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-slate-900">
                Επίδοση Μαθητή σε Τεστ 20 Ερωτήσεων
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Σε ένα τεστ <strong>20 ερωτήσεων</strong>, ένας μαθητής απάντησε σωστά στις <strong>16 ερωτήσεις</strong>. Ποιο είναι το ποσοστό επιτυχίας (%) του μαθητή;
              </p>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-[11px] font-bold">Μέθοδος 1: Με ισοδύναμο κλάσμα</span>
                  <div><Fraction num="16" den="20" /> ＝ <Fraction num="16 · 5" den="20 · 5" /> ＝ <Fraction num="80" den="100" /> ＝ <strong className="text-emerald-700 text-sm sm:text-base">80 %</strong></div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-[11px] font-bold">Μέθοδος 2: Με διαίρεση και πολλαπλασιασμό</span>
                  <div>(16 : 20) · 100 ＝ 0,80 · 100 ＝ <strong className="text-emerald-700 text-sm sm:text-base">80 %</strong></div>
                </div>
              </div>

              <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-200 text-[11px] sm:text-xs text-blue-950 font-medium">
                ✓ Ο μαθητής πέτυχε ποσοστό επιτυχίας 80%.
              </div>
            </article>

            {/* Παραδειγμα 2 */}
            <article className="bg-white p-4 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs font-black rounded-lg">
                  ΠΡΟΒΛΗΜΑ 2: ΑΝΑΓΩΓΗ ΣΤΑ 100
                </span>
                <span className="text-xs font-bold text-slate-400">Διατροφή</span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-slate-900">
                Περιεκτικότητα Χυμού σε Φρούτα
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Σε ένα μπουκάλι χυμού <strong>250 ml</strong> περιέχονται <strong>150 ml</strong> φυσικού χυμού πορτοκαλιού. Ποιο είναι το ποσοστό (%) φυσικού χυμού;
              </p>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-[11px] font-bold">Υπολογισμός ποσοστού:</span>
                  <div>Κλάσμα ＝ <Fraction num="150" den="250" /> ＝ 150 : 250 ＝ 0,60</div>
                  <div>Ποσοστό ＝ 0,60 · 100 ＝ <strong className="text-amber-800 text-sm sm:text-base">60 %</strong></div>
                </div>
              </div>

              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] sm:text-xs text-amber-950 font-medium">
                ✓ Το μπουκάλι περιέχει 60% φυσικό χυμό πορτοκαλιού.
              </div>
            </article>

          </div>
        </section>

        {/* 6. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στα Ποσοστά!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε 10 απαιτητικές ασκήσεις μετατροπής κλασμάτων, δεκαδικών και ποσοστών στα εκατό (%) και στα χίλια (‰) για τη ΣΤ' Δημοτικού.
            </p>
          </div>

          <Link
            href="/st-dimotikou/50-pososta-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-sm sm:text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 Έναρξη Ασκήσεων</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
