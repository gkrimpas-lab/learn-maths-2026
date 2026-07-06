import React, { useState } from 'react';

export default function EmbadoSximaton() {
  const [shape, setShape] = useState('square');
  const [width, setWidth] = useState(5);
  const [height, setHeight] = useState(5);

  const unitSize = 40; // Μέγεθος κάθε τετραγώνου σε pixels
  const maxUnits = 10; // Το μέγιστο όριο στα sliders

  const w = parseInt(width);
  // Αν είναι τετράγωνο, το ύψος ακολουθεί αναγκαστικά τη βάση/πλευρά
  const h = shape === 'square' ? w : parseInt(height);

  // Σταθερές διαστάσεις πλαισίου (12 x 12 κουτάκια για να χωράει άνετα το 10x10 σχήμα με περιθώριο)
  const canvasGridSize = (maxUnits + 2) * unitSize; 

  // Δυναμικός υπολογισμός των στυλ για το σχήμα
  const getShapeStyle = () => {
    const baseStyle = {
      position: 'absolute',
      // Το σχήμα ξεκινάει πάντα από το ίδιο σταθερό σημείο (offset 1 κουτάκι από πάνω αριστερά)
      left: `${unitSize}px`,
      top: `${unitSize}px`,
      width: `${w * unitSize}px`,
      height: `${h * unitSize}px`,
      transition: 'all 0.3s ease',
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
        backgroundColor: 'rgba(14, 165, 233, 0.25)',
        border: '3px solid rgb(14, 165, 233)',
        // Δημιουργεί το ορθογώνιο τρίγωνο (κόβει το νοητό ορθογώνιο στη διαγώνιο)
        clipPath: 'polygon(0 100%, 100% 100%, 0 0)',
      };
    }
    return baseStyle;
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen font-sans text-slate-800 p-6 lg:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Τίτλος */}
        <header className="text-center mb-10">
          <h1 className="text-4xl lg:text-5xl font-bold text-indigo-600 mb-2">
            Ανακαλύπτω το Εμβαδόν! 📐
          </h1>
          <p className="text-lg lg:text-xl text-slate-600">
            Δες πώς μετράμε την επιφάνεια στα σχήματα
          </p>
        </header>

        {/* Κύριο Πλέγμα Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Αριστερό Μενού: Επιλογές & Sliders */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 lg:col-span-1">
            <h2 className="text-xl font-bold mb-4 text-slate-700">1. Διάλεξε Σχήμα:</h2>
            <div className="flex flex-col gap-3 mb-6">
              <button
                onClick={() => setShape('square')}
                className={`px-4 py-3 rounded-xl font-semibold text-left transition ${
                  shape === 'square'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-100 hover:bg-slate-200'
                }`}
              >
                🟩 Τετράγωνο
              </button>
              <button
                onClick={() => setShape('rectangle')}
                className={`px-4 py-3 rounded-xl font-semibold text-left transition ${
                  shape === 'rectangle'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-100 hover:bg-slate-200'
                }`}
              >
                🟧 Ορθογώνιο
              </button>
              <button
                onClick={() => setShape('triangle')}
                className={`px-4 py-3 rounded-xl font-semibold text-left transition ${
                  shape === 'triangle'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-100 hover:bg-slate-200'
                }`}
              >
                📐 Ορθογώνιο Τρίγωνο
              </button>
            </div>

            <hr className="my-6 border-slate-200" />

            <h2 className="text-xl font-bold mb-4 text-slate-700">2. Άλλαξε τις Διαστάσεις:</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  {shape === 'square' ? `Πλευρά: ${w} κουτάκια` : `Βάση (Μήκος): ${w} κουτάκια`}
                </label>
                <input
                  type="range"
                  min="2"
                  max={maxUnits}
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {shape !== 'square' && (
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Ύψος (Πλάτος): {h} κουτάκια
                  </label>
                  <input
                    type="range"
                    min="2"
                    max={maxUnits}
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Δεξί Μέρος: Οπτικοποίηση & Παιδαγωγική Επεξήγηση */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Ο Καμβάς με το ΣΤΑΘΕΡΟ Πλέγμα */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 flex justify-center items-center min-h-[520px] relative overflow-hidden">
              <div
                className="border-2 border-slate-300 relative bg-slate-50/50"
                style={{
                  width: `${canvasGridSize}px`,
                  height: `${canvasGridSize}px`,
                  backgroundImage:
                    'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)',
                  backgroundSize: `${unitSize}px ${unitSize}px`,
                }}
              >
                {/* Το δυναμικό γεωμετρικό σχήμα που αλλάζει μέγεθος μέσα στο σταθερό πλέγμα */}
                <div style={getShapeStyle()} />
              </div>
            </div>

            {/* Επεξήγηση και Μαθηματικός Τύπος */}
            <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl">
              {shape === 'square' && (
                <>
                  <h3 className="text-2xl font-bold text-indigo-950 mb-3">🟩 Τετράγωνο</h3>
                  <p className="text-lg text-indigo-900 leading-relaxed">
                    Όλες οι πλευρές είναι ίσες! Πολλαπλασιάζουμε την πλευρά με τον εαυτό της για να βρούμε πόσα κουτάκια χωράνε μέσα.
                    <br />
                    <strong>Εμβαδόν = Πλευρά × Πλευρά</strong>
                  </p>
                  <div className="mt-4 p-4 bg-white rounded-xl border border-indigo-200 inline-block">
                    <span className="text-xl font-mono font-bold text-indigo-600">
                      {w} × {w} = {w * w} τετραγωνικά κουτάκια
                    </span>
                  </div>
                </>
              )}

              {shape === 'rectangle' && (
                <>
                  <h3 className="text-2xl font-bold text-indigo-950 mb-3">🟧 Ορθογώνιο</h3>
                  <p className="text-lg text-indigo-900 leading-relaxed">
                    Έχει βάση (μήκος) και ύψος (πλάτος). Πολλαπλασιάζουμε τη βάση επί το ύψος για να γεμίσει η επιφάνεια!
                    <br />
                    <strong>Εμβαδόν = Βάση × Ύψος</strong>
                  </p>
                  <div className="mt-4 p-4 bg-white rounded-xl border border-indigo-200 inline-block">
                    <span className="text-xl font-mono font-bold text-indigo-600">
                      {w} × {h} = {w * h} τετραγωνικά κουτάκια
                    </span>
                  </div>
                </>
              )}

              {shape === 'triangle' && (
                <>
                  <h3 className="text-2xl font-bold text-indigo-950 mb-3">📐 Ορθογώνιο Τρίγωνο</h3>
                  <p className="text-lg text-indigo-900 leading-relaxed">
                    Παρατήρησε ότι το τρίγωνο είναι <strong>ακριβώς το μισό</strong> ενός ορθογωνίου με τις ίδιες διαστάσεις! 
                    Γι' αυτό υπολογίζουμε πρώτα το ολόκληρο ορθογώνιο και μετά το διαιρούμε με το 2.
                    <br />
                    <strong>Εμβαδόν = (Βάση × Ύψος) ÷ 2</strong>
                  </p>
                  <div className="mt-4 p-4 bg-white rounded-xl border border-indigo-200 inline-block">
                    <span className="text-xl font-mono font-bold text-indigo-600">
                      ({w} × {h}) ÷ 2 = {w * h} ÷ 2 = {(w * h) / 2} τετραγωνικά κουτάκια
                    </span>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
