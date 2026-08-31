import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { LAYOUT } from '../../shared/layout-config';

// ΜΕΓΙΣΤΕΣ ΤΙΜΕΣ (Όριο στο 40)
const MAX_NUMERATOR = 40;
const MAX_DENOMINATOR = 40;

const PRESETS = [
  { num: 1, den: 2, label: "1/2 ＝ 0,5 (Μισό)" },
  { num: 1, den: 4, label: "1/4 ＝ 0,25 (Τέταρτο)" },
  { num: 3, den: 4, label: "3/4 ＝ 0,75" },
  { num: 2, den: 5, label: "2/5 ＝ 0,4" },
  { num: 1, den: 3, label: "1/3 ＝ 0,333... (Περιοδικός)" },
  { num: 5, den: 2, label: "5/2 ＝ 2,5" }
];

export default function KlasmaSeDekadikoPage() {
  const [numerator, setNumerator] = useState(1);
  const [denominator, setDenominator] = useState(4);

  // Διαχείριση πληκτρολόγησης για τον Αριθμητή
  const handleNumeratorInputChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') {
      setNumerator('');
      return;
    }
    const n = Number(clean);
    if (n > MAX_NUMERATOR) return;
    setNumerator(n);
  };

  // Διαχείριση πληκτρολόγησης για τον Παρονομαστή
  const handleDenominatorInputChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') {
      setDenominator('');
      return;
    }
    const n = Number(clean);
    if (n > MAX_DENOMINATOR) return;
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

  // Έλεγχος αν ο δεκαδικός είναι περιοδικός
  const isPeriodic = () => {
    const str = decimalValue.toString();
    if (str.includes('.')) {
      const decimals = str.split('.')[1];
      return decimals.length > 5;
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
          onClick={() => {
            const clickedNumber = pizzaIndex * activeDenominator + i + 1;
            setNumerator(clickedNumber);
          }}
          className={`${
            isFilled 
              ? 'fill-indigo-500 stroke-indigo-700 hover:fill-indigo-400' 
              : 'fill-slate-100 stroke-slate-300 hover:fill-slate-200'
          } transition-colors duration-200 stroke-[1.5] cursor-pointer`}
          title={`Κομμάτι ${i + 1} από ${activeDenominator}`}
        />
      );
    }

    return (
      <svg width="160" height="160" className="drop-shadow-sm shrink-0">
        {slices}
        <circle cx={cx} cy={cy} r="3" className="fill-slate-800" />
      </svg>
    );
  };

  const neededVisuals = Math.max(1, Math.ceil(activeNumerator / activeDenominator));

  return (
    <Layout
      title="🔢 24. Κλασματική Μονάδα και Μετατροπή Κλάσματος σε Δεκαδικό - LearnMaths.gr"
      description="Μάθε τι είναι η Κλασματική Μονάδα (1/ν) και πώς κάθε κλάσμα μετατρέπεται σε δεκαδικό αριθμό εκτελώντας τη διαίρεση: Αριθμητής ÷ Παρονομαστής για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/24-klasma-se-dekadiko-ask"
          className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-black transition shadow-sm flex items-center gap-1.5 shrink-0"
        >
          <span>🎯</span>
          <span>Ασκήσεις</span>
        </Link>
      }
    >
      <div className="space-y-8 md:space-y-10 py-6 md:py-10">

        {/* HERO BANNER WITH PROMO CALLOUT CARD */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 rounded-3xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-white/20 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                  🎓 ΣΤ' Δημοτικου
                </span>
                <span className="bg-amber-400 text-slate-900 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                  Ενοτητα 24
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                24. Κλασματική Μονάδα και Μετατροπή Κλάσματος σε Δεκαδικό
              </h1>
              <p className="text-blue-100 text-sm md:text-base leading-relaxed max-w-3xl">
                Μάθε τι είναι η <strong>Κλασματική Μονάδα (1/ν)</strong> και πώς κάθε κλάσμα μετατρέπεται σε <strong>δεκαδικό αριθμό</strong> εκτελώντας τη διαίρεση: <strong>Αριθμητής ÷ Παρονομαστής</strong>!
              </p>
            </div>

            {/* CALLOUT PROMO CARD */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 shadow-inner">
              <span className="text-3xl">🚀</span>
              <h3 className="font-black text-lg text-amber-300">Ώρα για Εξάσκηση!</h3>
              <p className="text-xs text-blue-50">Δοκίμασε τις 8 διαδραστικές ασκήσεις μετατροπής κλασμάτων σε δεκαδικούς!</p>
              <Link
                href="/st-dimotikou/24-klasma-se-dekadiko-ask"
                className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-2.5 px-4 rounded-xl shadow-md transition transform hover:scale-105 text-sm"
              >
                🎯 Μετάβαση στις Ασκήσεις
              </Link>
            </div>
          </div>
        </div>

        {/* THEORY CARDS (3 COLS) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50/80 border border-blue-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-2.5">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                1
              </div>
              <h3 className="text-lg font-black text-slate-900">Τι είναι η Κλασματική Μονάδα;</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Είναι κάθε κλάσμα που έχει ως <strong>αριθμητή το 1</strong> (1/ν). Μας δείχνει το <strong>ένα μόνο μέρος</strong> από τα ίσα μέρη στα οποία χωρίσαμε τη μονάδα.
              </p>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-blue-100 text-xs text-slate-700 font-mono text-center flex flex-wrap justify-center gap-1.5 font-bold">
              <span className="bg-blue-50 px-2 py-0.5 rounded border border-blue-200">1/2 (μισό)</span>
              <span className="bg-blue-50 px-2 py-0.5 rounded border border-blue-200">1/4 (τέταρτο)</span>
              <span className="bg-blue-50 px-2 py-0.5 rounded border border-blue-200">1/10 (δέκατο)</span>
            </div>
          </div>

          <div className="bg-amber-50/80 border border-amber-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-2.5">
              <div className="w-10 h-10 bg-amber-500 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                2
              </div>
              <h3 className="text-lg font-black text-slate-900">Κλάσμα ➔ Δεκαδικός</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Κάθε κλάσμα είναι μια <strong>διαίρεση</strong>! Διαιρούμε τον αριθμητή με τον παρονομαστή: <strong>Αριθμητής ÷ Παρονομαστής</strong>.
              </p>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-amber-100 text-xs text-slate-700 font-mono text-center font-bold">
              <span className="bg-amber-50 px-2.5 py-1 rounded-xl text-amber-900 inline-block">
                2/5 ＝ 2 ÷ 5 ＝ <strong className="text-amber-700 font-black">0,4</strong>
              </span>
            </div>
          </div>

          <div className="bg-emerald-50/80 border border-emerald-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-2.5">
              <div className="w-10 h-10 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                3
              </div>
              <h3 className="text-lg font-black text-slate-900">Περιοδικοί Αριθμοί</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Όταν η διαίρεση δεν τελειώνει και ένα ψηφίο (ή ομάδα ψηφίων) επαναλαμβάνεται επ' άπειρον, ο δεκαδικός ονομάζεται <strong>περιοδικός</strong>.
              </p>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-emerald-100 text-xs text-slate-700 font-mono text-center font-bold">
              <span className="bg-emerald-50 px-2.5 py-1 rounded-xl text-emerald-900 inline-block">
                1/3 ＝ 1 ÷ 3 ＝ <strong className="text-emerald-700 font-black">0,333...</strong>
              </span>
            </div>
          </div>
        </div>

        {/* INTERACTIVE PLAYGROUND */}
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🕹️</span> Διαδραστικό Εργαστήριο Μετατροπής σε Δεκαδικό
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm">
                Όρισε τον αριθμητή και τον παρονομαστή και παρατήρησε τη θέση του δεκαδικού πάνω στην αριθμογραμμή και στο κυκλικό μοντέλο!
              </p>
            </div>
          </div>

          {/* MAIN INTERACTIVE GRID (4 COLS LEFT / 8 COLS RIGHT) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
            
            {/* LEFT: CONTROLS & PRESETS (4 COLS) */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
              <div className="space-y-4">
                
                {/* ΚΟΥΜΠΙ ΚΛΑΣΜΑΤΙΚΗΣ ΜΟΝΑΔΑΣ */}
                <button
                  type="button"
                  onClick={makeFractionalUnit}
                  className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-black transition uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs"
                >
                  ⚡ Κλασματικη Μοναδα (1/{activeDenominator})
                </button>

                <div className="space-y-3">
                  {/* ΕΛΕΓΧΟΣ ΑΡΙΘΜΗΤΗ */}
                  <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-indigo-200 shadow-xs space-y-2">
                    <span className="text-xs font-black text-indigo-800 uppercase block">
                      Αριθμητης (Διαιρετεος):
                    </span>
                    <div className="flex items-center gap-1.5 sm:gap-2 w-full">
                      <button
                        type="button"
                        onClick={() => handleNumeratorChange(-1)}
                        className="w-9 sm:w-11 h-10 sm:h-11 shrink-0 bg-slate-100 hover:bg-slate-200 text-indigo-700 border border-slate-200 rounded-xl font-black transition shadow-xs text-lg flex items-center justify-center"
                      >
                        -
                      </button>
                      <input
                        type="text"
                        value={numerator}
                        onChange={(e) => handleNumeratorInputChange(e.target.value)}
                        className="w-full min-w-0 flex-1 text-center font-mono font-black text-xl sm:text-2xl text-indigo-600 bg-indigo-50/50 border-2 border-indigo-200 rounded-xl p-1.5 focus:border-indigo-500 outline-none shadow-inner"
                      />
                      <button
                        type="button"
                        onClick={() => handleNumeratorChange(1)}
                        className="w-9 sm:w-11 h-10 sm:h-11 shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black transition shadow-md text-lg flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* ΕΛΕΓΧΟΣ ΠΑΡΟΝΟΜΑΣΤΗ */}
                  <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-amber-200 shadow-xs space-y-2">
                    <span className="text-xs font-black text-amber-800 uppercase block">
                      Παρονομαστης (Διαιρετης):
                    </span>
                    <div className="flex items-center gap-1.5 sm:gap-2 w-full">
                      <button
                        type="button"
                        onClick={() => handleDenominatorChange(-1)}
                        className="w-9 sm:w-11 h-10 sm:h-11 shrink-0 bg-slate-100 hover:bg-slate-200 text-amber-700 border border-slate-200 rounded-xl font-black transition shadow-xs text-lg flex items-center justify-center"
                      >
                        -
                      </button>
                      <input
                        type="text"
                        value={denominator}
                        onChange={(e) => handleDenominatorInputChange(e.target.value)}
                        className="w-full min-w-0 flex-1 text-center font-mono font-black text-xl sm:text-2xl text-amber-600 bg-amber-50/50 border-2 border-amber-200 rounded-xl p-1.5 focus:border-amber-500 outline-none shadow-inner"
                      />
                      <button
                        type="button"
                        onClick={() => handleDenominatorChange(1)}
                        className="w-9 sm:w-11 h-10 sm:h-11 shrink-0 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-black transition shadow-md text-lg flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* PRESET EXAMPLES */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                    Ετοιμα Παραδειγματα:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setNumerator(p.num);
                          setDenominator(p.den);
                        }}
                        className={`py-2 px-1 rounded-xl border font-mono font-black text-xs transition-all text-center ${
                          activeNumerator === p.num && activeDenominator === p.den
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ΚΑΤΑΣΤΑΣΗ ΚΛΑΣΜΑΤΙΚΗΣ ΜΟΝΑΔΑΣ */}
                <div className={`p-3.5 rounded-2xl border text-xs leading-relaxed space-y-1 ${
                  activeNumerator === 1 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                    : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}>
                  <span className="font-bold uppercase tracking-wider block text-[10px]">
                    {activeNumerator === 1 ? '✨ Κλασματικη Μοναδα' : 'ℹ️ Κατασταση'}
                  </span>
                  <p>
                    {activeNumerator === 1 
                      ? `Το κλάσμα 1/${activeDenominator} εκφράζει το 1 από τα ${activeDenominator} ίσα μέρη.` 
                      : `Για να γίνει κλασματική μονάδα, ο αριθμητής πρέπει να είναι 1.`}
                  </p>
                </div>

              </div>

              <div className="text-[11px] text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                💡 Κάνε τη διαίρεση: <strong>{activeNumerator} ÷ {activeDenominator}</strong> για να βρεις τον δεκαδικό!
              </div>
            </div>

            {/* RIGHT: VISUALIZATION & NUMBER LINE (8 COLS) */}
            <div className="lg:col-span-8 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[460px] sm:min-h-[520px] space-y-6">
              
              {/* 1. ΜΑΘΗΜΑΤΙΚΗ ΜΕΤΑΤΡΟΠΗ */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
                {/* Κλάσμα */}
                <div className="flex flex-col items-center font-mono select-none">
                  <span className="text-3xl sm:text-4xl font-black text-indigo-600">{activeNumerator}</span>
                  <div className="w-12 h-1 bg-slate-800 rounded-full my-1" />
                  <span className="text-3xl sm:text-4xl font-black text-amber-600">{activeDenominator}</span>
                </div>

                {/* Πράξη */}
                <div className="text-center space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Πραξη Διαιρεσης:
                  </span>
                  <div className="font-mono text-lg sm:text-xl font-bold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 inline-block shadow-2xs">
                    {activeNumerator} ÷ {activeDenominator}
                  </div>
                </div>

                {/* Δεκαδικός */}
                <div className="text-center space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Δεκαδικος Αριθμος:
                  </span>
                  <div className="font-mono text-2xl sm:text-3xl font-black text-emerald-600">
                    {isPeriodic() ? `${decimalValue.toFixed(4).replace('.', ',')}...` : decimalValue.toString().replace('.', ',')}
                  </div>
                  {isPeriodic() && (
                    <span className="text-[10px] text-rose-600 font-bold uppercase tracking-wider block">
                      ⚠️ Περιοδικος Αριθμος
                    </span>
                  )}
                </div>
              </div>

              {/* 2. ΑΡΙΘΜΗΤΙΚΗ ΓΡΑΜΜΗ (NUMBER LINE) */}
              <div className="space-y-3 bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200">
                <span className="text-xs font-black text-slate-500 uppercase tracking-wider block text-center">
                  📍 Θεση του Δεκαδικου στην Αριθμογραμμη:
                </span>
                
                <div className="relative w-full pt-10 pb-4 px-4 overflow-x-auto">
                  {/* Η Αριθμητική Γραμμή */}
                  <div className="relative w-full min-w-[240px] h-1.5 bg-slate-300 rounded-full">
                    
                    {/* Υποδιαιρέσεις & Ακέραιοι (0, 1, 2, 3, 4) */}
                    {[0, 1, 2, 3, 4].map((num) => {
                      const percentage = (num / 4) * 100;
                      return (
                        <div key={num} className="absolute flex flex-col items-center" style={{ left: `${percentage}%`, transform: 'translateX(-50%)' }}>
                          <div className="w-0.5 h-4 bg-slate-800 -top-2 relative" />
                          <span className="text-xs font-mono font-black text-slate-700 top-1 relative">{num}</span>
                        </div>
                      );
                    })}

                    {/* Ο Δείκτης (Marker) του Δεκαδικού */}
                    {decimalValue <= 4 && (
                      <div 
                        className="absolute flex flex-col items-center -top-8 transition-all duration-500 ease-out z-10"
                        style={{ left: `${(decimalValue / 4) * 100}%`, transform: 'translateX(-50%)' }}
                      >
                        <div className="bg-emerald-600 text-white font-mono text-xs font-black px-2 py-0.5 rounded-lg shadow-md mb-0.5 whitespace-nowrap">
                          {isPeriodic() ? decimalValue.toFixed(3).replace('.', ',') : decimalValue.toString().replace('.', ',')}
                        </div>
                        <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-md animate-bounce" />
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 italic text-center">
                  {decimalValue > 4 
                    ? "Ο αριθμός είναι μεγαλύτερος από το 4 και βρίσκεται εκτός των ορίων της γραμμής!" 
                    : `Η καρφίτσα δείχνει ακριβώς πού τοποθετείται ο δεκαδικός ${isPeriodic() ? decimalValue.toFixed(3).replace('.', ',') : decimalValue.toString().replace('.', ',')} ανάμεσα στους ακεραίους.`}
                </p>
              </div>

              {/* 3. ΚΥΚΛΙΚΟ ΜΟΝΤΕΛΟ (ΠΙΤΣΑ) */}
              <div className="space-y-2">
                <span className="text-xs font-black text-slate-500 uppercase tracking-wider block text-center">
                  🍕 Οπτικοποιηση Μοναδων (Κυκλικο Μοντελο):
                </span>
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 p-4 bg-slate-50/70 rounded-2xl border border-slate-200 max-h-[220px] overflow-y-auto shadow-inner">
                  {Array.from({ length: neededVisuals }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center space-y-1 scale-[0.85]">
                      {renderPizza(i)}
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Μοναδα {i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. FINAL RESULT SUMMARY BANNER */}
              <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-700 text-white p-4 sm:p-5 rounded-2xl text-center shadow-lg font-mono space-y-1">
                <span className="text-xs font-sans uppercase tracking-wider block text-blue-200 font-bold">
                  Συμπερασμα:
                </span>
                <div className="text-base sm:text-lg md:text-xl font-black tracking-wide flex flex-wrap justify-center items-center gap-1.5 sm:gap-2">
                  <span>{activeNumerator}/{activeDenominator} ＝ {activeNumerator} ÷ {activeDenominator} ＝</span>
                  <span className="text-amber-300">
                    {isPeriodic() ? `${decimalValue.toFixed(4).replace('.', ',')}...` : decimalValue.toString().replace('.', ',')}
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* BOTTOM CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-lg text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
            <p className="text-gray-800 text-sm md:text-base">
              Έμαθες να μετατρέπεις κλάσματα σε δεκαδικούς αριθμούς; Δοκίμασε τις διαδραστικές ασκήσεις!
            </p>
          </div>
          <Link
            href="/st-dimotikou/24-klasma-se-dekadiko-ask"
            className="bg-gray-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-xl transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            Ξεκίνα τις Ασκήσεις ➔
          </Link>
        </div>

      </div>
    </Layout>
  );
}
