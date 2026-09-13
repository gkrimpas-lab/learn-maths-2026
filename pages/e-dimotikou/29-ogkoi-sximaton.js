// pages/e-dimotikou/29-ogkoi-sximaton.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function OgkoiSximatonTheoryPage() {
  const [activeSolid, setActiveSolid] = useState('cube');

  // Γεωμετρικές σταθερές σχεδίασης
  const cubeSide = 110;
  const rectW = 150;
  const rectH = 95;
  const rectD = 65;
  const cylRadius = 55;
  const cylHeight = 130;
  const coneRadius = 55;
  const coneHeight = 130;
  const pyrSize = 120;
  const pyrHeight = 130;
  const sphereRadius = 70;

  // Δεδομένα για κάθε στερεό
  const solidsData = {
    cube: {
      title: '🟩 Κύβος',
      category: 'Κανονικό Πολύεδρο',
      desc: 'Ο κύβος είναι το πιο συμμετρικό στερεό! Έχει 6 τετράγωνες έδρες, 8 κορυφές και 12 ίσες ακμές (μήκος, πλάτος και ύψος είναι ακριβώς ίσα).',
      formula: 'Όγκος ＝ Ακμή · Ακμή · Ακμή &nbsp; ( V ＝ α · α · α )',
      example: 'Παράδειγμα: Ένα ζάρι επιτραπέζιου ή ο κύβος του Ρούμπικ.'
    },
    box: {
      title: '🟧 Ορθογώνιο Παραλληλεπίπεδο',
      category: 'Πολύεδρο (Πρίσμα)',
      desc: 'Έχει 6 έδρες που είναι ορθογώνια παραλληλόγραμμα. Χαρακτηρίζεται από 3 διαστάσεις: Μήκος (α), Πλάτος (β) και Ύψος (γ).',
      formula: 'Όγκος ＝ Μήκος · Πλάτος · Ύψος &nbsp; ( V ＝ α · β · γ )',
      example: 'Παράδειγμα: Ένα κουτί παπουτσιών, ένα σπιρτόκουτο ή ένα τούβλο.'
    },
    cylinder: {
      title: '🥤 Κύλινδρος',
      category: 'Στερεό εκ Περιστροφής',
      desc: 'Αποτελείται από δύο παράλληλες κυκλικές βάσεις (πάνω και κάτω) και μια καμπύλη πλευρική επιφάνεια που του επιτρέπει να κυλάει.',
      formula: 'Όγκος ＝ Εμβαδόν Κυκλικής Βάσης · Ύψος &nbsp; ( V ＝ Εβ · υ )',
      example: 'Παράδειγμα: Ένα μεταλλικό κουτάκι αναψυκτικού ή ένα κυλινδρικό κερί.'
    },
    cone: {
      title: '🍦 Κώνος',
      category: 'Στερεό εκ Περιστροφής',
      desc: 'Έχει μία κυκλική βάση στο κάτω μέρος και στενεύει ομοιόμορφα προς τα πάνω καταλήγοντας σε μία μυτερή κορυφή.',
      formula: 'Όγκος ＝ ( Εμβαδόν Βάσης · Ύψος ) ： 3',
      example: 'Παράδειγμα: Το χωνάκι του παγωτού ή οι πορτοκαλί κώνοι της τροχαίας.'
    },
    pyramid: {
      title: '📐 Πυραμίδα',
      category: 'Πολύεδρο',
      desc: 'Έχει για βάση ένα πολύγωνο (συχνά τετράγωνο) και τριγωνικές παράπλευρες έδρες που ενώνονται όλες μαζί σε μία κοινή κορυφή.',
      formula: 'Όγκος ＝ ( Εμβαδόν Βάσης · Ύψος ) ： 3',
      example: 'Παράδειγμα: Οι διάσημες πυραμίδες της Γκίζας στην Αίγυπτο.'
    },
    sphere: {
      title: '⚽ Σφαίρα',
      category: 'Στερεό εκ Περιστροφής',
      desc: 'Είναι απόλυτα στρογγυλή από οποιαδήποτε πλευρά κι αν την κοιτάξουμε. Όλα τα σημεία της επιφάνειάς της ισαπέχουν από το κέντρο της (ακτίνα r).',
      formula: 'Ο όγκος εξαρτάται αποκλειστικά από την ακτίνα ( r ) της',
      example: 'Παράδειγμα: Μια μπάλα μπάσκετ, ένας βόλος ή ο πλανήτης Γη.'
    }
  };

  const currentSolid = solidsData[activeSolid];

  return (
    <Layout
      title="Τα Γεωμετρικά Στερεά & Όγκοι - Ε' Δημοτικού | LearnMaths.gr"
      description="Μάθετε για τα γεωμετρικά στερεά (κύβος, ορθογώνιο παραλληλεπίπεδο, κύλινδρος, κώνος, πυραμίδα, σφαίρα), τους τύπους όγκου τους και εξερευνήστε τον τρισδιάστατο καμβά."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/29-ogkoi-sximaton-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 29 • Ε' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Τα Γεωμετρικά Στερεά &amp; οι Όγκοι τους
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              Εξερευνούμε τα τρισδιάστατα σώματα του χώρου: τα πολύεδρα (κύβος, παραλληλεπίπεδο, πυραμίδα) και τα στερεά εκ περιστροφής (κύλινδρος, κώνος, σφαίρα). Μαθαίνουμε τα χαρακτηριστικά τους και πώς υπολογίζεται ο όγκος τους.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία &amp; Τρισδιάστατος Διαδραστικός Καμβάς Στερεών</span>
            </div>
            <Link
              href="/e-dimotikou/29-ogkoi-sximaton-ask"
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
              Η ταξινόμηση των γεωμετρικών στερεών και οι σχέσεις μεταξύ των όγκων τους.
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
                  Τι είναι τα Γεωμετρικά Στερεά;
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Σε αντίθεση με τα επίπεδα σχήματα που έχουν μόνο 2 διαστάσεις στο χαρτί, τα <strong>γεωμετρικά στερεά</strong> έχουν 3 διαστάσεις:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono">
                  <div>• <strong>Μήκος</strong> (διάσταση x)</div>
                  <div>• <strong>Πλάτος</strong> (διάσταση y)</div>
                  <div>• <strong>Ύψος</strong> (διάσταση z)</div>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Κάθε στερεό καταλαμβάνει χώρο, δηλαδή έχει <strong>όγκο</strong> και περικλείεται από επιφάνειες (έδρες).
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Ταξινόμηση</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Πολύεδρα &amp; Σώματα Περιστροφής
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Τα στερεά χωρίζονται σε δύο μεγάλες ομάδες:
                </p>

                <div className="space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-950">
                    • <strong>Πολύεδρα:</strong> Περικλείονται αποκλειστικά από επίπεδα πολύγωνα (κύβος, ορθογώνιο παραλληλεπίπεδο, πυραμίδα).
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                    • <strong>Στερεά εκ περιστροφής:</strong> Έχουν καμπύλες επιφάνειες και μπορούν να κυλήσουν (κύλινδρος, κώνος, σφαίρα).
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                ⚡ Τα πολύεδρα έχουν επίπεδες έδρες, ευθύγραμμες ακμές και γωνίες (κορυφές).
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Συσχέτιση</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Πρίσματα vs Πυραμίδες
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Μια συναρπαστική γεωμετρική σχέση στον όγκο:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono text-center">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-bold text-amber-950 shadow-inner">
                    Όγκος Πυραμίδας ＝ ( Όγκος Πρίσματος ) ： 3
                  </div>
                  <p className="text-slate-600 text-xs font-sans text-left pt-1">
                    Αν μια πυραμίδα και ένα πρίσμα (ή ένας κώνος και ένας κύλινδρος) έχουν την <strong>ίδια βάση</strong> και το <strong>ίδιο ύψος</strong>, η πυραμίδα χωράει ακριβώς <strong>το ένα τρίτο</strong> (: 3) του όγκου του πρίσματος!
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                🎯 Χρειάζονται ακριβώς 3 γεμάτοι κώνοι νερό για να γεμίσει ένας κύλινδρος με την ίδια βάση και ύψος!
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Πραγματική Ζωή</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Στερεά στην Καθημερινότητα
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Όλα τα αντικείμενα γύρω μας είναι γεωμετρικά στερεά:
                </p>

                <div className="space-y-1.5 text-xs sm:text-sm 2xl:text-base">
                  <div>• <strong>Κουτί παπουτσιών:</strong> Ορθογώνιο παραλληλεπίπεδο</div>
                  <div>• <strong>Κουτάκι αναψυκτικού:</strong> Κύλινδρος</div>
                  <div>• <strong>Μπάλα ποδοσφαίρου:</strong> Σφαίρα</div>
                  <div>• <strong>Χωνάκι παγωτού:</strong> Κώνος</div>
                </div>
              </div>

              <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 text-xs 2xl:text-sm text-purple-950 font-medium">
                🔍 Ο υπολογισμός του όγκου τους μάς επιτρέπει να γνωρίζουμε πόσο υγρό, βάρος ή χώρο μπορούν να αποθηκεύσουν.
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΣΤΕΡΕΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Τρισδιάστατος Εξερευνητής Στερεών Σωμάτων
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Επίλεξε οποιοδήποτε από τα 6 στερεά για να δεις την τρισδιάστατη γεωμετρική προβολή του, την αναλυτική περιγραφή, τον τύπο όγκου και πραγματικά παραδείγματα.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Αριστερή Στήλη: Επιλογέας & Πληροφορίες */}
            <div className="lg:col-span-6 2xl:col-span-6 space-y-6 bg-slate-50 p-4 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200 flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs 2xl:text-sm font-black tracking-wider text-slate-500 uppercase mb-3">
                    1. ΕΠΙΛΟΓΗ ΓΕΩΜΕΤΡΙΚΟΥ ΣΤΕΡΕΟΥ
                  </h4>

                  {/* Grid Επιλογής 6 Στερεών */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                    {[
                      { id: 'cube', label: '🟩 Κύβος' },
                      { id: 'box', label: '🟧 Παραλληλεπ.' },
                      { id: 'cylinder', label: '🥤 Κύλινδρος' },
                      { id: 'cone', label: '🍦 Κώνος' },
                      { id: 'pyramid', label: '📐 Πυραμίδα' },
                      { id: 'sphere', label: '⚽ Σφαίρα' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveSolid(item.id)}
                        className={`p-3 rounded-2xl font-bold text-xs sm:text-sm transition active:scale-95 text-center shadow-xs border ${
                          activeSolid === item.id
                            ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Κάρτα Ταυτότητας Στερεού */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black uppercase text-blue-700 tracking-wider">
                      {currentSolid.category}
                    </span>
                    <span className="text-xs font-mono text-slate-400 font-bold">3D Στερεό</span>
                  </div>
                  <h4 className="text-xl sm:text-2xl font-black text-slate-900">
                    {currentSolid.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                    {currentSolid.desc}
                  </p>
                </div>
              </div>

              {/* Πράσινη Κάρτα Τύπου & Παραδείγματος */}
              <div className="bg-emerald-50 text-slate-900 p-4 sm:p-5 rounded-2xl border border-emerald-200 space-y-2.5 shadow-xs text-center mt-4">
                <span className="text-[11px] font-black text-emerald-800 uppercase tracking-wider block">
                  ΜΑΘΗΜΑΤΙΚΟΣ ΤΥΠΟΣ ΟΓΚΟΥ
                </span>
                <div
                  className="text-sm sm:text-base font-black font-mono text-emerald-700 bg-white p-3 rounded-xl border border-emerald-200"
                  dangerouslySetInnerHTML={{ __html: currentSolid.formula }}
                />
                <p className="text-xs text-emerald-900 font-medium italic pt-0.5">
                  {currentSolid.example}
                </p>
              </div>
            </div>

            {/* Δεξιά Στήλη: Responsive SVG 3D Προβολή */}
            <div className="lg:col-span-6 2xl:col-span-6 bg-slate-50 p-6 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 flex flex-col items-center justify-between space-y-6">
              <div className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500 px-1">
                <span>ΤΡΙΣΔΙΑΣΤΑΤΗ ΓΕΩΜΕΤΡΙΚΗ ΠΡΟΒΟΛΗ</span>
                <span className="font-mono text-blue-600 font-bold">{currentSolid.title}</span>
              </div>

              {/* SVG 3D Canvas */}
              <div className="w-full max-w-[360px] aspect-square bg-white p-4 rounded-2xl border border-slate-200 shadow-inner flex items-center justify-center overflow-hidden my-auto">
                <svg
                  width="300"
                  height="300"
                  viewBox="0 0 300 300"
                  className="w-full h-full drop-shadow-sm"
                  shapeRendering="geometricPrecision"
                >
                  {/* ΚΥΒΟΣ */}
                  {activeSolid === 'cube' && (
                    <g transform="translate(95, 95)">
                      <rect
                        x="0"
                        y="35"
                        width={cubeSide}
                        height={cubeSide}
                        fill="#93c5fd"
                        stroke="#2563eb"
                        strokeWidth="2"
                        opacity="0.85"
                      />
                      <path
                        d={`M 0 35 L 35 0 L ${cubeSide + 35} 0 L ${cubeSide} 35 Z`}
                        fill="#bfdbfe"
                        stroke="#2563eb"
                        strokeWidth="2"
                      />
                      <path
                        d={`M ${cubeSide} 35 L ${cubeSide + 35} 0 L ${cubeSide + 35} ${cubeSide} L ${cubeSide} ${cubeSide + 35} Z`}
                        fill="#60a5fa"
                        stroke="#2563eb"
                        strokeWidth="2"
                      />
                    </g>
                  )}

                  {/* ΟΡΘΟΓΩΝΙΟ ΠΑΡΑΛΛΗΛΕΠΙΠΕΔΟ */}
                  {activeSolid === 'box' && (
                    <g transform="translate(65, 105)">
                      <rect
                        x="0"
                        y={rectD}
                        width={rectW}
                        height={rectH}
                        fill="#fde68a"
                        stroke="#d97706"
                        strokeWidth="2"
                        opacity="0.85"
                      />
                      <path
                        d={`M 0 ${rectD} L ${rectD} 0 L ${rectW + rectD} 0 L ${rectW} ${rectD} Z`}
                        fill="#fef3c7"
                        stroke="#d97706"
                        strokeWidth="2"
                      />
                      <path
                        d={`M ${rectW} ${rectD} L ${rectW + rectD} 0 L ${rectW + rectD} ${rectH} L ${rectW} ${rectH + rectD} Z`}
                        fill="#fcd34d"
                        stroke="#d97706"
                        strokeWidth="2"
                      />
                    </g>
                  )}

                  {/* ΚΥΛΙΝΔΡΟΣ */}
                  {activeSolid === 'cylinder' && (
                    <g transform="translate(150, 65)">
                      <path
                        d={`M ${-cylRadius} 30 L ${-cylRadius} ${cylHeight} A ${cylRadius} 24 0 0 0 ${cylRadius} ${cylHeight} L ${cylRadius} 30 Z`}
                        fill="#a7f3d0"
                        stroke="#059669"
                        strokeWidth="2"
                      />
                      <ellipse
                        cx="0"
                        cy={cylHeight}
                        rx={cylRadius}
                        ry="24"
                        fill="none"
                        stroke="#059669"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                      />
                      <ellipse
                        cx="0"
                        cy="30"
                        rx={cylRadius}
                        ry="24"
                        fill="#d1fae5"
                        stroke="#059669"
                        strokeWidth="2"
                      />
                    </g>
                  )}

                  {/* ΚΩΝΟΣ */}
                  {activeSolid === 'cone' && (
                    <g transform="translate(150, 65)">
                      <path
                        d={`M ${-coneRadius} ${coneHeight} L 0 0 L ${coneRadius} ${coneHeight} A ${coneRadius} 24 0 0 1 ${-coneRadius} ${coneHeight} Z`}
                        fill="#fbcfe8"
                        stroke="#db2777"
                        strokeWidth="2"
                      />
                      <path
                        d={`M ${-coneRadius} ${coneHeight} A ${coneRadius} 24 0 0 0 ${coneRadius} ${coneHeight}`}
                        fill="none"
                        stroke="#db2777"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                      />
                    </g>
                  )}

                  {/* ΠΥΡΑΜΙΔΑ */}
                  {activeSolid === 'pyramid' && (
                    <g transform="translate(150, 65)">
                      <path
                        d={`M ${-pyrSize / 2} ${pyrHeight} L 0 0 L ${pyrSize / 2} ${pyrHeight} Z`}
                        fill="#fed7aa"
                        stroke="#ea580c"
                        strokeWidth="2"
                      />
                      <path
                        d={`M ${pyrSize / 2} ${pyrHeight} L ${pyrSize / 2 + 35} ${pyrHeight - 20} L 0 0 Z`}
                        fill="#ffedd5"
                        stroke="#ea580c"
                        strokeWidth="2"
                      />
                      <path
                        d={`M ${-pyrSize / 2} ${pyrHeight} L ${35 - pyrSize / 2} ${pyrHeight - 20} L ${pyrSize / 2 + 35} ${pyrHeight - 20}`}
                        fill="none"
                        stroke="#ea580c"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                      />
                    </g>
                  )}

                  {/* ΣΦΑΙΡΑ */}
                  {activeSolid === 'sphere' && (
                    <g transform="translate(150, 150)">
                      <circle
                        cx="0"
                        cy="0"
                        r={sphereRadius}
                        fill="#fca5a5"
                        stroke="#dc2626"
                        strokeWidth="2"
                        opacity="0.85"
                      />
                      <ellipse
                        cx="0"
                        cy="0"
                        rx={sphereRadius}
                        ry="24"
                        fill="none"
                        stroke="#dc2626"
                        strokeWidth="2"
                        strokeDasharray="5 5"
                      />
                      <ellipse
                        cx="0"
                        cy="0"
                        rx={sphereRadius}
                        ry="23"
                        fill="none"
                        stroke="#dc2626"
                        strokeWidth="1"
                        opacity="0.4"
                      />
                    </g>
                  )}
                </svg>
              </div>

              {/* Callout Συμπεράσματος */}
              <div className="w-full max-w-md p-3.5 bg-slate-100 rounded-2xl border border-slate-200 text-center font-mono text-xs sm:text-sm text-slate-700">
                📦 Όλα τα στερεά σώματα καταλαμβάνουν χώρο σε 3 διαστάσεις και έχουν μετρήσιμο όγκο!
              </div>
            </div>
          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στα Γεωμετρικά Στερεά!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε απαιτητικές ασκήσεις αναγνώρισης στερεών, υπολογισμού όγκου κύβου, παραλληλεπιπέδου, κυλίνδρου και συσχέτισης πρίσματος με πυραμίδα.
            </p>
          </div>

          <Link
            href="/e-dimotikou/29-ogkoi-sximaton-ask"
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
