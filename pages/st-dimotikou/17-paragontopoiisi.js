import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

const PRESETS = [36, 120, 360, 1000, 2500, 10000];
const MAX_LIMIT = 10000;

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

function getPowerRepresentation(factors) {
  if (!factors || factors.length === 0) return '';
  const counts = {};
  factors.forEach((f) => {
    counts[f] = (counts[f] || 0) + 1;
  });

  const exponentsUnicode = { 1: '', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', 10: '¹⁰' };

  return Object.keys(counts)
    .map((factor) => {
      const count = counts[factor];
      const exponent = count > 1 ? (exponentsUnicode[count] || `^${count}`) : '';
      return `${factor}${exponent}`;
    })
    .join(' · ');
}

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

function FactorTreeSvg({ num, locale = 'el', primeBadgeText = 'ΠΡΩΤΟΣ' }) {
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

        <g key="nodes">
          {nodes.map((node) => (
            <g key={node.id} transform={`translate(${node.cx}, ${node.cy})`}>
              {node.isPrime ? (
                <>
                  <circle r="21" fill="#10b981" stroke="#a7f3d0" strokeWidth="2.5" className="shadow-md" />
                  <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontFamily="monospace" fontWeight="900" fontSize="14">
                    {node.val.toLocaleString(locale === 'en' ? 'en-US' : 'el-GR')}
                  </text>
                  <rect x="-24" y="26" width="48" height="15" rx="7" fill="#d1fae5" stroke="#a7f3d0" strokeWidth="1" />
                  <text x="0" y="37" textAnchor="middle" fill="#047857" fontWeight="900" fontSize="8.5" letterSpacing="0.5">
                    {primeBadgeText}
                  </text>
                </>
              ) : (
                <>
                  <rect x="-24" y="-20" width="48" height="40" rx="13" fill="#fef3c7" stroke="#fcd34d" strokeWidth="2.5" />
                  <text x="0" y="5" textAnchor="middle" fill="#78350f" fontFamily="monospace" fontWeight="900" fontSize="14">
                    {node.val.toLocaleString(locale === 'en' ? 'en-US' : 'el-GR')}
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

const TRANSLATIONS = {
  el: {
    pageTitle: "Ανάλυση Αριθμού σε Γινόμενο Πρώτων Παραγόντων - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDescription: "Μάθε πώς να αναλύεις κάθε σύνθετο αριθμό στους πρώτους παράγοντές του χρησιμοποιώντας το Δέντρο Παραγόντων ή τις Διαδοχικές Διαιρέσεις για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    exercisesBtn: "🎯 Ασκήσεις",
    badgeChapter: "ΚΕΦΑΛΑΙΟ 17 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Ανάλυση Αριθμού σε Γινόμενο Πρώτων Παραγόντων",
    heroDesc: "Μάθε πώς να αναλύεις κάθε σύνθετο αριθμό στους πρώτους παράγοντές του χρησιμοποιώντας το Δέντρο Παραγόντων ή τις Διαδοχικές Διαιρέσεις!",
    heroPills: "Δέντρο Παραγόντων & Κατακόρυφες Διαδοχικές Διαιρέσεις",
    heroCta: "Δοκίμασε τις Ασκήσεις",
    theoryTitle: "Μέθοδοι Παραγοντοποίησης",
    theorySubtitle: "Κάθε σύνθετος αριθμός αναλύεται σε ένα μοναδικό γινόμενο πρώτων αριθμών.",
    cards: [
      {
        badge: "ΟΡΙΣΜΟΣ",
        sub: "Μοναδικότητα",
        title: "Τι είναι η Παραγοντοποίηση;",
        body: "Είναι η ανάλυση ενός σύνθετου αριθμού σε γινόμενο πρώτων αριθμών. Κάθε σύνθετος αριθμός αναλύεται κατά έναν και μοναδικό τρόπο (Θεμελιώδες Θεώρημα της Αριθμητικής)!",
        example: "12 ＝ 2 · 2 · 3 ＝ 2² · 3",
        tip: "💡 Όποια μέθοδο κι αν επιλέξεις, οι τελικοί πρώτοι παράγοντες είναι πάντα οι ίδιοι."
      },
      {
        badge: "ΜΕΘΟΔΟΣ 1",
        sub: "Κατακόρυφη Γραμμή",
        title: "Διαδοχικές Διαιρέσεις",
        body: "Χωρίζουμε τον αριθμό με μια κατακόρυφη γραμμή. Δεξιά γράφουμε τον μικρότερο πρώτο διαιρέτη και αριστερά το πηλίκο, συνεχίζοντας διαδοχικά μέχρι να φτάσουμε στο 1.",
        example: "60 | 2 ➔ 30 | 2 ➔ 15 | 3 ➔ 5 | 5 ➔ 1",
        tip: "⚡ Ξεκινάμε πάντα δοκιμάζοντας τους μικρότερους πρώτους: 2, 3, 5, 7, 11..."
      },
      {
        badge: "ΜΕΘΟΔΟΣ 2",
        sub: "Κλαδιά",
        title: "Δέντρο Παραγόντων",
        body: "Διασπούμε τον αριθμό σε κλαδιά γινομένων. Συνεχίζουμε να διασπούμε κάθε κλαδί μέχρι όλα τα «φύλλα» στο κάτω μέρος να γίνουν πρώτοι αριθμοί.",
        example: "60 ➔ 6 · 10 ➔ (2·3) · (2·5)",
        tip: "🎯 Μόλις ένας κόμβος γίνει πρώτος αριθμός, κυκλώνεται και σταματά να διασπάται."
      }
    ],
    labBadge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Διαδραστικό Εργαστήριο Παραγοντοποίησης",
    labDesc: "Πληκτρολόγησε έναν σύνθετο αριθμό (έως 10.000) και επίλεξε την οπτική μέθοδο που προτιμάς!",
    tabTree: "🌳 Δέντρο Παραγόντων",
    tabLadder: "📐 Διαδοχικές Διαιρέσεις",
    inputHeader: "ΠΛΗΚΤΡΟΛΟΓΗΣΕ ΑΡΙΘΜΟ (2 - 10.000):",
    presetHeader: "Ή επίλεξε έτοιμο αριθμό:",
    tipPrimesEnd: "💡 Στο τέλος της ανάλυσης, όλοι οι παράγοντες είναι πρώτοι αριθμοί!",
    analysisHeader: "ΠΑΡΑΓΟΝΤΟΠΟΙΗΣΗ ΤΟΥ ΑΡΙΘΜΟΥ:",
    alreadyPrimeNotice: (num) => `⭐ Ο αριθμός ${num} είναι ήδη Πρώτος!`,
    treeDiagramTitle: "🌳 ΔΙΑΓΡΑΜΜΑ ΔΕΝΤΡΟΥ ΠΑΡΑΓΟΝΤΩΝ:",
    ladderTitle: "📋 ΚΑΤΑΚΟΡΥΦΗ ΚΛΙΜΑΚΑ ΔΙΑΔΟΧΙΚΩΝ ΔΙΑΙΡΕΣΕΩΝ:",
    treeBadgePrime: "ΠΡΩΤΟΣ",
    emptyPrompt: "Πληκτρολόγησε έναν αριθμό από 2 έως 10.000.",
    finalFormulaHeader: "ΤΕΛΙΚΗ ΕΚΦΡΑΣΗ ΣΕ ΓΙΝΟΜΕΝΟ ΠΡΩΤΩΝ ΠΑΡΑΓΟΝΤΩΝ:",
    ctaTitle: "Ώρα για Εξάσκηση στην Παραγοντοποίηση!",
    ctaDesc: "Έμαθες να αναλύεις σύνθετους αριθμούς σε πρώτους παράγοντες; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να τελειοποιήσεις τις γνώσεις σου!",
    ctaBtn: "🎯 Έναρξη Ασκήσεων"
  },
  en: {
    pageTitle: "Prime Factorization of Whole Numbers - Grade 6 | LearnMaths.gr",
    pageDescription: "Learn how to factor composite numbers into products of prime factors using Factor Trees and Successive Division ladders for Grade 6 Mathematics.",
    backText: "Grade 6",
    exercisesBtn: "🎯 Exercises",
    badgeChapter: "CHAPTER 17 • GRADE 6",
    heroTitle: "Prime Factorization of Numbers",
    heroDesc: "Learn how to decompose any composite number into its prime factors using the Factor Tree or Successive Division ladders!",
    heroPills: "Factor Trees & Vertical Successive Division Ladders",
    heroCta: "Try the Exercises",
    theoryTitle: "Factorization Methods",
    theorySubtitle: "Every composite number factors uniquely into a product of prime numbers.",
    cards: [
      {
        badge: "DEFINITION",
        sub: "Uniqueness",
        title: "What is Factorization?",
        body: "The decomposition of a composite number into a product of prime factors. Every integer greater than 1 has a unique prime factorization (Fundamental Theorem of Arithmetic)!",
        example: "12 ＝ 2 · 2 · 3 ＝ 2² · 3",
        tip: "💡 Whichever method you choose, the resulting set of prime factors is always identical."
      },
      {
        badge: "METHOD 1",
        sub: "Vertical Bar",
        title: "Successive Divisions",
        body: "We separate the number with a vertical bar. On the right, we write the smallest prime divisor and on the left the resulting quotient, repeating until reaching 1.",
        example: "60 | 2 ➔ 30 | 2 ➔ 15 | 3 ➔ 5 | 5 ➔ 1",
        tip: "⚡ Always begin testing the smallest primes sequentially: 2, 3, 5, 7, 11..."
      },
      {
        badge: "METHOD 2",
        sub: "Branches",
        title: "Factor Tree",
        body: "We branch the number into factor pairs. Continue branching each composite node until all bottom leaves are prime numbers.",
        example: "60 ➔ 6 · 10 ➔ (2·3) · (2·5)",
        tip: "🎯 As soon as a branch node becomes prime, circle it and stop factoring that branch."
      }
    ],
    labBadge: "🔬 INTERACTIVE LAB",
    labTitle: "Interactive Prime Factorization Lab",
    labDesc: "Type any composite number (up to 10,000) and choose your preferred visual representation!",
    tabTree: "🌳 Factor Tree",
    tabLadder: "📐 Successive Divisions",
    inputHeader: "ENTER NUMBER (2 - 10,000):",
    presetHeader: "Or select a preset number:",
    tipPrimesEnd: "💡 At the conclusion of factorization, all leaf factors are prime numbers!",
    analysisHeader: "PRIME FACTORIZATION FOR:",
    alreadyPrimeNotice: (num) => `⭐ The number ${num} is already Prime!`,
    treeDiagramTitle: "🌳 FACTOR TREE DIAGRAM:",
    ladderTitle: "📋 VERTICAL SUCCESSIVE DIVISION LADDER:",
    treeBadgePrime: "PRIME",
    emptyPrompt: "Enter an integer from 2 to 10,000.",
    finalFormulaHeader: "FINAL PRIME FACTOR PRODUCT FORMULA:",
    ctaTitle: "Time to Practice Factorization!",
    ctaDesc: "Mastered decomposing composite numbers into prime factors? Challenge yourself with 10 interactive questions!",
    ctaBtn: "🎯 Start Exercises"
  }
};

export default function ParagontopoiisiPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const isEn = locale === 'en';
  const t = TRANSLATIONS[locale];

  const [number, setNumber] = useState(360);
  const [activeView, setActiveTab] = useState('tree');

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
      title={t.pageTitle}
      description={t.pageDescription}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/17-paragontopoiisi-ask"
          locale={locale}
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>{t.exercisesBtn}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 sm:space-y-10 2xl:space-y-14 pb-28 sm:pb-32 overflow-x-hidden">

        {/* 1. HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>{t.badgeChapter}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              {t.heroTitle}
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              {t.heroDesc}
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{t.heroPills}</span>
            </div>
            <Link
              href="/st-dimotikou/17-paragontopoiisi-ask"
              locale={locale}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base"
            >
              <span>{t.heroCta}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΘΕΩΡΙΑΣ (3 COLS) */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
              {t.theoryTitle}
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              {t.theorySubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 2xl:gap-8">
            {t.cards.map((card, idx) => (
              <article key={idx} className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                      {card.badge}
                    </span>
                    <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{card.sub}</span>
                  </div>
                  <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                    {card.title}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed whitespace-pre-line">
                    {card.body}
                  </p>

                  <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold text-slate-800">
                    <p>{card.example}</p>
                  </div>
                </div>

                <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                  {card.tip}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΠΑΡΑΓΟΝΤΟΠΟΙΗΣΗΣ */}
        <section className="bg-white p-4 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6 sm:space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>{t.labBadge}</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                {t.labTitle}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                {t.labDesc}
              </p>
            </div>

            {/* METHOD SELECTOR TOGGLE */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner gap-1 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setActiveTab('tree')}
                className={`flex-1 md:flex-none px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base font-black transition-all text-center touch-manipulation active:scale-95 cursor-pointer ${
                  activeView === 'tree'
                    ? 'bg-emerald-600 text-white shadow-sm scale-105'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.tabTree}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ladder')}
                className={`flex-1 md:flex-none px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base font-black transition-all text-center touch-manipulation active:scale-95 cursor-pointer ${
                  activeView === 'ladder'
                    ? 'bg-blue-600 text-white shadow-sm scale-105'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.tabLadder}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
            
            {/* LEFT: INPUT & PRESETS (3 COLS) */}
            <div className="lg:col-span-3 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs 2xl:text-sm font-black text-slate-700 uppercase tracking-wider block">
                    {t.inputHeader}
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={number}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="w-full text-xl sm:text-2xl font-mono font-black text-center p-3 bg-white border-2 border-blue-200 rounded-2xl shadow-sm text-blue-600 outline-none focus:border-blue-500 tracking-wider"
                    placeholder="360"
                  />
                </div>

                {/* PRESET BUTTONS */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-[10px] sm:text-xs font-black uppercase text-slate-400 tracking-wider block">
                    {t.presetHeader}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESETS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setNumber(p)}
                        className={`py-2 px-1 rounded-xl border font-mono font-black text-xs sm:text-sm transition-all text-center touch-manipulation active:scale-95 cursor-pointer ${
                          number === p
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {p.toLocaleString(isEn ? 'en-US' : 'el-GR')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-[11px] sm:text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                {t.tipPrimesEnd}
              </div>
            </div>

            {/* RIGHT: VISUALIZATION (9 COLS) */}
            <div className="lg:col-span-9 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[460px] sm:min-h-[500px] space-y-6">
              
              <div className="w-full text-center">
                <span className="text-xs 2xl:text-sm font-bold text-slate-400 uppercase tracking-wider block">
                  {t.analysisHeader}
                </span>
                <div className="text-lg sm:text-xl md:text-2xl font-mono font-black text-indigo-600 bg-indigo-50 px-4 sm:px-6 py-1.5 rounded-2xl border border-indigo-100 inline-block mt-2 tracking-wider shadow-sm">
                  {number ? number.toLocaleString(isEn ? 'en-US' : 'el-GR') : '—'}
                </div>
                {isPrimeNumber && number > 1 && (
                  <div className="mt-2 text-xs sm:text-sm font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
                    {t.alreadyPrimeNotice(number.toLocaleString(isEn ? 'en-US' : 'el-GR'))}
                  </div>
                )}
              </div>

              <div className="w-full my-auto py-2 flex justify-center items-center">
                {number && number >= 2 ? (
                  activeView === 'tree' ? (
                    <div className="flex flex-col items-center justify-center space-y-4 w-full">
                      <span className="text-xs 2xl:text-sm font-black text-slate-500 uppercase tracking-wider mb-1">
                        {t.treeDiagramTitle}
                      </span>
                      
                      <div className="bg-slate-50 p-3 sm:p-6 md:p-8 rounded-3xl border border-slate-200 w-full flex justify-center items-center shadow-inner min-h-[280px] sm:min-h-[320px] overflow-x-auto">
                        <FactorTreeSvg num={number} locale={locale} primeBadgeText={t.treeBadgePrime} />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-2 w-full">
                      <span className="text-xs 2xl:text-sm font-black text-slate-500 uppercase tracking-wider mb-2">
                        {t.ladderTitle}
                      </span>
                      
                      <div className="bg-slate-900 text-white p-4 sm:p-6 rounded-2xl border border-slate-800 font-mono text-sm sm:text-base md:text-lg min-w-[240px] sm:min-w-[260px] max-h-[360px] sm:max-h-[400px] overflow-y-auto shadow-md">
                        {divisionSteps.map((step, idx) => (
                          <div key={idx} className="flex justify-between items-center border-b border-slate-800 py-1.5 last:border-0">
                            <span className="font-black text-blue-400 text-right w-24 sm:w-28 pr-3 sm:pr-4 border-r-2 border-amber-400">
                              {step.num.toLocaleString(isEn ? 'en-US' : 'el-GR')}
                            </span>
                            <span className="font-black text-emerald-400 text-left w-24 sm:w-28 pl-3 sm:pl-4">
                              {step.divisor ? step.divisor.toLocaleString(isEn ? 'en-US' : 'el-GR') : '—'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ) : (
                  <div className="text-center py-12 text-xs sm:text-sm text-slate-400 font-medium bg-slate-50 rounded-2xl border border-slate-200 w-full p-4">
                    {t.emptyPrompt}
                  </div>
                )}
              </div>

              {number && number >= 2 && (
                <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-3.5 sm:p-4 rounded-2xl text-center shadow-lg font-mono font-black space-y-1">
                  <span className="text-xs md:text-sm font-sans uppercase tracking-wider block text-blue-200">
                    {t.finalFormulaHeader}
                  </span>
                  <div className="text-sm sm:text-lg md:text-xl tracking-wider pt-1 flex flex-wrap justify-center items-center gap-1.5 sm:gap-2">
                    <span>{number.toLocaleString(isEn ? 'en-US' : 'el-GR')} ＝</span>
                    <span>{primeFactors.join(' · ')} ＝</span>
                    <span className="text-amber-300 font-black">{powerRep}</span>
                  </div>
                </div>
              )}

            </div>

          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              {t.ctaTitle}
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              {t.ctaDesc}
            </p>
          </div>

          <Link
            href="/st-dimotikou/17-paragontopoiisi-ask"
            locale={locale}
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-sm sm:text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>{t.ctaBtn}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}