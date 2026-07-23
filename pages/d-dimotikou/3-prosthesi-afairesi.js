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

export default function ProsthesiAfairesiTheoryPage() {
  const [numA, setNumA] = useState(12450);
  const [numB, setNumB] = useState(3200);

  const sum = numA + numB;

  const handleRandomize = () => {
    const a = getRandomInt(1000, 15000);
    const b = getRandomInt(1000, 5000);
    setNumA(a);
    setNumB(b);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>➕➖ Πρόσθεση και Αφαίρεση (Αντίστροφες Πράξεις) - LearnMaths.gr</title>
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
              <Link href="/d-dimotikou/3-prosthesi-afairesi-ask" className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2">
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
                  Δ' ΔΗΜΟΤΙΚΟΥ
                </span>
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
                  ➕➖ Πρόσθεση και Αφαίρεση: Αντίστροφες Πράξεις
                </h1>
                <p className="text-blue-100 text-base lg:text-lg leading-relaxed">
                  Μαθαίνουμε πώς συνδέονται η πρόσθεση με την αφαίρεση και πώς χρησιμοποιούμε τη μία για να ελέγξουμε την άλλη!
                </p>
              </div>

              {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
                <div className="text-3xl">🚀</div>
                <h3 className="font-extrabold text-white text-lg">Έτοιμος για εξάσκηση;</h3>
                <p className="text-xs text-blue-100">Δοκίμασε τις ασκήσεις στις αντίστροφες πράξεις για να σιγουρευτείς ότι τα κατάλαβες όλα!</p>
                <Link 
                  href="/d-dimotikou/3-prosthesi-afairesi-ask"
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
                <span>📖</span> Αναλυτική Θεωρία και Ορισμοί
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Αντίστροφες Πράξεις */}
              <div className="bg-indigo-50/70 p-6 rounded-2xl border border-indigo-100 space-y-3">
                <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
                  <span>🔄</span> Τι σημαίνει «Αντίστροφες Πράξεις»;
                </h3>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                  Η <strong>πρόσθεση</strong> και η <strong>αφαίρεση</strong> είναι αντίστροφες πράξεις επειδή η μία «ακυρώνει» το αποτέλεσμα της άλλης:
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span>Αν σε έναν αριθμό <strong>προσθέσουμε</strong> 5 και μετά <strong>αφαιρέσουμε</strong> 5, γυρνάμε στον ίδιο αρχικό αριθμό!</span>
                  </li>
                </ul>
              </div>

              {/* Ορολογία */}
              <div className="bg-emerald-50/70 p-6 rounded-2xl border border-emerald-100 space-y-3">
                <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
                  <span>🏷️</span> Οι Όροι των Πράξεων
                </h3>
                <div className="space-y-2 text-xs md:text-sm text-gray-800 font-mono">
                  <div className="p-2 bg-white rounded-lg border border-emerald-200">
                    <span className="text-blue-600 font-bold">Προσθετέος</span> + <span className="text-blue-600 font-bold">Προσθετέος</span> = <span className="text-emerald-700 font-black">Άθροισμα</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-emerald-200">
                    <span className="text-purple-600 font-bold">Μειωτέος</span> - <span className="text-rose-600 font-bold">Αφαιρετέος</span> = <span className="text-amber-700 font-black">Διαφορά</span>
                  </div>
                </div>
              </div>

            </div>

            {/* ΔΟΚΙΜΗ ΠΡΟΣΘΕΣΗΣ ΚΑΙ ΑΦΑΙΡΕΣΗΣ */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
              <h3 className="text-lg font-extrabold text-gray-800">
                ✅ Πώς κάνουμε Δοκιμή στις πράξεις;
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                
                <div className="bg-white p-5 rounded-xl border border-gray-200 space-y-2">
                  <h4 className="font-bold text-blue-700 border-b pb-1">1. Δοκιμή Πρόσθεσης (με Αφαίρεση)</h4>
                  <p className="text-gray-600">Για να ελέγξουμε αν μια πρόσθεση είναι σωστή, αφαιρούμε έναν προσθετέο από το άθροισμα:</p>
                  <p className="font-mono font-bold text-gray-800 bg-blue-50 p-2 rounded-lg text-center">
                    Άθροισμα - Προσθετέος = Άλλος Προσθετέος
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 space-y-2">
                  <h4 className="font-bold text-purple-700 border-b pb-1">2. Δοκιμή Αφαίρεσης (με Πρόσθεση)</h4>
                  <p className="text-gray-600">Για να ελέγξουμε αν μια αφαίρεση είναι σωστή, προσθέτουμε τη διαφορά στον αφαιρετέο:</p>
                  <p className="font-mono font-bold text-gray-800 bg-purple-50 p-2 rounded-lg text-center">
                    Διαφορά + Αφαιρετέος = Μειωτέος
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
                  <span>🧮</span> Διαδραστικό Εργαστήριο Αντίστροφων Πράξεων
                </h2>
                <p className="text-gray-500 text-sm">
                  Άλλαξε τους αριθμούς και δες πώς η πρόσθεση μετατρέπεται αυτόματα σε αφαίρεση!
                </p>
              </div>

              <button
                onClick={handleRandomize}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2"
              >
                <span>🎲</span> Τυχαίοι Αριθμοί
              </button>
            </div>

            {/* SLIDERS XΕΙΡΙΣΜΟΥ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-xs font-black text-gray-500 mb-1">
                  1ος Αριθμός (α): <span className="text-blue-600 font-mono text-base font-black">{formatNumber(numA)}</span>
                </label>
                <input 
                  type="range" 
                  min="1000" 
                  max="15000" 
                  step="50"
                  value={numA} 
                  onChange={(e) => setNumA(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-500 mb-1">
                  2ος Αριθμός (β): <span className="text-indigo-600 font-mono text-base font-black">{formatNumber(numB)}</span>
                </label>
                <input 
                  type="range" 
                  min="100" 
                  max="5000" 
                  step="50"
                  value={numB} 
                  onChange={(e) => setNumB(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>

            {/* ΠΡΟΒΟΛΗ ΑΝΤΙΣΤΡΟΦΩΝ ΠΡΑΞΕΩΝ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Κάρτα 1: Πρόσθεση */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200 space-y-3 text-center">
                <span className="bg-blue-600 text-white text-xs font-black uppercase px-3 py-1 rounded-full">
                  1. Αρχικη Προσθεση
                </span>
                <div className="text-2xl md:text-3xl font-mono font-black text-gray-800 pt-2">
                  <span className="text-blue-600">{formatNumber(numA)}</span> + <span className="text-indigo-600">{formatNumber(numB)}</span>
                </div>
                <div className="text-3xl md:text-4xl font-mono font-black text-emerald-600 border-t pt-2 border-blue-200">
                  = {formatNumber(sum)}
                </div>
                <p className="text-xs text-gray-500">Προσθέσαμε τους δύο αριθμούς</p>
              </div>

              {/* Κάρτα 2: 1η Αντίστροφη Αφαίρεση */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200 space-y-3 text-center">
                <span className="bg-purple-600 text-white text-xs font-black uppercase px-3 py-1 rounded-full">
                  2. Αντιστροφη (1)
                </span>
                <div className="text-2xl md:text-3xl font-mono font-black text-gray-800 pt-2">
                  <span className="text-emerald-600">{formatNumber(sum)}</span> - <span className="text-indigo-600">{formatNumber(numB)}</span>
                </div>
                <div className="text-3xl md:text-4xl font-mono font-black text-blue-600 border-t pt-2 border-purple-200">
                  = {formatNumber(numA)}
                </div>
                <p className="text-xs text-gray-500">Αφαιρέσαμε τον 2ο αριθμό και βρήκαμε τον 1ο!</p>
              </div>

              {/* Κάρτα 3: 2η Αντίστροφη Αφαίρεση */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-200 space-y-3 text-center">
                <span className="bg-emerald-600 text-white text-xs font-black uppercase px-3 py-1 rounded-full">
                  3. Αντιστροφη (2)
                </span>
                <div className="text-2xl md:text-3xl font-mono font-black text-gray-800 pt-2">
                  <span className="text-emerald-600">{formatNumber(sum)}</span> - <span className="text-blue-600">{formatNumber(numA)}</span>
                </div>
                <div className="text-3xl md:text-4xl font-mono font-black text-indigo-600 border-t pt-2 border-emerald-200">
                  = {formatNumber(numB)}
                </div>
                <p className="text-xs text-gray-500">Αφαιρέσαμε τον 1ο αριθμό και βρήκαμε τον 2ο!</p>
              </div>

            </div>

          </div>

          {/* BOTTOM EXERCISES CALLOUT BANNER */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
              <p className="text-gray-800 text-sm md:text-base">
                Κατάλαβες πώς η πρόσθεση και η αφαίρεση είναι αντίστροφες πράξεις; Κάνε τις διαδραστικές ασκήσεις!
              </p>
            </div>
            <Link
              href="/d-dimotikou/3-prosthesi-afairesi-ask"
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
