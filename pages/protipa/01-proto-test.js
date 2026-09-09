import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { LAYOUT } from '../../shared/layout-config';

const Fraction = ({ num, den }) => (
  <span className="inline-flex flex-col items-center justify-center align-middle mx-1 text-center leading-none text-[0.9em]">
    <span className="border-b border-current px-1 pb-[1px] block w-full text-center">
      {num}
    </span>
    <span className="pt-[1px] block w-full text-center">
      {den}
    </span>
  </span>
);

const QUESTIONS = [
  {
    id: 1,
    group: 'ΟΜΑΔΑ Α (4 επιλογες)',
    prompt: 'Ποια είναι η τιμή της παρακάτω αριθμητικής παράστασης;\n(13 : 2 − 2³ : 2) : 0,25 − 1⁵',
    options: ['9', '4', '1,5', '10'],
    correct: '9',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Εφαρμόζουμε την <strong>προτεραιότητα των πράξεων</strong> (δυνάμεις ➔ πράξεις εντός παρενθέσεων ➔ πολλαπλασιασμοί/διαιρέσεις ➔ προσθέσεις/αφαιρέσεις):
        </p>

        {/* 1ος ΤΡΟΠΟΣ: ΜΕ ΔΕΚΑΔΙΚΟΥΣ ΑΡΙΘΜΟΥΣ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-2.5">
          <div className="font-sans font-bold text-blue-900 text-sm border-b border-slate-200 pb-1">
            🔷 1ος Τρόπος (Βήμα προς βήμα με δεκαδικούς αριθμούς)
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>
              • <strong>Υπολογισμός δυνάμεων:</strong>
              <div className="pl-3 pt-0.5 text-slate-700">
                2³ ＝ 2 · 2 · 2 ＝ <strong>8</strong> &nbsp;και&nbsp; 1⁵ ＝ <strong>1</strong>
              </div>
            </div>

            <div className="pt-1 border-t border-slate-200">
              • <strong>Πράξεις μέσα στην παρένθεση:</strong>
              <div className="pl-3 pt-0.5 space-y-1 text-slate-800">
                <div>13 : 2 ＝ <strong>6,5</strong></div>
                <div>2³ : 2 ＝ 8 : 2 ＝ <strong>4</strong></div>
                <div>(13 : 2 － 2³ : 2) ＝ 6,5 － 4 ＝ <strong>2,5</strong></div>
              </div>
            </div>

            <div className="pt-1 border-t border-slate-200">
              • <strong>Διαίρεση με το 0,25 και τελική αφαίρεση:</strong>
              <div className="pl-3 pt-0.5 space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span>2,5 : 0,25 ＝ 2,5 · 4 ＝ <strong>10</strong></span>
                  <span className="text-slate-500 font-sans text-xs">(αφού η διαίρεση με το 0,25 ισοδυναμεί με τετραπλασιασμό)</span>
                </div>
                <div className="pt-0.5 text-emerald-700 font-bold text-base">
                  10 － 1⁵ ＝ 10 － 1 ＝ 9
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2ος ΤΡΟΠΟΣ: ΜΕ ΚΛΑΣΜΑΤΑ */}
        <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200/80 space-y-2">
          <div className="font-sans font-bold text-emerald-950 text-sm border-b border-emerald-200 pb-1">
            💡 2ος Τρόπος (Υπολογισμός με κλάσματα)
          </div>

          <p className="text-slate-800">
            Γράφουμε όλους τους όρους σε μορφή κλασμάτων:
          </p>

          <div className="bg-white/90 p-3 rounded-xl border border-emerald-200 font-mono text-slate-900 space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Παρένθεση:</span>
              <Fraction num="13" den="2" />
              <span>－</span>
              <Fraction num="8" den="2" />
              <span>＝</span>
              <Fraction num="13 － 8" den="2" />
              <span>＝</span>
              <strong className="text-blue-700"><Fraction num="5" den="2" /></strong>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-100">
              <span>• Παρατηρούμε ότι: 0,25 ＝</span>
              <Fraction num="1" den="4" />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-100">
              <span>• Διαίρεση:</span>
              <Fraction num="5" den="2" />
              <span>:</span>
              <Fraction num="1" den="4" />
              <span>＝</span>
              <Fraction num="5" den="2" />
              <span>· 4 ＝</span>
              <Fraction num="20" den="2" />
              <span>＝ <strong>10</strong></span>
            </div>

            <div className="pt-1 border-t border-slate-100 flex items-center gap-2 flex-wrap">
              <span>• Τελικό αποτέλεσμα: 10 － 1 ＝</span>
              <strong className="text-emerald-700 text-base">9</strong>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, η τιμή της αριθμητικής παράστασης είναι <strong>9</strong>.
        </p>
      </div>
    )
  },
  {
    id: 2,
    group: 'ΟΜΑΔΑ Α (4 επιλογες)',
    prompt: 'Ποιος είναι ο μικρότερος τετραψήφιος φυσικός αριθμός ο οποίος διαιρείται ταυτόχρονα με το 3, το 4 και το 5;',
    options: ['1.000', '1.020', '1.050', '1.080'],
    correct: '1.020',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Για να διαιρείται ένας αριθμός ταυτόχρονα με το <strong>3</strong>, το <strong>4</strong> και το <strong>5</strong>, πρέπει να είναι κοινό πολλαπλάσιο των τριών αυτών αριθμών, δηλαδή πολλαπλάσιο του <strong>Ε.Κ.Π.(3, 4, 5)</strong>.
        </p>

        {/* SVG ΣΧΗΜΑ: ΑΡΙΘΜΟΓΡΑΜΜΗ ΠΟΛΛΑΠΛΑΣΙΩΝ ΤΟΥ 60 ΓΥΡΩ ΑΠΟ ΤΟ 1.000 */}
        <div className="bg-white/90 p-3.5 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="470" height="150" viewBox="0 0 470 150" className="select-none font-sans mx-auto block">
            <defs>
              <marker id="axis-arr-2" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 2 L 8 5 L 0 8 z" fill="#334155" />
              </marker>
            </defs>

            {/* Άξονας αριθμογραμμής */}
            <line x1="25" y1="75" x2="445" y2="75" stroke="#334155" strokeWidth="2" markerEnd="url(#axis-arr-2)" />

            {/* Όριο 3ψήφιων / 4ψήφιων (1.000) */}
            <line x1="190" y1="35" x2="190" y2="105" stroke="#dc2626" strokeWidth="2" strokeDasharray="4 3" />
            <circle cx="190" cy="75" r="4.5" fill="#dc2626" />
            <text x="190" y="25" fontSize="10.5" fontWeight="900" textAnchor="middle" fill="#dc2626">
              1.000 (Όριο 4ψήφιων)
            </text>

            {/* Περιοχή 3ψήφιων & 4ψήφιων */}
            <text x="100" y="132" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#64748b">
              ◀ 3ψήφιοι αριθμοί
            </text>
            <text x="310" y="132" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#15803d">
              4ψήφιοι αριθμοί ▶
            </text>

            {/* 16ο πολλαπλάσιο: 960 */}
            <line x1="85" y1="65" x2="85" y2="85" stroke="#64748b" strokeWidth="2" />
            <circle cx="85" cy="75" r="4.5" fill="#64748b" />
            <text x="85" y="55" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#475569">
              960
            </text>
            <text x="85" y="100" fontSize="9.5" textAnchor="middle" fill="#64748b" fontFamily="monospace">
              60 · 16
            </text>

            {/* Βήμα +60 (Τόξο από 960 σε 1.020) */}
            <path d="M 85 62 Q 185 30 285 62" fill="none" stroke="#0284c7" strokeWidth="1.8" strokeDasharray="3 2" />
            <text x="185" y="44" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#0369a1">
              + 60
            </text>

            {/* 17ο πολλαπλάσιο: 1.020 (Ζητούμενο) */}
            <line x1="285" y1="60" x2="285" y2="90" stroke="#16a34a" strokeWidth="2.5" />
            <circle cx="285" cy="75" r="6" fill="#16a34a" stroke="#14532d" strokeWidth="1.5" />
            <text x="285" y="52" fontSize="13" fontWeight="900" textAnchor="middle" fill="#15803d">
              1.020 ⭐
            </text>
            <text x="285" y="102" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#166534" fontFamily="monospace">
              60 · 17
            </text>
            <text x="285" y="117" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#15803d">
              (1ος 4ψήφιος)
            </text>

            {/* 18ο πολλαπλάσιο: 1.080 */}
            <line x1="390" y1="65" x2="390" y2="85" stroke="#94a3b8" strokeWidth="1.8" />
            <circle cx="390" cy="75" r="4.5" fill="#94a3b8" />
            <text x="390" y="55" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#64748b">
              1.080
            </text>
            <text x="390" y="100" fontSize="9.5" textAnchor="middle" fill="#94a3b8" fontFamily="monospace">
              60 · 18
            </text>
          </svg>
        </div>

        {/* ΑΝΑΛΥΤΙΚΑ ΒΗΜΑΤΑ ΕΠΙΛΥΣΗΣ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-3">
          {/* Βήμα 1: Ε.Κ.Π. */}
          <div className="space-y-1">
            <div className="font-sans font-bold text-slate-900">
              1. Υπολογισμός του Ελάχιστου Κοινού Πολλαπλασίου (Ε.Κ.Π.):
            </div>
            <p className="text-slate-700">
              Οι αριθμοί 3, 4 και 5 είναι πρώτοι μεταξύ τους ανά δύο, επομένως:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 font-bold">
              Ε.Κ.Π.(3, 4, 5) ＝ 3 · 4 · 5 ＝ 60
            </div>
            <p className="text-slate-600 font-sans text-xs pt-0.5">
              Άρα, κάθε αριθμός που διαιρείται ταυτόχρονα με το 3, 4 και 5 είναι πολλαπλάσιο του 60.
            </p>
          </div>

          {/* Βήμα 2: Εύρεση του 1ου 4ψήφιου πολλαπλασίου */}
          <div className="space-y-1 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-slate-900">
              2. Εύρεση του μικρότερου 4ψήφιου αριθμού (≥ 1.000):
            </div>
            <p className="text-slate-700">
              Ο μικρότερος τετραψήφιος φυσικός αριθμός είναι το <strong>1.000</strong>. Εκτελούμε την ευκλείδεια διαίρεση:
            </p>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>1.000 : 60 ＝ <strong>16</strong> με <strong>υπόλοιπο 40</strong></span>
              </div>
              <div className="text-slate-600 font-sans text-xs">
                Δηλαδή: 1.000 ＝ 60 · 16 ＋ 40 ➔ 60 · 16 ＝ <strong>960</strong> (ο μεγαλύτερος 3ψήφιος).
              </div>
              <div className="pt-1 border-t border-slate-200 text-slate-800">
                Το αμέσως επόμενο πολλαπλάσιο του 60 είναι το 17ο:
              </div>
              <div className="font-bold text-base text-emerald-700">
                60 · 17 ＝ 1.020
              </div>
              <div className="text-slate-500 font-sans text-xs">
                (ή ισοδύναμα: 1.000 ＋ (60 － 40) ＝ 1.000 ＋ 20 ＝ 1.020)
              </div>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, ο μικρότερος τετραψήφιος αριθμός που διαιρείται ταυτόχρονα με το 3, το 4 και το 5 είναι το <strong>1.020</strong>.
        </p>
      </div>
    )
  },
  {
    id: 3,
    group: 'ΟΜΑΔΑ Α (4 επιλογες)',
    prompt: 'Ένα δοχείο είναι γεμάτο με λάδι κατά τα 7/10 του συνολικού του όγκου. Αδειάζουμε 3 ίδια φλιτζάνια λάδι από το δοχείο και πλέον είναι γεμάτο κατά το 1/10. Με πόσα τέτοια φλιτζάνια λάδι γεμίζει ολόκληρο το δοχείο αν είναι τελείως άδειο;',
    options: ['5', '6', '8', '10'],
    correct: '5',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Αναλύουμε τη μεταβολή της ποσότητας του λαδιού στο δοχείο, χρησιμοποιώντας ως μονάδα μέτρησης τα <strong>δέκατα (<Fraction num="1" den="10" />)</strong> του συνολικού όγκου:
        </p>

        {/* SVG ΣΧΗΜΑ ΔΟΧΕΙΟΥ ΣΕ 3 ΣΤΑΔΙΑ */}
        <div className="flex justify-center p-3 bg-white/90 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="560" height="225" viewBox="0 0 560 225" className="select-none font-sans mx-auto block">
            {/* Ορισμός τμημάτων */}
            <defs>
              <g id="tank-slice-empty-3">
                <rect x="0" y="0" width="75" height="28" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="0" y1="14" x2="75" y2="14" stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="2 2" />
              </g>
              <g id="tank-slice-full-3">
                <rect x="0" y="0" width="75" height="28" fill="#fbbf24" fillOpacity="0.85" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="0" y1="14" x2="75" y2="14" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="2 2" />
                <text x="37.5" y="10.5" fontSize="8.5" fontWeight="bold" textAnchor="middle" fill="#92400e" fontFamily="monospace">1/10</text>
                <text x="37.5" y="24.5" fontSize="8.5" fontWeight="bold" textAnchor="middle" fill="#92400e" fontFamily="monospace">1/10</text>
              </g>
            </defs>

            {/* 1. ΣΤΑΔΙΟ A: ΑΡΧΙΚΟ (7/10) */}
            <g transform="translate(15, 10)">
              <text x="37.5" y="14" fontSize="11.5" fontWeight="bold" textAnchor="middle" fill="#0f172a">
                Αρχικό (7/10)
              </text>
              <g transform="translate(0, 25)">
                <use href="#tank-slice-empty-3" x="0" y="0" />
                <rect x="0" y="28" width="75" height="14" fill="#fbbf24" fillOpacity="0.45" stroke="#cbd5e1" strokeWidth="1" />
                <text x="37.5" y="38.5" fontSize="8.5" fontWeight="bold" textAnchor="middle" fill="#92400e" fontFamily="monospace">1/10</text>
                <rect x="0" y="42" width="75" height="14" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
                <use href="#tank-slice-full-3" x="0" y="56" />
                <use href="#tank-slice-full-3" x="0" y="84" />
                <use href="#tank-slice-full-3" x="0" y="112" />
                {/* Εξωτερικό περίγραμμα */}
                <rect x="0" y="0" width="75" height="140" rx="4" fill="none" stroke="#334155" strokeWidth="2.2" />
              </g>
            </g>

            {/* ΒΕΛΟΣ ΑΦΑΙΡΕΣΗΣ 3 ΦΛΙΤΖΑΝΙΩΝ (ΜΕ ΑΝΕΣΗ ΧΩΡΟΥ: 70px) */}
            <g transform="translate(95, 95)">
              <line x1="6" y1="0" x2="60" y2="0" stroke="#dc2626" strokeWidth="2.2" />
              <polygon points="60,-4 68,0 60,4" fill="#dc2626" />
              <text x="34" y="-9" fontSize="10.5" fontWeight="black" textAnchor="middle" fill="#dc2626">
                －3 Φλιτζάνια
              </text>
            </g>

            {/* 2. ΣΤΑΔΙΟ Β: ΤΕΛΙΚΟ (1/10) */}
            <g transform="translate(175, 10)">
              <text x="37.5" y="14" fontSize="11.5" fontWeight="bold" textAnchor="middle" fill="#0f172a">
                Τελικό (1/10)
              </text>
              <g transform="translate(0, 25)">
                <use href="#tank-slice-empty-3" x="0" y="0" />
                <use href="#tank-slice-empty-3" x="0" y="28" />
                <use href="#tank-slice-empty-3" x="0" y="56" />
                <use href="#tank-slice-empty-3" x="0" y="84" />
                {/* Κάτω τμήμα (1/10 γεμάτο) */}
                <rect x="0" y="112" width="75" height="28" rx="1" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="0" y1="126" x2="75" y2="126" stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="2 2" />
                <rect x="0" y="126" width="75" height="14" fill="#fbbf24" fillOpacity="0.85" rx="1" stroke="#cbd5e1" strokeWidth="1" />
                <text x="37.5" y="136.5" fontSize="8.5" fontWeight="bold" textAnchor="middle" fill="#92400e" fontFamily="monospace">1/10</text>

                <rect x="0" y="0" width="75" height="140" rx="4" fill="none" stroke="#334155" strokeWidth="2.2" />
              </g>
            </g>

            {/* ΒΕΛΟΣ ΕΡΩΤΗΣΗΣ (ΜΕ ΑΝΕΣΗ ΧΩΡΟΥ: 75px) */}
            <g transform="translate(255, 95)">
              <line x1="8" y1="0" x2="62" y2="0" stroke="#0284c7" strokeWidth="2" strokeDasharray="3 2" />
              <polygon points="62,-3.5 70,0 62,3.5" fill="#0284c7" />
              <text x="36" y="-9" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#0284c7">
                Πόσα Φλιτζάνια;
              </text>
            </g>

            {/* 3. ΣΤΑΔΙΟ Γ: ΟΛΟΚΛΗΡΟ (10/10) */}
            <g transform="translate(335, 10)">
              <text x="37.5" y="14" fontSize="11.5" fontWeight="bold" textAnchor="middle" fill="#0f172a">
                Ολόκληρο (10/10)
              </text>
              <g transform="translate(0, 25)">
                <use href="#tank-slice-full-3" x="0" y="0" />
                <use href="#tank-slice-full-3" x="0" y="28" />
                <use href="#tank-slice-full-3" x="0" y="56" />
                <use href="#tank-slice-full-3" x="0" y="84" />
                <use href="#tank-slice-full-3" x="0" y="112" />
                <rect x="0" y="0" width="75" height="140" rx="4" fill="none" stroke="#334155" strokeWidth="2.2" />
              </g>

              {/* Ετικέτες Φλιτζανιών ανά 2/10 */}
              <g transform="translate(83, 25)">
                {[0, 1, 2, 3, 4].map((i) => (
                  <text key={i} x="0" y={i * 28 + 18.5} fontSize="11" fontWeight="bold" fill="#15803d">
                    ＝ 1 Φλιτζάνι
                  </text>
                ))}
              </g>

              {/* Πράσινο badge συνόλου (πλήρως ορατό) */}
              <g transform="translate(80, 172)">
                <rect x="0" y="0" width="125" height="26" rx="13" fill="#16a34a" />
                <text x="62.5" y="17" fontSize="11.5" fontWeight="black" textAnchor="middle" fill="#ffffff">
                  Σύνολο: 5 Φλιτζάνια
                </text>
              </g>
            </g>
          </svg>
        </div>

        {/* ΑΝΑΛΥΤΙΚΟΣ ΣΥΛΛΟΓΙΣΜΟΣ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-3">
          {/* Βήμα 1 */}
          <div className="space-y-1">
            <div className="font-sans font-bold text-slate-900 border-b border-slate-200 pb-1">
              1. Υπολογισμός της διαφοράς στον όγκο του λαδιού:
            </div>
            <p className="text-slate-700">
              Αρχικά το δοχείο ήταν γεμάτο κατά <span className="font-mono font-bold"><Fraction num="7" den="10" /></span> και τελικά κατά <span className="font-mono font-bold"><Fraction num="1" den="10" /></span>. Η διαφορά που αδειάσαμε αντιστοιχεί στα 3 φλιτζάνια:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>3 Φλιτζάνια ＝ Αρχικό Λάδι － Τελικό Λάδι ＝</span>
                <Fraction num="7" den="10" />
                <span>－</span>
                <Fraction num="1" den="10" />
                <span>＝</span>
                <strong className="text-blue-700"><Fraction num="6" den="10" /></strong>
              </div>
            </div>
          </div>

          {/* Βήμα 2 */}
          <div className="space-y-1 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-slate-900 border-b border-slate-200 pb-1">
              2. Εύρεση της χωρητικότητας ενός φλιτζανιού:
            </div>
            <p className="text-slate-700">
              Αφού τα 3 φλιτζάνια αντιστοιχούν στα <Fraction num="6" den="10" /> του δοχείου, το 1 φλιτζάνι αντιστοιχεί στο:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>1 Φλιτζάνι ＝ 3 Φλιτζάνια : 3 ＝</span>
                <Fraction num="6" den="10" />
                <span>: 3 ＝</span>
                <strong className="text-emerald-700 text-base"><Fraction num="2" den="10" /></strong>
                <span>＝</span>
                <strong className="text-emerald-700 text-base"><Fraction num="1" den="5" /></strong>
                <span>του δοχείου.</span>
              </div>
            </div>
          </div>

          {/* Βήμα 3 */}
          <div className="space-y-1 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-slate-900 border-b border-slate-200 pb-1">
              3. Συμπέρασμα για το συνολικό πλήθος φλιτζανιών:
            </div>
            <p className="text-slate-700">
              Για να γεμίσει ολόκληρο το δοχείο (δηλαδή <Fraction num="5" den="5" /> ή <Fraction num="10" den="10" />), χρειαζόμαστε τόσα φλιτζάνια όσα είναι και τα πέμπτα:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>Συνολικά Φλιτζάνια ＝ Ολόκληρο Δοχείο : 1 Φλιτζάνι ＝</span>
                <Fraction num="5" den="5" />
                <span>:</span>
                <Fraction num="1" den="5" />
                <span>＝</span>
                <strong className="text-emerald-700 text-base">5</strong>
              </div>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, για να γεμίσει ολόκληρο το δοχείο χρειάζονται <strong>5 φλιτζάνια</strong>.
        </p>
      </div>
    )
  },
  {
    id: 4,
    group: 'ΟΜΑΔΑ Α (4 επιλογες)',
    prompt: 'Ένα ζευγάρι παπούτσια κόστιζε αρχικά 80€. Στις εκπτώσεις αγοράστηκε στην τιμή των 56€. Ποιο ήταν το ποσοστό (%) της έκπτωσης που έγινε στην αρχική τιμή;',
    options: ['24%', '30%', '40%', '70%'],
    correct: '30%',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Υπολογίζουμε πρώτα το <strong>ποσό της έκπτωσης σε ευρώ</strong> και στη συνέχεια βρίσκουμε τι μέρος (ποσοστό) της <strong>αρχικής τιμής</strong> αποτελεί:
        </p>

        {/* SVG ΣΧΗΜΑ: ΟΠΤΙΚΟΠΟΙΗΣΗ ΤΗΣ ΑΡΧΙΚΗΣ ΤΙΜΗΣ ΣΕ 10 ΙΣΑ ΜΕΡΗ (ΤΩΝ 8€) */}
        <div className="bg-white/90 p-3.5 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="490" height="175" viewBox="0 0 490 175" className="select-none font-sans mx-auto block">
            {/* ΕΠΙΚΕΦΑΛΙΔΑ ΣΥΝΟΛΙΚΗΣ ΑΡΧΙΚΗΣ ΤΙΜΗΣ */}
            <g transform="translate(20, 10)">
              <rect x="0" y="0" width="450" height="24" rx="12" fill="#0f172a" />
              <text x="225" y="16" fontSize="11.5" fontWeight="bold" textAnchor="middle" fill="#ffffff">
                Αρχική Τιμή: 80€ (10 ίσα τμήματα των 8€ το καθένα)
              </text>
            </g>

            {/* ΜΠΑΡΑ ΔΙΑΙΡΕΣΗΣ ΣΕ 10 ΙΣΑ ΤΜΗΜΑΤΑ (45px το καθένα) */}
            <g transform="translate(20, 46)">
              {/* 7 τμήματα πληρωμής (56€) */}
              {Array.from({ length: 7 }).map((_, idx) => (
                <g key={`paid-${idx}`} transform={`translate(${idx * 45}, 0)`}>
                  <rect x="0" y="0" width="43" height="42" rx="6" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.6" />
                  <text x="21.5" y="25" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#1d4ed8" fontFamily="monospace">8€</text>
                </g>
              ))}

              {/* 3 τμήματα έκπτωσης (24€) */}
              {Array.from({ length: 3 }).map((_, idx) => (
                <g key={`disc-${idx}`} transform={`translate(${(idx + 7) * 45}, 0)`}>
                  <rect x="0" y="0" width="43" height="42" rx="6" fill="#fef2f2" stroke="#ef4444" strokeWidth="1.8" strokeDasharray="3 2" />
                  <text x="21.5" y="25" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#dc2626" fontFamily="monospace">8€</text>
                </g>
              ))}
            </g>

            {/* ΚΑΤΩ ΕΠΕΞΗΓΗΜΑΤΙΚΕΣ ΕΤΙΚΕΤΕΣ */}
            <g transform="translate(20, 100)">
              {/* Τελική τιμή (56€) */}
              <g transform="translate(0, 0)">
                <path d="M 0 5 L 0 0 L 313 0 L 313 5" fill="none" stroke="#2563eb" strokeWidth="1.8" />
                <rect x="46" y="10" width="220" height="26" rx="8" fill="#dbeafe" stroke="#bfdbfe" strokeWidth="1" />
                <text x="156" y="27" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#1e40af">
                  Τιμή με έκπτωση: 56€ (70%)
                </text>
              </g>

              {/* Έκπτωση (24€) */}
              <g transform="translate(315, 0)">
                <path d="M 0 5 L 0 0 L 135 0 L 135 5" fill="none" stroke="#dc2626" strokeWidth="1.8" />
                <rect x="2" y="10" width="131" height="26" rx="8" fill="#fee2e2" stroke="#fca5a5" strokeWidth="1" />
                <text x="67.5" y="27" fontSize="11" fontWeight="black" textAnchor="middle" fill="#b91c1c">
                  Έκπτωση: 24€ (30%)
                </text>
              </g>
            </g>

            {/* ΣΥΜΠΕΡΑΣΜΑ ΠΟΣΟΣΤΟΥ */}
            <g transform="translate(20, 146)">
              <text x="225" y="14" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#047857">
                3 από τα 10 μέρη είναι έκπτωση ➔ 3/10 ＝ 30%
              </text>
            </g>
          </svg>
        </div>

        {/* ΑΝΑΛΥΤΙΚΑ ΒΗΜΑΤΑ ΕΠΙΛΥΣΗΣ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-3">
          {/* Βήμα 1: Ποσό έκπτωσης σε ευρώ */}
          <div className="space-y-1">
            <div className="font-sans font-bold text-slate-900">
              1. Υπολογισμός του ποσού της έκπτωσης:
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
              <div>Ποσό Έκπτωσης ＝ Αρχική Τιμή － Τιμή Πώλησης</div>
              <div className="pt-0.5">
                Ποσό Έκπτωσης ＝ 80 － 56 ＝ <strong className="text-rose-700 font-bold">24€</strong>
              </div>
            </div>
          </div>

          {/* Βήμα 2: Ποσοστό επί της αρχικής τιμής */}
          <div className="space-y-1 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-slate-900">
              2. Υπολογισμός του ποσοστού έκπτωσης:
            </div>
            <p className="text-slate-700">
              Συγκρίνουμε το ποσό της έκπτωσης (24€) με την <strong>αρχική τιμή</strong> (80€):
            </p>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span>• Κλάσμα έκπτωσης ＝</span>
                <Fraction num="Ποσό Έκπτωσης" den="Αρχική Τιμή" />
                <span>＝</span>
                <Fraction num="24" den="80" />
              </div>

              <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-slate-200">
                <span>• Απλοποιούμε διαιρώντας με το 8:</span>
                <Fraction num="24 : 8" den="80 : 8" />
                <span>＝</span>
                <strong className="text-blue-700 font-bold"><Fraction num="3" den="10" /></strong>
              </div>

              <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-slate-200">
                <span>• Μετατροπή σε ποσοστό στα 100:</span>
                <Fraction num="3" den="10" />
                <span>＝</span>
                <Fraction num="30" den="100" />
                <span>＝</span>
                <strong className="text-emerald-700 text-base font-black">30%</strong>
              </div>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, το ποσοστό της έκπτωσης στην αρχική τιμή ήταν <strong>30%</strong>.
        </p>
      </div>
    )
  },
  {
    id: 5,
    group: 'ΟΜΑΔΑ Α (4 επιλογες)',
    prompt: 'Το τριπλάσιο ενός άγνωστου αριθμού x, αυξημένο κατά το 1/3 του ίδιου αριθμού, ισούται με 20. Ποια από τις παρακάτω εξισώσεις περιγράφει σωστά το πρόβλημα;',
    options: ['3 · x − x : 3 = 20', '3 · x + x : 3 = 20', '3 · (x + x : 3) = 20', 'x : 3 + 3 = 20'],
    correct: '3 · x + x : 3 = 20',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Μεταφράζουμε βήμα-βήμα τη λεκτική διατύπωση του προβλήματος σε μαθηματική εξίσωση με άγνωστο το <strong>x</strong>:
        </p>

        {/* SVG ΣΧΗΜΑ: ΑΝΑΛΥΣΗ ΤΩΝ ΟΡΩΝ ΤΗΣ ΕΞΙΣΩΣΗΣ */}
        <div className="flex justify-center p-3 bg-white/90 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="460" height="150" viewBox="0 0 460 150" className="select-none font-sans mx-auto block">
            {/* 1ος Όρος: 3 · x */}
            <g transform="translate(15, 15)">
              <rect x="0" y="0" width="125" height="70" rx="10" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.8" />
              <text x="62.5" y="22" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#1d4ed8">Τριπλάσιο του x</text>
              <text x="62.5" y="50" fontSize="18" fontWeight="black" textAnchor="middle" fill="#1e40af" fontFamily="monospace">3 · x</text>
            </g>

            {/* Σύμβολο πρόσθεσης (+) */}
            <g transform="translate(152, 50)">
              <text x="0" y="0" fontSize="24" fontWeight="black" textAnchor="middle" fill="#0f172a">＋</text>
              <text x="0" y="22" fontSize="9.5" fontWeight="bold" textAnchor="middle" fill="#64748b">«αυξημένο κατά»</text>
            </g>

            {/* 2ος Όρος: 1/3 του x (x : 3) */}
            <g transform="translate(165, 15)">
              <rect x="0" y="0" width="135" height="70" rx="10" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1.8" />
              <text x="67.5" y="22" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#15803d">Το 1/3 του αριθμού</text>
              <text x="67.5" y="50" fontSize="18" fontWeight="black" textAnchor="middle" fill="#14532d" fontFamily="monospace">x : 3</text>
            </g>

            {/* Σύμβολο ισότητας (=) */}
            <g transform="translate(315, 50)">
              <text x="0" y="0" fontSize="24" fontWeight="black" textAnchor="middle" fill="#0f172a">＝</text>
              <text x="0" y="22" fontSize="9.5" fontWeight="bold" textAnchor="middle" fill="#64748b">«ισούται με»</text>
            </g>

            {/* Αποτέλεσμα: 20 */}
            <g transform="translate(330, 15)">
              <rect x="0" y="0" width="115" height="70" rx="10" fill="#fff7ed" stroke="#ea580c" strokeWidth="1.8" />
              <text x="57.5" y="22" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#c2410c">Τελική τιμή</text>
              <text x="57.5" y="50" fontSize="20" fontWeight="black" textAnchor="middle" fill="#9a3412" fontFamily="monospace">20</text>
            </g>

            {/* Κάτω ενιαία εξίσωση */}
            <g transform="translate(15, 102)">
              <rect x="0" y="0" width="430" height="34" rx="8" fill="#0f172a" />
              <text x="215" y="22" fontSize="14" fontWeight="black" textAnchor="middle" fill="#ffffff" fontFamily="monospace">
                3 · x ＋ x : 3 ＝ 20
              </text>
            </g>
          </svg>
        </div>

        {/* ΑΝΑΛΥΤΙΚΗ ΑΠΟΚΩΔΙΚΟΠΟΙΗΣΗ ΤΩΝ ΟΡΩΝ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-3">
          <div className="space-y-1">
            <div className="font-sans font-bold text-slate-900 border-b border-slate-200 pb-1">
              Αντιστοίχιση των εκφράσεων της εκφώνησης:
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-sans text-slate-600 w-44 sm:w-52">• «Το τριπλάσιο του x»:</span>
                <strong className="text-blue-700">3 · x</strong>
              </div>

              <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-slate-200">
                <span className="font-sans text-slate-600 w-44 sm:w-52">• «αυξημένο κατά»:</span>
                <strong className="text-slate-900 text-base">＋</strong>
              </div>

              <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-slate-200">
                <span className="font-sans text-slate-600 w-44 sm:w-52">• «το 1/3 του ίδιου αριθμού»:</span>
                <span className="flex items-center gap-1">
                  <Fraction num="1" den="3" />
                  <span>· x ＝</span>
                  <Fraction num="x" den="3" />
                  <span>＝</span>
                  <strong className="text-emerald-700">x : 3</strong>
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-slate-200">
                <span className="font-sans text-slate-600 w-44 sm:w-52">• «ισούται με 20»:</span>
                <strong className="text-orange-700">＝ 20</strong>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 font-mono text-slate-900 space-y-1">
            <div className="font-sans font-bold text-emerald-950 text-xs">
              💡 Σύνθεση της τελικής εξίσωσης:
            </div>
            <div className="text-base font-black text-emerald-800 pt-0.5">
              3 · x ＋ x : 3 ＝ 20
            </div>
            <p className="text-slate-600 font-sans text-xs pt-1">
              (Η παρένθεση της επιλογής 3 · (x + x : 3) = 20 θα σήμαινε τριπλασιασμό ολόκληρου του αθροίσματος, κάτι που δεν αναφέρεται στην εκφώνηση).
            </p>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, η εξίσωση που περιγράφει σωστά το πρόβλημα είναι η <strong>3 · x + x : 3 = 20</strong>.
        </p>
      </div>
    )
  },
  {
    id: 6,
    group: 'ΟΜΑΔΑ Α (4 επιλογες)',
    prompt: 'Ποιο από τα παρακάτω κλάσματα βρίσκεται πιο κοντά στον δεκαδικό αριθμό 0,8 στην αριθμογραμμή;',
    options: [
      <Fraction num="3" den="4" />,
      <Fraction num="7" den="10" />,
      <Fraction num="43" den="50" />,
      <Fraction num="21" den="25" />
    ],
    correct: '21/25',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Μετατρέπουμε όλα τα κλάσματα σε δεκαδικούς αριθμούς (με παρονομαστή το 100) για να συγκρίνουμε εύκολα τις αποστάσεις τους από τον στόχο <strong>0,80</strong>:
        </p>

        {/* SVG ΣΧΗΜΑ: ΑΡΙΘΜΟΓΡΑΜΜΗ ΜΕ ΟΛΑ ΤΑ ΝΟΥΜΕΡΑ ΚΑΙ ΑΠΟΣΤΑΣΕΙΣ ΑΠΟ ΤΟ 0,80 */}
        <div className="bg-white/90 p-3.5 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="520" height="200" viewBox="0 0 520 200" className="select-none font-sans mx-auto block">
            <defs>
              <marker id="numline-arr-6" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 2 L 8 5 L 0 8 z" fill="#334155" />
              </marker>
            </defs>

            {/* Κεντρικός άξονας αριθμογραμμής (από 0,68 έως 0,90) */}
            <line x1="20" y1="100" x2="495" y2="100" stroke="#334155" strokeWidth="2" markerEnd="url(#numline-arr-6)" />

            {/* Υποδιαίρεση κλίμακας: x = 50 + (val - 0.70) * 2000 */}
            {/* 0,70 -> 50 | 0,75 -> 150 | 0,80 -> 250 | 0,84 -> 330 | 0,86 -> 370 */}

            {/* 1. ΣΗΜΕΙΟ 7/10 = 0,70 */}
            <g transform="translate(50, 100)">
              <line x1="0" y1="-8" x2="0" y2="8" stroke="#64748b" strokeWidth="2" />
              <circle cx="0" cy="0" r="4.5" fill="#64748b" />
              <text x="0" y="-28" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#475569">7/10</text>
              <text x="0" y="-14" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#64748b">(0,70)</text>
              <text x="0" y="24" fontSize="9.5" textAnchor="middle" fill="#dc2626" fontFamily="monospace">d = 0,10</text>
            </g>

            {/* 2. ΣΗΜΕΙΟ 3/4 = 0,75 */}
            <g transform="translate(150, 100)">
              <line x1="0" y1="-8" x2="0" y2="8" stroke="#64748b" strokeWidth="2" />
              <circle cx="0" cy="0" r="4.5" fill="#64748b" />
              <text x="0" y="-28" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#475569">3/4</text>
              <text x="0" y="-14" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#64748b">(0,75)</text>
              <text x="0" y="24" fontSize="9.5" textAnchor="middle" fill="#dc2626" fontFamily="monospace">d = 0,05</text>
            </g>

            {/* 3. ΣΤΟΧΟΣ 0,80 (ΕΠΙΚΕΝΤΡΟ) */}
            <g transform="translate(250, 100)">
              <line x1="0" y1="-32" x2="0" y2="35" stroke="#2563eb" strokeWidth="2.5" strokeDasharray="3 2" />
              <circle cx="0" cy="0" r="6.5" fill="#2563eb" stroke="#1e40af" strokeWidth="1.5" />
              <rect x="-35" y="-62" width="70" height="24" rx="6" fill="#1e293b" />
              <text x="0" y="-46" fontSize="12" fontWeight="black" textAnchor="middle" fill="#ffffff">
                0,80 ⭐
              </text>
              <text x="0" y="50" fontSize="10" fontWeight="black" textAnchor="middle" fill="#1d4ed8">
                (Στόχος)
              </text>
            </g>

            {/* 4. ΣΗΜΕΙΟ 21/25 = 0,84 (ΤΟ ΠΛΗΣΙΕΣΤΕΡΟ) */}
            <g transform="translate(330, 100)">
              <line x1="0" y1="-10" x2="0" y2="10" stroke="#16a34a" strokeWidth="2.5" />
              <circle cx="0" cy="0" r="6" fill="#16a34a" stroke="#14532d" strokeWidth="1.5" />
              <text x="0" y="-28" fontSize="11.5" fontWeight="black" textAnchor="middle" fill="#15803d">21/25</text>
              <text x="0" y="-14" fontSize="10.5" fontWeight="black" textAnchor="middle" fill="#16a34a">(0,84)</text>
              <rect x="-26" y="14" width="52" height="18" rx="4" fill="#dcfce7" stroke="#86efac" strokeWidth="1" />
              <text x="0" y="27" fontSize="9.5" fontWeight="black" textAnchor="middle" fill="#166534" fontFamily="monospace">d = 0,04</text>
              <text x="0" y="46" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#15803d">Πιο κοντά!</text>
            </g>

            {/* 5. ΣΗΜΕΙΟ 43/50 = 0,86 */}
            <g transform="translate(370, 100)">
              <line x1="0" y1="-8" x2="0" y2="8" stroke="#64748b" strokeWidth="2" />
              <circle cx="0" cy="0" r="4.5" fill="#64748b" />
              <text x="0" y="-28" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#475569">43/50</text>
              <text x="0" y="-14" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#64748b">(0,86)</text>
              <text x="0" y="24" fontSize="9.5" textAnchor="middle" fill="#dc2626" fontFamily="monospace">d = 0,06</text>
            </g>

            {/* ΤΟΞΑ ΑΠΟΣΤΑΣΗΣ ΓΙΑ ΣΥΓΚΡΙΣΗ (21/25 vs 43/50) */}
            <path d="M 250 82 Q 290 65 330 82" fill="none" stroke="#16a34a" strokeWidth="2" />
            <text x="290" y="68" fontSize="9.5" fontWeight="black" textAnchor="middle" fill="#15803d">0,04</text>
          </svg>
        </div>

        {/* ΑΝΑΛΥΤΙΚΑ ΒΗΜΑΤΑ ΚΑΙ ΣΥΓΚΡΙΣΗ ΑΠΟΣΤΑΣΕΩΝ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-3">
          <div className="space-y-1">
            <div className="font-sans font-bold text-slate-900 border-b border-slate-200 pb-1">
              1. Μετατροπή των κλασμάτων σε ομώνυμα με παρονομαστή το 100 (δεκαδικοί):
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span>•</span>
                <Fraction num="7" den="10" />
                <span>＝</span>
                <Fraction num="70" den="100" />
                <span>＝ <strong>0,70</strong></span>
              </div>

              <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-slate-200">
                <span>•</span>
                <Fraction num="3" den="4" />
                <span>＝</span>
                <Fraction num="75" den="100" />
                <span>＝ <strong>0,75</strong></span>
              </div>

              <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-slate-200 bg-emerald-50/60 p-1.5 rounded-lg">
                <span>•</span>
                <strong className="text-emerald-800"><Fraction num="21" den="25" /></strong>
                <span>＝</span>
                <Fraction num="84" den="100" />
                <span>＝ <strong className="text-emerald-700">0,84</strong></span>
              </div>

              <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-slate-200">
                <span>•</span>
                <Fraction num="43" den="50" />
                <span>＝</span>
                <Fraction num="86" den="100" />
                <span>＝ <strong>0,86</strong></span>
              </div>
            </div>
          </div>

          <div className="space-y-1 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-slate-900 border-b border-slate-200 pb-1">
              2. Υπολογισμός της απόστασης κάθε αριθμού από το 0,80:
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
              <div>• Για το 0,70: |0,80 － 0,70| ＝ <strong>0,10</strong></div>
              <div>• Για το 0,75: |0,80 － 0,75| ＝ <strong>0,05</strong></div>
              <div className="text-emerald-700 font-bold bg-emerald-50 p-1 rounded-md">
                • Για το 0,84 (<Fraction num="21" den="25" />): |0,80 － 0,84| ＝ 0,04 ⭐ (ελάχιστη απόσταση)
              </div>
              <div>• Για το 0,86: |0,80 － 0,86| ＝ <strong>0,06</strong></div>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, το κλάσμα που βρίσκεται πιο κοντά στον αριθμό 0,8 είναι το <strong><Fraction num="21" den="25" /></strong>.
        </p>
      </div>
    )
  },
  {
    id: 7,
    group: 'ΟΜΑΔΑ Α (4 επιλογες)',
    prompt: 'Ο μέσος όρος 6 συνεχόμενων άρτιων (ζυγών) φυσικών αριθμών είναι 15. Ποιος είναι ο μεγαλύτερος από αυτούς τους έξι αριθμούς;',
    options: ['16', '18', '20', '22'],
    correct: '20',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Επειδή οι 6 άρτιοι αριθμοί είναι <strong>συνεχόμενοι</strong>, διαφέρουν μεταξύ τους κατά <strong>2</strong> και είναι συμμετρικά κατανεμημένοι γύρω από τον μέσο όρο τους (<strong>15</strong>).
        </p>

        {/* SVG ΣΧΗΜΑ: ΣΥΜΜΕΤΡΙΑ ΤΩΝ 6 ΑΡΤΙΩΝ ΓΥΡΩ ΑΠΟ ΤΟΝ ΜΕΣΟ ΟΡΟ 15 */}
        <div className="bg-white/90 p-3.5 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="490" height="155" viewBox="0 0 490 155" className="select-none font-sans mx-auto block">
            <defs>
              <marker id="numline-arr-7" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 2 L 8 5 L 0 8 z" fill="#334155" />
              </marker>
            </defs>

            {/* Κεντρικός άξονας αριθμογραμμής */}
            <line x1="20" y1="75" x2="470" y2="75" stroke="#334155" strokeWidth="2" markerEnd="url(#numline-arr-7)" />

            {/* ΚΕΝΤΡΙΚΟΣ ΜΕΣΟΣ ΟΡΟΣ = 15 */}
            <g transform="translate(245, 75)">
              <line x1="0" y1="-28" x2="0" y2="28" stroke="#dc2626" strokeWidth="2" strokeDasharray="3 2" />
              <circle cx="0" cy="0" r="4.5" fill="#dc2626" />
              <rect x="-38" y="-56" width="76" height="24" rx="6" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1.2" />
              <text x="0" y="-40" fontSize="11" fontWeight="black" textAnchor="middle" fill="#b91c1c">Μ.Ο. ＝ 15</text>
              <text x="0" y="44" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#dc2626">Κέντρο Συμμετρίας</text>
            </g>

            {/* ΟΙ 6 ΑΡΤΙΟΙ ΑΡΙΘΜΟΙ (10, 12, 14, 16, 18, 20) */}
            {[
              { val: 10, x: 55, label: '1ος (μικρότερος)' },
              { val: 12, x: 120, label: '2ος' },
              { val: 14, x: 185, label: '3ος' },
              { val: 16, x: 305, label: '4ος' },
              { val: 18, x: 370, label: '5ος' },
              { val: 20, x: 435, label: '6ος (μεγαλύτερος)', isMax: true }
            ].map((item) => (
              <g key={item.val} transform={`translate(${item.x}, 75)`}>
                <line x1="0" y1="-8" x2="0" y2="8" stroke={item.isMax ? '#16a34a' : '#475569'} strokeWidth={item.isMax ? '2.5' : '1.8'} />
                <circle cx="0" cy="0" r={item.isMax ? '6' : '4.5'} fill={item.isMax ? '#16a34a' : '#3b82f6'} stroke={item.isMax ? '#14532d' : '#1d4ed8'} strokeWidth="1.2" />
                <text x="0" y="-14" fontSize={item.isMax ? '13' : '12'} fontWeight={item.isMax ? '900' : 'bold'} textAnchor="middle" fill={item.isMax ? '#15803d' : '#0f172a'}>
                  {item.val}
                </text>
                <text x="0" y="24" fontSize="8.5" fontWeight={item.isMax ? 'bold' : 'normal'} textAnchor="middle" fill={item.isMax ? '#166534' : '#64748b'}>
                  {item.label}
                </text>
              </g>
            ))}

            {/* ΕΠΙΣΗΜΑΝΣΗ ΣΤΟΝ ΜΕΓΑΛΥΤΕΡΟ (20) */}
            <g transform="translate(435, 22)">
              <rect x="-24" y="0" width="48" height="18" rx="4" fill="#dcfce7" stroke="#86efac" strokeWidth="1" />
              <text x="0" y="13" fontSize="9.5" fontWeight="black" textAnchor="middle" fill="#166534">Στόχος ⭐</text>
            </g>
          </svg>
        </div>

        {/* ΑΝΑΛΥΤΙΚΟΙ ΤΡΟΠΟΙ ΕΠΙΛΥΣΗΣ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-3">
          {/* 1ος Τρόπος */}
          <div className="space-y-1.5">
            <div className="font-sans font-bold text-blue-900 border-b border-slate-200 pb-1">
              🔷 1ος Τρόπος (Αλγεβρικά με εξίσωση αθροίσματος)
            </div>
            <p className="text-slate-700">
              Αφού ο μέσος όρος των 6 αριθμών είναι 15, το συνολικό τους άθροισμα ισούται με:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>Μέσος Όρος ＝</span>
                <Fraction num="Άθροισμα 6 αριθμών" den="6" />
                <span>＝ 15 ➔ <strong>Άθροισμα ＝ 6 · 15 ＝ 90</strong></span>
              </div>
              <div className="pt-1 border-t border-slate-200 text-slate-700 font-sans text-xs">
                Αν συμβολίσουμε τον πρώτο (μικρότερο) άρτιο με <strong>α</strong>, οι 6 διαδοχικοί άρτιοι είναι:
              </div>
              <div className="font-bold text-slate-800">
                α, &nbsp;α ＋ 2, &nbsp;α ＋ 4, &nbsp;α ＋ 6, &nbsp;α ＋ 8, &nbsp;α ＋ 10
              </div>
              <div className="pt-1 border-t border-slate-200 space-y-1">
                <div>(α) ＋ (α ＋ 2) ＋ (α ＋ 4) ＋ (α ＋ 6) ＋ (α ＋ 8) ＋ (α ＋ 10) ＝ 90</div>
                <div>6α ＋ 30 ＝ 90</div>
                <div>6α ＝ 90 － 30 ＝ 60 ➔ <strong>α ＝ 10</strong></div>
              </div>
              <div className="pt-1 border-t border-slate-200 text-emerald-800 font-bold">
                Ο μεγαλύτερος είναι: α ＋ 10 ＝ 10 ＋ 10 ＝ <span className="text-base text-emerald-700 font-black">20</span>
              </div>
            </div>
          </div>

          {/* 2ος Τρόπος */}
          <div className="space-y-1.5 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-blue-900 border-b border-slate-200 pb-1">
              🔷 2ος Τρόπος (Συμμετρία γύρω από τον μέσο όρο)
            </div>
            <p className="text-slate-700">
              Σε μια σειρά διαδοχικών αριθμών με σταθερό βήμα, ο <strong>μέσος όρος</strong> βρίσκεται ακριβώς στη μέση.
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
              <div>• Το 15 βρίσκεται ακριβώς ανάμεσα στον 3ο και τον 4ο άρτιο αριθμό.</div>
              <div>• Οι δύο μεσαίοι άρτιοι είναι το <strong>14</strong> (15 － 1) και το <strong>16</strong> (15 ＋ 1).</div>
              <div className="pt-1 border-t border-slate-200">
                Προχωρώντας κατά 2 προς τα εμπρός: <strong>16 ➔ 18 ➔ 20</strong> (ο 6ος και μεγαλύτερος).
              </div>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, ο μεγαλύτερος από τους έξι αριθμούς είναι το <strong>20</strong>.
        </p>
      </div>
    )
  },
  {
    id: 8,
    group: 'ΟΜΑΔΑ Α (4 επιλογες)',
    prompt: 'Ένα τετράγωνο έχει εμβαδόν 64 τ.εκ. Αν διπλασιάσουμε το μήκος της πλευράς του, πόσο θα γίνει η περίμετρος του νέου τετραγώνου;',
    options: ['32 εκ.', '48 εκ.', '64 εκ.', '128 εκ.'],
    correct: '64 εκ.',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Υπολογίζουμε πρώτα την πλευρά του αρχικού τετραγώνου από το δοσμένο εμβαδόν του και στη συνέχεια τη νέα πλευρά και την περίμετρο μετά τον διπλασιασμό:
        </p>

        {/* SVG ΣΧΗΜΑ: ΣΥΓΚΡΙΣΗ ΑΡΧΙΚΟΥ & ΝΕΟΥ ΤΕΤΡΑΓΩΝΟΥ */}
        <div className="flex justify-center p-3 bg-white/90 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="490" height="200" viewBox="0 0 490 200" className="select-none font-sans mx-auto block">
            <defs>
              <marker id="arr-scale-8" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 2 L 8 5 L 0 8 z" fill="#2563eb" />
              </marker>
            </defs>

            {/* 1. ΑΡΧΙΚΟ ΤΕΤΡΑΓΩΝΟ (8 x 8 -> 65px στο σχεδιασμό) */}
            <g transform="translate(35, 30)">
              <text x="32.5" y="-12" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0f172a">
                Αρχικό Τετράγωνο
              </text>
              <rect x="0" y="0" width="65" height="65" rx="6" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
              <text x="32.5" y="32" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#1d4ed8">Ε ＝ 64 τ.εκ.</text>
              <text x="32.5" y="46" fontSize="9.5" textAnchor="middle" fill="#2563eb">(8 · 8)</text>

              {/* Διαστάσεις πλευράς */}
              <text x="32.5" y="80" fontSize="10.5" fontWeight="black" textAnchor="middle" fill="#1e40af">α ＝ 8 εκ.</text>
              <text x="-12" y="36" fontSize="10.5" fontWeight="black" textAnchor="middle" fill="#1e40af">8 εκ.</text>
              
              {/* Περίμετρος */}
              <rect x="-10" y="92" width="85" height="20" rx="4" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
              <text x="32.5" y="106" fontSize="9.5" fontWeight="bold" textAnchor="middle" fill="#475569">Π ＝ 32 εκ.</text>
            </g>

            {/* ΜΕΤΑΒΑΣΗ ΜΕ ΔΙΠΛΑΣΙΑΣΜΟ ΠΛΕΥΡΑΣ (· 2) */}
            <g transform="translate(135, 70)">
              <path d="M 10 0 L 60 0" fill="none" stroke="#2563eb" strokeWidth="2" markerEnd="url(#arr-scale-8)" />
              <text x="35" y="-10" fontSize="11" fontWeight="black" textAnchor="middle" fill="#1d4ed8">
                Διπλασιασμός
              </text>
              <text x="35" y="18" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#2563eb">
                πλευράς (· 2)
              </text>
            </g>

            {/* 2. ΝΕΟ ΤΕΤΡΑΓΩΝΟ (16 x 16 -> 130px στο σχεδιασμό) */}
            <g transform="translate(235, 20)">
              <text x="65" y="-6" fontSize="11.5" fontWeight="black" textAnchor="middle" fill="#15803d">
                Νέο Τετράγωνο (Διπλάσια Πλευρά)
              </text>
              {/* Εξωτερικό νέο τετράγωνο */}
              <rect x="0" y="6" width="130" height="130" rx="8" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2.5" />

              {/* 4 εσωτερικά υπο-τετράγωνα για οπτική αντίληψη */}
              <rect x="0" y="6" width="65" height="65" fill="#dcfce7" fillOpacity="0.5" stroke="#86efac" strokeWidth="1" strokeDasharray="3 3" />
              <rect x="65" y="6" width="65" height="65" fill="#dcfce7" fillOpacity="0.5" stroke="#86efac" strokeWidth="1" strokeDasharray="3 3" />
              <rect x="0" y="71" width="65" height="65" fill="#dcfce7" fillOpacity="0.5" stroke="#86efac" strokeWidth="1" strokeDasharray="3 3" />
              <rect x="65" y="71" width="65" height="65" fill="#dcfce7" fillOpacity="0.5" stroke="#86efac" strokeWidth="1" strokeDasharray="3 3" />

              {/* Διαστάσεις πλευράς νέου */}
              <text x="65" y="152" fontSize="11.5" fontWeight="black" textAnchor="middle" fill="#166534">α_νέο ＝ 16 εκ. (2 · 8)</text>
              <text x="-14" y="75" fontSize="11" fontWeight="black" textAnchor="middle" fill="#166534">16 εκ.</text>

              {/* Σήμανση νέας περιμέτρου */}
              <rect x="15" y="58" width="100" height="30" rx="6" fill="#16a34a" />
              <text x="65" y="77" fontSize="12" fontWeight="black" textAnchor="middle" fill="#ffffff">
                Π ＝ 64 εκ. ⭐
              </text>
            </g>
          </svg>
        </div>

        {/* ΑΝΑΛΥΤΙΚΑ ΒΗΜΑΤΑ ΕΠΙΛΥΣΗΣ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-3">
          {/* Βήμα 1: Αρχική πλευρά */}
          <div className="space-y-1">
            <div className="font-sans font-bold text-slate-900 border-b border-slate-200 pb-1">
              1. Εύρεση της πλευράς του αρχικού τετραγώνου:
            </div>
            <p className="text-slate-700">
              Το εμβαδόν τετραγώνου δίνεται από τον τύπο <span className="font-mono font-bold">Ε ＝ α · α ＝ α²</span>:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
              <div>α · α ＝ 64 τ.εκ. ➔ <strong className="text-blue-700">α ＝ 8 εκ.</strong> (αφού 8 · 8 ＝ 64)</div>
            </div>
          </div>

          {/* Βήμα 2: Νέα πλευρά & περίμετρος */}
          <div className="space-y-1 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-slate-900 border-b border-slate-200 pb-1">
              2. Υπολογισμός της νέας πλευράς και της νέας περιμέτρου:
            </div>
            <p className="text-slate-700">
              Διπλασιάζουμε το μήκος της πλευράς του:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
              <div>• Νέα πλευρά: 2 · 8 ＝ <strong>16 εκ.</strong></div>
              <div className="pt-1 border-t border-slate-200 text-slate-700 font-sans text-xs">
                Η περίμετρος τετραγώνου ισούται με το άθροισμα των 4 ίσων πλευρών του (<span className="font-mono font-bold">Π ＝ 4 · α</span>):
              </div>
              <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                <span>• Νέα Περίμετρος ＝ 4 · 16 εκ. ＝</span>
                <strong className="text-emerald-700 text-base">64 εκ.</strong>
              </div>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, η περίμετρος του νέου τετραγώνου θα γίνει <strong>64 εκ.</strong>
        </p>
      </div>
    )
  },
  {
    id: 9,
    group: 'ΟΜΑΔΑ Α (4 επιλογες)',
    prompt: 'Η Ελένη και η Δήμητρα έχουν μαζί 45 βιβλία. Αν η Ελένη δώσει 5 βιβλία στη Δήμητρα, τότε η Δήμητρα θα έχει ακριβώς τα διπλάσια βιβλία από την Ελένη. Πόσα βιβλία είχε αρχικά η Ελένη;',
    options: ['15', '20', '25', '30'],
    correct: '20',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Η μεταφορά βιβλίων μεταξύ των δύο κοριτσιών δεν αλλάζει το συνολικό τους πλήθος, το οποίο παραμένει σταθερά <strong>45 βιβλία</strong>.
        </p>

        {/* SVG ΣΧΗΜΑ: ΟΠΤΙΚΟΠΟΙΗΣΗ ΤΩΝ ΙΣΩΝ ΜΕΡΩΝ ΣΤΟ ΤΕΛΟΣ ΚΑΙ ΕΠΙΣΤΡΟΦΗ ΣΤΗΝ ΑΡΧΙΚΗ ΚΑΤΑΣΤΑΣΗ */}
        <div className="flex justify-center p-3 bg-white/90 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="490" height="210" viewBox="0 0 490 210" className="select-none font-sans mx-auto block">
            <defs>
              <marker id="arrow-books-back" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 2 L 8 5 L 0 8 z" fill="#dc2626" />
              </marker>
            </defs>

            {/* 1. ΤΕΛΙΚΗ ΚΑΤΑΣΤΑΣΗ: 3 ΙΣΑ ΜΕΡΗ (45 : 3 = 15 ΒΙΒΛΙΑ ΑΝΑ ΜΕΡΟΣ) */}
            <g transform="translate(15, 12)">
              <text x="0" y="14" fontSize="11.5" fontWeight="black" fill="#0f172a">
                1. Τελική Κατάσταση (Σύνολο: 45 βιβλία ＝ 3 ίσα μέρη)
              </text>

              {/* Ελένη: 1 μέρος (15 βιβλία) */}
              <g transform="translate(0, 26)">
                <rect x="0" y="0" width="70" height="24" rx="4" fill="#f8fafc" />
                <text x="0" y="16" fontSize="11" fontWeight="bold" fill="#0369a1">Ελένη:</text>
                <rect x="75" y="0" width="105" height="24" rx="6" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.6" />
                <text x="127.5" y="16" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#1d4ed8">1 μέρος (15)</text>
              </g>

              {/* Δήμητρα: 2 μέρη (2 · 15 = 30 βιβλία) */}
              <g transform="translate(0, 56)">
                <rect x="0" y="0" width="70" height="24" rx="4" fill="#f8fafc" />
                <text x="0" y="16" fontSize="11" fontWeight="bold" fill="#475569">Δήμητρα:</text>
                <rect x="75" y="0" width="105" height="24" rx="6" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.6" />
                <text x="127.5" y="16" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#475569">1 μέρος (15)</text>
                <rect x="185" y="0" width="105" height="24" rx="6" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.6" />
                <text x="237.5" y="16" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#475569">1 μέρος (15)</text>

                {/* Συνολική ετικέτα 45 βιβλίων */}
                <path d="M 75 -2 L 290 -2" stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" />
                <rect x="305" y="-12" width="145" height="40" rx="8" fill="#f0fdf4" stroke="#86efac" strokeWidth="1.2" />
                <text x="377.5" y="6" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#166534">45 : 3 μέρη ＝</text>
                <text x="377.5" y="21" fontSize="12" fontWeight="black" textAnchor="middle" fill="#15803d">15 βιβλία / μέρος</text>
              </g>
            </g>

            {/* ΔΙΑΧΩΡΙΣΤΙΚΗ ΓΡΑΜΜΗ */}
            <line x1="20" y1="108" x2="470" y2="108" stroke="#e2e8f0" strokeWidth="1.2" />

            {/* 2. ΑΡΧΙΚΗ ΚΑΤΑΣΤΑΣΗ: ΕΠΙΣΤΡΟΦΗ ΤΩΝ 5 ΒΙΒΛΙΩΝ ΣΤΗΝ ΕΛΕΝΗ */}
            <g transform="translate(15, 122)">
              <text x="0" y="14" fontSize="11.5" fontWeight="black" fill="#0f172a">
                2. Αρχική Κατάσταση (Επιστρέφουμε τα 5 βιβλία πίσω στην Ελένη)
              </text>

              <g transform="translate(0, 26)">
                <text x="0" y="18" fontSize="11" fontWeight="bold" fill="#0369a1">Ελένη:</text>
                
                {/* 15 βιβλία του τέλους */}
                <rect x="75" y="0" width="105" height="28" rx="6" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.6" />
                <text x="127.5" y="18" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#1d4ed8">15 (στο τέλος)</text>

                {/* + 5 βιβλία που είχε δώσει */}
                <rect x="185" y="0" width="65" height="28" rx="6" fill="#fef2f2" stroke="#ef4444" strokeWidth="1.8" strokeDasharray="3 2" />
                <text x="217.5" y="18" fontSize="10.5" fontWeight="black" textAnchor="middle" fill="#dc2626">＋ 5</text>

                {/* Τόξο επιστροφής */}
                <path d="M 270 14 Q 255 32 240 28" fill="none" stroke="#dc2626" strokeWidth="1.5" markerEnd="url(#arrow-books-back)" />

                {/* Τελικό Αποτέλεσμα Αρχικών Βιβλίων Ελένης */}
                <rect x="260" y="-1" width="190" height="30" rx="8" fill="#16a34a" />
                <text x="355" y="19" fontSize="12" fontWeight="black" textAnchor="middle" fill="#ffffff">
                  Αρχικά: 15 ＋ 5 ＝ 20 βιβλία ⭐
                </text>
              </g>
            </g>
          </svg>
        </div>

        {/* ΑΝΑΛΥΤΙΚΟΙ ΤΡΟΠΟΙ ΕΠΙΛΥΣΗΣ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-3">
          {/* 1ος Τρόπος */}
          <div className="space-y-1.5">
            <div className="font-sans font-bold text-blue-900 border-b border-slate-200 pb-1">
              🔷 1ος Τρόπος (Με τη μέθοδο των ίσων μερών)
            </div>
            <p className="text-slate-700">
              Στο τέλος, η Δήμητρα έχει διπλάσια βιβλία από την Ελένη:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
              <div>• Βιβλία Ελένης στο τέλος: <strong>1 μέρος</strong></div>
              <div>• Βιβλία Δήμητρας στο τέλος: <strong>2 μέρη</strong></div>
              <div>• Συνολικά μέρη: 1 ＋ 2 ＝ <strong>3 ίσα μέρη</strong></div>
              <div className="pt-1 border-t border-slate-200 flex items-center gap-1.5 flex-wrap">
                <span>• Κάθε μέρος αντιστοιχεί σε:</span>
                <Fraction num="45" den="3" />
                <span>＝ <strong>15 βιβλία</strong></span>
              </div>
              <div className="pt-1 border-t border-slate-200 text-slate-800">
                Άρα στο τέλος η Ελένη έχει 15 βιβλία. Επειδή είχε δώσει 5 βιβλία στη Δήμητρα, αρχικά είχε:
              </div>
              <div className="text-emerald-700 font-bold text-base">
                Αρχικά βιβλία Ελένης ＝ 15 ＋ 5 ＝ 20 βιβλία
              </div>
            </div>
          </div>

          {/* 2ος Τρόπος */}
          <div className="space-y-1.5 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-blue-900 border-b border-slate-200 pb-1">
              🔷 2ος Τρόπος (Αλγεβρικά με εξίσωση)
            </div>
            <p className="text-slate-700">
              Έστω <strong>x</strong> τα βιβλία που είχε αρχικά η Ελένη. Τότε η Δήμητρα είχε αρχικά <strong>45 － x</strong> βιβλία.
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
              <div>• Μετά τη μεταφορά των 5 βιβλίων:</div>
              <div className="pl-3 text-slate-700">
                Ελένη: x － 5 &nbsp;|&nbsp; Δήμητρα: (45 － x) ＋ 5 ＝ 50 － x
              </div>
              <div className="pt-1 border-t border-slate-200">
                Η Δήμητρα έχει τα διπλάσια:
              </div>
              <div className="pl-3 space-y-1 text-slate-900">
                <div>50 － x ＝ 2 · (x － 5)</div>
                <div>50 － x ＝ 2x － 10</div>
                <div>50 ＋ 10 ＝ 2x ＋ x</div>
                <div>3x ＝ 60</div>
                <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                  <span>x ＝</span>
                  <Fraction num="60" den="3" />
                  <span>➔ <strong className="text-emerald-700 text-base">x ＝ 20 βιβλία</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, η Ελένη είχε αρχικά <strong>20 βιβλία</strong>.
        </p>
      </div>
    )
  },
  {
    id: 10,
    group: 'ΟΜΑΔΑ Α (4 επιλογες)',
    prompt: 'Σε ποιον αριθμό αντιστοιχεί ο όρος που λείπει από το παρακάτω αριθμητικό μοτίβο;\n2, 6, 12, 20, 30, __, 56, 72',
    options: ['36', '40', '42', '45'],
    correct: '42',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Αναλύουμε το αριθμητικό μοτίβο εξετάζοντας τις <strong>διαφορές μεταξύ των διαδοχικών όρων</strong>, οι οποίες αυξάνονται σταθερά κατά 2:
        </p>

        {/* SVG ΣΧΗΜΑ: ΟΙ ΟΡΟΙ ΤΗΣ ΑΚΟΛΟΥΘΙΑΣ ΚΑΙ ΤΑ ΤΟΞΑ ΔΙΑΦΟΡΩΝ (+4, +6, +8, +10, +12, +14, +16) */}
        <div className="flex justify-center p-3 bg-white/90 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="530" height="170" viewBox="0 0 530 170" className="select-none font-sans mx-auto block">
            <defs>
              <marker id="motif-arr-10" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#2563eb" />
              </marker>
              <marker id="motif-arr-target" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#16a34a" />
              </marker>
            </defs>

            {/* ΟΙ 8 ΟΡΟΙ ΤΟΥ ΜΟΤΙΒΟΥ */}
            {[
              { val: '2', x: 30 },
              { val: '6', x: 95 },
              { val: '12', x: 160 },
              { val: '20', x: 225 },
              { val: '30', x: 290 },
              { val: '42', x: 355, isTarget: true },
              { val: '56', x: 420 },
              { val: '72', x: 485 }
            ].map((node) => (
              <g key={node.val} transform={`translate(${node.x}, 115)`}>
                {/* Πλαίσιο αριθμού */}
                <rect
                  x="-22"
                  y="-18"
                  width="44"
                  height="36"
                  rx="8"
                  fill={node.isTarget ? '#dcfce7' : '#f8fafc'}
                  stroke={node.isTarget ? '#16a34a' : '#cbd5e1'}
                  strokeWidth={node.isTarget ? '2.2' : '1.5'}
                />
                <text
                  x="0"
                  y="5"
                  fontSize={node.isTarget ? '15' : '13'}
                  fontWeight={node.isTarget ? '900' : 'bold'}
                  textAnchor="middle"
                  fill={node.isTarget ? '#15803d' : '#0f172a'}
                  fontFamily="monospace"
                >
                  {node.val}
                </text>
                {node.isTarget && (
                  <text x="0" y="32" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#15803d">
                    (Ζητούμενο ⭐)
                  </text>
                )}
              </g>
            ))}

            {/* ΤΟΞΑ ΜΕΤΑΒΑΣΗΣ / ΔΙΑΦΟΡΩΝ (+4, +6, +8, +10, +12, +14, +16) */}
            {[
              { startX: 30, endX: 95, diff: '+4' },
              { startX: 95, endX: 160, diff: '+6' },
              { startX: 160, endX: 225, diff: '+8' },
              { startX: 225, endX: 290, diff: '+10' },
              { startX: 290, endX: 355, diff: '+12', isTarget: true },
              { startX: 355, endX: 420, diff: '+14' },
              { startX: 420, endX: 485, diff: '+16' }
            ].map((arc, idx) => (
              <g key={`arc-${idx}`}>
                <path
                  d={`M ${arc.startX} 92 C ${arc.startX + 15} 45, ${arc.endX - 15} 45, ${arc.endX} 92`}
                  fill="none"
                  stroke={arc.isTarget ? '#16a34a' : '#2563eb'}
                  strokeWidth={arc.isTarget ? '2.5' : '1.8'}
                  markerEnd={arc.isTarget ? 'url(#motif-arr-target)' : 'url(#motif-arr-10)'}
                />
                <text
                  x={(arc.startX + arc.endX) / 2}
                  y="52"
                  fontSize={arc.isTarget ? '12.5' : '11'}
                  fontWeight={arc.isTarget ? '900' : 'bold'}
                  textAnchor="middle"
                  fill={arc.isTarget ? '#15803d' : '#1e40af'}
                  fontFamily="monospace"
                >
                  {arc.diff}
                </text>
              </g>
            ))}

            {/* ΕΝΔΕΙΞΗ ΣΤΑΘΕΡΗΣ ΑΥΞΗΣΗΣ ΤΩΝ ΔΙΑΦΟΡΩΝ */}
            <g transform="translate(15, 12)">
              <rect x="0" y="0" width="500" height="20" rx="6" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1" />
              <text x="250" y="14" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#475569">
                Διαδοχικές διαφορές: +4, +6, +8, +10, +12, +14, +16 (κάθε βήμα αυξάνεται κατά +2)
              </text>
            </g>
          </svg>
        </div>

        {/* ΑΝΑΛΥΤΙΚΟΙ ΤΡΟΠΟΙ ΕΠΙΛΥΣΗΣ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-3">
          {/* 1ος Τρόπος: Μέσω διαφορών */}
          <div className="space-y-1.5">
            <div className="font-sans font-bold text-blue-900 border-b border-slate-200 pb-1">
              🔷 1ος Τρόπος (Μέσω των διαφορών διαδοχικών όρων)
            </div>
            <p className="text-slate-700">
              Παρατηρούμε τη διαφορά ανάμεσα σε κάθε όρο και τον επόμενό του:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
              <div>• 2 ＋ <strong className="text-blue-700">4</strong> ＝ 6</div>
              <div>• 6 ＋ <strong className="text-blue-700">6</strong> ＝ 12</div>
              <div>• 12 ＋ <strong className="text-blue-700">8</strong> ＝ 20</div>
              <div>• 20 ＋ <strong className="text-blue-700">10</strong> ＝ 30</div>
              <div className="pt-1 border-t border-slate-200 bg-emerald-50/70 p-1 rounded-md">
                • 30 ＋ <strong className="text-emerald-700">12</strong> ＝ <strong className="text-emerald-700 text-base">42</strong> ⭐ (ο όρος που λείπει)
              </div>
              <div className="pt-1 text-slate-600 font-sans text-xs">
                Επαλήθευση για τους επόμενους όρους:
              </div>
              <div>• 42 ＋ <strong className="text-blue-700">14</strong> ＝ 56</div>
              <div>• 56 ＋ <strong className="text-blue-700">16</strong> ＝ 72 (επαληθεύεται)</div>
            </div>
          </div>

          {/* 2ος Τρόπος: Γινόμενο διαδοχικών φυσικών */}
          <div className="space-y-1.5 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-blue-900 border-b border-slate-200 pb-1">
              🔷 2ος Τρόπος (Γινόμενο διαδοχικών φυσικών αριθμών)
            </div>
            <p className="text-slate-700">
              Κάθε όρος ισούται με το γινόμενο δύο διαδοχικών αριθμών (<span className="font-mono font-bold">ν · (ν ＋ 1)</span>):
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
              <div>• 1ος όρος: 1 · 2 ＝ <strong>2</strong></div>
              <div>• 2ος όρος: 2 · 3 ＝ <strong>6</strong></div>
              <div>• 3ος όρος: 3 · 4 ＝ <strong>12</strong></div>
              <div>• 4ος όρος: 4 · 5 ＝ <strong>20</strong></div>
              <div>• 5ος όρος: 5 · 6 ＝ <strong>30</strong></div>
              <div className="pt-1 border-t border-slate-200 text-emerald-800 font-bold">
                • 6ος όρος (ζητούμενος): 6 · 7 ＝ <span className="text-base text-emerald-700 font-black">42</span>
              </div>
              <div className="pt-1 border-t border-slate-200 text-slate-600 font-sans text-xs">
                • 7ος: 7 · 8 ＝ 56 &nbsp;|&nbsp; 8ος: 8 · 9 ＝ 72
              </div>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, ο όρος που λείπει είναι ο αριθμός <strong>42</strong>.
        </p>
      </div>
    )
  },
  {
    id: 11,
    group: 'ΟΜΑΔΑ Β (5 επιλογες)',
    prompt: 'Για την αγορά 6 ίδιων τετραδίων και 4 ίδιων στυλό πληρώσαμε συνολικά 24€. Αν αγοράζαμε 6 ίδια τετράδια και 7 ίδια στυλό θα πληρώναμε συνολικά 33€. Πόσα ευρώ κοστίζει το ένα τετράδιο;',
    options: ['1,5€', '2€', '2,5€', '3€', '4€'],
    correct: '2€',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Συγκρίνουμε τις δύο αγορές: το πλήθος των τετραδίων είναι <strong>σταθερό (6 τετράδια)</strong>, επομένως η αύξηση στο συνολικό κόστος οφείλεται αποκλειστικά στα επιπλέον στυλό.
        </p>

        {/* SVG ΣΧΗΜΑ: ΣΥΓΚΡΙΣΗ ΤΩΝ ΔΥΟ ΑΓΟΡΩΝ & ΔΙΑΦΟΡΑ ΣΤΑ ΣΤΥΛΟ */}
        <div className="flex justify-center p-3 bg-white/90 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="490" height="205" viewBox="0 0 490 205" className="select-none font-sans mx-auto block">
            {/* 1η ΑΓΟΡΑ */}
            <g transform="translate(15, 12)">
              <rect x="0" y="0" width="460" height="68" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="14" y="20" fontSize="11" fontWeight="bold" fill="#0f172a">1η Αγορά:</text>
              
              {/* 6 Τετράδια */}
              <g transform="translate(85, 8)">
                <rect x="0" y="0" width="130" height="48" rx="6" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
                <text x="65" y="22" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#1d4ed8">6 Τετράδια</text>
                <text x="65" y="38" fontSize="9.5" textAnchor="middle" fill="#2563eb">(σταθερά)</text>
              </g>

              <text x="225" y="38" fontSize="14" fontWeight="black" fill="#64748b">＋</text>

              {/* 4 Στυλό */}
              <g transform="translate(245, 8)">
                <rect x="0" y="0" width="95" height="48" rx="6" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1.5" />
                <text x="47.5" y="22" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#15803d">4 Στυλό</text>
                <text x="47.5" y="38" fontSize="9.5" textAnchor="middle" fill="#16a34a">(4 · 3€ = 12€)</text>
              </g>

              <text x="350" y="38" fontSize="14" fontWeight="black" fill="#64748b">＝</text>

              {/* Σύνολο 24€ */}
              <g transform="translate(370, 14)">
                <rect x="0" y="0" width="75" height="36" rx="6" fill="#0f172a" />
                <text x="37.5" y="23" fontSize="13" fontWeight="900" textAnchor="middle" fill="#ffffff">24€</text>
              </g>
            </g>

            {/* 2η ΑΓΟΡΑ */}
            <g transform="translate(15, 88)">
              <rect x="0" y="0" width="460" height="68" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="14" y="20" fontSize="11" fontWeight="bold" fill="#0f172a">2η Αγορά:</text>
              
              {/* 6 Τετράδια */}
              <g transform="translate(85, 8)">
                <rect x="0" y="0" width="130" height="48" rx="6" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
                <text x="65" y="22" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#1d4ed8">6 Τετράδια</text>
                <text x="65" y="38" fontSize="9.5" textAnchor="middle" fill="#2563eb">(σταθερά)</text>
              </g>

              <text x="225" y="38" fontSize="14" fontWeight="black" fill="#64748b">＋</text>

              {/* 7 Στυλό (4 + 3 επιπλέον) */}
              <g transform="translate(245, 8)">
                <rect x="0" y="0" width="95" height="48" rx="6" fill="#fef2f2" stroke="#ef4444" strokeWidth="1.8" />
                <text x="47.5" y="20" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#b91c1c">7 Στυλό</text>
                <text x="47.5" y="38" fontSize="9.5" fontWeight="bold" textAnchor="middle" fill="#dc2626">(＋3 στυλό)</text>
              </g>

              <text x="350" y="38" fontSize="14" fontWeight="black" fill="#64748b">＝</text>

              {/* Σύνολο 33€ */}
              <g transform="translate(370, 14)">
                <rect x="0" y="0" width="75" height="36" rx="6" fill="#0f172a" />
                <text x="37.5" y="23" fontSize="13" fontWeight="900" textAnchor="middle" fill="#ffffff">33€</text>
              </g>
            </g>

            {/* ΚΑΤΩ ΕΠΙΣΗΜΑΝΣΗ ΔΙΑΦΟΡΑΣ */}
            <g transform="translate(15, 164)">
              <rect x="0" y="0" width="460" height="30" rx="8" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="1.2" />
              <text x="230" y="19" fontSize="11" fontWeight="black" textAnchor="middle" fill="#065f46">
                Διαφορά: 3 επιπλέον στυλό ＝ 33€ － 24€ ＝ 9€ ➔ 1 στυλό ＝ 3€
              </text>
            </g>
          </svg>
        </div>

        {/* ΑΝΑΛΥΤΙΚΑ ΒΗΜΑΤΑ ΕΠΙΛΥΣΗΣ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-3">
          {/* Βήμα 1: Εύρεση τιμής στυλό */}
          <div className="space-y-1">
            <div className="font-sans font-bold text-slate-900 border-b border-slate-200 pb-1">
              1. Υπολογισμός του κόστους για ένα στυλό:
            </div>
            <p className="text-slate-700">
              Η δεύτερη αγορά έχει ακριβώς τα ίδια τετράδια αλλά περισσότερα στυλό:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
              <div>• Επιπλέον στυλό: 7 － 4 ＝ <strong>3 στυλό</strong></div>
              <div>• Επιπλέον κόστος: 33€ － 24€ ＝ <strong>9€</strong></div>
              <div className="pt-1 border-t border-slate-200 flex items-center gap-1.5 flex-wrap">
                <span>• Κόστος για 1 στυλό ＝</span>
                <Fraction num="9" den="3" />
                <span>＝ <strong className="text-blue-700">3€</strong></span>
              </div>
            </div>
          </div>

          {/* Βήμα 2: Εύρεση τιμής τετραδίου */}
          <div className="space-y-1 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-slate-900 border-b border-slate-200 pb-1">
              2. Υπολογισμός του κόστους για ένα τετράδιο:
            </div>
            <p className="text-slate-700">
              Αντικαθιστούμε την τιμή του στυλό στην 1η αγορά (6 τετράδια ＋ 4 στυλό ＝ 24€):
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
              <div>• Κόστος των 4 στυλό: 4 · 3€ ＝ <strong>12€</strong></div>
              <div>• Κόστος των 6 τετραδίων: 24€ － 12€ ＝ <strong>12€</strong></div>
              <div className="pt-1 border-t border-slate-200 flex items-center gap-1.5 flex-wrap">
                <span>• Κόστος για 1 τετράδιο ＝</span>
                <Fraction num="12" den="6" />
                <span>＝ <strong className="text-emerald-700 text-base">2€</strong></span>
              </div>
            </div>
          </div>

          {/* Βήμα 3: Επαλήθευση */}
          <div className="space-y-1 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-slate-900">
              3. Επαλήθευση στη 2η αγορά:
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-0.5">
              <div>6 τετράδια · 2€ ＋ 7 στυλό · 3€ ＝ 12€ ＋ 21€ ＝ <strong>33€</strong> (επαληθεύεται)</div>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, το ένα τετράδιο κοστίζει <strong>2€</strong>.
        </p>
      </div>
    )
  },
  {
    id: 12,
    group: 'ΟΜΑΔΑ Β (5 επιλογες)',
    prompt: 'Ο πληθυσμός των μελισσών σε μια πρότυπη κυψέλη αυξάνεται κατά 20% κάθε μήνα. Αν σήμερα η κυψέλη έχει 5.000 μέλισσες, πόσες μέλισσες θα έχει μετά από ακριβώς δύο μήνες;',
    options: ['6.000', '7.000', '7.200', '7.500', '8.000'],
    correct: '7.200',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Η αύξηση κατά <strong>20%</strong> υπολογίζεται <strong>διαδοχικά</strong> σε κάθε μήνα επί του πληθυσμού που έχει διαμορφωθεί (σύνθετη αύξηση):
        </p>

        {/* SVG ΣΧΗΜΑ: ΔΙΑΔΟΧΙΚΗ ΑΥΞΗΣΗ ΠΛΗΘΥΣΜΟΥ ΣΕ 2 ΜΗΝΕΣ */}
        <div className="flex justify-center p-3 bg-white/90 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="530" height="180" viewBox="0 0 530 180" className="select-none font-sans mx-auto block">
            <defs>
              <marker id="arr-growth" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#16a34a" />
              </marker>
            </defs>

            {/* 1. ΑΡΧΙΚΟΣ ΠΛΗΘΥΣΜΟΣ (ΣΗΜΕΡΑ: x: 15 έως 125) */}
            <g transform="translate(15, 65)">
              <rect x="0" y="0" width="110" height="75" rx="10" fill="#f8fafc" stroke="#64748b" strokeWidth="1.8" />
              <text x="55" y="24" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#475569">Σήμερα</text>
              <text x="55" y="50" fontSize="15" fontWeight="900" textAnchor="middle" fill="#0f172a" fontFamily="monospace">5.000</text>
              <text x="55" y="64" fontSize="9.5" textAnchor="middle" fill="#64748b">μέλισσες</text>
            </g>

            {/* ΤΟΞΟ 1ου ΜΗΝΑ (+20% -> +1.000) */}
            <g transform="translate(125, 0)">
              <path d="M 12 95 C 28 50, 48 50, 64 95" fill="none" stroke="#2563eb" strokeWidth="2" markerEnd="url(#arr-growth)" />
              <rect x="9" y="26" width="60" height="24" rx="6" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1" />
              <text x="39" y="38" fontSize="9.5" fontWeight="black" textAnchor="middle" fill="#1d4ed8">＋20%</text>
              <text x="39" y="47" fontSize="8.5" fontWeight="bold" textAnchor="middle" fill="#2563eb">(＋1.000)</text>
              <text x="39" y="8" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#64748b">1ος Μήνας</text>
            </g>

            {/* 2. ΠΛΗΘΥΣΜΟΣ ΣΤΟ ΤΕΛΟΣ ΤΟΥ 1ου ΜΗΝΑ (x: 205 έως 315) */}
            <g transform="translate(205, 65)">
              <rect x="0" y="0" width="110" height="75" rx="10" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.8" />
              <text x="55" y="24" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#1d4ed8">Μετά 1 μήνα</text>
              <text x="55" y="50" fontSize="15" fontWeight="900" textAnchor="middle" fill="#1e40af" fontFamily="monospace">6.000</text>
              <text x="55" y="64" fontSize="9.5" textAnchor="middle" fill="#2563eb">μέλισσες</text>
            </g>

            {/* ΤΟΞΟ 2ου ΜΗΝΑ (+20% επί των 6.000 -> +1.200) */}
            <g transform="translate(315, 0)">
              <path d="M 12 95 C 28 50, 48 50, 64 95" fill="none" stroke="#16a34a" strokeWidth="2" markerEnd="url(#arr-growth)" />
              <rect x="9" y="26" width="60" height="24" rx="6" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1" />
              <text x="39" y="38" fontSize="9.5" fontWeight="black" textAnchor="middle" fill="#15803d">＋20%</text>
              <text x="39" y="47" fontSize="8.5" fontWeight="bold" textAnchor="middle" fill="#16a34a">(＋1.200)</text>
              <text x="39" y="8" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#64748b">2ος Μήνας</text>
            </g>

            {/* 3. ΤΕΛΙΚΟΣ ΠΛΗΘΥΣΜΟΣ (ΜΕΤΑ ΑΠΟ 2 ΜΗΝΕΣ: x: 395 έως 515, άνετα μέσα στο viewBox 530) */}
            <g transform="translate(395, 60)">
              <rect x="0" y="0" width="120" height="85" rx="12" fill="#dcfce7" stroke="#16a34a" strokeWidth="2.2" />
              <text x="60" y="24" fontSize="11" fontWeight="black" textAnchor="middle" fill="#166534">Μετά 2 μήνες</text>
              <text x="60" y="52" fontSize="16" fontWeight="900" textAnchor="middle" fill="#15803d" fontFamily="monospace">7.200 ⭐</text>
              <text x="60" y="69" fontSize="9.5" fontWeight="bold" textAnchor="middle" fill="#166534">μέλισσες</text>
            </g>
          </svg>
        </div>

        {/* ΑΝΑΛΥΤΙΚΟΙ ΤΡΟΠΟΙ ΕΠΙΛΥΣΗΣ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-3">
          {/* 1ος Τρόπος */}
          <div className="space-y-1.5">
            <div className="font-sans font-bold text-blue-900 border-b border-slate-200 pb-1">
              🔷 1ος Τρόπος (Βήμα προς βήμα ανά μήνα με κλάσματα)
            </div>
            <p className="text-slate-700">
              Η αύξηση κατά 20% αντιστοιχεί στο ένα πέμπτο: <span className="font-mono font-bold">20% ＝ <Fraction num="20" den="100" /> ＝ <Fraction num="1" den="5" /></span>.
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
              <div>
                <div className="font-sans font-bold text-slate-900">• 1ος Μήνας:</div>
                <div className="pl-3 space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span>Αύξηση ＝</span>
                    <Fraction num="1" den="5" />
                    <span>· 5.000 ＝ <strong>1.000 μέλισσες</strong></span>
                  </div>
                  <div>Πληθυσμός στο τέλος του 1ου μήνα ＝ 5.000 ＋ 1.000 ＝ <strong>6.000 μέλισσες</strong></div>
                </div>
              </div>

              <div className="pt-1.5 border-t border-slate-200">
                <div className="font-sans font-bold text-slate-900">• 2ος Μήνας:</div>
                <div className="pl-3 space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span>Αύξηση ＝</span>
                    <Fraction num="1" den="5" />
                    <span>· 6.000 ＝ <strong>1.200 μέλισσες</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                    <span>Τελικός πληθυσμός ＝ 6.000 ＋ 1.200 ＝</span>
                    <strong className="text-emerald-700 text-base">7.200 μέλισσες</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2ος Τρόπος */}
          <div className="space-y-1.5 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-blue-900 border-b border-slate-200 pb-1">
              🔷 2ος Τρόπος (Με συντελεστή μεταβολής)
            </div>
            <p className="text-slate-700">
              Κάθε μήνα ο πληθυσμός γίνεται το 120% του προηγούμενου (<span className="font-mono font-bold">1 ＋ 0,20 ＝ 1,20</span> ή <span className="font-mono font-bold"><Fraction num="6" den="5" /></span>):
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span>Τελικός Πληθυσμός ＝ 5.000 ·</span>
                <Fraction num="6" den="5" />
                <span>·</span>
                <Fraction num="6" den="5" />
                <span>＝ 5.000 ·</span>
                <Fraction num="36" den="25" />
              </div>
              <div className="flex items-center gap-2 flex-wrap pt-0.5">
                <span>＝ 200 · 36 ＝</span>
                <strong className="text-emerald-700 text-base">7.200 μέλισσες</strong>
              </div>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, μετά από δύο μήνες η κυψέλη θα έχει <strong>7.200 μέλισσες</strong>.
        </p>
      </div>
    )
  },
  {
    id: 13,
    group: 'ΟΜΑΔΑ Β (5 επιλογες)',
    prompt: 'Έχουμε τρία ίδια ποτήρια. Το 1ο ποτήρι είναι κατά 3/4 γεμάτο με νερό και το 2ο είναι κατά 1/2 γεμάτο με νερό. Αδειάζουμε όλο το νερό που περιείχε αρχικά το 3ο ποτήρι μέσα στο 1ο και στο 2ο ποτήρι, με αποτέλεσμα αυτά τα δύο να γεμίσουν τελείως. Τι μέρος του 3ου ποτηριού ήταν γεμάτο με νερό αρχικά;',
    options: [
      <Fraction num="1" den="4" />,
      <Fraction num="3" den="8" />,
      <Fraction num="1" den="2" />,
      <Fraction num="3" den="4" />,
      <Fraction num="7" den="8" />
    ],
    correct: '3/4',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Επειδή τα ποτήρια είναι <strong>πανομοιότυπα</strong>, εκφράζουμε τη χωρητικότητά τους σε <strong>τέταρτα (<Fraction num="1" den="4" />)</strong> για να υπολογίσουμε πόσο νερό έλειπε από το 1ο και το 2ο ποτήρι ώστε να γεμίσουν εντελώς.
        </p>

        {/* SVG ΣΧΗΜΑ: ΤΑ 3 ΠΟΤΗΡΙΑ ΚΑΙ ΤΟ ΝΕΡΟ ΠΟΥ ΜΕΤΑΦΕΡΘΗΚΕ */}
        <div className="flex justify-center p-3 bg-white/90 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="510" height="210" viewBox="0 0 510 210" className="select-none font-sans mx-auto block">
            <defs>
              {/* Ενδιάμεσο τμήμα τετάρτου (κενό) */}
              <g id="glass-quarter-empty">
                <rect x="0" y="0" width="70" height="25" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
              </g>

              {/* Ενδιάμεσο τμήμα τετάρτου (νερό) */}
              <g id="glass-quarter-water">
                <rect x="0" y="0" width="70" height="25" fill="#38bdf8" fillOpacity="0.85" stroke="#cbd5e1" strokeWidth="1" />
                <text x="35" y="16" fontSize="9.5" fontWeight="bold" textAnchor="middle" fill="#0369a1" fontFamily="monospace">1/4</text>
              </g>

              {/* Κάτω τμήμα νερού που αγκαλιάζει ακριβώς τη στρογγυλεμένη βάση */}
              <g id="glass-bottom-water">
                <path d="M 0 0 L 70 0 L 70 20 Q 70 25 65 25 L 5 25 Q 0 25 0 20 Z" fill="#38bdf8" fillOpacity="0.85" stroke="#cbd5e1" strokeWidth="1" />
                <text x="35" y="16" fontSize="9.5" fontWeight="bold" textAnchor="middle" fill="#0369a1" fontFamily="monospace">1/4</text>
              </g>

              {/* Τμήμα που λείπει και χρειάζεται συμπλήρωση */}
              <g id="glass-quarter-needed">
                <rect x="0" y="0" width="70" height="25" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="3 2" />
                <text x="35" y="16" fontSize="9.5" fontWeight="black" textAnchor="middle" fill="#b45309" fontFamily="monospace">+1/4</text>
              </g>

              <marker id="transfer-arr" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#0284c7" />
              </marker>
            </defs>

            {/* 1ο ΠΟΤΗΡΙ */}
            <g transform="translate(25, 15)">
              <text x="35" y="12" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0f172a">1ο Ποτήρι</text>
              <g transform="translate(0, 20)">
                {/* 1ο τέταρτο (χρειάζεται) */}
                <use href="#glass-quarter-needed" x="0" y="0" />
                {/* 3 τέταρτα αρχικό νερό */}
                <use href="#glass-quarter-water" x="0" y="25" />
                <use href="#glass-quarter-water" x="0" y="50" />
                <use href="#glass-bottom-water" x="0" y="75" />
                {/* Περίγραμμα ποτηριού (ύψος ακριβώς 100px) */}
                <path d="M 0 0 L 0 95 Q 0 100 5 100 L 65 100 Q 70 100 70 95 L 70 0" fill="none" stroke="#334155" strokeWidth="2" />
              </g>
              <rect x="-5" y="130" width="80" height="22" rx="6" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1" />
              <text x="35" y="145" fontSize="10" fontWeight="black" textAnchor="middle" fill="#1d4ed8">Λείπει: 1/4</text>
            </g>

            {/* ΣΥΜΒΟΛΟ ΠΡΟΣΘΕΣΗΣ */}
            <g transform="translate(125, 80)">
              <text x="0" y="0" fontSize="22" fontWeight="black" textAnchor="middle" fill="#64748b">＋</text>
            </g>

            {/* 2ο ΠΟΤΗΡΙ */}
            <g transform="translate(155, 15)">
              <text x="35" y="12" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0f172a">2ο Ποτήρι</text>
              <g transform="translate(0, 20)">
                {/* 2 τέταρτα χρειάζονται */}
                <use href="#glass-quarter-needed" x="0" y="0" />
                <use href="#glass-quarter-needed" x="0" y="25" />
                {/* 2 τέταρτα (1/2) αρχικό νερό */}
                <use href="#glass-quarter-water" x="0" y="50" />
                <use href="#glass-bottom-water" x="0" y="75" />
                {/* Περίγραμμα ποτηριού */}
                <path d="M 0 0 L 0 95 Q 0 100 5 100 L 65 100 Q 70 100 70 95 L 70 0" fill="none" stroke="#334155" strokeWidth="2" />
              </g>
              <rect x="-5" y="130" width="80" height="22" rx="6" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1" />
              <text x="35" y="145" fontSize="10" fontWeight="black" textAnchor="middle" fill="#1d4ed8">Λείπουν: 2/4</text>
            </g>

            {/* ΒΕΛΟΣ ΜΕΤΑΦΟΡΑΣ */}
            <g transform="translate(255, 75)">
              <line x1="45" y1="0" x2="5" y2="0" stroke="#0284c7" strokeWidth="2.2" markerEnd="url(#transfer-arr)" />
              <text x="25" y="-10" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#0284c7">Έδωσε</text>
              <text x="25" y="18" fontSize="9.5" fontWeight="black" textAnchor="middle" fill="#0369a1">1/4 + 2/4</text>
            </g>

            {/* 3ο ΠΟΤΗΡΙ (ΑΡΧΙΚΟ ΠΕΡΙΕΧΟΜΕΝΟ) */}
            <g transform="translate(335, 15)">
              <text x="45" y="12" fontSize="11" fontWeight="black" textAnchor="middle" fill="#15803d">3ο Ποτήρι (Αρχικά)</text>
              <g transform="translate(10, 20)">
                {/* 1 κενό τέταρτο πάνω */}
                <use href="#glass-quarter-empty" x="0" y="0" />
                {/* 3 γεμάτα τέταρτα */}
                <use href="#glass-quarter-water" x="0" y="25" />
                <use href="#glass-quarter-water" x="0" y="50" />
                <use href="#glass-bottom-water" x="0" y="75" />
                {/* Περίγραμμα ποτηριού */}
                <path d="M 0 0 L 0 95 Q 0 100 5 100 L 65 100 Q 70 100 70 95 L 70 0" fill="none" stroke="#16a34a" strokeWidth="2.4" />
              </g>

              {/* Badge αρχικής ποσότητας 3ου ποτηριού */}
              <rect x="-10" y="128" width="110" height="26" rx="8" fill="#dcfce7" stroke="#86efac" strokeWidth="1.2" />
              <text x="45" y="145" fontSize="11" fontWeight="900" textAnchor="middle" fill="#166534">
                Αρχικά: 3/4 ⭐
              </text>
            </g>

            {/* ΚΑΤΩ ΕΠΕΞΗΓΗΜΑΤΙΚΟ ΠΛΑΙΣΙΟ */}
            <g transform="translate(25, 175)">
              <rect x="0" y="0" width="455" height="26" rx="8" fill="#0f172a" />
              <text x="227.5" y="17" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#ffffff">
                Συνολικό νερό που έδωσε το 3ο ποτήρι: 1/4 (στο 1ο) ＋ 2/4 (στο 2ο) ＝ 3/4
              </text>
            </g>
          </svg>
        </div>

        {/* ΑΝΑΛΥΤΙΚΑ ΒΗΜΑΤΑ ΕΠΙΛΥΣΗΣ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-3">
          {/* Βήμα 1: Πόσο νερό λείπει από το 1ο και το 2ο */}
          <div className="space-y-1">
            <div className="font-sans font-bold text-slate-900 border-b border-slate-200 pb-1">
              1. Υπολογισμός του κενού χώρου στο 1ο και στο 2ο ποτήρι:
            </div>
            <p className="text-slate-700">
              Για να γεμίσει πλήρως ένα ποτήρι, το περιεχόμενό του πρέπει να φτάσει τη μονάδα (1 ολόκληρο ποτήρι ή <Fraction num="4" den="4" />):
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>• Στο 1ο ποτήρι έλειπαν: 1 －</span>
                <Fraction num="3" den="4" />
                <span>＝</span>
                <strong className="text-blue-700"><Fraction num="1" den="4" /></strong>
                <span>του ποτηριού.</span>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-200">
                <span>• Στο 2ο ποτήρι έλειπαν: 1 －</span>
                <Fraction num="1" den="2" />
                <span>＝</span>
                <Fraction num="1" den="2" />
                <span>＝</span>
                <strong className="text-blue-700"><Fraction num="2" den="4" /></strong>
                <span>του ποτηριού.</span>
              </div>
            </div>
          </div>

          {/* Βήμα 2: Άθροισμα νερού που μεταφέρθηκε */}
          <div className="space-y-1 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-slate-900 border-b border-slate-200 pb-1">
              2. Συνολική ποσότητα νερού που περιείχε αρχικά το 3ο ποτήρι:
            </div>
            <p className="text-slate-700">
              Εφόσον αδειάσαμε <strong>όλο το νερό</strong> του 3ου ποτηριού για να συμπληρώσουμε τα κενά των άλλων δύο, το αρχικό του περιεχόμενο ισούται ακριβώς με το άθροισμα των δύο ποσοτήτων:
            </p>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span>Αρχικό νερό 3ου ＝</span>
                <Fraction num="1" den="4" />
                <span>＋</span>
                <Fraction num="2" den="4" />
                <span>＝</span>
                <Fraction num="1 ＋ 2" den="4" />
                <span>＝</span>
                <strong className="text-emerald-700 text-base"><Fraction num="3" den="4" /></strong>
              </div>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, το 3ο ποτήρι ήταν αρχικά γεμάτο κατά τα <strong><Fraction num="3" den="4" /></strong> του όγκου του.
        </p>
      </div>
    )
  },
  {
    id: 14,
    group: 'ΟΜΑΔΑ Β (5 επιλογες)',
    prompt: 'Τα παιδιά του τμήματος ΣΤ1 ενός σχολείου χωρίστηκαν σε εξάδες για ένα παιχνίδι και περίσσεψαν 4 παιδιά. Την ίδια ημέρα, όταν όλα τα παιδιά των τμημάτων ΣΤ1 και ΣΤ2 μαζί χωρίστηκαν σε εξάδες, δεν περίσσεψε κανένα παιδί. Αν χωρίσουμε μόνο τα παιδιά του τμήματος ΣΤ2 σε εξάδες, πόσα παιδιά θα περισσέψουν;',
    options: ['1 παιδί', '2 παιδιά', '3 παιδιά', '4 παιδιά', 'Κανένα παιδί'],
    correct: '2 παιδιά',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Εξετάζουμε τη διαίρεση με το <strong>6</strong> (ευκλείδεια διαίρεση) και το <strong>υπόλοιπο</strong> (περίσσευμα) παιδιών σε κάθε περίπτωση:
        </p>

        {/* SVG ΣΧΗΜΑ: ΣΥΜΠΛΗΡΩΣΗ ΕΞΑΔΑΣ ΑΠΟ ΤΑ ΥΠΟΛΟΙΠΑ ΤΩΝ ΔΥΟ ΤΜΗΜΑΤΩΝ */}
        <div className="flex justify-center p-3 bg-white/90 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="490" height="205" viewBox="0 0 490 205" className="select-none font-sans mx-auto block">
            {/* 1. ΤΜΗΜΑ ΣΤ1 */}
            <g transform="translate(15, 12)">
              <rect x="0" y="0" width="460" height="52" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="14" y="30" fontSize="11" fontWeight="bold" fill="#0369a1">Τμήμα ΣΤ1:</text>
              
              {/* Πλήρεις Εξάδες */}
              <g transform="translate(95, 10)">
                <rect x="0" y="0" width="135" height="32" rx="6" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.4" />
                <text x="67.5" y="20" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#1d4ed8">Πλήρεις Εξάδες</text>
              </g>

              <text x="242" y="30" fontSize="13" fontWeight="bold" fill="#64748b">＋</text>

              {/* Περίσσευμα 4 παιδιά */}
              <g transform="translate(262, 10)">
                <rect x="0" y="0" width="180" height="32" rx="6" fill="#fee2e2" stroke="#ef4444" strokeWidth="1.6" />
                <text x="90" y="20" fontSize="11" fontWeight="black" textAnchor="middle" fill="#dc2626">
                  Περισσεύουν: 4 παιδιά
                </text>
              </g>
            </g>

            {/* 2. ΤΜΗΜΑ ΣΤ2 */}
            <g transform="translate(15, 72)">
              <rect x="0" y="0" width="460" height="52" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="14" y="30" fontSize="11" fontWeight="bold" fill="#15803d">Τμήμα ΣΤ2:</text>
              
              {/* Πλήρεις Εξάδες */}
              <g transform="translate(95, 10)">
                <rect x="0" y="0" width="135" height="32" rx="6" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1.4" />
                <text x="67.5" y="20" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#15803d">Πλήρεις Εξάδες</text>
              </g>

              <text x="242" y="30" fontSize="13" fontWeight="bold" fill="#64748b">＋</text>

              {/* Ζητούμενο περίσσευμα (2 παιδιά) */}
              <g transform="translate(262, 10)">
                <rect x="0" y="0" width="180" height="32" rx="6" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" strokeDasharray="3 2" />
                <text x="90" y="20" fontSize="11" fontWeight="black" textAnchor="middle" fill="#15803d">
                  Περισσεύουν: 2 παιδιά ⭐
                </text>
              </g>
            </g>

            {/* 3. ΣΥΝΟΛΟ ΣΤ1 + ΣΤ2 (ΣΥΜΠΛΗΡΩΣΗ ΑΚΕΡΑΙΑΣ ΕΞΑΔΑΣ) */}
            <g transform="translate(15, 134)">
              <rect x="0" y="0" width="460" height="58" rx="10" fill="#0f172a" />
              <g transform="translate(15, 14)">
                <text x="0" y="16" fontSize="11" fontWeight="bold" fill="#94a3b8">ΣΤ1 ＋ ΣΤ2 μαζί:</text>
                <rect x="110" y="-3" width="125" height="26" rx="5" fill="#1e293b" />
                <text x="172.5" y="14" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#cbd5e1">Όλες οι εξάδες</text>
                
                <text x="245" y="15" fontSize="12" fontWeight="bold" fill="#ffffff">＋</text>

                {/* Ένωση υπολοίπων (4 + 2 = 6) */}
                <rect x="260" y="-3" width="170" height="26" rx="6" fill="#16a34a" />
                <text x="345" y="15" fontSize="10.5" fontWeight="black" textAnchor="middle" fill="#ffffff">
                  (4 ＋ 2 ＝ 6 ➔ 1 νέα εξάδα!)
                </text>
                <text x="215" y="34" fontSize="9.5" textAnchor="middle" fill="#86efac">
                  Υπόλοιπο ＝ 0 (δεν περισσεύει κανένα παιδί)
                </text>
              </g>
            </g>
          </svg>
        </div>

        {/* ΑΝΑΛΥΤΙΚΟΙ ΤΡΟΠΟΙ ΕΠΙΛΥΣΗΣ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-3">
          {/* 1ος Τρόπος: Με ευκλείδεια διαίρεση */}
          <div className="space-y-1.5">
            <div className="font-sans font-bold text-blue-900 border-b border-slate-200 pb-1">
              🔷 1ος Τρόπος (Συμπλήρωση ακέραιης εξάδας)
            </div>
            <p className="text-slate-700">
              Οι πλήρεις εξάδες δεν αφήνουν περίσσευμα. Το τελικό περίσσευμα προκύπτει αποκλειστικά από τα παιδιά που περισσεύουν σε κάθε τμήμα:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
              <div>• Από το ΣΤ1 περισσεύουν <strong>4 παιδιά</strong>.</div>
              <div>• Για να σχηματιστεί <strong>1 νέα πλήρης εξάδα</strong> (ώστε να μην περισσέψει κανένα παιδί), λείπουν:</div>
              <div className="pl-3 font-bold text-slate-800">6 － 4 ＝ 2 παιδιά</div>
              <div className="pt-1 border-t border-slate-200 text-slate-700 font-sans text-xs">
                Αυτά τα 2 παιδιά πρέπει υποχρεωτικά να προέρχονται από το περίσσευμα του τμήματος ΣΤ2.
              </div>
              <div className="pt-0.5 text-emerald-800 font-bold">
                Άρα, αν χωρίσουμε μόνο το ΣΤ2 σε εξάδες, θα περισσέψουν <span className="text-base text-emerald-700 font-black">2 παιδιά</span>.
              </div>
            </div>
          </div>

          {/* 2ος Τρόπος: Με αριθμητικό παράδειγμα */}
          <div className="space-y-1.5 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-blue-900 border-b border-slate-200 pb-1">
              🔷 2ος Τρόπος (Επαλήθευση με αριθμητικό παράδειγμα)
            </div>
            <p className="text-slate-700">
              Επιλέγουμε ένα ενδεικτικό πλήθος παιδιών για το ΣΤ1 που αφήνει υπόλοιπο 4 στη διαίρεση με το 6:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
              <div>• Έστω ότι το ΣΤ1 έχει <strong>16 παιδιά</strong> (αφού 16 ＝ 2 · 6 ＋ 4).</div>
              <div>• Το σύνολο ΣΤ1 ＋ ΣΤ2 πρέπει να διαιρείται ακριβώς με το 6, π.χ. να είναι <strong>30 παιδιά</strong>.</div>
              <div>• Τότε το ΣΤ2 έχει: 30 － 16 ＝ <strong>14 παιδιά</strong>.</div>
              <div className="pt-1 border-t border-slate-200 flex items-center gap-1.5 flex-wrap">
                <span>• Χωρίζουμε τα 14 παιδιά σε εξάδες: 14 : 6 ＝ 2 εξάδες και</span>
                <strong className="text-emerald-700 text-base">υπόλοιπο 2 παιδιά</strong>.
              </div>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, αν χωρίσουμε μόνο τα παιδιά του τμήματος ΣΤ2 σε εξάδες, θα περισσέψουν <strong>2 παιδιά</strong>.
        </p>
      </div>
    )
  },
  {
    id: 15,
    group: 'ΟΜΑΔΑ Β (5 επιλογες)',
    prompt: 'Ο Γιώργος μπορεί να βάψει έναν μεγάλο τοίχο σε 6 ώρες, ενώ ο Δημήτρης μπορεί να βάψει τον ίδιο ακριβώς τοίχο σε 3 ώρες. Αν εργαστούν μαζί και με τον ίδιο ρυθμό, σε πόσες ώρες θα ολοκληρώσουν το βάψιμο του τοίχου;',
    options: ['1,5 ώρα', '2 ώρες', '3 ώρες', '4 ώρες', '4,5 ώρες'],
    correct: '2 ώρες',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Αναλύουμε την απόδοση των δύο προσώπων ανά ώρα, χωρίζοντας τον τοίχο σε <strong>6 ίσα μέρη (<Fraction num="1" den="6" />)</strong>:
        </p>

        {/* SVG ΣΧΗΜΑ: Ο ΤΟΙΧΟΣ ΧΩΡΙΣΜΕΝΟΣ ΣΕ 6 ΕΚΤΑ ΚΑΙ Η ΚΟΙΝΗ ΕΡΓΑΣΙΑ */}
        <div className="flex justify-center p-3 bg-white/90 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="510" height="235" viewBox="0 0 510 235" className="select-none font-sans mx-auto block">
            {/* 1. ΕΡΓΑΣΙΑ ΣΤΗΝ 1η ΩΡΑ */}
            <g transform="translate(15, 12)">
              <text x="0" y="14" fontSize="11.5" fontWeight="bold" fill="#0f172a">
                1. Τι βάφουν μαζί στην 1η ώρα:
              </text>

              {/* Τοίχος χωρισμένος σε 6 μέρη (πλάτος 426px) */}
              <g transform="translate(0, 24)">
                {/* 1/6 από Γιώργο */}
                <rect x="0" y="0" width="70" height="42" rx="4" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.6" />
                <text x="35" y="18" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#1d4ed8">Γιώργος</text>
                <text x="35" y="32" fontSize="10.5" fontWeight="black" textAnchor="middle" fill="#1e40af" fontFamily="monospace">1/6</text>

                {/* 2/6 (1/3) από Δημήτρη */}
                <rect x="73" y="0" width="140" height="42" rx="4" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1.6" />
                <text x="143" y="18" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#15803d">Δημήτρης (1/3 ＝ 2/6)</text>
                <text x="143" y="32" fontSize="10.5" fontWeight="black" textAnchor="middle" fill="#166534" fontFamily="monospace">2/6</text>

                {/* Τα υπόλοιπα 3/6 άβαφα */}
                <rect x="216" y="0" width="210" height="42" rx="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.4" strokeDasharray="3 2" />
                <text x="321" y="26" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#94a3b8">Υπόλοιπο (3/6 ＝ 1/2)</text>
              </g>

              {/* Επεξήγηση 1ης ώρας κεντραρισμένη σε ολόκληρο το πλάτος του τοίχου */}
              <text x="213" y="82" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#0369a1">
                Μαζί σε 1 ώρα: 1/6 ＋ 2/6 ＝ 3/6 ＝ Μισός τοίχος (1/2)
              </text>
            </g>

            {/* ΔΙΑΧΩΡΙΣΤΙΚΗ ΓΡΑΜΜΗ */}
            <line x1="15" y1="106" x2="495" y2="106" stroke="#e2e8f0" strokeWidth="1.2" />

            {/* 2. ΣΥΝΟΛΙΚΟΣ ΧΡΟΝΟΣ ΓΙΑ ΟΛΟΚΛΗΡΟ ΤΟΝ ΤΟΙΧΟ */}
            <g transform="translate(15, 118)">
              <text x="0" y="14" fontSize="11.5" fontWeight="bold" fill="#0f172a">
                2. Ολοκλήρωση σε 2 ώρες (2 μισά ＝ 1 ολόκληρος τοίχος):
              </text>

              <g transform="translate(0, 24)">
                {/* 1η ώρα: Μισός τοίχος */}
                <rect x="0" y="0" width="210" height="38" rx="6" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.8" />
                <text x="105" y="16" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#1d4ed8">1η Ώρα</text>
                <text x="105" y="30" fontSize="11" fontWeight="black" textAnchor="middle" fill="#1e40af">Βάφεται το 1/2 του τοίχου</text>

                {/* 2η ώρα: Άλλος μισός τοίχος */}
                <rect x="216" y="0" width="210" height="38" rx="6" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" />
                <text x="321" y="16" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#15803d">2η Ώρα</text>
                <text x="321" y="30" fontSize="11" fontWeight="black" textAnchor="middle" fill="#166534">Βάφεται το άλλο 1/2 του τοίχου</text>
              </g>

              {/* Τελικό Badge με άνετο περιθώριο και πλήρη ορατότητα */}
              <g transform="translate(123, 72)">
                <rect x="0" y="0" width="180" height="26" rx="13" fill="#16a34a" />
                <text x="90" y="17" fontSize="11.5" fontWeight="black" textAnchor="middle" fill="#ffffff">
                  Συνολικός Χρόνος: 2 ώρες ⭐
                </text>
              </g>
            </g>
          </svg>
        </div>
        {/* ΑΝΑΛΥΤΙΚΑ ΒΗΜΑΤΑ ΕΠΙΛΥΣΗΣ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-3">
          {/* Βήμα 1: Ρυθμός εργασίας ανά ώρα */}
          <div className="space-y-1">
            <div className="font-sans font-bold text-slate-900 border-b border-slate-200 pb-1">
              1. Υπολογισμός του μέρους του τοίχου που βάφει ο καθένας σε 1 ώρα:
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>• Ο Γιώργος σε 6 ώρες βάφει όλο τον τοίχο ➔ σε 1 ώρα βάφει το:</span>
                <strong className="text-blue-700"><Fraction num="1" den="6" /></strong>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-200">
                <span>• Ο Δημήτρης σε 3 ώρες βάφει όλο τον τοίχο ➔ σε 1 ώρα βάφει το:</span>
                <strong className="text-emerald-700"><Fraction num="1" den="3" /></strong>
                <span>＝</span>
                <strong className="text-emerald-700"><Fraction num="2" den="6" /></strong>
              </div>
            </div>
          </div>

          {/* Βήμα 2: Κοινή εργασία σε 1 ώρα */}
          <div className="space-y-1 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-slate-900 border-b border-slate-200 pb-1">
              2. Υπολογισμός του μέρους που βάφουν μαζί σε 1 ώρα:
            </div>
            <p className="text-slate-700">
              Προσθέτουμε τις ωριαίες αποδόσεις τους κάνοντας τα κλάσματα ομώνυμα:
            </p>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span>Μαζί σε 1 ώρα ＝</span>
                <Fraction num="1" den="6" />
                <span>＋</span>
                <Fraction num="2" den="6" />
                <span>＝</span>
                <Fraction num="3" den="6" />
                <span>＝</span>
                <strong className="text-blue-700 text-base"><Fraction num="1" den="2" /></strong>
                <span>του τοίχου.</span>
              </div>
            </div>
          </div>

          {/* Βήμα 3: Συνολικός χρόνος */}
          <div className="space-y-1 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-slate-900 border-b border-slate-200 pb-1">
              3. Εύρεση του συνολικού χρόνου για ολόκληρο τον τοίχο:
            </div>
            <p className="text-slate-700">
              Αφού σε 1 ώρα βάφουν το μισό (<Fraction num="1" den="2" />) τοίχο, για ολόκληρο τον τοίχο (<Fraction num="2" den="2" />) θα χρειαστούν:
            </p>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span>Συνολικός Χρόνος ＝ 1 :</span>
                <Fraction num="1" den="2" />
                <span>＝ 1 · 2 ＝</span>
                <strong className="text-emerald-700 text-base font-black">2 ώρες</strong>
              </div>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, εργαζόμενοι μαζί θα ολοκληρώσουν το βάψιμο του τοίχου σε <strong>2 ώρες</strong>.
        </p>
      </div>
    )
  },
  {
    id: 16,
    group: 'ΟΜΑΔΑ Β (5 επιλογες)',
    prompt: 'Ένας σχολικός κήπος έχει σχήμα ορθογωνίου με διαστάσεις 15 μέτρα και 10 μέτρα. Στο εσωτερικό του κήπου και κατά μήκος όλων των πλευρών του κατασκευάζουμε έναν πλακόστρωτο διάδρομο σταθερού πλάτους 1 μέτρου. Ποιο είναι το συνολικό εμβαδόν του διαδρόμου αυτού;',
    options: ['25 τ.μ.', '44 τ.μ.', '46 τ.μ.', '50 τ.μ.', '104 τ.μ.'],
    correct: '46 τ.μ.',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Για να βρούμε το εμβαδόν του περιμετρικού διαδρόμου, αφαιρούμε το <strong>εμβαδόν του εσωτερικού ορθογωνίου</strong> από το <strong>συνολικό εμβαδόν του κήπου</strong>:
        </p>

        {/* SVG ΣΧΗΜΑ: Ο ΚΗΠΟΣ ΚΑΙ Ο ΠΕΡΙΜΕΤΡΙΚΟΣ ΔΙΑΔΡΟΜΟΣ ΠΛΑΤΟΥΣ 1μ. */}
        <div className="flex justify-center p-3 bg-white/90 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="510" height="230" viewBox="0 0 510 230" className="select-none font-sans mx-auto block">
            <defs>
              <marker id="dim-arrow-16" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#475569" />
              </marker>
            </defs>

            {/* ΚΥΡΙΩΣ ΣΧΗΜΑ ΟΡΘΟΓΩΝΙΟΥ (x: 55, y: 35) */}
            <g transform="translate(55, 35)">
              {/* 1. Εξωτερικό ορθογώνιο (Διάδρομος): 300px x 150px (αντιστοιχεί σε 15μ x 10μ) */}
              <rect x="0" y="0" width="300" height="150" rx="6" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />

              {/* 2. Εσωτερικό ορθογώνιο (Κήπος): περιθώριο 20px ολόγυρα (αντιστοιχεί σε 13μ x 8μ) */}
              <rect x="20" y="20" width="260" height="110" rx="4" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.8" />

              {/* Κείμενα εντός των επιφανειών */}
              <text x="150" y="68" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#15803d">
                Εσωτερικός Κήπος
              </text>
              <text x="150" y="86" fontSize="11" fontWeight="black" textAnchor="middle" fill="#166534" fontFamily="monospace">
                13 μ. · 8 μ. ＝ 104 τ.μ.
              </text>

              {/* Ενδείξεις πλάτους διαδρόμου (1 μ.) */}
              <text x="10" y="80" fontSize="9" fontWeight="black" textAnchor="middle" fill="#c2410c">1μ.</text>
              <text x="290" y="80" fontSize="9" fontWeight="black" textAnchor="middle" fill="#c2410c">1μ.</text>
              <text x="150" y="13" fontSize="9" fontWeight="black" textAnchor="middle" fill="#c2410c">1μ.</text>
              <text x="150" y="144" fontSize="9" fontWeight="black" textAnchor="middle" fill="#c2410c">1μ.</text>

              {/* Εσωτερικές διαστάσεις (13μ. & 8μ.) */}
              <line x1="20" y1="135" x2="280" y2="135" stroke="#16a34a" strokeWidth="1" strokeDasharray="2 2" />
              <text x="150" y="125" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#15803d">13 μ.</text>
              <line x1="25" y1="20" x2="25" y2="130" stroke="#16a34a" strokeWidth="1" strokeDasharray="2 2" />
              <text x="36" y="78" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#15803d">8 μ.</text>

              {/* Εξωτερικές διαστάσεις (Πάνω: 15μ. | Αριστερά: 10μ.) */}
              <line x1="0" y1="-14" x2="300" y2="-14" stroke="#475569" strokeWidth="1.5" markerStart="url(#dim-arrow-16)" markerEnd="url(#dim-arrow-16)" />
              <text x="150" y="-20" fontSize="11.5" fontWeight="black" textAnchor="middle" fill="#0f172a">15 μ. (Αρχικό Μήκος)</text>

              <line x1="-16" y1="0" x2="-16" y2="150" stroke="#475569" strokeWidth="1.5" markerStart="url(#dim-arrow-16)" markerEnd="url(#dim-arrow-16)" />
              <text x="-24" y="80" fontSize="11.5" fontWeight="black" textAnchor="middle" fill="#0f172a" transform="rotate(-90 -24 80)">10 μ. (Αρχικό Πλάτος)</text>
            </g>

            {/* ΥΠΟΜΝΗΜΑ & ΣΥΝΟΨΗ ΔΕΞΙΑ */}
            <g transform="translate(375, 42)">
              <rect x="0" y="0" width="125" height="135" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.2" />
              
              <rect x="10" y="12" width="16" height="16" rx="3" fill="#fed7aa" stroke="#ea580c" strokeWidth="1" />
              <text x="32" y="24" fontSize="9.5" fontWeight="bold" fill="#0f172a">Διάδρομος</text>

              <rect x="10" y="38" width="16" height="16" rx="3" fill="#dcfce7" stroke="#16a34a" strokeWidth="1" />
              <text x="32" y="50" fontSize="9.5" fontWeight="bold" fill="#0f172a">Κήπος (Εσωτ.)</text>

              <line x1="10" y1="66" x2="115" y2="66" stroke="#e2e8f0" strokeWidth="1" />

              <text x="62.5" y="82" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#64748b">Εμβαδόν Διαδρόμου:</text>
              <text x="62.5" y="99" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#475569">150 － 104 ＝</text>
              <rect x="15" y="106" width="95" height="20" rx="5" fill="#ea580c" />
              <text x="62.5" y="120" fontSize="11" fontWeight="black" textAnchor="middle" fill="#ffffff">46 τ.μ. ⭐</text>
            </g>
          </svg>
        </div>

        {/* ΑΝΑΛΥΤΙΚΑ ΒΗΜΑΤΑ ΕΠΙΛΥΣΗΣ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-3">
          {/* Βήμα 1: Συνολικό εμβαδόν */}
          <div className="space-y-1">
            <div className="font-sans font-bold text-slate-900 border-b border-slate-200 pb-1">
              1. Συνολικό εμβαδόν οικοπέδου (μαζί με τον διάδρομο):
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
              <div>Ε_συνολικό ＝ Μήκος · Πλάτος</div>
              <div className="pt-0.5">
                Ε_συνολικό ＝ 15 μ. · 10 μ. ＝ <strong className="text-blue-700 font-bold">150 τ.μ.</strong>
              </div>
            </div>
          </div>

          {/* Βήμα 2: Εσωτερικό εμβαδόν */}
          <div className="space-y-1 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-slate-900 border-b border-slate-200 pb-1">
              2. Διαστάσεις και εμβαδόν του εσωτερικού κήπου:
            </div>
            <p className="text-slate-700">
              Επειδή ο διάδρομος κατασκευάζεται κατά μήκος <strong>όλων των πλευρών</strong>, αφαιρείται πλάτος 1 μ. από την κάθε άκρη (δηλαδή 2 μ. συνολικά σε κάθε διάσταση):
            </p>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
              <div>• Νέο Μήκος ＝ 15 － 1 － 1 ＝ 15 － 2 ＝ <strong>13 μ.</strong></div>
              <div>• Νέο Πλάτος ＝ 10 － 1 － 1 ＝ 10 － 2 ＝ <strong>8 μ.</strong></div>
              <div className="pt-1 border-t border-slate-200">
                • Ε_εσωτερικό ＝ 13 μ. · 8 μ. ＝ <strong className="text-emerald-700 font-bold">104 τ.μ.</strong>
              </div>
            </div>
          </div>

          {/* Βήμα 3: Εμβαδόν διαδρόμου */}
          <div className="space-y-1 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-slate-900 border-b border-slate-200 pb-1">
              3. Υπολογισμός του εμβαδού του διαδρόμου:
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
              <div>Ε_διαδρόμου ＝ Ε_συνολικό － Ε_εσωτερικό</div>
              <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                <span>Ε_διαδρόμου ＝ 150 － 104 ＝</span>
                <strong className="text-orange-600 text-base font-black">46 τ.μ.</strong>
              </div>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, το συνολικό εμβαδόν του διαδρόμου είναι <strong>46 τ.μ.</strong>
        </p>
      </div>
    )
  },
  {
    id: 17,
    group: 'ΟΜΑΔΑ Β (5 επιλογες)',
    prompt: 'Σε μια έρευνα για τις προτιμήσεις διακοπών των μαθητών, το 70% των ερωτηθέντων απάντησε ότι προτιμά το βουνό. Από αυτούς που δεν προτιμούν το βουνό, οι μισοί απάντησαν ότι προτιμούν τη θάλασσα. Αν όσοι προτιμούν τη θάλασσα είναι 45 μαθητές, πόσοι ήταν συνολικά οι μαθητές που συμμετείχαν στην έρευνα;',
    options: ['150', '200', '250', '300', '450'],
    correct: '300',
    explain: 'Αυτοί που δεν προτιμούν το βουνό είναι 100% − 70% = 30%. Οι μισοί από αυτούς είναι το 15% του συνόλου. Το 15% αντιστοιχεί σε 45 μαθητές. Άρα το σύνολο (100%) είναι (45 : 15) · 100 = 3 · 100 = 300 μαθητές.'
  },
  {
    id: 18,
    group: 'ΟΜΑΔΑ Β (5 επιλογες)',
    prompt: 'Ένα αυτοκίνητο κατανάλωσε το 1/8 της βενζίνης της συνολικής χωρητικότητας του ρεζερβουάρ του για ένα ταξίδι. Πριν ξεκινήσει το ταξίδι, το ρεζερβουάρ περιείχε 30 λίτρα βενζίνης. Μετά το τέλος του ταξιδιού, το ρεζερβουάρ ήταν ακριβώς μισογεμάτο. Πόσα λίτρα βενζίνης χωράει συνολικά το ρεζερβουάρ του αυτοκινήτου;',
    options: ['40 λίτρα', '45 λίτρα', '48 λίτρα', '50 λίτρα', '60 λίτρα'],
    correct: '48 λίτρα',
    explain: 'Έστω C η συνολική χωρητικότητα. Αρχικά είχαμε 30 λίτρα, αφαιρέθηκε C/8 και έμεινε C/2. Άρα: 30 − C/8 = C/2 ➔ 30 = C/2 + C/8 = 4C/8 + C/8 = 5C/8 ➔ 5C = 240 ➔ C = 48 λίτρα.'
  },
  {
    id: 19,
    group: 'ΟΜΑΔΑ Β (5 επιλογες)',
    prompt: 'Ο μέσος όρος των βαθμών ενός μαθητή σε 4 διαγωνίσματα Μαθηματικών είναι 15. Αν στο 5ο διαγώνισμα γράψει βαθμό 20, ποιος θα είναι ο νέος μέσος όρος των βαθμών του στα 5 διαγωνίσματα;',
    options: ['15', '15,5', '16', '16,5', '17'],
    correct: '16',
    explain: 'Το άθροισμα των 4 πρώτων διαγωνισμάτων είναι 4 · 15 = 60. Με το 5ο διαγώνισμα το νέο άθροισμα γίνεται 60 + 20 = 80. Ο νέος μέσος όρος είναι 80 : 5 = 16.'
  },
  {
    id: 20,
    group: 'ΟΜΑΔΑ Β (5 επιλογες)',
    prompt: 'Σε μια ατελή διαίρεση φυσικών αριθμών, το πηλίκο είναι 8 και το υπόλοιπο είναι 5. Αν γνωρίζουμε ότι ο διαιρετέος είναι διψήφιος αριθμός, πόσες διαφορετικές δυνατές τιμές μπορεί να πάρει ο διαιρέτης της διαίρεσης αυτής;',
    options: ['4', '5', '6', '7', '8'],
    correct: '6',
    explain: 'Ισχύει Δ = 8 · δ + 5. Επειδή το υπόλοιπο είναι 5, πρέπει ο διαιρέτης δ > 5 (άρα δ ≥ 6). Επιπλέον ο Δ είναι διψήφιος, άρα Δ ≤ 99 ➔ 8δ + 5 ≤ 99 ➔ 8δ ≤ 94 ➔ δ ≤ 11. Οι δυνατές τιμές του διαιρέτη είναι δ ∈ {6, 7, 8, 9, 10, 11}, δηλαδή ακριβώς 6 διαφορετικές τιμές.'
  },
  {
    id: 21,
    group: 'ΟΜΑΔΑ Β (5 επιλογες)',
    prompt: 'Ένα ορθογώνιο και ένα ισόπλευρο τρίγωνο έχουν την ίδια περίμετρο. Το ορθογώνιο έχει μήκος 11 εκ. και πλάτος 7 εκ. Πόσο είναι το μήκος της κάθε πλευράς του ισόπλευρου τριγώνου;',
    options: ['9 εκ.', '10 εκ.', '12 εκ.', '14 εκ.', '18 εκ.'],
    correct: '12 εκ.',
    explain: 'Η περίμετρος του ορθογωνίου είναι 2 · (11 + 7) = 2 · 18 = 36 εκ. Αφού το τρίγωνο είναι ισόπλευρο και έχει την ίδια περίμετρο, η κάθε πλευρά του ισούται με 36 : 3 = 12 εκ.'
  },
  {
    id: 22,
    group: 'ΟΜΑΔΑ Β (5 επιλογες)',
    prompt: 'Ένας ποδηλάτης διανύει απόσταση 18 χιλιομέτρων σε 45 λεπτά με σταθερή ταχύτητα. Πόσα χιλιόμετρα θα διανύσει σε 1 ώρα και 15 λεπτά αν διατηρήσει την ίδια ταχύτητα;',
    options: ['24 χλμ.', '27 χλμ.', '30 χλμ.', '32 χλμ.', '36 χλμ.'],
    correct: '30 χλμ.',
    explain: 'Ο χρόνος 1 ώρα και 15 λεπτά αντιστοιχεί σε 60 + 15 = 75 λεπτά. Η ταχύτητα ανά λεπτό είναι 18 : 45 = 2/5 = 0,4 χλμ./λεπτό. Σε 75 λεπτά θα διανύσει 75 · 0,4 = 30 χλμ.'
  },
  {
    id: 23,
    group: 'ΟΜΑΔΑ Β (5 επιλογες)',
    prompt: 'Ένας μαθητής ξόδεψε το 1/4 του χαρτζιλικιού του για ένα βιβλίο και στη συνέχεια το 40% των χρημάτων που του είχαν απομείνει για ένα παιχνίδι. Αν του έμειναν 18€, πόσο ήταν το αρχικό του χαρτζιλίκι;',
    options: ['36€', '40€', '45€', '48€', '60€'],
    correct: '40€',
    explain: 'Μετά το βιβλίο μένει το 1 − 1/4 = 3/4 (ή 75%) των χρημάτων. Ξοδεύει το 40% του 75% = 0,40 · 75% = 30% του αρχικού ποσού. Του απομένει 75% − 30% = 45% του αρχικού ποσού. Αν το 45% είναι 18€, το συνολικό ποσό είναι 18 : 0,45 = 40€.'
  },
  {
    id: 24,
    group: 'ΟΜΑΔΑ Β (5 επιλογες)',
    prompt: 'Σε ένα τουρνουά σκακιού συμμετέχουν 6 παίκτες. Κάθε παίκτης παίζει ακριβώς μία παρτίδα με καθέναν από τους υπόλοιπους παίκτες. Πόσες παρτίδες σκακιού θα διεξαχθούν συνολικά σε ολόκληρο το τουρνουά;',
    options: ['12', '15', '18', '30', '36'],
    correct: '15',
    explain: 'Κάθε παίκτης παίζει με τους υπόλοιπους 5. Για 6 παίκτες έχουμε 6 · 5 = 30 αναμετρήσεις. Επειδή κάθε παρτίδα μετράει και για τους δύο παίκτες, ο συνολικός αριθμός παρτίδων είναι 30 : 2 = 15.'
  },
  {
    id: 25,
    group: 'ΟΜΑΔΑ Β (5 επιλογες)',
    prompt: 'Ένας ανθοπώλης έχει 48 κόκκινα τριαντάφυλλα και 72 λευκά τριαντάφυλλα. Θέλει να φτιάξει όμοιες ανθοδέσμες, χρησιμοποιώντας όλα τα λουλούδια, έτσι ώστε κάθε ανθοδέσμη να έχει τον ίδιο αριθμό κόκκινων και τον ίδιο αριθμό λευκών τριαντάφυλλων. Ποιος είναι ο μέγιστος αριθμός από τέτοιες ανθοδέσμες που μπορεί να φτιάξει;',
    options: ['12', '16', '24', '36', '48'],
    correct: '24',
    explain: 'Ο μέγιστος αριθμός ανθοδεσμών αντιστοιχεί στον Μέγιστο Κοινό Διαιρέτη των αριθμών 48 και 72: Μ.Κ.Δ.(48, 72) = 24. Σε κάθε ανθοδέσμη θα υπάρχουν 48 : 24 = 2 κόκκινα και 72 : 24 = 3 λευκά τριαντάφυλλα.'
  }
];

