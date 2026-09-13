// pages/e-dimotikou/21-monades-mikous.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function MonadesMikousTheoryPage() {
  const [selectedUnit, setSelectedUnit] = useState(3); // Αρχική επιλογή: Μέτρο (m)
  const [inputValue, setInputValue] = useState('150'); // String με αυστηρό validation

  const units = [
    { id: 0, name: 'χιλιοστό (mm)', short: 'mm', factorToMeters: 0.001, desc: 'Για πολύ μικρά μήκη (π.χ. το πάχος μιας πιστωτικής κάρτας).' },
    { id: 1, name: 'εκατοστό (cm)', short: 'cm', factorToMeters: 0.01, desc: 'Για καθημερινά αντικείμενα (π.χ. ένα μολύβι, χάρακας).' },
    { id: 2, name: 'δεκατόμετρο (dm)', short: 'dm', factorToMeters: 0.1, desc: 'Ισούται με 10 εκατοστά (π.χ. το άνοιγμα μιας παλάμης).' },
    { id: 3, name: 'μέτρο (m)', short: 'm', factorToMeters: 1, desc: 'Η θεμελιώδης βασική μονάδα μέτρησης μήκους.' },
    { id: 4, name: 'χιλιόμετρο (km)', short: 'km', factorToMeters: 1000, desc: 'Για μεγάλες αποστάσεις (π.χ. διαδρομές μεταξύ πόλεων).' }
  ];

  const currentUnit = units[selectedUnit];

  // Αυστηρός έλεγχος δεδομένων εισόδου: μόνο νούμερα, μία υποδιαστολή, μέγιστο 10 χαρακτήρες
  const handleInputChange = (rawVal) => {
    // 1. Μετατροπή τελείας σε κόμμα και αφαίρεση οποιουδήποτε χαρακτήρα εκτός από ψηφία 0-9 και κόμμα
    let clean = rawVal.replace('.', ',').replace(/[^0-9,]/g, '');

    // 2. Επιτρέπεται το πολύ ένα κόμμα
    const parts = clean.split(',');
    if (parts.length > 2) {
      clean = parts[0] + ',' + parts.slice(1).join('');
    }

    // 3. Αυστηρό όριο 10 ψηφίων/χαρακτήρων
    if (clean.length > 10) {
      clean = clean.slice(0, 10);
    }

    setInputValue(clean);
  };

  // Μετατροπή και εμφάνιση με ακρίβεια έως 6 δεκαδικά ψηφία
  const convertValue = (targetUnitObj) => {
    if (!inputValue || inputValue === ',') return '0';
    const cleanStr = inputValue.replace(',', '.');
    const numValue = parseFloat(cleanStr);
    if (isNaN(numValue) || numValue <= 0) return '0';

    const valueInMeters = numValue * currentUnit.factorToMeters;
    const finalValue = valueInMeters / targetUnitObj.factorToMeters;

    if (finalValue % 1 === 0) return finalValue.toLocaleString('el-GR');

    return finalValue.toLocaleString('el-GR', { maximumFractionDigits: 6 });
  };

  return (
    <Layout
      title="Μονάδες Μέτρησης Μήκους - Ε' Δημοτικού | LearnMaths.gr"
      description="Μάθετε τις μονάδες μέτρησης μήκους (km, m, dm, cm, mm), τον κανόνα της σκάλας μετατροπών, πολλαπλασιασμό και διαίρεση με δυνάμεις του 10 και δοκιμάστε το διαδραστικό εργαστήριο."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/21-monades-mikous-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 21 • Ε' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Μονάδες Μέτρησης Μήκους
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              Εξερευνούμε το μέτρο (m) ως βασική μονάδα μήκους, τις υποδιαιρέσεις του (dm, cm, mm), το πολλαπλάσιο του χιλιομέτρου (km) και μαθαίνουμε τον κανόνα της σκάλας για άμεσες και αλάνθαστες μετατροπές.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία &amp; Διαδραστικός Μετατροπέας Μονάδων</span>
            </div>
            <Link
              href="/e-dimotikou/21-monades-mikous-ask"
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
              Η κλίμακα των μονάδων μέτρησης και οι μαθηματικοί κανόνες μετατροπής.
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
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Βασική Μονάδα</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Το Μέτρο &amp; οι Υποδιαιρέσεις
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Η κύρια μονάδα μέτρησης μήκους είναι το <strong>μέτρο (m)</strong>. Για μικρότερα αντικείμενα χρησιμοποιούμε τις υποδιαιρέσεις του:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono">
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200 flex justify-between">
                    <span>1 m ＝ 10 dm</span>
                    <span className="text-slate-500">(δεκατόμετρα)</span>
                  </div>
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200 flex justify-between">
                    <span>1 m ＝ 100 cm</span>
                    <span className="text-slate-500">(εκατοστά)</span>
                  </div>
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200 flex justify-between">
                    <span>1 m ＝ 1.000 mm</span>
                    <span className="text-slate-500">(χιλιοστά)</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Κάθε διαδοχική υποδιαίρεση είναι <strong>10 φορές μικρότερη</strong> από την προηγούμενη ( 1 dm ＝ 10 cm, 1 cm ＝ 10 mm ).
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Πολλαπλάσιο</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Το Χιλιόμετρο (km)
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Για τη μέτρηση μεγάλων αποστάσεων (π.χ. μεταξύ πόλεων, οδικά δίκτυα) χρησιμοποιούμε το <strong>χιλιόμετρο (km)</strong>:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono text-center">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-black text-emerald-950 shadow-inner">
                    1 km ＝ 1.000 m
                  </div>
                  <p className="text-slate-600 text-xs font-sans text-left pt-1">
                    Αντίστροφα, 1 μέτρο ισούται με το ένα χιλιοστό του χιλιομέτρου: 1 m ＝ 1/1.000 km ＝ 0,001 km.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                ⚡ <strong>Προσοχή:</strong> Το άλμα ανάμεσα σε m και km αξίζει <strong>1.000</strong> (όχι 10)!
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Μετατροπές</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Ο Κανόνας της Σκάλας
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Φανταζόμαστε τις μονάδες τοποθετημένες σε σκαλοπάτια (km → m → dm → cm → mm):
                </p>

                <div className="space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-950">
                    • <strong>Κατεβαίνω τη σκάλα</strong> (από μεγαλύτερη σε μικρότερη μονάδα):<br />
                    <span className="font-mono font-bold">Πολλαπλασιάζω ( · ) με το 10, 100, 1.000</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-950">
                    • <strong>Ανεβαίνω τη σκάλα</strong> (από μικρότερη σε μεγαλύτερη μονάδα):<br />
                    <span className="font-mono font-bold">Διαιρώ ( ： ) με το 10, 100, 1.000</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                🎯 <strong>Κανόνας μνήμης:</strong> Μεγάλη σε μικρή μονάδα ➔ πολλαπλασιασμός. Μικρή σε μεγάλη ➔ διαίρεση.
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Δεκαδικοί Αριθμοί</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Μετακίνηση Υποδιαστολής
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Επειδή πολλαπλασιάζουμε ή διαιρούμε με το 10, 100, 1.000, μετακινούμε απλώς την υποδιαστολή:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono">
                  <div>• 3,5 m ＝ 3,5 · 100 ＝ <strong>350 cm</strong></div>
                  <div>• 450 mm ＝ 450 ： 1.000 ＝ <strong>0,45 m</strong></div>
                  <div>• 2,8 km ＝ 2,8 · 1.000 ＝ <strong>2.800 m</strong></div>
                </div>
              </div>

              <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 text-xs 2xl:text-sm text-purple-950 font-medium">
                🔍 Στον πολλαπλασιασμό η υποδιαστολή πάει δεξιά. Στη διαίρεση πάει αριστερά!
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ: ΜΕΤΑΤΡΟΠΕΑΣ & ΣΚΑΛΑ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Ζωντανός Μετατροπέας &amp; Οπτική Σκάλα Μονάδων
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Πληκτρολόγησε οποιονδήποτε αριθμό (μόνο ψηφία, έως 10 χαρακτήρες), επίλεξε τη μονάδα βάσης και δες ταυτόχρονα όλες τις ισοδύναμες τιμές και τη θέση στη γεωμετρική σκάλα.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Αριστερή Στήλη: Χειριστήρια & Πίνακας Ισοδύναμων Μηκών */}
            <div className="lg:col-span-6 2xl:col-span-6 space-y-6 bg-slate-50 p-6 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200 flex flex-col justify-between">
              <div className="space-y-4">
                <h4 className="text-xs 2xl:text-sm font-black tracking-wider text-slate-500">
                  ΕΙΣΑΓΩΓΗ ΤΙΜΗΣ &amp; ΜΟΝΑΔΑΣ ΒΑΣΗΣ
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="sm:col-span-7 space-y-1">
                    <div className="flex items-center justify-between">
                      <label htmlFor="input-amount" className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                        ΠΟΣΟΤΗΤΑ
                      </label>
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        {inputValue.length}/10 ψηφία
                      </span>
                    </div>
                    <input
                      id="input-amount"
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      maxLength={10}
                      value={inputValue}
                      onChange={(e) => handleInputChange(e.target.value)}
                      placeholder="π.χ. 150"
                      className="w-full bg-slate-50 border border-slate-300 font-mono font-black text-xl p-2.5 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                    />
                  </div>

                  <div className="sm:col-span-5 space-y-1">
                    <label htmlFor="select-unit" className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                      ΜΟΝΑΔΑ ΒΑΣΗΣ
                    </label>
                    <select
                      id="select-unit"
                      value={selectedUnit}
                      onChange={(e) => setSelectedUnit(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 font-mono font-bold text-sm p-3 rounded-xl text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white cursor-pointer"
                    >
                      {units.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.short} ({u.name.split(' ')[0]})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Πίνακας Ισοδύναμων Μηκών */}
              <div className="space-y-2 py-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                  ΙΣΟΔΥΝΑΜΑ ΜΗΚΗ ΣΕ ΟΛΕΣ ΤΙΣ ΜΟΝΑΔΕΣ:
                </span>
                {units.map((u) => {
                  const isCurrent = u.id === selectedUnit;
                  return (
                    <div
                      key={u.id}
                      onClick={() => setSelectedUnit(u.id)}
                      className={`p-3 px-4 rounded-2xl border flex justify-between items-center cursor-pointer transition select-none ${
                        isCurrent
                          ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-sm'
                          : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono text-xs px-2 py-0.5 rounded-lg font-black ${
                            isCurrent ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {u.short}
                        </span>
                        <span className="text-xs sm:text-sm font-semibold">{u.name}</span>
                      </div>
                      <span className="font-mono font-black text-base sm:text-lg tabular-nums">
                        {convertValue(u)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-600 font-medium">
                💡 {currentUnit.desc}
              </div>
            </div>

            {/* Δεξιά Στήλη: SVG Οπτική Σκάλα Μετατροπών */}
            <div className="lg:col-span-6 2xl:col-span-6 bg-slate-50 p-6 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 flex flex-col items-center justify-between space-y-6">
              <div className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500 px-1">
                <span>ΟΠΤΙΚΗ ΣΚΑΛΑ ΜΕΤΑΤΡΟΠΩΝ</span>
                <span className="font-mono text-blue-600 font-bold">Επιλογή: {currentUnit.short}</span>
              </div>

              {/* SVG Canvas Σκάλας */}
              <div className="w-full max-w-[460px] aspect-[460/280] bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden my-auto">
                <svg
                  viewBox="0 0 460 280"
                  className="w-full h-full drop-shadow-sm"
                  shapeRendering="geometricPrecision"
                >
                  {[
                    { id: 4, short: 'km', x: 20, y: 55 },
                    { id: 3, short: 'm', x: 95, y: 100 },
                    { id: 2, short: 'dm', x: 170, y: 145 },
                    { id: 1, short: 'cm', x: 245, y: 190 },
                    { id: 0, short: 'mm', x: 320, y: 235 }
                  ].map((step, idx, arr) => {
                    const isSelected = step.id === selectedUnit;
                    const stepWidth = 72;

                    return (
                      <g key={step.id}>
                        {/* Οριζόντιο πάτημα σκάλας */}
                        <line
                          x1={step.x}
                          y1={step.y}
                          x2={step.x + stepWidth}
                          y2={step.y}
                          className="stroke-slate-400 stroke-[3.5]"
                        />

                        {/* Κάθετο σκαλοπάτι */}
                        {idx < arr.length - 1 && (
                          <line
                            x1={step.x + stepWidth}
                            y1={step.y}
                            x2={step.x + stepWidth}
                            y2={step.y + 45}
                            className="stroke-slate-400 stroke-[3.5]"
                          />
                        )}

                        {/* Επισημασμένο πλαίσιο σκαλοπατιού */}
                        {isSelected && (
                          <rect
                            x={step.x + 2}
                            y={step.y - 28}
                            width={stepWidth - 4}
                            height="26"
                            rx="7"
                            className="fill-blue-500/15 stroke-blue-600 stroke-[2]"
                          />
                        )}

                        {/* Κείμενο μονάδας */}
                        <text
                          x={step.x + stepWidth / 2}
                          y={step.y - 9}
                          textAnchor="middle"
                          className={`font-mono font-black ${
                            isSelected ? 'fill-blue-600 text-sm' : 'fill-slate-800 text-xs'
                          }`}
                        >
                          {step.short}
                        </text>

                        {/* Δείκτης επιλεγμένου */}
                        {isSelected && (
                          <circle
                            cx={step.x + stepWidth / 2}
                            cy={step.y - 36}
                            r="5"
                            className="fill-blue-600 animate-bounce"
                          />
                        )}
                      </g>
                    );
                  })}

                  {/* Βέλος Κατηφόρας: Πολλαπλασιασμός ( · ) */}
                  <g transform="translate(305, 45)">
                    <path
                      d="M 0 0 L 26 26 M 26 26 L 18 26 M 26 26 L 26 18"
                      fill="none"
                      className="stroke-blue-600 stroke-[2.5] stroke-linecap-round"
                    />
                    <text x="32" y="16" className="fill-blue-700 font-mono text-[11px] font-black">
                      Κατεβαίνω: · 10
                    </text>
                  </g>

                  {/* Βέλος Ανηφόρας: Διαίρεση ( ： ) */}
                  <g transform="translate(25, 195)">
                    <path
                      d="M 26 26 L 0 0 M 0 0 L 8 0 M 0 0 L 0 8"
                      fill="none"
                      className="stroke-rose-600 stroke-[2.5] stroke-linecap-round"
                    />
                    <text x="34" y="20" className="fill-rose-700 font-mono text-[11px] font-black">
                      Ανεβαίνω: ： 10
                    </text>
                  </g>
                </svg>
              </div>

              {/* Callout Συμπεράσματος */}
              <div className="w-full max-w-md p-3.5 bg-slate-100 rounded-2xl border border-slate-200 text-center font-mono text-xs sm:text-sm text-slate-700">
                🪜 Κάθε σκαλοπάτι προς τα κάτω πολλαπλασιάζει     ( · 10 ), εκτός από το άλμα km → m ( · 1.000 )!
              </div>
            </div>
          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στις Μονάδες Μήκους!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε απαιτητικές ασκήσεις μετατροπών, δεκαδικών υπολογισμών και προβλημάτων καθημερινής ζωής με αποστάσεις.
            </p>
          </div>

          <Link
            href="/e-dimotikou/21-monades-mikous-ask"
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
