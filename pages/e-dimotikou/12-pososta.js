// pages/e-dimotikou/12-pososta.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function PosostaTheoryPage() {
  // Μέρος 1ο: State για την έννοια του ποσοστού (πλέγμα 100)
  const [pct1, setPct1] = useState(25);

  // Μέρος 2ο: State για τον υπολογισμό πάνω σε ποσό
  const [amount, setAmount] = useState(280);
  const [pct2, setPct2] = useState(35);

  // Υπολογισμοί Μέρους 2
  const calculatedValue = ((amount * pct2) / 100).toLocaleString('el-GR', {
    minimumFractionDigits: Number.isInteger((amount * pct2) / 100) ? 0 : 2,
    maximumFractionDigits: 2
  });
  const mathStep1 = amount * pct2;

  // Δημιουργία των 100 κουτιών για το πλέγμα
  const gridBoxes = Array.from({ length: 100 }, (_, i) => i < pct1);

  return (
    <Layout
      title="Ποσοστά - Ε' Δημοτικού | LearnMaths.gr"
      description="Μάθετε την έννοια του ποσοστού, τη σύνδεση με τα κλάσματα και τους δεκαδικούς, πώς υπολογίζουμε το ποσοστό ενός ποσού και δοκιμάστε το διαδραστικό εργαστήριο."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/12-pososta-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 12 • Ε' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Ποσοστά (% και ‰)
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              Ανακαλύπτουμε τι εκφράζει το ποσοστό, πώς μετατρέπεται σε κλάσμα με παρονομαστή το 100 και σε δεκαδικό αριθμό, πώς υπολογίζουμε το ποσοστό οποιασδήποτε ποσότητας και πώς εφαρμόζεται σε εκπτώσεις και αυξήσεις.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία, Πλέγμα 100 &amp; Υπολογιστής Ποσού</span>
            </div>
            <Link
              href="/e-dimotikou/12-pososta-ask"
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
              Η μαθηματική γλώσσα των ποσοστών και οι κανόνες υπολογισμού τους.
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
                  Τι είναι το Ποσοστό;
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  <strong>Ποσοστό</strong> είναι ένα κλάσμα που δείχνει πόσα μέρη παίρνουμε <strong>από τα 100 ίσα μέρη</strong> στα οποία χωρίζουμε μια μονάδα ή ένα σύνολο.
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <p className="text-slate-700">
                    Συμβολίζεται με το σύμβολο <strong>%</strong> (επί τοις εκατό):
                  </p>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-mono font-bold text-slate-900 shadow-inner text-center">
                    25% ＝ 25/100 ＝ 0,25
                  </div>
                  <p className="text-slate-500 text-xs">
                    Αν χωρίσουμε ένα τετράγωνο σε 100 ίσα κουτάκια, το 25% σημαίνει ότι χρωματίζουμε ακριβώς τα 25 από αυτά.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Το σύνολο (το όλο) εκφράζεται πάντα με το <strong>100%</strong> (δηλαδή 100/100 ＝ 1).
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Τριπλή Μορφή</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Ποσοστό, Κλάσμα, Δεκαδικός
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Κάθε ποσοστό μπορεί να γραφτεί με 3 ισοδύναμους τρόπους που εκφράζουν ακριβώς την ίδια αξία:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono">
                  <div className="flex justify-between items-center p-1.5 bg-white rounded-lg border border-slate-200">
                    <span className="text-blue-700 font-bold">50%</span>
                    <span>＝ 50/100 ( ＝ 1/2 )</span>
                    <span className="text-emerald-700 font-bold">＝ 0,5</span>
                  </div>
                  <div className="flex justify-between items-center p-1.5 bg-white rounded-lg border border-slate-200">
                    <span className="text-blue-700 font-bold">25%</span>
                    <span>＝ 25/100 ( ＝ 1/4 )</span>
                    <span className="text-emerald-700 font-bold">＝ 0,25</span>
                  </div>
                  <div className="flex justify-between items-center p-1.5 bg-white rounded-lg border border-slate-200">
                    <span className="text-blue-700 font-bold">75%</span>
                    <span>＝ 75/100 ( ＝ 3/4 )</span>
                    <span className="text-emerald-700 font-bold">＝ 0,75</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Για να μετατρέψουμε ποσοστό σε δεκαδικό, διαιρούμε με το 100 (μετακινούμε την υποδιαστολή 2 θέσεις αριστερά).
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Υπολογισμός</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Ποσοστό πάνω σε ένα Ποσό
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Για να βρούμε το ποσοστό ενός ποσού, <strong>πολλαπλασιάζουμε το ποσό με το κλάσμα του ποσοστού</strong>:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono">
                  <p className="text-slate-700 font-sans font-semibold">Πόσο είναι το 20% των 150 €;</p>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-bold text-center text-indigo-950 shadow-inner">
                    150 · (20/100) ＝ (150 · 20) ： 100 ＝ 3.000 ： 100 ＝ 30 €
                  </div>
                  <p className="text-slate-500 text-xs font-sans">
                    Εναλλακτικά με δεκαδικό: 150 · 0,20 ＝ 30 €.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 <strong>Κανόνας:</strong> Ποσό · Ποσοστό ： 100.
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Εφαρμογές</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Έκπτωση &amp; Αύξηση Τιμής
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Στην καθημερινή ζωή, αφού υπολογίσουμε την αξία του ποσοστού, κάνουμε αφαίρεση ή πρόσθεση:
                </p>

                <div className="space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                    <strong>Έκπτωση (Μείωση):</strong> Αφαιρούμε την έκπτωση από την αρχική τιμή:<br />
                    <span className="font-mono font-bold">Τελική Τιμή ＝ Αρχική Τιμή － Έκπτωση</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-950">
                    <strong>Αύξηση (ΦΠΑ / Κέρδος):</strong> Προσθέτουμε την αύξηση στην αρχική τιμή:<br />
                    <span className="font-mono font-bold">Τελική Τιμή ＝ Αρχική Τιμή ＋ Αύξηση</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🔍 Αν ένα προϊόν 80 € έχει έκπτωση 25% (20 €), η νέα τιμή του είναι: 80 － 20 ＝ 60 €.
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ: ΜΕΡΟΣ 1 & ΜΕΡΟΣ 2 */}
        <section className="space-y-10">
          {/* ΜΕΡΟΣ 1: ΠΛΕΓΜΑ 100 ΚΟΥΤΙΩΝ */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
            <div className="border-b border-slate-100 pb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🎨 ΜΕΡΟΣ 1ο</span>
              </div>
              <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Η Οπτική Έννοια του Ποσοστού (Πλέγμα 100)
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Άλλαξε το ποσοστό και δες πόσα από τα 100 τετραγωνάκια χρωματίζονται, καθώς και την αυτόματη αντιστοίχιση σε κλάσμα και δεκαδικό.
              </p>
            </div>

            {/* Stepper Ποσοστού 1 */}
            <div className="max-w-xl mx-auto bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="h-8 flex items-center justify-between text-left">
                <span className="text-sm 2xl:text-base font-bold text-slate-800">Ποσοστό (%):</span>
                <span className="min-w-[72px] text-center font-mono font-black text-xl text-sky-600 bg-white px-2 py-0.5 rounded-lg border border-sky-200 shadow-sm">
                  {pct1}%
                </span>
              </div>

              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  type="button"
                  aria-label="Μείωση ποσοστού κατά 5"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setPct1((prev) => Math.max(0, prev - 5));
                  }}
                  disabled={pct1 <= 0}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-sm"
                >
                  －5
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={pct1}
                  onChange={(e) => setPct1(Number(e.target.value))}
                  aria-label="Ποσοστό 1"
                  className="w-full min-w-0 max-w-full accent-sky-600 cursor-pointer"
                />
                <button
                  type="button"
                  aria-label="Αύξηση ποσοστού κατά 5"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setPct1((prev) => Math.min(100, prev + 5));
                  }}
                  disabled={pct1 >= 100}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-sm"
                >
                  ＋5
                </button>
              </div>

              {/* Γρήγορα κουμπιά βασικών ποσοστών */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                {[10, 20, 25, 50, 75, 100].map((val) => (
                  <button
                    key={`quick-pct-${val}`}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setPct1(val);
                    }}
                    className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition ${
                      pct1 === val
                        ? 'bg-sky-600 text-white'
                        : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {val}%
                  </button>
                ))}
              </div>
            </div>

            {/* Πλέγμα 100 κουτιών και Τριπλή Αναπαράσταση */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-12 pt-2">
              {/* Πλέγμα 10x10 */}
              <div className="w-full max-w-[280px] aspect-square p-3 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-10 gap-1">
                {gridBoxes.map((isFilled, idx) => (
                  <div
                    key={`grid-box-${idx}`}
                    className={`aspect-square rounded-sm transition-colors duration-150 ${
                      isFilled ? 'bg-sky-500 shadow-xs' : 'bg-slate-200/70'
                    }`}
                  ></div>
                ))}
              </div>

              {/* 3 Κάρτες Ισοδυναμίας */}
              <div className="grid grid-cols-3 md:grid-cols-1 gap-3 w-full max-w-md md:max-w-[220px]">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center shadow-xs flex flex-col justify-center items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">ΣΥΜΒΟΛΟ</span>
                  <span className="text-xl 2xl:text-2xl font-black font-mono text-slate-900 mt-1">{pct1}%</span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center shadow-xs flex flex-col justify-center items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">ΚΛΑΣΜΑ</span>
                  <div className="flex flex-col items-center font-mono font-black text-base text-slate-900 mt-1 leading-none">
                    <span>{pct1}</span>
                    <span className="w-10 h-0.5 bg-slate-800 my-1"></span>
                    <span>100</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center shadow-xs flex flex-col justify-center items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">ΔΕΚΑΔΙΚΟΣ</span>
                  <span className="text-xl 2xl:text-2xl font-black font-mono text-slate-900 mt-1">
                    {(pct1 / 100).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ΜΕΡΟΣ 2: ΥΠΟΛΟΓΙΣΜΟΣ ΠΟΣΟΣΤΟΥ ΠΑΝΩ ΣΕ ΠΟΣΟ */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
            <div className="border-b border-slate-100 pb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
                <span>🧮 ΜΕΡΟΣ 2ο</span>
              </div>
              <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Υπολογισμός Ποσοστού πάνω σε ένα Ποσό
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Ρύθμισε ελεύθερα το συνολικό ποσό και το ποσοστό για να δεις τη βήμα-βήμα μαθηματική επίλυση και τη γραφική μπάρα.
              </p>
            </div>

            {/* Δύο Χειριστήρια Steppers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Χειριστήριο Ποσού */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-xs 2xl:text-sm font-black uppercase text-slate-600 tracking-wider">
                    1. ΣΥΝΟΛΙΚΟ ΠΟΣΟ
                  </span>
                  <span className="min-w-[72px] text-center font-mono font-black text-xl text-blue-600 bg-white px-2 py-0.5 rounded-lg border border-blue-200 shadow-sm">
                    {amount}
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Μείωση ποσού κατά 20"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setAmount((prev) => Math.max(10, prev - 20));
                    }}
                    disabled={amount <= 10}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-sm"
                  >
                    －20
                  </button>
                  <input
                    type="range"
                    min="10"
                    max="1000"
                    step="10"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    aria-label="Συνολικό Ποσό"
                    className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    aria-label="Αύξηση ποσού κατά 20"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setAmount((prev) => Math.min(1000, prev + 20));
                    }}
                    disabled={amount >= 1000}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-sm"
                  >
                    ＋20
                  </button>
                </div>
              </div>

              {/* Χειριστήριο Ποσοστού 2 */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-xs 2xl:text-sm font-black uppercase text-slate-600 tracking-wider">
                    2. ΠΟΣΟΣΤΟ (%)
                  </span>
                  <span className="min-w-[72px] text-center font-mono font-black text-xl text-emerald-600 bg-white px-2 py-0.5 rounded-lg border border-emerald-200 shadow-sm">
                    {pct2}%
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Μείωση ποσοστού κατά 5"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setPct2((prev) => Math.max(0, prev - 5));
                    }}
                    disabled={pct2 <= 0}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-sm"
                  >
                    －5
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={pct2}
                    onChange={(e) => setPct2(Number(e.target.value))}
                    aria-label="Ποσοστό 2"
                    className="w-full min-w-0 max-w-full accent-emerald-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    aria-label="Αύξηση ποσοστού κατά 5"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setPct2((prev) => Math.min(100, prev + 5));
                    }}
                    disabled={pct2 >= 100}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-sm"
                  >
                    ＋5
                  </button>
                </div>
              </div>
            </div>

            {/* Οπτική Μπάρα Αναλογίας */}
            <div className="max-w-4xl mx-auto bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs font-mono font-bold text-slate-500">
                <span>0%</span>
                <span className="text-emerald-700 font-black text-sm">{pct2}%</span>
                <span>100%</span>
              </div>
              <div className="w-full bg-slate-200 h-6 rounded-xl overflow-hidden shadow-inner">
                <div
                  className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full transition-all duration-200 rounded-xl"
                  style={{ width: `${pct2}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs font-mono font-bold text-slate-600 pt-0.5">
                <span>0</span>
                <span className="text-blue-700 font-black text-sm">{calculatedValue}</span>
                <span>{amount}</span>
              </div>
            </div>

            {/* Αναλυτική Μαθηματική Επίλυση */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-3xl mx-auto text-center space-y-4">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                Η ΜΑΘΗΜΑΤΙΚΗ ΕΠΙΛΥΣΗ
              </span>

              <div className="flex flex-wrap items-center justify-center gap-3 font-mono font-black text-lg sm:text-xl text-slate-800">
                <span className="text-blue-600 text-2xl">{amount}</span>
                <span className="font-sans text-slate-400">·</span>
                <div className="flex flex-col items-center leading-none text-emerald-600">
                  <span>{pct2}</span>
                  <span className="w-10 h-0.5 bg-slate-800 my-1"></span>
                  <span>100</span>
                </div>
                <span className="font-sans text-slate-400">＝</span>
                <div className="flex flex-col items-center leading-none text-slate-700 text-base">
                  <span>{amount} · {pct2}</span>
                  <span className="w-24 h-0.5 bg-slate-800 my-1"></span>
                  <span>100</span>
                </div>
                <span className="font-sans text-slate-400">＝</span>
                <div className="flex flex-col items-center leading-none text-slate-700 text-base">
                  <span>{mathStep1}</span>
                  <span className="w-18 h-0.5 bg-slate-800 my-1"></span>
                  <span>100</span>
                </div>
                <span className="font-sans text-slate-400">＝</span>
                <span className="bg-emerald-600 text-white p-2 px-4 rounded-xl shadow-sm text-2xl animate-pulse">
                  {calculatedValue}
                </span>
              </div>
            </div>

            {/* Callout Συμπεράσματος */}
            <div className="p-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-emerald-700 text-white rounded-2xl text-center font-bold text-xs sm:text-sm 2xl:text-base shadow-sm max-w-2xl mx-auto">
              🎯 Το <span className="text-amber-300 font-black font-mono">{pct2}%</span> του ποσού <span className="text-amber-300 font-black font-mono">{amount}</span> ισούται ακριβώς με:{' '}
              <span className="text-amber-300 text-xl font-black font-mono ml-1">{calculatedValue}</span>!
            </div>
          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στα Ποσοστά!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε απαιτητικές ασκήσεις υπολογισμού ποσοστού, μετατροπές κλασμάτων και πραγματικά προβλήματα εκπτώσεων και αυξήσεων.
            </p>
          </div>

          <Link
            href="/e-dimotikou/12-pososta-ask"
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
