// pages/e-dimotikou/13-trigwna.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function TrigwnaPage() {
  // Ο μαθητής μεταβάλλει τη γωνία Β (κάτω αριστερά). Όρια: 15° έως 150°
  const [angleB, setAngleB] = useState(60);

  // Κρατάμε τη γωνία Γ (κάτω δεξιά) σταθερή στις 45° για να υπολογίζεται καθαρά η πάνω κορυφή Α
  const angleΓ = 45;

  // Η τρίτη γωνία Α (πάνω κορυφή) προκύπτει αυτόματα: Α = 180 - Β - Γ
  const angleA = 180 - angleB - angleΓ;

  // Κατηγοριοποίηση του τριγώνου με βάση τις 3 γωνίες του (Α, Β, Γ)
  const getTriangleType = () => {
    if (angleA === 90 || angleB === 90 || angleΓ === 90) {
      return { title: 'Ορθογώνιο Τρίγωνο', desc: 'Έχει μία ορθή γωνία (ακριβώς 90°).', color: 'text-emerald-600', bg: 'bg-emerald-50/50 border-emerald-200' };
    }
    if (angleA > 90 || angleB > 90 || angleΓ > 90) {
      return { title: 'Αμβλυγώνιο Τρίγωνο', desc: 'Έχει μία αμβλεία γωνία (μεγαλύτερη από 90°).', color: 'text-purple-600', bg: 'bg-purple-50/50 border-purple-200' };
    }
    return { title: 'Οξυγώνιο Τρίγωνο', desc: 'Όλες οι γωνίες του είναι οξείες (μικρότερες από 90°).', color: 'text-blue-600', bg: 'bg-blue-50/50 border-blue-200' };
  };

  const triType = getTriangleType();

  // --- ΜΑΘΗΜΑΤΙΚΟΣ ΥΠΟΛΟΓΙΣΜΟΣ ΣΥΝΤΕΤΑΓΜΕΝΩΝ SVG ---
  // Σταθερή βάση ΒΓ στο κάτω μέρος του καμβά (viewBox 400x260)
  const bx = 100; // Σημείο Β (κάτω αριστερά)
  const by = 200;
  const gx = 300; // Σημείο Γ (κάτω δεξιά)
  const gy = 200;
  const baseLength = gx - bx; // Μήκος βάσης = 200

  // Χρήση του Νόμου των Ημιτόνων για την εύρεση των πλευρών και της κορυφής Α
  const radA = (angleA * Math.PI) / 180;
  const radB = (angleB * Math.PI) / 180;
  
  // Μήκος της πλευράς ΒΑ (c)
  const sidec = (baseLength * Math.sin((angleΓ * Math.PI) / 180)) / Math.sin(radA);

  // Συντεταγμένες της πάνω κορυφής Α (υπολογίζονται δυναμικά ξεκινώντας από το Β)
  const ax = bx + sidec * Math.cos(radB);
  const ay = by - sidec * Math.sin(radB);

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
          
          {/* SECTION 1: ΘΕΩΡΙΑ - Όπως στην εικόνα_9 */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              📖 Θεωρία: Τα Τρίγωνα ως προς τις Γωνίες
            </h2>
            <p className="text-gray-500 text-sm md:text-base">
              Ανάλογα με το είδος των γωνιών τους, τα τρίγωνα χωρίζονται σε τρεις μεγάλες κατηγορίες:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Οξυγώνιο */}
              <div className="bg-blue-50/40 p-5 rounded-2xl border border-blue-100 space-y-2">
                <span className="font-black text-blue-600 flex items-center gap-1">▲ Οξυγώνιο Τρίγωνο</span>
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                  Είναι το τρίγωνο που έχει <strong>και τις τρεις γωνίες του οξείες</strong>, δηλαδή μικρότερες από 90°.
                </p>
              </div>

              {/* Ορθογώνιο */}
              <div className="bg-emerald-50/40 p-5 rounded-2xl border border-emerald-100 space-y-2">
                <span className="font-black text-emerald-600 flex items-center gap-1">▲ Ορθογώνιο Τρίγωνο</span>
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                  Είναι το τρίγωνο που έχει <strong>μία ορθή γωνία</strong> (ακριβώς 90°). Οι άλλες δύο γωνίες του είναι αναγκαστικά οξείες.
                </p>
              </div>

              {/* Αμβλυγώνιο */}
              <div className="bg-purple-50/40 p-5 rounded-2xl border border-purple-100 space-y-2">
                <span className="font-black text-purple-600 flex items-center gap-1">▲ Αμβλυγώνιο Τρίγωνο</span>
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                  Είναι το τρίγωνο που έχει <strong>μία αμβλεία γωνία</strong> (μεγαλύτερη από 90°). Οι άλλες δύο είναι οξείες.
                </p>
              </div>
            </div>

            {/* SOS Υπενθύμιση */}
            <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-xl text-xs md:text-sm font-bold text-center">
              💡 Θυμήσου: Το άθροισμα και των τριών γωνιών οποιουδήποτε τριγώνου είναι πάντα ίσο με 180°!
            </div>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ ΜΕΓΕΘΥΜΕΝΟ & ΙΣΟΜΕΡΕΣ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ ΜΕΤΑΒΟΛΗΣ ΓΩΝΙΑΣ Β */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[490px] w-full">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  🕹️ Μετάβαλλε τη Γωνία Β
                </h3>
                <p className="text-gray-500 text-sm">
                  Άλλαξε το άνοιγμα της κάτω αριστερής γωνίας για να δεις πώς μεταμορφώνεται το τρίγωνο.
                </p>
              </div>

              {/* Κουμπιά και Slider */}
              <div className="bg-slate-50 border border-slate-200 p-6 md:p-8 rounded-2xl w-full space-y-6 shadow-inner my-auto">
                <div className="flex items-center justify-between px-2">
                  <span className="font-black text-slate-700 text-base md:text-lg">Γωνία Β:</span>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setAngleB(Math.max(15, angleB - 5))} className="bg-cyan-500 text-white font-black w-10 h-10 rounded-lg text-sm hover:bg-cyan-600 transition shadow-sm flex items-center justify-center">-5</button>
                    <span className="w-24 text-center font-black text-3xl md:text-4xl text-cyan-600 tabular-nums">{angleB}°</span>
                    <button onClick={() => setAngleB(Math.min(130, angleB + 5))} className="bg-cyan-500 text-white font-black w-10 h-10 rounded-lg text-sm hover:bg-cyan-600 transition shadow-sm flex items-center justify-center">+5</button>
                  </div>
                </div>

                {/* Range Slider */}
                <div className="px-2 pt-2">
                  <input 
                    type="range" 
                    min="15" 
                    max="130" 
                    value={angleB} 
                    onChange={(e) => setAngleB(parseInt(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <div className="flex justify-between text-[11px] font-bold text-gray-400 pt-2 tracking-wide">
                    <span>20° (Οξείες όλες)</span>
                    <span>90° (Ορθή Β)</span>
                    <span>120° (Αμβλεία Β)</span>
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
                
                {/* Ανάλυση των 3 γωνιών στο κάτω μέρος της κάρτας */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-200/50 text-center text-xs font-black text-slate-700">
                  <div className="bg-white/80 p-1.5 rounded-lg border">Α = {Math.round(angleA)}°</div>
                  <div className="bg-cyan-50 p-1.5 rounded-lg border border-cyan-100 text-cyan-700">Β = {angleB}°</div>
                  <div className="bg-white/80 p-1.5 rounded-lg border">Γ = {angleΓ}°</div>
                </div>
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: SVG ΟΠΤΙΚΟΠΟΙΗΣΗ ΤΡΙΓΩΝΟΥ (Ακριβώς ίδιο μέγεθος πλαισίου) */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-between min-h-[490px] w-full relative">
              <div className="w-full"></div>

              {/* SVG Σχήμα μεγεθυμένο με πλάτος 400x260 */}
              <svg viewBox="0 0 400 260" className="w-full max-w-[380px] sm:max-w-[440px] h-auto drop-shadow-md my-auto">
                {/* Γέμισμα και περίγραμμα του τριγώνου ΑΒΓ */}
                <polygon 
                  points={`${ax},${ay} ${bx},${by} ${gx},${gy}`} 
                  className="fill-cyan-500/10 stroke-cyan-600 stroke-[4] stroke-linejoin-round"
                />

                {/* Κορυφή Α (Πάνω) */}
                <circle cx={ax} cy={ay} r={5} className="fill-slate-800" />
                <text x={ax} y={ay - 12} className="text-sm font-black fill-slate-800 text-anchor-middle">Α</text>

                {/* Κορυφή Β (Κάτω Αριστερά - Αυτή που αλλάζει) */}
                <circle cx={bx} cy={by} r={5} className="fill-slate-800" />
                <text x={bx - 15} y={by + 5} className="text-sm font-black fill-slate-800">Β</text>

                {/* Κορυφή Γ (Κάτω Δεξιά) */}
                <circle cx={gx} cy={gy} r={5} className="fill-slate-800" />
                <text x={gx + 12} y={by + 5} className="text-sm font-black fill-slate-800">Γ</text>
              </svg>

              {/* Ετικέτα Αθροίσματος Γωνιών στο κάτω μέρος */}
              <div className="w-full flex justify-center text-xs md:text-sm font-bold text-slate-400 pt-4 border-t border-gray-50 mt-auto">
                <span>🧮 Άθροισμα γωνιών: {Math.round(angleA)}° + {angleB}° + {angleΓ}° = 180°</span>
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
