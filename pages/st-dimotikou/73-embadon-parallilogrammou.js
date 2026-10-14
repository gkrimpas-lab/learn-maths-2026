// pages/st-dimotikou/73-embadon-parallilogrammou.js
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

export default function EmbadonParallilogrammouTheoriaPage() {
  // Εργαστήριο 1: Διαδραστική Μετακίνηση Τριγώνου & Ρύθμιση Κλίσης
  const [cutProgress, setCutProgress] = useState(0); // 0% (πλάγιο) έως 100% (ορθογώνιο)
  const [slantWidth, setSlantWidth] = useState(55); // Κλίση σε pixels (20px έως 90px)

  // Σταθερές διαστάσεις εργαστηρίου 1 (SVG)
  const baseW = 160; // Βάση β = 160px
  const heightH = 90; // Κάθετο ύψος υ = 90px
  const originX = 65;
  const originY = 55;

  // Μήκος πλάγιας πλευράς (Πυθαγόρειο)
  const slantSideLen = useMemo(() => {
    return Math.sqrt(slantWidth * slantWidth + heightH * heightH);
  }, [slantWidth, heightH]);

  // Ολίσθηση του αποκομμένου τριγώνου κατά μήκος της βάσης baseW
  const shiftX = (cutProgress / 100) * baseW;

  // Εργαστήριο 2: Δυναμικός Υπολογιστής Εμβαδού & Μετατροπέας Μονάδων
  const [calcBase, setCalcBase] = useState(8); // σε cm
  const [calcHeight, setCalcHeight] = useState(5); // σε cm

  const areaCm2 = useMemo(() => calcBase * calcHeight, [calcBase, calcHeight]);
  const areaDm2 = useMemo(() => areaCm2 / 100, [areaCm2]);
  const areaM2 = useMemo(() => areaCm2 / 10000, [areaCm2]);
  const areaMm2 = useMemo(() => areaCm2 * 100, [areaCm2]);

  return (
    <Layout
      title="Εμβαδόν Παραλληλογράμμου &amp; Μονάδες Μέτρησης - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μαθαίνουμε πώς υπολογίζουμε το εμβαδόν παραλληλογράμμου (Ε ＝ β · υ), τη μετατροπή του σε ορθογώνιο και τις μεταβάσεις ανάμεσα στις μονάδες επιφάνειας."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/73-embadon-parallilogrammou-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 73 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Εμβαδόν Παραλληλογράμμου • Βάση, Ύψος &amp; Μονάδες Επιφάνειας
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Ανακαλύπτουμε πώς υπολογίζεται το εμβαδόν οποιουδήποτε παραλληλογράμμου με τον τύπο <strong>Ε ＝ β · υ</strong>, 
              βλέπουμε ζωντανά γιατί ένα πλάγιο παραλληλόγραμμο ισοδυναμεί ακριβώς με ένα <strong>ορθογώνιο</strong>, 
              και εξασκούμαστε στις μετατροπές ανάμεσα στις μονάδες μέτρησης επιφάνειας (<strong>m², dm², cm², mm²</strong>).
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία, Οπτική Απόδειξη Μετατροπής σε Ορθογώνιο, Μονάδες Επιφάνειας &amp; SVG</span>
            </div>
            <Link
              href="/st-dimotikou/73-embadon-parallilogrammou-ask"
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
              Το Εμβαδόν Παραλληλογράμμου σε 4 Βήματα
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Από τον θεμελιώδη τύπο μέχρι τη σωστή επιλογή ύψους και τις μεταβάσεις μονάδων.
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
                  Πώς Βρίσκουμε το Εμβαδόν;
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Το εμβαδόν κάθε παραλληλογράμμου ισούται με το γινόμενο του μήκους μιας βάσης του επί το αντίστοιχο ύψος:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 text-center font-mono">
                  <div className="text-indigo-900 font-black text-base sm:text-lg">
                    Εμβαδόν ＝ Βάση · Ύψος
                  </div>
                  <div className="text-slate-700 font-bold">
                    Ε ＝ β · υ
                  </div>
                  <p className="text-[11px] text-slate-600 font-sans text-left pt-1">
                    • <strong>Βάση (β):</strong> Οποιαδήποτε από τις πλευρές του παραλληλογράμμου.<br />
                    • <strong>Ύψος (υ):</strong> Το <em>κάθετο</em> ευθύγραμμο τμήμα ανάμεσα στη βάση και την απέναντι παράλληλη πλευρά (όχι η πλάγια πλευρά!).
                  </p>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Προσοχή: Το ύψος σχηματίζει πάντοτε <strong>ορθή γωνία (90°)</strong> με τη βάση!
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
                  Γιατί Ισχύει ο Τύπος Ε ＝ β · υ;
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Αν φέρουμε το ύψος από την πάνω αριστερή κορυφή, σχηματίζεται ένα ορθογώνιο τρίγωνο:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2">
                  <div>
                    1. «Κόβουμε» νοερά αυτό το τρίγωνο που εξέχει στα αριστερά.
                  </div>
                  <div>
                    2. Το μετακινούμε και το «κολλάμε» στο κενό της δεξιάς πλευράς.
                  </div>
                  <div className="text-amber-950 font-bold pt-1 border-t border-slate-200">
                    Το πλάγιο παραλληλόγραμμο μετατρέπεται ακριβώς σε ένα <strong>ορθογώνιο</strong> με μήκος ίσο με τη βάση (β) και πλάτος ίσο με το ύψος (υ)!
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Επειδή το εμβαδόν του ορθογωνίου είναι μήκος · πλάτος, στο παραλληλόγραμμο είναι <strong>β · υ</strong>!
              </div>
            </article>

            {/* ΒΗΜΑ 3 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Μονάδες Μέτρησης</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Μονάδες Επιφάνειας &amp; Μεταβάσεις
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Το εμβαδόν μετριέται πάντοτε σε <strong>τετραγωνικές μονάδες</strong>:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1.5 font-mono">
                  <div className="text-indigo-950 font-bold">• 1 m² ＝ 100 dm² ＝ 10.000 cm²</div>
                  <div>• 1 dm² ＝ 100 cm² ＝ 10.000 mm²</div>
                  <div>• 1 cm² ＝ 100 mm²</div>
                  <div className="text-purple-950 font-bold">• 1 Στρέμμα ＝ 1.000 m²</div>
                  <p className="text-[11px] text-slate-600 font-sans pt-1">
                    Πριν πολλαπλασιάσουμε, η βάση και το ύψος πρέπει να είναι εκφρασμένα στην <strong>ίδια μονάδα μήκους</strong>!
                  </p>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Αν η βάση είναι σε m και το ύψος σε cm, μετατρέπουμε πρώτα και τα δύο σε cm (ή σε m)!
              </div>
            </article>

            {/* ΒΗΜΑ 4 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Δύο Ύψη</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Κάθε Βάση Έχει το Ύψος της!
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Κάθε παραλληλόγραμμο έχει 2 ζεύγη παράλληλων πλευρών, άρα και 2 διαφορετικά ύψη:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2">
                  <div>
                    • <strong>Ε ＝ β₁ · υ₁</strong> (αν πάρουμε ως βάση την οριζόντια πλευρά).
                  </div>
                  <div>
                    • <strong>Ε ＝ β₂ · υ₂</strong> (αν πάρουμε ως βάση την πλάγια πλευρά).
                  </div>
                  <div className="text-emerald-900 font-bold text-xs pt-1 border-t border-slate-200">
                    Το εμβαδόν είναι το ίδιο, άρα: <strong>β₁ · υ₁ ＝ β₂ · υ₂</strong>!
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Στη μεγαλύτερη πλευρά αντιστοιχεί πάντοτε το μικρότερο ύψος, και αντίστροφα!
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΠΡΑΓΜΑΤΙΚΟ ΠΛΑΓΙΟ ΠΑΡΑΛΛΗΛΟΓΡΑΜΜΟ & ΚΛΙΣΗ (SVG) */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1</span>
            </div>
            <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Πώς το Πλάγιο Παραλληλόγραμμο Μετατρέπεται σε Ορθογώνιο;
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Άλλαξε την κλίση του παραλληλογράμμου και σύρε την μπάρα αναδίπλωσης για να δεις πώς το αριστερό ορθογώνιο τρίγωνο κουμπώνει τέλεια στα δεξιά:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">

            {/* Sliders: Μετακίνηση & Κλίση (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Slider 1: Μετακίνηση Τριγώνου */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>1. ΜΕΤΑΚΙΝΗΣΗ ΤΡΙΓΩΝΟΥ:</span>
                  <span className="font-mono text-base font-black text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {cutProgress}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={cutProgress}
                  onChange={(e) => setCutProgress(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>0% (Πλάγιο)</span>
                  <span>50% (Ολίσθηση)</span>
                  <span>100% (Ορθογώνιο)</span>
                </div>
              </div>

              {/* Slider 2: Κλίση Παραλληλογράμμου */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>2. ΚΛΙΣΗ ΠΑΡΑΛΛΗΛΟΓΡΑΜΜΟΥ:</span>
                  <span className="font-mono text-base font-black text-sky-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {slantWidth} px
                  </span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={85}
                  step={1}
                  value={slantWidth}
                  onChange={(e) => setSlantWidth(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer touch-manipulation"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>Μικρή κλίση</span>
                  <span>Μεσαία</span>
                  <span>Έντονη κλίση</span>
                </div>
              </div>

              {/* Κάρτα Επεξήγησης */}
              <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 space-y-2 text-xs sm:text-sm">
                <div className="font-bold text-sky-950">
                  {cutProgress === 0 && '🔷 Πλάγιο Παραλληλόγραμμο: Βάση (β) και κάθετο ύψος (υ).'}
                  {cutProgress > 0 && cutProgress < 100 && '🔄 Το αριστερό τρίγωνο αποκόπτεται και ολισθαίνει κατά μήκος της βάσης...'}
                  {cutProgress === 100 && '🟩 Τέλειο Ορθογώνιο: Μήκος ίσο με τη βάση (β) και πλάτος ίσο με το ύψος (υ)!'}
                </div>
                <div className="text-slate-600 text-[11px] space-y-1 font-mono pt-1 border-t border-sky-200/60">
                  <div>• <strong>Κάθετο Ύψος (υ):</strong> Σταθερό {heightH} px (ορθή γωνία 90°)</div>
                  <div>• <strong>Πλάγια Πλευρά:</strong> {Math.round(slantSideLen)} px (μεγαλύτερη από το ύψος!)</div>
                </div>
              </div>
            </div>

            {/* SVG Visualizer (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 min-h-[340px] p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center">
              <svg
                viewBox="0 0 380 220"
                className="w-full max-w-[380px] sm:max-w-[440px] h-auto select-none overflow-visible"
              >
                {/* 1. Σταθερό τμήμα του παραλληλογράμμου (γαλάζιο τραπέζιο) */}
                <polygon
                  points={`
                    ${originX + slantWidth},${originY} 
                    ${originX + slantWidth + baseW},${originY} 
                    ${originX + baseW},${originY + heightH} 
                    ${originX + slantWidth},${originY + heightH}
                  `}
                  fill="rgba(56, 189, 248, 0.25)"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                />

                {/* 2. Κινούμενο ορθογώνιο τρίγωνο (μωβ):
                    Αρχική θέση: από originX έως originX + slantWidth
                    Τελική θέση: από originX + baseW έως originX + slantWidth + baseW */}
                <polygon
                  points={`
                    ${originX + shiftX},${originY + heightH} 
                    ${originX + slantWidth + shiftX},${originY + heightH} 
                    ${originX + slantWidth + shiftX},${originY}
                  `}
                  fill={cutProgress === 100 ? 'rgba(52, 211, 153, 0.4)' : 'rgba(168, 85, 247, 0.35)'}
                  stroke={cutProgress === 100 ? '#34d399' : '#c084fc'}
                  strokeWidth="2.5"
                  strokeDasharray={cutProgress > 0 && cutProgress < 100 ? '4 3' : 'none'}
                />

                {/* 3. Κατακόρυφο Ύψος (υ) - Κίτρινη διακεκομμένη γραμμή */}
                <line
                  x1={originX + slantWidth}
                  y1={originY}
                  x2={originX + slantWidth}
                  y2={originY + heightH}
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                />

                {/* Σύμβολο ορθής γωνίας (90°) */}
                <rect
                  x={originX + slantWidth}
                  y={originY + heightH - 12}
                  width="12"
                  height="12"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                />
                <circle
                  cx={originX + slantWidth + 6}
                  cy={originY + heightH - 6}
                  r="1.5"
                  fill="#f59e0b"
                />

                {/* Ετικέτα Ύψους (υ) */}
                <text
                  x={originX + slantWidth - 8}
                  y={originY + heightH / 2 + 4}
                  fill="#f59e0b"
                  fontSize="13"
                  fontWeight="black"
                  textAnchor="end"
                >
                  υ
                </text>

                {/* Ετικέτα Πλάγιας Πλευράς */}
                {cutProgress === 0 && (
                  <text
                    x={originX + slantWidth / 2 - 14}
                    y={originY + heightH / 2}
                    fill="#a855f7"
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    πλάγια πλευρά
                  </text>
                )}

                {/* Ετικέτα Βάσης (β) στο κάτω μέρος */}
                <line
                  x1={originX + (cutProgress === 100 ? slantWidth : 0)}
                  y1={originY + heightH + 20}
                  x2={originX + baseW + (cutProgress === 100 ? slantWidth : 0)}
                  y2={originY + heightH + 20}
                  stroke="#e2e8f0"
                  strokeWidth="1.5"
                />
                <text
                  x={originX + baseW / 2 + (cutProgress === 100 ? slantWidth : 0)}
                  y={originY + heightH + 36}
                  fill="#ffffff"
                  fontSize="13"
                  fontWeight="black"
                  textAnchor="middle"
                >
                  Βάση (β) ＝ {baseW} px
                </text>
              </svg>

              <div className="mt-3 text-center text-xs text-slate-400">
                Το τρίγωνο που περισσεύει αριστερά μεταφέρεται ακριβώς δεξιά και μετατρέπει το παραλληλόγραμμο σε ορθογώνιο με εμβαδόν <strong>β · υ</strong>.
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΥΠΟΛΟΓΙΣΤΗΣ ΕΜΒΑΔΟΥ & ΜΕΤΑΤΡΟΠΕΑΣ ΜΟΝΑΔΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
              <span>📐 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΥΠΟΛΟΓΙΣΤΗΣ &amp; ΜΟΝΑΔΕΣ</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Υπολογισμός Εμβαδού &amp; Αυτόματη Μετατροπή Μονάδων
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Άλλαξε τη βάση και το ύψος για να υπολογίσεις το εμβαδόν σε cm² και δες πώς μετατρέπεται αυτόματα σε mm², dm² και m²:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

            {/* Sliders Βάσης και Ύψους (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>ΜΗΚΟΣ ΒΑΣΗΣ (β):</span>
                  <span className="font-mono text-base font-black text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {calcBase} cm
                  </span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={25}
                  step={1}
                  value={calcBase}
                  onChange={(e) => setCalcBase(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>ΥΨΟΣ (υ):</span>
                  <span className="font-mono text-base font-black text-sky-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {calcHeight} cm
                  </span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={20}
                  step={1}
                  value={calcHeight}
                  onChange={(e) => setCalcHeight(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer touch-manipulation"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 font-mono">
                Ε ＝ β · υ ＝ {calcBase} cm · {calcHeight} cm ＝ <strong>{areaCm2} cm²</strong>
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
                💡 Κάθε σκαλοπάτι προς τα πάνω διαιρεί με το 100, κάθε σκαλοπάτι προς τα κάτω πολλαπλασιάζει με το 100.
              </div>
            </div>

          </div>
        </section>

        {/* 5. ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ ΚΑΘΗΜΕΡΙΝΗΣ ΖΩΗΣ */}
        <section className="space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight">
              Λυμένα Προβλήματα με Εμβαδόν Παραλληλογράμμου
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Εφαρμογές του τύπου Ε ＝ β · υ και των μετατροπών μονάδων σε ρεαλιστικά σενάρια.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ΠΡΟΒΛΗΜΑ 1 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-900 text-xs font-black rounded-lg uppercase">
                  ΠΡΟΒΛΗΜΑ 1: ΠΑΡΚΕΤΟ ΟΙΚΟΠΕΔΟ
                </span>
                <span className="text-xs font-bold text-slate-400">Ε ＝ β · υ</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Υπολογισμός Εμβαδού Παραλληλόγραμμου Οικοπέδου
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ένα οικόπεδο έχει σχήμα παραλληλογράμμου με μήκος βάσης <strong>35 m</strong>. 
                Η κάθετη απόσταση ανάμεσα στη βάση και την απέναντι πλευρά (το ύψος) είναι <strong>18 m</strong>. 
                Η πλάγια πλευρά του οικοπέδου είναι <strong>22 m</strong>. Ποιο είναι το εμβαδόν του οικοπέδου;
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΔΕΔΟΜΕΝΑ ΠΡΟΒΛΗΜΑΤΟΣ
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Βάση (β)</span> 35 m
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Ύψος (υ)</span> 18 m
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Πλάγια πλευρά</span> 22 m (περιττή)
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήματα Επίλυσης:</span>
                  <div>• Για το εμβαδόν χρειαζόμαστε <strong>μόνο τη βάση και το αντίστοιχο ύψος</strong> (η πλάγια πλευρά των 22 m δεν χρειάζεται στον υπολογισμό του εμβαδού).</div>
                  <div>• <strong>Εμβαδόν:</strong> Ε ＝ β · υ ＝ 35 · 18 ＝ <strong className="text-blue-700">630 m²</strong>.</div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 font-medium">
                💡 Μην παρασύρεστε από την πλάγια πλευρά! Στον τύπο του εμβαδού χρησιμοποιούμε πάντοτε το <strong>κάθετο ύψος</strong>.
              </div>
            </article>

            {/* ΠΡΟΒΛΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-lg uppercase">
                  ΠΡΟΒΛΗΜΑ 2: ΕΥΡΕΣΗ ΥΨΟΥΣ &amp; ΜΕΤΑΤΡΟΠΗ
                </span>
                <span className="text-xs font-bold text-slate-400">υ ＝ Ε : β</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Εύρεση του Ύψους όταν Γνωρίζουμε το Εμβαδόν
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Μια μεταλλική πλάκα σε σχήμα παραλληλογράμμου έχει εμβαδόν <strong>18 dm²</strong>. 
                Αν η βάση της είναι <strong>60 cm</strong>, πόσα εκατοστόμετρα (cm) είναι το αντίστοιχο ύψος της πλάκας;
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΣΤΟΙΧΕΙΑ ΥΠΟΛΟΓΙΣΜΟΥ
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold text-[11px]">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Εμβαδόν (Ε)</span> 18 dm²
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Βάση (β)</span> 60 cm
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Σχέση dm²/cm²</span> 1 dm² ＝ 100 cm²
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήματα Επίλυσης:</span>
                  <div>• <strong>Μετατροπή εμβαδού σε cm²:</strong> 18 · 100 ＝ <strong>1.800 cm²</strong>.</div>
                  <div>• <strong>Υπολογισμός ύψους:</strong> υ ＝ Ε : β ＝ 1.800 : 60 ＝ <strong className="text-amber-700">30 cm</strong>.</div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 font-medium">
                ⚡ Επαλήθευση: Ε ＝ β · υ ＝ 60 cm · 30 cm ＝ 1.800 cm² ＝ 18 dm²!
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
                  <strong>Μην μπερδεύετε την πλάγια πλευρά με το ύψος:</strong> Στο παραλληλόγραμμο η πλάγια πλευρά είναι πάντοτε <em>μεγαλύτερη</em> από το κάθετο ύψος! Αν πολλαπλασιάσετε τις δύο πλευρές (όπως στο ορθογώνιο), το αποτέλεσμα θα είναι λάθος.
                </li>
                <li>
                  <strong>Πάντα στην ίδια μονάδα μέτρησης:</strong> Αν η βάση σας δίνεται σε μέτρα (m) και το ύψος σε εκατοστά (cm), πρέπει οπωσδήποτε να τα μετατρέψετε στην ίδια μονάδα πριν κάνετε τον πολλαπλασιασμό.
                </li>
                <li>
                  <strong>Το ύψος μπορεί να «πέφτει» και έξω από το σχήμα:</strong> Σε ένα πολύ πλάγιο παραλληλόγραμμο, η κάθετη γραμμή του ύψους μπορεί να συναντήσει την προέκταση της βάσης έξω από το σχήμα. Αυτό είναι απολύτως φυσιολογικό!
                </li>
                <li>
                  <strong>Αν γνωρίζετε το εμβαδόν:</strong> Για να βρείτε τη βάση διαιρείτε: <strong>β ＝ Ε : υ</strong>. Για να βρείτε το ύψος διαιρείτε: <strong>υ ＝ Ε : β</strong>.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 7. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στο Εμβαδόν Παραλληλογράμμου!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε 12 διαδραστικές ασκήσεις με υπολογισμούς βάσης, ύψους, εμβαδού και μετατροπές μονάδων επιφάνειας για τη ΣΤ' Δημοτικού.
            </p>
          </div>

          <Link
            href="/st-dimotikou/73-embadon-parallilogrammou-ask"
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
