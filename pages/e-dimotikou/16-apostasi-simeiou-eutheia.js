// pages/e-dimotikou/16-apostasi-simeiou-eutheia.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function ApostasiSimeiouEutheiaPage() {
  // Η οριζόντια μετατόπιση του σημείου Μ πάνω στην ευθεία (από -150 έως +150 pixel από το κέντρο)
  // Αρχική τιμή -70 για να μην ξεκινάει έτοιμο στην απόσταση
  const [offsetX, setOffsetX] = useState(-70);

  // Σταθερές συντεταγμένες για το σημείο Α (κεντραρισμένο ψηλά στο viewBox 600x340)
  const ax = 300;
  const ay = 100;

  // Σταθερό y για την οριζόντια ευθεία ε
  const ey = 260;

  // Το σημείο Μ κινείται οριζόντια πάνω στην ευθεία (y = ey)
  const mx = 300 + offsetX;
  const my = ey;

  // Υπολογισμός της κάθετης απόστασης (σταθερή στα 160 pixels)
  const verticalDistancePx = ey - ay; // 160
  // Μετατροπή σε "εκπαιδευτικά εκατοστά" (π.χ. διαίρεση με 20 για όμορφο νούμερο)
  const realDistanceCm = (verticalDistancePx / 20).toFixed(1);

  // Υπολογισμός του τρέχοντος μήκους ΑΜ (Ευκλείδεια απόσταση)
  const currentLengthPx = Math.sqrt((mx - ax) * (mx - ax) + (my - ay) * (my - ay));
  const currentLengthCm = (currentLengthPx / 20).toFixed(1);

  // Υπολογισμός της τρέχουσας γωνίας τομής του ΑΜ με την ευθεία
  const angleRad = Math.atan2(verticalDistancePx, Math.abs(mx - ax));
  const angleDeg = Math.round((angleRad * 180) / Math.PI);

  // Η απόσταση επιτυγχάνεται όταν το offsetX είναι ακριβώς 0 (κάθετο τμήμα)
  const isApostasi = offsetX === 0;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>📏 Απόσταση Σημείου από Ευθεία - LearnMaths.gr</title>
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
              📖 Θεωρία: Απόσταση Σημείου από Ευθεία
            </h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              Αν πάρουμε ένα σημείο <strong>Α</strong> εκτός μιας ευθείας, μπορούμε να σχεδιάσουμε αμέτρητα ευθύγραμμα τμήματα που να το ενώνουν με διάφορα σημεία της ευθείας.
            </p>
            <div className="bg-blue-50 text-slate-900 p-5 rounded-2xl border border-blue-100 space-y-2 text-sm md:text-base">
              <p>
                🎯 <strong>Ποιο τμήμα ονομάζουμε Απόσταση;</strong>
              </p>
              <p className="text-slate-700 leading-relaxed font-medium">
                <strong>Απόσταση</strong> του σημείου Α από την ευθεία ονομάζουμε το <strong className="text-blue-700">κάθετο ευθύγραμμο τμήμα</strong> που ξεκινά από το Α και καταλήγει στην ευθεία. Το κάθετο αυτό τμήμα είναι <strong className="text-blue-700">το πιο σύντομο (το μικρότερο σε μήκος)</strong> από όλα τα τμήματα που μπορούμε να σχεδιάσουμε!
              </p>
            </div>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[520px] w-full">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  🕹️ Σύρε το σημείο Μ
                </h3>
                <p className="text-gray-500 text-sm">
                  Κούνησε το σημείο Μ κατά μήκος της ευθείας και παρατήρησε πώς αλλάζει το μήκος του τμήματος ΑΜ.
                </p>
              </div>

              {/* Slider και Στατιστικά Μήκους */}
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl w-full space-y-6 shadow-inner my-auto">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white p-3 rounded-xl border shadow-sm">
                    <span className="text-[10px] font-black text-gray-400 block uppercase tracking-wide">ΜΗΚΟΣ ΑΜ</span>
                    <span className={`text-2xl font-black ${isApostasi ? 'text-emerald-600' : 'text-slate-800'}`}>
                      {currentLengthCm} cm
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border shadow-sm">
                    <span className="text-[10px] font-black text-gray-400 block uppercase tracking-wide">ΓΩΝΙΑ ΜΕ ΕΥΘΕΙΑ</span>
                    <span className={`text-2xl font-black ${isApostasi ? 'text-emerald-600' : 'text-slate-800'}`}>
                      {angleDeg}°
                    </span>
                  </div>
                </div>

                <div className="px-2">
                  <input 
                    type="range" 
                    min="-150" 
                    max="150" 
                    value={offsetX} 
                    onChange={(e) => setOffsetX(parseInt(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[11px] font-bold text-gray-400 pt-2 tracking-wide">
                    <span>⬅️ Αριστερά</span>
                    <span className="text-emerald-600 font-black">🎯 Κέντρο (Κάθετα)</span>
                    <span>Δεξιά ➡️</span>
                  </div>
                </div>

                {/* Κουμπί για αυτόματο Snap στην Απόσταση */}
                <div className="flex justify-center pt-2">
                  <button 
                    onClick={() => setOffsetX(0)}
                    className={`p-2.5 px-6 rounded-xl font-black text-xs transition shadow-sm ${isApostasi ? 'bg-emerald-600 text-white cursor-default' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                  >
                    📐 Βρες την Απόσταση (Κάθετο Τμήμα)
                  </button>
                </div>
              </div>

              {/* ΕΠΕΞΗΓΗΣΗ ΚΑΤΑΣΤΑΣΗΣ */}
              <div className={`p-6 md:p-8 rounded-2xl border transition-all duration-300 w-full text-center ${isApostasi ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">ΙΔΙΟΤΗΤΑ ΤΟΥ ΤΜΗΜΑΤΟΣ:</span>
                <div className={`text-2xl md:text-3xl font-black ${isApostasi ? 'text-emerald-600 animate-bounce' : 'text-slate-700'}`}>
                  {isKathetes ? '🏆 Αυτή είναι η ΑΠΟΣΤΑΣΗ!' : '🛤️ Πλάγιο Τμήμα'}
                </div>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  {isApostasi 
                    ? `Είναι το μικρότερο δυνατό τμήμα (${realDistanceCm} cm) και σχηματίζει ορθή γωνία.` 
                    : `Το μήκος (${currentLengthCm} cm) είναι μεγαλύτερο από την πραγματική απόσταση (${realDistanceCm} cm).`
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
                
                {/* 🟥 Σχεδίαση του Τετραγώνου της Ορθής Γωνίας μόνο όταν Μ είναι ακριβώς κάτω από το Α */}
                {isApostasi && (
                  <g className="stroke-emerald-500 stroke-2 fill-emerald-500/10">
                    {/* Τετραγωνάκι στην ορθή γωνία τομής */}
                    <rect x={ax} y={ey - 20} width="20" height="20" />
                  </g>
                )}

                {/* Αχνή διακεκομμένη γραμμή που δείχνει την ιδανική κάθετη τροχιά αν το Μ βρίσκεται αλλού */}
                {!isApostasi && (
                  <line 
                    x1={ax} y1={ay} x2={ax} y2={ey} 
                    className="stroke-slate-200 stroke-[2] stroke-dasharray-[4,4]" 
                  />
                )}

                {/* Η Σταθερή Οριζόντια Ευθεία (ε) στο κάτω μέρος */}
                <line 
                  x1="100" y1={ey} x2="500" y2={ey} 
                  className="stroke-slate-800 stroke-[4] stroke-linecap-round" 
                />
                <text x="515" y={ey + 5} className="text-xs font-black fill-slate-700">ευθεία (ε)</text>

                {/* Το Ευθύγραμμο Τμήμα ΑΜ που ενώνει το σημείο με την ευθεία */}
                <line 
                  x1={ax} y1={ay} x2={mx} y2={my} 
                  className={`stroke-[4] stroke-linecap-round ${isApostasi ? 'stroke-emerald-600' : 'stroke-blue-500'}`} 
                />

                {/* Σημείο Α (Σταθερό ψηλά) */}
                <circle cx={ax} cy={ay} r={6} className="fill-slate-800" />
                <text x={ax} y={ay - 15} className="text-sm font-black fill-slate-800 text-anchor-middle">Σημείο Α</text>

                {/* Σημείο Μ (Κινούμενο πάνω στην ευθεία) */}
                <circle cx={mx} cy={my} r={6} className={isApostasi ? 'fill-emerald-600' : 'fill-blue-600'} />
                <text x={mx} y={my + 22} className={`text-xs font-black text-anchor-middle ${isApostasi ? 'fill-emerald-700' : 'fill-blue-600'}`}>Μ</text>

                {/* Ένδειξη τρέχοντος μήκους πάνω στη γραμμή ΑΜ */}
                <g transform={`translate(${(ax + mx) / 2}, ${(ay + my) / 2 - 10})`}>
                  <rect x="-30" y="-12" width="60" height="18" rx="4" className="fill-white shadow-sm stroke-gray-100 stroke animate-fade-in" />
                  <text x="0" y="2" className={`text-[10px] font-black text-anchor-middle ${isApostasi ? 'fill-emerald-700' : 'fill-blue-600'}`}>
                    {currentLengthCm} cm
                  </text>
                </g>

              </svg>

              {/* Ετικέτα στο κάτω μέρος του καμβά */}
              <div className="w-full flex justify-center text-xs md:text-sm font-bold text-slate-400 pt-4 border-t border-gray-50 mt-auto">
                <span>{isApostasi ? '🟢 Απόσταση = Κάθετο τμήμα = Το μικρότερο δυνατό μήκος!' : '🔍 Δοκίμασε να πλησιάσεις στο κέντρο για να μικρύνει το μήκος.'}</span>
              </div>
            </div>

          </div>

        </main>
      </div>

      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Διαδραστική Γεωμετρία Αποστάσεων.</p>
      </footer>
    </div>
  );
}
