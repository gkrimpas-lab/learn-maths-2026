// pages/e-dimotikou/23-kanonika-poligona.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function KanonikaPoligonaTheoryPage() {
  // Αριθμός πλευρών (3 έως 30)
  const [sides, setSides] = useState(6); // Αρχική τιμή: Κανονικό Εξάγωνο

  const getPolygonName = (s) => {
    if (s === 3) return 'Ισόπλευρο Τρίγωνο';
    if (s === 4) return 'Τετράγωνο';
    if (s === 5) return 'Κανονικό Πεντάγωνο';
    if (s === 6) return 'Κανονικό Εξάγωνο';
    if (s === 7) return 'Κανονικό Επτάγωνο';
    if (s === 8) return 'Κανονικό Οκτάγωνο';
    if (s === 10) return 'Κανονικό Δεκάγωνο';
    if (s === 12) return 'Κανονικό Δωδεκάγωνο';
    return `Κανονικό ${s}-γωνο`;
  };

  // SVG Υπολογισμοί κανονικού πολυγώνου
  const cx = 240;
  const cy = 135;
  const radius = 85;

  const pointsArray = [];
  for (let i = 0; i < sides; i++) {
    const angleRad = (i * 2 * Math.PI) / sides - Math.PI / 2;
    const x = Math.round(cx + radius * Math.cos(angleRad));
    const y = Math.round(cy + radius * Math.sin(angleRad));
    pointsArray.push({ x, y });
  }

  const pointsString = pointsArray.map((p) => `${p.x},${p.y}`).join(' ');

  // Υπολογισμός Κεντρικής Γωνίας: 360° : ν
  const centralAngle = (360 / sides).toLocaleString('el-GR', {
    maximumFractionDigits: 1
  });

  // Υπολογισμός Εσωτερικής Γωνίας: (ν - 2) · 180° : ν
  const interiorAngle = (((sides - 2) * 180) / sides).toLocaleString('el-GR', {
    maximumFractionDigits: 1
  });

  return (
    <Layout
      title="Κανονικά Πολύγωνα - Ε' Δημοτικού | LearnMaths.gr"
      description="Μάθετε τι είναι τα κανονικά πολύγωνα (ισόπλευρα τρίγωνα, τετράγωνα, κανονικά εξάγωνα), τις γωνίες τους, τους άξονες συμμετρίας και πώς προσεγγίζουν τον κύκλο."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/23-kanonika-poligona-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 23 • Ε' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Κανονικά Πολύγωνα
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              Ανακαλύπτουμε την πιο συμμετρική οικογένεια πολυγώνων, όπου όλες οι πλευρές και όλες οι γωνίες είναι απόλυτα ίσες, πώς υπολογίζουμε την περίμετρό τους και πώς καθώς αυξάνονται οι πλευρές, το σχήμα μεταμορφώνεται σε κύκλο.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία &amp; Δυναμικός Καμβάς Κανονικών Πολυγώνων</span>
            </div>
            <Link
              href="/e-dimotikou/23-kanonika-poligona-ask"
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
              Η γεωμετρική τελειότητα των κανονικών πολυγώνων, οι γωνίες και η συμμετρία τους.
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
                  Ο Διπλός Κανόνας
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Ένα πολύγωνο ονομάζεται <strong>κανονικό</strong> όταν ικανοποιεί <strong>ταυτόχρονα</strong> δύο ιδιότητες:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    1. <strong>Ισόπλευρο:</strong> Έχει <strong>όλες τις πλευρές ίσες</strong> μεταξύ τους.
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    2. <strong>Ισογώνιο:</strong> Έχει <strong>όλες τις γωνίες ίσες</strong> μεταξύ τους.
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 <strong>Παραδείγματα:</strong> Το ισόπλευρο τρίγωνο (3 ίσες πλευρές &amp; 3 γωνίες των 60°) και το τετράγωνο (4 ίσες πλευρές &amp; 4 γωνίες των 90°).
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Γωνίες</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Κεντρική &amp; Εσωτερική Γωνία
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Σε κάθε κανονικό πολύγωνο με ν πλευρές:
                </p>

                <div className="bg-slate-50 p-3.5 2xl:p-4 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm font-mono">
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    • <strong>Κεντρική Γωνία:</strong> Χωρίζει τον κύκλο σε ν ίσα μέρη:
                    <div className="text-emerald-700 font-black pt-1">Γωνία ＝ 360° ： ν</div>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    • <strong>Περίμετρος:</strong> Επειδή όλες οι πλευρές α είναι ίσες:
                    <div className="text-emerald-700 font-black pt-1">Περίμετρος ＝ ν · α</div>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                ⚡ Στο κανονικό εξάγωνο, η κεντρική γωνία είναι: 360° ： 6 ＝ <strong>60°</strong> και η εσωτερική γωνία είναι <strong>120°</strong>.
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Συμμετρία</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Άξονες Συμμετρίας
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Τα κανονικά πολύγωνα έχουν εξαιρετική γεωμετρική συμμετρία:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono text-center">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-bold text-amber-950 shadow-inner">
                    Άξονες Συμμετρίας ＝ Αριθμός Πλευρών ( ν )
                  </div>
                  <p className="text-slate-600 text-xs font-sans text-left pt-1">
                    • Ισόπλευρο τρίγωνο ➔ <strong>3 άξονες</strong><br />
                    • Τετράγωνο ➔ <strong>4 άξονες</strong><br />
                    • Κανονικό πεντάγωνο ➔ <strong>5 άξονες</strong><br />
                    • Κανονικό εξάγωνο ➔ <strong>6 άξονες</strong>
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                🎯 Όλοι οι άξονες συμμετρίας διέρχονται από το <strong>κέντρο</strong> του κανονικού πολυγώνου!
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Συσχέτιση</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Η Προσέγγιση του Κύκλου
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Όσο αυξάνουμε τον αριθμό των πλευρών σε ένα κανονικό πολύγωνο:
                </p>

                <div className="space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-950">
                    • Οι γωνίες ανοίγουν και πλησιάζουν τις 180°.
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                    • Οι πλευρές μικραίνουν και το περίγραμμα <strong>ταυτίζεται σχεδόν απόλυτα με τον κύκλο</strong>!
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 text-xs 2xl:text-sm text-purple-950 font-medium">
                🔍 Με αυτήν ακριβώς τη μέθοδο υπολόγισε ο Αρχιμήδης την τιμή του αριθμού <strong>π ≈ 3,14</strong>!
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΚΑΝΟΝΙΚΩΝ ΠΟΛΥΓΩΝΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Δυναμικός Καμβάς Κανονικών Πολυγώνων
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Άλλαξε τον αριθμό των πλευρών από 3 έως 30. Παρατήρησε πώς μεταβάλλεται το σχήμα, η κεντρική και η εσωτερική γωνία και πώς το σχήμα τείνει να γίνει κύκλος.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Αριστερή Στήλη: Χειριστήρια & Μετρήσεις */}
            <div className="lg:col-span-5 2xl:col-span-5 space-y-6 bg-slate-50 p-6 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200">
              <h4 className="text-xs 2xl:text-sm font-black tracking-wider text-slate-500">
                ΠΛΗΘΟΣ ΠΛΕΥΡΩΝ ( 3 ΕΩΣ 30 )
              </h4>

              {/* Stepper Πλευρών */}
              <div className="space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">Αριθμός Πλευρών:</span>
                  <span className="min-w-[80px] text-center font-mono font-black text-2xl text-emerald-600 bg-white px-2.5 py-0.5 rounded-xl border border-emerald-200 shadow-sm">
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
                    max="30"
                    step="1"
                    value={sides}
                    onChange={(e) => setSides(Number(e.target.value))}
                    aria-label="Αριθμός πλευρών κανονικού πολυγώνου"
                    className="w-full min-w-0 max-w-full accent-emerald-600 cursor-pointer"
                  />

                  <button
                    type="button"
                    aria-label="Αύξηση πλευρών κατά 1"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSides((prev) => Math.min(30, prev + 1));
                    }}
                    disabled={sides >= 30}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>

                {/* Γρήγορα κουμπιά επιλογής */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
                  {[3, 4, 5, 6, 8, 12, 24].map((val) => (
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
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Κάρτα Ταυτότητας Κανονικού Πολυγώνου */}
              <div className="p-5 bg-white rounded-2xl border border-emerald-200 bg-emerald-50/40 space-y-3 shadow-sm text-center">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                  ΓΕΩΜΕΤΡΙΚΗ ΤΑΥΤΟΤΗΤΑ
                </span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-700">
                  {getPolygonName(sides)}
                </div>

                {/* Πίνακας Μετρήσεων */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-100 font-mono text-xs sm:text-sm font-bold text-slate-800">
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">ΚΕΝΤΡΙΚΗ ΓΩΝΙΑ</span>
                    <strong className="text-emerald-700">{centralAngle}°</strong>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">ΕΣΩΤΕΡΙΚΗ ΓΩΝΙΑ</span>
                    <strong className="text-emerald-700">{interiorAngle}°</strong>
                  </div>
                </div>

                <div className="p-2 bg-white rounded-xl border border-slate-200 text-xs font-mono text-slate-700">
                  Άξονες Συμμετρίας: <strong className="text-emerald-700">{sides}</strong> (όσοι και οι πλευρές)
                </div>

                {sides >= 20 && (
                  <div className="p-2 bg-emerald-100/60 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-900 animate-pulse">
                    💡 Με {sides} πλευρές, το σχήμα έχει πλέον σχεδόν ταυτιστεί με κύκλο!
                  </div>
                )}
              </div>
            </div>

            {/* Δεξιά Στήλη: Responsive SVG Γεωμετρικό Σχήμα */}
            <div className="lg:col-span-7 2xl:col-span-7 bg-slate-50 p-6 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 flex flex-col items-center justify-center space-y-6">
              <div className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500 px-1">
                <span>ΓΕΩΜΕΤΡΙΚΗ ΑΠΕΙΚΟΝΙΣΗ</span>
                <span className="font-mono text-emerald-700 font-bold">{getPolygonName(sides)}</span>
              </div>

              {/* SVG Canvas */}
              <div className="w-full max-w-[500px] aspect-[480/270] bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
                <svg
                  viewBox="0 0 480 270"
                  className="w-full h-full drop-shadow-sm"
                  shapeRendering="geometricPrecision"
                >
                  {/* Αχνός περιγεγραμμένος κύκλος */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={radius}
                    fill="none"
                    className="stroke-slate-200 stroke-[1.5]"
                    strokeDasharray="4 4"
                  />

                  {/* Κανονικό Πολύγωνο */}
                  <polygon
                    points={pointsString}
                    className="fill-emerald-500/10 stroke-emerald-600 stroke-[3] stroke-linejoin-round"
                  />

                  {/* Κέντρο Πολυγώνου */}
                  <circle cx={cx} cy={cy} r="3" className="fill-slate-400" />

                  {/* Κορυφές & Ετικέτες (εμφανίζονται γράμματα μόνο όταν οι πλευρές είναι <= 10) */}
                  {pointsArray.map((point, idx) => {
                    const greekLetters = ['Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ'];
                    const label = greekLetters[idx] || '';

                    const dx = point.x - cx;
                    const dy = point.y - cy;
                    const len = Math.sqrt(dx * dx + dy * dy) || 1;
                    const textX = point.x + (dx / len) * 16;
                    const textY = point.y + (dy / len) * 16 + 4;

                    return (
                      <g key={idx}>
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r={sides > 16 ? 2.5 : 4}
                          className="fill-slate-900"
                        />
                        {sides <= 10 && label && (
                          <text
                            x={textX}
                            y={textY}
                            textAnchor="middle"
                            className="font-sans text-xs font-black fill-slate-900"
                          >
                            {label}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Callout Συμπεράσματος */}
              <div className="w-full max-w-md p-3.5 bg-slate-100 rounded-2xl border border-slate-200 text-center font-mono text-xs sm:text-sm text-slate-700">
                Κανονικό σχήμα με <strong>{sides} ίσες πλευρές</strong> και <strong>{sides} ίσες γωνίες</strong> των {interiorAngle}°.
              </div>
            </div>
          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στα Κανονικά Πολύγωνα!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε απαιτητικές ασκήσεις υπολογισμού γωνιών, περιμέτρου, αξόνων συμμετρίας και αναγνώρισης κανονικών πολυγώνων.
            </p>
          </div>

          <Link
            href="/e-dimotikou/23-kanonika-poligona-ask"
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
