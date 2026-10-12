// pages/st-dimotikou/69-athroisma-gonion.js
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

// Μορφοποίηση αριθμού
function formatNum(val) {
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  return Number(val).toLocaleString('el-GR');
}

export default function AthroismaGonionTheoriaPage() {
  // Εργαστήριο 1: Διαδραστικό Τρίγωνο (Άθροισμα 180°)
  const [angleA, setAngleA] = useState(65);
  const [angleB, setAngleB] = useState(55);

  // Η 3η γωνία υπολογίζεται δυναμικά ώστε το άθροισμα να είναι πάντα 180°
  const angleC = useMemo(() => {
    return Math.max(1, 180 - (angleA + angleB));
  }, [angleA, angleB]);

  // Ταξινόμηση τριγώνου ως προς τις γωνίες
  const triangleType = useMemo(() => {
    const maxAngle = Math.max(angleA, angleB, angleC);
    if (maxAngle === 90) return { name: 'Ορθογώνιο Τρίγωνο', badge: 'bg-emerald-100 text-emerald-800' };
    if (maxAngle > 90) return { name: 'Αμβλυγώνιο Τρίγωνο', badge: 'bg-amber-100 text-amber-800' };
    return { name: 'Οξυγώνιο Τρίγωνο', badge: 'bg-sky-100 text-sky-800' };
  }, [angleA, angleB, angleC]);

  // Υπολογισμός συντεταγμένων κορυφών SVG για το διαδραστικό τρίγωνο
  const { polyPoints, topX, topY } = useMemo(() => {
    const bx = 50;
    const by = 200;
    const cx = 270;
    const cy = 200;
    const baseLen = cx - bx;

    // Νόμος ημιτόνων για προσδιορισμό θέσης κορυφής Α
    const radB = (angleB * Math.PI) / 180;
    const radC = (angleC * Math.PI) / 180;
    const radA = (angleA * Math.PI) / 180;

    const sideC = (baseLen * Math.sin(radC)) / Math.sin(radA);
    const x = bx + sideC * Math.cos(radB);
    const y = by - sideC * Math.sin(radB);

    return {
      polyPoints: `${x.toFixed(1)},${y.toFixed(1)} ${bx},${by} ${cx},${cy}`,
      topX: x,
      topY: y
    };
  }, [angleA, angleB, angleC]);

  // Εργαστήριο 2: Τετράπλευρο & Εύρεση 4ης Γωνίας (Άθροισμα 360°)
  const [qA, setQA] = useState(105);
  const [qB, setQB] = useState(75);
  const [qC, setQC] = useState(110);

  const qD = useMemo(() => {
    return Math.max(1, 360 - (qA + qB + qC));
  }, [qA, qB, qC]);

  return (
    <Layout
      title="Κατασκευή &amp; Άθροισμα Γωνιών (Τρίγωνα - Τετράπλευρα) - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μαθαίνουμε πώς κατασκευάζουμε γωνίες, γιατί το άθροισμα γωνιών τριγώνου είναι 180° και τετραπλεύρου 360°, με διαδραστικά εργαστήρια SVG και λυμένα προβλήματα."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/69-athroisma-gonion-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 69 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Κατασκευή Γωνιών &amp; Άθροισμα Γωνιών Τριγώνου και Τετραπλεύρου
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Μαθαίνουμε πώς σχεδιάζουμε με ακρίβεια μια γωνία με χάρακα και μοιρογνωμόνιο, αποδεικνύουμε γιατί το άθροισμα των γωνιών 
              κάθε τριγώνου είναι πάντοτε <strong>180°</strong> και κάθε τετραπλεύρου <strong>360°</strong>, και υπολογίζουμε άγνωστες γωνίες σε γεωμετρικά σχήματα!
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία, Κατασκευή Γωνιών, Αθροίσματα 180°/360° &amp; Διαδραστικά Εργαστήρια</span>
            </div>
            <Link
              href="/st-dimotikou/69-athroisma-gonion-ask"
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
              Η Θεωρία των Γωνιών σε 4 Βήματα
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Από την ακριβή σχεδίαση έως τους θεμελιώδεις κανόνες των πολυγώνων.
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
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Κατασκευή</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Πώς Κατασκευάζουμε μια Γωνία;
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Για να σχεδιάσουμε με ακρίβεια μια γωνία συγκεκριμένου μέτρου (π.χ. 50°):
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2">
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-700 text-[11px] sm:text-xs">
                    <li>Χαράσσουμε με τον χάρακα μια αρχική ημιευθεία Οx (τη μία πλευρά).</li>
                    <li>Τοποθετούμε το κέντρο του μοιρογνωμονίου στην κορυφή Ο και το 0° πάνω στην ημιευθεία.</li>
                    <li>Σημειώνουμε μια κουκκίδα στην κλίμακα στον επιθυμητό αριθμό μοιρών (π.χ. 50°).</li>
                    <li>Ενώνουμε με τον χάρακα την κορυφή Ο με την κουκκίδα, σχηματίζοντας τη δεύτερη πλευρά Oy.</li>
                  </ol>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Ξεκινάμε πάντα το μέτρημα από το 0° της πλευράς που χαράξαμε, όχι από το 180°!
              </div>
            </article>

            {/* ΒΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Κανόνας 180°</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Άθροισμα Γωνιών Τριγώνου
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Σε <strong>οποιοδήποτε</strong> τρίγωνο στον κόσμο (οξυγώνιο, ορθογώνιο, αμβλυγώνιο, ισόπλευρο, ισοσκελές ή σκαληνό):
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 text-center font-mono">
                  <div className="text-amber-900 font-black text-sm sm:text-base">
                    Â ＋ B̂ ＋ Γ̂ ＝ 180°
                  </div>
                  <p className="text-[11px] text-slate-600 font-sans text-left pt-1">
                    Αν κόψουμε τις 3 γωνίες ενός χάρτινου τριγώνου και τις ενώσουμε δίπλα-δίπλα στην ίδια κορυφή, σχηματίζουν ακριβώς μια <strong>ευθεία γωνία (180°)</strong>!
                  </p>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Για να βρούμε την 3η γωνία τριγώνου: Αφαιρούμε από το 180° το άθροισμα των άλλων δύο!
              </div>
            </article>

            {/* ΒΗΜΑ 3 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Κανόνας 360°</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Άθροισμα Γωνιών Τετραπλεύρου
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Σε <strong>οποιοδήποτε</strong> τετράπλευρο (τετράγωνο, ορθογώνιο, ρόμβο, τραπέζιο ή τυχαίο):
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 text-center font-mono">
                  <div className="text-indigo-900 font-black text-sm sm:text-base">
                    Â ＋ B̂ ＋ Γ̂ ＋ Δ̂ ＝ 360°
                  </div>
                  <p className="text-[11px] text-slate-600 font-sans text-left pt-1">
                    <strong>Γιατί;</strong> Μια διαγώνιος χωρίζει το τετράπλευρο σε 2 τρίγωνα. Κάθε τρίγωνο έχει άθροισμα 180°, άρα: 2 · 180° ＝ <strong>360°</strong>!
                  </p>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Στο ορθογώνιο και στο τετράγωνο: 4 · 90° ＝ 360° (4 ορθές γωνίες).
              </div>
            </article>

            {/* ΒΗΜΑ 4 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Ειδικές Περιπτώσεις</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Ισόπλευρα &amp; Ισοσκελή Τρίγωνα
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Οι συμμετρίες των πλευρών καθορίζουν και τις γωνίες:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2">
                  <div>
                    • <strong>Ισόπλευρο τρίγωνο:</strong> 3 ίσες γωνίες. 180° : 3 ＝ <strong>60° καθεμία</strong>.
                  </div>
                  <div>
                    • <strong>Ισοσκελές τρίγωνο:</strong> Οι 2 γωνίες της βάσης είναι <strong>πάντα ίσες</strong> μεταξύ τους.
                  </div>
                  <div>
                    • <strong>Ορθογώνιο τρίγωνο:</strong> Η μία γωνία είναι 90°. Οι άλλες δύο είναι οξείες και συμπληρωματικές (άθροισμα 90°).
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Ένα τρίγωνο δεν μπορεί να έχει ποτέ δύο ορθές ή δύο αμβλείες γωνίες, γιατί θα ξεπερνούσε τις 180°!
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: SVG ΤΡΙΓΩΝΟ & ΑΘΡΟΙΣΜΑ 180° */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1</span>
            </div>
            <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Διαδραστικό Τρίγωνο: Το Μαγικό Άθροισμα των 180° (SVG)
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Άλλαξε τις γωνίες Â και B̂ και παρατήρησε πώς η τρίτη γωνία Γ̂ προσαρμόζεται αυτόματα ώστε το άθροισμα να μένει πάντα σταθερά 180°:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">

            {/* Χειριστήρια & Υπολογισμοί (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Slider Γωνίας A */}
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>ΓΩΝΙΑ Â:</span>
                  <span className="font-mono text-base font-black text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {angleA}°
                  </span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={120}
                  step={1}
                  value={angleA}
                  onChange={(e) => {
                    const newA = Number(e.target.value);
                    if (newA + angleB < 179) setAngleA(newA);
                  }}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
              </div>

              {/* Slider Γωνίας B */}
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>ΓΩΝΙΑ B̂:</span>
                  <span className="font-mono text-base font-black text-sky-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {angleB}°
                  </span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={120}
                  step={1}
                  value={angleB}
                  onChange={(e) => {
                    const newB = Number(e.target.value);
                    if (angleA + newB < 179) setAngleB(newB);
                  }}
                  className="w-full accent-sky-600 cursor-pointer touch-manipulation"
                />
              </div>

              {/* Αυτόματος Υπολογισμός Γωνίας Γ */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-emerald-950">Αυτόματος Υπολογισμός Γ̂:</span>
                  <span className="font-mono text-lg font-black text-emerald-700">
                    {angleC}°
                  </span>
                </div>
                <div className="text-slate-600 font-mono text-[11px] sm:text-xs">
                  180° － ({angleA}° ＋ {angleB}°) ＝ 180° － {angleA + angleB}° ＝ <strong>{angleC}°</strong>
                </div>
                <div className="pt-2 border-t border-emerald-200 flex justify-between items-center">
                  <span className="text-slate-700 font-semibold">Είδος Τριγώνου:</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-black text-xs ${triangleType.badge}`}>
                    {triangleType.name}
                  </span>
                </div>
              </div>
            </div>

            {/* SVG Visualizer Τριγώνου (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center">
              <svg
                viewBox="0 0 320 240"
                className="w-full max-w-[320px] sm:max-w-[380px] h-auto select-none"
              >
                {/* Τρίγωνο */}
                <polygon
                  points={polyPoints}
                  fill="rgba(99, 102, 241, 0.2)"
                  stroke="#818cf8"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />

                {/* Κορυφές & Ετικέτες */}
                {/* Κορυφή A (Πάνω) */}
                <circle cx={topX} cy={topY} r="5" fill="#f43f5e" />
                <text x={topX} y={topY - 10} fill="#f1f5f9" fontSize="12" fontWeight="bold" textAnchor="middle">
                  Â ＝ {angleA}°
                </text>

                {/* Κορυφή B (Κάτω Αριστερά) */}
                <circle cx="50" cy="200" r="5" fill="#38bdf8" />
                <text x="50" y="222" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">
                  B̂ ＝ {angleB}°
                </text>

                {/* Κορυφή C (Κάτω Δεξιά) */}
                <circle cx="270" cy="200" r="5" fill="#34d399" />
                <text x="270" y="222" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">
                  Γ̂ ＝ {angleC}°
                </text>

                {/* Ένδειξη Αθροίσματος στο κέντρο */}
                <text x="160" y="150" fill="#f59e0b" fontSize="14" fontWeight="900" textAnchor="middle">
                  {angleA}° ＋ {angleB}° ＋ {angleC}° ＝ 180°
                </text>
              </svg>

              <div className="mt-2 text-center text-xs text-slate-400">
                Όσο κι αν αλλάξουν οι γωνίες, το άθροισμα παραμένει πάντοτε αυστηρά 180°.
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΤΕΤΡΑΠΛΕΥΡΟ & ΑΘΡΟΙΣΜΑ 360° */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
              <span>📐 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΤΕΤΡΑΠΛΕΥΡΟ</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Εύρεση Άγνωστης Γωνίας Τετραπλεύρου (Άθροισμα 360°)
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Ρύθμισε τις 3 γνωστές γωνίες ενός τετραπλεύρου για να υπολογίσεις αυτόματα την τέταρτη γωνία:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

            {/* Ρυθμίσεις 3 Γωνιών (6 στήλες) */}
            <div className="lg:col-span-6 space-y-3">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                  <span className="font-bold text-slate-500 block">Â: {qA}°</span>
                  <input
                    type="range"
                    min={40}
                    max={140}
                    value={qA}
                    onChange={(e) => setQA(Number(e.target.value))}
                    className="w-full mt-1 accent-indigo-600"
                  />
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                  <span className="font-bold text-slate-500 block">B̂: {qB}°</span>
                  <input
                    type="range"
                    min={40}
                    max={140}
                    value={qB}
                    onChange={(e) => setQB(Number(e.target.value))}
                    className="w-full mt-1 accent-sky-600"
                  />
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                  <span className="font-bold text-slate-500 block">Γ̂: {qC}°</span>
                  <input
                    type="range"
                    min={40}
                    max={140}
                    value={qC}
                    onChange={(e) => setQC(Number(e.target.value))}
                    className="w-full mt-1 accent-emerald-600"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600">
                💡 <strong>Απόδειξη:</strong> Κάθε τετράπλευρο χωρίζεται με 1 διαγώνιο σε 2 τρίγωνα. Άθροισμα ＝ 2 · 180° ＝ <strong>360°</strong>.
              </div>
            </div>

            {/* Αποτέλεσμα 4ης Γωνίας (6 στήλες) */}
            <div className="lg:col-span-6 bg-purple-50/70 p-5 rounded-3xl border border-purple-200 text-center space-y-2">
              <span className="text-xs text-purple-900 block font-bold uppercase tracking-wider">
                ΖΗΤΟΥΜΕΝΗ 4Η ΓΩΝΙΑ (Δ̂)
              </span>
              <div className="text-3xl sm:text-4xl font-black text-purple-800 font-mono">
                {qD}°
              </div>
              <div className="text-xs text-slate-700 font-mono">
                360° － ({qA}° ＋ {qB}° ＋ {qC}°) ＝ 360° － {qA + qB + qC}° ＝ <strong>{qD}°</strong>
              </div>
              <div className="text-[11px] text-purple-950 font-sans pt-1">
                Έλεγχος: {qA}° ＋ {qB}° ＋ {qC}° ＋ {qD}° ＝ <strong>360°</strong>!
              </div>
            </div>

          </div>
        </section>

        {/* 5. ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ ΚΑΘΗΜΕΡΙΝΗΣ ΖΩΗΣ */}
        <section className="space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight">
              Λυμένα Προβλήματα με Αθροίσματα Γωνιών
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Εφαρμογές των κανόνων των 180° και 360° σε ρεαλιστικά σενάρια.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ΠΡΟΒΛΗΜΑ 1 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-900 text-xs font-black rounded-lg uppercase">
                  ΠΡΟΒΛΗΜΑ 1: ΣΤΕΓΗ ΣΠΙΤΙΟΥ
                </span>
                <span className="text-xs font-bold text-slate-400">Ισοσκελές Τρίγωνο</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Υπολογισμός Γωνιών Βάσης σε Ισοσκελή Στέγη
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Η ξύλινη σκεπή ενός σπιτιού έχει σχήμα ισοσκελούς τριγώνου. Η γωνία της κορυφής είναι <strong>70°</strong>. Πόσες μοίρες είναι καθεμία από τις δύο γωνίες της βάσης της σκεπής;
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΔΕΔΟΜΕΝΑ ΠΡΟΒΛΗΜΑΤΟΣ
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Γωνία κορυφής</span> 70°
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Σύνολο γωνιών</span> 180°
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Γωνίες βάσης</span> 2 ίσες γωνίες
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήματα Επίλυσης:</span>
                  <div>• <strong>Άθροισμα 2 γωνιών βάσης:</strong> 180° － 70° ＝ <strong>110°</strong>.</div>
                  <div>• <strong>Κάθε γωνία βάσης (ίσες):</strong> 110° : 2 ＝ <strong className="text-blue-700">55°</strong>.</div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 font-medium">
                💡 Στο ισοσκελές τρίγωνο, οι γωνίες που βρίσκονται απέναντι από τις ίσες πλευρές είναι πάντοτε ίσες μεταξύ τους!
              </div>
            </article>

            {/* ΠΡΟΒΛΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-lg uppercase">
                  ΠΡΟΒΛΗΜΑ 2: ΤΡΑΠΕΖΙΟ ΟΙΚΟΠΕΔΟ
                </span>
                <span className="text-xs font-bold text-slate-400">Τετράπλευρο</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Εύρεση Άγνωστης Γωνίας σε Οικόπεδο
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ένα οικόπεδο έχει σχήμα τετραπλεύρου. Ο τοπογράφος μέτρησε τις τρεις γωνίες του και βρήκε ότι είναι <strong>90°</strong>, <strong>115°</strong> και <strong>80°</strong>. Πόσες μοίρες είναι η τέταρτη γωνία του οικοπέδου;
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΣΤΟΙΧΕΙΑ ΥΠΟΛΟΓΙΣΜΟΥ
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold text-[11px]">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Σύνολο</span> 360°
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Άθροισμα 3</span> 90° ＋ 115° ＋ 80° ＝ 285°
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Πράξη</span> 360° － 285°
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήματα Επίλυσης:</span>
                  <div>• <strong>Προσθέτουμε τις 3 γνωστές γωνίες:</strong> 90° ＋ 115° ＋ 80° ＝ <strong>285°</strong>.</div>
                  <div>• <strong>Αφαιρούμε από το 360°:</strong> 360° － 285° ＝ <strong className="text-amber-700">75°</strong>.</div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 font-medium">
                ⚡ Επαλήθευση: 90° ＋ 115° ＋ 80° ＋ 75° ＝ 360°, άρα ο υπολογισμός είναι ακριβής.
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
                  <strong>Μην μπερδεύετε το άθροισμα τριγώνου (180°) με του τετραπλεύρου (360°):</strong> Σε κάθε τρίγωνο το άθροισμα είναι πάντα 180°. Σε κάθε τετράπλευρο είναι διπλάσιο, δηλαδή 360° (διότι αποτελείται από 2 τρίγωνα).
                </li>
                <li>
                  <strong>Ένα τρίγωνο δεν μπορεί να έχει 2 ορθές γωνίες:</strong> Αν είχε δύο ορθές (90° ＋ 90° ＝ 180°), η τρίτη γωνία θα έπρεπε να είναι 0°, πράγμα αδύνατο.
                </li>
                <li>
                  <strong>Προσοχή στην ορθογώνια γωνία:</strong> Όταν ένα πρόβλημα αναφέρει «ορθογώνιο τρίγωνο» χωρίς να δίνει νούμερο, θυμόμαστε ότι περιλαμβάνει μία γωνία ακριβώς <strong>90°</strong>!
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 7. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στα Αθροίσματα Γωνιών!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε 12 διαδραστικές ασκήσεις με κατασκευή γωνιών, τρίγωνα και τετράπλευρα για τη ΣΤ' Δημοτικού.
            </p>
          </div>

          <Link
            href="/st-dimotikou/69-athroisma-gonion-ask"
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
