// pages/d-dimotikou/7-dekadikoi-sinexeia.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Component για μαθηματική γραφή κλασμάτων
const Fraction = ({ num, den }) => (
  <span className="inline-flex flex-col items-center align-middle mx-1 text-center font-serif leading-none">
    <span className="border-b border-current px-1 pb-0.5 text-[0.95em]">{num}</span>
    <span className="px-1 pt-0.5 text-[0.95em]">{den}</span>
  </span>
);

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

  // Δημιουργία ολόγραφης ανάγνωσης
  const decimalPartName = mode === 'tenths' ? 'δέκατα' : 'εκατοστά';
  const isDecimalZero = parseInt(decimalPartString, 10) === 0;

  let way1 = '';
  let way2 = '';

  if (isDecimalZero) {
    way1 = `${integerPart}`;
    way2 = `${integerPart}`;
  } else if (integerPart === 0) {
    way1 = `${parseInt(decimalPartString, 10)} ${decimalPartName}`;
    way2 = `μηδέν κόμμα ${decimalPartString}`;
  } else {
    way1 = `${integerPart} και ${parseInt(decimalPartString, 10)} ${decimalPartName}`;
    way2 = `${integerPart} κόμμα ${decimalPartString}`;
  }

  const handleRandomize = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (mode === 'tenths') {
      setNumerator(getRandomInt(1, 99));
    } else {
      setNumerator(getRandomInt(1, 499));
    }
  };

  const handleModeSwitch = (e, newMode, defaultVal) => {
    e.preventDefault();
    e.stopPropagation();
    setMode(newMode);
    setNumerator(defaultVal);
  };

  const updateNumerator = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    const maxVal = mode === 'tenths' ? 99 : 499;
    setNumerator((prev) => Math.max(1, Math.min(maxVal, prev + delta)));
  };

  return (
    <Layout
      title="Δεκαδικοί Αριθμοί & Δεκαδικά Κλάσματα - Θεωρία | LearnMaths.gr"
      description="Μαθαίνουμε τη σχέση δεκαδικών κλασμάτων και δεκαδικών αριθμών, την αξία θέσης (μονάδες, δέκατα, εκατοστά) και τους τρόπους ανάγνωσης."
      backUrl="/d-dimotikou"
      backText="Δ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/d-dimotikou/7-dekadikoi-sinexeia-ask"
          className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>🎯</span> Ασκήσεις
        </Link>
      }
    >
      <div className="space-y-8">
        {/* HEADER & EXERCISES PROMO CARD */}
        <div className="bg-gradient-to-r from-teal-600 via-indigo-600 to-purple-600 text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                Δ' ΔΗΜΟΤΙΚΟΥ
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                🔢 Δεκαδικοί Αριθμοί και Δεκαδικά Κλάσματα
              </h1>
              <p className="text-teal-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                Μαθαίνουμε τα δέκατα, τα εκατοστά, τον πίνακα αξίας θέσης και πώς μετατρέπουμε με ευκολία τα δεκαδικά κλάσματα σε δεκαδικούς αριθμούς!
              </p>
            </div>

            {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
              <div className="text-3xl">🚀</div>
              <h3 className="font-extrabold text-white text-lg">Έτοιμος για εξάσκηση;</h3>
              <p className="text-xs text-teal-100">
                Δοκίμασε τις ασκήσεις στους δεκαδικούς αριθμούς για να τελειοποιήσεις τις γνώσεις σου!
              </p>
              <Link
                href="/d-dimotikou/7-dekadikoi-sinexeia-ask"
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
              <span>📖</span> Αναλυτική Θεωρία και Ορισμοί
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Δεκαδικά Κλάσματα */}
            <div className="bg-teal-50/70 p-5 sm:p-6 rounded-2xl border border-teal-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-teal-900 flex items-center gap-2">
                <span>🍰</span> Δεκαδικά Κλάσματα
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                <strong>Δεκαδικά κλάσματα</strong> ονομάζονται τα κλάσματα που έχουν παρονομαστή το <strong>10</strong> ή το <strong>100</strong> (ή το 1.000):
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                <li className="flex items-center gap-2">
                  <span className="text-teal-600 font-bold">•</span>
                  <span><Fraction num="1" den="10" /> ＝ 1 δέκατο</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-teal-600 font-bold">•</span>
                  <span><Fraction num="1" den="100" /> ＝ 1 εκατοστό</span>
                </li>
              </ul>
            </div>

            {/* Δεκαδικοί Αριθμοί */}
            <div className="bg-indigo-50/70 p-5 sm:p-6 rounded-2xl border border-indigo-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-indigo-900 flex items-center gap-2">
                <span>✏️</span> Δεκαδικοί Αριθμοί
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                Κάθε δεκαδικό κλάσμα γράφεται και ως <strong>δεκαδικός αριθμός</strong> χρησιμοποιώντας την <strong>υποδιαστολή (κόμμα «,»):</strong>
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                <li className="flex items-center gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span><Fraction num="3" den="10" /> ＝ <strong className="text-indigo-700 font-bold">0,3</strong> (1 δεκαδικό ψηφίο: δέκατα)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span><Fraction num="25" den="100" /> ＝ <strong className="text-indigo-700 font-bold">0,25</strong> (2 δεκαδικά ψηφία: εκατοστά)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* ΑΝΑΛΥΣΗ ΜΕΡΩΝ ΔΕΚΑΔΙΚΟΥ */}
          <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200/80 space-y-4">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-800">
              🔍 Τα δύο μέρη του δεκαδικού αριθμού: <span className="text-indigo-600 font-mono">3,54</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
                <h4 className="font-bold text-blue-700 border-b pb-1 text-sm sm:text-base">
                  1. Ακέραιο Μέρος (πριν το κόμμα)
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  Δείχνει τις ολόκληρες ακέραιες μονάδες:
                </p>
                <div className="inline-flex flex-wrap items-center justify-center gap-1.5 leading-relaxed break-words px-3 py-2 bg-blue-50/80 rounded-xl border border-blue-200/80 font-mono font-bold text-slate-900 w-full">
                  <span className="text-blue-600 text-lg sm:text-xl">3</span>
                  <span>, 54</span>
                  <span>➔</span>
                  <span className="text-blue-700">3 Μονάδες (Μ)</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
                <h4 className="font-bold text-purple-700 border-b pb-1 text-sm sm:text-base">
                  2. Δεκαδικό Μέρος (μετά το κόμμα)
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  Δείχνει τα κομμάτια (υποδιαιρέσεις) της μονάδας:
                </p>
                <div className="inline-flex flex-wrap items-center justify-center gap-1.5 leading-relaxed break-words px-3 py-2 bg-purple-50/80 rounded-xl border border-purple-200/80 font-mono font-bold text-slate-900 w-full">
                  <span>3 ,</span>
                  <span className="text-teal-600 text-lg sm:text-xl">5</span>
                  <span className="text-amber-600 text-lg sm:text-xl">4</span>
                  <span>➔</span>
                  <span className="text-teal-700">5 δέκατα (δ)</span>
                  <span>＆</span>
                  <span className="text-amber-700">4 εκατοστά (ε)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ - SECTION 2 */}
        <div className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4 border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🧮</span> Διαδραστικός Μετατροπέας Κλασμάτων και Δεκαδικών
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                Άλλαξε τον αριθμητή και παρατήρησε άμεσα τη μετατροπή σε δεκαδικό και τον πίνακα αξίας θέσης!
              </p>
            </div>

            <div className="flex flex-wrap gap-2 self-start sm:self-auto">
              <button
                onClick={(e) => handleModeSwitch(e, 'tenths', 35)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition active:scale-95 touch-manipulation ${
                  mode === 'tenths'
                    ? 'bg-indigo-600 text-white shadow-md font-black'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                / 10 (Δέκατα)
              </button>
              <button
                onClick={(e) => handleModeSwitch(e, 'hundredths', 145)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition active:scale-95 touch-manipulation ${
                  mode === 'hundredths'
                    ? 'bg-purple-600 text-white shadow-md font-black'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                / 100 (Εκατοστά)
              </button>
              <button
                onClick={handleRandomize}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-3.5 py-2 rounded-xl text-xs sm:text-sm transition shadow-sm active:scale-95 touch-manipulation"
              >
                🎲 Τυχαίος
              </button>
            </div>
          </div>

          {/* TOUCH SLIDER ΧΕΙΡΙΣΜΟΥ (ΚΑΝΟΝΑΣ 2) */}
          <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-2">
            <div className="h-8 flex items-center justify-between text-center px-1">
              <span className="text-xs font-black uppercase text-slate-500">
                ΑΡΙΘΜΗΤΗΣ ΚΛΑΣΜΑΤΟΣ
              </span>
              <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-indigo-600 text-base">
                {numerator}
              </span>
            </div>

            <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
              <button
                onClick={(e) => updateNumerator(e, -1)}
                className="w-9 h-9 shrink-0 flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                title="Μείωση"
                aria-label="Μείωση αριθμητή"
              >
                －
              </button>

              <input
                type="range"
                min="1"
                max={mode === 'tenths' ? 99 : 499}
                value={numerator}
                onChange={(e) => setNumerator(Number(e.target.value))}
                className="w-full min-w-0 max-w-full accent-indigo-600 cursor-pointer"
              />

              <button
                onClick={(e) => updateNumerator(e, 1)}
                className="w-9 h-9 shrink-0 flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                title="Αύξηση"
                aria-label="Αύξηση αριθμητή"
              >
                ＋
              </button>
            </div>
          </div>

          {/* ΠΡΟΒΟΛΗ ΚΛΑΣΜΑΤΟΣ, ΔΕΚΑΔΙΚΟΥ & ΠΙΝΑΚΑ ΑΞΙΑΣ ΘΕΣΗΣ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* 1. Δεκαδικό Κλάσμα */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-3xl border border-indigo-200 text-center space-y-2 shadow-sm">
              <span className="text-[11px] font-black uppercase tracking-wider text-indigo-500 block">
                1. Δεκαδικο Κλασμα
              </span>
              <div className="py-2 flex justify-center">
                <span className="inline-flex flex-col items-center font-mono font-black text-3xl sm:text-4xl text-indigo-900 leading-none">
                  <span className="px-2 pb-1 border-b-4 border-indigo-900">{numerator}</span>
                  <span className="px-2 pt-1">{denominator}</span>
                </span>
              </div>
            </div>

            {/* 2. Δεκαδικός Αριθμός */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-3xl border border-purple-200 text-center space-y-2 shadow-sm">
              <span className="text-[11px] font-black uppercase tracking-wider text-purple-500 block">
                2. Δεκαδικος Αριθμος
              </span>
              <div className="font-mono font-black text-4xl sm:text-5xl text-purple-900 py-4">
                {decimalVal.toLocaleString('el-GR', {
                  minimumFractionDigits: mode === 'tenths' ? 1 : 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>

            {/* 3. Πίνακας Αξίας Θέσης (Responsive SVG) */}
            <div className="bg-slate-950 p-4 sm:p-5 rounded-3xl border border-slate-800 shadow-xl space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block text-center">
                3. Πινακας Αξιας Θεσης
              </span>

              <div className="w-full flex justify-center">
                <svg
                  viewBox="0 0 420 150"
                  className="w-full h-auto max-w-[340px] block select-none font-sans"
                >
                  {/* Headers */}
                  <rect x="10" y="10" width="115" height="46" rx="8" fill="#1e3a8a" />
                  <text x="67" y="32" fill="#93c5fd" fontSize="11" fontWeight="700" textAnchor="middle">
                    Μονάδες
                  </text>
                  <text x="67" y="47" fill="#ffffff" fontSize="12" fontWeight="900" textAnchor="middle">
                    (Μ)
                  </text>

                  {/* Υποδιαστολή Header */}
                  <rect x="135" y="10" width="30" height="46" rx="8" fill="#334155" />
                  <text x="150" y="38" fill="#94a3b8" fontSize="18" fontWeight="900" textAnchor="middle">
                    ,
                  </text>

                  {/* Δέκατα Header */}
                  <rect x="175" y="10" width="115" height="46" rx="8" fill="#115e59" />
                  <text x="232" y="32" fill="#99f6e4" fontSize="11" fontWeight="700" textAnchor="middle">
                    Δέκατα
                  </text>
                  <text x="232" y="47" fill="#ffffff" fontSize="12" fontWeight="900" textAnchor="middle">
                    (δ)
                  </text>

                  {/* Εκατοστά Header */}
                  <rect x="295" y="10" width="115" height="46" rx="8" fill="#854d0e" />
                  <text x="352" y="32" fill="#fde68a" fontSize="11" fontWeight="700" textAnchor="middle">
                    Εκατοστά
                  </text>
                  <text x="352" y="47" fill="#ffffff" fontSize="12" fontWeight="900" textAnchor="middle">
                    (ε)
                  </text>

                  {/* Values Row */}
                  <rect x="10" y="68" width="115" height="68" rx="10" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
                  <text x="67" y="113" fill="#60a5fa" fontSize="30" fontWeight="900" fontFamily="monospace" textAnchor="middle">
                    {integerPart}
                  </text>

                  <rect x="135" y="68" width="30" height="68" rx="10" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
                  <text x="150" y="113" fill="#94a3b8" fontSize="30" fontWeight="900" fontFamily="monospace" textAnchor="middle">
                    ,
                  </text>

                  <rect x="175" y="68" width="115" height="68" rx="10" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
                  <text x="232" y="113" fill="#2dd4bf" fontSize="30" fontWeight="900" fontFamily="monospace" textAnchor="middle">
                    {tenthsDigit}
                  </text>

                  <rect x="295" y="68" width="115" height="68" rx="10" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
                  <text x="352" y="113" fill="#fbbf24" fontSize="30" fontWeight="900" fontFamily="monospace" textAnchor="middle">
                    {mode === 'hundredths' ? hundredthsDigit : '－'}
                  </text>
                </svg>
              </div>
            </div>
          </div>

          {/* ΟΛΟΓΡΑΦΗ ΕΞΗΓΗΣΗ (2 ΤΡΟΠΟΙ ΑΝΑΓΝΩΣΗΣ) */}
          <div className="bg-emerald-50/80 p-5 sm:p-6 rounded-2xl border border-emerald-200 text-center space-y-2">
            <span className="text-xs font-black uppercase text-emerald-900 block">
              🗣️ Πως διαβαζεται ο αριθμος:
            </span>

            {isDecimalZero ? (
              <div className="inline-flex flex-wrap items-center justify-center gap-1.5 leading-relaxed break-words px-4 py-2.5 bg-white rounded-xl border border-emerald-200 shadow-sm text-base sm:text-lg font-black text-emerald-950">
                « <span className="text-indigo-700">{way1}</span> »
              </div>
            ) : (
              <div className="inline-flex flex-wrap items-center justify-center gap-2 text-sm sm:text-base font-bold text-emerald-950">
                <span className="bg-white px-3.5 py-2 rounded-xl border border-emerald-200 shadow-sm">
                  « <span className="text-indigo-700 font-black">{way1}</span> »
                </span>
                <span className="text-xs font-black text-emerald-600 uppercase">ή</span>
                <span className="bg-white px-3.5 py-2 rounded-xl border border-emerald-200 shadow-sm">
                  « <span className="text-purple-700 font-black">{way2}</span> »
                </span>
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM EXERCISES CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
            <p className="text-slate-800 text-sm md:text-base">
              Έμαθες τους δεκαδικούς αριθμούς και τα δεκαδικά κλάσματα; Δοκίμασε τις διαδραστικές ασκήσεις!
            </p>
          </div>
          <Link
            href="/d-dimotikou/7-dekadikoi-sinexeia-ask"
            className="bg-slate-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            Ξεκίνα τις Ασκήσεις ➔
          </Link>
        </div>
      </div>
    </Layout>
  );
}
