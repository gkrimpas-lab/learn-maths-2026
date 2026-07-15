import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// ΜΕΓΙΣΤΕΣ ΤΙΜΕΣ (Όριο στο 40)
const MAX_NUMERATOR = 40;
const MAX_DENOMINATOR = 40;

export default function KlasmaPage() {
  const [numerator, setNumerator] = useState(3);
  const [denominator, setDenominator] = useState(4);

  // Διαχείριση πληκτρολόγησης και αλλαγής για τον Αριθμητή
  const handleNumeratorInputChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') {
      setNumerator('');
      return;
    }
    const n = Number(clean);
    // Κλείδωμα: Αν η νέα τιμή ξεπερνά το 40, αγνοούμε το πάτημα
    if (n > MAX_NUMERATOR) return;
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
    // Κλείδωμα: Αν η νέα τιμή ξεπερνά το 40, αγνοούμε το πάτημα
    if (n > MAX_DENOMINATOR) return;
    setDenominator(n);
  };

  // Αλλαγή αριθμητή με κουμπιά (+1 / -1)
  const handleNumeratorChange = (amount) => {
    setNumerator(prev => Math.max(0, Math.min(MAX_NUMERATOR, (Number(prev) || 0) + amount)));
  };

  // Αλλαγή παρονομαστή με κουμπιά (+1 / -1)
  const handleDenominatorChange = (amount) => {
    setDenominator(prev => Math.max(1, Math.min(MAX_DENOMINATOR, (Number(prev) || 1) + amount)));
  };

  // Ασφαλείς τιμές για τους υπολογισμούς των γραφικών
  const activeNumerator = numerator === '' ? 0 : numerator;
  const activeDenominator = denominator === '' || denominator === 0 ? 1 : denominator;
  const fractionValue = activeNumerator / activeDenominator;

  // Δημιουργία των κομματιών της πίτσας (κύκλος SVG)
  const renderPizza = (pizzaIndex = 0) => {
    const slices = [];
    const radius = 70;
    const cx = 90;
    const cy = 90;

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
              ? 'fill-amber-400 stroke-amber-600 hover:fill-amber-300' 
              : 'fill-slate-100 stroke-slate-300 hover:fill-slate-50'
          } transition-colors duration-200 stroke-[1] cursor-pointer`}
        />
      );
    }

    return (
      <svg width="180" height="180" className="drop-shadow-md">
        {slices}
        <circle cx={cx} cy={cy} r="3" className="fill-slate-700" />
      </svg>
    );
  };

  // Δημιουργία των κομματιών της σοκολάτας (ορθογώνιο)
  const renderChocolate = (chocoIndex = 0) => {
    const blocks = [];
    const startingNumeratorForChoco = chocoIndex * activeDenominator;
    const activeBlocksForThisChoco = Math.max(
      0,
      Math.min(activeDenominator, activeNumerator - startingNumeratorForChoco)
    );

    for (let i = 0; i < activeDenominator; i++) {
      const isFilled = i < activeBlocksForThisChoco;
      blocks.push(
        <div
          key={i}
          className={`flex-1 h-12 border border-amber-800/10 first:rounded-l-lg last:rounded-r-lg transition-all duration-300 ${
            isFilled
              ? 'bg-amber-700 shadow-inner scale-[0.98]'
              : 'bg-amber-100/40'
          }`}
        />
      );
    }

    return (
      <div className="w-full bg-amber-900/10 p-2 rounded-2xl border border-amber-900/20 flex gap-0.5 shadow-sm overflow-hidden">
        {blocks}
      </div>
    );
  };

  const neededVisuals = Math.max(1, Math.ceil(activeNumerator / activeDenominator));

  const getFractionTypeMessage = () => {
    if (activeNumerator === 0) {
      return {
        title: "Μηδενικό Κλάσμα",
        desc: "Όταν ο αριθμητής είναι 0, το κλάσμα ισούται με 0.",
        color: "text-slate-500 bg-slate-50 border-slate-200"
      };
    }
    if (activeNumerator === activeDenominator) {
      return {
        title: "Ίσο με τη Μονάδα (1 ολόκληρο)",
        desc: "Ο αριθμητής είναι ίσος με τον παρονομαστή. Έχουμε πάρει όλα τα κομμάτια!",
        color: "text-emerald-800 bg-emerald-50 border-emerald-200"
      };
    }
    if (activeNumerator < activeDenominator) {
      return {
        title: "Γνήσιο Κλάσμα",
        desc: "Ο αριθμητής είναι μικρότερος από τον παρονομαστή. Είναι μικρότερο από 1 ολόκληρο.",
        color: "text-blue-800 bg-blue-50 border-blue-200"
      };
    }
    if (activeNumerator > activeDenominator) {
      const isInteger = activeNumerator % activeDenominator === 0;
      return {
        title: isInteger ? "Ακέραιος Αριθμός" : "Καταχρηστικό (Μη Γνήσιο) Κλάσμα",
        desc: isInteger 
          ? `Ο αριθμητής διαιρείται ακριβώς με τον παρονομαστή και μας δίνει ακριβώς ${activeNumerator / activeDenominator} ολόκληρες μονάδες!`
          : "Ο αριθμητής είναι μεγαλύτερος από τον παρονομαστή. Χρειαζόμαστε πάνω από 1 ολόκληρη μονάδα!",
        color: "text-purple-800 bg-purple-50 border-purple-200"
      };
    }
  };

  const typeInfo = getFractionTypeMessage();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🍕 Η Έννοια του Κλάσματος - LearnMaths.gr</title>
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
              <span>📖</span> Τι είναι το Κλάσμα;
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4 text-gray-600 text-sm md:text-base leading-relaxed">
                <p>
                  <strong>Κλάσμα</strong> είναι ένας αριθμός που μας δείχνει ένα ή περισσότερα ίσα μέρη στα οποία έχουμε χωρίσει μια ακέραια μονάδα (π.χ. μια πίτσα, μια σοκολάτα, ένα τετράγωνο).
                </p>
                <p>
                  Αποτελείται από τρία πολύ βασικά στοιχεία:
                </p>
                <ul className="space-y-3 pl-2">
                  <li className="flex items-start gap-2">
                    <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-0.5 rounded-md mt-1">1</span>
                    <div>
                      <strong>Αριθμητής (πάνω):</strong> Δείχνει πόσα από τα ίσα μέρη <em>πήραμε</em> ή <em>χρωματίσαμε</em>.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-indigo-100 text-indigo-600 text-xs font-bold px-2 py-0.5 rounded-md mt-1">2</span>
                    <div>
                      <strong>Γραμμή Κλάσματος (μέση):</strong> Συμβολίζει την πράξη της <strong>διαίρεσης</strong>.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-emerald-100 text-emerald-600 text-xs font-bold px-2 py-0.5 rounded-md mt-1">3</span>
                    <div>
                      <strong>Παρονομαστής (κάτω):</strong> Δείχνει σε πόσα ίσα μέρη <em>χωρίσαμε</em> την αρχική μονάδα.
                    </div>
                  </li>
                </ul>
              </div>

              {/* Οπτική Επεξήγηση Όρων */}
              <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center space-y-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ονομασια Ορων</span>
                <div className="flex flex-col items-center font-mono select-none">
                  <span className="text-5xl font-black text-blue-400">Αριθμητής</span>
                  <div className="w-48 h-1.5 bg-white rounded-full my-3" />
                  <span className="text-5xl font-black text-emerald-400">Παρονομαστής</span>
                </div>
                <p className="text-[11px] text-center text-slate-300 italic">
                  «Χωρίζω σε όσα μέρη λέει ο παρονομαστής και παίρνω όσα λέει ο αριθμητής!»
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ ΜΕ ΠΛΗΚΤΡΟΛΟΓΗΣΗ */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between gap-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-gray-900">Φτιάξε το Κλάσμα σου</h3>
                  <p className="text-gray-500 text-xs">Γράψε απευθείας ή χρησιμοποίησε τα κουμπιά (Όριο: 40).</p>
                </div>

                {/* ΕΛΕΓΧΟΣ ΑΡΙΘΜΗΤΗ */}
                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 space-y-3">
                  <span className="text-xs font-black text-blue-800 uppercase block">Αριθμητης (Πάνω)</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleNumeratorChange(-1)}
                      className="w-12 py-2 bg-white hover:bg-gray-100 text-blue-600 border border-blue-200 rounded-xl font-black transition shadow-sm text-lg"
                    >
                      -
                    </button>
                    <input
                      type="text"
                      value={numerator}
                      onChange={(e) => handleNumeratorInputChange(e.target.value)}
                      className="flex-1 text-center font-mono font-black text-xl text-blue-600 bg-white border-2 border-blue-200 rounded-xl p-1.5 focus:border-blue-500 outline-none shadow-inner"
                    />
                    <button
                      onClick={() => handleNumeratorChange(1)}
                      className="w-12 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black transition shadow-md text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* ΕΛΕΓΧΟΣ ΠΑΡΟΝΟΜΑΣΤΗ */}
                <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 space-y-3">
                  <span className="text-xs font-black text-emerald-800 uppercase block">Παρονομαστης (Κατω)</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDenominatorChange(-1)}
                      className="w-12 py-2 bg-white hover:bg-gray-100 text-emerald-600 border border-emerald-200 rounded-xl font-black transition shadow-sm text-lg"
                    >
                      -
                    </button>
                    <input
                      type="text"
                      value={denominator}
                      onChange={(e) => handleDenominatorInputChange(e.target.value)}
                      className="flex-1 text-center font-mono font-black text-xl text-emerald-600 bg-white border-2 border-emerald-200 rounded-xl p-1.5 focus:border-emerald-500 outline-none shadow-inner"
                    />
                    <button
                      onClick={() => handleDenominatorChange(1)}
                      className="w-12 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black transition shadow-md text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Επεξηγηματικό Box Τύπου Κλάσματος */}
              <div className={`p-4 rounded-2xl border ${typeInfo.color} space-y-1 transition-all`}>
                <span className="text-xs font-black uppercase tracking-wider">Κατηγορια:</span>
                <h4 className="text-sm font-bold">{typeInfo.title}</h4>
                <p className="text-xs leading-relaxed opacity-90">{typeInfo.desc}</p>
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΟΠΤΙΚΟΠΟΙΗΣΗ */}
            <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[550px] space-y-8">
              
              {/* ΤΟ ΚΛΑΣΜΑ ΣΕ ΜΕΓΑΛΟ ΜΕΓΕΘΟΣ */}
              <div className="flex items-center justify-center py-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center font-mono select-none">
                    <span className="text-5xl md:text-6xl font-black text-blue-600">{activeNumerator}</span>
                    <div className="w-16 md:w-20 h-1.5 bg-slate-800 rounded-full my-2" />
                    <span className="text-5xl md:text-6xl font-black text-emerald-600">{activeDenominator}</span>
                  </div>
                  
                  <span className="text-3xl font-light text-slate-300">=</span>

                  <div className="text-center font-mono">
                    <span className="text-[10px] font-sans text-slate-400 block font-bold uppercase tracking-wider">Δεκαδικη Αξια</span>
                    <span className="text-3xl md:text-4xl font-black text-slate-800">
                      {Number(fractionValue.toFixed(3))}
                    </span>
                  </div>
                </div>
              </div>

              {/* ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ 1: ΠΙΤΣΑ */}
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">🍕 Μοντελο Πιτσας (Κυκλικο)</span>
                <div className="flex flex-wrap items-center justify-center gap-6 py-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 max-h-[300px] overflow-y-auto">
                  {Array.from({ length: neededVisuals }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center space-y-2 scale-[0.9]">
                      {renderPizza(i)}
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Μοναδα {i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ 2: ΣΟΚΟΛΑΤΑ */}
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">🍫 Μοντελο Σοκολατας (Γραμμικο)</span>
                <div className="space-y-4 p-5 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 max-h-[250px] overflow-y-auto">
                  {Array.from({ length: neededVisuals }).map((_, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                        <span>Σοκολάτα {i + 1}</span>
                        <span>{Math.max(0, Math.min(activeDenominator, activeNumerator - i * activeDenominator))} / {activeDenominator}</span>
                      </div>
                      {renderChocolate(i)}
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
        <p>© 2026 LearnMaths.gr. Η Έννοια του Κλάσματος - ΣΤ' Δημοτικού.</p>
      </footer>
    </div>
  );
}
