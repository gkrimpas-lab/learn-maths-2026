// pages/st-dimotikou/51-problimata-me-pososta.js
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

export default function ProblimataMePosostaTheoryPage() {
  // Εργαστηριο 1: Διαδραστικος Υπολογιστης Ποσοστου & Τελικης Τιμης
  const [calcMode, setCalcMode] = useState('discount'); // 'discount' η 'increase'
  const [basePrice, setBasePrice] = useState(80);       // Αρχικη τιμη σε €
  const [pctRate, setPctRate] = useState(25);           // Ποσοστο %

  // Υπολογισμος ποσου μεταβολης: (basePrice * pctRate) / 100
  const amountChange = useMemo(() => {
    const raw = (basePrice * pctRate) / 100;
    return Number.isInteger(raw) ? raw : Number(raw.toFixed(2));
  }, [basePrice, pctRate]);

  // Τελικη τιμη μετα απο εκπτωση η αυξηση
  const finalPrice = useMemo(() => {
    const res = calcMode === 'discount' ? basePrice - amountChange : basePrice + amountChange;
    return Number.isInteger(res) ? res : Number(res.toFixed(2));
  }, [basePrice, amountChange, calcMode]);

  return (
    <Layout
      title="Προβλήματα με Ποσοστά - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μαθαίνουμε πώς υπολογίζουμε το ποσό έκπτωσης, αύξησης, κέρδους και την τελική τιμή πληρωμής σε ρεαλιστικά προβλήματα με διαδραστικά εργαστήρια."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/51-problimata-me-pososta-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 51 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Προβλήματα με Ποσοστά
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-2xl leading-relaxed max-w-4xl">
              Μαθαίνουμε πώς να υπολογίζουμε το ποσό της έκπτωσης, τον φόρο (Φ.Π.Α.), το κέρδος και την τελική τιμή ενός προϊόντος, εφαρμόζοντας τις μεθόδους των αναλογιών και του πολλαπλασιασμού με κλάσμα.
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία, Λυμένα Προβλήματα &amp; Διαδραστικός Υπολογιστής Τελικής Τιμής</span>
            </div>
            <Link
              href="/st-dimotikou/51-problimata-me-pososta-ask"
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
              Επίλυση Προβλημάτων Ποσοστών σε 4 Βήματα
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Από την αρχική τιμή στον υπολογισμό της μεταβολής και την τελική πληρωμή.
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
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Ποσό Μεταβολής</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Υπολογισμός του Ποσοστού
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Για να βρούμε πόσα ευρώ (€) είναι η έκπτωση ή η αύξηση, πολλαπλασιάζουμε την αρχική τιμή με το κλάσμα του ποσοστού:
                </p>

                <div className="bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-200 text-center font-mono text-xs sm:text-sm">
                  <div className="p-1.5 bg-white rounded-xl border border-slate-200 font-bold text-slate-800">
                    Ποσό Μεταβολής ＝ Αρχική Τιμή · <Fraction num="Ποσοστό" den="100" />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Παράδειγμα: Το 20% των 80 € είναι (80 · 20) : 100 ＝ 16 €.
              </div>
            </article>

            {/* Βημα 2ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Έκπτωση vs Αύξηση</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Πρόσθεση ή Αφαίρεση;
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Ανάλογα με το είδος του προβλήματος, ενεργούμε ως εξής:
                </p>

                <div className="space-y-1.5 text-[11px] sm:text-xs font-mono">
                  <div className="p-2 bg-rose-50 rounded-xl border border-rose-200 text-rose-950">
                    🔻 <strong>Σε Έκπτωση / Ζημιά:</strong><br />
                    Τελική Τιμή ＝ Αρχική Τιμή － Έκπτωση
                  </div>
                  <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950">
                    🔺 <strong>Σε Αύξηση / Κέρδος / Φ.Π.Α.:</strong><br />
                    Τελική Τιμή ＝ Αρχική Τιμή ＋ Αύξηση
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Ποτέ δεν ξεχνάμε: Το ποσό της έκπτωσης αφαιρείται, ενώ ο φόρος/αύξηση προστίθεται!
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
                  Στήνουμε πίνακα συγκρίνοντας την αρχική αξία (100) με το ποσοστό ή την τελική τιμή:
                </p>

                <div className="bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-200 font-mono text-xs space-y-1 text-center">
                  <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-1 font-bold text-slate-600 text-[11px]">
                    <span>Αρχική (€)</span>
                    <span>Μεταβολή (€)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 font-bold text-slate-800">
                    <span>100</span>
                    <span>Ποσοστό %</span>
                    <span>Αρχική Τιμή</span>
                    <span className="text-indigo-600">χ</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 χ ＝ (Αρχική Τιμή · Ποσοστό) : 100.
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
                  Απευθείας Υπολογισμός
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Μπορούμε να βρούμε την τελική τιμή σε <strong>ένα μόνο βήμα</strong>:
                </p>

                <div className="bg-slate-50 p-2.5 sm:p-3.5 rounded-2xl border border-slate-200 space-y-1.5 text-xs font-mono text-center">
                  <div className="p-1.5 bg-white rounded-xl border border-slate-200 text-slate-800 font-bold text-[11px] sm:text-xs">
                    Έκπτωση 20% ➔ Πληρώνουμε το 80% (0,80)
                  </div>
                  <p className="text-slate-600 text-[10.5px] font-sans">
                    Τελική τιμή ＝ 80 € · 0,80 ＝ <strong>64 €</strong>
                  </p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Ταχύτατος υπολογισμός χωρίς ενδιάμεση αφαίρεση.
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΥΠΟΛΟΓΙΣΤΗΣ ΠΟΣΟΣΤΟΥ & ΤΕΛΙΚΗΣ ΤΙΜΗΣ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 sm:pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Δυναμικός Υπολογιστής Έκπτωσης, Αύξησης &amp; Τελικής Τιμής
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Επιλέξτε αν πρόκειται για έκπτωση ή αύξηση, ορίστε την αρχική τιμή και το ποσοστό, και δείτε πώς υπολογίζεται το ποσό μεταβολής και η τελική τιμή.
              </p>
            </div>

            {/* Διακοπτης Εκπτωσης / Αυξησης */}
            <div className="grid grid-cols-2 sm:flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setCalcMode('discount')}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition text-center ${
                  calcMode === 'discount'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🔻 Έκπτωση
              </button>
              <button
                type="button"
                onClick={() => setCalcMode('increase')}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition text-center ${
                  calcMode === 'increase'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🔺 Αύξηση / Φ.Π.Α.
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            {/* Χειριστηρια Αρχικης Τιμης & Ποσοστου */}
            <div className="lg:col-span-5 space-y-3.5">
              
              {/* Αρχικη Τιμη */}
              <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-left">
                  <span className="text-[11px] sm:text-xs font-black uppercase text-slate-800 tracking-wider">
                    ΑΡΧΙΚΗ ΤΙΜΗ (€)
                  </span>
                  <span className="font-mono font-black text-base sm:text-lg text-blue-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {basePrice} €
                  </span>
                </div>
                <div className="grid grid-cols-[34px_1fr_34px] items-center h-10 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setBasePrice((prev) => Math.max(10, prev - 5)); }}
                    disabled={basePrice <= 10}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={10}
                    max={300}
                    step={5}
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setBasePrice((prev) => Math.min(300, prev + 5)); }}
                    disabled={basePrice >= 300}
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
                    ΠΟΣΟΣΤΟ {calcMode === 'discount' ? 'ΕΚΠΤΩΣΗΣ' : 'ΑΥΞΗΣΗΣ'} (%)
                  </span>
                  <span className={`font-mono font-black text-base sm:text-lg bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 ${calcMode === 'discount' ? 'text-rose-700' : 'text-emerald-700'}`}>
                    {pctRate} %
                  </span>
                </div>
                <div className="grid grid-cols-[34px_1fr_34px] items-center h-10 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPctRate((prev) => Math.max(5, prev - 5)); }}
                    disabled={pctRate <= 5}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={5}
                    max={60}
                    step={5}
                    value={pctRate}
                    onChange={(e) => setPctRate(Number(e.target.value))}
                    className={`w-full cursor-pointer ${calcMode === 'discount' ? 'accent-rose-600' : 'accent-emerald-600'}`}
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPctRate((prev) => Math.min(60, prev + 5)); }}
                    disabled={pctRate >= 60}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Επεξηγηματικη Καρτα */}
              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 text-xs text-blue-950 leading-relaxed">
                Υπολογισμός ποσού: ({basePrice} · {pctRate}) : 100 ＝ <strong>{formatNum(amountChange)} €</strong>.
              </div>

            </div>

            {/* Πινακας Αναλογιας & Αποτελεσματα */}
            <div className="lg:col-span-7 bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-4 w-full">
              <div className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                ΠΙΝΑΚΑΣ ΠΟΣΩΝ (ΑΝΑΓΩΓΗ ΣΤΑ 100)
              </div>

              {/* Πινακας 2x2 - Χωρις Scroll */}
              <div className="w-full max-w-sm mx-auto bg-white rounded-2xl border-2 border-slate-300 shadow-sm p-3 sm:p-4 space-y-2.5 font-mono text-center">
                <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-2 font-bold text-slate-600 text-xs sm:text-sm">
                  <span className="bg-blue-50 py-1 rounded-lg text-blue-900 truncate">Αρχική (€)</span>
                  <span className={`py-1 rounded-lg truncate ${calcMode === 'discount' ? 'bg-rose-50 text-rose-900' : 'bg-emerald-50 text-emerald-900'}`}>
                    {calcMode === 'discount' ? 'Έκπτωση (€)' : 'Αύξηση (€)'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5 pt-1 text-base sm:text-xl font-black text-slate-800">
                  <div className="bg-slate-100 p-2 rounded-xl">100</div>
                  <div className="bg-slate-100 p-2 rounded-xl">{pctRate}</div>
                  <div className="bg-slate-100 p-2 rounded-xl">{basePrice}</div>
                  <div className="bg-amber-100 p-2 rounded-xl text-amber-950 border border-amber-300 animate-pulse">
                    χ
                  </div>
                </div>
                <div className="text-[11px] sm:text-xs font-sans text-slate-500 pt-1">
                  χ ＝ ({basePrice} · {pctRate}) : 100 ＝ <strong>{formatNum(amountChange)} €</strong>
                </div>
              </div>

              {/* Καρτες Αποτελεσματων */}
              <div className="grid grid-cols-2 gap-2.5 text-center">
                <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10.5px] sm:text-xs font-bold text-slate-500 uppercase block">
                    {calcMode === 'discount' ? 'ΠΟΣΟ ΕΚΠΤΩΣΗΣ' : 'ΠΟΣΟ ΑΥΞΗΣΗΣ'}
                  </span>
                  <div className={`font-mono font-black text-lg sm:text-2xl ${calcMode === 'discount' ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {formatNum(amountChange)} €
                  </div>
                </div>

                <div className="p-3 bg-white rounded-2xl border-2 border-emerald-300 bg-emerald-50/50 space-y-1">
                  <span className="text-[10.5px] sm:text-xs font-bold text-emerald-900 uppercase block">
                    ΤΕΛΙΚΗ ΤΙΜΗ
                  </span>
                  <div className="font-mono font-black text-lg sm:text-2xl text-emerald-700">
                    {formatNum(finalPrice)} €
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
              Λυμένα Προβλήματα με Ποσοστά
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Δύο ολοκληρωμένα παραδείγματα υπολογισμού έκπτωσης και επιβάρυνσης φόρου (Φ.Π.Α.).
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
            
            {/* Παραδειγμα 1 */}
            <article className="bg-white p-4 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 bg-rose-100 text-rose-900 text-[11px] sm:text-xs font-black rounded-lg">
                  ΠΡΟΒΛΗΜΑ 1: ΥΠΟΛΟΓΙΣΜΟΣ ΕΚΠΤΩΣΗΣ
                </span>
                <span className="text-xs font-bold text-slate-400">Έκπτωση 30%</span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-slate-900">
                Αγορά Ποδηλάτου στις Εκπτώσεις
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ένα ποδήλατο κοστίζει αρχικά <strong>180 €</strong> και προσφέρεται με έκπτωση <strong>30 %</strong>. Πόσα ευρώ θα πληρώσει ο πελάτης;
              </p>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-[11px] font-bold">Βήμα 1: Πόσα ευρώ είναι η έκπτωση;</span>
                  <div>Έκπτωση ＝ (180 · 30) : 100 ＝ 5.400 : 100 ＝ <strong className="text-rose-700">54 €</strong></div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-[11px] font-bold">Βήμα 2: Ποια είναι η τελική τιμή πληρωμής;</span>
                  <div>Τελική Τιμή ＝ 180 € － 54 € ＝ <strong className="text-emerald-700 text-sm sm:text-base">126 €</strong></div>
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] sm:text-xs text-emerald-950 font-medium">
                ✓ <strong>Απευθείας τρόπος:</strong> Πληρώνουμε το 70% (100 － 30). Τελική τιμή ＝ 180 · 0,70 ＝ 126 €.
              </div>
            </article>

            {/* Παραδειγμα 2 */}
            <article className="bg-white p-4 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs font-black rounded-lg">
                  ΠΡΟΒΛΗΜΑ 2: ΕΠΙΒΑΡΥΝΣΗ Φ.Π.Α.
                </span>
                <span className="text-xs font-bold text-slate-400">Φ.Π.Α. 24%</span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-slate-900">
                Αγορά Ηλεκτρονικού Υπολογιστή
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Η καθαρή αξία ενός υπολογιστή είναι <strong>500 €</strong> και επιβαρύνεται με Φ.Π.Α. <strong>24 %</strong>. Ποια είναι η τελική τιμή του υπολογιστή;
              </p>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-[11px] font-bold">Βήμα 1: Πόσα ευρώ είναι ο φόρος Φ.Π.Α.;</span>
                  <div>Φ.Π.Α. ＝ (500 · 24) : 100 ＝ 12.000 : 100 ＝ <strong className="text-indigo-700">120 €</strong></div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-[11px] font-bold">Βήμα 2: Ποια είναι η τελική τιμή;</span>
                  <div>Τελική Τιμή ＝ 500 € ＋ 120 € ＝ <strong className="text-emerald-700 text-sm sm:text-base">620 €</strong></div>
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] sm:text-xs text-emerald-950 font-medium">
                ✓ <strong>Απευθείας τρόπος:</strong> Τελική τιμή ＝ 500 · 1,24 ＝ 620 €.
              </div>
            </article>

          </div>
        </section>

        {/* 5. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στα Προβλήματα με Ποσοστά!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε 10 απαιτητικές ασκήσεις υπολογισμού εκπτώσεων, αυξήσεων, φόρων και τελικών τιμών για τη ΣΤ' Δημοτικού.
            </p>
          </div>

          <Link
            href="/st-dimotikou/51-problimata-me-pososta-ask"
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
