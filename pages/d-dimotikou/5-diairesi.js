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

export default function DiairesiTheoryPage() {
  const [dividend, setDividend] = useState(145); // Διαιρετέος (Δ)
  const [divisor, setDivisor] = useState(4);    // Διαιρέτης (δ)

  // Υπολογισμοί διαίρεσης
  const quotient = Math.floor(dividend / divisor); // Πηλίκο (π)
  const remainder = dividend % divisor;            // Υπόλοιπο (υ)
  const isExact = remainder === 0;

  const handleRandomize2Digit = () => {
    setDividend(getRandomInt(10, 99));
    setDivisor(getRandomInt(2, 9));
  };

  const handleRandomize3Digit = () => {
    setDividend(getRandomInt(100, 999));
    setDivisor(getRandomInt(2, 9));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>➗ Η Διαίρεση με 1-ψήφιο Διαιρέτη - LearnMaths.gr</title>
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
              <Link href="/d-dimotikou/5-diairesi-ask" className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2">
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
          <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white p-8 rounded-3xl shadow-md relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-3">
                <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                  Δ' ΔΗΜΟΤΙΚΟΥ • ΕΝΟΤΗΤΑ 5
                </span>
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
                  ➗ Η Διαίρεση με 1-ψήφιο Διαιρέτη
                </h1>
                <p className="text-purple-100 text-base lg:text-lg leading-relaxed">
                  Μαθαίνουμε τη διαίρεση διψήφιων και τριψήφιων αριθμών, τους όρους της και πώς κάνουμε επαλήθευση με τον πολλαπλασιασμό!
                </p>
              </div>

              {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
                <div className="text-3xl">🚀</div>
                <h3 className="font-extrabold text-white text-lg">Έτοιμος για εξάσκηση;</h3>
                <p className="text-xs text-purple-100">Δοκίμασε τις ασκήσεις στη διαίρεση για να σιγουρευτείς ότι την έμαθες!</p>
                <Link 
                  href="/d-dimotikou/5-diairesi-ask"
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
                <span>📖</span> Αναλυτική Θεωρία & Ορισμοί
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Τι είναι η Διαίρεση */}
              <div className="bg-indigo-50/70 p-6 rounded-2xl border border-indigo-100 space-y-3">
                <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
                  <span>🔹</span> Τι είναι η Διαίρεση;
                </h3>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                  <strong>Διαίρεση</strong> είναι η πράξη με την οποία <strong>μοιράζουμε</strong> έναν αριθμό σε ίσα μέρη ή υπολογίζουμε πόσες φορές χωράει ένας αριθμός μέσα σε έναν άλλο.
                </p>
                <div className="bg-white p-3 rounded-xl border border-indigo-100 text-xs text-indigo-950 font-medium">
                  💡 <i>Η Διαίρεση είναι η **αντίστροφη πράξη του Πολλαπλασιασμού**!</i>
                </div>
              </div>

              {/* Τέλεια vs Ατελής */}
              <div className="bg-purple-50/70 p-6 rounded-2xl border border-purple-100 space-y-3">
                <h3 className="text-lg font-bold text-purple-900 flex items-center gap-2">
                  <span>⚖️</span> Τέλεια & Ατελής Διαίρεση
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span><strong>Τέλεια Διαίρεση:</strong> Όταν δεν περισσεύει τίποτα, δηλαδή το **Υπόλοιπο είναι 0 ($υ = 0$)**.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span><strong>Ατελής Διαίρεση:</strong> Όταν περισσεύει κάτι, δηλαδή το **Υπόλοιπο είναι μεγαλύτερο του 0 ($υ &gt; 0$)**.</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* ΟΡΟΛΟΓΙΑ & ΕΠΑΛΗΘΕΥΣΗ */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
              <h3 className="text-lg font-extrabold text-gray-800">
                🏷️ Οι Όροι της Διαίρεσης & η Επαλήθευση
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                
                <div className="bg-white p-5 rounded-xl border border-gray-200 space-y-2">
                  <h4 className="font-bold text-purple-700 border-b pb-1">1. Τα 4 στοιχεία της διαίρεσης:</h4>
                  <ul className="space-y-1 text-xs md:text-sm text-gray-700 font-mono">
                    <li><strong className="text-indigo-600">Διαιρετέος (Δ):</strong> Ο αριθμός που μοιράζουμε.</li>
                    <li><strong className="text-blue-600">Διαιρέτης (δ):</strong> Σε πόσα μέρη μοιράζουμε.</li>
                    <li><strong className="text-emerald-600">Πηλίκο (π):</strong> Πόσο παίρνει το κάθε μέρος.</li>
                    <li><strong className="text-amber-600">Υπόλοιπο (υ):</strong> Πόσο περισσεύει ($υ &lt; δ$).</li>
                  </ul>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 space-y-2">
                  <h4 className="font-bold text-emerald-700 border-b pb-1">2. Τύπος Επαλήθευσης (με Πολλαπλασιασμό)</h4>
                  <p className="text-xs text-gray-600">Για να ελέγξουμε αν η διαίρεση είναι σωστή, κάνουμε τον πολλαπλασιασμό:</p>
                  <p className="font-mono font-bold text-gray-800 bg-emerald-50 p-3 rounded-lg text-center text-sm md:text-base border border-emerald-200">
                    Διαιρετέος = (Διαιρέτης × Πηλίκο) + Υπόλοιπο
                    <span className="block text-xs font-normal text-emerald-800 mt-1">Δ = (δ × π) + υ</span>
                  </p>
                </div>

              </div>
            </div>

          </div>

          {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ - SECTION 2 */}
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4 border-gray-100">
              <div>
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <span>🧮</span> Διαδραστικό Εργαστήριο Διαίρεσης & Επαλήθευσης
                </h2>
                <p className="text-gray-500 text-sm">
                  Άλλαξε τους αριθμούς και δες αυτόματα τη διαίρεση, τους όρους της και την επαλήθευση!
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleRandomize2Digit}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-4 py-2.5 rounded-xl text-xs md:text-sm transition shadow-sm flex items-center gap-1.5"
                >
                  <span>🎲</span> Τυχαίος Διψήφιος
                </button>
                <button
                  onClick={handleRandomize3Digit}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-black px-4 py-2.5 rounded-xl text-xs md:text-sm transition shadow-sm flex items-center gap-1.5"
                >
                  <span>🎲</span> Τυχαίος Τριψήφιος
                </button>
              </div>
            </div>

            {/* SLIDERS XΕΙΡΙΣΜΟΥ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                  Διαιρετέος ($Δ$): <span className="text-indigo-600 font-mono text-base font-black">{formatNumber(dividend)}</span>
                </label>
                <input 
                  type="range" 
                  min="10" 
                  max="999" 
                  value={dividend} 
                  onChange={(e) => setDividend(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                  Διαιρέτης ($δ$): <span className="text-blue-600 font-mono text-base font-black">{divisor}</span>
                </label>
                <input 
                  type="range" 
                  min="2" 
                  max="9" 
                  value={divisor} 
                  onChange={(e) => setDivisor(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>

            {/* ΑΠΟΤΕΛΕΣΜΑΤΑ & ΕΠΑΛΗΘΕΥΣΗ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              
              {/* ΑΡΙΣΤΕΡΑ: ΑΠΟΤΕΛΕΣΜΑ ΔΙΑΙΡΕΣΗΣ */}
              <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl space-y-4 text-center">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase ${
                  isExact ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {isExact ? '✨ Τέλεια Διαίρεση' : '⚠️ Ατελής Διαίρεση'}
                </span>

                <div className="text-3xl md:text-4xl font-mono font-black text-white">
                  <span className="text-indigo-400">{formatNumber(dividend)}</span> : <span className="text-blue-400">{divisor}</span> = <span className="text-emerald-400">{formatNumber(quotient)}</span>
                </div>

                <div className="flex justify-center gap-4 text-sm font-mono pt-2 border-t border-slate-800">
                  <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                    <span className="text-slate-400 block text-xs">Πηλίκο ($π$)</span>
                    <span className="text-emerald-400 font-black text-xl">{formatNumber(quotient)}</span>
                  </div>
                  <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                    <span className="text-slate-400 block text-xs">Υπόλοιπο ($υ$)</span>
                    <span className="text-amber-400 font-black text-xl">{remainder}</span>
                  </div>
                </div>
              </div>

              {/* ΔΕΞΙΑ: ΑΝΑΛΥΤΙΚΗ ΕΠΑΛΗΘΕΥΣΗ ΜΕ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟ */}
              <div className="bg-emerald-50/70 p-6 md:p-8 rounded-3xl border border-emerald-200 space-y-4">
                <div className="flex items-center gap-2 border-b border-emerald-200 pb-3">
                  <span className="text-2xl">✅</span>
                  <h3 className="font-extrabold text-emerald-950 text-lg">Επαλήθευση με Πολλαπλασιασμό</h3>
                </div>

                <p className="text-xs md:text-sm text-gray-700">
                  Δείχνουμε ότι ο πολλαπλασιασμός είναι η αντίστροφη πράξη της διαίρεσης:
                </p>

                <div className="bg-white p-4 rounded-2xl border border-emerald-200 font-mono text-base md:text-lg space-y-2 text-center shadow-sm">
                  <div className="text-gray-800 font-bold">
                    (<span className="text-blue-600">{divisor}</span> × <span className="text-emerald-600">{formatNumber(quotient)}</span>) + <span className="text-amber-600">{remainder}</span>
                  </div>
                  <div className="text-sm text-gray-500 font-sans">
                    = {formatNumber(divisor * quotient)} + {remainder}
                  </div>
                  <div className="text-2xl font-black text-indigo-600 border-t pt-2 border-gray-100">
                    = {formatNumber(dividend)} <span className="text-xs text-gray-500 font-normal font-sans">(Διαιρετέος)</span>
                  </div>
                </div>

                <p className="text-xs text-emerald-900 font-medium">
                  💡 *Πολλαπλασιάσαμε το πηλίκο με τον διαιρέτη, προσθέσαμε το υπόλοιπο και βρήκαμε ακριβώς τον αρχικό αριθμό!*
                </p>
              </div>

            </div>

          </div>

          {/* BOTTOM EXERCISES CALLOUT BANNER */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
              <p className="text-gray-800 text-sm md:text-base">
                Έμαθες τη διαίρεση και την επαλήθευση; Δοκίμασε τις διαδραστικές ασκήσεις!
              </p>
            </div>
            <Link
              href="/d-dimotikou/5-diairesi-ask"
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
