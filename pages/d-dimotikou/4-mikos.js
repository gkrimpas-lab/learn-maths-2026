// pages/d-dimotikou/4-mikos.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function MikosPage() {
  const [lengthInCm, setLengthInCm] = useState(125);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>📏 Μέτρηση Μήκους - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* NAVBAR */}
        <nav className="bg-white shadow-md w-full">
          <div className={`${LAYOUT.CONTAINER} py-4 flex justify-between items-center`}>
            <Link href="/d-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight">
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
                <h2 className="text-3xl font-black text-gray-900 2xl:text-4xl">📏 Μετρώ και Εκφράζω το Μήκος</h2>
                <p className="text-gray-600 leading-relaxed text-base xl:text-lg">
                  Βασική μονάδα μέτρησης του μήκους είναι το <strong>μέτρο (m)</strong>. Για να μετρήσουμε μικρότερα ή μεγαλύτερα μήκη, χρησιμοποιούμε τις υποδιαιρέσεις και τα πολλαπλάσιά του!
                </p>
                <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 text-sm xl:text-base text-blue-900 space-y-2 shadow-inner">
                  <p>📏 <strong>1 μέτρο (m) = 100 εκατοστά (cm)</strong></p>
                  <p>🔹 <strong>1 εκατοστό (cm) = 10 χιλιοστά (mm)</strong></p>
                  <p>🚗 <strong>1 χιλιόμετρο (km) = 1.000 μέτρα (m)</strong></p>
                </div>
              </div>

              {/* ΠΡΟΒΟΛΗ ΑΠΟΤΕΛΕΣΜΑΤΟΣ */}
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-8 rounded-2xl shadow-md text-center py-10 space-y-4">
                <span className="text-xs font-black uppercase tracking-widest text-blue-200">Τιμή Μήκους</span>
                <div className="text-4xl xl:text-5xl font-mono font-black tracking-tight text-white">
                  {lengthInCm} <span className="text-2xl xl:text-3xl font-bold text-blue-200">cm</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-lg xl:text-xl font-mono font-bold text-blue-50">
                  = <span className="text-amber-300 font-extrabold">{(lengthInCm / 100).toFixed(2)}</span> m
                </div>
              </div>
            </div>

            {/* ΔΙΑΔΡΑΣΤΙΚΟΣ ΧΑΡΑΚΑΣ */}
            <div className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-200 space-y-6">
              <h3 className="text-xl font-black text-center text-gray-800 xl:text-2xl">
                🎚️ Μετακίνησε το ρυθμιστικό για να μετρήσεις!
              </h3>

              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 space-y-6">
                
                {/* SLIDER */}
                <div className="max-w-2xl mx-auto space-y-2">
                  <div className="flex justify-between text-sm font-bold text-gray-500">
                    <span>0 cm</span>
                    <span className="text-blue-600 font-extrabold text-base">{lengthInCm} cm</span>
                    <span>200 cm (2m)</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="1"
                    value={lengthInCm}
                    onChange={(e) => setLengthInCm(parseInt(e.target.value))}
                    className="w-full h-3 bg-slate-200 accent-blue-500 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* SVG ΧΑΡΑΚΑΣ */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 flex flex-col items-center justify-center shadow-inner overflow-x-auto">
                  <div className="w-full min-w-[500px] max-w-3xl bg-white p-4 rounded-xl border border-amber-200 shadow overflow-visible">
                    <svg viewBox="0 0 220 40" className="w-full overflow-visible font-mono">
                      <rect x="0" y="15" width="220" height="20" className="fill-yellow-50 stroke-amber-200 stroke-[0.5] rounded-sm" />
                      {lengthInCm > 0 && (
                        <rect
                          x="10"
                          y="4"
                          width={(lengthInCm / 200) * 200}
                          height="8"
                          className="fill-amber-400 stroke-orange-500 stroke-[0.5] rounded-t transition-all duration-150"
                        />
                      )}
                      {lengthInCm > 0 && (
                        <text
                          x={Math.max(10, 10 + ((lengthInCm / 200) * 200) - 10)}
                          y="0"
                          className="text-[4px] font-black fill-orange-700"
                        >
                          {(lengthInCm / 100).toFixed(2)} m
                        </text>
                      )}
                      {Array.from({ length: 21 }).map((_, i) => {
                        const xPos = 10 + i * 10;
                        const isMeter = i % 10 === 0;
                        const isHalfMeter = i % 5 === 0 && !isMeter;
                        return (
                          <g key={i}>
                            <line
                              x1={xPos}
                              y1="15"
                              x2={xPos}
                              y2={isMeter ? "27" : (isHalfMeter ? "24" : "21")}
                              className={isMeter ? "stroke-slate-800 stroke-[0.8]" : "stroke-slate-400 stroke-[0.4]"}
                            />
                            {isMeter && (
                              <text x={xPos - 3} y="33" className="text-[5px] font-black fill-slate-800">
                                {i / 10}m
                              </text>
                            )}
                            {!isMeter && i % 2 === 0 && (
                              <text x={xPos - 4} y="32" className="text-[3.5px] font-bold fill-slate-400">
                                {i * 10}
                              </text>
                            )}
                          </g>
                        );
                      })}
                    </svg>
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
