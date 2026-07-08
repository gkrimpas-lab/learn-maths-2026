import { useState, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

function formatGreekNumber(num) {
  return new Intl.NumberFormat("el-GR").format(num);
}

export default function MonadesEpifaneiasPage() {
  // Ο μαθητής επιλέγει πλέον dm² από 1 έως 100
  const [squareDecimeters, setSquareDecimeters] = useState(25);

  // Υπολογισμός όλων των άλλων μονάδων με βάση τα dm²
  const currentM2 = squareDecimeters / 100;
  const currentCm2 = squareDecimeters * 100;
  const currentMm2 = squareDecimeters * 10000;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>📐 Μονάδες Επιφάνειας - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* NAVBAR */}
        <nav className="bg-white w-full border-b border-gray-100">
          <div className={`${LAYOUT.CONTAINER} py-4 flex justify-between items-center`}>
            <Link href="/e-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight">
              LearnMaths<span className="text-indigo-600">.gr</span>
            </Link>
            
            <Link href="/e-dimotikou" className="bg-[#f1f1f4] hover:bg-[#e4e4e8] text-[#4a4a52] px-4 py-2 rounded-2xl text-xs font-black transition flex items-center gap-1.5 tracking-wide">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-600 stroke-[3] stroke-current">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Επιστροφή
            </Link>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-12 space-y-12`}>
          
          {/* SECTION 1: ΘΕΩΡΙΑ */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <span className="text-xl">📖</span> Θεωρία: Το 1 m² σπάει σε μικρότερα κομμάτια!
            </h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              Όταν αλλάζουμε μονάδες επιφάνειας, κάθε βήμα προς τα κάτω είναι <strong>&times;100</strong>. Δες στο δεξί μέρος πώς 1 τετραγωνικό μέτρο (m²) περιέχει 100 δεκάμετρα, και πώς το κάθε δεκάμετρο περιέχει άλλα 100 μικροσκοπικά εκατοστά!
            </p>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ & ΚΑΡΤΕΣ */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[580px] w-full gap-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                    <span>🕹️</span> 1. Διάλεξε Ποσότητα (dm²)
                  </h3>
                  
                  {/* Slider Επιλογής dm² */}
                  <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl shadow-inner space-y-2">
                    <label htmlFor="dm2range" className="block text-sm font-bold text-slate-700">
                      Τετραγωνικά δεκατόμετρα (dm²): <span className="text-xl font-mono font-black text-blue-600">{squareDecimeters} / 100</span>
                    </label>
                    <input
                      id="dm2range"
                      type="range"
                      min="1"
                      max="100"
                      step="1"
                      value={squareDecimeters}
                      onChange={(e) => setSquareDecimeters(Number(e.target.value))}
                      className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Κάρτες Μετατροπών */}
                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-3">
                    2. Δες τις Μετατροπές
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white border rounded-2xl p-4 shadow-sm" style={{ borderTop: "5px solid #0f766e" }}>
                      <span className="text-xs font-bold text-gray-500">🏠 τ. μέτρα (m²)</span>
                      <div className="text-xl font-mono font-black text-slate-800 mt-1">{currentM2}</div>
                    </div>
                    <div className="bg-white border rounded-2xl p-4 shadow-sm" style={{ borderTop: "5px solid #2563eb" }}>
                      <span className="text-xs font-bold text-gray-500">🟩 τ. δεκατόμετρα (dm²)</span>
                      <div className="text-xl font-mono font-black text-slate-800 mt-1">{squareDecimeters}</div>
                    </div>
                    <div className="bg-white border rounded-2xl p-4 shadow-sm" style={{ borderTop: "5px solid #d97706" }}>
                      <span className="text-xs font-bold text-gray-500">📏 τ. εκατοστά (cm²)</span>
                      <div className="text-xl font-mono font-black text-slate-800 mt-1">{formatGreekNumber(currentCm2)}</div>
                    </div>
                    <div className="bg-white border rounded-2xl p-4 shadow-sm" style={{ borderTop: "5px solid #dc2626" }}>
                      <span className="text-xs font-bold text-gray-500">🔍 τ. χιλιοστά (mm²)</span>
                      <div className="text-xl font-mono font-black text-slate-800 mt-1">{formatGreekNumber(currentMm2)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ΒΗΜΑ-ΒΗΜΑ ΑΝΑΛΥΣΗ */}
              <div className="bg-emerald-50 text-slate-900 p-5 rounded-2xl border border-emerald-100 space-y-2.5 shadow-sm mt-auto">
                <p className="font-bold text-emerald-900 flex items-center gap-2 text-sm">
                  <span>🧠</span> Πώς προκύπτουν οι αριθμοί:
                </p>
                <div className="space-y-1.5 font-mono text-xs md:text-sm text-emerald-800">
                  <div className="flex justify-between border-b border-emerald-100/50 pb-1">
                    <span>{squareDecimeters} dm² &divide; 100 =</span>
                    <span className="font-bold">{currentM2} m²</span>
                  </div>
                  <div className="flex justify-between border-b border-emerald-100/50 pb-1">
                    <span>{squareDecimeters} dm² &times; 100 =</span>
                    <span className="font-bold">{formatGreekNumber(currentCm2)} cm²</span>
                  </div>
                  <div className="flex justify-between pb-0.5">
                    <span>{formatGreekNumber(currentCm2)} cm² &times; 100 =</span>
                    <span className="font-bold">{formatGreekNumber(currentMm2)} mm²</span>
                  </div>
                </div>
                <p className="text-[11px] text-emerald-700/80 leading-relaxed pt-1 border-t border-emerald-200/40 text-center font-medium">
                  &ldquo;Από μια μονάδα επιφάνειας στην αμέσως μικρότερη πολλαπλασιάζουμε με 100, ενώ προς τη μεγαλύτερη διαιρούμε με 100.&rdquo;
                </p>
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΜΕΓΑΛΟ SVG ΠΛΕΓΜΑ ΜΕ ΥΠΟΔΙΑΙΡΕΣΕΙΣ */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[580px] w-full relative overflow-hidden">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 block text-center">
                ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ: ΟΛΟΚΛΗΡΟ ΤΟ ΠΛΑΙΣΙΟ = 1 m²
              </span>
              
              <div className="text-sm font-bold text-blue-600 mb-6 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full font-mono">
                Έχεις φωτίσει: {squareDecimeters} dm²
              </div>

              {/* Μεγάλο SVG Σχήμα (400x400) */}
              <div className="relative bg-slate-50 p-2 rounded-2xl border-2 border-slate-200 shadow-md">
                <svg width="380" height="380" viewBox="0 0 400 400" className="overflow-visible">
                  {/* Ορισμός των SVG Grids για αυτόματη σχεδίαση των 100 υποδιαιρέσεων */}
                  <defs>
                    {/* Το εσωτερικό πλέγμα cm² (10x10 γραμμές μέσα σε κάθε dm²) */}
                    <pattern id="cmGrid" width="4" height="4" patternUnits="userSpaceOnUse">
                      <rect width="4" height="4" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
                    </pattern>
                  </defs>

                  {/* Σχεδίαση των 100 dm² (10x10) */}
                  {[...Array(100)].map((_, i) => {
                    const row = Math.floor(i / 10);
                    const col = i % 10;
                    const x = col * 40;
                    const y = row * 40;
                    
                    // Αν το τρέχον κουτάκι είναι μικρότερο ή ίσο με την επιλογή του slider, ανάβει
                    const isActive = i < squareDecimeters;

                    return (
                      <g key={i}>
                        {/* Το υπόβαθρο dm² */}
                        <rect
                          x={x}
                          y={y}
                          width="40"
                          height="40"
                          fill={isActive ? "rgba(37, 99, 235, 0.15)" : "none"}
                          stroke={isActive ? "#2563eb" : "#cbd5e1"}
                          strokeWidth={isActive ? "2" : "1"}
                          className="transition-all duration-200"
                        />

                        {/* Σχεδίαση των 100 cm² (υποδιαίρεση) μέσα στο dm² */}
                        <rect
                          x={x}
                          y={y}
                          width="40"
                          height="40"
                          fill="url(#cmGrid)"
                          pointerEvents="none"
                        />

                        {/* Δείκτης 1dm² στο πρώτο κουτάκι */}
                        {i === 0 && (
                          <text x="5" y="15" fill="#1e3a8a" fontSize="7" fontWeight="bold" pointerEvents="none">
                            1 dm²
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Επεξηγηματικά Zoom Blocks */}
              <div className="w-full grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-gray-100">
                <div className="bg-blue-50/60 border border-blue-100 p-3 rounded-xl text-center">
                  <span className="text-[10px] font-black text-blue-700 block uppercase mb-1">📐 100 τ. δεκατόμετρα (dm²)</span>
                  <p className="text-[11px] text-slate-600 font-medium">
                    Το m² χωρίζεται στα 100 μεγάλα τετράγωνα. Σύρε το slider για να τα γεμίσεις!
                  </p>
                </div>
                <div className="bg-amber-50/60 border border-amber-100 p-3 rounded-xl text-center">
                  <span className="text-[10px] font-black text-amber-700 block uppercase mb-1">🔍 10.000 τ. εκατοστά (cm²)</span>
                  <p className="text-[11px] text-slate-600 font-medium">
                    Δες τις αχνές γραμμές! Κάθε μεγάλο κουτάκι έχει 100 μικροσκοπικά τετραγωνάκια στο εσωτερικό του.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Διαδραστική Γεωμετρία Εμβαδού.</p>
      </footer>
    </div>
  );
}
