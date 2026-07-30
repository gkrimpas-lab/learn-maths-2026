import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function DekadikoiTheoryPage() {
  const [mode, setMode] = useState('tenths'); // 'tenths' (/10) ή 'hundredths' (/100)
  const [numerator, setNumerator] = useState(35); // Αριθμητής

  // Υπολογισμοί δεκαδικού
  const denominator = mode === 'tenths' ? 10 : 100;
  const decimalVal = numerator / denominator;

  // Διαχωρισμός Ακέραιου και Δεκαδικού Μέρους
  const integerPart = Math.floor(decimalVal);
  const decimalPartString = (decimalVal % 1).toFixed(mode === 'tenths' ? 1 : 2).substring(2);
  
  const tenthsDigit = parseInt(decimalPartString[0] || '0', 10);
  const hundredthsDigit = mode === 'hundredths' ? parseInt(decimalPartString[1] || '0', 10) : 0;

  // Δημιουργία ολόγραφης ανάγνωσης (με έλεγχο για μηδενικό δεκαδικό μέρος)
  const decimalPartName = mode === 'tenths' ? 'δέκατα' : 'εκατοστά';
  const isDecimalZero = parseInt(decimalPartString, 10) === 0;

  let way1 = '';
  let way2 = '';

  if (isDecimalZero) {
    // Αν το δεκαδικό μέρος είναι 0 (π.χ. 2,00 -> "2")
    way1 = `${integerPart}`;
    way2 = `${integerPart}`;
  } else if (integerPart === 0) {
    // Αν το ακέραιο μέρος είναι 0 (π.χ. 0,6 -> "6 δέκατα" / "μηδέν κόμμα 6")
    way1 = `${parseInt(decimalPartString, 10)} ${decimalPartName}`;
    way2 = `μηδέν κόμμα ${decimalPartString}`;
  } else {
    // Κανονική περίπτωση (π.χ. 3,5 -> "3 και 5 δέκατα" / "3 κόμμα 5")
    way1 = `${integerPart} και ${parseInt(decimalPartString, 10)} ${decimalPartName}`;
    way2 = `${integerPart} κόμμα ${decimalPartString}`;
  }

  const handleRandomize = () => {
    if (mode === 'tenths') {
      setNumerator(getRandomInt(1, 99));
    } else {
      setNumerator(getRandomInt(1, 499));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🔢 Δεκαδικοί Αριθμοί & Δεκαδικά Κλάσματα - LearnMaths.gr</title>
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
              <Link href="/d-dimotikou/6-dekadikoi-ask" className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2">
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
          <div className="bg-gradient-to-r from-teal-600 via-indigo-600 to-purple-600 text-white p-8 rounded-3xl shadow-md relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-3">
                <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                  Δ' ΔΗΜΟΤΙΚΟΥ • ΕΝΟΤΗΤΑ 6
                </span>
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
                  🔢 Δεκαδικοί Αριθμοί & Δεκαδικά Κλάσματα
                </h1>
                <p className="text-teal-100 text-base lg:text-lg leading-relaxed">
                  Μαθαίνουμε τα δέκατα, τα εκατοστά, την υποδιαστολή και πώς μετατρέπουμε τα δεκαδικά κλάσματα σε δεκαδικούς αριθμούς!
                </p>
              </div>

              {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
                <div className="text-3xl">🚀</div>
                <h3 className="font-extrabold text-white text-lg">Έτοιμος για εξάσκηση;</h3>
                <p className="text-xs text-teal-100">Δοκίμασε τις ασκήσεις στους δεκαδικούς αριθμούς για να σιγουρευτείς ότι τους έμαθες!</p>
                <Link 
                  href="/d-dimotikou/6-dekadikoi-ask"
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
              
              {/* Δεκαδικά Κλάσματα */}
              <div className="bg-teal-50/70 p-6 rounded-2xl border border-teal-100 space-y-3">
                <h3 className="text-lg font-bold text-teal-900 flex items-center gap-2">
                  <span>🍰</span> Δεκαδικά Κλάσματα
                </h3>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                  <strong>Δεκαδικά κλάσματα</strong> λέγονται τα κλάσματα που έχουν παρανομαστή το <strong>10</strong> ή το <strong>100</strong> (ή το 1000):
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 font-mono font-bold">
                      <span className="inline-flex flex-col items-center leading-none text-xs">
                        <span>1</span>
                        <span className="border-b border-gray-800 w-full"></span>
                        <span>10</span>
                      </span>
                      <span>= 1 Δέκατο</span>
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 font-mono font-bold">
                      <span className="inline-flex flex-col items-center leading-none text-xs">
                        <span>1</span>
                        <span className="border-b border-gray-800 w-full"></span>
                        <span>100</span>
                      </span>
                      <span>= 1 Εκατοστό</span>
                    </span>
                  </li>
                </ul>
              </div>

              {/* Δεκαδικοί Αριθμοί */}
              <div className="bg-indigo-50/70 p-6 rounded-2xl border border-indigo-100 space-y-3">
                <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
                  <span>✏️</span> Δεκαδικοί Αριθμοί
                </h3>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                  Κάθε δεκαδικό κλάσμα γράφεται και ως <strong>δεκαδικός αριθμός</strong> χρησιμοποιώντας την <strong>υποδιαστολή ( κόμμα «,» )</strong>:
                </p>
                <ul className="space-y-2 text-sm text-gray-700 font-mono">
                  <li className="flex items-center gap-2">
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <span className="inline-flex flex-col items-center leading-none text-xs">
                        <span>3</span>
                        <span className="border-b border-gray-800 w-full"></span>
                        <span>10</span>
                      </span>
                      <span>= <strong>0,3</strong> (1 δεκαδικό ψηφίο)</span>
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <span className="inline-flex flex-col items-center leading-none text-xs">
                        <span>25</span>
                        <span className="border-b border-gray-800 w-full"></span>
                        <span>100</span>
                      </span>
                      <span>= <strong>0,25</strong> (2 δεκαδικά ψηφία)</span>
                    </span>
                  </li>
                </ul>
              </div>

            </div>

            {/* ΑΝΑΛΥΣΗ ΘΕΣΗΣ ΨΗΦΙΟΥ */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
              <h3 className="text-lg font-extrabold text-gray-800">
                🔍 Τα μέρη του Δεκαδικού Αριθμού: <span className="text-indigo-600 font-mono">3,54</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                
                <div className="bg-white p-5 rounded-xl border border-gray-200 space-y-2">
                  <h4 className="font-bold text-blue-700 border-b pb-1">1. Ακέραιο Μέρος (πριν το κόμμα)</h4>
                  <p className="text-xs text-gray-600">
                    Δείχνει τις ολόκληρες μονάδες.
                  </p>
                  <p className="font-mono font-bold text-gray-800 bg-blue-50 p-2 rounded-lg text-center">
                    <span className="text-blue-600 text-lg">3</span> , 54  ➔ <strong>3 Μονάδες (Μ)</strong>
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 space-y-2">
                  <h4 className="font-bold text-purple-700 border-b pb-1">2. Δεκαδικό Μέρος (μετά το κόμμα)</h4>
                  <p className="text-xs text-gray-600">
                    Δείχνει τα κομμάτια της μονάδας.
                  </p>
                  <p className="font-mono font-bold text-gray-800 bg-purple-50 p-2 rounded-lg text-center">
                    3 , <span className="text-teal-600 text-lg">5</span><span className="text-amber-600 text-lg">4</span> ➔ <strong>5 Δέκατα (δ) & 4 Εκατοστά (ε)</strong>
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
                  <span>🧮</span> Διαδραστικός Μετατροπέας Κλασμάτων & Δεκαδικών
                </h2>
                <p className="text-gray-500 text-sm">
                  Άλλαξε τον αριθμητή και δες πώς μετατρέπεται το δεκαδικό κλάσμα σε δεκαδικό αριθμό!
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => { setMode('tenths'); setNumerator(35); }}
                  className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black transition ${
                    mode === 'tenths' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  1 Δεκαδικό ( /10 )
                </button>
                <button
                  onClick={() => { setMode('hundredths'); setNumerator(145); }}
                  className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black transition ${
                    mode === 'hundredths' ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  2 Δεκαδικά ( /100 )
                </button>
                <button
                  onClick={handleRandomize}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2 rounded-xl text-xs md:text-sm transition shadow-sm"
                >
                  🎲 Τυχαίος
                </button>
              </div>
            </div>

            {/* SLIDER ΧΕΙΡΙΣΜΟΥ */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-2">
              <label className="block text-xs font-black uppercase text-gray-500">
                Αριθμητής Κλάσματος: <span className="text-indigo-600 font-mono text-lg font-black">{numerator}</span>
              </label>
              <input 
                type="range" 
                min="1" 
                max={mode === 'tenths' ? 99 : 499} 
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
                  <span>{denominator}</span>
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
                
                <div className="grid grid-cols-4 gap-1 text-center font-mono text-xs">
                  <div className="bg-blue-600/30 text-blue-300 p-2 rounded-lg font-bold">Μονάδες (Μ)</div>
                  <div className="bg-slate-700 text-slate-300 p-2 rounded-lg font-bold">,</div>
                  <div className="bg-teal-600/30 text-teal-300 p-2 rounded-lg font-bold">Δέκατα (δ)</div>
                  <div className="bg-amber-600/30 text-amber-300 p-2 rounded-lg font-bold">Εκατοστά (ε)</div>

                  <div className="bg-slate-800 text-2xl font-black text-blue-400 p-2 rounded-lg">{integerPart}</div>
                  <div className="bg-slate-800 text-2xl font-black text-slate-400 p-2 rounded-lg">,</div>
                  <div className="bg-slate-800 text-2xl font-black text-teal-400 p-2 rounded-lg">{tenthsDigit}</div>
                  <div className="bg-slate-800 text-2xl font-black text-amber-400 p-2 rounded-lg">{mode === 'hundredths' ? hundredthsDigit : '-'}</div>
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
                Έμαθες τους δεκαδικούς αριθμούς και τα δεκαδικά κλάσματα; Δοκίμασε τις διαδραστικές ασκήσεις!
              </p>
            </div>
            <Link
              href="/d-dimotikou/6-dekadikoi-ask"
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
