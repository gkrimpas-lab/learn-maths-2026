import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// ΜΕΓΙΣΤΕΣ ΤΙΜΕΣ (Όριο στο 40)
const MAX_NUMERATOR = 40;
const MAX_DENOMINATOR = 40;

const PRESETS = [
  { num: 3, den: 4, label: "3/4 (Γνήσιο)" },
  { num: 4, den: 4, label: "4/4 (Μονάδα)" },
  { num: 5, den: 4, label: "5/4 (Καταχρηστικό)" },
  { num: 6, den: 2, label: "6/2 (Ακέραιος = 3)" },
  { num: 2, den: 3, label: "2/3 (Γνήσιο)" },
  { num: 7, den: 5, label: "7/5 (Καταχρηστικό)" }
];

export default function KlasmaPage() {
  const [numerator, setNumerator] = useState(3);
  const [denominator, setDenominator] = useState(4);
  const [activeModel, setActiveModel] = useState('pizza'); // 'pizza' ή 'chocolate'

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

  // Αλλαγή αριθμητή με κουμπιά (+1 / -1)
  const handleNumeratorChange = (amount) => {
    setNumerator(prev => Math.max(0, Math.min(MAX_NUMERATOR, (Number(prev) || 0) + amount)));
  };

  // Αλλαγή παρονομαστή με κουμπιά (+1 / -1)
  const handleDenominatorChange = (amount) => {
    setDenominator(prev => Math.max(1, Math.min(MAX_DENOMINATOR, (Number(prev) || 1) + amount)));
  };

  // Ασφαλείς τιμές για υπολογισμούς
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
          onClick={() => {
            const clickedNumber = pizzaIndex * activeDenominator + i + 1;
            setNumerator(clickedNumber);
          }}
          className={`${
            isFilled 
              ? 'fill-amber-400 stroke-amber-600 hover:fill-amber-300' 
              : 'fill-slate-100 stroke-slate-300 hover:fill-slate-200'
          } transition-colors duration-200 stroke-[1.5] cursor-pointer`}
          title={`Κομμάτι ${i + 1} από ${activeDenominator}`}
        />
      );
    }

    return (
      <svg width="180" height="180" className="drop-shadow-md">
        {slices}
        <circle cx={cx} cy={cy} r="3.5" className="fill-slate-700" />
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
          onClick={() => {
            const clickedNumber = chocoIndex * activeDenominator + i + 1;
            setNumerator(clickedNumber);
          }}
          className={`flex-1 h-12 border border-amber-800/20 first:rounded-l-lg last:rounded-r-lg cursor-pointer transition-all duration-300 ${
            isFilled
              ? 'bg-amber-700 shadow-inner scale-[0.98]'
              : 'bg-amber-100/50 hover:bg-amber-200/50'
          }`}
          title={`Κομμάτι ${i + 1} από ${activeDenominator}`}
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
        desc: "Όταν ο αριθμητής είναι 0, το κλάσμα ισούται με 0 (δεν πήραμε κανένα μέρος).",
        color: "text-slate-700 bg-slate-100 border-slate-300"
      };
    }
    if (activeNumerator === activeDenominator) {
      return {
        title: "Ίσο με τη Μονάδα (1 ολόκληρο)",
        desc: "Ο αριθμητής είναι ίσος με τον παρονομαστή. Έχουμε πάρει όλα τα κομμάτια!",
        color: "text-emerald-800 bg-emerald-50 border-emerald-300"
      };
    }
    if (activeNumerator < activeDenominator) {
      return {
        title: "Γνήσιο Κλάσμα (< 1)",
        desc: "Ο αριθμητής είναι μικρότερος από τον παρονομαστή. Αντιπροσωπεύει ποσότητα μικρότερη από 1 ολόκληρη μονάδα.",
        color: "text-blue-800 bg-blue-50 border-blue-300"
      };
    }
    if (activeNumerator > activeDenominator) {
      const isInteger = activeNumerator % activeDenominator === 0;
      return {
        title: isInteger ? `Ακέραιος Αριθμός (= ${activeNumerator / activeDenominator})` : "Καταχρηστικό (Μη Γνήσιο) Κλάσμα (> 1)",
        desc: isInteger 
          ? `Ο αριθμητής διαιρείται ακριβώς με τον παρονομαστή και μας δίνει ακριβώς ${activeNumerator / activeDenominator} ολόκληρες μονάδες!`
          : "Ο αριθμητής είναι μεγαλύτερος από τον παρονομαστή. Χρειαζόμαστε πάνω από 1 ολόκληρη μονάδα!",
        color: "text-purple-800 bg-purple-50 border-purple-300"
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
        {/* 1. STICKY NAVBAR */}
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 w-full">
          <div className={`${LAYOUT.CONTAINER} py-3.5 flex justify-between items-center`}>
            <Link href="/st-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight flex items-center">
              <span>LearnMaths</span><span className="text-indigo-600">.gr</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/st-dimotikou/23-klasma-ask"
                className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-4 py-2 rounded-xl text-xs md:text-sm font-black transition shadow-sm flex items-center gap-1.5"
              >
                <span>🎯</span> Ασκήσεις
              </Link>
              <Link
                href="/st-dimotikou"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition"
              >
                🔙 ΣΤ' Δημοτικού
              </Link>
            </div>
          </div>
        </nav>

        {/* 2. MAIN LESSON CONTAINER */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-8 md:py-12 space-y-10`}>

          {/* HERO BANNER WITH PROMO CALLOUT CARD */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 rounded-3xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-white/20 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                    🎓 ΣΤ' Δημοτικού
                  </span>
                  <span className="bg-amber-400 text-slate-900 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                    Ενότητα 23
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                  23. Η Έννοια του Κλάσματος (Αριθμητής και Παρονομαστής)
                </h1>
                <p className="text-blue-100 text-sm md:text-base leading-relaxed max-w-3xl">
                  Μάθε πώς χωρίζουμε μια μονάδα σε <strong>ίσα μέρη</strong>, τι σημαίνουν ο <strong>Αριθμητής</strong> και ο <strong>Παρονομαστής</strong> και πώς διακρίνουμε τα <strong>Γνήσια</strong>, <strong>Καταχρηστικά</strong> και <strong>Ίσα με τη Μονάδα</strong> κλάσματα!
                </p>
              </div>

              {/* CALLOUT PROMO CARD */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 shadow-inner">
                <span className="text-3xl">🚀</span>
                <h3 className="font-black text-lg text-amber-300">Ώρα για Εξάσκηση!</h3>
                <p className="text-xs text-blue-50">Δοκίμασε τις 8 διαδραστικές ασκήσεις στην έννοια του κλάσματος!</p>
                <Link
                  href="/st-dimotikou/23-klasma-ask"
                  className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-2.5 px-4 rounded-xl shadow-md transition transform hover:scale-105 text-sm"
                >
                  🎯 Μετάβαση στις Ασκήσεις
                </Link>
              </div>
            </div>
          </div>

          {/* 3. THEORY CARDS (3 COLS) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50/80 border border-blue-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                  1
                </div>
                <h3 className="text-lg font-black text-slate-900">Αριθμητής (Πάνω)</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Δείχνει <strong>πόσα από τα ίσα μέρη</strong> πήραμε, χρωματίσαμε ή εξετάζουμε.
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-blue-100 text-xs text-slate-700 font-mono text-center flex items-center justify-center gap-2">
                <span className="bg-blue-50 border border-blue-200 px-3 py-1 rounded-xl">
                  Στο <strong className="text-blue-700 font-black">3/4</strong> ➔ πήραμε τα <strong>3</strong> κομμάτια
                </span>
              </div>
            </div>

            <div className="bg-emerald-50/80 border border-emerald-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                  2
                </div>
                <h3 className="text-lg font-black text-slate-900">Παρονομαστής (Κάτω)</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Δείχνει <strong>σε πόσα ίσα μέρη</strong> χωρίσαμε την αρχική ακέραια μονάδα (δεν μπορεί να είναι 0).
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-emerald-100 text-xs text-slate-700 font-mono text-center flex items-center justify-center gap-2">
                <span className="bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl text-emerald-900">
                  Στο <strong className="text-emerald-700 font-black">3/4</strong> ➔ χωρίσαμε σε <strong>4</strong> ίσα μέρη
                </span>
              </div>
            </div>

            <div className="bg-purple-50/80 border border-purple-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 bg-purple-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                  3
                </div>
                <h3 className="text-lg font-black text-slate-900">Γραμμή Κλάσματος</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Συμβολίζει πάντα την πράξη της <strong>διαίρεσης</strong>: Αριθμητής : Παρονομαστής ＝ Δεκαδική Αξία.
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-purple-100 text-xs text-slate-700 font-mono text-center font-bold">
                <span className="bg-purple-50 border border-purple-200 px-3 py-1 rounded-xl text-purple-900 inline-block">
                  3/4 ＝ 3 : 4 ＝ <strong className="text-purple-700 font-black">0,75</strong>
                </span>
              </div>
            </div>
          </div>

          {/* 4. INTERACTIVE PLAYGROUND */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
              <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <span>🕹️</span> Διαδραστικό Εργαστήριο Κλασμάτων
                </h2>
                <p className="text-gray-500 text-sm">
                  Άλλαξε τον αριθμητή και τον παρονομαστή ή κάνε κλικ στα κομμάτια για να δεις την άμεση οπτική αναπαράσταση!
                </p>
              </div>

              {/* MODEL TOGGLE */}
              <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner gap-1">
                <button
                  type="button"
                  onClick={() => setActiveModel('pizza')}
                  className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black transition-all ${
                    activeModel === 'pizza'
                      ? 'bg-amber-500 text-white shadow-sm scale-105'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🍕 Μοντέλο Πίτσας (Κυκλικό)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModel('chocolate')}
                  className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black transition-all ${
                    activeModel === 'chocolate'
                      ? 'bg-amber-800 text-white shadow-sm scale-105'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🍫 Μοντέλο Σοκολάτας (Γραμμικό)
                </button>
              </div>
            </div>

            {/* MAIN INTERACTIVE GRID (4 COLS LEFT / 8 COLS RIGHT) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* LEFT: CONTROLS & PRESETS (4 COLS) */}
              <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
                <div className="space-y-4">
                  
                  <div className="space-y-3">
                    <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                      Ρυθμιση Κλασματος (Όριο: {MAX_NUMERATOR}):
                    </span>

                    {/* ΕΛΕΓΧΟΣ ΑΡΙΘΜΗΤΗ */}
                    <div className="bg-white p-3.5 rounded-2xl border border-blue-200 shadow-xs space-y-2">
                      <span className="text-xs font-black text-blue-800 uppercase block">
                        Αριθμητης (Πανω):
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleNumeratorChange(-1)}
                          className="w-11 py-2 bg-slate-100 hover:bg-slate-200 text-blue-700 border border-slate-200 rounded-xl font-black transition shadow-xs text-lg"
                        >
                          -
                        </button>
                        <input
                          type="text"
                          value={numerator}
                          onChange={(e) => handleNumeratorInputChange(e.target.value)}
                          className="flex-1 text-center font-mono font-black text-2xl text-blue-600 bg-blue-50/50 border-2 border-blue-200 rounded-xl p-1.5 focus:border-blue-500 outline-none shadow-inner"
                        />
                        <button
                          type="button"
                          onClick={() => handleNumeratorChange(1)}
                          className="w-11 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black transition shadow-md text-lg"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* ΕΛΕΓΧΟΣ ΠΑΡΟΝΟΜΑΣΤΗ */}
                    <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 shadow-xs space-y-2">
                      <span className="text-xs font-black text-emerald-800 uppercase block">
                        Παρονομαστης (Κατω):
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleDenominatorChange(-1)}
                          className="w-11 py-2 bg-slate-100 hover:bg-slate-200 text-emerald-700 border border-slate-200 rounded-xl font-black transition shadow-xs text-lg"
                        >
                          -
                        </button>
                        <input
                          type="text"
                          value={denominator}
                          onChange={(e) => handleDenominatorInputChange(e.target.value)}
                          className="flex-1 text-center font-mono font-black text-2xl text-emerald-600 bg-emerald-50/50 border-2 border-emerald-200 rounded-xl p-1.5 focus:border-emerald-500 outline-none shadow-inner"
                        />
                        <button
                          type="button"
                          onClick={() => handleDenominatorChange(1)}
                          className="w-11 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black transition shadow-md text-lg"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* PRESET BUTTONS */}
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

                  {/* BOX ΚΑΤΗΓΟΡΙΑΣ ΚΛΑΣΜΑΤΟΣ */}
                  <div className={`p-4 rounded-2xl border ${typeInfo.color} space-y-1 transition-all`}>
                    <span className="text-[10px] font-black uppercase tracking-wider block opacity-75">
                      Ειδος Κλασματος:
                    </span>
                    <h4 className="text-sm font-black">{typeInfo.title}</h4>
                    <p className="text-xs leading-relaxed opacity-90">{typeInfo.desc}</p>
                  </div>

                </div>

                <div className="text-[11px] text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                  💡 <strong>Tip:</strong> Κάνε κλικ πάνω στα κομμάτια για να ορίσεις απευθείας τον αριθμητή!
                </div>
              </div>

              {/* RIGHT: VISUALIZATION (8 COLS) */}
              <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[520px] space-y-6">
                
                {/* 1. HEADER STATUS */}
                <div className="w-full flex flex-col sm:flex-row justify-around items-center bg-slate-50 p-5 rounded-2xl border border-slate-200 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center font-mono select-none">
                      <span className="text-5xl font-black text-blue-600">{activeNumerator}</span>
                      <div className="w-16 h-1.5 bg-slate-800 rounded-full my-1" />
                      <span className="text-5xl font-black text-emerald-600">{activeDenominator}</span>
                    </div>
                  </div>

                  <span className="text-3xl font-light text-slate-300">＝</span>

                  <div className="text-center font-mono bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-sans text-slate-400 block font-bold uppercase tracking-wider">
                      Δεκαδικη Αξια:
                    </span>
                    <span className="text-3xl font-black text-slate-800">
                      {Number(fractionValue.toFixed(3))}
                    </span>
                  </div>
                </div>

                {/* 2. ΟΠΤΙΚΟ ΜΟΝΤΕΛΟ */}
                <div className="w-full space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
                      {activeModel === 'pizza' ? '🍕 Κυκλικο Μοντελο (Πιτσα)' : '🍫 Γραμμικο Μοντελο (Σοκολατα)'}:
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      {neededVisuals} {neededVisuals === 1 ? 'μονάδα' : 'μονάδες'}
                    </span>
                  </div>

                  {activeModel === 'pizza' ? (
                    <div className="flex flex-wrap items-center justify-center gap-6 p-6 bg-slate-50/70 rounded-3xl border border-slate-200 max-h-[340px] overflow-y-auto shadow-inner">
                      {Array.from({ length: neededVisuals }).map((_, i) => (
                        <div key={i} className="flex flex-col items-center space-y-2">
                          {renderPizza(i)}
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Μονάδα {i + 1}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4 p-6 bg-slate-50/70 rounded-3xl border border-slate-200 max-h-[340px] overflow-y-auto shadow-inner">
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
                  )}
                </div>

                {/* 3. FINAL SUMMARY BANNER */}
                <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-700 text-white p-5 rounded-2xl text-center shadow-lg font-mono space-y-1">
                  <span className="text-xs font-sans uppercase tracking-wider block text-blue-200 font-bold">
                    Συμπερασμα:
                  </span>
                  <div className="text-lg md:text-xl font-black tracking-wide">
                    Το κλάσμα <span className="text-amber-300">{activeNumerator}/{activeDenominator}</span> αντιπροσωπεύει <strong>{activeNumerator}</strong> από τα <strong>{activeDenominator}</strong> ίσα μέρη.
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* 5. BOTTOM CALLOUT BANNER */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-lg text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <h3 className="text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
              <p className="text-gray-800 text-sm md:text-base">
                Κατάλαβες πώς λειτουργούν ο αριθμητής και ο παρονομαστής; Δοκίμασε τις διαδραστικές ασκήσεις!
              </p>
            </div>
            <Link
              href="/st-dimotikou/23-klasma-ask"
              className="bg-gray-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-xl transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
            >
              Ξεκίνα τις Ασκήσεις ➔
            </Link>
          </div>

        </main>
      </div>

      {/* 6. GLOBAL FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© {new Date().getFullYear()} LearnMaths.gr. Σχεδιασμένο για τη ΣΤ' Δημοτικού.</p>
      </footer>
    </div>
  );
}
