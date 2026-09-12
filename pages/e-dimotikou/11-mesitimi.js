// pages/e-dimotikou/11-mesitimi.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

const LIMITS = {
  VAL_MIN: 1,
  VAL_MAX: 12
};

export default function MesiTimiTheoryPage() {
  // Πλήθος ομάδων/στηλών (από 2 έως 6)
  const [count, setCount] = useState(4);

  // Αρχικές τιμές για έως και 6 ομάδες
  const [omades, setOmades] = useState([8, 4, 9, 3, 6, 7]);

  // Επιλογή των ενεργών τιμών
  const activeValues = omades.slice(0, count);

  // Υπολογισμοί
  const sum = activeValues.reduce((acc, curr) => acc + curr, 0);
  const avgNumeric = count > 0 ? sum / count : 0;
  const avgFormatted = avgNumeric.toLocaleString('el-GR', {
    minimumFractionDigits: Number.isInteger(avgNumeric) ? 0 : 2,
    maximumFractionDigits: 2
  });

  // Ενημέρωση τιμής
  const updateValue = (index, delta) => {
    setOmades((prev) => {
      const next = [...prev];
      next[index] = Math.max(LIMITS.VAL_MIN, Math.min(LIMITS.VAL_MAX, next[index] + delta));
      return next;
    });
  };

  const labels = ['Ομάδα Α', 'Ομάδα Β', 'Ομάδα Γ', 'Ομάδα Δ', 'Ομάδα Ε', 'Ομάδα ΣΤ'];
  const shortLabels = ['Ομ. Α', 'Ομ. Β', 'Ομ. Γ', 'Ομ. Δ', 'Ομ. Ε', 'Ομ. ΣΤ'];

  // Responsive SVG Ιστόγραμμα με Διακεκομμένη Γραμμή Μέσου Όρου
  const renderHistogramSvg = () => {
    const totalWidth = 720;
    const totalHeight = 280;
    const topPadding = 40;
    const bottomPadding = 50;
    const leftPadding = 45;
    const rightPadding = 25;

    const chartHeight = totalHeight - topPadding - bottomPadding;
    const chartWidth = totalWidth - leftPadding - rightPadding;

    const maxScale = 12;
    const barSpacing = chartWidth / count;
    const barWidth = Math.min(64, barSpacing * 0.65);

    // Ύψος μέσης τιμής
    const avgY = topPadding + chartHeight - (avgNumeric / maxScale) * chartHeight;

    return (
      <svg
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        className="w-full h-auto drop-shadow-sm"
        aria-label="Γραφική παράσταση μέσης τιμής και στηλών"
      >
        {/* Οριζόντιες γραμμές πλέγματος */}
        {[0, 3, 6, 9, 12].map((tick) => {
          const y = topPadding + chartHeight - (tick / maxScale) * chartHeight;
          return (
            <g key={`grid-line-${tick}`}>
              <line
                x1={leftPadding}
                y1={y}
                x2={totalWidth - rightPadding}
                y2={y}
                className="stroke-slate-200 stroke-1"
                strokeDasharray="4 4"
              />
              <text
                x={leftPadding - 10}
                y={y + 4}
                textAnchor="end"
                className="font-mono text-[11px] fill-slate-400 font-bold"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* Άξονας X */}
        <line
          x1={leftPadding}
          y1={topPadding + chartHeight}
          x2={totalWidth - rightPadding}
          y2={topPadding + chartHeight}
          className="stroke-slate-400 stroke-2"
        />

        {/* Στήλες (Bars) */}
        {activeValues.map((val, idx) => {
          const colHeight = (val / maxScale) * chartHeight;
          const xCenter = leftPadding + idx * barSpacing + barSpacing / 2;
          const x = xCenter - barWidth / 2;
          const y = topPadding + chartHeight - colHeight;

          return (
            <g key={`svg-bar-${idx}`}>
              {/* Στήλη */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={colHeight}
                rx="6"
                className="fill-sky-500 hover:fill-sky-600 transition-colors duration-200 stroke-slate-800 stroke-[1.5]"
              />
              {/* Τιμή πάνω από τη στήλη */}
              <text
                x={xCenter}
                y={y - 8}
                textAnchor="middle"
                className="font-mono font-black text-xs sm:text-sm fill-slate-800"
              >
                {val}
              </text>
              {/* Ετικέτα ομάδας κάτω από τον άξονα */}
              <text
                x={xCenter}
                y={topPadding + chartHeight + 22}
                textAnchor="middle"
                className="font-sans font-bold text-xs fill-slate-600"
              >
                {shortLabels[idx]}
              </text>
            </g>
          );
        })}

        {/* Διακεκομμένη Γραμμή Μέσης Τιμής */}
        <line
          x1={leftPadding}
          y1={avgY}
          x2={totalWidth - rightPadding}
          y2={avgY}
          className="stroke-rose-500 stroke-[3]"
          strokeDasharray="6 4"
        />

        {/* Badge Μέσης Τιμής στο δεξί άκρο */}
        <rect
          x={totalWidth - rightPadding - 110}
          y={avgY - 14}
          width="110"
          height="28"
          rx="6"
          className="fill-rose-500"
        />
        <text
          x={totalWidth - rightPadding - 55}
          y={avgY + 4}
          textAnchor="middle"
          className="fill-white font-mono font-black text-xs"
        >
          ΜΕΣΗ ΤΙΜΗ: {avgFormatted}
        </text>
      </svg>
    );
  };

  return (
    <Layout
      title="Μέση Τιμή (Μέσος Όρος) - Ε' Δημοτικού | LearnMaths.gr"
      description="Πλήρης θεωρία με παραδείγματα για τη Μέση Τιμή, τον τρόπο υπολογισμού, τις αντίστροφες πράξεις και διαδραστικό ιστόγραμμα για την Ε' Δημοτικού."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/11-mesitimi-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 Ασκήσεις</span>
        </Link>
      }
    >
      {/* Container πλήρους εύρους για 2K & 4K και responsive για κινητά */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 space-y-10 2xl:space-y-14 pb-24">
        
        {/* 1. HEADER BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>ΚΕΦΑΛΑΙΟ 11 • Ε' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Μέση Τιμή (Μέσος Όρος)
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              Μαθαίνουμε τι εκφράζει η μέση τιμή, πώς ισομοιράζει δίκαια άνισες ποσότητες, πώς υπολογίζεται με τη διαίρεση του αθροίσματος διά του πλήθους και πώς λύνουμε αντίστροφα προβλήματα.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία &amp; Ζωντανό Ιστόγραμμα Ισομοιρασιάς</span>
            </div>
            <Link
              href="/e-dimotikou/11-mesitimi-ask"
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
              Η μαθηματική προσέγγιση της ισοκατανομής και οι πρακτικές εφαρμογές της.
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
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Έννοια</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Τι είναι η Μέση Τιμή;
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  <strong>Μέση τιμή</strong> (ή μέσος όρος) είναι η μοναδική τιμή που θα είχε κάθε ποσότητα αν <strong>μοιράζαμε το συνολικό άθροισμα απολύτως δίκαια και ισότιμα</strong> σε όλες τις ομάδες.
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <p className="text-slate-700">
                    Αν τρία παιδιά έχουν 4, 9 και 5 μήλα αντίστοιχα:
                  </p>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-mono font-bold text-slate-900 shadow-inner text-center">
                    (4 ＋ 9 ＋ 5) ： 3 ＝ 18 ： 3 ＝ 6 μήλα
                  </div>
                  <p className="text-slate-500 text-xs">
                    Αν τα μάζευαν όλα μαζί και τα μοίραζαν ίσα, καθένας θα έπαιρνε ακριβώς 6 μήλα.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Η μέση τιμή εξομαλύνει τις διαφορές και εκπροσωπεί ολόκληρο το σύνολο δεδομένων με έναν μόνο αριθμό.
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Ο Μαθηματικός Τύπος</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Πώς Υπολογίζεται (2 Βήματα)
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Ο υπολογισμός της μέσης τιμής εκτελείται πάντα σε δύο διαδοχικές πράξεις:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2.5 text-xs sm:text-sm 2xl:text-base">
                  <div>
                    <strong className="text-blue-700">1ο Βήμα (Πρόσθεση):</strong> Προσθέτουμε όλες τις επιμέρους τιμές για να βρούμε το συνολικό άθροισμα.
                  </div>
                  <div>
                    <strong className="text-emerald-700">2ο Βήμα (Διαίρεση):</strong> Διαιρούμε το συνολικό άθροισμα με το πλήθος των τιμών.
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-mono font-bold text-center text-slate-900 shadow-inner">
                    Μέση Τιμή ＝ Άθροισμα Τιμών ： Πλήθος Τιμών
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Η μέση τιμή <strong>δεν είναι απαραίτητα ακέραιος</strong>! Πολύ συχνά είναι δεκαδικός αριθμός (π.χ. 7,4 βαθμοί).
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Αντίστροφο Πρόβλημα</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Εύρεση του Συνολικού Αθροίσματος
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Όταν γνωρίζουμε τη μέση τιμή και το πλήθος των ομάδων, βρίσκουμε το συνολικό άθροισμα με <strong>πολλαπλασιασμό</strong>:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-mono font-bold text-center text-indigo-950 shadow-inner">
                    Συνολικό Άθροισμα ＝ Μέση Τιμή · Πλήθος
                  </div>
                  <p className="text-slate-700 font-semibold pt-1">Παράδειγμα:</p>
                  <p className="text-slate-600 text-xs">
                    Αν 4 μαθητές έχουν μέσο όρο βαθμολογίας 18, τότε όλοι μαζί συγκέντρωσαν: 18 · 4 ＝ <strong>72 βαθμούς</strong>.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Αυτός ο κανόνας μάς επιτρέπει να βρίσκουμε μια άγνωστη τιμή αν γνωρίζουμε όλες τις υπόλοιπες και τον μέσο όρο.
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Ιδιότητες</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Τα Όρια της Μέσης Τιμής
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Η μέση τιμή βρίσκεται <strong>πάντα ανάμεσα</strong> στη μικρότερη και τη μεγαλύτερη τιμή των δεδομένων:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-mono font-bold text-center text-emerald-800 shadow-inner">
                    Ελάχιστη Τιμή ≤ Μέση Τιμή ≤ Μέγιστη Τιμή
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Αν οι βαθμοί σου είναι 15, 17 και 19, ο μέσος όρος είναι αδύνατον να βγει μικρότερος από 15 ή μεγαλύτερος από 19!
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🔍 <strong>Γρήγορος Έλεγχος:</strong> Αν υπολογίσεις μέση τιμή που είναι έξω από τα άκρα των δεδομένων, έχεις σίγουρα κάνει λάθος στην πράξη.
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΜΕΣΗΣ ΤΙΜΗΣ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
              </div>
              <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Ζωντανό Ιστόγραμμα &amp; Γραμμή Μέσου Όρου
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Επίλεξε το πλήθος των ομάδων (2 έως 6) και αυξομείωσε τις τιμές τους. Παρατήρησε πώς η διακεκομμένη γραμμή ισορροπεί δυναμικά ανάμεσα στις στήλες.
              </p>
            </div>

            {/* Επιλογέας Πλήθους Ομάδων */}
            <div className="inline-flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start sm:self-center">
              {[2, 3, 4, 5, 6].map((n) => (
                <button
                  key={`btn-count-${n}`}
                  type="button"
                  onClick={() => setCount(n)}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base font-bold transition ${
                    count === n
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {n} Ομάδες
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            {/* Αριστερή Στήλη: Χειριστήρια Ομάδων & Βήματα Υπολογισμού */}
            <div className="xl:col-span-5 2xl:col-span-4 space-y-6 bg-slate-50 p-6 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200">
              <h4 className="text-xs 2xl:text-sm font-black tracking-wider text-slate-500">
                ΤΙΜΕΣ ΟΜΑΔΩΝ
              </h4>

              {/* Πλέγμα Steppers για κάθε ενεργή ομάδα */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeValues.map((val, idx) => (
                  <div
                    key={`group-control-${idx}`}
                    className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2 shadow-sm"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                      <span>{labels[idx]}</span>
                      <span className="font-mono text-base font-black text-blue-600">{val}</span>
                    </div>
                    <div className="grid grid-cols-[32px_1fr_32px] items-center h-9 w-full gap-1.5">
                      <button
                        type="button"
                        aria-label={`Μείωση τιμής ${labels[idx]}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          updateValue(idx, -1);
                        }}
                        disabled={val <= LIMITS.VAL_MIN}
                        className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 text-sm"
                      >
                        －
                      </button>
                      <input
                        type="range"
                        min={LIMITS.VAL_MIN}
                        max={LIMITS.VAL_MAX}
                        value={val}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          setOmades((prev) => {
                            const next = [...prev];
                            next[idx] = v;
                            return next;
                          });
                        }}
                        aria-label={labels[idx]}
                        className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                      />
                      <button
                        type="button"
                        aria-label={`Αύξηση τιμής ${labels[idx]}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          updateValue(idx, 1);
                        }}
                        disabled={val >= LIMITS.VAL_MAX}
                        className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 text-sm"
                      >
                        ＋
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Αναλυτικά Βήματα Υπολογισμού */}
              <div className="p-4 2xl:p-5 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-sm">
                <span className="text-xs font-black tracking-wider text-slate-400">
                  ΜΑΘΗΜΑΤΙΚΟΣ ΥΠΟΛΟΓΙΣΜΟΣ
                </span>

                <div className="space-y-2 text-xs sm:text-sm font-mono">
                  <div className="p-2.5 bg-blue-50/70 rounded-xl border border-blue-200 space-y-1">
                    <span className="text-blue-900 font-sans font-bold text-[11px] uppercase tracking-wider block">
                      1ο Βήμα • Συνολικό Άθροισμα:
                    </span>
                    <div className="font-bold text-slate-900 text-sm">
                      {activeValues.join(' ＋ ')} ＝ <span className="text-blue-700 font-black">{sum}</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-1">
                    <span className="text-emerald-900 font-sans font-bold text-[11px] uppercase tracking-wider block">
                      2ο Βήμα • Διαίρεση με το Πλήθος ({count}):
                    </span>
                    <div className="font-bold text-slate-900 text-sm">
                      {sum} ： {count} ＝{' '}
                      <span className="text-emerald-700 font-black text-base">{avgFormatted}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Δεξιά Στήλη: Responsive SVG Ιστόγραμμα */}
            <div className="xl:col-span-7 2xl:col-span-8 bg-slate-50 p-6 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 space-y-6">
              <div className="flex items-center justify-between text-xs sm:text-sm 2xl:text-base font-bold text-slate-500 px-1">
                <span>ΓΡΑΦΙΚΗ ΙΣΟΡΡΟΠΙΑ ΣΤΗΛΩΝ (ΔΙΚΑΙΗ ΜΟΙΡΑΣΙΑ)</span>
                <span className="font-mono text-rose-600 font-bold">Μέσος Όρος: {avgFormatted}</span>
              </div>

              {/* SVG Canvas */}
              <div className="w-full bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {renderHistogramSvg()}
              </div>

              {/* Υπόμνημα */}
              <div className="flex flex-wrap items-center justify-center gap-5 text-xs 2xl:text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-sky-500"></span>
                  <span className="text-slate-700 font-semibold">Ποσότητα κάθε Ομάδας</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-0.5 border-t-2 border-dashed border-rose-500"></span>
                  <span className="text-rose-700 font-bold">Γραμμή Μέσης Τιμής ({avgFormatted})</span>
                </div>
              </div>

              {/* Callout Συμπεράσματος */}
              <div className="p-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 text-white rounded-2xl text-center font-bold text-xs sm:text-sm 2xl:text-base shadow-sm">
                📢 Αν κόβαμε τα μέρη που περισσεύουν πάνω από την κόκκινη γραμμή και τα βάζαμε στις χαμηλές στήλες, όλες οι ομάδες θα ισοϋψώνονταν ακριβώς στο <span className="text-amber-300 font-black text-lg font-mono ml-1">{avgFormatted}</span>!
              </div>
            </div>
          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στη Μέση Τιμή!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε απαιτητικές ασκήσεις υπολογισμού μέσου όρου, προβλήματα εύρεσης άγνωστης τιμής και σύνθετα σενάρια πραγματικής ζωής.
            </p>
          </div>

          <Link
            href="/e-dimotikou/11-mesitimi-ask"
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
