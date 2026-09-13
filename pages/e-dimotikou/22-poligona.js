// pages/e-dimotikou/22-poligona.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function PoligonaTheoryPage() {
  // Αριθμός πλευρών/κορυφών (3 έως 8)
  const [sides, setSides] = useState(5); // Αρχική τιμή: Πεντάγωνο

  const polygonNames = {
    3: { title: 'Τρίγωνο', desc: 'Το απλούστερο πολύγωνο με 3 πλευρές, 3 γωνίες και 3 κορυφές.' },
    4: { title: 'Τετράπλευρο', desc: 'Πολύγωνο με 4 πλευρές, 4 γωνίες και 4 κορυφές.' },
    5: { title: 'Πεντάγωνο', desc: 'Πολύγωνο με 5 πλευρές, 5 γωνίες και 5 κορυφές.' },
    6: { title: 'Εξάγωνο', desc: 'Πολύγωνο με 6 πλευρές, 6 γωνίες και 6 κορυφές.' },
    7: { title: 'Επτάγωνο', desc: 'Πολύγωνο με 7 πλευρές, 7 γωνίες και 7 κορυφές.' },
    8: { title: 'Οκτάγωνο', desc: 'Πολύγωνο με 8 πλευρές, 8 γωνίες και 8 κορυφές.' }
  };

  // SVG Υπολογισμοί ανώμαλου πολυγώνου
  const cx = 240;
  const cy = 135;
  const radiusVariations = [1.1, 0.78, 1.18, 0.85, 1.12, 0.72, 1.05, 0.88];
  const baseRadius = 80;

  const pointsArray = [];
  for (let i = 0; i < sides; i++) {
    const angleRad = (i * 2 * Math.PI) / sides - Math.PI / 2;
    const currentRadius = baseRadius * radiusVariations[i];
    const x = Math.round(cx + currentRadius * Math.cos(angleRad));
    const y = Math.round(cy + currentRadius * Math.sin(angleRad));
    pointsArray.push({ x, y });
  }

  const pointsString = pointsArray.map((p) => `${p.x},${p.y}`).join(' ');
  const currentPolygon = polygonNames[sides];

  // Υπολογισμός διαγωνίων: d = n · (n - 3) : 2
  const diagonalsCount = (sides * (sides - 3)) / 2;

  return (
    <Layout
      title="Πολύγωνα - Ε' Δημοτικού | LearnMaths.gr"
      description="Μάθετε τι είναι τα πολύγωνα, την ονοματολογία τους (τρίγωνα, τετράπλευρα, πεντάγωνα κ.ά.), τη διαφορά κανονικών και ανώμαλων πολυγώνων και δοκιμάστε το διαδραστικό εργαστήριο."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/22-poligona-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 22 • Ε' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Τι είναι τα Πολύγωνα
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              Εξερευνούμε τα κλειστά γεωμετρικά σχήματα που οριοθετούνται από ευθύγραμμα τμήματα, τη θεμελιώδη ισότητα πλευρών, γωνιών και κορυφών, τη διαφορά κανονικών και ανώμαλων πολυγώνων, καθώς και τις διαγωνίους τους.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία &amp; Δυναμικός Καμβάς Πολυγώνων</span>
            </div>
            <Link
              href="/e-dimotikou/22-poligona-ask"
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
              Η ανατομία, η ταξινόμηση και οι ιδιότητες των πολυγώνων σχημάτων.
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
                  Ανατομία του Πολυγώνου
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  <strong>Πολύγωνο</strong> είναι κάθε επίπεδο, <strong>κλειστό</strong> γεωμετρικό σχήμα που περικλείεται αποκλειστικά από ευθύγραμμα τμήματα:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div>• <strong>Πλευρές:</strong> Τα ευθύγραμμα τμήματα που αποτελούν το περίγραμμά του.</div>
                  <div>• <strong>Κορυφές:</strong> Τα σημεία όπου συναντιούνται δύο διαδοχικές πλευρές.</div>
                  <div>• <strong>Εσωτερικές Γωνίες:</strong> Οι γωνίες που σχηματίζονται ανάμεσα στις πλευρές.</div>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 <strong>Χρυσός κανόνας:</strong> Σε κάθε πολύγωνο: <strong>Πλήθος Πλευρών ＝ Πλήθος Γωνιών ＝ Πλήθος Κορυφών</strong>!
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Ονοματολογία</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Ονομασία ανάλογα με τις Πλευρές
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Τα πολύγωνα παίρνουν το όνομά τους από τον αριθμό των γωνιών ή των πλευρών τους:
                </p>

                <div className="bg-slate-50 p-3.5 2xl:p-4 rounded-2xl border border-slate-200 space-y-1.5 text-xs sm:text-sm font-mono">
                  <div className="flex justify-between p-1 bg-white rounded-md border border-slate-200">
                    <span>3 πλευρές ➔ <strong>Τρίγωνο</strong></span>
                    <span className="text-slate-500">(απλούστερο)</span>
                  </div>
                  <div className="flex justify-between p-1 bg-white rounded-md border border-slate-200">
                    <span>4 πλευρές ➔ <strong>Τετράπλευρο</strong></span>
                  </div>
                  <div className="flex justify-between p-1 bg-white rounded-md border border-slate-200">
                    <span>5 πλευρές ➔ <strong>Πεντάγωνο</strong></span>
                  </div>
                  <div className="flex justify-between p-1 bg-white rounded-md border border-slate-200">
                    <span>6 πλευρές ➔ <strong>Εξάγωνο</strong></span>
                  </div>
                  <div className="flex justify-between p-1 bg-white rounded-md border border-slate-200">
                    <span>8 πλευρές ➔ <strong>Οκτάγωνο</strong></span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                ⚡ Δεν υπάρχει πολύγωνο με 2 πλευρές, γιατί 2 ευθύγραμμα τμήματα δεν μπορούν να κλείσουν μια περιοχή!
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Κατηγοριοποίηση</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Κανονικά &amp; Μη Κανονικά
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Ανάλογα με το αν οι πλευρές και οι γωνίες τους είναι ίσες μεταξύ τους:
                </p>

                <div className="space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950">
                    • <strong>Κανονικό πολύγωνο:</strong> Έχει <strong>όλες τις πλευρές ίσες</strong> ΚΑΙ <strong>όλες τις γωνίες ίσες</strong> (π.χ. ισόπλευρο τρίγωνο, τετράγωνο, κανονικό εξάγωνο).
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                    • <strong>Μη κανονικό (ανώμαλο):</strong> Έχει πλευρές ή γωνίες με διαφορετικά μεγέθη.
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                🎯 Ένα ορθογώνιο παραλληλόγραμμο <strong>δεν είναι κανονικό</strong>, παρότι έχει όλες τις γωνίες 90°, γιατί δεν έχει όλες τις πλευρές ίσες!
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Στοιχεία</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Διαγώνιοι &amp; Περίμετρος
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Δύο θεμελιώδη γεωμετρικά στοιχεία των πολυγώνων:
                </p>

                <div className="space-y-2 text-xs sm:text-sm 2xl:text-base font-mono">
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-950">
                    • <strong>Διαγώνιος:</strong> Το ευθύγραμμο τμήμα που ενώνει δύο <strong>μη διαδοχικές</strong> κορυφές (το τρίγωνο έχει 0 διαγωνίους).
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800">
                    • <strong>Περίμετρος (Π):</strong> Το άθροισμα των μηκών όλων των πλευρών του πολυγώνου.
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 text-xs 2xl:text-sm text-purple-950 font-medium">
                🔍 Σε κανονικό πολύγωνο με ν πλευρές μήκους α: <strong>Περίμετρος ＝ ν · α</strong>.
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΠΟΛΥΓΩΝΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Δυναμικός Γεωμετρικός Καμβάς Πολυγώνων
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Άλλαξε τον αριθμό των πλευρών από 3 έως 8. Παρατήρησε πώς μεταβάλλεται το σχήμα, οι κορυφές, η ονομασία και ο αριθμός των διαγωνίων του.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Αριστερή Στήλη: Χειριστήρια & Ταυτότητα Πολυγώνου */}
            <div className="lg:col-span-5 2xl:col-span-5 space-y-6 bg-slate-50 p-6 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200">
              <h4 className="text-xs 2xl:text-sm font-black tracking-wider text-slate-500">
                ΜΕΤΑΒΟΛΗ ΑΡΙΘΜΟΥ ΠΛΕΥΡΩΝ
              </h4>

              {/* Stepper Πλευρών */}
              <div className="space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">Αριθμός Πλευρών:</span>
                  <span className="min-w-[80px] text-center font-mono font-black text-2xl text-blue-600 bg-white px-2.5 py-0.5 rounded-xl border border-blue-200 shadow-sm">
                    {sides}
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Μείωση πλευρών κατά 1"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSides((prev) => Math.max(3, prev - 1));
                    }}
                    disabled={sides <= 3}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>

                  <input
                    type="range"
                    min="3"
                    max="8"
                    step="1"
                    value={sides}
                    onChange={(e) => setSides(Number(e.target.value))}
                    aria-label="Αριθμός πλευρών πολυγώνου"
                    className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                  />

                  <button
                    type="button"
                    aria-label="Αύξηση πλευρών κατά 1"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSides((prev) => Math.min(8, prev + 1));
                    }}
                    disabled={sides >= 8}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>

                {/* Γρήγορα κουμπιά επιλογής */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
                  {[3, 4, 5, 6, 7, 8].map((val) => (
                    <button
                      key={`btn-side-${val}`}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSides(val);
                      }}
                      className={`text-xs font-mono px-2.5 py-1 rounded-lg font-semibold transition ${
                        sides === val
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Κάρτα Ταυτότητας Πολυγώνου */}
              <div className="p-5 bg-white rounded-2xl border border-blue-200 bg-blue-50/40 space-y-3 shadow-sm text-center">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                  ΑΥΤΟ ΤΟ ΣΧΗΜΑ ΕΙΝΑΙ:
                </span>
                <div className="text-2xl sm:text-3xl font-black text-blue-700">
                  {currentPolygon.title}
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-600">
                  {currentPolygon.desc}
                </p>

                {/* Πίνακας Στοιχείων */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-blue-100 font-mono text-xs sm:text-sm font-bold text-slate-800">
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200">
                    📐 {sides} Γωνίες
                  </div>
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200">
                    📏 {sides} Πλευρές
                  </div>
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200">
                    📍 {sides} Κορυφές
                  </div>
                </div>

                {/* Πλήθος Διαγωνίων */}
                <div className="p-2 bg-white rounded-xl border border-slate-200 text-xs font-mono text-slate-700">
                  Διαγώνιοι: <strong className="text-blue-700">{diagonalsCount}</strong> (τμήματα που ενώνουν μη διαδοχικές κορυφές)
                </div>
              </div>
            </div>

            {/* Δεξιά Στήλη: Responsive SVG Γεωμετρικό Σχήμα */}
            <div className="lg:col-span-7 2xl:col-span-7 bg-slate-50 p-6 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 flex flex-col items-center justify-center space-y-6">
              <div className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500 px-1">
                <span>ΓΕΩΜΕΤΡΙΚΗ ΑΠΕΙΚΟΝΙΣΗ</span>
                <span className="font-mono text-blue-600 font-bold">{currentPolygon.title} ({sides} πλευρές)</span>
              </div>

              {/* SVG Canvas */}
              <div className="w-full max-w-[500px] aspect-[480/270] bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
                <svg
                  viewBox="0 0 480 270"
                  className="w-full h-full drop-shadow-sm"
                  shapeRendering="geometricPrecision"
                >
                  {/* Πολύγωνο */}
                  <polygon
                    points={pointsString}
                    className="fill-blue-500/10 stroke-blue-600 stroke-[3.5] stroke-linejoin-round"
                  />

                  {/* Κορυφές & Ετικέτες (Α, Β, Γ, Δ...) */}
                  {pointsArray.map((point, idx) => {
                    const greekLetters = ['Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ'];
                    const label = greekLetters[idx] || String.fromCharCode(65 + idx);

                    const dx = point.x - cx;
                    const dy = point.y - cy;
                    const len = Math.sqrt(dx * dx + dy * dy) || 1;
                    const textX = point.x + (dx / len) * 18;
                    const textY = point.y + (dy / len) * 18 + 4;

                    return (
                      <g key={idx}>
                        <circle cx={point.x} cy={point.y} r={5.5} className="fill-slate-900" />
                        <text
                          x={textX}
                          y={textY}
                          textAnchor="middle"
                          className="font-sans text-xs font-black fill-slate-900"
                        >
                          {label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Callout Συμπεράσματος */}
              <div className="w-full max-w-md p-3.5 bg-slate-100 rounded-2xl border border-slate-200 text-center font-mono text-xs sm:text-sm text-slate-700">
                Κλειστό σχήμα με <strong>{sides} πλευρές</strong>, <strong>{sides} γωνίες</strong> και <strong>{sides} κορυφές</strong>.
              </div>
            </div>
          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στα Πολύγωνα!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε απαιτητικές ασκήσεις αναγνώρισης πολυγώνων, υπολογισμού περιμέτρου, κανονικών πολυγώνων και διαγωνίων.
            </p>
          </div>

          <Link
            href="/e-dimotikou/22-poligona-ask"
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
