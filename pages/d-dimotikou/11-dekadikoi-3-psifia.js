// pages/d-dimotikou/11-dekadikoi-3-psifia.js
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

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
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

  const handleRandomize = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setNumerator(getRandomInt(5, 4995));
  };

  const updateNumerator = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setNumerator((prev) => Math.max(1, Math.min(9999, prev + delta)));
  };

  return (
    <Layout
      title="Δεκαδικοί Αριθμοί με 3 Δεκαδικά Ψηφία (Χιλιοστά) - Θεωρία | LearnMaths.gr"
      description="Μαθαίνουμε τα χιλιοστά, τα δεκαδικά κλάσματα με παρονομαστή 1.000, τον πίνακα αξίας θέσης 3 δεκαδικών ψηφίων και τους τρόπους ανάγνωσης."
      backUrl="/d-dimotikou"
      backText="Δ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/d-dimotikou/11-dekadikoi-3-psifia-ask"
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
                🔢 Δεκαδικοί Αριθμοί με 3 Δεκαδικά Ψηφία
              </h1>
              <p className="text-purple-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                Γνωρίζουμε τα χιλιοστά (χ), τη θέση τους μετά την υποδιαστολή και τη μετατροπή δεκαδικών κλασμάτων με παρονομαστή το 1.000!
              </p>
            </div>

            {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
              <div className="text-3xl">🚀</div>
              <h3 className="font-extrabold text-white text-lg">Έτοιμος για εξάσκηση;</h3>
              <p className="text-xs text-purple-100">
                Δοκίμασε τις ασκήσεις στους δεκαδικούς με 3 ψηφία για να σιγουρευτείς ότι τους κατέκτησες!
              </p>
              <Link
                href="/d-dimotikou/11-dekadikoi-3-psifia-ask"
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
              <span>📖</span> Αναλυτική Θεωρία: Τα Χιλιοστά
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Χιλιοστά & Κλάσματα */}
            <div className="bg-indigo-50/70 p-5 sm:p-6 rounded-2xl border border-indigo-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-indigo-900 flex items-center gap-2">
                <span>🍰</span> Δεκαδικά Κλάσματα με παρονομαστή το 1.000
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                Όταν χωρίζουμε τη μονάδα σε <strong>1.000 ίσα μέρη</strong>, το κάθε μέρος ονομάζεται <strong>1 χιλιοστό</strong>:
              </p>
              <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 p-2.5 bg-white rounded-xl border border-indigo-100 font-mono text-xs sm:text-sm font-bold text-slate-800 w-full shadow-sm">
                <Fraction num="1" den="1000" />
                <span>＝</span>
                <span>1 χιλιοστό</span>
                <span>＝</span>
                <span className="text-indigo-700 font-black">0,001</span>
              </div>
            </div>

            {/* 3 Δεκαδικά Ψηφία */}
            <div className="bg-purple-50/70 p-5 sm:p-6 rounded-2xl border border-purple-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-purple-900 flex items-center gap-2">
                <span>✏️</span> Τα 3 Δεκαδικά Ψηφία
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                Τα 3 ψηφία μετά την υποδιαστολή εκφράζουν κατά σειρά τα <strong>δέκατα (δ)</strong>, τα <strong>εκατοστά (ε)</strong> και τα <strong>χιλιοστά (χ)</strong>:
              </p>
              <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 p-2.5 bg-white rounded-xl border border-purple-100 font-mono text-xs sm:text-sm font-bold text-slate-800 w-full shadow-sm">
                <Fraction num="125" den="1000" />
                <span>＝</span>
                <span className="text-purple-700 font-black">0,125</span>
                <span className="font-sans text-xs text-slate-500 font-normal">(3 δεκαδικά ψηφία)</span>
              </div>
            </div>
          </div>

          {/* ΑΝΑΛΥΣΗ ΜΕΡΩΝ ΔΕΚΑΔΙΚΟΥ */}
          <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200/80 space-y-4">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-800">
              🔍 Τα μέρη του αριθμού: <span className="text-indigo-600 font-mono">2,345</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
                <h4 className="font-bold text-blue-700 border-b pb-1 text-sm sm:text-base">
                  1. Ακέραιο Μέρος (πριν το κόμμα)
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  Δείχνει τις ακέραιες μονάδες:
                </p>
                <div className="inline-flex flex-wrap items-center justify-center gap-1.5 leading-relaxed break-words px-3 py-2 bg-blue-50/80 rounded-xl border border-blue-200/80 font-mono font-bold text-slate-900 w-full">
                  <span className="text-blue-600 text-lg sm:text-xl">2</span>
                  <span>, 345</span>
                  <span>➔</span>
                  <span className="text-blue-700 font-black">2 Μονάδες (Μ)</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
                <h4 className="font-bold text-purple-700 border-b pb-1 text-sm sm:text-base">
                  2. Δεκαδικό Μέρος (3 Ψηφία)
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  Δείχνει τις υποδιαιρέσεις της μονάδας:
                </p>
                <div className="inline-flex flex-wrap items-center justify-center gap-1.5 leading-relaxed break-words px-3 py-2 bg-purple-50/80 rounded-xl border border-purple-200/80 font-mono font-bold text-slate-900 w-full">
                  <span>2 ,</span>
                  <span className="text-teal-600 font-black text-base sm:text-lg">3</span>
                  <span className="text-amber-600 font-black text-base sm:text-lg">4</span>
                  <span className="text-rose-600 font-black text-base sm:text-lg">5</span>
                  <span>➔</span>
                  <span className="text-teal-700">3 δ</span>
                  <span>＋</span>
                  <span className="text-amber-700">4 ε</span>
                  <span>＋</span>
                  <span className="text-rose-700">5 χ</span>
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
                <span>🧮</span> Διαδραστικός Μετατροπέας Χιλιοστών
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                Άλλαξε τον αριθμητή και παρατήρησε άμεσα τη μετατροπή σε δεκαδικό αριθμό 3 δεκαδικών ψηφίων!
              </p>
            </div>

            <button
              onClick={handleRandomize}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs sm:text-sm transition shadow-sm flex items-center gap-1.5 self-start sm:self-auto active:scale-95 touch-manipulation"
            >
              <span>🎲</span> Τυχαίος Αριθμός
            </button>
          </div>

          {/* TOUCH SLIDER ΧΕΙΡΙΣΜΟΥ (ΚΑΝΟΝΑΣ 2) */}
          <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-2">
            <div className="h-8 flex items-center justify-between text-center px-1">
              <span className="text-xs font-black uppercase text-slate-500">
                ΑΡΙΘΜΗΤΗΣ ΚΛΑΣΜΑΤΟΣ (/1000)
              </span>
              <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-indigo-600 text-base">
                {numerator}
              </span>
            </div>

            <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
              <button
                onClick={(e) => updateNumerator(e, -10)}
                className="w-9 h-9 shrink-0 flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                title="Μείωση κατά 10"
                aria-label="Μείωση αριθμητή"
              >
                －
              </button>

              <input
                type="range"
                min="1"
                max="9999"
                value={numerator}
                onChange={(e) => setNumerator(Number(e.target.value))}
                className="w-full min-w-0 max-w-full accent-indigo-600 cursor-pointer"
              />

              <button
                onClick={(e) => updateNumerator(e, 10)}
                className="w-9 h-9 shrink-0 flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                title="Αύξηση κατά 10"
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
                  <span className="px-2 pb-1 border-b-4 border-indigo-900">{formatNumber(numerator)}</span>
                  <span className="px-2 pt-1">{formatNumber(denominator)}</span>
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
                  minimumFractionDigits: 3,
                  maximumFractionDigits: 3,
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
                  viewBox="0 0 460 150"
                  className="w-full h-auto max-w-[350px] block select-none font-sans"
                >
                  {/* Headers */}
                  <rect x="10" y="10" width="85" height="46" rx="8" fill="#1e3a8a" />
                  <text x="52" y="32" fill="#93c5fd" fontSize="10.5" fontWeight="700" textAnchor="middle">
                    Μονάδες
                  </text>
                  <text x="52" y="47" fill="#ffffff" fontSize="12" fontWeight="900" textAnchor="middle">
                    (Μ)
                  </text>

                  {/* Υποδιαστολή Header */}
                  <rect x="103" y="10" width="26" height="46" rx="6" fill="#334155" />
                  <text x="116" y="38" fill="#94a3b8" fontSize="18" fontWeight="900" textAnchor="middle">
                    ,
                  </text>

                  {/* Δέκατα Header */}
                  <rect x="137" y="10" width="95" height="46" rx="8" fill="#115e59" />
                  <text x="184" y="32" fill="#99f6e4" fontSize="10.5" fontWeight="700" textAnchor="middle">
                    Δέκατα
                  </text>
                  <text x="184" y="47" fill="#ffffff" fontSize="12" fontWeight="900" textAnchor="middle">
                    (δ)
                  </text>

                  {/* Εκατοστά Header */}
                  <rect x="240" y="10" width="95" height="46" rx="8" fill="#854d0e" />
                  <text x="287" y="32" fill="#fde68a" fontSize="10.5" fontWeight="700" textAnchor="middle">
                    Εκατοστά
                  </text>
                  <text x="287" y="47" fill="#ffffff" fontSize="12" fontWeight="900" textAnchor="middle">
                    (ε)
                  </text>

                  {/* Χιλιοστά Header */}
                  <rect x="343" y="10" width="107" height="46" rx="8" fill="#9f1239" />
                  <text x="396" y="32" fill="#fecdd3" fontSize="10.5" fontWeight="700" textAnchor="middle">
                    Χιλιοστά
                  </text>
                  <text x="396" y="47" fill="#ffffff" fontSize="12" fontWeight="900" textAnchor="middle">
                    (χ)
                  </text>

                  {/* Values Row */}
                  <rect x="10" y="68" width="85" height="68" rx="10" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
                  <text x="52" y="113" fill="#60a5fa" fontSize="28" fontWeight="900" fontFamily="monospace" textAnchor="middle">
                    {integerPart}
                  </text>

                  <rect x="103" y="68" width="26" height="68" rx="6" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
                  <text x="116" y="113" fill="#94a3b8" fontSize="28" fontWeight="900" fontFamily="monospace" textAnchor="middle">
                    ,
                  </text>

                  <rect x="137" y="68" width="95" height="68" rx="10" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
                  <text x="184" y="113" fill="#2dd4bf" fontSize="28" fontWeight="900" fontFamily="monospace" textAnchor="middle">
                    {tenthsDigit}
                  </text>

                  <rect x="240" y="68" width="95" height="68" rx="10" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
                  <text x="287" y="113" fill="#fbbf24" fontSize="28" fontWeight="900" fontFamily="monospace" textAnchor="middle">
                    {hundredthsDigit}
                  </text>

                  <rect x="343" y="68" width="107" height="68" rx="10" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
                  <text x="396" y="113" fill="#fb7185" fontSize="28" fontWeight="900" fontFamily="monospace" textAnchor="middle">
                    {thousandthsDigit}
                  </text>
                </svg>
              </div>
            </div>
          </div>

          {/* ΟΛΟΓΡΑΦΗ ΕΞΗΓΗΣΗ (2 ΤΡΟΠΟΙ ΑΝΑΓΝΩΣΗΣ) */}
          <div className="bg-emerald-50/80 p-5 sm:p-6 rounded-2xl border border-emerald-200 text-center space-y-2">
            <span className="text-xs font-black uppercase text-emerald-900 block">
              🗣️ Πώς διαβάζεται ο αριθμός:
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
            <h3 className="text-xl sm:text-2xl font-black">📝 Ώρα για Εξάσκηση στα Χιλιοστά!</h3>
            <p className="text-slate-800 text-sm md:text-base">
              Έμαθες τους δεκαδικούς αριθμούς με 3 δεκαδικά ψηφία; Δοκίμασε τις διαδραστικές ασκήσεις!
            </p>
          </div>
          <Link
            href="/d-dimotikou/11-dekadikoi-3-psifia-ask"
            className="bg-slate-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            Ξεκίνα τις Ασκήσεις ➔
          </Link>
        </div>
      </div>
    </Layout>
  );
}
