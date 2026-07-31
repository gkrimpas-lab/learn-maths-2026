import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function Diairesi101001000TheoryPage() {
  const [numInput, setNumInput] = useState("450");
  const [operation, setModeOperation] = useState("div"); // 'div' (:) ή 'mul' (x)
  const [factor, setFactor] = useState(10); // 10, 100, 1000

  const numericVal = parseFloat(numInput.replace(',', '.')) || 0;

  // Υπολογισμός αποτελέσματος
  let result = 0;
  if (operation === 'div') {
    result = numericVal / factor;
  } else {
    result = numericVal * factor;
  }

  // Αριθμός θέσεων μετακίνησης υποδιαστολής
  const shiftPositions = factor === 10 ? 1 : factor === 100 ? 2 : 3;
  const direction = operation === 'div' ? 'αριστερά' : 'δεξιά';
  const arrowEmoji = operation === 'div' ? '⬅️' : '➡️';

  const handleRandomize = () => {
    const isDecimal = Math.random() > 0.5;
    let randVal;
    if (isDecimal) {
      randVal = (Math.random() * 500 + 1).toFixed(getRandomInt(1, 2));
    } else {
      randVal = getRandomInt(1, 95) * (Math.random() > 0.5 ? 100 : 10);
    }
    const factors = [10, 100, 1000];
    setNumInput(randVal.toString().replace('.', ','));
    setFactor(factors[getRandomInt(0, 2)]);
    setModeOperation(Math.random() > 0.5 ? 'div' : 'mul');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>➗ Διαίρεση & Πολλαπλασιασμός με 10, 100, 1.000 - LearnMaths.gr</title>
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
              <Link href="/d-dimotikou/12-diairesi-deka-ekato-xilia-ask" className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2">
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
                  Δ' ΔΗΜΟΤΙΚΟΥ • ΕΝΟΤΗΤΑ 12
                </span>
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
                  ⚡ Διαίρεση & Πολλαπλασιασμός με 10, 100, 1.000
                </h1>
                <p className="text-blue-100 text-base lg:text-lg leading-relaxed">
                  Μαθαίνουμε τον χρυσό κανόνα της μετακίνησης της υποδιαστολής (αριστερά στη διαίρεση, δεξιά στον πολλαπλασιασμό)!
                </p>
              </div>

              {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
                <div className="text-3xl">🚀</div>
                <h3 className="font-extrabold text-white text-lg">Έτοιμος για εξάσκηση;</h3>
                <p className="text-xs text-blue-100">Δοκίμασε τις ασκήσεις στη διαίρεση & πολλαπλασιασμό με 10, 100, 1.000!</p>
                <Link 
                  href="/d-dimotikou/12-diairesi-deka-ekato-xilia-ask"
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
                <span>📖</span> Ο Χρυσός Κανόνας της Υποδιαστολής
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* 1. ΔΙΑΙΡΕΣΗ (: 10, : 100, : 1000) */}
              <div className="bg-rose-50/70 p-6 rounded-2xl border border-rose-100 space-y-3">
                <h3 className="text-lg font-bold text-rose-900 flex items-center gap-2">
                  <span>⬅️</span> Διαίρεση (: 10, : 100, : 1.000)
                </h3>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                  Στη διαίρεση ο αριθμός <strong>μικραίνει</strong>, οπότε μετακινούμε την υποδιαστολή προς τα <strong>ΑΡΙΣΤΕΡΑ</strong>:
                </p>
                <ul className="space-y-1.5 text-xs md:text-sm text-gray-700 font-mono font-bold">
                  <li className="bg-white p-2 rounded-lg border border-rose-100">• : 10 ➔ 1 θέση αριστερά (π.χ. 45 : 10 = 4,5)</li>
                  <li className="bg-white p-2 rounded-lg border border-rose-100">• : 100 ➔ 2 θέσεις αριστερά (π.χ. 45 : 100 = 0,45)</li>
                  <li className="bg-white p-2 rounded-lg border border-rose-100">• : 1.000 ➔ 3 θέσεις αριστερά (π.χ. 45 : 1.000 = 0,045)</li>
                </ul>
              </div>

              {/* 2. ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ (x 10, x 100, x 1000) */}
              <div className="bg-emerald-50/70 p-6 rounded-2xl border border-emerald-100 space-y-3">
                <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
                  <span>➡️</span> Πολλαπλασιασμός (× 10, × 100, × 1.000)
                </h3>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                  Στον πολλαπλασιασμό ο αριθμός <strong>μεγαλώνει</strong>, οπότε μετακινούμε την υποδιαστολή προς τα <strong>ΔΕΞΙΑ</strong>:
                </p>
                <ul className="space-y-1.5 text-xs md:text-sm text-gray-700 font-mono font-bold">
                  <li className="bg-white p-2 rounded-lg border border-emerald-100">• × 10 ➔ 1 θέση δεξιά (π.χ. 3,5 × 10 = 35)</li>
                  <li className="bg-white p-2 rounded-lg border border-emerald-100">• × 100 ➔ 2 θέσεις δεξιά (π.χ. 3,5 × 100 = 350)</li>
                  <li className="bg-white p-2 rounded-lg border border-emerald-100">• × 1.000 ➔ 3 θέσεις δεξιά (π.χ. 3,5 × 1.000 = 3.500)</li>
                </ul>
              </div>

            </div>

            {/* ΣΥΝΤΟΜΟ TIP ΓΙΑ ΑΚΕΡΑΙΟΥΣ */}
            <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200 text-xs md:text-sm font-medium text-amber-950 space-y-1">
              <span className="font-black uppercase text-amber-800">💡 Τι κάνουμε όταν ο αριθμός είναι Ακέραιος;</span>
              <p>
                Στους ακεραίους αριθμούς (π.χ. $450$), η υποδιαστολή κρύβεται πάντα στο τέλος ($450,$). Όταν διαιρούμε με το $10$ ή το $100$, η υποδιαστολή εμφανίζεται και κινείται προς τα αριστερά!
              </p>
            </div>

          </div>

          {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ - SECTION 2 */}
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4 border-gray-100">
              <div>
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <span>🧮</span> Διαδραστικό Εργαστήριο Υποδιαστολής
                </h2>
                <p className="text-gray-500 text-sm">
                  Γράψε έναν αριθμό, επίλεξε πράξη και δες ζωντανά πώς μετακινείται η υποδιαστολή!
                </p>
              </div>

              <button
                onClick={handleRandomize}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-4 py-2.5 rounded-xl text-xs md:text-sm transition shadow-sm flex items-center gap-1.5"
              >
                <span>🎲</span> Τυχαία Πράξη
              </button>
            </div>

            {/* INPUTS / ΕΠΙΛΟΓΕΣ */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              
              {/* 1. Αριθμός */}
              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                  Αριθμός:
                </label>
                <input 
                  type="text" 
                  value={numInput} 
                  onChange={(e) => setNumInput(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-300 font-mono text-lg font-black focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="π.χ. 450 ή 3,5"
                />
              </div>

              {/* 2. Πράξη */}
              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                  Πράξη:
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setModeOperation('div')}
                    className={`flex-1 py-3 rounded-xl font-mono font-black text-lg transition ${
                      operation === 'div' ? 'bg-rose-600 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    : (Διαίρεση)
                  </button>
                  <button
                    onClick={() => setModeOperation('mul')}
                    className={`flex-1 py-3 rounded-xl font-mono font-black text-lg transition ${
                      operation === 'mul' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    × (Πολλαπλ.)
                  </button>
                </div>
              </div>

              {/* 3. Παράγοντας (10, 100, 1000) */}
              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                  Με πόσο;
                </label>
                <div className="flex gap-2">
                  {[10, 100, 1000].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFactor(f)}
                      className={`flex-1 py-3 rounded-xl font-mono font-black text-sm transition ${
                        factor === f ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* ΠΡΟΒΟΛΗ ΑΠΟΤΕΛΕΣΜΑΤΟΣ & ΟΠΤΙΚΟΠΟΙΗΣΗ */}
            <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl text-center space-y-4">
              
              <div className="text-xs font-black uppercase tracking-wider text-slate-400">
                Η Πράξη σου:
              </div>

              <div className="font-mono font-black text-3xl md:text-5xl text-amber-400 py-2">
                {numInput} {operation === 'div' ? ':' : '×'} {factor} = <span className="text-emerald-400">{result.toString().replace('.', ',')}</span>
              </div>

              {/* Επεξήγηση Μετακίνησης */}
              <div className="inline-flex items-center gap-2 bg-slate-800 px-6 py-3 rounded-2xl border border-slate-700 text-sm md:text-base font-bold text-slate-200">
                <span>{arrowEmoji}</span>
                <span>
                  Η υποδιαστολή μετακινήθηκε <strong className="text-indigo-400">{shiftPositions} {shiftPositions === 1 ? 'θέση' : 'θέσεις'}</strong> προς τα <strong className="text-amber-300">{direction}</strong>!
                </span>
              </div>

            </div>

          </div>

          {/* BOTTOM EXERCISES CALLOUT BANNER */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
              <p className="text-gray-800 text-sm md:text-base">
                Έμαθες τη μετακίνηση της υποδιαστολής; Δοκίμασε τις διαδραστικές ασκήσεις!
              </p>
            </div>
            <Link
              href="/d-dimotikou/12-diairesi-deka-ekato-xilia-ask"
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
