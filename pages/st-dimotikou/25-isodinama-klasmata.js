// pages/st-dimotikou/25-isodinama-klasmata.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Μεγιστες επιτρεπομενες τιμες
const MAX_VALUE = 100;
const MAX_MULTIPLIER = 10;

// Συναρτηση αφαιρεσης τονων για κεφαλαια (εξαιρειται το ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  const cleaned = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
  return cleaned.replace(/\bΣΤ\b/g, "ΣΤ'");
}

// Μορφοποιηση αριθμων με ελληνικο locale και defensive checks
function formatNum(num) {
  if (num === null || num === undefined || isNaN(Number(num))) return '0';
  return Number(num).toLocaleString('el-GR');
}

const PRESETS_CREATE = [
  { num: 1, den: 2, mult: 2, label: '1/2 (· 2)' },
  { num: 2, den: 3, mult: 3, label: '2/3 (· 3)' },
  { num: 3, den: 4, mult: 2, label: '3/4 (· 2)' },
  { num: 2, den: 5, mult: 4, label: '2/5 (· 4)' }
];

const PRESETS_REDUCE = [
  { num: 6, den: 8, label: '6/8 (Μ.Κ.Δ. ＝ 2)' },
  { num: 12, den: 18, label: '12/18 (Μ.Κ.Δ. ＝ 6)' },
  { num: 15, den: 20, label: '15/20 (Μ.Κ.Δ. ＝ 5)' },
  { num: 9, den: 12, label: '9/12 (Μ.Κ.Δ. ＝ 3)' }
];

