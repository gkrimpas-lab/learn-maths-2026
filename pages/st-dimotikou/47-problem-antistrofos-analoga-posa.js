// pages/st-dimotikou/47-problem-antistrofos-analoga-posa.js
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

export default function ProblemAntistrofosAnalogaTheoryPage() {
  // Εργαστηριο 1: Εργατες & Χρονος Εργου (Συγκριση Μεθοδων Επιλυσης)
  const [workers1, setWorkers1] = useState(4); // Αρχικοι εργατες
  const [days1, setDays1] = useState(12);       // Αρχικες ημερες
  const [workers2, setWorkers2] = useState(6); // Νεοι εργατες

  // Υπολογισμοι για Εργαστηριο 1
  const totalWork = useMemo(() => {
    return workers1 * days1;
  }, [workers1, days1]);

  const targetDays = useMemo(() => {
    const raw = totalWork / workers2;
    return Number.isInteger(raw) ? raw : Number(raw.toFixed(1));
  }, [totalWork, workers2]);

  // Εργαστηριο 2: Ταχυτητα, Χρονος & Μετατροπες Μοναδων
  const [speed1, setSpeed1] = useState(60);     // km/h
  const [hoursInput, setHoursInput] = useState(2); // 2 ωρες
  const [minutesInput, setMinutesInput] = useState(30); // 30 λεπτα (Συνολο 150 min)
  const [speed2, setSpeed2] = useState(100);   // Νεα ταχυτητα σε km/h

  const totalMinutes1 = hoursInput * 60 + minutesInput;
  const targetMinutes = useMemo(() => {
    const raw = (speed1 * totalMinutes1) / speed2;
    return Number.isInteger(raw) ? raw : Number(raw.toFixed(1));
  }, [speed1, totalMinutes1, speed2]);

  const targetHoursClean = formatNum(targetMinutes / 60, 2);

  return (
    <Layout
      title="Λύση Προβλημάτων με Αντιστρόφως Ανάλογα Ποσά - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μαθαίνουμε πώς να επιλύουμε προβλήματα με αντιστρόφως ανάλογα ποσά με τη μέθοδο της αναγωγής στη μονάδα και με οριζόντια γινόμενα στον πίνακα τιμών για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/47-problem-antistrofos-analoga-posa-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 47 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Λύση Προβλημάτων με Αντιστρόφως Ανάλογα Ποσά
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              Εξετάζουμε πώς αναγνωρίζουμε τα αντιστρόφως ανάλογα ποσά σε ένα πρόβλημα, αποφεύγουμε τη συχνή παγίδα του χιαστί και επιλύουμε κάθε άγνωστο όρο είτε με αναγωγή στη μονάδα είτε με οριζόντια γινόμενα στον πίνακα ποσών.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία &amp; Δυναμική Σύγκριση Μεθόδων Επίλυσης</span>
            </div>
            <Link
              href="/st-dimotikou/47-problem-antistrofos-analoga-posa-ask"
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
              Στρατηγική Επίλυσης σε 4 Βήματα
            </h2>
            <p className="text-slate-600 text-sm sm:text-base 2xl:text-xl mt-1">
              Πώς εξασφαλίζουμε ότι δεν θα μπερδέψουμε τα αντιστρόφως ανάλογα ποσά με τα ανάλογα.
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
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Αναγνώριση</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Έλεγχος Αντιστροφής
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Πριν κάνουμε πράξεις, ρωτάμε λογικά: «Αν διπλασιάσω το πρώτο ποσό, <strong>θα υποδιπλασιαστεί (θα γίνει μισό)</strong> το δεύτερο ποσό;»
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm">
                  <p className="text-slate-700 font-semibold">Κλασικά παραδείγματα:</p>
                  <ul className="space-y-1 text-slate-600">
                    <li>• Περισσότεροι εργάτες ➔ <strong>Λιγότερος χρόνος</strong></li>
                    <li>• Μεγαλύτερη ταχύτητα ➔ <strong>Λιγότερες ώρες ταξιδιού</strong></li>
                    <li>• Περισσότερες βρύσες ➔ <strong>Λιγότερα λεπτά γεμίσματος</strong></li>
                  </ul>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Αν η αύξηση του ενός ποσού οδηγεί σε μείωση με τον ίδιο ρυθμό, το πρόβλημα λύνεται με <strong>αντιστρόφως ανάλογα ποσά</strong>!
              </div>
            </article>

            {/* Βημα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">1η Μέθοδος</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Αναγωγή στη Μονάδα
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Υπολογίζουμε πόσο χρόνο θα χρειαζόταν <strong>1 μόνο εργάτης</strong> (ή 1 βρύση). Επειδή ο 1 εργάτης χρειάζεται περισσότερο χρόνο, <strong>πολλαπλασιάζουμε</strong>:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm font-mono">
                  <div>1ο βήμα (Ο 1 εργάτης): Αρχικοί Εργάτες · Ημέρες</div>
                  <div className="text-amber-900 font-bold">2ο βήμα (Οι νέοι εργάτες): Συνολικός Χρόνος : Νέοι Εργάτες</div>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Προσοχή στη διαφορά: Στα ανάλογα ποσά για το 1 κάναμε <em>διαίρεση</em>, ενώ στα αντιστρόφως ανάλογα κάνουμε <em>πολλαπλασιασμό</em>!
              </div>
            </article>

            {/* Βημα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">2η Μέθοδος</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Πίνακας &amp; Οριζόντια Γινόμενα
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Τοποθετούμε τα ποσά στον πίνακα. Επειδή το γινόμενο των αντίστοιχων τιμών είναι σταθερό, <strong>πολλαπλασιάζουμε οριζόντια</strong> και όχι διαγώνια:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm text-center font-mono">
                  <div className="text-slate-700">χ₁ · ψ₁ ＝ χ₂ · ψ₂</div>
                  <div className="font-bold text-indigo-900 text-sm pt-1">
                    χ₂ ＝ (χ₁ · ψ₁) : ψ₂
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 <strong>ΜΕΓΑΛΗ ΠΑΓΙΔΑ:</strong> Στα αντιστρόφως ανάλογα ποσά <strong>ΠΟΤΕ δεν κάνουμε χιαστί</strong>! Κάνουμε οριζόντιο πολλαπλασιασμό!
              </div>
            </article>

            {/* Βημα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Έλεγχος Λογικής</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Έλεγχος Αποτελέσματος
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Μόλις βρούμε το αποτέλεσμα, ελέγχουμε αν έχει λογικό νόημα:
                </p>

                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                    Αν οι εργάτες <strong>αυξήθηκαν</strong>, οι ημέρες που υπολογίσαμε <strong>πρέπει υποχρεωτικά να είναι λιγότερες</strong> από τις αρχικές!
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Αν βρούμε περισσότερες ημέρες για περισσότερους εργάτες, έχουμε κάνει λάθος και εφαρμόσαμε μέθοδο ανάλογων ποσών.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Ο έλεγχος λογικής αποτρέπει το 100% των συνηθισμένων λαθών στις εξετάσεις!
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΠΑΡΑΛΛΗΛΗ ΣΥΓΚΡΙΣΗ ΤΩΝ 2 ΜΕΘΟΔΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1</span>
              </div>
              <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Παράλληλη Επίλυση Προβλήματος Εργασίας
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Παράδειγμα: {workers1} εργάτες τελειώνουν ένα έργο σε {days1} ημέρες. Σε πόσες ημέρες θα τελειώσουν το έργο {workers2} εργάτες;
              </p>
            </div>
          </div>

          {/* Χειριστηρια Μεταβλητων */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 2xl:gap-6">
            
            {/* Αρχικοι Εργατες */}
            <div className="bg-blue-50/70 p-4 2xl:p-5 rounded-2xl border border-blue-200 space-y-2">
              <div className="h-8 flex items-center justify-between text-left">
                <span className="text-xs 2xl:text-sm font-black uppercase text-blue-900 tracking-wider">
                  ΑΡΧΙΚΟΙ ΕΡΓΑΤΕΣ
                </span>
                <span className="font-mono font-black text-lg text-blue-600 bg-white px-2.5 py-0.5 rounded-lg border border-blue-200">
                  {workers1}
                </span>
              </div>
              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWorkers1((prev) => Math.max(1, prev - 1)); }}
                  disabled={workers1 <= 1}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                >
                  －
                </button>
                <input
                  type="range"
                  min={1}
                  max={8}
                  value={workers1}
                  onChange={(e) => setWorkers1(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWorkers1((prev) => Math.min(8, prev + 1)); }}
                  disabled={workers1 >= 8}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                >
                  ＋
                </button>
              </div>
            </div>

            {/* Αρχικες Ημερες */}
            <div className="bg-amber-50/70 p-4 2xl:p-5 rounded-2xl border border-amber-200 space-y-2">
              <div className="h-8 flex items-center justify-between text-left">
                <span className="text-xs 2xl:text-sm font-black uppercase text-amber-900 tracking-wider">
                  ΑΡΧΙΚΕΣ ΗΜΕΡΕΣ
                </span>
                <span className="font-mono font-black text-lg text-amber-600 bg-white px-2.5 py-0.5 rounded-lg border border-amber-200">
                  {days1}
                </span>
              </div>
              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDays1((prev) => Math.max(4, prev - 2)); }}
                  disabled={days1 <= 4}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                >
                  －
                </button>
                <input
                  type="range"
                  min={4}
                  max={24}
                  step={2}
                  value={days1}
                  onChange={(e) => setDays1(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDays1((prev) => Math.min(24, prev + 2)); }}
                  disabled={days1 >= 24}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                >
                  ＋
                </button>
              </div>
            </div>

            {/* Νεοι Εργατες */}
            <div className="bg-emerald-50/70 p-4 2xl:p-5 rounded-2xl border border-emerald-200 space-y-2">
              <div className="h-8 flex items-center justify-between text-left">
                <span className="text-xs 2xl:text-sm font-black uppercase text-emerald-900 tracking-wider">
                  ΝΕΟΙ ΕΡΓΑΤΕΣ
                </span>
                <span className="font-mono font-black text-lg text-emerald-600 bg-white px-2.5 py-0.5 rounded-lg border border-emerald-200">
                  {workers2}
                </span>
              </div>
              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWorkers2((prev) => Math.max(1, prev - 1)); }}
                  disabled={workers2 <= 1}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                >
                  －
                </button>
                <input
                  type="range"
                  min={1}
                  max={16}
                  value={workers2}
                  onChange={(e) => setWorkers2(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWorkers2((prev) => Math.min(16, prev + 1)); }}
                  disabled={workers2 >= 16}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                >
                  ＋
                </button>
              </div>
            </div>

          </div>

          {/* Παραλληλη Επιλυση: 2 Μεθοδοι */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            
            {/* 1η Μεθοδος: Αναγωγη στη Μοναδα */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-lg inline-block">
                  1η ΜΕΘΟΔΟΣ: ΑΝΑΓΩΓΗ ΣΤΗ ΜΟΝΑΔΑ
                </span>
                <div className="space-y-3 text-xs sm:text-sm text-slate-700 font-mono">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-500 font-sans block text-xs">1ο Βήμα: Πόσες ημέρες θέλει ο 1 εργάτης;</span>
                    <div>{workers1} · {days1} ＝ <strong className="text-amber-900">{totalWork} μεροκάματα</strong></div>
                    <span className="text-[11px] text-slate-400 font-sans block">Πολλαπλασιάζουμε γιατί ο ένας θα κάνει περισσότερο χρόνο!</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-500 font-sans block text-xs">2ο Βήμα: Πόσες ημέρες θέλουν οι {workers2} εργάτες;</span>
                    <div>{totalWork} : {workers2} ＝ <strong className="text-emerald-700">{formatNum(targetDays)} ημέρες</strong></div>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-center font-bold text-xs sm:text-sm text-amber-950">
                Τελικό Αποτέλεσμα: {formatNum(targetDays)} ημέρες
              </div>
            </div>

            {/* 2η Μεθοδος: Πινακας & Οριζοντια Γινομενα */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-900 text-xs font-black rounded-lg inline-block">
                  2η ΜΕΘΟΔΟΣ: ΠΙΝΑΚΑΣ &amp; ΟΡΙΖΟΝΤΙΑ ΓΙΝΟΜΕΝΑ
                </span>
                <div className="bg-white rounded-xl border border-slate-200 p-3 font-mono text-xs text-center space-y-1.5">
                  <div className="grid grid-cols-2 gap-2 font-bold border-b pb-1 text-slate-500">
                    <span>Εργάτες (χ)</span>
                    <span>Ημέρες (ψ)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 font-bold text-slate-800 text-sm">
                    <span>{workers1}</span>
                    <span>{days1}</span>
                    <span>{workers2}</span>
                    <span className="text-indigo-600">χ</span>
                  </div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-xs sm:text-sm text-slate-700 text-center space-y-1">
                  <div>Σταθερό οριζόντιο γινόμενο: {workers1} · {days1} ＝ {workers2} · χ</div>
                  <div className="text-indigo-900 font-bold">
                    χ ＝ ({workers1} · {days1}) : {workers2} ＝ {totalWork} : {workers2} ＝ <strong>{formatNum(targetDays)} ημέρες</strong>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 text-center font-bold text-xs sm:text-sm text-indigo-950">
                Τελικό Αποτέλεσμα: {formatNum(targetDays)} ημέρες
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΣΥΝΘΕΤΟ ΠΡΟΒΛΗΜΑ ΜΕΤΑΤΡΟΠΩΝ ΧΡΟΝΟΥ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
                <span>🚗 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2</span>
              </div>
              <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Σύνθετο Πρόβλημα Ταχύτητας &amp; Μετατροπή σε Λεπτά
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Ένα όχημα με ταχύτητα {speed1} km/h καλύπτει μια διαδρομή σε {hoursInput} ώρες και {minutesInput} λεπτά. Πόσο χρόνο θα χρειαστεί αν τρέχει με {speed2} km/h;
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Βημα 1: Μετατροπη */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3">
              <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-lg inline-block">
                1ο ΒΗΜΑ: ΜΕΤΑΤΡΟΠΗ
              </span>
              <h4 className="font-bold text-slate-900 text-base">
                Όλα σε Λεπτά (min)
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Επειδή ο χρόνος έχει ώρες και λεπτά, μετατρέπουμε τα πάντα σε <strong>ενιαία μονάδα</strong>:
              </p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono font-bold text-slate-900 text-center text-sm">
                {hoursInput} h {minutesInput} min ＝ ({hoursInput} · 60) ＋ {minutesInput} ＝ {totalMinutes1} λεπτά
              </div>
              <p className="text-xs text-slate-500 text-center">
                Έτσι αποφεύγουμε δύσκολους δεκαδικούς αριθμούς.
              </p>
            </div>

            {/* Βημα 2: Πινακας */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3">
              <span className="px-3 py-1 bg-sky-100 text-sky-900 text-xs font-black rounded-lg inline-block">
                2ο ΒΗΜΑ: ΠΙΝΑΚΑΣ
              </span>
              <h4 className="font-bold text-slate-900 text-base">
                Οργάνωση Αντιστρόφων
              </h4>
              <div className="bg-white rounded-xl border border-slate-200 p-3 font-mono text-xs sm:text-sm text-center">
                <div className="grid grid-cols-2 gap-2 font-bold border-b pb-1 text-slate-500">
                  <span>Ταχύτητα (km/h)</span>
                  <span>Χρόνος (min)</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 font-bold text-slate-800">
                  <span>{speed1}</span>
                  <span>{totalMinutes1}</span>
                  <span>{speed2}</span>
                  <span className="text-emerald-600 font-black">χ</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 text-center">
                Μεγαλύτερη ταχύτητα σημαίνει υποχρεωτικά λιγότερος χρόνος!
              </p>
            </div>

            {/* Βημα 3: Επιλυση */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-black rounded-lg inline-block">
                3ο ΒΗΜΑ: ΕΠΙΛΥΣΗ
              </span>
              <h4 className="font-bold text-slate-900 text-base">
                Οριζόντιος Υπολογισμός
              </h4>
              <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-xs sm:text-sm text-center space-y-1 text-emerald-950 font-bold">
                <div>χ ＝ ({speed1} · {totalMinutes1}) : {speed2}</div>
                <div>χ ＝ {speed1 * totalMinutes1} : {speed2} ＝ {formatNum(targetMinutes)} λεπτά</div>
                <div className="text-base sm:text-lg text-emerald-600 font-black pt-1">
                  χ ＝ {targetHoursClean} ώρες
                </div>
              </div>
              <p className="text-xs text-slate-500 text-center">
                Διαιρώντας τα λεπτά με το 60 βρίσκουμε τις ακριβείς ώρες.
              </p>
            </div>

          </div>
        </section>

        {/* 5. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στα Προβλήματα με Αντιστρόφως Ανάλογα Ποσά!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε 10 απαιτητικά ρεαλιστικά προβλήματα, εξασκήσου στην αναγωγή στη μονάδα και στα οριζόντια γινόμενα και έλεγξε τις επιδόσεις σου.
            </p>
          </div>

          <Link
            href="/st-dimotikou/47-problem-antistrofos-analoga-posa-ask"
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
