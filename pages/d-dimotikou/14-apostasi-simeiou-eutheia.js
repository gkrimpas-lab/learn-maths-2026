import { useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function ApostasiTheoryPage() {
  // Θέση του σημείου Α (x, y)
  const [pointA, setPointA] = useState({ x: 250, y: 100 });
  // Γωνία κλίσης της ευθείας ε
  const [lineAngle, setLineAngle] = useState(0); // 0 μοίρες = οριζόντια
  const [isDragging, setIsDragging] = useState(false);
  const svgRef = useRef(null);

  // Σημείο αναφοράς της ευθείας (κέντρο καμβά)
  const linePoint = { x: 250, y: 250 };
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

  // Υπολογισμός απόστασης (σε pixels & μετατροπή σε cm για εκπαιδευτικούς λόγους)
  const distPx = Math.hypot(pointA.x - pointH.x, pointA.y - pointH.y);
  const distCm = (distPx / 35).toFixed(1).replace('.', ','); // 35px ≈ 1cm

  // Υπολογισμός ενός πλάγιου σημείου P για σύγκριση μηκών
  const pointP = {
    x: pointH.x + 80 * dx,
    y: pointH.y + 80 * dy
  };
  const distPlagiaPx = Math.hypot(pointA.x - pointP.x, pointA.y - pointP.y);
  const distPlagiaCm = (distPlagiaPx / 35).toFixed(1).replace('.', ',');

  // Χειρισμός Dragging του σημείου A
  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.max(40, Math.min(460, e.clientX - rect.left));
    const y = Math.max(40, Math.min(200, e.clientY - rect.top)); // Περιορισμός πάνω από την ευθεία
    setPointA({ x, y });
  };

  // Για υποστήριξη οθονών αφής (Mobile/Tablet)
  const handleTouchMove = (e) => {
    if (!isDragging || !svgRef.current) return;
    const touch = e.touches[0];
    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.max(40, Math.min(460, touch.clientX - rect.left));
    const y = Math.max(40, Math.min(200, touch.clientY - rect.top));
    setPointA({ x, y });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between"
         onMouseUp={handleMouseUp}
         onTouchEnd={handleMouseUp}>
      <Head>
        <title>📏 Απόσταση Σημείου από Ευθεία - LearnMaths.gr</title>
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
              <Link href="/d-dimotikou/14-apostasi-simeiou-eutheia-ask" className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2">
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
          <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-indigo-600 text-white p-8 rounded-3xl shadow-md relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-3">
                <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                  Δ' ΔΗΜΟΤΙΚΟΥ
                </span>
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
                  📏 Απόσταση Σημείου από Ευθεία
                </h1>
                <p className="text-teal-100 text-base lg:text-lg leading-relaxed">
                  Μαθαίνουμε ότι η απόσταση ενός σημείου από μια ευθεία είναι το "κάθετο ευθύγραμμο τμήμα" (η πιο σύντομη διαδρομή)!
                </p>
              </div>

              {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
                <div className="text-3xl">🚀</div>
                <h3 className="font-extrabold text-white text-lg">Έτοιμος για εξάσκηση;</h3>
                <p className="text-xs text-teal-100">Δοκίμασε τις ασκήσεις στην απόσταση σημείου από ευθεία για να σιγουρευτείς ότι την έμαθες!</p>
                <Link 
                  href="/d-dimotikou/14-apostasi-simeiou-eutheia-ask"
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
                <span>📖</span> Αναλυτική Θεωρία & Βασικοί Κανόνες
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* 1. Ορισμός */}
              <div className="bg-teal-50/70 p-6 rounded-2xl border border-teal-100 space-y-3">
                <h3 className="text-lg font-bold text-teal-900 flex items-center gap-2">
                  <span>📐</span> Τι είναι η Απόσταση;
                </h3>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  Απόσταση ενός σημείου Α από μια ευθεία (ε) λέγεται το μήκος του <strong>κάθετου ευθύγραμμου τμήματος (ΑΗ)</strong> που φέρνουμε από το σημείο προς την ευθεία.
                </p>
              </div>

              {/* 2. Η Μικρότερη Διαδρομή */}
              <div className="bg-emerald-50/70 p-6 rounded-2xl border border-emerald-100 space-y-3">
                <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
                  <span>⚡</span> Η Μικρότερη Απόσταση
                </h3>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  Το κάθετο τμήμα είναι <strong>πάντα το πιο σύντομο (μικρότερο)</strong>. Οποιοδήποτε άλλο λοξό τμήμα που ενώνει το σημείο με την ευθεία είναι μεγαλύτερο!
                </p>
              </div>

              {/* 3. Πώς τη μετράμε */}
              <div className="bg-indigo-50/70 p-6 rounded-2xl border border-indigo-100 space-y-3">
                <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
                  <span>📏</span> Πώς τη μετράμε;
                </h3>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  Χρησιμοποιούμε τον <strong>γνώμονα</strong> για να φέρουμε την κάθετη γραμμή και μετά μετράμε το μήκος της με τον <strong>χάρακα</strong>!
                </p>
              </div>

            </div>

          </div>

          {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ - SECTION 2 */}
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4 border-gray-100">
              <div>
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <span>🧮</span> Διαδραστικό Εργαστήριο Απόστασης
                </h2>
                <p className="text-gray-500 text-sm">
                  <strong>Σύρε με το ποντίκι το κόκκινο Σημείο Α</strong> ή άλλαξε τη γωνία της ευθείας και δες πώς αλλάζει η κάθετη απόσταση!
                </p>
              </div>

              {/* CONTROL SLIDER ΓΙΑ ΤΗ ΓΩΝΙΑ ΤΗΣ ΕΥΘΕΙΑΣ */}
              <div className="w-full md:w-64 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <label className="block text-xs font-black text-gray-500 mb-1">
                  Γωνία Ευθείας (ε): <span className="text-indigo-600 font-mono font-black">{lineAngle}°</span>
                </label>
                <input 
                  type="range" 
                  min="-45" 
                  max="45" 
                  value={lineAngle} 
                  onChange={(e) => setLineAngle(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>

            {/* CANVAS ΟΠΤΙΚΟΠΟΙΗΣΗΣ (SVG) */}
            <div className="bg-slate-900 p-6 md:p-10 rounded-3xl shadow-xl flex flex-col items-center justify-center space-y-6">
              
              <div 
                ref={svgRef}
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
                className="w-full max-w-2xl h-[420px] bg-slate-950 rounded-2xl border border-slate-800 relative select-none cursor-crosshair overflow-hidden"
              >
                <svg className="w-full h-full" viewBox="0 0 500 450">
                  
                  {/* Ευθεία ε */}
                  <line 
                    x1={linePoint.x - 300 * dx} y1={linePoint.y - 300 * dy} 
                    x2={linePoint.x + 300 * dx} y2={linePoint.y + 300 * dy} 
                    stroke="#3b82f6" strokeWidth="5" strokeLinecap="round" 
                  />
                  <text x={linePoint.x + 210 * dx} y={linePoint.y + 210 * dy - 15} fill="#60a5fa" fontWeight="black" fontSize="20">ευθεία (ε)</text>

                  {/* Πλάγια Γραμμή (για σύγκριση) - Διακεκομμένη */}
                  <line 
                    x1={pointA.x} y1={pointA.y} 
                    x2={pointP.x} y2={pointP.y} 
                    stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="6,6" 
                  />
                  <circle cx={pointP.x} cy={pointP.y} r="4" fill="#94a3b8" />
                  <text x={pointP.x + 8} y={pointP.y + 18} fill="#94a3b8" fontWeight="bold" fontSize="14">Πλάγια</text>

                  {/* Κάθετη Γραμμή (Απόσταση ΑΗ) - Πράσινη */}
                  <line 
                    x1={pointA.x} y1={pointA.y} 
                    x2={pointH.x} y2={pointH.y} 
                    stroke="#10b981" strokeWidth="4" 
                  />
                  <circle cx={pointH.x} cy={pointH.y} r="5" fill="#10b981" />
                  <text x={pointH.x - 18} y={pointH.y + 22} fill="#34d399" fontWeight="black" fontSize="16">Η</text>

                  {/* Σύμβολο Ορθής Γωνίας στο Η */}
                  {(() => {
                    const normX = (pointA.x - pointH.x) / (distPx || 1);
                    const normY = (pointA.y - pointH.y) / (distPx || 1);
                    const size = 16;
                    const sqX = pointH.x + normX * size;
                    const sqY = pointH.y + normY * size;
                    const cornerX = sqX + dx * size;
                    const cornerY = sqY + dy * size;
                    const sq2X = pointH.x + dx * size;
                    const sq2Y = pointH.y + dy * size;

                    return (
                      <path 
                        d={`M ${sq2X} ${sq2Y} L ${cornerX} ${cornerY} L ${sqX} ${sqY}`} 
                        fill="none" stroke="#f59e0b" strokeWidth="2" 
                      />
                    );
                  })()}

                  {/* Σημείο Α (Συρόμενο) */}
                  <g 
                    onMouseDown={handleMouseDown} 
                    onTouchStart={handleMouseDown}
                    className="cursor-grab active:cursor-grabbing"
                  >
                    <circle cx={pointA.x} cy={pointA.y} r="14" fill="#f43f5e" fillOpacity="0.3" />
                    <circle cx={pointA.x} cy={pointA.y} r="8" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" />
                    <text x={pointA.x - 6} y={pointA.y - 14} fill="#f43f5e" fontWeight="black" fontSize="20">Α</text>
                  </g>

                </svg>
              </div>

              {/* ΠΙΝΑΚΑΣ ΜΕΤΡΗΣΕΩΝ & ΣΥΓΚΡΙΣΗΣ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl text-center">
                
                <div className="bg-emerald-950/80 p-4 rounded-2xl border border-emerald-600/50 text-emerald-200">
                  <span className="text-xs uppercase font-black tracking-wider block text-emerald-400">
                    🟢 Καθετη Αποσταση (ΑΗ)
                  </span>
                  <div className="text-2xl font-mono font-black text-emerald-300 my-1">
                    {distCm} cm
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400 block">
                    ⚡ Η Μικρότερη Διαδρομή!
                  </span>
                </div>

                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 text-slate-300">
                  <span className="text-xs uppercase font-black tracking-wider block text-slate-400">
                    ⚪ Πλαγια Διαδρομη
                  </span>
                  <div className="text-2xl font-mono font-black text-slate-200 my-1">
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
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
              <p className="text-gray-800 text-sm md:text-base">
                Έμαθες την απόσταση σημείου από ευθεία; Δοκίμασε τις διαδραστικές ασκήσεις!
              </p>
            </div>
            <Link
              href="/d-dimotikou/14-apostasi-simeiou-eutheia-ask"
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
