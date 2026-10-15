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
  // Εργαστήριο 1: Διαδραστικό Άνοιγμα Καπακιών & Ξετύλιγμα Κυλίνδρου (SVG)
  // 0% -> 40%: Άνοιγμα καπακιών (πάνω & κάτω)
  // 40% -> 100%: Ξετύλιγμα της παράπλευρης επιφάνειας σε ορθογώνιο
  // -------------------------------------------------------------------------
  const [animProgress, setAnimProgress] = useState(0);

  const radiusR = 35; // Ακτίνα ρ = 35px
  const heightH = 85; // Ύψος υ = 85px
  const rectW = 2 * Math.PI * radiusR; // 2 · 3,1415 · 35 ≈ 220px
  const centerX = 200; // Κέντρο του καμβά στο SVG
  const topY = 110;

  // Υπολογισμοί σταδίων κίνησης
  // Στάδιο 1: 0% έως 40% (Άνοιγμα καπακιών)
  const capStage = Math.min(1, animProgress / 40);
  const capTopOffset = capStage * (radiusR + 10);
  const capBottomOffset = capStage * (radiusR + 10);

  // Στάδιο 2: 40% έως 100% (Ξετύλιγμα παράπλευρης επιφάνειας)
  const unrollStage = Math.max(0, (animProgress - 40) / 60);

  // Πλάτος ξετυλίγματος: από το αρχικό πλάτος κυλίνδρου (2*ρ = 70px) έως το πλήρες ορθογώνιο (220px)
  const startW = radiusR * 2;
  const currentW = startW + unrollStage * (rectW - startW);

  // Καμπυλότητα κυλινδρικής επιφάνειας: εξαφανίζεται όσο πλησιάζουμε στο 100%
  const cylinderOpacity = Math.max(0, 1 - unrollStage * 1.5);
  const rectOpacity = Math.min(1, unrollStage * 1.5);

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

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΑΝΟΙΓΜΑ ΚΑΠΑΚΙΩΝ & ΞΕΤΥΛΙΓΜΑ ΚΥΛΙΝΔΡΟΥ (SVG) */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1</span>
            </div>
            <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Πώς Ανοίγει ο Κύλινδρος στο Ανάπτυγμά του; (SVG)
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Σύρε την μπάρα προόδου: Στο πρώτο στάδιο τα 2 καπάκια ανοίγουν πάνω και κάτω, και στο δεύτερο στάδιο η κυρτή επιφάνεια ξετυλίγεται σε ορθογώνιο διαστάσεων (2 · π · ρ) επί υ:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">

            {/* Slider & Επεξήγηση (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>ΣΤΑΔΙΟ ΑΝΑΠΤΥΓΜΑΤΟΣ:</span>
                  <span className="font-mono text-base font-black text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {animProgress}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={animProgress}
                  onChange={(e) => setAnimProgress(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>0% (Κύλινδρος)</span>
                  <span>40% (Άνοιγμα Καπακιών)</span>
                  <span>100% (Πλήρες Ανάπτυγμα)</span>
                </div>
              </div>

              {/* Κάρτα Επεξήγησης */}
              <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 space-y-2 text-xs sm:text-sm">
                <div className="font-bold text-sky-950">
                  {animProgress === 0 && '🔷 Στάδιο 0: Κλειστός κύλινδρος με 2 κυκλικές βάσεις και καμπύλη επιφάνεια.'}
                  {animProgress > 0 && animProgress < 40 && '🔄 Στάδιο 1: Τα δύο κυκλικά καπάκια ξεκουμπώνουν και ανοίγουν πάνω & κάτω...'}
                  {animProgress >= 40 && animProgress < 100 && '🔄 Στάδιο 2: Η καμπύλη παράπλευρη επιφάνεια ξετυλίγεται ομαλά σε ορθογώνιο φύλλο...'}
                  {animProgress === 100 && '🟩 Ολοκληρώθηκε: 1 ορθογώνιο μήκους (2 · π · ρ) και 2 κυκλικές βάσεις!'}
                </div>
                <div className="text-slate-600 text-[11px] space-y-1 font-mono pt-1 border-t border-sky-200/60">
                  <div>• <strong>Μήκος Ορθογωνίου:</strong> 2 · π · ρ ＝ 2 · 3,14 · {radiusR} ≈ <strong>{Math.round(rectW)} px</strong></div>
                  <div>• <strong>Ύψος Ορθογωνίου:</strong> Ύψος υ ＝ <strong>{heightH} px</strong></div>
                  <div>• <strong>Εμβαδόν Παράπλευρης:</strong> Επ ＝ (2 · π · ρ) · υ</div>
                  <div className="text-indigo-900 font-bold">• <strong>Ολικό Εμβαδόν:</strong> Εολ ＝ Επ ＋ 2 · (π · ρ²)</div>
                </div>
              </div>
            </div>

            {/* SVG Visualizer με Καθαρό Άνοιγμα Καπακιών & Ξετύλιγμα (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 min-h-[380px] p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center">
              <svg
                viewBox="0 0 420 300"
                className="w-full max-w-[420px] h-auto select-none overflow-visible"
              >
                {/* 1. Ξετυλιγμένη Παράπλευρη Επιφάνεια (Ορθογώνιο) */}
                <rect
                  x={centerX - currentW / 2}
                  y={topY}
                  width={currentW}
                  height={heightH}
                  fill="rgba(56, 189, 248, 0.35)"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  rx={unrollStage === 1 ? 2 : 4}
                />

                {/* Σκίαση 3D Κυλίνδρου όταν unrollStage < 1 */}
                {cylinderOpacity > 0 && (
                  <g opacity={cylinderOpacity}>
                    <line x1={centerX - startW / 2} y1={topY} x2={centerX - startW / 2} y2={topY + heightH} stroke="#38bdf8" strokeWidth="2" />
                    <line x1={centerX + startW / 2} y1={topY} x2={centerX + startW / 2} y2={topY + heightH} stroke="#38bdf8" strokeWidth="2" />
                  </g>
                )}

                {/* Ετικέτα Παράπλευρης Επιφάνειας μέσα στο ορθογώνιο */}
                {animProgress > 45 && (
                  <text
                    x={centerX}
                    y={topY + heightH / 2 + 5}
                    fill="#ffffff"
                    fontSize={animProgress === 100 ? 12 : 10}
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {animProgress === 100
                      ? 'Παράπλευρη Επιφάνεια: Επ ＝ (2 · π · ρ) · υ'
                      : 'Ξετύλιγμα σε ορθογώνιο...'}
                  </text>
                )}

                {/* 2. Πάνω Κυκλική Βάση (Πράσινη) */}
                <g transform={`translate(${centerX}, ${topY - capTopOffset})`}>
                  {/* Στο 0% φαίνεται ως έλλειψη σε προοπτική, στο 40%+ γίνεται πλήρης κύκλος */}
                  <ellipse
                    cx="0"
                    cy="0"
                    rx={radiusR}
                    ry={14 + capStage * (radiusR - 14)}
                    fill="rgba(52, 211, 153, 0.45)"
                    stroke="#34d399"
                    strokeWidth="2"
                  />
                  {/* Ένδειξη ακτίνας ρ όταν ανοίξει */}
                  {animProgress > 20 && (
                    <>
                      <line x1="0" y1="0" x2={radiusR} y2="0" stroke="#f59e0b" strokeWidth="2" />
                      <circle cx="0" cy="0" r="2.5" fill="#ffffff" />
                      <text x={radiusR / 2} y="-6" fill="#f59e0b" fontSize="11" fontWeight="bold" textAnchor="middle">
                        ρ
                      </text>
                      <text x="0" y="14" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                        Βάση
                      </text>
                    </>
                  )}
                </g>

                {/* 3. Κάτω Κυκλική Βάση (Μωβ) */}
                <g transform={`translate(${centerX}, ${topY + heightH + capBottomOffset})`}>
                  <ellipse
                    cx="0"
                    cy="0"
                    rx={radiusR}
                    ry={14 + capStage * (radiusR - 14)}
                    fill="rgba(168, 85, 247, 0.45)"
                    stroke="#c084fc"
                    strokeWidth="2"
                  />
                  {animProgress > 20 && (
                    <text x="0" y="4" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                      Βάση
                    </text>
                  )}
                </g>

                {/* 4. Ετικέτες & Διαστάσεις Αναπτύγματος στο 100% (τοποθετημένες καθαρά έξω από τα σχήματα) */}
                {animProgress === 100 && (
                  <g>
                    {/* Ένδειξη Μήκους Ορθογωνίου (κάτω από το ορθογώνιο, αλλά πάνω από την κάτω βάση) */}
                    <line x1={centerX - rectW / 2} y1={topY + heightH + 14} x2={centerX + rectW / 2} y2={topY + heightH + 14} stroke="#38bdf8" strokeWidth="1.5" />
                    <text x={centerX} y={topY + heightH + 28} fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
                      Μήκος ＝ 2 · π · ρ
                    </text>

                    {/* Ένδειξη Ύψους υ (στα δεξιά του ορθογωνίου) */}
                    <line x1={centerX + rectW / 2 + 14} y1={topY} x2={centerX + rectW / 2 + 14} y2={topY + heightH} stroke="#f59e0b" strokeWidth="2" />
                    <text x={centerX + rectW / 2 + 24} y={topY + heightH / 2 + 5} fill="#f59e0b" fontSize="13" fontWeight="black" textAnchor="start">
                      υ
                    </text>
                  </g>
                )}

                {/* Ένδειξη Ύψους υ στο 0% */}
                {animProgress === 0 && (
                  <g>
                    <line x1={centerX + radiusR + 14} y1={topY} x2={centerX + radiusR + 14} y2={topY + heightH} stroke="#f59e0b" strokeWidth="2" />
                    <text x={centerX + radiusR + 24} y={topY + heightH / 2 + 5} fill="#f59e0b" fontSize="13" fontWeight="black" textAnchor="start">
                      υ
                    </text>
                  </g>
                )}
              </svg>

              <div className="mt-3 text-center text-xs text-slate-400">
                {animProgress === 100
                  ? '✓ Το ανάπτυγμα ολοκληρώθηκε: 1 ορθογώνιο (2 · π · ρ) · υ και 2 κυκλικές βάσεις π · ρ².'
                  : animProgress >= 40
                  ? 'Τα καπάκια άνοιξαν και η παράπλευρη επιφάνεια απλώνει σε ορθογώνιο.'
                  : 'Τα δύο καπάκια ξεκουμπώνουν πάνω και κάτω από τον κύλινδρο.'}
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
