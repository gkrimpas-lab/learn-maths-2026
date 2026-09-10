// pages/d-dimotikou/14-apostasi-simeiou-eutheia.js
import { useState, useRef } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function ApostasiTheoryPage() {
  // Θέση του σημείου Α (x, y)
  const [pointA, setPointA] = useState({ x: 250, y: 95 });
  // Γωνία κλίσης της ευθείας ε
  const [lineAngle, setLineAngle] = useState(0); // 0 μοίρες = οριζόντια
  const [isDragging, setIsDragging] = useState(false);
  const svgRef = useRef(null);

  // Σημείο αναφοράς της ευθείας (κέντρο καμβά)
  const linePoint = { x: 250, y: 240 };
  const rad = (lineAngle * Math.PI) / 180;

  // Διανύσματα ευθείας
  const dx = Math.cos(rad);
  const dy = Math.sin(rad);

  // Υπολογισμός της προβολής του Α πάνω στην ευθεία (Σημείο H - ίχνος κάθετης)
  const vx = pointA.x - linePoint.x;
  const vy = pointA.y - linePoint.y;
  const projLen = vx * dx + vy * dy;

  const pointH = {
    x: linePoint.x + projLen * dx,
    y: linePoint.y + projLen * dy
  };

  // Υπολογισμός απόστασης (σε pixels & μετατροπή σε cm: 35px ≈ 1cm)
  const distPx = Math.hypot(pointA.x - pointH.x, pointA.y - pointH.y);
  const distCm = (distPx / 35).toFixed(1).replace('.', ',');

  // Υπολογισμός ενός πλάγιου σημείου P για σύγκριση μηκών
  const pointP = {
    x: pointH.x + 85 * dx,
    y: pointH.y + 85 * dy
  };
  const distPlagiaPx = Math.hypot(pointA.x - pointP.x, pointA.y - pointP.y);
  const distPlagiaCm = (distPlagiaPx / 35).toFixed(1).replace('.', ',');

  const updateCoordinates = (clientX, clientY) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.max(50, Math.min(450, clientX - rect.left));
    const y = Math.max(45, Math.min(185, clientY - rect.top)); // Περιορισμός πάνω από την ευθεία
    setPointA({ x, y });
  };

  // Χειρισμός Mouse Dragging
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    updateCoordinates(e.clientX, e.clientY);
  };

  // Χειρισμός Touch Dragging (αποτροπή scroll οθόνης)
  const handleTouchStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !e.touches[0]) return;
    e.preventDefault();
    e.stopPropagation();
    updateCoordinates(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleEndDrag = () => {
    setIsDragging(false);
  };

  const updateAngle = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setLineAngle((prev) => Math.max(-45, Math.min(45, prev + delta)));
  };

  return (
    <Layout
      title="Απόσταση Σημείου από Ευθεία - Θεωρία | LearnMaths.gr"
      description="Μαθαίνουμε ότι η απόσταση ενός σημείου από μια ευθεία είναι το κάθετο ευθύγραμμο τμήμα (η συντομότερη διαδρομή) με διαδραστικό γεωμετρικό εργαστήριο."
      backUrl="/d-dimotikou"
      backText="Δ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/d-dimotikou/14-apostasi-simeiou-eutheia-ask"
          className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>🎯</span> Ασκήσεις
        </Link>
      }
    >
      <div
        className="space-y-8"
        onMouseUp={handleEndDrag}
        onTouchEnd={handleEndDrag}
      >
        {/* HEADER & EXERCISES PROMO CARD */}
        <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-indigo-600 text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                Δ' ΔΗΜΟΤΙΚΟΥ
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                📏 Απόσταση Σημείου από Ευθεία
              </h1>
              <p className="text-teal-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                Μαθαίνουμε ότι η απόσταση ενός σημείου από μια ευθεία είναι πάντοτε το <strong>κάθετο ευθύγραμμο τμήμα</strong>, που αποτελεί τη συντομότερη διαδρομή!
              </p>
            </div>

            {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
              <div className="text-3xl">🚀</div>
              <h3 className="font-extrabold text-white text-lg">Έτοιμος για εξάσκηση;</h3>
              <p className="text-xs text-teal-100">
                Δοκίμασε τις ασκήσεις στην απόσταση σημείου από ευθεία για να σιγουρευτείς ότι τις κατανόησες πλήρως!
              </p>
              <Link
                href="/d-dimotikou/14-apostasi-simeiou-eutheia-ask"
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
              <span>📖</span> Αναλυτική Θεωρία και Βασικοί Κανόνες
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Ορισμός */}
            <div className="bg-teal-50/70 p-5 sm:p-6 rounded-2xl border border-teal-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-teal-900 flex items-center gap-2">
                <span>📐</span> Τι είναι η Απόσταση;
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                <strong>Απόσταση</strong> ενός σημείου Α από μια ευθεία (ε) ονομάζεται το μήκος του <strong>κάθετου ευθύγραμμου τμήματος (ΑΗ)</strong> που φέρνουμε από το σημείο προς την ευθεία.
              </p>
            </div>

            {/* 2. Η Μικρότερη Διαδρομή */}
            <div className="bg-emerald-50/70 p-5 sm:p-6 rounded-2xl border border-emerald-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-emerald-900 flex items-center gap-2">
                <span>⚡</span> Η Συντομότερη Διαδρομή
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Το κάθετο τμήμα είναι <strong>πάντοτε το μικρότερο σε μήκος</strong>. Οποιοδήποτε άλλο πλάγιο (λοξό) τμήμα που συνδέει το σημείο με την ευθεία είναι μεγαλύτερο!
              </p>
            </div>

            {/* 3. Πώς τη μετράμε */}
            <div className="bg-indigo-50/70 p-5 sm:p-6 rounded-2xl border border-indigo-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-indigo-900 flex items-center gap-2">
                <span>📏</span> Πώς τη μετράμε;
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Τοποθετούμε τον <strong>γνώμονα</strong> πάνω στην ευθεία για να χαράξουμε την κάθετη γραμμή και έπειτα μετράμε το μήκος της με τον <strong>χάρακα</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ - SECTION 2 */}
        <div className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4 border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🧮</span> Διαδραστικό Εργαστήριο Απόστασης
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                <strong>Σύρε το κόκκινο σημείο Α</strong> ή άλλαξε την κλίση της ευθείας και δες σε πραγματικό χρόνο τη σύγκριση κάθετης και πλάγιας απόστασης!
              </p>
            </div>

            {/* CONTROL SLIDER ΓΙΑ ΤΗ ΓΩΝΙΑ ΤΗΣ ΕΥΘΕΙΑΣ */}
            <div className="w-full sm:w-72 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2 self-start sm:self-auto">
              <div className="h-8 flex items-center justify-between text-center px-1">
                <span className="text-xs font-black uppercase text-slate-500">ΚΛΙΣΗ ΕΥΘΕΙΑΣ (ε)</span>
                <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-indigo-600 text-base">
                  {lineAngle}°
                </span>
              </div>

              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  onClick={(e) => updateAngle(e, -5)}
                  className="w-9 h-9 shrink-0 flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                  title="Μείωση κλίσης"
                  aria-label="Μείωση κλίσης"
                >
                  －
                </button>

                <input
                  type="range"
                  min="-45"
                  max="45"
                  value={lineAngle}
                  onChange={(e) => setLineAngle(Number(e.target.value))}
                  className="w-full min-w-0 max-w-full accent-indigo-600 cursor-pointer"
                />

                <button
                  onClick={(e) => updateAngle(e, 5)}
                  className="w-9 h-9 shrink-0 flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                  title="Αύξηση κλίσης"
                  aria-label="Αύξηση κλίσης"
                >
                  ＋
                </button>
              </div>
            </div>
          </div>

          {/* CANVAS ΟΠΤΙΚΟΠΟΙΗΣΗΣ (ΜΕ TOUCH-ACTION: NONE ΓΙΑ ΝΑ ΜΗΝ ΚΟΥΝΙΕΤΑΙ Η ΣΕΛΙΔΑ) */}
          <div className="bg-slate-950 p-4 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col items-center justify-center space-y-5">
            <div
              ref={svgRef}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              style={{ touchAction: 'none' }}
              className="w-full max-w-xl aspect-[5/4] bg-slate-900/60 rounded-2xl border border-slate-800 relative select-none cursor-crosshair overflow-hidden touch-none"
            >
              <svg className="w-full h-full block select-none" viewBox="0 0 500 420">
                {/* Ευθεία ε */}
                <line
                  x1={linePoint.x - 300 * dx}
                  y1={linePoint.y - 300 * dy}
                  x2={linePoint.x + 300 * dx}
                  y2={linePoint.y + 300 * dy}
                  stroke="#3b82f6"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <text
                  x={linePoint.x + 200 * dx}
                  y={linePoint.y + 200 * dy - 14}
                  fill="#60a5fa"
                  fontWeight="900"
                  fontSize="18"
                  fontFamily="sans-serif"
                >
                  ευθεία (ε)
                </text>

                {/* Πλάγια Γραμμή (για σύγκριση) - Διακεκομμένη */}
                <line
                  x1={pointA.x}
                  y1={pointA.y}
                  x2={pointP.x}
                  y2={pointP.y}
                  stroke="#94a3b8"
                  strokeWidth="2.5"
                  strokeDasharray="6,6"
                />
                <circle cx={pointP.x} cy={pointP.y} r="4.5" fill="#94a3b8" />
                <text
                  x={pointP.x + 8}
                  y={pointP.y + 18}
                  fill="#94a3b8"
                  fontWeight="700"
                  fontSize="13"
                  fontFamily="sans-serif"
                >
                  Πλάγια
                </text>

                {/* Κάθετη Γραμμή (Απόσταση ΑΗ) - Πράσινη */}
                <line
                  x1={pointA.x}
                  y1={pointA.y}
                  x2={pointH.x}
                  y2={pointH.y}
                  stroke="#10b981"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle cx={pointH.x} cy={pointH.y} r="5" fill="#10b981" />
                <text
                  x={pointH.x - 16}
                  y={pointH.y + 22}
                  fill="#34d399"
                  fontWeight="900"
                  fontSize="16"
                  fontFamily="sans-serif"
                >
                  Η
                </text>

                {/* Καθαρό γωνιακό σύμβολο ορθής γωνίας (L) στο σημείο Η */}
                {(() => {
                  const normX = (pointA.x - pointH.x) / (distPx || 1);
                  const normY = (pointA.y - pointH.y) / (distPx || 1);
                  const size = 16;
                  const armH_X = pointH.x + dx * size;
                  const armH_Y = pointH.y + dy * size;
                  const cornerX = pointH.x + dx * size + normX * size;
                  const cornerY = pointH.y + dy * size + normY * size;
                  const armV_X = pointH.x + normX * size;
                  const armV_Y = pointH.y + normY * size;

                  return (
                    <path
                      d={`M ${armH_X} ${armH_Y} L ${cornerX} ${cornerY} L ${armV_X} ${armV_Y}`}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                    />
                  );
                })()}

                {/* Σημείο Α (Συρόμενο με mouse ή touch & διευρυμένο hitbox) */}
                <g
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleTouchStart}
                  className="cursor-grab active:cursor-grabbing touch-none"
                  style={{ touchAction: 'none' }}
                >
                  {/* Αόρατος κύκλος 30px για άνετο πιάσιμο σε κινητά */}
                  <circle cx={pointA.x} cy={pointA.y} r="30" fill="transparent" />
                  <circle cx={pointA.x} cy={pointA.y} r="16" fill="#f43f5e" fillOpacity="0.25" />
                  <circle cx={pointA.x} cy={pointA.y} r="8.5" fill="#f43f5e" stroke="#ffffff" strokeWidth="2.5" />
                  <text
                    x={pointA.x - 6}
                    y={pointA.y - 14}
                    fill="#f43f5e"
                    fontWeight="900"
                    fontSize="20"
                    fontFamily="sans-serif"
                  >
                    Α
                  </text>
                </g>
              </svg>
            </div>

            {/* ΠΙΝΑΚΑΣ ΜΕΤΡΗΣΕΩΝ & ΣΥΓΚΡΙΣΗΣ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-xl text-center">
              <div className="bg-emerald-950/80 p-4 rounded-2xl border border-emerald-600/50 text-emerald-200 shadow-sm">
                <span className="text-[11px] uppercase font-black tracking-wider block text-emerald-400">
                  🟢 ΚΑΘΕΤΗ ΑΠΟΣΤΑΣΗ (ΑΗ)
                </span>
                <div className="text-2xl sm:text-3xl font-mono font-black text-emerald-300 my-1">
                  {distCm} cm
                </div>
                <span className="text-[11px] font-bold text-emerald-400 block">
                  ⚡ Η Συντομότερη Διαδρομή!
                </span>
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-slate-300 shadow-sm">
                <span className="text-[11px] uppercase font-black tracking-wider block text-slate-400">
                  ⚪ ΠΛΑΓΙΑ ΔΙΑΔΡΟΜΗ
                </span>
                <div className="text-2xl sm:text-3xl font-mono font-black text-slate-200 my-1">
                  {distPlagiaCm} cm
                </div>
                <span className="text-[11px] font-bold text-rose-400 block">
                  ❌ Μεγαλύτερη από την κάθετη
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM EXERCISES CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
            <p className="text-slate-800 text-sm md:text-base">
              Έμαθες την απόσταση σημείου από ευθεία; Δοκίμασε τις διαδραστικές ασκήσεις!
            </p>
          </div>
          <Link
            href="/d-dimotikou/14-apostasi-simeiou-eutheia-ask"
            className="bg-slate-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            Ξεκίνα τις Ασκήσεις ➔
          </Link>
        </div>
      </div>
    </Layout>
  );
}
