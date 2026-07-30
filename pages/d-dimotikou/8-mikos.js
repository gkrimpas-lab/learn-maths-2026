import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// Συντελεστές μετατροπής ως προς το μέτρο (m)
const UNITS = {
  km: { name: 'Χιλιόμετρο', symbol: 'km', factorToMeter: 1000, color: 'bg-purple-500 text-purple-900 border-purple-300' },
  m:  { name: 'Μέτρο', symbol: 'm', factorToMeter: 1, color: 'bg-blue-500 text-blue-900 border-blue-300' },
  dm: { name: 'Δεκατόμετρο', symbol: 'dm', factorToMeter: 0.1, color: 'bg-teal-500 text-teal-900 border-teal-300' },
  cm: { name: 'Εκατοστόμετρο', symbol: 'cm', factorToMeter: 0.01, color: 'bg-amber-500 text-amber-900 border-amber-300' },
  mm: { name: 'Χιλιοστόμετρο', symbol: 'mm', factorToMeter: 0.001, color: 'bg-rose-500 text-rose-900 border-rose-300' }
};

function formatNumber(num) {
  if (Number.isInteger(num)) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  const parts = num.toFixed(3).replace(/\.?0+$/, "").split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return parts.join(',');
}

export default function MikosTheoryPage() {
  const [amount, setAmount] = useState(5);
  const [selectedUnit, setSelectedAmountUnit] = useState('m');

  // Υπολογισμός μέτρων
  const meters = amount * UNITS[selectedUnit].factorToMeter;

  // Μετατροπές σε όλες τις μονάδες
  const converted = {
    km: meters / UNITS.km.factorToMeter,
    m: meters,
    dm: meters / UNITS.dm.factorToMeter,
    cm: meters / UNITS.cm.factorToMeter,
    mm: meters / UNITS.mm.factorToMeter
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>📏 Μέτρηση Μήκους - LearnMaths.gr</title>
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
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-8 rounded-3xl shadow-md relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-3">
                <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                  Δ' ΔΗΜΟΤΙΚΟΥ • ΕΝΟΤΗΤΑ 8
                </span>
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
                  📏 Μέτρηση Μήκους & Μετατροπές
                </h1>
                <p className="text-blue-100 text-base lg:text-lg leading-relaxed">
                  Μαθαίνουμε τις μονάδες μέτρησης μήκους (χιλιόμετρο, μέτρο, δεκατόμετρο, εκατοστόμετρο, χιλιοστόμετρο) και πώς τις μετατρέπουμε!
                </p>
              </div>

              {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
                <div className="text-3xl">🚀</div>
                <h3 className="font-extrabold text-white text-lg">Έτοιμος για εξάσκηση;</h3>
                <p className="text-xs text-blue-100">Δοκίμασε τις ασκήσεις στις μετατροπές μήκους για να σιγουρευτείς ότι τις έμαθες!</p>
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
                <span>📖</span> Οι Μονάδες Μέτρησης Μήκους
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Βασική Μονάδα & Πολλαπλάσια */}
              <div className="bg-blue-50/70 p-6 rounded-2xl border border-blue-100 space-y-3">
                <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
                  <span>🏛️</span> Βασική Μονάδα & Χιλιόμετρο
                </h3>
                <ul className="space-y-2 text-sm md:text-base text-gray-700 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span><strong>Μέτρο (m):</strong> Η θεμελιώδης μονάδα μέτρησης μήκους.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span><strong>Χιλιόμετρο (km):</strong> Το χρησιμοποιούμε για μεγάλες αποστάσεις.
                      <span className="block font-mono font-black text-purple-900 mt-0.5">1 km = 1.000 m</span>
                    </span>
                  </li>
                </ul>
              </div>

              {/* Υποπολλαπλάσια */}
              <div className="bg-teal-50/70 p-6 rounded-2xl border border-teal-100 space-y-3">
                <h3 className="text-lg font-bold text-teal-900 flex items-center gap-2">
                  <span>✂️</span> Υποπολλαπλάσια του Μέτρου
                </h3>
                <p className="text-xs text-gray-600">
                  Μικρότερες μονάδες για τη μέτρηση μικρότερων αντικειμένων:
                </p>
                <ul className="space-y-1.5 text-xs md:text-sm text-gray-800 font-mono">
                  <li className="p-2 bg-white rounded-lg border border-teal-200">
                    <strong>1 Δεκατόμετρο (dm)</strong> = 0,1 m  (1 m = 10 dm)
                  </li>
                  <li className="p-2 bg-white rounded-lg border border-teal-200">
                    <strong>1 Εκατοστόμετρο (cm)</strong> = 0,01 m (1 m = 100 cm)
                  </li>
                  <li className="p-2 bg-white rounded-lg border border-teal-200">
                    <strong>1 Χιλιοστόμετρο (mm)</strong> = 0,001 m (1 m = 1.000 mm)
                  </li>
                </ul>
              </div>

            </div>

            {/* ΣΚΑΛΟΠΑΤΙΑ / ΚΛΙΜΑΚΑ ΜΕΤΑΤΡΟΠΩΝ */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
              <h3 className="text-lg font-extrabold text-gray-800">
                🪜 Πώς κάνουμε τις Μετατροπές; (Ο Κανόνας του 10)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                
                <div className="bg-white p-5 rounded-xl border border-gray-200 space-y-2">
                  <h4 className="font-bold text-emerald-700 border-b pb-1">⬇️ Από Μεγάλη σε Μικρότερη μονάδα:</h4>
                  <p className="text-gray-600">
                    <strong>Πολλαπλασιάζουμε</strong> με το $10$, $100$ ή $1.000$ σε κάθε βήμα.
                  </p>
                  <p className="font-mono font-bold text-gray-800 bg-emerald-50 p-2 rounded-lg text-center text-xs md:text-sm">
                    1 m = 10 dm = 100 cm = 1.000 mm
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 space-y-2">
                  <h4 className="font-bold text-indigo-700 border-b pb-1">⬆️ Από Μικρή σε Μεγαλύτερη μονάδα:</h4>
                  <p className="text-gray-600">
                    <strong>Διαιρούμε</strong> με το $10$, $100$ ή $1.000$ σε κάθε βήμα.
                  </p>
                  <p className="font-mono font-bold text-gray-800 bg-indigo-50 p-2 rounded-lg text-center text-xs md:text-sm">
                    1.000 mm = 100 cm = 10 dm = 1 m
                  </p>
                </div>

              </div>
            </div>

          </div>

          {/* ΔΙΑΔΡΑΣΤΙΚΟΣ ΜΕΤΑΤΡΟΠΕΑΣ - SECTION 2 */}
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4 border-gray-100">
              <div>
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <span>🧮</span> Διαδραστικός Μετατροπέας Μονάδων Μήκους
                </h2>
                <p className="text-gray-500 text-sm">
                  Επίλεξε τιμή και αρχική μονάδα για να δεις αυτόματα την ισοδυναμία σε όλες τις μονάδες!
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {Object.keys(UNITS).map((uKey) => (
                  <button
                    key={uKey}
                    onClick={() => setSelectedAmountUnit(uKey)}
                    className={`px-3 py-2 rounded-xl font-mono font-black text-xs md:text-sm border transition ${
                      selectedUnit === uKey
                        ? 'bg-indigo-600 text-white border-indigo-700 shadow-md scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'
                    }`}
                  >
                    {UNITS[uKey].symbol}
                  </button>
                ))}
              </div>
            </div>

            {/* INPUT / SLIDER ΧΕΙΡΙΣΜΟΥ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 items-center">
              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                  Τιμή Μήκους: <span className="text-indigo-600 font-mono text-lg font-black">{amount} {UNITS[selectedUnit].symbol}</span>
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="100" 
                  value={amount} 
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-3">
                <input 
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                  className="p-3 rounded-xl border border-gray-300 font-mono font-black text-lg text-center w-36 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <span className="font-mono font-black text-lg text-indigo-700">{UNITS[selectedUnit].name} ({UNITS[selectedUnit].symbol})</span>
              </div>
            </div>

            {/* ΠΡΟΒΟΛΗ ΟΛΩΝ ΤΩΝ ΜΕΤΑΤΡΟΠΩΝ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              
              {Object.keys(UNITS).map((uKey) => {
                const u = UNITS[uKey];
                const isCurrent = uKey === selectedUnit;

                return (
                  <div 
                    key={uKey}
                    className={`p-5 rounded-2xl border text-center space-y-2 transition-all ${
                      isCurrent 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xl scale-105' 
                        : 'bg-white text-gray-800 border-gray-200 shadow-sm'
                    }`}
                  >
                    <span className={`text-[10px] font-black uppercase tracking-wider block ${isCurrent ? 'text-amber-400' : 'text-gray-400'}`}>
                      {u.name}
                    </span>
                    <div className="text-xl md:text-2xl font-mono font-black tracking-tight">
                      {formatNumber(converted[uKey])}
                    </div>
                    <span className={`text-xs font-mono font-bold block ${isCurrent ? 'text-indigo-300' : 'text-indigo-600'}`}>
                      {u.symbol}
                    </span>
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
                Έμαθες τις μονάδες μέτρησης μήκους και τις μετατροπές τους; Δοκίμασε τις διαδραστικές ασκήσεις!
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
