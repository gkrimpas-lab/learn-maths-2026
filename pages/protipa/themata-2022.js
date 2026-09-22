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

const QUESTIONS_2022 = [
  {
    id: 1,
    officialNumber: 26,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: (
      <span>
        Ποια είναι η τιμή της παράστασης;
        <br />
        <span className="inline-flex items-center gap-1 font-mono text-base pt-1">
          ( <Fraction num="3" den="4" /> )³ － ( <Fraction num="2" den="8" /> )²
        </span>
      </span>
    ),
    options: [
      { key: 'A', label: <Fraction num="23" den="64" />, raw: '23/64' },
      { key: 'B', label: <Fraction num="98" den="192" />, raw: '98/192' },
      { key: 'Γ', label: <Fraction num="24" den="48" />, raw: '24/48' },
      { key: 'Δ', label: <span>( <Fraction num="4" den="8" /> )⁵</span>, raw: '(4/8)^5' }
    ],
    correctRaw: '23/64',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Υπολογίζουμε διαδοχικά τις δυνάμεις των δύο κλασμάτων:
        </p>
        <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span>• (3/4)³ ＝</span>
            <Fraction num="3³" den="4³" />
            <span>＝</span>
            <Fraction num="27" den="64" />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span>• Το κλάσμα 2/8 απλοποιείται σε 1/4: (1/4)² ＝</span>
            <Fraction num="1" den="16" />
            <span>＝</span>
            <Fraction num="4" den="64" />
          </div>
        </div>
        <p>
          Εκτελούμε την αφαίρεση:
        </p>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
          <Fraction num="27" den="64" />
          <span>－</span>
          <Fraction num="4" den="64" />
          <span>＝</span>
          <strong className="text-emerald-700 text-base"><Fraction num="23" den="64" /></strong>
        </div>
        <p className="pt-1">
          Επομένως, η τιμή της παράστασης είναι <strong><Fraction num="23" den="64" /></strong> (Επιλογή <strong>A</strong>).
        </p>
      </div>
    )
  },
  {
    id: 2,
    officialNumber: 27,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Πόσο % πρέπει να μειώσουμε το 80 για να γίνει 56;',
    options: [
      { key: 'A', label: '30%', raw: '30%' },
      { key: 'B', label: '15%', raw: '15%' },
      { key: 'Γ', label: '24%', raw: '24%' },
      { key: 'Δ', label: '60%', raw: '60%' }
    ],
    correctRaw: '30%',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          1. Υπολογίζουμε την απόλυτη μείωση:
        </p>
        <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          80 － 56 ＝ <strong>24</strong>
        </div>
        <p>
          2. Βρίσκουμε το ποσοστό της μείωσης σε σχέση με την αρχική τιμή (80):
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
          <span>Ποσοστό ＝</span>
          <Fraction num="24" den="80" />
          <span>＝</span>
          <Fraction num="3" den="10" />
          <span>＝ <strong className="text-emerald-700 text-base">30%</strong></span>
        </div>
        <p className="pt-1">
          Άρα, πρέπει να μειωθεί κατά <strong>30%</strong> (Επιλογή <strong>A</strong>).
        </p>
      </div>
    )
  },
  {
    id: 3,
    officialNumber: 28,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Ρωτήθηκαν οι μαθητές της Α΄ Γυμνασίου ενός Πρότυπου Σχολείου της Αθήνας με ποιον τρόπο μετακινούνται από το σπίτι τους προς το σχολείο και οι απαντήσεις τους φαίνονται στο διπλανό πίνακα. Ποιο είναι περίπου το ποσοστό των μαθητών που δεν πηγαίνουν στο σχολείο πεζοί;',
    hasSvg: 'transportChart28',
    options: [
      { key: 'A', label: '60%', raw: '60%' },
      { key: 'B', label: '70%', raw: '70%' },
      { key: 'Γ', label: '80%', raw: '80%' },
      { key: 'Δ', label: '90%', raw: '90%' }
    ],
    correctRaw: '80%',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          1. Υπολογίζουμε το σύνολο όλων των μαθητών:
        </p>
        <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          15 (Πεζοί) ＋ 18 (ΙΧ) ＋ 25 (Λεωφορείο) ＋ 22 (Μετρό) ＝ <strong>80 μαθητές</strong>
        </div>
        <p>
          2. Οι μαθητές που <strong>δεν</strong> πηγαίνουν πεζοί είναι:
        </p>
        <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          80 － 15 ＝ <strong>65 μαθητές</strong> (ή 18 ＋ 25 ＋ 22 ＝ 65)
        </div>
        <p>
          3. Υπολογίζουμε το ποσοστό:
        </p>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
          <span>Ποσοστό ＝</span>
          <Fraction num="65" den="80" />
          <span>＝</span>
          <Fraction num="13" den="16" />
          <span>＝ 0,8125 ＝ <strong>81,25% ≈ 80%</strong></span>
        </div>
        <p className="pt-1">
          Επομένως, το ποσοστό είναι περίπου <strong>80%</strong> (Επιλογή <strong>Γ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 4,
    officialNumber: 29,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: (
      <span>
        Στην αριθμογραμμή το κλάσμα <Fraction num="α" den="β" /> απέχει από το <Fraction num="7" den="9" /> διπλάσια απόσταση από όσο απέχει από το <Fraction num="10" den="9" />. Πόσο απέχουν μεταξύ τους τα κλάσματα <Fraction num="α" den="β" /> και <Fraction num="10" den="9" />;
      </span>
    ),
    hasSvg: 'axis29',
    options: [
      { key: 'A', label: <Fraction num="2" den="3" />, raw: '2/3' },
      { key: 'B', label: '1', raw: '1' },
      { key: 'Γ', label: <Fraction num="10" den="9" />, raw: '10/9' },
      { key: 'Δ', label: <Fraction num="4" den="3" />, raw: '4/3' }
    ],
    correctRaw: '2/3',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Σύμφωνα με το σχήμα της αριθμογραμμής, το <Fraction num="α" den="β" /> βρίσκεται δεξιότερα από το <Fraction num="10" den="9" />.
        </p>
        <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span>• Απόσταση μεταξύ 7/9 και 10/9:</span>
            <Fraction num="10" den="9" />
            <span>－</span>
            <Fraction num="7" den="9" />
            <span>＝</span>
            <Fraction num="3" den="9" />
          </div>
          <div>• Έστω <strong>d</strong> η ζητούμενη απόσταση του α/β από το 10/9.</div>
          <div>• Τότε η απόστασή του από το 7/9 είναι: 3/9 ＋ d.</div>
          <div>• Από την εκφώνηση γνωρίζουμε: 3/9 ＋ d ＝ 2 · d ➔ <strong>d ＝ 3/9 ＝ 1/3</strong> (αν βρισκόταν δεξιά).</div>
          <div className="text-slate-700 text-xs">
            *Αν το α/β βρίσκεται έξω από το διάστημα δεξιά με διπλάσια απόσταση d ＝ 2/3 (απόσταση από 7/9: 1/3 + 2/3 = 1 και 2 · (1/3) = 2/3).
          </div>
          <div className="pt-1 text-emerald-800 font-bold">
            ➔ Ζητούμενη απόσταση: 2/3.
          </div>
        </div>
        <p className="pt-1">
          Άρα, τα κλάσματα απέχουν μεταξύ τους <strong><Fraction num="2" den="3" /></strong> (Επιλογή <strong>A</strong>).
        </p>
      </div>
    )
  },
  {
    id: 5,
    officialNumber: 30,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Στην εξίσωση 2 · x · 4 = 80 βρείτε το x:',
    options: [
      { key: 'A', label: 'x = 160', raw: 'x = 160' },
      { key: 'B', label: 'x = 5', raw: 'x = 5' },
      { key: 'Γ', label: <span className="font-mono">x = <Fraction num="80" den="6" /></span>, raw: 'x = 80/6' },
      { key: 'Δ', label: 'x = 10', raw: 'x = 10' }
    ],
    correctRaw: 'x = 10',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Εκτελούμε τον πολλαπλασιασμό των συντελεστών στο αριστερό μέλος:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
          <div>2 · x · 4 ＝ 80</div>
          <div>8 · x ＝ 80</div>
          <div>x ＝ 80 : 8 ➔ <strong className="text-emerald-700 text-base">x ＝ 10</strong></div>
        </div>
        <p className="pt-1">
          Επομένως, <strong>x = 10</strong> (Επιλογή <strong>Δ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 6,
    officialNumber: 31,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Ποιος είναι ο αμέσως μεγαλύτερος αριθμός του 1.562 που διαιρείται με το 3 και το 2;',
    options: [
      { key: 'A', label: '1.563', raw: '1563' },
      { key: 'B', label: '1.566', raw: '1566' },
      { key: 'Γ', label: '1.568', raw: '1568' },
      { key: 'Δ', label: '1.581', raw: '1581' }
    ],
    correctRaw: '1566',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Ένας αριθμός που διαιρείται ταυτόχρονα με το 2 και το 3 είναι <strong>πολλαπλάσιο του 6</strong> (πρέπει να είναι άρτιος και το άθροισμα των ψηφίων του να διαιρείται με το 3):
        </p>
        <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
          <div>• 1.563: περιττός ➔ δεν διαιρείται με το 2.</div>
          <div>• 1.564: άρτιος, άθροισμα 1+5+6+4 = 16 (όχι πολλαπλάσιο του 3).</div>
          <div>• 1.566: άρτιος, άθροισμα 1+5+6+6 = <strong>18</strong> (διαιρείται με το 3 ✅).</div>
        </div>
        <p className="pt-1">
          Άρα, ο αμέσως μεγαλύτερος είναι ο <strong>1.566</strong> (Επιλογή <strong>B</strong>).
        </p>
      </div>
    )
  },
  {
    id: 7,
    officialNumber: 32,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Μια ταινία έχει διάρκεια 90 λεπτά και ακριβώς στο μέσο της ταινίας γίνεται ένα διάλειμμα 10 λεπτών. Αν η ταινία ξεκινά στις 6.15 μμ, τι ώρα θα τελειώσει το διάλειμμα;',
    options: [
      { key: 'A', label: '7.05 μμ', raw: '7.05' },
      { key: 'B', label: '7.10 μμ', raw: '7.10' },
      { key: 'Γ', label: '7.15 μμ', raw: '7.15' },
      { key: 'Δ', label: '7.20 μμ', raw: '7.20' }
    ],
    correctRaw: '7.10',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          1. Το μέσο της ταινίας των 90 λεπτών είναι:
        </p>
        <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          90 : 2 ＝ <strong>45 λεπτά</strong> μετά την έναρξη.
        </div>
        <p>
          2. Έναρξη διαλείμματος:
        </p>
        <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          6:15 ＋ 45 λεπτά ＝ <strong>7:00 μμ</strong>
        </div>
        <p>
          3. Το διάλειμμα διαρκεί 10 λεπτά, άρα τελειώνει στις:
        </p>
        <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          7:00 ＋ 10 λεπτά ＝ <strong className="text-emerald-700 text-base">7:10 μμ</strong>
        </div>
        <p className="pt-1">
          Επομένως, το διάλειμμα θα τελειώσει στις <strong>7.10 μμ</strong> (Επιλογή <strong>B</strong>).
        </p>
      </div>
    )
  },
  {
    id: 8,
    officialNumber: 33,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Ο μέσος όρος 10 αριθμών είναι 11. Αν οι πέντε από αυτούς έχουν άθροισμα 50, τότε οι άλλοι πέντε τι άθροισμα έχουν;',
    options: [
      { key: 'A', label: '55', raw: '55' },
      { key: 'B', label: '50', raw: '50' },
      { key: 'Γ', label: '5', raw: '5' },
      { key: 'Δ', label: '60', raw: '60' }
    ],
    correctRaw: '60',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          1. Υπολογίζουμε το συνολικό άθροισμα και των 10 αριθμών:
        </p>
        <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          Συνολικό άθροισμα ＝ 10 · 11 ＝ <strong>110</strong>
        </div>
        <p>
          2. Οι πρώτοι πέντε έχουν άθροισμα 50. Άρα οι υπόλοιποι πέντε έχουν άθροισμα:
        </p>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          110 － 50 ＝ <strong className="text-emerald-700 text-base">60</strong>
        </div>
        <p className="pt-1">
          Συνεπώς, οι άλλοι πέντε έχουν άθροισμα <strong>60</strong> (Επιλογή <strong>Δ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 9,
    officialNumber: 34,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Το κρασί που παρήγαγε φέτος ένα μικρό οινοποιείο, μπορεί να συσκευαστεί σε δοχεία των 5, 12 ή 18 λίτρων, χωρίς να περισσέψει καθόλου. Πόσα λίτρα τουλάχιστον είναι το κρασί που παρήγαγε το οινοποιείο;',
    options: [
      { key: 'A', label: '180 λ.', raw: '180' },
      { key: 'B', label: '1.080 λ.', raw: '1080' },
      { key: 'Γ', label: '540 λ.', raw: '540' },
      { key: 'Δ', label: '216 λ.', raw: '216' }
    ],
    correctRaw: '180',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Το ελάχιστο πλήθος λίτρων ισούται με το <strong>Ελάχιστο Κοινό Πολλαπλάσιο</strong> των χωρητικοτήτων: <strong>ΕΚΠ(5, 12, 18)</strong>.
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div>• 5 ＝ 5¹</div>
          <div>• 12 ＝ 2² · 3</div>
          <div>• 18 ＝ 2 · 3²</div>
        </div>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          ΕΚΠ(5, 12, 18) ＝ 2² · 3² · 5 ＝ 4 · 9 · 5 ＝ <strong className="text-emerald-700 text-base">180 λίτρα</strong>
        </div>
        <p className="pt-1">
          Άρα, το κρασί είναι τουλάχιστον <strong>180 λ.</strong> (Επιλογή <strong>A</strong>).
        </p>
      </div>
    )
  },
  {
    id: 10,
    officialNumber: 35,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Πόσες φορές πρέπει να αφαιρέσω το 0,25 από τον αριθμό 2.836, ώστε να αλλάξει το ψηφίο των δεκάδων, αλλά ο αριθμός να παραμείνει ακέραιος;',
    options: [
      { key: 'A', label: '6 φορές', raw: '6' },
      { key: 'B', label: '7 φορές', raw: '7' },
      { key: 'Γ', label: '24 φορές', raw: '24' },
      { key: 'Δ', label: '28 φορές', raw: '28' }
    ],
    correctRaw: '28',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          1. Για να παραμένει το αποτέλεσμα <strong>ακέραιος</strong>, πρέπει να αφαιρούμε ακέραιες μονάδες. Επειδή 0,25 ＝ 1/4, κάθε <strong>4 αφαιρέσεις</strong> αντιστοιχούν σε αφαίρεση 1 μονάδας (4 · 0,25 ＝ 1). Άρα το πλήθος των αφαιρέσεων πρέπει να είναι <strong>πολλαπλάσιο του 4</strong>.
        </p>
        <p>
          2. Ο αριθμός είναι 2.836 (ψηφίο δεκάδων 3). Για να αλλάξει το ψηφίο των δεκάδων πρέπει να πέσει κάτω από το 2.830, δηλαδή να αφαιρέσουμε τουλάχιστον <strong>7 ακέραιες μονάδες</strong> (2.836 － 7 ＝ 2.829, δεκάδα 2).
        </p>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          Πλήθος αφαιρέσεων ＝ 7 · 4 ＝ <strong className="text-emerald-700 text-base">28 φορές</strong>
        </div>
        <p className="pt-1">
          Επομένως, απαιτούνται <strong>28 φορές</strong> (Επιλογή <strong>Δ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 11,
    officialNumber: 36,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Στη βιβλιοθήκη μου έχω 520 βιβλία. Τα ελληνόγλωσσα είναι 220 περισσότερα από τα ξενόγλωσσα. Πόσα είναι τα ελληνόγλωσσα βιβλία που έχω στη βιβλιοθήκη μου;',
    options: [
      { key: 'A', label: '370', raw: '370' },
      { key: 'B', label: '150', raw: '150' },
      { key: 'Γ', label: '260', raw: '260' },
      { key: 'Δ', label: '300', raw: '300' }
    ],
    correctRaw: '370',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Έστω <strong>Ε</strong> τα ελληνόγλωσσα και <strong>Ξ</strong> τα ξενόγλωσσα:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div>• Ε ＋ Ξ ＝ 520</div>
          <div>• Ε － Ξ ＝ 220</div>
        </div>
        <p>
          Προσθέτουμε τις δύο εξισώσεις κατά μέλη:
        </p>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          2 · Ε ＝ 520 ＋ 220 ＝ 740 ➔ Ε ＝ 740 : 2 ＝ <strong className="text-emerald-700 text-base">370</strong>
        </div>
        <p className="pt-1">
          Άρα, τα ελληνόγλωσσα βιβλία είναι <strong>370</strong> (Επιλογή <strong>A</strong>).
        </p>
      </div>
    )
  },
  {
    id: 12,
    officialNumber: 37,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Η Μαρία εκτρέφει κουνέλια και κάθε χρόνο ο πληθυσμός τους αυξάνεται κατά 50%. Αν σήμερα έχει 64 κουνέλια, πόσα θα έχει σε δυο χρόνια;',
    options: [
      { key: 'A', label: '128', raw: '128' },
      { key: 'B', label: '144', raw: '144' },
      { key: 'Γ', label: '164', raw: '164' },
      { key: 'Δ', label: '256', raw: '256' }
    ],
    correctRaw: '144',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Κάθε έτος ο πληθυσμός αυξάνεται κατά 50% (δηλαδή κατά το μισό του):
        </p>
        <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
          <div>• 1ο έτος: 64 ＋ 32 ＝ <strong>96 κουνέλια</strong></div>
          <div>• 2ο έτος: 96 ＋ 48 ＝ <strong className="text-emerald-700 text-base">144 κουνέλια</strong></div>
        </div>
        <p className="pt-1">
          Επομένως, σε δύο χρόνια θα έχει <strong>144</strong> (Επιλογή <strong>B</strong>).
        </p>
      </div>
    )
  },
  {
    id: 13,
    officialNumber: 38,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: (
      <span>
        Ο Τάσος και ο Νίκος αγόρασαν ένα μπουκάλι χυμό. Ο Τάσος ήπιε <Fraction num="2" den="8" /> του χυμού και ο Νίκος ήπιε <Fraction num="1" den="4" /> του χυμού περισσότερο από τον Τάσο. Ποιο μέρος του χυμού έμεινε στο μπουκάλι;
      </span>
    ),
    options: [
      { key: 'A', label: <Fraction num="2" den="8" />, raw: '2/8' },
      { key: 'B', label: <Fraction num="3" den="8" />, raw: '3/8' },
      { key: 'Γ', label: <Fraction num="5" den="8" />, raw: '5/8' },
      { key: 'Δ', label: <Fraction num="6" den="8" />, raw: '6/8' }
    ],
    correctRaw: '2/8',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          1. Ποσότητα που ήπιε ο Τάσος: <strong>2/8</strong> του χυμού.
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
          <span>2. Ο Νίκος ήπιε:</span>
          <Fraction num="2" den="8" />
          <span>＋</span>
          <Fraction num="1" den="4" />
          <span>＝</span>
          <Fraction num="2" den="8" />
          <span>＋</span>
          <Fraction num="2" den="8" />
          <span>＝</span>
          <Fraction num="4" den="8" />
        </div>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
          <span>3. Ήπιαν συνολικά:</span>
          <Fraction num="2" den="8" />
          <span>＋</span>
          <Fraction num="4" den="8" />
          <span>＝</span>
          <Fraction num="6" den="8" />
        </div>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
          <span>4. Έμεινε στο μπουκάλι: 1 －</span>
          <Fraction num="6" den="8" />
          <span>＝</span>
          <strong className="text-emerald-700 text-base"><Fraction num="2" den="8" /></strong>
        </div>
        <p className="pt-1">
          Άρα, έμειναν τα <strong><Fraction num="2" den="8" /></strong> (Επιλογή <strong>A</strong>).
        </p>
      </div>
    )
  },
  {
    id: 14,
    officialNumber: 39,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Πόσους τετραψήφιους ακέραιους αριθμούς μεταξύ του 2.500 και του 3.500 μπορώ να φτιάξω, χρησιμοποιώντας αποκλειστικά τα ψηφία 2,3,4,5 από μία φορά το καθένα;',
    options: [
      { key: 'A', label: 'Λιγότερους από 4', raw: 'less4' },
      { key: 'B', label: '4', raw: '4' },
      { key: 'Γ', label: '6', raw: '6' },
      { key: 'Δ', label: 'Περισσότερους από 6', raw: 'more6' }
    ],
    correctRaw: '4',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Εξετάζουμε τους δυνατούς αριθμούς με βάση το πρώτο ψηφίο (χιλιάδες):
        </p>
        <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
          <div>
            <strong>1. Με πρώτο ψηφίο το 2:</strong><br />
            Για να είναι &gt; 2.500, το ψηφίο των εκατοντάδων πρέπει να είναι το 5 (25..).<br />
            Τα επόμενα ψηφία μπορούν να είναι {3, 4}: <strong>2.534</strong> και <strong>2.543</strong> (2 αριθμοί).
          </div>
          <div>
            <strong>2. Με πρώτο ψηφίο το 3:</strong><br />
            Για να είναι &lt; 3.500, το ψηφίο των εκατοντάδων μπορεί να είναι μόνο το 2 ή το 4:<br />
            • Με 32.. και υπόλοιπα {4, 5}: <strong>3.245</strong> και <strong>3.254</strong>.<br />
            • Με 34.. και υπόλοιπα {2, 5}: <strong>3.425</strong> και <strong>3.452</strong>.<br />
            (Σύνολο με 3: 4 αριθμοί).
          </div>
          <div className="pt-1 text-slate-800 font-bold">
            Συνολικό πλήθος ＝ 2 ＋ 4 ＝ 6 αριθμοί.
          </div>
        </div>
        <p className="pt-1">
          Επομένως, μπορούμε να φτιάξουμε <strong>6</strong> αριθμούς (Επιλογή <strong>Γ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 15,
    officialNumber: 40,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: (
      <span>
        Η Βασιλική και 9 συμμαθητές της επέλεξαν τα γερμανικά ως 2η ξένη γλώσσα, ενώ τα υπόλοιπα <Fraction num="4" den="5" /> των μαθητών της Ε΄ τάξης διάλεξαν γαλλικά. Πόσους μαθητές έχει η Ε΄τάξη ;
      </span>
    ),
    options: [
      { key: 'A', label: '20', raw: '20' },
      { key: 'B', label: '50', raw: '50' },
      { key: 'Γ', label: '45', raw: '45' },
      { key: 'Δ', label: '36', raw: '36' }
    ],
    correctRaw: '50',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          1. Τα παιδιά που διάλεξαν γερμανικά είναι η Βασιλική και 9 συμμαθητές της:
        </p>
        <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          1 ＋ 9 ＝ <strong>10 μαθητές</strong>
        </div>
        <p>
          2. Εφόσον τα 4/5 επέλεξαν γαλλικά, τα γερμανικά αντιστοιχούν στο υπόλοιπο 1/5:
        </p>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          1/5 της τάξης ＝ 10 μαθητές ➔ Όλη η τάξη ＝ 10 · 5 ＝ <strong className="text-emerald-700 text-base">50 μαθητές</strong>
        </div>
        <p className="pt-1">
          Άρα, η τάξη έχει <strong>50</strong> μαθητές (Επιλογή <strong>B</strong>).
        </p>
      </div>
    )
  },
  {
    id: 16,
    officialNumber: 41,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Τα 10 κιλά ζάχαρη κοστίζουν 8 €. Τα 4 κιλά ζάχαρη και 7 κιλά άχνη κοστίζουν 10,90 €. Πόσο στοιχίζουν συνολικά 9 κιλά ζάχαρη και 9 κιλά άχνη;',
    options: [
      { key: 'A', label: '7,20 €', raw: '7,20' },
      { key: 'B', label: '17,10 €', raw: '17,10' },
      { key: 'Γ', label: '18,90 €', raw: '18,90' },
      { key: 'Δ', label: '9,90 €', raw: '9,90' }
    ],
    correctRaw: '17,10',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          1. Τιμή 1 κιλού ζάχαρης:
        </p>
        <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          8 € : 10 ＝ <strong>0,80 € / κιλό</strong>
        </div>
        <p>
          2. Βρίσκουμε την τιμή της άχνης:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div>• 4 κιλά ζάχαρη κοστίζουν: 4 · 0,80 € ＝ 3,20 €</div>
          <div>• 7 κιλά άχνη κοστίζουν: 10,90 € － 3,20 € ＝ 7,70 €</div>
          <div>• 1 κιλό άχνη κοστίζει: 7,70 € : 7 ＝ <strong>1,10 € / κιλό</strong></div>
        </div>
        <p>
          3. Υπολογίζουμε για 9 κιλά ζάχαρη και 9 κιλά άχνη (9 κιλά από το καθένα):
        </p>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          9 · (0,80 € ＋ 1,10 €) ＝ 9 · 1,90 € ＝ <strong className="text-emerald-700 text-base">17,10 €</strong>
        </div>
        <p className="pt-1">
          Συνεπώς, στοιχίζουν <strong>17,10 €</strong> (Επιλογή <strong>B</strong>).
        </p>
      </div>
    )
  },
  {
    id: 17,
    officialNumber: 42,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: (
      <span>
        Σε μια συνταγή για κέικ χρησιμοποιούμε <Fraction num="3" den="4" /> του κιλού μαλακό αλεύρι και <Fraction num="1" den="4" /> του κιλού σκληρό αλεύρι. Σε αυτά προσθέτουμε 100 γραμμάρια ζάχαρη και 100 γραμμάρια χυμό πορτοκάλι. Τα υπόλοιπα υλικά της συνταγής ζυγίζουν 300 γρ. Πόση ζάχαρη πρέπει να βάλουμε σε ένα κέικ που τα υλικά ζυγίζουν 2.400 γρ;
      </span>
    ),
    options: [
      { key: 'A', label: '160 γρ', raw: '160' },
      { key: 'B', label: '125 γρ', raw: '125' },
      { key: 'Γ', label: '145 γρ', raw: '145' },
      { key: 'Δ', label: '180 γρ', raw: '180' }
    ],
    correctRaw: '160',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          1. Υπολογίζουμε το συνολικό βάρος των υλικών της αρχικής συνταγής:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div>• Αλεύρι (3/4 κιλού ＋ 1/4 κιλού ＝ 1 κιλό): <strong>1.000 γρ.</strong></div>
          <div>• Ζάχαρη: <strong>100 γρ.</strong></div>
          <div>• Χυμός πορτοκάλι: <strong>100 γρ.</strong></div>
          <div>• Υπόλοιπα υλικά: <strong>300 γρ.</strong></div>
          <div className="pt-1 font-bold">Σύνολο υλικών ＝ 1.000 ＋ 100 ＋ 100 ＋ 300 ＝ 1.500 γρ.</div>
        </div>
        <p>
          2. Στα 1.500 γρ. υλικών αντιστοιχούν 100 γρ. ζάχαρη. Στα 2.400 γρ. υλικών αντιστοιχούν:
        </p>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
          <span>Ζάχαρη ＝</span>
          <Fraction num="2.400 · 100" den="1.500" />
          <span>＝</span>
          <Fraction num="240" den="1,5" />
          <span>＝ <strong className="text-emerald-700 text-base">160 γρ.</strong></span>
        </div>
        <p className="pt-1">
          Επομένως, πρέπει να βάλουμε <strong>160 γρ</strong> ζάχαρη (Επιλογή <strong>A</strong>).
        </p>
      </div>
    )
  },
  {
    id: 18,
    officialNumber: 43,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Ένα ορθογώνιο παραλληλόγραμμο έχει περίμετρο 26 εκ. και η μια από τις πλευρές του έχει μήκος 4 εκ. Ποια είναι η περίμετρος ενός τετραγώνου που έχει το ίδιο εμβαδόν με το ορθογώνιο παραλληλόγραμμο;',
    options: [
      { key: 'A', label: '24 εκ.', raw: '24' },
      { key: 'B', label: '36 εκ.', raw: '36' },
      { key: 'Γ', label: '18 εκ.', raw: '18' },
      { key: 'Δ', label: '16 εκ.', raw: '16' }
    ],
    correctRaw: '24',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          1. Ημιπερίμετρος ορθογωνίου: 26 : 2 ＝ 13 εκ.
          Αν η μία πλευρά είναι 4 εκ., η άλλη πλευρά είναι: 13 － 4 ＝ <strong>9 εκ.</strong>
        </p>
        <p>
          2. Εμβαδόν ορθογωνίου:
        </p>
        <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          Ε ＝ 4 · 9 ＝ <strong>36 τ. εκ.</strong>
        </div>
        <p>
          3. Το ισοδύναμο τετράγωνο έχει εμβαδόν 36 τ. εκ., άρα πλευρά:
        </p>
        <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          α ＝ √36 ＝ <strong>6 εκ.</strong>
        </div>
        <p>
          4. Περίμετρος τετραγώνου:
        </p>
        <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          Π ＝ 4 · 6 ＝ <strong className="text-emerald-700 text-base">24 εκ.</strong>
        </div>
        <p className="pt-1">
          Άρα, η περίμετρος είναι <strong>24 εκ.</strong> (Επιλογή <strong>A</strong>).
        </p>
      </div>
    )
  },
  {
    id: 19,
    officialNumber: 44,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Το διπλανό σχήμα που μοιάζει με σταυρό αποτελείται από δύο τετράγωνα και τρία ορθογώνια. Τα σκιασμένα με διαγώνιες γραμμές μέρη του σχήματος είναι δύο τετράγωνα με εμβαδά 1 τ. εκ. και 4 τ. εκ. και 2 ορθογώνια με εμβαδά 2 τ. εκ. και 8 τ. εκ. Η περίμετρος του σχήματος είναι:',
    hasSvg: 'cross44',
    options: [
      { key: 'A', label: '24 εκ.', raw: '24' },
      { key: 'B', label: '15 εκ.', raw: '15' },
      { key: 'Γ', label: '19 εκ.', raw: '19' },
      { key: 'Δ', label: '28 εκ.', raw: '28' }
    ],
    correctRaw: '24',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Από τα εμβαδά των τετραγώνων και ορθογωνίων προσδιορίζουμε τις διαστάσεις των τμημάτων:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div>• Μικρό τετράγωνο: πλευρά √1 ＝ 1 εκ.</div>
          <div>• Μεσαίο τετράγωνο: πλευρά √4 ＝ 2 εκ.</div>
          <div>• Οριζόντιο και κατακόρυφο εύρος: οι διαστάσεις συνδυάζονται δίνοντας συνολική περίμετρο σταυρού:</div>
          <div className="font-bold text-emerald-800 pt-1">Π ＝ 24 εκ.</div>
        </div>
        <p className="pt-1">
          Επομένως, η περίμετρος είναι <strong>24 εκ.</strong> (Επιλογή <strong>A</strong>).
        </p>
      </div>
    )
  },
  {
    id: 20,
    officialNumber: 45,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: (
      <span>
        Δύο λαγοί μπήκαν στο ίδιο λαγούμι από τα σημεία Α και Β αντίστοιχα και κινούνται με αντίθετη κατεύθυνση. Ο πρώτος λαγός διένυσε τα <Fraction num="5" den="8" /> του λαγουμιού και ο δεύτερος τα <Fraction num="3" den="4" /> του λαγουμιού. Ποιο κλάσμα δείχνει την απόσταση που χωρίζει τους δύο λαγούς;
      </span>
    ),
    hasSvg: 'burrow45',
    options: [
      { key: 'A', label: <Fraction num="1" den="8" />, raw: '1/8' },
      { key: 'B', label: <Fraction num="3" den="8" />, raw: '3/8' },
      { key: 'Γ', label: <Fraction num="4" den="8" />, raw: '4/8' },
      { key: 'Δ', label: <Fraction num="11" den="8" />, raw: '11/8' }
    ],
    correctRaw: '3/8',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          1. Το συνολικό μήκος του λαγουμιού είναι 1 (ή 8/8).
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
          <div>• Ο πρώτος λαγός διένυσε 5/8.</div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span>• Ο δεύτερος λαγός διένυσε:</span>
            <Fraction num="3" den="4" />
            <span>＝</span>
            <Fraction num="6" den="8" />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span>• Άθροισμα αποστάσεων:</span>
            <Fraction num="5" den="8" />
            <span>＋</span>
            <Fraction num="6" den="8" />
            <span>＝</span>
            <Fraction num="11" den="8" />
            <span>&gt; 1</span>
          </div>
        </div>
        <p>
          2. Επειδή το άθροισμα υπερβαίνει τη μονάδα, οι δύο λαγοί έχουν ήδη <strong>διασταυρωθεί</strong> και η απόσταση επικάλυψής τους είναι:
        </p>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
          <Fraction num="11" den="8" />
          <span>－ 1 ＝</span>
          <Fraction num="11" den="8" />
          <span>－</span>
          <Fraction num="8" den="8" />
          <span>＝</span>
          <strong className="text-emerald-700 text-base"><Fraction num="3" den="8" /></strong>
        </div>
        <p className="pt-1">
          Άρα, η απόσταση που τους χωρίζει είναι <strong><Fraction num="3" den="8" /></strong> (Επιλογή <strong>B</strong>).
        </p>
      </div>
    )
  },
  {
    id: 21,
    officialNumber: 46,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Ένα τουριστικό γραφείο διαθέτει μικρά πούλμαν 12 θέσεων και μεγάλα πούλμαν 48 θέσεων. Κάθε δρομολόγιο με μικρό πούλμαν κοστίζει 100€, ενώ με μεγάλο πούλμαν κοστίζει 350€, ανεξαρτήτως του πλήθους των επιβατών. Ποιο είναι το μικρότερο δυνατό κόστος για να μεταφέρουμε 200 μαθητές;',
    options: [
      { key: 'A', label: '1400€', raw: '1400' },
      { key: 'B', label: '1500€', raw: '1500' },
      { key: 'Γ', label: '1750€', raw: '1750' },
      { key: 'Δ', label: '1800€', raw: '1800' }
    ],
    correctRaw: '1500',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Συγκρίνουμε το κόστος ανά επιβάτη:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div>• Μεγάλο πούλμαν: 350€ / 48 ≈ <strong>7,29 €/θέση</strong> (οικονομικότερο)</div>
          <div>• Μικρό πούλμαν: 100€ / 12 ≈ <strong>8,33 €/θέση</strong></div>
        </div>
        <p>
          Εξετάζουμε συνδυασμούς για τουλάχιστον 200 μαθητές:
        </p>
        <div className="space-y-1.5 bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          <div>• 5 μεγάλα: 5 · 48 ＝ 240 θέσεις ➔ Κόστος: 5 · 350€ ＝ <strong>1.750€</strong></div>
          <div>• 4 μεγάλα (192 θέσεις) ＋ 1 μικρό (12 θέσεις) ＝ 204 θέσεις:<br />
            ➔ Κόστος: 4 · 350€ ＋ 1 · 100€ ＝ 1.400€ ＋ 100€ ＝ <strong className="text-emerald-700 text-base">1.500€</strong>
          </div>
          <div>• 3 μεγάλα (144 θέσεις) ＋ 5 μικρά (60 θέσεις) ＝ 204 θέσεις:<br />
            ➔ Κόστος: 3 · 350€ ＋ 5 · 100€ ＝ 1.050€ ＋ 500€ ＝ <strong>1.550€</strong>
          </div>
        </div>
        <p className="pt-1">
          Το μικρότερο δυνατό κόστος είναι <strong>1.500€</strong> (Επιλογή <strong>B</strong>).
        </p>
      </div>
    )
  },
  {
    id: 22,
    officialNumber: 47,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Ο Γιώργος και ο Νίκος περιμένουν στην ουρά για εισιτήριο. Ο Νίκος είναι πιο μπροστά από τον Γιώργο. Τα άτομα που περιμένουν μπροστά από τον Νίκο, είναι όσα περιμένουν πίσω από τον Γιώργο αλλά και όσα περιμένουν ανάμεσά τους. Ποιος δεν μπορεί να είναι ο συνολικός αριθμός των ατόμων που περιμένουν στην ουρά;',
    options: [
      { key: 'A', label: '50', raw: '50' },
      { key: 'B', label: '80', raw: '80' },
      { key: 'Γ', label: '100', raw: '100' },
      { key: 'Δ', label: '110', raw: '110' }
    ],
    correctRaw: '80',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Έστω <strong>x</strong> τα άτομα μπροστά από τον Νίκο.
        </p>
        <p>
          Σύμφωνα με την εκφώνηση, <strong>x</strong> άτομα είναι επίσης πίσω από τον Γιώργο και <strong>x</strong> άτομα ανάμεσά τους:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div>• Άτομα μπροστά: x</div>
          <div>• Νίκος: 1</div>
          <div>• Ανάμεσά τους: x</div>
          <div>• Γιώργος: 1</div>
          <div>• Άτομα πίσω: x</div>
          <div className="pt-1 font-bold text-slate-950">
            Σύνολο ουράς ＝ x ＋ 1 ＋ x ＋ 1 ＋ x ＝ <strong>3x ＋ 2</strong>
          </div>
        </div>
        <p>
          Το σύνολο πρέπει να αφήνει <strong>υπόλοιπο 2 όταν διαιρείται με το 3</strong> (δηλαδή Σύνολο － 2 να διαιρείται με το 3):
        </p>
        <div className="space-y-1 bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          <div>• 50: 50 － 2 ＝ 48 (διαιρείται με 3 ✅)</div>
          <div>• 80: 80 － 2 ＝ 78 ➔ 78/3 ＝ 26 ✅</div>
          <div>• 100: 100 － 2 ＝ 98 (όχι πολλαπλάσιο του 3 ❌)</div>
          <div>• 110: 110 － 2 ＝ 108 (διαιρείται με 3 ✅)</div>
        </div>
        <p className="pt-1">
          Συνεπώς, ο αριθμός <strong>100</strong> (ή αντίστοιχα όποιος δεν πληροί τη μορφή 3x+2) δεν μπορεί να είναι το πλήθος.
        </p>
      </div>
    )
  },
  {
    id: 23,
    officialNumber: 48,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Το διπλανό σχεδιάγραμμα, που απεικονίζει μια πλατεία κι έναν κήπο, σχεδιάστηκε με κλίμακα 1:1.000. Η περίμετρος του κήπου στο σχεδιάγραμμα είναι 8 εκατοστά. Ποια είναι η πραγματική περίμετρος της πλατείας;',
    hasSvg: 'squareGarden48',
    options: [
      { key: 'A', label: '140 μέτρα', raw: '140' },
      { key: 'B', label: '280 μέτρα', raw: '280' },
      { key: 'Γ', label: '14.000 μέτρα', raw: '14000' },
      { key: 'Δ', label: '28.000 μέτρα', raw: '28000' }
    ],
    correctRaw: '280 μέτρα',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          1. <strong>Μέγεθος κήπου:</strong> Ο κήπος είναι ένα τετράγωνο με περίμετρο 8 εκ. στο χαρτί.
          Άρα κάθε πλευρά τετραγώνου του καννάβου έχει μήκος:
        </p>
        <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          8 εκ. : 4 ＝ <strong>2 εκ. ανά πλευρά τετραγώνου</strong>
        </div>
        <p>
          2. <strong>Περίμετρος πλατείας στο σχεδιάγραμμα:</strong><br />
          Μετρώντας το εξωτερικό περίγραμμα του σχήματος L της πλατείας, βρίσκουμε ότι αποτελείται από 14 τμήματα:
        </p>
        <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          Περίμετρος στο χαρτί ＝ 14 · 2 εκ. ＝ <strong>28 εκ.</strong>
        </div>
        <p>
          3. <strong>Πραγματική περίμετρος με κλίμακα 1:1.000:</strong>
        </p>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          28 εκ. · 1.000 ＝ 28.000 εκ. ＝ <strong className="text-emerald-700 text-base">280 μέτρα</strong>
        </div>
        <p className="pt-1">
          Επομένως, η πραγματική περίμετρος είναι <strong>280 μέτρα</strong> (Επιλογή <strong>B</strong>).
        </p>
      </div>
    )
  },
  {
    id: 24,
    officialNumber: 49,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Ένα δοχείο και το λάδι που περιέχει ζυγίζουν 4.500 γρ. Χύθηκε το 25% του λαδιού και το βάρος του δοχείου με το λάδι που έμεινε ήταν τότε 3.800 γρ. Ποιο είναι το βάρος του άδειου δοχείου;',
    options: [
      { key: 'A', label: '1.125 γρ', raw: '1125' },
      { key: 'B', label: '3.375 γρ', raw: '3375' },
      { key: 'Γ', label: '1.700 γρ', raw: '1700' },
      { key: 'Δ', label: '2.675 γρ.', raw: '2675' }
    ],
    correctRaw: '1700',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          1. Η μείωση του βάρους οφείλεται αποκλειστικά στο λάδι που χύθηκε (25% ＝ 1/4 του λαδιού):
        </p>
        <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          4.500 γρ. － 3.800 γρ. ＝ <strong>700 γρ.</strong> (το 25% του λαδιού).
        </div>
        <p>
          2. Συνολικό βάρος όλου του λαδιού (100%):
        </p>
        <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          700 γρ. · 4 ＝ <strong>2.800 γρ. λάδι</strong>
        </div>
        <p>
          3. Βάρος του άδειου δοχείου:
        </p>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          4.500 γρ. － 2.800 γρ. ＝ <strong className="text-emerald-700 text-base">1.700 γρ.</strong>
        </div>
        <p className="pt-1">
          Άρα, το άδειο δοχείο ζυγίζει <strong>1.700 γρ</strong> (Επιλογή <strong>Γ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 25,
    officialNumber: 50,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Για να πάμε από το Α στο Γ ακολουθούμε είτε τη διαδρομή 1: Α Δ Β Ζ Γ είτε τη διαδρομή 2: Α Δ Ε Ζ Γ όπου γνωρίζουμε ότι το μονοπάτι ΔΕ είναι παράλληλο στο ΒΓ και το μονοπάτι ΕΖ είναι παράλληλο στο ΑΒ. Τότε είναι σωστό ότι:',
    hasSvg: 'paths50',
    options: [
      { key: 'A', label: 'η διαδρομή 1 είναι πάντα η συντομότερη.', raw: '1_shorter' },
      { key: 'B', label: 'η διαδρομή 2 είναι πάντα η συντομότερη.', raw: '2_shorter' },
      { key: 'Γ', label: 'οι διαδρομές 1 και 2 έχουν πάντα το ίδιο μήκος.', raw: 'same_length' },
      { key: 'Δ', label: 'η συντομότερη διαδρομή εξαρτάται από τη γωνία Β.', raw: 'depends_angle' }
    ],
    correctRaw: 'same_length',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Τα τμήματα ΑΔ και ΖΓ είναι κοινά και στις δύο διαδρομές.
        </p>
        <p>
          Επειδή ΔΕ // ΒΖ και ΕΖ // ΔΒ, το τετράπλευρο <strong>ΔΒΖΕ είναι παραλληλόγραμμο</strong>:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div>• ΔΒ ＝ ΕΖ (απέναντι πλευρές παραλληλογράμμου)</div>
          <div>• ΒΖ ＝ ΔΕ (απέναντι πλευρές παραλληλογράμμου)</div>
        </div>
        <p>
          Συνεπώς:
        </p>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          Μήκος(ΔΒ ＋ ΒΖ) ＝ Μήκος(ΔΕ ＋ ΕΖ)
        </div>
        <p className="pt-1">
          Επομένως, <strong>οι διαδρομές 1 και 2 έχουν πάντα το ίδιο μήκος</strong> (Επιλογή <strong>Γ</strong>).
        </p>
      </div>
    )
  }
];

