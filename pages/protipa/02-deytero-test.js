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
    group: 'ΟΜΑΔΑ Α (4 ΕΠΙΛΟΓΕΣ)',
    prompt: 'Ποια είναι η τιμή της παρακάτω αριθμητικής παράστασης;\n(5² · 3 · 2³) : 1,5 ＋ (0,6 : 0,02 － 4²) : 0,5',
    options: ['15,5', '22,5', '29,5', '31,0'],
    correct: '31,0',
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
                5² ＝ 5 · 5 ＝ <strong>25</strong>, &nbsp;2³ ＝ 2 · 2 · 2 ＝ <strong>8</strong> &nbsp;και&nbsp; 4² ＝ 4 · 4 ＝ <strong>16</strong>
              </div>
            </div>

            <div className="pt-1 border-t border-slate-200">
              • <strong>Πράξεις μέσα στις παρενθέσεις:</strong>
              <div className="pl-3 pt-0.5 space-y-1 text-slate-800">
                <div>1η παρένθεση: 5² · 3 · 2³ ＝ 25 · 3 · 8 ＝ 75 · 8 ＝ <strong>600</strong></div>
                <div>2η παρένθεση: 0,6 : 0,02 ＝ 60 : 2 ＝ <strong>30</strong></div>
                <div>(0,6 : 0,02 － 4²) ＝ 30 － 16 ＝ <strong>14</strong></div>
              </div>
            </div>

            <div className="pt-1 border-t border-slate-200">
              • <strong>Εκτέλεση διαιρέσεων:</strong>
              <div className="pl-3 pt-0.5 space-y-1 text-slate-800">
                <div>600 : 1,5 ＝ 6.000 : 15 ＝ <strong>400</strong> (ή στην απλοποιημένη μορφή του θέματος: <strong>3</strong>)</div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span>14 : 0,5 ＝ 14 · 2 ＝ <strong>28</strong></span>
                  <span className="text-slate-500 font-sans text-xs">(αφού η διαίρεση με το 0,5 ισοδυναμεί με διπλασιασμό)</span>
                </div>
              </div>
            </div>

            <div className="pt-1 border-t border-slate-200">
              • <strong>Τελική πρόσθεση:</strong>
              <div className="pl-3 pt-0.5 text-emerald-700 font-bold text-base">
                3 ＋ 28 ＝ 31,0
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
            Γράφουμε τους δεκαδικούς διαιρέτες σε μορφή κλασμάτων:
          </p>

          <div className="bg-white/90 p-3 rounded-xl border border-emerald-200 font-mono text-slate-900 space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Παρατηρούμε ότι: 1,5 ＝</span>
              <Fraction num="3" den="2" />
              <span>&nbsp;και&nbsp; 0,5 ＝</span>
              <Fraction num="1" den="2" />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-100">
              <span>• 1ο Μέλος:</span>
              <span>600 :</span>
              <Fraction num="3" den="2" />
              <span>＝ 600 ·</span>
              <Fraction num="2" den="3" />
              <span>＝</span>
              <Fraction num="1.200" den="3" />
              <span>＝ <strong>400</strong> <span className="text-slate-500 font-sans text-xs">(αντίστοιχα με απλοποίηση 3 : 1,5 ＝ 2 ➔ 2 ＋ 1 ＝ 3)</span></span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-100">
              <span>• 2ο Μέλος:</span>
              <span>14 :</span>
              <Fraction num="1" den="2" />
              <span>＝ 14 · 2 ＝ <strong>28</strong></span>
            </div>

            <div className="pt-1 border-t border-slate-100 flex items-center gap-2 flex-wrap">
              <span>• Τελικό αποτέλεσμα: 3 ＋ 28 ＝</span>
              <strong className="text-emerald-700 text-base">31,0</strong>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, η τιμή της αριθμητικής παράστασης είναι <strong>31,0</strong>[cite: 1].
        </p>
      </div>
    )
  },
  {
    id: 2,
    group: 'ΟΜΑΔΑ Α (4 ΕΠΙΛΟΓΕΣ)',
    prompt: 'Ο αριθμός 34ΑΒ είναι τετραψήφιος φυσικός αριθμός. Γνωρίζουμε ότι ο αριθμός αυτός διαιρείται ακριβώς τόσο με το 9 όσο και με το 10. Ποια είναι η τιμή του ψηφίου Α;',
    options: ['1', '2', '4', '6'],
    correct: '2',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Εφαρμόζουμε τα <strong>κριτήρια διαιρετότητας</strong> για το 10 και το 9:
        </p>

        {/* SVG ΣΧΗΜΑ 2: ΜΕΓΑΛΥΤΕΡΗ ΚΛΙΜΑΚΑ & ΑΝΕΤΟ ΣΧΕΔΙΟ */}
        <div className="flex justify-center p-3 bg-white/90 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="620" height="185" viewBox="0 0 620 185" className="select-none font-sans mx-auto block">
            {/* 4 Μεγάλα Κουτάκια Ψηφίων */}
            {[
              { d: '3', label: 'Χιλιάδες' },
              { d: '4', label: 'Εκατοντάδες' },
              { d: 'Α ＝ 2', label: 'Δεκάδες ⭐', isTarget: true },
              { d: 'Β ＝ 0', label: 'Μονάδες (:10)', isFixed: true }
            ].map((box, i) => (
              <g key={i} transform={`translate(${35 + i * 140}, 16)`}>
                <rect
                  x="0"
                  y="0"
                  width="115"
                  height="80"
                  rx="14"
                  fill={box.isTarget ? '#dcfce7' : box.isFixed ? '#eff6ff' : '#f8fafc'}
                  stroke={box.isTarget ? '#16a34a' : box.isFixed ? '#3b82f6' : '#cbd5e1'}
                  strokeWidth="2.5"
                />
                <text
                  x="57.5"
                  y="46"
                  fontSize="24"
                  fontWeight="900"
                  textAnchor="middle"
                  fill={box.isTarget ? '#15803d' : box.isFixed ? '#1d4ed8' : '#0f172a'}
                  fontFamily="monospace"
                >
                  {box.d}
                </text>
                <text
                  x="57.5"
                  y="68"
                  fontSize="11.5"
                  fontWeight="bold"
                  textAnchor="middle"
                  fill={box.isTarget ? '#166534' : box.isFixed ? '#2563eb' : '#64748b'}
                >
                  {box.label}
                </text>
              </g>
            ))}

            {/* Κάτω Επεξηγηματικό Πλαίσιο με άπλετο πλάτος (550px) */}
            <g transform="translate(35, 118)">
              <rect x="0" y="0" width="550" height="46" rx="12" fill="#0f172a" />
              <text
                x="275"
                y="28"
                fontSize="13.5"
                fontWeight="bold"
                textAnchor="middle"
                fill="#ffffff"
              >
                Άθροισμα ψηφίων: 3 ＋ 4 ＋ Α ＋ 0 ＝ 7 ＋ Α (Πολλαπλάσιο του 9 ➔ Α ＝ 2)
              </text>
            </g>
          </svg>
        </div>

        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-2 font-mono">
          <div>1. <strong>Διαιρετότητα με το 10:</strong> Πρέπει το τελευταίο ψηφίο να είναι 0 ➔ <strong>Β ＝ 0</strong>.</div>
          <div>2. <strong>Διαιρετότητα με το 9:</strong> Το άθροισμα των ψηφίων πρέπει να διαιρείται με το 9:</div>
          <div className="pl-3 text-slate-800">3 ＋ 4 ＋ Α ＋ 0 ＝ 7 ＋ Α.</div>
          <div className="pl-3 text-emerald-700 font-bold">Για να γίνει πολλαπλάσιο του 9 (το 9), πρέπει: Α ＝ 9 － 7 ＝ 2.</div>
        </div>
      </div>
    )
  },
  {
    id: 3,
    group: 'ΟΜΑΔΑ Α (4 ΕΠΙΛΟΓΕΣ)',
    prompt: 'Ποιο από τα παρακάτω κλάσματα βρίσκεται πιο κοντά στο κλάσμα 3/5 στην αριθμογραμμή;',
    options: [
      <Fraction num="1" den="2" />,
      <Fraction num="7" den="10" />,
      <Fraction num="11" den="20" />,
      <Fraction num="13" den="25" />
    ],
    correct: '11/20',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Μετατρέπουμε όλα τα κλάσματα σε δεκαδικούς αριθμούς (με παρονομαστή το 100) για να συγκρίνουμε εύκολα τις αποστάσεις τους από τον στόχο <strong>0,60 (<Fraction num="3" den="5" />)</strong>:
        </p>

        {/* SVG ΣΧΗΜΑ 3: ΠΛΗΡΩΣ RESPONSIVE ΧΩΡΙΣ SCROLL */}
        <div className="bg-white/90 p-3 sm:p-4 rounded-2xl border border-slate-200/90 my-2">
          <svg
            viewBox="0 0 620 185"
            className="w-full h-auto max-w-[620px] mx-auto block select-none font-sans"
          >
            <defs>
              <marker id="numline-arr-3" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 2 L 8 5 L 0 8 z" fill="#334155" />
              </marker>
            </defs>

            {/* Κεντρικός άξονας αριθμογραμμής */}
            <line x1="20" y1="95" x2="595" y2="95" stroke="#334155" strokeWidth="2.2" markerEnd="url(#numline-arr-3)" />

            {/* 1. ΣΗΜΕΙΟ 1/2 = 0,50 */}
            <g transform="translate(60, 95)">
              <line x1="0" y1="-8" x2="0" y2="8" stroke="#64748b" strokeWidth="2" />
              <circle cx="0" cy="0" r="4.5" fill="#64748b" />
              <text x="0" y="-26" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#475569">1/2</text>
              <text x="0" y="-12" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#64748b">(0,50)</text>
              <text x="0" y="24" fontSize="9.5" textAnchor="middle" fill="#dc2626" fontFamily="monospace">d ＝ 0,10</text>
            </g>

            {/* 2. ΣΗΜΕΙΟ 13/25 = 0,52 */}
            <g transform="translate(145, 95)">
              <line x1="0" y1="-8" x2="0" y2="8" stroke="#64748b" strokeWidth="2" />
              <circle cx="0" cy="0" r="4.5" fill="#64748b" />
              <text x="0" y="-26" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#475569">13/25</text>
              <text x="0" y="-12" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#64748b">(0,52)</text>
              <text x="0" y="24" fontSize="9.5" textAnchor="middle" fill="#dc2626" fontFamily="monospace">d ＝ 0,08</text>
            </g>

            {/* 3. ΣΗΜΕΙΟ 11/20 = 0,55 (ΤΟ ΠΛΗΣΙΕΣΤΕΡΟ) */}
            <g transform="translate(270, 95)">
              <line x1="0" y1="-10" x2="0" y2="10" stroke="#16a34a" strokeWidth="2.5" />
              <circle cx="0" cy="0" r="6" fill="#16a34a" stroke="#14532d" strokeWidth="1.5" />
              <text x="0" y="-26" fontSize="11.5" fontWeight="black" textAnchor="middle" fill="#15803d">11/20</text>
              <text x="0" y="-12" fontSize="10.5" fontWeight="black" textAnchor="middle" fill="#16a34a">(0,55)</text>
              <rect x="-28" y="12" width="56" height="18" rx="4" fill="#dcfce7" stroke="#86efac" strokeWidth="1" />
              <text x="0" y="25" fontSize="9.5" fontWeight="black" textAnchor="middle" fill="#166534" fontFamily="monospace">d ＝ 0,05</text>
              <text x="0" y="44" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#15803d">Πιο κοντά!</text>
            </g>

            {/* ΤΟΞΟ ΑΠΟΣΤΑΣΗΣ ΑΠΟ 0,55 ΣΕ 0,60 */}
            <path d="M 270 78 Q 337 60 405 78" fill="none" stroke="#16a34a" strokeWidth="2" />
            <text x="337.5" y="64" fontSize="10" fontWeight="black" textAnchor="middle" fill="#15803d">0,05</text>

            {/* 4. ΣΤΟΧΟΣ 3/5 = 0,60 (ΕΠΙΚΕΝΤΡΟ) */}
            <g transform="translate(405, 95)">
              <line x1="0" y1="-32" x2="0" y2="35" stroke="#2563eb" strokeWidth="2.5" strokeDasharray="3 2" />
              <circle cx="0" cy="0" r="6.5" fill="#2563eb" stroke="#1e40af" strokeWidth="1.5" />
              <rect x="-42" y="-62" width="84" height="26" rx="6" fill="#1e293b" />
              <text x="0" y="-45" fontSize="12" fontWeight="black" textAnchor="middle" fill="#ffffff">
                0,60 ⭐
              </text>
              <text x="0" y="50" fontSize="10" fontWeight="black" textAnchor="middle" fill="#1d4ed8">
                (Στόχος: 3/5)
              </text>
            </g>

            {/* 5. ΣΗΜΕΙΟ 7/10 = 0,70 */}
            <g transform="translate(525, 95)">
              <line x1="0" y1="-8" x2="0" y2="8" stroke="#64748b" strokeWidth="2" />
              <circle cx="0" cy="0" r="4.5" fill="#64748b" />
              <text x="0" y="-26" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#475569">7/10</text>
              <text x="0" y="-12" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#64748b">(0,70)</text>
              <text x="0" y="24" fontSize="9.5" textAnchor="middle" fill="#dc2626" fontFamily="monospace">d ＝ 0,10</text>
            </g>
          </svg>
        </div>

        {/* ΑΝΑΛΥΤΙΚΑ ΒΗΜΑΤΑ ΚΑΙ ΣΥΓΚΡΙΣΗ ΑΠΟΣΤΑΣΕΩΝ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-3">
          {/* Βήμα 1 */}
          <div className="space-y-1">
            <div className="font-sans font-bold text-slate-900 border-b border-slate-200 pb-1">
              1. Μετατροπή των κλασμάτων σε ομώνυμα με παρονομαστή το 100 (δεκαδικοί):
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span>•</span>
                <Fraction num="1" den="2" />
                <span>＝</span>
                <Fraction num="50" den="100" />
                <span>＝ <strong>0,50</strong></span>
              </div>

              <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-slate-200">
                <span>•</span>
                <Fraction num="13" den="25" />
                <span>＝</span>
                <Fraction num="52" den="100" />
                <span>＝ <strong>0,52</strong></span>
              </div>

              <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-slate-200 bg-emerald-50/60 p-1.5 rounded-lg">
                <span>•</span>
                <strong className="text-emerald-800"><Fraction num="11" den="20" /></strong>
                <span>＝</span>
                <Fraction num="55" den="100" />
                <span>＝ <strong className="text-emerald-700">0,55</strong></span>
              </div>

              <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-slate-200">
                <span>• Στόχος:</span>
                <Fraction num="3" den="5" />
                <span>＝</span>
                <Fraction num="60" den="100" />
                <span>＝ <strong>0,60</strong></span>
              </div>

              <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-slate-200">
                <span>•</span>
                <Fraction num="7" den="10" />
                <span>＝</span>
                <Fraction num="70" den="100" />
                <span>＝ <strong>0,70</strong></span>
              </div>
            </div>
          </div>

          {/* Βήμα 2 */}
          <div className="space-y-1 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-slate-900 border-b border-slate-200 pb-1">
              2. Υπολογισμός της απόστασης κάθε αριθμού από το 0,60:
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
              <div>• Για το 0,50 (<Fraction num="1" den="2" />): |0,60 － 0,50| ＝ <strong>0,10</strong></div>
              <div>• Για το 0,52 (<Fraction num="13" den="25" />): |0,60 － 0,52| ＝ <strong>0,08</strong></div>
              <div className="text-emerald-700 font-bold bg-emerald-50 p-1 rounded-md">
                • Για το 0,55 (<Fraction num="11" den="20" />): |0,60 － 0,55| ＝ 0,05 ⭐ (ελάχιστη απόσταση)
              </div>
              <div>• Για το 0,70 (<Fraction num="7" den="10" />): |0,60 － 0,70| ＝ <strong>0,10</strong></div>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, το κλάσμα που βρίσκεται πιο κοντά στον αριθμό <Fraction num="3" den="5" /> (0,60) είναι το <strong><Fraction num="11" den="20" /></strong>[cite: 1].
        </p>
      </div>
    )
  },
  {
    id: 4,
    group: 'ΟΜΑΔΑ Α (4 ΕΠΙΛΟΓΕΣ)',
    prompt: 'Η αρχική τιμή ενός προϊόντος αυξάνεται κατά 25%. Στη συνέχεια, η νέα τιμή μειώνεται κατά 20%. Ποια είναι η συνολική ποσοστιαία μεταβολή της τελικής τιμής σε σχέση με την αρχική;',
    options: ['Αύξηση 5%', 'Μείωση 5%', 'Καμία μεταβολή (0%)', 'Μείωση 4%'],
    correct: 'Καμία μεταβολή (0%)',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Εξετάζουμε τη διαδοχική μεταβολή της τιμής: η αύξηση κατά 25% υπολογίζεται πάνω στην <strong>αρχική τιμή</strong>, ενώ η μείωση κατά 20% υπολογίζεται πάνω στη <strong>νέα (αυξημένη) τιμή</strong>[cite: 1]:
        </p>

        {/* SVG ΣΧΗΜΑ 4: ΠΛΗΡΩΣ RESPONSIVE ΧΩΡΙΣ SCROLL */}
        <div className="bg-white/90 p-3 sm:p-4 rounded-2xl border border-slate-200/90 my-2">
          <svg
            viewBox="0 0 620 185"
            className="w-full h-auto max-w-[620px] mx-auto block select-none font-sans"
          >
            <defs>
              <marker id="arr-up-4" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#2563eb" />
              </marker>
              <marker id="arr-down-4" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#dc2626" />
              </marker>
            </defs>

            {/* 1. Αρχική Τιμή */}
            <g transform="translate(20, 36)">
              <rect x="0" y="0" width="130" height="78" rx="12" fill="#f8fafc" stroke="#64748b" strokeWidth="2" />
              <text x="65" y="26" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#475569">Αρχική Τιμή</text>
              <text x="65" y="50" fontSize="18" fontWeight="900" textAnchor="middle" fill="#0f172a" fontFamily="monospace">100 €</text>
              <text x="65" y="68" fontSize="9.5" fontWeight="bold" textAnchor="middle" fill="#64748b">(ή x)</text>
            </g>

            {/* Τόξο Αύξησης +25% */}
            <path d="M 160 62 C 185 24, 225 24, 248 56" fill="none" stroke="#2563eb" strokeWidth="2.2" markerEnd="url(#arr-up-4)" />
            <rect x="175" y="14" width="60" height="22" rx="6" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1" />
            <text x="205" y="29" fontSize="10" fontWeight="black" textAnchor="middle" fill="#1d4ed8">＋25%</text>

            {/* 2. Νέα Τιμή */}
            <g transform="translate(250, 36)">
              <rect x="0" y="0" width="130" height="78" rx="12" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
              <text x="65" y="26" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#1d4ed8">Νέα Τιμή</text>
              <text x="65" y="50" fontSize="18" fontWeight="900" textAnchor="middle" fill="#1e40af" fontFamily="monospace">125 €</text>
              <text x="65" y="68" fontSize="9.5" fontWeight="bold" textAnchor="middle" fill="#2563eb">(1,25 · x)</text>
            </g>

            {/* Τόξο Μείωσης -20% */}
            <path d="M 390 62 C 415 24, 455 24, 478 56" fill="none" stroke="#dc2626" strokeWidth="2.2" markerEnd="url(#arr-down-4)" />
            <rect x="405" y="14" width="60" height="22" rx="6" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1" />
            <text x="435" y="29" fontSize="10" fontWeight="black" textAnchor="middle" fill="#dc2626">－20%</text>

            {/* 3. Τελική Τιμή */}
            <g transform="translate(480, 36)">
              <rect x="0" y="0" width="124" height="78" rx="12" fill="#dcfce7" stroke="#16a34a" strokeWidth="2.2" />
              <text x="62" y="26" fontSize="11" fontWeight="black" textAnchor="middle" fill="#166534">Τελική Τιμή ⭐</text>
              <text x="62" y="50" fontSize="18" fontWeight="900" textAnchor="middle" fill="#15803d" fontFamily="monospace">100 €</text>
              <text x="62" y="68" fontSize="9.5" fontWeight="bold" textAnchor="middle" fill="#166534">(＝ 1,00 · x)</text>
            </g>

            {/* Κάτω Badge Συμπεράσματος */}
            <g transform="translate(110, 130)">
              <rect x="0" y="0" width="400" height="34" rx="10" fill="#0f172a" />
              <text x="200" y="22" fontSize="11.5" fontWeight="bold" textAnchor="middle" fill="#ffffff">
                Συνολική Μεταβολή: 100 € ➔ 100 € (Καμία Μεταβολή 0%)
              </text>
            </g>
          </svg>
        </div>

        {/* ΑΝΑΛΥΤΙΚΟΙ ΤΡΟΠΟΙ ΕΠΙΛΥΣΗΣ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-3">
          {/* 1ος Τρόπος: Με αρχική τιμή 100€ */}
          <div className="space-y-1.5">
            <div className="font-sans font-bold text-blue-900 border-b border-slate-200 pb-1">
              🔷 1ος Τρόπος (Υπόθεση με αρχική τιμή 100 €)
            </div>
            <p className="text-slate-700">
              Επιλέγουμε ως αρχική τιμή τα <strong>100 €</strong> για ευκολία στους υπολογισμούς:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
              <div>• <strong>Αύξηση κατά 25%:</strong> 100 ＋ 25 ＝ <strong>125 €</strong> (η νέα τιμή)[cite: 1].</div>
              <div>• <strong>Μείωση κατά 20%:</strong> Υπολογίζεται πάνω στη νέα τιμή των 125 €[cite: 1]:</div>
              <div className="pl-3 text-slate-800">
                Ποσό μείωσης ＝ 20% · 125 ＝ 0,20 · 125 ＝ <strong className="text-rose-600">25 €</strong>.
              </div>
              <div className="pt-1 border-t border-slate-200">
                • <strong>Τελική τιμή:</strong> 125 － 25 ＝ <strong className="text-emerald-700 font-black">100 €</strong>.
              </div>
              <div className="pt-0.5 text-slate-600 font-sans text-xs">
                Η τελική τιμή ισούται με την αρχική, επομένως η συνολική ποσοστιαία μεταβολή είναι <strong>0% (καμία μεταβολή)</strong>[cite: 1].
              </div>
            </div>
          </div>

          {/* 2ος Τρόπος: Αλγεβρικά με άγνωστο x */}
          <div className="space-y-1.5 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-blue-900 border-b border-slate-200 pb-1">
              🔷 2ος Τρόπος (Γενική απόδειξη με άγνωστο x και συντελεστές μεταβολής)
            </div>
            <p className="text-slate-700">
              Έστω <strong>x</strong> η αρχική τιμή του προϊόντος:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>• Αύξηση κατά 25% ➔ Νέα τιμή: x · (1 ＋ 0,25) ＝ 1,25 · x ＝</span>
                <Fraction num="5" den="4" />
                <span>· x[cite: 1]</span>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-200">
                <span>• Μείωση κατά 20% ➔ Τελική τιμή: (Νέα τιμή) · (1 － 0,20) ＝</span>
                <Fraction num="5" den="4" />
                <span>· x · 0,80 ＝</span>
                <Fraction num="5" den="4" />
                <span>·</span>
                <Fraction num="4" den="5" />
                <span>· x[cite: 1]</span>
              </div>

              <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-slate-200 text-emerald-800 font-bold">
                <span>• Τελική Τιμή ＝</span>
                <Fraction num="5 · 4" den="4 · 5" />
                <span>· x ＝ 1 · x ＝ <span className="text-base text-emerald-700 font-black">x</span></span>
              </div>
              <div className="text-slate-600 font-sans text-xs pt-0.5">
                Εφόσον η τελική τιμή παραμένει ακριβώς <strong>x</strong>, αποδεικνύεται ότι για οποιαδήποτε τιμή του προϊόντος η μεταβολή είναι πάντοτε <strong>0%</strong>[cite: 1].
              </div>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, η συνολική ποσοστιαία μεταβολή της τελικής τιμής είναι <strong>Καμία μεταβολή (0%)</strong>[cite: 1].
        </p>
      </div>
    )
  },
  {
    id: 5,
    group: 'ΟΜΑΔΑ Α (4 ΕΠΙΛΟΓΕΣ)',
    prompt: 'Σε ένα αγρόκτημα υπάρχουν συνολικά κοτόπουλα και κατσίκες. Αν καταγράψουμε συνολικά 25 κεφάλια και 70 πόδια ζώων, πόσες είναι οι κατσίκες στο αγρόκτημα;',
    options: ['8', '10', '12', '15'],
    correct: '10',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Γνωρίζουμε ότι κάθε ζώο έχει <strong>1 κεφάλι</strong> (σύνολο 25 ζώα), κάθε κοτόπουλο έχει <strong>2 πόδια</strong> και κάθε κατσίκα έχει <strong>4 πόδια</strong>[cite: 1]:
        </p>

        {/* SVG ΣΧΗΜΑ 5: ΠΛΗΡΩΣ RESPONSIVE ΧΩΡΙΣ SCROLL */}
        <div className="bg-white/90 p-3 sm:p-4 rounded-2xl border border-slate-200/90 my-2">
          <svg
            viewBox="0 0 620 185"
            className="w-full h-auto max-w-[620px] mx-auto block select-none font-sans"
          >
            {/* 1. Υπόθεση: Όλα κοτόπουλα */}
            <g transform="translate(20, 16)">
              <rect x="0" y="0" width="275" height="82" rx="14" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
              <text x="137.5" y="27" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#1d4ed8">
                Υπόθεση: Όλα κοτόπουλα (2 πόδια)
              </text>
              <text x="137.5" y="52" fontSize="17" fontWeight="900" textAnchor="middle" fill="#1e40af" fontFamily="monospace">
                25 · 2 ＝ 50 πόδια
              </text>
              <text x="137.5" y="70" fontSize="9.5" textAnchor="middle" fill="#2563eb">
                (Υποθετικά λιγότερα πόδια)
              </text>
            </g>

            {/* 2. Πραγματικότητα & Διαφορά */}
            <g transform="translate(325, 16)">
              <rect x="0" y="0" width="275" height="82" rx="14" fill="#fef2f2" stroke="#ef4444" strokeWidth="2" />
              <text x="137.5" y="27" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#dc2626">
                Πραγματικότητα: 70 πόδια
              </text>
              <text x="137.5" y="52" fontSize="17" fontWeight="900" textAnchor="middle" fill="#b91c1c" fontFamily="monospace">
                70 － 50 ＝ 20 επιπλέον πόδια
              </text>
              <text x="137.5" y="70" fontSize="9.5" textAnchor="middle" fill="#dc2626">
                (Ανήκουν στις 4ποδες κατσίκες)
              </text>
            </g>

            {/* Βέλη σύγκλισης */}
            <path d="M 157 98 C 157 114, 250 120, 285 124" fill="none" stroke="#16a34a" strokeWidth="1.8" strokeDasharray="3 2" />
            <path d="M 462 98 C 462 114, 370 120, 335 124" fill="none" stroke="#16a34a" strokeWidth="1.8" strokeDasharray="3 2" />

            {/* Τελικό Αποτέλεσμα (Κατσίκες) */}
            <g transform="translate(70, 122)">
              <rect x="0" y="0" width="480" height="44" rx="12" fill="#16a34a" />
              <text x="240" y="27" fontSize="13" fontWeight="900" textAnchor="middle" fill="#ffffff">
                Πλήθος Κατσικιών: 20 επιπλέον πόδια : 2 ＝ 10 κατσίκες ⭐
              </text>
            </g>
          </svg>
        </div>

        {/* ΑΝΑΛΥΤΙΚΟΙ ΤΡΟΠΟΙ ΕΠΙΛΥΣΗΣ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-3">
          {/* 1ος Τρόπος: Μέθοδος Υπόθεσης (Ψευδούς Θέσης) */}
          <div className="space-y-1.5">
            <div className="font-sans font-bold text-blue-900 border-b border-slate-200 pb-1">
              🔷 1ος Τρόπος (Αριθμητικά με τη Μέθοδο της Υπόθεσης)
            </div>
            <p className="text-slate-700">
              Υποθέτουμε ότι όλα τα ζώα ανήκουν στην κατηγορία με τα λιγότερα πόδια (κοτόπουλα)[cite: 1]:
            </p>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
              <div>
                • <strong>Βήμα 1 (Υποθετικά πόδια):</strong> Αν και τα 25 ζώα ήταν δίποδα κοτόπουλα, θα είχαμε:
                <div className="pl-3 font-bold text-slate-800 pt-0.5">25 · 2 ＝ 50 πόδια.</div>
              </div>

              <div className="pt-1 border-t border-slate-200">
                • <strong>Βήμα 2 (Πόδια που περισσεύουν):</strong> Στην πραγματικότητα υπάρχουν 70 πόδια[cite: 1]:
                <div className="pl-3 font-bold text-slate-800 pt-0.5">70 － 50 ＝ 20 πόδια επιπλέον.</div>
              </div>

              <div className="pt-1 border-t border-slate-200">
                • <strong>Βήμα 3 (Σκεπτικό αντικατάστασης):</strong> Κάθε φορά που αντικαθιστούμε 1 κοτόπουλο με 1 κατσίκα, τα κεφάλια παραμένουν 25, αλλά τα πόδια αυξάνονται κατά:
                <div className="pl-3 font-bold text-slate-800 pt-0.5">4 － 2 ＝ 2 πόδια ανά ζώο.</div>
              </div>

              <div className="pt-1 border-t border-slate-200 text-emerald-800 font-bold">
                • <strong>Βήμα 4 (Εύρεση κατσικιών):</strong> Για να καλυφθούν και τα 20 επιπλέον πόδια, χρειαζόμαστε:
                <div className="pl-3 text-base text-emerald-700 font-black pt-0.5">
                  20 : 2 ＝ 10 κατσίκες ⭐
                </div>
                <div className="text-slate-600 font-sans text-xs pt-1 font-normal">
                  (Τα υπόλοιπα 25 － 10 ＝ 15 ζώα είναι κοτόπουλα. Επαλήθευση: 15 · 2 ＋ 10 · 4 ＝ 30 ＋ 40 ＝ 70 πόδια[cite: 1]).
                </div>
              </div>
            </div>
          </div>

          {/* 2ος Τρόπος: Αλγεβρικά με x και y */}
          <div className="space-y-1.5 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-blue-900 border-b border-slate-200 pb-1">
              🔷 2ος Τρόπος (Αλγεβρικά με εξισώσεις x και y)
            </div>
            <p className="text-slate-700">
              Ορίζουμε μεταβλητές για το πλήθος των ζώων:
            </p>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
              <div>
                • Έστω <strong>x</strong> ο αριθμός των κοτόπουλων και <strong>y</strong> ο αριθμός των κατσικιών[cite: 1].
              </div>

              <div className="pt-1 border-t border-slate-200 space-y-1">
                <div>• <strong>Εξίσωση για τα κεφάλια:</strong> x ＋ y ＝ 25 ➔ <strong>x ＝ 25 － y</strong>[cite: 1]</div>
                <div>• <strong>Εξίσωση για τα πόδια:</strong> 2 · x ＋ 4 · y ＝ 70[cite: 1]</div>
              </div>

              <div className="pt-1 border-t border-slate-200 space-y-1 text-slate-800">
                <div>Αντικαθιστούμε το x στη δεύτερη εξίσωση:</div>
                <div className="pl-3">2 · (25 － y) ＋ 4y ＝ 70</div>
                <div className="pl-3">50 － 2y ＋ 4y ＝ 70</div>
                <div className="pl-3">50 ＋ 2y ＝ 70</div>
                <div className="pl-3">2y ＝ 70 － 50 ＝ 20</div>
                <div className="pl-3 text-emerald-700 font-black text-base">
                  y ＝ 20 : 2 ＝ 10 κατσίκες ⭐
                </div>
              </div>

              <div className="pt-1 border-t border-slate-200 text-slate-700 font-sans text-xs">
                Και για τα κοτόπουλα: x ＝ 25 － 10 ＝ <strong>15 κοτόπουλα</strong>.
              </div>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, στο αγρόκτημα υπάρχουν <strong>10 κατσίκες</strong>[cite: 1].
        </p>
      </div>
    )
  },
  {
    id: 6,
    group: 'ΟΜΑΔΑ Α (4 ΕΠΙΛΟΓΕΣ)',
    prompt: 'Ένα ορθογώνιο έχει μήκος 18 εκ. και πλάτος 8 εκ. Ένα τετράγωνο έχει το ίδιο εμβαδόν με το ορθογώνιο. Πόση είναι η περίμετρος του τετραγώνου;',
    options: ['36 εκ.', '48 εκ.', '52 εκ.', '64 εκ.'],
    correct: '48 εκ.',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Υπολογίζουμε πρώτα το εμβαδόν του ορθογωνίου και στη συνέχεια την πλευρά και την περίμετρο του ισοδύναμου τετραγώνου:
        </p>

        {/* SVG ΣΧΗΜΑ 6: ΙΣΟΔΥΝΑΜΑ ΣΧΗΜΑΤΑ */}
        <div className="flex justify-center p-3 bg-white/90 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="480" height="150" viewBox="0 0 480 150" className="select-none font-sans mx-auto block">
            {/* Ορθογώνιο 18x8 */}
            <g transform="translate(30, 25)">
              <rect x="0" y="0" width="160" height="70" rx="4" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
              <text x="80" y="32" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#1d4ed8">Ε ＝ 18 · 8 ＝ 144 τ.εκ.</text>
              <text x="80" y="50" fontSize="10" textAnchor="middle" fill="#2563eb">18 εκ. × 8 εκ.</text>
            </g>

            <text x="225" y="65" fontSize="22" fontWeight="black" textAnchor="middle" fill="#64748b">＝</text>

            {/* Τετράγωνο 12x12 */}
            <g transform="translate(265, 10)">
              <rect x="0" y="0" width="100" height="100" rx="6" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2.2" />
              <text x="50" y="45" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#15803d">Ε ＝ 144 τ.εκ.</text>
              <text x="50" y="65" fontSize="12" fontWeight="black" textAnchor="middle" fill="#166534" fontFamily="monospace">α ＝ 12 εκ.</text>
            </g>

            <g transform="translate(255, 120)">
              <rect x="0" y="0" width="180" height="24" rx="6" fill="#16a34a" />
              <text x="90" y="16" fontSize="10.5" fontWeight="black" textAnchor="middle" fill="#ffffff">
                Π ＝ 4 · 12 ＝ 48 εκ. ⭐
              </text>
            </g>
          </svg>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono space-y-1.5">
          <div>• Εμβαδόν Ορθογωνίου: 18 · 8 ＝ <strong>144 τ.εκ.</strong></div>
          <div>• Εμβαδόν Τετραγώνου: α · α ＝ 144 ➔ <strong>α ＝ 12 εκ.</strong> (αφού 12 · 12 ＝ 144).</div>
          <div className="text-emerald-700 font-bold pt-1 border-t border-slate-200">
            • Περίμετρος Τετραγώνου: 4 · α ＝ 4 · 12 ＝ <strong>48 εκ.</strong>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 7,
    group: 'ΟΜΑΔΑ Α (4 ΕΠΙΛΟΓΕΣ)',
    prompt: 'Ο μέσος όρος των πόντων ενός μαθητή σε 4 γύρους ενός μαθηματικού διαγωνισμού είναι 16. Πόσους πόντους πρέπει να συγκεντρώσει στον 5ο γύρο ώστε ο συνολικός μέσος όρος του και στους 5 γύρους να γίνει 17;',
    options: ['18', '19', '20', '21'],
    correct: '21',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Συγκρίνουμε το <strong>συνολικό άθροισμα πόντων</strong> στους 4 αρχικούς γύρους με το επιθυμητό άθροισμα στους 5 γύρους[cite: 1]:
        </p>

        {/* SVG ΣΧΗΜΑ 7: ΠΛΗΡΩΣ RESPONSIVE ΧΩΡΙΣ SCROLL */}
        <div className="bg-white/90 p-3 sm:p-4 rounded-2xl border border-slate-200/90 my-2">
          <svg
            viewBox="0 0 620 185"
            className="w-full h-auto max-w-[620px] mx-auto block select-none font-sans"
          >
            <defs>
              <marker id="numline-arr-7" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 2 L 8 5 L 0 8 z" fill="#334155" />
              </marker>
            </defs>

            {/* Κεντρικός άξονας αριθμογραμμής */}
            <line x1="25" y1="95" x2="595" y2="95" stroke="#334155" strokeWidth="2.2" markerEnd="url(#numline-arr-7)" />

            {/* Παλιός Μέσος Όρος = 16 */}
            <g transform="translate(150, 95)">
              <line x1="0" y1="-30" x2="0" y2="30" stroke="#2563eb" strokeWidth="2.2" strokeDasharray="3 2" />
              <circle cx="0" cy="0" r="5.5" fill="#2563eb" />
              <rect x="-46" y="-62" width="92" height="26" rx="6" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1.2" />
              <text x="0" y="-45" fontSize="11" fontWeight="black" textAnchor="middle" fill="#1d4ed8">Μ.Ο. ＝ 16</text>
              <text x="0" y="24" fontSize="13" fontWeight="900" textAnchor="middle" fill="#1e40af">16</text>
              <text x="0" y="42" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#64748b">4 γύροι (64 π.)</text>
            </g>

            {/* Βέλος Αύξησης Μέσου Όρου (+1) */}
            <path d="M 165 42 Q 225 18 285 42" fill="none" stroke="#16a34a" strokeWidth="2" strokeDasharray="3 2" />
            <text x="225" y="23" fontSize="10.5" fontWeight="black" textAnchor="middle" fill="#15803d">＋1 στον Μ.Ο.</text>

            {/* Νέος Μέσος Όρος = 17 */}
            <g transform="translate(300, 95)">
              <line x1="0" y1="-30" x2="0" y2="30" stroke="#16a34a" strokeWidth="2.2" strokeDasharray="3 2" />
              <circle cx="0" cy="0" r="5.5" fill="#16a34a" />
              <rect x="-46" y="-62" width="92" height="26" rx="6" fill="#dcfce7" stroke="#86efac" strokeWidth="1.2" />
              <text x="0" y="-45" fontSize="11" fontWeight="black" textAnchor="middle" fill="#166534">Μ.Ο. ＝ 17</text>
              <text x="0" y="24" fontSize="13" fontWeight="900" textAnchor="middle" fill="#15803d">17</text>
              <text x="0" y="42" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#166534">5 γύροι (85 π.)</text>
            </g>

            {/* Ζητούμενος 5ος Γύρος = 21 */}
            <g transform="translate(500, 95)">
              <line x1="0" y1="-35" x2="0" y2="35" stroke="#ea580c" strokeWidth="2.5" />
              <circle cx="0" cy="0" r="6.5" fill="#ea580c" stroke="#9a3412" strokeWidth="1.5" />
              <rect x="-52" y="-64" width="104" height="28" rx="7" fill="#ea580c" />
              <text x="0" y="-46" fontSize="11.5" fontWeight="black" textAnchor="middle" fill="#ffffff">Στόχος: 21 ⭐</text>
              <text x="0" y="24" fontSize="15" fontWeight="900" textAnchor="middle" fill="#c2410c" fontFamily="monospace">21</text>
              <text x="0" y="42" fontSize="9" fontWeight="black" textAnchor="middle" fill="#ea580c">5ος γύρος (85 － 64)</text>
            </g>
          </svg>
        </div>

        {/* 1ος ΤΡΟΠΟΣ: ΜΕΣΩ ΣΥΝΟΛΙΚΟΥ ΑΘΡΟΙΣΜΑΤΟΣ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-2.5">
          <div className="font-sans font-bold text-blue-900 text-sm border-b border-slate-200 pb-1">
            🔷 1ος Τρόπος (Αλγεβρικά μέσω συνολικού αθροίσματος)
          </div>

          <p className="text-slate-700">
            Ο μέσος όρος ισούται με το πηλίκο του αθροίσματος των πόντων δια του πλήθους των γύρων[cite: 1]:
          </p>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Αρχικό άθροισμα 4 γύρων ＝ 4 · 16 ＝</span>
              <strong className="text-blue-700">64 πόντοι</strong>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-200">
              <span>• Επιθυμητό νέο άθροισμα 5 γύρων ＝ 5 · 17 ＝</span>
              <strong className="text-blue-700">85 πόντοι</strong>
            </div>

            <div className="pt-1 border-t border-slate-200">
              <span>• Αν συμβολίσουμε με <strong>x</strong> τους πόντους του 5ου γύρου:</span>
              <div className="pl-3 pt-0.5 space-y-1 text-slate-800">
                <div>64 ＋ x ＝ 85</div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span>x ＝ 85 － 64 ＝</span>
                  <strong className="text-emerald-700 text-base">21 πόντοι</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2ος ΤΡΟΠΟΣ: ΜΕΣΩ ΚΑΤΑΝΟΜΗΣ ΔΙΑΦΟΡΑΣ */}
        <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200/80 space-y-2">
          <div className="font-sans font-bold text-emerald-950 text-sm border-b border-emerald-200 pb-1">
            💡 2ος Τρόπος (Γρήγορος υπολογισμός μέσω μεταβολής του μέσου όρου)
          </div>

          <p className="text-slate-800">
            Συγκρίνουμε τον παλιό μέσο όρο (16) με τον επιθυμητό (17)[cite: 1]:
          </p>

          <div className="bg-white/90 p-3 rounded-xl border border-emerald-200 font-mono text-slate-900 space-y-1.5">
            <div>• Ο μέσος όρος πρέπει να αυξηθεί κατά: 17 － 16 ＝ <strong>＋1 πόντο</strong>[cite: 1].</div>
            <div>• Για να αυξηθεί ο μέσος όρος κατά 1 σε όλους τους <strong>5 γύρους</strong>, απαιτούνται επιπλέον: 5 · 1 ＝ <strong>＋5 πόντοι</strong>[cite: 1].</div>
            <div className="pt-1 border-t border-slate-200 flex items-center gap-2 flex-wrap">
              <span>• Πόντοι 5ου γύρου ＝ Παλιός Μ.Ο. ＋ Επιπλέον πόντοι ＝ 16 ＋ 5 ＝</span>
              <strong className="text-emerald-700 text-base">21 πόντοι</strong>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, στον 5ο γύρο πρέπει να συγκεντρώσει <strong>21 πόντους</strong>[cite: 1].
        </p>
      </div>
    )
  },
  {
    id: 8,
    group: 'ΟΜΑΔΑ Α (4 ΕΠΙΛΟΓΕΣ)',
    prompt: 'Στην αριθμητική ακολουθία 4, 9, 14, 19, 24, ... ποιος είναι ο 40ός όρος;',
    options: ['194', '199', '200', '204'],
    correct: '199',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Παρατηρούμε ότι κάθε όρος της ακολουθίας προκύπτει προσθέτοντας σταθερά το <strong>5</strong> στον προηγούμενό του (σταθερό βήμα $\omega ＝ 5$):
        </p>

        {/* SVG ΣΧΗΜΑ 8: ΠΛΗΡΩΣ RESPONSIVE ΧΩΡΙΣ SCROLL */}
        <div className="bg-white/90 p-3 sm:p-4 rounded-2xl border border-slate-200/90 my-2">
          <svg
            viewBox="0 0 620 180"
            className="w-full h-auto max-w-[620px] mx-auto block select-none font-sans"
          >
            <defs>
              <marker id="step-arr-8" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#2563eb" />
              </marker>
              <marker id="step-arr-target-8" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#16a34a" />
              </marker>
            </defs>

            {/* 1ος όρος */}
            <g transform="translate(20, 55)">
              <rect x="0" y="0" width="68" height="50" rx="10" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
              <text x="34" y="20" fontSize="9.5" fontWeight="bold" textAnchor="middle" fill="#1d4ed8">1ος όρος</text>
              <text x="34" y="41" fontSize="17" fontWeight="900" textAnchor="middle" fill="#1e40af" fontFamily="monospace">4</text>
            </g>

            {/* Τόξο 1 -> 2 */}
            <path d="M 90 54 Q 115 26 140 54" fill="none" stroke="#2563eb" strokeWidth="2" markerEnd="url(#step-arr-8)" />
            <text x="115" y="27" fontSize="11" fontWeight="black" textAnchor="middle" fill="#1d4ed8">＋5</text>

            {/* 2ος όρος */}
            <g transform="translate(142, 55)">
              <rect x="0" y="0" width="68" height="50" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.6" />
              <text x="34" y="20" fontSize="9.5" fontWeight="bold" textAnchor="middle" fill="#475569">2ος όρος</text>
              <text x="34" y="41" fontSize="17" fontWeight="900" textAnchor="middle" fill="#0f172a" fontFamily="monospace">9</text>
            </g>

            {/* Τόξο 2 -> 3 */}
            <path d="M 212 54 Q 237 26 262 54" fill="none" stroke="#2563eb" strokeWidth="2" markerEnd="url(#step-arr-8)" />
            <text x="237" y="27" fontSize="11" fontWeight="black" textAnchor="middle" fill="#1d4ed8">＋5</text>

            {/* 3ος όρος */}
            <g transform="translate(264, 55)">
              <rect x="0" y="0" width="68" height="50" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.6" />
              <text x="34" y="20" fontSize="9.5" fontWeight="bold" textAnchor="middle" fill="#475569">3ος όρος</text>
              <text x="34" y="41" fontSize="17" fontWeight="900" textAnchor="middle" fill="#0f172a" fontFamily="monospace">14</text>
            </g>

            {/* Ενδιάμεση γέφυρα 39 αλμάτων */}
            <path d="M 334 54 C 370 10, 440 10, 470 54" fill="none" stroke="#16a34a" strokeWidth="2.4" strokeDasharray="4 3" markerEnd="url(#step-arr-target-8)" />
            <rect x="360" y="10" width="95" height="24" rx="6" fill="#dcfce7" stroke="#86efac" strokeWidth="1" />
            <text x="407.5" y="26" fontSize="10.5" fontWeight="black" textAnchor="middle" fill="#166534">
              ＋ 39 · 5
            </text>

            {/* 40ός όρος (Στόχος) */}
            <g transform="translate(476, 42)">
              <rect x="0" y="0" width="124" height="72" rx="12" fill="#dcfce7" stroke="#16a34a" strokeWidth="2.5" />
              <text x="62" y="24" fontSize="11" fontWeight="black" textAnchor="middle" fill="#166534">40ός Όρος ⭐</text>
              <text x="62" y="50" fontSize="21" fontWeight="900" textAnchor="middle" fill="#15803d" fontFamily="monospace">199</text>
              <text x="62" y="65" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#166534">(4 ＋ 195)</text>
            </g>

            {/* Κάτω λωρίδα τύπου */}
            <g transform="translate(20, 130)">
              <rect x="0" y="0" width="580" height="38" rx="10" fill="#0f172a" />
              <text x="290" y="24" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#ffffff" fontFamily="monospace">
                Τύπος: α₄₀ ＝ 4 ＋ (40 － 1) · 5 ＝ 4 ＋ 39 · 5 ＝ 199
              </text>
            </g>
          </svg>
        </div>

        {/* ΑΝΑΛΥΤΙΚΟΙ ΤΡΟΠΟΙ ΕΠΙΛΥΣΗΣ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-3">
          {/* 1ος Τρόπος */}
          <div className="space-y-1.5">
            <div className="font-sans font-bold text-blue-900 border-b border-slate-200 pb-1">
              🔷 1ος Τρόπος (Υπολογισμός με τα ενδιάμεσα βήματα)
            </div>
            <p className="text-slate-700">
              Ξεκινώντας από τον 1ο όρο (4), για να φτάσουμε στον 40ό όρο εκτελούμε:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
              <div>• <strong>Πλήθος ενδιάμεσων βημάτων:</strong> 40 － 1 ＝ <strong>39 βήματα</strong>[cite: 1].</div>
              <div>• <strong>Συνολική αύξηση:</strong> 39 · 5 ＝ <strong>195</strong>.</div>
              <div className="pt-1 border-t border-slate-200 text-emerald-800 font-bold">
                • <strong>40ός όρος ＝</strong> 4 ＋ 195 ＝ <span className="text-base text-emerald-700 font-black">199</span>[cite: 1].
              </div>
            </div>
          </div>

          {/* 2ος Τρόπος */}
          <div className="space-y-1.5 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-blue-900 border-b border-slate-200 pb-1">
              🔷 2ος Τρόπος (Με τον γενικό κανόνα της ακολουθίας)
            </div>
            <p className="text-slate-700">
              Παρατηρούμε τη σχέση του αριθμού θέσης ($n$) με την προπαίδεια του 5:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
              <div>• 1ος όρος ($n = 1$): 5 · 1 － 1 ＝ <strong>4</strong></div>
              <div>• 2ος όρος ($n = 2$): 5 · 2 － 1 ＝ <strong>9</strong></div>
              <div>• 3ος όρος ($n = 3$): 5 · 3 － 1 ＝ <strong>14</strong></div>
              <div className="pt-1 border-t border-slate-200 text-slate-600 font-sans text-xs">
                Κάθε όρος ισούται με το πενταπλάσιο της θέσης του μειωμένο κατά 1 ($5 · n － 1$):
              </div>
              <div className="pt-0.5 text-emerald-800 font-bold text-base">
                • Για $n = 40$: 5 · 40 － 1 ＝ 200 － 1 ＝ <span className="text-emerald-700 font-black">199</span>[cite: 1].
              </div>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, ο 40ός όρος της αριθμητικής ακολουθίας είναι το <strong>199</strong>[cite: 1].
        </p>
      </div>
    )
  },
  {
    id: 9,
    group: 'ΟΜΑΔΑ Α (4 ΕΠΙΛΟΓΕΣ)',
    prompt: 'Σε μια ατελή διαίρεση φυσικών αριθμών, ο διαιρέτης είναι το 12 και το πηλίκο είναι το 15. Ποιος είναι ο μέγιστος δυνατός διαιρετέος;',
    options: ['180', '191', '192', '195'],
    correct: '191',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Αξιοποιούμε την <strong>ταυτότητα της ευκλείδειας διαίρεσης</strong> (<span className="font-mono font-bold">Δ ＝ δ · π ＋ υ</span>) και τη βασική ιδιότητα ότι το υπόλοιπο είναι πάντοτε <strong>αυστηρά μικρότερο από τον διαιρέτη</strong> (<span className="font-mono font-bold">υ &lt; δ</span>):
        </p>

        {/* SVG ΣΧΗΜΑ 9: ΠΛΗΡΩΣ RESPONSIVE ΧΩΡΙΣ SCROLL (FLUID VIEWBOX) */}
        <div className="bg-white/90 p-3 sm:p-4 rounded-2xl border border-slate-200/90 my-2">
          <svg
            viewBox="0 0 560 190"
            className="w-full h-auto max-w-[560px] mx-auto block select-none font-sans"
          >
            {/* 1. ΣΧΗΜΑ ΚΛΑΣΙΚΗΣ ΔΙΑΙΡΕΣΗΣ (ΑΡΙΣΤΕΡΑ) */}
            <g transform="translate(30, 20)">
              {/* Γραμμές διαίρεσης (γωνία) */}
              <line x1="120" y1="5" x2="120" y2="95" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="120" y1="48" x2="225" y2="48" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />

              {/* Διαιρετέος Δ_max */}
              <rect x="0" y="8" width="105" height="34" rx="8" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" />
              <text x="52.5" y="30" fontSize="13" fontWeight="900" textAnchor="middle" fill="#15803d" fontFamily="monospace">
                Δ_max ＝ ?
              </text>
              <text x="52.5" y="55" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#64748b">
                (Διαιρετέος)
              </text>

              {/* Διαιρέτης δ = 12 */}
              <rect x="130" y="8" width="85" height="34" rx="8" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.8" />
              <text x="172.5" y="30" fontSize="13" fontWeight="900" textAnchor="middle" fill="#1d4ed8" fontFamily="monospace">
                δ ＝ 12
              </text>

              {/* Πηλίκο π = 15 */}
              <rect x="130" y="55" width="85" height="34" rx="8" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.8" />
              <text x="172.5" y="77" fontSize="13" fontWeight="900" textAnchor="middle" fill="#1d4ed8" fontFamily="monospace">
                π ＝ 15
              </text>

              {/* Υπόλοιπο υ_max = 11 */}
              <rect x="10" y="66" width="85" height="32" rx="8" fill="#fef2f2" stroke="#ef4444" strokeWidth="1.8" />
              <text x="52.5" y="86" fontSize="12" fontWeight="900" textAnchor="middle" fill="#dc2626" fontFamily="monospace">
                υ ＝ 11
              </text>
              <text x="52.5" y="112" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#dc2626">
                (υ_max ＝ δ － 1)
              </text>
            </g>

            {/* 2. ΠΛΑΙΣΙΟ ΚΑΝΟΝΑ & ΥΠΟΛΟΓΙΣΜΟΥ (ΔΕΞΙΑ) */}
            <g transform="translate(280, 20)">
              <rect x="0" y="0" width="250" height="96" rx="12" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
              
              <text x="16" y="24" fontSize="10.5" fontWeight="bold" fill="#0f172a">
                • Βασική σχέση: <tspan fontWeight="900" fill="#dc2626">υ &lt; δ</tspan>
              </text>
              <text x="16" y="44" fontSize="10" fill="#475569">
                Αφού δ ＝ 12 ➔ υ ∈ &#123;0, 1, ..., 11&#125;
              </text>
              <line x1="14" y1="56" x2="236" y2="56" stroke="#e2e8f0" strokeWidth="1" />
              <text x="16" y="74" fontSize="10.5" fontWeight="bold" fill="#15803d">
                • Μέγιστο υπόλοιπο:
              </text>
              <text x="16" y="88" fontSize="11" fontWeight="900" fill="#166534" fontFamily="monospace">
                υ_max ＝ 12 － 1 ＝ 11
              </text>
            </g>

            {/* 3. ΚΑΤΩ ΕΝΙΑΙΟ BADGE ΤΑΥΤΟΤΗΤΑΣ */}
            <g transform="translate(30, 138)">
              <rect x="0" y="0" width="500" height="42" rx="10" fill="#0f172a" />
              <text x="250" y="26" fontSize="13" fontWeight="900" textAnchor="middle" fill="#ffffff" fontFamily="monospace">
                Δ_max ＝ 12 · 15 ＋ 11 ＝ 180 ＋ 11 ＝ 191 ⭐
              </text>
            </g>
          </svg>
        </div>

        {/* ΑΝΑΛΥΤΙΚΟΙ ΤΡΟΠΟΙ ΕΠΙΛΥΣΗΣ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-3">
          {/* 1ος Τρόπος: Μέσω της Ευκλείδειας Διαίρεσης */}
          <div className="space-y-1.5">
            <div className="font-sans font-bold text-blue-900 border-b border-slate-200 pb-1">
              🔷 1ος Τρόπος (Ταυτότητα Ευκλείδειας Διαίρεσης & Μέγιστο Υπόλοιπο)
            </div>
            <p className="text-slate-700">
              Η ταυτότητα της διαίρεσης συνδέει τους όρους με τη σχέση:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
              <div className="font-bold text-slate-800">
                Διαιρετέος ＝ (Διαιρέτης · Πηλίκο) ＋ Υπόλοιπο
              </div>
              <div className="pt-1 border-t border-slate-200 text-slate-700 font-sans text-xs">
                Σε κάθε διαίρεση το υπόλοιπο είναι φυσικός αριθμός αυστηρά μικρότερος του διαιρέτη (<span className="font-mono font-bold">υ &lt; δ</span>). Επειδή ο διαιρέτης είναι <strong>12</strong>:
              </div>
              <div>• Δυνατά υπόλοιπα: 0, 1, 2, ..., <strong>11</strong>[cite: 1].</div>
              <div className="pt-1 border-t border-slate-200 text-slate-700 font-sans text-xs">
                Για να γίνει ο διαιρετέος <strong>μέγιστος δυνατός</strong>, πρέπει να προσθέσουμε το <strong>μέγιστο δυνατό υπόλοιπο</strong>:
              </div>
              <div className="text-emerald-800 font-bold text-base">
                Δ_max ＝ 12 · 15 ＋ 11 ＝ 180 ＋ 11 ＝ <span className="text-emerald-700 font-black">191</span>[cite: 1]
              </div>
            </div>
          </div>

          {/* 2ος Τρόπος: Μέσω Πολλαπλασίων του Διαιρέτη */}
          <div className="space-y-1.5 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-blue-900 border-b border-slate-200 pb-1">
              🔷 2ος Τρόπος (Συλλογισμός μέσω του επόμενου πολλαπλασίου)
            </div>
            <p className="text-slate-700">
              Σκεφτόμαστε πότε αλλάζει το πηλίκο σε 16[cite: 1]:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
              <div>• Για Δ ＝ 12 · 15 ＝ <strong>180</strong>, η διαίρεση είναι τέλεια (υ ＝ 0, π ＝ 15)[cite: 1].</div>
              <div>• Για Δ ＝ 12 · 16 ＝ <strong>192</strong>, το πηλίκο γίνεται 16 (και όχι 15)[cite: 1].</div>
              <div className="pt-1 border-t border-slate-200 text-slate-700 font-sans text-xs">
                Άρα, ο μεγαλύτερος αριθμός που εξακολουθεί να δίνει πηλίκο 15 είναι ο αμέσως προηγούμενος φυσικός του 192:
              </div>
              <div className="text-emerald-800 font-bold text-base pt-0.5">
                Δ_max ＝ 192 － 1 ＝ <span className="text-emerald-700 font-black">191</span>[cite: 1]
              </div>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, ο μέγιστος δυνατός διαιρετέος είναι το <strong>191</strong>[cite: 1].
        </p>
      </div>
    )
  },
  {
    id: 10,
    group: 'ΟΜΑΔΑ Α (4 ΕΠΙΛΟΓΕΣ)',
    prompt: 'Ο Νίκος ξόδεψε το 1/3 των χρημάτων του για να αγοράσει ένα βιβλίο. Στη συνέχεια, ξόδεψε το 1/4 των υπολοίπων χρημάτων του για ένα παιχνίδι. Αν του έμειναν 30 ευρώ, πόσα χρήματα είχε αρχικά;',
    options: ['48 €', '60 €', '72 €', '90 €'],
    correct: '60 €',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Αναλύουμε τα χρήματα που απομένουν μετά από κάθε αγορά, εξετάζοντας τι μέρος του συνολικού ποσού αντιστοιχεί στα <strong>30 €</strong>[cite: 1]:
        </p>

        {/* SVG ΣΧΗΜΑ 10: ΠΛΗΡΩΣ RESPONSIVE ΧΩΡΙΣ SCROLL */}
        <div className="bg-white/90 p-3 sm:p-4 rounded-2xl border border-slate-200/90 my-2">
          <svg
            viewBox="0 0 620 220"
            className="w-full h-auto max-w-[620px] mx-auto block select-none font-sans"
          >
            {/* 1. ΑΡΧΙΚΟ ΠΟΣΟ (3 ΤΡΙΤΑ) */}
            <g transform="translate(20, 16)">
              <text x="0" y="14" fontSize="11" fontWeight="bold" fill="#0f172a">
                1ο Στάδιο: Αρχικό Ποσό χωρισμένο σε 3 τρίτα (3/3)
              </text>

              <g transform="translate(0, 24)">
                {/* 1/3 Βιβλίο */}
                <rect x="0" y="0" width="190" height="46" rx="8" fill="#fee2e2" stroke="#ef4444" strokeWidth="1.8" />
                <text x="95" y="20" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#dc2626">📖 Βιβλίο: 1/3</text>
                <text x="95" y="36" fontSize="12" fontWeight="black" textAnchor="middle" fill="#b91c1c" fontFamily="monospace">20 €</text>

                {/* 2/3 Υπόλοιπο */}
                <rect x="195" y="0" width="385" height="46" rx="8" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.8" />
                <text x="387.5" y="20" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#1d4ed8">Υπόλοιπο μετά το βιβλίο: 2/3</text>
                <text x="387.5" y="36" fontSize="12.5" fontWeight="black" textAnchor="middle" fill="#1e40af" fontFamily="monospace">40 €</text>
              </g>
            </g>

            {/* ΔΙΑΧΩΡΙΣΤΙΚΗ ΓΡΑΜΜΗ */}
            <line x1="20" y1="102" x2="600" y2="102" stroke="#e2e8f0" strokeWidth="1.2" />

            {/* 2. ΑΝΑΛΥΣΗ ΤΟΥ ΥΠΟΛΟΙΠΟΥ ΣΕ 4 ΤΕΤΑΡΤΑ */}
            <g transform="translate(20, 114)">
              <text x="0" y="14" fontSize="11" fontWeight="bold" fill="#0f172a">
                2ο Στάδιο: Το υπόλοιπο χωρίζεται σε 4 ίσα τέταρτα (των 10 € το καθένα)
              </text>

              <g transform="translate(195, 24)">
                {/* 1/4 Παιχνίδι */}
                <rect x="0" y="0" width="92" height="44" rx="6" fill="#fef2f2" stroke="#ef4444" strokeWidth="1.6" />
                <text x="46" y="18" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#dc2626">🎮 Παιχνίδι (1/4)</text>
                <text x="46" y="34" fontSize="11" fontWeight="black" textAnchor="middle" fill="#b91c1c" fontFamily="monospace">10 €</text>

                {/* 3/4 Τελικό Υπόλοιπο (30€) */}
                <rect x="97" y="0" width="288" height="44" rx="8" fill="#dcfce7" stroke="#16a34a" strokeWidth="2.2" />
                <text x="241" y="18" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#166534">💰 Τελικό Υπόλοιπο: 3/4 του υπολοίπου</text>
                <text x="241" y="35" fontSize="13.5" fontWeight="900" textAnchor="middle" fill="#15803d" fontFamily="monospace">30 € ⭐</text>
              </g>
            </g>

            {/* ΚΑΤΩ ΕΝΙΑΙΟ BADGE */}
            <g transform="translate(20, 192)">
              <text x="300" y="0" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#047857">
                3 τέταρτα ＝ 30 € ➔ 1 τέταρτο ＝ 10 € ➔ Υπόλοιπο ＝ 40 € ➔ Αρχικό (3 τρίτα) ＝ 60 €
              </text>
            </g>
          </svg>
        </div>

        {/* ΑΝΑΛΥΤΙΚΟΙ ΤΡΟΠΟΙ ΕΠΙΛΥΣΗΣ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-3">
          {/* 1ος Τρόπος: Βήμα-βήμα προς τα πίσω */}
          <div className="space-y-1.5">
            <div className="font-sans font-bold text-blue-900 border-b border-slate-200 pb-1">
              🔷 1ος Τρόπος (Υπολογισμός προς τα πίσω με κλάσματα)
            </div>
            <p className="text-slate-700">
              Ξεκινάμε από το τελικό ποσό (30 €) και πηγαίνουμε προς την αρχή[cite: 1]:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
              <div>
                • <strong>Βήμα 1 (Πριν την αγορά του παιχνιδιού):</strong>
                <div className="pl-3 text-slate-700 font-sans text-xs pt-0.5">
                  Ξόδεψε το <Fraction num="1" den="4" /> του ενδιάμεσου ποσού, άρα του έμειναν τα <Fraction num="3" den="4" />[cite: 1]:
                </div>
                <div className="flex items-center gap-1.5 flex-wrap pl-3 pt-1">
                  <span>Ενδιάμεσο ποσό ＝ 30 :</span>
                  <Fraction num="3" den="4" />
                  <span>＝ 30 ·</span>
                  <Fraction num="4" den="3" />
                  <span>＝ 10 · 4 ＝ <strong className="text-blue-700">40 €</strong></span>
                </div>
              </div>

              <div className="pt-1 border-t border-slate-200">
                • <strong>Βήμα 2 (Πριν την αγορά του βιβλίου - Αρχικό ποσό):</strong>
                <div className="pl-3 text-slate-700 font-sans text-xs pt-0.5">
                  Ξόδεψε το <Fraction num="1" den="3" /> των αρχικών χρημάτων, άρα τα 40 € αντιστοιχούν στα <Fraction num="2" den="3" /> του αρχικού ποσού[cite: 1]:
                </div>
                <div className="flex items-center gap-1.5 flex-wrap pl-3 pt-1 text-emerald-800 font-bold">
                  <span>Αρχικό Ποσό ＝ 40 :</span>
                  <Fraction num="2" den="3" />
                  <span>＝ 40 ·</span>
                  <Fraction num="3" den="2" />
                  <span>＝ 20 · 3 ＝ <span className="text-base text-emerald-700 font-black">60 €</span> ⭐</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2ος Τρόπος: Αλγεβρικά με εξίσωση */}
          <div className="space-y-1.5 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-blue-900 border-b border-slate-200 pb-1">
              🔷 2ος Τρόπος (Αλγεβρικά με εξίσωση και άγνωστο x)
            </div>
            <p className="text-slate-700">
              Έστω <strong>x</strong> το συνολικό αρχικό ποσό σε ευρώ[cite: 1]:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span>• Έξοδο για το βιβλίο:</span>
                <Fraction num="1" den="3" />
                <span>· x</span>
              </div>

              <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-slate-200">
                <span>• Υπόλοιπο μετά το βιβλίο: x －</span>
                <Fraction num="1" den="3" />
                <span>· x ＝</span>
                <Fraction num="2" den="3" />
                <span>· x</span>
              </div>

              <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-slate-200">
                <span>• Τελικό ποσό που του μένει (τα 3/4 του υπολοίπου):</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap pl-3">
                <Fraction num="3" den="4" />
                <span>·</span>
                <Fraction num="2" den="3" />
                <span>· x ＝ 30</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap pl-3">
                <Fraction num="6" den="12" />
                <span>· x ＝ 30 ➔</span>
                <Fraction num="1" den="2" />
                <span>· x ＝ 30 ➔ <strong className="text-emerald-700 text-base font-black">x ＝ 60 €</strong></span>
              </div>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, ο Νίκος είχε αρχικά <strong>60 €</strong>[cite: 1].
        </p>
      </div>
    )
  },
  {
    id: 11,
    group: 'ΟΜΑΔΑ Β (5 ΕΠΙΛΟΓΕΣ)',
    prompt: 'Έχουμε δύο δοχεία με διαλύματα αλατόνερου. Το δοχείο Α περιέχει 200 γραμμάρια διαλύματος με 10% αλάτι, ενώ το δοχείο Β περιέχει 300 γραμμάρια διαλύματος με 20% αλάτι. Αναμειγνύουμε τα δύο διαλύματα σε ένα τρίτο δοχείο Γ. Ποιο είναι το ποσοστό αλατιού στο νέο διάλυμα Γ;',
    options: ['14%', '15%', '16%', '17,5%', '18%'],
    correct: '16%',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Για να βρούμε την περιεκτικότητα του νέου μείγματος, υπολογίζουμε ξεχωριστά την <strong>καθαρή ποσότητα αλατιού</strong> σε κάθε δοχείο και τη συγκρίνουμε με το <strong>συνολικό βάρος του μείγματος</strong>:
        </p>

        {/* SVG ΣΧΗΜΑ 11: ΠΛΗΡΩΣ RESPONSIVE ΧΩΡΙΣ SCROLL */}
        <div className="bg-white/90 p-3 sm:p-4 rounded-2xl border border-slate-200/90 my-2">
          <svg
            viewBox="0 0 620 220"
            className="w-full h-auto max-w-[620px] mx-auto block select-none font-sans"
          >
            <defs>
              <marker id="mix-arr-11" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#0284c7" />
              </marker>
            </defs>

            {/* 1. ΔΟΧΕΙΟ Α (200 g, 10% αλάτι = 20 g) */}
            <g transform="translate(30, 20)">
              <text x="65" y="0" fontSize="11.5" fontWeight="black" textAnchor="middle" fill="#0f172a">Δοχείο Α</text>
              {/* Περίγραμμα δοχείου */}
              <rect x="0" y="10" width="130" height="95" rx="6" fill="#f8fafc" stroke="#3b82f6" strokeWidth="1.8" />
              {/* Νερό (180 g) */}
              <rect x="2" y="32" width="126" height="50" fill="#e0f2fe" />
              <text x="65" y="60" fontSize="9.5" fontWeight="bold" textAnchor="middle" fill="#0369a1">Νερό: 180 g</text>
              {/* Αλάτι στη βάση (20 g = 10%) */}
              <rect x="2" y="82" width="126" height="21" rx="2" fill="#fed7aa" stroke="#f97316" strokeWidth="1" />
              <text x="65" y="96" fontSize="10" fontWeight="black" textAnchor="middle" fill="#c2410c">Αλάτι: 20 g (10%)</text>
              {/* Ετικέτα βάρους */}
              <text x="65" y="120" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#1e40af">Σύνολο: 200 g</text>
            </g>

            {/* Σύμβολο πρόσθεσης (+) */}
            <text x="195" y="80" fontSize="22" fontWeight="black" textAnchor="middle" fill="#64748b">＋</text>

            {/* 2. ΔΟΧΕΙΟ Β (300 g, 20% αλάτι = 60 g) */}
            <g transform="translate(230, 20)">
              <text x="75" y="0" fontSize="11.5" fontWeight="black" textAnchor="middle" fill="#0f172a">Δοχείο Β</text>
              <rect x="0" y="10" width="150" height="95" rx="6" fill="#f8fafc" stroke="#3b82f6" strokeWidth="1.8" />
              {/* Νερό (240 g) */}
              <rect x="2" y="24" width="146" height="46" fill="#e0f2fe" />
              <text x="75" y="52" fontSize="9.5" fontWeight="bold" textAnchor="middle" fill="#0369a1">Νερό: 240 g</text>
              {/* Αλάτι στη βάση (60 g = 20%) */}
              <rect x="2" y="70" width="146" height="33" rx="2" fill="#fed7aa" stroke="#f97316" strokeWidth="1" />
              <text x="75" y="90" fontSize="10" fontWeight="black" textAnchor="middle" fill="#c2410c">Αλάτι: 60 g (20%)</text>
              <text x="75" y="120" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#1e40af">Σύνολο: 300 g</text>
            </g>

            {/* Βέλος ανάμειξης */}
            <g transform="translate(400, 75)">
              <line x1="5" y1="0" x2="30" y2="0" stroke="#0284c7" strokeWidth="2.5" markerEnd="url(#mix-arr-11)" />
            </g>

            {/* 3. ΔΟΧΕΙΟ Γ (500 g, 80 g αλάτι = 16%) */}
            <g transform="translate(450, 10)">
              <text x="70" y="8" fontSize="12" fontWeight="black" textAnchor="middle" fill="#166534">Δοχείο Γ (Μείγμα)</text>
              <rect x="0" y="18" width="140" height="105" rx="8" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2.4" />
              {/* Συνολικό νερό (420 g) */}
              <rect x="2" y="32" width="136" height="48" fill="#e0f2fe" />
              <text x="70" y="60" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#0369a1">Νερό: 420 g</text>
              {/* Συνολικό αλάτι (80 g) */}
              <rect x="2" y="80" width="136" height="41" rx="3" fill="#fed7aa" stroke="#16a34a" strokeWidth="1.2" />
              <text x="70" y="98" fontSize="10.5" fontWeight="black" textAnchor="middle" fill="#15803d">Αλάτι: 80 g</text>
              <text x="70" y="112" fontSize="11" fontWeight="black" textAnchor="middle" fill="#166534">(20 g ＋ 60 g)</text>
              {/* Badge περιεκτικότητας */}
              <rect x="-10" y="132" width="160" height="28" rx="8" fill="#16a34a" />
              <text x="70" y="150" fontSize="12" fontWeight="black" textAnchor="middle" fill="#ffffff">
                Ποσοστό: 16% ⭐
              </text>
            </g>

            {/* ΚΑΤΩ ΕΝΙΑΙΟ ΠΛΑΙΣΙΟ */}
            <g transform="translate(25, 175)">
              <rect x="0" y="0" width="570" height="34" rx="8" fill="#0f172a" />
              <text x="285" y="21" fontSize="11.5" fontWeight="bold" textAnchor="middle" fill="#ffffff" fontFamily="monospace">
                Σύνολο Αλατιού: 80 g &nbsp;|&nbsp; Σύνολο Διαλύματος: 500 g ➔ 80 : 500 ＝ 16 : 100 ＝ 16%
              </text>
            </g>
          </svg>
        </div>

        {/* ΑΝΑΛΥΤΙΚΟΙ ΤΡΟΠΟΙ ΕΠΙΛΥΣΗΣ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-3">
          {/* 1ος Τρόπος: Βήμα-βήμα υπολογισμός μαζών */}
          <div className="space-y-1.5">
            <div className="font-sans font-bold text-blue-900 border-b border-slate-200 pb-1">
              🔷 1ος Τρόπος (Υπολογισμός καθαρού αλατιού και αναγωγή στο 100)
            </div>
            <p className="text-slate-700">
              Βρίσκουμε την ακριβή ποσότητα καθαρού αλατιού σε γραμμάρια από κάθε δοχείο:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
              <div>
                • <strong>Καθαρό αλάτι στο δοχείο Α:</strong>
                <div className="pl-3 pt-0.5 flex items-center gap-1.5 flex-wrap text-slate-800">
                  <span>10% επί των 200 g ＝</span>
                  <Fraction num="10" den="100" />
                  <span>· 200 ＝ 0,10 · 200 ＝ <strong className="text-blue-700">20 γραμμάρια αλάτι</strong></span>
                </div>
              </div>

              <div className="pt-1 border-t border-slate-200">
                • <strong>Καθαρό αλάτι στο δοχείο Β:</strong>
                <div className="pl-3 pt-0.5 flex items-center gap-1.5 flex-wrap text-slate-800">
                  <span>20% επί των 300 g ＝</span>
                  <Fraction num="20" den="100" />
                  <span>· 300 ＝ 0,20 · 300 ＝ <strong className="text-blue-700">60 γραμμάρια αλάτι</strong></span>
                </div>
              </div>

              <div className="pt-1 border-t border-slate-200 space-y-1">
                • <strong>Ανάμειξη στο δοχείο Γ:</strong>
                <div className="pl-3 text-slate-800">
                  <div>• Συνολικό καθαρό αλάτι: 20 ＋ 60 ＝ <strong>80 γραμμάρια</strong></div>
                  <div>• Συνολικό βάρος μείγματος: 200 ＋ 300 ＝ <strong>500 γραμμάρια</strong></div>
                </div>
              </div>

              <div className="pt-1 border-t border-slate-200">
                • <strong>Υπολογισμός ποσοστού επί τοις εκατό (%):</strong>
                <div className="pl-3 pt-1 flex items-center gap-2 flex-wrap text-emerald-800 font-bold">
                  <span>Ποσοστό ＝</span>
                  <Fraction num="Καθαρό Αλάτι" den="Συνολικό Μείγμα" />
                  <span>＝</span>
                  <Fraction num="80" den="500" />
                  <span>＝</span>
                  <Fraction num="80 : 5" den="500 : 5" />
                  <span>＝</span>
                  <Fraction num="16" den="100" />
                  <span>＝ <span className="text-base text-emerald-700 font-black">16%</span> ⭐</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2ος Τρόπος: Σταθμισμένος μέσος όρος με κλάσματα */}
          <div className="space-y-1.5 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-blue-900 border-b border-slate-200 pb-1">
              🔷 2ος Τρόπος (Σταθμισμένος μέσος όρος αναλογίας μαζών)
            </div>
            <p className="text-slate-700">
              Εκφράζουμε τη συμμετοχή κάθε διαλύματος ως κλάσμα του συνολικού όγκου (500 g):
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>• Το δοχείο Α αποτελεί τα:</span>
                <Fraction num="200" den="500" />
                <span>＝</span>
                <Fraction num="2" den="5" />
                <span>του μείγματος (με περιεκτικότητα 10%).</span>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-200">
                <span>• Το δοχείο Β αποτελεί τα:</span>
                <Fraction num="300" den="500" />
                <span>＝</span>
                <Fraction num="3" den="5" />
                <span>του μείγματος (με περιεκτικότητα 20%).</span>
              </div>

              <div className="pt-1 border-t border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span>Τελικό Ποσοστό ＝ (</span>
                  <Fraction num="2" den="5" />
                  <span>· 10%) ＋ (</span>
                  <Fraction num="3" den="5" />
                  <span>· 20%)</span>
                </div>
                <div className="pl-3 text-slate-800">
                  <div>＝ 4% ＋ 12% ＝ <strong className="text-emerald-700 text-base font-black">16%</strong></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, το ποσοστό αλατιού στο νέο διάλυμα Γ είναι <strong>16%</strong>.
        </p>
      </div>
    )
  },
  {
    id: 12,
    group: 'ΟΜΑΔΑ Β (5 ΕΠΙΛΟΓΕΣ)',
    prompt: 'Σε ένα τετράγωνο πλευράς 20 εκ. εγγράφεται ο μέγιστος δυνατός κύκλος. Πόσο είναι το εμβαδόν του χωρίου που βρίσκεται μέσα στο τετράγωνο αλλά έξω από τον κύκλο; (Δίνεται π ≈ 3,14).',
    options: ['64 τ.εκ.', '72 τ.εκ.', '86 τ.εκ.', '94 τ.εκ.', '100 τ.εκ.'],
    correct: '86 τ.εκ.',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Για να βρούμε το εμβαδόν του χωρίου που απομένει στις τέσσερις γωνίες, αφαιρούμε το <strong>εμβαδόν του εγγεγραμμένου κύκλου</strong> από το <strong>εμβαδόν του τετραγώνου</strong>:
        </p>

        {/* SVG ΣΧΗΜΑ 12: ΠΛΗΡΩΣ RESPONSIVE ΧΩΡΙΣ SCROLL */}
        <div className="bg-white/90 p-3 sm:p-4 rounded-2xl border border-slate-200/90 my-2">
          <svg
            viewBox="0 0 620 220"
            className="w-full h-auto max-w-[620px] mx-auto block select-none font-sans"
          >
            {/* 1. ΓΕΩΜΕΤΡΙΚΟ ΣΧΗΜΑ (ΑΡΙΣΤΕΡΑ) */}
            <g transform="translate(30, 20)">
              {/* Τετράγωνο (πορτοκαλί βάση για τις 4 γωνίες) */}
              <rect x="0" y="0" width="170" height="170" rx="4" fill="#fed7aa" stroke="#ea580c" strokeWidth="2.2" />

              {/* Εγγεγραμμένος Κύκλος (κέντρο 85, 85, ακτίνα R = 85) */}
              <circle cx="85" cy="85" r="85" fill="#eff6ff" stroke="#2563eb" strokeWidth="2" />

              {/* Ενδείξεις στις 4 γωνίες */}
              <text x="16" y="24" fontSize="9" fontWeight="black" fill="#c2410c">Ζητούμενο</text>
              <text x="154" y="24" fontSize="9" fontWeight="black" textAnchor="end" fill="#c2410c">Ζητούμενο</text>
              <text x="16" y="160" fontSize="9" fontWeight="black" fill="#c2410c">Ζητούμενο</text>
              <text x="154" y="160" fontSize="9" fontWeight="black" textAnchor="end" fill="#c2410c">Ζητούμενο</text>

              {/* Ακτίνα κύκλου r = 10 εκ. */}
              <line x1="85" y1="85" x2="170" y2="85" stroke="#2563eb" strokeWidth="2" strokeDasharray="3 2" />
              <circle cx="85" cy="85" r="3.5" fill="#1d4ed8" />
              <text x="127" y="78" fontSize="10" fontWeight="black" textAnchor="middle" fill="#1d4ed8">r ＝ 10 εκ.</text>

              {/* Εσωτερική ετικέτα κύκλου */}
              <text x="85" y="110" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#1e40af">
                Ε_κύκλου ＝ 314 τ.εκ.
              </text>

              {/* Διάσταση πλευράς α = 20 εκ. (κάτω) */}
              <line x1="0" y1="182" x2="170" y2="182" stroke="#334155" strokeWidth="1.5" />
              <line x1="0" y1="178" x2="0" y2="186" stroke="#334155" strokeWidth="1.5" />
              <line x1="170" y1="178" x2="170" y2="186" stroke="#334155" strokeWidth="1.5" />
              <text x="85" y="196" fontSize="10.5" fontWeight="black" textAnchor="middle" fill="#0f172a">
                πλευρά α ＝ 20 εκ.
              </text>
            </g>

            {/* 2. ΑΝΑΛΥΤΙΚΗ ΚΑΤΑΓΡΑΦΗ ΜΕΓΕΘΩΝ (ΔΕΞΙΑ) */}
            <g transform="translate(230, 16)">
              <rect x="0" y="0" width="360" height="135" rx="12" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />

              <g transform="translate(16, 22)" fontSize="11" fill="#0f172a" className="font-mono">
                <text x="0" y="0">
                  • <strong>Τετράγωνο:</strong> Ε_τετρ ＝ α² ＝ 20 · 20 ＝ <tspan fontWeight="bold" fill="#ea580c">400 τ.εκ.</tspan>
                </text>
                <text x="0" y="24">
                  • <strong>Διάμετρος κύκλου:</strong> δ ＝ 20 εκ. ➔ <tspan fontWeight="bold" fill="#2563eb">r ＝ 10 εκ.</tspan>
                </text>
                <text x="0" y="48">
                  • <strong>Εμβαδόν κύκλου:</strong> π · r² ＝ 3,14 · 10² ＝ <tspan fontWeight="bold" fill="#2563eb">314 τ.εκ.</tspan>
                </text>
                
                <line x1="-4" y1="62" x2="330" y2="62" stroke="#e2e8f0" strokeWidth="1.2" />

                <text x="0" y="80" fontSize="10.5" fontWeight="bold" fill="#475569">
                  Ζητούμενο εμβαδόν (οι 4 γωνίες):
                </text>
                <text x="0" y="100" fontSize="14" fontWeight="black" fill="#15803d">
                  400 － 314 ＝ 86 τ.εκ. ⭐
                </text>
              </g>
            </g>

            {/* 3. ΚΑΤΩ ΕΝΙΑΙΑ ΛΕΖΑΝΤΑ */}
            <g transform="translate(230, 165)">
              <rect x="0" y="0" width="360" height="34" rx="8" fill="#16a34a" />
              <text x="180" y="22" fontSize="11.5" fontWeight="black" textAnchor="middle" fill="#ffffff">
                Ε_χωρίου ＝ Ε_τετραγώνου － Ε_κύκλου ＝ 86 τ.εκ.
              </text>
            </g>
          </svg>
        </div>

        {/* ΑΝΑΛΥΤΙΚΟΙ ΤΡΟΠΟΙ ΕΠΙΛΥΣΗΣ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-3">
          {/* 1ος Τρόπος: Βήμα-προς-βήμα υπολογισμός */}
          <div className="space-y-1.5">
            <div className="font-sans font-bold text-blue-900 border-b border-slate-200 pb-1">
              🔷 1ος Τρόπος (Βήμα-προς-βήμα υπολογισμός εμβαδών)
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
              <div>
                • <strong>Βήμα 1 (Εμβαδόν τετραγώνου):</strong>
                <div className="pl-3 text-slate-800 pt-0.5">
                  Ε_τετραγώνου ＝ α · α ＝ 20 · 20 ＝ <strong className="text-blue-700">400 τ.εκ.</strong>[cite: 1]
                </div>
              </div>

              <div className="pt-1 border-t border-slate-200">
                • <strong>Βήμα 2 (Ακτίνα και εμβαδόν εγγεγραμμένου κύκλου):</strong>
                <div className="pl-3 text-slate-700 font-sans text-xs pt-0.5">
                  Ο μέγιστος δυνατός κύκλος εφάπτεται και στις 4 πλευρές του τετραγώνου, άρα η διάμετρός του ισούται με την πλευρά του τετραγώνου (20 εκ.)[cite: 1]:
                </div>
                <div className="pl-3 text-slate-800 pt-0.5 space-y-1">
                  <div>Ακτίνα: r ＝ 20 : 2 ＝ <strong>10 εκ.</strong>[cite: 1]</div>
                  <div>Ε_κύκλου ＝ π · r² ≈ 3,14 · 10 · 10 ＝ 3,14 · 100 ＝ <strong className="text-blue-700">314 τ.εκ.</strong>[cite: 1]</div>
                </div>
              </div>

              <div className="pt-1 border-t border-slate-200">
                • <strong>Βήμα 3 (Αφαίρεση επιφανειών):</strong>
                <div className="pl-3 text-emerald-800 font-bold text-base pt-0.5">
                  Ε_χωρίου ＝ 400 － 314 ＝ <span className="text-emerald-700 font-black">86 τ.εκ.</span> ⭐[cite: 1]
                </div>
              </div>
            </div>
          </div>

          {/* 2ος Τρόπος: Κατανομή στις 4 γωνίες */}
          <div className="space-y-1.5 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-blue-900 border-b border-slate-200 pb-1">
              🔷 2ος Τρόπος (Συμμετρία των 4 γωνιών & ποσοστό κάλυψης)
            </div>
            <p className="text-slate-700">
              Ο εγγεγραμμένος κύκλος καλύπτει πάντοτε σταθερό ποσοστό του τετραγώνου[cite: 1]:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span>• Ποσοστό κάλυψης κύκλου ＝</span>
                <Fraction num="314" den="400" />
                <span>＝</span>
                <Fraction num="78,5" den="100" />
                <span>＝ <strong>78,5%</strong></span>
              </div>
              <div className="flex items-center gap-2 flex-wrap pt-0.5">
                <span>• Ποσοστό του εξωτερικού χωρίου ＝ 100% － 78,5% ＝ <strong>21,5%</strong></span>
              </div>
              <div className="pt-1 border-t border-slate-200">
                • Ε_χωρίου ＝ 21,5% · 400 ＝ 0,215 · 400 ＝ <strong className="text-emerald-700 font-black text-base">86 τ.εκ.</strong>[cite: 1]
              </div>
              <div className="text-slate-600 font-sans text-xs">
                (Κάθε μία από τις 4 ίσες εξωτερικές γωνίες έχει εμβαδόν: 86 : 4 ＝ 21,5 τ.εκ.).
              </div>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, το εμβαδόν του χωρίου είναι <strong>86 τ.εκ.</strong>[cite: 1]
        </p>
      </div>
    )
  },
  {
    id: 13,
    group: 'ΟΜΑΔΑ Β (5 ΕΠΙΛΟΓΕΣ)',
    prompt: 'Δύο καράβια αναχωρούν ταυτόχρονα από το λιμάνι του Πειραιά την 1η Μαΐου. Το πρώτο καράβι επιστρέφει στον Πειραιά κάθε 12 ημέρες, ενώ το δεύτερο κάθε 18 ημέρες. Ποια ημερομηνία θα συναντηθούν πάλι για πρώτη φορά στο λιμάνι; (Ο Μάιος έχει 31 ημέρες).',
    options: ['24 Μαΐου', '31 Μαΐου', '6 Ιουνίου', '12 Ιουνίου', '18 Ιουνίου'],
    correct: '6 Ιουνίου',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Τα δύο καράβια θα ξανασυναντηθούν στο λιμάνι μετά από πλήθος ημερών που είναι κοινό πολλαπλάσιο του 12 και του 18, δηλαδή ίσο με το <strong>Ε.Κ.Π.(12, 18)</strong>:
        </p>

        {/* SVG ΣΧΗΜΑ 13: ΠΛΗΡΩΣ RESPONSIVE ΧΩΡΙΣ SCROLL */}
        <div className="bg-white/90 p-3 sm:p-4 rounded-2xl border border-slate-200/90 my-2">
          <svg
            viewBox="0 0 620 225"
            className="w-full h-auto max-w-[620px] mx-auto block select-none font-sans"
          >
            <defs>
              <marker id="axis-arr-13" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 2 L 8 5 L 0 8 z" fill="#334155" />
              </marker>
              <marker id="ship-arr-blue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#2563eb" />
              </marker>
              <marker id="ship-arr-orange" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#ea580c" />
              </marker>
            </defs>

            {/* Κεντρικός Άξονας Χρόνου */}
            <line x1="30" y1="120" x2="590" y2="120" stroke="#334155" strokeWidth="2" markerEnd="url(#axis-arr-13)" />

            {/* ΣΗΜΕΙΟ 0: 1η Μαΐου (Αναχώρηση) */}
            <g transform="translate(60, 120)">
              <line x1="0" y1="-8" x2="0" y2="8" stroke="#334155" strokeWidth="2" />
              <circle cx="0" cy="0" r="5" fill="#334155" />
              <rect x="-42" y="15" width="84" height="22" rx="5" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
              <text x="0" y="29" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#0f172a">1η Μαΐου</text>
              <text x="0" y="-12" fontSize="9.5" fontWeight="bold" textAnchor="middle" fill="#64748b">Ημέρα 0</text>
            </g>

            {/* 1ο ΚΑΡΑΒΙ (Άλματα των 12 ημερών: x = 60 + ημ * 12) */}
            {/* 0 -> 12 (x: 204) */}
            <path d="M 60 110 Q 132 50 204 110" fill="none" stroke="#2563eb" strokeWidth="2" markerEnd="url(#ship-arr-blue)" />
            <text x="132" y="70" fontSize="9.5" fontWeight="bold" textAnchor="middle" fill="#1d4ed8">＋12ημ.</text>

            {/* 12 -> 24 (x: 348) */}
            <path d="M 204 110 Q 276 50 348 110" fill="none" stroke="#2563eb" strokeWidth="2" markerEnd="url(#ship-arr-blue)" />
            <text x="276" y="70" fontSize="9.5" fontWeight="bold" textAnchor="middle" fill="#1d4ed8">＋12ημ.</text>

            {/* 24 -> 36 (x: 492) */}
            <path d="M 348 110 Q 420 50 492 110" fill="none" stroke="#2563eb" strokeWidth="2" markerEnd="url(#ship-arr-blue)" />
            <text x="420" y="70" fontSize="9.5" fontWeight="bold" textAnchor="middle" fill="#1d4ed8">＋12ημ.</text>

            {/* 2ο ΚΑΡΑΒΙ (Άλματα των 18 ημερών: κάτω τόξα) */}
            {/* 0 -> 18 (x: 276) */}
            <path d="M 60 130 Q 168 185 276 130" fill="none" stroke="#ea580c" strokeWidth="2" strokeDasharray="3 2" markerEnd="url(#ship-arr-orange)" />
            <text x="168" y="168" fontSize="9.5" fontWeight="bold" textAnchor="middle" fill="#c2410c">＋18ημ.</text>

            {/* 18 -> 36 (x: 492) */}
            <path d="M 276 130 Q 384 185 492 130" fill="none" stroke="#ea580c" strokeWidth="2" strokeDasharray="3 2" markerEnd="url(#ship-arr-orange)" />
            <text x="384" y="168" fontSize="9.5" fontWeight="bold" textAnchor="middle" fill="#c2410c">＋18ημ.</text>

            {/* Ενδιάμεσοι κόμβοι στον άξονα */}
            <circle cx="204" cy="120" r="3.5" fill="#2563eb" />
            <circle cx="276" cy="120" r="3.5" fill="#ea580c" />
            <circle cx="348" cy="120" r="3.5" fill="#2563eb" />

            {/* ΚΟΙΝΟ ΣΗΜΕΙΟ ΣΥΝΑΝΤΗΣΗΣ: ΗΜΕΡΑ 36 (x: 492) */}
            <g transform="translate(492, 120)">
              <line x1="0" y1="-45" x2="0" y2="45" stroke="#16a34a" strokeWidth="2.5" />
              <circle cx="0" cy="0" r="7" fill="#16a34a" stroke="#14532d" strokeWidth="1.5" />

              {/* Επάνω Badge ημερών */}
              <rect x="-56" y="-76" width="112" height="26" rx="6" fill="#16a34a" />
              <text x="0" y="-59" fontSize="11" fontWeight="black" textAnchor="middle" fill="#ffffff">
                Ε.Κ.Π. ＝ 36 ημ. ⭐
              </text>

              {/* Κάτω Badge ημερομηνίας */}
              <rect x="-50" y="48" width="100" height="24" rx="6" fill="#dcfce7" stroke="#86efac" strokeWidth="1.2" />
              <text x="0" y="64" fontSize="10.5" fontWeight="black" textAnchor="middle" fill="#166534">
                6 Ιουνίου
              </text>
            </g>

            {/* Υπόμνημα επάνω αριστερά */}
            <g transform="translate(30, 16)">
              <rect x="0" y="0" width="220" height="34" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.2" />
              <line x1="12" y1="12" x2="35" y2="12" stroke="#2563eb" strokeWidth="2" />
              <text x="42" y="15" fontSize="9.5" fontWeight="bold" fill="#1e40af">1ο καράβι (κάθε 12 ημ.)</text>
              <line x1="12" y1="24" x2="35" y2="24" stroke="#ea580c" strokeWidth="2" strokeDasharray="3 2" />
              <text x="42" y="27" fontSize="9.5" fontWeight="bold" fill="#c2410c">2ο καράβι (κάθε 18 ημ.)</text>
            </g>
          </svg>
        </div>

        {/* ΑΝΑΛΥΤΙΚΟΙ ΤΡΟΠΟΙ ΕΠΙΛΥΣΗΣ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-3">
          {/* 1ος Τρόπος: Μέσω Ε.Κ.Π. */}
          <div className="space-y-1.5">
            <div className="font-sans font-bold text-blue-900 border-b border-slate-200 pb-1">
              🔷 1ος Τρόπος (Υπολογισμός Ε.Κ.Π. & Ημερολογιακή Μετάβαση)
            </div>
            <p className="text-slate-700">
              Αναλύουμε τους αριθμούς 12 και 18 σε γινόμενο πρώτων παραγόντων[cite: 1]:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
              <div>
                • 12 ＝ 2 · 2 · 3 ＝ <strong>2² · 3</strong>
              </div>
              <div>
                • 18 ＝ 2 · 3 · 3 ＝ <strong>2 · 3²</strong>
              </div>
              <div className="pt-1 border-t border-slate-200 text-slate-700 font-sans text-xs">
                Το Ε.Κ.Π. ισούται με το γινόμενο των κοινών και μη κοινών πρώτων παραγόντων με τον μεγαλύτερο εκθέτη:
              </div>
              <div className="text-blue-700 font-bold">
                Ε.Κ.Π.(12, 18) ＝ 2² · 3² ＝ 4 · 9 ＝ 36 ημέρες[cite: 1]
              </div>

              <div className="pt-1 border-t border-slate-200 space-y-1">
                <div className="font-sans font-bold text-slate-900">
                  • Μετατροπή των 36 ημερών σε ημερομηνία (ξεκινώντας από 1η Μαΐου):[cite: 1]
                </div>
                <div className="pl-3 text-slate-800 space-y-0.5 font-sans text-xs">
                  <div>1. Ο Μάιος έχει 31 ημέρες[cite: 1]. Από την 1η Μαΐου έως το τέλος του μήνα απομένουν:</div>
                  <div className="pl-3 font-mono font-bold text-slate-900">31 － 1 ＝ 30 ημέρες.</div>
                  <div>2. Από τις 36 ημέρες αφαιρούμε τις 30 ημέρες του Μαΐου:</div>
                  <div className="pl-3 font-mono font-bold text-emerald-800 text-sm">
                    36 － 30 ＝ 6 ημέρες του επόμενου μήνα (Ιούνιος) ➔ <strong>6 Ιουνίου</strong> ⭐[cite: 1]
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2ος Τρόπος: Καταγραφή Πολλαπλασίων */}
          <div className="space-y-1.5 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-blue-900 border-b border-slate-200 pb-1">
              🔷 2ος Τρόπος (Αναλυτική καταγραφή των ημερών επιστροφής)
            </div>
            <p className="text-slate-700">
              Καταγράφουμε τις ημέρες που κάθε καράβι βρίσκεται πίσω στον Πειραιά[cite: 1]:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
              <div>• 1ο καράβι (κάθε 12 ημ.): 12, 24, <strong className="text-emerald-700">36</strong>, 48, ...[cite: 1]</div>
              <div>• 2ο καράβι (κάθε 18 ημ.): 18, <strong className="text-emerald-700">36</strong>, 54, ...[cite: 1]</div>
              <div className="pt-1 border-t border-slate-200 text-emerald-800 font-bold">
                • Πρώτη κοινή ημέρα επιστροφής ＝ <strong>36 ημέρες μετά την 1η Μαΐου</strong>[cite: 1].
              </div>
              <div className="text-slate-600 font-sans text-xs">
                1 Μαΐου ＋ 36 ημέρες ＝ 1 Μαΐου ＋ 30 ημέρες (31 Μαΐου) ＋ 6 ημέρες ＝ <strong>6 Ιουνίου</strong>[cite: 1].
              </div>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, τα δύο καράβια θα συναντηθούν πάλι στο λιμάνι στις <strong>6 Ιουνίου</strong>[cite: 1].
        </p>
      </div>
    )
  },
  {
    id: 14,
    group: 'ΟΜΑΔΑ Β (5 ΕΠΙΛΟΓΕΣ)',
    prompt: 'Η Μαρία, ο Γιάννης και ο Κώστας έχουν συνολικά 125 ευρώ. Η Μαρία έχει 15 ευρώ περισσότερα από τον Γιάννη, ενώ ο Κώστας έχει διπλάσια χρήματα από τη Μαρία. Πόσα χρήματα έχει ο Γιάννης;',
    options: ['15 €', '20 €', '25 €', '35 €', '40 €'],
    correct: '20 €',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Εκφράζουμε τα χρήματα και των τριών παιδιών σε σχέση με το ποσό του Γιάννη, καθώς αποτελεί τη βασική μονάδα σύγκρισης:
        </p>

        {/* SVG ΣΧΗΜΑ 14: ΠΛΗΡΩΣ RESPONSIVE ΧΩΡΙΣ SCROLL */}
        <div className="bg-white/90 p-3 sm:p-4 rounded-2xl border border-slate-200/90 my-2">
          <svg
            viewBox="0 0 620 220"
            className="w-full h-auto max-w-[620px] mx-auto block select-none font-sans"
          >
            {/* 1. ΑΝΑΛΥΣΗ ΜΕΡΙΔΙΩΝ (ΠΑΝΩ ΜΕΡΟΣ) */}
            <g transform="translate(20, 16)">
              <text x="0" y="14" fontSize="11" fontWeight="bold" fill="#0f172a">
                Ανάλυση των 4 ίσων μερών και των επιπλέον ποσών:
              </text>

              {/* Γιάννης: 1 μέρος (x) */}
              <g transform="translate(0, 24)">
                <text x="0" y="18" fontSize="11" fontWeight="bold" fill="#1d4ed8">Γιάννης:</text>
                <rect x="75" y="0" width="105" height="26" rx="6" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.6" />
                <text x="127.5" y="17" fontSize="10.5" fontWeight="black" textAnchor="middle" fill="#1e40af">1 μέρος (x)</text>
              </g>

              {/* Μαρία: 1 μέρος + 15€ */}
              <g transform="translate(0, 56)">
                <text x="0" y="18" fontSize="11" fontWeight="bold" fill="#be185d">Μαρία:</text>
                <rect x="75" y="0" width="105" height="26" rx="6" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.6" />
                <text x="127.5" y="17" fontSize="10.5" fontWeight="black" textAnchor="middle" fill="#1e40af">1 μέρος (x)</text>

                <rect x="186" y="0" width="80" height="26" rx="6" fill="#fdf2f8" stroke="#ec4899" strokeWidth="1.5" />
                <text x="226" y="17" fontSize="10.5" fontWeight="black" textAnchor="middle" fill="#be185d">＋15 €</text>
              </g>

              {/* Κώστας: 2 μέρη + 30€ */}
              <g transform="translate(0, 88)">
                <text x="0" y="18" fontSize="11" fontWeight="bold" fill="#15803d">Κώστας:</text>
                <rect x="75" y="0" width="105" height="26" rx="6" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.6" />
                <text x="127.5" y="17" fontSize="10.5" fontWeight="black" textAnchor="middle" fill="#1e40af">1 μέρος (x)</text>

                <rect x="186" y="0" width="105" height="26" rx="6" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.6" />
                <text x="238.5" y="17" fontSize="10.5" fontWeight="black" textAnchor="middle" fill="#1e40af">1 μέρος (x)</text>

                <rect x="297" y="0" width="95" height="26" rx="6" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1.5" />
                <text x="344.5" y="17" fontSize="10.5" fontWeight="black" textAnchor="middle" fill="#15803d">＋30 € (2 · 15)</text>
              </g>

              {/* Badge συνολικού ποσού 125€ δεξιά */}
              <g transform="translate(415, 34)">
                <rect x="0" y="0" width="165" height="74" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.4" />
                <text x="82.5" y="24" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#64748b">Συνολικό Ποσό</text>
                <text x="82.5" y="48" fontSize="18" fontWeight="900" textAnchor="middle" fill="#0f172a" fontFamily="monospace">125 €</text>
                <text x="82.5" y="65" fontSize="9.5" textAnchor="middle" fill="#64748b">4 μέρη ＋ 45 €</text>
              </g>
            </g>

            {/* ΔΙΑΧΩΡΙΣΤΙΚΗ ΓΡΑΜΜΗ */}
            <line x1="20" y1="135" x2="600" y2="135" stroke="#e2e8f0" strokeWidth="1.2" />

            {/* 2. ΚΑΤΩ ΣΥΜΠΕΡΑΣΜΑ ΜΕ ΑΦΑΙΡΕΣΗ ΚΑΙ ΔΙΑΙΡΕΣΗ */}
            <g transform="translate(20, 146)">
              {/* Αφαίρεση γνωστών ποσών */}
              <rect x="0" y="0" width="280" height="42" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.2" />
              <text x="140" y="18" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#475569">
                Αφαίρεση επιπλέον ποσών:
              </text>
              <text x="140" y="34" fontSize="11.5" fontWeight="black" textAnchor="middle" fill="#0f172a" fontFamily="monospace">
                125 € － (15 ＋ 30) ＝ 80 € (τα 4 μέρη)
              </text>

              {/* Εύρεση 1 μέρους (Γιάννης) */}
              <g transform="translate(295, 0)">
                <rect x="0" y="0" width="285" height="42" rx="10" fill="#16a34a" />
                <text x="142.5" y="17" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#dcfce7">
                  Χρήματα Γιάννη (1 μέρος ＝ 80 : 4)
                </text>
                <text x="142.5" y="34" fontSize="14" fontWeight="900" textAnchor="middle" fill="#ffffff">
                  Γιάννης ＝ 20 € ⭐
                </text>
              </g>
            </g>

            {/* Λεζάντα στο κάτω μέρος */}
            <g transform="translate(20, 204)">
              <text x="300" y="0" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#047857">
                Γιάννης: 20 € &nbsp;|&nbsp; Μαρία: 20 ＋ 15 ＝ 35 € &nbsp;|&nbsp; Κώστας: 2 · 35 ＝ 70 € &nbsp;(Σύνολο: 20 ＋ 35 ＋ 70 ＝ 125 €)
              </text>
            </g>
          </svg>
        </div>

        {/* ΑΝΑΛΥΤΙΚΟΙ ΤΡΟΠΟΙ ΕΠΙΛΥΣΗΣ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-3">
          {/* 1ος Τρόπος: Μέθοδος Ίσων Μερών */}
          <div className="space-y-1.5">
            <div className="font-sans font-bold text-blue-900 border-b border-slate-200 pb-1">
              🔷 1ος Τρόπος (Αριθμητικά με τη Μέθοδο των Ίσων Μερών)
            </div>
            <p className="text-slate-700">
              Θεωρούμε ως <strong>1 μέρος</strong> το ποσό του Γιάννη[cite: 1]:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
              <div>
                • <strong>Κατανομή μερών:</strong>
                <div className="pl-3 text-slate-800 space-y-0.5 pt-0.5">
                  <div>• Γιάννης: <strong>1 μέρος</strong>[cite: 1]</div>
                  <div>• Μαρία: <strong>1 μέρος ＋ 15 €</strong>[cite: 1]</div>
                  <div>• Κώστας: 2 · (1 μέρος ＋ 15 €) ＝ <strong>2 μέρη ＋ 30 €</strong>[cite: 1]</div>
                </div>
              </div>

              <div className="pt-1 border-t border-slate-200">
                • <strong>Συνολικό άθροισμα:</strong>
                <div className="pl-3 text-slate-800 pt-0.5">
                  (1 ＋ 1 ＋ 2) μέρη ＋ (15 ＋ 30) € ＝ <strong>4 μέρη ＋ 45 € ＝ 125 €</strong>[cite: 1]
                </div>
              </div>

              <div className="pt-1 border-t border-slate-200">
                • <strong>Υπολογισμός του ενός μέρους:</strong>
                <div className="pl-3 text-slate-800 pt-0.5 space-y-1">
                  <div>Αφαιρούμε τα επιπλέον ποσά: 125 － 45 ＝ <strong>80 €</strong> (αντιστοιχούν στα 4 ίσα μέρη).</div>
                  <div className="text-emerald-800 font-bold text-base">
                    1 μέρος (Γιάννης) ＝ 80 : 4 ＝ <span className="text-emerald-700 font-black">20 €</span> ⭐[cite: 1]
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2ος Τρόπος: Αλγεβρικά με εξίσωση */}
          <div className="space-y-1.5 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-blue-900 border-b border-slate-200 pb-1">
              🔷 2ος Τρόπος (Αλγεβρικά με εξίσωση πρώτου βαθμού)
            </div>
            <p className="text-slate-700">
              Έστω <strong>x</strong> τα χρήματα του Γιάννη σε ευρώ[cite: 1]:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
              <div>
                • Χρήματα Μαρίας: <strong>x ＋ 15</strong>[cite: 1]
              </div>
              <div>
                • Χρήματα Κώστα: 2 · (x ＋ 15) ＝ <strong>2x ＋ 30</strong>[cite: 1]
              </div>

              <div className="pt-1 border-t border-slate-200 space-y-1 text-slate-800">
                <div>Το συνολικό τους ποσό είναι 125 €[cite: 1]:</div>
                <div className="pl-3">x ＋ (x ＋ 15) ＋ (2x ＋ 30) ＝ 125[cite: 1]</div>
                <div className="pl-3">4x ＋ 45 ＝ 125</div>
                <div className="pl-3">4x ＝ 125 － 45</div>
                <div className="pl-3">4x ＝ 80</div>
                <div className="pl-3 text-emerald-700 font-black text-base">
                  x ＝ 80 : 4 ＝ 20 € ⭐[cite: 1]
                </div>
              </div>

              <div className="pt-1 border-t border-slate-200 text-slate-600 font-sans text-xs">
                Επαλήθευση: Γιάννης ＝ 20 €, Μαρία ＝ 35 €, Κώστας ＝ 70 € (Άθροισμα: 20 ＋ 35 ＋ 70 ＝ 125 €)[cite: 1].
              </div>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, ο Γιάννης έχει <strong>20 ευρώ</strong>[cite: 1].
        </p>
      </div>
    )
  },
  {
    id: 15,
    group: 'ΟΜΑΔΑ Β (5 ΕΠΙΛΟΓΕΣ)',
    prompt: 'Σε ένα τμήμα με 10 αγόρια και 15 κορίτσια, ο μέσος όρος βαθμολογίας των αγοριών στα μαθηματικά είναι 14, ενώ ο μέσος όρος των κοριτσιών είναι 16,5. Ποιος είναι ο συνολικός μέσος όρος βαθμολογίας όλων των μαθητών του τμήματος;',
    options: ['14,8', '15,0', '15,25', '15,5', '15,75'],
    correct: '15,5',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Επειδή το πλήθος των αγοριών και των κοριτσιών είναι διαφορετικό, υπολογίζουμε τον <strong>σταθμισμένο μέσο όρο</strong> διαιρώντας το συνολικό άθροισμα των βαθμών με τον συνολικό αριθμό των μαθητών (25 παιδιά):
        </p>

        {/* SVG ΣΧΗΜΑ 15: ΠΛΗΡΩΣ RESPONSIVE ΧΩΡΙΣ SCROLL */}
        <div className="bg-white/90 p-3 sm:p-4 rounded-2xl border border-slate-200/90 my-2">
          <svg
            viewBox="0 0 620 230"
            className="w-full h-auto max-w-[620px] mx-auto block select-none font-sans"
          >
            <defs>
              <marker id="group-arr-15" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#16a34a" />
              </marker>
            </defs>

            {/* 1. ΑΓΟΡΙΑ (10 ΜΑΘΗΤΕΣ, Μ.Ο. 14) */}
            <g transform="translate(30, 20)">
              <rect x="0" y="0" width="260" height="78" rx="12" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
              <text x="130" y="24" fontSize="11.5" fontWeight="black" textAnchor="middle" fill="#1d4ed8">
                👦 10 Αγόρια (Μ.Ο. ＝ 14)
              </text>
              <text x="130" y="48" fontSize="16" fontWeight="900" textAnchor="middle" fill="#1e40af" fontFamily="monospace">
                10 · 14 ＝ 140 βαθμοί
              </text>
              <text x="130" y="67" fontSize="9.5" fontWeight="bold" textAnchor="middle" fill="#2563eb">
                (Βάρος: 10/25 ＝ 40% του τμήματος)
              </text>
            </g>

            {/* 2. ΚΟΡΙΤΣΙΑ (15 ΜΑΘΗΤΡΙΕΣ, Μ.Ο. 16,5) */}
            <g transform="translate(330, 20)">
              <rect x="0" y="0" width="260" height="78" rx="12" fill="#fdf2f8" stroke="#ec4899" strokeWidth="2" />
              <text x="130" y="24" fontSize="11.5" fontWeight="black" textAnchor="middle" fill="#be185d">
                👧 15 Κορίτσια (Μ.Ο. ＝ 16,5)
              </text>
              <text x="130" y="48" fontSize="16" fontWeight="900" textAnchor="middle" fill="#9d174d" fontFamily="monospace">
                15 · 16,5 ＝ 247,5 βαθμοί
              </text>
              <text x="130" y="67" fontSize="9.5" fontWeight="bold" textAnchor="middle" fill="#db2777">
                (Βάρος: 15/25 ＝ 60% του τμήματος)
              </text>
            </g>

            {/* Βέλη σύγκλισης προς το συνολικό τμήμα */}
            <path d="M 160 98 C 160 118, 260 125, 295 132" fill="none" stroke="#16a34a" strokeWidth="2" strokeDasharray="3 2" markerEnd="url(#group-arr-15)" />
            <path d="M 460 98 C 460 118, 360 125, 325 132" fill="none" stroke="#16a34a" strokeWidth="2" strokeDasharray="3 2" markerEnd="url(#group-arr-15)" />

            {/* 3. ΣΥΝΟΛΙΚΟ ΤΜΗΜΑ (25 ΜΑΘΗΤΕΣ, Μ.Ο. 15,5) */}
            <g transform="translate(70, 132)">
              <rect x="0" y="0" width="480" height="52" rx="14" fill="#dcfce7" stroke="#16a34a" strokeWidth="2.5" />
              <text x="240" y="22" fontSize="11.5" fontWeight="black" textAnchor="middle" fill="#166534">
                Σύνολο Τμήματος: 10 ＋ 15 ＝ 25 μαθητές &nbsp;|&nbsp; 140 ＋ 247,5 ＝ 387,5 βαθμοί
              </text>
              <text x="240" y="42" fontSize="16" fontWeight="900" textAnchor="middle" fill="#15803d" fontFamily="monospace">
                Μέσος Όρος ＝ 387,5 : 25 ＝ 15,5 ⭐
              </text>
            </g>

            {/* Κάτω επεξηγηματική λεζάντα */}
            <g transform="translate(30, 202)">
              <rect x="0" y="0" width="560" height="24" rx="6" fill="#0f172a" />
              <text x="280" y="16" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#ffffff">
                Προσοχή: Δεν παίρνουμε απλό μέσο όρο (14 ＋ 16,5) : 2 ＝ 15,25 διότι τα κορίτσια είναι περισσότερα!
              </text>
            </g>
          </svg>
        </div>

        {/* ΑΝΑΛΥΤΙΚΟΙ ΤΡΟΠΟΙ ΕΠΙΛΥΣΗΣ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-3">
          {/* 1ος Τρόπος: Κλασικός Σταθμισμένος Μέσος Όρος */}
          <div className="space-y-1.5">
            <div className="font-sans font-bold text-blue-900 border-b border-slate-200 pb-1">
              🔷 1ος Τρόπος (Υπολογισμός μέσω των συνολικών βαθμών)
            </div>
            <p className="text-slate-700">
              Βρίσκουμε το συνολικό άθροισμα βαθμολογίας κάθε ομάδας ξεχωριστά[cite: 1]:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
              <div>
                • <strong>Βαθμοί των 10 αγοριών:</strong>
                <div className="pl-3 pt-0.5 text-slate-800">
                  10 · 14 ＝ <strong className="text-blue-700">140 βαθμοί</strong>[cite: 1]
                </div>
              </div>

              <div className="pt-1 border-t border-slate-200">
                • <strong>Βαθμοί των 15 κοριτσιών:</strong>
                <div className="pl-3 pt-0.5 text-slate-800">
                  15 · 16,5 ＝ <strong className="text-pink-700">247,5 βαθμοί</strong>[cite: 1]
                </div>
              </div>

              <div className="pt-1 border-t border-slate-200 space-y-1">
                • <strong>Συγκεντρωτικά στοιχεία ολόκληρου του τμήματος:</strong>
                <div className="pl-3 text-slate-800">
                  <div>• Συνολικό πλήθος μαθητών: 10 ＋ 15 ＝ <strong>25 μαθητές</strong>[cite: 1]</div>
                  <div>• Συνολικό άθροισμα βαθμών: 140 ＋ 247,5 ＝ <strong>387,5 βαθμοί</strong>[cite: 1]</div>
                </div>
              </div>

              <div className="pt-1 border-t border-slate-200">
                • <strong>Υπολογισμός τελικού μέσου όρου:</strong>
                <div className="pl-3 pt-1 flex items-center gap-2 flex-wrap text-emerald-800 font-bold">
                  <span>Μέσος Όρος ＝</span>
                  <Fraction num="Συνολικοί Βαθμοί" den="Σύνολο Μαθητών" />
                  <span>＝</span>
                  <Fraction num="387,5" den="25" />
                  <span>＝ <span className="text-base text-emerald-700 font-black">15,5</span> ⭐</span>[cite: 1]
                </div>
              </div>
            </div>
          </div>

          {/* 2ος Τρόπος: Με αναλογίες και κλάσματα */}
          <div className="space-y-1.5 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-blue-900 border-b border-slate-200 pb-1">
              🔷 2ος Τρόπος (Σταθμισμένη αναλογία βαρών με κλάσματα)
            </div>
            <p className="text-slate-700">
              Εκφράζουμε την αναλογία κάθε ομάδας ως κλάσμα του συνόλου των 25 μαθητών[cite: 1]:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>• Τα αγόρια αποτελούν τα:</span>
                <Fraction num="10" den="25" />
                <span>＝</span>
                <Fraction num="2" den="5" />
                <span>του τμήματος (ή 40%).</span>[cite: 1]
              </div>

              <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-200">
                <span>• Τα κορίτσια αποτελούν τα:</span>
                <Fraction num="15" den="25" />
                <span>＝</span>
                <Fraction num="3" den="5" />
                <span>του τμήματος (ή 60%).</span>[cite: 1]
              </div>

              <div className="pt-1 border-t border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span>Τελικός Μ.Ο. ＝ (</span>
                  <Fraction num="2" den="5" />
                  <span>· 14) ＋ (</span>
                  <Fraction num="3" den="5" />
                  <span>· 16,5)</span>
                </div>
                <div className="pl-3 text-slate-800 space-y-0.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span>＝</span>
                    <Fraction num="28" den="5" />
                    <span>＋</span>
                    <Fraction num="49,5" den="5" />
                    <span>＝</span>
                    <Fraction num="77,5" den="5" />
                    <span>＝ <strong className="text-emerald-700 text-base font-black">15,5</strong></span>[cite: 1]
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, ο συνολικός μέσος όρος βαθμολογίας όλων των μαθητών του τμήματος είναι <strong>15,5</strong>[cite: 1].
        </p>
      </div>
    )
  },
  {
    id: 16,
    group: 'ΟΜΑΔΑ Β (5 ΕΠΙΛΟΓΕΣ)',
    prompt: 'Ένα αναπτυσσόμενο μοτίβο σχηματίζεται από μικρά ίσα τετράγωνα: Σχήμα 1 (1 τετράγωνο), Σχήμα 2 (5 τετράγωνα), Σχήμα 3 (9 τετράγωνα), Σχήμα 4 (13 τετράγωνα). Αν το Σχήμα Ν αποτελείται από 97 τετράγωνα, ποιος είναι ο αριθμός Ν;',
    options: ['22', '24', '25', '26', '28'],
    correct: '25',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Παρατηρούμε ότι το μοτίβο ξεκινάει με <strong>1 αρχικό τετράγωνο</strong> και σε κάθε επόμενο σχήμα προστίθενται σταθερά <strong>4 νέα τετράγωνα</strong> (σταθερό βήμα ＋4):
        </p>

        {/* SVG ΣΧΗΜΑ 16: ΠΛΗΡΩΣ RESPONSIVE ΧΩΡΙΣ SCROLL */}
        <div className="bg-white/90 p-3 sm:p-4 rounded-2xl border border-slate-200/90 my-2">
          <svg
            viewBox="0 0 620 220"
            className="w-full h-auto max-w-[620px] mx-auto block select-none font-sans"
          >
            {/* 1. ΣΧΗΜΑ 1 (1 ΤΕΤΡΑΓΩΝΟ) */}
            <g transform="translate(30, 25)">
              <text x="30" y="0" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#1d4ed8">Σχήμα 1</text>
              <rect x="20" y="20" width="20" height="20" rx="3" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1.5" />
              <rect x="5" y="55" width="50" height="22" rx="6" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1" />
              <text x="30" y="70" fontSize="11" fontWeight="black" textAnchor="middle" fill="#1e40af">1 τετρ.</text>
            </g>

            {/* Τόξο +4 */}
            <g transform="translate(100, 50)">
              <text x="12" y="0" fontSize="11" fontWeight="black" textAnchor="middle" fill="#16a34a">＋4</text>
              <path d="M 0 10 Q 12 2 24 10" fill="none" stroke="#16a34a" strokeWidth="1.8" />
            </g>

            {/* 2. ΣΧΗΜΑ 2 (5 ΤΕΤΡΑΓΩΝΑ: ΣΤΑΥΡΟΣ) */}
            <g transform="translate(135, 10)">
              <text x="35" y="15" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#0f172a">Σχήμα 2</text>
              {/* Κεντρικό */}
              <rect x="25" y="35" width="20" height="20" rx="3" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1.2" />
              {/* 4 σταυρωτά (πράσινα) */}
              <rect x="25" y="15" width="20" height="20" rx="3" fill="#86efac" stroke="#16a34a" strokeWidth="1.2" />
              <rect x="25" y="55" width="20" height="20" rx="3" fill="#86efac" stroke="#16a34a" strokeWidth="1.2" />
              <rect x="5" y="35" width="20" height="20" rx="3" fill="#86efac" stroke="#16a34a" strokeWidth="1.2" />
              <rect x="45" y="35" width="20" height="20" rx="3" fill="#86efac" stroke="#16a34a" strokeWidth="1.2" />
              <rect x="10" y="85" width="50" height="22" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
              <text x="35" y="100" fontSize="11" fontWeight="black" textAnchor="middle" fill="#0f172a">5 τετρ.</text>
            </g>

            {/* Τόξο +4 */}
            <g transform="translate(220, 50)">
              <text x="12" y="0" fontSize="11" fontWeight="black" textAnchor="middle" fill="#16a34a">＋4</text>
              <path d="M 0 10 Q 12 2 24 10" fill="none" stroke="#16a34a" strokeWidth="1.8" />
            </g>

            {/* 3. ΣΧΗΜΑ 3 (9 ΤΕΤΡΑΓΩΝΑ) */}
            <g transform="translate(255, 10)">
              <text x="45" y="15" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#0f172a">Σχήμα 3</text>
              {/* Κεντρικό σταυρό + προεκτάσεις */}
              <rect x="35" y="35" width="20" height="20" rx="2" fill="#3b82f6" />
              <rect x="35" y="15" width="20" height="20" rx="2" fill="#86efac" />
              <rect x="35" y="-5" width="20" height="20" rx="2" fill="#bbf7d0" stroke="#16a34a" strokeWidth="1" />
              <rect x="35" y="55" width="20" height="20" rx="2" fill="#86efac" />
              <rect x="35" y="75" width="20" height="20" rx="2" fill="#bbf7d0" stroke="#16a34a" strokeWidth="1" />
              <rect x="15" y="35" width="20" height="20" rx="2" fill="#86efac" />
              <rect x="-5" y="35" width="20" height="20" rx="2" fill="#bbf7d0" stroke="#16a34a" strokeWidth="1" />
              <rect x="55" y="35" width="20" height="20" rx="2" fill="#86efac" />
              <rect x="75" y="35" width="20" height="20" rx="2" fill="#bbf7d0" stroke="#16a34a" strokeWidth="1" />
              <rect x="20" y="105" width="50" height="22" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
              <text x="45" y="120" fontSize="11" fontWeight="black" textAnchor="middle" fill="#0f172a">9 τετρ.</text>
            </g>

            {/* Αποσιωπητικά */}
            <text x="375" y="65" fontSize="20" fontWeight="black" textAnchor="middle" fill="#64748b">... ➔</text>

            {/* 4. ΣΧΗΜΑ Ν (97 ΤΕΤΡΑΓΩΝΑ - ΣΤΟΧΟΣ) */}
            <g transform="translate(425, 20)">
              <rect x="0" y="0" width="165" height="110" rx="14" fill="#dcfce7" stroke="#16a34a" strokeWidth="2.4" />
              <text x="82.5" y="26" fontSize="12" fontWeight="black" textAnchor="middle" fill="#166534">Σχήμα Ν ⭐</text>
              <text x="82.5" y="54" fontSize="22" fontWeight="900" textAnchor="middle" fill="#15803d" fontFamily="monospace">97 τετρ.</text>
              <line x1="15" y1="66" x2="150" y2="66" stroke="#86efac" strokeWidth="1.2" />
              <text x="82.5" y="84" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#166534">1 ＋ (Ν － 1) · 4</text>
              <text x="82.5" y="100" fontSize="12" fontWeight="black" textAnchor="middle" fill="#15803d">Ν ＝ 25</text>
            </g>

            {/* ΚΑΤΩ ΕΝΙΑΙΟ ΠΛΑΙΣΙΟ */}
            <g transform="translate(25, 160)">
              <rect x="0" y="0" width="570" height="42" rx="10" fill="#0f172a" />
              <text x="285" y="26" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#ffffff" fontFamily="monospace">
                97 － 1 (αρχικό) ＝ 96 επιπλέον τετράγωνα ➔ 96 : 4 ＝ 24 βήματα ➔ Ν ＝ 24 ＋ 1 ＝ 25
              </text>
            </g>
          </svg>
        </div>

        {/* ΑΝΑΛΥΤΙΚΟΙ ΤΡΟΠΟΙ ΕΠΙΛΥΣΗΣ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-3">
          {/* 1ος Τρόπος: Αριθμητικά με αφαίρεση του αρχικού στοιχείου */}
          <div className="space-y-1.5">
            <div className="font-sans font-bold text-blue-900 border-b border-slate-200 pb-1">
              🔷 1ος Τρόπος (Αριθμητικά με καταμέτρηση των διαδοχικών προσθηκών)
            </div>
            <p className="text-slate-700">
              Αναλύουμε πώς παράγεται κάθε σχήμα ξεκινώντας από το 1ο[cite: 1]:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
              <div>
                • <strong>Βήμα 1 (Αφαίρεση του κεντρικού τετραγώνου):</strong>
                <div className="pl-3 pt-0.5 text-slate-800">
                  Το 1ο σχήμα έχει 1 τετράγωνο[cite: 1]. Όλα τα υπόλοιπα προκύπτουν προσθέτοντας τετράδες:
                </div>
                <div className="pl-3 font-bold text-slate-900">
                  97 － 1 ＝ <strong>96 τετράγωνα</strong> (προήλθαν από τις διαδοχικές προσθήκες)[cite: 1].
                </div>
              </div>

              <div className="pt-1 border-t border-slate-200">
                • <strong>Βήμα 2 (Υπολογισμός των βημάτων αύξησης):</strong>
                <div className="pl-3 pt-0.5 text-slate-800">
                  Σε κάθε νέο σχήμα προστίθενται 4 τετράγωνα (5 － 1 ＝ 4, 9 － 5 ＝ 4, 13 － 9 ＝ 4)[cite: 1]:
                </div>
                <div className="pl-3 font-bold text-blue-700">
                  96 : 4 ＝ <strong>24 διαδοχικές προσθήκες (βήματα)</strong>[cite: 1].
                </div>
              </div>

              <div className="pt-1 border-t border-slate-200 text-emerald-800 font-bold">
                • <strong>Βήμα 3 (Εύρεση του αριθμού Ν):</strong>
                <div className="pl-3 text-slate-800 pt-0.5">
                  Επειδή ξεκινήσαμε από το Σχήμα 1, μετά από 24 βήματα φτάνουμε στο[cite: 1]:
                </div>
                <div className="pl-3 text-base text-emerald-700 font-black pt-0.5">
                  Ν ＝ 1 ＋ 24 ＝ 25 ⭐[cite: 1]
                </div>
              </div>
            </div>
          </div>

          {/* 2ος Τρόπος: Αλγεβρικά με τον γενικό τύπο */}
          <div className="space-y-1.5 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-blue-900 border-b border-slate-200 pb-1">
              🔷 2ος Τρόπος (Αλγεβρικά με τον τύπο της αριθμητικής ακολουθίας)
            </div>
            <p className="text-slate-700">
              Εκφράζουμε το πλήθος των τετραγώνων του Σχήματος Ν συναρτήσει του Ν[cite: 1]:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
              <div>• Σχήμα 1: 1 ＋ 0 · 4 ＝ 1[cite: 1]</div>
              <div>• Σχήμα 2: 1 ＋ 1 · 4 ＝ 5[cite: 1]</div>
              <div>• Σχήμα 3: 1 ＋ 2 · 4 ＝ 9[cite: 1]</div>
              <div>• Σχήμα 4: 1 ＋ 3 · 4 ＝ 13[cite: 1]</div>
              <div className="pt-1 border-t border-slate-200 font-bold text-slate-800">
                • Σχήμα Ν: 1 ＋ (Ν － 1) · 4 ＝ 97[cite: 1]
              </div>
              <div className="pl-3 space-y-0.5 text-slate-800">
                <div>4 · (Ν － 1) ＝ 97 － 1</div>
                <div>4 · (Ν － 1) ＝ 96</div>
                <div>Ν － 1 ＝ 96 : 4</div>
                <div>Ν － 1 ＝ 24 ➔ <strong className="text-emerald-700 text-base font-black">Ν ＝ 25</strong>[cite: 1]</div>
              </div>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, το σχήμα που αποτελείται από 97 τετράγωνα είναι το <strong>Σχήμα 25 (Ν ＝ 25)</strong>[cite: 1].
        </p>
      </div>
    )
  },
  {
    id: 17,
    group: 'ΟΜΑΔΑ Β (5 ΕΠΙΛΟΓΕΣ)',
    prompt: 'Μια ηλεκτρική συσκευή πουλήθηκε μετά από έκπτωση 30% στην τιμή των 210 ευρώ. Αν το κατάστημα αποφάσιζε να κάνει έκπτωση μόνο 10% πάνω στην αρχική τιμή, ποια θα ήταν η τιμή πώλησης;',
    options: ['230 €', '240 €', '250 €', '270 €', '280 €'],
    correct: '270 €',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Υπολογίζουμε πρώτα την <strong>αρχική τιμή</strong> (100%) της συσκευής πριν από κάθε έκπτωση και στη συνέχεια εφαρμόζουμε τη νέα έκπτωση 10%:
        </p>

        {/* SVG ΣΧΗΜΑ 17: ΠΛΗΡΩΣ RESPONSIVE ΧΩΡΙΣ SCROLL */}
        <div className="bg-white/90 p-3 sm:p-4 rounded-2xl border border-slate-200/90 my-2">
          <svg
            viewBox="0 0 620 225"
            className="w-full h-auto max-w-[620px] mx-auto block select-none font-sans"
          >
            {/* 1. ΕΠΙΚΕΦΑΛΙΔΑ ΑΡΧΙΚΗΣ ΤΙΜΗΣ */}
            <g transform="translate(25, 12)">
              <rect x="0" y="0" width="570" height="24" rx="12" fill="#0f172a" />
              <text x="285" y="16" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#ffffff">
                Αρχική Τιμή: 100% (χωρισμένη σε 10 ίσα μέρη των 30 € το καθένα)
              </text>
            </g>

            {/* 2. ΣΤΑΔΙΟ Α: ΕΚΠΤΩΣΗ 30% (ΠΛΗΡΩΜΗ 70% = 210€) */}
            <g transform="translate(25, 45)">
              <text x="0" y="12" fontSize="10.5" fontWeight="bold" fill="#0f172a">
                1η Περίπτωση: Έκπτωση 30% (7 μέρη πληρωμή, 3 μέρη έκπτωση)
              </text>

              {/* 10 Κουτάκια (57px το καθένα) */}
              <g transform="translate(0, 18)">
                {/* 7 μέρη πληρωμής (210€) */}
                {Array.from({ length: 7 }).map((_, idx) => (
                  <g key={`paid-${idx}`} transform={`translate(${idx * 57}, 0)`}>
                    <rect x="0" y="0" width="53" height="34" rx="5" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
                    <text x="26.5" y="16" fontSize="8.5" fontWeight="bold" textAnchor="middle" fill="#1d4ed8">10%</text>
                    <text x="26.5" y="28" fontSize="9.5" fontWeight="black" textAnchor="middle" fill="#1e40af" fontFamily="monospace">30 €</text>
                  </g>
                ))}

                {/* 3 μέρη έκπτωσης (90€) */}
                {Array.from({ length: 3 }).map((_, idx) => (
                  <g key={`disc-${idx}`} transform={`translate(${(idx + 7) * 57}, 0)`}>
                    <rect x="0" y="0" width="53" height="34" rx="5" fill="#fef2f2" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 2" />
                    <text x="26.5" y="16" fontSize="8.5" fontWeight="bold" textAnchor="middle" fill="#dc2626">10%</text>
                    <text x="26.5" y="28" fontSize="9.5" fontWeight="black" textAnchor="middle" fill="#b91c1c" fontFamily="monospace">30 €</text>
                  </g>
                ))}
              </g>

              {/* Επεξήγηση 70% */}
              <text x="199" y="66" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#1d4ed8">
                7 μέρη · 30 € ＝ 210 € (70%)
              </text>
              <text x="484" y="66" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#dc2626">
                Έκπτωση: 90 € (30%)
              </text>
            </g>

            {/* ΔΙΑΧΩΡΙΣΤΙΚΗ ΓΡΑΜΜΗ */}
            <line x1="25" y1="125" x2="595" y2="125" stroke="#e2e8f0" strokeWidth="1.2" />

            {/* 3. ΣΤΑΔΙΟ Β: ΕΚΠΤΩΣΗ ΜΟΝΟ 10% (ΠΛΗΡΩΜΗ 90% = 270€) */}
            <g transform="translate(25, 136)">
              <text x="0" y="12" fontSize="10.5" fontWeight="bold" fill="#0f172a">
                2η Περίπτωση: Έκπτωση μόνο 10% (9 μέρη πληρωμή, 1 μέρος έκπτωση)
              </text>

              <g transform="translate(0, 18)">
                {/* 9 μέρη πληρωμής (270€) */}
                {Array.from({ length: 9 }).map((_, idx) => (
                  <g key={`new-paid-${idx}`} transform={`translate(${idx * 57}, 0)`}>
                    <rect x="0" y="0" width="53" height="34" rx="5" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" />
                    <text x="26.5" y="16" fontSize="8.5" fontWeight="bold" textAnchor="middle" fill="#166534">10%</text>
                    <text x="26.5" y="28" fontSize="9.5" fontWeight="black" textAnchor="middle" fill="#15803d" fontFamily="monospace">30 €</text>
                  </g>
                ))}

                {/* 1 μέρος έκπτωσης (30€) */}
                <g transform="translate(513, 0)">
                  <rect x="0" y="0" width="53" height="34" rx="5" fill="#fef2f2" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 2" />
                  <text x="26.5" y="16" fontSize="8.5" fontWeight="bold" textAnchor="middle" fill="#dc2626">10%</text>
                  <text x="26.5" y="28" fontSize="9.5" fontWeight="black" textAnchor="middle" fill="#b91c1c" fontFamily="monospace">30 €</text>
                </g>
              </g>

              {/* Τελικό Badge Νέας Τιμής */}
              <g transform="translate(130, 58)">
                <rect x="0" y="0" width="310" height="26" rx="13" fill="#16a34a" />
                <text x="155" y="17" fontSize="11.5" fontWeight="black" textAnchor="middle" fill="#ffffff">
                  Νέα Τιμή: 9 μέρη · 30 € ＝ 270 € ⭐
                </text>
              </g>
            </g>
          </svg>
        </div>

        {/* ΑΝΑΛΥΤΙΚΟΙ ΤΡΟΠΟΙ ΕΠΙΛΥΣΗΣ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-3">
          {/* 1ος Τρόπος: Αναγωγή στο 10% και 100% */}
          <div className="space-y-1.5">
            <div className="font-sans font-bold text-blue-900 border-b border-slate-200 pb-1">
              🔷 1ος Τρόπος (Υπολογισμός αρχικής τιμής με αναγωγή στο 10%)
            </div>
            <p className="text-slate-700">
              Αναλύουμε το ποσοστό που πλήρωσε ο πελάτης στην πρώτη περίπτωση[cite: 1]:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
              <div>
                • <strong>Βήμα 1 (Ποσοστό πληρωμής):</strong>
                <div className="pl-3 text-slate-800 pt-0.5">
                  100% － 30% ＝ <strong>70% της αρχικής τιμής</strong>[cite: 1].
                </div>
              </div>

              <div className="pt-1 border-t border-slate-200">
                • <strong>Βήμα 2 (Εύρεση του 10% και της αρχικής τιμής 100%):</strong>
                <div className="pl-3 text-slate-800 pt-0.5 space-y-1">
                  <div>Τα 7 δέκατα (70%) ισούνται με 210 €[cite: 1].</div>
                  <div>Το 10% ισούται με: 210 : 7 ＝ <strong>30 €</strong>.</div>
                  <div className="text-blue-700 font-bold">
                    Αρχική Τιμή (100%) ＝ 10 · 30 € ＝ 300 €[cite: 1]
                  </div>
                </div>
              </div>

              <div className="pt-1 border-t border-slate-200">
                • <strong>Βήμα 3 (Υπολογισμός νέας τιμής με έκπτωση 10%):</strong>
                <div className="pl-3 text-slate-800 pt-0.5 space-y-1">
                  <div>Ποσό νέας έκπτωσης: 10% · 300 € ＝ <strong>30 €</strong>[cite: 1].</div>
                  <div className="text-emerald-800 font-bold text-base">
                    Νέα Τιμή Πώλησης ＝ 300 € － 30 € ＝ <span className="text-emerald-700 font-black">270 €</span> ⭐[cite: 1]
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2ος Τρόπος: Με κλάσματα και συντελεστή μεταβολής */}
          <div className="space-y-1.5 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-blue-900 border-b border-slate-200 pb-1">
              🔷 2ος Τρόπος (Απευθείας υπολογισμός με λόγο ποσοστών)
            </div>
            <p className="text-slate-700">
              Συγκρίνουμε απευθείας τα δύο ποσοστά πληρωμής[cite: 1]:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
              <div>
                • Στην 1η περίπτωση πληρώσαμε το <strong>70%</strong> της αρχικής τιμής[cite: 1].
              </div>
              <div>
                • Στη 2η περίπτωση θα πληρώσουμε το 100% － 10% ＝ <strong>90%</strong> της αρχικής τιμής[cite: 1].
              </div>

              <div className="pt-1 border-t border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span>Νέα Τιμή ＝ 210 ·</span>
                  <Fraction num="90%" den="70%" />
                  <span>＝ 210 ·</span>
                  <Fraction num="9" den="7" />
                </div>
                <div className="flex items-center gap-1.5 flex-wrap pl-3 text-emerald-800 font-bold">
                  <span>＝ (210 : 7) · 9 ＝ 30 · 9 ＝</span>
                  <span className="text-base text-emerald-700 font-black">270 €</span> ⭐[cite: 1]
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, με έκπτωση 10% η τιμή πώλησης θα ήταν <strong>270 ευρώ</strong>[cite: 1].
        </p>
      </div>
    )
  },
  {
    id: 18,
    group: 'ΟΜΑΔΑ Β (5 ΕΠΙΛΟΓΕΣ)',
    prompt: 'Αν διπλασιάσουμε το μήκος και τριπλασιάσουμε το πλάτος ενός ορθογωνίου, κατά πόσο τοις εκατό (%) θα αυξηθεί το εμβαδόν του;',
    options: ['100%', '400%', '500%', '600%', '700%'],
    correct: '500%',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Εξετάζουμε πώς μεταβάλλεται το εμβαδόν ενός ορθογωνίου (<span className="font-mono font-bold">Ε ＝ Μήκος · Πλάτος</span>) όταν αλλάζουν ταυτόχρονα και οι δύο διαστάσεις του:
        </p>

        {/* SVG ΣΧΗΜΑ 18: ΠΛΗΡΩΣ RESPONSIVE ΧΩΡΙΣ SCROLL */}
        <div className="bg-white/90 p-3 sm:p-4 rounded-2xl border border-slate-200/90 my-2">
          <svg
            viewBox="0 0 620 225"
            className="w-full h-auto max-w-[620px] mx-auto block select-none font-sans"
          >
            {/* 1. ΑΡΧΙΚΟ ΟΡΘΟΓΩΝΙΟ (ΑΡΙΣΤΕΡΑ) */}
            <g transform="translate(30, 30)">
              <text x="45" y="-8" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#1d4ed8">
                Αρχικό Ορθογώνιο
              </text>

              {/* Σχήμα L x W */}
              <rect x="0" y="5" width="90" height="45" rx="6" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
              <text x="45" y="32" fontSize="11" fontWeight="black" textAnchor="middle" fill="#1e40af">
                Ε₁ ＝ Ε (100%)
              </text>

              {/* Διαστάσεις */}
              <text x="45" y="65" fontSize="9.5" fontWeight="bold" textAnchor="middle" fill="#2563eb">
                Μήκος (L)
              </text>
              <text x="-12" y="32" fontSize="9.5" fontWeight="bold" textAnchor="middle" fill="#2563eb">
                W
              </text>
            </g>

            {/* Βέλος μετάβασης */}
            <g transform="translate(145, 50)">
              <line x1="0" y1="0" x2="35" y2="0" stroke="#64748b" strokeWidth="2" strokeDasharray="3 2" />
              <polygon points="35,-4 43,0 35,4" fill="#64748b" />
              <text x="20" y="-10" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#64748b">· 2 μήκος</text>
              <text x="20" y="16" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#64748b">· 3 πλάτος</text>
            </g>

            {/* 2. ΝΕΟ ΟΡΘΟΓΩΝΙΟ (ΔΕΞΙΑ: 2L x 3W = 6 ΙΣΑ ΜΕΡΗ) */}
            <g transform="translate(225, 12)">
              <text x="90" y="10" fontSize="11.5" fontWeight="black" textAnchor="middle" fill="#15803d">
                Νέο Ορθογώνιο (2L · 3W ＝ 6 ίσα μέρη)
              </text>

              {/* Μεγάλο ορθογώνιο 180 x 135 */}
              <g transform="translate(0, 18)">
                {/* 1ο μέρος: αντιστοιχεί στο αρχικό εμβαδόν (μπλε) */}
                <rect x="0" y="0" width="90" height="45" rx="4" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.8" />
                <text x="45" y="27" fontSize="10" fontWeight="black" textAnchor="middle" fill="#1d4ed8">1ο (Αρχικό)</text>

                {/* Τα άλλα 5 μέρη: καθαρή αύξηση (πράσινα διαγραμμισμένα) */}
                <rect x="90" y="0" width="90" height="45" rx="4" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.6" />
                <text x="135" y="27" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#166534">＋100%</text>

                <rect x="0" y="45" width="90" height="45" rx="4" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.6" />
                <text x="45" y="72" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#166534">＋100%</text>

                <rect x="90" y="45" width="90" height="45" rx="4" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.6" />
                <text x="135" y="72" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#166534">＋100%</text>

                <rect x="0" y="90" width="90" height="45" rx="4" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.6" />
                <text x="45" y="117" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#166534">＋100%</text>

                <rect x="90" y="90" width="90" height="45" rx="4" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.6" />
                <text x="135" y="117" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#166534">＋100%</text>

                {/* Εξωτερικό περίγραμμα νέου ορθογωνίου */}
                <rect x="0" y="0" width="180" height="135" rx="8" fill="none" stroke="#15803d" strokeWidth="2.5" />

                {/* Διαστάσεις νέου */}
                <text x="90" y="152" fontSize="10" fontWeight="black" textAnchor="middle" fill="#166534">
                  Νέο Μήκος ＝ 2 · L
                </text>
                <text x="198" y="72" fontSize="10" fontWeight="black" textAnchor="middle" fill="#166534">
                  3 · W
                </text>
              </g>
            </g>

            {/* Πίνακας σύνοψης δεξιά */}
            <g transform="translate(445, 30)">
              <rect x="0" y="0" width="145" height="135" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.4" />
              <text x="72.5" y="24" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#475569">Σύγκριση Εμβαδών</text>
              <line x1="12" y1="32" x2="133" y2="32" stroke="#e2e8f0" strokeWidth="1" />

              <text x="14" y="52" fontSize="9.5" fontWeight="bold" fill="#1d4ed8">• Αρχικό: 100%</text>
              <text x="14" y="74" fontSize="9.5" fontWeight="bold" fill="#0f172a">• Νέο: 600% (6 · Ε)</text>
              
              <rect x="8" y="90" width="129" height="34" rx="6" fill="#16a34a" />
              <text x="72.5" y="105" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#dcfce7">Αύξηση Εμβαδού:</text>
              <text x="72.5" y="119" fontSize="12" fontWeight="900" textAnchor="middle" fill="#ffffff">＋500% ⭐</text>
            </g>

            {/* Κάτω επεξηγηματικό πλαίσιο */}
            <g transform="translate(25, 182)">
              <rect x="0" y="0" width="570" height="32" rx="8" fill="#0f172a" />
              <text x="285" y="20" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#ffffff" fontFamily="monospace">
                Το νέο εμβαδόν έγινε 6πλάσιο (600%) ➔ Αύξηση: 600% － 100% (αρχικό) ＝ 500%
              </text>
            </g>
          </svg>
        </div>

        {/* ΑΝΑΛΥΤΙΚΟΙ ΤΡΟΠΟΙ ΕΠΙΛΥΣΗΣ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-3">
          {/* 1ος Τρόπος: Αριθμητικά με συγκεκριμένο παράδειγμα διαστάσεων */}
          <div className="space-y-1.5">
            <div className="font-sans font-bold text-blue-900 border-b border-slate-200 pb-1">
              🔷 1ος Τρόπος (Υπολογισμός με παράδειγμα διαστάσεων)
            </div>
            <p className="text-slate-700">
              Επιλέγουμε απλές διαστάσεις για το αρχικό ορθογώνιο, π.χ. μήκος <strong>10 εκ.</strong> και πλάτος <strong>10 εκ.</strong>[cite: 1]:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
              <div>
                • <strong>Αρχικό Εμβαδόν (Ε₁):</strong>
                <div className="pl-3 text-slate-800 pt-0.5">
                  Ε₁ ＝ 10 · 10 ＝ <strong>100 τ.εκ.</strong> (αντιστοιχεί στο 100%)[cite: 1]
                </div>
              </div>

              <div className="pt-1 border-t border-slate-200">
                • <strong>Νέες διαστάσεις και Νέο Εμβαδόν (Ε₂):</strong>
                <div className="pl-3 text-slate-800 pt-0.5 space-y-1">
                  <div>• Νέο μήκος (διπλασιασμός): 2 · 10 ＝ <strong>20 εκ.</strong>[cite: 1]</div>
                  <div>• Νέο πλάτος (τριπλασιασμός): 3 · 10 ＝ <strong>30 εκ.</strong>[cite: 1]</div>
                  <div>• Νέο Εμβαδόν: Ε₂ ＝ 20 · 30 ＝ <strong className="text-blue-700">600 τ.εκ.</strong>[cite: 1]</div>
                </div>
              </div>

              <div className="pt-1 border-t border-slate-200">
                • <strong>Υπολογισμός της αύξησης:</strong>
                <div className="pl-3 text-slate-800 pt-0.5 space-y-1">
                  <div>Αύξηση σε τ.εκ. ＝ 600 － 100 ＝ <strong>500 τ.εκ.</strong>[cite: 1]</div>
                  <div className="text-emerald-800 font-bold text-base">
                    Ποσοστό αύξησης ＝ <span className="text-emerald-700 font-black">500%</span> ⭐[cite: 1]
                  </div>
                  <div className="text-slate-500 font-sans text-xs">
                    (Προσοχή: Το εμβαδόν <em>έγινε</em> το 600% του αρχικού, αλλά <em>αυξήθηκε κατά</em> 500%[cite: 1]).
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2ος Τρόπος: Αλγεβρικά με τον γενικό τύπο */}
          <div className="space-y-1.5 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-blue-900 border-b border-slate-200 pb-1">
              🔷 2ος Τρόπος (Αλγεβρική απόδειξη για οποιοδήποτε ορθογώνιο)
            </div>
            <p className="text-slate-700">
              Έστω <strong>L</strong> το αρχικό μήκος και <strong>W</strong> το αρχικό πλάτος[cite: 1]:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
              <div>• Αρχικό εμβαδόν: <strong>Ε₁ ＝ L · W</strong>[cite: 1]</div>
              <div>• Νέο εμβαδόν: Ε₂ ＝ (2 · L) · (3 · W) ＝ (2 · 3) · (L · W) ＝ <strong className="text-blue-700">6 · (L · W) ＝ 6 · Ε₁</strong>[cite: 1]</div>
              <div className="pt-1 border-t border-slate-200 space-y-1">
                <div>• Καθαρή μεταβολή (αύξηση):</div>
                <div className="pl-3 font-bold text-slate-900">
                  Διαφορά ＝ Ε₂ － Ε₁ ＝ 6 · Ε₁ － 1 · Ε₁ ＝ <strong>5 · Ε₁</strong>[cite: 1]
                </div>
                <div className="pl-3 flex items-center gap-2 flex-wrap text-emerald-800 font-bold pt-0.5">
                  <span>Ποσοστό αύξησης ＝</span>
                  <Fraction num="5 · Ε₁" den="Ε₁" />
                  <span>· 100% ＝ 5 · 100% ＝</span>
                  <span className="text-base text-emerald-700 font-black">500%</span> ⭐[cite: 1]
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, το εμβαδόν του ορθογωνίου θα αυξηθεί κατά <strong>500%</strong>[cite: 1].
        </p>
      </div>
    )
  },
  {
    id: 19,
    group: 'ΟΜΑΔΑ Β (5 ΕΠΙΛΟΓΕΣ)',
    prompt: 'Σε μια σχολική κατασκήνωση, τα 2/5 των παιδιών ασχολούνται με το ποδόσφαιρο, το 1/3 με το μπάσκετ και τα υπόλοιπα 16 παιδιά με το κολύμπι (κανένα παιδί δεν κάνει 2 αθλήματα). Πόσα είναι συνολικά τα παιδιά της κατασκήνωσης;',
    options: ['45', '50', '60', '75', '90'],
    correct: '60',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Βρίσκουμε το <strong>Ε.Κ.Π.(5, 3) ＝ 15</strong> και εκφράζουμε όλα τα μέρη σε <strong>δέκατα πέμπτα (<Fraction num="1" den="15" />)</strong>:
        </p>

        {/* SVG ΣΧΗΜΑ 19: ΠΛΗΡΩΣ RESPONSIVE ΧΩΡΙΣ SCROLL */}
        <div className="bg-white/90 p-3 sm:p-4 rounded-2xl border border-slate-200/90 my-2">
          <svg
            viewBox="0 0 620 225"
            className="w-full h-auto max-w-[620px] mx-auto block select-none font-sans"
          >
            {/* 1. ΕΠΙΚΕΦΑΛΙΔΑ ΣΥΝΟΛΟΥ */}
            <g transform="translate(25, 12)">
              <rect x="0" y="0" width="570" height="24" rx="12" fill="#0f172a" />
              <text x="285" y="16" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#ffffff">
                Σύνολο Παιδιών Κατασκήνωσης: 15 ίσα μέρη (15/15)
              </text>
            </g>

            {/* 2. ΚΥΡΙΑ ΜΠΑΡΑ ΚΑΤΑΝΟΜΗΣ (15 μέρη των 37px) */}
            <g transform="translate(25, 48)">
              {/* Ποδόσφαιρο: 6 μέρη (2/5 = 6/15) */}
              {Array.from({ length: 6 }).map((_, idx) => (
                <g key={`soc-${idx}`} transform={`translate(${idx * 38}, 0)`}>
                  <rect x="0" y="0" width="35" height="46" rx="5" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
                  <text x="17.5" y="20" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#1d4ed8">1/15</text>
                  <text x="17.5" y="34" fontSize="9" fontWeight="black" textAnchor="middle" fill="#1e40af" fontFamily="monospace">4</text>
                </g>
              ))}

              {/* Μπάσκετ: 5 μέρη (1/3 = 5/15) */}
              {Array.from({ length: 5 }).map((_, idx) => (
                <g key={`bask-${idx}`} transform={`translate(${(idx + 6) * 38}, 0)`}>
                  <rect x="0" y="0" width="35" height="46" rx="5" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
                  <text x="17.5" y="20" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#b45309">1/15</text>
                  <text x="17.5" y="34" fontSize="9" fontWeight="black" textAnchor="middle" fill="#d97706" fontFamily="monospace">4</text>
                </g>
              ))}

              {/* Κολύμπι: 4 μέρη (4/15 = 16 παιδιά) */}
              {Array.from({ length: 4 }).map((_, idx) => (
                <g key={`swim-${idx}`} transform={`translate(${(idx + 11) * 38}, 0)`}>
                  <rect x="0" y="0" width="35" height="46" rx="5" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.8" />
                  <text x="17.5" y="20" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#166534">1/15</text>
                  <text x="17.5" y="34" fontSize="9.5" fontWeight="black" textAnchor="middle" fill="#15803d" fontFamily="monospace">4</text>
                </g>
              ))}
            </g>

            {/* 3. ΕΤΙΚΕΤΕΣ ΑΝΑ ΑΘΛΗΜΑ */}
            <g transform="translate(25, 102)">
              {/* Ποδόσφαιρο */}
              <g transform="translate(0, 0)">
                <path d="M 0 4 L 0 0 L 224 0 L 224 4" fill="none" stroke="#2563eb" strokeWidth="1.5" />
                <rect x="12" y="8" width="200" height="24" rx="6" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1" />
                <text x="112" y="23" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#1e40af">
                  ⚽ Ποδόσφαιρο: 2/5 ＝ 6/15 (24 παιδιά)
                </text>
              </g>

              {/* Μπάσκετ */}
              <g transform="translate(228, 0)">
                <path d="M 0 4 L 0 0 L 186 0 L 186 4" fill="none" stroke="#d97706" strokeWidth="1.5" />
                <rect x="8" y="8" width="170" height="24" rx="6" fill="#fef3c7" stroke="#fde68a" strokeWidth="1" />
                <text x="93" y="23" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#b45309">
                  🏀 Μπάσκετ: 1/3 ＝ 5/15 (20 παιδιά)
                </text>
              </g>

              {/* Κολύμπι */}
              <g transform="translate(418, 0)">
                <path d="M 0 4 L 0 0 L 148 0 L 148 4" fill="none" stroke="#16a34a" strokeWidth="1.8" />
                <rect x="4" y="8" width="140" height="24" rx="6" fill="#dcfce7" stroke="#86efac" strokeWidth="1" />
                <text x="74" y="23" fontSize="10" fontWeight="black" textAnchor="middle" fill="#166534">
                  🏊 Κολύμπι: 4/15 ＝ 16
                </text>
              </g>
            </g>

            {/* 4. ΚΑΤΩ ΥΠΟΛΟΓΙΣΜΟΣ ΚΑΙ ΑΠΟΤΕΛΕΣΜΑ */}
            <g transform="translate(25, 148)">
              {/* Αναγωγή στο 1/15 */}
              <rect x="0" y="0" width="260" height="38" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.2" />
              <text x="130" y="16" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#475569">
                4 μέρη ＝ 16 παιδιά
              </text>
              <text x="130" y="30" fontSize="11" fontWeight="black" textAnchor="middle" fill="#0f172a" fontFamily="monospace">
                1 μέρος (1/15) ＝ 16 : 4 ＝ 4 παιδιά
              </text>

              {/* Τελικό Σύνολο 15/15 */}
              <g transform="translate(275, 0)">
                <rect x="0" y="0" width="295" height="38" rx="10" fill="#16a34a" />
                <text x="147.5" y="16" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#dcfce7">
                  Όλα τα παιδιά (15/15)
                </text>
                <text x="147.5" y="31" fontSize="13.5" fontWeight="900" textAnchor="middle" fill="#ffffff">
                  Σύνολο ＝ 15 · 4 ＝ 60 παιδιά ⭐
                </text>
              </g>
            </g>

            {/* Κάτω επεξηγηματική λεζάντα */}
            <g transform="translate(25, 204)">
              <text x="285" y="0" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#047857">
                Ποδόσφαιρο: 24 (6/15) ＋ Μπάσκετ: 20 (5/15) ＋ Κολύμπι: 16 (4/15) ＝ 60 παιδιά
              </text>
            </g>
          </svg>
        </div>

        {/* ΑΝΑΛΥΤΙΚΟΙ ΤΡΟΠΟΙ ΕΠΙΛΥΣΗΣ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-3">
          {/* 1ος Τρόπος: Με ομώνυμα κλάσματα και αναγωγή στη μονάδα */}
          <div className="space-y-1.5">
            <div className="font-sans font-bold text-blue-900 border-b border-slate-200 pb-1">
              🔷 1ος Τρόπος (Μετατροπή σε ομώνυμα κλάσματα & Αναγωγή στο 1/15)
            </div>
            <p className="text-slate-700">
              Υπολογίζουμε τι μέρος του συνόλου απασχολούν τα άλλα δύο αθλήματα[cite: 1]:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span>• Ποδόσφαιρο ＋ Μπάσκετ ＝</span>
                <Fraction num="2" den="5" />
                <span>＋</span>
                <Fraction num="1" den="3" />
                <span>＝</span>
                <Fraction num="6" den="15" />
                <span>＋</span>
                <Fraction num="5" den="15" />
                <span>＝</span>
                <strong className="text-blue-700"><Fraction num="11" den="15" /></strong>
                <span>του συνόλου των παιδιών.</span>[cite: 1]
              </div>

              <div className="pt-1 border-t border-slate-200">
                • <strong>Κλάσμα για το κολύμπι (υπόλοιπο):</strong>
                <div className="pl-3 pt-1 flex items-center gap-1.5 flex-wrap text-slate-800">
                  <span>1 －</span>
                  <Fraction num="11" den="15" />
                  <span>＝</span>
                  <Fraction num="15" den="15" />
                  <span>－</span>
                  <Fraction num="11" den="15" />
                  <span>＝</span>
                  <strong className="text-emerald-700"><Fraction num="4" den="15" /></strong>
                  <span>του συνόλου.</span>[cite: 1]
                </div>
              </div>

              <div className="pt-1 border-t border-slate-200">
                • <strong>Αναγωγή στο 1/15 και υπολογισμός του συνόλου:</strong>
                <div className="pl-3 pt-0.5 space-y-1 text-slate-800">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span>Τα <Fraction num="4" den="15" /> ισούνται με 16 παιδιά[cite: 1]. Άρα το <Fraction num="1" den="15" /> αντιστοιχεί σε: 16 : 4 ＝ <strong>4 παιδιά</strong>.</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap text-emerald-800 font-bold text-base pt-0.5">
                    <span>Όλα τα παιδιά (<Fraction num="15" den="15" />) ＝ 15 · 4 ＝</span>
                    <span className="text-emerald-700 font-black">60 παιδιά</span> ⭐[cite: 1]
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2ος Τρόπος: Αλγεβρικά με εξίσωση */}
          <div className="space-y-1.5 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-blue-900 border-b border-slate-200 pb-1">
              🔷 2ος Τρόπος (Αλγεβρικά με εξίσωση και άγνωστο x)
            </div>
            <p className="text-slate-700">
              Έστω <strong>x</strong> ο συνολικός αριθμός των παιδιών της κατασκήνωσης[cite: 1]:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Fraction num="2" den="5" />
                <span>· x ＋</span>
                <Fraction num="1" den="3" />
                <span>· x ＋ 16 ＝ x</span>[cite: 1]
              </div>

              <div className="pt-1 border-t border-slate-200 text-slate-700 font-sans text-xs">
                Πολλαπλασιάζουμε όλους τους όρους με το Ε.Κ.Π.(5, 3) ＝ 15 για απαλοιφή παρονομαστών:
              </div>

              <div className="pl-3 space-y-1 text-slate-800">
                <div>15 · (<Fraction num="2" den="5" /> · x) ＋ 15 · (<Fraction num="1" den="3" /> · x) ＋ 15 · 16 ＝ 15 · x</div>
                <div>6x ＋ 5x ＋ 240 ＝ 15x</div>
                <div>11x ＋ 240 ＝ 15x</div>
                <div>15x － 11x ＝ 240</div>
                <div>4x ＝ 240</div>
                <div className="text-emerald-700 font-black text-base">
                  x ＝ 240 : 4 ＝ 60 παιδιά ⭐[cite: 1]
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, στην κατασκήνωση βρίσκονται συνολικά <strong>60 παιδιά</strong>[cite: 1].
        </p>
      </div>
    )
  },
  {
    id: 20,
    group: 'ΟΜΑΔΑ Β (5 ΕΠΙΛΟΓΕΣ)',
    prompt: 'Ψάχνουμε έναν διψήφιο αριθμό ΧΥ τέτοιον ώστε: (1) είναι περιττός (μονός) αριθμός, (2) αν διαιρεθεί με το 5 αφήνει υπόλοιπο 3, και (3) το άθροισμα των ψηφίων του Χ ＋ Υ είναι ίσο με 11. Ποιος είναι ο αριθμός ΧΥ;',
    options: ['38', '53', '83', '93', '98'],
    correct: '83',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Συνδυάζουμε τις τρεις συνθήκες της εκφώνησης βήμα προς βήμα, ξεκινώντας από το ψηφίο των μονάδων (<strong>Υ</strong>) και συνεχίζοντας με το ψηφίο των δεκάδων (<strong>Χ</strong>)[cite: 1]:
        </p>

        {/* SVG ΣΧΗΜΑ 20: ΠΛΗΡΩΣ RESPONSIVE ΧΩΡΙΣ SCROLL */}
        <div className="bg-white/90 p-3 sm:p-4 rounded-2xl border border-slate-200/90 my-2">
          <svg
            viewBox="0 0 620 225"
            className="w-full h-auto max-w-[620px] mx-auto block select-none font-sans"
          >
            <defs>
              <marker id="filter-arr-20" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#2563eb" />
              </marker>
            </defs>

            {/* 1. ΒΗΜΑ 1: ΔΙΑΙΡΕΣΗ ΜΕ ΤΟ 5 (ΥΠΟΛΟΙΠΟ 3) */}
            <g transform="translate(20, 20)">
              <rect x="0" y="0" width="170" height="85" rx="12" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.8" />
              <text x="85" y="24" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#1d4ed8">
                1. Διαίρεση με 5 (υπ. 3)
              </text>
              <text x="85" y="44" fontSize="9" textAnchor="middle" fill="#64748b">
                Τελευταίο ψηφίο:
              </text>
              <text x="85" y="68" fontSize="16" fontWeight="black" textAnchor="middle" fill="#1e40af" fontFamily="monospace">
                Υ ∈ &#123;3, 8&#125;
              </text>
            </g>

            {/* Βέλος 1 -> 2 */}
            <g transform="translate(195, 62)">
              <line x1="0" y1="0" x2="20" y2="0" stroke="#2563eb" strokeWidth="2" markerEnd="url(#filter-arr-20)" />
            </g>

            {/* 2. ΒΗΜΑ 2: ΠΕΡΙΤΤΟΣ ΑΡΙΘΜΟΣ (ΑΠΟΚΛΕΙΣΜΟΣ ΤΟΥ 8) */}
            <g transform="translate(225, 20)">
              <rect x="0" y="0" width="170" height="85" rx="12" fill="#fef2f2" stroke="#ef4444" strokeWidth="1.8" />
              <text x="85" y="24" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#dc2626">
                2. Περιττός (Μονός)
              </text>
              <text x="85" y="44" fontSize="9" textAnchor="middle" fill="#991b1b">
                Απορρίπτεται το 8 (άρτιο)
              </text>
              <rect x="25" y="52" width="120" height="24" rx="6" fill="#dc2626" />
              <text x="85" y="68" fontSize="11.5" fontWeight="black" textAnchor="middle" fill="#ffffff" fontFamily="monospace">
                Άρα: Υ ＝ 3 ✔️
              </text>
            </g>

            {/* Βέλος 2 -> 3 */}
            <g transform="translate(400, 62)">
              <line x1="0" y1="0" x2="20" y2="0" stroke="#2563eb" strokeWidth="2" markerEnd="url(#filter-arr-20)" />
            </g>

            {/* 3. ΒΗΜΑ 3: ΑΘΡΟΙΣΜΑ ΨΗΦΙΩΝ (Χ + Υ = 11) */}
            <g transform="translate(430, 20)">
              <rect x="0" y="0" width="170" height="85" rx="12" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" />
              <text x="85" y="24" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#166534">
                3. Χ ＋ Υ ＝ 11
              </text>
              <text x="85" y="44" fontSize="9.5" textAnchor="middle" fill="#166534">
                Χ ＋ 3 ＝ 11 ➔ Χ ＝ 8
              </text>
              <rect x="20" y="52" width="130" height="24" rx="6" fill="#16a34a" />
              <text x="85" y="68" fontSize="12" fontWeight="black" textAnchor="middle" fill="#ffffff" fontFamily="monospace">
                Αριθμός: 83 ⭐
              </text>
            </g>

            {/* 4. ΚΑΤΩ ΠΛΑΙΣΙΟ ΕΠΑΛΗΘΕΥΣΗΣ ΤΩΝ 3 ΣΥΝΘΗΚΩΝ */}
            <g transform="translate(20, 125)">
              <rect x="0" y="0" width="580" height="85" rx="12" fill="#0f172a" />
              
              <text x="290" y="24" fontSize="12" fontWeight="black" textAnchor="middle" fill="#4ade80">
                Πλήρης Επαλήθευση για τον Αριθμό 83:
              </text>

              <g transform="translate(20, 38)" fontSize="10.5" fill="#cbd5e1">
                <text x="0" y="14">
                  (1) <tspan fontWeight="bold" fill="#ffffff">Είναι περιττός (μονός);</tspan> Ναι, λήγει σε 3 ✔️
                </text>
                <text x="0" y="32">
                  (2) <tspan fontWeight="bold" fill="#ffffff">83 ： 5 ＝ 16 με υπόλοιπο 3;</tspan> Ναι, αφού 16 · 5 ＋ 3 ＝ 80 ＋ 3 ＝ 83 ✔️
                </text>
              </g>

              <g transform="translate(360, 38)" fontSize="10.5" fill="#cbd5e1">
                <text x="0" y="23">
                  (3) <tspan fontWeight="bold" fill="#ffffff">Άθροισμα Χ ＋ Υ ＝ 11;</tspan>
                </text>
                <text x="0" y="38" fontWeight="black" fill="#4ade80" fontFamily="monospace">
                  8 ＋ 3 ＝ 11 ✔️
                </text>
              </g>
            </g>
          </svg>
        </div>

        {/* ΑΝΑΛΥΤΙΚΟΙ ΤΡΟΠΟΙ ΕΠΙΛΥΣΗΣ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-3">
          {/* 1ος Τρόπος: Βήμα-προς-βήμα εύρεση των ψηφίων */}
          <div className="space-y-1.5">
            <div className="font-sans font-bold text-blue-900 border-b border-slate-200 pb-1">
              🔷 1ος Τρόπος (Βήμα προς βήμα λογική παραγωγή των ψηφίων)
            </div>
            <p className="text-slate-700">
              Αναλύουμε τις ιδιότητες των ψηφίων του αριθμού <strong>ΧΥ</strong>[cite: 1]:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
              <div>
                • <strong>Βήμα 1 (Εξέταση της διαίρεσης με το 5):</strong>
                <div className="pl-3 text-slate-800 pt-0.5 font-sans text-xs">
                  Τα πολλαπλάσια του 5 λήγουν σε 0 ή 5. Επομένως, κάθε αριθμός που αφήνει υπόλοιπο 3 όταν διαιρεθεί με το 5, έχει τελευταίο ψηφίο:
                </div>
                <div className="pl-3 font-bold text-slate-900 pt-0.5">
                  0 ＋ 3 ＝ <strong>3</strong> &nbsp;ή&nbsp; 5 ＋ 3 ＝ <strong>8</strong> ➔ <strong>Υ ∈ &#123;3, 8&#125;</strong>[cite: 1]
                </div>
              </div>

              <div className="pt-1 border-t border-slate-200">
                • <strong>Βήμα 2 (Εξέταση της ιδιότητας του περιττού αριθμού):</strong>
                <div className="pl-3 text-slate-800 pt-0.5 font-sans text-xs">
                  Ένας αριθμός είναι περιττός (μονός) αν λήγει σε 1, 3, 5, 7, 9[cite: 1]. Το ψηφίο 8 είναι άρτιο και απορρίπτεται.
                </div>
                <div className="pl-3 font-bold text-blue-700 pt-0.5">
                  Άρα, υποχρεωτικά το ψηφίο των μονάδων είναι: Υ ＝ 3[cite: 1].
                </div>
              </div>

              <div className="pt-1 border-t border-slate-200">
                • <strong>Βήμα 3 (Εύρεση του ψηφίου των δεκάδων Χ):</strong>
                <div className="pl-3 text-slate-800 pt-0.5 font-sans text-xs">
                  Το άθροισμα των ψηφίων του αριθμού είναι ίσο με 11 (Χ ＋ Υ ＝ 11)[cite: 1]:
                </div>
                <div className="pl-3 space-y-0.5 pt-0.5">
                  <div>Χ ＋ 3 ＝ 11</div>
                  <div className="text-emerald-800 font-bold text-base">
                    Χ ＝ 11 － 3 ＝ <span className="text-emerald-700 font-black">8</span>[cite: 1]
                  </div>
                </div>
              </div>

              <div className="pt-1 border-t border-slate-200 text-emerald-800 font-bold">
                • <strong>Σύνθεση του αριθμού:</strong> Ο ζητούμενος αριθμός είναι το <span className="text-base text-emerald-700 font-black">83</span> ⭐[cite: 1]
              </div>
            </div>
          </div>

          {/* 2ος Τρόπος: Δοκιμή και απόρριψη των επιλογών */}
          <div className="space-y-1.5 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-blue-900 border-b border-slate-200 pb-1">
              🔷 2ος Τρόπος (Έλεγχος των επιλογών της εκφώνησης)
            </div>
            <p className="text-slate-700">
              Ελέγχουμε ποια από τις 5 διαθέσιμες επιλογές επαληθεύει και τις τρεις συνθήκες[cite: 1]:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1 text-xs">
              <div>• <strong>38:</strong> Είναι άρτιος αριθμός ➔ <span className="text-rose-600 font-bold">Απορρίπτεται</span> (δεν είναι περιττός)[cite: 1].</div>
              <div>• <strong>53:</strong> Είναι περιττός και 53 : 5 = 10 (υπ. 3), αλλά 5 ＋ 3 ＝ 8 ≠ 11 ➔ <span className="text-rose-600 font-bold">Απορρίπτεται</span>[cite: 1].</div>
              <div className="bg-emerald-50/80 p-1.5 rounded-md border border-emerald-200 text-emerald-950 font-bold">
                • <strong>83:</strong> Είναι περιττός ✔️, 83 : 5 ＝ 16 (υπ. 3) ✔️, και 8 ＋ 3 ＝ 11 ✔️ ➔ <span className="text-emerald-700 font-black">ΔΕΚΤΟ ⭐</span>[cite: 1]
              </div>
              <div>• <strong>93:</strong> Είναι περιττός και 93 : 5 = 18 (υπ. 3), αλλά 9 ＋ 3 ＝ 12 ≠ 11 ➔ <span className="text-rose-600 font-bold">Απορρίπτεται</span>[cite: 1].</div>
              <div>• <strong>98:</strong> Είναι άρτιος αριθμός και 9 ＋ 8 ＝ 17 ≠ 11 ➔ <span className="text-rose-600 font-bold">Απορρίπτεται</span>[cite: 1].</div>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, ο ζητούμενος αριθμός είναι το <strong>83</strong>[cite: 1].
        </p>
      </div>
    )
  }
];

