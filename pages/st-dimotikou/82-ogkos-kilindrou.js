// pages/st-dimotikou/82-ogkos-kilindrou.js
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

export default function OgkosKilindrouTheoriaPage() {
  // -------------------------------------------------------------------------
  // Εργαστήριο 1: Διαδραστική Στοίβαξη Κυκλικών Στρώσεων (SVG 3D)
  // -------------------------------------------------------------------------
  const [layersCount, setLayersCount] = useState(5); // Στρώσεις ύψους υ (1 έως 8)
  const [labRadius, setLabRadius] = useState(4); // Ακτίνα ρ (2 έως 6)

  const labBaseArea = useMemo(() => 3.14 * labRadius * labRadius, [labRadius]);
  const labVolume = useMemo(() => labBaseArea * layersCount, [labBaseArea, layersCount]);

  // -------------------------------------------------------------------------
  // Εργαστήριο 2: Δυναμικός Υπολογιστής Όγκου & Χωρητικότητας Κυλίνδρου
  // -------------------------------------------------------------------------
  const [calcRadius, setCalcRadius] = useState(6); // Ακτίνα ρ σε cm
  const [calcHeight, setCalcHeight] = useState(15); // Ύψος υ σε cm
  const piVal = 3.14;

  const diameter = useMemo(() => calcRadius * 2, [calcRadius]);
  const baseAreaCm2 = useMemo(() => piVal * calcRadius * calcRadius, [calcRadius]);
  const volumeCm3 = useMemo(() => baseAreaCm2 * calcHeight, [baseAreaCm2, calcHeight]);
  const volumeDm3 = useMemo(() => volumeCm3 / 1000, [volumeCm3]); // 1 dm³ = 1 L
  const volumeLiters = useMemo(() => volumeDm3, [volumeDm3]);
  const volumeM3 = useMemo(() => volumeCm3 / 1000000, [volumeCm3]);

  return (
    <Layout
      title="Όγκος Κυλίνδρου &amp; Χωρητικότητα σε Λίτρα - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μαθαίνουμε πώς υπολογίζουμε τον όγκο κυλίνδρου με τον τύπο V ＝ π · ρ² · υ, την οπτική απόδειξη με κυκλικές στρώσεις και τις εφαρμογές σε λίτρα."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/82-ogkos-kilindrou-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 82 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Όγκος Κυλίνδρου • Εμβαδόν Βάσης, Ύψος &amp; Χωρητικότητα σε Λίτρα
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Ανακαλύπτουμε πώς υπολογίζεται ο όγκος κάθε κυλινδρικού δοχείου με τον τύπο <strong>V ＝ π · ρ² · υ</strong>, 
              κατανοούμε τη γεωμετρική του ερμηνεία ως <strong>στοίβαξη κυκλικών στρώσεων</strong>, 
              και μαθαίνουμε πώς μετατρέπουμε εύκολα τον όγκο σε <strong>λίτρα (L)</strong> για δεξαμενές, θερμοσίφωνες και ποτήρια!
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία, Τύπος V ＝ π · ρ² · υ, Στοίβαξη Δίσκων, Χωρητικότητα σε Λίτρα &amp; SVG</span>
            </div>
            <Link
              href="/st-dimotikou/82-ogkos-kilindrou-ask"
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
              Ο Όγκος Κυλίνδρου σε 4 Βήματα
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Από τον βασικό τύπο μέχρι την οπτική αναπαράσταση και τον υπολογισμό υγρών.
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
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Ο Τύπος</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Πώς Βρίσκουμε τον Όγκο;
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Όπως και στο πρίσμα, ο όγκος του κυλίνδρου ισούται με το <strong>εμβαδόν της βάσης του επί το ύψος</strong>:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 text-center font-mono">
                  <div className="text-indigo-900 font-black text-base sm:text-lg">
                    Όγκος ＝ Εμβαδόν Βάσης · Ύψος
                  </div>
                  <div className="text-slate-700 font-bold">
                    V ＝ Εβ · υ
                  </div>
                  <div className="text-emerald-900 font-black text-base pt-1 border-t border-slate-200">
                    V ＝ π · ρ² · υ ＝ 3,14 · ρ · ρ · υ
                  </div>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Επειδή η βάση είναι κύκλος με εμβαδόν <strong>π · ρ²</strong>, ο όγκος είναι απλά <strong>(π · ρ²) · υ</strong>!
              </div>
            </article>

            {/* ΒΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Οπτική Ερμηνεία</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Στοίβαξη Κυκλικών Κερμάτων
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Φανταστείτε ότι στοιβάζουμε πολλά ίδια στρογγυλά κέρματα ή κυκλικούς δίσκους το ένα πάνω στο άλλο:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2">
                  <div>
                    1. Κάθε δίσκος έχει εμβαδόν επιφάνειας ίσο με <strong>π · ρ²</strong>.
                  </div>
                  <div>
                    2. Όσο προσθέτουμε δίσκους καθ' ύψος, η στοίβα ψηλώνει και αποκτά ύψος <strong>υ</strong>.
                  </div>
                  <div className="text-amber-950 font-bold pt-1 border-t border-slate-200">
                    Ο συνολικός χώρος που καταλαμβάνει ολόκληρη η στήλη είναι το εμβαδόν του ενός δίσκου επί το ύψος: <strong>π · ρ² · υ</strong>!
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Όπως στο ορθογώνιο στρώναμε τετραγωνάκια, στον κύλινδρο στοιβάζουμε κυκλικούς δίσκους!
              </div>
            </article>

            {/* ΒΗΜΑ 3 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Χωρητικότητα</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Από τα cm³ και m³ στα Λίτρα
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Τα κυλινδρικά δοχεία χρησιμοποιούνται σχεδόν πάντοτε για υγρά (νερό, λάδι, γάλα, πετρέλαιο):
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 font-mono">
                  <div className="text-indigo-950 font-black">
                    ★ 1 dm³ ＝ 1 L (Λίτρο)
                  </div>
                  <div>• 1 m³ ＝ 1.000 dm³ ＝ <strong>1.000 L</strong></div>
                  <div>• 1.000 cm³ ＝ 1 dm³ ＝ <strong>1 L</strong> (1 cm³ ＝ 1 mL)</div>
                  <div className="text-[11px] text-slate-600 font-sans pt-1 border-t border-slate-200">
                    Αν υπολογίσετε τον όγκο σε dm³, γνωρίζετε κατευθείαν πόσα λίτρα χωράει το δοχείο!
                  </div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Αν οι διαστάσεις δίνονται σε μέτρα, πολλαπλασιάζουμε τα m³ με το 1.000 για να βρούμε τα λίτρα!
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
                  Αν γνωρίζουμε τον όγκο (V) ενός κυλινδρικού δοχείου και μία από τις διαστάσεις του:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 font-mono">
                  <div className="text-emerald-950 font-bold">
                    • Ύψος: υ ＝ V : Εβ ＝ V : (π · ρ²)
                  </div>
                  <div className="text-emerald-950 font-bold">
                    • Εμβαδόν Βάσης: Εβ ＝ V : υ
                  </div>
                  <p className="text-[11px] text-slate-600 font-sans pt-1">
                    Παράδειγμα: Αν V ＝ 314 cm³ και Εβ ＝ 31,4 cm², τότε υ ＝ 314 : 31,4 ＝ <strong>10 cm</strong>.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Θυμήσου: Αν δίνεται η διάμετρος (δ), πρώτα βρίσκουμε την ακτίνα: <strong>ρ ＝ δ : 2</strong>!
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΣΤΟΙΒΑΞΗ ΚΥΚΛΙΚΩΝ ΣΤΡΩΣΕΩΝ ΣΕ 3D (SVG) */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1</span>
            </div>
            <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Πώς οι Κυκλικοί Δίσκοι Χτίζουν τον Όγκο του Κυλίνδρου; (SVG)
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Άλλαξε την ακτίνα (ρ) και το πλήθος των στρώσεων (ύψος υ) για να δεις πώς οι δίσκοι στοιβάζονται και επαληθεύουν τον τύπο V ＝ (π · ρ²) · υ:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">

            {/* Sliders Ακτίνας & Στρώσεων (5 στήλες) */}
            <div className="lg:col-span-5 space-y-3.5">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>ΑΚΤΙΝΑ ΒΑΣΗΣ (ρ):</span>
                  <span className="font-mono text-base font-black text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {labRadius} cm
                  </span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={6}
                  step={1}
                  value={labRadius}
                  onChange={(e) => setLabRadius(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>ΥΨΟΣ ΣΤΡΩΣΕΩΝ (υ):</span>
                  <span className="font-mono text-base font-black text-sky-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {layersCount} cm ({layersCount} δίσκοι)
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={8}
                  step={1}
                  value={layersCount}
                  onChange={(e) => setLayersCount(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer touch-manipulation"
                />
              </div>

              {/* Κάρτα Επεξήγησης */}
              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 space-y-1.5 text-xs sm:text-sm font-mono">
                <div>• Εμβαδόν 1 δίσκου (βάση): 3,14 · {labRadius} · {labRadius} ＝ <strong>{formatNum(labBaseArea)} cm²</strong></div>
                <div>• Πλήθος στρώσεων (ύψος): <strong>{layersCount} cm</strong></div>
                <div className="text-indigo-950 font-black text-sm pt-1 border-t border-sky-200/60">
                  • Συνολικός Όγκος: {formatNum(labBaseArea)} · {layersCount} ＝ <strong>{formatNum(labVolume)} cm³</strong>
                </div>
              </div>
            </div>

            {/* SVG Visualizer Στοίβαξης Κερμάτων / Δίσκων (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 min-h-[350px] p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center">
              <svg
                viewBox="0 0 380 260"
                className="w-full max-w-[380px] h-auto select-none overflow-visible"
              >
                {/* 
                  Στοίβαξη κυκλικών δίσκων (ελλείψεων σε προοπτική) από κάτω προς τα πάνω
                  Κέντρο: (190, 200). Κάθε στρώση έχει πάχος 16px
                */}
                {Array.from({ length: layersCount }).map((_, idx) => {
                  const cy = 200 - idx * 16;
                  const rx = labRadius * 12; // Κλίμακα ακτίνας
                  const ry = rx * 0.35; // Προοπτική έλλειψης
                  const isTop = idx === layersCount - 1;

                  return (
                    <g key={`layer-${idx}`}>
                      {/* Πλαϊνό σώμα του δίσκου πάχους 14px */}
                      <path
                        d={`
                          M ${190 - rx} ${cy} 
                          A ${rx} ${ry} 0 0 0 ${190 + rx} ${cy} 
                          L ${190 + rx} ${cy + 12} 
                          A ${rx} ${ry} 0 0 1 ${190 - rx} ${cy + 12} 
                          Z
                        `}
                        fill={isTop ? 'rgba(56, 189, 248, 0.9)' : 'rgba(14, 165, 233, 0.75)'}
                        stroke="#0284c7"
                        strokeWidth="1"
                      />
                      {/* Πάνω επιφάνεια του δίσκου */}
                      <ellipse
                        cx="190"
                        cy={cy}
                        rx={rx}
                        ry={ry}
                        fill={isTop ? 'rgba(125, 211, 252, 0.95)' : 'rgba(56, 189, 248, 0.8)'}
                        stroke="#38bdf8"
                        strokeWidth="1.5"
                      />
                    </g>
                  );
                })}

                {/* Ενδείξεις Ακτίνας ρ και Ύψους υ */}
                {/* Ακτίνα στην πάνω στρώση */}
                <g>
                  {(() => {
                    const topCy = 200 - (layersCount - 1) * 16;
                    const topRx = labRadius * 12;
                    return (
                      <>
                        <line x1="190" y1={topCy} x2={190 + topRx} y2={topCy} stroke="#f59e0b" strokeWidth="2" />
                        <circle cx="190" cy={topCy} r="2.5" fill="#ffffff" />
                        <text x={190 + topRx / 2} y={topCy - 7} fill="#f59e0b" fontSize="11" fontWeight="bold" textAnchor="middle">
                          ρ ＝ {labRadius} cm
                        </text>

                        {/* Ύψος υ στα δεξιά */}
                        <line x1={190 + topRx + 16} y1={topCy} x2={190 + topRx + 16} y2={212} stroke="#ffffff" strokeWidth="1.5" />
                        <text x={190 + topRx + 26} y={(topCy + 212) / 2 + 4} fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="start">
                          υ ＝ {layersCount} cm
                        </text>
                      </>
                    );
                  })()}
                </g>
              </svg>

              <div className="mt-3 text-center text-xs text-slate-400 font-mono">
                {layersCount} στρώσεις των {formatNum(labBaseArea)} cm² ＝ {formatNum(labVolume)} cm³ όγκου!
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΥΠΟΛΟΓΙΣΤΗΣ ΟΓΚΟΥ ΚΥΛΙΝΔΡΟΥ & ΧΩΡΗΤΙΚΟΤΗΤΑΣ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
              <span>📐 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΥΠΟΛΟΓΙΣΤΗΣ ΧΩΡΗΤΙΚΟΤΗΤΑΣ</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Πόσα Λίτρα Χωράει ένα Κυλινδρικό Δοχείο;
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Άλλαξε την ακτίνα (ρ) και το ύψος (υ) σε cm για να υπολογίσεις τον όγκο και τη χωρητικότητα σε λίτρα (L):
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

            {/* Sliders Ακτίνας ρ & Ύψους υ (5 στήλες) */}
            <div className="lg:col-span-5 space-y-3.5">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>ΑΚΤΙΝΑ ΒΑΣΗΣ (ρ):</span>
                  <span className="font-mono text-base font-black text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {calcRadius} cm
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  step={1}
                  value={calcRadius}
                  onChange={(e) => setCalcRadius(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>1 cm</span>
                  <span>Διάμετρος: {diameter} cm</span>
                  <span>20 cm</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>ΥΨΟΣ ΚΥΛΙΝΔΡΟΥ (υ):</span>
                  <span className="font-mono text-base font-black text-sky-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {calcHeight} cm
                  </span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={40}
                  step={1}
                  value={calcHeight}
                  onChange={(e) => setCalcHeight(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer touch-manipulation"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 font-mono space-y-1">
                <div>• Εμβαδόν βάσης: π · ρ² ＝ 3,14 · {calcRadius} · {calcRadius} ＝ <strong>{formatNum(baseAreaCm2)} cm²</strong></div>
                <div>• Όγκος (Εβ · υ): {formatNum(baseAreaCm2)} · {calcHeight} ＝ <strong>{formatNum(volumeCm3)} cm³</strong></div>
              </div>
            </div>

            {/* Αποτελέσματα Όγκου & Χωρητικότητας (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 p-5 sm:p-7 rounded-3xl border border-slate-800 text-white space-y-4">
              <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider text-center">
                ΧΩΡΗΤΙΚΟΤΗΤΑ ΚΥΛΙΝΔΡΙΚΟΥ ΔΟΧΕΙΟΥ ΣΕ ΛΙΤΡΑ
              </span>

              <div className="text-center py-2">
                <span className="text-3xl sm:text-4xl font-black font-mono text-emerald-400 block">
                  {formatNum(volumeLiters.toFixed(2))} L (Λίτρα)
                </span>
                <span className="text-xs text-slate-400 block mt-1 font-sans">
                  Ισοδυναμεί ακριβώς με {formatNum(volumeDm3.toFixed(2))} κυβικά δεκατόμετρα (dm³)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs sm:text-sm pt-2 border-t border-slate-800">
                <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 text-center">
                  <span className="text-slate-400 font-sans text-xs block">Όγκος σε cm³ (ή mL):</span>
                  <span className="text-xl font-black text-amber-400 block mt-0.5">
                    {formatNum(volumeCm3)} cm³
                  </span>
                  <span className="text-[11px] text-slate-400 font-sans block mt-0.5">
                    {formatNum(volumeCm3)} : 1.000 ＝ {formatNum(volumeDm3.toFixed(2))} L
                  </span>
                </div>

                <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 text-center">
                  <span className="text-slate-400 font-sans text-xs block">Σε m³ (: 1.000.000):</span>
                  <span className="text-xl font-black text-sky-400 block mt-0.5">
                    {formatNum(volumeM3.toFixed(4))} m³
                  </span>
                  <span className="text-[11px] text-slate-400 font-sans block mt-0.5">
                    Κυβικά μέτρα
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 text-center pt-1 font-sans">
                💡 Θυμήσου: 1 dm³ ＝ 1 Λίτρο (L). Άρα μετατρέπουμε τα cm³ σε dm³ διαιρώντας με το 1.000!
              </div>
            </div>

          </div>
        </section>

        {/* 5. ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ ΚΑΘΗΜΕΡΙΝΗΣ ΖΩΗΣ */}
        <section className="space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight">
              Λυμένα Προβλήματα με Όγκο Κυλίνδρου
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Εφαρμογές του τύπου V ＝ π · ρ² · υ σε θερμοσίφωνες, κατσαρόλες και βαρέλια.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ΠΡΟΒΛΗΜΑ 1 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-900 text-xs font-black rounded-lg uppercase">
                  ΠΡΟΒΛΗΜΑ 1: ΘΕΡΜΟΣΙΦΩΝΑΣ
                </span>
                <span className="text-xs font-bold text-slate-400">Υπολογισμός Λίτρων</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Χωρητικότητα Κυλινδρικού Boiler σε Λίτρα
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ένας ηλιακός θερμοσίφωνας έχει κυλινδρικό δοχείο με διάμετρο βάσης <strong>50 cm</strong> και μήκος (ύψος) <strong>120 cm</strong>. 
                Πόσα λίτρα (L) ζεστού νερού χωράει ο θερμοσίφωνας όταν γεμίσει πλήρως; (π ＝ 3,14)
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΔΕΔΟΜΕΝΑ ΠΡΟΒΛΗΜΑΤΟΣ
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Διάμετρος (δ)</span> 50 cm
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Ακτίνα (ρ)</span> 50 : 2 ＝ 25 cm ＝ 2,5 dm
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Ύψος (υ)</span> 120 cm ＝ 12 dm
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήματα Επίλυσης:</span>
                  <div>• <strong>Βρίσκουμε την ακτίνα ρ:</strong> ρ ＝ δ : 2 ＝ 50 : 2 ＝ 25 cm ＝ <strong>2,5 dm</strong>.</div>
                  <div>• <strong>Μετατρέπουμε το ύψος σε dm:</strong> 120 cm ＝ <strong>12 dm</strong>.</div>
                  <div>• <strong>Εμβαδόν βάσης:</strong> 3,14 · 2,5 · 2,5 ＝ 3,14 · 6,25 ＝ <strong>19,625 dm²</strong>.</div>
                  <div>• <strong>Όγκος σε dm³ (λίτρα):</strong> 19,625 · 12 ＝ <strong className="text-blue-700">235,5 L</strong>.</div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 font-medium">
                💡 Μετατρέποντας τις διαστάσεις σε dm (2,5 dm και 12 dm), ο όγκος υπολογίζεται κατευθείαν σε λίτρα!
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
                Εύρεση του Ύψους σε Κυλινδρικό Δοχείο από τον Όγκο
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Μια κυλινδρική κατσαρόλα έχει χωρητικότητα <strong>6,28 L (6.280 cm³)</strong>. 
                Αν η ακτίνα της βάσης της είναι <strong>10 cm</strong>, πόσο είναι το ύψος (το βάθος) της κατσαρόλας; (π ＝ 3,14)
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΣΤΟΙΧΕΙΑ ΥΠΟΛΟΓΙΣΜΟΥ
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold text-[11px]">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Όγκος (V)</span> 6.280 cm³
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Ακτίνα (ρ)</span> 10 cm
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Τύπος ύψους</span> υ ＝ V : (π · ρ²)
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήματα Επίλυσης:</span>
                  <div>• <strong>Εμβαδόν βάσης:</strong> Εβ ＝ 3,14 · 10 · 10 ＝ 3,14 · 100 ＝ <strong>314 cm²</strong>.</div>
                  <div>• <strong>Υπολογισμός ύψους:</strong> υ ＝ V : Εβ ＝ 6.280 : 314 ＝ <strong className="text-amber-700">20 cm</strong>.</div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 font-medium">
                ⚡ Επαλήθευση: V ＝ π · ρ² · υ ＝ 314 · 20 ＝ 6.280 cm³ ＝ 6,28 dm³ ＝ 6,28 L!
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
                  <strong>Μην μπερδεύετε τον όγκο με την παράπλευρη επιφάνεια:</strong> Η παράπλευρη επιφάνεια είναι <strong>(2 · π · ρ) · υ</strong> και μετριέται σε cm² (επιφάνεια). Ο όγκος είναι <strong>(π · ρ²) · υ</strong> και μετριέται σε cm³ ή λίτρα (χώρος).
                </li>
                <li>
                  <strong>Προσοχή στο ρ²:</strong> Το ρ² σημαίνει <strong>ρ · ρ</strong> (η ακτίνα πολλαπλασιασμένη με τον εαυτό της). Αν η ακτίνα είναι 4 cm, τότε ρ² ＝ 4 · 4 ＝ 16 cm² (και όχι 4 · 2 ＝ 8).
                </li>
                <li>
                  <strong>Αν δίνεται η διάμετρος:</strong> Μην ξεχνάτε να διαιρέσετε πρώτα με το 2 για να βρείτε την ακτίνα ρ: <strong>ρ ＝ δ : 2</strong>.
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
              Ώρα για Εξάσκηση στον Όγκο Κυλίνδρου!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε 12 διαδραστικές ασκήσεις με υπολογισμούς όγκου κυλίνδρου (V ＝ π · ρ² · υ), εύρεση ύψους και χωρητικότητα σε λίτρα για τη ΣΤ' Δημοτικού.
            </p>
          </div>

          <Link
            href="/st-dimotikou/82-ogkos-kilindrou-ask"
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
