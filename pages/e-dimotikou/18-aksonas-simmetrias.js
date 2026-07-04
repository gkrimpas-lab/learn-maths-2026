// pages/e-dimotikou/18-aksonas-simmetrias.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function AksonasSimmetriasPage() {
  // Το ποσοστό διπλώματος του σχήματος (από 0% έως 100%)
  const [foldProgress, setFoldProgress] = useState(0);

  // Ο άξονας συμμετρίας βρίσκεται στο κέντρο του Χ (300 στο viewBox 600x340)
  const cx = 300;

  // Υπολογισμός του scale για το αριστερό κομμάτι που διπλώνει
  // Στο 0% το scaleX είναι 1 (κανονικό). Στο 100% γίνεται -1 (έχει διπλώσει πλήρως πάνω στο δεξί)
  const scaleX = 1 - (foldProgress / 100) * 2;

  // Έλεγχος αν ολοκληρώθηκε το δίπλωμα
  const isFolded = foldProgress === 100;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🦋 Άξονας Συμμετρίας - LearnMaths.gr</title>
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
              📖 Θεωρία: Ο Άξονας Συμμετρίας
            </h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              Πολλά σχήματα γύρω μας στη φύση και τη γεωμετρία είναι απόλυτα ισορροπημένα.
            </p>
            <div className="bg-blue-50 text-slate-900 p-5 rounded-2xl border border-blue-100 space-y-2 text-sm md:text-base">
              <p>
                🦋 <strong>Τι είναι ο Άξονας Συμμετρίας;</strong>
              </p>
              <p className="text-slate-700 leading-relaxed font-medium">
                <strong>Άξονας συμμετρίας</strong> είναι μια νοητή ευθεία γραμμή που χωρίζει ένα σχήμα σε δύο μισά, έτσι ώστε αν <strong>διπλώσουμε</strong> το σχήμα πάνω σε αυτή τη γραμμή, τα δύο μέρη του να <strong>συμπέσουν ακριβώς</strong> το ένα πάνω στο άλλο. 
              </p>
              <p className="text-xs font-bold text-blue-800 pt-1">
                🌸 Παραδείγματα: Τα φτερά μιας πεταλούδας, ένα φύλλο δέντρου, το γράμμα Α ή μια καρδιά έχουν άξονα συμμετρίας!
              </p>
            </div>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[520px] w-full">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  🕹️ Δίπλωσε το Σχήμα
                </h3>
                <p className="text-gray-500 text-sm">
                  Σύρε τον δρομέα προς τα δεξιά για να δείξεις πώς το αριστερό μισό διπλώνει πάνω στο δεξί κατά μήκος του άξονα.
                </p>
              </div>

              {/* Slider Διπλώματος */}
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl w-full space-y-6 shadow-inner my-auto">
                <div className="flex items-center justify-between px-2">
                  <span className="font-bold text-slate-700 text-sm md:text-base">Πρόοδος Διπλώματος:</span>
                  <span className={`text-3xl md:text-4xl font-black tabular-nums ${isFolded ? 'text-emerald-600' : 'text-slate-800'}`}>
                    {foldProgress}%
                  </span>
                </div>

                <div className="px-2">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={foldProgress} 
                    onChange={(e) => setFoldProgress(parseInt(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[11px] font-bold text-gray-400 pt-2 tracking-wide">
                    <span>📖 Ανοιχτό (0%)</span>
                    <span className={isFolded ? 'text-emerald-600 font-black' : ''}>📕 Κλειστό (100%)</span>
                  </div>
                </div>

                {/* Γρήγορα κουμπιά ελέγχου */}
                <div className="flex justify-center gap-3 pt-2">
                  <button 
                    onClick={() => setFoldProgress(0)}
                    className="p-2 px-4 rounded-xl font-bold text-xs bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm"
                  >
                    🔄 Άνοιγμα
                  </button>
                  <button 
                    onClick={() => setFoldProgress(100)}
                    className={`p-2 px-4 rounded-xl font-black text-xs transition shadow-sm ${isFolded ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                  >
                    🎯 Τέλειο Δίπλωμα
                  </button>
                </div>
              </div>

              {/* ΚΑΤΑΣΤΑΣΗ ΣΥΜΜΕΤΡΙΑΣ */}
              <div className={`p-6 md:p-8 rounded-2xl border transition-all duration-300 w-full text-center ${isFolded ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">ΕΛΕΓΧΟΣ ΣΥΜΜΕΤΡΙΑΣ:</span>
                <div className={`text-xl md:text-2xl font-black ${isFolded ? 'text-emerald-600 animate-bounce' : 'text-slate-700'}`}>
                  {isFolded ? '🏆 Τα δύο μέρη συμπίπτουν απόλυτα!' : '👀 Δίπλωσε το σχήμα για να ελέγξεις'}
                </div>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  {isFolded 
                    ? 'Η κόκκινη διακεκομμένη γραμμή είναι ένας έγκυρος Άξονας Συμμετρίας.' 
                    : 'Καθώς διπλώνει, βλέπουμε την αντανάκλαση να πλησιάζει το άλλο μισό.'
                  }
                </p>
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: SVG ΟΠΤΙΚΟΠΟΙΗΣΗ ΜΕ ΔΥΝΑΜΙΚΟ FOLDING */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-between min-h-[520px] w-full relative overflow-hidden">
              <div className="w-full"></div>

              {/* SVG Καμβάς 600x340 */}
              <svg 
                viewBox="0 0 600 340" 
                className="w-full h-auto drop-shadow-sm my-auto px-2"
                style={{ willChange: 'transform', transform: 'translateZ(0)' }}
              >
                
                {/* 1. ΣΤΑΘΕΡΟ ΔΕΞΙ ΜΙΣΟ ΤΟΥ ΣΧΗΜΑΤΟΣ (Μια όμορφη γεωμετρική καρδιά/σχήμα) */}
                <path 
                  d="M 300 70 C 360 10 440 40 440 120 C 440 200 360 250 300 290" 
                  className="fill-rose-500/10 stroke-rose-400 stroke-[4]" 
                />

                {/* 2. ΔΥΝΑΜΙΚΟ ΑΡΙΣΤΕΡΟ ΜΙΣΟ ΠΟΥ ΔΙΠΛΩΝΕΙ */}
                {/* Χρησιμοποιούμε svg transform group με matrix scaleX για να προσομοιώσουμε το 3D flip */}
                <g transform={`translate(${cx}, 0) scale(${scaleX}, 1) translate(${-cx}, 0)`}>
                  <path 
                    d="M 300 70 C 240 10 160 40 160 120 C 160 200 240 250 300 290" 
                    className={`stroke-[4] ${isFolded ? 'fill-emerald-500/20 stroke-emerald-500 opacity-60' : 'fill-rose-500/20 stroke-rose-500'}`}
                  />
                </g>

                {/* 🔴 Ο ΑΞΟΝΑΣ ΣΥΜΜΕΤΡΙΑΣ (Κάθετη διακεκομμένη γραμμή ακριβώς στη μέση) */}
                <line 
                  x1={cx} y1="30" x2={cx} y2="320" 
                  className="stroke-red-500 stroke-[3] stroke-dasharray-[6,4]" 
                />

                {/* Ετικέτα κειμένου για τον Άξονα */}
                <text x={cx} y="25" className="text-[10px] font-black fill-red-600 text-anchor-middle uppercase tracking-wider">
                  Άξονας Συμμετρίας
                </text>
              </svg>

              {/* Ετικέτα στο κάτω μέρος του καμβά */}
              <div className="w-full flex justify-center text-xs md:text-sm font-bold text-slate-400 pt-4 border-t border-gray-50 mt-auto">
                <span>{isFolded ? '🟢 Επιτυχία! Το σχήμα είναι απόλυτα συμμετρικό.' : '🦋 Παρατήρησε τη γραμμή που χωρίζει το σχήμα ακριβώς στη μέση.'}</span>
              </div>
            </div>

          </div>

        </main>
      </div>

      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Διαδραστική Γεωμετρία Συμμετρίας.</p>
      </footer>
    </div>
  );
}
