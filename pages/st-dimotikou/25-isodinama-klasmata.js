import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { LAYOUT } from '../../shared/layout-config';

// ΜΕΓΙΣΤΕΣ ΤΙΜΕΣ
const MAX_VALUE = 100;
const MAX_MULTIPLIER = 10;

const PRESETS_CREATE = [
  { num: 1, den: 2, mult: 2, label: "1/2 (×2)" },
  { num: 2, den: 3, mult: 3, label: "2/3 (×3)" },
  { num: 3, den: 4, mult: 2, label: "3/4 (×2)" },
  { num: 2, den: 5, mult: 4, label: "2/5 (×4)" }
];

const PRESETS_REDUCE = [
  { num: 6, den: 8, label: "6/8 (Μ.Κ.Δ. = 2)" },
  { num: 12, den: 18, label: "12/18 (Μ.Κ.Δ. = 6)" },
  { num: 15, den: 20, label: "15/20 (Μ.Κ.Δ. = 5)" },
  { num: 9, den: 12, label: "9/12 (Μ.Κ.Δ. = 3)" }
];

export default function IsodinamaKlasmataPage() {
  const [activeTab, setActiveTab] = useState('create'); // 'create' ή 'reduce'
  
  // Κατάσταση για τη Λειτουργία 1 (Δημιουργία Ισοδυνάμου)
  const [num1, setNum1] = useState(1);
  const [den1, setDenominator1] = useState(2);
  const [multiplier, setMultiplier] = useState(3);

  // Κατάσταση για τη Λειτουργία 2 (Μετατροπή σε Ανάγωγο)
  const [num2, setNum2] = useState(6);
  const [den2, setDenominator2] = useState(8);

  // Συναρτήσεις ασφαλούς εισαγωγής
  const handleInputChange = (setter, val, currentPair, isDenominator = false) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') {
      setter('');
      return;
    }
    const n = Number(clean);
    
    if (isDenominator) {
      if (n === 0 || n > MAX_VALUE) return;
      setter(n);
      if (currentPair.num > n) {
        currentPair.setNum(n);
      }
    } else {
      if (n > (currentPair.den || MAX_VALUE) || n > MAX_VALUE) return;
      setter(n);
    }
  };

  // Αυξομείωση με κουμπιά για τη Λειτουργία 1
  const adjustValue1 = (type, amount) => {
    if (type === 'num') {
      setNum1(prev => Math.max(0, Math.min(Number(den1) || MAX_VALUE, (Number(prev) || 0) + amount)));
    } else {
      setDenominator1(prev => {
        const nextDen = Math.max(1, Math.min(MAX_VALUE, (Number(prev) || 1) + amount));
        if (num1 > nextDen) setNum1(nextDen);
        return nextDen;
      });
    }
  };

  // Αυξομείωση με κουμπιά για τη Λειτουργία 2
  const adjustValue2 = (type, amount) => {
    if (type === 'num') {
      setNum2(prev => Math.max(0, Math.min(Number(den2) || MAX_VALUE, (Number(prev) || 0) + amount)));
    } else {
      setDenominator2(prev => {
        const nextDen = Math.max(1, Math.min(MAX_VALUE, (Number(prev) || 1) + amount));
        if (num2 > nextDen) setNum2(nextDen);
        return nextDen;
      });
    }
  };

  // Αλγόριθμος Ευκλείδη για εύρεση ΜΚΔ
  const findGcd = (a, b) => {
    let x = Math.abs(a);
    let y = Math.abs(b);
    while (y) {
      let t = y;
      y = x % y;
      x = t;
    }
    return x;
  };

  // Υπολογισμοί για τη Λειτουργία 1 (Δημιουργία)
  const activeNum1 = num1 === '' ? 0 : Number(num1);
  const activeDen1 = den1 === '' || den1 === 0 ? 1 : Number(den1);
  const safeMultiplier = Math.min(multiplier, MAX_MULTIPLIER);

  const isoNum = activeNum1 * safeMultiplier;
  const isoDen = activeDen1 * safeMultiplier;

  // Υπολογισμοί για τη Λειτουργία 2 (Ανάγωγο)
  const activeNum2 = num2 === '' ? 0 : Number(num2);
  const activeDen2 = den2 === '' || den2 === 0 ? 1 : Number(den2);
  const gcd = findGcd(activeNum2, activeDen2) || 1;
  
  const reducedNum = activeNum2 / gcd;
  const reducedDen = activeDen2 / gcd;

  // Σχεδίαση της πίτσας (Κυκλικό Σχήμα SVG)
  const renderPizzaDiagram = (num, den, fillColor = 'fill-blue-500', strokeColor = 'stroke-blue-700') => {
    const slices = [];
    const radius = 65;
    const cx = 80;
    const cy = 80;
    const activeSlices = Math.max(0, Math.min(den, num));

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

      const isFilled = i < activeSlices;

      slices.push(
        <path
          key={i}
          d={d}
          className={`${
            isFilled 
              ? `${fillColor} ${strokeColor}` 
              : 'fill-slate-100 stroke-slate-300'
          } transition-colors duration-200 stroke-[1.2]`}
        />
      );
    }

    return (
      <svg width="160" height="160" className="drop-shadow-md overflow-visible shrink-0">
        {slices}
        <circle cx={cx} cy={cy} r="2.5" className="fill-slate-800" />
      </svg>
    );
  };

  return (
    <Layout
      title="⚖️ 25. Ισοδύναμα Κλάσματα και Απλοποίηση σε Ανάγωγο - LearnMaths.gr"
      description="Μάθε πώς δημιουργούμε ισοδύναμα κλάσματα πολλαπλασιάζοντας τους όρους τους και πώς τα απλοποιούμε με τον Μ.Κ.Δ. για να φτάσουμε στο απλούστερο ανάγωγο κλάσμα για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/25-isodinama-klasmata-ask"
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
                  Ενοτητα 25
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                25. Ισοδύναμα Κλάσματα και Απλοποίηση σε Ανάγωγο
              </h1>
              <p className="text-blue-100 text-sm md:text-base leading-relaxed max-w-3xl">
                Μάθε πώς δημιουργούμε <strong>ισοδύναμα κλάσματα</strong> πολλαπλασιάζοντας τους όρους τους και πώς τα <strong>απλοποιούμε με τον Μ.Κ.Δ.</strong> για να φτάσουμε στο απλούστερο <strong>ανάγωγο κλάσμα</strong>!
              </p>
            </div>

            {/* CALLOUT PROMO CARD */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 shadow-inner">
              <span className="text-3xl">🚀</span>
              <h3 className="font-black text-lg text-amber-300">Ώρα για Εξάσκηση!</h3>
              <p className="text-xs text-blue-50">Δοκίμασε τις 8 διαδραστικές ασκήσεις ισοδυνάμων και αναγώγων κλασμάτων!</p>
              <Link
                href="/st-dimotikou/25-isodinama-klasmata-ask"
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
              <h3 className="text-lg font-black text-slate-900">Τι είναι τα Ισοδύναμα;</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Είναι τα κλάσματα που έχουν διαφορετικούς όρους, αλλά εκφράζουν την <strong>ίδια ακριβώς ποσότητα ή αξία</strong>.
              </p>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-blue-100 text-xs text-slate-700 font-mono text-center flex items-center justify-center gap-2 font-bold">
              <span className="bg-blue-50 border border-blue-200 px-3 py-1 rounded-xl">
                1/2 ＝ <strong className="text-blue-700 font-black">2/4</strong> ＝ <strong className="text-blue-700 font-black">4/8</strong>
              </span>
            </div>
          </div>

          <div className="bg-indigo-50/80 border border-indigo-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-2.5">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                2
              </div>
              <h3 className="text-lg font-black text-slate-900">Δημιουργία Ισοδυνάμων</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                <strong>Πολλαπλασιάζουμε</strong> ή <strong>διαιρούμε</strong> και τον αριθμητή και τον παρονομαστή με τον <strong>ίδιο φυσικό αριθμό</strong> (≠ 0).
              </p>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-indigo-100 text-xs text-slate-700 font-mono text-center font-bold">
              <span className="bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-xl text-indigo-900 inline-block">
                (1 × 3) / (2 × 3) ＝ <strong className="text-indigo-700 font-black">3/6</strong>
              </span>
            </div>
          </div>

          <div className="bg-emerald-50/80 border border-emerald-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-2.5">
              <div className="w-10 h-10 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                3
              </div>
              <h3 className="text-lg font-black text-slate-900">Ανάγωγο Κλάσμα</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Είναι το κλάσμα που <strong>δεν μπορεί να απλοποιηθεί άλλο</strong>. Προκύπτει διαιρώντας τους όρους με τον <strong>Μ.Κ.Δ.</strong> τους!
              </p>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-emerald-100 text-xs text-slate-700 font-mono text-center font-bold">
              <span className="bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl text-emerald-900 inline-block">
                6/8 (: 2) ➔ <strong className="text-emerald-700 font-black">3/4</strong> (Ανάγωγο)
              </span>
            </div>
          </div>
        </div>

        {/* TABS SELECTOR */}
        <div className="flex justify-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner max-w-md mx-auto gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('create')}
            className={`flex-1 text-center py-2.5 rounded-xl text-xs md:text-sm font-black transition-all ${
              activeTab === 'create' ? 'bg-blue-600 text-white shadow-sm scale-105' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🛠️ Δημιουργία Ισοδυνάμου
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reduce')}
            className={`flex-1 text-center py-2.5 rounded-xl text-xs md:text-sm font-black transition-all ${
              activeTab === 'reduce' ? 'bg-emerald-600 text-white shadow-sm scale-105' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🎯 Μετατροπή σε Ανάγωγο
          </button>
        </div>

        {/* 4. INTERACTIVE PLAYGROUND */}
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
            <div className="max-w-xl">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🕹️</span> Διαδραστικό Εργαστήριο Ισοδυναμίας και Απλοποίησης
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm">
                {activeTab === 'create'
                  ? "Δώσε ένα κλάσμα, επίλεξε πολλαπλασιαστή και παρατήρησε πώς προκύπτει το νέο ισοδύναμο κλάσμα!"
                  : "Δώσε ένα σύνθετο κλάσμα και δες βήμα προς βήμα την απλοποίησή του μέσω του Μ.Κ.Δ. σε ανάγωγο!"}
              </p>
            </div>
          </div>

          {/* MAIN INTERACTIVE GRID (4 COLS LEFT / 8 COLS RIGHT) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
            
            {/* LEFT: CONTROLS & PRESETS (4 COLS) */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
              
              {activeTab === 'create' ? (
                /* TAB 1: ΔΗΜΙΟΥΡΓΙΑ */
                <div className="space-y-4">
                  <div className="space-y-3">
                    <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                      1. Αρχικο Κλασμα:
                    </span>

                    <div className="grid grid-cols-2 gap-3">
                      {/* ΑΡΙΘΜΗΤΗΣ */}
                      <div className="bg-white p-3 rounded-2xl border border-blue-200 shadow-xs space-y-1 text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Αριθμητης</span>
                        <div className="flex items-center gap-1.5 sm:gap-2 w-full">
                          <button
                            type="button"
                            onClick={() => adjustValue1('num', -1)}
                            className="w-9 sm:w-11 h-9 sm:h-10 shrink-0 bg-slate-100 hover:bg-slate-200 text-blue-700 rounded-lg font-black text-sm flex items-center justify-center"
                          >
                            -
                          </button>
                          <input
                            type="text"
                            value={num1}
                            onChange={(e) => handleInputChange(setNum1, e.target.value, { num: num1, setNum: setNum1, den: den1 }, false)}
                            className="w-full min-w-0 flex-1 text-center font-mono font-black text-base sm:text-lg text-blue-600 bg-blue-50/50 rounded-lg py-1 outline-none border border-blue-200"
                          />
                          <button
                            type="button"
                            onClick={() => adjustValue1('num', 1)}
                            className="w-9 sm:w-11 h-9 sm:h-10 shrink-0 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-black text-sm flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* ΠΑΡΟΝΟΜΑΣΤΗΣ */}
                      <div className="bg-white p-3 rounded-2xl border border-blue-200 shadow-xs space-y-1 text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Παρονομαστης</span>
                        <div className="flex items-center gap-1.5 sm:gap-2 w-full">
                          <button
                            type="button"
                            onClick={() => adjustValue1('den', -1)}
                            className="w-9 sm:w-11 h-9 sm:h-10 shrink-0 bg-slate-100 hover:bg-slate-200 text-blue-700 rounded-lg font-black text-sm flex items-center justify-center"
                          >
                            -
                          </button>
                          <input
                            type="text"
                            value={den1}
                            onChange={(e) => handleInputChange(setDenominator1, e.target.value, { num: num1, setNum: setNum1, den: den1 }, true)}
                            className="w-full min-w-0 flex-1 text-center font-mono font-black text-base sm:text-lg text-blue-600 bg-blue-50/50 rounded-lg py-1 outline-none border border-blue-200"
                          />
                          <button
                            type="button"
                            onClick={() => adjustValue1('den', 1)}
                            className="w-9 sm:w-11 h-9 sm:h-10 shrink-0 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-black text-sm flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* SLIDER ΠΟΛΛΑΠΛΑΣΙΑΣΤΗ */}
                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                        <span>Πολλαπλασιαστής:</span>
                        <span className="font-mono font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200">
                          × {safeMultiplier}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max={MAX_MULTIPLIER}
                        value={safeMultiplier}
                        onChange={(e) => setMultiplier(Number(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
                      />
                      <div className="flex justify-between text-[9px] text-slate-400 font-mono font-bold">
                        <span>×2</span>
                        <span>×4</span>
                        <span>×6</span>
                        <span>×8</span>
                        <span>×10</span>
                      </div>
                    </div>

                    {/* PRESETS */}
                    <div className="space-y-2 pt-2 border-t border-slate-200">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                        Ετοιμα Παραδειγματα:
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {PRESETS_CREATE.map((p, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setNum1(p.num);
                              setDenominator1(p.den);
                              setMultiplier(p.mult);
                            }}
                            className={`py-2 px-1 rounded-xl border font-mono font-black text-xs transition-all text-center ${
                              activeNum1 === p.num && activeDen1 === p.den && safeMultiplier === p.mult
                                ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs'
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* TAB 2: ΑΝΑΓΩΓΟ */
                <div className="space-y-4">
                  <div className="space-y-3">
                    <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                      Κλασμα για Απλοποιηση:
                    </span>

                    <div className="grid grid-cols-2 gap-3">
                      {/* ΑΡΙΘΜΗΤΗΣ */}
                      <div className="bg-white p-3 rounded-2xl border border-emerald-200 shadow-xs space-y-1 text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Αριθμητης</span>
                        <div className="flex items-center gap-1.5 sm:gap-2 w-full">
                          <button
                            type="button"
                            onClick={() => adjustValue2('num', -1)}
                            className="w-9 sm:w-11 h-9 sm:h-10 shrink-0 bg-slate-100 hover:bg-slate-200 text-emerald-700 rounded-lg font-black text-sm flex items-center justify-center"
                          >
                            -
                          </button>
                          <input
                            type="text"
                            value={num2}
                            onChange={(e) => handleInputChange(setNum2, e.target.value, { num: num2, setNum: setNum2, den: den2 }, false)}
                            className="w-full min-w-0 flex-1 text-center font-mono font-black text-base sm:text-lg text-emerald-600 bg-emerald-50/50 rounded-lg py-1 outline-none border border-emerald-200"
                          />
                          <button
                            type="button"
                            onClick={() => adjustValue2('num', 1)}
                            className="w-9 sm:w-11 h-9 sm:h-10 shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-black text-sm flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* ΠΑΡΟΝΟΜΑΣΤΗΣ */}
                      <div className="bg-white p-3 rounded-2xl border border-emerald-200 shadow-xs space-y-1 text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Παρονομαστης</span>
                        <div className="flex items-center gap-1.5 sm:gap-2 w-full">
                          <button
                            type="button"
                            onClick={() => adjustValue2('den', -1)}
                            className="w-9 sm:w-11 h-9 sm:h-10 shrink-0 bg-slate-100 hover:bg-slate-200 text-emerald-700 rounded-lg font-black text-sm flex items-center justify-center"
                          >
                            -
                          </button>
                          <input
                            type="text"
                            value={den2}
                            onChange={(e) => handleInputChange(setDenominator2, e.target.value, { num: num2, setNum: setNum2, den: den2 }, true)}
                            className="w-full min-w-0 flex-1 text-center font-mono font-black text-base sm:text-lg text-emerald-600 bg-emerald-50/50 rounded-lg py-1 outline-none border border-emerald-200"
                          />
                          <button
                            type="button"
                            onClick={() => adjustValue2('den', 1)}
                            className="w-9 sm:w-11 h-9 sm:h-10 shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-black text-sm flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* BOX Μ.Κ.Δ. */}
                    <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1 shadow-xs">
                      <span className="font-black uppercase tracking-wider block text-[10px]">
                        🔍 Μεγιστος Κοινος Διαιρετης:
                      </span>
                      <p>
                        Μ.Κ.Δ.({activeNum2}, {activeDen2}) ＝ <strong>{gcd}</strong>.
                        {gcd === 1 ? " Το κλάσμα είναι ήδη ανάγωγο!" : ` Διαιρούμε και τους δύο όρους με το ${gcd}.`}
                      </p>
                    </div>

                    {/* PRESETS REDUCE */}
                    <div className="space-y-2 pt-2 border-t border-slate-200">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                        Ετοιμα Παραδειγματα:
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {PRESETS_REDUCE.map((p, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setNum2(p.num);
                              setDenominator2(p.den);
                            }}
                            className={`py-2 px-1 rounded-xl border font-mono font-black text-xs transition-all text-center ${
                              activeNum2 === p.num && activeDen2 === p.den
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-105'
                                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs'
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-[11px] text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                💡 Τα ισοδύναμα κλάσματα έχουν την <strong>ίδια ακριβώς δεκαδική αξία</strong>!
              </div>
            </div>

            {/* RIGHT: VISUALIZATION & DIAGRAMS (8 COLS) */}
            <div className="lg:col-span-8 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[460px] sm:min-h-[520px] space-y-6">
              
              {activeTab === 'create' ? (
                /* TAB 1: ΔΗΜΙΟΥΡΓΙΑ */
                <div className="space-y-6 flex-1 flex flex-col justify-between">
                  {/* Μαθηματική Πράξη */}
                  <div className="flex items-center justify-center p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 overflow-x-auto shadow-2xs">
                    <div className="flex items-center gap-3 sm:gap-4 font-mono text-lg sm:text-xl md:text-2xl font-black">
                      <div className="flex flex-col items-center">
                        <span className="text-blue-600">{activeNum1}</span>
                        <div className="w-9 sm:w-10 h-1 bg-slate-800 my-1 rounded-full" />
                        <span className="text-blue-600">{activeDen1}</span>
                      </div>

                      <div className="text-slate-400 text-[11px] sm:text-xs font-sans font-bold text-center bg-white px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                        <div>× {safeMultiplier}</div>
                        <div className="border-t border-slate-200 my-0.5" />
                        <div>× {safeMultiplier}</div>
                      </div>

                      <span className="text-slate-400 font-light">＝</span>

                      <div className="flex flex-col items-center">
                        <span className="text-indigo-600">{isoNum}</span>
                        <div className="w-11 sm:w-12 h-1 bg-slate-800 my-1 rounded-full" />
                        <span className="text-indigo-600">{isoDen}</span>
                      </div>
                    </div>
                  </div>

                  {/* Γραφική Αναπαράσταση (Κυκλικά Σχήματα) */}
                  <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-6 bg-slate-50/70 rounded-3xl border border-slate-200 shadow-inner">
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-xs font-black text-slate-500 uppercase tracking-wider text-center">
                        Αρχικο Κλασμα ({activeNum1}/{activeDen1})
                      </span>
                      {renderPizzaDiagram(activeNum1, activeDen1, 'fill-blue-500', 'stroke-blue-700')}
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-xs font-black text-slate-500 uppercase tracking-wider text-center">
                        Ισοδυναμο Κλασμα ({isoNum}/{isoDen})
                      </span>
                      {renderPizzaDiagram(isoNum, isoDen, 'fill-indigo-500', 'stroke-indigo-700')}
                    </div>
                  </div>
                </div>
              ) : (
                /* TAB 2: ΑΝΑΓΩΓΟ */
                <div className="space-y-6 flex-1 flex flex-col justify-between">
                  {/* Μαθηματική Πράξη */}
                  <div className="flex items-center justify-center p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 overflow-x-auto shadow-2xs">
                    <div className="flex items-center gap-3 sm:gap-4 font-mono text-lg sm:text-xl md:text-2xl font-black">
                      <div className="flex flex-col items-center">
                        <span className="text-emerald-600">{activeNum2}</span>
                        <div className="w-9 sm:w-10 h-1 bg-slate-800 my-1 rounded-full" />
                        <span className="text-emerald-600">{activeDen2}</span>
                      </div>

                      <div className="text-slate-400 text-[11px] sm:text-xs font-sans font-bold text-center bg-white px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                        <div>÷ {gcd}</div>
                        <div className="border-t border-slate-200 my-0.5" />
                        <div>÷ {gcd}</div>
                      </div>

                      <span className="text-slate-400 font-light">＝</span>

                      <div className="flex flex-col items-center">
                        <span className="text-teal-600">{reducedNum}</span>
                        <div className="w-9 sm:w-10 h-1 bg-slate-800 my-1 rounded-full" />
                        <span className="text-teal-600">{reducedDen}</span>
                      </div>
                    </div>
                  </div>

                  {/* Γραφική Αναπαράσταση (Κυκλικά Σχήματα) */}
                  <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-6 bg-slate-50/70 rounded-3xl border border-slate-200 shadow-inner">
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-xs font-black text-slate-500 uppercase tracking-wider text-center">
                        Αρχικο Κλασμα ({activeNum2}/{activeDen2})
                      </span>
                      {renderPizzaDiagram(activeNum2, activeDen2, 'fill-emerald-500', 'stroke-emerald-700')}
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-xs font-black text-slate-500 uppercase tracking-wider text-center">
                        Αναγωγο Κλασμα ({reducedNum}/{reducedDen})
                      </span>
                      {renderPizzaDiagram(reducedNum, reducedDen, 'fill-teal-500', 'stroke-teal-700')}
                    </div>
                  </div>
                </div>
              )}

              {/* Τελική Επιβεβαίωση Αξίας */}
              <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-700 text-white p-3.5 sm:p-4 rounded-2xl text-center font-mono font-black text-xs sm:text-sm shadow-md">
                ⚖️ Οπτική Επιβεβαίωση: Παρατήρησε ότι οι χρωματισμένες επιφάνειες στους δύο κύκλους είναι ακριβώς ίσες!
              </div>

            </div>

          </div>
        </div>

        {/* BOTTOM CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-lg text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
            <p className="text-gray-800 text-sm md:text-base">
              Έμαθες να δημιουργείς ισοδύναμα και να απλοποιείς σε ανάγωγο κλάσμα; Δοκίμασε τις διαδραστικές ασκήσεις!
            </p>
          </div>
          <Link
            href="/st-dimotikou/25-isodinama-klasmata-ask"
            className="bg-gray-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-xl transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            Ξεκίνα τις Ασκήσεις ➔
          </Link>
        </div>

      </div>
    </Layout>
  );
}
