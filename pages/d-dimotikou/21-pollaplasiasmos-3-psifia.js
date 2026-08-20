import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

function formatNumber(num) {
  if (num === '' || isNaN(num)) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export default function Pollaplasiasmos3PsifiaPage() {
  // Κατάσταση για τον διαδραστικό υπολογιστή μερικών γινομένων
  const [numA, setNumA] = useState(245);
  const [numB, setNumB] = useState(135);

  // Υπολογισμοί με ασφάλεια αν το πεδίο σβηστεί προσωρινά
  const valA = typeof numA === 'number' ? numA : 0;
  const valB = typeof numB === 'number' ? numB : 0;

  const unitsB = valB % 10;
  const tensB = Math.floor((valB % 100) / 10);
  const hundredsB = Math.floor(valB / 100);

  const p1 = valA * unitsB;          // 1ο μερικό γινόμενο
  const p2 = valA * tensB * 10;      // 2ο μερικό γινόμενο
  const p3 = valA * hundredsB * 100; // 3ο μερικό γινόμενο
  const total = valA * valB;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>✖️ Πολλαπλασιασμός 3ψηφιων Αριθμών - LearnMaths.gr</title>
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
              <Link href="/d-dimotikou/21-pollaplasiasmos-3-psifia-ask" className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2">
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
          
          {/* HEADER BANNER */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white p-8 rounded-3xl shadow-md relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-3">
                <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                  Δ' ΔΗΜΟΤΙΚΟΥ
                </span>
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
                  ✖️ Πολλαπλασιασμός 3ψηφιων Αριθμών
                </h1>
                <p className="text-emerald-100 text-base lg:text-lg leading-relaxed">
                  Μαθαίνουμε να εκτελούμε τον "κάθετο πολλαπλασιασμό τριψήφιου αριθμού" υπολογίζοντας τα "μερικά γινόμενα"!
                </p>
              </div>

              {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
                <div className="text-3xl">🚀</div>
                <h3 className="font-extrabold text-white text-lg">Έτοιμος για εξάσκηση;</h3>
                <p className="text-xs text-emerald-100">Δοκίμασε τις ασκήσεις στον πολλαπλασιασμό 3ψηφίων για να σιγουρευτείς ότι τον έμαθες!</p>
                <Link 
                  href="/d-dimotikou/21-pollaplasiasmos-3-psifia-ask"
                  className="inline-block w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-black py-3 px-4 rounded-xl shadow-md transition transform hover:-translate-y-0.5 text-sm"
                >
                  🎯 Μετάβαση στις Ασκήσεις
                </Link>
              </div>
            </div>
          </div>

          {/* ΘΕΩΡΙΑ - ΤΑ 3 ΒΗΜΑΤΑ */}
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 space-y-8">
            <div className="border-b pb-4 border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <span>📖</span> Πώς κάνουμε Κάθετο Πολλαπλασιασμό 3ψηφίων
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* ΒΗΜΑ 1 */}
              <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 space-y-3">
                <div className="bg-amber-500 text-white font-black text-xs px-3 py-1 rounded-full w-fit">
                  ΒΗΜΑ 1ο
                </div>
                <h3 className="text-lg font-bold text-amber-900">
                  1ο Μερικό Γινόμενο (Μονάδες)
                </h3>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  Πολλαπλασιάζουμε τον πάνω αριθμό με τις "Μονάδες" του κάτω αριθμού.
                </p>
              </div>

              {/* ΒΗΜΑ 2 */}
              <div className="bg-teal-50 p-6 rounded-2xl border border-teal-100 space-y-3">
                <div className="bg-teal-600 text-white font-black text-xs px-3 py-1 rounded-full w-fit">
                  ΒΗΜΑ 2ο
                </div>
                <h3 className="text-lg font-bold text-teal-900">
                  2ο Μερικό Γινόμενο (Δεκάδες)
                </h3>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  Βάζουμε ένα μηδενικό (0) στη θέση των μονάδων (ή αφήνουμε 1 κενό) και πολλαπλασιάζουμε με τις "Δεκάδες".
                </p>
              </div>

              {/* ΒΗΜΑ 3 */}
              <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 space-y-3">
                <div className="bg-purple-600 text-white font-black text-xs px-3 py-1 rounded-full w-fit">
                  ΒΗΜΑ 3ο
                </div>
                <h3 className="text-lg font-bold text-purple-900">
                  3ο Μερικό Γινόμενο (Εκατοντάδες)
                </h3>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  Βάζουμε δύο μηδενικά (00) (ή αφήνουμε 2 κενά) και πολλαπλασιάζουμε με τις "Εκατοντάδες".
                </p>
              </div>

            </div>
          </div>

          {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ - ΚΑΘΕΤΟΣ ΑΒΑΚΑΣ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΥ */}
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="border-b pb-4 border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <span>🧮</span> Διαδραστική Αναπαράσταση Κάθετου Πολλαπλασιασμού
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Αλλάξτε τους αριθμούς για να δείτε πώς υπολογίζονται αυτόματα τα μερικά γινόμενα και το τελικό άθροισμα!
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              
              {/* ΧΕΙΡΙΣΤΗΡΙΑ ΕΙΣΑΓΩΓΗΣ ΑΡΙΘΜΩΝ */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="font-extrabold text-gray-800 text-base">
                  ⚙️ Επίλεξε Αριθμούς:
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">
                      1ος Αριθμός (100 έως 999):
                    </label>
                    <input 
                      type="text"
                      inputMode="numeric"
                      maxLength={3}
                      autoComplete="off"
                      value={numA}
                      onChange={(e) => {
                        const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 3);
                        if (digitsOnly === '') {
                          setNumA('');
                        } else {
                          setNumA(Number(digitsOnly));
                        }
                      }}
                      onBlur={() => {
                        if (!numA || numA < 100) setNumA(100);
                      }}
                      className="w-full p-3 rounded-xl border border-gray-300 font-mono font-bold text-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">
                      2ος Αριθμός (0 έως 999):
                    </label>
                    <input 
                      type="text"
                      inputMode="numeric"
                      maxLength={3}
                      autoComplete="off"
                      value={numB}
                      onChange={(e) => {
                        const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 3);
                        if (digitsOnly === '') {
                          setNumB('');
                        } else {
                          setNumB(Number(digitsOnly));
                        }
                      }}
                      onBlur={() => {
                        if (numB === '') setNumB(0);
                      }}
                      className="w-full p-3 rounded-xl border border-gray-300 font-mono font-bold text-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-amber-900 text-xs space-y-1">
                  <p className="font-bold">💡 Αναλυτικά Μερικά Γινόμενα:</p>
                  <p>• 1ο Μερικό (Μονάδες): {valA} × {unitsB} = {formatNumber(p1)}</p>
                  <p>• 2ο Μερικό (Δεκάδες): {valA} × {tensB * 10} = {formatNumber(p2)}</p>
                  <p>• 3ο Μερικό (Εκατοντάδες): {valA} × {hundredsB * 100} = {formatNumber(p3)}</p>
                </div>
              </div>

              {/* ΟΠΤΙΚΟΠΟΙΗΣΗ ΚΑΘΕΤΗΣ ΠΡΑΞΗΣ */}
              <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl font-mono flex flex-col items-center justify-center space-y-2">
                <div className="w-52 text-right space-y-2">
                  
                  {/* 1ος Αριθμός */}
                  <div className="text-2xl md:text-3xl font-black text-slate-100 tracking-widest">
                    {formatNumber(valA)}
                  </div>

                  {/* 2ος Αριθμός με το σύμβολο × */}
                  <div className="text-2xl md:text-3xl font-black text-amber-400 tracking-widest border-b-2 border-slate-700 pb-2 relative">
                    <span className="absolute left-0 text-amber-400">×</span>
                    {formatNumber(valB)}
                  </div>

                  {/* 1ο Μερικό Γινόμενο */}
                  <div className="text-lg md:text-xl font-bold text-emerald-400 tracking-widest pt-1">
                    {formatNumber(p1)}
                  </div>

                  {/* 2ο Μερικό Γινόμενο */}
                  <div className="text-lg md:text-xl font-bold text-teal-300 tracking-widest">
                    {p2 > 0 ? formatNumber(p2) : '0'}
                  </div>

                  {/* 3ο Μερικό Γινόμενο */}
                  <div className="text-lg md:text-xl font-bold text-purple-300 tracking-widest border-b-2 border-slate-700 pb-2">
                    {p3 > 0 ? formatNumber(p3) : '0'}
                  </div>

                  {/* Τελικό Αποτέλεσμα */}
                  <div className="text-2xl md:text-3xl font-black text-amber-300 tracking-widest pt-2">
                    {formatNumber(total)}
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
                Έμαθες να εκτελείς τον πολλαπλασιασμό τριψήφιων αριθμών; Δοκίμασε τις διαδραστικές ασκήσεις!
              </p>
            </div>
            <Link
              href="/d-dimotikou/21-pollaplasiasmos-3-psifia-ask"
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
