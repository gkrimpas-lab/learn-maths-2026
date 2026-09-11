// pages/d-dimotikou/15-embadon.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function EmbadonTheoryPage() {
  const [valInput, setValInput] = useState('1');
  const [zoomLevel, setZoomLevel] = useState('m'); // 'm' (1 τ.μ.), 'dm' (100 τ.δ.), 'cm' (10.000 τ.εκ.)

  // Χειρισμός εισαγωγής με περιορισμό έως 10 ψηφία
  const handleInputChange = (e) => {
    const val = e.target.value.replace('.', ',').replace(/[^0-9,]/g, '');
    const digitsOnly = val.replace(/[^0-9]/g, '');

    if (digitsOnly.length <= 10) {
      setValInput(val);
    }
  };

  const numericVal = parseFloat(valInput.replace(',', '.')) || 0;

  // Υπολογισμός τιμών με βάση τον κανόνα του 100
  let valInM2 = 0;
  if (zoomLevel === 'm') valInM2 = numericVal;
  if (zoomLevel === 'dm') valInM2 = numericVal / 100;
  if (zoomLevel === 'cm') valInM2 = numericVal / 10000;

  const valInDm2 = valInM2 * 100;
  const valInCm2 = valInM2 * 10000;

  const formatNum = (n) => {
    if (Number.isInteger(n)) return n.toLocaleString('el-GR');
    return Number(n.toFixed(4)).toString().replace('.', ',');
  };

  const handleZoomChange = (e, level, defaultVal) => {
    e.preventDefault();
    e.stopPropagation();
    setZoomLevel(level);
    setValInput(defaultVal);
  };

  const handleDelta = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    const current = parseFloat(valInput.replace(',', '.')) || 0;
    const step = zoomLevel === 'cm' ? 500 : zoomLevel === 'dm' ? 5 : 1;
    const nextVal = Math.max(1, current + delta * step);
    setValInput(nextVal.toString().replace('.', ','));
  };

  return (
    <Layout
      title="Η Έννοια του Εμβαδού και Μετατροπές - Θεωρία | LearnMaths.gr"
      description="Μαθαίνουμε τι είναι εμβαδόν, το τετραγωνικό μέτρο (τ.μ.), τα υποπολλαπλάσια (τ.δ., τ.εκ.) και τον κανόνα του 100 με διαδραστικό εργαστήριο zoom."
      backUrl="/d-dimotikou"
      backText="Δ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/d-dimotikou/15-embadon-ask"
          className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>🎯</span> Ασκήσεις
        </Link>
      }
    >
      <div className="space-y-8">
        {/* HEADER & EXERCISES PROMO CARD */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                Δ' ΔΗΜΟΤΙΚΟΥ
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                🟩 Η Έννοια του Εμβαδού και Μετατροπές
              </h1>
              <p className="text-emerald-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                Μαθαίνουμε τι είναι το εμβαδόν μιας επιφάνειας και πώς 1 τετραγωνικό μέτρο (τ.μ.) αναλύεται σε 100 τ.δ. και σε 10.000 τ.εκ.!
              </p>
            </div>

            {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
              <div className="text-3xl">🚀</div>
              <h3 className="font-extrabold text-white text-lg">Έτοιμος για εξάσκηση;</h3>
              <p className="text-xs text-emerald-100">
                Δοκίμασε τις ασκήσεις στο εμβαδόν και τις μετατροπές για να σιγουρευτείς ότι τις κατανόησες πλήρως!
              </p>
              <Link
                href="/d-dimotikou/15-embadon-ask"
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
              <span>📖</span> Αναλυτική Θεωρία: Τι είναι το Εμβαδόν;
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Ορισμός */}
            <div className="bg-emerald-50/70 p-5 sm:p-6 rounded-2xl border border-emerald-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-emerald-900 flex items-center gap-2">
                <span>📐</span> Τι είναι το Εμβαδόν;
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                <strong>Εμβαδόν</strong> ενός γεωμετρικού σχήματος ονομάζεται το μέγεθος της εσωτερικής επιφάνειάς του (ο χώρος που περικλείεται μέσα στις γραμμές του).
              </p>
            </div>

            {/* 2. Βασική Μονάδα */}
            <div className="bg-teal-50/70 p-5 sm:p-6 rounded-2xl border border-teal-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-teal-900 flex items-center gap-2">
                <span>🟩</span> Το Τετραγωνικό Μέτρο
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Βασική μονάδα μέτρησης εμβαδού είναι το <strong>τετραγωνικό μέτρο (1 τ.μ.)</strong>. Αντιστοιχεί στην επιφάνεια ενός τετραγώνου με πλευρά 1 μέτρο (1 m).
              </p>
            </div>

            {/* 3. Ο Κανόνας του 100 */}
            <div className="bg-indigo-50/70 p-5 sm:p-6 rounded-2xl border border-indigo-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-indigo-900 flex items-center gap-2">
                <span>🔢</span> Ο Κανόνας του 100
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Στο εμβαδόν <strong>κάθε μονάδα είναι 100 φορές μεγαλύτερη</strong> από την αμέσως μικρότερη, επειδή πολλαπλασιάζουμε μήκος επί πλάτος (10 · 10 ＝ 100)!
              </p>
            </div>
          </div>

          {/* ΣΧΕΣΕΙΣ ΜΕΤΑΤΡΟΠΗΣ */}
          <div className="bg-slate-950 text-white p-5 sm:p-7 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base sm:text-lg font-extrabold text-amber-400 text-center sm:text-left">
              ⚡ Σχέσεις Μετατροπής Μονάδων Εμβαδού
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center font-mono text-xs sm:text-sm">
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-emerald-400 block text-[11px] uppercase font-black">1 τ.μ. σε τ.δ.</span>
                <div className="text-lg sm:text-xl font-black text-white">1 τ.μ. ＝ 100 τ.δ.</div>
                <span className="text-[11px] text-slate-400 block">10 dm · 10 dm ＝ 100 τ.δ.</span>
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-teal-400 block text-[11px] uppercase font-black">1 τ.δ. σε τ.εκ.</span>
                <div className="text-lg sm:text-xl font-black text-white">1 τ.δ. ＝ 100 τ.εκ.</div>
                <span className="text-[11px] text-slate-400 block">10 cm · 10 cm ＝ 100 τ.εκ.</span>
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-indigo-400 block text-[11px] uppercase font-black">1 τ.μ. σε τ.εκ.</span>
                <div className="text-lg sm:text-xl font-black text-amber-300">1 τ.μ. ＝ 10.000 τ.εκ.</div>
                <span className="text-[11px] text-slate-400 block">100 · 100 ＝ 10.000 τ.εκ.</span>
              </div>
            </div>
          </div>
        </div>

        {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ - SECTION 2 */}
        <div className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4 border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🧮</span> Διαδραστικό Εργαστήριο Zoom & Μετατροπών
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                Δες πώς το 1 τ.μ. «σπάει» οπτικά σε 100 τ.δ. και σε 10.000 τ.εκ.!
              </p>
            </div>

            {/* ΚΟΥΜΠΙΑ ZOOM LEVEL */}
            <div className="flex flex-wrap gap-2 self-start sm:self-auto">
              <button
                onClick={(e) => handleZoomChange(e, 'm', '1')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition active:scale-95 touch-manipulation ${
                  zoomLevel === 'm'
                    ? 'bg-emerald-600 text-white shadow-md font-black'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                1 τ.μ. (Μέτρο)
              </button>
              <button
                onClick={(e) => handleZoomChange(e, 'dm', '100')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition active:scale-95 touch-manipulation ${
                  zoomLevel === 'dm'
                    ? 'bg-teal-600 text-white shadow-md font-black'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                100 τ.δ. (Δεκατόμετρα)
              </button>
              <button
                onClick={(e) => handleZoomChange(e, 'cm', '10000')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition active:scale-95 touch-manipulation ${
                  zoomLevel === 'cm'
                    ? 'bg-indigo-600 text-white shadow-md font-black'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                10.000 τ.εκ. (Εκατοστά)
              </button>
            </div>
          </div>

          {/* ΟΠΤΙΚΟΠΟΙΗΣΗ ΠΛΕΓΜΑΤΟΣ (RESPONSIVE SVG ΧΩΡΙΣ SCROLL) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            {/* SVG GRID VISUALIZER */}
            <div className="bg-slate-950 p-5 sm:p-7 rounded-3xl border border-slate-800 shadow-xl flex flex-col items-center justify-center space-y-4">
              <div className="w-full max-w-[280px] sm:max-w-[320px] aspect-square bg-emerald-950/60 rounded-2xl border-4 border-emerald-500 p-2 relative flex items-center justify-center overflow-hidden shadow-inner">
                <svg className="w-full h-full block select-none" viewBox="0 0 300 300">
                  {/* LEVEL 1: 1 τ.μ. */}
                  {zoomLevel === 'm' && (
                    <g>
                      <rect x="5" y="5" width="290" height="290" rx="12" fill="#065f46" fillOpacity="0.35" stroke="#34d399" strokeWidth="3" strokeDasharray="8,8" />
                      <text x="150" y="145" fill="#6ee7b7" fontSize="34" fontWeight="900" fontFamily="monospace" textAnchor="middle">
                        1 τ.μ.
                      </text>
                      <text x="150" y="180" fill="#a7f3d0" fontSize="13" fontWeight="700" textAnchor="middle">
                        1 m · 1 m
                      </text>
                    </g>
                  )}

                  {/* LEVEL 2: 100 τ.δ. (Πλέγμα 10 x 10) */}
                  {zoomLevel === 'dm' && (
                    <g>
                      {Array.from({ length: 10 }).map((_, r) =>
                        Array.from({ length: 10 }).map((_, c) => (
                          <rect
                            key={`${r}-${c}`}
                            x={c * 30 + 1}
                            y={r * 30 + 1}
                            width="28"
                            height="28"
                            rx="3"
                            fill="#115e59"
                            fillOpacity="0.6"
                            stroke="#2dd4bf"
                            strokeWidth="1"
                          />
                        ))
                      )}
                    </g>
                  )}

                  {/* LEVEL 3: 10.000 τ.εκ. */}
                  {zoomLevel === 'cm' && (
                    <g>
                      {/* Πυκνό φόντο πλέγματος */}
                      {Array.from({ length: 20 }).map((_, r) =>
                        Array.from({ length: 20 }).map((_, c) => (
                          <rect
                            key={`${r}-${c}`}
                            x={c * 15 + 0.5}
                            y={r * 15 + 0.5}
                            width="14"
                            height="14"
                            fill="#312e81"
                            stroke="#818cf8"
                            strokeWidth="0.5"
                            strokeOpacity="0.4"
                          />
                        ))
                      )}
                      <rect x="35" y="105" width="230" height="90" rx="14" fill="#020617" fillOpacity="0.9" stroke="#6366f1" strokeWidth="2" />
                      <text x="150" y="145" fill="#a5b4fc" fontSize="22" fontWeight="900" fontFamily="monospace" textAnchor="middle">
                        10.000 τ.εκ.
                      </text>
                      <text x="150" y="172" fill="#c7d2fe" fontSize="12" fontWeight="700" textAnchor="middle">
                        100 cm · 100 cm
                      </text>
                    </g>
                  )}
                </svg>
              </div>

              <span className="text-xs font-black uppercase tracking-wider text-slate-400 block text-center">
                {zoomLevel === 'm'
                  ? 'Βασικη Μοναδα (1 τ.μ.)'
                  : zoomLevel === 'dm'
                  ? 'Πλεγμα 10 · 10 ＝ 100 τ.δ.'
                  : 'Πλεγμα 100 · 100 ＝ 10.000 τ.εκ.'}
              </span>
            </div>

            {/* ΖΩΝΤΑΝΟΣ ΜΕΤΑΤΡΟΠΕΑΣ ΕΜΒΑΔΟΥ (ΚΑΝΟΝΑΣ 2) */}
            <div className="bg-slate-50 p-5 sm:p-7 rounded-3xl border border-slate-200 space-y-4">
              <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <span>🧮</span> Ζωντανός Μετατροπέας Εμβαδού
              </h3>

              {/* Touch Stepper & Input */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
                <div className="h-8 flex items-center justify-between text-center px-1">
                  <span className="text-[11px] font-black uppercase text-slate-500 truncate">
                    ΤΙΜΗ ΣΕ {zoomLevel === 'm' ? 'τ.μ.' : zoomLevel === 'dm' ? 'τ.δ.' : 'τ.εκ.'}
                  </span>
                  <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-emerald-600 text-base">
                    {valInput} {zoomLevel === 'm' ? 'τ.μ.' : zoomLevel === 'dm' ? 'τ.δ.' : 'τ.εκ.'}
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    onClick={(e) => handleDelta(e, -1)}
                    className="w-9 h-9 shrink-0 flex items-center justify-center bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                    title="Μείωση"
                    aria-label="Μείωση τιμής"
                  >
                    －
                  </button>

                  <input
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    id="area-calc-val"
                    name="area-calc-val"
                    value={valInput}
                    onChange={handleInputChange}
                    className="w-full min-w-0 max-w-full text-center font-mono font-black text-base sm:text-lg text-slate-800 border border-slate-300 rounded-xl py-1.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="π.χ. 1"
                  />

                  <button
                    onClick={(e) => handleDelta(e, 1)}
                    className="w-9 h-9 shrink-0 flex items-center justify-center bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                    title="Αύξηση"
                    aria-label="Αύξηση τιμής"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* ΠΙΝΑΚΑΣ ΑΥΤΟΜΑΤΗΣ ΜΕΤΑΤΡΟΠΗΣ */}
              <div className="space-y-2.5">
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex justify-between items-center shadow-sm">
                  <span className="text-xs font-bold text-slate-600">Τετραγωνικά Μέτρα (τ.μ.)</span>
                  <span className="text-base sm:text-lg font-mono font-black text-emerald-600">
                    {formatNum(valInM2)} τ.μ.
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex justify-between items-center shadow-sm">
                  <span className="text-xs font-bold text-slate-600">Τετραγωνικά Δεκατόμετρα (τ.δ.)</span>
                  <span className="text-base sm:text-lg font-mono font-black text-teal-600">
                    {formatNum(valInDm2)} τ.δ.
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex justify-between items-center shadow-sm">
                  <span className="text-xs font-bold text-slate-600">Τετραγωνικά Εκατοστά (τ.εκ.)</span>
                  <span className="text-base sm:text-lg font-mono font-black text-indigo-600">
                    {formatNum(valInCm2)} τ.εκ.
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
              Έμαθες το εμβαδόν και τις μετατροπές του; Δοκίμασε τις διαδραστικές ασκήσεις!
            </p>
          </div>
          <Link
            href="/d-dimotikou/15-embadon-ask"
            className="bg-slate-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            Ξεκίνα τις Ασκήσεις ➔
          </Link>
        </div>
      </div>
    </Layout>
  );
}
