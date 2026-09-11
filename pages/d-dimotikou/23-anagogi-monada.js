// pages/d-dimotikou/23-anagogi-monada.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

function formatNumber(num) {
  if (num === '' || isNaN(num)) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export default function AnagogiMonadaPage() {
  // Έτοιμα σενάρια καθημερινότητας με πλήρη γραμματική υποστήριξη
  const presets = [
    {
      item: 'μολύβια',
      singleAcc: 'το 1 μολύβι',
      pluralAcc: 'τα',
      pluralNom: 'Τα',
      emoji: '✏️',
      initialQty: 4,
      initialCost: 8,
      targetQty: 7,
      unit: '€'
    },
    {
      item: 'σοκολάτες',
      singleAcc: 'τη 1 σοκολάτα',
      pluralAcc: 'τις',
      pluralNom: 'Οι',
      emoji: '🍫',
      initialQty: 3,
      initialCost: 6,
      targetQty: 8,
      unit: '€'
    },
    {
      item: 'μπάλες',
      singleAcc: 'τη 1 μπάλα',
      pluralAcc: 'τις',
      pluralNom: 'Οι',
      emoji: '⚽',
      initialQty: 5,
      initialCost: 25,
      targetQty: 3,
      unit: '€'
    },
    {
      item: 'βιβλία',
      singleAcc: 'το 1 βιβλίο',
      pluralAcc: 'τα',
      pluralNom: 'Τα',
      emoji: '📚',
      initialQty: 2,
      initialCost: 18,
      targetQty: 5,
      unit: '€'
    }
  ];

  const [selectedPreset, setSelectedPreset] = useState(0);
  const [initialQty, setInitialQty] = useState(presets[0].initialQty);
  const [initialCost, setInitialCost] = useState(presets[0].initialCost);
  const [targetQty, setTargetQty] = useState(presets[0].targetQty);

  const numInitialQty = typeof initialQty === 'number' ? initialQty : 0;
  const numInitialCost = typeof initialCost === 'number' ? initialCost : 0;
  const numTargetQty = typeof targetQty === 'number' ? targetQty : 0;

  // Υπολογισμοί Αναγωγής στη Μονάδα
  const unitCost = numInitialQty > 0 ? numInitialCost / numInitialQty : 0;
  const finalCost = unitCost * numTargetQty;

  const handleSelectPreset = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedPreset(index);
    setInitialQty(presets[index].initialQty);
    setInitialCost(presets[index].initialCost);
    setTargetQty(presets[index].targetQty);
  };

  const updateInitialQty = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setInitialQty((prev) => Math.max(1, Math.min(999, (Number(prev) || 1) + delta)));
  };

  const updateInitialCost = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setInitialCost((prev) => Math.max(1, Math.min(999, (Number(prev) || 1) + delta)));
  };

  const updateTargetQty = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setTargetQty((prev) => Math.max(1, Math.min(9999, (Number(prev) || 1) + delta)));
  };

  const currentItem = presets[selectedPreset];

  return (
    <Layout
      title="Η Μέθοδος της Αναγωγής στη Μονάδα - Θεωρία | LearnMaths.gr"
      description="Μαθαίνουμε πώς να λύνουμε προβλήματα με τη μέθοδο της αναγωγής στη μονάδα σε 2 απλά βήματα: διαίρεση για το ένα και πολλαπλασιασμός για τα πολλά."
      backUrl="/d-dimotikou"
      backText="Δ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/d-dimotikou/23-anagogi-monada-ask"
          className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>🎯</span> Ασκήσεις
        </Link>
      }
    >
      <div className="space-y-8">
        {/* HEADER & EXERCISES PROMO CARD */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                Δ' ΔΗΜΟΤΙΚΟΥ
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                🎯 Η Μέθοδος της Αναγωγής στη Μονάδα
              </h1>
              <p className="text-amber-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                Μαθαίνουμε πώς να λύνουμε προβλήματα με <strong>2 απλά βήματα</strong>: βρίσκουμε πρώτα πόσο κοστίζει <strong>το ένα</strong> και μετά υπολογίζουμε πόσο κοστίζουν <strong>τα πολλά</strong>!
              </p>
            </div>

            {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
              <div className="text-3xl">🚀</div>
              <h3 className="font-extrabold text-white text-lg">Έτοιμος για εξάσκηση;</h3>
              <p className="text-xs text-amber-100">
                Δοκίμασε τις διαδραστικές ασκήσεις στην αναγωγή στη μονάδα για να σιγουρευτείς ότι κατανόησες τη μέθοδο!
              </p>
              <Link
                href="/d-dimotikou/23-anagogi-monada-ask"
                className="inline-block w-full bg-slate-900 hover:bg-black text-white font-black py-3 px-4 rounded-xl shadow-md transition transform hover:-translate-y-0.5 text-sm"
              >
                🎯 Μετάβαση στις Ασκήσεις
              </Link>
            </div>
          </div>
        </div>

        {/* ΘΕΩΡΙΑ - ΤΑ 2 ΧΡΥΣΑ ΒΗΜΑΤΑ */}
        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-8">
          <div className="border-b pb-4 border-slate-100">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>📖</span> Τα 2 Βήματα της Αναγωγής στη Μονάδα
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. ΒΗΜΑ 1: ΔΙΑΙΡΕΣΗ */}
            <div className="bg-blue-50/70 p-5 sm:p-6 rounded-2xl border border-blue-100 space-y-3 shadow-sm">
              <div className="bg-blue-600 text-white font-black text-xs px-3 py-1 rounded-full w-fit flex items-center gap-1.5">
                <span>1️⃣</span> ΒΗΜΑ 1ο • ΔΙΑΙΡΕΣΗ ( ： )
              </div>
              <h3 className="text-base sm:text-lg font-bold text-blue-950">
                Βρίσκουμε το 1 (τη μονάδα)
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                <strong>Διαιρούμε</strong> τη συνολική αξία με το πλήθος των πραγμάτων για να υπολογίσουμε πόσο κοστίζει <strong>το 1 πράγμα (η μονάδα)</strong>.
              </p>
              <div className="bg-white p-3 rounded-xl border border-blue-200 text-xs font-mono font-bold text-blue-900 text-center shadow-sm">
                Τιμή για το 1 ＝ Συνολικό Κόστος ： Πλήθος
              </div>
            </div>

            {/* 2. ΒΗΜΑ 2: ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ */}
            <div className="bg-emerald-50/70 p-5 sm:p-6 rounded-2xl border border-emerald-100 space-y-3 shadow-sm">
              <div className="bg-emerald-600 text-white font-black text-xs px-3 py-1 rounded-full w-fit flex items-center gap-1.5">
                <span>2️⃣</span> ΒΗΜΑ 2ο • ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ ( · )
              </div>
              <h3 className="text-base sm:text-lg font-bold text-emerald-950">
                Βρίσκουμε τα πολλά που ζητάει το πρόβλημα
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                <strong>Πολλαπλασιάζουμε</strong> την τιμή του ενός πράγματος με το νέο πλήθος που θέλουμε να αγοράσουμε ή να υπολογίσουμε.
              </p>
              <div className="bg-white p-3 rounded-xl border border-emerald-200 text-xs font-mono font-bold text-emerald-900 text-center shadow-sm">
                Νέο Κόστος ＝ Τιμή του 1 · Νέο Πλήθος
              </div>
            </div>
          </div>

          {/* ΠΑΡΑΔΕΙΓΜΑ ΚΑΤΑΝΟΗΣΗΣ */}
          <div className="bg-amber-50/80 p-5 sm:p-6 rounded-2xl border border-amber-200/80 space-y-3 shadow-sm">
            <h4 className="font-extrabold text-amber-950 text-base flex items-center gap-2">
              <span>💡</span> Παράδειγμα Επίλυσης:
            </h4>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-semibold">
              «Αν τα 3 όμοια τετράδια κοστίζουν 6 €, πόσο κοστίζουν τα 5 ίδια τετράδια;»
            </p>
            <ul className="text-xs sm:text-sm space-y-1.5 pl-2 font-medium text-slate-700">
              <li>
                • <strong>Βήμα 1:</strong> Βρίσκουμε το 1 τετράδιο → 6 ： 3 ＝ <strong className="text-blue-700 font-bold">2 €</strong>.
              </li>
              <li>
                • <strong>Βήμα 2:</strong> Βρίσκουμε τα 5 τετράδια → 5 · 2 ＝ <strong className="text-emerald-700 font-bold">10 €</strong>.
              </li>
              <li>
                • <strong>Απάντηση:</strong> Τα 5 τετράδια κοστίζουν <strong className="text-emerald-700 font-bold">10 €</strong>.
              </li>
            </ul>
          </div>
        </div>

        {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ - SECTION 2 */}
        <div className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4 border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🧮</span> Διαδραστικό Εργαστήριο Αναγωγής στη Μονάδα
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                Επίλεξε ένα σενάριο καθημερινότητας ή άλλαξε τα νούμερα για να δεις αναλυτικά τα 2 βήματα της επίλυσης!
              </p>
            </div>

            {/* ΚΟΥΜΠΙΑ ΠΡΟΕΠΙΛΟΓΩΝ */}
            <div className="flex flex-wrap gap-1.5 self-start sm:self-auto">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={(e) => handleSelectPreset(e, idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 touch-manipulation ${
                    selectedPreset === idx
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {p.emoji} {p.item}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* ΧΕΙΡΙΣΤΗΡΙΑ ΕΙΣΑΓΩΓΗΣ & TOUCH CONTROLS (ΚΑΝΟΝΑΣ 2) */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <span>⚙️</span> Στοιχεία Προβλήματος:
              </h3>

              <div className="space-y-3.5">
                {/* Αρχικό Πλήθος */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <div className="h-8 flex items-center justify-between text-center px-1">
                    <span className="text-[11px] font-black text-slate-500 truncate">
                      ΑΡΧΙΚΟ ΠΛΗΘΟΣ ({currentItem.item})
                    </span>
                    <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-amber-600 text-base">
                      {formatNumber(numInitialQty)}
                    </span>
                  </div>

                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      onClick={(e) => updateInitialQty(e, -1)}
                      className="w-9 h-9 shrink-0 flex items-center justify-center bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation shadow-sm"
                      title="Μείωση κατά 1"
                      aria-label="Μείωση αρχικού πλήθους"
                    >
                      －
                    </button>

                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={3}
                      autoComplete="off"
                      id="input-initial-qty"
                      name="input-initial-qty"
                      value={initialQty}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 3);
                        setInitialQty(digits === '' ? '' : Number(digits));
                      }}
                      onBlur={() => {
                        if (!initialQty || initialQty < 1) setInitialQty(1);
                      }}
                      className="w-full min-w-0 max-w-full text-center font-mono font-black text-base sm:text-lg text-slate-800 border border-slate-300 rounded-xl py-1.5 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />

                    <button
                      onClick={(e) => updateInitialQty(e, 1)}
                      className="w-9 h-9 shrink-0 flex items-center justify-center bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation shadow-sm"
                      title="Αύξηση κατά 1"
                      aria-label="Αύξηση αρχικού πλήθους"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                {/* Αρχικό Κόστος */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <div className="h-8 flex items-center justify-between text-center px-1">
                    <span className="text-[11px] font-black text-slate-500 truncate">
                      ΑΡΧΙΚΟ ΚΟΣΤΟΣ (€)
                    </span>
                    <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-blue-600 text-base">
                      {formatNumber(numInitialCost)} €
                    </span>
                  </div>

                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      onClick={(e) => updateInitialCost(e, -1)}
                      className="w-9 h-9 shrink-0 flex items-center justify-center bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation shadow-sm"
                      title="Μείωση κατά 1 €"
                      aria-label="Μείωση αρχικού κόστους"
                    >
                      －
                    </button>

                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={3}
                      autoComplete="off"
                      id="input-initial-cost"
                      name="input-initial-cost"
                      value={initialCost}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 3);
                        setInitialCost(digits === '' ? '' : Number(digits));
                      }}
                      onBlur={() => {
                        if (!initialCost || initialCost < 1) setInitialCost(1);
                      }}
                      className="w-full min-w-0 max-w-full text-center font-mono font-black text-base sm:text-lg text-slate-800 border border-slate-300 rounded-xl py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />

                    <button
                      onClick={(e) => updateInitialCost(e, 1)}
                      className="w-9 h-9 shrink-0 flex items-center justify-center bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation shadow-sm"
                      title="Αύξηση κατά 1 €"
                      aria-label="Αύξηση αρχικού κόστους"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                {/* Νέο Πλήθος που Ζητάμε */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <div className="h-8 flex items-center justify-between text-center px-1">
                    <span className="text-[11px] font-black text-slate-500 truncate">
                      ΝΕΟ ΠΛΗΘΟΣ ΠΟΥ ΖΗΤΑΜΕ ({currentItem.item})
                    </span>
                    <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-emerald-600 text-base">
                      {formatNumber(numTargetQty)}
                    </span>
                  </div>

                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      onClick={(e) => updateTargetQty(e, -1)}
                      className="w-9 h-9 shrink-0 flex items-center justify-center bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation shadow-sm"
                      title="Μείωση κατά 1"
                      aria-label="Μείωση νέου πλήθους"
                    >
                      －
                    </button>

                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      autoComplete="off"
                      id="input-target-qty"
                      name="input-target-qty"
                      value={targetQty}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
                        setTargetQty(digits === '' ? '' : Number(digits));
                      }}
                      onBlur={() => {
                        if (!targetQty || targetQty < 1) setTargetQty(1);
                      }}
                      className="w-full min-w-0 max-w-full text-center font-mono font-black text-base sm:text-lg text-slate-800 border border-slate-300 rounded-xl py-1.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />

                    <button
                      onClick={(e) => updateTargetQty(e, 1)}
                      className="w-9 h-9 shrink-0 flex items-center justify-center bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation shadow-sm"
                      title="Αύξηση κατά 1"
                      aria-label="Αύξηση νέου πλήθους"
                    >
                      ＋
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-700 font-semibold bg-white p-3.5 rounded-xl border border-slate-200 leading-relaxed shadow-sm">
                📝 <strong>Διατύπωση:</strong> «Αν {currentItem.pluralAcc} <strong>{formatNumber(numInitialQty)} {currentItem.item}</strong> κοστίζουν <strong>{formatNumber(numInitialCost)} €</strong>, πόσο κοστίζουν {currentItem.pluralAcc} <strong>{formatNumber(numTargetQty)} {currentItem.item}</strong>;»
              </div>
            </div>

            {/* ΟΠΤΙΚΟΠΟΙΗΣΗ ΤΩΝ 2 ΒΗΜΑΤΩΝ ΛΥΣΗΣ */}
            <div className="bg-slate-950 text-white p-5 sm:p-7 rounded-3xl border border-slate-800 shadow-xl space-y-5">
              {/* ΒΗΜΑ 1: ΥΠΟΛΟΓΙΣΜΟΣ ΜΟΝΑΔΑΣ */}
              <div className="bg-slate-900 p-4 sm:p-5 rounded-2xl border border-blue-500/30 space-y-2 shadow-inner">
                <span className="text-xs font-black text-blue-400 tracking-wider block">
                  1️⃣ ΒΗΜΑ 1: Βρίσκουμε {currentItem.singleAcc}
                </span>
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm sm:text-base font-mono">
                  <span className="text-slate-300">
                    {formatNumber(numInitialCost)} € ： {formatNumber(numInitialQty)} ＝
                  </span>
                  <span className="text-blue-400 font-black text-lg sm:text-xl bg-blue-950/80 px-3 py-1 rounded-xl border border-blue-500/40">
                    {unitCost % 1 === 0 ? formatNumber(unitCost) : unitCost.toFixed(2)} €
                  </span>
                </div>
              </div>

              {/* ΒΗΜΑ 2: ΥΠΟΛΟΓΙΣΜΟΣ ΤΕΛΙΚΗΣ ΠΟΣΟΤΗΤΑΣ */}
              <div className="bg-slate-900 p-4 sm:p-5 rounded-2xl border border-emerald-500/30 space-y-2 shadow-inner">
                <span className="text-xs font-black text-emerald-400 tracking-wider block">
                  2️⃣ ΒΗΜΑ 2: Βρίσκουμε {currentItem.pluralAcc} {formatNumber(numTargetQty)} {currentItem.item}
                </span>
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm sm:text-base font-mono">
                  <span className="text-slate-300">
                    {formatNumber(numTargetQty)} · {unitCost % 1 === 0 ? formatNumber(unitCost) : unitCost.toFixed(2)} € ＝
                  </span>
                  <span className="text-emerald-400 font-black text-xl sm:text-2xl bg-emerald-950/80 px-3.5 py-1 rounded-xl border border-emerald-500/40">
                    {finalCost % 1 === 0 ? formatNumber(finalCost) : finalCost.toFixed(2)} €
                  </span>
                </div>
              </div>

              {/* ΤΕΛΙΚΟ ΣΥΜΠΕΡΑΣΜΑ */}
              <div className="bg-amber-400/10 p-4 rounded-2xl border border-amber-400/30 text-center">
                <p className="text-xs sm:text-sm font-bold text-amber-200">
                  🎉 <strong>Απάντηση:</strong> {currentItem.pluralNom} {formatNumber(numTargetQty)} {currentItem.item} κοστίζουν{' '}
                  <span className="text-white font-black text-base sm:text-lg">
                    {finalCost % 1 === 0 ? formatNumber(finalCost) : finalCost.toFixed(2)} €
                  </span>!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM EXERCISES CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
            <p className="text-slate-800 text-sm md:text-base">
              Έμαθες να λύνεις προβλήματα με τη μέθοδο της αναγωγής στη μονάδα; Δοκίμασε τις διαδραστικές ασκήσεις!
            </p>
          </div>
          <Link
            href="/d-dimotikou/23-anagogi-monada-ask"
            className="bg-slate-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            Ξεκίνα τις Ασκήσεις ➔
          </Link>
        </div>
      </div>
    </Layout>
  );
}
