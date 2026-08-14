import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

function formatNumber(num) {
  if (num === '' || isNaN(num)) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export default function AnagogiMonadaPage() {
  // Έτοιμα σενάρια καθημερινότητας
  const presets = [
    { item: 'μολύβια', emoji: '✏️', initialQty: 4, initialCost: 8, targetQty: 7, unit: '€' },
    { item: 'σοκολάτες', emoji: '🍫', initialQty: 3, initialCost: 6, targetQty: 8, unit: '€' },
    { item: 'μπάλες', emoji: '⚽', initialQty: 5, initialCost: 25, targetQty: 3, unit: '€' },
    { item: 'βιβλία', emoji: '📚', initialQty: 2, initialCost: 18, targetQty: 5, unit: '€' }
  ];

  const [selectedPreset, setSelectedPreset] = useState(0);
  const [initialQty, setInitialQty] = useState(presets[0].initialQty);
  const [initialCost, setInitialCost] = useState(presets[0].initialCost);
  const [targetQty, setTargetQty] = useState(presets[0].targetQty);

  // Υπολογισμοί Αναγωγής στη Μονάδα
  const unitCost = initialQty > 0 ? (initialCost / initialQty) : 0;
  const finalCost = unitCost * targetQty;

  const handleSelectPreset = (index) => {
    setSelectedPreset(index);
    setInitialQty(presets[index].initialQty);
    setInitialCost(presets[index].initialCost);
    setTargetQty(presets[index].targetQty);
  };

  const currentItem = presets[selectedPreset];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🎯 Αναγωγή στη Μονάδα - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* NAVBAR */}
        <nav className="bg-white shadow-md w-full sticky top-0 z-50">
          <div className={`${LAYOUT.CONTAINER} py-4 flex justify-between items-center`}>
            <Link href="/d-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight">
              LearnMaths<span className="text-indigo-600">.gr</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/d-dimotikou/23-anagogi-monada-ask" className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2">
                <span>📝</span> Ασκήσεις
              </Link>
              <Link href="/d-dimotikou" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-bold transition shadow-sm">
                🔙 Επιστροφή
              </Link>
            </div>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-10 space-y-8`}>
          
          {/* HEADER & EXERCISES PROMO CARD */}
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white p-8 rounded-3xl shadow-md relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-3">
                <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                  Δ' ΔΗΜΟΤΙΚΟΥ • ΕΝΟΤΗΤΑ 23
                </span>
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
                  🎯 Η Μέθοδος της Αναγωγής στη Μονάδα
                </h1>
                <p className="text-amber-100 text-base lg:text-lg leading-relaxed">
                  Μαθαίνουμε πώς να λύνουμε προβλήματα με **2 απλά βήματα**: βρίσκουμε πρώτα πόσο κοστίζει **το 1** και μετά υπολογίζουμε πόσο κοστίζουν **τα πολλά**!
                </p>
              </div>

              {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
                <div className="text-3xl">🚀</div>
                <h3 className="font-extrabold text-white text-lg">Έτοιμος για εξάσκηση;</h3>
                <p className="text-xs text-amber-100">Δοκίμασε τις διαδραστικές ασκήσεις στην αναγωγή στη μονάδα!</p>
                <Link 
                  href="/d-dimotikou/23-anagogi-monada-ask"
                  className="inline-block w-full bg-white hover:bg-amber-50 text-gray-900 font-black py-3 px-4 rounded-xl shadow-md transition transform hover:-translate-y-0.5 text-sm"
                >
                  🎯 Μετάβαση στις Ασκήσεις
                </Link>
              </div>
            </div>
          </div>

          {/* ΘΕΩΡΙΑ - ΤΑ 2 ΧΡΥΣΑ ΒΗΜΑΤΑ */}
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 space-y-8">
            <div className="border-b pb-4 border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <span>📖</span> Τα 2 Βήματα της Αναγωγής στη Μονάδα
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* 1. ΒΗΜΑ 1: ΔΙΑΙΡΕΣΗ */}
              <div className="bg-blue-50/80 p-6 rounded-2xl border border-blue-100 space-y-3">
                <div className="bg-blue-600 text-white font-black text-xs px-3 py-1 rounded-full w-fit flex items-center gap-1.5">
                  <span>1️⃣</span> ΒΗΜΑ 1ο • ΔΙΑΙΡΕΣΗ ( : )
                </div>
                <h3 className="text-lg font-bold text-blue-950">
                  Βρίσκουμε το 1 (τη μονάδα)
                </h3>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  <strong>Διαιρούμε</strong> τη συνολική αξία με το πλήθος των πραγμάτων για να βρούμε πόσο κοστίζει <strong>το 1 πράγμα (η μονάδα)</strong>.
                </p>
                <div className="bg-white p-3 rounded-xl border border-blue-200 text-xs font-mono font-bold text-blue-800 text-center shadow-sm">
                  Τιμή για το 1 = Συνολικό Κόστος : Πλήθος
                </div>
              </div>

              {/* 2. ΒΗΜΑ 2: ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ */}
              <div className="bg-emerald-50/80 p-6 rounded-2xl border border-emerald-100 space-y-3">
                <div className="bg-emerald-600 text-white font-black text-xs px-3 py-1 rounded-full w-fit flex items-center gap-1.5">
                  <span>2️⃣</span> ΒΗΜΑ 2ο • ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ ( × )
                </div>
                <h3 className="text-lg font-bold text-emerald-950">
                  Βρίσκουμε τα πολλά που ζητάει το πρόβλημα
                </h3>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  <strong>Πολλαπλασιάζουμε</strong> την τιμή του ενός πράγματος με το νέο πλήθος που θέλουμε να αγοράσουμε ή να υπολογίσουμε.
                </p>
                <div className="bg-white p-3 rounded-xl border border-emerald-200 text-xs font-mono font-bold text-emerald-800 text-center shadow-sm">
                  Νέο Κόστος = Τιμή του 1 × Νέο Πλήθος
                </div>
              </div>

            </div>

            {/* ΠΑΡΑΔΕΙΓΜΑ ΚΑΤΑΝΟΗΣΗΣ */}
            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 space-y-3">
              <h4 className="font-extrabold text-amber-950 text-base flex items-center gap-2">
                <span>💡</span> Παράδειγμα:
              </h4>
              <p className="text-xs md:text-sm text-gray-800 leading-relaxed">
                «Αν τα <strong>3 τετράδια</strong> κοστίζουν <strong>6 €</strong>, πόσο κοστίζουν τα <strong>5 τετράδια</strong>;»
              </p>
              <ul className="text-xs md:text-sm space-y-1.5 pl-2 font-medium text-gray-800">
                <li>• <strong>Βήμα 1:</strong> Βρίσκουμε πόσο κοστίζει το 1 τετράδιο → 6 : 3 = <strong className="text-blue-700 font-bold">2 €</strong>.</li>
                <li>• <strong>Βήμα 2:</strong> Βρίσκουμε πόσο κοστίζουν τα 5 τετράδια → 5 × 2 = <strong className="text-emerald-700 font-bold">10 €</strong>.</li>
              </ul>
            </div>
          </div>

          {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ - SECTION 2 */}
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4 border-gray-100">
              <div>
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <span>🧮</span> Διαδραστικό Εργαστήριο Αναγωγής στη Μονάδα
                </h2>
                <p className="text-gray-500 text-sm">
                  Επίλεξε ένα παράδειγμα ή άλλαξε τα νούμερα για να δεις τη λύση βήμα προς βήμα!
                </p>
              </div>

              {/* ΚΟΥΜΠΙΑ ΠΡΟΕΠΙΛΟΓΩΝ */}
              <div className="flex flex-wrap gap-2">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectPreset(idx)}
                    className={`px-3 py-2 rounded-xl text-xs md:text-sm font-black transition ${
                      selectedPreset === idx 
                        ? 'bg-amber-500 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {p.emoji} {p.item}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              
              {/* ΧΕΙΡΙΣΤΗΡΙΑ & ΣΤΟΙΧΕΙΑ ΠΡΟΒΛΗΜΑΤΟΣ */}
              <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200 space-y-5">
                <h3 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
                  <span>⚙️</span> Στοιχεία Προβλήματος:
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black uppercase text-gray-600 mb-1">
                      Αρχικό Πλήθος ({currentItem.item}):
                    </label>
                    <input 
                      type="number"
                      min="1"
                      max="50"
                      value={initialQty}
                      onChange={(e) => setInitialQty(Math.max(1, Number(e.target.value)))}
                      className="w-full p-3 rounded-xl border border-gray-300 font-mono font-bold text-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-gray-600 mb-1">
                      Αρχικό Κόστος (€):
                    </label>
                    <input 
                      type="number"
                      min="1"
                      max="500"
                      value={initialCost}
                      onChange={(e) => setInitialCost(Math.max(1, Number(e.target.value)))}
                      className="w-full p-3 rounded-xl border border-gray-300 font-mono font-bold text-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-gray-600 mb-1">
                      Νέο Πλήθος που ζητάμε ({currentItem.item}):
                    </label>
                    <input 
                      type="number"
                      min="1"
                      max="50"
                      value={targetQty}
                      onChange={(e) => setTargetQty(Math.max(1, Number(e.target.value)))}
                      className="w-full p-3 rounded-xl border border-gray-300 font-mono font-bold text-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <p className="text-xs text-slate-500 font-bold bg-white p-3 rounded-xl border border-slate-200 text-center">
                  📝 Πρόβλημα: «Αν τα <strong>{initialQty} {currentItem.item}</strong> κοστίζουν <strong>{initialCost} €</strong>, πόσο κοστίζουν τα <strong>{targetQty} {currentItem.item}</strong>;»
                </p>
              </div>

              {/* ΟΠΤΙΚΟΠΟΙΗΣΗ ΤΩΝ 2 ΒΗΜΑΤΩΝ ΛΥΣΗΣ */}
              <div className="bg-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl space-y-6">
                
                {/* ΒΗΜΑ 1: ΥΠΟΛΟΓΙΣΜΟΣ ΜΟΝΑΔΑΣ */}
                <div className="bg-slate-800/90 p-4 md:p-5 rounded-2xl border border-blue-500/30 space-y-2">
                  <span className="text-[11px] font-black uppercase text-blue-400 tracking-wider block">
                    1️⃣ ΒΗΜΑ 1: Βρίσκουμε το 1 {currentItem.item.slice(0, -1)}
                  </span>
                  <div className="flex items-center justify-between text-base md:text-lg font-mono">
                    <span className="text-slate-300">{initialCost} € : {initialQty} =</span>
                    <span className="text-blue-400 font-black text-xl bg-blue-950/80 px-3 py-1 rounded-xl border border-blue-500/40">
                      {unitCost % 1 === 0 ? unitCost : unitCost.toFixed(2)} €
                    </span>
                  </div>
                </div>

                {/* ΒΗΜΑ 2: ΥΠΟΛΟΓΙΣΜΟΣ ΤΕΛΙΚΗΣ ΠΟΣΟΤΗΤΑΣ */}
                <div className="bg-slate-800/90 p-4 md:p-5 rounded-2xl border border-emerald-500/30 space-y-2">
                  <span className="text-[11px] font-black uppercase text-emerald-400 tracking-wider block">
                    2️⃣ ΒΗΜΑ 2: Βρίσκουμε τα {targetQty} {currentItem.item}
                  </span>
                  <div className="flex items-center justify-between text-base md:text-lg font-mono">
                    <span className="text-slate-300">{targetQty} × {(unitCost % 1 === 0 ? unitCost : unitCost.toFixed(2))} € =</span>
                    <span className="text-emerald-400 font-black text-2xl bg-emerald-950/80 px-4 py-1.5 rounded-xl border border-emerald-500/40">
                      {finalCost % 1 === 0 ? finalCost : finalCost.toFixed(2)} €
                    </span>
                  </div>
                </div>

                {/* ΤΕΛΙΚΟ ΣΥΜΠΕΡΑΣΜΑ */}
                <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 p-4 rounded-2xl border border-amber-400/30 text-center">
                  <p className="text-xs md:text-sm font-bold text-amber-200">
                    🎉 Απάντηση: Τα {targetQty} {currentItem.item} κοστίζουν <span className="text-white font-black text-base">{finalCost % 1 === 0 ? finalCost : finalCost.toFixed(2)} €</span>!
                  </p>
                </div>

              </div>

            </div>
          </div>

          {/* BOTTOM EXERCISES CALLOUT BANNER */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
              <p className="text-gray-800 text-sm md:text-base">
                Έμαθες να λύνεις προβλήματα με τη μέθοδο της αναγωγής στη μονάδα; Δοκίμασε τις διαδραστικές ασκήσεις!
              </p>
            </div>
            <Link
              href="/d-dimotikou/23-anagogi-monada-ask"
              className="bg-gray-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
            >
              Ξεκίνα τις Ασκήσεις ➔
            </Link>
          </div>

        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© {new Date().getFullYear()} LearnMaths.gr. Σχεδιασμένο για τη Δ' Δημοτικού.</p>
      </footer>
    </div>
  );
}
