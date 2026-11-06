import React, { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Component Frac με ασφαλή ανίχνευση προσήμου
const Frac = ({ num, den, className = "" }) => {
  const numStr = String(num).trim();
  const denStr = String(den).trim();

  const isNumNeg = numStr.startsWith('-');
  const isDenNeg = denStr.startsWith('-');
  const isNegative = (isNumNeg && !isDenNeg) || (!isNumNeg && isDenNeg);

  const cleanNum = numStr.replace('-', '');
  const cleanDen = denStr.replace('-', '');

  return (
    <span className={`inline-flex items-center align-middle mx-1 font-mono font-semibold whitespace-nowrap ${className}`}>
      {isNegative && <span className="mr-0.5 text-base sm:text-lg font-bold">-</span>}
      <span className="inline-flex flex-col items-center text-center leading-none text-xs sm:text-sm">
        <span className="border-b border-current px-1 pb-0.5">{cleanNum}</span>
        <span className="pt-0.5 px-1">{cleanDen}</span>
      </span>
    </span>
  );
};

// Ενιαίο SVG σύμβολο ρίζας: μονοκόμματο σχήμα με οριζόντια γραμμή (vinculum)
const Sqrt = ({ children, className = "" }) => {
  return (
    <span className={`inline-flex items-center align-middle mx-1 relative font-mono font-semibold whitespace-nowrap ${className}`}>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none text-current overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d="M 0 58 L 4 52 L 10 92 L 16 6 L 100 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="pl-4 sm:pl-4.5 pr-1 pt-1 pb-0.5 leading-none inline-flex items-center">
        {children}
      </span>
    </span>
  );
};

// Component Power: σκούρο χρώμα, παρένθεση ΜΟΝΟ σε αρνητικό εκθέτη, προστασία από σπάσιμο
const Power = ({ base, exp, className = "" }) => {
  const expNum = typeof exp === 'number' ? exp : parseInt(String(exp).replace(/[()]/g, ''), 10);
  const isNeg = !isNaN(expNum) ? expNum < 0 : String(exp).startsWith('-');
  const formattedExp = isNeg ? `(${exp})` : `${exp}`;

  return (
    <span className={`inline-flex items-baseline font-mono whitespace-nowrap ${className}`}>
      <span>{base}</span>
      <sup className="relative -top-[0.6em] text-slate-900 font-bold ml-0.5 text-xs sm:text-sm">
        {formattedExp}
      </sup>
    </span>
  );
};

// Component Power για σκούρο φόντο
const DarkPower = ({ base, exp, className = "" }) => {
  const expNum = typeof exp === 'number' ? exp : parseInt(String(exp).replace(/[()]/g, ''), 10);
  const isNeg = !isNaN(expNum) ? expNum < 0 : String(exp).startsWith('-');
  const formattedExp = isNeg ? `(${exp})` : `${exp}`;

  return (
    <span className={`inline-flex items-baseline font-mono whitespace-nowrap ${className}`}>
      <span>{base}</span>
      <sup className="relative -top-[0.65em] text-amber-400 font-bold ml-0.5 text-[0.65em] leading-none">
        {formattedExp}
      </sup>
    </span>
  );
};

// Προκαθορισμένα σημεία για την Ευθεία Πραγματικών (Εργαστήριο 1)
const NUMBER_LINE_POINTS = [
  { label: '√2', value: 1.414, exact: <Sqrt>2</Sqrt>, approx: '≈ 1,414', cat: 'ΑΡΡΗΤΟΣ', construction: 'Υποτείνουσα ορθογωνίου τριγώνου 1 × 1: c² = 1² + 1² = 2' },
  { label: '√5', value: 2.236, exact: <Sqrt>5</Sqrt>, approx: '≈ 2,236', cat: 'ΑΡΡΗΤΟΣ', construction: 'Υποτείνουσα ορθογωνίου τριγώνου 2 × 1: c² = 2² + 1² = 5' },
  { label: 'π', value: 3.1415, exact: 'π', approx: '≈ 3,141', cat: 'ΑΡΡΗΤΟΣ', construction: 'Μήκος κύκλου διαμέτρου 1 (κύλιση τροχού)' },
  { label: '3/2', value: 1.5, exact: <Frac num="3" den="2" />, approx: '= 1,5', cat: 'ΡΗΤΟΣ', construction: 'Μέσο του διαστήματος [1, 2]' },
  { label: '-√2', value: -1.414, exact: <span>-<Sqrt>2</Sqrt></span>, approx: '≈ -1,414', cat: 'ΑΡΡΗΤΟΣ', construction: 'Συμμετρικό του √2 ως προς το 0' },
];

export default function PragmatikoiTheoria() {
  const [selectedPointIdx, setSelectedPointIdx] = useState(0);
  const [baseType, setBaseType] = useState('sqrt2');
  const [labExp, setLabExp] = useState(2);

  const selectedPoint = NUMBER_LINE_POINTS[selectedPointIdx];

  const calcPower = () => {
    if (baseType === 'sqrt2') {
      if (labExp === 2) return { str: '2', expl: '(√2)² = 2' };
      if (labExp === 4) return { str: '4', expl: '(√2)⁴ = ((√2)²)² = 2² = 4' };
      if (labExp === 0) return { str: '1', expl: '(√2)⁰ = 1' };
      if (labExp === -2) return { str: '1/2', expl: '(√2)⁻² = 1 / (√2)² = 1/2' };
      return { str: `(√2)^${labExp}`, expl: 'Υπολογίζεται με βάση τον πραγματικό √2' };
    }
    if (baseType === 'half') {
      if (labExp === 2) return { str: '1/4', expl: '(1/2)² = 1/4' };
      if (labExp === 3) return { str: '1/8', expl: '(1/2)³ = 1/8' };
      if (labExp === 0) return { str: '1', expl: '(1/2)⁰ = 1' };
      if (labExp === -1) return { str: '2', expl: '(1/2)⁻¹ = 2/1 = 2' };
      if (labExp === -2) return { str: '4', expl: '(1/2)⁻² = 2² = 4' };
      return { str: `(1/2)^${labExp}`, expl: 'Ιδιότητα κλάσματος με ακέραιο εκθέτη' };
    }
    if (baseType === 'minus3') {
      if (labExp === 2) return { str: '9', expl: '(-3)² = +9' };
      if (labExp === 3) return { str: '-27', expl: '(-3)³ = -27' };
      if (labExp === 0) return { str: '1', expl: '(-3)⁰ = 1' };
      if (labExp === -1) return { str: '-1/3', expl: '(-3)⁻¹ = -1/3' };
      if (labExp === -2) return { str: '1/9', expl: '(-3)⁻² = 1 / (-3)² = 1/9' };
      return { str: `(-3)^${labExp}`, expl: 'Αρνητική βάση με ακέραιο εκθέτη' };
    }
    return { str: '', expl: '' };
  };

  const powerResult = calcPower();

  return (
    <Layout
      title="Πραγματικοί Αριθμοί | Β' Γυμνασίου"
      description="Η έννοια των πραγματικών αριθμών, η γεωμετρική τοποθέτηση άρρητων στην ευθεία, δυνάμεις με βάση πραγματικό και τετράγωνοι αριθμοί."
      backUrl="/b-gymnasiou"
      backText="Β' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/b-gymnasiou/06-pragmatikoi-ask"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-sm sm:text-base transition-all shadow-md"
        >
          <span>🎯</span>
          <span>ΑΣΚΗΣΕΙΣ</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-10 sm:space-y-16">

        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 lg:p-14 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              Β' ΓΥΜΝΑΣΙΟΥ • ΕΝΟΤΗΤΑ 6
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white uppercase">
              ΤΟ ΣΥΝΟΛΟ ΤΩΝ ΠΡΑΓΜΑΤΙΚΩΝ ΑΡΙΘΜΩΝ
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              Ενοποιούμε ρητούς και άρρητους στο σύνολο των πραγματικών αριθμών, τοποθετούμε γεωμετρικά τα άρρητα μήκη στην ευθεία και επεκτείνουμε τις δυνάμεις και τους τετράγωνους αριθμούς.
            </p>
          </div>
        </section>

        {/* 1. ΤΟ ΣΥΝΟΛΟ ΤΩΝ ΠΡΑΓΜΑΤΙΚΩΝ ΑΡΙΘΜΩΝ (ℝ) */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                1
              </span>
              Η Δομή των Αριθμητικών Συνόλων
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            <div className="space-y-4">
              <p>
                Οι <strong>Πραγματικοί Αριθμοί</strong> (συμβολίζονται με <strong className="font-serif text-indigo-700 text-xl">ℝ</strong>) αποτελούνται από την ένωση όλων των <strong>Ρητών</strong> και όλων των <strong>Άρρητων</strong> αριθμών:
              </p>
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 font-mono text-center font-bold text-indigo-950 text-base sm:text-xl shadow-xs whitespace-nowrap">
                ℝ ＝ ℚ ∪ Άρρητοι
              </div>

              <div className="space-y-2 text-sm sm:text-base">
                <strong className="text-slate-900 block">Ιεραρχία Εγκλεισμού των Συνόλων:</strong>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-center font-bold text-slate-800 text-sm sm:text-base whitespace-nowrap">
                  ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ
                </div>
                <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-600">
                  <li><strong>Φυσικοί (ℕ):</strong> 0, 1, 2, 3, ...</li>
                  <li><strong>Ακέραιοι (ℤ):</strong> ..., -3, -2, -1, 0, 1, 2, 3, ...</li>
                  <li><strong>Ρητοί (ℚ):</strong> Κλάσματα α/β με α ακέραιο, β ≠ 0 (πεπερασμένοι ή περιοδικοί δεκαδικοί).</li>
                  <li className="flex items-center flex-wrap gap-1">
                    <span><strong>Άρρητοι:</strong> Αριθμοί με άπειρα μη περιοδικά ψηφία (π.χ. </span>
                    <Sqrt>2</Sqrt><span>, </span><Sqrt>3</Sqrt><span>, </span><Sqrt>5</Sqrt><span>, π).</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Τετράγωνοι Αριθμοί */}
            <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                ΤΕΤΡΑΓΩΝΟΙ ΑΡΙΘΜΟΙ & ΣΥΝΔΕΣΗ ΜΕ ΤΗ ΓΕΩΜΕΤΡΙΑ
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                <strong>Τετράγωνος αριθμός</strong> ονομάζεται κάθε φυσικός αριθμός που ισούται με το τετράγωνο κάποιου φυσικού αριθμού (δηλαδή <span className="font-mono font-bold whitespace-nowrap">α ＝ ν²</span>).
              </p>
              <div className="grid grid-cols-4 gap-2 text-center font-mono text-xs sm:text-sm">
                <div className="p-2 bg-white rounded-xl border border-slate-200">
                  <div className="text-slate-400">1²</div>
                  <div className="font-bold text-indigo-700">1</div>
                </div>
                <div className="p-2 bg-white rounded-xl border border-slate-200">
                  <div className="text-slate-400">2²</div>
                  <div className="font-bold text-indigo-700">4</div>
                </div>
                <div className="p-2 bg-white rounded-xl border border-slate-200">
                  <div className="text-slate-400">3²</div>
                  <div className="font-bold text-indigo-700">9</div>
                </div>
                <div className="p-2 bg-white rounded-xl border border-slate-200">
                  <div className="text-slate-400">4²</div>
                  <div className="font-bold text-indigo-700">16</div>
                </div>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
                💡 Αν ένας φυσικός αριθμός <strong>δεν είναι τετράγωνος</strong> (π.χ. 2, 3, 5, 6, 7), τότε η τετραγωνική του ρίζα είναι <strong>πάντοτε άρρητος αριθμός</strong>!
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΕΥΘΕΙΑ ΠΡΑΓΜΑΤΙΚΩΝ & ΤΟΠΟΘΕΤΗΣΗ ΑΡΡΗΤΩΝ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-50 text-amber-600 font-extrabold text-base sm:text-lg">
                2
              </span>
              🛠️ Εργαστήριο 1: Γεωμετρική Τοποθέτηση Άρρητων στην Ευθεία
            </h2>
          </div>

          <p className="text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            Κάθε πραγματικός αριθμός αντιστοιχεί σε <strong>ένα ακριβώς σημείο</strong> της ευθείας και αντίστροφα. Επίλεξε έναν αριθμό για να δεις τη γεωμετρική κατασκευή του με ορθογώνιο τρίγωνο και διαβήτη:
          </p>

          {/* Κουμπιά Επιλογής Σημείου */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase self-center mr-1">ΕΠΙΛΟΓΗ ΣΗΜΕΙΟΥ:</span>
            {NUMBER_LINE_POINTS.map((pt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedPointIdx(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all touch-manipulation whitespace-nowrap ${
                  selectedPointIdx === idx
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {pt.label}
              </button>
            ))}
          </div>

          {/* SVG Ευθεία των Πραγματικών & Γεωμετρική Κατασκευή */}
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-inner">
            <div className="w-full overflow-hidden">
              <svg viewBox="-250 -90 500 130" className="w-full max-w-2xl mx-auto h-auto overflow-visible select-none">
                {/* Κύριος Άξονας x'x */}
                <line x1="-220" y1="0" x2="220" y2="0" stroke="#94a3b8" strokeWidth="2.5" />
                <polygon points="220,-4 230,0 220,4" fill="#94a3b8" />
                <polygon points="-220,-4 -230,0 -220,4" fill="#94a3b8" />

                {/* Διαβαθμίσεις ακεραίων */}
                {[-3, -2, -1, 0, 1, 2, 3].map((val) => {
                  const x = val * 55;
                  return (
                    <g key={val}>
                      <line x1={x} y1="-6" x2={x} y2="6" stroke="#cbd5e1" strokeWidth="2" />
                      <text x={x} y="24" fill="#cbd5e1" fontSize="13" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* Γεωμετρική κατασκευή του √2 */}
                {selectedPoint.label === '√2' && (
                  <g>
                    <line x1="55" y1="0" x2="55" y2="-55" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="3,3" />
                    <line x1="0" y1="0" x2="55" y2="-55" stroke="#f59e0b" strokeWidth="3" />
                    <path d="M 55 -55 A 77.78 77.78 0 0 1 77.78 0" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,4" />
                    <text x="32" y="-32" fill="#f59e0b" fontSize="12" fontWeight="bold" fontFamily="monospace">c = √2</text>
                  </g>
                )}

                {/* Γεωμετρική κατασκευή του √5 */}
                {selectedPoint.label === '√5' && (
                  <g>
                    <line x1="110" y1="0" x2="110" y2="-55" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="3,3" />
                    <line x1="0" y1="0" x2="110" y2="-55" stroke="#f59e0b" strokeWidth="3" />
                    <path d="M 110 -55 A 122.98 122.98 0 0 1 122.98 0" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,4" />
                    <text x="60" y="-34" fill="#f59e0b" fontSize="12" fontWeight="bold" fontFamily="monospace">c = √5</text>
                  </g>
                )}

                {/* Επιλεγμένο Σημείο */}
                {(() => {
                  const targetX = selectedPoint.value * 55;
                  return (
                    <g>
                      <circle cx={targetX} cy="0" r="6" fill="#ec4899" stroke="#ffffff" strokeWidth="2" />
                      <line x1={targetX} y1="0" x2={targetX} y2="-18" stroke="#ec4899" strokeWidth="2" />
                      <text x={targetX} y="-24" fill="#ec4899" fontSize="14" fontWeight="black" textAnchor="middle" fontFamily="monospace">
                        {selectedPoint.label}
                      </text>
                    </g>
                  );
                })()}
              </svg>
            </div>

            {/* Επεξήγηση Κατασκευής */}
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2 text-xs sm:text-sm font-sans">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/10 pb-2">
                <span className="font-bold text-amber-300 inline-flex items-center gap-1.5 flex-nowrap">
                  <span>Σημείο:</span>
                  <span>{selectedPoint.exact}</span>
                  <span className="text-slate-300 font-normal">({selectedPoint.approx})</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  {selectedPoint.cat}
                </span>
              </div>
              <p className="text-slate-300">
                <strong>Τρόπος κατασκευής:</strong> {selectedPoint.construction}.
              </p>
            </div>
          </div>
        </section>

        {/* 3. ΔΥΝΑΜΕΙΣ ΜΕ ΒΑΣΗ ΠΡΑΓΜΑΤΙΚΟ & ΕΚΘΕΤΗ ΑΚΕΡΑΙΟ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-50 text-purple-600 font-extrabold text-base sm:text-lg">
                3
              </span>
              Δυνάμεις με Βάση Πραγματικό Αριθμό & Ακέραιο Εκθέτη
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            <div className="space-y-4">
              <p>
                Οι κανόνες και οι ιδιότητες των δυνάμεων ισχύουν <strong>για οποιαδήποτε πραγματική βάση</strong> <span className="font-mono font-bold whitespace-nowrap">α ∈ ℝ</span>:
              </p>
              <ul className="space-y-2 list-disc pl-5 text-slate-600 text-xs sm:text-sm font-mono">
                <li className="whitespace-nowrap"><Power base="α" exp={0} /> ＝ 1 (για κάθε α ≠ 0)</li>
                <li className="whitespace-nowrap"><Power base="α" exp={1} /> ＝ α</li>
                <li className="flex items-center flex-wrap gap-1">
                  <span><Power base="α" exp="-ν" /> ＝ </span>
                  <Frac num="1" den={<Power base="α" exp="ν" />} />
                  <span className="text-slate-500 font-sans text-xs">(για α ≠ 0 και ν φυσικό)</span>
                </li>
                <li className="flex items-center flex-wrap gap-1">
                  <span>(<Frac num="α" den="β" />)<sup className="relative -top-[0.6em] text-slate-900 font-bold ml-0.5 text-xs">(-ν)</sup> ＝ </span>
                  <span>(<Frac num="β" den="α" />)<sup className="relative -top-[0.6em] text-slate-900 font-bold ml-0.5 text-xs">ν</sup></span>
                  <span className="text-slate-500 font-sans text-xs">(για α, β ≠ 0)</span>
                </li>
              </ul>
            </div>

            {/* Πίνακας Ιδιοτήτων Δυνάμεων */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 font-mono text-xs sm:text-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">
                ΟΙ 5 ΒΑΣΙΚΕΣ ΙΔΙΟΤΗΤΕΣ ΣΤΟ ℝ
              </h3>
              <div className="space-y-1.5 text-slate-800">
                <div className="p-2 bg-white rounded-xl border border-slate-200 whitespace-nowrap">
                  1. <Power base="α" exp="μ" /> · <Power base="α" exp="ν" /> ＝ <Power base="α" exp="μ+ν" />
                </div>
                <div className="p-2 bg-white rounded-xl border border-slate-200 whitespace-nowrap">
                  2. <Power base="α" exp="μ" /> : <Power base="α" exp="ν" /> ＝ <Power base="α" exp="μ-ν" />
                </div>
                <div className="p-2 bg-white rounded-xl border border-slate-200 whitespace-nowrap">
                  3. (<Power base="α · β" exp="ν" />) ＝ <Power base="α" exp="ν" /> · <Power base="β" exp="ν" />
                </div>
                <div className="p-2 bg-white rounded-xl border border-slate-200 whitespace-nowrap">
                  4. (<Power base="α : β" exp="ν" />) ＝ <Power base="α" exp="ν" /> : <Power base="β" exp="ν" />
                </div>
                <div className="p-2 bg-white rounded-xl border border-slate-200 whitespace-nowrap">
                  5. (<Power base="α" exp="μ" />)<sup className="relative -top-[0.6em] text-slate-900 font-bold ml-0.5 text-xs">ν</sup> ＝ <Power base="α" exp="μ·ν" />
                </div>
              </div>
            </div>
          </div>

          {/* Εργαστήριο 2: Υπολογιστής Δυνάμεων Πραγματικών */}
          <div className="mt-8 pt-6 border-t border-slate-100 space-y-6">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              🛠️ Εργαστήριο 2: Δυνάμεις με Πραγματική Βάση
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900 text-white p-6 rounded-3xl">
              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-wider text-indigo-300 block">
                  ΕΠΙΛΟΓΗ ΒΑΣΗΣ (α ∈ ℝ):
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'sqrt2', label: '√2 (Άρρητος)' },
                    { id: 'half', label: '1/2 (Ρητός)' },
                    { id: 'minus3', label: '-3 (Ακέραιος)' }
                  ].map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBaseType(b.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap ${
                        baseType === b.id ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>

                <label className="text-xs font-bold uppercase tracking-wider text-indigo-300 block pt-2">
                  ΕΠΙΛΟΓΗ ΑΚΕΡΑΙΟΥ ΕΚΘΕΤΗ (κ):
                </label>
                <div className="flex flex-wrap gap-2">
                  {[-2, -1, 0, 2, 3, 4].map((eVal) => (
                    <button
                      key={eVal}
                      type="button"
                      onClick={() => setLabExp(eVal)}
                      className={`w-10 h-10 rounded-xl text-sm font-mono font-bold transition-all flex items-center justify-center whitespace-nowrap ${
                        labExp === eVal ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {eVal}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-center p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                <span className="text-xs text-slate-400 uppercase font-sans">ΑΠΟΤΕΛΕΣΜΑ:</span>
                <div className="text-2xl sm:text-3xl font-black font-mono text-amber-300 flex items-center flex-wrap gap-1 whitespace-nowrap">
                  <span>{baseType === 'sqrt2' ? '(√2)' : baseType === 'half' ? '(1/2)' : '(-3)'}</span>
                  <sup className="relative -top-[0.65em] text-amber-400 font-bold ml-0.5 text-base sm:text-lg">
                    {labExp < 0 ? `(${labExp})` : labExp}
                  </sup>
                  <span> ＝ {powerResult.str}</span>
                </div>
                <div className="text-xs sm:text-sm text-slate-300 font-sans pt-1">
                  💡 <strong>Αιτιολόγηση:</strong> {powerResult.expl}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. ΑΝΑΛΥΤΙΚΑ ΛΥΜΕΝΑ ΠΑΡΑΔΕΙΓΜΑΤΑ & ΠΡΟΒΛΗΜΑΤΑ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-50 text-purple-600 font-extrabold text-base sm:text-lg">
                4
              </span>
              Αναλυτικά Λυμένα Παραδείγματα & Προβλήματα
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Παράδειγμα 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-xs uppercase font-bold tracking-wider text-purple-700">
                ΠΑΡΑΔΕΙΓΜΑ 1: ΥΠΟΛΟΓΙΣΜΟΣ ΔΥΝΑΜΗΣ ΜΕ ΡΙΖΑ
              </span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg font-mono flex items-center flex-wrap gap-1">
                <span>Υπολόγισε την τιμή: Α ＝ </span>
                <span className="inline-flex items-center flex-nowrap whitespace-nowrap">
                  <span>(<Sqrt>3</Sqrt>)⁴ · (<Sqrt>3</Sqrt>)<sup className="relative -top-[0.6em] text-slate-900 font-bold ml-0.5 text-xs">(-2)</sup></span>
                </span>
              </h3>
              <div className="space-y-2 text-xs sm:text-sm font-mono text-slate-700 bg-white p-4 rounded-xl border border-slate-200">
                <div>1. Εφαρμόζουμε την ιδιότητα γινομένου: αᵐ · αⁿ = αᵐ⁺ⁿ</div>
                <div className="pl-3 text-slate-500 whitespace-nowrap">
                  (√3)⁴ · (√3)⁻² ＝ (√3)⁴⁺⁽⁻²⁾ ＝ (√3)²
                </div>
                <div>2. Επειδή (√3)² = 3:</div>
                <div className="pl-3 font-bold text-indigo-700">➔ Α ＝ 3</div>
              </div>
            </div>

            {/* Παράδειγμα 2: Πρόβλημα Κατασκευής */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-xs uppercase font-bold tracking-wider text-purple-700">
                ΠΑΡΑΔΕΙΓΜΑ 2: ΠΡΟΒΛΗΜΑ ΔΙΑΓΩΝΙΟΥ ΤΕΤΡΑΓΩΝΟΥ
              </span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg font-mono">
                Ένα τετράγωνο παρτέρι έχει πλευρά 1 m. Πόσα μέτρα είναι η διαγώνιός του και πού βρίσκεται στην ευθεία;
              </h3>
              <div className="space-y-2 text-xs sm:text-sm font-mono text-slate-700 bg-white p-4 rounded-xl border border-slate-200">
                <div>1. Από το Πυθαγόρειο Θεώρημα: d² = 1² + 1² = 2</div>
                <div>2. Άρα το μήκος της διαγωνίου είναι d = √2 m ≈ 1,414 m.</div>
                <div>3. Είναι άρρητος αριθμός και βρίσκεται ανάμεσα στο 1 και το 2 (1 &lt; √2 &lt; 2).</div>
                <div className="pl-3 font-bold text-indigo-700 flex items-center flex-nowrap gap-1">
                  <span>➔ d ＝ </span>
                  <Sqrt>2</Sqrt>
                  <span> m</span>
                </div>
              </div>
            </div>

            {/* Παράδειγμα 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-xs uppercase font-bold tracking-wider text-purple-700">
                ΠΑΡΑΔΕΙΓΜΑ 3: ΣΥΝΔΥΑΣΤΙΚΗ ΙΔΙΟΤΗΤΑ
              </span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg font-mono flex items-center flex-wrap gap-1">
                <span>Απλοποίησε την παράσταση: Β ＝ </span>
                <span className="inline-flex items-center flex-nowrap whitespace-nowrap">
                  <span>(2 · <Sqrt>5</Sqrt>)² : 4</span>
                </span>
              </h3>
              <div className="space-y-2 text-xs sm:text-sm font-mono text-slate-700 bg-white p-4 rounded-xl border border-slate-200">
                <div>1. Εφαρμόζουμε (α · β)² = α² · β²:</div>
                <div className="pl-3 text-slate-500 whitespace-nowrap">
                  (2 · √5)² = 2² · (√5)² = 4 · 5 = 20
                </div>
                <div>2. Διαιρούμε με το 4: 20 : 4 = 5</div>
                <div className="pl-3 font-bold text-indigo-700">➔ Β ＝ 5</div>
              </div>
            </div>

            {/* Παράδειγμα 4: Πρόβλημα Εμβαδού */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-xs uppercase font-bold tracking-wider text-purple-700">
                ΠΑΡΑΔΕΙΓΜΑ 4: ΠΡΟΒΛΗΜΑ ΤΕΤΡΑΓΩΝΟΥ ΑΡΙΘΜΟΥ
              </span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg font-mono">
                Ένα τετράγωνο οικόπεδο έχει εμβαδόν 18 m². Είναι η πλευρά του ρητός ή άρρητος αριθμός;
              </h3>
              <div className="space-y-2 text-xs sm:text-sm font-mono text-slate-700 bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-center flex-nowrap gap-1">
                  <span>1. Η πλευρά είναι α = </span>
                  <Sqrt>18</Sqrt>
                  <span> m.</span>
                </div>
                <div>2. Το 18 δεν είναι τετράγωνος αριθμός (4² = 16, 5² = 25).</div>
                <div>3. Άρα η πλευρά είναι άρρητος αριθμός (α ≈ 4,24 m).</div>
                <div className="pl-3 font-bold text-indigo-700 flex items-center flex-nowrap gap-1">
                  <span>➔ α ＝ </span>
                  <Sqrt>18</Sqrt>
                  <span> m (Άρρητος)</span>
                </div>
              </div>
            </div>

          </div>
        </section>

      </div>
    </Layout>
  );
}
