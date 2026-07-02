// pages/e-dimotikou/13-trigona.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function TrigonaPage() {
  // Η βασική μεταβαλλόμενη γωνία Α της κορυφής
  const [angleA, setAngleA] = useState(60);

  // Υπολογισμός των άλλων δύο γωνιών (ισοσκελές τρίγωνο για καθαρή γεωμετρική απεικόνιση)
  const angleB = (180 - angleA) / 2;
  const angleC = angleB;

  // Live προσδιορισμός του είδους του τριγώνου ως προς τις γωνίες
  const getTriangleType = (a, b, c) => {
    if (a === 90 || b === 90 || c === 90) {
      return { name: 'Ορθογώνιο Τρίγωνο', desc: 'Έχει μία ορθή γωνία (90°).', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' };
    }
    if (a > 90 || b > 90 || c > 90) {
      return { name: 'Αμβληγώνιο Τρίγωνο', desc: 'Έχει μία αμβλεία γωνία (μεγαλύτερη από 90°).', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' };
    }
    return { name: 'Οξυγώνιο Τρίγωνο', desc: 'Όλες οι γωνίες του είναι οξείες (μικρότερες από 90°).', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' };
  };

  const triangleType = getTriangleType(angleA, angleB, angleC);

  // Υπολογισμός συντεταγμένων SVG για το τρίγωνο
  // Σταθερή βάση (Β και Γ) στο κάτω μέρος του SVG
  const bx = 60;
  const by = 180;
  const cx = 240;
  const cy = 180;

  // Υπολογισμός της κορυφής Α με βάση τη γωνία Α (τριγωνομετρικά)
  const baseLength = cx - bx; // 180 pixels
  const midX = (bx + cx) / 2; // 150 pixels
  
  // Ύψος τριγώνου βάσει της εφαπτομένης της γωνίας Β
  const angleBRadians = (angleB * Math.PI) / 180;
  const height = (baseLength / 2) * Math.tan(angleBRadians);
  
  // Περιορισμός του ύψους για να μην βγαίνει έξω από το SVG πλαίσιο
  const ax = midX;
  const ay = Math.max(20, by - height);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Head>
        <title>🔺 Είδη Τριγώνων - LearnMaths.gr</title>
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
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">正式 Θεωρία: Τα Τρίγωνα ως προς τις Γωνίες</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Ανάλογα με το είδος των γωνιών τους, τα τρίγωνα χωρίζονται σε τρεις μεγάλες κατηγορίες:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200 space-y-1">
              <span className="font-bold text-blue-600 text-sm block">🔺 Οξυγώνιο Τρίγωνο</span>
              <p className="text-gray-600">Είναι το τρίγωνο που έχει **και τις τρεις γωνίες του οξείες**, δηλαδή μικρότερες από 90°.</p>
            </div>
            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 space-y-1">
              <span className="font-bold text-emerald-600 text-sm block">🔺 Ορθογώνιο Τρίγωνο</span>
              <p className="text-gray-600">Είναι το τρίγωνο που έχει **μία ορθή γωνία (ακριβώς 90°)**. Οι άλλες δύο γωνίες του είναι αναγκαστικά οξείες.</p>
            </div>
            <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-200 space-y-1">
              <span className="font-bold text-purple-600 text-sm block">🔺 Αμβληγώνιο Τρίγωνο</span>
              <p className="text-gray-600">Είναι το τρίγωνο που έχει **μία αμβλεία γωνία (μεγαλύτερη από 90°)**. Οι άλλες δύο είναι οξείες.</p>
            </div>
          </div>
          <p className="text-xs text-amber-600 font-bold bg-amber-50 p-2.5 rounded-lg border border-amber-200">
            💡 Θυμήσου: Το άθροισμα και των τριών γωνιών οποιουδήποτε τριγώνου είναι πάντα ίσο με 180°!
          </p>
        </div>

        {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* ΧΕΙΡΙΣΤΗΡΙΑ */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-black text-gray-900">🕹️ Μετάβαλλε τη Γωνία Α</h3>
              <p className="text-gray-500 text-xs">Άλλαξε το άνοιγμα της πάνω γωνίας για να δεις πώς μεταμορφώνεται το τρίγωνο.</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border space-y-4">
              <div className="flex justify-between items-center bg-white p-3 rounded-xl border shadow-sm">
                <span className="font-bold text-gray-700 text-sm">Γωνία Α:</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setAngleA(Math.max(20, angleA - 5))} className="bg-cyan-500 text-white w-7 h-7 rounded-full font-bold hover:bg-cyan-600 transition shadow-sm">-5</button>
                  <span className="text-2xl font-black text-cyan-600 w-16 text-center">{angleA}°</span>
                  <button onClick={() => setAngleA(Math.min(150, angleA + 5))} className="bg-cyan-500 text-white w-7 h-7 rounded-full font-bold hover:bg-cyan-600 transition shadow-sm">+</button>
                </div>
              </div>

              <div className="px-1">
                <input 
                  type="range" 
                  min="20" 
                  max="150" 
                  value={angleA} 
                  onChange={(e) => setAngleA(parseInt(e.target.value, 10))} 
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-bold px-1 mt-1">
                  <span>20° (Οξείες όλες)</span>
                  <span>90° (Ορθή Α)</span>
                  <span>150° (Αμβλεία Α)</span>
                </div>
              </div>
            </div>

            {/* LIVE ΕΜΦΑΝΙΣΗ ΤΥΠΟΥ */}
            <div className={`p-4 rounded-2xl border transition duration-300 ${triangleType.bg}`}>
              <span className="text-xs uppercase font-black tracking-wider text-gray-400 block">Αυτό το τρίγωνο είναι:</span>
              <span className={`text-2xl font-black mt-0.5 block ${triangleType.color}`}>{triangleType.name}</span>
              <p className="text-xs text-gray-500 mt-1">{triangleType.desc}</p>
              
              {/* Αναλυτικές γωνίες */}
              <div className="mt-3 pt-2 border-t border-gray-200/60 grid grid-cols-3 text-[11px] font-bold text-gray-500">
                <div>A = {angleA}°</div>
                <div>B = {angleB.toFixed(0)}°</div>
                <div>Γ = {angleC.toFixed(0)}°</div>
              </div>
            </div>
          </div>

          {/* ΓΡΑΦΙΚΟ SVG (ΤΟ ΤΡΙΓΩΝΟ) */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-gray-200 flex flex-col items-center justify-center min-h-[300px] shadow-inner relative">
            <svg width="300" height="210" className="overflow-visible">
              
              {/* Το εσωτερικό γέμισμα και οι πλευρές του τριγώνου */}
              <polygon 
                points={`${ax},${ay} ${bx},${by} ${cx},${cy}`} 
                className="fill-cyan-400/20 stroke-cyan-600 stroke-[3] transition-all duration-150"
                strokeLinejoin="round"
              />
              
              {/* Σημειώσεις κορυφών */}
              {/* Κορυφή Α */}
              <circle cx={ax} cy={ay} r="4" className="fill-slate-800 transition-all duration-150" />
              <text x={ax} y={ay - 8} textAnchor="middle" className="text-xs font-black fill-slate-700 transition-all duration-150">A</text>

              {/* Κορυφή Β */}
              <circle cx={bx} cy={by} r="4" className="fill-slate-800" />
              <text x={bx - 10} y={by + 4} textAnchor="middle" className="text-xs font-black fill-slate-700">B</text>

              {/* Κορυφή Γ */}
              <circle cx={cx} cy={cy} r="4" className="fill-slate-800" />
              <text x={cx + 10} y={cy + 4} textAnchor="middle" className="text-xs font-black fill-slate-700">Γ</text>

              {/* Ένδείξη ορθής γωνίας στην κορυφή Α, αν είναι ακριβώς 90° */}
              {angleA === 90 && (
                <path d={`M ${ax - 10} ${ay + 10} L ${ax} ${ay + 20} L ${ax + 10} ${ay + 10}`} fill="none" className="stroke-emerald-500 stroke-[2]" />
              )}
            </svg>

            {/* Ένδειξη αθροίσματος */}
            <div className="absolute bottom-3 text-[10px] font-bold text-gray-400">
              Άθροισμα γωνιών: {angleA} + {angleB.toFixed(0)} + {angleC.toFixed(0)} = 180°
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
