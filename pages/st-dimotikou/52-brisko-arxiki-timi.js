// pages/st-dimotikou/52-brisko-arxiki-timi.js
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

// Μορφοποιηση αριθμου (ακεραιος η δεκαδικος με κομμα)
function formatNum(val, decimals = 2) {
  if (Number.isInteger(val)) return String(val);
  const rounded = Number(val.toFixed(decimals));
  return String(rounded).replace('.', ',');
}

export default function BriskoArxikiTimiTheoryPage() {
  // Εργαστηριο 1: Διαδραστικος Ανιχνευτης Αρχικης Τιμης
  const [mode, setMode] = useState('discount'); // 'discount' (εκπτωση) η 'increase' (αυξηση/ΦΠΑ)
  const [finalPrice, setFinalPrice] = useState(72); // Τελικη τιμη σε € (step 1)
  const [percentage, setPercentage] = useState(20); // Ποσοστο % (step 1)

  // Ποσοστο στο οποιο αντιστοιχει η τελικη τιμη
  const finalPercentage = mode === 'discount' ? 100 - percentage : 100 + percentage;

  // Υπολογισμος Αρχικης Τιμης: (finalPrice * 100) / finalPercentage
  const calculatedOriginalPrice = useMemo(() => {
    if (finalPercentage <= 0) return 0;
    const raw = (finalPrice * 100) / finalPercentage;
    return Number.isInteger(raw) ? raw : Number(raw.toFixed(2));
  }, [finalPrice, finalPercentage]);

  // Ποσο διαφορας (εκπτωση η αυξηση σε €)
  const differenceAmount = useMemo(() => {
    return Math.abs(Number((calculatedOriginalPrice - finalPrice).toFixed(2)));
  }, [calculatedOriginalPrice, finalPrice]);

  // Εργαστηριο 2: Αναδειξη της Μεγαλης Παγιδας
  const [trapPrice, setTrapPrice] = useState(80);
  const [trapPct, setTrapPct] = useState(20);

  // Σωστος υπολογισμος αρχικης τιμης μετα απο εκπτωση 20%
  const correctOriginal = useMemo(() => {
    return Number(((trapPrice * 100) / (100 - trapPct)).toFixed(2));
  }, [trapPrice, trapPct]);

  // Λανθασμενος υπολογισμος: προσθεση του 20% πανω στα 80 €
  const wrongOriginal = useMemo(() => {
    return Number((trapPrice + (trapPrice * trapPct) / 100).toFixed(2));
  }, [trapPrice, trapPct]);

  return (
    <Layout
      title="Εύρεση Αρχικής Τιμής στα Ποσοστά - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μαθαίνουμε πώς να υπολογίζουμε την αρχική τιμή ενός ποσού όταν γνωρίζουμε την τελική τιμή και το ποσοστό αύξησης ή έκπτωσης, με διαδραστικά εργαστήρια."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/52-brisko-arxiki-timi-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 Ασκήσεις</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 space-y-10 2xl:space-y-14 pb-24">
        
        {/* 1. HEADER BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>ΚΕΦΑΛΑΙΟ 52 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Εύρεση της Αρχικής Τιμής στα Ποσοστά
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              Κάνουμε την αντίστροφη πορεία: Γνωρίζουμε πόσο πληρώσαμε στο ταμείο (τελική τιμή) και το ποσοστό έκπτωσης ή αύξησης, και υπολογίζουμε πόσο κόστιζε αρχικά το προϊόν πριν από τη μεταβολή.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία, Λυμένα Παραδείγματα &amp; Εξομοιωτής Αρχικής Τιμής</span>
            </div>
            <Link
              href="/st-dimotikou/52-brisko-arxiki-timi-ask"
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
              Η Αντίστροφη Πορεία σε 4 Βήματα
            </h2>
            <p className="text-slate-600 text-sm sm:text-base 2xl:text-xl mt-1">
              Πώς αποφεύγουμε τη μεγαλύτερη παγίδα των ποσοστών και βρίσκουμε την ακριβή αρχική αξία.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 gap-6 2xl:gap-8">
            
            {/* Βημα 1ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-sky-100 text-sky-800 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 1
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Βασική Αρχή</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Το 100% είναι η Αρχική Τιμή
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Στα Μαθηματικά, η βάση αναφοράς <strong>100% αντιστοιχεί ΠΑΝΤΑ στην αρχική τιμή</strong> πριν από οποιαδήποτε αλλαγή:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm text-center">
                  <div className="p-2 bg-blue-50 rounded-xl border border-blue-200 text-blue-950 font-bold font-mono">
                    Αρχική Τιμή ＝ 100 % (άγνωστο χ)
                  </div>
                  <p className="text-slate-500 text-xs pt-1 font-sans">
                    Η τελική τιμή που πληρώνουμε δεν είναι ποτέ το 100%. Είναι είτε λιγότερο (έκπτωση) είτε περισσότερο (αύξηση).
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Αυτό είναι το κλειδί για να στήσουμε σωστά την αναλογία!
              </div>
            </article>

            {/* Βημα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-rose-100 text-rose-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Προσοχή</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Η Μεγάλη Παγίδα!
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  <strong>ΔΕΝ υπολογίζουμε ποτέ το ποσοστό πάνω στην τελική τιμή!</strong>
                </p>

                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-950">
                    ❌ <strong>Λάθος:</strong> «Πλήρωσα 80 € με έκπτωση 20%, άρα η αρχική ήταν 80 ＋ 20% των 80 ＝ 96 €.»
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                    ✓ <strong>Σωστό:</strong> Τα 80 € αντιστοιχούν στο 80% (100 － 20). Άρα η αρχική τιμή ήταν 100 €.
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-200 text-xs 2xl:text-sm text-rose-950 font-medium">
                ⚡ Η έκπτωση αφαιρέθηκε από την αρχική τιμή, όχι από αυτήν που πληρώσαμε στο ταμείο!
              </div>
            </article>

            {/* Βημα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Μέθοδος 1</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Πίνακας &amp; Χιαστί
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Στήνουμε έναν πίνακα ποσών και τιμών συγκρίνοντας το θεωρητικό 100 με τα πραγματικά δεδομένα:
                </p>

                <div className="bg-slate-50 p-3.5 2xl:p-4 rounded-2xl border border-slate-200 font-mono text-xs sm:text-sm space-y-1.5 text-center">
                  <div className="grid grid-cols-2 gap-2 border-b pb-1 font-bold text-slate-600">
                    <span>Αρχική Τιμή</span>
                    <span>Τελική Τιμή</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 font-bold text-slate-800">
                    <span>100</span>
                    <span>100 ± π</span>
                    <span className="text-indigo-600">χ</span>
                    <span>Τελική Τιμή</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-sans pt-1">
                    χ ＝ (Τελική Τιμή · 100) : (100 ± π)
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Επειδή όλα τα ποσοστά είναι ανάλογα ποσά, ο χιαστί πολλαπλασιασμός δίνει άμεσα τη λύση.
              </div>
            </article>

            {/* Βημα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Μέθοδος 2</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Διαίρεση με Δεκαδικό
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Η ταχύτερη μέθοδος: <strong>διαιρούμε την τελική τιμή με τον δεκαδικό συντελεστή</strong> του τελικού ποσοστού:
                </p>

                <div className="bg-slate-50 p-3.5 2xl:p-4 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm font-mono">
                  <div className="p-2 bg-white rounded-xl border border-slate-200 text-rose-900">
                    Έκπτωση 20% ➔ Τελικό ποσοστό 80% (0,80)<br />
                    Αρχική ＝ 72 : <strong>0,80</strong> ＝ <strong>90 €</strong>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200 text-emerald-900">
                    Φ.Π.Α. 24% ➔ Τελικό ποσοστό 124% (1,24)<br />
                    Αρχική ＝ 124 : <strong>1,24</strong> ＝ <strong>100 €</strong>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Για να πάμε από την αρχική στην τελική πολλαπλασιάζουμε. Για να γυρίσουμε στην αρχική, <strong>διαιρούμε</strong>!
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΑΝΙΧΝΕΥΤΗΣ ΑΡΧΙΚΗΣ ΤΙΜΗΣ (STEP 1) */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1</span>
              </div>
              <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Δυναμικός Εξομοιωτής Εύρεσης Αρχικής Τιμής
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Ορίστε την τιμή που πληρώσατε (τελική τιμή) και το ποσοστό έκπτωσης ή επιβάρυνσης και δείτε τον πίνακα αναλογίας και την αρχική τιμή πριν από την αλλαγή.
              </p>
            </div>

            {/* Διακοπτης Εκπτωσης η Αυξησης */}
            <div className="inline-flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start sm:self-center">
              <button
                type="button"
                onClick={() => setMode('discount')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                  mode === 'discount'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🔻 Έκπτωση (Μείωση)
              </button>
              <button
                type="button"
                onClick={() => setMode('increase')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                  mode === 'increase'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🔺 Αύξηση / Φ.Π.Α.
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Χειριστηρια Τελικης Τιμης & Ποσοστου (Step 1) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Τελικη Τιμη (Step 1) */}
              <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-200 space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-xs font-black uppercase text-indigo-900 tracking-wider">
                    ΤΕΛΙΚΗ ΤΙΜΗ ΠΛΗΡΩΜΗΣ (€)
                  </span>
                  <span className="font-mono font-black text-lg text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-indigo-200">
                    {finalPrice} €
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFinalPrice((prev) => Math.max(1, prev - 1)); }}
                    disabled={finalPrice <= 1}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={1}
                    max={200}
                    step={1}
                    value={finalPrice}
                    onChange={(e) => setFinalPrice(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFinalPrice((prev) => Math.min(200, prev + 1)); }}
                    disabled={finalPrice >= 200}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Ποσοστο % (Step 1) */}
              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-xs font-black uppercase text-amber-900 tracking-wider">
                    ΠΟΣΟΣΤΟ {mode === 'discount' ? 'ΕΚΠΤΩΣΗΣ' : 'ΑΥΞΗΣΗΣ'} (%)
                  </span>
                  <span className="font-mono font-black text-lg text-amber-700 bg-white px-2.5 py-0.5 rounded-lg border border-amber-200">
                    {percentage} %
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPercentage((prev) => Math.max(1, prev - 1)); }}
                    disabled={percentage <= 1}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={1}
                    max={mode === 'discount' ? 90 : 100}
                    step={1}
                    value={percentage}
                    onChange={(e) => setPercentage(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPercentage((prev) => Math.min(mode === 'discount' ? 90 : 100, prev + 1)); }}
                    disabled={percentage >= (mode === 'discount' ? 90 : 100)}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
                📌 <strong>Συσχέτιση Ποσοστών:</strong><br />
                {mode === 'discount' ? (
                  <span>Η τελική τιμή {finalPrice} € αντιστοιχεί στο 100 % － {percentage} % ＝ <strong>{finalPercentage} %</strong> της αρχικής τιμής.</span>
                ) : (
                  <span>Η τελική τιμή {finalPrice} € αντιστοιχεί στο 100 % ＋ {percentage} % ＝ <strong>{finalPercentage} %</strong> της αρχικής τιμής.</span>
                )}
              </div>

            </div>

            {/* Πινακας Αναλογιας & Υπολογισμος Αρχικης Τιμης */}
            <div className="lg:col-span-7 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                ΠΙΝΑΚΑΣ ΑΝΑΛΟΓΩΝ ΠΟΣΩΝ ΓΙΑ ΤΗΝ ΑΡΧΙΚΗ ΤΙΜΗ
              </div>

              {/* Πινακας 2x2 */}
              <div className="max-w-md mx-auto bg-white rounded-2xl border-2 border-slate-300 shadow-sm p-4 space-y-3 font-mono text-center">
                <div className="grid grid-cols-2 gap-2 border-b pb-2 font-bold text-slate-600 text-xs sm:text-sm">
                  <span className="bg-blue-50 py-1 rounded-lg text-blue-900">Αρχική Τιμή (€)</span>
                  <span className="bg-indigo-50 py-1 rounded-lg text-indigo-900">Τελική Τιμή (€)</span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2 text-lg sm:text-xl font-black text-slate-800">
                  <div className="bg-slate-100 p-2.5 rounded-xl">100</div>
                  <div className="bg-slate-100 p-2.5 rounded-xl">{finalPercentage}</div>
                  <div className="bg-amber-100 p-2.5 rounded-xl text-amber-950 border border-amber-300 animate-pulse">
                    χ
                  </div>
                  <div className="bg-slate-100 p-2.5 rounded-xl">{finalPrice}</div>
                </div>
                <div className="text-xs font-sans text-slate-500 pt-1">
                  Χιαστί υπολογισμός: χ ＝ ({finalPrice} · 100) : {finalPercentage} ＝ <strong>{formatNum(calculatedOriginalPrice)} €</strong>
                </div>
              </div>

              {/* Καρτες Αποτελεσματος */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-center">
                <div className="p-4 bg-white rounded-2xl border-2 border-blue-200 space-y-1">
                  <span className="text-xs font-bold text-blue-900 uppercase block">
                    ΑΡΧΙΚΗ ΤΙΜΗ ΠΡΟΪΟΝΤΟΣ
                  </span>
                  <div className="font-mono font-black text-2xl sm:text-3xl text-blue-700">
                    {formatNum(calculatedOriginalPrice)} €
                  </div>
                  <span className="text-[11px] text-slate-500 block font-sans">
                    (Αντιστοιχεί στο 100%)
                  </span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-slate-500 uppercase block">
                    ΠΟΣΟ {mode === 'discount' ? 'ΕΚΠΤΩΣΗΣ' : 'ΑΥΞΗΣΗΣ'}
                  </span>
                  <div className={`font-mono font-black text-xl sm:text-2xl ${mode === 'discount' ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {formatNum(differenceAmount)} €
                  </div>
                  <span className="text-[11px] text-slate-500 block font-sans">
                    Διαφορά αρχικής και τελικής τιμής
                  </span>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΑΠΟΦΥΓΗ ΤΗΣ ΜΕΓΑΛΗΣ ΠΑΓΙΔΑΣ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-xs 2xl:text-sm font-bold text-rose-800 mb-1">
              <span>⚠️ ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΣΥΓΚΡΙΣΗ</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Γιατί το 20% της Τελικής Τιμής είναι ΛΑΘΟΣ;
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Ας εξετάσουμε ένα προϊόν που πληρώσαμε <strong>{trapPrice} €</strong> μετά από έκπτωση <strong>{trapPct} %</strong>:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Λανθασμενος τροπος */}
            <div className="bg-rose-50/50 p-6 rounded-3xl border-2 border-rose-200 space-y-3">
              <span className="px-3 py-1 bg-rose-100 text-rose-900 text-xs font-black rounded-lg inline-block">
                ❌ Ο ΛΑΝΘΑΣΜΕΝΟΣ ΤΡΟΠΟΣ
              </span>
              <h4 className="font-bold text-rose-950 text-base">
                Υπολογισμός πάνω στα {trapPrice} €
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Πολλοί μαθητές προσθέτουν λανθασμένα το {trapPct}% της τελικής τιμής:
              </p>
              <div className="p-3 bg-white rounded-xl border border-rose-200 font-mono text-xs sm:text-sm text-rose-900 space-y-1">
                <div>Έκπτωση: ({trapPrice} · {trapPct}) : 100 ＝ {formatNum((trapPrice * trapPct) / 100)} €</div>
                <div className="font-bold text-base">Αρχική: {trapPrice} ＋ {formatNum((trapPrice * trapPct) / 100)} ＝ {formatNum(wrongOriginal)} €</div>
              </div>
              <p className="text-xs text-rose-700 font-semibold">
                Αν κάνουμε έκπτωση {trapPct}% στα {formatNum(wrongOriginal)} €, θα πάρουμε {formatNum(wrongOriginal * (1 - trapPct / 100))} € και ΟΧΙ {trapPrice} €!
              </p>
            </div>

            {/* Σωστος τροπος */}
            <div className="bg-emerald-50/50 p-6 rounded-3xl border-2 border-emerald-200 space-y-3">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-black rounded-lg inline-block">
                ✓ Ο ΣΩΣΤΟΣ ΜΑΘΗΜΑΤΙΚΟΣ ΤΡΟΠΟΣ
              </span>
              <h4 className="font-bold text-emerald-950 text-base">
                Αναγωγή στο 100% της Αρχικής
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Τα {trapPrice} € αντιστοιχούν στο {100 - trapPct}% της αρχικής τιμής:
              </p>
              <div className="p-3 bg-white rounded-xl border border-emerald-200 font-mono text-xs sm:text-sm text-emerald-950 space-y-1">
                <div>Αναλογία: ({trapPrice} · 100) : {100 - trapPct}</div>
                <div className="font-bold text-base text-emerald-700">Αρχική Τιμή ＝ {formatNum(correctOriginal)} €</div>
              </div>
              <p className="text-xs text-emerald-800 font-semibold">
                Επαλήθευση: {formatNum(correctOriginal)} € － {trapPct}% ＝ {formatNum(correctOriginal * (1 - trapPct / 100))} € ακριβώς!
              </p>
            </div>

          </div>
        </section>

        {/* 5. ΛΥΜΕΝΑ ΠΑΡΑΔΕΙΓΜΑΤΑ ΠΡΟΒΛΗΜΑΤΩΝ */}
        <section className="space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight">
              Λυμένα Προβλήματα Εύρεσης Αρχικής Τιμής
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Δύο παραδείγματα με αναλυτική παρουσίαση της μεθόδου των τριών και της απευθείας διαίρεσης.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Παραδειγμα 1: Εκπτωση */}
            <article className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-rose-100 text-rose-900 text-xs font-black rounded-lg">
                  ΠΡΟΒΛΗΜΑ 1: ΑΡΧΙΚΗ ΤΙΜΗ ΜΕΤΑ ΑΠΟ ΕΚΠΤΩΣΗ
                </span>
                <span className="text-xs font-bold text-slate-400">Ένδυση</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Αγορά Παπουτσιών στις Εκπτώσεις
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ένας πελάτης αγόρασε ένα ζευγάρι αθλητικά παπούτσια πληρώνοντας <strong>84 €</strong>, καθώς το κατάστημα είχε έκπτωση <strong>30 %</strong>. Ποια ήταν η αρχική τιμή των παπουτσιών πριν από την έκπτωση;
              </p>

              <div className="space-y-2.5 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήμα 1: Ποσοστό τελικής πληρωμής</span>
                  <div>Τελικό ποσοστό ＝ 100 % － 30 % ＝ <strong>70 %</strong></div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήμα 2: Υπολογισμός αρχικής τιμής</span>
                  <div>Με πίνακα (χιαστί): χ ＝ (84 · 100) : 70 ＝ 8.400 : 70 ＝ <strong className="text-blue-700 text-base">120 €</strong></div>
                  <div>Με δεκαδικό συντελεστή: 84 : 0,70 ＝ <strong className="text-blue-700 text-base">120 €</strong></div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 font-medium">
                ✓ <strong>Επαλήθευση:</strong> Το 30% των 120 € είναι 36 €. Τελική τιμή: 120 － 36 ＝ 84 €.
              </div>
            </article>

            {/* Παραδειγμα 2: ΦΠΑ */}
            <article className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-black rounded-lg">
                  ΠΡΟΒΛΗΜΑ 2: ΚΑΘΑΡΗ ΑΞΙΑ ΠΡΟ ΦΟΡΟΥ (Φ.Π.Α.)
                </span>
                <span className="text-xs font-bold text-slate-400">Τιμολόγιο</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Αγορά Laptop με Συμπεριλαμβανόμενο Φ.Π.Α.
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Σε ένα τιμολόγιο αγοράς υπολογιστή, η τελική τιμή πληρωμής μαζί με τον φόρο Φ.Π.Α. <strong>24 %</strong> ήταν <strong>620 €</strong>. Ποια ήταν η καθαρή αρχική αξία του υπολογιστή χωρίς τον φόρο;
              </p>

              <div className="space-y-2.5 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήμα 1: Ποσοστό τελικής πληρωμής</span>
                  <div>Τελικό ποσοστό ＝ 100 % ＋ 24 % ＝ <strong>124 %</strong></div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήμα 2: Υπολογισμός αρχικής καθαρής αξίας</span>
                  <div>Με πίνακα (χιαστί): χ ＝ (620 · 100) : 124 ＝ 62.000 : 124 ＝ <strong className="text-blue-700 text-base">500 €</strong></div>
                  <div>Με δεκαδικό συντελεστή: 620 : 1,24 ＝ <strong className="text-blue-700 text-base">500 €</strong></div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 font-medium">
                ✓ <strong>Επαλήθευση:</strong> Ο φόρος 24% στα 500 € είναι 120 €. Τελική αξία: 500 ＋ 120 ＝ 620 €.
              </div>
            </article>

          </div>
        </section>

        {/* 6. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στην Εύρεση της Αρχικής Τιμής!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε 10 απαιτητικές ασκήσεις υπολογισμού αρχικής αξίας, αντιστοίχισης ποσοστών και αποφυγής λαθών για τη ΣΤ' Δημοτικού.
            </p>
          </div>

          <Link
            href="/st-dimotikou/52-brisko-arxiki-timi-ask"
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
