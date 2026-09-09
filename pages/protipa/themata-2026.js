import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { LAYOUT } from '../../shared/layout-config';

// Component για κάθετη απεικόνιση κλασμάτων
function Fraction({ num, den, inline = true }) {
  return (
    <span className={`${inline ? 'inline-flex' : 'flex'} flex-col items-center justify-center align-middle mx-1 font-mono font-bold text-sm leading-none select-none`}>
      <span className="border-b-2 border-current px-1 pb-0.5 text-center w-full block">{num}</span>
      <span className="pt-0.5 text-center w-full block">{den}</span>
    </span>
  );
}

const QUESTIONS_2026 = [
  {
    id: 1,
    officialNumber: 21,
    group: 'ΟΜΑΔΑ Α (4 Επιλογες)',
    promptText: 'Ποιος είναι ο αριθμός x ώστε να ισχύει η παρακάτω ισότητα;',
    customPromptComponent: (
      <div className="flex items-center justify-center gap-1 sm:gap-2 my-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-base sm:text-lg font-mono font-bold text-slate-900 flex-wrap">
        <Fraction num="11" den="2" />
        <span>＋</span>
        <Fraction num="11" den="4" />
        <span>＋</span>
        <Fraction num="11" den="8" />
        <span>＋ x ＝ 11</span>
      </div>
    ),
    options: [
      { key: 'A', label: <span className="inline-flex items-center">x ＝ <Fraction num="1" den="8" /></span>, raw: '1/8' },
      { key: 'B', label: <span className="inline-flex items-center">x ＝ <Fraction num="11" den="16" /></span>, raw: '11/16' },
      { key: 'Γ', label: <span className="inline-flex items-center">x ＝ <Fraction num="11" den="8" /></span>, raw: '11/8' },
      { key: 'Δ', label: <span className="inline-flex items-center">x ＝ <Fraction num="11" den="4" /></span>, raw: '11/4' }
    ],
    correctRaw: '11/8',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Μπορούμε να επιλύσουμε την εξίσωση με δύο κομψούς τρόπους:
        </p>

        {/* 1ος ΤΡΟΠΟΣ: ΠΑΡΑΓΟΝΤΟΠΟΙΗΣΗ ΜΕ ΤΟ 11 */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-2.5">
          <div className="font-sans font-bold text-blue-900 text-sm border-b border-slate-200 pb-1">
            🔷 1ος Τρόπος (Παραγοντοποίηση με κοινό παράγοντα το 11)
          </div>

          <p className="text-slate-800">
            Παρατηρούμε ότι όλα τα κλάσματα καθώς και το δεύτερο μέλος έχουν αριθμητή το <strong>11</strong>. Βγάζουμε κοινό παράγοντα το 11:
          </p>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>11 · (</span>
              <Fraction num="1" den="2" />
              <span>＋</span>
              <Fraction num="1" den="4" />
              <span>＋</span>
              <Fraction num="1" den="8" />
              <span>) ＋ x ＝ 11</span>
            </div>

            <div className="text-slate-500 font-sans text-xs pl-2">
              // Διαιρούμε όλα τα μέλη της εξίσωσης με το 11:
            </div>

            <div className="flex items-center gap-1.5 flex-wrap pl-2">
              <span>(</span>
              <Fraction num="1" den="2" />
              <span>＋</span>
              <Fraction num="1" den="4" />
              <span>＋</span>
              <Fraction num="1" den="8" />
              <span>) ＋</span>
              <Fraction num="x" den="11" />
              <span>＝ 1</span>
            </div>

            <div className="text-slate-500 font-sans text-xs pl-2">
              // Κάνουμε τα κλάσματα μέσα στην παρένθεση ομώνυμα με Ε.Κ.Π.(2, 4, 8) ＝ 8:
            </div>

            <div className="flex items-center gap-1.5 flex-wrap pl-2">
              <Fraction num="4" den="8" />
              <span>＋</span>
              <Fraction num="2" den="8" />
              <span>＋</span>
              <Fraction num="1" den="8" />
              <span>＋</span>
              <Fraction num="x" den="11" />
              <span>＝ 1</span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap pl-2">
              <Fraction num="7" den="8" />
              <span>＋</span>
              <Fraction num="x" den="11" />
              <span>＝ 1</span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap pl-2">
              <Fraction num="x" den="11" />
              <span>＝ 1 －</span>
              <Fraction num="7" den="8" />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap pl-2">
              <Fraction num="x" den="11" />
              <span>＝</span>
              <Fraction num="1" den="8" />
              <span>➔ <strong className="text-emerald-700 text-base">x ＝ <Fraction num="11" den="8" /></strong></span>
            </div>
          </div>
        </div>

        {/* 2ος ΤΡΟΠΟΣ: ΟΜΩΝΥΜΑ ΚΛΑΣΜΑΤΑ ΣΕ ΟΛΗ ΤΗΝ ΕΞΙΣΩΣΗ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-2.5">
          <div className="font-sans font-bold text-blue-900 text-sm border-b border-slate-200 pb-1">
            🔷 2ος Τρόπος (Απευθείας μετατροπή σε ομώνυμα με Ε.Κ.Π. το 8)
          </div>

          <p className="text-slate-800">
            Μετατρέπουμε όλους τους όρους σε κλάσματα με παρονομαστή το <strong>8</strong>:
          </p>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>•</span>
              <Fraction num="11" den="2" />
              <span>＝</span>
              <Fraction num="44" den="8" />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>•</span>
              <Fraction num="11" den="4" />
              <span>＝</span>
              <Fraction num="22" den="8" />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>•</span>
              <Fraction num="11" den="8" />
              <span className="text-slate-500 font-sans text-xs">(παραμένει ως έχει)</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• 11 ＝</span>
              <Fraction num="88" den="8" />
            </div>

            <div className="pt-2 border-t border-slate-200 space-y-1.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>(</span>
                <Fraction num="44" den="8" />
                <span>＋</span>
                <Fraction num="22" den="8" />
                <span>＋</span>
                <Fraction num="11" den="8" />
                <span>) ＋ x ＝</span>
                <Fraction num="88" den="8" />
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <Fraction num="77" den="8" />
                <span>＋ x ＝</span>
                <Fraction num="88" den="8" />
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>x ＝</span>
                <Fraction num="88" den="8" />
                <span>－</span>
                <Fraction num="77" den="8" />
                <span>➔ <strong className="text-emerald-700 text-base">x ＝ <Fraction num="11" den="8" /></strong></span>
              </div>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Συνεπώς, ο ζητούμενος αριθμός είναι <strong>x ＝ <Fraction num="11" den="8" /></strong> (Επιλογή <strong>Γ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 2,
    officialNumber: 22,
    group: 'ΟΜΑΔΑ Α (4 Επιλογες)',
    promptText: 'Ένα ζαχαροπλαστείο προσφέρει παγωτό σε τρεις γεύσεις (σοκολάτα, βανίλια, φράουλα) και δύο είδη σιροπιού (κεράσι ή βύσσινο). Η Χαρά τρώει κάθε μέρα ένα διαφορετικό παγωτό επιλέγοντας δύο διαφορετικές γεύσεις και ένα είδος σιροπιού. Σε πόσες μέρες θα έχει δοκιμάσει όλους τους συνδυασμούς;',
    options: [
      { key: 'A', label: '6', raw: '6' },
      { key: 'B', label: '4', raw: '4' },
      { key: 'Γ', label: '3', raw: '3' },
      { key: 'Δ', label: '5', raw: '5' }
    ],
    correctRaw: '6',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Για να βρούμε σε πόσες ημέρες θα δοκιμάσει όλους τους δυνατούς συνδυασμούς, υπολογίζουμε αρχικά τους συνδυασμούς των γεύσεων και στη συνέχεια των σιροπιών.
        </p>

        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div>• <strong>3 επιλογές γεύσεων:</strong> Σοκολάτα (Σ), Βανίλια (Β), Φράουλα (Φ)</div>
          <div>• <strong>2 επιλογές σιροπιού:</strong> Κεράσι, Βύσσινο</div>
        </div>

        <p>
          Επιλέγοντας <strong>2 διαφορετικές γεύσεις</strong> από τις 3 διαθέσιμες, έχουμε <strong>3 δυνατά ζευγάρια</strong>:
        </p>

        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-800 text-center font-bold">
          1. (Σοκολάτα － Βανίλια) &nbsp;|&nbsp; 2. (Σοκολάτα － Φράουλα) &nbsp;|&nbsp; 3. (Βανίλια － Φράουλα)
        </div>

        {/* ΠΙΝΑΚΑΣ ΟΛΩΝ ΤΩΝ ΣΥΝΔΥΑΣΜΩΝ */}
        <div className="overflow-x-auto my-2">
          <table className="w-full text-xs sm:text-sm border-collapse bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm text-center">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                <th className="p-2.5">Ημέρα</th>
                <th className="p-2.5">1η Γεύση</th>
                <th className="p-2.5">2η Γεύση</th>
                <th className="p-2.5">Σιρόπι</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              <tr className="hover:bg-slate-50/80">
                <td className="p-2 font-mono font-bold text-slate-900">1η</td>
                <td className="p-2">Σοκολάτα</td>
                <td className="p-2">Βανίλια</td>
                <td className="p-2 font-bold text-rose-600">Κεράσι</td>
              </tr>
              <tr className="hover:bg-slate-50/80">
                <td className="p-2 font-mono font-bold text-slate-900">2η</td>
                <td className="p-2">Σοκολάτα</td>
                <td className="p-2">Βανίλια</td>
                <td className="p-2 font-bold text-purple-700">Βύσσινο</td>
              </tr>
              <tr className="hover:bg-slate-50/80 bg-slate-50/40">
                <td className="p-2 font-mono font-bold text-slate-900">3η</td>
                <td className="p-2">Σοκολάτα</td>
                <td className="p-2">Φράουλα</td>
                <td className="p-2 font-bold text-rose-600">Κεράσι</td>
              </tr>
              <tr className="hover:bg-slate-50/80 bg-slate-50/40">
                <td className="p-2 font-mono font-bold text-slate-900">4η</td>
                <td className="p-2">Σοκολάτα</td>
                <td className="p-2">Φράουλα</td>
                <td className="p-2 font-bold text-purple-700">Βύσσινο</td>
              </tr>
              <tr className="hover:bg-slate-50/80">
                <td className="p-2 font-mono font-bold text-slate-900">5η</td>
                <td className="p-2">Βανίλια</td>
                <td className="p-2">Φράουλα</td>
                <td className="p-2 font-bold text-rose-600">Κεράσι</td>
              </tr>
              <tr className="hover:bg-slate-50/80">
                <td className="p-2 font-mono font-bold text-slate-900">6η</td>
                <td className="p-2">Βανίλια</td>
                <td className="p-2">Φράουλα</td>
                <td className="p-2 font-bold text-purple-700">Βύσσινο</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ΜΑΘΗΜΑΤΙΚΟΣ ΥΠΟΛΟΓΙΣΜΟΣ */}
        <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
          <div>Συνολικοί συνδυασμοί ＝ (Συνδυασμοί Γεύσεων) · (Επιλογές Σιροπιού)</div>
          <div>Συνολικοί συνδυασμοί ＝ 3 · 2 ＝ <strong className="text-emerald-700 text-base">6 διαφορετικές ημέρες</strong></div>
        </div>

        <p className="pt-1">
          Επομένως, θα χρειαστεί <strong>6 ημέρες</strong> για να δοκιμάσει όλους τους συνδυασμούς (Επιλογή <strong>A</strong>).
        </p>
      </div>
    )
  },
  {
    id: 3,
    officialNumber: 23,
    group: 'ΟΜΑΔΑ Α (4 Επιλογες)',
    promptText: 'Πόσες διαφορετικές διαδρομές υπάρχουν για να φτάσει κάποιος από την κάτω αριστερή γωνία (Κ) του σχήματος μέχρι την πάνω δεξιά γωνία (Λ) κινούμενος επάνω στις γραμμές του πλέγματος, μόνο προς τα δεξιά ή προς τα πάνω;',
    hasSvg: 'grid23',
    options: [
      { key: 'A', label: '5', raw: '5' },
      { key: 'B', label: '6', raw: '6' },
      { key: 'Γ', label: '8', raw: '8' },
      { key: 'Δ', label: '3', raw: '3' }
    ],
    correctRaw: '6',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Σε ένα πλέγμα <strong>2×2</strong>, για να μετακινηθούμε από το σημείο <strong>Κ</strong> (κάτω αριστερά) στο σημείο <strong>Λ</strong> (πάνω δεξιά), πρέπει υποχρεωτικά να κάνουμε συνολικά <strong>4 βήματα</strong>: ακριβώς <strong>2 προς τα δεξιά (Δ)</strong> και <strong>2 προς τα πάνω (Π)</strong>.
        </p>

        {/* ΠΛΕΓΜΑ ΜΕ ΤΑ 6 ΣΧΗΜΑΤΑ ΔΙΑΔΡΟΜΩΝ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-white/90 rounded-2xl border border-slate-200/90 my-2">
          {[
            { num: 1, text: 'Δ ➔ Δ ➔ Π ➔ Π', path: 'M 20 80 L 80 80 L 80 20' },
            { num: 2, text: 'Δ ➔ Π ➔ Δ ➔ Π', path: 'M 20 80 L 50 80 L 50 50 L 80 50 L 80 20' },
            { num: 3, text: 'Δ ➔ Π ➔ Π ➔ Δ', path: 'M 20 80 L 50 80 L 50 20 L 80 20' },
            { num: 4, text: 'Π ➔ Δ ➔ Δ ➔ Π', path: 'M 20 80 L 20 50 L 80 50 L 80 20' },
            { num: 5, text: 'Π ➔ Δ ➔ Π ➔ Δ', path: 'M 20 80 L 20 50 L 50 50 L 50 20 L 80 20' },
            { num: 6, text: 'Π ➔ Π ➔ Δ ➔ Δ', path: 'M 20 80 L 20 20 L 80 20' }
          ].map((item) => (
            <div key={item.num} className="flex flex-col items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800 text-[11px] mb-1">
                {item.num}η Διαδρομή
              </span>

              <svg width="100" height="100" viewBox="0 0 100 100" className="select-none">
                {/* Βασικό πλέγμα 2x2 (γκρι γραμμές) */}
                <rect x="20" y="20" width="60" height="60" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.8" />
                <line x1="50" y1="20" x2="50" y2="80" stroke="#cbd5e1" strokeWidth="1.8" />
                <line x1="20" y1="50" x2="80" y2="50" stroke="#cbd5e1" strokeWidth="1.8" />

                {/* Ενεργή κόκκινη διαδρομή */}
                <path
                  d={item.path}
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Σημεία Κ και Λ */}
                <circle cx="20" cy="80" r="3.5" fill="#0f172a" />
                <text x="11" y="87" fontSize="10" fontWeight="bold" fill="#0f172a">Κ</text>

                <circle cx="80" cy="20" r="3.5" fill="#0f172a" />
                <text x="84" y="18" fontSize="10" fontWeight="bold" fill="#0f172a">Λ</text>
              </svg>

              <span className="text-[10px] font-mono font-bold text-slate-600 mt-1 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                {item.text}
              </span>
            </div>
          ))}
        </div>

        {/* ΜΑΘΗΜΑΤΙΚΟΣ ΥΠΟΛΟΓΙΣΜΟΣ */}
        <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
          <div className="text-slate-700 font-sans font-medium">
            Ο αριθμός των διαφορετικών διαδρομών ισούται με τους αναγραμματισμούς της λέξης <strong>ΔΔΠΠ</strong>:
          </div>

          <div className="pt-1 flex items-center gap-1.5 flex-wrap">
            <span>Πλήθος Διαδρομών ＝</span>
            <Fraction num="4!" den="2! · 2!" />
            <span>＝</span>
            <Fraction num="24" den="2 · 2" />
            <span>＝</span>
            <Fraction num="24" den="4" />
            <span>＝ <strong className="text-emerald-700 text-base">6 διαδρομές</strong></span>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, υπάρχουν συνολικά <strong>6 διαφορετικές διαδρομές</strong> (Επιλογή <strong>B</strong>).
        </p>
      </div>
    )
  },
  {
    id: 4,
    officialNumber: 24,
    group: 'ΟΜΑΔΑ Α (4 Επιλογες)',
    promptText: 'Το ΑΒΓΔ είναι ορθογώνιο παραλληλόγραμμο. Στην πλευρά ΑΒ πήραμε σημείο Ε τέτοιο ώστε η γωνία ΑΕΓ να είναι 137°. Πόσες μοίρες είναι η γωνία ΒΓΕ;',
    hasSvg: 'rect24',
    options: [
      { key: 'A', label: '43°', raw: '43' },
      { key: 'B', label: '53°', raw: '53' },
      { key: 'Γ', label: '47°', raw: '47' },
      { key: 'Δ', label: '37°', raw: '37' }
    ],
    correctRaw: '47',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Ακολουθούμε δύο διαδοχικά βήματα υπολογισμού γωνιών:
        </p>

        {/* ΔΙΠΛΟ SVG ΣΧΗΜΑ: 1. ΠΑΡΑΠΛΗΡΩΜΑΤΙΚΗ ΓΩΝΙΑ | 2. ΣΥΜΠΛΗΡΩΜΑΤΙΚΗ ΓΩΝΙΑ */}
        <div className="flex justify-center p-3 bg-white/90 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="450" height="155" viewBox="0 0 450 155" className="select-none font-sans mx-auto block">
            {/* 1ο ΣΧΗΜΑ: ΕΥΡΕΣΗ ΠΑΡΑΠΛΗΡΩΜΑΤΙΚΗΣ ΓΩΝΙΑΣ ΒΕΓ = 43° */}
            <g transform="translate(10, 10)">
              <text x="100" y="0" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0f172a">
                1. Παραπληρωματική: ΒΕΓ ＝ 43°
              </text>
              <g transform="translate(0, 12)">
                {/* Ορθογώνιο ΑΒΓΔ */}
                <rect x="15" y="15" width="170" height="70" fill="#f8fafc" stroke="#334155" strokeWidth="1.8" />

                {/* 
                  Σημείο E = (90, 85), Γ = (185, 15).
                  Για ακτίνα R = 42:
                  dx = 42 * (95 / 118.0) ≈ 33.8
                  dy = -42 * (70 / 118.0) ≈ -24.9
                  Άρα το σημείο τομής του τόξου με την ευθεία ΕΓ είναι ακριβώς:
                  (90 + 33.8, 85 - 24.9) = (123.8, 60.1)
                */}

                {/* Γκρι τομέας 137°: ξεκινά από (48, 85) και καταλήγει ακριβώς στο σημείο (123.8, 60.1) πάνω στην ΕΓ */}
                <path
                  d="M 90 85 L 48 85 A 42 42 0 0 1 123.8 60.1 Z"
                  fill="#cbd5e1"
                  stroke="#475569"
                  strokeWidth="1"
                />
                <text x="56" y="70" fontSize="10.5" fontWeight="bold" fill="#0f172a">137°</text>

                {/* Πορτοκαλί τομέας 43°: ξεκινά από (132, 85) και καταλήγει ακριβώς στο ίδιο σημείο (123.8, 60.1) πάνω στην ΕΓ */}
                <path
                  d="M 90 85 L 132 85 A 42 42 0 0 0 123.8 60.1 Z"
                  fill="#fdba74"
                  stroke="#ea580c"
                  strokeWidth="1"
                />
                <text x="122" y="77" fontSize="10" fontWeight="bold" fill="#c2410c">43°</text>

                {/* Η μαύρη διαχωριστική ευθεία Ε-Γ σχεδιάζεται από πάνω ώστε να είναι απόλυτα καθαρή */}
                <line x1="90" y1="85" x2="185" y2="15" stroke="#1e293b" strokeWidth="2.2" strokeLinecap="round" />

                {/* Κορυφές */}
                <circle cx="15" cy="85" r="3.5" fill="#0f172a" /><text x="6" y="99" fontSize="10.5" fontWeight="bold">Α</text>
                <circle cx="90" cy="85" r="3.5" fill="#0f172a" /><text x="88" y="99" fontSize="10.5" fontWeight="bold">Ε</text>
                <circle cx="185" cy="85" r="3.5" fill="#0f172a" /><text x="189" y="99" fontSize="10.5" fontWeight="bold">Β</text>
                <circle cx="185" cy="15" r="3.5" fill="#0f172a" /><text x="189" y="12" fontSize="10.5" fontWeight="bold">Γ</text>
                <circle cx="15" cy="15" r="3.5" fill="#0f172a" /><text x="6" y="12" fontSize="10.5" fontWeight="bold">Δ</text>
              </g>
            </g>

            {/* ΒΕΛΟΣ ΜΕΤΑΒΑΣΗΣ */}
            <g transform="translate(210, 68)">
              <line x1="0" y1="0" x2="16" y2="0" stroke="#0f172a" strokeWidth="2" />
              <polygon points="16,-3.5 22,0 16,3.5" fill="#0f172a" />
            </g>

            {/* 2ο ΣΧΗΜΑ: ΕΥΡΕΣΗ ΣΥΜΠΛΗΡΩΜΑΤΙΚΗΣ ΓΩΝΙΑΣ ΒΓΕ = 47° */}
            <g transform="translate(240, 10)">
              <text x="100" y="0" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0f172a">
                2. Συμπληρωματική: ΒΓΕ ＝ 47°
              </text>
              <g transform="translate(0, 12)">
                {/* Ορθογώνιο ΑΒΓΔ */}
                <rect x="15" y="15" width="170" height="70" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 2" />
                {/* Ορθογώνιο τρίγωνο ΕΒΓ */}
                <polygon points="90,85 185,85 185,15" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2" />

                {/* Ορθή γωνία στο Β */}
                <path d="M 173 85 L 173 73 L 185 73" fill="none" stroke="#16a34a" strokeWidth="1.2" />

                {/* Γωνία ΒΕΓ = 43° */}
                <text x="110" y="80" fontSize="10" fontWeight="bold" fill="#c2410c">43°</text>

                {/* Ζητούμενη γωνία ΒΓΕ = 47° (Πράσινο τόξο) */}
                <path d="M 185 15 L 185 45 A 30 30 0 0 1 165 31 Z" fill="#86efac" stroke="#16a34a" strokeWidth="1.2" />
                <text x="156" y="44" fontSize="10" fontWeight="900" fill="#15803d">47°</text>

                {/* Κορυφές */}
                <circle cx="90" cy="85" r="3.5" fill="#0f172a" /><text x="88" y="99" fontSize="10.5" fontWeight="bold">Ε</text>
                <circle cx="185" cy="85" r="3.5" fill="#0f172a" /><text x="189" y="99" fontSize="10.5" fontWeight="bold">Β</text>
                <circle cx="185" cy="15" r="3.5" fill="#0f172a" /><text x="189" y="12" fontSize="10.5" fontWeight="bold">Γ</text>
              </g>
            </g>
          </svg>
        </div>
        {/* ΑΝΑΛΥΤΙΚΑ ΒΗΜΑΤΑ ΕΠΙΛΥΣΗΣ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-3">
          {/* Βήμα 1 */}
          <div className="space-y-1">
            <div className="font-sans font-bold text-slate-900">
              1. Υπολογισμός της γωνίας ΒΕΓ (Παραπληρωματική γωνία):
            </div>
            <p className="text-slate-700">
              Τα σημεία Α, Ε, Β βρίσκονται πάνω στην ίδια ευθεία (πλευρά ΑΒ), επομένως η γωνία ΑΕΒ είναι <strong>ευθεία γωνία (180°)</strong>.
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
              <div>γωνία ΑΕΓ ＋ γωνία ΒΕΓ ＝ 180°</div>
              <div>γωνία ΒΕΓ ＝ 180° － 137° ➔ <strong className="text-orange-700">γωνία ΒΕΓ ＝ 43°</strong></div>
            </div>
          </div>

          {/* Βήμα 2 */}
          <div className="space-y-1 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-slate-900">
              2. Υπολογισμός της ζητούμενης γωνίας ΒΓΕ (Συμπληρωματική γωνία):
            </div>
            <p className="text-slate-700">
              Στο ορθογώνιο τρίγωνο ΕΒΓ, η γωνία Β είναι <strong>ορθή (90°)</strong>. Οι δύο οξείες γωνίες ενός ορθογωνίου τριγώνου έχουν άθροισμα 90° (είναι συμπληρωματικές):
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
              <div>γωνία ΒΓΕ ＋ γωνία ΒΕΓ ＝ 90°</div>
              <div>γωνία ΒΓΕ ＝ 90° － 43° ➔ <strong className="text-emerald-700 text-base">γωνία ΒΓΕ ＝ 47°</strong></div>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, η γωνία ΒΓΕ είναι <strong>47°</strong> (Επιλογή <strong>Γ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 5,
    officialNumber: 25,
    group: 'ΟΜΑΔΑ Α (4 Επιλογες)',
    promptText: 'Στο διπλανό κυκλικό διάγραμμα παριστάνονται οι προτιμήσεις των μαθητών ενός σχολείου για τρία αθλήματα Κ, Λ και Μ. Ποιο από τα ραβδογράμματα Α, Β, Γ και Δ παριστάνει σωστά τα δεδομένα του κυκλικού διαγράμματος;',
    hasSvg: 'pie25',
    options: [
      { key: 'A', label: 'Το ραβδόγραμμα Α', raw: 'A' },
      { key: 'B', label: 'Το ραβδόγραμμα Β', raw: 'B' },
      { key: 'Γ', label: 'Το ραβδόγραμμα Γ', raw: 'Γ' },
      { key: 'Δ', label: 'Το ραβδόγραμμα Δ', raw: 'Δ' }
    ],
    correctRaw: 'Γ',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Παρατηρούμε τη σχετική διάταξη των τριών τομέων στο κυκλικό διάγραμμα:
        </p>

        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
          <div>• Ο τομέας <strong>Κ</strong> είναι ο μικρότερος (προσεγγίζει το <Fraction num="1" den="4" /> του κύκλου, δηλ. περίπου 25%).</div>
          <div>• Ο τομέας <strong>Λ</strong> είναι εμφανώς μεγαλύτερος από τον Κ.</div>
          <div>• Ο τομέας <strong>Μ</strong> είναι ο μεγαλύτερος από όλους (καλύπτει σχεδόν το <Fraction num="1" den="2" /> του κύκλου).</div>
          <div className="pt-1 text-blue-700 font-bold">
            Συνεπώς ισχύει η διάταξη: <strong>Κ &lt; Λ &lt; Μ</strong>
          </div>
        </div>

        <p>
          Ελέγχουμε τα διαθέσιμα ραβδογράμματα:
        </p>

        <ul className="space-y-1.5 pl-4 sm:pl-5 text-slate-800 list-disc font-medium">
          <li>
            <strong>Στο Β:</strong> Οι ράβδοι Κ και Μ εμφανίζονται ίσες (<span className="font-mono">Κ ＝ Μ</span>), επομένως <strong>απορρίπτεται</strong>.
          </li>
          <li>
            <strong>Στο Δ:</strong> Η ράβδος Κ είναι ψηλότερη από τη Λ (<span className="font-mono">Κ &gt; Λ</span>), επομένως <strong>απορρίπτεται</strong>.
          </li>
          <li>
            <strong>Στα Α και Γ:</strong> Ικανοποιείται η συνθήκη <span className="font-mono">Κ &lt; Λ &lt; Μ</span>. Όμως:
            <ul className="pl-4 pt-1 space-y-1 list-circle text-slate-700">
              <li>
                Στο <strong>Α</strong>, οι ράβδοι Κ και Λ είναι υπερβολικά κοντές συγκριτικά με τη ράβδο Μ (δεν ανταποκρίνονται στις πραγματικές αναλογίες του κύκλου).
              </li>
              <li>
                Στο <strong>Γ</strong>, οι αναλογίες των υψών αποδίδουν πιστά τα μεγέθη των τομέων, όπου το Μ είναι το μεγαλύτερο, αλλά τα Κ και Λ έχουν ρεαλιστικό ύψος.
              </li>
            </ul>
          </li>
        </ul>

        <p className="pt-1">
          Άρα, το σωστό ραβδόγραμμα είναι το <strong>Γ</strong> (Επιλογή <strong>Γ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 6,
    officialNumber: 26,
    group: 'ΟΜΑΔΑ Α (4 Επιλογες)',
    promptText: 'Ο Παναγιώτης είναι 7 χρόνια μεγαλύτερος από την Αφροδίτη. Η Αφροδίτη είναι 7 χρόνια μικρότερη από την Ευαγγελία. Αν ο Παναγιώτης είναι 33 ετών, πόσων ετών είναι η Ευαγγελία;',
    options: [
      { key: 'A', label: '26', raw: '26' },
      { key: 'B', label: '33', raw: '33' },
      { key: 'Γ', label: '40', raw: '40' },
      { key: 'Δ', label: '47', raw: '47' }
    ],
    correctRaw: '33',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Αναλύουμε τις σχέσεις των ηλικιών με βάση τα δεδομένα:
        </p>

        {/* 1ος ΤΡΟΠΟΣ: ΑΝΑΛΥΤΙΚΑ ΒΗΜΑΤΑ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-2.5">
          <div className="font-sans font-bold text-blue-900 text-sm border-b border-slate-200 pb-1">
            🔷 1ος Τρόπος (Βήμα προς βήμα υπολογισμός)
          </div>

          <div className="space-y-2 font-mono text-slate-900">
            <div>
              • Ηλικία Παναγιώτη: <strong>33 έτη</strong>
            </div>

            <div className="pl-2">
              <div className="text-slate-700 font-sans text-xs">
                Ο Παναγιώτης είναι 7 χρόνια μεγαλύτερος από την Αφροδίτη:
              </div>
              <div>Ηλικία Αφροδίτης ＝ 33 － 7 ＝ <strong>26 έτη</strong></div>
            </div>

            <div className="pl-2">
              <div className="text-slate-700 font-sans text-xs">
                Η Αφροδίτη είναι 7 χρόνια μικρότερη από την Ευαγγελία (άρα η Ευαγγελία είναι 7 χρόνια μεγαλύτερη):
              </div>
              <div>Ηλικία Ευαγγελίας ＝ 26 ＋ 7 ＝ <strong className="text-emerald-700 text-base">33 έτη</strong></div>
            </div>
          </div>
        </div>

        {/* 2ος ΤΡΟΠΟΣ: ΑΜΕΣΗ ΛΟΓΙΚΗ ΣΥΓΚΡΙΣΗ */}
        <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200/80 space-y-1.5">
          <div className="font-sans font-bold text-emerald-950 text-sm border-b border-emerald-200 pb-1">
            💡 2ος Τρόπος (Άμεση λογική παρατήρηση)
          </div>
          <p className="text-slate-800">
            Αφού ο Παναγιώτης είναι κατά <strong>7 χρόνια μεγαλύτερος</strong> από την Αφροδίτη και η Ευαγγελία είναι επίσης κατά <strong>7 χρόνια μεγαλύτερη</strong> από την Αφροδίτη, προκύπτει άμεσα ότι ο Παναγιώτης και η Ευαγγελία έχουν <strong>ακριβώς την ίδια ηλικία</strong>:
          </p>
          <div className="font-mono font-bold text-emerald-800 pt-1">
            Ηλικία Ευαγγελίας ＝ Ηλικία Παναγιώτη ＝ 33 έτη
          </div>
        </div>

        <p className="pt-1">
          Επομένως, η Ευαγγελία είναι <strong>33 ετών</strong> (Επιλογή <strong>B</strong>).
        </p>
      </div>
    )
  },
  {
    id: 7,
    officialNumber: 27,
    group: 'ΟΜΑΔΑ Α (4 Επιλογες)',
    promptText: 'Τετράγωνο οικόπεδο έχει επιφάνεια 400 τετραγωνικά μέτρα. Για να το περιφράξουμε με συρματόπλεγμα πρέπει να πληρώσουμε 15 ευρώ ανά μέτρο. Ποιο είναι το κόστος της περίφραξης;',
    options: [
      { key: 'A', label: '60.000 ευρώ', raw: '60000' },
      { key: 'B', label: '6.000 ευρώ', raw: '6000' },
      { key: 'Γ', label: '1.200 ευρώ', raw: '1200' },
      { key: 'Δ', label: '300 ευρώ', raw: '300' }
    ],
    correctRaw: '1200',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Αναλύουμε τα γεωμετρικά στοιχεία του τετραγώνου οικοπέδου:
        </p>

        {/* SVG ΣΧΗΜΑ ΤΕΤΡΑΓΩΝΟΥ ΜΕ ΕΜΒΑΔΟΝ ΚΑΙ ΠΕΡΙΜΕΤΡΟ */}
        <div className="flex justify-center p-3 bg-white/90 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="260" height="230" viewBox="0 0 260 230" className="select-none font-sans mx-auto block">
            {/* Τετράγωνο οικόπεδο (x: 50 έως 210, y: 35 έως 195 -> πλευρά 160px) */}
            <rect
              x="50"
              y="35"
              width="160"
              height="160"
              fill="#f0fdf4"
              stroke="#16a34a"
              strokeWidth="3"
              rx="4"
            />

            {/* Εσωτερικό: Εμβαδόν */}
            <text x="130" y="110" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#15803d">
              Επιφάνεια (Εμβαδόν)
            </text>
            <text x="130" y="132" fontSize="16" fontWeight="900" textAnchor="middle" fill="#166534" fontFamily="monospace">
              Ε ＝ 400 τ.μ.
            </text>

            {/* Πάνω πλευρά: a = 20 μ. */}
            <text x="130" y="24" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#0284c7" fontFamily="monospace">
              a ＝ 20 μ.
            </text>

            {/* Κάτω πλευρά: a = 20 μ. */}
            <text x="130" y="215" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#0284c7" fontFamily="monospace">
              a ＝ 20 μ.
            </text>

            {/* Αριστερή πλευρά: a = 20 μ. */}
            <text x="36" y="118" fontSize="12" fontWeight="bold" textAnchor="end" fill="#0284c7" fontFamily="monospace">
              20 μ.
            </text>

            {/* Δεξιά πλευρά: a = 20 μ. */}
            <text x="224" y="118" fontSize="12" fontWeight="bold" textAnchor="start" fill="#0284c7" fontFamily="monospace">
              20 μ.
            </text>

            {/* Ένδειξη Περιμέτρου (εξωτερικό περίγραμμα) */}
            <text x="130" y="152" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#64748b">
              Περίμετρος (Περίφραξη): 4 · 20 μ. ＝ 80 μ.
            </text>
          </svg>
        </div>

        {/* ΑΝΑΛΥΤΙΚΑ ΒΗΜΑΤΑ ΕΠΙΛΥΣΗΣ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-3">
          {/* Βήμα 1: Εύρεση πλευράς */}
          <div className="space-y-1">
            <div className="font-sans font-bold text-slate-900">
              1. Εύρεση πλευράς του οικοπέδου:
            </div>
            <p className="text-slate-700">
              Το εμβαδόν του τετραγώνου δίνεται από τον τύπο <span className="font-mono font-bold">Ε ＝ a · a</span>. Αναζητούμε τον αριθμό που όταν πολλαπλασιαστεί με τον εαυτό του δίνει 400:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 font-bold">
              20 · 20 ＝ 400 ➔ Πλευρά (a) ＝ 20 μέτρα
            </div>
          </div>

          {/* Βήμα 2: Εύρεση περιμέτρου */}
          <div className="space-y-1 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-slate-900">
              2. Εύρεση μήκους περίφραξης (Περίμετρος):
            </div>
            <p className="text-slate-700">
              Η περίφραξη τοποθετείται γύρω-γύρω στις 4 ίσες πλευρές του τετραγώνου:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 font-bold">
              Περίμετρος ＝ 4 · 20 ＝ 80 μέτρα
            </div>
          </div>

          {/* Βήμα 3: Υπολογισμός κόστους */}
          <div className="space-y-1 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-slate-900">
              3. Συνολικό κόστος περίφραξης:
            </div>
            <p className="text-slate-700">
              Πολλαπλασιάζουμε τα συνολικά μέτρα της περιμέτρου με την τιμή ανά μέτρο (15 €/μ.):
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
              Κόστος ＝ 80 · 15 ＝ <strong className="text-emerald-700 text-base">1.200 ευρώ</strong>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, το κόστος της περίφραξης είναι <strong>1.200 ευρώ</strong> (Επιλογή <strong>Γ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 8,
    officialNumber: 28,
    group: 'ΟΜΑΔΑ Α (4 Επιλογες)',
    promptText: 'Με 4 ίδια ποτήρια νερό γεμίζουν τα 3/5 μιας κανάτας. Με πόσα ποτήρια γεμίζει η μισή κανάτα;',
    options: [
      { key: 'A', label: <span className="inline-flex items-center">2 <Fraction num="2" den="5" /> ποτήρια</span>, raw: '2 2/5' },
      { key: 'B', label: '3 ποτήρια', raw: '3' },
      { key: 'Γ', label: <span className="inline-flex items-center">3 <Fraction num="1" den="3" /> ποτήρια</span>, raw: '3 1/3' },
      { key: 'Δ', label: <span className="inline-flex items-center">3 <Fraction num="2" den="5" /> ποτήρια</span>, raw: '3 2/5' }
    ],
    correctRaw: '3 1/3',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Αναλύουμε τη χωρητικότητα της κανάτας σε <strong>5 ίσα μέρη</strong> (πέμπτα) και παρατηρούμε πόσα ποτήρια αντιστοιχούν σε κάθε στάδιο:
        </p>

        {/* SVG ΣΧΗΜΑ 3 ΣΤΑΔΙΩΝ: 3/5, 1/5 ΚΑΙ 1/2 (2,5/5) ΜΕ ΤΑ ΑΝΤΙΣΤΟΙΧΑ ΠΟΤΗΡΙΑ */}
        <div className="flex justify-center p-3 bg-white/90 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="430" height="230" viewBox="0 0 430 230" className="select-none font-sans mx-auto block">
            {/* 1ο ΣΤΑΔΙΟ: 3/5 ΚΑΝΑΤΑΣ ＝ 4 ΠΟΤΗΡΙΑ */}
            <g transform="translate(15, 10)">
              <text x="50" y="12" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0f172a">
                1. Τα 3/5 (4 ποτήρια)
              </text>
              {/* Κανάτα */}
              <g transform="translate(20, 25)">
                <rect x="10" y="15" width="40" height="90" rx="4" fill="#f8fafc" stroke="#334155" strokeWidth="1.8" />
                {/* Χερούλι & Στόμιο */}
                <path d="M 10 30 Q -6 55 10 80" fill="none" stroke="#334155" strokeWidth="2" />
                <polygon points="50,15 58,10 50,22" fill="#334155" />
                {/* 5 ίσα τμήματα (ύψος 18px το καθένα) */}
                <line x1="10" y1="87" x2="50" y2="87" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="10" y1="69" x2="50" y2="69" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="10" y1="51" x2="50" y2="51" stroke="#0284c7" strokeWidth="1.5" />
                <line x1="10" y1="33" x2="50" y2="33" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" />
                {/* Νερό στα 3/5 (3 κάτω τμήματα = 54px) */}
                <rect x="11" y="51" width="38" height="53" rx="2" fill="#38bdf8" fillOpacity="0.7" />
                <text x="30" y="80" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#0369a1" fontFamily="monospace">3/5</text>
              </g>
              {/* 4 ποτήρια */}
              <g transform="translate(10, 135)">
                {[0, 20, 40, 60].map((gx, idx) => (
                  <g key={idx} transform={`translate(${gx}, 0)`}>
                    <polygon points="2,0 16,0 14,24 4,24" fill="#38bdf8" fillOpacity="0.75" stroke="#0284c7" strokeWidth="1.2" />
                  </g>
                ))}
                <text x="38" y="38" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#0f172a">
                  4 ποτήρια
                </text>
              </g>
            </g>

            {/* 2ο ΣΤΑΔΙΟ: 1/5 ΚΑΝΑΤΑΣ ＝ 4/3 ΠΟΤΗΡΙΑ */}
            <g transform="translate(160, 10)">
              <text x="50" y="12" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0f172a">
                2. Το 1/5 (4/3 ποτήρια)
              </text>
              {/* Κανάτα */}
              <g transform="translate(20, 25)">
                <rect x="10" y="15" width="40" height="90" rx="4" fill="#f8fafc" stroke="#334155" strokeWidth="1.8" />
                <path d="M 10 30 Q -6 55 10 80" fill="none" stroke="#334155" strokeWidth="2" />
                <polygon points="50,15 58,10 50,22" fill="#334155" />
                {/* Τμήματα */}
                <line x1="10" y1="87" x2="50" y2="87" stroke="#0284c7" strokeWidth="1.5" />
                <line x1="10" y1="69" x2="50" y2="69" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="10" y1="51" x2="50" y2="51" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="10" y1="33" x2="50" y2="33" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" />
                {/* Νερό στο 1/5 (1 κάτω τμήμα = 18px) */}
                <rect x="11" y="87" width="38" height="17" rx="2" fill="#38bdf8" fillOpacity="0.7" />
                <text x="30" y="99" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#0369a1" fontFamily="monospace">1/5</text>
              </g>
              {/* 1 γεμάτο ποτήρι + 1/3 ποτηριού */}
              <g transform="translate(22, 135)">
                {/* 1 ολόκληρο ποτήρι */}
                <polygon points="2,0 16,0 14,24 4,24" fill="#38bdf8" fillOpacity="0.75" stroke="#0284c7" strokeWidth="1.2" />
                {/* 1/3 ποτηριού */}
                <g transform="translate(24, 0)">
                  <polygon points="2,0 16,0 14,24 4,24" fill="none" stroke="#94a3b8" strokeWidth="1.2" />
                  <polygon points="4.7,16 13.3,16 14,24 4,24" fill="#38bdf8" fillOpacity="0.75" stroke="#0284c7" strokeWidth="1.2" />
                </g>
                <text x="21" y="38" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#0f172a">
                  4/3 ποτήρια (1 1/3)
                </text>
              </g>
            </g>

            {/* 3ο ΣΤΑΔΙΟ: ΜΙΣΗ ΚΑΝΑΤΑ (1/2 = 2,5/5) ＝ 10/3 ΠΟΤΗΡΙΑ */}
            <g transform="translate(305, 10)">
              <text x="50" y="12" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0f172a">
                3. Η Μισή Κανάτα (1/2)
              </text>
              {/* Κανάτα */}
              <g transform="translate(20, 25)">
                <rect x="10" y="15" width="40" height="90" rx="4" fill="#f8fafc" stroke="#334155" strokeWidth="1.8" />
                <path d="M 10 30 Q -6 55 10 80" fill="none" stroke="#334155" strokeWidth="2" />
                <polygon points="50,15 58,10 50,22" fill="#334155" />
                {/* Γραμμή μέσης στα 45px από κάτω (y = 60) */}
                <line x1="10" y1="60" x2="50" y2="60" stroke="#dc2626" strokeWidth="1.8" strokeDasharray="3 2" />
                {/* Νερό στη μέση (ύψος 45px) */}
                <rect x="11" y="60" width="38" height="44" rx="2" fill="#38bdf8" fillOpacity="0.7" />
                <text x="30" y="86" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#0369a1" fontFamily="monospace">1/2</text>
              </g>
              {/* 3 ποτήρια + 1/3 ποτηριού */}
              <g transform="translate(5, 135)">
                {[0, 20, 40].map((gx, idx) => (
                  <g key={idx} transform={`translate(${gx}, 0)`}>
                    <polygon points="2,0 16,0 14,24 4,24" fill="#38bdf8" fillOpacity="0.75" stroke="#0284c7" strokeWidth="1.2" />
                  </g>
                ))}
                {/* 1/3 ποτηριού */}
                <g transform="translate(60, 0)">
                  <polygon points="2,0 16,0 14,24 4,24" fill="none" stroke="#94a3b8" strokeWidth="1.2" />
                  <polygon points="4.7,16 13.3,16 14,24 4,24" fill="#38bdf8" fillOpacity="0.75" stroke="#0284c7" strokeWidth="1.2" />
                </g>
                <text x="39" y="38" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#166534">
                  3 1/3 ποτήρια (10/3)
                </text>
              </g>
            </g>
          </svg>
        </div>

        {/* ΑΝΑΛΥΤΙΚΟΣ ΣΥΛΛΟΓΙΣΜΟΣ ΚΑΙ ΥΠΟΛΟΓΙΣΜΟΙ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-2.5">
          <p className="text-slate-800">
            Ακολουθούμε τη μέθοδο αναγωγής στη μονάδα (στο <Fraction num="1" den="5" /> της κανάτας):
          </p>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Τα</span>
              <Fraction num="3" den="5" />
              <span>της κανάτας γεμίζουν με <strong>4 ποτήρια</strong>.</span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap pl-2 pt-1 border-t border-slate-200">
              <span>• Το</span>
              <Fraction num="1" den="5" />
              <span>της κανάτας γεμίζει με 4 : 3 ＝</span>
              <strong className="text-blue-700"><Fraction num="4" den="3" /></strong>
              <span>ποτήρια.</span>
            </div>

            <div className="pl-2 pt-1 border-t border-slate-200 space-y-1.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>• Η μισή κανάτα αντιστοιχεί στα</span>
                <Fraction num="2,5" den="5" />
                <span>＝</span>
                <Fraction num="1" den="2" />
                <span>της κανάτας.</span>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                <span>Συνεπώς, η μισή κανάτα χρειάζεται:</span>
                <span className="font-bold">2,5 ·</span>
                <Fraction num="4" den="3" />
                <span>＝</span>
                <Fraction num="5" den="2" />
                <span>·</span>
                <Fraction num="4" den="3" />
                <span>＝</span>
                <Fraction num="20" den="6" />
                <span>＝</span>
                <Fraction num="10" den="3" />
                <span>ποτήρια.</span>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span>Μετατροπή του καταχρηστικού κλάσματος σε μεικτό αριθμό:</span>
                <Fraction num="10" den="3" />
                <span>＝</span>
                <strong className="text-emerald-700 text-base flex items-center gap-1">
                  3 <Fraction num="1" den="3" /> ποτήρια
                </strong>
              </div>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, η μισή κανάτα γεμίζει με <strong>3 <Fraction num="1" den="3" /> ποτήρια</strong> (Επιλογή <strong>Γ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 9,
    officialNumber: 29,
    group: 'ΟΜΑΔΑ Α (4 Επιλογες)',
    promptText: 'Ποιος από τους παρακάτω αριθμούς είναι πιο κοντά στο 1;',
    options: [
      { key: 'A', label: <Fraction num="11" den="12" />, raw: '11/12' },
      { key: 'B', label: <Fraction num="12" den="11" />, raw: '12/11' },
      { key: 'Γ', label: '0,9', raw: '0.9' },
      { key: 'Δ', label: '1,101', raw: '1.101' }
    ],
    correctRaw: '11/12',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Για να βρούμε ποιος αριθμός είναι πιο κοντά στο <strong>1</strong>, υπολογίζουμε την <strong>απόσταση</strong> (τη θετική διαφορά) καθενός από το 1 και τις συγκρίνουμε:
        </p>

        {/* ΥΠΟΛΟΓΙΣΜΟΣ ΑΠΟΣΤΑΣΕΩΝ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 font-mono text-slate-900 space-y-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-sans font-bold text-slate-950 w-6">Α:</span>
            <span>Απόσταση ＝ 1 －</span>
            <Fraction num="11" den="12" />
            <span>＝</span>
            <Fraction num="12" den="12" />
            <span>－</span>
            <Fraction num="11" den="12" />
            <span>＝</span>
            <strong className="text-emerald-700 font-bold"><Fraction num="1" den="12" /></strong>
            <span className="text-slate-500 font-sans text-xs">(≈ 0,0833)</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-100">
            <span className="font-sans font-bold text-slate-950 w-6">Β:</span>
            <span>Απόσταση ＝</span>
            <Fraction num="12" den="11" />
            <span>－ 1 ＝</span>
            <Fraction num="12" den="11" />
            <span>－</span>
            <Fraction num="11" den="11" />
            <span>＝</span>
            <strong className="text-blue-700 font-bold"><Fraction num="1" den="11" /></strong>
            <span className="text-slate-500 font-sans text-xs">(≈ 0,0909)</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-100">
            <span className="font-sans font-bold text-slate-950 w-6">Γ:</span>
            <span>Απόσταση ＝ 1 － 0,9 ＝ <strong>0,1</strong> ＝</span>
            <Fraction num="1" den="10" />
            <span className="text-slate-500 font-sans text-xs">(＝ 0,1000)</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-100">
            <span className="font-sans font-bold text-slate-950 w-6">Δ:</span>
            <span>Απόσταση ＝ 1,101 － 1 ＝ <strong className="text-rose-700">0,101</strong></span>
            <span className="text-slate-500 font-sans text-xs">(η μεγαλύτερη απόσταση)</span>
          </div>
        </div>

        {/* SVG ΑΡΙΘΜΟΓΡΑΜΜΗ ΜΕ ΕΣΤΙΑΣΗ ΓΥΡΩ ΑΠΟ ΤΟ 1 */}
        <div className="bg-white/90 p-3.5 rounded-2xl border border-slate-200/90 overflow-x-auto my-2">
          <div className="text-center mb-1">
            <span className="font-bold text-slate-800 text-xs block">
              Απεικόνιση στην Αριθμογραμμή (Περιοχή 0,88 έως 1,12)
            </span>
          </div>

          <svg width="460" height="130" viewBox="0 0 460 130" className="select-none font-sans mx-auto block">
            <defs>
              <marker id="axis-arrow-29" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 2 L 8 5 L 0 8 z" fill="#0f172a" />
              </marker>
            </defs>

            {/* Άξονας: εύρος [0.88, 1.12] */}
            <line x1="20" y1="62" x2="445" y2="62" stroke="#334155" strokeWidth="2" markerEnd="url(#axis-arrow-29)" />

            {/* Σημείο 0.9 -> x ≈ 63.3 */}
            <line x1="63.3" y1="54" x2="63.3" y2="70" stroke="#64748b" strokeWidth="1.5" />
            <circle cx="63.3" cy="62" r="4.5" fill="#64748b" />
            <text x="56" y="42" fontSize="11" fontWeight="bold" textAnchor="end" fill="#475569">0,9</text>
            <text x="56" y="82" fontSize="9" fontWeight="bold" textAnchor="end" fill="#64748b">Γ=0,100</text>

            {/* Σημείο 11/12 ≈ 0.9167 -> x ≈ 91.1 (μετατοπισμένο χαμηλότερα όπως το κόκκινο δεξιά) */}
            <line x1="91.1" y1="52" x2="91.1" y2="72" stroke="#059669" strokeWidth="2" />
            <circle cx="91.1" cy="62" r="5.5" fill="#10b981" stroke="#047857" strokeWidth="1.5" />
            <text x="96" y="32" fontSize="11.5" fontWeight="900" textAnchor="start" fill="#047857">11/12</text>
            <text x="96" y="98" fontSize="9.5" fontWeight="900" textAnchor="start" fill="#047857">Α=0,083</text>

            {/* Κεντρικό σημείο αναφοράς: 1 -> x = 230 */}
            <line x1="230" y1="46" x2="230" y2="78" stroke="#0f172a" strokeWidth="2.5" />
            <circle cx="230" cy="62" r="5" fill="#0f172a" />
            <text x="230" y="36" fontSize="14" fontWeight="black" textAnchor="middle" fill="#0f172a">1</text>
            <text x="230" y="96" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#0f172a">Σημείο Αναφοράς</text>

            {/* Σημείο 12/11 ≈ 1.0909 -> x ≈ 381.5 */}
            <line x1="381.5" y1="54" x2="381.5" y2="70" stroke="#0284c7" strokeWidth="1.5" />
            <circle cx="381.5" cy="62" r="4.5" fill="#0284c7" />
            <text x="375" y="42" fontSize="11" fontWeight="bold" textAnchor="end" fill="#0369a1">12/11</text>
            <text x="375" y="82" fontSize="9" fontWeight="bold" textAnchor="end" fill="#0284c7">Β=0,091</text>

            {/* Σημείο 1.101 -> x ≈ 398.3 */}
            <line x1="398.3" y1="54" x2="398.3" y2="70" stroke="#dc2626" strokeWidth="1.5" />
            <circle cx="398.3" cy="62" r="4" fill="#ef4444" />
            <text x="404" y="32" fontSize="10" fontWeight="bold" textAnchor="start" fill="#dc2626">1,101</text>
            <text x="404" y="98" fontSize="8.5" fontWeight="bold" textAnchor="start" fill="#dc2626">Δ=0,101</text>

            {/* Τόξο μικρότερης απόστασης (11/12 προς 1) */}
            <path d="M 91.1 50 Q 160.5 28 230 50" fill="none" stroke="#059669" strokeWidth="1.8" strokeDasharray="3 2" />
            <text x="160" y="24" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#047857">Ελάχιστη απόσταση (1/12)</text>
          </svg>
        </div>

        {/* ΣΥΓΚΡΙΣΗ ΚΛΑΣΜΑΤΩΝ */}
        <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200/80 space-y-1.5">
          <div className="font-sans font-bold text-emerald-950 text-sm border-b border-emerald-200 pb-1">
            💡 Σύγκριση των αποστάσεων
          </div>
          <p className="text-slate-800">
            Συγκρίνοντας τα κλάσματα των δύο πλησιέστερων υποψηφίων:
          </p>
          <div className="font-mono text-slate-900 flex items-center gap-2 flex-wrap pt-0.5">
            <span>Επειδή <strong>12 &gt; 11</strong>, ισχύει:</span>
            <Fraction num="1" den="12" />
            <span>&lt;</span>
            <Fraction num="1" den="11" />
            <span>&lt; 0,1 &lt; 0,101</span>
          </div>
          <p className="text-slate-700 pt-1">
            Η μικρότερη απόσταση από όλες είναι το <strong><Fraction num="1" den="12" /></strong>.
          </p>
        </div>

        <p className="pt-1">
          Επομένως, ο αριθμός που βρίσκεται πιο κοντά στο 1 είναι το <strong><Fraction num="11" den="12" /></strong> (Επιλογή <strong>A</strong>).
        </p>
      </div>
    )
  },
  {
    id: 10,
    officialNumber: 30,
    group: 'ΟΜΑΔΑ Α (4 Επιλογες)',
    promptText: 'Σε ένα κουτί υπάρχουν 52 άσπρες και 48 μαύρες σφαίρες. Αν βγάλουμε 40 άσπρες και 40 μαύρες σφαίρες από το κουτί, ποιο από τα παρακάτω είναι σωστό;',
    options: [
      { key: 'A', label: 'Δεν αλλάζει το ποσοστό των άσπρων σφαιρών ούτε το ποσοστό των μαύρων σφαιρών στο κουτί.', raw: 'A' },
      { key: 'B', label: 'Αυξάνεται το ποσοστό των άσπρων σφαιρών και αυξάνεται το ποσοστό των μαύρων σφαιρών στο κουτί.', raw: 'B' },
      { key: 'Γ', label: 'Μειώνεται το ποσοστό των άσπρων σφαιρών και αυξάνεται το ποσοστό των μαύρων σφαιρών στο κουτί.', raw: 'Γ' },
      { key: 'Δ', label: 'Αυξάνεται το ποσοστό των άσπρων σφαιρών και μειώνεται το ποσοστό των μαύρων σφαιρών στο κουτί.', raw: 'Δ' }
    ],
    correctRaw: 'Δ',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Συγκρίνουμε τα <strong>ποσοστά</strong> των σφαιρών στο κουτί πριν και μετά την αφαίρεση:
        </p>

        {/* SVG ΣΧΗΜΑ: ΑΡΧΙΚΟ ΚΟΥΤΙ (100 ΣΦΑΙΡΕΣ) VS ΤΕΛΙΚΟ ΚΟΥΤΙ (20 ΣΦΑΙΡΕΣ) */}
        <div className="flex justify-center p-3 bg-white/90 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="460" height="235" viewBox="0 0 460 235" className="select-none font-sans mx-auto block">
            {/* 1. ΑΡΧΙΚΗ ΚΑΤΑΣΤΑΣΗ */}
            <g transform="translate(15, 10)">
              <text x="85" y="12" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#0f172a">
                Αρχικό Κουτί (Σύνολο: 100)
              </text>

              {/* Πλαίσιο κουτιού (10x10 πλέγμα) */}
              <rect x="15" y="24" width="140" height="140" rx="8" fill="#f8fafc" stroke="#334155" strokeWidth="2" />

              {/* 100 σφαίρες (52 άσπρες, 48 μαύρες) */}
              {Array.from({ length: 100 }).map((_, idx) => {
                const col = idx % 10;
                const row = Math.floor(idx / 10);
                const cx = 27 + col * 12.8;
                const cy = 36 + row * 12.8;
                const isWhite = idx < 52;

                return (
                  <circle
                    key={`init-${idx}`}
                    cx={cx}
                    cy={cy}
                    r="4.5"
                    fill={isWhite ? '#ffffff' : '#0f172a'}
                    stroke={isWhite ? '#64748b' : '#000000'}
                    strokeWidth="1"
                  />
                );
              })}

              {/* Ποσοστά αρχικού κουτιού */}
              <g transform="translate(15, 175)">
                <rect x="0" y="0" width="140" height="42" rx="6" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
                <circle cx="14" cy="14" r="4.5" fill="#ffffff" stroke="#64748b" strokeWidth="1" />
                <text x="24" y="17" fontSize="10" fontWeight="bold" fill="#0f172a">
                  52 Άσπρες: <tspan fill="#047857" fontWeight="900">52%</tspan>
                </text>

                <circle cx="14" cy="29" r="4.5" fill="#0f172a" />
                <text x="24" y="32" fontSize="10" fontWeight="bold" fill="#0f172a">
                  48 Μαύρες: <tspan fill="#b91c1c" fontWeight="900">48%</tspan>
                </text>
              </g>
            </g>

            {/* ΒΕΛΟΣ ΑΦΑΙΡΕΣΗΣ */}
            <g transform="translate(182, 85)">
              <line x1="0" y1="0" x2="34" y2="0" stroke="#dc2626" strokeWidth="2.2" />
              <polygon points="34,-4 42,0 34,4" fill="#dc2626" />
              <text x="21" y="-8" fontSize="9.5" fontWeight="black" textAnchor="middle" fill="#dc2626">
                －40 άσπρες
              </text>
              <text x="21" y="16" fontSize="9.5" fontWeight="black" textAnchor="middle" fill="#dc2626">
                －40 μαύρες
              </text>
            </g>

            {/* 2. ΤΕΛΙΚΗ ΚΑΤΑΣΤΑΣΗ */}
            <g transform="translate(250, 10)">
              <text x="85" y="12" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#0f172a">
                Τελικό Κουτί (Σύνολο: 20)
              </text>

              {/* Πλαίσιο κουτιού (5x4 πλέγμα) */}
              <rect x="15" y="24" width="140" height="140" rx="8" fill="#f8fafc" stroke="#334155" strokeWidth="2" />

              {/* 20 σφαίρες (12 άσπρες, 8 μαύρες) */}
              {Array.from({ length: 20 }).map((_, idx) => {
                const col = idx % 5;
                const row = Math.floor(idx / 5);
                const cx = 35 + col * 25;
                const cy = 48 + row * 26;
                const isWhite = idx < 12;

                return (
                  <circle
                    key={`final-${idx}`}
                    cx={cx}
                    cy={cy}
                    r="8.5"
                    fill={isWhite ? '#ffffff' : '#0f172a'}
                    stroke={isWhite ? '#64748b' : '#000000'}
                    strokeWidth="1.5"
                  />
                );
              })}

              {/* Ποσοστά τελικού κουτιού */}
              <g transform="translate(15, 175)">
                <rect x="0" y="0" width="140" height="42" rx="6" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
                <circle cx="14" cy="14" r="4.5" fill="#ffffff" stroke="#64748b" strokeWidth="1" />
                <text x="24" y="17" fontSize="10" fontWeight="bold" fill="#0f172a">
                  12 Άσπρες: <tspan fill="#047857" fontWeight="900">60%</tspan> (↑)
                </text>

                <circle cx="14" cy="29" r="4.5" fill="#0f172a" />
                <text x="24" y="32" fontSize="10" fontWeight="bold" fill="#0f172a">
                  8 Μαύρες: <tspan fill="#b91c1c" fontWeight="900">40%</tspan> (↓)
                </text>
              </g>
            </g>
          </svg>
        </div>

        {/* ΑΝΑΛΥΤΙΚΟΙ ΜΑΘΗΜΑΤΙΚΟΙ ΥΠΟΛΟΓΙΣΜΟΙ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-3">
          {/* 1. Αρχικά */}
          <div className="space-y-1">
            <div className="font-sans font-bold text-slate-900">
              1. Αρχική κατάσταση (Σύνολο: 52 ＋ 48 ＝ 100 σφαίρες):
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>• Ποσοστό άσπρων ＝</span>
                <Fraction num="52" den="100" />
                <span>＝ <strong>52%</strong></span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>• Ποσοστό μαύρων ＝</span>
                <Fraction num="48" den="100" />
                <span>＝ <strong>48%</strong></span>
              </div>
            </div>
          </div>

          {/* 2. Μετά την αφαίρεση */}
          <div className="space-y-1 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-slate-900">
              2. Μετά την αφαίρεση 40 άσπρων και 40 μαύρων:
            </div>
            <p className="text-slate-700">
              Απομένουν: 52 － 40 ＝ <strong>12 άσπρες</strong> και 48 － 40 ＝ <strong>8 μαύρες</strong>.<br />
              Το νέο σύνολο σφαιρών στο κουτί είναι 12 ＋ 8 ＝ <strong>20 σφαίρες</strong>.
            </p>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>• Νέο ποσοστό άσπρων ＝</span>
                <Fraction num="12" den="20" />
                <span>＝</span>
                <Fraction num="60" den="100" />
                <span>＝ <strong className="text-emerald-700 text-base">60%</strong></span>
                <span className="text-emerald-700 font-sans font-bold text-xs">(από 52% ➔ αυξήθηκε)</span>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-200">
                <span>• Νέο ποσοστό μαύρων ＝</span>
                <Fraction num="8" den="20" />
                <span>＝</span>
                <Fraction num="40" den="100" />
                <span>＝ <strong className="text-rose-700 text-base">40%</strong></span>
                <span className="text-rose-700 font-sans font-bold text-xs">(από 48% ➔ μειώθηκε)</span>
              </div>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Συνεπώς, <strong>αυξάνεται το ποσοστό των άσπρων σφαιρών και μειώνεται το ποσοστό των μαύρων σφαιρών</strong> (Επιλογή <strong>Δ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 11,
    officialNumber: 31,
    group: 'ΟΜΑΔΑ Β (5 Επιλογες)',
    promptText: 'Στην παρακάτω αριθμογραμμή, το ευθύγραμμο τμήμα ΚΛ έχει διπλάσιο μήκος από το ΜΛ, ενώ το ΜΝ έχει διπλάσιο μήκος από το ΝΛ. Αν στο Κ αντιστοιχεί ο αριθμός 5 και στο Λ ο αριθμός 35, ποιος αριθμός αντιστοιχεί στο σημείο Ν;',
    hasSvg: 'line31',
    options: [
      { key: 'A', label: '25', raw: '25' },
      { key: 'B', label: '27', raw: '27' },
      { key: 'Γ', label: '30', raw: '30' },
      { key: 'Δ', label: '32', raw: '32' },
      { key: 'E', label: '33', raw: '33' }
    ],
    correctRaw: '30',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Αναλύουμε τα μήκη των ευθυγράμμων τμημάτων κατά μήκος της αριθμογραμμής σταδιακά σε δύο φάσεις:
        </p>

        {/* SVG ΣΧΗΜΑ 2 ΦΑΣΕΩΝ ΥΠΟΛΟΓΙΣΜΟΥ */}
        <div className="bg-white/90 p-3.5 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="450" height="220" viewBox="0 0 450 220" className="select-none font-sans mx-auto block">
            {/* 1η ΦΑΣΗ: ΕΥΡΕΣΗ ΜΗΚΟΥΣ ΚΛ ΚΑΙ ΘΕΣΗΣ ΤΟΥ Μ */}
            <g transform="translate(15, 10)">
              <text x="210" y="12" fontSize="11.5" fontWeight="bold" textAnchor="middle" fill="#0f172a">
                1η Φάση: Εύρεση του Μ (ΚΛ ＝ 30, ΜΛ ＝ 15 ➔ Μ ＝ 20)
              </text>

              {/* Ευθεία γραμμή (x: 20 έως 400, μήκος 380px -> scale: 380/30 ≈ 12.67 px/μονάδα) */}
              <line x1="20" y1="52" x2="400" y2="52" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />

              {/* Σημείο Κ = 5 (x = 20) */}
              <circle cx="20" cy="52" r="4.5" fill="#1e3a8a" />
              <text x="20" y="72" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#1e3a8a">Κ (5)</text>

              {/* Σημείο Μ = 20 (x = 20 + 15*12.67 = 210) */}
              <circle cx="210" cy="52" r="4.5" fill="#0f172a" />
              <text x="210" y="72" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0f172a">Μ (20)</text>

              {/* Σημείο Λ = 35 (x = 400) */}
              <circle cx="400" cy="52" r="4.5" fill="#1e3a8a" />
              <text x="400" y="72" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#1e3a8a">Λ (35)</text>

              {/* Άνω διάσταση ολικού μήκους ΚΛ = 30 */}
              <line x1="20" y1="32" x2="400" y2="32" stroke="#64748b" strokeWidth="1.5" />
              <text x="115" y="26" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#64748b">ΚΜ ＝ 15</text>
              <text x="305" y="26" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#2563eb">ΜΛ ＝ 15 (μισό του ΚΛ)</text>
            </g>

            {/* 2η ΦΑΣΗ: ΧΩΡΙΣΜΟΣ ΤΟΥ ΜΛ ΑΠΟ ΤΟ Ν ΣΕ 2:1 (ΜΝ = 10, ΝΛ = 5) */}
            <g transform="translate(15, 115)">
              <text x="210" y="12" fontSize="11.5" fontWeight="bold" textAnchor="middle" fill="#0f172a">
                2η Φάση: Χωρισμός του ΜΛ από το Ν σε λόγο 2:1 (ΜΝ ＝ 10, ΝΛ ＝ 5)
              </text>

              <line x1="20" y1="52" x2="400" y2="52" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />

              {/* Σημείο Κ = 5 */}
              <circle cx="20" cy="52" r="4" fill="#94a3b8" />
              <text x="20" y="72" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#94a3b8">Κ (5)</text>

              {/* Σημείο Μ = 20 */}
              <circle cx="210" cy="52" r="4.5" fill="#0f172a" />
              <text x="210" y="72" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0f172a">Μ (20)</text>

              {/* Σημείο Ν = 30 (x = 210 + 10*12.67 ≈ 336.7) */}
              <circle cx="336.7" cy="52" r="5.5" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
              <text x="336.7" y="74" fontSize="12" fontWeight="black" textAnchor="middle" fill="#dc2626">Ν (30)</text>

              {/* Σημείο Λ = 35 */}
              <circle cx="400" cy="52" r="4.5" fill="#1e3a8a" />
              <text x="400" y="72" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#1e3a8a">Λ (35)</text>

              {/* Διαστάσεις ΜΝ και ΝΛ */}
              <line x1="210" y1="34" x2="336.7" y2="34" stroke="#dc2626" strokeWidth="1.8" />
              <text x="273" y="26" fontSize="10.5" fontWeight="black" textAnchor="middle" fill="#dc2626">ΜΝ ＝ 10</text>

              <line x1="336.7" y1="34" x2="400" y2="34" stroke="#059669" strokeWidth="1.8" />
              <text x="368" y="26" fontSize="10.5" fontWeight="black" textAnchor="middle" fill="#059669">ΝΛ ＝ 5</text>
            </g>
          </svg>
        </div>

        {/* ΑΝΑΛΥΤΙΚΑ ΒΗΜΑΤΑ ΕΠΙΛΥΣΗΣ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-3">
          {/* Βήμα 1 */}
          <div className="space-y-1">
            <div className="font-sans font-bold text-slate-900">
              1. Υπολογισμός του ολικού μήκους ΚΛ και της θέσης του σημείου Μ:
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
              <div>Μήκος(ΚΛ) ＝ 35 － 5 ＝ <strong>30 μονάδες</strong></div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>Αφού ΚΛ ＝ 2 · ΜΛ, έχουμε: ΜΛ ＝</span>
                <Fraction num="30" den="2" />
                <span>＝ <strong>15 μονάδες</strong></span>
              </div>
              <div className="pt-0.5 text-slate-700">
                Το σημείο Μ βρίσκεται 15 μονάδες αριστερά από το Λ:
                <div className="font-bold text-slate-950 pt-0.5">Μ ＝ 35 － 15 ＝ 20</div>
              </div>
            </div>
          </div>

          {/* Βήμα 2 */}
          <div className="space-y-1 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-slate-900">
              2. Χωρισμός του τμήματος ΜΛ από το σημείο Ν:
            </div>
            <p className="text-slate-700">
              Δίνεται ότι το τμήμα ΜΝ έχει διπλάσιο μήκος από το ΝΛ (<span className="font-mono font-bold">ΜΝ ＝ 2 · ΝΛ</span>).
              Επομένως, το συνολικό τμήμα ΜΛ χωρίζεται σε <strong>2 ＋ 1 ＝ 3 ίσα μέρη</strong>:
            </p>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>• 1 μέρος (ΝΛ) ＝</span>
                <Fraction num="15" den="3" />
                <span>＝ <strong>5 μονάδες</strong></span>
              </div>
              <div>• 2 μέρη (ΜΝ) ＝ 2 · 5 ＝ <strong>10 μονάδες</strong></div>

              <div className="pt-1 border-t border-slate-200 flex items-center gap-2 flex-wrap">
                <span>Θέση του σημείου Ν ＝ Μ ＋ ΜΝ ＝ 20 ＋ 10 ＝</span>
                <strong className="text-emerald-700 text-base">30</strong>
                <span className="text-slate-500 font-sans text-xs">(ή ισοδύναμα: 35 － 5 ＝ 30)</span>
              </div>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, στο σημείο Ν αντιστοιχεί ο αριθμός <strong>30</strong> (Επιλογή <strong>Γ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 12,
    officialNumber: 32,
    group: 'ΟΜΑΔΑ Β (5 Επιλογες)',
    promptText: 'Το 1ο δρομολόγιο λεωφορείου από την πόλη Κ προς την πόλη Λ φεύγει στις 6:20 π.μ. Το ταξίδι διαρκεί 3,5 ώρες. Κάθε επόμενο δρομολόγιο φεύγει μετά από 1 ώρα και 10 λεπτά. Αν το τελευταίο δρομολόγιο φτάνει στην πόλη Λ μεταξύ 5:30 μ.μ. με 6:30 μ.μ., τι ώρα έφυγε το τελευταίο δρομολόγιο από την πόλη Κ;',
    options: [
      { key: 'A', label: '2:30 μ.μ.', raw: '2:30' },
      { key: 'B', label: '2:40 μ.μ.', raw: '2:40' },
      { key: 'Γ', label: '2:50 μ.μ.', raw: '2:50' },
      { key: 'Δ', label: '3:00 μ.μ.', raw: '3:00' },
      { key: 'E', label: '3:10 μ.μ.', raw: '3:10' }
    ],
    correctRaw: '2:30',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Αναλύουμε τα δεδομένα της διαδρομής μεταξύ των δύο πόλεων και το πρόγραμμα των αναχωρήσεων:
        </p>

        {/* SVG ΣΧΗΜΑ: ΠΟΛΕΙΣ Κ & Λ, ΔΙΑΡΚΕΙΑ ΤΑΞΙΔΙΟΥ ΚΑΙ ΧΡΟΝΟΣ ΑΝΑΜΕΣΑ ΣΤΙΣ ΑΝΑΧΩΡΗΣΕΙΣ */}
        <div className="flex justify-center p-3 bg-white/90 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="450" height="150" viewBox="0 0 450 150" className="select-none font-sans mx-auto block">
            <defs>
              <marker id="bus-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 2 L 8 5 L 0 8 z" fill="#0284c7" />
              </marker>
            </defs>

            {/* ΠΟΛΗ Κ */}
            <g transform="translate(45, 60)">
              <rect x="-35" y="-35" width="70" height="70" rx="14" fill="#eff6ff" stroke="#2563eb" strokeWidth="2" />
              <text x="0" y="-8" fontSize="18" fontWeight="black" textAnchor="middle" fill="#1e3a8a">Πόλη Κ</text>
              <text x="0" y="12" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#2563eb">Αναχώρηση</text>
              <text x="0" y="25" fontSize="9" textAnchor="middle" fill="#64748b">(1ο: 6:20 π.μ.)</text>
            </g>

            {/* ΔΙΑΔΡΟΜΗ & ΔΙΑΡΚΕΙΑ ΤΑΞΙΔΙΟΥ */}
            <g transform="translate(100, 60)">
              {/* Καμπύλη διαδρομής */}
              <path
                d="M 0 0 C 70 -35, 180 -35, 250 0"
                fill="none"
                stroke="#0284c7"
                strokeWidth="2.5"
                strokeDasharray="4 4"
                markerEnd="url(#bus-arrow)"
              />

              {/* Ετικέτα Διάρκειας */}
              <g transform="translate(125, -28)">
                <rect x="-65" y="-12" width="130" height="24" rx="12" fill="#0284c7" />
                <text x="0" y="4" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#ffffff">
                  Διάρκεια: 3 ώρες & 30 λ.
                </text>
              </g>

              {/* Εικονίδιο λεωφορείου στη μέση */}
              <text x="125" y="-36" fontSize="18" textAnchor="middle">🚌</text>

              {/* Συχνότητα δρομολογίων κάτω από τη γραμμή */}
              <g transform="translate(125, 26)">
                <rect x="-85" y="-11" width="170" height="22" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
                <text x="0" y="4" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#475569">
                  ⏱️ Συχνότητα: ανά 1 ώρα & 10 λ.
                </text>
              </g>
            </g>

            {/* ΠΟΛΗ Λ */}
            <g transform="translate(405, 60)">
              <rect x="-35" y="-35" width="70" height="70" rx="14" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2" />
              <text x="0" y="-8" fontSize="18" fontWeight="black" textAnchor="middle" fill="#14532d">Πόλη Λ</text>
              <text x="0" y="12" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#16a34a">Άφιξη</text>
              <text x="0" y="25" fontSize="9" textAnchor="middle" fill="#64748b">(5:30 - 6:30 μ.μ.)</text>
            </g>
          </svg>
        </div>

        {/* ΑΝΑΛΥΤΙΚΑ ΒΗΜΑΤΑ ΕΠΙΛΥΣΗΣ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-3">
          {/* Βήμα 1 */}
          <div className="space-y-1">
            <div className="font-sans font-bold text-slate-900">
              1. Προσδιορισμός του παραθύρου αναχώρησης για το τελευταίο δρομολόγιο:
            </div>
            <p className="text-slate-700">
              Η διάρκεια του ταξιδιού είναι <strong>3,5 ώρες</strong> (δηλαδή 3 ώρες και 30 λεπτά). Αφαιρούμε τη διάρκεια από τις ώρες άφιξης:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
              <div>• Αν έφτανε στις <strong>5:30 μ.μ.</strong> ➔ θα έπρεπε να είχε φύγει στις: 5:30 － 3:30 ＝ <strong>2:00 μ.μ.</strong> (14:00)</div>
              <div>• Αν έφτανε στις <strong>6:30 μ.μ.</strong> ➔ θα έπρεπε να είχε φύγει στις: 6:30 － 3:30 ＝ <strong>3:00 μ.μ.</strong> (15:00)</div>
              <div className="pt-1 text-blue-700 font-sans font-bold text-xs">
                Άρα το τελευταίο δρομολόγιο αναχώρησε μεταξύ 2:00 μ.μ. (14:00) και 3:00 μ.μ. (15:00).
              </div>
            </div>
          </div>

          {/* Βήμα 2 */}
          <div className="space-y-1 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-slate-900">
              2. Διαδοχικές ώρες αναχώρησης από την Πόλη Κ (προσθέτουμε ανά 1 ώρα και 10 λεπτά):
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-xs">
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 text-center">
                <span className="text-slate-400 block text-[10px]">1ο Δρομολόγιο</span>
                <strong className="text-slate-900">06:20</strong>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 text-center">
                <span className="text-slate-400 block text-[10px]">2ο Δρομολόγιο</span>
                <strong className="text-slate-900">07:30</strong>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 text-center">
                <span className="text-slate-400 block text-[10px]">3ο Δρομολόγιο</span>
                <strong className="text-slate-900">08:40</strong>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 text-center">
                <span className="text-slate-400 block text-[10px]">4ο Δρομολόγιο</span>
                <strong className="text-slate-900">09:50</strong>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 text-center">
                <span className="text-slate-400 block text-[10px]">5ο Δρομολόγιο</span>
                <strong className="text-slate-900">11:00</strong>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 text-center">
                <span className="text-slate-400 block text-[10px]">6ο Δρομολόγιο</span>
                <strong className="text-slate-900">12:10</strong>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 text-center">
                <span className="text-slate-400 block text-[10px]">7ο Δρομολόγιο</span>
                <strong className="text-slate-900">13:20</strong>
              </div>
              <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-300 text-center shadow-xs">
                <span className="text-emerald-700 font-bold block text-[10px]">8ο (Τελευταίο)</span>
                <strong className="text-emerald-800 text-sm">14:30 (2:30 μ.μ.)</strong>
              </div>
            </div>
          </div>

          {/* Βήμα 3 */}
          <div className="space-y-1 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-slate-900">
              3. Επαλήθευση ώρας άφιξης:
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
              Ώρα Άφιξης ＝ 14:30 ＋ 3 ώρες και 30 λεπτά ＝ <strong className="text-emerald-700">18:00 (6:00 μ.μ.)</strong>
              <div className="text-slate-600 font-sans text-xs pt-0.5">
                Η ώρα 6:00 μ.μ. βρίσκεται ακριβώς εντός του ζητούμενου διαστήματος (μεταξύ 5:30 μ.μ. και 6:30 μ.μ.).
              </div>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Συνεπώς, το τελευταίο δρομολόγιο έφυγε από την πόλη Κ στις <strong>2:30 μ.μ.</strong> (Επιλογή <strong>A</strong>).
        </p>
      </div>
    )
  },
  {
    id: 13,
    officialNumber: 33,
    group: 'ΟΜΑΔΑ Β (5 Επιλογες)',
    promptText: 'Στο άθλημα της ενόργανης γυμναστικής βαθμολογούν 6 κριτές και η τελική βαθμολογία προκύπτει από τον μέσο όρο των τεσσάρων από αυτούς καθώς δεν λαμβάνονται υπόψη ο μεγαλύτερος και ο μικρότερος βαθμός. Αν σε ένα αγώνισμα ο μέσος όρος των 6 κριτών ήταν 8,2 και ο τελικός μέσος όρος (αφού αφαιρέθηκαν η μεγαλύτερη και η μικρότερη βαθμολογία) ήταν 8,3 ποιο ήταν το άθροισμα των βαθμών που αφαιρέθηκαν;',
    options: [
      { key: 'A', label: '16', raw: '16' },
      { key: 'B', label: '16,8', raw: '16.8' },
      { key: 'Γ', label: '17', raw: '17' },
      { key: 'Δ', label: '17,6', raw: '17.6' },
      { key: 'E', label: 'δεν μπορούμε να γνωρίζουμε', raw: 'unknown' }
    ],
    correctRaw: '16',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Σύμφωνα με τους κανονισμούς, από τις 6 βαθμολογίες αφαιρούνται η <strong>ελάχιστη</strong> και η <strong>μέγιστη</strong>, οπότε υπολογίζουμε το άθροισμα των βαθμών από τους αντίστοιχους μέσους όρους.
        </p>

        {/* SVG ΣΧΗΜΑ ΑΝΑΛΥΣΗΣ ΤΩΝ 6 ΒΑΘΜΟΛΟΓΙΩΝ */}
        <div className="flex justify-center p-3 bg-white/90 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="450" height="175" viewBox="0 0 450 175" className="select-none font-sans mx-auto block">
            {/* ΟΛΙΚΟ ΠΛΑΙΣΙΟ: ΟΛΟΙ ΟΙ 6 ΚΡΙΤΕΣ */}
            <g transform="translate(15, 20)">
              {/* Εξωτερική αγκύλη / πλαίσιο 6 κριτών */}
              <rect x="0" y="25" width="420" height="60" rx="14" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />

              {/* Ετικέτα όλου του συνόλου */}
              <text x="210" y="14" fontSize="11.5" fontWeight="bold" textAnchor="middle" fill="#0f172a">
                Σύνολο 6 Κριτών: Μέσος Όρος ＝ 8,2  ➔  Άθροισμα ＝ 6 · 8,2 ＝ 49,2
              </text>

              {/* 1. Ελάχιστος Βαθμός (x) - Κόκκινο */}
              <g transform="translate(12, 33)">
                <rect x="0" y="0" width="58" height="44" rx="8" fill="#fee2e2" stroke="#dc2626" strokeWidth="1.8" />
                <text x="29" y="18" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#991b1b">Ελάχιστος</text>
                <text x="29" y="34" fontSize="13" fontWeight="900" textAnchor="middle" fill="#dc2626" fontFamily="monospace">x</text>
              </g>

              {/* 2. Τέσσερις Μεσαίοι Κριτές (z) - Πράσινο */}
              <g transform="translate(80, 33)">
                <rect x="0" y="0" width="260" height="44" rx="8" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2" />
                <text x="130" y="18" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#14532d">
                  4 Μεσαίοι Κριτές (Μ.Ο. ＝ 8,3)
                </text>
                <text x="130" y="34" fontSize="12" fontWeight="900" textAnchor="middle" fill="#15803d" fontFamily="monospace">
                  Άθροισμα (z) ＝ 4 · 8,3 ＝ 33,2
                </text>
              </g>

              {/* 3. Μέγιστος Βαθμός (y) - Κόκκινο */}
              <g transform="translate(350, 33)">
                <rect x="0" y="0" width="58" height="44" rx="8" fill="#fee2e2" stroke="#dc2626" strokeWidth="1.8" />
                <text x="29" y="18" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#991b1b">Μέγιστος</text>
                <text x="29" y="34" fontSize="13" fontWeight="900" textAnchor="middle" fill="#dc2626" fontFamily="monospace">y</text>
              </g>

              {/* Κάτω ένδειξη για τους 2 βαθμούς που αφαιρέθηκαν */}
              <g transform="translate(0, 98)">
                <path d="M 41 0 L 41 12 L 379 12 L 379 0" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="3 2" />
                <rect x="110" y="3" width="200" height="22" rx="11" fill="#dc2626" />
                <text x="210" y="18" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#ffffff">
                  Βαθμοί που αφαιρέθηκαν: x ＋ y ＝ 16
                </text>
              </g>
            </g>
          </svg>
        </div>

        {/* 1ος ΤΡΟΠΟΣ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-2.5">
          <div className="font-sans font-bold text-blue-900 text-sm border-b border-slate-200 pb-1">
            🔷 1ος Τρόπος (Με τη διαφορά των συνολικών αθροισμάτων)
          </div>

          <p className="text-slate-800">
            Γνωρίζουμε ότι: <span className="font-mono font-bold">Άθροισμα ＝ (Μέσος Όρος) · (Πλήθος Κριτών)</span>.
          </p>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div>• Συνολικό άθροισμα και των 6 κριτών: 6 · 8,2 ＝ <strong>49,2 βαθμοί</strong></div>
            <div>• Συνολικό άθροισμα των 4 μεσαίων κριτών: 4 · 8,3 ＝ <strong>33,2 βαθμοί</strong></div>

            <div className="pt-2 border-t border-slate-200 space-y-1">
              <div className="text-slate-700 font-sans text-xs">
                Αφαιρούμε το άθροισμα των 4 κριτών από το αρχικό άθροισμα των 6 κριτών:
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>Άθροισμα των 2 βαθμών που αφαιρέθηκαν ＝ 49,2 － 33,2 ＝</span>
                <strong className="text-emerald-700 text-base">16</strong>
              </div>
            </div>
          </div>
        </div>

        {/* 2ος ΤΡΟΠΟΣ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-2.5">
          <div className="font-sans font-bold text-blue-900 text-sm border-b border-slate-200 pb-1">
            🔷 2ος Τρόπος (Με αλγεβρική εξίσωση)
          </div>

          <p className="text-slate-800">
            Ορίζουμε με <strong>x</strong> τη μικρότερη βαθμολογία, με <strong>y</strong> τη μεγαλύτερη και με <strong>z</strong> το άθροισμα των υπόλοιπων 4 μεσαίων βαθμολογιών:
          </p>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>• Από τον τελικό μέσο όρο:</span>
              <Fraction num="z" den="4" />
              <span>＝ 8,3 ➔ z ＝ 4 · 8,3 ➔ <strong>z ＝ 33,2</strong></span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-200">
              <span>• Από τον μέσο όρο των 6 κριτών:</span>
              <Fraction num="x ＋ z ＋ y" den="6" />
              <span>＝ 8,2</span>
            </div>

            <div className="pl-3 space-y-1">
              <div>x ＋ z ＋ y ＝ 6 · 8,2</div>
              <div>x ＋ z ＋ y ＝ 49,2</div>
              <div className="text-slate-500 font-sans text-xs">// Αντικαθιστούμε το z ＝ 33,2</div>
              <div>x ＋ 33,2 ＋ y ＝ 49,2</div>
              <div>x ＋ y ＝ 49,2 － 33,2 ➔ <strong className="text-emerald-700 text-base">x ＋ y ＝ 16</strong></div>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Άρα, το άθροισμα των βαθμών που αφαιρέθηκαν είναι <strong>16</strong> (Επιλογή <strong>A</strong>).
        </p>
      </div>
    )
  },
  {
    id: 14,
    officialNumber: 34,
    group: 'ΟΜΑΔΑ Β (5 Επιλογες)',
    promptText: 'Ένα χαρτόνι σχήματος ορθογωνίου παραλληλογράμμου έχει περίμετρο 50 εκ. Το διπλώνουμε στη μέση και προκύπτει ορθογώνιο παραλληλόγραμμο που έχει περίμετρο 40 εκ. Πόσο είναι το εμβαδόν του αρχικού ορθογωνίου παραλληλογράμμου;',
    options: [
      { key: 'A', label: '200 τ.εκ.', raw: '200' },
      { key: 'B', label: '250 τ.εκ.', raw: '250' },
      { key: 'Γ', label: '400 τ.εκ.', raw: '400' },
      { key: 'Δ', label: '150 τ.εκ.', raw: '150' },
      { key: 'E', label: '600 τ.εκ.', raw: '600' }
    ],
    correctRaw: '150',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Συμβολίζουμε με <strong>x</strong> και <strong>y</strong> τις δύο διαστάσεις του αρχικού ορθογωνίου χαρτονιού.
        </p>

        {/* SVG ΣΧΗΜΑ: ΑΡΧΙΚΟ ΧΑΡΤΟΝΙ & ΔΙΠΛΩΜΕΝΟ ΣΤΗ ΜΕΣΗ */}
        <div className="flex justify-center p-3 bg-white/90 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="450" height="175" viewBox="0 0 450 175" className="select-none font-sans mx-auto block">
            {/* 1. ΑΡΧΙΚΟ ΟΡΘΟΓΩΝΙΟ */}
            <g transform="translate(20, 15)">
              <text x="85" y="0" fontSize="11.5" fontWeight="bold" textAnchor="middle" fill="#0f172a">
                1. Αρχικό Χαρτόνι (Π₁ ＝ 50 εκ.)
              </text>

              <g transform="translate(0, 12)">
                {/* Ορθογώνιο διαστάσεων x=170px, y=110px */}
                <rect x="0" y="0" width="170" height="110" rx="4" fill="#f8fafc" stroke="#334155" strokeWidth="2" />

                {/* Γραμμή διπλώματος στη μέση του x (διακεκομμένη) */}
                <line x1="85" y1="0" x2="85" y2="110" stroke="#dc2626" strokeWidth="1.6" strokeDasharray="4 3" />
                <text x="85" y="58" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#dc2626">
                  δίπλωμα
                </text>

                {/* Διαστάσεις */}
                <text x="85" y="-4" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#2563eb" fontFamily="monospace">x</text>
                <text x="85" y="124" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#2563eb" fontFamily="monospace">x</text>
                <text x="-10" y="59" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#2563eb" fontFamily="monospace">y</text>
                <text x="180" y="59" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#2563eb" fontFamily="monospace">y</text>
              </g>
            </g>

            {/* ΒΕΛΟΣ ΜΕΤΑΒΑΣΗΣ */}
            <g transform="translate(216, 75)">
              <line x1="0" y1="0" x2="20" y2="0" stroke="#0f172a" strokeWidth="2" />
              <polygon points="20,-4 28,0 20,4" fill="#0f172a" />
            </g>

            {/* 2. ΔΙΠΛΩΜΕΝΟ ΟΡΘΟΓΩΝΙΟ */}
            <g transform="translate(275, 15)">
              <text x="65" y="0" fontSize="11.5" fontWeight="bold" textAnchor="middle" fill="#0f172a">
                2. Διπλωμένο Χαρτόνι (Π₂ ＝ 40 εκ.)
              </text>

              <g transform="translate(20, 12)">
                {/* Νέο ορθογώνιο: πλάτος x/2 = 85px, ύψος y = 110px */}
                <rect x="0" y="0" width="85" height="110" rx="4" fill="#eff6ff" stroke="#2563eb" strokeWidth="2.2" />

                {/* Διαστάσεις */}
                <text x="42.5" y="-5" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#0284c7" fontFamily="monospace">x/2</text>
                <text x="42.5" y="125" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#0284c7" fontFamily="monospace">x/2</text>
                <text x="-10" y="59" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#2563eb" fontFamily="monospace">y</text>
                <text x="95" y="59" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#2563eb" fontFamily="monospace">y</text>
              </g>
            </g>
          </svg>
        </div>

        {/* ΑΝΑΛΥΤΙΚΗ ΕΠΙΛΥΣΗ ΜΕ ΤΙΣ ΕΞΙΣΩΣΕΙΣ ΠΕΡΙΜΕΤΡΩΝ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-3">
          {/* Βήμα 1: Αρχική Περίμετρος */}
          <div className="space-y-1">
            <div className="font-sans font-bold text-slate-900">
              1. Περίμετρος αρχικού σχήματος (Π₁ ＝ 50 εκ.):
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
              <div>Π₁ ＝ x ＋ y ＋ x ＋ y ＝ 50</div>
              <div>2x ＋ 2y ＝ 50</div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>x ＋ y ＝</span>
                <Fraction num="50" den="2" />
                <span>➔ <strong>x ＋ y ＝ 25</strong> &nbsp;(1)</span>
              </div>
            </div>
          </div>

          {/* Βήμα 2: Περίμετρος Διπλωμένου Σχήματος */}
          <div className="space-y-1 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-slate-900">
              2. Περίμετρος τελικού διπλωμένου σχήματος (Π₂ ＝ 40 εκ.):
            </div>
            <p className="text-slate-700">
              Διπλώνοντας κατά μήκος της διάστασης x, η μία πλευρά υποδιπλασιάζεται (<Fraction num="x" den="2" />), ενώ η άλλη πλευρά (y) παραμένει η ίδια:
            </p>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>Π₂ ＝</span>
                <Fraction num="x" den="2" />
                <span>＋ y ＋</span>
                <Fraction num="x" den="2" />
                <span>＋ y ＝ 40</span>
              </div>
              <div>x ＋ 2y ＝ 40</div>
              <div>(x ＋ y) ＋ y ＝ 40</div>
              <div className="text-slate-500 font-sans text-xs">// Αντικαθιστούμε από τη σχέση (1) όπου (x ＋ y) το 25:</div>
              <div>25 ＋ y ＝ 40</div>
              <div>y ＝ 40 － 25 ➔ <strong className="text-emerald-700 text-base">y ＝ 15 εκ.</strong></div>
            </div>
          </div>

          {/* Βήμα 3: Εύρεση διάστασης x και Εμβαδού */}
          <div className="space-y-1 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-slate-900">
              3. Υπολογισμός της διάστασης x και του αρχικού εμβαδού:
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
              <div>x ＝ 25 － y ＝ 25 － 15 ➔ <strong>x ＝ 10 εκ.</strong></div>
              <div className="pt-1 border-t border-slate-200 flex items-center gap-2 flex-wrap">
                <span>Εμβαδόν αρχικού ορθογωνίου ＝ x · y ＝ 10 · 15 ＝</span>
                <strong className="text-emerald-700 text-base">150 τ.εκ.</strong>
              </div>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, το εμβαδόν του αρχικού ορθογωνίου είναι <strong>150 τ.εκ.</strong> (Επιλογή <strong>Δ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 15,
    officialNumber: 35,
    group: 'ΟΜΑΔΑ Β (5 Επιλογες)',
    promptText: 'Σήμερα είναι Σάββατο 25 Απριλίου 2026. Τι μέρα θα είναι η 25η Απριλίου του 2031; (Το έτος 2028 είναι δίσεκτο).',
    options: [
      { key: 'A', label: 'Πέμπτη', raw: 'Πέμπτη' },
      { key: 'B', label: 'Παρασκευή', raw: 'Παρασκευή' },
      { key: 'Γ', label: 'Σάββατο', raw: 'Σάββατο' },
      { key: 'Δ', label: 'Κυριακή', raw: 'Κυριακή' },
      { key: 'E', label: 'Δευτέρα', raw: 'Δευτέρα' }
    ],
    correctRaw: 'Παρασκευή',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Για να βρούμε την ημέρα της εβδομάδας σε μελλοντική ημερομηνία, εξετάζουμε τη <strong>μετατόπιση</strong> που προκαλούν τα κοινά και τα δίσεκτα έτη που μεσολαβούν.
        </p>

        {/* SVG ΣΧΗΜΑ: ΧΡΟΝΟΓΡΑΜΜΗ 5 ΕΤΩΝ ΜΕ ΜΕΤΑΤΟΠΙΣΕΙΣ (+1 / +2) */}
        <div className="flex justify-center p-3 bg-white/90 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="460" height="170" viewBox="0 0 460 170" className="select-none font-sans mx-auto block">
            <defs>
              <marker id="year-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
              </marker>
            </defs>

            {/* ΟΡΙΖΟΝΤΙΑ ΧΡΟΝΟΓΡΑΜΜΗ */}
            <line x1="30" y1="120" x2="430" y2="120" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#year-arrow)" />
            <text x="435" y="124" fontSize="10" fontWeight="bold" fill="#64748b">Χρόνος</text>

            {/* 6 ΣΗΜΕΙΑ ΕΤΩΝ (2026 - 2031) */}
            {[
              { year: '2026', day: 'Σάββατο', x: 30, color: '#0f172a' },
              { year: '2027', day: 'Κυριακή', x: 110, color: '#475569' },
              { year: '2028', day: 'Τρίτη', x: 190, color: '#dc2626', leap: true }, // Δίσεκτο
              { year: '2029', day: 'Τετάρτη', x: 270, color: '#475569' },
              { year: '2030', day: 'Πέμπτη', x: 350, color: '#475569' },
              { year: '2031', day: 'Παρασκευή', x: 430, color: '#047857', target: true } // Ζητούμενο
            ].map((node) => (
              <g key={node.year} transform={`translate(${node.x}, 120)`}>
                {/* Κάθετη γραμμή έτους */}
                <line x1="0" y1="-5" x2="0" y2="5" stroke={node.color} strokeWidth="1.5" />
                {/* Έτος */}
                <text x="0" y="20" fontSize="11" fontWeight="bold" textAnchor="middle" fill={node.color}>{node.year}</text>
                {/* Ημέρα */}
                <text x="0" y="34" fontSize="10" fontWeight="medium" textAnchor="middle" fill={node.target ? '#047857' : node.day === 'Σάββατο' ? '#0f172a' : '#64748b'}>
                  {node.target ? <tspan fontWeight="black">({node.day})</tspan> : node.day}
                </text>
                {/* Σήμανση Δίσεκτου */}
                {node.leap && (
                  <text x="0" y="46" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#dc2626">(δίσεκτο)</text>
                )}
              </g>
            ))}

            {/* ΤΟΞΑ ΜΕΤΑΤΟΠΙΣΗΣ (+1 ή +2) */}
            {[
              { startX: 30, endX: 110, val: '+1', isLeap: false },
              { startX: 110, endX: 190, val: '+2', isLeap: true }, // 2027 -> 2028 (Δίσεκτο)
              { startX: 190, endX: 270, val: '+1', isLeap: false },
              { startX: 270, endX: 350, val: '+1', isLeap: false },
              { startX: 350, endX: 430, val: '+1', isLeap: false }
            ].map((arc, idx) => (
              <g key={idx}>
                <path
                  d={`M ${arc.startX} 105 C ${arc.startX + 20} 70, ${arc.endX - 20} 70, ${arc.endX} 105`}
                  fill="none"
                  stroke={arc.isLeap ? '#dc2626' : '#2563eb'}
                  strokeWidth={arc.isLeap ? '2.2' : '1.8'}
                  markerEnd="url(#year-arrow)"
                />
                <text
                  x={(arc.startX + arc.endX) / 2}
                  y="78"
                  fontSize="12"
                  fontWeight="black"
                  textAnchor="middle"
                  fill={arc.isLeap ? '#991b1b' : '#1e40af'}
                  fontFamily="monospace"
                >
                  {arc.val}
                </text>
              </g>
            ))}

            {/* ΣΥΝΟΛΙΚΗ ΕΝΔΕΙΞΗ ΜΕΤΑΤΟΠΙΣΗΣ */}
            <rect x="30" y="5" width="400" height="20" rx="4" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
            <text x="230" y="19" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#0f172a">
              Συνολική Μετατόπιση (6 ημέρες): +1 +1 +1 +1 +2 ＝ +6
            </text>
          </svg>
        </div>

        {/* ΑΝΑΛΥΤΙΚΟΙ ΤΡΟΠΟΙ ΕΠΙΛΥΣΗΣ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-3">
          {/* Βασική Αρχή */}
          <div className="space-y-1">
            <div className="font-sans font-bold text-slate-900 border-b border-slate-200 pb-1">
              💡 Βασική Αρχή Μετατόπισης Ημέρας
            </div>
            <p className="text-slate-700">
              Η ημέρα της εβδομάδας για την ίδια ημερομηνία μετατοπίζεται στο επόμενο έτος λόγω του υπολοίπου της διαίρεσης των ημερών του έτους με το 7 (ημέρες εβδομάδας):
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>• Κοινό έτος (365 ημέρες): 365 ＝ 52 · 7 ＋</span>
                <strong className="text-blue-700">1</strong>
                <span>➔ Μετατόπιση: <strong>＋1 ημέρα</strong></span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                <span>• Δίσεκτο έτος (366 ημέρες): 366 ＝ 52 · 7 ＋</span>
                <strong className="text-rose-700">2</strong>
                <span>➔ Μετατόπιση: <strong>＋2 ημέρες</strong></span>
              </div>
            </div>
          </div>

          {/* 1ος ΤΡΟΠΟΣ */}
          <div className="space-y-1 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-slate-900">
              🔷 1ος Τρόπος (Βήμα προς βήμα υπολογισμός)
            </div>
            <p className="text-slate-700">
              Υπολογίζουμε την ημέρα για κάθε έτος διαδοχικά από το 2026 έως το 2031:
            </p>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5 text-xs sm:text-sm">
              <div className="grid grid-cols-[1fr,auto,2fr] items-center gap-x-2">
                <span>25 Απριλίου 2026</span><span>➔</span><span className="font-bold text-slate-950">Σάββατο</span>
              </div>
              <div className="grid grid-cols-[1fr,auto,2fr] items-center gap-x-2 pt-1 border-t border-slate-100">
                <span className="text-slate-600">25 Απριλίου 2027 (+1)</span><span>➔</span><span className="text-slate-800">Κυριακή</span>
              </div>
              <div className="grid grid-cols-[1fr,auto,2fr] items-center gap-x-2 pt-1 border-t border-slate-100 bg-rose-50/50 rounded-md px-1.5 py-1">
                <span className="text-rose-900 font-bold">25 Απριλίου 2028 (+2*)</span><span>➔</span><span className="text-rose-950">Τρίτη</span>
                <span className="col-span-3 text-[10px] text-rose-700 font-sans">(*To 2028 είναι δίσεκτο, η 25η Απριλίου είναι μετά τον Φεβρουάριο)</span>
              </div>
              <div className="grid grid-cols-[1fr,auto,2fr] items-center gap-x-2 pt-1 border-t border-slate-100">
                <span className="text-slate-600">25 Απριλίου 2029 (+1)</span><span>➔</span><span className="text-slate-800">Τετάρτη</span>
              </div>
              <div className="grid grid-cols-[1fr,auto,2fr] items-center gap-x-2 pt-1 border-t border-slate-100">
                <span className="text-slate-600">25 Απριλίου 2030 (+1)</span><span>➔</span><span className="text-slate-800">Πέμπτη</span>
              </div>
              <div className="grid grid-cols-[1fr,auto,2fr] items-center gap-x-2 pt-1 border-t border-slate-100 bg-emerald-50 rounded-md px-1.5 py-1">
                <span className="text-emerald-900 font-bold">25 Απριλίου 2031 (+1)</span><span>➔</span><span className="text-emerald-950 font-black">Παρασκευή</span>
              </div>
            </div>
          </div>

          {/* 2ος ΤΡΟΠΟΣ */}
          <div className="space-y-1 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-slate-900">
              🔷 2ος Τρόπος (Συνολική μετατόπιση)
            </div>
            <p className="text-slate-700">
              Από το 2026 έως το 2031 μεσολαβούν <strong>5 έτη</strong>.
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
              <p className="text-slate-800 font-sans text-xs">Αυτά τα 5 έτη αποτελούνται από:</p>
              <div>• 4 κοινά έτη: 4 · (＋1 ημέρα) ＝ <strong>＋4 ημέρες</strong></div>
              <div>• 1 δίσεκτο έτος (το 2028): 1 · (＋2 ημέρες) ＝ <strong>＋2 ημέρες</strong></div>
              <div className="pt-1.5 border-t border-slate-200 flex items-center gap-1.5 flex-wrap">
                <strong className="text-emerald-700">Συνολική μετατόπιση</strong> ＝ 4 ＋ 2 ＝
                <strong className="text-emerald-700 text-base">＋6 ημέρες</strong>
              </div>
            </div>
            <p className="text-slate-700 pt-1">
              Η ημέρα θα είναι 6 ημέρες μετά το Σάββατο: <span className="font-bold">Σάββατο ＋ 6 ημέρες ➔ <span className="text-emerald-800 font-black">Παρασκευή</span></span>.
              <span className="text-slate-500 text-xs"> (ή ισοδύναμα, 1 ημέρα πριν από το Σάββατο).</span>
            </p>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, η 25η Απριλίου 2031 θα είναι <strong>Παρασκευή</strong> (Επιλογή <strong>B</strong>).
        </p>
      </div>
    )
  },
  {
    id: 16,
    officialNumber: 36,
    group: 'ΟΜΑΔΑ Β (5 Επιλογες)',
    promptText: 'Το ισόπλευρο τρίγωνο του σχήματος στα αριστερά αποτελείται από 9 ίσα μεταξύ τους ισόπλευρα τρίγωνα. Χρωματίζουμε ένα μέρος του τριγώνου, όπως στο σχήμα στα δεξιά. Τι κλάσμα του εμβαδού του μεγάλου τριγώνου είναι το χρωματισμένο μέρος;',
    hasSvg: 'triangle36',
    options: [
      { key: 'A', label: <Fraction num="2" den="9" />, raw: '2/9' },
      { key: 'B', label: <Fraction num="3" den="9" />, raw: '3/9' },
      { key: 'Γ', label: <Fraction num="4" den="9" />, raw: '4/9' },
      { key: 'Δ', label: <Fraction num="1" den="2" />, raw: '1/2' },
      { key: 'E', label: <Fraction num="7" den="18" />, raw: '7/18' }
    ],
    correctRaw: '4/9',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Το μεγάλο ισόπλευρο τρίγωνο αποτελείται από <strong>9 ίσα μικρά ισόπλευρα τρίγωνα</strong>. Παρατηρούμε τη γεωμετρία του σκιασμένου μέρους στα παρακάτω 3 βήματα:
        </p>

        {/* 3 ΣΧΗΜΑΤΑ: 1. ΑΡΧΙΚΟ | 2. 4 ΧΡΩΜΑΤΙΣΜΕΝΑ ΤΜΗΜΑΤΑ | 3. 4 ΟΛΟΚΛΗΡΩΜΕΝΑ ΤΡΙΓΩΝΑ (ΜΕ ΤΟ ΑΝΕΣΤΡΑΜΜΕΝΟ 4) */}
        <div className="p-3 bg-white/90 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          {(() => {
            // Συντεταγμένες των 10 κόμβων του πλέγματος των 9 τριγώνων
            const P = {
              top: [80, 14],
              r1_0: [57, 54],   r1_1: [103, 54],
              r2_0: [34, 94],   r2_1: [80, 94],    r2_2: [126, 94],
              r3_0: [11, 134],  r3_1: [57, 134],   r3_2: [103, 134],  r3_3: [149, 134]
            };

            const pt = (p) => `${p[0]},${p[1]}`;

            // Κοινό περίγραμμα και γραμμές πλέγματος
            const renderGridLines = () => (
              <>
                <line x1={P.r1_0[0]} y1={P.r1_0[1]} x2={P.r1_1[0]} y2={P.r1_1[1]} stroke="#1e293b" strokeWidth="1.6" />
                <line x1={P.r2_0[0]} y1={P.r2_0[1]} x2={P.r2_2[0]} y2={P.r2_2[1]} stroke="#1e293b" strokeWidth="1.6" />
                <line x1={P.r1_0[0]} y1={P.r1_0[1]} x2={P.r3_2[0]} y2={P.r3_2[1]} stroke="#1e293b" strokeWidth="1.6" />
                <line x1={P.r1_1[0]} y1={P.r1_1[1]} x2={P.r3_1[0]} y2={P.r3_1[1]} stroke="#1e293b" strokeWidth="1.6" />
                <line x1={P.r2_0[0]} y1={P.r2_0[1]} x2={P.r3_1[0]} y2={P.r3_1[1]} stroke="#1e293b" strokeWidth="1.6" />
                <line x1={P.r2_2[0]} y1={P.r2_2[1]} x2={P.r3_2[0]} y2={P.r3_2[1]} stroke="#1e293b" strokeWidth="1.6" />
              </>
            );

            // Κόμβοι (κυκλάκια)
            const renderNodes = () => (
              <>
                {[P.top, P.r1_0, P.r1_1, P.r2_0, P.r2_1, P.r2_2, P.r3_0, P.r3_1, P.r3_2, P.r3_3].map(([cx, cy], idx) => (
                  <circle key={`nd-${idx}`} cx={cx} cy={cy} r="4" fill="#64748b" stroke="#0f172a" strokeWidth="1.4" />
                ))}
              </>
            );

            return (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 min-w-[480px]">
                {/* 1ο ΣΧΗΜΑ: ΑΡΧΙΚΟ ΣΚΙΑΣΜΕΝΟ */}
                <div className="flex flex-col items-center bg-slate-50/70 p-2.5 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-800 text-[11px] mb-1">
                    1. Αρχικό Σχήμα
                  </span>
                  <svg width="150" height="145" viewBox="0 0 160 145" className="select-none font-sans">
                    {/* Μεγάλο τρίγωνο */}
                    <polygon points={`${pt(P.top)} ${pt(P.r3_0)} ${pt(P.r3_3)}`} fill="#ffffff" stroke="#1e293b" strokeWidth="2.2" />

                    {/* Αρχικό σκιασμένο μέρος */}
                    <polygon points={`${pt(P.r1_0)} ${pt(P.r1_1)} ${pt(P.r3_0)}`} fill="#94a3b8" />
                    <polygon points={`${pt(P.r3_0)} ${pt(P.r3_2)} ${pt(P.r2_2)}`} fill="#94a3b8" />

                    {renderGridLines()}

                    {/* 2 διαγώνιες */}
                    <line x1={P.r3_0[0]} y1={P.r3_0[1]} x2={P.r1_1[0]} y2={P.r1_1[1]} stroke="#0f172a" strokeWidth="2.2" />
                    <line x1={P.r3_0[0]} y1={P.r3_0[1]} x2={P.r2_2[0]} y2={P.r2_2[1]} stroke="#0f172a" strokeWidth="2.2" />

                    {renderNodes()}
                  </svg>
                  <span className="text-[10px] font-medium text-slate-600 mt-1">Σκιασμένο μέρος</span>
                </div>

                {/* 2ο ΣΧΗΜΑ: ΤΑ 4 ΧΡΩΜΑΤΙΣΤΑ ΤΜΗΜΑΤΑ */}
                <div className="flex flex-col items-center bg-slate-50/70 p-2.5 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-800 text-[11px] mb-1">
                    2. Εντοπισμός Τμημάτων
                  </span>
                  <svg width="150" height="145" viewBox="0 0 160 145" className="select-none font-sans">
                    <polygon points={`${pt(P.top)} ${pt(P.r3_0)} ${pt(P.r3_3)}`} fill="#ffffff" stroke="#1e293b" strokeWidth="2.2" />

                    {/* Γκρι σκιασμένα μέρη */}
                    <polygon points={`${pt(P.r1_0)} ${pt(P.r1_1)} ${pt(P.r3_0)}`} fill="#94a3b8" />
                    <polygon points={`${pt(P.r3_0)} ${pt(P.r3_2)} ${pt(P.r2_2)}`} fill="#94a3b8" />

                    {/* 1. ΚΟΚΚΙΝΟ ΤΜΗΜΑ: πάνω-αριστερά */}
                    <polygon points={`${pt(P.r3_0)} ${pt(P.r2_0)} 57,94`} fill="#dc2626" />

                    {/* 2. ΠΡΑΣΙΝΟ ΤΜΗΜΑ: δίπλα στο κόκκινο, πάνω από την οριζόντια */}
                    <polygon points={`${pt(P.r2_0)} ${pt(P.r2_1)} 57,94`} fill="#16a34a" />

                    {/* 3. ΜΠΛΕ ΤΜΗΜΑ: κάτω, πατάει στη βάση */}
                    <polygon points={`${pt(P.r3_0)} ${pt(P.r3_1)} 68.5,114`} fill="#0284c7" />

                    {/* 4. ΜΩΒ ΤΜΗΜΑ: δίπλα στο μπλε μέχρι τον κεντρικό κόμβο */}
                    <polygon points={`${pt(P.r3_1)} ${pt(P.r2_1)} 68.5,114`} fill="#9333ea" />

                    {renderGridLines()}

                    {/* 2 διαγώνιες */}
                    <line x1={P.r3_0[0]} y1={P.r3_0[1]} x2={P.r1_1[0]} y2={P.r1_1[1]} stroke="#0f172a" strokeWidth="2.2" />
                    <line x1={P.r3_0[0]} y1={P.r3_0[1]} x2={P.r2_2[0]} y2={P.r2_2[1]} stroke="#0f172a" strokeWidth="2.2" />

                    {renderNodes()}
                  </svg>
                  <span className="text-[10px] font-bold text-blue-700 mt-1">4 χρωματιστά κομμάτια</span>
                </div>

                {/* 3ο ΣΧΗΜΑ: ΑΝΑΣΥΝΘΕΣΗ ΣΕ 4 ΟΛΟΚΛΗΡΩΜΕΝΑ ΤΡΙΓΩΝΑ */}
                <div className="flex flex-col items-center bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-300">
                  <span className="font-bold text-emerald-900 text-[11px] mb-1">
                    3. 4 Πλήρη Τρίγωνα
                  </span>
                  <svg width="150" height="145" viewBox="0 0 160 145" className="select-none font-sans">
                    <polygon points={`${pt(P.top)} ${pt(P.r3_0)} ${pt(P.r3_3)}`} fill="#ffffff" stroke="#1e293b" strokeWidth="2.2" />

                    {/* Τα 4 πλήρη ισόπλευρα τρίγωνα χρωματισμένα γκρι */}
                    {/* 1ο Τρίγωνο: Επίπεδο 2, αριστερά */}
                    <polygon points={`${pt(P.r1_0)} ${pt(P.r2_0)} ${pt(P.r2_1)}`} fill="#64748b" />
                    {/* 2ο Τρίγωνο: Επίπεδο 2, κέντρο (δείχνει προς τα κάτω) */}
                    <polygon points={`${pt(P.r1_0)} ${pt(P.r1_1)} ${pt(P.r2_1)}`} fill="#64748b" />
                    {/* 3ο Τρίγωνο: Επίπεδο 3, κέντρο (δείχνει προς τα πάνω) */}
                    <polygon points={`${pt(P.r2_1)} ${pt(P.r3_1)} ${pt(P.r3_2)}`} fill="#64748b" />
                    {/* 4ο Τρίγωνο: Επίπεδο 3, δεξιά αναστραμμένο (δείχνει προς τα κάτω) */}
                    <polygon points={`${pt(P.r2_1)} ${pt(P.r2_2)} ${pt(P.r3_2)}`} fill="#64748b" />

                    {renderGridLines()}
                    {renderNodes()}

                    {/* Αρίθμηση 1, 2, 3, 4 μέσα στα τρίγωνα */}
                    <text x="57" y="84" fontSize="11" fontWeight="black" textAnchor="middle" fill="#ffffff">1</text>
                    <text x="80" y="68" fontSize="11" fontWeight="black" textAnchor="middle" fill="#ffffff">2</text>
                    <text x="80" y="122" fontSize="11" fontWeight="black" textAnchor="middle" fill="#ffffff">3</text>
                    <text x="103" y="106" fontSize="11" fontWeight="black" textAnchor="middle" fill="#ffffff">4</text>
                  </svg>
                  <span className="text-[10px] font-bold text-emerald-800 mt-1">4 από τα 9 τρίγωνα (4/9)</span>
                </div>
              </div>
            );
          })()}
        </div>

        {/* ΑΝΑΛΥΤΙΚΗ ΜΑΘΗΜΑΤΙΚΗ ΕΠΕΞΗΓΗΣΗ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-2.5">
          <p className="text-slate-800">
            Μετακινώντας κατάλληλα τα 4 χρωματιστά κομμάτια του 2ου σχήματος:
          </p>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
            <div>• Το <strong>κόκκινο</strong> και το <strong>πράσινο</strong> κομμάτι συμπληρώνουν το 1ο τρίγωνο.</div>
            <div>• Το <strong>μπλε</strong> και το <strong>μωβ</strong> κομμάτι συμπληρώνουν το κενό του 4ου (ανεστραμμένου) τριγώνου.</div>
            <div className="pt-1 text-slate-700 font-sans font-medium">
              Στο 3ο σχήμα φαίνεται καθαρά ότι το συνολικό εμβαδόν του χρωματισμένου μέρους ισοδυναμεί ακριβώς με <strong>4 ολόκληρα μικρά ισόπλευρα τρίγωνα</strong>.
            </div>
          </div>

          <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 font-mono text-slate-900 space-y-1.5">
            <div>• Εμβαδόν χρωματισμένου μέρους ＝ <strong>4</strong></div>
            <div>• Συνολικό εμβαδόν μεγάλου τριγώνου ＝ <strong>9</strong></div>
            <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-emerald-200">
              <span>Ζητούμενο κλάσμα ＝</span>
              <strong className="text-emerald-700 text-base"><Fraction num="4" den="9" /></strong>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, το χρωματισμένο μέρος είναι τα <strong><Fraction num="4" den="9" /></strong> του μεγάλου τριγώνου (Επιλογή <strong>Γ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 17,
    officialNumber: 37,
    group: 'ΟΜΑΔΑ Β (5 Επιλογες)',
    promptText: 'Σε ένα Δημοτικό σχολείο φοιτούν 285 μαθητές. Αν οι 138 φοιτούν σε μεγαλύτερη τάξη από τη Γ΄ (Δ΄, Ε΄, ΣΤ΄), ενώ οι 189 φοιτούν σε μικρότερη τάξη από την Ε΄ (Α΄, Β΄, Γ΄, Δ΄), πόσοι μαθητές φοιτούν στη Δ΄ τάξη;',
    options: [
      { key: 'A', label: '39', raw: '39' },
      { key: 'B', label: '42', raw: '42' },
      { key: 'Γ', label: '45', raw: '45' },
      { key: 'Δ', label: '46', raw: '46' },
      { key: 'E', label: '80', raw: '80' }
    ],
    correctRaw: '42',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Αναλύουμε το σύνολο των μαθητών του σχολείου ανά ομάδες τάξεων, παρατηρώντας ότι η <strong>Δ΄ τάξη</strong> αποτελεί την κοινή τομή των δύο δοσμένων ομάδων.
        </p>

        {/* SVG ΣΧΗΜΑ ΚΑΤΑΝΟΜΗΣ ΤΑΞΕΩΝ & ΕΠΙΚΑΛΥΨΗΣ ΤΗΣ Δ' ΤΑΞΗΣ */}
        <div className="flex justify-center p-3 bg-white/90 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="460" height="215" viewBox="0 0 460 215" className="select-none font-sans mx-auto block">
            {/* 1. ΑΝΩ ΑΓΚΥΛΗ: ΣΥΝΟΛΟ ΟΛΩΝ ΤΩΝ ΜΑΘΗΤΩΝ (285) */}
            <g transform="translate(20, 10)">
              <rect x="0" y="0" width="420" height="24" rx="12" fill="#0f172a" />
              <text x="210" y="16" fontSize="11.5" fontWeight="bold" textAnchor="middle" fill="#ffffff">
                Σύνολο Σχολείου: 285 Μαθητές (Α΄ έως ΣΤ΄)
              </text>
            </g>

            {/* 2. ΟΙ 6 ΤΑΞΕΙΣ ΣΕ ΣΕΙΡΑ */}
            <g transform="translate(20, 50)">
              {/* Α, Β, Γ (Μπλε πλαίσιο) */}
              <g transform="translate(0, 0)">
                <rect x="0" y="0" width="180" height="55" rx="10" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.8" />
                <text x="90" y="24" fontSize="12" fontWeight="black" textAnchor="middle" fill="#1d4ed8">Α΄, Β΄, Γ΄</text>
                <text x="90" y="42" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#2563eb">147 μαθητές</text>
              </g>

              {/* Δ (Επικάλυψη - Πορτοκαλί / Έντονο πλαίσιο) */}
              <g transform="translate(188, 0)">
                <rect x="0" y="0" width="70" height="55" rx="10" fill="#fff7ed" stroke="#ea580c" strokeWidth="2.5" />
                <text x="35" y="24" fontSize="13" fontWeight="black" textAnchor="middle" fill="#c2410c">Δ΄</text>
                <text x="35" y="43" fontSize="12" fontWeight="black" textAnchor="middle" fill="#ea580c">42</text>
              </g>

              {/* Ε, ΣΤ (Πράσινο πλαίσιο) */}
              <g transform="translate(266, 0)">
                <rect x="0" y="0" width="154" height="55" rx="10" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1.8" />
                <text x="77" y="24" fontSize="12" fontWeight="black" textAnchor="middle" fill="#15803d">Ε΄, ΣΤ΄</text>
                <text x="77" y="42" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#16a34a">96 μαθητές</text>
              </g>
            </g>

            {/* 3. ΚΑΤΩ ΕΝΔΕΙΞΕΙΣ: ΟΙ ΔΥΟ ΔΟΣΜΕΝΕΣ ΟΜΑΔΕΣ ΤΑΞΕΩΝ */}
            <g transform="translate(20, 120)">
              {/* Ομάδα 1: Α΄, Β΄, Γ΄, Δ΄ (189 μαθητές) */}
              <g transform="translate(0, 0)">
                <path d="M 0 10 L 0 0 L 258 0 L 258 10" fill="none" stroke="#2563eb" strokeWidth="2" />
                <rect x="29" y="16" width="200" height="24" rx="8" fill="#dbeafe" stroke="#bfdbfe" strokeWidth="1" />
                <text x="129" y="32" fontSize="10.5" fontWeight="black" textAnchor="middle" fill="#1e40af">
                  Τάξεις Α΄, Β΄, Γ΄, Δ΄ ＝ 189
                </text>
              </g>

              {/* Ομάδα 2: Δ΄, Ε΄, ΣΤ΄ (138 μαθητές) */}
              <g transform="translate(188, 48)">
                <path d="M 0 10 L 0 0 L 232 0 L 232 10" fill="none" stroke="#16a34a" strokeWidth="2" />
                <rect x="26" y="16" width="180" height="24" rx="8" fill="#dcfce7" stroke="#bbf7d0" strokeWidth="1" />
                <text x="116" y="32" fontSize="10.5" fontWeight="black" textAnchor="middle" fill="#166534">
                  Τάξεις Δ΄, Ε΄, ΣΤ΄ ＝ 138
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
              🔷 1ος Τρόπος (Υπολογισμός μέσω των τάξεων Ε΄ και ΣΤ΄)
            </div>
            <p className="text-slate-700">
              Οι μαθητές των τάξεων Ε΄ και ΣΤ΄ προκύπτουν αν αφαιρέσουμε από το σύνολο του σχολείου τους μαθητές των τάξεων Α΄, Β΄, Γ΄ και Δ΄:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
              <div>Μαθητές (Ε΄ ＋ ΣΤ΄) ＝ 285 － 189 ＝ <strong>96 μαθητές</strong></div>
              <div className="pt-1 border-t border-slate-200">
                Οι τάξεις Δ΄, Ε΄ και ΣΤ΄ έχουν συνολικά 138 μαθητές. Αφαιρούμε τους 96 μαθητές των Ε΄ και ΣΤ΄:
              </div>
              <div className="pt-0.5">
                Μαθητές Δ΄ τάξης ＝ 138 － 96 ＝ <strong className="text-emerald-700 text-base">42 μαθητές</strong>
              </div>
            </div>
          </div>

          {/* 2ος Τρόπος */}
          <div className="space-y-1.5 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-blue-900 border-b border-slate-200 pb-1">
              🔷 2ος Τρόπος (Υπολογισμός μέσω των τάξεων Α΄, Β΄ και Γ΄)
            </div>
            <p className="text-slate-700">
              Οι μαθητές των τάξεων Α΄, Β΄ και Γ΄ προκύπτουν αν αφαιρέσουμε από το σύνολο του σχολείου τους μαθητές των τάξεων Δ΄, Ε΄ και ΣΤ΄:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
              <div>Μαθητές (Α΄ ＋ Β΄ ＋ Γ΄) ＝ 285 － 138 ＝ <strong>147 μαθητές</strong></div>
              <div className="pt-1 border-t border-slate-200">
                Οι τάξεις Α΄, Β΄, Γ΄ και Δ΄ έχουν συνολικά 189 μαθητές. Αφαιρούμε τους 147 μαθητές των Α΄, Β΄ και Γ΄:
              </div>
              <div className="pt-0.5">
                Μαθητές Δ΄ τάξης ＝ 189 － 147 ＝ <strong className="text-emerald-700 text-base">42 μαθητές</strong>
              </div>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, στη Δ΄ τάξη φοιτούν <strong>42 μαθητές</strong> (Επιλογή <strong>B</strong>).
        </p>
      </div>
    )
  },
  {
    id: 18,
    officialNumber: 38,
    group: 'ΟΜΑΔΑ Β (5 Επιλογες)',
    promptText: 'Το πλήρωμα ενός πλοίου έχει τρόφιμα για 6 ημέρες. Αν το πλήρωμα είχε 10 μέλη λιγότερα, θα είχε τρόφιμα για 8 ημέρες. Πόσα είναι τα μέλη του πληρώματος;',
    options: [
      { key: 'A', label: '30', raw: '30' },
      { key: 'B', label: '40', raw: '40' },
      { key: 'Γ', label: '50', raw: '50' },
      { key: 'Δ', label: '60', raw: '60' },
      { key: 'E', label: '80', raw: '80' }
    ],
    correctRaw: '40',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Η ποσότητα των τροφίμων παραμένει σταθερή. Τα μεγέθη <strong>πλήθος μελών</strong> και <strong>ημέρες επάρκειας τροφίμων</strong> είναι <strong>αντιστρόφως ανάλογα</strong>, επειδή λιγότερα μέλη καταναλώνουν τα ίδια τρόφιμα σε περισσότερες ημέρες.
        </p>

        {/* SVG ΣΧΗΜΑ: ΣΥΓΚΡΙΣΗ ΣΤΑΘΕΡΗΣ ΠΟΣΟΤΗΤΑΣ ΤΡΟΦΙΜΩΝ (ΜΕΡΙΔΕΣ) */}
        <div className="flex justify-center p-3 bg-white/90 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="490" height="180" viewBox="0 0 490 180" className="select-none font-sans mx-auto block">
            {/* 1. ΑΡΧΙΚΟ ΠΛΗΡΩΜΑ (ΑΡΙΣΤΕΡΑ: x: 10 έως 215) */}
            <g transform="translate(10, 15)">
              <rect x="0" y="0" width="205" height="150" rx="14" fill="#f8fafc" stroke="#3b82f6" strokeWidth="2" />
              <text x="102.5" y="26" fontSize="12" fontWeight="black" textAnchor="middle" fill="#1d4ed8">
                Αρχικό Πλήρωμα
              </text>
              <g transform="translate(16, 42)">
                <text x="0" y="16" fontSize="11" fontWeight="bold" fill="#0f172a">👤 Μέλη: <tspan fill="#2563eb" fontFamily="monospace">x</tspan></text>
                <text x="0" y="38" fontSize="11" fontWeight="bold" fill="#0f172a">📅 Ημέρες: <tspan fill="#2563eb" fontFamily="monospace">6</tspan></text>
                <rect x="0" y="55" width="173" height="38" rx="8" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1" />
                <text x="86.5" y="79" fontSize="11" fontWeight="black" textAnchor="middle" fill="#1e40af" fontFamily="monospace">
                  Τρόφιμα ＝ 6 · x
                </text>
              </g>
            </g>

            {/* ΚΕΝΤΡΙΚΟΣ ΣΥΝΔΕΣΜΟΣ ΙΣΟΤΗΤΑΣ (x: 245) - ΜΕ ΑΠΟΣΤΑΣΗ ΑΠΟ ΤΑ ΠΛΑΙΣΙΑ */}
            <g transform="translate(245, 90)">
              <circle cx="0" cy="-6" r="16" fill="#10b981" />
              <text x="0" y="0" fontSize="18" fontWeight="black" textAnchor="middle" fill="#ffffff">＝</text>
              <text x="0" y="26" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#047857">
                Ίδια Τρόφιμα
              </text>
            </g>

            {/* 2. ΜΕΙΩΜΕΝΟ ΠΛΗΡΩΜΑ (ΔΕΞΙΑ: x: 275 έως 480) */}
            <g transform="translate(275, 15)">
              <rect x="0" y="0" width="205" height="150" rx="14" fill="#f8fafc" stroke="#10b981" strokeWidth="2" />
              <text x="102.5" y="26" fontSize="12" fontWeight="black" textAnchor="middle" fill="#047857">
                Μειωμένο Πλήρωμα
              </text>
              <g transform="translate(16, 42)">
                <text x="0" y="16" fontSize="11" fontWeight="bold" fill="#0f172a">👤 Μέλη: <tspan fill="#059669" fontFamily="monospace">x － 10</tspan></text>
                <text x="0" y="38" fontSize="11" fontWeight="bold" fill="#0f172a">📅 Ημέρες: <tspan fill="#059669" fontFamily="monospace">8</tspan></text>
                <rect x="0" y="55" width="173" height="38" rx="8" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="1" />
                <text x="86.5" y="79" fontSize="11" fontWeight="black" textAnchor="middle" fill="#065f46" fontFamily="monospace">
                  Τρόφιμα ＝ 8 · (x － 10)
                </text>
              </g>
            </g>
          </svg>
        </div>

        {/* ΑΝΑΛΥΤΙΚΗ ΕΠΙΛΥΣΗ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-3">
          {/* Βήμα 1: Σχέση Αντιστρόφως Αναλόγων */}
          <div className="space-y-1">
            <div className="font-sans font-bold text-slate-900 border-b border-slate-200 pb-1">
              1. Εξίσωση σταθερού γινομένου (αντιστρόφως ανάλογα ποσά):
            </div>
            <p className="text-slate-700">
              Στα αντιστρόφως ανάλογα ποσά το <strong>γινόμενο</strong> των τιμών τους παραμένει σταθερό και ισούται με τις συνολικές «ημερήσιες μερίδες» φαγητού:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 font-bold text-center">
              (Μέλη) · (Ημέρες) ＝ Σταθερό
            </div>
          </div>

          {/* Βήμα 2: Αλγεβρική Επίλυση */}
          <div className="space-y-1 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-slate-900">
              2. Επίλυση της εξίσωσης:
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
              <div>6 · x ＝ 8 · (x － 10)</div>
              <div>6x ＝ 8x － 80</div>
              <div className="text-slate-500 font-sans text-xs">// Μεταφέρουμε τους αγνώστους στο ένα μέλος:</div>
              <div>80 ＝ 8x － 6x</div>
              <div>2x ＝ 80</div>
              <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                <span>x ＝</span>
                <Fraction num="80" den="2" />
                <span>➔ <strong className="text-emerald-700 text-base">x ＝ 40 μέλη</strong></span>
              </div>
            </div>
          </div>

          {/* Βήμα 3: Επαλήθευση */}
          <div className="space-y-1 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-slate-900">
              3. Επαλήθευση:
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
              <div>• 40 μέλη για 6 ημέρες ➔ 40 · 6 ＝ <strong>240 μερίδες</strong></div>
              <div>• 40 － 10 ＝ 30 μέλη για 8 ημέρες ➔ 30 · 8 ＝ <strong>240 μερίδες</strong> (επαληθεύεται)</div>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, τα μέλη του πληρώματος είναι <strong>40</strong> (Επιλογή <strong>B</strong>).
        </p>
      </div>
    )
  },
  {
    id: 19,
    officialNumber: 39,
    group: 'ΟΜΑΔΑ Β (5 Επιλογες)',
    promptText: 'Σε μια ταβέρνα κάθισαν 4 οικογένειες (δύο γονείς με τα παιδιά τους). Οι δύο οικογένειες είχαν από δύο παιδιά, μία οικογένεια είχε τρία παιδιά και άλλη μία είχε μόνο ένα παιδί. Στην αρχή σκέφτηκαν να πληρώσουν τον λογαριασμό ανάλογα με τα άτομα. Όμως τελικά συμφώνησαν να πληρώσει κάθε οικογένεια το 1/4 του λογαριασμού. Πόσο % λιγότερο πλήρωσε η οικογένεια με τα τρία παιδιά σε σχέση με την αρχική της υποχρέωση;',
    options: [
      { key: 'A', label: '25%', raw: '25' },
      { key: 'B', label: '20%', raw: '20' },
      { key: 'Γ', label: '16%', raw: '16' },
      { key: 'Δ', label: '6,25%', raw: '6.25' },
      { key: 'E', label: 'Περισσότερο από 25%', raw: 'more' }
    ],
    correctRaw: '20',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Καταγράφουμε τα άτομα κάθε οικογένειας (2 γονείς ＋ τα παιδιά τους) για να βρούμε το σύνολο των ατόμων:
        </p>

        {/* SVG ΣΧΗΜΑ: ΣΥΝΟΛΟ ΑΤΟΜΩΝ & ΣΥΓΚΡΙΣΗ ΜΕΡΙΔΙΟΥ ΤΗΣ ΠΟΛΥΤΕΚΝΗΣ ΟΙΚΟΓΕΝΕΙΑΣ */}
        <div className="flex justify-center p-3 bg-white/90 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="470" height="210" viewBox="0 0 470 210" className="select-none font-sans mx-auto block">
            {/* 1. ΟΙ 4 ΟΙΚΟΓΕΝΕΙΕΣ ΣΤΟ ΤΡΑΠΕΖΙ */}
            <g transform="translate(15, 10)">
              <text x="220" y="14" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#0f172a">
                Συνολικά Άτομα: 4 ＋ 4 ＋ 5 ＋ 3 ＝ 16 άτομα
              </text>

              {/* 4 κάρτες οικογενειών */}
              <g transform="translate(0, 26)">
                {/* Οικογένεια 1 (2 παιδιά -> 4 άτομα) */}
                <rect x="0" y="0" width="100" height="60" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
                <text x="50" y="18" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#64748b">1η Οικογένεια</text>
                <text x="50" y="36" fontSize="13" fontWeight="900" textAnchor="middle" fill="#0f172a">4 άτομα</text>
                <text x="50" y="50" fontSize="9.5" textAnchor="middle" fill="#64748b">2 γονείς + 2 π.</text>

                {/* Οικογένεια 2 (2 παιδιά -> 4 άτομα) */}
                <rect x="112" y="0" width="100" height="60" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
                <text x="162" y="18" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#64748b">2η Οικογένεια</text>
                <text x="162" y="36" fontSize="13" fontWeight="900" textAnchor="middle" fill="#0f172a">4 άτομα</text>
                <text x="162" y="50" fontSize="9.5" textAnchor="middle" fill="#64748b">2 γονείς + 2 π.</text>

                {/* Οικογένεια 3 (3 παιδιά -> 5 άτομα - ΕΠΙΚΕΝΤΡΟ) */}
                <rect x="224" y="0" width="112" height="60" rx="8" fill="#eff6ff" stroke="#2563eb" strokeWidth="2.2" />
                <text x="280" y="18" fontSize="10.5" fontWeight="black" textAnchor="middle" fill="#1d4ed8">3η Οικογένεια ⭐</text>
                <text x="280" y="36" fontSize="14" fontWeight="black" textAnchor="middle" fill="#1e40af">5 άτομα</text>
                <text x="280" y="50" fontSize="9.5" fontWeight="bold" textAnchor="middle" fill="#2563eb">2 γονείς + 3 π.</text>

                {/* Οικογένεια 4 (1 παιδί -> 3 άτομα) */}
                <rect x="348" y="0" width="92" height="60" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
                <text x="394" y="18" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#64748b">4η Οικογένεια</text>
                <text x="394" y="36" fontSize="13" fontWeight="900" textAnchor="middle" fill="#0f172a">3 άτομα</text>
                <text x="394" y="50" fontSize="9.5" textAnchor="middle" fill="#64748b">2 γονείς + 1 π.</text>
              </g>
            </g>

            {/* 2. ΣΥΓΚΡΙΣΗ ΠΛΗΡΩΜΗΣ ΤΗΣ 3ης ΟΙΚΟΓΕΝΕΙΑΣ (16ατα) */}
            <g transform="translate(25, 110)">
              {/* Αρχική Υποχρέωση (5/16) */}
              <g transform="translate(0, 0)">
                <text x="0" y="14" fontSize="11" fontWeight="bold" fill="#0f172a">
                  Αρχική υποχρέωση (ανά άτομο): <tspan fill="#2563eb" fontWeight="900">5 / 16</tspan>
                </text>
                {/* 16 τμήματα μπάρας */}
                <g transform="translate(0, 22)">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <rect
                      key={`init-${i}`}
                      x={i * 26}
                      y={0}
                      width={22}
                      height={18}
                      rx={3}
                      fill={i < 5 ? '#3b82f6' : '#e2e8f0'}
                    />
                  ))}
                  <text x="65" y="13" fontSize="9.5" fontWeight="black" textAnchor="middle" fill="#ffffff">5 μερίδια</text>
                </g>
              </g>

              {/* Τελική Πληρωμή (1/4 = 4/16) */}
              <g transform="translate(0, 48)">
                <text x="0" y="14" fontSize="11" fontWeight="bold" fill="#0f172a">
                  Τελική πληρωμή (ισόποσα 1/4): <tspan fill="#16a34a" fontWeight="900">4 / 16</tspan>
                  <tspan fill="#dc2626" fontSize="10" fontWeight="bold"> (μείωση: 1 μερίδιο από τα 5)</tspan>
                </text>
                {/* 16 τμήματα μπάρας */}
                <g transform="translate(0, 22)">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <rect
                      key={`final-${i}`}
                      x={i * 26}
                      y={0}
                      width={22}
                      height={18}
                      rx={3}
                      fill={i < 4 ? '#22c55e' : i === 4 ? '#fee2e2' : '#e2e8f0'}
                      stroke={i === 4 ? '#ef4444' : 'none'}
                      strokeDasharray={i === 4 ? '2 2' : 'none'}
                    />
                  ))}
                  <text x="52" y="13" fontSize="9.5" fontWeight="black" textAnchor="middle" fill="#ffffff">4 μερίδια</text>
                  <text x="117" y="13" fontSize="8.5" fontWeight="black" textAnchor="middle" fill="#dc2626">－1</text>
                </g>
              </g>
            </g>
          </svg>
        </div>

        {/* ΑΝΑΛΥΤΙΚΑ ΒΗΜΑΤΑ ΕΠΙΛΥΣΗΣ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-3">
          {/* Βήμα 1: Καταμέτρηση ατόμων */}
          <div className="space-y-1">
            <div className="font-sans font-bold text-slate-900">
              1. Καταμέτρηση των ατόμων:
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
              <div>• 2 οικογένειες με 2 παιδιά: 2 · (2 ＋ 2) ＝ <strong>8 άτομα</strong></div>
              <div>• 1 οικογένεια με 3 παιδιά: 2 ＋ 3 ＝ <strong>5 άτομα</strong></div>
              <div>• 1 οικογένεια με 1 παιδί: 2 ＋ 1 ＝ <strong>3 άτομα</strong></div>
              <div className="pt-1 border-t border-slate-200 font-bold text-slate-950">
                Συνολικά άτομα ＝ 8 ＋ 5 ＋ 3 ＝ 16 άτομα
              </div>
            </div>
          </div>

          {/* Βήμα 2: Αρχική vs Τελική Πληρωμή */}
          <div className="space-y-1 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-slate-900">
              2. Μερίδιο της οικογένειας με τα 3 παιδιά:
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>• <strong>Αρχική υποχρέωση</strong> (ανάλογα με τα άτομα):</span>
                <strong className="text-blue-700"><Fraction num="5" den="16" /></strong>
                <span>του λογαριασμού.</span>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <span>• <strong>Τελική πληρωμή</strong> (ισόποσα στις 4 οικογένειες):</span>
                <Fraction num="1" den="4" />
                <span>＝</span>
                <strong className="text-emerald-700"><Fraction num="4" den="16" /></strong>
                <span>του λογαριασμού.</span>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-200">
                <span>• <strong>Διαφορά (μείωση ποσού)</strong> ＝</span>
                <Fraction num="5" den="16" />
                <span>－</span>
                <Fraction num="4" den="16" />
                <span>＝</span>
                <strong className="text-rose-700"><Fraction num="1" den="16" /></strong>
                <span>του λογαριασμού.</span>
              </div>
            </div>
          </div>

          {/* Βήμα 3: Υπολογισμός Ποσοστού Μείωσης */}
          <div className="space-y-1 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-slate-900">
              3. Υπολογισμός ποσοστού μείωσης ως προς την αρχική υποχρέωση:
            </div>
            <p className="text-slate-700">
              Διαιρούμε τη μείωση με την <strong>αρχική υποχρέωση</strong> της οικογένειας (και όχι με το σύνολο του λογαριασμού):
            </p>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span>Ποσοστό Μείωσης ＝</span>
                <Fraction num="Μείωση" den="Αρχική Υποχρέωση" />
                <span>＝</span>
                <Fraction
                  num={<Fraction num="1" den="16" />}
                  den={<Fraction num="5" den="16" />}
                />
                <span>＝</span>
                <strong className="text-emerald-700 text-base"><Fraction num="1" den="5" /></strong>
              </div>

              <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-slate-200">
                <span>Μετατροπή σε ποσοστό στα 100:</span>
                <Fraction num="1" den="5" />
                <span>＝</span>
                <Fraction num="20" den="100" />
                <span>＝</span>
                <strong className="text-emerald-700 text-base">20%</strong>
              </div>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, η οικογένεια με τα τρία παιδιά πλήρωσε <strong>20%</strong> λιγότερο σε σχέση με την αρχική της υποχρέωση (Επιλογή <strong>B</strong>).
        </p>
      </div>
    )
  },
 {
    id: 20,
    officialNumber: 40,
    group: 'ΟΜΑΔΑ Β (5 Επιλογες)',
    promptText: 'Ένα άσπρο ποδήλατο διανύει μια απόσταση 48 χλμ. με ταχύτητα 24 χλμ./ώρα και επιστρέφει με την ίδια ταχύτητα. Ένα μαύρο ποδήλατο ξεκινάει ταυτόχρονα με το άσπρο και διανύει την ίδια διαδρομή με ταχύτητα 30 χλμ./ώρα, αλλά επιστρέφει με 18 χλμ./ώρα. Ποιο από τα δύο θα επιστρέψει πρώτο και πόσο απέχει το επόμενο τη στιγμή του τερματισμού;',
    options: [
      { key: 'A', label: 'Θα φτάσουν ταυτόχρονα', raw: 'same' },
      { key: 'B', label: 'Το μαύρο θα φτάσει πρώτο και απέχει 4,8 χλμ. από το άσπρο.', raw: 'black4.8' },
      { key: 'Γ', label: 'Το μαύρο θα φτάσει πρώτο και απέχει 2,4 χλμ. από το άσπρο.', raw: 'black2.4' },
      { key: 'Δ', label: 'Το άσπρο θα φτάσει πρώτο και απέχει 2,4 χλμ. από το μαύρο.', raw: 'white2.4' },
      { key: 'E', label: 'Το άσπρο θα φτάσει πρώτο και απέχει 4,8 χλμ. από το μαύρο.', raw: 'white4.8' }
    ],
    correctRaw: 'white4.8',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Αναλύουμε τη διαδρομή (μετάβαση και επιστροφή, απόσταση <strong>48 χλμ.</strong> ανά κατεύθυνση) για κάθε ποδήλατο:
        </p>

        {/* SVG ΣΧΗΜΑ: ΣΥΓΚΡΙΣΗ ΔΙΑΔΡΟΜΩΝ & ΣΤΙΓΜΙΟΤΥΠΟ ΤΕΡΜΑΤΙΣΜΟΥ ΣΤΙΣ 4 ΩΡΕΣ */}
        <div className="flex justify-center p-3 bg-white/90 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="510" height="245" viewBox="0 0 510 245" className="select-none font-sans mx-auto block">
            <defs>
              <marker id="arrow-white" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#0284c7" />
              </marker>
              <marker id="arrow-black" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#0f172a" />
              </marker>
            </defs>

            {/* ΚΑΘΕΤΕΣ ΔΙΑΚΕΚΟΜΜΕΝΕΣ ΓΡΑΜΜΕΣ ΑΦΕΤΗΡΙΑΣ & ΑΝΑΣΤΡΟΦΗΣ (ΜΕ ΑΡΚΕΤΟ ΠΕΡΙΘΩΡΙΟ ΑΡΙΣΤΕΡΑ) */}
            <line x1="75" y1="36" x2="75" y2="230" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="435" y1="36" x2="435" y2="230" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* ΕΠΙΚΕΦΑΛΙΔΕΣ ΣΕ 2 ΓΡΑΜΜΕΣ ΜΕ ΑΝΕΣΗ ΧΩΡΟΥ */}
            <g transform="translate(75, 14)">
              <text x="0" y="0" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#0f172a">Αφετηρία / Τερματισμός</text>
              <text x="0" y="14" fontSize="10" fontWeight="black" textAnchor="middle" fill="#64748b">(0 χλμ.)</text>
            </g>

            <g transform="translate(435, 14)">
              <text x="0" y="0" fontSize="10.5" fontWeight="bold" textAnchor="middle" fill="#0f172a">Αναστροφή</text>
              <text x="0" y="14" fontSize="10" fontWeight="black" textAnchor="middle" fill="#64748b">(48 χλμ.)</text>
            </g>

            {/* 1. ΑΣΠΡΟ ΠΟΔΗΛΑΤΟ (ΣΥΝΟΛΟ 4 ΩΡΕΣ - ΤΕΡΜΑΤΙΣΜΟΣ) */}
            <g transform="translate(0, 42)">
              <rect x="15" y="0" width="480" height="74" rx="10" fill="#f0f9ff" stroke="#bae6fd" strokeWidth="1.5" />
              <text x="25" y="18" fontSize="11" fontWeight="bold" fill="#0369a1">🚲 Άσπρο Ποδήλατο (Συνολικός Χρόνος: 4 ώρες)</text>
              
              {/* Μετάβαση */}
              <line x1="75" y1="35" x2="430" y2="35" stroke="#0284c7" strokeWidth="2.2" markerEnd="url(#arrow-white)" />
              <text x="255" y="31" fontSize="9.5" fontWeight="bold" textAnchor="middle" fill="#0284c7">Μετάβαση: 24 χλμ./ω (2 ώρες)</text>

              {/* Επιστροφή */}
              <line x1="430" y1="55" x2="75" y2="55" stroke="#0284c7" strokeWidth="2.2" markerStart="url(#arrow-white)" />
              <text x="255" y="51" fontSize="9.5" fontWeight="bold" textAnchor="middle" fill="#0284c7">Επιστροφή: 24 χλμ./ω (2 ώρες)</text>
              <circle cx="75" cy="55" r="5" fill="#16a34a" />
              <text x="84" y="67" fontSize="9" fontWeight="black" fill="#16a34a">Τερμάτισε!</text>
            </g>

            {/* 2. ΜΑΥΡΟ ΠΟΔΗΛΑΤΟ (ΣΤΙΣ 4 ΩΡΕΣ ΥΠΟΛΕΙΠΟΝΤΑΙ 4,8 χλμ.) */}
            <g transform="translate(0, 130)">
              <rect x="15" y="0" width="480" height="96" rx="10" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
              <text x="25" y="18" fontSize="11" fontWeight="bold" fill="#0f172a">🚲 Μαύρο Ποδήλατο (Θέση στις 4 ώρες)</text>

              {/* Μετάβαση */}
              <line x1="75" y1="35" x2="430" y2="35" stroke="#0f172a" strokeWidth="2.2" markerEnd="url(#arrow-black)" />
              <text x="255" y="31" fontSize="9.5" fontWeight="bold" textAnchor="middle" fill="#0f172a">Μετάβαση: 30 χλμ./ω (1,6 ώρες ＝ 1 ω. 36 λ.)</text>

              {/* Επιστροφή (Διανύει 43,2 χλμ., υπολείπονται 4,8 χλμ. -> x = 75 + 36 = 111) */}
              <line x1="430" y1="57" x2="111" y2="57" stroke="#475569" strokeWidth="2.2" markerStart="url(#arrow-black)" />
              <text x="270" y="53" fontSize="9.5" fontWeight="bold" textAnchor="middle" fill="#475569">Επιστροφή: 18 χλμ./ω (κάλυψε 43,2 χλμ. σε 2,4 ώρες)</text>

              {/* Θέση Μαύρου στις 4 ώρες */}
              <circle cx="111" cy="57" r="5.5" fill="#0f172a" />
              <text x="111" y="72" fontSize="9.5" fontWeight="black" textAnchor="middle" fill="#0f172a">Εδώ στις 4 ώρες</text>

              {/* Κενό που υπολείπεται μέχρι τον τερματισμό (4,8 χλμ.) */}
              <line x1="75" y1="81" x2="111" y2="81" stroke="#dc2626" strokeWidth="2.5" />
              <text x="93" y="93" fontSize="10" fontWeight="black" textAnchor="middle" fill="#dc2626">4,8 χλμ.</text>
              <line x1="75" y1="77" x2="75" y2="85" stroke="#dc2626" strokeWidth="2" />
              <line x1="111" y1="77" x2="111" y2="85" stroke="#dc2626" strokeWidth="2" />
            </g>
          </svg>
        </div>

        {/* ΑΝΑΛΥΤΙΚΟΙ ΤΡΟΠΟΙ ΕΠΙΛΥΣΗΣ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-3">
          {/* Χρόνος Άσπρου */}
          <div className="space-y-1">
            <div className="font-sans font-bold text-slate-900 border-b border-slate-200 pb-1">
              1. Συνολικός χρόνος διαδρομής του άσπρου ποδηλάτου:
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>• Μετάβαση ＝</span>
                <Fraction num="48" den="24" />
                <span>＝ 2 ώρες</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>• Επιστροφή ＝</span>
                <Fraction num="48" den="24" />
                <span>＝ 2 ώρες</span>
              </div>
              <div className="pt-1 border-t border-slate-200 font-bold text-blue-700">
                Συνολικός χρόνος άσπρου ＝ 2 ＋ 2 ＝ 4 ώρες (τερματίζει πρώτο)
              </div>
            </div>
          </div>

          {/* 1ος ΤΡΟΠΟΣ */}
          <div className="space-y-1 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-blue-900">
              🔷 1ος Τρόπος (Υπολογισμός απόστασης στις 4 ώρες με δεκαδικούς)
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>• Χρόνος μετάβασης μαύρου ＝</span>
                <Fraction num="48" den="30" />
                <span>＝ <strong>1,6 ώρες</strong></span>
              </div>
              <div>• Υπόλοιπος χρόνος μέχρι τις 4 ώρες που τερματίζει το άσπρο: 4 － 1,6 ＝ <strong>2,4 ώρες</strong></div>
              <div>• Απόσταση που διανύει το μαύρο στην επιστροφή: 2,4 · 18 ＝ <strong>43,2 χλμ.</strong></div>
              <div className="pt-1 border-t border-slate-200 flex items-center gap-1.5 flex-wrap">
                <span>• Απόσταση που του απομένει μέχρι τη γραμμή τερματισμού: 48 － 43,2 ＝</span>
                <strong className="text-emerald-700 text-base">4,8 χλμ.</strong>
              </div>
            </div>
          </div>

          {/* 2ος ΤΡΟΠΟΣ */}
          <div className="space-y-1 pt-1 border-t border-slate-100">
            <div className="font-sans font-bold text-blue-900">
              🔷 2ος Τρόπος (Υπολογισμός με ώρες, λεπτά και διαφορά χρόνου)
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>• Μετάβαση μαύρου:</span>
                <Fraction num="48" den="30" />
                <span>＝ 1</span>
                <Fraction num="18" den="30" />
                <span>ώρα ＝ 1</span>
                <Fraction num="36" den="60" />
                <span>ώρα ➔ <strong>1 ώρα και 36 λεπτά</strong></span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>• Επιστροφή μαύρου:</span>
                <Fraction num="48" den="18" />
                <span>＝ 2</span>
                <Fraction num="12" den="18" />
                <span>＝ 2</span>
                <Fraction num="2" den="3" />
                <span>＝ 2</span>
                <Fraction num="40" den="60" />
                <span>ώρα ➔ <strong>2 ώρες και 40 λεπτά</strong></span>
              </div>
              <div className="pt-1 border-t border-slate-200">
                • Συνολικός χρόνος μαύρου ＝ 1 ω. 36 λ. ＋ 2 ω. 40 λ. ＝ <strong>4 ώρες και 16 λεπτά</strong>
              </div>
              <div className="text-slate-700 font-sans text-xs pt-0.5">
                Όταν το άσπρο τερματίζει (στις 4 ώρες), το μαύρο χρειάζεται ακόμη <strong>16 λεπτά</strong> πορείας με 18 χλμ./ώρα:
              </div>
              <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                <span>Απόσταση που υπολείπεται ＝ 18 ·</span>
                <Fraction num="16" den="60" />
                <span>＝</span>
                <Fraction num="18 · 16" den="60" />
                <span>＝</span>
                <Fraction num="288" den="60" />
                <span>＝</span>
                <strong className="text-emerald-700 text-base">4,8 χλμ.</strong>
              </div>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, <strong>το άσπρο θα φτάσει πρώτο και απέχει 4,8 χλμ. από το μαύρο</strong> (Επιλογή <strong>E</strong>).
        </p>
      </div>
    )
  }
];