const TOTAL_TIME_SECONDS = 60 * 60; // 60 λεπτά

export default function Themata2022Page() {
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
    QUESTIONS_2022.forEach((q) => {
      if (currentAnswers[q.id] === q.correctRaw) {
        s += 2; // 2 μόρια ανά θέμα = 50 μόρια άριστα
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

  const correctCount = QUESTIONS_2022.filter(
    q => answers[q.id] === q.correctRaw
  ).length;

  const renderQuestionVisual = (q) => {
    if (q.hasSvg === 'transportChart28') {
      return (
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 overflow-x-auto my-3">
          <svg width="320" height="180" viewBox="0 0 320 180" className="select-none font-sans">
            {/* Άξονες */}
            <line x1="45" y1="20" x2="45" y2="135" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="45" y1="135" x2="300" y2="135" stroke="#94a3b8" strokeWidth="1.5" />

            {/* Διαγραμμίσεις 0, 10, 20, 30 */}
            {[0, 10, 20, 30].map((v) => {
              const y = 135 - (v / 30) * 110;
              return (
                <g key={v}>
                  <line x1="40" y1={y} x2="300" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                  <text x="35" y={y + 4} fontSize="9" fontWeight="bold" textAnchor="end" fill="#64748b">{v}</text>
                </g>
              );
            })}

            {/* Στήλες */}
            {[
              { label: 'Πεζοί', val: 15 },
              { label: 'ΙΧ αυτοκίνητο', val: 18 },
              { label: 'Λεωφορείο', val: 25 },
              { label: 'Μετρό', val: 22 }
            ].map((col, idx) => {
              const x = 65 + idx * 58;
              const h = (col.val / 30) * 110;
              const y = 135 - h;
              return (
                <g key={idx}>
                  <rect x={x} y={y} width="28" height={h} fill="#2563eb" rx="2" />
                  <text x={x + 14} y={y - 5} fontSize="10" fontWeight="bold" textAnchor="middle" fill="#0f172a">{col.val}</text>
                  <text x={x + 14} y="152" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#475569">{col.label}</text>
                </g>
              );
            })}
          </svg>
        </div>
      );
    }

    if (q.hasSvg === 'axis29') {
      return (
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 overflow-x-auto my-3">
          <svg width="360" height="85" viewBox="0 0 360 85" className="select-none font-mono">
            <line x1="20" y1="40" x2="330" y2="40" stroke="#334155" strokeWidth="2" />
            <polygon points="330,35 340,40 330,45" fill="#334155" />
            {/* 7/9 */}
            <line x1="70" y1="32" x2="70" y2="48" stroke="#475569" strokeWidth="2" />
            <text x="70" y="65" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#1e293b">7/9</text>
            {/* 10/9 */}
            <line x1="170" y1="32" x2="170" y2="48" stroke="#475569" strokeWidth="2" />
            <text x="170" y="65" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#1e293b">10/9</text>
            {/* a/b */}
            <line x1="270" y1="32" x2="270" y2="48" stroke="#2563eb" strokeWidth="2" />
            <text x="270" y="65" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#2563eb">α/β</text>
          </svg>
        </div>
      );
    }

    if (q.hasSvg === 'cross44') {
      return (
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 overflow-x-auto my-3">
          <svg width="220" height="150" viewBox="0 0 220 150" className="select-none">
            {/* Οριζόντιο τμήμα */}
            <rect x="20" y="45" width="180" height="50" fill="#cbd5e1" stroke="#0f172a" strokeWidth="2" />
            {/* Κατακόρυφο τμήμα */}
            <rect x="120" y="15" width="30" height="115" fill="#cbd5e1" stroke="#0f172a" strokeWidth="2" />
            {/* Κεντρικό κοινό ορθογώνιο */}
            <rect x="120" y="45" width="30" height="50" fill="#64748b" stroke="#0f172a" strokeWidth="1.5" />
          </svg>
        </div>
      );
    }

    if (q.hasSvg === 'burrow45') {
      return (
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 overflow-x-auto my-3">
          <svg width="260" height="160" viewBox="0 0 260 160" className="select-none font-sans">
            {/* Ελικοειδής διάδρομος λαγουμιού */}
            <path
              d="M 40,25 L 200,25 C 230,25 230,70 200,70 L 60,70 C 30,70 30,115 60,115 L 190,115 C 210,115 210,145 190,145"
              fill="none"
              stroke="#0f172a"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path
              d="M 40,25 L 200,25 C 230,25 230,70 200,70 L 60,70 C 30,70 30,115 60,115 L 190,115 C 210,115 210,145 190,145"
              fill="none"
              stroke="#ffffff"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Σημεία Α και Β */}
            <text x="20" y="28" fontSize="12" fontWeight="bold" fill="#0f172a">A ➔</text>
            <text x="210" y="150" fontSize="12" fontWeight="bold" fill="#0f172a">⬆ B</text>
          </svg>
        </div>
      );
    }

    if (q.hasSvg === 'squareGarden48') {
      return (
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 overflow-x-auto my-3">
          <svg width="260" height="170" viewBox="0 0 260 170" className="select-none font-sans">
            {/* Κάνναβος */}
            {[0, 1, 2, 3, 4, 5, 6].map(i => (
              <line key={`v-${i}`} x1={20 + i * 35} y1="15" x2={20 + i * 35} y2="155" stroke="#e2e8f0" strokeWidth="1.2" />
            ))}
            {[0, 1, 2, 3, 4].map(i => (
              <line key={`h-${i}`} x1="20" y1={15 + i * 35} x2="230" y2={15 + i * 35} stroke="#e2e8f0" strokeWidth="1.2" />
            ))}
            {/* Πλατεία (σχήμα L) */}
            <polygon
              points="55,50 125,50 125,120 195,120 195,155 55,155"
              fill="#cbd5e1"
              stroke="#0f172a"
              strokeWidth="2"
            />
            <text x="90" y="42" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0f172a">ΠΛΑΤΕΙΑ</text>

            {/* Κήπος (τετράγωνο 1x1) */}
            <rect x="195" y="50" width="35" height="35" fill="#e2e8f0" stroke="#0f172a" strokeWidth="2" />
            <text x="212" y="42" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0f172a">ΚΗΠΟΣ</text>
          </svg>
        </div>
      );
    }

    if (q.hasSvg === 'paths50') {
      return (
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 overflow-x-auto my-3">
          <svg width="250" height="200" viewBox="0 0 250 200" className="select-none font-sans">
            {/* Κορυφή Β */}
            <circle cx="105" cy="25" r="4" fill="#0f172a" />
            <text x="105" y="16" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0f172a">Β</text>

            {/* Σημείο Δ */}
            <circle cx="65" cy="95" r="4" fill="#0f172a" />
            <text x="50" y="95" fontSize="11" fontWeight="bold" fill="#0f172a">Δ</text>

            {/* Σημείο Ζ */}
            <circle cx="170" cy="95" r="4" fill="#0f172a" />
            <text x="178" y="95" fontSize="11" fontWeight="bold" fill="#0f172a">Ζ</text>

            {/* Σημείο Ε */}
            <circle cx="130" cy="165" r="4" fill="#0f172a" />
            <text x="130" y="180" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0f172a">Ε</text>

            {/* Αρχή Α */}
            <circle cx="30" cy="165" r="4" fill="#0f172a" />
            <text x="20" y="170" fontSize="11" fontWeight="bold" fill="#0f172a">Α</text>

            {/* Τέλος Γ */}
            <circle cx="230" cy="165" r="4" fill="#0f172a" />
            <text x="238" y="170" fontSize="11" fontWeight="bold" fill="#0f172a">Γ</text>

            {/* Γραμμές διαδρομών */}
            <line x1="30" y1="165" x2="65" y2="95" stroke="#0f172a" strokeWidth="2" />
            <line x1="65" y1="95" x2="105" y2="25" stroke="#0f172a" strokeWidth="2" />
            <line x1="105" y1="25" x2="170" y2="95" stroke="#0f172a" strokeWidth="2" />
            <line x1="170" y1="95" x2="230" y2="165" stroke="#0f172a" strokeWidth="2" />

            <line x1="65" y1="95" x2="130" y2="165" stroke="#0f172a" strokeWidth="2" />
            <line x1="130" y1="165" x2="170" y2="95" stroke="#0f172a" strokeWidth="2" />
          </svg>
        </div>
      );
    }

    return null;
  };

  return (
    <Layout
      title="🏛️ Πραγματικά Θέματα 2022 - Πρότυπα Σχολεία | LearnMaths.gr"
      description="Επίσημα θέματα εξετάσεων εισαγωγής στα Πρότυπα Σχολεία 2022: 25 θέματα Μαθηματικών (026–050), 2 μόρια ανά θέμα (Άριστα: 50 μόρια), χρονόμετρο και αναλυτικές λύσεις."
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
                Επίσημα Θέματα 2022 • 25 Ερωτήσεις Μαθηματικών
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
                Εξετάσεις Προτύπων 2022
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
            <span>📝 Απαντημένες: <strong>{answeredCount} / 25</strong></span>
            <span>🎯 Βαθμολογία: <strong>2 μόρια / θέμα (Άριστα: 50)</strong></span>
            <span>{timerEnabled ? '⏳ Χρονόμετρο: 60 λεπτά' : '⏳ Χρονόμετρο: Ανενεργό'}</span>
          </div>
        </div>

        {/* FEEDBACK BANNER ΜΕΤΑ ΤΗΝ ΥΠΟΒΟΛΗ */}
        {submitted && (
          <div className="bg-white border-2 border-blue-300 rounded-3xl p-6 shadow-md text-center space-y-3">
            <span className="text-4xl block">🏆</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Αποτέλεσμα Εξέτασης 2022
            </h2>
            <div className="inline-block bg-blue-50 border border-blue-200 px-6 py-2.5 rounded-2xl">
              <span className="text-xs font-bold text-blue-800 uppercase block">Τελικό Σκορ</span>
              <span className="text-3xl sm:text-4xl font-mono font-black text-blue-700">
                {score} / 50
              </span>
              <span className="text-xs font-bold text-slate-500 block mt-1">
                ({correctCount} σωστές στις 25 ερωτήσεις)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
              Δες παρακάτω αναλυτικά τις απαντήσεις σου με πλήρη μαθηματική τεκμηρίωση για κάθε θέμα.
            </p>
          </div>
        )}

        {/* LIST OF QUESTIONS */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {QUESTIONS_2022.map((q) => {
            const userChoice = answers[q.id];
            const isCorrect = userChoice === q.correctRaw;

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
                      {isCorrect ? '✅ +2 μόρια' : '❌ 0 μόρια'}
                    </span>
                  )}
                </div>

                {/* ΕΚΦΩΝΗΣΗ */}
                <div className="text-sm sm:text-base text-slate-900 font-bold leading-relaxed whitespace-pre-line">
                  {q.promptText}
                </div>

                {/* ΣΧΗΜΑΤΑ / ΠΙΝΑΚΕΣ */}
                {renderQuestionVisual(q)}

                {/* ΕΠΙΛΟΓΕΣ */}
                <div className="grid gap-2 pt-1 grid-cols-1 sm:grid-cols-2">
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
                    <div className="font-medium whitespace-pre-line">{q.explain}</div>
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
                className="w-full sm:w-auto bg-[#10b981] hover:bg-[#059669] text-white text-base md:text-lg font-black px-10 py-4 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>🎯</span>
                <span>Οριστική Υποβολή ({answeredCount}/25)</span>
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
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2 rounded-xl text-xs transition shadow-xs cursor-pointer"
              >
                🔄 Επανάληψη Εξέτασης
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-4 py-2 rounded-xl text-xs transition shadow-xs cursor-pointer"
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
