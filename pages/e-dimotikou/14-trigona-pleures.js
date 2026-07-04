// pages/e-dimotikou/14-trigona-pleures.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function TrigonaPleuresPage() {
  // Σταθερό μήκος βάσης ΒΓ
  const baseSide = 200; 

  // Δρομείς για το μήκος της αριστερής πλευράς (c / ΑΒ) και της δεξιάς πλευράς (b / ΑΓ)
  // Αρχικές τιμές 200 ώστε να ξεκινάει ως Ισόπλευρο
  const [sidec, setSidec] = useState(200); // Πλευρά ΑΒ
  const [sideb, setSideb] = useState(200); // Πλευρά ΑΓ

  // --- ΜΑΘΗΜΑΤΙΚΟΣ ΥΠΟΛΟΓΙΣΜΟΣ ΣΥΝΤΕΤΑΓΜΕΝΩΝ (Τριγωνομετρικός Εγκλωβισμός) ---
  // Σταθερές συντεταγμένες βάσης ΒΓ (κεντραρισμένες στο ευρύ viewBox 600x340)
  const bx = 300 - baseSide / 2; // 200
  const by = 260;
  const gx = 300 + baseSide / 2; // 400
  const gy = 260;

  // Έλεγχος της τριγωνικής ανισότητας: για να σχηματιστεί τρίγωνο πρέπει sideb + sidec > baseSide
  // Αν ο μαθητής δώσει πολύ μικρές πλευρές, εξαναγκάζουμε το ελάχιστο άνοιγμα για να μην σπάει το SVG
  const c = Math.max(110, sidec);
  const b = Math.max(110, sideb);

  // Εύρεση της γωνίας Β με το Νόμο των Συνημιτόνων: b² = c² + a² - 2·c·a·cos(B)
  // => cos(B) = (c² + a² - b²) / (2·c·a)
  const cosB = (c * c + baseSide * baseSide - b * b) / (2 * c * baseSide);
  
  // Περιορισμός του cosB μεταξύ -1 και 1 για ασφάλεια στους υπολογισμούς
  const safeCosB = Math.max(-0.99, Math.min(0.99, cosB));
  const radB = Math.acos(safeCosB);

  // Συντεταγμένες της πάνω κορυφής Α με Math.round για εξάλειψη του τρεμοπαίγματος
  const ax = Math.round(bx + c * Math.cos(radB));
  const ay = Math.round(by - c * Math.sin(radB));

  // --- ΚΑΤΗΓΟΡΙΟΠΟΙΗΣΗ ΤΡΙΓΩΝΟΥ ΩΣ ΠΡΟΣ ΤΙΣ ΠΛΕΥΡΕΣ ---
  const getTriangleType = () => {
    // Στρογγυλοποιούμε για την αποφυγή δεκαδικών αποκλίσεων στο UI
    const lenA = Math.round(baseSide);
    const lenB = Math.round(b);
    const lenC = Math.round(c);

    if (lenA === lenB && lenB === lenC) {
      return { 
        title: 'Ισόπλευρο Τρίγωνο', 
        desc: 'Έχει και τις 3 πλευρές του απόλυτα ίσες μεταξύ τους.', 
        color: 'text-blue-600', 
        bg: 'bg-blue-50/50 border-blue-200' 
      };
    }
    if (lenA === lenB || lenB === lenC || lenA === lenC) {
      return { 
        title: 'Ισοσκελές Τρίγωνο', 
        desc: 'Έχει 2 πλευρές ίσες (και μία διαφορετική).', 
        color: 'text-emerald-600', 
        bg: 'bg-emerald-50/50 border-emerald-200' 
      };
    }
    return { 
      title: 'Σκαληνό Τρίγωνο', 
      desc: 'Όλες οι πλευρές του είναι εντελώς διαφορετικές μεταξύ τους.', 
      color: 'text-purple-600', 
      bg: 'bg-purple-50/50 border-purple-200' 
    };
  };

  const triType = getTriangleType();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🔺 Τρίγωνα ως προς τις Πλευρές - LearnMaths.gr</title>
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
              📖 Θεωρία: Τα Τρίγωνα ως προς τις Πλευρές
            </h2>
            <p className="text-gray-500 text-sm md:text-base">
              Ανάλογα με το μήκος των πλευρών τους, τα τρίγωνα χωρίζονται σε τρεις βασικές κατηγορίες:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Ισόπλευρο */}
              <div className="bg-blue-50/40 p-5 rounded-2xl border border-blue-100 space-y-2">
                <span className="font-black text-blue-600 flex items-center gap-1">▲ Ισόπλευρο Τρίγωνο</span>
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                  Έχει <strong>και τις τρεις πλευρές του ίσες</strong>. Στα ισόπλευρα τρίγωνα, όλες οι γωνίες είναι επίσης ίσες με 60°.
                </p>
              </div>

              {/* Ισοσκελές */}
              <div className="bg-emerald-50/40 p-5 rounded-2xl border border-emerald-100 space-y-2">
                <span className="font-black text-emerald-600 flex items-center gap-1">▲ Ισοσκελές Τρίγωνο</span>
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                  Έχει <strong>δύο πλευρές ίσες</strong> μεταξύ τους και μία διαφορετική (τη βάση). Οι γωνίες της βάσης είναι επίσης ίσες.
                </p>
              </div>

              {/* Σκαληνό */}
              <div className="bg-purple-50/40 p-5 rounded-2xl border border-purple-100 space-y-2">
                <span className="font-black text-purple-600 flex items-center gap-1">▲ Σκαληνό Τρίγωνο</span>
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                  Έχει <strong>και τις τρεις πλευρές του άνισες</strong> (διαφορετικές). Καμία πλευρά και καμία γωνία δεν είναι ίση με την άλλη.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ - ΜΕΓΑΛΑ & ΙΣΟΜΕΡΗ ΠΛΑΙΣΙΑ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ ΜΗΚΟΥΣ ΠΛΕΥΡΩΝ */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[520px] w-full">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  🕹️ Ρύθμισε τις Πλευρές
                </h3>
                <p className="text-gray-500 text-sm">
                  Μετάβαλλε το μήκος της αριστερής και της δεξιάς πλευράς για να αλλάξεις την κατηγορία του τριγώνου!
                </p>
              </div>

              {/* Διπλά Χειριστήρια Sliders */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl w-full space-y-6 shadow-inner my-auto">
                
                {/* 1. Αριστερή Πλευρά ΑΒ */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <span className="font-bold text-slate-700 text-sm md:text-base">Αριστερή Πλευρά (ΑΒ):</span>
                    <span className="font-black text-xl text-cyan-600 tabular-nums">{c} cm</span>
                  </div>
                  <input 
                    type="range" 
                    min="110" 
                    max="280" 
                    value={sidec} 
                    onChange={(e) => setSidec(parseInt(e.target.value))}
                    className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>

                {/* 2. Δεξιά Πλευρά ΑΓ */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <span className="font-bold text-slate-700 text-sm md:text-base">Δεξιά Πλευρά (ΑΓ):</span>
                    <span className="font-black text-xl text-indigo-600 tabular-nums">{b} cm</span>
                  </div>
                  <input 
                    type="range" 
                    min="110" 
                    max="280" 
                    value={sideb} 
                    onChange={(e) => setSideb(parseInt(e.target.value))}
                    className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>

                {/* Σταθερή ένδειξη βάσης */}
                <div className="text-center pt-2 text-xs font-bold text-slate-400 border-t border-slate-200/60">
                  📍 Η κάτω βάση (ΒΓ) παραμένει σταθερή στα <span className="text-slate-600 font-extrabold">{baseSide} cm</span>
                </div>
              </div>

              {/* ΑΥΤΟ ΤΟ ΤΡΙΓΩΝΟ ΕΙΝΑΙ */}
              <div className={`p-6 md:p-8 rounded-2xl border ${triType.bg} transition-all duration-300 w-full space-y-3`}>
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">ΚΑΤΗΓΟΡΙΑ ΤΡΙΓΩΝΟΥ:</span>
                  <div className={`text-2xl md:text-3xl font-black ${triType.color}`}>
                    {triType.title}
                  </div>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">{triType.desc}</p>
                </div>
                
                {/* Εμφάνιση των 3 τρεχουσών τιμών των πλευρών */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-200/50 text-center text-xs font-black text-slate-700">
                  <div className="bg-cyan-50 p-1.5 rounded-lg border border-cyan-100 text-cyan-700">ΑΒ = {c}</div>
                  <div className="bg-slate-100 p-1.5 rounded-lg border text-slate-600">ΒΓ = {baseSide}</div>
                  <div className="bg-indigo-50 p-1.5 rounded-lg border border-indigo-100 text-indigo-700">ΑΓ = {b}</div>
                </div>
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: SVG ΟΠΤΙΚΟΠΟΙΗΣΗ ΤΡΙΓΩΝΟΥ (Widescreen Καμβάς) */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-between min-h-[520px] w-full relative overflow-hidden">
              <div className="w-full"></div>

              {/* SVG 600x340 για άνετο χώρο σχεδίασης, με GPU Hardware Acceleration */}
              <svg 
                viewBox="0 0 600 340" 
                className="w-full h-auto drop-shadow-md my-auto px-2"
                style={{ willChange: 'transform', transform: 'translateZ(0)' }}
              >
                {/* Γέμισμα και περίγραμμα του δυναμικού τριγώνου */}
                <polygon 
                  points={`${ax},${ay} ${bx},${by} ${gx},${gy}`} 
                  className="fill-slate-500/5 stroke-slate-700 stroke-[4] stroke-linejoin-round"
                />

                {/* Έγχρωμη σήμανση πλευράς ΑΒ (Cyan) */}
                <line x1={bx} y1={by} x2={ax} y2={ay} className="stroke-cyan-500 stroke-[4] stroke-linecap-round" />
                
                {/* Έγχρωμη σήμανση πλευράς ΑΓ (Indigo) */}
                <line x1={gx} y1={gy} x2={ax} y2={ay} className="stroke-indigo-500 stroke-[4] stroke-linecap-round" />

                {/* Έγχρωμη σήμανση σταθερής βάσης ΒΓ (Slate) */}
                <line x1={bx} y1={by} x2={gx} y2={gy} className="stroke-slate-800 stroke-[4] stroke-linecap-round" />

                {/* Δυναμικές ετικέτες με τα εκατοστά δίπλα σε κάθε πλευρά */}
                <text x={(bx + ax) / 2 - 25} y={(by + ay) / 2 - 10} className="text-xs font-black fill-cyan-600 bg-white">{c} cm</text>
                <text x={(gx + ax) / 2 + 10} y={(gy + ay) / 2 - 10} className="text-xs font-black fill-indigo-600">{b} cm</text>
                <text x="300" y={by + 20} className="text-xs font-black fill-slate-700 text-anchor-middle">{baseSide} cm</text>

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

              {/* Επεξηγηματικό Box στο κάτω μέρος του καμβά */}
              <div className="w-full flex justify-center text-xs md:text-sm font-bold text-slate-400 pt-4 border-t border-gray-50 mt-auto">
                <span>📏 Σύγκριση πλευρών: ΑΒ={c} | ΒΓ={baseSide} | ΑΓ={b}</span>
              </div>
            </div>

          </div>

        </main>
      </div>

      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Διαδραστική Γεωμετρία Πλευρών.</p>
      </footer>
    </div>
  );
}
