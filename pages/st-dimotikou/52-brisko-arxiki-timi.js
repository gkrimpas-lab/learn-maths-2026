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

// Μορφοποιηση αριθμου
function formatNum(val, decimals = 2) {
  if (Number.isInteger(val)) return String(val);
  const rounded = Number(val.toFixed(decimals));
  return String(rounded).replace('.', ',');
}

export default function BriskoArxikiTimiTheoryPage() {
  // Εργαστηριο 1: Διαδραστικος Υπολογιστης Αρχικης Τιμης
  const [calcType, setCalcType] = useState('discount'); // 'discount' η 'increase'
  const [finalPrice, setFinalPrice] = useState(80);     // Τελική τιμή σε €
  const [percentage, setPercentage] = useState(20);     // Ποσοστό %

  // Υπολογισμός ποσοστού τελικής τιμής
  const finalPercentage = useMemo(() => {
    return calcType === 'discount' ? 100 - percentage : 100 + percentage;
  }, [calcType, percentage]);

  // Υπολογισμός αρχικής τιμής: (finalPrice * 100) / finalPercentage
  const initialPrice = useMemo(() => {
    if (finalPercentage <= 0) return 0;
    const raw = (finalPrice * 100) / finalPercentage;
    return Number.isInteger(raw) ? raw : Number(raw.toFixed(2));
  }, [finalPrice, finalPercentage]);

  // Διαφορά (ποσό έκπτωσης ή αύξησης)
  const priceDiff = useMemo(() => {
    return Math.abs(Number((initialPrice - finalPrice).toFixed(2)));
  }, [initialPrice, finalPrice]);

  return (
    <Layout
      title="Εύρεση Αρχικής Τιμής στα Ποσοστά - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μαθαίνουμε πώς υπολογίζουμε την αρχική τιμή όταν γνωρίζουμε την τελική τιμή και το ποσοστό έκπτωσης ή αύξησης, αποφεύγοντας τη μεγάλη παγίδα των ποσοστών."
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
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 space-y-8 sm:space-y-10 2xl:space-y-14 pb-24 overflow-x-hidden">
        
        {/* 1. HEADER BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>ΚΕΦΑΛΑΙΟ 52 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Εύρεση της Αρχικής Τιμής
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-2xl leading-relaxed max-w-4xl">
              Μαθαίνουμε πώς να υπολογίζουμε πόσο κόστιζε ένα προϊόν <strong>πριν</strong> από την έκπτωση ή τον φόρο (Φ.Π.Α.), όταν γνωρίζουμε μόνο την τελική τιμή πληρωμής και το ποσοστό μεταβολής, αποφεύγοντας τη μεγάλη μαθηματική παγίδα.
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία, Η Μεγάλη Παγίδα &amp; Διαδραστικός Υπολογιστής Αρχικής Τιμής</span>
            </div>
            <Link
              href="/st-dimotikou/52-brisko-arxiki-timi-ask"
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
              Η Μεθοδολογία σε 4 Βήματα
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Πώς οδηγούμαστε με ασφάλεια στην αρχική τιμή (το 100%) χωρίς να παρασυρθούμε σε λάθος πράξεις.
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
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Ποσοστό Τελικής</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Σε ποιο ποσοστό αντιστοιχεί;
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Η τελική τιμή <strong>δεν</strong> είναι το 100%. Αντιστοιχεί σε ποσοστό μικρότερο ή μεγαλύτερο του 100%:
                </p>

                <div className="space-y-2 text-[11px] sm:text-xs font-mono">
                  <div className="p-2 bg-rose-50 rounded-xl border border-rose-200 text-rose-950">
                    🔻 <strong>Σε Έκπτωση 20%:</strong><br />
                    Πληρώνουμε το 100% － 20% ＝ <strong>80%</strong>
                  </div>
                  <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950">
                    🔺 <strong>Σε Αύξηση / Φ.Π.Α. 24%:</strong><br />
                    Πληρώνουμε το 100% ＋ 24% ＝ <strong>124%</strong>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Βρίσκουμε πρώτα σε ποιο ποσοστό της αρχικής τιμής αντιστοιχεί το ποσό που πληρώσαμε.
              </div>
            </article>

            {/* Βημα 2ο - Η Μεγάλη Παγίδα */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border-2 border-rose-300 shadow-sm flex flex-col justify-between space-y-5 bg-rose-50/20">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-rose-100 text-rose-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-bold text-rose-600">ΠΡΟΣΟΧΗ!</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-rose-950">
                  Η Μεγάλη Παγίδα!
                </h3>
                <p className="text-slate-700 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Αν πληρώσαμε 80 € μετά από έκπτωση 20%, <strong>ΕΙΝΑΙ ΛΑΘΟΣ</strong> να υπολογίσουμε το 20% των 80 € και να το προσθέσουμε:
                </p>

                <div className="bg-white p-3 rounded-2xl border border-rose-200 space-y-1.5 text-xs text-center font-mono">
                  <div className="text-rose-600 font-black line-through">
                    80 ＋ (20% των 80) ＝ 80 ＋ 16 ＝ 96 € (ΛΑΘΟΣ!)
                  </div>
                  <p className="text-slate-600 text-[11px] pt-1 font-sans">
                    Το 20% αφαιρέθηκε από την <em>αρχική τιμή</em> (που ήταν 100 €) και όχι από τα 80 €!
                  </p>
                </div>
              </div>

              <div className="p-3 bg-rose-100/60 rounded-2xl border border-rose-300 text-xs 2xl:text-sm text-rose-950 font-medium">
                ⚡ Κανόνας: Ποτέ δεν εφαρμόζουμε το ποσοστό στην τελική τιμή για να βρούμε την αρχική!
              </div>
            </article>

            {/* Βημα 3ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Μέθοδος 1</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Πίνακας Ποσών (Χιαστί)
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Στήνουμε έναν πίνακα συσχετίζοντας την αρχική τιμή (100) με την τελική τιμή:
                </p>

                <div className="bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-200 font-mono text-xs space-y-1 text-center">
                  <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-1 font-bold text-slate-600 text-[11px]">
                    <span>Αρχική (€)</span>
                    <span>Τελική (€)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 font-bold text-slate-800">
                    <span>100</span>
                    <span>100 － Έκπτωση</span>
                    <span className="text-indigo-600">χ</span>
                    <span>Τελική Τιμή</span>
                  </div>
                  <div className="text-[10.5px] text-slate-500 font-sans pt-1">
                    χ ＝ (Τελική · 100) : (100 － Έκπτωση)
                  </div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Ο πίνακας προστατεύει από λάθη γιατί τοποθετεί τον άγνωστο χ κάτω από το 100.
              </div>
            </article>

            {/* Βημα 4ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Μέθοδος 2</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Δεκαδικός Συντελεστής
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Η ταχύτερη μέθοδος: διαιρούμε απευθείας την τελική τιμή με τον δεκαδικό συντελεστή του ποσοστού:
                </p>

                <div className="bg-slate-50 p-2.5 sm:p-3.5 rounded-2xl border border-slate-200 space-y-1.5 text-xs font-mono text-center">
                  <div className="p-1.5 bg-white rounded-xl border border-slate-200 text-slate-800 font-bold text-[11px] sm:text-xs">
                    Αρχική ＝ Τελική : Συντελεστή
                  </div>
                  <p className="text-slate-600 text-[10.5px] font-sans">
                    • Έκπτωση 20% ➔ Διαίρεση με <strong>0,80</strong> (80 : 0,80 ＝ 100 €)<br />
                    • Φ.Π.Α. 24% ➔ Διαίρεση με <strong>1,24</strong>
                  </p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Μία απλή διαίρεση δίνει απευθείας την αρχική τιμή.
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΥΠΟΛΟΓΙΣΤΗΣ ΑΡΧΙΚΗΣ ΤΙΜΗΣ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 sm:pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Δυναμικός Εξομοιωτής Εύρεσης Αρχικής Τιμής
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Επιλέξτε αν πρόκειται για έκπτωση ή αύξηση, ορίστε την τελική τιμή και το ποσοστό, και δείτε πώς υπολογίζεται αυτόματα η αρχική τιμή χωρίς λάθη.
              </p>
            </div>

            {/* Διακοπτης Εκπτωσης / Αυξησης */}
            <div className="grid grid-cols-2 sm:flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setCalcType('discount')}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition text-center ${
                  calcType === 'discount'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🔻 Έκπτωση
              </button>
              <button
                type="button"
                onClick={() => setCalcType('increase')}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition text-center ${
                  calcType === 'increase'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🔺 Αύξηση / Φ.Π.Α.
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            {/* Χειριστηρια Τελικης Τιμης & Ποσοστου */}
            <div className="lg:col-span-5 space-y-3.5">
              
              {/* Τελικη Τιμη */}
              <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-left">
                  <span className="text-[11px] sm:text-xs font-black uppercase text-slate-800 tracking-wider">
                    ΤΕΛΙΚΗ ΤΙΜΗ ΠΛΗΡΩΜΗΣ (€)
                  </span>
                  <span className="font-mono font-black text-base sm:text-lg text-blue-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {finalPrice} €
                  </span>
                </div>
                <div className="grid grid-cols-[34px_1fr_34px] items-center h-10 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFinalPrice((prev) => Math.max(10, prev - 5)); }}
                    disabled={finalPrice <= 10}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={10}
                    max={300}
                    step={5}
                    value={finalPrice}
                    onChange={(e) => setFinalPrice(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFinalPrice((prev) => Math.min(300, prev + 5)); }}
                    disabled={finalPrice >= 300}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Ποσοστο Μεταβολης */}
              <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-left">
                  <span className="text-[11px] sm:text-xs font-black uppercase text-slate-800 tracking-wider">
                    ΠΟΣΟΣΤΟ {calcType === 'discount' ? 'ΕΚΠΤΩΣΗΣ' : 'ΑΥΞΗΣΗΣ'} (%)
                  </span>
                  <span className={`font-mono font-black text-base sm:text-lg bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 ${calcType === 'discount' ? 'text-rose-700' : 'text-emerald-700'}`}>
                    {percentage} %
                  </span>
                </div>
                <div className="grid grid-cols-[34px_1fr_34px] items-center h-10 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPercentage((prev) => Math.max(5, prev - 5)); }}
                    disabled={percentage <= 5}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={5}
                    max={60}
                    step={5}
                    value={percentage}
                    onChange={(e) => setPercentage(Number(e.target.value))}
                    className={`w-full cursor-pointer ${calcType === 'discount' ? 'accent-rose-600' : 'accent-emerald-600'}`}
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPercentage((prev) => Math.min(60, prev + 5)); }}
                    disabled={percentage >= 60}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Επεξηγηματικη Καρτα */}
              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 text-xs text-blue-950 leading-relaxed">
                Η τελική τιμή των {finalPrice} € αντιστοιχεί στο <strong>{finalPercentage} %</strong> της αρχικής αξίας.
              </div>

            </div>

            {/* Πινακας Αναλογιας & Αποτελεσματα */}
            <div className="lg:col-span-7 bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-4 w-full">
              <div className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                ΠΙΝΑΚΑΣ ΠΟΣΩΝ (ΑΝΑΓΩΓΗ ΣΤΟ 100)
              </div>

              {/* Πινακας 2x2 - Χωρις Scroll */}
              <div className="w-full max-w-sm mx-auto bg-white rounded-2xl border-2 border-slate-300 shadow-sm p-3 sm:p-4 space-y-2.5 font-mono text-center">
                <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-2 font-bold text-slate-600 text-xs sm:text-sm">
                  <span className="bg-blue-50 py-1 rounded-lg text-blue-900 truncate">Αρχική (€)</span>
                  <span className="bg-indigo-50 py-1 rounded-lg text-indigo-900 truncate">Τελική (€)</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5 pt-1 text-base sm:text-xl font-black text-slate-800">
                  <div className="bg-slate-100 p-2 rounded-xl">100</div>
                  <div className="bg-slate-100 p-2 rounded-xl">{finalPercentage}</div>
                  <div className="bg-amber-100 p-2 rounded-xl text-amber-950 border border-amber-300 animate-pulse">
                    χ
                  </div>
                  <div className="bg-slate-100 p-2 rounded-xl">{finalPrice}</div>
                </div>
                <div className="text-[11px] sm:text-xs font-sans text-slate-500 pt-1">
                  χ ＝ ({finalPrice} · 100) : {finalPercentage} ＝ <strong>{formatNum(initialPrice)} €</strong>
                </div>
              </div>

              {/* Καρτες Αποτελεσματων */}
              <div className="grid grid-cols-2 gap-2.5 text-center">
                <div className="p-3 bg-white rounded-2xl border-2 border-emerald-300 bg-emerald-50/50 space-y-1">
                  <span className="text-[10.5px] sm:text-xs font-bold text-emerald-900 uppercase block">
                    ΑΡΧΙΚΗ ΤΙΜΗ (100%)
                  </span>
                  <div className="font-mono font-black text-lg sm:text-2xl text-emerald-700">
                    {formatNum(initialPrice)} €
                  </div>
                </div>

                <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10.5px] sm:text-xs font-bold text-slate-500 uppercase block">
                    {calcType === 'discount' ? 'ΠΟΣΟ ΕΚΠΤΩΣΗΣ' : 'ΠΟΣΟ ΑΥΞΗΣΗΣ'}
                  </span>
                  <div className="font-mono font-black text-lg sm:text-2xl text-slate-800">
                    {formatNum(priceDiff)} €
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 4. ΛΥΜΕΝΑ ΠΑΡΑΔΕΙΓΜΑΤΑ ΠΡΟΒΛΗΜΑΤΩΝ */}
        <section className="space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight">
              Λυμένα Προβλήματα Εύρεσης Αρχικής Τιμής
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Δύο χαρακτηριστικά προβλήματα αγορών με αναλυτική παρουσίαση των βημάτων.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
            
            {/* Παραδειγμα 1 */}
            <article className="bg-white p-4 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 bg-rose-100 text-rose-900 text-[11px] sm:text-xs font-black rounded-lg">
                  ΠΡΟΒΛΗΜΑ 1: ΑΡΧΙΚΗ ΤΙΜΗ ΜΕΤΑ ΑΠΟ ΕΚΠΤΩΣΗ
                </span>
                <span className="text-xs font-bold text-slate-400">Έκπτωση 20%</span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-slate-900">
                Αγορά Παπουτσιών στις Εκπτώσεις
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ένα ζευγάρι παπούτσια πωλήθηκε στις εκπτώσεις προς <strong>72 €</strong> με έκπτωση <strong>20 %</strong>. Ποια ήταν η αρχική τιμή των παπουτσιών;
              </p>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-[11px] font-bold">Βήμα 1: Σε ποιο ποσοστό αντιστοιχούν τα 72 €;</span>
                  <div>100 % － 20 % ＝ <strong className="text-blue-700">80 %</strong> της αρχικής τιμής.</div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-[11px] font-bold">Βήμα 2: Υπολογισμός αρχικής τιμής (100%)</span>
                  <div>Με πίνακα (χιαστί): χ ＝ (72 · 100) : 80 ＝ 7.200 : 80 ＝ <strong className="text-emerald-700 text-sm sm:text-base">90 €</strong></div>
                  <div>Με διαίρεση: 72 : 0,80 ＝ <strong className="text-emerald-700 text-sm sm:text-base">90 €</strong></div>
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] sm:text-xs text-emerald-950 font-medium">
                ✓ <strong>Επαλήθευση:</strong> Το 20% των 90 € είναι 18 €. Τελική τιμή: 90 － 18 ＝ 72 €.
              </div>
            </article>

            {/* Παραδειγμα 2 */}
            <article className="bg-white p-4 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs font-black rounded-lg">
                  ΠΡΟΒΛΗΜΑ 2: ΑΡΧΙΚΗ ΤΙΜΗ ΠΡΟ ΦΟΡΟΥ (Φ.Π.Α.)
                </span>
                <span className="text-xs font-bold text-slate-400">Φ.Π.Α. 24%</span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-slate-900">
                Καθαρή Αξία Τηλεόρασης
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Η τελική τιμή μιας τηλεόρασης μαζί με Φ.Π.Α. <strong>24 %</strong> είναι <strong>372 €</strong>. Ποια ήταν η καθαρή αρχική τιμή της χωρίς τον φόρο;
              </p>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-[11px] font-bold">Βήμα 1: Σε ποιο ποσοστό αντιστοιχούν τα 372 €;</span>
                  <div>100 % ＋ 24 % ＝ <strong className="text-indigo-700">124 %</strong> της καθαρής αξίας.</div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-[11px] font-bold">Βήμα 2: Υπολογισμός καθαρής αξίας (100%)</span>
                  <div>Με πίνακα (χιαστί): χ ＝ (372 · 100) : 124 ＝ 37.200 : 124 ＝ <strong className="text-emerald-700 text-sm sm:text-base">300 €</strong></div>
                  <div>Με διαίρεση: 372 : 1,24 ＝ <strong className="text-emerald-700 text-sm sm:text-base">300 €</strong></div>
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] sm:text-xs text-emerald-950 font-medium">
                ✓ <strong>Επαλήθευση:</strong> Το 24% των 300 € είναι 72 €. Τελική τιμή: 300 ＋ 72 ＝ 372 €.
              </div>
            </article>

          </div>
        </section>

        {/* 5. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στην Εύρεση Αρχικής Τιμής!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε 10 απαιτητικές ασκήσεις υπολογισμού αρχικής αξίας προ έκπτωσης ή προ φόρου και απέφυγε την παγίδα των ποσοστών.
            </p>
          </div>

          <Link
            href="/st-dimotikou/52-brisko-arxiki-timi-ask"
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
