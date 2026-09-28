// pages/st-dimotikou/58-mesos-oros.js
import { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Βοηθητικο component εμφανισης κλασματος με οριζοντια γραμμη (καθαρο JSX, οχι LaTeX)
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

export default function MesosOrosTheoryPage() {
  // Εργαστηριο 1: Διαδραστικη Εξισορροπηση 4 Τιμων
  const [val1, setVal1] = useState(14);
  const [val2, setVal2] = useState(18);
  const [val3, setVal3] = useState(12);
  const [val4, setVal4] = useState(16);

  const sum1 = val1 + val2 + val3 + val4;
  const count1 = 4;
  const avg1 = useMemo(() => {
    const raw = sum1 / count1;
    return Number.isInteger(raw) ? raw : Number(raw.toFixed(2));
  }, [sum1, count1]);

  // Εργαστηριο 2: Αντιστροφο Προβλημα (Στοχος Μεσου Ορου Βαθμολογιας)
  const [grade1, setGrade1] = useState(16);
  const [grade2, setGrade2] = useState(18);
  const [grade3, setGrade3] = useState(15);
  const [targetAvg, setTargetAvg] = useState(17);

  // Απαιτουμενο αθροισμα 4 διαγωνισματων για να εχουμε targetAvg:
  const requiredSum = targetAvg * 4;
  const currentGradesSum = grade1 + grade2 + grade3;
  const requiredGrade4 = requiredSum - currentGradesSum;

  return (
    <Layout
      title="Μέσος Όρος (Μέση Τιμή) - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μαθαίνουμε τι είναι ο μέσος όρος (μέση τιμή), πώς υπολογίζεται με άθροισμα και διαίρεση, πώς λύνουμε αντίστροφα προβλήματα και εξερευνούμε διαδραστικά την έννοια της εξισορρόπησης."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/58-mesos-oros-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 Ασκήσεις</span>
        </Link>
      }
    >
      {/* Container πληρους ευρους για κινητα εως 2K, 4K & 8K χωρις οριζοντιο scroll */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 sm:space-y-10 2xl:space-y-14 pb-28 sm:pb-32 overflow-x-hidden">
        
        {/* 1. HEADER BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>ΚΕΦΑΛΑΙΟ 58 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Ο Μέσος Όρος (Μέση Τιμή)
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Ανακαλύπτουμε την έννοια της <strong>μέσης τιμής</strong>: πώς μια ομάδα ανόμοιων αριθμών εξισορροπείται σε έναν μοναδικό αντιπροσωπευτικό αριθμό, πώς εκτελούμε τον υπολογισμό με άθροισμα και διαίρεση, και πώς λύνουμε απαιτητικά αντίστροφα προβλήματα.
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία, Οπτική Εξισορρόπηση &amp; Αντίστροφοι Υπολογισμοί</span>
            </div>
            <Link
              href="/st-dimotikou/58-mesos-oros-ask"
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
              Η Έννοια του Μέσου Όρου σε 4 Βήματα
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Από την πρακτική κατανόηση της ισοκατανομής μέχρι τον μαθηματικό τύπο και την επίλυση προβλημάτων.
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
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Ορισμός</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Τι είναι ο Μέσος Όρος;
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  <strong>Μέσος όρος</strong> (ή μέση τιμή) είναι ο αριθμός που δείχνει ποια θα ήταν η τιμή κάθε στοιχείου αν όλες οι ποσότητες <strong>μοιράζονταν εντελώς δίκαια και ισόποσα</strong>.
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 text-slate-700">
                  <p className="leading-normal">
                    Αν τρία παιδιά έχουν 4, 6 και 11 βόλους, όλοι μαζί έχουν 21 βόλους. Αν τους μοίραζαν εξίσου, ο καθένας θα έπαιρνε ακριβώς <strong>7 βόλους</strong>.
                  </p>
                  <div className="p-2 bg-white rounded-xl border border-slate-200 text-center font-mono font-bold text-sky-900">
                    (4 ＋ 6 ＋ 11) : 3 ＝ 21 : 3 ＝ 7
                  </div>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Ο μέσος όρος βρίσκεται πάντοτε <strong>ανάμεσα</strong> στη μικρότερη και τη μεγαλύτερη τιμή των δεδομένων!
              </div>
            </article>

            {/* Βημα 2ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Μαθηματικός Τύπος</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Πώς Υπολογίζεται;
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Για να βρούμε τον μέσο όρο εκτελούμε πάντα δύο διαδοχικές ενέργειες:
                </p>

                <div className="bg-indigo-50/70 p-3 sm:p-4 rounded-2xl border border-indigo-200 text-xs sm:text-sm space-y-2 text-indigo-950">
                  <div className="font-bold flex items-center justify-center gap-1.5 font-mono text-xs sm:text-sm">
                    <span>Μέσος Όρος ＝</span>
                    <Fraction num="Άθροισμα όλων των τιμών" den="Πλήθος των τιμών" />
                  </div>
                  <ol className="list-decimal list-inside space-y-1 pt-1 font-sans text-[11px] sm:text-xs leading-normal">
                    <li><strong>Προσθέτουμε</strong> όλες τις τιμές μαζί.</li>
                    <li><strong>Διαιρούμε</strong> το άθροισμα με το πόσες είναι αυτές οι τιμές.</li>
                  </ol>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Ο μέσος όρος μπορεί να είναι ακέραιος ή δεκαδικός αριθμός (π.χ. 8,5 βαθμοί ή 3,4 γκολ ανά αγώνα).
              </div>
            </article>

            {/* Βημα 3ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Αντίστροφο Πρόβλημα</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Αν Γνωρίζουμε τον Μέσο Όρο
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Σε πολλά προβλήματα δίνεται ο μέσος όρος και ψάχνουμε το σύνολο ή μια τιμή που λείπει:
                </p>

                <div className="bg-amber-50/70 p-3 sm:p-4 rounded-2xl border border-amber-200 text-xs sm:text-sm space-y-2 text-amber-950 font-mono text-center">
                  <div className="p-2 bg-white rounded-xl border border-amber-200 font-bold">
                    Συνολικό Άθροισμα ＝ Μέσος Όρος · Πλήθος
                  </div>
                  <p className="font-sans text-[11px] text-slate-600 leading-normal text-left">
                    Παράδειγμα: Αν 5 μαθητές έχουν μέσο όρο ηλικίας 12 έτη, τότε το άθροισμα των ηλικιών τους είναι <strong className="font-mono text-slate-900">5 · 12 ＝ 60 έτη</strong>.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Πολλαπλασιάζοντας τον μέσο όρο με το πλήθος, ανακτούμε άμεσα το συνολικό άθροισμα!
              </div>
            </article>

            {/* Βημα 4ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Προσοχή στις Παγίδες</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Το Μηδέν (0) Μετράει!
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Μια συχνή παγίδα είναι η παράλειψη των μηδενικών τιμών κατά τη διαίρεση:
                </p>

                <div className="space-y-1.5 text-xs sm:text-sm">
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 text-[11px] leading-normal">
                    <strong>Λάθος:</strong> Αν ένας παίκτης έβαλε 10, 0 και 20 πόντους, να διαιρέσουμε με το 2 επειδή το ένα ματς είχε 0 πόντους.
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-[11px] leading-normal">
                    <strong>Σωστό:</strong> Το ματς με 0 πόντους μετράει κανονικά στο πλήθος! Διαιρούμε με το 3: (10 ＋ 0 ＋ 20) : 3 ＝ 30 : 3 ＝ <strong>10 πόντοι</strong>.
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Όλες οι καταγραφές συμμετέχουν στο πλήθος, ακόμα και όταν η τιμή τους ισούται με 0.
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΟΠΤΙΚΗ ΕΞΙΣΟΡΡΟΠΗΣΗ ΚΑΙ ΜΕΣΟΣ ΟΡΟΣ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 sm:pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Δυναμικός Αναλυτής &amp; Οπτική Εξισορρόπηση Μέσου Όρου
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Ρυθμίστε τις 4 τιμές και παρακολουθήστε πώς διαμορφώνεται το συνολικό άθροισμα και η οριζόντια στάθμη ισορροπίας (μέσος όρος).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            {/* Χειριστηρια Τιμων (4 Steppers με grid 36px_1fr_36px και κουμπια 36px) */}
            <div className="lg:col-span-5 space-y-3 sm:space-y-3.5">
              
              {/* Τιμη 1 */}
              <div className="bg-blue-50/70 p-3 sm:p-3.5 rounded-2xl border border-blue-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Τιμή 1 (Α)
                  </span>
                  <span className="font-mono font-black text-xs sm:text-sm text-blue-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {val1}
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Μείωση Τιμής 1"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setVal1((prev) => Math.max(0, prev - 1)); }}
                    disabled={val1 <= 0}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={25}
                    step={1}
                    value={val1}
                    onChange={(e) => setVal1(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    aria-label="Αύξηση Τιμής 1"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setVal1((prev) => Math.min(25, prev + 1)); }}
                    disabled={val1 >= 25}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Τιμη 2 */}
              <div className="bg-emerald-50/70 p-3 sm:p-3.5 rounded-2xl border border-emerald-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Τιμή 2 (Β)
                  </span>
                  <span className="font-mono font-black text-xs sm:text-sm text-emerald-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {val2}
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Μείωση Τιμής 2"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setVal2((prev) => Math.max(0, prev - 1)); }}
                    disabled={val2 <= 0}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={25}
                    step={1}
                    value={val2}
                    onChange={(e) => setVal2(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    aria-label="Αύξηση Τιμής 2"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setVal2((prev) => Math.min(25, prev + 1)); }}
                    disabled={val2 >= 25}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Τιμη 3 */}
              <div className="bg-amber-50/70 p-3 sm:p-3.5 rounded-2xl border border-amber-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Τιμή 3 (Γ)
                  </span>
                  <span className="font-mono font-black text-xs sm:text-sm text-amber-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {val3}
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Μείωση Τιμής 3"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setVal3((prev) => Math.max(0, prev - 1)); }}
                    disabled={val3 <= 0}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={25}
                    step={1}
                    value={val3}
                    onChange={(e) => setVal3(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    aria-label="Αύξηση Τιμής 3"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setVal3((prev) => Math.min(25, prev + 1)); }}
                    disabled={val3 >= 25}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Τιμη 4 */}
              <div className="bg-purple-50/70 p-3 sm:p-3.5 rounded-2xl border border-purple-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span> Τιμή 4 (Δ)
                  </span>
                  <span className="font-mono font-black text-xs sm:text-sm text-purple-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {val4}
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Μείωση Τιμής 4"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setVal4((prev) => Math.max(0, prev - 1)); }}
                    disabled={val4 <= 0}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={25}
                    step={1}
                    value={val4}
                    onChange={(e) => setVal4(Number(e.target.value))}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    aria-label="Αύξηση Τιμής 4"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setVal4((prev) => Math.min(25, prev + 1)); }}
                    disabled={val4 >= 25}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

            </div>

            {/* Οπτικη Προβολη Ραβδων & Σταθμης Μεσου Ορου (SVG) */}
            <div className="lg:col-span-7 bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 flex flex-col items-center justify-center space-y-4">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                ΟΠΤΙΚΗ ΣΤΑΘΜΗ ΙΣΟΡΡΟΠΙΑΣ (ΜΕΣΟΣ ΟΡΟΣ)
              </span>

              <div className="w-full max-w-[460px] aspect-[4/3] sm:aspect-[16/10] bg-white rounded-2xl border border-slate-200 p-3 sm:p-5 shadow-sm flex items-center justify-center">
                <svg viewBox="0 0 380 230" className="w-full h-auto max-h-[250px] overflow-visible">
                  {/* Οριζοντιες γραμμες πλεγματος */}
                  {[0, 5, 10, 15, 20, 25].map((t) => {
                    const y = 185 - (t / 25) * 155;
                    return (
                      <g key={`avg-tick-${t}`}>
                        <line x1="38" y1={y} x2="360" y2={y} stroke="#f1f5f9" strokeWidth="1.5" />
                        <text x="32" y={y + 4} fontSize="10" fontWeight="bold" fill="#64748b" textAnchor="end">
                          {t}
                        </text>
                      </g>
                    );
                  })}

                  {/* Αξονες */}
                  <line x1="38" y1="185" x2="365" y2="185" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
                  <line x1="38" y1="185" x2="38" y2="25" stroke="#334155" strokeWidth="2" strokeLinecap="round" />

                  {/* 4 Στηλες Τιμων */}
                  {[
                    { label: 'Τιμή 1', val: val1, color: '#2563eb', x: 65 },
                    { label: 'Τιμή 2', val: val2, color: '#059669', x: 140 },
                    { label: 'Τιμή 3', val: val3, color: '#d97706', x: 215 },
                    { label: 'Τιμή 4', val: val4, color: '#9333ea', x: 290 }
                  ].map((col, idx) => {
                    const barH = (col.val / 25) * 155;
                    const barY = 185 - barH;
                    return (
                      <g key={`bar-col-${idx}`}>
                        <rect x={col.x} y={barY} width="40" height={Math.max(barH, 2)} fill={col.color} rx="6" />
                        <text x={col.x + 20} y={barY - 6} fontSize="12" fontWeight="900" fill="#0f172a" textAnchor="middle">
                          {col.val}
                        </text>
                        <text x={col.x + 20} y="202" fontSize="10.5" fontWeight="bold" fill="#475569" textAnchor="middle">
                          {col.label}
                        </text>
                      </g>
                    );
                  })}

                  {/* Διακεκομμενη Γραμμη Μεσου Ορου */}
                  {(() => {
                    const avgY = 185 - (avg1 / 25) * 155;
                    return (
                      <g>
                        <line x1="38" y1={avgY} x2="365" y2={avgY} stroke="#dc2626" strokeWidth="2.5" strokeDasharray="6 4" />
                        <rect x="235" y={avgY - 20} width="125" height="18" fill="#fef2f2" rx="5" stroke="#fca5a5" strokeWidth="1" />
                        <text x="297" y={avgY - 7} fontSize="10.5" fontWeight="900" fill="#dc2626" textAnchor="middle">
                          Μέσος Όρος: {formatNum(avg1)}
                        </text>
                      </g>
                    );
                  })()}
                </svg>
              </div>

              {/* Μαθηματικο Πηλικο */}
              <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-center w-full max-w-[460px] space-y-1">
                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">
                  ΜΑΘΗΜΑΤΙΚΟΣ ΥΠΟΛΟΓΙΣΜΟΣ
                </span>
                <div className="text-sm sm:text-base font-black font-mono text-slate-900">
                  Μ.Ο. ＝ ({val1} ＋ {val2} ＋ {val3} ＋ {val4}) : 4 ＝ {sum1} : 4 ＝{' '}
                  <span className="text-rose-600 underline decoration-rose-400 decoration-2">
                    {formatNum(avg1)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 pt-0.5">
                  Αν ισοπεδώναμε τις 4 στήλες, όλες θα είχαν ύψος ακριβώς {formatNum(avg1)} μονάδες.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΑΝΤΙΣΤΡΟΦΟ ΠΡΟΒΛΗΜΑ - ΣΤΟΧΟΣ ΒΑΘΜΟΛΟΓΙΑΣ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs 2xl:text-sm font-bold text-amber-800 mb-1">
              <span>🎯 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΑΝΤΙΣΤΡΟΦΗ ΕΥΡΕΣΗ ΤΙΜΗΣ</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Πρόβλημα Στόχου: «Τι βαθμό χρειάζομαι στο 4ο τεστ;»
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Ένας μαθητής έγραψε σε 3 διαγωνίσματα βαθμούς {grade1}, {grade2} και {grade3}. Επιλέξτε τον επιθυμητό τελικό μέσο όρο για να δείτε τι βαθμό πρέπει να γράψει στο 4ο διαγώνισμα:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Ρυθμισεις Προβληματος (5 στηλες) */}
            <div className="lg:col-span-5 space-y-3.5">
              
              {/* Στοχος Μεσου Ορου */}
              <div className="bg-amber-50/70 p-3.5 sm:p-4 rounded-2xl border border-amber-200 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-amber-950">
                  <span>ΕΠΙΘΥΜΗΤΟΣ ΤΕΛΙΚΟΣ ΜΕΣΟΣ ΟΡΟΣ:</span>
                  <span className="font-mono text-base sm:text-lg text-amber-700 bg-white px-2.5 py-0.5 rounded-lg border border-amber-200 font-black">
                    {targetAvg}
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Μείωση επιθυμητού μέσου όρου"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setTargetAvg((prev) => Math.max(14, prev - 1)); }}
                    disabled={targetAvg <= 14}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={14}
                    max={20}
                    step={1}
                    value={targetAvg}
                    onChange={(e) => setTargetAvg(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    aria-label="Αύξηση επιθυμητού μέσου όρου"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setTargetAvg((prev) => Math.min(20, prev + 1)); }}
                    disabled={targetAvg >= 20}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Προϋπαρχοντες Βαθμοι */}
              <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-slate-700 block">Προηγούμενοι βαθμοί μαθητή (3 τεστ):</span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono">
                  <div className="bg-white p-2 rounded-xl border border-slate-200 font-bold">1ο: {grade1}</div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200 font-bold">2ο: {grade2}</div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200 font-bold">3ο: {grade3}</div>
                </div>
                <div className="text-slate-600 pt-1 text-center font-sans">
                  Τρέχον άθροισμα: <strong className="font-mono text-slate-900">{grade1} ＋ {grade2} ＋ {grade3} ＝ {currentGradesSum} μονάδες</strong>.
                </div>
              </div>

            </div>

            {/* Αναλυση & Απαιτουμενος 4ος Βαθμος (7 στηλες) */}
            <div className="lg:col-span-7 bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-4">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block text-center">
                ΒΗΜΑΤΑ ΕΠΙΛΥΣΗΣ ΑΝΤΙΣΤΡΟΦΟΥ ΠΡΟΒΛΗΜΑΤΟΣ
              </span>

              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-700">1. Πόσες μονάδες χρειάζονται συνολικά για 4 τεστ;</span>
                  <span className="font-mono font-bold text-indigo-900 bg-indigo-50 px-2.5 py-1 rounded-lg">
                    4 · {targetAvg} ＝ {requiredSum}
                  </span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-700">2. Πόσες μονάδες έχει συγκεντρώσει ήδη;</span>
                  <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {grade1} ＋ {grade2} ＋ {grade3} ＝ {currentGradesSum}
                  </span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-amber-300 flex items-center justify-between bg-amber-50/40">
                  <span className="font-bold text-amber-950">3. Απαιτούμενος βαθμός στο 4ο διαγώνισμα:</span>
                  <span className="font-mono font-black text-base sm:text-lg text-amber-700 bg-white px-3 py-1 rounded-xl border border-amber-300">
                    {requiredGrade4}
                  </span>
                </div>
              </div>

              {requiredGrade4 > 20 ? (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 font-medium text-center">
                  ⚠️ Ο στόχος μέσου όρου {targetAvg} είναι αδύνατος (απαιτεί βαθμό {requiredGrade4} &gt; 20).
                </div>
              ) : requiredGrade4 < 0 ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 font-medium text-center">
                  🎉 Ο στόχος έχει ήδη επιτευχθεί, ακόμα και με 0 βαθμούς στο 4ο διαγώνισμα!
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 font-medium text-center">
                  ✅ Αν γράψει ακριβώς <strong>{requiredGrade4}</strong>, ο τελικός μέσος όρος θα είναι ακριβώς <strong>{targetAvg}</strong>.
                </div>
              )}
            </div>

          </div>
        </section>

        {/* 5. ΛΥΜΕΝΑ ΠΑΡΑΔΕΙΓΜΑΤΑ ΠΡΟΒΛΗΜΑΤΩΝ ΜΕ ΣΧΗΜΑΤΑ */}
        <section className="space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight">
              Λυμένα Προβλήματα Καθημερινής Ζωής
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Δύο χαρακτηριστικά προβλήματα μέσου όρου με πίνακες και γραφικές παραστάσεις.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Παραδειγμα 1 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-900 text-xs font-black rounded-lg">
                  ΠΡΟΒΛΗΜΑ 1: ΚΑΥΣΙΜΑ &amp; ΔΙΑΔΡΟΜΕΣ
                </span>
                <span className="text-xs font-bold text-slate-400">Κατανάλωση</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Μέση Κατανάλωση Αυτοκινήτου σε 4 Ταξίδια
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ένας οδηγός κατέγραψε τα λίτρα βενζίνης που κατανάλωσε σε 4 ισομήκεις διαδρομές: 1ο ταξίδι <strong>6,8 l</strong>, 2ο ταξίδι <strong>7,4 l</strong>, 3ο ταξίδι <strong>6,2 l</strong> και 4ο ταξίδι <strong>7,6 l</strong>. Ποια ήταν η μέση κατανάλωση (l);
              </p>

              {/* Οπτικος Πινακας Δεδομενων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΠΙΝΑΚΑΣ ΚΑΤΑΓΡΑΦΗΣ ΚΑΤΑΝΑΛΩΣΗΣ (l)
                </span>
                <div className="grid grid-cols-4 gap-2 text-center font-mono font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">1ο</span> 6,8 l
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">2ο</span> 7,4 l
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">3ο</span> 6,2 l
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">4ο</span> 7,6 l
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Ανάλυση Επίλυσης:</span>
                  <div>• <strong>Συνολικά λίτρα:</strong> 6,8 ＋ 7,4 ＋ 6,2 ＋ 7,6 ＝ <strong>28 l</strong>.</div>
                  <div>• <strong>Πλήθος ταξιδιών:</strong> 4 ταξίδια.</div>
                  <div>• <strong>Μέση κατανάλωση:</strong> 28 : 4 ＝ <strong className="text-blue-700">7 l ανά ταξίδι</strong>.</div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 font-medium">
                💡 Παρότι σε κανένα ταξίδι δεν έκαψε ακριβώς 7 λίτρα, ο αριθμός 7 αντιπροσωπεύει ιδανικά τη συνολική του συμπεριφορά.
              </div>
            </article>

            {/* Παραδειγμα 2 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-lg">
                  ΠΡΟΒΛΗΜΑ 2: ΜΕΤΕΩΡΟΛΟΓΙΑ
                </span>
                <span className="text-xs font-bold text-slate-400">Εβδομαδιαία Τάση</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Μέση Εβδομαδιαία Θερμοκρασία
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Σε μια ορεινή πόλη καταγράφηκαν οι μεσημεριανές θερμοκρασίες μιας εβδομάδας (7 ημέρες). Το άθροισμα των θερμοκρασιών των πρώτων 6 ημερών ήταν <strong>102°C</strong>. Αν η μέση εβδομαδιαία θερμοκρασία ήταν <strong>17°C</strong>, ποια ήταν η θερμοκρασία την 7η ημέρα;
              </p>

              {/* Οπτικο Σχημα Εξισωσης */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΣΧΕΣΗ ΕΒΔΟΜΑΔΙΑΙΑΣ ΕΞΙΣΩΣΗΣ
                </span>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center font-mono font-bold text-slate-800">
                  (102 ＋ χ) : 7 ＝ 17°C
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήματα Επίλυσης:</span>
                  <div>• <strong>Συνολικό άθροισμα 7 ημερών:</strong> 7 · 17 ＝ <strong>119°C</strong>.</div>
                  <div>• <strong>Θερμοκρασία 7ης ημέρας:</strong> 119 － 102 ＝ <strong className="text-amber-700">17°C</strong>.</div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 font-medium">
                💡 Βρίσκοντας πρώτα το συνολικό άθροισμα των 7 ημερών, η άγνωστη ημέρα προκύπτει με μία απλή αφαίρεση.
              </div>
            </article>

          </div>
        </section>

        {/* 6. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στον Μέσο Όρο!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε 10 απαιτητικές ασκήσεις υπολογισμού μέσης τιμής, αντίστροφων προβλημάτων στόχου και επεξεργασίας πινάκων δεδομένων για τη ΣΤ' Δημοτικού.
            </p>
          </div>

          <Link
            href="/st-dimotikou/58-mesos-oros-ask"
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
