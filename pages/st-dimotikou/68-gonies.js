// pages/st-dimotikou/68-gonies.js
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

export default function GoniesTheoriaPage() {
  // Εργαστήριο 1: Διαδραστικό Μοιρογνωμόνιο & Μέτρηση Γωνίας
  const [angleDeg, setAngleDeg] = useState(55);

  // Ταξινόμηση είδους γωνίας
  const angleClassification = useMemo(() => {
    if (angleDeg === 0) return { name: 'Μηδενική γωνία', color: 'text-slate-600', badge: 'bg-slate-100 text-slate-800' };
    if (angleDeg < 90) return { name: 'Οξεία γωνία (μικρότερη από 90°)', color: 'text-sky-600', badge: 'bg-sky-100 text-sky-800' };
    if (angleDeg === 90) return { name: 'Ορθή γωνία (ακριβώς 90°)', color: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-800' };
    if (angleDeg < 180) return { name: 'Αμβλεία γωνία (μεταξύ 90° και 180°)', color: 'text-amber-600', badge: 'bg-amber-100 text-amber-800' };
    return { name: 'Ευθεία γωνία (ακριβώς 180°)', color: 'text-purple-600', badge: 'bg-purple-100 text-purple-800' };
  }, [angleDeg]);

  // Υπολογισμός συντεταγμένων περιστρεφόμενης πλευράς για το SVG μοιρογνωμόνιο
  const { armX, armY, arcPath } = useMemo(() => {
    const cx = 180;
    const cy = 180;
    const r = 130;
    const rad = (angleDeg * Math.PI) / 180;

    // Η σταθερή πλευρά εκτείνεται οριζόντια προς τα δεξιά (0°)
    const x = cx + r * Math.cos(-rad);
    const y = cy + r * Math.sin(-rad);

    // Τόξο μέτρησης γωνίας
    const arcRadius = 45;
    const arcX = cx + arcRadius * Math.cos(-rad);
    const arcY = cy + arcRadius * Math.sin(-rad);
    const largeArcFlag = angleDeg > 180 ? 1 : 0;
    const path = `M ${cx + arcRadius} ${cy} A ${arcRadius} ${arcRadius} 0 ${largeArcFlag} 0 ${arcX} ${arcY}`;

    return { armX: x, armY: y, arcPath: path };
  }, [angleDeg]);

  // Εργαστήριο 2: Συμπληρωματικές & Παραπληρωματικές Γωνίες
  const [givenAngle, setGivenAngle] = useState(40);

  const complementary = Math.max(0, 90 - givenAngle);
  const supplementary = Math.max(0, 180 - givenAngle);

  return (
    <Layout
      title="Μέτρηση &amp; Σύγκριση Γωνιών - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μαθαίνουμε πώς μετράμε και συγκρίνουμε γωνίες με το μοιρογνωμόνιο, τα είδη γωνιών και τις σχέσεις τους για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/68-gonies-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 68 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Μέτρηση &amp; Σύγκριση Γωνιών
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Ανακαλύπτουμε τι είναι η <strong>γωνία</strong> ως γεωμετρικό σχήμα και ως μέγεθος ανοίγματος. 
              Μαθαίνουμε πώς να χρησιμοποιούμε σωστά το <strong>μοιρογνωμόνιο</strong>, πώς συγκρίνουμε γωνίες χωρίς να παρασυρόμαστε από το μήκος των πλευρών τους, 
              και εξερευνούμε τις <strong>συμπληρωματικές</strong> και <strong>παραπληρωματικές</strong> γωνίες!
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία, Είδη Γωνιών, Μοιρογνωμόνιο &amp; Διαδραστικό Εργαστήριο Μοιρών</span>
            </div>
            <Link
              href="/st-dimotikou/68-gonies-ask"
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
              Οι Γωνίες σε 4 Βήματα
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Από τον θεμελιώδη ορισμό έως τη σύγκριση και τους υπολογισμούς γωνιών.
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
                  Τι είναι Γωνία;
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  <strong>Γωνία</strong> ονομάζεται το γεωμετρικό σχήμα που σχηματίζεται από <strong>δύο ημιευθείες</strong> που έχουν την ίδια αρχή.
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2">
                  <div className="font-semibold text-slate-800">• Στοιχεία γωνίας:</div>
                  <div className="text-slate-600 text-[11px] sm:text-xs space-y-1">
                    <div>— <strong>Κορυφή:</strong> Το κοινό αρχικό σημείο των δύο ημιευθειών.</div>
                    <div>— <strong>Πλευρές:</strong> Οι δύο ημιευθείες που ορίζουν τη γωνία.</div>
                    <div>— <strong>Άνοιγμα:</strong> Το μέγεθος της γωνίας (η στροφή της μίας πλευράς προς την άλλη).</div>
                  </div>
                  <div className="text-blue-900 font-bold text-xs pt-1 border-t border-slate-200">
                    Συμβολισμός: Μια γωνία με κορυφή Ο και πλευρές ΟΑ, ΟΒ συμβολίζεται ως Â ή ∠ΑΟΒ.
                  </div>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Οι πλευρές μιας γωνίας είναι ημιευθείες, άρα εκτείνονται επ' άπειρον! Το μέγεθος της γωνίας εξαρτάται αποκλειστικά από το άνοιγμα.
              </div>
            </article>

            {/* ΒΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Μέτρηση</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Μέτρηση με Μοιρογνωμόνιο
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Μονάδα μέτρησης του ανοίγματος των γωνιών είναι η <strong>μοίρα (1°)</strong>. Το όργανο μέτρησης είναι το <strong>μοιρογνωμόνιο</strong>:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2">
                  <div className="text-amber-950 font-bold">
                    Βήματα σωστής μέτρησης:
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-600 text-[11px] sm:text-xs">
                    <li>Τοποθετούμε το κέντρο του μοιρογνωμονίου ακριβώς στην <strong>κορυφή</strong> της γωνίας.</li>
                    <li>Ευθυγραμμίζουμε τη γραμμή του <strong>0°</strong> με τη μία πλευρά της γωνίας.</li>
                    <li>Διαβάζουμε στην κλίμακα τον αριθμό πάνω από τον οποίο περνά η άλλη πλευρά.</li>
                  </ol>
                  <div className="text-slate-800 font-semibold text-[11px] pt-1 border-t border-slate-200">
                    Ένας πλήρης κύκλος αντιστοιχεί σε 360 μοίρες (360°).
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Προσέχουμε ποια κλίμακα χρησιμοποιούμε (εσωτερική ή εξωτερική), ξεκινώντας πάντα από το μηδέν (0°)!
              </div>
            </article>

            {/* ΒΗΜΑ 3 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Ταξινόμηση</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Είδη Γωνιών
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Ανάλογα με το μέτρο τους σε μοίρες, οι γωνίες κατατάσσονται σε βασικές κατηγορίες:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1.5 font-mono">
                  <div>• <strong>Μηδενική:</strong> 0°</div>
                  <div>• <strong>Οξεία:</strong> 0° ＜ άνοιγμα ＜ 90°</div>
                  <div className="text-emerald-800 font-bold">• <strong>Ορθή:</strong> ακριβώς 90°</div>
                  <div>• <strong>Αμβλεία:</strong> 90° ＜ άνοιγμα ＜ 180°</div>
                  <div className="text-purple-800 font-bold">• <strong>Ευθεία:</strong> ακριβώς 180°</div>
                  <div>• <strong>Πλήρης:</strong> ακριβώς 360°</div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Η ορθή γωνία (90°) αποτελεί το βασικό μέτρο σύγκρισης για όλες τις υπόλοιπες γωνίες!
              </div>
            </article>

            {/* ΒΗΜΑ 4 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Σχέσεις</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Σύγκριση &amp; Ειδικά Ζεύγη
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Δύο γωνίες συγκρίνονται είτε με <strong>υπέρθεση</strong> είτε <strong>μετρώντας τις μοίρες τους</strong>:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2">
                  <div className="font-bold text-emerald-900">
                    1. Συμπληρωματικές Γωνίες:
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Δύο γωνίες των οποίων το άθροισμα ισούται με <strong>90°</strong> (σχηματίζουν ορθή γωνία).
                  </p>
                  <div className="font-bold text-teal-900 pt-1 border-t border-slate-200">
                    2. Παραπληρωματικές Γωνίες:
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Δύο γωνίες των οποίων το άθροισμα ισούται με <strong>180°</strong> (σχηματίζουν ευθεία γωνία).
                  </p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Για να βρούμε τη συμπληρωματική μιας γωνίας α: 90° － α. Για την παραπληρωματική: 180° － α!
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: SVG ΜΟΙΡΟΓΝΩΜΟΝΙΟ & ΜΕΤΡΗΣΗ ΓΩΝΙΑΣ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1</span>
            </div>
            <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Διαδραστικό Μοιρογνωμόνιο &amp; Αναγνώριση Γωνίας (SVG)
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Σύρε τον ρυθμιστή μοιρών για να περιστρέψεις την πλευρά της γωνίας και παρατήρησε το άνοιγμα και το είδος της:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">

            {/* Χειριστήρια & Στοιχεία (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>ΑΝΟΙΓΜΑ ΓΩΝΙΑΣ:</span>
                  <span className="font-mono text-xl font-black text-indigo-700 bg-white px-3 py-1 rounded-xl border border-slate-200">
                    {angleDeg}°
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={180}
                  step={1}
                  value={angleDeg}
                  onChange={(e) => setAngleDeg(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>0°</span>
                  <span>45°</span>
                  <span>90°</span>
                  <span>135°</span>
                  <span>180°</span>
                </div>
              </div>

              {/* Γρήγορα κουμπιά επιλογής βασικών γωνιών */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">
                  ΓΡΗΓΟΡΗ ΕΠΙΛΟΓΗ ΒΑΣΙΚΩΝ ΓΩΝΙΩΝ:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[30, 45, 90, 120, 135, 150, 180].map((deg) => (
                    <button
                      key={deg}
                      type="button"
                      onClick={() => setAngleDeg(deg)}
                      className={`py-2 px-1.5 rounded-xl text-xs font-black transition-all ${
                        angleDeg === deg
                          ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {deg}°
                    </button>
                  ))}
                </div>
              </div>

              {/* Κάρτα Ταξινόμησης */}
              <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-indigo-950 font-semibold">Είδος Γωνίας:</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-black ${angleClassification.badge}`}>
                    {angleClassification.name}
                  </span>
                </div>
                <div className="text-xs text-slate-600 pt-1 border-t border-indigo-200/60 leading-relaxed">
                  {angleDeg === 90 && '📐 Οι δύο πλευρές είναι κάθετες μεταξύ τους.'}
                  {angleDeg < 90 && angleDeg > 0 && '🔍 Μικρότερο άνοιγμα από την ορθή γωνία.'}
                  {angleDeg > 90 && angleDeg < 180 && '📏 Μεγαλύτερο άνοιγμα από την ορθή, μικρότερο από την ευθεία.'}
                  {angleDeg === 180 && '➖ Οι δύο πλευρές αποτελούν αντικείμενες ημιευθείες στην ίδια ευθεία.'}
                  {angleDeg === 0 && '⭕ Οι δύο πλευρές ταυτίζονται πλήρως.'}
                </div>
              </div>
            </div>

            {/* SVG Μοιρογνωμόνιο Visualizer (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center">
              <svg
                viewBox="0 0 360 220"
                className="w-full max-w-[340px] sm:max-w-[400px] h-auto select-none"
              >
                {/* Ημικύκλιο Μοιρογνωμονίου */}
                <path
                  d="M 40 180 A 140 140 0 0 1 320 180 Z"
                  fill="rgba(255, 255, 255, 0.04)"
                  stroke="#475569"
                  strokeWidth="1.5"
                />

                {/* Χαράξεις μοιρών (κάθε 10 μοίρες) */}
                {Array.from({ length: 19 }).map((_, i) => {
                  const deg = i * 10;
                  const rad = (deg * Math.PI) / 180;
                  const x1 = 180 + 140 * Math.cos(-rad);
                  const y1 = 180 + 140 * Math.sin(-rad);
                  const tickLen = deg % 30 === 0 ? 12 : 6;
                  const x2 = 180 + (140 - tickLen) * Math.cos(-rad);
                  const y2 = 180 + (140 - tickLen) * Math.sin(-rad);

                  return (
                    <g key={deg}>
                      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94a3b8" strokeWidth={deg % 30 === 0 ? "1.8" : "1"} />
                      {deg % 30 === 0 && (
                        <text
                          x={180 + 115 * Math.cos(-rad)}
                          y={180 + 115 * Math.sin(-rad) + 4}
                          fill="#94a3b8"
                          fontSize="9"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {deg}°
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Βάση Μοιρογνωμονίου */}
                <line x1="30" y1="180" x2="330" y2="180" stroke="#64748b" strokeWidth="2" />

                {/* Τόξο Ανοίγματος Γωνίας */}
                {angleDeg > 0 && (
                  <path
                    d={arcPath}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                    strokeDasharray={angleDeg === 90 ? "none" : "3 2"}
                  />
                )}

                {/* Σταθερή Πλευρά Γωνίας (Οριζόντια στο 0°) */}
                <line x1="180" y1="180" x2="310" y2="180" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />

                {/* Κινούμενη Πλευρά Γωνίας */}
                <line x1="180" y1="180" x2={armX} y2={armY} stroke="#818cf8" strokeWidth="3.5" strokeLinecap="round" />

                {/* Κορυφή Ο */}
                <circle cx="180" cy="180" r="5" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" />
                <text x="180" y="200" fill="#f1f5f9" fontSize="12" fontWeight="bold" textAnchor="middle">
                  Κορυφή (Ο)
                </text>

                {/* Ένδειξη Μοιρών στο κέντρο */}
                <text x="180" y="150" fill="#f59e0b" fontSize="16" fontWeight="900" textAnchor="middle">
                  {angleDeg}°
                </text>
              </svg>

              <div className="mt-2 text-center text-xs text-slate-400">
                Το γαλάζιο ευθύγραμμο τμήμα δείχνει την αρχική πλευρά (0°) και το μωβ την περιστρεφόμενη πλευρά.
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΣΥΜΠΛΗΡΩΜΑΤΙΚΕΣ & ΠΑΡΑΠΛΗΡΩΜΑΤΙΚΕΣ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
              <span>📐 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΣΧΕΣΕΙΣ ΓΩΝΙΩΝ</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Υπολογιστής Συμπληρωματικής &amp; Παραπληρωματικής Γωνίας
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Επίλεξε μία αρχική γωνία και δες αυτόματα πόσες μοίρες χρειάζεται για να γίνει ορθή (90°) ή ευθεία (180°):
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

            {/* Ρύθμιση Γωνίας (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>ΑΡΧΙΚΗ ΓΩΝΙΑ (α):</span>
                  <span className="font-mono text-base font-black text-indigo-700 bg-white px-3 py-1 rounded-xl border border-slate-200">
                    {givenAngle}°
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={89}
                  step={1}
                  value={givenAngle}
                  onChange={(e) => setGivenAngle(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>1°</span>
                  <span>45°</span>
                  <span>89°</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600">
                💡 Στο εργαστήριο αυτό εξετάζουμε οξείες γωνίες (έως 89°) ώστε να υπάρχει πάντοτε θετική συμπληρωματική γωνία.
              </div>
            </div>

            {/* Αποτελέσματα (7 στήλες) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Συμπληρωματική */}
              <div className="bg-teal-50/70 p-5 rounded-3xl border border-teal-200 space-y-3 text-center">
                <span className="text-[11px] text-teal-900 block font-bold uppercase tracking-wider">
                  ΣΥΜΠΛΗΡΩΜΑΤΙΚΗ ΓΩΝΙΑ
                </span>
                <div className="text-3xl font-black text-teal-800 font-mono">
                  {complementary}°
                </div>
                <div className="text-xs text-slate-600 font-mono space-y-1">
                  <div>90° － {givenAngle}° ＝ <strong>{complementary}°</strong></div>
                  <div className="text-[11px] font-sans text-teal-900">
                    Άθροισμα: {givenAngle}° ＋ {complementary}° ＝ <strong>90° (Ορθή)</strong>
                  </div>
                </div>
              </div>

              {/* Παραπληρωματική */}
              <div className="bg-purple-50/70 p-5 rounded-3xl border border-purple-200 space-y-3 text-center">
                <span className="text-[11px] text-purple-900 block font-bold uppercase tracking-wider">
                  ΠΑΡΑΠΛΗΡΩΜΑΤΙΚΗ ΓΩΝΙΑ
                </span>
                <div className="text-3xl font-black text-purple-800 font-mono">
                  {supplementary}°
                </div>
                <div className="text-xs text-slate-600 font-mono space-y-1">
                  <div>180° － {givenAngle}° ＝ <strong>{supplementary}°</strong></div>
                  <div className="text-[11px] font-sans text-purple-900">
                    Άθροισμα: {givenAngle}° ＋ {supplementary}° ＝ <strong>180° (Ευθεία)</strong>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 5. ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ ΚΑΘΗΜΕΡΙΝΗΣ ΖΩΗΣ */}
        <section className="space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight">
              Λυμένα Προβλήματα με Γωνίες
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Εφαρμογές μέτρησης και υπολογισμού γωνιών σε πρακτικά προβλήματα.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ΠΡΟΒΛΗΜΑ 1 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-900 text-xs font-black rounded-lg uppercase">
                  ΠΡΟΒΛΗΜΑ 1: ΔΙΑΧΩΡΙΣΜΟΣ ΟΡΘΗΣ ΓΩΝΙΑΣ
                </span>
                <span className="text-xs font-bold text-slate-400">Συμπληρωματικές</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Υπολογισμός Άγνωστης Γωνίας σε Ορθή Γωνία
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Μια ορθή γωνία <strong>90°</strong> χωρίζεται από μια εσωτερική ημιευθεία σε δύο επιμέρους γωνίες. Αν η μία γωνία έχει μέτρο <strong>34°</strong>, πόσο είναι το μέτρο της άλλης γωνίας;
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΔΕΔΟΜΕΝΑ ΠΡΟΒΛΗΜΑΤΟΣ
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Συνολική γωνία</span> 90° (ορθή)
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Γνωστή γωνία</span> 34°
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Σχέση</span> Συμπληρωματικές
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήματα Επίλυσης:</span>
                  <div>• Επειδή η αρχική γωνία είναι ορθή, οι δύο γωνίες έχουν άθροισμα 90°.</div>
                  <div>• Αφαιρούμε τη γνωστή γωνία: 90° － 34° ＝ <strong className="text-blue-700">56°</strong>.</div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 font-medium">
                💡 Επαλήθευση: 34° ＋ 56° ＝ 90°, άρα το αποτέλεσμα είναι απόλυτα σωστό.
              </div>
            </article>

            {/* ΠΡΟΒΛΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-lg uppercase">
                  ΠΡΟΒΛΗΜΑ 2: ΔΕΙΚΤΕΣ ΡΟΛΟΓΙΟΥ
                </span>
                <span className="text-xs font-bold text-slate-400">Κίνηση &amp; Μοίρες</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Γωνία που Σχηματίζουν οι Δείκτες του Ρολογιού
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ένα αναλογικό ρολόι δείχνει ακριβώς <strong>3:00</strong>. Πόσες μοίρες είναι η γωνία που σχηματίζει ο ωροδείκτης με τον λεπτοδείκτη και τι είδους γωνία είναι;
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΣΤΟΙΧΕΙΑ ΥΠΟΛΟΓΙΣΜΟΥ
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold text-[11px]">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Πλήρης κύκλος</span> 360° : 12 ＝ 30°/ώρα
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Διάστημα</span> 3 ώρες (12 έως 3)
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Πράξη</span> 3 · 30° ＝ 90°
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήματα Επίλυσης:</span>
                  <div>• Το καντράν του ρολογιού είναι κύκλος 360° χωρισμένος σε 12 ίσα μέρη: 360° : 12 ＝ 30° ανά ώρα.</div>
                  <div>• Στις 3:00 ο λεπτοδείκτης είναι στο 12 και ο ωροδείκτης στο 3 (απόσταση 3 θέσεων): 3 · 30° ＝ <strong className="text-amber-700">90°</strong>.</div>
                  <div>• Η γωνία των 90° είναι <strong>ορθή γωνία</strong>.</div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 font-medium">
                ⚡ Στις 6:00 οι δείκτες σχηματίζουν 180° (ευθεία γωνία), ενώ στις 9:00 σχηματίζουν ξανά ορθή γωνία (90°)!
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
                  <strong>Μην μπερδεύετε το μήκος των πλευρών με το μέγεθος της γωνίας:</strong> Αν σχεδιάσουμε μια γωνία 30° με μεγάλες γραμμές και μια γωνία 60° με μικρές γραμμές, η γωνία των 60° εξακολουθεί να είναι μεγαλύτερη! Το μέγεθος εξαρτάται μόνο από το <em>άνοιγμα</em>, όχι από το μήκος των γραμμών.
                </li>
                <li>
                  <strong>Προσοχή στην κλίμακα του μοιρογνωμονίου:</strong> Τα περισσότερα μοιρογνωμόνια έχουν διπλή αρίθμηση (από 0° έως 180° και αντίστροφα). Ξεκινάμε πάντα να μετράμε από το 0° της πλευράς που ευθυγραμμίσαμε, ώστε να μην μπερδέψουμε π.χ. μια οξεία γωνία 50° με την παραπληρωματική της 130°.
                </li>
                <li>
                  <strong>Μηδενική vs Ευθεία γωνία:</strong> Στη μηδενική γωνία (0°) οι πλευρές ταυτίζονται προς την ίδια κατεύθυνση, ενώ στην ευθεία (180°) οι πλευρές κινούνται προς αντίθετες κατευθύνσεις σχηματίζοντας μια ευθεία γραμμή.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 7. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στη Μέτρηση Γωνιών!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε 10 διαδραστικές ασκήσεις με είδη γωνιών, μοιρογνωμόνιο και συμπληρωματικές/παραπληρωματικές γωνίες για τη ΣΤ' Δημοτικού.
            </p>
          </div>

          <Link
            href="/st-dimotikou/68-gonies-ask"
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
