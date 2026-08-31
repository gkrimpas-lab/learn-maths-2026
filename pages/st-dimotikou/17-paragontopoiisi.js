import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { LAYOUT } from '../../shared/layout-config';

const PRESETS = [36, 120, 360, 1000, 2500, 10000];
const MAX_LIMIT = 10000;

// Υπολογισμος πρωτων παραγοντων
function getPrimeFactors(n) {
  if (!n || n < 2) return [];
  let num = n;
  const factors = [];
  let divisor = 2;

  while (num >= 2) {
    if (num % divisor === 0) {
      factors.push(divisor);
      num = num / divisor;
    } else {
      divisor++;
    }
  }
  return factors;
}

// Υπολογισμος βηματων διαδοχικων διαιρεσεων
function getDivisionSteps(n) {
  if (!n || n < 2) return [];
  let current = n;
  const steps = [];
  let divisor = 2;

  while (current > 1) {
    if (current % divisor === 0) {
      steps.push({ num: current, divisor: divisor });
      current = current / divisor;
    } else {
      divisor++;
    }
  }
  steps.push({ num: 1, divisor: null });
  return steps;
}

// Υπολογισμος μορφης δυναμεων (π.χ. [2,2,3,5] => "2² × 3 × 5")
function getPowerRepresentation(factors) {
  if (!factors || factors.length === 0) return '';
  const counts = {};
  factors.forEach(f => {
    counts[f] = (counts[f] || 0) + 1;
  });

  const exponentsUnicode = { 1: '', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', 10: '¹⁰' };

  return Object.keys(counts)
    .map(factor => {
      const count = counts[factor];
      const exponent = count > 1 ? (exponentsUnicode[count] || `^${count}`) : '';
      return `${factor}${exponent}`;
    })
    .join(' × ');
}

// Δημιουργια αρχικου δεντρου παραγοντων
function buildRawFactorTree(num) {
  if (num <= 1) return null;

  let firstDiv = 2;
  while (num % firstDiv !== 0) {
    firstDiv++;
  }

  if (firstDiv === num) {
    return { val: num, isPrime: true };
  }

  const other = num / firstDiv;
  return {
    val: num,
    isPrime: false,
    left: buildRawFactorTree(firstDiv),
    right: buildRawFactorTree(other)
  };
}

// Υπολογισμος συντεταγμενων xIndex & depth για καθε κομβο
function layoutFactorTree(node, depth = 0, leafCounter = { count: 0 }) {
  if (!node) return null;

  if (node.isPrime || (!node.left && !node.right)) {
    const leafIndex = leafCounter.count++;
    return {
      ...node,
      depth,
      minLeafIndex: leafIndex,
      maxLeafIndex: leafIndex,
      xIndex: leafIndex
    };
  }

  const left = layoutFactorTree(node.left, depth + 1, leafCounter);
  const right = layoutFactorTree(node.right, depth + 1, leafCounter);

  const minLeafIndex = left.minLeafIndex;
  const maxLeafIndex = right.maxLeafIndex;
  const xIndex = (minLeafIndex + maxLeafIndex) / 2;

  return {
    ...node,
    depth,
    minLeafIndex,
    maxLeafIndex,
    xIndex,
    left,
    right
  };
}

// Συλλογη στοιχειων (γραμμες & κομβοι) για το SVG
function collectSvgElements(treeNode, dx, dy, paddingX, paddingY, lines = [], nodes = []) {
  if (!treeNode) return { lines, nodes };

  const cx = paddingX + treeNode.xIndex * dx;
  const cy = paddingY + treeNode.depth * dy;

  nodes.push({
    id: `node-${treeNode.val}-${treeNode.depth}-${treeNode.xIndex}`,
    val: treeNode.val,
    isPrime: treeNode.isPrime,
    cx,
    cy
  });

  if (treeNode.left) {
    const leftCx = paddingX + treeNode.left.xIndex * dx;
    const leftCy = paddingY + treeNode.left.depth * dy;
    lines.push({
      id: `line-L-${treeNode.depth}-${treeNode.xIndex}`,
      x1: cx,
      y1: cy,
      x2: leftCx,
      y2: leftCy
    });
    collectSvgElements(treeNode.left, dx, dy, paddingX, paddingY, lines, nodes);
  }

  if (treeNode.right) {
    const rightCx = paddingX + treeNode.right.xIndex * dx;
    const rightCy = paddingY + treeNode.right.depth * dy;
    lines.push({
      id: `line-R-${treeNode.depth}-${treeNode.xIndex}`,
      x1: cx,
      y1: cy,
      x2: rightCx,
      y2: rightCy
    });
    collectSvgElements(treeNode.right, dx, dy, paddingX, paddingY, lines, nodes);
  }

  return { lines, nodes };
}

// Component Σχεδιασης Δεντρου σε SVG
function FactorTreeSvg({ num }) {
  if (!num || num < 2) return null;

  const rawTree = buildRawFactorTree(num);
  const leafCounter = { count: 0 };
  const layoutTree = layoutFactorTree(rawTree, 0, leafCounter);

  const totalLeaves = Math.max(leafCounter.count, 1);
  
  function getMaxDepth(node) {
    if (!node) return 0;
    if (!node.left && !node.right) return node.depth;
    return Math.max(getMaxDepth(node.left), getMaxDepth(node.right));
  }
  const maxDepth = getMaxDepth(layoutTree);

  const dx = 75;
  const dy = 75;
  const paddingX = 60;
  const paddingY = 45;

  const { lines, nodes } = collectSvgElements(layoutTree, dx, dy, paddingX, paddingY);

  const svgWidth = totalLeaves === 1 
    ? paddingX * 2 
    : paddingX * 2 + (totalLeaves - 1) * dx;
  const svgHeight = paddingY * 2 + maxDepth * dy + 15;

  return (
    <div className="w-full flex justify-center items-center py-2 overflow-x-auto">
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-auto max-h-[460px] mx-auto overflow-visible shrink-0"
        style={{ maxWidth: `${Math.min(svgWidth * 1.2, 750)}px` }}
      >
        {/* Γραμμες Συνδεσης */}
        <g key="lines">
          {lines.map((line) => (
            <line
              key={line.id}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="#94a3b8"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          ))}
        </g>

        {/* Κομβοι */}
        <g key="nodes">
          {nodes.map((node) => (
            <g key={node.id} transform={`translate(${node.cx}, ${node.cy})`}>
              {node.isPrime ? (
                <>
                  <circle r="21" fill="#10b981" stroke="#a7f3d0" strokeWidth="2.5" className="shadow-md" />
                  <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontFamily="monospace" fontWeight="900" fontSize="14">
                    {node.val.toLocaleString('el-GR')}
                  </text>
                  <rect x="-24" y="26" width="48" height="15" rx="7" fill="#d1fae5" stroke="#a7f3d0" strokeWidth="1" />
                  <text x="0" y="37" textAnchor="middle" fill="#047857" fontWeight="900" fontSize="8.5" letterSpacing="0.5">
                    ΠΡΩΤΟΣ
                  </text>
                </>
              ) : (
                <>
                  <rect x="-24" y="-20" width="48" height="40" rx="13" fill="#fef3c7" stroke="#fcd34d" strokeWidth="2.5" />
                  <text x="0" y="5" textAnchor="middle" fill="#78350f" fontFamily="monospace" fontWeight="900" fontSize="14">
                    {node.val.toLocaleString('el-GR')}
                  </text>
                </>
              )}
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

export default function ParagontopoiisiPage() {
  const [number, setNumber] = useState(360);
  const [activeView, setActiveTab] = useState('tree'); // Προεπιλογη: Δεντρο

  const handleInputChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') {
      setNumber('');
      return;
    }
    const parsed = parseInt(clean, 10);
    if (parsed <= MAX_LIMIT) {
      setNumber(parsed);
    }
  };

  const primeFactors = getPrimeFactors(number);
  const divisionSteps = getDivisionSteps(number);
  const powerRep = getPowerRepresentation(primeFactors);

  const isPrimeNumber = primeFactors.length === 1;

  return (
    <Layout
      title="🌳 17. Ανάλυση Αριθμού σε Γινόμενο Πρώτων Παραγόντων - LearnMaths.gr"
      description="Μάθε πώς να αναλύεις κάθε σύνθετο αριθμό στους πρώτους παράγοντές του χρησιμοποιώντας το Δέντρο Παραγόντων ή τις Διαδοχικές Διαιρέσεις για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/17-paragontopoiisi-ask"
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
                  🎓 ΣΤ' Δημοτικού
                </span>
                <span className="bg-amber-400 text-slate-900 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                  Ενότητα 17
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                17. Ανάλυση Αριθμού σε Γινόμενο Πρώτων Παραγόντων
              </h1>
              <p className="text-blue-100 text-sm md:text-base leading-relaxed max-w-3xl">
                Μάθε πώς να αναλύεις κάθε σύνθετο αριθμό στους <strong>πρώτους παράγοντές του</strong> χρησιμοποιώντας το <strong>Δέντρο Παραγόντων</strong> ή τις <strong>Διαδοχικές Διαιρέσεις</strong>!
              </p>
            </div>

            {/* CALLOUT PROMO CARD */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 shadow-inner">
              <span className="text-3xl">🚀</span>
              <h3 className="font-black text-lg text-amber-300">Ώρα για Εξάσκηση!</h3>
              <p className="text-xs text-blue-50">Δοκίμασε τις 8 διαδραστικές ασκήσεις παραγοντοποίησης με αυτόματη βαθμολόγηση!</p>
              <Link
                href="/st-dimotikou/17-paragontopoiisi-ask"
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
              <h3 className="text-lg font-black text-slate-900">Τι είναι η Παραγοντοποίηση;</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Είναι η ανάλυση ενός σύνθετου αριθμού σε <strong>γινόμενο πρώτων αριθμών</strong>. Κάθε σύνθετος αριθμός αναλύεται κατά ένα και μοναδικό τρόπο!
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-blue-100 text-xs text-slate-700 font-mono text-center font-bold">
              <p>12 ＝ 2 × 2 × 3 ＝ <strong className="text-blue-700">2² × 3</strong></p>
            </div>
          </div>

          <div className="bg-indigo-50/80 border border-indigo-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-2.5">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                2
              </div>
              <h3 className="text-lg font-black text-slate-900">Μέθοδος 1: Διαδοχικές Διαιρέσεις</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Χωρίζουμε τον αριθμό με μια <strong>κατακόρυφη γραμμή</strong>. Δεξιά γράφουμε τον μικρότερο πρώτο διαιρέτη και αριστερά το πηλίκο, μέχρι να φτάσουμε στο 1.
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-indigo-100 text-xs text-slate-700 font-mono text-center font-bold">
              <p>60 | 2 ➔ 30 | 2 ➔ 15 | 3 ➔ 5 | 5 ➔ 1</p>
            </div>
          </div>

          <div className="bg-emerald-50/80 border border-emerald-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-2.5">
              <div className="w-10 h-10 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                3
              </div>
              <h3 className="text-lg font-black text-slate-900">Μέθοδος 2: Δέντρο Παραγόντων</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Διασπούμε τον αριθμό σε κλαδιά γινομένων, μέχρι όλα τα φύλλα του δέντρου να γίνουν <strong>πρώτοι αριθμοί</strong>.
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-emerald-100 text-xs text-slate-700 font-mono text-center font-bold">
              <p>60 ➔ 6 × 10 ➔ (2×3) × (2×5)</p>
            </div>
          </div>
        </div>

        {/* INTERACTIVE PLAYGROUND */}
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🕹️</span> Διαδραστικό Εργαστήριο Παραγοντοποίησης
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm">
                Πληκτρολόγησε έναν σύνθετο αριθμό (έως 10.000) και επίλεξε την οπτική μέθοδο που προτιμάς!
              </p>
            </div>

            {/* METHOD SELECTOR TOGGLE */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner gap-1 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setActiveTab('tree')}
                className={`flex-1 md:flex-none px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all text-center ${
                  activeView === 'tree'
                    ? 'bg-emerald-600 text-white shadow-xs scale-105'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🌳 Δέντρο Παραγόντων
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ladder')}
                className={`flex-1 md:flex-none px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all text-center ${
                  activeView === 'ladder'
                    ? 'bg-blue-600 text-white shadow-xs scale-105'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📐 Διαδοχικές Διαιρέσεις
              </button>
            </div>
          </div>

          {/* MAIN INTERACTIVE GRID (3 COLS LEFT / 9 COLS RIGHT) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
            
            {/* LEFT: INPUT & PRESETS (3 COLS) */}
            <div className="lg:col-span-3 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                    Πληκτρολογησε Αριθμο (2 - 10.000):
                  </span>
                  <input
                    type="text"
                    value={number}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="w-full text-xl sm:text-2xl font-mono font-black text-center p-3 bg-white border-2 border-blue-200 rounded-2xl shadow-sm text-blue-600 outline-none focus:border-blue-500 tracking-wider"
                    placeholder="π.χ. 360"
                  />
                </div>

                {/* PRESET BUTTONS (2 COLS x 3 ROWS) */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                    Η επιλεξε ετοιμο αριθμο:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESETS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setNumber(p)}
                        className={`py-2 px-1 rounded-xl border font-mono font-black text-xs transition-all text-center ${
                          number === p
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {p.toLocaleString('el-GR')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                💡 Στο τέλος της ανάλυσης, όλοι οι παράγοντες είναι <strong>πρώτοι αριθμοί</strong>!
              </div>
            </div>

            {/* RIGHT: VISUALIZATION (9 COLS) */}
            <div className="lg:col-span-9 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[460px] sm:min-h-[500px] space-y-6">
              
              {/* HEADER STATUS */}
              <div className="w-full text-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Παραγοντοποιηση του Αριθμου:
                </span>
                <div className="text-lg sm:text-xl md:text-2xl font-mono font-black text-indigo-600 bg-indigo-50 px-4 sm:px-6 py-1.5 rounded-2xl border border-indigo-100 inline-block mt-2 tracking-wider shadow-xs">
                  {number ? number.toLocaleString('el-GR') : "—"}
                </div>
                {isPrimeNumber && number > 1 && (
                  <div className="mt-2 text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
                    ⭐ Ο αριθμός {number.toLocaleString('el-GR')} είναι ήδη Πρώτος!
                  </div>
                )}
              </div>

              {/* VISUAL METHOD DISPLAY */}
              <div className="w-full my-auto py-2 flex justify-center items-center">
                {number && number >= 2 ? (
                  activeView === 'tree' ? (
                    /* FACTOR TREE DISPLAY WITH PERFECT SVG CENTERING */
                    <div className="flex flex-col items-center justify-center space-y-4 w-full">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">
                        🌳 Διαγραμμα Δεντρου Παραγοντων:
                      </span>
                      
                      <div className="bg-slate-50 p-3 sm:p-6 md:p-8 rounded-3xl border border-slate-200 w-full flex justify-center items-center shadow-inner min-h-[280px] sm:min-h-[320px] overflow-x-auto">
                        <FactorTreeSvg num={number} />
                      </div>
                    </div>
                  ) : (
                    /* LADDER DISPLAY */
                    <div className="flex flex-col items-center justify-center space-y-2 w-full">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                        📋 Κατακορυφη Κλιμακα Διαδοχικων Διαιρεσεων:
                      </span>
                      
                      <div className="bg-slate-900 text-white p-4 sm:p-6 rounded-2xl border border-slate-800 font-mono text-sm sm:text-base md:text-lg min-w-[240px] sm:min-w-[260px] max-h-[360px] sm:max-h-[400px] overflow-y-auto shadow-md">
                        {divisionSteps.map((step, idx) => (
                          <div key={idx} className="flex justify-between items-center border-b border-slate-800 py-1.5 last:border-0">
                            <span className="font-black text-blue-400 text-right w-24 sm:w-28 pr-3 sm:pr-4 border-r-2 border-amber-400">
                              {step.num.toLocaleString('el-GR')}
                            </span>
                            <span className="font-black text-emerald-400 text-left w-24 sm:w-28 pl-3 sm:pl-4">
                              {step.divisor ? step.divisor.toLocaleString('el-GR') : '—'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ) : (
                  <div className="text-center py-12 text-xs sm:text-sm text-slate-400 font-medium bg-slate-50 rounded-2xl border border-slate-200 w-full p-4">
                    Πληκτρολόγησε έναν αριθμό από 2 έως 10.000.
                  </div>
                )}
              </div>

              {/* FINAL POWER EXPRESSION CARD */}
              {number && number >= 2 && (
                <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-3.5 sm:p-4 rounded-2xl text-center shadow-lg font-mono font-black space-y-1">
                  <span className="text-xs font-sans uppercase tracking-wider block text-blue-200">
                    Τελικη Εκφραση σε Γινομενο Πρωτων Παραγοντων:
                  </span>
                  <div className="text-sm sm:text-lg md:text-xl tracking-wider pt-1 flex flex-wrap justify-center items-center gap-1.5 sm:gap-2">
                    <span>{number.toLocaleString('el-GR')} ＝</span>
                    <span>{primeFactors.join(' × ')} ＝</span>
                    <span className="text-amber-300 font-black">{powerRep}</span>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>

        {/* BOTTOM CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-lg text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
            <p className="text-gray-800 text-sm md:text-base">
              Έμαθες να αναλύεις σύνθετους αριθμούς σε πρώτους παράγοντες; Δοκίμασε τις διαδραστικές ασκήσεις!
            </p>
          </div>
          <Link
            href="/st-dimotikou/17-paragontopoiisi-ask"
            className="bg-gray-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-xl transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            Ξεκίνα τις Ασκήσεις ➔
          </Link>
        </div>

      </div>
    </Layout>
  );
}
