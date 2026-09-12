// pages/e-dimotikou/03-aplopoiisi.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function AplopoiisiTheoryPage() {
  // Αρχικό Κλάσμα
  const [num, setNum] = useState(8);
  const [den, setDen] = useState(12);

  // Τύπος οπτικοποίησης (Κυκλικοί Δίσκοι ή Ορθογώνιες Ράβδοι)
  const [viewType, setViewType] = useState('pie'); // 'pie' | 'bar'

  const MIN_NUM = 1;
  const MIN_DEN = 2;
  const MAX_DEN = 24;

  // Εύρεση Μέγιστου Κοινού Διαιρέτη (ΜΚΔ)
  const findGCD = (a, b) => {
    let x = Math.abs(a);
    let y = Math.abs(b);
    while (y) {
      const t = y;
      y = x % y;
      x = t;
    }
    return x;
  };

  const gcd = findGCD(num, den);
  const simpleNum = num / gcd;
  const simpleDen = den / gcd;
  const isSimplified = gcd > 1;

  // Σχεδίαση τομέων κυκλικού δίσκου (Responsive SVG)
  const renderPieSlices = (currentNum, currentDen, fillColor = 'fill-amber-500') => {
    const slices = [];
    const radius = 88;
    const cx = 100;
    const cy = 100;

    for (let i = 0; i < currentDen; i++) {
      const isFilled = i < currentNum;

      if (currentDen === 1) {
        return (
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            className={`${
              isFilled ? fillColor : 'fill-slate-100'
            } stroke-slate-800 stroke-[2.5] transition-colors duration-150`}
          />
        );
      }

      const startAngle = (i * 360) / currentDen - 90;
      const endAngle = ((i + 1) * 360) / currentDen - 90;
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1 = cx + radius * Math.cos(startRad);
      const y1 = cy + radius * Math.sin(startRad);
      const x2 = cx + radius * Math.cos(endRad);
      const y2 = cy + radius * Math.sin(endRad);

      const largeArc = 360 / currentDen > 180 ? 1 : 0;
      const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

      slices.push(
        <path
          key={`pie-${currentDen}-${i}`}
          d={pathData}
          className={`${
            isFilled ? fillColor : 'fill-slate-100'
          } stroke-slate-800 stroke-[2] transition-colors duration-150`}
        />
      );
    }
    return slices;
  };

  // Σχεδίαση ορθογώνιας ράβδου (Responsive SVG)
  const renderBarParts = (currentNum, currentDen, fillColor = 'fill-amber-500') => {
    const rects = [];
    const totalWidth = 260;
    const barHeight = 64;
    const startX = 20;
    const startY = 28;
    const partWidth = totalWidth / currentDen;

    for (let i = 0; i < currentDen; i++) {
      const isFilled = i < currentNum;
      const x = startX + i * partWidth;

      rects.push(
        <rect
          key={`bar-${currentDen}-${i}`}
          x={x}
          y={startY}
          width={partWidth}
          height={barHeight}
          className={`${
            isFilled ? fillColor : 'fill-slate-100'
          } stroke-slate-800 stroke-[2] transition-colors duration-150`}
        />
      );
    }
    return rects;
  };

  return (
    <Layout
      title="Απλοποίηση Κλάσματος - Έ Δημοτικού | LearnMaths.gr"
      description="Μάθετε πώς απλοποιούμε ένα κλάσμα διαιρώντας με τον ΜΚΔ, πότε ένα κλάσμα ονομάζεται ανάγωγο και πειραματιστείτε με το διαδραστικό εργαστήριο."
      backUrl="/e-dimotikou"
      backText="Έ Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/03-aplopoiisi-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 3 • Έ ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Απλοποίηση Κλάσματος &amp; Ανάγωγη Μορφή
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              Μαθαίνουμε πώς να μικραίνουμε τους όρους ενός κλάσματος διαιρώντας με κοινούς διαιρέτες, πώς φτάνουμε στο Ανάγωγο Κλάσμα με μία μόνο κίνηση χρησιμοποιώντας τον ΜΚΔ και γιατί η αξία του κλάσματος παραμένει αναλλοίωτη.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία &amp; Αυτόματη Ανάγωγη Οπτικοποίηση</span>
            </div>
            <Link
              href="/e-dimotikou/03-aplopoiisi-ask"
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
              Η μαθηματική λογική πίσω από την απλοποίηση και την ανάγωγη μορφή.
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
                  Τι είναι η Απλοποίηση;
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  <strong>Απλοποίηση</strong> ενός κλάσματος είναι η διαίρεση <strong>και των δύο όρων</strong> (αριθμητή και παρονομαστή) με τον ίδιο αριθμό (κοινό διαιρέτη τους, διάφορο του 0 και του 1).
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-3 text-xs sm:text-sm 2xl:text-base">
                  <p className="text-slate-700">
                    Με την απλοποίηση σχηματίζουμε ένα <strong>ισοδύναμο κλάσμα</strong> με μικρότερους όρους που είναι πολύ πιο εύχρηστο στους υπολογισμούς.
                  </p>
                  <div className="py-2 flex items-center justify-center font-mono">
                    <div className="inline-flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-slate-300 shadow-inner text-sm sm:text-base 2xl:text-lg">
                      <span className="flex flex-col items-center leading-none">
                        <span className="text-rose-600 font-bold">6 ： 2</span>
                        <span className="w-12 h-0.5 bg-slate-800 my-1"></span>
                        <span className="text-rose-600 font-bold">10 ： 2</span>
                      </span>
                      <span className="font-sans">＝</span>
                      <span className="flex flex-col items-center leading-none">
                        <span className="text-emerald-600 font-black">3</span>
                        <span className="w-8 h-0.5 bg-slate-800 my-1"></span>
                        <span className="text-emerald-600 font-black">5</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Παρόλο που οι αριθμοί μικραίνουν, η ποσότητα που εκφράζει το κλάσμα παραμένει απολύτως ίδια.
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Η Συντομότερη Οδός</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Ο Ρόλος του ΜΚΔ
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Αν διαιρέσουμε τους όρους με οποιονδήποτε κοινό διαιρέτη, το κλάσμα απλοποιείται, αλλά μπορεί να χρειαστεί και άλλη απλοποίηση.
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-3 text-xs sm:text-sm 2xl:text-base">
                  <p className="text-slate-700">
                    Αν διαιρέσουμε με τον <strong>Μέγιστο Κοινό Διαιρέτη (ΜΚΔ)</strong> των όρων, φτάνουμε στην τελική μορφή με <strong>μία μόνο πράξη</strong>!
                  </p>
                  <div className="p-3 bg-white rounded-xl border border-slate-300 font-mono text-xs sm:text-sm space-y-1">
                    <div>Για το <span className="font-bold text-slate-900">12/36</span>, ο ΜΚΔ(12, 36) ＝ <strong className="text-blue-600">12</strong>.</div>
                    <div className="font-bold text-emerald-700 pt-1">(12 ： 12) / (36 ： 12) ＝ 1/3</div>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ <strong>Κανόνας Χρυσού:</strong> Η διαίρεση με τον ΜΚΔ εξοικονομεί χρόνο και εκμηδενίζει τα λάθη στις πράξεις.
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Τελική Μορφή</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Τι είναι το Ανάγωγο Κλάσμα;
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  <strong>Ανάγωγο</strong> λέγεται το κλάσμα που <strong>δεν μπορεί να απλοποιηθεί άλλο</strong>. Αυτό συμβαίνει όταν ο αριθμητής και ο παρονομαστής έχουν μοναδικό κοινό διαιρέτη το 1.
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-3 text-xs sm:text-sm 2xl:text-base">
                  <p className="text-slate-700 font-semibold">Παραδείγματα ανάγωγων κλασμάτων:</p>
                  <div className="grid grid-cols-3 gap-2 font-mono font-bold text-center">
                    <span className="p-2 bg-white rounded-lg border border-slate-200 text-emerald-700">2/3</span>
                    <span className="p-2 bg-white rounded-lg border border-slate-200 text-emerald-700">5/7</span>
                    <span className="p-2 bg-white rounded-lg border border-slate-200 text-emerald-700">9/16</span>
                  </div>
                  <p className="text-slate-500 text-xs 2xl:text-sm">
                    Παρατηρήστε ότι οι αριθμοί 9 και 16 δεν είναι πρώτοι, αλλά είναι <strong>πρώτοι μεταξύ τους</strong> (ΜΚΔ ＝ 1).
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🎯 Στα μαθηματικά, κάθε τελικό αποτέλεσμα κλάσματος πρέπει να γράφεται <strong>πάντα στην ανάγωγη μορφή του</strong>!
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Στρατηγική</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Σταδιακή Απλοποίηση
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Αν δεν βλέπουμε αμέσως τον ΜΚΔ σε μεγάλους αριθμούς, εφαρμόζουμε τα <strong>κριτήρια διαιρετότητας</strong> σταδιακά (διαιρούμε με 2, 3, 5, 10).
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div className="font-mono bg-white p-3 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="text-slate-800">
                      <strong>60/84</strong> (άρτιοι, διά 2) ＝ <strong className="text-blue-600">30/42</strong>
                    </div>
                    <div className="text-slate-800">
                      <strong>30/42</strong> (άρτιοι, διά 2) ＝ <strong className="text-indigo-600">15/21</strong>
                    </div>
                    <div className="text-slate-800">
                      <strong>15/21</strong> (διαιρούνται με 3) ＝ <strong className="text-emerald-600">5/7</strong> (Ανάγωγο!)
                    </div>
                  </div>
                  <p className="text-slate-500 text-xs">
                    Και οι δύο μέθοδοι (σταδιακή και μέσω ΜΚΔ) οδηγούν ακριβώς στο ίδιο ανάγωγο κλάσμα.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 text-xs 2xl:text-sm text-purple-950 font-medium">
                🔍 <strong>Έλεγχος:</strong> Αν οι δύο όροι είναι άρτιοι, διαιρούνται σίγουρα τουλάχιστον με το 2.
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΑΠΛΟΠΟΙΗΣΗΣ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
              </div>
              <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Εξερεύνηση Απλοποίησης &amp; ΜΚΔ
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Όρισε ελεύθερα τους όρους του κλάσματος. Το εργαστήριο εντοπίζει αυτόματα τον ΜΚΔ, υπολογίζει την ανάγωγη μορφή και συγκρίνει τα σχήματα.
              </p>
            </div>

            {/* Toggle τύπου απεικόνισης */}
            <div className="inline-flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start sm:self-center">
              <button
                type="button"
                onClick={() => setViewType('pie')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base font-bold transition ${
                  viewType === 'pie'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🍕 Κυκλικοί Δίσκοι
              </button>
              <button
                type="button"
                onClick={() => setViewType('bar')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base font-bold transition ${
                  viewType === 'bar'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🍫 Ορθογώνιες Ράβδοι
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            {/* Αριστερή Στήλη: Χειριστήρια & Μαθηματική Εξίσωση */}
            <div className="xl:col-span-5 2xl:col-span-4 space-y-6 bg-slate-50 p-6 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200">
              <h4 className="text-xs 2xl:text-sm font-black tracking-wider text-slate-500">
                ΡΥΘΜΙΣΕΙΣ ΚΛΑΣΜΑΤΟΣ
              </h4>

              {/* Stepper Αριθμητή */}
              <div className="space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">Αριθμητής:</span>
                  <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-lg 2xl:text-xl text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                    {num}
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Μείωση αριθμητή κατά 1"
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
                    max={den}
                    step={1}
                    value={num}
                    onChange={(e) => setNum(Number(e.target.value))}
                    aria-label="Αριθμητής"
                    className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                  />

                  <button
                    type="button"
                    aria-label="Αύξηση αριθμητή κατά 1"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setNum((prev) => Math.min(den, prev + 1));
                    }}
                    disabled={num >= den}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Stepper Παρονομαστή */}
              <div className="space-y-2 pt-3 border-t border-slate-200">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">Παρονομαστής:</span>
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
                      if (num > nextDen) setNum(nextDen);
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
                      if (num > nextDen) setNum(nextDen);
                    }}
                    aria-label="Παρονομαστής"
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

              {/* Μαθηματική Εξίσωση & Ταυτότητα Απλοποίησης */}
              <div className="p-4 2xl:p-6 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs 2xl:text-sm font-bold text-slate-500 tracking-wider">
                    ΜΑΘΗΜΑΤΙΚΗ ΑΝΑΛΥΣΗ
                  </span>
                  <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                    ΜΚΔ({num}, {den}) ＝ {gcd}
                  </span>
                </div>

                {isSimplified ? (
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-center gap-3 font-mono">
                      <div className="flex flex-col items-center leading-none">
                        <span className="text-blue-600 font-black text-xl 2xl:text-2xl">{num}</span>
                        <span className="w-8 h-0.5 bg-slate-800 my-1"></span>
                        <span className="text-blue-600 font-black text-xl 2xl:text-2xl">{den}</span>
                      </div>

                      <span className="font-sans text-slate-400 text-lg">＝</span>

                      <div className="flex flex-col items-center leading-none text-amber-600 font-bold text-sm 2xl:text-base">
                        <span>{num} ： {gcd}</span>
                        <span className="w-14 h-0.5 bg-slate-800 my-1"></span>
                        <span>{den} ： {gcd}</span>
                      </div>

                      <span className="font-sans text-slate-400 text-lg">＝</span>

                      <div className="flex flex-col items-center leading-none">
                        <span className="text-emerald-600 font-black text-xl 2xl:text-2xl">{simpleNum}</span>
                        <span className="w-8 h-0.5 bg-slate-800 my-1"></span>
                        <span className="text-emerald-600 font-black text-xl 2xl:text-2xl">{simpleDen}</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs 2xl:text-sm font-medium text-center">
                      Το κλάσμα <span className="font-mono font-bold">{simpleNum}/{simpleDen}</span> είναι ανάγωγο!
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-center text-indigo-900 font-bold text-xs 2xl:text-sm">
                    ✨ Το κλάσμα {num}/{den} είναι ήδη Ανάγωγο!
                    <div className="text-[11px] font-normal text-indigo-700 mt-0.5">
                      Ο αριθμητής και ο παρονομαστής έχουν ΜΚΔ ＝ 1.
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Δεξιά Στήλη: Παράλληλη Οπτική Σύγκριση (Αρχικό vs Ανάγωγο) */}
            <div className="xl:col-span-7 2xl:col-span-8 bg-slate-50 p-6 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 flex flex-col items-center justify-center min-h-[380px] 2xl:min-h-[500px] space-y-6">
              <div className="w-full flex items-center justify-between text-xs sm:text-sm 2xl:text-base font-bold text-slate-500 px-2">
                <span>ΠΑΡΑΛΛΗΛΗ ΟΠΤΙΚΗ ΣΥΓΚΡΙΣΗ</span>
                <span className="font-mono text-emerald-600 font-bold">Ίδια ποσότητα</span>
              </div>

              {/* Πλέγμα 2 στηλών για τα δύο κλάσματα */}
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 place-items-center">
                {/* Κάρτα Αρχικού Κλάσματος */}
                <div className="w-full max-w-[280px] 2xl:max-w-[340px] bg-white p-5 2xl:p-7 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg text-xs 2xl:text-sm font-black tracking-wider">
                    ΑΡΧΙΚΟ ΚΛΑΣΜΑ
                  </div>

                  <div className="flex flex-col items-center leading-none font-mono font-black text-2xl 2xl:text-3xl text-blue-600">
                    <span>{num}</span>
                    <span className="w-10 h-0.5 bg-slate-800 my-1"></span>
                    <span>{den}</span>
                  </div>

                  {viewType === 'pie' ? (
                    <div className="w-full aspect-square max-w-[190px] 2xl:max-w-[240px]">
                      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-sm">
                        {renderPieSlices(num, den, 'fill-blue-500')}
                      </svg>
                    </div>
                  ) : (
                    <div className="w-full aspect-[300/120] max-w-[240px] 2xl:max-w-[280px]">
                      <svg viewBox="0 0 300 120" className="w-full h-full drop-shadow-sm">
                        {renderBarParts(num, den, 'fill-blue-500')}
                      </svg>
                    </div>
                  )}

                  <span className="text-xs 2xl:text-sm text-slate-500 font-medium">
                    {num} από τα {den} ίσα μέρη
                  </span>
                </div>

                {/* Κάρτα Ανάγωγου Κλάσματος */}
                <div className="w-full max-w-[280px] 2xl:max-w-[340px] bg-white p-5 2xl:p-7 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs 2xl:text-sm font-black tracking-wider">
                    ΑΝΑΓΩΓΟ ΚΛΑΣΜΑ
                  </div>

                  <div className="flex flex-col items-center leading-none font-mono font-black text-2xl 2xl:text-3xl text-emerald-600">
                    <span>{simpleNum}</span>
                    <span className="w-10 h-0.5 bg-slate-800 my-1"></span>
                    <span>{simpleDen}</span>
                  </div>

                  {viewType === 'pie' ? (
                    <div className="w-full aspect-square max-w-[190px] 2xl:max-w-[240px]">
                      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-sm">
                        {renderPieSlices(simpleNum, simpleDen, 'fill-emerald-500')}
                      </svg>
                    </div>
                  ) : (
                    <div className="w-full aspect-[300/120] max-w-[240px] 2xl:max-w-[280px]">
                      <svg viewBox="0 0 300 120" className="w-full h-full drop-shadow-sm">
                        {renderBarParts(simpleNum, simpleDen, 'fill-emerald-500')}
                      </svg>
                    </div>
                  )}

                  <span className="text-xs 2xl:text-sm text-slate-500 font-medium">
                    {simpleNum} από τα {simpleDen} ίσα μέρη
                  </span>
                </div>
              </div>

              {/* Επεξηγηματικό Callout Συμπεράσματος */}
              <div className="p-4 bg-emerald-600 text-white rounded-2xl text-center font-bold text-xs sm:text-sm 2xl:text-base shadow-sm max-w-xl">
                {isSimplified ? (
                  <span>
                    📢 Με τη διαίρεση των δύο όρων με το <span className="text-amber-300 font-black">{gcd}</span> (τον ΜΚΔ), ομαδοποιήσαμε τα μέρη χωρίς να αλλάξει η συνολική ποσότητα!
                  </span>
                ) : (
                  <span>
                    📢 Οι δύο πίτες είναι πανομοιότυπες επειδή το κλάσμα βρίσκεται ήδη στην απλούστερη δυνατή (ανάγωγη) μορφή του.
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στην Απλοποίηση!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε απαιτητικές ασκήσεις με εύρεση ΜΚΔ, πλήρη απλοποίηση σε ανάγωγο κλάσμα και εφαρμογή σε σύνθετα προβλήματα.
            </p>
          </div>

          <Link
            href="/e-dimotikou/03-aplopoiisi-ask"
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
