// pages/e-dimotikou/05-pollaplasia.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function PollaplasiaTheoryPage() {
  // Ο αριθμός βάσης για τον οποίο ψάχνουμε τα πολλαπλάσια
  const [baseNum, setBaseNum] = useState(4);
  const [showCount, setShowCount] = useState(12);

  const MIN_BASE = 2;
  const MAX_BASE = 20;

  // Δημιουργία πίνακα πολλαπλασιαστών από 0 έως showCount - 1
  const multipliers = Array.from({ length: showCount }, (_, i) => i);

  // Σχεδίαση Responsive SVG Αριθμητικής Γραμμής Αλμάτων
  const renderNumberLineSvg = () => {
    const totalWidth = 960;
    const height = 140;
    const startX = 40;
    const endX = 920;
    const stepsCount = Math.min(8, showCount - 1);
    const stepDist = (endX - startX) / stepsCount;
    const lineY = 100;

    const ticksAndArcs = [];

    for (let i = 0; i <= stepsCount; i++) {
      const currentVal = baseNum * i;
      const x = startX + i * stepDist;

      // Σημάδι άξονα
      ticksAndArcs.push(
        <g key={`tick-${i}`}>
          <circle cx={x} cy={lineY} r="5" className="fill-blue-600" />
          <text
            x={x}
            y={lineY + 24}
            textAnchor="middle"
            className="font-mono font-black text-xs sm:text-sm fill-slate-800"
          >
            {currentVal}
          </text>
        </g>
      );

      // Καμπύλη άλματος πολλαπλασιασμού
      if (i < stepsCount) {
        const nextX = startX + (i + 1) * stepDist;
        const midX = (x + nextX) / 2;
        const arcY = lineY - 48;
        const pathData = `M ${x} ${lineY - 4} Q ${midX} ${arcY} ${nextX} ${lineY - 4}`;

        ticksAndArcs.push(
          <g key={`arc-${i}`}>
            <path
              d={pathData}
              fill="none"
              className="stroke-amber-500 stroke-[2.5] stroke-dasharray-none"
            />
            <text
              x={midX}
              y={arcY + 6}
              textAnchor="middle"
              className="font-mono font-bold text-[11px] fill-amber-700"
            >
              ＋{baseNum}
            </text>
          </g>
        );
      }
    }

    return (
      <svg
        viewBox={`0 0 ${totalWidth} ${height}`}
        className="w-full h-auto drop-shadow-sm"
        aria-label={`Αριθμητική γραμμή αλμάτων για τα πολλαπλάσια του ${baseNum}`}
      >
        {/* Κύρια γραμμή άξονα */}
        <line
          x1={startX - 15}
          y1={lineY}
          x2={endX + 15}
          y2={lineY}
          className="stroke-slate-400 stroke-2"
        />
        {/* Βέλος δεξιά */}
        <polygon
          points={`${endX + 22},${lineY} ${endX + 12},${lineY - 5} ${endX + 12},${lineY + 5}`}
          className="fill-slate-500"
        />
        {ticksAndArcs}
      </svg>
    );
  };

  return (
    <Layout
      title="Πολλαπλάσια ενός Αριθμού - Ε' Δημοτικού | LearnMaths.gr"
      description="Πλήρης θεωρία με παραδείγματα, συμβολισμό συνόλου Π(α), αριθμητική γραμμή αλμάτων και διαδραστική γεννήτρια πολλαπλασίων για την Ε' Δημοτικού."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/05-pollaplasia-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 Ασκήσεις</span>
        </Link>
      }
    >
      {/* Container πλήρους εύρους για 2K & 4K και responsive σε κινητά */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 space-y-10 2xl:space-y-14 pb-24">
        
        {/* 1. HEADER BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>ΚΕΦΑΛΑΙΟ 5 • Ε' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Πολλαπλάσια ενός Αριθμού
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              Ανακαλύπτουμε τι είναι τα πολλαπλάσια, πώς παράγονται με διαδοχικά άλματα, τον ειδικό ρόλο του μηδενός και τον τρόπο γραφής του συνόλου των πολλαπλασίων.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία &amp; Διαδραστική Γεννήτρια</span>
            </div>
            <Link
              href="/e-dimotikou/05-pollaplasia-ask"
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
              Βασικές Έννοιες σε 4 Βήματα
            </h2>
            <p className="text-slate-600 text-sm sm:text-base 2xl:text-xl mt-1">
              Όλα όσα πρέπει να γνωρίζεις για τα πολλαπλάσια των φυσικών αριθμών.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 gap-6 2xl:gap-8">
            {/* Βήμα 1ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-sky-100 text-sky-800 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 1
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Ορισμός</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Τι είναι Πολλαπλάσιο;
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  <strong>Πολλαπλάσιο</strong> ενός φυσικού αριθμού ονομάζεται κάθε αριθμός που προκύπτει όταν πολλαπλασιάσουμε τον αριθμό αυτόν με οποιονδήποτε φυσικό αριθμό (0, 1, 2, 3, 4, ...).
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono">
                  <div>• 4 · 0 ＝ <strong className="text-blue-600">0</strong></div>
                  <div>• 4 · 1 ＝ <strong className="text-blue-600">4</strong></div>
                  <div>• 4 · 2 ＝ <strong className="text-blue-600">8</strong></div>
                  <div>• 4 · 3 ＝ <strong className="text-blue-600">12</strong></div>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Κάθε αριθμός έχει <strong>άπειρα πολλαπλάσια</strong>, επειδή οι φυσικοί αριθμοί δεν τελειώνουν ποτέ!
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Ιδιότητες</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Οι 2 Χρυσοί Κανόνες
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Υπάρχουν δύο σταθερές ιδιότητες που ισχύουν για τα πολλαπλάσια οποιουδήποτε αριθμού:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-3 text-xs sm:text-sm 2xl:text-base">
                  <div className="flex items-start gap-2">
                    <span className="font-black text-amber-600 shrink-0">1.</span>
                    <div>
                      Το <strong>0</strong> είναι πολλαπλάσιο <strong>όλων</strong> των αριθμών (αφού α · 0 ＝ 0).
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-black text-amber-600 shrink-0">2.</span>
                    <div>
                      Κάθε αριθμός είναι <strong>πολλαπλάσιο του εαυτού του</strong> (αφού α · 1 ＝ α).
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Μετά το 0, το <strong>μικρότερο μηδενικό πολλαπλάσιο</strong> ενός αριθμού είναι πάντα ο ίδιος ο αριθμός!
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Συμβολισμός</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Πώς Γράφονται: Π(α)
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Στα μαθηματικά συμβολίζουμε το σύνολο των πολλαλασίων ενός αριθμού με το κεφαλαίο γράμμα <strong>Π</strong> και τον αριθμό σε παρένθεση.
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <p className="text-slate-700 font-semibold">Παράδειγμα για το 6:</p>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-mono text-xs sm:text-sm text-indigo-950 shadow-inner">
                    Π(6) ＝ {'{'} 0, 6, 12, 18, 24, 30, ... {'}'}
                  </div>
                  <p className="text-slate-500 text-xs">
                    Τα αποσιωπητικά (...) μέσα στα άγκιστρα δηλώνουν ότι η σειρά συνεχίζεται επ' άπειρον.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Κάθε επόμενο πολλαπλάσιο προκύπτει προσθέτοντας σταθερά τον αριθμό βάσης (βήμα ＋α).
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Έλεγχος</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Έλεγχος με Τέλεια Διαίρεση
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Για να ελέγξουμε αν ένας μεγάλος αριθμός είναι πολλαπλάσιο ενός άλλου, εκτελούμε <strong>διαίρεση</strong>:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <p className="text-slate-700">
                    Είναι το <strong>84</strong> πολλαπλάσιο του <strong>7</strong>;
                  </p>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-mono font-bold text-center text-emerald-800 shadow-inner">
                    84 ： 7 ＝ 12 (Υπόλοιπο 0)
                  </div>
                  <p className="text-slate-600 text-xs">
                    Επειδή η διαίρεση είναι τέλεια (υπόλοιπο 0), το 84 <strong>είναι</strong> πολλαπλάσιο του 7.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🔍 Αν η διαίρεση αφήνει υπόλοιπο μεγαλύτερο του 0, ο αριθμός <strong>δεν</strong> είναι πολλαπλάσιο.
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΠΟΛΛΑΠΛΑΣΙΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Γεννήτρια &amp; Άξονας Αλμάτων Πολλαπλασίων
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Επίλεξε τον αριθμό βάσης και δες πώς γεννιούνται τα πολλαπλάσιά του στον άξονα και στον αναλυτικό πίνακα.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            {/* Αριστερή Στήλη: Χειριστήρια με Touch Steppers */}
            <div className="xl:col-span-5 2xl:col-span-4 space-y-6 bg-slate-50 p-6 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200">
              <h4 className="text-xs 2xl:text-sm font-black tracking-wider text-slate-500">
                ΕΠΙΛΟΓΗ ΑΡΙΘΜΟΥ
              </h4>

              {/* Stepper Αριθμού Βάσης */}
              <div className="space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">Αριθμός Βάσης:</span>
                  <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-lg 2xl:text-xl text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                    {baseNum}
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Μείωση αριθμού βάσης κατά 1"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setBaseNum((prev) => Math.max(MIN_BASE, prev - 1));
                    }}
                    disabled={baseNum <= MIN_BASE}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>

                  <input
                    type="range"
                    min={MIN_BASE}
                    max={MAX_BASE}
                    step={1}
                    value={baseNum}
                    onChange={(e) => setBaseNum(Number(e.target.value))}
                    aria-label="Αριθμός Βάσης"
                    className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                  />

                  <button
                    type="button"
                    aria-label="Αύξηση αριθμού βάσης κατά 1"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setBaseNum((prev) => Math.min(MAX_BASE, prev + 1));
                    }}
                    disabled={baseNum >= MAX_BASE}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>

                {/* Γρήγορα κουμπιά συνήθων αριθμών */}
                <div className="flex flex-wrap items-center justify-end gap-1.5 pt-1">
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10, 12].map((val) => (
                    <button
                      key={`btn-quick-${val}`}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setBaseNum(val);
                      }}
                      className={`text-xs 2xl:text-sm px-2.5 py-1 rounded-lg font-semibold transition ${
                        baseNum === val
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-200/80 hover:bg-slate-300 text-slate-700'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Πλήθος Πολλαπλασίων για Προβολή */}
              <div className="space-y-2 pt-3 border-t border-slate-200">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">Πλήθος στον Πίνακα:</span>
                  <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-base 2xl:text-lg text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200">
                    {showCount} όροι
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {[6, 12, 18, 24].map((cnt) => (
                    <button
                      key={`btn-cnt-${cnt}`}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowCount(cnt);
                      }}
                      className={`flex-1 py-1.5 rounded-xl font-bold text-xs 2xl:text-sm transition ${
                        showCount === cnt
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {cnt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Μαθηματικός Συμβολισμός Συνόλου */}
              <div className="p-4 2xl:p-5 bg-white rounded-2xl border border-slate-200 space-y-2 shadow-sm">
                <span className="text-xs font-black tracking-wider text-slate-400">
                  ΜΑΘΗΜΑΤΙΚΗ ΓΡΑΦΗ ΣΥΝΟΛΟΥ
                </span>
                <div className="p-3 bg-slate-900 text-emerald-400 rounded-xl font-mono text-xs sm:text-sm 2xl:text-base leading-relaxed break-words shadow-inner">
                  <span className="text-white font-bold">Π({baseNum}) ＝ </span>
                  <span>{'{ '}</span>
                  {multipliers.slice(0, 8).map((m, idx) => (
                    <span key={`set-${m}`}>
                      {baseNum * m}
                      {idx < 7 ? ', ' : ''}
                    </span>
                  ))}
                  <span className="text-slate-500 animate-pulse">, ... {'}'}</span>
                </div>
              </div>
            </div>

            {/* Δεξιά Στήλη: SVG Άξονας Αλμάτων & Πλέγμα Καρτών */}
            <div className="xl:col-span-7 2xl:col-span-8 bg-slate-50 p-6 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 space-y-6">
              <div className="flex items-center justify-between text-xs sm:text-sm 2xl:text-base font-bold text-slate-500 px-1">
                <span>ΑΡΙΘΜΗΤΙΚΗ ΓΡΑΜΜΗ ΑΛΜΑΤΩΝ ( ΒΗΜΑ ＋{baseNum} )</span>
                <span className="font-mono text-blue-600 font-bold">Π({baseNum})</span>
              </div>

              {/* SVG Canvas Άξονα */}
              <div className="w-full bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {renderNumberLineSvg()}
              </div>

              {/* Πλέγμα Καρτών Πολλαπλασιασμού */}
              <div className="space-y-3 pt-2">
                <div className="text-xs 2xl:text-sm font-bold text-slate-500 px-1">
                  ΑΝΑΛΥΤΙΚΟΣ ΠΙΝΑΚΑΣ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΥ
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-6 gap-3">
                  {multipliers.map((m) => {
                    const result = baseNum * m;
                    return (
                      <div
                        key={`card-${m}`}
                        className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center space-y-1.5 hover:border-blue-400 hover:shadow-md transition group"
                      >
                        <span className="text-xs font-bold text-slate-400 group-hover:text-blue-600 transition-colors font-mono">
                          {baseNum} · {m}
                        </span>
                        <div className="w-full h-[1px] bg-slate-100"></div>
                        <span className="text-xl 2xl:text-2xl font-mono font-black text-slate-800 group-hover:scale-105 transition-transform">
                          {result}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Callout Συμπεράσματος */}
              <div className="p-4 bg-emerald-600 text-white rounded-2xl text-center font-bold text-xs sm:text-sm 2xl:text-base shadow-sm">
                📢 Κάθε πολλαπλάσιο του <span className="text-amber-300 font-black">{baseNum}</span> διαιρείται ακριβώς με το {baseNum}, αφήνοντας υπόλοιπο 0!
              </div>
            </div>
          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στα Πολλαπλάσια!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις γνώσεις σου σε απαιτητικές ασκήσεις εύρεσης πολλαπλασίων, ελέγχου διαιρετότητας και προβλήματα πραγματικής ζωής.
            </p>
          </div>

          <Link
            href="/e-dimotikou/05-pollaplasia-ask"
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
