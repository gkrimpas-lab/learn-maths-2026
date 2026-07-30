import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// Μονάδες μέτρησης και οι συντελεστές τους σε σχέση με το μέτρο (m)
const UNITS = {
  km: { name: 'Χιλιόμετρο', symbol: 'km', factor: 1000, desc: 'Μεγάλες αποστάσεις (δρόμοι, πόλεις)' },
  m: { name: 'Μέτρο', symbol: 'm', factor: 1, desc: 'Βασική μονάδα (ύψος, δωμάτιο)' },
  dm: { name: 'Δεκατόμετρο', symbol: 'dm', factor: 0.1, desc: '1/10 του μέτρου (χάρακας)' },
  cm: { name: 'Εκατοστόμετρο', symbol: 'cm', factor: 0.01, desc: '1/100 του μέτρου (τετράδιο)' },
  mm: { name: 'Χιλιοστόμετρο', symbol: 'mm', factor: 0.001, desc: '1/1000 του μέτρου (μικρά αντικείμενα)' }
};

function formatNum(num) {
  if (Number.isInteger(num)) return num.toLocaleString('el-GR');
  return Number(num.toFixed(3)).toString().replace('.', ',');
}

export default function MikosTheoryPage() {
  const [valInput, setValInput] = useState('2.5');
  const [baseUnit, setBaseUnit] = useState('m');

  const numericVal = parseFloat(valInput.replace(',', '.')) || 0;
  
  // Μετατροπή της τιμής εισαγωγής σε μέτρα (m)
  const valInMeters = numericVal * UNITS[baseUnit].factor;

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
        <title>📏 Μονάδες Μέτρησης Μήκους - LearnMaths.gr</title>
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
              <Link href="/d-dimotikou/8-mikos-ask" className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2">
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
          <div className="bg-gradient-to-r from-cyan-600 via-teal-600 to-indigo-600 text-white p-8 rounded-3xl shadow-md relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-3">
                <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                  Δ' ΔΗΜΟΤΙΚΟΥ
                </span>
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
                  📏 Μέτρηση Μήκους και Μετατροπές
                </h1>
                <p className="text-cyan-100 text-base lg:text-lg leading-relaxed">
                  Μαθαίνουμε το μέτρο, τα υποπολλαπλάσιά του (δεκατόμετρο, εκατοστόμετρο, χιλιοστόμετρο), το χιλιόμετρο και πώς μετατρέπουμε τη μία μονάδα στην άλλη!
                </p>
              </div>

              {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
                <div className="text-3xl">🚀</div>
                <h3 className="font-extrabold text-white text-lg">Έτοιμος για εξάσκηση;</h3>
                <p className="text-xs text-cyan-100">Δοκίμασε τις ασκήσεις στις μετατροπές μήκους για να σιγουρευτείς ότι τις έμαθες!</p>
                <Link 
                  href="/d-dimotikou/8-mikos-ask"
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
                <span>📖</span> Αναλυτική Θεωρία και Σχέσεις Μονάδων
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* 1. Πολλαπλάσιο */}
              <div className="bg-indigo-50/70 p-6 rounded-2xl border border-indigo-100 space-y-3">
                <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
                  <span>🚗</span> Πολλαπλάσιο του μέτρου (Χιλιόμετρο)
                </h3>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  Για να μετρήσουμε μεγάλες αποστάσεις χρησιμοποιούμε το <strong>Χιλιόμετρο (km)</strong>.
                </p>
                <div className="bg-white p-3 rounded-xl border border-indigo-100 text-xs font-mono font-bold text-indigo-900">
                  1 km = 1.000 m
                </div>
              </div>

              {/* 2. Βασική Μονάδα */}
              <div className="bg-cyan-50/70 p-6 rounded-2xl border border-cyan-100 space-y-3">
                <h3 className="text-lg font-bold text-cyan-900 flex items-center gap-2">
                  <span>📏</span> Βασική Μονάδα Μέτρησης (Μέτρο)
                </h3>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  Η θεμελιώδης μονάδα μέτρησης μήκους είναι το <strong>Μέτρο (m)</strong>.
                </p>
                <div className="bg-white p-3 rounded-xl border border-cyan-100 text-xs font-mono font-bold text-cyan-900">
                  1 m = 10 dm = 100 cm = 1.000 mm
                </div>
              </div>

              {/* 3. Υποπολλαπλάσια */}
              <div className="bg-teal-50/70 p-6 rounded-2xl border border-teal-100 space-y-3">
                <h3 className="text-lg font-bold text-teal-900 flex items-center gap-2">
                  <span>🔍</span> Υποπολλαπλάσια του Μέτρου
                </h3>
                <ul className="space-y-1 text-xs text-gray-700 font-mono">
                  <li>• <strong>1 dm (Δεκατόμετρο)</strong> = 1/10 m = 0,1 m</li>
                  <li>• <strong>1 cm (Εκατοστόμετρο)</strong> = 1/100 m = 0,01 m</li>
                  <li>• <strong>1 mm (Χιλιοστόμετρο)</strong> = 1/1000 m = 0,001 m</li>
                </ul>
              </div>

            </div>

            {/* ΣΚΑΛΑ ΜΕΤΑΤΡΟΠΩΝ */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
              <h3 className="text-lg font-extrabold text-gray-800 text-center md:text-left">
                🪜 Πώς κάνουμε μετατροπές;
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
                <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-1">
                  <span className="text-emerald-600 font-bold">⬇️ Από Μεγαλύτερη σε Μικρότερη μονάδα:</span>
                  <p className="text-gray-600">
                    <strong>Πολλαπλασιάζουμε</strong> (x 10, x 100, x 1000$).
                  </p>
                  <p className="font-mono text-xs text-gray-500">Π.χ. μέτρα σε εκατοστά: 3 m = 3 × 100 cm = 300 cm.</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-1">
                  <span className="text-amber-600 font-bold">⬆️ Από Μικρότερη σε Μεγαλύτερη μονάδα:</span>
                  <p className="text-gray-600">
                    <strong>Διαιρούμε</strong> (: 10, : 100, : 1000).
                  </p>
                  <p className="font-mono text-xs text-gray-500">Π.χ. εκατοστά σε μέτρα: 500 cm = 500 : 100 m = 5 m.</p>
                </div>
              </div>
            </div>

          </div>

          {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ - SECTION 2 */}
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4 border-gray-100">
              <div>
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <span>🧮</span> Διαδραστικός Μετατροπέας Μονάδων Μήκους
                </h2>
                <p className="text-gray-500 text-sm">
                  Γράψε μια τιμή, επίλεξε αρχική μονάδα και δες αμέσως τη μετατροπή σε όλες τις υπόλοιπες!
                </p>
              </div>

              <button
                onClick={handleRandomize}
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-black px-4 py-2.5 rounded-xl text-xs md:text-sm transition shadow-sm flex items-center gap-1.5"
              >
                <span>🎲</span> Τυχαία Τιμή
              </button>
            </div>

            {/* INPUTS / ΕΠΙΛΟΓΕΣ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                  Τιμη Μηκους:
                </label>
                <input 
                  type="text" 
                  value={valInput} 
                  onChange={(e) => setValInput(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-300 font-mono text-lg font-black focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  placeholder="π.χ. 2,5"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                  Αρχικη Μοναδα Μετρησης:
                </label>
                <select
                  value={baseUnit}
                  onChange={(e) => setBaseUnit(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-300 font-bold text-gray-800 bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none cursor-pointer"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {Object.keys(UNITS).map((uKey) => {
                const isSelected = uKey === baseUnit;
                const convertedValue = valInMeters / UNITS[uKey].factor;

                return (
                  <div 
                    key={uKey}
                    className={`p-5 rounded-2xl border text-center transition-all ${
                      isSelected 
                        ? 'bg-cyan-600 text-white border-cyan-700 shadow-lg scale-105' 
                        : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <span className={`text-[10px] font-black tracking-wider block ${isSelected ? 'text-cyan-200' : 'text-gray-400'}`}>
                      {UNITS[uKey].name}
                    </span>
                    
                    <div className="text-xl md:text-2xl font-mono font-black my-2 break-words">
                      {formatNum(convertedValue)} <span className="text-sm font-bold">{UNITS[uKey].symbol}</span>
                    </div>

                    <p className={`text-[11px] leading-tight ${isSelected ? 'text-cyan-100' : 'text-gray-500'}`}>
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
                Έμαθες τις μονάδες μήκους και τις μετατροπές; Δοκίμασε τις διαδραστικές ασκήσεις!
              </p>
            </div>
            <Link
              href="/d-dimotikou/8-mikos-ask"
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
