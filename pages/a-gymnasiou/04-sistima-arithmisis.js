import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function SistimaArithmisisTheoria() {
  // State ως string για ακριβή έλεγχο πληκτρολόγησης
  const [decStr, setDecStr] = useState('42');

  // State για το διαδραστικό 8-bit register (0 ή 1 για κάθε θέση από 2^7 έως 2^0)
  const [bits, setBits] = useState([0, 0, 1, 0, 1, 0, 1, 0]); // Προεπιλογή: 42 (00101010)

  // Μετατροπή σε αριθμό για υπολογισμούς
  const decValue = useMemo(() => {
    if (!decStr || decStr.trim() === '') return 0;
    return parseInt(decStr, 10) || 0;
  }, [decStr]);

  // Input handler: μόνο 0-9, αυστηρό όριο 4 ψηφίων (0 - 9999).
  // Αν έχει ήδη 4 ψηφία και πληκτρολογηθεί κι άλλο, δεν γίνεται τίποτα.
  const handleInputChange = (e) => {
    const clean = e.target.value.replace(/[^0-9]/g, '');
    if (clean.length <= 4) {
      setDecStr(clean);
    }
  };

  // Stepper handler: αυξομείωση κατά 1
  const handleStep = (delta, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const next = decValue + delta;
    if (next >= 0 && next <= 9999) {
      setDecStr(next.toString());
    }
  };

  // Υπολογισμός τιμών σε Δυαδικό και Οκταδικό
  const binValue = useMemo(() => decValue.toString(2), [decValue]);
  const octValue = useMemo(() => decValue.toString(8), [decValue]);

  // Πολυωνυμική ανάλυση στο Δεκαδικό (π.χ. 4 · 10¹ + 2 · 10⁰)
  const decExpansion = useMemo(() => {
    const s = decValue.toString();
    const len = s.length;
    return s
      .split('')
      .map((d, i) => `${d} · 10<sup>${len - 1 - i}</sup>`)
      .join(' ＋ ');
  }, [decValue]);

  // Πολυωνυμική ανάλυση στο Δυαδικό
  const binExpansion = useMemo(() => {
    const s = binValue;
    const len = s.length;
    return s
      .split('')
      .map((d, i) => `${d} · 2<sup>${len - 1 - i}</sup>`)
      .join(' ＋ ');
  }, [binValue]);

  // Πολυωνυμική ανάλυση στο Οκταδικό
  const octExpansion = useMemo(() => {
    const s = octValue;
    const len = s.length;
    return s
      .split('')
      .map((d, i) => `${d} · 8<sup>${len - 1 - i}</sup>`)
      .join(' ＋ ');
  }, [octValue]);

  // Toggle ενός bit στο 8-bit register
  const toggleBit = (idx) => {
    setBits((prev) => {
      const next = [...prev];
      next[idx] = next[idx] === 1 ? 0 : 1;
      return next;
    });
  };

  // Υπολογισμός αξίας του 8-bit register
  const registerDecValue = useMemo(() => {
    return bits.reduce((acc, bit, idx) => acc + bit * Math.pow(2, 7 - idx), 0);
  }, [bits]);

  return (
    <Layout
      title="Συστήματα Αρίθμησης (Δεκαδικό, Δυαδικό, Οκταδικό) | Α' Γυμνασίου"
      description="Θεωρία, κανόνες θέσης και διαδραστικά εργαστήρια μετατροπής για το Δεκαδικό, το Δυαδικό και το Οκταδικό σύστημα αρίθμησης."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/04-sistima-arithmisis-ask"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-sm sm:text-base transition-all shadow-md"
        >
          <span>🎯</span>
          <span>ΑΣΚΗΣΕΙΣ</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-10 sm:space-y-16">
        {/* Banner Header - Ενιαίο Indigo Theme χωρίς τόνους στα κεφαλαία */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 lg:p-14 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              Α' ΓΥΜΝΑΣΙΟΥ • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Συστήματα Αρίθμησης
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              Ανακαλύπτουμε τη θεσιακή αξία των αριθμών, το Δεκαδικό σύστημα της καθημερινότητάς μας, το Δυαδικό σύστημα των υπολογιστών και το Οκταδικό σύστημα.
            </p>
          </div>
        </section>

        {/* 1. ΕΝΝΟΙΑ ΘΕΣΙΑΚΟΥ ΣΥΣΤΗΜΑΤΟΣ & ΔΕΚΑΔΙΚΟ ΣΥΣΤΗΜΑ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                1
              </span>
              Θεσιακά Συστήματα & Το Δεκαδικό Σύστημα (Βάση 10)
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed">
            <div className="space-y-4">
              <p>
                Στα <strong>θεσιακά συστήματα αρίθμησης</strong>, η αξία ενός ψηφίου εξαρτάται άμεσα από τη <strong>θέση</strong> στην οποία βρίσκεται μέσα στον αριθμό.
              </p>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 space-y-2">
                <div className="text-xs font-bold uppercase text-indigo-800 tracking-wider">
                  ΤΟ ΔΕΚΑΔΙΚΟ ΣΥΣΤΗΜΑ
                </div>
                <ul className="text-xs sm:text-sm space-y-1.5 text-slate-700">
                  <li>• <strong>Βάση:</strong> Το <strong>10</strong>.</li>
                  <li>• <strong>Ψηφία:</strong> 10 ψηφία: {'{'} 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 {'}'}.</li>
                  <li>• Κάθε θέση προς τα αριστερά έχει <strong>10 φορές</strong> μεγαλύτερη αξία (μονάδες, δεκάδες, εκατοντάδες, χιλιάδες).</li>
                </ul>
              </div>
            </div>

            <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold uppercase text-slate-500">
                ΠΑΡΑΔΕΙΓΜΑ ΑΝΑΠΤΥΓΜΑΤΟΣ ΣΕ ΔΥΝΑΜΕΙΣ ΤΟΥ 10
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                Ο αριθμός <strong>3.524</strong> αναλύεται ως άθροισμα γινομένων με δυνάμεις της βάσης 10:
              </p>
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 font-mono text-xs sm:text-sm text-slate-900 leading-loose">
                3.524 ＝ 3 · 10<sup>3</sup> ＋ 5 · 10<sup>2</sup> ＋ 2 · 10<sup>1</sup> ＋ 4 · 10<sup>0</sup><br />
                3.524 ＝ 3 · 1.000 ＋ 5 · 100 ＋ 2 · 10 ＋ 4 · 1
              </div>
            </div>
          </div>
        </section>

        {/* 2. ΔΥΑΔΙΚΟ ΚΑΙ ΟΚΤΑΔΙΚΟ ΣΥΣΤΗΜΑ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                2
              </span>
              Δυαδικό (Βάση 2) & Οκταδικό (Βάση 8) Σύστημα
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            {/* Δυαδικό Σύστημα */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-xs font-bold text-indigo-600 uppercase">
                  ΒΑΣΗ 2 • Η ΓΛΩΣΣΑ ΤΩΝ ΥΠΟΛΟΓΙΣΤΩΝ
                </div>
                <h3 className="font-bold text-slate-900 text-base sm:text-xl">
                  Το Δυαδικό Σύστημα (Binary)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Χρησιμοποιεί μόνο <strong>δύο ψηφία</strong>: το <strong>0</strong> και το <strong>1</strong> (bits). Κάθε θέση αντιστοιχεί σε διαδοχική δύναμη του 2 (1, 2, 4, 8, 16, 32, 64, 128...).
                </p>
                <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-xs sm:text-sm text-indigo-950">
                  1101<sub>(2)</sub> ＝ 1 · 2<sup>3</sup> ＋ 1 · 2<sup>2</sup> ＋ 0 · 2<sup>1</sup> ＋ 1 · 2<sup>0</sup><br />
                  1101<sub>(2)</sub> ＝ 8 ＋ 4 ＋ 0 ＋ 1 ＝ <strong>13<sub>(10)</sub></strong>
                </div>
              </div>
            </div>

            {/* Οκταδικό Σύστημα */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-xs font-bold text-indigo-600 uppercase">
                  ΒΑΣΗ 8 • ΣΥΝΤΟΜΟΓΡΑΦΙΑ ΔΥΑΔΙΚΩΝ
                </div>
                <h3 className="font-bold text-slate-900 text-base sm:text-xl">
                  Το Οκταδικό Σύστημα (Octal)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Χρησιμοποιεί <strong>οκτώ ψηφία</strong>: {'{'} 0, 1, 2, 3, 4, 5, 6, 7 {'}'}. Κάθε θέση αντιστοιχεί σε διαδοχική δύναμη του 8 (8⁰ ＝ 1, 8¹ ＝ 8, 8² ＝ 64, 8³ ＝ 512...).
                </p>
                <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-xs sm:text-sm text-indigo-950">
                  35<sub>(8)</sub> ＝ 3 · 8<sup>1</sup> ＋ 5 · 8<sup>0</sup><br />
                  35<sub>(8)</sub> ＝ 3 · 8 ＋ 5 · 1 ＝ 24 ＋ 5 ＝ <strong>29<sub>(10)</sub></strong>
                </div>
              </div>
            </div>
          </div>

          {/* Συγκριτικός Πίνακας Πρώτων Αριθμών */}
          <div className="space-y-3">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Πίνακας Αντιστοιχίας Πρώτων Αριθμών
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs sm:text-sm border-collapse bg-white rounded-xl overflow-hidden border border-slate-200">
                <thead className="bg-indigo-900 text-white font-bold">
                  <tr>
                    <th className="py-2.5 px-3 border border-indigo-800">Δεκαδικό (Βάση 10)</th>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                      <th key={n} className="py-2.5 px-2 border border-indigo-800">{n}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono text-slate-800">
                  <tr className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-sans font-bold text-indigo-900 border">Δυαδικό (Βάση 2)</td>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                      <td key={n} className="py-2 px-2 border">{n.toString(2)}</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-sans font-bold text-indigo-900 border">Οκταδικό (Βάση 8)</td>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                      <td key={n} className="py-2 px-2 border">{n.toString(8)}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΜΕΤΑΤΡΟΠΕΑΣ & ΠΟΛΥΩΝΥΜΙΚΗ ΑΝΑΛΥΣΗ */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                3
              </span>
              Διαδραστικός Μετατροπέας & Πολυωνυμική Ανάλυση
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Επιλογή / Πληκτρολόγηση Αριθμού */}
            <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-600 uppercase">
                Δεκαδικός Αριθμός (0 έως 9999)
              </label>
              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  type="button"
                  onClick={(e) => handleStep(-1, e)}
                  className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                >
                  －
                </button>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  value={decStr}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="h-full w-full bg-white rounded-xl border border-slate-300 text-slate-900 font-black text-center text-lg font-mono focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                />
                <button
                  type="button"
                  onClick={(e) => handleStep(1, e)}
                  className="w-full h-full flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg hover:bg-slate-100 active:scale-95 touch-manipulation transition shadow-sm"
                >
                  ＋
                </button>
              </div>

              {/* Γρήγορα κουμπιά επιλογής */}
              <div className="pt-2">
                <div className="text-[11px] font-bold text-slate-500 uppercase mb-2">Γρηγορα παραδειγματα</div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[7, 13, 42, 64, 127, 255].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setDecStr(val.toString())}
                      className="py-1 px-2 rounded-lg bg-white border border-slate-200 text-xs font-mono font-bold text-slate-700 hover:bg-indigo-50 hover:border-indigo-300 transition"
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Παρουσίαση στις 3 Βάσεις */}
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-center">
                  <div className="text-[11px] font-bold uppercase text-indigo-700">Δεκαδικο (Βαση 10)</div>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-indigo-950 mt-1">{decValue}</div>
                </div>

                <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 text-center">
                  <div className="text-[11px] font-bold uppercase text-sky-700">Δυαδικο (Βαση 2)</div>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-sky-950 mt-1 break-words">{binValue}</div>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 text-center">
                  <div className="text-[11px] font-bold uppercase text-purple-700">Οκταδικο (Βαση 8)</div>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-purple-950 mt-1">{octValue}</div>
                </div>
              </div>

              {/* Αναλυτικά Πολυώνυμα */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs sm:text-sm">
                <div className="text-xs font-bold uppercase text-slate-500">
                  ΠΟΛΥΩΝΥΜΙΚΕΣ ΑΝΑΛΥΣΕΙΣ ΣΤΙΣ ΑΝΤΙΣΤΟΙΧΕΣ ΒΑΣΕΙΣ
                </div>
                <div className="space-y-2 font-mono text-slate-800">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="font-bold text-indigo-900 block sm:inline mr-2">Βάση 10:</span>
                    <span dangerouslySetInnerHTML={{ __html: decExpansion }} />
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="font-bold text-sky-900 block sm:inline mr-2">Βάση 2:</span>
                    <span className="break-words" dangerouslySetInnerHTML={{ __html: binExpansion }} />
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="font-bold text-purple-900 block sm:inline mr-2">Βάση 8:</span>
                    <span dangerouslySetInnerHTML={{ __html: octExpansion }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: 8-BIT INTERACTIVE REGISTER */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg">
                4
              </span>
              Διαδραστικό Εργαστήριο: 8-bit Byte Register (Κατασκευή Δυαδικού)
            </h2>
          </div>

          <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
            Πάτησε πάνω σε κάθε bit για να το ενεργοποιήσεις (1) ή να το απενεργοποιήσεις (0) και παρακολούθησε ζωντανά πώς προστίθεται η θεσιακή του αξία:
          </p>

          <div className="bg-slate-900 p-5 sm:p-8 rounded-3xl text-white space-y-6">
            {/* 8 Bits Buttons Grid - Responsive χωρίς scroll */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-3">
              {bits.map((bit, idx) => {
                const power = 7 - idx;
                const weight = Math.pow(2, power);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleBit(idx)}
                    className={`flex flex-col items-center justify-center p-2.5 sm:p-3.5 rounded-2xl border transition-all active:scale-95 touch-manipulation ${
                      bit === 1
                        ? 'bg-sky-500 border-sky-300 text-slate-950 shadow-lg shadow-sky-500/30'
                        : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    <span className="text-[10px] sm:text-xs font-bold font-mono opacity-80">
                      2<sup>{power}</sup>
                    </span>
                    <span className="text-xl sm:text-3xl font-black font-mono my-1">
                      {bit}
                    </span>
                    <span className="text-[10px] sm:text-xs font-bold font-mono">
                      +{bit === 1 ? weight : 0}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Αποτέλεσμα Καταχωρητή */}
            <div className="p-4 sm:p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <div className="text-xs uppercase tracking-wider text-sky-300 font-bold">
                  ΣΧΗΜΑΤΙΣΜΕΝΟΣ ΔΥΑΔΙΚΟΣ ΑΡΙΘΜΟΣ
                </div>
                <div className="text-2xl sm:text-3xl font-black font-mono mt-0.5 text-white">
                  {bits.join('')}<sub>(2)</sub>
                </div>
              </div>

              <div className="text-center sm:text-right">
                <div className="text-xs uppercase tracking-wider text-amber-300 font-bold">
                  ΔΕΚΑΔΙΚΗ ΑΞΙΑ (SUM)
                </div>
                <div className="text-3xl sm:text-4xl font-black font-mono text-amber-400 mt-0.5">
                  {registerDecValue}<sub>(10)</sub>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
