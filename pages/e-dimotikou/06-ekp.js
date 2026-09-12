// pages/e-dimotikou/06-ekp.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

const LIMITS = {
  NUM_MIN: 2,
  NUM_MAX: 24,
  COUNT_SHOW: 15
};

export default function EkpTheoryPage() {
  // Πλήθος αριθμών προς εξέταση (2, 3 ή 4)
  const [numCount, setNumCount] = useState(2);

  // Οι τιμές για έως και 4 αριθμούς
  const [n1, setN1] = useState(4);
  const [n2, setN2] = useState(6);
  const [n3, setN3] = useState(3);
  const [n4, setN4] = useState(8);

  // Συναρτήσεις υπολογισμού ΜΚΔ και ΕΚΠ
  const findGCD = (a, b) => {
    let x = Math.abs(a);
    let y = Math.abs(b);
    while (y) {
      const t = y;
      y = x % y;
      x = t;
    }
    return x;
  };

  const findLCMOfTwo = (a, b) => {
    if (a === 0 || b === 0) return 0;
    return (a * b) / findGCD(a, b);
  };

  // Υπολογισμός τελικού ΕΚΠ
  let ekpResult = findLCMOfTwo(n1, n2);
  if (numCount >= 3) ekpResult = findLCMOfTwo(ekpResult, n3);
  if (numCount === 4) ekpResult = findLCMOfTwo(ekpResult, n4);

  // Παραγωγή λιστών πολλαπλασίων
  const list1 = Array.from({ length: LIMITS.COUNT_SHOW }, (_, i) => n1 * (i + 1));
  const list2 = Array.from({ length: LIMITS.COUNT_SHOW }, (_, i) => n2 * (i + 1));
  const list3 = Array.from({ length: LIMITS.COUNT_SHOW }, (_, i) => n3 * (i + 1));
  const list4 = Array.from({ length: LIMITS.COUNT_SHOW }, (_, i) => n4 * (i + 1));

  // Έλεγχος αν ένας αριθμός είναι κοινό πολλαπλάσιο όλων των ενεργών αριθμών
  const isCommonMultiple = (val) => {
    if (numCount === 2) return val % n1 === 0 && val % n2 === 0;
    if (numCount === 3) return val % n1 === 0 && val % n2 === 0 && val % n3 === 0;
    return val % n1 === 0 && val % n2 === 0 && val % n3 === 0 && val % n4 === 0;
  };

  const activeNumbers = [n1, n2];
  if (numCount >= 3) activeNumbers.push(n3);
  if (numCount === 4) activeNumbers.push(n4);

  return (
    <Layout
      title="Ελάχιστο Κοινό Πολλαπλάσιο (ΕΚΠ) - Ε' Δημοτικού | LearnMaths.gr"
      description="Πλήρης θεωρία με παραδείγματα, μεθόδους υπολογισμού ΕΚΠ, σύνδεση με τα ομώνυμα κλάσματα και διαδραστικό εργαστήριο για την Ε' Δημοτικού."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/06-ekp-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 6 • Ε' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Ελάχιστο Κοινό Πολλαπλάσιο (ΕΚΠ)
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              Μαθαίνουμε πώς να βρίσκουμε το μικρότερο κοινό πολλαπλάσιο δύο ή περισσότερων φυσικών αριθμών (εκτός από το 0), ποιες στρατηγικές εξοικονομούν χρόνο και γιατί το ΕΚΠ είναι απαραίτητο για τα ομώνυμα κλάσματα.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία &amp; Δυναμική Σύγκριση Πολλαπλασίων</span>
            </div>
            <Link
              href="/e-dimotikou/06-ekp-ask"
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
              Όλα όσα χρειάζεται να γνωρίζεις για να κατανοήσεις και να υπολογίζεις ταχύτατα το ΕΚΠ.
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
                  Τι είναι το ΕΚΠ;
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  <strong>Ελάχιστο Κοινό Πολλαπλάσιο (ΕΚΠ)</strong> δύο ή περισσότερων φυσικών αριθμών ονομάζεται το <strong>μικρότερο θετικό κοινό πολλαπλάσιό τους</strong> (δηλαδή το μικρότερο κοινό πολλαπλάσιο εκτός από το 0).
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <p className="text-slate-700 font-semibold">Συμβολισμός:</p>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-mono font-bold text-slate-900 shadow-inner text-center">
                    ΕΚΠ(4, 6) ＝ 12
                  </div>
                  <p className="text-slate-500 text-xs">
                    Διαβάζεται: «Το Ελάχιστο Κοινό Πολλαπλάσιο του 4 και του 6 είναι το 12».
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Εξαιρούμε πάντα το 0, γιατί το 0 είναι κοινό πολλαπλάσιο όλων των αριθμών.
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">1η Μέθοδος</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Μέθοδος με Λίστες Πολλαπλασίων
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Γράφουμε τα πρώτα πολλαπλάσια κάθε αριθμού με τη σειρά και κυκλώνουμε το <strong>πρώτο κοινό νούμερο</strong> που θα συναντήσουμε.
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono">
                  <div>Π(4) ＝ {'{'} 4, 8, <strong className="text-amber-600 font-black">12</strong>, 16, 20, 24, ... {'}'}</div>
                  <div>Π(6) ＝ {'{'} 6, <strong className="text-amber-600 font-black">12</strong>, 18, 24, 30, ... {'}'}</div>
                  <div className="pt-2 border-t border-slate-200 text-emerald-800 font-bold font-sans">
                    Κοινά πολλαπλάσια: 12, 24, 36, ... ➔ Μικρότερο: 12.
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Είναι η πιο απλή και κατανοητή μέθοδος για μικρούς αριθμούς.
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">2η Μέθοδος (Γρήγορη)</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Έλεγχος Πολλαπλασίων Μεγαλύτερου
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Αντί να γράφουμε όλες τις λίστες, παίρνουμε τον <strong>μεγαλύτερο αριθμό</strong> και εξετάζουμε τα πολλαπλάσιά του ένα-ένα:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <p className="text-slate-700 font-semibold">Για το ΕΚΠ(3, 8):</p>
                  <ol className="list-decimal list-inside space-y-1 font-mono text-slate-700">
                    <li>8 · 1 ＝ 8 (διαιρείται με το 3; Όχι)</li>
                    <li>8 · 2 ＝ 16 (διαιρείται με το 3; Όχι)</li>
                    <li>8 · 3 ＝ <strong className="text-indigo-600">24</strong> (διαιρείται με το 3; Ναι!)</li>
                  </ol>
                  <div className="pt-1 text-indigo-900 font-bold font-mono">
                    Άρα ΕΚΠ(3, 8) ＝ 24.
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 <strong>Κόλπο:</strong> Αν δύο αριθμοί είναι πρώτοι μεταξύ τους, το ΕΚΠ είναι απλά το γινόμενό τους (π.χ. 3 · 8 ＝ 24).
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Εφαρμογή</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Γιατί είναι Απαραίτητο το ΕΚΠ;
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Το ΕΚΠ των παρονομαστών είναι ο <strong>ιδανικός κοινός παρονομαστής</strong> για να μετατρέψουμε ετερώνυμα κλάσματα σε ομώνυμα!
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <p className="text-slate-700">
                    Αν θέλουμε να προσθέσουμε <span className="font-mono font-bold">1/4 ＋ 1/6</span>:
                  </p>
                  <p className="text-slate-600 text-xs">
                    Βρίσκουμε ΕΚΠ(4, 6) ＝ 12. Κάνουμε κοινό παρονομαστή το 12:
                  </p>
                  <div className="p-2 bg-white rounded-xl border border-slate-300 font-mono font-bold text-center text-emerald-800 text-xs sm:text-sm">
                    3/12 ＋ 2/12 ＝ 5/12
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Χρησιμοποιώντας το ΕΚΠ διατηρούμε τους αριθμούς όσο το δυνατόν μικρότερους, αποφεύγοντας περιττές πράξεις.
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΕΚΠ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
              </div>
              <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Δυναμικός Υπολογιστής &amp; Συγκριτής ΕΚΠ
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Επίλεξε 2, 3 ή 4 αριθμούς. Παρατήρησε τις λίστες πολλαπλασίων και δες πώς φωτίζεται το πρώτο κοινό τους σημείο συνάντησης.
              </p>
            </div>

            {/* Επιλογέας Πλήθους Αριθμών */}
            <div className="inline-flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start sm:self-center">
              {[2, 3, 4].map((cnt) => (
                <button
                  key={`btn-cnt-${cnt}`}
                  type="button"
                  onClick={() => setNumCount(cnt)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base font-bold transition ${
                    numCount === cnt
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cnt} Αριθμοί
                </button>
              ))}
            </div>
          </div>

          {/* Πλέγμα Χειριστηρίων Steppers (2, 3 ή 4 στήλες) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Αριθμός 1 */}
            <div className="bg-blue-50/70 p-4 2xl:p-5 rounded-2xl border border-blue-200 space-y-2">
              <div className="h-8 flex items-center justify-between text-left">
                <span className="text-xs 2xl:text-sm font-black uppercase text-blue-900 tracking-wider">
                  1ΟΣ ΑΡΙΘΜΟΣ
                </span>
                <span className="min-w-[56px] text-center font-mono font-black text-lg text-blue-600 bg-white px-2 py-0.5 rounded-lg border border-blue-200">
                  {n1}
                </span>
              </div>
              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  type="button"
                  aria-label="Μείωση 1ου αριθμού"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setN1((prev) => Math.max(LIMITS.NUM_MIN, prev - 1));
                  }}
                  disabled={n1 <= LIMITS.NUM_MIN}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                >
                  －
                </button>
                <input
                  type="range"
                  min={LIMITS.NUM_MIN}
                  max={LIMITS.NUM_MAX}
                  value={n1}
                  onChange={(e) => setN1(Number(e.target.value))}
                  aria-label="1ος Αριθμός"
                  className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                />
                <button
                  type="button"
                  aria-label="Αύξηση 1ου αριθμού"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setN1((prev) => Math.min(LIMITS.NUM_MAX, prev + 1));
                  }}
                  disabled={n1 >= LIMITS.NUM_MAX}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                >
                  ＋
                </button>
              </div>
            </div>

            {/* Αριθμός 2 */}
            <div className="bg-indigo-50/70 p-4 2xl:p-5 rounded-2xl border border-indigo-200 space-y-2">
              <div className="h-8 flex items-center justify-between text-left">
                <span className="text-xs 2xl:text-sm font-black uppercase text-indigo-900 tracking-wider">
                  2ΟΣ ΑΡΙΘΜΟΣ
                </span>
                <span className="min-w-[56px] text-center font-mono font-black text-lg text-indigo-600 bg-white px-2 py-0.5 rounded-lg border border-indigo-200">
                  {n2}
                </span>
              </div>
              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  type="button"
                  aria-label="Μείωση 2ου αριθμού"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setN2((prev) => Math.max(LIMITS.NUM_MIN, prev - 1));
                  }}
                  disabled={n2 <= LIMITS.NUM_MIN}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                >
                  －
                </button>
                <input
                  type="range"
                  min={LIMITS.NUM_MIN}
                  max={LIMITS.NUM_MAX}
                  value={n2}
                  onChange={(e) => setN2(Number(e.target.value))}
                  aria-label="2ος Αριθμός"
                  className="w-full min-w-0 max-w-full accent-indigo-600 cursor-pointer"
                />
                <button
                  type="button"
                  aria-label="Αύξηση 2ου αριθμού"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setN2((prev) => Math.min(LIMITS.NUM_MAX, prev + 1));
                  }}
                  disabled={n2 >= LIMITS.NUM_MAX}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                >
                  ＋
                </button>
              </div>
            </div>

            {/* Αριθμός 3 (Εμφάνιση αν numCount >= 3) */}
            {numCount >= 3 ? (
              <div className="bg-purple-50/70 p-4 2xl:p-5 rounded-2xl border border-purple-200 space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-xs 2xl:text-sm font-black uppercase text-purple-900 tracking-wider">
                    3ΟΣ ΑΡΙΘΜΟΣ
                  </span>
                  <span className="min-w-[56px] text-center font-mono font-black text-lg text-purple-600 bg-white px-2 py-0.5 rounded-lg border border-purple-200">
                    {n3}
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Μείωση 3ου αριθμού"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setN3((prev) => Math.max(LIMITS.NUM_MIN, prev - 1));
                    }}
                    disabled={n3 <= LIMITS.NUM_MIN}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={LIMITS.NUM_MIN}
                    max={LIMITS.NUM_MAX}
                    value={n3}
                    onChange={(e) => setN3(Number(e.target.value))}
                    aria-label="3ος Αριθμός"
                    className="w-full min-w-0 max-w-full accent-purple-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    aria-label="Αύξηση 3ου αριθμού"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setN3((prev) => Math.min(LIMITS.NUM_MAX, prev + 1));
                    }}
                    disabled={n3 >= LIMITS.NUM_MAX}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden lg:flex bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-300 flex-col items-center justify-center text-center opacity-40">
                <span className="text-xs font-bold text-slate-400">Ανενεργός 3ος</span>
              </div>
            )}

            {/* Αριθμός 4 (Εμφάνιση αν numCount === 4) */}
            {numCount === 4 ? (
              <div className="bg-emerald-50/70 p-4 2xl:p-5 rounded-2xl border border-emerald-200 space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-xs 2xl:text-sm font-black uppercase text-emerald-900 tracking-wider">
                    4ΟΣ ΑΡΙΘΜΟΣ
                  </span>
                  <span className="min-w-[56px] text-center font-mono font-black text-lg text-emerald-600 bg-white px-2 py-0.5 rounded-lg border border-emerald-200">
                    {n4}
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Μείωση 4ου αριθμού"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setN4((prev) => Math.max(LIMITS.NUM_MIN, prev - 1));
                    }}
                    disabled={n4 <= LIMITS.NUM_MIN}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={LIMITS.NUM_MIN}
                    max={LIMITS.NUM_MAX}
                    value={n4}
                    onChange={(e) => setN4(Number(e.target.value))}
                    aria-label="4ος Αριθμός"
                    className="w-full min-w-0 max-w-full accent-emerald-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    aria-label="Αύξηση 4ου αριθμού"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setN4((prev) => Math.min(LIMITS.NUM_MAX, prev + 1));
                    }}
                    disabled={n4 >= LIMITS.NUM_MAX}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden lg:flex bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-300 flex-col items-center justify-center text-center opacity-40">
                <span className="text-xs font-bold text-slate-400">Ανενεργός 4ος</span>
              </div>
            )}
          </div>

          {/* Παράθεση Λιστών Πολλαπλασίων με Σήμανση του ΕΚΠ */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500 px-1">
              <span>ΠΑΡΑΘΕΣΗ ΠΟΛΛΑΠΛΑΣΙΩΝ &amp; ΕΝΤΟΠΙΣΜΟΣ ΚΟΙΝΩΝ ΟΡΩΝ</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-amber-500"></span>
                  <span className="text-slate-700">ΕΚΠ</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-sky-500"></span>
                  <span className="text-slate-700">Άλλα Κοινά</span>
                </span>
              </div>
            </div>

            {/* Λίστα 1 */}
            <div className="bg-white p-4 2xl:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-black text-blue-700 bg-blue-50 px-3 py-1 rounded-lg tracking-wider inline-block">
                Π({n1})
              </span>
              <div className="flex flex-wrap gap-2 pt-1 text-sm 2xl:text-base font-mono font-bold">
                {list1.map((v) => {
                  const isEkp = v === ekpResult;
                  const isCommon = isCommonMultiple(v);
                  return (
                    <span
                      key={`l1-${v}`}
                      className={`px-3 py-1.5 rounded-xl border transition ${
                        isEkp
                          ? 'bg-amber-500 text-white border-amber-600 font-black scale-105 shadow-md'
                          : isCommon
                          ? 'bg-sky-500 text-white border-sky-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {v}
                    </span>
                  );
                })}
                <span className="text-slate-400 self-center px-1">...</span>
              </div>
            </div>

            {/* Λίστα 2 */}
            <div className="bg-white p-4 2xl:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg tracking-wider inline-block">
                Π({n2})
              </span>
              <div className="flex flex-wrap gap-2 pt-1 text-sm 2xl:text-base font-mono font-bold">
                {list2.map((v) => {
                  const isEkp = v === ekpResult;
                  const isCommon = isCommonMultiple(v);
                  return (
                    <span
                      key={`l2-${v}`}
                      className={`px-3 py-1.5 rounded-xl border transition ${
                        isEkp
                          ? 'bg-amber-500 text-white border-amber-600 font-black scale-105 shadow-md'
                          : isCommon
                          ? 'bg-sky-500 text-white border-sky-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {v}
                    </span>
                  );
                })}
                <span className="text-slate-400 self-center px-1">...</span>
              </div>
            </div>

            {/* Λίστα 3 */}
            {numCount >= 3 && (
              <div className="bg-white p-4 2xl:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 animate-fade-in">
                <span className="text-xs font-black text-purple-700 bg-purple-50 px-3 py-1 rounded-lg tracking-wider inline-block">
                  Π({n3})
                </span>
                <div className="flex flex-wrap gap-2 pt-1 text-sm 2xl:text-base font-mono font-bold">
                  {list3.map((v) => {
                    const isEkp = v === ekpResult;
                    const isCommon = isCommonMultiple(v);
                    return (
                      <span
                        key={`l3-${v}`}
                        className={`px-3 py-1.5 rounded-xl border transition ${
                          isEkp
                            ? 'bg-amber-500 text-white border-amber-600 font-black scale-105 shadow-md'
                            : isCommon
                            ? 'bg-sky-500 text-white border-sky-600'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {v}
                      </span>
                    );
                  })}
                  <span className="text-slate-400 self-center px-1">...</span>
                </div>
              </div>
            )}

            {/* Λίστα 4 */}
            {numCount === 4 && (
              <div className="bg-white p-4 2xl:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 animate-fade-in">
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg tracking-wider inline-block">
                  Π({n4})
                </span>
                <div className="flex flex-wrap gap-2 pt-1 text-sm 2xl:text-base font-mono font-bold">
                  {list4.map((v) => {
                    const isEkp = v === ekpResult;
                    const isCommon = isCommonMultiple(v);
                    return (
                      <span
                        key={`l4-${v}`}
                        className={`px-3 py-1.5 rounded-xl border transition ${
                          isEkp
                            ? 'bg-amber-500 text-white border-amber-600 font-black scale-105 shadow-md'
                            : isCommon
                            ? 'bg-sky-500 text-white border-sky-600'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {v}
                      </span>
                    );
                  })}
                  <span className="text-slate-400 self-center px-1">...</span>
                </div>
              </div>
            )}
          </div>

          {/* Τελική Κάρτα Αποτελέσματος ΕΚΠ */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 text-white p-6 2xl:p-8 rounded-3xl text-center shadow-lg max-w-3xl mx-auto space-y-2">
            <span className="text-xs 2xl:text-sm uppercase font-black text-sky-200 tracking-wider block">
              ΤΟ ΕΛΑΧΙΣΤΟ ΚΟΙΝΟ ΠΟΛΛΑΠΛΑΣΙΟ
            </span>
            <div className="text-2xl sm:text-3xl 2xl:text-4xl font-black font-mono">
              ΕΚΠ({activeNumbers.join(', ')}) ＝{' '}
              <span className="text-amber-300 text-3xl sm:text-5xl font-black ml-1 inline-block animate-pulse">
                {ekpResult}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-sky-100 max-w-xl mx-auto pt-1 leading-relaxed">
              Ο αριθμός {ekpResult} είναι ο <strong>μικρότερος δυνατός αριθμός</strong> (εκτός του 0) που διαιρείται τέλεια και ταυτόχρονα με όλους τους αριθμούς: {activeNumbers.join(', ')}!
            </p>
          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στο ΕΚΠ!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε απαιτητικές ασκήσεις υπολογισμού ΕΚΠ, σύνθετα προβλήματα συγχρονισμού και μετατροπή κλασμάτων σε ομώνυμα.
            </p>
          </div>

          <Link
            href="/e-dimotikou/06-ekp-ask"
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
