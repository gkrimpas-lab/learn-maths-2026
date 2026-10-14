// pages/st-dimotikou/79-kilindros.js
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

export default function KilindrosTheoriaPage() {
  // -------------------------------------------------------------------------
  // Εργαστήριο 1: Διαδραστικό Ξετύλιγμα Κυλίνδρου προς τα Δεξιά (SVG)
  // -------------------------------------------------------------------------
  // Slider προόδου: 0% (κλειστός κύλινδρος αριστερά) έως 100% (πλήρες ανάπτυγμα)
  const [unrollProgress, setUnrollProgress] = useState(0);

  const radiusR = 36; // Ακτίνα ρ = 36px
  const heightH = 80; // Ύψος υ = 80px
  const maxRectWidth = 2 * Math.PI * radiusR; // 2 * 3.1415 * 36 ≈ 226px

  // Δυναμικές παράμετροι αναδίπλωσης
  const progressRatio = unrollProgress / 100;
  const currentRectW = progressRatio * maxRectWidth;
  const cylinderX = 75 + currentRectW; // Ο κύλινδρος κυλάει προς τα δεξιά

  // -------------------------------------------------------------------------
  // Εργαστήριο 2: Δυναμικός Υπολογιστής Εμβαδών Κυλίνδρου
  // -------------------------------------------------------------------------
  const [calcRadius, setCalcRadius] = useState(5); // Ακτίνα ρ σε cm
  const [calcHeight, setCalcHeight] = useState(10); // Ύψος υ σε cm
  const piVal = 3.14;

  const diameter = useMemo(() => calcRadius * 2, [calcRadius]);
  const baseCircumference = useMemo(() => 2 * piVal * calcRadius, [calcRadius]);
  const oneBaseArea = useMemo(() => piVal * calcRadius * calcRadius, [calcRadius]);
  const twoBasesArea = useMemo(() => 2 * oneBaseArea, [oneBaseArea]);
  const lateralArea = useMemo(() => baseCircumference * calcHeight, [baseCircumference, calcHeight]);
  const totalArea = useMemo(() => lateralArea + twoBasesArea, [lateralArea, twoBasesArea]);

  const totalAreaDm2 = useMemo(() => totalArea / 100, [totalArea]);
  const totalAreaM2 = useMemo(() => totalArea / 10000, [totalArea]);

  return (
    <Layout
      title="Κύλινδρος: Ανάπτυγμα &amp; Εμβαδόν Επιφάνειας - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μαθαίνουμε για τον κύλινδρο, το ανάπτυγμά του, πώς υπολογίζουμε το εμβαδόν βάσεων, παράπλευρης και ολικής επιφάνειας με διαδραστικά εργαστήρια SVG."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/79-kilindros-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 79 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Ο Κύλινδρος • Ανάπτυγμα, Παράπλευρη &amp; Ολική Επιφάνεια
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Ανακαλύπτουμε τα μυστικά του κυλίνδρου! Βλέπουμε πώς ένα κονσερβοκούτι ή ένα βαρέλι «ξετυλίγεται» σε ένα 
              <strong> ορθογώνιο παραλληλόγραμμο</strong> και <strong>δύο ίσους κυκλικούς δίσκους</strong>, 
              και μαθαίνουμε να υπολογίζουμε με ευκολία το <strong>εμβαδόν των βάσεων</strong>, την <strong>παράπλευρη επιφάνεια</strong> και το <strong>ολικό εμβαδόν</strong>.
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία, Ανάπτυγμα, Παράπλευρη &amp; Ολική Επιφάνεια &amp; Διαδραστικά Εργαστήρια</span>
            </div>
            <Link
              href="/st-dimotikou/79-kilindros-ask"
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
              Ο Κύλινδρος σε 4 Βήματα
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Από τη δομή του στερεού μέχρι το ξετύλιγμα της παράπλευρης επιφάνειας και τον τελικό υπολογισμό.
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
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Στοιχεία Στερεού</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Τι είναι ο Κύλινδρος;
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Ο κύλινδρος είναι ένα σώμα εκ περιστροφής (δεν είναι πολύεδρο) που αποτελείται από:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 font-mono">
                  <div className="text-indigo-950 font-bold">
                    • 2 Παράλληλες Βάσεις:
                  </div>
                  <div className="text-slate-700 text-xs font-sans">
                    Δύο απολύτως ίσοι κυκλικοί δίσκοι με ακτίνα <strong>ρ</strong> (πάνω και κάτω βάση).
                  </div>
                  <div className="text-indigo-950 font-bold pt-1 border-t border-slate-200">
                    • 1 Καμπύλη Παράπλευρη Επιφάνεια:
                  </div>
                  <div className="text-slate-700 text-xs font-sans">
                    Η κυρτή επιφάνεια που αγκαλιάζει τις δύο βάσεις με ύψος <strong>υ</strong>.
                  </div>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Παραδείγματα στην καθημερινή ζωή: κονσέρβες, σωλήνες, κολόνες, ποτήρια, βαρέλια και μπαταρίες!
              </div>
            </article>

            {/* ΒΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Το Ανάπτυγμα</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Πώς Ξετυλίγεται ο Κύλινδρος;
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Αν «κόψουμε» κατακόρυφα την παράπλευρη επιφάνεια και την ανοίξουμε επίπεδα:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2">
                  <div>
                    1. Η παράπλευρη επιφάνεια γίνεται ένα <strong>ορθογώνιο παραλληλόγραμμο</strong>.
                  </div>
                  <div className="font-mono text-xs">
                    • <strong>Μήκος ορθογωνίου:</strong> Ίσο με την περίμετρο του κύκλου της βάσης: <strong>2 · π · ρ</strong>.
                  </div>
                  <div className="font-mono text-xs">
                    • <strong>Πλάτος ορθογωνίου:</strong> Ίσο με το ύψος του κυλίνδρου: <strong>υ</strong>.
                  </div>
                  <div className="text-amber-950 font-bold pt-1 border-t border-slate-200">
                    Επίσης, συνδέονται οι δύο κυκλικοί δίσκοι των βάσεων (επάνω και κάτω).
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Σκεφτείτε την ετικέτα μιας κονσέρβας: όταν την ξεκολλάμε, είναι ένα απλό ορθογώνιο χαρτί!
              </div>
            </article>

            {/* ΒΗΜΑ 3 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Οι Τύποι</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Υπολογισμός Εμβαδών
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Χρησιμοποιούμε τον μαθηματικό αριθμό <strong>π ≈ 3,14</strong> και την ακτίνα <strong>ρ</strong>:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 font-mono">
                  <div>
                    • <strong>Εμβαδόν 1 Βάσης:</strong><br />
                    Εβ ＝ π · ρ² ＝ 3,14 · ρ · ρ
                  </div>
                  <div>
                    • <strong>Εμβαδόν 2 Βάσεων:</strong><br />
                    2 · Εβ ＝ 2 · (π · ρ²)
                  </div>
                  <div>
                    • <strong>Παράπλευρη Επιφάνεια:</strong><br />
                    Επ ＝ (2 · π · ρ) · υ
                  </div>
                  <div className="text-indigo-950 font-black pt-1 border-t border-slate-200">
                    • Ολική Επιφάνεια: Εολ ＝ Επ ＋ 2 · Εβ
                  </div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Αν το δοχείο είναι ανοιχτό από πάνω (χωρίς καπάκι), υπολογίζουμε μόνο τη 1 βάση: Εολ ＝ Επ ＋ Εβ!
              </div>
            </article>

            {/* ΒΗΜΑ 4 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Εφαρμογές</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Μονάδες &amp; Προσοχή στη Διάμετρο
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Πρακτικοί κανόνες για σωστή επίλυση προβλημάτων:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 font-mono">
                  <div>
                    • <strong>Αν δίνεται η διάμετρος (δ):</strong><br />
                    Βρίσκουμε πρώτα την ακτίνα: <strong>ρ ＝ δ : 2</strong>.
                  </div>
                  <div>
                    • <strong>Μονάδες Επιφάνειας:</strong><br />
                    1 m² ＝ 100 dm² ＝ 10.000 cm².<br />
                    Όλα τα εμβαδά μετριούνται σε τετραγωνικές μονάδες (cm², m²).
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Βεβαιωθείτε ότι η ακτίνα ρ και το ύψος υ είναι εκφρασμένα στην ίδια μονάδα μέτρησης πριν πολλαπλασιάσετε!
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΚΥΛΙΣΜΑ & ΞΕΤΥΛΙΓΜΑ ΚΥΛΙΝΔΡΟΥ (SVG) */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1</span>
            </div>
            <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Πώς Ξετυλίγεται ο Κύλινδρος προς τα Δεξιά; (SVG)
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Σύρε την μπάρα: Παρατήρησε πώς ο κύλινδρος κυλάει προς τα δεξιά, αφήνοντας πίσω του την παράπλευρη επιφάνεια να ξετυλίγεται σε ορθογώνιο, ενώ οι δύο βάσεις ανοίγουν πάνω και κάτω:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">

            {/* Slider & Επεξήγηση (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>ΞΕΤΥΛΙΓΜΑ ΠΡΟΣ ΤΑ ΔΕΞΙΑ:</span>
                  <span className="font-mono text-base font-black text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {unrollProgress}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={unrollProgress}
                  onChange={(e) => setUnrollProgress(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>0% (Κύλινδρος)</span>
                  <span>50% (Ξετύλιγμα)</span>
                  <span>100% (Πλήρες Ανάπτυγμα)</span>
                </div>
              </div>

              {/* Κάρτα Επεξήγησης */}
              <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 space-y-2 text-xs sm:text-sm">
                <div className="font-bold text-sky-950">
                  {unrollProgress === 0 && '🔷 Αρχικός Κύλινδρος: 2 κυκλικές βάσεις και καμπύλη επιφάνεια.'}
                  {unrollProgress > 0 && unrollProgress < 100 && '🔄 Ο κύλινδρος κυλάει προς τα δεξιά και απλώνει την επιφάνειά του...'}
                  {unrollProgress === 100 && '🟩 Ολοκληρώθηκε: 1 ορθογώνιο μήκους (2 · π · ρ) και 2 κύκλοι βάσεων!'}
                </div>
                <div className="text-slate-600 text-[11px] space-y-1 font-mono pt-1 border-t border-sky-200/60">
                  <div>• <strong>Μήκος Ορθογωνίου:</strong> 2 · π · ρ ＝ 2 · 3,14 · {radiusR} ≈ <strong>{Math.round(maxRectWidth)} px</strong></div>
                  <div>• <strong>Ύψος Ορθογωνίου:</strong> Ύψος υ ＝ <strong>{heightH} px</strong></div>
                  <div>• <strong>Εμβαδόν Παράπλευρης:</strong> Επ ＝ (2 · π · ρ) · υ</div>
                  <div className="text-indigo-900 font-bold">• <strong>Ολικό Εμβαδόν:</strong> Εολ ＝ Επ ＋ 2 · (π · ρ²)</div>
                </div>
              </div>
            </div>

            {/* SVG Visualizer με Άπλωμα προς τα Δεξιά & Καθαρή Στοίχιση (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 min-h-[380px] p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center">
              <svg
                viewBox="0 0 460 300"
                className="w-full max-w-[460px] h-auto select-none overflow-visible"
              >
                {/* 1. Ξετυλιγμένο Ορθογώνιο Παράπλευρης Επιφάνειας (Μπλε - μεγαλώνει προς τα δεξιά) */}
                {unrollProgress > 0 && (
                  <g>
                    <rect
                      x="75"
                      y={110}
                      width={currentRectW}
                      height={heightH}
                      fill="rgba(56, 189, 248, 0.35)"
                      stroke="#38bdf8"
                      strokeWidth="2"
                      rx="3"
                    />

                    {/* Ετικέτα μέσα στο ορθογώνιο (εμφανίζεται όταν υπάρχει αρκετός χώρος) */}
                    {unrollProgress > 30 && (
                      <text
                        x={75 + currentRectW / 2}
                        y={110 + heightH / 2 + 5}
                        fill="#ffffff"
                        fontSize={unrollProgress === 100 ? 12 : 10}
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {unrollProgress === 100
                          ? 'Παράπλευρη Επιφάνεια: Επ ＝ (2 · π · ρ) · υ'
                          : 'Ξετύλιγμα...'}
                      </text>
                    )}

                    {/* Ετικέτες Διαστάσεων στο 100% */}
                    {unrollProgress === 100 && (
                      <>
                        {/* Ένδειξη Μήκους Ορθογωνίου (επάνω με ασφαλές περιθώριο) */}
                        <line x1="75" y1="92" x2={75 + maxRectWidth} y2="92" stroke="#38bdf8" strokeWidth="1.5" />
                        <text x={75 + maxRectWidth / 2} y="84" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">
                          Μήκος ＝ 2 · π · ρ
                        </text>

                        {/* Ένδειξη Ύψους υ (δεξιά) */}
                        <line x1={75 + maxRectWidth + 15} y1={110} x2={75 + maxRectWidth + 15} y2={110 + heightH} stroke="#f59e0b" strokeWidth="2" />
                        <text x={75 + maxRectWidth + 26} y={110 + heightH / 2 + 4} fill="#f59e0b" fontSize="13" fontWeight="black" textAnchor="start">
                          υ
                        </text>
                      </>
                    )}
                  </g>
                )}

                {/* 2. Πάνω Κυκλική Βάση (Πράσινη - ανοίγει προς τα πάνω) */}
                {unrollProgress > 0 && (
                  <g transform={`translate(${75 + currentRectW / 2}, ${110 - (progressRatio * (radiusR + 25))})`}>
                    <circle
                      cx="0"
                      cy="0"
                      r={radiusR}
                      fill="rgba(52, 211, 153, 0.45)"
                      stroke="#34d399"
                      strokeWidth="2"
                    />
                    {/* Ένδειξη ακτίνας ρ */}
                    <line x1="0" y1="0" x2={radiusR} y2="0" stroke="#f59e0b" strokeWidth="2" />
                    <circle cx="0" cy="0" r="2.5" fill="#ffffff" />
                    <text x={radiusR / 2} y="-6" fill="#f59e0b" fontSize="11" fontWeight="bold" textAnchor="middle">
                      ρ
                    </text>
                    <text x="0" y="16" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                      Βάση (π · ρ²)
                    </text>
                  </g>
                )}

                {/* 3. Κάτω Κυκλική Βάση (Μωβ - ανοίγει προς τα κάτω) */}
                {unrollProgress > 0 && (
                  <g transform={`translate(${75 + currentRectW / 2}, ${110 + heightH + (progressRatio * (radiusR + 25))})`}>
                    <circle
                      cx="0"
                      cy="0"
                      r={radiusR}
                      fill="rgba(168, 85, 247, 0.45)"
                      stroke="#c084fc"
                      strokeWidth="2"
                    />
                    <text x="0" y="4" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                      Βάση (π · ρ²)
                    </text>
                  </g>
                )}

                {/* 4. Ο Κύλινδρος που κυλάει προς τα δεξιά (όσο unrollProgress < 100) */}
                {unrollProgress < 100 && (
                  <g transform={`translate(${cylinderX}, 110)`}>
                    {/* Σώμα κυλίνδρου */}
                    <rect
                      x={-radiusR * 0.4}
                      y="0"
                      width={radiusR * 0.8}
                      height={heightH}
                      fill="rgba(56, 189, 248, 0.6)"
                      stroke="#38bdf8"
                      strokeWidth="2"
                    />
                    {/* Κάτω καπάκι σε προοπτική */}
                    <ellipse
                      cx="0"
                      cy={heightH}
                      rx={radiusR * 0.4}
                      ry={10}
                      fill="rgba(168, 85, 247, 0.7)"
                      stroke="#c084fc"
                      strokeWidth="2"
                    />
                    {/* Πάνω καπάκι */}
                    <ellipse
                      cx="0"
                      cy="0"
                      rx={radiusR * 0.4}
                      ry={10}
                      fill="rgba(52, 211, 153, 0.8)"
                      stroke="#34d399"
                      strokeWidth="2"
                    />
                    {/* Κείμενο ένδειξης κυλίνδρου */}
                    {unrollProgress === 0 && (
                      <>
                        <text x="0" y={heightH / 2 + 4} fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                          Κύλινδρος
                        </text>
                        {/* Ύψος υ στα δεξιά του αρχικού κυλίνδρου */}
                        <line x1={radiusR * 0.4 + 12} y1="0" x2={radiusR * 0.4 + 12} y2={heightH} stroke="#f59e0b" strokeWidth="2" />
                        <text x={radiusR * 0.4 + 22} y={heightH / 2 + 4} fill="#f59e0b" fontSize="12" fontWeight="bold" textAnchor="start">
                          υ
                        </text>
                      </>
                    )}
                  </g>
                )}
              </svg>

              <div className="mt-3 text-center text-xs text-slate-400">
                {unrollProgress === 100
                  ? '✓ Το ανάπτυγμα απλώθηκε πλήρως: 1 ορθογώνιο (2 · π · ρ) · υ και 2 κυκλικές βάσεις π · ρ².'
                  : 'Ο κύλινδρος κυλάει προς τα δεξιά απλώνοντας την παράπλευρη επιφάνεια σε ορθογώνιο.'}
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΥΠΟΛΟΓΙΣΤΗΣ ΕΜΒΑΔΩΝ ΚΥΛΙΝΔΡΟΥ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
              <span>📐 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΥΠΟΛΟΓΙΣΤΗΣ ΕΜΒΑΔΩΝ</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Υπολογισμός Παράπλευρης &amp; Ολικής Επιφάνειας
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Άλλαξε την ακτίνα (ρ) και το ύψος (υ) σε cm για να υπολογίσεις αυτόματα όλα τα εμβαδά του κυλίνδρου:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

            {/* Sliders Ακτίνας ρ και Ύψους υ (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
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

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>ΥΨΟΣ ΚΥΛΙΝΔΡΟΥ (υ):</span>
                  <span className="font-mono text-base font-black text-sky-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {calcHeight} cm
                  </span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={30}
                  step={1}
                  value={calcHeight}
                  onChange={(e) => setCalcHeight(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer touch-manipulation"
                />
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 font-mono space-y-1.5">
                <div>• Περίμετρος βάσης: 2 · π · ρ ＝ 2 · 3,14 · {calcRadius} ＝ <strong>{formatNum(baseCircumference)} cm</strong></div>
                <div>• Εμβαδόν 1 βάσης: π · ρ² ＝ 3,14 · {calcRadius} · {calcRadius} ＝ <strong>{formatNum(oneBaseArea)} cm²</strong></div>
                <div>• Εμβαδόν 2 βάσεων: 2 · {formatNum(oneBaseArea)} ＝ <strong>{formatNum(twoBasesArea)} cm²</strong></div>
                <div className="text-indigo-900 font-bold">• Παράπλευρη επιφάνεια: {formatNum(baseCircumference)} · {calcHeight} ＝ <strong>{formatNum(lateralArea)} cm²</strong></div>
              </div>
            </div>

            {/* Αποτελέσματα Ολικής Επιφάνειας (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 p-5 sm:p-7 rounded-3xl border border-slate-800 text-white space-y-3">
              <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider text-center">
                ΟΛΙΚΟ ΕΜΒΑΔΟΝ ΚΥΛΙΝΔΡΟΥ (Εολ ＝ Επ ＋ 2 · Εβ)
              </span>

              <div className="text-center py-2">
                <span className="text-3xl sm:text-4xl font-black font-mono text-emerald-400">
                  {formatNum(totalArea)} cm²
                </span>
                <span className="text-xs text-slate-400 block mt-1 font-sans">
                  {formatNum(lateralArea)} cm² (παράπλευρη) ＋ {formatNum(twoBasesArea)} cm² (2 βάσεις)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs sm:text-sm pt-2 border-t border-slate-800">
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                  <span className="text-slate-400 font-sans text-xs block">Σε dm² (: 100):</span>
                  <span className="text-amber-400 font-black text-base">{formatNum(totalAreaDm2)} dm²</span>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                  <span className="text-slate-400 font-sans text-xs block">Σε m² (: 10.000):</span>
                  <span className="text-purple-400 font-black text-base">{formatNum(totalAreaM2)} m²</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 text-center pt-1 font-sans">
                💡 Αν ο κύλινδρος είναι ανοιχτός από πάνω (π.χ. ποτήρι), το ολικό εμβαδόν είναι Επ ＋ Εβ ＝ {formatNum(lateralArea + oneBaseArea)} cm².
              </div>
            </div>

          </div>
        </section>

        {/* 5. ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ ΚΑΘΗΜΕΡΙΝΗΣ ΖΩΗΣ */}
        <section className="space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight">
              Λυμένα Προβλήματα με Εμβαδόν Κυλίνδρου
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Εφαρμογές των τύπων σε μεταλλικές κονσέρβες και βαρέλια αποθήκευσης.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ΠΡΟΒΛΗΜΑ 1 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-900 text-xs font-black rounded-lg uppercase">
                  ΠΡΟΒΛΗΜΑ 1: ΕΤΙΚΕΤΑ ΚΟΝΣΕΡΒΑΣ
                </span>
                <span className="text-xs font-bold text-slate-400">Παράπλευρη Επιφάνεια</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Υπολογισμός Χάρτινης Ετικέτας για Κονσέρβα
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Μια κυλινδρική κονσέρβα έχει διάμετρο βάσης <strong>10 cm</strong> και ύψος <strong>12 cm</strong>. 
                Πόσα τετραγωνικά εκατοστόμετρα (cm²) χαρτιού χρειάζονται για να καλυφθεί ολόκληρη η γύρω-γύρω επιφάνειά της (η ετικέτα); (Χρησιμοποιήστε π ＝ 3,14)
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΔΕΔΟΜΕΝΑ ΠΡΟΒΛΗΜΑΤΟΣ
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Διάμετρος (δ)</span> 10 cm
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Ακτίνα (ρ)</span> 10 : 2 ＝ 5 cm
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Ύψος (υ)</span> 12 cm
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήματα Επίλυσης:</span>
                  <div>• Η ετικέτα καλύπτει <strong>μόνο την παράπλευρη επιφάνεια</strong> (όχι τα καπάκια).</div>
                  <div>• <strong>Μήκος ετικέτας (περίμετρος βάσης):</strong> 2 · π · ρ ＝ 2 · 3,14 · 5 ＝ <strong>31,4 cm</strong>.</div>
                  <div>• <strong>Εμβαδόν ετικέτας (Επ):</strong> 31,4 · 12 ＝ <strong className="text-blue-700">376,8 cm²</strong>.</div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 font-medium">
                💡 Όταν μας ζητείται η ετικέτα, υπολογίζουμε αποκλειστικά την παράπλευρη επιφάνεια: Επ ＝ (2 · π · ρ) · υ!
              </div>
            </article>

            {/* ΠΡΟΒΛΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-lg uppercase">
                  ΠΡΟΒΛΗΜΑ 2: ΒΑΨΙΜΟ ΒΑΡΕΛΙΟΥ
                </span>
                <span className="text-xs font-bold text-slate-400">Ολική Επιφάνεια</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Βάψιμο Κλειστού Κυλινδρικού Βαρελιού
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ένα μεταλλικό κλειστό βαρέλι έχει ακτίνα βάσης <strong>0,5 m</strong> και ύψος <strong>2 m</strong>. 
                Θέλουμε να βάψουμε ολόκληρη την εξωτερική του επιφάνεια (και τα δύο καπάκια και γύρω-γύρω). Πόσα m² θα βαφτούν; (π ＝ 3,14)
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΣΤΟΙΧΕΙΑ ΥΠΟΛΟΓΙΣΜΟΥ
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold text-[11px]">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Ακτίνα (ρ)</span> 0,5 m
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Ύψος (υ)</span> 2 m
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Τύπος</span> Εολ ＝ Επ ＋ 2 · Εβ
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήματα Επίλυσης:</span>
                  <div>• <strong>Παράπλευρη επιφάνεια:</strong> 2 · 3,14 · 0,5 · 2 ＝ 3,14 · 2 ＝ <strong>6,28 m²</strong>.</div>
                  <div>• <strong>Εμβαδόν 1 βάσης:</strong> 3,14 · 0,5 · 0,5 ＝ 3,14 · 0,25 ＝ <strong>0,785 m²</strong>.</div>
                  <div>• <strong>Εμβαδόν 2 βάσεων:</strong> 2 · 0,785 ＝ <strong>1,57 m²</strong>.</div>
                  <div>• <strong>Ολική επιφάνεια:</strong> 6,28 ＋ 1,57 ＝ <strong className="text-amber-700">7,85 m²</strong>.</div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 font-medium">
                ⚡ Επειδή το βαρέλι είναι κλειστό, προσθέτουμε οπωσδήποτε και τις 2 κυκλικές βάσεις (καπάκια)!
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
                  <strong>Μην ξεχνάτε ότι οι βάσεις είναι ΔΥΟ:</strong> Στην ολική επιφάνεια του κλειστού κυλίνδρου προσθέτουμε <strong>δύο βάσεις</strong>: <strong>Εολ ＝ Επ ＋ 2 · Εβ</strong> (όχι μόνο μία).
                </li>
                <li>
                  <strong>Μην μπερδεύετε το 2 · π · ρ με το π · ρ²:</strong> Το <strong>2 · π · ρ</strong> είναι το μήκος της περιφέρειας (το μήκος του ορθογωνίου). Το <strong>π · ρ²</strong> είναι το εμβαδόν του κυκλικού δίσκου (της βάσης).
                </li>
                <li>
                  <strong>Αν δίνεται η διάμετρος:</strong> Πάντα πρώτα διαιρούμε με το 2 για να βρούμε την ακτίνα ρ: <strong>ρ ＝ δ : 2</strong>.
                </li>
                <li>
                  <strong>Ανοιχτά δοχεία:</strong> Προσέξτε την εκφώνηση! Αν το δοχείο είναι ανοιχτό από πάνω (όπως ένα ποτήρι ή κουβάς), έχει μόνο <strong>1 βάση</strong>. Αν είναι σωλήνας ανοιχτός και από τις δύο μεριές, υπολογίζουμε <strong>μόνο την παράπλευρη επιφάνεια</strong>.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 7. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στον Κύλινδρο!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε 12 διαδραστικές ασκήσεις με υπολογισμούς παράπλευρης επιφάνειας, βάσεων και ολικού εμβαδού κυλίνδρου για τη ΣΤ' Δημοτικού.
            </p>
          </div>

          <Link
            href="/st-dimotikou/79-kilindros-ask"
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
