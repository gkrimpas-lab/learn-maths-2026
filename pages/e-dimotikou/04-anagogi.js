// pages/e-dimotikou/04-anagogi.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function AnagogiTheoryPage() {
  // Το κλάσμα του ποσού που γνωρίζουμε (π.χ. τα 3/4)
  const [num, setNum] = useState(3);
  const [den, setDen] = useState(5);

  // Η γνωστή αξία αυτών των μερών (σε €)
  const [knownValue, setKnownValue] = useState(60);

  const MIN_NUM = 2;
  const MIN_DEN = 3;
  const MAX_DEN = 10;
  const MIN_VALUE = 10;
  const MAX_VALUE = 400;

  // 1ο Βήμα: Αξία της κλασματικής μονάδας ( 1/den ) -> Διαίρεση με τον αριθμητή
  const unitValue = knownValue / num;

  // 2ο Βήμα: Αξία του όλου ( den/den ) -> Πολλαπλασιασμός με τον παρονομαστή
  const totalValue = unitValue * den;

  // Μορφοποίηση αριθμών
  const formatVal = (val) =>
    val.toLocaleString('el-GR', {
      minimumFractionDigits: Number.isInteger(val) ? 0 : 2,
      maximumFractionDigits: 2
    });

  // Σχεδίαση ενιαίας Responsive SVG Ράβδου Μεριδίων
  const renderFractionBarSvg = () => {
    const totalWidth = 600;
    const barHeight = 64;
    const startX = 10;
    const startY = 30;
    const usableWidth = totalWidth - 2 * startX;
    const partWidth = usableWidth / den;

    const parts = [];
    for (let i = 0; i < den; i++) {
      const isKnown = i < num;
      const isUnit = i === 0;
      const x = startX + i * partWidth;

      let fillClass = 'fill-slate-100';
      if (isUnit) fillClass = 'fill-amber-500';
      else if (isKnown) fillClass = 'fill-sky-500';

      parts.push(
        <g key={`bar-part-${i}`}>
          <rect
            x={x}
            y={startY}
            width={partWidth}
            height={barHeight}
            className={`${fillClass} stroke-slate-800 stroke-[2] transition-colors duration-200`}
          />
          {/* Κείμενο κλασματικής μονάδας */}
          <text
            x={x + partWidth / 2}
            y={startY + 26}
            textAnchor="middle"
            className={`font-mono font-black text-xs ${
              isKnown ? 'fill-white' : 'fill-slate-600'
            }`}
          >
            1/{den}
          </text>
          {/* Κείμενο αξίας μεριδίου */}
          <text
            x={x + partWidth / 2}
            y={startY + 48}
            textAnchor="middle"
            className={`font-mono font-bold text-[11px] ${
              isKnown ? 'fill-white/90' : 'fill-slate-400'
            }`}
          >
            {formatVal(unitValue)} €
          </text>
        </g>
      );
    }

    return (
      <svg
        viewBox={`0 0 ${totalWidth} 130`}
        className="w-full h-auto drop-shadow-sm"
        aria-label="Οπτική αναπαράσταση αναγωγής στην κλασματική μονάδα"
      >
        {/* Σχεδίαση των επιμέρους μεριδίων */}
        {parts}

        {/* Αγκύλη / Ένδειξη Γνωστού Μέρους (Από κάτω) */}
        <path
          d={`M ${startX} ${startY + barHeight + 8} L ${startX + num * partWidth} ${
            startY + barHeight + 8
          }`}
          className="stroke-sky-600 stroke-[3] fill-none"
        />
        <text
          x={startX + (num * partWidth) / 2}
          y={startY + barHeight + 26}
          textAnchor="middle"
          className="fill-sky-900 font-bold text-xs"
        >
          Γνωστό: {num}/{den} ＝ {formatVal(knownValue)} €
        </text>

        {/* Ένδειξη για το Όλο */}
        <text
          x={totalWidth / 2}
          y={18}
          textAnchor="middle"
          className="fill-slate-600 font-black text-xs tracking-wider"
        >
          ΟΛΟΚΛΗΡΟ ΤΟ ΠΟΣΟ ({den}/{den}) ＝ {formatVal(totalValue)} €
        </text>
      </svg>
    );
  };

  return (
    <Layout
      title="Αναγωγή στην Κλασματική Μονάδα - Ε' Δημοτικού | LearnMaths.gr"
      description="Πλήρης θεωρία με παραδείγματα για την αναγωγή στην κλασματική μονάδα, εύρεση του όλου από γνωστό μέρος και διαδραστικό εργαστήριο για την Έ Δημοτικού."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/04-anagogi-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 Ασκήσεις</span>
        </Link>
      }
    >
      {/* Full-width container για 2K & 4K με πλήρη απόκριση σε κινητά */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 space-y-10 2xl:space-y-14 pb-24">
        
        {/* 1. HEADER BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>ΚΕΦΑΛΑΙΟ 4 • Ε' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Αναγωγή στην Κλασματική Μονάδα
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              Όταν γνωρίζουμε την αξία για ένα μέρος ενός ποσού και ψάχνουμε το συνολικό ποσό (ή ένα άλλο μέρος του), η πιο δυνατή στρατηγική είναι να περάσουμε πρώτα από το <strong>1 μέρος (κλασματική μονάδα)</strong>!
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία &amp; Δυναμική Επίλυση Προβλήματος</span>
            </div>
            <Link
              href="/e-dimotikou/04-anagogi-ask"
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
              Η μέθοδος των δύο βημάτων και πώς λύνουμε προβλήματα με κλάσματα χωρίς να μπερδευόμαστε.
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
                  Τι είναι Κλασματική Μονάδα;
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  <strong>Κλασματική μονάδα</strong> ονομάζεται κάθε κλάσμα που έχει <strong>αριθμητή το 1</strong> (π.χ.{' '}
                  <span className="font-mono font-bold text-sky-600">1/2</span>,{' '}
                  <span className="font-mono font-bold text-sky-600">1/5</span>,{' '}
                  <span className="font-mono font-bold text-sky-600">1/8</span>).
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-3 text-xs sm:text-sm 2xl:text-base">
                  <p className="text-slate-700">
                    Εκφράζει <strong>ένα μόνο από τα ίσα μέρη</strong> στα οποία χωρίσαμε την αρχική ποσότητα.
                  </p>
                  <p className="text-slate-500 text-xs">
                    Αν γνωρίζουμε την αξία αυτού του ενός μέρους, μπορούμε πανεύκολα να υπολογίσουμε οποιοδήποτε άλλο ποσό με έναν απλό πολλαπλασιασμό!
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 <strong>Το Κλειδί:</strong> Η κλασματική μονάδα αποτελεί το «σκαλοπάτι» για τη λύση κάθε σύνθετου προβλήματος.
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Πρώτο Στάδιο</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Διαίρεση με τον Αριθμητή
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Όταν γνωρίζουμε πόσο αξίζουν τα <span className="font-mono font-bold">α/β</span> ενός ποσού, διαιρούμε τη γνωστή τιμή με τον αριθμητή <span className="font-mono font-bold">α</span> για να βρούμε το <span className="font-mono font-bold">1/β</span>.
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <p className="text-slate-700">
                    Αν τα <span className="font-mono font-bold text-sky-700">3/7</span> ενός οικοπέδου κοστίζουν <span className="font-mono font-bold text-slate-900">21.000 €</span>:
                  </p>
                  <div className="py-2 flex items-center justify-center font-mono font-black text-slate-900 text-sm sm:text-base bg-white p-2.5 rounded-xl border border-slate-300 shadow-inner">
                    <span>21.000 ： 3 ＝ 7.000 €</span>
                  </div>
                  <p className="text-slate-500 text-xs">
                    Άρα το 1/7 του οικοπέδου κοστίζει 7.000 €.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Διαιρούμε με τον <strong>αριθμητή</strong> γιατί η τιμή αντιστοιχεί σε τόσα ίσα κομμάτια όσα δηλώνει ο αριθμητής.
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Δεύτερο Στάδιο</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Πολλαπλασιασμός με τον Παρονομαστή
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Αφού βρούμε την αξία του 1 μέρους (<span className="font-mono font-bold">1/β</span>), πολλαπλασιάζουμε με τον παρονομαστή <span className="font-mono font-bold">β</span> για να βρούμε ολόκληρο το ποσό (<span className="font-mono font-bold">β/β ＝ 1</span>).
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <p className="text-slate-700">
                    Συνέχεια παραδείγματος: Αν το 1/7 κοστίζει 7.000 €:
                  </p>
                  <div className="py-2 flex items-center justify-center font-mono font-black text-slate-900 text-sm sm:text-base bg-white p-2.5 rounded-xl border border-slate-300 shadow-inner">
                    <span>7.000 · 7 ＝ 49.000 €</span>
                  </div>
                  <p className="text-slate-500 text-xs">
                    Ολόκληρο το οικόπεδο (τα 7/7) κοστίζει 49.000 €.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Πολλαπλασιάζουμε με τον <strong>παρονομαστή</strong> γιατί η ακέραιη μονάδα αποτελείται από τόσα ίσα μέρη.
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Παραλλαγή</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Από το Μέρος στο... Άλλο Μέρος!
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Πολλές φορές δεν μας ζητείται το όλο, αλλά ένα <strong>διαφορετικό μέρος</strong>. Η μέθοδος παραμένει ακριβώς η ίδια!
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <p className="text-slate-700">
                    Αν τα 2/5 μιας διαδρομής είναι 18 km, πόσο είναι τα 4/5;
                  </p>
                  <ol className="list-decimal list-inside space-y-1 font-mono text-slate-800">
                    <li>1/5 ＝ 18 ： 2 ＝ 9 km</li>
                    <li>4/5 ＝ 9 · 4 ＝ 36 km</li>
                  </ol>
                  <p className="text-slate-500 text-xs">
                    Πρώτα στο 1 μέρος (διαίρεση) και μετά στα ζητούμενα μέρη (πολλαπλασιασμός).
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 <strong>Σύνοψη Κανόνα:</strong> Γνωστή Τιμή ： Αριθμητή · Ζητούμενα Μέρη.
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΑΝΑΓΩΓΗΣ ΣΤΗ ΜΟΝΑΔΑ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Πειραματικός Υπολογιστής Αναγωγής στη Μονάδα
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Όρισε πόσα μέρη γνωρίζεις, σε πόσα μέρη χωρίστηκε το ποσό και την τιμή τους. Παρακολούθησε βήμα-βήμα την αυτόματη επίλυση στο διάγραμμα.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            {/* Αριστερή Στήλη: Χειριστήρια με Touch Steppers */}
            <div className="xl:col-span-5 2xl:col-span-4 space-y-6 bg-slate-50 p-6 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200">
              <h4 className="text-xs 2xl:text-sm font-black tracking-wider text-slate-500">
                ΔΕΔΟΜΕΝΑ ΠΡΟΒΛΗΜΑΤΟΣ
              </h4>

              {/* Stepper Αριθμητή (Γνωστά Μέρη) */}
              <div className="space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">
                    Γνωστά μέρη (Αριθμητής):
                  </span>
                  <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-lg 2xl:text-xl text-sky-600 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-200">
                    {num}
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Μείωση γνωστού αριθμητή κατά 1"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setNum((prev) => Math.max(MIN_NUM, prev - 1));
                    }}
                    disabled={num <= MIN_NUM}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>

                  <input
                    type="range"
                    min={MIN_NUM}
                    max={den - 1}
                    step={1}
                    value={num}
                    onChange={(e) => setNum(Number(e.target.value))}
                    aria-label="Γνωστά μέρη"
                    className="w-full min-w-0 max-w-full accent-sky-600 cursor-pointer"
                  />

                  <button
                    type="button"
                    aria-label="Αύξηση γνωστού αριθμητή κατά 1"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setNum((prev) => Math.min(den - 1, prev + 1));
                    }}
                    disabled={num >= den - 1}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Stepper Παρονομαστή (Συνολικά Ίσα Μέρη) */}
              <div className="space-y-2 pt-3 border-t border-slate-200">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">
                    Συνολικά μέρη (Παρονομαστής):
                  </span>
                  <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-lg 2xl:text-xl text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200">
                    {den}
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Μείωση παρονομαστή κατά 1"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const nextDen = Math.max(MIN_DEN, den - 1);
                      setDen(nextDen);
                      if (num >= nextDen) setNum(nextDen - 1);
                    }}
                    disabled={den <= MIN_DEN}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>

                  <input
                    type="range"
                    min={MIN_DEN}
                    max={MAX_DEN}
                    step={1}
                    value={den}
                    onChange={(e) => {
                      const nextDen = Number(e.target.value);
                      setDen(nextDen);
                      if (num >= nextDen) setNum(nextDen - 1);
                    }}
                    aria-label="Συνολικά μέρη"
                    className="w-full min-w-0 max-w-full accent-indigo-600 cursor-pointer"
                  />

                  <button
                    type="button"
                    aria-label="Αύξηση παρονομαστή κατά 1"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDen((prev) => Math.min(MAX_DEN, prev + 1));
                    }}
                    disabled={den >= MAX_DEN}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Stepper Γνωστής Αξίας σε € */}
              <div className="space-y-2 pt-3 border-t border-slate-200">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">
                    Γνωστή Αξία των {num}/{den}:
                  </span>
                  <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-lg 2xl:text-xl text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                    {knownValue} €
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Μείωση αξίας κατά 10"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setKnownValue((prev) => Math.max(MIN_VALUE, prev - 10));
                    }}
                    disabled={knownValue <= MIN_VALUE}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>

                  <input
                    type="range"
                    min={MIN_VALUE}
                    max={MAX_VALUE}
                    step={5}
                    value={knownValue}
                    onChange={(e) => setKnownValue(Number(e.target.value))}
                    aria-label="Γνωστή Αξία"
                    className="w-full min-w-0 max-w-full accent-emerald-500 cursor-pointer"
                  />

                  <button
                    type="button"
                    aria-label="Αύξηση αξίας κατά 10"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setKnownValue((prev) => Math.min(MAX_VALUE, prev + 10));
                    }}
                    disabled={knownValue >= MAX_VALUE}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>

                {/* Γρήγορα βοηθητικά κουμπιά */}
                <div className="flex items-center justify-end gap-1.5 pt-1">
                  {[20, 50, 100, 150, 200].map((val) => (
                    <button
                      key={`btn-val-${val}`}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setKnownValue(val);
                      }}
                      className={`text-xs 2xl:text-sm px-2 py-1 rounded-lg font-semibold transition ${
                        knownValue === val
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200/80 hover:bg-slate-300 text-slate-700'
                      }`}
                    >
                      {val}€
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Δεξιά Στήλη: SVG Ράβδος & Βήματα Επίλυσης */}
            <div className="xl:col-span-7 2xl:col-span-8 bg-slate-50 p-6 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 space-y-6">
              <div className="flex items-center justify-between text-xs sm:text-sm 2xl:text-base font-bold text-slate-500 px-1">
                <span>ΟΠΤΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ ΜΕΡΙΔΙΩΝ</span>
                <span className="font-mono text-indigo-600">
                  {num}/{den} ＝ {formatVal(knownValue)} €
                </span>
              </div>

              {/* Ενιαίο Responsive SVG Canvas */}
              <div className="w-full bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
                {renderFractionBarSvg()}
              </div>

              {/* Υπόμνημα Χρωμάτων */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs 2xl:text-sm">
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-amber-500"></span>
                  <span className="text-slate-700 font-semibold">1/den (Κλασματική Μονάδα)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-sky-500"></span>
                  <span className="text-slate-700 font-semibold">Γνωστά Μέρη ({num})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-slate-100 border border-slate-400"></span>
                  <span className="text-slate-600 font-medium">Υπόλοιπα Μέρη</span>
                </div>
              </div>

              {/* Τα 2 Βήματα Υπολογισμού */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Βήμα 1: Κλασματική Μονάδα */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <span className="text-xs font-black text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md tracking-wider">
                    ΒΗΜΑ 1ο • Η ΜΟΝΑΔΑ ( 1/{den} )
                  </span>
                  <p className="text-xs text-slate-600">
                    Διαιρούμε τη γνωστή τιμή με τον αριθμητή:
                  </p>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono font-black text-slate-900 text-sm sm:text-base text-center">
                    {knownValue} ： {num} ＝{' '}
                    <span className="text-amber-600">{formatVal(unitValue)} €</span>
                  </div>
                </div>

                {/* Βήμα 2: Το Όλο */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <span className="text-xs font-black text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-md tracking-wider">
                    ΒΗΜΑ 2ο • ΤΟ ΟΛΟ ( {den}/{den} )
                  </span>
                  <p className="text-xs text-slate-600">
                    Πολλαπλασιάζουμε το 1 μέρος με τον παρονομαστή:
                  </p>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono font-black text-slate-900 text-sm sm:text-base text-center">
                    {formatVal(unitValue)} · {den} ＝{' '}
                    <span className="text-indigo-600">{formatVal(totalValue)} €</span>
                  </div>
                </div>
              </div>

              {/* Τελικό Συμπέρασμα */}
              <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl text-center font-bold text-xs sm:text-sm 2xl:text-base shadow-sm">
                🎯 Ολόκληρο το ποσό ({den}/{den}) αξίζει ακριβώς{' '}
                <span className="text-amber-300 font-black text-lg 2xl:text-xl font-mono ml-1">
                  {formatVal(totalValue)} €
                </span>
                !
              </div>
            </div>
          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στην Αναγωγή στη Μονάδα!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Λύσε απαιτητικά προβλήματα με χρήματα, βάρη, μήκη και ποσότητες, υπολογίζοντας πρώτα την κλασματική μονάδα.
            </p>
          </div>

          <Link
            href="/e-dimotikou/04-anagogi-ask"
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
