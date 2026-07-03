// pages/e-dimotikou/10-mesi-timi.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function MesiTimiPage() {
  // Αρχικοί βαθμοί/τιμές ενός μαθητή (π.χ. 3 μαθήματα)
  const [values, setValues] = useState([9, 10, 8]);

  // Υπολογισμός αθροίσματος
  const sum = values.reduce((acc, curr) => acc + curr, 0);
  
  // Υπολογισμός Μέσης Τιμής
  const average = values.length > 0 ? (sum / values.length).toFixed(1) : 0;

  // Προσθήκη νέας τιμής (μέχρι 6 το πολύ για να μην κρύβεται η οθόνη)
  const addValue = () => {
    if (values.length < 6) {
      setValues([...values, 10]);
    }
  };

  // Αφαίρεση της τελευταίας τιμής (τουλάχιστον 2 τιμές για να βγαίνει μέσος όρος)
  const removeValue = () => {
    if (values.length > 2) {
      setValues(values.slice(0, -1));
    }
  };

  // Ενημέρωση συγκεκριμένης τιμής από τα inputs
  const updateValue = (index, newVal) => {
    const updated = [...values];
    const parsed = parseInt(newVal);
    updated[index] = isNaN(parsed) ? 0 : Math.max(0, Math.min(10, parsed));
    setValues(updated);
  };

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
          
          {/* ΘΕΩΡΙΑ */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-3xl font-black text-gray-900 2xl:text-4xl">📊 Μέση Τιμή (Μέσος Όρος)</h2>
            <p className="text-gray-600 leading-relaxed text-base xl:text-lg">
              Για να βρούμε τη <strong>Μέση Τιμή</strong> (τον Μέσο Όρο) μιας ομάδας αριθμών, κάνουμε δύο απλά βήματα:
            </p>
            <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 text-sm xl:text-base text-blue-900 space-y-2">
              <p>➕ <strong>Βήμα 1ο:</strong> Προσθέτουμε όλους τους αριθμούς μαζί για να βρούμε το <strong>Άθροισμα</strong>.</p>
              <p>➗ <strong>Βήμα 2ο:</strong> Διαιρούμε το άθροισμα αυτό με το <strong>πλήθος</strong> των αριθμών.</p>
            </div>
          </div>

          {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-200 space-y-8">
            
            {/* ΔΙΑΧΕΙΡΙΣΗ ΠΛΗΘΟΥΣ ΣΤΟΙΧΕΙΩΝ */}
            <div className="flex flex-col sm:flex-row items-center justify-between max-w-2xl mx-auto bg-white p-4 rounded-xl border gap-4 shadow-sm">
              <span className="font-bold text-gray-600 text-sm">Πλήθος αριθμών/μαθημάτων:</span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={removeValue} 
                  disabled={values.length <= 2}
                  className="bg-red-100 text-red-700 font-bold px-4 py-2 rounded-xl text-xs hover:bg-red-200 disabled:opacity-40 transition"
                >
                  ❌ Αφαίρεση Αριθμού
                </button>
                <span className="font-black text-lg text-slate-800 bg-slate-100 px-3 py-1 rounded-lg">
                  {values.length}
                </span>
                <button 
                  onClick={addValue} 
                  disabled={values.length >= 6}
                  className="bg-green-600 text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-green-700 disabled:opacity-40 transition"
                >
                  ➕ Προσθήκη Αριθμού
                </button>
              </div>
            </div>

            {/* ΕΙΣΑΓΩΓΗ ΤΙΜΩΝ (INPUT CARDS) */}
            <div className="space-y-4 max-w-4xl mx-auto">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider text-center">Γράψε τους αριθμούς σου (από 0 έως 10):</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 justify-center">
                {values.map((val, index) => (
                  <div key={index} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center space-y-2 text-center">
                    <span className="font-bold text-gray-400 text-xs uppercase">{index + 1}ος Αριθμός</span>
                    <input 
                      type="number" 
                      min="0" 
                      max="10"
                      value={val} 
                      onChange={(e) => updateValue(index, e.target.value)}
                      className="w-16 text-center font-black text-xl text-blue-600 bg-blue-50/50 border border-blue-100 p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* ΜΑΘΗΜΑΤΙΚΗ ΑΝΑΛΥΣΗ ΚΑΙ ΦΟΡΜΟΥΛΑ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto pt-4">
              
              {/* Βήμα 1: Άθροισμα */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-xs uppercase font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full tracking-wider">Βήμα 1ο: Πρόσθεση</span>
                  <h4 className="font-bold text-slate-700 text-sm mt-3">Βρίσκουμε το συνολικό Άθροισμα:</h4>
                </div>
                <div className="bg-blue-50/40 p-4 rounded-xl border border-blue-100 font-black text-lg text-slate-800 text-center">
                  {values.join(' + ')} = <span className="text-blue-600 text-2xl ml-1">{sum}</span>
                </div>
              </div>

              {/* Βήμα 2: Διαίρεση */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-xs uppercase font-black text-purple-600 bg-purple-50 px-3 py-1 rounded-full tracking-wider">Βήμα 2ο: Διαίρεση</span>
                  <h4 className="font-bold text-slate-700 text-sm mt-3">Διαιρούμε με το πλήθος των αριθμών ({values.length}):</h4>
                </div>
                <div className="bg-purple-50/40 p-4 rounded-xl border border-purple-100 font-black text-lg text-slate-800 text-center flex items-center justify-center gap-2">
                  <span className="text-blue-600">{sum}</span>
                  <span className="text-slate-400">÷</span>
                  <span className="text-purple-600">{values.length}</span>
                  <span className="text-slate-400">=</span>
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-lg text-2xl shadow-sm">
                    {average.replace('.0', '')}
                  </span>
                </div>
              </div>

            </div>

            {/* ΤΕΛΙΚΟ ΕΝΤΥΠΩΣΙΑΚΟ ΑΠΟΤΕΛΕΣΜΑ */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-6 rounded-2xl text-center shadow-lg max-w-xl mx-auto space-y-1">
              <span className="text-xs uppercase font-black text-blue-200 tracking-wider block">Η Μέση Τιμή</span>
              <div className="text-2xl sm:text-3xl font-black">
                Μέσος Όρος = <span className="text-amber-300 text-3xl sm:text-4xl ml-1 inline-block animate-pulse">{average.replace('.0', '')}</span>
              </div>
            </div>

          </div>

        </main>
      </div>

      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Υπολογισμός Μέσου Όρου.</p>
      </footer>
    </div>
  );
}
