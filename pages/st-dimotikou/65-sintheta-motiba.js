// pages/st-dimotikou/65-sintheta-motiba.js
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

export default function SinthetaMotibaTheoryPage() {
  // Εργαστήριο 1: Μηχανή Σύνθετου Κανόνα (a · n + b)
  const [multA, setMultA] = useState(3);
  const [addB, setAddB] = useState(2);
  const [calcN, setCalcN] = useState(5);

  const complexSequence = useMemo(() => {
    const list = [];
    for (let i = 1; i <= Math.max(calcN, 7); i++) {
      list.push({ n: i, val: multA * i + addB });
    }
    return list;
  }, [multA, addB, calcN]);

  const targetVal = multA * calcN + addB;

  // Εργαστήριο 2: Πίνακας Σύνδεσης Δύο Μεγεθών («Πόσο Μεγάλωσες!»)
  // Αρχικό ύψος 75 cm στο έτος 1, ετήσια αύξηση με επιβραδυνόμενο μοτίβο
  const [selectedAge, setSelectedAge] = useState(6);

  const growthTable = useMemo(() => {
    // Μοτίβο ανάπτυξης: 75cm (έτος 1), +12 (έτος 2), +10 (έτος 3), +8 (έτος 4), +6 (έτος 5), +6 (έτος 6), +6 (έτος 7)...
    const yearlyGains = [0, 75, 12, 10, 8, 6, 6, 6, 5, 5, 5];
    let runningHeight = 0;
    const table = [];
    for (let age = 1; age <= 10; age++) {
      if (age === 1) {
        runningHeight = 75;
      } else {
        runningHeight += yearlyGains[age];
      }
      table.push({ age, gain: yearlyGains[age], height: runningHeight });
    }
    return table;
  }, []);

  const currentGrowth = growthTable.find(g => g.age === selectedAge) || growthTable[0];

  return (
    <Layout
      title="Σύνθετα Μοτίβα - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μαθαίνουμε για τα σύνθετα μοτίβα, τους διπλούς κανόνες, τις σχέσεις δύο μεγεθών σε πίνακες τιμών και πώς προβλέπουμε μελλοντικές τιμές για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/65-sintheta-motiba-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 65 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Σύνθετα Μοτίβα &amp; Σχέσεις Μεγεθών
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Προχωράμε πέρα από τα απλά μοτίβα: ανακαλύπτουμε ακολουθίες με <strong>διπλούς κανόνες</strong> (πολλαπλασιασμό και πρόσθεση μαζί), <strong>εναλλασσόμενα βήματα</strong>, και μαθαίνουμε πώς να οργανώνουμε <strong>πίνακες δύο μεγεθών</strong> (όπως χρόνος και ανάπτυξη) για να ανακαλύπτουμε κρυμμένες μαθηματικές σχέσεις!
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία, Διπλοί Κανόνες, Πίνακες Μεγεθών &amp; Διαδραστική Μηχανή</span>
            </div>
            <Link
              href="/st-dimotikou/65-sintheta-motiba-ask"
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
              Τα Σύνθετα Μοτίβα σε 4 Βήματα
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Από τον απλό συνδυασμό πράξεων μέχρι τους πίνακες παρατήρησης της πραγματικής ζωής.
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
                  Τι είναι Σύνθετο Μοτίβο;
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Σε ένα απλό μοτίβο έχουμε ένα μόνο σταθερό βήμα (π.χ. πάντα $+3$). Στο <strong>σύνθετο μοτίβο</strong> ο κανόνας συνδυάζει <strong>δύο πράξεις</strong> ή το βήμα <strong>αλλάζει διαδοχικά</strong>:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 font-mono">
                  <div>• <strong>Παράδειγμα:</strong> 1, 3, 7, 15, 31, ...</div>
                  <div className="text-blue-900 font-bold">
                    Κανόνας: «Πολλαπλασιάζω επί 2 και προσθέτω 1» (· 2 ＋ 1).
                  </div>
                  <div className="text-slate-600 text-[11px] font-sans">
                    1 · 2 ＋ 1 ＝ 3 ➔ 3 · 2 ＋ 1 ＝ 7 ➔ 7 · 2 ＋ 1 ＝ 15.
                  </div>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Όταν η διαφορά των αριθμών δεν είναι σταθερή, αναζητούμε συνδυασμό πολλαπλασιασμού με πρόσθεση/αφαίρεση!
              </div>
            </article>

            {/* ΒΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Εναλλαγή</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Εναλλασσόμενοι Κανόνες
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Σε ορισμένες ακολουθίες, οι πράξεις <strong>εναλλάσσονται κυκλικά</strong> από όρο σε όρο:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 font-mono">
                  <div>• <strong>Ακολουθία:</strong> 2, 6, 5, 15, 14, 42, 41, ...</div>
                  <div className="text-amber-900 font-bold">
                    Κανόνας: «· 3» και μετά «－ 1»!
                  </div>
                  <div className="text-slate-600 text-[11px] font-sans">
                    2 · 3 ＝ 6 ➔ 6 － 1 ＝ 5 ➔ 5 · 3 ＝ 15 ➔ 15 － 1 ＝ 14.
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Για να λύσουμε ένα τέτοιο μοτίβο, χωρίζουμε τους όρους σε ζεύγη και ελέγχουμε τη διαδοχή των πράξεων!
              </div>
            </article>

            {/* ΒΗΜΑ 3 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Πίνακες Τιμών</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Σχέση Δύο Μεγεθών
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Στην πραγματικότητα (π.χ. ανάπτυξη παιδιού, κόστος τηλεφώνου), οργανώνουμε τα δεδομένα σε <strong>πίνακα δύο γραμμών</strong>:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2">
                  <div className="grid grid-cols-4 gap-1 text-center font-mono text-[11px]">
                    <span className="font-bold text-slate-500">Χρόνος (έτη):</span>
                    <span className="bg-white p-1 rounded border">1</span>
                    <span className="bg-white p-1 rounded border">2</span>
                    <span className="bg-white p-1 rounded border">3</span>
                    <span className="font-bold text-slate-500">Ύψος (cm):</span>
                    <span className="bg-white p-1 rounded border text-indigo-700 font-bold">75</span>
                    <span className="bg-white p-1 rounded border text-indigo-700 font-bold">87</span>
                    <span className="bg-white p-1 rounded border text-indigo-700 font-bold">97</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-sans">
                    Παρατηρούμε το <strong>ετήσιο κέρδος</strong> (75 ➔ +12 ➔ +10) για να δούμε πώς εξελίσσεται το μέγεθος.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Ο πίνακας μας βοηθά να εντοπίσουμε σχέσεις που δεν φαίνονται με μια απλή ματιά.
              </div>
            </article>

            {/* ΒΗΜΑ 4 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Πρόβλεψη</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Γενικός Τύπος &amp; Προβλέψεις
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Όταν εκφράσουμε τη σχέση με τύπο της μορφής <strong>α · ν ＋ β</strong>, μπορούμε να κάνουμε υπολογισμούς για το μέλλον:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 font-mono text-center">
                  <div className="text-emerald-900 font-bold">
                    Κόστος Ταξί: 3 € πάγιο ＋ 2 € ανά χιλιόμετρο
                  </div>
                  <div className="text-blue-700 font-black text-sm">
                    Κόστος (ν χλμ) ＝ 2 · ν ＋ 3
                  </div>
                  <div className="text-slate-600 text-[11px] font-sans text-left pt-1">
                    Για διαδρομή ν ＝ 15 χλμ:<br />
                    2 · 15 ＋ 3 ＝ 30 ＋ 3 ＝ <strong>33 €</strong>!
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Τα σύνθετα μοτίβα είναι η γέφυρα ανάμεσα στην αριθμητική του Δημοτικού και την άλγεβρα του Γυμνασίου!
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΜΗΧΑΝΗ ΣΥΝΘΕΤΟΥ ΚΑΝΟΝΑ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1</span>
            </div>
            <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Διαδραστική Μηχανή Σύνθετου Κανόνα (α · ν ＋ β)
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Επίλεξε τον πολλαπλασιαστή (α) και την προσθήκη (β) για να δημιουργήσεις τον δικό σου σύνθετο κανόνα και υπολόγισε απευθείας τη θέση ν:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">

            {/* Χειριστήρια (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Ρύθμιση Πολλαπλασιαστή α */}
              <div className="bg-blue-50/70 p-3.5 sm:p-4 rounded-2xl border border-blue-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-blue-900">
                  <span>Πολλαπλασιαστής (α):</span>
                  <span className="font-mono text-base font-black text-blue-700 bg-white px-2.5 py-0.5 rounded-lg border border-blue-200">
                    {multA}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={6}
                  step={1}
                  value={multA}
                  onChange={(e) => setMultA(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer touch-manipulation"
                />
              </div>

              {/* Ρύθμιση Σταθερού Όρου β */}
              <div className="bg-amber-50/70 p-3.5 sm:p-4 rounded-2xl border border-amber-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-amber-900">
                  <span>Σταθερή Προσθήκη (β):</span>
                  <span className="font-mono text-base font-black text-amber-700 bg-white px-2.5 py-0.5 rounded-lg border border-amber-200">
                    ＋ {addB}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={1}
                  value={addB}
                  onChange={(e) => setAddB(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer touch-manipulation"
                />
              </div>

              {/* Επιλογή Θέσης ν */}
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>Ζητούμενη Θέση (ν):</span>
                  <span className="font-mono text-base font-black text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-indigo-200">
                    ν ＝ {calcN}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  step={1}
                  value={calcN}
                  onChange={(e) => setCalcN(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
              </div>

              {/* Τελικός Τύπος */}
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-1 font-mono">
                <span className="text-[11px] font-sans text-emerald-800 block font-bold">
                  Γενικός Τύπος: {multA} · ν {addB > 0 ? `＋ ${addB}` : ''}
                </span>
                <div className="text-xl sm:text-2xl font-black text-emerald-700">
                  Τιμή για ν ＝ {calcN}: {formatNum(targetVal)}
                </div>
              </div>

            </div>

            {/* Πίνακας Παραγόμενων Όρων (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-4">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block text-center">
                ΟΙ ΠΡΩΤΟΙ ΟΡΟΙ ΤΟΥ ΣΥΝΘΕΤΟΥ ΜΟΤΙΒΟΥ
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {complexSequence.slice(0, 8).map((item) => {
                  const isCurrent = item.n === calcN;
                  return (
                    <div
                      key={`comp-${item.n}`}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        isCurrent
                          ? 'bg-indigo-600 text-white border-indigo-700 shadow-md ring-2 ring-indigo-300 scale-105'
                          : 'bg-white border-slate-200 text-slate-800 shadow-xs'
                      }`}
                    >
                      <span className={`text-[10px] block font-sans uppercase font-bold ${isCurrent ? 'text-indigo-200' : 'text-slate-400'}`}>
                        Θέση ν ＝ {item.n}
                      </span>
                      <span className="font-mono text-base sm:text-lg font-black block mt-0.5">
                        {item.val}
                      </span>
                      <span className={`text-[10px] block font-mono mt-0.5 ${isCurrent ? 'text-indigo-100' : 'text-slate-500'}`}>
                        ({multA} · {item.n} ＋ {addB})
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="p-3.5 bg-white rounded-2xl border border-slate-200 font-sans text-xs sm:text-sm text-slate-700 space-y-1 text-center">
                💡 <strong>Υπολογισμός Θέσης {calcN}:</strong> ({multA} · {calcN}) ＋ {addB} ＝ {multA * calcN} ＋ {addB} ＝ <strong>{targetVal}</strong>!
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΠΟΣΟ ΜΕΓΑΛΩΣΕΣ (ΠΙΝΑΚΑΣ ΔΥΟ ΜΕΓΕΘΩΝ) */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
              <span>📈 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΠΙΝΑΚΑΣ ΕΞΕΛΙΞΗΣ</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              «Πόσο Μεγάλωσες!»: Συσχέτιση Ηλικίας &amp; Ύψους
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Παρακολούθησε πώς μεταβάλλεται το ύψος ενός παιδιού από έτος σε έτος και δες πώς διαβάζουμε σύνθετα μοτίβα μέσα από πραγματικούς πίνακες:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

            {/* Slider Ηλικίας & Στοιχεία (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>ΕΠΙΛΟΓΗ ΗΛΙΚΙΑΣ (ΕΤΗ):</span>
                  <span className="font-mono text-base font-black text-emerald-700 bg-white px-3 py-1 rounded-xl border border-emerald-200">
                    {selectedAge} ετών
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={selectedAge}
                  onChange={(e) => setSelectedAge(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer touch-manipulation"
                />
              </div>

              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 space-y-2 text-center">
                <span className="text-xs text-emerald-900 block font-bold">
                  Στοιχεία στο {selectedAge}ο Έτος:
                </span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-800 font-mono">
                  {currentGrowth.height} cm
                </div>
                <p className="text-xs text-slate-600 font-sans">
                  {selectedAge === 1 
                    ? 'Αρχικό ύψος στο 1ο έτος ζωής.' 
                    : `Αύξηση κατά ＋${currentGrowth.gain} cm σε σχέση με το προηγούμενο έτος.`}
                </p>
              </div>
            </div>

            {/* Οπτικός Πίνακας Μεγεθών (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-3">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block text-center">
                ΠΙΝΑΚΑΣ ΤΙΜΩΝ (ΕΤΗ 1 ΕΩΣ 10)
              </span>

              <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-xs">
                <table className="w-full text-xs text-center font-mono">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="p-2 text-left font-sans">Ηλικία (έτη)</th>
                      {growthTable.map(g => (
                        <th key={`th-${g.age}`} className={`p-2 ${g.age === selectedAge ? 'bg-emerald-100 text-emerald-900 font-black' : ''}`}>
                          {g.age}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="p-2 text-left font-sans font-bold text-slate-700">Ύψος (cm)</td>
                      {growthTable.map(g => (
                        <td key={`td-h-${g.age}`} className={`p-2 font-bold ${g.age === selectedAge ? 'bg-emerald-50 text-emerald-700 font-black' : 'text-slate-800'}`}>
                          {g.height}
                        </td>
                      ))}
                    </tr>
                    <tr className="text-slate-500 text-[11px]">
                      <td className="p-2 text-left font-sans font-bold">Ετήσια Αύξηση</td>
                      {growthTable.map(g => (
                        <td key={`td-g-${g.age}`} className={`p-2 ${g.age === selectedAge ? 'bg-emerald-50 text-emerald-600 font-bold' : ''}`}>
                          {g.age === 1 ? '-' : `+${g.gain}`}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-slate-600 text-center pt-1 font-sans">
                💡 <strong>Συμπέρασμα:</strong> Το μοτίβο ανάπτυξης έχει γρήγορη αύξηση στα πρώτα έτη (+12cm, +10cm) και σταθεροποιείται γύρω στα +6cm/έτος.
              </p>
            </div>

          </div>
        </section>

        {/* 5. ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ ΚΑΘΗΜΕΡΙΝΗΣ ΖΩΗΣ */}
        <section className="space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight">
              Λυμένα Προβλήματα με Σύνθετα Μοτίβα
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Εφαρμογές διπλών κανόνων και πινάκων τιμών σε ρεαλιστικά σενάρια.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ΠΡΟΒΛΗΜΑ 1 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-900 text-xs font-black rounded-lg uppercase">
                  ΠΡΟΒΛΗΜΑ 1: ΣΥΝΔΡΟΜΗ ΜΕ ΠΑΓΙΟ
                </span>
                <span className="text-xs font-bold text-slate-400">Κόστος Χρήσης</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Υπολογισμός Κόστους Συνδρομητικής Υπηρεσίας
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Μια συνδρομητική πλατφόρμα ταινιών χρεώνει μηνιαίο πάγιο <strong>6 €</strong> και επιπλέον <strong>2 €</strong> για κάθε νέα ταινία που ενοικιάζει ο χρήστης. Πόσα χρήματα θα πληρώσει ένας συνδρομητής που νοίκιασε <strong>8</strong> ταινίες σε έναν μήνα;
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΔΕΔΟΜΕΝΑ ΧΡΕΩΣΗΣ
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Πάγιο</span> 6 €
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Κόστος/ταινία</span> 2 €
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Ταινίες (ν)</span> 8
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήματα Επίλυσης:</span>
                  <div>• <strong>Κόστος ταινιών:</strong> 8 · 2 € ＝ <strong>16 €</strong>.</div>
                  <div>• <strong>Τελικό ποσό (μαζί με το πάγιο):</strong> 16 ＋ 6 ＝ <strong className="text-blue-700">22 €</strong>.</div>
                  <div>• <strong>Σύνθετος τύπος:</strong> Κόστος ＝ 2 · ν ＋ 6.</div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 font-medium">
                💡 Το πάγιο μένει σταθερό, ενώ το κόστος των ταινιών πολλαπλασιάζεται με το πλήθος ν.
              </div>
            </article>

            {/* ΠΡΟΒΛΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-lg uppercase">
                  ΠΡΟΒΛΗΜΑ 2: ΑΥΞΑΝΟΜΕΝΟ ΒΗΜΑ
                </span>
                <span className="text-xs font-bold text-slate-400">Πυραμίδα</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Μοτίβο με Μεταβαλλόμενη Προσθήκη (+2, +3, +4...)
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Σε ένα παιχνίδι με τουβλάκια, το 1ο επίπεδο έχει <strong>1</strong> τουβλάκι, το 2ο επίπεδο έχει <strong>3</strong> (1＋2), το 3ο έχει <strong>6</strong> (3＋3), το 4ο έχει <strong>10</strong> (6＋4). Πόσα τουβλάκια θα έχει το <strong>6ο επίπεδο</strong>;
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΕΞΕΛΙΞΗ ΒΗΜΑΤΟΣ ΠΡΟΣΘΕΣΗΣ
                </span>
                <div className="grid grid-cols-4 gap-2 text-center font-mono font-bold text-[11px]">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">1ο</span> 1
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">2ο (+2)</span> 3
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">3ο (+3)</span> 6
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">4ο (+4)</span> 10
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήματα Επίλυσης:</span>
                  <div>• <strong>5ο επίπεδο:</strong> 10 ＋ 5 ＝ <strong>15 τουβλάκια</strong>.</div>
                  <div>• <strong>6ο επίπεδο:</strong> 15 ＋ 6 ＝ <strong className="text-amber-700">21 τουβλάκια</strong>.</div>
                  <div>• <strong>Κανόνας τριγωνικών αριθμών:</strong> [ν · (ν ＋ 1)] : 2 ＝ (6 · 7) : 2 ＝ 21.</div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 font-medium">
                ⚡ Εδώ το βήμα δεν είναι σταθερό αλλά αυξάνεται κατά 1 σε κάθε επίπεδο (+2, +3, +4, +5, +6...)!
              </div>
            </article>

          </div>
        </section>

        {/* 6. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στα Σύνθετα Μοτίβα!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε 10 διαδραστικές ασκήσεις με διπλούς κανόνες, πίνακες μεγεθών και σύνθετες ακολουθίες για τη ΣΤ' Δημοτικού.
            </p>
          </div>

          <Link
            href="/st-dimotikou/65-sintheta-motiba-ask"
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
