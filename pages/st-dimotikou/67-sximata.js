// pages/st-dimotikou/67-sximata.js
import { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Αφαίρεση τόνων για κεφαλαία (εξαιρείται το ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  const cleaned = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
  return cleaned.replace(/\bΣΤ\b/g, "ΣΤ'");
}

// Μορφοποίηση αριθμού
function formatNum(val) {
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  return Number(val).toLocaleString('el-GR');
}

export default function SximataTheoriaPage() {
  // Εργαστήριο 1: Διαδραστική Εξερεύνηση Πολυγώνων & Διαγωνίων
  const [selectedSides, setSelectedSides] = useState(5);
  const [showDiagonals, setShowDiagonals] = useState(true);

  // Ονόματα πολυγώνων ανά πλήθος πλευρών
  const polygonNames = {
    3: 'Τρίγωνο',
    4: 'Τετράπλευρο',
    5: 'Πεντάγωνο',
    6: 'Εξάγωνο',
    7: 'Επτάγωνο',
    8: 'Οκτάγωνο',
    10: 'Δεκάγωνο',
    12: 'Δωδεκάγωνο'
  };

  // Υπολογισμός κορυφών και διαγωνίων για το διαδραστικό SVG
  const { pointsStr, vertices, diagonals, totalDiagonals } = useMemo(() => {
    const n = selectedSides;
    const r = 125;
    const cx = 180;
    const cy = 160;
    const verts = [];

    for (let i = 0; i < n; i++) {
      const angle = (2 * Math.PI * i) / n - Math.PI / 2;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      verts.push({ x, y, label: String.fromCharCode(65 + i) });
    }

    const pStr = verts.map((v) => `${v.x.toFixed(1)},${v.y.toFixed(1)}`).join(' ');

    const diags = [];
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const diff = Math.abs(i - j);
        if (diff > 1 && diff < n - 1) {
          diags.push({
            x1: verts[i].x,
            y1: verts[i].y,
            x2: verts[j].x,
            y2: verts[j].y,
            key: `${i}-${j}`
          });
        }
      }
    }

    const count = (n * (n - 3)) / 2;
    return { pointsStr: pStr, vertices: verts, diagonals: diags, totalDiagonals: count };
  }, [selectedSides]);

  // Εργαστήριο 2: Υπολογιστής Περιμέτρου Κανονικού Πολυγώνου
  const [regularSides, setRegularSides] = useState(6);
  const [sideLength, setSideLength] = useState(4.5);

  const regularPerimeter = useMemo(() => {
    return regularSides * sideLength;
  }, [regularSides, sideLength]);

  return (
    <Layout
      title="Γεωμετρικά Σχήματα &amp; Πολύγωνα - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μαθαίνουμε για τα γεωμετρικά σχήματα, τα κανονικά πολύγωνα, τις διαγωνίους και τους μαθηματικούς τύπους υπολογισμού τους για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/67-sximata-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 67 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Γεωμετρικά Σχήματα, Πολύγωνα &amp; Διαγώνιοι
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Εξερευνούμε τα <strong>επίπεδα γεωμετρικά σχήματα</strong>, ανακαλύπτουμε τι κάνει ένα πολύγωνο <strong>κανονικό</strong>, τι ονομάζουμε <strong>διαγώνιο</strong> και πώς υπολογίζουμε το πλήθος των διαγωνίων με έναν απλό και κομψό μαθηματικό τύπο!
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία, Κανονικά Πολύγωνα, Διαγώνιοι &amp; Διαδραστικό Εργαστήριο SVG</span>
            </div>
            <Link
              href="/st-dimotikou/67-sximata-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base"
            >
              <span>Δοκίμασε τις Ασκήσεις</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΑΝΑΛΥΣΗΣ ΘΕΩΡΙΑΣ ΣΕ 4 ΒΗΜΑΤΑ */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
              Τα Γεωμετρικά Σχήματα σε 4 Βήματα
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Από τον θεμελιώδη ορισμό του πολυγώνου έως τον υπολογισμό όλων των διαγωνίων.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 gap-5 sm:gap-6 2xl:gap-8">

            {/* ΒΗΜΑ 1 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 1
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Ορισμός</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Τι είναι Πολύγωνο;
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  <strong>Πολύγωνο</strong> ονομάζεται κάθε κλειστό επίπεδο γεωμετρικό σχήμα που οριοθετείται αποκλειστικά από <strong>ευθύγραμμα τμήματα</strong> (πλευρές).
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2">
                  <div className="font-semibold text-slate-800">• Στοιχεία πολυγώνου:</div>
                  <div className="text-slate-600 text-[11px] sm:text-xs space-y-1">
                    <div>— <strong>Κορυφές:</strong> Τα σημεία όπου ενώνονται οι πλευρές.</div>
                    <div>— <strong>Πλευρές:</strong> Τα ευθύγραμμα τμήματα.</div>
                    <div>— <strong>Γωνίες:</strong> Οι εσωτερικές γωνίες που σχηματίζονται.</div>
                  </div>
                  <div className="text-blue-900 font-bold text-xs pt-1 border-t border-slate-200">
                    Πλήθος Πλευρών ＝ Πλήθος Κορυφών ＝ Πλήθος Γωνιών (ν).
                  </div>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Ο κύκλος <em>δεν</em> είναι πολύγωνο, γιατί αποτελείται από καμπύλη γραμμή και όχι από ευθύγραμμα τμήματα!
              </div>
            </article>

            {/* ΒΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Ιδιότητες</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Κανονικά Πολύγωνα
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Ένα πολύγωνο ονομάζεται <strong>κανονικό</strong> όταν πληροί ταυτόχρονα δύο προϋποθέσεις:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2">
                  <div className="text-amber-950 font-bold">
                    1. Όλες οι πλευρές του είναι ίσες (ισόπλευρο).
                  </div>
                  <div className="text-amber-950 font-bold">
                    2. Όλες οι γωνίες του είναι ίσες (ισογώνιο).
                  </div>
                  <div className="text-slate-600 text-[11px] pt-1 border-t border-slate-200">
                    • <strong>Ισόπλευρο τρίγωνο:</strong> Κανονικό τρίγωνο.<br />
                    • <strong>Τετράγωνο:</strong> Κανονικό τετράπλευρο.
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Ο ρόμβος έχει ίσες πλευρές αλλά όχι απαραίτητα ίσες γωνίες. Άρα, ο ρόμβος γενικά <em>δεν</em> είναι κανονικό πολύγωνο!
              </div>
            </article>

            {/* ΒΗΜΑ 3 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Διαγώνιοι</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Τι είναι η Διαγώνιος;
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  <strong>Διαγώνιος</strong> ονομάζεται το ευθύγραμμο τμήμα που ενώνει <strong>δύο μη διαδοχικές κορυφές</strong> ενός πολυγώνου.
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2">
                  <div className="font-bold text-indigo-900">
                    Διαγώνιοι από 1 κορυφή: ν － 3
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Από μία κορυφή δεν φέρνουμε διαγώνιο προς την ίδια ούτε προς τις 2 γειτονικές της (αυτές είναι πλευρές).
                  </p>
                  <div className="text-slate-800 font-semibold text-[11px] pt-1 border-t border-slate-200">
                    Στο τρίγωνο (ν ＝ 3): 3 － 3 ＝ <strong>0 διαγώνιοι</strong>!
                  </div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Το τρίγωνο είναι το μοναδικό πολύγωνο που δεν έχει καμία απολύτως διαγώνιο!
              </div>
            </article>

            {/* ΒΗΜΑ 4 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Μαθηματικός Τύπος</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Σύνολο Διαγωνίων
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Επειδή κάθε διαγώνιος ενώνει 2 κορυφές, αν πολλαπλασιάζαμε απλώς ν · (ν － 3) θα μετρούσαμε κάθε διαγώνιο 2 φορές:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 text-center font-mono">
                  <div className="text-emerald-900 font-black text-sm">
                    Διαγώνιοι ＝ [ν · (ν － 3)] : 2
                  </div>
                  <div className="text-slate-600 text-[11px] font-sans text-left pt-1">
                    Για εξάγωνο (ν ＝ 6):<br />
                    [6 · (6 － 3)] : 2 ＝ (6 · 3) : 2 ＝ 18 : 2 ＝ <strong>9 διαγώνιοι</strong>.
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Στο πεντάγωνο (ν ＝ 5) οι διαγώνιοι είναι [5 · 2] : 2 ＝ 5 (όσες και οι πλευρές του)!
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: SVG ΕΞΕΡΕΥΝΗΣΗ ΠΟΛΥΓΩΝΩΝ & ΔΙΑΓΩΝΙΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1</span>
            </div>
            <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Διαδραστικό Εργαστήριο Πολυγώνων &amp; Διαγωνίων (SVG)
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Επίλεξε το πλήθος πλευρών για να παρατηρήσεις το κανονικό πολύγωνο, τις κορυφές του και τις διαγωνίους σε πραγματικό χρόνο:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">

            {/* Χειριστήρια & Πληροφορίες (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2">
                  ΕΠΙΛΟΓΗ ΠΛΗΘΟΥΣ ΠΛΕΥΡΩΝ (ν):
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[3, 4, 5, 6, 7, 8, 10, 12].map((sides) => (
                    <button
                      key={sides}
                      onClick={() => setSelectedSides(sides)}
                      className={`py-2 px-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                        selectedSides === sides
                          ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {sides}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold">Όνομα:</span>
                  <span className="font-black text-indigo-700">{polygonNames[selectedSides]}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold">Πλευρές &amp; Κορυφές (ν):</span>
                  <span className="font-bold text-slate-800">{selectedSides}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold">Διαγώνιοι από 1 κορυφή (ν － 3):</span>
                  <span className="font-bold text-sky-700">{Math.max(0, selectedSides - 3)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="text-slate-700 font-bold">Σύνολο Διαγωνίων:</span>
                  <span className="text-base sm:text-lg font-black text-emerald-600 font-mono">
                    {totalDiagonals}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowDiagonals(!showDiagonals)}
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all border ${
                  showDiagonals
                    ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                {showDiagonals ? 'Απόκρυψη Διαγωνίων' : 'Εμφάνιση Διαγωνίων'}
              </button>
            </div>

            {/* SVG Visualizer (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center">
              <svg
                viewBox="0 0 360 320"
                className="w-full max-w-[340px] sm:max-w-[380px] h-auto select-none"
              >
                {/* Διαγώνιοι */}
                {showDiagonals &&
                  diagonals.map((d) => (
                    <line
                      key={d.key}
                      x1={d.x1}
                      y1={d.y1}
                      x2={d.x2}
                      y2={d.y2}
                      stroke="#f59e0b"
                      strokeWidth="1.8"
                      strokeDasharray="4 3"
                      className="opacity-80"
                    />
                  ))}

                {/* Περίμετρος πολυγώνου */}
                <polygon
                  points={pointsStr}
                  fill="rgba(99, 102, 241, 0.2)"
                  stroke="#6366f1"
                  strokeWidth="3.5"
                />

                {/* Κορυφές */}
                {vertices.map((v, idx) => (
                  <g key={idx}>
                    <circle
                      cx={v.x}
                      cy={v.y}
                      r="6"
                      fill="#ffffff"
                      stroke="#4f46e5"
                      strokeWidth="2.5"
                    />
                    <text
                      x={v.x + (v.x - 180) * 0.16}
                      y={v.y + (v.y - 160) * 0.16 + 4}
                      fill="#e2e8f0"
                      fontSize="12"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {v.label}
                    </text>
                  </g>
                ))}
              </svg>
              <div className="mt-2 text-center text-xs text-slate-400">
                {selectedSides === 3 ? (
                  <span>Στο τρίγωνο δεν υπάρχουν μη διαδοχικές κορυφές (0 διαγώνιοι).</span>
                ) : (
                  <span>
                    Με κίτρινο διακεκομμένο χρώμα: οι <strong>{totalDiagonals}</strong> διαγώνιοι.
                  </span>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΥΠΟΛΟΓΙΣΤΗΣ ΠΕΡΙΜΕΤΡΟΥ ΚΑΝΟΝΙΚΟΥ ΠΟΛΥΓΩΝΟΥ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
              <span>📏 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΠΕΡΙΜΕΤΡΟΣ</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Υπολογιστής Περιμέτρου Κανονικών Πολυγώνων
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Σε κάθε κανονικό πολύγωνο όλες οι πλευρές είναι ίσες. Διάλεξε το σχήμα και το μήκος πλευράς:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

            {/* Ρυθμίσεις (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>ΠΛΗΘΟΣ ΠΛΕΥΡΩΝ (ν):</span>
                  <span className="font-mono text-base font-black text-indigo-700 bg-white px-3 py-1 rounded-xl border border-slate-200">
                    {regularSides} πλευρές ({polygonNames[regularSides] || 'Πολύγωνο'})
                  </span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={12}
                  step={1}
                  value={regularSides}
                  onChange={(e) => setRegularSides(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>ΜΗΚΟΣ ΠΛΕΥΡΑΣ (cm):</span>
                  <span className="font-mono text-base font-black text-emerald-700 bg-white px-3 py-1 rounded-xl border border-slate-200">
                    {formatNum(sideLength)} cm
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  step={0.5}
                  value={sideLength}
                  onChange={(e) => setSideLength(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer touch-manipulation"
                />
              </div>
            </div>

            {/* Αποτέλεσμα & Ανάλυση (7 στήλες) */}
            <div className="lg:col-span-7 bg-emerald-50/60 p-5 sm:p-7 rounded-3xl border border-emerald-200 space-y-3 text-center">
              <span className="text-xs text-emerald-900 block font-bold uppercase tracking-wider">
                ΑΠΟΤΕΛΕΣΜΑ ΠΕΡΙΜΕΤΡΟΥ
              </span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-800 font-mono">
                {formatNum(regularPerimeter)} cm
              </div>
              <p className="text-xs sm:text-sm text-slate-700 font-mono pt-1">
                Πράξη: {regularSides} · {formatNum(sideLength)} cm ＝ <strong>{formatNum(regularPerimeter)} cm</strong>
              </p>
              <div className="p-3 bg-white rounded-2xl border border-emerald-200 text-xs text-emerald-950 font-sans text-left">
                💡 <strong>Κανόνας:</strong> Για κάθε κανονικό πολύγωνο με ν ίσες πλευρές μήκους α, η περίμετρος δίνεται από τον τύπο: <strong>Π ＝ ν · α</strong>.
              </div>
            </div>

          </div>
        </section>

        {/* 5. ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ ΚΑΘΗΜΕΡΙΝΗΣ ΖΩΗΣ */}
        <section className="space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight">
              Λυμένα Προβλήματα με Πολύγωνα &amp; Διαγωνίους
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Εφαρμογές των γεωμετρικών κανόνων και του τύπου διαγωνίων σε πραγματικά προβλήματα.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ΠΡΟΒΛΗΜΑ 1 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-900 text-xs font-black rounded-lg uppercase">
                  ΠΡΟΒΛΗΜΑ 1: ΠΕΡΙΜΕΤΡΟΣ ΠΑΡΤΕΡΙΟΥ
                </span>
                <span className="text-xs font-bold text-slate-400">Κανονικό Οκτάγωνο</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Υπολογισμός Περιμέτρου &amp; Κόστους Περίφραξης
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ένα παρτέρι σε πάρκο έχει σχήμα κανονικού οκταγώνου με πλευρά <strong>3,5 m</strong>. Θέλουμε να το περιφράξουμε με ξύλινο φράχτη που κοστίζει <strong>8 €</strong> το μέτρο. Πόσο θα κοστίσει συνολικά ο φράχτης;
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΔΕΔΟΜΕΝΑ ΠΡΟΒΛΗΜΑΤΟΣ
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Πλευρές (ν)</span> 8
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Μήκος πλευράς</span> 3,5 m
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Κόστος/μέτρο</span> 8 €
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήματα Επίλυσης:</span>
                  <div>• <strong>Περίμετρος οκταγώνου:</strong> 8 · 3,5 m ＝ <strong>28 m</strong>.</div>
                  <div>• <strong>Συνολικό κόστος:</strong> 28 · 8 € ＝ <strong className="text-blue-700">224 €</strong>.</div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 font-medium">
                💡 Επειδή το οκτάγωνο είναι κανονικό, πολλαπλασιάζουμε το μήκος της μίας πλευράς επί 8.
              </div>
            </article>

            {/* ΠΡΟΒΛΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-lg uppercase">
                  ΠΡΟΒΛΗΜΑ 2: ΔΙΑΓΩΝΙΟΙ ΣΕ ΠΟΛΥΓΩΝΟ
                </span>
                <span className="text-xs font-bold text-slate-400">Δεκάγωνο</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Υπολογισμός Συνολικών Διαγωνίων Δεκαγώνου
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Σε ένα σχέδιο αρχιτεκτονικής υπάρχει ένα διακοσμητικό πλακόστρωτο σχήματος <strong>δεκαγώνου</strong> (10 κορυφές). Πόσες διαγωνίους γραμμές μπορούν να ενωθούν ανάμεσα στις μη διαδοχικές κορυφές του;
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΣΤΟΙΧΕΙΑ ΥΠΟΛΟΓΙΣΜΟΥ
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold text-[11px]">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Κορυφές (ν)</span> 10
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Από 1 κορυφή</span> 10 － 3 ＝ 7
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Διαίρεση</span> με το 2
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήματα Επίλυσης:</span>
                  <div>• <strong>Διαγώνιοι από 1 κορυφή:</strong> 10 － 3 ＝ <strong>7</strong>.</div>
                  <div>• <strong>Εφαρμογή τύπου:</strong> [10 · 7] : 2 ＝ 70 : 2 ＝ <strong className="text-amber-700">35 διαγώνιοι</strong>.</div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 font-medium">
                ⚡ Διαιρούμε πάντα με το 2 γιατί κάθε διαγώνιος ενώνει δύο κορυφές και υπολογίζεται δύο φορές!
              </div>
            </article>

          </div>
        </section>

        {/* 6. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στα Γεωμετρικά Σχήματα!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε 10 διαδραστικές ασκήσεις με πολύγωνα, κανονικά σχήματα και διαγωνίους για τη ΣΤ' Δημοτικού.
            </p>
          </div>

          <Link
            href="/st-dimotikou/67-sximata-ask"
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
