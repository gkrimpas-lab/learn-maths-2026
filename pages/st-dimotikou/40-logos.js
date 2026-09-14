// pages/st-dimotikou/40-logos.js
import { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

const LIMITS = {
  MIN_ITEMS: 1,
  MAX_ITEMS: 24,
  MIN_CUPS: 1,
  MAX_CUPS: 12
};

// Εύρεση Μέγιστου Κοινού Διαιρέτη (ΜΚΔ) για απλοποίηση λόγου
function getGCD(a, b) {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export default function LogosTheoryPage() {
  // Εργαστήριο 1: Σύγκριση δύο ποσοτήτων (Μπλε vs Πορτοκαλί Στοιχεία)
  const [blueCount, setBlueCount] = useState(8);
  const [orangeCount, setOrangeCount] = useState(12);

  // Εργαστήριο 2: Πρακτική Εφαρμογή Αναλογίας Χυμού (Χυμός vs Νερό)
  const [juiceCups, setJuiceCups] = useState(3);
  const [waterCups, setWaterCups] = useState(6);

  // Υπολογισμοί Εργαστηρίου 1
  const gcd1 = useMemo(() => getGCD(blueCount, orangeCount), [blueCount, orangeCount]);
  const simpBlue = blueCount / gcd1;
  const simpOrange = orangeCount / gcd1;
  const decimalRatio1 = (blueCount / orangeCount).toFixed(2).replace('.', ',');
  const totalItems = blueCount + orangeCount;

  // Υπολογισμοί Εργαστηρίου 2
  const gcd2 = useMemo(() => getGCD(juiceCups, waterCups), [juiceCups, waterCups]);
  const simpJuice = juiceCups / gcd2;
  const simpWater = waterCups / gcd2;
  const totalCups = juiceCups + waterCups;
  const juicePercent = Math.round((juiceCups / totalCups) * 100);
  const waterPercent = 100 - juicePercent;
  const decimalRatio2 = (juiceCups / waterCups).toFixed(2).replace('.', ',');

  return (
    <Layout
      title="Η Έννοια του Λόγου - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Πλήρης θεωρία με παραδείγματα για την έννοια του λόγου, σύγκριση μεγεθών, απλοποίηση, δεκαδική τιμή λόγου και διαδραστικό εργαστήριο για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/40-logos-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 Ασκήσεις</span>
        </Link>
      }
    >
      {/* Container πλήρους εύρους για 2K & 4K και responsive για κινητά */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 space-y-10 2xl:space-y-14 pb-24">
        
        {/* 1. HEADER BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>ΚΕΦΑΛΑΙΟ 40 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Η Έννοια του Λόγου
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              Μαθαίνουμε πώς να συγκρίνουμε δύο μεγέθη μέσω της διαίρεσης, πώς εκφράζουμε έναν λόγο ως κλάσμα, πώς υπολογίζουμε την τιμή του και πώς εφαρμόζουμε την απλοποίηση στην καθημερινή ζωή και τις συνταγές.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία &amp; Δυναμική Οπτικοποίηση Σύγκρισης Μεγεθών</span>
            </div>
            <Link
              href="/st-dimotikou/40-logos-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2.5 2xl:px-7 2xl:py-3.5 rounded-xl shadow-md transition active:scale-95 text-sm 2xl:text-base"
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
              Βασικές Έννοιες σε 4 Βήματα
            </h2>
            <p className="text-slate-600 text-sm sm:text-base 2xl:text-xl mt-1">
              Η μαθηματική ουσία του λόγου, η δομή των όρων του και οι μορφές έκφρασης.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 gap-6 2xl:gap-8">
            
            {/* Βήμα 1ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-sky-100 text-sky-800 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 1
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Ορισμός</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Τι ονομάζουμε Λόγο;
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  <strong>Λόγος</strong> δύο αριθμών ή μεγεθών ονομάζεται το <strong>πηλίκο της διαίρεσης</strong> του πρώτου αριθμού με τον δεύτερο (όταν ο δεύτερος δεν είναι μηδέν).
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <p className="text-slate-700 font-semibold">Συμβολισμός &amp; Μορφή:</p>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-mono font-bold text-slate-900 shadow-inner text-center">
                    α ： β &nbsp;ή&nbsp; α/β
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Ο αριθμός <strong>α</strong> ονομάζεται <em>προηγούμενος όρος</em> (αριθμητής) και ο <strong>β</strong> <em>επόμενος όρος</em> (παρονομαστής).
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Ο λόγος συγκρίνει πόσες φορές το ένα μέγεθος περιέχεται ή αντιστοιχεί στο άλλο.
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Κανόνας Σειράς</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Η Σειρά των Όρων Μετράει!
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Η σειρά με την οποία αναφέρονται οι ποσότητες είναι καθοριστική. Αν αλλάξουμε τη σειρά, αλλάζει η σημασία και η τιμή του λόγου:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono">
                  <div>Λόγος του 2 προς το 5 ＝ <strong className="text-amber-800 font-black">2 ： 5 ＝ 0,4</strong></div>
                  <div>Λόγος του 5 προς το 2 ＝ <strong className="text-amber-800 font-black">5 ： 2 ＝ 2,5</strong></div>
                  <div className="pt-2 border-t border-slate-200 text-slate-700 font-sans text-xs">
                    Οι δύο αυτοί λόγοι λέγονται <strong>αντίστροφοι</strong>.
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ <strong>Αντίστροφοι Λόγοι:</strong> Το γινόμενο δύο αντίστροφων λόγων είναι πάντα ίσο με 1 (π.χ. 2/5 · 5/2 ＝ 1).
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Απλοποίηση &amp; Τιμή</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Απλοποίηση σε Ανάγωγο
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Επειδή ο λόγος γράφεται ως κλάσμα, απλοποιείται διαιρώντας και τους δύο όρους με τον <strong>Μέγιστο Κοινό Διαιρέτη (ΜΚΔ)</strong>:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <p className="text-slate-700 font-semibold">Παράδειγμα για 8 προς 12:</p>
                  <div className="font-mono text-slate-700 text-xs space-y-1">
                    <div>ΜΚΔ(8, 12) ＝ 4</div>
                    <div>(8 ： 4) ： (12 ： 4) ＝ <strong className="text-indigo-700 font-bold">2 ： 3</strong></div>
                    <div className="pt-1 text-slate-900 font-bold">
                      Τιμή λόγου: 8 ： 12 ≈ 0,67
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Ο απλοποιημένος λόγος εκφράζει την απλούστερη σχέση μεταξύ των δύο μεγεθών.
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Ομοειδή Μεγέθη</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Σύγκριση Μεγεθών &amp; Μονάδες
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Όταν συγκρίνουμε ομοειδή μεγέθη, πρέπει απαραίτητα να εκφράζονται στην <strong>ίδια μονάδα μέτρησης</strong>:
                </p>

                <div className="space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                    <strong>Ομοειδή:</strong> 40 cm προς 2 m ＝ 40 cm προς 200 cm ＝ 40 ： 200 ＝ <strong>1 ： 5</strong> (καθαρός αριθμός χωρίς μονάδα).
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-950">
                    <strong>Ετεροειδή:</strong> 120 km σε 2 h ＝ 120 ： 2 ＝ <strong>60 km/h</strong> (ταχύτητα, παράγωγο μέγεθος με μονάδα).
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Ο λόγος δύο ομοειδών μεγεθών δεν έχει μονάδα μέτρησης — είναι απλώς ένας αριθμός!
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΟΠΤΙΚΟΠΟΙΗΣΗ ΛΟΓΟΥ & ΑΠΛΟΠΟΙΗΣΗ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1</span>
              </div>
              <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Δυναμικός Υπολογιστής &amp; Αναλυτής Λόγου
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Μεταβάλλετε τα στοιχεία για να δείτε τον αρχικό λόγο, την αναγωγή του μέσω ΜΚΔ, τη δεκαδική τιμή και την οπτική αντιστοίχιση.
              </p>
            </div>
          </div>

          {/* Πλέγμα Χειριστηρίων Steppers (2 Στήλες) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 2xl:gap-6">
            
            {/* 1ος Όρος (Μπλε) */}
            <div className="bg-blue-50/70 p-4 2xl:p-5 rounded-2xl border border-blue-200 space-y-2">
              <div className="h-8 flex items-center justify-between text-left">
                <span className="text-xs 2xl:text-sm font-black uppercase text-blue-900 tracking-wider">
                  1ΟΣ ΟΡΟΣ (ΜΠΛΕ ΣΤΟΙΧΕΙΑ)
                </span>
                <span className="min-w-[56px] text-center font-mono font-black text-lg text-blue-600 bg-white px-2 py-0.5 rounded-lg border border-blue-200">
                  {blueCount}
                </span>
              </div>
              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  type="button"
                  aria-label="Μείωση μπλε στοιχείων"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setBlueCount((prev) => Math.max(LIMITS.MIN_ITEMS, prev - 1));
                  }}
                  disabled={blueCount <= LIMITS.MIN_ITEMS}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                >
                  －
                </button>
                <input
                  type="range"
                  min={LIMITS.MIN_ITEMS}
                  max={LIMITS.MAX_ITEMS}
                  value={blueCount}
                  onChange={(e) => setBlueCount(Number(e.target.value))}
                  aria-label="Μπλε Στοιχεία"
                  className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                />
                <button
                  type="button"
                  aria-label="Αύξηση μπλε στοιχείων"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setBlueCount((prev) => Math.min(LIMITS.MAX_ITEMS, prev + 1));
                  }}
                  disabled={blueCount >= LIMITS.MAX_ITEMS}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                >
                  ＋
                </button>
              </div>
            </div>

            {/* 2ος Όρος (Πορτοκαλί) */}
            <div className="bg-amber-50/70 p-4 2xl:p-5 rounded-2xl border border-amber-200 space-y-2">
              <div className="h-8 flex items-center justify-between text-left">
                <span className="text-xs 2xl:text-sm font-black uppercase text-amber-900 tracking-wider">
                  2ΟΣ ΟΡΟΣ (ΠΟΡΤΟΚΑΛΙ ΣΤΟΙΧΕΙΑ)
                </span>
                <span className="min-w-[56px] text-center font-mono font-black text-lg text-amber-600 bg-white px-2 py-0.5 rounded-lg border border-amber-200">
                  {orangeCount}
                </span>
              </div>
              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  type="button"
                  aria-label="Μείωση πορτοκαλί στοιχείων"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOrangeCount((prev) => Math.max(LIMITS.MIN_ITEMS, prev - 1));
                  }}
                  disabled={orangeCount <= LIMITS.MIN_ITEMS}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                >
                  －
                </button>
                <input
                  type="range"
                  min={LIMITS.MIN_ITEMS}
                  max={LIMITS.MAX_ITEMS}
                  value={orangeCount}
                  onChange={(e) => setOrangeCount(Number(e.target.value))}
                  aria-label="Πορτοκαλί Στοιχεία"
                  className="w-full min-w-0 max-w-full accent-amber-600 cursor-pointer"
                />
                <button
                  type="button"
                  aria-label="Αύξηση πορτοκαλί στοιχείων"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOrangeCount((prev) => Math.min(LIMITS.MAX_ITEMS, prev + 1));
                  }}
                  disabled={orangeCount >= LIMITS.MAX_ITEMS}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                >
                  ＋
                </button>
              </div>
            </div>

          </div>

          {/* Οπτική Παράθεση Στοιχείων */}
          <div className="bg-slate-50 p-5 2xl:p-7 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500">
              <span>ΟΠΤΙΚΗ ΑΠΕΙΚΟΝΙΣΗ (ΣΥΝΟΛΟ: {totalItems} ΣΤΟΙΧΕΙΑ)</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-blue-600"></span>
                  <span className="text-slate-700">Μπλε ({blueCount})</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-amber-500"></span>
                  <span className="text-slate-700">Πορτοκαλί ({orangeCount})</span>
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {Array.from({ length: blueCount }).map((_, i) => (
                <span
                  key={`b-${i}`}
                  className="w-8 h-8 2xl:w-10 2xl:h-10 rounded-xl bg-blue-600 text-white font-black text-xs 2xl:text-sm flex items-center justify-center shadow-sm"
                >
                  Μ
                </span>
              ))}
              {Array.from({ length: orangeCount }).map((_, i) => (
                <span
                  key={`o-${i}`}
                  className="w-8 h-8 2xl:w-10 2xl:h-10 rounded-xl bg-amber-500 text-white font-black text-xs 2xl:text-sm flex items-center justify-center shadow-sm"
                >
                  Π
                </span>
              ))}
            </div>
            <p className="text-xs 2xl:text-sm text-slate-600 pt-1">
              💬 <strong>Σχέση Αναγωγής:</strong> Για κάθε <strong>{simpBlue}</strong> μπλε {simpBlue === 1 ? 'στοιχείο' : 'στοιχεία'}, αντιστοιχούν <strong>{simpOrange}</strong> πορτοκαλί {simpOrange === 1 ? 'στοιχείο' : 'στοιχεία'}.
            </p>
          </div>

          {/* Τελική Κάρτα Αποτελέσματος Λόγου */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-sky-950 text-white p-6 2xl:p-8 rounded-3xl text-center shadow-lg max-w-3xl mx-auto space-y-3">
            <span className="text-xs 2xl:text-sm uppercase font-black text-sky-300 tracking-wider block">
              ΑΝΑΛΥΣΗ ΚΑΙ ΤΙΜΗ ΤΟΥ ΛΟΓΟΥ
            </span>
            <div className="text-xl sm:text-3xl 2xl:text-4xl font-black font-mono flex flex-wrap items-center justify-center gap-2 sm:gap-4">
              <span>{blueCount} ： {orangeCount}</span>
              <span className="text-sky-300">＝</span>
              <span className="text-amber-300 bg-white/10 px-3 py-1 rounded-xl">
                {simpBlue} ： {simpOrange}
              </span>
              <span className="text-sky-300">≈</span>
              <span className="text-emerald-300 font-mono">
                {decimalRatio1}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-sky-100 max-w-xl mx-auto pt-1 leading-relaxed">
              {gcd1 > 1 ? (
                <>Ο λόγος απλοποιήθηκε διαιρώντας και τους δύο όρους με τον ΜΚΔ({blueCount}, {orangeCount}) ＝ <strong>{gcd1}</strong>.</>
              ) : (
                <>Ο λόγος είναι ήδη ανάγωγος, καθώς οι αριθμοί είναι πρώτοι μεταξύ τους [ΜΚΔ ＝ 1].</>
              )}
            </p>
          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΠΡΑΚΤΙΚΗ ΕΦΑΡΜΟΓΗ ΣΕ ΣΥΝΤΑΓΗ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs 2xl:text-sm font-bold text-amber-800 mb-1">
                <span>🥤 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2</span>
              </div>
              <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Πραγματική Εφαρμογή: Αναλογία σε Συνταγή Χυμού
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Όταν φτιάχνουμε έναν χυμό, ο λόγος καθορίζει τη γεύση και την πυκνότητα ανεξάρτητα από τη συνολική ποσότητα.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 2xl:gap-6">
            
            {/* Ποτήρια Χυμού */}
            <div className="bg-amber-50/70 p-4 2xl:p-5 rounded-2xl border border-amber-200 space-y-2">
              <div className="h-8 flex items-center justify-between text-left">
                <span className="text-xs 2xl:text-sm font-black uppercase text-amber-900 tracking-wider">
                  🍊 ΦΥΣΙΚΟΣ ΧΥΜΟΣ (ΠΟΤΗΡΙΑ)
                </span>
                <span className="min-w-[56px] text-center font-mono font-black text-lg text-amber-600 bg-white px-2 py-0.5 rounded-lg border border-amber-200">
                  {juiceCups}
                </span>
              </div>
              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  type="button"
                  aria-label="Μείωση ποτηριών χυμού"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setJuiceCups((prev) => Math.max(LIMITS.MIN_CUPS, prev - 1));
                  }}
                  disabled={juiceCups <= LIMITS.MIN_CUPS}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                >
                  －
                </button>
                <input
                  type="range"
                  min={LIMITS.MIN_CUPS}
                  max={LIMITS.MAX_CUPS}
                  value={juiceCups}
                  onChange={(e) => setJuiceCups(Number(e.target.value))}
                  aria-label="Ποτήρια Χυμού"
                  className="w-full min-w-0 max-w-full accent-amber-600 cursor-pointer"
                />
                <button
                  type="button"
                  aria-label="Αύξηση ποτηριών χυμού"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setJuiceCups((prev) => Math.min(LIMITS.MAX_CUPS, prev + 1));
                  }}
                  disabled={juiceCups >= LIMITS.MAX_CUPS}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                >
                  ＋
                </button>
              </div>
            </div>

            {/* Ποτήρια Νερού */}
            <div className="bg-sky-50/70 p-4 2xl:p-5 rounded-2xl border border-sky-200 space-y-2">
              <div className="h-8 flex items-center justify-between text-left">
                <span className="text-xs 2xl:text-sm font-black uppercase text-sky-900 tracking-wider">
                  💧 ΝΕΡΟ (ΠΟΤΗΡΙΑ)
                </span>
                <span className="min-w-[56px] text-center font-mono font-black text-lg text-sky-600 bg-white px-2 py-0.5 rounded-lg border border-sky-200">
                  {waterCups}
                </span>
              </div>
              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  type="button"
                  aria-label="Μείωση ποτηριών νερού"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setWaterCups((prev) => Math.max(LIMITS.MIN_CUPS, prev - 1));
                  }}
                  disabled={waterCups <= LIMITS.MIN_CUPS}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                >
                  －
                </button>
                <input
                  type="range"
                  min={LIMITS.MIN_CUPS}
                  max={LIMITS.MAX_CUPS}
                  value={waterCups}
                  onChange={(e) => setWaterCups(Number(e.target.value))}
                  aria-label="Ποτήρια Νερού"
                  className="w-full min-w-0 max-w-full accent-sky-600 cursor-pointer"
                />
                <button
                  type="button"
                  aria-label="Αύξηση ποτηριών νερού"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setWaterCups((prev) => Math.min(LIMITS.MAX_CUPS, prev + 1));
                  }}
                  disabled={waterCups >= LIMITS.MAX_CUPS}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                >
                  ＋
                </button>
              </div>
            </div>

          </div>

          {/* Μπάρα Αναλογίας & Σύνθεση */}
          <div className="bg-slate-50 p-6 2xl:p-8 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700">
              <span>ΣΥΝΘΕΣΗ ΜΕΙΓΜΑΤΟΣ ({totalCups} ΠΟΤΗΡΙΑ ΣΥΝΟΛΙΚΑ)</span>
              <div className="flex items-center gap-4">
                <span className="text-amber-700">Χυμός: {juicePercent} %</span>
                <span className="text-sky-700">Νερό: {waterPercent} %</span>
              </div>
            </div>

            {/* Visual ProgressBar */}
            <div className="h-6 w-full bg-slate-200 rounded-2xl overflow-hidden flex shadow-inner">
              <div
                style={{ width: `${juicePercent}%` }}
                className="bg-amber-500 transition-all duration-300 flex items-center justify-center text-[11px] font-bold text-white overflow-hidden"
              >
                {juicePercent >= 15 && `${juicePercent} %`}
              </div>
              <div
                style={{ width: `${waterPercent}%` }}
                className="bg-sky-400 transition-all duration-300 flex items-center justify-center text-[11px] font-bold text-white overflow-hidden"
              >
                {waterPercent >= 15 && `${waterPercent} %`}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-center">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 block">Λόγος Χυμού προς Νερό</span>
                <span className="font-mono font-bold text-slate-800 text-base sm:text-lg">
                  {juiceCups} ： {waterCups}
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 block">Ανάγωγη Μορφή</span>
                <span className="font-mono font-bold text-indigo-700 text-base sm:text-lg">
                  {simpJuice} ： {simpWater}
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 block">Τιμή Λόγου (Πυκνότητα)</span>
                <span className="font-mono font-bold text-slate-800 text-base sm:text-lg">
                  {decimalRatio2}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 5. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στον Λόγο!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε απαιτητικές ασκήσεις υπολογισμού και απλοποίησης λόγων, σύγκρισης ομοειδών και ετεροειδών μεγεθών, καθώς και σε ρεαλιστικά προβλήματα αναλογιών.
            </p>
          </div>

          <Link
            href="/st-dimotikou/40-logos-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 Έναρξη Ασκήσεων</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
