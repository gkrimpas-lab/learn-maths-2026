// pages/e-dimotikou/28-ennoia-ogkou.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

function formatGreekNumber(num) {
  return new Intl.NumberFormat('el-GR').format(num);
}

export default function EnnoiaOgkouTheoryPage() {
  // Διαστάσεις κουτιού
  const length = 5; // Μήκος
  const width = 4;  // Πλάτος
  const height = 3; // Ύψος

  const totalCubes = length * width * height; // 5 · 4 · 3 = 60 cm³

  // Slider τοποθέτησης κύβων από 0 έως 60
  const [cubesCount, setCubesCount] = useState(20);

  const isComplete = cubesCount === totalCubes;

  // Γεωμετρικές σταθερές για την ισομετρική προβολή
  const size = 24;
  const startX = 145;
  const startY = 175;

  const getIsoCoords = (x, y, z) => {
    const isoX = startX + (x * size * 0.866) - (y * size * 0.866);
    const isoY = startY + (x * size * 0.5) + (y * size * 0.5) - (z * size);
    return { x: isoX, y: isoY };
  };

  return (
    <Layout
      title="Η Έννοια του Όγκου - Ε' Δημοτικού | LearnMaths.gr"
      description="Μάθετε τι είναι ο όγκος, πώς μετράμε τον τρισδιάστατο χώρο με κυβικά εκατοστά (cm³), τον τύπο Μήκος επί Πλάτος επί Ύψος και δοκιμάστε το διαδραστικό 3D εργαστήριο."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/28-ennoia-ogkou-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 28 • Ε' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Η Έννοια του Όγκου
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              Ανακαλύπτουμε την τρίτη διάσταση στη γεωμετρία. Μαθαίνουμε τι είναι ο όγκος ενός στερεού σώματος, πώς γεμίζουμε ένα κουτί με μοναδιαίους κύβους (cm³), γιατί πολλαπλασιάζουμε τις τρεις διαστάσεις και πώς συνδέεται ο όγκος με τη χωρητικότητα σε λίτρα.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία &amp; Τρισδιάστατο Εργαστήριο Γεμίσματος Κύβων</span>
            </div>
            <Link
              href="/e-dimotikou/28-ennoia-ogkou-ask"
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
              Από την επίπεδη επιφάνεια (2 διαστάσεις) στον τρισδιάστατο χώρο και τον όγκο.
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
                  Τι είναι ο Όγκος;
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  <strong>Όγκος (V)</strong> ονομάζεται ο τρισδιάστατος χώρος που καταλαμβάνει ένα στερεό σώμα (π.χ. ένα κουτί, μια πέτρα, ένα κτήριο):
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div>• <strong>Περίμετρος:</strong> 1 διάσταση (μήκος γραμμής ➔ cm, m)</div>
                  <div>• <strong>Εμβαδόν:</strong> 2 διαστάσεις (επιφάνεια ➔ cm², m²)</div>
                  <div>• <strong>Όγκος:</strong> 3 διαστάσεις (χώρος ➔ cm³, m³)</div>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Οτιδήποτε μπορούμε να κρατήσουμε στα χέρια μας ή να γεμίσουμε έχει όγκο!
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Μονάδα</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Το Κυβικό Εκατοστό (cm³)
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Για να μετρήσουμε τον όγκο, χρησιμοποιούμε μικρούς κύβους:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono text-center">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-bold text-emerald-950 shadow-inner">
                    1 cm³ ＝ Κύβος με ακμή 1 cm
                  </div>
                  <p className="text-slate-600 text-xs font-sans text-left pt-1">
                    Αν ένα κουτί χωράει ακριβώς 60 τέτοιους μικρούς κύβους, λέμε ότι ο όγκος του είναι <strong>60 cm³</strong>.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                ⚡ Γράφεται <strong>cm³</strong> (με εκθέτη 3, επειδή πολλαπλασιάζουμε 3 διαστάσεις: μήκος, πλάτος και ύψος).
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Υπολογισμός</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Ο Μαθηματικός Τύπος
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Αντί να μετράμε έναν-έναν τους κύβους, υπολογίζουμε σε στρώσεις:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono text-center">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-bold text-amber-950 shadow-inner">
                    Όγκος ＝ Μήκος · Πλάτος · Ύψος
                  </div>
                  <p className="text-slate-600 text-xs font-sans text-left pt-1">
                    • 1 στρώση (βάση): 5 · 4 ＝ 20 κύβοι<br />
                    • 3 στρώσεις σε ύψος: 20 · 3 ＝ <strong>60 cm³</strong>
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                🎯 Στον κύβο όπου όλες οι ακμές είναι ίσες (α): <strong>V ＝ α · α · α</strong>.
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Χωρητικότητα</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Όγκος &amp; Λίτρα ( l )
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Όταν ο όγκος αφορά υγρά (νερό, γάλα, λάδι), χρησιμοποιούμε τη <strong>χωρητικότητα</strong>:
                </p>

                <div className="space-y-2 text-xs sm:text-sm 2xl:text-base font-mono text-center">
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-950 font-bold">
                    1 dm³ ＝ 1 Λίτρο ( l ) ＝ 1.000 cm³
                  </div>
                  <p className="text-slate-600 text-xs font-sans text-left pt-1">
                    Ένας κύβος με πλευρά 10 cm χωράει ακριβώς 1 λίτρο νερό (10 · 10 · 10 ＝ 1.000 cm³ ＝ 1 dm³)!
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 text-xs 2xl:text-sm text-purple-950 font-medium">
                🔍 1 κυβικό μέτρο (m³) ισοδυναμεί με 1.000 dm³, δηλαδή ακριβώς <strong>1.000 λίτρα</strong> νερό!
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΟΓΚΟΥ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Προσομοίωση Γεμίσματος Κουτιού με Κύβους ( 5 × 4 × 3 )
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Σύρε τον δρομέα για να γεμίσεις σταδιακά το κουτί με κυβάκια (1 cm³). Παρατήρησε πώς σχηματίζονται οι 3 στρώσεις των 20 κύβων μέχρι να φτάσουμε στους 60 κύβους.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Αριστερή Στήλη: Χειριστήρια & Μαθηματικός Τύπος */}
            <div className="lg:col-span-6 2xl:col-span-6 space-y-6 bg-slate-50 p-4 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200 flex flex-col justify-between">
              <div className="space-y-6">
                {/* Stepper Κύβων */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm 2xl:text-base font-bold text-slate-800">
                      Κυβάκια μέσα στο κουτί:
                    </span>
                    <span
                      className={`shrink-0 whitespace-nowrap font-mono font-black text-base sm:text-xl px-2.5 py-1 rounded-xl border shadow-xs bg-white ${
                        isComplete
                          ? 'text-emerald-600 border-emerald-300'
                          : 'text-blue-600 border-blue-200'
                      }`}
                    >
                      {cubesCount} / {totalCubes}
                    </span>
                  </div>

                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      type="button"
                      aria-label="Μείωση κατά 5 κύβους"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCubesCount((prev) => Math.max(0, prev - 5));
                      }}
                      disabled={cubesCount <= 0}
                      className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-xs text-base"
                    >
                      －
                    </button>

                    <input
                      type="range"
                      min="0"
                      max={totalCubes}
                      step="1"
                      value={cubesCount}
                      onChange={(e) => setCubesCount(Number(e.target.value))}
                      aria-label="Αριθμός κύβων μέσα στο κουτί"
                      className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                    />

                    <button
                      type="button"
                      aria-label="Αύξηση κατά 5 κύβους"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCubesCount((prev) => Math.min(totalCubes, prev + 5));
                      }}
                      disabled={cubesCount >= totalCubes}
                      className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-xs text-base"
                    >
                      ＋
                    </button>
                  </div>

                  {/* Γρήγορα κουμπιά κατάστασης */}
                  <div className="flex justify-center gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setCubesCount(0)}
                      className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition shadow-xs active:scale-95"
                    >
                      🔄 Άδειασμα (0)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCubesCount(totalCubes)}
                      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition shadow-xs active:scale-95 ${
                        isComplete
                          ? 'bg-emerald-600 text-white cursor-default'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      🎯 Γέμισμα Όλων ({totalCubes})
                    </button>
                  </div>
                </div>

                {/* Κάρτα Μαθηματικού Τύπου */}
                <div
                  className={`p-4 sm:p-5 rounded-2xl border space-y-2.5 shadow-xs text-center transition duration-200 ${
                    isComplete
                      ? 'bg-emerald-50 border-emerald-200'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                    ΜΑΘΗΜΑΤΙΚΟΣ ΥΠΟΛΟΓΙΣΜΟΣ ΟΓΚΟΥ
                  </span>
                  <div
                    className={`text-lg sm:text-xl font-black font-mono ${
                      isComplete ? 'text-emerald-700' : 'text-slate-800'
                    }`}
                  >
                    {isComplete
                      ? `Όγκος ＝ ${length} · ${width} · ${height} ＝ ${totalCubes} cm³`
                      : `Έχεις τοποθετήσει: ${cubesCount} κύβους (${cubesCount} cm³)`}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Αντί να μετράμε έναν-έναν τους κύβους, πολλαπλασιάζουμε τις 3 διαστάσεις:<br />
                    <strong>Μήκος ({length} cm) · Πλάτος ({width} cm) · Ύψος ({height} cm)</strong>
                  </p>
                </div>
              </div>

              {/* Επεξηγηματικό Callout Στρώσεων */}
              <div className="bg-blue-50 text-slate-900 p-4 rounded-2xl border border-blue-200 space-y-1.5 text-xs text-slate-700">
                <div className="font-black text-blue-900 flex items-center gap-1.5">
                  <span>💡</span> Πώς χτίζεται ο όγκος σε στρώσεις:
                </div>
                <div>• 1η στρώση (πάτος κουτιού): 5 · 4 ＝ <strong>20 κύβοι</strong></div>
                <div>• 2η στρώση: άλλοι 20 κύβοι (σύνολο <strong>40 κύβοι</strong>)</div>
                <div>• 3η στρώση (κορυφή): άλλοι 20 κύβοι (σύνολο <strong>60 κύβοι</strong>)</div>
              </div>
            </div>

            {/* Δεξιά Στήλη: Responsive SVG Τρισδιάστατος Καμβάς */}
            <div className="lg:col-span-6 2xl:col-span-6 bg-slate-50 p-6 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 flex flex-col items-center justify-between space-y-6">
              <div className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500 px-1">
                <span>ΤΡΙΣΔΙΑΣΤΑΤΗ ΑΝΑΠΑΡΑΣΤΑΣΗ ΣΤΕΡΕΟΥ</span>
                <span className="font-mono text-blue-600 font-bold">{length} × {width} × {height} κουτί</span>
              </div>

              {/* SVG 3D Canvas */}
              <div className="relative bg-white p-4 rounded-2xl border border-slate-200 shadow-inner flex items-center justify-center w-full max-w-[380px] h-[340px] overflow-hidden my-auto">
                <svg
                  width="360"
                  height="320"
                  viewBox="-40 -20 380 300"
                  className="overflow-visible"
                  shapeRendering="geometricPrecision"
                >
                  {/* Σχεδίαση των 60 κύβων */}
                  {[...Array(totalCubes)].map((_, i) => {
                    const z = Math.floor(i / (length * width));
                    const rem = i % (length * width);
                    const y = Math.floor(rem / length);
                    const x = rem % length;

                    const pt = getIsoCoords(x, y, z);
                    const isActive = i < cubesCount;

                    return (
                      <g
                        key={i}
                        className="transition-all duration-200"
                        opacity={isActive ? 1 : 0.04}
                      >
                        {/* Πάνω Έδρα (Top) */}
                        <path
                          d={`M ${pt.x} ${pt.y} L ${pt.x + size * 0.866} ${pt.y + size * 0.5} L ${pt.x} ${pt.y + size} L ${pt.x - size * 0.866} ${pt.y + size * 0.5} Z`}
                          fill="#60a5fa"
                          stroke="#2563eb"
                          strokeWidth="0.75"
                        />
                        {/* Αριστερή Έδρα (Left) */}
                        <path
                          d={`M ${pt.x - size * 0.866} ${pt.y + size * 0.5} L ${pt.x} ${pt.y + size} L ${pt.x} ${pt.y + size + size} L ${pt.x - size * 0.866} ${pt.y + size * 0.5 + size} Z`}
                          fill="#1d4ed8"
                          stroke="#1e40af"
                          strokeWidth="0.75"
                        />
                        {/* Δεξιά Έδρα (Right) */}
                        <path
                          d={`M ${pt.x} ${pt.y + size} L ${pt.x + size * 0.866} ${pt.y + size * 0.5} L ${pt.x + size * 0.866} ${pt.y + size * 0.5 + size} L ${pt.x} ${pt.y + size + size} Z`}
                          fill="#3b82f6"
                          stroke="#1d4ed8"
                          strokeWidth="0.75"
                        />

                        {/* Ένδειξη 1 cm³ στον 1ο κύβο */}
                        {i === 0 && isActive && (
                          <text
                            x={pt.x - 10}
                            y={pt.y + 20}
                            fill="#ffffff"
                            fontSize="7"
                            fontWeight="bold"
                            className="font-sans pointer-events-none"
                          >
                            1 cm³
                          </text>
                        )}
                      </g>
                    );
                  })}

                  {/* Διαφανές εξωτερικό περίγραμμα κουτιού */}
                  {(() => {
                    const p000 = getIsoCoords(0, 0, 0);
                    const pMax00 = getIsoCoords(length, 0, 0);
                    const p0Max0 = getIsoCoords(0, width, 0);
                    const pMaxMax0 = getIsoCoords(length, width, 0);
                    const p00Max = getIsoCoords(0, 0, height);
                    const pMax0Max = getIsoCoords(length, 0, height);
                    const p0MaxMax = getIsoCoords(0, width, height);
                    const pMaxMaxMax = getIsoCoords(length, width, height);

                    return (
                      <g
                        fill="none"
                        stroke="#94a3b8"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                        opacity="0.65"
                        className="pointer-events-none"
                      >
                        {/* Βάση */}
                        <path
                          d={`M ${p000.x} ${p000.y + size} L ${pMax00.x} ${pMax00.y + size} L ${pMaxMax0.x} ${pMaxMax0.y + size} L ${p0Max0.x} ${p0Max0.y + size} Z`}
                        />
                        {/* Οροφή */}
                        <path
                          d={`M ${p00Max.x} ${p00Max.y + size} L ${pMax0Max.x} ${pMax0Max.y + size} L ${pMaxMaxMax.x} ${pMaxMaxMax.y + size} L ${p0MaxMax.x} ${p0MaxMax.y + size} Z`}
                          fill="rgba(148,163,184,0.02)"
                        />
                        {/* Κατακόρυφες ακμές */}
                        <line x1={p000.x} y1={p000.y + size} x2={p00Max.x} y2={p00Max.y + size} />
                        <line x1={pMax00.x} y1={pMax00.y + size} x2={pMax0Max.x} y2={pMax0Max.y + size} />
                        <line x1={p0Max0.x} y1={p0Max0.y + size} x2={p0MaxMax.x} y2={p0MaxMax.y + size} />
                        <line x1={pMaxMax0.x} y1={pMaxMax0.y + size} x2={pMaxMaxMax.x} y2={pMaxMaxMax.y + size} />
                      </g>
                    );
                  })()}
                </svg>
              </div>

              {/* Ετικέτες Διαστάσεων - Χωρίς οριζόντια υπερχείλιση */}
              <div className="w-full flex flex-wrap justify-center gap-3 sm:gap-5 text-xs font-black text-slate-500 pt-3 border-t border-slate-200 text-center">
                <span className="text-blue-700 whitespace-nowrap">↔️ Μήκος: {length} cm</span>
                <span className="text-indigo-700 whitespace-nowrap">↗️ Πλάτος: {width} cm</span>
                <span className="text-sky-600 whitespace-nowrap">⬆️ Ύψος: {height} cm</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στον Όγκο!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε απαιτητικές ασκήσεις υπολογισμού όγκου ορθογωνίου παραλληλεπιπέδου, κύβου, χωρητικότητας σε λίτρα και προβλημάτων καθημερινής ζωής.
            </p>
          </div>

          <Link
            href="/e-dimotikou/28-ennoia-ogkou-ask"
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
