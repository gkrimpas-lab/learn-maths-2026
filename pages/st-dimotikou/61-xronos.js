// pages/st-dimotikou/61-xronos.js
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

// Πόλεις και ζώνες ώρας σε σχέση με το Greenwich (UTC)
const TIME_ZONES = [
  { city: 'Λονδίνο (Greenwich)', offset: 0, flag: '🇬🇧', desc: 'Βάση UTC / GMT 0' },
  { city: 'Αθήνα', offset: 2, flag: '🇬🇷', desc: 'UTC+2 (Χειμερινή ώρα Ελλάδας)' },
  { city: 'Νέα Υόρκη', offset: -5, flag: '🇺🇸', desc: 'UTC-5 (5 ώρες πίσω)' },
  { city: 'Τόκιο', offset: 9, flag: '🇯🇵', desc: 'UTC+9 (9 ώρες μπροστά)' },
  { city: 'Σίδνεϊ', offset: 11, flag: '🇦🇺', desc: 'UTC+11 (11 ώρες μπροστά)' }
];

export default function XronosTheoryPage() {
  // Εργαστήριο 1: Μετατροπέας Χρόνου (Ώρες -> Λεπτά -> Δευτερόλεπτα)
  const [hoursInput, setHoursInput] = useState(2);
  const [minutesInput, setMinutesInput] = useState(30);

  const timeConversions = useMemo(() => {
    const totalMinutes = hoursInput * 60 + minutesInput;
    const totalSeconds = totalMinutes * 60;
    const decimalHours = hoursInput + minutesInput / 60;
    return {
      totalMinutes,
      totalSeconds,
      decimalHours
    };
  }, [hoursInput, minutesInput]);

  // Εργαστήριο 2: Παγκόσμιος Χρόνος Greenwich (Βάση ώρα 12:00 στο Λονδίνο)
  const [baseGmtHour, setBaseGmtHour] = useState(12);

  return (
    <Layout
      title="Μονάδες Μέτρησης Χρόνου & Μετατροπές - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μαθαίνουμε για τη βασική μονάδα χρόνου (δευτερόλεπτο), λεπτό, ώρα, ημέρα, έτος, αιώνα, χιλιετία, μετατροπές μονάδων και την Ώρα Γκρίνουιτς (UTC)."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/61-xronos-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 61 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Μονάδες Μέτρησης Χρόνου
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Ανακαλύπτουμε πώς μετράμε τον χρόνο: από το βασικό <strong>δευτερόλεπτο (s)</strong>, τα λεπτά και τις ώρες, μέχρι τις ημέρες, τους <strong>αιώνες</strong> και τις <strong>χιλιετίες</strong>. Μαθαίνουμε πώς γίνονται οι μετατροπές με το 60, πώς υπολογίζουμε χρονικές διάρκειες και πώς λειτουργεί η παγκόσμια <strong>Ώρα Γκρίνουιτς (GMT / UTC)</strong>.
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία, Εξηκονταδικό Σύστημα, Αιώνες &amp; Παγκόσμια Ώρα</span>
            </div>
            <Link
              href="/st-dimotikou/61-xronos-ask"
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
              Οι Μονάδες Χρόνου σε 4 Βήματα
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Από τα δευτερόλεπτα και τις ώρες μέχρι τις χιλιετίες και τις παγκόσμιες ζώνες ώρας.
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
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Εξηκονταδικό Σύστημα</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Δευτερόλεπτο, Λεπτό &amp; Ώρα
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Βασική μονάδα μέτρησης του χρόνου στο Διεθνές Σύστημα είναι το <strong>δευτερόλεπτο (s)</strong>. Σε αντίθεση με το δεκαδικό σύστημα, ο χρόνος αλλάζει μονάδες ανά <strong>60</strong>:
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1.5 font-mono">
                  <div className="text-slate-900 font-bold">• 1 λεπτό (min) ＝ 60 δευτερόλεπτα (s)</div>
                  <div className="text-slate-900 font-bold">• 1 ώρα (h) ＝ 60 λεπτά (min)</div>
                  <div className="text-blue-700 font-black">• 1 ώρα (h) ＝ 60 · 60 ＝ 3.600 s</div>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 <strong>Προσοχή:</strong> 1,5 ώρα <strong>ΔΕΝ</strong> είναι 1 ώρα και 50 λεπτά! Είναι 1 ώρα και μισή, δηλαδή 1 h και 30 min.
              </div>
            </article>

            {/* ΒΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Ημερολογιακός Χρόνος</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Ημέρα, Μήνας &amp; Έτος
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Οι μεγαλύτερες μονάδες μέτρησης βασίζονται στις κινήσεις της Γης γύρω από τον εαυτό της και γύρω από τον Ήλιο:
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1.5 font-mono">
                  <div>• 1 ημέρα (24ωρο) ＝ <strong>24 ώρες (h)</strong></div>
                  <div>• 1 εβδομάδα ＝ <strong>7 ημέρες</strong></div>
                  <div>• 1 κοινό έτος ＝ <strong>365 ημέρες</strong> (12 μήνες)</div>
                  <div>• 1 δίσεκτο έτος ＝ <strong>366 ημέρες</strong> (κάθε 4 έτη)</div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Στο δίσεκτο έτος ο Φεβρουάριος έχει 29 ημέρες αντί για 28, για να καλύψει τις επιπλέον ~6 ώρες της περιφοράς της Γης.
              </div>
            </article>

            {/* ΒΗΜΑ 3 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Μεγάλες Περίοδοι</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Δεκαετία, Αιώνας &amp; Χιλιετία
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Για ιστορικά γεγονότα και μακροχρόνιες περιόδους ομαδοποιούμε τα έτη:
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 font-mono">
                  <div>• <strong>1 δεκαετία</strong> ＝ 10 έτη</div>
                  <div>• <strong>1 αιώνας</strong> ＝ 100 έτη</div>
                  <div>• <strong>1 χιλιετία</strong> ＝ 1.000 έτη (10 αιώνες)</div>
                  <div className="text-[11px] text-indigo-900 font-sans pt-1 leading-normal">
                    <strong>Κανόνας Αιώνα:</strong> Για το έτος <strong>1821</strong>, παίρνουμε το 18 και προσθέτουμε 1 ➔ <strong>19ος αιώνας</strong>! (Εξαίρεση: τα έτη που λήγουν σε 00, π.χ. το 1900 ήταν ο 19ος αιώνας).
                  </div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Σήμερα διανύουμε τον <strong>21ο αιώνα</strong> (έτη 2001 έως 2100) και την <strong>3η χιλιετία</strong>!
              </div>
            </article>

            {/* ΒΗΜΑ 4 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Παγκόσμιος Χρόνος</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Ώρα Γκρίνουιτς (GMT / UTC)
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Επειδή η Γη περιστρέφεται, δεν είναι η ίδια ώρα σε όλο τον πλανήτη. Η Γη χωρίζεται σε <strong>24 ωριαίες ατράκτους (ζώνες ώρας)</strong>:
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1.5 text-slate-700">
                  <div>• <strong>Αρχικός Μεσημβρινός:</strong> Περνά από το αστεροσκοπείο του Γκρίνουιτς (Greenwich) κοντά στο Λονδίνο (UTC 0).</div>
                  <div>• <strong>Προς τα Ανατολικά:</strong> Η ώρα προηγείται (προσθέτουμε ώρες, π.χ. Ελλάδα ＝ UTC+2).</div>
                  <div>• <strong>Προς τα Δυτικά:</strong> Η ώρα ακολουθεί (αφαιρούμε ώρες, π.χ. Νέα Υόρκη ＝ UTC-5).</div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🌍 Όταν στο Λονδίνο είναι 12:00 το μεσημέρι, στην Αθήνα είναι 14:00 (2 ώρες μπροστά)!
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΜΕΤΑΤΡΟΠΕΑΣ ΧΡΟΝΟΥ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1</span>
            </div>
            <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Δυναμικός Μετατροπέας Χρόνου (Ώρες, Λεπτά, Δευτερόλεπτα)
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Επίλεξε ώρες και λεπτά για να δεις τη μετατροπή σε συνολικά λεπτά, δευτερόλεπτα και σε δεκαδική μορφή ώρας.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            {/* Χειριστήρια Ρύθμισης (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Ρύθμιση Ωρών */}
              <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-blue-900 tracking-wider">
                    ΩΡΕΣ (h):
                  </span>
                  <span className="font-mono font-black text-base sm:text-xl text-blue-700 bg-white px-3 py-1 rounded-xl border border-blue-200 shadow-sm">
                    {hoursInput} h
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Μείωση ωρών"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setHoursInput((prev) => Math.max(0, prev - 1)); }}
                    disabled={hoursInput <= 0}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={12}
                    step={1}
                    value={hoursInput}
                    onChange={(e) => setHoursInput(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer touch-manipulation"
                  />
                  <button
                    type="button"
                    aria-label="Αύξηση ωρών"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setHoursInput((prev) => Math.min(12, prev + 1)); }}
                    disabled={hoursInput >= 12}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Ρύθμιση Λεπτών */}
              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-amber-900 tracking-wider">
                    ΛΕΠΤΑ (min):
                  </span>
                  <span className="font-mono font-black text-base sm:text-xl text-amber-700 bg-white px-3 py-1 rounded-xl border border-amber-200 shadow-sm">
                    {minutesInput} min
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Μείωση λεπτών"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMinutesInput((prev) => Math.max(0, prev - 5)); }}
                    disabled={minutesInput <= 0}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={55}
                    step={5}
                    value={minutesInput}
                    onChange={(e) => setMinutesInput(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer touch-manipulation"
                  />
                  <button
                    type="button"
                    aria-label="Αύξηση λεπτών"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMinutesInput((prev) => Math.min(55, prev + 5)); }}
                    disabled={minutesInput >= 55}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

            </div>

            {/* Πίνακας Ισοδύναμων Μορφών Χρόνου (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-3">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block text-center">
                ΑΝΑΛΥΣΗ ΚΑΙ ΜΕΤΑΤΡΟΠΗ ΣΕ ΟΛΕΣ ΤΙΣ ΜΟΝΑΔΕΣ
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-mono">
                <div className="p-3.5 bg-white rounded-2xl border border-blue-200 flex items-center justify-between">
                  <span className="text-slate-600 font-sans">Συνολικά λεπτά:</span>
                  <span className="font-black text-blue-700">{timeConversions.totalMinutes} min</span>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-emerald-200 flex items-center justify-between">
                  <span className="text-slate-600 font-sans">Συνολικά δευτερόλεπτα:</span>
                  <span className="font-black text-emerald-700">{formatNum(timeConversions.totalSeconds, 0)} s</span>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-purple-200 flex items-center justify-between">
                  <span className="text-slate-600 font-sans">Δεκαδική μορφή ώρας:</span>
                  <span className="font-black text-purple-700">{formatNum(timeConversions.decimalHours, 2)} h</span>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-amber-200 flex items-center justify-between">
                  <span className="text-slate-600 font-sans">Κλασματική μορφή:</span>
                  <span className="font-black text-amber-700">
                    {hoursInput > 0 ? `${hoursInput} και ` : ''}
                    <Fraction num={minutesInput} den={60} /> h
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-white rounded-2xl border border-slate-200 font-sans text-xs sm:text-sm text-slate-600 space-y-1 text-center">
                💡 <strong>Μαθηματικός Υπολογισμός:</strong> ({hoursInput} · 60) ＋ {minutesInput} ＝ <strong>{timeConversions.totalMinutes} λεπτά</strong> ＝ {timeConversions.totalMinutes} · 60 ＝ <strong>{formatNum(timeConversions.totalSeconds, 0)} δευτερόλεπτα</strong>.
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΠΑΓΚΟΣΜΙΟΣ ΧΡΟΝΟΣ & GREENWICH */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
              <span>🌍 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΠΑΓΚΟΣΜΙΑ ΩΡΑ</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Ώρα Γκρίνουιτς (UTC) &amp; Ζώνες Ώρας στον Πλανήτη
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Επίλεξε την ώρα στο <strong>Greenwich του Λονδίνου (UTC 0)</strong> και δες αυτόματα τι ώρα είναι ταυτόχρονα σε άλλες πόλεις του πλανήτη:
            </p>
          </div>

          <div className="space-y-6">
            
            {/* Ρύθμιση Ώρας Greenwich */}
            <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 max-w-xl mx-auto space-y-3 text-center">
              <span className="text-xs font-bold text-slate-700 block uppercase">
                ΩΡΑ ΣΤΟ GREENWICH (ΛΟΝΔΙΝΟ - UTC 0):
              </span>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setBaseGmtHour((prev) => (prev === 0 ? 23 : prev - 1))}
                  className="w-10 h-10 bg-white hover:bg-slate-100 rounded-xl border border-slate-300 font-black text-lg text-slate-800 transition active:scale-95 shadow-sm touch-manipulation"
                >
                  －
                </button>
                <span className="font-mono font-black text-2xl sm:text-3xl text-indigo-700 bg-white px-5 py-1.5 rounded-2xl border border-indigo-200 shadow-sm">
                  {String(baseGmtHour).padStart(2, '0')}:00
                </span>
                <button
                  type="button"
                  onClick={() => setBaseGmtHour((prev) => (prev === 23 ? 0 : prev + 1))}
                  className="w-10 h-10 bg-white hover:bg-slate-100 rounded-xl border border-slate-300 font-black text-lg text-slate-800 transition active:scale-95 shadow-sm touch-manipulation"
                >
                  ＋
                </button>
              </div>
            </div>

            {/* Κάρτες Πόλεων */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              {TIME_ZONES.map((tz, idx) => {
                const calculatedHour = (baseGmtHour + tz.offset + 24) % 24;
                const isBase = tz.offset === 0;

                return (
                  <div
                    key={`tz-${idx}`}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                      isBase 
                        ? 'bg-blue-50 border-blue-300 shadow-md ring-2 ring-blue-300' 
                        : 'bg-white border-slate-200 shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="text-2xl mb-1">{tz.flag}</div>
                      <h4 className="font-black text-sm text-slate-900">{tz.city}</h4>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">{tz.desc}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Τοπική Ώρα:</span>
                      <span className={`font-mono text-xl sm:text-2xl font-black ${isBase ? 'text-blue-700' : 'text-slate-800'}`}>
                        {String(calculatedHour).padStart(2, '0')}:00
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-center font-sans text-xs sm:text-sm text-sky-950">
              💡 <strong>Συμπέρασμα:</strong> Η Ελλάδα βρίσκεται στην ωριαία άτρακτο <strong>UTC+2</strong>. Όταν στο Λονδίνο είναι {String(baseGmtHour).padStart(2, '0')}:00, στην Ελλάδα είναι πάντα 2 ώρες αργότερα ({String((baseGmtHour + 2) % 24).padStart(2, '0')}:00).
            </div>
          </div>
        </section>

        {/* 5. ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ ΚΑΘΗΜΕΡΙΝΗΣ ΖΩΗΣ */}
        <section className="space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight">
              Λυμένα Προβλήματα με Μονάδες Χρόνου
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Αναλυτικοί υπολογισμοί διάρκειας ταξιδιού και ιστορικών αιώνων.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ΠΡΟΒΛΗΜΑ 1 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-900 text-xs font-black rounded-lg uppercase">
                  ΠΡΟΒΛΗΜΑ 1: ΔΙΑΡΚΕΙΑ ΤΑΞΙΔΙΟΥ
                </span>
                <span className="text-xs font-bold text-slate-400">Δρομολόγιο Πλοίου</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Υπολογισμός Διάρκειας με Δανεισμό 60 Λεπτών
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ένα πλοίο αναχώρησε από το λιμάνι του Πειραιά στις <strong>08:45</strong> το πρωί και έφτασε στη Νάξο στις <strong>14:20</strong> το μεσημέρι. Πόση ώρα διήρκεσε το ταξίδι;
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΔΕΔΟΜΕΝΑ ΔΡΟΜΟΛΟΓΙΟΥ
                </span>
                <div className="grid grid-cols-2 gap-2 text-center font-mono font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Ώρα Αναχώρησης</span> 08 h 45 min
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Ώρα Άφιξης</span> 14 h 20 min
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήματα Επίλυσης:</span>
                  <div>• <strong>Αφαίρεση:</strong> 14 h 20 min － 08 h 45 min.</div>
                  <div>• <strong>Δανεισμός 1 ώρας (60 λεπτά):</strong> Τα 14 h 20 min γίνονται <strong>13 h 80 min</strong> (αφού 20 ＋ 60 ＝ 80).</div>
                  <div>• <strong>Εκτέλεση αφαίρεσης:</strong> (13 h 80 min) － (8 h 45 min) ＝ <strong>5 h 35 min</strong>.</div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 font-medium">
                💡 <strong>Μυστικό:</strong> Όταν τα λεπτά της άφιξης είναι λιγότερα, «δανειζόμαστε» 1 ώρα και προσθέτουμε <strong>60 λεπτά</strong> (όχι 100!).
              </div>
            </article>

            {/* ΠΡΟΒΛΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-lg uppercase">
                  ΠΡΟΒΛΗΜΑ 2: ΑΙΩΝΕΣ &amp; ΧΡΟΝΟΛΟΓΙΕΣ
                </span>
                <span className="text-xs font-bold text-slate-400">Ιστορικά Γεγονότα</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Σε Ποιον Αιώνα Ανήκει Κάθε Έτος;
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Να βρεθεί σε ποιον αιώνα συνέβησαν τα παρακάτω ιστορικά ορόσημα: (α) Η έναρξη της Ελληνικής Επανάστασης το <strong>1821</strong>, (β) Η Μάχη του Μαραθώνα το <strong>490 π.Χ.</strong>, και (γ) Το έτος <strong>2000</strong>.
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center font-mono font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Έτος 1821</span> 19ος αιώνας
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Έτος 490 π.Χ.</span> 5ος αι. π.Χ.
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Έτος 2000</span> 20ός αιώνας
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Κανόνας Υπολογισμού:</span>
                  <div>• <strong>1821:</strong> Κόβουμε τα 2 τελευταία ψηφία (18) και προσθέτουμε 1 ➔ 18 ＋ 1 ＝ <strong>19ος αιώνας</strong>.</div>
                  <div>• <strong>490 π.Χ.:</strong> 4 ＋ 1 ＝ <strong>5ος αιώνας π.Χ.</strong></div>
                  <div>• <strong>2000:</strong> Λήγει σε 00, άρα είναι το τελευταίο έτος του <strong>20ού αιώνα</strong> (ο 21ος άρχισε το 2001).</div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 font-medium">
                ⚡ Κάθε αιώνας ξεκινά από το έτος 01 και τελειώνει στο έτος 00 (π.χ. 20ός αιώνας: 1901 έως 2000).
              </div>
            </article>

          </div>
        </section>

        {/* 6. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στις Μονάδες Χρόνου!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε 10 διαδραστικές ασκήσεις με μετατροπές ωρών/λεπτών, υπολογισμό διάρκειας, αιώνες και ζώνες ώρας για τη ΣΤ' Δημοτικού.
            </p>
          </div>

          <Link
            href="/st-dimotikou/61-xronos-ask"
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
