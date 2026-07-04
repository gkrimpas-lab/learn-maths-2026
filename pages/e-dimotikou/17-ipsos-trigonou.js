// pages/e-dimotikou/17-ipsos-trigonou.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function IpsosTrigonouPage() {
  // Η οριζόντια θέση της πάνω κορυφής Α (από 100 έως 500 pixel στον άξονα Χ)
  // Αρχική τιμή 300 (ακριβώς στο κέντρο, ισοσκελές/οξυγώνιο τρίγωνο)
  const [posX, setPosX] = useState(300);

  // --- ΣΤΑΘΕΡΕΣ ΔΙΑΣΤΑΣΕΙΣ ΤΡΙΓΩΝΟΥ ---
  const bx = 220; // Σημείο Β (κάτω αριστερά)
  const by = 260;
  const gx = 380; // Σημείο Γ (κάτω δεξιά)
  const gy = 260;
  
  // Σταθερό ύψος (κάθετη απόσταση από τη βάση): 140 pixels
  const ay = 120; 
  const ipsosHeightPx = by - ay; // 140
  const ipsosHeightCm = (ipsosHeightPx / 20).toFixed(0); // Εκπαιδευτικά εκατοστά (7 cm)

  // Η τρέχουσα οριζόντια θέση της κορυφής Α
  const ax = posX;

  // Υπολογισμός της θέσης του ύψους σε σχέση με τη βάση ΒΓ
  const getIpsosPosition = () => {
    if (ax < bx) return 'Εξωτερικό (Αριστερά από το Β, πάνω στην προέκταση)';
    if (ax === bx) return 'Συμπίπτει με την πλευρά ΑΒ (Ορθή γωνία στο Β)';
    if (ax > bx && ax < gx) return 'Εσωτερικό (Πέφτει ανάμεσα στα σημεία Β και Γ)';
    if (ax === gx) return 'Συμπίπτει με την πλευρά ΑΓ (Ορθή γωνία στο Γ)';
    return 'Εξωτερικό (Δεξιά από το Γ, πάνω στην προέκταση)';
  };

  // Κατηγοριοποίηση του τριγώνου με βάση τη θέση της κορυφής Α
  const getTriangleCategory = () => {
    if (ax === bx || ax === gx) return { title: 'Ορθογώνιο Τρίγωνο', color: 'text-emerald-600', bg: 'bg-emerald-50/50 border-emerald-200' };
    if (ax < bx || ax > gx) return { title: 'Αμβλυγώνιο Τρίγωνο', color: 'text-purple-600', bg: 'bg-purple-50/50 border-purple-200' };
    return { title: 'Οξυγώνιο Τρίγωνο', color: 'text-blue-600', bg: 'bg-blue-50/50 border-blue-200' };
  };

  const triCategory = getTriangleCategory();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🔺 Ύψος Τριγώνου - LearnMaths.gr</title>
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
              📖 Θεωρία: Το Ύψος του Τριγώνου
            </h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              Κάθε τρίγωνο έχει τρία ύψη, ένα για κάθε κορυφή του. 
            </p>
            <div className="bg-blue-50 text-slate-900 p-5 rounded-2xl border border-blue-100 space-y-2 text-sm md:text-base">
              <p>
                📐 <strong>Τι ονομάζουμε Ύψος;</strong>
              </p>
              <p className="text-slate-700 leading-relaxed font-medium">
                <strong>Ύψος τριγώνου</strong> ονομάζουμε το κάθετο ευθύγραμμο τμήμα που ξεκινά από μια κορυφή (π.χ. την Α) και καταλήγει στην απέναντι πλευρά (βάση) ή στην προέκτασή της. 
              </p>
              <p className="text-xs font-bold text-blue-800 pt-1">
                💡 Θυμήσου: Αν το τρίγωνο είναι αμβλυγώνιο, το ύψος πέφτει έξω από το τρίγωνο, γι\' αυτό χρειάζεται να προεκτείνουμε τη βάση με μια διακεκομμένη γραμμή!
              </p>
            </div>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[520px] w-full">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  🕹️ Μετακίνησε την Κορυφή Α
                </h3>
                <p className="text-gray-500 text-sm">
                  Σύρε τον δρομέα οριζόντια για να δεις πώς το ύψος αλλάζει θέση, αλλά το μήκος του παραμένει σταθερό.
                </p>
              </div>

              {/* Slider και Στατιστικά Ύψους */}
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl w-full space-y-6 shadow-inner my-auto">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white p-3 rounded-xl border shadow-sm">
                    <span className="text-[10px] font-black text-gray-400 block uppercase tracking-wide">ΜΗΚΟΣ ΥΨΟΥΣ</span>
                    <span className="text-2xl font-black text-rose-600">
                      {ipsosHeightCm} cm
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border shadow-sm">
                    <span className="text-[10px] font-black text-gray-400 block uppercase tracking-wide">ΤΥΠΟΣ ΤΡΙΓΩΝΟΥ</span>
                    <span className={`text-sm font-black block mt-1 ${triCategory.color}`}>
                      {triCategory.title}
                    </span>
                  </div>
                </div>

                <div className="px-2">
                  <input 
                    type="range" 
                    min="100" 
                    max="500" 
                    value={posX} 
                    onChange={(e) => setPosX(parseInt(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[11px] font-bold text-gray-400 pt-2 tracking-wide">
                    <span>◀️ Αμβλυγώνιο (Έξω)</span>
                    <span className="text-blue-600">Κέντρο (Μέσα)</span>
                    <span>Αμβλυγώνιο (Έξω) ▶️</span>
                  </div>
                </div>
              </div>

              {/* ΘΕΣΗ ΥΨΟΥΣ */}
              <div className={`p-6 md:p-8 rounded-2xl border transition-all duration-300 w-full ${triCategory.bg}`}>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block text-center">ΠΟΥ ΠΕΦΤΕΙ ΤΟ ΥΨΟΣ;</span>
                <div className={`text-lg md:text-xl font-black text-center mt-1 ${triCategory.color}`}>
                  {getIpsosPosition()}
                </div>
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: SVG ΟΠΤΙΚΟΠΟΙΗΣΗ ΤΡΙΓΩΝΟΥ & ΥΨΟΥΣ */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-between min-h-[520px] w-full relative overflow-hidden">
              <div className="w-full"></div>

              {/* Ευρύς καμβάς SVG 600x340 με GPU Acceleration */}
              <svg 
                viewBox="0 0 600 340" 
                className="w-full h-auto drop-shadow-md my-auto px-2"
                style={{ willChange: 'transform', transform: 'translateZ(0)' }}
              >
                
                {/* 🪟 Προεκτάσεις βάσεων (Αχνές γραμμές) αν η κορυφή Α βγει έξω δεξιά ή αριστερά */}
                {ax < bx && (
                  <line x1={ax} y1={by} x2={bx} y2={by} className="stroke-slate-300 stroke-[2] stroke-dasharray-[4,4]" />
                )}
                {ax > gx && (
                  <line x1={gx} y1={by} x2={ax} y2={by} className="stroke-slate-300 stroke-[2] stroke-dasharray-[4,4]" />
                )}

                {/* 🟥 Σχεδίαση του Τετραγώνου της Ορθής Γωνίας στη βάση του ύψους */}
                <g className="stroke-rose-500 stroke-2 fill-rose-500/10">
                  {ax >= bx ? (
                    <rect x={ax - 15} y={by - 15} width="15" height="15" />
                  ) : (
                    <rect x={ax} y={by - 15} width="15" height="15" />
                  )}
                </g>

                {/* Το κύριο Τρίγωνο ΑΒΓ */}
                <polygon 
                  points={`${ax},${ay} ${bx},${by} ${gx},${gy}`} 
                  className="fill-blue-500/5 stroke-blue-600 stroke-[4] stroke-linejoin-round"
                />

                {/* Η Σταθερή Βάση ΒΓ (Πιο έντονη) */}
                <line x1={bx} y1={by} x2={gx} y2={gy} className="stroke-slate-800 stroke-[4] stroke-linecap-round" />

                {/* 📏 Το Ύψος του τριγώνου (Κάθετο ευθύγραμμο τμήμα από το Α έως το y της βάσης) */}
                <line 
                  x1={ax} y1={ay} x2={ax} y2={by} 
                  className="stroke-rose-500 stroke-[4] stroke-linecap-round" 
                />

                {/* Κορυφή Α */}
                <circle cx={ax} cy={ay} r={5} className="fill-slate-800" />
                <text x={ax} y={ay - 12} className="text-sm font-black fill-slate-800 text-anchor-middle">Α</text>

                {/* Κορυφή Β */}
                <circle cx={bx} cy={by} r={5} className="fill-slate-800" />
                <text x={bx - 15} y={by + 5} className="text-sm font-black fill-slate-800">Β</text>

                {/* Κορυφή Γ */}
                <circle cx={gx} cy={gy} r={5} className="fill-slate-800" />
                <text x={gx + 15} y={gy + 5} className="text-sm font-black fill-slate-800">Γ</text>

                {/* Ένδειξη κειμένου "ύψος" πάνω στη κόκκινη γραμμή */}
                <text x={ax + 12} y={(ay + by) / 2} className="text-xs font-black fill-rose-600">ύψος</text>
              </svg>

              {/* Ετικέτα στο κάτω μέρος του καμβά */}
              <div className="w-full flex justify-center text-xs md:text-sm font-bold text-slate-400 pt-4 border-t border-gray-50 mt-auto">
                <span>📏 Το ύψος είναι πάντα κάθετο στη βάση και σχηματίζει ορθή γωνία (90°).</span>
              </div>
            </div>

          </div>

        </main>
      </div>

      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Διαδραστική Γεωμετρία Υψών.</p>
      </footer>
    </div>
  );
}
