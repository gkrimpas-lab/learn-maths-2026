// pages/st-dimotikou/53-ksero-arxiki-teliki-timi.js
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

export default function KseroArxikiTelikiTimiTheoryPage() {
  // Εργαστηριο 1: Διαδραστικος Υπολογιστης Ποσοστου Μεταβολης (Step 1)
  const [initialPrice, setInitialPrice] = useState(80); // Αρχικη τιμη σε €
  const [finalPrice, setFinalPrice] = useState(60);     // Τελικη τιμη σε €

  // Υπολογισμος απολυτης διαφορας και ειδους μεταβολης
  const difference = useMemo(() => {
    return Math.abs(finalPrice - initialPrice);
  }, [finalPrice, initialPrice]);

  const changeType = finalPrice < initialPrice ? 'discount' : finalPrice > initialPrice ? 'increase' : 'stable';

  // Υπολογισμος ποσοστου μεταβολης: (difference / initialPrice) * 100
  const percentage = useMemo(() => {
    if (initialPrice <= 0) return 0;
    const raw = (difference / initialPrice) * 100;
    return Number.isInteger(raw) ? raw : Number(raw.toFixed(1));
  }, [difference, initialPrice]);

  // Εργαστηριο 2: Προκαθορισμενο Παραδειγμα για Συγκριση Μεθοδων
  const [sampleOriginal, setSampleOriginal] = useState(120);
  const [sampleFinal, setSampleFinal] = useState(90);

  const sampleDiff = sampleOriginal - sampleFinal; // 30 € εκπτωση
  const samplePct = (sampleDiff / sampleOriginal) * 100; // 25%

  return (
    <Layout
      title="Εύρεση Ποσοστού από Αρχική και Τελική Τιμή - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μαθαίνουμε πώς υπολογίζουμε το ποσοστό έκπτωσης ή αύξησης όταν γνωρίζουμε την αρχική και την τελική τιμή ενός ποσού με διαδραστικά εργαστήρια και παραδείγματα."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/53-ksero-arxiki-teliki-timi-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 53 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Εύρεση Ποσοστού όταν Ξέρω Αρχική και Τελική Τιμή
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              Μαθαίνουμε πώς να υπολογίζουμε το ακριβές ποσοστό έκπτωσης (%) ή αύξησης (%) όταν γνωρίζουμε πόσο κόστιζε ένα προϊόν αρχικά και πόσο πληρώσαμε τελικά, χρησιμοποιώντας τη διαφορά των τιμών και τη μέθοδο των ανάλογων ποσών.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία, Λυμένα Προβλήματα &amp; Διαδραστικός Υπολογιστής Ποσοστού</span>
            </div>
            <Link
              href="/st-dimotikou/53-ksero-arxiki-teliki-timi-ask"
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
              Η Διαδικασία Επίλυσης σε 4 Βήματα
            </h2>
            <p className="text-slate-600 text-sm sm:text-base 2xl:text-xl mt-1">
              Πώς μετατρέπουμε τη χρηματική διαφορά ανάμεσα στις δύο τιμές σε ποσοστό στα εκατό (%).
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
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Πρώτη Πράξη</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Εύρεση της Διαφοράς
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Το πρώτο και απαραίτητο βήμα είναι να βρούμε πόσα ευρώ (€) <strong>μειώθηκε</strong> ή <strong>αυξήθηκε</strong> η τιμή κάνοντας αφαίρεση:
                </p>

                <div className="space-y-2 text-xs sm:text-sm font-mono">
                  <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200 text-rose-950">
                    🔻 <strong>Σε Έκπτωση:</strong><br />
                    Ποσό Έκπτωσης ＝ Αρχική Τιμή － Τελική Τιμή
                  </div>
                  <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950">
                    🔺 <strong>Σε Αύξηση:</strong><br />
                    Ποσό Αύξησης ＝ Τελική Τιμή － Αρχική Τιμή
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Η διαφορά αυτή δείχνει την απόλυτη μεταβολή σε ευρώ πριν τη μετατρέψουμε σε ποσοστό.
              </div>
            </article>

            {/* Βημα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Βάση Σύγκρισης</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Πάντα στην Αρχική Τιμή!
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Το ποσοστό μεταβολής συγκρίνεται <strong>ΠΑΝΤΟΤΕ με την αρχική τιμή</strong> (αυτή είναι το 100%):
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm text-center">
                  <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 font-bold font-mono">
                    Κλάσμα Μεταβολής ＝ <Fraction num="Μεταβολή (€)" den="Αρχική Τιμή (€)" />
                  </div>
                  <p className="text-slate-500 text-xs pt-1 font-sans">
                    Ποτέ δεν βάζουμε στον παρονομαστή την τελική τιμή, γιατί η έκπτωση ή η αύξηση ξεκίνησε από την αρχική!
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Κανόνας: «Στα πόσα ευρώ αρχικής αξίας είχαμε τόσα ευρώ αλλαγής;»
              </div>
            </article>

            {/* Βημα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Μέθοδος 1</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Πίνακας Ποσών &amp; Χιαστί
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Στήνουμε έναν πίνακα ποσών και τιμών συγκρίνοντας την αρχική τιμή με τη διαφορά:
                </p>

                <div className="bg-slate-50 p-3.5 2xl:p-4 rounded-2xl border border-slate-200 font-mono text-xs sm:text-sm space-y-1.5 text-center">
                  <div className="grid grid-cols-2 gap-2 border-b pb-1 font-bold text-slate-600">
                    <span>Αρχική Τιμή (€)</span>
                    <span>Μεταβολή (€)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 font-bold text-slate-800">
                    <span>Αρχική Τιμή</span>
                    <span>Διαφορά</span>
                    <span>100</span>
                    <span className="text-indigo-600">χ</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-sans pt-1">
                    χ ＝ (Διαφορά · 100) : Αρχική Τιμή
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Ο πίνακας βοηθάει τους μαθητές να βλέπουν καθαρά ότι το 100 τοποθετείται κάτω από την αρχική τιμή.
              </div>
            </article>

            {/* Βημα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Μέθοδος 2</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Μετατροπή Κλάσματος σε %
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Η ταχύτερη μέθοδος: σχηματίζουμε το κλάσμα <Fraction num="Διαφορά" den="Αρχική" />, κάνουμε τη διαίρεση και <strong>πολλαπλασιάζουμε με το 100</strong>:
                </p>

                <div className="bg-slate-50 p-3.5 2xl:p-4 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm font-mono text-center">
                  <div className="p-2 bg-white rounded-xl border border-slate-200 text-slate-800 font-bold">
                    Ποσοστό % ＝ (Διαφορά : Αρχική Τιμή) · 100
                  </div>
                  <p className="text-slate-500 text-xs font-sans">
                    Παράδειγμα: Διαφορά 20 € στα 80 € ➔ 20 : 80 ＝ 0,25 ➔ 0,25 · 100 ＝ <strong>25 %</strong>.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Απλή διαίρεση και μετακίνηση της υποδιαστολής 2 θέσεις δεξιά.
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΥΠΟΛΟΓΙΣΤΗΣ ΠΟΣΟΣΤΟΥ ΜΕΤΑΒΟΛΗΣ (STEP 1) */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1</span>
              </div>
              <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Δυναμικός Εξομοιωτής Εύρεσης Ποσοστού Μεταβολής
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Ορίστε την αρχική και την τελική τιμή ανά 1 μονάδα. Ο εξομοιωτής εντοπίζει αυτόματα αν πρόκειται για αύξηση ή μείωση και υπολογίζει το ποσοστό στα εκατό (%).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Χειριστηρια Αρχικης & Τελικης Τιμης (Step 1) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Αρχικη Τιμη (Step 1) */}
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
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setInitialPrice((prev) => Math.max(1, prev - 1)); }}
                    disabled={initialPrice <= 1}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={1}
                    max={200}
                    step={1}
                    value={initialPrice}
                    onChange={(e) => setInitialPrice(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setInitialPrice((prev) => Math.min(200, prev + 1)); }}
                    disabled={initialPrice >= 200}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Τελικη Τιμη (Step 1) */}
              <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-200 space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-xs font-black uppercase text-indigo-900 tracking-wider">
                    ΤΕΛΙΚΗ ΤΙΜΗ ΠΛΗΡΩΜΗΣ (€)
                  </span>
                  <span className="font-mono font-black text-lg text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-indigo-200">
                    {finalPrice} €
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFinalPrice((prev) => Math.max(1, prev - 1)); }}
                    disabled={finalPrice <= 1}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={1}
                    max={200}
                    step={1}
                    value={finalPrice}
                    onChange={(e) => setFinalPrice(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFinalPrice((prev) => Math.min(200, prev + 1)); }}
                    disabled={finalPrice >= 200}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Ενημερωτικη Καρτα Καταστασης */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
                {changeType === 'discount' && (
                  <span className="text-rose-800 font-bold">
                    🔻 Έκπτωση / Μείωση: Η τιμή έπεσε κατά {difference} € ({initialPrice} － {finalPrice}).
                  </span>
                )}
                {changeType === 'increase' && (
                  <span className="text-emerald-800 font-bold">
                    🔺 Αύξηση: Η τιμή ανέβηκε κατά {difference} € ({finalPrice} － {initialPrice}).
                  </span>
                )}
                {changeType === 'stable' && (
                  <span className="text-slate-700 font-bold">
                    ⚖️ Καμία μεταβολή: Αρχική και τελική τιμή είναι ίσες (ποσοστό 0%).
                  </span>
                )}
              </div>

            </div>

            {/* Πινακας Αναλογιας & Αποτελεσματα */}
            <div className="lg:col-span-7 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                ΠΙΝΑΚΑΣ ΑΝΑΛΟΓΩΝ ΠΟΣΩΝ (ΑΝΑΓΩΓΗ ΣΤΑ 100)
              </div>

              {/* Πινακας 2x2 */}
              <div className="max-w-md mx-auto bg-white rounded-2xl border-2 border-slate-300 shadow-sm p-4 space-y-3 font-mono text-center">
                <div className="grid grid-cols-2 gap-2 border-b pb-2 font-bold text-slate-600 text-xs sm:text-sm">
                  <span className="bg-blue-50 py-1 rounded-lg text-blue-900">Αρχική Τιμή (€)</span>
                  <span className={changeType === 'discount' ? 'bg-rose-50 py-1 rounded-lg text-rose-900' : 'bg-emerald-50 py-1 rounded-lg text-emerald-900'}>
                    Μεταβολή (€)
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2 text-lg sm:text-xl font-black text-slate-800">
                  <div className="bg-slate-100 p-2.5 rounded-xl">{initialPrice}</div>
                  <div className="bg-slate-100 p-2.5 rounded-xl">{difference}</div>
                  <div className="bg-slate-100 p-2.5 rounded-xl">100</div>
                  <div className="bg-amber-100 p-2.5 rounded-xl text-amber-950 border border-amber-300 animate-pulse">
                    χ
                  </div>
                </div>
                <div className="text-xs font-sans text-slate-500 pt-1">
                  Χιαστί υπολογισμός: χ ＝ ({difference} · 100) : {initialPrice} ＝ <strong>{formatNum(percentage)} %</strong>
                </div>
              </div>

              {/* Καρτες Αποτελεσματων */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-center">
                <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-slate-500 uppercase block">
                    ΔΙΑΦΟΡΑ ΤΙΜΗΣ
                  </span>
                  <div className={`font-mono font-black text-xl sm:text-2xl ${changeType === 'discount' ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {difference} €
                  </div>
                  <span className="text-[11px] text-slate-500 block font-sans">
                    |{finalPrice} － {initialPrice}|
                  </span>
                </div>

                <div className="p-4 bg-white rounded-2xl border-2 border-amber-300 bg-amber-50/50 space-y-1">
                  <span className="text-xs font-bold text-amber-900 uppercase block">
                    ΠΟΣΟΣΤΟ {changeType === 'discount' ? 'ΕΚΠΤΩΣΗΣ' : 'ΑΥΞΗΣΗΣ'}
                  </span>
                  <div className="font-mono font-black text-2xl sm:text-3xl text-amber-700">
                    {formatNum(percentage)} %
                  </div>
                  <span className="text-[11px] text-slate-600 block font-sans">
                    Επί της αρχικής τιμής ({initialPrice} €)
                  </span>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΣΥΓΚΡΙΣΗ ΤΩΝ 2 ΜΕΘΟΔΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
              <span>⚡ ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΣΥΓΚΡΙΣΗ ΜΕΘΟΔΩΝ</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Πώς Λύνεται με τους 2 Τρόπους
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Παράδειγμα: Ένα προϊόν κόστιζε αρχικά <strong>{sampleOriginal} €</strong> και πωλήθηκε τελικά προς <strong>{sampleFinal} €</strong> (Έκπτωση {sampleDiff} €):
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Μεθοδος 1: Πινακας Αναλογιας */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-900 text-xs font-black rounded-lg inline-block">
                  1ος ΤΡΟΠΟΣ: ΠΙΝΑΚΑΣ ΠΟΣΩΝ (ΜΕΘΟΔΟΣ ΤΩΝ ΤΡΙΩΝ)
                </span>
                <p className="text-xs sm:text-sm text-slate-600">
                  Στήνουμε τον πίνακα συσχετίζοντας την αρχική τιμή με τη διαφορά:
                </p>
                <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-xs sm:text-sm text-slate-800 space-y-1 text-center">
                  <div>Στα {sampleOriginal} € είχαμε έκπτωση {sampleDiff} €</div>
                  <div className="text-indigo-900 font-bold">Στα 100 € πόση έκπτωση έχουμε (χ);</div>
                  <div className="pt-1 border-t border-slate-100 text-base text-emerald-700 font-black">
                    χ ＝ ({sampleDiff} · 100) : {sampleOriginal} ＝ 3.000 : 120 ＝ {samplePct} %
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500 text-center font-medium">
                Ασφαλής και παραστατική μέθοδος για κάθε μαθητή.
              </p>
            </div>

            {/* Μεθοδος 2: Κλασματικη Αναγωγη */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-black rounded-lg inline-block">
                  2ος ΤΡΟΠΟΣ: ΚΛΑΣΜΑ &amp; ΔΙΑΙΡΕΣΗ
                </span>
                <p className="text-xs sm:text-sm text-slate-600">
                  Διαιρούμε τη διαφορά με την αρχική τιμή και πολλαπλασιάζουμε με το 100:
                </p>
                <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-xs sm:text-sm text-slate-800 space-y-1.5 text-center">
                  <div className="flex items-center justify-center">
                    <span>Κλάσμα ＝ </span>
                    <Fraction num={sampleDiff} den={sampleOriginal} />
                    <span> ＝ </span>
                    <Fraction num="1" den="4" />
                    <span> ＝ 0,25</span>
                  </div>
                  <div className="text-emerald-700 font-black text-base pt-1">
                    0,25 · 100 ＝ {samplePct} %
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500 text-center font-medium">
                Ταχύτατος τρόπος όταν η διαίρεση δίνει απλό δεκαδικό αριθμό.
              </p>
            </div>

          </div>
        </section>

        {/* 5. ΛΥΜΕΝΑ ΠΑΡΑΔΕΙΓΜΑΤΑ ΠΡΟΒΛΗΜΑΤΩΝ */}
        <section className="space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight">
              Λυμένα Προβλήματα Εύρεσης Ποσοστού
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Δύο χαρακτηριστικά παραδείγματα καθημερινής ζωής με αναλυτική παρουσίαση των βημάτων.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Παραδειγμα 1: Ευρεση Ποσοστου Εκπτωσης */}
            <article className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-rose-100 text-rose-900 text-xs font-black rounded-lg">
                  ΠΡΟΒΛΗΜΑ 1: ΠΟΣΟΣΤΟ ΕΚΠΤΩΣΗΣ
                </span>
                <span className="text-xs font-bold text-slate-400">Αγορά Ρούχων</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Υπολογισμός Έκπτωσης σε Μπουφάν
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ένα μπουφάν είχε αρχική τιμή <strong>150 €</strong>. Στις εκπτώσεις η τιμή του μειώθηκε και πωλήθηκε προς <strong>105 €</strong>. Ποιο ήταν το ποσοστό έκπτωσης (%) που έγινε στο μπουφάν;
              </p>

              <div className="space-y-2.5 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήμα 1: Πόσα ευρώ ήταν η έκπτωση;</span>
                  <div>Έκπτωση σε € ＝ 150 € － 105 € ＝ <strong className="text-rose-700">45 €</strong></div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήμα 2: Ποσοστό έκπτωσης επί της αρχικής τιμής</span>
                  <div>Με πίνακα (χιαστί): χ ＝ (45 · 100) : 150 ＝ 4.500 : 150 ＝ <strong className="text-emerald-700 text-base">30 %</strong></div>
                  <div>Με διαίρεση: (45 : 150) · 100 ＝ 0,30 · 100 ＝ <strong className="text-emerald-700 text-base">30 %</strong></div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 font-medium">
                ✓ <strong>Επαλήθευση:</strong> Το 30% των 150 € είναι (150 · 30) : 100 ＝ 45 €. Τελική τιμή: 150 － 45 ＝ 105 €.
              </div>
            </article>

            {/* Παραδειγμα 2: Ευρεση Ποσοστου Αυξησης */}
            <article className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-black rounded-lg">
                  ΠΡΟΒΛΗΜΑ 2: ΠΟΣΟΣΤΟ ΑΥΞΗΣΗΣ
                </span>
                <span className="text-xs font-bold text-slate-400">Συγκοινωνίες</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Αύξηση Τιμής Εισιτηρίου Λεωφορείου
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Το εισιτήριο του αστικού λεωφορείου κόστιζε <strong>1,20 €</strong> και μετά από αναπροσαρμογή η νέα τιμή του έγινε <strong>1,50 €</strong>. Ποιο ήταν το ποσοστό αύξησης (%) στην τιμή του εισιτηρίου;
              </p>

              <div className="space-y-2.5 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήμα 1: Πόσα ευρώ ήταν η αύξηση;</span>
                  <div>Αύξηση σε € ＝ 1,50 € － 1,20 € ＝ <strong className="text-indigo-700">0,30 €</strong></div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήμα 2: Ποσοστό αύξησης επί της αρχικής τιμής</span>
                  <div>Με πίνακα (χιαστί): χ ＝ (0,30 · 100) : 1,20 ＝ 30 : 1,20 ＝ <strong className="text-emerald-700 text-base">25 %</strong></div>
                  <div>Με διαίρεση: (0,30 : 1,20) · 100 ＝ 0,25 · 100 ＝ <strong className="text-emerald-700 text-base">25 %</strong></div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 font-medium">
                ✓ <strong>Επαλήθευση:</strong> Το 25% των 1,20 € είναι 0,30 €. Νέα τιμή: 1,20 ＋ 0,30 ＝ 1,50 €.
              </div>
            </article>

          </div>
        </section>

        {/* 6. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στην Εύρεση Ποσοστού Μεταβολής!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε 10 απαιτητικές ασκήσεις υπολογισμού ποσοστού έκπτωσης, αύξησης και κέρδους όταν γνωρίζεις την αρχική και την τελική τιμή.
            </p>
          </div>

          <Link
            href="/st-dimotikou/53-ksero-arxiki-teliki-timi-ask"
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
