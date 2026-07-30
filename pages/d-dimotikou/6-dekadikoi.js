// pages/d-dimotikou/3-dekadikoi.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function DekadikoiPage() {
  const [decimalMode, setDecimalMode] = useState('tenths'); // 'tenths' | 'hundredths'
  const [decimalValue, setDecimalValue] = useState(4);

  const maxSlices = decimalMode === 'tenths' ? 10 : 100;
  const numericDecimal = decimalValue / maxSlices;

  const handleModeChange = (mode) => {
    setDecimalMode(mode);
    setDecimalValue(mode === 'tenths' ? 4 : 40);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🍰 Δεκαδικοί & Κλάσματα - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* NAVBAR */}
        <nav className="bg-white shadow-md w-full">
          <div className={`${LAYOUT.CONTAINER} py-4 flex justify-between items-center`}>
            <Link href="/d-dimotikou" className="text-2xl font-black text-amber-600 tracking-tight">
              LearnMaths<span className="text-indigo-600">.gr</span>
            </Link>
            <Link href="/d-dimotikou" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-sm">
              🔙 Επιστροφή
            </Link>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-12`}>
          <div className="space-y-8 bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100">
            
            {/* ΘΕΩΡΙΑ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-black text-gray-900 2xl:text-4xl">🍰 Από τα Κλάσματα στους Δεκαδικούς</h2>
                <p className="text-gray-600 leading-relaxed text-base xl:text-lg">
                  Όταν χωρίζουμε τη μονάδα σε <strong>10, 100 ή 1.000 ίσα μέρη</strong>, δημιουργούμε τα δεκαδικά κλάσματα. Αυτά μπορούμε να τα γράψουμε και ως <strong>δεκαδικούς αριθμούς</strong> χρησιμοποιώντας την υποδιαστολή!
                </p>
                <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 text-sm xl:text-base text-amber-900 space-y-2 shadow-inner">
                  <p>🔹 <strong>10 ίσα μέρη:</strong> Δέκατα (0,1)</p>
                  <p>🔸 <strong>100 ίσα μέρη:</strong> Εκατοστά (0,01)</p>
                </div>
              </div>

              {/* ΠΡΟΒΟΛΗ ΔΕΚΑΔΙΚΟΥ & ΚΛΑΣΜΑΤΟΣ */}
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-8 rounded-2xl shadow-md text-center py-10 space-y-6">
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => handleModeChange('tenths')}
                    className={`px-5 py-2 rounded-xl font-bold text-sm transition ${
                      decimalMode === 'tenths'
                        ? 'bg-white text-amber-600 shadow-md font-black'
                        : 'bg-amber-600/60 hover:bg-amber-600 text-white'
                    }`}
                  >
                    1/10 (Δέκατα)
                  </button>
                  <button
                    onClick={() => handleModeChange('hundredths')}
                    className={`px-5 py-2 rounded-xl font-bold text-sm transition ${
                      decimalMode === 'hundredths'
                        ? 'bg-white text-amber-600 shadow-md font-black'
                        : 'bg-amber-600/60 hover:bg-amber-600 text-white'
                    }`}
                  >
                    1/100 (Εκατοστά)
                  </button>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-2">
                  {/* ΚΛΑΣΜΑΤΙΚΗ ΜΟΡΦΗ */}
                  <div className="inline-flex flex-col items-center font-black text-3xl xl:text-4xl bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20">
                    <span className="text-amber-200">{decimalValue}</span>
                    <div className="w-20 h-1 bg-white rounded-full my-1"></div>
                    <span className="text-white">{maxSlices}</span>
                  </div>

                  <div className="text-3xl font-black text-amber-200">=</div>

                  {/* ΔΕΚΑΔΙΚΗ ΜΟΡΦΗ */}
                  <div className="bg-white text-amber-600 font-mono font-black text-4xl xl:text-5xl px-8 py-4 rounded-2xl shadow-inner">
                    {numericDecimal.toLocaleString('el-GR', {
                      minimumFractionDigits: decimalMode === 'tenths' ? 1 : 2,
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
            <div className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-200 space-y-6">
              <h3 className="text-xl font-black text-center text-gray-800 xl:text-2xl">
                🎚️ Σύρε τη μπάρα για να αλλάξεις την τιμή!
              </h3>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 max-w-2xl mx-auto space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-bold text-gray-500">
                    <span>0</span>
                    <span className="text-amber-600 font-extrabold text-base">
                      {decimalValue} / {maxSlices}
                    </span>
                    <span>1</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={maxSlices}
                    value={decimalValue}
                    onChange={(e) => setDecimalValue(parseInt(e.target.value))}
                    className="w-full h-3 bg-slate-200 accent-amber-500 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* ΟΠΤΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ ΜΟΝΑΔΑΣ */}
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-400 text-center uppercase tracking-wider mb-3">
                    Οπτικοποίηση Μονάδας
                  </p>
                  <div className="grid grid-cols-10 gap-1 bg-slate-100 p-2 rounded-xl border border-slate-200">
                    {Array.from({ length: maxSlices }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-8 rounded transition-all ${
                          i < decimalValue ? 'bg-amber-500 shadow-sm' : 'bg-white border border-slate-200'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

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
