// pages/st-dimotikou/75-embadon-trapeziou.js
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

export default function EmbadonTrapeziouTheoriaPage() {
  // -------------------------------------------------------------------------
  // Εργαστήριο 1: Διαδραστική Γεωμετρική Απόδειξη σε 2 Στάδια (SVG)
  // Στάδιο 1 (0% -> 50%): Το 2ο ανάποδο τραπέζιο κουμπώνει και φτιάχνει Παραλληλόγραμμο
  // Στάδιο 2 (50% -> 100%): Το τρίγωνο αποκόπτεται και φτιάχνει Ορθογώνιο
  // -------------------------------------------------------------------------
  const [animProgress, setAnimProgress] = useState(0); // 0 έως 100

  // Γεωμετρικές διαστάσεις εργαστηρίου 1 (SVG)
  const bigBaseB = 140; // Μεγάλη βάση B = 140px
  const smallBaseB = 70; // Μικρή βάση b = 70px
  const heightH = 80; // Ύψος υ = 80px
  const slantLeft = 35; // Κλίση αριστερής πλευράς
  const originX = 50;
  const originY = 55;

  // Υπολογισμός κίνησης 1 (Προσέγγιση του 2ου τραπεζίου: 0% -> 50%)
  const phase1T = Math.min(1, animProgress / 50);
  const secondTrapezoidOffset = (1 - phase1T) * 90;

  // Υπολογισμός κίνησης 2 (Ολίσθηση του τριγώνου: 50% -> 100%)
  const phase2T = Math.max(0, (animProgress - 50) / 50);
  const totalParallelogramBase = bigBaseB + smallBaseB; // 210px
  const triangleShiftX = phase2T * totalParallelogramBase;

  // -------------------------------------------------------------------------
  // Εργαστήριο 2: Δυναμικός Υπολογιστής Εμβαδού Τραπεζίου & Μονάδων
  // -------------------------------------------------------------------------
  const [calcBigB, setCalcBigB] = useState(12); // Μεγάλη βάση (cm)
  const [calcSmallB, setCalcSmallB] = useState(8); // Μικρή βάση (cm)
  const [calcHeight, setCalcHeight] = useState(6); // Ύψος (cm)

  const sumBases = useMemo(() => calcBigB + calcSmallB, [calcBigB, calcSmallB]);
  const areaCm2 = useMemo(() => (sumBases * calcHeight) / 2, [sumBases, calcHeight]);
  const parallAreaCm2 = useMemo(() => sumBases * calcHeight, [sumBases, calcHeight]);
  const areaMm2 = useMemo(() => areaCm2 * 100, [areaCm2]);
  const areaDm2 = useMemo(() => areaCm2 / 100, [areaCm2]);
  const areaM2 = useMemo(() => areaCm2 / 10000, [areaCm2]);

  return (
    <Layout
      title="Εμβαδόν Τραπεζίου &amp; Μονάδες Μέτρησης - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μαθαίνουμε πώς υπολογίζουμε το εμβαδόν τραπεζίου Ε ＝ [(Β ＋ b) · υ] : 2, τη γεωμετρική μετατροπή σε παραλληλόγραμμο και ορθογώνιο και τις μετατροπές μονάδων."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/75-embadon-trapeziou-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 75 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Εμβαδόν Τραπεζίου • Μεγάλη Βάση, Μικρή Βάση &amp; Ύψος
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Ανακαλύπτουμε τον θεμελιώδη τύπο <strong>Ε ＝ [(Β ＋ b) · υ] : 2</strong>, 
              βλέπουμε ζωντανά πώς δύο ίδια τραπέζια ενώνονται σε ένα <strong>πλάγιο παραλληλόγραμμο</strong> και έπειτα 
              μετατρέπονται σε <strong>ορθογώνιο</strong>, και εξασκούμαστε στις μετατροπές μονάδων μέτρησης επιφάνειας!
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία, Απόδειξη 2 Σταδίων (Τραπέζιο ➔ Παραλληλόγραμμο ➔ Ορθογώνιο) &amp; SVG</span>
            </div>
            <Link
              href="/st-dimotikou/75-embadon-trapeziou-ask"
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
              Το Εμβαδόν Τραπεζίου σε 4 Βήματα
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Από την έννοια των δύο βάσεων μέχρι τη γεωμετρική απόδειξη και τους υπολογισμούς.
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
                  Το τραπέζιο έχει δύο παράλληλες πλευρές (τη <strong>Μεγάλη Βάση Β</strong> και τη <strong>Μικρή Βάση b</strong>) και ένα <strong>Ύψος υ</strong>:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 text-center font-mono">
                  <div className="text-indigo-900 font-black text-base sm:text-lg">
                    Εμβαδόν ＝ [(Β ＋ b) · υ] : 2
                  </div>
                  <p className="text-[11px] text-slate-600 font-sans text-left pt-1">
                    1. Προσθέτουμε τις δύο βάσεις: <strong>(Β ＋ b)</strong>.<br />
                    2. Πολλαπλασιάζουμε το άθροισμα επί το ύψος: <strong>· υ</strong>.<br />
                    3. Διαιρούμε το αποτέλεσμα με το 2: <strong>: 2</strong>.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Το ύψος είναι πάντοτε η <strong>κάθετη απόσταση (90°)</strong> ανάμεσα στις δύο βάσεις, όχι οι πλάγιες πλευρές!
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
                  Γιατί Ισχύει ο Τύπος;
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Η απόδειξη στηρίζεται σε δύο απλά βήματα αναδιάταξης:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2">
                  <div>
                    1. <strong>Διπλασιασμός:</strong> Ενώνουμε ένα δεύτερο ανάποδο τραπέζιο. Σχηματίζεται πλάγιο παραλληλόγραμμο με βάση <strong>(Β ＋ b)</strong> και ύψος <strong>υ</strong>.
                  </div>
                  <div>
                    2. <strong>Ορθογώνιο:</strong> Μεταφέροντας το ακριανό τρίγωνο, το παραλληλόγραμμο γίνεται ορθογώνιο με εμβαδόν <strong>(Β ＋ b) · υ</strong>.
                  </div>
                  <div className="text-amber-950 font-bold pt-1 border-t border-slate-200">
                    Επειδή χρησιμοποιήσαμε 2 τραπέζια, το ένα έχει εμβαδόν <strong>[(Β ＋ b) · υ] : 2</strong>!
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Κάθε τραπέζιο είναι ακριβώς το μισό ενός παραλληλογράμμου με βάση ίση με το άθροισμα των βάσεων (Β ＋ b)!
              </div>
            </article>

            {/* ΒΗΜΑ 3 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Είδη Τραπεζίων</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Ορθογώνιο &amp; Ισοσκελές Τραπέζιο
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Ο τύπος του εμβαδού ισχύει ακριβώς ο ίδιος για όλα τα είδη τραπεζίων:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1.5 font-mono">
                  <div>
                    • <strong>Ορθογώνιο τραπέζιο:</strong> Έχει 2 ορθές γωνίες. Η κάθετη πλευρά του είναι ταυτόχρονα και το <strong>ύψος (υ)</strong> του!
                  </div>
                  <div>
                    • <strong>Ισοσκελές τραπέζιο:</strong> Οι δύο μη παράλληλες πλευρές του είναι ίσες.
                  </div>
                  <div>
                    • <strong>Σκαληνό τραπέζιο:</strong> Όλες οι πλευρές του έχουν διαφορετικά μήκη.
                  </div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Στο ορθογώνιο τραπέζιο δεν χρειάζεται να σχεδιάσουμε ύψος: είναι έτοιμο στην κάθετη πλευρά!
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
                  Εύρεση Ύψους ή Αθροίσματος Βάσεων
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Όταν γνωρίζουμε το εμβαδόν και ψάχνουμε άγνωστη διάσταση, <strong>διπλασιάζουμε πρώτα το εμβαδόν (2 · Ε)</strong>:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 font-mono">
                  <div className="text-emerald-950 font-bold">
                    • Ύψος: υ ＝ (2 · Ε) : (Β ＋ b)
                  </div>
                  <div className="text-emerald-950 font-bold">
                    • Άθροισμα Βάσεων: (Β ＋ b) ＝ (2 · Ε) : υ
                  </div>
                  <p className="text-[11px] text-slate-600 font-sans pt-1">
                    Παράδειγμα: Αν Ε ＝ 50 cm² και (Β ＋ b) ＝ 20 cm, τότε υ ＝ (2 · 50) : 20 ＝ 100 : 20 ＝ <strong>5 cm</strong>.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Όπως και στο τρίγωνο, διπλασιάζουμε πρώτα το εμβαδόν και μετά διαιρούμε!
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΑΠΟΔΕΙΞΗ 2 ΣΤΑΔΙΩΝ (SVG) */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1</span>
            </div>
            <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Πώς το Τραπέζιο Γίνεται Παραλληλόγραμμο και Ορθογώνιο; (SVG)
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Σύρε την μπάρα προόδου: Στο 50% το 2ο ανάποδο τραπέζιο κουμπώνει σχηματίζοντας παραλληλόγραμμο, και στο 100% το ακριανό τρίγωνο ολισθαίνει στα δεξιά σχηματίζοντας τέλειο ορθογώνιο!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">

            {/* Slider & Επεξήγηση (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>ΣΤΑΔΙΟ ΑΝΑΔΙΑΤΑΞΗΣ:</span>
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
                  <span>0% (1 Τραπέζιο)</span>
                  <span>50% (Παραλληλόγραμμο)</span>
                  <span>100% (Ορθογώνιο)</span>
                </div>
              </div>

              {/* Κάρτα Επεξήγησης */}
              <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 space-y-2 text-xs sm:text-sm">
                <div className="font-bold text-sky-950">
                  {animProgress === 0 && '🔷 Στάδιο 0: Αρχικό τραπέζιο με μεγάλη βάση Β ＝ 140 και μικρή βάση b ＝ 70.'}
                  {animProgress > 0 && animProgress < 50 && '🔄 Στάδιο 1: Ένα δεύτερο ανάποδο τραπέζιο πλησιάζει...'}
                  {animProgress >= 50 && animProgress < 100 && '🟪 Στάδιο 2: Σχηματίστηκε παραλληλόγραμμο! Τώρα το αριστερό τρίγωνο αποκόπτεται και ολισθαίνει...'}
                  {animProgress === 100 && '🟩 Στάδιο 3: Τέλειο ορθογώνιο με μήκος (Β ＋ b) και πλάτος υ!'}
                </div>
                <div className="text-slate-600 text-[11px] space-y-1 font-mono pt-1 border-t border-sky-200/60">
                  <div>• Συνολική Βάση: Β ＋ b ＝ 140 ＋ 70 ＝ <strong>210 px</strong></div>
                  <div>• Εμβαδόν 2 Τραπεζίων: (Β ＋ b) · υ</div>
                  <div className="text-indigo-900 font-bold">• Εμβαδόν 1 Τραπεζίου: <strong>[(Β ＋ b) · υ] : 2</strong></div>
                </div>
              </div>
            </div>

            {/* SVG Visualizer (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 min-h-[340px] p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center">
              <svg
                viewBox="0 0 400 220"
                className="w-full max-w-[400px] sm:max-w-[460px] h-auto select-none overflow-visible"
              >
                {/* 1. Σταθερό σώμα του 1ου τραπεζίου (χωρίς το κινούμενο αριστερό τρίγωνο) */}
                <polygon
                  points={`
                    ${originX + slantLeft},${originY} 
                    ${originX + slantLeft + smallBaseB},${originY} 
                    ${originX + bigBaseB},${originY + heightH} 
                    ${originX + slantLeft},${originY + heightH}
                  `}
                  fill="rgba(56, 189, 248, 0.3)"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                />

                {/* 2. Κινούμενο αριστερό ορθογώνιο τρίγωνο του 1ου τραπεζίου */}
                <polygon
                  points={`
                    ${originX + triangleShiftX},${originY + heightH} 
                    ${originX + slantLeft + triangleShiftX},${originY + heightH} 
                    ${originX + slantLeft + triangleShiftX},${originY}
                  `}
                  fill={animProgress === 100 ? 'rgba(52, 211, 153, 0.4)' : 'rgba(56, 189, 248, 0.35)'}
                  stroke={animProgress === 100 ? '#34d399' : '#38bdf8'}
                  strokeWidth="2.5"
                  strokeDasharray={animProgress > 50 && animProgress < 100 ? '4 3' : 'none'}
                />

                {/* 3. Δεύτερο ανάποδο τραπέζιο (μωβ): πλησιάζει από τα δεξιά (0 -> 50) */}
                <polygon
                  points={`
                    ${originX + slantLeft + smallBaseB + secondTrapezoidOffset},${originY} 
                    ${originX + totalParallelogramBase + slantLeft + secondTrapezoidOffset},${originY} 
                    ${originX + totalParallelogramBase + secondTrapezoidOffset},${originY + heightH} 
                    ${originX + bigBaseB + secondTrapezoidOffset},${originY + heightH}
                  `}
                  fill="rgba(168, 85, 247, 0.3)"
                  stroke="#c084fc"
                  strokeWidth="2.5"
                  strokeDasharray={animProgress < 50 ? '4 3' : 'none'}
                />

                {/* 4. Κάθετο Ύψος (υ) - Κίτρινη διακεκομμένη γραμμή */}
                <line
                  x1={originX + slantLeft}
                  y1={originY}
                  x2={originX + slantLeft}
                  y2={originY + heightH}
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                />
                <rect
                  x={originX + slantLeft}
                  y={originY + heightH - 10}
                  width="10"
                  height="10"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                />
                <circle cx={originX + slantLeft + 5} cy={originY + heightH - 5} r="1.5" fill="#f59e0b" />
                <text x={originX + slantLeft - 8} y={originY + heightH / 2 + 4} fill="#f59e0b" fontSize="12" fontWeight="black" textAnchor="end">
                  υ
                </text>

                {/* Ετικέτες Βάσεων */}
                {/* Μικρή βάση b επάνω */}
                <line x1={originX + slantLeft} y1={originY - 12} x2={originX + slantLeft + smallBaseB} y2={originY - 12} stroke="#38bdf8" strokeWidth="1.5" />
                <text x={originX + slantLeft + smallBaseB / 2} y={originY - 18} fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
                  b (μικρή)
                </text>

                {/* Μεγάλη βάση B κάτω */}
                <line x1={originX + (animProgress === 100 ? slantLeft : 0)} y1={originY + heightH + 18} x2={originX + bigBaseB + (animProgress === 100 ? slantLeft : 0)} y2={originY + heightH + 18} stroke="#38bdf8" strokeWidth="1.5" />
                <text x={originX + bigBaseB / 2 + (animProgress === 100 ? slantLeft : 0)} y={originY + heightH + 34} fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">
                  Β (μεγάλη)
                </text>

                {/* Ετικέτα 2ης βάσης όταν εμφανιστεί το 2ο τραπέζιο */}
                {animProgress >= 50 && (
                  <>
                    {/* Πάνω βάση Β του 2ου τραπεζίου */}
                    <line x1={originX + slantLeft + smallBaseB} y1={originY - 12} x2={originX + slantLeft + totalParallelogramBase} y2={originY - 12} stroke="#c084fc" strokeWidth="1.5" />
                    <text x={originX + slantLeft + smallBaseB + bigBaseB / 2} y={originY - 18} fill="#c084fc" fontSize="11" fontWeight="bold" textAnchor="middle">
                      Β (του 2ου)
                    </text>

                    {/* Κάτω βάση b του 2ου τραπεζίου */}
                    <line x1={originX + bigBaseB + (animProgress === 100 ? slantLeft : 0)} y1={originY + heightH + 18} x2={originX + totalParallelogramBase + (animProgress === 100 ? slantLeft : 0)} y2={originY + heightH + 18} stroke="#c084fc" strokeWidth="1.5" />
                    <text x={originX + bigBaseB + smallBaseB / 2 + (animProgress === 100 ? slantLeft : 0)} y={originY + heightH + 34} fill="#c084fc" fontSize="11" fontWeight="bold" textAnchor="middle">
                      b (του 2ου)
                    </text>
                  </>
                )}
              </svg>

              <div className="mt-3 text-center text-xs text-slate-400">
                Τα δύο τραπέζια φτιάχνουν ορθογώνιο με μήκος (Β ＋ b) και πλάτος υ. Άρα το ένα τραπέζιο ισούται με [(Β ＋ b) · υ] : 2.
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
              Υπολογιστής Εμβαδού Τραπεζίου &amp; Αυτόματη Μετατροπή
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Άλλαξε τις δύο βάσεις (Β και b) και το ύψος σε cm για να υπολογίσεις το εμβαδόν του τραπεζίου και να δεις τις αυτόματες μετατροπές μονάδων:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

            {/* Sliders Βάσεων και Ύψους (5 στήλες) */}
            <div className="lg:col-span-5 space-y-3.5">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>ΜΕΓΑΛΗ ΒΑΣΗ (Β):</span>
                  <span className="font-mono text-base font-black text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {calcBigB} cm
                  </span>
                </div>
                <input
                  type="range"
                  min={6}
                  max={25}
                  step={1}
                  value={calcBigB}
                  onChange={(e) => {
                    const newBig = Number(e.target.value);
                    setCalcBigB(newBig);
                    if (calcSmallB >= newBig) setCalcSmallB(newBig - 1);
                  }}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>ΜΙΚΡΗ ΒΑΣΗ (b):</span>
                  <span className="font-mono text-base font-black text-sky-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {calcSmallB} cm
                  </span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={calcBigB - 1}
                  step={1}
                  value={calcSmallB}
                  onChange={(e) => setCalcSmallB(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer touch-manipulation"
                />
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>ΥΨΟΣ (υ):</span>
                  <span className="font-mono text-base font-black text-amber-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
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
                  className="w-full accent-amber-600 cursor-pointer touch-manipulation"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 font-mono space-y-1">
                <div>• Άθροισμα βάσεων: Β ＋ b ＝ {calcBigB} ＋ {calcSmallB} ＝ {sumBases} cm</div>
                <div>• Γινόμενο: (Β ＋ b) · υ ＝ {sumBases} · {calcHeight} ＝ {parallAreaCm2} cm²</div>
                <div className="text-emerald-800 font-black text-sm">
                  • Εμβαδόν Τραπεζίου: [{sumBases} · {calcHeight}] : 2 ＝ <strong>{formatNum(areaCm2)} cm²</strong>
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
                💡 Το εμβαδόν του τραπεζίου είναι ακριβώς το μισό του αντίστοιχου παραλληλογράμμου ({formatNum(parallAreaCm2)} cm²).
              </div>
            </div>

          </div>
        </section>

        {/* 5. ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ ΚΑΘΗΜΕΡΙΝΗΣ ΖΩΗΣ */}
        <section className="space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight">
              Λυμένα Προβλήματα με Εμβαδόν Τραπεζίου
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Εφαρμογές του τύπου Ε ＝ [(Β ＋ b) · υ] : 2 σε οικόπεδα και αγροτεμάχια.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ΠΡΟΒΛΗΜΑ 1 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-900 text-xs font-black rounded-lg uppercase">
                  ΠΡΟΒΛΗΜΑ 1: ΤΡΑΠΕΖΙΟ ΟΙΚΟΠΕΔΟ
                </span>
                <span className="text-xs font-bold text-slate-400">Ε ＝ [(Β ＋ b) · υ] : 2</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Υπολογισμός Εμβαδού Οικοπέδου σε Σχήμα Τραπεζίου
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ένα οικόπεδο έχει σχήμα τραπεζίου. Η μεγάλη του βάση είναι <strong>40 m</strong>, 
                η μικρή του βάση είναι <strong>25 m</strong> και η κάθετη απόσταση ανάμεσα στις δύο βάσεις (το ύψος) είναι <strong>16 m</strong>. 
                Οι πλάγιες πλευρές του είναι 18 m και 20 m. Ποιο είναι το εμβαδόν του οικοπέδου σε m²;
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΔΕΔΟΜΕΝΑ ΠΡΟΒΛΗΜΑΤΟΣ
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Μεγάλη βάση (Β)</span> 40 m
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Μικρή βάση (b)</span> 25 m
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Ύψος (υ)</span> 16 m
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήματα Επίλυσης:</span>
                  <div>• <strong>Άθροισμα βάσεων:</strong> Β ＋ b ＝ 40 ＋ 25 ＝ <strong>65 m</strong>.</div>
                  <div>• <strong>Πολλαπλασιασμός με το ύψος:</strong> 65 · 16 ＝ <strong>1.040 m²</strong>.</div>
                  <div>• <strong>Διαίρεση με το 2:</strong> 1.040 : 2 ＝ <strong className="text-blue-700">520 m²</strong>.</div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 font-medium">
                💡 Οι πλάγιες πλευρές (18 m και 20 m) δεν χρησιμοποιούνται στον υπολογισμό του εμβαδού!
              </div>
            </article>

            {/* ΠΡΟΒΛΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-lg uppercase">
                  ΠΡΟΒΛΗΜΑ 2: ΕΥΡΕΣΗ ΥΨΟΥΣ &amp; ΣΤΡΕΜΜΑΤΑ
                </span>
                <span className="text-xs font-bold text-slate-400">υ ＝ (2 · Ε) : (Β ＋ b)</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Εύρεση του Ύψους σε Αγροτεμάχιο
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ένα αγρόκτημα σε σχήμα τραπεζίου έχει έκταση <strong>1,8 στρέμματα (1.800 m²)</strong>. 
                Οι δύο παράλληλοι φράχτες του (οι βάσεις) έχουν μήκος <strong>70 m</strong> και <strong>50 m</strong>. 
                Πόσο είναι το ύψος (η απόσταση ανάμεσα στους δύο φράχτες);
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΣΤΟΙΧΕΙΑ ΥΠΟΛΟΓΙΣΜΟΥ
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold text-[11px]">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Εμβαδόν (Ε)</span> 1.800 m²
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Βάσεις (Β, b)</span> 70 m, 50 m
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Τύπος ύψους</span> υ ＝ (2 · Ε) : (Β ＋ b)
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήματα Επίλυσης:</span>
                  <div>• <strong>Διπλασιάζουμε το εμβαδόν:</strong> 2 · 1.800 ＝ <strong>3.600 m²</strong>.</div>
                  <div>• <strong>Άθροισμα βάσεων:</strong> 70 ＋ 50 ＝ <strong>120 m</strong>.</div>
                  <div>• <strong>Υπολογισμός ύψους:</strong> 3.600 : 120 ＝ <strong className="text-amber-700">30 m</strong>.</div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 font-medium">
                ⚡ Επαλήθευση: [(70 ＋ 50) · 30] : 2 ＝ (120 · 30) : 2 ＝ 3.600 : 2 ＝ 1.800 m²!
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
                  <strong>Μην ξεχνάτε τις παρενθέσεις στις βάσεις:</strong> Πρώτα <em>προσθέτουμε</em> τις δύο βάσεις (Β ＋ b) και μετά πολλαπλασιάζουμε με το ύψος. Αν πολλαπλασιάσετε μόνο τη μία βάση με το ύψος, το αποτέλεσμα θα είναι λάθος.
                </li>
                <li>
                  <strong>Μην ξεχνάτε τη διαίρεση με το 2:</strong> Ο τύπος (Β ＋ b) · υ υπολογίζει το εμβαδόν δύο ενωμένων τραπεζίων (παραλληλόγραμμο). Το ένα τραπέζιο απαιτεί πάντα <strong>διαίρεση με το 2</strong>.
                </li>
                <li>
                  <strong>Οι πλάγιες πλευρές δεν είναι ύψος:</strong> Εκτός αν το τραπέζιο είναι ορθογώνιο, οι πλάγιες κεκλιμένες πλευρές είναι πάντοτε μεγαλύτερες από το κάθετο ύψος.
                </li>
                <li>
                  <strong>Ίδιες μονάδες μέτρησης:</strong> Βεβαιωθείτε ότι και οι δύο βάσεις και το ύψος εκφράζονται στην ίδια μονάδα (π.χ. όλα σε m ή όλα σε cm) πριν κάνετε τις πράξεις.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 7. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στο Εμβαδόν Τραπεζίου!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε 12 διαδραστικές ασκήσεις με υπολογισμούς βάσεων, ύψους, εμβαδού και μετατροπές μονάδων επιφάνειας για τη ΣΤ' Δημοτικού.
            </p>
          </div>

          <Link
            href="/st-dimotikou/75-embadon-trapeziou-ask"
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
