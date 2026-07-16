import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// ΜΕΓΙΣΤΕΣ ΤΙΜΕΣ (Όριο στο 40)
const MAX_NUMERATOR = 40;
const MAX_DENOMINATOR = 40;

export default function KlasmaSeDekadikoPage() {
  const [numerator, setNumerator] = useState(1);
  const [denominator, setDenominator] = useState(4);

  // Διαχείριση πληκτρολόγησης και αλλαγής για τον Αριθμητή
  const handleNumeratorInputChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') {
      setNumerator('');
      return;
    }
    const n = Number(clean);
    if (n > MAX_NUMERATOR) return; // Κλείδωμα στο 40
    setNumerator(n);
  };

  // Διαχείριση πληκτρολόγησης και αλλαγής για τον Παρονομαστή
  const handleDenominatorInputChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') {
      setDenominator('');
      return;
    }
    const n = Number(clean);
    if (n > MAX_DENOMINATOR) return; // Κλείδωμα στο 40
    setDenominator(n);
  };

  // Αλλαγή με κουμπιά (+1 / -1)
  const handleNumeratorChange = (amount) => {
    setNumerator(prev => Math.max(0, Math.min(MAX_NUMERATOR, (Number(prev) || 0) + amount)));
  };

  const handleDenominatorChange = (amount) => {
    setDenominator(prev => Math.max(1, Math.min(MAX_DENOMINATOR, (Number(prev) || 1) + amount)));
  };

  // Γρήγορη μετατροπή σε Κλασματική Μονάδα (Αριθμητής = 1)
  const makeFractionalUnit = () => {
    setNumerator(1);
  };

  // Ασφαλείς τιμές για υπολογισμούς
  const activeNumerator = numerator === '' ? 0 : numerator;
  const activeDenominator = denominator === '' || denominator === 0 ? 1 : denominator;
  const decimalValue = activeNumerator / activeDenominator;

  // Έλεγχος αν ο δεκαδικός είναι περιοδικός (απλός έλεγχος για την εμφάνιση)
  const isPeriodic = () => {
    const str = decimalValue.toString();
    if (str.includes('.')) {
      const decimals = str.split('.')[1];
      return decimals.length > 5; // Αν έχει πολλά δεκαδικά ψηφία, το θεωρούμε περιοδικό για το επίπεδο του δημοτικού
    }
    return false;
  };

  // Σχεδιασμός Πίτσας (SVG)
  const renderPizza = (pizzaIndex = 0) => {
    const slices = [];
    const radius = 65;
    const cx = 80;
    const cy = 80;

    const startingNumeratorForPizza = pizzaIndex * activeDenominator;
    const activeSlicesForThisPizza = Math.max(
      0,
      Math.min(activeDenominator, activeNumerator - startingNumeratorForPizza)
    );

    for (let i = 0; i < activeDenominator; i++) {
      const angleStep = 360 / activeDenominator;
      const startAngle = i * angleStep - 90;
      const endAngle = (i + 1) * angleStep - 90;

      const rad1 = (startAngle * Math.PI) / 180;
      const rad2 = (endAngle * Math.PI) / 180;

      const x1 = cx + radius * Math.cos(rad1);
      const y1 = cy + radius * Math.sin(rad1);
      const x2 = cx + radius * Math.cos(rad2);
      const y2 = cy + radius * Math.sin(rad2);

      const largeArcFlag = angleStep > 180 ? 1 : 0;

      const d = activeDenominator === 1
        ? `M ${cx} ${cy} m -${radius}, 0 a ${radius},${radius} 0 1,0 ${radius * 2},0 a ${radius},${radius} 0 1,0 -${radius * 2},0`
        : `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

      const isFilled = i < activeSlicesForThisPizza;

      slices.push(
        <path
          key={i}
          d={d}
          className={`${
            isFilled 
              ? 'fill-indigo-500 stroke-indigo-700 hover:fill-indigo-400' 
              : 'fill-slate-100 stroke-slate-300 hover:fill-slate-50'
          } transition-colors duration-200 stroke-[1] cursor-pointer`}
        />
      );
    }

    return (
      <svg width="160" height="160" className="drop-shadow-sm">
        {slices}
        <circle cx={cx} cy={cy} r="3" className="fill-slate-800" />
      </svg>
    );
  };

  const neededVisuals = Math.max(1, Math.ceil(activeNumerator / activeDenominator));

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🔢 Κλάσματα & Δεκαδικοί - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* NAVBAR */}
        <nav className="bg-white shadow-md w-full">
          <div className={`${LAYOUT.CONTAINER} py-4 flex justify-between items-center`}>
            <Link href="/st-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight">
              LearnMaths<span className="text-indigo-600">.gr</span>
            </Link>
            <Link href="/st-dimotikou" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-sm">
              🔙 Επιστροφή
            </Link>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-12 space-y-8`}>
          
          {/* SECTION 1: ΘΕΩΡΙΑ */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <span>📖</span> Κλασματική Μονάδα και Δεκαδικά Κλάσματα
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              {/* Κλασματική Μονάδα */}
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-2xl border border-indigo-100 space-y-3">
                
                <h3 className="text-lg font-bold text-indigo-900">Τι είναι η Κλασματική Μονάδα;</h3>
                <p className="text-sm text-indigo-950 leading-relaxed">
                  <strong>Κλασματική μονάδα</strong> λέγεται κάθε κλάσμα που έχει ως <strong>αριθμητή το 1</strong>. Μας δείχνει το <strong>ένα μόνο μέρος</strong> από τα ίσα μέρη στα οποία χωρίσαμε τη μονάδα.
                </p>
                <div className="pt-2 font-mono text-xs text-indigo-800 flex gap-3">
                  <span className="bg-white px-2 py-1 rounded border border-indigo-200">1/2 (μισό)</span>
                  <span className="bg-white px-2 py-1 rounded border border-indigo-200">1/4 (τέταρτο)</span>
                  <span className="bg-white px-2 py-1 rounded border border-indigo-200">1/10 (δέκατο)</span>
                </div>
              </div>

              {/* Μετατροπή σε Δεκαδικό */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-100 space-y-3">
                
                <h3 className="text-lg font-bold text-amber-900">Μετατροπή Κλάσματος σε Δεκαδικό</h3>
                <p className="text-sm text-amber-950 leading-relaxed">
                  Κάθε κλάσμα είναι μια <strong>διαίρεση</strong>! Για να βρούμε τον δεκαδικό αριθμό που κρύβει ένα κλάσμα, κάνουμε τη διαίρεση: <strong className="text-amber-800">Αριθμητής ÷ Παρονομαστής</strong>.
                </p>
                <p className="text-xs text-amber-700 italic font-medium">
                  Παράδειγμα: Το κλάσμα <span className="font-mono font-bold">2/5</span> ισούται με την πράξη <span className="font-mono font-bold">2 ÷ 5 = 0,4</span>.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between gap-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-gray-900">Εργαστήριο Κλασμάτων</h3>
                  <p className="text-gray-500 text-xs">Γράψε τους όρους (Μέγιστο: 40) ή κάνε το κλασματική μονάδα ακαριαία.</p>
                </div>

                {/* ΓΡΗΓΟΡΟ ΚΟΥΜΠΙ ΚΛΑΣΜΑΤΙΚΗΣ ΜΟΝΑΔΑΣ */}
                <button
                  onClick={makeFractionalUnit}
                  className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-black transition uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  ⚡ Μετατροπη σε Κλασματικη Μοναδα (1/{activeDenominator})
                </button>

                {/* ΕΛΕΓΧΟΣ ΑΡΙΘΜΗΤΗ */}
                <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 space-y-3">
                  <span className="text-xs font-black text-indigo-800 uppercase block">Αριθμητης</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleNumeratorChange(-1)}
                      className="w-12 py-2 bg-white hover:bg-gray-100 text-indigo-600 border border-indigo-200 rounded-xl font-black transition shadow-sm"
                    >
                      -
                    </button>
                    <input
                      type="text"
                      value={numerator}
                      onChange={(e) => handleNumeratorInputChange(e.target.value)}
                      className="flex-1 text-center font-mono font-black text-xl text-indigo-600 bg-white border-2 border-indigo-200 rounded-xl p-1.5 focus:border-indigo-500 outline-none shadow-inner"
                    />
                    <button
                      onClick={() => handleNumeratorChange(1)}
                      className="w-12 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black transition shadow-md"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* ΕΛΕΓΧΟΣ ΠΑΡΟΝΟΜΑΣΤΗ */}
                <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100 space-y-3">
                  <span className="text-xs font-black text-amber-800 uppercase block">Παρονομαστης</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDenominatorChange(-1)}
                      className="w-12 py-2 bg-white hover:bg-gray-100 text-amber-600 border border-amber-200 rounded-xl font-black transition shadow-sm"
                    >
                      -
                    </button>
                    <input
                      type="text"
                      value={denominator}
                      onChange={(e) => handleDenominatorInputChange(e.target.value)}
                      className="flex-1 text-center font-mono font-black text-xl text-amber-600 bg-white border-2 border-amber-200 rounded-xl p-1.5 focus:border-amber-500 outline-none shadow-inner"
                    />
                    <button
                      onClick={() => handleDenominatorChange(1)}
                      className="w-12 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-black transition shadow-md"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Επεξήγηση Κλασματικής Μονάδας */}
              <div className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-1.5 ${
                activeNumerator === 1 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                <h4 className="font-bold uppercase tracking-wider">
                  {activeNumerator === 1 ? '✨ Εισαι σε Κλασματικη Μοναδα!' : 'ℹ️ Πληροφορια'}
                </h4>
                <p>
                  {activeNumerator === 1 
                    ? `Το κλάσμα 1/${activeDenominator} εκφράζει ακριβώς το 1 από τα ${activeDenominator} ίσα κομμάτια.` 
                    : `Για να γίνει κλασματική μονάδα, ο αριθμητής πρέπει να γίνει 1 (τώρα είναι ${activeNumerator}).`}
                </p>
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΟΠΤΙΚΟΠΟΙΗΣΗ & ΜΕΤΑΤΡΟΠΗ */}
            <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[550px] space-y-8">
              
              {/* ΜΑΘΗΜΑΤΙΚΗ ΜΕΤΑΤΡΟΠΗ */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-slate-50 p-6 rounded-2xl border border-slate-100">
                {/* Κλάσμα */}
                <div className="flex flex-col items-center font-mono select-none">
                  <span className="text-4xl font-black text-indigo-600">{activeNumerator}</span>
                  <div className="w-12 h-1 bg-slate-800 rounded-full my-1.5" />
                  <span className="text-4xl font-black text-amber-600">{activeDenominator}</span>
                </div>

                {/* Πράξη */}
                <div className="text-center space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Η Πραξη</span>
                  <div className="font-mono text-xl font-bold text-slate-700">
                    {activeNumerator} ÷ {activeDenominator}
                  </div>
                </div>

                {/* Δεκαδικός */}
                <div className="text-center space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Δεκαδικος Αριθμος</span>
                  <div className="font-mono text-3xl font-black text-emerald-600">
                    {isPeriodic() ? `${decimalValue.toFixed(4)}...` : decimalValue}
                  </div>
                  {isPeriodic() && (
                    <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider block">⚠️ Περιοδικος αριθμος</span>
                  )}
                </div>
              </div>

              {/* ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ 1: ΑΡΙΘΜΗΤΙΚΗ ΓΡΑΜΜΗ (NUMBER LINE) */}
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">📍 Θεση στην Αριθμητικη Γραμμη</span>
                <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200 relative pt-12">
                  
                  {/* Η Αριθμητική Γραμμή */}
                  <div className="relative w-full h-1 bg-slate-300 rounded-full">
                    
                    {/* Υποδιαιρέσεις & Ακέραιοι (0, 1, 2, 3, 4) */}
                    {[0, 1, 2, 3, 4].map((num) => {
                      const percentage = (num / 4) * 100;
                      return (
                        <div key={num} className="absolute flex flex-col items-center" style={{ left: `${percentage}%`, transform: 'translateX(-50%)' }}>
                          {/* Κάθετη γραμμή ακέραιου */}
                          <div className="w-0.5 h-4 bg-slate-800 -top-2 relative" />
                          <span className="text-xs font-mono font-black text-slate-700 -top-1 relative">{num}</span>
                        </div>
                      );
                    })}

                    {/* Ο Δείκτης (Marker) του Δεκαδικού */}
                    {decimalValue <= 4 && (
                      <div 
                        className="absolute flex flex-col items-center -top-8 transition-all duration-500 ease-out"
                        style={{ left: `${(decimalValue / 4) * 100}%`, transform: 'translateX(-50%)' }}
                      >
                        {/* Φούσκα με την τιμή */}
                        <div className="bg-emerald-600 text-white font-mono text-xs font-black px-2 py-1 rounded-lg shadow-md mb-1 relative after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-emerald-600">
                          {isPeriodic() ? decimalValue.toFixed(2) : decimalValue}
                        </div>
                        {/* Καρφίτσα / Πινέζα */}
                        <div className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow animate-bounce" />
                      </div>
                    )}
                  </div>
                  
                  <div className="text-[10px] text-slate-400 italic text-center mt-6">
                    {decimalValue > 4 
                      ? "Ο αριθμός είναι μεγαλύτερος από το 4 και βρίσκεται εκτός ορίων της γραμμής!" 
                      : `Η καρφίτσα δείχνει ακριβώς πού βρίσκεται ο αριθμός ${isPeriodic() ? decimalValue.toFixed(3) : decimalValue} ανάμεσα στους ακεραίους.`}
                  </div>
                </div>
              </div>

              {/* ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ 2: ΚΥΚΛΙΚΟ ΜΟΝΤΕΛΟ (ΠΙΤΣΑ) */}
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">🍕 Οπτικοποιηση Μοναδων (Κυκλικη)</span>
                <div className="flex flex-wrap items-center justify-center gap-6 py-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 max-h-[220px] overflow-y-auto">
                  {Array.from({ length: neededVisuals }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center space-y-1.5 scale-[0.9]">
                      {renderPizza(i)}
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Μοναδα {i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Κλάσματα και Δεκαδικοί - ΣΤ' Δημοτικού.</p>
      </footer>
    </div>
  );
}
