import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { LAYOUT } from '../../shared/layout-config';

// Βοηθητική συνάρτηση αφαίρεσης τόνων από κεφαλαία (εκτός του ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  return str
    .replace(/ΣΤ'/g, '__ST_PRIME__')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/__ST_PRIME__/g, "ΣΤ'");
}

export default function SximataTheoria() {
  // State για το διαδραστικό εργαστήριο πολυγώνων
  const [selectedSides, setSelectedSides] = useState(5);
  const [showDiagonals, setShowDiagonals] = useState(true);

  // Ονόματα πολυγώνων ανά αριθμό πλευρών
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
    const r = 130;
    const cx = 200;
    const cy = 180;
    const verts = [];

    for (let i = 0; i < n; i++) {
      // Περιστροφή κατά -90 μοίρες ώστε η πρώτη κορυφή να είναι στην κορυφή
      const angle = (2 * Math.PI * i) / n - Math.PI / 2;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      verts.push({ x, y, label: String.fromCharCode(65 + i) }); // A, B, C, ...
    }

    const pStr = verts.map((v) => `${v.x.toFixed(1)},${v.y.toFixed(1)}`).join(' ');

    const diags = [];
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const diff = Math.abs(i - j);
        // Διαγώνιος υπάρχει αν οι κορυφές δεν είναι διαδοχικές
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

  return (
    <Layout
      title="Γεωμετρικά Σχήματα και Πολύγωνα | Θεωρία ΣΤ' Δημοτικού"
      description="Μάθετε τα γεωμετρικά σχήματα, τα πολύγωνα, τα κανονικά πολύγωνα και τις διαγωνίους με διαδραστικό εργαστήριο και λυμένα παραδείγματα."
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 overflow-x-hidden">
        {/* HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-900 via-slate-900 to-sky-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-indigo-800/40 mb-8 sm:mb-12 relative overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs sm:text-sm font-semibold tracking-wider">
                <span>{toCleanUppercase("ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΓΕΩΜΕΤΡΙΑ • ΘΕΩΡΙΑ")}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                {toCleanUppercase('Γεωμετρικα Σχηματα, Πολυγωνα και Διαγωνιοι')}
              </h1>
              <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed">
                Ανακαλύψτε πώς ορίζονται τα επίπεδα γεωμετρικά σχήματα, πότε ένα πολύγωνο ονομάζεται κανονικό, 
                τι είναι οι διαγώνιοι και πώς υπολογίζουμε το πλήθος τους με έναν απλό μαθηματικό τύπο.
              </p>
            </div>

            <div className="flex-shrink-0">
              <Link
                href="/st-dimotikou/67-sximata-ask"
                className="inline-flex items-center justify-center gap-3 px-6 py-4 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-black rounded-2xl shadow-lg shadow-emerald-500/25 transition-all text-sm sm:text-base border border-emerald-400"
              >
                <span className="text-xl">🎯</span>
                <span>{toCleanUppercase('ΑΣΚΗΣΕΙΣ')}</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ΚΥΡΙΟ ΠΕΡΙΕΧΟΜΕΝΟ: 4 MODULAR ΚΑΡΤΕΣ & ΕΡΓΑΣΤΗΡΙΟ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* ΚΑΡΤΑ 1: ΒΑΣΙΚΟΙ ΟΡΙΣΜΟΙ */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg">
                  1
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-800">
                  {toCleanUppercase('Βασικοι Ορισμοι και Εννοιολογικο Υποβαθρο')}
                </h2>
              </div>
              <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
                <p>
                  <strong>Γεωμετρικό Σχήμα:</strong> Ονομάζεται κάθε σύνολο σημείων στο επίπεδο ή στον χώρο. 
                  Στη γεωμετρία του δημοτικού εξετάζουμε κυρίως τα <em>επίπεδα σχήματα</em>, δηλαδή τα σχήματα των οποίων όλα τα σημεία βρίσκονται στο ίδιο επίπεδο.
                </p>
                <div className="p-4 bg-slate-50 rounded-2xl border-l-4 border-indigo-500 space-y-2">
                  <p>
                    <strong>Πολύγωνο:</strong> Είναι ένα κλειστό επίπεδο σχήμα που οριοθετείται αποκλειστικά από 
                    διαδοχικά ευθύγραμμα τμήματα (πλευρές). Τα ευθύγραμμα τμήματα δεν τέμνονται μεταξύ τους εκτός από τα άκρα τους.
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Ένας κύκλος ή ένα σχήμα με καμπύλες γραμμές <em>δεν</em> είναι πολύγωνο, διότι δεν αποτελείται από ευθύγραμμα τμήματα.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-2 text-center text-xs sm:text-sm font-semibold">
                  <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-150 text-indigo-900">
                    <span className="block font-black text-base sm:text-lg mb-1">Κορυφές</span>
                    Σημεία ένωσης των πλευρών
                  </div>
                  <div className="p-3 bg-sky-50/70 rounded-xl border border-sky-150 text-sky-900">
                    <span className="block font-black text-base sm:text-lg mb-1">Πλευρές</span>
                    Ευθύγραμμα τμήματα
                  </div>
                  <div className="p-3 bg-violet-50/70 rounded-xl border border-violet-150 text-violet-900">
                    <span className="block font-black text-base sm:text-lg mb-1">Γωνίες</span>
                    Εσωτερικές γωνίες πολυγώνου
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs sm:text-sm font-medium text-slate-500">
              💡 Σε κάθε πολύγωνο: Πλήθος Πλευρών ＝ Πλήθος Κορυφών ＝ Πλήθος Γωνιών.
            </div>
          </section>

          {/* ΚΑΡΤΑ 2: ΚΑΝΟΝΙΚΑ ΠΟΛΥΓΩΝΑ & ΔΙΑΓΩΝΙΟΙ */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-lg">
                  2
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-800">
                  {toCleanUppercase('Κανονικα Πολυγωνα και Διαγωνιοι')}
                </h2>
              </div>
              <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
                <div className="p-4 bg-sky-50/60 rounded-2xl border border-sky-100 space-y-2">
                  <h3 className="font-bold text-sky-950">
                    {toCleanUppercase('Τι ειναι το Κανονικο Πολυγωνο;')}
                  </h3>
                  <p>
                    Ένα πολύγωνο ονομάζεται <strong>κανονικό</strong> όταν ικανοποιεί ταυτόχρονα δύο προϋποθέσεις:
                  </p>
                  <ul className="list-disc list-inside space-y-1 font-medium text-slate-800">
                    <li>Όλες οι πλευρές του είναι ίσες μεταξύ τους (ισόπλευρο).</li>
                    <li>Όλες οι γωνίες του είναι ίσες μεταξύ τους (ισογώνιο).</li>
                  </ul>
                  <p className="text-xs text-sky-800 pt-1">
                    Παραδείγματα: Το <em>ισόπλευρο τρίγωνο</em> είναι το κανονικό τρίγωνο. Το <em>τετράγωνο</em> είναι το κανονικό τετράπλευρο.
                  </p>
                </div>

                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-2">
                  <h3 className="font-bold text-emerald-950">
                    {toCleanUppercase('Τι ειναι η Διαγωνιος;')}
                  </h3>
                  <p>
                    <strong>Διαγώνιος</strong> ενός πολυγώνου ονομάζεται το ευθύγραμμο τμήμα που ενώνει δύο 
                    <strong> μη διαδοχικές κορυφές</strong> του πολυγώνου.
                  </p>
                  <p className="text-xs sm:text-sm text-emerald-800 font-semibold">
                    Προσοχή: Το τρίγωνο έχει 3 κορυφές και όλες είναι διαδοχικές μεταξύ τους. Επομένως, το τρίγωνο <strong>δεν έχει καμία διαγώνιο</strong>!
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs sm:text-sm font-semibold text-emerald-700">
              ✓ Ο ρόμβος έχει ίσες πλευρές αλλά όχι απαραίτητα ίσες γωνίες, άρα γενικά δεν είναι κανονικό πολύγωνο.
            </div>
          </section>
        </div>

        {/* ΕΡΓΑΣΤΗΡΙΟ ΔΙΑΔΡΑΣΗΣ (INTERACTIVE GEOMETRY LAB) */}
        <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-800 mb-10">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <span className="px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs sm:text-sm font-semibold tracking-wider">
              {toCleanUppercase('ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΓΕΩΜΕΤΡΙΑΣ')}
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-white mt-3">
              {toCleanUppercase('Εξερευνηση Πολυγωνων και Διαγωνιων')}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-2">
              Επιλέξτε το πλήθος πλευρών για να παρατηρήσετε το κανονικό πολύγωνο, τις κορυφές του και τις διαγωνίους που σχηματίζονται.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* ΧΕΙΡΙΣΤΗΡΙΑ ΕΡΓΑΣΤΗΡΙΟΥ */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-3">
                  {toCleanUppercase('Επιλεξτε Πληθος Πλευρων (ν):')}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[3, 4, 5, 6, 7, 8, 10, 12].map((sides) => (
                    <button
                      key={sides}
                      onClick={() => setSelectedSides(sides)}
                      className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                        selectedSides === sides
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 ring-2 ring-indigo-400'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {sides}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-slate-300 font-medium">Όνομα Σχήματος:</span>
                  <span className="text-sm sm:text-base font-black text-amber-400">
                    {polygonNames[selectedSides]}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-slate-300 font-medium">Πλευρές (ν):</span>
                  <span className="text-sm sm:text-base font-black text-white">{selectedSides}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-slate-300 font-medium">Κορυφές:</span>
                  <span className="text-sm sm:text-base font-black text-white">{selectedSides}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-slate-300 font-medium">Διαγώνιοι ανά κορυφή (ν － 3):</span>
                  <span className="text-sm sm:text-base font-black text-sky-400">
                    {Math.max(0, selectedSides - 3)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-700/80">
                  <span className="text-xs sm:text-sm text-slate-200 font-bold">Σύνολο Διαγωνίων:</span>
                  <span className="text-base sm:text-xl font-black text-emerald-400">
                    {totalDiagonals}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowDiagonals(!showDiagonals)}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all border ${
                    showDiagonals
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                  }`}
                >
                  {showDiagonals
                    ? toCleanUppercase('Αποκρυψη Διαγωνιων')
                    : toCleanUppercase('Εμφανιση Διαγωνιων')}
                </button>
              </div>
            </div>

            {/* SVG VISUALIZER */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center p-4 sm:p-6 bg-slate-950/60 rounded-3xl border border-slate-800">
              <svg
                viewBox="0 0 400 360"
                className="w-full max-w-[360px] sm:max-w-[400px] h-auto drop-shadow-md select-none"
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
                      className="transition-all duration-300 opacity-80"
                    />
                  ))}

                {/* Περίμετρος Πολυγώνου */}
                <polygon
                  points={pointsStr}
                  fill="rgba(99, 102, 241, 0.15)"
                  stroke="#6366f1"
                  strokeWidth="3.5"
                  className="transition-all duration-300"
                />

                {/* Κορυφές */}
                {vertices.map((v, idx) => (
                  <g key={idx}>
                    <circle
                      cx={v.x}
                      cy={v.y}
                      r="6.5"
                      fill="#ffffff"
                      stroke="#4f46e5"
                      strokeWidth="2.5"
                    />
                    <text
                      x={v.x + (v.x - 200) * 0.16}
                      y={v.y + (v.y - 180) * 0.16 + 4}
                      fill="#e2e8f0"
                      fontSize="13"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {v.label}
                    </text>
                  </g>
                ))}
              </svg>
              <div className="mt-3 text-center text-xs text-slate-400">
                {selectedSides === 3 ? (
                  <span>Στο τρίγωνο δεν υπάρχουν μη διαδοχικές κορυφές, άρα οι διαγώνιοι είναι 0.</span>
                ) : (
                  <span>
                    Με κίτρινο διακεκομμένο χρώμα: οι <strong>{totalDiagonals}</strong> διαγώνιοι του σχήματος.
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ΚΑΡΤΑ 3: ΜΑΘΗΜΑΤΙΚΟΙ ΤΥΠΟΙ ΚΑΙ ΥΠΟΛΟΓΙΣΜΟΙ */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-lg">
              3
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-800">
              {toCleanUppercase('Μαθηματικοι Κανονες και ο Τυπος των Διαγωνιων')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700 text-sm sm:text-base">
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900">
                {toCleanUppercase('1. Διαγωνιοι απο ΜΙΑ κορυφη')}
              </h3>
              <p className="leading-relaxed">
                Αν ένα πολύγωνο έχει <strong>ν</strong> κορυφές, τότε από μία συγκεκριμένη κορυφή δεν μπορούμε να φέρουμε διαγώνιο:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>Προς την ίδια την κορυφή (1 κορυφή).</li>
                <li>Προς τις δύο γειτονικές της κορυφές (2 κορυφές).</li>
              </ul>
              <div className="p-3 bg-violet-50 rounded-xl border border-violet-100 font-bold text-violet-900 text-center">
                Διαγώνιοι από 1 κορυφή ＝ ν － 3
              </div>
              <p className="text-xs text-slate-500">
                Παράδειγμα: Σε ένα 6-γωνο, από μία κορυφή ξεκινούν 6 － 3 ＝ 3 διαγώνιοι.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-slate-900">
                {toCleanUppercase('2. Συνολο ολων των Διαγωνιων')}
              </h3>
              <p className="leading-relaxed">
                Επειδή κάθε πολύγωνο έχει <strong>ν</strong> κορυφές και από καθεμία φεύγουν (ν － 3) διαγώνιοι, θα είχαμε ν · (ν － 3). 
                Όμως, κάθε διαγώνιος ενώνει δύο κορυφές και υπολογίζεται 2 φορές! Επομένως διαιρούμε με το 2:
              </p>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 font-black text-emerald-900 text-center text-base sm:text-lg">
                Διαγώνιοι Πολυγώνου ＝ [ν · (ν － 3)] : 2
              </div>
              <p className="text-xs text-slate-500">
                Παράδειγμα για οκτάγωνο (ν ＝ 8): [8 · (8 － 3)] : 2 ＝ (8 · 5) : 2 ＝ 40 : 2 ＝ 20 διαγώνιοι.
              </p>
            </div>
          </div>
        </section>

        {/* ΚΑΡΤΑ 4: ΑΝΑΛΥΤΙΚΑ ΛΥΜΕΝΑ ΠΑΡΑΔΕΙΓΜΑΤΑ & ΠΡΟΒΛΗΜΑΤΑ */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-lg">
              4
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-800">
              {toCleanUppercase('Αναλυτικα Λυμενα Παραδειγματα και Προβληματα')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ΠΑΡΑΔΕΙΓΜΑ 1 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                  {toCleanUppercase('ΠΡΟΒΛΗΜΑ 1')}
                </span>
                <span className="text-xs text-slate-500 font-medium">Περίμετρος Κανονικού Πολυγώνου</span>
              </div>
              <p className="text-slate-800 text-sm font-semibold leading-relaxed">
                Ένα κανονικό εξάγωνο έχει πλευρά μήκους 4,5 cm. Πόση είναι η περίμετρός του;
              </p>
              <div className="space-y-2 text-xs sm:text-sm text-slate-700 bg-white p-4 rounded-xl border border-slate-200/80">
                <p>
                  <strong>Βήμα 1:</strong> Εντοπίζουμε ότι το εξάγωνο έχει 6 πλευρές (ν ＝ 6).
                </p>
                <p>
                  <strong>Βήμα 2:</strong> Επειδή είναι <em>κανονικό</em>, όλες οι 6 πλευρές του είναι ίσες μεταξύ τους (4,5 cm καθεμία).
                </p>
                <p>
                  <strong>Βήμα 3:</strong> Υπολογίζουμε την περίμετρο: 6 · 4,5 cm ＝ 27 cm.
                </p>
                <div className="pt-2 font-bold text-emerald-700 border-t border-slate-100">
                  Τελικό Αποτέλεσμα: Η περίμετρος του κανονικού εξαγώνου είναι 27 cm.
                </div>
              </div>
            </div>

            {/* ΠΑΡΑΔΕΙΓΜΑ 2 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-3 py-1 bg-amber-100 text-amber-800 rounded-full">
                  {toCleanUppercase('ΠΡΟΒΛΗΜΑ 2')}
                </span>
                <span className="text-xs text-slate-500 font-medium">Υπολογισμός Διαγωνίων</span>
              </div>
              <p className="text-slate-800 text-sm font-semibold leading-relaxed">
                Πόσες συνολικά διαγωνίους έχει ένα δεκάγωνο (πολύγωνο με 10 κορυφές);
              </p>
              <div className="space-y-2 text-xs sm:text-sm text-slate-700 bg-white p-4 rounded-xl border border-slate-200/80">
                <p>
                  <strong>Βήμα 1:</strong> Ορίζουμε το πλήθος των κορυφών: ν ＝ 10.
                </p>
                <p>
                  <strong>Βήμα 2:</strong> Βρίσκουμε τις διαγωνίους από μία κορυφή: ν － 3 ＝ 10 － 3 ＝ 7 διαγώνιοι.
                </p>
                <p>
                  <strong>Βήμα 3:</strong> Εφαρμόζουμε τον τύπο: [10 · (10 － 3)] : 2 ＝ (10 · 7) : 2 ＝ 70 : 2 ＝ 35.
                </p>
                <div className="pt-2 font-bold text-emerald-700 border-t border-slate-100">
                  Τελικό Αποτέλεσμα: Το δεκάγωνο έχει συνολικά 35 διαγωνίους.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ALERT BOX: ΠΡΟΣΟΧΗ / ΣΥΝΗΘΗ ΛΑΘΗ */}
        <section className="bg-amber-50 rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm">
          <div className="flex items-start gap-4">
            <span className="text-3xl sm:text-4xl flex-shrink-0">⚠️</span>
            <div className="space-y-3">
              <h3 className="text-base sm:text-lg font-black text-amber-950">
                {toCleanUppercase('Προσοχη / Συνηθη Λαθη που πρεπει να Αποφευγετε')}
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-amber-900 leading-relaxed list-disc list-inside">
                <li>
                  <strong>Μην μπερδεύετε τον ρόμβο ή το ορθογώνιο με το κανονικό τετράπλευρο:</strong> Ο ρόμβος έχει 4 ίσες πλευρές αλλά οι γωνίες του δεν είναι κατ' ανάγκη ίσες. Το ορθογώνιο έχει 4 ίσες γωνίες (90°) αλλά οι πλευρές του δεν είναι όλες ίσες. Μόνο το <em>τετράγωνο</em> είναι κανονικό τετράπλευρο!
                </li>
                <li>
                  <strong>Μην ξεχνάτε τη διαίρεση με το 2:</strong> Αν πολλαπλασιάσετε απλώς ν · (ν － 3), έχετε μετρήσει κάθε διαγώνιο δύο φορές (μία από κάθε άκρο της). Πρέπει πάντα να διαιρείτε με το 2.
                </li>
                <li>
                  <strong>Οι πλευρές δεν είναι διαγώνιοι:</strong> Το ευθύγραμμο τμήμα που ενώνει δύο διαδοχικές κορυφές είναι πλευρά του πολυγώνου, όχι διαγώνιος.
                </li>
                <li>
                  <strong>Τα τρίγωνα δεν έχουν διαγωνίους:</strong> Για ν ＝ 3, ν － 3 ＝ 0, συνεπώς το τρίγωνο έχει ακριβώς 0 διαγωνίους.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
