// pages/e-dimotikou/01-klasma.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function KlasmaTheoryPage() {
  const [num, setNum] = useState(3);
  const [den, setDen] = useState(4);
  const [viewType, setViewType] = useState('pie'); // 'pie' | 'bar'

  const MIN_NUM = 0;
  const MAX_NUM = 24;
  const MIN_DEN = 1;
  const MAX_DEN = 12;

  const wholeUnits = den > 0 ? Math.floor(num / den) : 0;
  const remainderParts = den > 0 ? num % den : 0;
  const totalShapes = Math.max(1, Math.ceil(num / den) || 1);

  // Σχεδίαση τομέων κυκλικού δίσκου
  const renderPieSlices = (shapeIndex) => {
    const slices = [];
    const radius = 88;
    const cx = 100;
    const cy = 100;

    for (let i = 0; i < den; i++) {
      const sliceGlobalIndex = shapeIndex * den + i;
      const isFilled = sliceGlobalIndex < num;

      if (den === 1) {
        return (
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            className={`${
              isFilled ? 'fill-amber-500' : 'fill-slate-100'
            } stroke-slate-800 stroke-[3] transition-colors duration-150`}
          />
        );
      }

      const startAngle = (i * 360) / den - 90;
      const endAngle = ((i + 1) * 360) / den - 90;
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1 = cx + radius * Math.cos(startRad);
      const y1 = cy + radius * Math.sin(startRad);
      const x2 = cx + radius * Math.cos(endRad);
      const y2 = cy + radius * Math.sin(endRad);

      const largeArc = 360 / den > 180 ? 1 : 0;
      const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

      slices.push(
        <path
          key={`slice-${shapeIndex}-${i}`}
          d={pathData}
          className={`${
            isFilled ? 'fill-amber-500' : 'fill-slate-100'
          } stroke-slate-800 stroke-[2] transition-colors duration-150`}
        />
      );
    }
    return slices;
  };

  // Σχεδίαση ορθογώνιας ράβδου
  const renderBarParts = (shapeIndex) => {
    const rects = [];
    const totalWidth = 260;
    const barHeight = 64;
    const startX = 20;
    const startY = 28;
    const partWidth = totalWidth / den;

    for (let i = 0; i < den; i++) {
      const partGlobalIndex = shapeIndex * den + i;
      const isFilled = partGlobalIndex < num;
      const x = startX + i * partWidth;

      rects.push(
        <rect
          key={`bar-${shapeIndex}-${i}`}
          x={x}
          y={startY}
          width={partWidth}
          height={barHeight}
          className={`${
            isFilled ? 'fill-sky-500' : 'fill-slate-100'
          } stroke-slate-800 stroke-[2] transition-colors duration-150`}
        />
      );
    }
    return rects;
  };

  const getFractionCategory = () => {
    if (num === 0) {
      return {
        label: 'Μηδενικό Κλάσμα',
        badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
        desc: 'Δεν έχουμε πάρει κανένα μέρος από τη μονάδα.'
      };
    }
    if (num < den) {
      return {
        label: 'Γνήσιο Κλάσμα ( ＜ 1 )',
        badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
        desc: 'Ο αριθμητής είναι μικρότερος από τον παρονομαστή. Εκφράζει ποσότητα μικρότερη από 1 ακέραιη μονάδα.'
      };
    }
    if (num === den) {
      return {
        label: 'Ίσο με τη Μονάδα ( ＝ 1 )',
        badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-300',
        desc: 'Ο αριθμητής είναι ίσος με τον παρονομαστή. Συμπληρώνει ακριβώς 1 ολόκληρη μονάδα.'
      };
    }
    return {
      label: 'Καταχρηστικό Κλάσμα ( ＞ 1 )',
      badgeColor: 'bg-amber-50 text-amber-900 border-amber-300',
      desc: 'Ο αριθμητής είναι μεγαλύτερος από τον παρονομαστή. Χρειαζόμαστε περισσότερες από μία μονάδες (μεικτός αριθμός).'
    };
  };

  const fractionCategory = getFractionCategory();

  return (
    <Layout
      title="Η Έννοια του Κλάσματος - Ε' Δημοτικού | LearnMaths.gr"
      description="Πλήρης θεωρία με παραδείγματα, ορολογία, είδη κλασμάτων, κλάσμα ως πηλίκο διαίρεσης και διαδραστικό εργαστήριο για την Ε' Δημοτικού."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/01-klasma-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 Ασκήσεις</span>
        </Link>
      }
    >
      {/* Container πλήρους εύρους για 2K & 4K */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 space-y-10 2xl:space-y-14 pb-24">
        
        {/* 1. HEADER BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>Κεφάλαιο 1 • Ε' Δημοτικού</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Η Έννοια του Κλάσματος
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              Μαθαίνουμε πώς να χωρίζουμε τη μονάδα σε ίσα μέρη, να αναγνωρίζουμε τους όρους του κλάσματος, να ερμηνεύουμε το κλάσμα ως πηλίκο διαίρεσης και να διακρίνουμε τα γνήσια από τα καταχρηστικά κλάσματα.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία &amp; Διαδραστική Οπτικοποίηση</span>
            </div>
            <Link
              href="/e-dimotikou/01-klasma-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2.5 2xl:px-7 2xl:py-3.5 rounded-xl shadow-md transition active:scale-95 text-sm 2xl:text-base"
            >
              <span>Δοκίμασε τις Ασκήσεις</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΑΝΑΛΥΣΗΣ ΘΕΩΡΙΑΣ (Responsive 1/2/4 στήλες για 2K/4K) */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
              Βασικές Έννοιες σε 4 Βήματα
            </h2>
            <p className="text-slate-600 text-sm sm:text-base 2xl:text-xl mt-1">
              Όλα όσα χρειάζεται να γνωρίζεις για να κατανοήσεις σε βάθος τα κλάσματα.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 gap-6 2xl:gap-8">
            {/* Βήμα 1ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-sky-100 text-sky-800 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    Βήμα 1ο
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Μέρος της Μονάδας</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Τι είναι Κλάσμα &amp; ποιοι οι Όροι του;
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Όταν χωρίζουμε μια ακέραιη μονάδα σε <strong>ίσα μέρη</strong>, κάθε μέρος ονομάζεται κλάσμα. Ένα κλάσμα αποτελείται από τρία στοιχεία:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-3 text-xs sm:text-sm 2xl:text-base">
                  <div className="flex items-start gap-2">
                    <span className="font-black text-amber-600 shrink-0">1.</span>
                    <div>
                      <strong className="text-slate-900">Αριθμητής (πάνω):</strong> Δείχνει πόσα από τα ίσα μέρη έχουμε πάρει.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-black text-slate-700 shrink-0">2.</span>
                    <div>
                      <strong className="text-slate-900">Γραμμή Κλάσματος (μέση):</strong> Συμβολίζει την πράξη της διαίρεσης.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-black text-sky-600 shrink-0">3.</span>
                    <div>
                      <strong className="text-slate-900">Παρονομαστής (κάτω):</strong> Δείχνει σε πόσα ίσα μέρη χωρίστηκε συνολικά η μονάδα (δεν μπορεί να είναι ποτέ 0).
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-sky-50 to-indigo-50 p-4 2xl:p-6 rounded-2xl border border-sky-200 flex items-center justify-center">
                <div className="inline-flex items-center gap-4 text-center font-mono">
                  <div className="flex flex-col items-center">
                    <span className="text-base 2xl:text-xl font-black text-amber-600">3 (Αριθμητής)</span>
                    <span className="w-full h-1 bg-slate-900 rounded-full my-1"></span>
                    <span className="text-base 2xl:text-xl font-black text-sky-600">5 (Παρονομαστής)</span>
                  </div>
                  <span className="text-slate-500 font-sans text-xs sm:text-sm 2xl:text-base max-w-[160px] text-left">
                    «Πήραμε τα 3 από τα 5 ίσα μέρη»
                  </span>
                </div>
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    Βήμα 2ο
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Πηλίκο Διαίρεσης</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Το Κλάσμα ως Ακριβές Πηλίκο
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Κάθε κλάσμα ισοδυναμεί με τη διαίρεση του <strong>αριθμητή διά του παρονομαστή</strong>. Όταν η διαίρεση δεν είναι τέλεια, το κλάσμα είναι η ακριβής τιμή του πηλίκου.
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-3 text-xs sm:text-sm 2xl:text-base">
                  <p className="text-slate-700">
                    Αν μοιράσουμε <strong>3 πίτσες</strong> ισότιμα σε <strong>4 παιδιά</strong>, κάθε παιδί θα πάρει:
                  </p>
                  <div className="py-2 flex items-center justify-center">
                    <div className="inline-flex flex-wrap items-center justify-center gap-2 font-mono font-black text-slate-900 text-sm sm:text-base 2xl:text-xl bg-white px-4 py-2 rounded-xl border border-slate-300 shadow-inner">
                      <span>3 ： 4</span>
                      <span>＝</span>
                      <span className="inline-flex flex-col items-center leading-none">
                        <span>3</span>
                        <span className="w-5 h-0.5 bg-slate-800 my-0.5"></span>
                        <span>4</span>
                      </span>
                      <span>＝</span>
                      <span>0,75</span>
                    </div>
                  </div>
                  <p className="text-slate-500 text-xs 2xl:text-sm">
                    Κάθε παιδί παίρνει τα 3/4 μιας ολόκληρης πίτσας.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                <strong>Προσοχή:</strong> Ο παρονομαστής δεν μπορεί <strong>ΠΟΤΕ</strong> να είναι 0, γιατί η διαίρεση με το μηδέν είναι αδύνατη στα μαθηματικά!
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    Βήμα 3ο
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Κατηγοριοποίηση</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Τα 3 Είδη Κλασμάτων
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Συγκρίνοντας τον αριθμητή με τον παρονομαστή, διακρίνουμε τα κλάσματα σε τρεις κατηγορίες:
                </p>

                <div className="space-y-2.5 text-xs sm:text-sm 2xl:text-base">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                    <strong>1. Γνήσιο Κλάσμα ( ＜ 1 ):</strong> Αριθμητής ＜ Παρονομαστή. (π.χ.{' '}
                    <span className="font-mono font-bold">2/5</span>,{' '}
                    <span className="font-mono font-bold">7/10</span>).
                  </div>
                  <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-950">
                    <strong>2. Ίσο με τη Μονάδα ( ＝ 1 ):</strong> Αριθμητής ＝ Παρονομαστή. (π.χ.{' '}
                    <span className="font-mono font-bold">4/4 ＝ 1</span>,{' '}
                    <span className="font-mono font-bold">8/8 ＝ 1</span>).
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950">
                    <strong>3. Καταχρηστικό Κλάσμα ( ＞ 1 ):</strong> Αριθμητής ＞ Παρονομαστή. (π.χ.{' '}
                    <span className="font-mono font-bold">7/4</span>).
                  </div>
                </div>
              </div>

              <p className="text-xs 2xl:text-sm text-slate-500 italic">
                Τα καταχρηστικά κλάσματα γράφονται ως <strong>μεικτοί αριθμοί</strong> (π.χ.{' '}
                <span className="font-mono font-bold">7/4 ＝ 1 ＋ 3/4 ＝ 1 3/4</span>).
              </p>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-rose-100 text-rose-800 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    Βήμα 4ο
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Εφαρμογή</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Κλάσμα ως Μέρος ενός Συνόλου
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Ένα κλάσμα μπορεί να εκφράσει και ένα τμήμα από ένα πλήθος αντικειμένων (σύνολο).
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2.5 text-xs sm:text-sm 2xl:text-base">
                  <p className="text-slate-800 font-semibold">
                    Παράδειγμα: Πόσο είναι τα <span className="font-mono text-indigo-600 font-bold">3/5</span> των <span className="font-mono font-bold">20</span> μαθητών;
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-slate-600">
                    <li>
                      Βρίσκουμε το 1/5: <span className="font-mono font-bold text-slate-900">20 ： 5 ＝ 4</span> μαθητές.
                    </li>
                    <li>
                      Πολλαπλασιάζουμε επί 3: <span className="font-mono font-bold text-slate-900">4 · 3 ＝ 12</span> μαθητές.
                    </li>
                  </ol>
                  <div className="mt-2 pt-2 border-t border-slate-200 font-mono font-bold text-indigo-900 flex items-center justify-center">
                    (20 ： 5) · 3 ＝ 12 μαθητές
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 <strong>Κανόνας:</strong> Διαιρούμε το σύνολο με τον παρονομαστή και πολλαπλασιάζουμε με τον αριθμητή.
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΚΛΑΣΜΑΤΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 Διαδραστικό Εργαστήριο</span>
              </div>
              <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Εξερεύνηση &amp; Οπτικοποίηση Κλάσματος
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Άλλαξε τον αριθμητή και τον παρονομαστή για να παρατηρήσεις πώς μεταβάλλεται το σχήμα και το είδος του κλάσματος.
              </p>
            </div>

            {/* Toggle τύπου απεικόνισης */}
            <div className="inline-flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start sm:self-center">
              <button
                type="button"
                onClick={() => setViewType('pie')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base font-bold transition ${
                  viewType === 'pie'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🍕 Κυκλικοί Δίσκοι
              </button>
              <button
                type="button"
                onClick={() => setViewType('bar')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base font-bold transition ${
                  viewType === 'bar'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🍫 Ορθογώνιες Ράβδοι
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            {/* Αριστερή Στήλη: Steppers & Μαθηματική Ταυτότητα */}
            <div className="xl:col-span-5 2xl:col-span-4 space-y-6 bg-slate-50 p-6 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200">
              <h4 className="text-xs 2xl:text-sm font-black uppercase tracking-wider text-slate-500">
                Ρυθμισεις Ορων
              </h4>

              {/* Stepper Αριθμητή */}
              <div className="space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">Αριθμητής (μέρη που παίρνουμε):</span>
                  <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-lg 2xl:text-xl text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                    {num}
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Μείωση αριθμητή κατά 1"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setNum((prev) => Math.max(MIN_NUM, prev - 1));
                    }}
                    disabled={num <= MIN_NUM}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>

                  <input
                    type="range"
                    min={MIN_NUM}
                    max={MAX_NUM}
                    step={1}
                    value={num}
                    onChange={(e) => setNum(Number(e.target.value))}
                    aria-label="Αριθμητής"
                    className="w-full min-w-0 max-w-full accent-amber-500 cursor-pointer"
                  />

                  <button
                    type="button"
                    aria-label="Αύξηση αριθμητή κατά 1"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setNum((prev) => Math.min(MAX_NUM, prev + 1));
                    }}
                    disabled={num >= MAX_NUM}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>

                {/* Γρήγορα βοηθητικά buttons */}
                <div className="flex items-center justify-end gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setNum(0);
                    }}
                    className="text-xs 2xl:text-sm px-2.5 py-1 rounded-lg bg-slate-200/80 hover:bg-slate-300 font-semibold text-slate-700 transition"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setNum(den);
                    }}
                    className="text-xs 2xl:text-sm px-2.5 py-1 rounded-lg bg-slate-200/80 hover:bg-slate-300 font-semibold text-slate-700 transition"
                  >
                    ＝ Παρονομαστή
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setNum((prev) => Math.min(MAX_NUM, prev + 3));
                    }}
                    className="text-xs 2xl:text-sm px-2.5 py-1 rounded-lg bg-slate-200/80 hover:bg-slate-300 font-semibold text-slate-700 transition"
                  >
                    ＋3
                  </button>
                </div>
              </div>

              {/* Stepper Παρονομαστή */}
              <div className="space-y-2 pt-3 border-t border-slate-200">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">Παρονομαστής (ίσα μέρη μονάδας):</span>
                  <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-lg 2xl:text-xl text-sky-600 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-200">
                    {den}
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Μείωση παρονομαστή κατά 1"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDen((prev) => Math.max(MIN_DEN, prev - 1));
                    }}
                    disabled={den <= MIN_DEN}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>

                  <input
                    type="range"
                    min={MIN_DEN}
                    max={MAX_DEN}
                    step={1}
                    value={den}
                    onChange={(e) => setDen(Number(e.target.value))}
                    aria-label="Παρονομαστής"
                    className="w-full min-w-0 max-w-full accent-sky-500 cursor-pointer"
                  />

                  <button
                    type="button"
                    aria-label="Αύξηση παρονομαστή κατά 1"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDen((prev) => Math.min(MAX_DEN, prev + 1));
                    }}
                    disabled={den >= MAX_DEN}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>

                {/* Γρήγορα κουμπιά συνήθων παρονομαστών */}
                <div className="flex items-center justify-end gap-1.5 pt-1">
                  {[2, 4, 6, 8, 10, 12].map((val) => (
                    <button
                      key={`quick-den-${val}`}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDen(val);
                      }}
                      className={`text-xs 2xl:text-sm px-2.5 py-1 rounded-lg font-semibold transition ${
                        den === val
                          ? 'bg-sky-600 text-white'
                          : 'bg-slate-200/80 hover:bg-slate-300 text-slate-700'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Κάρτα Μαθηματικής Ταυτότητας */}
              <div className="p-5 2xl:p-6 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-sm">
                <div className="text-xs 2xl:text-sm font-bold text-slate-500 uppercase tracking-wider">
                  Μαθηματικη Αναλυση
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 font-mono font-black text-2xl 2xl:text-3xl text-slate-900">
                    <span className="flex flex-col items-center leading-none">
                      <span className="text-amber-600">{num}</span>
                      <span className="w-7 h-0.5 bg-slate-800 my-0.5"></span>
                      <span className="text-sky-600">{den}</span>
                    </span>
                    <span className="text-slate-400 font-sans text-xl">＝</span>
                    <span className="text-slate-800">
                      {(num / den).toLocaleString('el-GR', {
                        maximumFractionDigits: 3
                      })}
                    </span>
                  </div>

                  <span
                    className={`text-xs 2xl:text-sm font-bold px-3 py-1.5 rounded-lg border ${fractionCategory.badgeColor}`}
                  >
                    {fractionCategory.label}
                  </span>
                </div>

                <p className="text-xs 2xl:text-sm text-slate-600 leading-relaxed">
                  {fractionCategory.desc}
                </p>

                {num > den && den > 0 && (
                  <div className="pt-3 border-t border-slate-100 text-xs 2xl:text-sm font-semibold text-slate-700">
                    💡 Ως Μεικτός Αριθμός:{' '}
                    <span className="font-mono font-bold text-indigo-700">
                      {wholeUnits} {remainderParts > 0 ? `${remainderParts}/${den}` : ''}
                    </span>{' '}
                    (δηλ. {wholeUnits} ακέραιες μονάδες {remainderParts > 0 ? `και ακόμη ${remainderParts}/${den}` : ''})
                  </div>
                )}
              </div>
            </div>

            {/* Δεξιά Στήλη: Responsive SVG Canvas με αυτόματο scaling σε 2K/4K */}
            <div className="xl:col-span-7 2xl:col-span-8 bg-slate-50 p-6 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 flex flex-col items-center justify-center min-h-[380px] 2xl:min-h-[500px] space-y-6">
              <div className="w-full flex items-center justify-between text-xs sm:text-sm 2xl:text-base font-bold text-slate-500 px-2">
                <span>
                  Οπτική Αναπαράσταση ({totalShapes}{' '}
                  {totalShapes === 1 ? 'μονάδα' : 'μονάδες'})
                </span>
                <span className="font-mono">
                  Σύνολο μερών: {num} / {totalShapes * den}
                </span>
              </div>

              {/* Πλέγμα Σχημάτων: 1 στήλη σε κινητά, 2 σε tablet/desktop, 3 σε 2K, 4 σε 4K */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 4xl:grid-cols-4 gap-4 2xl:gap-6 place-items-center">
                {Array.from({ length: totalShapes }).map((_, shapeIdx) => (
                  <div
                    key={`shape-${shapeIdx}`}
                    className="w-full max-w-[260px] 2xl:max-w-[320px] bg-white p-4 2xl:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center space-y-3"
                  >
                    <span className="text-[11px] 2xl:text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Μονάδα {shapeIdx + 1}η
                    </span>

                    {viewType === 'pie' ? (
                      <div className="w-full aspect-square max-w-[190px] 2xl:max-w-[240px]">
                        <svg
                          viewBox="0 0 200 200"
                          className="w-full h-full drop-shadow-sm"
                          aria-label={`Κυκλική αναπαράσταση μονάδας ${shapeIdx + 1}`}
                        >
                          {renderPieSlices(shapeIdx)}
                        </svg>
                      </div>
                    ) : (
                      <div className="w-full aspect-[300/120] max-w-[240px] 2xl:max-w-[280px]">
                        <svg
                          viewBox="0 0 300 120"
                          className="w-full h-full drop-shadow-sm"
                          aria-label={`Ορθογώνια αναπαράσταση μονάδας ${shapeIdx + 1}`}
                        >
                          {renderBarParts(shapeIdx)}
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Υπόμνημα χρωμάτων */}
              <div className="flex flex-wrap items-center justify-center gap-5 text-xs 2xl:text-sm pt-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-4 h-4 rounded ${
                      viewType === 'pie' ? 'bg-amber-500' : 'bg-sky-500'
                    }`}
                  ></span>
                  <span className="text-slate-700 font-semibold">Μέρη που πήραμε ({num})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-slate-100 border border-slate-400"></span>
                  <span className="text-slate-600 font-medium">Υπόλοιπα μέρη</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Είσαι έτοιμος για εξάσκηση;
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε απαιτητικές ασκήσεις με αναγνώριση κλασμάτων, ισοδυναμίες, μεικτούς αριθμούς και προβλήματα πραγματικής ζωής.
            </p>
          </div>

          <Link
            href="/e-dimotikou/01-klasma-ask"
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
