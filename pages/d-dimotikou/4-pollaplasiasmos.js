import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function PollaplasiasmosTheoryPage() {
  const [numA, setNumA] = useState(43);
  const [numB, setNumB] = useState(25);

  // Υπολογισμοί μερικών γινομένων
  const unitsB = numB % 10;
  const tensB = Math.floor(numB / 10);

  const partial1 = numA * unitsB;          // 1ο Μερικό Γινόμενο (Μονάδες)
  const partial2 = numA * (tensB * 10);     // 2ο Μερικό Γινόμενο (Δεκάδες)
  const total = numA * numB;

  const handleRandomize = () => {
    setNumA(getRandomInt(12, 99));
    setNumB(getRandomInt(12, 99));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>✖️ Πολλαπλασιασμός με 2-ψήφιο - LearnMaths.gr</title>
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
              <Link href="/d-dimotikou/4-pollaplasiasmos-ask" className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2">
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
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white p-8 rounded-3xl shadow-md relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-3">
                <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                  Δ' ΔΗΜΟΤΙΚΟΥ • ΕΝΟΤΗΤΑ 4
                </span>
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
                  ✖️ Πολλαπλασιασμός με Διψήφιο Αριθμό
                </h1>
                <p className="text-emerald-100 text-base lg:text-lg leading-relaxed">
                  Μαθαίνουμε να πολλαπλασιάζουμε κάθετα δύο διψήφιους αριθμούς εύκολα, βήμα προς βήμα!
                </p>
              </div>

              {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
                <div className="text-3xl">🚀</div>
                <h3 className="font-extrabold text-white text-lg">Έτοιμος για εξάσκηση;</h3>
                <p className="text-xs text-emerald-100">Δοκίμασε τις ασκήσεις στον κάθετο πολλαπλασιασμό για να σιγουρευτείς ότι τον έμαθες!</p>
                <Link 
                  href="/d-dimotikou/4-pollaplasiasmos-ask"
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
                <span>📖</span> Πώς κάνουμε Κάθετο Πολλαπλασιασμό;
              </h2>
            </div>

            {/* BHMATA */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-100 space-y-2">
                <span className="w-8 h-8 bg-emerald-600 text-white rounded-xl font-black flex items-center justify-center text-sm">1</span>
                <h3 className="font-extrabold text-emerald-950 text-base">Μονάδες</h3>
                <p className="text-xs text-gray-700 leading-relaxed">
                  Πολλαπλασιάζουμε τον πάνω αριθμό με τις <strong>Μονάδες</strong> του κάτω αριθμού.
                </p>
              </div>

              <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-100 space-y-2">
                <span className="w-8 h-8 bg-amber-500 text-white rounded-xl font-black flex items-center justify-center text-sm">2</span>
                <h3 className="font-extrabold text-amber-950 text-base">Το «0» της Δεκάδας</h3>
                <p className="text-xs text-gray-700 leading-relaxed">
                  Στην επόμενη γραμμή βάζουμε ένα <strong>μηδενικό (0)</strong> στις Μονάδες, γιατί θα πολλαπλασιάσουμε με Δεκάδες!
                </p>
              </div>

              <div className="bg-indigo-50/70 p-5 rounded-2xl border border-indigo-100 space-y-2">
                <span className="w-8 h-8 bg-indigo-600 text-white rounded-xl font-black flex items-center justify-center text-sm">3</span>
                <h3 className="font-extrabold text-indigo-950 text-base">Δεκάδες</h3>
                <p className="text-xs text-gray-700 leading-relaxed">
                  Πολλαπλασιάζουμε τον πάνω αριθμό με τις <strong>Δεκάδες</strong> του κάτω αριθμού.
                </p>
              </div>

              <div className="bg-purple-50/70 p-5 rounded-2xl border border-purple-100 space-y-2">
                <span className="w-8 h-8 bg-purple-600 text-white rounded-xl font-black flex items-center justify-center text-sm">4</span>
                <h3 className="font-extrabold text-purple-950 text-base">Πρόσθεση</h3>
                <p className="text-xs text-gray-700 leading-relaxed">
                  <strong>Προσθέτουμε</strong> τα δύο μερικά γινόμενα για να βρούμε το τελικό αποτέλεσμα!
                </p>
              </div>

            </div>

            {/* ΟΡΟΛΟΓΙΑ */}
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-2 text-xs md:text-sm text-gray-800">
              <h3 className="font-extrabold text-gray-900 text-base">🏷️ Ορολογία Πολλαπλασιασμού:</h3>
              <p className="font-mono bg-white p-3 rounded-xl border border-gray-200">
                <span className="text-emerald-600 font-bold">43 (Πολλαπλασιαστέος)</span> × <span className="text-indigo-600 font-bold">25 (Πολλαπλασιαστής)</span> = <span className="text-purple-700 font-black">1.075 (Γινόμενο)</span>
              </p>
              <p className="text-gray-500 italic">Οι δύο αριθμοί που πολλαπλασιάζουμε λέγονται και **Παράγοντες του Γινομένου**.</p>
            </div>

          </div>

          {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ / SMART MULTIPLICATION CALCULATOR - SECTION 2 */}
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4 border-gray-100">
              <div>
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <span>🧮</span> Διαδραστικός Κάθετος Πολλαπλασιαστής
                </h2>
                <p className="text-gray-500 text-sm">
                  Άλλαξε τους αριθμούς και δες πώς λύνεται κάθετα η πράξη βήμα προς βήμα!
                </p>
              </div>

              <button
                onClick={handleRandomize}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2"
              >
                <span>🎲</span> Τυχαίοι Αριθμοί
              </button>
            </div>

            {/* INPUTS / SLIDERS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                  1ος Αριθμός (Πάνω): <span className="text-emerald-600 font-mono text-base font-black">{numA}</span>
                </label>
                <input 
                  type="range" 
                  min="11" 
                  max="99" 
                  value={numA} 
                  onChange={(e) => setNumA(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                  2ος Αριθμός (Κάτω): <span className="text-indigo-600 font-mono text-base font-black">{numB}</span>
                </label>
                <input 
                  type="range" 
                  min="11" 
                  max="99" 
                  value={numB} 
                  onChange={(e) => setNumB(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>

            {/* DISPLAY ΚΑΘΕΤΟΥ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΥ & ΕΞΗΓΗΣΗΣ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              
              {/* ΚΑΘΕΤΗ ΜΟΡΦΗ */}
              <div className="bg-slate-900 text-white p-8 rounded-3xl font-mono text-2xl md:text-3xl shadow-xl space-y-2 text-right max-w-sm mx-auto w-full select-none">
                {/* 1ος Αριθμός */}
                <div className="text-emerald-400 font-bold tracking-widest">{numA}</div>
                
                {/* 2ος Αριθμός */}
                <div className="border-b-4 border-slate-700 pb-2 flex justify-between items-center text-indigo-400 font-bold tracking-widest">
                  <span className="text-slate-500 text-xl">×</span>
                  <span>{numB}</span>
                </div>

                {/* 1ο Μερικό Γινόμενο (με Μονάδες) */}
                <div className="text-amber-400 text-xl md:text-2xl pt-2">
                  {formatNumber(partial1)}
                  <span className="text-xs text-slate-400 font-sans block text-right font-normal">({numA} × {unitsB})</span>
                </div>

                {/* 2ο Μερικό Γινόμενο (με Δεκάδες) */}
                <div className="text-teal-400 text-xl md:text-2xl border-b-2 border-slate-700 pb-2">
                  +{formatNumber(partial2)}
                  <span className="text-xs text-slate-400 font-sans block text-right font-normal">({numA} × {tensB * 10})</span>
                </div>

                {/* Τελικό Αποτέλεσμα */}
                <div className="text-purple-400 font-black text-3xl md:text-4xl pt-2 tracking-tight">
                  {formatNumber(total)}
                </div>
              </div>

              {/* ΑΝΑΛΥΤΙΚΗ ΕΞΗΓΗΣΗ BHMΑ-ΒΗΜΑ */}
              <div className="space-y-4">
                <h3 className="font-extrabold text-gray-900 text-lg flex items-center gap-2">
                  <span>💡</span> Πώς προέκυψε το αποτέλεσμα;
                </h3>

                <div className="space-y-3 text-sm">
                  
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
                    <span className="text-xs font-black uppercase text-amber-800">Βήμα 1: Μονάδες ({unitsB})</span>
                    <p className="font-mono text-gray-800 font-bold">
                      {numA} × {unitsB} = <span className="text-amber-600 font-black">{formatNumber(partial1)}</span>
                    </p>
                    <p className="text-xs text-gray-600">Πολλαπλασιάζουμε τον πάνω αριθμό με τις {unitsB} μονάδες.</p>
                  </div>

                  <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 space-y-1">
                    <span className="text-xs font-black uppercase text-teal-800">Βήμα 2: Δεκάδες ({tensB}0)</span>
                    <p className="font-mono text-gray-800 font-bold">
                      {numA} × {tensB * 10} = <span className="text-teal-600 font-black">{formatNumber(partial2)}</span>
                    </p>
                    <p className="text-xs text-gray-600">Πολλαπλασιάζουμε με τις {tensB} δεκάδες (βάζοντας το 0 στο τέλος).</p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-1">
                    <span className="text-xs font-black uppercase text-purple-800">Βήμα 3: Τελικό Άθροισμα</span>
                    <p className="font-mono text-gray-800 font-bold">
                      {formatNumber(partial1)} + {formatNumber(partial2)} = <span className="text-purple-700 font-black">{formatNumber(total)}</span>
                    </p>
                  </div>

                </div>
              </div>

            </div>

          </div>

          {/* BOTTOM EXERCISES CALLOUT BANNER */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
              <p className="text-gray-800 text-sm md:text-base">
                Έμαθες πώς γίνεται ο κάθετος πολλαπλασιασμός με 2-ψήφιο; Δοκίμασε τις διαδραστικές ασκήσεις!
              </p>
            </div>
            <Link
              href="/d-dimotikou/4-pollaplasiasmos-ask"
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
