import React, { useState } from 'react';

export default function EmbadoSximaton() {
  const [shape, setShape] = useState('square');
  const [width, setWidth] = useState(5);
  const [height, setHeight] = useState(5);

  const unitSize = 40; 
  const maxUnits = 10; 

  const w = parseInt(width);
  const h = shape === 'square' ? w : parseInt(height);

  const canvasGridSize = (maxUnits + 2) * unitSize; 

  const getShapeStyle = () => {
    const baseStyle = {
      position: 'absolute',
      left: `${unitSize}px`,
      top: `${unitSize}px`,
      width: `${w * unitSize}px`,
      height: `${h * unitSize}px`,
      transition: 'all 0.3s ease',
      zIndex: 10,
    };

    if (shape === 'square') {
      return {
        ...baseStyle,
        backgroundColor: 'rgba(79, 70, 229, 0.25)',
        border: '3px solid rgb(79, 70, 229)',
        clipPath: 'none',
      };
    } else if (shape === 'rectangle') {
      return {
        ...baseStyle,
        backgroundColor: 'rgba(249, 115, 22, 0.25)',
        border: '3px solid rgb(249, 115, 22)',
        clipPath: 'none',
      };
    } else if (shape === 'triangle') {
      return {
        ...baseStyle,
        backgroundColor: 'rgba(14, 165, 233, 0.35)',
        border: '3px solid rgb(14, 165, 233)',
        clipPath: 'polygon(0 100%, 100% 100%, 0 0)',
      };
    }
    return baseStyle;
  };

  const getGhostRectangleStyle = () => {
    return {
      position: 'absolute',
      left: `${unitSize}px`,
      top: `${unitSize}px`,
      width: `${w * unitSize}px`,
      height: `${h * unitSize}px`,
      transition: 'all 0.3s ease',
      backgroundColor: 'rgba(203, 213, 225, 0.2)', 
      border: '2px dashed rgb(148, 163, 184)', 
      zIndex: 5,
    };
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen font-sans text-slate-800 flex flex-col justify-between">
      
      {/* 1. HEADER (Προσαρμοσμένο LearnMaths.gr) */}
      <nav className="w-full bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="text-2xl font-black tracking-tight">
          <span className="text-blue-600">LearnMaths</span>
          <span className="text-slate-400">.gr</span>
        </div>
        
        {/* Responsive, Fluid Κουμπί Επιστροφής */}
        <a 
          href="https://www.learnmaths.gr/e-dimotikou"
          className="inline-flex items-center justify-center transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded-xl"
          aria-label="Επιστροφή στην Ε Δημοτικού"
        >
          <svg 
            viewBox="0 0 160 50" 
            className="w-32 h-auto lg:w-40 xl:w-44 font-medium"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="100%" height="100%" rx="10" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2"/>
            <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="#475569" fontSize="14" fontWeight="600">
              « Επιστροφή
            </text>
          </svg>
        </a>
      </nav>

      {/* ΚΥΡΙΟ ΠΕΡΙΕΧΟΜΕΝΟ */}
      <main className="max-w-7xl w-full mx-auto p-6 lg:p-12 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Αριστερό Μενού: Επιλογές & Sliders */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-1">
            <h2 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
              <span>1.</span> Διάλεξε Σχήμα:
            </h2>
            <div className="flex flex-col gap-3 mb-6">
              <button
                onClick={() => setShape('square')}
                className={`px-4 py-3 rounded-xl font-semibold text-left transition ${
                  shape === 'square'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                🟩 Τετράγωνο
              </button>
              <button
                onClick={() => setShape('rectangle')}
                className={`px-4 py-3 rounded-xl font-semibold text-left transition ${
                  shape === 'rectangle'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                🟧 Ορθογώνιο
              </button>
              <button
                onClick={() => setShape('triangle')}
                className={`px-4 py-3 rounded-xl font-semibold text-left transition ${
                  shape === 'triangle'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                📐 Ορθογώνιο Τρίγωνο
              </button>
            </div>

            <hr className="my-6 border-slate-100" />

            <h2 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
              <span>2.</span> Άλλαξε τις Διαστάσεις:
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">
                  {shape === 'square' ? `Πλευρά: ${w} κουτάκια` : `Μήκος (Βάση): ${w} κουτάκια`}
                </label>
                <input
                  type="range"
                  min="2"
                  max={maxUnits}
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {shape !== 'square' && (
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">
                    Πλάτος (Ύψος): {h} κουτάκια
                  </label>
                  <input
                    type="range"
                    min="2"
                    max={maxUnits}
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Δεξί Μέρος: Οπτικοποίηση & Παιδαγωγική Επεξήγηση */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Ο Καμβάς με το Σταθερό Πλέγμα */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex justify-center items-center min-h-[520px] relative overflow-hidden">
              <div
                className="border-2 border-slate-200 relative bg-slate-50/30 rounded-sm"
                style={{
                  width: `${canvasGridSize}px`,
                  height: `${canvasGridSize}px`,
                  backgroundImage:
                    'linear-gradient(to right, #f1f5f9 1px, transparent 1px), linear-gradient(to bottom, #f1f5f9 1px, transparent 1px)',
                  backgroundSize: `${unitSize}px ${unitSize}px`,
                }}
              >
                {shape === 'triangle' && <div style={getGhostRectangleStyle()} />}
                <div style={getShapeStyle()} />
              </div>
            </div>

            {/* Επεξήγηση και Μαθηματικός Τύπος */}
            <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-2xl shadow-sm">
              {shape === 'square' && (
                <>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">🟩 Τετράγωνο</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Όλες οι πλευρές είναι ίσες! Πολλαπλασιάζουμε την πλευρά με τον εαυτό της για να βρούμε πόσα κουτάκια χωράνε μέσα.
                    <br />
                    <strong>Εμβαδόν = Πλευρά × Πλευρά</strong>
                  </p>
                  <div className="mt-4 p-3 bg-white rounded-xl border border-blue-100 inline-block">
                    <span className="text-lg font-mono font-bold text-blue-600">
                      {w} × {w} = {w * w} τετραγωνικά κουτάκια
                    </span>
                  </div>
                </>
              )}

              {shape === 'rectangle' && (
                <>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">🟧 Ορθογώνιο</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Έχει μήκος (βάση) και πλάτος (ύψος). Πολλαπλασιάζουμε το μήκος επί το πλάτος για να γεμίσει η επιφάνεια!
                    <br />
                    <strong>Εμβαδόν = Μήκος × Πλάτος</strong>
                  </p>
                  <div className="mt-4 p-3 bg-white rounded-xl border border-blue-100 inline-block">
                    <span className="text-lg font-mono font-bold text-blue-600">
                      {w} × {h} = {w * h} τετραγωνικά κουτάκια
                    </span>
                  </div>
                </>
              )}

              {shape === 'triangle' && (
                <>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">📐 Ορθογώνιο Τρίγωνο</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Κοίταξε το πλέγμα! Το χρωματιστό τρίγωνο μαζί με το αχνό γκρίζο κομμάτι σχηματίζουν ένα ολόκληρο ορθογώνιο. 
                    Το τρίγωνο είναι <strong>ακριβώς το μισό</strong> του! Γι' αυτό υπολογίζουμε το ορθογώνιο (Μήκος × Πλάτος) και μετά το χωρίζουμε στα 2.
                    <br />
                    <strong>Εμβαδόν = (Μήκος × Πλάτος) ÷ 2</strong>
                  </p>
                  <div className="mt-4 p-3 bg-white rounded-xl border border-blue-100 inline-block">
                    <span className="text-lg font-mono font-bold text-blue-600">
                      ({w} × {h}) ÷ 2 = {w * h} ÷ 2 = {(w * h) / 2} τετραγωνικά κουτάκια
                    </span>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </main>

      {/* 3. FOOTER (Προσαρμοσμένο LearnMaths.gr) */}
      <footer className="w-full bg-[#1e293b] py-4 text-center border-t border-slate-800">
        <p className="text-xs text-slate-400 font-light tracking-wide">
          © 2026 LearnMaths.gr. Διαδραστική Γεωμετρία Εμβαδού.
        </p>
      </footer>
    </div>
  );
}
