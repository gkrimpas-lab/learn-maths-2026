// pages/e-dimotikou/12-gonies.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function GoniesPage() {
  const [angle, setAngle] = useState(45);

  // Live προσδιορισμός του είδους της γωνίας
  const getAngleType = (deg) => {
    if (deg === 0) return { name: 'Μηδενική Γωνία', color: 'text-slate-500', bg: 'bg-slate-50 border-slate-200' };
    if (deg < 90) return { name: 'Οξεία Γωνία', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' };
    if (deg === 90) return { name: 'Ορθή Γωνία', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' };
    if (deg < 180) return { name: 'Αμβλεία Γωνία', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' };
    return { name: 'Ευθεία Γωνία', color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200' };
  };

  const angleType = getAngleType(angle);

  // Υπολογισμός της θέσης του κινητού σημείου της γωνίας με βάση τις μοίρες (Τριγωνομετρία SVG)
  // Κέντρο (vertex) στο (150, 130) και ακτίνα 100
  const cx = 150;
  const cy = 130;
  const radius = 100;
  
  // Μετατροπή μοιρών σε ακτίνια (και αναστροφή του y επειδή στο SVG το y μεγαλώνει προς τα κάτω)
  const radians = (angle * Math.PI) / 180;
  const lineX = cx + radius * Math.cos(radians);
  const lineY = cy - radius * Math.sin(radians);

  // Σχεδίαση του τόξου (Arc) της γωνίας
  const arcRadius = 25;
  const arcX = cx + arcRadius * Math.cos(radians);
  const arcY = cy - arcRadius * Math.sin(radians);
  const largeArcFlag = angle > 180 ? 1 : 0;
  const arcPath = `M ${cx + arcRadius} ${cy} A ${arcRadius} ${arcRadius} 0 ${largeArcFlag} 0 ${arcX} ${arcY}`;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Head>
        <title>📐 Είδη Γωνιών - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      {/* NAVBAR */}
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/e-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight">LearnMaths<span className="text-indigo-600">.gr</span></Link>
          <Link href="/e-dimotikou" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold transition">🔙 Επιστροφή</Link>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        
        {/* ΠΙΝΑΚΑΣ ΘΕΩΡΙΑΣ */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">📖 Θεωρία: Τα Είδη των Γωνιών</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Οι γωνίες ονομάζονται ανάλογα με το άνοιγμά τους (το μέγεθός τους σε μοίρες):
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200 space-y-1">
              <span className="font-bold text-blue-600 text-sm block">📐 Οξεία Γωνία</span>
              <p className="text-gray-600">Είναι κάθε γωνία που είναι **μικρότερη από 90°** (και μεγαλύτερη από 0°).</p>
              <span className="inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold mt-1">0° &lt; Γωνία &lt; 90°</span>
            </div>
            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 space-y-1">
              <span className="font-bold text-emerald-600 text-sm block">📐 Ορθή Γωνία</span>
              <p className="text-gray-600">Είναι η γωνία που οι δύο ακτίνες της είναι τελείως κάθετες. Είναι ακριβώς **90°**.</p>
              <span className="inline-block bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold mt-1">Γωνία = 90°</span>
            </div>
            <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-200 space-y-1">
              <span className="font-bold text-purple-600 text-sm block">📐 Αμβλεία Γωνία</span>
              <p className="text-gray-600">Είναι κάθε γωνία που είναι **μεγαλύτερη από 90°** και μικρότερη από 180°.</p>
              <span className="inline-block bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold mt-1">90° &lt; Γωνία &lt; 180°</span>
            </div>
          </div>
        </div>

        {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* ΧΕΙΡΙΣΤΗΡΙΑ */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-black text-gray-900">🕹️ Ρύθμισε τη Γωνία</h3>
              <p className="text-gray-500 text-xs">Σύρε τον δρομέα για να μεγαλώσεις ή να μικρύνεις το άνοιγμα των ακτίνων.</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border space-y-4">
              <div className="flex justify-between items-center bg-white p-3 rounded-xl border shadow-sm">
                <span className="font-bold text-gray-700 text-sm">Μοίρες:</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setAngle(Math.max(0, angle - 1))} className="bg-cyan-500 text-white w-7 h-7 rounded-full font-bold hover:bg-cyan-600 transition shadow-sm">-</button>
                  <span className="text-2xl font-black text-cyan-600 w-16 text-center">{angle}°</span>
                  <button onClick={() => setAngle(Math.min(180, angle + 1))} className="bg-cyan-500 text-white w-7 h-7 rounded-full font-bold hover:bg-cyan-600 transition shadow-sm">+</button>
                </div>
              </div>

              <div className="px-1">
                <input 
                  type="range" 
                  min="0" 
                  max="180" 
                  value={angle} 
                  onChange={(e) => setAngle(parseInt(e.target.value, 10))} 
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-bold px-1 mt-1">
                  <span>0° (Μηδενική)</span>
                  <span>90° (Ορθή)</span>
                  <span>180° (Ευθεία)</span>
                </div>
              </div>
            </div>

            {/* LIVE ΕΜΦΑΝΙΣΗ ΤΥΠΟΥ */}
            <div className={`p-4 rounded-2xl border text-center transition duration-300 ${angleType.bg}`}>
              <span className="text-xs uppercase font-black tracking-wider text-gray-400 block">Αυτή η γωνία είναι:</span>
              <span className={`text-2xl font-black mt-1 block ${angleType.color}`}>{angleType.name}</span>
            </div>
          </div>

          {/* ΓΡΑΦΙΚΟ SVG (Η ΓΩΝΙΑ) */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-gray-200 flex flex-col items-center justify-center min-h-[300px] shadow-inner relative">
            <svg width="260" height="200" className="overflow-visible">
              {/* Τοξάκι ένδειξης μοιρών (κρύβεται αν είναι 0°) */}
              {angle > 0 && (
                <path 
                  d={arcPath} 
                  fill="none" 
                  className="stroke-amber-500 stroke-2" 
                />
              )}
              
              {/* Οριζόντια σταθερή ακτίνα (Βάση γωνίας) */}
              <line 
                x1={cx} 
                y1={cy} 
                x2={cx + radius} 
                y2={cy} 
                className="stroke-slate-800 stroke-[4]" 
                strokeLinecap="round"
              />
              
              {/* Κινητή ακτίνα */}
              <line 
                x1={cx} 
                y1={cy} 
                x2={lineX} 
                y2={lineY} 
                className="stroke-cyan-600 stroke-[4] transition-all duration-75" 
                strokeLinecap="round"
              />
              
              {/* Η κορυφή της γωνίας (Vertex) */}
              <circle cx={cx} cy={cy} r="6" className="fill-slate-900" />

              {/* Μικρό τετραγωνάκι για την Ορθή Γωνία αν είναι ακριβώς 90 μοίρες */}
              {angle === 90 && (
                <path d={`M ${cx} ${cy - 12} L ${cx + 12} ${cy - 12} L ${cx + 12} ${cy}`} fill="none" className="stroke-emerald-500 stroke-[1.5]" />
              )}
            </svg>

            {/* Ετικέτες γραφικού */}
            <div className="absolute bottom-3 text-[10px] font-bold text-gray-400 flex gap-12">
              <span>Κορυφή</span>
              <span>Μοίρες: {angle}°</span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
