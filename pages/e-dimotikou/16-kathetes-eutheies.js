// pages/e-dimotikou/16-kathetes-eutheies.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function KathetesEutheiesTheoryPage() {
  // Γωνία τομής των δύο ευθειών (από 15° έως 165°)
  const [angle, setAngle] = useState(45);

  const isKathetes = angle === 90;

  // Υπολογισμοί SVG
  const cx = 300;
  const cy = 160;
  const lineLength = 135;

  // Ευθεία 1 (Σταθερή Οριζόντια Ευθεία ε1)
  const e1x1 = cx - lineLength;
  const e1y1 = cy;
  const e1x2 = cx + lineLength;
  const e1y2 = cy;

  // Ευθεία 2 (Κινούμενη Ευθεία ε2 βάσει της γωνίας)
  const rad = (angle * Math.PI) / 180;
  const e2x1 = Math.round(cx + lineLength * Math.cos(rad));
  const e2y1 = Math.round(cy - lineLength * Math.sin(rad));
  const e2x2 = Math.round(cx - lineLength * Math.cos(rad));
  const e2y2 = Math.round(cy + lineLength * Math.sin(rad));

  return (
    <Layout
      title="Κάθετες Ευθείες - Ε' Δημοτικού | LearnMaths.gr"
      description="Μάθετε για τις τεμνόμενες και κάθετες ευθείες, το σύμβολο καθετότητας, τις 4 ορθές γωνίες, την απόσταση σημείου από ευθεία και δοκιμάστε το διαδραστικό εργαστήριο."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/16-kathetes-eutheies-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 Ασκήσεις</span>
        </Link>
      }
    >
      {/* Container πλήρους εύρους για 2K & 4K και responsive για κινητά */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 space-y-10 2xl:space-y-14 pb-24">
        
        {/* 1. HEADER BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>ΚΕΦΑΛΑΙΟ 16 • Ε' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Τεμνόμενες &amp; Κάθετες Ευθείες
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              Ανακαλύπτουμε πότε δύο ευθείες τέμνονται, ποια ειδική γεωμετρική σχέση τις καθιστά κάθετες ( ⊥ ), γιατί δημιουργούνται 4 ορθές γωνίες των 90° και πώς ορίζεται η απόσταση σημείου από ευθεία.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία &amp; Δυναμικός Καμβάς Ευθειών</span>
            </div>
            <Link
              href="/e-dimotikou/16-kathetes-eutheies-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2.5 2xl:px-7 2xl:py-3.5 rounded-xl shadow-md transition active:scale-95 text-sm 2xl:text-base"
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
              Βασικές Έννοιες σε 4 Βήματα
            </h2>
            <p className="text-slate-600 text-sm sm:text-base 2xl:text-xl mt-1">
              Η σχετική θέση δύο ευθειών στο επίπεδο και η έννοια της καθετότητας.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 gap-6 2xl:gap-8">
            {/* Βήμα 1ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-sky-100 text-sky-800 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 1
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Έννοια</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Τεμνόμενες Ευθείες
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Δύο ευθείες στο ίδιο επίπεδο που έχουν <strong>ένα μόνο κοινό σημείο</strong> ονομάζονται <strong>τεμνόμενες ευθείες</strong>.
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div>• Το κοινό τους σημείο ονομάζεται <strong>σημείο τομής</strong>.</div>
                  <div>• Γύρω από το σημείο τομής σχηματίζονται <strong>4 γωνίες</strong> ανά δύο παραπληρωματικές και κατά κορυφή ίσες.</div>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Αν δύο ευθείες δεν τέμνονται ποτέ όσο κι αν τις προεκτείνουμε, ονομάζονται <strong>παράλληλες</strong>.
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Ορισμός</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Κάθετες Ευθείες ( ⊥ )
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Όταν δύο τεμνόμενες ευθείες τέμνονται σχηματίζοντας <strong>ορθή γωνία (90°)</strong>, ονομάζονται <strong>κάθετες ευθείες</strong>.
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-bold text-center text-emerald-950 shadow-inner">
                    Συμβολισμός: ε1 ⊥ ε2
                  </div>
                  <p className="text-slate-600 text-xs font-sans text-center">
                    Διαβάζεται: «Η ευθεία ε1 είναι κάθετη στην ευθεία ε2».
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                ⚡ Για να σχεδιάσουμε με ακρίβεια κάθετες ευθείες στο χαρτί, χρησιμοποιούμε το <strong>γνώμονα</strong> (ορθογώνιο τρίγωνο).
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Ιδιότητα</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Οι 4 Ορθές Γωνίες
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Αν δύο ευθείες σχηματίσουν <strong>μία μόνο ορθή γωνία</strong> στο σημείο τομής, τότε υποχρεωτικά <strong>και οι 4 γωνίες είναι ορθές</strong> (90°):
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono text-center">
                  <div className="p-2 bg-white rounded-xl border border-slate-300 font-black text-slate-900 shadow-inner">
                    90° ＋ 90° ＋ 90° ＋ 90° ＝ 360°
                  </div>
                  <p className="text-slate-600 text-xs font-sans text-left pt-1">
                    Οι γειτονικές γωνίες είναι παραπληρωματικές (180° － 90° ＝ 90°), άρα καμία γωνία δεν μπορεί να είναι οξεία ή αμβλεία!
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                🎯 Αρκεί να ελέγξουμε μόνο μία γωνία με τον γνώμονα: αν είναι 90°, όλες είναι 90°!
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Εφαρμογή</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Απόσταση Σημείου από Ευθεία
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Η συντομότερη διαδρομή από ένα σημείο Α προς μια ευθεία ε είναι το <strong>κάθετο ευθύγραμμο τμήμα</strong>:
                </p>

                <div className="space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-950">
                    • <strong>Απόσταση:</strong> Το μήκος του κάθετου τμήματος από το σημείο στην ευθεία.
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                    • Οποιοδήποτε άλλο πλάγιο τμήμα είναι <strong>πάντα μακρύτερο</strong> από το κάθετο.
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 text-xs 2xl:text-sm text-purple-950 font-medium">
                🔍 Σε αυτόν τον κανόνα βασίζεται και το <strong>ύψος</strong> των τριγώνων και των γεωμετρικών σχημάτων.
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΚΑΘΕΤΩΝ ΕΥΘΕΙΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Δυναμικός Καμβάς Τομής Ευθειών
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Περίστρεψε την ευθεία ε2 σύροντας τον δρομέα. Παρατήρησε πώς αλλάζει η γωνία τομής και πάτησε το κουμπί για να τις ευθυγραμμίσεις ακριβώς στις 90°.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Αριστερή Στήλη: Χειριστήρια & Κατάσταση */}
            <div className="lg:col-span-5 2xl:col-span-5 space-y-6 bg-slate-50 p-6 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200">
              <h4 className="text-xs 2xl:text-sm font-black tracking-wider text-slate-500">
                ΠΕΡΙΣΤΡΟΦΗ ΕΥΘΕΙΑΣ ε2
              </h4>

              {/* Stepper Γωνίας Τομής */}
              <div className="space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">Γωνία Τομής:</span>
                  <span
                    className={`min-w-[80px] text-center font-mono font-black text-2xl bg-white px-2.5 py-0.5 rounded-xl border shadow-sm transition ${
                      isKathetes
                        ? 'text-emerald-600 border-emerald-300 ring-2 ring-emerald-100'
                        : 'text-blue-600 border-blue-200'
                    }`}
                  >
                    {angle}°
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Μείωση γωνίας κατά 1°"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setAngle((prev) => Math.max(15, prev - 1));
                    }}
                    disabled={angle <= 15}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>

                  <input
                    type="range"
                    min="15"
                    max="165"
                    step="1"
                    value={angle}
                    onChange={(e) => setAngle(Number(e.target.value))}
                    aria-label="Γωνία τομής ευθειών"
                    className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                  />

                  <button
                    type="button"
                    aria-label="Αύξηση γωνίας κατά 1°"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setAngle((prev) => Math.min(165, prev + 1));
                    }}
                    disabled={angle >= 165}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>

                {/* Γρήγορο κουμπί snap στις 90° */}
                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={() => setAngle(90)}
                    className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-black transition active:scale-95 shadow-sm ${
                      isKathetes
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    🎯 Ευθυγράμμιση στις 90° (Κάθετες)
                  </button>
                </div>
              </div>

              {/* Κάρτα Κατάστασης Ευθειών */}
              <div
                className={`p-5 rounded-2xl border space-y-2 shadow-sm text-center transition duration-200 ${
                  isKathetes
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                  ΣΧΕΣΗ ΜΕΤΑΞΥ ΕΥΘΕΙΩΝ
                </span>
                <div
                  className={`text-2xl sm:text-3xl font-black ${
                    isKathetes ? 'text-emerald-700 animate-pulse' : 'text-slate-800'
                  }`}
                >
                  {isKathetes ? 'ε1 ⊥ ε2 (ΚΑΘΕΤΕΣ)' : 'ΤΕΜΝΟΜΕΝΕΣ'}
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-600">
                  {isKathetes
                    ? 'Σχηματίζουν ακριβώς 4 ορθές γωνίες των 90° γύρω από το σημείο τομής.'
                    : `Σχηματίζουν δύο οξείες γωνίες ${angle}° και δύο αμβλείες ${180 - angle}°.`}
                </p>
              </div>
            </div>

            {/* Δεξιά Στήλη: Responsive SVG Γεωμετρικός Καμβάς */}
            <div className="lg:col-span-7 2xl:col-span-7 bg-slate-50 p-6 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 flex flex-col items-center justify-center space-y-6">
              <div className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500 px-1">
                <span>ΓΕΩΜΕΤΡΙΚΗ ΑΠΕΙΚΟΝΙΣΗ</span>
                <span className="font-mono text-blue-600 font-bold">
                  {isKathetes ? 'Ορθές: 4 · 90° ＝ 360°' : `Γωνίες: ${angle}° και ${180 - angle}°`}
                </span>
              </div>

              {/* SVG Canvas */}
              <div className="w-full max-w-[520px] aspect-[560/320] bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 560 320" className="w-full h-full drop-shadow-sm">
                  {/* Τετραγωνάκια 4 Ορθών Γωνιών (εμφάνιση μόνο όταν είναι 90°) */}
                  {isKathetes && (
                    <g className="stroke-emerald-600 stroke-[1.5] fill-emerald-500/20">
                      {/* Πάνω Δεξιά */}
                      <rect x={cx} y={cy - 20} width="20" height="20" />
                      {/* Πάνω Αριστερά */}
                      <rect x={cx - 20} y={cy - 20} width="20" height="20" />
                      {/* Κάτω Αριστερά */}
                      <rect x={cx - 20} y={cy} width="20" height="20" />
                      {/* Κάτω Δεξιά */}
                      <rect x={cx} y={cy} width="20" height="20" />
                    </g>
                  )}

                  {/* Ευθεία 1 (ε1) - Σταθερή Οριζόντια */}
                  <line
                    x1={e1x1}
                    y1={e1y1}
                    x2={e1x2}
                    y2={e1y2}
                    className={`stroke-[4] stroke-linecap-round transition-colors duration-200 ${
                      isKathetes ? 'stroke-emerald-600' : 'stroke-slate-800'
                    }`}
                  />
                  <text
                    x={e1x2 + 12}
                    y={e1y2 + 5}
                    className={`font-sans text-xs font-black ${
                      isKathetes ? 'fill-emerald-700' : 'fill-slate-800'
                    }`}
                  >
                    ε1
                  </text>

                  {/* Ευθεία 2 (ε2) - Κινούμενη */}
                  <line
                    x1={e2x1}
                    y1={e2y1}
                    x2={e2x2}
                    y2={e2y2}
                    className={`stroke-[4] stroke-linecap-round transition-colors duration-200 ${
                      isKathetes ? 'stroke-emerald-600' : 'stroke-blue-600'
                    }`}
                  />
                  <text
                    x={e2x1 + 10}
                    y={e2y1 - 8}
                    className={`font-sans text-xs font-black ${
                      isKathetes ? 'fill-emerald-700' : 'fill-blue-700'
                    }`}
                  >
                    ε2
                  </text>

                  {/* Σημείο Τομής */}
                  <circle cx={cx} cy={cy} r="5" className={isKathetes ? 'fill-emerald-800' : 'fill-slate-900'} />
                  <text x={cx + 8} y={cy + 18} className="font-mono text-[11px] font-bold fill-slate-500">
                    Ο
                  </text>

                  {/* Ετικέτες μοιρών όταν δεν είναι κάθετες */}
                  {!isKathetes && (
                    <g className="font-mono text-[11px] font-black">
                      <text x={cx + 30} y={cy - 12} className="fill-blue-700">
                        {angle}°
                      </text>
                      <text x={cx - 55} y={cy - 12} className="fill-slate-500">
                        {180 - angle}°
                      </text>
                    </g>
                  )}
                </svg>
              </div>

              {/* Callout Συμπεράσματος */}
              <div className="w-full max-w-md p-3.5 bg-slate-100 rounded-2xl border border-slate-200 text-center font-mono text-xs sm:text-sm text-slate-700">
                {isKathetes ? (
                  <span>
                    🟢 Πλήρης καθετότητα: <strong className="text-emerald-700">ε1 ⊥ ε2</strong> (4 γωνίες των 90°)
                  </span>
                ) : (
                  <span>
                    ✂️ Τεμνόμενες μη κάθετες ευθείες (γωνία τομής: <strong className="text-blue-700">{angle}°</strong>)
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στις Κάθετες Ευθείες!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε απαιτητικές ασκήσεις αναγνώρισης καθετότητας, υπολογισμού γωνιών τομής και απόστασης σημείου από ευθεία.
            </p>
          </div>

          <Link
            href="/e-dimotikou/16-kathetes-eutheies-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 Έναρξη Ασκήσεων</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