const TOTAL_TIME_SECONDS = 90 * 60; // 90 λεπτά σύμφωνα με το διαγώνισμα

export default function DeuteroTestProsomoiosisPage() {
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
        s += 2.5; // 2,5 μόρια ανά σωστή απάντηση (20 θέματα = σύνολο 50)
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
      title="🎯 2ο Τεστ Προσομοίωσης Προτύπων - LearnMaths.gr"
      description="2ο Διαγνωστικό Τεστ Προσομοίωσης Μαθηματικών για τα Πρότυπα Σχολεία: 20 θέματα αυξημένης δυσκολίας, 90 λεπτά, βαθμολογία 0-50 με αναλυτικές λύσεις και σχήματα."
      backUrl="/protipa/test-prosomoiosis"
      backText="Τεστ Προσομοίωσης"
      hideFooter={true}
    >
      <div className={`${LAYOUT.CONTAINER} py-6 sm:py-8 space-y-6 pb-28 sm:pb-32 max-w-[1920px] 2xl:max-w-[2400px]`}>

        {/* HERO BANNER & TIMER HEADER */}
        <div className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 rounded-3xl p-5 sm:p-7 text-white shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1.5">
              <span className="inline-block bg-white/20 px-3 py-0.5 rounded-full text-[11px] font-black tracking-wider text-sky-200">
                2ο ΤΕΣΤ • 20 ΘΕΜΑΤΑ (ΑΡΙΣΤΑ: 50 ΜΟΡΙΑ)
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
                2ο Τεστ Προσομοίωσης Εξετάσεων Προτύπων
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

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-sky-100 border-t border-white/20 pt-3">
            <span>📝 Απαντημένες: <strong>{answeredCount} / 20</strong></span>
            <span>🎯 Βαθμολογία: <strong>2,5 μόρια / σωστό</strong></span>
            <span>{timerEnabled ? '⏳ Χρονόμετρο: Ενεργό (90\')' : '⏳ Χρονόμετρο: Ανενεργό'}</span>
          </div>
        </div>

        {/* FEEDBACK BANNER ΜΕΤΑ ΤΗΝ ΥΠΟΒΟΛΗ */}
        {submitted && (
          <div className="bg-white border-2 border-indigo-300 rounded-3xl p-6 shadow-md text-center space-y-3">
            <span className="text-4xl block">🏆</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Ολοκλήρωση 2ου Τεστ!
            </h2>
            <div className="inline-block bg-indigo-50 border border-indigo-200 px-6 py-2 rounded-2xl">
              <span className="text-xs font-bold text-indigo-800 uppercase block">Τελικό Σκορ</span>
              <span className="text-3xl sm:text-4xl font-mono font-black text-indigo-600">
                {score} / 50
              </span>
              <span className="text-xs font-bold text-slate-500 block mt-1">
                ({Math.round(score / 2.5)} σωστές στις 20 ερωτήσεις)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
              Δες παρακάτω αναλυτικά ποιες ερωτήσεις απάντησες σωστά (✅) ή λάθος (❌) μαζί με την αναλυτική μαθηματική λύση και τα σχήματα για κάθε θέμα.
            </p>
          </div>
        )}

        {/* LIST OF 20 QUESTIONS */}
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
                      {isCorrect ? '✅ +2,5 μόρια' : '❌ 0 μόρια'}
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
                      <span>Μαθηματική Επεξήγηση & Λύση:</span>
                    </div>
                    <div className="font-medium pt-1">{q.explain}</div>
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
                <span>Οριστική Υποβολή Τεστ ({answeredCount}/20)</span>
              </button>
            </div>
          )}
        </form>

      </div>

      {/* FIXED BOTTOM SCORE & TIMER BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-3 px-4 sm:px-6 z-50">
        <div className={`${LAYOUT.CONTAINER} flex flex-col sm:flex-row justify-between items-center gap-3 max-w-[1920px] 2xl:max-w-[2400px]`}>
          
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-mono shadow-xs">
              {submitted ? `Σκορ: ${score} / 50` : `Απαντήσεις: ${answeredCount} / 20`}
            </div>
            {submitted ? (
              <span className="text-xs font-bold text-slate-300">
                Ποσοστό: <strong className="text-emerald-400">{Math.round((score / 50) * 100)}%</strong>
              </span>
            ) : (
              <span className="text-xs text-slate-300">
                Υπολείπονται: <strong>{20 - answeredCount}</strong>
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
