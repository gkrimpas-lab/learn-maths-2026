// pages/st-dimotikou/43-posa.js
import { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Μορφοποιηση αριθμου (ακεραιος ή δεκαδικος με κομμα)
function formatNum(val, decimals = 2) {
  if (Number.isInteger(val)) return String(val);
  const rounded = Number(val.toFixed(decimals));
  return String(rounded).replace('.', ',');
}

export default function PosaTheoryPage() {
  // Εργαστηριο 1: Σταθερη Τιμη Μοναδας & Μεταβλητη Ποσοτητα/Κοστος
  const [unitPrice, setUnitPrice] = useState(2.5); // Σταθερο ποσο στο πλαισιο
  const [itemCount, setItemCount] = useState(4);    // Μεταβλητο ποσο 1

  // Υπολογισμος συνολικου κοστους (Μεταβλητο ποσο 2)
  const totalCost = useMemo(() => {
    return Number((unitPrice * itemCount).toFixed(2));
  }, [unitPrice, itemCount]);

  // Εργαστηριο 2: Κινηση με Σταθερη Ταχυτητα (Χρονος vs Αποσταση)
  const [speedKmH, setSpeedKmH] = useState(80); // Σταθερη ταχυτητα (km/h)
  const [timeHours, setTimeHours] = useState(3); // Μεταβλητος χρονος (h)

  // Υπολογισμος διανυομενης αποστασης
  const distanceKm = useMemo(() => {
    return speedKmH * timeHours;
  }, [speedKmH, timeHours]);

  return (
    <Layout
      title="Ποσά: Σταθερά και Μεταβλητά - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Πλήρης θεωρία με παραδείγματα για την έννοια των ποσών, τα σταθερά και μεταβλητά ποσά, τη συσχέτιση μεγεθών και διαδραστικό εργαστήριο για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/43-posa-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 43 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Ποσά: Σταθερά και Μεταβλητά
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              Μαθαίνουμε τι ονομάζεται ποσό στα Μαθηματικά, πώς ξεχωρίζουμε τα ποσά που παραμένουν αναλλοίωτα (σταθερά) από εκείνα που αλλάζουν τιμή (μεταβλητά) και πώς δύο ποσά εξαρτώνται το ένα από το άλλο.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία &amp; Δυναμική Εξερεύνηση Μεταβολής Ποσών</span>
            </div>
            <Link
              href="/st-dimotikou/43-posa-ask"
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
              Η θεμελιώδης διαφορά ανάμεσα σε αριθμούς, μεγέθη, σταθερές και μεταβλητές.
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
                  Τι ονομάζεται Ποσό;
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  <strong>Ποσό</strong> ονομάζεται οτιδήποτε μπορεί να <strong>μετρηθεί</strong> ή να <strong>υπολογιστεί</strong> και εκφράζεται με έναν αριθμό συνοδευόμενο από την αντίστοιχη μονάδα μέτρησης.
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm">
                  <p className="text-slate-700 font-semibold">Παραδείγματα Ποσών:</p>
                  <ul className="space-y-1.5 text-slate-600">
                    <li>• Το μήκος ενός υφάσματος (<span className="font-bold text-blue-900">5 m</span>)</li>
                    <li>• Το βάρος ενός κιβωτίου (<span className="font-bold text-blue-900">12 kg</span>)</li>
                    <li>• Ο χρόνος ενός αγώνα (<span className="font-bold text-blue-900">45 min</span>)</li>
                    <li>• Η τιμή ενός βιβλίου (<span className="font-bold text-blue-900">15 €</span>)</li>
                  </ul>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Ένας σκέτος αριθμός (π.χ. το 8) δεν είναι ποσό. Γίνεται ποσό μόνο όταν συνοδεύεται από μονάδα (π.χ. 8 kg ή 8 €)!
              </div>
            </article>

            {/* Βημα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Κατηγοριοποίηση</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Σταθερά Ποσά
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  <strong>Σταθερό ποσό</strong> ονομάζεται εκείνο που <strong>διατηρεί πάντα την ίδια τιμή</strong> και δεν αλλάζει καθ' όλη τη διάρκεια ενός φαινομένου ή προβλήματος:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-semibold text-slate-800">
                    📌 Ο αριθμός των ημερών μιας εβδομάδας (<span className="text-amber-800 font-mono font-bold">7 ημέρες</span>)
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-semibold text-slate-800">
                    📌 Η τιμή του ενός εισιτηρίου λεωφορείου σε ένα δρομολόγιο (<span className="text-amber-800 font-mono font-bold">1,20 €</span>)
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-semibold text-slate-800">
                    📌 Ο αριθμός των γραμμαρίων σε ένα κιλό (<span className="text-amber-800 font-mono font-bold">1.000 g</span>)
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Τα σταθερά ποσά αποτελούν τη βάση αναφοράς για να υπολογίσουμε τα μεταβαλλόμενα μεγέθη.
              </div>
            </article>

            {/* Βημα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Κατηγοριοποίηση</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Μεταβλητά Ποσά
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  <strong>Μεταβλητό ποσό</strong> ονομάζεται εκείνο που <strong>παίρνει διαφορετικές τιμές</strong> σε διαφορετικές στιγμές ή περιπτώσεις:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-semibold text-slate-800">
                    🔄 Η θερμοκρασία του περιβάλλοντος κατά τη διάρκεια της ημέρας
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-semibold text-slate-800">
                    🔄 Το ύψος ενός παιδιού καθώς μεγαλώνει
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-semibold text-slate-800">
                    🔄 Το πλήθος των τετραδίων που επιλέγουμε να αγοράσουμε
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Στα προβλήματα, τα μεταβλητά ποσά συνήθως συμβολίζονται με γράμματα (<span className="font-bold font-mono">χ, ψ, α, β</span>).
              </div>
            </article>

            {/* Βημα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Εξάρτηση</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Συσχετισμένα Ποσά
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Όταν δύο μεταβλητά ποσά συνδέονται έτσι ώστε η αλλαγή του ενός να προκαλεί αλλαγή στο άλλο, λέγονται <strong>συσχετισμένα ποσά</strong>:
                </p>

                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                    <strong>Ποσότητα &amp; Αξία:</strong> Όσα περισσότερα κιλά φρούτων αγοράζουμε, τόσο περισσότερα χρήματα πληρώνουμε.
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-950">
                    <strong>Χρόνος &amp; Απόσταση:</strong> Όσες περισσότερες ώρες περπατάμε, τόσο μεγαλύτερη απόσταση διανύουμε.
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Η μελέτη των συσχετισμένων ποσών οδηγεί άμεσα στις έννοιες των <strong>ανάλογων</strong> και <strong>αντιστρόφως ανάλογων ποσών</strong>!
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΑΓΟΡΑ ΤΕΤΡΑΔΙΩΝ (ΣΤΑΘΕΡΑ VS ΜΕΤΑΒΛΗΤΑ) */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1</span>
              </div>
              <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Πραγματικό Σενάριο: Σταθερή Τιμή &amp; Μεταβλητό Κόστος
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Σε ένα βιβλιοπωλείο, η τιμή του ενός τετραδίου είναι σταθερή. Αλλάξτε το πλήθος των τετραδίων για να παρατηρήσετε πώς μεταβάλλεται το συνολικό κόστος.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Χειριστηρια (Steppers) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Σταθερο Ποσο: Τιμη Μοναδας */}
              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-xs font-black uppercase text-amber-900 tracking-wider">
                    ΣΤΑΘΕΡΟ ΠΟΣΟ: ΤΙΜΗ ΤΕΤΡΑΔΙΟΥ (€)
                  </span>
                  <span className="font-mono font-black text-lg text-amber-700 bg-white px-2.5 py-0.5 rounded-lg border border-amber-200">
                    {formatNum(unitPrice)} €
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setUnitPrice((prev) => Math.max(1, Number((prev - 0.5).toFixed(1)))); }}
                    disabled={unitPrice <= 1}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={1}
                    max={6}
                    step={0.5}
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setUnitPrice((prev) => Math.min(6, Number((prev + 0.5).toFixed(1)))); }}
                    disabled={unitPrice >= 6}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Μεταβλητο Ποσο 1: Πληθος Τετραδιων */}
              <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-xs font-black uppercase text-blue-900 tracking-wider">
                    ΜΕΤΑΒΛΗΤΟ ΠΟΣΟ: ΠΛΗΘΟΣ ΤΕΤΡΑΔΙΩΝ
                  </span>
                  <span className="font-mono font-black text-lg text-blue-700 bg-white px-2.5 py-0.5 rounded-lg border border-blue-200">
                    {itemCount}
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setItemCount((prev) => Math.max(1, prev - 1)); }}
                    disabled={itemCount <= 1}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={1}
                    max={12}
                    value={itemCount}
                    onChange={(e) => setItemCount(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setItemCount((prev) => Math.min(12, prev + 1)); }}
                    disabled={itemCount >= 12}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

            </div>

            {/* Πινακας Αναλυσης Συσχετισης */}
            <div className="lg:col-span-7 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                ΑΝΑΛΥΣΗ ΤΩΝ ΠΟΣΩΝ ΣΤΟ ΠΡΟΒΛΗΜΑ
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                {/* 1. Σταθερο */}
                <div className="p-4 bg-white rounded-2xl border border-amber-200 space-y-1">
                  <span className="text-xs font-bold text-amber-800 uppercase block">1. ΣΤΑΘΕΡΟ ΠΟΣΟ</span>
                  <span className="text-xs text-slate-500">Τιμή ενός τετραδίου</span>
                  <div className="font-mono font-black text-xl text-amber-900 pt-1">
                    {formatNum(unitPrice)} €
                  </div>
                </div>

                {/* 2. Μεταβλητο 1 */}
                <div className="p-4 bg-white rounded-2xl border border-blue-200 space-y-1">
                  <span className="text-xs font-bold text-blue-800 uppercase block">2. ΜΕΤΑΒΛΗΤΟ ΠΟΣΟ</span>
                  <span className="text-xs text-slate-500">Πλήθος αγοράς</span>
                  <div className="font-mono font-black text-xl text-blue-900 pt-1">
                    {itemCount} {itemCount === 1 ? 'τετράδιο' : 'τετράδια'}
                  </div>
                </div>

                {/* 3. Μεταβλητο 2 (Εξαρτημενο) */}
                <div className="p-4 bg-white rounded-2xl border border-emerald-200 space-y-1">
                  <span className="text-xs font-bold text-emerald-800 uppercase block">3. ΕΞΑΡΤΗΜΕΝΟ ΠΟΣΟ</span>
                  <span className="text-xs text-slate-500">Συνολικό κόστος</span>
                  <div className="font-mono font-black text-xl text-emerald-700 pt-1">
                    {formatNum(totalCost)} €
                  </div>
                </div>
              </div>

              {/* Μαθηματικη σχεση */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center space-y-1 text-xs sm:text-sm">
                <span className="text-slate-500 font-semibold block">
                  Μαθηματική Σχέση Εξάρτησης:
                </span>
                <div className="font-mono font-bold text-slate-900 text-base">
                  Συνολικό Κόστος ＝ {formatNum(unitPrice)} · {itemCount} ＝ {formatNum(totalCost)} €
                </div>
                <p className="text-slate-500 text-xs pt-1">
                  Όταν το πλήθος των τετραδίων μεταβάλλεται, το συνολικό κόστος μεταβάλλεται ανάλογα, επειδή η τιμή μονάδας είναι σταθερή!
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΚΙΝΗΣΗ ΜΕ ΣΤΑΘΕΡΗ ΤΑΧΥΤΗΤΑ (ΧΡΟΝΟΣ & ΑΠΟΣΤΑΣΗ) */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
                <span>🚗 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2</span>
              </div>
              <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Κίνηση με Σταθερή Ταχύτητα: Χρόνος και Απόσταση
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Ένα αυτοκίνητο κινείται με σταθερή ταχύτητα. Παρατηρήστε πώς η διανυόμενη απόσταση εξαρτάται άμεσα από τον χρόνο κίνησης.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Χειριστηρια Κινησης */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Σταθερη Ταχυτητα */}
              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-xs font-black uppercase text-amber-900 tracking-wider">
                    ΣΤΑΘΕΡΟ ΠΟΣΟ: ΤΑΧΥΤΗΤΑ (km/h)
                  </span>
                  <span className="font-mono font-black text-lg text-amber-700 bg-white px-2.5 py-0.5 rounded-lg border border-amber-200">
                    {speedKmH} km/h
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSpeedKmH((prev) => Math.max(40, prev - 10)); }}
                    disabled={speedKmH <= 40}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={40}
                    max={120}
                    step={10}
                    value={speedKmH}
                    onChange={(e) => setSpeedKmH(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSpeedKmH((prev) => Math.min(120, prev + 10)); }}
                    disabled={speedKmH >= 120}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Μεταβλητος Χρονος */}
              <div className="bg-sky-50/70 p-4 rounded-2xl border border-sky-200 space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-xs font-black uppercase text-sky-900 tracking-wider">
                    ΜΕΤΑΒΛΗΤΟ ΠΟΣΟ: ΧΡΟΝΟΣ (ΩΡΕΣ)
                  </span>
                  <span className="font-mono font-black text-lg text-sky-700 bg-white px-2.5 py-0.5 rounded-lg border border-sky-200">
                    {timeHours} {timeHours === 1 ? 'ώρα' : 'ώρες'}
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setTimeHours((prev) => Math.max(1, prev - 1)); }}
                    disabled={timeHours <= 1}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={1}
                    max={8}
                    value={timeHours}
                    onChange={(e) => setTimeHours(Number(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setTimeHours((prev) => Math.min(8, prev + 1)); }}
                    disabled={timeHours >= 8}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

            </div>

            {/* Οπτικοποιηση & Πινακας Τιμων */}
            <div className="lg:col-span-7 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                ΠΙΝΑΚΑΣ ΤΙΜΩΝ ΓΙΑ ΤΗ ΔΙΑΔΡΟΜΗ
              </div>

              {/* Πινακας Συσχετισμενων Ποσων */}
              <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold border-b pb-2 text-slate-600">
                  <span className="bg-sky-50 py-1 rounded-lg text-sky-900">Χρόνος (h)</span>
                  <span className="bg-emerald-50 py-1 rounded-lg text-emerald-900">Διανυόμενη Απόσταση (km)</span>
                </div>
                <div className="divide-y divide-slate-100 text-center font-mono text-sm">
                  {[1, 2, timeHours].filter((v, i, a) => a.indexOf(v) === i).sort((x, y) => x - y).map((h) => (
                    <div key={`row-${h}`} className={`grid grid-cols-2 py-2 ${h === timeHours ? 'bg-amber-50 font-black text-amber-900 rounded-lg' : 'text-slate-700'}`}>
                      <span>{h} h</span>
                      <span>{speedKmH * h} km</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Συμπερασμα */}
              <div className="p-4 bg-white rounded-2xl border border-emerald-100 text-center space-y-1 text-xs sm:text-sm">
                <span className="text-emerald-900 font-bold block">
                  Τελικό Αποτέλεσμα Ταξιδιού:
                </span>
                <div className="font-mono font-black text-xl text-emerald-600">
                  {distanceKm} km
                </div>
                <p className="text-slate-500 text-xs">
                  Υπολογισμός: {speedKmH} km/h · {timeHours} h ＝ {distanceKm} km.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* 5. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στα Ποσά!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε 10 απαιτητικές ασκήσεις διάκρισης σταθερών και μεταβλητών ποσών, ανάλυσης σχέσεων εξάρτησης και ρεαλιστικών προβλημάτων.
            </p>
          </div>

          <Link
            href="/st-dimotikou/43-posa-ask"
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
