// pages/d-dimotikou/6-dekadikoi.js
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

export default function DekadikoiPage() {
  const [decimalMode, setDecimalMode] = useState('tenths'); // 'tenths' | 'hundredths'
  const [decimalValue, setDecimalValue] = useState(4);

  const maxSlices = decimalMode === 'tenths' ? 10 : 100;
  const numericDecimal = decimalValue / maxSlices;

  const handleModeChange = (e, mode) => {
    e.preventDefault();
    e.stopPropagation();
    setDecimalMode(mode);
    setDecimalValue(mode === 'tenths' ? 4 : 40);
  };

  const updateValue = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setDecimalValue((prev) => Math.max(0, Math.min(maxSlices, prev + delta)));
  };

  return (
    <Layout
      title="Δεκαδικοί Αριθμοί & Δεκαδικά Κλάσματα - Θεωρία | LearnMaths.gr"
      description="Μαθαίνουμε πώς συνδέονται τα δεκαδικά κλάσματα με τους δεκαδικούς αριθμούς, τα δέκατα και τα εκατοστά με διαδραστική οπτικοποίηση μονάδας."
      backUrl="/d-dimotikou"
      backText="Δ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/d-dimotikou/6-dekadikoi-ask"
          className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>🎯</span> Ασκήσεις
        </Link>
      }
    >
      <div className="space-y-8">
        {/* HEADER & EXERCISES PROMO CARD */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                Δ' ΔΗΜΟΤΙΚΟΥ
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                🍰 Δεκαδικά Κλάσματα και Δεκαδικοί Αριθμοί
              </h1>
              <p className="text-amber-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                Ανακαλύπτουμε πώς μετατρέπουμε τα κλάσματα σε δεκαδικούς αριθμούς με υποδιαστολή, γνωρίζοντας τα δέκατα και τα εκατοστά!
              </p>
            </div>

            {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
              <div className="text-3xl">🚀</div>
              <h3 className="font-extrabold text-white text-lg">Έτοιμος για εξάσκηση;</h3>
              <p className="text-xs text-amber-100">
                Δοκίμασε τις ασκήσεις στους δεκαδικούς αριθμούς για να σιγουρευτείς ότι τα έμαθες όλα!
              </p>
              <Link
                href="/d-dimotikou/6-dekadikoi-ask"
                className="inline-block w-full bg-white hover:bg-amber-50 text-slate-900 font-black py-3 px-4 rounded-xl shadow-md transition transform hover:-translate-y-0.5 text-sm"
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
              <span>📖</span> Από τα Κλάσματα στους Δεκαδικούς Αριθμούς
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ορισμός Δεκαδικών Κλασμάτων */}
            <div className="bg-amber-50/70 p-5 sm:p-6 rounded-2xl border border-amber-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-amber-900 flex items-center gap-2">
                <span>🔹</span> Τι είναι τα Δεκαδικά Κλάσματα;
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                Όταν χωρίζουμε μια ακέραιη μονάδα σε <strong>10, 100 ή 1.000 ίσα μέρη</strong>, δημιουργούμε τα <strong>δεκαδικά κλάσματα</strong>:
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                <li className="flex items-center gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span><strong>10 ίσα μέρη:</strong> Κάθε μέρος είναι το <Fraction num="1" den="10" /> (ένα δέκατο).</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span><strong>100 ίσα μέρη:</strong> Κάθε μέρος είναι το <Fraction num="1" den="100" /> (ένα εκατοστό).</span>
                </li>
              </ul>
            </div>

            {/* Δεκαδικοί Αριθμοί & Υποδιαστολή */}
            <div className="bg-orange-50/70 p-5 sm:p-6 rounded-2xl border border-orange-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-orange-900 flex items-center gap-2">
                <span>✍️</span> Η Υποδιαστολή και οι Δεκαδικοί
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                Κάθε δεκαδικό κλάσμα γράφεται πιο σύντομα ως <strong>δεκαδικός αριθμός</strong> με υποδιαστολή:
              </p>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="inline-flex flex-wrap items-center gap-1.5 p-2.5 bg-white rounded-xl border border-orange-200 font-mono text-slate-900 w-full font-bold">
                  <Fraction num="1" den="10" /> <span>＝</span> <span className="text-amber-600 font-black">0,1</span> (1ο ψηφίο μετά την υποδιαστολή: <strong>δέκατα</strong>)
                </div>
                <div className="inline-flex flex-wrap items-center gap-1.5 p-2.5 bg-white rounded-xl border border-orange-200 font-mono text-slate-900 w-full font-bold">
                  <Fraction num="1" den="100" /> <span>＝</span> <span className="text-orange-600 font-black">0,01</span> (2ο ψηφίο μετά την υποδιαστολή: <strong>εκατοστά</strong>)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ - SECTION 2 */}
        <div className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4 border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🎚️</span> Διαδραστική Συσχέτιση Κλάσματος & Δεκαδικού
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                Επίλεξε δέκατα ή εκατοστά, σύρε τη μπάρα και παρατήρησε την ταυτόχρονη κλασματική και δεκαδική αναπαράσταση!
              </p>
            </div>

            {/* Toggles Επιλογής Τάξης */}
            <div className="flex gap-2 self-start sm:self-auto">
              <button
                onClick={(e) => handleModeChange(e, 'tenths')}
                className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition active:scale-95 touch-manipulation ${
                  decimalMode === 'tenths'
                    ? 'bg-amber-500 text-white shadow-md font-black'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Δέκατα (1/10)
              </button>
              <button
                onClick={(e) => handleModeChange(e, 'hundredths')}
                className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition active:scale-95 touch-manipulation ${
                  decimalMode === 'hundredths'
                    ? 'bg-amber-500 text-white shadow-md font-black'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Εκατοστά (1/100)
              </button>
            </div>
          </div>

          {/* ΠΡΟΒΟΛΗ ΚΛΑΣΜΑΤΙΚΗΣ & ΔΕΚΑΔΙΚΗΣ ΜΟΡΦΗΣ */}
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-6 sm:p-8 rounded-2xl shadow-md text-center space-y-4">
            <span className="text-[11px] font-black uppercase tracking-widest text-amber-200">
              ΙΣΟΔΥΝΑΜΙΑ ΚΛΑΣΜΑΤΟΣ ΚΑΙ ΔΕΚΑΔΙΚΟΥ ΑΡΙΘΜΟΥ
            </span>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 pt-1">
              {/* Κλασματική Μορφή */}
              <div className="inline-flex flex-col items-center font-black text-3xl sm:text-4xl bg-white/10 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-white/20">
                <span className="text-amber-200 font-mono">{decimalValue}</span>
                <div className="w-16 sm:w-20 h-1 bg-white rounded-full my-1"></div>
                <span className="text-white font-mono">{maxSlices}</span>
              </div>

              <div className="text-2xl sm:text-3xl font-black text-amber-200">＝</div>

              {/* Δεκαδική Μορφή */}
              <div className="bg-white text-amber-600 font-mono font-black text-3xl sm:text-5xl px-7 py-3.5 rounded-2xl shadow-inner min-w-[140px]">
                {numericDecimal.toLocaleString('el-GR', {
                  minimumFractionDigits: decimalMode === 'tenths' ? 1 : 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
          </div>

          {/* TOUCH SLIDER ΧΕΙΡΙΣΜΟΥ (ΚΑΝΟΝΑΣ 2) */}
          <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="h-8 flex items-center justify-between text-center px-1">
              <span className="text-xs font-black uppercase text-slate-500">
                ΕΠΙΛΟΓΗ ΜΕΡΩΝ ({decimalMode === 'tenths' ? 'ΔΕΚΑΤΑ' : 'ΕΚΑΤΟΣΤΑ'})
              </span>
              <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-amber-600 text-base">
                {decimalValue} / {maxSlices}
              </span>
            </div>

            <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
              <button
                onClick={(e) => updateValue(e, decimalMode === 'tenths' ? -1 : -5)}
                className="w-9 h-9 shrink-0 flex items-center justify-center bg-amber-100 hover:bg-amber-200 active:bg-amber-300 text-amber-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                title="Μείωση"
                aria-label="Μείωση τιμής"
              >
                －
              </button>

              <input
                type="range"
                min="0"
                max={maxSlices}
                value={decimalValue}
                onChange={(e) => setDecimalValue(parseInt(e.target.value, 10))}
                className="w-full min-w-0 max-w-full accent-amber-500 cursor-pointer"
              />

              <button
                onClick={(e) => updateValue(e, decimalMode === 'tenths' ? 1 : 5)}
                className="w-9 h-9 shrink-0 flex items-center justify-center bg-amber-100 hover:bg-amber-200 active:bg-amber-300 text-amber-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                title="Αύξηση"
                aria-label="Αύξηση τιμής"
              >
                ＋
              </button>
            </div>
          </div>

          {/* ΟΠΤΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ ΜΟΝΑΔΑΣ (RESPONSIVE SVG ΧΩΡΙΣ SCROLL) */}
          <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200/90 space-y-3">
            <span className="text-xs font-black uppercase text-slate-500 block text-center sm:text-left">
              Γεωμετρικη Οπτικοποιηση της Ενιαιας Μοναδας:
            </span>

            <div className="bg-white p-3 sm:p-5 rounded-2xl border border-slate-200 shadow-inner flex justify-center">
              {decimalMode === 'tenths' ? (
                // 10 Δέκατα σε οριζόντια μπάρα
                <svg
                  viewBox="0 0 500 80"
                  className="w-full h-auto max-w-xl block select-none font-sans"
                >
                  {Array.from({ length: 10 }).map((_, i) => {
                    const isFilled = i < decimalValue;
                    const xPos = 10 + i * 48;
                    return (
                      <g key={i}>
                        <rect
                          x={xPos}
                          y="15"
                          width="44"
                          height="44"
                          rx="6"
                          fill={isFilled ? '#f59e0b' : '#f8fafc'}
                          stroke={isFilled ? '#d97706' : '#cbd5e1'}
                          strokeWidth="1.5"
                        />
                        <text
                          x={xPos + 22}
                          y="42"
                          fill={isFilled ? '#ffffff' : '#94a3b8'}
                          fontSize="12"
                          fontWeight="800"
                          fontFamily="monospace"
                          textAnchor="middle"
                        >
                          1/10
                        </text>
                      </g>
                    );
                  })}
                </svg>
              ) : (
                // 100 Εκατοστά σε πλέγμα 10 x 10
                <svg
                  viewBox="0 0 340 340"
                  className="w-full h-auto max-w-[280px] sm:max-w-[320px] block select-none font-sans"
                >
                  {Array.from({ length: 100 }).map((_, i) => {
                    const row = Math.floor(i / 10);
                    const col = i % 10;
                    const isFilled = i < decimalValue;
                    const xPos = 10 + col * 32;
                    const yPos = 10 + row * 32;

                    return (
                      <rect
                        key={i}
                        x={xPos}
                        y={yPos}
                        width="28"
                        height="28"
                        rx="4"
                        fill={isFilled ? '#f59e0b' : '#f8fafc'}
                        stroke={isFilled ? '#d97706' : '#e2e8f0'}
                        strokeWidth="1"
                      />
                    );
                  })}
                </svg>
              )}
            </div>

            <p className="text-xs text-slate-500 text-center font-medium">
              Χρωματισμένα μέρη: <strong className="text-amber-600 font-bold">{decimalValue}</strong> από τα <strong className="text-slate-800 font-bold">{maxSlices}</strong> ίσα τμήματα της μονάδας.
            </p>
          </div>
        </div>

        {/* BOTTOM EXERCISES CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">📝 Ώρα για Εξάσκηση στους Δεκαδικούς!</h3>
            <p className="text-slate-800 text-sm md:text-base">
              Κατάλαβες πώς συνδέονται τα κλάσματα με τους δεκαδικούς αριθμούς; Κάνε τις διαδραστικές ασκήσεις!
            </p>
          </div>
          <Link
            href="/d-dimotikou/6-dekadikoi-ask"
            className="bg-slate-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            Ξεκίνα τις Ασκήσεις ➔
          </Link>
        </div>
      </div>
    </Layout>
  );
}
