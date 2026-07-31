import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function Dekadikoi3PsifiaTheoryPage() {
  const [numerator, setNumerator] = useState(2345); // Αριθμητής

  const denominator = 1000;
  const decimalVal = numerator / denominator;

  // Διαχωρισμός Ακέραιου και Δεκαδικού Μέρους
  const integerPart = Math.floor(decimalVal);
  const decimalPartString = (decimalVal % 1).toFixed(3).substring(2);
  
  const tenthsDigit = parseInt(decimalPartString[0] || '0', 10);
  const hundredthsDigit = parseInt(decimalPartString[1] || '0', 10);
  const thousandthsDigit = parseInt(decimalPartString[2] || '0', 10);

  // Δημιουργία ολόγραφης ανάγνωσης
  const isDecimalZero = parseInt(decimalPartString, 10) === 0;

  let way1 = '';
  let way2 = '';

  if (isDecimalZero) {
    way1 = `${integerPart}`;
    way2 = `${integerPart}`;
  } else if (integerPart === 0) {
    way1 = `${parseInt(decimalPartString, 10)} χιλιοστά`;
    way2 = `μηδέν κόμμα ${decimalPartString}`;
  } else {
    way1 = `${integerPart} και ${parseInt(decimalPartString, 10)} χιλιοστά`;
    way2 = `${integerPart} κόμμα ${decimalPartString}`;
  }

  const handleRandomize = () => {
    setNumerator(getRandomInt(1, 9999));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🔢 Δεκαδικοί Αριθμοί με 3 Ψηφία (Χιλιοστά) - LearnMaths.gr</title>
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
              <Link href="/d-dimotikou/11-dekadikoi-3-psifia-ask" className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2">
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
                  Δ' ΔΗΜΟΤΙΚΟΥ • ΕΝΟΤΗΤΑ 11
                </span>
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
                  🔢 Δεκαδικοί Αριθμοί με 3 Δεκαδικά Ψηφία
                </h1>
                <p className="text-purple-100 text-base lg:text-lg leading-relaxed">
                  Γνωρίζουμε τα **χιλιοστά (χ)**, τη θέση τους μετά την υποδιαστολή και τη μετατροπή δεκαδικών κλασμάτων με παρανομαστή 1.000!
                </p>
              </div>

              {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
                <div className="text-3xl">🚀</div>
                <h3 className="font-extrabold text-white text-lg">Έτοιμος για εξάσκηση;</h3>
                <p className="text-xs text-purple-100">Δοκίμασε τις ασκήσεις στους δεκαδικούς με 3 ψηφία για να σιγουρευτείς ότι τους έμαθες!</p>
                <Link 
                  href="/d-dimotikou/11-dekadikoi-3-psifia-ask"
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
                <span>📖</span> Αναλυτική Θεωρία: Τα Χιλιοστά
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Χιλιοστά & Κλάσματα */}
              <div className="bg-indigo-50/70 p-6 rounded-2xl border border-indigo-100 space-y-3">
                <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
                  <span>🍰</span> Δεκαδικά Κλάσματα με /1.000
                </h3>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                  Όταν χωρίζουμε τη μονάδα σε <strong>1.000 ίσα μέρη</strong>, το κάθε μέρος λέγεται <strong>1 χιλιοστό</strong>:
                </p>
                <div className="bg-white p-3 rounded-xl border border-indigo-100 text-sm text-gray-800 font-mono font-bold flex items-center gap-2">
                  <span className="inline-flex flex-col items-center leading-none text-xs">
                    <span>1</span>
                    <span className="border-b border-gray-800 w-full"></span>
                    <span>1.000</span>
                  </span>
                  <span>= 1 Χιλιοστό = <strong>0,001</strong></span>
                </div>
              </div>

              {/* 3 Δεκαδικά Ψηφία */}
              <div className="bg-purple-50/70 p-6 rounded-2xl border border-purple-100 space-y-3">
                <h3 className="text-lg font-bold text-purple-900 flex items-center gap-2">
                  <span>✏️</span> Τα 3 Δεκαδικά Ψηφία
                </h3>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                  Τα 3 ψηφία μετά το κόμμα δείχνουν κατά σειρά τα <strong>δέκατα (δ)</strong>, τα <strong>εκατοστά (ε)</strong> και τα <strong>χιλιοστά (χ)</strong>:
                </p>
                <div className="bg-white p-3 rounded-xl border border-purple-100 text-sm text-gray-800 font-mono font-bold flex items-center gap-2">
                  <span className="inline-flex flex-col items-center leading-none text-xs">
                    <span>125</span>
                    <span className="border-b border-gray-800 w-full"></span>
                    <span>1.000</span>
                  </span>
                  <span>= <strong>0,125</strong> (3 δεκαδικά ψηφία)</span>
                </div>
              </div>

            </div>

            {/* ΑΝΑΛΥΣΗ ΘΕΣΗΣ ΨΗΦΙΟΥ */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
              <h3 className="text-lg font-extrabold text-gray-800">
                🔍 Πίνακας Αξίας Θέσης: <span className="text-indigo-600 font-mono">2,345</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                
                <div className="bg-white p-5 rounded-xl border border-gray-200 space-y-2">
                  <h4 className="font-bold text-blue-700 border-b pb-1">1. Ακέραιο Μέρος</h4>
                  <p className="font-mono font-bold text-gray-800 bg-blue-50 p-3 rounded-lg text-center">
                    <span className="text-blue-600 text-xl">2</span> , 345 ➔ <strong>2 Μονάδες (Μ)</strong>
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 space-y-2">
                  <h4 className="font-bold text-purple-700 border-b pb-1">2. Δεκαδικό Μέρος (3 Ψηφία)</h4>
                  <p className="font-mono font-bold text-gray-800 bg-purple-50 p-3 rounded-lg text-center">
                    2 , <span className="text-teal-600 text-xl">3</span><span className="text-amber-600 text-xl">4</span><span className="text-rose-600 text-xl">5</span> ➔ <strong>3 δέκατα (δ), 4 εκατοστά (ε), 5 χιλιοστά (χ)</strong>
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
                  <span>🧮</span> Διαδραστικός Μετατροπέας Χιλιοστών (/1.000)
                </h2>
                <p className="text-gray-500 text-sm">
                  Άλλαξε τον αριθμητή και δες αμέσως τη μετατροπή σε δεκαδικό αριθμό με 3 ψηφία!
                </p>
              </div>

              <button
                onClick={handleRandomize}
                className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2.5 rounded-xl text-xs md:text-sm transition shadow-sm flex items-center gap-1.5"
              >
                <span>🎲</span> Τυχαίος Αριθμός
              </button>
            </div>

            {/* SLIDER ΧΕΙΡΙΣΜΟΥ */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-2">
              <label className="block text-xs font-black uppercase text-gray-500">
                Αριθμητής Κλάσματος: <span className="text-indigo-600 font-mono text-lg font-black">{numerator}</span>
              </label>
              <input 
                type="range" 
                min="1" 
                max="9999" 
                value={numerator} 
                onChange={(e) => setNumerator(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            {/* ΠΡΟΒΟΛΗ ΚΛΑΣΜΑΤΟΣ, ΔΕΚΑΔΙΚΟΥ & ΠΙΝΑΚΑ ΑΞΙΑΣ ΘΕΣΗΣ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              
              {/* 1. Δεκαδικό Κλάσμα */}
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-3xl border border-indigo-200 text-center space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-indigo-500 block">
                  1. Δεκαδικό Κλάσμα
                </span>
                <div className="inline-flex flex-col items-center font-mono font-black text-3xl md:text-4xl text-indigo-900 py-2">
                  <span>{numerator}</span>
                  <span className="w-full border-b-4 border-indigo-900 my-1"></span>
                  <span>1.000</span>
                </div>
              </div>

              {/* 2. Δεκαδικός Αριθμός */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-3xl border border-purple-200 text-center space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-purple-500 block">
                  2. Δεκαδικός Αριθμός
                </span>
                <div className="font-mono font-black text-4xl md:text-5xl text-purple-900 py-4">
                  {decimalVal.toString().replace('.', ',')}
                </div>
              </div>

              {/* 3. Πίνακας Αξίας Θέσης */}
              <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-3 text-center">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                  3. Πίνακας Αξίας Θέσης
                </span>
                
                <div className="grid grid-cols-5 gap-1 text-center font-mono text-[10px] md:text-xs">
                  <div className="bg-blue-600/30 text-blue-300 p-1.5 rounded-lg font-bold">Μονάδες (Μ)</div>
                  <div className="bg-slate-700 text-slate-300 p-1.5 rounded-lg font-bold">,</div>
                  <div className="bg-teal-600/30 text-teal-300 p-1.5 rounded-lg font-bold">Δέκατα (δ)</div>
                  <div className="bg-amber-600/30 text-amber-300 p-1.5 rounded-lg font-bold">Εκατοστά (ε)</div>
                  <div className="bg-rose-600/30 text-rose-300 p-1.5 rounded-lg font-bold">Χιλιοστά (χ)</div>

                  <div className="bg-slate-800 text-xl font-black text-blue-400 p-2 rounded-lg">{integerPart}</div>
                  <div className="bg-slate-800 text-xl font-black text-slate-400 p-2 rounded-lg">,</div>
                  <div className="bg-slate-800 text-xl font-black text-teal-400 p-2 rounded-lg">{tenthsDigit}</div>
                  <div className="bg-slate-800 text-xl font-black text-amber-400 p-2 rounded-lg">{hundredthsDigit}</div>
                  <div className="bg-slate-800 text-xl font-black text-rose-400 p-2 rounded-lg">{thousandthsDigit}</div>
                </div>
              </div>

            </div>

            {/* ΟΛΟΓΡΑΦΗ ΕΞΗΓΗΣΗ (2 ΤΡΟΠΟΙ ΑΝΑΓΝΩΣΗΣ) */}
            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200 text-center space-y-2">
              <span className="text-xs font-black uppercase text-emerald-800 block">🗣️ Πώς το διαβάζουμε:</span>
              
              {isDecimalZero ? (
                <div className="bg-white px-6 py-3 rounded-xl border border-emerald-200 shadow-sm inline-block text-lg font-black text-emerald-950">
                  « <span className="text-indigo-700">{way1}</span> »
                </div>
              ) : (
                <div className="flex flex-col md:flex-row justify-center items-center gap-3 text-base md:text-lg font-bold text-emerald-950">
                  <span className="bg-white px-4 py-2 rounded-xl border border-emerald-200 shadow-sm">
                    « <span className="text-indigo-700">{way1}</span> »
                  </span>
                  <span className="text-xs font-black text-emerald-600 uppercase">ή</span>
                  <span className="bg-white px-4 py-2 rounded-xl border border-emerald-200 shadow-sm">
                    « <span className="text-purple-700">{way2}</span> »
                  </span>
                </div>
              )}
            </div>

          </div>

          {/* BOTTOM EXERCISES CALLOUT BANNER */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
              <p className="text-gray-800 text-sm md:text-base">
                Έμαθες τους δεκαδικούς αριθμούς με 3 δεκαδικά ψηφία; Δοκίμασε τις διαδραστικές ασκήσεις!
              </p>
            </div>
            <Link
              href="/d-dimotikou/11-dekadikoi-3-psifia-ask"
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