const TOTAL_TIME_SECONDS = 60 * 60; // 60 λεπτά

export default function Themata2026Page() {
  const router = useRouter();
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME_SECONDS);
  const [timerEnabled, setTimerEnabled] = useState(true);

  const timerRef = useRef(null);

  useEffect(() => {
    if (router.isReady) {
      const { timer } = router.query;
      setTimerEnabled(timer !== '0');
    }
  }, [router.isReady, router.query]);

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

  const handleSelect = (qId, optionRaw) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: optionRaw }));
  };

  const calculateScore = (currentAnswers) => {
    let s = 0;
    QUESTIONS_2026.forEach((q, index) => {
      if (currentAnswers[q.id] === q.correctRaw) {
        // Τα πρώτα 10 θέματα (index 0-9) παίρνουν 2 μόρια, τα υπόλοιπα 10 (index 10-19) παίρνουν 3 μόρια
        s += index < 10 ? 2 : 3;
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

  // Υπολογισμός συνολικού πλήθους σωστών απαντήσεων
  const correctCount = QUESTIONS_2026.filter(
    q => answers[q.id] === q.correctRaw
  ).length;

  const renderQuestionSvg = (svgType) => {
    if (svgType === 'grid23') {
      return (
        <div className="flex justify-center p-3 bg-slate-50 rounded-2xl border border-slate-200">
          <svg width="180" height="180" viewBox="0 0 160 160" className="select-none">
            <rect x="20" y="20" width="120" height="120" fill="none" stroke="#334155" strokeWidth="2.5" />
            <line x1="80" y1="20" x2="80" y2="140" stroke="#334155" strokeWidth="2.5" />
            <line x1="20" y1="80" x2="140" y2="80" stroke="#334155" strokeWidth="2.5" />
            {[20, 80, 140].map(x => [20, 80, 140].map(y => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="4.5" fill="#0f172a" />
            )))}
            <text x="8" y="152" fill="#0f172a" fontSize="14" fontWeight="bold">Κ</text>
            <text x="146" y="22" fill="#0f172a" fontSize="14" fontWeight="bold">Λ</text>
          </svg>
        </div>
      );
    }

    if (svgType === 'rect24') {
      return (
        <div className="flex justify-center p-3 bg-slate-50 rounded-2xl border border-slate-200">
          <svg width="260" height="145" viewBox="0 0 250 130" className="select-none">
            {/* Ορθογώνιο ΑΒΓΔ */}
            <rect x="25" y="25" width="195" height="75" fill="none" stroke="#1e293b" strokeWidth="2.5" />
            {/* Ευθεία Ε-Γ */}
            <line x1="105" y1="100" x2="220" y2="25" stroke="#1e293b" strokeWidth="2.5" />
            
            {/* Σκιασμένος τομέας που ακουμπά ακριβώς πάνω στην ευθεία Ε-Γ */}
            <path
              d="M 105 100 L 57 100 A 48 48 0 0 1 145.2 73.8 Z"
              fill="#cbd5e1"
              stroke="#334155"
              strokeWidth="1.5"
            />
            <text x="68" y="78" fill="#0f172a" fontSize="13" fontWeight="900" fontFamily="sans-serif">137°</text>

            <circle cx="25" cy="100" r="4" fill="#0f172a" /><text x="14" y="118" fontSize="12" fontWeight="bold">Α</text>
            <circle cx="105" cy="100" r="4" fill="#0f172a" /><text x="101" y="118" fontSize="12" fontWeight="bold">Ε</text>
            <circle cx="220" cy="100" r="4" fill="#0f172a" /><text x="225" y="118" fontSize="12" fontWeight="bold">Β</text>
            <circle cx="220" cy="25" r="4" fill="#0f172a" /><text x="225" y="20" fontSize="12" fontWeight="bold">Γ</text>
            <circle cx="25" cy="25" r="4" fill="#0f172a" /><text x="14" y="20" fontSize="12" fontWeight="bold">Δ</text>
          </svg>
        </div>
      );
    }

    if (svgType === 'pie25') {
      return (
        <div className="space-y-4 p-3 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200">
          {/* Κυκλικό Διάγραμμα */}
          <div className="flex flex-col items-center">
            <svg width="170" height="170" viewBox="0 0 160 160" className="select-none overflow-visible font-sans">
              <defs>
                <pattern id="hatch_diag2" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="6" stroke="#000000" strokeWidth="1.8" />
                </pattern>
              </defs>
              <circle cx="80" cy="80" r="52" fill="#ffffff" stroke="#000000" strokeWidth="2" />
              
              {/* Τομέας Κ (περίπου 90° - 1/4) */}
              <path d="M 80 80 L 80 28 A 52 52 0 0 1 132 80 Z" fill="#000000" />
              
              {/* Τομέας Λ */}
              <path d="M 80 80 L 132 80 A 52 52 0 0 1 64 129.8 Z" fill="url(#hatch_diag2)" stroke="#000000" strokeWidth="1.2" />
              
              {/* Ετικέτες έξω από τον κύκλο */}
              <text x="124" y="42" fill="#000000" fontSize="14" fontWeight="bold">Κ</text>
              <text x="114" y="136" fill="#000000" fontSize="14" fontWeight="bold">Λ</text>
              <text x="14" y="85" fill="#000000" fontSize="14" fontWeight="bold">Μ</text>
            </svg>
          </div>

          {/* 4 Ραβδογράμματα Α, Β, Γ, Δ ακριβώς όπως στην εικόνα */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-200">
            {[
              // A: K=20px, Λ=25px, M=68px (Κ, Λ πολύ μικρά σε σχέση με το Μ)
              { label: 'A', rects: [{x: 20, y: 65, h: 20}, {x: 52, y: 60, h: 25}, {x: 84, y: 17, h: 68}] },
              // B: K=75px, Λ=30px, M=75px (Κ και Μ ίσα και ψηλά)
              { label: 'B', rects: [{x: 20, y: 10, h: 75}, {x: 52, y: 55, h: 30}, {x: 84, y: 10, h: 75}] },
              // Γ: K=42px, Λ=52px, M=75px (Σωστή κλιμάκωση Κ < Λ < Μ)
              { label: 'Γ', rects: [{x: 20, y: 43, h: 42}, {x: 52, y: 33, h: 52}, {x: 84, y: 10, h: 75}] },
              // Δ: K=48px, Λ=38px, M=73px (Κ > Λ - λάθος σειρά)
              { label: 'Δ', rects: [{x: 20, y: 37, h: 48}, {x: 52, y: 47, h: 38}, {x: 84, y: 12, h: 73}] }
            ].map((item) => (
              <div key={item.label} className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col items-center shadow-xs">
                <svg width="120" height="105" viewBox="0 0 120 105" className="select-none font-sans">
                  {/* Άξονας βάσης */}
                  <line x1="8" y1="85" x2="112" y2="85" stroke="#cbd5e1" strokeWidth="1.5" />
                  
                  {/* Στήλες */}
                  {item.rects.map((r, ri) => (
                    <rect key={ri} x={r.x} y={r.y} width="16" height={r.h} fill="#52525b" />
                  ))}
                  
                  {/* Ετικέτες στηλών */}
                  <text x="28" y="99" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0f172a">Κ</text>
                  <text x="60" y="99" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0f172a">Λ</text>
                  <text x="92" y="99" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0f172a">Μ</text>
                </svg>
                <span className="font-bold text-sm mt-1 text-slate-800">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    if (svgType === 'line31') {
      return (
        <div className="flex justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200 overflow-x-auto">
          <svg width="340" height="70" viewBox="0 0 320 70" className="select-none">
            <line x1="20" y1="35" x2="300" y2="35" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
            <circle cx="20" cy="35" r="4.5" fill="#1e3a8a" /><text x="16" y="20" fontSize="11" fontWeight="bold">Κ (5)</text>
            <circle cx="160" cy="35" r="4.5" fill="#0f172a" /><text x="156" y="20" fontSize="11" fontWeight="bold">Μ</text>
            <circle cx="253" cy="35" r="5" fill="#b91c1c" /><text x="249" y="20" fontSize="11" fontWeight="black" fill="#b91c1c">Ν (?)</text>
            <circle cx="300" cy="35" r="4.5" fill="#1e3a8a" /><text x="290" y="20" fontSize="11" fontWeight="bold">Λ (35)</text>
          </svg>
        </div>
      );
    }

    if (svgType === 'triangle36') {
      return (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 p-4 bg-slate-50 rounded-2xl border border-slate-200">
          {/* Αριστερό Σχήμα: 9 ίσα ισόπλευρα τρίγωνα */}
          <div className="flex flex-col items-center">
            <svg width="150" height="135" viewBox="0 0 160 145" className="select-none">
              <polygon points="80,12 10,133 150,133" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
              <line x1="56.6" y1="52.3" x2="103.3" y2="52.3" stroke="#475569" strokeWidth="2" />
              <line x1="33.3" y1="92.6" x2="126.6" y2="92.6" stroke="#475569" strokeWidth="2" />
              <line x1="56.6" y1="52.3" x2="103.3" y2="133" stroke="#475569" strokeWidth="2" />
              <line x1="103.3" y1="52.3" x2="56.6" y2="133" stroke="#475569" strokeWidth="2" />
              <line x1="33.3" y1="92.6" x2="56.6" y2="133" stroke="#475569" strokeWidth="2" />
              <line x1="126.6" y1="92.6" x2="103.3" y2="133" stroke="#475569" strokeWidth="2" />
              {[
                [80, 12],
                [56.6, 52.3], [103.3, 52.3],
                [33.3, 92.6], [80, 92.6], [126.6, 92.6],
                [10, 133], [56.6, 133], [103.3, 133], [150, 133]
              ].map(([cx, cy], idx) => (
                <circle key={idx} cx={cx} cy={cy} r="4.5" fill="#64748b" stroke="#0f172a" strokeWidth="1.5" />
              ))}
            </svg>
          </div>

          {/* Δεξί Σχήμα: Με 2 συμμετρικές διαγώνιες και σωστά σκιασμένα τα 3,5 τρίγωνα */}
          <div className="flex flex-col items-center">
            <svg width="150" height="135" viewBox="0 0 160 145" className="select-none">
              {/* Λευκό φόντο τριγώνου */}
              <polygon points="80,12 10,133 150,133" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />

              {/* 1. Πάνω σκιασμένο τμήμα (πάνω από την πάνω διαγώνιο) */}
              <polygon points="56.6,52.3 103.3,52.3 10,133" fill="#94a3b8" />

              {/* 2. Κάτω σκιασμένο τμήμα (κάτω από την κάτω διαγώνιο) */}
              <polygon points="10,133 103.3,133 126.6,92.6" fill="#94a3b8" />

              {/* Γραμμές βασικού πλέγματος */}
              <line x1="56.6" y1="52.3" x2="103.3" y2="52.3" stroke="#1e293b" strokeWidth="2" />
              <line x1="33.3" y1="92.6" x2="126.6" y2="92.6" stroke="#1e293b" strokeWidth="2" />
              <line x1="56.6" y1="52.3" x2="103.3" y2="133" stroke="#1e293b" strokeWidth="2" />
              <line x1="103.3" y1="52.3" x2="56.6" y2="133" stroke="#1e293b" strokeWidth="2" />
              <line x1="33.3" y1="92.6" x2="56.6" y2="133" stroke="#1e293b" strokeWidth="2" />
              <line x1="126.6" y1="92.6" x2="103.3" y2="133" stroke="#1e293b" strokeWidth="2" />

              {/* ΟΙ 2 ΔΙΑΓΩΝΙΕΣ ΓΡΑΜΜΕΣ ΤΟΥ ΣΧΗΜΑΤΟΣ */}
              <line x1="10" y1="133" x2="103.3" y2="52.3" stroke="#1e293b" strokeWidth="2.5" />
              <line x1="10" y1="133" x2="126.6" y2="92.6" stroke="#1e293b" strokeWidth="2.5" />

              {/* Κόμβοι (κουκκίδες) */}
              {[
                [80, 12],
                [56.6, 52.3], [103.3, 52.3],
                [33.3, 92.6], [80, 92.6], [126.6, 92.6],
                [10, 133], [56.6, 133], [103.3, 133], [150, 133]
              ].map(([cx, cy], idx) => (
                <circle key={idx} cx={cx} cy={cy} r="4.5" fill="#64748b" stroke="#0f172a" strokeWidth="1.5" />
              ))}
            </svg>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <Layout
      title="🏛️ Πραγματικά Θέματα 2026 - Πρότυπα Σχολεία | LearnMaths.gr"
      description="Επίσημα θέματα εξετάσεων εισαγωγής στα Πρότυπα Σχολεία 2026: 20 θέματα, 2 μόρια ανά θέμα τα πρώτα 10, 3 μόρια ανά θέμα τα υπόλοιπα 10 (0-50 μόρια), χρονόμετρο και αναλυτικές λύσεις."
      backUrl="/protipa/pragmatika-themata"
      backText="Πραγματικά Θέματα"
      hideFooter={true}
    >
      <div className="py-6 sm:py-8 space-y-6 pb-28 sm:pb-32">

        {/* HERO BANNER & TIMER HEADER */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-700 rounded-3xl p-5 sm:p-7 text-white shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1.5">
              <span className="inline-block bg-white/20 px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider text-blue-100">
                Επισημα Θεματα 2026 • 20 Ερωτησεις
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
                Εξετάσεις Προτύπων 2026
              </h1>
            </div>

            {timerEnabled && (
              <div className={`px-4 py-2 rounded-2xl font-mono font-black text-base sm:text-lg flex items-center gap-2 shadow-inner self-stretch sm:self-auto justify-center ${
                timeLeft < 300 ? 'bg-rose-500 text-white animate-pulse' : 'bg-white text-blue-950'
              }`}>
                <span>⏱️</span>
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-blue-100 border-t border-white/20 pt-3">
            <span>📝 Απαντημένες: <strong>{answeredCount} / 20</strong></span>
            <span>🎯 Βαθμολογία: <strong>2 μόρια / θέμα τα πρώτα 10 - 3 μόρια /θέμα τα υπόλοιπα 10 (Άριστα: 50)</strong></span>
            <span>{timerEnabled ? '⏳ Χρονόμετρο: 60 λεπτά' : '⏳ Χρονόμετρο: Ανενεργό'}</span>
          </div>
        </div>

        {/* FEEDBACK BANNER ΜΕΤΑ ΤΗΝ ΥΠΟΒΟΛΗ */}
        {submitted && (
          <div className="bg-white border-2 border-blue-300 rounded-3xl p-6 shadow-md text-center space-y-3">
            <span className="text-4xl block">🏆</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Αποτέλεσμα Εξέτασης 2026
            </h2>
            <div className="inline-block bg-blue-50 border border-blue-200 px-6 py-2.5 rounded-2xl">
              <span className="text-xs font-bold text-blue-800 uppercase block">Τελικο Σκορ</span>
              <span className="text-3xl sm:text-4xl font-mono font-black text-blue-700">
                {score} / 50
              </span>
              <span className="text-xs font-bold text-slate-500 block mt-1">
                ({correctCount} σωστές στις 20 ερωτήσεις)
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                (Θέματα 21–30: 2 μόρια | Θέματα 31–40: 3 μόρια)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
              Δες παρακάτω αναλυτικά τις απαντήσεις σου με πλήρη μαθηματική τεκμηρίωση για κάθε θέμα.
            </p>
          </div>
        )}

        {/* LIST OF 20 QUESTIONS */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {QUESTIONS_2026.map((q, qIdx) => {
            const userChoice = answers[q.id];
            const isCorrect = userChoice === q.correctRaw;
            const pointsValue = qIdx < 10 ? 2 : 3;

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
                    <span className="bg-blue-100 text-blue-900 font-mono font-black text-xs px-3 py-1 rounded-xl">
                      Θέμα {q.officialNumber}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      {q.group}
                    </span>
                  </div>

                  {submitted && (
                    <span className="text-sm sm:text-base font-black">
                      {isCorrect ? `✅ +${pointsValue} μόρια` : '❌ 0 μόρια'}
                    </span>
                  )}
                </div>

                {/* ΕΚΦΩΝΗΣΗ */}
                <p className="text-sm sm:text-base text-slate-900 font-bold leading-relaxed whitespace-pre-line">
                  {q.promptText}
                </p>

                {/* ΕΙΔΙΚΟ COMPONENT ΕΚΦΩΝΗΣΗΣ (π.χ. Κλάσματα Θέματος 21) */}
                {q.customPromptComponent}

                {/* SVG ΕΑΝ ΥΠΑΡΧΕΙ */}
                {q.hasSvg && renderQuestionSvg(q.hasSvg)}

                {/* ΕΠΙΛΟΓΕΣ */}
                <div className={`grid gap-2 pt-1 ${q.options.length === 5 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userChoice === opt.raw;
                    let btnStyle = 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50';

                    if (submitted) {
                      if (opt.raw === q.correctRaw) {
                        btnStyle = 'bg-emerald-600 text-white border-emerald-600 shadow-sm font-black';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'bg-rose-600 text-white border-rose-600 font-black';
                      } else {
                        btnStyle = 'bg-slate-100 text-slate-400 border-slate-200 opacity-60';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-blue-600 text-white border-blue-600 shadow-sm font-black';
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={submitted}
                        onClick={() => handleSelect(q.id, opt.raw)}
                        className={`p-3 rounded-2xl border text-left text-xs sm:text-sm transition flex items-center gap-2.5 ${btnStyle}`}
                      >
                        <span className={`w-6 h-6 rounded-xl flex items-center justify-center font-mono font-black text-xs shrink-0 border ${
                          isSelected || (submitted && opt.raw === q.correctRaw)
                            ? 'bg-white/20 border-white/40 text-white'
                            : 'bg-slate-100 border-slate-200 text-slate-700'
                        }`}>
                          {opt.key}
                        </span>
                        <div className="font-bold leading-normal flex items-center">{opt.label}</div>
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
                className="w-full sm:w-auto bg-[#10b981] hover:bg-[#059669] text-white text-base md:text-lg font-black px-10 py-4 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5"
              >
                <span>🎯</span>
                <span>Οριστική Υποβολή ({answeredCount}/20)</span>
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
                🔄 Επανάληψη Εξέτασης
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
