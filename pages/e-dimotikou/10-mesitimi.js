// pages/e-dimotikou/10-mesitimi.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const LIMITS = {
  MEAN_VAL_MIN: 1,
  MEAN_VAL_MAX: 10
};

export default function MesiTimiPage() {
  const [meanItems, setMeanItems] = useState([8, 4, 9, 3]);

  // Helpers για τη Μέση Τιμή
  const sumMean = meanItems.reduce((a, b) => a + b, 0);
  const averageMean = (sumMean / meanItems.length).toFixed(1);

  const updateMeanItem = (index, increment) => {
    const newItems = [...meanItems];
    newItems[index] = increment 
      ? Math.min(LIMITS.MEAN_VAL_MAX, newItems[index] + 1) 
      : Math.max(LIMITS.MEAN_VAL_MIN, newItems[index] - 1);
    setMeanItems(newItems);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Head>
        <title>📊 Μέση Τιμή (Μέσος Όρος) - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      {/* NAVBAR */}
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/e-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight">LearnMaths<span className="text-indigo-600">.gr</span></Link>
          <Link href="/e-dimotikou" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold transition">🔙 Επιστροφή</Link>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-6 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-gray-900">📊 Μέση Τιμή (Μέσος Όρος)</h2>
            <p className="text-gray-600 text-sm">Μέση τιμή είναι ο αριθμός που προκύπτει αν προσθέσουμε όλες τις ποσότητες και <strong>μοιράσουμε το άθροισμα εξίσου</strong> (δίκαια) στον ίδιο αριθμό ομάδων.</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase block tracking-wider text-center sm:text-left">Άλλαξε το ύψος των 4 ομάδων:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {meanItems.map((val, idx) => (
                <div key={idx} className="bg-white p-3 rounded-xl border shadow-sm flex flex-col items-center justify-center space-y-1">
                  <span className="text-xs font-bold text-gray-500">Ομάδα {String.fromCharCode(65 + idx)}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateMeanItem(idx, false)} className="bg-slate-100 font-bold px-2 py-0.5 rounded hover:bg-slate-200 text-sm transition">-</button>
                    <span className="font-black text-lg text-indigo-600 w-6 text-center">{val}</span>
                    <button onClick={() => updateMeanItem(idx, true)} className="bg-slate-100 font-bold px-2 py-0.5 rounded hover:bg-slate-200 text-sm transition">+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 text-center">📈 Γραφική Ισορροπία Στηλών (Η Δίκαιη Μοιρασιά)</h3>
            
            <div className="relative border-b-2 border-gray-300 h-48 flex items-end justify-around px-2 sm:px-12 bg-slate-50/50 rounded-xl pt-4">
              {/* Διακεκομμένη γραμμή Μέσης Τιμής */}
              <div 
                className="absolute left-0 right-0 border-t-2 border-dashed border-rose-500 z-10 transition-all duration-300" 
                style={{ bottom: `${(parseFloat(averageMean) / LIMITS.MEAN_VAL_MAX) * 100}%` }}
              >
                <span className="absolute right-2 -top-5 bg-rose-500 text-white text-[9px] font-black p-0.5 px-2 rounded shadow-sm">Μέση Τιμή: {averageMean}</span>
              </div>

              {meanItems.map((val, idx) => (
                <div key={idx} className="flex flex-col items-center w-12 sm:w-16 z-0">
                  <span className="text-xs font-black text-slate-700 mb-1">{val}</span>
                  <div 
                    className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-md shadow-sm transition-all duration-300 relative flex flex-col justify-end" 
                    style={{ height: `${(val / LIMITS.MEAN_VAL_MAX) * 150}px` }}
                  >
                    {Array.from({ length: val }).map((_, bIdx) => (
                      <div key={bIdx} className="border-b border-white/20 h-full w-full"></div>
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 mt-2">Ομ. {String.fromCharCode(65 + idx)}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-black shrink-0 shadow-sm">1</div>
                <div>
                  <p className="text-[10px] font-bold text-blue-800 uppercase tracking-wide">Βήμα 1: Βρίσκω το Συνολικό Άθροισμα</p>
                  <p className="font-black text-sm text-gray-800 mt-0.5">{meanItems.join(' + ')} = <span className="text-blue-600 text-base">{sumMean}</span></p>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center font-black shrink-0 shadow-sm">2</div>
                <div>
                  <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">Βήμα 2: Διαιρώ με το πλήθος των ομάδων ({meanItems.length})</p>
                  <p className="font-black text-sm text-gray-800 mt-0.5">{sumMean} ÷ {meanItems.length} = <span className="text-emerald-600 text-base">{averageMean}</span></p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-rose-500 to-orange-500 text-white p-4 rounded-xl text-center font-black text-sm shadow-md max-w-sm mx-auto">
              📢 Αν μοιράζαμε δίκαια τα τουβλάκια, κάθε ομάδα θα είχε ακριβώς: {averageMean.replace('.0', '')}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
