// pages/st-dimotikou/45-problem-analoga-posa.js
import { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Βοηθητικο component εμφανισης κλασματος
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

// Μορφοποιηση αριθμου (ακεραιος ή δεκαδικος με κομμα)
function formatNum(val, decimals = 2) {
  if (Number.isInteger(val)) return String(val);
  const rounded = Number(val.toFixed(decimals));
  return String(rounded).replace('.', ',');
}

export default function ProblemAnalogaPosaTheoryPage() {
  // Εργαστηριο 1: Συγκριση των 3 Μεθοδων Επιλυσης
  const [itemsInitial, setItemsInitial] = useState(4); // π.χ. 4 τετραδια
  const [costInitial, setCostInitial] = useState(6);    // κοστιζουν 6 €
  const [itemsTarget, setItemsTarget] = useState(10);   // ζητουμενα τετραδια

  // Υπολογισμοι για Εργαστηριο 1
  const unitRate = useMemo(() => {
    return Number((costInitial / itemsInitial).toFixed(2));
  }, [costInitial, itemsInitial]);

  const targetCost = useMemo(() => {
    const raw = (costInitial * itemsTarget) / itemsInitial;
    return Number.isInteger(raw) ? raw : Number(raw.toFixed(2));
  }, [costInitial, itemsTarget, itemsInitial]);

  // Εργαστηριο 2: Προβλημα με Μετατροπες Μοναδων
  const [litersInitial] = useState(3);       // l λαδιου
  const [olivesKgInitial] = useState(15);   // kg ελιων
  const [targetMlLiters] = useState(7500);  // 7.500 ml

  const targetLitersClean = targetMlLiters / 1000;
  const targetOlivesKg = useMemo(() => {
    const raw = (olivesKgInitial * targetLitersClean) / litersInitial;
    return Number.isInteger(raw) ? raw : Number(raw.toFixed(2));
  }, [olivesKgInitial, targetLitersClean, litersInitial]);

  return (
    <Layout
      title="Επίλυση Προβλημάτων με Ανάλογα Ποσά - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Πλήρης οδηγός μεθόδων επίλυσης προβλημάτων με ανάλογα ποσά: αναγωγή στη μονάδα, αναλογία χιαστί, συντελεστής αναλογίας και διαδραστικό εργαστήριο για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/45-problem-analoga-posa-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 Ασκήσεις</span>
        </Link>
      }
    >
      {/* Container πληρους ευρους για 2K & 4K και responsive για κινητα */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 space-y-8 sm:space-y-10 2xl:space-y-14 pb-24 overflow-x-hidden">
        
        {/* 1. HEADER BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>ΚΕΦΑΛΑΙΟ 45 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Επίλυση Προβλημάτων με Ανάλογα Ποσά
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-2xl leading-relaxed max-w-4xl">
              Μαθαίνουμε να αναγνωρίζουμε τα ανάλογα ποσά σε καθημερινά προβλήματα και να επιλέγουμε την καταλληλότερη μέθοδο επίλυσης: με αναγωγή στη μονάδα, με αναλογία και σταυρωτά γινόμενα (χιαστί) ή με χρήση του συντελεστή αναλογίας.
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία &amp; Παράλληλη Σύγκριση των 3 Μεθόδων Επίλυσης</span>
            </div>
            <Link
              href="/st-dimotikou/45-problem-analoga-posa-ask"
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
              Οι 3 Στρατηγικές Επίλυσης &amp; τα Κρίσιμα Βήματα
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Πώς διαβάζουμε το πρόβλημα και πώς επιλέγουμε την ταχύτερη και ασφαλέστερη μέθοδο.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 gap-5 sm:gap-6 2xl:gap-8">
            
            {/* Βημα 1ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 1
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Προετοιμασία</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Έλεγχος &amp; Μετατροπές
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Πριν ξεκινήσουμε τις πράξεις, ελέγχουμε αν τα δύο ποσά είναι πραγματικά <strong>ανάλογα</strong> και μετατρέπουμε τα ομοειδή μεγέθη στην <strong>ίδια μονάδα μέτρησης</strong>:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 space-y-1.5 text-xs sm:text-sm">
                  <p className="text-slate-700 font-semibold">Κανόνας επιβεβαίωσης:</p>
                  <p className="text-slate-600 leading-relaxed">
                    «Αν διπλασιάσω το πρώτο ποσό, διπλασιάζεται και το δεύτερο;» Αν ναι, τότε προχωράμε στην επίλυση.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Αν έχουμε κιλά (kg) και γραμμάρια (g), τα μετατρέπουμε όλα σε g ή όλα σε kg πριν στήσουμε τον υπολογισμό.
              </div>
            </article>

            {/* Βημα 2ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">1η Μέθοδος</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Αναγωγή στη Μονάδα
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Βρίσκουμε πρώτα την τιμή που αντιστοιχεί στη <strong>1 μονάδα</strong> του πρώτου ποσού και στη συνέχεια πολλαπλασιάζουμε με το ζητούμενο πλήθος:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 space-y-1.5 text-xs sm:text-sm font-mono">
                  <div>1ο βήμα: Τιμή του 1 ＝ Αρχικό Κόστος : Αρχική Ποσότητα</div>
                  <div className="text-amber-900 font-bold">2ο βήμα: Ζητούμενο ＝ Τιμή του 1 · Νέα Ποσότητα</div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Είναι η πιο διαισθητική μέθοδος όταν η διαίρεση για τη μονάδα δίνει απλό ακέραιο ή δεκαδικό αριθμό.
              </div>
            </article>

            {/* Βημα 3ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">2η Μέθοδος</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Πίνακας &amp; Χιαστί (Αναλογία)
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Στήνουμε τα δεδομένα σε πίνακα ποσών και τιμών, θέτουμε τον άγνωστο ως <span className="font-bold font-mono">χ</span> και εφαρμόζουμε σταυρωτά γινόμενα:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 space-y-1.5 text-xs sm:text-sm text-center">
                  <div className="flex items-center justify-center font-bold text-indigo-950">
                    <Fraction num="α" den="γ" />
                    <span className="mx-2">＝</span>
                    <Fraction num="β" den="χ" />
                  </div>
                  <div className="font-mono font-bold text-indigo-800 text-sm pt-0.5">
                    χ ＝ (β · γ) : α
                  </div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Είναι η πιο ασφαλής μέθοδος, ειδικά όταν η διαίρεση για το 1 δεν είναι τέλεια και προτιμάμε να απλοποιήσουμε.
              </div>
            </article>

            {/* Βημα 4ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">3η Μέθοδος</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Συντελεστής Αναλογίας (λ)
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Υπολογίζουμε τον συντελεστή αναλογίας <span className="font-mono font-bold">λ ＝ ψ : χ</span> και έπειτα πολλαπλασιάζουμε κάθε νέα τιμή του <span className="font-mono font-bold">χ</span> με το <span className="font-mono font-bold">λ</span>:
                </p>

                <div className="space-y-1.5 text-xs sm:text-sm font-mono text-center">
                  <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 font-bold text-sm">
                    ψ ＝ λ · χ
                  </div>
                  <p className="text-slate-600 text-[11px] font-sans">
                    Εξαιρετικά χρήσιμη μέθοδος όταν έχουμε να συμπληρώσουμε πολλές διαφορετικές τιμές σε έναν πίνακα.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Και οι τρεις μέθοδοι οδηγούν πάντοτε στο ίδιο ακριβώς μαθηματικό αποτέλεσμα!
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΠΑΡΑΛΛΗΛΗ ΣΥΓΚΡΙΣΗ ΤΩΝ 3 ΜΕΘΟΔΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 sm:pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Δυναμική Σύγκριση των 3 Μεθόδων Επίλυσης
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Παράδειγμα: {itemsInitial} τετράδια κοστίζουν {costInitial} €. Πόσο κοστίζουν τα {itemsTarget} τετράδια; Δείτε πώς λύνεται το πρόβλημα με καθεμία από τις τρεις μεθόδους.
              </p>
            </div>
          </div>

          {/* Χειριστηρια Μεταβλητων Προβληματος */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 2xl:gap-6">
            
            {/* Αρχικη Ποσοτητα */}
            <div className="bg-blue-50/70 p-3.5 sm:p-4 rounded-2xl border border-blue-200 space-y-1.5">
              <div className="flex items-center justify-between text-left">
                <span className="text-[11px] sm:text-xs font-black uppercase text-blue-900 tracking-wider">
                  ΑΡΧΙΚΑ ΤΕΤΡΑΔΙΑ
                </span>
                <span className="font-mono font-black text-base sm:text-lg text-blue-600 bg-white px-2 py-0.5 rounded-lg border border-blue-200">
                  {itemsInitial}
                </span>
              </div>
              <div className="grid grid-cols-[34px_1fr_34px] items-center h-10 w-full gap-2">
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setItemsInitial((prev) => Math.max(2, prev - 1)); }}
                  disabled={itemsInitial <= 2}
                  className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                >
                  －
                </button>
                <input
                  type="range"
                  min={2}
                  max={8}
                  value={itemsInitial}
                  onChange={(e) => setItemsInitial(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setItemsInitial((prev) => Math.min(8, prev + 1)); }}
                  disabled={itemsInitial >= 8}
                  className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                >
                  ＋
                </button>
              </div>
            </div>

            {/* Αρχικο Κοστος */}
            <div className="bg-emerald-50/70 p-3.5 sm:p-4 rounded-2xl border border-emerald-200 space-y-1.5">
              <div className="flex items-center justify-between text-left">
                <span className="text-[11px] sm:text-xs font-black uppercase text-emerald-900 tracking-wider">
                  ΑΡΧΙΚΟ ΚΟΣΤΟΣ (€)
                </span>
                <span className="font-mono font-black text-base sm:text-lg text-emerald-600 bg-white px-2 py-0.5 rounded-lg border border-emerald-200">
                  {costInitial} €
                </span>
              </div>
              <div className="grid grid-cols-[34px_1fr_34px] items-center h-10 w-full gap-2">
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCostInitial((prev) => Math.max(4, prev - 2)); }}
                  disabled={costInitial <= 4}
                  className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                >
                  －
                </button>
                <input
                  type="range"
                  min={4}
                  max={24}
                  step={2}
                  value={costInitial}
                  onChange={(e) => setCostInitial(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCostInitial((prev) => Math.min(24, prev + 2)); }}
                  disabled={costInitial >= 24}
                  className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                >
                  ＋
                </button>
              </div>
            </div>

            {/* Ζητουμενη Ποσοτητα */}
            <div className="bg-amber-50/70 p-3.5 sm:p-4 rounded-2xl border border-amber-200 space-y-1.5">
              <div className="flex items-center justify-between text-left">
                <span className="text-[11px] sm:text-xs font-black uppercase text-amber-900 tracking-wider">
                  ΖΗΤΟΥΜΕΝΑ ΤΕΤΡΑΔΙΑ
                </span>
                <span className="font-mono font-black text-base sm:text-lg text-amber-600 bg-white px-2 py-0.5 rounded-lg border border-amber-200">
                  {itemsTarget}
                </span>
              </div>
              <div className="grid grid-cols-[34px_1fr_34px] items-center h-10 w-full gap-2">
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setItemsTarget((prev) => Math.max(3, prev - 1)); }}
                  disabled={itemsTarget <= 3}
                  className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                >
                  －
                </button>
                <input
                  type="range"
                  min={3}
                  max={20}
                  value={itemsTarget}
                  onChange={(e) => setItemsTarget(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setItemsTarget((prev) => Math.min(20, prev + 1)); }}
                  disabled={itemsTarget >= 20}
                  className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                >
                  ＋
                </button>
              </div>
            </div>

          </div>

          {/* 3 Καρτες Μεθοδων Επίλυσης */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 pt-1">
            
            {/* Μεθοδος 1: Αναγωγη στη Μοναδα */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-3.5 flex flex-col justify-between">
              <div className="space-y-2.5">
                <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs font-black rounded-lg inline-block">
                  ΜΕΘΟΔΟΣ 1: ΑΝΑΓΩΓΗ ΣΤΗ ΜΟΝΑΔΑ
                </span>
                <div className="space-y-2 text-xs sm:text-sm text-slate-700 font-mono">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-500 font-sans block text-[11px]">1ο Βήμα (Τιμή του 1):</span>
                    <div>{costInitial} : {itemsInitial} ＝ <strong>{formatNum(unitRate)} €</strong></div>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-500 font-sans block text-[11px]">2ο Βήμα (Για τα {itemsTarget}):</span>
                    <div>{itemsTarget} · {formatNum(unitRate)} ＝ <strong>{formatNum(targetCost)} €</strong></div>
                  </div>
                </div>
              </div>
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-center font-bold text-xs text-amber-900">
                Αποτέλεσμα: {formatNum(targetCost)} €
              </div>
            </div>

            {/* Μεθοδος 2: Πινακας & Χιαστι */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-3.5 flex flex-col justify-between">
              <div className="space-y-2.5">
                <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs font-black rounded-lg inline-block">
                  ΜΕΘΟΔΟΣ 2: ΠΙΝΑΚΑΣ &amp; ΧΙΑΣΤΙ
                </span>
                <div className="bg-white rounded-xl border border-slate-200 p-2 font-mono text-xs text-center space-y-1">
                  <div className="grid grid-cols-2 gap-2 font-bold border-b border-slate-200 pb-1 text-slate-500">
                    <span>Τετράδια</span>
                    <span>Κόστος (€)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 font-bold text-slate-800 text-xs sm:text-sm">
                    <span>{itemsInitial}</span>
                    <span>{costInitial}</span>
                    <span>{itemsTarget}</span>
                    <span className="text-indigo-600">χ</span>
                  </div>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono text-xs text-slate-700 text-center leading-relaxed">
                  χ ＝ ({costInitial} · {itemsTarget}) : {itemsInitial}<br />
                  χ ＝ {costInitial * itemsTarget} : {itemsInitial} ＝ <strong>{formatNum(targetCost)} €</strong>
                </div>
              </div>
              <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-200 text-center font-bold text-xs text-indigo-900">
                Αποτέλεσμα: {formatNum(targetCost)} €
              </div>
            </div>

            {/* Μεθοδος 3: Συντελεστης Αναλογιας */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-3.5 flex flex-col justify-between">
              <div className="space-y-2.5">
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs font-black rounded-lg inline-block">
                  ΜΕΘΟΔΟΣ 3: ΣΥΝΤΕΛΕΣΤΗΣ (λ)
                </span>
                <div className="space-y-2 text-xs sm:text-sm text-slate-700 font-mono">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-500 font-sans block text-[11px]">Εύρεση λ (ψ : χ):</span>
                    <div>λ ＝ {costInitial} : {itemsInitial} ＝ <strong>{formatNum(unitRate)}</strong></div>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-500 font-sans block text-[11px]">Τύπος (ψ ＝ λ · χ):</span>
                    <div>ψ ＝ {formatNum(unitRate)} · {itemsTarget} ＝ <strong>{formatNum(targetCost)} €</strong></div>
                  </div>
                </div>
              </div>
              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-center font-bold text-xs text-emerald-900">
                Αποτέλεσμα: {formatNum(targetCost)} €
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΣΥΝΘΕΤΟ ΠΡΟΒΛΗΜΑ ΜΕ ΜΕΤΑΤΡΟΠΗ ΜΟΝΑΔΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 sm:pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
                <span>🫒 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Σύνθετο Πρόβλημα: Παραγωγή Ελαιολάδου &amp; Μετατροπή ml σε l
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Από {olivesKgInitial} kg ελιές παράγονται {litersInitial} l λάδι. Πόσα kg ελιές απαιτούνται για να παραχθούν {targetMlLiters} ml λάδι;
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            
            {/* Βημα 1: Μετατροπη */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-2.5">
              <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs font-black rounded-lg inline-block">
                1ο ΒΗΜΑ: ΜΕΤΑΤΡΟΠΗ
              </span>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                Ίδιες Μονάδες Όγκου
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Το αρχικό λάδι δίνεται σε <strong>λίτρα (l)</strong> και το ζητούμενο σε <strong>χιλιοστόλιτρα (ml)</strong>:
              </p>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono font-bold text-slate-900 text-center text-xs sm:text-sm">
                {targetMlLiters} ml ＝ {formatNum(targetLitersClean)} l
              </div>
              <p className="text-[11px] text-slate-500 text-center">
                Διαιρέσαμε με το 1.000 (1 l ＝ 1.000 ml).
              </p>
            </div>

            {/* Βημα 2: Πινακας */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-2.5">
              <span className="px-2.5 py-1 bg-sky-100 text-sky-900 text-[11px] sm:text-xs font-black rounded-lg inline-block">
                2ο ΒΗΜΑ: ΠΙΝΑΚΑΣ ΠΟΣΩΝ
              </span>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                Οργάνωση Δεδομένων
              </h4>
              <div className="bg-white rounded-xl border border-slate-200 p-2 font-mono text-xs sm:text-sm text-center">
                <div className="grid grid-cols-2 gap-2 font-bold border-b border-slate-200 pb-1 text-slate-500">
                  <span>Ελαιόλαδο (l)</span>
                  <span>Ελιές (kg)</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1.5 font-bold text-slate-800">
                  <span>{litersInitial}</span>
                  <span>{olivesKgInitial}</span>
                  <span>{formatNum(targetLitersClean)}</span>
                  <span className="text-emerald-600 font-black">χ</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 text-center">
                Όλα τα μεγέθη της 1ης στήλης είναι πλέον σε λίτρα (l).
              </p>
            </div>

            {/* Βημα 3: Επιλυση */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-2.5">
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs font-black rounded-lg inline-block">
                3ο ΒΗΜΑ: ΕΠΙΛΥΣΗ
              </span>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                Υπολογισμός με Χιαστί
              </h4>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono text-xs sm:text-sm text-center space-y-1 text-emerald-950 font-bold">
                <div>χ ＝ ({olivesKgInitial} · {formatNum(targetLitersClean)}) : {litersInitial}</div>
                <div className="text-base sm:text-lg text-emerald-600 font-black pt-0.5">
                  χ ＝ {formatNum(targetOlivesKg)} kg
                </div>
              </div>
              <p className="text-[11px] text-slate-500 text-center">
                Απαιτούνται ακριβώς {formatNum(targetOlivesKg)} kg ελιές.
              </p>
            </div>

          </div>
        </section>

        {/* 5. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στα Προβλήματα με Ανάλογα Ποσά!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε 10 απαιτητικά ρεαλιστικά προβλήματα, εξασκήσου στην αναγωγή στη μονάδα και τη μέθοδο χιαστί και έλεγξε τις επιδόσεις σου.
            </p>
          </div>

          <Link
            href="/st-dimotikou/45-problem-analoga-posa-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-sm sm:text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 Έναρξη Ασκήσεων</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
