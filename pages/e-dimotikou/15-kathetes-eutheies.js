// pages/e-dimotikou/15-kathetes-eutheies.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function KathetesEutheiesPage() {
  // Η γωνία τομής των δύο ευθειών (από 10° έως 170°)
  const [angle, setAngle] = useState(45);

  // Έλεγχος αν οι ευθείες είναι κάθετες (με μια μικρή ανοχή αν ο χρήστης πλησιάσει, αλλά το slider θα έχει snap ή κουμπί για το 90)
  const isKathetes = angle === 90;

  // --- ΜΑΘΗΜΑΤΙΚΟΣ ΥΠΟΛΟΓΙΣΜΟΣ ΣΥΝΤΕΤΑΓΜΕΝΩΝ SVG ---
  // Κέντρο τομής των δύο ευθειών (στο ευρύ viewBox 600x340)
  const cx = 300;
  const cy = 170;
  const lineLength = 140; // Μήκος κάθε ακτίνας ευθείας από το κέντρο

  // Ευθεία 1 (Σταθερή Οριζόντια Ευθεία ε1)
  const e1x1 = cx - lineLength;
  const e1y1 = cy;
  const e1x2 = cx + lineLength;
  const e1y2 = cy;

  // Ευθεία 2 (Κινούμενη Ευθεία ε2 βάσει της γωνίας)
  const rad = (angle * Math.PI) / 180;
  const e2x1 = Math.round(cx + lineLength * Math.cos(rad));
  const e2y1 = Math.round(cy - lineLength * Math.sin(rad));
  const e2x2 = Math.round(cx - lineLength * Math.cos(rad));
  const e2y2 = Math.round(cy + lineLength * Math.sin(rad));

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>📐 Κάθετες Ευθείες - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* NAVBAR */}
        <nav className="bg-white shadow-md w-full">
          <div className={`${LAYOUT.CONTAINER} py-4 flex justify-between items-center`}>
            <Link href="/e-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight">
              LearnMaths<span className="text-indigo-600">.gr</span>
            </Link>
            <Link href="/e-dimotikou" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-sm">
              🔙 Επιστροφή
            </Link>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-12 space-y-12`}>
          
          {/* SECTION 1: ΘΕΩΡΙΑ */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              📖 Θεωρία: Τεμνόμενες & Κάθετες Ευθείες
            </h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              Όταν δύο ευθείες στο ίδιο επίπεδο συναντιούνται σε ένα σημείο, ονομάζονται <strong>τεμνόμενες</strong>. 
            </p>
            <div className="bg-emerald-50 text-emerald-900 p-5 rounded-2xl border border-emerald-100 space-y-2 text-sm md:text-base">
              <p>
                📐 <strong>Τι είναι οι Κάθετες Ευθείες;</strong>
              </p>
              <p className="text-slate-700 leading-relaxed font-medium">
                Αν δύο τεμνόμενες ευθείες σχηματίζουν <strong className="text-emerald-700">ορθή γωνία (ακριβώς 90°)</strong>, τότε ονομάζονται <strong>κάθετες ευθείες</strong>. Όταν δύο ευθείες είναι κάθετες, σχηματίζουν γύρω από το σημείο τομής τους <strong className="text-emerald-700">4 ορθές γωνίες</strong>!
              </p>
              <p className="text-xs font-bold text-emerald-800 pt-1">
                📝 Σύμβολο: Αν η ευθεία ε1 είναι κάθετη στην ε2, το γράφουμε έτσι: ε1 ⊥ ε2
              </p>
            </div>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[520px] w-full">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  🕹️ Περίστρεψε την Ευθεία
                </h3>
                <p className="text-gray-500 text-sm">
                  Σύρε τον δρομέα για να αλλάξεις τη γωνία τομής. Προσπάθησε να τις φέρεις ακριβώς στις 90°!
                </p>
              </div>

              {/* Slider και Κουμπί Snap στο 90 */}
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl w-full space-y-6 shadow-inner my-auto">
                <div className="flex items-center justify-between px-2">
                  <span className="font-bold text-slate-700 text-sm md:text-base">Γωνία Τομής:</span>
                  <div className="flex items-center gap-3">
                    <span className={`text-3xl md:text-4xl font-black tabular-nums ${isKathetes ? 'text-emerald-600 scale-105 transition-transform' : 'text-slate-800'}`}>
                      {angle}°
                    </span>
                  </div>
                </div>

                <div className="px-2">
                  <input 
                    type="range" 
                    min="10" 
                    max="170" 
                    value={angle} 
                    onChange={(e) => setAngle(parseInt(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[11px] font-bold text-gray-400 pt-2 tracking-wide">
                    <span>10° (Οξεία γωνία)</span>
                    <span className="text-emerald-600 font-black">90° (Κάθετες)</span>
                    <span>170° (Αμβλεία γωνία)</span>
                  </div>
                </div>

                {/* Γρήγορο κουμπί για αυτόματη κάθετη θέση */}
                <div className="flex justify-center pt-2">
                  <button 
                    onClick={() => setAngle(90)}
                    className={`p-2.5 px-6 rounded-xl font-black text-xs transition shadow-sm ${isKathetes ? 'bg-emerald-600 text-white cursor-default' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                  >
                    🎯 Ευθυγράμμιση στις 90° (Κάθετες)
                  </button>
                </div>
              </div>

              {/* ΚΑΤΑΣΤΑΣΗ ΕΥΘΕΙΩΝ */}
              <div className={`p-6 md:p-8 rounded-2xl border transition-all duration-300 w-full text-center ${isKathetes ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">ΣΧΕΣΗ ΜΕΤΑΞΥ ΕΥΘΕΙΩΝ:</span>
                <div className={`text-2xl md:text-3xl font-black ${isKathetes ? 'text-emerald-600 animate-bounce' : 'text-slate-700'}`}>
                  {isKathetes ? '❌ Οι ευθείες είναι ΚΑΘΕΤΕΣ! (ε1 ⊥ ε2)' : '✂️ Οι ευθείες είναι ΤΕΜΝΟΜΕΝΕΣ'}
                </div>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  {isKathetes 
                    ? 'Σχηματίζουν ακριβώς 4 ορθές γωνίες των 90 μοιρών.' 
                    : `Σχηματίζουν δύο οξείες γωνίες ${angle}° και δύο αμβλείες ${180 - angle}°.`
                  }
                </p>
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: SVG ΟΠΤΙΚΟΠΟΙΗΣΗ */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-between min-h-[520px] w-full relative overflow-hidden">
              <div className="w-full"></div>

              {/* Ευρύς καμβάς SVG 600x340 με GPU Acceleration */}
              <svg 
                viewBox="0 0 600 340" 
                className="w-full h-auto drop-shadow-sm my-auto px-2"
                style={{ willChange: 'transform', transform: 'translateZ(0)' }}
              >
                
                {/* 🟥 Σχεδίαση των 4 Ορθών Γωνιών (Τετραγωνάκια) μόνο όταν είναι ακριβώς 90 μοίρες */}
                {isKathetes && (
                  <g className="stroke-emerald-500 stroke-2 fill-emerald-500/10 opacity-90">
                    {/* Πάνω Δεξιά */}
                    <rect x={cx} y={cy - 20} width="20" height="20" />
                    {/* Πάνω Αριστερά */}
                    <rect x={cx - 20} y={cy - 20} width="20" height="20" />
                    {/* Κάτω Αριστερά */}
                    <rect x={cx - 20} y={cy} width="20" height="20" />
                    {/* Κάτω Δεξιά */}
                    <rect x={cx} y={cy} width="20" height="20" />
                  </g>
                )}

                {/* Ευθεία 1 (ε1) - Σταθερή Οριζόντια */}
                <line 
                  x1={e1x1} y1={e1y1} x2={e1x2} y2={e1y2} 
                  className={`stroke-[5] stroke-linecap-round transition-colors duration-200 ${isKathetes ? 'stroke-emerald-600' : 'stroke-slate-800'}`} 
                />
                <text x={e1x2 + 15} y={e1y2 + 5} className={`text-xs font-black ${isKathetes ? 'fill-emerald-700' : 'fill-slate-700'}`}>ε1</text>

                {/* Ευθεία 2 (ε2) - Κινούμενη */}
                <line 
                  x1={e2x1} y1={e2y1} x2={e2x2} y2={e2y2} 
                  className={`stroke-[5] stroke-linecap-round transition-colors duration-200 ${isKathetes ? 'stroke-emerald-600' : 'stroke-blue-500'}`} 
                />
                <text x={e2x1 + 10} y={e2y1 - 10} className={`text-xs font-black ${isKathetes ? 'fill-emerald-700' : 'fill-blue-600'}`}>ε2</text>

                {/* Σημείο Τομής (Τελεία στο κέντρο) */}
                <circle cx={cx} cy={cy} r={6} className={isKathetes ? 'fill-emerald-800' : 'fill-slate-800'} />
                
                {/* Ετικέτα Μοιρών πάνω στο σχήμα (κοντά στο κέντρο) όταν δεν είναι κάθετες */}
                {!isKathetes && (
                  <g>
                    <text x={cx + 25} y={cy - 15} className="text-[11px] font-black fill-slate-500">{angle}°</text>
                    <text x={cx - 45} y={cy - 15} className="text-[11px] font-black fill-slate-400">{180 - angle}°</text>
                  </g>
                )}
              </svg>

              {/* Ετικέτα στο κάτω μέρος του καμβά */}
              <div className="w-full flex justify-center text-xs md:text-sm font-bold text-slate-400 pt-4 border-t border-gray-50 mt-auto">
                <span>{isKathetes ? '🟢 Τέλειος σχηματισμός: 4 ορθές γωνίες των 90°' : '👀 Οι γωνίες αλλάζουν, αλλά δεν είναι ακόμα 90°'}</span>
              </div>
            </div>

          </div>

        </main>
      </div>

      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Διαδραστική Γεωμετρία Ευθειών.</p>
      </footer>
    </div>
  );
}
