// pages/e-dimotikou/08-mkd.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

const LIMITS = {
  NUM_MIN: 4,
  NUM_MAX: 48
};

export default function MkdTheoryPage() {
  // Πλήθος αριθμών προς εξέταση (2, 3 ή 4)
  const [numCount, setNumCount] = useState(2);

  // Οι τιμές για έως και 4 αριθμούς
  const [n1, setN1] = useState(12);
  const [n2, setN2] = useState(18);
  const [n3, setN3] = useState(24);
  const [n4, setN4] = useState(30);

  // Συναρτήσεις εύρεσης ΜΚΔ για δύο αριθμούς
  const findGCDOfTwo = (a, b) => {
    let x = Math.abs(a);
    let y = Math.abs(b);
    while (y) {
      const t = y;
      y = x % y;
      x = t;
    }
    return x;
  };

  // Υπολογισμός του τελικού ΜΚΔ
  let mkdResult = findGCDOfTwo(n1, n2);
  if (numCount >= 3) mkdResult = findGCDOfTwo(mkdResult, n3);
  if (numCount === 4) mkdResult = findGCDOfTwo(mkdResult, n4);

  // Παραγωγή λιστών με τους πραγματικούς διαιρέτες του κάθε αριθμού
  const getDivisors = (num) => {
    const divs = [];
    for (let i = 1; i <= num; i++) {
      if (num % i === 0) divs.push(i);
    }
    return divs;
  };

  const list1 = getDivisors(n1);
  const list2 = getDivisors(n2);
  const list3 = getDivisors(n3);
  const list4 = getDivisors(n4);

  // Έλεγχος αν ένας αριθμός είναι κοινός διαιρέτης όλων των ενεργών αριθμών
  const isCommonDivisor = (val) => {
    if (numCount === 2) return n1 % val === 0 && n2 % val === 0;
    if (numCount === 3) return n1 % val === 0 && n2 % val === 0 && n3 % val === 0;
    return n1 % val === 0 && n2 % val === 0 && n3 % val === 0 && n4 % val === 0;
  };

  const activeNumbers = [n1, n2];
  if (numCount >= 3) activeNumbers.push(n3);
  if (numCount === 4) activeNumbers.push(n4);

  return (
    <Layout
      title="Μέγιστος Κοινός Διαιρέτης (ΜΚΔ) - Ε' Δημοτικού | LearnMaths.gr"
      description="Πλήρης θεωρία με παραδείγματα για τον Μέγιστο Κοινό Διαιρέτη (ΜΚΔ), μεθόδους υπολογισμού, εφαρμογή σε ανάγωγα κλάσματα και διαδραστικό εργαστήριο για την Ε' Δημοτικού."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/08-mkd-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 8 • Ε' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Μέγιστος Κοινός Διαιρέτης (ΜΚΔ)
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              Μαθαίνουμε πώς να βρίσκουμε τον μεγαλύτερο κοινό διαιρέτη δύο ή περισσότερων φυσικών αριθμών, πώς πετυχαίνουμε άμεση απλοποίηση κλασμάτων σε ανάγωγη μορφή με μία μόνο κίνηση και πώς λύνουμε προβλήματα μέγιστης ισοκατανομής.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία &amp; Δυναμική Σύγκριση Διαιρετών</span>
            </div>
            <Link
              href="/e-dimotikou/08-mkd-ask"
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
              Η μαθηματική ουσία του ΜΚΔ και οι στρατηγικές ταχύτατου υπολογισμού.
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
                  Τι είναι ο ΜΚΔ;
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  <strong>Μέγιστος Κοινός Διαιρέτης (ΜΚΔ)</strong> δύο ή περισσότερων φυσικών αριθμών ονομάζεται ο <strong>μεγαλύτερος</strong> από τους κοινούς διαιρέτες τους.
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <p className="text-slate-700 font-semibold">Συμβολισμός:</p>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-mono font-bold text-slate-900 shadow-inner text-center">
                    ΜΚΔ(12, 18) ＝ 6
                  </div>
                  <p className="text-slate-500 text-xs">
                    Διαβάζεται: «Ο Μέγιστος Κοινός Διαιρέτης του 12 και του 18 είναι το 6».
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Ο αριθμός <strong>1</strong> είναι πάντα κοινός διαιρέτης, άρα ο ΜΚΔ δύο οποιωνδήποτε φυσικών αριθμών είναι τουλάχιστον 1!
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
                  Μέθοδος με Λίστες Διαιρετών
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Γράφουμε αναλυτικά όλους τους διαιρέτες για κάθε αριθμό και επιλέγουμε τον μεγαλύτερο αριθμό που υπάρχει <strong>και στις δύο λίστες</strong>:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono">
                  <div>Δ(12) ＝ {'{'} 1, 2, 3, 4, <strong className="text-emerald-600 font-black">6</strong>, 12 {'}'}</div>
                  <div>Δ(18) ＝ {'{'} 1, 2, 3, <strong className="text-emerald-600 font-black">6</strong>, 9, 18 {'}'}</div>
                  <div className="pt-2 border-t border-slate-200 text-slate-700 font-sans text-xs">
                    Κοινοί διαιρέτες: 1, 2, 3, 6 ➔ <strong>Μέγιστος: 6</strong>.
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Είναι η πιο ασφαλής μέθοδος για να βλέπουμε όλα τα κοινά στοιχεία χωρίς να παραλείψουμε κανένα.
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
                  Έλεγχος Διαιρετών του Μικρότερου
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Επειδή ο ΜΚΔ <strong>δεν μπορεί να ξεπεράσει τον μικρότερο αριθμό</strong>, εξετάζουμε τους διαιρέτες του μικρότερου από τον μεγαλύτερο προς τον μικρότερο:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <p className="text-slate-700 font-semibold">Για το ΜΚΔ(16, 24):</p>
                  <p className="text-slate-600 text-xs">
                    Διαιρέτες του μικρότερου (16): 16, 8, 4, 2, 1.
                  </p>
                  <ol className="list-decimal list-inside space-y-1 font-mono text-slate-700 text-xs">
                    <li>Διαιρεί το 16 το 24; Όχι (24 ： 16 ＝ 1 υπ. 8).</li>
                    <li>Διαιρεί το 8 το 24; <strong className="text-emerald-700">Ναι (24 ： 8 ＝ 3).</strong></li>
                  </ol>
                  <div className="pt-1 text-indigo-900 font-bold font-mono">
                    Άρα ΜΚΔ(16, 24) ＝ 8!
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 <strong>Ειδική Περίπτωση:</strong> Αν ο μικρότερος διαιρεί ακριβώς τον μεγαλύτερο, τότε ο ΜΚΔ είναι ο ίδιος ο μικρότερος αριθμός (π.χ. ΜΚΔ(6, 18) ＝ 6).
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
                  Πού Χρησιμεύει ο ΜΚΔ;
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Ο ΜΚΔ είναι το βασικό μαθηματικό εργαλείο για δύο κρίσιμες εφαρμογές:
                </p>

                <div className="space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                    <strong>1. Απλοποίηση σε Ανάγωγο:</strong> Διαιρώντας αριθμητή και παρονομαστή με τον ΜΚΔ, το κλάσμα γίνεται ανάγωγο αμέσως: (12 ： 6) / (18 ： 6) ＝ <strong>2/3</strong>.
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-950">
                    <strong>2. Προβλήματα Ισομοιρασιάς:</strong> Μας δείχνει το μέγιστο πλήθος όμοιων πακέτων/ομάδων που μπορούμε να φτιάξουμε χωρίς να περισσέψει τίποτα.
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Όταν δύο αριθμοί έχουν <strong>ΜΚΔ ＝ 1</strong>, ονομάζονται <strong>πρώτοι μεταξύ τους</strong>.
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΜΚΔ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
              </div>
              <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Δυναμικός Υπολογιστής &amp; Αναλυτής ΜΚΔ
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Επίλεξε 2, 3 ή 4 αριθμούς. Δες τα σύνολα των διαιρετών τους, πώς ξεχωρίζουν οι κοινοί διαιρέτες και ποιος είναι ο Μέγιστος Κοινός Διαιρέτης.
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

          {/* Παράθεση Λιστών Διαιρετών με Σήμανση του ΜΚΔ */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500 px-1">
              <span>ΠΑΡΑΘΕΣΗ ΔΙΑΙΡΕΤΩΝ &amp; ΕΝΤΟΠΙΣΜΟΣ ΚΟΙΝΩΝ ΟΡΩΝ</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-emerald-500 ring-2 ring-emerald-300"></span>
                  <span className="text-slate-700">ΜΚΔ</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-sky-500"></span>
                  <span className="text-slate-700">Κοινοί Διαιρέτες</span>
                </span>
              </div>
            </div>

            {/* Λίστα 1 */}
            <div className="bg-white p-4 2xl:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-black text-blue-700 bg-blue-50 px-3 py-1 rounded-lg tracking-wider inline-block">
                Δ({n1})
              </span>
              <div className="flex flex-wrap gap-2 pt-1 text-sm 2xl:text-base font-mono font-bold">
                {list1.map((v) => {
                  const isMkd = v === mkdResult;
                  const isCommon = isCommonDivisor(v);
                  return (
                    <span
                      key={`l1-${v}`}
                      className={`px-3 py-1.5 rounded-xl border transition ${
                        isMkd
                          ? 'bg-emerald-500 text-white border-emerald-600 font-black scale-105 shadow-md ring-2 ring-emerald-300'
                          : isCommon
                          ? 'bg-sky-500 text-white border-sky-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {v}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Λίστα 2 */}
            <div className="bg-white p-4 2xl:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg tracking-wider inline-block">
                Δ({n2})
              </span>
              <div className="flex flex-wrap gap-2 pt-1 text-sm 2xl:text-base font-mono font-bold">
                {list2.map((v) => {
                  const isMkd = v === mkdResult;
                  const isCommon = isCommonDivisor(v);
                  return (
                    <span
                      key={`l2-${v}`}
                      className={`px-3 py-1.5 rounded-xl border transition ${
                        isMkd
                          ? 'bg-emerald-500 text-white border-emerald-600 font-black scale-105 shadow-md ring-2 ring-emerald-300'
                          : isCommon
                          ? 'bg-sky-500 text-white border-sky-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {v}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Λίστα 3 */}
            {numCount >= 3 && (
              <div className="bg-white p-4 2xl:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 animate-fade-in">
                <span className="text-xs font-black text-purple-700 bg-purple-50 px-3 py-1 rounded-lg tracking-wider inline-block">
                  Δ({n3})
                </span>
                <div className="flex flex-wrap gap-2 pt-1 text-sm 2xl:text-base font-mono font-bold">
                  {list3.map((v) => {
                    const isMkd = v === mkdResult;
                    const isCommon = isCommonDivisor(v);
                    return (
                      <span
                        key={`l3-${v}`}
                        className={`px-3 py-1.5 rounded-xl border transition ${
                          isMkd
                            ? 'bg-emerald-500 text-white border-emerald-600 font-black scale-105 shadow-md ring-2 ring-emerald-300'
                            : isCommon
                            ? 'bg-sky-500 text-white border-sky-600'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {v}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Λίστα 4 */}
            {numCount === 4 && (
              <div className="bg-white p-4 2xl:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 animate-fade-in">
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg tracking-wider inline-block">
                  Δ({n4})
                </span>
                <div className="flex flex-wrap gap-2 pt-1 text-sm 2xl:text-base font-mono font-bold">
                  {list4.map((v) => {
                    const isMkd = v === mkdResult;
                    const isCommon = isCommonDivisor(v);
                    return (
                      <span
                        key={`l4-${v}`}
                        className={`px-3 py-1.5 rounded-xl border transition ${
                          isMkd
                            ? 'bg-emerald-500 text-white border-emerald-600 font-black scale-105 shadow-md ring-2 ring-emerald-300'
                            : isCommon
                            ? 'bg-sky-500 text-white border-sky-600'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {v}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Τελική Κάρτα Αποτελέσματος ΜΚΔ */}
          <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 text-white p-6 2xl:p-8 rounded-3xl text-center shadow-lg max-w-3xl mx-auto space-y-2">
            <span className="text-xs 2xl:text-sm uppercase font-black text-emerald-200 tracking-wider block">
              Ο ΜΕΓΙΣΤΟΣ ΚΟΙΝΟΣ ΔΙΑΙΡΕΤΗΣ
            </span>
            <div className="text-2xl sm:text-3xl 2xl:text-4xl font-black font-mono">
              ΜΚΔ({activeNumbers.join(', ')}) ＝{' '}
              <span className="text-amber-300 text-3xl sm:text-5xl font-black ml-1 inline-block animate-pulse">
                {mkdResult}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto pt-1 leading-relaxed">
              Ο αριθμός {mkdResult} είναι ο <strong>μεγαλύτερος δυνατός φυσικός αριθμός</strong> που διαιρεί ακριβώς και ταυτόχρονα όλους τους αριθμούς: {activeNumbers.join(', ')}!
            </p>
          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στον ΜΚΔ!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε απαιτητικές ασκήσεις υπολογισμού ΜΚΔ, πλήρη αναγωγή κλασμάτων και σύνθετα προβλήματα μέγιστης ισοκατανομής.
            </p>
          </div>

          <Link
            href="/e-dimotikou/08-mkd-ask"
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
