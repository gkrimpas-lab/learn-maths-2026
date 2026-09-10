// pages/d-dimotikou/13-paralliles.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Βοηθητική συνάρτηση για clipping γραμμής μέσα στα όρια [minX, maxX, minY, maxY]
function clipLine(x0, y0, angleDeg, minX, maxX, minY, maxY) {
  const rad = (angleDeg * Math.PI) / 180;
  const dx = Math.cos(rad);
  const dy = Math.sin(rad);

  let tMin = -1000;
  let tMax = 1000;

  if (Math.abs(dx) > 0.0001) {
    const t1 = (minX - x0) / dx;
    const t2 = (maxX - x0) / dx;
    tMin = Math.max(tMin, Math.min(t1, t2));
    tMax = Math.min(tMax, Math.max(t1, t2));
  }
  if (Math.abs(dy) > 0.0001) {
    const t1 = (minY - y0) / dy;
    const t2 = (maxY - y0) / dy;
    tMin = Math.max(tMin, Math.min(t1, t2));
    tMax = Math.min(tMax, Math.max(t1, t2));
  }

  return {
    x1: x0 + tMin * dx,
    y1: y0 + tMin * dy,
    x2: x0 + tMax * dx,
    y2: y0 + tMax * dy
  };
}

export default function ParallilesTheoryPage() {
  const [lineType, setLineType] = useState('parallel'); // 'parallel', 'intersecting', 'perpendicular'
  const [angle, setAngle] = useState(65); // Γωνία κλίσης / διασταύρωσης
  const [distance, setDistance] = useState(60); // Απόσταση για παράλληλες

  const handleTypeSelect = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    setLineType(type);
    if (type === 'parallel') {
      setAngle(65);
      setDistance(60);
    } else if (type === 'intersecting') {
      setAngle(60);
    } else {
      setAngle(90);
    }
  };

  const updateDistance = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setDistance((prev) => Math.max(30, Math.min(110, prev + delta)));
  };

  const updateAngle = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    const minA = lineType === 'intersecting' ? 20 : 10;
    const maxA = lineType === 'intersecting' ? 160 : 170;
    setAngle((prev) => Math.max(minA, Math.min(maxA, prev + delta)));
  };

  return (
    <Layout
      title="Παράλληλες και Τεμνόμενες Ευθείες - Θεωρία | LearnMaths.gr"
      description="Μαθαίνουμε πότε δύο ευθείες είναι παράλληλες, πότε τεμνόμενες και πότε κάθετες με διαδραστικό γεωμετρικό εργαστήριο μεταβολής γωνίας και απόστασης."
      backUrl="/d-dimotikou"
      backText="Δ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/d-dimotikou/13-paralliles-ask"
          className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>🎯</span> Ασκήσεις
        </Link>
      }
    >
      <div className="space-y-8">
        {/* HEADER & EXERCISES PROMO CARD */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                Δ' ΔΗΜΟΤΙΚΟΥ
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                📐 Παράλληλες και Τεμνόμενες Ευθείες
              </h1>
              <p className="text-blue-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                Μαθαίνουμε πότε δύο ευθείες είναι παράλληλες (δεν συναντιούνται ποτέ), πότε είναι τεμνόμενες (τέμνονται σε ένα σημείο) και πότε είναι κάθετες!
              </p>
            </div>

            {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
              <div className="text-3xl">🚀</div>
              <h3 className="font-extrabold text-white text-lg">Έτοιμος για εξάσκηση;</h3>
              <p className="text-xs text-blue-100">
                Δοκίμασε τις ασκήσεις στις παράλληλες και τεμνόμενες ευθείες για να σιγουρευτείς ότι τις κατανόησες πλήρως!
              </p>
              <Link
                href="/d-dimotikou/13-paralliles-ask"
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
              <span>📖</span> Αναλυτική Θεωρία και Είδη Ευθειών
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Παράλληλες Ευθείες */}
            <div className="bg-blue-50/70 p-5 sm:p-6 rounded-2xl border border-blue-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-blue-900 flex items-center gap-2">
                <span>∥</span> Παράλληλες Ευθείες
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Δύο ευθείες λέγονται <strong>παράλληλες (ε₁ ∥ ε₂)</strong> όταν διατηρούν πάντοτε σταθερή απόσταση μεταξύ τους και <strong>δεν συναντιούνται ποτέ</strong>, όσο κι αν τις προεκτείνουμε.
              </p>
              <div className="bg-white p-2.5 rounded-xl border border-blue-100 text-xs font-mono font-bold text-blue-800 text-center shadow-sm">
                Παράδειγμα: Οι γραμμές του τρένου 🚂
              </div>
            </div>

            {/* 2. Τεμνόμενες Ευθείες */}
            <div className="bg-purple-50/70 p-5 sm:p-6 rounded-2xl border border-purple-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-purple-900 flex items-center gap-2">
                <span>✂️</span> Τεμνόμενες Ευθείες
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Δύο ευθείες λέγονται <strong>τεμνόμενες</strong> όταν διασταυρώνονται και συναντιούνται σε <strong>ένα ακριβώς κοινό σημείο</strong>, το οποίο ονομάζεται <strong>σημείο τομής (Σ)</strong>.
              </p>
              <div className="bg-white p-2.5 rounded-xl border border-purple-100 text-xs font-mono font-bold text-purple-800 text-center shadow-sm">
                Παράδειγμα: Ένα σταυροδρόμι ✖️
              </div>
            </div>

            {/* 3. Κάθετες Ευθείες */}
            <div className="bg-emerald-50/70 p-5 sm:p-6 rounded-2xl border border-emerald-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-emerald-900 flex items-center gap-2">
                <span>📐</span> Κάθετες Ευθείες
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Όταν δύο τεμνόμενες ευθείες σχηματίζουν στο σημείο τομής τους <strong>ορθή γωνία (90°)</strong>, ονομάζονται <strong>κάθετες ευθείες (ε₁ ⊥ ε₂)</strong>.
              </p>
              <div className="bg-white p-2.5 rounded-xl border border-emerald-100 text-xs font-mono font-bold text-emerald-800 text-center shadow-sm">
                Έλεγχος με τον γεωμετρικό γνώμονα 📐
              </div>
            </div>
          </div>
        </div>

        {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ - SECTION 2 */}
        <div className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4 border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🧮</span> Διαδραστικό Εργαστήριο Ευθειών
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                Επίλεξε είδος ευθειών, ρύθμισε τη γωνία ή την απόστασή τους και παρατήρησε τη γεωμετρική συμπεριφορά!
              </p>
            </div>

            {/* ΚΟΥΜΠΙΑ ΕΠΙΛΟΓΗΣ ΕΙΔΟΥΣ */}
            <div className="flex flex-wrap gap-2 self-start sm:self-auto">
              <button
                onClick={(e) => handleTypeSelect(e, 'parallel')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition active:scale-95 touch-manipulation ${
                  lineType === 'parallel'
                    ? 'bg-blue-600 text-white shadow-md font-black'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                ∥ Παράλληλες
              </button>
              <button
                onClick={(e) => handleTypeSelect(e, 'intersecting')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition active:scale-95 touch-manipulation ${
                  lineType === 'intersecting'
                    ? 'bg-purple-600 text-white shadow-md font-black'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                ✂️ Τεμνόμενες
              </button>
              <button
                onClick={(e) => handleTypeSelect(e, 'perpendicular')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition active:scale-95 touch-manipulation ${
                  lineType === 'perpendicular'
                    ? 'bg-emerald-600 text-white shadow-md font-black'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                📐 Κάθετες
              </button>
            </div>
          </div>

          {/* CONTROLS SLIDERS (ΚΑΝΟΝΑΣ 2) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200">
            {lineType === 'parallel' ? (
              <>
                {/* Slider Απόστασης */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
                  <div className="h-8 flex items-center justify-between text-center px-1">
                    <span className="text-xs font-black uppercase text-slate-500">ΑΠΟΣΤΑΣΗ ΕΥΘΕΙΩΝ</span>
                    <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-blue-600 text-base">
                      {distance} px
                    </span>
                  </div>

                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      onClick={(e) => updateDistance(e, -5)}
                      className="w-9 h-9 shrink-0 flex items-center justify-center bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                      title="Μείωση απόστασης"
                      aria-label="Μείωση απόστασης"
                    >
                      －
                    </button>

                    <input
                      type="range"
                      min="30"
                      max="110"
                      value={distance}
                      onChange={(e) => setDistance(Number(e.target.value))}
                      className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                    />

                    <button
                      onClick={(e) => updateDistance(e, 5)}
                      className="w-9 h-9 shrink-0 flex items-center justify-center bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                      title="Αύξηση απόστασης"
                      aria-label="Αύξηση απόστασης"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                {/* Slider Γωνίας Κλίσης */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
                  <div className="h-8 flex items-center justify-between text-center px-1">
                    <span className="text-xs font-black uppercase text-slate-500">ΓΩΝΙΑ ΚΛΙΣΗΣ</span>
                    <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-blue-600 text-base">
                      {angle}°
                    </span>
                  </div>

                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      onClick={(e) => updateAngle(e, -5)}
                      className="w-9 h-9 shrink-0 flex items-center justify-center bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                      title="Μείωση κλίσης"
                      aria-label="Μείωση γωνίας"
                    >
                      －
                    </button>

                    <input
                      type="range"
                      min="10"
                      max="170"
                      value={angle}
                      onChange={(e) => setAngle(Number(e.target.value))}
                      className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                    />

                    <button
                      onClick={(e) => updateAngle(e, 5)}
                      className="w-9 h-9 shrink-0 flex items-center justify-center bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                      title="Αύξηση κλίσης"
                      aria-label="Αύξηση γωνίας"
                    >
                      ＋
                    </button>
                  </div>
                </div>
              </>
            ) : lineType === 'intersecting' ? (
              <div className="md:col-span-2 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
                <div className="h-8 flex items-center justify-between text-center px-1">
                  <span className="text-xs font-black uppercase text-slate-500">ΓΩΝΙΑ ΔΙΑΣΤΑΥΡΩΣΗΣ</span>
                  <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-purple-600 text-base">
                    {angle}°
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    onClick={(e) => updateAngle(e, -5)}
                    className="w-9 h-9 shrink-0 flex items-center justify-center bg-purple-50 hover:bg-purple-100 active:bg-purple-200 text-purple-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                    title="Μείωση γωνίας"
                    aria-label="Μείωση γωνίας"
                  >
                    －
                  </button>

                  <input
                    type="range"
                    min="20"
                    max="160"
                    value={angle}
                    onChange={(e) => setAngle(Number(e.target.value))}
                    className="w-full min-w-0 max-w-full accent-purple-600 cursor-pointer"
                  />

                  <button
                    onClick={(e) => updateAngle(e, 5)}
                    className="w-9 h-9 shrink-0 flex items-center justify-center bg-purple-50 hover:bg-purple-100 active:bg-purple-200 text-purple-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                    title="Αύξηση γωνίας"
                    aria-label="Αύξηση γωνίας"
                  >
                    ＋
                  </button>
                </div>
              </div>
            ) : (
              <div className="md:col-span-2 text-center text-xs sm:text-sm font-bold text-emerald-900 bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200 shadow-sm">
                Οι κάθετες ευθείες σχηματίζουν σταθερή ορθή γωνία 90° στο σημείο τομής τους (ε₁ ⊥ ε₂)!
              </div>
            )}
          </div>

          {/* CANVAS ΟΠΤΙΚΟΠΟΙΗΣΗΣ (RESPONSIVE SVG ΧΩΡΙΣ SCROLL) */}
          <div className="bg-slate-950 p-4 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col items-center justify-center space-y-4">
            <div className="w-full max-w-xl aspect-[5/4] bg-slate-900/60 rounded-2xl border border-slate-800 relative flex items-center justify-center overflow-hidden">
              <svg className="w-full h-full block select-none" viewBox="0 0 500 420">
                {lineType === 'parallel' && (() => {
                  const rad = (angle * Math.PI) / 180;
                  const nx = -Math.sin(rad) * (distance / 2);
                  const ny = Math.cos(rad) * (distance / 2);

                  const x01 = 250 + nx;
                  const y01 = 210 + ny;
                  const x02 = 250 - nx;
                  const y02 = 210 - ny;

                  const line1 = clipLine(x01, y01, angle, 30, 470, 30, 390);
                  const line2 = clipLine(x02, y02, angle, 30, 470, 30, 390);

                  const label1X = line1.y1 < line1.y2 ? line1.x1 : line1.x2;
                  const label1Y = line1.y1 < line1.y2 ? line1.y1 : line1.y2;

                  const label2X = line2.y1 < line2.y2 ? line2.x1 : line2.x2;
                  const label2Y = line2.y1 < line2.y2 ? line2.y1 : line2.y2;

                  return (
                    <g>
                      {/* Ευθεία ε1 */}
                      <line
                        x1={line1.x1}
                        y1={line1.y1}
                        x2={line1.x2}
                        y2={line1.y2}
                        stroke="#3b82f6"
                        strokeWidth="5"
                        strokeLinecap="round"
                      />
                      <text x={label1X + 8} y={label1Y + 18} fill="#60a5fa" fontWeight="900" fontSize="18" fontFamily="sans-serif">
                        ε₁
                      </text>

                      {/* Ευθεία ε2 */}
                      <line
                        x1={line2.x1}
                        y1={line2.y1}
                        x2={line2.x2}
                        y2={line2.y2}
                        stroke="#60a5fa"
                        strokeWidth="5"
                        strokeLinecap="round"
                      />
                      <text x={label2X + 8} y={label2Y + 18} fill="#93c5fd" fontWeight="900" fontSize="18" fontFamily="sans-serif">
                        ε₂
                      </text>
                    </g>
                  );
                })()}

                {lineType === 'intersecting' && (() => {
                  const line1 = clipLine(250, 210, 0, 30, 470, 30, 390);
                  const line2 = clipLine(250, 210, angle, 30, 470, 30, 390);

                  return (
                    <g>
                      {/* Ευθεία ε1 */}
                      <line
                        x1={line1.x1}
                        y1={line1.y1}
                        x2={line1.x2}
                        y2={line1.y2}
                        stroke="#a855f7"
                        strokeWidth="5"
                        strokeLinecap="round"
                      />
                      <text x={line1.x2 - 28} y={line1.y2 - 12} fill="#c084fc" fontWeight="900" fontSize="18" fontFamily="sans-serif">
                        ε₁
                      </text>

                      {/* Ευθεία ε2 */}
                      <line
                        x1={line2.x1}
                        y1={line2.y1}
                        x2={line2.x2}
                        y2={line2.y2}
                        stroke="#e879f9"
                        strokeWidth="5"
                        strokeLinecap="round"
                      />
                      <text x={line2.x2 - 15} y={line2.y2 + 20} fill="#f0abfc" fontWeight="900" fontSize="18" fontFamily="sans-serif">
                        ε₂
                      </text>

                      {/* Σημείο Τομής Σ */}
                      <circle cx="250" cy="210" r="7" fill="#f43f5e" />
                      <text x="262" y="202" fill="#f43f5e" fontWeight="900" fontSize="20" fontFamily="sans-serif">
                        Σ
                      </text>
                    </g>
                  );
                })()}

                {lineType === 'perpendicular' && (
  <g>
    {/* Ευθεία ε1 (Οριζόντια) */}
    <line x1="40" y1="210" x2="460" y2="210" stroke="#10b981" strokeWidth="5" strokeLinecap="round" />
    <text x={435} y={195} fill="#34d399" fontWeight="900" fontSize="18" fontFamily="sans-serif">
      ε₁
    </text>

    {/* Ευθεία ε2 (Κάθετη) */}
    <line x1="250" y1="35" x2="250" y2="385" stroke="#059669" strokeWidth="5" strokeLinecap="round" />
    <text x={265} y={60} fill="#6ee7b7" fontWeight="900" fontSize="18" fontFamily="sans-serif">
      ε₂
    </text>

    {/* Καθαρό γωνιακό σύμβολο ορθής γωνίας (L) */}
    <path
      d="M 250 185 L 275 185 L 275 210"
      fill="none"
      stroke="#f59e0b"
      strokeWidth="2.5"
    />

    {/* Σημείο Τομής Σ & Ετικέτα (τοποθετημένη διαγώνια αριστερά ώστε να μην πατάει τη γωνία) */}
    <circle cx="250" cy="210" r="6" fill="#f43f5e" />
    <text x="230" y="235" fill="#f43f5e" fontWeight="900" fontSize="18" fontFamily="sans-serif">
      Σ
    </text>
  </g>
)}
              </svg>
            </div>

            {/* ΕΠΕΞΗΓΗΣΗ ΣΤΗΝ ΟΘΟΝΗ */}
            <div className="text-center space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                {lineType === 'parallel'
                  ? 'Παράλληλες Ευθείες (ε₁ ∥ ε₂)'
                  : lineType === 'intersecting'
                  ? 'Τεμνόμενες Ευθείες'
                  : 'Κάθετες Ευθείες (ε₁ ⊥ ε₂)'}
              </span>
              <p className="text-xs sm:text-sm font-bold text-white">
                {lineType === 'parallel'
                  ? 'Δεν τέμνονται ποτέ! Η απόστασή τους παραμένει αυστηρά σταθερή.'
                  : lineType === 'intersecting'
                  ? 'Τέμνονται ακριβώς σε ένα κοινό σημείο, το σημείο τομής Σ!'
                  : 'Τέμνονται σχηματίζοντας ορθή γωνία 90° (σύμβολο τετραγώνου 🟧)!'}
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM EXERCISES CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
            <p className="text-slate-800 text-sm md:text-base">
              Έμαθες τις παράλληλες, τις τεμνόμενες και τις κάθετες ευθείες; Δοκίμασε τις διαδραστικές ασκήσεις!
            </p>
          </div>
          <Link
            href="/d-dimotikou/13-paralliles-ask"
            className="bg-slate-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            Ξεκίνα τις Ασκήσεις ➔
          </Link>
        </div>
      </div>
    </Layout>
  );
}