export default function IsodinamaKlasmataPage() {
  const [activeTab, setActiveTab] = useState('create'); // 'create' η 'reduce'

  // Κατασταση για τη Λειτουργια 1 (Δημιουργια Ισοδυναμου)
  const [num1, setNum1] = useState(1);
  const [den1, setDenominator1] = useState(2);
  const [multiplier, setMultiplier] = useState(3);

  // Κατασταση για τη Λειτουργια 2 (Μετατροπη σε Αναγωγο)
  const [num2, setNum2] = useState(6);
  const [den2, setDenominator2] = useState(8);

  // Συναρτησεις ασφαλους εισαγωγης
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

  // Αυξομειωση με κουμπια για τη Λειτουργια 1
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

  // Αυξομειωση με κουμπια για τη Λειτουργια 2
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

  // Αλγοριθμος Ευκλειδη για ευρεση ΜΚΔ
  const findGcd = (a, b) => {
    let x = Math.abs(a);
    let y = Math.abs(b);
    while (y) {
      const t = y;
      y = x % y;
      x = t;
    }
    return x;
  };

  // Υπολογισμοι για τη Λειτουργια 1 (Δημιουργια)
  const activeNum1 = num1 === '' ? 0 : Number(num1);
  const activeDen1 = den1 === '' || den1 === 0 ? 1 : Number(den1);
  const safeMultiplier = Math.min(multiplier, MAX_MULTIPLIER);

  const isoNum = activeNum1 * safeMultiplier;
  const isoDen = activeDen1 * safeMultiplier;

  // Υπολογισμοι για τη Λειτουργια 2 (Αναγωγο)
  const activeNum2 = num2 === '' ? 0 : Number(num2);
  const activeDen2 = den2 === '' || den2 === 0 ? 1 : Number(den2);
  const gcd = findGcd(activeNum2, activeDen2) || 1;

  const reducedNum = activeNum2 / gcd;
  const reducedDen = activeDen2 / gcd;

  // Σχεδιαση της πιτσας (Κυκλικο Σχημα SVG)
  const renderPizzaDiagram = (num, den, fillColor = 'fill-blue-500', strokeColor = 'stroke-blue-700') => {
    const slices = [];
    const radius = 60;
    const cx = 75;
    const cy = 75;
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
      <svg width="150" height="150" viewBox="0 0 150 150" className="drop-shadow-xs overflow-visible shrink-0 max-w-full">
        {slices}
        <circle cx={cx} cy={cy} r="2.5" className="fill-slate-800" />
      </svg>
    );
  };

  return (
    <Layout
      title="Ισοδύναμα Κλάσματα & Ανάγωγο - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μάθε πώς δημιουργούμε ισοδύναμα κλάσματα πολλαπλασιάζοντας τους όρους τους και πώς τα απλοποιούμε με τον Μ.Κ.Δ. για να φτάσουμε στο απλούστερο ανάγωγο κλάσμα για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/25-isodinama-klasmata-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 Ασκήσεις</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 sm:space-y-10 2xl:space-y-14 pb-28 sm:pb-32 overflow-x-hidden">

        {/* 1. HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>ΚΕΦΑΛΑΙΟ 25 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Ισοδύναμα Κλάσματα και Απλοποίηση σε Ανάγωγο
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Μάθε πώς δημιουργούμε <strong>ισοδύναμα κλάσματα</strong> πολλαπλασιάζοντας τους όρους τους και πώς τα <strong>απλοποιούμε με τον Μ.Κ.Δ.</strong> για να φτάσουμε στο απλούστερο <strong>ανάγωγο κλάσμα</strong>!
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Διαδραστική Δημιουργία &amp; Απλοποίηση με Οπτική Επιβεβαίωση Επιφανειών</span>
            </div>
            <Link
              href="/st-dimotikou/25-isodinama-klasmata-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base"
            >
              <span>Δοκίμασε τις Ασκήσεις</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΘΕΩΡΙΑΣ (3 COLS) */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
              Βασικές Έννοιες, Δημιουργία Ισοδυνάμων &amp; Απλοποίηση
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Πώς διατηρείται η αξία ενός κλάσματος και πώς φτάνουμε στην απλούστερη μορφή του.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 2xl:gap-8">
            
            {/* ΚΑΡΤΑ 1 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΟΡΙΣΜΟΣ
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Ίδια Ποσότητα</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Τι είναι τα Ισοδύναμα;
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Είναι τα κλάσματα που έχουν διαφορετικούς όρους, αλλά εκφράζουν την <strong>ίδια ακριβώς ποσότητα ή αξία</strong>.
                </p>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center flex items-center justify-center gap-2 font-bold">
                  <span className="bg-white px-3 py-1 rounded-xl border border-slate-200 text-slate-800">
                    1/2 ＝ <strong className="text-sky-700">2/4</strong> ＝ <strong className="text-sky-700">4/8</strong>
                  </span>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Αν κάνεις τη διαίρεση σε όλα τα ισοδύναμα κλάσματα, θα βρεις τον ίδιο ακριβώς δεκαδικό αριθμό!
              </div>
            </article>

            {/* ΚΑΡΤΑ 2 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΜΕΘΟΔΟΣ
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-indigo-600">Ίδιος Αριθμός</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Δημιουργία Ισοδυνάμων
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  <strong>Πολλαπλασιάζουμε</strong> ή <strong>διαιρούμε</strong> και τον αριθμητή και τον παρονομαστή με τον <strong>ίδιο φυσικό αριθμό</strong> (διάφορο του 0).
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>(1 · 3) / (2 · 3) ＝ <strong className="text-indigo-700">3/6</strong></p>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                ⚡ <strong>Κανόνας SOS:</strong> Ό,τι πράξη κάνεις στον αριθμητή, πρέπει υποχρεωτικά να την κάνεις και στον παρονομαστή!
              </div>
            </article>

            {/* ΚΑΡΤΑ 3 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΑΠΛΟΠΟΙΗΣΗ
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-emerald-600">Με Μ.Κ.Δ.</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Ανάγωγο Κλάσμα
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Είναι το κλάσμα που <strong>δεν μπορεί να απλοποιηθεί άλλο</strong>. Προκύπτει διαιρώντας τους όρους με τον <strong>Μ.Κ.Δ.</strong> τους!
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>6/8 (: 2) ➔ <strong className="text-emerald-700">3/4</strong> (Ανάγωγο)</p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🎯 Στο ανάγωγο κλάσμα, ο αριθμητής και ο παρονομαστής έχουν Μ.Κ.Δ. ίσο με το 1 (είναι πρώτοι μεταξύ τους).
              </div>
            </article>

          </div>
        </section>

        {/* 3. TABS SELECTOR */}
        <div className="flex justify-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner max-w-md mx-auto gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('create')}
            className={`flex-1 text-center py-2.5 rounded-xl text-xs md:text-sm font-black transition-all touch-manipulation active:scale-95 ${
              activeTab === 'create' ? 'bg-blue-600 text-white shadow-sm scale-105' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🛠️ {toCleanUppercase('Δημιουργία Ισοδυνάμου')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reduce')}
            className={`flex-1 text-center py-2.5 rounded-xl text-xs md:text-sm font-black transition-all touch-manipulation active:scale-95 ${
              activeTab === 'reduce' ? 'bg-emerald-600 text-white shadow-sm scale-105' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🎯 {toCleanUppercase('Μετατροπή σε Ανάγωγο')}
          </button>
        </div>

        {/* 4. INTERACTIVE PLAYGROUND */}
        <section className="bg-white p-4 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6 sm:space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Διαδραστικό Εργαστήριο Ισοδυναμίας και Απλοποίησης
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-1">
                {activeTab === 'create'
                  ? 'Δώσε ένα κλάσμα, επίλεξε πολλαπλασιαστή και παρατήρησε πώς προκύπτει το νέο ισοδύναμο κλάσμα!'
                  : 'Δώσε ένα σύνθετο κλάσμα και δες βήμα προς βήμα την απλοποίησή του μέσω του Μ.Κ.Δ. σε ανάγωγο!'}
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
                    <span className="text-xs 2xl:text-sm font-black text-slate-700 uppercase tracking-wider block">
                      1. ΑΡΧΙΚΟ ΚΛΑΣΜΑ:
                    </span>

                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      {/* ΑΡΙΘΜΗΤΗΣ */}
                      <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-blue-200 shadow-xs space-y-1 text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">ΑΡΙΘΜΗΤΗΣ</span>
                        <div className="flex items-center gap-1 sm:gap-1.5 w-full">
                          <button
                            type="button"
                            onClick={() => adjustValue1('num', -1)}
                            className="w-7 sm:w-8 h-8 sm:h-9 shrink-0 bg-slate-100 hover:bg-slate-200 text-blue-700 rounded-lg font-black text-sm flex items-center justify-center touch-manipulation active:scale-95"
                          >
                            －
                          </button>
                          <input
                            key={`num1-${num1}`}
                            type="text"
                            inputMode="numeric"
                            autoComplete="off"
                            spellCheck="false"
                            value={num1 === '' ? '' : String(num1)}
                            onChange={(e) => handleInputChange(setNum1, e.target.value, { num: num1, setNum: setNum1, den: den1 }, false)}
                            className="w-full min-w-0 flex-1 text-center font-mono font-black text-base sm:text-lg text-blue-600 bg-blue-50/50 rounded-lg py-1 px-0.5 outline-none border border-blue-200 shadow-inner"
                          />
                          <button
                            type="button"
                            onClick={() => adjustValue1('num', 1)}
                            className="w-7 sm:w-8 h-8 sm:h-9 shrink-0 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-black text-sm flex items-center justify-center touch-manipulation active:scale-95"
                          >
                            ＋
                          </button>
                        </div>
                      </div>

                      {/* ΠΑΡΟΝΟΜΑΣΤΗΣ */}
                      <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-blue-200 shadow-xs space-y-1 text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">ΠΑΡΟΝΟΜΑΣΤΗΣ</span>
                        <div className="flex items-center gap-1 sm:gap-1.5 w-full">
                          <button
                            type="button"
                            onClick={() => adjustValue1('den', -1)}
                            className="w-7 sm:w-8 h-8 sm:h-9 shrink-0 bg-slate-100 hover:bg-slate-200 text-blue-700 rounded-lg font-black text-sm flex items-center justify-center touch-manipulation active:scale-95"
                          >
                            －
                          </button>
                          <input
                            key={`den1-${den1}`}
                            type="text"
                            inputMode="numeric"
                            autoComplete="off"
                            spellCheck="false"
                            value={den1 === '' ? '' : String(den1)}
                            onChange={(e) => handleInputChange(setDenominator1, e.target.value, { num: num1, setNum: setNum1, den: den1 }, true)}
                            className="w-full min-w-0 flex-1 text-center font-mono font-black text-base sm:text-lg text-blue-600 bg-blue-50/50 rounded-lg py-1 px-0.5 outline-none border border-blue-200 shadow-inner"
                          />
                          <button
                            type="button"
                            onClick={() => adjustValue1('den', 1)}
                            className="w-7 sm:w-8 h-8 sm:h-9 shrink-0 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-black text-sm flex items-center justify-center touch-manipulation active:scale-95"
                          >
                            ＋
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* SLIDER ΠΟΛΛΑΠΛΑΣΙΑΣΤΗ */}
                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                        <span>Πολλαπλασιαστής:</span>
                        <span className="font-mono font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200">
                          · {safeMultiplier}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max={MAX_MULTIPLIER}
                        value={safeMultiplier}
                        onChange={(e) => setMultiplier(Number(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none touch-manipulation"
                      />
                      <div className="flex justify-between text-[9px] text-slate-400 font-mono font-bold">
                        <span>· 2</span>
                        <span>· 4</span>
                        <span>· 6</span>
                        <span>· 8</span>
                        <span>· 10</span>
                      </div>
                    </div>

                    {/* PRESETS */}
                    <div className="space-y-2 pt-2 border-t border-slate-200">
                      <span className="text-[10px] sm:text-xs font-black uppercase text-slate-400 tracking-wider block">
                        ΕΤΟΙΜΑ ΠΑΡΑΔΕΙΓΜΑΤΑ:
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
                            className={`py-2 px-1 rounded-xl border font-mono font-black text-xs transition-all text-center touch-manipulation active:scale-95 ${
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
                    <span className="text-xs 2xl:text-sm font-black text-slate-700 uppercase tracking-wider block">
                      ΚΛΑΣΜΑ ΓΙΑ ΑΠΛΟΠΟΙΗΣΗ:
                    </span>

                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      {/* ΑΡΙΘΜΗΤΗΣ */}
                      <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-emerald-200 shadow-xs space-y-1 text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">ΑΡΙΘΜΗΤΗΣ</span>
                        <div className="flex items-center gap-1 sm:gap-1.5 w-full">
                          <button
                            type="button"
                            onClick={() => adjustValue2('num', -1)}
                            className="w-7 sm:w-8 h-8 sm:h-9 shrink-0 bg-slate-100 hover:bg-slate-200 text-emerald-700 rounded-lg font-black text-sm flex items-center justify-center touch-manipulation active:scale-95"
                          >
                            －
                          </button>
                          <input
                            key={`num2-${num2}`}
                            type="text"
                            inputMode="numeric"
                            autoComplete="off"
                            spellCheck="false"
                            value={num2 === '' ? '' : String(num2)}
                            onChange={(e) => handleInputChange(setNum2, e.target.value, { num: num2, setNum: setNum2, den: den2 }, false)}
                            className="w-full min-w-0 flex-1 text-center font-mono font-black text-base sm:text-lg text-emerald-600 bg-emerald-50/50 rounded-lg py-1 px-0.5 outline-none border border-emerald-200 shadow-inner"
                          />
                          <button
                            type="button"
                            onClick={() => adjustValue2('num', 1)}
                            className="w-7 sm:w-8 h-8 sm:h-9 shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-black text-sm flex items-center justify-center touch-manipulation active:scale-95"
                          >
                            ＋
                          </button>
                        </div>
                      </div>

                      {/* ΠΑΡΟΝΟΜΑΣΤΗΣ */}
                      <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-emerald-200 shadow-xs space-y-1 text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">ΠΑΡΟΝΟΜΑΣΤΗΣ</span>
                        <div className="flex items-center gap-1 sm:gap-1.5 w-full">
                          <button
                            type="button"
                            onClick={() => adjustValue2('den', -1)}
                            className="w-7 sm:w-8 h-8 sm:h-9 shrink-0 bg-slate-100 hover:bg-slate-200 text-emerald-700 rounded-lg font-black text-sm flex items-center justify-center touch-manipulation active:scale-95"
                          >
                            －
                          </button>
                          <input
                            key={`den2-${den2}`}
                            type="text"
                            inputMode="numeric"
                            autoComplete="off"
                            spellCheck="false"
                            value={den2 === '' ? '' : String(den2)}
                            onChange={(e) => handleInputChange(setDenominator2, e.target.value, { num: num2, setNum: setNum2, den: den2 }, true)}
                            className="w-full min-w-0 flex-1 text-center font-mono font-black text-base sm:text-lg text-emerald-600 bg-emerald-50/50 rounded-lg py-1 px-0.5 outline-none border border-emerald-200 shadow-inner"
                          />
                          <button
                            type="button"
                            onClick={() => adjustValue2('den', 1)}
                            className="w-7 sm:w-8 h-8 sm:h-9 shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-black text-sm flex items-center justify-center touch-manipulation active:scale-95"
                          >
                            ＋
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* BOX Μ.Κ.Δ. */}
                    <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1 shadow-xs">
                      <span className="font-black uppercase tracking-wider block text-[10px]">
                        🔍 ΜΕΓΙΣΤΟΣ ΚΟΙΝΟΣ ΔΙΑΙΡΕΤΗΣ:
                      </span>
                      <p>
                        Μ.Κ.Δ.({activeNum2}, {activeDen2}) ＝ <strong>{gcd}</strong>.
                        {gcd === 1 ? ' Το κλάσμα είναι ήδη ανάγωγο!' : ` Διαιρούμε και τους δύο όρους με το ${gcd}.`}
                      </p>
                    </div>

                    {/* PRESETS REDUCE */}
                    <div className="space-y-2 pt-2 border-t border-slate-200">
                      <span className="text-[10px] sm:text-xs font-black uppercase text-slate-400 tracking-wider block">
                        ΕΤΟΙΜΑ ΠΑΡΑΔΕΙΓΜΑΤΑ:
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
                            className={`py-2 px-1 rounded-xl border font-mono font-black text-xs transition-all text-center touch-manipulation active:scale-95 ${
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

              <div className="text-[11px] sm:text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200 mt-3">
                💡 Τα ισοδύναμα κλάσματα έχουν την <strong>ίδια ακριβώς δεκαδική αξία</strong>!
              </div>
            </div>

            {/* RIGHT: VISUALIZATION & DIAGRAMS (8 COLS) */}
            <div className="lg:col-span-8 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[460px] sm:min-h-[520px] space-y-6">
              
              {activeTab === 'create' ? (
                /* TAB 1: ΔΗΜΙΟΥΡΓΙΑ */
                <div className="space-y-6 flex-1 flex flex-col justify-between">
                  {/* Μαθηματική Πράξη */}
                  <div className="flex items-center justify-center p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 overflow-x-auto shadow-xs">
                    <div className="flex items-center gap-2.5 sm:gap-4 font-mono text-base sm:text-xl md:text-2xl font-black">
                      <div className="flex flex-col items-center">
                        <span className="text-blue-600">{activeNum1}</span>
                        <div className="w-8 sm:w-10 h-1 bg-slate-800 my-1 rounded-full" />
                        <span className="text-blue-600">{activeDen1}</span>
                      </div>

                      <div className="text-slate-500 text-[10px] sm:text-xs font-sans font-bold text-center bg-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-slate-200 shadow-xs">
                        <div>· {safeMultiplier}</div>
                        <div className="border-t border-slate-200 my-0.5" />
                        <div>· {safeMultiplier}</div>
                      </div>

                      <span className="text-slate-400 font-light">＝</span>

                      <div className="flex flex-col items-center">
                        <span className="text-indigo-600">{isoNum}</span>
                        <div className="w-9 sm:w-12 h-1 bg-slate-800 my-1 rounded-full" />
                        <span className="text-indigo-600">{isoDen}</span>
                      </div>
                    </div>
                  </div>

                  {/* Γραφική Αναπαράσταση (Κυκλικά Σχήματα) */}
                  <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-6 bg-slate-50/70 rounded-3xl border border-slate-200 shadow-inner">
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-xs font-black text-slate-500 uppercase tracking-wider text-center">
                        ΑΡΧΙΚΟ ΚΛΑΣΜΑ ({activeNum1}/{activeDen1})
                      </span>
                      {renderPizzaDiagram(activeNum1, activeDen1, 'fill-blue-500', 'stroke-blue-700')}
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-xs font-black text-slate-500 uppercase tracking-wider text-center">
                        ΙΣΟΔΥΝΑΜΟ ΚΛΑΣΜΑ ({isoNum}/{isoDen})
                      </span>
                      {renderPizzaDiagram(isoNum, isoDen, 'fill-indigo-500', 'stroke-indigo-700')}
                    </div>
                  </div>
                </div>
              ) : (
                /* TAB 2: ΑΝΑΓΩΓΟ */
                <div className="space-y-6 flex-1 flex flex-col justify-between">
                  {/* Μαθηματική Πράξη */}
                  <div className="flex items-center justify-center p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 overflow-x-auto shadow-xs">
                    <div className="flex items-center gap-2.5 sm:gap-4 font-mono text-base sm:text-xl md:text-2xl font-black">
                      <div className="flex flex-col items-center">
                        <span className="text-emerald-600">{activeNum2}</span>
                        <div className="w-8 sm:w-10 h-1 bg-slate-800 my-1 rounded-full" />
                        <span className="text-emerald-600">{activeDen2}</span>
                      </div>

                      <div className="text-slate-500 text-[10px] sm:text-xs font-sans font-bold text-center bg-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-slate-200 shadow-xs">
                        <div>: {gcd}</div>
                        <div className="border-t border-slate-200 my-0.5" />
                        <div>: {gcd}</div>
                      </div>

                      <span className="text-slate-400 font-light">＝</span>

                      <div className="flex flex-col items-center">
                        <span className="text-teal-600">{reducedNum}</span>
                        <div className="w-8 sm:w-10 h-1 bg-slate-800 my-1 rounded-full" />
                        <span className="text-teal-600">{reducedDen}</span>
                      </div>
                    </div>
                  </div>

                  {/* Γραφική Αναπαράσταση (Κυκλικά Σχήματα) */}
                  <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-6 bg-slate-50/70 rounded-3xl border border-slate-200 shadow-inner">
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-xs font-black text-slate-500 uppercase tracking-wider text-center">
                        ΑΡΧΙΚΟ ΚΛΑΣΜΑ ({activeNum2}/{activeDen2})
                      </span>
                      {renderPizzaDiagram(activeNum2, activeDen2, 'fill-emerald-500', 'stroke-emerald-700')}
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-xs font-black text-slate-500 uppercase tracking-wider text-center">
                        ΑΝΑΓΩΓΟ ΚΛΑΣΜΑ ({reducedNum}/{reducedDen})
                      </span>
                      {renderPizzaDiagram(reducedNum, reducedDen, 'fill-teal-500', 'stroke-teal-700')}
                    </div>
                  </div>
                </div>
              )}

              {/* Τελική Επιβεβαίωση Αξίας */}
              <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-700 text-white p-3.5 sm:p-4 rounded-2xl text-center font-mono font-black text-xs sm:text-sm shadow-md">
                ⚖️ ΟΠΤΙΚΗ ΕΠΙΒΕΒΑΙΩΣΗ: Οι χρωματισμένες επιφάνειες στους δύο κύκλους είναι ακριβώς ίσες!
              </div>

            </div>

          </div>
        </section>

        {/* 5. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στα Ισοδύναμα Κλάσματα!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Έμαθες να δημιουργείς ισοδύναμα και να απλοποιείς σε ανάγωγο κλάσμα; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να εμπεδώσεις τις γνώσεις σου!
            </p>
          </div>

          <Link
            href="/st-dimotikou/25-isodinama-klasmata-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-sm sm:text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 {toCleanUppercase('Έναρξη Ασκήσεων')}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
