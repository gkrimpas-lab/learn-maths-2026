// pages/st-dimotikou/74-embadon-trigonou.js
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

export default function EmbadonTrigonouTheoriaPage() {
  // Εργαστήριο 1: Οπτική Απόδειξη (Το 2ο τρίγωνο κουμπώνει και φτιάχνει Παραλληλόγραμμο)
  const [mergeProgress, setMergeProgress] = useState(0); // 0% (μόνο του) έως 100% (πλήρες παραλληλόγραμμο)

  // Σταθερές διαστάσεις εργαστηρίου 1 (SVG)
  const baseW = 150;
  const heightH = 85;
  const slantX = 50; // Θέση κορυφής Α ως προς το x
  const originX = 65;
  const originY = 55;

  // Το 2ο τρίγωνο είναι αντεστραμμένο (περιστροφή 180° γύρω από το μέσο της πλάγιας πλευράς)
  // Στο 0% βρίσκεται σε απόσταση (απομακρυσμένο) και στο 100% ενώνεται τέλεια
  const distanceOffset = (1 - mergeProgress / 100) * 80;

  // Εργαστήριο 2: Δυναμικός Υπολογιστής Εμβαδού & Μετατροπές Μονάδων
  const [calcBase, setCalcBase] = useState(10); // σε cm
  const [calcHeight, setCalcHeight] = useState(6); // σε cm

  const areaCm2 = useMemo(() => (calcBase * calcHeight) / 2, [calcBase, calcHeight]);
  const rectAreaCm2 = useMemo(() => calcBase * calcHeight, [calcBase, calcHeight]);
  const areaMm2 = useMemo(() => areaCm2 * 100, [areaCm2]);
  const areaDm2 = useMemo(() => areaCm2 / 100, [areaCm2]);
  const areaM2 = useMemo(() => areaCm2 / 10000, [areaCm2]);

  return (
    <Layout
      title="Εμβαδόν Τριγώνου &amp; Μονάδες Μέτρησης - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μαθαίνουμε πώς υπολογίζουμε το εμβαδόν τριγώνου με τον τύπο Ε ＝ (β · υ) : 2, γιατί διαιρούμε με το 2 και πώς εφαρμόζουμε τις μετατροπές μονάδων επιφάνειας."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/74-embadon-trigonou-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 74 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Εμβαδόν Τριγώνου • Βάση, Ύψος &amp; η Σχέση με το Παραλληλόγραμμο
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Ανακαλύπτουμε πώς υπολογίζεται το εμβαδόν κάθε τριγώνου με τον τύπο <strong>Ε ＝ (β · υ) : 2</strong>, 
              βλέπουμε ζωντανά γιατί κάθε τρίγωνο είναι ακριβώς το <strong>μισό ενός παραλληλογράμμου</strong>, 
              και εξετάζουμε πώς υπολογίζουμε το εμβαδόν σε ορθογώνια, οξυγώνια και αμβλυγώνια τρίγωνα!
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία, Γεωμετρική Απόδειξη Διπλασιασμού, Ειδικά Τρίγωνα &amp; Διαδραστικά Εργαστήρια</span>
            </div>
            <Link
              href="/st-dimotikou/74-embadon-trigonou-ask"
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
              Το Εμβαδόν Τριγώνου σε 4 Βήματα
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Από τον βασικό τύπο μέχρι τη θέση του ύψους και το αντίστροφο πρόβλημα.
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
                  Το εμβαδόν κάθε τριγώνου ισούται με το μισό του γινομένου της βάσης του επί το αντίστοιχο ύψος:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 text-center font-mono">
                  <div className="text-indigo-900 font-black text-base sm:text-lg">
                    Εμβαδόν ＝ (Βάση · Ύψος) : 2
                  </div>
                  <div className="text-slate-700 font-bold">
                    Ε ＝ (β · υ) : 2
                  </div>
                  <p className="text-[11px] text-slate-600 font-sans text-left pt-1">
                    • <strong>Βάση (β):</strong> Οποιαδήποτε από τις 3 πλευρές του τριγώνου.<br />
                    • <strong>Ύψος (υ):</strong> Το <em>κάθετο</em> ευθύγραμμο τμήμα (90°) από την απέναντι κορυφή προς τη βάση (ή την προέκτασή της).
                  </p>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Μην ξεχνάς ποτέ τη διαίρεση με το 2! Χωρίς το « : 2 », υπολογίζεις παραλληλόγραμμο και όχι τρίγωνο.
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
                  Γιατί Διαιρούμε με το 2;
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Αν πάρουμε ένα δεύτερο ολόιδιο τρίγωνο, το αναποδογυρίσουμε και το κολλήσουμε δίπλα στο πρώτο:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2">
                  <div>
                    1. Τα δύο ίσα τρίγωνα μαζί σχηματίζουν ένα <strong>παραλληλόγραμμο</strong>.
                  </div>
                  <div>
                    2. Το παραλληλόγραμμο έχει εμβαδόν <strong>β · υ</strong>.
                  </div>
                  <div className="text-amber-950 font-bold pt-1 border-t border-slate-200">
                    Επομένως, το αρχικό μας τρίγωνο είναι ακριβώς το <strong>μισό</strong> αυτού του παραλληλογράμμου: <strong>(β · υ) : 2</strong>!
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Κάθε διαγώνιος χωρίζει ένα παραλληλόγραμμο σε 2 απολύτως ίσα τρίγωνα με το ίδιο εμβαδόν!
              </div>
            </article>

            {/* ΒΗΜΑ 3 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Ειδικές Περιπτώσεις</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Ορθογώνια &amp; Αμβλυγώνια Τρίγωνα
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Η θέση του ύψους εξαρτάται από τις γωνίες του τριγώνου:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1.5 font-mono">
                  <div>
                    • <strong>Ορθογώνιο τρίγωνο:</strong> Οι δύο κάθετες πλευρές δρουν η μία ως βάση και η άλλη ως ύψος: <strong>Ε ＝ (α · β) : 2</strong>.
                  </div>
                  <div>
                    • <strong>Οξυγώνιο τρίγωνο:</strong> Και τα 3 ύψη πέφτουν <em>μέσα</em> στο τρίγωνο.
                  </div>
                  <div>
                    • <strong>Αμβλυγώνιο τρίγωνο:</strong> Τα 2 από τα 3 ύψη πέφτουν <em>έξω</em>, στην προέκταση της βάσης!
                  </div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Στο ορθογώνιο τρίγωνο δεν χρειάζεται να σχεδιάσουμε ύψος: πολλαπλασιάζουμε τις 2 κάθετες πλευρές και διαιρούμε με το 2!
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
                  Εύρεση Ύψους ή Βάσης
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Αν γνωρίζουμε το εμβαδόν και ψάχνουμε τη βάση ή το ύψος, διπλασιάζουμε πρώτα το εμβαδόν:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 font-mono">
                  <div className="text-emerald-950 font-bold">
                    • Ύψος (υ) ＝ (2 · Ε) : β
                  </div>
                  <div className="text-emerald-950 font-bold">
                    • Βάση (β) ＝ (2 · Ε) : υ
                  </div>
                  <p className="text-[11px] text-slate-600 font-sans pt-1">
                    Παράδειγμα: Αν Ε ＝ 30 cm² και β ＝ 10 cm, τότε υ ＝ (2 · 30) : 10 ＝ 60 : 10 ＝ <strong>6 cm</strong>.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Θυμήσου: Πρώτα διπλασιάζουμε το εμβαδόν ($2 \cdot Ε$) και μετά διαιρούμε με τη γνωστή διάσταση!
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΟΠΤΙΚΗ ΑΠΟΔΕΙΞΗ ΜΕ ΔΥΟ ΤΡΙΓΩΝΑ (SVG) */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1</span>
            </div>
            <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Γιατί το Τρίγωνο είναι το Μισό Παραλληλόγραμμο; (SVG)
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Σύρε την μπάρα για να ενώσεις ένα δεύτερο πανομοιότυπο τρίγωνο και δες πώς μαζί σχηματίζουν ένα πλήρες παραλληλόγραμμο:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">

            {/* Χειριστήρια & Επεξήγηση (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>ΕΝΩΣΗ ΔΕΥΤΕΡΟΥ ΤΡΙΓΩΝΟΥ:</span>
                  <span className="font-mono text-base font-black text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {mergeProgress}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={mergeProgress}
                  onChange={(e) => setMergeProgress(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>0% (1 Τρίγωνο)</span>
                  <span>50% (Προσέγγιση)</span>
                  <span>100% (Παραλληλόγραμμο)</span>
                </div>
              </div>

              {/* Κάρτα Επεξήγησης */}
              <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 space-y-2 text-xs sm:text-sm">
                <div className="font-bold text-sky-950">
                  {mergeProgress === 0 && '🔷 Αρχικό Σχήμα: Ένα μόνο τρίγωνο με βάση β και ύψος υ.'}
                  {mergeProgress > 0 && mergeProgress < 100 && '🔄 Το δεύτερο τρίγωνο πλησιάζει αντεστραμμένο...'}
                  {mergeProgress === 100 && '🟩 Ολοκληρώθηκε: Τα δύο τρίγωνα σχημάτισαν ένα παραλληλόγραμμο!'}
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Το παραλληλόγραμμο έχει εμβαδόν <strong>β · υ</strong>. Επειδή αποτελείται από 2 ολόιδια τρίγωνα, 
                  το καθένα έχει ακριβώς το μισό εμβαδόν: <strong>Ε ＝ (β · υ) : 2</strong>!
                </p>
              </div>
            </div>

            {/* SVG Visualizer (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 min-h-[300px] p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center">
              <svg
                viewBox="0 0 340 200"
                className="w-full max-w-[340px] sm:max-w-[420px] h-auto select-none overflow-visible"
              >
                {/* 1. Αρχικό τρίγωνο (γαλάζιο): κορυφές (originX, originY+heightH), (originX+baseW, originY+heightH), (originX+slantX, originY) */}
                <polygon
                  points={`
                    ${originX},${originY + heightH} 
                    ${originX + baseW},${originY + heightH} 
                    ${originX + slantX},${originY}
                  `}
                  fill="rgba(56, 189, 248, 0.3)"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                />

                {/* 2. Δεύτερο αντεστραμμένο τρίγωνο (μωβ): ολισθαίνει προς τα αριστερά μέχρι να κουμπώσει */}
                <polygon
                  points={`
                    ${originX + slantX + distanceOffset},${originY} 
                    ${originX + slantX + baseW + distanceOffset},${originY} 
                    ${originX + baseW + distanceOffset},${originY + heightH}
                  `}
                  fill={mergeProgress === 100 ? 'rgba(52, 211, 153, 0.35)' : 'rgba(168, 85, 247, 0.35)'}
                  stroke={mergeProgress === 100 ? '#34d399' : '#c084fc'}
                  strokeWidth="2.5"
                  strokeDasharray={mergeProgress > 0 && mergeProgress < 100 ? '4 3' : 'none'}
                />

                {/* 3. Κατακόρυφο Ύψος (υ) - Κίτρινη διακεκομμένη γραμμή */}
                <line
                  x1={originX + slantX}
                  y1={originY}
                  x2={originX + slantX}
                  y2={originY + heightH}
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                />

                {/* Σύμβολο ορθής γωνίας (90°) */}
                <rect
                  x={originX + slantX}
                  y={originY + heightH - 10}
                  width="10"
                  height="10"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                />
                <circle cx={originX + slantX + 5} cy={originY + heightH - 5} r="1.5" fill="#f59e0b" />

                {/* Ετικέτα Ύψους (υ) */}
                <text
                  x={originX + slantX - 8}
                  y={originY + heightH / 2 + 4}
                  fill="#f59e0b"
                  fontSize="12"
                  fontWeight="black"
                  textAnchor="end"
                >
                  υ
                </text>

                {/* Ετικέτα Βάσης (β) */}
                <line
                  x1={originX}
                  y1={originY + heightH + 18}
                  x2={originX + baseW}
                  y2={originY + heightH + 18}
                  stroke="#e2e8f0"
                  strokeWidth="1.5"
                />
                <text
                  x={originX + baseW / 2}
                  y={originY + heightH + 34}
                  fill="#ffffff"
                  fontSize="13"
                  fontWeight="black"
                  textAnchor="middle"
                >
                  Βάση (β)
                </text>
              </svg>

              <div className="mt-3 text-center text-xs text-slate-400">
                Δύο πανομοιότυπα τρίγωνα φτιάχνουν 1 παραλληλόγραμμο (β · υ). Άρα, 1 τρίγωνο ＝ (β · υ) : 2.
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
              Υπολογιστής Εμβαδού Τριγώνου &amp; Αυτόματη Μετατροπή Μονάδων
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Άλλαξε τη βάση και το ύψος σε cm για να υπολογίσεις το εμβαδόν του τριγώνου και δες πώς συγκρίνεται με το παραλληλόγραμμο:
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
                  max={30}
                  step={1}
                  value={calcBase}
                  onChange={(e) => setCalcBase(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>ΑΝΤΙΣΤΟΙΧΟ ΥΨΟΣ (υ):</span>
                  <span className="font-mono text-base font-black text-sky-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {calcHeight} cm
                  </span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={25}
                  step={1}
                  value={calcHeight}
                  onChange={(e) => setCalcHeight(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer touch-manipulation"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 font-mono space-y-1">
                <div>• Γινόμενο: β · υ ＝ {calcBase} · {calcHeight} ＝ {rectAreaCm2} cm²</div>
                <div className="text-emerald-800 font-black text-sm">
                  • Εμβαδόν Τριγώνου: ({calcBase} · {calcHeight}) : 2 ＝ <strong>{formatNum(areaCm2)} cm²</strong>
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
                💡 Το εμβαδόν του τριγώνου είναι πάντοτε ακριβώς το μισό του αντίστοιχου παραλληλογράμμου ({formatNum(rectAreaCm2)} cm²).
              </div>
            </div>

          </div>
        </section>

        {/* 5. ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ ΚΑΘΗΜΕΡΙΝΗΣ ΖΩΗΣ */}
        <section className="space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight">
              Λυμένα Προβλήματα με Εμβαδόν Τριγώνου
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Εφαρμογές του τύπου Ε ＝ (β · υ) : 2 σε ιστιοπλοϊκά πανιά και τριγωνικά οικόπεδα.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ΠΡΟΒΛΗΜΑ 1 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-900 text-xs font-black rounded-lg uppercase">
                  ΠΡΟΒΛΗΜΑ 1: ΙΣΤΙΟΦΟΡΟ ΠΑΝΙ
                </span>
                <span className="text-xs font-bold text-slate-400">Ορθογώνιο Τρίγωνο</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Υπολογισμός Επιφάνειας Τριγωνικού Πανιού
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Το τριγωνικό πανί ενός ιστιοπλοϊκού σκάφους έχει σχήμα ορθογωνίου τριγώνου. 
                Οι δύο κάθετες πλευρές του είναι το κατάρτι με ύψος <strong>12 m</strong> και η μάτσα με μήκος <strong>5 m</strong>. 
                Πόσα τετραγωνικά μέτρα (m²) πανιού χρειάστηκαν για την κατασκευή του;
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΔΕΔΟΜΕΝΑ ΠΡΟΒΛΗΜΑΤΟΣ
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">1η κάθετη (βάση)</span> 5 m
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">2η κάθετη (ύψος)</span> 12 m
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Τύπος</span> (β · υ) : 2
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήματα Επίλυσης:</span>
                  <div>• Στο ορθογώνιο τρίγωνο οι δύο κάθετες πλευρές αποτελούν τη βάση και το αντίστοιχο ύψος.</div>
                  <div>• <strong>Γινόμενο:</strong> 5 · 12 ＝ 60 m².</div>
                  <div>• <strong>Εμβαδόν τριγώνου:</strong> 60 : 2 ＝ <strong className="text-blue-700">30 m²</strong>.</div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 font-medium">
                💡 Στο ορθογώνιο τρίγωνο δεν χρειάζεται να ψάχνουμε για ύψος: οι δύο κάθετες πλευρές είναι η βάση και το ύψος!
              </div>
            </article>

            {/* ΠΡΟΒΛΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-lg uppercase">
                  ΠΡΟΒΛΗΜΑ 2: ΤΡΙΓΩΝΙΚΟ ΟΙΚΟΠΕΔΟ
                </span>
                <span className="text-xs font-bold text-slate-400">Εύρεση Ύψους</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Εύρεση Ύψους όταν Γνωρίζουμε το Εμβαδόν
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ένα οικόπεδο έχει σχήμα τριγώνου με εμβαδόν <strong>240 m²</strong>. 
                Αν η πρόσοψή του στο δρόμο (βάση) έχει μήκος <strong>24 m</strong>, πόσο είναι το βάθος (το αντίστοιχο ύψος) του οικοπέδου;
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΣΤΟΙΧΕΙΑ ΥΠΟΛΟΓΙΣΜΟΥ
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold text-[11px]">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Εμβαδόν (Ε)</span> 240 m²
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Βάση (β)</span> 24 m
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Τύπος ύψους</span> υ ＝ (2 · Ε) : β
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήματα Επίλυσης:</span>
                  <div>• <strong>Διπλασιάζουμε το εμβαδόν:</strong> 2 · 240 ＝ <strong>480 m²</strong> (το εμβαδόν του αντίστοιχου παραλληλογράμμου).</div>
                  <div>• <strong>Υπολογισμός ύψους:</strong> 480 : 24 ＝ <strong className="text-amber-700">20 m</strong>.</div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 font-medium">
                ⚡ Επαλήθευση: Ε ＝ (β · υ) : 2 ＝ (24 · 20) : 2 ＝ 480 : 2 ＝ 240 m²!
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
                  <strong>Μην ξεχνάτε τη διαίρεση με το 2:</strong> Το πιο συχνό λάθος των μαθητών είναι να υπολογίζουν απλώς $β \cdot υ$. Θυμηθείτε: το $β \cdot υ$ είναι το παραλληλόγραμμο. Το τρίγωνο είναι πάντα το μισό του: <strong>(β · υ) : 2</strong>.
                </li>
                <li>
                  <strong>Το ύψος δεν είναι η πλάγια πλευρά:</strong> Σε ένα σκαληνό ή ισοσκελές τρίγωνο, το ύψος είναι αυστηρά το <em>κάθετο</em> ευθύγραμμο τμήμα (90°) από την κορυφή προς τη βάση, όχι η πλάγια κεκλιμένη πλευρά.
                </li>
                <li>
                  <strong>Στο αμβλυγώνιο τρίγωνο το ύψος πέφτει έξω:</strong> Μην παραξενεύεστε αν το ύψος συναντά την προέκταση της βάσης έξω από το σχήμα. Μετράμε ως βάση μόνο το αρχικό τμήμα της πλευράς, όχι την προέκτασή της!
                </li>
                <li>
                  <strong>Ίδιες μονάδες μέτρησης:</strong> Αν η βάση δίνεται σε μέτρα (m) και το ύψος σε εκατοστά (cm), μετατρέπουμε απαραίτητα και τα δύο στην ίδια μονάδα πριν τις πράξεις.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 7. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στο Εμβαδόν Τριγώνου!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε 12 διαδραστικές ασκήσεις με υπολογισμούς βάσης, ύψους, εμβαδού και ορθογώνια τρίγωνα για τη ΣΤ' Δημοτικού.
            </p>
          </div>

          <Link
            href="/st-dimotikou/74-embadon-trigonou-ask"
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
