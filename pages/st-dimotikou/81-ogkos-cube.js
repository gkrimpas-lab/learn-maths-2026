// pages/st-dimotikou/81-ogkos-cube.js
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

export default function OgkosCubeTheoriaPage() {
  // -------------------------------------------------------------------------
  // Εργαστήριο 1: Διαδραστική Δόμηση με Κυβάκια 1 cm³ (SVG 3D Voxel Grid)
  // -------------------------------------------------------------------------
  const [cubesL, setCubesL] = useState(4); // Μήκος σε κυβάκια (1 έως 5)
  const [cubesW, setCubesW] = useState(3); // Πλάτος σε κυβάκια (1 έως 4)
  const [cubesH, setCubesH] = useState(2); // Ύψος σε στρώσεις (1 έως 4)

  const baseCubesCount = useMemo(() => cubesL * cubesW, [cubesL, cubesW]);
  const totalCubesCount = useMemo(() => baseCubesCount * cubesH, [baseCubesCount, cubesH]);

  // -------------------------------------------------------------------------
  // Εργαστήριο 2: Δυναμικός Υπολογιστής Όγκου Κύβου και Παραλληλεπιπέδου
  // -------------------------------------------------------------------------
  const [shapeMode, setShapeMode] = useState('cuboid'); // 'cube' ή 'cuboid'
  const [dimA, setDimA] = useState(8); // Μήκος (cm)
  const [dimB, setDimB] = useState(5); // Πλάτος (cm)
  const [dimC, setDimC] = useState(4); // Ύψος (cm)

  // Υπολογισμός όγκου ανάλογα με το σχήμα
  const effectiveDims = useMemo(() => {
    if (shapeMode === 'cube') {
      return { a: dimA, b: dimA, c: dimA };
    }
    return { a: dimA, b: dimB, c: dimC };
  }, [shapeMode, dimA, dimB, dimC]);

  const baseAreaCm2 = useMemo(() => effectiveDims.a * effectiveDims.b, [effectiveDims]);
  const volumeCm3 = useMemo(() => baseAreaCm2 * effectiveDims.c, [baseAreaCm2, effectiveDims]);
  const volumeDm3 = useMemo(() => volumeCm3 / 1000, [volumeCm3]); // 1 dm³ = 1 L
  const volumeM3 = useMemo(() => volumeCm3 / 1000000, [volumeCm3]);

  return (
    <Layout
      title="Όγκος Κύβου και; Ορθογωνίου Παραλληλεπιπέδου - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μαθαίνουμε πώς υπολογίζουμε τον όγκο κύβου (V ＝ α³) και ορθογωνίου παραλληλεπιπέδου (V ＝ α · β · γ), τη δόμηση με κυβάκια 1 cm³ και τις εφαρμογές σε προβλήματα."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/81-ogkos-cube-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 81 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Υπολογισμός Όγκου • Κύβος; Ορθογώνιο Παραλληλεπίπεδο
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Μαθαίνουμε πώς υπολογίζεται ο χώρος που καταλαμβάνει ένα στερεό! 
              Βλέπουμε πώς μετράμε τον όγκο γεμίζοντας ένα κουτί με <strong>μοναδιαία κυβάκια (1 cm³)</strong>, 
              εφαρμόζουμε τους θεμελιώδεις τύπους <strong>V ＝ α³</strong> και <strong>V ＝ α · β · γ</strong>, 
              και ανακαλύπτουμε τη σύνδεση ανάμεσα στο <strong>εμβαδόν της βάσης</strong> και το <strong>ύψος</strong>.
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία, Δόμηση με Κυβάκια 1 cm³, Τύποι V ＝ α³ και V ＝ α · β · γ</span>
            </div>
            <Link
              href="/st-dimotikou/81-ogkos-cube-ask"
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
              Ο Όγκος Κύβου &amp; Παραλληλεπιπέδου σε 4 Βήματα
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Από την οπτική καταμέτρηση κυβικών εκατοστομέτρων μέχρι την άλγεβρα και το αντίστροφο πρόβλημα.
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
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Οπτική Δόμηση</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Πώς Μετράμε τον Όγκο;
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Φανταστείτε ότι γεμίζουμε ένα κουτί με μικρά κυβάκια ακμής 1 cm (όγκου <strong>1 cm³</strong> το καθένα):
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2">
                  <div>
                    1. <strong>Στην κάτω βάση:</strong> Στρώνουμε μία στρώση από κυβάκια (Μήκος · Πλάτος). Αν το μήκος είναι 4 cm και το πλάτος 3 cm, η βάση έχει <strong>4 · 3 ＝ 12 κυβάκια</strong>.
                  </div>
                  <div>
                    2. <strong>Στο ύψος:</strong> Τοποθετούμε πολλές τέτοιες στρώσεις προς τα πάνω. Αν το ύψος είναι 2 cm, έχουμε 2 στρώσεις: <strong>12 · 2 ＝ 24 κυβάκια</strong>!
                  </div>
                  <div className="text-blue-900 font-bold pt-1 border-t border-slate-200">
                    Συνολικός Όγκος ＝ 24 cm³.
                  </div>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Ο όγκος δείχνει ακριβώς πόσα μοναδιαία κυβάκια (1 cm³ ή 1 m³) χωράνε μέσα στο στερεό!
              </div>
            </article>

            {/* ΒΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Ορθογώνιο</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Όγκος Παραλληλεπιπέδου
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Σε κάθε ορθογώνιο παραλληλεπίπεδο με μήκος <strong>α</strong>, πλάτος <strong>β</strong> και ύψος <strong>γ</strong>:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 text-center font-mono">
                  <div className="text-indigo-900 font-black text-base sm:text-lg">
                    Όγκος ＝ Μήκος · Πλάτος · Ύψος
                  </div>
                  <div className="text-slate-700 font-bold">
                    V ＝ α · β · γ
                  </div>
                  <div className="text-amber-950 font-bold pt-1 border-t border-slate-200 text-xs">
                    V ＝ Εμβαδόν Βάσης · Ύψος (V ＝ Εβ · γ)
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Και οι τρεις διαστάσεις (α, β, γ) πρέπει να εκφράζονται πάντοτε στην ίδια μονάδα μέτρησης (π.χ. όλες σε cm ή όλες σε m)!
              </div>
            </article>

            {/* ΒΗΜΑ 3 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Ο Κύβος</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Όγκος Κύβου
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Επειδή στον κύβο και οι 3 διαστάσεις είναι ίσες με την ακμή <strong>α</strong> (μήκος ＝ πλάτος ＝ ύψος ＝ α):
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 text-center font-mono">
                  <div className="text-indigo-900 font-black text-base sm:text-lg">
                    Όγκος ＝ Ακμή · Ακμή · Ακμή
                  </div>
                  <div className="text-slate-700 font-bold">
                    V ＝ α · α · α ＝ α³
                  </div>
                  <p className="text-[11px] text-slate-600 font-sans text-left pt-1">
                    Παράδειγμα: Κύβος με ακμή 5 cm έχει όγκο:<br />
                    V ＝ 5 · 5 · 5 ＝ <strong>125 cm³</strong>.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Προσοχή: α³ σημαίνει <strong>α · α · α</strong> (τρίτη δύναμη), και όχι α · 3!
              </div>
            </article>

            {/* ΒΗΜΑ 4 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Αντίστροφο Πρόβλημα</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Εύρεση Ύψους ή Εμβαδού Βάσης
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Αν γνωρίζουμε τον όγκο και το εμβαδόν της βάσης ενός δοχείου:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 font-mono">
                  <div className="text-emerald-950 font-bold">
                    • Ύψος (γ) ＝ Όγκος : Εμβαδόν Βάσης
                  </div>
                  <div className="text-emerald-950 font-bold">
                    • Εμβαδόν Βάσης (Εβ) ＝ Όγκος : Ύψος
                  </div>
                  <p className="text-[11px] text-slate-600 font-sans pt-1">
                    Παράδειγμα: Αν V ＝ 200 cm³ και η βάση έχει εμβαδόν 40 cm², τότε το ύψος είναι: 200 : 40 ＝ <strong>5 cm</strong>.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Θυμήσου τη χωρητικότητα: <strong>1 dm³ ＝ 1 Λίτρο (L)</strong> και <strong>1 m³ ＝ 1.000 L</strong>!
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΚΑΤΑΣΚΕΥΗ ΜΕ ΚΥΒΑΚΙΑ 1 cm³ (SVG 3D) */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1</span>
            </div>
            <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Κατασκευάζουμε τον Όγκο με Κυβάκια του 1 cm³ (SVG)
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Άλλαξε το μήκος, το πλάτος και τις στρώσεις ύψους για να δεις πώς τα κυβάκια 1 cm³ χτίζουν βήμα-βήμα το στερεό και επαληθεύουν τον τύπο V ＝ α · β · γ:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">

            {/* Sliders Κυβικών Διαστάσεων (5 στήλες) */}
            <div className="lg:col-span-5 space-y-3.5">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>ΜΗΚΟΣ (α):</span>
                  <span className="font-mono text-base font-black text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {cubesL} cm ({cubesL} κυβάκια)
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={cubesL}
                  onChange={(e) => setCubesL(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>ΠΛΑΤΟΣ (β):</span>
                  <span className="font-mono text-base font-black text-sky-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {cubesW} cm ({cubesW} κυβάκια)
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={4}
                  step={1}
                  value={cubesW}
                  onChange={(e) => setCubesW(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer touch-manipulation"
                />
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>ΥΨΟΣ (γ):</span>
                  <span className="font-mono text-base font-black text-amber-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {cubesH} cm ({cubesH} στρώσεις)
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={4}
                  step={1}
                  value={cubesH}
                  onChange={(e) => setCubesH(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer touch-manipulation"
                />
              </div>

              {/* Κάρτα Επεξήγησης */}
              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 space-y-1.5 text-xs sm:text-sm font-mono">
                <div>• Κυβάκια στη βάση: {cubesL} · {cubesW} ＝ <strong>{baseCubesCount} κυβάκια</strong> (12 cm²)</div>
                <div>• Στρώσεις καθ' ύψος: <strong>{cubesH}</strong></div>
                <div className="text-indigo-950 font-black text-sm pt-1 border-t border-sky-200/60">
                  • Συνολικός Όγκος: {baseCubesCount} · {cubesH} ＝ <strong>{totalCubesCount} cm³</strong>
                </div>
              </div>
            </div>

            {/* SVG Visualizer με Ισομετρική Προβολή των Κυβιδίων (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 min-h-[350px] p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center">
              <svg
                viewBox="0 0 380 260"
                className="w-full max-w-[380px] h-auto select-none overflow-visible"
              >
                {/* 
                  Σχεδίαση κυβιδίων σε ισομετρική προβολή (από πίσω προς τα εμπρός για σωστό z-index)
                  z: από 0 έως cubesH - 1
                  y: από cubesW - 1 έως 0
                  x: από 0 έως cubesL - 1
                */}
                {Array.from({ length: cubesH }).map((_, z) => (
                  <g key={`layer-${z}`}>
                    {Array.from({ length: cubesW }).map((_, yRev) => {
                      const y = cubesW - 1 - yRev;
                      return Array.from({ length: cubesL }).map((_, x) => {
                        // Συντεταγμένες κέντρου ισομετρίας
                        const cubeSize = 22; // Μέγεθος κυβιδίου
                        const cos30 = 0.866;
                        const sin30 = 0.5;

                        const originX = 190;
                        const originY = 165;

                        // Προβολή σημείου (x, y, z)
                        const px = originX + (x - y) * (cubeSize * cos30);
                        const py = originY + (x + y) * (cubeSize * sin30) - z * cubeSize;

                        // Κορυφές κυβιδίου
                        const dx = cubeSize * cos30;
                        const dy = cubeSize * sin30;
                        const dz = cubeSize;

                        return (
                          <g key={`cube-${x}-${y}-${z}`}>
                            {/* Πάνω έδρα */}
                            <polygon
                              points={`
                                ${px},${py - dz} 
                                ${px + dx},${py - dz + dy} 
                                ${px},${py - dz + 2 * dy} 
                                ${px - dx},${py - dz + dy}
                              `}
                              fill="rgba(56, 189, 248, 0.8)"
                              stroke="#0284c7"
                              strokeWidth="1"
                            />
                            {/* Αριστερή έδρα */}
                            <polygon
                              points={`
                                ${px - dx},${py - dz + dy} 
                                ${px},${py - dz + 2 * dy} 
                                ${px},${py + 2 * dy} 
                                ${px - dx},${py + dy}
                              `}
                              fill="rgba(2, 132, 199, 0.75)"
                              stroke="#0369a1"
                              strokeWidth="1"
                            />
                            {/* Δεξιά έδρα */}
                            <polygon
                              points={`
                                ${px},${py - dz + 2 * dy} 
                                ${px + dx},${py - dz + dy} 
                                ${px + dx},${py + dy} 
                                ${px},${py + 2 * dy}
                              `}
                              fill="rgba(14, 165, 233, 0.9)"
                              stroke="#0284c7"
                              strokeWidth="1"
                            />
                          </g>
                        );
                      });
                    })}
                  </g>
                ))}
              </svg>

              <div className="mt-3 text-center text-xs text-slate-400 font-mono">
                {totalCubesCount} κυβάκια του 1 cm³ ＝ {totalCubesCount} cm³ όγκου!
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΥΠΟΛΟΓΙΣΤΗΣ ΟΓΚΟΥ & ΜΕΤΑΤΡΟΠΕΑΣ ΣΕ ΛΙΤΡΑ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
              <span>📐 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΥΠΟΛΟΓΙΣΤΗΣ ΟΓΚΟΥ &amp; ΛΙΤΡΩΝ</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Υπολογιστής Όγκου (V ＝ α³ ή V ＝ α · β · γ) &amp; Λίτρα
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Επίλεξε σχήμα (Κύβος ή Ορθογώνιο) και ρύθμισε τις διαστάσεις σε cm για να υπολογίσεις άμεσα τον όγκο και τη χωρητικότητα σε λίτρα:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

            {/* Επιλογές & Sliders (5 στήλες) */}
            <div className="lg:col-span-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  ΕΠΙΛΟΓΗ ΣΤΕΡΕΟΥ:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setShapeMode('cuboid')}
                    className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center ${
                      shapeMode === 'cuboid'
                        ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    📦 Παραλληλεπίπεδο
                  </button>
                  <button
                    type="button"
                    onClick={() => setShapeMode('cube')}
                    className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center ${
                      shapeMode === 'cube'
                        ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    🎲 Κύβος (α³)'
                  </button>
                </div>
              </div>

              {/* Slider 1: Μήκος (ή Ακμή Κύβου) */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>{shapeMode === 'cube' ? 'ΑΚΜΗ ΚΥΒΟΥ (α):' : 'ΜΗΚΟΣ (α):'}</span>
                  <span className="font-mono text-base font-black text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {dimA} cm
                  </span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={25}
                  step={1}
                  value={dimA}
                  onChange={(e) => setDimA(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
              </div>

              {/* Sliders 2 & 3 μόνο αν είναι παραλληλεπίπεδο */}
              {shapeMode === 'cuboid' && (
                <>
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                    <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                      <span>ΠΛΑΤΟΣ (β):</span>
                      <span className="font-mono text-base font-black text-sky-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                        {dimB} cm
                      </span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={20}
                      step={1}
                      value={dimB}
                      onChange={(e) => setDimB(Number(e.target.value))}
                      className="w-full accent-sky-600 cursor-pointer touch-manipulation"
                    />
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                    <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                      <span>ΥΨΟΣ (γ):</span>
                      <span className="font-mono text-base font-black text-amber-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                        {dimC} cm
                      </span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={20}
                      step={1}
                      value={dimC}
                      onChange={(e) => setDimC(Number(e.target.value))}
                      className="w-full accent-amber-600 cursor-pointer touch-manipulation"
                    />
                  </div>
                </>
              )}

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 font-mono space-y-1">
                {shapeMode === 'cube' ? (
                  <div>• V ＝ α³ ＝ {dimA} · {dimA} · {dimA} ＝ <strong>{formatNum(volumeCm3)} cm³</strong></div>
                ) : (
                  <div>• V ＝ α · β · γ ＝ {dimA} · {dimB} · {dimC} ＝ <strong>{formatNum(volumeCm3)} cm³</strong></div>
                )}
                <div>• Εμβαδόν Βάσης: {effectiveDims.a} · {effectiveDims.b} ＝ <strong>{formatNum(baseAreaCm2)} cm²</strong></div>
              </div>
            </div>

            {/* Αποτελέσματα Όγκου & Χωρητικότητας (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 p-5 sm:p-7 rounded-3xl border border-slate-800 text-white space-y-4">
              <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider text-center">
                ΥΠΟΛΟΓΙΣΜΕΝΟΣ ΟΓΚΟΣ &amp; ΧΩΡΗΤΙΚΟΤΗΤΑ
              </span>

              <div className="text-center py-2">
                <span className="text-3xl sm:text-4xl font-black font-mono text-emerald-400 block">
                  {formatNum(volumeCm3)} cm³
                </span>
                <span className="text-xs text-slate-400 block mt-1 font-sans">
                  {shapeMode === 'cube' ? `Κύβος ακμής ${dimA} cm` : `Ορθογώνιο ${dimA} × ${dimB} × ${dimC} cm`}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs sm:text-sm pt-2 border-t border-slate-800">
                <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 text-center">
                  <span className="text-slate-400 font-sans text-xs block">Σε dm³ (ή Λίτρα L):</span>
                  <span className="text-xl font-black text-amber-400 block mt-0.5">
                    {formatNum(volumeDm3)} L
                  </span>
                  <span className="text-[11px] text-slate-400 font-sans block mt-0.5">
                    {formatNum(volumeCm3)} : 1.000 ＝ {formatNum(volumeDm3)} dm³
                  </span>
                </div>

                <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 text-center">
                  <span className="text-slate-400 font-sans text-xs block">Σε m³ (: 1.000.000):</span>
                  <span className="text-xl font-black text-sky-400 block mt-0.5">
                    {formatNum(volumeM3)} m³
                  </span>
                  <span className="text-[11px] text-slate-400 font-sans block mt-0.5">
                    Κυβικά μέτρα
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 text-center pt-1 font-sans">
                💡 1 dm³ ισούται ακριβώς με 1 Λίτρο (L). Άρα το δοχείο χωράει {formatNum(volumeDm3)} λίτρα νερού!
              </div>
            </div>

          </div>
        </section>

        {/* 5. ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ ΚΑΘΗΜΕΡΙΝΗΣ ΖΩΗΣ */}
        <section className="space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight">
              Λυμένα Προβλήματα με Όγκο Κύβου &amp; Παραλληλεπιπέδου
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Εφαρμογές των τύπων V ＝ α³ και V ＝ α · β · γ σε ενυδρεία και δεξαμενές.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ΠΡΟΒΛΗΜΑ 1 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-900 text-xs font-black rounded-lg uppercase">
                  ΠΡΟΒΛΗΜΑ 1: ΕΝΥΔΡΕΙΟ ΣΕ ΛΙΤΡΑ
                </span>
                <span className="text-xs font-bold text-slate-400">Ορθογώνιο Παραλληλεπίπεδο</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Υπολογισμός Χωρητικότητας Ενυδρείου
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ένα ενυδρείο έχει μήκος <strong>80 cm</strong>, πλάτος <strong>40 cm</strong> και ύψος <strong>50 cm</strong>. 
                Πόσα λίτρα (L) νερού περιέχει όταν γεμίσει μέχρι πάνω;
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΔΕΔΟΜΕΝΑ ΠΡΟΒΛΗΜΑΤΟΣ
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Μήκος (α)</span> 80 cm ＝ 8 dm
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Πλάτος (β)</span> 40 cm ＝ 4 dm
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Ύψος (γ)</span> 50 cm ＝ 5 dm
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήματα Επίλυσης:</span>
                  <div>• <strong>1ος Τρόπος (μετατροπή σε dm):</strong> 8 dm · 4 dm · 5 dm ＝ <strong>160 dm³</strong>.</div>
                  <div>• <strong>Επειδή 1 dm³ ＝ 1 L:</strong> Το ενυδρείο χωράει <strong className="text-blue-700">160 L νερού</strong>.</div>
                  <div>• <strong>2ος Τρόπος (με cm³):</strong> 80 · 40 · 50 ＝ 160.000 cm³. Διαιρούμε με το 1.000: 160.000 : 1.000 ＝ <strong className="text-blue-700">160 L</strong>.</div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 font-medium">
                💡 Η μετατροπή των εκατοστών (cm) σε δεκατόμετρα (dm) πριν τον πολλαπλασιασμό δίνει κατευθείαν το αποτέλεσμα σε λίτρα!
              </div>
            </article>

            {/* ΠΡΟΒΛΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-lg uppercase">
                  ΠΡΟΒΛΗΜΑ 2: ΕΥΡΕΣΗ ΥΨΟΥΣ
                </span>
                <span className="text-xs font-bold text-slate-400">Αντίστροφο Πρόβλημα</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Εύρεση του Ύψους σε Δεξαμενή από τον Όγκο
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Μια αποθήκη έχει όγκο <strong>180 m³</strong>. Το δάπεδό της (η βάση) έχει μήκος <strong>10 m</strong> και πλάτος <strong>6 m</strong>. 
                Πόσο είναι το ύψος της αποθήκης;
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΣΤΟΙΧΕΙΑ ΥΠΟΛΟΓΙΣΜΟΥ
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold text-[11px]">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Όγκος (V)</span> 180 m³
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Δάπεδο (α · β)</span> 10 m · 6 m
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Τύπος ύψους</span> γ ＝ V : Εβ
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήματα Επίλυσης:</span>
                  <div>• <strong>Εμβαδόν δαπέδου (βάσης):</strong> Εβ ＝ 10 · 6 ＝ <strong>60 m²</strong>.</div>
                  <div>• <strong>Υπολογισμός ύψους:</strong> γ ＝ V : Εβ ＝ 180 : 60 ＝ <strong className="text-amber-700">3 m</strong>.</div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 font-medium">
                ⚡ Επαλήθευση: V ＝ α · β · γ ＝ 10 · 6 · 3 ＝ 60 · 3 ＝ 180 m³!
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
                  <strong>Μην μπερδεύετε το εμβαδόν επιφάνειας (cm²) με τον όγκο (cm³):</strong> Το εμβαδόν μετράει το εξωτερικό τύλιγμα στις 2 διαστάσεις. Ο όγκος μετράει το εσωτερικό γέμισμα στις 3 διαστάσεις (Μήκος · Πλάτος · Ύψος).
                </li>
                <li>
                  <strong>Στον κύβο είναι α · α · α (α³):</strong> Αν η ακμή είναι 4 cm, ο όγκος είναι 4 · 4 · 4 ＝ 64 cm³ (και όχι 4 · 3 ＝ 12)!
                </li>
                <li>
                  <strong>Ίδιες μονάδες μέτρησης:</strong> Αν οι δύο διαστάσεις είναι σε μέτρα και η τρίτη σε εκατοστά, πρέπει οπωσδήποτε να μετατρέψετε πρώτα και την τρίτη διάσταση σε μέτρα πριν κάνετε τον πολλαπλασιασμό.
                </li>
                <li>
                  <strong>1 dm³ ＝ 1 L:</strong> Να θυμάστε πάντοτε ότι 1 κυβικό δεκατόμετρο είναι ακριβώς 1 λίτρο, και 1 κυβικό μέτρο είναι 1.000 λίτρα.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 7. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στον Όγκο Κύβου &amp; Παραλληλεπιπέδου!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε 12 διαδραστικές ασκήσεις με υπολογισμούς όγκου (α³ και α · β · γ), εύρεση άγνωστων διαστάσεων και μετατροπές σε λίτρα για τη ΣΤ' Δημοτικού.
            </p>
          </div>

          <Link
            href="/st-dimotikou/81-ogkos-cube-ask"
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
