// pages/st-dimotikou/63-geometrika-motiba.js
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

export default function GeometrikaMotibaTheoryPage() {
  // Εργαστήριο 1: Αυξανόμενο Μοτίβο με Τελίτσες (n έως 20)
  const [stepN, setStepN] = useState(4);
  const [patternType, setPatternType] = useState('squares'); // 'squares' | 'triangles'

  // Υπολογισμοί για το αυξανόμενο μοτίβο
  const patternData = useMemo(() => {
    if (patternType === 'squares') {
      const count = stepN * stepN;
      const ruleText = `n · n ＝ n²`;
      return { count, ruleText, unitName: 'τελίτσες' };
    }
    const count = (stepN * (stepN + 1)) / 2;
    const ruleText = `[n · (n ＋ 1)] : 2`;
    return { count, ruleText, unitName: 'τελίτσες' };
  }, [stepN, patternType]);

  // Εργαστήριο 2: Έξυπνες Πλακοστρώσεις (Tessellations)
  const [tessellationStyle, setTessellationStyle] = useState('honeycomb'); 
  const [activePalette, setActivePalette] = useState('gold'); 

  const paletteColors = useMemo(() => {
    switch (activePalette) {
      case 'blue':
        return { c1: '#1d4ed8', c2: '#3b82f6', c3: '#93c5fd', bg: '#eff6ff' };
      case 'emerald':
        return { c1: '#047857', c2: '#10b981', c3: '#6ee7b7', bg: '#f0fdf4' };
      case 'rose':
        return { c1: '#be185d', c2: '#f43f5e', c3: '#fecdd3', bg: '#fff1f2' };
      default: // gold
        return { c1: '#92400e', c2: '#f59e0b', c3: '#fde68a', bg: '#fefce8' };
    }
  }, [activePalette]);

  return (
    <Layout
      title="Γεωμετρικά Μοτίβα - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μαθαίνουμε για τα γεωμετρικά μοτίβα, τους κανόνες επανάληψης και αύξησης, τα μοτίβα στη φύση (κηρήθρες, σπείρες) και στην τέχνη (μαίανδρος, πλακοστρώσεις)."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/63-geometrika-motiba-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 63 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Γεωμετρικά Μοτίβα: Στη Φύση &amp; στην Τέχνη
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Ανακαλύπτουμε την ομορφιά της γεωμετρικής επανάληψης: πώς ένας απλός κανόνας δημιουργεί αρμονία, πώς προβλέπουμε τα επόμενα στοιχεία μιας ακολουθίας, και πώς τα γεωμετρικά μοτίβα εμφανίζονται παντού γύρω μας — από τις <strong>κηρήθρες των μελισσών</strong> και τις νιφάδες χιονιού, μέχρι τον <strong>αρχαιοελληνικό μαίανδρο</strong> και τα περίτεχνα ψηφιδωτά.
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία, Κανόνες Ακολουθιών, Διαδραστική Πλακόστρωση &amp; Γεννήτρια Τελειών</span>
            </div>
            <Link
              href="/st-dimotikou/63-geometrika-motiba-ask"
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
              Η Έννοια του Μοτίβου σε 4 Βήματα
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Από την απλή επανάληψη σχημάτων μέχρι τους μαθηματικούς κανόνες και τις εφαρμογές στον κόσμο.
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
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Βασικός Ορισμός</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Τι είναι Γεωμετρικό Μοτίβο;
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  <strong>Γεωμετρικό μοτίβο</strong> ονομάζεται μια διάταξη σχημάτων ή γραμμών που επαναλαμβάνεται ακολουθώντας έναν συγκεκριμένο και σταθερό <strong>κανόνα</strong>.
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2">
                  <div>• <strong>Πυρήνας Μοτίβου:</strong> Το βασικό κομμάτι σχημάτων που επαναλαμβάνεται αυτούσιο.</div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200 font-mono text-center text-blue-900 font-bold">
                    🔺 🟦 🟢 ➔ 🔺 🟦 🟢 ➔ 🔺 🟦 🟢
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    Εδώ ο πυρήνας έχει 3 σχήματα. Το 4ο σχήμα είναι πάλι 🔺, το 5ο 🟦 κ.ο.κ.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Εντοπίζοντας τον πυρήνα του μοτίβου, μπορούμε να προβλέψουμε ποιο σχήμα θα βρίσκεται σε οποιαδήποτε μελλοντική θέση!
              </div>
            </article>

            {/* ΒΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Μαθηματικός Κανόνας</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Αυξανόμενα Μοτίβα &amp; Τύποι
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Σε πολλά μοτίβα τα σχήματα δεν επαναλαμβάνονται απλώς, αλλά <strong>μεγαλώνουν σε κάθε βήμα</strong> ακολουθώντας έναν μαθηματικό κανόνα:
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1.5 font-mono">
                  <div>• <strong>Βήμα 1:</strong> 1 τελίτσα (1 · 1 ＝ 1)</div>
                  <div>• <strong>Βήμα 2:</strong> 4 τελίτσες (2 · 2 ＝ 4)</div>
                  <div>• <strong>Βήμα 3:</strong> 9 τελίτσες (3 · 3 ＝ 9)</div>
                  <div className="text-amber-900 font-bold pt-1 font-sans text-xs">
                    Κανόνας για το βήμα n: <strong>Πλήθος ＝ n · n</strong>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Με τη βοήθεια μιας μεταβλητής n, βρίσκουμε πόσες τελίτσες χρειάζονται ακόμα και για το 100ό βήμα χωρίς να τις σχεδιάσουμε!
              </div>
            </article>

            {/* ΒΗΜΑ 3 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Φυσικός Κόσμος</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Γεωμετρικά Μοτίβα στη Φύση
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Η φύση είναι γεμάτη από ιδιοφυή γεωμετρικά μοτίβα που εξυπηρετούν την οικονομία χώρου και υλικών:
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2">
                  <div>
                    🐝 <strong>Κηρήθρα Μελισσών:</strong> Κανονικά εξάγωνα που καλύπτουν πλήρως τον χώρο χωρίς κενά, χρησιμοποιώντας το ελάχιστο κερί.
                  </div>
                  <div>
                    🌻 <strong>Ηλιοτρόπια &amp; Κοχύλια:</strong> Σπείρες που ακολουθούν την περίφημη μαθηματική ακολουθία Fibonacci.
                  </div>
                  <div>
                    ❄️️ <strong>Νιφάδες Χιονιού:</strong> Εξαγωνική συμμετρία κρυστάλλων.
                  </div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Το κανονικό εξάγωνο είναι το ιδανικό σχήμα για πλακόστρωση χωρίς απώλεια χώρου!
              </div>
            </article>

            {/* ΒΗΜΑ 4 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Πολιτισμός &amp; Τέχνη</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Μοτίβα στην Τέχνη &amp; Πλακοστρώσεις
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Από την αρχαιότητα, οι άνθρωποι διακοσμούσαν ναούς, αγγεία και υφάσματα με γεωμετρικά μοτίβα:
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2">
                  <div>
                    🏛 <strong>Ελληνικός Μαίανδρος:</strong> Συνεχής γραμμή που διπλώνει σε ορθές γωνίες, σύμβολο της αιωνιότητας και της ροής.
                  </div>
                  <div>
                    🎨 <strong>Πλακόστρωση (Tessellation):</strong> Κάλυψη επιφάνειας με σχήματα χωρίς κενά και χωρίς επικαλύψεις (όπως τα πλακάκια του δαπέδου ή τα έργα του M.C. Escher).
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Μόνο τρία κανονικά πολύγωνα μπορούν μόνα τους να πλακοστρώσουν το επίπεδο: το <strong>ισόπλευρο τρίγωνο</strong>, το <strong>τετράγωνο</strong> και το <strong>κανονικό εξάγωνο</strong>!
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΑΥΞΑΝΟΜΕΝΟ ΜΟΤΙΒΟ ΜΕ ΤΕΛΙΤΣΕΣ (n έως 20) */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1</span>
            </div>
            <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Διαδραστική Γεννήτρια Αυξανόμενου Μοτίβου (Τελίτσες έως n ＝ 20)
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Ρύθμισε το βήμα (n από 1 έως 20) και δες πώς οι τελίτσες διατάσσονται σε τετράγωνα ή τριγωνικά μοτίβα και πώς αυξάνεται ραγδαία το πλήθος τους.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">

            {/* Χειριστήρια Ρύθμισης (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Επιλογή Τύπου Μοτίβου */}
              <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-700 block uppercase">
                  ΔΙΑΤΑΞΗ ΤΕΛΙΤΣΩΝ:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPatternType('squares')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs sm:text-sm border transition touch-manipulation ${
                      patternType === 'squares'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    🟦 Τετραγωνικό (n²)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPatternType('triangles')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs sm:text-sm border transition touch-manipulation ${
                      patternType === 'triangles'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    🔺 Τριγωνικό
                  </button>
                </div>
              </div>

              {/* Slider για το Βήμα n (1 έως 20) */}
              <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-blue-900 tracking-wider">
                    ΒΗΜΑ (n από 1 έως 20):
                  </span>
                  <span className="font-mono font-black text-base sm:text-xl text-blue-700 bg-white px-3 py-1 rounded-xl border border-blue-200 shadow-sm">
                    n ＝ {stepN}
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Μείωση βήματος"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setStepN((prev) => Math.max(1, prev - 1)); }}
                    disabled={stepN <= 1}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={1}
                    max={20}
                    step={1}
                    value={stepN}
                    onChange={(e) => setStepN(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer touch-manipulation"
                  />
                  <button
                    type="button"
                    aria-label="Αύξηση βήματος"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setStepN((prev) => Math.min(20, prev + 1)); }}
                    disabled={stepN >= 20}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Γρήγορες Επιλογές Βήματος */}
              <div className="grid grid-cols-4 gap-2">
                {[1, 5, 10, 20].map((quickStep) => (
                  <button
                    key={`qstep-${quickStep}`}
                    type="button"
                    onClick={() => setStepN(quickStep)}
                    className="bg-white border border-slate-200 hover:bg-slate-100 py-1.5 rounded-xl font-bold text-xs text-slate-700 shadow-xs transition active:scale-95 touch-manipulation text-center"
                  >
                    n ＝ {quickStep}
                  </button>
                ))}
              </div>

              {/* Κάρτα Σύνοψης */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1 text-center font-mono">
                <span className="text-xs font-sans text-slate-500 block">Μαθηματικός Κανόνας:</span>
                <div className="text-base sm:text-lg font-black text-blue-700">{patternData.ruleText}</div>
                <div className="text-xs sm:text-sm text-slate-700 pt-1">
                  Για n ＝ {stepN}: <strong className="text-blue-800 text-base">{formatNum(patternData.count)}</strong> {patternData.unitName}
                </div>
              </div>

            </div>

            {/* SVG Οπτικοποίηση Αυξανόμενου Μοτίβου Τελειών (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 flex flex-col items-center justify-center space-y-3 min-h-[320px]">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                ΟΠΤΙΚΟΠΟΙΗΣΗ ΤΕΛΕΙΩΝ (ΒΗΜΑ {stepN})
              </span>

              <div className="w-full max-w-[340px] aspect-square bg-white rounded-2xl border border-slate-200 p-3 shadow-inner flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 240 240" className="w-full h-full overflow-visible">
                  {patternType === 'squares' ? (() => {
                    // Δυναμικός υπολογισμός διαστάσεων για τελίτσες
                    const spacing = 200 / (stepN + 1);
                    const dotRadius = Math.max(2.2, Math.min(6, spacing / 2.8));
                    const startX = 120 - ((stepN - 1) * spacing) / 2;
                    const startY = 120 - ((stepN - 1) * spacing) / 2;

                    const dots = [];
                    for (let r = 0; r < stepN; r++) {
                      for (let c = 0; c < stepN; c++) {
                        dots.push(
                          <circle
                            key={`sq-dot-${r}-${c}`}
                            cx={startX + c * spacing}
                            cy={startY + r * spacing}
                            r={dotRadius}
                            fill="#3b82f6"
                            stroke="#1d4ed8"
                            strokeWidth={dotRadius > 3 ? "1.5" : "0.8"}
                          />
                        );
                      }
                    }
                    return dots;
                  })() : (() => {
                    // Τριγωνική διάταξη τελειών
                    const spacing = 200 / (stepN + 1);
                    const dotRadius = Math.max(2.2, Math.min(6, spacing / 2.8));
                    const totalH = (stepN - 1) * spacing;
                    const topY = 120 - totalH / 2;

                    const dots = [];
                    for (let r = 0; r < stepN; r++) {
                      const countInRow = r + 1;
                      const rowY = topY + r * spacing;
                      const rowStartX = 120 - ((countInRow - 1) * spacing) / 2;
                      for (let c = 0; c < countInRow; c++) {
                        dots.push(
                          <circle
                            key={`tr-dot-${r}-${c}`}
                            cx={rowStartX + c * spacing}
                            cy={rowY}
                            r={dotRadius}
                            fill="#6366f1"
                            stroke="#4338ca"
                            strokeWidth={dotRadius > 3 ? "1.5" : "0.8"}
                          />
                        );
                      }
                    }
                    return dots;
                  })()}
                </svg>
              </div>

              <div className="text-xs sm:text-sm font-mono font-bold text-slate-700 text-center">
                Σύνολο: <strong className="text-blue-700">{formatNum(patternData.count)}</strong> {patternData.unitName}
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΠΛΑΚΟΣΤΡΩΣΗ (TESSELLATION) */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
              <span>🎨 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΕΞΥΠΝΑ ΜΟΤΙΒΑ</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Πλακόστρωση του Επιπέδου: Φύση, Τέχνη &amp; Αρχιτεκτονική
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Επίλεξε έξυπνα στυλ πλακόστρωσης και άλλαξε χρωματική παλέτα για να δεις τη μαγεία της τέλειας γεωμετρικής επανάληψης χωρίς κενά:
            </p>
          </div>

          <div className="space-y-6">
            
            {/* Επιλογές Στυλ & Χρωμάτων */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-center">
                <span className="text-xs font-bold text-slate-600 uppercase mr-1 hidden sm:block">ΜΟΤΙΒΟ:</span>
                <button
                  type="button"
                  onClick={() => setTessellationStyle('honeycomb')}
                  className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border transition touch-manipulation ${
                    tessellationStyle === 'honeycomb'
                      ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  🐝 Κηρήθρα (Εξάγωνα)
                </button>
                <button
                  type="button"
                  onClick={() => setTessellationStyle('herringbone')}
                  className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border transition touch-manipulation ${
                    tessellationStyle === 'herringbone'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  🧱 Ψαροκόκαλο (Παρκέ)
                </button>
                <button
                  type="button"
                  onClick={() => setTessellationStyle('meander')}
                  className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border transition touch-manipulation ${
                    tessellationStyle === 'meander'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  🏛️ Ελληνικός Μαίανδρος
                </button>
                <button
                  type="button"
                  onClick={() => setTessellationStyle('checker')}
                  className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border transition touch-manipulation ${
                    tessellationStyle === 'checker'
                      ? 'bg-slate-800 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  🏁 Σκακιέρα
                </button>
                <button
                  type="button"
                  onClick={() => setTessellationStyle('triangles')}
                  className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border transition touch-manipulation ${
                    tessellationStyle === 'triangles'
                      ? 'bg-rose-500 text-white border-rose-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  🔺 Τριγωνικό Πλέγμα
                </button>
              </div>

              <div className="flex items-center gap-3 bg-white p-2 px-4 rounded-xl border border-slate-200 w-full lg:w-auto justify-center">
                <span className="text-xs font-bold text-slate-600 uppercase">ΠΑΛΕΤΑ:</span>
                <button
                  type="button"
                  onClick={() => setActivePalette('gold')}
                  className={`w-7 h-7 rounded-full bg-amber-500 border-2 transition active:scale-95 ${activePalette === 'gold' ? 'border-slate-900 ring-2 ring-amber-300' : 'border-white shadow-xs'}`}
                  title="Χρυσή παλέτα"
                />
                <button
                  type="button"
                  onClick={() => setActivePalette('blue')}
                  className={`w-7 h-7 rounded-full bg-blue-600 border-2 transition active:scale-95 ${activePalette === 'blue' ? 'border-slate-900 ring-2 ring-blue-300' : 'border-white shadow-xs'}`}
                  title="Μπλε παλέτα"
                />
                <button
                  type="button"
                  onClick={() => setActivePalette('emerald')}
                  className={`w-7 h-7 rounded-full bg-emerald-600 border-2 transition active:scale-95 ${activePalette === 'emerald' ? 'border-slate-900 ring-2 ring-emerald-300' : 'border-white shadow-xs'}`}
                  title="Πράσινη παλέτα"
                />
                <button
                  type="button"
                  onClick={() => setActivePalette('rose')}
                  className={`w-7 h-7 rounded-full bg-rose-600 border-2 transition active:scale-95 ${activePalette === 'rose' ? 'border-slate-900 ring-2 ring-rose-300' : 'border-white shadow-xs'}`}
                  title="Κόκκινη παλέτα"
                />
              </div>
            </div>

            {/* Πλαίσιο SVG Πλακόστρωσης - Άψογο Seamless Tiling χωρίς περιττές γραμμές */}
            <div className="w-full h-56 sm:h-80 rounded-3xl border border-slate-300 shadow-inner overflow-hidden flex items-center justify-center relative transition-colors duration-500" style={{ backgroundColor: paletteColors.bg }}>
              <svg width="100%" height="100%" className="w-full h-full">
                <defs>
                  {/* Pattern 1: Κηρήθρα (Εξάγωνα) - Μαθηματικά ακριβές ενιαίο μονοπάτι χωρίς κενά */}
                  <pattern id="pat-honeycomb" width="60" height="34.641" patternUnits="userSpaceOnUse">
                    <rect width="60" height="34.641" fill={paletteColors.c3} fillOpacity="0.85" />
                    <path
                      d="M 10 0 L 20 17.32 L 10 34.64 M 20 17.32 L 40 17.32 M 50 0 L 40 17.32 L 50 34.64"
                      fill="none"
                      stroke={paletteColors.c1}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </pattern>

                  {/* Pattern 2: Ψαροκόκαλο (Herringbone) */}
                  <pattern id="pat-herringbone" width="40" height="40" patternUnits="userSpaceOnUse">
                    <rect width="40" height="40" fill={paletteColors.bg} />
                    <path
                      d="M 0 0 L 20 20 L 0 40 M 20 0 L 40 20 L 20 40 M 40 0 L 60 20 L 40 40"
                      fill="none"
                      stroke={paletteColors.c1}
                      strokeWidth="3"
                      strokeLinecap="square"
                    />
                    <path
                      d="M 0 20 L 20 0 M 20 40 L 40 20 M 0 40 L 20 20"
                      fill="none"
                      stroke={paletteColors.c2}
                      strokeWidth="2"
                    />
                  </pattern>

                  {/* Pattern 3: Αρχαίος Ελληνικός Μαίανδρος */}
                  <pattern id="pat-meander" width="60" height="60" patternUnits="userSpaceOnUse">
                    <rect width="60" height="60" fill={paletteColors.bg} />
                    <path
                      d="M 0 30 L 15 30 L 15 15 L 45 15 L 45 45 L 30 45 L 30 30 L 0 30 M 45 15 L 60 15 M 15 45 L 30 45"
                      fill="none"
                      stroke={paletteColors.c1}
                      strokeWidth="3.5"
                      strokeLinecap="square"
                    />
                  </pattern>

                  {/* Pattern 4: Σκακιέρα */}
                  <pattern id="pat-checker" width="40" height="40" patternUnits="userSpaceOnUse">
                    <rect width="20" height="20" fill={paletteColors.c1} />
                    <rect x="20" width="20" height="20" fill={paletteColors.c3} />
                    <rect y="20" width="20" height="20" fill={paletteColors.c3} />
                    <rect x="20" y="20" width="20" height="20" fill={paletteColors.c1} />
                  </pattern>

                  {/* Pattern 5: Τριγωνικό Πλέγμα */}
                  <pattern id="pat-triangles" width="40" height="34.641" patternUnits="userSpaceOnUse">
                    <rect width="40" height="34.641" fill={paletteColors.c3} />
                    <polygon points="0,0 40,0 20,34.641" fill={paletteColors.c2} stroke={paletteColors.c1} strokeWidth="1.5" />
                    <polygon points="20,0 0,34.641 40,34.641" fill={paletteColors.bg} stroke={paletteColors.c1} strokeWidth="1.5" opacity="0.6" />
                  </pattern>
                </defs>

                <rect
                  width="100%"
                  height="100%"
                  fill={
                    tessellationStyle === 'honeycomb'
                      ? 'url(#pat-honeycomb)'
                      : tessellationStyle === 'herringbone'
                      ? 'url(#pat-herringbone)'
                      : tessellationStyle === 'meander'
                      ? 'url(#pat-meander)'
                      : tessellationStyle === 'checker'
                      ? 'url(#pat-checker)'
                      : 'url(#pat-triangles)'
                  }
                />
              </svg>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center font-sans text-xs sm:text-sm text-slate-700">
              💡 <strong>Γεωμετρική Αρχή:</strong> Σε μια πλακόστρωση (tessellation), το άθροισμα των γωνιών των σχημάτων γύρω από κάθε κοινή κορυφή πρέπει να είναι <strong>ακριβώς 360°</strong>. Στα κανονικά εξάγωνα της κηρήθρας: 120° · 3 ＝ 360°!
            </div>
          </div>
        </section>

        {/* 5. ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ ΚΑΘΗΜΕΡΙΝΗΣ ΖΩΗΣ */}
        <section className="space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight">
              Λυμένα Προβλήματα με Γεωμετρικά Μοτίβα
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Αναλυτικοί υπολογισμοί για πρόβλεψη μελλοντικών στοιχείων και εύρεση μαθηματικών κανόνων.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ΠΡΟΒΛΗΜΑ 1 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-900 text-xs font-black rounded-lg uppercase">
                  ΠΡΟΒΛΗΜΑ 1: ΑΥΞΑΝΟΜΕΝΟ ΜΟΤΙΒΟ
                </span>
                <span className="text-xs font-bold text-slate-400">Κατασκευή με Σπίρτα</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Πρόβλεψη Πλήθους για το 20ό Σχήμα
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Σχηματίζουμε μια σειρά από ενωμένα τετράγωνα με σπίρτα: Το 1ο τετράγωνο χρειάζεται <strong>4</strong> σπίρτα. Κάθε επόμενο τετράγωνο που κολλάει δίπλα του χρειάζεται <strong>3</strong> επιπλέον σπίρτα (αφού μοιράζονται μία κοινή πλευρά). Πόσα σπίρτα θα χρειαστούν για να φτιάξουμε <strong>20</strong> ενωμένα τετράγωνα;
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΠΑΡΑΤΗΡΗΣΗ ΒΗΜΑΤΩΝ
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">1ο τετράγωνο</span> 4 σπίρτα
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">2 τετράγωνα</span> 4 ＋ 3 ＝ 7
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">3 τετράγωνα</span> 4 ＋ 3 ＋ 3 ＝ 10
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήματα Επίλυσης:</span>
                  <div>• <strong>Κανόνας για n τετράγωνα:</strong> 1 ＋ (3 · n) ή ισοδύναμα 4 ＋ 3 · (n － 1).</div>
                  <div>• <strong>Για n ＝ 20 τετράγωνα:</strong> 1 ＋ (3 · 20) ＝ 1 ＋ 60 ＝ <strong className="text-blue-700">61 σπίρτα</strong>.</div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 font-medium">
                💡 Βρίσκοντας τον μαθηματικό τύπο <strong>3 · n ＋ 1</strong>, αποφεύγουμε τη μέτρηση ένα-ένα!
              </div>
            </article>

            {/* ΠΡΟΒΛΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-lg uppercase">
                  ΠΡΟΒΛΗΜΑ 2: ΕΠΑΝΑΛΑΜΒΑΝΟΜΕΝΟ ΜΟΤΙΒΟ
                </span>
                <span className="text-xs font-bold text-slate-400">Ευκλείδεια Διαίρεση</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Εύρεση του 47ου Στοιχείου μιας Ακολουθίας
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Σε μια διακοσμητική μπορντούρα τοποθετούνται σχήματα με την εξής σειρά που επαναλαμβάνεται συνεχώς: <strong>Τρίγωνο, Κύκλος, Τετράγωνο, Ρόμβος</strong> (πυρήνας 4 σχημάτων). Ποιο σχήμα θα βρίσκεται στην <strong>47η θέση</strong>;
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΠΥΡΗΝΑΣ ΕΠΑΝΑΛΗΨΗΣ (ΜΗΚΟΣ 4)
                </span>
                <div className="grid grid-cols-4 gap-2 text-center font-mono font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Θέση 1</span> 🔺 Τρίγωνο
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Θέση 2</span> 🟢 Κύκλος
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Θέση 3</span> 🟦 Τετράγωνο
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Θέση 4</span> 🔶 Ρόμβος
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήματα Επίλυσης:</span>
                  <div>• <strong>Διαίρεση θέσης με το μήκος του πυρήνα:</strong> 47 : 4 ＝ 11 με <strong>υπόλοιπο 3</strong>.</div>
                  <div>• Ο πυρήνας των 4 σχημάτων θα επαναληφθεί 11 ολόκληρες φορές.</div>
                  <div>• Το υπόλοιπο 3 σημαίνει ότι το 47ο στοιχείο είναι το 3ο του πυρήνα: <strong className="text-amber-700">Τετράγωνο (🟦)</strong>.</div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 font-medium">
                ⚡ Αν το υπόλοιπο ήταν 0, το στοιχείο θα ήταν το τελευταίο του πυρήνα (δηλαδή ο Ρόμβος).
              </div>
            </article>

          </div>
        </section>

        {/* 6. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στα Γεωμετρικά Μοτίβα!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε 10 διαδραστικές ασκήσεις με πρόβλεψη σχημάτων, αυξανόμενα μοτίβα, πλακοστρώσεις και μοτίβα στη φύση για τη ΣΤ' Δημοτικού.
            </p>
          </div>

          <Link
            href="/st-dimotikou/63-geometrika-motiba-ask"
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
