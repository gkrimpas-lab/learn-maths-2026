// pages/e-dimotikou/13-trigwna.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// ⚙️ ΡΥΘΜΙΣΕΙΣ ΟΡΙΩΝ ΓΩΝΙΑΣ
const ANGLE_MIN = 1;
const ANGLE_MAX = 179;

export default function TrigwnaPage() {
  // Αρχική τιμή γωνίας Β
  const [angleB, setAngleB] = useState(60);

  // Διασφάλιση ορίων
  const currentB = Math.max(ANGLE_MIN, Math.min(ANGLE_MAX, angleB));

  // --- ΜΑΘΗΜΑΤΙΚΟΣ ΥΠΟΛΟΓΙΣΜΟΣ ΓΩΝΙΩΝ ---
  // Μοιράζουμε τις υπόλοιπες μοίρες εξίσου για μια ομαλή και ισορροπημένη γεωμετρική μεταμόρφωση
  const angleA = Math.round((180 - currentB) / 2);
  const angleΓ = 180 - currentB - angleA;

  // --- ΣΤΑΘΕΡΗ ΜΕΓΑΛΗ ΒΑΣΗ ΣΕ ΕΥΡΥΧΩΡΟ ΚΑΜΒΑ ---
  // Κρατάμε μια σταθερή βάση 240 μονάδων
  const baseSide = 240; 
  
  // Χρησιμοποιούμε viewBox πλάτους 800 για να έχει άφθονο χώρο δεξιά-αριστερά όταν το τρίγωνο "ξαπλώνει" στις 1° ή 179°
  const bx = 400 - baseSide / 2; // Κεντράρισμα του ΒΓ στον άξονα Χ (400 είναι το μέσο του 800)
  const by = 280; 
  const gx = 400 + baseSide / 2;
  const gy = 280;

  // Τριγωνομετρικός υπολογισμός της κορυφής Α με το Νόμο των Ημιτόνων
  const radB = (currentB * Math.PI) / 180;
  const radΓ = (angleΓ * Math.PI) / 180;
  const radA = (angleA * Math.PI) / 180;

  // Υπολογισμός της πλευράς c (ΑΒ)
  const sidec = (baseSide * Math.sin(radΓ)) / Math.sin(radA);

  // Συντεταγμένες του σημείου Α
  const ax = bx + sidec * Math.cos(radB);
  const ay = by - sidec * Math.sin(radB);

  // Κατηγοριοποίηση του τριγώνου
  const getTriangleType = () => {
    if (angleA === 90 || currentB === 90 || angleΓ === 90) {
      return { title: 'Ορθογώνιο Τρίγωνο', desc: 'Έχει μία ορθή γωνία (ακριβώς 90°).', color: 'text-emerald-600', bg: 'bg-emerald-50/50 border-emerald-200' };
    }
    if (angleA > 90 || currentB > 90 || angleΓ > 90) {
      return { title: 'Αμβλυγώνιο Τρίγωνο', desc: 'Έχει μία αμβλεία γωνία (μεγαλύτερη από 90°).', color: 'text-purple-600', bg: 'bg-purple-50/50 border-purple-200' };
    }
    return { title: 'Οξυγώνιο Τρίγωνο', desc: 'Όλες οι γωνίες του είναι οξείες (μικρότερες από 90°).', color: 'text-blue-600', bg: 'bg-blue-50/50 border-blue-200' };
  };

  const triType = getTriangleType();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🔺 Τρίγωνα ως προς τις Γωνίες - LearnMaths.gr</title>
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
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              📖 Θεωρία: Τα Τρίγωνα ως προς τις Γωνίες
            </h2>
            <p className="text-gray-500 text-sm md:text-base">
              Ανάλογα με το είδος των γωνιών τους, τα τρίγωνα χωρίζονται σε τρεις μεγάλες κατηγορίες:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50/40 p-5 rounded-2xl border border-blue-100 space-y-2">
                <span className="font-black text-blue-600 flex items-center gap-1">▲ Οξυγώνιο Τρίγωνο</span>
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                  Είναι το τρίγωνο που έχει <strong>και τις τρεις γωνίες του οξείες</strong>, δηλαδή μικρότερες από 90°.
                </p>
              </div>

              <div className="bg-emerald-50/40 p-5 rounded-2xl border border-emerald-100 space-y-2">
                <span className="font-black text-emerald-600 flex items-center gap-1">▲ Ορθογώνιο Τρίγωνο</span>
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                  Είναι το τρίγωνο που έχει <strong>μία ορθή γωνία</strong> (ακριβώς 90°). Οι άλλες δύο γωνίες του είναι αναγκαστικά οξείες.
                </p>
              </div>

              <div className="bg-purple-50/40 p-5 rounded-2xl border border-purple-100 space-y-2">
                <span className="font-black text-purple-600 flex items-center gap-1">▲ Αμβλυγώνιο Τρίγωνο</span>
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                  Είναι το τρίγωνο που έχει <strong>μία αμβλεία γωνία</strong> (μεγαλύτερη από 90°). Οι άλλες δύο είναι οξείες.
                </p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-xl text-xs md:text-sm font-bold text-center">
              💡 Θυμήσου: Το άθροισμα και των τριών γωνιών οποιουδήποτε τριγώνου είναι πάντα ίσο με 180°!
            </div>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[520px] w-full">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  🕹️ Μετάβαλλε τη Γωνία Β
                </h3>
                <p className="text-gray-500 text-sm">
                  Άλλαξε το άνοιγμα της κάτω αριστερής γωνίας. Όλες οι γωνίες θα αλλάξουν αυτόματα!
                </p>
              </div>

              {/* Κουμπιά και Slider */}
              <div className="bg-slate-50 border border-slate-200 p-6 md:p-8 rounded-2xl w-full space-y-6 shadow-inner my-auto">
                <div className="flex items-center justify-between px-2">
                  <span className="font-black text-slate-700 text-base md:text-lg">Γωνία Β:</span>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setAngleB(Math.max(ANGLE_MIN, currentB - 1))} className="bg-cyan-500 text-white font-black w-10 h-10 rounded-lg text-sm hover:bg-cyan-600 transition flex items-center justify-center">-1°</button>
                    <span className="w-24 text-center font-black text-3xl md:text-4xl text-cyan-600 tabular-nums">{currentB}°</span>
                    <button onClick={() => setAngleB(Math.min(ANGLE_MAX, currentB + 1))} className="bg-cyan-500 text-white font-black w-10 h-10 rounded-lg text-sm hover:bg-cyan-600 transition flex items-center justify-center">+1°</button>
                  </div>
                </div>

                {/* Range Slider */}
                <div className="px-2 pt-2">
                  <input 
                    type="range" 
                    min={ANGLE_MIN} 
                    max={ANGLE_MAX} 
                    value={currentB} 
                    onChange={(e) => setAngleB(parseInt(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <div className="flex justify-between text-[11px] font-bold text-gray-400 pt-2 tracking-wide">
                    <span>{ANGLE_MIN}° (Ελάχιστη)</span>
                    <span>90° (Ορθή Β)</span>
                    <span>{ANGLE_MAX}° (Μέγιστη)</span>
                  </div>
                </div>
              </div>

              {/* ΑΥΤΟ ΤΟ ΤΡΙΓΩΝΟ ΕΙΝΑΙ */}
              <div className={`p-6 md:p-8 rounded-2xl border ${triType.bg} transition-all duration-300 w-full space-y-3`}>
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">ΑΥΤΟ ΤΟ ΤΡΙΓΩΝΟ ΕΙΝΑΙ:</span>
                  <div className={`text-2xl md:text-3xl font-black ${triType.color}`}>
                    {triType.title}
                  </div>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">{triType.desc}</p>
                </div>
                
                {/* Δυναμική εμφάνιση των 3 γωνιών */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-200/50 text-center text-xs font-black text-slate-700">
                  <div className="bg-white/80 p-1.5 rounded-lg border">Α = {angleA}°</div>
                  <div className="bg-cyan-50 p-1.5 rounded-lg border border-cyan-100 text-cyan-700">Β = {currentB}°</div>
                  <div className="bg-white/80 p-1.5 rounded-lg border">Γ = {angleΓ}°</div>
                </div>
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: SVG ΟΠΤΙΚΟΠΟΙΗΣΗ ΤΡΙΓΩΝΟΥ (Widescreen Καμβάς) */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-between min-h-[520px] w-full relative overflow-hidden">
              <div className="w-full"></div>

              {/* Ευρύ πλάτος 800x380 ώστε να απλώνεται το σχήμα σε όλο το λευκό πλαίσιο χωρίς να κόβεται */}
              <svg viewBox="0 0 800 380" className="w-full h-auto drop-shadow-md my-auto px-2">
                {/* Γέμισμα και περίγραμμα του τριγώνου ΑΒΓ */}
                <polygon 
                  points={`${ax},${ay} ${bx},${by} ${gx},${gy}`} 
                  className="fill-cyan-500/10 stroke-cyan-600 stroke-[4] stroke-linejoin-round"
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
              </svg>

              {/* Ετικέτα Αθροίσματος Γωνιών στο κάτω μέρος */}
              <div className="w-full flex justify-center text-xs md:text-sm font-bold text-slate-400 pt-4 border-t border-gray-50 mt-auto">
                <span>🧮 Άθροισμα γωνιών: {angleA}° + {currentB}° + {angleΓ}° = 180°</span>
              </div>
            </div>

          </div>

        </main>
      </div>

      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Διαδραστική Γεωμετρία Τριγώνων.</p>
      </footer>
    </div>
  );
}
