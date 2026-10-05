// pages/st-dimotikou/62-xrimata.js
import { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Βοηθητικό component εμφάνισης κλάσματος με οριζόντια γραμμή (καθαρό JSX, χωρίς LaTeX)
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

// Μορφοποίηση αριθμού (ακέραιος ή δεκαδικός με κόμμα)
function formatNum(val, decimals = 2) {
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  if (Number.isInteger(val)) return String(val);
  const rounded = Number(val.toFixed(decimals));
  return String(rounded).replace('.', ',');
}

// Αφαίρεση τόνων για κεφαλαία (εξαιρείται το ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  const cleaned = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
  return cleaned.replace(/\bΣΤ\b/g, "ΣΤ'");
}

export default function XrimataTheoryPage() {
  // Εργαστήριο 1: Μετατροπέας Ευρώ & Λεπτών
  const [euroAmount, setEuroAmount] = useState(4.75);

  const moneyConversions = useMemo(() => {
    const totalCents = Math.round(euroAmount * 100);
    const wholeEuros = Math.floor(euroAmount);
    const remCents = totalCents % 100;
    return {
      totalCents,
      wholeEuros,
      remCents
    };
  }, [euroAmount]);

  // Εργαστήριο 2: Υπολογιστής Τόκου (Κεφάλαιο, Επιτόκιο, Χρόνος σε έτη)
  const [capital, setCapital] = useState(1000);
  const [rate, setRate] = useState(3);
  const [years, setYears] = useState(2);

  const interestData = useMemo(() => {
    // Τ = (Κ · Ε · χ) : 100
    const interest = Number(((capital * rate * years) / 100).toFixed(2));
    const totalAmount = Number((capital + interest).toFixed(2));
    return {
      interest,
      totalAmount
    };
  }, [capital, rate, years]);

  return (
    <Layout
      title="Το Ευρώ, Μετατροπές, Τόκος & Επιτόκιο - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Θεωρία για τη νομισματική μονάδα (ευρώ, λεπτά), κανόνες μετατροπής, υπολογισμό ρέστων, καθώς και την έννοια του τόκου, του κεφαλαίου και του επιτοκίου."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/62-xrimata-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 Ασκήσεις</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 sm:space-y-10 2xl:space-y-14 pb-28 sm:pb-32 overflow-x-hidden">

        {/* 1. HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>ΚΕΦΑΛΑΙΟ 62 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Χρήματα: Το Ευρώ, Μετατροπές, Τόκος &amp; Επιτόκιο
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Εξερευνούμε τη νομισματική μονάδα της χώρας μας: το <strong>ευρώ (€)</strong> και την υποδιαίρεσή του (<strong>λεπτό</strong>). Μαθαίνουμε να μετατρέπουμε ποσά, να υπολογίζουμε ρέστα σε καθημερινές συναλλαγές και ανακαλύπτουμε τις βασικές οικονομικές έννοιες της αποταμίευσης: το <strong>κεφάλαιο</strong>, το <strong>επιτόκιο (%)</strong> και τον <strong>τόκο</strong>.
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Μετατροπέας Ευρώ/Λεπτών &amp; Διαδραστικός Υπολογιστής Τόκου</span>
            </div>
            <Link
              href="/st-dimotikou/62-xrimata-ask"
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
              Νομίσματα &amp; Οικονομικές Έννοιες σε 4 Βήματα
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Από τα καθημερινά κέρματα και χαρτονομίσματα μέχρι την αποταμίευση στην τράπεζα.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 gap-5 sm:gap-6 2xl:gap-8">

            {/* ΒΗΜΑ 1 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 1
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Νομισματική Μονάδα</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Το Ευρώ (€) &amp; το Λεπτό (cent)
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Επίσημο νόμισμα της Ελλάδας και της Ευρωζώνης είναι το <strong>ευρώ (€)</strong>. Η υποδιαίρεσή του είναι το <strong>λεπτό (ή cent)</strong>:
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 font-mono">
                  <div className="text-blue-900 font-bold">• 1 ευρώ (€) ＝ 100 λεπτά</div>
                  <div>• 1 λεπτό ＝ 1/100 του ευρώ ＝ 0,01 €</div>
                  <div className="text-slate-600 font-sans text-[11px] pt-1 leading-normal">
                    <strong>Κέρματα:</strong> 1λ, 2λ, 5λ, 10λ, 20λ, 50λ, 1€, 2€.<br />
                    <strong>Χαρτονομίσματα:</strong> 5€, 10€, 20€, 50€, 100€, 200€, 500€.
                  </div>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Το ευρώ ακολουθεί το <strong>δεκαδικό σύστημα</strong>, άρα οι μετατροπές γίνονται πάντα με πολλαπλασιασμό ή διαίρεση με το 100!
              </div>
            </article>

            {/* ΒΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Κανόνες Μετατροπής</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Μετατροπές Ευρώ σε Λεπτά &amp; Αντίστροφα
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Εφαρμόζουμε απλούς κανόνες για τη μετακίνηση της υποδιαστολής:
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 font-mono">
                  <div>
                    • <strong>Από Ευρώ σε Λεπτά:</strong> Πολλαπλασιάζουμε επί 100.<br />
                    <span className="text-amber-800 font-bold">3,50 € · 100 ＝ 350 λεπτά</span>
                  </div>
                  <div>
                    • <strong>Από Λεπτά σε Ευρώ:</strong> Διαιρούμε με το 100.<br />
                    <span className="text-blue-800 font-bold">475 λεπτά : 100 ＝ 4,75 €</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Στα δεκαδικά ευρώ, τα δύο πρώτα ψηφία μετά την υποδιαστολή δείχνουν πάντοτε τα <strong>λεπτά</strong> (π.χ. 2,05 € ＝ 2 € και 5 λεπτά).
              </div>
            </article>

            {/* ΒΗΜΑ 3 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Αποταμίευση</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Κεφάλαιο, Τόκος &amp; Επιτόκιο
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Όταν καταθέτουμε χρήματα σε έναν τραπεζικό λογαριασμό, η τράπεζα μας προσφέρει μια επιπλέον αμοιβή:
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1.5 text-slate-700">
                  <div>• <strong>Κεφάλαιο (Κ):</strong> Το αρχικό χρηματικό ποσό που καταθέτουμε.</div>
                  <div>• <strong>Τόκος (Τ):</strong> Το επιπλέον κέρδος που αποδίδει το κεφάλαιο για ορισμένο χρονικό διάστημα.</div>
                  <div>• <strong>Επιτόκιο (Ε%):</strong> Ο τόκος που κερδίζουν 100€ σε διάστημα 1 έτους (εκφράζεται σε ποσοστό στα 100).</div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Αν το επιτόκιο είναι <strong>3%</strong>, σημαίνει ότι για κάθε 100€ που καταθέτουμε, κερδίζουμε 3€ τόκο κάθε χρόνο.
              </div>
            </article>

            {/* ΒΗΜΑ 4 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Μαθηματικός Τύπος</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Ο Τύπος του Απλού Τόκου
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Για να υπολογίσουμε τον τόκο για ορισμένα έτη (χ), χρησιμοποιούμε τον βασικό μαθηματικό τύπο:
                </p>

                <div className="bg-emerald-50/70 p-3.5 sm:p-4 rounded-2xl border border-emerald-200 text-xs sm:text-sm space-y-2 text-emerald-950 font-mono text-center">
                  <div className="font-bold text-sm sm:text-base">
                    Τόκος ＝ (Κεφάλαιο · Επιτόκιο · Χρόνος) : 100
                  </div>
                  <div className="text-xs text-emerald-800">
                    <strong>Τ ＝ (Κ · Ε · χ) : 100</strong>
                  </div>
                  <p className="font-sans text-[11px] text-slate-600 leading-normal text-left pt-1">
                    <strong>Τελικό Ποσό ＝ Κεφάλαιο ＋ Τόκος</strong> (όσα χρήματα θα έχουμε συνολικά στο τέλος).
                  </p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Ο τόκος αυξάνεται ανάλογα με το κεφάλαιο, το επιτόκιο και τα χρόνια της κατάθεσης.
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΜΕΤΑΤΡΟΠΕΑΣ ΕΥΡΩ & ΛΕΠΤΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1</span>
            </div>
            <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Δυναμικός Μετατροπέας Ευρώ (€) &amp; Λεπτών (cents)
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Ρύθμισε το χρηματικό ποσό σε ευρώ και δες πώς αναλύεται άμεσα σε ολόκληρα ευρώ, λεπτά και κέρματα.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">

            {/* Χειριστήριο Ρύθμισης Ποσού (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-blue-900 tracking-wider">
                    ΧΡΗΜΑΤΙΚΟ ΠΟΣΟ:
                  </span>
                  <span className="font-mono font-black text-base sm:text-xl text-blue-700 bg-white px-3 py-1 rounded-xl border border-blue-200 shadow-sm">
                    {formatNum(euroAmount, 2)} €
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Μείωση ποσού"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEuroAmount((prev) => Math.max(0.1, Number((prev - 0.25).toFixed(2)))); }}
                    disabled={euroAmount <= 0.25}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={0.25}
                    max={20}
                    step={0.25}
                    value={euroAmount}
                    onChange={(e) => setEuroAmount(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer touch-manipulation"
                  />
                  <button
                    type="button"
                    aria-label="Αύξηση ποσού"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEuroAmount((prev) => Math.min(20, Number((prev + 0.25).toFixed(2)))); }}
                    disabled={euroAmount >= 20}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Γρήγορες Επιλογές */}
              <div className="grid grid-cols-4 gap-2">
                {[1, 2.5, 5, 12.5].map((quickVal) => (
                  <button
                    key={`btn-euro-${quickVal}`}
                    type="button"
                    onClick={() => setEuroAmount(quickVal)}
                    className="bg-white border border-slate-200 hover:bg-slate-100 py-2 rounded-xl font-bold text-xs sm:text-sm text-slate-700 shadow-sm transition active:scale-95 text-center touch-manipulation"
                  >
                    {formatNum(quickVal, 2)} €
                  </button>
                ))}
              </div>
            </div>

            {/* Πίνακας Ανάλυσης (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-3">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block text-center">
                ΑΝΑΛΥΣΗ ΤΟΥ ΠΟΣΟΥ ΣΕ ΕΥΡΩ ΚΑΙ ΛΕΠΤΑ
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-mono">
                <div className="p-3.5 bg-white rounded-2xl border border-blue-200 flex items-center justify-between">
                  <span className="text-slate-600 font-sans">Ολόκληρα Ευρώ:</span>
                  <span className="font-black text-blue-700">{moneyConversions.wholeEuros} €</span>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-amber-200 flex items-center justify-between">
                  <span className="text-slate-600 font-sans">Υπόλοιπο σε Λεπτά:</span>
                  <span className="font-black text-amber-700">{moneyConversions.remCents} λεπτά</span>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-emerald-200 flex items-center justify-between">
                  <span className="text-slate-600 font-sans">Συνολικά Λεπτά (cents):</span>
                  <span className="font-black text-emerald-700">{moneyConversions.totalCents} λεπτά</span>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-purple-200 flex items-center justify-between">
                  <span className="text-slate-600 font-sans">Κλασματική Μορφή:</span>
                  <span className="font-black text-purple-700">
                    <Fraction num={moneyConversions.totalCents} den={100} /> €
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-white rounded-2xl border border-slate-200 font-sans text-xs sm:text-sm text-slate-600 space-y-1 text-center">
                💡 <strong>Μαθηματική Σχέση:</strong> {formatNum(euroAmount, 2)} € ＝ {formatNum(euroAmount, 2)} · 100 ＝ <strong>{moneyConversions.totalCents} λεπτά</strong> (ή {moneyConversions.wholeEuros} € και {moneyConversions.remCents} λεπτά).
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΥΠΟΛΟΓΙΣΤΗΣ ΤΟΚΟΥ & ΕΠΙΤΟΚΙΟΥ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
              <span>🏦 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΤΡΑΠΕΖΙΚΟΣ ΥΠΟΛΟΓΙΣΜΟΣ</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Υπολογιστής Τόκου &amp; Τελικού Κεφαλαίου
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Ρύθμισε το <strong>Κεφάλαιο (Κ)</strong>, το <strong>Ετήσιο Επιτόκιο (Ε%)</strong> και τον <strong>Χρόνο (χ σε έτη)</strong> για να δεις πώς υπολογίζεται ο τόκος:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

            {/* Χειριστήρια Παραμέτρων Τόκου (6 στήλες) */}
            <div className="lg:col-span-6 space-y-3.5">
              
              {/* Κεφάλαιο */}
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold">
                  <span className="text-slate-700">Αρχικό Κεφάλαιο (Κ):</span>
                  <span className="font-mono text-base font-black text-blue-700">{formatNum(capital)} €</span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={5000}
                  step={100}
                  value={capital}
                  onChange={(e) => setCapital(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer touch-manipulation"
                />
              </div>

              {/* Επιτόκιο */}
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold">
                  <span className="text-slate-700">Ετήσιο Επιτόκιο (Ε%):</span>
                  <span className="font-mono text-base font-black text-emerald-700">{rate}%</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={8}
                  step={0.5}
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer touch-manipulation"
                />
              </div>

              {/* Χρόνος */}
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold">
                  <span className="text-slate-700">Χρόνος Κατάθεσης (χ):</span>
                  <span className="font-mono text-base font-black text-indigo-700">{years} {years === 1 ? 'έτος' : 'έτη'}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
              </div>

            </div>

            {/* Αποτέλεσμα & Ανάλυση Τύπου (6 στήλες) */}
            <div className="lg:col-span-6 bg-emerald-50/50 p-5 sm:p-7 rounded-3xl border border-emerald-200 space-y-4">
              <span className="text-xs font-black uppercase text-emerald-900 tracking-wider block text-center">
                ΥΠΟΛΟΓΙΣΜΟΣ ΜΕ ΤΟΝ ΤΥΠΟ: Τ ＝ (Κ · Ε · χ) : 100
              </span>

              <div className="bg-white p-4 rounded-2xl border border-emerald-200 text-center font-mono space-y-2">
                <div className="text-xs text-slate-500">
                  Τ ＝ ({capital} · {rate} · {years}) : 100 ＝ {capital * rate * years} : 100
                </div>
                <div className="text-xl sm:text-3xl font-black text-emerald-700">
                  Τόκος ＝ {formatNum(interestData.interest)} €
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex justify-between items-center font-mono">
                <div>
                  <span className="text-[11px] text-slate-500 block font-sans">Τελικό Ποσό Κατάθεσης (Κ ＋ Τ):</span>
                  <span className="text-base sm:text-xl font-black text-slate-900">
                    {formatNum(capital)} ＋ {formatNum(interestData.interest)} ＝ <strong className="text-blue-700">{formatNum(interestData.totalAmount)} €</strong>
                  </span>
                </div>
              </div>

              <p className="text-xs text-emerald-950 font-sans text-center leading-relaxed">
                💡 Σε {years} {years === 1 ? 'έτος' : 'έτη'} με επιτόκιο {rate}%, τα {formatNum(capital)}€ σας θα αποδώσουν τόκο <strong>{formatNum(interestData.interest)}€</strong> και θα έχετε συνολικά <strong>{formatNum(interestData.totalAmount)}€</strong>.
              </p>
            </div>

          </div>
        </section>

        {/* 5. ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ ΚΑΘΗΜΕΡΙΝΗΣ ΖΩΗΣ */}
        <section className="space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight">
              Λυμένα Προβλήματα Καθημερινής Ζωής
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Αναλυτικά βήματα επίλυσης σε προβλήματα αγορών, ρέστων και τραπεζικού τόκου.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ΠΡΟΒΛΗΜΑ 1 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-900 text-xs font-black rounded-lg uppercase">
                  ΠΡΟΒΛΗΜΑ 1: ΑΓΟΡΕΣ &amp; ΡΕΣΤΑ
                </span>
                <span className="text-xs font-bold text-slate-400">Σούπερ Μάρκετ</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Υπολογισμός Κόστους και Ρέστων σε Ευρώ &amp; Λεπτά
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Η Ελένη αγόρασε <strong>3</strong> τετράδια προς <strong>1,80 €</strong> το καθένα και <strong>2</strong> μαρκαδόρους προς <strong>85 λεπτά (0,85 €)</strong> τον καθένα. Πλήρωσε με χαρτονόμισμα των <strong>10 €</strong>. Πόσα ρέστα θα πάρει;
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΑΝΑΛΥΣΗ ΑΓΟΡΩΝ
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Τετράδια</span> 3 · 1,80 € ＝ 5,40 €
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Μαρκαδόροι</span> 2 · 0,85 € ＝ 1,70 €
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Πληρωμή</span> 10,00 €
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήματα Επίλυσης:</span>
                  <div>• <strong>Κόστος τετραδίων:</strong> 3 · 1,80 € ＝ <strong>5,40 €</strong>.</div>
                  <div>• <strong>Κόστος μαρκαδόρων:</strong> 2 · 0,85 € ＝ <strong>1,70 €</strong>.</div>
                  <div>• <strong>Συνολική δαπάνη:</strong> 5,40 € ＋ 1,70 € ＝ <strong>7,10 €</strong>.</div>
                  <div>• <strong>Ρέστα:</strong> 10,00 € － 7,10 € ＝ <strong className="text-blue-700">2,90 €</strong> (2 € και 90 λεπτά).</div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 font-medium">
                💡 Μετατρέπουμε όλα τα ποσά στην ίδια μονάδα (σε δεκαδικά ευρώ) πριν κάνουμε τις προσθαφαιρέσεις.
              </div>
            </article>

            {/* ΠΡΟΒΛΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-lg uppercase">
                  ΠΡΟΒΛΗΜΑ 2: ΤΡΑΠΕΖΙΚΟΣ ΤΟΚΟΣ
                </span>
                <span className="text-xs font-bold text-slate-400">Αποταμίευση</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Υπολογισμός Ετήσιου Τόκου &amp; Τελικού Ποσού
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ο κύριος Ανδρέας κατέθεσε στην τράπεζα κεφάλαιο <strong>2.400 €</strong> με ετήσιο επιτόκιο <strong>2,5%</strong> για <strong>3 έτη</strong>. Πόσο τόκο θα εισπράξει στο τέλος της τριετίας και ποιο θα είναι το συνολικό ποσό που θα έχει στον λογαριασμό του;
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΔΕΔΟΜΕΝΑ ΚΑΤΑΘΕΣΗΣ
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Κεφάλαιο (Κ)</span> 2.400 €
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Επιτόκιο (Ε)</span> 2,5%
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Χρόνος (χ)</span> 3 έτη
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήματα Επίλυσης:</span>
                  <div>• <strong>Εφαρμογή τύπου:</strong> Τ ＝ (Κ · Ε · χ) : 100.</div>
                  <div>• <strong>Υπολογισμός:</strong> (2.400 · 2,5 · 3) : 100 ＝ 18.000 : 100 ＝ <strong className="text-amber-700">180 € τόκος</strong>.</div>
                  <div>• <strong>Τελικό ποσό:</strong> Κεφάλαιο ＋ Τόκος ＝ 2.400 € ＋ 180 € ＝ <strong className="text-emerald-700">2.580 €</strong>.</div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 font-medium">
                ⚡ Κάθε χρόνο ο τόκος ήταν 60€ (2.400 · 2,5 : 100 ＝ 60€). Στα 3 χρόνια: 3 · 60€ ＝ 180€.
              </div>
            </article>

          </div>
        </section>

        {/* 6. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στα Χρήματα &amp; τον Τόκο!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε 10 διαδραστικές ασκήσεις με μετατροπές ευρώ και λεπτών, υπολογισμούς ρέστων, κεφαλαίου, επιτοκίου και τόκου για τη ΣΤ' Δημοτικού.
            </p>
          </div>

          <Link
            href="/st-dimotikou/62-xrimata-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-sm sm:text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 {toCleanUppercase('Έναρξη Ασκήσεων')}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
