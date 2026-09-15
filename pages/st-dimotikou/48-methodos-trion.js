// pages/st-dimotikou/48-methodos-trion.js
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

export default function MethodosTrionTheoryPage() {
  // Εργαστηριο 1: Διαδραστικος Υπολογιστης Μεθοδου των Τριων
  // Mode: 'analoga' η 'antistrofa'
  const [problemMode, setProblemMode] = useState('analoga');
  const [valA1, setValA1] = useState(3); // π.χ. 3 κιλα η 3 εργατες
  const [valB1, setValB1] = useState(12); // π.χ. 12 ευρω η 12 ημερες
  const [valA2, setValA2] = useState(6); // π.χ. 6 κιλα η 6 εργατες

  // Υπολογισμος αγνωστου x αναλογα με το mode
  const calculatedX = useMemo(() => {
    if (problemMode === 'analoga') {
      // Χιαστι: (valB1 * valA2) / valA1
      const raw = (valB1 * valA2) / valA1;
      return Number.isInteger(raw) ? raw : Number(raw.toFixed(1));
    } else {
      // Οριζοντιο: (valA1 * valB1) / valA2
      const raw = (valA1 * valB1) / valA2;
      return Number.isInteger(raw) ? raw : Number(raw.toFixed(1));
    }
  }, [problemMode, valA1, valB1, valA2]);

  // Εργαστηριο 2: Πρακτικη Επιλυση με Βηματα
  const [bagKg, setBagKg] = useState(25);
  const [bagCost, setBagCost] = useState(40);
  const [targetKg, setTargetKg] = useState(75);

  const calculatedBagCost = useMemo(() => {
    const raw = (bagCost * targetKg) / bagKg;
    return Number.isInteger(raw) ? raw : Number(raw.toFixed(1));
  }, [bagCost, targetKg, bagKg]);

  return (
    <Layout
      title="Η Απλή Μέθοδος των Τριών - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Πλήρης θεωρία με παραδείγματα για την απλή μέθοδο των τριών, τα βήματα κατάταξης, τη διάκριση ανάλογων και αντιστρόφως ανάλογων ποσών και διαδραστικό εργαστήριο για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/48-methodos-trion-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 48 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Η Απλή Μέθοδος των Τριών
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              Ανακαλύπτουμε την ιστορική μέθοδο των Μαθηματικών όπου από τρεις γνωστές τιμές δύο ποσών υπολογίζουμε την τέταρτη άγνωστη τιμή, μαθαίνοντας να κατατάσσουμε τα δεδομένα και να επιλέγουμε σωστά μεταξύ χιαστί και οριζόντιου πολλαπλασιασμού.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία &amp; Δυναμική Κατάταξη Ποσών</span>
            </div>
            <Link
              href="/st-dimotikou/48-methodos-trion-ask"
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
              Ο Αλγόριθμος της Μεθόδου των Τριών σε 4 Βήματα
            </h2>
            <p className="text-slate-600 text-sm sm:text-base 2xl:text-xl mt-1">
              Ο απόλυτος πρακτικός κανόνας για να μην κάνουμε ποτέ λάθος σε πρόβλημα ποσών.
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
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Ορισμός</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Τι είναι η Μέθοδος των Τριών;
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Ονομάζεται <strong>Απλή Μέθοδος των Τριών</strong> επειδή σε ένα πρόβλημα δύο ποσών γνωρίζουμε <strong>τρεις όρους</strong> και αναζητούμε τον <strong>τέταρτο άγνωστο όρο</strong> (<span className="font-mono font-bold">χ</span>).
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm">
                  <p className="text-slate-700 font-semibold">Σκοπός της μεθόδου:</p>
                  <p className="text-slate-600 leading-relaxed">
                    Να οργανώσει τις γνωστές πληροφορίες έτσι ώστε να υπολογίσουμε άμεσα τον άγνωστο με μία μόνο αριθμητική παράσταση.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Λέγεται «απλή» γιατί συγκρίνει δύο μόνο ποσά. Αν υπήρχαν τρία ή περισσότερα ποσά, θα λεγόταν «σύνθετη».
              </div>
            </article>

            {/* Βημα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Κατάταξη</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Κατάταξη σε Ομώνυμες Στήλες
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Γράφουμε τα δεδομένα σε δύο στήλες, τοποθετώντας τα <strong>ομοειδή ποσά το ένα κάτω από το άλλο</strong> και στην <strong>ίδια μονάδα μέτρησης</strong>:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm font-mono">
                  <div className="grid grid-cols-2 gap-2 text-center border-b pb-1 font-bold text-slate-600">
                    <span>Ποσό Α (π.χ. kg)</span>
                    <span>Ποσό Β (π.χ. €)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center pt-1 font-bold text-slate-800">
                    <span>α₁</span>
                    <span>β₁</span>
                    <span>α₂</span>
                    <span className="text-amber-600">χ</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Απαράβατος κανόνας: Δεν βάζουμε ποτέ κιλά κάτω από ευρώ ή ώρες κάτω από χιλιόμετρα!
              </div>
            </article>

            {/* Βημα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Διάκριση Ποσών</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Έλεγχος: Ανάλογα ή Αντίστροφα;
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Εξετάζουμε τη σχέση των δύο ποσών θέτοντας το λογικό ερώτημα:
                </p>

                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-950">
                    <strong>Αν είναι ΑΝΑΛΟΓΑ:</strong> Όταν το πρώτο διπλασιάζεται, διπλασιάζεται και το δεύτερο (π.χ. βάρος και τιμή).
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-950">
                    <strong>Αν είναι ΑΝΤΙΣΤΡΟΦΩΣ ΑΝΑΛΟΓΑ:</strong> Όταν το πρώτο διπλασιάζεται, το δεύτερο γίνεται μισό (π.χ. εργάτες και ημέρες).
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Από αυτό το βήμα εξαρτάται αν θα εκτελέσουμε χιαστί ή οριζόντιο υπολογισμό.
              </div>
            </article>

            {/* Βημα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Εκτέλεση</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Επίλυση με τον Σωστό Τύπο
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Εφαρμόζουμε τον κατάλληλο τύπο υπολογισμού:
                </p>

                <div className="space-y-2 text-xs sm:text-sm font-mono">
                  <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 text-center font-bold">
                    Ανάλογα (Χιαστί):<br />
                    χ ＝ (β₁ · α₂) : α₁
                  </div>
                  <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 text-center font-bold">
                    Αντιστρόφως (Οριζόντια):<br />
                    χ ＝ (α₁ · β₁) : α₂
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Ελέγχουμε πάντα αν το αποτέλεσμα έχει λογική (π.χ. περισσότεροι εργάτες ➔ λιγότερες ημέρες).
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΔΙΑΔΡΑΣΤΙΚΟΣ ΥΠΟΛΟΓΙΣΤΗΣ ΜΕΘΟΔΟΥ ΤΩΝ ΤΡΙΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1</span>
              </div>
              <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Δυναμικός Εξομοιωτής της Μεθόδου των Τριών
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Επιλέξτε το είδος των ποσών (Ανάλογα ή Αντιστρόφως Ανάλογα) και δείτε πώς προσαρμόζεται η κατάταξη, η κατεύθυνση των πράξεων και ο τελικός τύπος.
              </p>
            </div>

            {/* Διακοπτης Ειδους Ποσων */}
            <div className="inline-flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start sm:self-center">
              <button
                type="button"
                onClick={() => setProblemMode('analoga')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                  problemMode === 'analoga'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Ανάλογα Ποσά (Χιαστί)
              </button>
              <button
                type="button"
                onClick={() => setProblemMode('antistrofa')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                  problemMode === 'antistrofa'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Αντιστρόφως Ανάλογα (Οριζόντια)
              </button>
            </div>
          </div>

          {/* Πλεγμα Χειριστηριων 3 Γνωστων Τιμων */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 2xl:gap-6">
            
            {/* Τιμη α1 */}
            <div className="bg-blue-50/70 p-4 2xl:p-5 rounded-2xl border border-blue-200 space-y-2">
              <div className="h-8 flex items-center justify-between text-left">
                <span className="text-xs 2xl:text-sm font-black uppercase text-blue-900 tracking-wider">
                  1ΟΣ ΓΝΩΣΤΟΣ ΟΡΟΣ (α₁)
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
                  max={12}
                  value={valA1}
                  onChange={(e) => setValA1(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setValA1((prev) => Math.min(12, prev + 1)); }}
                  disabled={valA1 >= 12}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                >
                  ＋
                </button>
              </div>
            </div>

            {/* Τιμη β1 */}
            <div className="bg-emerald-50/70 p-4 2xl:p-5 rounded-2xl border border-emerald-200 space-y-2">
              <div className="h-8 flex items-center justify-between text-left">
                <span className="text-xs 2xl:text-sm font-black uppercase text-emerald-900 tracking-wider">
                  2ΟΣ ΓΝΩΣΤΟΣ ΟΡΟΣ (β₁)
                </span>
                <span className="font-mono font-black text-lg text-emerald-600 bg-white px-2.5 py-0.5 rounded-lg border border-emerald-200">
                  {valB1}
                </span>
              </div>
              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setValB1((prev) => Math.max(4, prev - 2)); }}
                  disabled={valB1 <= 4}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                >
                  －
                </button>
                <input
                  type="range"
                  min={4}
                  max={40}
                  step={2}
                  value={valB1}
                  onChange={(e) => setValB1(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setValB1((prev) => Math.min(40, prev + 2)); }}
                  disabled={valB1 >= 40}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                >
                  ＋
                </button>
              </div>
            </div>

            {/* Τιμη α2 */}
            <div className="bg-indigo-50/70 p-4 2xl:p-5 rounded-2xl border border-indigo-200 space-y-2">
              <div className="h-8 flex items-center justify-between text-left">
                <span className="text-xs 2xl:text-sm font-black uppercase text-indigo-900 tracking-wider">
                  3ΟΣ ΓΝΩΣΤΟΣ ΟΡΟΣ (α₂)
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
            
            {/* Πινακας Καταταξης */}
            <div className="lg:col-span-6 bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                ΠΙΝΑΚΑΣ ΚΑΤΑΤΑΞΗΣ ΤΗΣ ΜΕΘΟΔΟΥ ΤΩΝ ΤΡΙΩΝ
              </div>

              <div className="bg-white rounded-2xl border-2 border-slate-300 p-4 shadow-sm max-w-sm mx-auto font-mono text-center">
                <div className="grid grid-cols-2 gap-2 border-b pb-2 font-bold text-slate-600 text-xs sm:text-sm">
                  <span className="bg-blue-50 py-1 rounded-lg text-blue-900">ΠΟΣΟ 1</span>
                  <span className="bg-emerald-50 py-1 rounded-lg text-emerald-900">ΠΟΣΟ 2</span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-3 text-lg sm:text-xl font-black text-slate-800">
                  <div className="bg-slate-100 p-2.5 rounded-xl">{valA1}</div>
                  <div className="bg-slate-100 p-2.5 rounded-xl">{valB1}</div>
                  <div className="bg-slate-100 p-2.5 rounded-xl">{valA2}</div>
                  <div className="bg-amber-100 p-2.5 rounded-xl text-amber-950 border border-amber-300 animate-pulse">
                    χ
                  </div>
                </div>
              </div>

              <div className="text-center text-xs font-semibold text-slate-600">
                {problemMode === 'analoga' ? (
                  <span className="text-blue-700 font-bold">
                    🔄 Ανάλογα Ποσά ➔ Εφαρμόζουμε σταυρωτά γινόμενα (χιαστί: {valB1} · {valA2} : {valA1}).
                  </span>
                ) : (
                  <span className="text-amber-700 font-bold">
                    ↔️ Αντιστρόφως Ανάλογα ➔ Εφαρμόζουμε οριζόντια γινόμενα ({valA1} · {valB1} : {valA2}).
                  </span>
                )}
              </div>
            </div>

            {/* Καρτα Τελικης Επιλυσης */}
            <div className="lg:col-span-6 bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                ΜΑΘΗΜΑΤΙΚΗ ΕΠΙΛΥΣΗ
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center space-y-3 font-mono">
                <span className="text-xs text-slate-500 font-sans block font-semibold">
                  Τύπος Επίλυσης:
                </span>
                
                {problemMode === 'analoga' ? (
                  <div className="space-y-1">
                    <div className="text-base sm:text-lg text-blue-900 font-bold">
                      χ ＝ ({valB1} · {valA2}) : {valA1}
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-emerald-600">
                      χ ＝ {valB1 * valA2} : {valA1} ＝ {formatNum(calculatedX)}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="text-base sm:text-lg text-amber-900 font-bold">
                      χ ＝ ({valA1} · {valB1}) : {valA2}
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-emerald-600">
                      χ ＝ {valA1 * valB1} : {valA2} ＝ {formatNum(calculatedX)}
                    </div>
                  </div>
                )}

                <p className="text-xs text-slate-500 font-sans pt-1">
                  Από τους τρεις γνωστούς όρους ({valA1}, {valB1}, {valA2}) υπολογίσαμε με ακρίβεια τον τέταρτο όρο (<span className="font-bold font-mono">χ ＝ {formatNum(calculatedX)}</span>).
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΒΗΜΑ-ΠΡΟΣ-ΒΗΜΑ ΠΡΑΚΤΙΚΟ ΠΡΟΒΛΗΜΑ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
                <span>📦 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2</span>
              </div>
              <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Πλήρης Εφαρμογή: Αγορά Ζωοτροφών σε Σακιά
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Παράδειγμα: Ένας κτηνοτρόφος αγοράζει {bagKg} kg ζωοτροφής προς {bagCost} €. Πόσα € θα πληρώσει για να αγοράσει {targetKg} kg από την ίδια ζωοτροφή;
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
                Τοποθέτηση σε Στήλες
              </h4>
              <div className="bg-white rounded-xl border border-slate-200 p-3 font-mono text-xs sm:text-sm text-center">
                <div className="grid grid-cols-2 gap-2 font-bold border-b pb-1 text-slate-500">
                  <span>Βάρος (kg)</span>
                  <span>Κόστος (€)</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 font-bold text-slate-800">
                  <span>{bagKg}</span>
                  <span>{bagCost}</span>
                  <span>{targetKg}</span>
                  <span className="text-amber-600 font-black">χ</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 text-center">
                Τα κιλά κάτω από τα κιλά και τα ευρώ κάτω από τα ευρώ.
              </p>
            </div>

            {/* Βημα 2: Ελεγχος Ειδους */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3">
              <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-lg inline-block">
                2ο ΒΗΜΑ: ΕΛΕΓΧΟΣ
              </span>
              <h4 className="font-bold text-slate-900 text-base">
                Ανάλογα ή Αντίστροφα;
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ρωτάμε: «Αν αγοράσω <strong>περισσότερα κιλά</strong>, θα πληρώσω <strong>περισσότερα χρήματα</strong>;»
              </p>
              <div className="p-3 bg-white rounded-xl border border-emerald-200 font-bold text-emerald-900 text-center text-xs sm:text-sm">
                ✓ Ναι! Τα ποσά είναι ΑΝΑΛΟΓΑ.
              </div>
              <p className="text-xs text-slate-500 text-center">
                Συνεπώς εφαρμόζουμε χιαστί πολλαπλασιασμό.
              </p>
            </div>

            {/* Βημα 3: Επιλυση */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-black rounded-lg inline-block">
                3ο ΒΗΜΑ: ΕΠΙΛΥΣΗ
              </span>
              <h4 className="font-bold text-slate-900 text-base">
                Υπολογισμός του χ
              </h4>
              <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-xs sm:text-sm text-center space-y-1 text-emerald-950 font-bold">
                <div>χ ＝ ({bagCost} · {targetKg}) : {bagKg}</div>
                <div>χ ＝ {bagCost * targetKg} : {bagKg}</div>
                <div className="text-base sm:text-lg text-emerald-600 font-black pt-1">
                  χ ＝ {formatNum(calculatedBagCost)} €
                </div>
              </div>
              <p className="text-xs text-slate-500 text-center">
                Για {targetKg} kg ζωοτροφής θα πληρώσει {formatNum(calculatedBagCost)} €.
              </p>
            </div>

          </div>
        </section>

        {/* 5. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στη Μέθοδο των Τριών!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε 10 απαιτητικά προβλήματα ανάλογων και αντιστρόφως ανάλογων ποσών, εφάρμοσε σωστή κατάταξη και έλεγξε τις επιδόσεις σου.
            </p>
          </div>

          <Link
            href="/st-dimotikou/48-methodos-trion-ask"
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
