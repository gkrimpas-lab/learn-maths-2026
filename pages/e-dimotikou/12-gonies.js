// pages/e-dimotikou/12-gwnies.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function GwniesPage() {
  // Κρατάμε τις μοίρες της γωνίας (από 0° έως 180°)
  const [degrees, setDegrees] = useState(45);

  // Συνάρτηση για τον καθορισμό του είδους της γωνίας
  const getAngleType = (deg) => {
    if (deg === 0) return { title: 'Μηδενική Γωνία', color: 'text-gray-500', bg: 'bg-gray-50 border-gray-200' };
    if (deg < 90) return { title: 'Οξεία Γωνία', color: 'text-blue-600', bg: 'bg-blue-50/50 border-blue-200' };
    if (deg === 90) return { title: 'Ορθή Γωνία', color: 'text-emerald-600', bg: 'bg-emerald-50/50 border-emerald-200' };
    if (deg < 180) return { title: 'Αμβλεία Γωνία', color: 'text-purple-600', bg: 'bg-purple-50/50 border-purple-200' };
    return { title: 'Ευθεία Γωνία', color: 'text-slate-700', bg: 'bg-slate-100 border-slate-300' };
  };

  const angleType = getAngleType(degrees);

  // Μαθηματικός υπολογισμός της κινητής ακτίνας για το SVG
  // Κέντρο (Κορυφή γωνίας): (140, 130), Μήκος ακτίνας: 80
  const cx = 140;
  const cy = 130;
  const radius = 80;
  
  // Μετατροπή μοιρών σε ακτίνια (μετατοπισμένο κατά 180 μοίρες για να ανοίγει προς τα αριστερά/πάνω όπως το πρότυπο)
  const angleInRadians = ((180 - degrees) * Math.PI) / 180;
  const x2 = cx + radius * Math.cos(angleInRadians);
  const y2 = cy - radius * Math.sin(angleInRadians);

  // Υπολογισμός τόξου για τη γωνία (μικρό διακοσμητικό τόξο)
  const arcRadius = 20;
  const arcX = cx + arcRadius * Math.cos(angleInRadians);
  const arcY = cy - arcRadius * Math.sin(angleInRadians);
  const largeArcFlag = degrees > 180 ? 1 : 0;
  const arcPath = degrees > 0 ? `M ${cx - arcRadius} ${cy} A ${arcRadius} ${arcRadius} 0 0 0 ${arcX} ${arcY}` : '';

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>📐 Τα Είδη των Γωνιών - LearnMaths.gr</title>
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
          
          {/* SECTION 1: ΘΕΩΡΙΑ - Ακριβώς όπως στην εικόνα_6 */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              📖 Θεωρία: Τα Είδη των Γωνιών
            </h2>
            <p className="text-gray-500 text-sm md:text-base">
              Οι γωνίες ονομάζονται ανάλογα με το άνοιγμά τους (το μέγεθός τους σε μοίρες):
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Οξεία */}
              <div className="bg-blue-50/40 p-5 rounded-2xl border border-blue-100 space-y-2">
                <span className="font-black text-blue-600 flex items-center gap-1">📐 Οξεία Γωνία</span>
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                  Είναι κάθε γωνία που είναι <strong>μικρότερη από 180°C</strong> (και μεγαλύτερη από 0°).
                </p>
                <span className="inline-block bg-blue-100 text-blue-800 font-bold text-xs p-1 px-2 rounded-md">
                  0° &lt; Γωνία &lt; 90°
                </span>
              </div>

              {/* Ορθή */}
              <div className="bg-emerald-50/40 p-5 rounded-2xl border border-emerald-100 space-y-2">
                <span className="font-black text-emerald-600 flex items-center gap-1">📐 Ορθή Γωνία</span>
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                  Είναι η γωνία που οι δύο ακτίνες της είναι τελείως κάθετες. Είναι ακριβώς <strong>90°</strong>.
                </p>
                <span className="inline-block bg-emerald-100 text-emerald-800 font-bold text-xs p-1 px-2 rounded-md">
                  Γωνία = 90°
                </span>
              </div>

              {/* Αμβλεία */}
              <div className="bg-purple-50/40 p-5 rounded-2xl border border-purple-100 space-y-2">
                <span className="font-black text-purple-600 flex items-center gap-1">📐 Αμβλεία Γωνία</span>
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                  Είναι κάθε γωνία που είναι <strong>μεγαλύτερη από 90°</strong> και μικρότερη από 180°.
                </p>
                <span className="inline-block bg-purple-100 text-purple-800 font-bold text-xs p-1 px-2 rounded-md">
                  90° &lt; Γωνία &lt; 180°
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-6xl mx-auto">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  🕹️ Ρύθμισε τη Γωνία
                </h3>
                <p className="text-gray-500 text-xs">
                  Σύρε τον δρομέα για να μεγαλώσεις ή να μικρύνεις το άνοιγμα των ακτίνων.
                </p>
              </div>

              {/* Κουμπιά και Input */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl max-w-md mx-auto space-y-4 shadow-inner">
                <div className="flex items-center justify-between px-2">
                  <span className="font-black text-slate-700 text-sm sm:text-base">Μοίρες:</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setDegrees(Math.max(0, degrees - 1))} className="bg-cyan-500 text-white font-black w-8 h-8 rounded-full text-lg hover:bg-cyan-600 transition shadow-sm flex items-center justify-center">-</button>
                    <span className="w-16 text-center font-black text-2xl text-slate-800">{degrees}°</span>
                    <button onClick={() => setDegrees(Math.min(180, degrees + 1))} className="bg-cyan-500 text-white font-black w-8 h-8 rounded-full text-lg hover:bg-cyan-600 transition shadow-sm flex items-center justify-center">+</button>
                  </div>
                </div>

                {/* Slider / Range */}
                <div className="px-2 pt-2">
                  <input 
                    type="range" 
                    min="0" 
                    max="180" 
                    value={degrees} 
                    onChange={(e) => setDegrees(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-gray-400 pt-1.5">
                    <span>0° (Μηδενική)</span>
                    <span>90° (Ορθή)</span>
                    <span>180° (Ευθεία)</span>
                  </div>
                </div>
              </div>

              {/* DISPLAY ΚΑΤΗΓΟΡΙΑΣ (Όπως στην εικόνα) */}
              <div className={`p-6 rounded-2xl border text-center ${angleType.bg} transition-all duration-300 max-w-md mx-auto space-y-1`}>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">ΑΥΤΗ Η ΓΩΝΙΑ ΕΙΝΑΙ:</span>
                <div className={`text-2xl sm:text-3xl font-black ${angleType.color}`}>
                  {angleType.title}
                </div>
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: SVG ΟΠΤΙΚΟΠΟΙΗΣΗ */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[360px] relative">
              
              <svg viewBox="0 0 200 200" className="w-full max-w-[280px] sm:max-w-[320px] h-auto drop-shadow-sm">
                {/* Οριζόντια Ακτίνα Βάσης */}
                <line x1={cx} y1={cy} x2={cx - radius} y2={cy} className="stroke-slate-800 stroke-[4] stroke-linecap-round" />
                
                {/* Κινητή Ακτίνα */}
                {degrees > 0 && (
                  <line x1={cx} y1={cy} x2={x2} y2={y2} className="stroke-cyan-600 stroke-[4] stroke-linecap-round transition-all duration-150" />
                )}

                {/* Διακοσμητικό τόξο γωνίας */}
                {degrees > 0 && (
                  <path d={arcPath} fill="none" className="stroke-amber-500 stroke-2 transition-all duration-150" />
                )}

                {/* Κέντρο/Κορυφή (Τελεία) */}
                <circle cx={cx} cy={cy} r={5} className="fill-slate-800" />
              </svg>

              {/* Ετικέτες στο κάτω μέρος του καμβά */}
              <div className="w-full flex justify-around text-[11px] font-bold text-slate-400 pt-4 border-t border-gray-50">
                <span>📍 Κορυφή</span>
                <span>📐 Μοίρες: {degrees}°</span>
              </div>
            </div>

          </div>

        </main>
      </div>

      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Διαδραστική Γεωμετρία.</p>
      </footer>
    </div>
  );
}
