import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { LAYOUT } from '../../shared/layout-config';

// ΕΞΩΤΕΡΙΚΕΣ ΜΕΤΑΒΛΗΤΕΣ ΡΥΘΜΙΣΗΣ
const MAX_LIMIT = 100;

const PRESETS = [
  { nA: 2, dA: 7, nB: 3, dB: 7, label: "2/7 + 3/7 (Ομώνυμα)" },
  { nA: 1, dA: 3, nB: 1, dB: 6, label: "1/3 + 1/6 (Ετερώνυμα ➔ 3/6 ➔ 1/2)" },
  { nA: 1, dA: 2, nB: 2, dB: 3, label: "1/2 + 2/3 (Άθροισμα > 1)" },
  { nA: 3, dA: 4, nB: 1, dB: 8, label: "3/4 + 1/8 (Ε.Κ.Π. = 8)" }
];

// Βοηθητική συνάρτηση για εύρεση Μέγιστου Κοινού Διαιρέτη (ΜΚΔ)
const findGCD = (a, b) => {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
};

// Βοηθητική συνάρτηση για εύρεση Ελάχιστου Κοινού Πολλαπλάσιου (ΕΚΠ)
const findLCM = (a, b) => {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / findGCD(a, b);
};

export default function ProsthesiKlasmatonPage() {
  // Κλάσμα Α (Αριστερά)
  const [numA, setNumA] = useState(1);
  const [denA, setDenA] = useState(3);

  // Κλάσμα Β (Δεξιά)
  const [numB, setNumB] = useState(1);
  const [denB, setDenB] = useState(6);

  // Ασφαλής έλεγχος εισαγωγής κειμένου
  const handleNumAChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') { setNumA(''); return; }
    const n = Number(clean);
    if (n <= MAX_LIMIT) setNumA(n);
  };

  const handleDenAChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') { setDenA(''); return; }
    const n = Number(clean);
    if (n > 0 && n <= MAX_LIMIT) setDenA(n);
  };

  const handleNumBChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') { setNumB(''); return; }
    const n = Number(clean);
    if (n <= MAX_LIMIT) setNumB(n);
  };

  const handleDenBChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') { setDenB(''); return; }
    const n = Number(clean);
    if (n > 0 && n <= MAX_LIMIT) setDenB(n);
  };

  // Αυξομείωση με κουμπιά για Κλάσμα Α
  const adjustNumA = (amount) => {
    setNumA(prev => Math.max(0, Math.min(MAX_LIMIT, (Number(prev) || 0) + amount)));
  };
  const adjustDenA = (amount) => {
    setDenA(prev => Math.max(1, Math.min(MAX_LIMIT, (Number(prev) || 1) + amount)));
  };

  // Αυξομείωση με κουμπιά για Κλάσμα Β
  const adjustNumB = (amount) => {
    setNumB(prev => Math.max(0, Math.min(MAX_LIMIT, (Number(prev) || 0) + amount)));
  };
  const adjustDenB = (amount) => {
    setDenB(prev => Math.max(1, Math.min(MAX_LIMIT, (Number(prev) || 1) + amount)));
  };

  // Ενεργές τιμές για υπολογισμούς
  const activeNumA = numA === '' ? 0 : Number(numA);
  const activeDenA = denA === '' || denA === 0 ? 1 : Number(denA);
  const activeNumB = numB === '' ? 0 : Number(numB);
  const activeDenB = denB === '' || denB === 0 ? 1 : Number(denB);

  // Υπολογισμός Ε.Κ.Π. και ομώνυμων κλασμάτων
  const lcm = findLCM(activeDenA, activeDenB) || 1;
  const multiplierA = lcm / activeDenA;
  const multiplierB = lcm / activeDenB;

  const equivalentNumA = activeNumA * multiplierA;
  const equivalentNumB = activeNumB * multiplierB;

  // Το άθροισμα εκφρασμένο με βάση το Ε.Κ.Π.
  const lcmResultNum = equivalentNumA + equivalentNumB;
  const lcmResultDen = lcm;

  // Απλοποίηση Αποτελέσματος
  const gcdResult = findGCD(lcmResultNum, lcmResultDen);
  const simplifiedNum = lcmResultNum / gcdResult;
  const simplifiedDen = lcmResultDen / gcdResult;
  const isSimplified = gcdResult > 1;

  const isOriginallyOmonima = activeDenA === activeDenB;

  // Σχεδίαση όλων των κυκλικών διαγραμμάτων
  const renderFractionVisual = (num, den, fillColor = 'fill-blue-500', strokeColor = 'stroke-blue-700') => {
    const totalPizzasNeeded = Math.max(1, Math.ceil(num / den));
    const pizzas = [];

    const radius = 45;
    const cx = 55;
    const cy = 55;

    for (let p = 0; p < totalPizzasNeeded; p++) {
      const slices = [];
      const remainingNumForThisPizza = Math.max(0, Math.min(den, num - p * den));

      for (let i = 0; i < den; i++) {
        const angleStep = 360 / den;
        const startAngle = i * angleStep - 90;
        const endAngle = (i + 1) * angleStep - 90;

        const rad1 = (startAngle * Math.PI) / 180;
        const rad2 = (endAngle * Math.PI) / 180;

        const x1 = cx + radius * Math.cos(rad1);
        const y1 = cy + radius * Math.sin(rad1);
        const x2 = cx + radius * Math.cos(rad2);
        const y2 = cy + radius * Math.sin(rad2);

        const largeArcFlag = angleStep > 180 ? 1 : 0;

        const d = den === 1
          ? `M ${cx} ${cy} m -${radius}, 0 a ${radius},${radius} 0 1,0 ${radius * 2},0 a ${radius},${radius} 0 1,0 -${radius * 2},0`
          : `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

        const isFilled = i < remainingNumForThisPizza;

        slices.push(
          <path
            key={i}
            d={d}
            className={`${
              isFilled ? `${fillColor} ${strokeColor}` : 'fill-slate-100 stroke-slate-300'
            } transition-colors duration-200 stroke-[0.8]`}
          />
        );
      }

      pizzas.push(
        <div key={p} className="flex flex-col items-center space-y-1">
          <svg width="105" height="105" className="drop-shadow-sm overflow-visible">
            {slices}
            <circle cx={cx} cy={cy} r="2.5" className="fill-slate-800" />
          </svg>
          <span className="text-[9px] font-bold text-slate-400 uppercase">
            Μοναδα {p + 1}
          </span>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap justify-center gap-2 max-w-[240px] p-2.5 bg-white rounded-2xl border border-slate-200 shadow-inner max-h-[360px] overflow-y-auto">
        {pizzas}
      </div>
    );
  };

  // Επεξηγηματικό παιδαγωγικό μήνυμα βήμα-βήμα
  const getStepByStepExplanation = () => {
    if (isOriginallyOmonima) {
      return (
        <div className="space-y-2">
          <span className="font-black text-blue-800 uppercase block text-[11px]">
            🔵 Ομώνυμα Κλάσματα (Ίδιος Παρονομαστής: {activeDenA}):
          </span>
          <p className="text-slate-600">
            Προσθέτουμε μόνο τους αριθμητές και διατηρούμε τον ίδιο παρονομαστή:
          </p>
          <div className="bg-white p-3 rounded-xl border border-blue-100 font-mono text-xs md:text-sm">
            <span className="text-blue-600">{activeNumA}</span>/{activeDenA} ＋ <span className="text-orange-600">{activeNumB}</span>/{activeDenB} ＝ ({activeNumA} ＋ {activeNumB})/{activeDenA} ＝ <strong className="text-emerald-700">{lcmResultNum}/{activeDenA}</strong>
          </div>
          {isSimplified && (
            <p className="text-emerald-700 text-xs font-bold pt-1 border-t border-slate-100">
              ✨ Απλοποιώντας με το {gcdResult}, το τελικό ανάγωγο κλάσμα γίνεται: {simplifiedNum}/{simplifiedDen}
            </p>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-2.5">
        <span className="font-black text-indigo-800 uppercase block text-[11px]">
          🟣 Ετερωνυμα Κλασματα ({activeDenA} ≠ {activeDenB}):
        </span>
        <div className="text-slate-600 space-y-1.5 text-xs md:text-sm">
          <p>
            1. Βρίσκουμε το <strong>Ε.Κ.Π.</strong>({activeDenA}, {activeDenB}) ＝ <strong>{lcm}</strong>.
          </p>
          <p>
            2. Βάζουμε «καπελάκια» και τα κάνουμε ομώνυμα:
            <br />
            • 1ο Κλάσμα (×{multiplierA}): ({activeNumA} × {multiplierA})/({activeDenA} × {multiplierA}) ＝ <strong className="text-blue-700">{equivalentNumA}/{lcm}</strong>
            <br />
            • 2ο Κλάσμα (×{multiplierB}): ({activeNumB} × {multiplierB})/({activeDenB} × {multiplierB}) ＝ <strong className="text-orange-700">{equivalentNumB}/{lcm}</strong>
          </p>
          <p>
            3. Προσθέτουμε τους νέους αριθμητές:
          </p>
        </div>
        <div className="bg-white p-3 rounded-xl border border-indigo-100 font-mono text-xs md:text-sm">
          {equivalentNumA}/{lcm} ＋ {equivalentNumB}/{lcm} ＝ ({equivalentNumA} ＋ {equivalentNumB})/{lcm} ＝ <strong className="text-emerald-700">{lcmResultNum}/{lcm}</strong>
        </div>
        {isSimplified && (
          <p className="text-emerald-700 text-xs font-bold pt-1 border-t border-slate-100">
            ✨ Απλοποιώντας με το {gcdResult}, το τελικό ανάγωγο κλάσμα γίνεται: {simplifiedNum}/{simplifiedDen}
          </p>
        )}
      </div>
    );
  };

  const actionButton = (
    <Link
      href="/st-dimotikou/27-prosthesi-klasmaton-ask"
      className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-black transition shadow-sm flex items-center gap-1.5 shrink-0"
    >
      <span>🎯</span>
      <span>Ασκήσεις</span>
    </Link>
  );

  return (
    <Layout
      title="➕ 27. Πρόσθεση Κλασμάτων - LearnMaths.gr"
      description="Μάθε πώς προσθέτουμε ομώνυμα και ετερώνυμα κλάσματα με το Ε.Κ.Π. και πώς απλοποιούμε το αποτέλεσμα για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      actionButton={actionButton}
      showAds={true}
    >
      <div className="py-6 md:py-10 space-y-8 md:space-y-10">

        {/* HERO BANNER WITH PROMO CALLOUT CARD */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 rounded-3xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-white/20 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                  🎓 ΣΤ Δημοτικου
                </span>
                <span className="bg-amber-400 text-slate-900 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                  Ενοτητα 27
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
                27. Πρόσθεση Κλασμάτων (Ομώνυμα και Ετερώνυμα)
              </h1>
              <p className="text-blue-100 text-sm md:text-base leading-relaxed max-w-3xl">
                Μάθε πώς προσθέτουμε <strong>ομώνυμα κλάσματα</strong> προσθέτοντας μόνο τους αριθμητές, και πώς κάνουμε τα <strong>ετερώνυμα ομώνυμα με το Ε.Κ.Π.</strong> πριν τα προσθέσουμε!
              </p>
            </div>

            {/* CALLOUT PROMO CARD */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 sm:p-6 rounded-2xl flex flex-col items-center text-center space-y-3 shadow-inner">
              <span className="text-3xl">🚀</span>
              <h3 className="font-black text-lg text-amber-300">Ώρα για Εξάσκηση!</h3>
              <p className="text-xs text-blue-50">Δοκίμασε τις 8 διαδραστικές ασκήσεις πρόσθεσης κλασμάτων!</p>
              <Link
                href="/st-dimotikou/27-prosthesi-klasmaton-ask"
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
              <h3 className="text-lg font-black text-slate-900">1. Ομώνυμα Κλάσματα</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Όταν οι παρονομαστές είναι ίδιοι, <strong>προσθέτουμε μόνο τους αριθμητές</strong> και αφήνουμε τον ίδιο παρονομαστή.
              </p>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-blue-100 text-xs text-slate-700 font-mono text-center font-bold">
              <span className="bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-xl text-blue-900">
                2/7 ＋ 3/7 ＝ <strong className="text-blue-700 font-black">5/7</strong>
              </span>
            </div>
          </div>

          <div className="bg-indigo-50/80 border border-indigo-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-2.5">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                2
              </div>
              <h3 className="text-lg font-black text-slate-900">2. Ετερώνυμα Κλάσματα</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Βρίσκουμε το <strong>Ε.Κ.Π.</strong> των παρονομαστών, βάζουμε καπελάκια για να τα κάνουμε ομώνυμα και μετά προσθέτουμε!
              </p>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-indigo-100 text-xs text-slate-700 font-mono text-center font-bold">
              <span className="bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-xl text-indigo-900">
                1/3 (2/6) ＋ 1/6 ＝ <strong className="text-indigo-700 font-black">3/6</strong>
              </span>
            </div>
          </div>

          <div className="bg-emerald-50/80 border border-emerald-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-2.5">
              <div className="w-10 h-10 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                3
              </div>
              <h3 className="text-lg font-black text-slate-900">3. Απλοποίηση Αποτελέσματος</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Αν το τελικό κλάσμα δεν είναι ανάγωγο, διαιρούμε με τον <strong>Μ.Κ.Δ.</strong> για να το γράψουμε στην απλούστερη μορφή του.
              </p>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-emerald-100 text-xs text-slate-700 font-mono text-center font-bold">
              <span className="bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl text-emerald-900">
                3/6 (: 3) ➔ <strong className="text-emerald-700 font-black">1/2</strong> (Ανάγωγο)
              </span>
            </div>
          </div>
        </div>

        {/* 4. INTERACTIVE PLAYGROUND */}
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🕹️</span> Διαδραστικό Εργαστήριο Πρόσθεσης Κλασμάτων
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                Ρύθμισε τα δύο κλάσματα και δες βήμα-βήμα τη μετατροπή σε ομώνυμα, το άθροισμα και την απλοποίηση!
              </p>
            </div>
          </div>

          {/* MAIN INTERACTIVE GRID (4 COLS LEFT / 8 COLS RIGHT) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* LEFT: CONTROLS & PRESETS (4 COLS) */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
              <div className="space-y-4">
                
                {/* ΧΕΙΡΙΣΤΗΡΙΟ ΚΛΑΣΜΑΤΟΣ Α (ΜΠΛΕ) */}
                <div className="bg-blue-50/50 p-3.5 sm:p-4 rounded-2xl border border-blue-200 space-y-3">
                  <span className="text-xs font-black text-blue-800 uppercase block tracking-wider">
                    🔵 Κλασμα 1 (Αριστερο)
                  </span>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 text-center">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Αριθμητης</span>
                      <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustNumA(-1); }} 
                          className="w-7 sm:w-8 h-8 shrink-0 font-black text-blue-600 hover:bg-slate-50 rounded-lg flex items-center justify-center active:scale-95"
                        >
                          -
                        </button>
                        <input
                          id="add-num-a"
                          name="addNumA"
                          autoComplete="off"
                          type="text"
                          inputMode="numeric"
                          value={numA}
                          onChange={(e) => handleNumAChange(e.target.value)}
                          className="w-full min-w-0 text-center font-mono font-black text-base outline-none text-blue-600 px-0.5"
                        />
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustNumA(1); }} 
                          className="w-7 sm:w-8 h-8 shrink-0 font-black text-blue-600 hover:bg-slate-50 rounded-lg flex items-center justify-center active:scale-95"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Παρονομαστης</span>
                      <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustDenA(-1); }} 
                          className="w-7 sm:w-8 h-8 shrink-0 font-black text-blue-600 hover:bg-slate-50 rounded-lg flex items-center justify-center active:scale-95"
                        >
                          -
                        </button>
                        <input
                          id="add-den-a"
                          name="addDenA"
                          autoComplete="off"
                          type="text"
                          inputMode="numeric"
                          value={denA}
                          onChange={(e) => handleDenAChange(e.target.value)}
                          className="w-full min-w-0 text-center font-mono font-black text-base outline-none text-blue-600 px-0.5"
                        />
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustDenA(1); }} 
                          className="w-7 sm:w-8 h-8 shrink-0 font-black text-blue-600 hover:bg-slate-50 rounded-lg flex items-center justify-center active:scale-95"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ΧΕΙΡΙΣΤΗΡΙΟ ΚΛΑΣΜΑΤΟΣ Β (ΠΟΡΤΟΚΑΛΙ) */}
                <div className="bg-orange-50/50 p-3.5 sm:p-4 rounded-2xl border border-orange-200 space-y-3">
                  <span className="text-xs font-black text-orange-800 uppercase block tracking-wider">
                    🟠 Κλασμα 2 (Δεξι)
                  </span>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 text-center">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Αριθμητης</span>
                      <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustNumB(-1); }} 
                          className="w-7 sm:w-8 h-8 shrink-0 font-black text-orange-600 hover:bg-slate-50 rounded-lg flex items-center justify-center active:scale-95"
                        >
                          -
                        </button>
                        <input
                          id="add-num-b"
                          name="addNumB"
                          autoComplete="off"
                          type="text"
                          inputMode="numeric"
                          value={numB}
                          onChange={(e) => handleNumBChange(e.target.value)}
                          className="w-full min-w-0 text-center font-mono font-black text-base outline-none text-orange-600 px-0.5"
                        />
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustNumB(1); }} 
                          className="w-7 sm:w-8 h-8 shrink-0 font-black text-orange-600 hover:bg-slate-50 rounded-lg flex items-center justify-center active:scale-95"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Παρονομαστης</span>
                      <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustDenB(-1); }} 
                          className="w-7 sm:w-8 h-8 shrink-0 font-black text-orange-600 hover:bg-slate-50 rounded-lg flex items-center justify-center active:scale-95"
                        >
                          -
                        </button>
                        <input
                          id="add-den-b"
                          name="addDenB"
                          autoComplete="off"
                          type="text"
                          inputMode="numeric"
                          value={denB}
                          onChange={(e) => handleDenBChange(e.target.value)}
                          className="w-full min-w-0 text-center font-mono font-black text-base outline-none text-orange-600 px-0.5"
                        />
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustDenB(1); }} 
                          className="w-7 sm:w-8 h-8 shrink-0 font-black text-orange-600 hover:bg-slate-50 rounded-lg flex items-center justify-center active:scale-95"
                        >
                          +
                        </button>
                      </div>
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
                          setNumA(p.nA);
                          setDenA(p.dA);
                          setNumB(p.nB);
                          setDenB(p.dB);
                        }}
                        className="py-2 px-1 rounded-xl border font-mono font-black text-xs transition-all text-center bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ΒΗΜΑ-ΒΗΜΑ ΕΠΕΞΗΓΗΣΗ */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium shadow-xs">
                  {getStepByStepExplanation()}
                </div>

              </div>

              <div className="text-[11px] text-slate-500 bg-white p-3 rounded-xl border border-slate-200 mt-3">
                💡 <strong>Θυμήσου:</strong> Ποτέ δεν προσθέτουμε τους παρονομαστές μεταξύ τους!
              </div>
            </div>

            {/* RIGHT: VISUALIZATION & PIZZAS (8 COLS) */}
            <div className="lg:col-span-8 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[520px] space-y-6">
              
              {/* 1. ΜΑΘΗΜΑΤΙΚΗ ΠΑΡΟΥΣΙΑΣΗ ΤΗΣ ΠΡΟΣΘΕΣΗΣ */}
              <div className="flex items-center justify-center p-4 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200 overflow-x-auto">
                <div className="flex items-center gap-2.5 sm:gap-4 font-mono font-black text-lg sm:text-xl md:text-3xl select-none flex-wrap justify-center">
                  
                  {/* 1ο Κλάσμα */}
                  <div className="flex flex-col items-center">
                    <span className="text-blue-600">{activeNumA}</span>
                    <div className="w-8 sm:w-10 h-1 bg-slate-800 my-1 rounded-full" />
                    <span className="text-blue-600">{activeDenA}</span>
                  </div>

                  {/* Σύμβολο + */}
                  <div className="text-slate-400 font-light">＋</div>

                  {/* 2ο Κλάσμα */}
                  <div className="flex flex-col items-center">
                    <span className="text-orange-600">{activeNumB}</span>
                    <div className="w-8 sm:w-10 h-1 bg-slate-800 my-1 rounded-full" />
                    <span className="text-orange-600">{activeDenB}</span>
                  </div>

                  {/* Ενδιάμεσο βήμα ομωνύμων (αν ήταν ετερώνυμα) */}
                  {!isOriginallyOmonima && (
                    <>
                      <div className="text-slate-400 font-light">＝</div>

                      <div className="flex flex-col items-center">
                        <span className="text-blue-600/80">{equivalentNumA}</span>
                        <div className="w-8 sm:w-10 h-0.5 bg-slate-400 my-1 rounded-full" />
                        <span className="text-slate-700">{lcm}</span>
                      </div>

                      <div className="text-slate-400 font-light">＋</div>

                      <div className="flex flex-col items-center">
                        <span className="text-orange-600/80">{equivalentNumB}</span>
                        <div className="w-8 sm:w-10 h-0.5 bg-slate-400 my-1 rounded-full" />
                        <span className="text-slate-700">{lcm}</span>
                      </div>
                    </>
                  )}

                  <div className="text-slate-500 font-bold">＝</div>

                  {/* Άθροισμα (με βάση το ΕΚΠ) */}
                  <div className="flex flex-col items-center bg-emerald-50 px-2.5 sm:px-3 py-1.5 rounded-xl border border-emerald-200">
                    <span className="text-emerald-700">{lcmResultNum}</span>
                    <div className="w-8 sm:w-10 h-1 bg-slate-800 my-1 rounded-full" />
                    <span className="text-emerald-700">{lcmResultDen}</span>
                  </div>

                  {/* Τελικό Ανάγωγο (αν απλοποιείται) */}
                  {isSimplified && (
                    <>
                      <div className="text-emerald-600 font-bold">＝</div>
                      <div className="flex flex-col items-center bg-emerald-100 px-2.5 sm:px-3 py-1.5 rounded-xl border border-emerald-300">
                        <span className="text-emerald-800">{simplifiedNum}</span>
                        <div className="w-8 sm:w-10 h-1 bg-slate-800 my-1 rounded-full" />
                        <span className="text-emerald-800">{simplifiedDen}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 2. ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ ΠΙΤΣΑΣ (ΒΗΜΑ-ΠΡΟΣ-ΒΗΜΑ) */}
              <div className="space-y-3 flex-1 flex flex-col justify-center">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 px-1">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                    🍕 Οπτικη Προσθεση (Κυκλικο Μοντελο):
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    Εμφανίζονται όλες οι μονάδες
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 py-4 bg-slate-50/70 rounded-3xl border border-slate-200 shadow-inner p-3 sm:p-4 max-h-[380px] overflow-y-auto">
                  {/* Πίτσα Α */}
                  <div className="flex flex-col items-center space-y-1.5">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider text-center">Κλασμα 1 ({activeNumA}/{activeDenA})</span>
                    {renderFractionVisual(activeNumA, activeDenA, 'fill-blue-500', 'stroke-blue-700')}
                  </div>

                  <div className="text-xl text-slate-400 font-black px-1">＋</div>

                  {/* Πίτσα Β */}
                  <div className="flex flex-col items-center space-y-1.5">
                    <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider text-center">Κλασμα 2 ({activeNumB}/{activeDenB})</span>
                    {renderFractionVisual(activeNumB, activeDenB, 'fill-orange-500', 'stroke-orange-700')}
                  </div>

                  {/* Ενδιάμεσες ομώνυμες πίτσες */}
                  {!isOriginallyOmonima && (
                    <>
                      <div className="text-xl text-slate-400 font-black px-1">＝</div>

                      <div className="flex flex-col items-center space-y-1.5 opacity-90">
                        <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider text-center">Ομωνυμο 1 ({equivalentNumA}/{lcm})</span>
                        {renderFractionVisual(equivalentNumA, lcm, 'fill-blue-500/90', 'stroke-blue-600')}
                      </div>

                      <div className="text-xl text-slate-400 font-black px-1">＋</div>

                      <div className="flex flex-col items-center space-y-1.5 opacity-90">
                        <span className="text-[10px] font-bold text-orange-700 uppercase tracking-wider text-center">Ομωνυμο 2 ({equivalentNumB}/{lcm})</span>
                        {renderFractionVisual(equivalentNumB, lcm, 'fill-orange-500/90', 'stroke-orange-600')}
                      </div>
                    </>
                  )}

                  <div className="text-xl text-slate-500 font-black px-1">＝</div>

                  {/* Πίτσα Αποτελέσματος */}
                  <div className="flex flex-col items-center space-y-1.5 bg-emerald-50/70 p-2 rounded-2xl border border-emerald-200">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider text-center">Αθροισμα ({lcmResultNum}/{lcmResultDen})</span>
                    {renderFractionVisual(lcmResultNum, lcmResultDen, 'fill-emerald-500', 'stroke-emerald-700')}
                  </div>

                  {/* Πίτσα Ανάγωγου */}
                  {isSimplified && (
                    <>
                      <div className="text-xl text-emerald-600 font-black px-1">＝</div>
                      <div className="flex flex-col items-center space-y-1.5 bg-emerald-100/70 p-2 rounded-2xl border border-emerald-300">
                        <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider text-center">Αναγωγο ({simplifiedNum}/{simplifiedDen})</span>
                        {renderFractionVisual(simplifiedNum, simplifiedDen, 'fill-emerald-600', 'stroke-emerald-800')}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 3. ΤΕΛΙΚΟ ΣΥΜΠΕΡΑΣΜΑ */}
              <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 text-white p-3.5 sm:p-4 rounded-2xl text-center font-mono font-black text-xs sm:text-sm shadow-md">
                💡 Τελικό Αποτέλεσμα: {activeNumA}/{activeDenA} ＋ {activeNumB}/{activeDenB} ＝ {isSimplified ? `${simplifiedNum}/${simplifiedDen}` : `${lcmResultNum}/${lcmResultDen}`}
              </div>

            </div>

          </div>
        </div>

        {/* 5. BOTTOM CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-lg text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
            <p className="text-gray-800 text-sm md:text-base">
              Έμαθες να προσθέτεις ομώνυμα και ετερώνυμα κλάσματα; Δοκίμασε τις διαδραστικές ασκήσεις!
            </p>
          </div>
          <Link
            href="/st-dimotikou/27-prosthesi-klasmaton-ask"
            className="bg-gray-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-xl transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            Ξεκίνα τις Ασκήσεις ➔
          </Link>
        </div>

      </div>
    </Layout>
  );
}
