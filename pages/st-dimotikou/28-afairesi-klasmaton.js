import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// ΕΞΩΤΕΡΙΚΕΣ ΜΕΤΑΒΛΗΤΕΣ ΡΥΘΜΙΣΗΣ
const MAX_LIMIT = 100;

const PRESETS = [
  { nA: 5, dA: 7, nB: 2, dB: 7, label: "5/7 － 2/7 (Ομώνυμα)" },
  { nA: 3, dA: 4, nB: 1, dB: 2, label: "3/4 － 1/2 (Ετερώνυμα ➔ 1/4)" },
  { nA: 1, dA: 1, nB: 3, dB: 4, label: "1 － 3/4 (Αφαίρεση από Μονάδα)" },
  { nA: 5, dA: 6, nB: 1, dB: 3, label: "5/6 － 1/3 (Ε.Κ.Π. = 6 ➔ 1/2)" }
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

export default function AfairesiKlasmatonPage() {
  // Κλάσμα Α (Αριστερά)
  const [numA, setNumA] = useState(3);
  const [denA, setDenA] = useState(4);

  // Κλάσμα B (Δεξιά)
  const [numB, setNumB] = useState(1);
  const [denB, setDenB] = useState(2);

  // Ασφαλής έλεγχος εισαγωγής κειμένου
  const handleInputChange = (setter, val, isDenominator = false) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') {
      setter('');
      return;
    }
    const n = Number(clean);
    
    if (isDenominator) {
      if (n === 0 || n > MAX_LIMIT) return;
      setter(n);
    } else {
      if (n > MAX_LIMIT) return;
      setter(n);
    }
  };

  // Αυξομείωση με κουμπιά
  const adjustValueA = (type, amount) => {
    if (type === 'num') {
      setNumA(prev => Math.max(0, Math.min(MAX_LIMIT, (Number(prev) || 0) + amount)));
    } else {
      setDenA(prev => Math.max(1, Math.min(MAX_LIMIT, (Number(prev) || 1) + amount)));
    }
  };

  const adjustValueB = (type, amount) => {
    if (type === 'num') {
      setNumB(prev => Math.max(0, Math.min(MAX_LIMIT, (Number(prev) || 0) + amount)));
    } else {
      setDenB(prev => Math.max(1, Math.min(MAX_LIMIT, (Number(prev) || 1) + amount)));
    }
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

  // Υπολογισμός Αφαιρέσεως με βάση το Ε.Κ.Π.
  const lcmResultNumRaw = equivalentNumA - equivalentNumB;
  const lcmResultDen = lcm;

  // Έλεγχος αν το αποτέλεσμα είναι αρνητικό
  const isNegative = lcmResultNumRaw < 0;
  const lcmResultNum = Math.abs(lcmResultNumRaw);

  // Απλοποίηση Αποτελέσματος
  const gcdResult = findGCD(lcmResultNum, lcmResultDen);
  const simplifiedNum = lcmResultNum / gcdResult;
  const simplifiedDen = lcmResultDen / gcdResult;
  const isSimplified = gcdResult > 1 && lcmResultNum !== 0;

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
    let typeHeader = isOriginallyOmonima 
      ? `🔵 Ομωνυμα Κλασματα (Ιδιος Παρονομαστης: ${activeDenA})`
      : `🟣 Ετερωνυμα Κλασματα (${activeDenA} ≠ ${activeDenB})`;

    return (
      <div className="space-y-3">
        <span className={`font-black uppercase block text-[11px] ${isOriginallyOmonima ? 'text-blue-800' : 'text-indigo-800'}`}>
          {typeHeader}
        </span>
        <div className="text-slate-600 space-y-1.5 text-xs md:text-sm">
          {!isOriginallyOmonima && (
            <>
              <p>1. Βρίσκουμε το <strong>Ε.Κ.Π.</strong>({activeDenA}, {activeDenB}) ＝ <strong>{lcm}</strong>.</p>
              <p>
                2. Μετατρέπουμε σε ομώνυμα:
                <br />
                • 1ο Κλάσμα (×{multiplierA}): <strong className="text-blue-700">{equivalentNumA}/{lcm}</strong>
                <br />
                • 2ο Κλάσμα (×{multiplierB}): <strong className="text-orange-700">{equivalentNumB}/{lcm}</strong>
              </p>
            </>
          )}
          <p>{isOriginallyOmonima ? 'Αφαιρούμε' : '3. Αφαιρούμε'} τους αριθμητές:</p>
        </div>
        
        <div className="bg-white p-3 rounded-xl border border-slate-200 font-mono text-xs md:text-sm">
          {isOriginallyOmonima ? (
            `${activeNumA}/${activeDenA} － ${activeNumB}/${activeDenB} ＝ (${activeNumA} － ${activeNumB})/${activeDenA} ＝ `
          ) : (
            `${equivalentNumA}/{lcm} － ${equivalentNumB}/{lcm} ＝ (${equivalentNumA} － ${equivalentNumB})/${lcm} ＝ `
          )}
          <strong className={isNegative ? 'text-rose-600' : 'text-emerald-700'}>
            {isNegative ? '－' : ''}{lcmResultNum}/{lcmResultDen}
          </strong>
        </div>

        {isNegative && (
          <p className="text-rose-600 text-xs font-bold bg-rose-50 p-2.5 rounded-xl border border-rose-200">
            ⚠️ Προσοχή: Το 2ο κλάσμα είναι μεγαλύτερο, οπότε το αποτέλεσμα είναι αρνητικό!
          </p>
        )}

        {isSimplified && (
          <p className="text-emerald-700 text-xs font-bold pt-1 border-t border-slate-100">
            ✨ Απλοποιώντας με το {gcdResult}, το τελικό ανάγωγο κλάσμα γίνεται: {isNegative ? '－' : ''}{simplifiedNum}/{simplifiedDen}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>➖ Αφαίρεση Κλασμάτων - LearnMaths.gr</title>
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
                href="/st-dimotikou/28-afairesi-klasmaton-ask"
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
                    🎓 ΣΤ' Δημοτικου
                  </span>
                  <span className="bg-amber-400 text-slate-900 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                    Ενοτητα 28
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                  28. Αφαίρεση Κλασμάτων (Ομώνυμα και Ετερώνυμα)
                </h1>
                <p className="text-blue-100 text-sm md:text-base leading-relaxed max-w-3xl">
                  Μάθε πώς αφαιρούμε <strong>ομώνυμα κλάσματα</strong> αφαιρώντας μόνο τους αριθμητές, και πώς κάνουμε τα <strong>ετερώνυμα ομώνυμα με το Ε.Κ.Π.</strong> πριν εκτελέσουμε την αφαίρεση!
                </p>
              </div>

              {/* CALLOUT PROMO CARD */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 shadow-inner">
                <span className="text-3xl">🚀</span>
                <h3 className="font-black text-lg text-amber-300">Ώρα για Εξάσκηση!</h3>
                <p className="text-xs text-blue-50">Δοκίμασε τις 8 διαδραστικές ασκήσεις αφαίρεσης κλασμάτων!</p>
                <Link
                  href="/st-dimotikou/28-afairesi-klasmaton-ask"
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
                <h3 className="text-lg font-black text-slate-900">1. Ομώνυμα Κλάσματα</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Όταν οι παρονομαστές είναι ίδιοι, <strong>αφαιρούμε μόνο τους αριθμητές</strong> και αφήνουμε τον ίδιο παρονομαστή.
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-blue-100 text-xs text-slate-700 font-mono text-center font-bold">
                <span className="bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-xl text-blue-900">
                  5/7 － 2/7 ＝ <strong className="text-blue-700 font-black">3/7</strong>
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
                  Βρίσκουμε το <strong>Ε.Κ.Π.</strong> των παρονομαστών, βάζουμε καπελάκια για να τα κάνουμε ομώνυμα και μετά αφαιρούμε!
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-indigo-100 text-xs text-slate-700 font-mono text-center font-bold">
                <span className="bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-xl text-indigo-900">
                  3/4 (3/4) － 1/2 (2/4) ＝ <strong className="text-indigo-700 font-black">1/4</strong>
                </span>
              </div>
            </div>

            <div className="bg-emerald-50/80 border border-emerald-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                  3
                </div>
                <h3 className="text-lg font-black text-slate-900">3. Απλοποίηση Διαφοράς</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Αν η διαφορά δεν είναι ανάγωγο κλάσμα, διαιρούμε με τον <strong>Μ.Κ.Δ.</strong> για να φτάσουμε στην απλούστερη μορφή.
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-emerald-100 text-xs text-slate-700 font-mono text-center font-bold">
                <span className="bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl text-emerald-900">
                  5/6 － 1/3 ＝ 3/6 ➔ <strong className="text-emerald-700 font-black">1/2</strong>
                </span>
              </div>
            </div>
          </div>

          {/* 4. INTERACTIVE PLAYGROUND */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
              <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <span>🕹️</span> Διαδραστικό Εργαστήριο Αφαίρεσης Κλασμάτων
                </h2>
                <p className="text-gray-500 text-sm">
                  Ρύθμισε τα δύο κλάσματα και παρακολούθησε βήμα-βήμα την αφαίρεση, τη μετατροπή σε ομώνυμα και την οπτικοποίηση!
                </p>
              </div>
            </div>

            {/* MAIN INTERACTIVE GRID (4 COLS LEFT / 8 COLS RIGHT) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* LEFT: CONTROLS & PRESETS (4 COLS) */}
              <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
                <div className="space-y-4">
                  
                  {/* ΧΕΙΡΙΣΤΗΡΙΟ ΚΛΑΣΜΑΤΟΣ Α (ΜΠΛΕ - ΜΕΙΩΤΕΟΣ) */}
                  <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-200 space-y-3">
                    <span className="text-xs font-black text-blue-800 uppercase block tracking-wider">
                      🔵 1 Κλασμα (Μειωτεος)
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Αριθμητης</span>
                        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                          <button type="button" onClick={() => adjustValueA('num', -1)} className="px-2 py-1 font-black text-blue-600 hover:bg-slate-50 rounded-lg">-</button>
                          <input
                            type="text"
                            value={numA}
                            onChange={(e) => handleInputChange(setNumA, e.target.value, false)}
                            className="w-full text-center font-mono font-black text-base outline-none text-blue-600"
                          />
                          <button type="button" onClick={() => adjustValueA('num', 1)} className="px-2 py-1 font-black text-blue-600 hover:bg-slate-50 rounded-lg">+</button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Παρονομαστης</span>
                        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                          <button type="button" onClick={() => adjustValueA('den', -1)} className="px-2 py-1 font-black text-blue-600 hover:bg-slate-50 rounded-lg">-</button>
                          <input
                            type="text"
                            value={denA}
                            onChange={(e) => handleInputChange(setDenA, e.target.value, true)}
                            className="w-full text-center font-mono font-black text-base outline-none text-blue-600"
                          />
                          <button type="button" onClick={() => adjustValueA('den', 1)} className="px-2 py-1 font-black text-blue-600 hover:bg-slate-50 rounded-lg">+</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ΧΕΙΡΙΣΤΗΡΙΟ ΚΛΑΣΜΑΤΟΣ Β (ΠΟΡΤΟΚΑΛΙ - ΑΦΑΙΡΕΤΕΟΣ) */}
                  <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-200 space-y-3">
                    <span className="text-xs font-black text-orange-800 uppercase block tracking-wider">
                      🟠 2 Κλασμα (Αφαιρετεος)
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Αριθμητης</span>
                        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                          <button type="button" onClick={() => adjustValueB('num', -1)} className="px-2 py-1 font-black text-orange-600 hover:bg-slate-50 rounded-lg">-</button>
                          <input
                            type="text"
                            value={numB}
                            onChange={(e) => handleInputChange(setNumB, e.target.value, false)}
                            className="w-full text-center font-mono font-black text-base outline-none text-orange-600"
                          />
                          <button type="button" onClick={() => adjustValueB('num', 1)} className="px-2 py-1 font-black text-orange-600 hover:bg-slate-50 rounded-lg">+</button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Παρονομαστης</span>
                        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                          <button type="button" onClick={() => adjustValueB('den', -1)} className="px-2 py-1 font-black text-orange-600 hover:bg-slate-50 rounded-lg">-</button>
                          <input
                            type="text"
                            value={denB}
                            onChange={(e) => handleInputChange(setDenB, e.target.value, true)}
                            className="w-full text-center font-mono font-black text-base outline-none text-orange-600"
                          />
                          <button type="button" onClick={() => adjustValueB('den', 1)} className="px-2 py-1 font-black text-orange-600 hover:bg-slate-50 rounded-lg">+</button>
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

                <div className="text-[11px] text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                  💡 <strong>Θυμήσου:</strong> Αφαιρούμε μόνο τους αριθμητές (α － β), ο παρονομαστής παραμένει ίδιος!
                </div>
              </div>

              {/* RIGHT: VISUALIZATION & PIZZAS (8 COLS) */}
              <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[520px] space-y-6">
                
                {/* 1. ΜΑΘΗΜΑΤΙΚΗ ΠΑΡΟΥΣΙΑΣΗ ΤΗΣ ΑΦΑΙΡΕΣΗΣ */}
                <div className="flex items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-3 sm:gap-4 font-mono font-black text-xl md:text-3xl select-none flex-wrap justify-center">
                    
                    {/* 1ο Κλάσμα */}
                    <div className="flex flex-col items-center">
                      <span className="text-blue-600">{activeNumA}</span>
                      <div className="w-10 h-1 bg-slate-800 my-1 rounded-full" />
                      <span className="text-blue-600">{activeDenA}</span>
                    </div>

                    {/* Σύμβολο - */}
                    <div className="text-slate-400 font-light">－</div>

                    {/* 2ο Κλάσμα */}
                    <div className="flex flex-col items-center">
                      <span className="text-orange-600">{activeNumB}</span>
                      <div className="w-10 h-1 bg-slate-800 my-1 rounded-full" />
                      <span className="text-orange-600">{activeDenB}</span>
                    </div>

                    {/* Ενδιάμεσο βήμα ομωνύμων (αν ήταν ετερώνυμα) */}
                    {!isOriginallyOmonima && (
                      <>
                        <div className="text-slate-400 font-light">＝</div>

                        <div className="flex flex-col items-center">
                          <span className="text-blue-600/80">{equivalentNumA}</span>
                          <div className="w-10 h-0.5 bg-slate-400 my-1 rounded-full" />
                          <span className="text-slate-700">{lcm}</span>
                        </div>

                        <div className="text-slate-400 font-light">－</div>

                        <div className="flex flex-col items-center">
                          <span className="text-orange-600/80">{equivalentNumB}</span>
                          <div className="w-10 h-0.5 bg-slate-400 my-1 rounded-full" />
                          <span className="text-slate-700">{lcm}</span>
                        </div>
                      </>
                    )}

                    <div className="text-slate-500 font-bold">＝</div>

                    {/* Διαφορά (με βάση το ΕΚΠ) */}
                    <div className="flex items-center font-mono">
                      {isNegative && <span className="text-rose-600 text-3xl font-black mr-1">－</span>}
                      <div className={`flex flex-col items-center ${isNegative ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'} px-3 py-1.5 rounded-xl border`}>
                        <span className={isNegative ? 'text-rose-700' : 'text-emerald-700'}>{lcmResultNum}</span>
                        <div className="w-10 h-1 bg-slate-800 my-1 rounded-full" />
                        <span className={isNegative ? 'text-rose-700' : 'text-emerald-700'}>{lcmResultDen}</span>
                      </div>
                    </div>

                    {/* Τελικό Ανάγωγο (αν απλοποιείται) */}
                    {isSimplified && (
                      <>
                        <div className={isNegative ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>＝</div>
                        <div className="flex items-center font-mono">
                          {isNegative && <span className="text-rose-600 text-3xl font-black mr-1">－</span>}
                          <div className={`flex flex-col items-center ${isNegative ? 'bg-rose-100 border-rose-300' : 'bg-emerald-100 border-emerald-300'} px-3 py-1.5 rounded-xl border`}>
                            <span className={isNegative ? 'text-rose-800' : 'text-emerald-800'}>{simplifiedNum}</span>
                            <div className="w-10 h-1 bg-slate-800 my-1 rounded-full" />
                            <span className={isNegative ? 'text-rose-800' : 'text-emerald-800'}>{simplifiedDen}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* 2. ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ ΠΙΤΣΑΣ (ΒΗΜΑ-ΠΡΟΣ-ΒΗΜΑ) */}
                <div className="space-y-3 flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                      🍕 Οπτικη Αφαιρεση (Κυκλικο Μοντελο):
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      Εμφανίζονται όλες οι μονάδες
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-center gap-4 py-4 bg-slate-50/70 rounded-3xl border border-slate-200 shadow-inner p-4 max-h-[380px] overflow-y-auto">
                    {/* Πίτσα Α */}
                    <div className="flex flex-col items-center space-y-1.5">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider text-center">1 Κλασμα ({activeNumA}/{activeDenA})</span>
                      {renderFractionVisual(activeNumA, activeDenA, 'fill-blue-500', 'stroke-blue-700')}
                    </div>

                    <div className="text-xl text-slate-400 font-black px-1">－</div>

                    {/* Πίτσα Β */}
                    <div className="flex flex-col items-center space-y-1.5">
                      <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider text-center">2 Κλασμα ({activeNumB}/{activeDenB})</span>
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

                        <div className="text-xl text-slate-400 font-black px-1">－</div>

                        <div className="flex flex-col items-center space-y-1.5 opacity-90">
                          <span className="text-[10px] font-bold text-orange-700 uppercase tracking-wider text-center">Ομωνυμο 2 ({equivalentNumB}/{lcm})</span>
                          {renderFractionVisual(equivalentNumB, lcm, 'fill-orange-500/90', 'stroke-orange-600')}
                        </div>
                      </>
                    )}

                    <div className="text-xl text-slate-500 font-black px-1">＝</div>

                    {/* Πίτσα Αποτελέσματος */}
                    <div className={`flex flex-col items-center space-y-1.5 p-2 rounded-2xl border ${isNegative ? 'bg-rose-50/70 border-rose-200' : 'bg-emerald-50/70 border-emerald-200'}`}>
                      <span className={`text-[10px] font-bold uppercase tracking-wider text-center ${isNegative ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {isNegative ? 'Ελλειμμα' : 'Υπολοιπο'} ({isNegative ? '－' : ''}{lcmResultNum}/{lcmResultDen})
                      </span>
                      {renderFractionVisual(lcmResultNum, lcmResultDen, isNegative ? 'fill-rose-500' : 'fill-emerald-500', isNegative ? 'stroke-rose-700' : 'stroke-emerald-700')}
                    </div>

                    {/* Πίτσα Ανάγωγου */}
                    {isSimplified && (
                      <>
                        <div className={`text-xl font-black px-1 ${isNegative ? 'text-rose-600' : 'text-emerald-600'}`}>＝</div>
                        <div className={`flex flex-col items-center space-y-1.5 p-2 rounded-2xl border ${isNegative ? 'bg-rose-100/70 border-rose-300' : 'bg-emerald-100/70 border-emerald-300'}`}>
                          <span className={`text-[10px] font-bold uppercase tracking-wider text-center ${isNegative ? 'text-rose-800' : 'text-emerald-800'}`}>
                            Αναγωγο ({isNegative ? '－' : ''}{simplifiedNum}/{simplifiedDen})
                          </span>
                          {renderFractionVisual(simplifiedNum, simplifiedDen, isNegative ? 'fill-rose-600' : 'fill-emerald-600', isNegative ? 'stroke-rose-800' : 'stroke-emerald-800')}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* 3. ΤΕΛΙΚΟ ΣΥΜΠΕΡΑΣΜΑ */}
                <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 text-white p-4 rounded-2xl text-center font-mono font-black text-xs sm:text-sm shadow-md">
                  💡 Τελικό Αποτέλεσμα: {activeNumA}/{activeDenA} － {activeNumB}/{activeDenB} ＝ {isNegative ? '－' : ''}{isSimplified ? `${simplifiedNum}/${simplifiedDen}` : `${lcmResultNum}/${lcmResultDen}`}
                </div>

              </div>

            </div>
          </div>

          {/* 5. BOTTOM CALLOUT BANNER */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-lg text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <h3 className="text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
              <p className="text-gray-800 text-sm md:text-base">
                Έμαθες να αφαιρείς ομώνυμα και ετερώνυμα κλάσματα; Δοκίμασε τις διαδραστικές ασκήσεις!
              </p>
            </div>
            <Link
              href="/st-dimotikou/28-afairesi-klasmaton-ask"
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
