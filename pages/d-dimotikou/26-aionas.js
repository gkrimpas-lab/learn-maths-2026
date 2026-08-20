import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

function formatNumber(num) {
  if (num === '' || isNaN(num)) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Μετατροπή αιώνα σε λατινική γραφή (π.χ. 21 -> XXI, 30 -> XXX)
function toRoman(num) {
  const romanMap = [
    { val: 30, str: 'XXX' },
    { val: 29, str: 'XXIX' },
    { val: 28, str: 'XXVIII' },
    { val: 27, str: 'XXVII' },
    { val: 26, str: 'XXVI' },
    { val: 25, str: 'XXV' },
    { val: 24, str: 'XXIV' },
    { val: 23, str: 'XXIII' },
    { val: 22, str: 'XXII' },
    { val: 21, str: 'XXI' },
    { val: 20, str: 'XX' },
    { val: 19, str: 'XIX' },
    { val: 18, str: 'XVIII' },
    { val: 17, str: 'XVII' },
    { val: 16, str: 'XVI' },
    { val: 15, str: 'XV' },
    { val: 14, str: 'XIV' },
    { val: 13, str: 'XIII' },
    { val: 12, str: 'XII' },
    { val: 11, str: 'XI' },
    { val: 10, str: 'X' },
    { val: 9, str: 'IX' },
    { val: 8, str: 'VIII' },
    { val: 7, str: 'VII' },
    { val: 6, str: 'VI' },
    { val: 5, str: 'V' },
    { val: 4, str: 'IV' },
    { val: 3, str: 'III' },
    { val: 2, str: 'II' },
    { val: 1, str: 'I' }
  ];
  const found = romanMap.find(item => item.val === num);
  return found ? found.str : `${num}ος`;
}

export default function AionasTheoryPage() {
  const [yearInput, setYearInput] = useState(2026);

  const y = typeof yearInput === 'number' && yearInput > 0 ? yearInput : 1;

  // Υπολογισμός Αιώνα
  const century = Math.floor((y - 1) / 100) + 1;
  const startYear = (century - 1) * 100 + 1;
  const endYear = century * 100;

  // Έλεγχος Δίσεκτου Έτους (Κανόνας Γρηγοριανού)
  const isLeap = (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
  const daysInYear = isLeap ? 366 : 365;

  const setHistoricalPreset = (year) => {
    setYearInput(year);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>📅 Ημέρα, Μήνας, Έτος, Αιώνας και Δίσεκτα Έτη - LearnMaths.gr</title>
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
              <Link href="/d-dimotikou/26-aionas-ask" className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2">
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
                  Δ' ΔΗΜΟΤΙΚΟΥ
                </span>
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
                  📅 Ημέρες, Μήνες, Έτη, Αιώνες και Δίσεκτα Έτη
                </h1>
                <p className="text-purple-100 text-base lg:text-lg leading-relaxed">
                  Μαθαίνουμε πώς μετράμε τον χρόνο σε "εβδομάδες, μήνες, χρόνια και αιώνες", τι είναι τα "δίσεκτα έτη" και πώς βρίσκουμε εύκολα σε ποιον αιώνα ανήκει κάθε χρονιά!
                </p>
              </div>

              {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
                <div className="text-3xl">🚀</div>
                <h3 className="font-extrabold text-white text-lg">Έτοιμος για εξάσκηση;</h3>
                <p className="text-xs text-purple-100">Δοκίμασε τις διαδραστικές ασκήσεις για τους αιώνες και τα δίσεκτα έτη!</p>
                <Link 
                  href="/d-dimotikou/26-aionas-ask"
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
                <span>📖</span> Οι Μεγάλες Μονάδες Μέτρησης του Χρόνου
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* 1. Εβδομάδα, Μήνας και Χρόνος */}
              <div className="bg-blue-50/70 p-6 rounded-2xl border border-blue-100 space-y-3">
                <h3 className="text-lg font-bold text-blue-950 flex items-center gap-2">
                  <span>🗓️</span> Εβδομάδα, Μήνας & Έτος
                </h3>
                <ul className="space-y-1.5 text-xs md:text-sm text-gray-700 font-medium">
                  <li>• <strong>1 εβδομάδα</strong> = 7 ημέρες</li>
                  <li>• <strong>1 μήνας</strong> = 30 ή 31 ημέρες</li>
                  <li>• <strong>1 έτος (χρόνος)</strong> = 12 μήνες</li>
                  <li>• <strong>1 έτος</strong> = 52 εβδομάδες</li>
                  <li>• <strong>1 κοινό έτος</strong> = 365 ημέρες</li>
                </ul>
              </div>

              {/* 2. Δίσεκτο Έτος */}
              <div className="bg-amber-50/70 p-6 rounded-2xl border border-amber-100 space-y-3">
                <h3 className="text-lg font-bold text-amber-950 flex items-center gap-2">
                  <span>❄️</span> Τι είναι το Δίσεκτο Έτος;
                </h3>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  Κάθε <strong>4 χρόνια</strong> έχουμε <strong>δίσεκτο έτος</strong>, το οποίο έχει <strong>366 ημέρες</strong> (1 ημέρα παραπάνω).
                </p>
                <div className="bg-white p-3 rounded-xl border border-amber-200 text-xs text-amber-900 font-bold">
                  💡 Τότε ο Φεβρουάριος έχει <strong>29 ημέρες</strong> αντί για 28!
                </div>
              </div>

              {/* 3. Δεκαετία, Αιώνας & Χιλιετία */}
              <div className="bg-purple-50/70 p-6 rounded-2xl border border-purple-100 space-y-3">
                <h3 className="text-lg font-bold text-purple-950 flex items-center gap-2">
                  <span>🏛️</span> Δεκαετία, Αιώνας, Χιλιετία
                </h3>
                <ul className="space-y-1.5 text-xs md:text-sm text-gray-700 font-medium">
                  <li>• <strong>1 δεκαετία</strong> = 10 χρόνια</li>
                  <li>• <strong>1 αιώνας (αι.)</strong> = 100 χρόνια</li>
                  <li>• <strong>1 χιλιετία</strong> = 1.000 χρόνια (ή 10 αιώνες)</li>
                </ul>
              </div>

            </div>

            {/* ΠΩΣ ΒΡΙΣΚΟΥΜΕ ΤΟΝ ΑΙΩΝΑ */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 md:p-8 rounded-2xl border border-indigo-100 space-y-4">
              <h3 className="text-lg font-extrabold text-indigo-950 flex items-center gap-2">
                <span>🔍</span> Ο Χρυσός Κανόνας: Πώς βρίσκουμε σε ποιον αιώνα ανήκει ένα έτος;
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
                <div className="bg-white p-5 rounded-2xl border border-indigo-100 space-y-2">
                  <h4 className="font-black text-indigo-900">Περίπτωση 1: Το έτος ΔΕΝ τελειώνει σε «00»</h4>
                  <p className="text-gray-700 leading-relaxed">
                    Κοιτάμε τα πρώτα ψηφία (τις εκατοντάδες) και <strong>προσθέτουμε 1 (+1)</strong>!
                  </p>
                  <ul className="space-y-1 text-gray-600 font-mono">
                    <li>• Το έτος <strong>18</strong>21 → 18 + 1 = <strong>19ος αιώνας (XIX)</strong></li>
                    <li>• Το έτος <strong>20</strong>26 → 20 + 1 = <strong>21ος αιώνας (XXI)</strong></li>
                    <li>• Το έτος <strong>4</strong>80 π.Χ. → 4 + 1 = <strong>5ος αιώνας (V)</strong></li>
                  </ul>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-indigo-100 space-y-2">
                  <h4 className="font-black text-purple-900">Περίπτωση 2: Το έτος ΤΕΛΕΙΩΝΕΙ σε «00»</h4>
                  <p className="text-gray-700 leading-relaxed">
                    Ο αιώνας είναι <strong>ακριβώς τα πρώτα ψηφία</strong> (δεν προσθέτουμε τίποτα)!
                  </p>
                  <ul className="space-y-1 text-gray-600 font-mono">
                    <li>• Το έτος <strong>19</strong>00 → <strong>19ος αιώνας (XIX)</strong></li>
                    <li>• Το έτος <strong>20</strong>00 → <strong>20ος αιώνας (XX)</strong></li>
                    <li>• Το έτος <strong>15</strong>00 → <strong>15ος αιώνας (XV)</strong></li>
                  </ul>
                </div>
              </div>
            </div>

          </div>

          {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ - SECTION 2 */}
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4 border-gray-100">
              <div>
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <span>🧮</span> Διαδραστικός Υπολογιστής Αιώνα και Δίσεκτου Έτους
                </h2>
                <p className="text-gray-500 text-sm">
                  Γράψε οποιαδήποτε χρονιά ή διάλεξε ένα ιστορικό ορόσημο για να δεις αυτόματα τον αιώνα και τα στοιχεία της!
                </p>
              </div>

              {/* ΠΡΟΕΠΙΛΟΓΕΣ ΧΡΟΝΙΩΝ */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setHistoricalPreset(1821)}
                  className="px-3 py-2 rounded-xl text-xs font-black bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                >
                  🇬🇷 1821 (Επανάσταση)
                </button>
                <button
                  onClick={() => setHistoricalPreset(1940)}
                  className="px-3 py-2 rounded-xl text-xs font-black bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                >
                  🎖️ 1940 (Έπος '40)
                </button>
                <button
                  onClick={() => setHistoricalPreset(2000)}
                  className="px-3 py-2 rounded-xl text-xs font-black bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                >
                  ✨ 2000 (Millennium)
                </button>
                <button
                  onClick={() => setHistoricalPreset(2026)}
                  className="px-3 py-2 rounded-xl text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold transition"
                >
                  🚀 2026 (Σήμερα)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              
              {/* ΧΕΙΡΙΣΤΗΡΙΑ ΕΙΣΑΓΩΓΗΣ ΧΡΟΝΙΑΣ */}
              <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200 space-y-5">
                <h3 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
                  <span>⚙️</span> Επίλεξε Έτος (Χρονιά):
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-gray-600 mb-1">
                      Έτος (1 έως 3.000):
                    </label>
                    <input 
                      type="number"
                      min="1"
                      max="3000"
                      autoComplete="off"
                      value={yearInput}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '') setYearInput('');
                        else setYearInput(Math.min(3000, Number(val)));
                      }}
                      onBlur={() => {
                        if (!yearInput || yearInput < 1) setYearInput(1);
                      }}
                      className="w-full p-3.5 rounded-2xl border border-gray-300 font-mono font-bold text-2xl text-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <input 
                    type="range" 
                    min="1" 
                    max="3000" 
                    value={y} 
                    onChange={(e) => setYearInput(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 text-xs text-gray-700 space-y-2 shadow-sm">
                  <p>• <strong>Διάρκεια Αιώνα:</strong> Από το έτος <strong>{formatNumber(startYear)}</strong> έως και το έτος <strong>{formatNumber(endYear)}</strong>.</p>
                  <p>• <strong>Φεβρουάριος {y}:</strong> Έχει <strong>{isLeap ? '29 ημέρες (Δίσεκτο)' : '28 ημέρες (Κοινό)'}</strong>.</p>
                </div>
              </div>

              {/* ΟΠΤΙΚΟΠΟΙΗΣΗ ΑΠΟΤΕΛΕΣΜΑΤΩΝ */}
              <div className="bg-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl space-y-5 text-center">
                
                <span className="text-[11px] font-black uppercase tracking-widest text-indigo-400 block">
                  Αποτελεσματα για το ετος {y}
                </span>

                {/* Badge Αιώνα */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-2xl border border-indigo-400/30 space-y-1 shadow-lg">
                  <span className="text-xs font-bold text-indigo-200 block uppercase">Ανηκει στον:</span>
                  <div className="text-3xl md:text-4xl font-black text-amber-300 font-mono">
                    {century}ο Αιώνα
                  </div>
                  <span className="text-sm font-bold text-indigo-100 block font-mono">
                    (Λατινικά: {toRoman(century)})
                  </span>
                </div>

                {/* Στοιχεία Δίσεκτου Έτους & Ημερών */}
                <div className="grid grid-cols-2 gap-3 text-center font-mono">
                  <div className={`p-3 rounded-2xl border ${isLeap ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-300'}`}>
                    <span className="text-[10px] uppercase font-sans font-bold block text-slate-400">Ειδος Ετους</span>
                    <span className="text-base font-black">{isLeap ? '✨ Δίσεκτο' : 'Κοινό Έτος'}</span>
                  </div>

                  <div className="p-3 bg-slate-800 rounded-2xl border border-slate-700 text-slate-200">
                    <span className="text-[10px] uppercase font-sans font-bold block text-slate-400">Ημερες Χρονιας</span>
                    <span className="text-base font-black text-amber-300">{daysInYear} ημέρες</span>
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
                Έμαθες να βρίσκεις τους αιώνες και να ξεχωρίζεις τα δίσεκτα έτη; Δοκίμασε τις διαδραστικές ασκήσεις!
              </p>
            </div>
            <Link
              href="/d-dimotikou/26-aionas-ask"
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
