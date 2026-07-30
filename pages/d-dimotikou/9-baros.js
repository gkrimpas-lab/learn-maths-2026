import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// Μονάδες μέτρησης βάρους και οι συντελεστές τους σε σχέση με το Κιλό (kg)
const UNITS = {
  t: { name: 'Τόνος', symbol: 't', factor: 1000, desc: 'Πολύ μεγάλο βάρος (ελέφαντας, φορτηγό)' },
  kg: { name: 'Κιλό (Χιλιόγραμμο)', symbol: 'kg', factor: 1, desc: 'Βασική μονάδα (βάρος σώματος, φρούτα)' },
  g: { name: 'Γραμμάριο', symbol: 'g', factor: 0.001, desc: 'Μικρό βάρος (σοκολάτα, χρυσός, μπαχαρικά)' }
};

function formatNum(num) {
  if (Number.isInteger(num)) return num.toLocaleString('el-GR');
  return Number(num.toFixed(3)).toString().replace('.', ',');
}

export default function BarosTheoryPage() {
  const [valInput, setValInput] = useState('3.5');
  const [baseUnit, setBaseUnit] = useState('kg');

  const numericVal = parseFloat(valInput.replace(',', '.')) || 0;
  
  // Μετατροπή της τιμής εισαγωγής σε κιλά (kg)
  const valInKg = numericVal * UNITS[baseUnit].factor;

  const handleRandomize = () => {
    const unitsKeys = Object.keys(UNITS);
    const randomUnit = unitsKeys[Math.floor(Math.random() * unitsKeys.length)];
    const randomVal = (Math.random() * 50 + 1).toFixed(1);
    setBaseUnit(randomUnit);
    setValInput(randomVal.replace('.', ','));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>⚖️ Μονάδες Μέτρησης Βάρους - LearnMaths.gr</title>
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
              <Link href="/d-dimotikou/9-baros-ask" className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2">
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
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white p-8 rounded-3xl shadow-md relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-3">
                <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                  Δ' ΔΗΜΟΤΙΚΟΥ • ΕΝΟΤΗΤΑ 9
                </span>
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
                  ⚖️ Μέτρηση Βάρους & Μετατροπές
                </h1>
                <p className="text-emerald-100 text-base lg:text-lg leading-relaxed">
                  Μαθαίνουμε το κιλό (kg), το γραμμάριο (g), τον τόνο (t) και πώς μετατρέπουμε εύκολα τη μία μονάδα στην άλλη!
                </p>
              </div>

              {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
                <div className="text-3xl">🚀</div>
                <h3 className="font-extrabold text-white text-lg">Έτοιμος για εξάσκηση;</h3>
                <p className="text-xs text-emerald-100">Δοκίμασε τις ασκήσεις στις μετατροπές βάρους για να σιγουρευτείς ότι τις έμαθες!</p>
                <Link 
                  href="/d-dimotikou/9-baros-ask"
                  className="inline-block w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-black py-3 px-4 rounded-xl shadow-md transition transform hover:-translate-y-0.5 text-sm"
                >
                  🎯 Μετάβαση στις Ασκήσεις
                </Link>
              </div>
            </div>
          </div>

          {/* ΘΕΩΡΙΑ - SECTION 1 */}
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 space-y-8">
            <div className="border-b pb-4 border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <span>📖</span> Αναλυτική Θεωρία & Σχέσεις Μονάδων
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* 1. Πολλαπλάσιο */}
              <div className="bg-sky-50/70 p-6 rounded-2xl border border-sky-100 space-y-3">
                <h3 className="text-lg font-bold text-sky-900 flex items-center gap-2">
                  <span>🐘</span> Πολλαπλάσιο (Τόνος)
                </h3>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  Για να μετρήσουμε πολύ μεγάλα βάρη χρησιμοποιούμε τον <strong>Τόνο (t)</strong>.
                </p>
                <div className="bg-white p-3 rounded-xl border border-sky-100 text-xs font-mono font-bold text-sky-900">
                  1 t = 1.000 kg
                </div>
              </div>

              {/* 2. Βασική Μονάδα */}
              <div className="bg-emerald-50/70 p-6 rounded-2xl border border-emerald-100 space-y-3">
                <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
                  <span>⚖️</span> Βασική Μονάδα (Κιλό)
                </h3>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  Η βασική μονάδα μέτρησης βάρους στην καθημερινή ζωή είναι το <strong>Κιλό ή Χιλιόγραμμο (kg)</strong>.
                </p>
                <div className="bg-white p-3 rounded-xl border border-emerald-100 text-xs font-mono font-bold text-emerald-900">
                  1 kg = 1.000 g
                </div>
              </div>

              {/* 3. Υποπολλαπλάσιο */}
              <div className="bg-amber-50/70 p-6 rounded-2xl border border-amber-100 space-y-3">
                <h3 className="text-lg font-bold text-amber-900 flex items-center gap-2">
                  <span>🍫</span> Υποπολλαπλάσιο (Γραμμάριο)
                </h3>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  Για μικρά βάρη χρησιμοποιούμε το <strong>Γραμμάριο (g)</strong>.
                </p>
                <div className="bg-white p-3 rounded-xl border border-amber-100 text-xs font-mono font-bold text-amber-900">
                  1 g = 1/1000 kg = 0,001 kg
                </div>
              </div>

            </div>

            {/* ΣΚΑΛΑ ΜΕΤΑΤΡΟΠΩΝ */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
              <h3 className="text-lg font-extrabold text-gray-800 text-center md:text-left">
                🪜 Πώς κάνουμε μετατροπές στο Βάρος; (Ο κανόνας του 1.000)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
                <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-1">
                  <span className="text-emerald-600 font-bold">⬇️ Από Μεγαλύτερη σε Μικρότερη μονάδα:</span>
                  <p className="text-gray-600">
                    <strong>Πολλαπλασιάζουμε με το 1.000</strong> ($\times 1.000$).
                  </p>
                  <p className="font-mono text-xs text-gray-500">Π.χ. 2 kg ➔ g: 2 × 1.000 = 2.000 g.</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-1">
                  <span className="text-sky-600 font-bold">⬆️ Από Μικρότερη σε Μεγαλύτερη μονάδα:</span>
                  <p className="text-gray-600">
                    <strong>Διαιρούμε με το 1.000</strong> ($: 1.000$).
                  </p>
                  <p className="font-mono text-xs text-gray-500">Π.χ. 5.000 g ➔ kg: 5.000 : 1.000 = 5 kg.</p>
                </div>
              </div>
            </div>

          </div>

          {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ - SECTION 2 */}
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4 border-gray-100">
              <div>
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <span>🧮</span> Διαδραστικός Μετατροπέας Μονάδων Βάρους
                </h2>
                <p className="text-gray-500 text-sm">
                  Γράψε μια τιμή, επίλεξε αρχική μονάδα και δες αμέσως τη μετατροπή σε όλες τις υπόλοιπες!
                </p>
              </div>

              <button
                onClick={handleRandomize}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-4 py-2.5 rounded-xl text-xs md:text-sm transition shadow-sm flex items-center gap-1.5"
              >
                <span>🎲</span> Τυχαία Τιμή
              </button>
            </div>

            {/* INPUTS / ΕΠΙΛΟΓΕΣ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                  Τιμή Βάρους:
                </label>
                <input 
                  type="text" 
                  value={valInput} 
                  onChange={(e) => setValInput(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-300 font-mono text-lg font-black focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="π.χ. 3,5"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                  Αρχική Μονάδα Μέτρησης:
                </label>
                <select
                  value={baseUnit}
                  onChange={(e) => setBaseUnit(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-300 font-bold text-gray-800 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                >
                  {Object.keys(UNITS).map((uKey) => (
                    <option key={uKey} value={uKey}>
                      {UNITS[uKey].name} ({UNITS[uKey].symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ΠΙΝΑΚΑΣ ΑΥΤΟΜΑΤΩΝ ΜΕΤΑΤΡΟΠΩΝ */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Object.keys(UNITS).map((uKey) => {
                const isSelected = uKey === baseUnit;
                const convertedValue = valInKg / UNITS[uKey].factor;

                return (
                  <div 
                    key={uKey}
                    className={`p-6 rounded-2xl border text-center transition-all ${
                      isSelected 
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-lg scale-105' 
                        : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <span className={`text-[10px] font-black uppercase tracking-wider block ${isSelected ? 'text-emerald-200' : 'text-gray-400'}`}>
                      {UNITS[uKey].name}
                    </span>
                    
                    <div className="text-2xl md:text-3xl font-mono font-black my-3 break-words">
                      {formatNum(convertedValue)} <span className="text-base font-bold">{UNITS[uKey].symbol}</span>
                    </div>

                    <p className={`text-xs leading-tight ${isSelected ? 'text-emerald-100' : 'text-gray-500'}`}>
                      {UNITS[uKey].desc}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>

          {/* BOTTOM EXERCISES CALLOUT BANNER */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
              <p className="text-gray-800 text-sm md:text-base">
                Έμαθες τις μονάδες βάρους και τις μετατροπές; Δοκίμασε τις διαδραστικές ασκήσεις!
              </p>
            </div>
            <Link
              href="/d-dimotikou/9-baros-ask"
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
