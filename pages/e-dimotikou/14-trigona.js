// pages/e-dimotikou/14-trigona.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Ρυθμίσεις ορίων γωνίας
const ANGLE_MIN = 15;
const ANGLE_MAX = 150;

export default function TrigonaTheoryPage() {
  // Αρχική τιμή γωνίας Β
  const [angleB, setAngleB] = useState(60);

  // Διασφάλιση ορίων
  const currentB = Math.max(ANGLE_MIN, Math.min(ANGLE_MAX, angleB));

  // Γεωμετρικός υπολογισμός θέσης κορυφών
  const baseSide = 220; // Μήκος βάσης ΒΓ
  const radius = 170;   // Μήκος πλευράς ΑΒ

  const bx = 260; // Συντεταγμένες κορυφής Β
  const by = 260;
  const gx = bx + baseSide; // Κορυφή Γ
  const gy = 260;

  // Μετατροπή γωνίας Β σε ακτίνια
  const radB = (currentB * Math.PI) / 180;

  // Υπολογισμός κορυφής Α
  const ax = Math.round(bx + radius * Math.cos(radB));
  const ay = Math.round(by - radius * Math.sin(radB));

  // Υπολογισμός μήκους πλευράς ΑΓ
  const sideb = Math.sqrt(
    radius * radius + baseSide * baseSide - 2 * radius * baseSide * Math.cos(radB)
  );

  // Υπολογισμός γωνιών Γ και Α
  const dy = by - ay;
  const angleΓ = Math.max(1, Math.round((Math.asin(Math.min(1, dy / sideb)) * 180) / Math.PI));
  const angleA = Math.max(1, 180 - currentB - angleΓ);

  // Κατηγοριοποίηση τριγώνου
  const getTriangleType = () => {
    if (angleA === 90 || currentB === 90 || angleΓ === 90) {
      return {
        title: 'Ορθογώνιο Τρίγωνο',
        desc: 'Έχει ακριβώς μία ορθή γωνία (90°). Οι άλλες δύο γωνίες είναι οξείες.',
        color: 'text-emerald-600',
        badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-300'
      };
    }
    if (angleA > 90 || currentB > 90 || angleΓ > 90) {
      return {
        title: 'Αμβλυγώνιο Τρίγωνο',
        desc: 'Έχει μία αμβλεία γωνία ( ＞ 90° ). Οι άλλες δύο γωνίες είναι αναγκαστικά οξείες.',
        color: 'text-purple-600',
        badgeBg: 'bg-purple-50 text-purple-800 border-purple-200'
      };
    }
    return {
      title: 'Οξυγώνιο Τρίγωνο',
      desc: 'Όλες οι γωνίες του είναι οξείες (μικρότερες από 90°).',
      color: 'text-blue-600',
      badgeBg: 'bg-blue-50 text-blue-800 border-blue-200'
    };
  };

  const triType = getTriangleType();

  return (
    <Layout
      title="Τρίγωνα ως προς τις Γωνίες - Ε' Δημοτικού | LearnMaths.gr"
      description="Πλήρης θεωρία με παραδείγματα για τα είδη τριγώνων (οξυγώνιο, ορθογώνιο, αμβλυγώνιο), το άθροισμα των 180° και διαδραστικό γεωμετρικό εργαστήριο."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/14-trigona-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 14 • Ε' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Τρίγωνα ως προς τις Γωνίες
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              Εξερευνούμε πώς κατατάσσονται τα τρίγωνα με κριτήριο τα είδη των γωνιών τους, γιατί το άθροισμα των γωνιών οποιουδήποτε τριγώνου ισούται πάντα με 180° και πώς αλλάζει το σχήμα όταν μεταβάλλεται μία γωνία.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία &amp; Δυναμικό Γεωμετρικό Τρίγωνο</span>
            </div>
            <Link
              href="/e-dimotikou/14-trigona-ask"
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
              Η γεωμετρική ταυτότητα και τα είδη των τριγώνων ανάλογα με τις μοίρες των γωνιών τους.
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
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Ορισμός</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Ανατομία του Τριγώνου
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  <strong>Τρίγωνο</strong> είναι το επίπεδο γεωμετρικό σχήμα που περικλείεται από 3 ευθύγραμμα τμήματα (πλευρές) και σχηματίζει 3 κορυφές και 3 εσωτερικές γωνίες.
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div>• <strong>3 Κορυφές:</strong> Σημεία Α, Β, Γ.</div>
                  <div>• <strong>3 Πλευρές:</strong> Τμήματα ΑΒ, ΒΓ, ΑΓ.</div>
                  <div>• <strong>3 Εσωτερικές Γωνίες:</strong> Γωνίες Α, Β, Γ.</div>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Το τρίγωνο είναι το απλούστερο δυνατό πολύγωνο της γεωμετρίας!
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Κατάταξη</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Τα 3 Είδη ως προς τις Γωνίες
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Ανάλογα με το μέτρο των γωνιών τους, όλα τα τρίγωνα του κόσμου ανήκουν σε μία από τις εξής 3 κατηγορίες:
                </p>

                <div className="bg-slate-50 p-3.5 2xl:p-4 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm">
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <strong className="text-blue-700">1. Οξυγώνιο:</strong> Έχει <strong>και τις 3 γωνίες του οξείες</strong> (όλες ＜ 90°).
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <strong className="text-emerald-700">2. Ορθογώνιο:</strong> Έχει <strong>μία ορθή γωνία</strong> (ακριβώς 90°).
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <strong className="text-purple-700">3. Αμβλυγώνιο:</strong> Έχει <strong>μία αμβλεία γωνία</strong> ( ＞ 90° ).
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Ένα τρίγωνο είναι αδύνατον να έχει δύο ορθές ή δύο αμβλείες γωνίες!
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Θεώρημα</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Το Άθροισμα των 180°
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Σε <strong>οποιοδήποτε τρίγωνο</strong>, ανεξαρτήτως σχήματος ή μεγέθους, το άθροισμα των τριών εσωτερικών γωνιών ισούται πάντα με 180°:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono text-center">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-black text-indigo-950 shadow-inner">
                    Γωνία Α ＋ Γωνία Β ＋ Γωνία Γ ＝ 180°
                  </div>
                  <p className="text-slate-600 text-xs font-sans text-left pt-1">
                    Αν γνωρίζουμε δύο γωνίες (π.χ. 50° και 70°), η τρίτη υπολογίζεται αμέσως: 180° － (50° ＋ 70°) ＝ <strong>60°</strong>.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Στο ορθογώνιο τρίγωνο, οι δύο οξείες γωνίες είναι συμπληρωματικές (άθροισμα ＝ 90°).
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Συσχέτιση</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Γωνίες &amp; Απέναντι Πλευρές
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Υπάρχει μία απόλυτη αντιστοιχία ανάμεσα στο άνοιγμα μιας γωνίας και το μήκος της απέναντι πλευράς:
                </p>

                <div className="space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                    • <strong>Απέναντι από τη μεγαλύτερη γωνία</strong> βρίσκεται πάντα η <strong>μεγαλύτερη πλευρά</strong> του τριγώνου.
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-950">
                    • <strong>Στο ορθογώνιο τρίγωνο:</strong> Η μεγαλύτερη πλευρά είναι η <strong>υποτείνουσα</strong> (απέναντι από την ορθή γωνία των 90°).
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🔍 Αν δύο γωνίες είναι ίσες (ισοσκελές), και οι απέναντι πλευρές τους είναι απολύτως ίσες.
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΤΡΙΓΩΝΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Δυναμικό Γεωμετρικό Τρίγωνο
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Άλλαξε το άνοιγμα της γωνίας Β. Παρατήρησε πώς κινείται η κορυφή Α, πώς αλλάζουν αυτόματα όλες οι γωνίες και πότε το τρίγωνο γίνεται ορθογώνιο ή αμβλυγώνιο.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Αριστερή Στήλη: Χειριστήρια & Ταυτότητα Τριγώνου */}
            <div className="lg:col-span-5 2xl:col-span-5 space-y-6 bg-slate-50 p-6 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200">
              <h4 className="text-xs 2xl:text-sm font-black tracking-wider text-slate-500">
                ΜΕΤΑΒΟΛΗ ΓΩΝΙΑΣ Β
              </h4>

              {/* Stepper Γωνίας Β */}
              <div className="space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">Γωνία Β:</span>
                  <span className="min-w-[80px] text-center font-mono font-black text-2xl text-blue-600 bg-white px-2.5 py-0.5 rounded-xl border border-blue-200 shadow-sm">
                    {currentB}°
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Μείωση γωνίας Β κατά 1"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setAngleB((prev) => Math.max(ANGLE_MIN, prev - 1));
                    }}
                    disabled={currentB <= ANGLE_MIN}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>

                  <input
                    type="range"
                    min={ANGLE_MIN}
                    max={ANGLE_MAX}
                    step="1"
                    value={currentB}
                    onChange={(e) => setAngleB(Number(e.target.value))}
                    aria-label="Γωνία Β"
                    className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                  />

                  <button
                    type="button"
                    aria-label="Αύξηση γωνίας Β κατά 1"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setAngleB((prev) => Math.min(ANGLE_MAX, prev + 1));
                    }}
                    disabled={currentB >= ANGLE_MAX}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>

                {/* Γρήγορα κουμπιά συνήθων γωνιών */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
                  {[30, 45, 60, 90, 110, 120].map((val) => (
                    <button
                      key={`btn-ang-${val}`}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setAngleB(val);
                      }}
                      className={`text-xs font-mono px-2.5 py-1 rounded-lg font-semibold transition ${
                        currentB === val
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {val}°
                    </button>
                  ))}
                </div>
              </div>

              {/* Κάρτα Ταυτότητας Τριγώνου */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-sm text-center">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                  ΧΑΡΑΚΤΗΡΙΣΜΟΣ ΤΡΙΓΩΝΟΥ
                </span>
                <div className={`text-2xl sm:text-3xl font-black ${triType.color}`}>
                  {triType.title}
                </div>
                <div className={`p-2.5 rounded-xl border text-xs font-medium ${triType.badgeBg}`}>
                  {triType.desc}
                </div>

                {/* Μέτρα και των 3 γωνιών */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 font-mono text-xs sm:text-sm font-bold text-slate-800">
                  <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-200">
                    Α ＝ {angleA}°
                  </div>
                  <div className="p-1.5 bg-blue-50 text-blue-800 rounded-lg border border-blue-200 font-black">
                    Β ＝ {currentB}°
                  </div>
                  <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-200">
                    Γ ＝ {angleΓ}°
                  </div>
                </div>
              </div>
            </div>

            {/* Δεξιά Στήλη: Responsive SVG Γεωμετρικό Σχήμα */}
            <div className="lg:col-span-7 2xl:col-span-7 bg-slate-50 p-6 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 flex flex-col items-center justify-center space-y-6">
              <div className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500 px-1">
                <span>ΓΕΩΜΕΤΡΙΚΗ ΑΠΕΙΚΟΝΙΣΗ (ΒΑΣΗ ΒΓ)</span>
                <span className="font-mono text-blue-600 font-bold">
                  {angleA}° ＋ {currentB}° ＋ {angleΓ}° ＝ 180°
                </span>
              </div>

              {/* SVG Canvas */}
              <div className="w-full max-w-[540px] aspect-[560/320] bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 560 320" className="w-full h-full drop-shadow-sm">
                  {/* Νοητό ημικύκλιο τροχιάς κορυφής Α */}
                  <path
                    d={`M ${bx + radius} ${by} A ${radius} ${radius} 0 0 0 ${bx - radius} ${by}`}
                    fill="none"
                    className="stroke-slate-200 stroke-1"
                    strokeDasharray="4 4"
                  />

                  {/* Τρίγωνο ΑΒΓ */}
                  <polygon
                    points={`${ax},${ay} ${bx},${by} ${gx},${gy}`}
                    className="fill-sky-500/10 stroke-sky-600 stroke-[3.5] stroke-linejoin-round"
                  />

                  {/* Κορυφή Α */}
                  <circle cx={ax} cy={ay} r="6" className="fill-slate-900" />
                  <text x={ax} y={ay - 12} textAnchor="middle" className="font-sans text-sm font-black fill-slate-900">
                    Α ({angleA}°)
                  </text>

                  {/* Κορυφή Β */}
                  <circle cx={bx} cy={by} r="6" className="fill-blue-600" />
                  <text x={bx - 16} y={by + 6} textAnchor="end" className="font-sans text-sm font-black fill-blue-700">
                    Β ({currentB}°)
                  </text>

                  {/* Κορυφή Γ */}
                  <circle cx={gx} cy={gy} r="6" className="fill-slate-900" />
                  <text x={gx + 16} y={gy + 6} textAnchor="start" className="font-sans text-sm font-black fill-slate-900">
                    Γ ({angleΓ}°)
                  </text>

                  {/* Βάση ΒΓ */}
                  <line x1={bx} y1={by} x2={gx} y2={gy} className="stroke-slate-800 stroke-[3]" />
                </svg>
              </div>

              {/* Callout Συμπεράσματος */}
              <div className="w-full max-w-lg p-3.5 bg-slate-100 rounded-2xl border border-slate-200 text-center font-mono text-xs sm:text-sm text-slate-700">
                Τρίγωνο ΑΒΓ • Είδος: <strong className={triType.color}>{triType.title}</strong> • Άθροισμα: <strong className="text-slate-900">180°</strong>
              </div>
            </div>
          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στα Τρίγωνα!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε απαιτητικές ασκήσεις εύρεσης άγνωστης γωνίας, κατάταξης τριγώνων και γεωμετρικών υπολογισμών.
            </p>
          </div>

          <Link
            href="/e-dimotikou/14-trigona-ask"
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
