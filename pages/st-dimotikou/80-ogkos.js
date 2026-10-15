// pages/st-dimotikou/80-ogkos.js
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

export default function OgkosTheoriaPage() {
  // -------------------------------------------------------------------------
  // Εργαστήριο 1: Διαδραστικό Γέμισμα Δοχείου (1 dm³ = 1 L)
  // -------------------------------------------------------------------------
  const [fillPercent, setFillPercent] = useState(60); // 0% έως 100%

  // -------------------------------------------------------------------------
  // Εργαστήριο 2: Δυναμικός Υπολογιστής Όγκου & Χωρητικότητας (Λίτρα)
  // -------------------------------------------------------------------------
  const [tankLength, setTankLength] = useState(2); // Μήκος σε μέτρα (m)
  const [tankWidth, setTankWidth] = useState(1.5); // Πλάτος σε μέτρα (m)
  const [tankHeight, setTankHeight] = useState(1); // Ύψος σε μέτρα (m)

  // Υπολογισμοί όγκου
  const volumeM3 = useMemo(() => {
    return tankLength * tankWidth * tankHeight;
  }, [tankLength, tankWidth, tankHeight]);

  const volumeDm3 = useMemo(() => volumeM3 * 1000, [volumeM3]);
  const volumeLiters = useMemo(() => volumeDm3, [volumeDm3]); // 1 dm³ = 1 L
  const volumeCm3 = useMemo(() => volumeDm3 * 1000, [volumeDm3]);

  return (
    <Layout
      title="Όγκος &amp; Μονάδες Χωρητικότητας (Κυβικά Μέτρα &amp; Λίτρα) - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μαθαίνουμε για τον όγκο, τις μονάδες μέτρησης (m³, dm³, cm³), τη χωρητικότητα και τη μαγική ισοδυναμία 1 dm³ ＝ 1 L με διαδραστικά εργαστήρια SVG."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/80-ogkos-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 80 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Έννοια του Όγκου • Κυβικά Μέτρα, Μονάδες Χωρητικότητας &amp; Λίτρα
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Ανακαλύπτουμε τι είναι ο <strong>όγκος</strong> ενός στερεού στις 3 διαστάσεις, 
              γνωρίζουμε τα <strong>κυβικά μέτρα (m³)</strong>, τα <strong>κυβικά δεκατόμετρα (dm³)</strong> και τα <strong>κυβικά εκατοστόμετρα (cm³)</strong>, 
              και ξεκλειδώνουμε τη σπουδαία γέφυρα με τη χωρητικότητα: <strong>1 dm³ ＝ 1 Λίτρο (L)</strong>!
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία, Κυβικά Μέτρα, Σχέση 1 dm³ ＝ 1 L, Μετατροπές &amp; Διαδραστικά Εργαστήρια</span>
            </div>
            <Link
              href="/st-dimotikou/80-ogkos-ask"
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
              Ο Όγκος &amp; η Χωρητικότητα σε 4 Βήματα
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Από τον τρισδιάστατο χώρο μέχρι τις μονάδες μέτρησης και το γέμισμα δοχείων με λίτρα.
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
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Έννοια &amp; Μονάδες</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Τι είναι ο Όγκος;
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  <strong>Όγκος</strong> ενός σώματος είναι ο <strong>χώρος</strong> που αυτό καταλαμβάνει. Μετριέται σε 3 διαστάσεις: <strong>μήκος</strong>, <strong>πλάτος</strong> και <strong>ύψος</strong>.
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 font-mono">
                  <div className="text-indigo-950 font-bold">
                    • Βασική Μονάδα: Κυβικό μέτρο (1 m³)
                  </div>
                  <div className="text-slate-700 text-xs font-sans">
                    Είναι ο όγκος ενός κύβου με ακμή 1 μέτρο (1 m · 1 m · 1 m).
                  </div>
                  <div className="text-indigo-950 font-bold pt-1 border-t border-slate-200">
                    • Ο Κανόνας του 1.000:
                  </div>
                  <div className="text-slate-700 text-xs font-sans">
                    Στις κυβικές μονάδες κάθε σκαλοπάτι είναι <strong>1.000 φορές</strong> μεγαλύτερο ή μικρότερο!<br />
                    1 m³ ＝ 1.000 dm³ ＝ 1.000.000 cm³.
                  </div>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Μήκος σε cm (βήμα 10) • Επιφάνεια σε cm² (βήμα 100) • Όγκος σε cm³ (βήμα 1.000)!
              </div>
            </article>

            {/* ΒΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Η Μεγάλη Γέφυρα</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Χωρητικότητα &amp; Λίτρα (L)
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  <strong>Χωρητικότητα</strong> είναι ο όγκος των υγρών (ή αερίων) που χωράει μέσα σε ένα δοχείο. Μετριέται σε <strong>λίτρα (L)</strong>:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 font-mono">
                  <div className="text-amber-950 font-black text-sm">
                    ★ 1 dm³ ＝ 1 L (Λίτρο)
                  </div>
                  <div className="text-slate-700 text-xs font-sans">
                    Αν φτιάξουμε έναν κύβο με ακμή 1 dm (10 cm) και τον γεμίσουμε με νερό, χωράει ακριβώς <strong>1 λίτρο</strong>!
                  </div>
                  <div className="pt-1 border-t border-slate-200 text-xs">
                    • 1 m³ ＝ 1.000 dm³ ＝ <strong>1.000 L</strong><br />
                    • 1 cm³ ＝ <strong>1 mL</strong> (χιλιοστόλιτρο)
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Να θυμάστε για πάντα: 1 m³ χωράει 1.000 λίτρα νερού!
              </div>
            </article>

            {/* ΒΗΜΑ 3 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Υπολογισμός Όγκου</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Πώς Βρίσκουμε τον Όγκο;
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Πολλαπλασιάζουμε τις 3 διαστάσεις του στερεού:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 font-mono">
                  <div>
                    • <strong>Κύβος με ακμή α:</strong><br />
                    V ＝ α · α · α ＝ <strong>α³</strong>
                  </div>
                  <div>
                    • <strong>Ορθογώνιο Παραλληλεπίπεδο:</strong><br />
                    V ＝ <strong>Μήκος · Πλάτος · Ύψος</strong><br />
                    V ＝ α · β · γ
                  </div>
                  <div className="text-indigo-950 font-bold pt-1 border-t border-slate-200 text-xs">
                    V ＝ Εμβαδόν Βάσης · Ύψος
                  </div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Και οι τρεις διαστάσεις (α, β, γ) πρέπει να είναι στην ίδια μονάδα (π.χ. όλες σε m ή όλες σε dm) πριν πολλαπλασιάσουμε!
              </div>
            </article>

            {/* ΒΗΜΑ 4 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Πρακτικές Εφαρμογές</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Από τον Όγκο στα Λίτρα
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Στα προβλήματα με δεξαμενές και πισίνες ακολουθούμε 2 απλά βήματα:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 font-mono">
                  <div>
                    1. <strong>Βρίσκουμε τον όγκο σε m³:</strong><br />
                    Π.χ. 2 m · 1,5 m · 1 m ＝ <strong>3 m³</strong>.
                  </div>
                  <div>
                    2. <strong>Μετατρέπουμε σε λίτρα (· 1.000):</strong><br />
                    3 · 1.000 ＝ <strong>3.000 L</strong> νερού!
                  </div>
                  <div className="text-slate-700 font-sans text-xs pt-1 border-t border-slate-200">
                    Αν οι διαστάσεις είναι σε dm, ο όγκος βγαίνει κατευθείαν σε dm³, δηλαδή κατευθείαν σε λίτρα!
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Συμβουλή: Όταν ζητούνται λίτρα, μετατρέψτε τις διαστάσεις σε dm από την αρχή!
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΓΕΜΙΣΜΑ ΚΥΒΟΥ ΜΕ ΝΕΡΟ (1 dm³ = 1 L) */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1</span>
            </div>
            <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Η Μαγική Σχέση: 1 Κυβικό Δεκατόμετρο (dm³) ＝ 1 Λίτρο (L)
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Σύρε τη στάθμη για να γεμίσεις το διαφανές δοχείο με νερό. Παρατήρησε πώς ο όγκος σε dm³ συμβαδίζει απόλυτα με τα λίτρα (L):
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">

            {/* Slider & Επεξηγήσεις (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>ΣΤΑΘΜΗ ΝΕΡΟΥ ΣΤΟ ΔΟΧΕΙΟ:</span>
                  <span className="font-mono text-base font-black text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {fillPercent}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={fillPercent}
                  onChange={(e) => setFillPercent(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>0% (Άδειο)</span>
                  <span>50% (Μισό)</span>
                  <span>100% (Γεμάτο)</span>
                </div>
              </div>

              {/* Κάρτα Ενδείξεων */}
              <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 space-y-2.5 text-xs sm:text-sm">
                <div className="font-bold text-sky-950">
                  Δοχείο: Κύβος ακμής 1 dm (10 cm)
                </div>
                <div className="grid grid-cols-2 gap-2 text-center font-mono">
                  <div className="bg-white p-2.5 rounded-xl border border-sky-100">
                    <span className="text-[10px] text-slate-500 block font-sans">Όγκος Νερού</span>
                    <span className="text-base font-black text-indigo-700">
                      {formatNum((fillPercent / 100).toFixed(2))} dm³
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-sky-100">
                    <span className="text-[10px] text-slate-500 block font-sans">Χωρητικότητα</span>
                    <span className="text-base font-black text-emerald-700">
                      {formatNum((fillPercent / 100).toFixed(2))} L
                    </span>
                  </div>
                </div>
                <div className="text-slate-600 text-[11px] font-mono pt-1 border-t border-sky-200/60">
                  • Σε cm³: {formatNum(Math.round((fillPercent / 100) * 1000))} cm³ (ή mL)
                </div>
              </div>
            </div>

            {/* SVG Visualizer Κύβου με Στάθμη Νερού (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 min-h-[350px] p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center">
              <svg
                viewBox="0 0 360 260"
                className="w-full max-w-[360px] h-auto select-none overflow-visible"
              >
                {/* 1. Πίσω ακμές δοχείου (διακεκομμένες) */}
                <line x1="180" y1="210" x2="270" y2="160" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="90" y1="160" x2="180" y2="210" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="180" y1="210" x2="180" y2="100" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 3" />

                {/* 2. Στάθμη Νερού (εμφανίζεται αναλογικά με fillPercent) */}
                {fillPercent > 0 && (
                  <g>
                    {/* Ύψος νερού: από z=0 (y=160/210) έως z=fillPercent */}
                    {/* Βάση νερού */}
                    <polygon
                      points="90,160 180,210 270,160 180,110"
                      fill="rgba(56, 189, 248, 0.25)"
                    />
                    {/* Σώμα νερού (πλευρές) */}
                    {/* Μπροστινή αριστερή πλευρά νερού */}
                    <polygon
                      points={`
                        90,160 
                        180,210 
                        180,${210 - (fillPercent / 100) * 110} 
                        90,${160 - (fillPercent / 100) * 110}
                      `}
                      fill="rgba(56, 189, 248, 0.45)"
                    />
                    {/* Μπροστινή δεξιά πλευρά νερού */}
                    <polygon
                      points={`
                        180,210 
                        270,160 
                        270,${160 - (fillPercent / 100) * 110} 
                        180,${210 - (fillPercent / 100) * 110}
                      `}
                      fill="rgba(14, 165, 233, 0.55)"
                    />
                    {/* Επιφάνεια νερού (πάνω στάθμη) */}
                    <polygon
                      points={`
                        90,${160 - (fillPercent / 100) * 110} 
                        180,${210 - (fillPercent / 100) * 110} 
                        270,${160 - (fillPercent / 100) * 110} 
                        180,${110 - (fillPercent / 100) * 110}
                      `}
                      fill="rgba(125, 211, 252, 0.75)"
                      stroke="#38bdf8"
                      strokeWidth="1.5"
                    />
                  </g>
                )}

                {/* 3. Μπροστινός γυάλινος σκελετός κύβου */}
                {/* Κάτω βάση */}
                <polygon
                  points="90,160 180,110 270,160 180,210"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="2"
                />
                {/* Πάνω βάση */}
                <polygon
                  points="90,50 180,0 270,50 180,100"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="2"
                />
                {/* Κατακόρυφες ακμές */}
                <line x1="90" y1="160" x2="90" y2="50" stroke="#94a3b8" strokeWidth="2" />
                <line x1="180" y1="210" x2="180" y2="100" stroke="#94a3b8" strokeWidth="2" />
                <line x1="270" y1="160" x2="270" y2="50" stroke="#94a3b8" strokeWidth="2" />

                {/* Ενδείξεις διαστάσεων κύβου (1 dm x 1 dm x 1 dm) */}
                <text x="125" y="195" fill="#f59e0b" fontSize="11" fontWeight="bold">1 dm (10 cm)</text>
                <text x="235" y="195" fill="#f59e0b" fontSize="11" fontWeight="bold">1 dm</text>
                <line x1="285" y1="160" x2="285" y2="50" stroke="#f59e0b" strokeWidth="1.5" />
                <text x="295" y="110" fill="#f59e0b" fontSize="12" fontWeight="bold">1 dm</text>
              </svg>

              <div className="mt-3 text-center text-xs text-slate-400">
                {fillPercent === 100
                  ? '✓ Το δοχείο γέμισε πλήρως: 1 dm³ νερού ＝ ακριβώς 1 Λίτρο (L)!'
                  : `Στάθμη: ${(fillPercent / 100).toFixed(2)} dm³ ＝ ${(fillPercent / 100).toFixed(2)} L νερού.`}
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΥΠΟΛΟΓΙΣΤΗΣ ΟΓΚΟΥ ΔΕΞΑΜΕΝΗΣ ΣΕ ΛΙΤΡΑ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
              <span>📐 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΥΠΟΛΟΓΙΣΤΗΣ ΧΩΡΗΤΙΚΟΤΗΤΑΣ</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Πόσα Λίτρα Χωράει μια Δεξαμενή;
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Άλλαξε τις διαστάσεις μιας δεξαμενής (σε μέτρα) για να υπολογίσεις αυτόματα τον όγκο της σε m³, dm³ και τη χωρητικότητά της σε λίτρα:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

            {/* Sliders Διαστάσεων Δεξαμενής (5 στήλες) */}
            <div className="lg:col-span-5 space-y-3.5">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>ΜΗΚΟΣ (α):</span>
                  <span className="font-mono text-base font-black text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {tankLength} m
                  </span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={5}
                  step={0.5}
                  value={tankLength}
                  onChange={(e) => setTankLength(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>ΠΛΑΤΟΣ (β):</span>
                  <span className="font-mono text-base font-black text-sky-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {tankWidth} m
                  </span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={4}
                  step={0.5}
                  value={tankWidth}
                  onChange={(e) => setTankWidth(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer touch-manipulation"
                />
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>ΥΨΟΣ (γ):</span>
                  <span className="font-mono text-base font-black text-amber-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {tankHeight} m
                  </span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={3}
                  step={0.5}
                  value={tankHeight}
                  onChange={(e) => setTankHeight(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer touch-manipulation"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 font-mono space-y-1">
                <div>• Υπολογισμός: V ＝ {tankLength} · {tankWidth} · {tankHeight} ＝ <strong>{formatNum(volumeM3)} m³</strong></div>
                <div>• Σε dm³ (· 1.000): {formatNum(volumeM3)} · 1.000 ＝ <strong>{formatNum(volumeDm3)} dm³</strong></div>
              </div>
            </div>

            {/* Αποτελέσματα Χωρητικότητας (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 p-5 sm:p-7 rounded-3xl border border-slate-800 text-white space-y-3">
              <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider text-center">
                ΧΩΡΗΤΙΚΟΤΗΤΑ ΔΕΞΑΜΕΝΗΣ ΣΕ ΛΙΤΡΑ
              </span>

              <div className="text-center py-2">
                <span className="text-3xl sm:text-4xl font-black font-mono text-emerald-400">
                  {formatNum(volumeLiters)} L (Λίτρα)
                </span>
                <span className="text-xs text-slate-400 block mt-1 font-sans">
                  Ισοδυναμεί ακριβώς με {formatNum(volumeDm3)} κυβικά δεκατόμετρα (dm³)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs sm:text-sm pt-2 border-t border-slate-800">
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                  <span className="text-slate-400 font-sans text-xs block">Όγκος σε m³:</span>
                  <span className="text-sky-400 font-black text-lg">{formatNum(volumeM3)} m³</span>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                  <span className="text-slate-400 font-sans text-xs block">Σε cm³ (ή mL):</span>
                  <span className="text-amber-400 font-black text-lg">{formatNum(volumeCm3)} cm³</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 text-center pt-1 font-sans">
                💡 Κάθε κυβικό μέτρο (1 m³) περιέχει ακριβώς 1.000 λίτρα νερού!
              </div>
            </div>

          </div>
        </section>

        {/* 5. ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ ΚΑΘΗΜΕΡΙΝΗΣ ΖΩΗΣ */}
        <section className="space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight">
              Λυμένα Προβλήματα με Όγκο &amp; Χωρητικότητα
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Εφαρμογές των μονάδων όγκου σε δεξαμενές πετρελαίου και πισίνες.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ΠΡΟΒΛΗΜΑ 1 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-900 text-xs font-black rounded-lg uppercase">
                  ΠΡΟΒΛΗΜΑ 1: ΔΕΞΑΜΕΝΗ ΠΕΤΡΕΛΑΙΟΥ
                </span>
                <span className="text-xs font-bold text-slate-400">Μετατροπή m³ σε L</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Υπολογισμός Χωρητικότητας Δεξαμενής σε Λίτρα
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Μια δεξαμενή πετρελαίου σε σχήμα ορθογωνίου παραλληλεπιπέδου έχει μήκος <strong>2 m</strong>, πλάτος <strong>1,2 m</strong> και ύψος <strong>1,5 m</strong>. 
                Πόσα λίτρα (L) πετρελαίου χωράει όταν γεμίσει εντελώς;
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΔΕΔΟΜΕΝΑ ΠΡΟΒΛΗΜΑΤΟΣ
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Μήκος (α)</span> 2 m
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Πλάτος (β)</span> 1,2 m
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Ύψος (γ)</span> 1,5 m
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήματα Επίλυσης:</span>
                  <div>• <strong>Βρίσκουμε τον όγκο σε m³:</strong> V ＝ 2 · 1,2 · 1,5 ＝ <strong>3,6 m³</strong>.</div>
                  <div>• <strong>Γνωρίζουμε ότι:</strong> 1 m³ ＝ 1.000 dm³ ＝ 1.000 L.</div>
                  <div>• <strong>Χωρητικότητα σε λίτρα:</strong> 3,6 · 1.000 ＝ <strong className="text-blue-700">3.600 L</strong>.</div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 font-medium">
                💡 Εναλλακτικά: Μετατρέπουμε τα μέτρα σε dm (20 dm, 12 dm, 15 dm) και πολλαπλασιάζουμε: 20 · 12 · 15 ＝ 3.600 dm³ ＝ 3.600 L!
              </div>
            </article>

            {/* ΠΡΟΒΛΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-lg uppercase">
                  ΠΡΟΒΛΗΜΑ 2: ΚΥΒΙΚΟ ΔΟΧΕΙΟ
                </span>
                <span className="text-xs font-bold text-slate-400">Κύβος &amp; Λίτρα</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Χωρητικότητα Κύβου από cm³ σε Λίτρα
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ένα διακοσμητικό δοχείο σε σχήμα κύβου έχει ακμή <strong>20 cm</strong>. 
                Πόσα λίτρα (L) νερού χωράει;
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΣΤΟΙΧΕΙΑ ΥΠΟΛΟΓΙΣΜΟΥ
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold text-[11px]">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Ακμή κύβου</span> 20 cm ＝ 2 dm
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Όγκος σε dm³</span> 2 · 2 · 2 ＝ 8 dm³
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Σχέση</span> 1 dm³ ＝ 1 L
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήματα Επίλυσης:</span>
                  <div>• <strong>1ος Τρόπος (με dm):</strong> 20 cm ＝ 2 dm. Όγκος: 2 · 2 · 2 ＝ <strong className="text-amber-700">8 dm³ ＝ 8 L</strong>.</div>
                  <div>• <strong>2ος Τρόπος (με cm³):</strong> 20 · 20 · 20 ＝ 8.000 cm³. Διαιρούμε με το 1.000: 8.000 : 1.000 ＝ <strong className="text-amber-700">8 L</strong>.</div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 font-medium">
                ⚡ Η μετατροπή σε δεκατόμετρα (dm) πριν τον πολλαπλασιασμό κάνει τις πράξεις πολύ πιο γρήγορες και εύκολες!
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
                  <strong>Μην μπερδεύετε τις μονάδες επιφάνειας (cm²) με τις μονάδες όγκου (cm³):</strong> Στην επιφάνεια ανεβοκατεβαίνουμε ανά 100, ενώ στον όγκο ανεβοκατεβαίνουμε <strong>ανά 1.000</strong>!
                </li>
                <li>
                  <strong>Η μαγική ισοδυναμία:</strong> Να θυμάστε πάντοτε ότι <strong>1 dm³ ＝ 1 L</strong> (και 1 m³ ＝ 1.000 L). Ποτέ μην θεωρείτε ότι 1 m³ είναι 1 λίτρο!
                </li>
                <li>
                  <strong>Ίδιες μονάδες μέτρησης πριν τον πολλαπλασιασμό:</strong> Αν το μήκος είναι σε μέτρα και το ύψος σε εκατοστά, πρέπει πρώτα να τα μετατρέψετε στην ίδια μονάδα.
                </li>
                <li>
                  <strong>Στον κύβο υψώνουμε στην 3η δύναμη:</strong> Ο όγκος του κύβου είναι <strong>α · α · α</strong> (α³), και όχι α · 3!
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 7. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στον Όγκο &amp; τα Λίτρα!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε 12 διαδραστικές ασκήσεις με υπολογισμούς όγκου κύβου, παραλληλεπιπέδου, μετατροπές m³ σε λίτρα (L) και χωρητικότητα για τη ΣΤ' Δημοτικού.
            </p>
          </div>

          <Link
            href="/st-dimotikou/80-ogkos-ask"
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
