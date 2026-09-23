// pages/st-dimotikou/49-methodos-trion-ant-analoga.js
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

export default function MethodosTrionAntAnalogaTheoryPage() {
  // Εργαστηριο 1: Διαδραστικος Πινακας Καταταξης Αντιστροφων Ποσων
  const [valA1, setValA1] = useState(4);  // π.χ. 4 εργατες
  const [valB1, setValB1] = useState(15); // π.χ. 15 ημερες
  const [valA2, setValA2] = useState(6);  // π.χ. 6 εργατες

  // Υπολογισμος αγνωστου x με οριζοντιο πολλαπλασιασμο: (valA1 * valB1) / valA2
  const calculatedX = useMemo(() => {
    const raw = (valA1 * valB1) / valA2;
    return Number.isInteger(raw) ? raw : Number(raw.toFixed(1));
  }, [valA1, valB1, valA2]);

  const totalProduct = valA1 * valB1;

  // Εργαστηριο 2: Ρεαλιστικο Προβλημα Ταχυτητας & Χρονου
  const [speed1, setSpeed1] = useState(60);     // km/h
  const [time1, setTime1] = useState(4);        // ωρες
  const [speed2, setSpeed2] = useState(80);     // νεα ταχυτητα σε km/h

  const distanceTotal = speed1 * time1; // 240 km
  const calculatedTime2 = useMemo(() => {
    const raw = distanceTotal / speed2;
    return Number.isInteger(raw) ? raw : Number(raw.toFixed(1));
  }, [distanceTotal, speed2]);

  return (
    <Layout
      title="Μέθοδος των Τριών στα Αντιστρόφως Ανάλογα Ποσά - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Πλήρης θεωρία και διαδραστικό εργαστήριο για τη λύση προβλημάτων με την απλή μέθοδο των τριών σε αντιστρόφως ανάλογα ποσά για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/49-methodos-trion-ant-analoga-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 49 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Μέθοδος των Τριών στα Αντιστρόφως Ανάλογα Ποσά
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              Εμβαθύνουμε στην επίλυση προβλημάτων όπου τα ποσά μεταβάλλονται αντίστροφα, μαθαίνουμε να κατατάσσουμε τα δεδομένα σε στήλες και εφαρμόζουμε με απόλυτη σιγουριά τον κανόνα των οριζόντιων γινομένων χωρίς να πέφτουμε στην παγίδα του χιαστί.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία &amp; Εξομοιωτής Οριζόντιων Γινομένων</span>
            </div>
            <Link
              href="/st-dimotikou/49-methodos-trion-ant-analoga-ask"
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
              Η Τεχνική της Μεθόδου σε 4 Βήματα
            </h2>
            <p className="text-slate-600 text-sm sm:text-base 2xl:text-xl mt-1">
              Πώς εξασφαλίζουμε ότι θα εφαρμόσουμε σωστά τη μέθοδο των τριών στα αντιστρόφως ανάλογα ποσά.
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
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Κατάταξη</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Οργάνωση σε Στήλες
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Γράφουμε τα δεδομένα σε πίνακα δύο στηλών, προσέχοντας τα <strong>ομοειδή ποσά να είναι στην ίδια στήλη</strong> και εκφρασμένα στην <strong>ίδια μονάδα μέτρησης</strong>:
                </p>

                <div className="bg-slate-50 p-3.5 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm font-mono">
                  <div className="grid grid-cols-2 gap-2 text-center border-b pb-1 font-bold text-slate-600">
                    <span>Ποσό Α (π.χ. Εργάτες)</span>
                    <span>Ποσό Β (π.χ. Ημέρες)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center pt-1 font-bold text-slate-800">
                    <span>α₁</span>
                    <span>β₁</span>
                    <span>α₂</span>
                    <span className="text-amber-600">χ</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Βάζουμε πάντα τον άγνωστο <span className="font-bold font-mono">χ</span> στην κάτω δεξιά θέση για απόλυτη τάξη.
              </div>
            </article>

            {/* Βημα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Έλεγχος Είδους</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Έλεγχος Αντιστροφής
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Ρωτάμε με βάση τη λογική του προβλήματος: «Όταν το ένα ποσό <strong>αυξάνεται</strong>, το άλλο <strong>μειώνεται με τον ίδιο ρυθμό</strong>;»
                </p>

                <div className="bg-amber-50/70 p-3.5 2xl:p-5 rounded-2xl border border-amber-200 space-y-2 text-xs sm:text-sm text-amber-950 font-medium">
                  <div>• Περισσότεροι εργάτες ➔ Λιγότερες ημέρες (Ναι)</div>
                  <div>• Μεγαλύτερη ταχύτητα ➔ Λιγότερες ώρες (Ναι)</div>
                  <div>• Περισσότερες βρύσες ➔ Λιγότερος χρόνος (Ναι)</div>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Αν η απάντηση είναι «Ναι», τότε τα ποσά είναι αντιστρόφως ανάλογα και απαγορεύεται το χιαστί!
              </div>
            </article>

            {/* Βημα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Ο Κανόνας</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Οριζόντια Γινόμενα
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Στα αντιστρόφως ανάλογα ποσά το <strong>γινόμενο της πρώτης γραμμής ισούται με το γινόμενο της δεύτερης γραμμής</strong>:
                </p>

                <div className="bg-indigo-50/80 p-4 2xl:p-5 rounded-2xl border border-indigo-200 space-y-2 text-xs sm:text-sm font-mono text-center">
                  <div className="text-slate-700">α₁ · β₁ ＝ α₂ · χ</div>
                  <div className="font-bold text-indigo-950 text-sm sm:text-base pt-1">
                    χ ＝ (α₁ · β₁) : α₂
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Πολλαπλασιάζουμε τους δύο αριθμούς της 1ης γραμμής και διαιρούμε με τον αριθμό που βρίσκεται δίπλα στο χ.
              </div>
            </article>

            {/* Βημα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Έλεγχος</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Επαλήθευση Λογικής
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Επαληθεύουμε αν το αποτέλεσμα συμφωνεί με τη λογική της αντίστροφης μεταβολής:
                </p>

                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                    Αν οι εργάτες <strong>αυξήθηκαν</strong> (α₂ &gt; α₁), τότε οι ημέρες που βρήκαμε <strong>πρέπει να είναι λιγότερες</strong> (χ &lt; β₁).
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Αν βρήκαμε μεγαλύτερο αποτέλεσμα, κάναμε κατά λάθος χιαστί πολλαπλασιασμό!
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Ελέγχουμε πάντοτε ότι α₁ · β₁ ＝ α₂ · χ.
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΕΞΟΜΟΙΩΤΗΣ ΚΑΤΑΤΑΞΗΣ & ΟΡΙΖΟΝΤΙΩΝ ΓΙΝΟΜΕΝΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1</span>
              </div>
              <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Δυναμικός Εξομοιωτής: Κατάταξη &amp; Οριζόντια Γινόμενα
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Μεταβάλλετε τις γνωστές τιμές και παρακολουθήστε πώς κατατάσσονται στον πίνακα, πώς διατηρείται το σταθερό γινόμενο και πώς υπολογίζεται το χ.
              </p>
            </div>
          </div>

          {/* Πλεγμα Χειριστηριων */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 2xl:gap-6">
            
            {/* Αρχικοι Εργατες (α1) */}
            <div className="bg-blue-50/70 p-4 2xl:p-5 rounded-2xl border border-blue-200 space-y-2">
              <div className="h-8 flex items-center justify-between text-left">
                <span className="text-xs 2xl:text-sm font-black uppercase text-blue-900 tracking-wider">
                  ΑΡΧΙΚΟΙ ΕΡΓΑΤΕΣ (α₁)
                </span>
                <span className="font-mono font-black text-lg text-blue-600 bg-white px-2.5 py-0.5 rounded-lg border border-blue-200">
                  {valA1}
                </span>
              </div>
              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setValA1((prev) => Math.max(1, prev - 1)); }}
                  disabled={valA1 <= 1}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                >
                  －
                </button>
                <input
                  type="range"
                  min={1}
                  max={8}
                  value={valA1}
                  onChange={(e) => setValA1(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setValA1((prev) => Math.min(8, prev + 1)); }}
                  disabled={valA1 >= 8}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                >
                  ＋
                </button>
              </div>
            </div>

            {/* Αρχικες Ημερες (β1) */}
            <div className="bg-emerald-50/70 p-4 2xl:p-5 rounded-2xl border border-emerald-200 space-y-2">
              <div className="h-8 flex items-center justify-between text-left">
                <span className="text-xs 2xl:text-sm font-black uppercase text-emerald-900 tracking-wider">
                  ΑΡΧΙΚΕΣ ΗΜΕΡΕΣ (β₁)
                </span>
                <span className="font-mono font-black text-lg text-emerald-600 bg-white px-2.5 py-0.5 rounded-lg border border-emerald-200">
                  {valB1}
                </span>
              </div>
              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setValB1((prev) => Math.max(5, prev - 1)); }}
                  disabled={valB1 <= 5}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                >
                  －
                </button>
                <input
                  type="range"
                  min={5}
                  max={30}
                  value={valB1}
                  onChange={(e) => setValB1(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setValB1((prev) => Math.min(30, prev + 1)); }}
                  disabled={valB1 >= 30}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                >
                  ＋
                </button>
              </div>
            </div>

            {/* Νεοι Εργατες (α2) */}
            <div className="bg-indigo-50/70 p-4 2xl:p-5 rounded-2xl border border-indigo-200 space-y-2">
              <div className="h-8 flex items-center justify-between text-left">
                <span className="text-xs 2xl:text-sm font-black uppercase text-indigo-900 tracking-wider">
                  ΝΕΟΙ ΕΡΓΑΤΕΣ (α₂)
                </span>
                <span className="font-mono font-black text-lg text-indigo-600 bg-white px-2.5 py-0.5 rounded-lg border border-indigo-200">
                  {valA2}
                </span>
              </div>
              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setValA2((prev) => Math.max(1, prev - 1)); }}
                  disabled={valA2 <= 1}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                >
                  －
                </button>
                <input
                  type="range"
                  min={1}
                  max={16}
                  value={valA2}
                  onChange={(e) => setValA2(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setValA2((prev) => Math.min(16, prev + 1)); }}
                  disabled={valA2 >= 16}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                >
                  ＋
                </button>
              </div>
            </div>

          </div>

          {/* Πινακας Καταταξης & Μαθηματικος Υπολογισμος */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Πινακας Καταταξης με Οριζοντια Βελη */}
            <div className="lg:col-span-6 bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                ΚΑΤΑΤΑΞΗ ΣΕ ΟΜΩΝΥΜΕΣ ΣΤΗΛΕΣ
              </div>

              <div className="bg-white rounded-2xl border-2 border-slate-300 p-4 shadow-sm max-w-sm mx-auto font-mono text-center space-y-3">
                <div className="grid grid-cols-2 gap-2 border-b pb-2 font-bold text-slate-600 text-xs sm:text-sm">
                  <span className="bg-blue-50 py-1 rounded-lg text-blue-900">Εργάτες</span>
                  <span className="bg-emerald-50 py-1 rounded-lg text-emerald-900">Ημέρες</span>
                </div>
                
                {/* 1η Γραμμη (Οριζοντιο Γινομενο) */}
                <div className="grid grid-cols-2 gap-3 items-center text-lg sm:text-xl font-black text-slate-800 bg-amber-50/60 p-2 rounded-xl border border-amber-200">
                  <div className="bg-white p-2 rounded-lg border border-slate-200">{valA1}</div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">{valB1}</div>
                </div>

                <div className="text-xs font-bold text-amber-900">
                  Γινόμενο 1ης γραμμής: {valA1} · {valB1} ＝ <strong>{totalProduct}</strong>
                </div>

                {/* 2η Γραμμη */}
                <div className="grid grid-cols-2 gap-3 items-center text-lg sm:text-xl font-black text-slate-800 bg-indigo-50/60 p-2 rounded-xl border border-indigo-200">
                  <div className="bg-white p-2 rounded-lg border border-slate-200">{valA2}</div>
                  <div className="bg-amber-100 p-2 rounded-lg text-amber-950 border border-amber-300 animate-pulse">
                    χ
                  </div>
                </div>
              </div>

              <div className="text-center text-xs font-bold text-indigo-900">
                ↔️ Οριζόντια Γινόμενα: {valA1} · {valB1} ＝ {valA2} · χ
              </div>
            </div>

            {/* Καρτα Τελικης Επιλυσης */}
            <div className="lg:col-span-6 bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                ΜΑΘΗΜΑΤΙΚΗ ΕΠΙΛΥΣΗ
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center space-y-3 font-mono">
                <span className="text-xs text-slate-500 font-sans block font-semibold">
                  Τύπος Οριζόντιου Υπολογισμού:
                </span>
                
                <div className="space-y-1">
                  <div className="text-base sm:text-lg text-indigo-900 font-bold">
                    χ ＝ ({valA1} · {valB1}) : {valA2}
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-600">
                    χ ＝ {totalProduct} : {valA2} ＝ {formatNum(calculatedX)} ημέρες
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-sans text-slate-600 leading-relaxed text-left">
                  <strong>Έλεγχος Λογικής:</strong><br />
                  {valA2 > valA1 ? (
                    <span>Οι εργάτες αυξήθηκαν από {valA1} σε {valA2}, άρα οι ημέρες μειώθηκαν από {valB1} σε <strong>{formatNum(calculatedX)}</strong>. Το αποτέλεσμα είναι απολύτως λογικό!</span>
                  ) : valA2 < valA1 ? (
                    <span>Οι εργάτες μειώθηκαν από {valA1} σε {valA2}, άρα οι ημέρες αυξήθηκαν από {valB1} σε <strong>{formatNum(calculatedX)}</strong>. Το αποτέλεσμα είναι απολύτως λογικό!</span>
                  ) : (
                    <span>Οι εργάτες παρέμειναν ίδιοι, άρα και οι ημέρες παραμένουν {valB1}.</span>
                  )}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΣΥΝΘΕΤΟ ΠΡΟΒΛΗΜΑ ΤΑΧΥΤΗΤΑΣ & ΧΡΟΝΟΥ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
                <span>🚗 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2</span>
              </div>
              <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Πλήρης Εφαρμογή: Ταχύτητα και Χρόνος Διαδρομής
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Παράδειγμα: Ένα φορτηγό με ταχύτητα {speed1} km/h καλύπτει μια απόσταση σε {time1} ώρες. Σε πόσες ώρες θα καλύψει την ίδια διαδρομή αν αυξήσει την ταχύτητά του στα {speed2} km/h;
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Βημα 1: Καταταξη */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3">
              <span className="px-3 py-1 bg-sky-100 text-sky-900 text-xs font-black rounded-lg inline-block">
                1ο ΒΗΜΑ: ΚΑΤΑΤΑΞΗ
              </span>
              <h4 className="font-bold text-slate-900 text-base">
                Στήλες Ποσών
              </h4>
              <div className="bg-white rounded-xl border border-slate-200 p-3 font-mono text-xs sm:text-sm text-center">
                <div className="grid grid-cols-2 gap-2 font-bold border-b pb-1 text-slate-500">
                  <span>Ταχύτητα (km/h)</span>
                  <span>Χρόνος (h)</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 font-bold text-slate-800">
                  <span>{speed1}</span>
                  <span>{time1}</span>
                  <span>{speed2}</span>
                  <span className="text-amber-600 font-black">χ</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 text-center">
                Ταχύτητα κάτω από ταχύτητα και χρόνος κάτω από χρόνο.
              </p>
            </div>

            {/* Βημα 2: Ελεγχος */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3">
              <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-lg inline-block">
                2ο ΒΗΜΑ: ΕΛΕΓΧΟΣ
              </span>
              <h4 className="font-bold text-slate-900 text-base">
                Αντιστρόφως Ανάλογα
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ρωτάμε: «Αν το όχημα κινείται <strong>πιο γρήγορα</strong>, θα χρειαστεί <strong>λιγότερο χρόνο</strong>;»
              </p>
              <div className="p-3 bg-white rounded-xl border border-emerald-200 font-bold text-emerald-900 text-center text-xs sm:text-sm">
                ✓ Ναι! Τα ποσά είναι ΑΝΤΙΣΤΡΟΦΩΣ ΑΝΑΛΟΓΑ.
              </div>
              <p className="text-xs text-slate-500 text-center font-bold text-rose-700">
                Απαγορεύεται το χιαστί!
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
                <div>χ ＝ ({speed1} · {time1}) : {speed2}</div>
                <div>χ ＝ {distanceTotal} : {speed2}</div>
                <div className="text-base sm:text-lg text-emerald-600 font-black pt-1">
                  χ ＝ {formatNum(calculatedTime2)} ώρες
                </div>
              </div>
              <p className="text-xs text-slate-500 text-center">
                Με ταχύτητα {speed2} km/h η διαδρομή θα διαρκέσει {formatNum(calculatedTime2)} ώρες.
              </p>
            </div>

          </div>
        </section>

        {/* 5. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στη Μέθοδο των Τριών στα Αντίστροφα Ποσά!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε 10 απαιτητικές ασκήσεις με οριζόντια γινόμενα, κατάταξη σε στήλες και ρεαλιστικά προβλήματα για τη ΣΤ' Δημοτικού.
            </p>
          </div>

          <Link
            href="/st-dimotikou/49-methodos-trion-ant-analoga-ask"
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
