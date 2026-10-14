// pages/st-dimotikou/76-embadon-kiklou.js
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

export default function EmbadonKiklouTheoriaPage() {
  // -------------------------------------------------------------------------
  // Εργαστήριο 1: Οπτική Απόδειξη Αναδιάταξης Τομέων (SVG)
  // -------------------------------------------------------------------------
  // Slider προόδου: 0% (κλειστός κύκλος) έως 100% (ορθογώνιο παραλληλόγραμμο)
  const [unfoldProgress, setUnfoldProgress] = useState(0);

  const radiusR = 60; // Ακτίνα ρ = 60px
  const sectorW = (Math.PI * radiusR) / 4; // Πλάτος βάσης κάθε τομέα

  // -------------------------------------------------------------------------
  // Εργαστήριο 2: Δυναμικός Υπολογιστής Εμβαδού & Περιφέρειας
  // -------------------------------------------------------------------------
  const [radiusInput, setRadiusInput] = useState(5); // Ακτίνα ρ σε cm
  const piVal = 3.14;

  const diameter = useMemo(() => radiusInput * 2, [radiusInput]);
  const perimeterCm = useMemo(() => 2 * piVal * radiusInput, [radiusInput]);
  const areaCm2 = useMemo(() => piVal * radiusInput * radiusInput, [radiusInput]);
  const areaMm2 = useMemo(() => areaCm2 * 100, [areaCm2]);
  const areaDm2 = useMemo(() => areaCm2 / 100, [areaCm2]);
  const areaM2 = useMemo(() => areaCm2 / 10000, [areaCm2]);

  return (
    <Layout
      title="Εμβαδόν Κύκλου &amp; Μονάδες Μέτρησης - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μαθαίνουμε πώς υπολογίζουμε το εμβαδόν κύκλου Ε ＝ π · ρ², την απόδειξη με αναδιάταξη τομέων σε ορθογώνιο και τις μετατροπές μονάδων επιφάνειας."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/76-embadon-kiklou-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 76 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Εμβαδόν Κύκλου • Ακτίνα ρ, ο Αριθμός π &amp; Μονάδες Επιφάνειας
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Ανακαλύπτουμε πώς υπολογίζεται η επιφάνεια του κύκλου με τον τύπο <strong>Ε ＝ π · ρ²</strong>, 
              βλέπουμε ζωντανά τη διάσημη απόδειξη όπου οι κυκλικοί τομείς αναδιατάσσονται σχηματίζοντας <strong>ορθογώνιο</strong>, 
              και εξετάζουμε τη σχέση ανάμεσα στην <strong>περίμετρο</strong> και το <strong>εμβαδόν</strong>!
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία, Οπτική Απόδειξη Αναδιάταξης Τομέων σε Ορθογώνιο &amp; SVG</span>
            </div>
            <Link
              href="/st-dimotikou/76-embadon-kiklou-ask"
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
              Το Εμβαδόν Κύκλου σε 4 Βήματα
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Από τον βασικό τύπο μέχρι τη γεωμετρική απόδειξη και τα σύνθετα κυκλικά σχήματα.
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
                  Πώς Υπολογίζουμε το Εμβαδόν;
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Το εμβαδόν του κυκλικού δίσκου εξαρτάται αποκλειστικά από την <strong>ακτίνα (ρ)</strong> του κύκλου:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 text-center font-mono">
                  <div className="text-indigo-900 font-black text-base sm:text-lg">
                    Εμβαδόν ＝ π · ρ²
                  </div>
                  <div className="text-slate-700 font-bold">
                    Ε ＝ 3,14 · ρ · ρ
                  </div>
                  <p className="text-[11px] text-slate-600 font-sans text-left pt-1">
                    • <strong>π:</strong> Ο μαθηματικός αριθμός <strong>π ≈ 3,14</strong>.<br />
                    • <strong>ρ²:</strong> Το τετράγωνο της ακτίνας (<strong>ρ · ρ</strong>, δηλαδή η ακτίνα πολλαπλασιασμένη με τον εαυτό της, όχι επί 2!).
                  </p>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Προσοχή: ρ² σημαίνει <strong>ρ · ρ</strong>. Για παράδειγμα, αν ρ ＝ 4 cm, τότε ρ² ＝ 4 · 4 ＝ 16 cm² (και όχι 8 cm²)!
              </div>
            </article>

            {/* ΒΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Γεωμετρική Απόδειξη</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Γιατί Ισχύει ο Τύπος Ε ＝ π · ρ²;
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Αν κόψουμε έναν κύκλο σε πολλούς μικρούς τομείς και τους τοποθετήσουμε εναλλάξ:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2">
                  <div>
                    1. <strong>Σχήμα:</strong> Οι τομείς σχηματίζουν ένα ορθογώνιο παραλληλόγραμμο.
                  </div>
                  <div>
                    2. <strong>Ύψος:</strong> Το ύψος του ορθογωνίου είναι η ακτίνα <strong>ρ</strong>.
                  </div>
                  <div>
                    3. <strong>Βάση:</strong> Η βάση του είναι το μισό της περιφέρειας του κύκλου, δηλαδή <strong>π · ρ</strong>.
                  </div>
                  <div className="text-amber-950 font-bold pt-1 border-t border-slate-200 font-mono text-center">
                    Εμβαδόν ＝ Βάση · Ύψος ＝ (π · ρ) · ρ ＝ <strong>π · ρ²</strong>!
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Όσο περισσότερους τομείς κόβουμε, τόσο πιο τέλειο γίνεται το ορθογώνιο με εμβαδόν π · ρ²!
              </div>
            </article>

            {/* ΒΗΜΑ 3 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Ακτίνα vs Διάμετρος</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Τι Γίνεται όταν Ξέρουμε τη Διάμετρο;
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Στα προβλήματα συχνά δίνεται η <strong>διάμετρος (δ)</strong> αντί για την ακτίνα:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 font-mono">
                  <div className="text-indigo-950 font-bold">
                    1. Βρίσκουμε πρώτα την ακτίνα: ρ ＝ δ : 2
                  </div>
                  <div className="text-indigo-950 font-bold">
                    2. Εφαρμόζουμε τον τύπο: Ε ＝ 3,14 · ρ · ρ
                  </div>
                  <p className="text-[11px] text-slate-600 font-sans pt-1">
                    Παράδειγμα: Αν η διάμετρος είναι 10 cm, τότε η ακτίνα είναι ρ ＝ 5 cm και Ε ＝ 3,14 · 5 · 5 ＝ <strong>78,5 cm²</strong>.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Ποτέ μην βάζετε τη διάμετρο στον τύπο του εμβαδού! Πρώτα τη διαιρούμε διά 2 για να βρούμε την ακτίνα ρ.
              </div>
            </article>

            {/* ΒΗΜΑ 4 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Ημικύκλιο &amp; Δακτύλιος</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Σύνθετα Κυκλικά Σχήματα
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Ειδικές κυκλικές επιφάνειες που συναντάμε συχνά:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 font-mono">
                  <div>
                    • <strong>Ημικύκλιο:</strong> Είναι ακριβώς το μισό του κύκλου: <strong>Εημικ ＝ (π · ρ²) : 2</strong>.
                  </div>
                  <div>
                    • <strong>Κυκλικός δακτύλιος (ροδέλα):</strong> Αφαιρούμε το εμβαδόν του μικρού εσωτερικού κύκλου από τον μεγάλο: <strong>Εδακτ ＝ Εμεγ － Εμικ</strong>.
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Μονάδες: 1 m² ＝ 100 dm² ＝ 10.000 cm². Όπως σε κάθε επιφάνεια, οι μετατροπές γίνονται ανά 100!
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΑΝΑΔΙΑΤΑΞΗ ΤΟΜΕΩΝ ΣΕ ΟΡΘΟΓΩΝΙΟ (SVG) */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1</span>
            </div>
            <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Πώς ο Κύκλος Γίνεται Ορθογώνιο; (SVG)
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Σύρε την μπάρα προόδου: Παρατήρησε πώς οι κυκλικοί τομείς ανοίγουν και «κουμπώνουν» εναλλάξ σχηματίζοντας ορθογώνιο με βάση (π · ρ) και ύψος (ρ):
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">

            {/* Slider & Επεξήγηση (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>ΑΝΑΔΙΑΤΑΞΗ ΤΟΜΕΩΝ:</span>
                  <span className="font-mono text-base font-black text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {unfoldProgress}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={unfoldProgress}
                  onChange={(e) => setUnfoldProgress(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>0% (Κύκλος)</span>
                  <span>50% (Άνοιγμα)</span>
                  <span>100% (Ορθογώνιο)</span>
                </div>
              </div>

              {/* Κάρτα Επεξήγησης */}
              <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 space-y-2 text-xs sm:text-sm">
                <div className="font-bold text-sky-950">
                  {unfoldProgress === 0 && '🔷 Αρχικό Σχήμα: Ολόκληρος κύκλος χωρισμένος σε τομείς.'}
                  {unfoldProgress > 0 && unfoldProgress < 100 && '🔄 Οι τομείς ξεδιπλώνονται και τοποθετούνται εναλλάξ...'}
                  {unfoldProgress === 100 && '🟩 Ολοκληρώθηκε: Οι τομείς σχημάτισαν ένα ορθογώνιο παραλληλόγραμμο!'}
                </div>
                <div className="text-slate-600 text-[11px] space-y-1 font-mono pt-1 border-t border-sky-200/60">
                  <div>• <strong>Βάση Ορθογωνίου:</strong> Μισή Περιφέρεια ＝ π · ρ</div>
                  <div>• <strong>Ύψος Ορθογωνίου:</strong> Ακτίνα ＝ ρ</div>
                  <div className="text-indigo-900 font-bold">• <strong>Εμβαδόν:</strong> (π · ρ) · ρ ＝ <strong>π · ρ²</strong></div>
                </div>
              </div>
            </div>

            {/* SVG Visualizer (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 min-h-[320px] p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center">
              <svg
                viewBox="0 0 380 200"
                className="w-full max-w-[380px] sm:max-w-[440px] h-auto select-none overflow-visible"
              >
                {/* Κατάσταση 0%: Κύκλος στο κέντρο */}
                {unfoldProgress < 100 && (
                  <g opacity={1 - unfoldProgress / 100}>
                    <circle cx="100" cy="100" r={radiusR} fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" strokeWidth="2" />
                    {/* Ακτίνα ρ */}
                    <line x1="100" y1="100" x2="160" y2="100" stroke="#f59e0b" strokeWidth="2.5" />
                    <circle cx="100" cy="100" r="3" fill="#ffffff" />
                    <text x="130" y="92" fill="#f59e0b" fontSize="12" fontWeight="bold" textAnchor="middle">
                      ρ
                    </text>
                    {/* Διαχωριστικές ακτίνες τομέων */}
                    {Array.from({ length: 8 }).map((_, i) => {
                      const ang = (i * Math.PI) / 4;
                      return (
                        <line
                          key={i}
                          x1="100"
                          y1="100"
                          x2={100 + radiusR * Math.cos(ang)}
                          y2={100 + radiusR * Math.sin(ang)}
                          stroke="rgba(255, 255, 255, 0.3)"
                          strokeWidth="1"
                        />
                      );
                    })}
                  </g>
                )}

                {/* Κατάσταση Αναδιάταξης (Ξεδίπλωμα προς Ορθογώνιο) */}
                <g opacity={unfoldProgress / 100} transform={`translate(${140 - (unfoldProgress / 100) * 80}, 50)`}>
                  {/* 4 τομείς που κοιτούν προς τα πάνω (γαλάζιοι) */}
                  {Array.from({ length: 4 }).map((_, i) => (
                    <polygon
                      key={`top-${i}`}
                      points={`
                        ${i * sectorW},${radiusR} 
                        ${(i + 0.5) * sectorW},0 
                        ${(i + 1) * sectorW},${radiusR}
                      `}
                      fill="rgba(56, 189, 248, 0.4)"
                      stroke="#38bdf8"
                      strokeWidth="1.5"
                    />
                  ))}

                  {/* 4 τομείς που κοιτούν προς τα κάτω εναλλάξ (μωβ) */}
                  {Array.from({ length: 4 }).map((_, i) => (
                    <polygon
                      key={`bot-${i}`}
                      points={`
                        ${(i + 0.5) * sectorW},0 
                        ${(i + 1) * sectorW},${radiusR} 
                        ${(i + 1.5) * sectorW},0
                      `}
                      fill="rgba(168, 85, 247, 0.4)"
                      stroke="#c084fc"
                      strokeWidth="1.5"
                    />
                  ))}

                  {/* Ετικέτες Ορθογωνίου όταν πλησιάζει το 100% */}
                  {unfoldProgress > 70 && (
                    <>
                      {/* Ύψος = ρ */}
                      <line x1="-10" y1="0" x2="-10" y2={radiusR} stroke="#f59e0b" strokeWidth="2" />
                      <text x="-20" y={radiusR / 2 + 4} fill="#f59e0b" fontSize="12" fontWeight="bold" textAnchor="end">
                        ρ
                      </text>

                      {/* Βάση = π · ρ */}
                      <line x1="0" y1={radiusR + 15} x2={4.5 * sectorW} y2={radiusR + 15} stroke="#e2e8f0" strokeWidth="2" />
                      <text x={(4.5 * sectorW) / 2} y={radiusR + 32} fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">
                        Βάση ＝ π · ρ
                      </text>
                    </>
                  )}
                </g>
              </svg>

              <div className="mt-3 text-center text-xs text-slate-400">
                Το ορθογώνιο έχει μήκος (π · ρ) και πλάτος (ρ). Το εμβαδόν του είναι: (π · ρ) · ρ ＝ <strong>π · ρ²</strong>.
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΥΠΟΛΟΓΙΣΤΗΣ ΕΜΒΑΔΟΥ & ΣΥΓΚΡΙΣΗ ΜΕ ΠΕΡΙΜΕΤΡΟ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
              <span>📐 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΥΠΟΛΟΓΙΣΤΗΣ &amp; ΜΟΝΑΔΕΣ</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Υπολογιστής Εμβαδού Κύκλου &amp; Αυτόματη Μετατροπή
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Άλλαξε την ακτίνα (ρ) σε cm για να υπολογίσεις ταυτόχρονα το εμβαδόν (π · ρ²) και την περίμετρο (2 · π · ρ):
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

            {/* Slider Ακτίνας ρ (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>ΑΚΤΙΝΑ ΚΥΚΛΟΥ (ρ):</span>
                  <span className="font-mono text-base font-black text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {radiusInput} cm
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={25}
                  step={1}
                  value={radiusInput}
                  onChange={(e) => setRadiusInput(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>1 cm</span>
                  <span>Διάμετρος: {diameter} cm</span>
                  <span>25 cm</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 font-mono space-y-1.5">
                <div>• Διάμετρος: δ ＝ 2 · ρ ＝ 2 · {radiusInput} ＝ <strong>{diameter} cm</strong></div>
                <div>• Περίμετρος (Μήκος): 2 · π · ρ ＝ 2 · 3,14 · {radiusInput} ＝ <strong>{formatNum(perimeterCm)} cm</strong></div>
                <div className="text-emerald-800 font-black text-sm pt-1 border-t border-slate-200">
                  • Εμβαδόν: π · ρ² ＝ 3,14 · {radiusInput} · {radiusInput} ＝ <strong>{formatNum(areaCm2)} cm²</strong>
                </div>
              </div>
            </div>

            {/* Αποτελέσματα σε όλες τις Μονάδες (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 p-5 sm:p-7 rounded-3xl border border-slate-800 text-white space-y-3">
              <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider text-center">
                ΜΕΤΑΤΡΟΠΗ ΣΕ ΑΛΛΕΣ ΜΟΝΑΔΕΣ ΕΠΙΦΑΝΕΙΑΣ
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs sm:text-sm">
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                  <span className="text-slate-400 font-sans text-xs block">Σε cm² (Βάση υπολογισμού):</span>
                  <span className="text-emerald-400 font-black text-lg">{formatNum(areaCm2)} cm²</span>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                  <span className="text-slate-400 font-sans text-xs block">Σε mm² (· 100):</span>
                  <span className="text-sky-400 font-black text-lg">{formatNum(areaMm2)} mm²</span>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                  <span className="text-slate-400 font-sans text-xs block">Σε dm² (: 100):</span>
                  <span className="text-amber-400 font-black text-lg">{formatNum(areaDm2)} dm²</span>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                  <span className="text-slate-400 font-sans text-xs block">Σε m² (: 10.000):</span>
                  <span className="text-purple-400 font-black text-lg">{formatNum(areaM2)} m²</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 text-center pt-1 font-sans">
                💡 Μην μπερδεύετε την περίμετρο ({formatNum(perimeterCm)} cm - μήκος) με το εμβαδόν ({formatNum(areaCm2)} cm² - επιφάνεια)!
              </div>
            </div>

          </div>
        </section>

        {/* 5. ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ ΚΑΘΗΜΕΡΙΝΗΣ ΖΩΗΣ */}
        <section className="space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight">
              Λυμένα Προβλήματα με Εμβαδόν Κύκλου
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Εφαρμογές του τύπου Ε ＝ π · ρ² σε κυκλικά τραπέζια και πισίνες.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ΠΡΟΒΛΗΜΑ 1 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-900 text-xs font-black rounded-lg uppercase">
                  ΠΡΟΒΛΗΜΑ 1: ΚΥΚΛΙΚΟ ΤΡΑΠΕΖΙ
                </span>
                <span className="text-xs font-bold text-slate-400">Δίνεται η Διάμετρος</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Υπολογισμός Εμβαδού από τη Διάμετρο
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ένα στρογγυλό τραπέζι έχει διάμετρο <strong>1,6 m</strong>. 
                Θέλουμε να φτιάξουμε ένα γυάλινο κάλυμμα για την επιφάνειά του. Πόσα τετραγωνικά μέτρα (m²) γυαλιού θα χρειαστούν; (Χρησιμοποιήστε π ＝ 3,14)
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΔΕΔΟΜΕΝΑ ΠΡΟΒΛΗΜΑΤΟΣ
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Διάμετρος (δ)</span> 1,6 m
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Ακτίνα (ρ)</span> 1,6 : 2 ＝ 0,8 m
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Τύπος</span> π · ρ²
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήματα Επίλυσης:</span>
                  <div>• <strong>Βρίσκουμε την ακτίνα ρ:</strong> ρ ＝ δ : 2 ＝ 1,6 : 2 ＝ <strong>0,8 m</strong>.</div>
                  <div>• <strong>Υπολογίζουμε το τετράγωνο της ακτίνας:</strong> 0,8 · 0,8 ＝ <strong>0,64 m²</strong>.</div>
                  <div>• <strong>Εμβαδόν:</strong> 3,14 · 0,64 ＝ <strong className="text-blue-700">2,0096 m² ≈ 2,01 m²</strong>.</div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 font-medium">
                💡 Θυμήσου: Ποτέ δεν πολλαπλασιάζουμε απευθείας με τη διάμετρο! Πρώτα βρίσκουμε την ακτίνα ρ (0,8 m).
              </div>
            </article>

            {/* ΠΡΟΒΛΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-lg uppercase">
                  ΠΡΟΒΛΗΜΑ 2: ΚΥΚΛΙΚΗ ΠΙΣΙΝΑ &amp; ΔΙΑΔΡΟΜΟΣ
                </span>
                <span className="text-xs font-bold text-slate-400">Κυκλικός Δακτύλιος</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Υπολογισμός Εμβαδού Κυκλικού Δακτυλίου
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Μια κυκλική πισίνα έχει ακτίνα <strong>4 m</strong>. Γύρω από την πισίνα κατασκευάζεται διάδρομος πλάτους <strong>1 m</strong>. 
                Ποιο είναι το εμβαδόν μόνο του διαδρόμου; (Χρησιμοποιήστε π ＝ 3,14)
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΣΤΟΙΧΕΙΑ ΥΠΟΛΟΓΙΣΜΟΥ
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold text-[11px]">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Μικρή ακτίνα (ρ₁)</span> 4 m
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Μεγάλη ακτίνα (ρ₂)</span> 4 ＋ 1 ＝ 5 m
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Εμβαδόν διαδρόμου</span> Εμεγ － Εμικ
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήματα Επίλυσης:</span>
                  <div>• <strong>Εμβαδόν μεγάλου κύκλου:</strong> 3,14 · 5 · 5 ＝ 3,14 · 25 ＝ <strong>78,5 m²</strong>.</div>
                  <div>• <strong>Εμβαδόν πισίνας (μικρού κύκλου):</strong> 3,14 · 4 · 4 ＝ 3,14 · 16 ＝ <strong>50,24 m²</strong>.</div>
                  <div>• <strong>Εμβαδόν διαδρόμου:</strong> 78,5 － 50,24 ＝ <strong className="text-amber-700">28,26 m²</strong>.</div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 font-medium">
                ⚡ Για να βρούμε το εμβαδόν του διαδρόμου (δακτυλίου), αφαιρούμε τον μικρό κύκλο από τον μεγάλο κύκλο!
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
                  <strong>Μην μπερδεύετε το ρ² με το 2 · ρ:</strong> Το ρ² είναι <strong>ρ · ρ</strong> (η ακτίνα πολλαπλασιασμένη με τον εαυτό της). Αν η ακτίνα είναι 6 cm, τότε το τετράγωνό της είναι 36 cm² (και όχι 12 cm).
                </li>
                <li>
                  <strong>Μην μπερδεύετε την περίμετρο με το εμβαδόν:</strong> Η περίμετρος (το μήκος της γραμμής) είναι <strong>2 · π · ρ</strong>. Το εμβαδόν (η επιφάνεια) είναι <strong>π · ρ²</strong>.
                </li>
                <li>
                  <strong>Αν γνωρίζετε τη διάμετρο:</strong> Μην ξεχνάτε να τη διαιρέσετε πρώτα διά 2 για να βρείτε την ακτίνα ρ πριν υπολογίσετε το εμβαδόν.
                </li>
                <li>
                  <strong>Στο ημικύκλιο διαιρούμε με το 2:</strong> Το εμβαδόν του ημικυκλίου είναι ακριβώς το μισό του κύκλου: <strong>(π · ρ²) : 2</strong>.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 7. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στο Εμβαδόν Κύκλου!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε 12 διαδραστικές ασκήσεις με υπολογισμούς ακτίνας ρ, διαμέτρου, εμβαδού κύκλου και ημικυκλίου για τη ΣΤ' Δημοτικού.
            </p>
          </div>

          <Link
            href="/st-dimotikou/76-embadon-kiklou-ask"
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
