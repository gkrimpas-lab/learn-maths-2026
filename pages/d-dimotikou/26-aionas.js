// pages/d-dimotikou/26-aionas.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

function formatNumber(num) {
  if (num === '' || isNaN(num)) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
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
  const found = romanMap.find((item) => item.val === num);
  return found ? found.str : `${num}ος`;
}

export default function AionasTheoryPage() {
  const [yearInput, setYearInput] = useState(2026);

  const y = typeof yearInput === 'number' && yearInput > 0 ? yearInput : 1;

  // Υπολογισμός Αιώνα
  const century = Math.floor((y - 1) / 100) + 1;
  const startYear = (century - 1) * 100 + 1;
  const endYear = century * 100;

  // Έλεγχος Δίσεκτου Έτους (Κανόνας Γρηγοριανού Ημερολογίου)
  const isLeap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  const daysInYear = isLeap ? 366 : 365;

  const setHistoricalPreset = (e, year) => {
    e.preventDefault();
    e.stopPropagation();
    setYearInput(year);
  };

  const updateYear = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setYearInput((prev) => Math.max(1, Math.min(3000, (Number(prev) || 1) + delta)));
  };

  return (
    <Layout
      title="Ημέρες, Μήνες, Έτη, Αιώνες & Δίσεκτα Έτη - Θεωρία | LearnMaths.gr"
      description="Μαθαίνουμε πώς υπολογίζουμε τους αιώνες, πώς ξεχωρίζουμε τα δίσεκτα έτη και πώς συνδέονται οι μονάδες μέτρησης χρόνου με διαδραστικό εργαστήριο."
      backUrl="/d-dimotikou"
      backText="Δ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/d-dimotikou/26-aionas-ask"
          className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>🎯</span> Ασκήσεις
        </Link>
      }
    >
      <div className="space-y-8">
        {/* HEADER & EXERCISES PROMO CARD */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                Δ' ΔΗΜΟΤΙΚΟΥ
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                📅 Ημέρες, Μήνες, Έτη, Αιώνες και Δίσεκτα Έτη
              </h1>
              <p className="text-purple-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                Μαθαίνουμε πώς μετράμε τον χρόνο σε εβδομάδες, μήνες, χρόνια και αιώνες, τι ακριβώς είναι τα <strong>δίσεκτα έτη</strong> και πώς βρίσκουμε εύκολα σε ποιον αιώνα ανήκει οποιαδήποτε χρονιά!
              </p>
            </div>

            {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
              <div className="text-3xl">🚀</div>
              <h3 className="font-extrabold text-white text-lg">Έτοιμος για εξάσκηση;</h3>
              <p className="text-xs text-purple-100">
                Δοκίμασε τις διαδραστικές ασκήσεις για να σιγουρευτείς ότι κατέκτησες τους αιώνες και τα δίσεκτα έτη!
              </p>
              <Link
                href="/d-dimotikou/26-aionas-ask"
                className="inline-block w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-3 px-4 rounded-xl shadow-md transition transform hover:-translate-y-0.5 text-sm"
              >
                🎯 Μετάβαση στις Ασκήσεις
              </Link>
            </div>
          </div>
        </div>

        {/* ΘΕΩΡΙΑ - SECTION 1 */}
        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-8">
          <div className="border-b pb-4 border-slate-100">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>📖</span> Οι Μεγάλες Μονάδες Μέτρησης του Χρόνου
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Εβδομάδα, Μήνας και Χρόνος */}
            <div className="bg-blue-50/70 p-5 sm:p-6 rounded-2xl border border-blue-100 space-y-3 shadow-sm">
              <h3 className="text-base sm:text-lg font-bold text-blue-950 flex items-center gap-2">
                <span>🗓️</span> Εβδομάδα, Μήνας & Έτος
              </h3>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 font-medium">
                <li>• <strong>1 εβδομάδα</strong> ＝ 7 ημέρες</li>
                <li>• <strong>1 μήνας</strong> ＝ 30 ή 31 ημέρες (Φεβρ.: 28 ή 29)</li>
                <li>• <strong>1 έτος (χρόνος)</strong> ＝ 12 μήνες</li>
                <li>• <strong>1 έτος</strong> ＝ 52 εβδομάδες</li>
                <li>• <strong>1 κοινό έτος</strong> ＝ 365 ημέρες</li>
              </ul>
            </div>

            {/* 2. Δίσεκτο Έτος */}
            <div className="bg-amber-50/70 p-5 sm:p-6 rounded-2xl border border-amber-100 space-y-3 shadow-sm">
              <h3 className="text-base sm:text-lg font-bold text-amber-950 flex items-center gap-2">
                <span>❄️</span> Τι είναι το Δίσεκτο Έτος;
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Κάθε <strong>4 χρόνια</strong> έχουμε <strong>δίσεκτο έτος</strong>, το οποίο διαρκεί <strong>366 ημέρες</strong> (1 ημέρα παραπάνω).
              </p>
              <div className="bg-white p-3 rounded-xl border border-amber-200 text-xs text-amber-950 font-bold shadow-sm">
                💡 Τότε ο Φεβρουάριος έχει <strong>29 ημέρες</strong> αντί για 28!
              </div>
            </div>

            {/* 3. Δεκαετία, Αιώνας & Χιλιετία */}
            <div className="bg-purple-50/70 p-5 sm:p-6 rounded-2xl border border-purple-100 space-y-3 shadow-sm">
              <h3 className="text-base sm:text-lg font-bold text-purple-950 flex items-center gap-2">
                <span>🏛️</span> Δεκαετία, Αιώνας, Χιλιετία
              </h3>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 font-medium">
                <li>• <strong>1 δεκαετία</strong> ＝ 10 χρόνια</li>
                <li>• <strong>1 αιώνας (αι.)</strong> ＝ 100 χρόνια</li>
                <li>• <strong>1 χιλιετία</strong> ＝ 1.000 χρόνια (ή 10 αιώνες)</li>
              </ul>
            </div>
          </div>

          {/* ΠΩΣ ΒΡΙΣΚΟΥΜΕ ΤΟΝ ΑΙΩΝΑ */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 sm:p-8 rounded-3xl border border-indigo-100 space-y-4 shadow-sm">
            <h3 className="text-base sm:text-lg font-extrabold text-indigo-950 flex items-center gap-2">
              <span>🔍</span> Ο Χρυσός Κανόνας: Σε ποιον αιώνα ανήκει ένα έτος;
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-indigo-100 space-y-2 shadow-sm">
                <h4 className="font-black text-indigo-900">
                  Περίπτωση 1: Το έτος ΔΕΝ τελειώνει σε «00»
                </h4>
                <p className="text-slate-700 leading-relaxed">
                  Κοιτάμε τα πρώτα ψηφία (τις εκατοντάδες) και <strong>προσθέτουμε 1 (＋1)</strong>!
                </p>
                <ul className="space-y-1 text-slate-700 font-mono font-bold">
                  <li>• Το έτος <strong>18</strong>21 → 18 ＋ 1 ＝ <strong>19ος αιώνας (XIX)</strong></li>
                  <li>• Το έτος <strong>20</strong>26 → 20 ＋ 1 ＝ <strong>21ος αιώνας (XXI)</strong></li>
                  <li>• Το έτος <strong>4</strong>80 π.Χ. → 4 ＋ 1 ＝ <strong>5ος αιώνας (V)</strong></li>
                </ul>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-indigo-100 space-y-2 shadow-sm">
                <h4 className="font-black text-purple-900">
                  Περίπτωση 2: Το έτος ΤΕΛΕΙΩΝΕΙ σε «00»
                </h4>
                <p className="text-slate-700 leading-relaxed">
                  Ο αιώνας ισούται <strong>ακριβώς με τα πρώτα ψηφία</strong> (δεν προσθέτουμε τίποτα)!
                </p>
                <ul className="space-y-1 text-slate-700 font-mono font-bold">
                  <li>• Το έτος <strong>19</strong>00 → <strong>19ος αιώνας (XIX)</strong></li>
                  <li>• Το έτος <strong>20</strong>00 → <strong>20ός αιώνας (XX)</strong></li>
                  <li>• Το έτος <strong>15</strong>00 → <strong>15ος αιώνας (XV)</strong></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ - SECTION 2 */}
        <div className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4 border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🧮</span> Διαδραστικός Υπολογιστής Αιώνα και Δίσεκτου Έτους
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                Πληκτρολόγησε οποιαδήποτε χρονιά ή διάλεξε ένα ιστορικό έτος για να δεις αυτόματα τον αιώνα και τα χαρακτηριστικά της!
              </p>
            </div>

            {/* ΠΡΟΕΠΙΛΟΓΕΣ ΧΡΟΝΙΩΝ */}
            <div className="flex flex-wrap gap-1.5 self-start sm:self-auto">
              <button
                onClick={(e) => setHistoricalPreset(e, 1821)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition active:scale-95 touch-manipulation"
              >
                🇬🇷 1821 (Επανάσταση)
              </button>
              <button
                onClick={(e) => setHistoricalPreset(e, 1940)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition active:scale-95 touch-manipulation"
              >
                🎖️ 1940 (Έπος '40)
              </button>
              <button
                onClick={(e) => setHistoricalPreset(e, 2000)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition active:scale-95 touch-manipulation"
              >
                ✨ 2000 (Millennium)
              </button>
              <button
                onClick={(e) => setHistoricalPreset(e, 2026)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition active:scale-95 touch-manipulation"
              >
                🚀 2026 (Σήμερα)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* ΧΕΙΡΙΣΤΗΡΙΑ ΕΙΣΑΓΩΓΗΣ ΧΡΟΝΙΑΣ (ΚΑΝΟΝΑΣ 2) */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <span>⚙️</span> Ρύθμιση Έτους:
              </h3>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="h-8 flex items-center justify-between text-center px-1">
                  <span className="text-[11px] font-black uppercase text-slate-500">ΕΤΟΣ (1 - 3.000)</span>
                  <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-indigo-600 text-base">
                    {formatNumber(y)}
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    onClick={(e) => updateYear(e, -1)}
                    className="w-9 h-9 shrink-0 flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation shadow-sm"
                    title="Μείωση κατά 1 έτος"
                    aria-label="Μείωση έτους"
                  >
                    －
                  </button>

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    autoComplete="off"
                    id="input-year"
                    name="input-year"
                    value={yearInput}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                      if (val === '') setYearInput('');
                      else setYearInput(Math.min(3000, Number(val)));
                    }}
                    onBlur={() => {
                      if (!yearInput || yearInput < 1) setYearInput(1);
                    }}
                    className="w-full min-w-0 max-w-full text-center font-mono font-black text-xl sm:text-2xl text-indigo-700 border border-slate-300 rounded-xl py-1 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="π.χ. 2026"
                  />

                  <button
                    onClick={(e) => updateYear(e, 1)}
                    className="w-9 h-9 shrink-0 flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation shadow-sm"
                    title="Αύξηση κατά 1 έτος"
                    aria-label="Αύξηση έτους"
                  >
                    ＋
                  </button>
                </div>

                <div className="pt-2">
                  <input
                    type="range"
                    min="1"
                    max="3000"
                    value={y}
                    onChange={(e) => setYearInput(Number(e.target.value))}
                    className="w-full min-w-0 max-w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                {/* Γρήγορα κουμπιά δεκαετιών και αιώνων */}
                <div className="flex justify-center gap-1.5 pt-1">
                  <button
                    onClick={(e) => updateYear(e, -100)}
                    className="px-2 py-0.5 text-[10px] font-black rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition active:scale-95 touch-manipulation"
                  >
                    -100
                  </button>
                  <button
                    onClick={(e) => updateYear(e, -10)}
                    className="px-2 py-0.5 text-[10px] font-black rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition active:scale-95 touch-manipulation"
                  >
                    -10
                  </button>
                  <button
                    onClick={(e) => updateYear(e, 10)}
                    className="px-2 py-0.5 text-[10px] font-black rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition active:scale-95 touch-manipulation"
                  >
                    +10
                  </button>
                  <button
                    onClick={(e) => updateYear(e, 100)}
                    className="px-2 py-0.5 text-[10px] font-black rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition active:scale-95 touch-manipulation"
                  >
                    +100
                  </button>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1.5 shadow-sm">
                <p>
                  • <strong>Διάρκεια Αιώνα:</strong> Από το έτος <strong>{formatNumber(startYear)}</strong> έως και το <strong>{formatNumber(endYear)}</strong>.
                </p>
                <p>
                  • <strong>Φεβρουάριος {y}:</strong> Έχει <strong>{isLeap ? '29 ημέρες (Δίσεκτο)' : '28 ημέρες (Κοινό)'}</strong>.
                </p>
              </div>
            </div>

            {/* ΟΠΤΙΚΟΠΟΙΗΣΗ ΑΠΟΤΕΛΕΣΜΑΤΩΝ (ΧΩΡΙΣ SCROLL) */}
            <div className="bg-slate-950 text-white p-5 sm:p-7 rounded-3xl border border-slate-800 shadow-xl space-y-4 text-center">
              <span className="text-[11px] font-black uppercase tracking-widest text-indigo-400 block">
                ΑΠΟΤΕΛΕΣΜΑΤΑ ΓΙΑ ΤΟ ΕΤΟΣ {formatNumber(y)}
              </span>

              {/* Badge Αιώνα */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 sm:p-6 rounded-2xl border border-indigo-400/30 space-y-1 shadow-lg">
                <span className="text-xs font-bold text-indigo-200 block uppercase">ΑΝΗΚΕΙ ΣΤΟΝ:</span>
                <div className="text-3xl sm:text-4xl font-black text-amber-300 font-mono">
                  {century}ο Αιώνα
                </div>
                <span className="text-sm font-bold text-indigo-100 block font-mono">
                  (Λατινική γραφή: {toRoman(century)})
                </span>
              </div>

              {/* Στοιχεία Δίσεκτου Έτους & Ημερών */}
              <div className="grid grid-cols-2 gap-3 text-center font-mono">
                <div
                  className={`p-3 rounded-2xl border shadow-sm ${
                    isLeap
                      ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <span className="text-[10px] uppercase font-sans font-bold block text-slate-400">
                    ΕΙΔΟΣ ΕΤΟΥΣ
                  </span>
                  <span className="text-sm sm:text-base font-black">
                    {isLeap ? '✨ Δίσεκτο' : 'Κοινό Έτος'}
                  </span>
                </div>

                <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 text-slate-200 shadow-sm">
                  <span className="text-[10px] uppercase font-sans font-bold block text-slate-400">
                    ΗΜΕΡΕΣ ΕΤΟΥΣ
                  </span>
                  <span className="text-sm sm:text-base font-black text-amber-300">
                    {daysInYear} ημέρες
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM EXERCISES CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
            <p className="text-slate-800 text-sm md:text-base">
              Έμαθες να βρίσκεις τους αιώνες και να ξεχωρίζεις τα δίσεκτα έτη; Δοκίμασε τις διαδραστικές ασκήσεις!
            </p>
          </div>
          <Link
            href="/d-dimotikou/26-aionas-ask"
            className="bg-slate-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            Ξεκίνα τις Ασκήσεις ➔
          </Link>
        </div>
      </div>
    </Layout>
  );
}
