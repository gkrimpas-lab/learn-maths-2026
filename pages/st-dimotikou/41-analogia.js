// pages/st-dimotikou/41-analogia.js
import { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

const LIMITS = {
  MIN_VAL: 1,
  MAX_VAL: 30
};

// Βοηθητικό component εμφάνισης κλάσματος με οριζόντια γραμμή
function Fraction({ num, den, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono ${className}`}>
      <span className="border-b-2 border-current px-1.5 pb-0.5 text-center leading-none">
        {num}
      </span>
      <span className="px-1.5 pt-0.5 text-center leading-none">
        {den}
      </span>
    </span>
  );
}

// Βοηθητική συνάρτηση ΜΚΔ
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

export default function AnalogiaTheoryPage() {
  // Εργαστήριο 1: Έλεγχος & Διερεύνηση Αναλογίας (α : β ＝ γ : δ)
  const [a, setA] = useState(2);
  const [b, setB] = useState(3);
  const [c, setC] = useState(6);
  const [d, setD] = useState(9);

  // Εργαστήριο 2: Εύρεση Αγνώστου Όρου Αναλογίας (χ)
  const [p1, setP1] = useState(4); // π.χ. τετράδια
  const [p2, setP2] = useState(6); // κόστος σε €
  const [p3, setP3] = useState(10); // νέα τετράδια

  // Υπολογισμοί Εργαστηρίου 1
  const crossProduct1 = a * d; // Γινόμενο άκρων
  const crossProduct2 = b * c; // Γινόμενο μέσων
  const isProportion = crossProduct1 === crossProduct2;

  const ratio1Dec = (a / b).toFixed(2).replace('.', ',');
  const ratio2Dec = (c / d).toFixed(2).replace('.', ',');

  const gcd1 = useMemo(() => getGCD(a, b), [a, b]);
  const gcd2 = useMemo(() => getGCD(c, d), [c, d]);

  // Υπολογισμοί Εργαστηρίου 2 (χ = (p2 * p3) / p1)
  const unknownValue = useMemo(() => {
    const raw = (p2 * p3) / p1;
    return Number.isInteger(raw) ? String(raw) : raw.toFixed(2).replace('.', ',');
  }, [p1, p2, p3]);

  return (
    <Layout
      title="Αναλογίες - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Πλήρης θεωρία με παραδείγματα για την έννοια της αναλογίας, τη βασική ιδιότητα των χιαστί γινομένων, την εύρεση άγνωστου όρου και διαδραστικό εργαστήριο για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/41-analogia-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 41 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Η Έννοια της Αναλογίας
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              Ανακαλύπτουμε τι είναι η αναλογία, ποια είναι τα άκρα και ποια τα μέσα, πώς εφαρμόζουμε τη βασική ιδιότητα των ίσων σταυρωτών γινομένων (χιαστί) και πώς υπολογίζουμε άμεσα έναν άγνωστο όρο.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία &amp; Δυναμικός Έλεγχος Σταυρωτών Γινομένων</span>
            </div>
            <Link
              href="/st-dimotikou/41-analogia-ask"
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
              Η μαθηματική δομή της αναλογίας, η σχέση των όρων της και ο κανόνας επίλυσης προβλημάτων.
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
                  Τι είναι Αναλογία;
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  <strong>Αναλογία</strong> ονομάζεται η <strong>ισότητα δύο λόγων</strong>. Όταν δύο λόγοι έχουν την ίδια ακριβώς τιμή, λέμε ότι σχηματίζουν αναλογία.
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-3 text-xs sm:text-sm 2xl:text-base">
                  <p className="text-slate-700 font-semibold">Συμβολισμός &amp; Μορφές:</p>
                  <div className="p-3 bg-white rounded-xl border border-slate-300 font-mono font-bold text-slate-900 shadow-inner flex flex-wrap items-center justify-center gap-4 text-base sm:text-lg">
                    <span>α : β ＝ γ : δ</span>
                    <span className="text-slate-400 font-normal">ή</span>
                    <div className="inline-flex items-center gap-1.5">
                      <Fraction num="α" den="β" />
                      <span className="mx-1">＝</span>
                      <Fraction num="γ" den="δ" />
                    </div>
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Διαβάζεται: «Το <strong>α</strong> προς το <strong>β</strong> ισούται με το <strong>γ</strong> προς το <strong>δ</strong>».
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Μια ισότητα δύο λόγων είναι αληθής αναλογία μόνο όταν οι δύο λόγοι δίνουν ακριβώς το ίδιο πηλίκο διαίρεσης!
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Ονοματολογία</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Άκροι και Μέσοι Όροι
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Στην αναλογία <span className="font-bold font-mono">α : β ＝ γ : δ</span>, οι τέσσερις αριθμοί έχουν συγκεκριμένες θέσεις και ονομασίες:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2.5 text-xs sm:text-sm 2xl:text-base">
                  <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-200">
                    <span className="font-bold text-blue-900">Άκροι όροι:</span>
                    <span className="font-mono font-black text-blue-700">α &nbsp;και&nbsp; δ</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-200">
                    <span className="font-bold text-amber-900">Μέσοι όροι:</span>
                    <span className="font-mono font-black text-amber-700">β &nbsp;και&nbsp; γ</span>
                  </div>
                  <div className="pt-2 text-center text-xs text-slate-600 border-t border-slate-200">
                    Στην κλασματική μορφή <Fraction num="α" den="β" /> ＝ <Fraction num="γ" den="δ" /> τα άκρα είναι διαγώνια (<span className="font-bold">α</span>, <span className="font-bold">δ</span>) και τα μέσα διαγώνια (<span className="font-bold">β</span>, <span className="font-bold">γ</span>).
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Τα άκρα βρίσκονται στις εξωτερικές θέσεις και τα μέσα στο εσωτερικό της αναλογίας.
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Βασική Ιδιότητα</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Σταυρωτά Γινόμενα (Χιαστί)
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Σε κάθε αναλογία, το <strong>γινόμενο των άκρων όρων είναι ίσο με το γινόμενο των μέσων όρων</strong>:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono">
                  <div className="text-center font-bold text-slate-900 text-sm sm:text-base">
                    α · δ ＝ β · γ
                  </div>
                  <div className="pt-2 border-t border-slate-200 text-slate-600 font-sans text-xs leading-relaxed">
                    Παράδειγμα για <Fraction num="2" den="3" /> ＝ <Fraction num="6" den="9" />:<br />
                    • Γινόμενο άκρων: <span className="font-mono font-bold text-indigo-800">2 · 9 ＝ 18</span><br />
                    • Γινόμενο μέσων: <span className="font-mono font-bold text-indigo-800">3 · 6 ＝ 18</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Αν τα σταυρωτά γινόμενα δεν είναι ίσα, τότε οι δύο λόγοι <strong>δεν</strong> σχηματίζουν αναλογία!
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Επίλυση</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Εύρεση Άγνωστου Όρου
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Αν σε μια αναλογία γνωρίζουμε τους τρεις όρους, βρίσκουμε άμεσα τον τέταρτο άγνωστο όρο (<span className="font-bold">χ</span>):
                </p>

                <div className="space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-mono text-center font-bold">
                    χ ＝ (γινόμενο γνωστών) ： (απέναντι όρος)
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-950 font-sans text-xs leading-relaxed">
                    Αν <Fraction num="2" den="5" /> ＝ <Fraction num="6" den="χ" />, τότε:<br />
                    <span className="font-mono font-bold">χ ＝ (5 · 6) ： 2 ＝ 30 ： 2 ＝ 15</span>.
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Αυτός ο κανόνας αποτελεί τη βάση για όλα τα προβλήματα ποσών και τιμών.
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΕΛΕΓΧΟΣ ΑΝΑΛΟΓΙΑΣ & ΣΤΑΥΡΩΤΑ ΓΙΝΟΜΕΝΑ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1</span>
              </div>
              <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Δυναμικός Αναλυτής Αναλογίας &amp; Σταυρωτά Γινόμενα
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Ρυθμίστε τους τέσσερις όρους για να διερευνήσετε αν σχηματίζουν αναλογία και να δείτε σε πραγματικό χρόνο τα σταυρωτά γινόμενα (χιαστί).
              </p>
            </div>
          </div>

          {/* Πλέγμα 4 Steppers (2 για κάθε λόγο) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 2xl:gap-6">
            
            {/* Όρος α (Άκρος) */}
            <div className="bg-blue-50/70 p-4 2xl:p-5 rounded-2xl border border-blue-200 space-y-2">
              <div className="h-8 flex items-center justify-between text-left">
                <span className="text-xs 2xl:text-sm font-black uppercase text-blue-900 tracking-wider">
                  ΟΡΟΣ α (ΑΚΡΟΣ)
                </span>
                <span className="min-w-[56px] text-center font-mono font-black text-lg text-blue-600 bg-white px-2 py-0.5 rounded-lg border border-blue-200">
                  {a}
                </span>
              </div>
              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  type="button"
                  aria-label="Μείωση όρου α"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setA((prev) => Math.max(LIMITS.MIN_VAL, prev - 1));
                  }}
                  disabled={a <= LIMITS.MIN_VAL}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                >
                  －
                </button>
                <input
                  type="range"
                  min={LIMITS.MIN_VAL}
                  max={LIMITS.MAX_VAL}
                  value={a}
                  onChange={(e) => setA(Number(e.target.value))}
                  aria-label="Όρος α"
                  className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                />
                <button
                  type="button"
                  aria-label="Αύξηση όρου α"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setA((prev) => Math.min(LIMITS.MAX_VAL, prev + 1));
                  }}
                  disabled={a >= LIMITS.MAX_VAL}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                >
                  ＋
                </button>
              </div>
            </div>

            {/* Όρος β (Μέσος) */}
            <div className="bg-amber-50/70 p-4 2xl:p-5 rounded-2xl border border-amber-200 space-y-2">
              <div className="h-8 flex items-center justify-between text-left">
                <span className="text-xs 2xl:text-sm font-black uppercase text-amber-900 tracking-wider">
                  ΟΡΟΣ β (ΜΕΣΟΣ)
                </span>
                <span className="min-w-[56px] text-center font-mono font-black text-lg text-amber-600 bg-white px-2 py-0.5 rounded-lg border border-amber-200">
                  {b}
                </span>
              </div>
              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  type="button"
                  aria-label="Μείωση όρου β"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setB((prev) => Math.max(LIMITS.MIN_VAL, prev - 1));
                  }}
                  disabled={b <= LIMITS.MIN_VAL}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                >
                  －
                </button>
                <input
                  type="range"
                  min={LIMITS.MIN_VAL}
                  max={LIMITS.MAX_VAL}
                  value={b}
                  onChange={(e) => setB(Number(e.target.value))}
                  aria-label="Όρος β"
                  className="w-full min-w-0 max-w-full accent-amber-600 cursor-pointer"
                />
                <button
                  type="button"
                  aria-label="Αύξηση όρου β"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setB((prev) => Math.min(LIMITS.MAX_VAL, prev + 1));
                  }}
                  disabled={b >= LIMITS.MAX_VAL}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                >
                  ＋
                </button>
              </div>
            </div>

            {/* Όρος γ (Μέσος) */}
            <div className="bg-amber-50/70 p-4 2xl:p-5 rounded-2xl border border-amber-200 space-y-2">
              <div className="h-8 flex items-center justify-between text-left">
                <span className="text-xs 2xl:text-sm font-black uppercase text-amber-900 tracking-wider">
                  ΟΡΟΣ γ (ΜΕΣΟΣ)
                </span>
                <span className="min-w-[56px] text-center font-mono font-black text-lg text-amber-600 bg-white px-2 py-0.5 rounded-lg border border-amber-200">
                  {c}
                </span>
              </div>
              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  type="button"
                  aria-label="Μείωση όρου γ"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setC((prev) => Math.max(LIMITS.MIN_VAL, prev - 1));
                  }}
                  disabled={c <= LIMITS.MIN_VAL}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                >
                  －
                </button>
                <input
                  type="range"
                  min={LIMITS.MIN_VAL}
                  max={LIMITS.MAX_VAL}
                  value={c}
                  onChange={(e) => setC(Number(e.target.value))}
                  aria-label="Όρος γ"
                  className="w-full min-w-0 max-w-full accent-amber-600 cursor-pointer"
                />
                <button
                  type="button"
                  aria-label="Αύξηση όρου γ"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setC((prev) => Math.min(LIMITS.MAX_VAL, prev + 1));
                  }}
                  disabled={c >= LIMITS.MAX_VAL}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                >
                  ＋
                </button>
              </div>
            </div>

            {/* Όρος δ (Άκρος) */}
            <div className="bg-blue-50/70 p-4 2xl:p-5 rounded-2xl border border-blue-200 space-y-2">
              <div className="h-8 flex items-center justify-between text-left">
                <span className="text-xs 2xl:text-sm font-black uppercase text-blue-900 tracking-wider">
                  ΟΡΟΣ δ (ΑΚΡΟΣ)
                </span>
                <span className="min-w-[56px] text-center font-mono font-black text-lg text-blue-600 bg-white px-2 py-0.5 rounded-lg border border-blue-200">
                  {d}
                </span>
              </div>
              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  type="button"
                  aria-label="Μείωση όρου δ"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setD((prev) => Math.max(LIMITS.MIN_VAL, prev - 1));
                  }}
                  disabled={d <= LIMITS.MIN_VAL}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                >
                  －
                </button>
                <input
                  type="range"
                  min={LIMITS.MIN_VAL}
                  max={LIMITS.MAX_VAL}
                  value={d}
                  onChange={(e) => setD(Number(e.target.value))}
                  aria-label="Όρος δ"
                  className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                />
                <button
                  type="button"
                  aria-label="Αύξηση όρου δ"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setD((prev) => Math.min(LIMITS.MAX_VAL, prev + 1));
                  }}
                  disabled={d >= LIMITS.MAX_VAL}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                >
                  ＋
                </button>
              </div>
            </div>

          </div>

          {/* Οπτική Σύγκριση Σταυρωτών Γινομένων & Κλασματική Μορφή */}
          <div className="bg-slate-50 p-6 2xl:p-8 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-600">
              <span>ΕΛΕΓΧΟΣ ΣΤΑΥΡΩΤΩΝ ΓΙΝΟΜΕΝΩΝ (ΧΙΑΣΤΙ)</span>
              <span className="font-mono text-slate-500">
                α · δ &nbsp;vs&nbsp; β · γ
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-2xl border border-blue-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-blue-900 block">Γινόμενο Άκρων (α · δ)</span>
                  <span className="font-mono text-sm text-slate-600">{a} · {d}</span>
                </div>
                <span className="font-mono font-black text-2xl text-blue-700 bg-blue-50 px-3 py-1 rounded-xl">
                  {crossProduct1}
                </span>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-900 block">Γινόμενο Μέσων (β · γ)</span>
                  <span className="font-mono text-sm text-slate-600">{b} · {c}</span>
                </div>
                <span className="font-mono font-black text-2xl text-amber-700 bg-amber-50 px-3 py-1 rounded-xl">
                  {crossProduct2}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 text-center text-xs sm:text-sm text-slate-600">
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-center gap-2">
                <span>1ος Λόγος:</span>
                <Fraction num={a} den={b} className="text-sm font-bold text-slate-900" />
                <span>≈ <strong className="font-mono">{ratio1Dec}</strong> (Ανάγωγος:</span>
                <Fraction num={a / gcd1} den={b / gcd1} className="text-xs font-bold text-blue-800" />
                <span>)</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-center gap-2">
                <span>2ος Λόγος:</span>
                <Fraction num={c} den={d} className="text-sm font-bold text-slate-900" />
                <span>≈ <strong className="font-mono">{ratio2Dec}</strong> (Ανάγωγος:</span>
                <Fraction num={c / gcd2} den={d / gcd2} className="text-xs font-bold text-amber-800" />
                <span>)</span>
              </div>
            </div>
          </div>

          {/* Τελική Κάρτα Αποτελέσματος Αναλογίας */}
          <div
            className={`p-6 2xl:p-8 rounded-3xl text-center shadow-lg max-w-3xl mx-auto space-y-3 text-white transition-all ${
              isProportion
                ? 'bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-900'
                : 'bg-gradient-to-r from-rose-900 via-red-900 to-slate-900'
            }`}
          >
            <span className="text-xs 2xl:text-sm uppercase font-black tracking-wider block text-sky-200">
              {isProportion ? '✓ ΤΕΛΙΚΟ ΣΥΜΠΕΡΑΣΜΑ: ΕΙΝΑΙ ΑΝΑΛΟΓΙΑ' : '✗ ΤΕΛΙΚΟ ΣΥΜΠΕΡΑΣΜΑ: ΔΕΝ ΕΙΝΑΙ ΑΝΑΛΟΓΙΑ'}
            </span>
            <div className="text-xl sm:text-3xl 2xl:text-4xl font-black font-mono flex flex-wrap items-center justify-center gap-4">
              <div className="inline-flex items-center gap-2">
                <span>{a} : {b}</span>
                <span className={isProportion ? 'text-emerald-300' : 'text-rose-300'}>
                  {isProportion ? '＝' : '≠'}
                </span>
                <span>{c} : {d}</span>
              </div>
              <span className="text-white/40 text-lg sm:text-2xl">|</span>
              <div className="inline-flex items-center gap-2">
                <Fraction num={a} den={b} className="text-xl sm:text-3xl font-black" />
                <span className={isProportion ? 'text-emerald-300' : 'text-rose-300'}>
                  {isProportion ? '＝' : '≠'}
                </span>
                <Fraction num={c} den={d} className="text-xl sm:text-3xl font-black" />
              </div>
            </div>
            <p className="text-xs sm:text-sm text-sky-100 max-w-xl mx-auto pt-1 leading-relaxed">
              {isProportion ? (
                <>
                  Τα σταυρωτά γινόμενα είναι ίσα (<span className="font-mono font-bold">{crossProduct1} ＝ {crossProduct2}</span>) και οι δύο λόγοι έχουν την ίδια ακριβώς τιμή (<span className="font-mono font-bold">{ratio1Dec}</span>). Άρα σχηματίζουν <strong>πραγματική αναλογία</strong>!
                </>
              ) : (
                <>
                  Τα σταυρωτά γινόμενα διαφέρουν (<span className="font-mono font-bold">{crossProduct1} ≠ {crossProduct2}</span>) και οι λόγοι έχουν διαφορετική τιμή (<span className="font-mono font-bold">{ratio1Dec} ≠ {ratio2Dec}</span>). Άρα <strong>δεν</strong> σχηματίζουν αναλογία.
                </>
              )}
            </p>
          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΕΥΡΕΣΗ ΑΓΝΩΣΤΟΥ ΟΡΟΥ ΣΕ ΠΡΟΒΛΗΜΑ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs 2xl:text-sm font-bold text-amber-800 mb-1">
                <span>🎯 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2</span>
              </div>
              <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Πραγματική Εφαρμογή: Υπολογισμός Άγνωστου Όρου (χ)
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Παράδειγμα αγοράς: Αν γνωρίζουμε ότι τα {p1} τετράδια κοστίζουν {p2} €, υπολογίστε πόσο κοστίζουν τα {p3} τετράδια.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 2xl:gap-6">
            
            {/* Ποσότητα 1 */}
            <div className="bg-blue-50/70 p-4 2xl:p-5 rounded-2xl border border-blue-200 space-y-2">
              <div className="h-8 flex items-center justify-between text-left">
                <span className="text-xs 2xl:text-sm font-black uppercase text-blue-900 tracking-wider">
                  ΑΡΧΙΚΑ ΤΕΤΡΑΔΙΑ
                </span>
                <span className="min-w-[56px] text-center font-mono font-black text-lg text-blue-600 bg-white px-2 py-0.5 rounded-lg border border-blue-200">
                  {p1}
                </span>
              </div>
              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  type="button"
                  aria-label="Μείωση αρχικών τετραδίων"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setP1((prev) => Math.max(1, prev - 1));
                  }}
                  disabled={p1 <= 1}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                >
                  －
                </button>
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={p1}
                  onChange={(e) => setP1(Number(e.target.value))}
                  aria-label="Αρχικά τετράδια"
                  className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                />
                <button
                  type="button"
                  aria-label="Αύξηση αρχικών τετραδίων"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setP1((prev) => Math.min(20, prev + 1));
                  }}
                  disabled={p1 >= 20}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                >
                  ＋
                </button>
              </div>
            </div>

            {/* Κόστος 1 */}
            <div className="bg-emerald-50/70 p-4 2xl:p-5 rounded-2xl border border-emerald-200 space-y-2">
              <div className="h-8 flex items-center justify-between text-left">
                <span className="text-xs 2xl:text-sm font-black uppercase text-emerald-900 tracking-wider">
                  ΚΟΣΤΟΣ (€)
                </span>
                <span className="min-w-[56px] text-center font-mono font-black text-lg text-emerald-600 bg-white px-2 py-0.5 rounded-lg border border-emerald-200">
                  {p2} €
                </span>
              </div>
              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  type="button"
                  aria-label="Μείωση κόστους"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setP2((prev) => Math.max(1, prev - 1));
                  }}
                  disabled={p2 <= 1}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                >
                  －
                </button>
                <input
                  type="range"
                  min={1}
                  max={30}
                  value={p2}
                  onChange={(e) => setP2(Number(e.target.value))}
                  aria-label="Κόστος"
                  className="w-full min-w-0 max-w-full accent-emerald-600 cursor-pointer"
                />
                <button
                  type="button"
                  aria-label="Αύξηση κόστους"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setP2((prev) => Math.min(30, prev + 1));
                  }}
                  disabled={p2 >= 30}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                >
                  ＋
                </button>
              </div>
            </div>

            {/* Ποσότητα 2 */}
            <div className="bg-indigo-50/70 p-4 2xl:p-5 rounded-2xl border border-indigo-200 space-y-2">
              <div className="h-8 flex items-center justify-between text-left">
                <span className="text-xs 2xl:text-sm font-black uppercase text-indigo-900 tracking-wider">
                  ΝΕΑ ΤΕΤΡΑΔΙΑ
                </span>
                <span className="min-w-[56px] text-center font-mono font-black text-lg text-indigo-600 bg-white px-2 py-0.5 rounded-lg border border-indigo-200">
                  {p3}
                </span>
              </div>
              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  type="button"
                  aria-label="Μείωση νέων τετραδίων"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setP3((prev) => Math.max(1, prev - 1));
                  }}
                  disabled={p3 <= 1}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                >
                  －
                </button>
                <input
                  type="range"
                  min={1}
                  max={30}
                  value={p3}
                  onChange={(e) => setP3(Number(e.target.value))}
                  aria-label="Νέα τετράδια"
                  className="w-full min-w-0 max-w-full accent-indigo-600 cursor-pointer"
                />
                <button
                  type="button"
                  aria-label="Αύξηση νέων τετραδίων"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setP3((prev) => Math.min(30, prev + 1));
                  }}
                  disabled={p3 >= 30}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                >
                  ＋
                </button>
              </div>
            </div>

          </div>

          {/* Μαθηματική Επίλυση Βήμα-Βήμα */}
          <div className="bg-slate-50 p-6 2xl:p-8 rounded-2xl border border-slate-200 space-y-4">
            <h4 className="text-sm 2xl:text-base font-bold text-slate-800">
              Μαθηματικό Στήσιμο της Αναλογίας:
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1 flex flex-col justify-center items-center">
                <span className="text-xs text-slate-500 block mb-1">Σχέση Αναλογίας</span>
                <div className="inline-flex items-center text-lg font-bold text-slate-900">
                  <Fraction num={p1} den={p2} />
                  <span className="mx-2">＝</span>
                  <Fraction num={p3} den="χ" />
                </div>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1 flex flex-col justify-center items-center">
                <span className="text-xs text-slate-500 block mb-1">Εφαρμογή Χιαστί</span>
                <span className="font-mono font-bold text-indigo-700 text-lg">
                  {p1} · χ ＝ {p2} · {p3}
                </span>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1 flex flex-col justify-center items-center">
                <span className="text-xs text-slate-500 block mb-1">Υπολογισμός του χ</span>
                <span className="font-mono font-black text-emerald-600 text-lg">
                  χ ＝ {unknownValue} €
                </span>
              </div>
            </div>

            <p className="text-xs 2xl:text-sm text-slate-600 pt-1 leading-relaxed">
              💬 <strong>Ερμηνεία:</strong> Πολλαπλασιάζουμε τους δύο διαγώνια γνωστούς όρους (<span className="font-mono font-bold">{p2} · {p3} ＝ {p2 * p3}</span>) και διαιρούμε με τον όρο που βρίσκεται απέναντι από το χ (<span className="font-mono font-bold">{p1}</span>): <span className="font-mono font-bold">{p2 * p3} : {p1} ＝ {unknownValue} €</span>.
            </p>
          </div>
        </section>

        {/* 5. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στις Αναλογίες!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε απαιτητικές ασκήσεις ελέγχου αναλογιών, υπολογισμού άγνωστων όρων (χ), σταυρωτών γινομένων και σύνθετων προβλημάτων καθημερινής ζωής.
            </p>
          </div>

          <Link
            href="/st-dimotikou/41-analogia-ask"
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
