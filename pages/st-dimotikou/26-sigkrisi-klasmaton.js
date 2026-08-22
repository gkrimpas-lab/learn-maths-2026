import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// ΕΞΩΤΕΡΙΚΕΣ ΜΕΤΑΒΛΗΤΕΣ ΡΥΘΜΙΣΗΣ
const MAX_LIMIT = 100;

const PRESETS = [
  { nA: 3, dA: 8, nB: 5, dB: 8, label: "3/8 vs 5/8 (Ομώνυμα)" },
  { nA: 2, dA: 3, nB: 2, dB: 5, label: "2/3 vs 2/5 (Ίδιος Αριθμητής)" },
  { nA: 2, dA: 3, nB: 3, dB: 4, label: "2/3 vs 3/4 (Ετερώνυμα)" },
  { nA: 3, dA: 6, nB: 4, dB: 8, label: "3/6 vs 4/8 (Ισοδύναμα = 1/2)" }
];

// Υπολογισμός Μ.Κ.Δ. και Ε.Κ.Π.
function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

function lcm(a, b) {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

export default function SigkrisiKlasmatonPage() {
  // Κλάσμα Α (Αριστερά)
  const [numA, setNumA] = useState(2);
  const [denA, setDenA] = useState(3);

  // Κλάσμα Β (Δεξιά)
  const [numB, setNumB] = useState(3);
  const [denB, setDenB] = useState(4);

  // Tab μεθόδου επεξήγησης: 'homo' (Ομώνυμα/ΕΚΠ) ή 'cross' (Χιαστί)
  const [methodTab, setMethodTab] = useState('homo');

  // Ασφαλής έλεγχος εισαγωγής κειμένου χωρίς να επηρεάζεται ο άλλος όρος
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

  // Αυξομείωση με κουμπιά (εντελώς ανεξάρτητα)
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

  const valA = activeNumA / activeDenA;
  const valB = activeNumB / activeDenB;

  // Υπολογισμός δυναμικής κλίμακας αριθμογραμμής
  const maxDecimal = Math.max(valA, valB);
  const maxLineVal = Math.max(2, Math.ceil(maxDecimal + 0.2));

  // Δημιουργία των σημείων/ακεραίων της αριθμογραμμής
  const step = maxLineVal > 10 ? Math.ceil(maxLineVal / 6) : 1;
  const lineMarkers = [];
  for (let m = 0; m <= maxLineVal; m += step) {
    lineMarkers.push(m);
  }
  if (!lineMarkers.includes(maxLineVal)) {
    lineMarkers.push(maxLineVal);
  }

  // Υπολογισμός Ε.Κ.Π. και Ομώνυμων Κλασμάτων
  const commonDen = lcm(activeDenA, activeDenB) || 1;
  const multA = commonDen / activeDenA;
  const multB = commonDen / activeDenB;
  const homoNumA = activeNumA * multA;
  const homoNumB = activeNumB * multB;

  // Υπολογισμός Χιαστί Γινομένων
  const crossA = activeNumA * activeDenB;
  const crossB = activeNumB * activeDenA;

  // Εύρεση του σωστού συμβόλου σύγκρισης
  const getComparisonSymbol = () => {
    if (valA > valB) return '>';
    if (valA < valB) return '<';
    return '=';
  };

  // Σχεδίαση κυκλικών διαγραμμάτων (πίτσες SVG)
  const renderFractionVisual = (num, den, fillColor = 'fill-blue-500', strokeColor = 'stroke-blue-700') => {
    const totalPizzasNeeded = Math.max(1, Math.min(6, Math.ceil(num / den)));
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
        <div key={p} className="relative">
          <svg width="110" height="110" className="drop-shadow-sm overflow-visible">
            {slices}
            <circle cx={cx} cy={cy} r="2.5" className="fill-slate-800" />
          </svg>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap justify-center gap-2 max-w-[260px] p-2 bg-white rounded-2xl border border-slate-200 shadow-inner">
        {pizzas}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>⚖️ Σύγκριση Κλασμάτων - LearnMaths.gr</title>
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
                href="/st-dimotikou/26-sigkrisi-klasmaton-ask"
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
                    Ενότητα 26
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                  26. Σύγκριση Κλασμάτων (Ομώνυμα, Ε.Κ.Π. & Χιαστί)
                </h1>
                <p className="text-blue-100 text-sm md:text-base leading-relaxed max-w-3xl">
                  Μάθε πώς συγκρίνουμε κλάσματα: κάνοντάς τα <strong>ομώνυμα με το Ε.Κ.Π.</strong>, συγκρίνοντας τους <strong>αριθμητές</strong> ή εφαρμόζοντας τον γρήγορο <strong>πολλαπλασιασμό χιαστί</strong>!
                </p>
              </div>

              {/* CALLOUT PROMO CARD */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 shadow-inner">
                <span className="text-3xl">🚀</span>
                <h3 className="font-black text-lg text-amber-300">Ώρα για Εξάσκηση!</h3>
                <p className="text-xs text-blue-50">Δοκίμασε τις 8 διαδραστικές ασκήσεις σύγκρισης κλασμάτων!</p>
                <Link
                  href="/st-dimotikou/26-sigkrisi-klasmaton-ask"
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
                  Όταν οι παρονομαστές είναι ίδιοι, <strong>μεγαλύτερο</strong> είναι το κλάσμα με τον <strong>μεγαλύτερο αριθμητή</strong>.
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-blue-100 text-xs text-slate-700 font-mono text-center font-bold">
                <span className="bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-xl text-blue-900">
                  5/8 &gt; 3/8
                </span>
              </div>
            </div>

            <div className="bg-indigo-50/80 border border-indigo-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                  2
                </div>
                <h3 className="text-lg font-black text-slate-900">2. Μετατροπή σε Ομώνυμα</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Βρίσκουμε το <strong>Ε.Κ.Π.</strong> των παρονομαστών, φτιάχνουμε ισοδύναμα ομώνυμα κλάσματα και συγκρίνουμε τους νέους αριθμητές.
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-indigo-100 text-xs text-slate-700 font-mono text-center font-bold">
                <span className="bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-xl text-indigo-900">
                  2/3 (8/12) &lt; 3/4 (9/12)
                </span>
              </div>
            </div>

            <div className="bg-amber-50/80 border border-amber-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 bg-amber-500 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                  3
                </div>
                <h3 className="text-lg font-black text-slate-900">3. Μέθοδος Χιαστί</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Πολλαπλασιάζουμε χιαστί: (α × δ) και (γ × β). Συγκρίνουμε τα γινόμενα για άμεσο και γρήγορο αποτέλεσμα!
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-amber-100 text-xs text-slate-700 font-mono text-center font-bold">
                <span className="bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl text-amber-900">
                  2×4=8 &lt; 3×3=9 ➔ 2/3 &lt; 3/4
                </span>
              </div>
            </div>
          </div>

          {/* 4. INTERACTIVE PLAYGROUND */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
              <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <span>🕹️</span> Διαδραστικό Εργαστήριο Σύγκρισης Κλασμάτων
                </h2>
                <p className="text-gray-500 text-sm">
                  Ρύθμισε τα δύο κλάσματα, δες τη μετατροπή τους σε ομώνυμα, τον χιαστί έλεγχο και τη θέση τους στην αριθμογραμμή!
                </p>
              </div>

              {/* METHOD SELECTOR TABS */}
              <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner gap-1">
                <button
                  type="button"
                  onClick={() => setMethodTab('homo')}
                  className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black transition-all ${
                    methodTab === 'homo'
                      ? 'bg-blue-600 text-white shadow-sm scale-105'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  📐 Μετατροπή σε Ομώνυμα (Ε.Κ.Π.)
                </button>
                <button
                  type="button"
                  onClick={() => setMethodTab('cross')}
                  className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black transition-all ${
                    methodTab === 'cross'
                      ? 'bg-amber-500 text-white shadow-sm scale-105'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ⚡ Μέθοδος Χιαστί
                </button>
              </div>
            </div>

            {/* MAIN INTERACTIVE GRID (4 COLS LEFT / 8 COLS RIGHT) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* LEFT: CONTROLS & PRESETS (4 COLS) */}
              <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
                <div className="space-y-4">
                  
                  {/* ΧΕΙΡΙΣΤΗΡΙΟ ΚΛΑΣΜΑΤΟΣ Α (ΜΠΛΕ) */}
                  <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-200 space-y-3">
                    <span className="text-xs font-black text-blue-800 uppercase block tracking-wider">
                      🔵 Κλάσμα Α (Αριστερό)
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Αριθμητής</span>
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
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Παρονομαστής</span>
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

                  {/* ΧΕΙΡΙΣΤΗΡΙΟ ΚΛΑΣΜΑΤΟΣ Β (ΠΟΡΤΟΚΑΛΙ) */}
                  <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-200 space-y-3">
                    <span className="text-xs font-black text-orange-800 uppercase block tracking-wider">
                      🟠 Κλάσμα Β (Δεξί)
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Αριθμητής</span>
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
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Παρονομαστής</span>
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
                      Έτοιμα Παραδείγματα:
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

                  {/* ΜΑΘΗΜΑΤΙΚΗ ΕΞΗΓΗΣΗ ΑΝΑΛΟΓΑ ΜΕ ΤΟ TAB */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium shadow-xs">
                    {methodTab === 'homo' ? (
                      <div className="space-y-1.5">
                        <span className="font-black text-blue-800 uppercase block text-[11px]">
                          📐 Μετατροπή σε Ομώνυμα με Ε.Κ.Π.({activeDenA}, {activeDenB}):
                        </span>
                        {activeDenA === activeDenB ? (
                          <p>Τα κλάσματα είναι ήδη ομώνυμα (έχουν ίδιο παρονομαστή {activeDenA}). Συγκρίνουμε απευθείας τους αριθμητές: <strong>{activeNumA} {valA > valB ? '>' : valA < valB ? '<' : '＝'} {activeNumB}</strong>.</p>
                        ) : (
                          <>
                            <p>
                              • Ε.Κ.Π.({activeDenA}, {activeDenB}) ＝ <strong>{commonDen}</strong>
                            </p>
                            <p>
                              • 1ο Κλάσμα: ({activeNumA} × {multA}) / ({activeDenA} × {multA}) ＝ <strong className="text-blue-700">{homoNumA}/{commonDen}</strong>
                            </p>
                            <p>
                              • 2ο Κλάσμα: ({activeNumB} × {multB}) / ({activeDenB} × {multB}) ＝ <strong className="text-orange-700">{homoNumB}/{commonDen}</strong>
                            </p>
                            <p className="border-t border-slate-100 pt-1 font-bold text-slate-900">
                              Συγκρίνουμε τους νέους αριθμητές: {homoNumA} {homoNumA > homoNumB ? '>' : homoNumA < homoNumB ? '<' : '＝'} {homoNumB}, άρα {activeNumA}/{activeDenA} {getComparisonSymbol()} {activeNumB}/{activeDenB}.
                            </p>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <span className="font-black text-amber-800 uppercase block text-[11px]">
                          ⚡ Έλεγχος με Πολλαπλασιασμό Χιαστί:
                        </span>
                        <p>
                          • Αριστερό γινόμενο: {activeNumA} × {activeDenB} ＝ <strong className="text-blue-700">{crossA}</strong>
                        </p>
                        <p>
                          • Δεξί γινόμενο: {activeNumB} × {activeDenA} ＝ <strong className="text-orange-700">{crossB}</strong>
                        </p>
                        <p className="border-t border-slate-100 pt-1 font-bold text-slate-900">
                          Επειδή {crossA} {crossA > crossB ? '>' : crossA < crossB ? '<' : '＝'} {crossB}, τότε {activeNumA}/{activeDenA} {getComparisonSymbol()} {activeNumB}/{activeDenB}.
                        </p>
                      </div>
                    )}
                  </div>

                </div>

                <div className="text-[11px] text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                  💡 <strong>Συμβουλή:</strong> Όταν δύο κλάσματα γίνουν ομώνυμα, συγκρίνουμε μόνο τους αριθμητές τους!
                </div>
              </div>

              {/* RIGHT: VISUALIZATION, DYNAMIC NUMBER LINE & PIZZAS (8 COLS) */}
              <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[520px] space-y-6">
                
                {/* 1. ΜΑΘΗΜΑΤΙΚΗ ΠΑΡΟΥΣΙΑΣΗ ΜΕ ΤΟ ΣΥΜΒΟΛΟ */}
                <div className="flex items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-6 sm:gap-10 font-mono font-black text-3xl md:text-5xl select-none">
                    {/* Κλάσμα Α */}
                    <div className="flex flex-col items-center">
                      <span className="text-blue-600">{activeNumA}</span>
                      <div className="w-12 sm:w-16 h-1.5 bg-slate-800 my-1 rounded-full" />
                      <span className="text-blue-600">{activeDenA}</span>
                    </div>

                    {/* Σύμβολο Σύγκρισης */}
                    <div className="text-4xl md:text-6xl text-amber-500 bg-white px-5 py-2.5 rounded-2xl shadow-md border border-slate-200">
                      {getComparisonSymbol()}
                    </div>

                    {/* Κλάσμα Β */}
                    <div className="flex flex-col items-center">
                      <span className="text-orange-600">{activeNumB}</span>
                      <div className="w-12 sm:w-16 h-1.5 bg-slate-800 my-1 rounded-full" />
                      <span className="text-orange-600">{activeDenB}</span>
                    </div>
                  </div>
                </div>

                {/* 2. ΔΥΝΑΜΙΚΗ ΑΡΙΘΜΟΓΡΑΜΜΗ (DYNAMIC NUMBER LINE) */}
                <div className="space-y-2 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
                      📍 Δυναμική Αριθμογραμμή (0 έως {maxLineVal}):
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      Προσαρμόζεται αυτόματα στο μέγεθος
                    </span>
                  </div>

                  <div className="relative w-full pt-10 pb-6 px-6">
                    <div className="relative w-full h-1.5 bg-slate-300 rounded-full">
                      {/* Δυναμικοί Ακέραιοι/Σημεία */}
                      {lineMarkers.map((num) => {
                        const pct = (num / maxLineVal) * 100;
                        return (
                          <div key={num} className="absolute flex flex-col items-center" style={{ left: `${pct}%`, transform: 'translateX(-50%)' }}>
                            <div className="w-0.5 h-4 bg-slate-800 -top-2 relative" />
                            <span className="text-xs font-mono font-black text-slate-700 top-1 relative">{num}</span>
                          </div>
                        );
                      })}

                      {/* Δείκτης Κλάσματος Α (Μπλε) */}
                      <div 
                        className="absolute flex flex-col items-center -top-8 transition-all duration-500 ease-out z-10"
                        style={{ left: `${Math.min(100, Math.max(0, (valA / maxLineVal) * 100))}%`, transform: 'translateX(-50%)' }}
                      >
                        <div className="bg-blue-600 text-white font-mono text-[11px] font-black px-2 py-0.5 rounded-lg shadow-md mb-0.5 whitespace-nowrap">
                          Α: {activeNumA}/{activeDenA} ({valA.toFixed(2).replace('.', ',')})
                        </div>
                        <div className="w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-white shadow-md animate-bounce" />
                      </div>

                      {/* Δείκτης Κλάσματος Β (Πορτοκαλί) */}
                      <div 
                        className="absolute flex flex-col items-center -top-8 transition-all duration-500 ease-out z-20"
                        style={{ left: `${Math.min(100, Math.max(0, (valB / maxLineVal) * 100))}%`, transform: 'translateX(-50%)' }}
                      >
                        <div className="bg-orange-600 text-white font-mono text-[11px] font-black px-2 py-0.5 rounded-lg shadow-md mb-0.5 whitespace-nowrap">
                          Β: {activeNumB}/{activeDenB} ({valB.toFixed(2).replace('.', ',')})
                        </div>
                        <div className="w-3.5 h-3.5 rounded-full bg-orange-500 border-2 border-white shadow-md animate-bounce" />
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 italic text-center">
                    Το κλάσμα που βρίσκεται <strong>πιο δεξιά στην αριθμογραμμή</strong> είναι το μεγαλύτερο!
                  </p>
                </div>

                {/* 3. ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ ΠΙΤΣΑΣ */}
                <div className="space-y-3 flex-1 flex flex-col justify-center">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-wider block text-center">
                    🍕 Οπτική Σύγκριση Επιφάνειας (Κυκλικό Μοντέλο):
                  </span>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-4 bg-slate-50/70 rounded-3xl border border-slate-200 shadow-inner">
                    {/* Πίτσα Α */}
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-xs font-black text-blue-600 uppercase tracking-wider">
                        Κλάσμα Α ({activeNumA}/{activeDenA})
                      </span>
                      {renderFractionVisual(activeNumA, activeDenA, 'fill-blue-500', 'stroke-blue-700')}
                      <span className="font-mono text-xs text-slate-600 font-bold bg-white px-2.5 py-0.5 rounded-md border border-slate-200">
                        {activeDenA !== commonDen ? `Ομώνυμο: ${homoNumA}/${commonDen}` : `Αξία: ${valA.toFixed(2).replace('.', ',')}`}
                      </span>
                    </div>

                    {/* Πίτσα Β */}
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-xs font-black text-orange-600 uppercase tracking-wider">
                        Κλάσμα Β ({activeNumB}/{activeDenB})
                      </span>
                      {renderFractionVisual(activeNumB, activeDenB, 'fill-orange-500', 'stroke-orange-700')}
                      <span className="font-mono text-xs text-slate-600 font-bold bg-white px-2.5 py-0.5 rounded-md border border-slate-200">
                        {activeDenB !== commonDen ? `Ομώνυμο: ${homoNumB}/${commonDen}` : `Αξία: ${valB.toFixed(2).replace('.', ',')}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4. ΤΕΛΙΚΟ ΣΥΜΠΕΡΑΣΜΑ */}
                <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-orange-500 text-white p-4 rounded-2xl text-center font-mono font-black text-xs sm:text-sm shadow-md">
                  ⚖️ Συμπέρασμα: {activeNumA}/{activeDenA} {getComparisonSymbol()} {activeNumB}/{activeDenB} (Το κλάσμα που καλύπτει μεγαλύτερη επιφάνεια και βρίσκεται πιο δεξιά στην αριθμογραμμή είναι το μεγαλύτερο!)
                </div>

              </div>

            </div>
          </div>

          {/* 5. BOTTOM CALLOUT BANNER */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-lg text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <h3 className="text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
              <p className="text-gray-800 text-sm md:text-base">
                Έμαθες να συγκρίνεις ομώνυμα, ετερώνυμα και ισοδύναμα κλάσματα; Δοκίμασε τις διαδραστικές ασκήσεις!
              </p>
            </div>
            <Link
              href="/st-dimotikou/26-sigkrisi-klasmaton-ask"
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
