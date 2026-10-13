// pages/st-dimotikou/72-embadon.js
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

export default function EmbadonTheoriaPage() {
  // Εργαστήριο 1: Διαδραστική Σκάλα Μετατροπής Μονάδων Επιφάνειας
  const [inputValue, setInputValue] = useState(1);
  const [fromUnit, setFromUnit] = useState('m2');

  // Ισοδυναμία σε m² για κάθε μονάδα
  const unitFactorsToM2 = {
    km2: 1000000,
    stremma: 1000,
    m2: 1,
    dm2: 0.01,
    cm2: 0.0001,
    mm2: 0.000001
  };

  const unitLabels = {
    km2: 'τετραγωνικά χιλιόμετρα (km²)',
    stremma: 'στρέμματα',
    m2: 'τετραγωνικά μέτρα (m²)',
    dm2: 'τετραγωνικά δεκατόμετρα (dm²)',
    cm2: 'τετραγωνικά εκατοστόμετρα (cm²)',
    mm2: 'τετραγωνικά χιλιοστόμετρα (mm²)'
  };

  const convertedValues = useMemo(() => {
    const val = Number(inputValue) || 0;
    const valInM2 = val * unitFactorsToM2[fromUnit];

    return {
      km2: valInM2 / 1000000,
      stremma: valInM2 / 1000,
      m2: valInM2,
      dm2: valInM2 / 0.01,
      cm2: valInM2 / 0.0001,
      mm2: valInM2 / 0.000001
    };
  }, [inputValue, fromUnit]);

  // Εργαστήριο 2: Οπτικοποίηση Πλέγματος 10x10 (1 m² = 100 dm²)
  const [highlightedBlocks, setHighlightedBlocks] = useState(25);

  return (
    <Layout
      title="Μέτρηση Επιφάνειας &amp; Μονάδες Εμβαδού - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μαθαίνουμε τι είναι το εμβαδόν, τις μονάδες μέτρησης επιφάνειας, τη σκάλα μετατροπών ανά 100 και τα στρέμματα με διαδραστικά εργαστήρια SVG."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/72-embadon-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 72 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Μέτρηση Επιφάνειας • Το Εμβαδόν &amp; οι Μονάδες Μέτρησης
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Ανακαλύπτουμε τι εκφράζει η <strong>επιφάνεια</strong> και το <strong>εμβαδόν</strong> ενός σχήματος, 
              γιατί οι μονάδες επιφάνειας αλλάζουν <strong>ανά 100</strong> σε κάθε σκαλοπάτι, πώς μετράμε χωράφια και οικόπεδα 
              σε <strong>στρέμματα</strong> και πώς μετακινούμαστε εύκολα ανάμεσα στις μονάδες μέτρησης!
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία, Σκάλα Μονάδων ανά 100, Στρέμματα &amp; Διαδραστικά Εργαστήρια</span>
            </div>
            <Link
              href="/st-dimotikou/72-embadon-ask"
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
              Η Μέτρηση Επιφάνειας σε 4 Βήματα
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Από την έννοια της κάλυψης μέχρι τη σκάλα μετατροπών και τις αγροτικές μονάδες.
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
                  Τι είναι Εμβαδόν;
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  <strong>Εμβαδόν</strong> ονομάζεται το <strong>μέτρο της επιφάνειας</strong> που καταλαμβάνει ένα κλειστό γεωμετρικό σχήμα στο επίπεδο:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2">
                  <div>
                    • <strong>Περίμετρος:</strong> Το μήκος του εξωτερικού ορίου (γραμμή σε μέτρα m).
                  </div>
                  <div>
                    • <strong>Εμβαδόν:</strong> Ολόκληρος ο εσωτερικός χώρος που καλύπτει το σχήμα (επιφάνεια σε τετραγωνικά μέτρα m²).
                  </div>
                  <div className="text-blue-900 font-bold text-xs pt-1 border-t border-slate-200">
                    Μονάδα βάσης: Το <strong>τετραγωνικό μέτρο (1 m²)</strong>, δηλαδή ένα τετράγωνο με πλευρά μήκους 1 m.
                  </div>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Όταν υπολογίζουμε εμβαδόν, μετράμε ουσιαστικά «πόσα τετραγωνάκια» χωράνε μέσα στο σχήμα!
              </div>
            </article>

            {/* ΒΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Κανόνας</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Γιατί Αλλάζουν ανά 100;
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Στο μήκος έχουμε: $1\text{ m} ＝ 10\text{ dm}$. Στην επιφάνεια όμως έχουμε δύο διαστάσεις (μήκος $\cdot$ πλάτος):
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1.5 font-mono">
                  <div className="text-amber-950 font-bold text-center">
                    $1\text{ m}^2 ＝ 10\text{ dm} \cdot 10\text{ dm} ＝ \mathbf{100\text{ dm}^2}$!
                  </div>
                  <div className="text-amber-950 font-bold text-center">
                    $1\text{ dm}^2 ＝ 10\text{ cm} \cdot 10\text{ cm} ＝ \mathbf{100\text{ cm}^2}$!
                  </div>
                  <div className="text-amber-950 font-bold text-center">
                    $1\text{ cm}^2 ＝ 10\text{ mm} \cdot 10\text{ mm} ＝ \mathbf{100\text{ mm}^2}$!
                  </div>
                  <p className="text-[11px] text-slate-600 font-sans pt-1">
                    Κάθε σκαλοπάτι στην επιφάνεια δεν έχει σχέση 10, αλλά <strong>10 · 10 ＝ 100</strong>!
                  </p>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Όταν κατεβαίνουμε σκαλοπάτι πολλαπλασιάζουμε με το 100. Όταν ανεβαίνουμε διαιρούμε με το 100!
              </div>
            </article>

            {/* ΒΗΜΑ 3 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Μεγάλες Μονάδες</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Στρέμματα &amp; km²
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Για οικόπεδα, δάση και πόλεις χρησιμοποιούμε μεγαλύτερες μονάδες μέτρησης:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 font-mono">
                  <div className="p-2 bg-indigo-50 rounded-xl border border-indigo-200 text-indigo-950 font-black">
                    • 1 Στρέμμα ＝ 1.000 m²
                  </div>
                  <div className="p-2 bg-purple-50 rounded-xl border border-purple-200 text-purple-950 font-black">
                    • 1 km² ＝ 1.000.000 m² ＝ 1.000 Στρέμματα
                  </div>
                  <p className="text-[11px] text-slate-600 font-sans">
                    Ένα χωράφι $5.000\text{ m}^2$ είναι ακριβώς $5.000 : 1.000 ＝ 5\text{ στρέμματα}$.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Θυμήσου: $1\text{ km} ＝ 1.000\text{ m}$, άρα $1\text{ km}^2 ＝ 1.000 \cdot 1.000 ＝ 1.000.000\text{ m}^2$!
              </div>
            </article>

            {/* ΒΗΜΑ 4 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Μετατροπές</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Κανόνες Μετατροπής
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Πώς μετακινούμαστε στη σκάλα των μονάδων μέτρησης επιφάνειας:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2">
                  <div>
                    • <strong>Από μεγαλύτερη σε μικρότερη (κατεβαίνω):</strong> Πολλαπλασιάζω $\cdot 100$ για κάθε σκαλοπάτι.
                  </div>
                  <div>
                    • <strong>Από μικρότερη σε μεγαλύτερη (ανεβαίνω):</strong> Διαιρώ $: 100$ για κάθε σκαλοπάτι.
                  </div>
                  <div className="text-emerald-950 font-mono text-[11px] pt-1 border-t border-slate-200">
                    Παράδειγμα: $3\text{ m}^2 ＝ 3 \cdot 100 ＝ 300\text{ dm}^2 ＝ 30.000\text{ cm}^2$.
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Για 2 σκαλοπάτια (π.χ. από $\text{m}^2$ σε $\text{cm}^2$) πολλαπλασιάζουμε με το $100 \cdot 100 ＝ 10.000$!
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΔΙΑΔΡΑΣΤΙΚΗ ΣΚΑΛΑ ΜΟΝΑΔΩΝ ΕΠΙΦΑΝΕΙΑΣ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1</span>
            </div>
            <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Διαδραστικός Μετατροπέας Μονάδων Επιφάνειας
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Γράψε έναν αριθμό και επίλεξε την αρχική μονάδα για να δεις αυτόματα πώς μετατρέπεται σε όλες τις υπόλοιπες κλίμακες επιφάνειας:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">

            {/* Χειριστήρια Εισαγωγής (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <label className="block text-xs font-bold text-slate-800">
                  1. ΕΙΣΑΓΩΓΗ ΤΙΜΗΣ:
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 font-mono text-lg font-black text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  2. ΑΡΧΙΚΗ ΜΟΝΑΔΑ ΜΕΤΡΗΣΗΣ:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'km2', label: 'km²' },
                    { id: 'stremma', label: 'Στρέμματα' },
                    { id: 'm2', label: 'm²' },
                    { id: 'dm2', label: 'dm²' },
                    { id: 'cm2', label: 'cm²' },
                    { id: 'mm2', label: 'mm²' }
                  ].map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => setFromUnit(u.id)}
                      className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center ${
                        fromUnit === u.id
                          ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {u.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs text-sky-950 font-medium">
                💡 Παρατήρησε: Όταν μετακινούμαστε από τα $\text{m}^2$ προς τα $\text{dm}^2$ και $\text{cm}^2$, ο αριθμός μεγαλώνει κατά 100 φορές για κάθε βήμα!
              </div>
            </div>

            {/* Πίνακας Αποτελεσμάτων (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 p-5 sm:p-7 rounded-3xl border border-slate-800 text-white space-y-3">
              <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider text-center">
                ΙΣΟΔΥΝΑΜΙΑ ΣΕ ΟΛΕΣ ΤΙΣ ΜΟΝΑΔΕΣ
              </span>

              <div className="space-y-2 font-mono text-xs sm:text-sm">
                {[
                  { key: 'km2', label: 'Τετραγωνικά χιλιόμετρα (km²)', val: convertedValues.km2, color: 'text-purple-400' },
                  { key: 'stremma', label: 'Στρέμματα', val: convertedValues.stremma, color: 'text-amber-400' },
                  { key: 'm2', label: 'Τετραγωνικά μέτρα (m²)', val: convertedValues.m2, color: 'text-sky-400' },
                  { key: 'dm2', label: 'Τετραγωνικά δεκατόμετρα (dm²)', val: convertedValues.dm2, color: 'text-indigo-400' },
                  { key: 'cm2', label: 'Τετραγωνικά εκατοστόμετρα (cm²)', val: convertedValues.cm2, color: 'text-emerald-400' },
                  { key: 'mm2', label: 'Τετραγωνικά χιλιοστόμετρα (mm²)', val: convertedValues.mm2, color: 'text-rose-400' }
                ].map((item) => (
                  <div
                    key={item.key}
                    className={`flex items-center justify-between p-2.5 rounded-xl border ${
                      fromUnit === item.key
                        ? 'bg-slate-800 border-indigo-500 ring-1 ring-indigo-400'
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <span className="text-slate-300 font-sans text-xs">{item.label}:</span>
                    <span className={`font-black text-sm sm:text-base ${item.color}`}>
                      {formatNum(item.val)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΟΠΤΙΚΟΠΟΙΗΣΗ ΠΛΕΓΜΑΤΟΣ 10x10 */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
              <span>📐 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΟΠΤΙΚΟ ΠΛΕΓΜΑ</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Γιατί 1 m² ＝ 100 dm²; (Οπτική Απόδειξη)
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Φαντάσου το μεγάλο τετράγωνο ως $1\text{ m}^2$ (πλευρά $1\text{ m} ＝ 10\text{ dm}$). Χωρίζεται σε $10 \times 10 ＝ 100$ μικρά τετραγωνάκια των $1\text{ dm}^2$:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

            {/* Ρυθμίσεις (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>ΧΡΩΜΑΤΙΣΜΕΝΑ ΤΕΤΡΑΓΩΝΑΚΙΑ (dm²):</span>
                  <span className="font-mono text-base font-black text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {highlightedBlocks} / 100
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={100}
                  step={1}
                  value={highlightedBlocks}
                  onChange={(e) => setHighlightedBlocks(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>1 dm²</span>
                  <span>50 dm² (0,5 m²)</span>
                  <span>100 dm² (1 m²)</span>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1.5 text-xs sm:text-sm font-medium">
                <div className="text-emerald-950 font-bold">
                  Επιφάνεια Χρωματισμένου Μέρους:
                </div>
                <div className="font-mono text-base font-black text-emerald-800">
                  {highlightedBlocks} dm² ＝ {formatNum(highlightedBlocks / 100)} m²
                </div>
                <p className="text-slate-600 text-[11px] pt-1 border-t border-emerald-200">
                  Κάθε τετραγωνάκι είναι το $1/100$ του μεγάλου τετραγώνου ($0,01\text{ m}^2$).
                </p>
              </div>
            </div>

            {/* SVG Πλέγμα 10x10 (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 min-h-[340px] p-4 sm:p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center">
              <svg
                viewBox="0 0 260 260"
                className="w-full max-w-[260px] h-auto select-none"
              >
                {/* 100 τετραγωνάκια 24x24 px με κενό 2px */}
                {Array.from({ length: 100 }).map((_, idx) => {
                  const row = Math.floor(idx / 10);
                  const col = idx % 10;
                  const isHighlighted = idx < highlightedBlocks;

                  return (
                    <rect
                      key={idx}
                      x={col * 26}
                      y={row * 26}
                      width={24}
                      height={24}
                      rx={3}
                      fill={isHighlighted ? '#38bdf8' : 'rgba(255, 255, 255, 0.08)'}
                      stroke={isHighlighted ? '#0284c7' : 'rgba(255, 255, 255, 0.15)'}
                      strokeWidth={1}
                      className="transition-colors duration-150"
                    />
                  );
                })}
              </svg>
              <div className="mt-3 text-center text-xs text-slate-400 font-mono">
                10 γραμμές · 10 στήλες ＝ 100 τετραγωνικά δεκατόμετρα (1 m²)
              </div>
            </div>

          </div>
        </section>

        {/* 5. ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ ΚΑΘΗΜΕΡΙΝΗΣ ΖΩΗΣ */}
        <section className="space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight">
              Λυμένα Προβλήματα με Μονάδες Επιφάνειας
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Εφαρμογές των μετατροπών σε πραγματικά σενάρια πλακόστρωσης και αγοραπωλησίας γης.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ΠΡΟΒΛΗΜΑ 1 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-900 text-xs font-black rounded-lg uppercase">
                  ΠΡΟΒΛΗΜΑ 1: ΠΛΑΚΑΚΙΑ ΔΑΠΕΔΟΥ
                </span>
                <span className="text-xs font-bold text-slate-400">Από m² σε cm²</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Υπολογισμός Πλήθους Πλακιδίων για Δωμάτιο
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Το πάτωμα μιας κουζίνας έχει εμβαδόν <strong>15 m²</strong>. Θέλουμε να το καλύψουμε με τετράγωνα πλακάκια που έχουν εμβαδόν <strong>600 cm²</strong> το καθένα. Πόσα πλακάκια θα χρειαστούν;
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΔΕΔΟΜΕΝΑ ΠΡΟΒΛΗΜΑΤΟΣ
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Εμβαδόν κουζίνας</span> 15 m²
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Εμβαδόν πλακιδίου</span> 600 cm²
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Σχέση m²/cm²</span> 1 m² ＝ 10.000 cm²
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήματα Επίλυσης:</span>
                  <div>• <strong>Μετατροπή κουζίνας σε cm²:</strong> 15 · 10.000 ＝ <strong>150.000 cm²</strong>.</div>
                  <div>• <strong>Υπολογισμός πλακιδίων:</strong> 150.000 : 600 ＝ <strong className="text-blue-700">250 πλακάκια</strong>.</div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 font-medium">
                💡 Πάντα μετατρέπουμε όλα τα εμβαδά στην <strong>ίδια μονάδα μέτρησης</strong> πριν κάνουμε διαίρεση!
              </div>
            </article>

            {/* ΠΡΟΒΛΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-lg uppercase">
                  ΠΡΟΒΛΗΜΑ 2: ΑΓΡΟΤΕΜΑΧΙΟ
                </span>
                <span className="text-xs font-bold text-slate-400">Στρέμματα &amp; Αξία</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Υπολογισμός Αξίας Ελαιώνα σε Στρέμματα
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ένας ελαιώνας έχει εμβαδόν <strong>12.500 m²</strong>. Ο ιδιοκτήτης πουλάει το κτήμα προς <strong>4.000 €</strong> το στρέμμα. Πόσα χρήματα θα εισπράξει από την πώληση;
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΣΤΟΙΧΕΙΑ ΥΠΟΛΟΓΙΣΜΟΥ
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold text-[11px]">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Εμβαδόν σε m²</span> 12.500 m²
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">1 Στρέμμα</span> 1.000 m²
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Τιμή/στρέμμα</span> 4.000 €
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήματα Επίλυσης:</span>
                  <div>• <strong>Μετατροπή σε στρέμματα:</strong> 12.500 : 1.000 ＝ <strong>12,5 στρέμματα</strong>.</div>
                  <div>• <strong>Συνολική αξία:</strong> 12,5 · 4.000 € ＝ <strong className="text-amber-700">50.000 €</strong>.</div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 font-medium">
                ⚡ Για να μετατρέψουμε από $\text{m}^2$ σε στρέμματα, διαιρούμε πάντοτε με το 1.000.
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
                  <strong>Μην μπερδεύετε το 10 με το 100:</strong> Στο μήκος $1\text{ m} ＝ 10\text{ dm}$, αλλά στην επιφάνεια $1\text{ m}^2 ＝ 100\text{ dm}^2$! Για κάθε σκαλοπάτι που ανεβαίνουμε ή κατεβαίνουμε στην επιφάνεια, πολλαπλασιάζουμε ή διαιρούμε με το <strong>100</strong>.
                </li>
                <li>
                  <strong>Δύο σκαλοπάτια σημαίνουν $\cdot 10.000$ και όχι $\cdot 200$:</strong> Από $\text{m}^2$ σε $\text{cm}^2$ κατεβαίνουμε 2 σκαλοπάτια ($\cdot 100 \cdot 100 ＝ \cdot 10.000$).
                </li>
                <li>
                  <strong>Μην μπερδεύετε την περίμετρο με το εμβαδόν:</strong> Η περίμετρος μετριέται σε απλά μέτρα (m) και είναι το μήκος του φράχτη. Το εμβαδόν μετριέται σε τετραγωνικά μέτρα (m²) και είναι η επιφάνεια του οικοπέδου.
                </li>
                <li>
                  <strong>Το στρέμμα δεν είναι $100\text{ m}^2$:</strong> Το 1 στρέμμα ισούται με ακριβώς <strong>1.000 m²</strong>.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 7. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στις Μονάδες Επιφάνειας!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε 12 διαδραστικές ασκήσεις με μετατροπές τετραγωνικών μέτρων, δεκατομέτρων, εκατοστομέτρων και στρεμμάτων για τη ΣΤ' Δημοτικού.
            </p>
          </div>

          <Link
            href="/st-dimotikou/72-embadon-ask"
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
