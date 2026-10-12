// pages/st-dimotikou/70-megethinsi-smikrinsi.js
import { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Αφαίρεση τόνων για κεφαλαία (εξαιρείται το ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  const cleaned = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
  return cleaned.replace(/\bΣΤ\b/g, "ΣΤ'");
}

// Μορφοποίηση αριθμού με ελληνική υποδιαστολή
function formatNum(val) {
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  return Number(val).toLocaleString('el-GR');
}

export default function MegethinsiSmikrinsiTheoriaPage() {
  // Εργαστήριο 1: Διαδραστική Μεγέθυνση / Σμίκρυνση Ορθογωνίου
  const [scaleFactor, setScaleFactor] = useState(2); // 0.5, 1, 1.5, 2, 2.5, 3

  // Αρχικές διαστάσεις (cm)
  const baseW = 4;
  const baseH = 2.5;

  const scaledW = useMemo(() => baseW * scaleFactor, [baseW, scaleFactor]);
  const scaledH = useMemo(() => baseH * scaleFactor, [baseH, scaleFactor]);

  const basePerim = useMemo(() => 2 * (baseW + baseH), [baseW, baseH]);
  const scaledPerim = useMemo(() => 2 * (scaledW + scaledH), [scaledW, scaledH]);

  const baseArea = useMemo(() => baseW * baseH, [baseW, baseH]);
  const scaledArea = useMemo(() => scaledW * scaledH, [scaledW, scaledH]);

  // Εργαστήριο 2: Υπολογιστής Κλίμακας Χάρτη (1 : Κ)
  const [mapDistanceCm, setMapDistanceCm] = useState(4);
  const [mapScaleDenominator, setMapScaleDenominator] = useState(50000); // 1 : 50.000

  // Υπολογισμός πραγματικής απόστασης σε μέτρα και χιλιόμετρα
  const { realMeters, realKm } = useMemo(() => {
    const totalCm = mapDistanceCm * mapScaleDenominator;
    const m = totalCm / 100;
    const km = m / 1000;
    return { realMeters: m, realKm: km };
  }, [mapDistanceCm, mapScaleDenominator]);

  return (
    <Layout
      title="Μεγέθυνση, Σμίκρυνση &amp; Κλίμακα - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μαθαίνουμε πώς μεγεθύνουμε και σμικρύνουμε γεωμετρικά σχήματα, τι είναι η κλίμακα, πώς αλλάζουν οι πλευρές και τα εμβαδά με διαδραστικά εργαστήρια SVG."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/70-megethinsi-smikrinsi-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 Ασκήσεις</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 sm:space-y-10 2xl:space-y-14 pb-28 sm:pb-32 overflow-x-hidden">

        {/* 1. HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>ΚΕΦΑΛΑΙΟ 70 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Μεγέθυνση &amp; Σμίκρυνση Σχημάτων • Η Έννοια της Κλίμακας
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Ανακαλύπτουμε πώς αλλάζουν οι διαστάσεις ενός σχήματος διατηρώντας ακέραια τη μορφή του, 
              τι εκφράζει η <strong>κλίμακα</strong> στους χάρτες και τα αρχιτεκτονικά σχέδια, 
              και εξετάζουμε τη συναρπαστική διαφορά ανάμεσα στη μεταβολή των <strong>πλευρών</strong> και των <strong>εμβαδών</strong>!
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία, Κλίμακα Χαρτών, Μεγέθυνση, Σμίκρυνση &amp; Διαδραστικά Εργαστήρια</span>
            </div>
            <Link
              href="/st-dimotikou/70-megethinsi-smikrinsi-ask"
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
              Μεγέθυνση &amp; Κλίμακα σε 4 Βήματα
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Από την ομοιότητα των σχημάτων μέχρι τους υπολογισμούς πραγματικών αποστάσεων.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 gap-5 sm:gap-6 2xl:gap-8">

            {/* ΒΗΜΑ 1 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 1
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Έννοια</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Μεγέθυνση &amp; Σμίκρυνση
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Όταν <strong>μεγεθύνουμε</strong> ή <strong>σμικρύνουμε</strong> ένα γεωμετρικό σχήμα, δημιουργούμε ένα <strong>όμοιο σχήμα</strong>:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2">
                  <div>
                    • <strong>Μεγέθυνση:</strong> Πολλαπλασιάζουμε <em>όλες</em> τις διαστάσεις του σχήματος με τον ίδιο αριθμό (μεγαλύτερο του 1).
                  </div>
                  <div>
                    • <strong>Σμίκρυνση:</strong> Διαιρούμε <em>όλες</em> τις διαστάσεις του σχήματος με τον ίδιο αριθμό (ή πολλαπλασιάζουμε με κλάσμα μικρότερο του 1).
                  </div>
                  <div className="text-blue-900 font-bold text-xs pt-1 border-t border-slate-200">
                    Βασικός Κανόνας: Οι γωνίες παραμένουν <strong>απολύτως ίδιες</strong>! Το σχήμα δεν παραμορφώνεται.
                  </div>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Αν διπλασιάσουμε μόνο το μήκος και όχι το πλάτος, το σχήμα παραμορφώνεται και ΔΕΝ είναι μεγέθυνση!
              </div>
            </article>

            {/* ΒΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Ορισμός</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Τι είναι η Κλίμακα;
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  <strong>Κλίμακα</strong> ονομάζεται ο λόγος του μήκους στο σχέδιο (ή στον χάρτη) προς το αντίστοιχο πραγματικό μήκος:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 text-center font-mono">
                  <div className="text-amber-900 font-black text-sm sm:text-base">
                    Κλίμακα ＝ Μήκος στο σχέδιο : Πραγματικό μήκος
                  </div>
                  <div className="text-slate-700 text-xs font-sans text-left pt-1">
                    • <strong>Κλίμακα 1 : 100:</strong> 1 cm στο σχέδιο αντιστοιχεί σε 100 cm (1 m) στην πραγματικότητα (σμίκρυνση).<br />
                    • <strong>Κλίμακα 2 : 1:</strong> 2 cm στο σχέδιο αντιστοιχούν σε 1 cm στην πραγματικότητα (μεγέθυνση μικρών αντικειμένων).
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Στον υπολογισμό της κλίμακας και τα δύο μεγέθη πρέπει να εκφράζονται στην <strong>ίδια μονάδα μέτρησης</strong> (π.χ. σε cm)!
              </div>
            </article>

            {/* ΒΗΜΑ 3 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Χάρτες</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Χρήση Κλίμακας σε Χάρτες
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Στους γεωγραφικούς χάρτες η κλίμακα επιτρέπει τη μετατροπή μετρήσεων σε πραγματικές χιλιομετρικές αποστάσεις:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1.5 font-mono">
                  <div className="font-bold text-indigo-950">• Παράδειγμα: Κλίμακα 1 : 200.000</div>
                  <div className="text-slate-700 text-xs font-sans">
                    Αν μετρήσουμε με τον χάρακα 3 cm στον χάρτη:<br />
                    3 cm · 200.000 ＝ 600.000 cm.<br />
                    Μετατρέπουμε σε μέτρα: 600.000 : 100 ＝ 6.000 m.<br />
                    Μετατρέπουμε σε χιλιόμετρα: 6.000 : 1.000 ＝ <strong>6 km</strong>!
                  </div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Χρήσιμος κανόνας: 1 km ＝ 1.000 m ＝ 100.000 cm.
              </div>
            </article>

            {/* ΒΗΜΑ 4 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Περίμετρος vs Εμβαδόν</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Πώς Αλλάζει το Εμβαδόν;
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Αν πολλαπλασιάσουμε όλες τις πλευρές ενός σχήματος επί έναν αριθμό λ:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2">
                  <div>
                    • <strong>Η περίμετρος</strong> πολλαπλασιάζεται επί λ. (Αν διπλασιαστούν οι πλευρές, διπλασιάζεται η περίμετρος).
                  </div>
                  <div>
                    • <strong>Το εμβαδόν</strong> πολλαπλασιάζεται επί <strong>λ · λ (λ²)</strong>!
                  </div>
                  <div className="text-emerald-900 font-bold text-xs pt-1 border-t border-slate-200">
                    Αν διπλασιάσουμε τις πλευρές (λ ＝ 2), το εμβαδόν <strong>τετραπλασιάζεται</strong> (2 · 2 ＝ 4)!
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Προσοχή: Το εμβαδόν μεγαλώνει πολύ ταχύτερα από τις γραμμικές διαστάσεις!
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: SVG ΜΕΓΕΘΥΝΣΗ / ΣΜΙΚΡΥΝΣΗ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1</span>
            </div>
            <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Διαδραστική Μεγέθυνση &amp; Σμίκρυνση Ορθογωνίου (SVG)
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Επίλεξε συντελεστή μεταβολής και δες πώς αλλάζουν οι πλευρές, η περίμετρος και το εμβαδόν σε σύγκριση με το αρχικό σχήμα:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">

            {/* Χειριστήρια & Στοιχεία (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>ΣΥΝΤΕΛΕΣΤΗΣ ΜΕΤΑΒΟΛΗΣ (λ):</span>
                  <span className="font-mono text-base font-black text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {formatNum(scaleFactor)} ×
                  </span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={3}
                  step={0.5}
                  value={scaleFactor}
                  onChange={(e) => setScaleFactor(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>0,5× (Σμίκρυνση)</span>
                  <span>1× (Ίσο)</span>
                  <span>2×</span>
                  <span>3× (Μεγέθυνση)</span>
                </div>
              </div>

              {/* Πίνακας Σύγκρισης Μεγεθών */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50/70 p-1">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold">
                      <th className="py-2 px-3">Μέγεθος</th>
                      <th className="py-2 px-3">Αρχικό (1×)</th>
                      <th className="py-2 px-3 text-indigo-700 font-black">Νέο ({formatNum(scaleFactor)}×)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/60 font-mono">
                    <tr>
                      <td className="py-2 px-3 font-sans font-semibold text-slate-700">Διαστάσεις</td>
                      <td className="py-2 px-3 text-slate-600">{formatNum(baseW)} × {formatNum(baseH)} cm</td>
                      <td className="py-2 px-3 font-bold text-indigo-700">{formatNum(scaledW)} × {formatNum(scaledH)} cm</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-sans font-semibold text-slate-700">Περίμετρος</td>
                      <td className="py-2 px-3 text-slate-600">{formatNum(basePerim)} cm</td>
                      <td className="py-2 px-3 font-bold text-sky-700">{formatNum(scaledPerim)} cm (· {formatNum(scaleFactor)})</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-sans font-semibold text-slate-700">Εμβαδόν</td>
                      <td className="py-2 px-3 text-slate-600">{formatNum(baseArea)} cm²</td>
                      <td className="py-2 px-3 font-black text-emerald-700">{formatNum(scaledArea)} cm² (· {formatNum(scaleFactor * scaleFactor)})</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs text-indigo-950 font-medium">
                💡 Παρατήρησε: Για λ ＝ {formatNum(scaleFactor)}, η περίμετρος έγινε {formatNum(scaleFactor)} φορές μεγαλύτερη, 
                αλλά το εμβαδόν έγινε {formatNum(scaleFactor * scaleFactor)} φορές μεγαλύτερο!
              </div>
            </div>

            {/* SVG Visualizer Σχημάτων (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 min-h-[380px] p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col items-center justify-center">
              <svg
                viewBox="0 0 400 300"
                className="w-full max-w-[400px] h-auto select-none overflow-visible"
              >
                {/* Αρχικό Σχήμα (Αριστερά) */}
                <g transform="translate(40, 90)">
                  <rect
                    x="0"
                    y="0"
                    width={baseW * 24}
                    height={baseH * 24}
                    fill="rgba(56, 189, 248, 0.2)"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    strokeDasharray="4 3"
                  />
                  <text x={baseW * 12} y="-10" fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="middle">
                    {formatNum(baseW)} cm
                  </text>
                  <text x="-10" y={baseH * 12 + 4} fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="end">
                    {formatNum(baseH)} cm
                  </text>
                  <text x={baseW * 12} y={baseH * 12 + 4} fill="#e2e8f0" fontSize="12" fontWeight="bold" textAnchor="middle">
                    Αρχικό
                  </text>
                  <text x={baseW * 12} y={baseH * 24 + 20} fill="#64748b" fontSize="10" textAnchor="middle">
                    Ε ＝ {formatNum(baseArea)} cm²
                  </text>
                </g>

                {/* Νέο Σχήμα (Δεξιά) */}
                <g transform="translate(180, 50)">
                  <rect
                    x="0"
                    y="0"
                    width={Math.min(scaledW * 24, 180)}
                    height={Math.min(scaledH * 24, 180)}
                    fill="rgba(129, 140, 248, 0.25)"
                    stroke="#818cf8"
                    strokeWidth="3"
                  />
                  <text x={Math.min(scaledW * 12, 90)} y="-10" fill="#818cf8" fontSize="12" fontWeight="bold" textAnchor="middle">
                    {formatNum(scaledW)} cm
                  </text>
                  <text x="-10" y={Math.min(scaledH * 12, 90) + 4} fill="#818cf8" fontSize="12" fontWeight="bold" textAnchor="end">
                    {formatNum(scaledH)} cm
                  </text>
                  <text x={Math.min(scaledW * 12, 90)} y={Math.min(scaledH * 12, 90) + 4} fill="#ffffff" fontSize="13" fontWeight="black" textAnchor="middle">
                    Νέο ({formatNum(scaleFactor)}×)
                  </text>
                  <text x={Math.min(scaledW * 12, 90)} y={Math.min(scaledH * 24, 180) + 22} fill="#34d399" fontSize="12" fontWeight="black" textAnchor="middle">
                    Ε ＝ {formatNum(scaledArea)} cm²
                  </text>
                </g>
              </svg>

              <div className="mt-2 text-center text-xs text-slate-400">
                Οι γωνίες παραμένουν πάντοτε ορθές (90°). Η μορφή του σχήματος δεν αλλοιώνεται.
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΥΠΟΛΟΓΙΣΤΗΣ ΚΛΙΜΑΚΑΣ ΧΑΡΤΗ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
              <span>🗺️ ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΧΑΡΤΗΣ &amp; ΑΠΟΣΤΑΣΗ</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Υπολογιστής Πραγματικής Απόστασης από τον Χάρτη
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Επίλεξε την απόσταση που μέτρησες στον χάρτη με τον χάρακα και την κλίμακα για να βρεις την πραγματική απόσταση σε km:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

            {/* Ρυθμίσεις (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>ΑΠΟΣΤΑΣΗ ΣΤΟΝ ΧΑΡΤΗ:</span>
                  <span className="font-mono text-base font-black text-indigo-700 bg-white px-3 py-1 rounded-xl border border-slate-200">
                    {formatNum(mapDistanceCm)} cm
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  step={0.5}
                  value={mapDistanceCm}
                  onChange={(e) => setMapDistanceCm(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">
                  ΕΠΙΛΟΓΗ ΚΛΙΜΑΚΑΣ ΧΑΡΤΗ (1 : Κ):
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[25000, 50000, 100000, 200000, 500000, 1000000].map((den) => (
                    <button
                      key={den}
                      type="button"
                      onClick={() => setMapScaleDenominator(den)}
                      className={`py-2 px-1 rounded-xl text-xs font-black transition-all ${
                        mapScaleDenominator === den
                          ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-300'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      1 : {den >= 1000000 ? `${den / 1000000} εκ.` : `${den / 1000} χιλ.`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Αποτέλεσμα & Βήματα (7 στήλες) */}
            <div className="lg:col-span-7 bg-emerald-50/70 p-5 sm:p-7 rounded-3xl border border-emerald-200 space-y-3 text-center">
              <span className="text-xs text-emerald-900 block font-bold uppercase tracking-wider">
                ΠΡΑΓΜΑΤΙΚΗ ΑΠΟΣΤΑΣΗ ΣΤΗ ΓΗ
              </span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-800 font-mono">
                {formatNum(realKm)} km
              </div>
              <div className="space-y-1 text-xs text-slate-700 font-mono text-left bg-white p-3.5 rounded-2xl border border-emerald-200/60">
                <div>• <strong>Σε εκατοστά:</strong> {formatNum(mapDistanceCm)} cm · {formatNum(mapScaleDenominator)} ＝ {formatNum(mapDistanceCm * mapScaleDenominator)} cm</div>
                <div>• <strong>Σε μέτρα:</strong> {formatNum(mapDistanceCm * mapScaleDenominator)} : 100 ＝ {formatNum(realMeters)} m</div>
                <div>• <strong>Σε χιλιόμετρα:</strong> {formatNum(realMeters)} : 1.000 ＝ <strong>{formatNum(realKm)} km</strong></div>
              </div>
            </div>

          </div>
        </section>

        {/* 5. ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ ΚΑΘΗΜΕΡΙΝΗΣ ΖΩΗΣ */}
        <section className="space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight">
              Λυμένα Προβλήματα με Κλίμακα &amp; Μεγέθυνση
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Ρεαλιστικές εφαρμογές σε σχέδια κατοικιών και γεωγραφικούς χάρτες.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ΠΡΟΒΛΗΜΑ 1 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-900 text-xs font-black rounded-lg uppercase">
                  ΠΡΟΒΛΗΜΑ 1: ΚΑΤΟΨΗ ΔΩΜΑΤΙΟΥ
                </span>
                <span className="text-xs font-bold text-slate-400">Κλίμακα 1 : 50</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Υπολογισμός Πραγματικών Διαστάσεων από Αρχιτεκτονικό Σχέδιο
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Στην κάτοψη ενός σπιτιού με κλίμακα <strong>1 : 50</strong>, ένα παιδικό δωμάτιο έχει μήκος <strong>8 cm</strong> και πλάτος <strong>6 cm</strong>. Ποιες είναι οι πραγματικές διαστάσεις και το εμβαδόν του δωματίου σε m;
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΔΕΔΟΜΕΝΑ ΠΡΟΒΛΗΜΑΤΟΣ
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Κλίμακα</span> 1 : 50
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Μήκος σχεδίου</span> 8 cm
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Πλάτος σχεδίου</span> 6 cm
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήματα Επίλυσης:</span>
                  <div>• <strong>Πραγματικό μήκος:</strong> 8 cm · 50 ＝ 400 cm ＝ <strong>4 m</strong>.</div>
                  <div>• <strong>Πραγματικό πλάτος:</strong> 6 cm · 50 ＝ 300 cm ＝ <strong>3 m</strong>.</div>
                  <div>• <strong>Πραγματικό εμβαδόν:</strong> 4 m · 3 m ＝ <strong className="text-blue-700">12 m²</strong>.</div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 font-medium">
                💡 Στο σχέδιο το εμβαδόν ήταν 8 · 6 ＝ 48 cm². Στην πραγματικότητα είναι 12 m² (δηλαδή 120.000 cm²)!
              </div>
            </article>

            {/* ΠΡΟΒΛΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-lg uppercase">
                  ΠΡΟΒΛΗΜΑ 2: ΑΠΟΣΤΑΣΗ ΠΟΛΕΩΝ
                </span>
                <span className="text-xs font-bold text-slate-400">Χάρτης 1 : 1.000.000</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Μέτρηση με Χάρακα στον Οδικό Χάρτη
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Σε έναν χάρτη με κλίμακα <strong>1 : 1.000.000</strong>, η απόσταση σε ευθεία γραμμή ανάμεσα σε δύο πόλεις μετρήθηκε <strong>6,5 cm</strong>. Πόσα χιλιόμετρα (km) απέχουν οι δύο πόλεις στην πραγματικότητα;
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΣΤΟΙΧΕΙΑ ΥΠΟΛΟΓΙΣΜΟΥ
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold text-[11px]">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Απόσταση χάρτη</span> 6,5 cm
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Κλίμακα</span> 1 : 1.000.000
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Σχέση km/cm</span> 1 km ＝ 100.000 cm
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήματα Επίλυσης:</span>
                  <div>• <strong>Πραγματική απόσταση σε cm:</strong> 6,5 · 1.000.000 ＝ 6.500.000 cm.</div>
                  <div>• <strong>Μετατροπή σε m:</strong> 6.500.000 : 100 ＝ 65.000 m.</div>
                  <div>• <strong>Μετατροπή σε km:</strong> 65.000 : 1.000 ＝ <strong className="text-amber-700">65 km</strong>.</div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 font-medium">
                ⚡ Στην κλίμακα 1 : 1.000.000, κάθε 1 cm στον χάρτη αντιστοιχεί ακριβώς σε 10 km στην πραγματικότητα!
              </div>
            </article>

          </div>
        </section>

        {/* 6. ALERT BOX: ΠΡΟΣΟΧΗ / ΣΥΝΗΘΗ ΛΑΘΗ */}
        <section className="bg-amber-50 rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm">
          <div className="flex items-start gap-4">
            <span className="text-3xl sm:text-4xl flex-shrink-0">⚠️</span>
            <div className="space-y-3">
              <h3 className="text-base sm:text-lg font-black text-amber-950">
                {toCleanUppercase('Προσοχη / Συνηθη Λαθη που πρεπει να Αποφευγετε')}
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-amber-900 leading-relaxed list-disc list-inside">
                <li>
                  <strong>Οι γωνίες δεν αλλάζουν ποτέ:</strong> Όταν ένα σχήμα μεγεθύνεται ή σμικρύνεται, οι γωνίες του παραμένουν <em>ακριβώς ίδιες</em>. Αν έχουμε ένα τρίγωνο με γωνίες 30°, 60°, 90°, η μεγέθυνσή του θα έχει πάλι γωνίες 30°, 60°, 90°!
                </li>
                <li>
                  <strong>Μην μπερδεύετε τη μεταβολή πλευράς με τη μεταβολή εμβαδού:</strong> Αν τριπλασιάσουμε τις πλευρές ενός τετραγώνου (λ ＝ 3), η περίμετρος τριπλασιάζεται, αλλά το εμβαδόν γίνεται 3 · 3 ＝ <strong>9</strong> φορές μεγαλύτερο!
                </li>
                <li>
                  <strong>Ίδιες μονάδες μέτρησης στην κλίμακα:</strong> Πριν υπολογίσετε την κλίμακα ως λόγο, πρέπει να μετατρέψετε και τα δύο μήκη στην ίδια μονάδα (συνήθως σε εκατοστά cm).
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 7. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στην Κλίμακα &amp; τη Μεγέθυνση!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε 12 διαδραστικές ασκήσεις με υπολογισμούς κλίμακας, χάρτες, περιμέτρους και εμβαδά για τη ΣΤ' Δημοτικού.
            </p>
          </div>

          <Link
            href="/st-dimotikou/70-megethinsi-smikrinsi-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-sm sm:text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 {toCleanUppercase('Έναρξη Ασκήσεων')}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