const TOTAL_TIME_SECONDS = 60 * 60; // 60 λεπτά

export default function ProtoTestProsomoiosisPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME_SECONDS);
  const [timerEnabled, setTimerEnabled] = useState(true);

  const timerRef = useRef(null);

  // Ανάγνωση του query param `timer` (0 ή 1)
  useEffect(() => {
    if (router.isReady) {
      const { timer } = router.query;
      if (timer === '0') {
        setTimerEnabled(false);
      } else {
        setTimerEnabled(true);
      }
    }
  }, [router.isReady, router.query]);

  // Αντίστροφη μέτρηση
  useEffect(() => {
    if (!timerEnabled || submitted) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timerEnabled, submitted]);

  const handleSelect = (qId, option) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const calculateScore = (currentAnswers) => {
    let s = 0;
    QUESTIONS.forEach(q => {
      if (currentAnswers[q.id] === q.correct) {
        s += 2; // 2 μόρια ανά σωστή απάντηση (σύνολο 50)
      }
    });
    return s;
  };

  const handleAutoSubmit = () => {
    setAnswers(prev => {
      const finalScore = calculateScore(prev);
      setScore(finalScore);
      setSubmitted(true);
      return prev;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (submitted) return;
    if (timerRef.current) clearInterval(timerRef.current);

    const finalScore = calculateScore(answers);
    setScore(finalScore);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).length;

  return (
    <Layout
      title="🎯 1ο Τεστ Προσομοίωσης Προτύπων - LearnMaths.gr"
      description="1ο Διαγνωστικό Τεστ Προσομοίωσης Μαθηματικών για τα Πρότυπα Σχολεία: 25 θέματα, 60 λεπτά, βαθμολογία 0-50 με αναλυτικές λύσεις."
      backUrl="/protipa/test-prosomoiosis"
      backText="Τεστ Προσομοίωσης"
      hideFooter={true}
    >
      <div className="py-6 sm:py-8 space-y-6 pb-28 sm:pb-32">

        {/* HERO BANNER & TIMER HEADER */}
        <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 rounded-3xl p-5 sm:p-7 text-white shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1.5">
              <span className="inline-block bg-white/20 px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider text-purple-100">
                1ο Τεστ • 25 Θέματα (Άριστα: 50 Μόρια)
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
                1ο Τεστ Προσομοίωσης Εξετάσεων
              </h1>
            </div>

            {timerEnabled && (
              <div className={`px-4 py-2 rounded-2xl font-mono font-black text-base sm:text-lg flex items-center gap-2 shadow-inner self-stretch sm:self-auto justify-center ${
                timeLeft < 300 ? 'bg-rose-500 text-white animate-pulse' : 'bg-white text-indigo-950'
              }`}>
                <span>⏱️</span>
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-purple-100 border-t border-white/20 pt-3">
            <span>📝 Απαντημένες: <strong>{answeredCount} / 25</strong></span>
            <span>🎯 Βαθμολογία: <strong>2 μόρια / σωστό</strong></span>
            <span>{timerEnabled ? '⏳ Χρονόμετρο: Ενεργό (60\')' : '⏳ Χρονόμετρο: Ανενεργό'}</span>
          </div>
        </div>

        {/* FEEDBACK BANNER ΜΕΤΑ ΤΗΝ ΥΠΟΒΟΛΗ */}
        {submitted && (
          <div className="bg-white border-2 border-indigo-300 rounded-3xl p-6 shadow-md text-center space-y-3">
            <span className="text-4xl block">🏆</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Ολοκλήρωση Τεστ!
            </h2>
            <div className="inline-block bg-indigo-50 border border-indigo-200 px-6 py-2 rounded-2xl">
              <span className="text-xs font-bold text-indigo-800 uppercase block">Τελικό Σκορ</span>
              <span className="text-3xl sm:text-4xl font-mono font-black text-indigo-600">
                {score} / 50
              </span>
              <span className="text-xs font-bold text-slate-500 block mt-1">
                ({score / 2} σωστές στις 25 ερωτήσεις)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
              Δες παρακάτω αναλυτικά ποιες ερωτήσεις απάντησες σωστά (✅) ή λάθος (❌) μαζί με την αναλυτική μαθηματική λύση για κάθε θέμα.
            </p>
          </div>
        )}

        {/* LIST OF 25 QUESTIONS */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {QUESTIONS.map((q) => {
            const userChoice = answers[q.id];
            const isCorrect = userChoice === q.correct;

            let cardBorder = 'border-slate-200';
            if (submitted) {
              cardBorder = isCorrect ? 'border-emerald-400 bg-emerald-50/30' : 'border-rose-400 bg-rose-50/30';
            }

            return (
              <div
                key={q.id}
                className={`bg-white rounded-3xl p-5 sm:p-6 border-2 shadow-sm transition-all space-y-4 ${cardBorder}`}
              >
                {/* ΚΕΦΑΛΙΔΑ ΕΡΩΤΗΣΗΣ */}
                <div className="flex justify-between items-center gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-slate-100 text-slate-800 font-mono font-black text-xs px-3 py-1 rounded-xl">
                      Θέμα {q.id}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      {q.group}
                    </span>
                  </div>

                  {submitted && (
                    <span className="text-lg font-black">
                      {isCorrect ? '✅ +2 μόρια' : '❌ 0 μόρια'}
                    </span>
                  )}
                </div>

                {/* ΕΚΦΩΝΗΣΗ */}
                <p className="text-sm sm:text-base text-slate-900 font-bold leading-relaxed whitespace-pre-line">
                  {q.prompt}
                </p>

                {/* ΕΠΙΛΟΓΕΣ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userChoice === opt;
                    let btnStyle = 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50';

                    if (submitted) {
                      if (opt === q.correct) {
                        btnStyle = 'bg-emerald-600 text-white border-emerald-600 shadow-sm font-black';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'bg-rose-600 text-white border-rose-600 font-black';
                      } else {
                        btnStyle = 'bg-slate-100 text-slate-400 border-slate-200 opacity-60';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-indigo-600 text-white border-indigo-600 shadow-sm font-black';
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={submitted}
                        onClick={() => handleSelect(q.id, opt)}
                        className={`p-3 rounded-2xl border text-left text-xs sm:text-sm transition flex items-center gap-3 ${btnStyle}`}
                      >
                        <span className={`w-6 h-6 rounded-xl flex items-center justify-center font-mono font-black text-xs shrink-0 border ${
                          isSelected || (submitted && opt === q.correct)
                            ? 'bg-white/20 border-white/40 text-white'
                            : 'bg-slate-100 border-slate-200 text-slate-700'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="font-mono font-bold leading-tight">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* ΕΠΕΞΗΓΗΣΗ ΜΕΤΑ ΤΗΝ ΥΠΟΒΟΛΗ */}
                {submitted && (
                  <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed border ${
                    isCorrect 
                      ? 'bg-emerald-100/60 text-emerald-950 border-emerald-200' 
                      : 'bg-rose-100/60 text-rose-950 border-rose-200'
                  }`}>
                    <div className="font-black mb-1 flex items-center gap-1.5">
                      <span>💡</span>
                      <span>Μαθηματική Επεξήγηση:</span>
                    </div>
                    <p className="font-medium">{q.explain}</p>
                  </div>
                )}
              </div>
            );
          })}

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#10b981] hover:bg-[#059669] text-white text-base sm:text-lg font-black px-10 py-4 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5"
              >
                <span>🎯</span>
                <span>Οριστική Υποβολή Τεστ ({answeredCount}/25)</span>
              </button>
            </div>
          )}
        </form>

      </div>

      {/* FIXED BOTTOM SCORE & TIMER BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-3 px-4 sm:px-6 z-50">
        <div className={`${LAYOUT.CONTAINER} flex flex-col sm:flex-row justify-between items-center gap-3`}>
          
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-mono shadow-xs">
              {submitted ? `Σκορ: ${score} / 50` : `Απαντήσεις: ${answeredCount} / 25`}
            </div>
            {submitted ? (
              <span className="text-xs font-bold text-slate-300">
                Ποσοστό: <strong className="text-emerald-400">{Math.round((score / 50) * 100)}%</strong>
              </span>
            ) : (
              <span className="text-xs text-slate-300">
                Υπολείπονται: <strong>{25 - answeredCount}</strong>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {timerEnabled && !submitted && (
              <span className={`text-xs font-mono font-black px-3 py-1 rounded-lg ${
                timeLeft < 300 ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-800 text-slate-200'
              }`}>
                ⏱️ {formatTime(timeLeft)}
              </span>
            )}

            {submitted ? (
              <button
                type="button"
                onClick={() => {
                  setAnswers({});
                  setSubmitted(false);
                  setScore(0);
                  setTimeLeft(TOTAL_TIME_SECONDS);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2 rounded-xl text-xs transition shadow-xs"
              >
                🔄 Επανάληψη Τεστ
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-4 py-2 rounded-xl text-xs transition shadow-xs"
              >
                Έλεγχος & Βαθμολόγηση ➔
              </button>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}
