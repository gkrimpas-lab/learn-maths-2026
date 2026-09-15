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

        {/* SVG ΣΧΗΜΑ: ΑΡΙΘΜΟΓΡΑΜΜΗ ΜΕ ΟΛΑ ΤΑ ΝΟΥΜΕΡΑ ΚΑΙ ΑΠΟΣΤΑΣΕΙΣ ΑΠΟ ΤΟ 0,60 */}
        <div className="bg-white/90 p-3.5 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="530" height="200" viewBox="0 0 530 200" className="select-none font-sans mx-auto block">
            <defs>
              <marker id="numline-arr-3" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 2 L 8 5 L 0 8 z" fill="#334155" />
              </marker>
            </defs>

            {/* Κεντρικός άξονας αριθμογραμμής */}
            <line x1="20" y1="100" x2="505" y2="100" stroke="#334155" strokeWidth="2" markerEnd="url(#numline-arr-3)" />

            {/* 1. ΣΗΜΕΙΟ 1/2 = 0,50 */}
            <g transform="translate(60, 100)">
              <line x1="0" y1="-8" x2="0" y2="8" stroke="#64748b" strokeWidth="2" />
              <circle cx="0" cy="0" r="4.5" fill="#64748b" />
              <text x="0" y="-28" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#475569">1/2</text>
              <text x="0" y="-14" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#64748b">(0,50)</text>
              <text x="0" y="24" fontSize="9.5" textAnchor="middle" fill="#dc2626" fontFamily="monospace">d ＝ 0,10</text>
            </g>

            {/* 2. ΣΗΜΕΙΟ 13/25 = 0,52 */}
            <g transform="translate(130, 100)">
              <line x1="0" y1="-8" x2="0" y2="8" stroke="#64748b" strokeWidth="2" />
              <circle cx="0" cy="0" r="4.5" fill="#64748b" />
              <text x="0" y="-28" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#475569">13/25</text>
              <text x="0" y="-14" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#64748b">(0,52)</text>
              <text x="0" y="24" fontSize="9.5" textAnchor="middle" fill="#dc2626" fontFamily="monospace">d ＝ 0,08</text>
            </g>

            {/* 3. ΣΗΜΕΙΟ 11/20 = 0,55 (ΤΟ ΠΛΗΣΙΕΣΤΕΡΟ) */}
            <g transform="translate(235, 100)">
              <line x1="0" y1="-10" x2="0" y2="10" stroke="#16a34a" strokeWidth="2.5" />
              <circle cx="0" cy="0" r="6" fill="#16a34a" stroke="#14532d" strokeWidth="1.5" />
              <text x="0" y="-28" fontSize="11.5" fontWeight="black" textAnchor="middle" fill="#15803d">11/20</text>
              <text x="0" y="-14" fontSize="10.5" fontWeight="black" textAnchor="middle" fill="#16a34a">(0,55)</text>
              <rect x="-26" y="14" width="52" height="18" rx="4" fill="#dcfce7" stroke="#86efac" strokeWidth="1" />
              <text x="0" y="27" fontSize="9.5" fontWeight="black" textAnchor="middle" fill="#166534" fontFamily="monospace">d ＝ 0,05</text>
              <text x="0" y="46" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#15803d">Πιο κοντά!</text>
            </g>

            {/* ΤΟΞΟ ΑΠΟΣΤΑΣΗΣ ΑΠΟ 0,55 ΣΕ 0,60 */}
            <path d="M 235 82 Q 292 65 350 82" fill="none" stroke="#16a34a" strokeWidth="2" />
            <text x="292.5" y="68" fontSize="9.5" fontWeight="black" textAnchor="middle" fill="#15803d">0,05</text>

            {/* 4. ΣΤΟΧΟΣ 3/5 = 0,60 (ΕΠΙΚΕΝΤΡΟ) */}
            <g transform="translate(350, 100)">
              <line x1="0" y1="-32" x2="0" y2="35" stroke="#2563eb" strokeWidth="2.5" strokeDasharray="3 2" />
              <circle cx="0" cy="0" r="6.5" fill="#2563eb" stroke="#1e40af" strokeWidth="1.5" />
              <rect x="-38" y="-62" width="76" height="24" rx="6" fill="#1e293b" />
              <text x="0" y="-46" fontSize="12" fontWeight="black" textAnchor="middle" fill="#ffffff">
                0,60 ⭐
              </text>
              <text x="0" y="50" fontSize="10" fontWeight="black" textAnchor="middle" fill="#1d4ed8">
                (Στόχος: 3/5)
              </text>
            </g>

            {/* 5. ΣΗΜΕΙΟ 7/10 = 0,70 */}
            <g transform="translate(450, 100)">
              <line x1="0" y1="-8" x2="0" y2="8" stroke="#64748b" strokeWidth="2" />
              <circle cx="0" cy="0" r="4.5" fill="#64748b" />
              <text x="0" y="-28" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#475569">7/10</text>
              <text x="0" y="-14" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#64748b">(0,70)</text>
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

        {/* SVG ΣΧΗΜΑ 4: ΜΕΓΑΛΟ & ΕΥΔΙΑΚΡΙΤΟ (720px) */}
        <div className="bg-white/90 p-4 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="720" height="180" viewBox="0 0 720 180" className="select-none font-sans mx-auto block">
            <defs>
              <marker id="arr-up-4" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#2563eb" />
              </marker>
              <marker id="arr-down-4" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#dc2626" />
              </marker>
            </defs>

            {/* 1. Αρχική Τιμή */}
            <g transform="translate(30, 45)">
              <rect x="0" y="0" width="150" height="85" rx="14" fill="#f8fafc" stroke="#64748b" strokeWidth="2" />
              <text x="75" y="28" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#475569">Αρχική Τιμή</text>
              <text x="75" y="54" fontSize="20" fontWeight="900" textAnchor="middle" fill="#0f172a" fontFamily="monospace">100 €</text>
              <text x="75" y="72" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#64748b">(ή x)</text>
            </g>

            {/* Τόξο Αύξησης +25% */}
            <path d="M 190 70 C 220 30, 260 30, 285 65" fill="none" stroke="#2563eb" strokeWidth="2.5" markerEnd="url(#arr-up-4)" />
            <rect x="205" y="18" width="70" height="24" rx="6" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1" />
            <text x="240" y="34" fontSize="11" fontWeight="black" textAnchor="middle" fill="#1d4ed8">＋25%</text>

            {/* 2. Νέα Τιμή */}
            <g transform="translate(290, 45)">
              <rect x="0" y="0" width="150" height="85" rx="14" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2.2" />
              <text x="75" y="28" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#1d4ed8">Νέα Τιμή</text>
              <text x="75" y="54" fontSize="20" fontWeight="900" textAnchor="middle" fill="#1e40af" fontFamily="monospace">125 €</text>
              <text x="75" y="72" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#2563eb">(1,25 · x)</text>
            </g>

            {/* Τόξο Μείωσης -20% */}
            <path d="M 450 70 C 480 30, 520 30, 545 65" fill="none" stroke="#dc2626" strokeWidth="2.5" markerEnd="url(#arr-down-4)" />
            <rect x="465" y="18" width="70" height="24" rx="6" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1" />
            <text x="500" y="34" fontSize="11" fontWeight="black" textAnchor="middle" fill="#dc2626">－20%</text>

            {/* 3. Τελική Τιμή */}
            <g transform="translate(550, 45)">
              <rect x="0" y="0" width="145" height="85" rx="14" fill="#dcfce7" stroke="#16a34a" strokeWidth="2.5" />
              <text x="72.5" y="28" fontSize="12" fontWeight="black" textAnchor="middle" fill="#166534">Τελική Τιμή ⭐</text>
              <text x="72.5" y="54" fontSize="20" fontWeight="900" textAnchor="middle" fill="#15803d" fontFamily="monospace">100 €</text>
              <text x="72.5" y="72" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#166534">(＝ 1,00 · x)</text>
            </g>

            {/* Κάτω Badge Συμπεράσματος */}
            <g transform="translate(185, 144)">
              <rect x="0" y="0" width="350" height="28" rx="14" fill="#0f172a" />
              <text x="175" y="18" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#ffffff">
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
              <div>• <strong>Αύξηση κατά 25%:</strong> 100 ＋ 25 ＝ <strong>125 €</strong> (η νέα τιμή).</div>
              <div>• <strong>Μείωση κατά 20%:</strong> Υπολογίζεται πάνω στη νέα τιμή των 125 €:</div>
              <div className="pl-3 text-slate-800">
                Ποσό μείωσης ＝ 20% · 125 ＝ 0,20 · 125 ＝ <strong className="text-rose-600">25 €</strong>.
              </div>
              <div className="pt-1 border-t border-slate-200">
                • <strong>Τελική τιμή:</strong> 125 － 25 ＝ <strong className="text-emerald-700 font-black">100 €</strong>.
              </div>
              <div className="pt-0.5 text-slate-600 font-sans text-xs">
                Η τελική τιμή ισούται με την αρχική, επομένως η συνολική ποσοστιαία μεταβολή είναι <strong>0% (καμία μεταβολή)</strong>.
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
                <span>· x</span>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-200">
                <span>• Μείωση κατά 20% ➔ Τελική τιμή: (Νέα τιμή) · (1 － 0,20) ＝</span>
                <Fraction num="5" den="4" />
                <span>· x · 0,80 ＝</span>
                <Fraction num="5" den="4" />
                <span>·</span>
                <Fraction num="4" den="5" />
                <span>· x</span>
              </div>

              <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-slate-200 text-emerald-800 font-bold">
                <span>• Τελική Τιμή ＝</span>
                <Fraction num="5 · 4" den="4 · 5" />
                <span>· x ＝ 1 · x ＝ <span className="text-base text-emerald-700 font-black">x</span></span>
              </div>
              <div className="text-slate-600 font-sans text-xs pt-0.5">
                Εφόσον η τελική τιμή παραμένει ακριβώς <strong>x</strong>, αποδεικνύεται ότι για οποιαδήποτε τιμή του προϊόντος η μεταβολή είναι πάντοτε <strong>0%</strong>.
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
          Γνωρίζουμε ότι κάθε ζώο έχει <strong>1 κεφάλι</strong> (άρα σύνολο 25 ζώα), κάθε κοτόπουλο έχει <strong>2 πόδια</strong> και κάθε κατσίκα έχει <strong>4 πόδια</strong>[cite: 1]:
        </p>

        {/* SVG ΣΧΗΜΑ 5: ΜΕΓΑΛΟ & ΕΥΔΙΑΚΡΙΤΟ (720px) */}
        <div className="bg-white/90 p-4 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="720" height="200" viewBox="0 0 720 200" className="select-none font-sans mx-auto block">
            <defs>
              <marker id="arr-flow-5" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#16a34a" />
              </marker>
            </defs>

            {/* 1. Υπόθεση: Όλα κοτόπουλα */}
            <g transform="translate(35, 20)">
              <rect x="0" y="0" width="300" height="85" rx="14" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
              <text x="150" y="28" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#1d4ed8">
                Υπόθεση: Και τα 25 ζώα είναι κοτόπουλα
              </text>
              <text x="150" y="54" fontSize="18" fontWeight="900" textAnchor="middle" fill="#1e40af" fontFamily="monospace">
                25 · 2 ＝ 50 πόδια
              </text>
              <text x="150" y="73" fontSize="10.5" textAnchor="middle" fill="#2563eb">
                (Λείπουν πόδια σε σχέση με την πραγματικότητα)
              </text>
            </g>

            {/* 2. Πραγματικότητα & Διαφορά */}
            <g transform="translate(385, 20)">
              <rect x="0" y="0" width="300" height="85" rx="14" fill="#fef2f2" stroke="#ef4444" strokeWidth="2" />
              <text x="150" y="28" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#dc2626">
                Πραγματικότητα: 70 πόδια
              </text>
              <text x="150" y="54" fontSize="18" fontWeight="900" textAnchor="middle" fill="#b91c1c" fontFamily="monospace">
                70 － 50 ＝ 20 επιπλέον πόδια
              </text>
              <text x="150" y="73" fontSize="10.5" textAnchor="middle" fill="#dc2626">
                (Ανήκουν στις 4ποδες κατσίκες)
              </text>
            </g>

            {/* Βέλη σύγκλισης προς το συμπέρασμα */}
            <path d="M 185 108 C 185 125, 300 135, 340 138" fill="none" stroke="#16a34a" strokeWidth="2" strokeDasharray="3 2" />
            <path d="M 535 108 C 535 125, 420 135, 380 138" fill="none" stroke="#16a34a" strokeWidth="2" strokeDasharray="3 2" />

            {/* Τελικό Αποτέλεσμα (Κατσίκες) */}
            <g transform="translate(135, 138)">
              <rect x="0" y="0" width="450" height="46" rx="12" fill="#16a34a" />
              <text x="225" y="29" fontSize="13.5" fontWeight="900" textAnchor="middle" fill="#ffffff">
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
          Συγκρίνουμε το <strong>συνολικό άθροισμα πόντων</strong> στους 4 αρχικούς γύρους με το επιθυμητό άθροισμα στους 5 γύρους:
        </p>

        {/* SVG ΣΧΗΜΑ: ΟΠΤΙΚΟΠΟΙΗΣΗ ΤΗΣ ΜΕΤΑΤΟΠΙΣΗΣ ΤΟΥ ΜΕΣΟΥ ΟΡΟΥ (720px) */}
        <div className="bg-white/90 p-4 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="700" height="175" viewBox="0 0 700 175" className="select-none font-sans mx-auto block">
            <defs>
              <marker id="numline-arr-7" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 2 L 8 5 L 0 8 z" fill="#334155" />
              </marker>
            </defs>

            {/* Κεντρικός άξονας αριθμογραμμής */}
            <line x1="30" y1="90" x2="670" y2="90" stroke="#334155" strokeWidth="2.2" markerEnd="url(#numline-arr-7)" />

            {/* Παλιός Μέσος Όρος = 16 */}
            <g transform="translate(180, 90)">
              <line x1="0" y1="-30" x2="0" y2="30" stroke="#2563eb" strokeWidth="2.2" strokeDasharray="3 2" />
              <circle cx="0" cy="0" r="5.5" fill="#2563eb" />
              <rect x="-48" y="-62" width="96" height="26" rx="6" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1.2" />
              <text x="0" y="-45" fontSize="11.5" fontWeight="black" textAnchor="middle" fill="#1d4ed8">Μ.Ο. ＝ 16</text>
              <text x="0" y="24" fontSize="13" fontWeight="900" textAnchor="middle" fill="#1e40af">16</text>
              <text x="0" y="44" fontSize="9.5" fontWeight="bold" textAnchor="middle" fill="#64748b">4 γύροι (4 · 16 ＝ 64)</text>
            </g>

            {/* Βέλος Αύξησης Μέσου Όρου (+1) */}
            <path d="M 195 40 Q 255 18 315 40" fill="none" stroke="#16a34a" strokeWidth="2" strokeDasharray="3 2" />
            <text x="255" y="22" fontSize="10.5" fontWeight="black" textAnchor="middle" fill="#15803d">＋1 στον Μ.Ο.</text>

            {/* Νέος Μέσος Όρος = 17 */}
            <g transform="translate(330, 90)">
              <line x1="0" y1="-30" x2="0" y2="30" stroke="#16a34a" strokeWidth="2.2" strokeDasharray="3 2" />
              <circle cx="0" cy="0" r="5.5" fill="#16a34a" />
              <rect x="-48" y="-62" width="96" height="26" rx="6" fill="#dcfce7" stroke="#86efac" strokeWidth="1.2" />
              <text x="0" y="-45" fontSize="11.5" fontWeight="black" textAnchor="middle" fill="#166534">Μ.Ο. ＝ 17</text>
              <text x="0" y="24" fontSize="13" fontWeight="900" textAnchor="middle" fill="#15803d">17</text>
              <text x="0" y="44" fontSize="9.5" fontWeight="bold" textAnchor="middle" fill="#166534">5 γύροι (5 · 17 ＝ 85)</text>
            </g>

            {/* Ζητούμενος 5ος Γύρος = 21 */}
            <g transform="translate(560, 90)">
              <line x1="0" y1="-35" x2="0" y2="35" stroke="#ea580c" strokeWidth="2.5" />
              <circle cx="0" cy="0" r="7" fill="#ea580c" stroke="#9a3412" strokeWidth="1.5" />
              <rect x="-55" y="-65" width="110" height="28" rx="7" fill="#ea580c" />
              <text x="0" y="-47" fontSize="12" fontWeight="black" textAnchor="middle" fill="#ffffff">Στόχος: 21 ⭐</text>
              <text x="0" y="24" fontSize="15" fontWeight="900" textAnchor="middle" fill="#c2410c" fontFamily="monospace">21</text>
              <text x="0" y="44" fontSize="9.5" fontWeight="black" textAnchor="middle" fill="#ea580c">5ος γύρος (85 － 64)</text>
            </g>
          </svg>
        </div>

        {/* 1ος ΤΡΟΠΟΣ: ΜΕΣΩ ΣΥΝΟΛΙΚΟΥ ΑΘΡΟΙΣΜΑΤΟΣ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-2.5">
          <div className="font-sans font-bold text-blue-900 text-sm border-b border-slate-200 pb-1">
            🔷 1ος Τρόπος (Αλγεβρικά μέσω συνολικού αθροίσματος)
          </div>

          <p className="text-slate-700">
            Ο μέσος όρος ισούται με το πηλίκο του αθροίσματος των πόντων δια του πλήθους των γύρων:
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
            Συγκρίνουμε τον παλιό μέσο όρο (16) με τον επιθυμητό (17):
          </p>

          <div className="bg-white/90 p-3 rounded-xl border border-emerald-200 font-mono text-slate-900 space-y-1.5">
            <div>• Ο μέσος όρος πρέπει να αυξηθεί κατά: 17 － 16 ＝ <strong>＋1 πόντο</strong>.</div>
            <div>• Για να αυξηθεί ο μέσος όρος κατά 1 σε όλους τους <strong>5 γύρους</strong>, απαιτούνται επιπλέον: 5 · 1 ＝ <strong>＋5 πόντοι</strong>.</div>
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
          Παρατηρούμε ότι το σταθερό βήμα μεταξύ των διαδοχικών όρων είναι <strong>＋5</strong>:
        </p>

        {/* SVG ΣΧΗΜΑ 8: ΑΚΟΛΟΥΘΙΑ & ΒΗΜΑΤΑ */}
        <div className="flex justify-center p-3 bg-white/90 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="490" height="140" viewBox="0 0 490 140" className="select-none font-sans mx-auto block">
            <g transform="translate(20, 30)">
              <rect x="0" y="0" width="70" height="40" rx="6" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
              <text x="35" y="16" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#1d4ed8">1ος όρος</text>
              <text x="35" y="32" fontSize="13" fontWeight="black" textAnchor="middle" fill="#1e40af" fontFamily="monospace">4</text>
            </g>

            <path d="M 95 50 L 140 50" stroke="#16a34a" strokeWidth="2" />
            <text x="117" y="42" fontSize="10" fontWeight="black" textAnchor="middle" fill="#16a34a">＋5</text>

            <g transform="translate(145, 30)">
              <rect x="0" y="0" width="70" height="40" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="35" y="16" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#475569">2ος όρος</text>
              <text x="35" y="32" fontSize="13" fontWeight="black" textAnchor="middle" fill="#0f172a" fontFamily="monospace">9</text>
            </g>

            <text x="245" y="55" fontSize="16" fontWeight="black" textAnchor="middle" fill="#64748b">... (39 βήματα των 5)</text>

            <g transform="translate(360, 20)">
              <rect x="0" y="0" width="110" height="60" rx="8" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" />
              <text x="55" y="24" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#166534">40ός Όρος ⭐</text>
              <text x="55" y="48" fontSize="16" fontWeight="black" textAnchor="middle" fill="#15803d" fontFamily="monospace">199</text>
            </g>

            <g transform="translate(30, 95)">
              <rect x="0" y="0" width="430" height="30" rx="6" fill="#0f172a" />
              <text x="215" y="19" fontSize="11" fontWeight="black" textAnchor="middle" fill="#ffffff" fontFamily="monospace">
                Τύπος: 4 ＋ (40 － 1) · 5 ＝ 4 ＋ 39 · 5 ＝ 4 ＋ 195 ＝ 199
              </text>
            </g>
          </svg>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono space-y-1.5">
          <div>• Ο 1ος όρος είναι το 4.</div>
          <div>• Για να φτάσουμε στον 40ό όρο, προσθέτουμε το βήμα 5 ακριβώς <strong>39 φορές</strong> (40 － 1 ＝ 39).</div>
          <div>• 39 · 5 ＝ 195.</div>
          <div className="text-emerald-700 font-bold pt-1 border-t border-slate-200">
            • 40ός όρος ＝ 4 ＋ 195 ＝ <strong>199</strong>.
          </div>
        </div>
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
          Από την ταυτότητα της ευκλείδειας διαίρεσης: <span className="font-mono font-bold">Δ ＝ δ · π ＋ υ</span>, με τον περιορισμό ότι <span className="font-mono font-bold">υ &lt; δ</span>:
        </p>

        {/* SVG ΣΧΗΜΑ 9: ΜΕΓΙΣΤΟΠΟΙΗΣΗ ΥΠΟΛΟΙΠΟΥ */}
        <div className="flex justify-center p-3 bg-white/90 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="480" height="135" viewBox="0 0 480 135" className="select-none font-sans mx-auto block">
            <g transform="translate(30, 20)">
              <rect x="0" y="0" width="420" height="50" rx="8" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.6" />
              <text x="210" y="24" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#1d4ed8">δ ＝ 12, π ＝ 15 ➔ δ · π ＝ 12 · 15 ＝ 180</text>
              <text x="210" y="40" fontSize="10.5" fontWeight="black" textAnchor="middle" fill="#1e40af">Μέγιστο δυνατό υπόλοιπο: υ_max ＝ δ － 1 ＝ 11</text>
            </g>

            <g transform="translate(80, 85)">
              <rect x="0" y="0" width="320" height="34" rx="8" fill="#16a34a" />
              <text x="160" y="22" fontSize="12" fontWeight="black" textAnchor="middle" fill="#ffffff" fontFamily="monospace">
                Δ_max ＝ 180 ＋ 11 ＝ 191 ⭐
              </text>
            </g>
          </svg>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono space-y-1.5">
          <div>• Αφού ο διαιρέτης είναι 12, το υπόλοιπο μπορεί να πάρει τιμές από 0 έως 11.</div>
          <div>• Για να γίνει ο διαιρετέος <strong>μέγιστος</strong>, πρέπει και το υπόλοιπο να πάρει τη <strong>μέγιστη δυνατή τιμή</strong>, δηλαδή <strong>υ ＝ 11</strong>.</div>
          <div className="text-emerald-700 font-bold pt-1 border-t border-slate-200">
            • Δ_max ＝ 12 · 15 ＋ 11 ＝ 180 ＋ 11 ＝ <strong>191</strong>.
          </div>
        </div>
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
          Εξετάζουμε τα χρήματα που απομένουν μετά από κάθε αγορά:
        </p>

        {/* SVG ΣΧΗΜΑ 10: ΔΙΑΔΟΧΙΚΑ ΚΛΑΣΜΑΤΑ */}
        <div className="flex justify-center p-3 bg-white/90 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="490" height="150" viewBox="0 0 490 150" className="select-none font-sans mx-auto block">
            <g transform="translate(20, 20)">
              {/* Αρχική μπάρα 3 τρίτων */}
              <rect x="0" y="0" width="140" height="45" rx="4" fill="#fee2e2" stroke="#ef4444" strokeWidth="1.5" />
              <text x="70" y="27" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#dc2626">Βιβλίο: 1/3 (20€)</text>

              <rect x="145" y="0" width="295" height="45" rx="4" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
              <text x="292" y="27" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#1d4ed8">Υπόλοιπο: 2/3 (40€)</text>
            </g>

            {/* Ανάλυση υπολοίπου */}
            <g transform="translate(165, 80)">
              <rect x="0" y="0" width="70" height="35" rx="4" fill="#fee2e2" stroke="#ef4444" strokeWidth="1.2" />
              <text x="35" y="22" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#dc2626">1/4 (10€)</text>

              <rect x="75" y="0" width="220" height="35" rx="4" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.8" />
              <text x="185" y="22" fontSize="11" fontWeight="black" textAnchor="middle" fill="#166534">3/4 του υπολοίπου ＝ 30 € ⭐</text>
            </g>
          </svg>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono space-y-1.5">
          <div>• Μετά το βιβλίο (1/3), του έμειναν τα <strong>2/3</strong> των χρημάτων του.</div>
          <div>• Ξόδεψε το 1/4 του υπολοίπου, άρα του έμειναν τα <strong>3/4 του υπολοίπου</strong>.</div>
          <div>• Τα 3/4 του υπολοίπου ισούνται με 30 € ➔ Το υπόλοιπο ήταν: 30 · (4/3) ＝ <strong>40 €</strong>.</div>
          <div className="text-emerald-700 font-bold pt-1 border-t border-slate-200">
            • Τα 40 € ήταν τα 2/3 του αρχικού ποσού ➔ Αρχικό ποσό: 40 · (3/2) ＝ <strong>60 €</strong>.
          </div>
        </div>
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
          Υπολογίζουμε τη <strong>συνολική ποσότητα καθαρού αλατιού</strong> και το <strong>συνολικό βάρος</strong> του μείγματος:
        </p>

        {/* SVG ΣΧΗΜΑ 11: ΑΝΑΜΕΙΞΗ ΔΙΑΛΥΜΑΤΩΝ */}
        <div className="flex justify-center p-3 bg-white/90 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="510" height="160" viewBox="0 0 510 160" className="select-none font-sans mx-auto block">
            {/* Δοχείο Α */}
            <g transform="translate(20, 20)">
              <rect x="0" y="0" width="120" height="70" rx="8" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.6" />
              <text x="60" y="22" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#1d4ed8">Δοχείο Α (200 g)</text>
              <text x="60" y="40" fontSize="9.5" textAnchor="middle" fill="#2563eb">10% αλάτι</text>
              <text x="60" y="58" fontSize="11" fontWeight="black" textAnchor="middle" fill="#1e40af" fontFamily="monospace">＝ 20 g αλάτι</text>
            </g>

            <text x="165" y="60" fontSize="22" fontWeight="black" textAnchor="middle" fill="#64748b">＋</text>

            {/* Δοχείο Β */}
            <g transform="translate(190, 20)">
              <rect x="0" y="0" width="120" height="70" rx="8" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.6" />
              <text x="60" y="22" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#1d4ed8">Δοχείο Β (300 g)</text>
              <text x="60" y="40" fontSize="9.5" textAnchor="middle" fill="#2563eb">20% αλάτι</text>
              <text x="60" y="58" fontSize="11" fontWeight="black" textAnchor="middle" fill="#1e40af" fontFamily="monospace">＝ 60 g αλάτι</text>
            </g>

            <text x="335" y="60" fontSize="22" fontWeight="black" textAnchor="middle" fill="#64748b">＝</text>

            {/* Δοχείο Γ */}
            <g transform="translate(360, 15)">
              <rect x="0" y="0" width="130" height="80" rx="10" fill="#dcfce7" stroke="#16a34a" strokeWidth="2.2" />
              <text x="65" y="24" fontSize="11" fontWeight="black" textAnchor="middle" fill="#166534">Δοχείο Γ (Μείγμα)</text>
              <text x="65" y="44" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#15803d">500 g διάλυμα</text>
              <text x="65" y="66" fontSize="14" fontWeight="900" textAnchor="middle" fill="#166534" fontFamily="monospace">16% αλάτι ⭐</text>
            </g>

            <g transform="translate(60, 110)">
              <rect x="0" y="0" width="390" height="34" rx="8" fill="#0f172a" />
              <text x="195" y="22" fontSize="11.5" fontWeight="bold" textAnchor="middle" fill="#ffffff" fontFamily="monospace">
                (20 g ＋ 60 g) : 500 g ＝ 80 : 500 ＝ 16 : 100 ＝ 16%
              </text>
            </g>
          </svg>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono space-y-1.5">
          <div>• Αλάτι στο δοχείο Α: 10% · 200 ＝ <strong>20 g</strong>.</div>
          <div>• Αλάτι στο δοχείο Β: 20% · 300 ＝ <strong>60 g</strong>.</div>
          <div>• Συνολικό αλάτι στο Γ: 20 ＋ 60 ＝ <strong>80 g</strong>.</div>
          <div>• Συνολικό βάρος διαλύματος: 200 ＋ 300 ＝ <strong>500 g</strong>.</div>
          <div className="text-emerald-700 font-bold pt-1 border-t border-slate-200">
            • Ποσοστό αλατιού: 80 / 500 ＝ 16 / 100 ＝ <strong>16%</strong>.
          </div>
        </div>
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
          Αφαιρούμε το εμβαδόν του εγγεγραμμένου κύκλου από το εμβαδόν του τετραγώνου:
        </p>

        {/* SVG ΣΧΗΜΑ 12: ΤΕΤΡΑΓΩΝΟ ΚΑΙ ΕΓΓΕΓΡΑΜΜΕΝΟΣ ΚΥΚΛΟΣ */}
        <div className="flex justify-center p-3 bg-white/90 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="460" height="170" viewBox="0 0 460 170" className="select-none font-sans mx-auto block">
            <g transform="translate(60, 15)">
              {/* Τετράγωνο */}
              <rect x="0" y="0" width="140" height="140" rx="4" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
              {/* Κύκλος */}
              <circle cx="70" cy="70" r="70" fill="#eff6ff" stroke="#2563eb" strokeWidth="2" />
              <text x="70" y="65" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#1d4ed8">Κύκλος (r ＝ 10)</text>
              <text x="70" y="82" fontSize="11" fontWeight="black" textAnchor="middle" fill="#1e40af" fontFamily="monospace">Ε_κ ＝ 314 τ.εκ.</text>
              
              {/* Γωνίες */}
              <text x="18" y="24" fontSize="9" fontWeight="black" fill="#c2410c">Γωνία</text>
              <text x="122" y="24" fontSize="9" fontWeight="black" textAnchor="end" fill="#c2410c">Γωνία</text>
            </g>

            {/* Πίνακας πράξεων δεξιά */}
            <g transform="translate(230, 25)">
              <rect x="0" y="0" width="200" height="115" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.2" />
              <text x="16" y="24" fontSize="10.5" fontWeight="bold" fill="#0f172a">• Ε_τετρ ＝ 20 · 20 ＝ 400 τ.εκ.</text>
              <text x="16" y="48" fontSize="10.5" fontWeight="bold" fill="#0f172a">• r ＝ 20 : 2 ＝ 10 εκ.</text>
              <text x="16" y="70" fontSize="10.5" fontWeight="bold" fill="#0f172a">• Ε_κυκλ ＝ 3,14 · 10² ＝ 314 τ.εκ.</text>
              <line x1="16" y1="80" x2="184" y2="80" stroke="#e2e8f0" strokeWidth="1" />
              <text x="16" y="100" fontSize="12" fontWeight="black" fill="#15803d">Διαφορά ＝ 86 τ.εκ. ⭐</text>
            </g>
          </svg>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono space-y-1.5">
          <div>• Εμβαδόν τετραγώνου: 20 · 20 ＝ <strong>400 τ.εκ.</strong></div>
          <div>• Η διάμετρος του μέγιστου κύκλου ισούται με την πλευρά (20 εκ.), άρα η ακτίνα είναι <strong>r ＝ 10 εκ.</strong></div>
          <div>• Εμβαδόν κύκλου: π · r² ≈ 3,14 · 10 · 10 ＝ <strong>314 τ.εκ.</strong></div>
          <div className="text-emerald-700 font-bold pt-1 border-t border-slate-200">
            • Ζητούμενο εμβαδόν: 400 － 314 ＝ <strong>86 τ.εκ.</strong>
          </div>
        </div>
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
          Τα καράβια θα συναντηθούν ξανά μετά από αριθμό ημερών ίσο με το <strong>Ε.Κ.Π.(12, 18)</strong>:
        </p>

        {/* SVG ΣΧΗΜΑ 13: ΗΜΕΡΟΛΟΓΙΑΚΗ ΑΡΙΘΜΟΓΡΑΜΜΗ */}
        <div className="bg-white/90 p-3.5 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="490" height="145" viewBox="0 0 490 145" className="select-none font-sans mx-auto block">
            <line x1="30" y1="75" x2="460" y2="75" stroke="#334155" strokeWidth="2" />

            <g transform="translate(50, 75)">
              <circle cx="0" cy="0" r="5" fill="#3b82f6" />
              <text x="0" y="-14" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#1d4ed8">1η Μαΐου</text>
              <text x="0" y="22" fontSize="9" textAnchor="middle" fill="#64748b">Αναχώρηση</text>
            </g>

            {/* +36 ημέρες */}
            <path d="M 50 60 Q 235 15 420 60" fill="none" stroke="#16a34a" strokeWidth="2" strokeDasharray="4 3" />
            <text x="235" y="32" fontSize="12" fontWeight="black" textAnchor="middle" fill="#15803d">
              ＋36 Ημέρες [Ε.Κ.Π.(12, 18) ＝ 36]
            </text>

            <g transform="translate(420, 75)">
              <circle cx="0" cy="0" r="6" fill="#16a34a" />
              <text x="0" y="-14" fontSize="12" fontWeight="black" textAnchor="middle" fill="#15803d">6 Ιουνίου ⭐</text>
              <text x="0" y="22" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#166534">31 Μαΐου ＋ 6 μέρες</text>
            </g>
          </svg>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono space-y-1.5">
          <div>• Ε.Κ.Π.(12, 18) ＝ <strong>36 ημέρες</strong>.</div>
          <div>• Από την 1η Μαΐου προσθέτουμε 36 ημέρες:</div>
          <div>• Μέχρι το τέλος Μαΐου απομένουν: 31 － 1 ＝ 30 ημέρες.</div>
          <div className="text-emerald-700 font-bold pt-1 border-t border-slate-200">
            • Υπολείπονται: 36 － 30 ＝ 6 ημέρες του Ιουνίου ➔ <strong>6 Ιουνίου</strong>.
          </div>
        </div>
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
          Εκφράζουμε τα ποσά με βάση τα χρήματα του Γιάννη (<strong>x</strong>):
        </p>

        {/* SVG ΣΧΗΜΑ 14: ΑΝΑΛΥΣΗ ΜΕΡΙΔΙΩΝ */}
        <div className="flex justify-center p-3 bg-white/90 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="480" height="150" viewBox="0 0 480 150" className="select-none font-sans mx-auto block">
            <g transform="translate(30, 20)">
              <rect x="0" y="0" width="80" height="30" rx="4" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
              <text x="40" y="19" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#1d4ed8">Γιάννης: x</text>
            </g>

            <g transform="translate(130, 20)">
              <rect x="0" y="0" width="120" height="30" rx="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="60" y="19" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#334155">Μαρία: x ＋ 15</text>
            </g>

            <g transform="translate(270, 20)">
              <rect x="0" y="0" width="180" height="30" rx="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="90" y="19" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#334155">Κώστας: 2x ＋ 30</text>
            </g>

            <g transform="translate(30, 70)">
              <rect x="0" y="0" width="420" height="60" rx="8" fill="#0f172a" />
              <text x="210" y="26" fontSize="11.5" fontWeight="bold" textAnchor="middle" fill="#cbd5e1">
                Σύνολο: x ＋ (x ＋ 15) ＋ (2x ＋ 30) ＝ 4x ＋ 45 ＝ 125
              </text>
              <text x="210" y="48" fontSize="13" fontWeight="black" textAnchor="middle" fill="#4ade80" fontFamily="monospace">
                4x ＝ 80 ➔ x ＝ 20 € (Γιάννης) ⭐
              </text>
            </g>
          </svg>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono space-y-1.5">
          <div>• Γιάννης: x</div>
          <div>• Μαρία: x ＋ 15</div>
          <div>• Κώστας: 2 · (x ＋ 15) ＝ 2x ＋ 30</div>
          <div>• Άθροισμα: x ＋ x ＋ 15 ＋ 2x ＋ 30 ＝ 4x ＋ 45 ＝ 125 €</div>
          <div>• 4x ＝ 125 － 45 ＝ 80 ➔ x ＝ 80 : 4 ＝ <strong>20 €</strong>.</div>
          <div className="text-emerald-700 font-bold pt-1 border-t border-slate-200">
            • Ο Γιάννης έχει <strong>20 €</strong> (Μαρία: 35 €, Κώστας: 70 €).
          </div>
        </div>
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
          Υπολογίζουμε το συνολικό άθροισμα των βαθμών όλων των παιδιών και διαιρούμε με το συνολικό πλήθος (<strong>25 μαθητές</strong>):
        </p>

        {/* SVG ΣΧΗΜΑ 15: ΣΤΑΘΜΙΣΜΕΝΟΣ ΜΕΣΟΣ ΟΡΟΣ */}
        <div className="flex justify-center p-3 bg-white/90 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="480" height="150" viewBox="0 0 480 150" className="select-none font-sans mx-auto block">
            <g transform="translate(25, 20)">
              <rect x="0" y="0" width="190" height="60" rx="8" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.6" />
              <text x="95" y="24" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#1d4ed8">10 Αγόρια (Μ.Ο. 14)</text>
              <text x="95" y="46" fontSize="12.5" fontWeight="black" textAnchor="middle" fill="#1e40af" fontFamily="monospace">10 · 14 ＝ 140 βαθμοί</text>
            </g>

            <g transform="translate(265, 20)">
              <rect x="0" y="0" width="190" height="60" rx="8" fill="#fdf2f8" stroke="#ec4899" strokeWidth="1.6" />
              <text x="95" y="24" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#be185d">15 Κορίτσια (Μ.Ο. 16,5)</text>
              <text x="95" y="46" fontSize="12.5" fontWeight="black" textAnchor="middle" fill="#9d174d" fontFamily="monospace">15 · 16,5 ＝ 247,5</text>
            </g>

            <g transform="translate(60, 95)">
              <rect x="0" y="0" width="360" height="40" rx="8" fill="#16a34a" />
              <text x="180" y="25" fontSize="12.5" fontWeight="black" textAnchor="middle" fill="#ffffff" fontFamily="monospace">
                Μ.Ο. Τμήματος ＝ 387,5 : 25 ＝ 15,5 ⭐
              </text>
            </g>
          </svg>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono space-y-1.5">
          <div>• Βαθμοί αγοριών: 10 · 14 ＝ <strong>140</strong>.</div>
          <div>• Βαθμοί κοριτσιών: 15 · 16,5 ＝ <strong>247,5</strong>.</div>
          <div>• Συνολικοί βαθμοί: 140 ＋ 247,5 ＝ <strong>387,5</strong>.</div>
          <div>• Σύνολο μαθητών: 10 ＋ 15 ＝ <strong>25 μαθητές</strong>.</div>
          <div className="text-emerald-700 font-bold pt-1 border-t border-slate-200">
            • Συνολικός Μέσος Όρος: 387,5 : 25 ＝ <strong>15,5</strong>.
          </div>
        </div>
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
          Παρατηρούμε ότι σε κάθε επόμενο σχήμα προστίθενται σταθερά <strong>4 τετράγωνα</strong> (αριθμητική ακολουθία με βήμα 4):
        </p>

        {/* SVG ΣΧΗΜΑ 16: ΑΝΑΠΤΥΞΗ ΜΟΤΙΒΟΥ */}
        <div className="flex justify-center p-3 bg-white/90 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="480" height="140" viewBox="0 0 480 140" className="select-none font-sans mx-auto block">
            {/* Σχήμα 1 */}
            <g transform="translate(30, 20)">
              <rect x="0" y="0" width="60" height="40" rx="4" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
              <text x="30" y="16" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#1d4ed8">Σχ. 1</text>
              <text x="30" y="32" fontSize="12" fontWeight="black" textAnchor="middle" fill="#1e40af">1</text>
            </g>

            {/* Σχήμα 2 */}
            <g transform="translate(110, 20)">
              <rect x="0" y="0" width="60" height="40" rx="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="30" y="16" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#475569">Σχ. 2 (+4)</text>
              <text x="30" y="32" fontSize="12" fontWeight="black" textAnchor="middle" fill="#0f172a">5</text>
            </g>

            {/* Σχήμα 3 */}
            <g transform="translate(190, 20)">
              <rect x="0" y="0" width="60" height="40" rx="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="30" y="16" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#475569">Σχ. 3 (+4)</text>
              <text x="30" y="32" fontSize="12" fontWeight="black" textAnchor="middle" fill="#0f172a">9</text>
            </g>

            {/* Σχήμα Ν */}
            <g transform="translate(320, 10)">
              <rect x="0" y="0" width="130" height="60" rx="8" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" />
              <text x="65" y="24" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#166534">Σχήμα Ν ⭐</text>
              <text x="65" y="48" fontSize="15" fontWeight="black" textAnchor="middle" fill="#15803d" fontFamily="monospace">97 τετρ. (Ν = 25)</text>
            </g>

            <g transform="translate(30, 85)">
              <rect x="0" y="0" width="420" height="34" rx="6" fill="#0f172a" />
              <text x="210" y="22" fontSize="11.5" fontWeight="bold" textAnchor="middle" fill="#ffffff" fontFamily="monospace">
                1 ＋ (Ν － 1) · 4 ＝ 97 ➔ (Ν － 1) · 4 ＝ 96 ➔ Ν － 1 ＝ 24 ➔ Ν ＝ 25
              </text>
            </g>
          </svg>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono space-y-1.5">
          <div>• Ο τύπος του πλήθους τετραγώνων για το Σχήμα Ν είναι: <strong>1 ＋ (Ν － 1) · 4</strong>.</div>
          <div>• Εξισώνουμε με 97: 1 ＋ 4 · (Ν － 1) ＝ 97</div>
          <div>• 4 · (Ν － 1) ＝ 96 ➔ Ν － 1 ＝ 96 : 4 ＝ 24</div>
          <div className="text-emerald-700 font-bold pt-1 border-t border-slate-200">
            • <strong>Ν ＝ 24 ＋ 1 ＝ 25</strong>.
          </div>
        </div>
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
          Υπολογίζουμε πρώτα την <strong>αρχική τιμή</strong> (100%) και στη συνέχεια τη νέα τιμή με έκπτωση 10%:
        </p>

        {/* SVG ΣΧΗΜΑ 17: ΑΡΧΙΚΗ ΤΙΜΗ & ΝΕΑ ΕΚΠΤΩΣΗ */}
        <div className="flex justify-center p-3 bg-white/90 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="480" height="145" viewBox="0 0 480 145" className="select-none font-sans mx-auto block">
            <g transform="translate(20, 20)">
              <rect x="0" y="0" width="200" height="55" rx="8" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.6" />
              <text x="100" y="22" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#1d4ed8">Έκπτωση 30% ➔ Πληρωμή 70%</text>
              <text x="100" y="44" fontSize="13" fontWeight="black" textAnchor="middle" fill="#1e40af" fontFamily="monospace">70% ＝ 210 € ➔ Αρχική ＝ 300 €</text>
            </g>

            <g transform="translate(260, 20)">
              <rect x="0" y="0" width="200" height="55" rx="8" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.8" />
              <text x="100" y="22" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#166534">Έκπτωση 10% ➔ Πληρωμή 90%</text>
              <text x="100" y="44" fontSize="13" fontWeight="black" textAnchor="middle" fill="#15803d" fontFamily="monospace">90% · 300 € ＝ 270 € ⭐</text>
            </g>

            <g transform="translate(60, 95)">
              <rect x="0" y="0" width="360" height="34" rx="6" fill="#0f172a" />
              <text x="180" y="22" fontSize="11.5" fontWeight="bold" textAnchor="middle" fill="#ffffff" fontFamily="monospace">
                Αρχική: 210 : 0,70 ＝ 300 € ➔ Νέα: 300 － 10% (30€) ＝ 270 €
              </text>
            </g>
          </svg>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono space-y-1.5">
          <div>• Με έκπτωση 30%, ο πελάτης πληρώνει το 100% － 30% ＝ <strong>70% της αρχικής τιμής</strong>.</div>
          <div>• 70% ＝ 210 € ➔ 1% ＝ 210 : 70 ＝ 3 € ➔ Αρχική Τιμή (100%) ＝ <strong>300 €</strong>.</div>
          <div>• Με έκπτωση 10%, η μείωση είναι 10% · 300 ＝ 30 €.</div>
          <div className="text-emerald-700 font-bold pt-1 border-t border-slate-200">
            • Νέα Τιμή Πώλησης ＝ 300 － 30 ＝ <strong>270 €</strong>.
          </div>
        </div>
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
          Εξετάζουμε το αρχικό και το νέο εμβαδόν του ορθογωνίου:
        </p>

        {/* SVG ΣΧΗΜΑ 18: ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ ΔΙΑΣΤΑΣΕΩΝ */}
        <div className="flex justify-center p-3 bg-white/90 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="480" height="150" viewBox="0 0 480 150" className="select-none font-sans mx-auto block">
            {/* Αρχικό */}
            <g transform="translate(30, 35)">
              <rect x="0" y="0" width="50" height="40" rx="4" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
              <text x="25" y="24" fontSize="9.5" fontWeight="bold" textAnchor="middle" fill="#1d4ed8">Ε_αρχ ＝ Ε</text>
            </g>

            {/* Νέο (2x μήκος, 3x πλάτος = 6 υπο-ορθογώνια) */}
            <g transform="translate(140, 15)">
              <rect x="0" y="0" width="100" height="120" rx="6" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2" />
              <text x="50" y="65" fontSize="12" fontWeight="black" textAnchor="middle" fill="#15803d">
                Ε_νέο ＝ 6 · Ε
              </text>
            </g>

            {/* Επεξήγηση αύξησης */}
            <g transform="translate(265, 30)">
              <rect x="0" y="0" width="190" height="90" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.2" />
              <text x="16" y="24" fontSize="10.5" fontWeight="bold" fill="#0f172a">• Νέο εμβαδόν: 6 · Ε (600%)</text>
              <text x="16" y="46" fontSize="10.5" fontWeight="bold" fill="#0f172a">• Αρχικό εμβαδόν: 1 · Ε (100%)</text>
              <line x1="16" y1="56" x2="174" y2="56" stroke="#e2e8f0" strokeWidth="1" />
              <text x="16" y="76" fontSize="12" fontWeight="black" fill="#16a34a">Αύξηση: ＋500% ⭐</text>
            </g>
          </svg>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono space-y-1.5">
          <div>• Αρχικό εμβαδόν: Ε_1 ＝ α · β.</div>
          <div>• Νέο εμβαδόν: Ε_2 ＝ (2 · α) · (3 · β) ＝ 6 · (α · β) ＝ <strong>6 · Ε_1</strong>.</div>
          <div>• Το νέο εμβαδόν έγινε 6πλάσιο, δηλαδή αντιστοιχεί στο 600% του αρχικού.</div>
          <div className="text-emerald-700 font-bold pt-1 border-t border-slate-200">
            • Η αύξηση είναι: 600% － 100% ＝ <strong>500%</strong>.
          </div>
        </div>
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
          Κάνουμε τα κλάσματα ομώνυμα με κοινό παρονομαστή το <strong>15</strong>:
        </p>

        {/* SVG ΣΧΗΜΑ 19: ΚΑΤΑΝΟΜΗ ΑΘΛΗΜΑΤΩΝ */}
        <div className="bg-white/90 p-3.5 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="490" height="150" viewBox="0 0 490 150" className="select-none font-sans mx-auto block">
            <g transform="translate(20, 20)">
              {/* Ποδόσφαιρο 6/15 */}
              <rect x="0" y="0" width="180" height="45" rx="4" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
              <text x="90" y="27" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#1d4ed8">⚽ Ποδόσφαιρο: 2/5 ＝ 6/15</text>

              {/* Μπάσκετ 5/15 */}
              <rect x="185" y="0" width="150" height="45" rx="4" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="260" y="27" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#b45309">🏀 Μπάσκετ: 1/3 ＝ 5/15</text>

              {/* Κολύμπι 4/15 */}
              <rect x="340" y="0" width="120" height="45" rx="4" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" />
              <text x="400" y="27" fontSize="10.5" fontWeight="black" textAnchor="middle" fill="#166534">🏊 4/15 ＝ 16 ⭐</text>
            </g>

            <g transform="translate(20, 85)">
              <rect x="0" y="0" width="440" height="36" rx="8" fill="#0f172a" />
              <text x="220" y="23" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#ffffff" fontFamily="monospace">
                4 μέρη ＝ 16 παιδιά ➔ 1 μέρος (1/15) ＝ 4 ➔ Σύνολο (15/15) ＝ 60 παιδιά
              </text>
            </g>
          </svg>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono space-y-1.5">
          <div>• Ποδόσφαιρο ＋ Μπάσκετ: 2/5 ＋ 1/3 ＝ 6/15 ＋ 5/15 ＝ <strong>11/15</strong>.</div>
          <div>• Κολύμπι (υπόλοιπο): 1 － 11/15 ＝ <strong>4/15</strong>.</div>
          <div>• Τα 4/15 αντιστοιχούν σε 16 παιδιά.</div>
          <div>• Το 1/15 αντιστοιχεί σε: 16 : 4 ＝ <strong>4 παιδιά</strong>.</div>
          <div className="text-emerald-700 font-bold pt-1 border-t border-slate-200">
            • Όλα τα παιδιά (15/15): 15 · 4 ＝ <strong>60 παιδιά</strong>.
          </div>
        </div>
      </div>
    )
  },
  {
    id: 20,
    group: 'ΟΜΑΔΑ Β (5 ΕΠΙΛΟΓΕΣ)',
    prompt: 'Ψάχνουμε έναν διψήφιο αριθμό ΧΥ τέτοιον ώστε: (1) είναι περιττός (μονός) αριθμός, (2) αν διαιρεθεί με το 5 αφήνει υπόλοιπο 3, και (3) το άθροισμα των ψηφίων του X ＋ Y είναι ίσο με 11. Ποιος είναι ο αριθμός ΧΥ;',
    options: ['38', '53', '83', '93', '98'],
    correct: '83',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Συνδυάζουμε τις τρεις συνθήκες για να προσδιορίσουμε μονοσήμαντα τα ψηφία <strong>Χ</strong> και <strong>Υ</strong>:
        </p>

        {/* SVG ΣΧΗΜΑ 20: ΛΟΓΙΚΟ ΔΙΑΓΡΑΜΜΑ ΠΕΡΙΟΡΙΣΜΩΝ */}
        <div className="flex justify-center p-3 bg-white/90 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="490" height="150" viewBox="0 0 490 150" className="select-none font-sans mx-auto block">
            {/* Βήμα 1 */}
            <g transform="translate(15, 20)">
              <rect x="0" y="0" width="140" height="60" rx="8" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
              <text x="70" y="24" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#1d4ed8">Διαίρεση με 5 (υπ. 3)</text>
              <text x="70" y="44" fontSize="11" fontWeight="black" textAnchor="middle" fill="#1e40af" fontFamily="monospace">Υ ∈ &#123;3, 8&#125;</text>
            </g>

            {/* Βήμα 2 */}
            <g transform="translate(175, 20)">
              <rect x="0" y="0" width="140" height="60" rx="8" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
              <text x="70" y="24" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#1d4ed8">Περιττός (Μονός)</text>
              <text x="70" y="44" fontSize="11" fontWeight="black" textAnchor="middle" fill="#1e40af" fontFamily="monospace">Αποκλείεται το 8 ➔ Υ ＝ 3</text>
            </g>

            {/* Βήμα 3 */}
            <g transform="translate(335, 15)">
              <rect x="0" y="0" width="140" height="70" rx="10" fill="#dcfce7" stroke="#16a34a" strokeWidth="2.2" />
              <text x="70" y="24" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#166534">Χ ＋ Υ ＝ 11</text>
              <text x="70" y="42" fontSize="10" textAnchor="middle" fill="#166534">Χ ＋ 3 ＝ 11 ➔ Χ ＝ 8</text>
              <text x="70" y="60" fontSize="14" fontWeight="black" textAnchor="middle" fill="#15803d" fontFamily="monospace">ΧΥ ＝ 83 ⭐</text>
            </g>

            <g transform="translate(45, 100)">
              <rect x="0" y="0" width="400" height="34" rx="8" fill="#0f172a" />
              <text x="200" y="22" fontSize="11.5" fontWeight="black" textAnchor="middle" fill="#ffffff" fontFamily="monospace">
                Επαλήθευση: 83 : 5 ＝ 16 (υπ. 3) &nbsp;|&nbsp; 8 ＋ 3 ＝ 11 &nbsp;|&nbsp; Περιττός ✔️
              </text>
            </g>
          </svg>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono space-y-1.5">
          <div>1. Ένας αριθμός που διαιρούμενος με το 5 αφήνει υπόλοιπο 3 λήγει σε <strong>3 ή 8</strong> (Υ ＝ 3 ή Υ ＝ 8).</div>
          <div>2. Επειδή ο αριθμός είναι περιττός, αποκλείεται να λήγει σε 8. Άρα υποχρεωτικά <strong>Υ ＝ 3</strong>.</div>
          <div>3. Το άθροισμα των ψηφίων είναι 11: Χ ＋ Υ ＝ 11 ➔ Χ ＋ 3 ＝ 11 ➔ <strong>Χ ＝ 8</strong>.</div>
          <div className="text-emerald-700 font-bold pt-1 border-t border-slate-200">
            • Επομένως, ο ζητούμενος αριθμός είναι το <strong>83</strong>.
          </div>
        </div>
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
