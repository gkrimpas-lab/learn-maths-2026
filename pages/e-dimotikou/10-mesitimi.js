// pages/e-dimotikou/10-mesi-timi.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

const LIMITS = {
  VAL_MIN: 1,
  VAL_MAX: 10
};

export default function MesiTimiPage() {
  // Πλήθος ομάδων/στηλών (από 2 έως 6)
  const [count, setCount] = useState(4);

  // Αρχικές τιμές για έως και 6 ομάδες
  const [omades, setOmades] = useState([8, 4, 9, 3, 5, 7]);

  // Επιλογή των ενεργών τιμών βάσει του count
  const activeValues = omades.slice(0, count);

  // Υπολογισμοί
  const sum = activeValues.reduce((acc, curr) => acc + curr, 0);
  const average = count > 0 ? (sum / count).toFixed(1) : 0;
  
  // Μετατροπή σε float για το ύψος της κόκκινης γραμμής
  const avgFloat = parseFloat(average);

  // Ενημέρωση της τιμής μιας ομάδας
  const updateValue = (index, operation) => {
    const updated = [...omades];
    if (operation === 'plus') {
      updated[index] = Math.min(LIMITS.VAL_MAX, updated[index] + 1);
    } else {
      updated[index] = Math.max(LIMITS.VAL_MIN, updated[index] - 1);
    }
    setOmades(updated);
  };

  // Ονόματα ομάδων για την οθόνη
  const labels = ['Ομάδα Α', 'Ομάδα Β', 'Ομάδα C', 'Ομάδα D', 'Ομάδα E', 'Ομάδα F'];
  const shortLabels = ['Ομ. Α', 'Ομ. Β', 'Ομ. C', 'Ομ. D', 'Ομ. E', 'Ομ. F'];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>📊 Μέση Τιμή (Μέσος Όρος) - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* NAVBAR */}
        <nav className="bg-white shadow-md w-full">
          <div className={`${LAYOUT.CONTAINER} py-4 flex justify-between items-center`}>
            <Link href="/e-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight">
              LearnMaths<span className="text-indigo-600">.gr</span>
            </Link>
            <Link href="/e-dimotikou" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-sm">
              🔙 Επιστροφή
            </Link>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-12 space-y-8`}>
          
          {/* ΘΕΩΡΙΑ - Ακριβώς το κείμενο από την εικόνα_6 */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-3">
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              📊 Μέση Τιμή (Μέσος Όρος)
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              Μέση τιμή είναι ο αριθμός που προκύπτει αν προσθέσουμε όλες τις ποσότητες και <strong className="text-slate-900">μοιράσουμε το άθροισμα εξίσου</strong> (δίκαια) στον ίδιο αριθμό ομάδων.
            </p>
          </div>

          {/* ΡΥΘΜΙΣΗ ΠΛΗΘΟΥΣ ΟΜΑΔΩΝ (2 έως 6) */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <span className="text-xs uppercase font-black text-gray-400 tracking-wider">Πόσες ομάδες θέλεις να μοιράσεις;</span>
            <div className="inline-flex p-1.5 bg-slate-200 rounded-2xl shadow-inner gap-1">
              {[2, 3, 4, 5, 6].map((n) => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm transition shadow-sm ${count === n ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-300'}`}
                >
                  {n} Ομάδες
                </button>
              ))}
            </div>
          </div>

          {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8">
            
            {/* ΧΕΙΡΙΣΤΗΡΙΑ ΥΨΟΥΣ ΟΜΑΔΩΝ - Ξεκάθαρα αυτόνομα Cards */}
            <div className="space-y-2">
              <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider block px-1">
                Άλλαξε το ύψος των {count} ομάδων:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {activeValues.map((val, index) => (
                  <div key={index} className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200 flex flex-col items-center space-y-2 text-center animate-fade-in">
                    <span className="font-bold text-slate-700 text-xs">{labels[index]}</span>
                    <div className="flex items-center bg-white p-1 px-2 rounded-xl border gap-2 shadow-inner">
                      <button onClick={() => updateValue(index, 'minus')} className="bg-slate-100 text-slate-700 w-6 h-6 rounded-md font-black hover:bg-slate-200 transition">-</button>
                      <span className="w-6 text-center font-black text-base text-blue-600">{val}</span>
                      <button onClick={() => updateValue(index, 'plus')} className="bg-slate-100 text-slate-700 w-6 h-6 rounded-md font-black hover:bg-slate-200 transition">+</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ΓΡΑΦΙΚΗ ΙΣΟΡΡΟΠΙΑ ΣΤΗΛΩΝ - ΔΙΑΓΡΑΜΜΑ */}
            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-200 space-y-4">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider text-center flex items-center justify-center gap-1">
                📈 Γραφική Ισορροπία Στηλών (Η Δίκαιη Μοιρασιά)
              </h3>

              {/* Χώρος Διαγράμματος */}
              <div className="relative w-full max-w-3xl h-64 mx-auto border-b border-gray-300 flex items-end justify-around px-4 pt-8">
                
                {/* ΔΥΝΑΜΙΚΗ ΚΟΚΚΙΝΗ ΓΡΑΜΜΗ ΜΕΣΟΥ ΟΡΟΥ */}
                <div 
                  className="absolute left-0 right-0 border-t-2 border-dashed border-rose-500 z-10 transition-all duration-300 flex justify-end"
                  style={{ bottom: `${avgFloat * 10}%` }}
                >
                  <span className="bg-rose-500 text-white font-black text-[10px] p-0.5 px-2 rounded-md shadow-sm -mt-3.5 mr-2 whitespace-nowrap">
                    Μέση Τιμή: {average.replace('.0', '')}
                  </span>
                </div>

                {/* Δυναμικές Μπάρες (Τουβλάκια) */}
                {activeValues.map((val, index) => (
                  <div key={index} className="flex flex-col items-center space-y-2 w-12 sm:w-16 z-0 animate-fade-in">
                    <span className="font-black text-xs text-gray-700">{val}</span>
                    <div 
                      className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-lg transition-all duration-300 shadow-sm"
                      style={{ height: `${val * 20}px` }}
                    ></div>
                    <span className="text-[11px] font-bold text-gray-400 whitespace-nowrap">{shortLabels[index]}</span>
                  </div>
                ))}

              </div>
            </div>

            {/* ΒΗΜΑΤΑ ΕΠΙΛΥΣΗΣ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Βήμα 1 */}
              <div className="bg-blue-50/60 p-5 rounded-2xl border border-blue-100 flex items-center gap-4 shadow-sm">
                <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-black shrink-0 text-base shadow-sm">1</div>
                <div className="space-y-0.5">
                  <span className="text-[11px] font-black text-blue-700 uppercase tracking-wider block">Βήμα 1: Βρίσκω το συνολικό άθροισμα</span>
                  <div className="font-black text-slate-800 text-base">
                    {activeValues.join(' + ')} = <span className="text-blue-600 font-extrabold text-lg">{sum}</span>
                  </div>
                </div>
              </div>

              {/* Βήμα 2 */}
              <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-100 flex items-center gap-4 shadow-sm">
                <div className="bg-emerald-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-black shrink-0 text-base shadow-sm">2</div>
                <div className="space-y-0.5">
                  <span className="text-[11px] font-black text-emerald-700 uppercase tracking-wider block">Βήμα 2: Διαιρώ με το πλήθος των ομάδων ({count})</span>
                  <div className="font-black text-slate-800 text-base">
                    {sum} ÷ {count} = <span className="text-emerald-600 font-extrabold text-lg">{average.replace('.0', '')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ΤΕΛΙΚΟ ΣΥΜΠΕΡΑΣΜΑ */}
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-5 rounded-2xl text-center font-black text-sm md:text-base shadow-md max-w-xl mx-auto transform hover:scale-[1.01] transition duration-200">
              📢 Αν μοιράζαμε δίκαια τα τουβλάκια, κάθε ομάδα θα είχε ακριβώς: <span className="text-yellow-200 text-xl font-extrabold ml-1">{average.replace('.0', '')}</span>
            </div>

          </div>

        </main>
      </div>

      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Οπτικοποίηση Μέσου Όρου.</p>
      </footer>
    </div>
  );
}
