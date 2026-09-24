// pages/st-dimotikou/51-brisko-pososta.js
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

export default function BriskoPosostaTheoryPage() {
  // Εργαστηριο 1: Διαδραστικος Υπολογιστης Αυξησης / Μειωσης
  const [mode, setMode] = useState('discount'); // 'discount' (μειωση) η 'increase' (αυξηση)
  const [initialPrice, setInitialPrice] = useState(80); // Αρχικη τιμη σε €
  const [percentage, setPercentage] = useState(25); // Ποσοστο %

  // Υπολογισμοι Εργαστηριου 1
  const changeAmount = useMemo(() => {
    const raw = (initialPrice * percentage) / 100;
    return Number.isInteger(raw) ? raw : Number(raw.toFixed(2));
  }, [initialPrice, percentage]);

  const finalPrice = useMemo(() => {
    const raw = mode === 'discount' ? initialPrice - changeAmount : initialPrice + changeAmount;
    return Number.isInteger(raw) ? raw : Number(raw.toFixed(2));
  }, [initialPrice, changeAmount, mode]);

  const finalPercentage = mode === 'discount' ? 100 - percentage : 100 + percentage;

  // Εργαστηριο 2: Συγκριση των 2 Τροπων Υπολογισμου Τελικης Τιμης
  const [presetItemPrice, setPresetItemPrice] = useState(120);
  const [presetPct, setPresetPct] = useState(20);

  const presetDiscount = (presetItemPrice * presetPct) / 100;
  const presetFinal = presetItemPrice - presetDiscount;

  return (
    <Layout
      title="Εύρεση Ποσοστού & Τελικής Τιμής - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μαθαίνουμε πώς υπολογίζουμε το ποσοστό ενός ποσού, πώς βρίσκουμε την τελική τιμή μετά από αύξηση ή μείωση και γιατί τα ποσά στα ποσοστά είναι πάντα ανάλογα."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/51-brisko-pososta-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 Ασκήσεις</span>
        </Link>
      }
    >
      {/* Container πληρους ευρους για 2K & 4K και responsive για κινητα */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 space-y-10 2xl:space-y-14 pb-24">
        
        {/* 1. HEADER BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>ΚΕΦΑΛΑΙΟ 51 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Εύρεση Ποσοστού &amp; Τελικής Τιμής (Αύξηση – Μείωση)
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              Μαθαίνουμε πώς υπολογίζουμε το μέρος μιας αξίας όταν γνωρίζουμε το ποσοστό της, πώς προσδιορίζουμε την τελική τιμή μετά από έκπτωση ή αύξηση και γιατί τα ποσά στα ποσοστά είναι <strong>πάντα ανάλογα ποσά</strong>.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία, Λυμένα Προβλήματα &amp; Δυναμικός Εξομοιωτής Τελικής Τιμής</span>
            </div>
            <Link
              href="/st-dimotikou/51-brisko-pososta-ask"
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
              Οι Βασικές Αρχές των Ποσοστών σε 4 Βήματα
            </h2>
            <p className="text-slate-600 text-sm sm:text-base 2xl:text-xl mt-1">
              Πώς η θεωρία των ανάλογων ποσών εφαρμόζεται στην εύρεση εκπτώσεων, αυξήσεων και τελικών τιμών.
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
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Βασικός Κανόνας</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Τα Ποσά είναι ΠΑΝΤΑ Ανάλογα
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Σε όλα τα προβλήματα ποσοστών, η <strong>αρχική τιμή</strong> και το <strong>ποσό του ποσοστού</strong> συνδέονται με σχέση αναλογίας:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm text-center">
                  <p className="text-slate-700 leading-relaxed font-sans">
                    «Αν η αρχική τιμή διπλασιαστεί, τότε και το ποσό της έκπτωσης ή της αύξησης θα διπλασιαστεί.»
                  </p>
                  <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-200 text-blue-950 font-bold font-mono">
                    Συνεπώς: Ισχύει πάντα η μέθοδος των τριών και ο χιαστί πολλαπλασιασμός!
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Βάση αναφοράς είναι πάντοτε το <strong>100</strong> (η αρχική τιμή αντιστοιχεί στο 100%).
              </div>
            </article>

            {/* Βημα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Υπολογισμός</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Εύρεση του Ποσοστού
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Για να βρούμε πόσα ευρώ αντιστοιχούν σε ένα ποσοστό (π.χ. το 20% των 80 €), έχουμε δύο ισοδύναμους τρόπους:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm font-mono">
                  <div className="text-slate-800">
                    <strong>1. Με κλάσμα:</strong><br />
                    <Fraction num="20" den="100" /> · 80 ＝ <Fraction num="20 · 80" den="100" /> ＝ 16 €
                  </div>
                  <div className="text-indigo-900 pt-1">
                    <strong>2. Με αναλογία (Πίνακας):</strong><br />
                    100 ➔ 20 και 80 ➔ χ<br />
                    χ ＝ (80 · 20) : 100 ＝ 16 €
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ «Ποσοστό από ποσό» σημαίνει: Πολλαπλασιάζουμε το ποσό με το ποσοστό και διαιρούμε με το 100.
              </div>
            </article>

            {/* Βημα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Αύξηση &amp; Μείωση</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Έκπτωση ή Επιβάρυνση;
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Ανάλογα με το αν το προϊόν ακριβαίνει ή φθηναίνει, εκτελούμε την κατάλληλη πράξη:
                </p>

                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 font-medium">
                    🔻 <strong>Έκπτωση / Μείωση:</strong> Αφαιρούμε το ποσό της μείωσης από την αρχική τιμή.<br />
                    <span className="font-mono font-bold">Τελική Τιμή ＝ Αρχική Τιμή － Έκπτωση</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-medium">
                    🔺 <strong>Αύξηση / Φ.Π.Α. / Κέρδος:</strong> Προσθέτουμε το ποσό της αύξησης στην αρχική τιμή.<br />
                    <span className="font-mono font-bold">Τελική Τιμή ＝ Αρχική Τιμή ＋ Αύξηση</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Προσέχουμε πάντοτε τι ζητάει το πρόβλημα: το <em>ποσό της έκπτωσης</em> ή την <em>τελική τιμή πληρωμής</em>;
              </div>
            </article>

            {/* Βημα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Συντόμευση</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Υπολογισμός σε 1 Βήμα
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Μπορούμε να βρούμε κατευθείαν την τελική τιμή υπολογίζοντας το <strong>τελικό ποσοστό</strong>:
                </p>

                <div className="bg-slate-50 p-3.5 2xl:p-4 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm font-mono">
                  <div className="p-2 bg-white rounded-xl border border-slate-200 text-rose-900">
                    Έκπτωση 20% ➔ Πληρώνουμε το <strong>80 %</strong> (100 － 20)<br />
                    Τελική ＝ 80 · 0,80 ＝ <strong>64 €</strong>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200 text-emerald-900">
                    Αύξηση 24% ➔ Πληρώνουμε το <strong>124 %</strong> (100 ＋ 24)<br />
                    Τελική ＝ 80 · 1,24 ＝ <strong>99,20 €</strong>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Αυτή η τεχνική εξοικονομεί χρόνο και μειώνει τις πιθανότητες λάθους στις εξετάσεις!
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΕΞΟΜΟΙΩΤΗΣ ΑΥΞΗΣΗΣ / ΜΕΙΩΣΗΣ & ΤΕΛΙΚΗΣ ΤΙΜΗΣ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1</span>
              </div>
              <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Δυναμικός Υπολογιστής Ποσοστού &amp; Τελικής Τιμής
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Επιλέξτε ανάμεσα σε Έκπτωση (Μείωση) ή Αύξηση, προσαρμόστε την αρχική τιμή και το ποσοστό και παρακολουθήστε τον πίνακα αναλογίας και την τελική τιμή.
              </p>
            </div>

            {/* Διακοπτης Μειωσης η Αυξησης */}
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
            
            {/* Χειριστηρια Αρχικης Τιμης & Ποσοστου */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Αρχικη Τιμη */}
              <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-xs font-black uppercase text-blue-900 tracking-wider">
                    ΑΡΧΙΚΗ ΤΙΜΗ ΠΡΟΪΟΝΤΟΣ (€)
                  </span>
                  <span className="font-mono font-black text-lg text-blue-700 bg-white px-2.5 py-0.5 rounded-lg border border-blue-200">
                    {initialPrice} €
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setInitialPrice((prev) => Math.max(10, prev - 10)); }}
                    disabled={initialPrice <= 10}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={10}
                    max={200}
                    step={10}
                    value={initialPrice}
                    onChange={(e) => setInitialPrice(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setInitialPrice((prev) => Math.min(200, prev + 10)); }}
                    disabled={initialPrice >= 200}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Ποσοστο % */}
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
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPercentage((prev) => Math.max(5, prev - 5)); }}
                    disabled={percentage <= 5}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={5}
                    max={50}
                    step={5}
                    value={percentage}
                    onChange={(e) => setPercentage(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPercentage((prev) => Math.min(50, prev + 5)); }}
                    disabled={percentage >= 50}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

            </div>

            {/* Πινακας Αναλογιας & Αποτελεσματα */}
            <div className="lg:col-span-7 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                ΠΙΝΑΚΑΣ ΑΝΑΛΟΓΩΝ ΠΟΣΩΝ (ΒΑΣΗ ΤΟ 100)
              </div>

              {/* Πινακας 2x2 */}
              <div className="max-w-md mx-auto bg-white rounded-2xl border-2 border-slate-300 shadow-sm p-4 space-y-3 font-mono text-center">
                <div className="grid grid-cols-2 gap-2 border-b pb-2 font-bold text-slate-600 text-xs sm:text-sm">
                  <span className="bg-blue-50 py-1 rounded-lg text-blue-900">Αρχική Τιμή (€)</span>
                  <span className={mode === 'discount' ? 'bg-rose-50 py-1 rounded-lg text-rose-900' : 'bg-emerald-50 py-1 rounded-lg text-emerald-900'}>
                    {mode === 'discount' ? 'Έκπτωση (€)' : 'Αύξηση (€)'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2 text-lg sm:text-xl font-black text-slate-800">
                  <div className="bg-slate-100 p-2.5 rounded-xl">100</div>
                  <div className="bg-slate-100 p-2.5 rounded-xl">{percentage}</div>
                  <div className="bg-slate-100 p-2.5 rounded-xl">{initialPrice}</div>
                  <div className="bg-amber-100 p-2.5 rounded-xl text-amber-950 border border-amber-300 animate-pulse">
                    χ
                  </div>
                </div>
                <div className="text-xs font-sans text-slate-500 pt-1">
                  Χιαστί υπολογισμός: χ ＝ ({initialPrice} · {percentage}) : 100 ＝ <strong>{formatNum(changeAmount)} €</strong>
                </div>
              </div>

              {/* Τελικη Τιμη σε 2 Καρτες */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-center">
                <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-slate-500 uppercase block">
                    ΠΟΣΟ {mode === 'discount' ? 'ΕΚΠΤΩΣΗΣ' : 'ΑΥΞΗΣΗΣ'}
                  </span>
                  <div className={`font-mono font-black text-xl sm:text-2xl ${mode === 'discount' ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {mode === 'discount' ? '－ ' : '＋ '}{formatNum(changeAmount)} €
                  </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border-2 border-indigo-200 space-y-1">
                  <span className="text-xs font-bold text-indigo-900 uppercase block">
                    ΤΕΛΙΚΗ ΤΙΜΗ ΠΛΗΡΩΜΗΣ
                  </span>
                  <div className="font-mono font-black text-2xl sm:text-3xl text-indigo-700">
                    {formatNum(finalPrice)} €
                  </div>
                  <span className="text-[11px] text-slate-500 block font-sans">
                    {initialPrice} {mode === 'discount' ? '－' : '＋'} {formatNum(changeAmount)} ＝ {formatNum(finalPrice)} €
                  </span>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 4. ΛΥΜΕΝΑ ΠΑΡΑΔΕΙΓΜΑΤΑ ΠΡΟΒΛΗΜΑΤΩΝ */}
        <section className="space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight">
              Λυμένα Παραδείγματα Προβλημάτων
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Δύο κλασικά προβλήματα καθημερινής ζωής με αναλυτική παρουσίαση των βημάτων επίλυσης.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Παραδειγμα 1: Εκπτωση */}
            <article className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-rose-100 text-rose-900 text-xs font-black rounded-lg">
                  ΠΡΟΒΛΗΜΑ 1: ΕΚΠΤΩΣΗ (ΜΕΙΩΣΗ)
                </span>
                <span className="text-xs font-bold text-slate-400">Είδη Ένδυσης</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Αγορά Μπουφάν σε Περίοδο Εκπτώσεων
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ένα μπουφάν είχε αρχική τιμή <strong>120 €</strong>. Στις χειμερινές εκπτώσεις το κατάστημα προσφέρει έκπτωση <strong>30 %</strong>. Πόσα ευρώ είναι η έκπτωση και ποια είναι η τελική τιμή του μπουφάν;
              </p>

              <div className="space-y-2.5 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήμα 1: Υπολογισμός ποσού έκπτωσης</span>
                  <div>Έκπτωση ＝ <Fraction num="30" den="100" /> · 120 ＝ (30 · 120) : 100 ＝ 3.600 : 100 ＝ <strong className="text-rose-700">36 €</strong></div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήμα 2: Υπολογισμός τελικής τιμής</span>
                  <div>Τελική Τιμή ＝ 120 € － 36 € ＝ <strong className="text-emerald-700 text-base">84 €</strong></div>
                </div>
              </div>

              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-950 font-medium">
                💡 <strong>Σύντομος τρόπος (1 βήμα):</strong> Αφού η έκπτωση είναι 30%, ο αγοραστής πληρώνει το 70% (100 － 30). Άρα: 120 · 0,70 ＝ <strong>84 €</strong>.
              </div>
            </article>

            {/* Παραδειγμα 2: Αυξηση / ΦΠΑ */}
            <article className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-black rounded-lg">
                  ΠΡΟΒΛΗΜΑ 2: ΑΥΞΗΣΗ (Φ.Π.Α.)
                </span>
                <span className="text-xs font-bold text-slate-400">Ηλεκτρονικές Συσκευές</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Τιμολόγηση Υπολογιστή με Φ.Π.Α.
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ένα tablet έχει καθαρή αξία (χωρίς φόρο) <strong>250 €</strong>. Στην τιμή αυτή επιβάλλεται φόρος Φ.Π.Α. <strong>24 %</strong>. Πόσα ευρώ είναι ο φόρος και ποια είναι η τελική τιμή που θα πληρώσει ο πελάτης;
              </p>

              <div className="space-y-2.5 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήμα 1: Υπολογισμός ποσού Φ.Π.Α.</span>
                  <div>Φόρος ＝ <Fraction num="24" den="100" /> · 250 ＝ (24 · 250) : 100 ＝ 6.000 : 100 ＝ <strong className="text-indigo-700">60 €</strong></div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήμα 2: Υπολογισμός τελικής τιμής</span>
                  <div>Τελική Τιμή ＝ 250 € ＋ 60 € ＝ <strong className="text-emerald-700 text-base">310 €</strong></div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 font-medium">
                💡 <strong>Σύντομος τρόπος (1 βήμα):</strong> Μαζί με τον φόρο πληρώνουμε το 124% (100 ＋ 24). Άρα: 250 · 1,24 ＝ <strong>310 €</strong>.
              </div>
            </article>

          </div>
        </section>

        {/* 5. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στην Εύρεση Ποσοστού &amp; Τελικής Τιμής!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε 10 απαιτητικές ασκήσεις με προβλήματα εκπτώσεων, αυξήσεων, υπολογισμούς τελικών τιμών και έλεγχο λογικής για τη ΣΤ' Δημοτικού.
            </p>
          </div>

          <Link
            href="/st-dimotikou/50-brisko-pososta-ask"
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
